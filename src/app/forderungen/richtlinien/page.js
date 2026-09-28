// src/app/forderungen/richtlinen/page.js

import React from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, ClipboardCheck, FileCheck2, Gauge, PlugZap, Send, TrendingDown, Wrench, Zap } from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import NormenExplorer from "@/components/Forderungen/Richtlinen/NormenExplorer";
import CmsProse from "@/components/Forderungen/Shared/CmsProse";
import { Hinweis, HowTo, Kennzahlen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.richtlinen.api.get_richtlinen_data`;

async function fetchRichtlinenData() {
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
    return data;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

const defaultTitle = "Normen & Richtlinien für PV-Anlagen 2026 | Ökovolt";
const defaultDescription = "VDE-AR-N 4105, EEG & Solarspitzengesetz, Marktstammdatenregister: alle Normen und Pflichten für PV-Anlagen 2026 – mit Normen-Explorer und Anmelde-Fahrplan.";
const defaultCanonical = "https://www.oekovolt.com/forderungen/richtlinien";

// Generate metadata dynamically from fetched data
export async function generateMetadata() {
  const data = await fetchRichtlinenData();
  const bannerData = data?.message?.banner;
  const bild = bannerData?.image ? `/api/image?path=${bannerData.image}` : "/og-image.jpg";

  return {
    title: defaultTitle,
    description: defaultDescription,
    keywords: [
      "Photovoltaik Richtlinien",
      "PV-Anlage Normen",
      "VDE-AR-N 4105",
      "Solarspitzengesetz",
      "Marktstammdatenregister Photovoltaik",
      "Technische Normen Photovoltaik",
      "VDE Richtlinien",
    ],
    alternates: { canonical: defaultCanonical, languages: hreflangLanguages(defaultCanonical) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: defaultCanonical,
      siteName: "Ökovolt Österreich",
      title: defaultTitle,
      description: defaultDescription,
      images: [{ url: bild, width: 1200, height: 630, alt: bannerData?.image_alt_text || "Ökovolt" }],
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription, images: [bild] },
  };
}

const RICHTLINEN_PAGE_URL = process.env.NEXT_PUBLIC_SITE === "de" || process.env.NEXT_PUBLIC_COUNTRY === "deutschland"
  ? "https://www.oekovolt.com/forderungen/richtlinien"
  : "https://www.oekovolt.com/forderungen/richtlinien";

const img = (p) => (p ? `/api/image?path=${p}` : "/Images/Jobs/jobs1.jpg");

const FAQ = [
  {
    q: "Was regelt die VDE-AR-N 4105?",
    a: "Die VDE-AR-N 4105 ist die Anwendungsregel für Erzeugungsanlagen und Speicher am Niederspannungsnetz. Sie legt fest, wie PV-Anlagen angeschlossen werden: Netz- und Anlagenschutz, Blindleistung, Einspeisemanagement und Zertifikate. Seit März 2026 gilt die Neufassung VDE-AR-N 4105:2026-03, die unter anderem Q(U) als Standardverfahren für die Blindleistung und vereinfachte Regeln bis 800 VA einführt.",
  },
  {
    q: "Was bedeutet das Solarspitzengesetz für neue PV-Anlagen?",
    a: "Seit 25. Februar 2025 dürfen neue Anlagen mit Einspeisevergütung höchstens 60 % ihrer installierten Leistung einspeisen, solange kein Smart Meter mit Steuerbox eingebaut ist – Steckersolargeräte sind ausgenommen. Außerdem gibt es für Zeiten mit negativen Börsenstrompreisen keine Vergütung; diese Zeiten werden nach Ende der 20 Jahre angehängt. Mit Speicher und hohem Eigenverbrauch fällt die Begrenzung kaum ins Gewicht.",
  },
  {
    q: "Bis wann muss ich meine PV-Anlage im Marktstammdatenregister eintragen?",
    a: "Innerhalb eines Monats nach Inbetriebnahme – für die PV-Anlage und separat für einen Batteriespeicher. Die Registrierung ist Pflicht, auch für Balkonkraftwerke. Ohne Eintrag kann der Netzbetreiber die Einspeisevergütung zurückhalten.",
  },
  {
    q: "Brauche ich für meine PV-Anlage einen Smart Meter?",
    a: "Ab 7 kW installierter Leistung ist ein intelligentes Messsystem vorgesehen; der Messstellenbetreiber baut es nach und nach ein. Auch für steuerbare Verbraucher nach § 14a EnWG – Wärmepumpe, Wallbox oder Speicher über 4,2 kW – ist er Voraussetzung. Mit Smart Meter und Steuerbox entfällt zudem die 60-%-Einspeisegrenze.",
  },
  {
    q: "Wird die Einspeisevergütung 2027 abgeschafft?",
    a: "Das ist geplant, aber noch nicht beschlossen. Laut Kabinettsentwurf der EEG-Novelle vom 29. Juli 2026 sollen neue Anlagen unter 25 kW ab 2027 keine feste Einspeisevergütung mehr erhalten, sondern in die Direktvermarktung wechseln. Anlagen, die bis 31. Dezember 2026 in Betrieb gehen, sollen die Vergütung für 20 Jahre behalten. Bundestag, Bundesrat und EU-Kommission müssen noch zustimmen.",
  },
  {
    q: "Wer ist für die Einhaltung der Normen verantwortlich?",
    a: "Für die Errichtung der ausführende Elektrofachbetrieb, der beim Netzbetreiber eingetragen sein muss. Als Betreiber sind Sie für den sicheren Betrieb, die Registrierung und gegebenenfalls wiederkehrende Prüfungen verantwortlich. Bestehen Sie deshalb auf ein Inbetriebnahme- und Prüfprotokoll nach DIN EN 62446-1.",
  },
];

export default async function Richtlinen() {
  const response = await fetchRichtlinenData();
  const data = response?.message;
  const banner = data?.banner;
  const body = data?.body;
  const [s10, s40, s100] = VERGUETUNG.saetze;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RICHTLINEN_PAGE_URL}/#webpage`,
    url: RICHTLINEN_PAGE_URL,
    name: body?.title || "Technische Richtlinien für Photovoltaik | Ökovolt",
    description: defaultDescription,
    inLanguage: "de-AT",
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: "2026-09-13",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen" }, { name: "Normen & Richtlinien" }]}
        eyebrow="Normen, EEG & Netzbetreiber · Stand 2026"
        title={<>Normen und Richtlinien für <span className="ov-text-gradient">PV-Anlagen</span></>}
        lead="Von der VDE-AR-N 4105 über das Solarspitzengesetz bis zum Marktstammdatenregister: Welche Regeln für Ihre Anlage gelten, was sich 2026 geändert hat – und was Sie selbst erledigen müssen."
        image={{ src: img(banner?.image), alt: banner?.image_alt_text || "Techniker begutachten Solarmodule auf einem Dach" }}
        points={["Neue VDE-AR-N 4105:2026-03", "Solarspitzengesetz erklärt", "Anmelde-Fahrplan", "15 Regelwerke im Explorer"]}
        actions={[
          { label: "Normgerecht planen lassen", href: "/angebot" },
          { label: "Zum Normen-Explorer", href: "#normen", icon: FileCheck2 },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <ClipboardCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">1 Monat</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Frist fürs Marktstammdatenregister</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "60 %", label: "max. Einspeisung ohne Steuerbox (Neuanlagen)" },
          { wert: "7 kW", label: "ab hier Smart Meter vorgesehen" },
          { wert: `${ct(s10.teileinspeisung)} ct`, label: `je kWh bis 10 kWp, ab ${VERGUETUNG.gueltigAbLabel}` },
          { wert: "1 Monat", label: "Frist fürs Marktstammdatenregister" },
        ]}
      />

      <Section tone="sand" space="lg" id="normen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Normen-Explorer"
          title={<>Welche Regel gilt <span className="ov-text-gradient">wann</span>?</>}
          lead="Die wichtigsten Normen und Vorschriften nach Projektphase – mit dem, was sie für Sie als Betreiber konkret bedeuten."
          align="center"
          className="mb-10"
        />
        <NormenExplorer />
      </Section>

      {/* EEG & Solarspitzengesetz */}
      <Section tone="white" space="lg">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="EEG 2023 & Solarspitzengesetz"
            title="Einspeisen 2026: Vergütung, 60-Prozent-Regel und negative Preise"
            lead="Das Erneuerbare-Energien-Gesetz garantiert die Vergütung für 20 Jahre. Seit dem Solarspitzengesetz vom 25. Februar 2025 gelten für neue Anlagen aber zusätzliche Spielregeln."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Sätze ab {VERGUETUNG.gueltigAbLabel}</StandPille>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <Tabelle
              caption={`EEG-Einspeisevergütung für Anlagen mit Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}`}
              spalten={[
                { key: "klasse", label: "Anlagenteil" },
                { key: "teil", label: "Teileinspeisung", className: "font-display text-[17px] font-bold text-ov-700" },
                { key: "voll", label: "Volleinspeisung", className: "font-display text-[17px] font-bold text-ink-900" },
              ]}
              zeilen={[s10, s40, s100].map((s) => ({
                klasse: s.klasse,
                teil: `${ct(s.teileinspeisung)} ct/kWh`,
                voll: `${ct(s.volleinspeisung)} ct/kWh`,
              }))}
            />
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-500">
              Gültig bis {new Date(VERGUETUNG.gueltigBis).toLocaleDateString("de-DE")}, danach −{VERGUETUNG.degressionProHalbjahr} % je Halbjahr. Die Sätze werden anteilig je Leistungsstufe berechnet. Quelle: {VERGUETUNG.quelle.name}.{" "}
              <Link href="/ratgeber/einspeiseverguetung-2026" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                Einspeisevergütung 2026 im Detail
              </Link>
            </p>
            <Hinweis ton="warn" titel="Geplant: Ende der festen Vergütung für kleine Neuanlagen ab 2027" className="mt-8">
              Laut Kabinettsentwurf der EEG-Novelle (29. Juli 2026) sollen neue Anlagen unter 25 kW ab 2027 keine feste Einspeisevergütung mehr erhalten. Wer bis 31. Dezember 2026 in Betrieb geht, soll die Vergütung 20 Jahre behalten. Noch nicht beschlossen – Bundestag, Bundesrat und EU müssen zustimmen.
            </Hinweis>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              { icon: Gauge, t: "60-%-Einspeisegrenze", x: "Neuanlagen ohne Smart Meter und Steuerbox speisen höchstens 60 % der Modulleistung ein. Mit Eigenverbrauch und Speicher kostet das meist nur wenige Prozent des Jahresertrags." },
              { icon: TrendingDown, t: "Negative Börsenpreise", x: "In Stunden mit negativen Preisen gibt es keine Vergütung. Die ausgefallenen Zeiten werden nach Ablauf der 20 Jahre angehängt." },
              { icon: Zap, t: "Smart Meter ab 7 kW", x: "Messstellenbetreiber rüsten intelligente Messsysteme nach. Mit Steuerbox entfällt die 60-%-Grenze." },
              { icon: BatteryCharging, t: "§ 14a EnWG", x: "Wärmepumpe, Wallbox und Speicher über 4,2 kW sind steuerbar – im Gegenzug sinken die Netzentgelte." },
            ].map((k, i) => (
              <Reveal key={k.t} delay={i * 70} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200">
                  <k.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-ink-900">{k.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{k.x}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Anmelde-Fahrplan */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Anmelde-Fahrplan"
            title="Netzanschluss und Anmeldung: Schritt für Schritt"
            lead="Sechs Stationen vom Netzanschlussbegehren bis zur ersten Vergütung. Planung, Montage und Anmeldung übernehmen wir für Sie aus einer Hand."
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="mt-8 grid grid-cols-2 gap-3 text-[14px]">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <p className="font-display text-[22px] font-extrabold text-ink-900">4–8 Wo.</p>
                <p className="mt-1 leading-snug text-ink-500">üblicher Zeitraum bis zur Zählersetzung (je Netzbetreiber)</p>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <p className="font-display text-[22px] font-extrabold text-ink-900">≤ 1 Monat</p>
                <p className="mt-1 leading-snug text-ink-500">nach Inbetriebnahme ins Marktstammdatenregister</p>
              </div>
            </div>
          </SectionHeading>
          <HowTo
            name="Photovoltaikanlage beim Netzbetreiber anmelden und in Betrieb nehmen"
            beschreibung="Ablauf von Netzanschlussbegehren, Installation nach VDE-Normen, Inbetriebnahme und Registrierung im Marktstammdatenregister (Stand 2026)."
            schritte={[
              { icon: Send, name: "Netzanschlussbegehren stellen", text: "Der Elektrofachbetrieb meldet die geplante Anlage mit Datenblättern und Einheitenzertifikaten nach VDE-AR-N 4105 beim Netzbetreiber an – vor der Montage." },
              { icon: PlugZap, name: "Netzverträglichkeit abwarten", text: "Der Netzbetreiber prüft den Anschlusspunkt und bestätigt die Einspeisung. Bei kleinen Anlagen geschieht das meist vereinfacht innerhalb weniger Wochen." },
              { icon: Wrench, name: "Normgerecht installieren", text: "Montage nach DIN VDE 0100-712 und DIN EN 62548 mit Überspannungsschutz, gegebenenfalls Anpassung des Zählerschranks nach VDE-AR-N 4100." },
              { icon: ClipboardCheck, name: "Inbetriebnahme und Prüfprotokoll", text: "Erstprüfung nach DIN EN 62446-1, Inbetriebnahmeprotokoll und Fertigmeldung an den Netzbetreiber." },
              { icon: Gauge, name: "Zähler setzen lassen", text: "Der Messstellenbetreiber installiert einen Zweirichtungszähler bzw. ab 7 kW ein intelligentes Messsystem. Ab dann wird eingespeister Strom erfasst." },
              { icon: FileCheck2, name: "Im Marktstammdatenregister registrieren", text: "PV-Anlage und Speicher innerhalb eines Monats nach Inbetriebnahme bei der Bundesnetzagentur eintragen und die MaStR-Nummer an den Netzbetreiber geben." },
            ]}
          />
        </div>
      </Section>

      {body?.rules && (
        <Section tone="white" space="lg">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <Reveal as="article">
              <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
                Im Detail erklärt
              </p>
              <h2 className="ov-h2 mt-4 text-ink-900">{body.title || "Normen und Richtlinien für Photovoltaikanlagen in Deutschland"}</h2>
              {body.description && <p className="ov-lead mt-5 text-ink-600">{body.description}</p>}
              <CmsProse
                html={body.rules}
                korrekturen={[
                  ["VDE-AR-N 4105", "VDE-AR-N 4105 (Fassung 2026-03)"],
                  ["(gewerblichen raus):", ""],
                ]}
                className="mt-8"
              />
            </Reveal>
            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-navy-950 p-6 text-white md:p-7">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Neu 2026</p>
                <ul className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-white/75">
                  <li><strong className="text-white">VDE-AR-N 4105:2026-03</strong> – Q(U)-Blindleistung als Standard, vereinfachte Regeln bis 800 VA.</li>
                  <li><strong className="text-white">EEG-Novelle</strong> – Kabinettsentwurf zum Ende der festen Vergütung kleiner Neuanlagen ab 2027.</li>
                  <li><strong className="text-white">Vergütung</strong> – {ct(s10.teileinspeisung)} ct/kWh bis 10 kWp ab {VERGUETUNG.gueltigAbLabel}.</li>
                </ul>
              </div>
              <Link href="/forderungen/baurecht" className="group ov-card-hover flex items-center justify-between gap-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-200">
                <span>
                  <span className="block font-display text-[16.5px] font-bold text-ink-900 group-hover:text-ov-700">Baurecht & Solarpflicht</span>
                  <span className="mt-1 block text-[14px] text-ink-500">Genehmigung nach Bundesland</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </aside>
          </div>
        </Section>
      )}

      <Section tone="white" space="lg" className={body?.rules ? "pt-0 md:pt-0" : undefined}>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Normen, EEG & Anmeldung – kurz beantwortet"
            lead="Stand September 2026. Gesetzesvorhaben kennzeichnen wir ausdrücklich als geplant."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/forderungen/richtlinien" />
      <CtaBand
        eyebrow="Normgerecht vom Fachbetrieb"
        title="Noch 2026 in Betrieb gehen – normgerecht und angemeldet."
        text="Wir planen nach aktueller VDE-AR-N 4105, übernehmen Netzanschlussbegehren, Inbetriebnahmeprotokoll und Marktstammdatenregister – damit Ihre Anlage rechtssicher läuft."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
