import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { Tabelle } from "./Bausteine";

/**
 * Verguetungssaetze als echte <table> - wichtig, weil Google Tabellen fuer
 * Featured Snippets auswertet. Werte kommen ausschliesslich aus
 * @/data/einspeiseverguetung.
 */
export default function VerguetungsTabelle() {
  return (
    <Tabelle
      caption={`Einspeisevergütung in Cent pro Kilowattstunde nach Anlagengröße, gültig ab ${VERGUETUNG.gueltigAbLabel}`}
      kopf={["Anlagengröße", "Überschusseinspeisung", "Volleinspeisung"]}
      zeilen={VERGUETUNG.saetze.map((s) => [s.klasse, `${ct(s.teileinspeisung)} ct/kWh`, `${ct(s.volleinspeisung)} ct/kWh`])}
      hervorheben={1}
      markierteZeile={0}
      fussnote={
        <>
          Sätze für Inbetriebnahmen vom {VERGUETUNG.gueltigAbLabel} bis 31. Januar 2027. Die Staffelung gilt anteilig: Bei einer 15-kWp-Anlage
          werden die ersten 10 kWp mit dem höheren Satz vergütet, die restlichen 5 kWp mit dem Satz der nächsten Stufe. Quelle:{" "}
          <a href={VERGUETUNG.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
            {VERGUETUNG.quelle.name}
          </a>
          .
        </>
      }
    />
  );
}
