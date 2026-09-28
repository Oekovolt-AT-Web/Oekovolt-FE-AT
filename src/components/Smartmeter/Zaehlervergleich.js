"use client";

import { useEffect, useState } from "react";
import { Check, Minus, X } from "lucide-react";

/**
 * Umschalter: Ferraris-Zähler, Smart Meter mit Opt-out, Smart Meter mit
 * Viertelstundenwerten (Österreich, ElWG § 54). Links eine stilisierte
 * Zähler-Grafik, rechts die Eigenschaften. Die internen IDs (mme, imsys)
 * bleiben aus Kompatibilitätsgründen.
 * Quellen: Oesterreichs Energie (Rollout ~97 % Ende 2025),
 * Netz NÖ zu ElWG § 54 (https://netz-noe.at/energiezukunft/elwg-zu-smart-meter).
 */

const ZAEHLER = [
  {
    id: "ferraris",
    tab: "Ferraris-Zähler",
    kurz: "Analog",
    titel: "Der alte Drehscheibenzähler",
    text: "Eine Aluminiumscheibe dreht sich, ein Zählwerk summiert die Kilowattstunden, abgelesen wird einmal im Jahr. In Österreich ist der Tausch weitgehend abgeschlossen – Ende 2025 hatten rund 97 % der Zählpunkte ein digitales Messgerät.",
    eigenschaften: [
      ["Messung", "nur Gesamtverbrauch", 0],
      ["Verbrauch einsehen", "Ablesen am Zähler", 0],
      ["Datenübertragung", "keine", 0],
      ["Dynamischer Stromtarif", "nicht möglich", 0],
      ["Energiegemeinschaft", "nicht möglich", 0],
      ["Mit PV, Wallbox, Wärmepumpe", "wird getauscht", 1],
    ],
  },
  {
    id: "mme",
    tab: "Smart Meter · Opt-out",
    kurz: "Opt-out",
    titel: "Smart Meter mit reduzierter Auslesung",
    text: "Beim Opt-out nach § 54 Abs. 2 ElWG werden Tages- und Viertelstundenwerte weder gespeichert noch übertragen – der Zähler liefert nur, was für die Abrechnung nötig ist. Nicht möglich bei PV-Anlage, Wallbox, Wärmepumpe, Speicher, dynamischem Tarif oder Teilnahme an einer Energiegemeinschaft.",
    eigenschaften: [
      ["Messung", "Zählerstände für die Abrechnung", 1],
      ["Verbrauch einsehen", "am Display, Jahresabrechnung", 1],
      ["Datenübertragung", "nur Abrechnungswerte", 1],
      ["Dynamischer Stromtarif", "nicht möglich", 0],
      ["Energiegemeinschaft", "nicht möglich", 0],
      ["Mit PV, Wallbox, Wärmepumpe", "nicht zulässig", 0],
    ],
  },
  {
    id: "imsys",
    tab: "Smart Meter · Viertelstunde",
    kurz: "Opt-in",
    titel: "Viertelstundenwerte im Kundenportal",
    text: "Der Smart Meter misst Bezug und – bei PV-Anlagen – Einspeisung in Viertelstundenwerten und überträgt sie verschlüsselt an den Netzbetreiber. Im Kundenportal Ihres Netzbetreibers sehen Sie die Werte in der Regel am Folgetag; Echtzeitwerte liefert die Kundenschnittstelle des Zählers.",
    eigenschaften: [
      ["Messung", "alle 15 Minuten", 2],
      ["Verbrauch einsehen", "Kundenportal des Netzbetreibers", 2],
      ["Datenübertragung", "verschlüsselt an den Netzbetreiber", 2],
      ["Dynamischer Stromtarif", "möglich", 2],
      ["Energiegemeinschaft", "möglich", 2],
      ["Mit PV, Wallbox, Wärmepumpe", "Standard", 2],
    ],
  },
];

