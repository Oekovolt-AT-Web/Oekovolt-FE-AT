import { Check } from "lucide-react";

/* Mini-Vorschauen für die Tool-Karten im Hub /rechner – Server-Komponenten.
   Dekorative Grafiken sind aria-hidden und zeigen KEINE erfundenen Zahlen; wo Zahlen
   erscheinen, stammen sie aus derselben Rechenlogik wie der jeweilige Rechner
   (Beispielrechnung im Hub) oder aus Live-Daten.

   Animation: Die Grafiken wachsen/zeichnen sich, sobald die umgebende <Reveal>-Karte
   sichtbar wird (Klasse .is-visible vom globalen RevealObserver). Ohne JavaScript und
   bei reduzierter Bewegung sind sie sofort vollständig sichtbar. */

const GRUEN = "#669933";
const NAVY = "#4a7cbd";

// Zustand „noch nicht sichtbar“ nur, wenn JS läuft und die Karte noch nicht eingeblendet ist
const WACHSEN =
  "[transform-box:fill-box] origin-bottom transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none [.js-ready_.ov-reveal:not(.is-visible)_&]:scale-y-0";
const WACHSEN_X =
  "origin-left transition-transform duration-[1000ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none [.js-ready_.ov-reveal:not(.is-visible)_&]:scale-x-0";
const ZEICHNEN =
  "[stroke-dasharray:1] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none [.js-ready_.ov-reveal:not(.is-visible)_&]:[stroke-dashoffset:1]";
const verz = (ms) => ({ transitionDelay: `${ms}ms` });

/** Keyframes für Dauer-Animationen der Vorschauen (einmal pro Seite einbinden). */
export function VorschauStile() {
  return (
    <style>{`
@keyframes hub-fluss { to { stroke-dashoffset: -24; } }
@keyframes hub-puls { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
`}</style>
  );
}

export function VorschauSolar() {
  const monate = [0.03, 0.05, 0.085, 0.115, 0.13, 0.13, 0.135, 0.115, 0.085, 0.06, 0.035, 0.025];
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" aria-hidden="true">
      <circle cx="282" cy="30" r="16" fill="#ffd873" />
      <circle cx="282" cy="30" r="27" fill="#ffd873" opacity="0.25" />
      {monate.map((m, i) => {
        const h = (m / 0.135) * 130;
        return <rect key={i} x={14 + i * 25} y={172 - h} width="16" height={h} rx="4" fill={GRUEN} opacity={0.35 + (m / 0.135) * 0.65} className={WACHSEN} style={verz(i * 45)} />;
      })}
      <line x1="8" x2="312" y1="172.5" y2="172.5" stroke="#dfe3ea" />
    </svg>
  );
}

export function VorschauSpeicher({ dunkel = false }) {
  const pkt = [0.39, 0.49, 0.55, 0.61, 0.65, 0.69, 0.72, 0.74, 0.76, 0.78, 0.79, 0.8, 0.8, 0.81, 0.82, 0.82, 0.83];
  const x = (i) => 12 + (i / (pkt.length - 1)) * 296;
  const y = (v) => 120 - v * 110;
  const d = pkt.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const linie = dunkel ? "#aed083" : GRUEN;
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full" aria-hidden="true">
      <rect x={x(1)} y="8" width={x(12) - x(1)} height="112" rx="8" fill={dunkel ? "rgba(255,255,255,0.05)" : "#f4f9ee"} />
      <path d={`${d} L${x(pkt.length - 1)},120 L${x(0)},120 Z`} fill={linie} opacity="0.12" />
      <path d={d} pathLength="1" fill="none" stroke={linie} strokeWidth="3" strokeLinecap="round" className={ZEICHNEN} />
      <line x1={x(5)} x2={x(5)} y1={y(pkt[5])} y2="120" stroke="#f5a70f" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx={x(5)} cy={y(pkt[5])} r="6" fill={dunkel ? "#03122b" : "#fff"} stroke="#f5a70f" strokeWidth="3" />
      <line x1="8" x2="312" y1="120.5" y2="120.5" stroke={dunkel ? "rgba(255,255,255,0.15)" : "#dfe3ea"} />
    </svg>
  );
}

