// dienstleistungen/smarthome/page.js
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  Calculator,
  Car,
  ClipboardList,
  Cpu,
  Flame,
  Gauge,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  Sun,
  Wrench,
  Zap,
  MessagesSquare,
  Phone,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Fliesstext from "@/components/Reusable/Fliesstext";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import HerstellerWortmarken from "@/components/Hersteller/HerstellerWortmarken";
import EnergieflussHaus from "@/components/Smarthome/EnergieflussHaus";
import BausteineTabs from "@/components/Smarthome/BausteineTabs";
import Paragraf14a from "@/components/Smarthome/Paragraf14a";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import { SMARTHOME_FAQ } from "@/data/smarthome-seite";

// Österreich: statische Inhalte (die Backoffice-API lieferte die deutsche
// Seite mit deutscher Rechtslage). Smart-Meter-Aussagen nach ElWG § 54, Stand 09/2026.
const PFAD = "/dienstleistungen/smarthome";
const SMARTHOME_PAGE_URL = `${BASE_URL}${PFAD}`;

const META_TITLE = "Smarthome & Energiemanagement mit PV | Ökovolt";
const META_DESCRIPTION =
  "Stromspeicher, Wallbox, Notstrom und Smart Meter als ein System: Energiemanagement mit Photovoltaik für Wohnhaus und Chalet in Österreich, aus einer Hand.";

export const metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: ["Smarthome Photovoltaik", "Energiemanagement", "Stromspeicher", "Wallbox", "Notstrom", "Smart Meter Österreich"],
  alternates: { canonical: SMARTHOME_PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: SMARTHOME_PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Smarthome" }],
  },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const BILD = "/Images/Dienstleistungen/Smartphone/";

// Zuordnung der API-Bausteine (nach Titel) zu Icon-Schlüssel, Fallback-Bild und Produktseite
const BAUSTEIN_META = [
  { match: /batterie|speicher/i, key: "speicher", bild: `${BILD}Stronspeicher.jpg`, href: "/produkte/stromspeicher", linkLabel: "Zu den Stromspeichern", kurz: "Solarstrom für abends & nachts" },
  { match: /lade|wallbox/i, key: "wallbox", bild: `${BILD}wallbox-scaled.jpg`, href: "/produkte/wallbox", linkLabel: "Zur Wallbox", kurz: "E-Auto mit Sonnenstrom laden" },
  { match: /notstrom/i, key: "notstrom", bild: `${BILD}smart-guard-scaled.jpg`, href: "/service/notstrom", linkLabel: "Notstrom & Blackout-Vorsorge", kurz: "Versorgt bei Stromausfall" },
  { match: /smart ?meter|zähler/i, key: "smartmeter", bild: `${BILD}smart-home-3920905_1280.jpg`, href: "/produkte/smartmeter", linkLabel: "Zum Smart Meter", kurz: "Viertelstundenwerte & Steuerung" },
];

