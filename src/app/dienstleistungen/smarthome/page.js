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
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import EnergieflussHaus from "@/components/Smarthome/EnergieflussHaus";
import BausteineTabs from "@/components/Smarthome/BausteineTabs";
import Paragraf14a from "@/components/Smarthome/Paragraf14a";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.smarthome_page.api.get_smarthome_page`;
const SMARTHOME_PAGE_URL = "https://www.oekovolt.de/dienstleistungen/smarthome";

async function fetchSmarthomeData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

const META_TITLE = "Smarthome-Lösungen: Speicher, Wallbox & Smartmeter | Ökovolt";
const META_DESCRIPTION =
  "Smarthome-Lösungen von Ökovolt: Stromspeicher, Wallbox, Notstrombox & Smartmeter – Solarstrom intelligent nutzen und Eigenverbrauch auf bis zu 80 % steigern.";
const DEFAULT_KEYWORDS = ["Smarthome", "Smart Home", "Energiemanagement", "Hausautomation", "Energieeffizienz", "Vernetztes Wohnen"];

export async function generateMetadata() {
  const seoData = await fetchSmarthomeData();

  // Keywords aus der API, sonst Fallback
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : DEFAULT_KEYWORDS;

  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords,
    alternates: { canonical: SMARTHOME_PAGE_URL, languages: hreflangLanguages(SMARTHOME_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: SMARTHOME_PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Smart Home" }],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

const img = (p, fallback) => (p ? `/api/image?path=${p}` : fallback);
const BILD = "/Images/Dienstleistungen/Smartphone/";

// Zuordnung der API-Bausteine (nach Titel) zu Icon-Schlüssel, Fallback-Bild und Produktseite
const BAUSTEIN_META = [
  { match: /batterie|speicher/i, key: "speicher", bild: `${BILD}Stronspeicher.jpg`, href: "/produkte/stromspeicher", linkLabel: "Zu den Stromspeichern", kurz: "Solarstrom für abends & nachts" },
  { match: /lade|wallbox/i, key: "wallbox", bild: `${BILD}wallbox-scaled.jpg`, href: "/produkte/wallbox", linkLabel: "Zur Wallbox", kurz: "E-Auto mit Sonnenstrom laden" },
  { match: /notstrom/i, key: "notstrom", bild: `${BILD}smart-guard-scaled.jpg`, href: "/produkte/stromspeicher", linkLabel: "Speicher mit Notstrom", kurz: "Versorgt bei Stromausfall" },
  { match: /smart ?meter|zähler/i, key: "smartmeter", bild: `${BILD}smart-home-3920905_1280.jpg`, href: "/produkte/smartmeter", linkLabel: "Zum Smartmeter", kurz: "Energieflüsse messen & steuern" },
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
    titel: "Smarte Steuerung mit Smartmeter",
    text: "Ein Smartmeter misst die Energieflüsse an Ihrem Hausanschluss präzise – die Grundlage für jedes Energiemanagement.\n\nSie sehen Erzeugung und Verbrauch in Echtzeit in der App und nutzen Ihren Solarstrom gezielter.",
    alt: "Smartmeter und App zur Steuerung der Photovoltaikanlage",
  },
];

const VORTEIL_ICONS = [PiggyBank, Car, ShieldCheck, Smartphone];

const VORTEILE_FALLBACK = [
  { title: "Energiekosten reduzieren", description: "Mit Speicher und Energiemanagement kaufen Sie weniger teuren Netzstrom und nutzen mehr eigenen Sonnenstrom." },
  { title: "Mobilitätskosten reduzieren", description: "Laden Sie Ihr E-Auto zuhause mit selbst erzeugtem Solarstrom – direkt über Ihre eigene Wallbox." },
  { title: "Notstrombox", description: "Leise, wartungsarm und unabhängig: Wichtige Geräte laufen auch bei einem Stromausfall weiter." },
  { title: "Smartmeter", description: "Sehen Sie in Echtzeit, wie viel Energie produziert und verbraucht wird – und optimieren Sie Ihren Energiehaushalt." },
];

const SYSTEM = [
  { icon: Sun, name: "Photovoltaik", text: "erzeugt Solarstrom" },
  { icon: BatteryCharging, name: "Stromspeicher", text: "puffert für Abend & Nacht" },
  { icon: Car, name: "Wallbox", text: "lädt bei Überschuss" },
  { icon: Flame, name: "Wärmepumpe", text: "heizt mit eigenem Strom" },
  { icon: Gauge, name: "Smart Meter", text: "misst am Hausanschluss" },
];

const FAQ = [
  {
    q: "Was ist ein Energiemanagementsystem (EMS) im Smarthome?",
    a: "Ein Energiemanagementsystem ist die Steuerzentrale zwischen Photovoltaik, Stromspeicher, Wallbox, Wärmepumpe und Stromnetz. Es misst laufend, wie viel Strom erzeugt und verbraucht wird, und entscheidet automatisch, welches Gerät wann Energie bekommt – mit dem Ziel, möglichst viel eigenen Solarstrom zu nutzen und teuren Netzbezug zu vermeiden.",
  },
  {
    q: "Brauche ich dafür ein Smart Meter?",
    a: "Für das Energiemanagement im Haus reicht in der Regel ein Energiezähler am Hausanschluss, der zum Wechselrichter-System passt (z. B. von Fronius oder HUAWEI). Davon zu unterscheiden ist das intelligente Messsystem des Messstellenbetreibers: Es ist Voraussetzung für dynamische Stromtarife und zeitvariable Netzentgelte und wird unter anderem bei PV-Anlagen über 7 kW, steuerbaren Verbrauchseinrichtungen oder mehr als 6.000 kWh Jahresverbrauch verpflichtend eingebaut (Orientierung, Stand 2026).",
  },
  {
    q: "Kann ich Speicher, Wallbox oder Energiemanagement an meine bestehende PV-Anlage nachrüsten?",
    a: "Ja. Ein Stromspeicher lässt sich jederzeit nachrüsten, ebenso eine Wallbox oder ein Smartmeter. Entscheidend ist, dass Wechselrichter, Speicher und Steuerung miteinander kommunizieren können. Wir prüfen Ihre Bestandsanlage und schlagen eine passende, kompatible Lösung vor.",
  },
  {
    q: "Was bedeutet §14a EnWG für meine Wärmepumpe oder Wallbox?",
    a: "Neue Wärmepumpen, private Wallboxen und Speicher mit mehr als 4,2 kW Anschlussleistung sind seit 2024 steuerbare Verbrauchseinrichtungen. Sie erhalten ein reduziertes Netzentgelt; im Gegenzug darf der Netzbetreiber bei Netzengpässen den Bezug dieser Geräte vorübergehend auf mindestens 4,2 kW drosseln. Der normale Haushaltsstrom bleibt unberührt. Die Anmeldung beim Netzbetreiber übernehmen wir.",
  },
  {
    q: "Habe ich mit Speicher bei einem Stromausfall automatisch Strom?",
    a: "Nur, wenn das System dafür ausgelegt ist. Ein normaler Speicher schaltet sich bei Netzausfall aus Sicherheitsgründen ab. Mit einer Notstrombox trennt sich das Haus vom Netz und ausgewählte Stromkreise – etwa Kühlschrank, Licht und Router – werden aus dem Speicher weiterversorgt. Welche Verbraucher angeschlossen werden, legen wir gemeinsam fest.",
  },
  {
    q: "Lohnt sich ein dynamischer Stromtarif mit Energiemanagement?",
    a: "Vor allem dann, wenn Sie große, zeitlich flexible Verbraucher haben – ein E-Auto oder eine Wärmepumpe. Das Energiemanagement kann diese gezielt in Stunden mit niedrigen Börsenpreisen laufen lassen. Seit 2025 müssen alle Stromanbieter einen dynamischen Tarif anbieten; Voraussetzung ist ein intelligentes Messsystem. Ob es sich für Sie rechnet, hängt von Ihrem Verbrauchsprofil ab.",
  },
  {
    q: "Kann ich alles per App steuern?",
    a: "Ja. Die Systeme unserer Partnerhersteller bringen eine App mit, in der Sie Erzeugung, Verbrauch, Speicherstand und Ladevorgänge in Echtzeit sehen und Einstellungen wie Überschussladen oder Notstromreserve anpassen können.",
  },
];

export default async function SmarthomePage() {
  const data = await fetchSmarthomeData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SMARTHOME_PAGE_URL}/#webpage`,
    url: SMARTHOME_PAGE_URL,
    name: data?.title || "Smart Home Lösungen | Ökovolt Deutschland",
    description: data?.description || "Intelligente Smarthome-Lösungen: Photovoltaik, Stromspeicher, Wallbox, Wärmepumpe und Smartmeter als ein gesteuertes System.",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SMARTHOME_PAGE_URL}/#service`,
    name: "Smarthome-Lösungen und Energiemanagement",
    serviceType: "Planung und Installation von Energiemanagement, Stromspeicher, Wallbox, Notstrombox und Smartmeter",
    provider: { "@id": "https://www.oekovolt.de/#organization" },
    areaServed: { "@type": "Country", name: "Deutschland" },
    url: SMARTHOME_PAGE_URL,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Smarthome-Bausteine",
      itemListElement: ["Stromspeicher", "Wallbox", "Notstrombox", "Smartmeter"].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
    },
  };

  // Bausteine aus der API (mit Fallback)
  const quelle = data?.first_card_table?.length ? data.first_card_table : null;
  const bausteine = (quelle || BAUSTEINE_FALLBACK).map((b, i) => {
    const name = quelle ? b.title : b.tab;
    const meta = BAUSTEIN_META.find((m) => m.match.test(name || "")) || BAUSTEIN_META[i % BAUSTEIN_META.length];
    return {
      key: meta.key,
      tab: name,
      kurz: meta.kurz,
      titel: quelle ? b.card_title || b.title : b.titel,
      text: quelle ? b.card_description : b.text,
      bild: quelle ? img(b.card_image, meta.bild) : meta.bild,
      alt: quelle ? b.card_alt_text || b.card_title : b.alt,
      href: meta.href,
      linkLabel: meta.linkLabel,
    };
  });

  const vorteile = (data?.second_card_table?.length ? data.second_card_table : VORTEILE_FALLBACK).map((v, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: v.title,
    text: v.description,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Dienstleistungen" }, { name: "Smarthome" }]}
        eyebrow="Smarthome & Energiemanagement"
        title={<>Ein Haus, ein System: Solarstrom <span className="ov-text-gradient">intelligent</span> nutzen</>}
        lead="Photovoltaik, Speicher, Wallbox, Wärmepumpe und Smart Meter arbeiten zusammen – gesteuert von einem Energiemanagement, das jede Kilowattstunde dorthin schickt, wo sie gerade am meisten wert ist."
        image={{ src: img(data?.image, `${BILD}smart-home-3920905_1280.jpg`), alt: data?.alt_image || "Smarthome-Steuerung für Stromspeicher und Solaranlage per Smart Device" }}
        points={["Eigenverbrauch auf bis zu 80 % steigern", "Nachrüstbar für bestehende PV-Anlagen", "Notstrom bei Netzausfall möglich", "Steuerung bequem per App"]}
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
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                bis zu 80&nbsp;%
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Eigenverbrauch mit Speicher und intelligenter Steuerung</p>
            </div>
          </div>
        }
      />

      <FeaturedLogos />

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
                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-ov-500 px-4 py-3.5 shadow-lg">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <Cpu aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[16px] font-bold">Energiemanagement</span>
                  <span className="ml-auto hidden text-right text-[13.5px] text-white/85 sm:block">entscheidet in Echtzeit</span>
                </div>
              </div>
            </div>
          }
        >
          <p className="mt-5 text-[17px] font-medium leading-relaxed text-ink-800">
            Ein Energiemanagement verbindet alle Stromerzeuger und -verbraucher im Haus und steuert sie automatisch so, dass möglichst viel eigener Solarstrom genutzt wird.
          </p>
          <Fliesstext
            text={(data?.description || "Mit einem Stromspeicher und intelligenten Smarthome-Lösungen nutzen Sie Ihren Sonnenstrom rund um die Uhr – und erhöhen Ihren Eigenverbrauch auf bis zu 80 %. Auch das Nachrüsten eines Stromspeichers in Ihre bestehende PV-Anlage ist jederzeit möglich.").replace(/ %/g, " %")}
            className="mt-4 text-[16.5px] leading-relaxed text-ink-600"
          />
          <p className="mt-4 text-[16.5px] leading-relaxed text-ink-600">
            Als Fachbetrieb aus Türkheim planen, installieren und melden wir alle Komponenten aus einer Hand an – abgestimmt aufeinander statt nebeneinander.
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
              eyebrow={data?.second_card_title || "Vorteile"}
              title={data?.second_card_subtitle || "Vorteile mit einer Smarthome-Lösung"}
              lead="Weniger Netzstrom, günstigere Mobilität, Sicherheit bei Stromausfall und volle Transparenz – das bringt ein vernetztes Energiesystem im Alltag."
            />
            <Reveal delay={120} className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="ov-glass rounded-3xl p-6">
                <p className="ov-num font-display text-[34px] font-extrabold leading-none text-white">bis 80 %</p>
                <p className="mt-2 text-[14px] leading-snug text-white/60">Eigenverbrauch mit Speicher und Smarthome-Steuerung</p>
              </div>
              <div className="ov-glass rounded-3xl p-6">
                <p className="ov-num font-display text-[34px] font-extrabold leading-none text-white">15+ Jahre</p>
                <p className="mt-2 text-[14px] leading-snug text-white/60">Erfahrung als Fachbetrieb aus Türkheim</p>
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
            { icon: ClipboardList, title: "Planung", text: "Sie erhalten ein abgestimmtes Konzept aus Speicher, Wallbox, Smartmeter und Steuerung – inklusive Prüfung nach §14a EnWG." },
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
              <a href="tel:+498245967880" className="inline-flex items-center gap-3 font-display text-[20px] font-extrabold text-ink-900 hover:text-ov-700">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 text-white">
                  <Phone aria-hidden="true" className="h-5 w-5" />
                </span>
                08245 96 788 0
              </a>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/dienstleistungen/smarthome" />
      <CtaBand
        title="Machen Sie aus Ihrem Haus ein Kraftwerk."
        text="Wir planen Speicher, Wallbox, Wärmepumpe und Energiemanagement als ein abgestimmtes System – persönlich beraten vom Fachbetrieb aus Türkheim."
        primary={{ label: "Smarthome-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
