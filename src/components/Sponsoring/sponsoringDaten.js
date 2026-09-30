// src/components/Sponsoring/sponsoringDaten.js
//
// Auswahlwerte der Sponsoring-Anfrage – gemeinsam genutzt von /sponsoring,
// dem Formular (Client) und /api/sponsoring (Server-Validierung).

export const SPONSORING_THEMA = "Sponsoring-Anfrage";

export const BEREICHE = ["Sport", "Kultur", "Bildung & Schulen", "Nachwuchs & Jugend", "Umwelt & Natur", "Soziales"];

export const ORGANISATIONSFORMEN = ["Verein", "Schule / Bildungseinrichtung", "Gemeinde / öffentliche Einrichtung", "Initiative / Projektgruppe", "Sonstige"];

export const REICHWEITEN = ["bis 100 Personen", "100–500 Personen", "500–2.000 Personen", "2.000–10.000 Personen", "über 10.000 Personen"];

export const UNTERSTUETZUNG = [
  "Finanzielles Sponsoring",
  "Sachleistung",
  "Vortrag oder Workshop zu Energie & Photovoltaik",
  "Beratung zu PV am Vereins- oder Schulgebäude",
  "Preise für eine Veranstaltung",
];

export const GEGENLEISTUNGEN = [
  "Logo auf Dressen / Bekleidung",
  "Bande, Banner oder Beschilderung",
  "Nennung auf Website & im Programmheft",
  "Beiträge in sozialen Medien",
  "Präsenz bei Veranstaltungen",
  "Bericht über die Mittelverwendung",
];

// ---------------------------------------------------------------------------
// Links zu geförderten Organisationen (SEO-Plan M28)
//
// Ein Link, der im Rahmen eines Sponsorings gesetzt wird, ist eine Gegenleistung
// und wird nach den Google-Richtlinien zu bezahlten Links als rel="sponsored"
// gekennzeichnet – auf unserer Seite wie auf der Seite des Partners.
// Einträge erscheinen auf /sponsoring nur mit `freigabe: true` (schriftliche
// Zustimmung der Organisation zur Nennung) und nur mit laufender Vereinbarung.
// ---------------------------------------------------------------------------

/** rel-Attribut für jeden Link auf eine geförderte Organisation. */
export const SPONSORING_REL = "sponsored noopener noreferrer";

/**
 * Geförderte Organisationen: { name, bereich (aus BEREICHE), ort, url, zeitraum, freigabe }.
 * Derzeit keine freigegebenen Einträge.
 */
export const GEFOERDERTE = [];

/** Nur freigegebene Einträge mit Link. */
export const GEFOERDERTE_SICHTBAR = GEFOERDERTE.filter((g) => g.freigabe === true && g.name && /^https:\/\//.test(g.url || ""));
