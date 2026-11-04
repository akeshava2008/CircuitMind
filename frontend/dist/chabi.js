// \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), r = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
};
// node_modules/@anthropic-ai/sdk/internal/tslib.mjs
function i(e, t, n, r, i) {
	if (r === "m") throw TypeError("Private method is not writable");
	if (r === "a" && !i) throw TypeError("Private accessor was defined without a setter");
	if (typeof t == "function" ? e !== t || !i : !t.has(e)) throw TypeError("Cannot write private member to an object whose class did not declare it");
	return r === "a" ? i.call(e, n) : i ? i.value = n : t.set(e, n), n;
}
function a(e, t, n, r) {
	if (n === "a" && !r) throw TypeError("Private accessor was defined without a getter");
	if (typeof t == "function" ? e !== t || !r : !t.has(e)) throw TypeError("Cannot read private member from an object whose class did not declare it");
	return n === "m" ? r : n === "a" ? r.call(e) : r ? r.value : t.get(e);
}
// node_modules/@anthropic-ai/sdk/internal/errors.mjs
function o(e) {
	return typeof e == "object" && !!e && ("name" in e && e.name === "AbortError" || "message" in e && String(e.message).includes("FetchRequestCanceledException"));
}
var s, c = t((() => {
	s = (e) => {
		if (e instanceof Error) return e;
		if (typeof e == "object" && e) {
			try {
				let t = Object.prototype.toString.call(e);
				if (t === "[object Error]" || t === "[object DOMException]") {
					let t = Error(e.message, e.cause ? { cause: e.cause } : {});
					return e.stack && (t.stack = e.stack), e.cause && !t.cause && (t.cause = e.cause), e.name && (t.name = e.name), t;
				}
			} catch {}
			try {
				return Error(JSON.stringify(e));
			} catch {}
		}
		return Error(e);
	};
})), l, u, d, f, p, m, h, g, _, v, y, ee, te, ne, b = t((() => {
	c(), l = /* @__PURE__ */ (() => {
		class e extends Error {}
		return e;
	})(), u = class e extends l {
		constructor(t, n, r, i, a) {
			super(`${e.makeMessage(t, n, r)}`), this.status = t, this.headers = i, this.requestID = i?.get("request-id"), this.workspaceID = i?.get("anthropic-workspace-id"), this.error = n, this.type = a ?? null;
		}
		static makeMessage(e, t, n) {
			let r = t?.message ? typeof t.message == "string" ? t.message : JSON.stringify(t.message) : t ? JSON.stringify(t) : n;
			return e && r ? `${e} ${r}` : e ? `${e} status code (no body)` : r || "(no status code or body)";
		}
		static generate(t, n, r, i) {
			if (!t || !i) return new f({
				message: r,
				cause: s(n)
			});
			let a = n, o = a?.error?.type;
			return t === 400 ? new h(t, a, r, i, o) : t === 401 ? new g(t, a, r, i, o) : t === 403 ? new _(t, a, r, i, o) : t === 404 ? new v(t, a, r, i, o) : t === 409 ? new y(t, a, r, i, o) : t === 422 ? new ee(t, a, r, i, o) : t === 429 ? new te(t, a, r, i, o) : t >= 500 ? new ne(t, a, r, i, o) : new e(t, a, r, i, o);
		}
	}, d = class extends u {
		constructor({ message: e } = {}) {
			super(void 0, void 0, e || "Request was aborted.", void 0);
		}
	}, f = class extends u {
		constructor({ message: e, cause: t }) {
			super(void 0, void 0, e || "Connection error.", void 0), t && (this.cause = t);
		}
	}, p = class extends f {
		constructor({ message: e } = {}) {
			super({ message: e ?? "Request timed out." });
		}
	}, m = class extends l {
		constructor(e, { cause: t } = {}) {
			super(e ?? "Retryable error."), t !== void 0 && (this.cause = t);
		}
	}, h = class extends u {}, g = class extends u {}, _ = class extends u {}, v = class extends u {}, y = class extends u {}, ee = class extends u {}, te = class extends u {}, ne = class extends u {};
}));
// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
b();
var re = /^[a-z][a-z0-9+.-]*:/i, ie = (e) => re.test(e), x = (e) => (x = Array.isArray, x(e)), ae = x;
function oe(e) {
	return typeof e == "object" ? e ?? {} : {};
}
function se(e) {
	if (!e) return !0;
	for (let t in e) return !1;
	return !0;
}
function ce(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
function le(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var ue = (e, t) => {
	if (typeof t != "number" || !Number.isInteger(t)) throw new l(`${e} must be an integer`);
	if (t < 0) throw new l(`${e} must be a positive integer`);
	return t;
}, de = (e) => {
	try {
		return JSON.parse(e);
	} catch {
		return;
	}
}, fe = (e, t) => new Promise((n) => {
	if (t?.aborted) return n();
	let r = () => {
		clearTimeout(i), n();
	}, i = setTimeout(() => {
		t?.removeEventListener("abort", r), n();
	}, e);
	t?.addEventListener("abort", r, { once: !0 });
}), pe = "0.135.0", me = () => typeof window < "u" && window.document !== void 0 && typeof navigator < "u";
function he() {
	return typeof Deno < "u" && Deno.build != null ? "deno" : typeof EdgeRuntime < "u" ? "edge" : Object.prototype.toString.call(globalThis.process === void 0 ? 0 : globalThis.process) === "[object process]" ? "node" : "unknown";
}
var ge = () => {
	let e = he();
	if (e === "deno") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": pe,
		"X-Stainless-OS": ye(Deno.build.os),
		"X-Stainless-Arch": ve(Deno.build.arch),
		"X-Stainless-Runtime": "deno",
		"X-Stainless-Runtime-Version": typeof Deno.version == "string" ? Deno.version : Deno.version?.deno ?? "unknown"
	};
	if (typeof EdgeRuntime < "u") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": pe,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": `other:${EdgeRuntime}`,
		"X-Stainless-Runtime": "edge",
		"X-Stainless-Runtime-Version": globalThis.process?.version ?? "unknown"
	};
	if (e === "node") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": pe,
		"X-Stainless-OS": ye(globalThis.process.platform ?? "unknown"),
		"X-Stainless-Arch": ve(globalThis.process.arch ?? "unknown"),
		"X-Stainless-Runtime": "node",
		"X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
	};
	let t = _e();
	return t ? {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": pe,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": `browser:${t.browser}`,
		"X-Stainless-Runtime-Version": t.version
	} : {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": pe,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": "unknown",
		"X-Stainless-Runtime-Version": "unknown"
	};
};
function _e() {
	if (typeof navigator > "u" || !navigator) return null;
	for (let { key: e, pattern: t } of [
		{
			key: "edge",
			pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "chrome",
			pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "firefox",
			pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "safari",
			pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
		}
	]) {
		let n = t.exec(navigator.userAgent);
		if (n) return {
			browser: e,
			version: `${n[1] || 0}.${n[2] || 0}.${n[3] || 0}`
		};
	}
	return null;
}
var ve = (e) => e === "x32" ? "x32" : e === "x86_64" || e === "x64" ? "x64" : e === "arm" ? "arm" : e === "aarch64" || e === "arm64" ? "arm64" : e ? `other:${e}` : "unknown", ye = (e) => (e = e.toLowerCase(), e.includes("ios") ? "iOS" : e === "android" ? "Android" : e === "darwin" ? "MacOS" : e === "win32" ? "Windows" : e === "freebsd" ? "FreeBSD" : e === "openbsd" ? "OpenBSD" : e === "linux" ? "Linux" : e ? `Other:${e}` : "Unknown"), be, xe = () => be ??= ge(), Se = /* @__PURE__ */ new WeakMap(), Ce = typeof globalThis.FinalizationRegistry == "function" ? new globalThis.FinalizationRegistry((e) => De(e)) : null;
function we(e, t) {
	return () => e.removeEventListener("abort", t);
}
function Te(e, t, n) {
	Se.set(e, we(t, n));
}
function Ee(e, t) {
	Se.has(t) && Ce?.register(e, t, t);
}
function De(e) {
	let t = Se.get(e);
	t && (Se.delete(e), Ce?.unregister(e), t());
}
// node_modules/@anthropic-ai/sdk/internal/shims.mjs
function Oe() {
	if (typeof fetch < "u") return fetch;
	throw Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function ke(...e) {
	let t = globalThis.ReadableStream;
	if (t === void 0) throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new t(...e);
}
function Ae(e) {
	let t = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
	return ke({
		start() {},
		async pull(e) {
			let { done: n, value: r } = await t.next();
			n ? e.close() : e.enqueue(r);
		},
		async cancel() {
			await t.return?.();
		}
	});
}
function je(e) {
	if (e[Symbol.asyncIterator]) return e[Symbol.asyncIterator]();
	let t = e.getReader();
	return {
		async next() {
			try {
				let e = await t.read();
				return e?.done && t.releaseLock(), e;
			} catch (e) {
				throw t.releaseLock(), e;
			}
		},
		async return() {
			let e = t.cancel();
			return t.releaseLock(), await e, {
				done: !0,
				value: void 0
			};
		}
	};
}
var Me = typeof FinalizationRegistry > "u" ? void 0 : /* @__PURE__ */ new FinalizationRegistry(async (e) => {
	try {
		await e.return?.();
	} catch {}
});
async function* Ne(e) {
	let t = je(e), n = {};
	Me?.register(n, t, n);
	try {
		for await (let e of { [Symbol.asyncIterator]: () => t }) yield e;
	} finally {
		Me?.unregister(n);
	}
}
async function Pe(e) {
	if (typeof e != "object" || !e) return;
	if (e[Symbol.asyncIterator]) {
		await e[Symbol.asyncIterator]().return?.();
		return;
	}
	let t = e.getReader(), n = t.cancel();
	t.releaseLock(), await n;
}
// node_modules/@anthropic-ai/sdk/internal/request-options.mjs
var Fe = ({ headers: e, body: t }) => ({
	bodyHeaders: { "content-type": "application/json" },
	body: JSON.stringify(t)
}), Ie = "1.10.0", Le = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function Re(e) {
	let t = /* @__PURE__ */ new Set([e]), n = /* @__PURE__ */ new Set(), r = e.match(Le);
	if (!r) return () => !1;
	let i = {
		major: +r[1],
		minor: +r[2],
		patch: +r[3],
		prerelease: r[4]
	};
	if (i.prerelease != null) return function(t) {
		return t === e;
	};
	function a(e) {
		return n.add(e), !1;
	}
	function o(e) {
		return t.add(e), !0;
	}
	return function(e) {
		if (t.has(e)) return !0;
		if (n.has(e)) return !1;
		let r = e.match(Le);
		if (!r) return a(e);
		let s = {
			major: +r[1],
			minor: +r[2],
			patch: +r[3],
			prerelease: r[4]
		};
		return s.prerelease != null || i.major !== s.major ? a(e) : i.major === 0 ? i.minor === s.minor && i.patch <= s.patch ? o(e) : a(e) : i.minor <= s.minor ? o(e) : a(e);
	};
}
var ze = Re(Ie), Be = Ie.split(".")[0], Ve = Symbol.for(`opentelemetry.js.api.${Be}`), He = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {};
function Ue() {
	return Object.defineProperty({}, "version", {
		value: Ie,
		enumerable: !0,
		writable: !1,
		configurable: !1
	});
}
function We(e, t, n, r = !1) {
	let i = He[Ve] = He[Ve] ?? Ue();
	if (!r && i[e]) {
		let t = /* @__PURE__ */ Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e}`);
		return n.error(t.stack || t.message), !1;
	}
	if (i.version !== "1.10.0") {
		let t = /* @__PURE__ */ Error(`@opentelemetry/api: Registration of version v${i.version} for ${e} does not match previously registered API v${Ie}`);
		return n.error(t.stack || t.message), !1;
	}
	return i[e] = t, n.debug(`@opentelemetry/api: Registered a global for ${e} v${Ie}.`), !0;
}
var Ge;
function Ke(e) {
	let t = He[Ve];
	if (t != null) {
		if (t !== Ge) {
			if (!t.version || !ze(t.version)) return;
			Ge = t;
		}
		return t[e];
	}
}
function qe(e, t) {
	t.debug(`@opentelemetry/api: Unregistering a global for ${e} v${Ie}.`);
	let n = He[Ve];
	n && delete n[e];
}
// node_modules/@opentelemetry/api/dist/diag/ComponentLogger.mjs
var Je = class {
	constructor(e) {
		this._namespace = e.namespace || "DiagComponentLogger";
	}
	debug(...e) {
		return Ye("debug", this._namespace, e);
	}
	error(...e) {
		return Ye("error", this._namespace, e);
	}
	info(...e) {
		return Ye("info", this._namespace, e);
	}
	warn(...e) {
		return Ye("warn", this._namespace, e);
	}
	verbose(...e) {
		return Ye("verbose", this._namespace, e);
	}
};
function Ye(e, t, n) {
	let r = Ke("diag");
	if (r) return r[e](t, ...n);
}
// node_modules/@opentelemetry/api/dist/diag/internal/logLevelLogger.mjs
function Xe(e, t) {
	e < 0 ? e = 0 : e > 9999 && (e = 9999), t ||= {};
	function n(n, r) {
		let i = t[n];
		return typeof i == "function" && e >= r ? i.bind(t) : function() {};
	}
	return {
		error: n("error", 30),
		warn: n("warn", 50),
		info: n("info", 60),
		debug: n("debug", 70),
		verbose: n("verbose", 80)
	};
}
// node_modules/@opentelemetry/api/dist/api/diag.mjs
var Ze = "diag", Qe = class e {
	static instance() {
		return this._instance ||= new e(), this._instance;
	}
	constructor() {
		function e(e) {
			return function(...t) {
				let n = Ke("diag");
				if (n) return n[e](...t);
			};
		}
		let t = this;
		t.setLogger = (e, n = { logLevel: 60 }) => {
			if (e === t) {
				let e = /* @__PURE__ */ Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
				return t.error(e.stack ?? e.message), !1;
			}
			typeof n == "number" && (n = { logLevel: n });
			let r = Ke("diag"), i = Xe(n.logLevel ?? 60, e);
			if (r && !n.suppressOverrideMessage) {
				let e = (/* @__PURE__ */ Error()).stack ?? "<failed to generate stacktrace>";
				r.warn(`Current logger will be overwritten from ${e}`), i.warn(`Current logger will overwrite one already registered from ${e}`);
			}
			return We("diag", i, t, !0);
		}, t.disable = () => {
			qe(Ze, t);
		}, t.createComponentLogger = (e) => new Je(e), t.verbose = e("verbose"), t.debug = e("debug"), t.info = e("info"), t.warn = e("warn"), t.error = e("error");
	}
}, $e = class e {
	constructor(e) {
		this._entries = e ? new Map(e) : /* @__PURE__ */ new Map();
	}
	getEntry(e) {
		let t = this._entries.get(e);
		if (t) return Object.assign({}, t);
	}
	getAllEntries() {
		return Array.from(this._entries.entries());
	}
	setEntry(t, n) {
		let r = new e(this._entries);
		return r._entries.set(t, n), r;
	}
	removeEntry(t) {
		let n = new e(this._entries);
		return n._entries.delete(t), n;
	}
	removeEntries(...t) {
		let n = new e(this._entries);
		for (let e of t) n._entries.delete(e);
		return n;
	}
	clear() {
		return new e();
	}
};
Qe.instance();
function et(e = {}) {
	return new $e(new Map(Object.entries(e)));
}
// node_modules/@opentelemetry/api/dist/context/context.mjs
function tt(e) {
	return Symbol.for(e);
}
var nt = new class e {
	constructor(t) {
		let n = this;
		n._currentContext = t ? new Map(t) : /* @__PURE__ */ new Map(), n.getValue = (e) => n._currentContext.get(e), n.setValue = (t, r) => {
			let i = new e(n._currentContext);
			return i._currentContext.set(t, r), i;
		}, n.deleteValue = (t) => {
			let r = new e(n._currentContext);
			return r._currentContext.delete(t), r;
		};
	}
}(), rt = {
	get(e, t) {
		if (e != null) return e[t];
	},
	keys(e) {
		return e == null ? [] : Object.keys(e);
	}
}, it = { set(e, t, n) {
	e != null && (e[t] = n);
} }, at = {
	traceId: "00000000000000000000000000000000",
	spanId: "0000000000000000",
	traceFlags: 0
}, ot = class {
	constructor(e = at) {
		this._spanContext = e;
	}
	spanContext() {
		return this._spanContext;
	}
	setAttribute(e, t) {
		return this;
	}
	setAttributes(e) {
		return this;
	}
	addEvent(e, t) {
		return this;
	}
	addLink(e) {
		return this;
	}
	addLinks(e) {
		return this;
	}
	setStatus(e) {
		return this;
	}
	updateName(e) {
		return this;
	}
	end(e) {}
	isRecording() {
		return !1;
	}
	recordException(e, t) {}
}, st = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1
]);
function ct(e, t) {
	if (typeof e != "string" || e.length !== t) return !1;
	let n = 0;
	for (let t = 0; t < e.length; t += 4) n += (st[e.charCodeAt(t)] | 0) + (st[e.charCodeAt(t + 1)] | 0) + (st[e.charCodeAt(t + 2)] | 0) + (st[e.charCodeAt(t + 3)] | 0);
	return n === t;
}
function lt(e) {
	return ct(e, 32) && e !== "00000000000000000000000000000000";
}
function ut(e) {
	return ct(e, 16) && e !== "0000000000000000";
}
function dt(e) {
	return lt(e.traceId) && ut(e.spanId);
}
function ft(e) {
	return new ot(e);
}
// node_modules/@opentelemetry/api/dist/context/NoopContextManager.mjs
var pt = class {
	active() {
		return nt;
	}
	with(e, t, n, ...r) {
		return t.call(n, ...r);
	}
	bind(e, t) {
		return t;
	}
	enable() {
		return this;
	}
	disable() {
		return this;
	}
	attach(e) {
		return { dispose() {} };
	}
}, mt = "context", ht = new pt(), gt = Object.freeze({ dispose: () => {} }), _t = class e {
	constructor() {
		this._attachUnsupportedWarned = !1;
	}
	static getInstance() {
		return this._instance ||= new e(), this._instance;
	}
	setGlobalContextManager(e) {
		return We(mt, e, Qe.instance());
	}
	active() {
		return this._getContextManager().active();
	}
	with(e, t, n, ...r) {
		return this._getContextManager().with(e, t, n, ...r);
	}
	bind(e, t) {
		return this._getContextManager().bind(e, t);
	}
	attach(e) {
		let t = this._getContextManager();
		return t.attach ? t.attach(e) : (this._attachUnsupportedWarned || (this._attachUnsupportedWarned = !0, Qe.instance().warn("The current ContextManager does not implement attach(). The context will not be attached. Use a ContextManager that supports attach() (e.g. AsyncLocalStorageContextManager) or use with()/bind() instead.")), gt);
	}
	_getContextManager() {
		return Ke(mt) || ht;
	}
	disable() {
		this._getContextManager().disable(), qe(mt, Qe.instance());
	}
}, vt = tt("OpenTelemetry Context Key SPAN");
function yt(e) {
	return e.getValue(vt) || void 0;
}
function bt() {
	return yt(_t.getInstance().active());
}
function xt(e, t) {
	return e.setValue(vt, t);
}
function St(e) {
	return e.deleteValue(vt);
}
function Ct(e, t) {
	return xt(e, new ot(t));
}
function wt(e) {
	return yt(e)?.spanContext();
}
// node_modules/@opentelemetry/api/dist/trace/NoopTracer.mjs
var Tt = _t.getInstance(), Et = class {
	startSpan(e, t, n = Tt.active()) {
		if (t?.root) return new ot();
		let r = n && wt(n);
		return Dt(r) && dt(r) ? new ot(r) : new ot();
	}
	startActiveSpan(e, t, n, r) {
		let i, a, o;
		if (arguments.length < 2) return;
		arguments.length === 2 ? o = t : arguments.length === 3 ? (i = t, o = n) : (i = t, a = n, o = r);
		let s = a ?? Tt.active(), c = this.startSpan(e, i, s), l = xt(s, c);
		return Tt.with(l, o, void 0, c);
	}
};
function Dt(e) {
	return typeof e == "object" && !!e && "spanId" in e && typeof e.spanId == "string" && "traceId" in e && typeof e.traceId == "string" && "traceFlags" in e && typeof e.traceFlags == "number";
}
// node_modules/@opentelemetry/api/dist/trace/ProxyTracer.mjs
var Ot = new Et(), kt = class {
	constructor(e, t, n, r) {
		this._provider = e, this.name = t, this.version = n, this.options = r;
	}
	startSpan(e, t, n) {
		return this._getTracer().startSpan(e, t, n);
	}
	startActiveSpan(e, t, n, r) {
		let i = this._getTracer();
		return Reflect.apply(i.startActiveSpan, i, arguments);
	}
	_getTracer() {
		if (this._delegate) return this._delegate;
		let e = this._provider.getDelegateTracer(this.name, this.version, this.options);
		return e ? (this._delegate = e, this._delegate) : Ot;
	}
}, At = /* @__PURE__ */ function(e) {
	return e[e.INTERNAL = 0] = "INTERNAL", e[e.SERVER = 1] = "SERVER", e[e.CLIENT = 2] = "CLIENT", e[e.PRODUCER = 3] = "PRODUCER", e[e.CONSUMER = 4] = "CONSUMER", e;
}({}), jt = /* @__PURE__ */ function(e) {
	return e[e.UNSET = 0] = "UNSET", e[e.OK = 1] = "OK", e[e.ERROR = 2] = "ERROR", e;
}({}), Mt = new class {
	getTracer(e, t, n) {
		return new Et();
	}
}(), Nt = class {
	getTracer(e, t, n) {
		return this.getDelegateTracer(e, t, n) ?? new kt(this, e, t, n);
	}
	getDelegate() {
		return this._delegate ?? Mt;
	}
	setDelegate(e) {
		this._delegate = e;
	}
	getDelegateTracer(e, t, n) {
		return this._delegate?.getTracer(e, t, n);
	}
}, S = _t.getInstance(), Pt = class {
	inject(e, t) {}
	extract(e, t) {
		return e;
	}
	fields() {
		return [];
	}
}, Ft = tt("OpenTelemetry Baggage Key");
function It(e) {
	return e.getValue(Ft) || void 0;
}
function Lt() {
	return It(_t.getInstance().active());
}
function Rt(e, t) {
	return e.setValue(Ft, t);
}
function zt(e) {
	return e.deleteValue(Ft);
}
// node_modules/@opentelemetry/api/dist/api/propagation.mjs
var Bt = "propagation", Vt = new Pt(), Ht = class e {
	constructor() {
		this.createBaggage = et, this.getBaggage = It, this.getActiveBaggage = Lt, this.setBaggage = Rt, this.deleteBaggage = zt;
	}
	static getInstance() {
		return this._instance ||= new e(), this._instance;
	}
	setGlobalPropagator(e) {
		return We(Bt, e, Qe.instance());
	}
	inject(e, t, n = it) {
		return this._getGlobalPropagator().inject(e, t, n);
	}
	extract(e, t, n = rt) {
		return this._getGlobalPropagator().extract(e, t, n);
	}
	fields() {
		return this._getGlobalPropagator().fields();
	}
	disable() {
		qe(Bt, Qe.instance());
	}
	_getGlobalPropagator() {
		return Ke(Bt) || Vt;
	}
}.getInstance(), Ut = "trace", Wt = class e {
	constructor() {
		this._proxyTracerProvider = new Nt(), this.wrapSpanContext = ft, this.isSpanContextValid = dt, this.deleteSpan = St, this.getSpan = yt, this.getActiveSpan = bt, this.getSpanContext = wt, this.setSpan = xt, this.setSpanContext = Ct;
	}
	static getInstance() {
		return this._instance ||= new e(), this._instance;
	}
	setGlobalTracerProvider(e) {
		let t = We(Ut, this._proxyTracerProvider, Qe.instance());
		return t && this._proxyTracerProvider.setDelegate(e), t;
	}
	getTracerProvider() {
		return Ke(Ut) || this._proxyTracerProvider;
	}
	getTracer(e, t) {
		return this.getTracerProvider().getTracer(e, t);
	}
	disable() {
		qe(Ut, Qe.instance()), this._proxyTracerProvider = new Nt();
	}
}.getInstance();
// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
function Gt(e) {
	let t = 0;
	for (let n of e) t += n.length;
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
var Kt;
function qt(e) {
	let t;
	return (Kt ??= (t = new globalThis.TextEncoder(), t.encode.bind(t)))(e);
}
var Jt;
function Yt(e) {
	let t;
	return (Jt ??= (t = new globalThis.TextDecoder(), t.decode.bind(t)))(e);
}
// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var C, w, Xt = /* @__PURE__ */ (() => {
	class e {
		constructor() {
			C.set(this, void 0), w.set(this, void 0), i(this, C, /* @__PURE__ */ new Uint8Array(), "f"), i(this, w, null, "f");
		}
		decode(e) {
			if (e == null) return [];
			let t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == "string" ? qt(e) : e;
			i(this, C, Gt([a(this, C, "f"), t]), "f");
			let n = [], r;
			for (; (r = Zt(a(this, C, "f"), a(this, w, "f"))) != null;) {
				if (r.carriage && a(this, w, "f") == null) {
					i(this, w, r.index, "f");
					continue;
				}
				if (a(this, w, "f") != null && (r.index !== a(this, w, "f") + 1 || r.carriage)) {
					n.push(Yt(a(this, C, "f").subarray(0, a(this, w, "f") - 1))), i(this, C, a(this, C, "f").subarray(a(this, w, "f")), "f"), i(this, w, null, "f");
					continue;
				}
				let e = a(this, w, "f") === null ? r.preceding : r.preceding - 1, t = Yt(a(this, C, "f").subarray(0, e));
				n.push(t), i(this, C, a(this, C, "f").subarray(r.index), "f"), i(this, w, null, "f");
			}
			return n;
		}
		flush() {
			return a(this, C, "f").length ? this.decode("\n") : [];
		}
	}
	return C = /* @__PURE__ */ new WeakMap(), w = /* @__PURE__ */ new WeakMap(), e.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]), e.NEWLINE_REGEXP = /\r\n|[\n\r]/g, e;
})();
function Zt(e, t) {
	for (let n = t ?? 0; n < e.length; n++) {
		if (e[n] === 10) return {
			preceding: n,
			index: n + 1,
			carriage: !1
		};
		if (e[n] === 13) return {
			preceding: n,
			index: n + 1,
			carriage: !0
		};
	}
	return null;
}
// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
var T = (e) => {
	if (globalThis.process !== void 0) return globalThis.process.env?.[e]?.trim() || void 0;
	if (globalThis.Deno !== void 0) return globalThis.Deno.env?.get?.(e)?.trim() || void 0;
}, Qt = "warn", $t = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
}, en = (e, t, n) => {
	if (e) {
		if (ce($t, e)) return e;
		n.warn(`${t} was set to ${JSON.stringify(e)}, expected one of ${JSON.stringify(Object.keys($t))}`);
	}
};
function tn() {}
function nn(e, t, n) {
	return !t || $t[e] > $t[n] ? tn : t[e].bind(t);
}
var rn = {
	error: tn,
	warn: tn,
	info: tn,
	debug: tn
}, an = /* @__PURE__ */ new WeakMap();
function on(e, t) {
	let n = an.get(e);
	if (n && n[0] === t) return n[1];
	let r = {
		error: nn("error", e, t),
		warn: nn("warn", e, t),
		info: nn("info", e, t),
		debug: nn("debug", e, t)
	};
	return an.set(e, [t, r]), r;
}
function E(e) {
	let t = e.logger, n = e.logLevel ?? "off";
	return t ? on(t, n) : rn;
}
var sn, cn;
function ln() {
	let e = T("ANTHROPIC_LOG");
	return cn && e === sn || (sn = e, cn = on(console, en(e, "process.env['ANTHROPIC_LOG']", on(console, "warn")) ?? "warn")), cn;
}
function un(e, t, n) {
	e.debug !== tn && e.debug(t, dn(n));
}
var dn = (e) => (e.options && (e.options = { ...e.options }, delete e.options.headers), e.headers &&= Object.fromEntries((e.headers instanceof Headers ? [...e.headers] : Object.entries(e.headers)).map(([e, t]) => [e, e.toLowerCase() === "authorization" || e.toLowerCase() === "proxy-authorization" || e.toLowerCase() === "api-key" || e.toLowerCase() === "x-api-key" || e.toLowerCase() === "cookie" || e.toLowerCase() === "set-cookie" ? "***" : t])), "retryOfRequestLogID" in e && (e.retryOfRequestLogID && (e.retryOf = e.retryOfRequestLogID), delete e.retryOfRequestLogID), e);
b(), c();
var fn, pn = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t, n) {
			this.iterator = e, fn.set(this, void 0), this.controller = t, i(this, fn, n, "f");
		}
		static rawEvents(e, t = new AbortController()) {
			return mn(e, t);
		}
		static fromSSEResponse(t, n, r) {
			let i = !1, a = r ? E(r) : console;
			async function* s() {
				if (i) throw new l("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
				i = !0;
				let e = !1;
				try {
					for await (let e of mn(t, n)) {
						if (e.event === "completion") try {
							yield JSON.parse(e.data);
						} catch (t) {
							throw a.error("Could not parse message into JSON:", e.data), a.error("From chunk:", e.raw), t;
						}
						if (e.event === "message_start" || e.event === "message_delta" || e.event === "message_stop" || e.event === "content_block_start" || e.event === "content_block_delta" || e.event === "content_block_stop" || e.event === "message" || e.event === "user.message" || e.event === "user.interrupt" || e.event === "user.tool_confirmation" || e.event === "user.custom_tool_result" || e.event === "user.tool_result" || e.event === "agent.message" || e.event === "agent.thinking" || e.event === "agent.tool_use" || e.event === "agent.tool_result" || e.event === "agent.mcp_tool_use" || e.event === "agent.mcp_tool_result" || e.event === "agent.custom_tool_use" || e.event === "agent.thread_context_compacted" || e.event === "session.status_running" || e.event === "session.status_idle" || e.event === "session.status_rescheduled" || e.event === "session.status_terminated" || e.event === "session.error" || e.event === "session.deleted" || e.event === "session.updated" || e.event === "span.model_request_start" || e.event === "span.model_request_end" || e.event === "span.outcome_evaluation_start" || e.event === "span.outcome_evaluation_ongoing" || e.event === "span.outcome_evaluation_end" || e.event === "user.define_outcome" || e.event === "agent.thread_message_received" || e.event === "agent.thread_message_sent" || e.event === "agent.session_thread_message_received" || e.event === "agent.session_thread_message_sent" || e.event === "session.thread_created" || e.event === "session.thread_status_created" || e.event === "session.thread_status_running" || e.event === "session.thread_status_idle" || e.event === "session.thread_status_rescheduled" || e.event === "session.thread_status_terminated" || e.event === "event_start" || e.event === "event_delta" || e.event === "system.message" || e.event === "workflow_run.created" || e.event === "workflow_run.status_running" || e.event === "workflow_run.status_idle" || e.event === "workflow_run.status_ended" || e.event === "workflow_run.error" || e.event === "workflow_run.phase_started" || e.event === "workflow_run.phase_ended") try {
							yield JSON.parse(e.data);
						} catch (t) {
							throw a.error("Could not parse message into JSON:", e.data), a.error("From chunk:", e.raw), t;
						}
						if (e.event !== "ping" && e.event === "error") {
							let n = de(e.data) ?? e.data, r = n?.error?.type;
							throw new u(void 0, n, void 0, t.headers, r);
						}
					}
					e = !0;
				} catch (e) {
					if (o(e)) return;
					throw e;
				} finally {
					e || n.abort(), De(n);
				}
			}
			return new e(s, n, r);
		}
		static fromReadableStream(t, n, r) {
			let i = !1;
			async function* a() {
				let e = new Xt(), n = Ne(t);
				for await (let t of n) for (let n of e.decode(t)) yield n;
				for (let t of e.flush()) yield t;
			}
			async function* s() {
				if (i) throw new l("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
				i = !0;
				let e = !1;
				try {
					for await (let t of a()) e || t && (yield JSON.parse(t));
					e = !0;
				} catch (e) {
					if (o(e)) return;
					throw e;
				} finally {
					e || n.abort(), De(n);
				}
			}
			return new e(s, n, r);
		}
		[(fn = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
			return this.iterator();
		}
		tee() {
			let t = [], n = [], r = this[Symbol.asyncIterator](), i = (e) => ({ next: () => {
				if (e.length === 0) {
					let e = r.next();
					t.push(e), n.push(e);
				}
				return e.shift();
			} });
			return [new e(() => i(t), this.controller, a(this, fn, "f")), new e(() => i(n), this.controller, a(this, fn, "f"))];
		}
		toReadableStream() {
			let e = this, t;
			return ke({
				async start() {
					t = e[Symbol.asyncIterator]();
				},
				async pull(e) {
					try {
						let { value: n, done: r } = await t.next();
						if (r) return e.close();
						let i = qt(JSON.stringify(n) + "\n");
						e.enqueue(i);
					} catch (t) {
						e.error(t);
					}
				},
				async cancel() {
					await t.return?.();
				}
			});
		}
	}
	return e;
})();
async function* mn(e, t) {
	if (!e.body) throw t.abort(), globalThis.navigator !== void 0 && globalThis.navigator.product === "ReactNative" ? new l("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new l("Attempted to iterate over a response with no body");
	let n = new hn(), r = new Xt(), i = Ne(e.body);
	for await (let e of i) for (let t of r.decode(e)) {
		let e = n.decode(t);
		e && (yield e);
	}
	for (let e of r.flush()) {
		let t = n.decode(e);
		t && (yield t);
	}
}
var hn = class {
	constructor() {
		this.event = null, this.data = [], this.chunks = [];
	}
	decode(e) {
		if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
			if (!this.event && !this.data.length) return null;
			let e = {
				event: this.event,
				data: this.data.join("\n"),
				raw: this.chunks
			};
			return this.event = null, this.data = [], this.chunks = [], e;
		}
		if (this.chunks.push(e), e.startsWith(":")) return null;
		let [t, n, r] = gn(e, ":");
		return r.startsWith(" ") && (r = r.substring(1)), t === "event" ? this.event = r : t === "data" && this.data.push(r), null;
	}
};
function gn(e, t) {
	let n = e.indexOf(t);
	return n === -1 ? [
		e,
		"",
		""
	] : [
		e.substring(0, n),
		t,
		e.substring(n + t.length)
	];
}
// node_modules/@anthropic-ai/sdk/internal/headers.mjs
var _n = Symbol.for("brand.privateNullableHeaders");
function* vn(e) {
	if (!e) return;
	if (_n in e) {
		let { values: t, nulls: n } = e;
		yield* t.entries();
		for (let e of n) yield [e, null];
		return;
	}
	let t = !1, n;
	e instanceof Headers ? n = e.entries() : ae(e) ? n = e : (t = !0, n = Object.entries(e ?? {}));
	for (let e of n) {
		let n = e[0];
		if (typeof n != "string") throw TypeError("expected header name to be a string");
		let r = ae(e[1]) ? e[1] : [e[1]], i = !1;
		for (let e of r) e !== void 0 && (t && !i && (i = !0, yield [n, yn]), yield [n, e]);
	}
}
var yn = Symbol("clear"), bn = /* @__PURE__ */ new Set(["x-stainless-helper"]), xn = (e, t) => {
	let n = e ? e.split(",").map((e) => e.trim()).filter(Boolean) : [];
	for (let e of t.split(",").map((e) => e.trim())) e && !n.includes(e) && n.push(e);
	return n.join(", ");
}, D = (e) => {
	let t = new Headers(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		let e = /* @__PURE__ */ new Set();
		for (let [i, a] of vn(r)) {
			let r = i.toLowerCase();
			if (bn.has(r)) {
				if (a === yn) continue;
				a === null ? (t.delete(i), n.add(r)) : (t.set(i, xn(t.get(i), a)), n.delete(r));
			} else (a === yn || !e.has(r)) && (t.delete(i), e.add(r), a === yn) || (a === null ? (t.delete(i), n.add(r)) : (t.append(i, a), n.delete(r)));
		}
	}
	return {
		[_n]: !0,
		values: t,
		nulls: n
	};
};
b(), c();
var Sn = "com.anthropic.sdk.typescript", Cn = "error.type", wn = "gen_ai.conversation.id", Tn = "gen_ai.provider.name", En = "http.request.method", Dn = "http.request.resend_count", On = "http.response.status_code", kn = "http.route", An = "server.address", jn = "server.port", Mn = "url.full", Nn = "url.path", Pn = "url.query", Fn = "url.scheme", In = "anthropic.session.thread.id", Ln = 75e4;
function Rn(e) {
	let { tracerProvider: t, propagation: n, traces: r } = e === !1 ? { traces: !1 } : e ?? zn(), { enabled: i, contentMode: a, maxContentBytes: o } = typeof r == "boolean" ? { enabled: r } : r ?? {};
	return Object.freeze({
		tracerProvider: t,
		propagation: n ?? !0,
		traces: Object.freeze({
			enabled: i ?? !0,
			contentMode: a === "content" ? "content" : "metadata_only",
			maxContentBytes: o !== void 0 && Number.isInteger(o) && o >= 1 ? o : Ln
		})
	});
}
function zn() {
	return {
		propagation: T("ANTHROPIC_OPEN_TELEMETRY_PROPAGATION")?.toLowerCase() !== "false",
		traces: {
			enabled: T("ANTHROPIC_OPEN_TELEMETRY")?.toLowerCase() !== "false",
			contentMode: T("ANTHROPIC_OPEN_TELEMETRY_TRACES_CONTENT_MODE")?.toLowerCase() === "content" ? "content" : "metadata_only",
			maxContentBytes: Number(/^\d+$/.exec(T("ANTHROPIC_OPEN_TELEMETRY_TRACES_MAX_CONTENT_BYTES") ?? "")?.[0] ?? NaN)
		}
	};
}
function Bn(e, t, n) {
	if (!e.traces.enabled) return;
	let r = n === void 0 ? Sn : `${Sn}.${n}`;
	return (e.tracerProvider ?? Wt.getTracerProvider()).getTracer(r, t);
}
function O(e, t) {
	try {
		return t();
	} catch (t) {
		e && E(e).debug("could not record telemetry", t);
		return;
	}
}
function k(e, t, n, r) {
	if (n?.__span) return n.__span;
	let i = e._tracer;
	if (i) return O(e, () => {
		let a = Date.now(), o = r?.attributes?.[In], s = n?.openTelemetry?.conversationId ?? (typeof o == "string" ? o : void 0), c = i.startSpan(t, {
			kind: At.CLIENT,
			attributes: {
				[Tn]: e._genAIProviderName,
				...Hn(e.baseURL),
				...s == null ? void 0 : { [wn]: s },
				...r?.route == null ? void 0 : { [kn]: r.route },
				...r?.attributes
			}
		});
		if (c.isRecording() || (e.openTelemetry.propagation ? Object.keys(Qn(c)).length > 0 : Wt.isSpanContextValid(c.spanContext()))) return {
			...r,
			span: c,
			name: t,
			startTime: a
		};
	});
}
function Vn(e, t) {
	if (e.createdIDAttribute === void 0 || typeof t != "object" || !t) return;
	let n = t[e.createdIDField ?? "id"];
	typeof n == "string" && e.span.setAttribute(e.createdIDAttribute, n);
}
function Hn(e) {
	try {
		let { hostname: t, port: n, protocol: r } = new URL(e);
		return {
			[An]: t.replace(/^\[(.*)\]$/, "$1"),
			[jn]: n ? Number(n) : r === "http:" ? 80 : 443
		};
	} catch {
		return {};
	}
}
function Un(e, t, n, r = !1) {
	if (e.attempts = (e.attempts ?? 0) + 1, e.attempts > 1) e.span.setAttribute(Dn, e.attempts - 1);
	else {
		e.span.setAttribute(En, t);
		try {
			let { protocol: t, host: i, pathname: a, search: o } = new URL(n), s = Gn(o.slice(1), e.queryParams, e.contentQueryParams);
			if (e.span.setAttributes({
				[Fn]: t.slice(0, -1),
				[Nn]: a
			}), s?.content && !r) return;
			e.span.setAttributes({
				...s === void 0 ? void 0 : { [Pn]: s.value },
				[Mn]: `${t}//${i}${a}${s === void 0 ? "" : `?${s.value}`}`
			});
		} catch {}
	}
}
var Wn = [
	"email",
	"path_prefix",
	"expected_content_sha256"
];
function Gn(e, t, n) {
	if (!e || !t?.length) return;
	let r = !1, i = e.split("&").filter((e) => {
		try {
			let i = decodeURIComponent(e.split("=", 1)[0]), a = t.includes(i) || !i.endsWith("[]") ? i : i.slice(0, -2);
			return t.includes(a) ? (r ||= Wn.includes(a) || !!n?.includes(a), !0) : !1;
		} catch {
			return !1;
		}
	});
	return i.length ? {
		value: i.join("&"),
		content: r
	} : void 0;
}
function Kn(e, t) {
	let n = D([t]).values;
	for (let [t, r] of Object.entries(Qn(e))) n.set(t, r);
	return n;
}
function qn(e, t) {
	if (e.isRecording()) {
		switch (Xn(e, t), t.status) {
			case "success":
				e.setStatus({ code: jt.OK });
				break;
			case "error": Zn(e, t.error);
		}
		e.end();
	}
}
function Jn(e, t, n) {
	let r = e[Symbol.asyncIterator], i = !1, a = (e) => {
		if (!i) {
			i = !0, t.removeEventListener("abort", o);
			try {
				n.onEnd(e);
			} catch {}
		}
	}, o = () => a({ reason: "canceled" });
	if (t.aborted) return o();
	t.addEventListener("abort", o, { once: !0 });
	let s = !1;
	e[Symbol.asyncIterator] = function() {
		let e = r.call(this);
		if (s) return e;
		s = !0, t.removeEventListener("abort", o);
		let c = {
			async next() {
				let r;
				try {
					r = await e.next();
				} catch (e) {
					throw a({
						reason: "failed",
						error: e
					}), e;
				}
				if (r.done) a({ reason: t.aborted ? "canceled" : "completed" });
				else if (!i) try {
					n.onItem?.(r.value);
				} catch {}
				return r;
			},
			async return(t) {
				return o(), await e.return?.(t) ?? {
					done: !0,
					value: t
				};
			},
			async throw(t) {
				if (o(), e.throw) return e.throw(t);
				throw t;
			},
			[Symbol.asyncIterator]: () => c
		};
		return c;
	};
}
function Yn(e, t, n) {
	if (!e.isRecording()) return;
	e.setAttribute(On, n.response.status);
	let r = t instanceof pn;
	Jn(t, n.controller.signal, { onEnd(t) {
		t.reason === "failed" ? Zn(e, t.error) : t.reason === "completed" && !r && e.setStatus({ code: jt.OK }), e.end();
	} });
}
function Xn(e, t) {
	let n = t.response?.status ?? (t.status === "error" && t.error instanceof u ? t.error.status : void 0);
	n !== void 0 && e.setAttribute(On, n);
}
function Zn(e, t, n) {
	t instanceof d || o(t) || (e.setStatus({ code: jt.ERROR }), e.setAttribute(Cn, n ?? $n(t)));
}
function Qn(e) {
	let t = {};
	return Ht.inject(Wt.setSpan(S.active(), e), t), t;
}
function $n(e) {
	if (e instanceof p) return "client_timeout_error";
	if (e instanceof f) return "connection_error";
	if (e instanceof u) {
		if (e.type) return e.type;
		if (e.status !== void 0) return String(e.status);
	}
	return "client_error";
}
// node_modules/@anthropic-ai/sdk/internal/qs/formats.mjs
var er = "RFC3986", tr = (e) => String(e), nr = {
	RFC1738: (e) => String(e).replace(/%20/g, "+"),
	RFC3986: tr
}, rr = (e, t) => (rr = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), rr(e, t)), ir = /* @__PURE__ */ (() => {
	let e = [];
	for (let t = 0; t < 256; ++t) e.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
	return e;
})(), ar = 1024, or = (e, t, n, r, i) => {
	if (e.length === 0) return e;
	let a = e;
	if (typeof e == "symbol" ? a = Symbol.prototype.toString.call(e) : typeof e != "string" && (a = String(e)), n === "iso-8859-1") return escape(a).replace(/%u[0-9a-f]{4}/gi, function(e) {
		return "%26%23" + parseInt(e.slice(2), 16) + "%3B";
	});
	let o = "";
	for (let e = 0; e < a.length; e += ar) {
		let t = a.length >= ar ? a.slice(e, e + ar) : a, n = [];
		for (let e = 0; e < t.length; ++e) {
			let r = t.charCodeAt(e);
			r === 45 || r === 46 || r === 95 || r === 126 || r >= 48 && r <= 57 || r >= 65 && r <= 90 || r >= 97 && r <= 122 || i === "RFC1738" && (r === 40 || r === 41) ? n[n.length] = t.charAt(e) : r < 128 ? n[n.length] = ir[r] : r < 2048 ? n[n.length] = ir[192 | r >> 6] + ir[128 | r & 63] : r < 55296 || r >= 57344 ? n[n.length] = ir[224 | r >> 12] + ir[128 | r >> 6 & 63] + ir[128 | r & 63] : (e += 1, r = 65536 + ((r & 1023) << 10 | t.charCodeAt(e) & 1023), n[n.length] = ir[240 | r >> 18] + ir[128 | r >> 12 & 63] + ir[128 | r >> 6 & 63] + ir[128 | r & 63]);
		}
		o += n.join("");
	}
	return o;
};
function sr(e) {
	return !e || typeof e != "object" ? !1 : !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e));
}
function cr(e, t) {
	if (x(e)) {
		let n = [];
		for (let r = 0; r < e.length; r += 1) n.push(t(e[r]));
		return n;
	}
	return t(e);
}
// node_modules/@anthropic-ai/sdk/internal/qs/stringify.mjs
var lr = {
	brackets(e) {
		return String(e) + "[]";
	},
	comma: "comma",
	indices(e, t) {
		return String(e) + "[" + t + "]";
	},
	repeat(e) {
		return String(e);
	}
}, ur = function(e, t) {
	Array.prototype.push.apply(e, x(t) ? t : [t]);
}, dr, A = {
	addQueryPrefix: !1,
	allowDots: !1,
	allowEmptyArrays: !1,
	arrayFormat: "indices",
	charset: "utf-8",
	charsetSentinel: !1,
	delimiter: "&",
	encode: !0,
	encodeDotInKeys: !1,
	encoder: or,
	encodeValuesOnly: !1,
	format: er,
	formatter: tr,
	indices: !1,
	serializeDate(e) {
		return (dr ??= Function.prototype.call.bind(Date.prototype.toISOString))(e);
	},
	skipNulls: !1,
	strictNullHandling: !1
};
function fr(e) {
	return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "symbol" || typeof e == "bigint";
}
var pr = {};
function mr(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _) {
	let v = e, y = _, ee = 0, te = !1;
	for (; (y = y.get(pr)) !== void 0 && !te;) {
		let t = y.get(e);
		if (ee += 1, t !== void 0) {
			if (t === ee) throw RangeError("Cyclic object value");
			te = !0;
		}
		y.get(pr) === void 0 && (ee = 0);
	}
	if (typeof l == "function" ? v = l(t, v) : v instanceof Date ? v = f?.(v) : n === "comma" && x(v) && (v = cr(v, function(e) {
		return e instanceof Date ? f?.(e) : e;
	})), v === null) {
		if (a) return c && !h ? c(t, A.encoder, g, "key", p) : t;
		v = "";
	}
	if (fr(v) || sr(v)) {
		if (c) {
			let e = h ? t : c(t, A.encoder, g, "key", p);
			return [m?.(e) + "=" + m?.(c(v, A.encoder, g, "value", p))];
		}
		return [m?.(t) + "=" + m?.(String(v))];
	}
	let ne = [];
	if (v === void 0) return ne;
	let b;
	if (n === "comma" && x(v)) h && c && (v = cr(v, c)), b = [{ value: v.length > 0 ? v.join(",") || null : void 0 }];
	else if (x(l)) b = l;
	else {
		let e = Object.keys(v);
		b = u ? e.sort(u) : e;
	}
	let re = s ? String(t).replace(/\./g, "%2E") : String(t), ie = r && x(v) && v.length === 1 ? re + "[]" : re;
	if (i && x(v) && v.length === 0) return ie + "[]";
	for (let t = 0; t < b.length; ++t) {
		let y = b[t], te = typeof y == "object" && y.value !== void 0 ? y.value : v[y];
		if (o && te === null) continue;
		let re = d && s ? y.replace(/\./g, "%2E") : y, ae = x(v) ? typeof n == "function" ? n(ie, re) : ie : ie + (d ? "." + re : "[" + re + "]");
		_.set(e, ee);
		let oe = /* @__PURE__ */ new WeakMap();
		oe.set(pr, _), ur(ne, mr(te, ae, n, r, i, a, o, s, n === "comma" && h && x(v) ? null : c, l, u, d, f, p, m, h, g, oe));
	}
	return ne;
}
function hr(e = A) {
	if (e.allowEmptyArrays !== void 0 && typeof e.allowEmptyArrays != "boolean") throw TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
	if (e.encodeDotInKeys !== void 0 && typeof e.encodeDotInKeys != "boolean") throw TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
	if (e.encoder !== null && e.encoder !== void 0 && typeof e.encoder != "function") throw TypeError("Encoder has to be a function.");
	let t = e.charset || A.charset;
	if (e.charset !== void 0 && e.charset !== "utf-8" && e.charset !== "iso-8859-1") throw TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
	let n = er;
	if (e.format !== void 0) {
		if (!rr(nr, e.format)) throw TypeError("Unknown format option provided.");
		n = e.format;
	}
	let r = nr[n], i = A.filter;
	(typeof e.filter == "function" || x(e.filter)) && (i = e.filter);
	let a;
	if (a = e.arrayFormat && e.arrayFormat in lr ? e.arrayFormat : "indices" in e ? e.indices ? "indices" : "repeat" : A.arrayFormat, "commaRoundTrip" in e && typeof e.commaRoundTrip != "boolean") throw TypeError("`commaRoundTrip` must be a boolean, or absent");
	let o = e.allowDots === void 0 ? e.encodeDotInKeys ? !0 : A.allowDots : !!e.allowDots;
	return {
		addQueryPrefix: typeof e.addQueryPrefix == "boolean" ? e.addQueryPrefix : A.addQueryPrefix,
		allowDots: o,
		allowEmptyArrays: typeof e.allowEmptyArrays == "boolean" ? !!e.allowEmptyArrays : A.allowEmptyArrays,
		arrayFormat: a,
		charset: t,
		charsetSentinel: typeof e.charsetSentinel == "boolean" ? e.charsetSentinel : A.charsetSentinel,
		commaRoundTrip: !!e.commaRoundTrip,
		delimiter: e.delimiter === void 0 ? A.delimiter : e.delimiter,
		encode: typeof e.encode == "boolean" ? e.encode : A.encode,
		encodeDotInKeys: typeof e.encodeDotInKeys == "boolean" ? e.encodeDotInKeys : A.encodeDotInKeys,
		encoder: typeof e.encoder == "function" ? e.encoder : A.encoder,
		encodeValuesOnly: typeof e.encodeValuesOnly == "boolean" ? e.encodeValuesOnly : A.encodeValuesOnly,
		filter: i,
		format: n,
		formatter: r,
		serializeDate: typeof e.serializeDate == "function" ? e.serializeDate : A.serializeDate,
		skipNulls: typeof e.skipNulls == "boolean" ? e.skipNulls : A.skipNulls,
		sort: typeof e.sort == "function" ? e.sort : null,
		strictNullHandling: typeof e.strictNullHandling == "boolean" ? e.strictNullHandling : A.strictNullHandling
	};
}
function gr(e, t = {}) {
	let n = e, r = hr(t), i, a;
	typeof r.filter == "function" ? (a = r.filter, n = a("", n)) : x(r.filter) && (a = r.filter, i = a);
	let o = [];
	if (typeof n != "object" || !n) return "";
	let s = lr[r.arrayFormat], c = s === "comma" && r.commaRoundTrip;
	i ||= Object.keys(n), r.sort && i.sort(r.sort);
	let l = /* @__PURE__ */ new WeakMap();
	for (let e = 0; e < i.length; ++e) {
		let t = i[e];
		r.skipNulls && n[t] === null || ur(o, mr(n[t], t, s, c, r.allowEmptyArrays, r.strictNullHandling, r.skipNulls, r.encodeDotInKeys, r.encode ? r.encoder : null, r.filter, r.sort, r.allowDots, r.serializeDate, r.format, r.formatter, r.encodeValuesOnly, r.charset, l));
	}
	let u = o.join(r.delimiter), d = r.addQueryPrefix === !0 ? "?" : "";
	return r.charsetSentinel && (r.charset === "iso-8859-1" ? d += "utf8=%26%2310003%3B&" : d += "utf8=%E2%9C%93&"), u.length > 0 ? d + u : "";
}
// node_modules/@anthropic-ai/sdk/internal/utils/query.mjs
function _r(e) {
	return gr(e, { arrayFormat: "brackets" });
}
// node_modules/@anthropic-ai/sdk/internal/node.browser.mjs
var vr = /* @__PURE__ */ r({
	child_process: () => br,
	crypto: () => xr,
	fs: () => Sr,
	os: () => Cr,
	path: () => wr,
	stream: () => Tr,
	util: () => Er
});
function yr(e) {
	return new Proxy({}, { get(t, n) {
		if (typeof n != "symbol") throw new l(`\`${e}.${n}\` is not available in this environment; it needs a Node.js-compatible runtime`);
	} });
}
var br, xr, Sr, Cr, wr, Tr, Er, Dr = t((() => {
	b(), br = /* @__PURE__ */ yr("child_process"), xr = /* @__PURE__ */ yr("crypto"), Sr = /* @__PURE__ */ yr("fs"), Cr = /* @__PURE__ */ yr("os"), wr = /* @__PURE__ */ yr("path"), Tr = /* @__PURE__ */ yr("stream"), Er = /* @__PURE__ */ yr("util");
}));
// node_modules/@anthropic-ai/sdk/lib/credentials/types.mjs
b();
var Or = "urn:ietf:params:oauth:grant-type:jwt-bearer", kr = "refresh_token", Ar = "/v1/oauth/token", jr = "oauth-2025-04-20", Mr = "oidc-federation-2026-04-01", Nr = 1 << 20;
function Pr(e) {
	if (!e) return;
	let t;
	try {
		t = new URL(e);
	} catch (t) {
		throw new M(`Invalid token endpoint base URL "${e}": ${t}`);
	}
	if (t.protocol === "https:") return;
	let n = t.hostname.toLowerCase().replace(/^\[|\]$/g, "");
	if (t.protocol !== "http:" || n !== "localhost" && n !== "127.0.0.1" && n !== "::1") throw new M(`Refusing to send credential over non-https token endpoint "${e}"`);
}
async function Fr(e, t) {
	let n = await Br(e), r;
	try {
		r = JSON.parse(n);
	} catch {
		throw new M(`Token endpoint returned non-JSON response (status ${e.status})`, e.status, j(n), t);
	}
	if (!r.access_token) throw new M(`Token endpoint response missing access_token: ${JSON.stringify(j(r))}`, e.status, j(r), t);
	if (r.token_type && r.token_type.toLowerCase() !== "bearer") throw new M(`Token endpoint response: unsupported token_type "${r.token_type}" (want Bearer)`, e.status, j(r), t);
	return r;
}
var Ir = 2e3, Lr = /* @__PURE__ */ new Set([
	"error",
	"error_description",
	"error_uri"
]);
function j(e) {
	if (e == null) return e;
	if (typeof e == "string") {
		let t;
		try {
			t = JSON.parse(e);
		} catch {
			return e.length <= Ir ? e : e.slice(0, Ir) + `... <${e.length - Ir} more chars>`;
		}
		return JSON.stringify(j(t));
	}
	if (typeof e == "object" && !Array.isArray(e)) {
		let t = {};
		for (let [n, r] of Object.entries(e)) Lr.has(n) && (t[n] = r);
		return t;
	}
	return null;
}
async function Rr(e, t = (e) => console.warn(`anthropic-sdk: ${e}`)) {
	if (typeof process > "u" || process.platform === "win32") return;
	let { fs: n } = await Promise.resolve().then(() => (Dr(), vr)), r = e, i;
	try {
		r = await n.promises.realpath(e), i = await n.promises.stat(r);
	} catch {
		return;
	}
	let a = i.mode & 511;
	if (a & 18) throw new M(`Credentials file at ${r} is group/world-writable (mode 0o${a.toString(8)}); this allows other local users to plant tokens. Run \`chmod 600 ${r}\`.`);
	if (a & 36) throw new M(`Credentials file at ${r} is group/world-readable (mode 0o${a.toString(8)}); run \`chmod 600 ${r}\` before retrying.`);
	typeof process.getuid == "function" && i.uid !== process.getuid() && t(`credentials file at ${r} is owned by uid ${i.uid} (current process uid ${process.getuid()}); verify this is intentional.`);
}
async function zr(e, t) {
	let { fs: n, path: r } = await Promise.resolve().then(() => (Dr(), vr)), i = r.dirname(e);
	await n.promises.mkdir(i, {
		recursive: !0,
		mode: 448
	});
	let a = `${e}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
	try {
		let r = await n.promises.open(a, "w", 384);
		try {
			await r.writeFile(JSON.stringify(t, null, 2)), await r.sync();
		} finally {
			await r.close();
		}
		await n.promises.rename(a, e);
	} catch (e) {
		throw await n.promises.unlink(a).catch(() => {}), e;
	}
	try {
		let e = await n.promises.open(i, "r");
		try {
			await e.sync();
		} finally {
			await e.close();
		}
	} catch {}
}
async function Br(e) {
	if (!e.body) return "";
	let t = e.body.getReader(), n = [], r = 0;
	for (;;) {
		let { done: e, value: i } = await t.read();
		if (e) break;
		if (r + i.length > Nr) {
			let e = Nr - r;
			e > 0 && n.push(i.subarray(0, e)), await t.cancel();
			break;
		}
		n.push(i), r += i.length;
	}
	let i;
	if (n.length === 1) i = n[0];
	else {
		i = new Uint8Array(n.reduce((e, t) => e + t.length, 0));
		let e = 0;
		for (let t of n) i.set(t, e), e += t.length;
	}
	return new TextDecoder("utf-8").decode(i);
}
var M = class extends l {
	constructor(e, t = null, n = null, r = null) {
		super(e), this.statusCode = t, this.body = n, this.requestId = r;
	}
};
// node_modules/@anthropic-ai/sdk/internal/utils/time.mjs
function Vr() {
	return Math.floor(Date.now() / 1e3);
}
// node_modules/@anthropic-ai/sdk/lib/credentials/token-cache.mjs
var Hr = class {
	constructor(e, t) {
		this.cached = null, this.pendingRefresh = null, this.nextForce = !1, this.lastAdvisoryError = 0, this.provider = e, this.onAdvisoryRefreshError = t;
	}
	async getToken() {
		let e = this.nextForce;
		this.nextForce = !1;
		let t = this.cached;
		if (e || t == null) return (await this.refresh(e)).token;
		if (t.expiresAt == null) return t.token;
		let n = t.expiresAt - Vr();
		return n > 120 ? t.token : n > 30 ? (this.backgroundRefresh(), t.token) : (await this.refresh()).token;
	}
	invalidate() {
		this.cached = null, this.nextForce = !0;
	}
	refresh(e = !1) {
		return this.pendingRefresh && !e ? this.pendingRefresh : this.doRefresh(e);
	}
	backgroundRefresh() {
		this.pendingRefresh || Vr() - this.lastAdvisoryError < 5 || this.doRefresh().catch((e) => {
			this.lastAdvisoryError = Vr(), this.onAdvisoryRefreshError?.(e);
		});
	}
	doRefresh(e = !1) {
		return this.pendingRefresh = this.provider(e ? { forceRefresh: !0 } : void 0).then((e) => (this.cached = e, this.pendingRefresh = null, e), (e) => {
			throw this.pendingRefresh = null, e;
		}), this.pendingRefresh;
	}
}, Ur = "gen_ai.agent.name", Wr = "gen_ai.input.messages", Gr = "gen_ai.operation.name", Kr = "gen_ai.output.messages", qr = "gen_ai.output.type", Jr = "gen_ai.request.max_tokens", Yr = "gen_ai.request.model", Xr = "gen_ai.request.reasoning.level", Zr = "gen_ai.request.stop_sequences", Qr = "gen_ai.request.stream", $r = "gen_ai.request.temperature", ei = "gen_ai.request.top_k", ti = "gen_ai.request.top_p", ni = "gen_ai.response.id", ri = "gen_ai.response.model", ii = "gen_ai.response.time_to_first_chunk", ai = "gen_ai.system_instructions", oi = "gen_ai.tool.call.arguments", si = "gen_ai.tool.call.id", ci = "gen_ai.tool.description", li = "gen_ai.tool.name", ui = "gen_ai.tool.type", di = "gen_ai.usage.cache_write.input_tokens", fi = "gen_ai.usage.cache_read.input_tokens", pi = "gen_ai.usage.input_tokens", mi = "gen_ai.usage.output_tokens", hi = "gen_ai.usage.reasoning.output_tokens", gi = "chat", _i = "execute_tool", vi = "invoke_agent", yi = "json", bi = "function", xi = "anthropic.request.id", Si = "anthropic.organization.id", Ci = "anthropic.workspace.id", wi = "anthropic.beta", Ti = "anthropic.content.truncated", Ei = "anthropic.message.stop_reason", Di = "anthropic.message.count_tokens.input_tokens", Oi = "anthropic.request.service_tier", ki = "anthropic.response.service_tier", Ai = "anthropic.thinking.budget_tokens", ji = "anthropic.thinking.type", Mi = "anthropic.tool_result.content", Ni = "anthropic.toolset.name", Pi = "anthropic.usage.cache_creation.ephemeral_1h_input_tokens", Fi = "anthropic.usage.cache_creation.ephemeral_5m_input_tokens", Ii = "anthropic.usage.compaction.input_tokens", Li = "anthropic.usage.compaction.output_tokens", Ri = [
	[xi, "request-id"],
	[Si, "anthropic-organization-id"],
	[Ci, "anthropic-workspace-id"]
];
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/content.mjs
function zi(e, t, n, r) {
	let i = e.span, a = e.requestContentSize;
	if (n !== void 0 && a !== void 0) {
		let e = JSON.stringify([{
			role: "assistant",
			parts: Bi(n)
		}]);
		if (a + 3 * e.length <= r || a + Xi(e) <= r) {
			i.setAttribute(Kr, e);
			return;
		}
	}
	let o = Gi(i, {
		[Zr]: t.stop_sequences?.length ? [...t.stop_sequences] : void 0,
		[ai]: t.system === void 0 ? void 0 : Bi(t.system),
		[Wr]: t.messages.map((e) => ({
			role: e.role,
			parts: Bi(e.content)
		})),
		[Kr]: n === void 0 ? void 0 : [{
			role: "assistant",
			parts: Bi(n)
		}]
	}, r);
	n === void 0 && (e.requestContentSize = o);
}
function Bi(e) {
	return typeof e == "string" ? [{
		type: "text",
		content: e
	}] : e?.map(Vi) ?? [];
}
function Vi(e) {
	switch (e.type) {
		case "text": return {
			type: "text",
			content: e.text
		};
		case "thinking": return {
			type: "reasoning",
			content: e.thinking
		};
		case "tool_use": return {
			type: "tool_call",
			id: e.id,
			name: e.name,
			arguments: e.input,
			...typeof e.toolset_name == "string" ? { anthropic_toolset_name: e.toolset_name } : void 0
		};
		case "server_tool_use": return {
			type: "tool_call",
			id: e.id,
			name: e.name,
			arguments: e.input
		};
		case "mcp_tool_use": return {
			type: "tool_call",
			id: e.id,
			name: e.name,
			arguments: e.input,
			anthropic_mcp_server_name: e.server_name
		};
		case "tool_result": return {
			type: "tool_call_response",
			id: e.tool_use_id,
			response: Hi(e.content)
		};
		default: return typeof e.type == "string" ? e.type.endsWith("_tool_result") && "tool_use_id" in e ? {
			type: "tool_call_response",
			id: e.tool_use_id,
			response: Ui(e.content)
		} : { type: `anthropic_${e.type}` } : { type: "anthropic_unknown" };
	}
}
function Hi(e) {
	return e == null ? [] : typeof e == "string" ? [{
		type: "text",
		text: e
	}] : e.map((e) => e.type === "text" || e.type === "search_result" ? Wi(e) : typeof e.type == "string" ? { type: e.type } : { type: "unknown" });
}
function Ui(e) {
	return e == null ? [] : typeof e == "string" ? [{
		type: "text",
		text: e
	}] : Array.isArray(e) ? e.map((e) => e.type === "text" || e.type === "search_result" || e.type === "web_search_result" ? Wi(e) : typeof e.type == "string" ? { type: e.type } : { type: "unknown" }) : [Wi(e)];
}
function Wi(e) {
	if (Array.isArray(e)) return e.map(Wi);
	if (typeof e != "object" || !e) return e;
	let { type: t, file_type: n } = e;
	if (t === "image" || t === "document") return { type: t };
	let r = t === "text_editor_code_execution_view_result" && (n === "image" || n === "pdf");
	return Object.fromEntries(Object.entries(e).filter(([e]) => !e.startsWith("encrypted_") && !(e === "content" && r)).map(([e, t]) => [e, Wi(t)]));
}
function Gi(e, t, n) {
	let { [Zr]: r, [ai]: i, [Wr]: a, [Kr]: o, [Mi]: s, ...c } = t, l = {
		[ai]: i,
		[Wr]: a,
		[Kr]: o
	}, u = {}, d = s?.map((e) => JSON.stringify(e)), f = 3 * ([...r ?? [], ...d ?? []].reduce((e, t) => e + t.length + 1, 2) + Ki(c, u) + Ki(l, u)) <= n ? (e) => 3 * e.length : Xi, p = () => Object.keys(l).reduce((e, t) => e + f(u[t] ?? ""), 0), m = r?.reduce((e, t) => e + f(t), 0) ?? 0, h = r !== void 0 && m <= n, g = h ? m : 0, _ = r !== void 0 && !h;
	for (let e of Object.keys(c)) {
		let t = f(u[e] ?? "");
		t > n ? (delete u[e], _ = !0) : g += t;
	}
	let v = p();
	if (g + v > n) {
		let { truncated: e, ...t } = qi(l, g + v - n);
		_ ||= e, Ki(t, u), v = p();
	}
	if (g += v, d !== void 0) {
		let e = Yi(d, n - g, f);
		u[Mi] = e.json, g += e.size, _ ||= e.truncated;
	}
	_ && e.setAttribute(Ti, !0), h && e.setAttribute(Zr, r);
	for (let [t, n] of Object.entries(u)) e.setAttribute(t, n);
	return g;
}
function Ki(e, t) {
	let n = 0;
	for (let [r, i] of Object.entries(e)) i !== void 0 && (t[r] = JSON.stringify(i), n += t[r].length);
	return n;
}
function qi(e, t) {
	let n = (e) => e?.map((e) => ({
		...e,
		parts: [...e.parts]
	})), r = e[ai]?.slice(), i = n(e[Wr]), a = n(e[Kr]), o = [r ?? [], ...[...i ?? [], ...a ?? []].map(({ parts: e }) => e)], s = o.reduce((e, t) => e + t.length, 0), c = !1;
	for (let e of o) {
		let n = 0;
		for (; t > 0 && n < e.length;) {
			let r = e[n], i = Xi(JSON.stringify(r)), a = r.content;
			if (s === 1 && r.type === "text" && typeof a == "string") {
				let o = Ji(r, a, i - t);
				o !== a && (e[n] = {
					...r,
					content: o
				}, c = !0);
				break;
			}
			t -= i + +(n + 1 < e.length), n++, s--, c = !0;
		}
		e.splice(0, n);
	}
	return {
		[ai]: r,
		[Wr]: i,
		[Kr]: a,
		truncated: c
	};
}
function Ji(e, t, n) {
	let r = n - Xi(JSON.stringify({
		...e,
		content: ""
	})), i = t.slice(0, Math.max(r, 0)), a = JSON.stringify(i), o = 0, s = 0, c = 0;
	for (; o < i.length;) {
		let e = a.codePointAt(1 + s), t = e > 65535 ? 2 : 1, n = e === 92 ? a[2 + s] === "u" ? 6 : 2 : t;
		if (c += e < 128 ? n : e < 2048 ? 2 : e < 65536 ? 3 : 4, c > r) break;
		s += n, o += t;
	}
	return t.slice(0, o);
}
function Yi(e, t, n) {
	let r = [], i = 2;
	for (let a of e) {
		let e = i + (r.length === 0 ? 0 : 1) + n(a);
		if (e > t) break;
		r.push(a), i = e;
	}
	return {
		json: "[" + r.join(",") + "]",
		size: i,
		truncated: r.length < e.length
	};
}
function Xi(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		r < 128 ? t += 1 : r < 2048 ? t += 2 : r >= 55296 && r < 56320 && (e.charCodeAt(n + 1) & 64512) == 56320 ? (t += 4, n++) : t += 3;
	}
	return t;
}
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/response.mjs
function Zi(e, t, n, r) {
	e.setAttribute(ni, t.id), e.setAttribute(ri, t.model), e.setAttribute(pi, n.input_tokens + (n.cache_read_input_tokens ?? 0) + (n.cache_creation_input_tokens ?? 0)), n.cache_creation_input_tokens != null && e.setAttribute(di, n.cache_creation_input_tokens), n.cache_read_input_tokens != null && e.setAttribute(fi, n.cache_read_input_tokens);
	let i = n.cache_creation;
	if (i != null && (e.setAttribute(Fi, i.ephemeral_5m_input_tokens), e.setAttribute(Pi, i.ephemeral_1h_input_tokens)), n.service_tier != null && e.setAttribute(ki, n.service_tier), !r) return;
	e.setAttribute(mi, n.output_tokens);
	let a = n.output_tokens_details;
	a != null && e.setAttribute(hi, a.thinking_tokens);
	let o = n.iterations?.filter((e) => e.type === "compaction") ?? [];
	o.length > 0 && (e.setAttribute(Ii, o.reduce((e, t) => e + t.input_tokens + t.cache_read_input_tokens + t.cache_creation_input_tokens, 0)), e.setAttribute(Li, o.reduce((e, t) => e + t.output_tokens, 0))), t.stop_reason != null && e.setAttribute(Ei, t.stop_reason);
}
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/api-call.mjs
b();
function Qi(e, t, n) {
	if (t.isRecording()) try {
		let e = n.status === "error" ? n.error : void 0, r = n.response?.headers ?? (e instanceof u ? e.headers : void 0);
		for (let [e, n] of Ri) {
			let i = r?.get(n);
			i && t.setAttribute(e, i);
		}
	} catch (t) {
		E(e).debug("could not record the API call on its span", t);
	}
}
function $i(e, t, n) {
	let r = {
		[Gr]: gi,
		[Yr]: t.model
	};
	try {
		let i = (D([e._options.defaultHeaders, n]).values.get("anthropic-beta") ?? "").split(",").map((e) => e.trim()).filter(Boolean);
		i.length && (r[wi] = i), r[Jr] = t.max_tokens, t.temperature != null && (r[$r] = t.temperature), t.top_p != null && (r[ti] = t.top_p), t.top_k != null && (r[ei] = t.top_k), t.stream === !0 && (r[Qr] = !0), t.output_config?.format?.type === "json_schema" && (r[qr] = yi);
		let a = t.output_config?.effort;
		a != null && (r[Xr] = a), t.service_tier != null && (r[Oi] = t.service_tier);
		let o = t.thinking;
		o != null && (r[ji] = o.type), o?.type === "enabled" && (r[Ai] = o.budget_tokens);
	} catch (t) {
		E(e).debug("could not record the request on its span", t);
	}
	return {
		route: "/v1/messages",
		attributes: r
	};
}
function ea(e, t, n) {
	if (!t?.span.isRecording()) return t;
	try {
		let { contentMode: r, maxContentBytes: i } = e.openTelemetry.traces;
		r === "content" && zi(t, n, void 0, i);
	} catch (t) {
		E(e).debug("could not record the request on its span", t);
	}
	return t;
}
function ta(e, t, n, r) {
	if (!t?.span.isRecording() || r instanceof pn) return;
	let i = t.span;
	try {
		Zi(i, r, r.usage, !0);
		let { contentMode: a, maxContentBytes: o } = e.openTelemetry.traces;
		a === "content" && zi(t, n, r.content, o);
	} catch (t) {
		E(e).debug("could not record the response on its span", t);
	}
}
function na(e, t, n) {
	try {
		t?.span.setAttribute(Di, n.input_tokens);
	} catch (t) {
		E(e).debug("could not record the response on its span", t);
	}
}
function ra(e, t, n) {
	try {
		t?.span.setAttributes({
			[Ur]: n.agent.name,
			[Yr]: n.agent.model.id
		});
	} catch (t) {
		E(e).debug("could not record the response on its span", t);
	}
}
// node_modules/@anthropic-ai/sdk/internal/trace-headers.mjs
function ia() {
	let e = /* @__PURE__ */ new Set([
		"traceparent",
		"tracestate",
		"baggage"
	]);
	try {
		for (let t of Ht.fields()) e.add(t.toLowerCase());
	} catch (e) {
		ln().debug("could not record telemetry", e);
	}
	return e;
}
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/headers.mjs
function aa(e) {
	let t = ia(), n = Array.from(e.entries()).filter(([e]) => t.has(e));
	for (let [t] of n) e.delete(t);
	return n;
}
function oa(e) {
	return (t, n, r) => {
		let i = new Headers(t.headers), a = aa(i);
		return e({
			...t,
			headers: i
		}, (e) => {
			let t = new Headers(e.headers);
			for (let [e, n] of a) t.set(e, n);
			return n({
				...e,
				headers: t
			});
		}, r);
	};
}
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/streaming.mjs
b();
function sa(e, t, n, r) {
	if (t.span.isRecording() && e.openTelemetry.traces.contentMode === "content") try {
		zi(t, n, r.content, e.openTelemetry.traces.maxContentBytes);
	} catch (t) {
		E(e).debug("could not record the streamed message on its span", t);
	}
}
function ca(e, t, n, r) {
	r.options.__span?.name === "anthropic.messages.create" && n instanceof pn ? la(e, t, n, r) : Yn(t, n, r);
}
function la(e, t, n, r) {
	if (!t.isRecording()) return;
	t.setAttribute(On, r.response.status);
	let i = r.options.__span, a = i?.startTime, o, s, c = !1, u = !1, d = !1;
	Jn(n, r.controller.signal, {
		onItem(n) {
			try {
				switch (n.type) {
					case "message_start": {
						let { id: e, model: t, stop_reason: r } = n.message;
						o = {
							id: e,
							model: t,
							stop_reason: r
						}, s = { ...n.message.usage };
						break;
					}
					case "content_block_start":
						o && n.content_block.type === "fallback" && (o.model = n.content_block.to.model);
						break;
					case "message_delta":
						o && s && (s.output_tokens = n.usage.output_tokens, n.usage.input_tokens != null && (s.input_tokens = n.usage.input_tokens), n.usage.cache_creation_input_tokens != null && (s.cache_creation_input_tokens = n.usage.cache_creation_input_tokens), n.usage.cache_read_input_tokens != null && (s.cache_read_input_tokens = n.usage.cache_read_input_tokens), n.usage.output_tokens_details != null && (s.output_tokens_details = n.usage.output_tokens_details), "iterations" in n.usage && n.usage.iterations != null && (s.iterations = n.usage.iterations), n.delta.stop_reason != null && (o.stop_reason = n.delta.stop_reason), u = !0);
						break;
					case "message_stop":
						d = !0;
						break;
					case "content_block_delta": !c && a !== void 0 && t.setAttribute(ii, (Date.now() - a) / 1e3), c = !0;
				}
			} catch (t) {
				E(e).debug("could not record the stream on its span", t);
			}
		},
		onEnd(n) {
			try {
				o && s && Zi(t, o, s, u || d);
			} catch (t) {
				E(e).debug("could not record the stream on its span", t);
			}
			let r = i?.failure;
			!d && i?.streamed && r === void 0 && sa(e, i, i.streamed.body, i.streamed.message), n.reason === "failed" ? Zn(t, n.error) : r === void 0 ? n.reason === "completed" && (d ? t.setStatus({ code: jt.OK }) : Zn(t, new l("The stream ended before message_stop."), "api_error")) : Zn(t, r, "client_error"), O(e, () => t.end());
		}
	});
}
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/environments.mjs
function ua(e, t, n) {
	return e._tracer?.startSpan("anthropic.environment.work", {
		kind: At.INTERNAL,
		attributes: {
			[Tn]: e._genAIProviderName,
			"anthropic.environment.id": t.environment_id,
			"anthropic.environment.work.id": t.id,
			"anthropic.session.id": t.data.id
		}
	}, n);
}
function da(e, t) {
	e?.isRecording() && (t.aborted || e.setStatus({ code: jt.OK }), e.end());
}
function fa(e, t, n) {
	e?.isRecording() && (t.aborted || Zn(e, n), e.end());
}
async function pa(e, t, n, r) {
	if (!t) return r();
	try {
		await S.with(Wt.setSpan(S.active(), t), r);
	} catch (r) {
		throw O(e, () => fa(t, n, r)), r;
	}
	O(e, () => da(t, n));
}
// node_modules/@anthropic-ai/sdk/internal/stainless-helper-header.mjs
var ma = "x-stainless-helper", ha = "x-stainless-helper-method";
function ga(e) {
	return { [ma]: e };
}
var _a = Symbol("anthropic.sdk.stainlessHelper");
function va(e) {
	return typeof e == "object" && !!e && _a in e;
}
function ya(e, t) {
	let n = /* @__PURE__ */ new Set();
	if (e) for (let t of e) va(t) && n.add(t[_a]);
	if (t) for (let e of t) {
		va(e) && n.add(e[_a]);
		let t = e.content;
		if (Array.isArray(t)) for (let e of t) {
			va(e) && n.add(e[_a]);
			let t = e?.tool?.definition;
			va(t) && n.add(t[_a]);
		}
	}
	return Array.from(n);
}
function ba(e, t) {
	let n = ya(e, t);
	return n.length === 0 ? {} : { [ma]: n.join(", ") };
}
function xa(e) {
	return va(e) ? { [ma]: e[_a] } : {};
}
// node_modules/@anthropic-ai/sdk/lib/internal/tracing/tools.mjs
function Sa(e, t, n) {
	if (!e._tracer) return;
	let r = t.output_config?.format?.type === "json_schema" || t.output_format?.type === "json_schema";
	return e._tracer.startSpan("anthropic.messages.tool_runner", {
		kind: At.INTERNAL,
		attributes: {
			[Gr]: vi,
			[Tn]: e._genAIProviderName,
			[Yr]: t.model,
			...r ? { [qr]: yi } : void 0,
			...n == null ? void 0 : { [wn]: n }
		}
	});
}
async function Ca(e, t, n, r, i) {
	let a = e._tracer;
	if (!a) return i();
	let { signal: o, conversationId: s, sessionID: c, parentContext: l = S.active() } = r, u = "description" in t ? t.description : void 0, d = {
		[Gr]: _i,
		[Tn]: e._genAIProviderName,
		[li]: n.name,
		..."toolset_name" in n && typeof n.toolset_name == "string" ? { [Ni]: n.toolset_name } : void 0,
		...u ? { [ci]: u } : void 0,
		[si]: n.id,
		[ui]: bi,
		...s == null ? void 0 : { [wn]: s },
		...c == null ? void 0 : { "anthropic.session.id": c },
		..."session_thread_id" in n && n.session_thread_id != null ? { "anthropic.session.thread.id": n.session_thread_id } : void 0
	}, f = n.type === "agent.tool_use" ? "anthropic.tool_use" : va(t) && t[_a] === "mcpTool" ? "anthropic.mcp_tool_use" : "anthropic.custom_tool_use", p = O(e, () => a.startSpan(`${f} ${n.name}`, {
		kind: At.INTERNAL,
		attributes: d
	}, l));
	if (!p) return i();
	let m;
	try {
		return m = await S.with(Wt.setSpan(l, p), i), m;
	} finally {
		let t = m !== void 0 && !m.isError, r = !t && o?.aborted === !0, { contentMode: i, maxContentBytes: a } = e.openTelemetry.traces;
		if (i === "content" && p.isRecording()) try {
			Gi(p, {
				[oi]: n.input,
				[Mi]: m && !r ? Hi(m.content) : void 0
			}, a);
		} catch (t) {
			E(e).debug("could not record the tool run on its span", t);
		}
		O(e, () => {
			t ? p.setStatus({ code: jt.OK }) : r || Zn(p, m, "tool_error"), p.end();
		});
	}
}
// node_modules/@anthropic-ai/sdk/internal/utils/base64.mjs
b();
var wa = (e) => {
	if (globalThis.Buffer !== void 0) {
		let t = globalThis.Buffer.from(e, "base64");
		return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	}
	if (typeof atob < "u") {
		let t = atob(e), n = new Uint8Array(t.length);
		for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
		return n;
	}
	throw new l("Cannot decode base64 string; Expected `Buffer` or `atob` to be defined");
}, Ta = function() {
	let { crypto: e } = globalThis;
	if (e?.randomUUID) return Ta = e.randomUUID.bind(e), e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(1), n = e ? () => e.getRandomValues(t)[0] : () => Math.random() * 255 & 255;
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ n() & 15 >> e / 4).toString(16));
}, Ea = /^[A-Za-z0-9_.-]+$/;
function Da(e) {
	if (!e) throw Error("profile name is empty");
	if (e === "." || e === "..") throw Error(`profile name "${e}" is not allowed`);
	if (e.includes("/") || e.includes("\\")) throw Error(`profile name "${e}" must not contain path separators`);
	if (!Ea.test(e)) throw Error(`profile name "${e}" contains disallowed characters (allowed: letters, digits, '_', '.', '-')`);
}
var Oa = async (e) => {
	var t, n;
	let r = await Aa();
	if (r === null) return null;
	let i = e ?? await Ma();
	if (i === null) return null;
	Da(i);
	let { fs: a, path: o } = await Promise.resolve().then(() => (Dr(), vr)), s = o.join(r, "configs", `${i}.json`), c;
	try {
		c = await a.promises.readFile(s, "utf-8");
	} catch (e) {
		if (e?.code !== "ENOENT") throw Error(`failed to read config file ${s}: ${e}`);
		c = null;
	}
	if (c === null) {
		let e = T("ANTHROPIC_ORGANIZATION_ID"), t = T("ANTHROPIC_IDENTITY_TOKEN_FILE"), n = T("ANTHROPIC_FEDERATION_RULE_ID");
		return n && e ? {
			fromFile: !1,
			config: {
				organization_id: e,
				workspace_id: T("ANTHROPIC_WORKSPACE_ID"),
				base_url: T("ANTHROPIC_BASE_URL"),
				authentication: {
					type: "oidc_federation",
					federation_rule_id: n,
					service_account_id: T("ANTHROPIC_SERVICE_ACCOUNT_ID"),
					identity_token: t ? {
						source: "file",
						path: t
					} : void 0,
					scope: T("ANTHROPIC_SCOPE")
				}
			}
		} : null;
	}
	let l;
	try {
		l = JSON.parse(c);
	} catch (e) {
		throw Error(`failed to parse config file ${s}: ${e}`);
	}
	if (!l.authentication) throw Error(`config file ${s} is missing "authentication"`);
	let u = l.authentication.type;
	if (u !== "oidc_federation" && u !== "user_oauth") throw Error(`authentication.type "${u}" is not a known authentication type`);
	if (l.organization_id ?? (l.organization_id = T("ANTHROPIC_ORGANIZATION_ID")), l.workspace_id ?? (l.workspace_id = T("ANTHROPIC_WORKSPACE_ID")), l.base_url ?? (l.base_url = T("ANTHROPIC_BASE_URL")), (t = l.authentication).scope ?? (t.scope = T("ANTHROPIC_SCOPE")), l.authentication.type === "oidc_federation") {
		if (!l.authentication.identity_token) {
			let e = T("ANTHROPIC_IDENTITY_TOKEN_FILE");
			e && (l.authentication.identity_token = {
				source: "file",
				path: e
			});
		}
		l.authentication.federation_rule_id || (l.authentication.federation_rule_id = T("ANTHROPIC_FEDERATION_RULE_ID") ?? ""), (n = l.authentication).service_account_id ?? (n.service_account_id = T("ANTHROPIC_SERVICE_ACCOUNT_ID"));
	}
	return {
		config: l,
		fromFile: !0
	};
}, ka = async (e, t) => {
	if (e?.authentication.credentials_path) return e.authentication.credentials_path;
	let n = await Aa();
	if (!n) return null;
	let r = t ?? await Ma();
	if (!r) return null;
	Da(r);
	let { path: i } = await Promise.resolve().then(() => (Dr(), vr));
	return i.join(n, "credentials", `${r}.json`);
}, Aa = async () => {
	if (!ja()) return null;
	let { path: e } = await Promise.resolve().then(() => (Dr(), vr)), t = T("ANTHROPIC_CONFIG_DIR");
	if (t) return t;
	if (xe()["X-Stainless-OS"] === "Windows") {
		let t = T("APPDATA");
		if (t) return e.join(t, "Anthropic");
		let n = T("USERPROFILE");
		return n ? e.join(n, "AppData", "Roaming", "Anthropic") : null;
	}
	let n = T("XDG_CONFIG_HOME");
	if (n) return e.join(n, "anthropic");
	let r = T("HOME");
	return r ? e.join(r, ".config", "anthropic") : null;
}, ja = () => {
	let e = xe()["X-Stainless-Runtime"];
	return e === "node" || e === "deno";
}, Ma = async () => {
	let e = await Aa();
	if (!e) return null;
	let t = T("ANTHROPIC_PROFILE");
	if (t) return t;
	let { fs: n, path: r } = await Promise.resolve().then(() => (Dr(), vr)), i = r.join(e, "active_config");
	try {
		return (await n.promises.readFile(i, "utf-8")).trim() || "default";
	} catch (e) {
		if (e?.code !== "ENOENT") throw Error(`failed to read ${i}: ${e}`);
		return "default";
	}
};
// node_modules/@anthropic-ai/sdk/lib/credentials/identity-token.mjs
b();
function Na(e) {
	if (!e) throw new l("Identity token file path is empty");
	return async () => {
		let { fs: t } = await Promise.resolve().then(() => (Dr(), vr)), n;
		try {
			n = await t.promises.readFile(e, "utf-8");
		} catch (t) {
			throw new l(`Failed to read identity token file at ${e}: ${t}`);
		}
		let r = n.trim();
		if (!r) throw new l(`Identity token file at ${e} is empty`);
		return r;
	};
}
function Pa(e) {
	if (!e) throw new l("Identity token value is empty");
	return () => e;
}
// node_modules/@anthropic-ai/sdk/lib/credentials/oidc-federation.mjs
function Fa(e) {
	return async () => {
		Pr(e.baseURL);
		let t = await e.identityTokenProvider();
		if (t.length > 16384) throw new M(`Identity token is ${Math.ceil(t.length / 1024)} KiB, exceeds the 16 KiB assertion limit`);
		let n = {
			grant_type: Or,
			assertion: t,
			federation_rule_id: e.federationRuleId,
			organization_id: e.organizationId
		};
		e.serviceAccountId && (n.service_account_id = e.serviceAccountId), e.workspaceId && (n.workspace_id = e.workspaceId);
		let r = `${e.baseURL}${Ar}`, i;
		try {
			i = await e.fetch(r, {
				method: "POST",
				redirect: "manual",
				headers: {
					"Content-Type": "application/json",
					"anthropic-beta": `${jr},${Mr}`,
					"User-Agent": e.userAgent || "anthropic-sdk-typescript/0.135.0 oidcFederationProvider"
				},
				body: JSON.stringify(n)
			});
		} catch (e) {
			throw new M(`Failed to reach token endpoint ${r}: ${e}`);
		}
		let a = i.headers.get("Request-Id");
		if (!i.ok) {
			let t = j(await i.text().catch(() => "")), n = "";
			throw i.status === 401 && (n = ` Ensure your federation rule matches your identity token. ${e.workspaceId ? "" : "If your federation rule is scoped to multiple workspaces, set the ANTHROPIC_WORKSPACE_ID environment variable, the 'workspace_id' config key, or the `workspaceId` option. "}View your authentication events in the Workload identity page of Claude Console for more details.`), new M(`Token exchange failed with status ${i.status}${a ? ` (request-id ${a})` : ""}: ${t}${n}`, i.status, t, a);
		}
		let o = await Fr(i, a), s = Number(o.expires_in);
		if (!Number.isFinite(s)) throw new M(`Token endpoint response missing required fields: ${JSON.stringify(j(o))}`, i.status, j(o), a);
		return {
			token: o.access_token,
			expiresAt: Vr() + s
		};
	};
}
// node_modules/@anthropic-ai/sdk/lib/credentials/user-oauth.mjs
function Ia(e) {
	return async (t) => {
		let { fs: n } = await Promise.resolve().then(() => (Dr(), vr));
		await Rr(e.credentialsPath, e.onSafetyWarning);
		let r;
		try {
			r = await n.promises.readFile(e.credentialsPath, "utf-8");
		} catch (t) {
			throw new M(`Credentials file not found at ${e.credentialsPath}: ${t}`);
		}
		let i;
		try {
			i = JSON.parse(r);
		} catch (t) {
			throw new M(`Credentials file at ${e.credentialsPath} is not valid JSON: ${t}`);
		}
		let a = i.access_token;
		if (!a) throw new M(`Credentials file at ${e.credentialsPath} must include 'access_token'`);
		let o = i.expires_at;
		if (!t?.forceRefresh && (o == null || Vr() < o - 30)) return {
			token: a,
			expiresAt: o ?? null
		};
		let s = i.refresh_token;
		if (!e.clientId || !s) throw new M(`Access token at ${e.credentialsPath} has expired and no refresh is available (client_id ${e.clientId ? "set" : "empty"}, refresh_token ${s ? "set" : "empty"})`);
		Pr(e.baseURL);
		let c = {
			grant_type: kr,
			refresh_token: s,
			client_id: e.clientId
		}, l = `${e.baseURL}${Ar}`, u;
		try {
			u = await e.fetch(l, {
				method: "POST",
				redirect: "manual",
				headers: {
					"Content-Type": "application/json",
					"anthropic-beta": jr,
					"User-Agent": e.userAgent || "anthropic-sdk-typescript/0.135.0 userOAuthProvider"
				},
				body: JSON.stringify(c)
			});
		} catch (e) {
			throw new M(`User OAuth refresh failed to reach token endpoint: ${e}`);
		}
		let d = u.headers.get("Request-Id");
		if (!u.ok) {
			let e = await u.text().catch(() => "");
			throw new M(`User OAuth refresh failed (HTTP ${u.status}): ${j(e)}`, u.status, j(e), d);
		}
		let f = await Fr(u, d), p = Number(f.expires_in);
		if (!Number.isFinite(p)) throw new M(`User OAuth refresh response missing or invalid expires_in: ${JSON.stringify(j(f))}`, u.status, j(f), d);
		let m = Vr() + p, h = f.refresh_token || s;
		return await zr(e.credentialsPath, {
			...i,
			version: "1.0",
			type: "oauth_token",
			access_token: f.access_token,
			expires_at: m,
			refresh_token: h
		}), {
			token: f.access_token,
			expiresAt: m
		};
	};
}
// node_modules/@anthropic-ai/sdk/lib/credentials/credential-chain.mjs
function La(e, t) {
	let n = za(e, e.authentication.credentials_path ?? null, (e.base_url || t.baseURL).replace(/\/+$/, ""), t), r = {};
	return e.workspace_id && e.authentication.type === "user_oauth" && (r["anthropic-workspace-id"] = e.workspace_id), {
		provider: n,
		extraHeaders: r,
		baseURL: e.base_url || void 0
	};
}
async function Ra(e, t) {
	let n = await Oa(t);
	if (!n) return null;
	let { config: r, fromFile: i } = n;
	return La(r.authentication.credentials_path || !i ? r : {
		...r,
		authentication: {
			...r.authentication,
			credentials_path: await ka(r, t) ?? void 0
		}
	}, e);
}
function za(e, t, n, r) {
	switch (e.authentication.type) {
		case "oidc_federation": {
			let i = e.authentication, a = Ba(i);
			if (!a) throw new M("oidc_federation config requires an identity token (set authentication.identity_token, ANTHROPIC_IDENTITY_TOKEN_FILE, or ANTHROPIC_IDENTITY_TOKEN)");
			if (!i.federation_rule_id) throw new M("oidc_federation config requires 'federation_rule_id'. Set it in authentication.federation_rule_id in your profile, or via ANTHROPIC_FEDERATION_RULE_ID (profile takes precedence).");
			if (!e.organization_id) throw new M("oidc_federation config requires organization_id (set ANTHROPIC_ORGANIZATION_ID or config.organization_id)");
			let o = Fa({
				identityTokenProvider: a,
				federationRuleId: i.federation_rule_id,
				organizationId: e.organization_id,
				serviceAccountId: i.service_account_id,
				workspaceId: e.workspace_id,
				baseURL: n,
				fetch: r.fetch,
				userAgent: r.userAgent
			});
			return t ? Va(o, t, r.onCacheWriteError, r.onSafetyWarning) : o;
		}
		case "user_oauth":
			if (!t) throw new M("user_oauth config requires authentication.credentials_path (or load via a profile so it defaults to <config_dir>/credentials/<profile>.json)");
			return Ia({
				credentialsPath: t,
				clientId: e.authentication.client_id,
				baseURL: n,
				fetch: r.fetch,
				userAgent: r.userAgent,
				onSafetyWarning: r.onSafetyWarning
			});
		default: {
			let t = e.authentication.type;
			throw new M(`authentication.type "${t}" is not a known authentication type`);
		}
	}
}
function Ba(e) {
	if (e.identity_token) {
		let t = e.identity_token.source;
		if (t !== "file") throw new M(`identity_token.source "${t}" is not supported by this SDK version (only "file")`);
		if (!e.identity_token.path) throw new M("identity_token.source \"file\" requires a non-empty path");
		return Na(e.identity_token.path);
	}
	let t = T("ANTHROPIC_IDENTITY_TOKEN_FILE");
	if (t) return Na(t);
	let n = T("ANTHROPIC_IDENTITY_TOKEN");
	return n ? Pa(n) : null;
}
function Va(e, t, n, r) {
	return async (i) => {
		let { fs: a } = await Promise.resolve().then(() => (Dr(), vr));
		await Rr(t, r);
		let o;
		try {
			let e = await a.promises.readFile(t, "utf-8");
			o = JSON.parse(e);
			let n = o?.access_token;
			if (n && !i?.forceRefresh) {
				let e = o?.expires_at;
				if (e == null || Vr() < e - 30) return {
					token: n,
					expiresAt: e ?? null
				};
			}
		} catch (e) {
			e?.code !== "ENOENT" && !(e instanceof SyntaxError) && n?.(e);
		}
		let s = await e(i);
		try {
			await zr(t, {
				...o ?? {},
				version: "1.0",
				type: "oauth_token",
				access_token: s.token,
				expires_at: s.expiresAt
			});
		} catch (e) {
			n?.(e);
		}
		return s;
	};
}
// node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function Ha(e, t) {
	let { response: n, requestLogID: r, retryOfRequestLogID: i, startTime: a } = t, o = await (async () => {
		if (t.options.stream) return E(e).debug("response", n.status, n.url, n.headers, n.body), pn.fromSSEResponse(n, t.controller, e);
		if (n.status === 204) return null;
		if (t.options.__binaryResponse) return n;
		let r = n.headers.get("content-type")?.split(";")[0]?.trim();
		return r?.includes("application/json") || r?.endsWith("+json") ? n.headers.get("content-length") === "0" ? void 0 : Ua(await n.json(), n) : await n.text();
	})().finally(() => {
		!t.options.stream && !t.options.__binaryResponse && De(t.controller);
	});
	return un(E(e), `[${r}] response parsed`, {
		retryOfRequestLogID: i,
		url: n.url,
		status: n.status,
		body: o,
		durationMs: Date.now() - a
	}), o;
}
function Ua(e, t) {
	return !e || typeof e != "object" || Array.isArray(e) ? e : Object.defineProperties(e, {
		_request_id: {
			value: t.headers.get("request-id"),
			enumerable: !1
		},
		_workspace_id: {
			value: t.headers.get("anthropic-workspace-id"),
			enumerable: !1
		}
	});
}
c(), b();
var Wa = /* @__PURE__ */ new WeakSet();
function Ga(e) {
	return typeof e == "object" && !!e && Wa.has(e);
}
function Ka(e) {
	let t = /* @__PURE__ */ new Set();
	for (; typeof e == "object" && e && !t.has(e);) {
		if (t.add(e), Ga(e) || o(e) || e instanceof f || e instanceof m) return !0;
		e = e.cause;
	}
	return !1;
}
function qa(e, t, n, r) {
	return async (i, a = {}) => {
		if (t.length === 0) return e.call(void 0, i, a);
		let o = a.headers instanceof Headers ? a.headers : new Headers(a.headers), s = await Xa(e, t, n, r)({
			...a,
			headers: o,
			url: typeof i == "string" ? i : i instanceof URL ? i.href : i.url
		});
		if (s.bodyUsed || s.body?.locked) throw new l("middleware consumed the response body; use response.clone() to inspect it, or return new Response(body, response) to consume and replace it");
		return s;
	};
}
function Ja(e, t) {
	let n = /* @__PURE__ */ new WeakMap();
	return {
		options: e,
		logger: t ? E(t) : ln(),
		parse(r) {
			if (e?.stream && r.ok) return Ya(r, e, t);
			let i = n.get(r);
			return i || (i = Ya(r, e, t), n.set(r, i)), i;
		}
	};
}
async function Ya(e, t, n) {
	if (e.bodyUsed || e.body?.locked) throw new l("cannot ctx.parse() a response whose body was already consumed; call ctx.parse() instead of reading the body, or read via response.clone()");
	if (t?.stream && e.ok) return pn.fromSSEResponse(e.clone(), new AbortController(), n);
	if (e.status === 204) return null;
	if (t?.__binaryResponse) return e;
	let r = e.headers.get("content-type")?.split(";")[0]?.trim();
	return r?.includes("application/json") || r?.endsWith("+json") ? e.headers.get("content-length") === "0" ? void 0 : Ua(await e.clone().json(), e) : await e.clone().text();
}
function Xa(e, t, n, r) {
	let i = async ({ url: t, ...n }) => {
		try {
			return await e.call(void 0, t, n);
		} catch (e) {
			let t = s(e);
			throw Wa.add(t), t;
		}
	}, a = Ja(n, r);
	for (let e = t.length - 1; e >= 0; e--) {
		let n = t[e], r = i;
		i = async (e) => n(e, r, a);
	}
	return i;
}
// node_modules/@anthropic-ai/sdk/internal/uploads.mjs
var Za = () => {
	if (typeof File > "u") {
		let { process: e } = globalThis, t = typeof e?.versions?.node == "string" && parseInt(e.versions.node.split(".")) < 20;
		throw Error("`File` is not defined as a global, which is required for file uploads." + (t ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
	}
};
function Qa(e, t, n) {
	return Za(), new File(e, t ?? "", n);
}
function $a(e, t) {
	let n = typeof e == "object" && !!e && ("name" in e && e.name && String(e.name) || "url" in e && e.url && String(e.url) || "filename" in e && e.filename && String(e.filename) || "path" in e && e.path && String(e.path)) || "";
	return t ? n.split(/[\\/]/).pop() || void 0 : n;
}
var eo = (e) => typeof e == "object" && !!e && typeof e[Symbol.asyncIterator] == "function", to = async (e, t, n = !0) => {
	try {
		return {
			...e,
			body: await io(e.body, t, n)
		};
	} catch (n) {
		let r = e.__span?.span;
		throw r && O(typeof t == "function" ? void 0 : t, () => qn(r, {
			status: "error",
			options: e,
			error: n
		})), n;
	}
}, no = /* @__PURE__ */ new WeakMap();
function ro(e) {
	let t = typeof e == "function" ? e : e.fetch, n = no.get(t);
	if (n) return n;
	let r = (async () => {
		try {
			let e = "Response" in t ? t.Response : (await t("data:,")).constructor, n = new FormData();
			return n.toString() !== await new e(n).text();
		} catch {
			return !0;
		}
	})();
	return no.set(t, r), r;
}
var io = async (e, t, n = !0) => {
	if (!await ro(t)) throw TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
	let r = new FormData();
	return await Promise.all(Object.entries(e || {}).map(([e, t]) => ao(r, e, t, n))), r;
}, ao = async (e, t, n, r) => {
	if (n !== void 0) {
		if (n == null) throw TypeError(`Received null for "${t}"; to pass null in FormData, you must use the string 'null'`);
		if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") e.append(t, String(n));
		else if (n instanceof Response) {
			let i = {}, a = n.headers.get("Content-Type");
			a && (i = { type: a }), e.append(t, Qa([await n.blob()], $a(n, r), i));
		} else if (eo(n)) e.append(t, Qa([await new Response(Ae(n)).blob()], $a(n, r)));
		else if (n instanceof Blob) {
			let i = typeof File < "u" && n instanceof File ? n.name : $a(n, r);
			e.append(t, Qa([n], i, { type: n.type }));
		} else if (Array.isArray(n)) await Promise.all(n.map((n) => ao(e, t + "[]", n, r)));
		else if (typeof n.then == "function") throw TypeError(`Received a Promise for "${t}"; await it first, e.g. \`await toFile(...)\``);
		else if (n instanceof ArrayBuffer || ArrayBuffer.isView(n)) throw TypeError(`Received ${n.constructor.name} for "${t}"; to upload raw bytes, wrap them with \`await toFile(bytes, 'filename')\``);
		else if (typeof n == "object") await Promise.all(Object.entries(n).map(([n, i]) => ao(e, `${t}[${n}]`, i, r)));
		else throw TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${n} instead`);
	}
}, N, oo = /* @__PURE__ */ (() => {
	class e extends Promise {
		constructor(e, t, n = Ha) {
			super((e) => {
				e(null);
			}), this.responsePromise = t, this.parseResponse = n, N.set(this, void 0), i(this, N, e, "f");
		}
		_thenUnwrap(t) {
			return new e(a(this, N, "f"), this.responsePromise, async (e, n) => Ua(t(await this.parseResponse(e, n), n), n.response));
		}
		asResponse() {
			return this.responsePromise.then((e) => {
				let t = e.options.__span?.span;
				if (t && !this.parsedPromise) {
					let n = {
						status: "success",
						...e,
						data: void 0
					};
					Qi(a(this, N, "f"), t, n), O(a(this, N, "f"), () => qn(t, n));
				}
				return e.response;
			});
		}
		async withResponse() {
			let [e, t] = await Promise.all([this.parse(), this.asResponse()]);
			return {
				data: e,
				response: t,
				request_id: t.headers.get("request-id"),
				workspace_id: t.headers.get("anthropic-workspace-id")
			};
		}
		parse() {
			return this.parsedPromise ||= this.responsePromise.then((e) => this.parseResponseTraced(e)), this.parsedPromise;
		}
		async parseResponseTraced(e) {
			let t = e.options.__span;
			if (!t) return this.parseResponse(a(this, N, "f"), e);
			let { span: n } = t, r;
			try {
				r = await this.parseResponse(a(this, N, "f"), e);
			} catch (t) {
				let r = {
					status: "error",
					...e,
					error: t
				};
				throw Qi(a(this, N, "f"), n, r), O(a(this, N, "f"), () => qn(n, r)), t;
			}
			let i = {
				status: "success",
				...e,
				data: r
			};
			return O(a(this, N, "f"), () => Vn(t, r)), Qi(a(this, N, "f"), n, i), e.options.stream && eo(r) ? O(a(this, N, "f"), () => ca(a(this, N, "f"), n, r, e)) : O(a(this, N, "f"), () => qn(n, i)), r;
		}
		then(e, t) {
			return this.parse().then(e, t);
		}
		catch(e) {
			return this.parse().catch(e);
		}
		finally(e) {
			return this.parse().finally(e);
		}
	}
	return N = /* @__PURE__ */ new WeakMap(), e;
})();
// node_modules/@anthropic-ai/sdk/core/pagination.mjs
b();
var so, co = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t, n, r) {
			so.set(this, void 0), i(this, so, e, "f"), this.options = r, this.response = t, this.body = n;
		}
		hasNextPage() {
			return this.getPaginatedItems().length ? this.nextPageRequestOptions() != null : !1;
		}
		async getNextPage() {
			let e = this.nextPageRequestOptions();
			if (!e) throw new l("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
			let t = this.options.__span;
			return await a(this, so, "f").requestAPIList(this.constructor, {
				...e,
				__span: t && k(a(this, so, "f"), t.name, { openTelemetry: this.options.openTelemetry }, {
					route: t.route,
					queryParams: t.queryParams,
					contentQueryParams: t.contentQueryParams,
					attributes: t.attributes
				})
			});
		}
		async *iterPages() {
			let e = this;
			for (yield e; e.hasNextPage();) e = await e.getNextPage(), yield e;
		}
		async *[(so = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
			for await (let e of this.iterPages()) for (let t of e.getPaginatedItems()) yield t;
		}
	}
	return e;
})(), lo = /* @__PURE__ */ (() => {
	class e extends oo {
		constructor(e, t, n) {
			super(e, t, async (e, t) => new n(e, t.response, await Ha(e, t), t.options));
		}
		async *[Symbol.asyncIterator]() {
			let e = await this;
			for await (let t of e) yield t;
		}
	}
	return e;
})(), P = class extends co {
	constructor(e, t, n, r) {
		super(e, t, n, r), this.data = n.data || [], this.has_more = n.has_more || !1, this.first_id = n.first_id || null, this.last_id = n.last_id || null;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		return this.has_more !== !1 && super.hasNextPage();
	}
	nextPageRequestOptions() {
		if (this.options.query?.before_id) {
			let e = this.first_id;
			return e ? {
				...this.options,
				query: {
					...oe(this.options.query),
					before_id: e
				}
			} : null;
		}
		let e = this.last_id;
		return e ? {
			...this.options,
			query: {
				...oe(this.options.query),
				after_id: e
			}
		} : null;
	}
}, F = class extends co {
	constructor(e, t, n, r) {
		super(e, t, n, r), this.data = n.data || [], this.next_page = n.next_page || null;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		return this.nextPageRequestOptions() != null;
	}
	nextPageRequestOptions() {
		let e = this.next_page;
		return e ? {
			...this.options,
			query: {
				...oe(this.options.query),
				page: e
			}
		} : null;
	}
}, uo = class extends co {
	constructor(e, t, n, r) {
		super(e, t, n, r), this.data = n.data || [], this.next_page = n.next_page || null, this.prev_page = n.prev_page || null;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		return this.nextPageRequestOptions() != null;
	}
	nextPageRequestOptions() {
		let e = this.next_page;
		return e ? {
			...this.options,
			query: {
				...oe(this.options.query),
				page: e
			}
		} : null;
	}
}, fo = (e) => typeof e == "object" && !!e && typeof e.size == "number" && typeof e.type == "string" && typeof e.text == "function" && typeof e.slice == "function" && typeof e.arrayBuffer == "function", po = (e) => typeof e == "object" && !!e && typeof e.name == "string" && typeof e.lastModified == "number" && fo(e), mo = (e) => typeof e == "object" && !!e && typeof e.url == "string" && typeof e.blob == "function";
async function ho(e, t, n) {
	if (Za(), e = await e, t ||= e instanceof File ? e.name : $a(e, !0), po(e)) return e instanceof File && t == null && n == null ? e : Qa([await e.arrayBuffer()], t ?? e.name, {
		type: e.type,
		lastModified: e.lastModified,
		...n
	});
	if (mo(e)) {
		let r = await e.blob();
		return t ||= new URL(e.url).pathname.split(/[\\/]/).pop(), Qa(await go(r), t, n);
	}
	let r = await go(e);
	if (!n?.type) {
		let e = r.find((e) => typeof e == "object" && "type" in e && e.type);
		typeof e == "string" && (n = {
			...n,
			type: e
		});
	}
	return Qa(r, t, n);
}
async function go(e) {
	let t = [];
	if (typeof e == "string" || ArrayBuffer.isView(e) || e instanceof ArrayBuffer) t.push(e);
	else if (fo(e)) t.push(e instanceof Blob ? e : await e.arrayBuffer());
	else if (eo(e)) for await (let n of e) t.push(...await go(n));
	else {
		let t = e?.constructor?.name;
		throw Error(`Unexpected data type: ${typeof e}${t ? `; constructor: ${t}` : ""}${_o(e)}`);
	}
	return t;
}
function _o(e) {
	return typeof e != "object" || !e ? "" : `; props: [${Object.getOwnPropertyNames(e).map((e) => `"${e}"`).join(", ")}]`;
}
// node_modules/@anthropic-ai/sdk/core/resource.mjs
var I = class {
	constructor(e) {
		this._client = e;
	}
};
// node_modules/@anthropic-ai/sdk/lib/internal/messages-request.mjs
function vo(e, t) {
	let { user_profile_id: n, workspace_id: r, tools: i, messages: a } = e;
	return D([
		{
			...n == null ? void 0 : { "anthropic-user-profile-id": n },
			...r == null ? void 0 : { "anthropic-workspace-id": r }
		},
		ba(i, a),
		t?.headers
	]);
}
function yo(e, t, n) {
	if (!e._tracer) return;
	let r = vo(t, n);
	return k(e, "anthropic.messages.create", n, $i(e, {
		...t,
		stream: !0
	}, r));
}
// node_modules/@anthropic-ai/sdk/lib/parser.mjs
b();
function bo(e) {
	return e?.output_config?.format;
}
function xo(e, t, n) {
	let r = bo(t);
	return !t || !("parse" in (r ?? {})) ? {
		...e,
		content: e.content.map((e) => e.type === "text" ? Object.defineProperty({ ...e }, "parsed_output", {
			value: null,
			enumerable: !1
		}) : e),
		parsed_output: null
	} : So(e, t, n);
}
function So(e, t, n) {
	let r = null, i = e.content.map((e) => {
		if (e.type === "text") {
			let n = Co(t, e.text);
			return r === null && (r = n), Object.defineProperty({ ...e }, "parsed_output", {
				value: n,
				enumerable: !1
			});
		}
		return e;
	});
	return {
		...e,
		content: i,
		parsed_output: r
	};
}
function Co(e, t) {
	let n = bo(e);
	if (n?.type !== "json_schema") return null;
	try {
		return "parse" in n ? n.parse(t) : JSON.parse(t);
	} catch (e) {
		throw new l(`Failed to parse structured output: ${e}`);
	}
}
// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
var wo = (e) => {
	let t = 0, n = [];
	for (; t < e.length;) {
		let r = e[t];
		if (r === "\\") {
			t++;
			continue;
		}
		if (r === "{") {
			n.push({
				type: "brace",
				value: "{"
			}), t++;
			continue;
		}
		if (r === "}") {
			n.push({
				type: "brace",
				value: "}"
			}), t++;
			continue;
		}
		if (r === "[") {
			n.push({
				type: "paren",
				value: "["
			}), t++;
			continue;
		}
		if (r === "]") {
			n.push({
				type: "paren",
				value: "]"
			}), t++;
			continue;
		}
		if (r === ":") {
			n.push({
				type: "separator",
				value: ":"
			}), t++;
			continue;
		}
		if (r === ",") {
			n.push({
				type: "delimiter",
				value: ","
			}), t++;
			continue;
		}
		if (r === "\"") {
			let r = t + 1, i = r, a = !1;
			for (;;) {
				if (i = e.indexOf("\"", i), i === -1) {
					a = !0;
					break;
				}
				let t = 0, n = i - 1;
				for (; n >= r && e[n] === "\\";) t++, n--;
				if (t % 2 == 0) break;
				i++;
			}
			a ? t = e.length : (n.push({
				type: "string",
				value: e.slice(r, i)
			}), t = i + 1);
			continue;
		}
		if (r && /\s/.test(r)) {
			t++;
			continue;
		}
		let i = /[0-9]/;
		if (r && i.test(r) || r === "-" || r === ".") {
			let a = "";
			for (r === "-" && (a += r, r = e[++t]); r && (i.test(r) || r === "." || r === "e" || r === "E" || (r === "-" || r === "+") && (a[a.length - 1] === "e" || a[a.length - 1] === "E"));) a += r, r = e[++t];
			n.push({
				type: "number",
				value: a,
				unterminated: t === e.length
			});
			continue;
		}
		let a = /[a-z]/i;
		if (r && a.test(r)) {
			let i = "";
			for (; r && a.test(r) && t !== e.length;) i += r, r = e[++t];
			if (i == "true" || i == "false" || i === "null") n.push({
				type: "name",
				value: i
			});
			else {
				t++;
				continue;
			}
		} else t++;
	}
	return n;
}, To = (e) => {
	let t = [];
	for (let n of e) (n.type === "brace" || n.type === "paren") && (n.value === "{" || n.value === "[" ? t.push(n.value) : t.pop());
	let n = t[t.length - 1], r = e.length, i = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?$/;
	for (; r > 0;) {
		let t = e[r - 1];
		switch (t.type) {
			case "separator":
				r--;
				continue;
			case "number":
				if (t.unterminated || !i.test(t.value)) {
					r--;
					continue;
				}
				break;
			case "string":
				let a = e[r - 2];
				if (n === "{" && (a?.type === "delimiter" || a?.type === "brace" && a.value === "{")) {
					r--;
					continue;
				}
				break;
			case "delimiter": r--;
		}
		break;
	}
	return e.slice(0, r);
}, Eo = (e) => {
	let t = [];
	return e.map((e) => {
		e.type === "brace" && (e.value === "{" ? t.push("}") : t.splice(t.lastIndexOf("}"), 1)), e.type === "paren" && (e.value === "[" ? t.push("]") : t.splice(t.lastIndexOf("]"), 1));
	}), t.length > 0 && t.reverse().map((t) => {
		t === "}" ? e.push({
			type: "brace",
			value: "}"
		}) : t === "]" && e.push({
			type: "paren",
			value: "]"
		});
	}), e;
}, Do = (e) => {
	let t = "";
	return e.map((e) => {
		switch (e.type) {
			case "string":
				t += "\"" + e.value + "\"";
				break;
			default: t += e.value;
		}
	}), t;
}, Oo = (e) => JSON.parse(Do(Eo(To(wo(e))))), ko = "__json_buf";
function Ao(e, t) {
	let n = {};
	for (let t of Object.keys(e)) t !== "input" && (n[t] = e[t]);
	Object.defineProperty(n, ko, {
		value: t,
		enumerable: !1,
		writable: !0
	});
	let r, i = !1;
	return Object.defineProperty(n, "input", {
		enumerable: !0,
		configurable: !0,
		get() {
			return i ||= (r = t ? Oo(t) : {}, !0), r;
		}
	}), n;
}
c(), b();
var jo, Mo, No, Po, Fo, Io, Lo, Ro, zo, Bo, Vo, Ho, Uo, Wo, Go, Ko, qo, Jo, Yo, L, Xo, Zo, Qo, $o, es, ts, ns;
function rs(e) {
	return e.type === "tool_use" || e.type === "server_tool_use";
}
var is = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t) {
			jo.add(this), this.messages = [], this.receivedMessages = [], Mo.set(this, void 0), No.set(this, null), this.controller = new AbortController(), Po.set(this, void 0), Fo.set(this, () => {}), Io.set(this, () => {}), Lo.set(this, void 0), Ro.set(this, () => {}), zo.set(this, () => {}), Bo.set(this, {}), Vo.set(this, !1), Ho.set(this, !1), Uo.set(this, !1), Wo.set(this, !1), Go.set(this, void 0), Ko.set(this, void 0), qo.set(this, void 0), Jo.set(this, void 0), Yo.set(this, void 0), L.set(this, void 0), Qo.set(this, (e) => {
				if (i(this, Ho, !0, "f"), a(this, L, "f") && (a(this, L, "f").streamed = void 0), o(e) && (e = new d()), e instanceof d) return i(this, Uo, !0, "f"), this._emit("abort", e);
				if (e instanceof l) return this._emit("error", e);
				if (e instanceof Error) {
					let t = new l(e.message);
					return t.cause = e, this._emit("error", t);
				}
				return this._emit("error", new l(String(e)));
			}), i(this, Po, new Promise((e, t) => {
				i(this, Fo, e, "f"), i(this, Io, t, "f");
			}), "f"), i(this, Lo, new Promise((e, t) => {
				i(this, Ro, e, "f"), i(this, zo, t, "f");
			}), "f"), a(this, Po, "f").catch(() => {}), a(this, Lo, "f").catch(() => {}), i(this, No, e, "f"), i(this, Jo, t?.logger ?? console, "f"), i(this, Yo, t?.client, "f");
		}
		get response() {
			return a(this, Go, "f");
		}
		get request_id() {
			return a(this, Ko, "f");
		}
		get workspace_id() {
			return a(this, qo, "f");
		}
		async withResponse() {
			i(this, Wo, !0, "f");
			let e = await a(this, Po, "f");
			if (!e) throw Error("Could not resolve a `Response` object");
			return {
				data: this,
				response: e,
				request_id: e.headers.get("request-id"),
				workspace_id: e.headers.get("anthropic-workspace-id")
			};
		}
		static fromReadableStream(t) {
			let n = new e(null);
			return n._run(() => n._fromReadableStream(t)), n;
		}
		static createMessage(t, n, r, { logger: a, client: o } = {}) {
			let s = new e(n, {
				logger: a,
				client: o
			});
			for (let e of n.messages) s._addMessageParam(e);
			return i(s, No, {
				...n,
				stream: !0
			}, "f"), s._run(() => s._createMessage(t, {
				...n,
				stream: !0
			}, {
				...r,
				headers: {
					...r?.headers,
					[ha]: "stream"
				}
			})), s;
		}
		_run(e) {
			e().then(() => {
				this._emitFinal(), this._emit("end");
			}, a(this, Qo, "f"));
		}
		_addMessageParam(e) {
			this.messages.push(e);
		}
		_addMessage(e, t = !0) {
			this.receivedMessages.push(e), t && this._emit("message", e);
		}
		async _createMessage(e, t, n) {
			let r = n?.signal, o;
			r && (r.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), r.addEventListener("abort", o));
			try {
				a(this, jo, "m", $o).call(this), i(this, L, n?.__span ?? (a(this, Yo, "f") && yo(a(this, Yo, "f"), t, n)), "f");
				let { response: r, data: o } = await e.create({
					...t,
					stream: !0
				}, {
					...n,
					__span: a(this, L, "f"),
					signal: this.controller.signal
				}).withResponse();
				try {
					this._connected(r);
				} catch (e) {
					throw a(this, L, "f") && (a(this, L, "f").failure = e), o.controller.abort(), e;
				}
				for await (let e of o) try {
					a(this, jo, "m", es).call(this, e);
				} catch (e) {
					throw a(this, L, "f") && (a(this, L, "f").failure = e), e;
				}
				if (o.controller.signal?.aborted) throw new d();
				a(this, jo, "m", ts).call(this);
			} finally {
				r && o && r.removeEventListener("abort", o);
			}
		}
		_connected(e) {
			this.ended || (i(this, Go, e, "f"), i(this, Ko, e?.headers.get("request-id"), "f"), i(this, qo, e?.headers.get("anthropic-workspace-id"), "f"), a(this, Fo, "f").call(this, e), this._emit("connect"));
		}
		get ended() {
			return a(this, Vo, "f");
		}
		get errored() {
			return a(this, Ho, "f");
		}
		get aborted() {
			return a(this, Uo, "f");
		}
		abort() {
			this.controller.abort();
		}
		on(e, t) {
			return (a(this, Bo, "f")[e] || (a(this, Bo, "f")[e] = [])).push({ listener: t }), this;
		}
		off(e, t) {
			let n = a(this, Bo, "f")[e];
			if (!n) return this;
			let r = n.findIndex((e) => e.listener === t);
			return r >= 0 && n.splice(r, 1), this;
		}
		once(e, t) {
			return (a(this, Bo, "f")[e] || (a(this, Bo, "f")[e] = [])).push({
				listener: t,
				once: !0
			}), this;
		}
		emitted(e) {
			return new Promise((t, n) => {
				i(this, Wo, !0, "f"), e !== "error" && this.once("error", n), this.once(e, t);
			});
		}
		async done() {
			i(this, Wo, !0, "f"), await a(this, Lo, "f");
		}
		get currentMessage() {
			return a(this, Mo, "f");
		}
		async finalMessage() {
			return await this.done(), a(this, jo, "m", Xo).call(this);
		}
		async finalText() {
			return await this.done(), a(this, jo, "m", Zo).call(this);
		}
		_emit(e, ...t) {
			if (a(this, Vo, "f")) return;
			e === "end" && (i(this, Vo, !0, "f"), a(this, Ro, "f").call(this));
			let n = a(this, Bo, "f")[e];
			if (n && (a(this, Bo, "f")[e] = n.filter((e) => !e.once), n.forEach(({ listener: e }) => e(...t))), e === "abort") {
				let e = t[0];
				!a(this, Wo, "f") && !n?.length && Promise.reject(e), a(this, Io, "f").call(this, e), a(this, zo, "f").call(this, e), this._emit("end");
			} else if (e === "error") {
				let e = t[0];
				!a(this, Wo, "f") && !n?.length && Promise.reject(e), a(this, Io, "f").call(this, e), a(this, zo, "f").call(this, e), this._emit("end");
			}
		}
		_emitFinal() {
			this.receivedMessages.at(-1) && this._emit("finalMessage", a(this, jo, "m", Xo).call(this));
		}
		async _fromReadableStream(e, t) {
			let n = t?.signal, r;
			n && (n.aborted && this.controller.abort(), r = this.controller.abort.bind(this.controller), n.addEventListener("abort", r));
			try {
				a(this, jo, "m", $o).call(this), this._connected(null);
				let t = pn.fromReadableStream(e, this.controller);
				for await (let e of t) a(this, jo, "m", es).call(this, e);
				if (t.controller.signal?.aborted) throw new d();
				a(this, jo, "m", ts).call(this);
			} finally {
				n && r && n.removeEventListener("abort", r);
			}
		}
		[(Mo = /* @__PURE__ */ new WeakMap(), No = /* @__PURE__ */ new WeakMap(), Po = /* @__PURE__ */ new WeakMap(), Fo = /* @__PURE__ */ new WeakMap(), Io = /* @__PURE__ */ new WeakMap(), Lo = /* @__PURE__ */ new WeakMap(), Ro = /* @__PURE__ */ new WeakMap(), zo = /* @__PURE__ */ new WeakMap(), Bo = /* @__PURE__ */ new WeakMap(), Vo = /* @__PURE__ */ new WeakMap(), Ho = /* @__PURE__ */ new WeakMap(), Uo = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap(), Go = /* @__PURE__ */ new WeakMap(), Ko = /* @__PURE__ */ new WeakMap(), qo = /* @__PURE__ */ new WeakMap(), Jo = /* @__PURE__ */ new WeakMap(), Yo = /* @__PURE__ */ new WeakMap(), L = /* @__PURE__ */ new WeakMap(), Qo = /* @__PURE__ */ new WeakMap(), jo = /* @__PURE__ */ new WeakSet(), Xo = function() {
			if (this.receivedMessages.length === 0) throw new l("stream ended without producing a Message with role=assistant");
			return this.receivedMessages.at(-1);
		}, Zo = function() {
			if (this.receivedMessages.length === 0) throw new l("stream ended without producing a Message with role=assistant");
			let e = this.receivedMessages.at(-1).content.filter((e) => e.type === "text").map((e) => e.text);
			if (e.length === 0) throw new l("stream ended without producing a content block with type=text");
			return e.join(" ");
		}, $o = function() {
			this.ended || i(this, Mo, void 0, "f");
		}, es = function(e) {
			if (this.ended) return;
			let t = a(this, jo, "m", ns).call(this, e);
			if (this._emit("_rawEvent", e), t) switch (this._emit("streamEvent", e, t), e.type) {
				case "content_block_delta": {
					let n = t.content.at(-1);
					switch (e.delta.type) {
						case "text_delta":
							n.type === "text" && this._emit("text", e.delta.text, n.text || "");
							break;
						case "citations_delta":
							n.type === "text" && this._emit("citation", e.delta.citation, n.citations ?? []);
							break;
						case "input_json_delta":
							rs(n) && a(this, Bo, "f").inputJson?.length && this._emit("inputJson", e.delta.partial_json, n.input);
							break;
						case "thinking_delta":
							n.type === "thinking" && this._emit("thinking", e.delta.thinking, n.thinking);
							break;
						case "signature_delta":
							n.type === "thinking" && this._emit("signature", n.signature);
							break;
						default: e.delta;
					}
					break;
				}
				case "message_stop":
					a(this, Yo, "f") && a(this, L, "f") && a(this, No, "f") && sa(a(this, Yo, "f"), a(this, L, "f"), a(this, No, "f"), t), this._addMessageParam(t), this._addMessage(xo(t, a(this, No, "f"), { logger: a(this, Jo, "f") }), !0);
					break;
				case "content_block_stop":
					this._emit("contentBlock", t.content.at(-1));
					break;
				case "message_start": i(this, Mo, t, "f"), a(this, L, "f") && a(this, No, "f") && (a(this, L, "f").streamed = {
					body: a(this, No, "f"),
					message: t
				});
			}
		}, ts = function() {
			if (this.ended) throw new l("stream has ended, this shouldn't happen");
			let e = a(this, Mo, "f");
			if (!e) throw new l("request ended without sending any chunks");
			return i(this, Mo, void 0, "f"), xo(e, a(this, No, "f"), { logger: a(this, Jo, "f") });
		}, ns = function(e) {
			let t = a(this, Mo, "f");
			if (e.type === "message_start") {
				if (t) throw new l(`Unexpected event order, got ${e.type} before receiving "message_stop"`);
				return e.message;
			}
			if (t) switch (e.type) {
				case "message_stop": return t;
				case "message_delta": return t.stop_reason = e.delta.stop_reason, t.stop_sequence = e.delta.stop_sequence, t.stop_details = e.delta.stop_details, t.usage.output_tokens = e.usage.output_tokens, e.delta.container != null && (t.container = e.delta.container), e.usage.input_tokens != null && (t.usage.input_tokens = e.usage.input_tokens), e.usage.cache_creation_input_tokens != null && (t.usage.cache_creation_input_tokens = e.usage.cache_creation_input_tokens), e.usage.cache_read_input_tokens != null && (t.usage.cache_read_input_tokens = e.usage.cache_read_input_tokens), e.usage.server_tool_use != null && (t.usage.server_tool_use = e.usage.server_tool_use), e.usage.output_tokens_details != null && (t.usage.output_tokens_details = e.usage.output_tokens_details), t;
				case "content_block_start": return t.content.push({ ...e.content_block }), t;
				case "content_block_delta": {
					let n = t.content.at(e.index);
					switch (e.delta.type) {
						case "text_delta":
							n?.type === "text" && (t.content[e.index] = {
								...n,
								text: (n.text || "") + e.delta.text
							});
							break;
						case "citations_delta":
							n?.type === "text" && (t.content[e.index] = {
								...n,
								citations: [...n.citations ?? [], e.delta.citation]
							});
							break;
						case "input_json_delta":
							if (n && rs(n)) {
								let r = (n.__json_buf || "") + e.delta.partial_json;
								t.content[e.index] = Ao(n, r);
							}
							break;
						case "thinking_delta":
							n?.type === "thinking" && (t.content[e.index] = {
								...n,
								thinking: n.thinking + e.delta.thinking
							});
							break;
						case "signature_delta":
							n?.type === "thinking" && (t.content[e.index] = {
								...n,
								signature: e.delta.signature
							});
							break;
						default: e.delta;
					}
					return t;
				}
				case "content_block_stop": {
					let n = t.content.at(e.index);
					return n && rs(n) && "__json_buf" in n && Object.defineProperty(n, "input", {
						value: n.input,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}), t;
				}
				default: return t;
			}
		}, Symbol.asyncIterator)]() {
			let e = [], t = [], n = !1;
			return this.on("_rawEvent", (n) => {
				let r = t.shift();
				r ? r.resolve(n) : e.push(n);
			}), this.on("end", () => {
				n = !0;
				for (let e of t) e.resolve(void 0);
				t.length = 0;
			}), this.on("abort", (e) => {
				n = !0;
				for (let n of t) n.reject(e);
				t.length = 0;
			}), this.on("error", (e) => {
				n = !0;
				for (let n of t) n.reject(e);
				t.length = 0;
			}), {
				next: async () => e.length ? {
					value: e.shift(),
					done: !1
				} : n ? {
					value: void 0,
					done: !0
				} : new Promise((e, n) => t.push({
					resolve: e,
					reject: n
				})).then((e) => e ? {
					value: e,
					done: !1
				} : {
					value: void 0,
					done: !0
				}),
				return: async () => (this.abort(), {
					value: void 0,
					done: !0
				})
			};
		}
		toReadableStream() {
			return new pn(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
		}
	}
	return e;
})();
// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
b();
var as = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t, n) {
			this.iterator = e, this.response = n, this.controller = t;
		}
		async *decoder() {
			let e = this.iterator;
			if (!e) throw new l("Cannot iterate over a consumed stream.");
			this.iterator = void 0;
			let t = new Xt();
			for await (let n of e) for (let e of t.decode(n)) yield JSON.parse(e);
			for (let e of t.flush()) yield JSON.parse(e);
		}
		[Symbol.asyncIterator]() {
			return this.decoder();
		}
		static fromResponse(t, n) {
			if (!t.body) throw n.abort(), globalThis.navigator !== void 0 && globalThis.navigator.product === "ReactNative" ? new l("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api") : new l("Attempted to iterate over a response with no body");
			return new e(Ne(t.body), n, t);
		}
	}
	return e;
})();
// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
b();
function os(e) {
	return e.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null)), R = /* @__PURE__ */ ((e = os) => function(t, ...n) {
	if (t.length === 1) return t[0];
	let r = !1, i = [], a = t.reduce((t, a, o) => {
		/[?#]/.test(a) && (r = !0);
		let s = n[o], c = (r ? encodeURIComponent : e)("" + s);
		return o !== n.length && (s == null || typeof s == "object" && s.toString === Object.getPrototypeOf(Object.getPrototypeOf(s.hasOwnProperty ?? ss) ?? ss)?.toString) && (c = s + "", i.push({
			start: t.length + a.length,
			length: c.length,
			error: `Value of type ${Object.prototype.toString.call(s).slice(8, -1)} is not a valid path parameter`
		})), !r && c === "" && i.push({
			start: t.length + a.length,
			length: 0,
			error: "Value \"\" can't be safely passed as a path parameter"
		}), t + a + (o === n.length ? "" : c);
	}, ""), o = a.split(/[?#]/, 1)[0], s = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi, c;
	for (; (c = s.exec(o)) !== null;) i.push({
		start: c.index,
		length: c[0].length,
		error: `Value "${c[0]}" can\'t be safely passed as a path parameter`
	});
	if (i.sort((e, t) => e.start - t.start), i.length > 0) {
		let e = [];
		for (let t of i) for (let n = t.start; n < t.start + Math.max(1, t.length); n++) e[n] = "^";
		let t = Array.from(e, (e) => e ?? " ").join("");
		throw new l(`Path parameters result in path with invalid segments:\n${i.map((e) => e.error).join("\n")}\n${a}\n${t}`);
	}
	return a;
})(os);
// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
b();
var cs = class extends I {
	create(e, t) {
		let { user_profile_id: n, workspace_id: r, ...i } = e;
		return this._client.post("/v1/messages/batches", {
			body: i,
			...t,
			headers: D([{
				...n == null ? void 0 : { "anthropic-user-profile-id": n },
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.messages.batches.create", t, {
				route: "/v1/messages/batches",
				attributes: { "anthropic.message.batch.request_count": i.requests?.length },
				createdIDAttribute: "anthropic.message.batch.id"
			})
		});
	}
	retrieve(e, t = {}, n) {
		let { workspace_id: r } = t ?? {};
		return this._client.get(R`/v1/messages/batches/${e}`, {
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.messages.batches.retrieve", n, {
				route: "/v1/messages/batches/{message_batch_id}",
				attributes: { "anthropic.message.batch.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { workspace_id: n, ...r } = e ?? {};
		return this._client.getAPIList("/v1/messages/batches", P, {
			query: r,
			...t,
			headers: D([{ ...n == null ? void 0 : { "anthropic-workspace-id": n } }, t?.headers]),
			__span: k(this._client, "anthropic.messages.batches.list", t, {
				route: "/v1/messages/batches",
				queryParams: [
					"after_id",
					"before_id",
					"limit"
				]
			})
		});
	}
	delete(e, t = {}, n) {
		let { workspace_id: r } = t ?? {};
		return this._client.delete(R`/v1/messages/batches/${e}`, {
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.messages.batches.delete", n, {
				route: "/v1/messages/batches/{message_batch_id}",
				attributes: { "anthropic.message.batch.id": e }
			})
		});
	}
	cancel(e, t = {}, n) {
		let { workspace_id: r } = t ?? {};
		return this._client.post(R`/v1/messages/batches/${e}/cancel`, {
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.messages.batches.cancel", n, {
				route: "/v1/messages/batches/{message_batch_id}/cancel",
				attributes: { "anthropic.message.batch.id": e }
			})
		});
	}
	async results(e, t = {}, n) {
		let r = await this.retrieve(e, t, n);
		if (!r.results_url) throw new l(`No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`);
		let { workspace_id: i } = t ?? {};
		return this._client.get(r.results_url, {
			...n,
			headers: D([{
				Accept: "application/binary",
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			stream: !0,
			__binaryResponse: !0,
			__span: k(this._client, "anthropic.messages.batches.results", n, {
				route: "/v1/messages/batches/{message_batch_id}/results",
				attributes: { "anthropic.message.batch.id": e }
			})
		})._thenUnwrap((e, t) => as.fromResponse(t.response, t.controller));
	}
}, ls = {
	"claude-opus-4@20250514": 8192,
	"anthropic.claude-opus-4-1-20250805-v1:0": 8192,
	"claude-opus-4-1@20250805": 8192
}, us = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.batches = new cs(this._client);
		}
		create(e, t) {
			let { user_profile_id: n, workspace_id: r, ...i } = e;
			i.model in ds && console.warn(`The model '${i.model}' is deprecated and will reach end-of-life on ${ds[i.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`), fs.includes(i.model) && i.thinking && i.thinking.type === "enabled" && console.warn(`Using Claude with ${i.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
			let a = t?.timeout ?? this._client._options.timeout;
			if (!i.stream && a == null) {
				let e = ls[i.model] ?? void 0;
				a = this._client.calculateNonstreamingTimeout(i.max_tokens, e);
			}
			let o = vo(e, t), s = this._client._tracer && k(this._client, "anthropic.messages.create", t, $i(this._client, i, o));
			ea(this._client, s, i);
			let c = this._client.post("/v1/messages", {
				body: i,
				timeout: a ?? 6e5,
				...t,
				__span: s,
				headers: o,
				stream: e.stream ?? !1
			});
			return s ? c._thenUnwrap((e) => (ta(this._client, s, i, e), e)) : c;
		}
		parse(e, t) {
			return this.create(e, t).then((t) => So(t, e, { logger: this._client.logger ?? console }));
		}
		stream(e, t) {
			let n = e;
			return is.createMessage(this, n, t, {
				logger: this._client.logger ?? console,
				client: this._client
			});
		}
		countTokens(e, t) {
			let { user_profile_id: n, workspace_id: r, ...i } = e, a = D([{
				...n == null ? void 0 : { "anthropic-user-profile-id": n },
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]), o = k(this._client, "anthropic.messages.count_tokens", t, {
				route: "/v1/messages/count_tokens",
				attributes: { [Yr]: i.model }
			}), s = this._client.post("/v1/messages/count_tokens", {
				body: i,
				...t,
				__span: o,
				headers: a
			});
			return o ? s._thenUnwrap((e) => (na(this._client, o, e), e)) : s;
		}
	}
	return e.Batches = cs, e;
})(), ds = {
	"claude-sonnet-4-5": "November 30th, 2026",
	"claude-sonnet-4-5-20250929": "November 30th, 2026"
}, fs = ["claude-mythos-preview", "claude-opus-4-6"], ps = class extends I {
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/deployment_runs/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployment_runs.retrieve", n, {
				route: "/v1/deployment_runs/{deployment_run_id}",
				attributes: { "anthropic.deployment_run.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/deployment_runs?beta=true", F, {
			query: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.deployment_runs.list", t, {
				route: "/v1/deployment_runs",
				queryParams: [
					"created_at[gt]",
					"created_at[gte]",
					"created_at[lt]",
					"created_at[lte]",
					"deployment_id",
					"has_error",
					"limit",
					"page",
					"trigger_type"
				]
			})
		});
	}
}, ms = class extends I {
	create(e, t) {
		let { betas: n, workspace_id: r, ...i } = e;
		return this._client.post("/v1/deployments?beta=true", {
			body: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.deployments.create", t, {
				route: "/v1/deployments",
				createdIDAttribute: "anthropic.deployment.id"
			})
		});
	}
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/deployments/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployments.retrieve", n, {
				route: "/v1/deployments/{deployment_id}",
				attributes: { "anthropic.deployment.id": e }
			})
		});
	}
	update(e, t, n) {
		let { betas: r, workspace_id: i, ...a } = t;
		return this._client.post(R`/v1/deployments/${e}?beta=true`, {
			body: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployments.update", n, {
				route: "/v1/deployments/{deployment_id}",
				attributes: { "anthropic.deployment.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/deployments?beta=true", F, {
			query: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.deployments.list", t, {
				route: "/v1/deployments",
				queryParams: [
					"agent_id",
					"created_at[gte]",
					"created_at[lte]",
					"include_archived",
					"limit",
					"page",
					"status"
				]
			})
		});
	}
	archive(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/deployments/${e}/archive?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployments.archive", n, {
				route: "/v1/deployments/{deployment_id}/archive",
				attributes: { "anthropic.deployment.id": e }
			})
		});
	}
	pause(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/deployments/${e}/pause?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployments.pause", n, {
				route: "/v1/deployments/{deployment_id}/pause",
				attributes: { "anthropic.deployment.id": e }
			})
		});
	}
	run(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/deployments/${e}/run?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployments.run", n, {
				route: "/v1/deployments/{deployment_id}/run",
				attributes: { "anthropic.deployment.id": e }
			})
		});
	}
	unpause(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/deployments/${e}/unpause?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.deployments.unpause", n, {
				route: "/v1/deployments/{deployment_id}/unpause",
				attributes: { "anthropic.deployment.id": e }
			})
		});
	}
}, hs = class extends I {
	create(e, t) {
		let { betas: n, workspace_id: r, ...i } = e;
		return this._client.post("/v1/dreams?beta=true", {
			body: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "dreaming-2026-04-21"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.dreams.create", t, {
				route: "/v1/dreams",
				createdIDAttribute: "anthropic.dream.id"
			})
		});
	}
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/dreams/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "dreaming-2026-04-21"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.dreams.retrieve", n, {
				route: "/v1/dreams/{dream_id}",
				attributes: { "anthropic.dream.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/dreams?beta=true", F, {
			query: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "dreaming-2026-04-21"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.dreams.list", t, {
				route: "/v1/dreams",
				queryParams: [
					"created_at[gt]",
					"created_at[lt]",
					"include_archived",
					"limit",
					"page",
					"statuses"
				]
			})
		});
	}
	archive(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/dreams/${e}/archive?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "dreaming-2026-04-21"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.dreams.archive", n, {
				route: "/v1/dreams/{dream_id}/archive",
				attributes: { "anthropic.dream.id": e }
			})
		});
	}
	cancel(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/dreams/${e}/cancel?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "dreaming-2026-04-21"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.dreams.cancel", n, {
				route: "/v1/dreams/{dream_id}/cancel",
				attributes: { "anthropic.dream.id": e }
			})
		});
	}
}, gs = class extends I {
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/files?beta=true", F, {
			query: i,
			...t,
			headers: D([{
				...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.files.list", t, {
				route: "/v1/files",
				queryParams: [
					"ids",
					"limit",
					"page",
					"scope_id"
				]
			})
		});
	}
	delete(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.delete(R`/v1/files/${e}?beta=true`, {
			...n,
			headers: D([{
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.files.delete", n, {
				route: "/v1/files/{file_id}",
				attributes: { "anthropic.file.id": e }
			})
		});
	}
	download(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/files/${e}/content?beta=true`, {
			...n,
			headers: D([{
				Accept: "application/binary",
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__binaryResponse: !0,
			__span: k(this._client, "anthropic.files.download", n, {
				route: "/v1/files/{file_id}/content",
				attributes: { "anthropic.file.id": e }
			})
		});
	}
	retrieveMetadata(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/files/${e}?beta=true`, {
			...n,
			headers: D([{
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.files.retrieve_metadata", n, {
				route: "/v1/files/{file_id}",
				attributes: { "anthropic.file.id": e }
			})
		});
	}
	upload(e, t) {
		let { betas: n, workspace_id: r, ...i } = e;
		return this._client.post("/v1/files?beta=true", to({
			body: i,
			...t,
			headers: D([
				{
					...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				},
				xa(i.file),
				t?.headers
			]),
			__span: k(this._client, "anthropic.files.upload", t, {
				route: "/v1/files",
				createdIDAttribute: "anthropic.file.id"
			})
		}, this._client));
	}
}, _s = class extends I {
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/models/${e}?beta=true`, {
			...n,
			headers: D([{
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.models.retrieve", n, {
				route: "/v1/models/{model_id}",
				attributes: { "anthropic.model.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/models?beta=true", P, {
			query: i,
			...t,
			headers: D([{
				...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.models.list", t, {
				route: "/v1/models",
				queryParams: [
					"after_id",
					"before_id",
					"lifecycle",
					"limit"
				]
			})
		});
	}
}, vs = class extends I {
	create(e, t) {
		let { betas: n, workspace_id: r, ...i } = e;
		return this._client.post("/v1/user_profiles?beta=true", {
			body: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "user-profiles-2026-08-18"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.user_profiles.create", t, {
				route: "/v1/user_profiles",
				createdIDAttribute: "anthropic.user_profile.id"
			})
		});
	}
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/user_profiles/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "user-profiles-2026-08-18"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.user_profiles.retrieve", n, {
				route: "/v1/user_profiles/{user_profile_id}",
				attributes: { "anthropic.user_profile.id": e }
			})
		});
	}
	update(e, t, n) {
		let { betas: r, workspace_id: i, ...a } = t;
		return this._client.post(R`/v1/user_profiles/${e}?beta=true`, {
			body: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "user-profiles-2026-08-18"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.user_profiles.update", n, {
				route: "/v1/user_profiles/{user_profile_id}",
				attributes: { "anthropic.user_profile.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/user_profiles?beta=true", F, {
			query: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "user-profiles-2026-08-18"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.user_profiles.list", t, {
				route: "/v1/user_profiles",
				queryParams: [
					"limit",
					"order",
					"order_by",
					"page"
				]
			})
		});
	}
	createEnrollmentURL(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/user_profiles/${e}/enrollment_url?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "user-profiles-2026-08-18"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.user_profiles.create_enrollment_url", n, {
				route: "/v1/user_profiles/{user_profile_id}/enrollment_url",
				attributes: { "anthropic.user_profile.id": e }
			})
		});
	}
}, ys = /* @__PURE__ */ n(((e, t, n) => {
	var r = n && n.__extends || (function() {
		var e = function(t, n) {
			return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
				e.__proto__ = t;
			} || function(e, t) {
				for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
			}, e(t, n);
		};
		return function(t, n) {
			e(t, n);
			function r() {
				this.constructor = t;
			}
			t.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
		};
	})();
	Object.defineProperty(e, "__esModule", { value: !0 });
	var i = 256, a = function() {
		function e(e) {
			e === void 0 && (e = "="), this._paddingCharacter = e;
		}
		return e.prototype.encodedLength = function(e) {
			return this._paddingCharacter ? (e + 2) / 3 * 4 | 0 : (e * 8 + 5) / 6 | 0;
		}, e.prototype.encode = function(e) {
			for (var t = "", n = 0; n < e.length - 2; n += 3) {
				var r = e[n] << 16 | e[n + 1] << 8 | e[n + 2];
				t += this._encodeByte(r >>> 18 & 63), t += this._encodeByte(r >>> 12 & 63), t += this._encodeByte(r >>> 6 & 63), t += this._encodeByte(r >>> 0 & 63);
			}
			var i = e.length - n;
			if (i > 0) {
				var r = e[n] << 16 | (i === 2 ? e[n + 1] << 8 : 0);
				t += this._encodeByte(r >>> 18 & 63), t += this._encodeByte(r >>> 12 & 63), t += i === 2 ? this._encodeByte(r >>> 6 & 63) : this._paddingCharacter || "", t += this._paddingCharacter || "";
			}
			return t;
		}, e.prototype.maxDecodedLength = function(e) {
			return this._paddingCharacter ? e / 4 * 3 | 0 : (e * 6 + 7) / 8 | 0;
		}, e.prototype.decodedLength = function(e) {
			return this.maxDecodedLength(e.length - this._getPaddingLength(e));
		}, e.prototype.decode = function(e) {
			if (e.length === 0) return /* @__PURE__ */ new Uint8Array();
			for (var t = this._getPaddingLength(e), n = e.length - t, r = new Uint8Array(this.maxDecodedLength(n)), a = 0, o = 0, s = 0, c = 0, l = 0, u = 0, d = 0; o < n - 4; o += 4) c = this._decodeChar(e.charCodeAt(o + 0)), l = this._decodeChar(e.charCodeAt(o + 1)), u = this._decodeChar(e.charCodeAt(o + 2)), d = this._decodeChar(e.charCodeAt(o + 3)), r[a++] = c << 2 | l >>> 4, r[a++] = l << 4 | u >>> 2, r[a++] = u << 6 | d, s |= c & i, s |= l & i, s |= u & i, s |= d & i;
			if (o < n - 1 && (c = this._decodeChar(e.charCodeAt(o)), l = this._decodeChar(e.charCodeAt(o + 1)), r[a++] = c << 2 | l >>> 4, s |= c & i, s |= l & i), o < n - 2 && (u = this._decodeChar(e.charCodeAt(o + 2)), r[a++] = l << 4 | u >>> 2, s |= u & i), o < n - 3 && (d = this._decodeChar(e.charCodeAt(o + 3)), r[a++] = u << 6 | d, s |= d & i), s !== 0) throw Error("Base64Coder: incorrect characters for decoding");
			return r;
		}, e.prototype._encodeByte = function(e) {
			var t = e;
			return t += 65, t += 25 - e >>> 8 & 6, t += 51 - e >>> 8 & -75, t += 61 - e >>> 8 & -15, t += 62 - e >>> 8 & 3, String.fromCharCode(t);
		}, e.prototype._decodeChar = function(e) {
			var t = i;
			return t += (42 - e & e - 44) >>> 8 & -i + e - 43 + 62, t += (46 - e & e - 48) >>> 8 & -i + e - 47 + 63, t += (47 - e & e - 58) >>> 8 & -i + e - 48 + 52, t += (64 - e & e - 91) >>> 8 & -i + e - 65 + 0, t += (96 - e & e - 123) >>> 8 & -i + e - 97 + 26, t;
		}, e.prototype._getPaddingLength = function(e) {
			var t = 0;
			if (this._paddingCharacter) {
				for (var n = e.length - 1; n >= 0 && e[n] === this._paddingCharacter; n--) t++;
				if (e.length < 4 || t > 2) throw Error("Base64Coder: incorrect padding");
			}
			return t;
		}, e;
	}();
	e.Coder = a;
	var o = new a();
	function s(e) {
		return o.encode(e);
	}
	e.encode = s;
	function c(e) {
		return o.decode(e);
	}
	e.decode = c;
	var l = function(e) {
		r(t, e);
		function t() {
			return e !== null && e.apply(this, arguments) || this;
		}
		return t.prototype._encodeByte = function(e) {
			var t = e;
			return t += 65, t += 25 - e >>> 8 & 6, t += 51 - e >>> 8 & -75, t += 61 - e >>> 8 & -13, t += 62 - e >>> 8 & 49, String.fromCharCode(t);
		}, t.prototype._decodeChar = function(e) {
			var t = i;
			return t += (44 - e & e - 46) >>> 8 & -i + e - 45 + 62, t += (94 - e & e - 96) >>> 8 & -i + e - 95 + 63, t += (47 - e & e - 58) >>> 8 & -i + e - 48 + 52, t += (64 - e & e - 91) >>> 8 & -i + e - 65 + 0, t += (96 - e & e - 123) >>> 8 & -i + e - 97 + 26, t;
		}, t;
	}(a);
	e.URLSafeCoder = l;
	var u = new l();
	function d(e) {
		return u.encode(e);
	}
	e.encodeURLSafe = d;
	function f(e) {
		return u.decode(e);
	}
	e.decodeURLSafe = f, e.encodedLength = function(e) {
		return o.encodedLength(e);
	}, e.maxDecodedLength = function(e) {
		return o.maxDecodedLength(e);
	}, e.decodedLength = function(e) {
		return o.decodedLength(e);
	};
})), bs = /* @__PURE__ */ n(((e, t, n) => {
	(function(e, n) {
		var r = {};
		n(r);
		var i = r.default;
		for (var a in r) i[a] = r[a];
		typeof t == "object" && typeof t.exports == "object" ? t.exports = i : typeof define == "function" && define.amd ? define(function() {
			return i;
		}) : e.sha256 = i;
	})(n, function(e) {
		e.__esModule = !0, e.digestLength = 32, e.blockSize = 64;
		var t = new Uint32Array([
			1116352408,
			1899447441,
			3049323471,
			3921009573,
			961987163,
			1508970993,
			2453635748,
			2870763221,
			3624381080,
			310598401,
			607225278,
			1426881987,
			1925078388,
			2162078206,
			2614888103,
			3248222580,
			3835390401,
			4022224774,
			264347078,
			604807628,
			770255983,
			1249150122,
			1555081692,
			1996064986,
			2554220882,
			2821834349,
			2952996808,
			3210313671,
			3336571891,
			3584528711,
			113926993,
			338241895,
			666307205,
			773529912,
			1294757372,
			1396182291,
			1695183700,
			1986661051,
			2177026350,
			2456956037,
			2730485921,
			2820302411,
			3259730800,
			3345764771,
			3516065817,
			3600352804,
			4094571909,
			275423344,
			430227734,
			506948616,
			659060556,
			883997877,
			958139571,
			1322822218,
			1537002063,
			1747873779,
			1955562222,
			2024104815,
			2227730452,
			2361852424,
			2428436474,
			2756734187,
			3204031479,
			3329325298
		]);
		function n(e, n, r, i, a) {
			for (var o, s, c, l, u, d, f, p, m, h, g, _, v; a >= 64;) {
				for (o = n[0], s = n[1], c = n[2], l = n[3], u = n[4], d = n[5], f = n[6], p = n[7], h = 0; h < 16; h++) g = i + h * 4, e[h] = (r[g] & 255) << 24 | (r[g + 1] & 255) << 16 | (r[g + 2] & 255) << 8 | r[g + 3] & 255;
				for (h = 16; h < 64; h++) m = e[h - 2], _ = (m >>> 17 | m << 15) ^ (m >>> 19 | m << 13) ^ m >>> 10, m = e[h - 15], v = (m >>> 7 | m << 25) ^ (m >>> 18 | m << 14) ^ m >>> 3, e[h] = (_ + e[h - 7] | 0) + (v + e[h - 16] | 0);
				for (h = 0; h < 64; h++) _ = (((u >>> 6 | u << 26) ^ (u >>> 11 | u << 21) ^ (u >>> 25 | u << 7)) + (u & d ^ ~u & f) | 0) + (p + (t[h] + e[h] | 0) | 0) | 0, v = ((o >>> 2 | o << 30) ^ (o >>> 13 | o << 19) ^ (o >>> 22 | o << 10)) + (o & s ^ o & c ^ s & c) | 0, p = f, f = d, d = u, u = l + _ | 0, l = c, c = s, s = o, o = _ + v | 0;
				n[0] += o, n[1] += s, n[2] += c, n[3] += l, n[4] += u, n[5] += d, n[6] += f, n[7] += p, i += 64, a -= 64;
			}
			return i;
		}
		var r = function() {
			function t() {
				this.digestLength = e.digestLength, this.blockSize = e.blockSize, this.state = /* @__PURE__ */ new Int32Array(8), this.temp = /* @__PURE__ */ new Int32Array(64), this.buffer = /* @__PURE__ */ new Uint8Array(128), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1, this.reset();
			}
			return t.prototype.reset = function() {
				return this.state[0] = 1779033703, this.state[1] = 3144134277, this.state[2] = 1013904242, this.state[3] = 2773480762, this.state[4] = 1359893119, this.state[5] = 2600822924, this.state[6] = 528734635, this.state[7] = 1541459225, this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1, this;
			}, t.prototype.clean = function() {
				for (var e = 0; e < this.buffer.length; e++) this.buffer[e] = 0;
				for (var e = 0; e < this.temp.length; e++) this.temp[e] = 0;
				this.reset();
			}, t.prototype.update = function(e, t) {
				if (t === void 0 && (t = e.length), this.finished) throw Error("SHA256: can't update because hash was finished.");
				var r = 0;
				if (this.bytesHashed += t, this.bufferLength > 0) {
					for (; this.bufferLength < 64 && t > 0;) this.buffer[this.bufferLength++] = e[r++], t--;
					this.bufferLength === 64 && (n(this.temp, this.state, this.buffer, 0, 64), this.bufferLength = 0);
				}
				for (t >= 64 && (r = n(this.temp, this.state, e, r, t), t %= 64); t > 0;) this.buffer[this.bufferLength++] = e[r++], t--;
				return this;
			}, t.prototype.finish = function(e) {
				if (!this.finished) {
					var t = this.bytesHashed, r = this.bufferLength, i = t / 536870912 | 0, a = t << 3, o = t % 64 < 56 ? 64 : 128;
					this.buffer[r] = 128;
					for (var s = r + 1; s < o - 8; s++) this.buffer[s] = 0;
					this.buffer[o - 8] = i >>> 24 & 255, this.buffer[o - 7] = i >>> 16 & 255, this.buffer[o - 6] = i >>> 8 & 255, this.buffer[o - 5] = i >>> 0 & 255, this.buffer[o - 4] = a >>> 24 & 255, this.buffer[o - 3] = a >>> 16 & 255, this.buffer[o - 2] = a >>> 8 & 255, this.buffer[o - 1] = a >>> 0 & 255, n(this.temp, this.state, this.buffer, 0, o), this.finished = !0;
				}
				for (var s = 0; s < 8; s++) e[s * 4 + 0] = this.state[s] >>> 24 & 255, e[s * 4 + 1] = this.state[s] >>> 16 & 255, e[s * 4 + 2] = this.state[s] >>> 8 & 255, e[s * 4 + 3] = this.state[s] >>> 0 & 255;
				return this;
			}, t.prototype.digest = function() {
				var e = new Uint8Array(this.digestLength);
				return this.finish(e), e;
			}, t.prototype._saveState = function(e) {
				for (var t = 0; t < this.state.length; t++) e[t] = this.state[t];
			}, t.prototype._restoreState = function(e, t) {
				for (var n = 0; n < this.state.length; n++) this.state[n] = e[n];
				this.bytesHashed = t, this.finished = !1, this.bufferLength = 0;
			}, t;
		}();
		e.Hash = r;
		var i = function() {
			function e(e) {
				this.inner = new r(), this.outer = new r(), this.blockSize = this.inner.blockSize, this.digestLength = this.inner.digestLength;
				var t = new Uint8Array(this.blockSize);
				if (e.length > this.blockSize) new r().update(e).finish(t).clean();
				else for (var n = 0; n < e.length; n++) t[n] = e[n];
				for (var n = 0; n < t.length; n++) t[n] ^= 54;
				this.inner.update(t);
				for (var n = 0; n < t.length; n++) t[n] ^= 106;
				this.outer.update(t), this.istate = /* @__PURE__ */ new Uint32Array(8), this.ostate = /* @__PURE__ */ new Uint32Array(8), this.inner._saveState(this.istate), this.outer._saveState(this.ostate);
				for (var n = 0; n < t.length; n++) t[n] = 0;
			}
			return e.prototype.reset = function() {
				return this.inner._restoreState(this.istate, this.inner.blockSize), this.outer._restoreState(this.ostate, this.outer.blockSize), this;
			}, e.prototype.clean = function() {
				for (var e = 0; e < this.istate.length; e++) this.ostate[e] = this.istate[e] = 0;
				this.inner.clean(), this.outer.clean();
			}, e.prototype.update = function(e) {
				return this.inner.update(e), this;
			}, e.prototype.finish = function(e) {
				return this.outer.finished ? this.outer.finish(e) : (this.inner.finish(e), this.outer.update(e, this.digestLength).finish(e)), this;
			}, e.prototype.digest = function() {
				var e = new Uint8Array(this.digestLength);
				return this.finish(e), e;
			}, e;
		}();
		e.HMAC = i;
		function a(e) {
			var t = new r().update(e), n = t.digest();
			return t.clean(), n;
		}
		e.hash = a, e.default = a;
		function o(e, t) {
			var n = new i(e).update(t), r = n.digest();
			return n.clean(), r;
		}
		e.hmac = o;
		function s(e, t, n, r) {
			var i = r[0];
			if (i === 0) throw Error("hkdf: cannot expand more");
			t.reset(), i > 1 && t.update(e), n && t.update(n), t.update(r), t.finish(e), r[0]++;
		}
		var c = new Uint8Array(e.digestLength);
		function l(e, t, n, r) {
			t === void 0 && (t = c), r === void 0 && (r = 32);
			for (var a = new Uint8Array([1]), l = new i(o(t, e)), u = new Uint8Array(l.digestLength), d = u.length, f = new Uint8Array(r), p = 0; p < r; p++) d === u.length && (s(u, l, n, a), d = 0), f[p] = u[d++];
			return l.clean(), u.fill(0), a.fill(0), f;
		}
		e.hkdf = l;
		function u(e, t, n, r) {
			for (var a = new i(e), o = a.digestLength, s = /* @__PURE__ */ new Uint8Array(4), c = new Uint8Array(o), l = new Uint8Array(o), u = new Uint8Array(r), d = 0; d * o < r; d++) {
				var f = d + 1;
				s[0] = f >>> 24 & 255, s[1] = f >>> 16 & 255, s[2] = f >>> 8 & 255, s[3] = f >>> 0 & 255, a.reset(), a.update(t), a.update(s), a.finish(l);
				for (var p = 0; p < o; p++) c[p] = l[p];
				for (var p = 2; p <= n; p++) {
					a.reset(), a.update(l).finish(l);
					for (var m = 0; m < o; m++) c[m] ^= l[m];
				}
				for (var p = 0; p < o && d * o + p < r; p++) u[d * o + p] = c[p];
			}
			for (var d = 0; d < o; d++) c[d] = l[d] = 0;
			for (var d = 0; d < 4; d++) s[d] = 0;
			return a.clean(), u;
		}
		e.pbkdf2 = u;
	});
})), xs = /* @__PURE__ */ n(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.timingSafeEqual = n;
	function t(e, t = "") {
		if (!e) throw Error(t);
	}
	function n(e, n) {
		if (e.byteLength !== n.byteLength) return !1;
		e instanceof DataView || (e = new DataView(ArrayBuffer.isView(e) ? e.buffer : e)), n instanceof DataView || (n = new DataView(ArrayBuffer.isView(n) ? n.buffer : n)), t(e instanceof DataView), t(n instanceof DataView);
		let r = e.byteLength, i = 0, a = -1;
		for (; ++a < r;) i |= e.getUint8(a) ^ n.getUint8(a);
		return i === 0;
	}
})), Ss = (/* @__PURE__ */ n(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Webhook = e.WebhookVerificationError = void 0;
	var t = ys(), n = bs(), r = xs(), i = 300, a = class e extends Error {
		constructor(t) {
			super(t), Object.setPrototypeOf(this, e.prototype), this.name = "ExtendableError", this.stack = Error(t).stack;
		}
	}, o = class e extends a {
		constructor(t) {
			super(t), Object.setPrototypeOf(this, e.prototype), this.name = "WebhookVerificationError";
		}
	};
	e.WebhookVerificationError = o;
	var s = class e {
		constructor(n, r) {
			if (r?.format === "raw") this.key = n instanceof Uint8Array ? n : Uint8Array.from(n, (e) => e.charCodeAt(0));
			else {
				if (typeof n != "string") throw Error("Expected secret to be of type string");
				n.startsWith(e.prefix) && (n = n.substring(e.prefix.length)), this.key = t.decode(n);
			}
			if (this.key.length === 0) throw Error("Secret can't be empty.");
		}
		verify(e, t, n) {
			let i = n?.jsonParse ?? !0, a = {};
			for (let e of Object.keys(t)) a[e.toLowerCase()] = t[e];
			let s = a["webhook-id"], c = a["webhook-signature"], l = a["webhook-timestamp"];
			if (!c || !s || !l) throw new o("Missing required headers");
			let u = this.verifyTimestamp(l), d = this.sign(s, u, e).split(",")[1], f = c.split(" "), p = new globalThis.TextEncoder();
			for (let t of f) {
				let [n, a] = t.split(",");
				if (n === "v1" && (0, r.timingSafeEqual)(p.encode(a), p.encode(d))) {
					let t = e.toString();
					return t === "" ? void 0 : i ? JSON.parse(t) : void 0;
				}
			}
			throw new o("No matching signature found");
		}
		sign(e, r, i) {
			if (typeof i != "string") {
				if (i.constructor.name === "Buffer") i = i.toString();
				else throw Error("Expected payload to be of type string or Buffer.");
			}
			let a = new TextEncoder(), o = Math.floor(r.getTime() / 1e3), s = a.encode(`${e}.${o}.${i}`);
			return `v1,${t.encode(n.hmac(this.key, s))}`;
		}
		verifyTimestamp(e) {
			let t = Math.floor(Date.now() / 1e3), n = parseInt(e, 10);
			if (Number.isNaN(n)) throw new o("Invalid Signature Headers");
			if (t - n > i) throw new o("Message timestamp too old");
			if (n > t + i) throw new o("Message timestamp too new");
			return /* @__PURE__ */ new Date(n * 1e3);
		}
	};
	e.Webhook = s, s.prefix = "whsec_";
})))(), Cs = class extends I {
	parseUnverified(e) {
		return JSON.parse(e);
	}
	unwrap(e, t) {
		let n = t?.headers;
		if (n == null) throw Error("Webhook headers are required in order to verify the signature");
		let r = t.key === void 0 ? this._client.webhookKey : t.key;
		if (!r) throw Error("Webhook key must not be null or empty in order to unwrap");
		return new Ss.Webhook(r).verify(e, n), JSON.parse(e);
	}
}, ws = class extends I {
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/agents/${e}/versions?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.agents.versions.list", n, {
				route: "/v1/agents/{agent_id}/versions",
				queryParams: ["limit", "page"],
				attributes: { "gen_ai.agent.id": e }
			})
		});
	}
}, Ts = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.versions = new ws(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e;
			return this._client.post("/v1/agents?beta=true", {
				body: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.agents.create", t, {
					route: "/v1/agents",
					createdIDAttribute: "gen_ai.agent.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i, ...a } = t ?? {};
			return this._client.get(R`/v1/agents/${e}?beta=true`, {
				query: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.agents.retrieve", n, {
					route: "/v1/agents/{agent_id}",
					queryParams: ["version"],
					attributes: { "gen_ai.agent.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/agents/${e}?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.agents.update", n, {
					route: "/v1/agents/{agent_id}",
					attributes: { "gen_ai.agent.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/agents?beta=true", F, {
				query: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.agents.list", t, {
					route: "/v1/agents",
					queryParams: [
						"created_at[gte]",
						"created_at[lte]",
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/agents/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.agents.archive", n, {
					route: "/v1/agents/{agent_id}/archive",
					attributes: { "gen_ai.agent.id": e }
				})
			});
		}
	}
	return e.Versions = ws, e;
})();
// node_modules/@anthropic-ai/sdk/internal/utils/abort.mjs
function Es(e, t) {
	if (!e) return () => {};
	if (e.aborted) return t.abort(), () => {};
	let n = () => t.abort();
	return e.addEventListener("abort", n), () => e.removeEventListener("abort", n);
}
// node_modules/@anthropic-ai/sdk/internal/utils/backoff.mjs
b();
function Ds(e, t) {
	return e instanceof u && e.status === t;
}
function Os(e) {
	return e instanceof u && typeof e.status == "number" && e.status >= 400 && e.status < 500;
}
function ks(e) {
	return Os(e) && !Ds(e, 408) && !Ds(e, 409) && !Ds(e, 429);
}
function As(e, t, n) {
	return Math.min(t * 2 ** e, n);
}
function js(e, t) {
	return e + Math.random() * (t - e);
}
function Ms(e) {
	return e * (1 - Math.random() * .25);
}
// node_modules/@anthropic-ai/sdk/lib/helper-client.mjs
b();
function Ns(e, { authToken: t, helper: n }) {
	if (!t) throw new l(`copyClientForHelper: expected a non-empty authToken but received ${JSON.stringify(t)}`);
	let r = e._options.defaultHeaders, i = e._authState?.extraHeaders, a = D([
		i ? Object.fromEntries(Object.entries(i).filter(([e]) => {
			let t = e.toLowerCase();
			return t !== "authorization" && t !== "x-api-key";
		})) : void 0,
		r,
		{ [ma]: n }
	]);
	return e.withOptions({
		apiKey: null,
		authToken: t,
		baseURL: e.baseURL,
		credentials: void 0,
		defaultHeaders: a
	});
}
// node_modules/@anthropic-ai/sdk/lib/environments/poller.mjs
b();
var Ps, Fs, z, Is, Ls, Rs, zs, Bs, Vs, Hs, Us, Ws, Gs, Ks = 1e3, qs = 6e4, Js = 3e5, Ys = /* @__PURE__ */ (() => {
	class e {
		constructor(e) {
			Ps.set(this, void 0), Fs.set(this, !1), z.set(this, void 0), Is.set(this, void 0), Ls.set(this, void 0), Rs.set(this, void 0), zs.set(this, void 0), Bs.set(this, void 0), Vs.set(this, void 0), this.client = e.client, this.environmentId = e.environmentId, this.environmentKey = e.environmentKey, this.workerId = e.workerId ?? Qs(), i(this, Ps, Ns(e.client, {
				authToken: e.environmentKey,
				helper: "environments-work-poller"
			}), "f"), i(this, Ls, e.autoStop ?? !0, "f"), i(this, Rs, e.drain ?? !1, "f"), i(this, zs, e.blockMs === void 0 ? 999 : e.blockMs, "f"), i(this, Bs, e.reclaimOlderThanMs ?? null, "f"), i(this, Vs, e.requestOptions, "f"), i(this, z, new AbortController(), "f"), i(this, Is, Es(e.signal, a(this, z, "f")), "f");
		}
		get signal() {
			return a(this, z, "f").signal;
		}
		abort() {
			a(this, z, "f").abort();
		}
		async *[(Ps = /* @__PURE__ */ new WeakMap(), Fs = /* @__PURE__ */ new WeakMap(), z = /* @__PURE__ */ new WeakMap(), Is = /* @__PURE__ */ new WeakMap(), Ls = /* @__PURE__ */ new WeakMap(), Rs = /* @__PURE__ */ new WeakMap(), zs = /* @__PURE__ */ new WeakMap(), Bs = /* @__PURE__ */ new WeakMap(), Vs = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
			if (a(this, Fs, "f")) throw new l("Cannot iterate over a consumed WorkPoller");
			i(this, Fs, !0, "f");
			let e = S.active(), t = E(this.client);
			t.info("poller starting", {
				component: "work-poller",
				environment_id: this.environmentId
			});
			let n = new Zs(t, this.environmentId);
			try {
				let r = 0;
				for (; !a(this, z, "f").signal.aborted;) {
					let i;
					try {
						i = await a(this, Ps, "f").beta.environments.work.poll(this.environmentId, {
							"Anthropic-Worker-ID": this.workerId,
							...a(this, zs, "f") === null ? {} : { block_ms: a(this, zs, "f") },
							...a(this, Bs, "f") === null ? {} : { reclaim_older_than_ms: a(this, Bs, "f") }
						}, {
							headers: D([a(this, Vs, "f")?.headers]),
							signal: a(this, z, "f").signal
						});
					} catch (e) {
						if (a(this, z, "f").signal.aborted) return;
						if (ks(e)) throw t.error("poll failed permanently, stopping poller", { error: String(e) }), e;
						let n = Ms(Xs(r));
						t.warn("poll failed, backing off", {
							error: String(e),
							backoff_ms: n
						}), r++, await fe(n, a(this, z, "f").signal);
						continue;
					}
					if (r = 0, i == null) {
						if (a(this, Rs, "f")) return;
						n.onEmptyPoll(), await fe(js(1e3, 3e3), a(this, z, "f").signal);
					} else {
						n.onClaim(), this._workSpan = O(this.client, () => ua(this.client, i, e)), t.info("claimed work", {
							component: "work-poller",
							environment_id: this.environmentId,
							work_id: i.id,
							work_type: i.data.type
						});
						try {
							await a(this, Ps, "f").beta.environments.work.ack(i.id, { environment_id: i.environment_id }, {
								headers: D([a(this, Vs, "f")?.headers]),
								signal: a(this, z, "f").signal
							});
						} catch (e) {
							t.error("ack failed", {
								work_id: i.id,
								error: String(e)
							}), O(this.client, () => fa(this._workSpan, a(this, z, "f").signal, e));
							continue;
						}
						try {
							yield i, e = S.active();
						} finally {
							if (a(this, Ls, "f")) try {
								await a(this, Ps, "f").beta.environments.work.stop(i.id, { environment_id: i.environment_id }, { headers: D([a(this, Vs, "f")?.headers]) });
							} catch (e) {
								Ds(e, 409) || t.warn("stop failed", {
									work_id: i.id,
									error: String(e)
								});
							}
							O(this.client, () => da(this._workSpan, a(this, z, "f").signal));
						}
					}
				}
			} finally {
				a(this, Is, "f").call(this);
			}
		}
	}
	return e;
})();
function Xs(e) {
	return As(e, Ks, qs);
}
var Zs = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t) {
			Hs.set(this, void 0), Us.set(this, void 0), Ws.set(this, void 0), Gs.set(this, 0), i(this, Hs, e, "f"), i(this, Us, t, "f");
		}
		onEmptyPoll() {
			let e = Date.now(), t = {
				component: "work-poller",
				environment_id: a(this, Us, "f")
			};
			a(this, Ws, "f") === void 0 ? (i(this, Ws, i(this, Gs, e, "f"), "f"), a(this, Hs, "f").info("idle; polling for work", t)) : e - a(this, Gs, "f") >= Js ? (i(this, Gs, e, "f"), a(this, Hs, "f").info(`still polling; idle for ${Math.round((e - a(this, Ws, "f")) / 1e3)}s`, t)) : a(this, Hs, "f").debug("poll returned no work", t);
		}
		onClaim() {
			i(this, Ws, void 0, "f");
		}
	}
	return Hs = /* @__PURE__ */ new WeakMap(), Us = /* @__PURE__ */ new WeakMap(), Ws = /* @__PURE__ */ new WeakMap(), Gs = /* @__PURE__ */ new WeakMap(), e;
})();
function Qs() {
	let e = globalThis.process?.env?.HOSTNAME;
	return e ? `${e}-${Ta()}` : Ta();
}
// node_modules/@anthropic-ai/sdk/internal/utils/async-queue.mjs
var $s, ec, tc, nc = /* @__PURE__ */ (() => {
	class e {
		constructor() {
			$s.set(this, []), ec.set(this, []), tc.set(this, !1);
		}
		push(e) {
			if (a(this, tc, "f")) return !1;
			let t = a(this, ec, "f").shift();
			return t ? t({
				done: !1,
				value: e
			}) : a(this, $s, "f").push(e), !0;
		}
		close() {
			if (!a(this, tc, "f")) for (i(this, tc, !0, "f"); a(this, ec, "f").length > 0;) a(this, ec, "f").shift()({
				done: !0,
				value: void 0
			});
		}
		next(e) {
			return a(this, $s, "f").length > 0 ? Promise.resolve({
				done: !1,
				value: a(this, $s, "f").shift()
			}) : a(this, tc, "f") || e?.aborted ? Promise.resolve({
				done: !0,
				value: void 0
			}) : new Promise((t) => {
				let n = (n) => {
					e?.removeEventListener("abort", r), t(n);
				}, r = () => {
					let e = a(this, ec, "f").indexOf(n);
					e >= 0 && a(this, ec, "f").splice(e, 1), t({
						done: !0,
						value: void 0
					});
				};
				a(this, ec, "f").push(n), e?.addEventListener("abort", r, { once: !0 });
			});
		}
		tryShift() {
			return a(this, $s, "f").shift();
		}
	}
	return $s = /* @__PURE__ */ new WeakMap(), ec = /* @__PURE__ */ new WeakMap(), tc = /* @__PURE__ */ new WeakMap(), e;
})(), rc = /* @__PURE__ */ (() => {
	class e extends Error {
		constructor(e) {
			let t = typeof e == "string" ? e : e.map((e) => e.type === "text" ? e.text : `[${e.type}]`).join(" ");
			super(t), this.name = "ToolError", this.content = e;
		}
	}
	return e;
})(), ic = /* @__PURE__ */ RegExp("[\\x00-\\x1f\\x7f-\\x9f\\u061c\\u200e\\u200f\\u2028\\u2029\\u202a-\\u202e\\u2066-\\u2069]+", "g"), ac = /[\uD800-\uDFFF]/gu;
function oc(e) {
	return e.replace(ac, "�");
}
var sc = 4096, cc = 200;
function lc(e, t = sc) {
	return mc(oc(e).replace(ic, " ").trim(), t);
}
function uc(e) {
	return lc(e, cc);
}
function dc(e) {
	return uc(e).replace(/[' ]+/g, " ").trim();
}
function fc(e) {
	return `Error: ${e instanceof Error ? e.message : String(e)}`;
}
function pc(e) {
	return mc(oc(fc(e)), sc);
}
function mc(e, t) {
	if (e.length <= t) return e;
	let n = 0, r = 0;
	for (let i of e) {
		if (r === t) break;
		r += 1, n += i.length;
	}
	return e.slice(0, n);
}
function hc(e) {
	return typeof e == "string" ? oc(e) : e.filter((e) => e.type === "text" && e.text !== "").map((e) => ({
		...e,
		text: oc(e.text)
	}));
}
// node_modules/@anthropic-ai/sdk/lib/tools/BetaRunnableTool.mjs
function gc(e) {
	return "name" in e ? e.name : "mcp_server_name" in e ? e.mcp_server_name : e.type;
}
function _c(e) {
	return e instanceof rc ? e.content : fc(e);
}
async function vc(e, t, n) {
	try {
		let r = e.parse ? e.parse(t) : t;
		return {
			content: await e.run(r, n),
			isError: !1
		};
	} catch (e) {
		return {
			content: _c(e),
			isError: !0
		};
	}
}
// node_modules/@anthropic-ai/sdk/lib/tools/SessionToolRunner.mjs
b();
var yc, bc, xc, Sc, Cc, B, wc, V, Tc, Ec, Dc, H, Oc, U, kc, Ac, jc, Mc, Nc, Pc, W, Fc, Ic, Lc, Rc, zc, Bc, Vc, Hc, Uc, Wc, Gc, Kc, qc, Jc, Yc, Xc, Zc = 500, Qc = 1e4, $c = 12e4, el = 3e4, tl = 1e3, nl = 3e4, rl = 3e5;
function il(e) {
	return e.type === "session.status_idle" && e.stop_reason?.type !== "requires_action";
}
var al = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t) {
			yc.set(this, void 0), bc.set(this, void 0), xc.set(this, /* @__PURE__ */ new Set()), Sc.set(this, !1), Cc.set(this, void 0), i(this, yc, e, "f"), i(this, bc, t, "f");
		}
		noteEvent(e) {
			e.type !== "user.tool_confirmation" && (il(e) ? this.arm() : this.disarm());
		}
		block(e) {
			a(this, xc, "f").add(e), a(this, Cc, "f") !== void 0 && (i(this, Sc, !0, "f"), clearTimeout(a(this, Cc, "f")), i(this, Cc, void 0, "f"));
		}
		unblock(e) {
			a(this, xc, "f").delete(e), a(this, xc, "f").size === 0 && a(this, Sc, "f") && this.arm();
		}
		arm() {
			a(this, yc, "f") <= 0 || (a(this, xc, "f").size > 0 ? i(this, Sc, !0, "f") : (i(this, Sc, !1, "f"), a(this, Cc, "f") !== void 0 && clearTimeout(a(this, Cc, "f")), i(this, Cc, setTimeout(a(this, bc, "f"), a(this, yc, "f")), "f")));
		}
		disarm() {
			i(this, Sc, !1, "f"), a(this, Cc, "f") !== void 0 && (clearTimeout(a(this, Cc, "f")), i(this, Cc, void 0, "f"));
		}
	}
	return yc = /* @__PURE__ */ new WeakMap(), bc = /* @__PURE__ */ new WeakMap(), xc = /* @__PURE__ */ new WeakMap(), Sc = /* @__PURE__ */ new WeakMap(), Cc = /* @__PURE__ */ new WeakMap(), e;
})(), ol = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t) {
			B.add(this), wc.set(this, !1), V.set(this, void 0), Tc.set(this, void 0), Ec.set(this, void 0), Dc.set(this, void 0), H.set(this, void 0), Oc.set(this, /* @__PURE__ */ new Set()), U.set(this, /* @__PURE__ */ new Set()), kc.set(this, /* @__PURE__ */ new Map()), Ac.set(this, /* @__PURE__ */ new Map()), jc.set(this, new nc()), Mc.set(this, 0), Nc.set(this, rl), Pc.set(this, null), W.set(this, void 0), Fc.set(this, void 0), Ic.set(this, void 0), Lc.set(this, !1), this.client = t.client, this.sessionId = e, this.tools = t.tools, this.maxIdleMs = t.maxIdleMs ?? 6e4, i(this, H, E(t.client), "f"), i(this, Dc, new Map(t.tools.map((e) => [gc(e), e])), "f"), i(this, V, new AbortController(), "f"), i(this, Tc, Es(t.signal, a(this, V, "f")), "f"), i(this, Ec, t.requestOptions, "f"), i(this, W, new al(this.maxIdleMs, () => {
				a(this, H, "f").info("session idle after its turn ended; stopping", {
					component: "session-tool-runner",
					session_id: this.sessionId,
					max_idle_ms: this.maxIdleMs
				}), a(this, V, "f").abort();
			}), "f");
		}
		get signal() {
			return a(this, V, "f").signal;
		}
		abort() {
			a(this, V, "f").abort();
		}
		_setSendRetryWindow(e) {
			i(this, Nc, e, "f");
		}
		async *[(wc = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), Tc = /* @__PURE__ */ new WeakMap(), Ec = /* @__PURE__ */ new WeakMap(), Dc = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), Oc = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), kc = /* @__PURE__ */ new WeakMap(), Ac = /* @__PURE__ */ new WeakMap(), jc = /* @__PURE__ */ new WeakMap(), Mc = /* @__PURE__ */ new WeakMap(), Nc = /* @__PURE__ */ new WeakMap(), Pc = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), Fc = /* @__PURE__ */ new WeakMap(), Ic = /* @__PURE__ */ new WeakMap(), Lc = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
			if (a(this, wc, "f")) throw new l("Cannot iterate over a consumed SessionToolRunner");
			i(this, wc, !0, "f"), i(this, Fc, this.client._tracer ? S.active() : void 0, "f"), a(this, H, "f").info("session tool runner starting", {
				component: "session-tool-runner",
				session_id: this.sessionId
			});
			let e = a(this, B, "m", zc).call(this).catch((e) => {
				a(this, V, "f").signal.aborted || a(this, H, "f").error("stream loop failed", { error: String(e) }), a(this, V, "f").abort();
			});
			try {
				for (;;) {
					let e = await a(this, jc, "f").next(a(this, V, "f").signal);
					if (e.done) break;
					yield e.value;
				}
				await e;
				let t;
				for (; (t = a(this, jc, "f").tryShift()) !== void 0;) yield t;
			} finally {
				a(this, V, "f").abort(), a(this, W, "f").disarm(), await e;
				try {
					await a(this, B, "m", Xc).call(this);
				} catch (e) {
					a(this, H, "f").warn("drain failed", { error: String(e) });
				}
				a(this, jc, "f").close();
				for (let e of this.tools) try {
					await e.close?.();
				} catch (t) {
					a(this, H, "f").warn("tool.close failed", {
						tool: gc(e),
						error: String(t)
					});
				}
				a(this, Tc, "f").call(this);
			}
		}
	}
	return Rc = function() {
		return {
			...a(this, Ec, "f"),
			headers: D([ga("session-tool-runner"), a(this, Ec, "f")?.headers]),
			signal: a(this, V, "f").signal
		};
	}, zc = async function() {
		let e = a(this, V, "f"), t = Zc;
		for (; !e.signal.aborted;) {
			try {
				let e = await this.client.beta.sessions.events.stream(this.sessionId, {}, a(this, B, "m", Rc).call(this));
				await a(this, B, "m", Bc).call(this);
				for await (let n of e) if (t = Zc, await a(this, B, "m", Uc).call(this, n)) return;
			} catch (n) {
				if (e.signal.throwIfAborted(), ks(n)) throw a(this, H, "f").error("permanent stream failure, shutting down", { error: String(n) }), e.abort(), n;
				a(this, H, "f").warn("stream disconnected, reconnecting", {
					error: String(n),
					backoff_ms: t
				});
			}
			e.signal.throwIfAborted(), await fe(t, e.signal), t = Math.min(t * 2, Qc);
		}
	}, Bc = async function() {
		let e = a(this, V, "f"), t = [], n = !1;
		i(this, Lc, !1, "f");
		try {
			for await (let e of this.client.beta.sessions.events.list(this.sessionId, { limit: 1e3 }, a(this, B, "m", Rc).call(this))) a(this, B, "m", Vc).call(this, e, t), e.type !== "user.tool_confirmation" && (n = il(e));
		} catch (n) {
			e.signal.throwIfAborted(), a(this, H, "f").warn("reconcile list failed", { error: String(n) });
			for (let e of t) a(this, Oc, "f").delete(e.id);
			return;
		}
		i(this, Lc, !0, "f");
		let r = t.filter((e) => !a(this, U, "f").has(e.id));
		a(this, W, "f").disarm();
		for (let e of r) await a(this, B, "m", Wc).call(this, e);
		for (let e of [...a(this, Ac, "f").values()]) {
			let t = a(this, kc, "f").get(e.id);
			t !== void 0 && await a(this, B, "m", Kc).call(this, e, t);
		}
		let o = r.filter((e) => !a(this, U, "f").has(e.id) && !a(this, Ac, "f").has(e.id));
		n && o.length === 0 ? a(this, W, "f").arm() : a(this, W, "f").disarm();
	}, Vc = function(e, t) {
		a(this, B, "m", Hc).call(this, e), e.type === "agent.tool_use" || e.type === "agent.custom_tool_use" ? (a(this, Oc, "f").add(e.id), a(this, U, "f").has(e.id) || t.push(e)) : e.type === "user.tool_result" ? a(this, U, "f").add(e.tool_use_id) : e.type === "user.custom_tool_result" ? a(this, U, "f").add(e.custom_tool_use_id) : e.type === "user.tool_confirmation" && (a(this, U, "f").has(e.tool_use_id) || a(this, kc, "f").set(e.tool_use_id, e.result));
	}, Hc = function(e) {
		if (this.client._tracer && a(this, Ic, "f") === void 0) switch (e.type) {
			case "session.thread_status_running":
			case "session.thread_status_idle":
			case "session.thread_status_rescheduled":
			case "session.thread_status_terminated": i(this, Ic, e.session_thread_id, "f");
		}
	}, Uc = async function(e) {
		switch (a(this, W, "f").noteEvent(e), a(this, Lc, "f") && a(this, B, "m", Hc).call(this, e), e.type) {
			case "agent.tool_use":
			case "agent.custom_tool_use": return a(this, Oc, "f").has(e.id) || (a(this, Oc, "f").add(e.id), await a(this, B, "m", Wc).call(this, e)), !1;
			case "user.tool_confirmation": return await a(this, B, "m", Gc).call(this, e), !1;
			case "user.tool_result": return a(this, U, "f").add(e.tool_use_id), !1;
			case "user.custom_tool_result": return a(this, U, "f").add(e.custom_tool_use_id), !1;
			case "session.status_terminated":
			case "session.deleted": return a(this, H, "f").info("session terminated", {
				component: "session-tool-runner",
				session_id: this.sessionId
			}), a(this, V, "f").abort(), !0;
			default: return !1;
		}
	}, Wc = async function(e) {
		let t = e.evaluated_permission, n = t === "deny" ? "deny" : a(this, kc, "f").get(e.id);
		n === void 0 ? t === void 0 || t === "allow" ? await a(this, B, "m", Jc).call(this, e, void 0) : a(this, Ac, "f").has(e.id) || (a(this, H, "f").info("tool call awaiting confirmation; holding", {
			component: "session-tool-runner",
			session_id: this.sessionId,
			tool: e.name,
			tool_use_id: e.id
		}), a(this, Ac, "f").set(e.id, e), a(this, W, "f").block(e.id)) : await a(this, B, "m", Kc).call(this, e, n);
	}, Gc = async function(e) {
		a(this, kc, "f").set(e.tool_use_id, e.result);
		let t = a(this, Ac, "f").get(e.tool_use_id);
		t !== void 0 && await a(this, B, "m", Kc).call(this, t, e.result);
	}, Kc = async function(e, t) {
		let n = a(this, Ac, "f").delete(e.id);
		if (t === "allow") {
			a(this, H, "f").info("tool call confirmed", {
				component: "session-tool-runner",
				session_id: this.sessionId,
				tool: e.name,
				tool_use_id: e.id
			}), n || a(this, W, "f").block(e.id);
			try {
				await a(this, B, "m", Jc).call(this, e, "allow");
			} finally {
				a(this, W, "f").unblock(e.id);
			}
		} else n && a(this, W, "f").unblock(e.id), a(this, U, "f").add(e.id), a(this, H, "f").info("tool call denied; not executing", {
			component: "session-tool-runner",
			session_id: this.sessionId,
			tool: e.name,
			tool_use_id: e.id
		}), a(this, B, "m", qc).call(this, {
			event: e,
			toolUseId: e.id,
			name: e.name,
			isError: !1,
			posted: !1,
			confirmation: "deny"
		});
	}, qc = function(e) {
		a(this, jc, "f").push(e);
	}, Jc = async function(e, t) {
		var n, r;
		if (!a(this, U, "f").has(e.id)) {
			a(this, H, "f").info("executing tool", {
				component: "session-tool-runner",
				session_id: this.sessionId,
				tool: e.name,
				tool_use_id: e.id
			}), i(this, Mc, (n = a(this, Mc, "f"), n++, n), "f");
			try {
				let n = a(this, Dc, "f").get(e.name);
				if (!n) {
					a(this, H, "f").info("tool not owned by this runner; leaving the tool_use_id pending for its owner", {
						component: "session-tool-runner",
						session_id: this.sessionId,
						tool: e.name,
						tool_use_id: e.id
					}), t === "allow" && a(this, W, "f").disarm(), a(this, B, "m", qc).call(this, {
						event: e,
						toolUseId: e.id,
						name: e.name,
						isError: !1,
						posted: !1,
						confirmation: t
					});
					return;
				}
				let r, i, o = a(this, Ec, "f")?.openTelemetry?.conversationId ?? (e.session_thread_id || a(this, Ic, "f")), s = new AbortController(), c = Es(a(this, V, "f").signal, s), l = setTimeout(() => s.abort(), $c);
				try {
					let t = {
						signal: a(this, V, "f").signal,
						conversationId: o,
						sessionID: this.sessionId,
						parentContext: a(this, Fc, "f")
					}, c = await Ca(this.client, n, e, t, async () => {
						let t = await vc(n, e.input, {
							toolUse: e,
							toolUseBlock: e,
							signal: s.signal
						}), r = cl(t.content);
						return {
							sent: r,
							content: this.client._tracer ? r.map((e, n) => {
								let r = typeof t.content == "string" ? void 0 : t.content[n];
								return r && r.type !== "text" && e.type === "text" ? r : e;
							}) : r,
							isError: t.isError
						};
					});
					r = c.sent, i = c.isError;
				} finally {
					clearTimeout(l), c();
				}
				let u = sl(e, i, r), d = await a(this, B, "m", Yc).call(this, u, e.id, o);
				a(this, B, "m", qc).call(this, {
					event: e,
					result: u,
					toolUseId: e.id,
					name: e.name,
					isError: i,
					posted: d,
					confirmation: t
				});
			} finally {
				i(this, Mc, (r = a(this, Mc, "f"), r--, r), "f"), a(this, Mc, "f") === 0 && a(this, Pc, "f")?.call(this);
			}
		}
	}, Yc = async function(e, t, n) {
		let r = a(this, V, "f"), i = Date.now(), o, s = 0;
		for (;;) {
			s++, r.signal.throwIfAborted();
			try {
				return await this.client.beta.sessions.events.send(this.sessionId, { events: [e] }, {
					...a(this, B, "m", Rc).call(this),
					openTelemetry: { conversationId: n }
				}), a(this, U, "f").add(t), !0;
			} catch (e) {
				if (o = e, ks(e)) break;
				let n = a(this, Nc, "f") - (Date.now() - i);
				if (n <= 0) break;
				let c = Math.min(Ms(As(s - 1, tl, nl)), n);
				a(this, H, "f").warn("tool result send failed; retrying", {
					tool_use_id: t,
					attempt: s,
					backoff_ms: c,
					error: String(e)
				}), await fe(c, r.signal);
			}
		}
		return a(this, H, "f").error("failed to send tool result", {
			tool_use_id: t,
			attempts: s,
			error: String(o)
		}), !1;
	}, Xc = async function() {
		a(this, Mc, "f") !== 0 && (await Promise.race([new Promise((e) => i(this, Pc, e, "f")), fe(el)]), i(this, Pc, null, "f"), a(this, Mc, "f") > 0 && a(this, H, "f").warn("drain timeout exceeded"));
	}, e;
})();
function sl(e, t, n) {
	return e.type === "agent.custom_tool_use" ? {
		type: "user.custom_tool_result",
		custom_tool_use_id: e.id,
		is_error: t,
		content: n
	} : {
		type: "user.tool_result",
		tool_use_id: e.id,
		is_error: t,
		content: n
	};
}
function cl(e) {
	if (typeof e == "string") return [{
		type: "text",
		text: e || "(no output)"
	}];
	let t = e.map((e) => e.type === "text" ? {
		type: "text",
		text: e.text || "(no output)"
	} : e.type === "image" || e.type === "document" ? e : e.type === "search_result" ? {
		type: "search_result",
		source: e.source,
		title: e.title,
		content: e.content.map((e) => ({
			type: "text",
			text: e.text
		})),
		citations: { enabled: e.citations?.enabled ?? !1 }
	} : {
		type: "text",
		text: JSON.stringify(e)
	});
	return t.length > 0 ? t : [{
		type: "text",
		text: "(no output)"
	}];
}
// node_modules/@anthropic-ai/sdk/tools/agent-toolset/sync-interval.mjs
function ll(e, t) {
	if (!(e >= 5e3)) throw new l(`${t} must be at least ${dl}ms (got ${e}); to run without memory sync, pass \`memorySyncIntervalMs: null\` to the worker instead`);
}
var ul, dl, fl = t((() => {
	b(), ul = 15e3, dl = 5e3;
})), pl = /* @__PURE__ */ r({
	BashSession: () => kl,
	BashTimeoutError: () => Ol,
	DEFAULT_MEMORY_SYNC_INTERVAL_MS: () => ul,
	MARKER_PATH: () => Tl,
	MEMORY_FLUSH_TIMEOUT_MS: () => wl,
	MIN_MEMORY_SYNC_INTERVAL_MS: () => dl,
	SessionMemoryError: () => El,
	SessionMemoryStores: () => Dl,
	betaAgentToolset20260401: () => gl,
	betaBashTool: () => vl,
	betaEditTool: () => xl,
	betaGlobTool: () => Sl,
	betaGrepTool: () => Cl,
	betaReadTool: () => yl,
	betaWriteTool: () => bl,
	extractSkillArchive: () => hl,
	resolvePath: () => _l,
	setupSkills: () => ml
});
function G(e) {
	throw new l(`${e} requires Node.js or a Node-compatible runtime`);
}
function ml(e) {
	return G("setupSkills");
}
function hl(e, t) {
	return G("extractSkillArchive");
}
function gl(e) {
	return G("betaAgentToolset20260401");
}
function _l(e, t) {
	return G("resolvePath");
}
function vl(e) {
	return G("betaBashTool");
}
function yl(e) {
	return G("betaReadTool");
}
function bl(e) {
	return G("betaWriteTool");
}
function xl(e) {
	return G("betaEditTool");
}
function Sl(e) {
	return G("betaGlobTool");
}
function Cl(e) {
	return G("betaGrepTool");
}
var wl, Tl, El, Dl, Ol, kl, Al = t((() => {
	b(), fl(), wl = 3e4, Tl = ".anthropic-memory-store", El = class extends l {
		constructor(e, t) {
			super(e), this.name = "SessionMemoryError", t !== void 0 && (this.cause = t);
		}
	}, Dl = class {
		constructor(e, t) {
			G("SessionMemoryStores");
		}
		get roots() {
			return G("SessionMemoryStores");
		}
		get readOnlyRoots() {
			return G("SessionMemoryStores");
		}
		download(e) {
			return G("SessionMemoryStores");
		}
		finish() {
			return G("SessionMemoryStores");
		}
		syncAll(e) {
			return G("SessionMemoryStores");
		}
		syncIfDue() {
			return G("SessionMemoryStores");
		}
		flushWrites(e) {
			return G("SessionMemoryStores");
		}
		dispose() {
			return G("SessionMemoryStores");
		}
	}, Ol = class extends l {
		constructor(e) {
			super(`bash command timed out after ${e}ms`), this.name = "BashTimeoutError", this.timeoutMs = e;
		}
	}, kl = class {
		constructor(e, t) {
			G("BashSession");
		}
		get closed() {
			return G("BashSession");
		}
		exec(e, t = {}) {
			return G("BashSession");
		}
		close() {
			G("BashSession");
		}
	};
}));
b(), fl();
var jl, Ml, Nl, Pl, Fl, Il = 3e4, Ll = 9e4, Rl = "NO_HEARTBEAT";
function zl(e) {
	return e.resources.some((e) => e.type === "memory_store");
}
function Bl(e) {
	if (!e) return null;
	let t;
	try {
		let n = e.replace(/-/g, "+").replace(/_/g, "/"), r = n.padEnd(Math.ceil(n.length / 4) * 4, "=");
		t = JSON.parse(Yt(wa(r)));
	} catch {
		return null;
	}
	if (typeof t != "object" || !t || Array.isArray(t)) return null;
	let n = t.sessions_token;
	return typeof n == "string" && n !== "" ? n : null;
}
var Vl = /* @__PURE__ */ (() => {
	class e {
		constructor(e) {
			if (jl.add(this), Ml.set(this, void 0), e.unrestrictedPaths !== void 0) throw new l("The `unrestrictedPaths` option you passed to EnvironmentWorker (or client.beta.environments.work.worker()) is no longer supported. The worker's file tools (read, write, edit, glob, grep) are now always confined to `workdir` plus the session's memory folders. Remove `unrestrictedPaths` from your options; to let the file tools reach any other directory, add it to `AgentToolContext.allowedRoots` from a `tools` factory.");
			this.client = e.client, this.environmentId = e.environmentId, this.environmentKey = e.environmentKey, this.tools = e.tools, this.workdir = e.workdir ?? process.cwd(), this.maxFileBytes = e.maxFileBytes, this.maxIdleMs = e.maxIdleMs, e.memorySyncIntervalMs != null && ll(e.memorySyncIntervalMs, "memorySyncIntervalMs"), this.memorySyncIntervalMs = e.memorySyncIntervalMs, this.memorySyncDeletions = e.memorySyncDeletions ?? "enabled", this.workerId = e.workerId, this.requestOptions = e.requestOptions, i(this, Ml, e.signal, "f");
		}
		async run(e) {
			let { environmentId: t, environmentKey: n } = this;
			if (t === void 0 || n === void 0) throw new l("EnvironmentWorker.run: environmentId and environmentKey are required to poll for work");
			let r = e ?? a(this, Ml, "f"), i = new Ys({
				client: this.client,
				environmentId: t,
				environmentKey: n,
				...this.workerId === void 0 ? {} : { workerId: this.workerId },
				...r ? { signal: r } : {},
				...this.requestOptions === void 0 ? {} : { requestOptions: this.requestOptions },
				autoStop: !1
			});
			for await (let e of i) {
				let t = i._workSpan;
				try {
					await pa(this.client, t, i.signal, () => a(this, jl, "m", Nl).call(this, e, n, i.signal, t));
				} catch (t) {
					if (i.signal?.aborted) throw t;
					E(this.client).error("work item failed", {
						work_id: e.id,
						error: String(t)
					});
				}
			}
		}
		async handleItem(e) {
			let t = e?.workId ?? T("ANTHROPIC_WORK_ID"), n = e?.environmentId ?? T("ANTHROPIC_ENVIRONMENT_ID"), r = e?.sessionId ?? T("ANTHROPIC_SESSION_ID"), i = (e?.environmentKey ?? this.environmentKey ?? T("ANTHROPIC_ENVIRONMENT_KEY")) || void 0, o = e?.workSecret || T("ANTHROPIC_WORK_SECRET") || null;
			if (!t) throw new l("handleItem: workId is required — pass it or set ANTHROPIC_WORK_ID");
			if (!n) throw new l("handleItem: environmentId is required — pass it or set ANTHROPIC_ENVIRONMENT_ID");
			if (!r) throw new l("handleItem: sessionId is required — pass it or set ANTHROPIC_SESSION_ID");
			if (!i && !o) throw new l("handleItem: environmentKey is required when there is no work secret — pass it, construct the worker with it, or set ANTHROPIC_ENVIRONMENT_KEY");
			let s = {
				id: t,
				environment_id: n,
				secret: o,
				data: {
					type: "session",
					id: r
				}
			};
			await a(this, jl, "m", Nl).call(this, s, i, e?.signal ?? a(this, Ml, "f"));
		}
	}
	return Ml = /* @__PURE__ */ new WeakMap(), jl = /* @__PURE__ */ new WeakSet(), Nl = async function(e, t, n, r) {
		let i = E(this.client), a = Bl(e.secret), o = a ?? t;
		if (o === void 0) throw new l("handleItem: the work item carried a secret payload but no sessions token could be extracted, and there is no environment key to fall back to; the poller must issue a secret whose payload carries `sessions_token`, or provide the environment key (pass it, construct the worker with it, or set ANTHROPIC_ENVIRONMENT_KEY)");
		e.secret && a === null && i.warn("work item carried a secret payload but no sessions token could be extracted; falling back to the environment key", { work_id: e.id });
		let s = Ns(this.client, {
			authToken: o,
			helper: "environments-worker"
		}), c = e.data.id, u = new AbortController(), d = Es(n, u), f = new Wl(u), p = await Promise.resolve().then(() => (Al(), pl)), m, h, g = Kl(s, e, f, i, this.requestOptions, (e) => {
			m = e, h?._setSendRetryWindow(e);
		}).catch((t) => {
			u.signal.aborted || i.error("heartbeat loop failed", {
				work_id: e.id,
				error: String(t)
			}), u.abort();
		}), _ = async () => {}, v, y = !1;
		try {
			if (e.data.type !== "session") {
				i.debug("skipping non-session work item", {
					work_id: e.id,
					type: e.data.type
				});
				return;
			}
			let t = await s.beta.sessions.retrieve(c);
			if (a === null && this.memorySyncIntervalMs !== null && zl(t)) throw new p.SessionMemoryError(`cannot mount the session's memories: the work item carried no sessions token (work_id=${e.id}, session_id=${c}); the memory endpoints reject the environment key, so the poller must issue a per-item \`secret\` carrying \`sessions_token\`, or set \`memorySyncIntervalMs: null\` to run without memory`);
			let n = {
				workdir: this.workdir,
				client: s,
				session: t,
				...this.maxFileBytes === void 0 ? {} : { maxFileBytes: this.maxFileBytes }
			};
			try {
				_ = await p.setupSkills(n);
			} catch (t) {
				i.warn("skill setup failed", {
					session_id: c,
					work_id: e.id,
					error: String(t)
				});
			}
			a !== null && this.memorySyncIntervalMs !== null ? (v = new p.SessionMemoryStores(s, {
				workdir: this.workdir,
				...this.memorySyncIntervalMs === void 0 ? {} : { syncIntervalMs: this.memorySyncIntervalMs },
				syncDeletions: this.memorySyncDeletions
			}), await v.download(t), n.allowedRoots = v.roots, n.readOnlyRoots = v.readOnlyRoots) : i.debug("memory stores disabled for this item", { work_id: e.id }), h = new ol(c, {
				client: s,
				tools: typeof this.tools == "function" ? this.tools(n) : this.tools ?? p.betaAgentToolset20260401(n),
				...this.maxIdleMs === void 0 ? {} : { maxIdleMs: this.maxIdleMs },
				...this.requestOptions === void 0 ? {} : { requestOptions: this.requestOptions },
				signal: u.signal
			}), m !== void 0 && h._setSendRetryWindow(m);
			for await (let e of h) v && await v.syncIfDue();
			y = !u.signal.aborted;
		} finally {
			try {
				await _().catch((t) => {
					i.warn("skill cleanup failed", {
						session_id: c,
						work_id: e.id,
						error: String(t)
					});
				});
			} finally {
				if (v) {
					let t = p.MEMORY_FLUSH_TIMEOUT_MS;
					y && await Hl(v.finish(), t) && i.warn(`final memory sync cut off after ${t}ms; the flush that follows still uploads changed files`, {
						session_id: c,
						work_id: e.id
					});
					let n = new AbortController();
					await Hl(v.flushWrites(n.signal), t) && (n.abort(), i.warn(`memory flush cut off after ${t}ms; changed files it had not uploaded yet are not saved`, {
						session_id: c,
						work_id: e.id
					})), await v.dispose().catch((t) => {
						i.warn("memory store cleanup failed", {
							session_id: c,
							work_id: e.id,
							error: String(t)
						});
					});
				}
			}
			f.finish("runner_done"), d(), await g, f.lost ? i.info("lease lost; released without stopping it", {
				session_id: c,
				work_id: e.id
			}) : await Ul(s, e, i, this.requestOptions), (f.lost || f.rejected) && O(this.client, () => r?.end());
		}
	}, e;
})();
async function Hl(e, t) {
	let n;
	try {
		return await Promise.race([e.then(() => !1, () => !1), new Promise((e) => {
			n = setTimeout(() => e(!0), t);
		})]);
	} finally {
		n !== void 0 && clearTimeout(n);
	}
}
async function Ul(e, t, n, r) {
	try {
		await e.beta.environments.work.stop(t.id, {
			environment_id: t.environment_id,
			force: !0
		}, {
			...r,
			headers: D([r?.headers])
		});
	} catch (e) {
		Ds(e, 409) || n.error("force-stop on exit failed", {
			work_id: t.id,
			error: String(e)
		});
	}
}
var Wl = /* @__PURE__ */ (() => {
	class e {
		constructor(e) {
			Pl.set(this, void 0), Fl.set(this, void 0), i(this, Pl, e, "f");
		}
		get signal() {
			return a(this, Pl, "f").signal;
		}
		finish(e) {
			i(this, Fl, a(this, Fl, "f") ?? e, "f"), a(this, Pl, "f").abort();
		}
		get lost() {
			return a(this, Fl, "f") === "lease_lost" || a(this, Fl, "f") === "assumed_lost";
		}
		get rejected() {
			return a(this, Fl, "f") === "heartbeat_rejected";
		}
	}
	return Pl = /* @__PURE__ */ new WeakMap(), Fl = /* @__PURE__ */ new WeakMap(), e;
})();
function Gl(e) {
	let t = e instanceof u ? e.error : void 0;
	for (let e of [
		"error",
		"details",
		"current_state"
	]) {
		if (!le(t)) return {};
		t = t[e];
	}
	return le(t) ? t : {};
}
async function Kl(e, t, n, r, i, a) {
	let o = Il, s = Ll, c = Date.now(), l = Rl, u = async () => {
		let u = new AbortController(), d = Es(n.signal, u), f = setTimeout(() => u.abort(), o);
		try {
			let d = await e.beta.environments.work.heartbeat(t.id, {
				environment_id: t.environment_id,
				expected_last_heartbeat: l
			}, {
				...i,
				headers: D([i?.headers]),
				signal: u.signal
			});
			c = Date.now(), l = d.last_heartbeat, d.ttl_seconds > 0 && (s = d.ttl_seconds * 1e3, o = Math.max(1e3, Math.min(s / 2, Il)), a?.(s)), (d.state === "stopping" || d.state === "stopped") && (r.info("heartbeat signals shutdown", {
				work_id: t.id,
				state: d.state
			}), n.finish("control_plane_stop")), d.lease_extended || (r.warn("lease not extended, shutting down", { work_id: t.id }), n.finish("control_plane_stop"));
		} catch (e) {
			if (n.signal.throwIfAborted(), Ds(e, 412)) {
				let i = Gl(e);
				r.error("lease lost: heartbeat precondition failed", {
					work_id: t.id,
					server_state: i.state,
					server_ttl_seconds: i.ttl_seconds,
					server_last_heartbeat: i.last_heartbeat
				}), n.finish("lease_lost");
				return;
			}
			if (ks(e)) throw r.error("permanent heartbeat failure", {
				work_id: t.id,
				error: String(e)
			}), n.finish("heartbeat_rejected"), e;
			if (Date.now() - c > s) {
				r.error("lease assumed lost: no successful heartbeat in ttl", {
					work_id: t.id,
					ttl_ms: s,
					error: String(e)
				}), n.finish("assumed_lost");
				return;
			}
			r.warn("transient heartbeat failure", {
				work_id: t.id,
				error: String(e)
			});
		} finally {
			clearTimeout(f), d();
		}
	};
	for (await u(); !n.signal.aborted;) await fe(o, n.signal), n.signal.throwIfAborted(), await u();
}
// node_modules/@anthropic-ai/sdk/resources/beta/environments/work.mjs
var ql = /* @__PURE__ */ (() => {
	class e extends I {
		retrieve(e, t, n) {
			let { environment_id: r, betas: i, workspace_id: a } = t;
			return this._client.get(R`/v1/environments/${r}/work/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
					...a == null ? void 0 : { "anthropic-workspace-id": a }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.retrieve", n, {
					route: "/v1/environments/{environment_id}/work/{work_id}",
					attributes: {
						"anthropic.environment.id": r,
						"anthropic.environment.work.id": e
					}
				})
			});
		}
		update(e, t, n) {
			let { environment_id: r, betas: i, workspace_id: a, ...o } = t;
			return this._client.post(R`/v1/environments/${r}/work/${e}?beta=true`, {
				body: o,
				...n,
				headers: D([{
					"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
					...a == null ? void 0 : { "anthropic-workspace-id": a }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.update", n, {
					route: "/v1/environments/{environment_id}/work/{work_id}",
					attributes: {
						"anthropic.environment.id": r,
						"anthropic.environment.work.id": e
					}
				})
			});
		}
		list(e, t = {}, n) {
			let { betas: r, ...i } = t ?? {};
			return this._client.getAPIList(R`/v1/environments/${e}/work?beta=true`, F, {
				query: i,
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.list", n, {
					route: "/v1/environments/{environment_id}/work",
					queryParams: ["limit", "page"],
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
		ack(e, t, n) {
			let { environment_id: r, betas: i } = t;
			return this._client.post(R`/v1/environments/${r}/work/${e}/ack?beta=true`, {
				...n,
				headers: D([{ "anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.ack", n, {
					route: "/v1/environments/{environment_id}/work/{work_id}/ack",
					attributes: {
						"anthropic.environment.id": r,
						"anthropic.environment.work.id": e
					}
				})
			});
		}
		heartbeat(e, t, n) {
			let { environment_id: r, desired_ttl_seconds: i, expected_last_heartbeat: a, betas: o } = t;
			return this._client.post(R`/v1/environments/${r}/work/${e}/heartbeat?beta=true`, {
				query: {
					desired_ttl_seconds: i,
					expected_last_heartbeat: a
				},
				...n,
				headers: D([{ "anthropic-beta": [...o ?? [], "managed-agents-2026-04-01"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.heartbeat", n, {
					route: "/v1/environments/{environment_id}/work/{work_id}/heartbeat",
					queryParams: ["desired_ttl_seconds", "expected_last_heartbeat"],
					attributes: {
						"anthropic.environment.id": r,
						"anthropic.environment.work.id": e
					}
				})
			});
		}
		poll(e, t = {}, n) {
			let { betas: r, "Anthropic-Worker-ID": i, ...a } = t ?? {};
			return this._client.get(R`/v1/environments/${e}/work/poll?beta=true`, {
				query: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "Anthropic-Worker-ID": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.poll", n, {
					route: "/v1/environments/{environment_id}/work/poll",
					queryParams: ["block_ms", "reclaim_older_than_ms"],
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
		stats(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/environments/${e}/work/stats?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.stats", n, {
					route: "/v1/environments/{environment_id}/work/stats",
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
		stop(e, t, n) {
			let { environment_id: r, betas: i, workspace_id: a, ...o } = t;
			return this._client.post(R`/v1/environments/${r}/work/${e}/stop?beta=true`, {
				body: o,
				...n,
				headers: D([{
					"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
					...a == null ? void 0 : { "anthropic-workspace-id": a }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.work.stop", n, {
					route: "/v1/environments/{environment_id}/work/{work_id}/stop",
					attributes: {
						"anthropic.environment.id": r,
						"anthropic.environment.work.id": e
					}
				})
			});
		}
		poller(e) {
			return new Ys({
				...e,
				client: this._client
			});
		}
		worker(e) {
			return new Vl({
				...e,
				client: this._client
			});
		}
	}
	return e.WorkPoller = Ys, e.EnvironmentWorker = Vl, e;
})(), Jl = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.work = new ql(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e;
			return this._client.post("/v1/environments?beta=true", {
				body: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.environments.create", t, {
					route: "/v1/environments",
					createdIDAttribute: "anthropic.environment.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/environments/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.retrieve", n, {
					route: "/v1/environments/{environment_id}",
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/environments/${e}?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.update", n, {
					route: "/v1/environments/{environment_id}",
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/environments?beta=true", F, {
				query: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.environments.list", t, {
					route: "/v1/environments",
					queryParams: [
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.delete(R`/v1/environments/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.delete", n, {
					route: "/v1/environments/{environment_id}",
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/environments/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.environments.archive", n, {
					route: "/v1/environments/{environment_id}/archive",
					attributes: { "anthropic.environment.id": e }
				})
			});
		}
	}
	return e.Work = ql, e;
})(), Yl = class extends I {
	create(e, t, n) {
		let { view: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.post(R`/v1/memory_stores/${e}/memories?beta=true`, {
			query: { view: r },
			body: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "agent-memory-2026-07-22"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memories.create", n, {
				route: "/v1/memory_stores/{memory_store_id}/memories",
				queryParams: ["view"],
				attributes: { "gen_ai.memory.store.id": e },
				createdIDAttribute: "gen_ai.memory.record.id"
			})
		});
	}
	retrieve(e, t, n) {
		let { memory_store_id: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.get(R`/v1/memory_stores/${r}/memories/${e}?beta=true`, {
			query: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "agent-memory-2026-07-22"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memories.retrieve", n, {
				route: "/v1/memory_stores/{memory_store_id}/memories/{memory_id}",
				queryParams: ["view"],
				attributes: {
					"gen_ai.memory.store.id": r,
					"gen_ai.memory.record.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { memory_store_id: r, view: i, betas: a, workspace_id: o, ...s } = t;
		return this._client.post(R`/v1/memory_stores/${r}/memories/${e}?beta=true`, {
			query: { view: i },
			body: s,
			...n,
			headers: D([{
				"anthropic-beta": [...a ?? [], "agent-memory-2026-07-22"].toString(),
				...o == null ? void 0 : { "anthropic-workspace-id": o }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memories.update", n, {
				route: "/v1/memory_stores/{memory_store_id}/memories/{memory_id}",
				queryParams: ["view"],
				attributes: {
					"gen_ai.memory.store.id": r,
					"gen_ai.memory.record.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/memory_stores/${e}/memories?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "agent-memory-2026-07-22"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memories.list", n, {
				route: "/v1/memory_stores/{memory_store_id}/memories",
				queryParams: [
					"depth",
					"limit",
					"page",
					"path_prefix",
					"view"
				],
				contentQueryParams: ["page"],
				attributes: { "gen_ai.memory.store.id": e }
			})
		});
	}
	delete(e, t, n) {
		let { memory_store_id: r, expected_content_sha256: i, betas: a, workspace_id: o } = t;
		return this._client.delete(R`/v1/memory_stores/${r}/memories/${e}?beta=true`, {
			query: { expected_content_sha256: i },
			...n,
			headers: D([{
				"anthropic-beta": [...a ?? [], "agent-memory-2026-07-22"].toString(),
				...o == null ? void 0 : { "anthropic-workspace-id": o }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memories.delete", n, {
				route: "/v1/memory_stores/{memory_store_id}/memories/{memory_id}",
				queryParams: ["expected_content_sha256"],
				attributes: {
					"gen_ai.memory.store.id": r,
					"gen_ai.memory.record.id": e
				}
			})
		});
	}
}, Xl = class extends I {
	retrieve(e, t, n) {
		let { memory_store_id: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.get(R`/v1/memory_stores/${r}/memory_versions/${e}?beta=true`, {
			query: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "agent-memory-2026-07-22"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memory_versions.retrieve", n, {
				route: "/v1/memory_stores/{memory_store_id}/memory_versions/{memory_version_id}",
				queryParams: ["view"],
				attributes: {
					"gen_ai.memory.store.id": r,
					"anthropic.memory_store.memory_version.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/memory_stores/${e}/memory_versions?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "agent-memory-2026-07-22"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memory_versions.list", n, {
				route: "/v1/memory_stores/{memory_store_id}/memory_versions",
				queryParams: [
					"api_key_id",
					"created_at[gte]",
					"created_at[lte]",
					"limit",
					"memory_id",
					"operation",
					"page",
					"service_account_id",
					"session_id",
					"view"
				],
				attributes: { "gen_ai.memory.store.id": e }
			})
		});
	}
	redact(e, t, n) {
		let { memory_store_id: r, betas: i, workspace_id: a } = t;
		return this._client.post(R`/v1/memory_stores/${r}/memory_versions/${e}/redact?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "agent-memory-2026-07-22"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.memory_stores.memory_versions.redact", n, {
				route: "/v1/memory_stores/{memory_store_id}/memory_versions/{memory_version_id}/redact",
				attributes: {
					"gen_ai.memory.store.id": r,
					"anthropic.memory_store.memory_version.id": e
				}
			})
		});
	}
}, Zl = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.memories = new Yl(this._client), this.memoryVersions = new Xl(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e;
			return this._client.post("/v1/memory_stores?beta=true", {
				body: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "agent-memory-2026-07-22"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.memory_stores.create", t, {
					route: "/v1/memory_stores",
					createdIDAttribute: "gen_ai.memory.store.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/memory_stores/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "agent-memory-2026-07-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.memory_stores.retrieve", n, {
					route: "/v1/memory_stores/{memory_store_id}",
					attributes: { "gen_ai.memory.store.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/memory_stores/${e}?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "agent-memory-2026-07-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.memory_stores.update", n, {
					route: "/v1/memory_stores/{memory_store_id}",
					attributes: { "gen_ai.memory.store.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/memory_stores?beta=true", F, {
				query: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "agent-memory-2026-07-22"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.memory_stores.list", t, {
					route: "/v1/memory_stores",
					queryParams: [
						"created_at[gte]",
						"created_at[lte]",
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.delete(R`/v1/memory_stores/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "agent-memory-2026-07-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.memory_stores.delete", n, {
					route: "/v1/memory_stores/{memory_store_id}",
					attributes: { "gen_ai.memory.store.id": e }
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/memory_stores/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "agent-memory-2026-07-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.memory_stores.archive", n, {
					route: "/v1/memory_stores/{memory_store_id}/archive",
					attributes: { "gen_ai.memory.store.id": e }
				})
			});
		}
	}
	return e.Memories = Yl, e.MemoryVersions = Xl, e;
})();
// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
b();
var Ql = class extends I {
	create(e, t) {
		let { betas: n, user_profile_id: r, workspace_id: i, ...a } = e;
		return this._client.post("/v1/messages/batches?beta=true", {
			body: a,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString(),
				...r == null ? void 0 : { "anthropic-user-profile-id": r },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, t?.headers]),
			__span: k(this._client, "anthropic.messages.batches.create", t, {
				route: "/v1/messages/batches",
				attributes: { "anthropic.message.batch.request_count": a.requests?.length },
				createdIDAttribute: "anthropic.message.batch.id"
			})
		});
	}
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/messages/batches/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.messages.batches.retrieve", n, {
				route: "/v1/messages/batches/{message_batch_id}",
				attributes: { "anthropic.message.batch.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/messages/batches?beta=true", P, {
			query: i,
			...t,
			headers: D([{
				"anthropic-beta": [...n ?? [], "message-batches-2024-09-24"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.messages.batches.list", t, {
				route: "/v1/messages/batches",
				queryParams: [
					"after_id",
					"before_id",
					"limit"
				]
			})
		});
	}
	delete(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.delete(R`/v1/messages/batches/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.messages.batches.delete", n, {
				route: "/v1/messages/batches/{message_batch_id}",
				attributes: { "anthropic.message.batch.id": e }
			})
		});
	}
	cancel(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.post(R`/v1/messages/batches/${e}/cancel?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "message-batches-2024-09-24"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.messages.batches.cancel", n, {
				route: "/v1/messages/batches/{message_batch_id}/cancel",
				attributes: { "anthropic.message.batch.id": e }
			})
		});
	}
	async results(e, t = {}, n) {
		let r = await this.retrieve(e, t, n);
		if (!r.results_url) throw new l(`No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`);
		let { betas: i, workspace_id: a } = t ?? {};
		return this._client.get(r.results_url, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "message-batches-2024-09-24"].toString(),
				Accept: "application/binary",
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			stream: !0,
			__binaryResponse: !0,
			__span: k(this._client, "anthropic.messages.batches.results", n, {
				route: "/v1/messages/batches/{message_batch_id}/results",
				attributes: { "anthropic.message.batch.id": e }
			})
		})._thenUnwrap((e, t) => as.fromResponse(t.response, t.controller));
	}
};
// node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs
b();
function $l(e) {
	return e?.output_format ?? e?.output_config?.format;
}
function eu(e, t, n) {
	let r = $l(t);
	return !t || !("parse" in (r ?? {})) ? {
		...e,
		content: e.content.map((e) => {
			if (e.type === "text") {
				let t = Object.defineProperty({ ...e }, "parsed_output", {
					value: null,
					enumerable: !1
				});
				return Object.defineProperty(t, "parsed", {
					get() {
						return n.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), null;
					},
					enumerable: !1
				});
			}
			return e;
		}),
		parsed_output: null
	} : tu(e, t, n);
}
function tu(e, t, n) {
	let r = null, i = e.content.map((e) => {
		if (e.type === "text") {
			let i = nu(t, e.text);
			r === null && (r = i);
			let a = Object.defineProperty({ ...e }, "parsed_output", {
				value: i,
				enumerable: !1
			});
			return Object.defineProperty(a, "parsed", {
				get() {
					return n.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."), i;
				},
				enumerable: !1
			});
		}
		return e;
	});
	return {
		...e,
		content: i,
		parsed_output: r
	};
}
function nu(e, t) {
	let n = $l(e);
	if (n?.type !== "json_schema") return null;
	try {
		return "parse" in n ? n.parse(t) : JSON.parse(t);
	} catch (e) {
		throw new l(`Failed to parse structured output: ${e}`);
	}
}
// node_modules/@anthropic-ai/sdk/lib/internal/beta-messages-request.mjs
b();
function ru(e, t) {
	let { betas: n, user_profile_id: r, workspace_id: i, tools: a, messages: o } = e;
	return D([
		{
			...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
			...r == null ? void 0 : { "anthropic-user-profile-id": r },
			...i == null ? void 0 : { "anthropic-workspace-id": i }
		},
		ba(a, o),
		t?.headers
	]);
}
function iu(e, t, n) {
	if (!e._tracer) return;
	let r = ru(t, n);
	return k(e, "anthropic.messages.create", n, $i(e, {
		...au(t),
		stream: !0
	}, r));
}
function au(e) {
	if (!e.output_format) return e;
	if (e.output_config?.format) throw new l("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
	let { output_format: t, ...n } = e;
	return {
		...n,
		output_config: {
			...e.output_config,
			format: t
		}
	};
}
b(), c();
var K, ou, su, cu, lu, uu, du, fu, pu, mu, hu, gu, _u, vu, yu, bu, xu, Su, Cu, q, wu, Tu, Eu, Du, Ou, ku, Au, ju;
function Mu(e) {
	return e.type === "tool_use" || e.type === "server_tool_use" || e.type === "mcp_tool_use";
}
var Nu = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t) {
			K.add(this), this.messages = [], this.receivedMessages = [], ou.set(this, void 0), su.set(this, null), this.controller = new AbortController(), cu.set(this, void 0), lu.set(this, () => {}), uu.set(this, () => {}), du.set(this, void 0), fu.set(this, () => {}), pu.set(this, () => {}), mu.set(this, {}), hu.set(this, !1), gu.set(this, !1), _u.set(this, !1), vu.set(this, !1), yu.set(this, void 0), bu.set(this, void 0), xu.set(this, void 0), Su.set(this, void 0), Cu.set(this, void 0), q.set(this, void 0), Eu.set(this, (e) => {
				if (i(this, gu, !0, "f"), a(this, q, "f") && (a(this, q, "f").streamed = void 0), o(e) && (e = new d()), e instanceof d) return i(this, _u, !0, "f"), this._emit("abort", e);
				if (e instanceof l) return this._emit("error", e);
				if (e instanceof Error) {
					let t = new l(e.message);
					return t.cause = e, this._emit("error", t);
				}
				return this._emit("error", new l(String(e)));
			}), i(this, cu, new Promise((e, t) => {
				i(this, lu, e, "f"), i(this, uu, t, "f");
			}), "f"), i(this, du, new Promise((e, t) => {
				i(this, fu, e, "f"), i(this, pu, t, "f");
			}), "f"), a(this, cu, "f").catch(() => {}), a(this, du, "f").catch(() => {}), i(this, su, e, "f"), i(this, Su, t?.logger ?? console, "f"), i(this, Cu, t?.client, "f");
		}
		get response() {
			return a(this, yu, "f");
		}
		get request_id() {
			return a(this, bu, "f");
		}
		get workspace_id() {
			return a(this, xu, "f");
		}
		async withResponse() {
			i(this, vu, !0, "f");
			let e = await a(this, cu, "f");
			if (!e) throw Error("Could not resolve a `Response` object");
			return {
				data: this,
				response: e,
				request_id: e.headers.get("request-id"),
				workspace_id: e.headers.get("anthropic-workspace-id")
			};
		}
		static fromReadableStream(t) {
			let n = new e(null);
			return n._run(() => n._fromReadableStream(t)), n;
		}
		static createMessage(t, n, r, { logger: a, client: o } = {}) {
			let s = new e(n, {
				logger: a,
				client: o
			});
			for (let e of n.messages) s._addMessageParam(e);
			return i(s, su, {
				...n,
				stream: !0
			}, "f"), s._run(() => s._createMessage(t, {
				...n,
				stream: !0
			}, {
				...r,
				headers: {
					...r?.headers,
					[ha]: "stream"
				}
			})), s;
		}
		_run(e) {
			e().then(() => {
				this._emitFinal(), this._emit("end");
			}, a(this, Eu, "f"));
		}
		_addMessageParam(e) {
			this.messages.push(e);
		}
		_addMessage(e, t = !0) {
			this.receivedMessages.push(e), t && this._emit("message", e);
		}
		async _createMessage(e, t, n) {
			let r = n?.signal, o;
			r && (r.aborted && this.controller.abort(), o = this.controller.abort.bind(this.controller), r.addEventListener("abort", o));
			try {
				a(this, K, "m", Du).call(this), i(this, q, n?.__span ?? (a(this, Cu, "f") && iu(a(this, Cu, "f"), t, n)), "f");
				let { response: r, data: o } = await e.create({
					...t,
					stream: !0
				}, {
					...n,
					__span: a(this, q, "f"),
					signal: this.controller.signal
				}).withResponse();
				try {
					this._connected(r);
				} catch (e) {
					throw a(this, q, "f") && (a(this, q, "f").failure = e), o.controller.abort(), e;
				}
				for await (let e of o) try {
					a(this, K, "m", Ou).call(this, e);
				} catch (e) {
					throw a(this, q, "f") && (a(this, q, "f").failure = e), e;
				}
				if (o.controller.signal?.aborted) throw new d();
				a(this, K, "m", ku).call(this);
			} finally {
				r && o && r.removeEventListener("abort", o);
			}
		}
		_connected(e) {
			this.ended || (i(this, yu, e, "f"), i(this, bu, e?.headers.get("request-id"), "f"), i(this, xu, e?.headers.get("anthropic-workspace-id"), "f"), a(this, lu, "f").call(this, e), this._emit("connect"));
		}
		get ended() {
			return a(this, hu, "f");
		}
		get errored() {
			return a(this, gu, "f");
		}
		get aborted() {
			return a(this, _u, "f");
		}
		abort() {
			this.controller.abort();
		}
		on(e, t) {
			return (a(this, mu, "f")[e] || (a(this, mu, "f")[e] = [])).push({ listener: t }), this;
		}
		off(e, t) {
			let n = a(this, mu, "f")[e];
			if (!n) return this;
			let r = n.findIndex((e) => e.listener === t);
			return r >= 0 && n.splice(r, 1), this;
		}
		once(e, t) {
			return (a(this, mu, "f")[e] || (a(this, mu, "f")[e] = [])).push({
				listener: t,
				once: !0
			}), this;
		}
		emitted(e) {
			return new Promise((t, n) => {
				i(this, vu, !0, "f"), e !== "error" && this.once("error", n), this.once(e, t);
			});
		}
		async done() {
			i(this, vu, !0, "f"), await a(this, du, "f");
		}
		get currentMessage() {
			return a(this, ou, "f");
		}
		async finalMessage() {
			return await this.done(), a(this, K, "m", wu).call(this);
		}
		async finalText() {
			return await this.done(), a(this, K, "m", Tu).call(this);
		}
		_emit(e, ...t) {
			if (a(this, hu, "f")) return;
			e === "end" && (i(this, hu, !0, "f"), a(this, fu, "f").call(this));
			let n = a(this, mu, "f")[e];
			if (n && (a(this, mu, "f")[e] = n.filter((e) => !e.once), n.forEach(({ listener: e }) => e(...t))), e === "abort") {
				let e = t[0];
				!a(this, vu, "f") && !n?.length && Promise.reject(e), a(this, uu, "f").call(this, e), a(this, pu, "f").call(this, e), this._emit("end");
			} else if (e === "error") {
				let e = t[0];
				!a(this, vu, "f") && !n?.length && Promise.reject(e), a(this, uu, "f").call(this, e), a(this, pu, "f").call(this, e), this._emit("end");
			}
		}
		_emitFinal() {
			this.receivedMessages.at(-1) && this._emit("finalMessage", a(this, K, "m", wu).call(this));
		}
		_deliverEvent(e, t) {
			this._emit("_rawEvent", e), t && this._emit("streamEvent", e, t);
		}
		async _fromReadableStream(e, t) {
			let n = t?.signal, r;
			n && (n.aborted && this.controller.abort(), r = this.controller.abort.bind(this.controller), n.addEventListener("abort", r));
			try {
				a(this, K, "m", Du).call(this), this._connected(null);
				let t = pn.fromReadableStream(e, this.controller);
				for await (let e of t) a(this, K, "m", Ou).call(this, e);
				if (t.controller.signal?.aborted) throw new d();
				a(this, K, "m", ku).call(this);
			} finally {
				n && r && n.removeEventListener("abort", r);
			}
		}
		[(ou = /* @__PURE__ */ new WeakMap(), su = /* @__PURE__ */ new WeakMap(), cu = /* @__PURE__ */ new WeakMap(), lu = /* @__PURE__ */ new WeakMap(), uu = /* @__PURE__ */ new WeakMap(), du = /* @__PURE__ */ new WeakMap(), fu = /* @__PURE__ */ new WeakMap(), pu = /* @__PURE__ */ new WeakMap(), mu = /* @__PURE__ */ new WeakMap(), hu = /* @__PURE__ */ new WeakMap(), gu = /* @__PURE__ */ new WeakMap(), _u = /* @__PURE__ */ new WeakMap(), vu = /* @__PURE__ */ new WeakMap(), yu = /* @__PURE__ */ new WeakMap(), bu = /* @__PURE__ */ new WeakMap(), xu = /* @__PURE__ */ new WeakMap(), Su = /* @__PURE__ */ new WeakMap(), Cu = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), Eu = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakSet(), wu = function() {
			if (this.receivedMessages.length === 0) throw new l("stream ended without producing a Message with role=assistant");
			return this.receivedMessages.at(-1);
		}, Tu = function() {
			if (this.receivedMessages.length === 0) throw new l("stream ended without producing a Message with role=assistant");
			let e = this.receivedMessages.at(-1).content.filter((e) => e.type === "text").map((e) => e.text);
			if (e.length === 0) throw new l("stream ended without producing a content block with type=text");
			return e.join(" ");
		}, Du = function() {
			this.ended || i(this, ou, void 0, "f");
		}, Ou = function(e) {
			if (this.ended) return;
			let t = a(this, K, "m", Au).call(this, e);
			if (this._deliverEvent(e, t), t) switch (e.type) {
				case "content_block_delta": {
					let n = t.content.at(-1);
					switch (e.delta.type) {
						case "text_delta":
							n.type === "text" && this._emit("text", e.delta.text, n.text || "");
							break;
						case "citations_delta":
							n.type === "text" && this._emit("citation", e.delta.citation, n.citations ?? []);
							break;
						case "input_json_delta":
							if (Mu(n) && a(this, mu, "f").inputJson?.length) {
								let t;
								try {
									t = n.input;
								} catch (e) {
									a(this, Eu, "f").call(this, a(this, K, "m", ju).call(this, n, e));
									break;
								}
								this._emit("inputJson", e.delta.partial_json, t);
							}
							break;
						case "thinking_delta":
							n.type === "thinking" && this._emit("thinking", e.delta.thinking, n.thinking);
							break;
						case "signature_delta":
							n.type === "thinking" && this._emit("signature", n.signature);
							break;
						case "compaction_delta":
							n.type === "compaction" && n.content && this._emit("compaction", n.content);
							break;
						default: e.delta;
					}
					break;
				}
				case "message_stop":
					a(this, Cu, "f") && a(this, q, "f") && a(this, su, "f") && sa(a(this, Cu, "f"), a(this, q, "f"), a(this, su, "f"), t), this._addMessageParam(t), this._addMessage(eu(t, a(this, su, "f"), { logger: a(this, Su, "f") }), !0);
					break;
				case "content_block_stop":
					this._emit("contentBlock", t.content.at(-1));
					break;
				case "message_start": i(this, ou, t, "f"), a(this, q, "f") && a(this, su, "f") && (a(this, q, "f").streamed = {
					body: a(this, su, "f"),
					message: t
				});
			}
		}, ku = function() {
			if (this.ended) throw new l("stream has ended, this shouldn't happen");
			let e = a(this, ou, "f");
			if (!e) throw new l("request ended without sending any chunks");
			return i(this, ou, void 0, "f"), eu(e, a(this, su, "f"), { logger: a(this, Su, "f") });
		}, Au = function(e) {
			let t = a(this, ou, "f");
			if (e.type === "message_start") {
				if (t) throw new l(`Unexpected event order, got ${e.type} before receiving "message_stop"`);
				return e.message;
			}
			if (t) switch (e.type) {
				case "message_stop": return t;
				case "message_delta": return t.stop_reason = e.delta.stop_reason, t.stop_sequence = e.delta.stop_sequence, t.stop_details = e.delta.stop_details, t.usage.output_tokens = e.usage.output_tokens, e.delta.container != null && (t.container = e.delta.container), e.context_management != null && (t.context_management = e.context_management), e.input_transformations != null && (t.input_transformations = e.input_transformations), e.usage.input_tokens != null && (t.usage.input_tokens = e.usage.input_tokens), e.usage.cache_creation_input_tokens != null && (t.usage.cache_creation_input_tokens = e.usage.cache_creation_input_tokens), e.usage.cache_read_input_tokens != null && (t.usage.cache_read_input_tokens = e.usage.cache_read_input_tokens), e.usage.server_tool_use != null && (t.usage.server_tool_use = e.usage.server_tool_use), e.usage.iterations != null && (t.usage.iterations = e.usage.iterations), e.usage.fallback_credit != null && (t.usage.fallback_credit = e.usage.fallback_credit), e.usage.output_tokens_details != null && (t.usage.output_tokens_details = e.usage.output_tokens_details), t;
				case "content_block_start": return t.content.push(e.content_block), e.content_block.type === "fallback" && (t.model = e.content_block.to.model), t;
				case "content_block_delta": {
					let n = t.content.at(e.index);
					switch (e.delta.type) {
						case "text_delta":
							n?.type === "text" && (t.content[e.index] = {
								...n,
								text: (n.text || "") + e.delta.text
							});
							break;
						case "citations_delta":
							n?.type === "text" && (t.content[e.index] = {
								...n,
								citations: [...n.citations ?? [], e.delta.citation]
							});
							break;
						case "input_json_delta":
							if (n && Mu(n)) {
								let r = (n.__json_buf || "") + e.delta.partial_json;
								t.content[e.index] = Ao(n, r);
							}
							break;
						case "thinking_delta":
							n?.type === "thinking" && (t.content[e.index] = {
								...n,
								thinking: n.thinking + e.delta.thinking
							});
							break;
						case "signature_delta":
							n?.type === "thinking" && (t.content[e.index] = {
								...n,
								signature: e.delta.signature
							});
							break;
						case "compaction_delta":
							if (n?.type === "compaction") {
								let r = {
									...n,
									content: e.delta.content
								};
								"encrypted_content" in e.delta && (r.encrypted_content = e.delta.encrypted_content), t.content[e.index] = r;
							}
							break;
						default: e.delta;
					}
					return t;
				}
				case "content_block_stop": {
					let n = t.content.at(e.index);
					if (n && Mu(n) && "__json_buf" in n) {
						let e;
						try {
							e = n.input;
						} catch (t) {
							e = {}, a(this, Eu, "f").call(this, a(this, K, "m", ju).call(this, n, t));
						}
						Object.defineProperty(n, "input", {
							value: e,
							enumerable: !0,
							configurable: !0,
							writable: !0
						});
					}
					return t;
				}
				default: return t;
			}
		}, ju = function(e, t) {
			let n = e[ko];
			return new l(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${t}. JSON: ${n}`);
		}, Symbol.asyncIterator)]() {
			let e = [], t = [], n = !1;
			return this.on("_rawEvent", (n) => {
				let r = t.shift();
				r ? r.resolve(n) : e.push(n);
			}), this.on("end", () => {
				n = !0;
				for (let e of t) e.resolve(void 0);
				t.length = 0;
			}), this.on("abort", (e) => {
				n = !0;
				for (let n of t) n.reject(e);
				t.length = 0;
			}), this.on("error", (e) => {
				n = !0;
				for (let n of t) n.reject(e);
				t.length = 0;
			}), {
				next: async () => e.length ? {
					value: e.shift(),
					done: !1
				} : n ? {
					value: void 0,
					done: !0
				} : new Promise((e, n) => t.push({
					resolve: e,
					reject: n
				})).then((e) => e ? {
					value: e,
					done: !1
				} : {
					value: void 0,
					done: !0
				}),
				return: async () => (this.abort(), {
					value: void 0,
					done: !0
				})
			};
		}
		toReadableStream() {
			return new pn(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
		}
	}
	return e;
})(), Pu = {
	browser_toolset_20260801: "browser",
	computer_toolset_20260801: "computer"
};
function Fu(e) {
	return Pu[e.type];
}
function Iu(e) {
	return "run" in e && e.type != null && Object.prototype.hasOwnProperty.call(Pu, e.type);
}
// node_modules/@anthropic-ai/sdk/lib/internal/toolsets/errors.mjs
b();
var Lu = class extends l {
	constructor(e, t) {
		super(e), this.name = "ToolsetUsageError", t && "cause" in t && (this.cause = t.cause);
	}
}, Ru = class extends Lu {
	constructor(e, t) {
		super(e, t), this.name = "ToolsetContractError";
	}
};
// node_modules/@anthropic-ai/sdk/lib/internal/toolsets/run.mjs
b();
var zu = "Not executed: an earlier action in this turn failed.", Bu = {
	browser: zu,
	computer: "Not executed: an earlier computer action in this turn failed."
};
function Vu(e) {
	return Object.prototype.hasOwnProperty.call(Bu, e) ? Bu[e] : zu;
}
function Hu(e, t, n = !1) {
	return n && (t === "" || Array.isArray(t) && t.length === 0) && (t = "The tool call failed with an empty error message."), {
		type: "tool_result",
		tool_use_id: e.id,
		toolset_name: e.toolset_name ?? null,
		content: t,
		...n ? { is_error: !0 } : {}
	};
}
function Uu(e, t) {
	if (e instanceof Lu) throw e;
	Wu(t.signal);
}
function Wu(e) {
	if (e?.aborted) throw new d();
}
async function Gu(e, t, n = {}) {
	let r = Fu(e);
	if (t.toolset_name !== r) throw new Ru(`tool_use ${JSON.stringify(t.id)} (toolset_name=${JSON.stringify(t.toolset_name ?? null)}, name=${JSON.stringify(t.name)}) is not a member call of the ${JSON.stringify(r)} toolset`);
	let i = {
		...n,
		toolUse: t,
		toolUseBlock: t
	};
	try {
		return Hu(t, await e.run(i, t));
	} catch (e) {
		return Uu(e, i), Hu(t, hc(e instanceof rc ? e.content : pc(e)), !0);
	}
}
// node_modules/@anthropic-ai/sdk/resources/beta/organization/api-keys.mjs
var Ku = class extends I {
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/api_keys/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.api_keys.retrieve", t, {
				route: "/v1/organizations/api_keys/{api_key_id}",
				attributes: { "anthropic.organization.api_key.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/api_keys/${e}?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.api_keys.update", n, {
				route: "/v1/organizations/api_keys/{api_key_id}",
				attributes: { "anthropic.organization.api_key.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/api_keys?beta=true", P, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.api_keys.list", t, {
				route: "/v1/organizations/api_keys",
				queryParams: [
					"after_id",
					"before_id",
					"created_by_user_id",
					"limit",
					"status",
					"workspace_id"
				]
			})
		});
	}
}, qu = class extends I {
	list(e, t) {
		return this._client.getAPIList("/v1/organizations/analytics/artifacts?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.artifacts.list", t, {
				route: "/v1/organizations/analytics/artifacts",
				queryParams: [
					"date",
					"filter",
					"group_by",
					"limit",
					"page"
				]
			})
		});
	}
}, Ju = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/analytics/connectors?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.connectors.list", t, {
				route: "/v1/organizations/analytics/connectors",
				queryParams: [
					"date",
					"ending_date",
					"filter",
					"group_by",
					"limit",
					"order",
					"order_by",
					"page",
					"starting_date"
				],
				contentQueryParams: ["filter"]
			})
		});
	}
}, Yu = class extends I {
	list(e, t) {
		return this._client.getAPIList("/v1/organizations/analytics/cost_report?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.cost_report.list", t, {
				route: "/v1/organizations/analytics/cost_report",
				queryParams: [
					"bucket_width",
					"claude_tag_categories",
					"claude_tag_user_ids",
					"context_windows",
					"ending_at",
					"group_by",
					"inference_geos",
					"limit",
					"models",
					"page",
					"products",
					"rbac_group_ids",
					"slack_channel_ids",
					"speeds",
					"starting_at",
					"user_ids"
				]
			})
		});
	}
}, Xu = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/analytics/plugins?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.plugins.list", t, {
				route: "/v1/organizations/analytics/plugins",
				queryParams: [
					"date",
					"ending_date",
					"filter",
					"group_by",
					"limit",
					"order",
					"order_by",
					"page",
					"starting_date"
				],
				contentQueryParams: ["filter"]
			})
		});
	}
}, Zu = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/analytics/skills?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.skills.list", t, {
				route: "/v1/organizations/analytics/skills",
				queryParams: [
					"date",
					"ending_date",
					"filter",
					"group_by",
					"limit",
					"order",
					"order_by",
					"page",
					"starting_date"
				],
				contentQueryParams: ["filter"]
			})
		});
	}
}, Qu = class extends I {
	list(e, t) {
		return this._client.getAPIList("/v1/organizations/analytics/summaries?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.summaries.list", t, {
				route: "/v1/organizations/analytics/summaries",
				queryParams: [
					"ending_date",
					"filter",
					"limit",
					"page",
					"starting_date"
				]
			})
		});
	}
}, $u = class extends I {
	list(e, t) {
		return this._client.getAPIList("/v1/organizations/analytics/usage_report?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.usage_report.list", t, {
				route: "/v1/organizations/analytics/usage_report",
				queryParams: [
					"bucket_width",
					"claude_tag_categories",
					"claude_tag_user_ids",
					"context_windows",
					"ending_at",
					"group_by",
					"inference_geos",
					"limit",
					"models",
					"page",
					"products",
					"rbac_group_ids",
					"slack_channel_ids",
					"speeds",
					"starting_at",
					"user_ids"
				]
			})
		});
	}
}, ed = class extends I {
	list(e, t) {
		return this._client.getAPIList("/v1/organizations/analytics/user_cost_report?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.user_cost_report.list", t, {
				route: "/v1/organizations/analytics/user_cost_report",
				queryParams: [
					"bucket_width",
					"claude_tag_categories",
					"claude_tag_user_ids",
					"context_windows",
					"ending_at",
					"exclude_deleted_users",
					"group_by",
					"inference_geos",
					"limit",
					"models",
					"order",
					"order_by",
					"page",
					"products",
					"rbac_group_ids",
					"slack_channel_ids",
					"speeds",
					"starting_at",
					"user_ids"
				]
			})
		});
	}
}, td = class extends I {
	list(e, t) {
		return this._client.getAPIList("/v1/organizations/analytics/user_usage_report?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.user_usage_report.list", t, {
				route: "/v1/organizations/analytics/user_usage_report",
				queryParams: [
					"bucket_width",
					"claude_tag_categories",
					"claude_tag_user_ids",
					"context_windows",
					"ending_at",
					"exclude_deleted_users",
					"group_by",
					"inference_geos",
					"limit",
					"models",
					"order",
					"order_by",
					"page",
					"products",
					"rbac_group_ids",
					"slack_channel_ids",
					"speeds",
					"starting_at",
					"user_ids"
				]
			})
		});
	}
}, nd = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/analytics/users?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.users.list", t, {
				route: "/v1/organizations/analytics/users",
				queryParams: [
					"date",
					"ending_date",
					"filter",
					"group_by",
					"limit",
					"order",
					"order_by",
					"page",
					"starting_date"
				],
				contentQueryParams: ["page"]
			})
		});
	}
}, rd = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/analytics/apps/chat/projects?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.analytics.apps.chat.projects.list", t, {
				route: "/v1/organizations/analytics/apps/chat/projects",
				queryParams: [
					"date",
					"ending_date",
					"filter",
					"group_by",
					"limit",
					"order",
					"order_by",
					"page",
					"starting_date"
				]
			})
		});
	}
}, id = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.projects = new rd(this._client);
		}
	}
	return e.Projects = rd, e;
})(), ad = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.chat = new id(this._client);
		}
	}
	return e.Chat = id, e;
})(), od = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.summaries = new Qu(this._client), this.users = new nd(this._client), this.apps = new ad(this._client), this.connectors = new Ju(this._client), this.plugins = new Xu(this._client), this.skills = new Zu(this._client), this.artifacts = new qu(this._client), this.usageReport = new $u(this._client), this.userUsageReport = new td(this._client), this.costReport = new Yu(this._client), this.userCostReport = new ed(this._client);
		}
	}
	return e.Summaries = Qu, e.Users = nd, e.Apps = ad, e.Connectors = Ju, e.Plugins = Xu, e.Skills = Zu, e.Artifacts = qu, e.UsageReport = $u, e.UserUsageReport = td, e.CostReport = Yu, e.UserCostReport = ed, e;
})(), sd = class extends I {
	retrieve(e) {
		return this._client.get("/v1/organizations/compliance_settings?beta=true", {
			...e,
			__span: k(this._client, "anthropic.organization.compliance_settings.retrieve", e, { route: "/v1/organizations/compliance_settings" })
		});
	}
	update(e, t) {
		return this._client.post("/v1/organizations/compliance_settings?beta=true", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.compliance_settings.update", t, { route: "/v1/organizations/compliance_settings" })
		});
	}
}, cd = class extends I {
	create(e, t) {
		return this._client.post("/v1/organizations/external_keys?beta=true", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.create", t, {
				route: "/v1/organizations/external_keys",
				createdIDAttribute: "anthropic.organization.external_key.id"
			})
		});
	}
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/external_keys/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.retrieve", t, {
				route: "/v1/organizations/external_keys/{external_key_id}",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/external_keys/${e}?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.external_keys.update", n, {
				route: "/v1/organizations/external_keys/{external_key_id}",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/external_keys?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.list", t, {
				route: "/v1/organizations/external_keys",
				queryParams: ["limit", "page"]
			})
		});
	}
	delete(e, t) {
		return this._client.delete(R`/v1/organizations/external_keys/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.delete", t, {
				route: "/v1/organizations/external_keys/{external_key_id}",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
	validate(e, t) {
		return this._client.post(R`/v1/organizations/external_keys/${e}/validate?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.validate", t, {
				route: "/v1/organizations/external_keys/{external_key_id}/validate",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
}, ld = class extends I {
	create(e, t) {
		let { betas: n, ...r } = e;
		return this._client.post("/v1/organizations/federation_issuers?beta=true", {
			body: r,
			...t,
			headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
			__span: k(this._client, "anthropic.organization.federation.issuers.create", t, {
				route: "/v1/organizations/federation_issuers",
				createdIDAttribute: "anthropic.organization.federation_issuer.id"
			})
		});
	}
	retrieve(e, t = {}, n) {
		let { betas: r } = t ?? {};
		return this._client.get(R`/v1/organizations/federation_issuers/${e}?beta=true`, {
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.federation.issuers.retrieve", n, {
				route: "/v1/organizations/federation_issuers/{federation_issuer_id}",
				attributes: { "anthropic.organization.federation_issuer.id": e }
			})
		});
	}
	update(e, t, n) {
		let { betas: r, ...i } = t;
		return this._client.post(R`/v1/organizations/federation_issuers/${e}?beta=true`, {
			body: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.federation.issuers.update", n, {
				route: "/v1/organizations/federation_issuers/{federation_issuer_id}",
				attributes: { "anthropic.organization.federation_issuer.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, ...r } = e ?? {};
		return this._client.getAPIList("/v1/organizations/federation_issuers?beta=true", F, {
			query: r,
			...t,
			headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
			__span: k(this._client, "anthropic.organization.federation.issuers.list", t, {
				route: "/v1/organizations/federation_issuers",
				queryParams: [
					"include_archived",
					"limit",
					"page"
				]
			})
		});
	}
	archive(e, t = {}, n) {
		let { betas: r } = t ?? {};
		return this._client.post(R`/v1/organizations/federation_issuers/${e}/archive?beta=true`, {
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.federation.issuers.archive", n, {
				route: "/v1/organizations/federation_issuers/{federation_issuer_id}/archive",
				attributes: { "anthropic.organization.federation_issuer.id": e }
			})
		});
	}
}, ud = class extends I {
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/federation_rules/${e}/workspaces?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.federation.rules.workspaces.list", n, {
				route: "/v1/organizations/federation_rules/{federation_rule_id}/workspaces",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.federation_rule.id": e }
			})
		});
	}
	add(e, t, n) {
		let { betas: r, ...i } = t;
		return this._client.post(R`/v1/organizations/federation_rules/${e}/workspaces?beta=true`, {
			body: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.federation.rules.workspaces.add", n, {
				route: "/v1/organizations/federation_rules/{federation_rule_id}/workspaces",
				attributes: { "anthropic.organization.federation_rule.id": e },
				createdIDAttribute: "anthropic.organization.federation_rule.workspace.id",
				createdIDField: "workspace_id"
			})
		});
	}
	remove(e, t, n) {
		let { federation_rule_id: r, betas: i } = t;
		return this._client.delete(R`/v1/organizations/federation_rules/${r}/workspaces/${e}?beta=true`, {
			...n,
			headers: D([{ ...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.federation.rules.workspaces.remove", n, {
				route: "/v1/organizations/federation_rules/{federation_rule_id}/workspaces/{workspace_id}",
				attributes: {
					"anthropic.organization.federation_rule.id": r,
					"anthropic.organization.federation_rule.workspace.id": e
				}
			})
		});
	}
}, dd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.workspaces = new ud(this._client);
		}
		create(e, t) {
			let { betas: n, ...r } = e;
			return this._client.post("/v1/organizations/federation_rules?beta=true", {
				body: r,
				...t,
				headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
				__span: k(this._client, "anthropic.organization.federation.rules.create", t, {
					route: "/v1/organizations/federation_rules",
					createdIDAttribute: "anthropic.organization.federation_rule.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.get(R`/v1/organizations/federation_rules/${e}?beta=true`, {
				...n,
				headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
				__span: k(this._client, "anthropic.organization.federation.rules.retrieve", n, {
					route: "/v1/organizations/federation_rules/{federation_rule_id}",
					attributes: { "anthropic.organization.federation_rule.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, ...i } = t;
			return this._client.post(R`/v1/organizations/federation_rules/${e}?beta=true`, {
				body: i,
				...n,
				headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
				__span: k(this._client, "anthropic.organization.federation.rules.update", n, {
					route: "/v1/organizations/federation_rules/{federation_rule_id}",
					attributes: { "anthropic.organization.federation_rule.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, ...r } = e ?? {};
			return this._client.getAPIList("/v1/organizations/federation_rules?beta=true", F, {
				query: r,
				...t,
				headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
				__span: k(this._client, "anthropic.organization.federation.rules.list", t, {
					route: "/v1/organizations/federation_rules",
					queryParams: [
						"include_archived",
						"issuer_id",
						"limit",
						"page"
					]
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.post(R`/v1/organizations/federation_rules/${e}/archive?beta=true`, {
				...n,
				headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
				__span: k(this._client, "anthropic.organization.federation.rules.archive", n, {
					route: "/v1/organizations/federation_rules/{federation_rule_id}/archive",
					attributes: { "anthropic.organization.federation_rule.id": e }
				})
			});
		}
	}
	return e.Workspaces = ud, e;
})(), fd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.issuers = new ld(this._client), this.rules = new dd(this._client);
		}
	}
	return e.Issuers = ld, e.Rules = dd, e;
})(), pd = class extends I {
	create(e, t) {
		return this._client.post("/v1/organizations/invites?beta=true", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.invites.create", t, {
				route: "/v1/organizations/invites",
				createdIDAttribute: "anthropic.organization.invite.id"
			})
		});
	}
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/invites/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.invites.retrieve", t, {
				route: "/v1/organizations/invites/{invite_id}",
				attributes: { "anthropic.organization.invite.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/invites?beta=true", P, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.invites.list", t, {
				route: "/v1/organizations/invites",
				queryParams: [
					"after_id",
					"before_id",
					"email",
					"limit",
					"roles",
					"statuses"
				]
			})
		});
	}
	delete(e, t) {
		return this._client.delete(R`/v1/organizations/invites/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.invites.delete", t, {
				route: "/v1/organizations/invites/{invite_id}",
				attributes: { "anthropic.organization.invite.id": e }
			})
		});
	}
}, md = class extends I {
	retrieve(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.get(R`/v1/organizations/plugin_marketplaces/${e}?beta=true`, {
			query: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugin_marketplaces.retrieve", n, {
				route: "/v1/organizations/plugin_marketplaces/{marketplace_id}",
				queryParams: ["organization_id"],
				attributes: { "anthropic.organization.plugin_marketplace.id": e }
			})
		});
	}
	update(e, t, n) {
		let { betas: r, ...i } = t;
		return this._client.post(R`/v1/organizations/plugin_marketplaces/${e}?beta=true`, {
			body: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugin_marketplaces.update", n, {
				route: "/v1/organizations/plugin_marketplaces/{marketplace_id}",
				attributes: { "anthropic.organization.plugin_marketplace.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, ...r } = e ?? {};
		return this._client.getAPIList("/v1/organizations/plugin_marketplaces?beta=true", F, {
			query: r,
			...t,
			headers: D([{ "anthropic-beta": [...n ?? [], "ce-plugins-2026-09-01"].toString() }, t?.headers]),
			__span: k(this._client, "anthropic.organization.plugin_marketplaces.list", t, {
				route: "/v1/organizations/plugin_marketplaces",
				queryParams: [
					"limit",
					"organization_id",
					"owner_type",
					"page",
					"source"
				]
			})
		});
	}
	validateArchive(e, t) {
		let { betas: n, ...r } = e;
		return this._client.post("/v1/organizations/plugin_marketplaces/validate_archive?beta=true", to({
			body: r,
			...t,
			headers: D([{ "anthropic-beta": [...n ?? [], "ce-plugins-2026-09-01"].toString() }, t?.headers]),
			__span: k(this._client, "anthropic.organization.plugin_marketplaces.validate_archive", t, { route: "/v1/organizations/plugin_marketplaces/validate_archive" })
		}, this._client));
	}
	validateRepository(e, t) {
		let { betas: n, ...r } = e;
		return this._client.post("/v1/organizations/plugin_marketplaces/validate_repository?beta=true", {
			body: r,
			...t,
			headers: D([{ "anthropic-beta": [...n ?? [], "ce-plugins-2026-09-01"].toString() }, t?.headers]),
			__span: k(this._client, "anthropic.organization.plugin_marketplaces.validate_repository", t, { route: "/v1/organizations/plugin_marketplaces/validate_repository" })
		});
	}
}, hd = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/rate_limits?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.rate_limits.list", t, {
				route: "/v1/organizations/rate_limits",
				queryParams: [
					"group_type",
					"limit",
					"model",
					"page"
				]
			})
		});
	}
}, gd = class extends I {
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/users/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.users.retrieve", t, {
				route: "/v1/organizations/users/{user_id}",
				attributes: { "anthropic.organization.user.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/users/${e}?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.users.update", n, {
				route: "/v1/organizations/users/{user_id}",
				attributes: { "anthropic.organization.user.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/users?beta=true", P, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.users.list", t, {
				route: "/v1/organizations/users",
				queryParams: [
					"after_id",
					"before_id",
					"email",
					"limit",
					"roles"
				]
			})
		});
	}
	remove(e, t) {
		return this._client.delete(R`/v1/organizations/users/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.users.remove", t, {
				route: "/v1/organizations/users/{user_id}",
				attributes: { "anthropic.organization.user.id": e }
			})
		});
	}
}, _d = class extends I {
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/plugins/${e}/installation_settings?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.installation_settings.list", n, {
				route: "/v1/organizations/plugins/{plugin_id}/installation_settings",
				queryParams: [
					"limit",
					"organization_id",
					"page",
					"target_type"
				],
				attributes: { "anthropic.organization.plugin.id": e }
			})
		});
	}
	remove(e, t, n) {
		let { plugin_id: r, betas: i } = t;
		return this._client.delete(R`/v1/organizations/plugins/${r}/installation_settings/${e}?beta=true`, {
			...n,
			headers: D([{ "anthropic-beta": [...i ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.installation_settings.remove", n, {
				route: "/v1/organizations/plugins/{plugin_id}/installation_settings/{target}",
				attributes: {
					"anthropic.organization.plugin.id": r,
					"anthropic.organization.plugin.installation_setting.id": e
				}
			})
		});
	}
	set(e, t, n) {
		let { plugin_id: r, betas: i, ...a } = t;
		return this._client.post(R`/v1/organizations/plugins/${r}/installation_settings/${e}?beta=true`, {
			body: a,
			...n,
			headers: D([{ "anthropic-beta": [...i ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.installation_settings.set", n, {
				route: "/v1/organizations/plugins/{plugin_id}/installation_settings/{target}",
				attributes: {
					"anthropic.organization.plugin.id": r,
					"anthropic.organization.plugin.installation_setting.id": e
				}
			})
		});
	}
}, vd = class extends I {
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/plugins/${e}/shares?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.shares.list", n, {
				route: "/v1/organizations/plugins/{plugin_id}/shares",
				queryParams: [
					"limit",
					"organization_id",
					"page",
					"target_type"
				],
				attributes: { "anthropic.organization.plugin.id": e }
			})
		});
	}
}, yd = class extends I {
	create(e, t, n) {
		let { betas: r, ...i } = t;
		return this._client.post(R`/v1/organizations/plugins/${e}/versions?beta=true`, to({
			body: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.versions.create", n, {
				route: "/v1/organizations/plugins/{plugin_id}/versions",
				attributes: { "anthropic.organization.plugin.id": e },
				createdIDAttribute: "anthropic.organization.plugin.version.id"
			})
		}, this._client));
	}
	retrieve(e, t, n) {
		let { plugin_id: r, betas: i, ...a } = t;
		return this._client.get(R`/v1/organizations/plugins/${r}/versions/${e}?beta=true`, {
			query: a,
			...n,
			headers: D([{ "anthropic-beta": [...i ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.versions.retrieve", n, {
				route: "/v1/organizations/plugins/{plugin_id}/versions/{version}",
				queryParams: ["organization_id"],
				attributes: {
					"anthropic.organization.plugin.id": r,
					"anthropic.organization.plugin.version.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/plugins/${e}/versions?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.plugins.versions.list", n, {
				route: "/v1/organizations/plugins/{plugin_id}/versions",
				queryParams: [
					"limit",
					"organization_id",
					"page"
				],
				attributes: { "anthropic.organization.plugin.id": e }
			})
		});
	}
	download(e, t, n) {
		let { plugin_id: r, betas: i, ...a } = t;
		return this._client.get(R`/v1/organizations/plugins/${r}/versions/${e}/content?beta=true`, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "ce-plugins-2026-09-01"].toString(),
				Accept: "application/binary"
			}, n?.headers]),
			__binaryResponse: !0,
			__span: k(this._client, "anthropic.organization.plugins.versions.download", n, {
				route: "/v1/organizations/plugins/{plugin_id}/versions/{version}/content",
				queryParams: ["organization_id"],
				attributes: {
					"anthropic.organization.plugin.id": r,
					"anthropic.organization.plugin.version.id": e
				}
			})
		});
	}
}, bd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.versions = new yd(this._client), this.installationSettings = new _d(this._client), this.shares = new vd(this._client);
		}
		create(e, t) {
			let { betas: n, ...r } = e;
			return this._client.post("/v1/organizations/plugins?beta=true", to({
				body: r,
				...t,
				headers: D([{ "anthropic-beta": [...n ?? [], "ce-plugins-2026-09-01"].toString() }, t?.headers]),
				__span: k(this._client, "anthropic.organization.plugins.create", t, {
					route: "/v1/organizations/plugins",
					createdIDAttribute: "anthropic.organization.plugin.id"
				})
			}, this._client));
		}
		retrieve(e, t = {}, n) {
			let { betas: r, ...i } = t ?? {};
			return this._client.get(R`/v1/organizations/plugins/${e}?beta=true`, {
				query: i,
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.plugins.retrieve", n, {
					route: "/v1/organizations/plugins/{plugin_id}",
					queryParams: ["organization_id"],
					attributes: { "anthropic.organization.plugin.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, ...i } = t;
			return this._client.post(R`/v1/organizations/plugins/${e}?beta=true`, {
				body: i,
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.plugins.update", n, {
					route: "/v1/organizations/plugins/{plugin_id}",
					attributes: { "anthropic.organization.plugin.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, ...r } = e ?? {};
			return this._client.getAPIList("/v1/organizations/plugins?beta=true", F, {
				query: r,
				...t,
				headers: D([{ "anthropic-beta": [...n ?? [], "ce-plugins-2026-09-01"].toString() }, t?.headers]),
				__span: k(this._client, "anthropic.organization.plugins.list", t, {
					route: "/v1/organizations/plugins",
					queryParams: [
						"created_at[gt]",
						"created_at[gte]",
						"created_at[lt]",
						"created_at[lte]",
						"limit",
						"marketplace_id",
						"organization_id",
						"owner_type",
						"owner_user_id",
						"page"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.delete(R`/v1/organizations/plugins/${e}?beta=true`, {
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "ce-plugins-2026-09-01"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.plugins.delete", n, {
					route: "/v1/organizations/plugins/{plugin_id}",
					attributes: { "anthropic.organization.plugin.id": e }
				})
			});
		}
	}
	return e.Versions = yd, e.InstallationSettings = _d, e.Shares = vd, e;
})(), xd = class extends I {
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/rbac_groups/${e}/members?beta=true`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.rbac_groups.members.list", n, {
				route: "/v1/organizations/rbac_groups/{rbac_group_id}/members",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.rbac_group.id": e }
			})
		});
	}
	add(e, t, n) {
		return this._client.post(R`/v1/organizations/rbac_groups/${e}/members?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.rbac_groups.members.add", n, {
				route: "/v1/organizations/rbac_groups/{rbac_group_id}/members",
				attributes: { "anthropic.organization.rbac_group.id": e },
				createdIDAttribute: "anthropic.organization.rbac_group.member.id",
				createdIDField: "user_id"
			})
		});
	}
	remove(e, t, n) {
		let { rbac_group_id: r } = t;
		return this._client.delete(R`/v1/organizations/rbac_groups/${r}/members/${e}?beta=true`, {
			...n,
			__span: k(this._client, "anthropic.organization.rbac_groups.members.remove", n, {
				route: "/v1/organizations/rbac_groups/{rbac_group_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.rbac_group.id": r,
					"anthropic.organization.rbac_group.member.id": e
				}
			})
		});
	}
}, Sd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.members = new xd(this._client);
		}
		create(e, t) {
			return this._client.post("/v1/organizations/rbac_groups?beta=true", {
				body: e,
				...t,
				__span: k(this._client, "anthropic.organization.rbac_groups.create", t, {
					route: "/v1/organizations/rbac_groups",
					createdIDAttribute: "anthropic.organization.rbac_group.id"
				})
			});
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/rbac_groups/${e}?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.rbac_groups.retrieve", t, {
					route: "/v1/organizations/rbac_groups/{rbac_group_id}",
					attributes: { "anthropic.organization.rbac_group.id": e }
				})
			});
		}
		update(e, t, n) {
			return this._client.post(R`/v1/organizations/rbac_groups/${e}?beta=true`, {
				body: t,
				...n,
				__span: k(this._client, "anthropic.organization.rbac_groups.update", n, {
					route: "/v1/organizations/rbac_groups/{rbac_group_id}",
					attributes: { "anthropic.organization.rbac_group.id": e }
				})
			});
		}
		list(e = {}, t) {
			return this._client.getAPIList("/v1/organizations/rbac_groups?beta=true", F, {
				query: e,
				...t,
				__span: k(this._client, "anthropic.organization.rbac_groups.list", t, {
					route: "/v1/organizations/rbac_groups",
					queryParams: ["limit", "page"]
				})
			});
		}
		delete(e, t) {
			return this._client.delete(R`/v1/organizations/rbac_groups/${e}?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.rbac_groups.delete", t, {
					route: "/v1/organizations/rbac_groups/{rbac_group_id}",
					attributes: { "anthropic.organization.rbac_group.id": e }
				})
			});
		}
	}
	return e.Members = xd, e;
})(), Cd = class extends I {
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/rbac_roles/${e}/permissions?beta=true`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.rbac_roles.permissions.list", n, {
				route: "/v1/organizations/rbac_roles/{rbac_role_id}/permissions",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.rbac_role.id": e }
			})
		});
	}
}, wd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.permissions = new Cd(this._client);
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/rbac_roles/${e}?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.rbac_roles.retrieve", t, {
					route: "/v1/organizations/rbac_roles/{rbac_role_id}",
					attributes: { "anthropic.organization.rbac_role.id": e }
				})
			});
		}
		list(e = {}, t) {
			return this._client.getAPIList("/v1/organizations/rbac_roles?beta=true", F, {
				query: e,
				...t,
				__span: k(this._client, "anthropic.organization.rbac_roles.list", t, {
					route: "/v1/organizations/rbac_roles",
					queryParams: ["limit", "page"]
				})
			});
		}
	}
	return e.Permissions = Cd, e;
})(), Td = class extends I {
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/service_accounts/${e}/workspaces?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.service_accounts.workspaces.list", n, {
				route: "/v1/organizations/service_accounts/{service_account_id}/workspaces",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.service_account.id": e }
			})
		});
	}
	add(e, t, n) {
		let { betas: r, ...i } = t;
		return this._client.post(R`/v1/organizations/service_accounts/${e}/workspaces?beta=true`, {
			body: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.service_accounts.workspaces.add", n, {
				route: "/v1/organizations/service_accounts/{service_account_id}/workspaces",
				attributes: { "anthropic.organization.service_account.id": e },
				createdIDAttribute: "anthropic.organization.service_account.workspace.id",
				createdIDField: "workspace_id"
			})
		});
	}
	remove(e, t, n) {
		let { service_account_id: r, betas: i } = t;
		return this._client.delete(R`/v1/organizations/service_accounts/${r}/workspaces/${e}?beta=true`, {
			...n,
			headers: D([{ ...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.service_accounts.workspaces.remove", n, {
				route: "/v1/organizations/service_accounts/{service_account_id}/workspaces/{workspace_id}",
				attributes: {
					"anthropic.organization.service_account.id": r,
					"anthropic.organization.service_account.workspace.id": e
				}
			})
		});
	}
}, Ed = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.workspaces = new Td(this._client);
		}
		create(e, t) {
			let { betas: n, ...r } = e;
			return this._client.post("/v1/organizations/service_accounts?beta=true", {
				body: r,
				...t,
				headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
				__span: k(this._client, "anthropic.organization.service_accounts.create", t, {
					route: "/v1/organizations/service_accounts",
					createdIDAttribute: "anthropic.organization.service_account.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.get(R`/v1/organizations/service_accounts/${e}?beta=true`, {
				...n,
				headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
				__span: k(this._client, "anthropic.organization.service_accounts.retrieve", n, {
					route: "/v1/organizations/service_accounts/{service_account_id}",
					attributes: { "anthropic.organization.service_account.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, ...i } = t;
			return this._client.post(R`/v1/organizations/service_accounts/${e}?beta=true`, {
				body: i,
				...n,
				headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
				__span: k(this._client, "anthropic.organization.service_accounts.update", n, {
					route: "/v1/organizations/service_accounts/{service_account_id}",
					attributes: { "anthropic.organization.service_account.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, ...r } = e ?? {};
			return this._client.getAPIList("/v1/organizations/service_accounts?beta=true", F, {
				query: r,
				...t,
				headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
				__span: k(this._client, "anthropic.organization.service_accounts.list", t, {
					route: "/v1/organizations/service_accounts",
					queryParams: [
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.post(R`/v1/organizations/service_accounts/${e}/archive?beta=true`, {
				...n,
				headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
				__span: k(this._client, "anthropic.organization.service_accounts.archive", n, {
					route: "/v1/organizations/service_accounts/{service_account_id}/archive",
					attributes: { "anthropic.organization.service_account.id": e }
				})
			});
		}
	}
	return e.Workspaces = Td, e;
})(), Dd = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/spend_limits/effective?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.spend_limits.effective.list", t, {
				route: "/v1/organizations/spend_limits/effective",
				queryParams: [
					"limit",
					"page",
					"period",
					"user_ids"
				]
			})
		});
	}
}, Od = class extends I {
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/spend_limit_increase_requests/${e}?beta=true`, {
			...t,
			__span: k(this._client, "anthropic.organization.spend_limits.increase_requests.retrieve", t, {
				route: "/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}",
				attributes: { "anthropic.organization.spend_limit_increase_request.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/spend_limit_increase_requests?beta=true", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.spend_limits.increase_requests.list", t, {
				route: "/v1/organizations/spend_limit_increase_requests",
				queryParams: [
					"actor_ids",
					"limit",
					"page",
					"status"
				]
			})
		});
	}
	approve(e, t, n) {
		return this._client.post(R`/v1/organizations/spend_limit_increase_requests/${e}/approve?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.spend_limits.increase_requests.approve", n, {
				route: "/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}/approve",
				attributes: { "anthropic.organization.spend_limit_increase_request.id": e }
			})
		});
	}
	deny(e, t, n) {
		return this._client.post(R`/v1/organizations/spend_limit_increase_requests/${e}/deny?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.spend_limits.increase_requests.deny", n, {
				route: "/v1/organizations/spend_limit_increase_requests/{spend_limit_increase_request_id}/deny",
				attributes: { "anthropic.organization.spend_limit_increase_request.id": e }
			})
		});
	}
}, kd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.effective = new Dd(this._client), this.increaseRequests = new Od(this._client);
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/spend_limits/${e}?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.spend_limits.retrieve", t, {
					route: "/v1/organizations/spend_limits/{spend_limit_id}",
					attributes: { "anthropic.organization.spend_limit.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, ...r } = e ?? {};
			return this._client.getAPIList("/v1/organizations/spend_limits?beta=true", F, {
				query: r,
				...t,
				headers: D([{ "anthropic-beta": [...n ?? [], "spend-limit-reads-2026-09-26"].toString() }, t?.headers]),
				__span: k(this._client, "anthropic.organization.spend_limits.list", t, {
					route: "/v1/organizations/spend_limits",
					queryParams: [
						"limit",
						"page",
						"scope_type"
					]
				})
			});
		}
		delete(e, t) {
			return this._client.delete(R`/v1/organizations/spend_limits/${e}?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.spend_limits.delete", t, {
					route: "/v1/organizations/spend_limits/{spend_limit_id}",
					attributes: { "anthropic.organization.spend_limit.id": e }
				})
			});
		}
		set(e, t) {
			let { betas: n, ...r } = e;
			return this._client.post("/v1/organizations/spend_limits?beta=true", {
				body: r,
				...t,
				headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
				__span: k(this._client, "anthropic.organization.spend_limits.set", t, {
					route: "/v1/organizations/spend_limits",
					createdIDAttribute: "anthropic.organization.spend_limit.id"
				})
			});
		}
	}
	return e.Effective = Dd, e.IncreaseRequests = Od, e;
})(), Ad = class extends I {
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/telemetry_destinations/${e}/workspaces?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ "anthropic-beta": [...r ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.telemetry_destinations.workspaces.list", n, {
				route: "/v1/organizations/telemetry_destinations/{destination_id}/workspaces",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.telemetry_destination.id": e }
			})
		});
	}
	add(e, t, n) {
		let { destination_id: r, betas: i } = t;
		return this._client.post(R`/v1/organizations/telemetry_destinations/${r}/workspaces/${e}?beta=true`, {
			...n,
			headers: D([{ "anthropic-beta": [...i ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.telemetry_destinations.workspaces.add", n, {
				route: "/v1/organizations/telemetry_destinations/{destination_id}/workspaces/{workspace_id}",
				attributes: {
					"anthropic.organization.telemetry_destination.id": r,
					"anthropic.organization.telemetry_destination.workspace.id": e
				}
			})
		});
	}
	remove(e, t, n) {
		let { destination_id: r, betas: i } = t;
		return this._client.delete(R`/v1/organizations/telemetry_destinations/${r}/workspaces/${e}?beta=true`, {
			...n,
			headers: D([{ "anthropic-beta": [...i ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
			__span: k(this._client, "anthropic.organization.telemetry_destinations.workspaces.remove", n, {
				route: "/v1/organizations/telemetry_destinations/{destination_id}/workspaces/{workspace_id}",
				attributes: {
					"anthropic.organization.telemetry_destination.id": r,
					"anthropic.organization.telemetry_destination.workspace.id": e
				}
			})
		});
	}
}, jd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.workspaces = new Ad(this._client);
		}
		create(e, t) {
			let { betas: n, ...r } = e;
			return this._client.post("/v1/organizations/telemetry_destinations?beta=true", {
				body: r,
				...t,
				headers: D([{ "anthropic-beta": [...n ?? [], "telemetry-destinations-2026-08-11"].toString() }, t?.headers]),
				__span: k(this._client, "anthropic.organization.telemetry_destinations.create", t, {
					route: "/v1/organizations/telemetry_destinations",
					createdIDAttribute: "anthropic.organization.telemetry_destination.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.get(R`/v1/organizations/telemetry_destinations/${e}?beta=true`, {
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.telemetry_destinations.retrieve", n, {
					route: "/v1/organizations/telemetry_destinations/{destination_id}",
					attributes: { "anthropic.organization.telemetry_destination.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, ...i } = t;
			return this._client.post(R`/v1/organizations/telemetry_destinations/${e}?beta=true`, {
				body: i,
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.telemetry_destinations.update", n, {
					route: "/v1/organizations/telemetry_destinations/{destination_id}",
					attributes: { "anthropic.organization.telemetry_destination.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, ...r } = e ?? {};
			return this._client.getAPIList("/v1/organizations/telemetry_destinations?beta=true", F, {
				query: r,
				...t,
				headers: D([{ "anthropic-beta": [...n ?? [], "telemetry-destinations-2026-08-11"].toString() }, t?.headers]),
				__span: k(this._client, "anthropic.organization.telemetry_destinations.list", t, {
					route: "/v1/organizations/telemetry_destinations",
					queryParams: [
						"limit",
						"page",
						"workspace_ids"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.delete(R`/v1/organizations/telemetry_destinations/${e}?beta=true`, {
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.telemetry_destinations.delete", n, {
					route: "/v1/organizations/telemetry_destinations/{destination_id}",
					attributes: { "anthropic.organization.telemetry_destination.id": e }
				})
			});
		}
		test(e, t = {}, n) {
			let { betas: r } = t ?? {};
			return this._client.post(R`/v1/organizations/telemetry_destinations/${e}/test?beta=true`, {
				...n,
				headers: D([{ "anthropic-beta": [...r ?? [], "telemetry-destinations-2026-08-11"].toString() }, n?.headers]),
				__span: k(this._client, "anthropic.organization.telemetry_destinations.test", n, {
					route: "/v1/organizations/telemetry_destinations/{destination_id}/test",
					attributes: { "anthropic.organization.telemetry_destination.id": e }
				})
			});
		}
	}
	return e.Workspaces = Ad, e;
})(), Md = class extends I {
	retrieve(e, t, n) {
		let { workspace_id: r } = t;
		return this._client.get(R`/v1/organizations/workspaces/${r}/members/${e}?beta=true`, {
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.retrieve", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.member.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { workspace_id: r, ...i } = t;
		return this._client.post(R`/v1/organizations/workspaces/${r}/members/${e}?beta=true`, {
			body: i,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.update", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.member.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/workspaces/${e}/members?beta=true`, P, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.list", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members",
				queryParams: [
					"after_id",
					"before_id",
					"limit"
				],
				attributes: { "anthropic.organization.workspace.id": e }
			})
		});
	}
	add(e, t, n) {
		return this._client.post(R`/v1/organizations/workspaces/${e}/members?beta=true`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.add", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members",
				attributes: { "anthropic.organization.workspace.id": e },
				createdIDAttribute: "anthropic.organization.workspace.member.id",
				createdIDField: "user_id"
			})
		});
	}
	remove(e, t, n) {
		let { workspace_id: r } = t;
		return this._client.delete(R`/v1/organizations/workspaces/${r}/members/${e}?beta=true`, {
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.remove", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.member.id": e
				}
			})
		});
	}
}, Nd = class extends I {
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/workspaces/${e}/rate_limits?beta=true`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.rate_limits.list", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/rate_limits",
				queryParams: [
					"group_type",
					"include_inherited",
					"limit",
					"page"
				],
				attributes: { "anthropic.organization.workspace.id": e }
			})
		});
	}
}, Pd = class extends I {
	retrieve(e, t, n) {
		let { workspace_id: r, betas: i } = t;
		return this._client.get(R`/v1/organizations/workspaces/${r}/service_accounts/${e}?beta=true`, {
			...n,
			headers: D([{ ...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.retrieve", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.service_account.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { workspace_id: r, betas: i, ...a } = t;
		return this._client.post(R`/v1/organizations/workspaces/${r}/service_accounts/${e}?beta=true`, {
			body: a,
			...n,
			headers: D([{ ...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.update", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.service_account.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/organizations/workspaces/${e}/service_accounts?beta=true`, F, {
			query: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.list", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.workspace.id": e }
			})
		});
	}
	add(e, t, n) {
		let { betas: r, ...i } = t;
		return this._client.post(R`/v1/organizations/workspaces/${e}/service_accounts?beta=true`, {
			body: i,
			...n,
			headers: D([{ ...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.add", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts",
				attributes: { "anthropic.organization.workspace.id": e },
				createdIDAttribute: "anthropic.organization.workspace.service_account.id",
				createdIDField: "service_account_id"
			})
		});
	}
	remove(e, t, n) {
		let { workspace_id: r, betas: i } = t;
		return this._client.delete(R`/v1/organizations/workspaces/${r}/service_accounts/${e}?beta=true`, {
			...n,
			headers: D([{ ...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() } }, n?.headers]),
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.remove", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.service_account.id": e
				}
			})
		});
	}
}, Fd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.rateLimits = new Nd(this._client), this.members = new Md(this._client), this.serviceAccounts = new Pd(this._client);
		}
		create(e, t) {
			let { betas: n, ...r } = e;
			return this._client.post("/v1/organizations/workspaces?beta=true", {
				body: r,
				...t,
				headers: D([{ ...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() } }, t?.headers]),
				__span: k(this._client, "anthropic.organization.workspaces.create", t, {
					route: "/v1/organizations/workspaces",
					createdIDAttribute: "anthropic.organization.workspace.id"
				})
			});
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/workspaces/${e}?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.retrieve", t, {
					route: "/v1/organizations/workspaces/{workspace_id}",
					attributes: { "anthropic.organization.workspace.id": e }
				})
			});
		}
		update(e, t, n) {
			return this._client.post(R`/v1/organizations/workspaces/${e}?beta=true`, {
				body: t,
				...n,
				__span: k(this._client, "anthropic.organization.workspaces.update", n, {
					route: "/v1/organizations/workspaces/{workspace_id}",
					attributes: { "anthropic.organization.workspace.id": e }
				})
			});
		}
		list(e = {}, t) {
			return this._client.getAPIList("/v1/organizations/workspaces?beta=true", P, {
				query: e,
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.list", t, {
					route: "/v1/organizations/workspaces",
					queryParams: [
						"after_id",
						"before_id",
						"include_archived",
						"include_default",
						"limit"
					]
				})
			});
		}
		archive(e, t) {
			return this._client.post(R`/v1/organizations/workspaces/${e}/archive?beta=true`, {
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.archive", t, {
					route: "/v1/organizations/workspaces/{workspace_id}/archive",
					attributes: { "anthropic.organization.workspace.id": e }
				})
			});
		}
	}
	return e.RateLimits = Nd, e.Members = Md, e.ServiceAccounts = Pd, e;
})(), Id = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.apiKeys = new Ku(this._client), this.externalKeys = new cd(this._client), this.federation = new fd(this._client), this.invites = new pd(this._client), this.serviceAccounts = new Ed(this._client), this.users = new gd(this._client), this.workspaces = new Fd(this._client), this.rateLimits = new hd(this._client), this.complianceSettings = new sd(this._client), this.analytics = new od(this._client), this.spendLimits = new kd(this._client), this.rbacGroups = new Sd(this._client), this.rbacRoles = new wd(this._client), this.plugins = new bd(this._client), this.pluginMarketplaces = new md(this._client), this.telemetryDestinations = new jd(this._client);
		}
		retrieve(e) {
			return this._client.get("/v1/organizations/me?beta=true", {
				...e,
				__span: k(this._client, "anthropic.organization.retrieve", e, { route: "/v1/organizations/me" })
			});
		}
	}
	return e.APIKeys = Ku, e.ExternalKeys = cd, e.Federation = fd, e.Invites = pd, e.ServiceAccounts = Ed, e.Users = gd, e.Workspaces = Fd, e.RateLimits = hd, e.ComplianceSettings = sd, e.Analytics = od, e.SpendLimits = kd, e.RBACGroups = Sd, e.RBACRoles = wd, e.Plugins = bd, e.PluginMarketplaces = md, e.TelemetryDestinations = jd, e;
})(), Ld = /* @__PURE__ */ (() => {
	class e extends I {
		list(e, t = {}, n) {
			let { betas: r, workspace_id: i, ...a } = t ?? {};
			return this._client.getAPIList(R`/v1/sessions/${e}/events?beta=true`, F, {
				query: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.events.list", n, {
					route: "/v1/sessions/{session_id}/events",
					queryParams: [
						"created_at[gt]",
						"created_at[gte]",
						"created_at[lt]",
						"created_at[lte]",
						"limit",
						"order",
						"page",
						"types"
					],
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		send(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/sessions/${e}/events?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.events.send", n, {
					route: "/v1/sessions/{session_id}/events",
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		stream(e, t = {}, n) {
			let { betas: r, workspace_id: i, ...a } = t ?? {};
			return this._client.get(R`/v1/sessions/${e}/events/stream?beta=true`, {
				query: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				stream: !0,
				__span: k(this._client, "anthropic.sessions.events.stream", n, {
					route: "/v1/sessions/{session_id}/events/stream",
					queryParams: ["event_deltas"],
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		toolRunner(e, t) {
			return new ol(e, {
				...t,
				client: this._client
			});
		}
	}
	return e.SessionToolRunner = ol, e;
})(), Rd = class extends I {
	retrieve(e, t, n) {
		let { session_id: r, betas: i, workspace_id: a } = t;
		return this._client.get(R`/v1/sessions/${r}/resources/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.sessions.resources.retrieve", n, {
				route: "/v1/sessions/{session_id}/resources/{resource_id}",
				attributes: {
					"anthropic.session.id": r,
					"anthropic.session.resource.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { session_id: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.post(R`/v1/sessions/${r}/resources/${e}?beta=true`, {
			body: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.sessions.resources.update", n, {
				route: "/v1/sessions/{session_id}/resources/{resource_id}",
				attributes: {
					"anthropic.session.id": r,
					"anthropic.session.resource.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/sessions/${e}/resources?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.sessions.resources.list", n, {
				route: "/v1/sessions/{session_id}/resources",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.session.id": e }
			})
		});
	}
	delete(e, t, n) {
		let { session_id: r, betas: i, workspace_id: a } = t;
		return this._client.delete(R`/v1/sessions/${r}/resources/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.sessions.resources.delete", n, {
				route: "/v1/sessions/{session_id}/resources/{resource_id}",
				attributes: {
					"anthropic.session.id": r,
					"anthropic.session.resource.id": e
				}
			})
		});
	}
	add(e, t, n) {
		let { betas: r, workspace_id: i, ...a } = t;
		return this._client.post(R`/v1/sessions/${e}/resources?beta=true`, {
			body: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.sessions.resources.add", n, {
				route: "/v1/sessions/{session_id}/resources",
				attributes: { "anthropic.session.id": e },
				createdIDAttribute: "anthropic.session.resource.id"
			})
		});
	}
}, zd = class extends I {
	list(e, t, n) {
		let { session_id: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.getAPIList(R`/v1/sessions/${r}/threads/${e}/events?beta=true`, F, {
			query: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.sessions.threads.events.list", n, {
				route: "/v1/sessions/{session_id}/threads/{thread_id}/events",
				queryParams: ["limit", "page"],
				attributes: {
					"anthropic.session.id": r,
					"anthropic.session.thread.id": e
				}
			})
		});
	}
	stream(e, t, n) {
		let { session_id: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.get(R`/v1/sessions/${r}/threads/${e}/stream?beta=true`, {
			query: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			stream: !0,
			__span: k(this._client, "anthropic.sessions.threads.events.stream", n, {
				route: "/v1/sessions/{session_id}/threads/{thread_id}/stream",
				queryParams: ["event_deltas"],
				attributes: {
					"anthropic.session.id": r,
					"anthropic.session.thread.id": e
				}
			})
		});
	}
}, Bd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.events = new zd(this._client);
		}
		retrieve(e, t, n) {
			let { session_id: r, betas: i, workspace_id: a } = t;
			return this._client.get(R`/v1/sessions/${r}/threads/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
					...a == null ? void 0 : { "anthropic-workspace-id": a }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.threads.retrieve", n, {
					route: "/v1/sessions/{session_id}/threads/{thread_id}",
					attributes: {
						"anthropic.session.id": r,
						"anthropic.session.thread.id": e
					}
				})
			});
		}
		list(e, t = {}, n) {
			let { betas: r, workspace_id: i, ...a } = t ?? {};
			return this._client.getAPIList(R`/v1/sessions/${e}/threads?beta=true`, F, {
				query: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.threads.list", n, {
					route: "/v1/sessions/{session_id}/threads",
					queryParams: [
						"limit",
						"page",
						"statuses"
					],
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		archive(e, t, n) {
			let { session_id: r, betas: i, workspace_id: a } = t;
			return this._client.post(R`/v1/sessions/${r}/threads/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
					...a == null ? void 0 : { "anthropic-workspace-id": a }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.threads.archive", n, {
					route: "/v1/sessions/{session_id}/threads/{thread_id}/archive",
					attributes: {
						"anthropic.session.id": r,
						"anthropic.session.thread.id": e
					}
				})
			});
		}
	}
	return e.Events = zd, e;
})(), Vd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.events = new Ld(this._client), this.resources = new Rd(this._client), this.threads = new Bd(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e, a = D([{
				"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]), o = k(this._client, "anthropic.sessions.create", t, {
				route: "/v1/sessions",
				attributes: {
					"gen_ai.agent.id": typeof i.agent == "object" ? i.agent?.id : i.agent,
					"anthropic.session.environment.id": i.environment_id
				},
				createdIDAttribute: "anthropic.session.id"
			}), s = this._client.post("/v1/sessions?beta=true", {
				body: i,
				...t,
				headers: a,
				__span: o
			});
			return o ? s._thenUnwrap((e) => (ra(this._client, o, e), e)) : s;
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/sessions/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.retrieve", n, {
					route: "/v1/sessions/{session_id}",
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/sessions/${e}?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.update", n, {
					route: "/v1/sessions/{session_id}",
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/sessions?beta=true", uo, {
				query: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.sessions.list", t, {
					route: "/v1/sessions",
					queryParams: [
						"agent_id",
						"agent_version",
						"created_at[gt]",
						"created_at[gte]",
						"created_at[lt]",
						"created_at[lte]",
						"deployment_id",
						"include_archived",
						"limit",
						"memory_store_id",
						"order",
						"page",
						"statuses"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.delete(R`/v1/sessions/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.delete", n, {
					route: "/v1/sessions/{session_id}",
					attributes: { "anthropic.session.id": e }
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/sessions/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.sessions.archive", n, {
					route: "/v1/sessions/{session_id}/archive",
					attributes: { "anthropic.session.id": e }
				})
			});
		}
	}
	return e.Events = Ld, e.Resources = Rd, e.Threads = Bd, e;
})(), Hd = class extends I {
	create(e, t, n) {
		let { betas: r, workspace_id: i, ...a } = t;
		return this._client.post(R`/v1/skills/${e}/versions?beta=true`, to({
			body: a,
			...n,
			headers: D([{
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.create", n, {
				route: "/v1/skills/{skill_id}/versions",
				attributes: { "anthropic.skill.id": e },
				createdIDAttribute: "anthropic.skill.version.id"
			})
		}, this._client, !1));
	}
	retrieve(e, t, n) {
		let { skill_id: r, betas: i, workspace_id: a } = t;
		return this._client.get(R`/v1/skills/${r}/versions/${e}?beta=true`, {
			...n,
			headers: D([{
				...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() },
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.retrieve", n, {
				route: "/v1/skills/{skill_id}/versions/{version}",
				attributes: {
					"anthropic.skill.id": r,
					"anthropic.skill.version.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/skills/${e}/versions?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.list", n, {
				route: "/v1/skills/{skill_id}/versions",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.skill.id": e }
			})
		});
	}
	delete(e, t, n) {
		let { skill_id: r, betas: i, workspace_id: a } = t;
		return this._client.delete(R`/v1/skills/${r}/versions/${e}?beta=true`, {
			...n,
			headers: D([{
				...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() },
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.delete", n, {
				route: "/v1/skills/{skill_id}/versions/{version}",
				attributes: {
					"anthropic.skill.id": r,
					"anthropic.skill.version.id": e
				}
			})
		});
	}
	download(e, t, n) {
		let { skill_id: r, betas: i, workspace_id: a } = t;
		return this._client.get(R`/v1/skills/${r}/versions/${e}/content?beta=true`, {
			...n,
			headers: D([{
				Accept: "application/binary",
				...i?.toString() == null ? void 0 : { "anthropic-beta": i?.toString() },
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__binaryResponse: !0,
			__span: k(this._client, "anthropic.skills.versions.download", n, {
				route: "/v1/skills/{skill_id}/versions/{version}/content",
				attributes: {
					"anthropic.skill.id": r,
					"anthropic.skill.version.id": e
				}
			})
		});
	}
}, Ud = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.versions = new Hd(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e;
			return this._client.post("/v1/skills?beta=true", to({
				body: i,
				...t,
				headers: D([{
					...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.skills.create", t, {
					route: "/v1/skills",
					createdIDAttribute: "anthropic.skill.id"
				})
			}, this._client, !1));
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/skills/${e}?beta=true`, {
				...n,
				headers: D([{
					...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.skills.retrieve", n, {
					route: "/v1/skills/{skill_id}",
					attributes: { "anthropic.skill.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/skills?beta=true", F, {
				query: i,
				...t,
				headers: D([{
					...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.skills.list", t, {
					route: "/v1/skills",
					queryParams: [
						"limit",
						"page",
						"source"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.delete(R`/v1/skills/${e}?beta=true`, {
				...n,
				headers: D([{
					...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.skills.delete", n, {
					route: "/v1/skills/{skill_id}",
					attributes: { "anthropic.skill.id": e }
				})
			});
		}
	}
	return e.Versions = Hd, e;
})(), Wd = class extends I {
	create(e, t, n) {
		let { betas: r, workspace_id: i, ...a } = t;
		return this._client.post(R`/v1/tunnels/${e}/certificates?beta=true`, {
			body: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "mcp-tunnels-2026-06-22"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.tunnels.certificates.create", n, {
				route: "/v1/tunnels/{tunnel_id}/certificates",
				attributes: { "anthropic.tunnel.id": e },
				createdIDAttribute: "anthropic.tunnel.certificate.id"
			})
		});
	}
	retrieve(e, t, n) {
		let { tunnel_id: r, betas: i, workspace_id: a } = t;
		return this._client.get(R`/v1/tunnels/${r}/certificates/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "mcp-tunnels-2026-06-22"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.tunnels.certificates.retrieve", n, {
				route: "/v1/tunnels/{tunnel_id}/certificates/{certificate_id}",
				attributes: {
					"anthropic.tunnel.id": r,
					"anthropic.tunnel.certificate.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/tunnels/${e}/certificates?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "mcp-tunnels-2026-06-22"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.tunnels.certificates.list", n, {
				route: "/v1/tunnels/{tunnel_id}/certificates",
				queryParams: [
					"include_archived",
					"limit",
					"page"
				],
				attributes: { "anthropic.tunnel.id": e }
			})
		});
	}
	archive(e, t, n) {
		let { tunnel_id: r, betas: i, workspace_id: a } = t;
		return this._client.post(R`/v1/tunnels/${r}/certificates/${e}/archive?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "mcp-tunnels-2026-06-22"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.tunnels.certificates.archive", n, {
				route: "/v1/tunnels/{tunnel_id}/certificates/{certificate_id}/archive",
				attributes: {
					"anthropic.tunnel.id": r,
					"anthropic.tunnel.certificate.id": e
				}
			})
		});
	}
}, Gd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.certificates = new Wd(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e;
			return this._client.post("/v1/tunnels?beta=true", {
				body: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "mcp-tunnels-2026-06-22"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.tunnels.create", t, {
					route: "/v1/tunnels",
					createdIDAttribute: "anthropic.tunnel.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/tunnels/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "mcp-tunnels-2026-06-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.tunnels.retrieve", n, {
					route: "/v1/tunnels/{tunnel_id}",
					attributes: { "anthropic.tunnel.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/tunnels?beta=true", F, {
				query: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "mcp-tunnels-2026-06-22"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.tunnels.list", t, {
					route: "/v1/tunnels",
					queryParams: [
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/tunnels/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "mcp-tunnels-2026-06-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.tunnels.archive", n, {
					route: "/v1/tunnels/{tunnel_id}/archive",
					attributes: { "anthropic.tunnel.id": e }
				})
			});
		}
		revealToken(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/tunnels/${e}/reveal_token?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "mcp-tunnels-2026-06-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.tunnels.reveal_token", n, {
					route: "/v1/tunnels/{tunnel_id}/reveal_token",
					attributes: { "anthropic.tunnel.id": e }
				})
			});
		}
		rotateToken(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/tunnels/${e}/rotate_token?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "mcp-tunnels-2026-06-22"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.tunnels.rotate_token", n, {
					route: "/v1/tunnels/{tunnel_id}/rotate_token",
					attributes: { "anthropic.tunnel.id": e }
				})
			});
		}
	}
	return e.Certificates = Wd, e;
})(), Kd = class extends I {
	create(e, t, n) {
		let { betas: r, workspace_id: i, ...a } = t;
		return this._client.post(R`/v1/vaults/${e}/credentials?beta=true`, {
			body: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.create", n, {
				route: "/v1/vaults/{vault_id}/credentials",
				attributes: { "anthropic.vault.id": e },
				createdIDAttribute: "anthropic.vault.credential.id"
			})
		});
	}
	retrieve(e, t, n) {
		let { vault_id: r, betas: i, workspace_id: a } = t;
		return this._client.get(R`/v1/vaults/${r}/credentials/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.retrieve", n, {
				route: "/v1/vaults/{vault_id}/credentials/{credential_id}",
				attributes: {
					"anthropic.vault.id": r,
					"anthropic.vault.credential.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { vault_id: r, betas: i, workspace_id: a, ...o } = t;
		return this._client.post(R`/v1/vaults/${r}/credentials/${e}?beta=true`, {
			body: o,
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.update", n, {
				route: "/v1/vaults/{vault_id}/credentials/{credential_id}",
				attributes: {
					"anthropic.vault.id": r,
					"anthropic.vault.credential.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { betas: r, workspace_id: i, ...a } = t ?? {};
		return this._client.getAPIList(R`/v1/vaults/${e}/credentials?beta=true`, F, {
			query: a,
			...n,
			headers: D([{
				"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.list", n, {
				route: "/v1/vaults/{vault_id}/credentials",
				queryParams: [
					"include_archived",
					"limit",
					"page"
				],
				attributes: { "anthropic.vault.id": e }
			})
		});
	}
	delete(e, t, n) {
		let { vault_id: r, betas: i, workspace_id: a } = t;
		return this._client.delete(R`/v1/vaults/${r}/credentials/${e}?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.delete", n, {
				route: "/v1/vaults/{vault_id}/credentials/{credential_id}",
				attributes: {
					"anthropic.vault.id": r,
					"anthropic.vault.credential.id": e
				}
			})
		});
	}
	archive(e, t, n) {
		let { vault_id: r, betas: i, workspace_id: a } = t;
		return this._client.post(R`/v1/vaults/${r}/credentials/${e}/archive?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.archive", n, {
				route: "/v1/vaults/{vault_id}/credentials/{credential_id}/archive",
				attributes: {
					"anthropic.vault.id": r,
					"anthropic.vault.credential.id": e
				}
			})
		});
	}
	mcpOAuthValidate(e, t, n) {
		let { vault_id: r, betas: i, workspace_id: a } = t;
		return this._client.post(R`/v1/vaults/${r}/credentials/${e}/mcp_oauth_validate?beta=true`, {
			...n,
			headers: D([{
				"anthropic-beta": [...i ?? [], "managed-agents-2026-04-01"].toString(),
				...a == null ? void 0 : { "anthropic-workspace-id": a }
			}, n?.headers]),
			__span: k(this._client, "anthropic.vaults.credentials.mcp_oauth_validate", n, {
				route: "/v1/vaults/{vault_id}/credentials/{credential_id}/mcp_oauth_validate",
				attributes: {
					"anthropic.vault.id": r,
					"anthropic.vault.credential.id": e
				}
			})
		});
	}
}, qd = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.credentials = new Kd(this._client);
		}
		create(e, t) {
			let { betas: n, workspace_id: r, ...i } = e;
			return this._client.post("/v1/vaults?beta=true", {
				body: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.vaults.create", t, {
					route: "/v1/vaults",
					createdIDAttribute: "anthropic.vault.id"
				})
			});
		}
		retrieve(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.get(R`/v1/vaults/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.vaults.retrieve", n, {
					route: "/v1/vaults/{vault_id}",
					attributes: { "anthropic.vault.id": e }
				})
			});
		}
		update(e, t, n) {
			let { betas: r, workspace_id: i, ...a } = t;
			return this._client.post(R`/v1/vaults/${e}?beta=true`, {
				body: a,
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.vaults.update", n, {
					route: "/v1/vaults/{vault_id}",
					attributes: { "anthropic.vault.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { betas: n, workspace_id: r, ...i } = e ?? {};
			return this._client.getAPIList("/v1/vaults?beta=true", F, {
				query: i,
				...t,
				headers: D([{
					"anthropic-beta": [...n ?? [], "managed-agents-2026-04-01"].toString(),
					...r == null ? void 0 : { "anthropic-workspace-id": r }
				}, t?.headers]),
				__span: k(this._client, "anthropic.vaults.list", t, {
					route: "/v1/vaults",
					queryParams: [
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.delete(R`/v1/vaults/${e}?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.vaults.delete", n, {
					route: "/v1/vaults/{vault_id}",
					attributes: { "anthropic.vault.id": e }
				})
			});
		}
		archive(e, t = {}, n) {
			let { betas: r, workspace_id: i } = t ?? {};
			return this._client.post(R`/v1/vaults/${e}/archive?beta=true`, {
				...n,
				headers: D([{
					"anthropic-beta": [...r ?? [], "managed-agents-2026-04-01"].toString(),
					...i == null ? void 0 : { "anthropic-workspace-id": i }
				}, n?.headers]),
				__span: k(this._client, "anthropic.vaults.archive", n, {
					route: "/v1/vaults/{vault_id}/archive",
					attributes: { "anthropic.vault.id": e }
				})
			});
		}
	}
	return e.Credentials = Kd, e;
})(), Jd, Yd, Xd, Zd, Qd, $d, ef, tf, nf, rf, af, of = /* @__PURE__ */ (() => {
	class e extends Nu {
		constructor(e, t, n) {
			super(e, { client: n }), Jd.add(this), Yd.set(this, void 0), Xd.set(this, 0), Zd.set(this, []), Qd.set(this, []), $d.set(this, void 0), ef.set(this, []), tf.set(this, !1), i(this, Yd, t, "f");
		}
		get toolCalls() {
			return a(this, Qd, "f");
		}
		static start(t, n, r, i) {
			let a = new e({
				...n,
				stream: !0
			}, i, t);
			for (let e of n.messages) a._addMessageParam(e);
			return a._run(() => a._createMessage(t.beta.messages, {
				...n,
				stream: !0
			}, {
				...r,
				headers: {
					...r?.headers,
					[ha]: "stream"
				}
			})), a;
		}
		_deliverEvent(e, t) {
			var n;
			i(this, Xd, (n = a(this, Xd, "f"), n++, n), "f");
			let r = e.type === "content_block_stop" ? t?.content[e.index] : void 0, o = r?.type === "tool_use" ? r : void 0;
			o && a(this, Qd, "f").push(o), super._deliverEvent(e, t), a(this, Jd, "m", nf).call(this, e, o), a(this, Jd, "m", rf).call(this);
		}
		[(Yd = /* @__PURE__ */ new WeakMap(), Xd = /* @__PURE__ */ new WeakMap(), Zd = /* @__PURE__ */ new WeakMap(), Qd = /* @__PURE__ */ new WeakMap(), $d = /* @__PURE__ */ new WeakMap(), ef = /* @__PURE__ */ new WeakMap(), tf = /* @__PURE__ */ new WeakMap(), Jd = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
			let e = super[Symbol.asyncIterator](), t = { handled: a(this, Xd, "f") };
			a(this, Zd, "f").push(t);
			let n = !1;
			return {
				next: async () => {
					n && (n = !1, t.handled++, a(this, Jd, "m", rf).call(this));
					try {
						let r = await e.next();
						return n = !r.done, r.done && a(this, Jd, "m", af).call(this, t), r;
					} catch (e) {
						throw a(this, Jd, "m", af).call(this, t), e;
					}
				},
				return: async () => {
					let n = e.return?.();
					return a(this, Jd, "m", af).call(this, t), await n ?? {
						value: void 0,
						done: !0
					};
				}
			};
		}
	}
	return nf = function(e, t) {
		if (a(this, tf, "f")) return;
		if (e.type === "content_block_start" && e.content_block.type === "fallback") {
			i(this, tf, !0, "f"), i(this, $d, void 0, "f");
			return;
		}
		let n = e.type === "content_block_start" || e.type === "message_delta" && e.delta.stop_reason === "tool_use";
		a(this, $d, "f") && n && (a(this, ef, "f").push({
			toolUse: a(this, $d, "f"),
			event: a(this, Xd, "f")
		}), i(this, $d, void 0, "f")), t && i(this, $d, t, "f");
	}, rf = function() {
		if (this.errored || this.controller.signal.aborted) return;
		let e = Math.min(a(this, Xd, "f"), ...a(this, Zd, "f").map((e) => e.handled));
		for (; a(this, ef, "f")[0] && a(this, ef, "f")[0].event <= e;) a(this, Yd, "f").call(this, a(this, ef, "f").shift().toolUse);
	}, af = function(e) {
		let t = a(this, Zd, "f").indexOf(e);
		t >= 0 && (a(this, Zd, "f").splice(t, 1), a(this, Jd, "m", rf).call(this));
	}, e;
})();
// node_modules/@anthropic-ai/sdk/internal/utils/promise.mjs
function sf() {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
b();
var J, cf, lf, Y, X, Z, uf, df, ff, pf, mf, Q, hf, gf, _f, vf, yf, bf, xf, Sf, Cf, wf, Tf, Ef, Df, Of, kf, Af, jf, Mf = "a tool runner's toolsets come only from its tools param; change them with setMessagesParams(), or build a new runner", Nf = "a tool runner's toolsets come only from its tools param; remove it there with setMessagesParams(), or build a new runner without it", Pf = /* @__PURE__ */ (() => {
	class e {
		constructor(e, t, n) {
			J.add(this), this.client = e, cf.set(this, !1), lf.set(this, !1), Y.set(this, void 0), X.set(this, void 0), Z.set(this, void 0), uf.set(this, void 0), df.set(this, void 0), ff.set(this, void 0), pf.set(this, 0), mf.set(this, void 0), Q.set(this, { status: "idle" }), hf.set(this, void 0), gf.set(this, null), _f.set(this, /* @__PURE__ */ new Map()), vf.set(this, []), Ff(t), If(t), Lf(t), i(this, Y, { params: {
				...t,
				messages: JSON.parse(JSON.stringify(Vf(t.messages)))
			} }, "f");
			let r = ya(t.tools, t.messages);
			i(this, X, {
				...n,
				headers: D([
					ga("BetaToolRunner"),
					r.length ? { [ma]: r.join(", ") } : void 0,
					n?.headers
				])
			}, "f"), i(this, ff, sf(), "f");
		}
		async *[(cf = /* @__PURE__ */ new WeakMap(), lf = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), uf = /* @__PURE__ */ new WeakMap(), df = /* @__PURE__ */ new WeakMap(), ff = /* @__PURE__ */ new WeakMap(), pf = /* @__PURE__ */ new WeakMap(), mf = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap(), hf = /* @__PURE__ */ new WeakMap(), gf = /* @__PURE__ */ new WeakMap(), _f = /* @__PURE__ */ new WeakMap(), vf = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakSet(), yf = function(e) {
			return a(this, mf, "f") ? S.with(a(this, mf, "f"), e) : e();
		}, Symbol.asyncIterator)]() {
			var e;
			if (a(this, cf, "f")) throw new l("Cannot iterate over a consumed stream");
			i(this, cf, !0, "f"), i(this, lf, !0, "f"), i(this, df, void 0, "f");
			let t = O(this.client, () => Sa(this.client, a(this, Y, "f").params, a(this, X, "f").openTelemetry?.conversationId));
			i(this, mf, t && Wt.setSpan(S.active(), t), "f");
			try {
				for (;;) try {
					if (a(this, Y, "f").params.max_iterations && a(this, pf, "f") >= a(this, Y, "f").params.max_iterations) break;
					if (a(this, J, "m", Af).call(this), a(this, Q, "f").status === "scheduled" && $f(a(this, gf, "f")) !== "resume") {
						yield* a(this, J, "m", Cf).call(this, a(this, Q, "f").config);
						continue;
					}
					i(this, lf, !1, "f"), i(this, df, void 0, "f"), i(this, pf, (e = a(this, pf, "f"), e++, e), "f"), i(this, Z, void 0, "f");
					let { max_iterations: t, runToolsEagerly: n, ...r } = a(this, Y, "f").params;
					if (yield* a(this, J, "m", bf).call(this, r), await a(this, J, "m", yf).call(this, async () => {
						if (a(this, lf, "f")) i(this, gf, null, "f");
						else {
							let e = await a(this, Z, "f"), t = $f(e.stop_reason);
							i(this, gf, e.stop_reason, "f"), a(this, Y, "f").params.messages.push({
								role: e.role,
								content: Gf(e.content)
							});
							let { container: n } = a(this, Y, "f").params;
							if (e.container && (n == null ? a(this, Y, "f").params.container = e.container.id : typeof n == "object" && n.id == null && (a(this, Y, "f").params.container = {
								...n,
								id: e.container.id
							})), t === "stop") return "stop";
							if (t === "resume") return "continue";
						}
						let e = await a(this, J, "m", Of).call(this, a(this, Y, "f").params.messages.at(-1), a(this, X, "f").signal, a(this, mf, "f"));
						if (e) a(this, Y, "f").params.messages.push(e);
						else if (!a(this, lf, "f")) return "stop";
						return "continue";
					}) === "stop") {
						yield* a(this, J, "m", Df).call(this);
						break;
					}
				} finally {
					a(this, uf, "f")?.abort(), i(this, uf, void 0, "f");
				}
				if (await a(this, J, "m", Sf).call(this), !a(this, Z, "f")) throw new l("ToolRunner concluded without a message from the server");
				a(this, ff, "f").resolve(await a(this, Z, "f")), O(this.client, () => t?.setStatus({ code: jt.OK }));
			} catch (e) {
				throw t && O(this.client, () => Zn(t, e)), i(this, cf, !1, "f"), a(this, ff, "f").promise.catch(() => {}), a(this, ff, "f").reject(e), i(this, ff, sf(), "f"), e;
			} finally {
				O(this.client, () => t?.end()), i(this, mf, void 0, "f");
			}
		}
		setMessagesParams(e) {
			let t = typeof e == "function" ? e(a(this, Y, "f").params) : e;
			if (Ff(t), Lf(t), a(this, Q, "f").status !== "idle" && Rf(t), a(this, Q, "f").status === "in_flight" && t.messages !== a(this, Y, "f").params.messages) throw new l("Message params can't be changed while the conversation is being compacted, because the compaction response is about to replace them. Change them after this iteration instead.");
			a(this, Y, "f").params = t, i(this, lf, !0, "f"), i(this, df, void 0, "f");
		}
		setRequestOptions(e) {
			typeof e == "function" ? i(this, X, e(a(this, X, "f")), "f") : i(this, X, {
				...a(this, X, "f"),
				...e
			}, "f");
		}
		async generateToolResponse(e = a(this, X, "f").signal) {
			let t = this.client._tracer ? S.active() : void 0, n = await a(this, Z, "f") ?? this.params.messages.at(-1);
			return n ? a(this, J, "m", Of).call(this, n, e, t) : null;
		}
		deferToolCall(e) {
			let t = typeof e == "string" ? e : e.id;
			a(this, hf, "f") && !a(this, hf, "f").has(t) && a(this, hf, "f").set(t, { status: "held" });
		}
		get deferredToolCalls() {
			let e = a(this, uf, "f"), t = a(this, hf, "f");
			return !(e instanceof of) || !t ? [] : e.toolCalls.filter((e) => t.get(e.id)?.status === "held");
		}
		done() {
			return a(this, ff, "f").promise;
		}
		async runUntilDone() {
			if (!a(this, cf, "f")) for await (let e of this);
			return this.done();
		}
		get params() {
			return a(this, Y, "f").params;
		}
		pushMessages(...e) {
			this.setMessagesParams((t) => ({
				...t,
				messages: [...t.messages, ...e]
			}));
		}
		compactBeforeNextTurn(e) {
			a(this, Q, "f").status !== "in_flight" && (Rf(a(this, Y, "f").params), i(this, Q, {
				status: "scheduled",
				config: e ?? { type: "summarize" }
			}, "f"));
		}
		addTools(...e) {
			let t = a(this, J, "m", kf).call(this);
			for (let n of e) {
				if (Iu(n)) throw new Ru(`addTools() can't add the '${dc(Fu(n))}' toolset: ${Mf}`);
				let e = Kf(n);
				if (t.has(e)) throw new Ru(`addTools() can't replace the '${dc(e)}' toolset: ${Mf}`);
			}
			for (let t of e) "name" in t && a(this, _f, "f").set(t.name, "run" in t ? t : null), a(this, vf, "f").push({
				type: "addition",
				tool: t
			});
		}
		removeTools(...e) {
			let t = a(this, J, "m", kf).call(this);
			for (let n of e) {
				let e = typeof n == "string" ? n : n.name;
				if (t.has(e)) throw new Ru(`removeTools() can't remove the '${dc(e)}' toolset: ${Nf}`);
			}
			for (let t of e) {
				let e = typeof t == "string" ? t : t.name;
				a(this, _f, "f").set(e, null), a(this, vf, "f").push({
					type: "removal",
					name: e
				});
			}
		}
		then(e, t) {
			return this.runUntilDone().then(e, t);
		}
	}
	return bf = async function* (e) {
		await a(this, J, "m", Sf).call(this), i(this, hf, void 0, "f"), e = a(this, J, "m", yf).call(this, () => ({
			...e,
			...e.tools && { tools: e.tools.map(Bf) },
			messages: Vf(e.messages)
		})), e.stream ? (i(this, uf, a(this, J, "m", yf).call(this, () => a(this, Y, "f").params.runToolsEagerly ? a(this, J, "m", xf).call(this, e) : this.client.beta.messages.stream({ ...e }, a(this, X, "f"))), "f"), i(this, Z, a(this, uf, "f").finalMessage(), "f"), a(this, Z, "f").catch(() => {}), yield a(this, uf, "f")) : (i(this, Z, a(this, J, "m", yf).call(this, () => this.client.beta.messages.create({
			...e,
			stream: !1
		}, a(this, X, "f"))), "f"), yield a(this, Z, "f"));
	}, xf = function(e) {
		let t = /* @__PURE__ */ new Map();
		i(this, hf, t, "f");
		let n = /* @__PURE__ */ new Map();
		return of.start(this.client, e, a(this, X, "f"), (e) => {
			let r = t.has(e.id), i = !e.toolset_name && a(this, J, "m", kf).call(this).has(e.name), o = i ? e.name : e.toolset_name;
			if (o) {
				if (r || i || n.has(o)) {
					n.set(o, "waiting");
					return;
				}
				n.set(o, "running");
				let s = Uf(a(this, Y, "f").params, o, e, a(this, X, "f"), this.client, a(this, mf, "f"));
				t.set(e.id, {
					status: "started",
					result: s
				}), s.then(({ is_error: e }) => {
					e || n.get(o) === "waiting" ? n.set(o, "waiting") : n.delete(o);
				}, () => n.set(o, "waiting"));
				return;
			}
			if (r) return;
			let s = Wf(a(this, J, "m", wf).call(this), a(this, J, "m", Tf).call(this), e, a(this, X, "f"), this.client, a(this, mf, "f"));
			s.catch(() => {}), t.set(e.id, {
				status: "started",
				result: s
			});
		});
	}, Sf = async function() {
		let e = [...a(this, hf, "f")?.values() ?? []].filter((e) => e.status === "started");
		await Promise.allSettled(e.map((e) => e.result));
	}, Cf = async function* (e) {
		Rf(a(this, Y, "f").params);
		let { max_iterations: t, runToolsEagerly: n, ...r } = a(this, Y, "f").params, o = zf(r);
		i(this, Q, { status: "in_flight" }, "f"), i(this, df, void 0, "f");
		let s = a(this, Z, "f");
		try {
			yield* a(this, J, "m", bf).call(this, {
				...o,
				compaction: e
			});
			let t = await a(this, Z, "f");
			t.content.some((e) => e.type === "compaction" && e.content) ? (a(this, J, "m", Ef).call(this), a(this, Y, "f").params.messages = [{
				role: t.role,
				content: t.content
			}]) : (E(this.client).warn("Compaction produced no summary; keeping the conversation as it is."), i(this, Z, s, "f"));
		} finally {
			i(this, Q, { status: "idle" }, "f");
		}
	}, wf = function() {
		let e = /* @__PURE__ */ new Map();
		for (let t of a(this, Y, "f").params.tools) "run" in t && "name" in t && e.set(t.name, t);
		for (let [t, n] of a(this, _f, "f")) n ? e.set(t, n) : e.delete(t);
		return e;
	}, Tf = function() {
		let e = new Set(a(this, J, "m", wf).call(this).keys());
		for (let t of [...a(this, Y, "f").params.messages, a(this, J, "m", jf).call(this)]) if (typeof t.content != "string") {
			for (let n of t.content) if (t.role === "system") Xf(n, e);
			else if (t.role === "assistant" && n.type === "compaction") for (let t of n.tool_changes ?? []) Xf(t, e);
		}
		return e;
	}, Ef = function() {
		let e = a(this, J, "m", Tf).call(this);
		for (let t of a(this, J, "m", wf).call(this).keys()) e.has(t) || a(this, _f, "f").set(t, null);
	}, Df = async function* () {
		if (a(this, Q, "f").status !== "scheduled") return;
		let e = a(this, Y, "f").params.messages.at(-1)?.content;
		Array.isArray(e) && e.some((e) => e.type === "tool_use") ? (E(this.client).warn("The pending compaction was skipped because the last turn ended with tool calls that were not run. Call `compactBeforeNextTurn()` again if you continue the conversation."), i(this, Q, { status: "idle" }, "f")) : yield* a(this, J, "m", Cf).call(this, a(this, Q, "f").config);
	}, Of = async function(e, t, n) {
		return a(this, df, "f") === void 0 && i(this, df, Hf(a(this, Y, "f").params, a(this, J, "m", wf).call(this), a(this, J, "m", Tf).call(this), e, {
			...a(this, X, "f"),
			signal: t
		}, a(this, hf, "f"), this.client, n), "f"), a(this, df, "f");
	}, kf = function() {
		return new Set(a(this, Y, "f").params.tools.filter(Iu).map(Fu));
	}, Af = function() {
		a(this, gf, "f") !== "pause_turn" && a(this, vf, "f").length !== 0 && (a(this, Y, "f").params.messages.push(a(this, J, "m", jf).call(this)), i(this, vf, [], "f"));
	}, jf = function() {
		let e = [];
		for (let t of a(this, vf, "f")) {
			if (t.type === "removal") {
				e.push({
					type: "tool_removal",
					tool: {
						type: "tool_reference",
						name: t.name
					}
				});
				continue;
			}
			let n = Bf(t.tool);
			e.push({
				type: "tool_addition",
				tool: {
					type: "tool_definition",
					definition: n
				}
			});
		}
		return {
			role: "system",
			content: e
		};
	}, e;
})();
function Ff(e) {
	if ("compaction" in e && e.compaction != null) throw new l("`compaction` cannot be set on a tool runner: every request in the loop would compact again. Call `runner.compactBeforeNextTurn()` when the conversation should be compacted instead.");
}
function If(e) {
	if ("compactionControl" in e && e.compactionControl != null) throw new l("`compactionControl` has been removed from the tool runner. Use server-side compaction instead: call `runner.compactBeforeNextTurn()` when the conversation should be compacted.");
}
function Lf(e) {
	if (e.runToolsEagerly && !e.stream) throw TypeError("`runToolsEagerly: true` needs `stream: true` in the tool runner's params, because a reply that isn't streamed arrives whole.");
}
function Rf(e) {
	if (e.context_management?.edits?.some((e) => e.type.startsWith("compact_"))) throw new l("`compactBeforeNextTurn()` can't be used while `context_management` has a compaction edit, because the API doesn't accept a compaction block together with one. Remove the edit first.");
}
function zf(e) {
	let { context_management: t, stop_sequences: n, output_format: r, ...i } = e, a = ({ format: e, ...t }) => t;
	return (i.tool_choice?.type === "any" || i.tool_choice?.type === "tool") && delete i.tool_choice, i.output_config &&= a(i.output_config), Array.isArray(i.fallbacks) && (i.fallbacks = i.fallbacks.map((e) => e.output_config ? {
		...e,
		output_config: a(e.output_config)
	} : e)), i;
}
function Bf(e) {
	if (!("run" in e)) return e;
	let t = rp, n = "toJSON" in e && typeof e.toJSON == "function" ? e.toJSON() : e;
	return {
		...Object.fromEntries(Object.entries(n).filter(([e]) => t.includes(e))),
		...va(e) && { [_a]: e[_a] }
	};
}
function Vf(e) {
	return e.map((e) => {
		if (e.role !== "system" || typeof e.content == "string") return e;
		let t = e.content.map((e) => e.type === "tool_addition" && e.tool.type === "tool_definition" ? {
			...e,
			tool: {
				...e.tool,
				definition: Bf(e.tool.definition)
			}
		} : e);
		return {
			...e,
			content: t
		};
	});
}
async function Hf(e, t, n, r, i, a, o, s) {
	if (!r || r.role !== "assistant" || !r.content || typeof r.content == "string") return null;
	let c = r.content.filter((e) => e.type === "tool_use");
	if (c.length === 0) return null;
	let l = /* @__PURE__ */ new Map();
	return {
		role: "user",
		content: await Promise.all(c.map(async (r) => {
			let c = a?.get(r.id), u = c?.status === "started" ? c.result : void 0;
			if (r.toolset_name) {
				let t = r.toolset_name, n = l.get(t) ?? {
					tail: Promise.resolve(),
					failed: !1
				};
				l.set(t, n);
				let c = e.tools.some((e) => Iu(e) && Fu(e) === t), d = u ?? n.tail.then(() => n.failed ? Hu(r, Vu(t), !0) : Uf(e, t, r, i, o, s));
				return n.tail = d.then(({ is_error: e }) => {
					e && c && (n.failed = !0);
				}, () => {
					n.failed = !0;
				}), a?.set(r.id, {
					status: "started",
					result: d
				}), d;
			}
			if (u) return u;
			if (!(n.has(r.name) && t.get(r.name)) && e.tools.some((e) => Iu(e) && Fu(e) === r.name)) {
				let e = l.get(r.name) ?? {
					tail: Promise.resolve(),
					failed: !1
				};
				return l.set(r.name, e), e.tail = e.tail.then(() => {
					e.failed = !0;
				}), Jf(r);
			}
			let d = Wf(t, n, r, i, o, s);
			return a?.set(r.id, {
				status: "started",
				result: d
			}), d;
		}))
	};
}
async function Uf(e, t, n, r, i, a) {
	let o = e.tools.find((e) => Iu(e) && Fu(e) === t);
	return o ? (await Ca(i, o, n, {
		signal: r?.signal,
		conversationId: r?.openTelemetry?.conversationId,
		parentContext: a
	}, async () => {
		let e = await Gu(o, n, { signal: r?.signal });
		return {
			block: e,
			content: e.content ?? [],
			isError: e.is_error === !0
		};
	})).block : Hu(n, `Error: Toolset '${dc(t)}' member '${dc(n.name)}' not found`, !0);
}
async function Wf(e, t, n, r, i, a) {
	let o = t.has(n.name) ? e.get(n.name) : void 0;
	if (!o) return qf(n);
	let s = await Ca(i, o, n, {
		signal: r?.signal,
		conversationId: r?.openTelemetry?.conversationId,
		parentContext: a
	}, () => vc(o, n.input, {
		toolUse: n,
		toolUseBlock: n,
		signal: r?.signal
	}));
	return {
		type: "tool_result",
		tool_use_id: n.id,
		content: s.content,
		...s.isError ? { is_error: !0 } : void 0
	};
}
function Gf(e) {
	return e;
}
function Kf(e) {
	return (e.type ?? "custom").replace(/_\d{8}$/, "").replace(/_toolset$/, "");
}
function qf(e) {
	return {
		type: "tool_result",
		tool_use_id: e.id,
		content: `Error: Tool '${e.name}' not found`,
		is_error: !0
	};
}
function Jf(e) {
	return {
		type: "tool_result",
		tool_use_id: e.id,
		content: `Error: the '${dc(e.name)}' toolset could not run this call${Yf(e.input)}; nothing in the batch was executed`,
		is_error: !0
	};
}
function Yf(e) {
	let t = typeof e == "object" && e ? e : {};
	if (!("actions" in t)) {
		let e = "action" in t ? t.action : void 0;
		return typeof e == "string" ? `: the call has no 'actions' list (action: '${dc(e)}')` : ": the call has no 'actions' list";
	}
	let { actions: n } = t;
	if (typeof n == "string") return ": 'actions' is text, not a list of actions";
	if (!Array.isArray(n)) return ": 'actions' is not a list of actions";
	if (n.length === 0) return ": the 'actions' list is empty";
	let r = [];
	for (let [e, t] of n.entries()) {
		let n = typeof t == "object" && t && "action" in t ? t.action : void 0;
		if (typeof n != "string") return `: action ${e} must be an object with a string 'action' field`;
		r.push(`'${dc(n)}'`);
	}
	let i = r.length > 10 ? `, and ${r.length - 10} more` : "";
	return `: its actions could not be run as sent (actions: ${r.slice(0, 10).join(", ")}${i})`;
}
function Xf(e, t) {
	switch (e.type) {
		case "tool_removal":
		case "tool_addition": Zf(e, t);
	}
}
function Zf(e, t) {
	let n = Qf(e.tool);
	n !== void 0 && (e.type === "tool_removal" ? t.delete(n) : t.add(n));
}
function Qf(e) {
	switch (e.type) {
		case "tool_reference": return e.name;
		case "tool_definition": return "name" in e.definition ? e.definition.name : void 0;
		default: return;
	}
}
function $f(e) {
	if (e === null) return "stop";
	switch (e) {
		case "tool_use": return "run_tools";
		case "pause_turn":
		case "compaction": return "resume";
		case "end_turn":
		case "stop_sequence":
		case "max_tokens":
		case "model_context_window_exceeded":
		case "refusal": return "stop";
		default: return "stop";
	}
}
// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var ep = {
	"claude-sonnet-4-5": "November 30th, 2026",
	"claude-sonnet-4-5-20250929": "November 30th, 2026"
}, tp = ["claude-mythos-preview", "claude-opus-4-6"], np = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.batches = new Ql(this._client);
		}
		create(e, t) {
			let n = au(e), { betas: r, user_profile_id: i, workspace_id: a, ...o } = n;
			o.model in ep && console.warn(`The model '${o.model}' is deprecated and will reach end-of-life on ${ep[o.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`), tp.includes(o.model) && o.thinking && o.thinking.type === "enabled" && console.warn(`Using Claude with ${o.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
			let s = t?.timeout ?? this._client._options.timeout;
			if (!o.stream && s == null) {
				let e = ls[o.model] ?? void 0;
				s = this._client.calculateNonstreamingTimeout(o.max_tokens, e);
			}
			let c = ru(n, t), l = this._client._tracer && k(this._client, "anthropic.messages.create", t, $i(this._client, o, c));
			ea(this._client, l, o);
			let u = this._client.post("/v1/messages?beta=true", {
				body: o,
				timeout: s ?? 6e5,
				...t,
				__span: l,
				headers: c,
				stream: n.stream ?? !1
			});
			return l ? u._thenUnwrap((e) => (ta(this._client, l, o, e), e)) : u;
		}
		parse(e, t) {
			return t = {
				...t,
				headers: D([{ "anthropic-beta": [...e.betas ?? [], "structured-outputs-2025-12-15"].toString() }, t?.headers])
			}, this.create(e, t).then((t) => tu(t, e, { logger: this._client.logger ?? console }));
		}
		stream(e, t) {
			return Nu.createMessage(this, e, t, { client: this._client });
		}
		countTokens(e, t) {
			let { betas: n, user_profile_id: r, workspace_id: i, ...a } = au(e), o = D([{
				"anthropic-beta": [...n ?? [], "token-counting-2024-11-01"].toString(),
				...r == null ? void 0 : { "anthropic-user-profile-id": r },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, t?.headers]), s = k(this._client, "anthropic.messages.count_tokens", t, {
				route: "/v1/messages/count_tokens",
				attributes: { [Yr]: a.model }
			}), c = this._client.post("/v1/messages/count_tokens?beta=true", {
				body: a,
				...t,
				__span: s,
				headers: o
			});
			return s ? c._thenUnwrap((e) => (na(this._client, s, e), e)) : c;
		}
		toolRunner(e, t) {
			return new Pf(this._client, e, t);
		}
	}
	return e.Batches = Ql, e.BetaToolRunner = Pf, e.ToolError = rc, e;
})(), rp = [
	"input_schema",
	"name",
	"allowed_callers",
	"cache_control",
	"defer_loading",
	"description",
	"eager_input_streaming",
	"input_examples",
	"strict",
	"type",
	"configs",
	"display_height_px",
	"display_width_px",
	"display_number",
	"enable_zoom",
	"max_characters"
], ip = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.models = new _s(this._client), this.messages = new np(this._client), this.agents = new Ts(this._client), this.environments = new Jl(this._client), this.sessions = new Vd(this._client), this.deployments = new ms(this._client), this.deploymentRuns = new ps(this._client), this.vaults = new qd(this._client), this.memoryStores = new Zl(this._client), this.files = new gs(this._client), this.skills = new Ud(this._client), this.webhooks = new Cs(this._client), this.userProfiles = new vs(this._client), this.dreams = new hs(this._client), this.tunnels = new Gd(this._client), this.organization = new Id(this._client);
		}
	}
	return e.Models = _s, e.Messages = np, e.Agents = Ts, e.Environments = Jl, e.Sessions = Vd, e.Deployments = ms, e.DeploymentRuns = ps, e.Vaults = qd, e.MemoryStores = Zl, e.Files = gs, e.Skills = Ud, e.Webhooks = Cs, e.UserProfiles = vs, e.Dreams = hs, e.Tunnels = Gd, e.Organization = Id, e;
})(), ap = class extends I {
	create(e, t) {
		let { betas: n, workspace_id: r, ...i } = e;
		return this._client.post("/v1/complete", {
			body: i,
			timeout: this._client._options.timeout ?? 6e5,
			...t,
			headers: D([{
				...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			stream: e.stream ?? !1,
			__span: k(this._client, "anthropic.completions.create", t, { route: "/v1/complete" })
		});
	}
}, op = class extends I {
	list(e = {}, t) {
		let { workspace_id: n, ...r } = e ?? {};
		return this._client.getAPIList("/v1/files", F, {
			query: r,
			...t,
			headers: D([{ ...n == null ? void 0 : { "anthropic-workspace-id": n } }, t?.headers]),
			__span: k(this._client, "anthropic.files.list", t, {
				route: "/v1/files",
				queryParams: [
					"ids",
					"limit",
					"page"
				]
			})
		});
	}
	delete(e, t = {}, n) {
		let { workspace_id: r } = t ?? {};
		return this._client.delete(R`/v1/files/${e}`, {
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.files.delete", n, {
				route: "/v1/files/{file_id}",
				attributes: { "anthropic.file.id": e }
			})
		});
	}
	download(e, t = {}, n) {
		let { workspace_id: r } = t ?? {};
		return this._client.get(R`/v1/files/${e}/content`, {
			...n,
			headers: D([{
				Accept: "application/binary",
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, n?.headers]),
			__binaryResponse: !0,
			__span: k(this._client, "anthropic.files.download", n, {
				route: "/v1/files/{file_id}/content",
				attributes: { "anthropic.file.id": e }
			})
		});
	}
	retrieveMetadata(e, t = {}, n) {
		let { workspace_id: r } = t ?? {};
		return this._client.get(R`/v1/files/${e}`, {
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.files.retrieve_metadata", n, {
				route: "/v1/files/{file_id}",
				attributes: { "anthropic.file.id": e }
			})
		});
	}
	upload(e, t) {
		let { workspace_id: n, ...r } = e;
		return this._client.post("/v1/files", to({
			body: r,
			...t,
			headers: D([
				{ ...n == null ? void 0 : { "anthropic-workspace-id": n } },
				xa(r.file),
				t?.headers
			]),
			__span: k(this._client, "anthropic.files.upload", t, {
				route: "/v1/files",
				createdIDAttribute: "anthropic.file.id"
			})
		}, this._client));
	}
}, sp = class extends I {
	retrieve(e, t = {}, n) {
		let { betas: r, workspace_id: i } = t ?? {};
		return this._client.get(R`/v1/models/${e}`, {
			...n,
			headers: D([{
				...r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() },
				...i == null ? void 0 : { "anthropic-workspace-id": i }
			}, n?.headers]),
			__span: k(this._client, "anthropic.models.retrieve", n, {
				route: "/v1/models/{model_id}",
				attributes: { "anthropic.model.id": e }
			})
		});
	}
	list(e = {}, t) {
		let { betas: n, workspace_id: r, ...i } = e ?? {};
		return this._client.getAPIList("/v1/models", P, {
			query: i,
			...t,
			headers: D([{
				...n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() },
				...r == null ? void 0 : { "anthropic-workspace-id": r }
			}, t?.headers]),
			__span: k(this._client, "anthropic.models.list", t, {
				route: "/v1/models",
				queryParams: [
					"after_id",
					"before_id",
					"lifecycle",
					"limit"
				]
			})
		});
	}
}, cp = class extends I {
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/api_keys/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.api_keys.retrieve", t, {
				route: "/v1/organizations/api_keys/{api_key_id}",
				attributes: { "anthropic.organization.api_key.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/api_keys/${e}`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.api_keys.update", n, {
				route: "/v1/organizations/api_keys/{api_key_id}",
				attributes: { "anthropic.organization.api_key.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/api_keys", P, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.api_keys.list", t, {
				route: "/v1/organizations/api_keys",
				queryParams: [
					"after_id",
					"before_id",
					"created_by_user_id",
					"limit",
					"status",
					"workspace_id"
				]
			})
		});
	}
}, lp = class extends I {
	retrieve(e) {
		return this._client.get("/v1/organizations/compliance_settings", {
			...e,
			__span: k(this._client, "anthropic.organization.compliance_settings.retrieve", e, { route: "/v1/organizations/compliance_settings" })
		});
	}
	update(e, t) {
		return this._client.post("/v1/organizations/compliance_settings", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.compliance_settings.update", t, { route: "/v1/organizations/compliance_settings" })
		});
	}
}, up = class extends I {
	create(e, t) {
		return this._client.post("/v1/organizations/external_keys", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.create", t, {
				route: "/v1/organizations/external_keys",
				createdIDAttribute: "anthropic.organization.external_key.id"
			})
		});
	}
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/external_keys/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.retrieve", t, {
				route: "/v1/organizations/external_keys/{external_key_id}",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/external_keys/${e}`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.external_keys.update", n, {
				route: "/v1/organizations/external_keys/{external_key_id}",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/external_keys", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.list", t, {
				route: "/v1/organizations/external_keys",
				queryParams: ["limit", "page"]
			})
		});
	}
	delete(e, t) {
		return this._client.delete(R`/v1/organizations/external_keys/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.delete", t, {
				route: "/v1/organizations/external_keys/{external_key_id}",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
	validate(e, t) {
		return this._client.post(R`/v1/organizations/external_keys/${e}/validate`, {
			...t,
			__span: k(this._client, "anthropic.organization.external_keys.validate", t, {
				route: "/v1/organizations/external_keys/{external_key_id}/validate",
				attributes: { "anthropic.organization.external_key.id": e }
			})
		});
	}
}, dp = class extends I {
	create(e, t) {
		return this._client.post("/v1/organizations/invites", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.invites.create", t, {
				route: "/v1/organizations/invites",
				createdIDAttribute: "anthropic.organization.invite.id"
			})
		});
	}
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/invites/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.invites.retrieve", t, {
				route: "/v1/organizations/invites/{invite_id}",
				attributes: { "anthropic.organization.invite.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/invites", P, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.invites.list", t, {
				route: "/v1/organizations/invites",
				queryParams: [
					"after_id",
					"before_id",
					"email",
					"limit",
					"roles",
					"statuses"
				]
			})
		});
	}
	delete(e, t) {
		return this._client.delete(R`/v1/organizations/invites/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.invites.delete", t, {
				route: "/v1/organizations/invites/{invite_id}",
				attributes: { "anthropic.organization.invite.id": e }
			})
		});
	}
}, fp = class extends I {
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/rate_limits", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.rate_limits.list", t, {
				route: "/v1/organizations/rate_limits",
				queryParams: [
					"group_type",
					"limit",
					"model",
					"page"
				]
			})
		});
	}
}, pp = class extends I {
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/users/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.users.retrieve", t, {
				route: "/v1/organizations/users/{user_id}",
				attributes: { "anthropic.organization.user.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/users/${e}`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.users.update", n, {
				route: "/v1/organizations/users/{user_id}",
				attributes: { "anthropic.organization.user.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/users", P, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.users.list", t, {
				route: "/v1/organizations/users",
				queryParams: [
					"after_id",
					"before_id",
					"email",
					"limit",
					"roles"
				]
			})
		});
	}
	remove(e, t) {
		return this._client.delete(R`/v1/organizations/users/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.users.remove", t, {
				route: "/v1/organizations/users/{user_id}",
				attributes: { "anthropic.organization.user.id": e }
			})
		});
	}
}, mp = class extends I {
	create(e, t) {
		return this._client.post("/v1/organizations/federation_issuers", {
			body: e,
			...t,
			__span: k(this._client, "anthropic.organization.federation.issuers.create", t, {
				route: "/v1/organizations/federation_issuers",
				createdIDAttribute: "anthropic.organization.federation_issuer.id"
			})
		});
	}
	retrieve(e, t) {
		return this._client.get(R`/v1/organizations/federation_issuers/${e}`, {
			...t,
			__span: k(this._client, "anthropic.organization.federation.issuers.retrieve", t, {
				route: "/v1/organizations/federation_issuers/{federation_issuer_id}",
				attributes: { "anthropic.organization.federation_issuer.id": e }
			})
		});
	}
	update(e, t, n) {
		return this._client.post(R`/v1/organizations/federation_issuers/${e}`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.federation.issuers.update", n, {
				route: "/v1/organizations/federation_issuers/{federation_issuer_id}",
				attributes: { "anthropic.organization.federation_issuer.id": e }
			})
		});
	}
	list(e = {}, t) {
		return this._client.getAPIList("/v1/organizations/federation_issuers", F, {
			query: e,
			...t,
			__span: k(this._client, "anthropic.organization.federation.issuers.list", t, {
				route: "/v1/organizations/federation_issuers",
				queryParams: [
					"include_archived",
					"limit",
					"page"
				]
			})
		});
	}
	archive(e, t) {
		return this._client.post(R`/v1/organizations/federation_issuers/${e}/archive`, {
			...t,
			__span: k(this._client, "anthropic.organization.federation.issuers.archive", t, {
				route: "/v1/organizations/federation_issuers/{federation_issuer_id}/archive",
				attributes: { "anthropic.organization.federation_issuer.id": e }
			})
		});
	}
}, hp = class extends I {
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/federation_rules/${e}/workspaces`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.federation.rules.workspaces.list", n, {
				route: "/v1/organizations/federation_rules/{federation_rule_id}/workspaces",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.federation_rule.id": e }
			})
		});
	}
	add(e, t, n) {
		return this._client.post(R`/v1/organizations/federation_rules/${e}/workspaces`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.federation.rules.workspaces.add", n, {
				route: "/v1/organizations/federation_rules/{federation_rule_id}/workspaces",
				attributes: { "anthropic.organization.federation_rule.id": e },
				createdIDAttribute: "anthropic.organization.federation_rule.workspace.id",
				createdIDField: "workspace_id"
			})
		});
	}
	remove(e, t, n) {
		let { federation_rule_id: r } = t;
		return this._client.delete(R`/v1/organizations/federation_rules/${r}/workspaces/${e}`, {
			...n,
			__span: k(this._client, "anthropic.organization.federation.rules.workspaces.remove", n, {
				route: "/v1/organizations/federation_rules/{federation_rule_id}/workspaces/{workspace_id}",
				attributes: {
					"anthropic.organization.federation_rule.id": r,
					"anthropic.organization.federation_rule.workspace.id": e
				}
			})
		});
	}
}, gp = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.workspaces = new hp(this._client);
		}
		create(e, t) {
			return this._client.post("/v1/organizations/federation_rules", {
				body: e,
				...t,
				__span: k(this._client, "anthropic.organization.federation.rules.create", t, {
					route: "/v1/organizations/federation_rules",
					createdIDAttribute: "anthropic.organization.federation_rule.id"
				})
			});
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/federation_rules/${e}`, {
				...t,
				__span: k(this._client, "anthropic.organization.federation.rules.retrieve", t, {
					route: "/v1/organizations/federation_rules/{federation_rule_id}",
					attributes: { "anthropic.organization.federation_rule.id": e }
				})
			});
		}
		update(e, t, n) {
			return this._client.post(R`/v1/organizations/federation_rules/${e}`, {
				body: t,
				...n,
				__span: k(this._client, "anthropic.organization.federation.rules.update", n, {
					route: "/v1/organizations/federation_rules/{federation_rule_id}",
					attributes: { "anthropic.organization.federation_rule.id": e }
				})
			});
		}
		list(e = {}, t) {
			return this._client.getAPIList("/v1/organizations/federation_rules", F, {
				query: e,
				...t,
				__span: k(this._client, "anthropic.organization.federation.rules.list", t, {
					route: "/v1/organizations/federation_rules",
					queryParams: [
						"include_archived",
						"issuer_id",
						"limit",
						"page"
					]
				})
			});
		}
		archive(e, t) {
			return this._client.post(R`/v1/organizations/federation_rules/${e}/archive`, {
				...t,
				__span: k(this._client, "anthropic.organization.federation.rules.archive", t, {
					route: "/v1/organizations/federation_rules/{federation_rule_id}/archive",
					attributes: { "anthropic.organization.federation_rule.id": e }
				})
			});
		}
	}
	return e.Workspaces = hp, e;
})(), _p = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.issuers = new mp(this._client), this.rules = new gp(this._client);
		}
	}
	return e.Issuers = mp, e.Rules = gp, e;
})(), vp = class extends I {
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/service_accounts/${e}/workspaces`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.service_accounts.workspaces.list", n, {
				route: "/v1/organizations/service_accounts/{service_account_id}/workspaces",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.service_account.id": e }
			})
		});
	}
	add(e, t, n) {
		return this._client.post(R`/v1/organizations/service_accounts/${e}/workspaces`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.service_accounts.workspaces.add", n, {
				route: "/v1/organizations/service_accounts/{service_account_id}/workspaces",
				attributes: { "anthropic.organization.service_account.id": e },
				createdIDAttribute: "anthropic.organization.service_account.workspace.id",
				createdIDField: "workspace_id"
			})
		});
	}
	remove(e, t, n) {
		let { service_account_id: r } = t;
		return this._client.delete(R`/v1/organizations/service_accounts/${r}/workspaces/${e}`, {
			...n,
			__span: k(this._client, "anthropic.organization.service_accounts.workspaces.remove", n, {
				route: "/v1/organizations/service_accounts/{service_account_id}/workspaces/{workspace_id}",
				attributes: {
					"anthropic.organization.service_account.id": r,
					"anthropic.organization.service_account.workspace.id": e
				}
			})
		});
	}
}, yp = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.workspaces = new vp(this._client);
		}
		create(e, t) {
			return this._client.post("/v1/organizations/service_accounts", {
				body: e,
				...t,
				__span: k(this._client, "anthropic.organization.service_accounts.create", t, {
					route: "/v1/organizations/service_accounts",
					createdIDAttribute: "anthropic.organization.service_account.id"
				})
			});
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/service_accounts/${e}`, {
				...t,
				__span: k(this._client, "anthropic.organization.service_accounts.retrieve", t, {
					route: "/v1/organizations/service_accounts/{service_account_id}",
					attributes: { "anthropic.organization.service_account.id": e }
				})
			});
		}
		update(e, t, n) {
			return this._client.post(R`/v1/organizations/service_accounts/${e}`, {
				body: t,
				...n,
				__span: k(this._client, "anthropic.organization.service_accounts.update", n, {
					route: "/v1/organizations/service_accounts/{service_account_id}",
					attributes: { "anthropic.organization.service_account.id": e }
				})
			});
		}
		list(e = {}, t) {
			return this._client.getAPIList("/v1/organizations/service_accounts", F, {
				query: e,
				...t,
				__span: k(this._client, "anthropic.organization.service_accounts.list", t, {
					route: "/v1/organizations/service_accounts",
					queryParams: [
						"include_archived",
						"limit",
						"page"
					]
				})
			});
		}
		archive(e, t) {
			return this._client.post(R`/v1/organizations/service_accounts/${e}/archive`, {
				...t,
				__span: k(this._client, "anthropic.organization.service_accounts.archive", t, {
					route: "/v1/organizations/service_accounts/{service_account_id}/archive",
					attributes: { "anthropic.organization.service_account.id": e }
				})
			});
		}
	}
	return e.Workspaces = vp, e;
})(), bp = class extends I {
	retrieve(e, t, n) {
		let { workspace_id: r } = t;
		return this._client.get(R`/v1/organizations/workspaces/${r}/members/${e}`, {
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.retrieve", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.member.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { workspace_id: r, ...i } = t;
		return this._client.post(R`/v1/organizations/workspaces/${r}/members/${e}`, {
			body: i,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.update", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.member.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/workspaces/${e}/members`, P, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.list", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members",
				queryParams: [
					"after_id",
					"before_id",
					"limit"
				],
				attributes: { "anthropic.organization.workspace.id": e }
			})
		});
	}
	add(e, t, n) {
		return this._client.post(R`/v1/organizations/workspaces/${e}/members`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.add", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members",
				attributes: { "anthropic.organization.workspace.id": e },
				createdIDAttribute: "anthropic.organization.workspace.member.id",
				createdIDField: "user_id"
			})
		});
	}
	remove(e, t, n) {
		let { workspace_id: r } = t;
		return this._client.delete(R`/v1/organizations/workspaces/${r}/members/${e}`, {
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.members.remove", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/members/{user_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.member.id": e
				}
			})
		});
	}
}, xp = class extends I {
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/workspaces/${e}/rate_limits`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.rate_limits.list", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/rate_limits",
				queryParams: [
					"group_type",
					"include_inherited",
					"limit",
					"page"
				],
				attributes: { "anthropic.organization.workspace.id": e }
			})
		});
	}
}, Sp = class extends I {
	retrieve(e, t, n) {
		let { workspace_id: r } = t;
		return this._client.get(R`/v1/organizations/workspaces/${r}/service_accounts/${e}`, {
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.retrieve", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.service_account.id": e
				}
			})
		});
	}
	update(e, t, n) {
		let { workspace_id: r, ...i } = t;
		return this._client.post(R`/v1/organizations/workspaces/${r}/service_accounts/${e}`, {
			body: i,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.update", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.service_account.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		return this._client.getAPIList(R`/v1/organizations/workspaces/${e}/service_accounts`, F, {
			query: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.list", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.organization.workspace.id": e }
			})
		});
	}
	add(e, t, n) {
		return this._client.post(R`/v1/organizations/workspaces/${e}/service_accounts`, {
			body: t,
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.add", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts",
				attributes: { "anthropic.organization.workspace.id": e },
				createdIDAttribute: "anthropic.organization.workspace.service_account.id",
				createdIDField: "service_account_id"
			})
		});
	}
	remove(e, t, n) {
		let { workspace_id: r } = t;
		return this._client.delete(R`/v1/organizations/workspaces/${r}/service_accounts/${e}`, {
			...n,
			__span: k(this._client, "anthropic.organization.workspaces.service_accounts.remove", n, {
				route: "/v1/organizations/workspaces/{workspace_id}/service_accounts/{service_account_id}",
				attributes: {
					"anthropic.organization.workspace.id": r,
					"anthropic.organization.workspace.service_account.id": e
				}
			})
		});
	}
}, Cp = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.rateLimits = new xp(this._client), this.members = new bp(this._client), this.serviceAccounts = new Sp(this._client);
		}
		create(e, t) {
			return this._client.post("/v1/organizations/workspaces", {
				body: e,
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.create", t, {
					route: "/v1/organizations/workspaces",
					createdIDAttribute: "anthropic.organization.workspace.id"
				})
			});
		}
		retrieve(e, t) {
			return this._client.get(R`/v1/organizations/workspaces/${e}`, {
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.retrieve", t, {
					route: "/v1/organizations/workspaces/{workspace_id}",
					attributes: { "anthropic.organization.workspace.id": e }
				})
			});
		}
		update(e, t, n) {
			return this._client.post(R`/v1/organizations/workspaces/${e}`, {
				body: t,
				...n,
				__span: k(this._client, "anthropic.organization.workspaces.update", n, {
					route: "/v1/organizations/workspaces/{workspace_id}",
					attributes: { "anthropic.organization.workspace.id": e }
				})
			});
		}
		list(e = {}, t) {
			return this._client.getAPIList("/v1/organizations/workspaces", P, {
				query: e,
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.list", t, {
					route: "/v1/organizations/workspaces",
					queryParams: [
						"after_id",
						"before_id",
						"include_archived",
						"include_default",
						"limit"
					]
				})
			});
		}
		archive(e, t) {
			return this._client.post(R`/v1/organizations/workspaces/${e}/archive`, {
				...t,
				__span: k(this._client, "anthropic.organization.workspaces.archive", t, {
					route: "/v1/organizations/workspaces/{workspace_id}/archive",
					attributes: { "anthropic.organization.workspace.id": e }
				})
			});
		}
	}
	return e.RateLimits = xp, e.Members = bp, e.ServiceAccounts = Sp, e;
})(), wp = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.apiKeys = new cp(this._client), this.externalKeys = new up(this._client), this.federation = new _p(this._client), this.invites = new dp(this._client), this.serviceAccounts = new yp(this._client), this.users = new pp(this._client), this.workspaces = new Cp(this._client), this.rateLimits = new fp(this._client), this.complianceSettings = new lp(this._client);
		}
		retrieve(e) {
			return this._client.get("/v1/organizations/me", {
				...e,
				__span: k(this._client, "anthropic.organization.retrieve", e, { route: "/v1/organizations/me" })
			});
		}
	}
	return e.APIKeys = cp, e.ExternalKeys = up, e.Federation = _p, e.Invites = dp, e.ServiceAccounts = yp, e.Users = pp, e.Workspaces = Cp, e.RateLimits = fp, e.ComplianceSettings = lp, e;
})(), Tp = class extends I {
	create(e, t, n) {
		let { workspace_id: r, ...i } = t;
		return this._client.post(R`/v1/skills/${e}/versions`, to({
			body: i,
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.create", n, {
				route: "/v1/skills/{skill_id}/versions",
				attributes: { "anthropic.skill.id": e },
				createdIDAttribute: "anthropic.skill.version.id"
			})
		}, this._client, !1));
	}
	retrieve(e, t, n) {
		let { skill_id: r, workspace_id: i } = t;
		return this._client.get(R`/v1/skills/${r}/versions/${e}`, {
			...n,
			headers: D([{ ...i == null ? void 0 : { "anthropic-workspace-id": i } }, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.retrieve", n, {
				route: "/v1/skills/{skill_id}/versions/{version}",
				attributes: {
					"anthropic.skill.id": r,
					"anthropic.skill.version.id": e
				}
			})
		});
	}
	list(e, t = {}, n) {
		let { workspace_id: r, ...i } = t ?? {};
		return this._client.getAPIList(R`/v1/skills/${e}/versions`, F, {
			query: i,
			...n,
			headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.list", n, {
				route: "/v1/skills/{skill_id}/versions",
				queryParams: ["limit", "page"],
				attributes: { "anthropic.skill.id": e }
			})
		});
	}
	delete(e, t, n) {
		let { skill_id: r, workspace_id: i } = t;
		return this._client.delete(R`/v1/skills/${r}/versions/${e}`, {
			...n,
			headers: D([{ ...i == null ? void 0 : { "anthropic-workspace-id": i } }, n?.headers]),
			__span: k(this._client, "anthropic.skills.versions.delete", n, {
				route: "/v1/skills/{skill_id}/versions/{version}",
				attributes: {
					"anthropic.skill.id": r,
					"anthropic.skill.version.id": e
				}
			})
		});
	}
}, Ep = /* @__PURE__ */ (() => {
	class e extends I {
		constructor() {
			super(...arguments), this.versions = new Tp(this._client);
		}
		create(e, t) {
			let { workspace_id: n, ...r } = e;
			return this._client.post("/v1/skills", to({
				body: r,
				...t,
				headers: D([{ ...n == null ? void 0 : { "anthropic-workspace-id": n } }, t?.headers]),
				__span: k(this._client, "anthropic.skills.create", t, {
					route: "/v1/skills",
					createdIDAttribute: "anthropic.skill.id"
				})
			}, this._client, !1));
		}
		retrieve(e, t = {}, n) {
			let { workspace_id: r } = t ?? {};
			return this._client.get(R`/v1/skills/${e}`, {
				...n,
				headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
				__span: k(this._client, "anthropic.skills.retrieve", n, {
					route: "/v1/skills/{skill_id}",
					attributes: { "anthropic.skill.id": e }
				})
			});
		}
		list(e = {}, t) {
			let { workspace_id: n, ...r } = e ?? {};
			return this._client.getAPIList("/v1/skills", F, {
				query: r,
				...t,
				headers: D([{ ...n == null ? void 0 : { "anthropic-workspace-id": n } }, t?.headers]),
				__span: k(this._client, "anthropic.skills.list", t, {
					route: "/v1/skills",
					queryParams: [
						"limit",
						"page",
						"source"
					]
				})
			});
		}
		delete(e, t = {}, n) {
			let { workspace_id: r } = t ?? {};
			return this._client.delete(R`/v1/skills/${e}`, {
				...n,
				headers: D([{ ...r == null ? void 0 : { "anthropic-workspace-id": r } }, n?.headers]),
				__span: k(this._client, "anthropic.skills.delete", n, {
					route: "/v1/skills/{skill_id}",
					attributes: { "anthropic.skill.id": e }
				})
			});
		}
	}
	return e.Versions = Tp, e;
})();
c(), b();
var Dp, Op, kp, Ap, jp, Mp = "\\n\\nHuman:", Np = "\\n\\nAssistant:", Pp = /* @__PURE__ */ (() => {
	class e {
		get credentials() {
			return this._authState.provider;
		}
		get openTelemetry() {
			return a(this, Ap, "f");
		}
		_instrumentationScope() {
			return { version: pe };
		}
		constructor({ baseURL: e = T("ANTHROPIC_BASE_URL"), apiKey: t, authToken: n, webhookKey: r = T("ANTHROPIC_WEBHOOK_SIGNING_KEY") ?? null, ...o } = {}) {
			if (Dp.add(this), this._requestAuthFlags = /* @__PURE__ */ new WeakMap(), kp.set(this, void 0), Ap.set(this, void 0), this._genAIProviderName = "anthropic", t === void 0 && (t = o.profile == null ? T("ANTHROPIC_API_KEY") ?? null : null), n === void 0 && (n = o.profile == null ? T("ANTHROPIC_AUTH_TOKEN") ?? null : null), o.profile != null && (o.credentials != null || o.config != null)) throw TypeError("Pass at most one of `profile`, `credentials`, or `config`.");
			let s = {
				apiKey: t,
				authToken: n,
				webhookKey: r,
				...o,
				baseURL: e || "https://api.anthropic.com"
			};
			if (!s.dangerouslyAllowBrowser && me()) throw new l("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Anthropic({ apiKey, dangerouslyAllowBrowser: true });\n");
			this.baseURL = s.baseURL, this._baseURLIsExplicit = o.__baseURLIsExplicit ?? !!e, this.timeout = s.timeout ?? Op.DEFAULT_TIMEOUT, this.logger = s.logger ?? console, this.logLevel = Qt, this.logLevel = en(s.logLevel, "ClientOptions.logLevel", E(this)) ?? en(T("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", E(this)) ?? "warn", this.fetchOptions = s.fetchOptions, this.maxRetries = ue("maxRetries", s.maxRetries ?? 2);
			let c = this._instrumentationScope();
			i(this, Ap, Rn(s.openTelemetry), "f"), s.openTelemetry = a(this, Ap, "f"), this._tracer = O(this, () => Bn(a(this, Ap, "f"), c.version, c.platform)), this.fetch = s.fetch ?? Oe(), i(this, kp, Fe, "f"), this.middleware = [...s.middleware ?? []];
			let u = T("ANTHROPIC_CUSTOM_HEADERS");
			if (u) {
				let e = {};
				for (let t of u.split("\n")) {
					let n = t.indexOf(":");
					n >= 0 && (e[t.substring(0, n).trim()] = t.substring(n + 1).trim());
				}
				s.defaultHeaders = {
					...e,
					...s.defaultHeaders
				};
			}
			let d = o.__auth;
			if (delete s.__auth, delete s.__baseURLIsExplicit, this._options = s, this.apiKey = typeof t == "string" ? t : null, this.authToken = n, this.webhookKey = r, d) this._authState = d, !this._baseURLIsExplicit && d.baseURL && (this.baseURL = d.baseURL);
			else if (this._authState = {
				provider: null,
				tokenCache: null,
				resolution: null,
				error: null,
				extraHeaders: {}
			}, this.apiKey == null && this.authToken == null) {
				let e = s.credentials ?? null;
				if (e) this._authState.provider = e, this._authState.tokenCache = this._makeTokenCache(e);
				else if (s.config != null) {
					let e = La(s.config, this._credentialResolverOptions());
					this._authState.provider = e.provider, this._authState.tokenCache = this._makeTokenCache(e.provider), this._authState.extraHeaders = e.extraHeaders, this._applyCredentialBaseURL(e.baseURL);
				} else s.profile == null ? this._shouldResolveDefaultCredentials() && (this._authState.resolution = this._resolveDefaultCredentials()) : this._authState.resolution = this._resolveDefaultCredentials(s.profile);
			}
		}
		_shouldResolveDefaultCredentials() {
			return !0;
		}
		_applyCredentialBaseURL(e) {
			if (!e) return;
			let t = e.replace(/\/+$/, "");
			this._authState.baseURL = t, this._baseURLIsExplicit || (this.baseURL = t);
		}
		_credentialResolverOptions() {
			return {
				baseURL: this.baseURL,
				fetch: this._credentialsFetch(),
				userAgent: this.getUserAgent(),
				onCacheWriteError: (e) => {
					E(this).debug("credential cache write failed (best-effort)", e);
				},
				onSafetyWarning: (e) => {
					E(this).warn(e);
				}
			};
		}
		_credentialsFetch() {
			return qa(this.fetch, this.middleware, void 0, this);
		}
		_makeTokenCache(e) {
			return new Hr(e, (e) => {
				E(this).debug("advisory token refresh failed; serving cached token", e);
			});
		}
		withOptions(e) {
			let t = "credentials" in e || "config" in e || "profile" in e, n = "apiKey" in e || "authToken" in e || t, r = {
				...this._options,
				...this._baseURLIsExplicit ? { baseURL: this.baseURL } : {},
				maxRetries: this.maxRetries,
				timeout: this.timeout,
				logger: this.logger,
				logLevel: this.logLevel,
				fetch: this.fetch,
				fetchOptions: this.fetchOptions,
				middleware: this.middleware,
				apiKey: this.apiKey,
				authToken: this.authToken,
				webhookKey: this.webhookKey,
				credentials: this.credentials,
				...t ? {
					credentials: void 0,
					config: void 0,
					profile: void 0
				} : {},
				...e,
				openTelemetry: e.openTelemetry ?? a(this, Ap, "f"),
				__auth: n ? void 0 : this._authState,
				__baseURLIsExplicit: "baseURL" in e || this._baseURLIsExplicit
			};
			return new this.constructor(r);
		}
		async _resolveDefaultCredentials(e) {
			try {
				let t = await Ra(this._credentialResolverOptions(), e);
				if (t) this._authState.provider = t.provider, this._authState.tokenCache = this._makeTokenCache(t.provider), this._authState.extraHeaders = t.extraHeaders, this._applyCredentialBaseURL(t.baseURL);
				else if (e != null) throw new l(`Profile "${e}" could not be resolved (no <config_dir>/configs/${e}.json found).`);
			} catch (e) {
				this._authState.error = e;
			} finally {
				this._authState.resolution = null;
			}
		}
		defaultQuery() {
			return this._options.defaultQuery;
		}
		validateHeaders({ values: e, nulls: t }) {
			if (!(e.get("x-api-key") || e.get("authorization"))) {
				if (this._authState.error) throw this._authState.error;
				if (!(this._authState.tokenCache || this._authState.resolution) && !(this.apiKey && e.get("x-api-key")) && !t.has("x-api-key") && !(this.authToken && e.get("authorization")) && !t.has("authorization")) throw Error("Could not resolve authentication method. Expected one of apiKey, authToken, credentials, config, or profile to be set. Or for one of the \"X-Api-Key\" or \"Authorization\" headers to be explicitly omitted");
			}
		}
		_authFlags(e) {
			let t = this._requestAuthFlags.get(e);
			return t || (t = {
				usedTokenCache: !1,
				didRefreshFor401: !1
			}, this._requestAuthFlags.set(e, t)), t;
		}
		async authHeaders(e) {
			if (this._authState.resolution && await this._authState.resolution, !this._authState.error) {
				if (this._authState.tokenCache && this.apiKey == null) {
					let t = await this._authState.tokenCache.getToken();
					return this._authFlags(e).usedTokenCache = !0, D([{ Authorization: `Bearer ${t}` }]);
				}
				return D([await this.apiKeyAuth(e), await this.bearerAuth(e)]);
			}
		}
		async apiKeyAuth(e) {
			if (this.apiKey != null) return D([{ "X-Api-Key": this.apiKey }]);
		}
		async bearerAuth(e) {
			if (this.authToken != null) return D([{ Authorization: `Bearer ${this.authToken}` }]);
		}
		stringifyQuery(e) {
			return _r(e);
		}
		getUserAgent() {
			return `Anthropic/JS ${pe}`;
		}
		makeStatusError(e, t, n, r) {
			return u.generate(e, t, n, r);
		}
		buildURL(e, t, n) {
			let r = !a(this, Dp, "m", jp).call(this) && n || this.baseURL, i = ie(e) ? new URL(e) : new URL(r + (r.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), o = this.defaultQuery(), s = Object.fromEntries(i.searchParams);
			return se(o) && se(s) || (t = {
				...s,
				...o,
				...t
			}), typeof t == "object" && t && !Array.isArray(t) && (i.search = this.stringifyQuery(t)), i.toString();
		}
		_calculateNonstreamingTimeout(e) {
			if (3600 * e / 128e3 > 600) throw new l("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
			return 6e5;
		}
		async prepareOptions(e) {}
		async prepareRequest(e, { url: t, options: n }) {
			if (this._authState.tokenCache && this.apiKey == null) {
				let t = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
				for (let [e, n] of Object.entries(this._authState.extraHeaders)) t.has(e) || t.set(e, n);
				let n = t.get("anthropic-beta")?.split(",").map((e) => e.trim());
				n?.includes("oauth-2025-04-20") || t.set("anthropic-beta", [...n ?? [], jr].join(",")), e.headers = t;
			}
		}
		backendMiddleware() {
			return [];
		}
		get(e, t) {
			return this.methodRequest("get", e, t);
		}
		post(e, t) {
			return this.methodRequest("post", e, t);
		}
		patch(e, t) {
			return this.methodRequest("patch", e, t);
		}
		put(e, t) {
			return this.methodRequest("put", e, t);
		}
		delete(e, t) {
			return this.methodRequest("delete", e, t);
		}
		methodRequest(e, t, n) {
			return this.request(Promise.resolve(n).then((n) => ({
				method: e,
				path: t,
				...n
			})));
		}
		request(e, t = null) {
			return this._tracer ? new oo(this, this.makeTracedRequest(e, t)) : new oo(this, this.makeRequest(e, t, void 0));
		}
		async makeTracedRequest(e, t) {
			let n = await e, r = n.__span?.span;
			if (!r) return this.makeRequest(n, t, void 0);
			try {
				return await S.with(Wt.setSpan(S.active(), r), () => this.makeRequest(n, t, void 0, r));
			} catch (e) {
				let t = {
					status: "error",
					options: n,
					error: e
				};
				throw Qi(this, r, t), O(this, () => qn(r, t)), e;
			}
		}
		async makeRequest(e, t, n, r) {
			let i = await e, a = ue("maxRetries", i.maxRetries ?? this.maxRetries);
			this.isStreamBody(i.body) && (a = 0), t ?? (t = a, this._requestAuthFlags.delete(i)), await this.prepareOptions(i);
			let { req: c, url: l, timeout: u } = await this.buildRequest(i, { retryCount: a - t }), m = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0"), h = n === void 0 ? "" : `, retryOf: ${n}`;
			r && this.openTelemetry.propagation && (c.headers = O(this, () => Kn(r, c.headers)) ?? c.headers);
			let g = Date.now();
			if (i.signal?.aborted) throw new d();
			let _ = new AbortController(), v = await this.fetchWithTimeout(l, c, u, _, i, {
				requestLogID: m,
				retryOfRequestLogID: n
			}).catch(s), y = Date.now();
			if (v instanceof globalThis.Error) {
				De(_);
				let e = `retrying, ${t} attempts remaining`;
				if (i.signal?.aborted) throw new d();
				let a = o(v) || /timed? ?out/i.test(String(v) + ("cause" in v ? String(v.cause) : "")), s = this.middleware.length > 0 || !!i.middleware?.length || this.backendMiddleware().length > 0;
				if (s && !a && !Ka(v)) throw E(this).info(`[${m}] middleware error (not retryable)`), un(E(this), `[${m}] middleware error (not retryable)`, {
					retryOfRequestLogID: n,
					url: l,
					durationMs: y - g,
					message: v.message
				}), v;
				if (t) return E(this).info(`[${m}] connection ${a ? "timed out" : "failed"} - ${e}`), un(E(this), `[${m}] connection ${a ? "timed out" : "failed"} (${e})`, {
					retryOfRequestLogID: n,
					url: l,
					durationMs: y - g,
					message: v.message
				}), this.retryRequest(i, t, n ?? m, r);
				throw E(this).info(`[${m}] connection ${a ? "timed out" : "failed"} - error; no more retries left`), un(E(this), `[${m}] connection ${a ? "timed out" : "failed"} (error; no more retries left)`, {
					retryOfRequestLogID: n,
					url: l,
					durationMs: y - g,
					message: v.message
				}), a ? new p() : s && !Ga(v) ? v : new f({ cause: v });
			}
			let ee = `[${m}${h}${[...v.headers.entries()].filter(([e]) => e === "request-id" || e === "anthropic-workspace-id").map(([e, t]) => ", " + e + ": " + JSON.stringify(t)).join("")}] ${c.method} ${l} ${v.ok ? "succeeded" : "failed"} with status ${v.status} in ${y - g}ms`;
			if (!v.ok) {
				let e = await this.shouldRetry(v, i);
				if (t && e) {
					let e = `retrying, ${t} attempts remaining`;
					return await Pe(v.body), De(_), E(this).info(`${ee} - ${e}`), un(E(this), `[${m}] response error (${e})`, {
						retryOfRequestLogID: n,
						url: v.url,
						status: v.status,
						headers: v.headers,
						durationMs: y - g
					}), this.retryRequest(i, t, n ?? m, r, v.headers);
				}
				let a = e ? "error; no more retries left" : "error; not retryable";
				E(this).info(`${ee} - ${a}`);
				let o = await v.text().catch((e) => s(e).message), c = de(o), l = c ? void 0 : o;
				throw un(E(this), `[${m}] response error (${a})`, {
					retryOfRequestLogID: n,
					url: v.url,
					status: v.status,
					headers: v.headers,
					message: l,
					durationMs: Date.now() - g
				}), De(_), this.makeStatusError(v.status, c, l, v.headers);
			}
			return E(this).info(ee), un(E(this), `[${m}] response start`, {
				retryOfRequestLogID: n,
				url: v.url,
				status: v.status,
				headers: v.headers,
				durationMs: y - g
			}), Ee(v.body ?? v, _), {
				response: v,
				options: i,
				controller: _,
				requestLogID: m,
				retryOfRequestLogID: n,
				startTime: g
			};
		}
		getAPIList(e, t, n) {
			return this.requestAPIList(t, n && "then" in n ? n.then((t) => ({
				method: "get",
				path: e,
				...t
			})) : {
				method: "get",
				path: e,
				...n
			});
		}
		requestAPIList(e, t) {
			if (!this._tracer) {
				let n = this.makeRequest(t, null, void 0);
				return new lo(this, n, e);
			}
			let n = this.makeTracedRequest(t, null);
			return new lo(this, n, e);
		}
		async fetchWithTimeout(e, t, n, r, i, a) {
			let { signal: o, method: s, ...c } = t || {}, l = this._makeAbort(r);
			o && (o.addEventListener("abort", l, { once: !0 }), Te(r, o, l));
			let u = globalThis.ReadableStream && c.body instanceof globalThis.ReadableStream || typeof c.body == "object" && c.body !== null && Symbol.asyncIterator in c.body, d = {
				signal: r.signal,
				...u ? { duplex: "half" } : {},
				method: "GET",
				...c
			};
			s && (d.method = s.toUpperCase());
			let f = this.fetch, p = async (e, t) => {
				let r = setTimeout(l, n);
				try {
					return await f.call(void 0, e, t);
				} finally {
					clearTimeout(r);
				}
			}, m = i === void 0 ? p : (async (e, t = {}) => {
				let n = typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
				t.headers = t.headers instanceof Headers ? t.headers : new Headers(t.headers);
				let r = [];
				i.__span && (t.headers = new Headers(t.headers), r = aa(t.headers)), await this.prepareRequest(t, {
					url: n,
					options: i
				}), r.length && (t.headers = D([t.headers, r]).values);
				let o = i.__span;
				return o && O(this, () => Un(o, t.method ?? "GET", n, this.openTelemetry.traces.contentMode === "content")), a && un(E(this), `[${a.requestLogID}] sending request`, {
					retryOfRequestLogID: a.retryOfRequestLogID,
					method: t.method,
					url: n,
					options: i,
					headers: t.headers
				}), p(e, t);
			}), h = i?.middleware, g = i?.__span ? this.backendMiddleware().map(oa) : this.backendMiddleware();
			return await qa(m, h?.length || g.length ? [
				...this.middleware,
				...h ?? [],
				...g
			] : this.middleware, i, this)(e, d);
		}
		async shouldRetry(e, t) {
			let n = this._authFlags(t);
			if (e.status === 401 && this._authState.tokenCache && n.usedTokenCache && !n.didRefreshFor401) return n.didRefreshFor401 = !0, this._authState.tokenCache.invalidate(), !0;
			let r = e.headers.get("x-should-retry");
			return r === "true" ? !0 : r === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
		}
		async retryRequest(e, t, n, r, i) {
			let a, o = i?.get("retry-after-ms");
			if (o) {
				let e = parseFloat(o);
				Number.isNaN(e) || (a = e);
			}
			let s = i?.get("retry-after");
			if (s && !a) {
				let e = parseFloat(s);
				a = Number.isNaN(e) ? Date.parse(s) - Date.now() : e * 1e3;
			}
			if (a === void 0 || !(a > 0 && a <= 2 ** 31 - 1)) {
				let n = e.maxRetries ?? this.maxRetries;
				a = this.calculateDefaultRetryTimeoutMillis(t, n);
			}
			return await fe(a, e.signal ?? void 0), this.makeRequest(e, t - 1, n, r);
		}
		calculateDefaultRetryTimeoutMillis(e, t) {
			let n = t - e;
			return Math.min(.5 * 2 ** n, 8) * (1 - Math.random() * .25) * 1e3;
		}
		calculateNonstreamingTimeout(e, t) {
			let n = 6e5;
			if (36e5 * e / 128e3 > n || t != null && e > t) throw new l("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
			return n;
		}
		async buildRequest(e, { retryCount: t = 0 } = {}) {
			let n = { ...e }, { method: r, path: i, query: a, defaultBaseURL: o } = n;
			this._authState.resolution && await this._authState.resolution, !this._baseURLIsExplicit && this._authState.baseURL && this.baseURL !== this._authState.baseURL && (this.baseURL = this._authState.baseURL);
			let s = this.buildURL(i, a, o);
			"timeout" in n && ue("timeout", n.timeout), n.timeout = n.timeout ?? this.timeout;
			let { bodyHeaders: c, body: l } = this.buildBody({ options: n });
			return {
				req: {
					method: r,
					headers: await this.buildHeaders({
						options: e,
						method: r,
						bodyHeaders: c,
						retryCount: t,
						timeout: n.timeout
					}),
					...n.signal && { signal: n.signal },
					...globalThis.ReadableStream && l instanceof globalThis.ReadableStream && { duplex: "half" },
					...l && { body: l },
					...this.fetchOptions ?? {},
					...n.fetchOptions ?? {}
				},
				url: s,
				timeout: n.timeout
			};
		}
		async buildHeaders({ options: e, method: t, bodyHeaders: n, retryCount: r, timeout: i }) {
			let a = D([
				{
					Accept: "application/json",
					"User-Agent": this.getUserAgent(),
					"X-Stainless-Retry-Count": String(r),
					"X-Stainless-Timeout": String(Math.trunc(i / 1e3)),
					...xe(),
					...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
					"anthropic-version": "2023-06-01"
				},
				await this.authHeaders(e),
				this._options.defaultHeaders,
				n,
				e.headers
			]);
			return this.validateHeaders(a), a.values;
		}
		_makeAbort(e) {
			return () => e.abort();
		}
		buildBody({ options: { body: e, headers: t } }) {
			if (!e) return {
				bodyHeaders: void 0,
				body: void 0
			};
			let n = D([t]);
			return ArrayBuffer.isView(e) || e instanceof ArrayBuffer || e instanceof DataView || typeof e == "string" && n.values.has("content-type") || globalThis.Blob && e instanceof globalThis.Blob || e instanceof FormData || e instanceof URLSearchParams || globalThis.ReadableStream && e instanceof globalThis.ReadableStream ? {
				bodyHeaders: void 0,
				body: e
			} : this.isStreamBody(e) ? {
				bodyHeaders: void 0,
				body: Ae(e)
			} : typeof e == "object" && n.values.get("content-type") === "application/x-www-form-urlencoded" ? {
				bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
				body: this.stringifyQuery(e)
			} : a(this, kp, "f").call(this, {
				body: e,
				headers: n
			});
		}
		isStreamBody(e) {
			return globalThis.ReadableStream && e instanceof globalThis.ReadableStream ? !0 : typeof e == "object" && !!e && (Symbol.asyncIterator in e || Symbol.iterator in e && "next" in e && typeof e.next == "function");
		}
	}
	return Op = e, kp = /* @__PURE__ */ new WeakMap(), Ap = /* @__PURE__ */ new WeakMap(), Dp = /* @__PURE__ */ new WeakSet(), jp = function() {
		return this.baseURL !== "https://api.anthropic.com";
	}, e.Anthropic = Op, e.DEFAULT_TIMEOUT = 6e5, e.AnthropicError = l, e.APIError = u, e.APIConnectionError = f, e.APIConnectionTimeoutError = p, e.APIUserAbortError = d, e.NotFoundError = v, e.ConflictError = y, e.RateLimitError = te, e.BadRequestError = h, e.AuthenticationError = g, e.InternalServerError = ne, e.PermissionDeniedError = _, e.UnprocessableEntityError = ee, e.toFile = ho, e.HUMAN_PROMPT = Mp, e.AI_PROMPT = Np, e;
})(), Fp = /* @__PURE__ */ (() => {
	class e extends Pp {
		constructor() {
			super(...arguments), this.completions = new ap(this), this.messages = new us(this), this.models = new sp(this), this.files = new op(this), this.skills = new Ep(this), this.organization = new wp(this), this.beta = new ip(this);
		}
	}
	return e.Completions = ap, e.Messages = us, e.Models = sp, e.Files = op, e.Skills = Ep, e.Organization = wp, e.Beta = ip, e;
})(), Ip = "https://chabi.dev", Lp = 9e5, $ = class extends Error {
	constructor(e, t = 0, n = "", r = "") {
		super(e), Object.assign(this, {
			status: t,
			code: n,
			upgradeUrl: r
		});
	}
};
function Rp(e) {
	let t = e?.error?.error ?? e?.error ?? e;
	return {
		code: t?.code ?? t?.type ?? "",
		upgradeUrl: t?.upgrade_url ?? "",
		message: t?.message ?? e?.message ?? "Chabi request failed."
	};
}
var zp = (e) => new Promise((t) => setTimeout(t, e));
function Bp(e) {
	if (!e) return 1e3;
	let t = Number(e);
	return Number.isFinite(t) ? Math.max(0, t * 1e3) : Math.max(0, Date.parse(e) - Date.now()) || 1e3;
}
var Vp = class {
	constructor(e, t = globalThis) {
		this.config = e, this.env = t, this.key = `circuitmind:chabi:${e.clientId}:tokens`, this.prefix = `circuitmind:chabi:${e.clientId}:oauth:`;
	}
	read() {
		return JSON.parse(this.env.localStorage.getItem(this.key) || "null");
	}
	write(e) {
		this.env.localStorage.setItem(this.key, JSON.stringify(e));
	}
	lock(e) {
		if (!this.env.navigator.locks) throw new $("Chabi sign-in needs a browser with Web Locks on HTTPS (or localhost).");
		return this.env.navigator.locks.request("chabi-refresh", e);
	}
	async signOut() {
		await this.lock(() => this.env.localStorage.removeItem(this.key));
	}
	async tokenRequest(e) {
		for (let t = 0;; t++) {
			let n = await this.env.fetch(`${Ip}/oauth/token`, {
				method: "POST",
				body: new URLSearchParams({
					...e,
					client_id: this.config.clientId
				})
			});
			if (n.status === 429 && t < 2) {
				await zp(Bp(n.headers.get("Retry-After")));
				continue;
			}
			let r = await n.json();
			if (!n.ok) {
				let e = Rp(r);
				throw new $(e.message, n.status, typeof r.error == "string" ? r.error : e.code);
			}
			if (!r.access_token || !r.refresh_token || !(Number(r.expires_in) > 0)) throw new $("Chabi returned an incomplete sign-in. Please sign in again.");
			return {
				...r,
				expires_at: Date.now() + Number(r.expires_in) * 1e3
			};
		}
	}
	async signIn() {
		if (!this.config.clientId || !this.config.redirectUri) throw new $("The host needs to configure Chabi sign-in.");
		await this.lock(() => {});
		let e = (e) => this.env.crypto.getRandomValues(new Uint8Array(e)), t = (e) => btoa(String.fromCharCode(...e)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", ""), n = t(e(32)), r = t(e(32)), i = t(new Uint8Array(await this.env.crypto.subtle.digest("SHA-256", new TextEncoder().encode(n))));
		for (let e of Object.keys(this.env.localStorage)) if (e.startsWith(this.prefix)) try {
			Date.now() - JSON.parse(this.env.localStorage.getItem(e)).time > Lp && this.env.localStorage.removeItem(e);
		} catch {
			this.env.localStorage.removeItem(e);
		}
		this.env.localStorage.setItem(this.prefix + r, JSON.stringify({
			verifier: n,
			time: Date.now(),
			redirectUri: this.config.redirectUri
		}));
		let a = new URLSearchParams({
			response_type: "code",
			client_id: this.config.clientId,
			redirect_uri: this.config.redirectUri,
			code_challenge: i,
			code_challenge_method: "S256",
			state: r
		});
		this.env.location.assign(`${Ip}/oauth/authorize?${a}`);
	}
	async callback() {
		let e = new URL(this.env.location.href);
		if (!e.searchParams.has("code") && !e.searchParams.has("error")) return;
		let t = e.searchParams.get("state"), n = e.searchParams.get("code"), r = e.searchParams.get("error");
		for (let t of [
			"code",
			"state",
			"error",
			"error_description"
		]) e.searchParams.delete(t);
		return this.env.history.replaceState(null, "", e), this.lock(async () => {
			let e = t && this.env.localStorage.getItem(this.prefix + t);
			t && this.env.localStorage.removeItem(this.prefix + t);
			let i;
			try {
				i = JSON.parse(e || "null");
			} catch {}
			if (!i || !Number.isFinite(i.time) || Date.now() - i.time > Lp || i.time > Date.now() || i.redirectUri !== this.config.redirectUri) throw new $("This sign-in did not start here or has expired. Please sign in again.");
			if (r === "access_denied") throw new $("You declined access. You can sign in whenever you’re ready.");
			if (r || !n) throw new $("Sign-in could not be completed. Please try again.");
			this.write(await this.tokenRequest({
				grant_type: "authorization_code",
				code: n,
				redirect_uri: i.redirectUri,
				code_verifier: i.verifier
			}));
		});
	}
	async access(e = !1, t = "") {
		let n = this.read();
		if (!n) throw new $("Sign in with Chabi to use AI.", 401);
		return !e && n.expires_at > Date.now() + 6e4 || e && t && n.access_token !== t ? n.access_token : this.lock(async () => {
			let t = this.read();
			if (!t) throw new $("Please sign in with Chabi again.", 401);
			if (t.refresh_token !== n.refresh_token || !e && t.expires_at > Date.now() + 6e4) return t.access_token;
			try {
				let e = await this.tokenRequest({
					grant_type: "refresh_token",
					refresh_token: t.refresh_token
				});
				return this.write(e), e.access_token;
			} catch {
				throw this.env.localStorage.removeItem(this.key), new $("Your Chabi sign-in ended. Please sign in again.", 401, "invalid_grant");
			}
		});
	}
	async authorized(e) {
		let t = await this.access();
		for (let n = 0, r = !1;; n++) try {
			return await e(t);
		} catch (e) {
			let i = Rp(e), a = e.status;
			if (a === 401 && i.code === "invalid_token" && !r) {
				t = await this.access(!0, t), r = !0;
				continue;
			}
			if (a === 401) throw await this.signOut(), new $("Your Chabi access ended. Please sign in again.", 401, i.code);
			if (a === 429 && n < 3) {
				await zp(Bp(e.headers?.get?.("Retry-After")));
				continue;
			}
			throw a === 402 ? new $("Your Chabi credits do not cover this request’s maximum cost. Add credits or try a smaller output limit.", 402, i.code, i.upgradeUrl) : new $(a === 429 ? "Chabi is busy. Please try again shortly." : i.message, a, i.code, i.upgradeUrl);
		}
	}
	async get(e) {
		return this.authorized(async (t) => {
			let n = await this.env.fetch(`${Ip}/v1/${e}`, { headers: { Authorization: `Bearer ${t}` } }), r = await n.json();
			if (!n.ok) throw Object.assign(/* @__PURE__ */ Error("Chabi request failed"), {
				status: n.status,
				error: r,
				headers: n.headers
			});
			return r;
		});
	}
}, Hp = Symbol.for("circuitmind.chabi.runtimes"), Up = window[Hp] ??= /* @__PURE__ */ new Map(), Wp = Symbol.for("circuitmind.chabi.mounts"), Gp = window[Wp] ??= /* @__PURE__ */ new WeakMap();
function Kp(e) {
	let { data: t, parentElement: n, setStateValue: r, setTriggerValue: i } = e;
	Gp.get(n)?.();
	let a = {
		clientId: t.client_id,
		redirectUri: t.redirect_uri
	}, o = JSON.stringify(a), s = Up.get(o);
	s || (s = {
		auth: new Vp(a),
		jobs: /* @__PURE__ */ new Map(),
		message: "",
		ready: !1
	}, Up.set(o, s), s.init = s.auth.callback().catch((e) => {
		s.message = e.message;
	}).finally(() => {
		s.ready = !0;
	})), s.finished ??= /* @__PURE__ */ new Set();
	let c = document.createElement("div");
	n.append(c);
	let l = !1, u;
	function d() {
		if (l) return;
		c.replaceChildren();
		let e;
		try {
			e = s.auth.read();
		} catch {
			s.message = "Allow browser local storage to use Chabi sign-in.";
		}
		let n = !!e;
		t.signed_in !== n && u !== n && (u = n, r("signed_in", n)), t.signed_in === n && (u = void 0);
		let i = document.createElement("p");
		i.textContent = n ? `Signed in with Chabi${s.name ? ` · ${s.name}` : ""}${s.balance == null ? "" : ` · ${s.balance} credits`}` : "Use your own Chabi plan for AI features.", c.append(i);
		let o = document.createElement("button");
		if (o.textContent = n ? "Sign out" : "Sign in with Chabi", o.disabled = !a.clientId || !a.redirectUri || !s.ready, o.onclick = async () => {
			o.disabled = !0;
			try {
				n ? (await s.auth.signOut(), s.name = null, s.balance = null, s.message = "", d()) : await s.auth.signIn();
			} catch (e) {
				s.message = e.message, d();
			}
		}, c.append(o), !a.clientId || !a.redirectUri) {
			let e = document.createElement("p");
			e.textContent = "The host needs to configure the Chabi client ID and redirect URI.", c.append(e);
		}
		if (s.message) {
			let e = document.createElement("p");
			e.textContent = s.message, c.append(e);
		}
		if (s.upgradeUrl) try {
			let e = new URL(s.upgradeUrl);
			if (e.protocol === "https:") {
				let t = document.createElement("a");
				t.href = e.href, t.textContent = "Manage Chabi credits", t.target = "_blank", t.rel = "noopener noreferrer", c.append(t);
			}
		} catch {}
		if (t.request && !s.finished.has(t.request.id)) {
			let e = document.createElement("p");
			e.textContent = "Chabi is working…", c.append(e);
		}
	}
	async function f() {
		if (!s.auth.read()) return;
		let [e, t] = await Promise.allSettled([s.auth.get("me"), s.auth.get("credits")]);
		e.status === "fulfilled" && (s.name = e.value.name), t.status === "fulfilled" && (s.balance = t.value.balance_credits), d();
	}
	async function p() {
		if (await s.init, !l) {
			if (d(), t.request) {
				let e = t.request;
				s.jobs.has(e.id) || s.jobs.set(e.id, (async () => {
					try {
						s.message = "", s.upgradeUrl = "";
						let t = await s.auth.authorized((t) => {
							let n = new Fp({
								apiKey: t,
								baseURL: "https://chabi.dev",
								dangerouslyAllowBrowser: !0,
								maxRetries: 0,
								timeout: 18e4
							}), r = {
								model: e.model,
								max_tokens: e.max_tokens,
								system: e.system,
								messages: e.messages,
								output_config: { effort: e.response_schema ? "medium" : "low" }
							};
							return e.response_schema && (r.output_config.format = {
								type: "json_schema",
								schema: e.response_schema
							}), n.messages.create(r);
						});
						return {
							id: e.id,
							text: t.content.filter((e) => e.type === "text").map((e) => e.text).join("").trim(),
							truncated: t.stop_reason === "max_tokens"
						};
					} catch (t) {
						return s.message = t instanceof $ ? t.message : "Could not reach Chabi. Please try again.", s.upgradeUrl = t.upgradeUrl || "", {
							id: e.id,
							error: s.message
						};
					} finally {
						s.finished.add(e.id);
					}
				})());
				let n = await s.jobs.get(e.id);
				!l && s.delivered !== e.id && (s.delivered = e.id, i("response", n)), d(), f();
			} else s.jobs.clear(), s.finished.clear(), f();
		}
	}
	let m = (e) => {
		e.key === s.auth.key && (s.name = null, s.balance = null, d(), s.auth.read() && f());
	};
	window.addEventListener("storage", m);
	let h = setInterval(async () => {
		try {
			s.auth.read() && await s.auth.access();
		} catch (e) {
			s.message = e.message;
		}
		d();
	}, 3e4);
	d(), p().catch((e) => {
		s.message = e.message, d();
	});
	let g = () => {
		l = !0, c.remove(), clearInterval(h), window.removeEventListener("storage", m), Gp.get(n) === g && Gp.delete(n);
	};
	return Gp.set(n, g), g;
}
export { Kp as default };
