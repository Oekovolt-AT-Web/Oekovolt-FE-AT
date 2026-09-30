"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/components/ui/cn";
import KopierFeld from "./KopierFeld";

/**
 * Auswahl hell/dunkel × kompakt/breit, Vorschau und Einbau-Code.
 * varianten: { "hell-klein": { src, code, breite, hoehe }, … } – serverseitig berechnet.
 */
const STILE = [
  { id: "hell", label: "Hell" },
  { id: "dunkel", label: "Dunkel" },
];
const FORMATE = [
  { id: "klein", label: "Kompakt" },
  { id: "breit", label: "Breit" },
];

function Umschalter({ label, optionen, wert, setzen }) {
  return (
    <fieldset>
      <legend className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</legend>
      <div className="mt-2 inline-flex rounded-full bg-ink-100 p-1">
        {optionen.map((o) => (
          <label
            key={o.id}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-[14px] font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ov-500",
              wert === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-900"
            )}
          >
            <input type="radio" name={label} value={o.id} checked={wert === o.id} onChange={() => setzen(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SiegelKonfigurator({ varianten, dateiname }) {
  const [stil, setStil] = useState("hell");
  const [format, setFormat] = useState("klein");
  const [grund, setGrund] = useState("hell");
  const v = varianten[`${stil}-${format}`];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div>
        <div className="flex flex-wrap gap-6">
          <Umschalter label="Stil" optionen={STILE} wert={stil} setzen={setStil} />
          <Umschalter label="Format" optionen={FORMATE} wert={format} setzen={setFormat} />
          <Umschalter
            label="Vorschau auf"
            optionen={[
              { id: "hell", label: "Heller Seite" },
              { id: "dunkel", label: "Dunkler Seite" },
            ]}
            wert={grund}
            setzen={setGrund}
          />
        </div>
        <div
          className={cn(
            "mt-6 flex min-h-[260px] items-center justify-center overflow-hidden rounded-3xl p-6 ring-1 transition-colors md:p-10",
            grund === "hell" ? "bg-sand-100 ring-ink-200/70" : "bg-navy-900 ring-navy-800"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={v.src} src={v.src} alt={v.alt} width={v.breite} height={v.hoehe} className="h-auto max-w-full" />
        </div>
        <p className="mt-3 text-[13px] text-ink-500">
          {v.breite} × {v.hoehe} Pixel · skaliert auf kleinen Bildschirmen automatisch mit.
        </p>
      </div>
      <div>
        <h3 className="font-display text-[20px] font-bold text-ink-900">Einbau-Code</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          Fügen Sie diesen HTML-Code dort ein, wo das Siegel erscheinen soll – etwa im Fußbereich oder auf Ihrer Nachhaltigkeitsseite (im CMS meist als „HTML-Block“).
        </p>
        <KopierFeld className="mt-4" text={v.code} label="Code kopieren" code zeilen={6} />
        <a
          href={v.src}
          download={`${dateiname}-${stil}-${format}.svg`}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          SVG herunterladen
        </a>
      </div>
    </div>
  );
}
