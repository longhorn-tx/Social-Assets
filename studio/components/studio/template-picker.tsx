/* eslint-disable @next/next/no-img-element */
"use client"

import type { KeyboardEvent, ReactNode } from "react"
import {
  Briefcase,
  Clapperboard,
  GalleryHorizontal,
  LayoutGrid,
  Megaphone,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Templates — the "what you can make" examples. A `TemplateItem` seeds the
 * prompt dock (prompt text + optional model/settings) when its Try action fires.
 * `TemplateCard` and `ExamplePresets` render them; the Explore tab on Home uses
 * `ExamplePresets`.
 */

// Preset art lives in /public/presets (16:9, the card and hero frame ratio).
const ART = {
  reel: "/presets/reel-teaser.svg",
  feed: "/presets/feed-post.svg",
  thumbnail: "/presets/youtube-thumbnail.svg",
  story: "/presets/story-announcement.svg",
  banner: "/presets/linkedin-banner.svg",
  carousel: "/presets/carousel-tips.svg",
} as const

export interface TemplateItem {
  id: string
  title: string
  subtitle: string
  /** Free-form filter category used by the picker tabs. */
  category: string
  kind: "image" | "video"
  images: [string, string, string]
  icon: LucideIcon
  /** What the Try action puts in the dock. */
  prompt: string
  /** Catalog model id to switch to, when the template needs a specific one. */
  modelId?: string
  settings?: Record<string, unknown>
}

/** Social formats: each preset picks a model and the aspect ratio the
    destination feed expects, then seeds a prompt the user edits. */
export const TEMPLATES: TemplateItem[] = [
  {
    id: "reel-teaser",
    title: "Reel / TikTok teaser",
    subtitle: "9:16 vertical video with sound",
    category: "video",
    kind: "video",
    images: [ART.reel, ART.story, ART.feed],
    icon: Clapperboard,
    prompt:
      "Vertical 9:16 teaser for a summer product launch: fast handheld push-in on the product on a sunlit rooftop, golden-hour flare, bold motion, upbeat ambient sound, last second holds on a clean frame for a caption.",
    modelId: "seedance-2.5",
    settings: { aspectRatio: "9:16", duration: 8, generateAudio: true },
  },
  {
    id: "feed-post",
    title: "Instagram feed post",
    subtitle: "Square product still, 1:1",
    category: "image",
    kind: "image",
    images: [ART.feed, ART.carousel, ART.reel],
    icon: LayoutGrid,
    prompt:
      "Square social feed photo of a skincare bottle on warm travertine, soft window light, a sprig of eucalyptus, peach and sage palette, clean negative space at the top for a headline.",
    modelId: "soul-2",
    settings: { aspectRatio: "1:1" },
  },
  {
    id: "youtube-thumbnail",
    title: "YouTube thumbnail",
    subtitle: "16:9, bold and readable small",
    category: "image",
    kind: "image",
    images: [ART.thumbnail, ART.banner, ART.feed],
    icon: MonitorPlay,
    prompt:
      '16:9 YouTube thumbnail: excited creator pointing at a glowing laptop, saturated orange and yellow background with light rays, large bold headline text reading "I TRIED IT FOR 30 DAYS", high contrast, readable at small sizes.',
    modelId: "ideogram-4",
    settings: { aspectRatio: "16:9" },
  },
  {
    id: "story-announcement",
    title: "Story announcement",
    subtitle: "9:16 still for Stories",
    category: "image",
    kind: "image",
    images: [ART.story, ART.reel, ART.carousel],
    icon: Megaphone,
    prompt:
      'Vertical 9:16 Instagram Story graphic announcing a new collection drop, violet-to-magenta gradient, glossy 3D star, big text "NEW DROP — FRIDAY", space at the bottom for a link sticker.',
    modelId: "ideogram-4",
    settings: { aspectRatio: "9:16" },
  },
  {
    id: "linkedin-banner",
    title: "LinkedIn post visual",
    subtitle: "16:9 professional key visual",
    category: "image",
    kind: "image",
    images: [ART.banner, ART.thumbnail, ART.story],
    icon: Briefcase,
    prompt:
      "Professional 16:9 LinkedIn post visual: modern glass office towers at dusk, a rising teal growth line across the sky, deep navy palette, calm confident mood, empty left third for a headline.",
    modelId: "soul-2",
    settings: { aspectRatio: "16:9" },
  },
  {
    id: "carousel-cover",
    title: "Carousel cover slide",
    subtitle: "Square typographic opener",
    category: "image",
    kind: "image",
    images: [ART.carousel, ART.feed, ART.banner],
    icon: GalleryHorizontal,
    prompt:
      'Square carousel cover slide with bold editorial typography reading "5 TIPS FOR BETTER MORNINGS", lime green background, a small sunrise illustration, a right-arrow swipe cue in the corner.',
    modelId: "ideogram-4",
    settings: { aspectRatio: "1:1" },
  },
]

function gradientFromSeed(seed: string): string {
  let hash = 0
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  const start = hash % 360
  const end = (start + 36 + ((hash >>> 8) % 72)) % 360
  return `linear-gradient(135deg, hsl(${start} 62% 52%) 0%, hsl(${end} 76% 27%) 100%)`
}

function GradientBadge({ as: Glyph, seed }: { as: LucideIcon; seed: string }) {
  return (
    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-white/25 text-white shadow-[0_5px_3px_rgba(0,0,0,0.08),inset_0_3px_5px_rgba(255,255,255,0.24)]">
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: gradientFromSeed(seed) }}
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 mix-blend-overlay"
      />
      <Glyph className="relative size-5" />
    </span>
  )
}

