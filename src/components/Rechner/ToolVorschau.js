import { Check } from "lucide-react";

/* Mini-Vorschauen für die Tool-Karten im Hub /rechner – rein dekorativ (aria-hidden),
   außer der Live-Kurve, die echte Börsenpreise zeigt. Server-Komponenten. */

const GRUEN = "#669933";
const NAVY = "#4a7cbd";

export function VorschauSolar() {
  const monate = [0.03, 0.05, 0.085, 0.115, 0.13, 0.13, 0.135, 0.115, 0.085, 0.06, 0.035, 0.025];
  return (
    <svg viewBox="0 0 320 230" className="h-auto w-full" aria-hidden="true">
      <circle cx="276" cy="38" r="20" fill="#ffd873" />
      <circle cx="276" cy="38" r="34" fill="#ffd873" opacity="0.25" />
      {monate.map((m, i) => {
        const h = (m / 0.135) * 165;
        return <rect key={i} x={14 + i * 25} y={220 - h} width="16" height={h} rx="4" fill={GRUEN} opacity={0.35 + (m / 0.135) * 0.65} />;
      })}
      <line x1="8" x2="312" y1="220.5" y2="220.5" stroke="#dfe3ea" />
    </svg>
  );
}

export function VorschauSpeicher() {
  const pkt = [0.39, 0.49, 0.55, 0.61, 0.65, 0.69, 0.72, 0.74, 0.76, 0.78, 0.79, 0.8, 0.8, 0.81, 0.82, 0.82, 0.83];
  const x = (i) => 12 + (i / (pkt.length - 1)) * 296;
  const y = (v) => 120 - v * 110;
  const d = pkt.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full" aria-hidden="true">
      <rect x={x(1)} y="8" width={x(12) - x(1)} height="112" rx="8" fill="#f4f9ee" />
      <path d={`${d} L${x(pkt.length - 1)},120 L${x(0)},120 Z`} fill={GRUEN} opacity="0.12" />
      <path d={d} fill="none" stroke={GRUEN} strokeWidth="3" strokeLinecap="round" />
      <line x1={x(5)} x2={x(5)} y1={y(pkt[5])} y2="120" stroke="#f5a70f" strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx={x(5)} cy={y(pkt[5])} r="6" fill="#fff" stroke="#f5a70f" strokeWidth="3" />
      <line x1="8" x2="312" y1="120.5" y2="120.5" stroke="#dfe3ea" />
    </svg>
  );
}

export function VorschauBalken({ reihen }) {
  const max = Math.max(...reihen.map((r) => r.wert));
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {reihen.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-[11.5px] text-ink-500">
            <span>{r.label}</span>
            <span className="ov-num font-semibold text-ink-700">{r.anzeige}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full" style={{ width: `${(r.wert / max) * 100}%`, background: r.farbe }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Live-Kurve der heutigen Börsenpreise (echte Daten aus dem Server-Snapshot) */
export function VorschauLivePreis({ punkte = [], jetzt }) {
  if (punkte.length < 4) {
    return <div className="h-[110px] rounded-2xl bg-white/5" aria-hidden="true" />;
  }
  const werte = punkte.map((p) => p.eurMwh / 10);
  const min = Math.min(...werte);
  const max = Math.max(...werte);
  const W = 320, H = 110;
  const x = (i) => (i / (werte.length - 1)) * W;
  const y = (v) => 8 + (1 - (v - min) / Math.max(max - min, 1)) * (H - 16);
  const d = werte.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const iMin = werte.indexOf(min);
  const iJetzt = jetzt != null ? punkte.findIndex((p, i) => p.t <= jetzt && (punkte[i + 1]?.t ?? Infinity) > jetzt) : -1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Börsenstrompreis heute zwischen ${min.toFixed(1).replace(".", ",")} und ${max.toFixed(1).replace(".", ",")} Cent je Kilowattstunde netto`}>
      <defs>
        <linearGradient id="ov-hub-live" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8cba58" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8cba58" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#ov-hub-live)" />
      <path d={d} fill="none" stroke="#aed083" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x(iMin)} cy={y(min)} r="4.5" fill="#ffd873" stroke="#03122b" strokeWidth="2" />
      {iJetzt >= 0 && <circle cx={x(iJetzt)} cy={y(werte[iJetzt])} r="4.5" fill="#fff" stroke="#03122b" strokeWidth="2" />}
    </svg>
  );
}

export function VorschauCheckliste({ punkte }) {
  return (
    <ul className="space-y-2" aria-hidden="true">
      {punkte.map((p, i) => (
        <li key={p} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 text-[13px] text-ink-700 ring-1 ring-ink-200/70">
          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${i < 2 ? "bg-ov-500 text-white" : "bg-ink-100 text-ink-400"}`}>
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
