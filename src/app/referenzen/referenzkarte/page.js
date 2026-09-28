// referenzen/referenzkarte/page.js

import { BatteryCharging, Building2, Images, MapPin, PlugZap, Thermometer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ReferenzKarte from "@/components/Referenzkarte/ReferenzKarte";
import { FIRMENSITZ, ortPasst } from "@/components/Referenzkarte/standorte";
import { orteAusProjekten } from "@/lib/referenzOrte";
import ProjektKarte from "@/components/Project/ProjektKarte";
import { bildUrl, fmtKwp, kennzahlen, normalisiereProjekt, projektSlug } from "@/components/Project/projektDaten";
import {
  API_BASE_URL,
  getApiHeaders,
  isApiConfigured,
} from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

// Old API: page texts (titles, cards, images)
// New API: map places + projects
const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzstandorde_page.api.get_referenzstandorde_page`;
const KARTE_URL = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_referenzkarte`;
const PROJEKTE_URL = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;
const RK_PAGE_URL = "https://www.oekovolt.com/referenzen/referenzkarte";

// ---------- API helpers ----------

async function fetchSeitenDaten() {
  if (!isApiConfigured()) return null;
  try {
    const res = await fetch(DATA_URL, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`Referenzkarte-Seite API returned ${res.status}:`, await res.text());
      return null;
    }
    return (await res.json()).message;
  } catch (error) {
    console.error("Error fetching Referenzkarte page:", error);
    return null;
  }
}

async function fetchReferenzkarte() {
  if (!isApiConfigured()) return null;
  try {
    const res = await fetch(KARTE_URL, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`Referenzkarte API returned ${res.status}:`, await res.text());
      return null;
    }
    const data = await res.json();
    return data?.message || null;
  } catch (error) {
    console.error("Error fetching Referenzkarte:", error);
    return null;
  }
}

const bildLink = (b) => (b?.bild_url ? encodeURI(b.bild_url) : "");

/** Project from the new API → format for ProjektKarte */
function projektAusApi(p) {
  let basis = {};
  try {
    basis = normalisiereProjekt(p) || {};
  } catch {
    basis = {};
  }
  const kwp = p?.leistung != null && p.leistung !== "" ? Number(p.leistung) : basis.kwp ?? null;
  const bilderRoh = Array.isArray(p?.bilder) && p.bilder.length ? p.bilder : p?.bild_url ? [{ bild_url: p.bild_url }] : [];
  const bilder = bilderRoh.map(bildLink).filter(Boolean);
  return {
    ...basis,
    slug: projektSlug(p) || basis.slug,
    titel: p?.projekt_name || basis.titel || "",
    jahr: p?.jahr || basis.jahr || null,
    ort: p?.ort || basis.ort || "",
    segment: p?.objekt || basis.segment || "",
    dacharten: p?.dach ? [p.dach] : basis.dacharten || [],
    kwp,
    leistungText: p?.leistung_label || (kwp != null ? `${fmtKwp(kwp)} kWp` : ""),
    bilder,
    bild: bilder[0] || basis.bild || "",
  };
}

/** Projects + totals from get_projekte: { projekte, anzahl, summeKwp } */
async function fetchProjekteListe() {
  const leer = { projekte: [], anzahl: 0, summeKwp: 0 };
  if (!isApiConfigured()) return leer;
  try {
    const res = await fetch(PROJEKTE_URL, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`Projekte API returned ${res.status}:`, await res.text());
      return leer;
    }
    const m = (await res.json())?.message || {};
    const projekte = Array.isArray(m.projekte) ? m.projekte.map(projektAusApi).filter((p) => p.slug) : [];
    return {
      projekte,
      anzahl: Number(m.anzahl) || projekte.length,
      summeKwp: Number(m.summe_kwp) || projekte.reduce((s, p) => s + (p.kwp || 0), 0),
    };
  } catch (error) {
    console.error("Error fetching Projekte:", error);
    return leer;
  }
}

/** Project (from get_projekte or get_referenzkarte) → { slug, titel, leistung } for the links on the map */
function projektLink(p) {
  const slug = p?.slug || projektSlug(p);
  if (!slug) return null;
  return { slug, titel: p.titel || p.projekt_name || slug, leistung: p.leistungText || p.leistung_label || "" };
}