function Grafik({ id, bewegung }) {
  return (
    <svg viewBox="0 0 320 300" className="h-auto w-full max-w-[320px]" aria-hidden="true">
      <defs>
        <linearGradient id="zv-gehaeuse" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef0f4" />
        </linearGradient>
      </defs>
      {/* Kommunikationsmodul (nur Viertelstunden-Messung) */}
      <g style={{ opacity: id === "imsys" ? 1 : 0, transform: id === "imsys" ? "translateX(0)" : "translateX(20px)", transition: "all 500ms cubic-bezier(.22,1,.36,1)" }}>
        <rect x="214" y="92" width="92" height="124" rx="14" fill="#03122b" />
        <rect x="228" y="108" width="64" height="8" rx="4" fill="#669933" />
        <circle cx="236" cy="200" r="4" fill="#8cba58">
          {bewegung && <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />}
        </circle>
        <text x="260" y="162" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">FUNK · PLC</text>
        <path d="M244 60 a24 24 0 0 1 32 0 M236 50 a36 36 0 0 1 48 0" fill="none" stroke="#669933" strokeWidth="4" strokeLinecap="round" />
        <circle cx="260" cy="72" r="5" fill="#669933" />
      </g>

      {/* Zählergehäuse */}
      <g style={{ transform: id === "imsys" ? "translateX(-8px)" : "translateX(46px)", transition: "transform 500ms cubic-bezier(.22,1,.36,1)" }}>
        <rect x="20" y="30" width="180" height="240" rx="22" fill="url(#zv-gehaeuse)" stroke="#dfe3ea" strokeWidth="2" />
        <rect x="40" y="52" width="140" height="70" rx="10" fill={id === "ferraris" ? "#f5f3ea" : "#151a24"} />
        {id === "ferraris" ? (
          <g>
            {["0", "4", "5", "1", "7", "2"].map((z, i) => (
              <g key={i}>
                <rect x={50 + i * 21} y="70" width="18" height="30" rx="3" fill={i === 5 ? "#c0392b" : "#252b37"} />
                <text x={59 + i * 21} y="92" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="monospace">{z}</text>
              </g>
            ))}
          </g>
        ) : (
          <g>
            <text x="170" y="96" textAnchor="end" fill="#aed083" fontSize="26" fontFamily="monospace" fontWeight="700">04517,2</text>
            <text x="170" y="114" textAnchor="end" fill="#8cba58" fontSize="10" fontFamily="monospace">kWh</text>
            {id === "imsys" && <text x="50" y="72" fill="#8cba58" fontSize="10" fontFamily="monospace">15 min</text>}
          </g>
        )}
        {id === "ferraris" ? (
          <g>
            <rect x="40" y="150" width="140" height="44" rx="8" fill="#eef0f4" />
            <ellipse cx="110" cy="172" rx="60" ry="8" fill="#c4cad5" />
            <rect x="104" y="164" width="12" height="16" rx="2" fill="#c0392b">
              {bewegung && <animate attributeName="x" values="56;160;56" dur="3s" repeatCount="indefinite" />}
            </rect>
          </g>
        ) : (
          <g>
            <circle cx="60" cy="168" r="6" fill="#669933" />
            <text x="74" y="172" fill="#6b7486" fontSize="11">Betrieb</text>
            <rect x="40" y="194" width="140" height="10" rx="5" fill="#dfe3ea" />
          </g>
        )}
        <text x="110" y="248" textAnchor="middle" fill="#97a0b0" fontSize="11" fontWeight="600" letterSpacing="2">
          {id === "ferraris" ? "ANALOG" : id === "mme" ? "DIGITAL" : "SMART"}
        </text>
      </g>
      {/* Kabel zum Kommunikationsmodul */}
      <path d="M192 170 C 206 170, 204 150, 214 150" fill="none" stroke="#669933" strokeWidth="3" style={{ opacity: id === "imsys" ? 1 : 0, transition: "opacity 400ms" }} />
    </svg>
  );
}

const Status = ({ s }) =>
  s === 2 ? (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white"><Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /></span>
  ) : s === 1 ? (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun-300 text-ink-900"><Minus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /></span>
  ) : (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-500"><X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /></span>
  );

export default function Zaehlervergleich() {
  const [aktiv, setAktiv] = useState("imsys");
  const z = ZAEHLER.find((x) => x.id === aktiv);
  // Endlos-Animationen nur ohne „Bewegung reduzieren" (erst nach dem Mounten, kein Hydration-Unterschied)
  const [bewegung, setBewegung] = useState(false);
  useEffect(() => setBewegung(!window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div role="tablist" aria-label="Zählerarten" className="grid grid-cols-3 border-b border-ink-100">
        {ZAEHLER.map((x) => (
          <button
            key={x.id}
            id={`zv-tab-${x.id}`}
            type="button"
            role="tab"
            aria-selected={aktiv === x.id}
            aria-controls="zv-panel"
            onClick={() => setAktiv(x.id)}
            className={`relative min-h-16 px-2 py-4 text-center transition-colors md:px-6 ${aktiv === x.id ? "bg-white text-ink-900" : "bg-sand-50 text-ink-600 hover:text-ink-800"}`}
          >
            <span className="block text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ov-600">{x.kurz}</span>
            <span className="mt-1 block font-display text-[13.5px] font-bold leading-tight md:text-[16px]">{x.tab}</span>
            <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[3px] bg-ov-500 transition-transform duration-300 ${aktiv === x.id ? "scale-x-100" : "scale-x-0"}`} />
          </button>
        ))}
      </div>

      <div id="zv-panel" role="tabpanel" aria-labelledby={`zv-tab-${aktiv}`} className="grid grid-cols-1 items-center gap-8 p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="flex justify-center rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-100">
          <Grafik id={aktiv} bewegung={bewegung} />
        </div>
        <div key={aktiv} className="ov-tab-panel">
          <h3 className="ov-h3 text-ink-900">{z.titel}</h3>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-600">{z.text}</p>
          <dl className="mt-6 divide-y divide-ink-100 rounded-2xl ring-1 ring-ink-200/70">
            {z.eigenschaften.map(([k, v, s]) => (
              <div key={k} className="flex items-center gap-3 px-4 py-3 text-[14.5px]">
                <Status s={s} />
                <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <dt className="text-[13px] text-ink-500 sm:text-[14.5px]">{k}</dt>
                  <dd className="font-semibold text-ink-900 sm:text-right">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
