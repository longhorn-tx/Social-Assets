import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith(".")) throw error;
      if (error.code === "ERR_UNSUPPORTED_DIR_IMPORT") return nextResolve(`${specifier}/index.ts`, context);
      if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});

const { DECKS } = await import("../content/decks/index.ts");
const { brandFor, planClip, planStill } = await import("../content/plan.ts");
const { getModel, parseSettings } = await import("../generation/catalog/index.ts");
const { toPlatform } = await import("../generation/to-platform.ts");
const { estimateCost } = await import("../generation/catalog/pricing.ts");

function request(plane) {
  const model = getModel(plane.model);
  return toPlatform({ ...plane, settings: parseSettings(model, plane.settings) });
}

test("every deck shot plans to a valid platform request", () => {
  for (const deck of DECKS) {
    const ids = new Set(deck.posts.map((p) => p.id));
    assert.equal(ids.size, deck.posts.length, `${deck.id}: duplicate post ids`);
    for (const post of deck.posts) {
      const brand = brandFor(deck, post);
      const seen = new Set();
      for (const shot of post.shots) {
        for (const ref of [shot.referenceFrom, shot.transitionFrom].filter(Boolean))
          assert.ok(seen.has(ref), `${post.id}/${shot.id} references ${ref}, which must come earlier`);
        assert.ok(!seen.has(shot.id), `${post.id}: duplicate shot ${shot.id}`);
        seen.add(shot.id);
        if (shot.output === "editor") continue;

        // Before any approval, and with every shot approved.
        const none = () => undefined;
        const all = (id) => `https://cdn.example.com/${post.id}/${id}.png`;
        for (const approved of [none, all]) {
          const still = planStill(post, shot, brand, approved);
          assert.ok(still.ok, `${post.id}/${shot.id}: ${still.reason}`);
          request(still.plane);
        }
        if (shot.output === "video") {
          assert.equal(planClip(post, shot, none).ok, false);
          const clip = planClip(post, shot, all);
          assert.ok(clip.ok, `${post.id}/${shot.id}: ${clip.reason}`);
          const { body } = request(clip.plane);
          assert.equal(body.image_url, all(shot.transitionFrom ?? shot.id));
          if (shot.transitionFrom) assert.equal(body.last_image_url, all(shot.id));
        }
      }
    }
  }
});

test("a reference shot switches the still to Flux 2 with the approved image", () => {
  const deck = DECKS.find((d) => d.id === "2026-10-12");
  const post = deck.posts.find((p) => p.id === "longhorn-see-before-you-build");
  const after = post.shots.find((s) => s.id === "after");
  const brand = brandFor(deck, post);
  assert.equal(planStill(post, after, brand, () => undefined).modelId, "soul-2");
  const planned = planStill(post, after, brand, (id) => (id === "before" ? "https://cdn/before.png" : undefined));
  assert.equal(planned.modelId, "flux-2");
  assert.deepEqual(request(planned.plane).body.image_urls, ["https://cdn/before.png"]);
});

test("cost estimates scale with duration and batch size", () => {
  assert.equal(estimateCost("kling-3-pro", { duration: 5 }).usd.toFixed(2), "0.42");
  assert.equal(estimateCost("soul-2", { batchSize: "4" }).usd.toFixed(4), "0.0128");
  assert.equal(estimateCost("kling-3-pro", {}), null);
  assert.equal(estimateCost("flux-2", {}), null);
});
