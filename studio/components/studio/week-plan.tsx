"use client"

import { useState } from "react"
import { Clapperboard, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  brandFor,
  clipModel,
  clipSeconds,
  generatedShots,
  planStill,
} from "@/content/plan"
import type { Deck, Post } from "@/content/types"
import {
  estimateCost,
  formatCost,
  sumCosts,
} from "@/generation/catalog/pricing"
import { cn } from "@/lib/utils"

/** Rough cost to draft one still per shot and animate every video shot once. */
export function postEstimate(deck: Deck, post: Post) {
  const brand = brandFor(deck, post)
  return sumCosts(
    generatedShots(post).flatMap((shot) => {
      const still = planStill(post, shot, brand, () => undefined)
      const stillCost = still.ok
        ? estimateCost(still.modelId, still.plane.settings)
        : null
      if (shot.output !== "video") return [stillCost]
      return [
        stillCost,
        estimateCost(clipModel(shot), { duration: clipSeconds(shot) }),
      ]
    })
  )
}

/** "This week" on Home: the deck's posts grouped by brand, each opening its
    shot list in a project. */
export function WeekPlan({
  decks,
  onOpenPost,
}: {
  decks: Deck[]
  onOpenPost: (deck: Deck, post: Post) => void
}) {
  const [deckId, setDeckId] = useState(decks[0]?.id)
  const deck = decks.find((d) => d.id === deckId) ?? decks[0]
  if (!deck) {
    return (
      <p className="text-sm text-muted-foreground">
        No weekly deck yet. Send the week&apos;s content calendar to have it
        added.
      </p>
    )
  }

  const reels = deck.posts.filter((p) => p.format === "reel").length
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            Week of {deck.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {reels} reels · {deck.posts.length - reels} statics ·{" "}
            {deck.brands.length} brands
          </span>
        </div>
        {decks.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {decks.map((d) => (
              <Button
                key={d.id}
                size="sm"
                variant={d.id === deck.id ? "secondary" : "ghost"}
                onClick={() => setDeckId(d.id)}
              >
                {d.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {deck.brands.map((brand) => {
        const posts = deck.posts.filter((p) => p.brandId === brand.id)
        if (posts.length === 0) return null
        return (
          <section key={brand.id} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {brand.name}
            </h3>
            <ul className="flex flex-col gap-2">
              {posts.map((post) => {
                const estimate = postEstimate(deck, post)
                const shots = generatedShots(post).length
                const Icon = post.format === "reel" ? Clapperboard : ImageIcon
                return (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/5 p-3 sm:flex-nowrap"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/8"
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {post.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {post.day} · {post.time} CT ·{" "}
                        {post.format === "reel" ? "Reel" : "Static"} · {shots}{" "}
                        AI {shots === 1 ? "shot" : "shots"}
                        {estimate ? ` · ${formatCost(estimate)} est.` : ""}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenPost(deck, post)}
                    >
                      Open shot list
                    </Button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
      <p className="text-xs text-muted-foreground">
        Estimates use public list prices for one draft still per shot plus one
        clip per video shot; check open.higgsfield.ai/pricing for your rate.
      </p>
    </div>
  )
}
