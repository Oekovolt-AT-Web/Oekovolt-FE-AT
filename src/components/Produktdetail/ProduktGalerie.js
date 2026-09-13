"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ImageOff } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Produktgalerie für Herstellerseiten: große Bühne + Vorschaubilder.
 * Alle Produkttexte werden serverseitig mitgerendert (inaktive Panels mit
 * `hidden`), damit Suchmaschinen den vollständigen Inhalt sehen.
 * produkte: [{ name, bild, alt, beschreibung, merkmale: [] }]
 */
export default function ProduktGalerie({ produkte = [], hersteller, ctaHref = "/angebot" }) {
  const [aktiv, setAktiv] = useState(0);
  const tabs = useRef([]);

  if (!produkte.length) return null;

  const tastatur = (e, i) => {
    let ziel = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") ziel = (i + 1) % produkte.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") ziel = (i - 1 + produkte.length) % produkte.length;
    if (e.key === "Home") ziel = 0;
    if (e.key === "End") ziel = produkte.length - 1;
    if (ziel != null) {
      e.preventDefault();
      setAktiv(ziel);
      tabs.current[ziel]?.focus();
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* Bühne */}
        <div className="border-b border-ink-100 bg-gradient-to-b from-sand-50 to-ink-50 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white ring-1 ring-ink-100">
            <div aria-hidden="true" className="ov-grid-bg-light absolute inset-0 opacity-60" />
            {produkte.map((p, i) =>
              p.bild ? (
                <Image
                  key={`${i}-${p.name}`}
                  src={p.bild}
                  alt={p.alt || p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-contain p-6 transition-all duration-500 sm:p-10 ${i === aktiv ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
                  priority={i === 0}
                />
              ) : (
                i === aktiv && (
                  <div key={`${i}-${p.name}`} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-500">
                    <ImageOff aria-hidden="true" className="h-10 w-10" />
                    <span className="text-[14px]">Kein Produktbild hinterlegt</span>
                  </div>
                )
              )
            )}
            <span className="absolute bottom-4 left-4 rounded-full bg-ink-900/85 px-3 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur">
              <span className="ov-num">{aktiv + 1}</span> / {produkte.length}
            </span>
          </div>

          {produkte.length > 1 && (
            <div role="tablist" aria-label={`Produkte von ${hersteller}`} className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {produkte.map((p, i) => {
                const an = i === aktiv;
                return (
                  <button
                    key={`${i}-${p.name}`}
                    ref={(el) => (tabs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`produkt-tab-${i}`}
                    aria-selected={an}
                    aria-controls={`produkt-panel-${i}`}
                    tabIndex={an ? 0 : -1}
                    onClick={() => setAktiv(i)}
                    onKeyDown={(e) => tastatur(e, i)}
                    className={`group flex w-28 shrink-0 flex-col overflow-hidden rounded-2xl bg-white text-left ring-2 transition-all duration-300 sm:w-32 ${
                      an ? "ring-ov-500 shadow-lg" : "ring-transparent opacity-75 hover:opacity-100 hover:ring-ink-200"
                    }`}
                  >
                    <span className="relative block aspect-square w-full bg-sand-50">
                      {p.bild ? (
                        <Image src={p.bild} alt="" fill sizes="128px" className="object-contain p-2" />
                      ) : (
                        <ImageOff aria-hidden="true" className="absolute inset-0 m-auto h-6 w-6 text-ink-300" />
                      )}
                    </span>
                    <span className={`line-clamp-2 min-h-[2.6em] px-2.5 py-2 text-[12px] font-semibold leading-tight ${an ? "text-ink-900" : "text-ink-600"}`}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Produktinformationen */}
        <div className="p-6 md:p-8 lg:p-10">
          {produkte.map((p, i) => (
            <div
              key={`${i}-${p.name}`}
              id={`produkt-panel-${i}`}
              role={produkte.length > 1 ? "tabpanel" : undefined}
              aria-labelledby={produkte.length > 1 ? `produkt-tab-${i}` : undefined}
              hidden={i !== aktiv}
              className="ov-hero-in"
            >
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{hersteller}</p>
              <h3 className="ov-h3 mt-2 break-words text-ink-900 md:text-[28px]">{p.name}</h3>
              {p.beschreibung && (
                <div className="mt-5 space-y-3 text-[16px] leading-relaxed text-ink-600">
                  {p.beschreibung
                    .split(/\n+/)
                    .map((z) => z.trim())
                    .filter(Boolean)
                    .map((z, j) => (
                      <p key={j}>{z}</p>
                    ))}
                </div>
              )}
              {p.merkmale.length > 0 && (
                <div className="mt-7">
                  <p className="text-[14px] font-semibold text-ink-900">Leistungsmerkmale</p>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {p.merkmale.map((m) => (
                      <li key={m} className="flex gap-2.5 rounded-2xl bg-sand-50 px-3.5 py-3 text-[14.5px] leading-snug text-ink-700 ring-1 ring-ink-100">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white">
                          <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href={ctaHref} pfeil>
                  Beratung zu diesem Produkt
                </Button>
                {produkte.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setAktiv((i + 1) % produkte.length)}
                    className="group inline-flex h-12 items-center gap-2 self-start whitespace-nowrap rounded-full px-4 text-[15px] font-semibold text-ink-700 hover:bg-ink-50 sm:self-auto"
                  >
                    Nächstes Produkt
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