/** Place from the API → same format as STANDORTE (id, label, lat, lng, land, km) */
function ortZuStandort(o) {
  const lat = Number(o?.latitude);
  const lng = Number(o?.longitude);
  if (!o?.ort || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const projekte = Array.isArray(o.projekte) ? o.projekte.filter((x) => x && typeof x === "object") : [];
  return {
    id: `${o.plz || ""}-${o.ort}`.toLowerCase().replace(/\s+/g, "-"),
    label: o.ort,
    plz: o.plz || "",
    lat,
    lng,
    land: o.land || "Deutschland",
    km: Number(o.entfernung_km) || 0,
    imUmkreis: !!o.im_umkreis,
    anzahl: Number(o.anzahl_projekte) || projekte.length || 0,
    projekte,
  };
}

// ---------- Metadata ----------

const META_TITLE = "Referenzkarte: PV-Anlagen in Ihrer Nähe | Ökovolt";
const META_DESCRIPTION =
  "Photovoltaik-Referenzen auf der Karte: realisierte Anlagen von Ökovolt mit Leistung und Entfernung zu Türkheim. Jetzt Anlage in Ihrer Nähe entdecken & anfragen.";

export async function generateMetadata() {
  const seoData = await fetchSeitenDaten();

  const defaultKeywords = [
    "Photovoltaik Referenzkarte",
    "Solarprojekte Karte",
    "PV-Anlagen Standorte",
    "Ökovolt Referenzen",
    "Energielösungen Standorte",
  ];
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords: apiKeywords,
    alternates: { canonical: RK_PAGE_URL, languages: hreflangLanguages(RK_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: RK_PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Referenzkarte – Photovoltaik Standorte Deutschland" }],
    },
    twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION, images: ["https://www.oekovolt.com/og-image.jpg"] },
  };
}

const SZENARIO_ICONS = [BatteryCharging, Thermometer, PlugZap, Building2];

/** "A, B und C" */
const aufzaehlung = (namen) => (namen.length > 1 ? `${namen.slice(0, -1).join(", ")} und ${namen.at(-1)}` : namen[0] || "");

const faqFuer = (ortsnamen) => [
  {
    q: "Baut Ökovolt auch in meiner Region?",
    a: `Unser Firmensitz ist in Türkheim im Unterallgäu.${
      ortsnamen.length ? ` Dokumentierte Referenzprojekte auf der Karte gibt es derzeit in ${aufzaehlung(ortsnamen)}.` : ""
    } Liegt Ihr Ort nicht auf der Karte, fragen Sie trotzdem – wir sagen Ihnen ehrlich, ob wir Ihr Projekt gut betreuen können.`,
  },
  {
    q: "Warum ist ein Fachbetrieb aus der Nähe von Vorteil?",
    a: "Kurze Wege erleichtern Vor-Ort-Termine, Montage und spätere Service-Einsätze. Außerdem kennen regionale Betriebe die Anforderungen der örtlichen Netzbetreiber, typische Dachformen und Schneelastzonen – im Voralpenland ein wichtiger Punkt für die Unterkonstruktion.",
  },
  {
    q: "Wie genau sind die Standorte auf der Karte?",
    a: "Die Karte zeigt Orte, keine genauen Adressen – die Privatsphäre unserer Kundinnen und Kunden bleibt gewahrt. Die angegebenen Entfernungen sind Luftlinie ab Türkheim.",
  },
  {
    q: "Warum wird die Karte erst nach einem Klick geladen?",
    a: "Die interaktive Karte bezieht Kartenmaterial von OpenStreetMap. Dabei wird Ihre IP-Adresse an deren Server übertragen. Deshalb sehen Sie zunächst eine datensparsame Vorschau und entscheiden selbst, ob Sie die Detailkarte laden.",
  },
];

// ---------- Page ----------

