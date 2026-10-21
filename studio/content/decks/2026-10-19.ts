import { BRANDS } from "../brands"
import type { Deck } from "../types"
import { edit, image, video } from "./helpers"

/* Week of Oct 19–25, 2026, transcribed from the weekly content calendar
   dated Oct 16. On-screen text, phone numbers and logos go in the editor. */

const LONGHORN_STYLE =
  "Photorealistic, North Texas brick home, warm October afternoon light, cinematic, vertical 9:16, no brand logos."
const FIRE_STYLE =
  "Photorealistic, cool blue dusk turning to night, warm firelight, shallow depth of field, slow cinematic motion, vertical 9:16, no clear faces."
const AEB_WINDOWS_STYLE =
  "Photorealistic, interior of a typical DFW brick suburban home, cool blue late-October morning light outside, warm lamp light inside, cinematic shallow depth of field, vertical 9:16, no brand logos on products."
const AEB_SUNROOM_STYLE =
  "Photorealistic, the same single-story DFW brick home and the same camera angle on its back patio, warm cinematic grade, vertical 9:16."
const ACC_STYLE =
  "Photorealistic, bright clean two-car Texas garage with a glossy gray, black and white flake-coated floor, overhead LED lights, crisp detail, vertical 9:16, no text."
const INSULATION_STYLE =
  "Photorealistic, 1980s DFW home and its attic, documentary feel, crisp detail, vertical 9:16."
const HOMESTOP_STYLE =
  "Photorealistic, the same 1990s single-story Texas suburban home throughout, vertical 9:16, magazine-quality home photography."