const BAUSTEINE_FALLBACK = [
  {
    tab: "Batteriesysteme",
    titel: "Stromspeicher für Photovoltaik – Sonnenstrom rund um die Uhr",
    text: "Nutzen Sie nicht nur tagsüber die Energie der Sonne.\n\nMit einem Stromspeicher speichern Sie überschüssigen Solarstrom und verwenden ihn abends, nachts oder bei bewölktem Himmel. Ein Speicher lässt sich auch an bestehende PV-Anlagen nachrüsten.",
    alt: "Stromspeicher für Photovoltaik-Anlagen im Einfamilienhaus",
  },
  {
    tab: "Ladestationen",
    titel: "Elektrofahrzeuge intelligent laden",
    text: "Warum eine eigene Wallbox für Ihr Elektroauto?\n\nZeit sparen – nicht mehr auf öffentliche Ladesäulen angewiesen sein; Günstigere Ladekosten – E-Auto mit eigenem Solarstrom laden; Volle Kontrolle – höhere Ladeleistung und intelligente Steuerung per App",
    alt: "Wallbox zum Laden von Elektrofahrzeugen mit Solarstrom",
  },
  {
    tab: "Notstrombox",
    titel: "Stromspeicher mit Notstromfunktion – unabhängig bei Stromausfällen",
    text: "Bleiben Sie auch bei Netzausfällen versorgt.\n\nMit einer Notstrombox laufen wichtige Geräte in Ihrem Haushalt auch bei einem Stromausfall weiter – versorgt aus Ihrem Speicher.",
    alt: "Notstrombox für die Stromversorgung bei Netzausfall",
  },
  {
    tab: "Smartmeter",
    titel: "Smart Meter und Energiezähler",
    text: "Der Smart Meter des Netzbetreibers misst in Viertelstundenwerten – mit PV, Wallbox, Wärmepumpe oder Speicher ist ein Opt-out nach § 54 ElWG nicht möglich.\n\nFür die Regelung im Haus misst ein Energiezähler am Hausanschluss in Echtzeit. So sehen Sie Erzeugung und Verbrauch in der App und nutzen Ihren Solarstrom gezielter.",
    alt: "Smartmeter und App zur Steuerung der Photovoltaikanlage",
  },
];

const VORTEIL_ICONS = [PiggyBank, Car, ShieldCheck, Smartphone];

const VORTEILE_FALLBACK = [
  { title: "Energiekosten reduzieren", description: "Mit Speicher und Energiemanagement kaufen Sie weniger teuren Netzstrom und nutzen mehr eigenen Sonnenstrom." },
  { title: "Mobilitätskosten reduzieren", description: "Laden Sie Ihr E-Auto zuhause mit selbst erzeugtem Solarstrom – direkt über Ihre eigene Wallbox." },
  { title: "Notstrombox", description: "Leise, wartungsarm und unabhängig: Wichtige Geräte laufen auch bei einem Stromausfall weiter." },
  { title: "Transparenz", description: "Sehen Sie in Echtzeit, wie viel Energie produziert und verbraucht wird – und optimieren Sie Ihren Energiehaushalt." },
];

const SYSTEM = [
  { icon: Sun, name: "Photovoltaik", text: "erzeugt Solarstrom" },
  { icon: BatteryCharging, name: "Stromspeicher", text: "puffert für Abend & Nacht" },
  { icon: Car, name: "Wallbox", text: "lädt bei Überschuss" },
  { icon: Flame, name: "Wärmepumpe", text: "heizt mit eigenem Strom" },
  { icon: Gauge, name: "Smart Meter", text: "misst am Hausanschluss" },
];

const FAQ = SMARTHOME_FAQ.map((f) => ({ q: f.frage, a: f.antwort }));

