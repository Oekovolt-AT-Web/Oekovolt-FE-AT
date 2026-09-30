// src/app/sitemap.js
//
// XML-Sitemap inkl. Bild-Sitemap (Referenzfotos) und Video-Sitemap (Mediathek).
// Regeln (SEO-Plan M08/M11):
//  - Nur indexierbare Seiten (gleiche Logik wie llms.txt: indexierbar() aus src/lib/llms.js).
//  - Jede Seite mit eigenem, echtem lastModified: wo vorhanden aus dem Stand-Datum der Datenquelle
//    (Förderdaten, Netzbetreiber, OeMAG, Widmung, Schneelast-Raster, Regionen, Ratgeber, Projekte …),
//    sonst ein fest gepflegtes Datum. Nie `new Date()` – sonst meldet jeder Build alle Seiten als geändert.

import { generateSlug } from "@/lib/slugify";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { sitemapLanguages } from "@/lib/hreflang";
import { alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { STELLEN, STELLEN_DATUM } from "@/data/stellen";
import { normalisiereApiProjekt } from "@/components/Project/projektDaten";
import { PROJEKTE, PROJEKTE_STAND } from "@/data/projekte";
import { REGIONEN } from "@/data/regionen";
import { LAENDER_SLUGS, STAND as LAENDER_STAND } from "@/data/bundeslaender";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";
import { NETZBETREIBER, STAND as NETZ_STAND, betreiberPfad } from "@/data/netzbetreiber";
import { STAND as OEMAG_STAND } from "@/data/oemag";
import { KUNDEN_STAND } from "@/data/kunden";
import { LEXIKON_STAND } from "@/data/lexikon";
import { mediathekSitemap } from "@/data/reels";
import { HINWEIS_INTERN } from "@/data/hinweisgeber";
import { FOERDERCALL } from "@/lib/foerdercall";
import { VERGABE_STAND } from "@/lib/kommunen/vergabe";
import { EGB_STAND } from "@/lib/egBetriebe";
import { DATENSCHUTZ_STAND } from "@/components/Datenschutz/datenschutz";
import { AGB_STAND } from "@/components/Agb/agb";
import { LAENDER as WIDMUNG_LAENDER, STAND as WIDMUNG_STAND, widmungsPfad } from "@/lib/flaeche/laender";
import { LAENDER as PV_LAENDER, landPfad } from "@/lib/bundesland/auswertung";
import { belegtePartner, indexierbar, speicherSeiten, wechselrichterSeiten } from "@/lib/llms";
// Metadaten des Schneelast-Rasters (GeoSphere SNOWGRID-CL, eigene Auswertung) – hier nur das Stand-Datum
import SCHNEELAST_RASTER from "../../data/schneelast/sk50-at.json";

// Hersteller-Slugs, die next.config.mjs per 301 auf die Übersicht umleitet –
// dürfen nie in der Sitemap stehen, auch wenn das Backoffice sie liefert.
// Liste synchron mit next.config.mjs (redirects) halten.
const WEITERGELEITETE_HERSTELLER = {
  stromspeicher: new Set(["akcome", "wuerth", "solis"]),
  warmepumpe: new Set(["schrack", "schweizer", "fronius", "trina"]),
};

const BASE_URL = "https://www.oekovolt.com";
// ACHTUNG: Hier stand frueher `new Date()`. Damit bekam JEDE statische Seite
// bei jedem Build einen neuen lastmod - Google wurde also bei jedem Deploy
// gemeldet, saemtliche Seiten haetten sich geaendert. Das entwertet das
// Signal und kostet Crawl-Vertrauen.
//
// Stattdessen feste Daten, die nur angefasst werden, wenn sich der INHALT
// der jeweiligen Seite wirklich aendert. Dynamische Seiten (Projekte, Jobs,
// Foerderungen, Hersteller) nutzen weiter den echten `modified`-Zeitstempel
// aus dem Backoffice.
const CONTENT_DATE = new Date("2026-06-06");   // letzter groesserer Inhaltsstand
const UPDATED_2026_09 = new Date("2026-09-28"); // Umstellung auf Österreich (alle Hauptseiten neu)
// Rechtstexte aendern sich praktisch nie
const LEGAL_DATE = new Date("2026-09-28");
// Regionalseiten: Stand der Recherche (Förderprogramme, Netzbetreiber)
const REGIONEN_DATUM = new Date("2026-09-29");
// Start der österreichischen Inhalte auf oekovolt.com
const AT_START = new Date("2026-09-28");
// Welle 4 (Werkzeuge & Landesseiten, Recherche 30.09.2026) – ein Datum für alle neuen Seiten
const WELLE4_DATUM = new Date("2026-09-30");

const MONATE = ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];
/** "2026-09-30" | "30.09.2026" | "30. September 2026" -> Date (UTC), sonst null */
function datum(wert) {
  if (!wert) return null;
  if (wert instanceof Date) return Number.isNaN(wert.getTime()) ? null : wert;
  const s = String(wert).trim();
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
  m = s.match(/^(\d{1,2})\.\s*([A-Za-zÄÖÜäöü]+)\s+(\d{4})$/);
  if (m && MONATE.includes(m[2].toLowerCase())) return new Date(Date.UTC(+m[3], MONATE.indexOf(m[2].toLowerCase()), +m[1]));
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t) : null;
}
/** Jüngstes gültiges Datum; ohne gültiges Datum der Ersatzwert */
const juengstes = (werte, ersatz) => werte.map(datum).filter(Boolean).reduce((a, b) => (!a || b > a ? b : a), null) || ersatz;

