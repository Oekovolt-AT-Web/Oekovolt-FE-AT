// src/app/forderungen/landesforderungen/[name]/antwort.js
//
// Reine Hilfsfunktionen der Landesförderungs-Seiten (kein React, kein fs): Titel ≤ 60 Zeichen,
// Zeilen des Antwortblocks (Programm, Zielgruppe, Höhe, Frist, Quelle) aus src/data/bundeslaender.js
// mit dem Programmstatus aus src/lib/programmStatus.js (Paket C01, Felder startIso/fristIso/
// gueltigBisIso/anzeigeStatus).

import { STAND, ZIELGRUPPEN } from "@/data/bundeslaender";
import { STATUS_LABEL, programmStatus } from "@/lib/programmStatus";

export const TITEL_MAX = 60;
export const JAHR_SPANNE = "2026/2027";

/** H1 in voller Länge (kein Zeichenlimit). */
export function h1Fuer(name) {
  return `Photovoltaik-Förderung ${name} ${JAHR_SPANNE} für Betriebe, Landwirtschaft und Gemeinden`;
}

/**
 * <title> ≤ 60 Zeichen: erste Variante, die passt, ohne Marke (Vorlage des Layouts ist „%s“).
 * „Photovoltaik-Förderung <Land> … für Betriebe & Gemeinden“ passt in keinem Land (≥ 62 Zeichen)
 * und ist deshalb nicht mehr enthalten; Landwirtschaft und Gemeinden stehen in H1 und Description.
 */
export function titelFuer(name) {
  const varianten = [
    `Photovoltaik-Förderung ${name} ${JAHR_SPANNE} für Betriebe`,
    `PV-Förderung ${name} ${JAHR_SPANNE} für Betriebe & Gemeinden`,
    `PV-Förderung ${name} ${JAHR_SPANNE} für Betriebe`,
    `PV-Förderung ${name} ${JAHR_SPANNE}`,
  ];
  return varianten.find((t) => t.length <= TITEL_MAX) || varianten[varianten.length - 1];
}

export function beschreibungFuer(name) {
  const lang = `PV-Förderung ${name} ${JAHR_SPANNE} für Betriebe, Landwirtschaft und Gemeinden: Landesprogramme mit Status, EAG-Zuschuss, Bauordnung, Netzbetreiber – Stand ${STAND.kurz}.`;
  return lang.length <= 160 ? lang : `PV-Förderung ${name} ${JAHR_SPANNE} für Betriebe und Gemeinden: Landesprogramme mit Status, EAG-Zuschuss, Bauordnung – Stand ${STAND.kurz}.`;
}

const ZG_LABEL = Object.fromEntries(ZIELGRUPPEN.map((z) => [z.id, z.label]));

/**
 * Status je Programm kommt aus src/lib/programmStatus.js (Paket C01): offen | bald | abgelaufen |
 * wartet. Die Beschriftung folgt STATUS_LABEL aus C01, damit Landesseite, Förder-Check und
 * Status-Tabelle dieselben Wörter zeigen.
 */
export const STATUS_TEXT = STATUS_LABEL;

/** Frist-Spalte: belegte Frist, sonst der Status-Wortlaut der Datenquelle. */
export function fristText(p) {
  if (p.fristIso) return `bis ${p.fristIso.split("-").reverse().join(".")}`;
  if (p.gueltigBisIso) return `gültig bis ${p.gueltigBisIso.split("-").reverse().join(".")}`;
  return p.status || "laufend, solange Mittel reichen";
}

/** Höhe kurz (für die Tabelle): erster Halbsatz bis zum Gedankenstrich/Semikolon, max. 90 Zeichen. */
export function hoeheKurz(hoehe = "") {
  const kurz = String(hoehe).split(/\s[–;]\s/)[0].trim();
  return kurz.length <= 90 ? kurz : `${kurz.slice(0, 87).trimEnd()}…`;
}

/**
 * Zeilen des Antwortblocks aus den Programmen eines Landes. Nur Programme für Betriebe,
 * Landwirtschaft und Gemeinden (reine Privatprogramme bleiben in der ausführlichen Liste).
 */
export function antwortZeilen(land, jetzt = Date.now()) {
  const relevant = (p) => (p.zielgruppen || []).some((z) => ["unternehmen", "landwirtschaft", "gemeinde", "energiegemeinschaft"].includes(z));
  return (land.programme || []).filter(relevant).map((p) => ({
    id: p.name,
    programm: p.name,
    traeger: p.traeger,
    zielgruppe: (p.zielgruppen || []).map((z) => ZG_LABEL[z] || z).join(", "),
    hoehe: hoeheKurz(p.hoehe),
    frist: fristText(p),
    status: programmStatus(p, jetzt),
    pruefen: Boolean(p.pruefen),
    quelle: p.quelle || "Förderstelle",
    url: p.url,
  }));
}

/** Gemeinde-Programme eines Landes (Zielgruppe gemeinde). */
export function gemeindeProgramme(land) {
  return (land.programme || []).filter((p) => (p.zielgruppen || []).includes("gemeinde"));
}
