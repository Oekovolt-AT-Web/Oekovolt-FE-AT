import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  ClipboardList,
  Droplets,
  FileCheck2,
  Flame,
  HandCoins,
  History,
  Landmark,
  LineChart,
  MonitorDot,
  School,
  Sprout,
  Users,
  Waves,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import MeldungKarte from "@/components/Kanaele/MeldungKarte";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/A/KennzahlenBand";
import FotoBento from "@/components/Loesungen/A/FotoBento";
import LastprofilExplorer from "@/components/Loesungen/A/LastprofilExplorer";
import TechnikSystem from "@/components/Loesungen/A/TechnikSystem";
import ZitatBand from "@/components/Loesungen/A/ZitatBand";
import AblaufLeiste from "@/components/Loesungen/A/AblaufLeiste";
import FachTabs from "@/components/Loesungen/A/FachTabs";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import EinwandKarten from "@/components/Verkauf/EinwandKarten";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";
import { actorId } from "@/lib/kanaele/activitypub";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

export const revalidate = 300;

// Welle A / A05: Die Salzburg AG ist auf dieser Seite kein Werbeargument mehr (Entscheidung des
// Inhabers 05.10.2026, Anwaltsprüfung offen). Die neutrale Gesellschafterangabe steht auf /uber-uns
// und im Impressum. Keine Aussagen zu Unabhängigkeit, Beteiligungen oder Vorrang im Vergabeverfahren.
// CTA-Kette: „Beschlussvorlage anfordern“ → /angebot?objekt=gemeinde&thema=beschlussvorlage (Auswertung des
// Parameters „thema“ im Konfigurator: Übergabe an A08).
const CTA_BESCHLUSS = { label: "Beschlussvorlage anfordern", href: "/angebot?objekt=gemeinde&thema=beschlussvorlage" };
const CTA_TERMIN = { label: "Video-Termin vereinbaren", href: "/termin?art=video&thema=gemeinde" };

const PFAD = "/kommunen";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Gemeinden: Planung bis Betrieb | Ökovolt";
const BESCHREIBUNG =
  "PV für Gemeinden: Schulen, Bauhöfe, Kläranlagen, Freibäder, Energiegemeinschaft und Vergabe nach BVergG 2026 – Photovoltaik für Gemeinden in ganz Österreich: Planung, Vergabeunterstützung, Bau und Betrieb.";
const HERO_BILD = "/Images/AT/loesungen-a/gem-schule-luftbild.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL, types: { "application/activity+json": [{ url: actorId("oekovolt"), title: "@oekovolt@oekovolt.com" }] } },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  other: { "fediverse:creator": "@oekovolt@oekovolt.com" },
};

