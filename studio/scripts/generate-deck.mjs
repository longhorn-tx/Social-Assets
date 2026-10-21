#!/usr/bin/env node
// Generates a weekly deck end to end: draft a still per shot, animate the
// video shots, download everything and assemble each reel with ffmpeg.
//
//   node scripts/generate-deck.mjs --deck 2026-10-19 [--post <id>]
//        [--stage stills|clips|all] [--redo shotA,shotB] [--budget]
//        [--max-usd 25] [--dry-run] [--assemble-only] [--verbose]
//
// Cost control: run --stage stills first (cents), look at the stills, --redo
// any weak ones, then --stage clips; video is ~95% of the spend, so a clip is
// only ever made from a checked still. --budget animates every shot with
// Kling 3.0 Pro instead of Seedance 2.0. Spend is tallied at list prices and
// the run stops before a request would cross --max-usd.
//
// Needs HF_API_KEY (the full key copied from open.higgsfield.ai), read from
// the environment or .env.local. Progress lives in out/<deck>/<post>/manifest.json:
// a request id is saved the moment it is queued, so a rerun resumes polling
// instead of paying for the same generation twice. HF_MOCK=1 makes local
// placeholder media with ffmpeg instead of calling the API (for testing).
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { registerHooks } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (!specifier.startsWith(".")) throw error
      if (error.code === "ERR_UNSUPPORTED_DIR_IMPORT")
        return nextResolve(`${specifier}/index.ts`, context)
      if (error.code !== "ERR_MODULE_NOT_FOUND") throw error
      return nextResolve(`${specifier}.ts`, context)
    }
  },
})

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const { getDeck } = await import("../content/decks/index.ts")
const { brandFor, clipModel, clipSeconds, generatedShots, planClip, planStill } =
  await import("../content/plan.ts")
const { getModel, parseSettings } = await import("../generation/catalog/index.ts")
const { estimateCost } = await import("../generation/catalog/pricing.ts")
const { toPlatform } = await import("../generation/to-platform.ts")
const { createPlatformClient, isTransientPlatformError } = await import(
  "../generation/platform.ts"
)

/* ── args + env ───────────────────────────────────────────────────────── */
const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const option = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
loadEnvFile(join(ROOT, ".env.local"))
const MOCK = process.env.HF_MOCK === "1"
const DRY = flag("dry-run")
const MAX_USD = Number(option("max-usd") ?? 25)
const STAGE = option("stage") ?? "all"
const REDO = new Set((option("redo") ?? "").split(",").filter(Boolean))
const BUDGET = flag("budget")
let spent = 0
if (!flag("verbose")) console.info = () => {}

const loaded = getDeck(option("deck") ?? "")
if (!loaded) fail(`Unknown deck. Use --deck <id>, e.g. --deck 2026-10-19`)
// --budget: Kling everywhere (Seedance costs roughly twice as much per second).
const deck = BUDGET
  ? {
      ...loaded,
      posts: loaded.posts.map((p) => ({
        ...p,
        shots: p.shots.map((shot) => ({ ...shot, clipModel: undefined })),
      })),
    }
  : loaded
const posts = deck.posts.filter((p) => !option("post") || p.id === option("post"))
if (posts.length === 0) fail(`No post "${option("post")}" in ${deck.id}`)

const apiKey = process.env.HF_API_KEY?.trim()
if (!MOCK && !DRY && !flag("assemble-only") && !apiKey)
  fail("Set HF_API_KEY to the full key copied from open.higgsfield.ai (in .env.local or the environment).")
const client =
  apiKey &&
  createPlatformClient({
    apiKey,
    baseUrl: process.env.HF_API_BASE_URL || "https://api.higgsfield.ai",
  })

