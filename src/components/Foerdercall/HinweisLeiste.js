"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { callPhase } from "@/lib/foerdercall";

const TEXTE = {
  vor: { kurz: "EAG-Fördercall für PV & Speicher:", lang: "Ticketziehung am 08.10.2026 um 17 Uhr – jetzt Unterlagen vorbereiten" },
  ticket: { kurz: "EAG-Fördercall gestartet:", lang: "Ticketziehung seit 17 Uhr, Antragseinreichung ab 09.10., 8 Uhr" },
  einreichung: { kurz: "EAG-Fördercall läuft:", lang: "Anträge bis 22.10.2026, 23:59 Uhr einreichen" },
};

/**
 * Schmale Hinweisleiste zum 3. EAG-Fördercall 2026. Startzustand kommt vom
 * Server (hydrationssicher); nach dem Mounten prüft die Leiste die Uhrzeit
 * selbst und blendet sich nach Call-Ende aus.
 */
export default function HinweisLeiste({ startMs }) {
  const [phase, setPhase] = useState(() => callPhase(startMs));

  useEffect(() => {
    const pruefen = () => setPhase(callPhase(Date.now()));
    pruefen();
    const t = setInterval(pruefen, 60_000);
    return () => clearInterval(t);
  }, []);

  const text = TEXTE[phase];
  if (!text) return null;

  return (
    <aside aria-label="Hinweis zum EAG-Fördercall" className="relative border-b border-white/10 bg-navy-900 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-ov-500/25 to-transparent" />
      <div className="ov-container relative flex min-h-11 items-center justify-center py-2">
        <Link href="/forderungen/eag-foerdercall" className="group inline-flex items-center gap-2.5 text-center text-[13.5px] leading-snug text-white/85 hover:text-white">
          <span className="relative hidden h-2 w-2 shrink-0 sm:flex">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ov-400 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ov-400" />
          </span>
          <span>
            <strong className="font-semibold text-white">{text.kurz}</strong> {text.lang}
          </span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </aside>
  );
}
