const BASE_URL = "https://www.oekovolt.de";
const API_BASE = "https://backoffice.oekovolt.de/api/method/";

function generateSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\s–—]+/g, "-")
    .replace(/\//g, "-")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateJobSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "");
}

const STATIC_PAGES = [
  { path: "",               changeFrequency: "weekly",  priority: 1.0  },

  // Dienstleistungen
  { path: "/dienstleistungen/photovoltaik", changeFrequency: "monthly", priority: 0.9 },
  { path: "/dienstleistungen/smarthome",    changeFrequency: "monthly", priority: 0.8 },

  // Produkte
  { path: "/produkte/photovoltaikanlage",  changeFrequency: "monthly", priority: 0.9 },
  { path: "/produkte/stromspeicher",       changeFrequency: "monthly", priority: 0.8 },
  { path: "/produkte/warmepumpe",          changeFrequency: "monthly", priority: 0.8 },
  { path: "/produkte/wallbox",             changeFrequency: "monthly", priority: 0.8 },
  { path: "/produkte/smartmeter",          changeFrequency: "monthly", priority: 0.7 },
  { path: "/produkte/smartenergyhome",     changeFrequency: "monthly", priority: 0.7 },
  { path: "/produkte/mieterstrom",         changeFrequency: "monthly", priority: 0.7 },
  { path: "/produkte/hersteller",          changeFrequency: "monthly", priority: 0.6 },

  // Service
  { path: "/service/finanzierung",       changeFrequency: "monthly", priority: 0.7 },
  { path: "/service/repowering",         changeFrequency: "monthly", priority: 0.7 },
  { path: "/service/stromtarif",         changeFrequency: "monthly", priority: 0.7 },
  { path: "/service/vorteilswelt",       changeFrequency: "monthly", priority: 0.6 },
  { path: "/service/direktvermaktung",   changeFrequency: "monthly", priority: 0.7 },

  // Referenzen
  { path: "/referenzen/projekte",      changeFrequency: "weekly",  priority: 0.7 },
  { path: "/referenzen/referenzkarte", changeFrequency: "monthly", priority: 0.6 },

  // Förderungen
  { path: "/forderungen/landesforderungen", changeFrequency: "monthly", priority: 0.7 },
  { path: "/forderungen/baurecht",          changeFrequency: "monthly", priority: 0.6 },
  { path: "/forderungen/steuerlich",        changeFrequency: "monthly", priority: 0.6 },
  { path: "/forderungen/richtlinen",        changeFrequency: "monthly", priority: 0.5 },

  // Über uns
  { path: "/uber-uns/team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/uber-uns/jobs", changeFrequency: "weekly",  priority: 0.6 },

  // Info
  { path: "/kontakt",    changeFrequency: "monthly", priority: 0.7 },
  { path: "/faqs",       changeFrequency: "monthly", priority: 0.6 },
  { path: "/impressum",  changeFrequency: "yearly",  priority: 0.3 },
  { path: "/datenschutz",changeFrequency: "yearly",  priority: 0.3 },
  { path: "/agb",        changeFrequency: "yearly",  priority: 0.3 },
];

export default async function sitemap() {
  const staticEntries = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
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
            lastModified: project.modified ? new Date(project.modified) : new Date("2025-01-15"),
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
            lastModified: job.modified ? new Date(job.modified) : new Date("2025-01-15"),
            changeFrequency: "weekly",
            priority: 0.5,
          });
        }
      });
    }
  } catch {
    // skip dynamic job entries if API is unreachable
  }

  return [...staticEntries, ...dynamicEntries];
}
