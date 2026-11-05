export const BASE = 'https://chabi.dev';
const TTL = 15 * 60 * 1000;
export class ChabiError extends Error {
  constructor(message, status = 0, code = '', upgradeUrl = '') {
    super(message); Object.assign(this, { status, code, upgradeUrl });
  }
}
export function details(error) {
  const body = error?.error?.error ?? error?.error ?? error;
  return {code: body?.code ?? body?.type ?? '', upgradeUrl: body?.upgrade_url ?? '',
    message: body?.message ?? error?.message ?? 'Chabi request failed.'};
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export function retryDelay(value) {
  if (!value) return 1000;
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, seconds * 1000) : Math.max(0, Date.parse(value) - Date.now()) || 1000;
}
export class ChabiAuth {
  constructor(config, env = globalThis) {
    this.config = config; this.env = env;
    this.key = `circuitmind:chabi:${config.clientId}:tokens`;
    this.prefix = `circuitmind:chabi:${config.clientId}:oauth:`;
  }
  read() { return JSON.parse(this.env.localStorage.getItem(this.key) || 'null'); }
  write(tokens) { this.env.localStorage.setItem(this.key, JSON.stringify(tokens)); }
  lock(fn) {
    if (!this.env.navigator.locks) throw new ChabiError('Chabi sign-in needs a browser with Web Locks on HTTPS (or localhost).');
    return this.env.navigator.locks.request('chabi-refresh', fn);
  }
  async signOut() { await this.lock(() => this.env.localStorage.removeItem(this.key)); }
  async tokenRequest(fields) {
    for (let attempt = 0; ; attempt++) {
      const response = await this.env.fetch(`${BASE}/oauth/token`, {
        method: 'POST', body: new URLSearchParams({...fields, client_id: this.config.clientId}),
      });
      if (response.status === 429 && attempt < 2) {
        await delay(retryDelay(response.headers.get('Retry-After'))); continue;
      }
      const body = await response.json();
      if (!response.ok) {
        const d = details(body);
        throw new ChabiError(d.message, response.status, typeof body.error === 'string' ? body.error : d.code);
      }
      if (!body.access_token || !body.refresh_token || !(Number(body.expires_in) > 0)) {
        throw new ChabiError('Chabi returned an incomplete sign-in. Please sign in again.');
      }
      return {...body, expires_at: Date.now() + Number(body.expires_in) * 1000};
    }
  }
  async signIn(navigate = url => this.env.location.assign(url)) {
    // Access localStorage and Web Locks before navigating; never weaken refresh safety.
    if (!this.config.clientId || !this.config.redirectUri) throw new ChabiError('The host needs to configure Chabi sign-in.');
    await this.lock(() => {});
    const random = size => this.env.crypto.getRandomValues(new Uint8Array(size));
    const encode = bytes => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
    const verifier = encode(random(32)), state = encode(random(32));
    const challenge = encode(new Uint8Array(await this.env.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
    for (const key of Object.keys(this.env.localStorage)) {
      if (key.startsWith(this.prefix)) {
        try { if (Date.now() - JSON.parse(this.env.localStorage.getItem(key)).time > TTL) this.env.localStorage.removeItem(key); }
        catch { this.env.localStorage.removeItem(key); }
      }
    }
    this.env.localStorage.setItem(this.prefix + state, JSON.stringify({verifier, time: Date.now(), redirectUri: this.config.redirectUri}));
    const params = new URLSearchParams({response_type: 'code', client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri, code_challenge: challenge, code_challenge_method: 'S256', state});
    navigate(`${BASE}/oauth/authorize?${params}`);
  }
  async callback() {
    const url = new URL(this.env.location.href);
    if (!url.searchParams.has('code') && !url.searchParams.has('error')) return;
    const state = url.searchParams.get('state'), code = url.searchParams.get('code'), error = url.searchParams.get('error');
    for (const key of ['code', 'state', 'error', 'error_description']) url.searchParams.delete(key);
    this.env.history.replaceState(null, '', url);
    return this.lock(async () => {
      const raw = state && this.env.localStorage.getItem(this.prefix + state);
      if (state) this.env.localStorage.removeItem(this.prefix + state);
      let saved;
      try { saved = JSON.parse(raw || 'null'); } catch { /* invalid state */ }
      if (!saved || !Number.isFinite(saved.time) || Date.now() - saved.time > TTL || saved.time > Date.now() || saved.redirectUri !== this.config.redirectUri) {
        throw new ChabiError('This sign-in did not start here or has expired. Please sign in again.');
      }
      if (error === 'access_denied') throw new ChabiError('You declined access. You can sign in whenever you’re ready.');
      if (error || !code) throw new ChabiError('Sign-in could not be completed. Please try again.');
      this.write(await this.tokenRequest({grant_type: 'authorization_code', code,
        redirect_uri: saved.redirectUri, code_verifier: saved.verifier}));
    });
  }
  async access(force = false, usedAccess = '') {
    const before = this.read();
    if (!before) throw new ChabiError('Sign in with Chabi to use AI.', 401);
    if (!force && before.expires_at > Date.now() + 60000) return before.access_token;
    if (force && usedAccess && before.access_token !== usedAccess) return before.access_token;
    return this.lock(async () => {
      const saved = this.read();
      if (!saved) throw new ChabiError('Please sign in with Chabi again.', 401);
      if (saved.refresh_token !== before.refresh_token || (!force && saved.expires_at > Date.now() + 60000)) return saved.access_token;
      try {
        const tokens = await this.tokenRequest({grant_type: 'refresh_token', refresh_token: saved.refresh_token});
        this.write(tokens); return tokens.access_token;
      } catch (error) {
        // An interrupted exchange may have consumed this single-use token too.
        this.env.localStorage.removeItem(this.key);
        throw new ChabiError('Your Chabi sign-in ended. Please sign in again.', 401, 'invalid_grant');
      }
    });
  }
  async authorized(operation) {
    let token = await this.access();
    for (let attempt = 0, refreshed = false; ; attempt++) {
      try { return await operation(token); }
      catch (error) {
        const d = details(error), status = error.status;
        if (status === 401 && d.code === 'invalid_token' && !refreshed) {
          token = await this.access(true, token); refreshed = true; continue;
        }
        if (status === 401) { await this.signOut(); throw new ChabiError('Your Chabi access ended. Please sign in again.', 401, d.code); }
        if (status === 429 && attempt < 3) {
          await delay(retryDelay(error.headers?.get?.('Retry-After'))); continue;
        }
        if (status === 402) throw new ChabiError('Your Chabi credits do not cover this request’s maximum cost. Add credits or try a smaller output limit.', 402, d.code, d.upgradeUrl);
        throw new ChabiError(status === 429 ? 'Chabi is busy. Please try again shortly.' : d.message, status, d.code, d.upgradeUrl);
      }
    }
  }
  async get(path) {
    return this.authorized(async token => {
      const response = await this.env.fetch(`${BASE}/v1/${path}`, {headers: {Authorization: `Bearer ${token}`}});
      const body = await response.json();
      if (!response.ok) throw Object.assign(new Error('Chabi request failed'), {status: response.status, error: body, headers: response.headers});
      return body;
    });
  }
}
