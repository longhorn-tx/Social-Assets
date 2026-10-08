import { create } from "zustand"
import { persist } from "zustand/middleware"

import { browserStorage } from "@/generation/stores/browser-storage"

type PlannerState = {
  /** Brand whose look is added to free-form dock prompts; null = none. */
  brandId: string | null
  /** Approved still URL per shot key (deck/post/shot). */
  approvals: Record<string, string>
  /** Project that holds each post's generations, per post key (deck/post). */
  postProjects: Record<string, string>
  setBrand: (brandId: string | null) => void
  approve: (shotKey: string, url: string) => void
  linkProject: (postKey: string, projectId: string) => void
}

/** Weekly-deck progress, kept in this browser like history and projects. */
export const usePlanner = create<PlannerState>()(
  persist(
    (set) => ({
      brandId: null,
      approvals: {},
      postProjects: {},
      setBrand: (brandId) => set({ brandId }),
      approve: (shotKey, url) =>
        set((s) => ({ approvals: { ...s.approvals, [shotKey]: url } })),
      linkProject: (postKey, projectId) =>
        set((s) => ({
          postProjects: { ...s.postProjects, [postKey]: projectId },
        })),
    }),
    { name: "hf.planner.v1", storage: browserStorage() }
  )
)
