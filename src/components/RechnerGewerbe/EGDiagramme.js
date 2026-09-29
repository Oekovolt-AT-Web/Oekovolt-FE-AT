"use client";

import { cn } from "@/components/ui/cn";
import { useBreite } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { MONATE_LANG } from "@/lib/rechner/profile";

const FARBE = { erzeuger: "#f5a70f", verbraucher: "#669933", hub: "#03122b", netz: "#97a0b0", raster: "#eef0f4" };
const mwh = (kwh) => (kwh >= 100000 ? `${fmt(kwh / 1000)} MWh` : kwh >= 1000 ? `${fmt(kwh / 1000, 1)} MWh` : `${fmt(kwh)} kWh`);
const r1 = (v) => Math.round(v * 10) / 10;
const p2 = (v) => Math.round(v * 100) / 100; // Prozentwerte für SSR und Client identisch

/**
 * Energiefluss: Erzeuger → Gemeinschaft → Verbraucher, Linienstärke nach Energiemenge,
 * animierte Punkte zeigen die Flussrichtung. Desktop waagrecht, Handy senkrecht.
 */
export function EGFluss({ teilnehmer, zeilen, geteilt, ueberschuss, restbedarf }) {
  const [ref, W] = useBreite(760);
  const senkrecht = W < 600;
  const erz = zeilen.map((z, i) => ({ ...z, i, name: teilnehmer[i].name })).filter((z) => z.geliefert > 0.5);
  const ver = zeilen.map((z, i) => ({ ...z, i, name: teilnehmer[i].name })).filter((z) => z.bezogen > 0.5);
  const maxFluss = Math.max(1, ...erz.map((z) => z.geliefert), ...ver.map((z) => z.bezogen));
  const staerke = (v) => 2 + (v / maxFluss) * (senkrecht ? 12 : 16);
  const rest = Math.max(0, ueberschuss - geteilt);
  const restBezug = Math.max(0, restbedarf - geteilt);

  if (!erz.length || !ver.length) {
    return (
      <div ref={ref} className="px-5 pb-6 pt-2 md:px-6">
        <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-[14px] text-ink-600">
          {!erz.length ? "Noch kein Überschuss zum Teilen – fügen Sie eine PV-Anlage hinzu." : "Noch kein Abnehmer mit Restbedarf – fügen Sie Teilnehmende hinzu."}
        </p>
      </div>
    );
  }

  let H, hub, knotenErz, knotenVer;
  const kw = senkrecht ? Math.min(150, (W - 16 - 8 * (Math.max(erz.length, ver.length) - 1)) / Math.max(erz.length, ver.length)) : Math.min(210, W * 0.27);
  const kh = senkrecht ? 58 : 56;
  if (senkrecht) {
    H = 400;
    hub = { x: W / 2, y: H / 2, r: 52 };
    const reihe = (liste, y) => {
      const gesamt = liste.length * kw + (liste.length - 1) * 8;
      const x0 = (W - gesamt) / 2;
      return liste.map((z, j) => ({ ...z, x: x0 + j * (kw + 8), y, w: kw, h: kh }));
    };
    knotenErz = reihe(erz, 8);
    knotenVer = reihe(ver, H - kh - 8);
  } else {
    const n = Math.max(erz.length, ver.length);
    H = Math.max(200, n * (kh + 18) + 30);
    hub = { x: W / 2, y: H / 2, r: 62 };
    const spalte = (liste, x) => {
      const gesamt = liste.length * kh + (liste.length - 1) * 18;
      const y0 = (H - gesamt) / 2;
      return liste.map((z, j) => ({ ...z, x, y: y0 + j * (kh + 18), w: kw, h: kh }));
    };
    knotenErz = spalte(erz, 4);
    knotenVer = spalte(ver, W - kw - 4);
  }

  const pfadErz = (k) => {
    if (senkrecht) {
      const x1 = k.x + k.w / 2, y1 = k.y + k.h, x2 = hub.x, y2 = hub.y - hub.r;
      return `M${r1(x1)},${r1(y1)} C${r1(x1)},${r1((y1 + y2) / 2)} ${r1(x2)},${r1((y1 + y2) / 2)} ${r1(x2)},${r1(y2)}`;
    }
    const x1 = k.x + k.w, y1 = k.y + k.h / 2, x2 = hub.x - hub.r, y2 = hub.y;
    return `M${r1(x1)},${r1(y1)} C${r1((x1 + x2) / 2)},${r1(y1)} ${r1((x1 + x2) / 2)},${r1(y2)} ${r1(x2)},${r1(y2)}`;
  };
  const pfadVer = (k) => {
    if (senkrecht) {
      const x1 = hub.x, y1 = hub.y + hub.r, x2 = k.x + k.w / 2, y2 = k.y;
      return `M${r1(x1)},${r1(y1)} C${r1(x1)},${r1((y1 + y2) / 2)} ${r1(x2)},${r1((y1 + y2) / 2)} ${r1(x2)},${r1(y2)}`;
    }
    const x1 = hub.x + hub.r, y1 = hub.y, x2 = k.x, y2 = k.y + k.h / 2;
    return `M${r1(x1)},${r1(y1)} C${r1((x1 + x2) / 2)},${r1(y1)} ${r1((x1 + x2) / 2)},${r1(y2)} ${r1(x2)},${r1(y2)}`;
  };

  const knoten = (k, art) => (
    <g key={`${art}-${k.i}`} className="rg-einblenden">
      <rect x={r1(k.x)} y={r1(k.y)} width={r1(k.w)} height={k.h} rx="14" fill="#fff" stroke={art === "e" ? FARBE.erzeuger : FARBE.verbraucher} strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x={r1(k.x)} y={r1(k.y)} width="5" height={k.h} rx="2.5" fill={art === "e" ? FARBE.erzeuger : FARBE.verbraucher} />
      <text x={r1(k.x + 14)} y={r1(k.y + 22)} className="fill-ink-900 text-[12.5px] font-semibold">
        {kuerzen(k.name, Math.floor((k.w - 20) / 7))}
      </text>
      <text x={r1(k.x + 14)} y={r1(k.y + 41)} className="fill-ink-500 text-[11.5px]">
        {art === "e" ? `liefert ${mwh(k.geliefert)}` : `bezieht ${mwh(k.bezogen)}`}
      </text>
    </g>
  );

  return (
    <div ref={ref} className="px-2 pb-4 md:px-3">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block select-none"
        role="img"
        aria-label={`Energiefluss: ${erz.length} Erzeuger liefern zusammen ${mwh(geteilt)} an ${ver.length} Verbraucher in der Gemeinschaft.`}
      >
        {knotenErz.map((k) => (
          <g key={`pe-${k.i}`}>
            <path d={pfadErz(k)} fill="none" stroke={FARBE.erzeuger} strokeOpacity="0.28" strokeWidth={staerke(k.geliefert)} strokeLinecap="round" />
            <path d={pfadErz(k)} fill="none" stroke={FARBE.erzeuger} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 12" className="rg-fluss" />
          </g>
        ))}
        {knotenVer.map((k) => (
          <g key={`pv-${k.i}`}>
            <path d={pfadVer(k)} fill="none" stroke={FARBE.verbraucher} strokeOpacity="0.28" strokeWidth={staerke(k.bezogen)} strokeLinecap="round" />
            <path d={pfadVer(k)} fill="none" stroke={FARBE.verbraucher} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 12" className="rg-fluss" />
          </g>
        ))}

        <circle cx={hub.x} cy={hub.y} r={hub.r + 12} fill={FARBE.verbraucher} opacity="0.35" className="rg-puls" />
        <circle cx={hub.x} cy={hub.y} r={hub.r} fill={FARBE.hub} />
        <circle cx={hub.x} cy={hub.y} r={hub.r - 5} fill="none" stroke="#fff" strokeOpacity="0.12" />
        <text x={hub.x} y={hub.y - 12} textAnchor="middle" className="fill-white/70 text-[11px] font-semibold uppercase tracking-[0.12em]">
          Gemeinschaft
        </text>
        <text x={hub.x} y={hub.y + 11} textAnchor="middle" className="fill-white font-display text-[19px] font-extrabold">
          {mwh(geteilt)}
        </text>
        <text x={hub.x} y={hub.y + 29} textAnchor="middle" className="fill-white/60 text-[10.5px]">
          geteilt pro Jahr
        </text>

        {knotenErz.map((k) => knoten(k, "e"))}
        {knotenVer.map((k) => knoten(k, "v"))}
      </svg>
      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <span className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-sun-500" aria-hidden="true" />Überschuss an die Gemeinschaft</span>
        <span className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-ov-500" aria-hidden="true" />Gemeinschaftsstrom an Verbraucher</span>
        <span className="ov-num text-ink-500">Rest ins Netz {mwh(rest)} · Reststrom vom Lieferanten {mwh(restBezug)}</span>
      </div>
    </div>
  );
}

