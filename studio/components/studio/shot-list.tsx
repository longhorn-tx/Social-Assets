"use client"

import { useState } from "react"
import { Check, Download, Scissors } from "lucide-react"

import { GenerationTile } from "@/components/studio/generation-card"
import { Button } from "@/components/ui/button"
import {
  clipModel,
  clipSeconds,
  generatedShots,
  planClip,
  planStill,
  shotAspect,
  shotKey,
  type Approvals,
  type ShotStage,
} from "@/content/plan"
import type { Brand, Deck, Post, Shot } from "@/content/types"
import { getModel } from "@/generation/catalog"
import type { GenerationPlane } from "@/generation/catalog"
import {
  estimateCost,
  formatCost,
  type CostEstimate,
} from "@/generation/catalog/pricing"
import type { RunRecord } from "@/lib/studio/history"
import { cn } from "@/lib/utils"

export type ShotSubmit = (
  plane: GenerationPlane,
  shot: { key: string; stage: ShotStage }
) => Promise<boolean>

const ASPECT_CLASS: Record<string, string> = {
  "9:16": "aspect-[9/16]",
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
  "16:9": "aspect-video",
}

function costLabel(estimate: CostEstimate | null): string {
  return estimate ? ` · ${formatCost(estimate)}` : ""
}

/**
 * ShotList — one deck post as a checklist of shots. Each shot drafts a still
 * (Soul 2 / Flux 2 / Ideogram), the user approves one, and video shots then
 * animate the approved still (Kling 3.0 Pro or Seedance 2.0). Editor shots
 * (end cards, motion graphics) are listed so the edit is complete.
 */
