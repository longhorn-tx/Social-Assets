import { BRANDS } from "../brands"
import type { Deck, Shot } from "../types"

/* Week of Oct 12–18, 2026, transcribed from the weekly content calendar.
   On-screen text, phone numbers and logos are added in the editor. */

const video = (
  id: string,
  label: string,
  time: string,
  seconds: number,
  visual: string,
  extra: Partial<Shot> = {}
): Shot => ({ id, label, time, seconds, output: "video", visual, ...extra })

const image = (
  id: string,
  label: string,
  visual: string,
  extra: Partial<Shot> = {}
): Shot => ({ id, label, output: "image", visual, ...extra })

const edit = (
  id: string,
  label: string,
  time: string,
  visual: string,
  onScreen: string
): Shot => ({ id, label, time, output: "editor", visual, onScreen })

const LONGHORN_REEL_STYLE =
  "Photorealistic, North Texas brick home, autumn golden-hour light, warm tones, cinematic shallow depth of field, vertical 9:16, no visible brand logos on appliances, no close-up faces."
const LONGHORN_BUILD_STYLE =
  "Photorealistic, the same two-story red brick DFW home and the same fixed high drone-style camera angle, warm cinematic grade, vertical 9:16."
const AEB_STYLE =
  "Photorealistic, cinematic, shallow depth of field, real single-story Texas brick home, vertical 9:16."
const ACC_STYLE =
  "Photorealistic, clean two-car Texas garage, bright overhead LED lighting, crisp detail, vertical 9:16."
const INSULATION_STYLE =
  "Photorealistic, real DFW home and attic, headlamp and work-light lighting in the attic, crisp detail, vertical 9:16."
const HOMESTOP_STYLE =
  "Photorealistic, the same single-story Texas brick home throughout, bright sunny daylight, upbeat, vertical 9:16."

