// src/app/rechner/investitionsantrag/page.js – Investitionsantrag Photovoltaik (Gewerbe)
//
// Gliederung: Entscheidungsvorlage → Annahmen → Cashflow 25 Jahre → Risiken → CO₂-Textbaustein
// (nur mit Berichtsjahr) → nächste Schritte. Eingaben per URL aus den Gewerbe-Rechnern
// (Schlüssel siehe URL_FELDER in src/lib/dossier/rechnung.js). Lead-Gate Stufe 2 (Kennung
// „investitionsantrag“): Auswertung und PDF erst nach bestätigter E-Mail.

import Link from "next/link";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import DossierAnsicht from "@/components/Dossier/DossierAnsicht";
import { DOSSIER_STAND, QUELLEN, URL_FELDER } from "@/lib/dossier/rechnung";
import { INVESTITION, SENSITIVITAET_VARIANTEN, prozent, zahl } from "@/lib/rechner/investition";
import { ANNAHMEN } from "@/data/solarrechner";

const PFAD = "/rechner/investitionsantrag";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Investitionsantrag Photovoltaik: Vorlage mit Cashflow | Ökovolt",
  description:
    "Investitionsantrag für eine Gewerbe-PV-Anlage: Entscheidungsvorlage, Annahmen mit Quelle, Cashflow über 25 Jahre, Risiken mit Sensitivität, CO₂-Textbaustein und nächste Schritte – als PDF.",
  keywords: ["Investitionsantrag Photovoltaik", "PV Investitionsantrag Vorlage", "Business Case Photovoltaik Gewerbe", "Kapitalwert Photovoltaik", "DSCR Photovoltaik Kredit"],
});

const FAQ = [
  {
    q: "Was steht im Investitionsantrag?",
    a: "Eine Entscheidungsvorlage mit Kapitalwert, internem Zinsfuß, Amortisation und Nutzen im ersten Jahr, die Annahmen mit Quelle und Stand, der Cashflow über 25 Jahre, die Risiken mit einer Sensitivitätsanalyse, ein CO₂-Textbaustein für den Nachhaltigkeitsbericht und die nächsten Schritte bis zum Beschluss.",
  },
  {
    q: "Wie rechnet der Kapitalwert?",
    a: "Die Investition fällt im Jahr 0 an, die Überschüsse aus Ersparnis, Einspeiseerlös und Betriebskosten am Ende jedes Jahres. Sie werden mit Ihrem Kalkulationszins (WACC) abgezinst – wie in Excel mit =NBW(Zins; Jahr 1 … Jahr 25) minus Investition. Der Steuereffekt des Investitionsfreibetrags wird, wenn aktiviert, im ersten Jahr angesetzt; sonst wird vor Ertragsteuern gerechnet.",
  },
  {
    q: "Was bedeutet die Schuldendienstdeckung (DSCR)?",
    a: "Der DSCR teilt den Cashflow vor Schuldendienst durch Zins und Tilgung des Jahres. Werte über 1,0 bedeuten, dass die Anlage ihre Kreditrate aus dem eigenen Überschuss trägt. Welchen Mindestwert eine Bank verlangt, legt sie projektabhängig fest.",
  },
  {
    q: "Kann ich Werte aus dem Gewerbe-PV-Rechner übernehmen?",
    a: "Ja. Die Eingaben kommen per Link mit (Anlagenleistung, Investition, Ertrag, Eigenverbrauch, Strompreis, Kredit) und bleiben änderbar. Ergebnisse aus Standort-Check und Förder-Check sammeln Sie im Business-Case-Dossier.",
  },
  {
    q: "Ist das eine Steuer- oder Finanzberatung?",
    a: "Nein. Alle Werte sind Richtwerte zur Orientierung. Maßgeblich sind Angebot, Vertrag, Förderrichtlinien und die Einschätzung Ihrer Steuerberatung und Ihres Finanzierungspartners.",
  },
];

