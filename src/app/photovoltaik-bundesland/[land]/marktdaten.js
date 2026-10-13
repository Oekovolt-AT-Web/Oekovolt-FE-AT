// src/app/photovoltaik-bundesland/[land]/marktdaten.js
//
// Marktdaten je Bundesland für die Hubseiten /photovoltaik-bundesland/[land] – reine Daten,
// kein React. Jede Zahl trägt Quelle und Stichtag; was sich nicht belegen ließ, bleibt null
// und wird auf der Seite als „zu prüfen“ ausgewiesen (Regel: keine erfundenen Zahlen).
//
// Quellen (abgerufen 11.10.2026):
//  - Erfüllungsgrad: PV Austria, Dashboard je Bundesland (pvbaustria.at/dashboard/<land>/),
//    „Bis 2024 wurden X % der laut ÖNIP bis 2030 benötigten PV-Leistung in <Land> installiert.“
//    Datenstand der PV-Abschnitte: Juni 2025. Burgenland nennt nur „bis 2023“ (41 %); Kärnten nennt
//    31 % – auf der Landesseite „bis 2023“, in der Österreich-Übersicht „bis 2024“ (uneinheitlich).
//  - ÖNIP-Ausbaubedarf 2030 in MWp: PV Austria, Presseaussendung 07.07.2023 zum ÖNIP-Entwurf
//    (pressetext): Niederösterreich 5.600, Oberösterreich 3.800, Steiermark 3.300 MWp; Österreich
//    21.000 MWp statt 13.000 MWp laut EAG 2020. Für die übrigen sechs Länder nennt der Text keine
//    MWp-Werte – sie stehen nur in den Grafiken des Dashboards und bleiben hier offen (null).
//  - Der beschlossene ÖNIP (BMK 2024) führt die Bedarfe je Land in Abbildungen; die drei Werte oben
//    stammen aus dem Entwurf 2023 und sind als „laut ÖNIP-Entwurf 2023“ gekennzeichnet.
//
// PFLEGE: Nach dem nächsten Dashboard-Update (PV Austria aktualisiert jährlich im Sommer) Stichtag
// und Prozentwerte nachziehen; MWp-Werte nur ergänzen, wenn sie in einer Textquelle stehen.

export const MARKTDATEN_STAND = { iso: "2026-10-11", label: "11.10.2026", datenstand: "Juni 2025" };

export const MARKT_QUELLEN = {
  dashboard: { label: "PV Austria – Dashboard (Datenstand Juni 2025)", url: "https://pvbaustria.at/dashboard" },
  oenipEntwurf: { label: "PV Austria – ÖNIP hebt PV-Ausbaubedarf deutlich an (07.07.2023)", url: "https://www.pressetext.com/news/-nip-hebt-pv-ausbaubedarf-deutlich-an-und-zeigt-erstmals-unmissverstaendlich-den-handlungsauftrag-der-bundeslaender.html" },
  oenip: { label: "BMWET – Integrierter österreichischer Netzinfrastrukturplan (ÖNIP), finale Fassung 2024", url: "https://www.bmwet.gv.at/Services/Publikationen/publikationen-energie/netzinfrastrukturplan.html" },
};

/** Österreich gesamt – zur Einordnung der Landeswerte. */
export const MARKT_OESTERREICH = {
  oenipZiel2030Mw: 21000,
  oenipZielQuelle: "oenipEntwurf",
  erfuellungProzent: 45,
  erfuellungStichtag: "2024",
  quelle: "dashboard",
};

/**
 * Je Land: oenipZiel2030Mw (null = nicht belegt), erfuellungProzent (Anteil des ÖNIP-Bedarfs 2030,
 * der bis zum Stichtag installiert war), erfuellungStichtag, landeszielHinweis (Wortlaut des
 * Dashboards zum eigenen Landesziel), dashboardUrl.
 */
