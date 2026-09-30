"use client";

import { useId, useMemo, useState } from "react";
import { useBreite, Tooltip } from "@/components/Rechner/bausteine";
import { achse } from "@/lib/prognose/auswertung";
import { intervall, tagKurz, wienZeit, zahl } from "@/lib/prognose/format";

// Farben nur im Diagramm (Tokens aus globals.css als Hex, weil SVG-Attribute)
const F = {
  linie: "#558227", // ov-600
  flaecheOben: "rgba(102,153,51,0.30)",
  flaecheUnten: "rgba(102,153,51,0.02)",
  band: "rgba(102,153,51,0.20)",
  bandKante: "rgba(85,130,39,0.45)",
  preis: "#1f5aa1", // navy-500
  gold: "rgba(255,197,61,0.30)", // sun-400
  goldKante: "#f5a70f", // sun-500
  raster: "#eef0f4",
  basis: "#c4cad5",
  text: "#6b7486",
  tag: "#394050",
};

/**
 * Stündliche PV-Leistung (kW) mit Unsicherheitsband (Ensemble P10–P90), Day-Ahead-Preis (ct/kWh,
 * rechte Achse) und markierten „Goldenen Stunden“. Eigenes SVG, keine Bibliothek.
 * Bedienung: Maus/Touch oder Pfeiltasten (Fokus auf dem Diagramm), Tabellenansicht darunter.
 *
 * stunden: [{ beginn, ende, kw, kwP10, kwP90 }], preise: Map(beginn → eurMwh), gold: Set(beginn)
 */
