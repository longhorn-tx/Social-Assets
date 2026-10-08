"use client"

import { useCallback, useEffect, useState } from "react"

import { cancelGeneration, submitGeneration } from "@/generation/actions"
import { getModel } from "@/generation/catalog"
import type { GenerationPlane } from "@/generation/catalog"
import type { GenerationStatus } from "@/generation/platform"
import { stopWatching, watchRequest } from "@/generation/poll"

import {
  aspectFromSettings,
  loadHistory,
  saveHistory,
  type RunRecord,
} from "./history"

export type SubmitOutcome =
  | { ok: true; record: RunRecord }
  | { ok: false; error: string; missingKey: boolean }

/**
 * The studio's generation controller: submits planes to the platform through
 * the server action, keeps every run in IndexedDB-backed history, and resumes
 * polls for runs that were still in flight when the page reloaded.
 */
export function useRuns() {
  const [records, setRecords] = useState<RunRecord[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback((id: string, patch: Partial<RunRecord>) => {
    setRecords((current) =>
      current.map((r) => (r.id === id ? { ...r, ...patch } : r))
    )
  }, [])

  const watch = useCallback(
    (record: RunRecord) => {
      watchRequest(record.requestId, {
        deadline: record.createdAt + 15 * 60_000,
      })
        .then((status) => update(record.id, settle(status)))
        .catch((caught: unknown) => {
          update(record.id, {
            status: "failed",
            error: caught instanceof Error ? caught.message : String(caught),
          })
        })
    },
    [update]
  )

  useEffect(() => {
    let alive = true
    void loadHistory().then((stored) => {
      if (!alive) return
      setRecords(stored)
      setLoaded(true)
      for (const record of stored)
        if (record.status === "running") watch(record)
    })
    return () => {
      alive = false
      stopWatching()
    }
  }, [watch])

  useEffect(() => {
    if (loaded) void saveHistory(records)
  }, [loaded, records])

  const submit = useCallback(
    async (
      plane: GenerationPlane,
      projectId?: string,
      submissionId?: string
    ): Promise<SubmitOutcome> => {
      setError(null)
      const model = getModel(plane.model)
      try {
        const result = await submitGeneration(plane, submissionId)
        if (!result.ok) {
          setError(result.error)
          return {
            ok: false,
            error: result.error,
            missingKey: result.missingKey === true,
          }
        }
        const queued = result.value
        // The same submission answered twice (joined on the server): one run.
        if (records.some((r) => r.requestId === queued.requestId))
          return { ok: false, error: "Already generating", missingKey: false }
        const record: RunRecord = {
          id: queued.requestId,
          requestId: queued.requestId,
          surface: model.surface,
          modelId: model.id,
          modelLabel: model.label,
          prompt: plane.prompt.text,
          settings: plane.settings,
          ...(projectId ? { projectId } : {}),
          aspect: aspectFromSettings(plane.settings),
          status: "running",
          urls: [],
          createdAt: Date.now(),
        }
        setRecords((current) => [record, ...current])
        watch(record)
        return { ok: true, record }
      } catch (caught) {
        // The action call itself failed (connection to this app dropped):
        // the platform may have queued it, so say so instead of retrying.
        const message =
          caught instanceof Error && caught.message
            ? `${caught.message}. The generation may still have been queued; check your Higgsfield dashboard before generating again.`
            : "The generation may still have been queued; check your Higgsfield dashboard before generating again."
        setError(message)
        return { ok: false, error: message, missingKey: false }
      }
    },
    [records, watch]
  )

  const cancel = useCallback(
    async (id: string) => {
      const record = records.find((r) => r.id === id)
      if (!record || record.status !== "running") return
      try {
        const result = await cancelGeneration({
          requestIds: [record.requestId],
        })
        if (!result.ok) {
          setError(`Could not cancel: ${result.error}`)
          return
        }
        update(id, { status: "failed", error: "Canceled" })
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught))
      }
    },
    [records, update]
  )

  const remove = useCallback((id: string) => {
    setRecords((current) => current.filter((r) => r.id !== id))
  }, [])

  const running = records.filter((r) => r.status === "running")

  return { records, running, loaded, error, submit, cancel, remove, setError }
}

function settle(status: GenerationStatus): Partial<RunRecord> {
  const urls = [
    ...(status.images?.map((i) => i.url) ?? []),
    ...(status.video ? [status.video.url] : []),
  ]
  if (status.status === "completed" && urls.length > 0)
    return { status: "completed", urls }
  const reason =
    status.status === "nsfw"
      ? "Blocked by the content filter"
      : status.status === "canceled"
        ? "Canceled"
        : (describeError(status.error) ??
          "The generation did not produce media")
  return { status: "failed", error: reason }
}

function describeError(error: unknown): string | undefined {
  if (typeof error === "string") return error
  if (error && typeof error === "object") {
    const detail =
      (error as { detail?: unknown; message?: unknown }).detail ??
      (error as { message?: unknown }).message
    if (typeof detail === "string") return detail
  }
  return undefined
}