const FAQ = [
  {
    q: "Darf eine Gemeinde eine PV-Anlage direkt vergeben?",
    a: "Seit dem Vergaberechtsgesetz 2026 (BGBl. I Nr. 8/2026, in Kraft seit 1. März 2026) sind Direktvergaben bei Bauaufträgen bis zu einem geschätzten Auftragswert von 200.000 Euro zulässig, bei Liefer- und Dienstleistungsaufträgen bis zum Schwellenwert nach § 12 Abs. 1 Z 1 BVergG (2026: 140.000 Euro). Ab 50.000 Euro muss sich die Gemeinde um mindestens drei Angebote oder Preisauskünfte bemühen, und die Vergabe ist zu veröffentlichen. Ob eine PV-Anlage Bau- oder Lieferauftrag ist, hängt vom Schwerpunkt der Leistung ab.",
  },
  {
    q: "Welche Gebäude einer Gemeinde eignen sich am besten?",
    a: "Gebäude mit großen Dächern und Tagesverbrauch: Schulen und Kindergärten, Gemeindeamt, Bauhof, Feuerwehrhaus, Sporthallen, Kläranlage, Wasserversorgung und Freibad. Kläranlagen und Pumpwerke haben eine Grundlast rund um die Uhr, Freibäder ihren höchsten Verbrauch genau im Sommer. Entscheidend sind Statik, Dachzustand und Netzanschluss; das prüfen wir je Liegenschaft.",
  },
  {
    q: "Wie kann die Gemeinde ihre Bürgerinnen und Bürger beteiligen?",
    a: "Am einfachsten über eine Energiegemeinschaft, in der Haushalte und Betriebe Strom aus Gemeindeanlagen beziehen. Finanzielle Beteiligungen sind über Genossenschaften, Sale-and-lease-back-Modelle oder Nachrangdarlehen möglich; dafür gelten kapitalmarktrechtliche Vorgaben, etwa nach dem Alternativfinanzierungsgesetz. Wir liefern Anlagen- und Ertragsdaten, die rechtliche Konstruktion übernimmt Ihre Rechtsberatung.",
  },
  {
    q: "Was gilt für Gemeinden in einer Energiegemeinschaft?",
    a: "Gemeinden dürfen Mitglied, Gründerin oder Anlagenbetreiberin einer Erneuerbare-Energie-Gemeinschaft oder Bürgerenergiegemeinschaft sein. Betreibt die Gemeinde Erzeugungsanlagen in der gemeinsamen Nutzung, muss sie nach dem Elektrizitätswirtschaftsgesetz schutzbedürftigen Haushalten den Zugang zu mindestens 10 % der jährlich erzeugten Energie ermöglichen. Preise und Bedingungen legt sie selbst fest.",
  },
  {
    q: "Welche Förderungen und Mittel können Gemeinden nutzen?",
    a: "Den EAG-Investitionszuschuss für PV-Anlagen bis 1.000 kWp und Speicher, Zuschläge für innovative Anlagen wie Parkplatzüberdachungen, Mittel aus dem Kommunalinvestitionsgesetz 2025 sowie Programme für Klima- und Energie-Modellregionen und Landesförderungen. Welche Kombination zulässig ist, hängt von den beihilferechtlichen Höchstgrenzen ab; wir stellen die Varianten für Ihre Gremien zusammen.",
  },
  {
    q: "Was bekommt der Gemeinderat von Ökovolt für seinen Beschluss?",
    a: "Eine Beschlussvorlage mit Rechenweg: Dachbewertung je Liegenschaft, Ertragsprognose, Eigenverbrauchsanteil, Kostenrahmen, Netzauskunft, Förderweg (EAG, KIG 2025, Land) und der passende Vergabeweg nach dem geschätzten Auftragswert. Die Unterlagen sind so aufgebaut, dass Amtsleitung und Prüfungsausschuss jede Zahl nachvollziehen können. Rechts- und Steuerfragen klären Sie mit Gemeindebund, Landesverwaltung oder Ihrer Beratung.",
  },
  {
    q: "Können wir Photovoltaik mit Notstrom für Feuerwehr und Krisenstab kombinieren?",
    a: "Ja. Mit einem inselnetzfähigen Speicher und automatischer Netztrennung bleiben Feuerwehrhaus, Gemeindeamt als Krisenstab, Wasserversorgung oder Notunterkünfte bei einem Stromausfall versorgt. Wir planen, welche Verbraucher wie lange laufen müssen – abgestimmt mit dem Blackout-Konzept der Gemeinde.",
  },
  {
    q: "Wie bleiben wir über Neuigkeiten informiert – ohne kommerzielle Plattformen?",
    a: "Unser Newsroom ist über das Fediverse erreichbar: Folgen Sie @oekovolt@oekovolt.com direkt von Ihrem Mastodon-Konto aus. Alternativ gibt es RSS-Feeds und Push-Benachrichtigungen ohne Tracking.",
  },
];

