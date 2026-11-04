import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {ChabiAuth, details} from '../src/auth.js';

function setup() {
  const storage = new Map();
  let tail = Promise.resolve(), url = new URL('http://localhost:8501/');
  const env = {crypto: webcrypto, localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key),
  }, navigator: {locks: {request: (_name, fn) => {
    const result = tail.then(fn); tail = result.catch(() => {}); return result;
  }}}, location: {get href() {return url.href;}, assign: value => {url = new URL(value);}},
  history: {replaceState: (_state, _title, value) => {url = new URL(value);}}};
  const config = {clientId:'test-client', redirectUri:'http://localhost:8501/'};
  const auth = new ChabiAuth(config, env);
  return {auth, env, config, setUrl: value => {url = new URL(value);}};
}
const tokens = (id = 'old', expires_at = 0) => ({access_token:`access-${id}`, refresh_token:`refresh-${id}`, expires_at});
const response = (body, status = 200) => ({ok: status < 400, status, json: async () => body, headers: new Headers()});

test('PKCE persists a verifier and state for a callback in another tab, consumed once', async () => {
  const {auth, env, config, setUrl} = setup();
  await auth.signIn();
  const authorize = new URL(env.location.href), state = authorize.searchParams.get('state');
  assert.equal(authorize.origin, 'https://chabi.dev');
  assert.equal(authorize.searchParams.get('code_challenge_method'), 'S256');
  const saved = JSON.parse(env.localStorage.getItem(auth.prefix + state));
  assert.match(saved.verifier, /^[A-Za-z0-9_-]{43,128}$/);
  assert.equal(authorize.searchParams.get('code_challenge'), Buffer.from(await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(saved.verifier))).toString('base64url'));
  env.fetch = async (_url, init) => {
    assert.equal(init.body.get('code_verifier'), saved.verifier);
    assert.equal(init.body.get('client_id'), config.clientId);
    assert.equal(env.localStorage.getItem(auth.prefix + state), null);
    assert.equal(new URL(env.location.href).searchParams.has('code'), false);
    return response({...tokens('new'), expires_in:3600});
  };
  setUrl(`http://localhost:8501/?code=test-code&state=${state}`);
  await new ChabiAuth(config, env).callback();
  assert.equal(auth.read().access_token, 'access-new');
  assert.ok(auth.read().expires_at > Date.now());
  setUrl(`http://localhost:8501/?code=test-code&state=${state}`);
  await assert.rejects(auth.callback(), /did not start here/);
});

test('missing, mismatched, expired and future state never exchange a code', async () => {
  for (const [state, saved] of [[null,null],['bad',null],['old',{time:Date.now()-900001}],['future',{time:Date.now()+100000}]]) {
    const {auth, env, setUrl} = setup();
    if(saved) env.localStorage.setItem(auth.prefix+state, JSON.stringify({...saved, redirectUri:auth.config.redirectUri}));
    env.fetch = () => assert.fail('must not exchange an untrusted callback');
    setUrl(`http://localhost:8501/?code=code${state ? '&state='+state : ''}`);
    await assert.rejects(auth.callback(), /did not start here/);
    assert.equal(new URL(env.location.href).searchParams.has('code'), false);
  }
});

test('declined consent has a friendly message and consumes state', async () => {
  const {auth, env, setUrl} = setup(); await auth.signIn();
  const state = new URL(env.location.href).searchParams.get('state');
  setUrl(`http://localhost:8501/?error=access_denied&state=${state}`);
  await assert.rejects(auth.callback(), /declined access/);
  assert.equal(env.localStorage.getItem(auth.prefix+state), null);
});

test('two tabs refresh once and save rotated credentials', async () => {
  const {auth, env, config} = setup(); auth.write(tokens()); let calls = 0;
  env.fetch = async () => {calls++; await new Promise(resolve => setTimeout(resolve, 5)); return response({...tokens('new'), expires_in:3600});};
  const tab2 = new ChabiAuth(config, env);
  assert.deepEqual(await Promise.all([auth.access(), tab2.access()]), ['access-new','access-new']);
  assert.equal(calls,1); assert.equal(auth.read().refresh_token,'refresh-new');
  // A late 401 from the old access token also uses the new token without refreshing again.
  assert.equal(await auth.access(true, 'access-old'), 'access-new'); assert.equal(calls,1);
});

test('refresh failure clears tokens and never retries a single-use token', async () => {
  const {auth, env} = setup(); auth.write(tokens()); let calls=0;
  env.fetch = async () => {calls++; return response({error:'invalid_grant'},400);};
  await assert.rejects(auth.access(), /sign in again/); assert.equal(auth.read(), null);
  await assert.rejects(auth.access(), /Sign in/); assert.equal(calls,1);
});

test('invalid_token refreshes once; revocation signs out; credits preserve upgrade link', async () => {
  const {auth, env} = setup(); auth.write(tokens('old', Date.now()+3600000));
  env.fetch = async () => response({...tokens('new'), expires_in:3600});
  let calls=0;
  const result = await auth.authorized(async token => {
    if(calls++===0) throw {status:401,error:{error:{code:'invalid_token'}}};
    return token;
  });
  assert.equal(result,'access-new');
  await assert.rejects(auth.authorized(async () => {throw {status:402,error:{error:{code:'insufficient_credits',upgrade_url:'https://chabi.dev/upgrade'}}};}), e => e.upgradeUrl==='https://chabi.dev/upgrade' && /maximum cost/.test(e.message));
  await assert.rejects(auth.authorized(async () => {throw {status:401,error:{error:{code:'grant_revoked'}}};}), /sign in again/);
  assert.equal(auth.read(),null);
});

test('rate limits honor Retry-After then retry, and absent locks fail closed', async () => {
  const {auth, env} = setup(); auth.write(tokens('old',Date.now()+3600000)); let calls=0;
  assert.equal(await auth.authorized(async () => {if(calls++===0) throw {status:429,headers:new Headers({'Retry-After':'0'})}; return 'ok';}), 'ok');
  assert.equal(calls,2);
  delete env.navigator.locks; auth.write(tokens());
  await assert.rejects(auth.access(), /Web Locks/);
});

test('both SDK and direct error envelopes are decoded', () => {
  assert.equal(details({error:{error:{code:'insufficient_credits'}}}).code,'insufficient_credits');
  assert.equal(details({error:{code:'invalid_token'}}).code,'invalid_token');
});
