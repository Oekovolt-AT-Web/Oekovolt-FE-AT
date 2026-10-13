"use client";

// src/components/GewerbeUnikat/K5Bildtext.js
//
// K5 · Fazit unter Spitzen-Uhr und Türmen – Beispielbetrieb (SSR, children vom Server) oder eigener Lastgang
// (nach Lead-Gate). Jury 13.10.2026: Nach eigenem Lastgang stand hier weiter „291,5 kW … 85 kW / 55 kWh“.
// Jetzt rechnet der Satz mit den eigenen Monatsspitzen, der PV-Empfehlung und der Kappungstabelle aus dem
// Worker (Deckel bei 74 % der Jahresspitze – derselbe Startpunkt wie im Beispiel). Leistungspreis wie im
// Beispiel Netzebene 6 Oberösterreich (vom Server, offen benannt). Ohne Bibliothek.

import { useGewerbeDaten } from "./_daten";
import { KENNZEICHNUNG, euroRund, zahl } from "./_tokens";
import { minutenVon, uhrzeit } from "./K1Gestell";
import { spitzenMitPv } from "./K1Live";

const NB = " ";
const DECKEL_ANTEIL = 230 / 312; // Startdeckel des Beispiels (230 kW bei 312 kW Jahresspitze)

let gemerkt = { last: null, pv: null, kapp: null, w: null };
function werte(last, pv, kapp) {
  if (gemerkt.last === last && gemerkt.pv === pv && gemerkt.kapp === kapp) return gemerkt.w;
  const min = last.monate.map((m) => minutenVon(m.spitzeT));
  const ziel = last.spitze.kw * DECKEL_ANTEIL;
  let zeile = null;
  for (const z of kapp?.zeilen || []) {
    if (!z.moeglich) continue;
    if (!zeile || Math.abs(z.schwelle - ziel) < Math.abs(zeile.schwelle - ziel)) zeile = z;
  }
  const w = {
    von: uhrzeit(Math.min(...min)),
    bis: uhrzeit(Math.max(...min)),
    n: last.monate.length,
    kwp: pv.empfehlung.kwp,
    mittel: last.mittelMonatsspitze,
    mittelPv: spitzenMitPv(last.reihe, pv.reihe, pv.empfehlung.kwp, last.intervall),
    zeile,
  };
  gemerkt = { last, pv, kapp, w };
  return w;
}

export default function K5Bildtext({ children, lp }) {
  const last = useGewerbeDaten((s) => s.last);
  const pv = useGewerbeDaten((s) => s.pv);
  const kapp = useGewerbeDaten((s) => s.kapp);
  if (last?.quelle !== "eigen" || !pv?.reihe || !last?.reihe) return children;
  const w = werte(last, pv, kapp);
  const z = w.zeile;
  return (
    <span data-quelle="eigen">
      In Ihrem Lastgang liegen die {zahl(w.n)} Monatsspitzen zwischen {w.von} und {w.bis}
      {NB}Uhr. Eine {zahl(w.kwp)}-kWp-Anlage senkt ihr Mittel im Modell von <span className="ov-num">{zahl(w.mittel, 1)}</span> auf{" "}
      <span className="ov-num whitespace-nowrap">{`${zahl(w.mittelPv, 1)}${NB}kW`}</span>
      {z ? (
        <>
          ; ein Speicher mit <span className="ov-num whitespace-nowrap">{`${zahl(z.leistungKw)}${NB}kW / ${zahl(z.nennKwh)}${NB}kWh`}</span> (Deckel {zahl(z.schwelle)}
          {NB}kW) senkt es um <span className="ov-num whitespace-nowrap">{`${zahl(z.senkungKw, 1)}${NB}kW`}</span>{" "}
          <span className="whitespace-nowrap">(≈ {euroRund(z.senkungKw * lp)}/Jahr</span> bei Netzebene 6, OÖ – {KENNZEICHNUNG.richtwert}).
        </>
      ) : (
        "."
      )}
    </span>
  );
}
