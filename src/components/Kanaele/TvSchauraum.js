"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { kurzUrl } from "./tv/gemeinsam";
import IntroGrafik from "./tv/Folie00Intro";
import KarteGrafik from "./tv/Folie01Karte";
import BetriebGrafik from "./tv/Folie02Betrieb";
import RingGrafik from "./tv/Folie03Ring";
import BranchenGrafik from "./tv/Folie04Branchen";
import StromGrafik, { StromPreis } from "./tv/Folie05Strom";
import LastgangGrafik from "./tv/Folie06Lastgang";
import AgriGrafik from "./tv/Folie07Agri";
import NetzwerkGrafik from "./tv/Folie08Netzwerk";
import RegelungGrafik from "./tv/Folie09Regelung";
import ThermoGrafik from "./tv/Folie10Thermo";
import KontaktGrafik from "./tv/Folie11Kontakt";


/**
 * Werbefolien für den Schauraum-TV (55 Zoll, Querformat). Inhalte: src/data/tvSchauraum.js.
 *
 * Aufbau jeder Folie: links Text (Thema, Satz, wenige Punkte, QR-Code), rechts eine eigens für
 * den Bildschirm gezeichnete Grafik. Maße in em (Basis 1vw der TV-Anzeige), SVG-Grafiken im
 * Raster 1040 × 840. Jede Grafik liegt in src/components/Kanaele/tv/FolieNN*.js.
 *
 * Textspalte, sobald `aktiv`: Themenstrich zeichnet sich (120 ms), Thema gleitet ein (260 ms),
 * Überschrift steigt Zeile für Zeile aus einer Maske (ab 300 ms, +110 ms je Zeile), danach folgen
 * alle weiteren Blöcke im 65-ms-Takt (ab 560 ms, spätestens 900 ms). Alles steht nach ≤ 1,6 s.
 * Wird die Folie abgelöst, blendet die Spalte als Ganzes kurz aus. CSS-Klassen tvx-*: TvAnzeige.js.
 */

export default function SchauraumFolie({ folie: f, aktiv }) {
  const Grafik = GRAFIKEN[f.grafik] || (() => null);
  // Vollbild-Folien (z. B. Intro) bekommen die ganze Bühne ohne Textspalte.
  if (f.vollbild) {
    return (
      <div className="relative col-span-2 h-full min-h-0 overflow-hidden bg-navy-950 text-white">
        <Grafik f={f} aktiv={aktiv} />
      </div>
    );
  }
  return (
    <div className="relative col-span-2 grid h-full min-h-0 grid-cols-[32em_1fr] gap-[5em] overflow-hidden bg-navy-950 px-[5em] pb-[3.2em] pt-[3.8em] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[12em] top-1/2 h-[64em] w-[64em] -translate-y-1/2 rounded-full bg-navy-700/30 blur-[160px]" />
      <TextSpalte f={f} aktiv={aktiv} />
      <div className="relative min-h-0">
        <Grafik f={f} aktiv={aktiv} />
      </div>
    </div>
  );
}

/* ================================================================== */
/* Textspalte                                                          */
/* ================================================================== */

/** Folge-Block k: steigt auf, im 65-ms-Takt ab 560 ms, spätestens nach 900 ms. */
const folge = (aktiv, k) => (aktiv ? { className: "tvx-hoch", style: { animationDelay: `${Math.min(560 + k * 65, 900)}ms` } } : { className: "", style: undefined });