export const DECK_2026_10_12: Deck = {
  id: "2026-10-12",
  label: "Oct 12–18, 2026",
  brands: BRANDS,
  posts: [
    /* ── Longhorn ─────────────────────────────────────────────────────── */
    {
      id: "longhorn-grill-by-spring",
      brandId: "longhorn",
      day: "Tue Oct 13",
      time: "6:30 PM",
      format: "reel",
      title: "Build It This Winter, Grill It By Spring",
      goal: "Outdoor kitchen consultations; push the new blog",
      summary:
        "30 s reel: four outdoor-kitchen planning steps, ending on 'start in October'. Voiceover + burned-in captions, warm acoustic track.",
      style: LONGHORN_REEL_STYLE,
      shots: [
        video(
          "hook",
          "Hook",
          "0–3 s",
          3,
          "Close-up of a stainless built-in grill lid opening, steam and smoke curling up, under a cedar-beamed covered patio at golden hour",
          {
            motion: "Slow push-in as the lid opens and smoke curls up",
            clipModel: "seedance-2",
            onScreen: "Stop picking the grill first.",
            voiceover:
              "Planning an outdoor kitchen? Don't start with the grill.",
          }
        ),
        video(
          "location",
          "Step 1 · Location",
          "3–8 s",
          5,
          "Overhead drone shot of a DFW backyard with an empty concrete patio and a seating area, late afternoon sun low in the west",
          {
            motion: "Slow overhead drift across the patio",
            onScreen: "1. Location: wind + afternoon sun",
            voiceover:
              "First, where it sits. Let the south wind carry smoke away from your seats, and keep it out of the west sun.",
          }
        ),
        video(
          "surfaces",
          "Step 2 · Surfaces",
          "8–13 s",
          5,
          "Macro shot of a hand sliding across a light granite countertop beside brushed stainless cabinet doors, soft autumn light, a few fallen leaves",
          {
            onScreen: "2. Surfaces that survive 100°F + freezes",
            voiceover:
              "Second, surfaces. Light granite, porcelain or sealed concrete, with stainless cabinets.",
          }
        ),
        video(
          "fuel-flame",
          "Step 3 · Fuel (flame)",
          "13–16 s",
          3,
          "Side view of a blue gas flame igniting under grill grates",
          {
            onScreen: "3. Fuel: natural gas, propane or electric",
            voiceover:
              "Third, fuel. Gas, propane or electric, and remember the gas line from the meter is yours.",
          }
        ),
        video(
          "fuel-trench",
          "Step 3 · Fuel (gas line)",
          "16–18 s",
          3,
          "A shallow trench in a backyard with a yellow gas pipe being laid in it, autumn light"
        ),
        video(
          "permits",
          "Step 4 · Permits",
          "18–22 s",
          4,
          "Clipboard with a city permit form and a rolled site plan on a patio table, a pen resting on it, shallow focus",
          {
            motion: "Gentle rack focus from the pen to the site plan",
            onScreen: "4. Permits + HOA, before anything is built",
            voiceover:
              "Fourth, permits and your HOA. Sort them out before anything goes in the ground.",
          }
        ),
        video(
          "payoff",
          "Payoff",
          "22–27 s",
          5,
          "Wide twilight shot of a finished L-shaped stone outdoor kitchen under a covered patio, string lights on, a family at a table seen from behind, football game on an outdoor TV, fire bowl glowing",
          {
            motion: "Slow dolly out revealing the whole kitchen",
            onScreen: "Start in October. Cook by spring.",
            voiceover: "Start in October, and it's ready for spring cookouts.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "27–30 s",
          "Dark background (#0d0e10), Longhorn logo centered, subtle warm light sweep",
          "Free design visit · (214) 251-4928 · longhorntx.com"
        ),
      ],
    },
    {
      id: "longhorn-see-before-you-build",
      brandId: "longhorn",
      day: "Thu Oct 15",
      time: "12:00 PM",
      format: "static",
      title: "See Your Backyard Before You Build It",
      goal: "Uploads to the free AI design tool",
      summary:
        "Before/after split promoting aidesign.longhorntx.com. Generate both halves from the same angle, then build the split, slider handle and text in Canva (4:5 and 9:16).",
      style:
        "Photorealistic, the same two-story red brick Dallas–Fort Worth suburban home's backyard from the same camera angle, high detail, no people, no text.",
      shots: [
        image(
          "before",
          "BEFORE half",
          "A plain, slightly patchy grass lawn, bare concrete slab by the back door, wooden privacy fence, flat midday light"
        ),
        image(
          "after",
          "AFTER half",
          "The same yard at blue hour with a glowing rectangular pool and raised spa, travertine deck, a cedar-beamed covered patio with an outdoor kitchen island, a gas fire bowl, layered landscaping and warm uplighting on trees",
          {
            referenceFrom: "before",
            onScreen:
              "See your backyard before you build it. · Upload 1 photo. See what it could become. Free. · aidesign.longhorntx.com",
          }
        ),
      ],
    },
    {
      id: "longhorn-one-team",
      brandId: "longhorn",
      day: "Sat Oct 17",
      time: "10:00 AM",
      format: "reel",
      title: "One Backyard. One Team.",
      goal: "Brand awareness: empty lawn to complete backyard",
      summary:
        "25 s transformation: the lawn builds itself layer by layer from one fixed angle, then a Texas fall day. Beat-synced cuts, no voiceover.",
      style: LONGHORN_BUILD_STYLE,
      shots: [
        video(
          "lawn",
          "Plain lawn",
          "0–2 s",
          3,
          "High-angle shot of a plain, flat grass backyard behind a two-story red brick home, bare concrete slab, wooden fence, overcast flat light",
          { onScreen: "This was a plain lawn." }
        ),
        video(
          "pool",
          "Pool & spa",
          "2–5 s",
          3,
          "Same angle and same yard: a rectangular gunite pool with a raised spa and travertine deck, water sparkling in midday sun",
          {
            stillModel: "flux-2",
            referenceFrom: "lawn",
            transitionFrom: "lawn",
            onScreen: "Pool & spa",
          }
        ),
        video(
          "cover",
          "Cover + kitchen",
          "5–8 s",
          3,
          "Same angle: the pool yard now also has a cedar-beamed covered patio attached to the house, with a stone outdoor kitchen island and built-in grill beneath it",
          {
            stillModel: "flux-2",
            referenceFrom: "pool",
            transitionFrom: "pool",
            onScreen: "Covered patio + outdoor kitchen",
          }
        ),
        video(
          "fire",
          "Fire + stone",
          "8–11 s",
          3,
          "Same angle: a stone-faced raised wall with a gas fire bowl and a paver walkway added beside the pool",
          {
            stillModel: "flux-2",
            referenceFrom: "cover",
            transitionFrom: "cover",
            onScreen: "Fire features + hardscape",
          }
        ),
        video(
          "finish",
          "Landscaping + lighting",
          "11–14 s",
          3,
          "Same angle at blue hour: lush layered planting, mature trees uplit, pool glowing, string lights on",
          {
            stillModel: "flux-2",
            referenceFrom: "fire",
            transitionFrom: "fire",
            onScreen: "Landscaping + lighting",
          }
        ),
        video(
          "morning",
          "Morning",
          "14–17 s",
          3,
          "Ground-level close shot: a coffee mug steaming on a table under the patio cover, morning sun through cedar beams, pool beyond",
          { onScreen: "Morning coffee ☕" }
        ),
        video(
          "evening",
          "Evening",
          "17–21 s",
          4,
          "Wide evening shot: friends seen from behind around the fire bowl, football game on an outdoor TV under the cover, burgers on the grill, warm glow",
          { onScreen: "Football by the fire 🏈" }
        ),
        edit(
          "cta",
          "CTA end card",
          "21–25 s",
          "Dark background (#0d0e10), Longhorn logo, text animating in",
          "One design. One team. Since 1984. Free design visit · (214) 251-4928"
        ),
      ],
    },

    /* ── American Eagle Builders ──────────────────────────────────────── */
    {
      id: "aeb-window-signs",
      brandId: "aeb",
      day: "Tue Oct 13",
      time: "6:30 PM",
      format: "reel",
      title: "3 Signs Your Windows Are Costing You Money",
      goal: "Reach + estimate requests before winter",
      summary:
        "25 s checklist reel: drafts, fog between panes, a stuck window, then the new energy-efficient window. Upbeat acoustic, optional voiceover.",
      style: AEB_STYLE,
      shots: [
        video(
          "hook",
          "Hook · candle test",
          "0–3 s",
          3,
          "Close-up of a hand holding a lit candle near the edge of an old, worn white aluminum window inside a Texas home, the flame flickering sideways from a draft, soft evening light, cozy living room blurred behind",
          {
            motion: "Slow push-in while the flame bends sideways",
            onScreen: "Is your window stealing your money?",
            voiceover:
              "If your candle does this near the window… keep watching.",
          }
        ),
        video(
          "drafts",
          "Sign 1 · Drafts",
          "3–7 s",
          4,
          "Same old window, wide shot: a woman in a sweater pulls a blanket tighter on the couch next to it, looking at the thermostat on the wall, cool blue tint",
          {
            motion: "Handheld, natural movement",
            onScreen: "Sign 1: You feel a draft",
            voiceover: "Sign one: you feel a draft even with the window shut.",
          }
        ),
        video(
          "fog",
          "Sign 2 · Fog",
          "7–11 s",
          4,
          "Macro shot of fog and water droplets between the panes of an old double-pane window, morning light behind",
          {
            motion:
              "Slow motion: a finger wipes the inside glass but the fog stays",
            onScreen: "Sign 2: Fog between the panes",
            voiceover:
              "Sign two: fog trapped between the glass. That seal is gone.",
          }
        ),
        video(
          "stuck",
          "Sign 3 · Hard to open",
          "11–15 s",
          4,
          "A man struggles to lift a stuck, old single-hung window, medium shot, warm indoor light",
          {
            motion: "The window jerks up a little, slight comedic timing",
            onScreen: "Sign 3: It fights you to open",
            voiceover: "Sign three: it takes a workout just to open it.",
          }
        ),
        video(
          "install",
          "The fix · install",
          "15–18 s",
          3,
          "Professional installer in a plain navy blue polo sets a new white energy-efficient replacement window into a brick home opening",
          {
            motion: "Smooth gimbal move",
            onScreen:
              "New energy-efficient windows = lower bills + a quieter home",
            voiceover:
              "New energy-efficient windows keep the heat in, the noise out, and your bills down.",
          }
        ),
        video(
          "finished",
          "The fix · exterior",
          "18–21 s",
          3,
          "The finished new white window from outside the brick home, clean caulk lines, bright sunny Texas sky, neat landscaping"
        ),
        video(
          "relaxed",
          "Payoff",
          "21–24 s",
          3,
          "The same couple relaxed by the new window, sunlight streaming in, the woman slides it open easily with one hand",
          {
            voiceover:
              "Get winter-ready. Book your free estimate with American Eagle Builders.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "24–25 s",
          "Fade to navy (#1A3174) end card with logo, phone and website in white",
          "Free estimate • (214) 239-3180 • americaneaglebuilders.com"
        ),
      ],
    },
    {
      id: "aeb-curb-appeal",
      brandId: "aeb",
      day: "Thu Oct 15",
      time: "12:00 PM",
      format: "static",
      title: "Fall Curb Appeal Starts at the Front Door",
      goal: "Saves, shares, profile visits",
      summary:
        "Before/after of the same front porch. Generate both halves, then add the divider, navy banner, red estimate strip and logo in Canva (4:5, 1:1, 9:16 stacked).",
      style:
        "Photorealistic, the same single-story red-brick suburban Texas home, front porch view, golden-hour autumn light, high-end real-estate photography, sharp detail, no people, no text.",
      shots: [
        image(
          "before",
          "BEFORE door",
          "A faded, peeling beige front door with a dented aluminum storm door, dull brass handle, bare porch"
        ),
        image(
          "after",
          "AFTER door",
          "A new deep navy blue fiberglass front entry door with decorative glass sidelights, matte black handle set, a clear full-view storm door, fresh white trim, orange pumpkins, yellow mums and a fall wreath",
          {
            referenceFrom: "before",
            onScreen:
              "FALL CURB APPEAL STARTS HERE · Free Estimate • (214) 239-3180",
          }
        ),
      ],
    },
    {
      id: "aeb-thanksgiving-room",
      brandId: "aeb",
      day: "Sat Oct 17",
      time: "10:00 AM",
      format: "reel",
      title: "Host Thanksgiving in Your Backyard",
      goal: "Inspiration + leads before the holidays",
      summary:
        "30 s transformation: an empty patio becomes an all-season sunroom for a family Thanksgiving dinner. Warm acoustic track.",
      style: AEB_STYLE,
      shots: [
        video(
          "hook",
          "Hook · crowded kitchen",
          "0–3 s",
          3,
          "Crowded kitchen in a Texas home on Thanksgiving, family members bumping elbows, too many dishes on the counter, warm light",
          {
            motion: "Fast handheld, slightly chaotic",
            onScreen: "Running out of room for the holidays?",
            voiceover: "Too many guests, not enough room?",
          }
        ),
        video(
          "patio",
          "The problem",
          "3–7 s",
          4,
          "A plain, empty backyard concrete patio behind a brick home: bare slab, one old plastic chair, dry leaves, overcast autumn sky, muted colors",
          {
            motion: "Slow pan, dry leaves blowing across the slab",
            onScreen: "Your patio is sitting empty…",
            voiceover: "Meanwhile, your patio just sits there all winter.",
          }
        ),
        video(
          "build",
          "Build montage",
          "7–12 s",
          5,
          "A crew in plain navy polos framing a patio enclosure on that patio: aluminum frame up, large glass window panels being set in place, bright day, clean worksite",
          {
            motion: "Sped-up time-lapse feel, panels going in",
            onScreen: "Patio enclosure in progress 🔨",
            voiceover: "So we enclosed it.",
          }
        ),
        video(
          "reveal",
          "The reveal",
          "12–17 s",
          5,
          "The finished all-season sunroom attached to the brick home at dusk, floor-to-ceiling windows glowing with warm interior light, string lights, potted mums by the door",
          {
            motion: "Slow drone-style pull-back",
            clipModel: "seedance-2",
            onScreen: "Same patio. Whole new room.",
            voiceover: "Same patio. Whole new room.",
          }
        ),
        video(
          "dinner",
          "Life inside",
          "17–22 s",
          5,
          "Inside the sunroom, a multi-generation family at a long harvest table with a roast turkey, candles and pumpkins, autumn trees visible through the glass, warm golden light",
          {
            motion: "Slow dolly along the table",
            onScreen: "Warm in winter. Cool in summer.",
            voiceover:
              "Warm in winter, cool in summer, and big enough for everyone.",
          }
        ),
        video(
          "details",
          "Details",
          "22–26 s",
          4,
          "Close-up of a child's hand pressed to the sunroom glass watching rain outside while staying dry, a ceiling fan turning overhead",
          {
            onScreen: "Use your backyard 365 days a year",
            voiceover: "Rain or shine, it's your favorite room.",
          }
        ),
        video(
          "night",
          "Night exterior",
          "26–28 s",
          3,
          "Wide shot of the glowing sunroom at night from the yard",
          {
            voiceover:
              "Start planning yours. Free estimates from American Eagle Builders.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "28–30 s",
          "Navy (#1A3174) end card with logo, phone and website in white, small red stripe",
          "Plan your holiday room • Free estimate • (214) 239-3180"
        ),
      ],
    },

    /* ── American Concrete Coatings ───────────────────────────────────── */
    {
      id: "acc-one-day",
      brandId: "acc",
      day: "Mon Oct 12",
      time: "12:00 PM",
      format: "static",
      title: "One Day. That's All It Takes.",
      goal: "Explain the offer + estimate clicks",
      summary:
        "Hero garage photo; add the navy banner, three timeline icons, warranty line and logo in Canva.",
      style:
        "Photorealistic real-estate photography, bright crisp high-contrast lighting, no people, no text.",
      shots: [
        image(
          "garage",
          "Hero garage",
          "Wide shot of a spotless two-car garage in a modern Texas home, garage door open to a sunny suburban driveway, freshly coated high-gloss grey, white and black vinyl flake floor reflecting the overhead LED lights, navy wall cabinets on one side, a pegboard with neatly hung tools, a clean pickup truck parked halfway in",
          {
            stillModel: "flux-2",
            onScreen:
              "ONE DAY. THAT'S ALL IT TAKES. · Installed in 1 day · Walk on it in 4–6 hrs · Park on it in 24 hrs · Lifetime UV warranty • 15-yr chip warranty",
          }
        ),
      ],
    },
    {
      id: "acc-showroom",
      brandId: "acc",
      day: "Wed Oct 14",
      time: "6:30 PM",
      format: "reel",
      title: "Oil-Stained Garage → Showroom Floor in One Day",
      goal: "Reach, shares, leads",
      summary:
        "25 s satisfying transformation: grind, base coat, flake broadcast, topcoat, reveal. Keep install ASMR under a trending sound.",
      style: ACC_STYLE,
      shots: [
        video(
          "hook",
          "Hook · stain",
          "0–2 s",
          3,
          "Top-down close-up of a dirty grey concrete garage floor with a large black oil stain, hairline cracks and tire marks, harsh overhead light, gritty and dull",
          {
            motion: "A shoe steps into frame and stops",
            onScreen: "This garage floor was embarrassing…",
            voiceover: "This garage floor has seen better days.",
          }
        ),
        video(
          "before",
          "BEFORE wide",
          "2–5 s",
          3,
          "Wide shot of the same empty two-car garage, garage door open, stained and patchy concrete, cluttered shelves at the back, dim and uninviting",
          {
            motion: "Slow push-in",
            onScreen: "BEFORE 😬",
            voiceover: "Oil stains, cracks, dust everywhere.",
          }
        ),
        video(
          "grind",
          "Step 1 · Grind",
          "5–9 s",
          4,
          "Low-angle shot of an installer in a navy t-shirt, knee pads and safety glasses pushing a diamond floor grinder with a vacuum hose across the concrete, dust-free, sharp detail",
          {
            motion: "Time-lapse speed",
            onScreen: "Step 1: Grind + repair cracks",
            voiceover: "First, we grind and repair the concrete.",
          }
        ),
        video(
          "base",
          "Step 2 · Base coat",
          "9–13 s",
          4,
          "Low-angle shot of a squeegee and roller spreading a smooth grey polyurea base coat across the garage floor, wet sheen catching the light",
          {
            motion: "Smooth slow tracking shot",
            onScreen: "Step 2: Polyurea base coat",
            voiceover: "Then a polyurea base coat.",
          }
        ),
        video(
          "flakes",
          "Step 3 · Flake broadcast",
          "13–17 s",
          4,
          "An installer throwing handfuls of grey, white and black vinyl flakes into the air over the wet base coat, backlit by the open garage door",
          {
            motion:
              "Slow motion: flakes rain down and sparkle as they cover the wet floor",
            clipModel: "seedance-2",
            onScreen: "Step 3: Flake broadcast 🤩",
            voiceover: "Now the fun part.",
          }
        ),
        video(
          "reveal",
          "Step 4 · Reveal",
          "17–21 s",
          4,
          "The finished high-gloss flake floor reflecting the ceiling LEDs, clutter gone, garage door open to golden-hour light",
          {
            motion: "Smooth gimbal reveal",
            onScreen: "Step 4: Polyaspartic topcoat ✨ Done in ONE day",
            voiceover: "Clear topcoat, and it's done. In one day.",
          }
        ),
        video(
          "truck",
          "Next day",
          "21–24 s",
          3,
          "Next morning, a clean pickup truck on the glossy flake floor of the same garage",
          {
            motion: "The truck rolls slowly onto the floor",
            voiceover: "Park on it tomorrow. Get your free estimate today.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "24–25 s",
          "Navy (#1A3174) end card with logo, phone and website in white, red accent line",
          "Park on it in 24 hrs • Free estimate • (817) 839-3485"
        ),
      ],
    },
    {
      id: "acc-pick-your-floor",
      brandId: "acc",
      day: "Sat Oct 17",
      time: "10:00 AM",
      format: "static",
      title: "Pick Your Floor: A, B, C or D?",
      goal: "Comments + saves (engagement)",
      summary:
        "Four finishes from the same garage angle; assemble the 2×2 grid with A–D badges and banner in Canva. Reuse the tiles for the YouTube poll and TikTok carousel.",
      style:
        "Photorealistic, the same clean Texas garage from the same angle, bright overhead LEDs, no people, no text.",
      shots: [
        image(
          "a",
          "A · Classic grey flake",
          "Garage floor in a classic grey, white and black vinyl flake with high gloss",
          { stillModel: "flux-2" }
        ),
        image(
          "b",
          "B · Warm earth flake",
          "The same garage floor in a warm beige, tan and brown flake blend",
          { referenceFrom: "a" }
        ),
        image(
          "c",
          "C · Charcoal + blue flake",
          "The same garage floor in a dark charcoal and blue flake blend with a sporty look, a motorcycle partly in frame",
          { referenceFrom: "a" }
        ),
        image(
          "d",
          "D · Metallic marble",
          "The same garage floor in a silver-grey metallic marble finish with swirling 3D depth, showroom style",
          { referenceFrom: "a" }
        ),
      ],
    },

    /* ── American Insulation ──────────────────────────────────────────── */
    {
      id: "insulation-5-signs",
      brandId: "insulation",
      day: "Mon Oct 12",
      time: "12:00 PM",
      format: "static",
      title: "5 Signs Your Attic Isn't Ready for Winter",
      goal: "Saves + estimate requests",
      summary:
        "Checklist infographic. Ideogram drafts the layout; put the phone number and logo on in Canva.",
      style:
        "Clean, modern infographic in a semi-realistic 3D illustration style, crisp, high contrast, easy to read on a phone.",
      shots: [
        image(
          "infographic",
          "Checklist graphic",
          'Left side: a cutaway of a single-story Texas brick home on a chilly autumn evening, attic visible with thin, flattened, patchy old insulation, blue cold-air arrows seeping in, a family inside in sweaters next to a thermostat. Right side: a white checklist panel with five rows, each with a red checkbox and short bold text: "Some rooms are always colder", "Energy bills keep climbing", "You feel drafts", "Your AC or heater never stops running", "20+ years old, never re-insulated". Top banner in navy blue with white bold text "5 SIGNS YOUR ATTIC ISN\'T READY FOR WINTER"',
          {
            stillModel: "ideogram-4",
            textInImage: true,
            onScreen:
              "Bottom strip: Checked 2 or more? Free estimate • (817) 784-7136 · logo bottom-right",
          }
        ),
      ],
    },
    {
      id: "insulation-r49",
      brandId: "insulation",
      day: "Wed Oct 14",
      time: "6:30 PM",
      format: "reel",
      title: "From Settled to R-49: Attic Glow-Up",
      goal: "Reach, shares, leads",
      summary:
        "25 s attic transformation: tape measure in 3 inches of old insulation, removal, blow-in, same tape buried at R-49, cozy family.",
      style: INSULATION_STYLE,
      shots: [
        video(
          "hook",
          "Hook · 3 inches",
          "0–3 s",
          3,
          "Close-up in a dim attic lit by a headlamp: a hand pushes a yellow tape measure into thin, grey, flattened old insulation that barely reaches 3 inches, dusty, shallow depth of field",
          {
            onScreen: "Only 3 inches?! 😳",
            voiceover: "This is why your house never stays warm.",
          }
        ),
        video(
          "thermal",
          "The problem",
          "3–6 s",
          3,
          "Thermal-camera style view of a home's ceiling from inside: bright orange heat escaping through patchy blue-purple areas",
          {
            onScreen: "1985 insulation + Texas weather = 💸",
            voiceover:
              "Old insulation settles over time and stops doing its job.",
          }
        ),
        video(
          "removal",
          "Step 1 · Removal",
          "6–10 s",
          4,
          "Installer in a navy shirt, respirator and protective suit uses a large vacuum hose to suck up old insulation in an attic, joists becoming visible, headlamp light",
          {
            motion: "Time-lapse speed, debris flowing into the hose",
            onScreen: "Step 1: Out with the old",
            voiceover: "First, we remove the old, damaged insulation.",
          }
        ),
        video(
          "blowin",
          "Step 2 · Blow-in",
          "10–15 s",
          5,
          "Wide attic shot as an installer aims a blowing hose and fresh white blown-in insulation billows out in a thick cloud between the joists, backlit by a work light",
          {
            motion:
              "Slow motion: insulation settles evenly between the joists like snow",
            clipModel: "seedance-2",
            onScreen: "Step 2: Fresh blow-in insulation ❄️",
            voiceover: "Then we blow in fresh insulation, filling every gap.",
          }
        ),
        video(
          "proof",
          "The proof",
          "15–18 s",
          3,
          "A yellow tape measure pushed into deep, fluffy white attic insulation, buried well past 14 inches, an installer's gloved thumbs-up beside it, bright clean light",
          { onScreen: "Now: R-49 ✅", voiceover: "Now it's R-49." }
        ),
        video(
          "cozy",
          "The payoff",
          "18–22 s",
          4,
          "Cozy living room in the evening: a family relaxing on the couch in t-shirts, a dog asleep on the rug, a thermostat on the wall showing 70°F, warm lamp light",
          {
            motion: "Smooth slow push-in",
            onScreen: "Warmer winters. Cooler summers. Lower bills.",
            voiceover: "Warmer winters, cooler summers and lower bills.",
          }
        ),
        video(
          "exterior",
          "Exterior",
          "22–24 s",
          3,
          "Exterior of a brick home at dusk with warm glowing windows",
          {
            voiceover: "Book your free attic check with American Insulation.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "24–25 s",
          "Navy (#1A3174) end card with logo, phone and website in white, red accent line",
          "Free attic check • (817) 784-7136"
        ),
      ],
    },
    {
      id: "insulation-foam-vs-blowin",
      brandId: "insulation",
      day: "Sat Oct 17",
      time: "10:00 AM",
      format: "static",
      title: "Spray Foam vs Blow-In: Which One Is Right for You?",
      goal: "Education, saves, comments",
      summary:
        "Comparison card. Two close-up photos, then the headers, check rows, VS circle and footer in Canva (or let Ideogram draft the whole layout).",
      style: "Photorealistic close-up, bright, crisp, no people, no text.",
      shots: [
        image(
          "foam",
          "Spray foam photo",
          "Yellow-cream spray foam insulation sealed tightly between attic rafters",
          {
            stillModel: "flux-2",
            onScreen:
              "SPRAY FOAM · Air-tight seal · Blocks drafts + moisture · Closed-cell = highest R-value",
          }
        ),
        image(
          "blowin",
          "Blow-in photo",
          "Thick white blown-in insulation covering an attic floor between joists",
          {
            stillModel: "flux-2",
            onScreen:
              "BLOW-IN · Cost-effective · Fills gaps + hard-to-reach spots · Great for topping up old attics",
          }
        ),
        image(
          "layout",
          "Full card (optional)",
          'Split-screen comparison graphic: left half labeled "SPRAY FOAM" in a navy header with a close-up of spray foam between rafters, right half labeled "BLOW-IN" in a red header with a close-up of blown-in insulation, a white "VS" circle in the center, top banner "SPRAY FOAM vs BLOW-IN"',
          { stillModel: "ideogram-4", textInImage: true }
        ),
      ],
    },

    /* ── HomeStop ─────────────────────────────────────────────────────── */
    {
      id: "homestop-stop-juggling",
      brandId: "homestop",
      day: "Mon Oct 12",
      time: "12:00 PM",
      format: "static",
      title: "STOP Juggling Contractors",
      goal: "Brand awareness, shares",
      summary:
        "Bold brand post built on the stop-sign logo. Ideogram drafts the layout; add the logo and icon row in Canva.",
      style:
        "Bold, clean graphic design on a white background, high contrast, very readable on a phone.",
      shots: [
        image(
          "layout",
          "STOP graphic",
          'Left side: a frustrated homeowner in a DFW kitchen holding a phone to one ear with a pile of different contractor business cards and estimates scattered on the counter, photorealistic, warm daylight. Right side: three stacked red octagon stop-sign shapes, each with white bold text: "STOP chasing unreliable contractors", "STOP settling for poor quality", "STOP comparing 5 different estimates". Below them a navy rounded bar with white text "START with one call: HomeStop"',
          {
            stillModel: "ideogram-4",
            textInImage: true,
            onScreen:
              "Icon row: window, door, pergola, garage floor, insulation, pool · logo + 'Family-owned since 1984'",
          }
        ),
      ],
    },
    {
      id: "homestop-whole-home",
      brandId: "homestop",
      day: "Wed Oct 14",
      time: "6:30 PM",
      format: "reel",
      title: "One Call. Whole Home.",
      goal: "Reach + show the full range",
      summary:
        "30 s walk-through of one home: each beat snaps from before to after. The red STOP wipe between them is an editor transition. Reuse finished sister-brand shots where they fit.",
      style: HOMESTOP_STYLE,
      shots: [
        video(
          "hook",
          "Hook · 5 cards",
          "0–3 s",
          3,
          "A homeowner in front of a dated single-story Texas brick home, holding a fan of five different contractor business cards like playing cards, shrugging at the camera",
          {
            motion: "Handheld, playful",
            onScreen: "5 projects. 5 contractors? 😩",
            voiceover: "Five home projects shouldn't mean five contractors.",
          }
        ),
        edit(
          "stop",
          "STOP slam",
          "3–5 s",
          "Red octagon STOP sign slams in with a bounce; HomeStop logo inside",
          "STOP. One call does it all."
        ),
        video(
          "window-before",
          "Windows · before",
          "5–7 s",
          3,
          "Exterior close-up of an old, foggy aluminum window on the brick home"
        ),
        video(
          "window-after",
          "Windows · after",
          "7–9 s",
          3,
          "The same spot with a crisp white replacement window, clean trim, sunlight reflecting",
          {
            referenceFrom: "window-before",
            stillModel: "flux-2",
            onScreen: "Windows ✅",
            voiceover: "New windows…",
          }
        ),
        video(
          "patio-after",
          "Patio + pergola",
          "9–13 s",
          4,
          "Backyard with a new patio cover and pergola, outdoor sofa, string lights, a family relaxing, golden hour",
          { onScreen: "Patio + pergola ✅", voiceover: "…a new patio…" }
        ),
        video(
          "garage-after",
          "Garage floor",
          "13–17 s",
          4,
          "Glossy grey flake-coated garage floor reflecting the lights, a truck parked inside",
          {
            motion: "Low-angle tracking shot",
            onScreen: "Garage floor coating ✅",
            voiceover: "…a showroom garage…",
          }
        ),
        video(
          "attic-after",
          "Insulation",
          "17–21 s",
          4,
          "Thick fresh white blown-in insulation filling an attic, an installer giving a thumbs-up",
          { onScreen: "Insulation ✅", voiceover: "…better insulation…" }
        ),
        video(
          "pool",
          "Pool finish",
          "21–25 s",
          4,
          "Drone shot over the backyard with a sparkling blue custom pool and spa next to the new patio, kids cannonballing into the water, bright sunny Texas day",
          {
            motion: "Drone glide, splash as the kids jump in",
            clipModel: "seedance-2",
            onScreen: "Even the pool 🏊✅",
            voiceover: "…even the pool. All from one company.",
          }
        ),
        video(
          "wave",
          "Family wave",
          "25–27 s",
          3,
          "The family waves from the front yard of the fully upgraded brick home",
          {
            motion: "Zoom out",
            voiceover: "HomeStop. Your one-stop for home improvement.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "27–30 s",
          "Red end card with a white STOP octagon containing the HomeStop logo, phone and website; navy strip 'Family-owned since 1984'",
          "One call: (214) 429-4629 • homestop.us"
        ),
      ],
    },
    {
      id: "homestop-price-match",
      brandId: "homestop",
      day: "Sat Oct 17",
      time: "10:00 AM",
      format: "static",
      title: "Found a Lower Price? We'll Match It.",
      goal: "Leads, estimate requests",
      summary:
        "Price Match Guarantee offer post. Ideogram drafts the stop-sign layout; add checks, phone and logo in Canva.",
      style:
        "Bright, clean promotional graphic, crisp, high contrast, readable on a phone.",
      shots: [
        image(
          "layout",
          "Price match graphic",
          'Center: a large red octagon stop sign with bold white text "STOP OVERPAYING", beneath it a navy ribbon banner with white bold text "PRICE MATCH GUARANTEE". Behind the sign, a softly blurred photo of an upgraded Texas home with new windows, a pergola and a manicured lawn in afternoon sun. Left: a hand holding a paper estimate. Right: a friendly rep in a plain navy polo shaking hands with a smiling homeowner couple',
          {
            stillModel: "ideogram-4",
            textInImage: true,
            onScreen:
              "Same quality · Industry-best warranties · Flexible financing · Found a lower price? We'll match it. • (214) 429-4629",
          }
        ),
      ],
    },
  ],
}
