// src/app/forderungen/richtlinien/page.js
//
// Normen, Elektrizitätsrecht (EAG, ElWG) und Netzanschluss-Prozess in Österreich.

import Link from "next/link";
import { ArrowUpRight, Cable, ClipboardCheck, FileSignature, Gauge, PlugZap, Power, Radio, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import NormenExplorer from "@/components/Forderungen/Richtlinen/NormenExplorer";
import { Hinweis, HowTo, Kennzahlen, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { ELWG, NETZZUTRITT, STAND } from "@/components/Forderungen/Shared/bund";
import { alleBundeslaender } from "@/data/bundeslaender";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/forderungen/richtlinien`;
const TITLE = "PV-Normen & Netzanschluss: TOR, OVE, ElWG | Ökovolt";
const DESCRIPTION = "Normen und Netzanschluss für PV in Österreich: TOR Erzeuger Typ A–D, ÖVE/ÖNORM E 8101, OVE R 11-1, Schneelast B 1991-1-3, ElWG 2026 – mit Netzbetreibern.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["TOR Erzeuger", "Netzanschluss Photovoltaik Österreich", "ElWG Photovoltaik", "OVE R 11-1", "ÖVE/ÖNORM E 8101", "ÖNORM B 1991-1-3 Schneelast", "Netzzugangsantrag PV"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Normen und Netzanschluss für Photovoltaik in Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const TYPEN = [
  { typ: "Typ A", leistung: "ab 0,8 kW bis unter 250 kW", netz: "meist Netzebene 7, größere Anlagen 6", folgen: "Standard-Einheitenzertifikate, Blindleistung nach Vorgabe (z. B. Q(U) oder cos φ), Wirkleistungsreduktion" },
  { typ: "Typ B", leistung: "250 kW bis unter 35 MW", netz: "Netzebene 6/5", folgen: "Anlagenzertifikat bzw. Nachweise, Fernsteuerbarkeit, Parkregler für Blindleistung und Wirkleistung" },
  { typ: "Typ C", leistung: "35 MW bis unter 50 MW", netz: "Netzebene 5/4", folgen: "erweiterte Frequenz- und Spannungsregelung, Simulationsmodelle" },
  { typ: "Typ D", leistung: "ab 50 MW oder Anschluss ab 110 kV", netz: "Netzebene 3 und höher", folgen: "volle Anforderungen der Übertragungsnetzbetreiber (APG)" },
];

const FAQ = [
  {
    q: "Welche Normen gelten für PV-Anlagen in Österreich?",
    a: "Verbindlich für die Installation ist die ÖVE/ÖNORM E 8101 (über die Elektrotechnikverordnung 2020), für Prüfung und Dokumentation die ÖVE/ÖNORM EN 62446-1. Statik richtet sich nach ÖNORM B 1991-1-3 (Schnee) und B 1991-1-4 (Wind), der Brandschutz nach OIB-Richtlinie 2 und der OVE-Richtlinie R 11-1. Für den Netzanschluss gelten die TOR Erzeuger der E-Control und die Technischen Anschlussbedingungen des Netzbetreibers.",
  },
  {
    q: "Was sind die TOR Erzeuger Typ A, B, C und D?",
    a: "Die Technischen und organisatorischen Regeln der E-Control teilen Erzeugungsanlagen nach Leistung ein: Typ A ab 0,8 kW bis unter 250 kW, Typ B bis unter 35 MW, Typ C bis unter 50 MW, Typ D ab 50 MW oder ab 110 kV Anschlussspannung. Je höher der Typ, desto mehr Nachweise, Regelfähigkeit und Fernsteuerbarkeit verlangt der Netzbetreiber.",
  },
  {
    q: "Wie lange dauert der Netzanschluss einer PV-Anlage?",
    a: "Bis 20 kW genügt nach § 96 ElWG eine Anzeige; der Netzbetreiber kann nur binnen 4 Wochen aus Sicherheitsgründen widersprechen. Größere Anlagen durchlaufen eine Netzverträglichkeitsprüfung, deren Dauer vom Netzbetreiber und der Netzsituation abhängt. Bei Engpässen sind flexible Netzzugangsverträge mit befristeter Einspeisebeschränkung möglich.",
  },
  {
    q: "Was ändert das ElWG für PV-Betreiber?",
    a: "Das Elektrizitätswirtschaftsgesetz (BGBl. I Nr. 91/2025) gilt seit 24.12.2025 und tritt gestaffelt in Kraft. Wichtig für Betreiber: Netzbetreiber dürfen neue Anlagen auf 70 % der Modulleistung kappen, ab 01.10.2026 gelten neue Regeln für Energiegemeinschaften und Peer-to-Peer-Verträge, und ab 01.01.2027 zahlen Einspeiser über 20 kW einen Infrastrukturbeitrag von höchstens 0,05 ct/kWh.",
  },
  {
    q: "Wie ermittle ich die Schneelast für eine PV-Anlage?",
    a: "Seit ÖNORM B 1991-1-3:2022 gibt es keine Schneelastzonen mit Seehöhenformel mehr. Die charakteristische Schneelast steht in einer Rasterkarte mit 50 × 50 m Auflösung, abrufbar über HORA bzw. eHORA. Unser Standort-Check liefert Schnee, Wind und Hagel für Ihre Adresse.",
  },
  {
    q: "Brauche ich für eine PV-Anlage einen Parkregler?",
    a: "Ab Typ B (250 kW) verlangen die Netzbetreiber in der Regel einen Park- bzw. EZA-Regler, der Blindleistung und Wirkleistung am Netzanschlusspunkt nach Vorgabe regelt und fernsteuerbar ist. Ökovolt setzt dafür einen selbst entwickelten Parkregler und eigene Fernwartungs- und SCADA-Systeme ein.",
  },
];

export default function Richtlinien() {
  const laender = alleBundeslaender();
  const netze = laender.map((l) => ({
    land: l.name,
    netz: (
      <span className="flex flex-wrap gap-x-4 gap-y-1">
        {l.netzbetreiber.map((n) => (
          <a key={n.name} href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
            {n.name}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(externer Link, neues Fenster)</span>
          </a>
        ))}
      </span>
    ),
    el: l.recht.elektrizitaet,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Normen, Elektrizitätsrecht und Netzanschluss für Photovoltaik in Österreich",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Richtlinien & Netzanschluss" }]}
        eyebrow={`Normen · ElWG · TOR · Stand ${STAND.kurz}`}
        title={<>Normen und Netzanschluss für <span className="ov-text-gradient-light">Photovoltaik in Österreich</span></>}
        lead="Welche Normen gelten, was die TOR Erzeuger verlangen und wie der Netzanschluss bei Netz Oberösterreich, Wiener Netze oder TINETZ abläuft – für Technik, Einkauf und Geschäftsführung, mit dem Rechtsstand nach ElWG."
        points={["TOR Erzeuger Typ A–D", "ÖVE/ÖNORM E 8101 & EN 62446", "Schnee, Wind, Hagel", "Netzanschluss in 7 Schritten"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Zum Netzanschluss", href: "#netzanschluss", icon: PlugZap },
        ]}
      />

      <Kennzahlen
        items={[
          { wert: "20 kW", label: "Netzanschluss auf Anzeige (§ 96 ElWG)" },
          { wert: "70 %", label: "mögliche Spitzenkappung bei Neuanlagen" },
          { wert: "250 kW", label: "Grenze TOR Typ A zu Typ B" },
          { wert: "01.10.2026", label: "ElWG-Regeln für Energiegemeinschaften" },
        ]}
      />

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Normen-Explorer"
          title="Die wichtigsten Regelwerke nach Projektphase"
          lead="Von der Statik bis zur Wiederholungsprüfung. Wo eine Ausgabe nicht an der Primärquelle belegt ist, steht der Prüfvermerk."
          align="center"
          className="mb-10"
        />
        <NormenExplorer />
      </Section>

      <Section tone="white" space="lg" id="tor">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="TOR Erzeuger"
            title="Anlagentypen A bis D – was der Netzbetreiber verlangt"
            lead="Die Typisierung folgt der EU-Verordnung für Netzanschlussbestimmungen von Stromerzeugern (RfG) mit den österreichischen Schwellen der E-Control."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Schwellen laut E-Control</StandPille>
        </div>
        <Reveal>
          <Tabelle
            caption="TOR Erzeuger – Anlagentypen in Österreich"
            spalten={[
              { key: "typ", label: "Typ", breite: "w-[10%]" },
              { key: "leistung", label: "Maximalkapazität" },
              { key: "netz", label: "Typische Netzebene" },
              { key: "folgen", label: "Was das bedeutet" },
            ]}
            zeilen={TYPEN}
          />
        </Reveal>
        <p className="mt-4 text-[13px] text-ink-500">Netzebenen als Richtwert; maßgeblich ist der vom Netzbetreiber festgelegte Anschlusspunkt. Aktuelle Fassung der TOR: e-control.at, Stand 09/2026 bitte dort prüfen.</p>
        <Hinweis titel="Parkregler aus eigener Entwicklung" className="mt-8">
          Für Anlagen ab Typ B setzen wir unseren selbst entwickelten Parkregler (EZA-Regler) ein – mit eigener Fernwartung und SCADA. Wie Blindleistung Q(U), cos φ und Wirkleistungsbegrenzung geregelt werden, erklärt der Ratgeber{" "}
          <Link href="/ratgeber/eza-regler-parkregler" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">EZA-Regler und Parkregler</Link>, die Netzanschlussregeln der Ratgeber{" "}
          <Link href="/ratgeber/tor-erzeuger-netzanschluss" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">TOR Erzeuger und Netzanschluss</Link>.
        </Hinweis>
      </Section>

      <Section tone="sand" space="lg" id="netzanschluss" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Netzanschluss in 7 Schritten"
            title="Vom Netzzugangsantrag bis zum aktiven Einspeisezählpunkt"
            lead="Der Netzanschluss gehört an den Anfang des Projekts: Die Bestätigung der Anschlussmöglichkeit ist Voraussetzung für den EAG-Förderantrag."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <HowTo
            name="Netzanschluss einer Photovoltaikanlage in Österreich"
            beschreibung={`Ablauf beim Verteilernetzbetreiber nach ElWG und TOR, Stand ${STAND.label}.`}
            schritte={[
              { icon: Gauge, name: "Lastgang und Anlagengröße festlegen", text: "Aus Viertelstundenwerten des Smart Meters ergeben sich Eigenverbrauch, Speichergröße und die sinnvolle Einspeiseleistung." },
              { icon: FileSignature, name: "Netzzugangsantrag stellen", text: "Formular des Netzbetreibers mit Datenblättern und Schaltplan. Bis 20 kW genügt eine Anzeige (§ 96 ElWG) – der Netzbetreiber kann binnen 4 Wochen widersprechen." },
              { icon: Cable, name: "Netzverträglichkeit prüfen lassen", text: "Größere Anlagen prüft der Netzbetreiber nach TOR Erzeuger: Anschlusspunkt, Netzebene, Blindleistungsverfahren, Einspeisebegrenzung – bei Engpässen flexibler Netzzugang." },
              { icon: ClipboardCheck, name: "Netzzugangsvertrag und Netzzutrittsentgelt", text: "Nach Zusage folgen Netzzugangsvertrag und Netzzutrittsentgelt (für Erneuerbare pauschal je kW, siehe Tabelle)." },
              { icon: Zap, name: "Stromabnahme regeln", text: "Einspeisezählpunkt anlegen lassen und einen Abnahmevertrag mit einem Stromhändler, der OeMAG (Marktpreis) oder über eine Energiegemeinschaft abschließen." },
              { icon: Wrench, name: "Errichten, prüfen, Fertigstellung melden", text: "Installation nach ÖVE/ÖNORM E 8101, Erstprüfung nach EN 62446-1; die Elektrofachkraft meldet die Fertigstellung an den Netzbetreiber." },
              { icon: Power, name: "Inbetriebnahme und Registrierung", text: "Zählerumbau bzw. Aktivierung des Zählpunkts, Registrierung in der Herkunftsnachweisdatenbank – Voraussetzung für EAG-Zuschuss und Marktprämie." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Netzzutrittsentgelt" title="Was der Anschluss für Erzeuger kostet" lead="Für Erneuerbare auf Netzebene 3–7 gilt ein pauschales Entgelt je kW Engpassleistung." />
            <Reveal className="mt-8">
              <Tabelle
                dicht
                caption="Pauschales Netzzutrittsentgelt für Erneuerbare 2026"
                spalten={[
                  { key: "leistung", label: "Engpassleistung" },
                  { key: "entgelt", label: "Entgelt netto", className: "font-display font-bold text-ov-700" },
                ]}
                zeilen={NETZZUTRITT.stufen}
              />
            </Reveal>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-500">
              Quelle: {NETZZUTRITT.quelle.label} und Preisblätter der Netzbetreiber; Stand 09/2026, bitte beim Netzbetreiber prüfen. PV bis 15 kW über einen bestehenden Anschluss braucht nach ElWG kein zusätzliches Netzanschlussentgelt.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Elektrizitätswirtschaftsgesetz" title="ElWG: was sich für Betreiber ändert" lead={ELWG.kurz} />
            <ol className="mt-8 space-y-3">
              {ELWG.termine.map((t) => (
                <li key={t.datum} className="flex gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                  <span className="ov-num shrink-0 font-display text-[15px] font-bold text-ov-700">{t.datum}</span>
                  <span className="text-[14.5px] leading-relaxed text-ink-700">{t.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ELWG.punkte.map((p, i) => (
            <Reveal as="li" key={p.titel} delay={(i % 3) * 70} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900"><Radio aria-hidden="true" className="h-4 w-4 text-ov-600" />{p.titel}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{p.text}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          Ausführlich im Ratgeber{" "}
          <Link href="/ratgeber/elwg-elektrizitaetswirtschaftsgesetz" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">ElWG – was sich für PV-Betreiber ändert</Link>. Die Landes-Elektrizitätswirtschaftsgesetze regeln daneben die Bewilligung der Erzeugungsanlage selbst; Leitungen über 1 kV unterliegen den Starkstromwegegesetzen von Bund (über Landesgrenzen) bzw. Ländern – relevant bei Freiflächen mit eigener Mittelspannungsleitung.
        </p>
      </Section>

      <Section tone="sand" space="lg" id="netzbetreiber">
        <SectionHeading
          eyebrow="Netzbetreiber und Landesrecht"
          title="Netzbetreiber und Elektrizitätsrecht je Bundesland"
          lead="Ihr Netzbetreiber steht auf der Stromrechnung. Die Tabelle nennt die großen Verteilernetzbetreiber und die elektrizitätsrechtlichen Schwellen des jeweiligen Landes."
          className="mb-10"
        />
        <Reveal>
          <Tabelle
            dicht
            caption="Netzbetreiber und Landes-Elektrizitätsrecht nach Bundesland"
            spalten={[
              { key: "land", label: "Land", breite: "w-[14%]" },
              { key: "netz", label: "Netzbetreiber", breite: "w-[30%]" },
              { key: "el", label: "Elektrizitätsrechtliche Schwellen" },
            ]}
            zeilen={netze}
          />
        </Reveal>
        <p className="mt-4 text-[13.5px] leading-relaxed text-ink-500">Neben den genannten gibt es in allen Ländern Stadt- und Gemeindewerke mit eigenem Netzgebiet. Details je Land auf den <Link href="/forderungen/landesforderungen" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">Landesseiten</Link>.</p>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Normen und Netzanschluss – kurz beantwortet" lead={`Rechtsstand ${STAND.label}. Maßgeblich sind die aktuellen Ausgaben der Normen und die Vorgaben Ihres Netzbetreibers.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <Quellen
          stand={STAND.label}
          quellen={[
            ...ELWG.quellen,
            NETZZUTRITT.quelle,
            { label: "E-Control – TOR (Technische und organisatorische Regeln)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor" },
            { label: "HORA – Naturgefahren inkl. Schneelast", url: "https://www.hora.gv.at" },
            { label: "OVE – Richtlinien", url: "https://www.ove.at" },
            { label: "Land OÖ – Leitfaden 2026 Photovoltaik (Speicher, OIB-RL 2)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf" },
          ]}
        />
      </Section>

      <Querverweise pfad="/forderungen/richtlinien" />
      <CtaBand
        eyebrow="Technik & Netz aus einer Hand"
        title="Netzanschluss, TOR-Nachweise und Parkregler – von uns."
        text="Wir stellen Netzzugangsantrag und Nachweise, stimmen Blindleistungsverfahren und Einspeisebegrenzung mit dem Netzbetreiber ab und regeln größere Anlagen mit eigenem Parkregler."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Baurecht der Bundesländer", href: "/forderungen/baurecht" }}
      />
    </div>
  );
}
