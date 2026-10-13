// src/data/solarkataster.js
//
// Solarkataster (Solarpotenzial-Karten) der neun Bundesländer – NUR Links, keine Daten.
// Die Bundesland-Hubseiten /photovoltaik-bundesland/[land] verlinken je Land genau einen
// amtlichen Einstieg (Land oder Landeshauptstadt), damit Betriebe das Dachpotenzial selbst
// nachschlagen können. Wir übernehmen keine Werte aus den Katastern – maßgeblich bleibt die
// Planung mit Lastgang, Dachplan und Verschattung.
//
// Jede URL ist manuell geprüft (Datum in `geprueft`). status:
//   bestaetigt    – Seite erreichbar, Solar-Ebene auf der Seite bestätigt
//   unbestaetigt  – Geoportal des Landes erreichbar, eine landesweite Dach-Solarebene ließ sich
//                   zum Prüfdatum nicht bestätigen (Anzeige als „Geoportal <Land>“, nicht als Solarkataster)
//   gesperrt      – Seite laut Suchindex vorhanden, Server hat die Prüfverbindung abgewiesen
//                   (öffentlich nur „Link zum Prüfdatum nicht abrufbar“, kein Prüfjargon)
//   keiner        – kein landesweiter Dach-Solarkataster bekannt; Link auf das Geoportal des Landes
//
// PFLEGE: alle 90 Tage neu prüfen (Paket C08, Welle C). Nie „offizielles Portal“ schreiben –
// die Kataster sind Angebote der Länder, Ökovolt ist nicht Betreiber.

export const SOLARKATASTER_STAND = { iso: "2026-10-11", label: "11.10.2026" };

export const SOLARKATASTER = [
  {
    land: "burgenland",
    name: "GeoDaten Burgenland (Geoportal des Landes)",
    url: "https://geodaten.bgld.gv.at/",
    betreiber: "Land Burgenland, GeoDaten Burgenland Servicestelle",
    geprueft: "2026-10-11",
    status: "keiner",
    hinweis: "Ein landesweiter Dach-Solarkataster war zum Prüfdatum nicht auffindbar. Das Geoportal zeigt Katastralmappe und Flächenwidmung; PV-Eignungszonen für Freiflächen regelt das Land gesondert.",
  },
  {
    land: "kaernten",
    name: "Solarpotenzialkataster Kärnten (KAGIS, Kärnten Atlas)",
    url: "https://www.ktn.gv.at/Themen-AZ/Details?thema=1&detail=428",
    betreiber: "Land Kärnten, KAGIS",
    geprueft: "2026-10-11",
    status: "gesperrt",
    hinweis: "Eignung bestehender Dachflächen in Klassen mit kWh je m² und Jahr, kostenlos im Kärnten Atlas. Die Landesseite war zum Prüfdatum für uns nicht abrufbar – öffnet der Link nicht, finden Sie den Kataster auf ktn.gv.at unter „Themen A–Z“.",
    // intern: Server hat die automatische Prüfverbindung abgewiesen; Seite laut Suchindex vorhanden (Detail 428).
  },
  {
    land: "niederoesterreich",
    name: "NÖ Atlas (Geoportal des Landes)",
    url: "https://atlas.noe.gv.at/",
    betreiber: "Land Niederösterreich",
    geprueft: "2026-10-11",
    status: "unbestaetigt",
    hinweis: "Geoportal erreichbar; eine landesweite Solarpotenzial-Ebene für Dachflächen ließ sich zum Prüfdatum nicht bestätigen. Für Ertragsfragen nutzen wir PVGIS und die eigene Verschattungsanalyse.",
  },
  {
    land: "oberoesterreich",
    name: "DORIS – Solares Energieangebot (Sonnenscheindauer und Strahlung)",
    url: "https://www.doris.at/",
    betreiber: "Land Oberösterreich, DORIS (Digitales Oberösterreichisches Raum-Informations-System)",
    geprueft: "2026-10-11",
    status: "bestaetigt",
    hinweis: "DORIS führt unter „Bauen und Wohnen“ das Kartenthema „Solares Energieangebot“ (Sonnenscheindauer, Strahlung) und unter „Energie“ die Prüfflächen für Photovoltaik-Freiflächen (Agro-PV). Ein gebäudescharfer Dachkataster ist es nicht.",
  },
  {
    land: "salzburg",
    name: "Solarpotenzialkataster Land Salzburg (SAGIS)",
    url: "https://www.salzburg.gv.at/themen/energie/energieberatung/geodaten-zugaenge",
    betreiber: "Land Salzburg, Referate Geodateninfrastruktur und Energiewirtschaft, mit GeoSphere Austria",
    geprueft: "2026-10-11",
    status: "bestaetigt",
    hinweis: "Laserscan-basierter Kataster (1-m-Raster, Jahres- und Monatswerte), Dokumentation Oktober 2022 im SAGIS-Download. Zugang über „Geodaten Abfrage (SAGIS)“ der Energieberatung des Landes.",
    dokumentation: "https://www.salzburg.gv.at/sagisdaten_download/Allgemein/Solarpotentialkataster_SBG.pdf",
  },
  {
    land: "steiermark",
    name: "Solarpotenzial Steiermark – SolarTool im Digitalen Atlas",
    url: "https://gis.stmk.gv.at/atlas2/Solartool.html",
    betreiber: "Land Steiermark, Abteilungen 15 (Energie, Wohnbau, Technik) und 17 (Landes- und Regionalentwicklung)",
    geprueft: "2026-10-11",
    status: "bestaetigt",
    hinweis: "Eignung und technisches Potenzial der Dachflächen für PV und Solarthermie; Bericht je ausgewählter Fläche per E-Mail. Solardachkataster auch als offene Daten (CC BY 4.0 AT).",
    dokumentation: "https://www.landesentwicklung.steiermark.at/cms/beitrag/12910759/145230171",
  },
  {
    land: "tirol",
    name: "Solarpotenziale Tirol (tirisMaps)",
    url: "https://www.tirol.gv.at/statistik-budget/tiris/tiris-anwendungen/solarpotenziale-tirol",
    betreiber: "Land Tirol, tiris",
    geprueft: "2026-10-11",
    status: "bestaetigt",
    hinweis: "Solarer Energieertrag je Dachteilfläche, Sonnenstand-Analyse und Besonnungsdauer in tirisMaps. Datengrundlage 2012–2015 (Projekt SOLAR TIROL); das Land kündigt eine Neuberechnung an.",
  },
  {
    land: "vorarlberg",
    name: "Vorarlberg Atlas (VOGIS, Geoportal des Landes)",
    url: "https://atlas.vorarlberg.at/",
    betreiber: "Land Vorarlberg, VOGIS",
    geprueft: "2026-10-11",
    status: "unbestaetigt",
    hinweis: "Geoportal erreichbar; eine landesweite Solarpotenzial-Ebene für Dachflächen ließ sich zum Prüfdatum nicht bestätigen. Das Energieinstitut Vorarlberg berät unabhängig zu Dachpotenzial und Förderung.",
  },
  {
    land: "wien",
    name: "Wiener Solarkarte 2025 (Wien Umweltgut)",
    url: "https://www.wien.gv.at/umweltgut/public/",
    betreiber: "Stadt Wien (Wien Umweltgut, Rückmeldungen an die MA 22)",
    geprueft: "2026-10-11",
    status: "bestaetigt",
    hinweis: "Eignungsklassen je Dachfläche von „sehr gut“ (über 1.250 kWh/m²a) bis „schlecht“ (unter 600 kWh/m²a), dazu Schutzbereiche Bau und Schutzgebiete Natur – wichtig für Schutzzonen und Welterbe.",
  },
];

