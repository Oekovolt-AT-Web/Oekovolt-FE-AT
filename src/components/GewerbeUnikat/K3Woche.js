// src/components/GewerbeUnikat/K3Woche.js
//
// Kapitel 03 – WOCHENSTREIFEN „Dieselbe Juniwoche wie oben“: sieben kleine Tagesflächen (Mo–So) direkt am
// Anlagen-Regler. Beim Ziehen blüht der Überschuss (sun-300) an Feiertag und Wochenende auf, während die
// Werktage grün bleiben – erst ab etwa der 1,5-fachen Empfehlung bleibt auch werktags Sonne übrig. Darunter
// der Jahresbalken: wie viel Überschuss entsteht und welcher Anteil an Ruhetagen.
//
// REINE Komponente (keine Hooks, kein "use client"): SSR rendert den Startzustand (280 kWp), die Bühne
// rendert dieselbe Ansicht mit dem Federwert des Läufers (K3SonneSchicht → WocheLive).
//
// Grafik: je Tag EIN SVG mit viewBox „Slots × 100“ und preserveAspectRatio="none" – dasselbe SVG passt auf
// Telefon und Desktop (keine doppelte Mobil/Desktop-Fassung im HTML); Linien mit non-scaling-stroke,
// alle Texte als HTML. Die Pfade sind relativ kodiert (kleines HTML). tagPfade() nutzen auch die
// Tagesbänder in K3Ansicht.

import { BEDEUTUNG, FARBE, zahl } from "./_tokens";

const D = { last: BEDEUTUNG.last.dunkel, eigen: BEDEUTUNG.eigen.dunkel, uebrig: BEDEUTUNG.ueberschuss.dunkel };
const TAGNAMEN = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const rnd = (v) => Math.round(v * 10) / 10;
/** Zahl kompakt für Pfade: 0.5 → ".5", -0.5 → "-.5" */
function num(v) {
  const r = rnd(v);
  if (r === 0) return "0";
  return String(r).replace(/^(-?)0\./, "$1.");
}

/** Polylinie durch ys (x = x0, x0 ± 1, …), relativ kodiert. start „M“ oder „L“; schritt +1/−1. */
function zug(ys, x0, start = "M", schritt = 1) {
  let out = `${start}${num(x0)} ${num(ys[0])}`;
  if (ys.length < 2) return out;
  let prev = rnd(ys[0]);
  out += "l";
  for (let i = 1; i < ys.length; i++) {
    const y = rnd(ys[i]);
    const dy = num(y - prev);
    const dx = schritt > 0 ? "1" : "-1";
    out += (i > 1 && schritt > 0 ? " " : "") + dx + (dy.startsWith("-") ? "" : " ") + dy;
    prev = y;
  }
  return out;
}

/**
 * Pfade eines Tages in Einheiten der viewBox (x: Slot, y: 0 = oben … 100 = 0 kW).
 * L = Last (kW, inkl. Flotte), P = PV (kW), F = Flotte (kW) oder null, yMax = Skala (kW).
 * last: Lastlinie (über den Rand verlängert, damit die Füllung darunter ohne sichtbare Kanten schließt),
 * genutzt: Sonne selbst genutzt, uebrig: Sonne übrig (nur Läufe mit P > L), flotte: Ladeleistung.
 */
