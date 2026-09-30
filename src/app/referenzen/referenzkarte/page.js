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
import { fmtKwp, kennzahlen, normalisiereProjekt, projektSlug } from "@/components/Project/projektDaten";
import { ladeProjektListe } from "@/components/Project/ladeProjekte";
import {
  API_BASE_URL,
  getApiHeaders,
  isApiConfigured,
} from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import Querverweise from "@/components/Reusable/Querverweise";
import { ReferenzNamenBand } from "@/components/Project/ReferenzNamen";
import { REFERENZ_UNTERNEHMEN } from "@/data/hero";
import { alleRegionen } from "@/lib/regionen";
import { KENNZAHLEN } from "@/data/kennzahlen";

// Kartenorte + Projekte aus der API (oekovolt_app). Seitentexte sind statisch:
// Die frühere Backoffice-Seite lieferte Texte der deutschen Website.
const KARTE_URL = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_referenzkarte`;
const PFAD = "/referenzen/referenzkarte";
const RK_PAGE_URL = `${BASE_URL}${PFAD}`;

// ---------- API helpers ----------

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

/** Projects + totals from get_projekte (else src/data/projekte.js): { projekte, anzahl, summeKwp } */
async function fetchProjekteListe() {
  const m = await ladeProjektListe();
  const projekte = m.projekte.map(projektAusApi).filter((p) => p.slug);
  return {
    projekte,
    anzahl: Number(m.anzahl) || projekte.length,
    summeKwp: Number(m.summe_kwp) || projekte.reduce((s, p) => s + (p.kwp || 0), 0),
  };
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
    land: o.land || "",
    km: Number(o.entfernung_km) || 0,
    imUmkreis: !!o.im_umkreis,
    anzahl: Number(o.anzahl_projekte) || projekte.length || 0,
    projekte,
  };
}

// ---------- Metadata ----------

const META_TITLE = "Referenzkarte: PV-Projekte in Österreich | Ökovolt";
const META_DESCRIPTION =
  "Photovoltaik-Referenzen auf der Karte: realisierte Anlagen von Ökovolt mit Leistung und Entfernung zum Firmensitz Ostermiething. Anlage in Ihrer Nähe finden.";

export const metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: ["Photovoltaik Referenzkarte", "PV-Anlagen Österreich Karte", "Photovoltaik Referenzen Oberösterreich", "Ökovolt Referenzen", "Solarprojekte Salzburg"],
  alternates: { canonical: RK_PAGE_URL, languages: hreflangLanguages(PFAD) },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: RK_PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Referenzkarte – Photovoltaik-Standorte" }],
  },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const SZENARIEN = [
  { icon: Building2, title: "Gewerbe & Industrie", text: "Hallen- und Flachdächer, geplant nach Lastgang – mit Parkregler und Monitoring." },
  { icon: BatteryCharging, title: "Speicher & Peak Shaving", text: "Gewerbespeicher kappen Lastspitzen und verschieben Solarstrom in den Abend." },
  { icon: PlugZap, title: "Ladeinfrastruktur", text: "Laden für Flotte, Mitarbeitende und Kundschaft, kombiniert mit PV-Carport." },
  { icon: Thermometer, title: "Wärme & Kälte", text: "Wärmepumpen für Hallen, Hotels und Prozesse – betrieben mit eigenem Solarstrom." },
];

/** "A, B und C" */
const aufzaehlung = (namen) => (namen.length > 1 ? `${namen.slice(0, -1).join(", ")} und ${namen.at(-1)}` : namen[0] || "");

const faqFuer = (ortsnamen) => [
  {
    q: "Baut Ökovolt auch in meiner Region?",
    a: `Unser Firmensitz ist in ${FIRMA.ort} im Innviertel (${FIRMA.bundesland}); wir bauen in allen neun Bundesländern.${
      ortsnamen.length ? ` Dokumentierte Referenzprojekte auf der Karte gibt es derzeit in ${aufzaehlung(ortsnamen)}.` : ""
    } Liegt Ihr Ort nicht auf der Karte, fragen Sie trotzdem – wir sagen Ihnen ehrlich, ob wir Ihr Projekt gut betreuen können.`,
  },
  {
    q: "Warum ist ein Fachbetrieb aus der Nähe von Vorteil?",
    a: "Kurze Wege erleichtern Vor-Ort-Termine, Montage und spätere Service-Einsätze. Entscheidend ist aber, die Anforderungen des jeweiligen Netzbetreibers, die Bauordnung des Bundeslandes und die Schneelast des Standorts zu kennen – das gilt für jede Region Österreichs. Anlagen überwachen wir per Fernwartung, unabhängig von der Entfernung.",
  },
  {
    q: "Wie genau sind die Standorte auf der Karte?",
    a: `Die Karte zeigt Orte, keine genauen Adressen – die Privatsphäre unserer Kundinnen und Kunden bleibt gewahrt. Die angegebenen Entfernungen sind Luftlinie ab ${FIRMA.ort}.`,
  },
  {
    q: "Warum wird die Karte erst nach einem Klick geladen?",
    a: "Die interaktive Karte bezieht Kartenmaterial von OpenStreetMap. Dabei wird Ihre IP-Adresse an deren Server übertragen. Deshalb sehen Sie zunächst eine datensparsame Vorschau und entscheiden selbst, ob Sie die Detailkarte laden.",
  },
];

// ---------- Page ----------

export default async function ReferenzkarteSeite() {
  const [karte, projektDaten] = await Promise.all([fetchReferenzkarte(), fetchProjekteListe()]);
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
  // Towns with projects, incl. the company location if there are projects there
  const anzahlOrte = standorte.length + (firmensitz.projekte.length ? 1 : 0);
  const ortsnamen = [...(firmensitz.projekte.length ? [firmensitz.label] : []), ...standorte.map((s) => s.label)];

  // Number of projects per place (for list and map)
  const projekteJeOrt = Object.fromEntries(standorte.map((s) => [s.label, s.anzahl || 0]));

  const k = kennzahlen(projekte);

  // Solange keine Referenzorte mit Koordinaten vorliegen: Einsatzgebiet (Standorte mit Regionalseite)
  const einsatzOrte = alleRegionen()
    .filter((r) => !r.heimat)
    .map((r) => ({ id: `e-${r.slug}`, label: r.kurzname || r.name, lat: r.pvgis.lat, lng: r.pvgis.lon, km: r.km, land: r.bundesland, href: `/photovoltaik/${r.slug}` }));
  const ohneReferenzorte = standorte.length === 0;
  // Gesamtzahlen Ökovolt Österreich (src/data/kennzahlen.js) – die Online-Referenzen sind nur ein Ausschnitt
  const [kzAnlagen, kzLeistung] = KENNZAHLEN;
  const gesamt = [
    { value: kzAnlagen.zahl, suffix: kzAnlagen.suffix, label: kzAnlagen.label },
    { value: kzLeistung.zahl, suffix: kzLeistung.suffix, label: kzLeistung.label },
  ];
  const heroStats = [
    ...gesamt,
    projektDaten.anzahl
      ? { value: projektDaten.anzahl, label: "Referenzen auf der Karte" }
      : { value: REFERENZ_UNTERNEHMEN.length, label: "öffentlich gelistete Referenzunternehmen" },
  ];
  const neueste = [...projekte]
    .sort((a, b) => (b.jahr || 0) - (a.jahr || 0) || (b.kwp || 0) - (a.kwp || 0))
    .slice(0, 3);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RK_PAGE_URL}/#webpage`,
    url: RK_PAGE_URL,
    name: META_TITLE,
    description: META_DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
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
            ...(s.land === "Österreich" && { addressCountry: "AT" }),
          },
        },
      })),
    },
  };

  const szenarien = SZENARIEN;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Referenzen", href: "/referenzen/projekte" }, { name: "Referenzkarte" }]}
        eyebrow="Referenzstandorte"
        title={<>Photovoltaik-Projekte <span className="ov-text-gradient">in Ihrer Nähe</span></>}
        lead={`Von ${FIRMA.ort} im Innviertel aus planen und errichten wir Photovoltaikanlagen in ganz Österreich. Die Karte zeigt, wo unsere Anlagen bereits Strom erzeugen – mit Entfernung zu unserem Firmensitz.`}
        image={{
          src: "/Images/Referenzen/referenzkarte1.jpg",
          alt: "Fachkraft kontrolliert Photovoltaik-Modul auf Dach",
        }}
        actions={[
          { label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" },
          { label: "Zur Karte", href: "#karte", icon: MapPin },
        ]}
        stats={heroStats}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
              <MapPin aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[19px] font-extrabold leading-tight text-ink-900">{firmensitz.label}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">Firmensitz in {FIRMA.bundesland} – {firmensitz.beschreibung || "Planung, Montage & Service"}</p>
            </div>
          </div>
        }
      />

      <ReferenzNamenBand />

      {/* Karte */}
      <section id="karte" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        <div aria-hidden="true" className="absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-ov-500/15 blur-[130px]" />
        <div className="ov-container relative mb-10 grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            dark
            eyebrow="Unsere Standorte"
            title="Aus Oberösterreich für ganz Österreich"
          />
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/65 lg:justify-end lg:pb-2">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-2 border-white bg-navy-700" /> Firmensitz
            </li>
            <li className="flex items-center gap-2">
              {ohneReferenzorte ? (
                <>
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-white/60" /> Standort mit eigener Seite
                </>
              ) : (
                <>
                  <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-white bg-ov-500" /> Referenzstandort
                </>
              )}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-5 rounded-full border border-dashed border-ov-300/70 bg-ov-500/20" /> Einsatzzonen 80 / 200 km ab {firmensitz.label}
            </li>
          </ul>
        </div>
        <div className="relative mx-auto max-w-[92rem] px-3 md:px-6">
          <Reveal dir="scale">
            <ReferenzKarte standorte={standorte} firmensitz={firmensitz} umkreisKm={umkreisKm} imUmkreis={imUmkreis} projekteJeOrt={projekteJeOrt} einsatzOrte={einsatzOrte} />
          </Reveal>
        </div>
      </section>

      {/* Einführung */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Referenzen"
          title="Unsere Referenzkarte – Projekte auf einen Blick"
          text={
            ohneReferenzorte
              ? [
                  "Die Karte zeigt unser Einsatzgebiet: Firmensitz Ostermiething, die Heimatregion bis 80 km und die Orte, für die wir Ertrag, Netzbetreiber, Baurecht und Förderung eigens aufbereitet haben.",
                  "Referenzprojekte mit Ort ergänzen wir laufend. Vergleichbare Anlagen in Ihrer Nähe nennen wir Ihnen gern persönlich – Kundennamen und genaue Adressen nur mit Zustimmung.",
                ]
              : [
                  "Jeder Punkt auf der Karte steht für einen Ort, an dem wir Photovoltaikanlagen geplant und errichtet haben – vom Gewerbedach bis zur Landwirtschaft.",
                  "Klicken Sie auf einen Ort, um die Projekte dort mit Leistung und Baujahr zu sehen. Kundennamen und genaue Adressen zeigen wir nicht.",
                ]
          }
          image={{
            src: "/Images/Referenzen/referenzkarte2.jpg",
            alt: "Arbeiter überprüft Solarpanels auf Dach",
          }}
          action={{ label: "Alle Projekte ansehen", href: "/referenzen/projekte" }}
        />
      </Section>

      {/* Szenarien */}
      {szenarien.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Mehr als Module"
            title="Was wir an den Standorten zusätzlich umsetzen"
            lead="Viele Projekte kombinieren Photovoltaik mit Speicher, Ladeinfrastruktur oder Wärme – geplant als ein System."
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
          eyebrow="Solarlösungen"
          title="Für Betriebe, Landwirtschaft und Gemeinden"
          text="Wir planen jede Anlage nach Lastgang, Tragwerk und Netzanschluss – und begleiten sie über die gesamte Laufzeit mit Monitoring und Wartung. Premium-Wohnhäuser und Chalets planen wir mit derselben Sorgfalt."
          points={["Netzzugangsantrag und Fertigstellungsmeldung inklusive", "Eigener Parkregler für den TOR-konformen Anschluss", "Wartungsvertrag und Fernüberwachung"]}
          image={{
            src: "/Images/Referenzen/referenzkarte3.jpg",
            alt: "Arbeiter bereitet Solarmodul für Montage vor",
          }}
          action={{ label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" }}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Referenzen in Ihrer Region"
            lead={`Sie möchten wissen, ob wir auch bei Ihnen bauen? Rufen Sie uns an: ${FIRMA.telefon}.`}
          />
          <Faq items={faqFuer(ortsnamen)} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Anlage in Ihrer Nähe"
        title="Ihr Ort fehlt noch auf der Karte? Das ändern wir."
        text={`Wir prüfen Standort und Lastgang, rechnen Ertrag und Wirtschaftlichkeit ehrlich durch und errichten Ihre Anlage mit festem Ansprechpartner von ${FIRMA.name} aus ${FIRMA.ort}.`}
        primary={{ label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}