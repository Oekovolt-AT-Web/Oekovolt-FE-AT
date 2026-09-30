// src/app/rechner/freiflaeche-pacht/page.js – Freiflächen- & Pacht-Rechner für Grundeigentümer

import Link from "next/link";
import { Cable, FileSignature, Tractor } from "lucide-react";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import SectionHeading from "@/components/ui/SectionHeading";
import PachtRechner from "@/components/RechnerGewerbe/PachtRechner";
import { standortGruppen, pvgisStand } from "@/components/RechnerGewerbe/standorte";
import { PACHT } from "@/lib/rechner/pacht";
import { fmt } from "@/lib/rechner/annahmen";

const PFAD = "/rechner/freiflaeche-pacht";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Solarpark-Rechner: Leistung & Ertrag je Hektar | Ökovolt",
  description:
    "Solarpark-Rechner: PV-Leistung und Jahresertrag je Hektar für Freifläche oder Agri-PV – mit PVGIS-Standortdaten, Pacht über die Laufzeit und Widmungshinweis.",
  keywords: ["Solarpark Rechner", "Solarpark Leistung pro Hektar", "Freiflächen PV Ertrag Rechner", "Agri-PV Rechner", "MWp pro Hektar", "Freiflächen PV Pacht Rechner"],
});

const FAQ = [
  {
    q: "Wie viel PV-Leistung passt auf einen Hektar?",
    a: `Als Richtwert rechnet der Rechner mit rund ${fmt(PACHT.konzepte[0].kwpProHa)} kWp je Hektar für eine klassische, nach Süden aufgeständerte Freifläche, ${fmt(PACHT.konzepte[1].kwpProHa)} kWp für hoch aufgeständerte Agri-PV über Kulturen und ${fmt(PACHT.konzepte[2].kwpProHa)} kWp für vertikale, bifaziale Agri-PV mit rund 10 m Reihenabstand. Die tatsächliche Belegung hängt von Zuschnitt, Hangneigung, Abständen zu Wald und Straßen, Zaun und Trafostation ab.`,
  },
  {
    q: "Wie hoch ist die Pacht für eine PV-Freifläche?",
    a: "Eine seriöse allgemeingültige Zahl gibt es nicht: Pachthöhen hängen von Region, Netzanschluss, Förderung, Konzept und Vertragsgestaltung ab und werden selten veröffentlicht. Der Rechner nennt deshalb keinen Marktwert, sondern rechnet mit Ihrer Annahme – etwa aus einem vorliegenden Angebot. Unabhängige Beratung für Grundeigentümer bieten die Landwirtschaftskammern.",
  },
  {
    q: "Brauche ich für einen Solarpark eine Umwidmung?",
    a: "In praktisch allen Bundesländern ja: Freiflächen-PV im Grünland braucht ab einer geringen Bagatellgrenze eine eigene Widmung oder Sonderausweisung im Flächenwidmungsplan der Gemeinde, in manchen Ländern zusätzlich eine Zone oder Vorrangfläche des Landes. Der Rechner zeigt den Kurzhinweis für das Bundesland Ihres Standorts; die Details stehen im Ratgeber zur Widmung.",
  },
  {
    q: "Warum ist die Entfernung zum Netzanschluss so wichtig?",
    a: "Weil ein Solarpark nur so viel wert ist wie sein Netzanschluss. Jeder Kilometer Kabeltrasse kostet, braucht Dienstbarkeiten und Genehmigungen – bei kleinen Flächen kann das die Wirtschaftlichkeit kippen. Ebenso entscheidend ist die freie Kapazität am Anschlusspunkt, die der Netzbetreiber im Anschlusskonzept bestätigt.",
  },
  {
    q: "Wie viele Haushalte kann eine Freiflächenanlage versorgen?",
    a: `Der Rechner teilt den Jahresertrag durch ${fmt(PACHT.haushaltKwh)} kWh, den Referenzverbrauch eines Haushalts der E-Control. Das ist eine bilanzielle Größe: Über das Jahr erzeugt die Anlage so viel Strom, wie diese Haushalte verbrauchen – zeitgleich versorgt sie sie nicht, etwa nachts oder im Winter.`,
  },
  {
    q: "Kann ich die Fläche weiter landwirtschaftlich nutzen?",
    a: "Bei Agri-PV ja – das ist ihr Zweck. Vertikale Anlagen lassen zwischen den Reihen breite Streifen für Maschinen frei, hoch aufgeständerte überdachen Obst, Beeren oder Gemüse. Nach dem EABG muss eine Agri-Solaranlage mindestens 75 % der Projektfläche in landwirtschaftlicher Produktion halten. Bei klassischen Freiflächen ist meist nur Beweidung möglich.",
  },
];