export function tagPfade(L, P, F, yMax) {
  const n = L.length;
  const y = (v) => 100 - Math.max(0, Math.min(1, (Number.isFinite(v) ? v : 0) / yMax)) * 100;
  const yL = Array.from(L, y);
  const lastZug = `${zug([yL[0], ...yL, yL[n - 1]], -0.5)}`;
  const netz = `${lastZug}V104H-.5Z`;

  // Sonne genutzt: Oberkante min(P, L) über den Tagbereich
  let a = -1;
  let b = -1;
  for (let s = 0; s < n; s++)
    if (P[s] > 0.01) {
      if (a < 0) a = s;
      b = s;
    }
  let genutzt = "";
  let uebrig = "";
  if (a >= 0) {
    a = Math.max(0, a - 1);
    b = Math.min(n - 1, b + 1);
    const oben = [];
    for (let s = a; s <= b; s++) oben.push(y(Math.min(P[s], L[s])));
    genutzt = `${zug(oben, a + 0.5)}V100H${num(a + 0.5)}Z`;
    // Sonne übrig: je Lauf mit P > L ein Polygon (Ober- = PV, Unterkante = Last), an den Enden ein Slot Anlauf
    let s = a;
    while (s <= b) {
      if (P[s] > L[s] + 0.01) {
        const s0 = Math.max(0, s - 1);
        let s1 = s;
        while (s1 + 1 < n && P[s1 + 1] > L[s1 + 1] + 0.01) s1++;
        s1 = Math.min(n - 1, s1 + 1);
        const top = [];
        const unten = [];
        for (let k = s0; k <= s1; k++) {
          top.push(y(Math.max(P[k], L[k])));
          unten.push(y(L[k]));
        }
        unten.reverse();
        uebrig += `${zug(top, s0 + 0.5)}${zug(unten, s1 + 0.5, "L", -1)}Z`;
        s = s1 + 1;
      } else s++;
    }
  }

  // Flotte: zwischen L − F und L, wo geladen wird
  let flotte = "";
  if (F) {
    let s = 0;
    while (s < n) {
      if (F[s] > 0) {
        const s0 = Math.max(0, s - 1);
        let s1 = s;
        while (s1 + 1 < n && F[s1 + 1] > 0) s1++;
        s1 = Math.min(n - 1, s1 + 1);
        const top = [];
        const unten = [];
        for (let k = s0; k <= s1; k++) {
          top.push(y(L[k]));
          unten.push(y(L[k] - (F[k] || 0)));
        }
        unten.reverse();
        flotte += `${zug(top, s0 + 0.5)}${zug(unten, s1 + 0.5, "L", -1)}Z`;
        s = s1 + 1;
      } else s++;
    }
  }
  return { last: lastZug, netz, genutzt, uebrig, flotte };
}

