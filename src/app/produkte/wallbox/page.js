// produkte/wallbox/page.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Calculator, ClipboardCheck, FileSignature, Gauge, Leaf, PlugZap, Recycle,
  Smartphone, Sun, Timer, Users, Wrench, Zap,
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
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import UeberschussLaden from "@/components/Wallbox/UeberschussLaden";
import Laderechner from "@/components/Wallbox/Laderechner";
import { WALLBOX, spanne } from "@/data/wallbox";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.wallbox_page.api.get_wallbox_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/wallbox";

async function fetchWallboxData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 },
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

const TITLE = "Wallbox mit PV kaufen & installieren lassen | Ökovolt";
const DESCRIPTION =
  "Wallbox vom Fachbetrieb: E-Auto mit eigenem Solarstrom laden, Anmeldung nach § 14a EnWG inklusive. Ladekosten jetzt berechnen & Angebot anfragen.";

export async function generateMetadata() {
  const seoData = await fetchWallboxData();
  const defaultKeywords = ["Wallbox", "Ladestation", "E-Auto laden", "Wallbox Photovoltaik", "Wallbox Installation", "Überschussladen"];
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;
  const bild = "https://www.oekovolt.de/og-image.jpg";

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: bild, width: 1200, height: 630, alt: "Ökovolt Wallbox" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Smartphone/wallbox-scaled.jpg") => (p ? `/api/image?path=${p}` : fallback);

const VORTEIL_ICONS = { "Einfache Installation": Wrench, Kostenersparnis: Zap, Umweltfreundlich: Leaf, Zukunftssicher: Recycle };
const STAERKE_ICONS = [Users, BadgeCheck, Smartphone, Timer, ClipboardCheck, Sun];

const FALLBACK_VORTEILE = [
  { title: "Einfache Installation", description: "Planung, Montage, Anmeldung und Inbetriebnahme aus einer Hand." },
  { title: "Kostenersparnis", description: "Mit eigenem Solarstrom laden Sie deutlich günstiger als an öffentlichen Ladesäulen." },
  { title: "Umweltfreundlich", description: "Sonnenstrom vom eigenen Dach statt Netzstrom – spürbar weniger CO₂ pro Kilometer." },
  { title: "Zukunftssicher", description: "Smarte Wallboxen lassen sich in Energiemanagement und dynamische Tarife einbinden." },
];

const FAQ = [
  {
    q: "Was kostet eine Wallbox mit Installation?",
    a: `Für eine 11-kW-Wallbox inklusive fachgerechter Installation im Einfamilienhaus liegen die Kosten 2026 meist bei ${spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])}. Entscheidend sind Kabelweg, Zustand des Zählerschranks und ob die Wallbox mit der PV-Anlage kommunizieren soll. Nach dem Vor-Ort-Check erhalten Sie von uns einen verbindlichen Festpreis.`,
  },
  {
    q: "Muss ich meine Wallbox anmelden?",
    a: "Ja. Wallboxen bis 11 kW müssen beim Netzbetreiber angemeldet werden, Wallboxen über 11 kW (z. B. 22 kW) brauchen vorab eine Genehmigung. Seit 2024 gelten Wallboxen über 4,2 kW außerdem als steuerbare Verbrauchseinrichtung nach § 14a EnWG. Die Anmeldung übernehmen wir für Sie.",
  },
  {
    q: "11 kW oder 22 kW – was ist sinnvoll?",
    a: "Für zu Hause reichen 11 kW in aller Regel: Die meisten E-Autos laden an Wechselstrom ohnehin maximal mit 11 kW, und 100 km Reichweite sind in rund zwei Stunden nachgeladen. 22 kW lohnt sich nur, wenn Ihr Fahrzeug das unterstützt und die Genehmigung des Netzbetreibers vorliegt.",
  },
  {
    q: "Was bringt mir § 14a EnWG bei der Wallbox?",
    a: `Ihr Netzbetreiber darf die Ladeleistung in seltenen Engpässen vorübergehend auf mindestens ${WALLBOX.paragraf14a.drosselungKw.toLocaleString("de-DE")} kW begrenzen – laden ist also immer möglich. Im Gegenzug zahlen Sie reduzierte Netzentgelte: pauschal meist rund ${WALLBOX.paragraf14a.ersparnisVon}–${WALLBOX.paragraf14a.ersparnisBis} € im Jahr (Modul 1) oder ein um 60 % reduzierter Arbeitspreis mit separatem Zähler (Modul 2).`,
  },
  {
    q: "Wie funktioniert PV-Überschussladen?",
    a: "Ein Energiemanager misst am Netzanschlusspunkt, wie viel Solarstrom gerade übrig ist, und regelt die Wallbox passend nach. Weil E-Autos mindestens etwa 1,4 kW (einphasig, 6 A) benötigen, schaltet eine gute Wallbox bei wenig Sonne auf eine Phase und bei viel Sonne auf drei Phasen um. So fließt fast nur eigener Solarstrom ins Auto.",
  },
  {
    q: "Kann ich eine Wallbox an meine bestehende PV-Anlage anbinden?",
    a: "Meist ja. Voraussetzung ist, dass Wallbox und Wechselrichter bzw. Energiemanager miteinander kommunizieren können – etwa über einen Smart Meter am Hausanschluss. Wir prüfen Ihre Bestandsanlage und empfehlen eine kompatible Lösung.",
  },
  {
    q: "Gibt es 2026 eine Förderung für Wallboxen?",
    a: `Für Einfamilienhäuser gibt es derzeit kein bundesweites Zuschussprogramm. Die Arbeitskosten der Installation können Sie aber über den Handwerkerbonus nach § 35a EStG absetzen (20 % der Lohnkosten, bis ${WALLBOX.handwerkerbonus.maxProJahr.toLocaleString("de-DE")} € Steuerermäßigung im Jahr). Für Mehrparteienhäuser läuft vom ${WALLBOX.mfhProgramm.von} bis ${WALLBOX.mfhProgramm.bis} das Bundesprogramm „Laden im Mehrparteienhaus". Einzelne Länder und Kommunen fördern zusätzlich.`,
  },
];

export default async function WallboxPage() {
  const data = await fetchWallboxData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.wallbox_title || "Wallbox & Ladestationen | Ökovolt Deutschland",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${PAGE_URL}/#service`,
    name: "Wallbox-Installation mit PV-Überschussladen",
    serviceType: "Installation von Ladestationen für Elektrofahrzeuge",
    provider: { "@id": "https://www.oekovolt.de/#organization" },
    areaServed: { "@type": "Country", name: "Deutschland" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: WALLBOX.gesamtVon,
      highPrice: WALLBOX.gesamtBis,
      description: "Orientierungswerte 11-kW-Wallbox inkl. Installation im Einfamilienhaus, Stand 2026",
    },
  };

  const vorteile = (data?.wallbox_first_card_options?.length ? data.wallbox_first_card_options : FALLBACK_VORTEILE).map((o) => ({
    icon: VORTEIL_ICONS[o.title] || PlugZap,
    title: o.title,
    text: o.description,
  }));
  const staerken = data?.wallbox_third_card_table || [];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Wallbox" }]}
        eyebrow="Wallbox & E-Mobilität"
        title={
          data?.wallbox_subtitle ? (
            data.wallbox_subtitle.replace(" – ", " – ")
          ) : (
            <>
              E-Auto laden mit <span className="ov-text-gradient">eigenem Solarstrom</span>
            </>
          )
        }
        lead={
          data?.wallbox_description ||
          "Mit Ihrer eigenen Wallbox laden Sie Ihr Elektroauto sicher, schnell und besonders günstig mit dem Strom Ihrer Photovoltaikanlage – Planung, Installation und Anmeldung aus einer Hand."
        }
        image={{ src: img(data?.wallbox_image), alt: data?.wallbox_alt_text_image || "Elektroauto lädt an einer Wallbox" }}
        points={["Laden mit PV-Überschuss", "Anmeldung inkl. § 14a EnWG", "11 kW – ideal für zu Hause", "App-Steuerung & Energiemanagement"]}
        actions={[
          { label: "Wallbox-Angebot anfragen", href: "/angebot" },
          { label: "Ladekosten berechnen", href: "#ladekosten", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <PlugZap aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                ~ 25 ct <span className="text-[14px] font-semibold text-ink-500">günstiger</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">je kWh Solarstrom statt Netzstrom im Auto</p>
            </div>
          </div>
        }
      />

      {/* Kennzahlen-Leiste */}
      <div className="border-b border-ink-100 bg-white">
        <dl className="ov-container grid grid-cols-2 gap-px py-2 md:grid-cols-4">
          {[
            { w: "11 kW", l: "Ladeleistung – 100 km in rund 2 Stunden" },
            { w: `${WALLBOX.verbrauchProHundert} kWh`, l: "Strombedarf je 100 km (Kompaktklasse)" },
            { w: "ab 1,4 kW", l: "Mindestleistung fürs Überschussladen" },
            { w: `${WALLBOX.paragraf14a.ersparnisVon}–${WALLBOX.paragraf14a.ersparnisBis} €`, l: "Netzentgelt-Rabatt pro Jahr (§ 14a)" },
          ].map((k, i) => (
            <Reveal key={k.l} delay={i * 70} className="px-2 py-6 md:px-6">
              <dt className="sr-only">{k.l}</dt>
              <dd className="ov-num font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-extrabold leading-none tracking-tight text-ink-900">{k.w}</dd>
              <dd className="mt-2 text-[13px] leading-snug text-ink-500">{k.l}</dd>
            </Reveal>
          ))}
        </dl>
      </div>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.wallbox_second_card_title || "Warum eine Wallbox?"}
          title={data?.wallbox_second_card_subtitle ? "Schneller, sicherer und günstiger laden als an der Steckdose" : "Warum eine Wallbox?"}
          image={{ src: img(data?.wallbox_second_card_image), alt: data?.wallbox_second_card_image_alt || "E-Auto lädt in der Garage an einer Wallbox" }}
        >
          {data?.wallbox_second_card_subtitle && <p className="ov-lead mt-5 text-ink-700">{data.wallbox_second_card_subtitle}</p>}
          <Fliesstext
            text={
              data?.wallbox_second_card_description ||
              "Im Gegensatz zur Haushaltssteckdose lädt Ihr E-Auto an einer Wallbox deutlich schneller und ist durch integrierte Schutzmechanismen vor Überlastung geschützt."
            }
            className="mt-5 text-[16.5px] leading-relaxed text-ink-600"
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-2xl bg-ink-50 p-4 ring-1 ring-ink-200/70">
              <p className="text-[12.5px] text-ink-500">Haushaltssteckdose</p>
              <p className="ov-num mt-1 font-display text-[20px] font-extrabold text-ink-700">~ 2,3 kW</p>
              <p className="text-[12.5px] text-ink-500">100 km in ca. 9 h</p>
            </div>
            <div className="rounded-2xl bg-ov-50 p-4 ring-1 ring-ov-200">
              <p className="text-[12.5px] text-ov-700">Wallbox</p>
              <p className="ov-num mt-1 font-display text-[20px] font-extrabold text-ink-900">11 kW</p>
              <p className="text-[12.5px] text-ink-600">100 km in ca. 2 h</p>
            </div>
          </div>
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="ueberschussladen">
        <SectionHeading
          eyebrow="PV-Überschussladen"
          title={<>Ihr Auto lädt, <span className="ov-text-gradient">wenn die Sonne scheint</span></>}
          lead="Beim Überschussladen fließt nur der Solarstrom ins Auto, den Ihr Haus gerade nicht braucht. Wählen Sie Strecke, Wetter und Lademodus – und sehen Sie, woher der Strom kommt."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <UeberschussLaden />
        </Reveal>
      </Section>

      <Section tone="white" space="lg" id="ladekosten">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Ladekosten im Jahr"
            title={<>Was kostet Ihr <span className="ov-text-gradient">Kilometer</span>?</>}
            lead="Zu Hause mit Solarstrom laden ist die günstigste Art, elektrisch zu fahren. Stellen Sie Ihre Fahrleistung ein und vergleichen Sie direkt."
          />
          <Reveal delay={100}>
            <ul className="space-y-3 text-[15.5px] text-ink-700">
              <li className="flex gap-3"><Gauge aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />Solarstrom kostet Sie nur die entgangene Einspeisevergütung.</li>
              <li className="flex gap-3"><Zap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />Mit dynamischem Tarif laden Sie den Rest in günstigen Börsenstunden.</li>
            </ul>
            <Link href="/service/stromtarif" className="group mt-4 inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Dynamischen Stromtarif ansehen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <Laderechner />
        </Reveal>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Ihre Vorteile"
            title={data?.wallbox_first_card_title || "Ihre Vorteile mit Ökovolt"}
            lead="Eine Wallbox ist mehr als eine Steckdose an der Wand – richtig eingebunden wird sie zum günstigsten Verbraucher Ihres Solarstroms."
            className="mb-12"
          />
          <FeatureGrid items={vorteile} cols={4} tone="dark" />

          {staerken.length > 0 && (
            <div className="mt-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <Reveal dir="left" className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src={img(data?.wallbox_third_card_image)}
                  alt={data?.wallbox_third_card_image_alt || "Elektriker installiert eine Wallbox"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
              </Reveal>
              <div>
                <SectionHeading dark as="h3" size="h2" title={data?.wallbox_third_card_title || "Warum Ökovolt?"} />
                <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {staerken.map((s, i) => {
                    const Icon = STAERKE_ICONS[i % STAERKE_ICONS.length];
                    return (
                      <Reveal as="li" key={s.primary_text} delay={i * 60} className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300">
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-display text-[16.5px] font-bold text-white">{s.primary_text}</p>
                          <p className="mt-1 text-[14.5px] leading-relaxed text-white/65">{s.secondary_text}</p>
                        </div>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section tone="white" space="lg" id="kosten">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Kosten 2026"
            title="Was kostet eine Wallbox mit Installation?"
            lead={`Eine 11-kW-Wallbox inklusive Installation kostet im Einfamilienhaus meist ${spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])}. Den größten Unterschied machen Kabelweg und Zählerschrank – nicht das Gerät.`}
          >
            <Link href="/ratgeber/wallbox-installation" className="group mt-7 inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alle Kosten & Voraussetzungen im Ratgeber
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionHeading>
          <Reveal delay={100}>
            <div className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full text-left text-[15px] sm:min-w-[520px]">
                <caption className="sr-only">Wallbox-Kosten nach Variante, Orientierungswerte 2026</caption>
                <thead className="bg-sand-50 text-[13px] uppercase tracking-wider text-ink-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">Variante</th>
                    <th scope="col" className="hidden px-5 py-4 font-semibold sm:table-cell">Gerät</th>
                    <th scope="col" className="hidden px-5 py-4 font-semibold sm:table-cell">Installation</th>
                    <th scope="col" className="px-5 py-4 text-right font-semibold sm:text-left">Gesamt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {WALLBOX.varianten.map((v) => (
                    <tr key={v.name} className="transition-colors hover:bg-ov-50/50">
                      <th scope="row" className="px-5 py-4 font-semibold text-ink-900">{v.name}<span className="mt-0.5 block text-[12.5px] font-normal text-ink-500 sm:hidden">Gerät {spanne(v.geraet)} · Montage {spanne(v.montage)}</span></th>
                      <td className="ov-num hidden whitespace-nowrap px-5 py-4 text-ink-600 sm:table-cell">{spanne(v.geraet)}</td>
                      <td className="ov-num hidden whitespace-nowrap px-5 py-4 text-ink-600 sm:table-cell">{spanne(v.montage)}</td>
                      <td className="ov-num whitespace-nowrap px-5 py-4 text-right font-display font-bold text-ink-900 sm:text-left">{spanne(v.gesamt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
              Marktübliche Orientierungswerte, Stand September 2026. Ihren Festpreis erhalten Sie nach dem Vor-Ort-Check. Tipp: Die Lohnkosten sind über den
              Handwerkerbonus (§ 35a EStG) absetzbar.
            </p>
          </Reveal>
        </div>

        <div className="mt-24">
          <SectionHeading eyebrow="So läuft es ab" title="In vier Schritten zur eigenen Wallbox" align="center" className="mb-14" />
          <Steps
            items={[
              { icon: ClipboardCheck, title: "Vor-Ort-Check", text: "Wir prüfen Zählerschrank, Absicherung und Kabelweg und empfehlen die passende Wallbox – auf Wunsch gleich mit PV und Speicher." },
              { icon: FileSignature, title: "Anmeldung", text: "Wir melden die Wallbox beim Netzbetreiber an und klären die Einbindung als steuerbare Verbrauchseinrichtung nach § 14a EnWG." },
              { icon: Wrench, title: "Installation", text: "Unsere Elektrofachkräfte montieren Leitung, Schutztechnik und Wallbox und nehmen alles mit Prüfprotokoll in Betrieb." },
              { icon: Sun, title: "Solar laden", text: "Wir verbinden Wallbox, Wechselrichter und Energiemanagement – ab dann lädt Ihr Auto automatisch mit Sonnenstrom." },
            ]}
          />
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/rechner/wallbox"
        cta="Zum E-Auto-Laderechner"
        titel="Wie viel sparen Sie mit Solarstrom im Tank?"
        text="Fahrleistung, Anlagengröße und Ladeverhalten eingeben – der Rechner zeigt Solaranteil, Ladekosten und Ersparnis gegenüber Netzstrom und Tankstelle."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Wallbox – kurz & ehrlich beantwortet"
            lead="Mehr Details zu Kosten, Anmeldung und Technik finden Sie im Ratgeber Wallbox-Installation."
          >
            <Link href="/ratgeber/wallbox-installation" className="group mt-6 inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Zum Ratgeber
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/wallbox" />
      <CtaBand
        title="Laden Sie Ihr Auto mit der Sonne – ab dem ersten Tag."
        text="Wallbox, Photovoltaik und Energiemanagement aus einer Hand: Wir planen, installieren und melden alles an – mit festem Ansprechpartner vom Fachbetrieb aus Türkheim."
        primary={{ label: "Wallbox-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ladekosten berechnen", href: "/rechner/wallbox" }}
      />
    </div>
  );
}
