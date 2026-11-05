import {test} from 'node:test';
import assert from 'node:assert/strict';

// Simulate the component host and Chabi HTTP boundary, keeping the actual SDK.
class Element {
  children = [];
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this);
    this.parent = null;
  }
  append(...children) {
    for (const child of children) {child.remove(); child.parent = this; this.children.push(child);}
  }
  replaceChildren(...children) {
    for (const child of [...this.children]) child.remove();
    this.append(...children);
  }
}
const storage = new Map();
const storageListeners = new Set();
globalThis.window = {
  addEventListener(name, listener) {if (name === 'storage') storageListeners.add(listener);},
  removeEventListener(name, listener) {if (name === 'storage') storageListeners.delete(listener);},
};
globalThis.document = {createElement: () => new Element()};
globalThis.localStorage = {getItem: key => storage.get(key) ?? null,
  setItem:(key,value)=>storage.set(key,value), removeItem:key=>storage.delete(key)};
globalThis.location = {href:'http://localhost:8501/'};
globalThis.history = {replaceState(){}};
const {default: mount} = await import('../src/component.js');
const settle = () => new Promise(resolve => setTimeout(resolve, 5));

test('component uses the official SDK with user token and delivers one job across remounts', async () => {
  storage.set('circuitmind:chabi:component-client:tokens', JSON.stringify({access_token:'user-token', refresh_token:'refresh', expires_at:Date.now()+3600000}));
  let aiCalls=0, finish;
  globalThis.fetch = async (url, init) => {
    const headers = new Headers(init?.headers);
    if(String(url).endsWith('/v1/messages')) {
      aiCalls++;
      assert.equal(headers.get('x-api-key'), 'user-token');
      const body = JSON.parse(init.body);
      assert.equal(body.model,'claude-sonnet-5-5');
      assert.equal(body.max_tokens,16000);
      assert.equal(body.output_config.format.type,'json_schema');
      await new Promise(resolve=>{finish=resolve;});
      return Response.json({id:'message', type:'message', role:'assistant', content:[{type:'text',text:'{"bom":[]}'}], stop_reason:'end_turn', usage:{input_tokens:1,output_tokens:1}});
    }
    assert.equal(headers.get('Authorization'), 'Bearer user-token');
    return Response.json(String(url).endsWith('/me') ? {name:'Test user'} : {balance_credits:42});
  };
  const data = {client_id:'component-client',redirect_uri:'http://localhost:8501/',signed_in:true,
    request:{id:'request-1',model:'claude-sonnet-5-5',max_tokens:16000,system:'system',messages:[{role:'user',content:'test'}],response_schema:{type:'object'}}};
  const received=[];
  const host = () => ({data,parentElement:new Element(),setStateValue(){},setTriggerValue:(_name,value)=>received.push(value)});
  const cleanup1 = mount(host()); await settle();
  cleanup1(); const cleanup2 = mount(host()); await settle();
  assert.equal(aiCalls,1);
  finish(); await settle(); await settle(); cleanup2();
  assert.equal(received.length,1); assert.equal(received[0].text,'{"bom":[]}');
  assert.equal(JSON.stringify(received).includes('user-token'),false);
});


test('repeated renders on one host keep one panel and listener while preserving styles', async () => {
  const parent = new Element(), style = new Element();
  parent.append(style);
  const cleanups = [];
  storage.set('circuitmind:chabi:rerender-client:tokens', JSON.stringify({access_token:'user-token', refresh_token:'refresh', expires_at:Date.now()+3600000}));
  const data = {client_id:'rerender-client', redirect_uri:'http://localhost:8501/', signed_in:true};
  for (let i=0; i<12; i++) {
    cleanups.push(mount({data, parentElement:parent, setStateValue(){}, setTriggerValue(){}}));
    await settle();
    assert.equal(parent.children.length, 2, 'one style node and one account panel');
    assert.equal(parent.children[0], style, 'Streamlit CSS must remain mounted');
    assert.equal(parent.children[1].children.filter(el => el.textContent === 'Sign out').length, 1);
    assert.equal(storageListeners.size, 1, 'rerenders must not accumulate storage listeners');
  }
  // Delayed cleanup from an older render must not remove the current panel.
  for (const cleanup of cleanups.slice(0,-1)) cleanup();
  assert.equal(parent.children.length,2);
  assert.equal(storageListeners.size,1);
  cleanups.at(-1)();
  assert.deepEqual(parent.children,[style]);
  assert.equal(storageListeners.size,0);
});

