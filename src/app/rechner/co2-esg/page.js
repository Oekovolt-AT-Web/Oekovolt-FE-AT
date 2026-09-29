// src/app/rechner/co2-esg/page.js – CO₂- & ESG-Rechner (Scope 2)

import Link from "next/link";
import { FileText, Landmark, Scale } from "lucide-react";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import SectionHeading from "@/components/ui/SectionHeading";
import CO2Rechner from "@/components/RechnerGewerbe/CO2Rechner";
import { CO2 } from "@/lib/rechner/co2";
import { fmt } from "@/lib/rechner/annahmen";

const PFAD = "/rechner/co2-esg";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "CO₂- & ESG-Rechner: Scope 2 mit Photovoltaik | Ökovolt",
  description:
    "Scope-2-Rechner für Betriebe in Österreich: standort- und marktbasiert vor und nach PV, Ökostrom und E-Flotte – mit Textbaustein für VSME und ESRS. Kostenlos.",
  keywords: ["Scope 2 Rechner", "CO2 Rechner Unternehmen Österreich", "ESG Photovoltaik", "VSME Scope 2", "marktbasiert standortbasiert Strom", "Stromkennzeichnung CO2"],
});

const FAQ = [
  {
    q: "Was ist der Unterschied zwischen standortbasiert und marktbasiert?",
    a: "Das GHG Protocol verlangt für Scope 2 zwei Werte. Standortbasiert rechnen Sie mit dem durchschnittlichen Emissionsfaktor des Stromnetzes – jede Kilowattstunde weniger Netzbezug senkt den Wert. Marktbasiert rechnen Sie mit dem Strommix Ihres Liefervertrags laut Stromkennzeichnung; Strom mit erneuerbaren Herkunftsnachweisen zählt dort mit null. Eigener Solarstrom senkt beide Werte, ein Ökostromtarif nur den marktbasierten.",
  },
  {
    q: "Welchen Emissionsfaktor verwendet der Rechner?",
    a: `Standortbasiert ist ${fmt(CO2.lokFaktorG, 1)} g CO₂e je kWh voreingestellt – die mittlere österreichische Stromaufbringung 2024 laut der Studie „Innovative Energietechnologien in Österreich – Marktentwicklung 2024“ des Bundesministeriums. Für Ihren Bericht setzen Sie den Faktor des Berichtsjahres ein, den Ihre Methodik vorgibt. Marktbasiert tragen Sie den CO₂-Wert aus der Stromkennzeichnung Ihres Lieferanten ein; er steht auf der Jahresabrechnung.`,
  },
  {
    q: "Zählt eingespeister Solarstrom für meine Klimabilanz?",
    a: "Nicht im eigenen Scope 2, denn er ersetzt keinen eigenen Netzbezug. Der Rechner zeigt die im Stromsystem vermiedenen Emissionen der Einspeisung deshalb getrennt als Zusatzinformation. In der Kommunikation dürfen Sie die zusätzliche erneuerbare Erzeugung nennen, aber nicht doppelt als Eigenverbrauch anrechnen.",
  },
  {
    q: "Warum steigt Scope 2, wenn ich die Flotte elektrifiziere?",
    a: "Weil der Ladestrom aus dem Netz zusätzlich eingekauft wird. Gleichzeitig sinken die direkten Emissionen der Dieselfahrzeuge in Scope 1 deutlich stärker. Der Rechner zeigt deshalb auch die Summe aus Scope 1 und 2. Laden die Fahrzeuge mit Überschuss aus der eigenen PV-Anlage, entfällt dieser Anstieg teilweise.",
  },
  {
    q: "Brauche ich als KMU überhaupt eine Klimabilanz?",
    a: "Nach dem Omnibus-Paket der EU fällt die Berichtspflicht nach CSRD für die meisten kleinen und mittleren Unternehmen weg. Banken, Förderstellen und große Kunden fragen Scope-1- und Scope-2-Werte aber zunehmend ab – oft nach dem freiwilligen Standard VSME. Der Textbaustein des Rechners ist dafür ein Ausgangspunkt, ersetzt aber keine geprüfte Bilanz.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="co2-esg"
      breadcrumb="CO₂- & ESG-Rechner"
      eyebrow="CO₂- & ESG-Rechner · Scope 2"
      title={<>Weniger Scope 2 – <span className="ov-text-gradient-light">schwarz auf weiß.</span></>}
      lead="Standort- und marktbasierte Scope-2-Emissionen vor und nach Photovoltaik, Ökostrom und E-Flotte – mit Textbaustein für Ihren Nachhaltigkeitsbericht."
      chips={["GHG Protocol: beide Methoden", "Faktoren offen & änderbar", "Textbaustein zum Kopieren"]}
      app={{
        name: "Ökovolt CO₂- & ESG-Rechner",
        description: "Berechnet Scope-2-Emissionen standortbasiert und marktbasiert vor und nach Photovoltaik-Eigenverbrauch, Ökostrom mit Herkunftsnachweisen und Flottenelektrifizierung und erstellt einen Textbaustein für den Nachhaltigkeitsbericht.",
        featureList: ["Scope 2 standortbasiert und marktbasiert", "Photovoltaik-Eigenverbrauch", "Ökostrom mit Herkunftsnachweis", "Scope 1 der Fahrzeugflotte", "Textbaustein für VSME/ESRS"],
      }}
      rechner={<CO2Rechner />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Selbst genutzter Solarstrom ist die robusteste Scope-2-Maßnahme."
            lead="Er senkt den standort- und den marktbasierten Wert zugleich, ist messbar und bleibt über die Lebensdauer der Anlage wirksam – anders als ein Ökostromvertrag, der jedes Jahr neu eingekauft wird."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Scale, t: "Zwei Methoden", x: "Standort- und marktbasiert parallel, wie es die Scope 2 Guidance verlangt." },
              { icon: FileText, t: "Berichtsfertig", x: "Textbaustein mit Zahlen, Faktoren und Methodik – zum Kopieren." },
              { icon: Landmark, t: "Für Bank & Kunden", x: "Grundlage für ESG-Fragebögen, Green Loans und Lieferantenanfragen." },
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
              Die Formel ist einfach: selbst verbrauchter Solarstrom in kWh mal Emissionsfaktor des ersetzten Stroms. Wie viel Ihrer Erzeugung Sie tatsächlich selbst nutzen, zeigt der <Link href="/rechner/gewerbe-pv">Gewerbe-PV-Rechner</Link> mit stündlicher Simulation. Was CSRD, VSME und Banken 2026 konkret abfragen, erklärt der Ratgeber{" "}
              <Link href="/ratgeber/csrd-esg-photovoltaik">CSRD, ESG und Photovoltaik</Link>.
            </p>
            <p>
              Ihre Anlage als sichtbares Nachhaltigkeitsprojekt: Mit unserem Partner Solensa produzieren wir Video und Imagespot – mehr unter <Link href="/service/nachhaltigkeitsmarketing">Nachhaltigkeitsmarketing</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Standortbasiert (Voreinstellung)", `${fmt(CO2.lokFaktorG, 1)} g CO₂e/kWh`],
        ["Marktbasiert (Beispielwert)", `${fmt(CO2.marktFaktorBeispielG)} g CO₂/kWh`],
        ["Ökostrom mit Herkunftsnachweis", "0 g/kWh (marktbasiert)"],
        ["Versorgermix 2025 erneuerbar", `${fmt(CO2.versorgermix2025.erneuerbar, 2)} %`],
        ["PV-Ertrag pro Jahr", `${fmt(CO2.pvErtragProKwp)} kWh/kWp`],
        ["Substitution Einspeisung (nicht Scope 2)", `${fmt(CO2.substitutionG, 1)} g/kWh`],
        ["Diesel · Benzin", `${fmt(CO2.dieselKgProLiter, 2)} · ${fmt(CO2.benzinKgProLiter, 2)} kg CO₂/l`],
        ["E-Fahrzeug inkl. Ladeverluste", `${fmt(CO2.eFahrzeugKwhJe100)} kWh/100 km`],
        ["Vergleich Benziner 7 l/100 km", `${fmt(CO2.pkwKgProKm * 1000)} g/km`],
      ]}
      quellen={[
        { name: "GHG Protocol – Scope 2 Guidance", url: "https://ghgprotocol.org/scope-2-guidance" },
        { name: "Marktentwicklung 2024 – Innovative Energietechnologien in Österreich (BMIMI, 06/2025)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf" },
        { name: "E-Control – Stromkennzeichnung", url: "https://www.e-control.at/industrie/oeko-energie/stromkennzeichnung" },
        { name: "E-Control – Strom- und Gaskennzeichnung 2026 (Presseaussendung 03.09.2026)", url: "https://www.ots.at/presseaussendung/OTS_20260903_OTS0068/e-control-strom-und-gaskennzeichnung-2026-bringt-transparenz-fuer-endkundinnen" },
        { name: "WKO – VSME-Berichtsvorlage", url: "https://www.wko.at/nachhaltigkeit/vsme-berichtsvorlage-gewerbe-industrie-bau" },
      ]}
      faq={FAQ}
      faqTitel="CO₂ & Scope 2: Fragen & Antworten"
      cta={{
        title: "Die wirksamste Zeile in Ihrer Klimabilanz: eigener Solarstrom.",
        text: "Wir planen Ihre PV-Anlage mit Blick auf Eigenverbrauch und Messkonzept – damit die Einsparung im Bericht belegbar ist. Und machen sie auf Wunsch mit Video und Imagespot sichtbar.",
        primary: { label: "Angebot anfragen", href: "/angebot" },
        secondary: { label: "Nachhaltigkeitsmarketing", href: "/service/nachhaltigkeitsmarketing" },
      }}
    />
  );
}
