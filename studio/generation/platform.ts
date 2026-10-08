import { toAuthorizationHeader } from "./credentials"
import { parseUploadTicket, requireUploadContentType } from "./upload-contract"
import type { UploadTicket } from "./upload-contract"

const UPLOAD_PATH = "/files/generate-upload-url"
const MODEL_ID = /^[a-z0-9][a-z0-9._/-]*$/i

export class PlatformError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(messageFromBody(status, body))
    this.name = "PlatformError"
    this.status = status
    this.body = body
  }
}

/** No HTTP answer arrived (network failure or timeout). For a submit this is
    ambiguous: the platform may still have queued the generation. */
export class PlatformUnreachableError extends Error {
  constructor(method: string, timedOut: boolean) {
    super(
      method === "POST"
        ? timedOut
          ? "Higgsfield did not answer in time, so this generation may or may not have been queued. Check your Higgsfield dashboard before generating again."
          : "Could not reach Higgsfield, so this generation may or may not have been queued. Check your Higgsfield dashboard before generating again."
        : timedOut
          ? "Higgsfield did not answer in time."
          : "Could not reach Higgsfield."
    )
    this.name = "PlatformUnreachableError"
  }
}

/** Worth asking again later: rate limits, platform hiccups, no answer. */
export function isTransientPlatformError(error: unknown): boolean {
  if (error instanceof PlatformUnreachableError) return true
  return (
    error instanceof PlatformError &&
    (error.status === 408 || error.status === 429 || error.status >= 500)
  )
}

export type QueuedGeneration = {
  status: string
  requestId: string
  statusUrl: string
  cancelUrl: string
}

export type GenerationStatus = {
  status: string
  requestId: string
  images?: Array<{ url: string }>
  video?: { url: string }
  error?: unknown
}

/** One request's answer inside a batched status poll. A request that errors
    carries its reason alone, so it cannot lose the answers standing beside it. */
export type StatusResult =
  | { requestId: string; status: GenerationStatus }
  | { requestId: string; error: string; transient: boolean }

export type PlatformClientOptions = {
  apiKey: string
  baseUrl: string
  fetch?: typeof fetch
  /** Per-request timeout; defaults to REQUEST_TIMEOUT_MS. */
  timeoutMs?: number
}

export const REQUEST_TIMEOUT_MS = 60_000

export function isModelId(model: string): boolean {
  return MODEL_ID.test(model) && !model.includes("..")
}

export function createPlatformClient(options: PlatformClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, "")
  const fetchImpl = options.fetch ?? fetch
  const auth = toAuthorizationHeader(options.apiKey)
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS

  async function send(
    method: "GET" | "POST",
    path: string,
    body?: Record<string, unknown>
  ) {
    const url = `${baseUrl}${path}`
    console.info("[platform] request", { method, url, body: body ?? null })
    let response: Response
    try {
      response = await fetchImpl(url, {
        method,
        headers: {
          Authorization: auth,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (caught) {
      const timedOut =
        caught instanceof Error &&
        (caught.name === "TimeoutError" || caught.name === "AbortError")
      console.warn("[platform] no response", { method, url, timedOut })
      throw new PlatformUnreachableError(method, timedOut)
    }

    const payload = await readJson(response)
    // Signed upload URLs are credentials; do not write them to logs.
    console.info("[platform] response", {
      method,
      url,
      status: response.status,
      ...(path === UPLOAD_PATH ? {} : { body: payload }),
    })
    if (!response.ok) throw new PlatformError(response.status, payload)
    return payload
  }

  return {
    async createUpload(contentType: unknown): Promise<UploadTicket> {
      const type = requireUploadContentType(contentType)
      return parseUploadTicket(
        await send("POST", UPLOAD_PATH, { content_type: type }),
        type
      )
    },
    async submit(
      model: string,
      input: Record<string, unknown>
    ): Promise<QueuedGeneration> {
      if (!isModelId(model))
        throw new PlatformError(400, { detail: "Invalid model" })
      return mapQueued(await send("POST", `/${model}`, input))
    },
    async status(requestId: string): Promise<GenerationStatus> {
      if (!requestId)
        throw new PlatformError(400, { detail: "Missing request id" })
      return mapStatus(
        await send("GET", `/requests/${encodeURIComponent(requestId)}/status`)
      )
    },
    /** Queued requests only; the platform answers 202 and the status turns "canceled". */
    async cancel(requestId: string): Promise<void> {
      if (!requestId)
        throw new PlatformError(400, { detail: "Missing request id" })
      await send(
        "POST",
        `/requests/${encodeURIComponent(requestId)}/cancel`,
        {}
      )
    },
  }
}

function mapQueued(payload: unknown): QueuedGeneration {
  const data = asRecord(payload)
  const requestId = stringField(data, "request_id")
  if (!requestId)
    throw new PlatformError(502, {
      detail: "Platform response missing request_id",
    })
  return {
    status: stringField(data, "status") ?? "queued",
    requestId,
    statusUrl: stringField(data, "status_url") ?? "",
    cancelUrl: stringField(data, "cancel_url") ?? "",
  }
}

function mapStatus(payload: unknown): GenerationStatus {
  const data = asRecord(payload)
  const requestId = stringField(data, "request_id") ?? ""
  const images = Array.isArray(data.images)
    ? data.images.flatMap((item) => {
        const url = asRecord(item).url
        return typeof url === "string" ? [{ url }] : []
      })
    : undefined
  const videoUrl = asRecord(data.video).url

  return {
    status: stringField(data, "status") ?? "unknown",
    requestId,
    ...(images?.length ? { images } : {}),
    ...(typeof videoUrl === "string" ? { video: { url: videoUrl } } : {}),
    ...(data.error !== undefined ? { error: data.error } : {}),
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function stringField(
  value: Record<string, unknown>,
  key: string
): string | undefined {
  const field = value[key]
  return typeof field === "string" ? field : undefined
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function messageFromBody(status: number, body: unknown): string {
  if (status === 401 || status === 403)
    return "Higgsfield rejected the API key. Open Manage API key in the sidebar and replace it with a key copied from open.higgsfield.ai."
  if (status === 429)
    return "Higgsfield rate limit reached. Wait a moment, then try again."
  const detail = describeDetail(asRecord(body).detail)
  if (detail) return detail
  return `Higgsfield request failed (${status})`
}

/** `detail` is a string, or a list of validation issues `{ loc, msg }`. */
function describeDetail(detail: unknown): string | undefined {
  if (typeof detail === "string") return detail || undefined
  if (!Array.isArray(detail)) return undefined
  const issues = detail.flatMap((item) => {
    const record = asRecord(item)
    if (typeof record.msg !== "string") return []
    const loc = Array.isArray(record.loc)
      ? record.loc.filter((part) => part !== "body").join(".")
      : ""
    return [loc ? `${loc}: ${record.msg}` : record.msg]
  })
  return issues.length ? issues.join("; ") : undefined
}
