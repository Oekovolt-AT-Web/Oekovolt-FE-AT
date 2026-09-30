// src/app/rechner/finanzierung/page.js – Finanzierungsvergleich Gewerbe-PV:
// Kauf (Eigenkapital/Kredit) vs. Leasing vs. Contracting vs. Dach-PPA über 20 Jahre.
// Neutral: „Modelle am Markt“ – keine Aussage, dass Ökovolt Leasing, Contracting
// oder PPA selbst anbietet; alle Konditionen sind Beispielwerte des Nutzers.

import Link from "next/link";
import { CalendarClock, LineChart, Percent } from "lucide-react";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import SectionHeading from "@/components/ui/SectionHeading";
import FinanzierungsVergleich from "@/components/RechnerFinanzierung/FinanzierungsVergleich";
import ModellUebersicht from "@/components/RechnerFinanzierung/ModellUebersicht";
import { ANNAHMEN, PREISQUELLEN, preisProKwp } from "@/data/solarrechner";
import { FINANZIERUNG as S, leasingEffektivzins, zahl } from "@/lib/rechner/finanzierung";
import { einspeiseSatzCt } from "@/lib/rechner/gewerbepv";

const PFAD = "/rechner/finanzierung";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "PV-Finanzierung vergleichen: Kauf, Leasing, PPA | Ökovolt",
  description:
    "Neutraler Finanzierungsvergleich für Gewerbe-PV in Österreich: Kauf mit Eigenkapital oder Kredit, Leasing, Contracting und Dach-PPA über 20 Jahre – Barwert, Cashflow, Amortisation.",
  keywords: [
    "PV Finanzierung Vergleich",
    "Photovoltaik Leasing oder Kauf",
    "PV Contracting Rechner",
    "PPA Photovoltaik Unternehmen",
    "PV Leasing Rechner Österreich",
    "Photovoltaik Barwert Rechner",
  ],
});

const pz = (v, st = 0) => `${zahl(v * 100, st)} %`;
const effLeasing = leasingEffektivzins(S.leasing.faktor, S.leasing.jahre, S.leasing.restwert);

