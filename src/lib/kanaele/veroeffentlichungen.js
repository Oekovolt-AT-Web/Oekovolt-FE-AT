// src/lib/kanaele/veroeffentlichungen.js
//
// Veröffentlichungen (Pressemitteilungen, Unternehmensnews, Projekte …) aus Frappe.
// Jede Veröffentlichung wird im Backoffice per Haken einzelnen Kanälen zugeordnet:
//   website · rss · tv (SCADA-/Info-Bildschirme) · fediverse (Mastodon, Threads …)

import sanitizeHtml from "sanitize-html";
import { kanal, kanalKonfiguriert } from "./frappe";
import { DEMO, demoAktiv } from "./demo";

export const BASE_URL = "https://www.oekovolt.de";

export const KATEGORIEN = [
  { id: "Pressemitteilung", plural: "Pressemitteilungen", farbe: "navy" },
  { id: "Unternehmensnews", plural: "Unternehmensnews", farbe: "ov" },
  { id: "Projekt", plural: "Projekte", farbe: "sun" },
  { id: "Produkt & Technik", plural: "Produkt & Technik", farbe: "ov" },
  { id: "Kommunen & Stadtwerke", plural: "Kommunen & Stadtwerke", farbe: "navy" },
  { id: "Veranstaltung", plural: "Veranstaltungen", farbe: "sun" },
];

export const slugPfad = (slug) => `/presse/${slug}`;

const ERLAUBT = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "img", "figure", "figcaption", "hr"],
  allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "width", "height"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
  allowedSchemes: ["https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  transformTags: {
    h1: "h2",
    a: (tag, attr) => {
      const extern = /^https?:\/\//.test(attr.href || "") && !String(attr.href).startsWith(BASE_URL);
      return { tagName: "a", attribs: { ...attr, ...(extern ? { target: "_blank", rel: "noopener noreferrer" } : {}) } };
    },
  },
};

/** Frappe-Dateipfad (/files/…) -> absolute, öffentlich abrufbare URL über den Bild-Proxy. */
export function dateiUrl(pfad, absolut = false) {
  if (!pfad) return null;
  if (/^https?:\/\//.test(pfad)) return pfad;
  const rel = pfad.startsWith("/Images/") || pfad.startsWith("/og/") ? pfad : `/api/image?path=${encodeURIComponent(pfad)}`;
  return absolut ? `${BASE_URL}${rel}` : rel;
}

const HTML_BILD_PROXY = (html) =>
  html.replace(/src="(\/files\/[^"]+)"/g, (_, p) => `src="${BASE_URL}/api/image?path=${encodeURIComponent(p)}"`);

export function normalisiere(v) {
  if (!v?.slug || !v?.titel) return null;
  const inhalt = HTML_BILD_PROXY(sanitizeHtml(v.inhalt || "", ERLAUBT));
  return {
    slug: String(v.slug),
    titel: String(v.titel),
    kategorie: v.kategorie || "Unternehmensnews",
    datum: v.veroeffentlicht_am || v.creation,
    aktualisiert: v.modified || v.veroeffentlicht_am,
    teaser: String(v.teaser || "").trim(),
    inhalt,
    bild: dateiUrl(v.bild),
    bildAbsolut: dateiUrl(v.bild, true),
    bildAlt: v.bild_alt || v.titel,
    anhang: v.anhang ? { url: dateiUrl(v.anhang), name: v.anhang_name || "Pressemitteilung (PDF)" } : null,
    ort: v.ort || "Türkheim",
    hashtags: String(v.hashtags || "")
      .split(/[\s,]+/)
      .map((h) => h.replace(/^#/, "").trim())
      .filter(Boolean),
    kanaele: { website: !!v.auf_website, rss: !!v.im_rss_feed, tv: !!v.auf_tv, fediverse: !!v.im_fediverse },
    tv: {
      dauer: Number(v.tv_dauer_sekunden) || 15,
      bis: v.tv_anzeigen_bis || null,
      prioritaet: Number(v.tv_prioritaet) || 0,
      standorte: String(v.tv_standorte || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      qrLink: v.tv_qr_link || null,
      hervorhebung: v.tv_hervorhebung || "",
    },
    url: `${BASE_URL}${slugPfad(v.slug)}`,
  };
}

/**
 * Liste veröffentlichter Einträge für einen Kanal.
 * kanal: "website" | "rss" | "tv" | "fediverse"
 */
export async function veroeffentlichungen({ kanal: k = "website", kategorie, limit = 50, revalidate = 300 } = {}) {
  if (demoAktiv()) {
    const feld = { website: "auf_website", rss: "im_rss_feed", tv: "auf_tv", fediverse: "im_fediverse" }[k];
    return DEMO.filter((d) => d[feld] && (!kategorie || d.kategorie === kategorie)).map(normalisiere);
  }
  if (!kanalKonfiguriert()) return [];
  try {
    const liste = await kanal("liste", { kanal: k, kategorie: kategorie || "", limit }, { revalidate, tags: ["veroeffentlichungen"] });
    return (Array.isArray(liste) ? liste : []).map(normalisiere).filter(Boolean);
  } catch {
    return [];
  }
}

export async function veroeffentlichung(slug, { revalidate = 300 } = {}) {
  if (demoAktiv()) return normalisiere(DEMO.find((d) => d.slug === slug));
  if (!kanalKonfiguriert() || !slug) return null;
  try {
    return normalisiere(await kanal("detail", { slug }, { revalidate, tags: ["veroeffentlichungen", `v:${slug}`] }));
  } catch {
    return null;
  }
}

/** Klartext aus HTML (Feeds, Push, Meta). */
export const klartextHtml = (html, max = 0) => {
  const t = sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  return max && t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};
