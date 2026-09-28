// service/finanzierung/page.js

import React from "react";
import Image from "next/image";
import { BadgeEuro, Calculator, CalendarClock, Check, FileSignature, Handshake, Landmark, Minus, PiggyBank, Sparkles, Wrench } from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import FinanzierungsRechner from "@/components/Finanzierung/FinanzierungsRechner";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.finanzierung_service_page.api.get_finanzierung_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.com/service/finanzierung";

async function fetchFinanzierungData() {
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

const TITLE = "Solaranlage finanzieren – ohne Eigenkapital | Ökovolt";
const DESCRIPTION = "PV-Anlage, Speicher oder Wärmepumpe ohne Eigenkapital finanzieren: feste Raten, Sondertilgung, KfW-270-Beratung. Jetzt Rate berechnen & Angebot anfragen!";

export async function generateMetadata() {
  const seoData = await fetchFinanzierungData();
  const defaultKeywords = ["Photovoltaik Finanzierung", "Solar Förderungen", "PV-Anlage Finanzierung", "KfW 270", "Solarfinanzierung"];
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/).filter((k, i, a) => a.indexOf(k) === i) : defaultKeywords;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Finanzierung" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.com/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg") => (p ? `/api/image?path=${p}` : fallback);

const VORTEILE_FALLBACK = [
  { primary_paragraph: "Attraktive Konditionen", description: "Feste Zinsen, anpassbare Laufzeiten und kostenfreie Sondertilgungen." },
  { primary_paragraph: "Sofort unabhängiger von Strompreisen", description: "Vom ersten Tag an eigenen Solarstrom nutzen statt teuer einkaufen." },
  { primary_paragraph: "Heizkosten dauerhaft senken", description: "Mit einer Wärmepumpe und staatlichen Zuschüssen." },
];

// Vergleich der Finanzierungswege – Stand September 2026, Orientierung
const WEGE = [
  {
    icon: PiggyBank,
    name: "Barkauf",
    tag: "Eigenkapital",
    zeilen: {
      eigenkapital: "100 % aus Rücklagen",
      antrag: "Kein Kreditantrag",
      zins: "Keine Zinskosten",
      laufzeit: "–",
      plus: "Höchste Rendite, wenn Rücklagen ohnehin vorhanden sind",
    },
  },
  {
    icon: Handshake,
    name: "PSD SolarKredit",
    tag: "Über Ökovolt",
    hervorgehoben: true,
    zeilen: {
      eigenkapital: "Ohne Eigenkapital möglich",
      antrag: "Gemeinsam mit Ökovolt, direkt zum Angebot",
      zins: "Fester Sollzins über die gesamte Laufzeit",
      laufzeit: "5, 10, 15 oder 20 Jahre · 10.000 bis 75.000 €",
      plus: "Sondertilgung und vorzeitige Rückzahlung kostenfrei",
    },
  },
  {
    icon: Landmark,
    name: "KfW-Kredit 270",
    tag: "Förderkredit",
    zeilen: {
      eigenkapital: "Bis zu 100 % der Investitionskosten",
      antrag: "Über Ihre Hausbank – vor Beginn des Vorhabens",
      zins: "Risikogerecht nach Bonität und Besicherung",
      laufzeit: "Bis 20 Jahre, bis zu 3 tilgungsfreie Anlaufjahre",
      plus: "Für PV-Anlagen und Speicher; nicht jede Bank vergibt ihn an Privatkunden",
    },
  },
];

const ZEILEN = [
  ["eigenkapital", "Eigenkapital"],
  ["antrag", "Beantragung"],
  ["zins", "Zins"],
  ["laufzeit", "Laufzeit & Rahmen"],
  ["plus", "Gut zu wissen"],
];