export function VorschauBalken({ reihen, dunkel = false }) {
  const max = Math.max(...reihen.map((r) => r.wert), 1);
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {reihen.map((r, i) => (
        <div key={r.label}>
          <div className={`mb-1 flex justify-between gap-3 text-[11.5px] ${dunkel ? "text-white/60" : "text-ink-500"}`}>
            <span>{r.label}</span>
            <span className={`ov-num font-semibold ${dunkel ? "text-white" : "text-ink-700"}`}>{r.anzeige}</span>
          </div>
          <div className={`h-2.5 overflow-hidden rounded-full ${dunkel ? "bg-white/10" : "bg-ink-100"}`}>
            <div className={`h-full rounded-full ${WACHSEN_X}`} style={{ width: `${(r.wert / max) * 100}%`, background: r.farbe, ...verz(150 + i * 120) }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Kumulierter Cashflow als Mini-Balken (echte Beispielrechnung des Gewerbe-PV-Rechners). */
export function VorschauCashflow({ reihe = [] }) {
  if (!reihe.length) return null;
  const werte = reihe.map((c) => c.kumuliert);
  const min = Math.min(0, ...werte);
  const max = Math.max(0, ...werte);
  const W = 520;
  const H = 170;
  const y = (v) => 8 + (1 - (v - min) / (max - min || 1)) * (H - 16);
  const sp = W / reihe.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      <line x1="0" x2={W} y1={y(0)} y2={y(0)} stroke="#151a24" strokeOpacity="0.5" />
      {reihe.map((c, i) => {
        const plus = c.kumuliert >= 0;
        const top = Math.min(y(0), y(c.kumuliert));
        const h = Math.max(Math.abs(y(c.kumuliert) - y(0)), 1.5);
        return (
          <rect
            key={c.jahr}
            x={(i * sp + sp * 0.2).toFixed(1)}
            y={top.toFixed(1)}
            width={(sp * 0.6).toFixed(1)}
            height={h.toFixed(1)}
            rx="2.5"
            fill={plus ? "#7fae4a" : "#b9c2d0"}
            className={plus ? WACHSEN : WACHSEN.replace("origin-bottom", "origin-top")}
            style={verz(i * 35)}
          />
        );
      })}
    </svg>
  );
}

/** Lastgang mit gekappten Spitzen (Peak Shaving) – dekorativ. */
export function VorschauLastspitze({ dunkel = true }) {
  const last = [38, 42, 55, 70, 64, 92, 76, 68, 95, 72, 60, 84, 66, 58, 88, 62, 50, 44, 40, 36];
  const kappe = 70;
  const W = 320;
  const H = 130;
  const x = (i) => 8 + (i / (last.length - 1)) * (W - 16);
  const y = (v) => H - 10 - (v / 100) * (H - 24);
  const d = last.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const gekappt = last.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(Math.min(v, kappe)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      <path d={`${d} L${x(last.length - 1)},${H - 10} L${x(0)},${H - 10} Z`} fill="#f5a70f" opacity="0.28" />
      <path d={`${gekappt} L${x(last.length - 1)},${H - 10} L${x(0)},${H - 10} Z`} fill={dunkel ? "#8cba58" : GRUEN} opacity="0.35" />
      <path d={d} pathLength="1" fill="none" stroke="#ffc53d" strokeWidth="1.5" strokeOpacity="0.8" className={ZEICHNEN} />
      <path d={gekappt} pathLength="1" fill="none" stroke={dunkel ? "#aed083" : GRUEN} strokeWidth="2.5" strokeLinejoin="round" className={ZEICHNEN} style={verz(250)} />
      <line x1="4" x2={W - 4} y1={y(kappe)} y2={y(kappe)} stroke={dunkel ? "#fff" : "#151a24"} strokeOpacity="0.7" strokeDasharray="5 5" className="motion-safe:animate-[hub-fluss_2.2s_linear_infinite]" />
      <line x1="4" x2={W - 4} y1={H - 9.5} y2={H - 9.5} stroke={dunkel ? "rgba(255,255,255,0.15)" : "#dfe3ea"} />
    </svg>
  );
}

/** Energiegemeinschaft: Erzeuger in der Mitte, Teilnehmer rundherum – dekorativ. */
export function VorschauGemeinschaft({ dunkel = true }) {
  const knoten = [
    [60, 30],
    [260, 34],
    [40, 104],
    [280, 108],
    [160, 128],
  ];
  const linie = dunkel ? "#aed083" : GRUEN;
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" aria-hidden="true">
      {knoten.map(([x, y], i) => (
        <line key={i} x1="160" y1="70" x2={x} y2={y} stroke={linie} strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" className="motion-safe:animate-[hub-fluss_1.6s_linear_infinite]" style={{ animationDelay: `${i * -0.3}s` }} />
      ))}
      <circle cx="160" cy="70" r="30" fill="#ffd873" opacity="0.25" className="motion-safe:animate-[hub-puls_2.8s_ease-in-out_infinite]" />
      <circle cx="160" cy="70" r="19" fill="#ffc53d" />
      <path d="M154 64 h12 M152 70 h16 M154 76 h12" stroke="#03122b" strokeWidth="1.6" strokeLinecap="round" />
      {knoten.map(([x, y], i) => (
        <g key={`k${i}`}>
          <circle cx={x} cy={y} r="13" fill={dunkel ? "#041d42" : "#fff"} stroke={dunkel ? "rgba(255,255,255,0.35)" : "#c4cad5"} />
          <path d={`M${x - 6} ${y + 5} v-6 l6 -5 l6 5 v6 z`} fill="none" stroke={dunkel ? "#fff" : "#394050"} strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

/** Blackout: Netz fällt aus, Speicher überbrückt – dekorativ. */
export function VorschauBlackout({ dunkel = true }) {
  const text = dunkel ? "text-white/60" : "text-ink-500";
  const spur = dunkel ? "bg-white/10" : "bg-ink-100";
  return (
    <div className="space-y-3" aria-hidden="true">
      <div>
        <p className={`mb-1 text-[11.5px] ${text}`}>Netz</p>
        <div className={`relative h-3 overflow-hidden rounded-full ${spur}`}>
          <div className={`absolute inset-y-0 left-0 w-[42%] rounded-l-full bg-white/70 ${WACHSEN_X}`} />
          <div className="absolute inset-y-0 left-[42%] w-[28%] bg-[repeating-linear-gradient(135deg,rgba(217,83,79,0.6)_0_5px,transparent_5px_10px)]" />
          <div className={`absolute inset-y-0 right-0 w-[30%] rounded-r-full bg-white/70 ${WACHSEN_X}`} style={verz(600)} />
        </div>
      </div>
      <div>
        <p className={`mb-1 text-[11.5px] ${text}`}>Ersatzstrom aus PV + Speicher</p>
        <div className={`relative h-3 overflow-hidden rounded-full ${spur}`}>
          <div className={`absolute inset-y-0 left-[40%] w-[32%] rounded-full bg-ov-400 ${WACHSEN_X}`} style={verz(350)} />
        </div>
      </div>
      <p className={`flex items-center gap-1.5 text-[11.5px] ${text}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-ov-400 motion-safe:animate-[hub-puls_1.6s_ease-in-out_infinite]" />
        kritische Verbraucher laufen weiter
      </p>
    </div>
  );
}

/** Flotte: Fahrzeuge wechseln auf elektrisch – dekorativ. */
export function VorschauFlotte() {
  return (
    <div className="grid grid-cols-6 gap-2" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => {
        const elektrisch = i < 7;
        return (
          <div
            key={i}
            className={`flex h-9 items-center justify-center rounded-lg ring-1 transition-colors duration-700 ${elektrisch ? "bg-ov-50 ring-ov-200 [.js-ready_.ov-reveal:not(.is-visible)_&]:bg-ink-100 [.js-ready_.ov-reveal:not(.is-visible)_&]:ring-ink-200" : "bg-white ring-ink-200"}`}
            style={verz(i * 80)}
          >
            <svg viewBox="0 0 24 24" className={`h-4 w-4 ${elektrisch ? "text-ov-600" : "text-ink-400"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 16V9a2 2 0 0 1 2-2h9l4 4h1a2 2 0 0 1 2 2v3" />
              <circle cx="7.5" cy="17" r="1.8" />
              <circle cx="16.5" cy="17" r="1.8" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/** Ladepunkte mit dynamischem Lastmanagement – dekorativ. */
export function VorschauLadepunkte() {
  const pegel = [0.9, 0.55, 0.75, 0.4, 0.65, 0.85];
  return (
    <div aria-hidden="true">
      <div className="relative flex h-24 items-end gap-2.5 rounded-2xl bg-white px-3 pb-3 pt-4 ring-1 ring-ink-200/60">
        <div className="absolute inset-x-3 top-[30%] border-t-2 border-dashed border-navy-400/70" />
        {pegel.map((p, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end">
            <div className={`rounded-md bg-gradient-to-t from-ov-600 to-ov-400 ${WACHSEN}`} style={{ height: `${p * 70}%`, ...verz(i * 90) }} />
          </div>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-2 text-[11.5px] text-ink-500">
        <span className="w-4 border-t-2 border-dashed border-navy-400" />
        Grenze des Netzanschlusses
      </p>
    </div>
  );
}

/** Schematische Freifläche mit Modulreihen – dekorativ. */
export function VorschauFlaeche() {
  return (
    <svg viewBox="0 0 320 110" className="h-auto w-full" aria-hidden="true">
      <rect width="320" height="110" rx="16" fill="#e6f1d8" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={18 + i * 33} y="14" width="20" height="82" rx="4" fill="#0b4488" className={WACHSEN} style={verz(i * 60)} />
      ))}
    </svg>
  );
}

/** Live-Kurve der heutigen Börsenpreise (echte Daten aus dem Server-Snapshot) */
export function VorschauLivePreis({ punkte = [], jetzt, hoehe = 110 }) {
  if (punkte.length < 4) {
    return <div className="rounded-2xl bg-white/5" style={{ height: hoehe }} aria-hidden="true" />;
  }
  const werte = punkte.map((p) => p.eurMwh / 10);
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const W = 640;
  const H = hoehe;
  const x = (i) => (i / (werte.length - 1)) * W;
  const y = (v) => 8 + (1 - (v - min) / Math.max(max - min, 1)) * (H - 16);
  const d = werte.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const iMin = werte.indexOf(min);
  const iJetzt = jetzt != null ? punkte.findIndex((p, i) => p.t <= jetzt && (punkte[i + 1]?.t ?? Infinity) > jetzt) : -1;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height: H }}
      role="img"
      aria-label={`Börsenstrompreis heute zwischen ${min.toFixed(1).replace(".", ",")} und ${max.toFixed(1).replace(".", ",")} Cent je Kilowattstunde netto`}
    >
      <defs>
        <linearGradient id="ov-hub-live" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8cba58" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8cba58" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#ov-hub-live)" />
      <path d={d} pathLength="1" fill="none" stroke="#aed083" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={ZEICHNEN} />
      <line x1={x(iMin)} x2={x(iMin)} y1="0" y2={H} stroke="#ffd873" strokeOpacity="0.6" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      {iJetzt >= 0 && <line x1={x(iJetzt)} x2={x(iJetzt)} y1="0" y2={H} stroke="#fff" strokeOpacity="0.75" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

export function VorschauCheckliste({ punkte }) {
  return (
    <ul className="space-y-2" aria-hidden="true">
      {punkte.map((p, i) => (
        <li key={p} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 text-[13px] text-ink-700 ring-1 ring-ink-200/70">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${i < 2 ? "bg-ov-500 text-white [.js-ready_.ov-reveal:not(.is-visible)_&]:bg-ink-100 [.js-ready_.ov-reveal:not(.is-visible)_&]:text-ink-400" : "bg-ink-100 text-ink-400"}`}
            style={verz(300 + i * 250)}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}

export function VorschauSchritte() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {["Dach", "Verbrauch", "Wünsche", "Angebot"].map((s, i, a) => (
        <div key={s} className="flex flex-1 items-center justify-center gap-2 min-[480px]:justify-start">
          <div className="flex flex-col items-center gap-1.5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold ${i < 3 ? "bg-white text-ov-700" : "bg-sun-400 text-navy-950"}`}>{i + 1}</span>
            <span className="text-[11.5px] font-medium text-white/85">{s}</span>
          </div>
          {i < a.length - 1 && <span className="mb-5 hidden h-0.5 flex-1 rounded-full bg-white/35 min-[480px]:block" />}
        </div>
      ))}
    </div>
  );
}

export { NAVY };
