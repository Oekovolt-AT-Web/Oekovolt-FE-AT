// src/data/netzkapazitaetQuellen.js
//
// Kapazitäts-Wegweiser (Welle B, Paket B06): wo Netzbetreiber ihre freien Netzanschluss- bzw.
// Einspeisekapazitäten veröffentlichen. NUR LINKS – keine Kapazitätswerte kopieren oder spiegeln.
// Die Werte ändern sich laufend (quartalsweise Berechnung) und gehören dem jeweiligen Netzbetreiber.
//
// Felder je Eintrag:
//   slug            Netzbetreiber-Slug wie in src/data/netzbetreiber.js („alle“ = österreichweite Plattform)
//   name            Anzeigename
//   titel           Name der verlinkten Seite
//   url             Primärquelle (geprüft am geprueftAm, HTTP 200)
//   ebene           welche Netzebene bzw. welcher Anlagentyp abgedeckt ist
//   aktualisierung  Rhythmus laut Quelle
//   format          wie die Daten vorliegen (Karte, Tabelle, Bild)
//   quelle          Beleg für die Angaben zu Ebene und Rhythmus (wörtlich bzw. sinngemäß von der Seite)
//   geprueftAm      ISO-Datum der Prüfung
//   weitere         optionale Zusatzlinks desselben Betreibers
//
// Exporte für andere Pakete (C06 verlinkt aus /netzanmeldung/[betreiber] auf den Wegweiser):
//   KAPAZITAET_PFAD, KAPAZITAET_QUELLEN, KAPAZITAET_STAND, kapazitaetQuelleFuer(slug), hatEigeneKapazitaetsQuelle(slug)
// Reine Daten ohne Pfad-Aliase – per Node testbar.

export const KAPAZITAET_PFAD = "/netzanmeldung/netzkapazitaet";

/** Lead-Gate-Kennung für den individuellen Export (Eintrag in src/data/leadRechner.js: Paket B03). */
export const KAPAZITAET_GATE = "netzkapazitaet";

export const KAPAZITAET_STAND = { iso: "2026-10-12", label: "12.10.2026" };

export const KAPAZITAET_HINWEIS =
  "Veröffentlichte Kapazitäten sind eine Orientierung. Es besteht kein Rechtsanspruch auf die angezeigte Kapazität oder auf einen bestimmten Anschlusspunkt – den legt der Netzbetreiber nach Prüfung der vollständigen Anfrage fest.";

