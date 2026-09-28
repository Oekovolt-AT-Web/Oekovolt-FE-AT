// src/app/page.js (Startseite Österreich)
//
// Fokus: Gewerbe, Industrie, Landwirtschaft und öffentliche Hand in ganz
// Österreich. Alle Kernaussagen stammen aus @/data/hero (belegt, Stand 09/2026);
// es werden bewusst KEINE Gruppen-Kennzahlen der deutschen Website verwendet.

import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, BadgeEuro, BatteryCharging, BookOpen, Building2, ClipboardCheck, Cpu, Droplets, Factory, Gift,
  Handshake, HeartHandshake, Hotel, Landmark, Library, MapPin, Mountain, MonitorDot, Percent, PlugZap, Radio, Ruler, ScanSearch, Share2,
  ShieldAlert, ShieldCheck, SlidersHorizontal, Sprout, Sun, Tractor, TrendingUp, Trophy, Wrench,
} from "lucide-react";

import { projektSlug } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA, SCHWESTER } from "@/lib/site";
import { HOME_HERO, KERNFAKTEN, REFERENZ_UNTERNEHMEN } from "@/data/hero";

import Section from "@/components/ui/Section";
import SectionHeading, { Eyebrow } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import HeroProjektStart from "@/components/Home2/HeroProjektStart";
import { LiveDot } from "@/components/ui/LiveTicker";

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

