"use client";

import { useMemo, useState } from "react";
import { Sun, CloudSun, PlugZap, Car, Leaf } from "lucide-react";
import Regler from "./Regler";
import { WALLBOX } from "@/data/wallbox";

/**
 * „Das Auto lädt mit der Sonne": Tagesverlauf in Viertelstunden.
 * Vergleicht Sofortladen am Abend mit PV-Überschussladen für eine frei
 * wählbare Tagesstrecke. Vereinfachte Veranschaulichung (10-kWp-Anlage,
 * 11-kW-Wallbox, 1,4 kW Mindestladeleistung einphasig).
 */

const FARBEN = {
  pv: "#ffc53d",
  haus: "#dfe3ea",
  solar: "#669933",
  netz: "#1f5aa1",
};

const START = 5; // 05:00
const SCHRITTE = 76; // bis 24:00
const DT = 0.25; // Stunden je Schritt
// Preisannahmen Österreich (Richtwerte, Stand 09/2026) aus @/data/wallbox
const NETZ_CT = WALLBOX.preiseAt.netzstromCt;
const SOLAR_CT = WALLBOX.preiseAt.marktpreisCt; // entgangener Erlös aus der Einspeisung

// Auf 2 Nachkommastellen runden: Math.exp liefert in Node und Browser
// minimal unterschiedliche Ziffern – ungerundet gäbe es Hydration-Fehler.
const r2 = (n) => Math.round(n * 100) / 100;

const gauss = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);

function simuliere({ modus, km, sonnig }) {
  const bedarf = (km * WALLBOX.verbrauchProHundert) / 100;
  let rest = bedarf;
  const faktor = sonnig ? 1 : 0.38;

  return Array.from({ length: SCHRITTE }, (_, i) => {
    const t = START + i * DT;
    const mitte = t + DT / 2;
    const pv = mitte < 6 || mitte > 20.6 ? 0 : 7.4 * faktor * gauss(mitte, 13.2, 2.8);
    const haus = 0.32 + 0.6 * gauss(mitte, 7.4, 0.7) + 0.45 * gauss(mitte, 12.3, 0.8) + 0.85 * gauss(mitte, 19, 1.3);
    const ueberschuss = Math.max(pv - haus, 0);

    let laden = 0;
    if (rest > 0.001) {
      if (modus === "abend" && t >= 18) {
        laden = Math.min(11, rest / DT);
      } else if (modus === "sonne") {
        if (t >= 8 && t < 20) {
          // Phasenumschaltung: einphasig 1,4–3,7 kW, dreiphasig 4,1–11 kW
          if (ueberschuss >= 4.1) laden = Math.min(ueberschuss, 11);
          else if (ueberschuss >= 1.4) laden = Math.min(ueberschuss, 3.7);
          laden = Math.min(laden, rest / DT);
        } else if (t >= 22) {
          laden = Math.min(11, rest / DT); // Restmenge nachts aus dem Netz
        }
      }
    }
    rest -= laden * DT;
    const solar = Math.min(laden, ueberschuss);
    return { t, pv, haus, solar, netz: laden - solar };
  });
}

const fmt = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });
const uhr = (t) => `${String(Math.floor(t)).padStart(2, "0")}:${String(Math.round((t % 1) * 60)).padStart(2, "0")}`;