/* ── plan + budget ────────────────────────────────────────────────────── */
let estimate = 0
for (const post of posts) {
  const brand = brandFor(deck, post)
  for (const shot of generatedShots(post)) {
    const still = planStill(post, shot, brand, () => undefined)
    if (still.ok) estimate += estimateCost(still.modelId, still.plane.settings)?.usd ?? 0.05
    if (shot.output === "video")
      estimate +=
        estimateCost(clipModel(shot), { duration: clipSeconds(shot) })?.usd ?? 1
  }
}
console.log(
  `${deck.label}: ${posts.length} post(s), estimated ≈$${estimate.toFixed(2)} at list prices (cap $${MAX_USD}).`
)
if (DRY) {
  for (const post of posts) {
    console.log(`\n${post.day} · ${post.title}`)
    for (const shot of post.shots)
      console.log(
        `  ${shot.output.padEnd(6)} ${shot.id.padEnd(18)} ${shot.output === "video" ? `${planStill(post, shot, brandFor(deck, post), () => "x").modelId} → ${clipModel(shot)} ${clipSeconds(shot)}s` : shot.output === "image" ? planStill(post, shot, brandFor(deck, post), () => "x").modelId : "editor card"}`
      )
  }
  process.exit(0)
}
if (estimate > MAX_USD && STAGE !== "stills" && !flag("assemble-only"))
  fail(`Estimate exceeds --max-usd ${MAX_USD}. Raise it, pick one --post, or use --budget.`)

/* ── output frame ───────────────────────────────────────────────────── */
const W = 1080
const H = 1920
const FONT = [
  process.env.FONT_FILE,
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "C:/Windows/Fonts/arialbd.ttf",
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
].find((f) => f && existsSync(f))

/* ── run ──────────────────────────────────────────────────────────────── */
for (const post of posts) await runPost(post)
console.log(`\nDone. Spent ≈$${spent.toFixed(2)} this run (list-price estimate). Files: ${join(ROOT, "out", deck.id)}`)

async function runPost(post) {
  const dir = join(ROOT, "out", deck.id, post.id)
  mkdirSync(dir, { recursive: true })
  const manifestPath = join(dir, "manifest.json")
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : { shots: {} }
  const save = () => writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  const brand = brandFor(deck, post)
  const approved = (id) => manifest.shots[id]?.still?.url
  console.log(`\n▶ ${post.day} · ${post.title}`)

  for (const id of REDO) {
    if (manifest.shots[id]) {
      delete manifest.shots[id]
      console.log(`  ↺ ${id}: will regenerate`)
    }
  }
  save()

  if (!flag("assemble-only")) {
    const order = post.shots.map((s) => s.id)
    for (const shot of generatedShots(post)) {
      const n = String(order.indexOf(shot.id) + 1).padStart(2, "0")
      const entry = (manifest.shots[shot.id] ??= {})
      // Stills first; a shot that references another waits for its still.
      if (STAGE !== "clips" && !entry.still?.file) {
        const planned = planStill(post, shot, brand, approved)
        if (!planned.ok) continue
        entry.still ??= {}
        const done = await generate(planned, entry.still, save, {
          kind: "image",
          file: join(dir, `${n}-${shot.id}.png`),
          label: `${shot.label} still`,
        })
        if (!done) delete entry.still
        save()
      }
      if (STAGE !== "stills" && shot.output === "video" && !entry.clip?.file && entry.still?.file) {
        const planned = planClip(post, shot, approved)
        if (!planned.ok) {
          console.log(`  · ${shot.label}: ${planned.reason}`)
          continue
        }
        entry.clip ??= {}
        const done = await generate(planned, entry.clip, save, {
          kind: "video",
          file: join(dir, `${n}-${shot.id}.mp4`),
          label: `${shot.label} clip`,
        })
        if (!done) delete entry.clip
        save()
      }
    }
  }
  if (post.format === "reel" && STAGE !== "stills") assembleReel(post, manifest, dir)
  writeNotes(post, brand, dir)
}

/** Submit (or resume) one request, poll to a terminal status, download.
    Returns the filled entry, or undefined when the platform refused or the
    generation failed (failed generations are refunded, so a rerun may retry). */