// Bilder mit CC-Lizenz tragen eine Namensnennung (siehe Bildnachweis unten und public/Images/AT/QUELLEN-loesungen.md).
const ZIELGRUPPEN = [
  { titel: "Gewerbe & Industrie", text: "Hallen- und Flachdächer, ausgelegt nach Ihrem Lastgang – mit Parkregler, Monitoring und Wartungsvertrag.", href: "/gewerbe", bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", icon: Factory, gross: true },
  { titel: "Freiflächenanlagen", text: "Solarparks ab 500 kWp", href: "/freiflaechen-photovoltaik", bild: "/Images/Referenzen/projekteBanner.jpg", icon: Sun },
  { titel: "Agri-PV", text: "Doppelte Ernte", href: "/agri-pv", bild: "/Images/AT/loesungen/agri-pv-vertikal-bifazial.jpg", icon: Sprout },
  { titel: "Landwirtschaft", text: "Stall, Scheune, Halle", href: "/landwirtschaft", bild: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", icon: Tractor },
  { titel: "Hotellerie & Tourismus", text: "Hotels, Bergbahnen, Thermen", href: "/hotellerie-tourismus", bild: "/Images/AT/loesungen/tourismus-pv-skigebiet-wildkogel.jpg", icon: Hotel },
  { titel: "Gemeinden & Länder", text: "Schulen, Bauhöfe, Kläranlagen", href: "/kommunen", bild: "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg", icon: Landmark },
  { titel: "Luxus-Chalets & Alpin", text: "Indach, Schneelast, Concierge", href: "/chalets", bild: "/Images/AT/chalets/almhuette-schnee.jpg", icon: Mountain },
];

const BILDNACHWEIS = [
  "Agri-PV: Tobi Kellner, CC BY-SA 4.0 (Symbolbild, Deutschland)",
  "Hotellerie & Tourismus: Mr ccep, CC BY-SA 4.0",
  "Gemeinden & Länder: Naturpuur, CC BY 4.0",
  "Luxus-Chalets: simon berger, CC0",
];

const ENERGIE_NUTZEN = [
  { icon: BatteryCharging, title: "Gewerbespeicher", text: "Lastspitzen kappen, Leistungspreis senken, Überschüsse verschieben und Notstrom bereitstellen.", href: "/gewerbespeicher" },
  { icon: PlugZap, title: "Ladeinfrastruktur", text: "E-Flotte, Kundenparkplatz und Lkw mit Solarstrom laden – mit Lastmanagement am Netzanschluss.", href: "/ladeinfrastruktur" },
  { icon: Share2, title: "Energiegemeinschaften", text: "Überschüsse in einer EEG, BEG oder GEA teilen – mit reduzierten Netzentgelten in der EEG.", href: "/energiegemeinschaften" },
  { icon: TrendingUp, title: "Reststromvermarktung", text: "Überschuss über Direktvermarktung, PPA oder OeMAG-Marktpreis erlösen.", href: "/service/direktvermarktung" },
];

const TECHNIK = [
  { icon: SlidersHorizontal, title: "Parkregler (EZA-Regler)", text: "Regelt Wirk- und Blindleistung am Netzanschlusspunkt nach den Vorgaben des Netzbetreibers und den TOR Erzeuger – inklusive Einspeisebegrenzung und Fernwirkanbindung.", href: "/technik/parkregler" },
  { icon: Radio, title: "Fernwartung", text: "Gesicherte Fernzugriffe auf Wechselrichter, Regler und Zähler: Viele Störungen beheben wir, ohne dass jemand anfahren muss.", href: "/technik/fernwartung" },
  { icon: MonitorDot, title: "SCADA & Leitwarte", text: "Portfolio-Monitoring, Alarmierung und Reporting über alle Anlagen – entwickelt mit unserem Digitalisierungspartner Solensa.", href: "/technik/scada" },
];

const SERVICE = [
  { icon: Wrench, title: "Wartung & Wartungsvertrag", text: "Service-Level passend zur Anlagengröße – für eigene und fremd errichtete Anlagen.", href: "/service/wartung" },
  { icon: ClipboardCheck, title: "E-Check & Anlagenprüfung", text: "Erst- und wiederkehrende Prüfung nach ÖVE/ÖNORM E 8101 und EN 62446 mit Prüfbefund.", href: "/service/e-check" },
  { icon: ScanSearch, title: "Drohnen-Thermografie", text: "Hotspots und defekte Module aus der Luft finden – georeferenziert dokumentiert.", href: "/service/drohneninspektion" },
  { icon: Droplets, title: "PV-Reinigung", text: "Schonende Reinigung nach Herstellervorgaben, wenn der Ertragsvergleich es rechtfertigt.", href: "/service/reinigung" },
  { icon: ShieldCheck, title: "PV-Versicherung", text: "Beratung zu Allgefahren-, Ertragsausfall- und Haftpflichtschutz – wir vermitteln Kontakte.", href: "/service/versicherung" },
  { icon: ShieldAlert, title: "Notstrom & Blackout-Vorsorge", text: "Ersatzstrom und Inselbetrieb für kritische Verbraucher – normgerecht umgeschaltet.", href: "/service/notstrom" },
];

const GEMEINSAM = [
  { icon: Trophy, title: "Ökovolt PV Award", text: "Jährlich zeichnen wir Kundinnen und Kunden für die besten Anlagen und Nachhaltigkeitsinvestitionen aus.", href: "/pv-award" },
  { icon: Handshake, title: "Elektro-Partner werden", text: "Elektrotechnik-Betriebe registrieren sich als Partner – Ökovolt ist die zentrale Plattform für Planung, Material und Projekte.", href: "/partner" },
  { icon: HeartHandshake, title: "Sponsoring", text: "Wir unterstützen Vereine, Kultur und Nachwuchs in den Regionen, in denen wir bauen – Anfragen gerne über das Formular.", href: "/sponsoring" },
];

const WISSEN = [
  { titel: "Ratgeber", text: "Fachartikel für Geschäftsführung, Technik und Einkauf – österreichische Rechtslage.", href: "/ratgeber", icon: BookOpen },
  { titel: "Photovoltaik-Lexikon", text: "Von Netzebene bis TOR Erzeuger: Fachbegriffe kurz erklärt.", href: "/wissen/lexikon", icon: Library },
  { titel: "Strommarkt Österreich live", text: "Day-Ahead-Preis der Gebotszone AT und Erzeugungsmix.", href: "/energie-live", icon: Activity, live: true },
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
  const projekteRoh = await getProjekte();

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
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-ov-500/20 blur-[140px]" />

        <div className="ov-container grid items-center gap-12 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-32 lg:pt-24">
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
              <Button href="/angebot" size="lg" pfeil>Ersteinschätzung anfordern</Button>
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
            <HeroProjektStart />
          </div>
        </div>

        {/* Kernfakten */}
        <div className="relative border-t border-white/10 bg-navy-950/60 backdrop-blur-md">
          <dl className="ov-container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
            {KERNFAKTEN.map((k, i) => (
              <div key={k.label} className={`flex flex-col-reverse px-2 md:px-6 ${i > 0 ? "md:border-l md:border-white/10" : ""}`}>
                <dt className="mt-2 text-[13.5px] text-white/55">{k.label}</dt>
                <dd className="font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.5rem)] font-extrabold leading-none tracking-tight">{k.wert}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= REFERENZEN (Namensliste) ================= */}
      <Section tone="white" space="md">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Referenzen u. a. aus Industrie, Holz, Handel, Logistik und Tourismus</Eyebrow>
            <h2 className="ov-h3 mt-4 text-ink-900">Unternehmen, die mit uns Strom erzeugen</h2>
            <Link href="/referenzen/projekte" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alle Referenzprojekte
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <ul className="flex flex-wrap gap-2">
            {REFERENZ_UNTERNEHMEN.map((r) => (
              <li key={r.slug}>
                {vorhandeneSlugs.has(r.slug) ? (
                  <Link
                    href={`/referenzen/projekte/${r.slug}`}
                    className="inline-flex min-h-10 items-center rounded-full bg-sand-50 px-4 py-2 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200/70 transition-colors hover:bg-white hover:text-ov-700 hover:ring-ov-200"
                  >
                    {r.name}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-10 items-center rounded-full bg-sand-50 px-4 py-2 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200/70">
                    {r.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Section>

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

        <div className="grid auto-rows-[210px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:grid-cols-4 md:gap-4 md:auto-rows-[260px]">
          {ZIELGRUPPEN.map((p, i) => (
            <Reveal key={p.href} delay={i * 70} className={p.gross ? "col-span-2 row-span-2" : ""}>
              <Link href={p.href} className="group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 p-4 text-white sm:p-6 md:rounded-[2rem] md:p-8">
                <Image src={p.bild} alt="" fill sizes={p.gross ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"} className="object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/35 to-transparent" />
                <span className="ov-glass absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl sm:h-11 sm:w-11 md:left-6 md:top-6">
                  <p.icon aria-hidden="true" className="h-5 w-5 text-ov-300" />
                </span>
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-900 opacity-0 transition-all duration-300 group-hover:opacity-100 md:right-6 md:top-6">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="relative">
                  <h3 className={`font-display font-extrabold tracking-tight ${p.gross ? "text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)]" : "text-[17px] sm:text-[21px]"}`}>{p.titel}</h3>
                  <p className={`mt-2 text-white/75 ${p.gross ? "max-w-md text-[16.5px]" : "hidden text-[14.5px] sm:block"}`}>{p.text}</p>
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

      {/* ================= WARUM ÖKOVOLT ================= */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal dir="left" className="relative">
            <div className="relative aspect-[4/5] rounded-[2rem] shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src="/Images/AT/service/pv-wartung-techniker.jpg" alt="Monteur mit Absturzsicherung trägt ein Photovoltaikmodul über ein Blechdach" fill sizes="(max-width: 1024px) 100vw, 50vw" className="rounded-[2rem] object-cover" />
              <div className="absolute -bottom-6 right-4 max-w-[270px] rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-ink-100 md:-right-6">
                <p className="font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-600">seit 2012</p>
                <p className="mt-2 text-[14px] leading-snug text-ink-600">betreiben die Gründer eigene Solarparks – wir bauen, was wir selbst betreiben würden.</p>
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <SectionHeading
              eyebrow="Warum Ökovolt"
              title="Betreiber aus Überzeugung – Errichter mit System."
              lead={`Seit 2012 baut Ökovolt Photovoltaik in Österreich. 2021 errichteten wir Anlagen mit rund 30 MWp und zählten zu den TOP 3 der IPC-Errichter Österreichs. Gesellschafterin mit 49 % ist die Salzburg AG; Standards und Prozesse teilen wir mit unserer deutschen Schwestergesellschaft in ${SCHWESTER.ort}, die seit 2010 PV-Anlagen errichtet.`}
            />
            <ul className="mt-10 space-y-4">
              {[
                { icon: Ruler, title: "Planung, Bau und Betrieb aus einer Hand", text: "Lastganganalyse, Netzantrag, Statik, Montage durch den eigenen Elektrotechnik-Fachbetrieb, Inbetriebnahme und Wartung – ein Ansprechpartner über die gesamte Lebensdauer." },
                { icon: Cpu, title: "Eigene Regelungs- und Leittechnik", text: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung – abgestimmt auf TOR Erzeuger und österreichische Netzbetreiber." },
                { icon: Building2, title: "Starke Gesellschafter", text: "Andreas Wegscheider (51 %) und die Salzburg AG für Energie, Verkehr und Telekommunikation (49 %)." },
              ].map((k, i) => (
                <Reveal as="li" key={k.title} delay={i * 90} className="flex gap-5 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
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

      {/* ================= ENERGIE NUTZEN ================= */}
      <Section tone="navy" space="lg" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-32 -top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeading dark eyebrow="Energie nutzen" title={<>Jede Kilowattstunde <span className="ov-text-gradient-light">an der richtigen Stelle.</span></>} />
            <Reveal delay={120}>
              <p className="ov-lead text-white/65">
                Solarstrom rechnet sich am besten, wenn er im Betrieb verbraucht wird. Was übrig bleibt, speichern, laden, teilen oder vermarkten wir – abgestimmt auf Lastgang, Netzanschluss und Tarif.
              </p>
            </Reveal>
          </div>
          <FeatureGrid items={ENERGIE_NUTZEN} cols={4} tone="dark" />
        </div>
      </Section>

      {/* ================= EIGENE TECHNIK ================= */}
      <Section tone="white" space="lg">
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
        <FeatureGrid items={TECHNIK} cols={3} />
      </Section>

      {/* ================= PROZESS ================= */}
      <Section tone="green" space="lg">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="In vier Schritten" title="Vom Lastgang zum laufenden Kraftwerk" lead="Ein Ansprechpartner von der ersten Analyse bis zur Wartung – über die gesamte Lebensdauer der Anlage." />
          <Reveal delay={100}><Button href="/angebot" pfeil>Projekt starten</Button></Reveal>
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

      {/* ================= SERVICE-LEBENSZYKLUS ================= */}
      <Section tone="white" space="lg">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Service über den Lebenszyklus"
            title="Damit die Anlage 25 Jahre und länger liefert."
            lead="Wartung, Prüfung und Absicherung – für Anlagen, die wir gebaut haben, und für Bestandsanlagen anderer Errichter."
          />
          <Reveal delay={100}>
            <Button href="/service/wartung#anfrage" variant="secondary" pfeil>Wartungsvertrag anfragen</Button>
          </Reveal>
        </div>
        <FeatureGrid items={SERVICE} cols={3} />
      </Section>

      {/* ================= FÖRDERUNG + STANDORT-CHECK ================= */}
      <Section tone="sand" space="lg">
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal dir="scale" className="lg:col-span-2">
            <Link href="/foerdercheck" className="ov-noise group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-ov-600 to-ov-800 p-8 text-white md:p-12">
              <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-sun-300/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="relative">
                <Eyebrow dark className="text-white/80">Förderung Österreich</Eyebrow>
                <h2 className="ov-h2 mt-4 max-w-xl text-white">EAG-Zuschuss, IFB, Länder: Welche Förderung passt zu Ihrem Projekt?</h2>
                <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-white/80">
                  EAG-Investitionszuschuss 2026 bis zu 150 €/kWp, Investitionsfreibetrag für PV befristet 22 % und Landesprogramme in allen neun Bundesländern – der Förder-Check zeigt, was kombinierbar ist (Stand: September 2026).
                </p>
              </div>
              <span className="relative mt-8 inline-flex h-12 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-ov-800 transition-transform group-hover:scale-[1.03]">
                Förder-Check starten <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
          <div className="grid gap-5">
            <Reveal delay={100}>
              <Link href="/standort-check" className="group ov-card-hover relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white">
                <div aria-hidden="true" className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-ov-500/35 blur-3xl" />
                <Mountain aria-hidden="true" className="relative h-6 w-6 text-ov-300" />
                <div className="relative mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">Standort-Check mit eHORA</p>
                  <h3 className="mt-1.5 font-display text-[20px] font-bold group-hover:text-ov-300">Schneelast, Wind, Hagel und Ertrag für Ihre Adresse</h3>
                  <p className="mt-1.5 text-[14.5px] text-white/65">In einer Minute – auf Basis von eHORA und PVGIS.</p>
                </div>
              </Link>
            </Reveal>
            {[
              { titel: "Bundesförderung (EAG & KPC)", text: "OeMAG-Investitionszuschuss und betriebliche Umweltförderung.", href: "/forderungen/bundesfoerderung", icon: BadgeEuro },
              { titel: "Steuerliche Vorteile", text: "IFB, AfA und Befreiung von der Elektrizitätsabgabe.", href: "/forderungen/steuerlich", icon: Percent },
            ].map((w, i) => (
              <Reveal key={w.href} delay={160 + i * 80}>
                <Link href={w.href} className="group ov-card-hover flex h-full items-start gap-4 rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/60">
                  <w.icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-ov-600" />
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink-900 group-hover:text-ov-700">{w.titel}</h3>
                    <p className="mt-1 text-[14.5px] text-ink-500">{w.text}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
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

      {/* ================= GEMEINSAM: AWARD, PARTNER, SPONSORING ================= */}
      <Section tone={projekte.length > 0 ? "sand" : "white"} space="lg">
        <SectionHeading
          align="center"
          eyebrow="Gemeinsam mehr bewegen"
          title="Auszeichnen, zusammenarbeiten, unterstützen"
          lead="Die Energiewende gelingt nur gemeinsam – mit Kundinnen und Kunden, Elektrotechnik-Partnern und den Regionen, in denen wir bauen."
          className="mb-14"
        />
        <FeatureGrid items={GEMEINSAM} cols={3} />
      </Section>

      {/* ================= WISSEN ================= */}
      <Section tone={projekte.length > 0 ? "white" : "sand"} space="lg">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Wissen" title="Fachwissen für Geschäftsführung, Technik und Einkauf" lead="Österreichische Rechtslage, echte Zahlen mit Quellen, Normen und Praxis – ohne Werbefloskeln." />
          <Reveal delay={100}><Button href="/ratgeber" variant="secondary" pfeil>Zum Ratgeber</Button></Reveal>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {WISSEN.map((w, i) => (
            <Reveal as="li" key={w.href} delay={i * 70} className="flex">
              <Link href={w.href} className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-200">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ink-100 transition-all duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                    <w.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  {w.live && (
                    <span className="flex items-center gap-1.5 rounded-full bg-navy-950 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"><LiveDot /> Live</span>
                  )}
                </div>
                <h3 className="mt-6 font-display text-[19px] font-bold text-ink-900">{w.titel}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-500">{w.text}</p>
                <ArrowRight aria-hidden="true" className="mt-5 h-5 w-5 text-ink-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ov-600" />
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 flex items-center gap-2 text-[13px] text-ink-500">
          <Gift aria-hidden="true" className="h-4 w-4 text-ov-600" />
          Bestandskunden: exklusive Angebote in der{" "}
          <Link href="/service/vorteilswelt" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">Ökovolt Vorteilswelt</Link>.
        </p>
      </Section>

      {/* ================= FAQ ================= */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Ökovolt Österreich – kurz beantwortet" lead={`Noch Fragen? Unser Team in ${FIRMA.ort} berät Sie persönlich.`} />
            <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
              <Button href="/faqs" variant="secondary" size="sm" pfeil>Alle FAQs</Button>
              <Button href="/wissen/lexikon" variant="ghost" size="sm">PV-Lexikon</Button>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Ihr Dach, Ihre Fläche, Ihr Lastgang – wir rechnen es durch."
        text={`Persönliche Beratung vom Elektrotechnik-Fachbetrieb aus ${FIRMA.ort}: ehrliche Wirtschaftlichkeitsrechnung, Förderprüfung und ein fester Ansprechpartner von der Planung bis zum Betrieb – in ganz Österreich.`}
        primary={{ label: "Ersteinschätzung anfordern", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: "/termin" }}
      />

      <p className="ov-container pb-8 text-[11.5px] leading-relaxed text-ink-500">
        Bildnachweis: {BILDNACHWEIS.join(" · ")} – Details in den Bildquellen der jeweiligen Lösungsseiten.
      </p>
    </div>
  );
}