export default function SmarthomePage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SMARTHOME_PAGE_URL}/#webpage`,
        url: SMARTHOME_PAGE_URL,
        name: META_TITLE,
        description: META_DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${SMARTHOME_PAGE_URL}/#service` },
      },
      {
        "@type": "Service",
        "@id": `${SMARTHOME_PAGE_URL}/#service`,
        name: "Smarthome-Lösungen und Energiemanagement",
        serviceType: "Planung und Installation von Energiemanagement, Stromspeicher, Wallbox, Notstrom und Messung",
        description: META_DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        url: SMARTHOME_PAGE_URL,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Smarthome-Bausteine",
          itemListElement: ["Stromspeicher", "Wallbox", "Notstrom", "Smart Meter & Energiemanagement"].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
        },
      },
    ],
  };

  const bausteine = BAUSTEINE_FALLBACK.map((b, i) => {
    const name = b.tab;
    const meta = BAUSTEIN_META.find((m) => m.match.test(name || "")) || BAUSTEIN_META[i % BAUSTEIN_META.length];
    return {
      key: meta.key,
      tab: name,
      kurz: meta.kurz,
      titel: b.titel,
      text: b.text,
      bild: meta.bild,
      alt: b.alt,
      href: meta.href,
      linkLabel: meta.linkLabel,
    };
  });

  const vorteile = VORTEILE_FALLBACK.map((v, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: v.title,
    text: v.description,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Dienstleistungen" }, { name: "Smarthome" }]}
        eyebrow="Smarthome & Energiemanagement"
        title={<>Ein Haus, ein System: Solarstrom <span className="ov-text-gradient">intelligent</span> nutzen</>}
        lead="Photovoltaik, Speicher, Wallbox, Wärmepumpe und Messung arbeiten zusammen – gesteuert von einem Energiemanagement, das jede Kilowattstunde dorthin schickt, wo sie gerade am meisten wert ist. Für Wohnhaus und Chalet in ganz Österreich."
        image={{ src: `${BILD}smart-home-3920905_1280.jpg`, alt: "Smarthome-Steuerung für Stromspeicher und Solaranlage per Smart Device" }}
        points={["Mehr Eigenverbrauch mit Speicher & EMS", "Nachrüstbar für bestehende PV-Anlagen", "Notstrom bei Netzausfall möglich", "Meldung beim Netzbetreiber inklusive"]}
        actions={[
          { label: "Smarthome-Angebot anfragen", href: "/angebot" },
          { label: "Speicher berechnen", href: "/rechner/stromspeicher", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-ov-300">
              <Cpu aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">1 System</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">PV, Speicher, Wallbox, Wärmepumpe und Messung</p>
            </div>
          </div>
        }
      />

      <HerstellerWortmarken titel="Wechselrichter, Speicher und Monitoring unserer Partner" fokus={["speicher", "monitoring"]} />

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Smarthome-Lösungen"
          title={<>Ein System statt <span className="ov-text-gradient">Insellösungen</span></>}
          aside={
            <div className="relative overflow-hidden rounded-[2rem] bg-navy-950 p-6 text-white shadow-2xl md:p-8">
              <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
              <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ov-500/30 blur-[100px]" />
              <div className="relative">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">5 Komponenten · 1 Steuerung</p>
                <ul className="mt-6 space-y-2.5">
                  {SYSTEM.map(({ icon: Icon, name, text }) => (
                    <li key={name} className="flex items-center gap-4 rounded-2xl bg-white/[0.05] px-4 py-3 ring-1 ring-white/10">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="font-display text-[16px] font-bold">{name}</span>
                      <span className="ml-auto hidden text-right text-[13.5px] text-white/55 sm:block">{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-ov-600 px-4 py-3.5 shadow-lg">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <Cpu aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[16px] font-bold">Energiemanagement</span>
                  <span className="ml-auto hidden text-right text-[13.5px] text-white sm:block">entscheidet in Echtzeit</span>
                </div>
              </div>
            </div>
          }
        >
          <p className="mt-5 text-[17px] font-medium leading-relaxed text-ink-800">
            Ein Energiemanagement verbindet alle Stromerzeuger und -verbraucher im Haus und steuert sie automatisch so, dass möglichst viel eigener Solarstrom genutzt wird.
          </p>
          <Fliesstext
            text="Mit einem Stromspeicher und intelligenter Steuerung nutzen Sie Ihren Sonnenstrom auch abends und nachts. Ein Speicher lässt sich jederzeit in eine bestehende PV-Anlage nachrüsten."
            className="mt-4 text-[16.5px] leading-relaxed text-ink-600"
          />
          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-600">
            Als Elektrotechnik-Fachbetrieb aus {FIRMA.ort} planen, installieren und melden wir alle Komponenten aus einer Hand beim Netzbetreiber – abgestimmt aufeinander statt nebeneinander.
          </p>
        </SplitMedia>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            align="center"
            eyebrow="So arbeitet das Energiemanagement"
            title={<>Ihr Haus als <span className="ov-text-gradient-light">Kraftwerk</span></>}
            lead="Mittags Überschuss, abends Bedarf, nachts günstiger Strom, im Ernstfall Notstrom: Wählen Sie eine Situation und sehen Sie, wie die Energie durch Ihr Haus fließt."
            className="mb-12"
          />
          <Reveal dir="scale">
            <EnergieflussHaus />
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Die Bausteine"
            title="Vier Bausteine für Ihr smartes Energiesystem"
            lead="Einzeln nachrüstbar, gemeinsam am stärksten. Wählen Sie einen Baustein für Details."
          />
          <Reveal delay={100} className="flex flex-wrap gap-2">
            {[
              { href: "/produkte/warmepumpe", label: "Wärmepumpe", icon: Flame },
              { href: "/produkte/smartenergyhome", label: "Smart Energy Home", icon: Zap },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-ink-800 ring-1 ring-ink-200 transition-colors hover:text-ov-700 hover:ring-ov-300"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                {label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </Reveal>
        </div>
        <Reveal>
          <BausteineTabs items={bausteine} />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <Paragraf14a />
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Vorteile"
              title="Vorteile mit einer Smarthome-Lösung"
              lead="Weniger Netzstrom, günstigere Mobilität, Sicherheit bei Stromausfall und volle Transparenz – das bringt ein vernetztes Energiesystem im Alltag."
            />
            <Reveal delay={120} className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="ov-glass rounded-3xl p-6">
                <p className="ov-num font-display text-[34px] font-extrabold leading-none text-white">9</p>
                <p className="mt-2 text-[14px] leading-snug text-white/60">Bundesländer im Einzugsgebiet</p>
              </div>
              <div className="ov-glass rounded-3xl p-6">
                <p className="ov-num font-display text-[34px] font-extrabold leading-none text-white">seit {FIRMA.gegruendet}</p>
                <p className="mt-2 text-[14px] leading-snug text-white/60">Elektrotechnik-Fachbetrieb aus {FIRMA.ort}</p>
              </div>
            </Reveal>
          </div>
          <FeatureGrid items={vorteile} cols={2} tone="dark" />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ablauf"
          title="In vier Schritten zum smarten Energiesystem"
          lead="Planung, Montage und Anmeldung aus einer Hand – mit festem Ansprechpartner bis zur Inbetriebnahme."
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: MessagesSquare, title: "Beratung", text: "Wir besprechen Verbrauch, E-Auto- und Heizungspläne und sehen uns Ihre bestehende Anlage und den Zählerschrank an." },
            { icon: ClipboardList, title: "Planung", text: "Sie erhalten ein abgestimmtes Konzept aus Speicher, Wallbox, Messung und Steuerung – inklusive Klärung der Anschlussleistung mit dem Netzbetreiber." },
            { icon: Wrench, title: "Installation", text: "Unsere Fachkräfte installieren alle Komponenten, übernehmen die Anmeldung beim Netzbetreiber und nehmen das System in Betrieb." },
            { icon: Smartphone, title: "App & Optimierung", text: "Wir richten die App mit Ihnen ein und stellen Prioritäten wie Überschussladen oder Notstromreserve passend ein." },
          ]}
        />
      </Section>

      <SolarrechnerTeaser
        href="/rechner/wallbox"
        cta="Zum E-Auto-Laderechner"
        titel="Was spart Ihr E-Auto mit Solarstrom?"
        text="Fahrleistung, Anlage und Stromtarif eingeben – der Rechner zeigt, wie viel Sie mit Laden per Sonnenstrom gegenüber Netzstrom sparen."
      />

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Smarthome & Energiemanagement – kurz beantwortet"
              lead="Sie haben eine andere Frage? Rufen Sie uns an – wir beraten Sie persönlich."
            />
            <Reveal delay={120} className="mt-8">
              <a href={FIRMA.telefonHref} className="inline-flex items-center gap-3 font-display text-[20px] font-extrabold text-ink-900 hover:text-ov-700">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 text-white">
                  <Phone aria-hidden="true" className="h-5 w-5" />
                </span>
                {FIRMA.telefon}
              </a>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Machen Sie aus Ihrem Haus ein Kraftwerk."
        text={`${FIRMA.name} aus ${FIRMA.ort} plant Speicher, Wallbox, Wärmepumpe, Notstrom und Energiemanagement als ein abgestimmtes System – in ganz Österreich.`}
        primary={{ label: "Smarthome-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