/**
 * Anzeige je Status (kein „offiziell“, keine Wertung der Länder, kein interner Prüfjargon).
 * label: Statuszeile unter dem Namen · ueberschrift(land): Kopfzeile der Karte · link: Linktext ·
 * geprueft: Satz zum Prüfdatum. Nur bei „bestaetigt“ heißt die Karte „Solarkataster“ – ein
 * allgemeines Geoportal wird nicht als Solarkataster ausgegeben.
 */
export const SOLARKATASTER_STATUS = {
  bestaetigt: {
    label: "Solar-Ebene bestätigt",
    kurz: "bestätigt",
    ueberschrift: (land) => `Solarkataster ${land}`,
    link: "Zum Solarkataster",
    geprueft: "Link geprüft am",
  },
  unbestaetigt: {
    label: "Geoportal des Landes, Solar-Ebene zu prüfen",
    kurz: "prüfen",
    ueberschrift: (land) => `Geoportal ${land}`,
    link: "Zum Geoportal des Landes",
    geprueft: "Link geprüft am",
  },
  gesperrt: {
    label: "Solarkataster des Landes, Link zum Prüfdatum nicht abrufbar",
    kurz: "prüfen",
    ueberschrift: (land) => `Solarkataster ${land}`,
    link: "Zur Seite des Landes",
    geprueft: "Erreichbarkeit nicht bestätigt, zuletzt geprüft am",
  },
  keiner: {
    label: "kein landesweiter Dach-Solarkataster bekannt",
    kurz: "keiner",
    ueberschrift: (land) => `Geoportal ${land}`,
    link: "Zum Geoportal des Landes",
    geprueft: "Link geprüft am",
  },
};

/** Eintrag zu einem Landes-Slug (wie in src/lib/bundesland/auswertung.js); null, wenn unbekannt. */
export function solarkatasterFuerLand(slug) {
  return SOLARKATASTER.find((s) => s.land === slug) ?? null;
}