export default function UeberschussLaden() {
  const [modus, setModus] = useState("sonne");
  const [km, setKm] = useState(60);
  const [sonnig, setSonnig] = useState(true);

  const daten = useMemo(() => simuliere({ modus, km, sonnig }), [modus, km, sonnig]);
  const kwhSolar = daten.reduce((a, d) => a + d.solar * DT, 0);
  const kwhNetz = daten.reduce((a, d) => a + d.netz * DT, 0);
  const kwh = kwhSolar + kwhNetz;
  const anteil = kwh > 0 ? kwhSolar / kwh : 0;
  const kosten = (kwhSolar * SOLAR_CT + kwhNetz * NETZ_CT) / 100;
  const nurNetz = (kwh * NETZ_CT) / 100;

  const W = 720, H = 280, PAD_L = 40, PAD_B = 28, PAD_T = 24;
  const maxY = 12;
  const bw = (W - PAD_L) / SCHRITTE;
  const y = (v) => r2(PAD_T + (H - PAD_T - PAD_B) * (1 - v / maxY));
  const pvPfad =
    `M${PAD_L},${y(0)} ` +
    daten.map((d, i) => `L${r2(PAD_L + i * bw + bw / 2)},${y(d.pv)}`).join(" ") +
    ` L${W},${y(0)} Z`;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-5 border-b border-ink-100 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Ein Ladetag</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Wann lädt Ihr Auto – und womit?</h3>
        </div>
        <div role="group" aria-label="Lademodus" className="grid grid-cols-2 rounded-full bg-ink-100 p-1 sm:inline-flex sm:self-start lg:self-auto">
          {[
            { v: "abend", l: "Sofort abends" },
            { v: "sonne", l: "Solarüberschuss" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              aria-pressed={modus === o.v}
              onClick={() => setModus(o.v)}
              className={`h-11 whitespace-nowrap rounded-full px-3 text-[13.5px] font-semibold transition-all duration-300 sm:px-5 sm:text-[14px] ${
                modus === o.v ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-4 md:p-6">
          <div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full"
              role="img"
              aria-label={`Ladeverlauf ${modus === "sonne" ? "mit Sonnenüberschuss" : "abends sofort"}: ${fmt(kwh, 1)} kWh geladen, davon ${Math.round(anteil * 100)} Prozent Solarstrom`}
            >
              {[0, 3, 6, 9, 12].map((v) => (
                <g key={v}>
                  <line x1={PAD_L} x2={W} y1={y(v)} y2={y(v)} stroke="#eef0f4" strokeWidth="1" />
                  <text x={PAD_L - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-400 text-[11px] max-sm:text-[21px]">{v}</text>
                </g>
              ))}
              <text x={PAD_L - 8} y={10} textAnchor="end" className="fill-ink-400 text-[10px] max-sm:text-[19px]">kW</text>

              <path d={pvPfad} fill={FARBEN.pv} fillOpacity="0.22" stroke={FARBEN.pv} strokeWidth="2" strokeLinejoin="round" style={{ transition: "d 600ms cubic-bezier(.22,1,.36,1)" }} />

              {daten.map((d, i) => {
                const x = r2(PAD_L + i * bw + 0.6);
                const w = r2(bw - 1.2);
                const stapel = [
                  ["haus", d.haus],
                  ["solar", d.solar],
                  ["netz", d.netz],
                ];
                let basis = 0;
                return (
                  <g key={i}>
                    {stapel.map(([k, v]) => {
                      const y0 = basis;
                      basis += v;
                      return (
                        <rect
                          key={k}
                          x={x}
                          y={y(y0 + v)}
                          width={w}
                          height={r2(Math.max(y(y0) - y(y0 + v), 0))}
                          fill={FARBEN[k]}
                          rx="1.5"
                          style={{ transition: "y 500ms cubic-bezier(.22,1,.36,1), height 500ms cubic-bezier(.22,1,.36,1)" }}
                        />
                      );
                    })}
                    {(d.t - START) % 3 === 0 && (
                      <text x={r2(x + bw / 2)} y={H - 8} textAnchor="middle" className="fill-ink-400 text-[11px] max-sm:text-[21px]">{uhr(d.t)}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-2 text-[13px] text-ink-600">
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] ring-2 ring-sun-400" style={{ background: "rgba(255,197,61,.22)" }} />PV-Erzeugung</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: FARBEN.haus }} />Haushalt</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: FARBEN.solar }} />Auto lädt Solarstrom</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: FARBEN.netz }} />Auto lädt Netzstrom</li>
          </ul>

          <div className="mt-6 grid gap-6 border-t border-ink-100 px-2 pt-6 md:grid-cols-[1fr_auto] md:items-end">
            <Regler
              id="wb-km"
              label="Gefahrene Strecke heute"
              wert={km}
              min={10}
              max={200}
              step={10}
              onChange={setKm}
              anzeige={`${km} km · ${fmt((km * WALLBOX.verbrauchProHundert) / 100)} kWh`}
            />
            <div role="group" aria-label="Wetter" className="inline-flex self-start rounded-full bg-ink-100 p-1 md:mb-3">
              {[
                { v: true, l: "Sonnig", i: Sun },
                { v: false, l: "Bewölkt", i: CloudSun },
              ].map((o) => (
                <button
                  key={o.l}
                  type="button"
                  aria-pressed={sonnig === o.v}
                  onClick={() => setSonnig(o.v)}
                  className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 ${
                    sonnig === o.v ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
                  }`}
                >
                  <o.i aria-hidden="true" className="h-4 w-4" />
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col border-t border-ink-100 bg-sand-50 p-6 md:p-8 lg:border-l lg:border-t-0">
          <p className="flex items-center gap-2 text-[13px] text-ink-500">
            <Car aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Geladene Energie: <span className="ov-num font-semibold text-ink-800">{fmt(kwh, 1)} kWh</span>
          </p>
          {/* Akku-Balken: Anteil Solar / Netz */}
          <div className="mt-3 flex h-11 overflow-hidden rounded-xl bg-white p-1 ring-1 ring-ink-200" aria-hidden="true">
            <div className="h-full rounded-l-lg bg-ov-500 transition-all duration-700" style={{ width: `${r2(anteil * 100)}%` }} />
            <div className="h-full rounded-r-lg bg-navy-500 transition-all duration-700" style={{ width: `${r2((1 - anteil) * 100)}%` }} />
          </div>

          <p className="mt-7 flex items-center gap-2 text-[13px] text-ink-500">
            <Leaf aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Solaranteil der Ladung
          </p>
          <p className="ov-num mt-1 font-display text-[44px] font-extrabold leading-none tracking-tight text-ink-900">{Math.round(anteil * 100)} %</p>

          <dl className="mt-7 space-y-3 border-t border-ink-200 pt-6 text-[14px]">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-500">Kosten dieser Ladung</dt>
              <dd className="ov-num font-display text-[20px] font-extrabold text-ink-900">{fmt(kosten, 2)} €</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-500">Nur mit Netzstrom</dt>
              <dd className="ov-num font-semibold text-ink-600">{fmt(nurNetz, 2)} €</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-ink-500"><PlugZap aria-hidden="true" className="h-3.5 w-3.5" />Aus dem Netz</dt>
              <dd className="ov-num font-semibold text-ink-600">{fmt(kwhNetz, 1)} kWh</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Vereinfachte Veranschaulichung: 10-kWp-Anlage, 11-kW-Wallbox, {WALLBOX.verbrauchProHundert} kWh/100 km. Beim Überschussladen ist das Auto ab 8 Uhr zu Hause
        (z. B. Wochenende, Homeoffice); was bis 20 Uhr fehlt, lädt ab 22 Uhr aus dem Netz. Kosten: Netzstrom {fmt(NETZ_CT)} ct/kWh, Solarstrom mit dem
        entgangenen Marktpreis bei Einspeisung von {fmt(SOLAR_CT, 1)} ct/kWh bewertet (Richtwerte Österreich, Stand 2026).
      </p>
    </div>
  );
}