function TextSpalte({ f, aktiv }) {
  let k = 0;
  const naechster = () => folge(aktiv, k++);
  const block = (inhalt, extra = "") => {
    const b = naechster();
    return { className: `${b.className} ${extra}`.trim(), style: b.style, children: inhalt };
  };

  return (
    <div className={`relative flex min-h-0 flex-col ${aktiv ? "" : "tvx-aus"}`}>
      <p className="flex items-center gap-[0.7em] text-[1.15em] font-semibold tracking-[0.01em] text-ov-300">
        {f.grafik === "strom" ? (
          <span className={`relative h-[0.55em] w-[0.55em] ${aktiv ? "tvx-punkt" : ""}`}>
            <span className="tv-blinken absolute inset-0 rounded-full bg-ov-400" />
          </span>
        ) : (
          <span className={`h-[0.16em] w-[1.8em] rounded-full bg-ov-400 ${aktiv ? "tvx-strich" : ""}`} />
        )}
        <span className={aktiv ? "tvx-kicker" : ""}>{f.kategorie}</span>
      </p>
      <Titel text={f.titel} aktiv={aktiv} />

      {f.grafik === "strom" && (
        <div {...block(null)}>
          <StromPreis aktiv={aktiv} />
        </div>
      )}

      {f.zahlen && (
        <dl className="mt-[1.8em] border-t border-white/10">
          {f.zahlen.map((z) => {
            const b = naechster();
            return (
              <div key={z.label} className={`flex items-baseline gap-[0.8em] border-b border-white/10 py-[0.75em] ${b.className}`} style={b.style}>
                <dt className="order-2 text-[1.2em] leading-snug text-white/65">{z.label}</dt>
                <dd className="order-1 shrink-0 font-display font-extrabold tabular-nums tracking-[-0.03em]">
                  <span className="text-[2.7em]">{z.wert}</span>
                  {z.einheit && <span className="ml-[0.2em] text-[1.3em] text-white/70">{z.einheit}</span>}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
      {f.fussnote && <p {...block(f.fussnote, "mt-[1em] text-[0.95em] text-white/40")} />}

      {f.text && <p {...block(f.text, "mt-[1.1em] max-w-[25em] text-[1.35em] leading-[1.55] text-white/70")} />}

      {f.punkte?.length > 0 && (
        <ul className="mt-[1.5em] space-y-[0.65em]">
          {f.punkte.map((p) => {
            const b = naechster();
            return (
              <li key={p} className={`flex items-center gap-[0.75em] text-[1.3em] font-semibold ${b.className}`} style={b.style}>
                <span className="h-[0.42em] w-[0.42em] shrink-0 rounded-[0.08em] bg-ov-400" />
                {p}
              </li>
            );
          })}
        </ul>
      )}

      {f.kontakt && (
        <div className="mt-[1.8em] space-y-[0.7em]">
          <p {...block(null, "flex items-center gap-[0.5em] font-display text-[2.6em] font-extrabold tracking-[-0.02em]")}>
            <Phone aria-hidden="true" className="h-[0.7em] w-[0.7em] text-ov-300" />
            {f.kontakt[0]}
          </p>
          <p {...block(null, "flex items-center gap-[0.6em] text-[1.5em] font-semibold")}>
            <Mail aria-hidden="true" className="h-[0.9em] w-[0.9em] text-ov-300" />
            {f.kontakt[1]}
          </p>
          <p {...block(null, "flex items-center gap-[0.6em] text-[1.3em] text-white/70")}>
            <MapPin aria-hidden="true" className="h-[1em] w-[1em] text-ov-300" />
            {f.kontakt[2]}
          </p>
        </div>
      )}

      <div className="mt-auto pt-[1.4em]">
        {f.qrSvg && f.grafik !== "kontakt" && (
          <div {...block(null, "flex items-center gap-[1.2em] border-t border-white/10 pt-[1.5em]")}>
            <div className="h-[5.8em] w-[5.8em] shrink-0 rounded-[0.45em] bg-white p-[0.42em]" dangerouslySetInnerHTML={{ __html: f.qrSvg }} />
            <div>
              <p className="text-[1.25em] font-semibold">Mehr dazu auf dem Handy</p>
              <p className="mt-[0.15em] text-[1.15em] font-semibold text-ov-300">{kurzUrl(f.url)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Überschrift, die Zeile für Zeile aus einer Maske steigt. Die Zeilen ergeben sich erst aus dem
 * Umbruch im Browser: beim Aktivwerden wird jedes Wort seiner Zeile zugeordnet (--z), bevor der
 * erste Frame gemalt wird. Server und erster Client-Render sind identisch (kein Hydration-Risiko).
 */
function Titel({ text, aktiv }) {
  const ref = useRef(null);
  const woerter = String(text || "").split(/\s+/).filter(Boolean);

  useLayoutEffect(() => {
    if (!aktiv || !ref.current) return;
    let zeile = -1;
    let oben = -Infinity;
    ref.current.querySelectorAll(".tvx-maske").forEach((w) => {
      if (w.offsetTop > oben + 2) {
        zeile += 1;
        oben = w.offsetTop;
      }
      w.style.setProperty("--z", String(zeile));
    });
  }, [aktiv, text]);

  return (
    <h1 ref={ref} className="mt-[0.65em] font-display text-[3.2em] font-extrabold leading-[1.06] tracking-[-0.035em]" style={{ textWrap: "balance" }}>
      {woerter.map((w, i) => (
        <Fragment key={i}>
          <span className="tvx-maske">
            <span className={aktiv ? "tvx-zeile" : ""}>{w}</span>
          </span>
          {i < woerter.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}

const GRAFIKEN = {
  intro: IntroGrafik,
  karte: KarteGrafik,
  betrieb: BetriebGrafik,
  ring: RingGrafik,
  branchen: BranchenGrafik,
  strom: StromGrafik,
  lastgang: LastgangGrafik,
  agri: AgriGrafik,
  netzwerk: NetzwerkGrafik,
  regelung: RegelungGrafik,
  thermo: ThermoGrafik,
  kontakt: KontaktGrafik,
};
