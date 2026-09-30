// src/data/fachpruefer.js
//
// Fachprüfer für Ratgeber-Artikel (SEO-Plan M22, Entscheidung E5).
//
// GRUNDSATZ: Eine Person erscheint auf der Website – sichtbar UND im Schema
// (Person, `reviewedBy`) – NUR, wenn
//   1. `einwilligung: true` gesetzt ist (schriftliche Einwilligung liegt vor,
//      Datum in `einwilligungDatum`, Ablage im Personalakt/DSGVO-Dokumentation) und
//   2. `rolle` und `qualifikation` ausgefüllt und belegt sind (keine erfundenen Titel).
// Solange eine Bedingung fehlt, liefern alle Helfer unten nichts – kein Name,
// kein Schema, keine Autorenzeile.
//
// Stand 30.09.2026: Personen vom Auftraggeber benannt, Einwilligung, Rolle und
// Qualifikation noch offen → alle unsichtbar.
//
// PFLEGE:
//   - `id` bleibt stabil (Anker /uber-uns/team#<id>, Schema-@id).
//   - `bild`: Foto unter public/Images/AT/team/<id>.jpg (quadratisch, ≥ 600 px),
//     nur mit Einwilligung zur Veröffentlichung des Fotos.
//   - `profil`: öffentliches Profil der Person (z. B. LinkedIn) – nur mit Einwilligung.
//   - `themen`: Fachgebiete (schema.org `knowsAbout`), z. B. ["Netzanschluss", "TOR Erzeuger"].
//   - Zuordnung zu Artikeln: Feld `fachpruefer: "<id>"` im Artikel unter
//     src/content/ratgeber/*, sonst gilt STANDARD_FACHPRUEFER (oder niemand).
//   - Widerruf der Einwilligung: `einwilligung` auf false setzen und neu deployen.

import { BASE_URL } from "@/lib/site";

export const FACHPRUEFER = [
  { id: "peter-strohbichler", name: "Peter Strohbichler", rolle: "", qualifikation: "", themen: [], bild: "", profil: "", einwilligung: false, einwilligungDatum: "" },
  { id: "ivan-kovacevic", name: "Ivan Kovacevic", rolle: "", qualifikation: "", themen: [], bild: "", profil: "", einwilligung: false, einwilligungDatum: "" },
  { id: "oleg-stein", name: "Oleg Stein", rolle: "", qualifikation: "", themen: [], bild: "", profil: "", einwilligung: false, einwilligungDatum: "" },
];

/** Standard-Fachprüfer für Artikel ohne eigene Zuordnung (id oder ""). */
export const STANDARD_FACHPRUEFER = "";

/** Darf die Person gezeigt werden? Einwilligung UND belegte Rolle/Qualifikation. */
export const istSichtbar = (p) => Boolean(p && p.einwilligung === true && p.name && p.rolle && p.qualifikation);

/** Alle Fachprüfer, die gezeigt werden dürfen. */
export const FACHPRUEFER_SICHTBAR = FACHPRUEFER.filter(istSichtbar);

/** Fachprüfer nach id – null, wenn unbekannt oder (noch) nicht freigegeben. */
export function fachpruefer(id) {
  const p = FACHPRUEFER.find((x) => x.id === id);
  return istSichtbar(p) ? p : null;
}

/** Fachprüfer für einen Ratgeber-Artikel (eigenes Feld oder Standard) – null ohne Freigabe. */
export const fachprueferFuerArtikel = (artikel) => fachpruefer(artikel?.fachpruefer || STANDARD_FACHPRUEFER);

/** Autorenseite (Anker auf der Teamseite). */
export const fachprueferPfad = (p) => `/uber-uns/team#${p.id}`;

/** schema.org Person – nur für freigegebene Personen, sonst null. */
export function fachprueferSchema(p) {
  if (!istSichtbar(p)) return null;
  const url = `${BASE_URL}${fachprueferPfad(p)}`;
  return {
    "@type": "Person",
    "@id": url,
    name: p.name,
    url,
    jobTitle: p.rolle,
    description: p.qualifikation,
    worksFor: { "@id": `${BASE_URL}/#organization` },
    ...(p.themen?.length ? { knowsAbout: p.themen } : {}),
    ...(p.bild ? { image: `${BASE_URL}${p.bild}` } : {}),
    ...(p.profil ? { sameAs: [p.profil] } : {}),
  };
}
