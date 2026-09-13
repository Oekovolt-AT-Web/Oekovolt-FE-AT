/** Sprechende Anker-ID für Hersteller und Kategorien (z. B. "hersteller-wuerth"). */
export const herstellerId = (t) =>
  `hersteller-${String(t)
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