/** Rechtsgrundlagen, auf die sich die Betreiber berufen (Wortlaut der Betreiberseiten). */
export const KAPAZITAET_RECHT = [
  {
    norm: "§ 99 ElWG",
    text: "Veröffentlichung der gebuchten und verfügbaren Netzanschlusskapazitäten je Umspannwerk (Netzebene 4); die Betreiber aktualisieren laut eigenen Angaben quartalsweise.",
    quelle: { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91" },
  },
  {
    norm: "KBM-V 2022",
    text: "Kapazitätsberechnungsmethoden-Verordnung 2022 der E-Control: legt fest, wie die verfügbare Kapazität je Umspannwerk berechnet wird.",
    quelle: { titel: "LINZ NETZ – Auskunft freie Einspeisekapazitäten (nennt § 99 ElWG und KBM-V 2022)", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/einspeisekapazitaeten" },
  },
];

export const KAPAZITAET_QUELLEN = [
  {
    slug: "alle",
    name: "ebUtilities (alle Netzbetreiber)",
    titel: "Verfügbare Netzanschlusskapazitäten",
    url: "https://www.ebutilities.at/verfuegbare-netzanschlusskapazitaeten",
    ebene: "Netzebene 4 (Umspannwerke), österreichweit",
    aktualisierung: "quartalsweise durch die Netzbetreiber",
    format: "Karte und Tabelle",
    quelle: {
      titel: "Oesterreichs Energie – Presseinformation Netzkapazitäten (04.08.2023): Kapazitäten jedes Umspannwerks der Netzebene 4 auf ebUtilities, grafisch und tabellarisch, quartalsweise aktualisiert",
      url: "https://oesterreichsenergie.at/fileadmin/user_upload/20230804_PA_Netzkapazit%C3%A4ten.pdf",
    },
    geprueftAm: "2026-10-12",
  },
  {
    slug: "netz-niederoesterreich",
    name: "Netz Niederösterreich",
    titel: "Trafokarte für Einspeiser",
    url: "https://netz-noe.at/strom/versorgungsgebiete-und-kapazitaeten/trafokarte-fuer-einspeiser",
    ebene: "Trafostationen für kleinere und mittlere Anlagen (Typ A laut TOR); für Groß- und Größtanlagen gelten die Umspannwerke",
    aktualisierung: "laut Netz NÖ „Änderungen werden zeitnah aktualisiert“; Umspannwerke vierteljährlich",
    format: "interaktive Karte (Adresssuche) und Tabelle der Umspannwerke",
    quelle: {
      titel: "Netz NÖ – Trafokarte für Einspeiser: „Unverbindliche Auskunft“, „Für Groß- und Größtanlagen sind die Kapazitäten der Umspannwerke ausschlaggebend.“",
      url: "https://netz-noe.at/strom/versorgungsgebiete-und-kapazitaeten/trafokarte-fuer-einspeiser",
    },
    geprueftAm: "2026-10-12",
    weitere: [{ titel: "Kapazitäten der Umspannwerke", url: "https://netz-noe.at/strom/versorgungsgebiete-und-kapazitaeten/kapazitaeten-der-umspannwerke" }],
  },
  {
    slug: "linz-netz",
    name: "LINZ NETZ",
    titel: "Auskunft freie Einspeisekapazitäten",
    url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/einspeisekapazitaeten",
    ebene: "Netzebene 4 (Umspannwerk)",
    aktualisierung: "quartalsweise; die tatsächlich verfügbare Kapazität kann sich laut LINZ NETZ „täglich“ ändern",
    format: "Tabelle je Umspannwerk (gebucht/verfügbar)",
    quelle: {
      titel: "LINZ NETZ: „Die Berechnung wird quartalsweise durchgeführt, aktualisiert und das Ergebnis veröffentlicht.“ – „Es besteht jedoch kein Anspruch auf den Anschluss bei einem bestimmten Umspannwerk.“",
      url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/einspeisekapazitaeten",
    },
    geprueftAm: "2026-10-12",
  },
  {
    slug: "salzburg-netz",
    name: "Salzburg Netz",
    titel: "Freie Einspeisekapazitäten",
    url: "https://www.salzburgnetz.at/stromnetz/erzeugung/freie-einspeisekapazitaeten.html",
    ebene: "Netzebene 4 (Umspannwerk)",
    aktualisierung: "quartalsweise",
    format: "Übersicht als Bild je Quartal",
    quelle: {
      titel: "Salzburg Netz: „Die Daten werden quartalsweise aktualisiert.“ – „Anhand dieser Information besteht kein Rechtsanspruch auf eine Einspeisekapazität.“",
      url: "https://www.salzburgnetz.at/stromnetz/erzeugung/freie-einspeisekapazitaeten.html",
    },
    geprueftAm: "2026-10-12",
  },
];

const NACH_SLUG = new Map(KAPAZITAET_QUELLEN.map((q) => [q.slug, q]));

/** true, wenn der Betreiber eine eigene Kapazitätsseite hat (sonst gilt ebUtilities). */
export const hatEigeneKapazitaetsQuelle = (slug) => slug !== "alle" && NACH_SLUG.has(slug);

/**
 * Kapazitätsquelle für einen Netzbetreiber; ohne eigene Seite die österreichweite Plattform ebUtilities.
 * @param {string} slug Netzbetreiber-Slug aus src/data/netzbetreiber.js
 */
export function kapazitaetQuelleFuer(slug) {
  return NACH_SLUG.get(slug) || NACH_SLUG.get("alle");
}

/** Was „frei“ bzw. „verfügbar“ bedeutet – Erklärtexte für die Wegweiser-Seite (ohne Werte). */
export const BEGRIFFE = [
  {
    begriff: "Netzebene 4",
    text: "Die Umspannung von Hochspannung (110 kV) auf Mittelspannung (meist 20 oder 30 kV) – also das Umspannwerk. Freiflächen- und große Dachanlagen werden typischerweise im Mittelspannungsnetz angeschlossen, das an einem solchen Umspannwerk hängt.",
  },
  {
    begriff: "gebucht",
    text: "Kapazität, die bereits zugesagt oder reserviert ist – auch für Anlagen, die noch nicht gebaut sind.",
  },
  {
    begriff: "verfügbar / frei",
    text: "Was nach der Berechnungsmethode (KBM-V 2022) am Umspannwerk noch übrig ist. Das ist eine Momentaufnahme zum Stichtag der Veröffentlichung, keine Zusage.",
  },
  {
    begriff: "Trafostation vor Ort",
    text: "Unterhalb des Umspannwerks können Mittelspannungsleitung oder Ortsnetz-Trafo schon voll sein. Deshalb kann ein Umspannwerk mit freier Kapazität trotzdem einen Anschluss am Wunschpunkt ausschließen – und umgekehrt.",
  },
];

/**
 * Betreiber mit eigener Kapazitätsseite je Bundesland (Slugs wie src/lib/flaeche/laender.js).
 * Gebietszuordnung laut BUNDESLAENDER_NETZ in src/data/netzbetreiber.js; LINZ NETZ versorgt nur Linz und Umland.
 */
export const KAPAZITAET_JE_LAND = {
  niederoesterreich: [{ slug: "netz-niederoesterreich", gebiet: "Niederösterreich" }],
  oberoesterreich: [{ slug: "linz-netz", gebiet: "Linz und Umlandgemeinden" }],
  salzburg: [{ slug: "salzburg-netz", gebiet: "Land Salzburg" }],
};

/**
 * Kapazitätsquellen für ein Bundesland: eigene Betreiberseiten (falls vorhanden) plus immer ebUtilities.
 * @param {string} landSlug z. B. „oberoesterreich“
 * @returns {Array<object>} Einträge aus KAPAZITAET_QUELLEN, ergänzt um gebiet
 */
export function kapazitaetQuellenFuerLand(landSlug) {
  const eigene = (KAPAZITAET_JE_LAND[landSlug] || []).map((e) => ({ ...NACH_SLUG.get(e.slug), gebiet: e.gebiet })).filter((q) => q.url);
  return [...eigene, { ...NACH_SLUG.get("alle"), gebiet: "alle Bundesländer" }];
}
