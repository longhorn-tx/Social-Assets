import type { Shot } from "../types"

/** Shorthands for writing deck files. */

export const video = (
  id: string,
  label: string,
  time: string,
  seconds: number,
  visual: string,
  extra: Partial<Shot> = {}
): Shot => ({ id, label, time, seconds, output: "video", visual, ...extra })

export const image = (
  id: string,
  label: string,
  visual: string,
  extra: Partial<Shot> = {}
): Shot => ({ id, label, output: "image", visual, ...extra })

export const edit = (
  id: string,
  label: string,
  time: string,
  visual: string,
  onScreen: string
): Shot => ({ id, label, time, output: "editor", visual, onScreen })
