"use client";

// src/components/GewerbeUnikat/HeroRollen.js
//
// Rollen-Weiche im Hero: „Wo möchten Sie einsteigen?“ – drei gefüllte Chips (Geschäftsführung, Finanzen,
// Technik). Ein Klick merkt die Rolle im Projektsteckbrief und führt zum passenden Kapitel; nichts wird
// ausgeblendet. Die Zielgruppen-Variante (?utm_term=…) markiert nur einen Vorschlag, sie wählt nichts aus.

import { ArrowDownRight } from "lucide-react";
import { ereignis } from "@/lib/statistik";
import { useReduzierteBewegung } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { KAPITEL, ROLLEN } from "./_tokens";

// Einstieg je Rolle: Kapitel-Kennung aus KAPITEL (Anker und Nummer kommen von dort)
const EINSTIEG = {
  gf: { kapitel: "k3", frage: "Lohnt sich das – und wie groß?" },
  cfo: { kapitel: "k4", frage: "Was ist eine kWh vom Dach wert?" },
  technik: { kapitel: "k1", frage: "Was verrät unser Lastgang?" },
};

export default function HeroRollen({ vorschlag = null }) {
  const rolle = useSteckbrief((z) => z.rolle);
  const ruhig = useReduzierteBewegung();

  const waehlen = (id, e) => {
    steckbrief.setze({ rolle: id });
    ereignis("rolle_gewaehlt", { rolle: id });
    const k = KAPITEL.find((x) => x.id === EINSTIEG[id].kapitel);
    const ziel = k && document.getElementById(k.anker);
    if (!ziel) return;
    ziel.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    // Tastatur (detail 0): Fokus an die Kapitelüberschrift, damit es dort weitergeht
    if (e.detail === 0) {
      const h = ziel.querySelector("h2");
      if (h) {
        if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
        h.focus({ preventScroll: true });
      }
    }
  };

  return (
    <div className="mt-12 grid gap-4 md:mt-14 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:items-center lg:gap-10">
      <div>
        <p id="hero-rollen-titel" className="font-display text-[18px] font-bold leading-snug text-white md:text-[20px]">
          Wo möchten Sie einsteigen?
        </p>
        <p className="mt-1 text-[13.5px] leading-snug text-white/55">Jede Rolle hat ihre Frage – alle Kapitel bleiben sichtbar.</p>
      </div>
      <div role="group" aria-labelledby="hero-rollen-titel" className="grid gap-2 sm:grid-cols-3">
        {ROLLEN.map((r) => {
          const k = KAPITEL.find((x) => x.id === EINSTIEG[r.id].kapitel);
          const nummer = String(KAPITEL.indexOf(k)).padStart(2, "0");
          const aktiv = rolle === r.id;
          const vorgeschlagen = !rolle && vorschlag === r.id;
          return (
            <button
              key={r.id}
              type="button"
              data-testid={`rolle-${r.id}`}
              aria-pressed={aktiv}
              onClick={(e) => waehlen(r.id, e)}
              className={[
                "group relative flex min-h-[60px] w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors duration-200",
                aktiv ? "bg-white text-navy-950" : "bg-white/[0.07] text-white hover:bg-white/[0.12]",
              ].join(" ")}
            >
              <span className="min-w-0">
                {/* Vorschlag aus der Suche: eigene Zeile über der Rolle, nie umbrechend */}
                {vorgeschlagen && (
                  <span className="mb-1.5 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-ov-400/15 px-2 py-0.5 text-[11px] font-semibold leading-tight text-ov-300">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-400" />
                    passt zu Ihrer Suche
                  </span>
                )}
                <span className="block font-display text-[15.5px] font-bold leading-tight">{r.label}</span>
                <span className={`mt-1 block text-[13px] leading-snug ${aktiv ? "text-navy-950/70" : "text-white/60"}`}>{EINSTIEG[r.id].frage}</span>
              </span>
              <span className={`flex shrink-0 items-center gap-1 text-[12px] font-semibold ${aktiv ? "text-ov-700" : "text-white/60"}`}>
                <span className="ov-num">{nummer}</span>
                <ArrowDownRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </span>
              <span className="sr-only">{`, weiter zu Kapitel ${nummer} ${k.kurz}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
