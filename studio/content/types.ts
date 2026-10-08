/**
 * Weekly content decks: brands, posts and the shots each post is built from.
 * A deck is plain data; `content/plan.ts` turns a shot into generation planes.
 */

export type StillModelId = "soul-2" | "flux-2" | "ideogram-4"
export type ClipModelId = "kling-3-pro" | "seedance-2"
export type ShotAspect = "9:16" | "3:4" | "1:1" | "16:9"

export interface Brand {
  id: string
  name: string
  /** Look appended to every prompt generated for this brand. */
  look: string
  /** Phone + site for end cards (added in the editor, never generated). */
  contact: string
}

/** `video`: still first, then animate it. `image`: a finished still.
    `editor`: built in CapCut/Canva (end cards, motion graphics, text). */
export type ShotOutput = "video" | "image" | "editor"

export interface Shot {
  id: string
  label: string
  /** Position in the edit, e.g. "0–3 s". */
  time?: string
  output: ShotOutput
  /** Seconds the shot fills in the edit; sets the clip length. */
  seconds?: number
  /** What the frame shows. For `editor` shots, what to build. */
  visual: string
  /** Camera / subject motion for the clip; defaults to `visual`. */
  motion?: string
  onScreen?: string
  voiceover?: string
  /** Defaults: Soul 2 for drafts, Flux 2 when a reference is used. */
  stillModel?: StillModelId
  /** Defaults to Kling 3.0 Pro; Seedance 2.0 for particle/water hero shots. */
  clipModel?: ClipModelId
  /** Defaults to 9:16 for video shots, 3:4 for images. */
  aspect?: ShotAspect
  /** Animate from that shot's approved still (start) to this one (end). */
  transitionFrom?: string
  /** Use that shot's approved still as a reference so the scene matches. */
  referenceFrom?: string
  /** True when the image itself carries text (Ideogram layouts). */
  textInImage?: boolean
}

export interface Post {
  id: string
  brandId: string
  /** e.g. "Tue Oct 13". */
  day: string
  /** US Central, e.g. "6:30 PM". */
  time: string
  format: "reel" | "static"
  title: string
  goal: string
  summary: string
  /** Style line shared by every frame of the post. */
  style: string
  shots: Shot[]
}

export interface Deck {
  /** Monday of the week, YYYY-MM-DD. */
  id: string
  label: string
  brands: Brand[]
  posts: Post[]
}
