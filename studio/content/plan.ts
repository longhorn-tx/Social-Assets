import type { GenerationPlane, MediaItem } from "../generation/catalog/types"
import type {
  Brand,
  ClipModelId,
  Deck,
  Post,
  Shot,
  ShotAspect,
  StillModelId,
} from "./types"

/** Approved still URL per shot id within one post. */
export type Approvals = (shotId: string) => string | undefined

export type ShotStage = "still" | "clip"

export function postKey(deckId: string, postId: string): string {
  return `${deckId}/${postId}`
}

export function shotKey(
  deckId: string,
  postId: string,
  shotId: string
): string {
  return `${deckId}/${postId}/${shotId}`
}

export function brandFor(deck: Deck, post: Post): Brand {
  const brand = deck.brands.find((b) => b.id === post.brandId)
  if (!brand) throw new Error(`Unknown brand ${post.brandId} in ${post.id}`)
  return brand
}

export function shotAspect(shot: Shot): ShotAspect {
  return shot.aspect ?? (shot.output === "video" ? "9:16" : "3:4")
}

/** Shots the AI generates (editor shots are built in CapCut/Canva). */
export function generatedShots(post: Post): Shot[] {
  return post.shots.filter((shot) => shot.output !== "editor")
}

export type PlannedRequest =
  | { ok: true; modelId: string; plane: GenerationPlane }
  | { ok: false; reason: string }

/** The still for a shot: Soul 2 drafts, Flux 2 when a reference keeps the
    scene consistent, Ideogram for layouts that carry text. */
export function planStill(
  post: Post,
  shot: Shot,
  brand: Brand,
  approved: Approvals
): PlannedRequest {
  if (shot.output === "editor")
    return { ok: false, reason: "Built in the editor" }
  const reference = shot.referenceFrom
    ? approved(shot.referenceFrom)
    : undefined
  const modelId: StillModelId =
    reference && shot.stillModel !== "ideogram-4"
      ? "flux-2"
      : (shot.stillModel ?? "soul-2")
  const aspectRatio = shotAspect(shot)
  const media: MediaItem[] =
    reference && modelId !== "soul-2"
      ? [{ id: reference, url: reference, role: "reference", kind: "image" }]
      : []
  const text = [
    `${shot.visual}.`,
    reference
      ? "Keep the same home, layout, materials and camera angle as the reference image."
      : "",
    post.style,
    brand.look,
    shot.textInImage
      ? "Render the quoted text exactly, spelled correctly."
      : "No text, no logos, no watermarks.",
  ]
    .filter(Boolean)
    .join(" ")
  return {
    ok: true,
    modelId,
    plane: {
      model: modelId,
      prompt: { text },
      media: media.length ? { reference: media } : {},
      settings:
        modelId === "soul-2"
          ? {
              aspectRatio,
              resolution: "1080p",
              batchSize: "1",
              enhancePrompt: false,
            }
          : { aspectRatio, resolution: "2k" },
    },
  }
}

const CLIP_LIMITS: Record<ClipModelId, { min: number; max: number }> = {
  "kling-3-pro": { min: 3, max: 15 },
  "seedance-2": { min: 4, max: 15 },
}

export function clipModel(shot: Shot): ClipModelId {
  return shot.clipModel ?? "kling-3-pro"
}

export function clipSeconds(shot: Shot): number {
  const { min, max } = CLIP_LIMITS[clipModel(shot)]
  return Math.min(max, Math.max(min, Math.ceil(shot.seconds ?? min)))
}

/** Image-to-video from the approved still. A transition shot animates from
    the previous shot's still (start frame) to this one (end frame). */
export function planClip(
  post: Post,
  shot: Shot,
  approved: Approvals
): PlannedRequest {
  if (shot.output !== "video")
    return { ok: false, reason: "Only video shots are animated" }
  const still = approved(shot.id)
  if (!still)
    return { ok: false, reason: "Approve a still for this shot first" }
  const modelId = clipModel(shot)
  const from = shot.transitionFrom ? approved(shot.transitionFrom) : undefined
  if (shot.transitionFrom && !from) {
    const source = post.shots.find((s) => s.id === shot.transitionFrom)
    return {
      ok: false,
      reason: `Approve a still for "${source?.label ?? shot.transitionFrom}" first`,
    }
  }
  // Seedance 2.0 takes a start frame only; transitions stay on Kling.
  const transition = from !== undefined && modelId === "kling-3-pro"
  const media: MediaItem[] = transition
    ? [
        { id: `${from}#start`, url: from, role: "start", kind: "image" },
        { id: `${still}#end`, url: still, role: "end", kind: "image" },
      ]
    : [{ id: `${still}#start`, url: still, role: "start", kind: "image" }]
  const text = [
    `${shot.motion ?? shot.visual}.`,
    transition
      ? "Transform smoothly from the start image into the end image with the camera locked in place."
      : "Animate the start image; keep its framing, subject and lighting.",
    post.style,
  ].join(" ")
  const duration = clipSeconds(shot)
  return {
    ok: true,
    modelId,
    plane: {
      model: modelId,
      prompt: { text },
      media: {
        start: media.filter((m) => m.role === "start"),
        ...(transition ? { end: media.filter((m) => m.role === "end") } : {}),
      },
      settings:
        modelId === "kling-3-pro"
          ? { aspectRatio: "9:16", duration, sound: false }
          : {
              aspectRatio: "9:16",
              duration,
              resolution: "1080p",
              generateAudio: false,
            },
    },
  }
}
