// src/app/forderungen/eag-foerdercall/page.js
//
// Landingpage zum 3. EAG-Fördercall 2026 (Investitionszuschuss PV & Speicher,
// 08.–22.10.2026): Countdown, Checkliste, Schnellrechner, Ablauf, Fehler,
// Kombination mit Landesförderung, FAQ, Quellen.
//
// Alle Zahlen: siehe Quellenliste unten und src/lib/foerdercall.js (Stand 30.09.2026).
// Nach dem Call: Texte auf „nächster Call“ umstellen, sobald die OeMAG Termine für 2027 veröffentlicht.

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BadgeEuro, CalendarClock, CalendarPlus, Calculator, FileSignature, ListChecks, PlugZap, Receipt, Send, Ticket, UserRound, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import PushOptIn from "@/components/Kanaele/PushOptIn";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Bildnachweis, Fachdetails, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { nachweise } from "@/components/Forderungen/Shared/bildnachweise";
import { Checkliste, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_IZ, STEUER } from "@/components/Forderungen/Shared/bund";
import CallStatus from "@/components/Foerdercall/CallStatus";
import SchnellRechner from "@/components/Foerdercall/SchnellRechner";
import VorbereitungsCheckliste from "@/components/Foerdercall/VorbereitungsCheckliste";
import { alleBundeslaender, FOERDERARTEN, landesPfad } from "@/data/bundeslaender";
import { callPhase, FOERDERCALL } from "@/lib/foerdercall";
import { BASE_URL } from "@/lib/site";

// Status und Countdown-Startwert werden stündlich neu gerendert (ISR),
// damit das HTML auch ohne JavaScript die richtige Phase zeigt.
export const revalidate = 3600;

const PFAD = "/forderungen/eag-foerdercall";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITLE = "EAG-Fördercall Oktober 2026: PV & Speicher | Ökovolt";
const DESCRIPTION = "3. EAG-Fördercall 08.–22.10.2026: Ticketziehung 8.10. um 17 Uhr, 8 Mio. € Budget, 150 €/kWp und 150 €/kWh Speicher. Checkliste, Rechner und Ablauf.";
const STAND = FOERDERCALL.stand;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["EAG Fördercall Oktober 2026", "OeMAG Fördercall 2026", "EAG Ticketziehung", "PV Förderung Oktober 2026", "Photovoltaik Förderung Österreich 2026", "Stromspeicher Förderung 2026", "EAG Investitionszuschuss 3. Call"],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "EAG-Fördercall Oktober 2026 für Photovoltaik und Stromspeicher" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

// ---------------------------------------------------------------------------
// Inhalte
// ---------------------------------------------------------------------------

// Einleitung je Phase (Seite wird stündlich neu gerendert)
const HERO_LEAD = {
  vor: "Am 08.10.2026 um 17 Uhr startet die Ticketziehung für den letzten Investitionszuschuss des Jahres für Photovoltaik und Stromspeicher. Das Budget ist knapp, entscheidend ist der erste Abend. Mit Checkliste, Rechner und Ablauf sind Sie rechtzeitig bereit.",
  ticket: "Der letzte Fördercall 2026 für Photovoltaik und Stromspeicher hat begonnen: Tickets gibt es nur am 08.10. ab 17 Uhr, Anträge ab 09.10. um 8 Uhr im EAG-Portal. Checkliste, Rechner und Ablauf helfen bei den letzten Schritten.",
  einreichung: "Der letzte Fördercall 2026 für Photovoltaik und Stromspeicher läuft: Anträge können bis 22.10.2026, 23:59 Uhr im EAG-Portal eingereicht werden – auch ohne Ticket. Checkliste, Rechner und Ablauf helfen bei den letzten Schritten.",
  nach: "Der 3. Fördercall 2026 für Photovoltaik und Stromspeicher ist beendet. Die nächsten Termine veröffentlicht die EAG-Förderabwicklungsstelle. Mit Checkliste, Rechner und Ablauf bereiten Sie Ihr Projekt schon jetzt für den nächsten Call vor.",
};

const ZEITPLAN = [
  { wann: "Jetzt", was: "Vorbereiten", text: "Einspeisezählpunkt, Genehmigungen, Angebot – und das Projekt schon im EAG-Portal anlegen.", jetzt: true },
  { wann: "08.10., 17:00", was: "Ticketziehung", text: "Nur am ersten Tag des Calls. Der Zeitpunkt des Tickets gilt als Einreichzeitpunkt." },
  { wann: "09.10., 08:00", was: "Einreichung öffnet", text: "Förderantrag im EAG-Portal einreichen – mit oder ohne Ticket." },
  { wann: "22.10., 23:59", was: "Call endet", text: "Bis hierher muss der Antrag eingereicht sein, sonst verfällt das Ticket." },
  { wann: "danach", was: "Prüfung & Vertrag", text: "Die Prüfung kann mehrere Wochen dauern. Erst der Fördervertrag ist die Zusage." },
  { wann: "+ 6 bzw. 12 Monate", was: "Inbetriebnahme", text: "Ab Vertragsabschluss: bis 100 kWp 6 Monate, darüber 12 Monate." },
  { wann: "+ 6 Monate", was: "Endabrechnung", text: "Rechnungen, Zahlungsnachweise, Prüfprotokoll, Fotos – danach Auszahlung." },
];

