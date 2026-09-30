// src/lib/kundenbuehneServer.js
//
// Serverseitiges Laden für die Kundenbühne (Siegel, Social-Kit, ESG-Bericht, Bildrouten).
// Projekt: wie die Detailseite aus dem Backoffice (get_projekte/get_projekt), sonst
// src/data/projekte.js. Kundendaten: Backoffice-Felder am Projekt gewinnen, sonst
// src/data/kunden.js (Schlüssel = Projekt-Slug). Fehlt die Datei oder der Eintrag,
// bleibt der Kunde null – Siegel/Kit/ESG funktionieren dann mit dem Projektnamen.
import { cache } from "react";
import { ladeProjekteRoh, ladeProjektRoh } from "@/components/Project/ladeProjekte";
import { normalisiereApiProjekt, projektSlug } from "@/components/Project/projektDaten";
import { kundeZusammenfuehren, schaetzung } from "@/lib/kundenbuehne";
import { BASE_URL } from "@/lib/site";

// src/data/kunden.js wird parallel gepflegt und kann (noch) fehlen: optional laden.
// Ein fehlendes Modul innerhalb von try/catch meldet der Bundler nur als Warnung.
let KUNDEN = {};
try {
  const modul = require("@/data/kunden");
  KUNDEN = modul?.KUNDEN || modul?.default?.KUNDEN || {};
} catch {
  KUNDEN = {};
}

/** Eintrag aus src/data/kunden.js (über den URL-Slug, sonst über projekt_website_name) */
export function kundenEintrag(...schluessel) {
  for (const s of schluessel) if (s && KUNDEN && typeof KUNDEN[s] === "object") return KUNDEN[s];
  return null;
}

/** Kundendaten für ein Rohprojekt der API (bzw. aus src/data/projekte.js) */
export function kundeFuerProjekt(roh, slug) {
  return kundeZusammenfuehren({ api: roh, eintrag: kundenEintrag(slug, roh?.projekt_website_name) });
}

/**
 * Alles, was die Kundenbühne für ein Projekt braucht.
 * @returns {Promise<null | {projekt, kunde, firma, ort, jahr, zahlen, veraltet}>}
 *   veraltet = true, wenn die URL noch den alten Slug (projekt_website_name) nutzt
 */
export const ladeKundenbuehne = cache(async (title) => {
  const liste = await ladeProjekteRoh();
  const treffer = liste.find((p) => projektSlug(p) === title) || liste.find((p) => p?.projekt_website_name === title);
  if (!treffer) return null;
  const roh = (await ladeProjektRoh(treffer.projekt_website_name)) || treffer;
  const projekt = normalisiereApiProjekt(roh);
  if (!projekt.slug) return null;
  const kunde = kundeFuerProjekt(roh, projekt.slug);
  const ertragApi = Number(roh?.ertrag) || null;
  const zahlen = schaetzung({ kwp: projekt.kwp, ertragKwh: ertragApi });
  return {
    projekt,
    kunde,
    firma: kunde?.firma || projekt.titel,
    ort: projekt.ort || kunde?.ort || "",
    jahr: projekt.jahr || kunde?.jahr || null,
    zahlen,
    veraltet: projekt.slug !== title,
  };
});

/**
 * Metadaten der Kit-Unterseiten (Siegel, Social-Kit, ESG): noindex,follow und Canonical auf
 * die Projektseite – die Unterseiten sind Werkzeuge, kein eigener Inhalt für Suchmaschinen.
 */
export function kitMetadata(daten, { titel, beschreibung }) {
  if (!daten) return { title: "Projekt nicht gefunden | Ökovolt", robots: { index: false, follow: true } };
  const canonical = `${BASE_URL}/referenzen/projekte/${daten.projekt.slug}`;
  return {
    title: `${titel} – ${daten.firma} | Ökovolt`.slice(0, 70),
    description: beschreibung.slice(0, 160),
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}
