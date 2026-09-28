// src/app/sitemap.js

import { generateSlug } from "@/lib/slugify";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { sitemapLanguages } from "@/lib/hreflang";
import { alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { STELLEN, STELLEN_DATUM } from "@/data/stellen";
import { normalisiereApiProjekt } from "@/components/Project/projektDaten";
import { REGIONEN } from "@/data/regionen";
import { LAENDER_SLUGS, STAND as LAENDER_STAND } from "@/data/bundeslaender";
import { istBelegterPartner } from "@/components/Produktdetail/HerstellerDetail";

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
  { path: "/forderungen/landesforderungen", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
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
  { path: "/photovoltaik", changeFrequency: "monthly", priority: 0.8, lastModified: REGIONEN_DATUM },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6, lastModified: UPDATED_2026_09 },
  { path: "/ratgeber", changeFrequency: "weekly", priority: 0.7, lastModified: UPDATED_2026_09 },
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
  { path: "/wissen/lexikon", changeFrequency: "monthly", priority: 0.7, lastModified: UPDATED_2026_09 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/agb", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/hinweisgeberschutz", changeFrequency: "yearly", priority: 0.3, lastModified: AT_START },

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
  { path: "/pv-award", changeFrequency: "monthly", priority: 0.6, lastModified: AT_START },
  { path: "/sponsoring", changeFrequency: "monthly", priority: 0.5, lastModified: AT_START },
  { path: "/partner", changeFrequency: "monthly", priority: 0.6, lastModified: AT_START },
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

// Projekte – gleiche Quelle wie /referenzen/projekte (Slug = projektSlug, z. B. „mindelheim-2“)
async function fetchAllProjects() {
  const API_URL = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;
  const data = await authenticatedFetch(API_URL);
  const msg = data?.message;
  const liste = Array.isArray(msg) ? msg : msg?.projekte;
  return (Array.isArray(liste) ? liste : []).map(normalisiereApiProjekt).filter((p) => p.slug);
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

export default async function sitemap() {
  // alternates nur fuer Seiten, die es auch auf oekovolt.com gibt — sonst
  // laesst sitemapLanguages() das Feld weg (undefined wird nicht gerendert).
  const staticEntries = STATIC_PAGES.map(({ path, changeFrequency, priority, lastModified }) => {
    const languages = sitemapLanguages(path || "/");
    return {
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
      ...(languages ? { alternates: { languages } } : {}),
    };
  });

  const dynamicEntries = [];

  // Fetch every data source in parallel so the sitemap's total time is the
  // slowest single request (~5s cap), not the sum of all five. Each fetcher
  // already returns [] on failure, so a partial outage never breaks the sitemap.
  const [
    projects,
    stromspeicherManufacturers,
    warmepumpeManufacturers,
  ] = await Promise.all([
    fetchAllProjects(),
    fetchStromspeicherManufacturers(),
    fetchWarmepumpeManufacturers(),
  ]);

  // 1. Project pages
  projects.forEach((project) => {
    const slug = project.slug;
    if (slug) {
      dynamicEntries.push({
        url: `${BASE_URL}/referenzen/projekte/${slug}`,
        lastModified: project.modified ? new Date(project.modified) : CONTENT_DATE,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  });

  // 2. Stellen – ausschließlich aus src/data/stellen.js (österreichische Stellen).
  //    Das Backoffice liefert die Stellen der deutschen Gesellschaft, die hier nicht gelten.
  STELLEN.forEach((s) => {
    dynamicEntries.push({
      url: `${BASE_URL}/uber-uns/jobs/${s.slug}`,
      lastModified: new Date(STELLEN_DATUM),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  // 3. Landesförderungen – statisch aus src/data/bundeslaender.js (neun Bundesländer)
  LAENDER_SLUGS.forEach((l) => {
    const languages = sitemapLanguages(l.pfad);
    dynamicEntries.push({
      url: `${BASE_URL}${l.pfad}`,
      lastModified: new Date(LAENDER_STAND.iso),
      changeFrequency: "monthly",
      priority: 0.7,
      ...(languages ? { alternates: { languages } } : {}),
    });
  });

  // 4. Stromspeicher manufacturer pages (from stromspeicher page API)
  // Nur belegte Partner – alle anderen Herstellerseiten stehen auf noindex.
  stromspeicherManufacturers.filter((m) => istBelegterPartner(m.title)).forEach((manufacturer) => {
    const slug = generateSlug(manufacturer.title);
    if (slug) {
      const languages = sitemapLanguages(`/produkte/stromspeicher/${slug}`);
      dynamicEntries.push({
        url: `${BASE_URL}/produkte/stromspeicher/${slug}`,
        lastModified: manufacturer.modified ? new Date(manufacturer.modified) : CONTENT_DATE,
        changeFrequency: "monthly",
        priority: 0.6,
        ...(languages ? { alternates: { languages } } : {}),
      });
    }
  });

  // 5. Warmepumpe manufacturer pages (from warmepumpe page API)
  // Nur belegte Partner – alle anderen Herstellerseiten stehen auf noindex.
  warmepumpeManufacturers.filter((m) => istBelegterPartner(m.title)).forEach((manufacturer) => {
    const slug = generateSlug(manufacturer.title);
    if (slug) {
      const languages = sitemapLanguages(`/produkte/warmepumpe/${slug}`);
      dynamicEntries.push({
        url: `${BASE_URL}/produkte/warmepumpe/${slug}`,
        lastModified: manufacturer.modified ? new Date(manufacturer.modified) : CONTENT_DATE,
        changeFrequency: "monthly",
        priority: 0.6,
        ...(languages ? { alternates: { languages } } : {}),
      });
    }
  });

  // 6. Ratgeber-Artikel (aus dem Register, nicht aus der API - deshalb immer
  //    vorhanden, auch wenn das Backoffice gerade nicht antwortet).
  //    Deutschlandspezifisch -> bewusst ohne alternates/hreflang.
  const ratgeberEntries = alleArtikel().map((a) => ({
    url: `${BASE_URL}${artikelPfad(a.slug)}`,
    lastModified: new Date(a.aktualisiert),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 7. Regionalseiten /photovoltaik/[stadt]
  const regionEntries = Object.entries(REGIONEN).map(([slug, r]) => ({
    url: `${BASE_URL}/photovoltaik/${slug}`,
    lastModified: new Date(r.fakten?.stand || REGIONEN_DATUM),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const allEntries = [...staticEntries, ...dynamicEntries, ...ratgeberEntries, ...regionEntries];

  return allEntries;
}