const CHECKLISTE = [
  {
    titel: "Netz & Genehmigung",
    bis: "vor dem Ticket",
    punkte: [
      { id: "zaehlpunkt", titel: "Einspeisezählpunkt vom Netzbetreiber", text: "33-stellig, beginnt mit AT00. Der Bezugszählpunkt gilt nicht. Das Dokument muss Zählpunktinhaber, Anlagenstandort und Netzanschlussleistung zeigen." },
      { id: "genehmigung", titel: "Genehmigungen und Anzeigen", text: "Bau-, elektrizitäts- oder naturschutzrechtliche Anzeigen bzw. Bescheide in erster Instanz müssen bei Ticket und Antrag vorliegen." },
    ],
  },
  {
    titel: "Projekt & Unterlagen",
    bis: "bis 08.10.",
    punkte: [
      { id: "angebot", titel: "Angebot eines befugten Fachbetriebs", text: "Leistung in kWp, Speicher-Nettokapazität und Kosten getrennt nach PV und Speicher. Eigenleistungen werden nicht gefördert." },
      { id: "beschreibung", titel: "Technische Projektbeschreibung", text: "Anbringungsort und -art der Module nach Vorlage der Abwicklungsstelle – keine Produktdatenblätter." },
      { id: "portal", titel: "Im EAG-Portal registrieren und Projekt anlegen", text: "Das Projekt lässt sich schon vor dem Call vollständig erfassen – am Stichtag reichen dann wenige Klicks." },
      { id: "stammdaten", titel: "Daten der Förderwerberin bzw. des Förderwerbers", text: "Privat: exakt wie am Meldezettel. Firma: Firmenbuchnummer und Vertretungsbefugnis, z. B. Firmenbuchauszug." },
    ],
  },
  {
    titel: "Entscheidungen",
    bis: "vor der Einreichung",
    punkte: [
      { id: "europa", titel: "Made in Europe festlegen", text: "+10 % je Komponente (Module, Wechselrichter, Speicher). Nur bei der Einreichung wählbar, nachträglich nicht." },
      { id: "gebot", titel: "Förderbedarf kalkulieren (ab 20 kWp)", text: "In Kategorie C und D entscheidet das Gebot in €/kWp über die Reihung – der Höchstsatz ist selten die beste Wahl." },
      { id: "inbetriebnahme", titel: "Nicht vor dem Antrag einschalten", text: "Bestellen und Montieren ist erlaubt, die Inbetriebnahme aber erst nach dem ersten gültigen Förderantrag." },
    ],
  },
  {
    titel: "Am Call-Tag",
    bis: "08.10., 17 Uhr",
    punkte: [
      { id: "ticket", titel: "Ticket ziehen", text: "Nur über den offiziellen Link auf eag-abwicklungsstelle.at, mit Einspeisezählpunkt und E-Mail-Adresse. Nicht ständig neu laden." },
      { id: "antrag", titel: "Antrag bis 22.10., 23:59 Uhr einreichen", text: "Ab 09.10., 8 Uhr im EAG-Portal. Ohne eingereichten Antrag verfällt das Ticket." },
    ],
  },
];

const FEHLER = [
  { titel: "Bezugs- statt Einspeisezählpunkt", text: "Ticket und Projekt werden über den Einspeisezählpunkt verknüpft. Mit dem Bezugszählpunkt ist kein Antrag möglich." },
  { titel: "Ticket gezogen, Antrag vergessen", text: "Das Ticket ist nur ein Platz in der Reihe. Ohne Antrag bis 22.10., 23:59 Uhr verfällt es." },
  { titel: "Altes Ticket weiterverwenden", text: "Tickets aus früheren Calls gelten nicht – für den Oktober-Call braucht es ein neues." },
  { titel: "Mehrere Tickets für einen Zählpunkt", text: "Es zählt nur das zuletzt gezogene Ticket des Tages – der frühe Platz ist dann weg." },
  { titel: "Genehmigung kommt erst später", text: "Anzeigen und Bescheide müssen beim Ticket bzw. Antrag schon vorliegen, nicht erst bei der Montage." },
  { titel: "Inbetriebnahme vor dem Erstantrag", text: "Der häufigste nicht heilbare Fehler: Wer vor dem ersten gültigen Antrag einschaltet, verliert den Anspruch." },
  { titel: "Frist zur Nachreichung verpasst", text: "Fehlende Unterlagen sind binnen 4 Wochen nachzureichen – sonst gilt der Antrag als zurückgezogen." },
  { titel: "Made in Europe nicht angegeben", text: "Der Bonus muss bei der Einreichung beantragt werden. Nachträglich geht es nicht." },
  { titel: "Speicher zu klein oder nur erweitert", text: "Unter 0,5 kWh je kWp gibt es keinen Speicherzuschuss; die Erweiterung eines bestehenden Speichers ist nie förderfähig." },
  { titel: "Formfehler bei der Abrechnung", text: "Barzahlung, reine Materialrechnungen ohne Montage und Anlagen mit Nullsteuersatz werden nicht gefördert." },
];