const TRIPTYCH = [
  "rounded-l-2xl rounded-r-sm",
  "rounded-sm",
  "rounded-r-2xl rounded-l-sm",
] as const

export interface TemplateCardProps {
  template: TemplateItem
  variant?: "single" | "triptych"
  onTry: (template: TemplateItem) => void
  tryLabel?: ReactNode
}

export function TemplateCard({
  template,
  variant = "single",
  onTry,
  tryLabel = "Try",
}: TemplateCardProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onTry(template)
    }
  }
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Use template: ${template.title}`}
      className="relative flex cursor-pointer flex-col gap-2 rounded-[20px] bg-white/5 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-[transform,background-color] duration-200 hover:z-[1] hover:-translate-y-0.5 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:hover:translate-y-0"
      onClick={() => onTry(template)}
      onKeyDown={onKeyDown}
    >
      <div className="flex h-60 items-stretch gap-1.5">
        {variant === "triptych" ? (
          template.images.map((src, i) => (
            <div
              key={i}
              className={cn(
                "min-w-0 flex-1 overflow-hidden border border-white/10",
                TRIPTYCH[i]
              )}
            >
              <img
                src={src}
                alt={`${template.title} — shot ${i + 1}`}
                className="size-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={template.images[0]}
              alt={template.title}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 px-2 py-1">
        <GradientBadge as={template.icon} seed={template.id} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">
            {template.title}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {template.subtitle}
          </span>
        </div>
        <Button
          size="sm"
          className="rounded-full font-semibold"
          onClick={(event) => {
            event.stopPropagation()
            onTry(template)
          }}
        >
          {tryLabel}
        </Button>
      </div>
    </div>
  )
}

export interface ExamplePresetsProps {
  items: TemplateItem[]
  onUse: (template: TemplateItem) => void
  tryLabel?: ReactNode
  className?: string
}

/** The Explore grid: two columns of `TemplateCard`s. */
export function ExamplePresets({
  items,
  onUse,
  tryLabel = "Try",
  className = "w-full max-w-[900px]",
}: ExamplePresetsProps) {
  return (
    <div
      className={cn("grid w-full grid-cols-1 gap-5 sm:grid-cols-2", className)}
    >
      {items.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          onTry={onUse}
          tryLabel={tryLabel}
        />
      ))}
    </div>
  )
}
