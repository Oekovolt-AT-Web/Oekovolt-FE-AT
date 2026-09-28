import { alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { BASE_URL } from "./veroeffentlichungen";

/** Ratgeber-Artikel im Eintragsformat der Feeds und des Fediverse. */
export function ratgeberEintraege(limit = 50) {
  return alleArtikel()
    .slice(0, limit)
    .map((a) => ({
      slug: a.slug,
      titel: a.title,
      url: `${BASE_URL}${artikelPfad(a.slug)}`,
      datum: a.veroeffentlicht,
      aktualisiert: a.aktualisiert || a.veroeffentlicht,
      teaser: a.excerpt || a.description,
      inhalt: `<p>${String(a.excerpt || a.description || "").replace(/</g, "&lt;")}</p><p><a href="${BASE_URL}${artikelPfad(a.slug)}">Zum vollständigen Artikel auf oekovolt.com</a></p>`,
      kategorie: a.kategorie,
      bildAbsolut: `${BASE_URL}/og/ratgeber/${a.slug}.jpg`,
      bildAlt: a.bildAlt || a.title,
      autor: "Ökovolt-Redaktion Österreich",
      hashtags: ["Photovoltaik", "Energiewende", "Österreich"],
    }));
}