export const MARKTDATEN = {
  burgenland: {
    oenipZiel2030Mw: null,
    erfuellungProzent: 41,
    erfuellungStichtag: "2023",
    stichtagHinweis: "Das Dashboard nennt für das Burgenland nur den Stand bis 2023.",
    landeszielHinweis: "Das selbst gesetzte PV-Ausbauziel des Burgenlands bis 2030 genügt laut Dashboard, um den ÖNIP-Bedarf bis 2030 und 2040 zu decken.",
    dashboardUrl: "https://pvbaustria.at/dashboard/burgenland/",
  },
  kaernten: {
    oenipZiel2030Mw: null,
    erfuellungProzent: 31,
    erfuellungStichtag: "2023/2024",
    stichtagHinweis: "Stichtag im Dashboard uneinheitlich: Landesseite „bis 2023“, Österreich-Übersicht „bis 2024“.",
    landeszielHinweis: "Das von Kärnten selbst gesetzte PV-Ausbauziel bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf bis 2030.",
    dashboardUrl: "https://pvbaustria.at/dashboard/kaernten/",
  },
  niederoesterreich: {
    oenipZiel2030Mw: 5600,
    erfuellungProzent: 36,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das von Niederösterreich selbst gesetzte PV-Ausbauziel bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf bis 2030.",
    dashboardUrl: "https://pvbaustria.at/dashboard/niederoesterreich/",
  },
  oberoesterreich: {
    oenipZiel2030Mw: 3800,
    erfuellungProzent: 46,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das von Oberösterreich selbst gesetzte PV-Ausbauziel bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf bis 2030.",
    dashboardUrl: "https://pvbaustria.at/dashboard/oberoesterreich/",
  },
  salzburg: {
    oenipZiel2030Mw: null,
    erfuellungProzent: 43,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das von Salzburg selbst gesetzte PV-Ausbauziel bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf bis 2030.",
    dashboardUrl: "https://pvbaustria.at/dashboard/salzburg/",
  },
  steiermark: {
    oenipZiel2030Mw: 3300,
    erfuellungProzent: 47,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das von der Steiermark selbst gesetzte PV-Ausbauziel bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf bis 2030.",
    dashboardUrl: "https://pvbaustria.at/dashboard/steiermark/",
  },
  tirol: {
    oenipZiel2030Mw: null,
    erfuellungProzent: 36,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das selbst gesetzte PV-Ausbauziel Tirols (Zwischenziel laut Energie-Ziel-Szenarien) entspricht laut Dashboard nicht dem ÖNIP-Bedarf.",
    dashboardUrl: "https://pvbaustria.at/dashboard/tirol/",
  },
  vorarlberg: {
    oenipZiel2030Mw: null,
    erfuellungProzent: 55,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das selbst gesetzte PV-Ausbauziel Vorarlbergs bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf.",
    dashboardUrl: "https://pvbaustria.at/dashboard/vorarlberg/",
  },
  wien: {
    oenipZiel2030Mw: null,
    erfuellungProzent: 30,
    erfuellungStichtag: "2024",
    landeszielHinweis: "Das selbst gesetzte PV-Ausbauziel Wiens bis 2030 entspricht laut Dashboard nicht dem ÖNIP-Bedarf.",
    dashboardUrl: "https://pvbaustria.at/dashboard/wien/",
  },
};

/** Marktdaten zu einem Landes-Slug; null, wenn unbekannt. */
export function marktdatenFuerLand(slug) {
  const m = MARKTDATEN[slug];
  return m ? { slug, ...m } : null;
}

/** Rechnerisch noch offener Bedarf bis 2030 in MW – nur, wenn Ziel und Anteil belegt sind. */
export function offenerBedarfMw(m) {
  if (!m || m.oenipZiel2030Mw == null || m.erfuellungProzent == null) return null;
  return Math.round((m.oenipZiel2030Mw * (100 - m.erfuellungProzent)) / 100);
}
