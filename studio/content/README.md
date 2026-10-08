# Weekly decks

Each week's content calendar becomes one file in `content/decks/`, named after
the Monday of that week (`2026-10-12.ts`) and listed in `content/decks/index.ts`.
The newest deck shows first on Home → **This Week**.

A deck is plain data (`content/types.ts`):

- **Brands** (`content/brands.ts`): name, the look added to every prompt, and the
  end-card contact line.
- **Posts**: brand, day, time (CT), reel or static, title, goal, a style line
  shared by every frame, and the shots.
- **Shots**:
  - `output: "video"`: draft a still, approve one, animate it (Kling 3.0 Pro by
    default, `clipModel: "seedance-2"` for particle/water hero shots).
  - `output: "image"`: a finished still (`stillModel` defaults to Soul 2; use
    `flux-2` for photoreal consistency, `ideogram-4` with `textInImage` for
    layouts that carry text).
  - `output: "editor"`: built in CapCut/Canva (end cards, STOP wipes, text). Phone
    numbers and logos always go here, never into a prompt.
  - `referenceFrom`: reuse an earlier shot's approved still as a Flux 2
    reference so the same home/garage appears.
  - `transitionFrom`: animate from an earlier shot's still (start frame) to this
    one (end frame), e.g. an empty lawn building into a backyard.

`pnpm test` checks that every shot in every deck plans to a valid Higgsfield
request before and after approvals.