export function ShotList({
  deck,
  post,
  brand,
  records,
  approvals,
  onApprove,
  onSubmit,
}: {
  deck: Deck
  post: Post
  brand: Brand
  records: RunRecord[]
  approvals: Record<string, string>
  onApprove: (shotKey: string, url: string) => void
  onSubmit: ShotSubmit
}) {
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set())
  const approved: Approvals = (id) => approvals[shotKey(deck.id, post.id, id)]
  const runsFor = (shot: Shot, stage: ShotStage) =>
    records.filter(
      (r) =>
        r.shotKey === shotKey(deck.id, post.id, shot.id) &&
        r.shotStage === stage
    )

  const run = async (id: string, task: () => Promise<unknown>) => {
    if (pending.has(id)) return
    setPending((s) => new Set(s).add(id))
    try {
      await task()
    } finally {
      setPending((s) => {
        const next = new Set(s)
        next.delete(id)
        return next
      })
    }
  }

  const draftStill = (shot: Shot) => {
    const planned = planStill(post, shot, brand, approved)
    if (!planned.ok) return Promise.resolve(false)
    return onSubmit(planned.plane, {
      key: shotKey(deck.id, post.id, shot.id),
      stage: "still",
    })
  }

  // Shots waiting on a reference approval are skipped so the scene stays matched.
  const draftable = generatedShots(post).filter(
    (shot) =>
      runsFor(shot, "still").every((r) => r.status === "failed") &&
      (!shot.referenceFrom || approved(shot.referenceFrom))
  )
  const waiting = generatedShots(post).filter(
    (shot) =>
      shot.referenceFrom &&
      !approved(shot.referenceFrom) &&
      runsFor(shot, "still").length === 0
  ).length

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white/5 p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[640px] min-w-0 flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {brand.name} · {post.day} · {post.time} CT ·{" "}
            {post.format === "reel" ? "Reel 9:16" : "Static"}
          </span>
          <h2 className="text-base font-semibold text-foreground">
            {post.title}
          </h2>
          <p className="text-xs text-muted-foreground">{post.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button
            disabled={draftable.length === 0 || pending.has("all")}
            onClick={() =>
              void run("all", async () => {
                for (const shot of draftable) {
                  if (!(await draftStill(shot))) break
                }
              })
            }
          >
            {pending.has("all")
              ? "Drafting…"
              : `Draft ${draftable.length || "all"} ${draftable.length === 1 ? "still" : "stills"}`}
          </Button>
          {waiting > 0 ? (
            <span className="text-xs text-muted-foreground">
              {waiting} more after you approve their reference still
            </span>
          ) : null}
        </div>
      </header>

      <ol className="flex flex-col gap-3">
        {post.shots.map((shot) => {
          const key = shotKey(deck.id, post.id, shot.id)
          if (shot.output === "editor") {
            return (
              <li
                key={shot.id}
                className="flex gap-3 rounded-xl border border-dashed border-white/10 p-3"
              >
                <Scissors className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {shot.label}
                    {shot.time ? (
                      <span className="text-muted-foreground">
                        {" "}
                        · {shot.time}
                      </span>
                    ) : null}
                    <span className="text-muted-foreground">
                      {" "}
                      · build in editor
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {shot.visual}
                  </span>
                  {shot.onScreen ? (
                    <span className="text-xs text-foreground">
                      Text: {shot.onScreen}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          }

          const still = planStill(post, shot, brand, approved)
          const clip =
            shot.output === "video" ? planClip(post, shot, approved) : null
          const stills = runsFor(shot, "still")
          const clips = runsFor(shot, "clip")
          const approvedUrl = approved(shot.id)
          const aspect = ASPECT_CLASS[shotAspect(shot)] ?? "aspect-[9/16]"
          const refPending =
            !!shot.referenceFrom && !approved(shot.referenceFrom)
          const stillLabel = still.ok ? getModel(still.modelId).label : ""

          return (
            <li
              key={shot.id}
              className="flex flex-col gap-3 rounded-xl bg-white/5 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex max-w-[560px] min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {shot.label}
                    {shot.time ? (
                      <span className="text-muted-foreground">
                        {" "}
                        · {shot.time}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {shot.visual}
                  </span>
                  {shot.onScreen ? (
                    <span className="text-xs text-foreground">
                      Text (add in editor): {shot.onScreen}
                    </span>
                  ) : null}
                  {shot.voiceover ? (
                    <span className="text-xs text-muted-foreground italic">
                      VO: “{shot.voiceover}”
                    </span>
                  ) : null}
                  {refPending ? (
                    <span className="text-xs text-muted-foreground">
                      Approve the reference shot first to keep the same scene.
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!still.ok || pending.has(`${key}:still`)}
                    onClick={() =>
                      void run(`${key}:still`, () => draftStill(shot))
                    }
                  >
                    {shot.output === "video" ? "Draft still" : "Generate image"}
                    {still.ok
                      ? ` · ${stillLabel}${costLabel(estimateCost(still.modelId, still.plane.settings))}`
                      : ""}
                  </Button>
                  {shot.output === "video" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!clip?.ok || pending.has(`${key}:clip`)}
                      title={clip && !clip.ok ? clip.reason : undefined}
                      onClick={() =>
                        void run(`${key}:clip`, async () => {
                          const planned = planClip(post, shot, approved)
                          if (planned.ok)
                            await onSubmit(planned.plane, {
                              key,
                              stage: "clip",
                            })
                        })
                      }
                    >
                      Animate · {getModel(clipModel(shot)).label}{" "}
                      {clipSeconds(shot)} s
                      {costLabel(
                        estimateCost(clipModel(shot), {
                          duration: clipSeconds(shot),
                        })
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>

              {stills.length > 0 || clips.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {stills.map((record) => {
                    const url = record.urls[0]
                    const isApproved = url !== undefined && url === approvedUrl
                    return (
                      <GenerationTile
                        key={record.id}
                        className={cn(
                          "w-24 shrink-0 rounded-xl",
                          aspect,
                          isApproved && "ring-2 ring-primary"
                        )}
                        state={
                          record.status === "running"
                            ? "generating"
                            : record.status === "failed" || !url
                              ? "failed"
                              : "ready"
                        }
                        generatingLabel="Still"
                        failureLabel={record.error}
                        src={url}
                        alt={`${shot.label} still`}
                        generation={
                          url
                            ? {
                                src: url,
                                mediaType: "image",
                                prompt: record.prompt,
                                model: record.modelLabel,
                                createdAt: record.createdAt,
                                settings: record.settings,
                              }
                            : undefined
                        }
                        actions={
                          url
                            ? [
                                {
                                  id: "approve",
                                  label: isApproved
                                    ? "Approved still"
                                    : "Use this still",
                                  icon: Check,
                                  onSelect: () => onApprove(key, url),
                                },
                                {
                                  id: "download",
                                  label: "Download",
                                  icon: Download,
                                },
                              ]
                            : undefined
                        }
                      >
                        {isApproved ? (
                          <span className="pointer-events-none absolute bottom-1.5 left-1.5 z-[2] rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            Approved
                          </span>
                        ) : null}
                      </GenerationTile>
                    )
                  })}
                  {clips.map((record) => {
                    const url = record.urls[0]
                    return (
                      <GenerationTile
                        key={record.id}
                        className="aspect-[9/16] w-24 shrink-0 rounded-xl"
                        state={
                          record.status === "running"
                            ? "generating"
                            : record.status === "failed" || !url
                              ? "failed"
                              : "ready"
                        }
                        generatingLabel="Clip"
                        failureLabel={record.error}
                        media={
                          url ? (
                            <video
                              src={url}
                              muted
                              playsInline
                              preload="metadata"
                              className="absolute inset-0 size-full object-cover"
                            />
                          ) : undefined
                        }
                        alt={`${shot.label} clip`}
                        generation={
                          url
                            ? {
                                src: url,
                                mediaType: "video",
                                prompt: record.prompt,
                                model: record.modelLabel,
                                createdAt: record.createdAt,
                                settings: record.settings,
                              }
                            : undefined
                        }
                        actions={
                          url
                            ? [
                                {
                                  id: "download",
                                  label: "Download",
                                  icon: Download,
                                },
                              ]
                            : undefined
                        }
                      />
                    )
                  })}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