const ZIELGRUPPEN = [
  {
    id: "privat",
    titel: "Private",
    untertitel: "Einfamilienhaus, meist Kategorie A oder B",
    bild: { src: "/Images/AT/home/energiegemeinschaft-ort-luftbild.jpg", alt: "Ortschaft mit Photovoltaik auf vielen Hausdächern aus der Luft" },
    punkte: [
      "Bis 10 kWp 150 €/kWp, bis 20 kWp 140 €/kWp – gereiht nach dem Zeitpunkt des Tickets.",
      "Speicher mit 150 €/kWh ab 0,5 kWh je kWp – bei 8 kWp also ab 4 kWh.",
      "Ohne Vorsteuerabzug zählen für den 30-%-Deckel die Bruttokosten.",
    ],
    cta: { label: "Anfrage fürs Eigenheim", href: "/angebot?objekt=privat" },
  },
  {
    id: "gewerbe",
    titel: "Gewerbe & Industrie",
    untertitel: "Betriebsdach, meist Kategorie C oder D",
    bild: { src: "/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg", alt: "Photovoltaikanlagen auf Gewerbedächern in Dornbirn" },
    punkte: [
      "Ab 20 kWp zählt das Gebot: Wer weniger Förderung je kWp beantragt, wird vorgereiht.",
      "Firmenbuchnummer und Vertretungsbefugnis vorab bereitlegen.",
      "Kategorie D (über 100 kWp): keine zusätzliche Landes- oder Gemeindeförderung.",
    ],
    cta: { label: "Anfrage für den Betrieb", href: "/angebot?objekt=gewerbe" },
  },
  {
    id: "landwirtschaft",
    titel: "Landwirtschaft",
    untertitel: "Stall, Maschinenhalle oder Fläche",
    bild: { src: "/Images/AT/loesungen/agri-pv-obstbau.jpg", alt: "Agri-Photovoltaikanlage über einer Apfelanlage" },
    punkte: [
      "Auf Stall- und Hallendächern kein Abschlag, wenn das Gebäude mindestens 18 Monate vor dem Antrag fertig war.",
      "Freifläche auf Agrarland oder Grünland: −25 %, Modulunterkante mind. 80 cm, Reihenabstand mind. 2 m.",
      "Agri-PV mit mind. 75 % landwirtschaftlicher Nutzung ohne Abschlag, vertikal oder ab 2 m Höhe +30 %.",
    ],
    cta: { label: "Anfrage für den Hof", href: "/angebot?objekt=landwirtschaft" },
  },
];