async function generate(planned, entry, save, { kind, file, label }) {
  const model = getModel(planned.modelId)
  const settings = parseSettings(model, planned.plane.settings)
  const request = toPlatform({ ...planned.plane, settings })
  const cost = estimateCost(model.id, settings)?.usd ?? (kind === "video" ? 1 : 0.05)
  const tag = `${label} · ${model.label}${kind === "video" ? ` ${settings.duration}s` : ""}`
  if (!entry.requestId) {
    if (spent + cost > MAX_USD) {
      console.log(`  ⏸ ${tag}: skipped, would pass the $${MAX_USD} cap (spent ≈$${spent.toFixed(2)})`)
      return undefined
    }
    if (MOCK) {
      mockMedia(kind, file, settings)
      spent += cost
      console.log(`  ✓ ${tag} (mock) ≈$${cost.toFixed(3)}`)
      return Object.assign(entry, { requestId: "mock", url: `https://mock.invalid/${encodeURIComponent(file.split(/[\\/]/).pop())}`, file })
    }
    try {
      entry.requestId = (await client.submit(request.path, request.body)).requestId
      spent += cost
      save() // the request id is on disk before we wait on it
    } catch (error) {
      // Never resubmit on our own: an unanswered POST may still have been queued.
      console.log(`  ✗ ${tag}: ${error.message}`)
      return undefined
    }
  }
  process.stdout.write(`  … ${tag} ≈$${cost.toFixed(3)} `)
  const status = await poll(entry.requestId)
  if (!status) {
    console.log("✗ no final answer yet; rerun to resume this request")
    return entry
  }
  const url = kind === "video" ? status.video?.url : status.images?.[0]?.url
  if (status.status !== "completed" || !url) {
    console.log(`✗ ${status.status}${status.error ? `: ${JSON.stringify(status.error)}` : ""}`)
    return undefined
  }
  await download(url, file)
  console.log("✓")
  return Object.assign(entry, { url, file })
}

async function poll(requestId) {
  const deadline = Date.now() + 20 * 60_000
  let delay = 4000
  while (Date.now() < deadline) {
    await sleep(delay)
    try {
      const status = await client.status(requestId)
      if (["completed", "failed", "nsfw", "canceled"].includes(status.status)) return status
      delay = 4000
      process.stdout.write(".")
    } catch (error) {
      if (!isTransientPlatformError(error)) {
        console.log(`(${error.message})`)
        return null
      }
      delay = Math.min(delay * 2, 30_000)
    }
  }
  return null
}

/* ── assembly ─────────────────────────────────────────────────────────── */
function assembleReel(post, manifest, dir) {
  const segments = []
  const parts = post.shots.filter((s) => s.id !== "cover")
  for (let i = 0; i < parts.length; i++) {
    const shot = parts[i]
    const seconds = Math.max(1, timeSpan(shot.time) ?? shot.seconds ?? 3)
    const out = join(dir, `seg-${String(segments.length).padStart(2, "0")}.mp4`)
    const text = overlayText(shot.onScreen)
    if (shot.output === "video") {
      const clip = manifest.shots[shot.id]?.clip?.file
      if (!clip || !existsSync(clip)) return console.log(`  · reel not assembled: ${shot.label} has no clip yet`)
      ffmpeg(["-i", clip, "-t", String(seconds), ...encode(text, `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`), out])
    } else if (shot.output === "image") {
      // Consecutive image shots become one split frame (halves or stacked thirds).
      const group = [shot]
      while (parts[i + 1]?.output === "image") group.push(parts[++i])
      const files = group.map((s) => manifest.shots[s.id]?.still?.file)
      if (files.some((f) => !f || !existsSync(f))) return console.log(`  · reel not assembled: missing stills for ${shot.label}`)
      const side = group.every((s) => (s.aspect ?? "9:16") === "9:16")
      const n = group.length
      const cw = side ? Math.floor(W / n / 2) * 2 : W
      const ch = side ? H : Math.floor(H / n / 2) * 2
      const cell = `scale=${cw}:${ch}:force_original_aspect_ratio=increase,crop=${cw}:${ch}`
      const hold = String(Math.max(1, timeSpan(group[0].time) ?? 3))
      const inputs = files.flatMap((f) => ["-loop", "1", "-t", hold, "-i", f])
      const stack = n === 1 ? "[0:v]" : `${files.map((_, k) => `[c${k}]`).join("")}${side ? "hstack" : "vstack"}=inputs=${n}`
      const cells = files.map((_, k) => `[${k}:v]${cell}[c${k}]`).join(";")
      const filter = n === 1 ? `[0:v]${cell}` : `${cells};${stack}`
      ffmpeg([...inputs, "-filter_complex", `${filter},scale=${W}:${H}${drawtext(text)},fps=30,format=yuv420p`, "-t", hold, "-c:v", "libx264", "-an", out])
    } else {
      ffmpeg(["-f", "lavfi", "-i", `color=c=0x0d0e10:s=${W}x${H}:d=${seconds}`, ...encode(overlayText(shot.onScreen, true), "null"), out])
    }
    segments.push(out)
  }
  const list = join(dir, "segments.txt")
  writeFileSync(list, segments.map((s) => `file '${s.replace(/\\/g, "/")}'`).join("\n"))
  const final = join(dir, `${post.id}.mp4`)
  ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", final])
  console.log(`  ★ reel: ${final}`)
}

