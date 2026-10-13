"use client";

// src/components/GewerbeUnikat/K3Bildtext.js
//
// K3 · Kernsatz der Bildunterschrift – Beispielbetrieb (SSR, children vom Server) oder eigener Lastgang
// (nach Lead-Gate). Jury 13.10.2026: Nach eigenem Lastgang stand hier weiter „Synthetischer Beispielbetrieb
// (884 MWh …)“. Jetzt übernimmt der Satz die Empfehlung des Stundenmodells für die eigenen Viertelstunden.
// Leicht, ohne Bibliothek; im ersten Render (Server und Hydrierung) stehen exakt die Server-Texte.

import { useGewerbeDaten } from "./_daten";
import { KENNZEICHNUNG, zahl } from "./_tokens";

const AUSRICHTUNG = { ostwest: "Ost-West", sued: "Süd", flach: "flach aufgeständert" };

export default function K3Bildtext({ children, ortNamen = {} }) {
  const last = useGewerbeDaten((s) => s.last);
  const pv = useGewerbeDaten((s) => s.pv);
  if (last?.quelle !== "eigen" || !pv?.empfehlung) return children;
  const e = pv.empfehlung;
  const ort = ortNamen[pv.ortId] || pv.ortId;
  return (
    <span data-quelle="eigen">
      Ihr Lastgang ({zahl(last.jahresverbrauch / 1000)} MWh im Jahr{last.hochgerechnet ? ", hochgerechnet" : ""}; PV im Modell {ort} · {AUSRICHTUNG[pv.ausrichtung] || pv.ausrichtung}): Bei{" "}
      <span className="ov-num">{zahl(e.kwp)}</span> kWp nutzt Ihr Betrieb <span className="ov-num">{zahl(e.evQuote * 100)}</span> % des Solarstroms selbst und deckt{" "}
      <span className="ov-num">{zahl(e.autarkie * 100)}</span> % seines Verbrauchs – {KENNZEICHNUNG.richtwert}.
    </span>
  );
}
