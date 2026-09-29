// src/app/page.js (Startseite Österreich)
//
// Fokus: Gewerbe, Industrie, Landwirtschaft und öffentliche Hand in ganz
// Österreich. Alle Kernaussagen stammen aus @/data/hero (belegt, Stand 09/2026);
// es werden bewusst KEINE Gruppen-Kennzahlen der deutschen Website verwendet.
//
// Rhythmus: Hero mit Live-Rechner (dunkel) → Referenz-Laufband → Lösungs-Bento
// (Foto) → Rechner & Tools (dunkel) → Warum Ökovolt → Strommarkt live (dunkel)
// → Energie nutzen (Foto) → Eigene Technik & Service → Ablauf → Projekte (API)
// → FAQ mit Wissen & Gemeinsam → CtaBand.

import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, BatteryCharging, BookOpen, Building2, ClipboardCheck, Cpu, Droplets, Factory,
  Gift, Handshake, HeartHandshake, Hotel, Landmark, Library, MapPin, Mountain, MonitorDot, Newspaper, PlugZap, Radio, Ruler,
  ScanSearch, Share2, ShieldAlert, ShieldCheck, SlidersHorizontal, Sprout, Sun, Tractor, TrendingUp, Trophy, Wrench,
} from "lucide-react";

import { projektSlug } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { getEnergySnapshot } from "@/lib/energy";
import { BASE_URL, FIRMA, SCHWESTER } from "@/lib/site";
import { HOME_HERO, KERNFAKTEN, REFERENZ_UNTERNEHMEN } from "@/data/hero";

import Section from "@/components/ui/Section";
import SectionHeading, { Eyebrow } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import Marquee from "@/components/ui/Marquee";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import HeroVideo from "@/components/Home2/HeroVideo";
import HeroGewerbeRechner from "@/components/Home2/HeroGewerbeRechner";
import HomeLive from "@/components/Home2/HomeLive";
import RechnerShowcase from "@/components/Home2/RechnerShowcase";

const PROJEKTE_URL = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;

async function apiGet(url) {
  if (!isApiConfigured()) return null;
  try {
    const res = await fetch(url, { headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`API ${url} -> ${res.status}`);
      return null;
    }
    return (await res.json()).message;
  } catch (e) {
    console.error("Fetch error:", e);
    return null;
  }
}

const getProjekte = cache(() => apiGet(PROJEKTE_URL));

const META = {
  title: "Photovoltaik für Gewerbe & Industrie in Österreich | Ökovolt",
  description:
    "Photovoltaik für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich: Planung, Bau und Betrieb mit eigenem Parkregler und SCADA. Seit 2012, Ostermiething.",
};

