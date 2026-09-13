// photovoltaikanlage/page.js
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Calculator,
  Check,
  ClipboardCheck,
  Coins,
  Compass,
  Gauge,
  HandCoins,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import AnlagenExplorer from "@/components/photovoltaikanlage/AnlagenExplorer";
import KostenAufschluesselung from "@/components/photovoltaikanlage/KostenAufschluesselung";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { hreflangLanguages } from "@/lib/hreflang";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.photovoltaikanlage_page.api.get_photovoltaik_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/photovoltaikanlage";

async function fetchPhotovoltaikData() {
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

const TITLE = "Photovoltaikanlage kaufen – Komplettpaket 2026 | Ökovolt";
const DESCRIPTION =
  "Photovoltaikanlage vom Fachbetrieb aus dem Allgäu: Planung, Montage & Anmeldung aus einer Hand. Richtpreise 2026 je kWp ansehen und Angebot anfordern.";
const DEFAULT_KEYWORDS = ["Photovoltaikanlage", "Solaranlage", "Photovoltaik", "PV-Anlage kaufen", "Photovoltaikanlage Kosten"];

export async function generateMetadata() {
  const seoData = await fetchPhotovoltaikData();
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : DEFAULT_KEYWORDS;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Photovoltaikanlagen" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Jobs/jobs3.jpg") => (p ? `/api/image?path=${p}` : fallback);
const eur = (n) => `${(Math.round(n / 10) * 10).toLocaleString("de-DE")} €`;
const t = (s) => (s || "").replace(/\s*[–-]\s*$/, "").trim();

const PREIS_GROESSEN = [5, 8, 10, 15, 20, 30];
const KOMPLETT_ICONS = [Sparkles, HandCoins, ShieldCheck, Compass, Wrench];

const PAKET = [
  "Vor-Ort-Termin und ehrliche Bedarfsanalyse",
  "Belegungsplan, Ertragsprognose und Wirtschaftlichkeit",
  "Markenmodule, Wechselrichter und Montagesystem",
  "Montage auf dem Dach inklusive Gerüst",
  "Elektroinstallation und Prüfung des Zählerschranks",
  "Netzanmeldung und Marktstammdatenregister",
  "Inbetriebnahme mit Einweisung und App-Monitoring",
  "Beratung zu Förderung und Finanzierung",
];

const FAQ = [
  {
    q: "Was kostet eine Photovoltaikanlage 2026?",
    a: `Eine schlüsselfertige Anlage kostet je nach Größe rund ${preisProKwp(30).toLocaleString("de-DE")} bis ${preisProKwp(5).toLocaleString("de-DE")} € je kWp. Eine typische 10-kWp-Anlage liegt bei etwa ${eur(10 * preisProKwp(10))} inklusive Montage, Wechselrichter und Anmeldung, ein 8-kWh-Speicher kommt mit rund ${eur(8 * ANNAHMEN.speicherPreisProKwh)} dazu. Auf Wohngebäuden fällt keine Umsatzsteuer an – die Werte sind Endpreise. Den genauen Preis nennen wir nach dem Vor-Ort-Termin.`,
  },
  {
    q: "Welche Anlagengröße passt zu meinem Haus?",
    a: "Als Faustregel gilt rund 1 kWp je 1.000 kWh Jahresverbrauch – mit Wärmepumpe oder E-Auto darf es deutlich mehr sein. Je kWp brauchen Sie etwa 5 m² Dachfläche. Weil kleine Anlagen je kWp teurer sind, lohnt es sich meist, das Dach sinnvoll auszunutzen, statt knapp zu planen.",
  },
  {
    q: "Lohnt sich eine PV-Anlage 2026 noch?",
    a: `Ja, wenn sie zum Verbrauch passt. Jede selbst genutzte Kilowattstunde ersetzt Netzstrom für über 30 Cent, eingespeister Strom bringt dagegen ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct (bis 10 kWp, Stand ${VERGUETUNG.gueltigAbLabel}). Deshalb entscheidet der Eigenverbrauch über die Wirtschaftlichkeit. Typisch sind Amortisationszeiten von 12 bis 18 Jahren bei einer Lebensdauer von 25 Jahren und mehr.`,
  },
  {
    q: "Wie lange dauert es von der Anfrage bis zur fertigen Anlage?",
    a: "Im Durchschnitt 6 bis 12 Wochen, je nach Projektgröße, Region und Netzbetreiber. Die Montage selbst ist bei einem Einfamilienhaus meist in ein bis zwei Tagen erledigt. Wir begleiten Sie vom Erstgespräch bis zur Inbetriebnahme.",
  },
  {
    q: "Brauche ich einen Stromspeicher?",
    a: "Nicht zwingend, aber in den meisten Einfamilienhäusern hebt ein Speicher den Eigenverbrauch deutlich – von typischerweise rund 30 % auf 60 % und mehr. Wichtig ist die passende Größe: rund 1 kWh je 1.000 kWh Jahresverbrauch. Ein Speicher lässt sich auch später nachrüsten.",
  },
  {
    q: "Welche Förderung und steuerlichen Vorteile gibt es?",
    a: "Auf Kauf und Installation von Anlagen auf Wohngebäuden fallen 0 % Umsatzsteuer an, Einnahmen aus Anlagen bis 30 kWp sind einkommensteuerfrei. Dazu kommt die feste Einspeisevergütung für 20 Jahre. Regionale Zuschüsse und zinsgünstige Kredite (z. B. KfW 270) sind je nach Bundesland möglich – wir prüfen das für Sie.",
  },
  {
    q: "Kann ich meine Solaranlage auch ohne Eigenkapital finanzieren?",
    a: "Ja. Wir arbeiten mit Finanzierungspartnern zusammen, die zinsgünstige Darlehen anbieten – auf Wunsch auch ohne Anzahlung. Häufig liegt die monatliche Rate in der Größenordnung der eingesparten Stromkosten.",
  },
  {
    q: "Kann ich mit einer Solaranlage komplett unabhängig vom Stromnetz werden?",
    a: "Eine vollständige Autarkie ist technisch möglich, aber selten wirtschaftlich – im Winter liefert keine Dachanlage genug. Realistisch sind mit Speicher und intelligenter Steuerung rund 60 bis 80 % Autarkie. Die übrigen Kilowattstunden kommen günstiger aus dem Netz.",
  },
];

export default async function PhotovoltaikanlagePage() {
  const data = await fetchPhotovoltaikData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://www.oekovolt.de/#website" },
        about: { "@id": `${PAGE_URL}/#service` },
        datePublished: "2020-01-01",
        dateModified: new Date().toISOString().split("T")[0],
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Photovoltaikanlage als Komplettpaket",
        serviceType: "Planung, Montage und Inbetriebnahme von Photovoltaikanlagen",
        description: "Beratung, Planung, Montage, Netzanmeldung und Inbetriebnahme von Photovoltaikanlagen mit Stromspeicher, Wallbox und Wärmepumpe.",
        provider: { "@id": "https://www.oekovolt.de/#organization" },
        areaServed: { "@type": "Country", name: "Deutschland" },
        url: PAGE_URL,
      },
    ],
  };

  // API-Kennzahlen (nur, wenn im Backoffice gepflegt)
  const stats = [
    [data?.first_statistic_value, data?.first_value_suffix, data?.first_statistic_title],
    [data?.second_statistic_value, data?.second_value_suffix, data?.second_statistic_title],
    [data?.third_statistic_value, data?.third_value_suffix, data?.third_statistic_title],
  ]
    .filter(([v, , l]) => v && l)
    // Große kWp-Werte als MWp darstellen, damit die Kennzahl nicht umbricht
    .map(([value, suffix, label]) =>
      suffix === "kWp" && value >= 10000
        ? { value: Math.round(value / 1000), suffix: " MWp", label }
        : { value, suffix: suffix === "kWp" ? " kWp" : suffix || "", label }
    );

  const points = (data?.photovoltaik_options || [])
    .map((o) => t(o.first_header_options))
    .filter(Boolean);

  const introBilder = (data?.photovoltaik_first_images_card || []).slice(0, 4);
  const schritte = [
    { icon: UserRound, title: data?.photovoltaik_title_third_card_first || "Individuelle Beratung", text: data?.photovoltaik_description_third_card_alt_first || "Unsere Fachberater nehmen sich Zeit für Ihre Fragen – am Telefon oder bei Ihnen vor Ort.", image: data?.photovoltaik_image_third_card_first, alt: data?.photovoltaik_image_third_card_alt_first },
    { icon: Compass, title: data?.photovoltaik_third_second_card_second || "Passgenaue Planung", text: data?.photovoltaik_description_third_card_alt_second || "Wir planen Ihre Anlage exakt nach Dach, Verbrauch und Zukunftsplänen.", image: data?.photovoltaik_image_third_card_second, alt: data?.photovoltaik_image_third_card_alt_second },
    { icon: Wrench, title: data?.photovoltaik_third_second_card_third || "Fachgerechte Installation", text: data?.photovoltaik_description_third_card_alt_third || "Unser Montageteam setzt die Anlage sorgfältig um – schlüsselfertig und angemeldet.", image: data?.photovoltaik_image_third_card_third, alt: data?.photovoltaik_image_third_card_alt_third },
  ];
  const komplett = (data?.photovoltaik_fifth_table || []).map((it, i) => ({
    icon: KOMPLETT_ICONS[i % KOMPLETT_ICONS.length],
    title: t(it.title),
    text: it.description,
  }));
  const projektBilder = (data?.photovoltaik_sixth_table_images || []).slice(0, 4);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte" }, { name: "Photovoltaikanlage" }]}
        eyebrow="Photovoltaikanlage · Komplettpaket"
        title={
          data?.photovoltaik_title ? (
            data.photovoltaik_title
          ) : (
            <>
              Photovoltaikanlage vom <span className="ov-text-gradient">regionalen Spezialisten</span>
            </>
          )
        }
        lead={
          (data?.photovoltaik_description ? `${data.photovoltaik_description}. ` : "") +
          "Wir planen Ihre Anlage passend zu Dach, Verbrauch und Zukunftsplänen – und kümmern uns um Montage, Anmeldung und Inbetriebnahme."
        }
        image={{ src: img(data?.photovoltaik_banner_image), alt: data?.photovoltaik_alt_banner_image || "Photovoltaikanlage auf einem Einfamilienhaus" }}
        points={points.length ? points : ["Regional verwurzelt im Allgäu", "Über 15 Jahre Erfahrung", "Planung, Montage & Anmeldung", "Markenkomponenten"]}
        actions={[
          { label: "Kostenloses Angebot anfordern", href: "/angebot" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Calculator },
        ]}
        stats={stats}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <BadgePercent aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                0 % <span className="text-[14px] font-semibold text-ink-500">Umsatzsteuer</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">auf Anlage & Speicher für Wohngebäude</p>
            </div>
          </div>
        }
      />

      <FeaturedLogos />

      {/* Einführung */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.photovoltaik_first_title || "Zuverlässigkeit und Qualität"}
          title={data?.photovoltaik_first_subtitle || "Ihr Zuhause ist individuell – genauso wie Ihre Photovoltaikanlage"}
          text={
            data?.photovoltaik_first_description ||
            "Ob Doppelhaushälfte, modernes Einfamilienhaus oder Altbau: Sie erhalten keine Standardlösung, sondern eine Anlage, die zu Ihrem Dach, Ihrem Energiebedarf und Ihren Zukunftsplänen passt."
          }
          points={(data?.photovoltaik_fourth_table || []).map((o) => o.options).filter(Boolean)}
          action={{ label: "Beratungstermin anfragen", href: "/angebot" }}
          image={introBilder.length < 3 ? { src: img(introBilder[0]?.image), alt: introBilder[0]?.alt_image || "Photovoltaikanlage" } : undefined}
          aside={introBilder.length >= 3 ? <BildCollage bilder={introBilder} /> : undefined}
        />
      </Section>

      {/* Anlagen-Explorer */}
      <Section tone="sand" space="lg" id="bausteine">
        <SectionHeading
          eyebrow={data?.photovoltaik_title_seventh_card_first || "Ihre Bausteine"}
          title={
            <>
              Was gehört zu einer <span className="ov-text-gradient">Photovoltaikanlage?</span>
            </>
          }
          lead="Eine PV-Anlage besteht aus Solarmodulen, Unterkonstruktion und Wechselrichter. Stromspeicher, Wallbox, Wärmepumpe und Energiemanagement machen daraus ein System, das Ihren Solarstrom optimal nutzt. Entdecken Sie jeden Baustein."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <AnlagenExplorer />
        </Reveal>
      </Section>

      {/* Kosten */}
      <Section tone="white" space="lg" id="kosten">
        <SectionHeading
          eyebrow="Kosten 2026"
          title={
            <>
              Was kostet eine Photovoltaikanlage – <span className="ov-text-gradient">transparent</span> aufgeschlüsselt
            </>
          }
          lead={`Eine schlüsselfertige 10-kWp-Anlage kostet 2026 rund ${eur(10 * preisProKwp(10))}. Der Preis je kWp sinkt mit der Größe, weil Gerüst, Planung und Anmeldung unabhängig von der Leistung anfallen. Stellen Sie Ihre Größe ein und sehen Sie, wofür Ihr Geld verwendet wird.`}
          className="mb-12"
        />
        <Reveal dir="scale">
          <KostenAufschluesselung />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <h3 className="ov-h3 text-ink-900">Richtpreise nach Anlagengröße</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-600">
              Die Tabelle zeigt Endpreise für eine schlüsselfertige Anlage ohne Speicher – inklusive Module, Wechselrichter, Unterkonstruktion, Montage und Netzanmeldung. Ein Speicher kostet zusätzlich rund{" "}
              {ANNAHMEN.speicherPreisProKwh.toLocaleString("de-DE")} € je kWh Kapazität.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "0 % Umsatzsteuer auf Anlagen für Wohngebäude",
                "Einnahmen bis 30 kWp einkommensteuerfrei",
                `Laufende Kosten ca. ${ANNAHMEN.betriebskostenProKwp} € je kWp pro Jahr`,
              ].map((p) => (
                <li key={p} className="flex gap-3 text-[15.5px] text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <div className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
                <caption className="sr-only">Richtpreise für Photovoltaikanlagen nach Anlagengröße, Stand 2026</caption>
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th scope="col" className="px-5 py-4 font-semibold">Anlagengröße</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Preis je kWp</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Gesamtpreis</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Dachfläche</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 bg-white">
                  {PREIS_GROESSEN.map((g) => (
                    <tr key={g} className={g === 10 ? "bg-ov-50/60" : undefined}>
                      <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-semibold text-ink-900">
                        {g} kWp{g === 10 && <span className="ml-2 rounded-full bg-ov-500 px-2 py-0.5 text-[11px] font-semibold text-white">typisch</span>}
                      </th>
                      <td className="ov-num px-5 py-3.5 text-ink-600">{eur(preisProKwp(g))}</td>
                      <td className="ov-num px-5 py-3.5 font-semibold text-ov-700">{eur(g * preisProKwp(g))}</td>
                      <td className="ov-num px-5 py-3.5 text-ink-600">ca. {g * ANNAHMEN.qmProKwp} m²</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-ink-500">Richtwerte Stand 2026, Schrägdach mit normaler Zugänglichkeit. Orientierung, kein Angebot.</p>
          </Reveal>
        </div>
      </Section>

      {/* Komplettpaket */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Komplettpaket"
              title={data?.photovoltaik_subtitle_fifth_card_first || "Ihre Photovoltaikanlage als Komplettpaket aus einer Hand"}
              lead="Ein Ansprechpartner, ein Angebot, ein Team für alles. Das ist im Komplettpaket enthalten:"
            />
            <Reveal delay={100}>
              <ul className="mt-8 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {PAKET.map((p) => (
                  <li key={p} className="flex gap-3 text-[15.5px] leading-snug text-white/85">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500/20 text-ov-300">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href="/angebot" size="lg" pfeil>
                  Komplettangebot anfordern
                </Button>
              </div>
            </Reveal>
          </div>
          <ul className="grid gap-4 self-center">
            {(komplett.length
              ? komplett.slice(0, 4)
              : [
                  { icon: Sparkles, title: "Alles aus einer Hand", text: "Beratung, Planung, Montage und Anmeldung – ohne Schnittstellen zwischen verschiedenen Firmen." },
                  { icon: ShieldCheck, title: "Markenkomponenten", text: "Module, Wechselrichter und Speicher namhafter Hersteller." },
                  { icon: Compass, title: "Individuelle Planung", text: "Jede Anlage wird auf Dach, Strombedarf und Technik abgestimmt." },
                  { icon: HandCoins, title: "Förderung & Finanzierung", text: "Wir prüfen Förderprogramme und bieten auf Wunsch eine passende Finanzierung." },
                ]
            ).map((k, i) => {
              const Icon = k.icon;
              return (
                <Reveal as="li" key={k.title} delay={i * 80}>
                  <div className="group ov-card-hover flex gap-5 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 hover:bg-white/[0.07] md:p-7">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display text-[18px] font-bold leading-snug text-white md:text-[19px]">{k.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-white/65">{k.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow={data?.photovoltaik_third_second_card || "Von der Idee zur fertigen Anlage"}
          title={data?.photovoltaik_subtitle_third_card || "In drei Etappen zu Ihrer Photovoltaikanlage"}
          lead="Im Durchschnitt vergehen 6 bis 12 Wochen von der Anfrage bis zur Inbetriebnahme – die Montage selbst dauert meist nur ein bis zwei Tage."
          align="center"
          className="mb-14"
        />
        <ol className="grid gap-6 md:grid-cols-3">
          {schritte.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.title} delay={i * 100} className="flex">
                <article className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
                  <div className="relative aspect-[16/11] overflow-hidden bg-ink-100">
                    <Image src={img(s.image)} alt={s.alt || s.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-5 font-display text-[44px] font-extrabold leading-none text-white/95">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <h3 className="ov-h3 pt-1 text-ink-900">{s.title}</h3>
                    </div>
                    <p className="mt-4 whitespace-pre-line text-[15.5px] leading-relaxed text-ink-600">{s.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* Rahmenbedingungen 2026 */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Rahmenbedingungen 2026"
          title="Steuern, Vergütung und Regeln – das gilt für neue Anlagen"
          lead="Die wichtigsten Eckdaten, die Ihre Wirtschaftlichkeit beeinflussen. Wir berücksichtigen sie in jeder Planung."
          className="mb-12"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BadgePercent, wert: "0 %", titel: "Umsatzsteuer", text: "Nullsteuersatz nach § 12 Abs. 3 UStG für Anlagen und Speicher auf Wohngebäuden." },
            { icon: Landmark, wert: "30 kWp", titel: "Einkommensteuerfrei", text: "Einnahmen aus Anlagen bis 30 kWp sind nach § 3 Nr. 72 EStG steuerfrei." },
            { icon: Coins, wert: `${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct`, titel: "Einspeisevergütung", text: `Je kWh bis 10 kWp, ${ct(VERGUETUNG.saetze[1].teileinspeisung)} ct für den Anteil darüber – fest für ${VERGUETUNG.garantieJahre} Jahre. Stand ${VERGUETUNG.gueltigAbLabel}.` },
            { icon: Gauge, wert: "60 %", titel: "Solarspitzengesetz", text: "Neue Anlagen ohne Smart Meter speisen maximal 60 % ihrer Leistung ein; bei negativen Börsenpreisen gibt es keine Vergütung." },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <Reveal key={k.titel} delay={i * 80}>
                <div className="ov-card-hover flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-ink-200/70">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="ov-num mt-6 font-display text-[36px] font-extrabold leading-none tracking-tight text-ink-900">{k.wert}</p>
                  <h3 className="mt-3 font-display text-[17px] font-bold text-ink-900">{k.titel}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{k.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-ink-500">Keine Steuer- oder Rechtsberatung. Details klären wir im Beratungsgespräch.</p>
          <Link href="/forderungen/steuerlich" className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Steuerliche Förderung im Detail
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Section>

      {/* Regional & Kundenprojekt */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Aus dem Allgäu für Deutschland"
          title={data?.photovoltaik_title_fourth_card_first || "Ihr Photovoltaik-Spezialist aus dem Allgäu"}
          text={[
            data?.photovoltaik_subtitle_fourth_card_first ? `${data.photovoltaik_subtitle_fourth_card_first}.` : "Individuelle Beratung durch erfahrene Solarprofis.",
            "Von unserem Standort in Türkheim aus planen und montieren wir Anlagen in der Region und darüber hinaus – mit festem Ansprechpartner auch nach der Inbetriebnahme.",
          ]}
          image={{ src: img(data?.photovoltaik_image_fourth_card), alt: data?.photovoltaik_image_fourth_card_alt || "Ökovolt Fachkraft prüft ein Solarmodul" }}
          reverse
        >
          <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-ink-700">
            <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Türkheim · Allgäu · Bayern
          </p>
        </SplitMedia>

        {data?.photovoltaik_title_sixth_card_first && (
          <div className="mt-24 md:mt-32">
            <SplitMedia
              eyebrow={data.photovoltaik_title_sixth_card_first}
              title={data.photovoltaik_subtitle_sixth_card_first}
              text={data.photovoltaik_description_sixth_card_alt_second}
              action={{ label: "Referenzprojekte ansehen", href: "/referenzen/projekte", variant: "navy" }}
              image={projektBilder.length < 3 ? { src: img(projektBilder[0]?.image), alt: projektBilder[0]?.alt_image || "Kundenprojekt" } : undefined}
              aside={projektBilder.length >= 3 ? <BildCollage bilder={projektBilder} gespiegelt /> : undefined}
            />
          </div>
        )}
      </Section>

      <SolarrechnerTeaser
        titel="Was bringt Ihnen Ihre Anlage konkret?"
        text="Größe, Verbrauch und Dach eingeben – Sie sehen sofort Jahresertrag, Ersparnis, Autarkie und Amortisation."
      />

      <Section tone="sand" space="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Photovoltaikanlage – ehrlich beantwortet"
              lead="Ihre Frage ist nicht dabei? Rufen Sie uns an – wir beraten persönlich und herstellerunabhängig."
            />
            <Reveal delay={100} className="mt-8 flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <ClipboardCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-[16px] font-bold text-ink-900">In 2 Minuten zum Angebot</p>
                <Link href="/angebot" className="group mt-0.5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                  Angebot konfigurieren
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/photovoltaikanlage" />
      <CtaBand
        title="Ihr Dach kann mehr. Wir zeigen Ihnen, wie viel."
        primary={{ label: "Kostenloses Angebot anfordern", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}

/** Bildcollage aus 3–4 Backoffice-Bildern (großes Bild + zwei kleine). */
function BildCollage({ bilder, gespiegelt = false }) {
  const [gross, ...rest] = bilder;
  return (
    <div className="relative">
      <div aria-hidden="true" className={`absolute -inset-3 rounded-[2.25rem] bg-ov-100/60 md:-inset-4 ${gespiegelt ? "rotate-2" : "-rotate-2"}`} />
      <div className="relative grid grid-cols-5 grid-rows-2 gap-3 md:gap-4">
        <div className="relative col-span-3 row-span-2 min-h-[320px] overflow-hidden rounded-[2rem] bg-ink-100 shadow-xl md:min-h-[440px]">
          <Image src={img(gross.image)} alt={gross.alt_image || ""} fill sizes="(max-width: 1024px) 60vw, 30vw" className="object-cover" />
        </div>
        {rest.slice(0, 2).map((b, i) => (
          <div key={i} className="relative col-span-2 overflow-hidden rounded-3xl bg-ink-100 shadow-lg">
            <Image src={img(b.image)} alt={b.alt_image || ""} fill sizes="(max-width: 1024px) 40vw, 20vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