// Stand-Daten der Datenquellen (jeweils dort gepflegt, hier nur gelesen)
const STAND_FOERDERCALL = datum(FOERDERCALL.stand?.iso) || WELLE4_DATUM; // src/lib/foerdercall.js
const STAND_NETZ = datum(NETZ_STAND.iso) || WELLE4_DATUM; // src/data/netzbetreiber.js
const STAND_OEMAG = datum(OEMAG_STAND.geprueftAm) || WELLE4_DATUM; // src/data/oemag.js
const STAND_WIDMUNG = datum(WIDMUNG_STAND.iso) || WELLE4_DATUM; // src/lib/flaeche/laender.js (auch Flächen-Check)
const STAND_VERGABE = datum(VERGABE_STAND.iso) || WELLE4_DATUM; // src/lib/kommunen/vergabe.js
const STAND_EG_BETRIEBE = datum(EGB_STAND) || WELLE4_DATUM; // src/lib/egBetriebe.js
const STAND_SCHNEELAST = datum(SCHNEELAST_RASTER?.stand) || WELLE4_DATUM; // data/schneelast/sk50-at.json
const STAND_LAENDER = datum(LAENDER_STAND.iso) || REGIONEN_DATUM; // src/data/bundeslaender.js
const STAND_REGIONEN = juengstes(Object.values(REGIONEN).map((r) => r?.fakten?.stand), REGIONEN_DATUM); // src/data/regionen/*
const STAND_RATGEBER = juengstes(alleArtikel().map((a) => a.aktualisiert), UPDATED_2026_09); // src/content/ratgeber/*
// Rechtstexte: Stand steht im jeweiligen Text
const STAND_DATENSCHUTZ = datum(DATENSCHUTZ_STAND) || LEGAL_DATE;
const STAND_AGB = datum(AGB_STAND) || LEGAL_DATE;
// Landesseite /photovoltaik-bundesland/[land]: jüngstes Datum der zusammengeführten Quellen
// (Regionalseiten des Landes, Landesförderung, Netzbetreiber, Kundensitz, Schneelast-Raster – vgl. src/lib/bundesland/daten.js)
const standLandesseite = (land) =>
  juengstes(
    [...Object.values(REGIONEN).filter((r) => r?.land === land).map((r) => r?.fakten?.stand), LAENDER_STAND.iso, NETZ_STAND.iso, KUNDEN_STAND, SCHNEELAST_RASTER?.stand],
    WELLE4_DATUM,
  );
// Wechselrichter-Seiten (Paket P4, entstanden 30.09.2026): Stand aus partner.js, falls gepflegt
const WECHSELRICHTER_START = new Date("2026-09-30");

