// src/app/forderungen/steuerlich/page.js

import React from "react";
import { BadgeEuro, Calculator, ClipboardCheck, FileText, Percent, Receipt, ScrollText, Zap } from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import SteuerCheck from "@/components/Forderungen/Steuerlich/SteuerCheck";
import CmsProse from "@/components/Forderungen/Shared/CmsProse";
import { Checkliste, Hinweis, HowTo, Kennzahlen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.steuerlich.api.get_steuerlich_data`;

async function fetchSteuerlichData() {
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

const STEUERLICH_PAGE_URL = "https://www.oekovolt.com/forderungen/steuerlich";
const TITLE = "PV-Anlage steuerfrei: 0 % MwSt. & Steuerbefreiung | Ökovolt";
const DESCRIPTION = "Photovoltaik & Steuer 2026: 0 % Umsatzsteuer, Einkommensteuerbefreiung bis 30 kWp je Einheit, Gewerbesteuer – mit Steuer-Check und Schritt-für-Schritt-Anleitung.";
const KEYWORDS = [
  "PV-Anlage steuerfrei",
  "PV-Anlage Steuer",
  "Photovoltaik Steuer",
  "Photovoltaik steuerfrei",
  "Nullsteuersatz Photovoltaik",
  "Photovoltaikanlage Steuererklärung",
  "§ 3 Nr. 72 EStG",
  "Jahressteuergesetz 2024",
  "Ökovolt",
];

export async function generateMetadata() {
  const data = await fetchSteuerlichData();
  const bannerData = data?.message?.banner;
  const bild = bannerData?.image ? `/api/image?path=${bannerData.image}` : "/og-image.jpg";

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    alternates: { canonical: STEUERLICH_PAGE_URL, languages: hreflangLanguages(STEUERLICH_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: STEUERLICH_PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: bild, width: 1200, height: 630, alt: bannerData?.image_alt_text || "Ökovolt Österreich" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p) => (p ? `/api/image?path=${p}` : "/Images/Jobs/jobs3.jpg");

// Fachliche Korrekturen am CMS-Text (JStG 2024), bis der Eintrag im Backoffice angepasst ist
const CMS_KORREKTUREN = [
  [
    "15 kWp pro Einheit bei Mehrfamilienhäusern",
    "30 kWp pro Wohn- oder Gewerbeeinheit bei Mehrfamilienhäusern und gemischt genutzten Gebäuden (für Anlagen ab 2025; davor 15 kWp je Einheit) – insgesamt höchstens 100 kWp je Betreiber",
  ],
];

const UEBERSICHT = [
  {
    art: "Umsatzsteuer beim Kauf",
    regel: <><strong className="text-ov-700">0 %</strong> auf Lieferung und Installation von Modulen, Wechselrichter und Speicher</>,
    grenze: "Wohngebäude, öffentliche und gemeinwohlorientierte Gebäude; bis 30 kWp ohne Nachweis",
    norm: "§ 12 Abs. 3 UStG, seit 01.01.2023",
    tun: "Nichts – der Installateur weist 0 % auf der Rechnung aus",
  },
  {
    art: "Einkommensteuer",
    regel: <><strong className="text-ov-700">steuerfrei</strong>: Einspeisevergütung und Stromverkauf</>,
    grenze: "30 kWp je Wohn- oder Gewerbeeinheit, max. 100 kWp je Betreiber (Freigrenze)",
    norm: "§ 3 Nr. 72 EStG, erweitert durch JStG 2024",
    tun: "Keine Anlage EÜR, keine Gewinnermittlung",
  },
  {
    art: "Gewerbesteuer",
    regel: <><strong className="text-ov-700">befreit</strong>, wenn die Einkommensteuerbefreiung greift</>,
    grenze: "gekoppelt an § 3 Nr. 72 EStG",
    norm: "§ 3 Nr. 32 GewStG",
    tun: "Keine Gewerbesteuererklärung für die Anlage",
  },
  {
    art: "Umsatzsteuer im Betrieb",
    regel: "Kleinunternehmerregelung: keine Umsatzsteuer auf die Einspeisevergütung",
    grenze: "Umsatz Vorjahr ≤ 25.000 €, laufendes Jahr ≤ 100.000 €",
    norm: "§ 19 UStG (seit 2025)",
    tun: "Meist gilt sie automatisch – ein Fragebogen zur steuerlichen Erfassung ist in der Regel nicht nötig",
  },
];

const BEISPIELE = [
  { fall: "Einfamilienhaus, 10 kWp + 8 kWh Speicher", ust: "0 %", est: "steuerfrei", hinweis: "Der Standardfall: keine Steuererklärung für die Anlage nötig." },
  { fall: "Mehrfamilienhaus mit 6 Wohnungen, 60 kWp (ab 2025)", ust: "0 %", est: "steuerfrei", hinweis: "Grenze 6 × 30 = 180 kWp, gedeckelt auf 100 kWp je Betreiber." },
  { fall: "Wohnhaus + Garage/Carport, zusammen 28 kWp", ust: "0 %", est: "steuerfrei", hinweis: "Nebengebäude auf dem Wohngrundstück sind begünstigt." },
  { fall: "Gewerbehalle mit einer Einheit, 50 kWp", ust: "19 %", est: "steuerpflichtig", hinweis: "Über 30 kWp je Einheit – Vorsteuerabzug und Abschreibung nutzen." },
  { fall: "Landwirt: Wohnhaus 15 kWp + Scheune 90 kWp", ust: "0 % / 19 %", est: "steuerpflichtig", hinweis: "Zusammen 105 kWp – über 100 kWp entfällt die Befreiung für beide Anlagen." },
];

const FAQ = [
  {
    q: "Ist eine PV-Anlage 2026 wirklich komplett steuerfrei?",
    a: "Für die allermeisten privaten Anlagen ja. Beim Kauf fallen nach § 12 Abs. 3 UStG 0 % Umsatzsteuer an, die Erträge sind nach § 3 Nr. 72 EStG bis 30 kWp je Wohn- oder Gewerbeeinheit (höchstens 100 kWp je Betreiber) einkommensteuerfrei, und die Gewerbesteuer entfällt ebenfalls. Eine Steuererklärung für die Anlage ist dann nicht nötig.",
  },
  {
    q: "Muss ich meine PV-Anlage beim Finanzamt anmelden?",
    a: "In der Regel nicht. Wer die Einkommensteuerbefreiung und die Kleinunternehmerregelung nutzt, muss laut Finanzverwaltung keinen Fragebogen zur steuerlichen Erfassung abgeben. Pflicht bleiben dagegen die Anmeldung beim Netzbetreiber und die Registrierung im Marktstammdatenregister innerhalb eines Monats nach Inbetriebnahme.",
  },
  {
    q: "Gilt der Nullsteuersatz auch für einen nachgerüsteten Speicher?",
    a: "Ja. Batteriespeicher sind auch dann mit 0 % begünstigt, wenn sie später zu einer bestehenden Anlage dazugekauft werden. Gleiches gilt für Wechselrichter, Unterkonstruktion und die Montage. Nicht begünstigt sind dagegen Wallbox und Wärmepumpe – dort fallen 19 % an.",
  },
  {
    q: "Was passiert, wenn meine Anlage größer als 30 kWp ist?",
    a: "Die Grenze nach § 3 Nr. 72 EStG ist eine Freigrenze: Wird sie überschritten, sind alle Erträge der Anlage steuerpflichtig – nicht nur der Teil darüber. Dann ermitteln Sie den Gewinn per Einnahmen-Überschuss-Rechnung und schreiben die Anlage über 20 Jahre ab. Bei Mehrfamilienhäusern zählt die Grenze je Einheit, bis maximal 100 kWp.",
  },
  {
    q: "Muss ich den selbst verbrauchten Solarstrom versteuern?",
    a: "Nein. Seit dem Nullsteuersatz fällt auf den Eigenverbrauch keine Umsatzsteuer (unentgeltliche Wertabgabe) mehr an, und einkommensteuerlich ist er bei befreiten Anlagen ohnehin irrelevant.",
  },
  {
    q: "Brauche ich für eine PV-Anlage ein Gewerbe?",
    a: "Steuerlich ist für befreite Anlagen kein Gewerbe nötig. Ob eine Gewerbeanmeldung verlangt wird, ist Gewerberecht und wird von Kommunen unterschiedlich gehandhabt – bei kleinen, steuerfreien Anlagen in der Regel nicht. Im Zweifel kurz beim Gewerbeamt nachfragen.",
  },
  {
    q: "Lohnt sich der Verzicht auf die Kleinunternehmerregelung noch?",
    a: "Früher ließ man sich oft zur Regelbesteuerung umstellen, um die 19 % Vorsteuer vom Kaufpreis zurückzubekommen. Durch den Nullsteuersatz gibt es beim Kauf keine Umsatzsteuer mehr – der Verzicht bringt privaten Betreibern daher meist nur noch Aufwand.",
  },
];

export default async function Steuerlich() {
  const response = await fetchSteuerlichData();
  const data = response?.message;
  const banner = data?.banner;
  const body = data?.body;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${STEUERLICH_PAGE_URL}/#webpage`,
    url: STEUERLICH_PAGE_URL,
    name: banner?.title || "Steuerliche Förderungen für Photovoltaik | Ökovolt Österreich",
    description: DESCRIPTION,
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
        breadcrumbs={[{ name: "Förderungen" }, { name: "Steuerliche Vorteile" }]}
        eyebrow="Photovoltaik & Steuer · Stand 2026"
        title={<>PV-Anlage <span className="ov-text-gradient">steuerfrei</span> betreiben</>}
        lead="0 % Umsatzsteuer beim Kauf, keine Einkommensteuer auf die Erträge, keine Gewerbesteuer: So funktionieren die Steuervorteile für Photovoltaik – und wann sie nicht greifen."
        image={{ src: img(banner?.image), alt: banner?.image_alt_text || "Monteure installieren Solarmodule auf einem Dach" }}
        points={["0 % MwSt. auf Anlage & Speicher", "Steuerfrei bis 30 kWp je Einheit", "Keine Steuererklärung nötig", "Mit interaktivem Steuer-Check"]}
        actions={[
          { label: "Angebot mit 0 % MwSt.", href: "/angebot" },
          { label: "Zum Steuer-Check", href: "#steuer-check", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Percent aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                19 % <span className="text-[14px] font-semibold text-ink-500">gespart</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">durch den Nullsteuersatz auf die Rechnung</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "0 %", label: "Umsatzsteuer auf PV & Speicher" },
          { wert: "30 kWp", label: "steuerfrei je Wohn- oder Gewerbeeinheit" },
          { wert: "100 kWp", label: "Obergrenze je Betreiber" },
          { wert: "0 €", label: "Gewerbesteuer bei befreiten Anlagen" },
        ]}
      />

      {/* Steuer-Check */}
      <Section tone="sand" space="lg" id="steuer-check" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Interaktiver Steuer-Check"
          title={<>Ist Ihre Anlage <span className="ov-text-gradient">steuerfrei</span>?</>}
          lead="Gebäude, Leistung und Kosten einstellen – Sie sehen sofort, welche Steuerregeln für Ihre Anlage gelten und wie viel der Nullsteuersatz spart."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <SteuerCheck />
        </Reveal>
      </Section>

      {/* Überblick */}
      <Section tone="white" space="lg">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Die Regeln auf einen Blick"
            title={body?.title || "Photovoltaik Steuer 2026: Nullsteuersatz, Steuerbefreiung & Meldepflichten"}
            lead="Seit 2023 ist der Betrieb einer privaten Photovoltaikanlage in Deutschland weitgehend steuerfrei. Vier Regeln entscheiden darüber – hier mit Grenze, Rechtsgrundlage und dem, was Sie tatsächlich tun müssen."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Rechtsstand September 2026</StandPille>
        </div>
        <Reveal>
          <Tabelle
            caption="Steuerregeln für Photovoltaikanlagen 2026"
            spalten={[
              { key: "art", label: "Steuerart", breite: "w-[17%]" },
              { key: "regel", label: "Regel" },
              { key: "grenze", label: "Grenze" },
              { key: "norm", label: "Rechtsgrundlage", breite: "w-[16%]", className: "text-[14px]" },
              { key: "tun", label: "Ihr Aufwand" },
            ]}
            zeilen={UEBERSICHT}
          />
        </Reveal>
      </Section>

      {/* Nullsteuersatz: was zählt */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Nullsteuersatz im Detail"
            title="Was 0 % Umsatzsteuer bekommt – und was nicht"
            lead="Der Nullsteuersatz nach § 12 Abs. 3 UStG gilt für die Lieferung und Installation der Anlage und ihrer wesentlichen Komponenten an den Betreiber. Entscheidend ist, was auf der Rechnung steht."
          >
            <Hinweis titel="Achtung bei Miete und Pacht" className="mt-8">
              Wer eine Anlage mietet oder pachtet, zahlt auf die Raten in der Regel 19 % – der Nullsteuersatz gilt nur für die Lieferung, also den Kauf.
            </Hinweis>
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ov-200 md:p-7">
              <p className="flex items-center gap-2 font-display text-[18px] font-bold text-ov-700">
                <BadgeEuro aria-hidden="true" className="h-5 w-5" /> 0 % Umsatzsteuer
              </p>
              <Checkliste
                className="mt-5"
                items={[
                  "Solarmodule, auch Balkonkraftwerke",
                  "Wechselrichter und Energiemanager",
                  "Batteriespeicher – auch nachgerüstet",
                  "Unterkonstruktion und Solarkabel",
                  "Montage, Gerüst und Anschluss als Teil der Installation",
                  "Notstrom- bzw. Backup-Einheit der Anlage",
                ]}
              />
            </Reveal>
            <Reveal delay={80} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
              <p className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-700">
                <Receipt aria-hidden="true" className="h-5 w-5" /> 19 % Umsatzsteuer
              </p>
              <Checkliste
                variante="nein"
                className="mt-5"
                items={[
                  "Wallbox fürs E-Auto",
                  "Wärmepumpe und Heizstab",
                  "Dachsanierung oder neue Eindeckung",
                  "Miete, Pacht oder Leasing der Anlage",
                  "Spätere Wartung und Reparaturarbeiten",
                  "Gewerbedach über 30 kWp ohne Wohnbezug",
                ]}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* CMS-Text */}
      {body?.rules && (
        <Section tone="white" space="lg">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <Reveal as="article">
              <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
                Im Detail erklärt
              </p>
              <h2 className="ov-h2 mt-4 text-ink-900">Steuerregeln für private Betreiber</h2>
              {body?.description && <p className="ov-lead mt-5 text-ink-600">{body.description}</p>}
              <CmsProse html={body.rules} korrekturen={CMS_KORREKTUREN} className="mt-8" />
            </Reveal>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-navy-950 p-6 text-white md:p-7">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Merksätze</p>
                <Checkliste
                  dark
                  className="mt-5"
                  items={[
                    "0 % gilt nur für den Kauf – nicht für Miete.",
                    "30 kWp je Einheit, 100 kWp je Betreiber.",
                    "Grenze überschritten = ganze Anlage steuerpflichtig.",
                    "Marktstammdatenregister ist trotzdem Pflicht.",
                  ]}
                />
              </div>
              <p className="mt-4 px-2 text-[12.5px] leading-relaxed text-ink-500">
                Allgemeine Information, keine Steuerberatung. Im Einzelfall – etwa bei Vermietung, Gewerbe oder mehreren Anlagen – empfehlen wir eine steuerliche Beratung.
              </p>
            </aside>
          </div>
        </Section>
      )}

      {/* Beispiele */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Typische Konstellationen"
          title="So werden gängige Anlagen besteuert"
          lead="Fünf Fälle aus der Praxis – für Anlagen, die ab 2025 in Betrieb gehen."
          className="mb-10"
        />
        <Reveal>
          <Tabelle
            caption="Beispiele zur Besteuerung von Photovoltaikanlagen"
            spalten={[
              { key: "fall", label: "Anlage", breite: "w-[30%]" },
              { key: "ust", label: "Umsatzsteuer", breite: "w-[13%]", className: "font-display font-bold text-ink-900" },
              { key: "est", label: "Einkommensteuer", breite: "w-[16%]", className: "font-display font-bold text-ink-900" },
              { key: "hinweis", label: "Warum" },
            ]}
            zeilen={BEISPIELE}
          />
        </Reveal>
      </Section>

      {/* HowTo */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Schritt für Schritt"
            title="Steuerlich richtig starten: Ihre PV-Anlage in 5 Schritten"
            lead="Von der Rechnung bis zur Ablage – so bleibt Ihre Anlage sauber steuerfrei. Die Anmeldungen bei Netzbetreiber und Marktstammdatenregister übernehmen wir für unsere Kunden."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <HowTo
            name="PV-Anlage steuerlich richtig anmelden und steuerfrei betreiben"
            beschreibung="Anleitung für private Betreiber einer Photovoltaikanlage in Deutschland (Rechtsstand 2026)."
            dauer="P30D"
            schritte={[
              { icon: FileText, name: "Rechnung mit 0 % prüfen", text: "Das Angebot und die Schlussrechnung weisen für Module, Speicher und Montage 0 % Umsatzsteuer mit Hinweis auf § 12 Abs. 3 UStG aus. Separat berechnete Wallbox oder Wärmepumpe tragen 19 %." },
              { icon: Zap, name: "Anlage beim Netzbetreiber anmelden", text: "Vor der Inbetriebnahme meldet der Fachbetrieb die Anlage beim örtlichen Netzbetreiber an – Voraussetzung für Zähler und Einspeisevergütung." },
              { icon: ClipboardCheck, name: "Marktstammdatenregister innerhalb eines Monats", text: "Anlage und Speicher binnen eines Monats nach Inbetriebnahme im Marktstammdatenregister der Bundesnetzagentur registrieren. Ohne Eintrag kann die Vergütung zurückgehalten werden." },
              { icon: ScrollText, name: "Befreiung prüfen – Finanzamt meist nicht nötig", text: "Liegt die Anlage innerhalb der Grenzen des § 3 Nr. 72 EStG und gilt die Kleinunternehmerregelung, ist kein Fragebogen zur steuerlichen Erfassung und keine Anlage EÜR erforderlich." },
              { icon: Receipt, name: "Unterlagen aufbewahren", text: "Rechnungen, Inbetriebnahmeprotokoll, MaStR-Bestätigung und Abrechnungen des Netzbetreibers aufheben – sie belegen die Befreiung und helfen beim späteren Verkauf der Immobilie." },
            ]}
          />
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/solarrechner"
        cta="Zum Solarrechner"
        titel="Steuerfrei – und wie viel bringt die Anlage?"
        text="Mit 0 % Umsatzsteuer rechnet sich Ihre Anlage schneller. Der Solarrechner zeigt Ertrag, Ersparnis und Amortisation für Ihr Dach."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Photovoltaik und Steuern – kurz & ehrlich"
            lead="Allgemeine Information nach Rechtsstand September 2026. Für Ihren Einzelfall ist eine Steuerberatung verbindlich."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/forderungen/steuerlich" />
      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Ihre Anlage – mit 0 % Umsatzsteuer und allen Anmeldungen."
        text="Wir planen Ihre Anlage so, dass sie steuerlich im grünen Bereich bleibt, und übernehmen Netzanmeldung und Marktstammdatenregister für Sie."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
    </div>
  );
}
