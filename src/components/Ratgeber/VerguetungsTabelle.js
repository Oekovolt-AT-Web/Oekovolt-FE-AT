import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { Tabelle } from "./Bausteine";

const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const monatLabel = (iso) => `${MONATE[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const ct3 = (v) => v.toFixed(3).replace(".", ",");

/**
 * Einspeise-Erlöse Österreich als echte <table> (Featured Snippets).
 * Werte kommen ausschließlich aus @/data/einspeiseverguetung.
 *
 * In Österreich gibt es keine gesetzlich fixe Einspeisevergütung wie in
 * Deutschland – die Tabelle zeigt daher je nach `art`:
 *   "monate"     OeMAG-Marktpreis PV der letzten Monate + Referenzmarktwert (Standard)
 *   "quartale"   Quartals-Marktpreise der E-Control (§ 41 ÖSG 2012)
 *   "rechensatz" die vorsichtigen Rechensätze der Ökovolt-Rechner je Größenklasse
 */
export default function VerguetungsTabelle({ art = "monate" }) {
  if (art === "quartale") {
    return (
      <Tabelle
        caption="Quartals-Marktpreis der E-Control in Cent pro Kilowattstunde (§ 41 Abs. 1 ÖSG 2012)"
        kopf={["Quartal", "Marktpreis"]}
        zeilen={VERGUETUNG.marktpreis.quartale.map((q) => [q.quartal, `${ct3(q.ct)} ct/kWh`])}
        hervorheben={1}
        markierteZeile={VERGUETUNG.marktpreis.quartale.length - 1}
        fussnote={
          <>
            Der Quartals-Marktpreis bildet die Obergrenze, 60 % davon die Untergrenze des monatlichen OeMAG-Marktpreises für Photovoltaik (seit 2026 jeweils abzüglich
            Ausgleichsenergie von {ct3(VERGUETUNG.marktpreis.ausgleichsenergieAbzug2026)} ct/kWh). Quelle:{" "}
            <a href={VERGUETUNG.marktpreis.quelleQuartale.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
              {VERGUETUNG.marktpreis.quelleQuartale.name}
            </a>
            .
          </>
        }
      />
    );
  }

  if (art === "rechensatz") {
    return (
      <Tabelle
        caption={`Rechensatz für eingespeisten Überschussstrom in den Ökovolt-Rechnern, Stand ${VERGUETUNG.gueltigAbLabel}`}
        kopf={["Anlagengröße", "Rechensatz", "Typische Abnehmer"]}
        zeilen={VERGUETUNG.saetze.map((s) => [s.klasse, `${ct(s.teileinspeisung)} ct/kWh`, s.abnehmer])}
        hervorheben={1}
        markierteZeile={0}
        fussnote={
          <>
            Vorsichtige Annahme, keine Zusage: Einspeiseerlöse sind in Österreich marktabhängig und nicht gesetzlich garantiert; Voll- und Überschusseinspeisung werden gleich
            vergütet. Einspeisetarife der Energieversorger lagen 2026 meist bei {VERGUETUNG.tarife.min} bis {VERGUETUNG.tarife.max} ct/kWh. Quelle Marktpreis:{" "}
            <a href={VERGUETUNG.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
              {VERGUETUNG.quelle.name}
            </a>
            .
          </>
        }
      />
    );
  }

  const rmw = Object.fromEntries(VERGUETUNG.referenzmarktwert.map((r) => [r.monat, r.ct]));
  const monate = [...VERGUETUNG.marktpreis.monate].reverse();
  return (
    <Tabelle
      caption="OeMAG-Marktpreis für Photovoltaik und Referenzmarktwert PV in Cent pro Kilowattstunde, je Monat"
      kopf={["Monat", "OeMAG-Marktpreis PV", "Referenzmarktwert PV"]}
      zeilen={monate.map((m) => [monatLabel(m.monat), `${ct3(m.ct)} ct/kWh`, rmw[m.monat] != null ? `${ct(rmw[m.monat])} ct/kWh` : "–"])}
      hervorheben={1}
      markierteZeile={0}
      fussnote={
        <>
          Der OeMAG-Marktpreis wird monatlich rückwirkend ermittelt (§ 13 Abs. 3 i. V. m. § 41 Abs. 2a ÖSG 2012) und gilt für Anlagen unter 500 kWp mit Abnahmevertrag. Der
          Referenzmarktwert (§ 13 EAG, E-Control) ist Basis vieler Einspeisetarife der Energieversorger. Alle Werte netto. Quelle:{" "}
          <a href={VERGUETUNG.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
            {VERGUETUNG.quelle.name}
          </a>
          , E-Control.
        </>
      }
    />
  );
}
