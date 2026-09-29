// src/components/Partner/Zusammenarbeit.js
//
// „So arbeiten wir zusammen“ – animiertes Flussdiagramm für /partner:
// Ökovolt stellt bereit → Ihr Betrieb baut → Gemeinsam in Betrieb.
// Reines CSS (Energiefluss-Punkte entlang der Verbindungen), respektiert
// prefers-reduced-motion. Server-Komponente.

import { Boxes, ClipboardCheck, GraduationCap, FileCheck2, Handshake, HardHat, MonitorDot, PencilRuler, PlugZap, Sun, Wrench, Zap } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const STUFEN = [
  {
    kopf: "Ökovolt stellt bereit",
    titel: "Die Plattform",
    ton: "navy",
    punkte: [
      { icon: Sun, t: "Projekte in Ihrer Region", x: "mit klar beschriebenem Leistungsumfang" },
      { icon: Boxes, t: "Material aus dem Zentraleinkauf", x: "geliefert nach Projektplan" },
      { icon: PencilRuler, t: "Geprüfte Planung", x: "Belegung, Strings, Verteiler, Statik" },
      { icon: MonitorDot, t: "Parkregler, Fernwartung, SCADA", x: "aus eigener Entwicklung" },
      { icon: GraduationCap, t: "Schulungen & Technik-Support", x: "Standards, Dokumentation, Rückfragen auf der Baustelle" },
    ],
  },
  {
    kopf: "Ihr Betrieb baut",
    titel: "Das Handwerk",
    ton: "gruen",
    punkte: [
      { icon: HardHat, t: "Montage DC & Unterkonstruktion", x: "nach unseren Standards" },
      { icon: PlugZap, t: "AC-Anschluss & Verteilerbau", x: "Wechselrichter, Speicher, Übergabe" },
      { icon: Wrench, t: "Prüfung & Messung", x: "nach ÖVE/ÖNORM E 8101" },
      { icon: FileCheck2, t: "Dokumentation", x: "nach unseren Vorgaben" },
    ],
  },
  {
    kopf: "Gemeinsam",
    titel: "In Betrieb",
    ton: "sonne",
    punkte: [
      { icon: Handshake, t: "Feste Projektleitung", x: "als Ansprechpartner auf der Baustelle" },
      { icon: Zap, t: "Inbetriebnahme", x: "mit Leittechnik-Team und Netzbetreiber" },
      { icon: ClipboardCheck, t: "Übergabe & Abrechnung", x: "nach Aufmaß oder Pauschale" },
    ],
  },
];

const TON = {
  navy: { karte: "bg-navy-950 text-white", icon: "bg-white/10 text-ov-300", kopf: "text-ov-300", sub: "text-white/55", nummer: "bg-ov-500 text-white" },
  gruen: { karte: "bg-white text-ink-900 ring-2 ring-ov-400 shadow-[0_30px_60px_-35px_rgba(102,153,51,0.6)]", icon: "bg-ov-50 text-ov-700", kopf: "text-ov-700", sub: "text-ink-500", nummer: "bg-ov-600 text-white" },
  sonne: { karte: "bg-sand-50 text-ink-900 ring-1 ring-ink-200/70", icon: "bg-sun-300/30 text-sun-500", kopf: "text-sun-500", sub: "text-ink-500", nummer: "bg-sun-400 text-navy-950" },
};

function Fluss({ vertikal = false }) {
  return (
    <div aria-hidden="true" className={`relative ${vertikal ? "mx-auto h-12 w-px" : "h-px w-full"} bg-gradient-to-r from-ov-300 to-ov-500`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`ov-zf-punkt absolute h-2 w-2 rounded-full bg-ov-500 shadow-[0_0_10px_2px_rgba(140,186,88,0.8)] ${vertikal ? "-left-[3.5px] top-0" : "-top-[3.5px] left-0"}`}
          style={{ animationDelay: `${i * 0.7}s`, animationName: vertikal ? "ov-zf-runter" : "ov-zf-rechts" }}
        />
      ))}
    </div>
  );
}

export default function Zusammenarbeit() {
  return (
    <div>
      <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)_64px_minmax(0,0.9fr)]">
        {STUFEN.map((s, i) => {
          const t = TON[s.ton];
          return [
            <Reveal key={s.titel} delay={i * 160} className={`relative flex flex-col rounded-[2rem] p-6 md:p-7 ${t.karte}`}>
              <div className="flex items-center gap-3">
                <span className={`ov-num flex h-9 w-9 items-center justify-center rounded-full font-display text-[15px] font-extrabold ${t.nummer}`}>{i + 1}</span>
                <div>
                  <p className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${t.kopf}`}>{s.kopf}</p>
                  <h3 className="font-display text-[20px] font-extrabold leading-tight">{s.titel}</h3>
                </div>
              </div>
              <ul className="mt-6 space-y-3.5">
                {s.punkte.map((p) => (
                  <li key={p.t} className="flex items-start gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
                      <p.icon aria-hidden="true" className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold leading-snug">{p.t}</span>
                      <span className={`block text-[13px] leading-snug ${t.sub}`}>{p.x}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>,
            i < STUFEN.length - 1 ? (
              <div key={`f${i}`} className="flex items-center py-2 lg:py-0">
                <div className="hidden w-full lg:block">
                  <Fluss />
                </div>
                <div className="w-full lg:hidden">
                  <Fluss vertikal />
                </div>
              </div>
            ) : null,
          ];
        })}
      </div>
      <style>{`
        @keyframes ov-zf-rechts { from { left: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { left: calc(100% - 8px); opacity: 0; } }
        @keyframes ov-zf-runter { from { top: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { top: calc(100% - 8px); opacity: 0; } }
        .ov-zf-punkt { animation-duration: 2.1s; animation-timing-function: linear; animation-iteration-count: infinite; opacity: 0; }
        @media (prefers-reduced-motion: reduce) { .ov-zf-punkt { animation: none; opacity: 0; } }
      `}</style>
    </div>
  );
}