const VERGABE = [
  { art: "Direktvergabe – Bauauftrag", wert: "unter 200.000 €", hinweis: "ab 50.000 € mindestens drei Angebote oder Preisauskünfte einholen" },
  { art: "Direktvergabe – Liefer- oder Dienstleistungsauftrag", wert: "unter 140.000 € (§ 12 Abs. 1 Z 1)", hinweis: "wie oben; Schwerpunkt der Leistung entscheidet über die Einordnung" },
  { art: "Direktvergabe mit vorheriger Bekanntmachung – Bau", wert: "unter 2.000.000 €", hinweis: "Bekanntmachung, dann Verhandlung mit geeigneten Unternehmen" },
  { art: "Direktvergabe mit vorheriger Bekanntmachung – Liefer/DL", wert: "unter 140.000 €", hinweis: "für Liefer- und Dienstleistungen keine Erweiterung gegenüber der Direktvergabe" },
  { art: "Sektorenauftraggeber (z. B. Stadtwerke)", wert: "Direktvergabe Bau 200.000 €, Liefer/DL 150.000 €", hinweis: "mit Bekanntmachung: Liefer/DL 200.000 €, Bau 2.000.000 €" },
  { art: "EU-Schwellenwerte 2026/2027", wert: "Bau 5.404.000 € · Liefer/DL 216.000 € (subzentral) · Sektoren 432.000 €", hinweis: "darüber EU-weite Verfahren" },
];


// Typisierte Beispielprofile (relativ, Stundenwerte) – Veranschaulichung, keine Messwerte.
const GEBAEUDE = [
  {
    id: "schule",
    label: "Schule",
    icon: "School",
    titel: "Schulen & Kindergärten",
    last: [0.15, 0.15, 0.15, 0.15, 0.15, 0.16, 0.3, 0.75, 0.95, 1, 1, 0.95, 0.9, 0.82, 0.7, 0.5, 0.3, 0.22, 0.2, 0.18, 0.17, 0.16, 0.15, 0.15],
    pvFaktor: 1.1,
    text: "Große Dächer, Verbrauch am Vormittag – und ein Lernthema für den Unterricht mit Live-Anzeige.",
    punkte: ["Nachmittag, Wochenende und Ferien: Überschuss in die Energiegemeinschaft", "Live-Anzeige der Erzeugung im Schulgebäude"],
    link: { label: "Energiegemeinschafts-Rechner", href: "/rechner/energiegemeinschaft" },
  },
  {
    id: "bauhof",
    label: "Bauhof & Feuerwehr",
    icon: "Flame",
    titel: "Bauhof & Feuerwehr",
    last: [0.18, 0.18, 0.18, 0.18, 0.2, 0.35, 0.8, 0.95, 1, 0.95, 0.9, 0.7, 0.8, 0.9, 0.85, 0.6, 0.45, 0.4, 0.3, 0.22, 0.2, 0.19, 0.18, 0.18],
    pvFaktor: 0.9,
    text: "Werkstatt, E-Fuhrpark und Notstrom für Einsatzbereitschaft – mit Speicher und Netztrennung.",
    punkte: ["E-Fuhrpark mit Überschuss laden", "Feuerwehrhaus und Krisenstab bei Stromausfall versorgt"],
    link: { label: "Blackout-Rechner", href: "/rechner/blackout" },
  },
  {
    id: "klaeranlage",
    label: "Kläranlage",
    icon: "Droplets",
    titel: "Kläranlage & Wasserversorgung",
    last: [0.78, 0.76, 0.75, 0.75, 0.76, 0.8, 0.86, 0.92, 0.96, 0.98, 1, 1, 0.98, 0.97, 0.96, 0.94, 0.92, 0.9, 0.9, 0.88, 0.85, 0.82, 0.8, 0.79],
    pvFaktor: 0.4,
    text: "Belüftung, Pumpen und Hochbehälter mit Grundlast rund um die Uhr – ideal für PV mit Lastmanagement.",
    punkte: ["Grundlast rund um die Uhr: fast jede kWh wird selbst genutzt", "Lastmanagement verschiebt flexible Pumpenzeiten in die Mittagsstunden"],
    link: { label: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving" },
  },
  {
    id: "freibad",
    label: "Freibad",
    icon: "Waves",
    titel: "Freibad & Sportanlagen",
    last: [0.5, 0.5, 0.5, 0.5, 0.5, 0.52, 0.6, 0.75, 0.88, 0.95, 1, 1, 1, 1, 1, 0.98, 0.95, 0.9, 0.82, 0.7, 0.6, 0.55, 0.52, 0.5],
    lastSaison: {
      uebergang: [0.35, 0.35, 0.35, 0.35, 0.35, 0.36, 0.42, 0.5, 0.58, 0.62, 0.65, 0.66, 0.66, 0.66, 0.65, 0.62, 0.58, 0.52, 0.46, 0.4, 0.38, 0.36, 0.35, 0.35],
      winter: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.07, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.07, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06],
    },
    pvFaktor: 0.55,
    text: "Umwälzung, Filter und Warmwasser laufen im Sommer auf Hochlast – genau zur Solarkurve.",
    punkte: ["Außerhalb der Badesaison: Strom für andere Gemeindegebäude oder die Energiegemeinschaft"],
    link: { label: "CO₂- & ESG-Rechner", href: "/rechner/co2-esg" },
  },
];

