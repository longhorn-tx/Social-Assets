import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Match the extensionless TypeScript imports accepted by Next.js.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error.code !== "ERR_MODULE_NOT_FOUND" || !specifier.startsWith(".")) throw error;
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});

const { createPlatformClient, isTransientPlatformError, PlatformError, PlatformUnreachableError } = await import(
  "../generation/platform.ts"
);

function client(fetch, timeoutMs) {
  return createPlatformClient({ apiKey: "test-id:test-secret", baseUrl: "https://api.higgsfield.ai/", fetch, timeoutMs });
}

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

test("submit, status and cancel use the documented paths and the Key scheme", async () => {
  const calls = [];
  const api = client(async (url, options) => {
    calls.push({ url, method: options.method, auth: options.headers.Authorization, body: options.body });
    if (url.endsWith("/status")) return json(200, { status: "completed", request_id: "r1", video: { url: "https://cdn/v.mp4" } });
    if (url.endsWith("/cancel")) return new Response(null, { status: 202 });
    return json(200, { status: "queued", request_id: "r1", status_url: "s", cancel_url: "c" });
  });

  assert.deepEqual(await api.submit("bytedance/seedance-2.5/text-to-video", { prompt: "x" }), {
    status: "queued",
    requestId: "r1",
    statusUrl: "s",
    cancelUrl: "c",
  });
  assert.deepEqual(await api.status("r1"), { status: "completed", requestId: "r1", video: { url: "https://cdn/v.mp4" } });
  await api.cancel("r1");

  assert.deepEqual(
    calls.map((c) => [c.method, c.url]),
    [
      ["POST", "https://api.higgsfield.ai/bytedance/seedance-2.5/text-to-video"],
      ["GET", "https://api.higgsfield.ai/requests/r1/status"],
      ["POST", "https://api.higgsfield.ai/requests/r1/cancel"],
    ],
  );
  for (const call of calls) assert.equal(call.auth, "Key test-id:test-secret");
  assert.equal(calls[0].body, JSON.stringify({ prompt: "x" }));
});

test("rejected keys and rate limits get actionable messages", async () => {
  for (const status of [401, 403]) {
    const error = await client(async () => json(status, { detail: "Unauthorized" }))
      .submit("flux-2-pro", {})
      .catch((e) => e);
    assert.ok(error instanceof PlatformError);
    assert.match(error.message, /rejected the API key/);
    assert.equal(isTransientPlatformError(error), false);
  }
  const limited = await client(async () => json(429, {})).status("r1").catch((e) => e);
  assert.match(limited.message, /rate limit/);
  assert.equal(isTransientPlatformError(limited), true);
  assert.equal(isTransientPlatformError(new PlatformError(503, null)), true);
  assert.equal(isTransientPlatformError(new PlatformError(422, null)), false);
});

test("validation details are readable", async () => {
  const error = await client(async () =>
    json(422, { detail: [{ loc: ["body", "duration"], msg: "must be at most 15" }, { loc: ["body"], msg: "bad" }] }),
  )
    .submit("flux-2-pro", {})
    .catch((e) => e);
  assert.equal(error.message, "duration: must be at most 15; bad");
});

test("no answer is reported as ambiguous for submits and is never retried", async () => {
  let calls = 0;
  const hang = (_url, options) =>
    new Promise((_resolve, reject) => {
      calls++;
      options.signal.addEventListener("abort", () => reject(options.signal.reason));
    });
  // AbortSignal.timeout does not hold the event loop open on its own.
  const keepAlive = setInterval(() => {}, 1000);
  const error = await client(hang, 20).submit("flux-2-pro", {}).catch((e) => e);
  clearInterval(keepAlive);
  assert.ok(error instanceof PlatformUnreachableError);
  assert.match(error.message, /may or may not have been queued/);
  assert.equal(isTransientPlatformError(error), true);
  assert.equal(calls, 1);

  const offline = await client(async () => {
    throw new TypeError("fetch failed");
  })
    .status("r1")
    .catch((e) => e);
  assert.ok(offline instanceof PlatformUnreachableError);
  assert.equal(offline.message, "Could not reach Higgsfield.");
});