export const DECK_2026_10_19: Deck = {
  id: "2026-10-19",
  label: "Oct 19–25, 2026",
  brands: BRANDS,
  posts: [
    /* ── Longhorn ─────────────────────────────────────────────────────── */
    {
      id: "longhorn-pergola-or-cover",
      brandId: "longhorn",
      day: "Tue Oct 20",
      time: "6:30 PM",
      format: "reel",
      title: "Pergola or Patio Cover? Answer This One Question",
      goal: "Educate + drive pergola and cover consultations; push the blog",
      summary:
        "30 s explainer: pergola for definition and filtered light, roof for shade and rain; which way the patio faces decides it, often both. Friendly voiceover, light acoustic track. The hook is a split screen built in the editor from the two hook stills.",
      style: LONGHORN_STYLE,
      shots: [
        image(
          "hook-pergola",
          "Hook · left half (pergola)",
          "A cedar pergola with string lights over a flagstone patio behind the house",
          {
            aspect: "9:16",
            onScreen:
              "Pergola or patio cover? 🤔 (split screen with a bold VS)",
            voiceover: "Pergola or patio cover? Most people pick wrong.",
          }
        ),
        image(
          "hook-cover",
          "Hook · right half (patio cover)",
          "A solid white insulated patio cover over a dining table on a patio behind the house",
          { aspect: "9:16" }
        ),
        video(
          "pergola-job",
          "Pergola's job",
          "3–9 s",
          6,
          "Looking up through cedar pergola slats, soft dappled midday light falling across a lounge set, a ceiling fan and string lights hanging from the beams",
          {
            motion: "Slow tilt up through the slats as dappled light shifts",
            onScreen:
              "Pergola = style, filtered light, a place for fans + lights",
            voiceover:
              "A pergola defines the space, filters midday sun, and gives you somewhere to hang fans and lights.",
          }
        ),
        video(
          "catch",
          "The catch",
          "9–14 s",
          5,
          "The same cedar pergola late afternoon in summer: low orange western sun blasting straight under the slats onto empty chairs, heat shimmer",
          {
            referenceFrom: "pergola-job",
            motion: "Static camera, heat shimmer rising, harsh sun flare",
            onScreen: "But it won't stop the 5 PM July sun",
            voiceover: "But it won't cool a west-facing patio at five in July.",
          }
        ),
        video(
          "cover-job",
          "Cover's job",
          "14–16 s",
          3,
          "A solid insulated patio cover casting deep, even shade over a dining table on a sunny afternoon",
          {
            onScreen: "Patio cover = shade + rain protection",
            voiceover:
              "For real shade and to stay dry in a storm, you need a roof.",
          }
        ),
        video(
          "rain",
          "Cover in the rain",
          "16–19 s",
          4,
          "Rain pouring off the edge of the same insulated patio cover while the cushions underneath stay dry",
          {
            referenceFrom: "cover-job",
            clipModel: "seedance-2",
            motion: "Heavy rain streaming off the roof edge in slow motion",
          }
        ),
        video(
          "question",
          "The question",
          "19–23 s",
          4,
          "Overhead drone view straight down onto a back patio of a brick home, long late-afternoon shadows from the sun setting in the west",
          {
            motion: "Slow overhead drift",
            onScreen:
              "Which way does your patio face? (add compass arrow + west sun icon in the editor)",
            voiceover: "So ask: which way does your patio face?",
          }
        ),
        video(
          "both",
          "Best answer: both",
          "23–27 s",
          4,
          "Wide golden-hour shot of a split structure on one slab: a solid roof over the seating area and open cedar slats over the grill and walkway, a family relaxing, seen from behind",
          {
            motion: "Slow dolly across the patio",
            onScreen: "Often the answer is BOTH",
            voiceover:
              "Often the best answer is both: solid where you sit, open where you cook.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "27–30 s",
          "Dark background (#0d0e10), Longhorn logo, warm light sweep",
          "Free design visit · (214) 251-4928 · VO: “We'll stand in your yard and tell you which half is which.”"
        ),
      ],
    },
    {
      id: "longhorn-refinish-it",
      brandId: "longhorn",
      day: "Thu Oct 22",
      time: "12:00 PM",
      format: "static",
      title: "Don't Replace It. Refinish It.",
      goal: "Luxury coatings leads (lower-budget entry point)",
      summary:
        "Before/after of the same patio, split horizontally (BEFORE top, AFTER bottom). Generate both halves wide, then stack them in Canva with the headline band and Stain · Stamp · Faux Stone chips (4:5 and 9:16).",
      style:
        "Photorealistic, the same back patio of a North Texas brick home from the same camera angle, cinematic, high detail, no people, no text.",
      shots: [
        image(
          "before",
          "BEFORE (top half)",
          "A plain, faded gray broom-finish concrete slab with light stains and a bare concrete-block planter wall, flat overcast light",
          { aspect: "16:9" }
        ),
        image(
          "after",
          "AFTER (bottom half)",
          "The same slab finished as warm earth-tone stamped flagstone-pattern concrete with a soft satin seal, the block wall faced in tan faux stone, two lounge chairs and a potted plant, golden autumn afternoon light with a few fallen leaves",
          {
            aspect: "16:9",
            referenceFrom: "before",
            onScreen:
              "Don't replace it. Refinish it. · Stain · Stamp · Faux Stone · Free estimate (214) 251-4928",
          }
        ),
      ],
    },
    {
      id: "longhorn-fire-pit-season",
      brandId: "longhorn",
      day: "Sat Oct 24",
      time: "10:00 AM",
      format: "reel",
      title: "Fire Pit Season Is Here",
      goal: "Hardscaping and fire feature awareness, weekend mood",
      summary:
        "20 s mood reel: a cool October evening around a stone fire pit, then the craft behind it. No voiceover; keep real fire crackle under a mellow acoustic track.",
      style: FIRE_STYLE,
      shots: [
        video(
          "hook",
          "Hook · ignition",
          "0–2 s",
          4,
          "Extreme close-up of a gas fire pit igniting, flames rising from lava rock in a round stone bowl",
          {
            clipModel: "seedance-2",
            motion:
              "A match strikes, then the burner catches with a soft whoosh",
            onScreen: "October in Texas hits different 🔥",
          }
        ),
        video(
          "space",
          "The space",
          "2–5 s",
          3,
          "A round flagstone patio with a curved stone seat wall around a glowing fire pit, a travertine path to the pool, an uplit live oak, dusk sky",
          {
            motion: "Slow drone pull-back revealing the whole space",
            onScreen: "Fire pit + seat wall + travertine",
          }
        ),
        video(
          "cozy",
          "Cozy",
          "5–8 s",
          3,
          "Close-up of hands holding mugs of hot cider, a blanket on a lap, firelight glowing from behind, sparks drifting",
          { onScreen: "Hot cider weather" }
        ),
        video(
          "friends",
          "Friends",
          "8–11 s",
          3,
          "Medium shot from behind of friends laughing around the fire pit, a phone propped on the seat wall showing a football game, marshmallows on sticks",
          { onScreen: "Saturday nights, sorted" }
        ),
        video(
          "detail",
          "Detail",
          "11–14 s",
          3,
          "Macro view of the stone cap of the seat wall and tight travertine joints, path lights glowing along the edge",
          {
            motion: "Slow macro slide along the stone",
            onScreen: "Built level. Stays level.",
          }
        ),
        video(
          "craft",
          "Craft",
          "14–17 s",
          3,
          "Daylight: a crew compacting a gravel base and setting a drain before stone goes down, clean professional worksite, faces not visible",
          { onScreen: "Base + drainage done first" }
        ),
        edit(
          "cta",
          "CTA end card",
          "17–20 s",
          "Dark background (#0d0e10), Longhorn logo, small flickering flame icon",
          "Free design visit · (214) 251-4928"
        ),
      ],
    },

    /* ── American Eagle Builders ──────────────────────────────────────── */
    {
      id: "aeb-five-window-signs",
      brandId: "aeb",
      day: "Tue Oct 20",
      time: "6:30 PM",
      format: "reel",
      title: "5 Signs Your Windows Won't Survive Another Texas Winter",
      goal: "Window replacement estimates",
      summary:
        "30 s checklist reel: draft, fog between panes, sticking sash, rising bill, street noise, then new windows. Quick cuts, friendly voiceover, light acoustic track.",
      style: AEB_WINDOWS_STYLE,
      shots: [
        video(
          "hook",
          "Hook",
          "0–3 s",
          3,
          "Close-up of a person in a cozy sweater holding a hand near an old aluminum window frame, sheer curtain fluttering inward from a draft, frosty glass outside",
          {
            onScreen: "Is your window doing this? 🥶",
            voiceover:
              "If your windows do any of these, winter's going to cost you.",
          }
        ),
        video(
          "draft",
          "Sign 1 · Draft",
          "3–7 s",
          4,
          "A lit candle on a windowsill, its flame bending sideways toward the window seal, dim morning light",
          {
            onScreen: "1. You feel a draft",
            voiceover: "One: you can feel a draft, even with the window shut.",
          }
        ),
        video(
          "fog",
          "Sign 2 · Fog",
          "7–11 s",
          4,
          "Macro shot of fog and water droplets trapped between two panes of a double-pane window",
          {
            onScreen: "2. Fog between the panes",
            voiceover: "Two: fog between the panes means the seal has failed.",
          }
        ),
        video(
          "stuck",
          "Sign 3 · Sticks",
          "11–15 s",
          4,
          "Hands struggling to push up a stuck, dated window sash, paint cracking at the edge",
          {
            onScreen: "3. It sticks or won't open",
            voiceover: "Three: it sticks, or won't open at all.",
          }
        ),
        video(
          "bill",
          "Sign 4 · Bills",
          "15–19 s",
          4,
          "A hand holding a phone showing an electric bill notification, a wall thermostat set to 72 degrees blurred in the background",
          {
            onScreen:
              "4. Your bills keep climbing (put the bill amount on the phone screen in the editor)",
            voiceover: "Four: your energy bills keep climbing.",
          }
        ),
        video(
          "noise",
          "Sign 5 · Noise",
          "19–23 s",
          4,
          "A living room by a busy road, cars blurring past the window, a person on the couch covering their ears",
          {
            onScreen: "5. You hear every car outside",
            voiceover: "Five: you can hear every car on the street.",
          }
        ),
        video(
          "payoff",
          "Payoff",
          "23–27 s",
          4,
          "The same living room with new crisp white energy-efficient windows, sunlight streaming in, a family relaxing quietly, calm and warm",
          {
            referenceFrom: "noise",
            onScreen: "Warmer. Quieter. Lower bills.",
            voiceover: "New energy-efficient windows fix all five.",
          }
        ),
        edit(
          "cta",
          "CTA end card",
          "27–30 s",
          "Clean navy and white background with the American Eagle Builders logo centered, subtle light sweep",
          "Free estimate · (214) 239-3180 · VO: “Book your free estimate before the first freeze.”"
        ),
      ],
    },
    {
      id: "aeb-frozen-pipes-review",
      brandId: "aeb",
      day: "Thu Oct 22",
      time: "12:00 PM",
      format: "static",
      title: "“No More Frozen Pipes”: Real Review, Insulated Siding",
      goal: "Trust + siding leads",
      summary:
        "Testimonial card from Mel P.'s real website review. Generate the frosty home photo, then add stars, the quote, attribution and navy band in Canva (4:5 and 9:16).",
      style:
        "Photorealistic, cinematic, cozy, high detail, no people, no text.",
      shots: [
        image(
          "home",
          "Frosty home photo",
          "A single-story DFW brick-and-siding ranch home on a frosty late-autumn morning, fresh light gray insulated lap siding with crisp white trim, a thin layer of frost on the lawn and roof edges, a warm golden glow from the front windows, clear pale blue sky; the lower 40% of the frame slightly darker and softly blurred to leave space for a text overlay",
          {
            stillModel: "flux-2",
            onScreen:
              "★★★★★ · “I haven't had any issues with frozen pipes or a cold house ever since.” · Mel P., Insulated Siding Customer · Free estimate (214) 239-3180",
          }
        ),
      ],
    },
    {
      id: "aeb-patio-all-winter",
      brandId: "aeb",
      day: "Sat Oct 24",
      time: "10:00 AM",
      format: "reel",
      title: "Your Patio Doesn't Have to Close for Winter",
      goal: "Sunroom and patio enclosure awareness",
      summary:
        "25 s seasonal transformation: the same patio from cold and empty to an all-season sunroom used in January, April and July. No voiceover; beat-synced cuts over a warm instrumental.",
      style: AEB_SUNROOM_STYLE,
      shots: [
        video(
          "patio",
          "Your patio in November",
          "0–3 s",
          3,
          "A bare concrete back patio on a gray, windy late-autumn day, empty patio chairs, cold light",
          {
            motion: "Dry leaves blowing across the slab",
            onScreen: "Your patio in November 🍂",
          }
        ),
        video(
          "drizzle",
          "Closed until spring?",
          "3–6 s",
          3,
          "The same patio in light freezing drizzle, a person in a heavy coat holding a coffee mug at the back door",
          {
            referenceFrom: "patio",
            motion: "The person steps out and immediately turns back inside",
            onScreen: "Closed until spring?",
          }
        ),
        video(
          "transform",
          "Not anymore",
          "6–10 s",
          4,
          "The same angle with a white-framed all-season sunroom with large glass panels and a solid roof built over the patio",
          {
            referenceFrom: "patio",
            transitionFrom: "patio",
            onScreen: "Not anymore.",
          }
        ),
        video(
          "winter",
          "Cozy in January",
          "10–14 s",
          4,
          "Inside the sunroom on a frosty morning: frost on the lawn beyond the glass, a cozy sofa, plants, steaming coffee, soft blanket, warm light",
          { onScreen: "Cozy in January ☕" }
        ),
        video(
          "spring",
          "Breezy in April",
          "14–17 s",
          3,
          "The same sunroom with sliding panels open to a green yard, kids playing a board game at a table, bright light",
          { referenceFrom: "winter", onScreen: "Breezy in April 🌿" }
        ),
        video(
          "summer",
          "Cool in July",
          "17–20 s",
          3,
          "The same sunroom in July, ceiling fan turning, a family eating dinner, bright sun outside",
          {
            referenceFrom: "winter",
            onScreen: "Cool in July, no mosquitoes",
          }
        ),
        image(
          "option-enclosure",
          "Options · screened enclosure",
          "A screened patio enclosure on a brick home",
          {
            time: "20–22 s",
            aspect: "16:9",
            onScreen:
              "Enclosures · Sunrooms · All-Season (3-way split, 20–22 s)",
          }
        ),
        image(
          "option-sunroom",
          "Options · classic sunroom",
          "A classic glass sunroom on a brick home",
          { aspect: "16:9" }
        ),
        image(
          "option-allseason",
          "Options · all-season sunroom",
          "An insulated all-season sunroom with a solid roof on a brick home",
          { aspect: "16:9" }
        ),
        edit(
          "cta",
          "CTA end card",
          "22–25 s",
          "Clean navy background, American Eagle Builders logo, text animating in",
          "Use your patio all year. Free estimate · (214) 239-3180"
        ),
      ],
    },

    /* ── American Concrete Coatings ───────────────────────────────────── */
    {
      id: "acc-patio-season",
      brandId: "acc",
      day: "Mon Oct 19",
      time: "12:00 PM",
      format: "static",
      title: "Fall Is Patio Season",
      goal: "Promote patio and pool deck coatings",
      summary:
        "Dusk patio and pool deck with a textured flake coating. Add the headline over the sky, gold Lifetime UV Warranty badge and navy footer in Canva (4:5, 9:16, 1:1).",
      style:
        "Warm, inviting, high-end lifestyle photography, no people, no text, no logos.",
      shots: [
        image(
          "patio",
          "Patio + pool deck",
          "Wide low-angle shot of a Texas backyard at dusk in autumn: a large patio and pool deck with a new textured tan, beige and brown decorative flake coating, clean and slightly glossy, filling the foreground; warm string lights overhead, a fire pit with soft flames, an outdoor sofa with cozy blankets, pumpkins and mums in planters, blue pool water glowing on one side; empty sky at the top for a headline",
          {
            stillModel: "flux-2",
            onScreen:
              "FALL IS PATIO SEASON · Slip-resistant • UV-stable • Won't crack or peel · Lifetime UV Warranty · (817) 839-3485",
          }
        ),
      ],
    },
    {
      id: "acc-tried-to-ruin",
      brandId: "acc",
      day: "Wed Oct 21",
      time: "6:30 PM",
      format: "reel",
      title: "We Tried to Ruin This Floor",
      goal: "Prove durability with a spill test",
      summary:
        "27 s durability test: oil, gasoline, road salt, a dropped wrench, then one wipe. Suspense build that turns upbeat at the wipe; impact sound on each test. If you film it for real: outdoors or door open, no flames or engines, dispose of fuel and oil properly.",
      style: ACC_STYLE,
      shots: [
        video(
          "challenge",
          "The challenge",
          "0–3 s",
          3,
          "A confident floor installer in a navy work shirt standing on the glossy flake garage floor, holding a bottle of motor oil and a red gas can, smirking at the camera",
          {
            motion: "Slight push-in",
            onScreen: "We tried to RUIN this floor 😈",
            voiceover: "We tried to ruin our own floor.",
          }
        ),
        video(
          "oil",
          "Test 1 · Motor oil",
          "3–6 s",
          4,
          "Close-up at floor level: thick dark motor oil pouring from a bottle onto the glossy flake-coated floor, dramatic side lighting",
          {
            clipModel: "seedance-2",
            motion:
              "Slow motion: the oil splashes and spreads into a shiny black puddle",
            onScreen: "Test 1: Motor oil 🛢️",
            voiceover: "Motor oil...",
          }
        ),
        video(
          "gas",
          "Test 2 · Gasoline",
          "6–9 s",
          4,
          "Close-up of a red gas can tipping over the glossy flake-coated floor, low angle, shallow depth of field",
          {
            clipModel: "seedance-2",
            motion:
              "Slow motion: clear gasoline splashes across the floor, droplets catching the light",
            onScreen: "Test 2: Gasoline ⛽",
            voiceover: "Gasoline...",
          }
        ),
        video(
          "salt",
          "Test 3 · Road salt",
          "9–12 s",
          3,
          "Close-up of a gloved hand sprinkling a heavy handful of coarse white road salt over the glossy flake-coated floor, bright clean light",
          {
            motion: "Slow motion: salt crystals bounce on impact",
            onScreen: "Test 3: Road salt 🧂",
            voiceover: "Road salt...",
          }
        ),
        video(
          "wrench",
          "Test 4 · Dropped wrench",
          "12–15 s",
          3,
          "Floor-level shot of a heavy steel wrench just above the glossy flake-coated floor",
          {
            motion:
              "Slow motion: the wrench falls and bounces off the floor, slight camera shake on impact",
            onScreen: "Test 4: Dropped wrench 🔧",
            voiceover: "...and a dropped wrench.",
          }
        ),
        video(
          "wipe",
          "One wipe",
          "15–21 s",
          6,
          "Overhead shot of a mess of oil, gasoline and salt on the glossy flake floor, a gloved hand with a white microfiber towel at the edge of the mess",
          {
            motion:
              "One smooth sweep of the towel wipes the mess away, revealing a perfectly clean, shiny floor",
            onScreen: "One wipe. Spotless. ✨",
            voiceover: "One wipe. Not a mark.",
          }
        ),
        video(
          "inspect",
          "Close inspection",
          "21–24 s",
          3,
          "Macro view across the cleaned flake floor where the wrench landed: no chip, no scratch, no stain, light reflecting off the glossy topcoat",
          {
            motion: "Slow macro glide",
            onScreen: "No stains. No chips. No peeling.",
            voiceover: "No stains, no chips, no peeling.",
          }
        ),
        video(
          "truck",
          "CTA shot",
          "24–27 s",
          3,
          "Wide shot of the spotless glossy flake-floor garage with a pickup truck parked inside, the installer giving a thumbs up beside it, warm evening light from the open door, bottom third clear for a banner",
          {
            onScreen:
              "15-yr chip warranty • (817) 839-3485 (navy banner, logo, website)",
            voiceover: "American Concrete Coatings. Get your free estimate.",
          }
        ),
        image(
          "cover",
          "Reel cover / thumbnail",
          "Dramatic close-up of a puddle of black motor oil and scattered white road salt on the glossy flake floor, a gloved hand holding a white towel halfway through wiping, the wiped part perfectly clean and shiny, space in the center for a headline",
          {
            aspect: "9:16",
            onScreen:
              "IG: CAN IT SURVIVE? · FB: Oil, Gas & Salt vs Our Floor · YT: We Tried to RUIN This Floor · TikTok: wait for the wipe 😳",
          }
        ),
      ],
    },
    {
      id: "acc-not-just-garages",
      brandId: "acc",
      day: "Fri Oct 23",
      time: "12:00 PM",
      format: "static",
      title: "Not Just Garages",
      goal: "Show kennels, shops and commercial uses",
      summary:
        "2×2 grid of four coated spaces; assemble with labels, navy header and footer in Canva. Confirm Moura Stock Dogs is OK being named before the Facebook caption goes out.",
      style:
        "Photorealistic, bright clean consistent lighting, no text, no logos.",
      shots: [
        image(
          "kennel",
          "Kennels",
          "A clean dog kennel with a glossy gray flake-coated floor and a happy herding dog lying on it",
          {
            stillModel: "flux-2",
            onScreen:
              "NOT JUST GARAGES · Kennels • Showrooms • Kitchens • Warehouses · Easy to clean • Non-slip • Built for heavy use",
          }
        ),
        image(
          "showroom",
          "Showrooms",
          "A modern retail showroom with a marbled metallic epoxy floor in blue and silver reflecting display lights",
          { stillModel: "flux-2" }
        ),
        image(
          "kitchen",
          "Kitchens",
          "A stainless-steel commercial kitchen with a seamless non-slip gray coated floor",
          { stillModel: "flux-2" }
        ),
        image(
          "warehouse",
          "Warehouses",
          "A bright warehouse with a smooth gray coated floor, pallet racks and a forklift",
          { stillModel: "flux-2" }
        ),
      ],
    },

    /* ── American Insulation ──────────────────────────────────────────── */
    {
      id: "insulation-4-signs",
      brandId: "insulation",
      day: "Tue Oct 20",
      time: "12:00 PM",
      format: "static",
      title: "4 Signs Your Attic Isn't Ready for Winter",
      goal: "Problem awareness, saves and shares",
      summary:
        "Cutaway image; add the headline, 4-item checklist, footer bar and logo in Canva (4:5, 1:1, 9:16).",
      style:
        "Professional home-improvement advertising style, photorealistic, sharp detail, no text.",
      shots: [
        image(
          "cutaway",
          "Attic cutaway",
          "Cross-section of a two-story Texas suburban brick home in late autumn at dusk, cutaway showing the attic with thin, flattened, gray, uneven old fiberglass insulation and gaps between wooden joists; soft blue cold-air wisps drift down into a living room where a family member in a sweater adjusts a thermostat; warm orange interior light against cool blue outdoor tones; empty space on the left third for a text overlay",
          {
            stillModel: "flux-2",
            onScreen:
              "IS YOUR ATTIC WINTER-READY? · ✓ Some rooms always colder ✓ Energy bill keeps climbing ✓ Drafts near ceilings and walls ✓ Insulation looks thin, flat or patchy · 2 or more? FREE estimate (817) 784-7136",
          }
        ),
      ],
    },
    {
      id: "insulation-1985-glow-up",
      brandId: "insulation",
      day: "Thu Oct 22",
      time: "6:30 PM",
      format: "reel",
      title: "From Thin & Settled to R-49: Attic Glow-Up",
      goal: "Show the work, drive estimate calls",
      summary:
        "25 s before/after of a 1985 attic getting blow-in insulation. Upbeat instrumental, voiceover plus bold captions. Use real job-site footage where you have it.",
      style: INSULATION_STYLE,
      shots: [
        video(
          "hook",
          "Hook · attic ladder",
          "0–3 s",
          3,
          "Close-up of a hand pulling down an attic ladder in a hallway, a dark attic opening above, dust particles in a flashlight beam, cool blue tones",
          {
            motion:
              "Camera tilts up into the dark attic opening as a flashlight clicks on, slight handheld shake",
            onScreen: "YOUR ATTIC IN 1985 vs. TODAY 👀",
            voiceover:
              "This attic hasn't been touched since 1985. Look what we found.",
          }
        ),
        video(
          "problem",
          "The problem",
          "3–6 s",
          3,
          "An old attic lit by a flashlight: thin, flattened, gray-yellow fiberglass insulation below the tops of the wooden joists, bare patches and gaps",
          {
            motion: "Flashlight sweeps slowly left to right",
            onScreen: "Settled. Thin. Barely working.",
            voiceover:
              "Old insulation settles over time, and the heat walks right out.",
          }
        ),
        video(
          "cost",
          "The cost",
          "6–9 s",
          3,
          "A living room in winter, a woman in a knit sweater rubbing her arms beside a wall thermostat, cool color grade, shallow depth of field",
          {
            motion: "She turns up the thermostat",
            onScreen: "= cold rooms + high bills 💸",
            voiceover: "That means cold rooms and higher bills all winter.",
          }
        ),
        video(
          "fix",
          "The fix",
          "9–14 s",
          5,
          "An installer in a navy work shirt, safety glasses and respirator kneeling on attic joists, holding a large hose blowing fluffy white loose-fill insulation across the attic floor, warm work-light glow",
          {
            clipModel: "seedance-2",
            motion:
              "Slow motion: the insulation cloud billows through the work-light beam and settles evenly",
            onScreen: "Fresh blow-in insulation ✅",
            voiceover:
              "Our crew blows in fresh insulation, reaching every corner, gap and tight spot.",
          }
        ),
        video(
          "proof",
          "Proof of depth",
          "14–17 s",
          3,
          "A gloved hand holding an insulation depth ruler standing in a deep, even layer of fresh white blown-in insulation that fully covers the joists, bright clean light",
          {
            motion: "Slow push-in toward the ruler markings",
            onScreen: "Now rated R-49 💪",
            voiceover: "Deep, even coverage, up to R-49 for Texas weather.",
          }
        ),
        edit(
          "before-after",
          "Before / after wipe",
          "17–21 s",
          "Split-screen wipe from the 'problem' still (top, cool light) to the 'proof' still (bottom, warm light)",
          "BEFORE ⬆️ AFTER ⬇️ · VO: “Same attic. Totally different home.”"
        ),
        video(
          "result",
          "Result",
          "21–25 s",
          4,
          "A happy family relaxing on a couch in a warmly lit living room at night, kids under a blanket, a mug of cocoa steaming, warm golden grade, lower third clear for text",
          {
            onScreen: "FREE ESTIMATE · (817) 784-7136 · logo",
            voiceover:
              "Get winter-ready. Call American Insulation for your free estimate.",
          }
        ),
        image(
          "cover",
          "Reel cover / thumbnail",
          "Split image of the same attic: left half thin, patchy, old gray insulation in cold blue light; right half thick, fluffy, white fresh blown-in insulation in warm golden light with an installer in a navy shirt giving a thumbs up; empty space at the top for bold text",
          {
            aspect: "9:16",
            onScreen:
              "IG: ATTIC GLOW-UP: 1985 → R-49 · FB: Is YOUR attic this bad? · YT: OLD vs NEW Attic Insulation · TikTok: wait for the after 😳",
          }
        ),
      ],
    },
    {
      id: "insulation-ac-shuts-off",
      brandId: "insulation",
      day: "Sat Oct 24",
      time: "12:00 PM",
      format: "static",
      title: "“Our AC Finally Shuts Off”: Customer Spotlight",
      goal: "Social proof, trust",
      summary:
        "Review card from Brian H.'s real 5-star review. Generate the bedroom photo, then add stars, the quote, supporting line and footer in Canva. Word-for-word quote, first name + last initial only.",
      style:
        "Warm, inviting photorealistic premium home-lifestyle photography, no people, no text.",
      shots: [
        image(
          "bedroom",
          "Calm bedroom photo",
          "A bright upstairs bedroom in a modern Texas suburban home, late-afternoon golden sunlight through the window, a smart thermostat on the wall, a neatly made bed with a soft throw blanket, a small potted plant; the upper half of the frame softly blurred and uncluttered for a text overlay",
          {
            onScreen:
              "⭐⭐⭐⭐⭐ · “A definite difference can be felt and noticed.” · Upstairs AC used to run 10:30 AM to 7 PM nonstop. Not anymore. · Brian H., DFW homeowner · FREE estimate (817) 784-7136",
          }
        ),
      ],
    },

    /* ── HomeStop ─────────────────────────────────────────────────────── */
    {
      id: "homestop-window-signs",
      brandId: "homestop",
      day: "Mon Oct 19",
      time: "11:00 AM",
      format: "static",
      title: "4 Signs Your Windows Are Costing You Money",
      goal: "Education + leads",
      summary:
        "Old-window close-up; add the headline, checklist panel and footer in Canva (4:5, 9:16, 1:1).",
      style:
        "Photorealistic, sharp detail, professional home photography, no people, no text, no logos.",
      shots: [
        image(
          "window",
          "Old window close-up",
          "Interior close-up of an old aluminium-frame double-hung window in a Texas suburban living room: foggy condensation trapped between the panes, a faded slightly bent frame, a gap at the sill with a curtain gently blown inward by a draft, chipped white paint on the trim; soft overcast daylight outside showing a blurred suburban street with autumn trees; cool muted tones; window on the right two-thirds, plain wall on the left third and empty space at the top for text",
          {
            stillModel: "flux-2",
            onScreen:
              "4 SIGNS YOUR WINDOWS ARE COSTING YOU MONEY · ☐ Drafty ☐ Hard to open ☐ Foggy between the glass ☐ Outdated look · Checked 2 or more? Free window quote (214) 429-4629",
          }
        ),
      ],
    },
    {
      id: "homestop-siding-glow-up",
      brandId: "homestop",
      day: "Wed Oct 21",
      time: "6:30 PM",
      format: "reel",
      title: "From Tired to WOW: Siding Glow-Up",
      goal: "Reach + shares",
      summary:
        "28 s whole-house siding transformation ending on the one-stop message. Upbeat trending audio, cuts on the beat, captions burned in. Use real siding-job photos for the hook, tear-off and reveal if you have them.",
      style: HOMESTOP_STYLE,
      shots: [
        video(
          "hook",
          "Hook · tired house",
          "0–2 s",
          3,
          "Street-level shot of a 1990s single-story Texas suburban home with faded, peeling pale-yellow wood siding, warped boards, water stains, dull trim, overgrown shrubs, overcast flat light",
          {
            motion: "Slow push-in toward the front of the house",
            onScreen: "Neighbours were talking… 😬",
            voiceover: "This house needed some serious love.",
          }
        ),
        video(
          "rot",
          "The problem",
          "2–5 s",
          3,
          "Extreme close-up of rotten, crumbling wood siding near the ground with soft dark rot, peeling paint flakes and a small gap, side lighting",
          {
            motion: "A gloved finger presses into the soft wood",
            onScreen: "Rotten wood = hidden damage",
            voiceover: "Rotten wood like this lets in moisture and pests.",
          }
        ),
        video(
          "tearoff",
          "Day 1 · tear-off",
          "5–9 s",
          4,
          "Two installers in navy work shirts and hard hats on ladders pulling off old siding boards, exposing house wrap, debris falling into a dumpster, bright morning light",
          {
            motion: "Energetic, fast-paced",
            onScreen: "Day 1: Out with the old",
            voiceover: "So we tore it all off, replaced the rotten wood…",
          }
        ),
        video(
          "install",
          "New siding",
          "9–14 s",
          5,
          "Close-up of an installer nailing a fresh deep-gray fiber-cement lap siding board into place, a level resting on top, new boards in neat rows, warm sunlight",
          {
            onScreen: "New siding, board by board",
            voiceover:
              "…and installed brand-new siding built for Texas weather.",
          }
        ),
        video(
          "trim",
          "Trim + finish",
          "14–18 s",
          4,
          "Crisp white trim fitted around a window and the house corner, new deep-gray siding meeting clean white corners and a black front-door frame",
          {
            motion: "Smooth slider move along the wall",
            onScreen: "Details matter ✨",
            voiceover: "Fresh trim. Clean lines.",
          }
        ),
        video(
          "reveal",
          "Reveal",
          "18–24 s",
          6,
          "Golden-hour street view of the same single-story home now with modern deep-gray lap siding, bright white trim, a black front door, fresh mulch beds and trimmed shrubs, porch lights on, blue sky with soft clouds",
          {
            stillModel: "flux-2",
            referenceFrom: "hook",
            motion:
              "Drone-style slow pull-back revealing the whole house as the porch lights turn on",
            onScreen: "BEFORE ➜ AFTER (flash 0.5 s of the hook first)",
            voiceover: "Same house. Totally new look.",
          }
        ),
        edit(
          "cta",
          "End card",
          "24–28 s",
          "Blurred reveal still with a dark overlay, HomeStop logo and three lines of text",
          "Siding · Windows · Doors — one stop · FREE QUOTE: (214) 429-4629"
        ),
        image(
          "cover",
          "Reel cover",
          "Split image of the same single-story Texas home: left half faded peeling yellow siding under a gray sky, right half modern deep-gray siding with white trim under golden-hour light, a clean vertical divider, empty space at top center for a headline",
          {
            aspect: "9:16",
            onScreen:
              "IG: TIRED ➜ WOW · FB: SAME HOUSE. NEW LOOK. · YT: TIRED HOUSE ➜ WOW · TikTok: they didn't recognise it 😳",
          }
        ),
      ],
    },
    {
      id: "homestop-halloween-door",
      brandId: "homestop",
      day: "Fri Oct 23",
      time: "12:00 PM",
      format: "static",
      title: "Be the Best Door on the Block This Halloween",
      goal: "Engagement + timely",
      summary:
        "Halloween porch with a new front door; add the headline, sub-line and footer in Canva in an orange and black palette (4:5, 9:16, 1:1).",
      style:
        "Photorealistic, cozy and inviting rather than scary, no people, no text, no logos.",
      shots: [
        image(
          "porch",
          "Halloween porch",
          "Dusk shot of the front porch of a red-brick Texas suburban home with a brand-new modern matte-black fiberglass front entry door with a tall narrow glass panel, brushed-gold long handle and sleek black sidelights; carved glowing jack-o'-lanterns on the steps, stacked white and orange pumpkins, a dried corn-stalk bundle, warm wall sconces on both sides, soft purple-blue twilight sky; symmetrical eye-level composition, empty space at the top for a headline",
          {
            stillModel: "flux-2",
            onScreen:
              "BE THE BEST DOOR ON THE BLOCK 🎃 · New front entry doors that make every guest say “wow” · Free quote (214) 429-4629",
          }
        ),
      ],
    },
  ],
}