const FAQ_ZUSATZ = [
  {
    q: "Was ist der KfW-Kredit 270 und wer bekommt ihn?",
    a: "Das KfW-Programm 270 „Erneuerbare Energien – Standard“ finanziert unter anderem Photovoltaikanlagen und Batteriespeicher – auch für Privatpersonen, die den erzeugten Strom teilweise einspeisen. Den Kredit beantragen Sie nicht bei der KfW selbst, sondern über eine Bank. Der Zinssatz richtet sich nach Bonität und Sicherheiten. Wichtig: Der Antrag muss vor Beginn des Vorhabens gestellt werden, also vor der verbindlichen Beauftragung. (Stand September 2026, Konditionen ändern sich regelmäßig.)",
  },
  {
    q: "Muss ich auf eine Solaranlage Mehrwertsteuer zahlen?",
    a: "Nein. Für Photovoltaikanlagen auf oder in der Nähe von Wohngebäuden sowie für Stromspeicher gilt seit 2023 der Nullsteuersatz nach § 12 Abs. 3 UStG. Die Finanzierungssumme fällt dadurch deutlich niedriger aus als früher. Erträge kleiner Anlagen sind zudem nach § 3 Nr. 72 EStG einkommensteuerfrei.",
  },
  {
    q: "Ist eine Finanzierung sinnvoll, wenn die Rate höher als die Ersparnis ist?",
    a: "Das kann trotzdem aufgehen: Nach dem Ende der Laufzeit gehört die Anlage Ihnen, und die volle Ersparnis bleibt für viele weitere Jahre. Eine längere Laufzeit senkt die Rate, erhöht aber die Zinskosten. In unserem Beispielrechner sehen Sie beide Effekte – im persönlichen Gespräch rechnen wir mit Ihren echten Zahlen.",
  },
];

