"use client";

import { Zap } from "lucide-react";
import useEnergyLive, { fmtCt } from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";

/** Schwebende Kennzahl im Hero: aktueller Börsenstrompreis der Gebotszone AT (live). */
export default function LivePreisBadge({ startwert }) {
  const d = useEnergyLive();
  const aktuell = d?.preis?.aktuell?.eurMwh ?? startwert ?? null;
  const tief = d?.preis?.heute?.min?.eurMwh;

  return (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-sun-300">
        <Zap aria-hidden="true" className="h-6 w-6" />
      </span>
      <div>
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ov-600">
          <LiveDot className="bg-ov-500" /> Börsenstrom AT jetzt
        </p>
        <p className="mt-1 font-display text-[22px] font-extrabold leading-none text-ink-900">
          {aktuell != null ? <span className="ov-num">{fmtCt(aktuell)}</span> : "–"} <span className="text-[14px] font-semibold text-ink-500">ct/kWh</span>
        </p>
        {tief != null && <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Tiefstwert heute {fmtCt(tief)} ct/kWh</p>}
      </div>
    </div>
  );
}