export default function PrognoseDiagramm({ stunden, preise, gold, jetzt }) {
  const [ref, breite] = useBreite(900);
  const [hover, setHover] = useState(null);
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const n = stunden.length;
  const mitPreis = stunden.some((s) => preise.has(s.beginn));
  const mitBand = stunden.some((s) => Number.isFinite(s.kwP90));

  const schmal = breite < 640;
  const H = schmal ? 270 : 360;
  const PAD = { l: schmal ? 40 : 52, r: mitPreis ? (schmal ? 36 : 48) : 14, t: 34, b: 30 };
  const plotW = Math.max(breite - PAD.l - PAD.r, 60);
  const plotH = H - PAD.t - PAD.b;
  const w = plotW / Math.max(n, 1);

  const achsen = useMemo(() => {
    const maxKw = Math.max(0.1, ...stunden.map((s) => Math.max(s.kw, s.kwP90 ?? 0)));
    const ctWerte = stunden.filter((s) => preise.has(s.beginn)).map((s) => preise.get(s.beginn) / 10);
    return {
      kw: achse(0, maxKw * 1.05, schmal ? 4 : 5),
      ct: ctWerte.length ? achse(Math.min(0, ...ctWerte), Math.max(1, ...ctWerte), schmal ? 4 : 5) : null,
    };
  }, [stunden, preise, schmal]);

  const xMitte = (i) => PAD.l + (i + 0.5) * w;
  const yKw = (v) => PAD.t + (1 - (v - achsen.kw.von) / (achsen.kw.bis - achsen.kw.von)) * plotH;
  const yCt = (v) => (achsen.ct ? PAD.t + (1 - (v - achsen.ct.von) / (achsen.ct.bis - achsen.ct.von)) * plotH : 0);

  // Leistungslinie und Fläche (Punkte in der Intervallmitte, Anfang/Ende an den Rand gezogen)
  const punkte = stunden.map((s, i) => [xMitte(i), yKw(s.kw)]);
  const linie = punkte.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const boden = yKw(0);
  const flaeche = n ? `${linie}L${xMitte(n - 1).toFixed(1)},${boden.toFixed(1)}L${xMitte(0).toFixed(1)},${boden.toFixed(1)}Z` : "";

  // Band in zusammenhängenden Abschnitten
  const baender = [];
  let abschnitt = [];
  stunden.forEach((s, i) => {
    if (Number.isFinite(s.kwP10) && Number.isFinite(s.kwP90)) abschnitt.push(i);
    else if (abschnitt.length) {
      baender.push(abschnitt);
      abschnitt = [];
    }
  });
  if (abschnitt.length) baender.push(abschnitt);
  const bandPfade = baender
    .filter((a) => a.length > 1)
    .map((a) => {
      const oben = a.map((i, k) => `${k ? "L" : "M"}${xMitte(i).toFixed(1)},${yKw(stunden[i].kwP90).toFixed(1)}`).join("");
      const unten = [...a].reverse().map((i) => `L${xMitte(i).toFixed(1)},${yKw(stunden[i].kwP10).toFixed(1)}`).join("");
      return `${oben}${unten}Z`;
    });

  // Preis als Treppenlinie je Stunde (Lücken werden unterbrochen)
  let preisPfad = "";
  let offen = false;
  stunden.forEach((s, i) => {
    if (!preise.has(s.beginn)) {
      offen = false;
      return;
    }
    const y = yCt(preise.get(s.beginn) / 10).toFixed(1);
    const x0 = (PAD.l + i * w).toFixed(1);
    const x1 = (PAD.l + (i + 1) * w).toFixed(1);
    preisPfad += offen ? `V${y}H${x1}` : `M${x0},${y}H${x1}`;
    offen = true;
  });

  // Tage und Stundenmarken
  const zeiten = stunden.map((s) => wienZeit(s.beginn));
  const tagesGrenzen = [];
  zeiten.forEach((z, i) => {
    if (i === 0 || z.stunde === 0) tagesGrenzen.push(i);
  });
  const tickAbstand = schmal ? 12 : 6;
  const ticks = zeiten.map((z, i) => ({ z, i })).filter(({ z, i }) => z.stunde % tickAbstand === 0 && z.stunde !== 0 && i > 0);

  const jetztIndex = stunden.findIndex((s) => jetzt >= s.beginn && jetzt < s.ende);
  const jetztX = jetztIndex >= 0 ? PAD.l + (jetztIndex + (jetzt - stunden[jetztIndex].beginn) / 3600000) * w : null;

  const idx = hover != null ? Math.min(Math.max(hover, 0), n - 1) : null;
  const hs = idx != null ? stunden[idx] : null;

  const zeiger = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientX - r.left - PAD.l) / w);
    setHover(Math.min(Math.max(i, 0), n - 1));
  };
  const tasten = (e) => {
    const start = idx ?? Math.max(jetztIndex, 0);
    const sprung = e.shiftKey ? 6 : 1;
    if (e.key === "ArrowRight") setHover(idx == null ? start : Math.min(start + sprung, n - 1));
    else if (e.key === "ArrowLeft") setHover(idx == null ? start : Math.max(start - sprung, 0));
    else if (e.key === "Home") setHover(0);
    else if (e.key === "End") setHover(n - 1);
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };

  const spitze = stunden.reduce((a, b) => (b.kw > (a?.kw ?? -1) ? b : a), null);
  const beschreibung = `Diagramm der PV-Prognose über ${n} Stunden. Höchste Leistung ${spitze ? `${zahl(spitze.kw, 1)} kW am ${tagKurz(spitze.beginn)} ${intervall(spitze.beginn, spitze.ende)}` : "–"}. ${gold.size} goldene Stunden markiert.${mitPreis ? " Day-Ahead-Preis auf der rechten Achse." : ""} Mit den Pfeiltasten durch die Stunden blättern.`;

  return (
    <div ref={ref} className="relative">
      <div
        tabIndex={0}
        role="img"
        aria-label={beschreibung}
        onKeyDown={tasten}
        onBlur={() => setHover(null)}
        className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4"
      >
        <svg width={breite} height={H} viewBox={`0 0 ${breite} ${H}`} className="block max-w-full select-none" aria-hidden="true">
          <defs>
            <linearGradient id={`pg-flaeche-${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={F.flaecheOben} />
              <stop offset="100%" stopColor={F.flaecheUnten} />
            </linearGradient>
          </defs>

          {/* Goldene Stunden */}
          {stunden.map((s, i) =>
            gold.has(s.beginn) ? (
              <g key={`g${s.beginn}`}>
                <rect x={PAD.l + i * w} y={PAD.t} width={w} height={plotH} fill={F.gold} />
                <rect x={PAD.l + i * w} y={PAD.t - 3} width={w} height={3} fill={F.goldKante} />
              </g>
            ) : null
          )}

          {/* Raster und linke Achse (kW) */}
          {achsen.kw.ticks.map((v) => (
            <g key={`k${v}`}>
              <line x1={PAD.l} x2={PAD.l + plotW} y1={yKw(v)} y2={yKw(v)} stroke={v === 0 ? F.basis : F.raster} />
              <text x={PAD.l - 8} y={yKw(v) + 4} textAnchor="end" fontSize="11.5" fill={F.text}>
                {zahl(v, achsen.kw.schritt < 1 ? 1 : 0)}
              </text>
            </g>
          ))}
          <text x={PAD.l - 8} y={PAD.t - 14} textAnchor="end" fontSize="11" fontWeight="600" fill={F.text}>
            kW
          </text>

          {/* Rechte Achse (ct/kWh) */}
          {achsen.ct &&
            achsen.ct.ticks.map((v) => (
              <text key={`c${v}`} x={PAD.l + plotW + 8} y={yCt(v) + 4} fontSize="11.5" fill={F.preis}>
                {zahl(v, achsen.ct.schritt < 1 ? 1 : 0)}
              </text>
            ))}
          {achsen.ct && (
            <text x={PAD.l + plotW + 8} y={PAD.t - 14} fontSize="11" fontWeight="600" fill={F.preis}>
              ct
            </text>
          )}

          {/* Tagesgrenzen und Tagesbeschriftung */}
          {tagesGrenzen.map((i, k) => {
            const ende = tagesGrenzen[k + 1] ?? n;
            const x0 = PAD.l + i * w;
            const breiteTag = (ende - i) * w;
            return (
              <g key={`t${i}`}>
                {i > 0 && <line x1={x0} x2={x0} y1={PAD.t - 20} y2={PAD.t + plotH} stroke={F.basis} strokeDasharray="3 3" />}
                {breiteTag > 46 && (
                  <text x={x0 + Math.min(breiteTag / 2, Math.max(breiteTag - 30, 30))} y={PAD.t - 16} textAnchor="middle" fontSize="12" fontWeight="700" fill={F.tag}>
                    {tagKurz(stunden[i].beginn)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Stundenmarken */}
          {ticks.map(({ z, i }) => (
            <text key={`h${i}`} x={PAD.l + i * w} y={H - 10} textAnchor="middle" fontSize="11" fill={F.text}>
              {z.stunde}
            </text>
          ))}

          {/* Band, Fläche, Linie */}
          {bandPfade.map((d, k) => (
            <path key={`b${k}`} d={d} fill={F.band} stroke={F.bandKante} strokeWidth="0.75" />
          ))}
          <path d={flaeche} fill={`url(#pg-flaeche-${gid})`} />
          <path d={linie} fill="none" stroke={F.linie} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />

          {/* Preis */}
          {preisPfad && <path d={preisPfad} fill="none" stroke={F.preis} strokeWidth="1.5" strokeDasharray="5 3" />}

          {/* Jetzt */}
          {jetztX != null && (
            <g>
              <line x1={jetztX} x2={jetztX} y1={PAD.t} y2={PAD.t + plotH} stroke={F.tag} strokeWidth="1" opacity="0.5" />
              <text x={jetztX + 4} y={PAD.t + 12} fontSize="10.5" fontWeight="600" fill={F.tag}>
                jetzt
              </text>
            </g>
          )}

          {/* Fadenkreuz */}
          {hs && (
            <g>
              <line x1={xMitte(idx)} x2={xMitte(idx)} y1={PAD.t} y2={PAD.t + plotH} stroke={F.tag} strokeWidth="1" />
              <circle cx={xMitte(idx)} cy={yKw(hs.kw)} r="4.5" fill="#fff" stroke={F.linie} strokeWidth="2" />
              {preise.has(hs.beginn) && <circle cx={xMitte(idx)} cy={yCt(preise.get(hs.beginn) / 10)} r="3.5" fill="#fff" stroke={F.preis} strokeWidth="2" />}
            </g>
          )}

          {/* Eingabefläche */}
          <rect
            x={PAD.l}
            y={PAD.t}
            width={plotW}
            height={plotH}
            fill="transparent"
            onPointerMove={zeiger}
            onPointerDown={zeiger}
            onPointerLeave={() => setHover(null)}
            style={{ touchAction: "pan-y" }}
          />
        </svg>
      </div>

      {hs && (
        <Tooltip x={xMitte(idx)} y={PAD.t} breite={breite}>
          <p className="font-semibold">
            {tagKurz(hs.beginn)} · {intervall(hs.beginn, hs.ende)}
          </p>
          <p>
            PV: <strong className="ov-num">{zahl(hs.kw, hs.kw < 10 ? 1 : 0)} kW</strong>
            {Number.isFinite(hs.kwP10) && (
              <span className="text-white/70">
                {" "}
                ({zahl(hs.kwP10, hs.kwP10 < 10 ? 1 : 0)}–{zahl(hs.kwP90, hs.kwP90 < 10 ? 1 : 0)})
              </span>
            )}
          </p>
          <p>
            Börse: <span className="ov-num">{preise.has(hs.beginn) ? `${zahl(preise.get(hs.beginn) / 10, 1)} ct/kWh` : "noch offen"}</span>
          </p>
          {gold.has(hs.beginn) && <p className="font-semibold text-sun-300">Goldene Stunde</p>}
        </Tooltip>
      )}

      {/* Legende */}
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-1 text-[12.5px] text-ink-600" aria-label="Legende">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-[3px] w-5 rounded bg-ov-600" /> PV-Leistung (kW, Stundenmittel)
        </li>
        {mitBand && (
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-5 rounded-sm bg-ov-500/25 ring-1 ring-ov-600/40" /> Unsicherheit (Ensemble P10–P90)
          </li>
        )}
        {mitPreis && (
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-navy-500" /> Day-Ahead-Preis AT (ct/kWh, netto)
          </li>
        )}
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-sun-400/40 ring-1 ring-sun-500" /> Goldene Stunde
        </li>
      </ul>
    </div>
  );
}