const FAQ = [
  {
    q: "Was ist günstiger: PV kaufen oder leasen?",
    a: "Rechnerisch ist der Kauf mit Eigenkapital meist vorne, weil keine Finanzierungskosten anfallen und der Investitionsfreibetrag beim Käufer liegt. Leasing schont dafür Liquidität und Kreditrahmen. Den Ausschlag geben Ihr Kalkulationszins, der Leasingfaktor und die Steuerlage – deshalb zeigt der Rechner den Barwert: Er macht Zahlungen, die zu verschiedenen Zeitpunkten anfallen, vergleichbar.",
  },
  {
    q: "Was bedeutet der Barwert im Finanzierungsvergleich?",
    a: `Der Barwert zinst alle künftigen Vor- und Nachteile mit Ihrem Kalkulationszins (Standard ${pz(S.kalkulationszins)}) auf heute ab. Ein Euro Ersparnis in 15 Jahren ist heute weniger wert als ein Euro Investition heute. Liegt der Kreditzins genau beim Kalkulationszins, haben Kauf mit Eigenkapital und Kauf mit Kredit denselben Barwert – der Kredit verschiebt dann nur Zahlungen.`,
  },
  {
    q: "Was ist ein Leasingfaktor?",
    a: `Der Leasingfaktor gibt die monatliche Rate in Prozent des Anschaffungswerts an. Bei 1,10 % und 200.000 € Anlagenpreis sind das 2.200 € im Monat. Der Rechner zeigt, welchem Jahreszins ein Faktor rechnerisch entspricht – der Standardwert ${zahl(S.leasing.faktor, 2)} % über ${S.leasing.jahre} Jahre ohne Restwert entspricht rund ${zahl((effLeasing ?? 0) * 100, 1)} % p. a. Echte Faktoren enthalten Marge, Restwert und Nebenkosten des Leasinggebers und sind ein Angebot, keine Marktangabe.`,
  },
  {
    q: "Worin unterscheiden sich Contracting und PPA?",
    a: "Beim Contracting errichtet und betreibt ein Contractor die Anlage auf Ihrem Dach; Sie zahlen je selbst genutzter Kilowattstunde, den Überschuss vermarktet er. Nach der Laufzeit können Sie die Anlage häufig übernehmen. Beim Dach-PPA (On-site Power Purchase Agreement) kaufen Sie den Solarstrom zu einem vereinbarten, oft festen Preis – bei Take-or-pay die gesamte Erzeugung. Die Anlage bleibt beim Investor. Im Rechner stellen Sie beides getrennt ein.",
  },
  {
    q: "Wie hoch sind Contracting- und PPA-Preise?",
    a: "Dafür gibt es keine öffentliche, belastbare Marktstatistik; Preise hängen von Anlagengröße, Laufzeit, Bonität, Indexierung und Abnahmeregel ab. Der Rechner nutzt daher Beispielwerte, die Sie durch Angebote ersetzen. Als Orientierung zeigt er die Stromgestehungskosten der Anlage bei Kauf: Ein Anbieter muss diese Kosten plus Kapital, Risiko und Marge decken.",
  },
  {
    q: "Welche Steuern berücksichtigt der Rechner?",
    a: `Er rechnet netto und vor Ertragsteuern. Einzige Ausnahme ist der Investitionsfreibetrag: ${pz(ANNAHMEN.ifb.satzOeko)} der Anschaffungskosten bei Anschaffung bis 31.12.2026, als Steuereffekt mit ${pz(ANNAHMEN.ifb.koest)} Körperschaftsteuer im ersten Jahr – nur beim Kauf. Abschreibung, Absetzbarkeit von Leasingraten und Contracting-Entgelten sowie die Bilanzwirkung klären Sie mit Ihrer Steuerberatung.`,
  },
  {
    q: "Was passiert nach 20 Jahren?",
    a: "Der Vergleich endet nach 20 Jahren. PV-Module haben oft Leistungsgarantien über 25 bis 30 Jahre; eine Anlage, die Ihnen gehört, liefert also meist weiter Strom. Diesen Weiterbetrieb bewertet der Rechner nicht – er spricht für Kauf, Leasing mit Übernahme und Contracting mit Übernahme, nicht für das PPA ohne Übernahme.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="finanzierungsvergleich"
      breadcrumb="Finanzierungsvergleich"
      eyebrow="Finanzierungsvergleich"
      title={
        <>
          Kaufen, leasen oder <span className="ov-text-gradient-light">Strom kaufen?</span>
        </>
      }
      lead="Dieselbe Anlage, fünf Modelle am Markt: Kauf mit Eigenkapital oder Kredit, Leasing, Contracting und Dach-PPA – über 20 Jahre mit Barwert, Cashflow und Amortisation. Alle Annahmen offen und änderbar."
      chips={["Barwert & Cashflow-Kurven", "Leasingfaktor → Effektivzins", "IFB und EAG-Zuschuss", "Neutral, ohne Anbieterkonditionen"]}
      app={{
        name: "Ökovolt Finanzierungsvergleich für Gewerbe-PV",
        description:
          "Vergleicht für eine Photovoltaikanlage eines Betriebs in Österreich Kauf mit Eigenkapital, Kauf mit Kredit, Leasing, Contracting und Dach-PPA über 20 Jahre: Barwert, kumulierter Cashflow, Vorteil im ersten Jahr und Amortisation – mit offenen, änderbaren Annahmen.",
        featureList: [
          "Fünf Finanzierungsmodelle nebeneinander",
          "Barwert mit eigenem Kalkulationszins",
          "Cashflow-Kurven kumuliert und je Jahr",
          "Leasingfaktor mit rechnerischem Effektivzins",
          "Investitionsfreibetrag und EAG-Investitionszuschuss",
          "Stromgestehungskosten als Referenz für Contracting- und PPA-Preise",
        ],
      }}
      rechner={
        <>
          <FinanzierungsVergleich />
          <ModellUebersicht />
        </>
      }
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Gleiche Anlage, gleiche Sonne – nur das Geld fließt anders."
            lead="Jedes Modell startet mit derselben Anlage, demselben Ertrag und demselben Eigenverbrauch. Verglichen wird, was Ihrem Betrieb gegenüber dem reinen Netzbezug Jahr für Jahr bleibt."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Percent, t: "Barwert", x: "Alle Jahre auf heute abgezinst – der fairste Vergleich zwischen Investition heute und Raten später." },
              { icon: LineChart, t: "Cashflow", x: "Kumuliert oder je Jahr: Wann ist welches Modell im Plus, wo drückt eine Rate?" },
              { icon: CalendarClock, t: "Amortisation", x: "Ab wann der Vorteil dauerhaft positiv bleibt – ohne Anfangsinvestition oft ab Jahr 1." },
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
              Die Energie-Seite teilen alle Modelle: Eigenverbrauch spart den Strompreis, Überschuss bringt den Einspeiseerlös, die Module verlieren leicht an Leistung. Unterschiedlich ist, wer investiert, wer den Betrieb bezahlt, wer Förderung und Investitionsfreibetrag nutzt – und wem die Anlage am Ende gehört.
            </p>
            <p>
              Wie viel Solarstrom Ihr Betrieb selbst nutzt, simuliert der <Link href="/rechner/gewerbe-pv">Gewerbe-PV-Rechner</Link> stündlich. Wie Kredit, Leasing, Mietkauf und Contracting ablaufen und welche Unterlagen Bank oder Leasinggeber brauchen, steht unter{" "}
              <Link href="/service/finanzierung">PV-Finanzierung für Unternehmen</Link>. Zuschüsse und Steuervorteile finden Sie im <Link href="/foerdercheck">Förder-Check</Link> und unter{" "}
              <Link href="/forderungen/steuerlich">steuerliche Förderungen</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Betrachtung", `${S.jahre} Jahre, netto, vor Ertragsteuern`],
        [`Anlagenpreis netto (${zahl(S.kwp)} kWp)`, `${zahl(Math.round(preisProKwp(S.kwp, "gewerbe") / 10) * 10)} €/kWp`],
        ["Jahresertrag (Standard)", `${zahl(S.ertragProKwp)} kWh/kWp`],
        ["Strompreis, den PV ersetzt", `${zahl(S.strompreisCt, 1)} ct/kWh netto`],
        ["Einspeiseerlös (Rechensatz)", `${zahl(einspeiseSatzCt(S.kwp), 1)} ct/kWh`],
        ["Strompreis-Steigerung · Degradation", `${pz(S.strompreisSteigerung)} · ${pz(S.degradation, 1)} je Jahr`],
        ["Kalkulationszins (Beispiel)", pz(S.kalkulationszins)],
        ["Kredit (Beispiel)", `${pz(S.kredit.zins)}, ${S.kredit.jahre} J., ${pz(S.kredit.eigenkapitalAnteil)} Eigenanteil`],
        ["Leasingfaktor (Beispiel)", `${zahl(S.leasing.faktor, 2)} %/Monat, ${S.leasing.jahre} J.`],
        ["Contracting (Beispiel)", `${zahl(S.contracting.preisCt)} ct/kWh, +${pz(S.contracting.index)}/J., ${S.contracting.jahre} J.`],
        ["Dach-PPA (Beispiel)", `${zahl(S.ppa.preisCt)} ct/kWh fest, Take-or-pay`],
        ["IFB · Steuereffekt", `${pz(ANNAHMEN.ifb.satzOeko)} · ${pz(ANNAHMEN.ifb.koest)} KöSt, nur Kauf`],
      ]}
      quellen={[
        ...PREISQUELLEN.filter((q) => /Marktentwicklung|IEA|Eurostat|OeMAG/.test(q.name)),
        { name: "RIS – EStG § 11 und § 124b (Investitionsfreibetrag)", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004570" },
        { name: `EAG-Abwicklungsstelle – Investitionszuschuss (${ANNAHMEN.eagInvestitionszuschuss.quelle})`, url: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
      ]}
      faq={FAQ}
      faqTitel="Finanzierung: Fragen & Antworten"
      cta={{
        title: "Erst die Anlage klären, dann die Finanzierung wählen.",
        text: "Mit Ertrag, Eigenverbrauch und Investition aus unserem Angebot vergleichen Sie Kredit-, Leasing-, Contracting- oder PPA-Angebote auf gleicher Basis – für Betriebe in ganz Österreich.",
        primary: { label: "Angebot anfragen", href: "/angebot?objekt=gewerbe" },
        secondary: { label: "PV-Finanzierung für Unternehmen", href: "/service/finanzierung" },
      }}
    />
  );
}
