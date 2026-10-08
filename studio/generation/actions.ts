"use server"

import { createHash } from "node:crypto"
import { cookies } from "next/headers"

import { getModel, parseSettings } from "./catalog"
import type { GenerationPlane } from "./catalog/types"
import {
  MissingCredentialsError,
  PLATFORM_KEY_COOKIE,
  PLATFORM_KEY_COOKIE_OPTIONS,
  decodeCredentials,
  encodeCredentials,
  parseCredentialInput,
} from "./credentials"
import { createPlatformClient, isTransientPlatformError } from "./platform"
import type { QueuedGeneration, StatusResult } from "./platform"
import { toPlatform } from "./to-platform"

/* Server actions return failures as values: Next.js replaces thrown error
   messages with a generic one in production, and the studio needs the reason. */
export type ActionFailure = { ok: false; error: string; missingKey?: boolean }
export type ActionResult<T = null> = { ok: true; value: T } | ActionFailure

export async function savePlatformCredentials(
  data: unknown
): Promise<ActionResult> {
  try {
    const { apiKey } = parseCredentialInput(data)
    const jar = await cookies()
    jar.set(
      PLATFORM_KEY_COOKIE,
      encodeCredentials(apiKey),
      PLATFORM_KEY_COOKIE_OPTIONS
    )
    return { ok: true, value: null }
  } catch (caught) {
    return failure(caught)
  }
}

export async function clearPlatformCredentials() {
  const jar = await cookies()
  jar.set(PLATFORM_KEY_COOKIE, "", {
    ...PLATFORM_KEY_COOKIE_OPTIONS,
    maxAge: 0,
  })
}

export async function hasPlatformCredentials() {
  return (await readStoredCredentials()) !== null
}

/** Submissions keyed by key + submission id. A repeated submit with the same
    id (double click, a replayed action) joins the first one instead of
    queueing a second paid generation. Failures are forgotten so the user can
    retry deliberately; nothing here retries a POST on its own. */
const SUBMISSION_TTL_MS = 10 * 60_000
const submissions = new Map<
  string,
  { promise: Promise<QueuedGeneration>; expires: number }
>()

export async function submitGeneration(
  plane: GenerationPlane,
  submissionId?: string
): Promise<ActionResult<QueuedGeneration>> {
  try {
    return { ok: true, value: await queueGeneration(plane, submissionId) }
  } catch (caught) {
    return failure(caught)
  }
}

async function queueGeneration(
  plane: GenerationPlane,
  submissionId?: string
): Promise<QueuedGeneration> {
  const model = getModel(plane.model)
  const parsed: GenerationPlane = {
    ...plane,
    settings: parseSettings(model, plane.settings),
  }
  const { path, body } = toPlatform(parsed)
  const credentials = await readCredentials()
  const send = () => createPlatformClient(credentials).submit(path, body)
  if (submissionId === undefined) return send()

  const id = parseSubmissionId(submissionId)
  const now = Date.now()
  for (const [key, entry] of submissions)
    if (entry.expires <= now) submissions.delete(key)
  const key = `${fingerprint(credentials.apiKey)}:${id}`
  const existing = submissions.get(key)
  if (existing) return existing.promise
  const promise = send()
  submissions.set(key, { promise, expires: now + SUBMISSION_TTL_MS })
  promise.catch(() => submissions.delete(key))
  return promise
}

/** Every request in flight, answered in one round trip. Next dispatches server
    actions one at a time per client, so a poll per run would queue ahead of the
    next submit — the fan-out belongs on this side of the call, where it is
    genuinely parallel. */
export async function getGenerationStatuses(
  data: unknown
): Promise<StatusResult[]> {
  const requestIds = parseRequestIds(data)
  let client: ReturnType<typeof createPlatformClient>
  try {
    client = createPlatformClient(await readCredentials())
  } catch (caught) {
    // No key right now (removed mid-run): keep the runs waiting for a new one.
    const error = caught instanceof Error ? caught.message : String(caught)
    return requestIds.map((requestId) => ({
      requestId,
      error,
      transient: true,
    }))
  }
  return Promise.all(
    requestIds.map(async (requestId): Promise<StatusResult> => {
      try {
        return { requestId, status: await client.status(requestId) }
      } catch (caught) {
        return {
          requestId,
          error: caught instanceof Error ? caught.message : String(caught),
          transient: isTransientPlatformError(caught),
        }
      }
    })
  )
}

export async function cancelGeneration(data: unknown): Promise<ActionResult> {
  try {
    const [requestId] = parseRequestIds(data)
    await createPlatformClient(await readCredentials()).cancel(requestId!)
    return { ok: true, value: null }
  } catch (caught) {
    return failure(caught)
  }
}

function failure(caught: unknown): ActionFailure {
  return {
    ok: false,
    error: caught instanceof Error ? caught.message : String(caught),
    ...(caught instanceof MissingCredentialsError ? { missingKey: true } : {}),
  }
}

async function readStoredCredentials() {
  const jar = await cookies()
  return decodeCredentials(jar.get(PLATFORM_KEY_COOKIE)?.value)
}

async function readCredentials() {
  const stored = await readStoredCredentials()
  if (!stored) throw new MissingCredentialsError()
  const baseUrl = process.env.HF_API_BASE_URL
  if (!baseUrl) throw new Error("Missing HF_API_BASE_URL")
  return { ...stored, baseUrl }
}

function parseRequestIds(data: unknown): string[] {
  const payload = asObject(data, "Invalid status payload")
  const requestIds = payload.requestIds
  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    throw new Error("Invalid request ids")
  }
  return requestIds.map((requestId) => {
    if (typeof requestId !== "string" || !requestId)
      throw new Error("Invalid request id")
    return requestId
  })
}

function parseSubmissionId(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9-]{8,64}$/.test(value))
    throw new Error("Invalid submission id")
  return value
}

/** Scopes the submission cache to one key without keeping the key itself. */
function fingerprint(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex").slice(0, 32)
}

function asObject(data: unknown, message: string): Record<string, unknown> {
  if (data === null || typeof data !== "object" || Array.isArray(data))
    throw new Error(message)
  return data as Record<string, unknown>
}