const FAQ = [
  {
    q: "Wann ist der EAG-Fördercall im Oktober 2026?",
    a: "Der 3. und letzte Fördercall 2026 für Photovoltaik und Speicher läuft vom 08.10.2026 bis 22.10.2026. Die Ticketziehung startet am 08.10.2026 um 17 Uhr, Förderanträge können ab 09.10.2026 um 8 Uhr im EAG-Portal eingereicht werden. Der Call endet am 22.10.2026 um 23:59 Uhr.",
  },
  {
    q: "Wie viel Budget gibt es im Oktober-Call?",
    a: "Insgesamt 8 Mio. €, jeweils 2 Mio. € für die Kategorien A, B, C und D. Zum Vergleich: Im 2. Call 2026 wurden laut EAG-Förderabwicklungsstelle fast 28.000 Anträge eingereicht, aber nur knapp 3.000 berücksichtigt.",
  },
  {
    q: "Was bringt die Ticketziehung?",
    a: "Der Zeitpunkt des Tickets gilt als Einreichzeitpunkt Ihres Projekts. In Kategorie A und B wird danach gereiht, in C und D nach dem niedrigsten Förderbedarf je kWp – bei gleichem Gebot entscheidet das Ticket. Tickets gibt es nur am ersten Tag des Calls ab 17 Uhr, eines je Einspeisezählpunkt. Wer kein Ticket zieht, kann trotzdem bis Call-Ende einreichen; dann zählt der Zeitpunkt der Einreichung.",
  },
  {
    q: "Welche Unterlagen brauche ich für den Antrag?",
    a: "Den Nachweis über den Netzzugang mit Einspeisezählpunkt (33-stellig, beginnend mit AT00), Zählpunktinhaber, Anlagenstandort und Netzanschlussleistung, alle nötigen Genehmigungen und Anzeigen sowie eine technische Projektbeschreibung mit Anbringungsort und -art. Firmen laden zusätzlich die Vertretungsbefugnis hoch.",
  },
  {
    q: "Darf ich die PV-Anlage schon vor dem Call bestellen oder bauen?",
    a: "Ja. Bestellung, Anzahlung und Montage vor dem Antrag sind erlaubt, sofern die Arbeiten nach dem 21.04.2022 begonnen haben. In Betrieb gehen darf die Anlage aber erst, nachdem der erste gültige Förderantrag eingereicht ist.",
  },
  {
    q: "Mein Antrag im Juni wurde mangels Budget abgelehnt – was nun?",
    a: "Sie können dasselbe Projekt im Oktober-Call erneut einreichen und brauchen dafür ein neues Ticket. War Ihr erster Antrag gültig und vor der Inbetriebnahme gestellt, darf die Anlage inzwischen sogar laufen. Wird die Anlage vergrößert, gilt sie als neues Projekt – dann darf sie noch nicht in Betrieb sein.",
  },
  {
    q: "Wie hoch ist die Förderung für einen Stromspeicher?",
    a: "150 €/kWh nutzbarer Kapazität, höchstens 50 kWh je Anlage – nur gemeinsam mit einer neuen oder erweiterten PV-Anlage. Der Speicher muss mindestens 0,5 kWh je kWp der beantragten PV-Leistung haben. Mit Made-in-Europe-Speicher erhöht sich der Speicherzuschuss um 10 %.",
  },
  {
    q: "Kann ich den EAG-Zuschuss mit einer Landesförderung kombinieren?",
    a: "Bis 100 kWp (Kategorie A, B und C) und bei innovativen Anlagen ja, bis zu den beihilferechtlichen Höchstgrenzen. In Kategorie D ist keine weitere Förderung von Bund, Land oder Gemeinde erlaubt. Die Photovoltaik- und Speicherprogramme des Klima- und Energiefonds schließen eine Kombination aus.",
  },
  {
    q: "Wann wird der Zuschuss ausbezahlt?",
    a: "Nach der Prüfung erhalten Sie den Fördervertrag – erst er ist die Zusage. Ab Vertragsabschluss haben Sie 6 Monate (bis 100 kWp) bzw. 12 Monate für die Inbetriebnahme und danach 6 Monate für die Endabrechnung. Ausbezahlt wird nach positiver Prüfung der Endabrechnung und Registrierung der Anlage in der Herkunftsnachweisdatenbank der E-Control.",
  },
  {
    q: "Gilt für PV-Anlagen noch der Nullsteuersatz?",
    a: "Nein. Der Umsatzsteuersatz von 0 % für PV bis 35 kWp galt von 01.01.2024 bis 31.03.2025 (Verträge vor dem 07.03.2025: Lieferung bis 31.12.2025). Seither gilt wieder 20 %. Anlagen, die mit Nullsteuersatz gekauft wurden, können keinen Investitionszuschuss mehr erhalten.",
  },
];