test('failed AI request clears busy state and is not resubmitted on a rerender', async () => {
  const client = 'failed-request-client';
  storage.set(`circuitmind:chabi:${client}:tokens`, JSON.stringify({access_token:'user-token', refresh_token:'refresh', expires_at:Date.now()+3600000}));
  let calls = 0;
  globalThis.fetch = async url => {
    if (String(url).endsWith('/v1/messages')) {
      calls++;
      return Response.json({error:{type:'invalid_request_error', message:'Schema is too complex for compilation.'}}, {status:400});
    }
    return Response.json(String(url).endsWith('/me') ? {name:'Test user'} : {balance_credits:42});
  };
  const parent = new Element(), received = [];
  const data = {client_id:client, redirect_uri:'http://localhost:8501/', signed_in:true,
    request:{id:'failed-request',model:'claude-sonnet-5-5',max_tokens:16000,system:'system',messages:[{role:'user',content:'test'}]}};
  const host = () => ({data,parentElement:parent,setStateValue(){},setTriggerValue:(_name,value)=>received.push(value)});
  const cleanup1 = mount(host());
  assert.ok(parent.children[0].children.some(el => el.textContent === 'Chabi is working…'));
  await settle(); await settle();
  assert.equal(received.length,1);
  assert.match(received[0].error,/Schema is too complex/);
  assert.ok(!parent.children[0].children.some(el => el.textContent === 'Chabi is working…'));
  const cleanup2 = mount(host()); await settle();
  assert.equal(calls,1);
  assert.ok(!parent.children[0].children.some(el => el.textContent === 'Chabi is working…'));
  cleanup1(); cleanup2();
});

test('sign-in opens an escaping tab synchronously before asynchronous PKCE work', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'locks');
  let releaseLock, destination, opened = false;
  Object.defineProperty(navigator, 'locks', {configurable:true, value:{request:(_name,fn) => new Promise(resolve => {releaseLock=()=>resolve(fn());})}});
  const popup = {opener:'app', location:{replace:url=>{destination=new URL(url);}}, close(){}};
  window.open = (url, target) => {assert.equal(url,'about:blank'); assert.equal(target,'_blank'); opened=true; return popup;};
  const parent = new Element();
  const cleanup = mount({data:{client_id:'popup-client',redirect_uri:'http://localhost:8501/',signed_in:false},parentElement:parent,setStateValue(){},setTriggerValue(){}});
  try {
    await settle();
    const button=parent.children[0].children.find(el=>el.textContent==='Sign in with Chabi');
    const click = button.onclick();
    assert.equal(opened,true, 'open must occur during the click before awaiting the lock');
    assert.equal(popup.opener,null);
    assert.equal(destination,undefined);
    releaseLock(); await click;
    assert.equal(destination.origin,'https://chabi.dev');
    assert.equal(destination.searchParams.get('client_id'),'popup-client');
    assert.ok(storage.has('circuitmind:chabi:popup-client:oauth:'+destination.searchParams.get('state')));
  } finally {
    cleanup(); delete window.open;
    if(descriptor) Object.defineProperty(navigator,'locks',descriptor); else delete navigator.locks;
  }
});

test('blocked sign-in tabs show an actionable message without navigating the app', async () => {
  window.open=()=>null;
  const parent = new Element();
  const cleanup=mount({data:{client_id:'blocked-client',redirect_uri:'http://localhost:8501/',signed_in:false},parentElement:parent,setStateValue(){},setTriggerValue(){}});
  try {
    await settle();
    await parent.children[0].children.find(el=>el.textContent==='Sign in with Chabi').onclick();
    assert.ok(parent.children[0].children.some(el=>el.textContent?.includes('Allow this app to open a sign-in tab')));
  } finally {cleanup(); delete window.open;}
});
