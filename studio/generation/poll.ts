import { getGenerationStatuses } from "./actions"
import type { GenerationStatus, StatusResult } from "./platform"

/** Statuses the platform never moves off again. */
const TERMINAL = new Set(["completed", "failed", "nsfw", "canceled"])

export const POLL_INTERVAL_MS = 4000
/** Ceiling for the backoff after rate limits, platform errors or lost rounds. */
export const POLL_MAX_INTERVAL_MS = 30_000
export const POLL_DEADLINE_MS = 10 * 60_000
/** Rounds allowed to fail back to back before the watches are given up on. One
    dropped round must not end every generation in flight. */
const MAX_MISSES = 3

type Waiter = {
  deadline: number
  resolve: (status: GenerationStatus) => void
  reject: (reason: Error) => void
}

const waiting = new Map<string, Waiter>()
const inflight = new Map<string, Promise<GenerationStatus>>()
let timer: ReturnType<typeof setTimeout> | null = null
let polling = false
let misses = 0
/** Back-to-back rounds that hit a rate limit, platform error or no answer. */
let strain = 0

/** Delay before the next round: doubles per strained round, capped. */
export function pollDelay(strainedRounds: number): number {
  return Math.min(
    POLL_INTERVAL_MS * 2 ** Math.max(0, strainedRounds),
    POLL_MAX_INTERVAL_MS
  )
}

/** Resolves when the platform reports a terminal status for this request.
    Every request in flight is asked for together, in one server action per
    interval: Next dispatches server actions one at a time per client, so a
    poll per run would queue ahead of the next submit and the composer would
    stall again — with the lock gone and the queue doing the same work. */
export function watchRequest(
  requestId: string,
  opts?: { deadline?: number }
): Promise<GenerationStatus> {
  const existing = inflight.get(requestId)
  if (existing) return existing
  const promise = new Promise<GenerationStatus>((resolve, reject) => {
    waiting.set(requestId, {
      deadline: opts?.deadline ?? Date.now() + POLL_DEADLINE_MS,
      resolve: (status) => {
        inflight.delete(requestId)
        resolve(status)
      },
      reject: (reason) => {
        inflight.delete(requestId)
        reject(reason)
      },
    })
    schedule()
  })
  inflight.set(requestId, promise)
  return promise
}

/** Drops every watch without settling it: the studio unmounted and there is
    nobody left to hand a result to. In-flight jobs stay in history and the
    next mount starts a fresh watch. */
export function stopWatching(): void {
  if (timer !== null) clearTimeout(timer)
  timer = null
  misses = 0
  strain = 0
  waiting.clear()
  inflight.clear()
}

function schedule(): void {
  if (timer !== null || polling || waiting.size === 0) return
  timer = setTimeout(() => void round(), pollDelay(strain))
}

async function round(): Promise<void> {
  timer = null
  polling = true
  try {
    const results = await getGenerationStatuses({
      requestIds: [...waiting.keys()],
    })
    misses = 0
    let strained = false
    for (const result of results) strained = deliver(result) || strained
    strain = strained ? strain + 1 : 0
    sweep()
  } catch (caught) {
    strain++
    if (++misses < MAX_MISSES) return
    settleAll(caught instanceof Error ? caught : new Error(String(caught)))
  } finally {
    polling = false
    schedule()
  }
}

/** Settles the waiter when the answer is final. Returns true when the answer
    was a transient error (rate limit, platform hiccup): the run keeps waiting
    and the next round backs off. */
function deliver(result: StatusResult): boolean {
  const waiter = waiting.get(result.requestId)
  if (!waiter) return false
  if ("error" in result) {
    if (result.transient) return true
    waiting.delete(result.requestId)
    waiter.reject(new Error(result.error))
    return false
  }
  if (!TERMINAL.has(result.status.status)) return false
  waiting.delete(result.requestId)
  waiter.resolve(result.status)
  return false
}

/* A run the platform never finishes would otherwise hold its skeleton open for
   the rest of the session. */
function sweep(): void {
  const now = Date.now()
  for (const [requestId, waiter] of [...waiting]) {
    if (now <= waiter.deadline) continue
    waiting.delete(requestId)
    waiter.reject(
      new Error(
        "Stopped checking: Higgsfield has not finished this generation in time. It may still complete in your Higgsfield dashboard."
      )
    )
  }
}

function settleAll(reason: Error): void {
  const waiters = [...waiting.values()]
  waiting.clear()
  misses = 0
  strain = 0
  for (const waiter of waiters) waiter.reject(reason)
}
