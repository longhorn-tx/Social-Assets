import type { Deck } from "../types"
import { DECK_2026_10_12 } from "./2026-10-12"

/** Every weekly deck, newest first. Add a file per week and list it here. */
export const DECKS: Deck[] = [DECK_2026_10_12].sort((a, b) =>
  b.id.localeCompare(a.id)
)

export function getDeck(id: string): Deck | undefined {
  return DECKS.find((deck) => deck.id === id)
}