// Feste Trennstellen für lange Komposita in der H1 (WebKit ohne Silbentrennungsdaten bricht sonst mitten im Wort)
const trennbar = (text) => String(text || "").replace("Gemeinderatstauglich", "Gemeinde\u00ADrats\u00ADtauglich");

export default async function KommunenPage() {
  // Ohne Kampagnenvarianten: Seite bleibt statisch (ISR), damit der Newsroom-Block gecacht wird.
  const v = zielgruppenVariante("gemeinden");
  const meldungen = (await veroeffentlichungen({ kanal: "website", kategorie: "Kommunen & Stadtwerke", limit: 3 })).slice(0, 3);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Gemeinden, Länder und Stadtwerke in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Gemeinden, Länder, Stadtwerke, Landesversorger"
        bild={HERO_BILD}
        leistungen={["Potenzialanalyse kommunaler Liegenschaften", "PV auf Schulen, Bauhöfen, Kläranlagen und Freibädern", "Energiegemeinschaft der Gemeinde", "Unterstützung bei Vergabeverfahren", "Notstrom und Blackout-Vorsorge", "Monitoring und Wartung"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Gemeinden, Länder & Stadtwerke" }]}
        eyebrow={v.eyebrow}
        title={<>Photovoltaik für Gemeinden: <span className="ov-text-gradient-light">{trennbar(v.titel)} {v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Luftbild eines Schulzentrums in Klagenfurt mit Photovoltaikanlage auf dem Flachdach" }}
        actions={[
          { label: CTA_BESCHLUSS.label, href: CTA_BESCHLUSS.href },
          { label: CTA_TERMIN.label, href: CTA_TERMIN.href, icon: CalendarCheck2 },
        ]}
        points={["Schulen, Bauhöfe, Kläranlagen, Freibäder", "Vergabe nach BVergG 2026", "Energiegemeinschaft der Gemeinde", "Beschlussvorlage mit Rechenweg"]}
      />

      <KennzahlenBand
        items={[
          { wert: 200000, nach: " €", label: "Direktvergabe bei Bauaufträgen seit 1. März 2026 (Vergaberechtsgesetz 2026)" },
          { wert: 50000, nach: " €", label: "darüber drei Angebote bzw. Preisauskünfte und Veröffentlichung der Vergabe" },
          { wert: 10, nach: " %", label: "der Erzeugung von Gemeinde-Anlagen in Energiegemeinschaften für schutzbedürftige Haushalte" },
          { wert: 1000, nach: " kWp", label: "bis dahin EAG-Investitionszuschuss für PV-Anlagen – auch für Gemeinden, Speicher bis 50 kWh" },
        ]}
        quelle="Quellen: Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 (Regierungsvorlage 302 BlgNR XXVIII. GP); Österreichische Koordinationsstelle für Energiegemeinschaften (FAQ zum ElWG); EAG-Investitionszuschüsseverordnung-Strom laut Leitfaden Land Oberösterreich 2026."
      />

      <Section tone="white" space="md">
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Einsatzfelder" title="Wo Gemeinden am meisten gewinnen" />
          <p className="ov-lead text-ink-600">
            Kommunale Liegenschaften verbinden große Dächer mit Verbrauch zu Tageszeiten – und haben eine Vorbildfunktion. Diese Einsatzfelder bringen in
            Österreich die höchsten Eigenverbrauchsquoten.
          </p>
        </div>
        <FotoBento
          items={[
            { format: "gross", icon: School, titel: "Schulen & Kindergärten", text: "Große Dächer, Verbrauch am Vormittag – und ein Lernthema für den Unterricht mit Live-Anzeige.", bild: "/Images/AT/loesungen-a/gem-schule-flachdach.jpg", alt: "Photovoltaikanlage auf dem Flachdach einer Schule in Hard am Bodensee mit Bergen im Hintergrund" },
            { icon: Landmark, titel: "Gemeindeamt & Verwaltung", text: "Eigenverbrauch senken, Kosten planbar machen, bei Stromausfall als Krisenstab arbeitsfähig bleiben.", bild: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg", alt: "Gemeindeamt in Fresach in Kärnten mit Photovoltaikanlage auf dem Dach" },
            { icon: Flame, titel: "Bauhof & Feuerwehr", text: "Werkstatt, E-Fuhrpark und Notstrom für Einsatzbereitschaft – mit Speicher und Netztrennung.", bild: "/Images/AT/loesungen-a/gem-feuerwehr-dorfhaus.jpg", alt: "Feuerwehrhaus und Dorfhaus in Fladnitz im Raabtal mit Photovoltaik auf dem Dach", href: "/service/notstrom" },
            { icon: Droplets, titel: "Kläranlage & Wasserversorgung", text: "Belüftung, Pumpen und Hochbehälter mit Grundlast rund um die Uhr.", bild: "/Images/AT/loesungen-a/gem-klaeranlage-luftbild.jpg", alt: "Luftbild der Kläranlage Wartberg an der Krems mit Photovoltaik auf den Betriebsgebäuden" },
            { icon: Waves, titel: "Freibad & Sportanlagen", text: "Umwälzung, Filter und Warmwasser laufen im Sommer auf Hochlast – genau zur Solarkurve.", bild: "/Images/AT/loesungen-a/gem-freibad-grossarl.jpg", alt: "Freibad und Sportplatz in Großarl mit Photovoltaik auf umliegenden Dächern" },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="liegenschaften">
        <LastprofilExplorer
          ueberschrift="h2"
          eyebrow="Liegenschaften · interaktiv"
          titel="Welches Gebäude passt zur Solarkurve?"
          lead="Kläranlagen und Pumpwerke haben eine Grundlast rund um die Uhr, Freibäder ihren höchsten Verbrauch genau im Sommer. Wählen Sie ein Gebäude und eine Jahreszeit."
          profile={GEBAEUDE}
        />
      </Section>

      <TechnikSystem
        eyebrow="Technik & Betrieb"
        title="Anlagen, die Gemeinden selbst im Blick haben"
        lead="Parkregler, Fernwartung und SCADA mit unserem Technologiepartner Solensa – parametriert, betreut und gewartet von uns. Mit Kennzahlen für Energiebuchhaltung, Klimaberichte und Öffentlichkeitsarbeit."
        fakten={[
          { wert: "Alle", label: "Liegenschaften in einer Übersicht" },
          { wert: "CO₂", label: "Einsparung für Klimaberichte" },
          { wert: "TOR", label: "konforme Regelung auf Mittelspannung" },
        ]}
        knoten={{
          erzeugung: { titel: "Gemeindedächer", text: "Schule, Bauhof, Kläranlage, Bad" },
          zusatz: { titel: "Speicher & Notstrom", text: "Krisenstab, Feuerwehr, Wasser" },
          netz: { titel: "Netzbetreiber", text: "Netzebene 7 bis 5" },
          leitwarte: { titel: "SCADA-Übersicht", text: "Gemeinderat & Bevölkerung" },
        }}
        texte={{
          parkregler: "Für Freiflächen und große Dächer auf Mittelspannung: TOR-konforme Regelung am Netzverknüpfungspunkt.",
          fernwartung: "Überwachung aller Gemeindeanlagen, Störmeldung an Bauhof oder Wartungsdienst – ohne eigenes IT-Projekt.",
          scada: "Alle Liegenschaften in einer Übersicht: Erzeugung, Eigenverbrauch, CO₂-Einsparung und Energiegemeinschaft – für Gemeinderat und Bevölkerung.",
        }}
        bild={{ src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "" }}
      />

      <Section tone="white" space="md" id="finanzierung">
        <SplitMedia
          eyebrow="Förderung, Mittel & Beteiligung"
          title="Wie Gemeinden PV-Projekte finanzieren"
          text="Gemeinden kombinieren in Österreich meist Bundesförderung nach EAG, Mittel aus dem Kommunalinvestitionsgesetz, Programme der Modellregionen und Landesförderungen – ergänzt um Bürgerbeteiligung."
          points={[
            { title: "EAG-Investitionszuschuss", text: "PV bis 1.000 kWp und Speicher bis 50 kWh, letzter Call 2026: 8.–22. Oktober." },
            { title: "Kommunalinvestitionsgesetz", text: "KIG 2025: 620 Mio. € Finanzzuweisung des Bundes an die Gemeinden, ohne Antrag – Investitionen in die Energiewende sind im Bericht besonders zu berücksichtigen (§§ 2, 3 KIG 2025)." },
            { title: "KEM & KLAR!", text: "Modellregionen des Klima- und Energiefonds bündeln Beratung und Projekte." },
            { title: "Bürgerbeteiligung", text: "Energiegemeinschaft, Genossenschaft, Sale-and-lease-back oder Nachrangdarlehen." },
          ]}
          image={{ src: "/Images/AT/loesungen-a/gem-hochbehaelter.jpg", alt: "Photovoltaikmodule auf dem Dach eines Hochbehälters der Wasserversorgung in Götzis" }}
          action={{ label: "Details zu Förderkombinationen", href: "#foerderkombination" }}
        />
      </Section>

      <ZitatBand
        bild={{ src: "/Images/AT/ratgeber/hochspannungsleitung-molln.jpg", alt: "", position: "center 40%" }}
        id="betreiberblick"
        eyebrow="Betreiberblick"
        titel="Betreiberblick für öffentliche Anlagen"
        text="Die Gründer von Ökovolt betreiben seit 2012 eigene Solarparks. Deshalb planen wir Anlagen für Gemeinden so, wie wir sie selbst betreiben würden: mit Leittechnik, die Erzeugung, Eigenverbrauch und Einspeisung je Liegenschaft liefert und damit die Energiebuchhaltung der Gemeinde versorgt – und mit Unterlagen, die Vergabe, Förderantrag und Gemeinderatsbeschluss tragen."
        fakten={[
          { icon: History, titel: "Seit 2012", text: "eigene Solarparks der Gründer – Betrieb aus erster Hand, über die gesamte Laufzeit." },
          { icon: MonitorDot, titel: "Leittechnik", text: "Parkregler, Fernwartung und SCADA mit unserem Technologiepartner Solensa – parametriert, betreut und gewartet von uns; Kennzahlen für die Energiebuchhaltung." },
          { icon: FileCheck2, titel: "Vergabe-Know-how", text: "Schwellenwerte nach BVergG 2026, Wegweiser und Checkliste für den Gemeinderat – siehe Vergabe und Förderung." },
        ]}
      >
        <Link href="/kommunen/vergabe-foerderung" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.08] px-5 text-[15px] font-semibold text-white ring-1 ring-white/20 transition hover:bg-ov-600 hover:ring-ov-600">
          Vergabe und Förderung für Gemeinden
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <div className="mt-12 border-t border-white/15 pt-12">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Vorgehen</p>
          <h2 className="ov-h3 mt-3 text-white md:text-[28px]">Vom Gemeinderatsbeschluss zur laufenden Anlage</h2>
          <AblaufLeiste
            tone="dark"
            className="mt-10"
            items={[
              { icon: ClipboardList, title: "Potenzialanalyse", text: "Liegenschaften, Verbräuche, Dächer und Netzanschlüsse bewerten – mit Prioritätenliste für Gemeinderat und Ausschüsse." },
              { icon: HandCoins, title: "Finanzierung & Förderung", text: "Investition, Eigenverbrauch, Energiegemeinschaft, EAG, KIG und Landesmittel transparent gegenübergestellt." },
              { icon: FileCheck2, title: "Vergabe & Umsetzung", text: "Unterlagen für die Vergabe, Netzanschluss, Statik, Brandschutz und Montage – abgestimmt mit Bauamt und Netzbetreiber." },
              { icon: LineChart, title: "Betrieb & Berichte", text: "Monitoring, Wartung, E-Check und Kennzahlen für Klimaschutzberichte und Bürgerinformation." },
            ]}
          />
        </div>
      </ZitatBand>

      <Section tone="sand" space="md" id="vergabe">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Für Amtsleitung, Bauamt & Gremien" title="Vergabe und Förderung im Detail" />
          <div className="flex lg:justify-end">
            <StandPille>Vergaberecht in Kraft seit 1. März 2026</StandPille>
          </div>
        </div>
        <FachTabs
          tabs={[
            { id: "vergaberecht", label: "Schwellenwerte BVergG 2026" },
            { id: "unterstuetzung", label: "Vergabepraxis & Stadtwerke" },
            { id: "foerderkombination", label: "Förderkombination & Mittel" },
          ]}
        >
          <div>
            <p className="max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Mit dem Vergaberechtsgesetz 2026 hat Österreich die Direktvergabe-Grenzen dauerhaft angehoben. Für viele kommunale PV-Anlagen bis rund
              200 kWp ist damit eine Direktvergabe möglich – mit mehr Pflichten zur Dokumentation.
            </p>
            <Tabelle
              className="mt-6"
              dicht
              caption="Schwellenwerte für Direktvergaben nach dem Vergaberechtsgesetz 2026"
              spalten={[
                { key: "art", label: "Verfahren", breite: "w-[34%]" },
                { key: "wert", label: "Geschätzter Auftragswert", breite: "w-[28%]" },
                { key: "hinweis", label: "Hinweis" },
              ]}
              zeilen={VERGABE}
              fuss="Quellen: Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 (§§ 46, 47, 213, 214 BVergG 2018 idF; Regierungsvorlage 302 BlgNR XXVIII. GP); EU-Schwellenwerte laut Rundschreiben des BMJ vom 8.1.2026. Alle Werte netto. Keine Rechtsberatung – die Wahl des Verfahrens verantwortet der Auftraggeber."
            />
            <Link href="/kommunen/vergabe-foerderung" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Vergabe-Wegweiser und Checkliste für den Gemeinderat
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Vergabepraxis, Stadtwerke und Landesversorger</h3>
            <Prosa className="mt-6 grid gap-6 xl:grid-cols-2 xl:gap-10 [&>*+*]:mt-0">
              <p>
                <strong>Wie wir öffentliche Auftraggeber unterstützen:</strong> Schon in der Bedarfsermittlung liefern wir Ertragsprognosen,
                Dachbewertungen, Kostenschätzungen und technische Mindestanforderungen, damit Leistungsverzeichnisse realistisch sind. An
                Vergabeverfahren beteiligen wir uns nach den jeweiligen Vorgaben. Mehr im Ratgeber{" "}
                <Link href="/ratgeber/photovoltaik-gemeinde">Photovoltaik für Gemeinden</Link>.
              </p>
              <p>
                <strong>Stadtwerke und Landesversorger</strong> sind häufig Sektorenauftraggeber mit eigenen Grenzen. Für große Anlagen auf
                Mittelspannung gelten zusätzlich die Anforderungen der TOR Erzeuger – dafür setzen wir Parkregler und Leitwarte unseres
                Technologiepartners Solensa ein, parametriert und betreut von uns.
              </p>
            </Prosa>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Förderkombinationen prüfen</h3>
            <Hinweis className="mt-6" titel="EAG, Land und Gemeinde kombinieren">
              Beim EAG-Investitionszuschuss sind Kombinationen mit Landes- und Gemeindeförderungen für PV-Anlagen der Kategorien A bis C und für
              innovative Anlagen im Rahmen der beihilferechtlichen Höchstgrenzen möglich; bei Kategorie D nicht. Wir stellen die Varianten für
              Gemeinderat und Prüfungsausschuss transparent zusammen. Überblick: <Link href="/forderungen/bundesfoerderung" className="text-ov-700 underline">Bundesförderung</Link> und{" "}
              <Link href="/forderungen/landesforderungen" className="text-ov-700 underline">Landesförderungen</Link>.
            </Hinweis>
            <Hebel
              className="mt-6"
              cols={2}
              items={[
                { icon: HandCoins, titel: "EAG-Investitionszuschuss", text: "PV bis 1.000 kWp und Speicher bis 50 kWh; 30 % Zuschlag für Parkplatzüberdachungen ab 10 Stellplätzen und gebäudeintegrierte PV. Letzter Call 2026: 8.–22. Oktober." },
                { icon: Landmark, titel: "Kommunalinvestitionsgesetz", text: "Der Bund stellt nach § 2 KIG 2025 insgesamt 620 Mio. € als Finanzzuweisung an die Gemeinden bereit – seit dem Budgetbegleitgesetz 2025 (BGBl. I Nr. 25/2025) ohne Antrag und ohne Eigenanteil, ausgezahlt in Tranchen von 2025 bis 2028. Im Bericht an den Gemeinderat sind Investitionen in die Energiewende besonders zu berücksichtigen (§ 3)." },
                { icon: Sprout, titel: "KEM & KLAR!", text: "Klima- und Energie-Modellregionen sowie Klimawandel-Anpassungsregionen des Klima- und Energiefonds bündeln Beratung und Projekte über Gemeindegrenzen hinweg." },
                { icon: Users, titel: "Bürgerbeteiligung", text: "Energiegemeinschaft, Genossenschaft, Sale-and-lease-back oder Nachrangdarlehen – mit Blick auf Kapitalmarkt- und Gemeinderecht." },
              ]}
            />
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
              Quelle KIG: §§ 2 und 3 Kommunalinvestitionsgesetz 2025 idF Budgetbegleitgesetz 2025, BGBl. I Nr. 25/2025 (
              <a href="https://www.jusline.at/gesetz/kig_2025/gesamt" target="_blank" rel="noopener noreferrer" className="underline">
                konsolidierter Gesetzestext
              </a>
              , Stand 13.08.2026; abgerufen 30.09.2026). Details zu KIG und Bürgerbeteiligung:{" "}
              <Link href="/kommunen/vergabe-foerderung#foerderung" className="text-ov-700 underline">
                Vergabe & Förderung für Gemeinden
              </Link>
              .
            </p>
          </div>
        </FachTabs>
      </Section>

      {/* Einwände vor der FAQ; FAQPage-Schema liefert die FAQ, daher mitSchema aus */}
      <Section tone="white" space="md" id="einwaende" className="scroll-mt-24">
        <SectionHeading eyebrow="Einwände" title="Was Gemeinderat und Amtsleitung vor dem Beschluss fragen" className="mb-8" />
        <EinwandKarten gruppe="kommunen" mitSchema={false} titel={false} />
      </Section>

      <Section tone="sand" space="md" id="faq" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Bürgermeister, Amtsleitung und Gremien" />
          <div>
            <Faq items={FAQ} />
            {meldungen.length > 0 && (
              <div className="mt-12">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Aktuelles für Gemeinden & Stadtwerke</p>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  {meldungen.slice(0, 2).map((m) => (
                    <MeldungKarte key={m.slug} m={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Vergabe, Energiegemeinschaft und Förderung" />

      {/* Ansprechpartner (A03): Name und Foto nur mit Einwilligung, sonst Teamfunktion und Zentrale */}
      <Section tone="white" space="md" id="ansprechpartner" className="scroll-mt-20">
        <Ansprechpartner zielgruppe="gemeinde" />
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Lassen Sie uns Ihre Liegenschaften gemeinsam bewerten."
        text="Sie bekommen eine Beschlussvorlage mit Rechenweg: Potenzial, Wirtschaftlichkeit, Vergabeweg, Förderung und Energiegemeinschaft – als Grundlage für Gemeinderat und Prüfungsausschuss."
        primary={{ label: CTA_BESCHLUSS.label, href: CTA_BESCHLUSS.href }}
        secondary={{ label: CTA_TERMIN.label, href: CTA_TERMIN.href, icon: CalendarCheck2 }}
      />

      <Bildnachweis items={nachweise("schuleLuftbild", "schuleDach", "gemeindeamt", "feuerwehr", "klaeranlage", "freibad", "hochbehaelter", "molln", "leitwarte")} />
    </div>
  );
}