export default function Page() {
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="investitionsantrag"
      breadcrumb="Investitionsantrag"
      eyebrow="Investitionsantrag Photovoltaik"
      title={
        <>
          Investitionsantrag: <span className="ov-text-gradient-light">Ihre PV-Anlage beschlussreif</span>
        </>
      }
      lead="Entscheidungsvorlage, Annahmen, Cashflow über 25 Jahre, Risiken, CO₂-Textbaustein und nächste Schritte – in der Gliederung, die Geschäftsführung und Aufsichtsgremien erwarten."
      chips={["Kapitalwert & IRR", "Sensitivität (Tornado)", "DSCR für die Kreditvariante", "CO₂-Textbaustein", "PDF nach E-Mail-Bestätigung"]}
      app={{
        name: "Ökovolt Investitionsantrag Photovoltaik",
        description: "Erstellt einen Investitionsantrag für eine Photovoltaikanlage im Betrieb: Kapitalwert, interner Zinsfuß, Amortisation, Cashflow über 25 Jahre, Sensitivität, Schuldendienstdeckung und CO₂-Textbaustein.",
        featureList: ["Kapitalwert und interner Zinsfuß", "Cashflow über 25 Jahre", "Sensitivität als Tornado", "DSCR der Kreditvariante", "CO₂-Textbaustein mit Berichtsjahr", "PDF-Export"],
      }}
      rechner={<DossierAnsicht modus="antrag" />}
      erklaerung={
        <div className="space-y-4 text-[15.5px] leading-relaxed text-ink-700">
          <h2 className="ov-h3 text-ink-900">So entsteht der Investitionsantrag</h2>
          <p>
            Grundlage ist ein Projekt-Cashflow aus Eigentümersicht: Erzeugung nach spezifischem Ertrag und Degradation, davon der selbst genutzte Anteil zum vermiedenen Strompreis, der Überschuss
            zum Einspeisesatz, abzüglich Betriebskosten. Der Kapitalwert zinst die Überschüsse mit Ihrem Kalkulationszins ab; die Kreditvariante teilt die Annuität in Zins und Tilgung und weist je
            Jahr die Schuldendienstdeckung aus.
          </p>
          <p>
            Die Sensitivität verschiebt jeweils eine Größe – {SENSITIVITAET_VARIANTEN.map((v) => `${v.label} ${v.text}`).join(", ")} – und zeigt, wie stark sich der Kapitalwert bewegt. Der größte
            Hebel steht oben.
          </p>
          <p>
            Werte aus dem{" "}
            <Link href="/rechner/gewerbe-pv" className="font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
              Gewerbe-PV-Rechner
            </Link>{" "}
            kommen per Link mit ({URL_FELDER.map((f) => f.k).join(", ")}). Mehrere Ergebnisse für Bank oder Gemeinderat bündeln Sie im{" "}
            <Link href="/dossier" className="font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
              Business-Case-Dossier
            </Link>
            .
          </p>
        </div>
      }
      annahmen={[
        ["Betrachtung", "25 Jahre, netto, vor Ertragsteuern"],
        ["Spezifischer Ertrag (Standard)", `${zahl(INVESTITION.ertragProKwp)} kWh/kWp`],
        ["Strompreis (Standard)", `${zahl(INVESTITION.strompreisCt, 1)} ct/kWh netto`],
        ["Strompreissteigerung", `${prozent(INVESTITION.strompreisSteigerung)} je Jahr`],
        ["Degradation", `${prozent(INVESTITION.degradation, 2)} je Jahr`],
        ["Kalkulationszins (Beispiel)", prozent(INVESTITION.kalkulationszins, 1)],
        ["Kredit (Beispiel)", `${prozent(INVESTITION.kredit.fremdkapitalAnteil)} FK, ${prozent(INVESTITION.kredit.zins, 1)}, ${INVESTITION.kredit.jahre} J.`],
        ["Investitionsfreibetrag", `${prozent(ANNAHMEN.ifb.satzOeko)} × ${prozent(ANNAHMEN.ifb.koest)} KöSt`],
        ["Stand", DOSSIER_STAND.label],
      ]}
      quellen={QUELLEN.map((q) => ({ name: q.titel, url: q.href }))}
      faq={FAQ}
      faqTitel="Investitionsantrag – häufige Fragen"
      cta={{
        eyebrow: "Gewerbe-PV",
        title: "Aus dem Antrag wird ein Angebot.",
        text: "Wir prüfen Dach, Lastgang und Netzanschluss und liefern die Zahlen, die in Ihren Investitionsantrag gehören.",
        primary: { label: "Angebot anfragen", href: "/angebot?objekt=gewerbe" },
        secondary: { label: "Business-Case-Dossier", href: "/dossier" },
      }}
    />
  );
}
