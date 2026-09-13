// produkte/smartmeter/page.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, BarChart3, CalendarClock, Gauge, Home, PlugZap, RefreshCw, ShieldCheck, Sun, TrendingDown, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Zaehlervergleich from "@/components/Smartmeter/Zaehlervergleich";
import PflichtCheck from "@/components/Smartmeter/PflichtCheck";
import LivePreis from "@/components/Smartmeter/LivePreis";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.smart_meter_page.api.get_smart_meter_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/smartmeter";

async function fetchSmartMeterData() {
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

const TITLE = "Smart Meter: Pflicht, Kosten & Einbau 2026 | Ökovolt";
const DESCRIPTION =
  "Smart Meter einfach erklärt: Wer 2026 zum Einbau verpflichtet ist, was er kostet und wie Sie mit § 14a EnWG & dynamischem Tarif sparen. Jetzt Pflicht prüfen!";

export async function generateMetadata() {
  const seoData = await fetchSmartMeterData();
  const defaultKeywords = ["Smart Meter", "Smart Meter Pflicht", "intelligentes Messsystem", "digitaler Stromzähler", "Smart Meter Kosten"];
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
      images: [{ url: bild, width: 1200, height: 630, alt: "Ökovolt Smart Meter" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Smartphone/smart-guard-scaled.jpg") => (p ? `/api/image?path=${p}` : fallback);

const FUNKTION_ICONS = [Activity, Sun, TrendingDown, RefreshCw];

const FALLBACK_FUNKTIONEN = [
  { primary_paragraph: "Energieflüsse in Echtzeit erfassen", description: "Produktion und Verbrauch werden alle 15 Minuten gemessen – per App oder Kundenportal jederzeit im Blick." },
  { primary_paragraph: "Eigenverbrauch optimieren", description: "Die Datenbasis, um Solarstrom gezielt dann zu nutzen, wenn er verfügbar ist." },
  { primary_paragraph: "Dynamische Stromtarife nutzen", description: "E-Auto oder Wärmepumpe laufen, wenn der Strompreis am niedrigsten ist." },
  { primary_paragraph: "Automatische Datenübertragung", description: "Das Gateway überträgt die Daten verschlüsselt – Ablesetermine entfallen." },
];

const KOSTEN = [
  { fall: "Jahresverbrauch bis 6.000 kWh, PV bis 7 kW", zaehler: "Digitaler Zähler", preis: "20 €" },
  { fall: "Smart Meter freiwillig (auf Wunsch)", zaehler: "Smart Meter", preis: "30 € + einmalig bis 100 €" },
  { fall: "Verbrauch 6.001–10.000 kWh", zaehler: "Smart Meter", preis: "40 €" },
  { fall: "Verbrauch 10.001–20.000 kWh, PV über 7 bis 15 kW oder § 14a-Gerät", zaehler: "Smart Meter", preis: "50 €" },
  { fall: "Verbrauch 20.001–50.000 kWh oder PV über 15 bis 25 kW", zaehler: "Smart Meter", preis: "110 €" },
  { fall: "Verbrauch 50.001–100.000 kWh oder PV über 25 bis 100 kW", zaehler: "Smart Meter", preis: "140 €" },
  { fall: "Steuerungseinrichtung (z. B. PV über 7 kW, § 14a)", zaehler: "Steuerbox", preis: "bis 50 €" },
];

const FAQ = [
  {
    q: "Wer muss 2026 einen Smart Meter einbauen lassen?",
    a: "Pflicht ist ein intelligentes Messsystem bei einem Jahresstromverbrauch über 6.000 kWh, bei PV-Anlagen mit mehr als 7 kW installierter Leistung und bei steuerbaren Verbrauchseinrichtungen nach § 14a EnWG wie Wärmepumpe oder Wallbox. Der Messstellenbetreiber baut schrittweise nach gesetzlichen Quoten ein – bis 2032 sollen 90 % der Pflichtfälle ausgestattet sein. Ablehnen können Sie den Einbau nicht.",
  },
  {
    q: "Was kostet ein Smart Meter?",
    a: "Die Kosten sind gesetzlich gedeckelt (§ 30 MsbG). Haushalte zahlen je nach Verbrauch bzw. PV-Leistung höchstens 40 € (6.001–10.000 kWh) oder 50 € im Jahr (10.001–20.000 kWh, PV über 7 bis 15 kW, § 14a-Gerät). Eine zusätzlich nötige Steuerungseinrichtung kostet höchstens 50 € im Jahr. Wer freiwillig umrüstet, zahlt 30 € im Jahr und einmalig bis zu 100 €.",
  },
  {
    q: "Was ist der Unterschied zwischen digitalem Zähler und Smart Meter?",
    a: "Ein digitaler Zähler (moderne Messeinrichtung) zeigt Verbrauchswerte nur im Display an und sendet keine Daten. Erst mit einem Smart-Meter-Gateway wird daraus ein intelligentes Messsystem: Es misst viertelstündlich, überträgt die Daten verschlüsselt und ermöglicht dynamische Tarife sowie die Steuerung nach § 14a EnWG.",
  },
  {
    q: "Kann ich einen Smart Meter freiwillig bekommen?",
    a: "Ja. Seit 2025 haben alle Haushalte einen Anspruch auf den Einbau eines intelligenten Messsystems. Der grundzuständige Messstellenbetreiber muss innerhalb von vier Monaten nach Ihrem Wunsch einbauen. Das lohnt sich vor allem, wenn Sie einen dynamischen Stromtarif nutzen möchten.",
  },
  {
    q: "Brauche ich für einen dynamischen Stromtarif einen Smart Meter?",
    a: "Ja. Ein dynamischer Tarif rechnet jede Viertelstunde zum aktuellen Börsenpreis ab – dafür muss Ihr Verbrauch viertelstündlich gemessen und übertragen werden. Seit 2025 ist jeder Stromlieferant verpflichtet, einen solchen Tarif anzubieten.",
  },
  {
    q: "Was hat der Smart Meter mit meiner PV-Anlage zu tun?",
    a: "Seit dem Solarspitzengesetz (Februar 2025) dürfen neue PV-Anlagen ohne intelligentes Messsystem und Steuerungseinrichtung nur 60 % ihrer Leistung ins Netz einspeisen. Mit Smart Meter entfällt diese Begrenzung, und die Einspeisung lässt sich steuern. Ab 7 kW ist das Messsystem ohnehin Pflicht.",
  },
  {
    q: "Sind meine Daten beim Smart Meter sicher?",
    a: "Das Smart-Meter-Gateway muss vom Bundesamt für Sicherheit in der Informationstechnik (BSI) zertifiziert sein. Die Daten werden verschlüsselt übertragen, und nur berechtigte Stellen wie Netzbetreiber und Stromlieferant erhalten die Werte, die sie für Abrechnung und Netzbetrieb brauchen.",
  },
];

export default async function SmartmeterPage() {
  const data = await fetchSmartMeterData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Smart Meter: Pflicht, Kosten & Einbau | Ökovolt Deutschland",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const funktionen = (data?.smart_meter_first_card_table?.length ? data.smart_meter_first_card_table : FALLBACK_FUNKTIONEN).map((f, i) => ({
    icon: FUNKTION_ICONS[i % FUNKTION_ICONS.length],
    title: f.primary_paragraph,
    text: f.description,
  }));
  const wasIst = data?.smart_meter_second_card_description_table?.map((d) => d.description) || [
    "Ein Smart Meter ist ein intelligentes Messsystem aus digitalem Stromzähler und Smart-Meter-Gateway. Es misst den Stromverbrauch alle 15 Minuten und überträgt die Daten verschlüsselt an Netzbetreiber und Energieversorger.",
  ];
  // Die Pflicht-Absätze kommen im Backoffice in umgekehrter Reihenfolge
  const pflichtText = data?.smart_meter_third_card_description_table?.slice().reverse().map((d) => d.description) || [];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Smart Meter" }]}
        eyebrow={data?.smart_meter_subtitle || "Intelligentes Messsystem"}
        title={<>Smart Meter: Pflicht, Kosten & Nutzen <span className="ov-text-gradient">einfach erklärt</span></>}
        lead={
          data?.smart_meter_description?.trim() ||
          "Ein Smart Meter ist ein digitaler Stromzähler mit Kommunikationsmodul, der Ihren Verbrauch alle 15 Minuten erfasst und die Daten automatisch überträgt."
        }
        image={{ src: img(data?.smart_meter_first_card_image), alt: data?.smart_meter_first_card_alt_image || "Elektrotechniker arbeitet am Zählerschrank" }}
        points={["Pflicht-Check in 30 Sekunden", "Kosten gesetzlich gedeckelt", "Grundlage für dynamische Tarife", "Voraussetzung für § 14a EnWG"]}
        actions={[
          { label: "Beratung & Angebot anfragen", href: "/angebot" },
          { label: "Pflicht prüfen", href: "#pflicht-check", icon: ShieldCheck },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Gauge aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                96 <span className="text-[14px] font-semibold text-ink-500">Messwerte am Tag</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">statt einer Ablesung im Jahr</p>
            </div>
          </div>
        }
      />

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Einfach erklärt"
          title={data?.smart_meter_second_card_title || "Was genau ist ein Smart Meter?"}
          image={{ src: img(data?.smart_meter_second_card_image), alt: data?.smart_meter_second_card_alt_image || "Smart Meter im Zählerschrank" }}
          text={wasIst}
        />
      </Section>

      <Section tone="sand" space="lg" id="zaehlerarten">
        <SectionHeading
          eyebrow="Zählerarten im Vergleich"
          title={<>Analog, digital oder <span className="ov-text-gradient">smart</span>?</>}
          lead="Nicht jeder neue Zähler ist ein Smart Meter. Klicken Sie sich durch die drei Zählerarten, die heute in deutschen Kellern hängen."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <Zaehlervergleich />
        </Reveal>
      </Section>

      <Section tone="white" space="lg" id="pflicht-check" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Smart-Meter-Pflicht"
              title={data?.smart_meter_third_card_title || "Wann wird ein Smart Meter zur Pflicht?"}
              lead="Pflicht ist das intelligente Messsystem ab 6.000 kWh Jahresverbrauch, ab 7 kW PV-Leistung und für steuerbare Geräte nach § 14a EnWG."
            />
            {pflichtText.length > 0 && (
              <Reveal delay={100} className="mt-8 space-y-4 border-l-2 border-ov-300 pl-6 text-[16px] leading-relaxed text-ink-600">
                {pflichtText.map((t) => (
                  <p key={t.slice(0, 40)} className="ov-measure">{t}</p>
                ))}
              </Reveal>
            )}
          </div>
          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <PflichtCheck />
          </Reveal>
        </div>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Im Smart Energy Home"
              title={data?.smart_meter_first_card_title_table || "Funktionen eines Smart Meters"}
              lead={data?.smart_meter_first_card_description}
            />
            {data?.smart_meter_image && (
              <Reveal dir="left" className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
                <Image src={img(data.smart_meter_image)} alt={data.smart_meter_alt_image || ""} fill sizes="40vw" className="object-cover" />
              </Reveal>
            )}
          </div>
          <FeatureGrid items={funktionen} cols={2} tone="dark" className="lg:self-center" />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Sparen mit Smart Meter"
          title="Zwei Hebel, die sich 2026 wirklich lohnen"
          lead="Ein Smart Meter spart nicht von allein. Seinen Wert entfaltet er über reduzierte Netzentgelte und günstige Börsenstunden."
          className="mb-12"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="flex">
            <div className="flex w-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/70 md:p-8">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-600">
                <PlugZap aria-hidden="true" className="h-4 w-4" />
                § 14a EnWG
              </p>
              <h3 className="ov-h3 mt-3 text-ink-900">Weniger Netzentgelt für Wärmepumpe & Wallbox</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
                Steuerbare Verbrauchseinrichtungen über 4,2 kW – Wärmepumpe, Wallbox, Klimagerät oder Batteriespeicher – darf der Netzbetreiber bei Engpässen kurzzeitig
                auf 4,2 kW drosseln. Dafür sinken Ihre Netzentgelte dauerhaft. Voraussetzung: intelligentes Messsystem und Steuerbox.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { t: "Modul 1", w: "pauschal", d: "Rabatt aufs Netzentgelt, meist rund 110–190 € im Jahr" },
                  { t: "Modul 2", w: "−60 %", d: "auf den Arbeitspreis mit separatem Zähler" },
                  { t: "Modul 3", w: "zeitvariabel", d: "günstigere Netzentgelte zu Schwachlastzeiten (zu Modul 1)" },
                ].map((m) => (
                  <li key={m.t} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{m.t}</p>
                    <p className="mt-1 font-display text-[19px] font-extrabold text-ink-900">{m.w}</p>
                    <p className="mt-1 text-[13px] leading-snug text-ink-500">{m.d}</p>
                  </li>
                ))}
              </ul>
              <Link href="/produkte/wallbox" className="group mt-auto inline-flex h-11 items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Wallbox mit § 14a-Rabatt
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100} className="flex">
            <LivePreis />
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg" id="kosten">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Kosten 2026"
              title={data?.smart_meter_fourth_card_title || "Was kostet ein Smart Meter?"}
              lead={
                data?.smart_meter_fourth_card_description ||
                "Die Kosten für Einbau und Betrieb sind im Messstellenbetriebsgesetz über Preisobergrenzen geregelt."
              }
            />
            <Reveal delay={80} className="mt-8 grid grid-cols-2 gap-3">
              {[
                { i: CalendarClock, w: "4 Monate", l: "Einbaufrist bei freiwilligem Wunsch" },
                { i: BarChart3, w: "90 %", l: "Pflichtfälle bis 2032 ausgestattet" },
              ].map((k) => (
                <div key={k.l} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <k.i aria-hidden="true" className="h-5 w-5 text-ov-600" />
                  <p className="mt-2 font-display text-[22px] font-extrabold text-ink-900">{k.w}</p>
                  <p className="text-[13px] leading-snug text-ink-500">{k.l}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-ink-200/70">
              <table className="w-full text-left text-[14.5px] sm:min-w-[520px] sm:text-[15px]">
                <caption className="sr-only">Preisobergrenzen für Messstellen nach § 30 MsbG, Anteil Anschlussnutzer, brutto pro Jahr, Stand 2026</caption>
                <thead className="border-b border-ink-100 text-[13px] uppercase tracking-wider text-ink-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">Ihr Fall</th>
                    <th scope="col" className="hidden px-5 py-4 font-semibold sm:table-cell">Zähler</th>
                    <th scope="col" className="whitespace-nowrap px-4 py-4 text-right font-semibold sm:px-5">max. / Jahr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {KOSTEN.map((k) => (
                    <tr key={k.fall} className="transition-colors hover:bg-ov-50/50">
                      <th scope="row" className="px-4 py-4 font-medium text-ink-800 sm:px-5">{k.fall}<span className="mt-0.5 block text-[12.5px] font-normal text-ink-500 sm:hidden">{k.zaehler}</span></th>
                      <td className="hidden whitespace-nowrap px-5 py-4 text-ink-500 sm:table-cell">{k.zaehler}</td>
                      <td className="ov-num px-4 py-4 text-right font-display font-bold text-ink-900 sm:whitespace-nowrap sm:px-5">{k.preis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
              Anteil des Anschlussnutzers laut § 30 MsbG, brutto, Stand September 2026. Weitere Anteile trägt der Netzbetreiber. Liegen mehrere Fälle vor, gilt die höhere Grenze.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Smart Meter – kurz & ehrlich beantwortet"
            lead="Sie planen PV, Wärmepumpe oder Wallbox? Dann denken wir die Messtechnik von Anfang an mit."
          >
            <div className="mt-7 flex flex-col gap-2">
              <Link href="/produkte/smartenergyhome" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                <Home aria-hidden="true" className="h-4 w-4" />
                Smart Energy Home entdecken
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/energie-live" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                <Zap aria-hidden="true" className="h-4 w-4" />
                Strompreis live verfolgen
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/smartmeter" />
      <CtaBand
        title="Smart Meter, PV & Steuerung – sauber geplant aus einer Hand."
        text="Wir prüfen Ihren Zählerschrank, planen Messkonzept und Energiemanagement und stimmen alles mit Ihrem Netzbetreiber ab – vom Fachbetrieb aus Türkheim."
        primary={{ label: "Beratung & Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Dynamischen Tarif prüfen", href: "/service/stromtarif" }}
      />
    </div>
  );
}