function encode(text, scale) {
  return ["-vf", `${scale}${drawtext(text)},fps=30,format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-an"]
}

function drawtext(text) {
  if (!text || !FONT) return ""
  const file = join(ROOT, "out", `.text-${Math.random().toString(36).slice(2)}.txt`)
  writeFileSync(file, text)
  const esc = (p) => p.replace(/\\/g, "/").replace(/:/g, "\\:")
  // Center safe zone: clear of the top 250 px and bottom 400 px.
  return `,drawtext=fontfile='${esc(FONT)}':textfile='${esc(file)}':fontsize=64:fontcolor=white:line_spacing=12:box=1:boxcolor=black@0.55:boxborderw=24:x=(w-text_w)/2:y=(h-text_h)/2-120`
}

/** On-screen text without editor notes, voiceover lines or emoji. */
function overlayText(raw, card = false) {
  if (!raw) return ""
  const cleaned = raw
    .split(" · VO:")[0]
    .replace(/\([^)]*[a-z][^)]*\)/gi, "") // editor notes, not "(214)"
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
  const pieces = card ? cleaned.split(/\s[·•]\s/) : [cleaned]
  return pieces.map((p) => wrap(p.trim(), 24)).join("\n")
}

function wrap(text, width) {
  const lines = []
  let line = ""
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > width && line) {
      lines.push(line)
      line = word
    } else line = (line + " " + word).trim()
  }
  if (line) lines.push(line)
  return lines.join("\n")
}

function timeSpan(time) {
  const m = time?.match(/([\d.]+)\s*[–-]\s*([\d.]+)/)
  return m ? Number(m[2]) - Number(m[1]) : undefined
}

function writeNotes(post, brand, dir) {
  const lines = [
    `${post.title}`,
    `${brand.name} · ${post.day} · ${post.time} CT · ${post.format}`,
    "",
    post.summary,
    "",
    ...post.shots.flatMap((s) => [
      `- ${s.label}${s.time ? ` (${s.time})` : ""} [${s.output}]`,
      ...(s.onScreen ? [`    text: ${s.onScreen}`] : []),
      ...(s.voiceover ? [`    VO: ${s.voiceover}`] : []),
    ]),
    "",
    `End card: ${brand.contact}`,
  ]
  writeFileSync(join(dir, "notes.txt"), lines.join("\n"))
}

/* ── helpers ──────────────────────────────────────────────────────────── */
function ffmpeg(argv) {
  const run = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...argv], { encoding: "utf8" })
  if (run.error) fail("ffmpeg is not installed. Windows: winget install Gyan.FFmpeg")
  if (run.status !== 0) fail(`ffmpeg failed: ${run.stderr.slice(-800)}`)
}

function mockMedia(kind, file, settings) {
  const [w, h] = String(settings.aspectRatio ?? "9:16").split(":").map(Number)
  const size = `${Math.round((720 * w) / Math.max(w, h)) & ~1}x${Math.round((720 * h) / Math.max(w, h)) & ~1}`
  if (kind === "image") ffmpeg(["-f", "lavfi", "-i", `testsrc2=s=${size}`, "-frames:v", "1", file])
  else ffmpeg(["-f", "lavfi", "-i", `testsrc2=s=${size}:d=${settings.duration ?? 4}`, "-pix_fmt", "yuv420p", file])
}

async function download(url, file) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status})`)
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
}

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}