const QUELLEN = [
  { label: "EAG-Abwicklungsstelle (OeMAG) – 3. Fördercall 2026 für Photovoltaik und Speicher, Kat. A–D", url: "https://www.eag-abwicklungsstelle.at/termin/3-foerdercall-2026-fuer-photovoltaik-und-speicher-kat-a-d/" },
  { label: "EAG-Abwicklungsstelle – Wichtige Informationen zur Ticketziehung (21.09.2026)", url: "https://www.eag-abwicklungsstelle.at/artikel/wichtige-informationen-zur-ticketziehung/" },
  { label: "EAG-Abwicklungsstelle – FAQs 2026, Leitfaden Ticketziehung und Projekterstellung", url: "https://www.eag-abwicklungsstelle.at/wissen/wichtige-unterlagen-fuer-die-pv-antragstellung/" },
  { label: "EAG-Abwicklungsstelle – Investitionszuschuss Photovoltaik & Speicher", url: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
  { label: "EAG-Abwicklungsstelle – Abschluss des 2. Fördercalls 2026 (09.07.2026)", url: "https://www.eag-abwicklungsstelle.at/artikel/abschluss-des-2-foerdercall-2026-investitionszuschuesse-photovoltaik/" },
  { label: "EAG-Abwicklungsstelle – Abschluss des 1. Fördercalls 2026 (09.06.2026)", url: "https://www.eag-abwicklungsstelle.at/artikel/1-foerdercall-2026-investititionszuschuesse-photovoltaik-erfolgreich-abgeschlossen/" },
  { label: "BMWET – Presseaussendung zum EAG-Fördercall (14.06.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/Zweiter-EAG-F%C3%B6rdercall.html" },
  { label: "WKO – EAG-Investitionszuschuss 2026 für Photovoltaik und Stromspeicher", url: "https://www.wko.at/foerderungen/eag-investitionszuschuss-2026-photovoltaik-stromspeicher" },
  { label: "LK Kärnten – EAG-Investitionszuschuss: letzter Fördercall 2026", url: "https://ktn.lko.at/eag-investitionszuschuss-letzter-f%C3%B6rdercall-2026+2400+4457200" },
  { label: "BMF – Steuersatz für Photovoltaikmodule (Nullsteuersatz)", url: "https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/umsatzsteuer/informationen/steuersatz-fuer-photovoltaikmodule.html" },
  ...EAG_IZ.quellen.slice(0, 2),
];

// ---------------------------------------------------------------------------

export default function EagFoerdercall() {
  const jetzt = Date.now();
  const laender = alleBundeslaender();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "EAG-Fördercall Oktober 2026 für Photovoltaik und Stromspeicher",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: {
      "@type": "GovernmentService",
      name: "EAG-Investitionszuschuss für Photovoltaik und Stromspeicher – 3. Fördercall 2026",
      serviceType: "Investitionszuschuss",
      provider: { "@type": "Organization", name: "OeMAG Abwicklungsstelle für Ökostrom AG", url: FOERDERCALL.abwicklungsstelle },
      areaServed: { "@type": "Country", name: "Österreich" },
      availableChannel: { "@type": "ServiceChannel", serviceUrl: FOERDERCALL.portal, name: "EAG-Portal" },
    },
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Bundesförderung", href: "/forderungen/bundesfoerderung" }, { name: "EAG-Fördercall Oktober 2026" }]}
        eyebrow={`3. EAG-Fördercall 2026 · Stand ${STAND.label}`}
        title={<>EAG-Fördercall Oktober 2026: <span className="ov-text-gradient-light">jetzt vorbereiten</span></>}
        lead={HERO_LEAD[callPhase(jetzt)]}
        image={{ src: "/Images/AT/home/hero-gewerbedach-luftbild.jpg", alt: "Montage einer Photovoltaikanlage auf dem Flachdach einer Industriehalle, Luftbild", position: "center 55%" }}
        points={["Ticketziehung 08.10., 17 Uhr", "8 Mio. € Budget", "Speicher 150 €/kWh", "Für Private, Betriebe, Höfe"]}
        actions={[
          { label: "Einreichung vorbereiten", href: "/angebot" },
          { label: "Zuschuss berechnen", href: "#rechner", icon: Calculator },
        ]}
      >
        <CallStatus startMs={jetzt} className="ov-hero-in mt-8 max-w-md" />
      </PageHero>

      <KennzahlenBand
        items={[
          { text: "08.10.", label: "Ticketziehung ab 17 Uhr, Einreichung ab 09.10." },
          { value: 8, suffix: " Mio. €", label: "Budget, je 2 Mio. € in Kategorie A–D" },
          { value: 150, suffix: " €/kWp", label: "Kategorie A bis 10 kWp, fixer Satz" },
          { value: 150, suffix: " €/kWh", label: "Stromspeicher, gefördert bis 50 kWh" },
        ]}
      />

      {/* Zeitplan + Erinnerung */}
      <Section tone="white" space="md" id="zeitplan" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Zeitplan"
            title="Vom Zählpunkt bis zur Auszahlung"
            lead="Was vor dem 08.10. fertig sein muss und welche Fristen nach der Zusage laufen. Alle Uhrzeiten in österreichischer Sommerzeit."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Termine laut EAG-Abwicklungsstelle, {STAND.label}</StandPille>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {ZEITPLAN.map((z, i) => (
            <Reveal as="li" key={z.was} delay={i * 60} className={`flex ${z.jetzt ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <div className={`relative flex w-full flex-col rounded-3xl p-5 ring-1 ${z.jetzt ? "bg-navy-950 text-white ring-navy-950" : i < 4 ? "bg-ov-50 ring-ov-100" : "bg-sand-50 ring-ink-200/60"}`}>
                <span aria-hidden="true" className={`font-display text-[13px] font-extrabold ${z.jetzt ? "text-ov-300" : "text-ink-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                <p className={`ov-num mt-2 font-display text-[18px] font-extrabold leading-tight ${z.jetzt ? "text-white" : "text-ink-900"}`}>{z.wann}</p>
                <p className={`mt-1 text-[14px] font-semibold ${z.jetzt ? "text-ov-300" : "text-ov-700"}`}>{z.was}</p>
                <p className={`mt-2 text-[13.5px] leading-relaxed ${z.jetzt ? "text-white/70" : "text-ink-600"}`}>{z.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                <CalendarPlus aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Termine in Ihren Kalender
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-600">Ticketziehung und Call-Ende mit Erinnerung – für Outlook, Google und Apple.</p>
            </div>
            <a href={`${PFAD}/termin.ics`} download className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy-950 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-navy-800">
              <CalendarClock aria-hidden="true" className="h-4 w-4" />
              Kalenderdatei laden
            </a>
          </div>
          <div className="min-h-[8.5rem] rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
            <PushOptIn thema="foerderung" />
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">Mit dem Thema „Förderungen & Gesetzesänderungen“ erhalten Sie unsere Hinweise zu Fördercalls – auch zum Start am 08.10.</p>
          </div>
        </div>
      </Section>

      {/* Checkliste */}
      <Section tone="sand" space="md" id="checkliste" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Checkliste"
          title={<>Was bis zum Call-Start <span className="ov-text-gradient">fertig sein muss</span></>}
          lead="Elf Punkte, an denen Anträge in der Praxis hängen bleiben. Haken Sie ab, was erledigt ist – der Stand bleibt in Ihrem Browser."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <VorbereitungsCheckliste gruppen={CHECKLISTE} />
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[14.5px] leading-relaxed text-ink-600">
          Welche Anzeige oder Bewilligung Ihr Bundesland verlangt, zeigt die Übersicht <Link href="/forderungen/baurecht" className={LINK}>Baurecht für PV-Anlagen</Link>. Den Einspeisezählpunkt beantragen wir für unsere Kundinnen und Kunden beim Netzbetreiber.
        </p>
      </Section>

      {/* Nachfrage */}
      <Section tone="navy" space="md" className="ov-noise isolate overflow-hidden">
        <Glow />
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Warum der erste Abend zählt"
            title="Viele Anträge, wenig Budget"
            lead="Die ersten beiden Calls 2026 waren um ein Vielfaches überzeichnet. Im Oktober stehen nur 8 Mio. € zur Verfügung – in Kategorie A und B entscheidet die Minute der Ticketziehung, in C und D ein gut kalkuliertes Gebot."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { call: "1. Call 2026", antraege: "fast 29.000", gefoerdert: "über 12.500", quote: 43 },
              { call: "2. Call 2026", antraege: "fast 28.000", gefoerdert: "knapp 3.000", quote: 11 },
              { call: "3. Call · Oktober", quote: null },
            ].map((c, i) => (
              <Reveal key={c.call} delay={i * 90} className={`rounded-3xl p-5 ${c.quote === null ? "bg-ov-500/15 ring-1 ring-ov-400/40" : "ov-glass"}`}>
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/55">{c.call}</p>
                {c.quote !== null ? (
                  <>
                    <p className="ov-num mt-3 font-display text-[26px] font-extrabold leading-none text-white">{c.antraege}</p>
                    <p className="mt-1 text-[13px] text-white/60">Anträge</p>
                    <span aria-hidden="true" className="mt-4 block h-2 overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full rounded-full bg-gradient-to-r from-ov-300 to-ov-500" style={{ width: `${c.quote}%` }} />
                    </span>
                    <p className="mt-2 text-[13.5px] text-white/75"><strong className="text-white">{c.gefoerdert}</strong> gefördert</p>
                  </>
                ) : (
                  <>
                    <p className="ov-num mt-3 font-display text-[26px] font-extrabold leading-none text-white">8 Mio. €</p>
                    <p className="mt-1 text-[13px] text-white/60">je 2 Mio. € in A, B, C, D</p>
                    <p className="mt-4 text-[13.5px] leading-relaxed text-white/75">Wer abgelehnt wurde, kann im Oktober neu einreichen – mit neuem Ticket.</p>
                  </>
                )}
              </Reveal>
            ))}
          </div>
        </div>
        <p className="relative mt-6 text-[12.5px] text-white/45">Zahlen laut Abschlussmeldungen der EAG-Förderabwicklungsstelle vom 09.06. und 09.07.2026.</p>
      </Section>

      {/* Rechner */}
      <Section tone="white" space="md" id="rechner" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Förder-Schnellrechner"
          title={<>Wie viel bringt der <span className="ov-text-gradient">Oktober-Call</span> Ihrer Anlage?</>}
          lead="PV-Leistung und Speicher eingeben – der Rechner ordnet die Kategorie zu und rechnet mit den offiziellen Sätzen des 3. Calls, inklusive Speicherregeln und 30-%-Deckel."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <SchnellRechner />
        </Reveal>
      </Section>

      {/* Zielgruppen */}
      <Section tone="sand" space="md" id="zielgruppen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Private, Betriebe, Landwirtschaft"
          title="Worauf es für Sie beim Call ankommt"
          lead="Gleiche Förderung, unterschiedliche Stolpersteine: Für das Eigenheim zählt die Minute, für den Betrieb das Gebot, für den Hof die Fläche."
          className="mb-10"
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {ZIELGRUPPEN.map((z, i) => (
            <Reveal as="li" key={z.id} delay={i * 90} className="flex">
              <article className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={z.bild.src} alt={z.bild.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
                  <p className="absolute bottom-4 left-5 right-5 font-display text-[22px] font-extrabold text-white">{z.titel}</p>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[13.5px] font-semibold text-ink-500">{z.untertitel}</p>
                  <Checkliste className="mt-4" items={z.punkte} />
                  <Link href={z.cta.href} className="group/link mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                    {z.cta.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-[14.5px] leading-relaxed text-ink-600">
          Mehr zu den Sonderregeln: <Link href="/agri-pv" className={LINK}>Agri-PV</Link>, <Link href="/freiflaechen-photovoltaik" className={LINK}>Freiflächen-Photovoltaik</Link>, <Link href="/gewerbe" className={LINK}>PV für Gewerbe</Link> und <Link href="/landwirtschaft" className={LINK}>PV für die Landwirtschaft</Link>.
        </p>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="md" id="ablauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Ablauf Schritt für Schritt"
          title="So läuft die Einreichung im Oktober"
          lead="Projekt, Ticket, Antrag: Ein Ticket oder ein angelegtes Projekt ist noch kein Förderantrag. Erst die Einreichung im EAG-Portal zählt."
          className="mb-10 md:mb-12"
        />
        <Prozess
          name="EAG-Investitionszuschuss im 3. Fördercall 2026 beantragen"
          beschreibung={`Ablauf für Photovoltaik und Stromspeicher im Fördercall vom ${FOERDERCALL.zeitraum}, Stand ${STAND.label}.`}
          schritte={[
            { icon: <Wrench />, name: "Anlage planen und Angebot einholen", text: "Leistung, Speicher und Kosten festlegen – getrennt nach PV und Speicher. Errichten muss ein befugtes Unternehmen." },
            { icon: <PlugZap />, name: "Einspeisezählpunkt und Genehmigungen", text: "Netzzugang beim Netzbetreiber beantragen (bis 20 kW genügt eine Anzeige nach § 96 ElWG) und nötige Anzeigen bzw. Bewilligungen einholen." },
            { icon: <UserRound />, name: "Im EAG-Portal registrieren, Projekt anlegen", text: "Förderwerber, Zählpunkt, Standort, Leistung, Speicher-Nettokapazität, Kostenplan und Dokumente erfassen – schon vor dem Call möglich." },
            { icon: <Ticket />, name: "08.10., ab 17 Uhr: Ticket ziehen", text: "Über die Vorschaltseite auf eag-abwicklungsstelle.at mit Einspeisezählpunkt und E-Mail-Adresse. Die Bestätigung kommt per Mail, bei hohem Andrang auch verzögert." },
            { icon: <Send />, name: "Ab 09.10., 8 Uhr: Antrag einreichen", text: "Projekt über „Zur Einreichung“ dem Förderprogramm zuordnen, Made in Europe angeben, bei C/D den Förderbedarf eintragen – spätestens 22.10., 23:59 Uhr." },
            { icon: <FileSignature />, name: "Prüfung und Fördervertrag", text: "Fehlende Unterlagen binnen 4 Wochen nachreichen. Der Fördervertrag im EAG-Portal ist die Zusage – vor Ende des Calls gibt es keine Auskunft zur Reihung." },
            { icon: <Zap />, name: "Errichten und in Betrieb nehmen", text: "Bis 100 kWp binnen 6 Monaten (zweimal um bis zu 9 Monate verlängerbar), darüber binnen 12 Monaten (einmal um bis zu 12 Monate)." },
            { icon: <Receipt />, name: "Endabrechnung und Auszahlung", text: "Spätestens 6 Monate nach Ende der Inbetriebnahmefrist: Rechnungen, Zahlungsnachweise, Prüfprotokoll, Fotos. Auszahlung nach Prüfung und Registrierung in der Herkunftsnachweisdatenbank." },
          ]}
        />
        <Fachdetails className="mt-10" titel="Für Technik & Einkauf: Förderfähige Kosten und Kategorien" untertitel="Was in die Kostenbasis darf und was nicht">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-display text-[17px] font-bold text-ink-900">Kategorien im 3. Call</p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-ink-700">
                {EAG_IZ.kategorien.map((k) => (
                  <li key={k.id}>
                    <strong className="text-ink-900">Kategorie {k.id}</strong> ({k.leistung}): {k.satz}, Reihung {k.reihung} – Budget 2 Mio. €
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-600">Maßgeblich ist die beantragte Leistung – bei einer Erweiterung nur der neue Anlagenteil. Über 1.000 kWp wird anteilig bis 1.000 kWp gefördert.</p>
            </div>
            <div>
              <p className="font-display text-[17px] font-bold text-ink-900">Nicht förderfähig</p>
              <Checkliste
                variante="nein"
                className="mt-3"
                items={["Eigenleistungen und reine Materialrechnungen ohne Montage", "Dacheindeckung, Grundstücks- und Finanzierungskosten", "Steuern und Gebühren – bei Vorsteuerabzug zählen die Nettokosten", "Skonti, Rabatte, Entsorgung, Displays", "PVT-Hybridmodule und Repowering (Modultausch ohne Erweiterung)"]}
              />
            </div>
          </div>
        </Fachdetails>
      </Section>

      {/* Häufige Fehler */}
      <Section tone="navy" space="md" id="fehler" className="ov-noise isolate scroll-mt-24 overflow-hidden">
        <Glow />
        <div className="relative">
          <SectionHeading dark eyebrow="Häufige Fehler" title="Woran Anträge im Call scheitern" lead="Die meisten Fehler passieren vor der Einreichung – und lassen sich nachträglich nicht mehr korrigieren." className="mb-10" />
          <ul className="grid gap-3 md:grid-cols-2">
            {FEHLER.map((f, i) => (
              <Reveal as="li" key={f.titel} delay={(i % 4) * 60} className="ov-glass flex gap-4 rounded-2xl p-5">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-[14px] font-extrabold text-sun-400">{i + 1}</span>
                <div>
                  <p className="font-semibold leading-snug text-white">{f.titel}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/65">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-[14px] leading-relaxed text-white/60">
            Tipp der Abwicklungsstelle: Ticket nur über den Link auf der offiziellen Website ziehen, nicht über Links aus Foren oder sozialen Medien. Das System behandelt jede IP-Adresse als einen Nutzer – ständiges Neuladen kann den Zugang vorübergehend sperren.
          </p>
        </div>
      </Section>

      {/* Kombination */}
      <Section tone="sand" space="md" id="kombination" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Kombination" title="EAG-Zuschuss plus Landesförderung" lead="Bis 100 kWp darf der Bundeszuschuss mit Programmen von Land und Gemeinde kombiniert werden – bis zu den beihilferechtlichen Höchstgrenzen." />
            <div className="mt-7 space-y-3">
              <Checkliste items={[{ title: "Kategorie A, B, C und innovative PV", text: "kombinierbar; weitere Förderungen im EAG-Portal angeben" }, { title: "Förderbedingungen des Landes prüfen", text: "manche Länder verlangen den Antrag vor der Bestellung" }]} />
              <Checkliste variante="nein" items={[{ title: "Kategorie D (über 100 kWp)", text: "keine zusätzliche Förderung von Bund, Land oder Gemeinde" }, { title: "Klima- und Energiefonds", text: "dessen PV- und Speicherprogramme schließen den EAG-Zuschuss aus" }]} />
            </div>
            <div className="mt-7 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                <BadgeEuro aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Umsatzsteuer und Nullsteuersatz
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                {STEUER.ust} Anlagen mit Nullsteuersatz erhalten keinen Investitionszuschuss. Für den 30-%-Deckel zählen ohne Vorsteuerabzug die Brutto-, sonst die Nettokosten. Betriebe nutzen zusätzlich den <Link href="/forderungen/steuerlich" className={LINK}>Investitionsfreibetrag</Link>.
              </p>
            </div>
          </div>
          <div>
            <h3 className="ov-h3 text-ink-900">Landesförderung in Ihrem Bundesland</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {laender.map((l) => (
                <li key={l.key} className="flex">
                  <Link href={landesPfad(l.key)} className="group ov-card-hover flex w-full flex-col rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 hover:ring-ov-200">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[16.5px] font-bold text-ink-900">{l.name}</span>
                      <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11.5px] font-semibold text-ink-600">{FOERDERARTEN[l.foerderart]?.kurz}</span>
                    </span>
                    <span className="mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-ink-600">{l.kurz}</span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[13.5px] font-semibold text-ov-700">
                      Programme ansehen <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                    </span>
                  </Link>
                </li>
              ))}
              <li className="flex">
                <Link href="/foerdercheck" className="group flex w-full flex-col justify-center rounded-2xl bg-navy-950 p-4 text-white">
                  <ListChecks aria-hidden="true" className="h-5 w-5 text-ov-300" />
                  <span className="mt-2 font-display text-[16.5px] font-bold">Förder-Check</span>
                  <span className="mt-1 text-[13.5px] leading-relaxed text-white/65">Alle Programme für Ihren Standort in 30 Sekunden.</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="EAG-Fördercall Oktober 2026 – kurz beantwortet" lead={`Stand ${STAND.label}. Verbindlich sind die Vorgaben der EAG-Förderabwicklungsstelle (OeMAG).`}>
            <Link href="/ratgeber/eag-investitionszuschuss" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Ratgeber: EAG-Investitionszuschuss Schritt für Schritt
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={QUELLEN}
          hinweis="Orientierung ohne Gewähr, keine Rechts- oder Steuerberatung. Termine, Budgets und Sätze stammen aus den Veröffentlichungen der EAG-Förderabwicklungsstelle; Änderungen kurz vor oder während des Calls sind möglich."
        />
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Fördercall Oktober 2026"
        title="Einreichung mit Ökovolt vorbereiten."
        text="Wir planen Ihre Anlage, beantragen Einspeisezählpunkt und Netzzugang, stellen die Unterlagen für das EAG-Portal zusammen und kalkulieren in Kategorie C und D Ihr Gebot – damit Sie am 08.10. um 17 Uhr bereit sind."
        primary={{ label: "Einreichung vorbereiten", href: "/angebot" }}
        secondary={{ label: "Beratungstermin buchen", href: "/termin", icon: CalendarClock }}
      />
      <Bildnachweis items={nachweise("gewerbeDornbirn", "agriObst")} className="-mt-2" />
      <p className="ov-container -mt-4 pb-6 text-[12px] leading-relaxed text-ink-400">
        Weitere Bilder: Ortschaft Halbarting (Kematen an der Krems), Luftbild: Isiwal,{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer license" className="underline decoration-ink-300 hover:text-ink-600">
          CC BY-SA 4.0
        </a>{" "}
        · Kopfbild: Ökovolt
      </p>
    </div>
  );
}
