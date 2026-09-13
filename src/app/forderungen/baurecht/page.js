// src/app/forderungen/baurecht/page.js

import React from "react";
import Link from "next/link";
import { ArrowRight, Castle, ClipboardCheck, FileSearch, Flame, Landmark, ListChecks, MapPinned, Ruler, Sun, Zap } from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import GenehmigungsCheck from "@/components/Forderungen/Baurecht/GenehmigungsCheck";
import CmsProse from "@/components/Forderungen/Shared/CmsProse";
import { Hinweis, HowTo, Kennzahlen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.baurecht.api.get_baurecht_data`;

async function fetchBaurechtData() {
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

const BAURECHT_PAGE_URL = "https://www.oekovolt.de/forderungen/baurecht";
const TITLE = "Baurecht Photovoltaik: Genehmigung nach Bundesland | Ökovolt";
const DESCRIPTION = "Braucht Ihre PV-Anlage eine Genehmigung? Baurecht 2026: verfahrensfreie Dachanlagen, Solarpflicht je Bundesland, Denkmalschutz & Brandschutz – mit Genehmigungs-Check.";

export async function generateMetadata() {
  const data = await fetchBaurechtData();
  const bannerData = data?.message?.banner;
  const bild = bannerData?.image ? `/api/image?path=${bannerData.image}` : "/og-image.jpg";

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      "Photovoltaik Baurecht",
      "PV-Anlage Genehmigung",
      "Bauvorschriften Photovoltaik",
      "Solarpflicht",
      "Solarpflicht Bundesländer",
      "Photovoltaik Denkmalschutz",
      "Photovoltaik genehmigungsfrei",
      "Photovoltaik Vorschriften Bundesländer",
      "Ökovolt",
    ],
    alternates: { canonical: BAURECHT_PAGE_URL, languages: hreflangLanguages(BAURECHT_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: BAURECHT_PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: bild, width: 1200, height: 630, alt: bannerData?.image_alt_text || "Ökovolt Deutschland" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p) => (p ? `/api/image?path=${p}` : "/Images/Jobs/download.jpg");

// Fachliche Korrektur am CMS-Text (Solarpaket I, Mai 2024), bis der Eintrag im Backoffice angepasst ist
const CMS_KORREKTUREN = [
  ["Vereinfachte Anmeldung beim Netzbetreiber", "Keine gesonderte Anmeldung beim Netzbetreiber mehr nötig (seit Solarpaket I, Mai 2024)"],
  ["Anmeldung im Marktstammdatenregister ist erforderlich", "Anmeldung im Marktstammdatenregister ist erforderlich (vereinfachtes Verfahren, bis 2.000 Wp Modulleistung)"],
];

const ANLAGEN = [
  { typ: "Dachanlage (Aufdach/Indach)", recht: <strong className="text-ov-700">verfahrensfrei</strong>, achten: "Statik, Brandschutzabstand bei Reihenhäusern, Denkmalschutz, Gestaltungssatzung" },
  { typ: "Flachdach, aufgeständert", recht: <strong className="text-ov-700">verfahrensfrei</strong>, achten: "Ballast und Windlast, Gebäudehöhe bei starker Aufständerung, Abstand zu Dachrand und Brandwand" },
  { typ: "Fassadenanlage", recht: <strong className="text-ov-700">verfahrensfrei</strong>, achten: "Brandschutz der Fassade bei höheren Gebäuden, Denkmalschutz" },
  { typ: "Solarcarport", recht: <strong className="text-sun-500">je nach Größe</strong>, achten: "Als Garage/Carport meist bis ca. 30 m² verfahrensfrei (nicht im Außenbereich), Grenzabstand, Bebauungsplan" },
  { typ: "Freiflächenanlage im Garten", recht: <strong className="text-sun-500">bis 3 m × 9 m frei</strong>, achten: "Größere Anlagen: Baugenehmigung, im Außenbereich meist Bebauungsplan" },
  { typ: "Solarpark / große Freifläche", recht: <strong className="text-navy-700">genehmigungspflichtig</strong>, achten: "Bebauungsplan; privilegiert nur bis 200 m an Autobahnen und zweigleisigen Schienenwegen (§ 35 BauGB)" },
  { typ: "Balkonkraftwerk", recht: <strong className="text-ov-700">frei</strong>, achten: "Bis 800 W Wechselrichter, nur Marktstammdatenregister; Mieter/WEG: Anspruch auf Zustimmung" },
];

const SOLARPFLICHT = [
  { land: "Baden-Württemberg", neubau: "Wohn- und Nichtwohngebäude (seit 2022)", bestand: "grundlegende Dachsanierung (seit 2023)", parken: "ab 35 Stellplätzen" },
  { land: "Bayern", neubau: "Nichtwohngebäude (seit 2023); Wohngebäude: Soll-Regel", bestand: "Dachsanierung Nichtwohngebäude (seit 2025)", parken: "–" },
  { land: "Berlin", neubau: "Neubau (seit 2023), mind. 30 % der Dachfläche", bestand: "wesentlicher Dachumbau", parken: "–" },
  { land: "Brandenburg", neubau: "Nichtwohngebäude (Angaben uneinheitlich)", bestand: "–", parken: "–" },
  { land: "Bremen", neubau: "Nichtwohn- und Wohngebäude (gestaffelt 2024/2025)", bestand: "Dachsanierung", parken: "–" },
  { land: "Hamburg", neubau: "Neubau (seit 2023)", bestand: "Dacherneuerung (seit 2024)", parken: "ab 35 Stellplätzen" },
  { land: "Hessen", neubau: "nur Landesgebäude", bestand: "–", parken: "ab 50 Stellplätzen" },
  { land: "Mecklenburg-Vorpommern", neubau: "keine Pflicht", bestand: "–", parken: "–" },
  { land: "Niedersachsen", neubau: "Neubau (seit 2025)", bestand: "Dachsanierung (seit 2025)", parken: "ab 25 Stellplätzen" },
  { land: "Nordrhein-Westfalen", neubau: "Nichtwohngebäude (2024), Wohngebäude (2025)", bestand: "Dachsanierung (ab 2026)", parken: "ab 35 Stellplätzen" },
  { land: "Rheinland-Pfalz", neubau: "Nichtwohngebäude (seit 2023); Wohngebäude: „solar-ready“", bestand: "–", parken: "ab 50 Stellplätzen" },
  { land: "Saarland", neubau: "keine landesweite Pflicht", bestand: "–", parken: "–" },
  { land: "Sachsen", neubau: "keine Pflicht", bestand: "–", parken: "–" },
  { land: "Sachsen-Anhalt", neubau: "keine Pflicht", bestand: "–", parken: "–" },
  { land: "Schleswig-Holstein", neubau: "Nichtwohn- (2023) und Wohngebäude (2025)", bestand: "Dachsanierung (seit 2025)", parken: "ab 70 Stellplätzen" },
  { land: "Thüringen", neubau: "keine Pflicht", bestand: "–", parken: "–" },
];

const FAQ = [
  {
    q: "Brauche ich für eine Photovoltaikanlage auf dem Dach eine Baugenehmigung?",
    a: "In aller Regel nein. Solaranlagen in, an und auf Dach- und Außenwandflächen sind nach der Musterbauordnung und den Landesbauordnungen verfahrensfrei. Trotzdem müssen Sie materielle Vorgaben einhalten – etwa Denkmalschutz, Bebauungsplan, Statik und Brandschutzabstände.",
  },
  {
    q: "Darf ich eine PV-Anlage auf ein denkmalgeschütztes Haus bauen?",
    a: "Oft ja, aber nur mit denkmalrechtlicher Erlaubnis. Seit 2023 liegen erneuerbare Energien im überragenden öffentlichen Interesse. Mehrere Länder – etwa Baden-Württemberg und Bayern – erteilen die Erlaubnis inzwischen in der Regel, wenn die Anlage untergeordnet, farblich angepasst oder vom öffentlichen Raum kaum einsehbar ist. Die Erlaubnis muss vor der Montage vorliegen.",
  },
  {
    q: "Welche Abstände muss eine Solaranlage zum Nachbarn einhalten?",
    a: "Dachanlagen lösen in der Regel keine eigenen Abstandsflächen aus. Bei Reihen- und Doppelhäusern verlangen viele Landesbauordnungen aber einen Brandschutzabstand zur Brand- bzw. Gebäudeabschlusswand – nach dem Muster 0,5 m bei flach anliegenden und bis 1,25 m bei aufgeständerten Anlagen. Einige Länder haben das für niedrige Gebäude gestrichen. Freistehende Anlagen und Carports müssen die Grenzabstände der Landesbauordnung beachten.",
  },
  {
    q: "Gibt es eine Solarpflicht für mein Haus?",
    a: "Das hängt vom Bundesland ab. In Baden-Württemberg, Berlin, Hamburg, Niedersachsen, NRW, Schleswig-Holstein und Bremen gilt für Neubauten eine Solarpflicht, teils auch bei grundlegender Dachsanierung. Bayern und Rheinland-Pfalz verpflichten vor allem Nichtwohngebäude; in Sachsen, Sachsen-Anhalt, Thüringen und Mecklenburg-Vorpommern besteht keine Pflicht. Bestandsgebäude ohne Dachsanierung sind fast nirgends betroffen.",
  },
  {
    q: "Brauche ich für ein Balkonkraftwerk die Zustimmung des Vermieters?",
    a: "Sie brauchen sie – haben aber seit Oktober 2024 einen Anspruch darauf. Steckersolargeräte sind im Mietrecht (§ 554 BGB) und im Wohnungseigentumsrecht (§ 20 WEG) privilegierte bauliche Veränderungen. Vermieter oder Eigentümergemeinschaft können nur bei Unzumutbarkeit ablehnen und über die Art der Ausführung mitentscheiden.",
  },
  {
    q: "Was muss ich nach der Montage anmelden?",
    a: "Die Anlage wird vor Inbetriebnahme beim Netzbetreiber angemeldet und muss innerhalb eines Monats nach Inbetriebnahme im Marktstammdatenregister der Bundesnetzagentur registriert werden – auch der Speicher. Eine Baugenehmigung oder Bauanzeige ist für Dachanlagen nicht erforderlich.",
  },
];

export default async function Baurecht() {
  const response = await fetchBaurechtData();
  const data = response?.message;
  const banner = data?.banner;
  const body = data?.body;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BAURECHT_PAGE_URL}/#webpage`,
    url: BAURECHT_PAGE_URL,
    name: body?.title || "Baurecht für Photovoltaik | Ökovolt Deutschland",
    description: DESCRIPTION,
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: "2026-09-13",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen" }, { name: "Baurecht" }]}
        eyebrow="Baurecht Photovoltaik · Stand 2026"
        title={<>Braucht Ihre PV-Anlage eine <span className="ov-text-gradient">Genehmigung</span>?</>}
        lead="Für die meisten Dachanlagen: nein. Worauf es trotzdem ankommt – Denkmalschutz, Bebauungsplan, Brandschutz und Solarpflicht – erklären wir hier je Anlagentyp und Bundesland."
        image={{ src: img(banner?.image), alt: banner?.image_alt_text || "Solarmodule vor Windkraftanlagen im Sonnenuntergang" }}
        points={["Dachanlagen verfahrensfrei", "Solarpflicht aller 16 Länder", "Denkmal- & Brandschutz", "Genehmigungs-Check"]}
        actions={[
          { label: "Planung anfragen", href: "/angebot" },
          { label: "Genehmigungs-Check", href: "#genehmigungs-check", icon: ListChecks },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <ClipboardCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">Kein Bauantrag</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">für übliche Dachanlagen auf Wohnhäusern</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "0", label: "Bauanträge für übliche Dachanlagen" },
          { wert: "3 × 9 m", label: "verfahrensfrei für Anlagen im Garten (Höhe × Länge)" },
          { wert: "200 m", label: "privilegierte Freiflächen an Autobahn & Schiene" },
          { wert: "1 Monat", label: "Frist fürs Marktstammdatenregister" },
        ]}
      />

      <Section tone="sand" space="lg" id="genehmigungs-check" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Interaktiver Genehmigungs-Check"
          title={<>In 30 Sekunden zur <span className="ov-text-gradient">Einschätzung</span></>}
          lead="Anlagentyp wählen, drei Fragen beantworten – Sie sehen, ob ein Antrag nötig ist und was vor der Bestellung zu klären bleibt."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <GenehmigungsCheck />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Nach Anlagentyp"
            title="Welche Solaranlage braucht was?"
            lead="Grundlage ist § 61 der Musterbauordnung, den alle Länder in ihre Bauordnungen übernommen haben – mit Abweichungen im Detail. Verfahrensfrei heißt: kein Bauantrag, aber alle Vorschriften gelten weiter."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Stand September 2026</StandPille>
        </div>
        <Reveal>
          <Tabelle
            caption="Baurechtliche Einordnung von Solaranlagen nach Anlagentyp"
            spalten={[
              { key: "typ", label: "Anlagentyp", breite: "w-[26%]" },
              { key: "recht", label: "Baurecht", breite: "w-[20%]" },
              { key: "achten", label: "Worauf Sie achten müssen" },
            ]}
            zeilen={ANLAGEN}
          />
        </Reveal>
      </Section>

      <Section tone="sand" space="lg">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="Landesbauordnungen & Klimaschutzgesetze"
            title="Solarpflicht 2026: Übersicht aller 16 Bundesländer"
            lead="Eine Solarpflicht betrifft vor allem Neubauten und grundlegende Dachsanierungen – bestehende Häuser ohne Umbau sind fast nirgends verpflichtet. Die Regeln stehen teils in der Bauordnung, teils im Klimaschutzgesetz des Landes."
          />
          <Hinweis ton="warn" titel="Details ändern sich laufend">
            Schwellenwerte, Ausnahmen und Stichtage unterscheiden sich stark. Für eine konkrete Planung gilt die aktuelle Fassung des Landesrechts. Bundesweite Solaranforderungen im neuen Gebäudemodernisierungsgesetz sind in der Diskussion.
          </Hinweis>
        </div>
        <Reveal>
          <Tabelle
            dicht
            caption="Solarpflicht nach Bundesland (Stand 2026)"
            spalten={[
              { key: "land", label: "Bundesland", breite: "w-[20%]" },
              { key: "neubau", label: "Neubau" },
              { key: "bestand", label: "Bestand / Dachsanierung" },
              { key: "parken", label: "Parkplätze", breite: "w-[16%]" },
            ]}
            zeilen={SOLARPFLICHT}
          />
        </Reveal>
        <p className="mt-5 text-[13px] leading-relaxed text-ink-500">
          Vereinfachte Übersicht, Quellen u. a. Öko-Zentrum NRW und Landesrecht. Die Förderlage je Land finden Sie unter{" "}
          <Link href="/forderungen/landesforderungen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
            Photovoltaik-Förderung nach Bundesland
          </Link>.
        </p>
      </Section>

      {/* Sonderfälle */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[440px] w-[440px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Verfahrensfrei heißt nicht regelfrei"
            title="Vier Stellen, an denen Projekte wirklich scheitern"
            lead="Kein Bauantrag bedeutet nicht, dass alles erlaubt ist. Diese Punkte klären wir bei jeder Planung, bevor bestellt wird."
            className="mb-12"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: Castle, t: "Denkmalschutz", x: "Am Einzeldenkmal, im Ensemble und oft auch in dessen Umgebung ist eine denkmalrechtliche Erlaubnis nötig. Seit erneuerbare Energien im überragenden öffentlichen Interesse liegen (§ 2 EEG), wird sie deutlich häufiger erteilt – Baden-Württemberg etwa „regelmäßig“, wenn die Anlage untergeordnet und farblich angepasst ist." },
              { icon: Flame, t: "Brandschutz", x: "Solaranlagen dürfen Brandwände nicht überbrücken. Nach Musterbauordnung gelten Abstände von 0,5 m (flach anliegend) bis 1,25 m – entfallen, wenn die Brandwand 0,30 m über das Dach geführt ist. Einige Länder haben die Abstände für Gebäude geringer Höhe gestrichen. Bei größeren Gebäuden kommen Feuerwehr-Zugänge hinzu." },
              { icon: MapPinned, t: "Bebauungsplan & Gestaltungssatzung", x: "Örtliche Satzungen können Farbe, Aufständerung oder Anordnung der Module regeln, besonders in Altstädten. Verfahrensfreiheit entbindet nicht davon – im Zweifel wird eine Abweichung beantragt." },
              { icon: Ruler, t: "Statik & Lasten", x: "Schnee- und Windlastzonen nach DIN EN 1991 unterscheiden sich stark – im Allgäu und an der Küste liegen sie hoch. Unterkonstruktion und Dachtragwerk müssen dafür ausgelegt sein; bei Flachdächern zählt zusätzlich der Ballast." },
            ].map((k, i) => (
              <Reveal key={k.t} delay={i * 70} className="rounded-3xl bg-white/[0.04] p-7 ring-1 ring-white/10 md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
                  <k.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="ov-h3 mt-6 text-white">{k.t}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/65">{k.x}</p>
              </Reveal>
            ))}
          </div>
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
              <h2 className="ov-h2 mt-4 text-ink-900">{body.title || "Baurecht für Photovoltaikanlagen"}</h2>
              {body.description && <p className="ov-lead mt-5 text-ink-600">{body.description}</p>}
              <CmsProse html={body.rules} korrekturen={CMS_KORREKTUREN} className="mt-8" />
            </Reveal>
            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              {[
                { href: "/forderungen/richtlinien", icon: Zap, t: "Normen & Netzanschluss", x: "VDE-AR-N 4105, EEG und Marktstammdatenregister" },
                { href: "/forderungen/steuerlich", icon: Landmark, t: "Steuerliche Vorteile", x: "0 % Umsatzsteuer und Einkommensteuerbefreiung" },
                { href: "/forderungen/landesforderungen", icon: Sun, t: "Förderung nach Bundesland", x: "Zuschüsse und Darlehen an Ihrem Standort" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="group ov-card-hover flex items-start gap-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-200">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                    <l.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-display text-[16.5px] font-bold text-ink-900 group-hover:text-ov-700">
                      {l.t}
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-[14px] leading-snug text-ink-500">{l.x}</span>
                  </span>
                </Link>
              ))}
            </aside>
          </div>
        </Section>
      )}

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Schritt für Schritt"
            title="Von der Idee zur rechtssicheren Anlage"
            lead="So klären Sie die baurechtlichen Fragen in der richtigen Reihenfolge – bevor Geld für Material ausgegeben ist."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <HowTo
            name="Baurechtliche Voraussetzungen für eine Photovoltaikanlage prüfen"
            beschreibung="Anleitung zur Prüfung von Genehmigung, Denkmalschutz, Bebauungsplan und Anmeldung einer PV-Anlage in Deutschland (Stand 2026)."
            schritte={[
              { icon: FileSearch, name: "Denkmalliste und Bebauungsplan prüfen", text: "Im Denkmal-Atlas des Landes und im Geoportal der Gemeinde nachsehen, ob Denkmalschutz, Ensembleschutz oder Gestaltungsvorgaben für das Grundstück gelten." },
              { icon: Castle, name: "Erlaubnis beantragen, falls nötig", text: "Bei Denkmalschutz die Erlaubnis bei der Unteren Denkmalschutzbehörde beantragen. Bei Abweichungen vom Bebauungsplan eine Abweichung oder Befreiung beim Bauamt beantragen." },
              { icon: Ruler, name: "Statik und Brandschutz planen", text: "Tragfähigkeit von Dach und Unterkonstruktion für die regionale Schnee- und Windlast nachweisen und Abstände zu Brandwänden nach Landesbauordnung einplanen." },
              { icon: Zap, name: "Netzanschluss beantragen", text: "Der Fachbetrieb stellt das Netzanschlussbegehren beim Netzbetreiber nach VDE-AR-N 4105. Erst nach dessen Rückmeldung wird die Anlage angeschlossen." },
              { icon: ClipboardCheck, name: "Inbetriebnahme und Registrierung", text: "Nach Montage Inbetriebnahmeprotokoll erstellen und Anlage sowie Speicher innerhalb eines Monats im Marktstammdatenregister eintragen." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Baurecht & Photovoltaik – kurz beantwortet"
            lead="Allgemeine Orientierung, keine Rechtsauskunft. Für Ihr Grundstück klären wir die Fragen im Rahmen der Planung."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/forderungen/baurecht" />
      <CtaBand
        eyebrow="Planung vom Fachbetrieb"
        title="Wir klären Baurecht, Denkmalschutz und Anmeldung für Sie."
        text="Von der Prüfung des Bebauungsplans über die Statik bis zur Netzanmeldung: Sie bekommen eine Anlage, die rechtlich und technisch sauber geplant ist."
        primary={{ label: "Kostenlose Planung anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
