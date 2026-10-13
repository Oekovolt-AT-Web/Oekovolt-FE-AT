// src/components/RechnerGewerbe/DachZeichnenTeaser.js – Teaser für den Hallendach-Planer (Welle B, B05)
//
// Rein statisch (Server-Komponente, kein "use client"): lädt weder Karte noch Planer-Code nach und
// verlinkt auf den aufklappbaren Planer oberhalb des Gewerbe-PV-Rechners. Einbau auf /gewerbe durch
// A04 (siehe docs/projekt-doku/anhang/wellen/B05.md, Übergabe).

import { Pentagon } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export const PLANER_HREF = "/rechner/gewerbe-pv#dach-einzeichnen";

export default function DachZeichnenTeaser({ className }) {
  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-navy-900 p-6 text-white ring-1 ring-white/10 sm:p-8 lg:flex lg:items-center lg:gap-8", className)}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300 ring-1 ring-white/15">
        <Pentagon aria-hidden="true" className="h-7 w-7" />
      </div>
      <div className="mt-5 min-w-0 flex-1 lg:mt-0">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Hallendach-Planer</p>
        <h3 className="mt-2 font-display text-[22px] font-extrabold leading-tight sm:text-[26px]">Wie viel kWp passen auf Ihr Dach? Zeichnen Sie es ein.</h3>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/80">Hallendach auf dem Orthofoto von basemap.at umfahren – Nutzfläche nach Rand- und Hindernisabzug, Anlagenleistung und Übergabe in den Gewerbe-PV-Rechner. Ohne Karte geht es mit Länge × Breite.</p>
      </div>
      <Button href={PLANER_HREF} variant="white" pfeil className="mt-6 shrink-0 lg:mt-0">
        Dach einzeichnen
      </Button>
    </div>
  );
}
