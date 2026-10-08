/**
 * Rough list-price estimates, USD. Higgsfield bills video per second of
 * output and images per image; rates move with resolution, audio and
 * promotions, so the UI always labels these as estimates. Source: public
 * snippets of open.higgsfield.ai/pricing and API guides (Oct 2026), not
 * verified against an account. `from` marks a lowest-tier starting rate.
 */
type Rate = { unit: "second" | "image"; usd: number; from?: boolean }

const RATES: Record<string, Rate> = {
  "soul-2": { unit: "image", usd: 0.0032 },
  "z-image-turbo": { unit: "image", usd: 0.015 },
  "ideogram-4": { unit: "image", usd: 0.03 },
  "recraft-4.1": { unit: "image", usd: 0.035 },
  "qwen-image-3": { unit: "image", usd: 0.04 },
  "grok-imagine-2": { unit: "image", usd: 0.04, from: true },
  "seedance-2.5": { unit: "second", usd: 0.2057 },
  "seedance-2": { unit: "second", usd: 0.141, from: true },
  "kling-3-pro": { unit: "second", usd: 0.084, from: true },
  "kling-3-4k": { unit: "second", usd: 0.42 },
  "kling-o3": { unit: "second", usd: 0.084, from: true },
  "kling-2.6": { unit: "second", usd: 0.07, from: true },
  "wan-3-prime": { unit: "second", usd: 0.068, from: true },
  "minimax-h3": { unit: "second", usd: 0.13 },
  "ltx-2.5-pro": { unit: "second", usd: 0.17 },
  "pixverse-6": { unit: "second", usd: 0.115 },
}

export type CostEstimate = { usd: number; from: boolean }

export function estimateCost(
  modelId: string,
  settings: Record<string, unknown>
): CostEstimate | null {
  const rate = RATES[modelId]
  if (!rate) return null
  if (rate.unit === "image") {
    const batch = Number(settings.batchSize ?? 1)
    return { usd: rate.usd * (batch > 0 ? batch : 1), from: !!rate.from }
  }
  const seconds = settings.duration
  if (typeof seconds !== "number" || seconds <= 0) return null
  return { usd: rate.usd * seconds, from: !!rate.from }
}

export function formatCost(estimate: CostEstimate): string {
  const amount =
    estimate.usd < 0.1 ? estimate.usd.toFixed(3) : estimate.usd.toFixed(2)
  return `${estimate.from ? "from " : "≈"}$${amount}`
}

export function sumCosts(
  estimates: (CostEstimate | null)[]
): CostEstimate | null {
  const known = estimates.filter((e): e is CostEstimate => e !== null)
  if (known.length === 0) return null
  return {
    usd: known.reduce((total, e) => total + e.usd, 0),
    from: known.some((e) => e.from) || known.length < estimates.length,
  }
}
