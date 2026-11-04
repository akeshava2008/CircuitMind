import Anthropic from '@anthropic-ai/sdk';
import { ChabiAuth, ChabiError } from './auth.js';

// One runtime per app/client survives Streamlit component rerenders.
const runtimeKey = Symbol.for("circuitmind.chabi.runtimes");
const runtimes = window[runtimeKey] ??= new Map();
const mountKey = Symbol.for("circuitmind.chabi.mounts");
const mounts = window[mountKey] ??= new WeakMap();
export default function(component) {
  const {data, parentElement, setStateValue, setTriggerValue} = component;
  // Streamlit can invoke the renderer again on the same host before unmounting
  // it. Dispose that host's previous view, not its injected styles or AI job.
  mounts.get(parentElement)?.();
  const config = {clientId: data.client_id, redirectUri: data.redirect_uri};
  const key = JSON.stringify(config);
  let rt = runtimes.get(key);
  if (!rt) {
    rt = {auth: new ChabiAuth(config), jobs: new Map(), message: '', ready: false};
    runtimes.set(key, rt);
    rt.init = rt.auth.callback().catch(e => { rt.message = e.message; }).finally(() => { rt.ready = true; });
  }
  rt.finished ??= new Set();
  const root = document.createElement('div');
  parentElement.append(root);
  let disposed = false, sentStatus;
  function render() {
    if (disposed) return;
    root.replaceChildren();
    let tokens;
    try { tokens = rt.auth.read(); } catch { rt.message = 'Allow browser local storage to use Chabi sign-in.'; }
    const signedIn = Boolean(tokens);
    if (data.signed_in !== signedIn && sentStatus !== signedIn) { sentStatus = signedIn; setStateValue('signed_in', signedIn); }
    if (data.signed_in === signedIn) sentStatus = undefined;
    const status = document.createElement('p');
    status.textContent = signedIn ? `Signed in with Chabi${rt.name ? ` · ${rt.name}` : ''}${rt.balance != null ? ` · ${rt.balance} credits` : ''}` : 'Use your own Chabi plan for AI features.';
    root.append(status);
    const button = document.createElement('button');
    button.textContent = signedIn ? 'Sign out' : 'Sign in with Chabi';
    button.disabled = !config.clientId || !config.redirectUri || !rt.ready;
    button.onclick = async () => {
      button.disabled = true;
      try {
        if (signedIn) { await rt.auth.signOut(); rt.name = null; rt.balance = null; rt.message = ''; render(); }
        else await rt.auth.signIn();
      } catch (e) { rt.message = e.message; render(); }
    };
    root.append(button);
    if (!config.clientId || !config.redirectUri) {
      const help = document.createElement('p'); help.textContent = 'The host needs to configure the Chabi client ID and redirect URI.'; root.append(help);
    }
    if (rt.message) { const message = document.createElement('p'); message.textContent = rt.message; root.append(message); }
    if (rt.upgradeUrl) {
      try {
        const url = new URL(rt.upgradeUrl);
        if (url.protocol === 'https:') {
          const link = document.createElement('a'); link.href = url.href; link.textContent = 'Manage Chabi credits';
          link.target = '_blank'; link.rel = 'noopener noreferrer'; root.append(link);
        }
      } catch { /* Never render an unsafe error URL. */ }
    }
    if (data.request && !rt.finished.has(data.request.id)) { const busy = document.createElement('p'); busy.textContent = 'Chabi is working…'; root.append(busy); }
  }
  async function account() {
    if (!rt.auth.read()) return;
    const [me, credits] = await Promise.allSettled([rt.auth.get('me'), rt.auth.get('credits')]);
    if (me.status === 'fulfilled') rt.name = me.value.name;
    if (credits.status === 'fulfilled') rt.balance = credits.value.balance_credits;
    render();
  }
  async function start() {
    await rt.init;
    if (disposed) return;
    render();
    if (data.request) {
      const req = data.request;
      if (!rt.jobs.has(req.id)) {
        rt.jobs.set(req.id, (async () => {
          try {
            rt.message = ''; rt.upgradeUrl = '';
            const response = await rt.auth.authorized(token => {
              const client = new Anthropic({apiKey: token, baseURL: 'https://chabi.dev', dangerouslyAllowBrowser: true, maxRetries: 0, timeout: 180000});
              const body = {model: req.model, max_tokens: req.max_tokens, system: req.system,
                messages: req.messages, output_config: {effort: req.response_schema ? 'medium' : 'low'}};
              if (req.response_schema) body.output_config.format = {type: 'json_schema', schema: req.response_schema};
              return client.messages.create(body);
            });
            return {id: req.id, text: response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim(), truncated: response.stop_reason === 'max_tokens'};
          } catch (e) {
            rt.message = e instanceof ChabiError ? e.message : 'Could not reach Chabi. Please try again.';
            rt.upgradeUrl = e.upgradeUrl || '';
            return {id: req.id, error: rt.message};
          } finally {
            rt.finished.add(req.id);
          }
        })());
      }
      const response = await rt.jobs.get(req.id);
      if (!disposed && rt.delivered !== req.id) { rt.delivered = req.id; setTriggerValue('response', response); }
      render();
      void account();
    } else {
      // Completed request data need not remain in browser memory.
      rt.jobs.clear();
      rt.finished.clear();
      void account();
    }
  }
  const onStorage = e => {
    if (e.key !== rt.auth.key) return;
    rt.name = null; rt.balance = null; render();
    if (rt.auth.read()) void account();
  };
  window.addEventListener('storage', onStorage);
  const timer = setInterval(async () => {
    try { if (rt.auth.read()) await rt.auth.access(); }
    catch (e) { rt.message = e.message; }
    render();
  }, 30000);
  render();
  void start().catch(e => { rt.message = e.message; render(); });
  const cleanup = () => {
    disposed = true;
    root.remove();
    clearInterval(timer);
    window.removeEventListener('storage', onStorage);
    if (mounts.get(parentElement) === cleanup) mounts.delete(parentElement);
  };
  mounts.set(parentElement, cleanup);
  return cleanup;
}
