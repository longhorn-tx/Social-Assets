import type { Deck } from "../types"
import { DECK_2026_10_12 } from "./2026-10-12"
import { DECK_2026_10_19 } from "./2026-10-19"

/** Every weekly deck, newest first. Add a file per week and list it here. */
export const DECKS: Deck[] = [DECK_2026_10_12, DECK_2026_10_19].sort((a, b) =>
  b.id.localeCompare(a.id)
)

export function getDeck(id: string): Deck | undefined {
  return DECKS.find((deck) => deck.id === id)
}