export function generateMetadata() {
  const bild = { url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik für Gewerbe und Industrie in Österreich – Ökovolt" };
  return {
    title: META.title,
    description: META.description,
    keywords: [
      "Photovoltaik Gewerbe Österreich", "PV-Anlage Industrie", "Photovoltaik Firma Österreich", "Freiflächen-Photovoltaik", "Agri-PV Österreich",
      "Photovoltaik Landwirtschaft", "Photovoltaik Gemeinde", "Parkregler EZA-Regler", "EAG Investitionszuschuss", "Ökovolt",
    ],
    alternates: { canonical: BASE_URL, languages: hreflangLanguages(BASE_URL) },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: { type: "website", locale: "de_AT", url: BASE_URL, siteName: "Ökovolt Österreich", title: META.title, description: META.description, images: [bild] },
    twitter: { card: "summary_large_image", title: META.title, description: META.description, images: [bild.url] },
  };
}

/* ------------------------------------------------------------------ */
/* Inhalte                                                             */
/* ------------------------------------------------------------------ */

// Bilder mit CC-Lizenz tragen eine Namensnennung (Bildnachweis unten, public/Images/AT/QUELLEN-home.md,
// QUELLEN-loesungen.md, QUELLEN-chalets.md, QUELLEN-technik.md).
// Raster (md: 4 Spalten): Gewerbe 2×2 + vier Karten, darunter zwei breite Karten – keine Lücke.
const ZIELGRUPPEN = [
  { titel: "Gewerbe & Industrie", text: "Hallen- und Flachdächer, ausgelegt nach Ihrem Lastgang – mit Parkregler, Monitoring und Wartungsvertrag.", href: "/gewerbe", bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", icon: Factory, gross: true },
  { titel: "Freiflächenanlagen", text: "Solarparks ab 500 kWp", href: "/freiflaechen-photovoltaik", bild: "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg", icon: Sun },
  { titel: "Agri-PV", text: "Doppelte Ernte auf einer Fläche", href: "/agri-pv", bild: "/Images/AT/loesungen/agri-pv-obstbau.jpg", icon: Sprout },
  { titel: "Landwirtschaft", text: "Stall, Scheune, Maschinenhalle", href: "/landwirtschaft", bild: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", icon: Tractor },
  { titel: "Hotellerie & Tourismus", text: "Hotels, Bergbahnen, Thermen", href: "/hotellerie-tourismus", bild: "/Images/AT/home/hotel-pv-dach-luftbild.jpg", icon: Hotel },
  { titel: "Gemeinden & Länder", text: "Schulen, Bauhöfe, Kläranlagen – und Energiegemeinschaften mit der Bevölkerung.", href: "/kommunen", bild: "/Images/AT/home/klaeranlage-pv-luftbild.jpg", icon: Landmark, breit: true },
  { titel: "Luxus-Chalets & Alpin", text: "Indach-Lösungen, hohe Schneelasten, Concierge-Wartung – für Premium-Objekte in den Bergen.", href: "/chalets", bild: "/Images/AT/chalets/chalets-alpin-winter-mittelberg.jpg", icon: Mountain, breit: true },
];

const ENERGIE_NUTZEN = [
  { icon: BatteryCharging, title: "Gewerbespeicher", text: "Lastspitzen kappen, Leistungspreis senken, Überschüsse verschieben und Notstrom bereitstellen.", href: "/gewerbespeicher", bild: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg" },
  { icon: PlugZap, title: "Ladeinfrastruktur", text: "E-Flotte, Kundenparkplatz und Lkw mit Solarstrom laden – mit Lastmanagement am Netzanschluss.", href: "/ladeinfrastruktur", bild: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg" },
  { icon: Share2, title: "Energiegemeinschaften", text: "Überschüsse in einer EEG, BEG oder GEA teilen – mit reduzierten Netzentgelten in der EEG.", href: "/energiegemeinschaften", bild: "/Images/AT/home/energiegemeinschaft-ort-luftbild.jpg" },
  { icon: TrendingUp, title: "Reststromvermarktung", text: "Überschuss über Direktvermarktung, PPA oder OeMAG-Marktpreis erlösen.", href: "/service/direktvermarktung", bild: "/Images/AT/technik/umspannwerk-obersielach.jpg" },
];

const TECHNIK = [
  { icon: SlidersHorizontal, title: "Parkregler (EZA-Regler)", text: "Regelt Wirk- und Blindleistung am Netzanschlusspunkt nach den Vorgaben des Netzbetreibers und den TOR Erzeuger – inklusive Einspeisebegrenzung und Fernwirkanbindung.", href: "/technik/parkregler", cta: "Zum Parkregler", bild: "/Images/AT/technik/umspannwerk-transformator.jpg", alt: "Transformator und Schaltgeräte in einem Umspannwerk" },
  { icon: Radio, title: "Fernwartung", text: "Gesicherte Fernzugriffe auf Wechselrichter, Regler und Zähler: Viele Störungen beheben wir, ohne dass jemand anfahren muss.", href: "/technik/fernwartung", cta: "Zur Fernwartung", bild: "/Images/Jobs/jobs4.jpg", alt: "Techniker prüft Anlagendaten auf einem Tablet neben PV-Modulen" },
  { icon: MonitorDot, title: "SCADA & Leitwarte", text: "Portfolio-Monitoring, Alarmierung und Reporting über alle Anlagen – entwickelt mit unserem Digitalisierungspartner Solensa.", href: "/technik/scada", cta: "Zu SCADA & Leitwarte", bild: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Leitwarte mit Großbildwand und Arbeitsplätzen (Symbolbild)" },
];

const SERVICE = [
  { icon: Wrench, title: "Wartung & Wartungsvertrag", text: "Für eigene und fremd errichtete Anlagen", href: "/service/wartung" },
  { icon: ClipboardCheck, title: "E-Check & Anlagenprüfung", text: "Nach ÖVE/ÖNORM E 8101 und EN 62446", href: "/service/e-check" },
  { icon: ScanSearch, title: "Drohnen-Thermografie", text: "Hotspots georeferenziert finden", href: "/service/drohneninspektion" },
  { icon: Droplets, title: "PV-Reinigung", text: "Wenn der Ertragsvergleich es rechtfertigt", href: "/service/reinigung" },
  { icon: ShieldCheck, title: "PV-Versicherung", text: "Beratung – wir vermitteln Kontakte", href: "/service/versicherung" },
  { icon: ShieldAlert, title: "Notstrom & Blackout", text: "Ersatzstrom für kritische Verbraucher", href: "/service/notstrom" },
];

const MEHR = [
  { gruppe: "Wissen", titel: "Ratgeber", text: "Fachartikel für Geschäftsführung, Technik und Einkauf – österreichische Rechtslage.", href: "/ratgeber", icon: BookOpen },
  { gruppe: "Wissen", titel: "Photovoltaik-Lexikon", text: "Von Netzebene bis TOR Erzeuger: Fachbegriffe kurz erklärt.", href: "/wissen/lexikon", icon: Library },
  { gruppe: "Wissen", titel: "Presse & Neuigkeiten", text: "Projekte, Termine und Neuigkeiten aus dem Unternehmen.", href: "/presse", icon: Newspaper },
  { gruppe: "Gemeinsam", titel: "Ökovolt PV Award", text: "Jährlich zeichnen wir Kundinnen und Kunden für die besten Anlagen und Nachhaltigkeitsinvestitionen aus.", href: "/pv-award", icon: Trophy },
  { gruppe: "Gemeinsam", titel: "Elektro-Partner werden", text: "Elektrotechnik-Betriebe registrieren sich als Partner – Ökovolt ist die zentrale Plattform für Planung, Material und Projekte.", href: "/partner", icon: Handshake },
  { gruppe: "Gemeinsam", titel: "Sponsoring", text: "Wir unterstützen Vereine, Kultur und Nachwuchs in den Regionen, in denen wir bauen.", href: "/sponsoring", icon: HeartHandshake },
];

const BILDNACHWEIS = [
  "Hotellerie & Tourismus: C.Stadler/Bwag, CC BY-SA 4.0 (Symbolbild)",
  "Gemeinden & Länder: Isiwal, CC BY-SA 4.0 (Symbolbild)",
  "Energiegemeinschaften: Isiwal, CC BY-SA 4.0 (Symbolbild)",
  "Freiflächenanlagen: C.Stadler/Bwag, CC BY-SA 4.0",
  "Agri-PV: Lisamiri, CC BY-SA 4.0 (Symbolbild, Deutschland)",
  "Luxus-Chalets: Mike Kotsch, CC0",
  "Gewerbespeicher: Bp 95, CC BY 4.0 (Ausschnitt)",
  "Ladeinfrastruktur: pedrik, CC BY 2.0 (Symbolbild)",
  "Reststromvermarktung: Christiankral, CC BY 4.0",
  "Leitwarte: Dpysh w, CC BY 3.0 (Symbolbild)",
];

const FAQ = [
  {
    q: "Für wen plant und baut Ökovolt Photovoltaikanlagen?",
    a: "Ökovolt plant, errichtet und betreibt Photovoltaikanlagen vor allem für Gewerbe und Industrie, Land- und Forstwirtschaft, Hotellerie und Tourismus sowie Gemeinden und Länder – auf Dächern, als Freiflächen- oder Agri-PV-Anlage. Private Projekte übernehmen wir nachgeordnet, insbesondere Premium-Objekte und Chalets in alpinen Lagen.",
  },
  {
    q: "In welchen Regionen ist Ökovolt tätig?",
    a: `In ganz Österreich, in allen neun Bundesländern. Firmensitz ist ${FIRMA.strasse} in ${FIRMA.plz} ${FIRMA.ort} im Innviertel (${FIRMA.bundesland}), direkt an der Grenze zu Salzburg.`,
  },
  {
    q: "Wer steht hinter Ökovolt Österreich?",
    a: `Die ${FIRMA.name} wurde 2012 gegründet und wird von ${FIRMA.geschaeftsfuehrer} geführt. Gesellschafter sind ${FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(" und ")}. Standards, Prozesse und Marke teilen wir mit der deutschen Schwestergesellschaft ${SCHWESTER.name} in ${SCHWESTER.ort}, die seit 2010 Photovoltaikanlagen errichtet und Inhaberin der Marken- und Websiterechte ist.`,
  },
  {
    q: "Was unterscheidet Ökovolt von anderen PV-Errichtern?",
    a: "Wir decken Planung, Bau und Betrieb aus einer Hand ab und setzen dafür eigene Systeme ein: einen selbst entwickelten Parkregler (EZA-Regler) für den österreichischen Netzanschluss sowie eigene Fernwartungs- und SCADA-Systeme. Und wir wissen, worauf es im Betrieb ankommt – die Gründer betreiben seit 2012 eigene Solarparks. Wir bauen, was wir selbst betreiben würden.",
  },
  {
    q: "Welche Förderungen gibt es für Photovoltaik in Österreich?",
    a: "Die wichtigste Bundesförderung ist der EAG-Investitionszuschuss der OeMAG; 2026 beträgt er je nach Kategorie bis zu 150 €/kWp (Kategorie A; C und D höchstens 130 bzw. 120 €/kWp), maximal 30 % der förderfähigen Kosten. Betriebe nutzen zusätzlich den Investitionsfreibetrag, der für Anschaffungen bis 31. Dezember 2026 für ökologische Investitionen wie PV befristet 22 % beträgt. Dazu kommen Landesförderungen (Stand: September 2026).",
  },
  {
    q: "Wie starte ich ein Projekt mit Ökovolt?",
    a: "Am schnellsten über den Angebots-Konfigurator: Objektart, Fläche, Jahresverbrauch, Lastgang und Netzebene angeben – wir melden uns mit einer Ersteinschätzung. Alternativ buchen Sie online einen Beratungstermin per Telefon, Video oder vor Ort oder rufen uns direkt an.",
  },
];

/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const [projekteRoh, energie] = await Promise.all([getProjekte(), getEnergySnapshot().catch(() => null)]);

  // Neueste 4 Projekte – Felder und Sortierung wie im Portfolio (/referenzen/projekte: "Neueste")
  const projekteListe = Array.isArray(projekteRoh) ? projekteRoh : projekteRoh?.projekte;
  // Referenz-Namen nur verlinken, wenn es die Projektseite im Backoffice gibt – nie ein 404-Link.
  const vorhandeneSlugs = new Set((Array.isArray(projekteListe) ? projekteListe : []).map(projektSlug).filter(Boolean));
  const projekte = (Array.isArray(projekteListe) ? projekteListe : [])
    .filter((p) => p.projekt_website_name)
    .map((p) => ({
      title: p.projekt_name || p.projekt_website_name,
      slug: projektSlug(p),
      bild: p.bild_url ? encodeURI(p.bild_url) : null,
      leistung: p.leistung_label,
      jahr: Number(p.jahr) || 0,
      kwp: Number(p.leistung) || 0,
    }))
    .sort((a, b) => b.jahr - a.jahr || b.kwp - a.kwp)
    .slice(0, 4);

  const hatLive = Boolean(energie?.preis?.punkte?.length);
  const referenzReihen = [REFERENZ_UNTERNEHMEN.slice(0, 8), REFERENZ_UNTERNEHMEN.slice(8)];

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: META.title,
    description: META.description,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    primaryImageOfPage: `${BASE_URL}${HOME_HERO.bild}`,
    dateModified: new Date().toISOString().split("T")[0],
  };

  const zielgruppenSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Photovoltaik-Lösungen von Ökovolt Österreich",
    itemListElement: [...ZIELGRUPPEN, ...ENERGIE_NUTZEN.map((e) => ({ titel: e.title, href: e.href }))].map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.titel,
      url: `${BASE_URL}${p.href}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(zielgruppenSchema) }} />

      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image src={HOME_HERO.bild} alt={HOME_HERO.alt} fill priority sizes="100vw" className="-z-30 object-cover" />
        {HOME_HERO.video && <HeroVideo src={HOME_HERO.video} poster={HOME_HERO.bild} />}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/35" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/10 to-navy-950/50" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-ov-500/20 blur-[140px]" />
        <div aria-hidden="true" className="absolute right-[8%] top-10 -z-10 hidden h-[380px] w-[380px] rounded-full bg-sun-400/10 blur-[120px] lg:block" />

        <div className="ov-container grid items-center gap-10 pb-16 pt-12 md:pb-24 md:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            <div className="ov-hero-in">
              <span className="ov-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/90">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
                {HOME_HERO.kicker}
                <span className="hidden sm:inline"> · {HOME_HERO.kickerZusatz}</span>
              </span>
            </div>
            <h1 className="ov-display ov-hero-in mt-7" style={{ "--ov-delay": "100ms" }}>
              Ihr Betrieb.
              <br />
              Ihr <span className="ov-text-gradient-light">Kraftwerk.</span>
            </h1>
            <p className="ov-lead ov-hero-in mt-7 max-w-xl text-white/75" style={{ "--ov-delay": "180ms" }}>
              {HOME_HERO.lead}
            </p>
            <div className="ov-hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--ov-delay": "260ms" }}>
              <Button href="/angebot?objekt=gewerbe" size="lg" pfeil>Ersteinschätzung anfordern</Button>
              <Button href="/referenzen/projekte" size="lg" variant="outlineLight">Referenzen ansehen</Button>
            </div>
            <ul className="ov-hero-in mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-white/75" style={{ "--ov-delay": "340ms" }}>
              {HOME_HERO.punkte.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-300" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="ov-hero-in" style={{ "--ov-delay": "220ms" }}>
            <HeroGewerbeRechner />
          </div>
        </div>

        {/* Kernfakten */}
        <div className="relative border-t border-white/10 bg-navy-950/65 backdrop-blur-md">
          <dl className="ov-container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
            {KERNFAKTEN.map((k, i) => (
              <Reveal key={k.label} delay={i * 90} className={`flex flex-col-reverse px-2 md:px-6 ${i > 0 ? "md:border-l md:border-white/10" : ""}`}>
                <dt className="mt-2 text-[13.5px] leading-snug text-white/55">{k.label}</dt>
                <dd className="font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.5rem)] font-extrabold leading-none tracking-tight">
                  {k.zahl ? <CountUp value={k.zahl} prefix={k.prefix} suffix={k.suffix} className={i === 1 ? "ov-text-gradient-light" : ""} /> : k.wert}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= REFERENZEN (Laufband) ================= */}
      <section aria-labelledby="referenzen-titel" className="relative overflow-hidden border-b border-ink-100 bg-white py-12 md:py-16">
        <div className="ov-container mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
          <div>
            <Eyebrow>Referenzen aus Industrie, Holz, Handel, Logistik und Tourismus</Eyebrow>
            <h2 id="referenzen-titel" className="mt-3 font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-bold tracking-tight text-ink-900">
              Unternehmen, die mit uns Strom erzeugen
            </h2>
          </div>
          <Link href="/referenzen/projekte" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Alle Referenzprojekte
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3 md:space-y-4">
          {referenzReihen.map((reihe, ri) => (
            <Marquee key={ri} speed={ri ? 64 : 56} className={ri ? "[&_.animate-ov-marquee]:[animation-direction:reverse]" : ""}>
              {reihe.map((r) => {
                const inhalt = (
                  <>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ov-400" aria-hidden="true" />
                    <span className="font-display text-[clamp(1.15rem,0.95rem+0.8vw,1.6rem)] font-bold tracking-tight">{r.name}</span>
                    <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-500">{r.branche}</span>
                  </>
                );
                return vorhandeneSlugs.has(r.slug) ? (
                  <Link key={r.slug} href={`/referenzen/projekte/${r.slug}`} className="flex shrink-0 items-center gap-3 whitespace-nowrap text-ink-800 transition-colors hover:text-ov-700">
                    {inhalt}
                  </Link>
                ) : (
                  <span key={r.slug} className="flex shrink-0 items-center gap-3 whitespace-nowrap text-ink-800">
                    {inhalt}
                  </span>
                );
              })}
            </Marquee>
          ))}
        </div>
      </section>

      {/* ================= ZIELGRUPPEN BENTO ================= */}
      <Section tone="sand" space="lg">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Lösungen"
            title={<>Eine Anlage, die zu Ihrem <span className="ov-text-gradient">Betrieb passt.</span></>}
            lead="Vom Hallendach bis zum Solarpark, vom Bauernhof bis zur Gemeinde: Jede Anlage wird nach Lastgang, Fläche und Netzanschluss ausgelegt – nicht nach Katalog."
          />
          <Reveal delay={100}>
            <Button href="/photovoltaik" variant="secondary" pfeil>Einzugsgebiet Österreich</Button>
          </Reveal>
        </div>

        <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[230px] md:auto-rows-[236px] md:grid-cols-4 md:gap-4">
          {ZIELGRUPPEN.map((p, i) => (
            <Reveal key={p.href} delay={i * 70} className={p.gross ? "col-span-2 row-span-2" : p.breit ? "col-span-2" : ""}>
              <Link href={p.href} className="group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 p-4 text-white shadow-[0_24px_48px_-28px_rgba(3,18,43,0.55)] sm:p-6 md:rounded-[2rem] md:p-7">
                <Image
                  src={p.bild}
                  alt=""
                  fill
                  sizes={p.gross || p.breit ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/35 to-navy-950/5 transition-opacity duration-500 group-hover:opacity-90" />
                <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-navy-950/55 ring-1 ring-white/15 backdrop-blur-md sm:h-11 sm:w-11 md:left-6 md:top-6">
                  <p.icon aria-hidden="true" className="h-5 w-5 text-ov-300" />
                </span>
                <span className="absolute right-4 top-4 flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-white text-ink-900 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 md:right-6 md:top-6">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="relative">
                  <h3 className={`font-display font-extrabold tracking-tight ${p.gross ? "text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)]" : "text-[17px] sm:text-[21px]"}`}>{p.titel}</h3>
                  <p className={`mt-1.5 text-white/75 ${p.gross ? "max-w-md text-[16.5px]" : p.breit ? "hidden max-w-md text-[14.5px] sm:block" : "hidden text-[14.5px] sm:block"}`}>{p.text}</p>
                  {p.gross && (
                    <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-300">
                      Mehr erfahren <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ================= RECHNER & TOOLS ================= */}
      <Section tone="navy" space="md" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-32 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-navy-500/30 blur-[120px]" />
        <div className="relative">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeading dark eyebrow="Rechner & Tools" title={<>Rechnen Sie Ihr Projekt <span className="ov-text-gradient-light">selbst durch.</span></>} />
            <Reveal delay={120}>
              <p className="ov-lead text-white/65">
                Kostenlose Werkzeuge für Ihren Betrieb – mit österreichischen Netzentgelten, Förderungen und Standortdaten. Ehrliche Zahlen, bevor Sie mit uns sprechen.
              </p>
              <div className="mt-6">
                <Button href="/rechner" variant="outlineLight" pfeil>Alle Rechner & Tools</Button>
              </div>
            </Reveal>
          </div>
          <RechnerShowcase />
        </div>
      </Section>

      {/* ================= WARUM ÖKOVOLT ================= */}
      <Section tone="white" space="lg">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal dir="left" className="relative pb-10 sm:pb-6 lg:self-center lg:pb-0">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image src="/Images/AT/service/pv-wartung-techniker.jpg" alt="Monteur mit Absturzsicherung trägt ein Photovoltaikmodul über ein Blechdach" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-10 left-4 max-w-[280px] rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-ink-100 sm:-bottom-6 md:-left-6">
                <p className="font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-600">seit 2012</p>
                <p className="mt-2 text-[14px] leading-snug text-ink-600">betreiben die Gründer eigene Solarparks – wir bauen, was wir selbst betreiben würden.</p>
              </div>
              <div className="absolute right-4 top-4 hidden rounded-2xl bg-navy-950/85 px-4 py-3 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md sm:block md:-right-5 md:top-8">
                <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" /> {FIRMA.ort}, {FIRMA.bundesland}
                </p>
                <p className="mt-1 text-[13px] text-white/70">Einsatzgebiet: alle neun Bundesländer</p>
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <SectionHeading
              eyebrow="Warum Ökovolt"
              title="Betreiber aus Überzeugung – Errichter mit System."
              lead={`Seit 2012 baut Ökovolt Photovoltaik in Österreich. 2021 errichteten wir Anlagen mit rund 30 MWp und zählten zu den TOP 3 der IPC-Errichter Österreichs. Standards und Prozesse teilen wir mit unserer deutschen Schwestergesellschaft in ${SCHWESTER.ort}, die seit 2010 PV-Anlagen errichtet.`}
            />
            <ul className="mt-8 space-y-3">
              {[
                { icon: Ruler, title: "Planung, Bau und Betrieb aus einer Hand", text: "Lastganganalyse, Netzantrag, Statik, Montage durch den eigenen Elektrotechnik-Fachbetrieb, Inbetriebnahme und Wartung – ein Ansprechpartner über die gesamte Lebensdauer." },
                { icon: Cpu, title: "Eigene Regelungs- und Leittechnik", text: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung – abgestimmt auf TOR Erzeuger und österreichische Netzbetreiber." },
                { icon: Building2, title: "Starke Gesellschafter", text: "Andreas Wegscheider (51 %) und die Salzburg AG für Energie, Verkehr und Telekommunikation (49 %)." },
              ].map((k, i) => (
                <Reveal as="li" key={k.title} delay={i * 90} className="group flex gap-5 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 transition-colors hover:bg-white hover:ring-ov-200">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-transform duration-300 group-hover:scale-105">
                    <k.icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink-900">{k.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{k.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={200} className="mt-8">
              <Button href="/uber-uns" variant="secondary" pfeil>Über Ökovolt Österreich</Button>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ================= STROMMARKT ÖSTERREICH LIVE ================= */}
      {hatLive && (
        <Section tone="navy" space="lg" className="ov-noise overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-32 -top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
          <div aria-hidden="true" className="absolute -bottom-40 left-1/4 h-[360px] w-[360px] rounded-full bg-sun-400/10 blur-[120px]" />
          <div className="relative">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <SectionHeading
                dark
                eyebrow="Strommarkt Österreich live"
                title={<>Wann Strom billig ist, <span className="ov-text-gradient-light">sehen Sie hier.</span></>}
              />
              <Reveal delay={120}>
                <p className="ov-lead text-white/65">
                  Der Day-Ahead-Preis der Gebotszone AT wechselt jede Viertelstunde – mittags drückt Solarstrom ihn oft tief nach unten. Wer Speicher, E-Flotte und flexible Lasten danach steuert, kauft günstiger ein.
                </p>
              </Reveal>
            </div>
            <Reveal dir="scale">
              <HomeLive initial={{ stand: energie.stand, preis: energie.preis, erzeugung: { ...energie.erzeugung, zeiten: undefined, serien: undefined } }} />
            </Reveal>
            <p className="mt-5 text-[12px] text-white/40">
              Quelle: {energie.preis.quelle || "Energy-Charts (Fraunhofer ISE)"}
              {energie.erzeugung?.quelle && energie.erzeugung.quelle !== energie.preis.quelle ? `, Erzeugung: ${energie.erzeugung.quelle}` : ""}. Energy-Charts-Daten unter CC BY 4.0. Börsenpreise netto, ohne Netzentgelte, Abgaben und Steuern.
            </p>
          </div>
        </Section>
      )}

      {/* ================= ENERGIE NUTZEN ================= */}
      <Section tone="sand" space="md">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SectionHeading eyebrow="Energie nutzen" title={<>Jede Kilowattstunde <span className="ov-text-gradient">an der richtigen Stelle.</span></>} />
          <Reveal delay={120}>
            <p className="ov-lead text-ink-600">
              Solarstrom rechnet sich am besten, wenn er im Betrieb verbraucht wird. Was übrig bleibt, speichern, laden, teilen oder vermarkten wir – abgestimmt auf Lastgang, Netzanschluss und Tarif.
            </p>
          </Reveal>
        </div>
        <ul className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-5 lg:grid-cols-4">
          {ENERGIE_NUTZEN.map((e, i) => (
            <Reveal as="li" key={e.href} delay={i * 80} className="flex w-[80%] shrink-0 snap-start sm:w-auto">
              <Link href={e.href} className="group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-navy-950 p-6 text-white shadow-[0_24px_48px_-28px_rgba(3,18,43,0.6)] md:min-h-[350px]">
                <Image src={e.bild} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover opacity-80 transition-all duration-[1400ms] ease-out group-hover:scale-[1.07] group-hover:opacity-60" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/0" />
                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-950/55 ring-1 ring-white/15 backdrop-blur-md">
                  <e.icon aria-hidden="true" className="h-5 w-5 text-ov-300" strokeWidth={1.8} />
                </span>
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:bg-white group-hover:text-ink-900">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="relative">
                  <h3 className="font-display text-[21px] font-bold tracking-tight">{e.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{e.text}</p>
                  <span aria-hidden="true" className="mt-4 block h-0.5 w-10 rounded-full bg-ov-400 transition-all duration-500 group-hover:w-20" />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ================= EIGENE TECHNIK & SERVICE ================= */}
      <Section tone="white" space="md">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Eigene Technik"
            title={<>Drei Systeme. <span className="ov-text-gradient">Selbst entwickelt.</span></>}
            lead="Große Anlagen stellen hohe Anforderungen an Netzanschluss und Betrieb. Deshalb setzen wir auf eigene Regelungs- und Leittechnik statt auf Blackbox-Lösungen."
          />
          <Reveal delay={100}>
            <Button href="/technik" variant="secondary" pfeil>Technik-Übersicht</Button>
          </Reveal>
        </div>
        <ul className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {TECHNIK.map((t, i) => (
            <Reveal as="li" key={t.href} delay={i * 90} className="flex w-[84%] shrink-0 snap-start md:w-auto">
              <Link href={t.href} className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
                  <Image src={t.bild} alt={t.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
                    <t.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span className="absolute bottom-4 right-4 font-display text-[13px] font-bold tracking-[0.14em] text-white/70">0{i + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="ov-h3 text-ink-900 group-hover:text-ov-700">{t.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-600">{t.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-700">
                    {t.cta} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* Service über den Lebenszyklus */}
        <Reveal className="mt-12 rounded-[2rem] bg-sand-50 p-6 ring-1 ring-ink-200/60 md:mt-14 md:p-9">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Eyebrow>Service über den Lebenszyklus</Eyebrow>
              <h2 className="ov-h3 mt-3 text-ink-900">Damit die Anlage 25 Jahre und länger liefert.</h2>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">Wartung, Prüfung und Absicherung – für Anlagen, die wir gebaut haben, und für Bestandsanlagen anderer Errichter.</p>
            </div>
            <Button href="/service/wartung#anfrage" variant="secondary" pfeil className="shrink-0">Wartungsvertrag anfragen</Button>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="group flex h-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-ov-200">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white">
                    <s.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[16px] font-bold text-ink-900">{s.title}</span>
                    <span className="hidden text-[13.5px] text-ink-500 sm:block">{s.text}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-ov-600" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* ================= PROZESS ================= */}
      <Section tone="green" space="md">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="In vier Schritten" title="Vom Lastgang zum laufenden Kraftwerk" lead="Ein Ansprechpartner von der ersten Analyse bis zur Wartung – über die gesamte Lebensdauer der Anlage." />
          <Reveal delay={100}><Button href="/angebot?objekt=gewerbe" pfeil>Projekt starten</Button></Reveal>
        </div>
        <Steps
          items={[
            { icon: Activity, title: "Analyse", text: "Lastgang, Flächen, Netzanschluss und Förderungen: Wir rechnen, was sich für Ihren Betrieb wirklich lohnt." },
            { icon: Ruler, title: "Planung & Netzantrag", text: "Auslegung, Statik, Netzzugang beim Netzbetreiber, Förderansuchen und Bewilligungen." },
            { icon: Wrench, title: "Bau & Inbetriebnahme", text: "Montage durch den eigenen Fachbetrieb, Erstprüfung nach ÖVE/ÖNORM, Parkregler und Monitoring." },
            { icon: ClipboardCheck, title: "Betrieb & Wartung", text: "Fernüberwachung, Wartungsvertrag, Prüfungen und Optimierung über die gesamte Laufzeit." },
          ]}
        />
      </Section>

      {/* ================= PROJEKTE (API) ================= */}
      {projekte.length > 0 && (
        <Section tone="white" space="lg">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Referenzen" title="Unsere neuesten Photovoltaik-Projekte in Österreich" />
            <Reveal delay={100}><Button href="/referenzen/projekte" variant="secondary" pfeil>Alle Projekte</Button></Reveal>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projekte.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 80}>
                <Link href={`/referenzen/projekte/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-ink-100">
                    <Image
                      src={p.bild || "/Images/Referenzen/Projekte-1.jpg"}
                      alt={`Photovoltaik-Projekt ${p.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                    {p.leistung && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-bold text-ink-900 shadow">
                        <Sun aria-hidden="true" className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-sun-500" />
                        {String(p.leistung).replace(/\s*kWp/i, "")} kWp
                      </span>
                    )}
                    <p className="absolute inset-x-5 bottom-5 font-display text-[18px] font-bold leading-snug text-white">{p.title}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* ================= FAQ ================= */}
      <Section tone={projekte.length > 0 ? "sand" : "white"} space="md">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Ökovolt Österreich – kurz beantwortet" lead={`Noch Fragen? Unser Team in ${FIRMA.ort} berät Sie persönlich.`} />
            <Reveal delay={120} className="mt-8">
              <Button href="/faqs" variant="secondary" size="sm" pfeil>Alle FAQs</Button>
            </Reveal>
            {/* Wissen & Gemeinsam – kompakt statt eigener Sektion */}
            <Reveal delay={160} className="mt-10 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Wissen & Gemeinsam</p>
              <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                {MEHR.map((w) => (
                  <li key={w.href}>
                    <Link href={w.href} title={w.text} className="group flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-100 transition-colors group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                        <w.icon aria-hidden="true" className="h-4.5 w-4.5" strokeWidth={1.8} />
                      </span>
                      <span className="text-[14.5px] font-semibold text-ink-800 group-hover:text-ov-700">{w.titel}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-2 border-t border-ink-200/60 px-2 pt-3 text-[13px] text-ink-500">
                <Gift aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
                <span>
                  Bestandskunden: exklusive Angebote in der{" "}
                  <Link href="/service/vorteilswelt" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">Ökovolt Vorteilswelt</Link>.
                </span>
              </p>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Ihr Dach, Ihre Fläche, Ihr Lastgang – wir rechnen es durch."
        text={`Persönliche Beratung vom Elektrotechnik-Fachbetrieb aus ${FIRMA.ort}: ehrliche Wirtschaftlichkeitsrechnung, Förderprüfung und ein fester Ansprechpartner von der Planung bis zum Betrieb – in ganz Österreich.`}
        primary={{ label: "Ersteinschätzung anfordern", href: "/angebot?objekt=gewerbe" }}
        secondary={{ label: "Hallendach berechnen", href: "/rechner/gewerbe-pv" }}
      />

      <p className="ov-container pb-8 text-[11.5px] leading-relaxed text-ink-500">
        Bildnachweis: {BILDNACHWEIS.join(" · ")} – Details unter{" "}
        <Link href="/bildnachweis" className="underline underline-offset-2 hover:text-ink-700">Bildnachweis</Link>.
      </p>
    </div>
  );
}