function kuerzen(t, n) {
  const s = String(t || "");
  return s.length > n ? `${s.slice(0, Math.max(3, n - 1))}…` : s;
}

/** Monatsbilanz: Überschuss der Erzeuger vs. geteilte Energie */
export function EGMonate({ monat }) {
  const max = Math.max(1, ...monat.map((m) => Math.max(m.ueberschuss, m.geteilt)));
  const lang = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const kurz = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div className="px-4 pb-5 pt-4 md:px-6">
      <ul className="grid h-40 grid-cols-12 items-end gap-1 sm:gap-2">
        {monat.map((m, i) => (
          <li key={m.name} className="relative flex h-full items-end justify-center" title={`${MONATE_LANG[i]}: Überschuss ${mwh(m.ueberschuss)}, geteilt ${mwh(m.geteilt)}`}>
            <span className="rg-balken absolute bottom-0 w-[70%] max-w-7 rounded-t-[5px] bg-sun-300/70" style={{ height: `${p2((m.ueberschuss / max) * 100)}%` }} />
            <span className="rg-balken relative w-[70%] max-w-7 rounded-t-[5px] bg-ov-500" style={{ height: `${p2((m.geteilt / max) * 100)}%` }} />
          </li>
        ))}
      </ul>
      <ul className="mt-1.5 grid grid-cols-12 gap-1 sm:gap-2" aria-hidden="true">
        {monat.map((m, i) => (
          <li key={m.name} className="text-center text-[11px] font-semibold text-ink-500">
            <span className="sm:hidden">{kurz[i]}</span>
            <span className="hidden sm:inline">{lang[i]}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-sun-300/70" aria-hidden="true" />PV-Überschuss der Erzeuger</li>
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" aria-hidden="true" />zeitgleich in der Gemeinschaft genutzt</li>
      </ul>
    </div>
  );
}

/** Preisleiter: OeMAG-Marktpreis – Gemeinschaftspreis – Energiepreis */
export function EGPreisleiter({ marktpreis, egPreis, energiepreis }) {
  const min = Math.min(marktpreis, egPreis) - 1;
  const max = Math.max(energiepreis, egPreis) + 1;
  const pos = (v) => ((v - min) / (max - min)) * 100;
  const punkte = [
    { id: "m", v: marktpreis, label: "OeMAG-Marktpreis", klasse: "bg-ink-400" },
    { id: "e", v: energiepreis, label: "Energiepreis Lieferant", klasse: "bg-navy-600" },
  ];
  return (
    <div className="relative pb-4 pt-10">
      <div className="relative h-2.5 rounded-full bg-ink-100">
        <div className="absolute inset-y-0 rounded-full bg-sun-400/70 motion-safe:transition-all motion-safe:duration-500" style={{ left: `${p2(pos(marktpreis))}%`, width: `${p2(Math.max(0, pos(egPreis) - pos(marktpreis)))}%` }} />
        <div className="absolute inset-y-0 rounded-full bg-ov-400/70 motion-safe:transition-all motion-safe:duration-500" style={{ left: `${p2(pos(egPreis))}%`, width: `${p2(Math.max(0, pos(energiepreis) - pos(egPreis)))}%` }} />
      </div>
      {punkte.map((p) => (
        <span key={p.id} className={cn("absolute top-10 -mt-[3px] block h-4 w-1 -translate-x-1/2 rounded-full motion-safe:transition-all motion-safe:duration-500", p.klasse)} style={{ left: `${p2(pos(p.v))}%` }} aria-hidden="true" />
      ))}
      <div className="mt-3 flex justify-between gap-4 text-[11.5px] text-ink-600">
        {punkte.map((p) => (
          <span key={p.id} className={p.id === "e" ? "text-right" : ""}>
            {p.label}
            <strong className="ov-num block text-[13px] text-ink-900">{fmt(p.v, 2)} ct</strong>
          </span>
        ))}
      </div>
      <div className="absolute top-0 -translate-x-1/2 motion-safe:transition-all motion-safe:duration-500" style={{ left: `${p2(pos(egPreis))}%` }}>
        <span className="ov-num block whitespace-nowrap rounded-full bg-ink-900 px-2.5 py-1 text-[12px] font-bold text-white shadow">{fmt(egPreis, 2)} ct</span>
        <span className="mx-auto mt-0.5 block h-3.5 w-3.5 rounded-full border-[3px] border-white bg-ink-900 shadow" />
      </div>
    </div>
  );
}
