// src/app/sitemap.js

import { generateSlug, generateJobSlug } from "@/lib/slugify";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";

const BASE_URL = "https://www.oekovolt.de";
// Auto-set to current deploy date
const LAST_DEPLOY = new Date();
// Legal pages rarely change — only update if you actually edit their content
const LEGAL_DATE = new Date("2025-01-01");
const STATIC_PAGES = [
  { path: "", changeFrequency: "weekly", priority: 1.0, lastModified: LAST_DEPLOY },
  { path: "/dienstleistungen/photovoltaik", changeFrequency: "monthly", priority: 0.9, lastModified: LAST_DEPLOY },
  { path: "/dienstleistungen/smarthome", changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/photovoltaikanlage", changeFrequency: "monthly", priority: 0.9, lastModified: LAST_DEPLOY },
  { path: "/produkte/stromspeicher", changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/warmepumpe", changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/wallbox", changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/smartmeter", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/produkte/smartenergyhome", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/produkte/mieterstrom", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/produkte/hersteller", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/service/finanzierung", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/service/repowering", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/service/stromtarif", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/service/vorteilswelt", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/service/direktvermaktung", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/referenzen/projekte", changeFrequency: "weekly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/referenzen/referenzkarte", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/forderungen/landesforderungen", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/forderungen/baurecht", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/forderungen/steuerlich", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/forderungen/richtlinen", changeFrequency: "monthly", priority: 0.5, lastModified: LAST_DEPLOY },
  { path: "/uber-uns/team", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/uber-uns/jobs", changeFrequency: "weekly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/agb", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_DATE },
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

// Fetch projects data
async function fetchAllProjects() {
  const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;
  const data = await authenticatedFetch(API_URL);
  return data?.message || [];
}

// Fetch jobs data
async function fetchAllJobs() {
  const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;
  const data = await authenticatedFetch(API_URL);
  return data?.message || [];
}

// Fetch landesforderungen data
async function fetchAllLandesforderungen() {
  const API_URL = `${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_lande.api.get_all_forderung_lande_pages`;
  const data = await authenticatedFetch(API_URL);
  return data?.message || [];
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
  const staticEntries = STATIC_PAGES.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const dynamicEntries = [];

  // Fetch every data source in parallel so the sitemap's total time is the
  // slowest single request (~5s cap), not the sum of all five. Each fetcher
  // already returns [] on failure, so a partial outage never breaks the sitemap.
  const [
    projects,
    jobs,
    landesforderungen,
    stromspeicherManufacturers,
    warmepumpeManufacturers,
  ] = await Promise.all([
    fetchAllProjects(),
    fetchAllJobs(),
    fetchAllLandesforderungen(),
    fetchStromspeicherManufacturers(),
    fetchWarmepumpeManufacturers(),
  ]);

  // 1. Project pages
  projects.forEach((project) => {
    const slug = generateSlug(project.title || project.name);
    if (slug) {
      dynamicEntries.push({
        url: `${BASE_URL}/referenzen/projekte/${slug}`,
        lastModified: project.modified ? new Date(project.modified) : LAST_DEPLOY,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  });

  // 2. Job pages
  jobs.forEach((job) => {
    const slug = generateJobSlug(job.name || job.title);
    if (slug) {
      dynamicEntries.push({
        url: `${BASE_URL}/uber-uns/jobs/${slug}`,
        lastModified: job.modified ? new Date(job.modified) : LAST_DEPLOY,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  });

  // 3. Landesforderungen pages
  landesforderungen.forEach((item) => {
    const title = item.firstcard_title || item.name || '';
    const slug = generateSlug(title);
    if (slug) {
      dynamicEntries.push({
        url: `${BASE_URL}/forderungen/landesforderungen/${slug}`,
        lastModified: item.modified ? new Date(item.modified) : LAST_DEPLOY,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  });

  // 4. Stromspeicher manufacturer pages (from stromspeicher page API)
  stromspeicherManufacturers.forEach((manufacturer) => {
    const slug = generateSlug(manufacturer.title);
    if (slug) {
      dynamicEntries.push({
        url: `${BASE_URL}/produkte/stromspeicher/${slug}`,
        lastModified: manufacturer.modified ? new Date(manufacturer.modified) : LAST_DEPLOY,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  });

  // 5. Warmepumpe manufacturer pages (from warmepumpe page API)
  warmepumpeManufacturers.forEach((manufacturer) => {
    const slug = generateSlug(manufacturer.title);
    if (slug) {
      dynamicEntries.push({
        url: `${BASE_URL}/produkte/warmepumpe/${slug}`,
        lastModified: manufacturer.modified ? new Date(manufacturer.modified) : LAST_DEPLOY,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  });

  const allEntries = [...staticEntries, ...dynamicEntries];

  return allEntries;
}