/** SVG-Flächen eines Tages (absolut, füllt den Rahmen). Ohne Text – Beschriftung macht der Aufrufer in HTML. */
export function TagFlaechen({ id, pfade, slots, staerke = 1.25, netzDeckkraft = 0.14, flotteMuster = false }) {
  return (
    <svg viewBox={`0 0 ${slots} 100`} preserveAspectRatio="none" className="absolute inset-0 block h-full w-full" aria-hidden="true" focusable="false">
      {flotteMuster && (
        <defs>
          {/* senkrechte Schraffur – bleibt bei nicht-proportionaler Skalierung senkrecht */}
          <pattern id={`${id}-fl`} width="1" height="100" patternUnits="userSpaceOnUse">
            <rect width="1" height="100" fill={FARBE.navy950} fillOpacity="0.35" />
            <rect width="0.42" height="100" fill="#fff" fillOpacity="0.85" />
          </pattern>
        </defs>
      )}
      <path d={pfade.netz} fill={D.last} fillOpacity={netzDeckkraft} />
      {pfade.genutzt && <path d={pfade.genutzt} fill={D.eigen} fillOpacity="0.92" />}
      {pfade.uebrig && <path d={pfade.uebrig} fill={D.uebrig} fillOpacity="0.95" />}
      {pfade.flotte && <path d={pfade.flotte} fill={flotteMuster ? `url(#${id}-fl)` : "#fff"} fillOpacity={flotteMuster ? 1 : 0.5} />}
      <path d={pfade.last} fill="none" stroke={D.last} strokeWidth={staerke} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/** Tagessummen (kWh) für Last, PV genutzt, PV übrig. */
export function tagSummen(L, P) {
  const slotH = 24 / L.length;
  let last = 0;
  let eigen = 0;
  let uebrig = 0;
  for (let s = 0; s < L.length; s++) {
    last += L[s] * slotH;
    eigen += Math.min(P[s], L[s]) * slotH;
    uebrig += Math.max(0, P[s] - L[s]) * slotH;
  }
  return { last, eigen, uebrig };
}

const tagName = (t) => TAGNAMEN[new Date(t).getUTCDay()];
const datumKurz = (t) => {
  const d = new Date(t);
  return `${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
};

/** Kleine Legende mit Wörtern (nicht nur Farbe). */
export function FlaechenLegende({ className = "", flotte = false }) {
  const punkt = "inline-block h-2 w-2 shrink-0 rounded-[2px]";
  return (
    <p className={["flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-white/65 md:text-[12px]", className].join(" ")}>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className={`${punkt} bg-ov-400`} />
        Sonne genutzt
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className={`${punkt} bg-sun-300`} />
        Sonne übrig
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="inline-block h-[2px] w-3 shrink-0 rounded-full bg-navy-300" />
        Verbrauch
      </span>
      {flotte && (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={`${punkt} bg-[repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_3px)]`} />
          E-Flotte
        </span>
      )}
    </p>
  );
}

/**
 * Wochenstreifen.
 * @param {object} p
 *  woche { slots, tage [{ t, typ, ruht }], L, P1 }, kwp (Federwert), kwpText (Zielwert für die Überschrift),
 *  yMax (kW, fest), jahr { mwh, anteil, maxMwh } (Überschuss im Jahr, Anteil an Ruhetagen), quelle, idBasis
 */
export default function K3Woche({ woche, kwp, kwpText, yMax, jahr, quelle = "beispiel", idBasis = "k3w" }) {
  if (!woche) {
    return (
      <div data-testid="k3-woche" className="rounded-2xl bg-white/[0.04] px-4 py-3 text-[13px] text-white/65">
        Für den Wochenstreifen braucht der Lastgang sieben zusammenhängende Tage.
      </div>
    );
  }
  const { slots, tage } = woche;
  const tageDaten = tage.map((info, k) => {
    const L = Array.prototype.slice.call(woche.L, k * slots, (k + 1) * slots);
    const P = Array.prototype.slice.call(woche.P1, k * slots, (k + 1) * slots).map((v) => v * kwp);
    return { ...info, k, pfade: tagPfade(L, P, null, yMax), summe: tagSummen(L, P) };
  });
  const wocheUebrig = tageDaten.reduce((s, d) => s + d.summe.uebrig, 0);
  const t0 = tage[0].t;
  const t6 = tage[6].t;
  const titel = quelle === "eigen" ? "Eine Woche aus Ihrem Lastgang" : "Dieselbe Juniwoche wie oben";
  const anteil = Math.max(0, Math.min(1, jahr?.anteil ?? 0));
  const mwh = Math.max(0, jahr?.mwh ?? 0);
  const gesamt = jahr?.maxMwh > 0 ? Math.max(0, Math.min(1, mwh / jahr.maxMwh)) : 0;
  const zeitraum = quelle === "eigen" ? "im Messzeitraum" : "im Jahr";
  const ruheDef = quelle === "eigen" ? "Wochenende, Feiertag, Tage mit Betriebsruhe" : "Wochenende, Feiertag, Betriebsurlaub";
  const ruheDefKurz = quelle === "eigen" ? "Wochenende, Feiertag, Betriebsruhe" : "Wochenende, Feiertag, Urlaub";
  const label = `${titel}, ${datumKurz(t0)} bis ${datumKurz(t6)}, bei ${zahl(kwpText ?? kwp)} kWp. Sonne übrig je Tag: ${tageDaten
    .map((d) => `${tagName(d.t)} ${zahl(d.summe.uebrig)}`)
    .join(", ")} Kilowattstunden.`;

  return (
    <div data-testid="k3-woche" data-uebrig={Math.round(wocheUebrig)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13px] font-semibold text-white md:text-[13.5px]">
          {titel}
          <span className="font-normal text-white/60">
            {" "}
            · <span className="hidden sm:inline">{`${datumKurz(t0)}–${datumKurz(t6)} · `}</span>
            <span className="ov-num">{zahl(kwpText ?? kwp)}</span> kWp
          </span>
        </p>
        <FlaechenLegende />
      </div>

      <div role="img" aria-label={label} className="mt-2 grid grid-cols-7 gap-1 sm:gap-1.5">
        {tageDaten.map((d) => {
          const feiertag = d.typ === 2 && new Date(d.t).getUTCDay() !== 0;
          const u = d.summe.uebrig;
          return (
            <div key={d.t} className="min-w-0" data-tag={d.k} data-ruht={d.ruht ? "1" : undefined}>
              <div className={["relative overflow-hidden rounded-md sm:rounded-lg", d.ruht ? "bg-white/[0.075]" : "bg-white/[0.025]", "aspect-[46/52] sm:aspect-[118/84]"].join(" ")}>
                <TagFlaechen id={`${idBasis}-${d.k}`} pfade={d.pfade} slots={slots} staerke={1} netzDeckkraft={0.16} />
                {feiertag && (
                  <span className="absolute left-1 top-0.5 text-[9.5px] font-semibold leading-tight text-sun-300 sm:left-2 sm:top-1.5 sm:text-[11px]">Feiertag</span>
                )}
              </div>
              <p className="mt-1 whitespace-nowrap text-[11px] leading-tight md:text-[11.5px]">
                <span className="font-semibold text-white/85">{tagName(d.t)}</span>
                <span className="hidden text-white/55 lg:inline"> {datumKurz(d.t)}</span>
              </p>
              <p className="ov-num mt-0.5 text-left font-display text-[12.5px] font-extrabold leading-none sm:text-[13.5px]" aria-hidden="true">
                <span className={u >= 0.5 ? "text-sun-300" : "text-white/55"}>{zahl(u)}</span>
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-white/55 sm:text-[11.5px] md:text-[12px]">
        <span className="sm:hidden">kWh übrig je Tag · Ruhetage: {ruheDefKurz}</span>
        <span className="hidden sm:inline">
          Zahl unter jedem Tag: Sonne übrig in kWh · Ruhetage: {ruheDef} (hellere Felder)
        </span>
      </p>

      {/* Jahresbalken: Länge = Überschuss (bis zur größten wählbaren Anlage), voller Teil = an Ruhetagen */}
      <div className="mt-2.5 md:mt-4" data-testid="k3-jahr-ruhe" data-anteil={Math.round(anteil * 100)}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[12.5px] leading-snug text-white/70 md:text-[13px]">
          <p>
            Überschuss {zeitraum}{" "}
            <strong className="ov-num font-display font-extrabold text-sun-300">
              {zahl(mwh)}
              <span className="ml-0.5 text-[0.8em]">MWh</span>
            </strong>
          </p>
          {mwh >= 0.05 && (
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span>
                <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-sun-300" />
                <strong className="ov-num font-display font-extrabold text-white">{zahl(anteil * 100)}&nbsp;%</strong> an Ruhetagen
              </span>
              <span className="hidden sm:inline">
                <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-sun-300/35" />
                <strong className="ov-num font-display font-extrabold text-white">{zahl((1 - anteil) * 100)}&nbsp;%</strong> werktags
              </span>
            </p>
          )}
        </div>
        <div aria-hidden="true" className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.07] md:h-2.5">
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-sun-300/35" style={{ transform: `scaleX(${gesamt})` }} />
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-sun-300" style={{ transform: `scaleX(${gesamt * anteil})` }} />
        </div>
      </div>
    </div>
  );
}
