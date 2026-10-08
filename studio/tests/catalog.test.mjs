import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";

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

const { MODELS } = await import("../generation/catalog/index.ts");

test("every installed model file contributes to the picker catalog", async () => {
  const files = readdirSync(new URL("../generation/catalog/models/", import.meta.url)).filter(
    (f) => f.endsWith(".ts") && !f.endsWith(".d.ts"),
  );
  const ids = new Set(MODELS.map((m) => m.id));
  for (const file of files) {
    const { default: exported } = await import(`../generation/catalog/models/${file}`);
    for (const model of [exported].flat()) assert.ok(ids.has(model.id), `${model.id} (${file}) missing from MODELS`);
  }
  for (const surface of ["image", "video"]) assert.ok(MODELS.some((m) => m.surface === surface));
});