export default function Page() {
  const standorte = standortGruppen();
  const pvgis = pvgisStand();
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="freiflaeche-pacht"
      breadcrumb="Freiflächen- & Pacht-Rechner"
      eyebrow="Freiflächen- & Pacht-Rechner"
      title={<>Solarpark-Rechner: <span className="ov-text-gradient-light">Leistung und Ertrag Ihrer Fläche</span></>}
      lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">Was Ihre Fläche leisten kann.</span><span className="mt-3 block">Für Grundeigentümer, Landwirte und Gemeinden: Leistung, Jahresertrag und versorgbare Haushalte je Konzept – dazu Ihre Pacht über die Laufzeit und Hinweise zu Widmung und Netz. Ob sich die Fläche überhaupt eignet, zeigt vorab der <Link href="/flaechen-check" className="font-semibold text-white underline decoration-white/40 underline-offset-2">Flächen-Check</Link>.</span></>}
      chips={["Freifläche oder Agri-PV", "PVGIS für Ihren Standort", "Widmung je Bundesland", "Pacht als Ihre Annahme"]}
      app={{
        name: "Ökovolt Freiflächen- & Pacht-Rechner",
        description: "Schätzt für eine Grundfläche in Österreich die mögliche Photovoltaik-Leistung, den Jahresertrag und die rechnerisch versorgbaren Haushalte je Konzept (Freifläche, Agri-PV) und summiert eine angenommene Pacht über die Laufzeit.",
        featureList: ["Leistung je Hektar nach Konzept", "Jahresertrag mit PVGIS-Standortdaten", "Versorgbare Haushalte", "Pacht mit Indexierung über die Laufzeit", "Widmungs- und Netzanschluss-Hinweise"],
      }}
      rechner={<PachtRechner standorte={standorte} startOrt="st-poelten" />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Erst Widmung und Netz, dann die Pacht."
            lead="Eine Fläche wird erst dann zum Solarpark, wenn die Gemeinde widmet und der Netzbetreiber Kapazität zusagt. Wer diese zwei Fragen früh klärt, verhandelt die Pacht auf sicherem Boden."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: FileSignature, t: "Widmung", x: "Neun Bundesländer, neun Regeln – von 50 m² in Oberösterreich bis zu Zonen in NÖ." },
              { icon: Cable, t: "Netzanschluss", x: "Freie Kapazität und kurze Trasse entscheiden über die Machbarkeit." },
              { icon: Tractor, t: "Doppelnutzung", x: "Agri-PV hält die Fläche in landwirtschaftlicher Produktion." },
            ].map(({ icon: Icon, t, x }) => (
              <li key={t} className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-[16px] font-bold text-ink-900">{t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{x}</p>
              </li>
            ))}
          </ul>
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Gute Pachtverträge regeln mehr als den Betrag: Laufzeit mit Verlängerungsoption, Indexierung, Rückbauverpflichtung samt Sicherheit, Pflege der Fläche und Dienstbarkeiten für Kabeltrassen. Die Regeln aller Bundesländer fasst der Ratgeber{" "}
              <Link href="/ratgeber/freiflaechen-photovoltaik-widmung">Freiflächen-Photovoltaik: Widmung und Zonierung</Link> zusammen.
              Die Rechtslage je Land mit Normen und offenen Punkten finden Sie unter{" "}
              <Link href="/freiflaechen-photovoltaik/widmung">Widmung je Bundesland</Link>, eine erste Eignungsprüfung Ihrer Fläche im{" "}
              <Link href="/flaechen-check">Flächen-Check</Link>.
            </p>
            <p>
              Wie Landwirtschaft und Stromerzeugung zusammengehen, zeigt unsere Seite <Link href="/agri-pv">Agri-PV</Link>. Solarparks auf Gemeinde- und Betriebsflächen planen und errichten wir unter <Link href="/freiflaechen-photovoltaik">Freiflächenanlagen</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Freifläche (PVGIS Süd 35°)", `${fmt(PACHT.konzepte[0].kwpProHa)} kWp/ha`],
        ["Agri-PV hoch (PVGIS Süd 35°)", `${fmt(PACHT.konzepte[1].kwpProHa)} kWp/ha`],
        ["Agri-PV vertikal (PVGIS Ost-West 15°)", `${fmt(PACHT.konzepte[2].kwpProHa)} kWp/ha`],
        ["Referenzhaushalt (E-Control)", `${fmt(PACHT.haushaltKwh)} kWh/Jahr`],
        ["Pacht (keine Marktangabe)", "Ihre Annahme"],
        ["Indexierung · Laufzeit (Standard)", `${fmt(PACHT.indexStandard * 100)} %/Jahr · ${PACHT.laufzeitStandard} Jahre`],
        ["TOR-Typ: Maximalkapazität", "≈ kWp"],
        ["CO₂-Substitution", `${fmt(PACHT.co2KgProKwh * 1000, 1)} g/kWh`],
      ]}
      quellen={[
        { name: "eNu – Agri-PV in Niederösterreich (Flächenbedarf Freifläche)", url: "https://www.energie-noe.at/agri-pv" },
        { name: "Next2Sun – Agri-PV-FAQ (Leistung je Hektar vertikal)", url: "https://next2sun.com/agri-pv/agri-pv-faqs/" },
        { name: "Bauernzeitung – Welche Kulturen unter Agri-PV funktionieren", url: "https://bauernzeitung.at/artikel/bundesteil/welche-kulturen-unter-agri-pv-funktionieren" },
        { name: "pv magazine – BOKU-Studie Agri-PV in Österreich (16.03.2026)", url: "https://www.pv-magazine.de/2026/03/16/oesterreich-koennte-durch-agrar-photovoltaik-90-terawattstunden-strom-erzeugen/" },
        { name: `${pvgis.quelle}`, url: "https://re.jrc.ec.europa.eu/pvg_tools/de/" },
        { name: "E-Control – Tarifkalkulator (Referenzverbrauch)", url: "https://www.e-control.at/tarifkalkulator" },
      ]}
      faq={FAQ}
      faqTitel="Freifläche & Pacht: Fragen & Antworten"
      cta={{
        title: "Ihre Fläche, ehrlich geprüft – bevor Sie unterschreiben.",
        text: "Wir prüfen Widmungschancen, Netzanschluss, Naturgefahren und Ertrag Ihrer Fläche und zeigen, ob Verpachtung, Beteiligung oder Eigenbetrieb passt – in ganz Österreich.",
        primary: { label: "Fläche prüfen lassen", href: "/kontakt" },
        secondary: { label: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik" },
      }}
    />
  );
}
