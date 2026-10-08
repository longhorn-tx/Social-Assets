import type { Brand } from "./types"

const SISTER =
  "Navy blue (#1A3174), red and white accents, real suburban Texas brick homes, bright sunny Texas light, clean trustworthy family feel."

export const BRANDS: Brand[] = [
  {
    id: "longhorn",
    name: "Longhorn",
    look: "Warm, plain-spoken Texas look: real Dallas–Fort Worth suburban brick homes, natural light, believable craftsmanship, no stock-photo fantasy.",
    contact: "Free design visit · (214) 251-4928 · longhorntx.com",
  },
  {
    id: "aeb",
    name: "American Eagle Builders",
    look: SISTER,
    contact: "Free estimate · (214) 239-3180 · americaneaglebuilders.com",
  },
  {
    id: "acc",
    name: "American Concrete Coatings",
    look: `Glossy flake or metallic coated concrete floors in clean, organized Texas garages, bright high-contrast lighting that shows off the shine. ${SISTER}`,
    contact: "Free estimate · (817) 839-3485 · garagefloorcoatingsdfw.com",
  },
  {
    id: "insulation",
    name: "American Insulation",
    look: `Real Texas attics and family homes, warm-versus-cold colour cues (orange heat, blue cold). ${SISTER}`,
    contact: "Free attic check · (817) 784-7136 · americaninsulationllc.com",
  },
  {
    id: "homestop",
    name: "HomeStop",
    look: "Bold stop-sign red with navy (#1A3174) and white, happy DFW families, finished upgraded homes, bright sunny Texas light.",
    contact: "One call · (214) 429-4629 · homestop.us",
  },
]