// Seiten, deren Inhalt nach dem oben hinterlegten Datum geändert wurde: Pfad -> Tag der Änderung.
// Gilt, wenn es jünger ist als das sonst ermittelte Datum. Bei jeder inhaltlichen Änderung einer Seite hier eintragen.
// Stand 30.09.2026 (SEO-Welle P1–P9 + QA): Seiten mit sichtbar geändertem Text, Hero, FAQ oder Querverweisen
// laut `git diff HEAD --stat` (Seitendatei, src/data/verlinkung.js, src/data/faqs.js, src/data/unternehmen.js,
// src/data/kennzahlen.js, src/data/regionen/salzburg.js …). Reine Metadaten-Änderungen (robots, Title,
// Description) zählen nicht. Seiten, deren Datum aus einer Datenquelle kommt, stehen hier nur, wenn sich
// der Text unabhängig davon geändert hat.
const GEAENDERT = {
  "/": "2026-09-30",
  "/gewerbe": "2026-09-30",
  "/produkte/photovoltaikanlage": "2026-09-30",
  "/produkte/mieterstrom": "2026-09-30",
  "/dienstleistungen/photovoltaik": "2026-09-30",
  "/dienstleistungen/smarthome": "2026-09-30",
  "/forderungen/bundesfoerderung": "2026-09-30",
  "/service/direktvermarktung": "2026-09-30",
  "/gewerbespeicher": "2026-09-30",
  "/hotellerie-tourismus": "2026-09-30",
  "/kommunen": "2026-09-30",
  "/energiegemeinschaften": "2026-09-30",
  "/ladeinfrastruktur": "2026-09-30",
  "/landwirtschaft": "2026-09-30",
  "/agri-pv": "2026-09-30",
  "/rechner/freiflaeche-pacht": "2026-09-30",
  "/rechner/gewerbe-pv": "2026-09-30",
  "/rechner/energiegemeinschaft": "2026-09-30",
  "/produkte/hersteller": "2026-09-30",
  "/produkte/stromspeicher": "2026-09-30",
  "/produkte/smartenergyhome": "2026-09-30",
  "/produkte/smartmeter": "2026-09-30",
  "/service/repowering": "2026-09-30",
  "/service/e-check": "2026-09-30",
  "/service/finanzierung": "2026-09-30",
  "/uber-uns": "2026-09-30",
  "/technik/parkregler": "2026-09-30",
  "/sponsoring": "2026-09-30",
  "/presse": "2026-09-30",
  "/faqs": "2026-09-30",
  "/standort-check": "2026-09-30",
  "/hinweisgeberschutz": "2026-09-30",
  "/ratgeber/einspeiseverguetung-2026": "2026-09-30",
  "/photovoltaik/salzburg": "2026-09-30",
};
const STATIC_PAGES = [
  { path: "", changeFrequency: "weekly", priority: 1.0, lastModified: UPDATED_2026_09 },
  { path: "/dienstleistungen/photovoltaik", changeFrequency: "monthly", priority: 0.9, lastModified: UPDATED_2026_09 },
  { path: "/dienstleistungen/smarthome", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/produkte/photovoltaikanlage", changeFrequency: "monthly", priority: 0.9, lastModified: UPDATED_2026_09 },
  { path: "/produkte/stromspeicher", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/produkte/warmepumpe", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/produkte/wallbox", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/produkte/smartmeter", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/produkte/smartenergyhome", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/produkte/mieterstrom", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/produkte/hersteller", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/service/finanzierung", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/service/repowering", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/service/stromtarif", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/service/vorteilswelt", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/service/direktvermarktung", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/referenzen/projekte", changeFrequency: "weekly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/referenzen/referenzkarte", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/forderungen/landesforderungen", changeFrequency: "monthly", priority: 0.7, lastModified: STAND_LAENDER },
  { path: "/forderungen/baurecht", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/forderungen/steuerlich", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/forderungen/richtlinien", changeFrequency: "monthly", priority: 0.5, lastModified: UPDATED_2026_09 },
  { path: "/uber-uns/team", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/uber-uns/jobs", changeFrequency: "weekly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/barrierefreiheit", changeFrequency: "yearly", priority: 0.3, lastModified: UPDATED_2026_09 },
  { path: "/termin", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/presse", changeFrequency: "daily", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/kommunen", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/gewerbe", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/landwirtschaft", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/photovoltaik", changeFrequency: "monthly", priority: 0.8, lastModified: STAND_REGIONEN },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/ratgeber", changeFrequency: "weekly", priority: 0.7, lastModified: STAND_RATGEBER },
  { path: "/solarrechner", changeFrequency: "monthly", priority: 0.9, lastModified: UPDATED_2026_09 },
  // Neue Werkzeuge & Wissensseiten (Redesign 2026)
  { path: "/angebot", changeFrequency: "monthly", priority: 0.9, lastModified: UPDATED_2026_09 },
  { path: "/rechner", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/rechner/stromspeicher", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/rechner/waermepumpe", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/rechner/wallbox", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/rechner/dynamischer-stromtarif", changeFrequency: "daily", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/foerdercheck", changeFrequency: "monthly", priority: 0.8, lastModified: UPDATED_2026_09 },
  // Live-Daten: Inhalt aendert sich viertelstuendlich
  { path: "/energie-live", changeFrequency: "hourly", priority: 0.8, lastModified: UPDATED_2026_09 },
  { path: "/wissen/lexikon", changeFrequency: "monthly", priority: 0.7, lastModified: datum(LEXIKON_STAND) || UPDATED_2026_09 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3, lastModified: STAND_DATENSCHUTZ },
  { path: "/agb", changeFrequency: "yearly", priority: 0.3, lastModified: STAND_AGB },
  { path: "/hinweisgeberschutz", changeFrequency: "yearly", priority: 0.3, lastModified: AT_START },
  // Eigenes Hinweisgebersystem nur, wenn aktiv (HINWEIS_INTERN=1, Build-Zeit) – sonst leitet
  // /hinweisgebersystem auf IntegrityLine um und darf nicht in der Sitemap stehen.
  // Beim Umschalten lastModified auf das Go-live-Datum setzen.
  ...(HINWEIS_INTERN ? [{ path: "/hinweisgebersystem", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE }] : []),

  // Österreich (Launch oekovolt.com, Gewerbe-Schwerpunkt)
  { path: "/uber-uns", changeFrequency: "monthly", priority: 0.7, lastModified: AT_START },
  { path: "/freiflaechen-photovoltaik", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/agri-pv", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/hotellerie-tourismus", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/gewerbespeicher", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/ladeinfrastruktur", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/energiegemeinschaften", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/chalets", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/standort-check", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/technik", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/technik/parkregler", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/technik/fernwartung", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/technik/scada", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/service/wartung", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/service/e-check", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/service/reinigung", changeFrequency: "monthly", priority: 0.7, lastModified: AT_START },
  { path: "/service/drohneninspektion", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/service/versicherung", changeFrequency: "monthly", priority: 0.7, lastModified: AT_START },
  { path: "/service/energieberatung", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/service/notstrom", changeFrequency: "monthly", priority: 0.8, lastModified: AT_START },
  { path: "/service/nachhaltigkeitsmarketing", changeFrequency: "monthly", priority: 0.6, lastModified: AT_START },
  { path: "/forderungen/bundesfoerderung", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  // Landingpage 3. EAG-Fördercall 2026 (08.–22.10.2026), Countdown/Status ändern sich täglich
  { path: "/forderungen/eag-foerdercall", changeFrequency: "daily", priority: 0.9, lastModified: STAND_FOERDERCALL },
  // Netzanmeldung (PV beim Netzbetreiber anmelden), Recherche 30.09.2026
  { path: "/netzanmeldung", changeFrequency: "monthly", priority: 0.8, lastModified: STAND_NETZ },
  { path: "/pv-award", changeFrequency: "monthly", priority: 0.6, lastModified: AT_START },
  { path: "/sponsoring", changeFrequency: "monthly", priority: 0.5, lastModified: AT_START },
  { path: "/partner", changeFrequency: "monthly", priority: 0.6, lastModified: AT_START },
  // Gewerbe-Rechner (Premium-Überarbeitung)
  { path: "/rechner/gewerbe-pv", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/peak-shaving", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/e-flotte", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/ladeinfrastruktur", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/energiegemeinschaft", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/blackout", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/co2-esg", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },
  { path: "/rechner/freiflaeche-pacht", changeFrequency: "monthly", priority: 0.9, lastModified: AT_START },

  // Welle 4: neue Werkzeuge und Fachseiten (Landes-Unterseiten weiter unten, dynamisch)
  // PV-Prognose: Inhalt ändert sich mit jedem Modelllauf, die Seite selbst ist statisch
  // Veröffentlicht 30.09.2026 (Welle 4); Stand-Angaben: lastgang-analyse/page.js (STAND), lib/rechner/finanzierung.js
  { path: "/pv-prognose", changeFrequency: "daily", priority: 0.8, lastModified: WELLE4_DATUM },
  { path: "/lastgang-analyse", changeFrequency: "monthly", priority: 0.8, lastModified: WELLE4_DATUM },
  { path: "/rechner/finanzierung", changeFrequency: "monthly", priority: 0.8, lastModified: WELLE4_DATUM },
  { path: "/flaechen-check", changeFrequency: "monthly", priority: 0.8, lastModified: STAND_WIDMUNG },
  { path: "/freiflaechen-photovoltaik/widmung", changeFrequency: "monthly", priority: 0.7, lastModified: STAND_WIDMUNG },
  { path: "/schneelast", changeFrequency: "yearly", priority: 0.7, lastModified: STAND_SCHNEELAST },
  // OeMAG-Monatswerte werden monatlich gepflegt (src/data/oemag.js)
  { path: "/einspeisung-gewerbe", changeFrequency: "monthly", priority: 0.8, lastModified: STAND_OEMAG },
  { path: "/energiegemeinschaften/betriebe-gemeinden", changeFrequency: "monthly", priority: 0.8, lastModified: STAND_EG_BETRIEBE },
  { path: "/kommunen/vergabe-foerderung", changeFrequency: "monthly", priority: 0.7, lastModified: STAND_VERGABE },
];

// Helper function to make authenticated fetch requests.
// A timeout guarantees the sitemap never hangs waiting on a slow backend —
// Google would otherwise see a "Temporary processing error".
async function authenticatedFetch(url, timeoutMs = 5000) {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = getApiHeaders();
    const res = await fetch(url, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      console.error(`API returned ${res.status} for ${url}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error?.name || error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Projekte – gleiche Quelle wie /referenzen/projekte (Slug = projektSlug, z. B. „mindelheim-2“).
// Rückgabe in API-Form (mit bild_url bzw. bilder[] für die Bild-Sitemap) und die Quelle.
async function fetchAllProjects() {
  const API_URL = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;
  const data = await authenticatedFetch(API_URL);
  const msg = data?.message;
  const liste = Array.isArray(msg) ? msg : msg?.projekte;
  // API, sonst statischer Stand src/data/projekte.js
  if (Array.isArray(liste) && liste.length) return { roh: liste.filter((p) => p && typeof p === "object"), statisch: false };
  return { roh: PROJEKTE, statisch: true };
}

// Bild-Sitemap: gleiche URLs wie auf der Projektseite (encodeURI(bild_url), vgl. referenzen/projekte/[title]/page.js).
// Next.js schreibt <image:loc> ungeprüft ins XML – deshalb hier XML-maskieren.
const xmlUrl = (u) => u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function projektBilder(p) {
  const roh = Array.isArray(p?.bilder) && p.bilder.length ? p.bilder : p?.bild_url ? [{ bild_url: p.bild_url }] : [];
  const urls = roh
    .map((b) => (typeof b === "string" ? b : b?.bild_url))
    .filter((u) => typeof u === "string" && /^https:\/\//.test(u))
    .map((u) => encodeURI(u));
  return [...new Set(urls)].slice(0, 1000).map(xmlUrl);
}

// Fetch stromspeicher manufacturers from the stromspeicher page API
async function fetchStromspeicherManufacturers() {
  const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords`;
  const data = await authenticatedFetch(API_URL);
  const stromspeicherData = data?.message;
  // Get the second card table (strom_second_card_table) which contains manufacturers
  const manufacturers = stromspeicherData?.strom_second_card_table || [];
  return manufacturers;
}

// Fetch warmepumpe manufacturers from the warmepumpe page API
async function fetchWarmepumpeManufacturers() {
  const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords`;
  const data = await authenticatedFetch(API_URL);
  const warmepumpeData = data?.message;
  // Get the third card options table (warmepumpe_third_card_options_table) which contains manufacturers
  const manufacturers = warmepumpeData?.warmepumpe_third_card_options_table || [];
  return manufacturers;
}

// Presse-Detailseiten – gleiche Quelle wie src/app/presse/[slug]/page.js
// (Kanal "website"). Eigener 5-s-Deckel wie authenticatedFetch(); ohne
// Backend bzw. bei Fehler/Timeout einfach keine Einträge.
async function fetchPresseMeldungen(timeoutMs = 5000) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve([]), timeoutMs);
  });
  try {
    const liste = await Promise.race([veroeffentlichungen({ kanal: "website", limit: 500 }), timeout]);
    return Array.isArray(liste) ? liste.filter((m) => m?.slug && m.kanaele?.website) : [];
  } catch (error) {
    console.error("Error fetching presse:", error?.name || error);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

const eintrag = (pfad, { lastModified, changeFrequency = "monthly", priority = 0.6, mitHreflang = false, images } = {}) => {
  const languages = mitHreflang ? sitemapLanguages(pfad || "/") : undefined;
  return {
    url: `${BASE_URL}${pfad}`,
    // GEAENDERT nur, wenn jünger als das Datum aus der Datenquelle (z. B. neue Pressemeldung nach dem 30.09.)
    lastModified: juengstes([GEAENDERT[pfad || "/"], lastModified], lastModified),
    changeFrequency,
    priority,
    ...(images?.length ? { images } : {}),
    ...(languages ? { alternates: { languages } } : {}),
  };
};

// Hersteller-Titel aus dem Backoffice gegen die belegten Marken aus partner.js prüfen
const istBelegt = (titel = "") => belegtePartner().some((p) => String(titel).toLowerCase().includes(p.title.toLowerCase()));

export default async function sitemap() {
  const [{ roh: projekteRoh, statisch: projekteStatisch }, stromspeicherManufacturers, warmepumpeManufacturers, presseMeldungen] = await Promise.all([
    fetchAllProjects(),
    fetchStromspeicherManufacturers(),
    fetchWarmepumpeManufacturers(),
    fetchPresseMeldungen(),
  ]);

  // Projekte: lastModified aus dem Backoffice (modified), beim statischen Stand dessen Datum
  const projektStandFallback = projekteStatisch ? datum(PROJEKTE_STAND) || CONTENT_DATE : CONTENT_DATE;
  const projekte = projekteRoh
    .map((r) => ({ p: normalisiereApiProjekt(r), bilder: projektBilder(r) }))
    .filter(({ p }) => p.slug)
    .map(({ p, bilder }) => ({ ...p, bilderSitemap: bilder, geaendert: datum(p.modified) || projektStandFallback }));
  const STAND_PROJEKTE = juengstes(projekte.map((p) => p.geaendert), projektStandFallback);
  const STAND_PRESSE = juengstes(presseMeldungen.map((m) => m.aktualisiert || m.datum), AT_START);

  // Übersichtsseiten erben das jüngste Datum ihrer Einträge
  const UEBERSICHT_STAND = {
    "/referenzen/projekte": STAND_PROJEKTE,
    "/referenzen/referenzkarte": STAND_PROJEKTE,
    "/presse": STAND_PRESSE,
  };

  // alternates nur für Seiten, die es auch auf oekovolt.com gibt – sonst lässt sitemapLanguages() das Feld weg.
  const staticEntries = STATIC_PAGES.map(({ path, changeFrequency, priority, lastModified }) =>
    eintrag(path, { lastModified: UEBERSICHT_STAND[path] || lastModified, changeFrequency, priority, mitHreflang: true }),
  );

  const dynamicEntries = [];

  // Netzanmeldung je Netzbetreiber – statisch aus src/data/netzbetreiber.js
  NETZBETREIBER.forEach((b) => {
    dynamicEntries.push(eintrag(betreiberPfad(b.slug), { lastModified: datum(b.geprueftAm) || STAND_NETZ, priority: 0.7 }));
  });

  // 1. Projektseiten mit Referenzfotos (Bild-Sitemap)
  projekte.forEach((p) => {
    dynamicEntries.push(eintrag(`/referenzen/projekte/${p.slug}`, { lastModified: p.geaendert, priority: 0.6, images: p.bilderSitemap }));
  });

  // 2. Stellen – ausschließlich aus src/data/stellen.js (österreichische Stellen).
  //    Das Backoffice liefert die Stellen der deutschen Gesellschaft, die hier nicht gelten.
  STELLEN.forEach((s) => {
    dynamicEntries.push(eintrag(`/uber-uns/jobs/${s.slug}`, { lastModified: new Date(STELLEN_DATUM), priority: 0.6 }));
  });

  // 3. Landesförderungen – statisch aus src/data/bundeslaender.js (neun Bundesländer)
  LAENDER_SLUGS.forEach((l) => {
    dynamicEntries.push(eintrag(l.pfad, { lastModified: STAND_LAENDER, priority: 0.7, mitHreflang: true }));
  });

  // 4. Stromspeicher-Herstellerseiten aus dem Backoffice – nur belegte Marken (partner.js), alle anderen stehen auf noindex.
  stromspeicherManufacturers.filter((m) => istBelegt(m.title)).forEach((manufacturer) => {
    const slug = generateSlug(manufacturer.title);
    if (slug && !WEITERGELEITETE_HERSTELLER.stromspeicher.has(slug)) {
      dynamicEntries.push(eintrag(`/produkte/stromspeicher/${slug}`, { lastModified: datum(manufacturer.modified) || CONTENT_DATE, mitHreflang: true }));
    }
  });

  // 5. Wärmepumpen-Herstellerseiten aus dem Backoffice – nur belegte Marken
  warmepumpeManufacturers.filter((m) => istBelegt(m.title)).forEach((manufacturer) => {
    const slug = generateSlug(manufacturer.title);
    if (slug && !WEITERGELEITETE_HERSTELLER.warmepumpe.has(slug)) {
      dynamicEntries.push(eintrag(`/produkte/warmepumpe/${slug}`, { lastModified: datum(manufacturer.modified) || CONTENT_DATE, mitHreflang: true }));
    }
  });

  // Speicher-Detailseiten der belegten Marken existieren auch ohne Backoffice (statisch aus partner.js)
  speicherSeiten().forEach(({ pfad, partner }) => {
    if (WEITERGELEITETE_HERSTELLER.stromspeicher.has(partner.slug)) return;
    dynamicEntries.push(eintrag(pfad, { lastModified: datum(partner.stand || partner.geprueftAm) || AT_START, mitHreflang: true }));
  });

  // Wechselrichter-Seiten (Paket P4): Pfade aus partner.js (nur belegte Marken), sobald die Routen existieren
  wechselrichterSeiten().forEach(({ pfad, partner }) => {
    dynamicEntries.push(
      eintrag(pfad, { lastModified: datum(partner?.stand || partner?.geprueftAm) || WECHSELRICHTER_START, priority: partner ? 0.6 : 0.7 }),
    );
  });

  // 6. Ratgeber-Artikel (aus dem Register, nicht aus der API – deshalb immer vorhanden).
  //    Österreich-spezifisch und nicht in SHARED_PATHS (src/lib/hreflang.js) -> bewusst ohne hreflang.
  const ratgeberEntries = alleArtikel().map((a) => eintrag(artikelPfad(a.slug), { lastModified: datum(a.aktualisiert) || STAND_RATGEBER, priority: 0.8 }));

  // 7. Regionalseiten /photovoltaik/[stadt]
  const regionEntries = Object.entries(REGIONEN).map(([slug, r]) =>
    eintrag(`/photovoltaik/${slug}`, { lastModified: datum(r.fakten?.stand) || REGIONEN_DATUM, priority: 0.7 }),
  );

  // 7b. Welle 4: Landesseiten – Slugs aus denselben Listen wie generateStaticParams
  //     (/photovoltaik-bundesland ohne Land leitet auf /photovoltaik um und fehlt deshalb bewusst)
  const landesEntries = [
    ...PV_LAENDER.map((l) => eintrag(landPfad(l.slug), { lastModified: standLandesseite(l.slug), priority: 0.7 })),
    ...WIDMUNG_LAENDER.map((l) => eintrag(widmungsPfad(l.slug), { lastModified: STAND_WIDMUNG, priority: 0.6 })),
    // /schneelast/<land> leitet seit M26 per 308 auf /schneelast#<land> weiter – keine eigenen Einträge
  ];

  // 8. Presse-Detailseiten /presse/[slug] (nur mit Kanal-Backend, sonst leer)
  presseMeldungen.forEach((m) => {
    dynamicEntries.push(eintrag(`/presse/${m.slug}`, { lastModified: datum(m.aktualisiert || m.datum) || AT_START, priority: 0.6 }));
  });

  // Mediathek: leer, solange keine Videos da sind (Seite dann noindex)
  const alle = [...staticEntries, ...dynamicEntries, ...ratgeberEntries, ...regionEntries, ...landesEntries, ...mediathekSitemap(BASE_URL)];

  // Doppelte URLs (z. B. Backoffice-Slug = statischer Slug) nur einmal; nicht indexierbare nie
  const gesehen = new Set();
  return alle.filter((e) => {
    if (gesehen.has(e.url)) return false;
    gesehen.add(e.url);
    return indexierbar(e.url.slice(BASE_URL.length) || "/");
  });
}