export default async function FinanzierungPage() {
  const data = await fetchFinanzierungData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.finanzierung_title || "Photovoltaik Finanzierung & Förderungen",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Finanzierung von Photovoltaikanlagen, Stromspeichern und Wärmepumpen",
    serviceType: "Finanzierungsberatung",
    provider: { "@id": "https://www.oekovolt.com/#organization" },
    areaServed: { "@type": "Country", name: "Deutschland" },
    url: PAGE_URL,
  };

  const rechnerSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Finanzierungsrechner Photovoltaik – Monatsrate vs. Ersparnis",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${PAGE_URL}#rechner`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  const vorteile = data?.finanzierung_first_card_table?.length ? data.finanzierung_first_card_table : VORTEILE_FALLBACK;
  const karten = data?.finanzierung_second_card_table || [];
  const faq = [
    ...(data?.finanzierung_fourth_card_table || []).map((f) => ({ q: f.question.trim(), a: f.answer.trim() })),
    ...FAQ_ZUSATZ,
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rechnerSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Finanzierung" }]}
        eyebrow={data?.finanzierung_subtitle || "Finanzierung"}
        title={<>Solaranlage finanzieren – <span className="ov-text-gradient">ohne Eigenkapital</span></>}
        lead={(data?.finanzierung_description || "Mit der Ökovolt Finanzierung realisieren Sie Ihre Photovoltaikanlage oder Wärmepumpe über faire monatliche Raten – ohne Eigenkapital.").trim()}
        image={{ src: img(data?.finanzierung_image), alt: data?.finanzierung_alt_text || "Photovoltaik-Freifläche in der Dämmerung" }}
        points={["Feste Raten über 5 bis 20 Jahre", "Sondertilgung kostenfrei", "PV, Speicher & Wärmepumpe", "KfW-270-Beratung inklusive"]}
        actions={[
          { label: "Angebot mit Finanzierung", href: "/angebot" },
          { label: "Rate berechnen", href: "#rechner", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <BadgeEuro aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                0 € <span className="text-[14px] font-semibold text-ink-500">Eigenkapital</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Kreditrahmen 10.000–75.000 €</p>
            </div>
          </div>
        }
      />

      {/* Kennzahlen */}
      <section className="border-b border-ink-200/70 bg-white">
        <dl className="ov-container grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {[
            { icon: CalendarClock, wert: "5–20 Jahre", label: "Laufzeit mit festem Sollzins" },
            { icon: BadgeEuro, wert: "bis 75.000 €", label: "Finanzierungssumme" },
            { icon: Sparkles, wert: "kostenfrei", label: "Sondertilgung & vorzeitige Rückzahlung" },
            { icon: Landmark, wert: "0 % MwSt.", label: "auf PV-Anlage & Speicher (§ 12 Abs. 3 UStG)" },
          ].map((k, i) => (
            <Reveal key={k.label} delay={i * 70} className="flex flex-col px-2 md:border-l md:border-ink-200 md:px-6 md:first:border-l-0 md:first:pl-0">
              {/* dl-Gruppe enthält nur dt/dd; Bezeichnung optisch unter dem Wert (order) */}
              <dt className="order-2 mt-1 pl-8 text-[13px] leading-snug text-ink-500">{k.label}</dt>
              <dd className="order-1 flex items-start gap-3">
                <k.icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ov-600" />
                <span className="font-display text-[20px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[24px]">{k.wert}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Warum finanzieren"
          title={data?.finanzierung_first_card_title || "Photovoltaik- und Wärmepumpen-Finanzierung leicht gemacht"}
          image={{ src: img(data?.finanzierung_first_card_image), alt: data?.finanzierung_first_card_image_alt_text || "Techniker neben Solarmodulen auf dem Dach" }}
        >
          <Fliesstext text={data?.finanzierung_first_card_description} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
          <ul className="mt-7 space-y-4">
            {vorteile.map((v) => (
              <li key={v.primary_paragraph} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-[16px] leading-relaxed text-ink-700">
                  <strong className="text-ink-900">{v.primary_paragraph}</strong> – {v.description}
                </span>
              </li>
            ))}
          </ul>
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="rechner" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Finanzierungsrechner"
          title={<>Trägt sich Ihre Anlage <span className="ov-text-gradient">selbst</span>?</>}
          lead="Stellen Sie Betrag, Laufzeit und einen Beispiel-Sollzins ein und vergleichen Sie die Monatsrate mit dem, was Ihre Anlage jeden Monat an Stromkosten spart und an Vergütung bringt."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <FinanzierungsRechner />
        </Reveal>
      </Section>

      {/* Finanzierungswege */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ihre Möglichkeiten"
          title="Barkauf, Ratenkredit oder KfW 270 – der Vergleich"
          lead="Welche Finanzierung passt, hängt von Rücklagen, Bonität und Zeitplan ab. Die wichtigsten Unterschiede auf einen Blick (Stand September 2026, Orientierung)."
          className="mb-12"
        />
        {/* Mobil: Karten, Desktop: Tabelle */}
        <div className="grid gap-4 lg:hidden">
          {WEGE.map((w, i) => (
            <Reveal key={w.name} delay={i * 70}>
              <div className={`rounded-3xl p-6 ${w.hervorgehoben ? "bg-navy-950 text-white" : "bg-white ring-1 ring-ink-200/70"}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-3 font-display text-[19px] font-extrabold">
                    <w.icon aria-hidden="true" className={`h-5 w-5 ${w.hervorgehoben ? "text-ov-300" : "text-ov-600"}`} />
                    {w.name}
                  </p>
                  <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wider ${w.hervorgehoben ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-600"}`}>{w.tag}</span>
                </div>
                <dl className="mt-5 space-y-3">
                  {ZEILEN.map(([k, l]) => (
                    <div key={k}>
                      <dt className={`text-[12px] font-semibold uppercase tracking-[0.12em] ${w.hervorgehoben ? "text-white/50" : "text-ink-500"}`}>{l}</dt>
                      <dd className={`mt-0.5 text-[15px] leading-relaxed ${w.hervorgehoben ? "text-white/85" : "text-ink-700"}`}>{w.zeilen[k]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="hidden lg:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <caption className="sr-only">Vergleich der Finanzierungswege für Photovoltaikanlagen</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[18%] pb-4">
                  <span className="sr-only">Kriterium</span>
                </th>
                {WEGE.map((w) => (
                  <th
                    key={w.name}
                    scope="col"
                    className={`px-6 pb-5 pt-6 align-top ${w.hervorgehoben ? "rounded-t-3xl bg-navy-950 text-white" : ""}`}
                  >
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wider ${w.hervorgehoben ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-600"}`}>{w.tag}</span>
                    <span className="mt-3 flex items-center gap-2.5 font-display text-[22px] font-extrabold tracking-tight">
                      <w.icon aria-hidden="true" className={`h-5 w-5 ${w.hervorgehoben ? "text-ov-300" : "text-ov-600"}`} />
                      {w.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ZEILEN.map(([k, l], zi) => (
                <tr key={k}>
                  <th scope="row" className="border-t border-ink-200 py-5 pr-4 align-top text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-500">{l}</th>
                  {WEGE.map((w) => (
                    <td
                      key={w.name}
                      className={`px-6 py-5 align-top text-[15.5px] leading-relaxed ${
                        w.hervorgehoben
                          ? `border-t border-white/10 bg-navy-950 text-white/85 ${zi === ZEILEN.length - 1 ? "rounded-b-3xl" : ""}`
                          : "border-t border-ink-200 text-ink-700"
                      }`}
                    >
                      {w.zeilen[k] === "–" ? <Minus aria-label="entfällt" className="h-4 w-4 text-ink-300" /> : w.zeilen[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-8 max-w-3xl text-[13.5px] leading-relaxed text-ink-500">
          Für Wärmepumpen gibt es zusätzlich Zuschüsse aus der Bundesförderung für effiziente Gebäude (BEG, KfW-Programm 458). Welche Kombination aus Zuschuss und Kredit für Sie am günstigsten ist, prüfen wir im Beratungsgespräch – mehr dazu in unserer{" "}
          <a href="/forderungen/steuerlich" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">Übersicht zu steuerlichen Vorteilen</a>{" "}
          und im{" "}
          <a href="/foerdercheck" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">Fördercheck</a>.
        </p>
      </Section>

      {/* Hintergrund aus dem Backoffice */}
      {karten.length > 0 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
          <SectionHeading dark eyebrow="Gut zu wissen" title="Warum sich finanzierter Solarstrom rechnet" className="relative mb-12" />
          <ul className="relative grid gap-5 lg:grid-cols-3">
            {karten.map((k, i) => (
              <Reveal as="li" key={k.title} delay={i * 90} className="flex">
                <article className="flex w-full flex-col overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={img(k.image)} alt={k.alt_text || ""} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-6 md:p-7">
                    <h3 className="ov-h3 text-white">{k.title}</h3>
                    <Fliesstext text={k.description} className="mt-3 text-[15px] leading-relaxed text-white/65" />
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Partner */}
      {data?.finanzierung_third_card_title && (
        <Section tone="white" space="lg">
          <SplitMedia
            reverse
            eyebrow="Finanzierungspartner"
            title={data.finanzierung_third_card_title}
            image={{ src: img(data.finanzierung_third_card_image), alt: data.finanzierung_third_card_image_alt_text }}
          >
            {data.finanzierung_third_card_important_description && (
              <p className="mt-6 rounded-3xl bg-ov-50 p-6 text-[17px] font-medium leading-relaxed text-ink-800 ring-1 ring-ov-200/70">
                {data.finanzierung_third_card_important_description}
              </p>
            )}
            <Fliesstext text={data.finanzierung_third_card_description} className="mt-6 text-[16px] leading-relaxed text-ink-600" />
          </SplitMedia>
        </Section>
      )}

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Ablauf"
          title="In vier Schritten zur finanzierten Anlage"
          lead="Sie bekommen Anlage und Finanzierung aus einer Hand – mit einem festen Ansprechpartner."
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: Calculator, title: "Beratung & Angebot", text: "Wir planen Ihre Anlage vor Ort und erstellen ein Angebot mit ehrlicher Wirtschaftlichkeitsrechnung." },
            { icon: Landmark, title: "Finanzierung wählen", text: "Ratenkredit über unseren Partner oder KfW 270 über Ihre Bank – wir vergleichen die Varianten mit Ihnen." },
            { icon: FileSignature, title: "Antrag stellen", text: "Wir unterstützen Sie mit allen Unterlagen. Beim KfW-Kredit wichtig: Antrag vor der Beauftragung." },
            { icon: Wrench, title: "Montage & Betrieb", text: "Unser Team montiert und meldet die Anlage an – ab dann arbeitet Ihr Solarstrom für die Rate." },
          ]}
        />
      </Section>

      <SolarrechnerTeaser
        titel="Wie viel erzeugt Ihr Dach?"
        text="Der Solarrechner zeigt Jahresertrag, Ersparnis und Amortisation – eine gute Grundlage für das Finanzierungsgespräch."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title={data?.finanzierung_fourth_card_title || "Häufige Fragen zur Finanzierung"}
            lead="Sie haben eine andere Frage? Rufen Sie uns an – wir erklären Ihnen gern alle Finanzierungswege."
          />
          <Faq items={faq} />
        </div>
      </Section>

      <Querverweise pfad="/service/finanzierung" />
      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Eigener Solarstrom – finanziert in bequemen Monatsraten."
        text="Wir planen Ihre Anlage, rechnen die Finanzierung ehrlich durch und begleiten Sie bis zur Inbetriebnahme – als Fachbetrieb aus Türkheim."
        primary={{ label: "Angebot mit Finanzierung", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
