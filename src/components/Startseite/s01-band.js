"use client";

import { useEffect, useRef, useState } from "react";
import S01Zahl from "./s01-zahl";

// Zeitplan des Datenmoments (ms ab Eintritt): Linie zeichnet sich, ein Lichtimpuls läuft
// über die Horizontlinie und „zündet“ nacheinander die Knoten – dann zählen die Zahlen.
const KNOTEN_MS = [380, 720, 1060];

/**
 * Kennzahlenband am Fuß des Heros (Präfix s01). Server-HTML enthält alle Endwerte;
 * die Zahlen sind für Screenreader als Klartext hinterlegt, die Animation ist aria-hidden.
 * Ausgelöst einmal beim Eintritt ins Sichtfeld.
 */
export default function S01Band({ fakten, titel, hinweis }) {
  const ref = useRef(null);
  const [an, setAn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setAn(true);
        io.disconnect();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`s01-band relative ${an ? "s01-an" : ""}`}>
      <div className="ov-container">
        <div className="s01-b-kopf flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-display text-[14px] font-bold tracking-[-0.01em] text-white">{titel}</p>
          <p className="text-[12.5px] text-white/50">{hinweis}</p>
        </div>

        <dl className="s01-b-liste relative mt-6 grid gap-9 pb-14 pl-8 md:mt-7 md:grid-cols-3 md:gap-0 md:pb-20 md:pl-0 md:pt-12">
          {/* Mobil: senkrechte Schiene · ab md: Horizontlinie über die volle Breite mit Lichtimpuls */}
          <span aria-hidden="true" className="s01-b-schiene absolute bottom-16 left-[5px] top-2 w-px md:hidden" />
          <span aria-hidden="true" className="s01-b-horizont absolute top-0 hidden h-px md:block" />
          <span aria-hidden="true" className="s01-b-impuls absolute top-0 hidden md:block" />

          {fakten.map((k, i) => {
            const top = k.prefix && k.prefix.trim() === "TOP";
            return (
              <div key={k.label} className="s01-b-fakt relative flex flex-col-reverse md:pr-10" style={{ "--s01-k": `${KNOTEN_MS[i] ?? 380 + i * 340}ms` }}>
                <span aria-hidden="true" className="s01-b-knoten absolute" />
                <dt className="s01-b-label mt-3 max-w-[16rem] text-[14px] leading-snug text-white/60">{k.label}</dt>
                <dd className="s01-b-wert font-display font-extrabold leading-[0.95] tracking-[-0.04em]">
                  <span className="sr-only">{k.wert}</span>
                  <span aria-hidden="true" className="ov-num inline-flex items-baseline whitespace-nowrap">
                    {top ? (
                      <>
                        <span className="s01-b-einheit mr-[0.18em] text-white/55">TOP</span>
                        <span className="s01-b-maske inline-block overflow-hidden align-bottom">
                          <span className="s01-b-drei inline-block">{k.zahl}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        {k.prefix && <span className="s01-b-einheit mr-[0.18em] text-white/55">{k.prefix.trim()}</span>}
                        <span className={i === 1 ? "ov-text-gradient-light" : ""}>
                          <S01Zahl wert={k.zahl} aktiv={an} auftakt verzoegerung={(KNOTEN_MS[i] ?? 380) - 120} auftaktDauer={1600} />
                        </span>
                        {k.suffix && <span className="s01-b-einheit ml-[0.18em] text-white/55">{k.suffix.trim()}</span>}
                      </>
                    )}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