export default async function ReferenzkarteSeite() {
  const [data, karte, projektDaten] = await Promise.all([fetchSeitenDaten(), fetchReferenzkarte(), fetchProjekteListe()]);
  const { projekte } = projektDaten;

  // Places from get_referenzkarte (only if they have coordinates)
  const apiOrte = (karte?.orte || []).map(ortZuStandort).filter(Boolean);

  const firmensitzBasis = karte?.firmensitz?.latitude
    ? {
        ...FIRMENSITZ, // keeps id and other fields the map components expect
        label: karte.firmensitz.name || FIRMENSITZ.label,
        lat: Number(karte.firmensitz.latitude),
        lng: Number(karte.firmensitz.longitude),
        beschreibung: karte.firmensitz.beschreibung || "Planung, Montage & Service",
      }
    : FIRMENSITZ;

  // Map places = the towns of the real projects (get_projekte), grouped by "ort".
  // get_referenzkarte places are used instead as soon as it delivers them with coordinates.
  const ausProjekten = await orteAusProjekten(projekte, firmensitzBasis);
  if (ausProjekten.ohneKoordinaten.length) {
    console.warn("Referenzkarte: keine Koordinaten gefunden für", ausProjekten.ohneKoordinaten.join(", "));
  }
  const mitLinks = (s) => {
    const liste = (s.projekte || []).map(projektLink).filter(Boolean);
    return { ...s, projekte: liste, anzahl: liste.length || s.anzahl || 0 };
  };
  const standorte = (apiOrte.length ? apiOrte : ausProjekten.orte).map(mitLinks);
  const firmensitz = mitLinks({
    ...firmensitzBasis,
    projekte: apiOrte.length ? projekte.filter((p) => ortPasst(p.ort, firmensitzBasis.label)) : ausProjekten.amFirmensitz,
  });

  const umkreisKm = Number(karte?.umkreis_km) || 100;
  const imUmkreis = apiOrte.length && karte?.anzahl_im_umkreis != null ? karte.anzahl_im_umkreis : standorte.filter((s) => s.km <= umkreisKm).length;
  // Towns with projects, incl. Türkheim if there are projects at the company location
  const anzahlOrte = standorte.length + (firmensitz.projekte.length ? 1 : 0);
  const ortsnamen = [...(firmensitz.projekte.length ? [firmensitz.label] : []), ...standorte.map((s) => s.label)];

  // Number of projects per place (for list and map)
  const projekteJeOrt = Object.fromEntries(standorte.map((s) => [s.label, s.anzahl || 0]));

  const k = kennzahlen(projekte);
  const neueste = [...projekte]
    .sort((a, b) => (b.jahr || 0) - (a.jahr || 0) || (b.kwp || 0) - (a.kwp || 0))
    .slice(0, 3);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RK_PAGE_URL}/#webpage`,
    url: RK_PAGE_URL,
    name: data?.title || "Referenzkarte – Ökovolt Photovoltaik Standorte",
    description:
      data?.description?.trim() ||
      "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntity: {
      "@type": "ItemList",
      name: "Referenzstandorte von Ökovolt",
      numberOfItems: standorte.length,
      itemListElement: standorte.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Place",
          name: s.label,
          geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
          address: {
            "@type": "PostalAddress",
            addressLocality: s.label,
            ...(s.plz && { postalCode: s.plz }),
            addressCountry: s.land === "Österreich" ? "AT" : "DE",
          },
        },
      })),
    },
  };

  const szenarien = (data?.second_card_table || []).map((s, i) => ({
    icon: SZENARIO_ICONS[i % SZENARIO_ICONS.length],
    title: s.primary_paragraph,
    text: s.secondary_paragraph,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Referenzen", href: "/referenzen/projekte" }, { name: "Referenzkarte" }]}
        eyebrow={data?.title || "Referenzstandorte"}
        title={<>Solaranlagen <span className="ov-text-gradient">in Ihrer Nähe</span></>}
        lead="Von Türkheim aus planen und bauen wir Photovoltaikanlagen im Allgäu, in ganz Bayern und darüber hinaus. Die Karte zeigt, wo unsere Anlagen bereits Strom erzeugen – mit Entfernung zu unserem Firmensitz."
        image={{
          src: bildUrl(data?.image, "/Images/Referenzen/referenzkarte1.jpg"),
          alt: data?.alt_image || "Fachkraft kontrolliert Photovoltaik-Modul auf Dach",
        }}
        actions={[
          { label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" },
          { label: "Zur Karte", href: "#karte", icon: MapPin },
        ]}
        stats={[
          { value: projektDaten.anzahl, label: "Projekte" },
          { value: anzahlOrte, label: anzahlOrte === 1 ? "Ort" : "Orte" },
          { value: Math.round(projektDaten.summeKwp), suffix: " kWp", label: "installierte Leistung" },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
              <MapPin aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[19px] font-extrabold leading-tight text-ink-900">{firmensitz.label}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">Firmensitz im Unterallgäu – {firmensitz.beschreibung || "Planung, Montage & Service"}</p>
            </div>
          </div>
        }
      />

      {/* Karte */}
      <section id="karte" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        <div aria-hidden="true" className="absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-ov-500/15 blur-[130px]" />
        <div className="ov-container relative mb-10 grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            dark
            eyebrow={data?.maps_card_title ? data.maps_card_title.charAt(0) + data.maps_card_title.slice(1).toLowerCase() : "Unsere Standorte"}
            title={data?.maps_card_subtitle || "Regional präsent, überregional aktiv"}
          />
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/65 lg:justify-end lg:pb-2">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-2 border-white bg-navy-700" /> Firmensitz
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-white bg-ov-500" /> Referenzstandort
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-5 rounded-full border border-dashed border-white/50" /> Umkreis ab {firmensitz.label}
            </li>
          </ul>
        </div>
        <div className="relative mx-auto max-w-[92rem] px-3 md:px-6">
          <Reveal dir="scale">
            <ReferenzKarte standorte={standorte} firmensitz={firmensitz} umkreisKm={umkreisKm} imUmkreis={imUmkreis} projekteJeOrt={projekteJeOrt} />
          </Reveal>
        </div>
      </section>

      {/* Einführung */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.first_card_title ? "Unsere Projekte" : "Referenzen"}
          title={data?.first_card_subtitle || "Unsere Referenzkarte – erfolgreiche Projekte auf einen Blick"}
          text={(data?.first_card_table || []).map((o) => o.option)}
          image={{
            src: bildUrl(data?.third_card_first_image, "/Images/Referenzen/referenzkarte2.jpg"),
            alt: data?.third_card_first_alt_text || "Arbeiter überprüft Solarpanels auf Dach",
          }}
          action={{ label: "Alle Projekte ansehen", href: "/referenzen/projekte" }}
        />
      </Section>

      {/* Szenarien */}
      {szenarien.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Eigenverbrauch"
            title={data?.second_card_title || "Eigenverbrauch maximieren mit der eigenen PV-Anlage"}
            lead={data?.second_card_description?.trim()}
            align="center"
            className="mb-12"
          />
          <FeatureGrid items={szenarien} cols={4} />
        </Section>
      )}

      {/* Neueste Projekte */}
      {neueste.length > 0 && (
        <Section tone="white" space="lg">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Projekte im Detail"
              title={<>Zuletzt <span className="ov-text-gradient">realisiert</span></>}
              lead={projekte.length ? `${k.anzahl} dokumentierte Projekte mit Bildern, Leistung und Baujahr.` : undefined}
            />
            <Button href="/referenzen/projekte" variant="secondary" icon={Images}>
              Alle Projekte
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {neueste.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 90}>
                <ProjektKarte projekt={p} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Lösungen */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <SplitMedia
          dark
          reverse
          eyebrow={data?.third_card_title || "Solarlösungen"}
          title={data?.third_card_subtitle || "Solarlösungen für Privathaushalte"}
          text={data?.third_card_description}
          points={(data?.third_card_table || []).map((o) => o.option.replace(/\.$/, ""))}
          image={{
            src: bildUrl(data?.third_card_second_image, "/Images/Referenzen/referenzkarte3.jpg"),
            alt: data?.third_card_second_alt_text || "Arbeiter bereitet Solarmodul für Montage vor",
          }}
          action={{ label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" }}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Referenzen in Ihrer Region"
            lead="Sie möchten wissen, ob wir auch bei Ihnen bauen? Rufen Sie uns an: 08245 96 788 0."
          />
          <Faq items={faqFuer(ortsnamen)} />
        </div>
      </Section>

      <Querverweise pfad="/referenzen/referenzkarte" />
      <CtaBand
        eyebrow="Anlage in Ihrer Nähe"
        title="Ihr Ort fehlt noch auf der Karte? Das ändern wir."
        text="Wir prüfen Ihr Dach, rechnen Ertrag und Wirtschaftlichkeit ehrlich durch und bauen Ihre Anlage mit festem Ansprechpartner aus Türkheim."
        primary={{ label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}