import { generateSlug, generateJobSlug } from "@/lib/slugify";

const BASE_URL = "https://www.oekovolt.de";
const API_BASE = "https://backoffice.oekovolt.de/api/method/";

// Auto-set to current deploy date
const LAST_DEPLOY = new Date();
// Legal pages rarely change — only update if you actually edit their content
const LEGAL_DATE = new Date("2025-01-01");

const STATIC_PAGES = [
  { path: "",               changeFrequency: "weekly",  priority: 1.0,  lastModified: LAST_DEPLOY },

  // Dienstleistungen
  { path: "/dienstleistungen/photovoltaik", changeFrequency: "monthly", priority: 0.9, lastModified: LAST_DEPLOY },
  { path: "/dienstleistungen/smarthome",    changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },

  // Produkte
  { path: "/produkte/photovoltaikanlage",  changeFrequency: "monthly", priority: 0.9, lastModified: LAST_DEPLOY },
  { path: "/produkte/stromspeicher",       changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/warmepumpe",          changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/wallbox",             changeFrequency: "monthly", priority: 0.8, lastModified: LAST_DEPLOY },
  { path: "/produkte/smartmeter",          changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/produkte/smartenergyhome",     changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/produkte/mieterstrom",         changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/produkte/hersteller",          changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },

  // Service
  { path: "/service/finanzierung",       changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/service/repowering",         changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/service/stromtarif",         changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/service/vorteilswelt",       changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/service/direktvermaktung",   changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },

  // Referenzen
  { path: "/referenzen/projekte",      changeFrequency: "weekly",  priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/referenzen/referenzkarte", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },

  // Förderungen
  { path: "/forderungen/landesforderungen", changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/forderungen/baurecht",          changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/forderungen/steuerlich",        changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/forderungen/richtlinen",        changeFrequency: "monthly", priority: 0.5, lastModified: LAST_DEPLOY },

  // Über uns
  { path: "/uber-uns/team", changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/uber-uns/jobs", changeFrequency: "weekly",  priority: 0.6, lastModified: LAST_DEPLOY },

  // Info
  { path: "/kontakt",    changeFrequency: "monthly", priority: 0.7, lastModified: LAST_DEPLOY },
  { path: "/faqs",       changeFrequency: "monthly", priority: 0.6, lastModified: LAST_DEPLOY },
  { path: "/impressum",  changeFrequency: "yearly",  priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/datenschutz",changeFrequency: "yearly",  priority: 0.3, lastModified: LEGAL_DATE },
  { path: "/agb",        changeFrequency: "yearly",  priority: 0.3, lastModified: LEGAL_DATE },
];

export default async function sitemap() {
  const staticEntries = STATIC_PAGES.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const dynamicEntries = [];

  // Fetch project pages
  try {
    const res = await fetch(
      `${API_BASE}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (Array.isArray(data.message)) {
      data.message.forEach((project) => {
        const slug = generateSlug(project.title || project.name);
        if (slug) {
          dynamicEntries.push({
            url: `${BASE_URL}/referenzen/projekte/${slug}`,
            lastModified: project.modified ? new Date(project.modified) : LAST_DEPLOY,
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      });
    }
  } catch {
    // skip dynamic project entries if API is unreachable
  }

  // Fetch job pages
  try {
    const res = await fetch(
      `${API_BASE}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (Array.isArray(data.message)) {
      data.message.forEach((job) => {
        const slug = generateJobSlug(job.name);
        if (slug) {
          dynamicEntries.push({
            url: `${BASE_URL}/uber-uns/jobs/${slug}`,
            lastModified: job.modified ? new Date(job.modified) : LAST_DEPLOY,
            changeFrequency: "weekly",
            priority: 0.5,
          });
        }
      });
    }
  } catch {
    // skip dynamic job entries if API is unreachable
  }

  // Fetch hersteller detail pages (Stromspeicher + Wärmepumpe slug pages)
  try {
    const res = await fetch(
      `${API_BASE}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller_page.api.get_hersteller_page_with_keywords`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const table = data?.message?.hersteller_data_table;

    if (Array.isArray(table)) {
      const categoryToPath = {
        "Stromspeicher": "/produkte/stromspeicher",
        "Wärmepumpe":    "/produkte/warmepumpe",
      };

      table.forEach((category) => {
        const basePath = categoryToPath[category.hersteller_category];
        if (!basePath || !Array.isArray(category.hersteller_list)) return;

        category.hersteller_list.forEach((item) => {
          const slug = generateJobSlug(item.title);
          if (slug) {
            dynamicEntries.push({
              url: `${BASE_URL}${basePath}/${slug}`,
              lastModified: item.modified ? new Date(item.modified) : LAST_DEPLOY,
              changeFrequency: "monthly",
              priority: 0.6,
            });
          }
        });
      });
    }
  } catch {
    // skip hersteller detail entries if API is unreachable
  }

  return [...staticEntries, ...dynamicEntries];
}
