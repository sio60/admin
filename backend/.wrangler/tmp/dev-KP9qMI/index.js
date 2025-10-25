var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-qbadXe/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/utils/cors.js
function withCORS(resp, origin = "*") {
  const headers = new Headers(resp.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(resp.body, { status: resp.status, headers });
}
__name(withCORS, "withCORS");
function preflight(request, origin = "*") {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  return null;
}
__name(preflight, "preflight");

// src/utils/jwt.js
function base64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
__name(base64url, "base64url");
async function hmacSign(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
}
__name(hmacSign, "hmacSign");
async function signJWT(payload, secret, { expSeconds = 3600 } = {}) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1e3);
  const body = { iat: now, exp: now + expSeconds, ...payload };
  const p1 = base64url(new TextEncoder().encode(JSON.stringify(header)));
  const p2 = base64url(new TextEncoder().encode(JSON.stringify(body)));
  const unsigned = `${p1}.${p2}`;
  const sig = base64url(await hmacSign(secret, unsigned));
  return `${unsigned}.${sig}`;
}
__name(signJWT, "signJWT");
async function verifyJWT(token, secret) {
  const [h, p, s] = token.split(".");
  if (!h || !p || !s)
    return null;
  const sig = base64url(await hmacSign(secret, `${h}.${p}`));
  if (sig !== s)
    return null;
  const json = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(p.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));
  if (json.exp && Math.floor(Date.now() / 1e3) > json.exp)
    return null;
  return json;
}
__name(verifyJWT, "verifyJWT");

// src/utils/auth.js
async function requireAdmin(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token)
    return { ok: false };
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload || payload.role !== "admin")
    return { ok: false };
  return { ok: true, user: { role: "admin" } };
}
__name(requireAdmin, "requireAdmin");

// src/routes/content.js
async function handleContent(request, env) {
  const url = new URL(request.url);
  if (request.method === "GET") {
    const key = url.searchParams.get("key");
    const qp = key ? `?key=eq.${encodeURIComponent(key)}` : "";
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/content_blocks${qp}`, {
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        Prefer: "return=representation"
      }
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "PUT" || request.method === "PATCH") {
    const body = await request.json();
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/content_blocks`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify({
        key: body.key,
        type: body.type ?? "text",
        content: body.content ?? {}
      })
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "DELETE") {
    const key = url.searchParams.get("key");
    if (!key)
      return new Response(JSON.stringify({ error: "key required" }), { status: 400 });
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/content_blocks?key=eq.${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`
      }
    });
    return new Response(null, { status: res.ok ? 204 : res.status });
  }
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
}
__name(handleContent, "handleContent");

// src/routes/admin.js
async function handleAdmin(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    const { password } = await request.json();
    if (!password || password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "INVALID_PASSWORD" }), { status: 401 });
    }
    const token = await signJWT({ role: "admin" }, env.JWT_SECRET, { expSeconds: 60 * 60 * 8 });
    return new Response(JSON.stringify({ token, role: "admin" }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  if (url.pathname === "/api/admin/verify" && request.method === "GET") {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const payload = token ? await verifyJWT(token, env.JWT_SECRET) : null;
    if (!payload || payload.role !== "admin") {
      return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ ok: true, role: "admin" }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response("Not Found", { status: 404 });
}
__name(handleAdmin, "handleAdmin");

// src/index.js
var src_default = {
  async fetch(request, env) {
    const pf = preflight(request, "*");
    if (pf)
      return pf;
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "GET") {
      return withCORS(new Response(JSON.stringify({ ok: true, routes: ["/api/admin/*", "/api/content"] }), { headers: { "Content-Type": "application/json" } }));
    }
    if (url.pathname.startsWith("/api/admin")) {
      const resp = await handleAdmin(request, env);
      return withCORS(resp);
    }
    if (url.pathname === "/api/content" && request.method === "GET") {
      return withCORS(await handleContent(request, env));
    }
    if (url.pathname.startsWith("/api/content")) {
      const auth = await requireAdmin(request, env);
      if (!auth.ok)
        return withCORS(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
      return withCORS(await handleContent(request, env));
    }
    return withCORS(new Response("Not Found", { status: 404 }));
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-qbadXe/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-qbadXe/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
