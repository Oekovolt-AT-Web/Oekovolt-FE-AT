// src/components/GewerbeUnikat/K6Ansicht.js
//
// K6 · Netzanschluss – REINE Ansicht (ohne Hooks, ohne "use client"): Schwellen-Lineal (DC und AC,
// logarithmisch), TOR-Typ direkt an der AC-Summe, Tor-Karte und das mitwachsende Einlinienschaltbild.
//  - Server: rendert sie mit dem Startzustand als Platzhalter (statisch, `inert`) – alle Zahlen als HTML.
//  - Client (K6Lineal): dieselbe Ansicht mit motion-Elementen (k), Handlern (a) und Slots. So bleibt die
//    Fläche beim Austausch gleich (kein CLS); die Bühne lädt erst in Bildschirmnähe.
//
// Komposition „Ursache links, Wirkung rechts“ (QA 12.10.: Ursache und Wirkung in EIN Blickfeld):
//  - ab 1.024 px: links die Lineale mit Schieber, Feldern und Speicher-Chip; rechts das Einlinienschaltbild
//    im Hochformat und darunter die Tor-Karte. Zieht man über 250 kW AC, kippt das Badge neben der AC-Summe
//    und im selben Moment wächst rechts der Parkregler samt Sollwert-Leitungen.
//  - darunter: eine Spalte; Reihenfolge über `order` (die Spalten-Hüllen sind dort `display: contents`):
//    DC-Lineal → AC-Summe mit Badge → Erkenntnis → Speicher-Chip → AC-Lineal → Tor-Karte → Ablesung → Felder → Schaltbild
//    (Badge und Erkenntnis liegen so beim Ziehen und beim Speicher-Chip im Bild).
//  - Tab-Reihenfolge (DOM): Schieber → Felder → Chips → Tor-Fahnen → Netzebene → Tor-Karte. Die Fahnen stehen
//    im DOM hinter den Feldern und werden per `order` über ihre Spur gesetzt.
//  - Feste Höhen: Badge, Erkenntnis und Tor-Karte liegen als Stapel in EINER Rasterzelle (alle Varianten im
//    HTML, sichtbar die passende) – die Zelle ist so hoch wie die größte Variante, nichts rutscht nach.
// Positionen auf den Linealen sind Prozentwerte (d3-scale scaleLog) – unabhängig von der Breite, damit
// Server und Browser identisch rendern.

import Link from "next/link";
import { PARKREGLER_SATZ } from "@/data/marke";
import { DC_AC_VORSCHLAG, TYPEN } from "@/components/Technik/torTypen";
import { Erkenntnis, Kennzeichnung, QuellePille } from "./_bausteine";
import { FARBE, KENNZEICHNUNG, STAND, zahl } from "./_tokens";
import {
  ERKENNTNIS_K6,
  HAUPTSTRICHE,
  NE_BAENDER,
  NE_OPTIONEN,
  NETZEBENE_TEXT,
  STRICHE,
  bandVerlauf,
  hinweisSatz,
  layoutHoch,
  pos,
  schieberAusKwp,
  schwellenSatz,
  strichText,
} from "./K6Modell";
import K6Einlinie, { STATISCH_E } from "./K6Einlinie";

// ---------------------------------------------------------------------------------------------------
// Statischer Komponentensatz (Server)
// ---------------------------------------------------------------------------------------------------

function ZahlStatisch({ wert, stellen = 0, vor = "", nach = "", className }) {
  return (
    <span className={["ov-num", className].filter(Boolean).join(" ")}>
      {vor}
      {zahl(wert, stellen)}
      {nach}
    </span>
  );
}

/** Wie Segment aus ./_gestaltung (gefüllt, ohne Rahmen) – statisch für den Server-Platzhalter. */
function SegmentStatisch({ name, wert, optionen, klein = false, className, label }) {
  return (
    <fieldset className={["min-w-0", className].filter(Boolean).join(" ")}>
      {label && <legend className="mb-2 text-[12.5px] font-semibold text-ink-500">{label}</legend>}
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-ink-100 p-1">
        {optionen.map((o) => (
          <label
            key={o.id}
            className={[
              "relative flex select-none items-center justify-center rounded-full font-semibold",
              klein ? "min-h-9 px-3 text-[13px]" : "min-h-11 px-4 text-[14px]",
              o.id === wert ? "bg-navy-950 text-white" : "text-ink-700",
            ].join(" ")}
          >
            <input type="radio" name={`${name}-ssr`} value={o.id} defaultChecked={o.id === wert} className="sr-only" tabIndex={-1} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Statischer Komponentensatz: HTML-Elemente statt motion, Zahlen ohne Gleiten, Segment ohne Zustand. */
export const STATISCH_K = { ...STATISCH_E, Div: "div", Zahl: ZahlStatisch, Segment: SegmentStatisch };

const OHNE = () => {};
const AKTIONEN_LEER = { range: OHNE, rangeTaste: OHNE, rangeLos: OHNE, feld: () => OHNE, feldVerlassen: () => OHNE, wrVorschlag: OHNE, speicherChip: OHNE, neSetzen: OHNE, torZeigen: OHNE, karteUmschalten: OHNE };

// ---------------------------------------------------------------------------------------------------
// Bewegungs-Helfer (HTML): statisch → style, bewegt → motion-Ziel
// ---------------------------------------------------------------------------------------------------

function bew(k, ziel, transition) {
  if (!k.bewegt) return { style: ziel };
  return { initial: false, animate: ziel, transition: transition ?? k.feder };
}
/** Übergang für das Aufbau-Intro (Balken wachsen von links), sonst Feder. */
function introT(k, intro, i = 0) {
  if (intro === "los") return { duration: k.ruhig ? 0 : 0.9, ease: [0.16, 1, 0.3, 1], delay: k.ruhig ? 0 : i * 0.08 };
  return k.feder;
}

/**
 * Stapel-Ebene (Badge-freie Varianten): alle liegen in derselben Rasterzelle, sichtbar ist nur `an`.
 * Wechsel als Überblendung in 320 ms (CSS; visibility schaltet beim Ausblenden erst am Ende um, beim
 * Einblenden sofort). Reduzierte Bewegung: sofort.
 */
const stapel = (an) =>
  [
    "[grid-area:1/1] min-w-0 transition-[opacity,transform,visibility] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
    // ausgehend schnell (140 ms), eingehend 320 ms mit 80 ms Versatz – so überlagern sich nie zwei Texte lesbar
    an ? "visible translate-y-0 opacity-100 duration-[320ms] delay-[80ms]" : "invisible translate-y-1.5 opacity-0 duration-[140ms] delay-0",
  ].join(" ");

const STREIFEN = `repeating-linear-gradient(135deg, ${FARBE.ink400} 0 3px, ${FARBE.ink300} 3px 6px)`;
const KNAPP_STREIFEN = "repeating-linear-gradient(135deg, rgba(21,26,36,0.10) 0 2px, rgba(21,26,36,0) 2px 6px)";
const BAND_FARBE = { 7: "rgba(127,167,214,0.32)", 6: "rgba(74,124,189,0.34)", 5: "rgba(11,68,136,0.30)" };
const EYEBROW = "text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500";

// ---------------------------------------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------------------------------------

/**
 * Tor-Fahne: sichtbare Pille 28 px, Trefferfläche 44 px (mobil 48 px) – der Knopf ist so hoch wie die
 * Fahnen-Zeile und mindestens 44 px breit, die Pille sitzt unten darin (Pfosten trifft ihre Unterkante).
 */
function Fahne({ t, aktiv, a, statisch }) {
  const verschiebung = t.ausrichtung === "rechts" ? "translateX(-10px)" : t.ausrichtung === "links" ? "translateX(calc(-100% + 10px))" : "translateX(-50%)";
  const buendig = t.ausrichtung === "rechts" ? "justify-start" : t.ausrichtung === "links" ? "justify-end" : "justify-center";
  const einheit = t.lineal === "dc" ? "kWp" : "kW";
  return (
    <button
      type="button"
      onClick={statisch ? undefined : () => a.torZeigen(t.id)}
      tabIndex={statisch ? -1 : undefined}
      aria-expanded={aktiv}
      aria-controls="k6-torkarte"
      aria-label={`Tor bei ${zahl(t.wert)} ${einheit}: ${t.titel} – ${t.offen ? "durchschritten" : "noch nicht erreicht"}`}
      data-tor={t.id}
      data-offen={t.offen ? "ja" : "nein"}
      className={["group absolute bottom-0 flex h-full min-w-11 items-end rounded-full pb-1.5 max-md:min-w-12", buendig].join(" ")}
      style={{ left: `${t.x}%`, transform: verschiebung }}
    >
      <span
        className={[
          "relative inline-flex h-7 min-w-7 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-[11.5px] font-semibold leading-none transition-colors duration-300",
          t.offen ? "bg-navy-950 text-white group-hover:bg-navy-800" : "bg-ink-100 text-ink-600 group-hover:bg-ink-200",
        ].join(" ")}
      >
        <span className="max-sm:hidden">{t.kurz}</span>
        <span className="sm:hidden">{t.mini}</span>
        {aktiv && (
          <span
            aria-hidden="true"
            className={["absolute -bottom-[5px] h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent", t.offen ? "border-t-navy-950" : "border-t-ink-100"].join(" ")}
            style={{ left: t.ausrichtung === "rechts" ? 5 : t.ausrichtung === "links" ? "calc(100% - 15px)" : "calc(50% - 5px)" }}
          />
        )}
      </span>
    </button>
  );
}

function FahnenZeile({ tore, v, a, statisch, className }) {
  return (
    <div className={["relative h-12 md:h-11", className].filter(Boolean).join(" ")}>
      {tore.map((t) => (
        <Fahne key={t.id} t={t} aktiv={v.aktivesTor === t.id} a={a} statisch={statisch} />
      ))}
    </div>
  );
}

function Pfosten({ t, oben = -6, hoehe = 30 }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute w-px transition-colors duration-300"
      style={{ left: `${t.x}%`, top: oben, height: hoehe, background: t.offen ? "rgba(3,18,43,0.55)" : "rgba(21,26,36,0.18)" }}
    />
  );
}

/** Feine Striche (log) unter einer Spur – SVG in Prozent-Koordinaten, Haarlinien. */
function Striche({ className }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 10" preserveAspectRatio="none" focusable="false">
      {STRICHE.map((s) => {
        const gross = HAUPTSTRICHE.includes(s);
        const x = pos(s);
        return <line key={s} x1={x} x2={x} y1={0} y2={gross ? 10 : 5} stroke={gross ? "rgba(21,26,36,0.42)" : "rgba(21,26,36,0.2)"} strokeWidth={1} vectorEffect="non-scaling-stroke" />;
      })}
    </svg>
  );
}

function StrichZahlen() {
  return (
    <div aria-hidden="true" className="ov-num relative h-5 text-[11px] font-medium text-ink-500 md:text-[11.5px]">
      {HAUPTSTRICHE.map((s, i) => (
        <span
          key={s}
          className={["absolute top-0.5 whitespace-nowrap", s === 200 || s === 2000 ? "max-sm:hidden" : ""].join(" ")}
          style={{ left: `${pos(s)}%`, transform: i === 0 ? "none" : i === HAUPTSTRICHE.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}
        >
          {strichText(s)}
        </span>
      ))}
    </div>
  );
}

function LinealKopf({ titel, unter, children }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <p className={["min-w-0 pb-0.5", EYEBROW].join(" ")}>{titel}</p>
        {children}
      </div>
      {unter && <p className="mt-1 text-[13px] leading-snug text-ink-600">{unter}</p>}
    </div>
  );
}

function Feld({ id, label, kurz, einheit, muster, wert, a, schluessel, testid, statisch, beschreibung }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-end gap-1.5 text-[12px] font-semibold leading-tight text-ink-600 md:min-h-[2.4em] md:text-[12.5px]">
        <span aria-hidden="true" className="mb-[2px] h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: muster }} />
        {kurz ? (
          <>
            <span aria-hidden="true" className="min-w-0 truncate sm:hidden">
              {kurz}
            </span>
            <span className="min-w-0 max-sm:sr-only sm:truncate">{label}</span>
          </>
        ) : (
          <span className="min-w-0 truncate">{label}</span>
        )}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={5000}
          step={1}
          value={wert}
          placeholder={schluessel === "wr" ? "Vorschlag" : "0"}
          onChange={statisch ? undefined : a.feld(schluessel)}
          onBlur={statisch ? undefined : a.feldVerlassen(schluessel)}
          readOnly={statisch || undefined}
          tabIndex={statisch ? -1 : undefined}
          aria-describedby={beschreibung}
          data-testid={testid}
          className="ov-num h-12 w-full min-w-0 rounded-xl bg-ink-100 pl-3 pr-11 font-display text-[16px] font-bold text-ink-900 transition-colors [appearance:textfield] placeholder:font-sans placeholder:text-[13px] placeholder:font-medium placeholder:text-ink-500 hover:bg-ink-200/70 focus-visible:bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-ink-500">
          {einheit}
        </span>
      </div>
    </div>
  );
}

function Chip({ onClick, children, statisch, testid, ton = "speicher" }) {
  return (
    <button
      type="button"
      onClick={statisch ? undefined : onClick}
      tabIndex={statisch ? -1 : undefined}
      data-testid={testid}
      className={[
        "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-left text-[13.5px] font-semibold leading-tight transition-colors",
        ton === "speicher" ? "bg-ov-50 text-ov-800 hover:bg-ov-100" : "bg-ink-100 text-ink-800 hover:bg-ink-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------------------------------
// A · Lineale (Spuren ohne Fahnen – die Fahnen-Zeilen stehen im DOM hinter den Feldern, s. oben)
// ---------------------------------------------------------------------------------------------------

function DcSpur({ v, k, a, statisch, intro }) {
  const D = k.Div;
  const warten = intro === "warten";
  // Typ-B-Etikett weg vom Läufer: rechts der Marke, wenn sie rechts vom Läufer liegt (und umgekehrt)
  let bRechts = v.bAb != null && v.bAb >= v.kwp;
  if (v.x.bAb != null && bRechts && v.x.bAb > 76) bRechts = false;
  if (v.x.bAb != null && !bRechts && v.x.bAb < 24) bRechts = true;
  return (
    <div className="relative">
      {/* Spur mit Schieber */}
      <div className="relative h-11">
        {v.dcTore.map((t) => (
          <Pfosten key={t.id} t={t} oben={-6} hoehe={28} />
        ))}
        <div aria-hidden="true" className="absolute inset-x-0 top-[15px] h-[6px] rounded-full bg-ink-100" />
        <D aria-hidden="true" className="absolute left-0 top-[15px] h-[6px] rounded-full bg-navy-950" {...bew(k, { width: `${warten ? 0 : v.x.kwp}%` }, introT(k, intro, 0))} />
        <input
          id="k6-kwp"
          type="range"
          min={0}
          max={1000}
          step="any"
          value={schieberAusKwp(v.kwp)}
          onChange={statisch ? undefined : a.range}
          onKeyDown={statisch ? undefined : a.rangeTaste}
          onPointerUp={statisch ? undefined : a.rangeLos}
          onPointerCancel={statisch ? undefined : a.rangeLos}
          onBlur={statisch ? undefined : a.rangeLos}
          readOnly={statisch || undefined}
          tabIndex={statisch ? -1 : undefined}
          aria-label="Modulleistung (DC) in kWp"
          aria-valuetext={`${zahl(v.kwp)} kWp – ${v.typText}`}
          data-testid="kwp-lineal"
          className="peer absolute top-0 h-11 cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing [&::-moz-range-thumb]:h-12 [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-12 [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:appearance-none"
          style={{ left: -24, width: "calc(100% + 48px)", touchAction: "pan-y" }}
        />
        <D
          aria-hidden="true"
          className="pointer-events-none absolute top-[18px] z-[2] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-950 shadow-[0_0_0_4px_#fff,0_6px_16px_-4px_rgba(3,18,43,0.45)] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[5px] peer-focus-visible:outline-ov-600 md:h-6 md:w-6"
          {...bew(k, { left: `${v.x.kwp}%` })}
        >
          <span className="absolute inset-[9px] rounded-full bg-white md:inset-[8px]" />
        </D>
        <Striche className="pointer-events-none absolute inset-x-0 bottom-0 h-[10px] w-full" />
      </div>
      <StrichZahlen />

      {/* Netzebenen-Bänder (Richtwert) – Etiketten mit AA-Kontrast auch für die nicht typischen Bänder */}
      <div className="relative mt-1.5 grid gap-[3px]" aria-hidden="true">
        {NE_BAENDER.map((b) => {
          const stil = b.ne === 7 ? { left: 3 } : b.ne === 6 ? { right: `calc(${100 - pos(b.c)}% + 3px)` } : { right: 3 };
          const typisch = v.typisch.includes(b.ne);
          return (
            <div key={b.ne} className="relative h-[16px] rounded-[5px] md:h-[17px]" style={{ background: bandVerlauf(b, BAND_FARBE[b.ne]) }}>
              <span
                className={[
                  "absolute top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap rounded-[4px] px-1 text-[10.5px] leading-[14px] tracking-[0.02em] transition-colors duration-300",
                  typisch ? "bg-white/90 font-bold text-navy-900" : "bg-white/85 font-semibold text-ink-600",
                ].join(" ")}
                style={stil}
              >
                {b.name}
                <span className="font-semibold max-sm:hidden"> · {b.lang}</span>
              </span>
              {b.ne === 7 && (
                <span className="absolute right-0.5 top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-white/90 px-1 text-[10.5px] font-medium leading-[14px] text-ink-600">
                  {KENNZEICHNUNG.richtwert} – <span className="max-sm:hidden">die Netzebene </span>legt der Netzbetreiber fest
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Läufer: Haarlinie vom Schieber durch die Bänder bis zum Verbinder */}
      <D
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 z-[1] w-px bg-navy-950/70"
        style={k.bewegt ? { top: 30 } : { top: 30, left: `${v.x.kwp}%` }}
        {...(k.bewegt ? { initial: false, animate: { left: `${v.x.kwp}%` }, transition: k.feder } : {})}
      />

      {/* Typ-B-Schwelle in kWp (bei Wechselrichter-Vorschlag) */}
      <div className="relative h-6 md:h-7">
        {v.x.bAb != null && (
          <D
            className={[
              "absolute top-1.5 z-[1] whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-700 shadow-[0_0_0_1px_rgba(21,26,36,0.08)]",
              bRechts ? "translate-x-[6px]" : "-translate-x-[calc(100%+6px)]",
            ].join(" ")}
            {...bew(k, { left: `${v.x.bAb}%` })}
          >
            Typ B ab <span className="ov-num">{zahl(v.bAb)}</span> kWp
          </D>
        )}
      </div>
      {v.x.bAb != null && (
        <D
          aria-hidden="true"
          className="pointer-events-none absolute w-0 border-l border-dashed border-ink-700/60"
          style={k.bewegt ? { top: 10, bottom: 6 } : { top: 10, bottom: 6, left: `${v.x.bAb}%` }}
          {...(k.bewegt ? { initial: false, animate: { left: `${v.x.bAb}%` }, transition: k.feder } : {})}
        />
      )}
    </div>
  );
}

/** Verbinder: der Läufer läuft vom DC-Wert schräg zur Wechselrichterleistung (kWp ÷ DC/AC). */
function Verbinder({ v, k, intro }) {
  const verhaeltnis = v.wrEigen ? zahl(v.ratio, 2) : zahl(DC_AC_VORSCHLAG, 2);
  const links = Math.min(v.x.kwp, v.x.wr);
  const rechts = Math.max(v.x.kwp, v.x.wr);
  const nachRechts = links < 26;
  const L = k.Line;
  const linie = { stroke: FARBE.navy950, strokeOpacity: 0.7, strokeWidth: 1, vectorEffect: "non-scaling-stroke" };
  return (
    <div className="relative h-8 md:h-9" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 36" preserveAspectRatio="none" focusable="false">
        {k.bewegt ? (
          <L {...linie} initial={false} animate={{ x1: v.x.kwp, x2: v.x.wr, y1: 0, y2: 36, opacity: intro === "warten" ? 0 : 1 }} transition={intro === "los" ? { duration: k.ruhig ? 0 : 0.6, delay: k.ruhig ? 0 : 0.5 } : k.feder} />
        ) : (
          <line {...linie} x1={v.x.kwp} x2={v.x.wr} y1={0} y2={36} />
        )}
      </svg>
      <k.Div
        className={[
          "absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-600",
          nachRechts ? "translate-x-[10px]" : "-translate-x-[calc(100%+10px)]",
        ].join(" ")}
        {...bew(k, { left: `${nachRechts ? rechts : links}%` })}
      >
        ÷ <span className="ov-num">{verhaeltnis}</span> DC/AC
      </k.Div>
    </div>
  );
}

function AcSpur({ v, k, intro }) {
  const D = k.Div;
  const warten = intro === "warten";
  const x0 = 0;
  const xWr = warten ? 0 : v.x.wr;
  const xSp = warten ? 0 : v.x.sp;
  const xAc = warten ? 0 : v.x.ac;
  return (
    <div className="relative">
      <div className="relative h-11">
        <div aria-hidden="true" className="absolute inset-x-0 top-[10px] h-[16px] rounded-[5px] bg-ink-100" />
        {/* Knapp-Band um die Typ-B-Grenze */}
        <div aria-hidden="true" className="absolute top-[4px] h-[28px] rounded-[4px]" style={{ left: `${v.x.knappVon}%`, width: `${v.x.knappBis - v.x.knappVon}%`, background: KNAPP_STREIFEN }} />
        <D aria-hidden="true" className="absolute top-[10px] h-[16px] rounded-l-[5px] bg-navy-950" style={k.bewegt ? { left: `${x0}%` } : { left: `${x0}%`, width: `${xWr}%` }} {...(k.bewegt ? { initial: false, animate: { width: `${xWr}%` }, transition: introT(k, intro, 0) } : {})} />
        <D aria-hidden="true" className="absolute top-[10px] h-[16px]" style={k.bewegt ? { background: FARBE.ov700 } : { background: FARBE.ov700, left: `${xWr}%`, width: `${Math.max(0, xSp - xWr)}%` }} {...(k.bewegt ? { initial: false, animate: { left: `${xWr}%`, width: `${Math.max(0, xSp - xWr)}%` }, transition: introT(k, intro, 1) } : {})} />
        <D aria-hidden="true" className="absolute top-[10px] h-[16px]" style={k.bewegt ? { background: STREIFEN } : { background: STREIFEN, left: `${xSp}%`, width: `${Math.max(0, xAc - xSp)}%` }} {...(k.bewegt ? { initial: false, animate: { left: `${xSp}%`, width: `${Math.max(0, xAc - xSp)}%` }, transition: introT(k, intro, 2) } : {})} />
        {/* Summen-Strich */}
        <D aria-hidden="true" className="absolute top-[4px] h-[28px] w-[2px] -translate-x-1/2 rounded-full bg-navy-950" style={k.bewegt ? undefined : { left: `${xAc}%` }} {...(k.bewegt ? { initial: false, animate: { left: `${xAc}%` }, transition: introT(k, intro, 2) } : {})} />
        {v.acTore.map((t) => (
          <Pfosten key={t.id} t={t} oben={-6} hoehe={38} />
        ))}
        <Striche className="pointer-events-none absolute inset-x-0 bottom-0 h-[10px] w-full" />
      </div>
      <StrichZahlen />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// Ablesung: TOR-Typ an der AC-Summe, Erkenntnis, Tor-Karte
// ---------------------------------------------------------------------------------------------------

/**
 * TOR-Typ-Badge. Wechsel als Überblendung in 320 ms (alt und neu liegen in derselben Rasterzelle,
 * AnimatePresence ohne mode="wait") – das Badge ist nie leer. testid/data-typ sitzen auf der festen Hülle.
 */
function TypMarke({ v, k }) {
  const P = k.Praesenz;
  const props = k.bewegt
    ? {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.04, transition: k.raus },
        transition: k.wechsel,
      }
    : {};
  return (
    <div className="grid shrink-0 justify-items-start" data-testid="tor-typ" data-typ={v.tor.typ} data-knapp={v.knapp ? "ja" : "nein"}>
      <P initial={false}>
        <k.Div
          key={v.tor.typ}
          {...props}
          className={[
            "[grid-area:1/1] inline-flex h-11 origin-left items-center whitespace-nowrap rounded-full px-3.5 font-display text-[17px] font-extrabold tracking-[-0.02em] sm:px-4 md:text-[19px]",
            v.typB ? "bg-navy-950 text-white" : "bg-sand-100 text-ink-900",
          ].join(" ")}
        >
          {v.typText}
        </k.Div>
      </P>
    </div>
  );
}

/**
 * Zeile an der AC-Summe: Badge, Typ-Grenzen und „knapp“ (Platz immer reserviert, damit nichts springt).
 * Mobil steht sie in einer Reihe MIT der AC-Summe; „knapp“ trägt dort die Ablesung als Satz (KNAPP_HINWEIS).
 */
function TypZeile({ v, k, className }) {
  const grenze = (TYPEN[v.tor.typ] || TYPEN.A).grenze;
  return (
    <div className={["flex min-h-11 min-w-0 items-center gap-2.5", className].filter(Boolean).join(" ")}>
      <TypMarke v={v} k={k} />
      <span className="ov-num min-w-0 truncate text-[13px] text-ink-600 max-sm:hidden">{v.tor.typ === "–" ? v.tor.text : grenze}</span>
      <span
        aria-hidden={!v.knapp}
        className={[
          "shrink-0 rounded-full bg-ink-900/[0.07] px-3 py-1.5 text-[12.5px] font-semibold text-ink-800 transition-opacity duration-[320ms] motion-reduce:transition-none max-sm:hidden",
          v.knapp ? "opacity-100" : "invisible opacity-0",
        ].join(" ")}
      >
        knapp
      </span>
    </div>
  );
}

/** Erkenntnis-Stapel: Hinweis (vor der Bedienung) und beide Erkenntnis-Sätze – feste Höhe. */
function ErkenntnisStapel({ v, beruehrt }) {
  const art = beruehrt ? v.erkenntnisArt : "hinweis";
  return (
    <div className="grid" data-testid="erkenntnis-k6" data-zustand={art}>
      <p aria-hidden={art !== "hinweis"} className={[stapel(art === "hinweis"), "self-center text-[14px] leading-snug text-ink-600"].join(" ")}>
        {hinweisSatz(v)}
      </p>
      {["ac", "speicher"].map((id) => (
        <Erkenntnis key={id} aria-hidden={art !== id} className={[stapel(art === id), "self-center text-[17px]! md:text-[19px]!"].join(" ")}>
          {ERKENNTNIS_K6[id]}
        </Erkenntnis>
      ))}
    </div>
  );
}

/**
 * Tor-Karte: ALLE Tore liegen gestapelt in einer Zelle (Höhe = größte Karte), sichtbar ist das aktive.
 * Mobil zeigt die Karte Kopf und Titel (Knopf, 48 px), der Text klappt auf Antippen auf – überfahrene Tore
 * wechseln nur den Titel, damit beim Ziehen nichts darunter verrutscht.
 */
function TorKarte({ v, a, offen, statisch }) {
  const alle = [...v.dcTore, ...v.acTore];
  return (
    <div id="k6-torkarte" className="grid" data-aktiv={v.aktivesTor}>
      {alle.map((t) => {
        const an = t.id === v.aktivesTor;
        const einheit = t.lineal === "dc" ? "kWp" : "kW";
        const rest = t.lineal === "dc" ? t.wert - v.kwp : t.wert - v.ac;
        return (
          <div
            key={t.id}
            aria-hidden={!an}
            className={[stapel(an), "rounded-2xl bg-ink-50 px-4 pb-4 pt-3.5 md:p-5"].join(" ")}
            data-testid={an ? "tor-karte" : undefined}
            data-tor={t.id}
          >
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">
              <span>
                {t.lineal === "dc" ? "DC" : "AC"} · Tor bei <span className="ov-num">{zahl(t.wert)}</span> {einheit}
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink-300" />
              <span className={t.offen ? "text-navy-800" : "text-ink-600"}>{t.offen ? "durchschritten" : `noch ${zahl(Math.max(1, Math.ceil(rest)))} ${einheit}`}</span>
            </p>
            <p className="mt-2 font-display text-[16px] font-bold leading-snug text-ink-900 max-md:hidden">{t.titel}</p>
            <button
              type="button"
              onClick={statisch ? undefined : a.karteUmschalten}
              tabIndex={statisch || !an ? -1 : undefined}
              aria-expanded={offen}
              aria-controls={`k6-torkarte-text-${t.id}`}
              className="-mx-1 mt-1 flex min-h-12 w-[calc(100%+0.5rem)] items-center justify-between gap-3 rounded-xl px-1 text-left font-display text-[15.5px] font-bold leading-snug text-ink-900 md:hidden"
            >
              <span>{t.titel}</span>
              <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-ov-600">
                <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded bg-current" />
                <span className={["absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300", offen ? "scale-y-0" : ""].join(" ")} />
              </span>
            </button>
            <div id={`k6-torkarte-text-${t.id}`} className={offen ? undefined : "max-md:hidden"}>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-700">{t.text}</p>
              <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-snug text-ink-600">
                <span>
                  {t.quelle} · {KENNZEICHNUNG.richtwert}
                </span>
                {t.link && (
                  <Link
                    href={t.link.href}
                    tabIndex={statisch || !an ? -1 : undefined}
                    className="inline-flex min-h-6 items-center font-semibold text-ov-700 underline decoration-ov-700/30 underline-offset-[3px] hover:text-ov-800"
                  >
                    {t.link.label} →
                  </Link>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Anforderungen des TOR-Typs (echte Liste) und Parkregler-Satz – mobil in einer Schublade, sonst offen. */
function TypAnforderungen({ v, mobil = false }) {
  return (
    <div className={mobil ? "grid gap-5" : "grid min-w-0 gap-7 md:grid-cols-2 md:gap-12 lg:grid-cols-1 lg:gap-6 xl:grid-cols-2 xl:gap-10"}>
      <div>
        {!mobil && <h4 className="font-display text-[16px] font-bold text-ink-900">Was {v.typText} verlangt</h4>}
        <ul className={["grid gap-2 text-[14px] leading-snug text-ink-700", mobil ? "" : "mt-3"].join(" ")} data-testid={mobil ? "anforderungen-mobil" : "anforderungen"}>
          {v.anforderungen.map((t) => (
            <li key={t} className="relative pl-4">
              <span aria-hidden="true" className="absolute left-0 top-[0.5em] h-1.5 w-1.5 rounded-full bg-navy-950/60" />
              {t}
            </li>
          ))}
        </ul>
        <QuellePille className="mt-3">
          E-Control: {v.regelwerk} · {STAND.werte}
        </QuellePille>
      </div>
      <div>
        <h4 className="font-display text-[16px] font-bold text-ink-900">{v.typB ? "Parkregler (EZA-Regler) am Netzanschlusspunkt" : "Unter 250 kW AC"}</h4>
        {v.typB ? (
          <>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-700 md:mt-3">
              TOR Typ B schreibt Fähigkeiten vor, kein bestimmtes Gerät. In der Regel übernimmt sie ein Parkregler: Er misst Wirk- und Blindleistung am Netzanschlusspunkt und
              gibt Wechselrichtern und Speicher die Sollwerte des Netzbetreibers weiter{v.fernwirk ? "; ab 1 MW über eine Fernwirkschnittstelle" : ""}.
            </p>
            <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink-900" data-testid={mobil ? "parkregler-satz-mobil" : "parkregler-satz"}>
              {PARKREGLER_SATZ}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[14px] leading-relaxed text-ink-700 md:mt-3">
            Typ A setzen in der Regel Wechselrichter und Datenlogger um. Gibt der Netzbetreiber eine Einspeisebegrenzung vor, wird sie am Netzanschlusspunkt geregelt. Das Schaltbild
            zeigt den Parkregler als Schatten – ab 250 kW AC kommt er in der Regel dazu.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// Ansicht
// ---------------------------------------------------------------------------------------------------

/**
 * @param {object} p
 * @param {object} p.v       ansichtModell()
 * @param {object} p.e       einlinie()
 * @param {object} [p.k]     Komponentensatz (STATISCH_K oder motion)
 * @param {object} [p.kE]    Komponentensatz fürs Schaltbild (Federn auch während des Ziehens)
 * @param {object} [p.a]     Aktionen (Handler)
 * @param {{wr:string, sp:string, bestand:string}} p.f  Feldtexte
 * @param {{kw:number, text:string, kurz?:string}} p.chip  Speicher-Chip (Kapitel 05 oder Beispiel; kurz = mobil)
 * @param {object} [p.slots] { ansage }
 * @param {boolean} [p.beruehrt]  schon bedient → Erkenntnis statt Hinweis
 */
export default function K6Ansicht({ v, e, k = STATISCH_K, kE, a = AKTIONEN_LEER, f, chip, slots = {}, statisch = false, intro = "fertig", wurzelRef, karteOffen = false, beruehrt = false }) {
  const hoch = layoutHoch(e);
  const kS = kE || k;
  const Z = k.Zahl;
  const S = k.Segment;
  const schaltbildText = beschreibeSchaltbild(v, e);
  const neText = NETZEBENE_TEXT[v.ne];
  const wert = "shrink-0 font-display text-[27px] font-extrabold leading-none tracking-[-0.03em] text-ink-900 md:text-[34px]";
  const chipAn = v.sp > 0 && v.sp === chip.kw;

  return (
    <div ref={wurzelRef} className="rounded-[24px] bg-white p-4 shadow-[0_1px_0_rgba(21,26,36,0.04),0_30px_60px_-36px_rgba(3,18,43,0.28)] sm:rounded-[28px] sm:p-7 xl:p-10" data-k6-zustand={statisch ? "start" : "live"}>
      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_372px] lg:gap-x-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-x-10">
        {/* ================= links: Ursache (Lineale, Felder) ================= */}
        <div className="max-lg:contents lg:flex lg:min-w-0 lg:flex-col" data-k6-spalte="ursache">
          <div className="order-[10] min-w-0">
            <LinealKopf
              titel={
                <>
                  DC · Modulleistung<span className="max-sm:hidden"> auf dem Dach</span>
                </>
              }
              unter={`Netzebene ${v.typischText} (${KENNZEICHNUNG.richtwert})`}
            >
              <output htmlFor="k6-kwp" className={wert} data-testid="kwp-wert">
                <Z wert={v.kwp} />
                <span className="ml-1 text-[0.55em] font-bold text-ink-500">kWp</span>
              </output>
            </LinealKopf>
          </div>

          <div className="order-[30] min-w-0">
            <DcSpur v={v} k={k} a={a} statisch={statisch} intro={intro} />
          </div>
          <div className="order-[40] min-w-0">
            <Verbinder v={v} k={k} intro={intro} />
          </div>

          {/* AC-Kopf: Summe und TOR-Typ nebeneinander (mobil: Badge links, Summe rechts in einer Reihe) */}
          <div className="order-[50] grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4">
            <div className="min-w-0 max-sm:col-span-2">
              <p className={["pb-0.5", EYEBROW].join(" ")}>
                <span className="sm:hidden">AC · Anschlusspunkt</span>
                <span className="max-sm:hidden">AC · am Netzanschlusspunkt</span>
              </p>
              <p className="mt-1 text-[13px] leading-snug text-ink-600">
                <span className="sm:hidden">WR + Speicher-WR + Bestand</span>
                <span className="max-sm:hidden">Wechselrichter + Speicher-Wechselrichter + Bestand</span>
              </p>
            </div>
            <output htmlFor="k6-wr k6-sp k6-bestand" className={[wert, "max-sm:col-start-2 max-sm:row-start-2 max-sm:mt-2 max-sm:self-center"].join(" ")} data-testid="ac-summe">
              <Z wert={v.ac} />
              <span className="ml-1 text-[0.55em] font-bold text-ink-500">kW</span>
            </output>
            <TypZeile v={v} k={k} className="mt-2 max-sm:col-start-1 max-sm:row-start-2 sm:col-span-2 sm:mt-2.5" />
          </div>

          <div className="order-[70] min-w-0">
            <AcSpur v={v} k={k} intro={intro} />
          </div>

          {/* Erkenntnis: mobil direkt unter Badge und Summe (im Blickfeld beim Ziehen), ab 1.024 px unter dem AC-Lineal */}
          <div className="mt-4 min-w-0 max-lg:order-[55] max-lg:mt-3 lg:order-[80] lg:mt-5">
            <ErkenntnisStapel v={v} beruehrt={beruehrt} />
          </div>

          <p className="order-[90] mt-3 min-h-[3lh] min-w-0 text-[13.5px] leading-snug text-ink-700 sm:min-h-[2lh] md:text-[14px]" data-testid="schwellen-satz">
            {v.knappHinweis && <span className="font-semibold text-ink-900">{v.knappHinweis}. </span>}
            {schwellenSatz(v)}
          </p>

          {/* Speicher-Chip: direkt bei Badge und Erkenntnis (Ursache und Wirkung in einem Blick) – mobil über dem
              AC-Lineal, ab 1.024 px unter der Erkenntnis; im DOM vor den Feldern (Tab-Reihenfolge = Lesereihenfolge) */}
          <div className="mt-3 min-w-0 max-lg:order-[57] lg:order-[85]">
            <Chip onClick={a.speicherChip} statisch={statisch} testid="speicher-chip" ton={chipAn ? "neutral" : "speicher"}>
              {chipAn ? (
                "Ohne Speicher rechnen"
              ) : (
                <>
                  <span className="sm:hidden">{chip.kurz ?? chip.text}</span>
                  <span className="max-sm:hidden">{chip.text}</span>
                </>
              )}
            </Chip>
          </div>
          <div className="order-[110] mt-5 grid min-w-0 grid-cols-3 gap-2 sm:gap-4">
            <Feld id="k6-wr" label="Wechselrichter" kurz="PV-WR" einheit="kVA" muster={FARBE.navy950} wert={f.wr} a={a} schluessel="wr" testid="wr-kva" statisch={statisch} beschreibung="k6-wr-hinweis" />
            <Feld id="k6-sp" label="Speicher-WR" einheit="kW" muster={FARBE.ov700} wert={f.sp} a={a} schluessel="sp" testid="speicher-kw" statisch={statisch} />
            <Feld id="k6-bestand" label="Bestand" einheit="kW" muster={STREIFEN} wert={f.bestand} a={a} schluessel="bestand" testid="bestand-kw" statisch={statisch} beschreibung="k6-bestand-hinweis" />
          </div>
          <div className="order-[125] mt-2 min-w-0">
            {v.wrEigen && (
              <div className="mb-2">
                <Chip onClick={a.wrVorschlag} statisch={statisch} testid="wr-vorschlag" ton="neutral">
                  Vorschlag kWp ÷ {zahl(DC_AC_VORSCHLAG, 2)}: <span className="ov-num">{zahl(v.vorschlag)}</span> kVA
                </Chip>
              </div>
            )}
            <p className="text-[12.5px] leading-snug text-ink-600">
              <span id="k6-wr-hinweis" className="max-sm:sr-only">
                Wechselrichter-Vorschlag kWp ÷ {zahl(DC_AC_VORSCHLAG, 2)} (Annahme, überschreibbar; leer = Vorschlag).
              </span>{" "}
              <span id="k6-bestand-hinweis">Bestand: bestehende Erzeugung am selben Anschluss.</span>
            </p>
          </div>

          {/* Fahnen: im DOM hinter den Feldern (Tab-Reihenfolge), sichtbar über ihrer Spur */}
          <FahnenZeile tore={v.dcTore} v={v} a={a} statisch={statisch} className="order-[20] mt-2 md:mt-3" />
          <FahnenZeile tore={v.acTore} v={v} a={a} statisch={statisch} className="order-[60] mt-1" />

          {/* Was der Typ verlangt: ab 1.024 px unter den Feldern (füllt die Spalte neben Schaltbild und Karte),
              darunter als letzter Block nach dem Schaltbild; mobil als Schublade */}
          <div className="mt-6 min-w-0 border-t border-ink-900/[0.08] pt-5 max-lg:order-[140] md:pt-8 lg:order-[130] lg:mt-8 lg:pt-7">
            <div className="max-md:hidden">
              <TypAnforderungen v={v} />
            </div>
            <details className="group rounded-2xl bg-ink-50 md:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-4 py-3 font-display text-[15px] font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                <span>
                  Was {v.typText} verlangt{v.typB ? " – und wer regelt" : ""}
                </span>
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-ov-600">
                  <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <div className="px-4 pb-4">
                <TypAnforderungen v={v} mobil />
              </div>
            </details>
          </div>
        </div>

        {/* ================= rechts: Wirkung (Schaltbild, Tor-Karte) ================= */}
        <div className="max-lg:contents lg:flex lg:min-w-0 lg:flex-col lg:border-l lg:border-ink-900/[0.08] lg:pl-8 xl:pl-10" data-k6-spalte="wirkung">
          <div id="k6-schaltbild" className="min-w-0 max-lg:order-[130] max-lg:mt-8 max-lg:border-t max-lg:border-ink-900/[0.08] max-lg:pt-6 lg:order-1">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
              <div className="min-w-0">
                <p className={[EYEBROW, "max-md:hidden"].join(" ")}>Einlinienschaltbild · wächst mit</p>
                <h3 className="font-display text-[18px] font-bold leading-snug tracking-[-0.01em] text-ink-900 md:mt-1.5 md:text-[20px]">
                  <span className="md:hidden">Einlinien&shy;schaltbild</span>
                  <span className="max-md:hidden">Was am Netzanschlusspunkt dazukommt</span>
                </h3>
              </div>
              <div data-testid="netzebene-anschluss" role="group" aria-label="Netzebene – legt der Netzbetreiber fest" className="shrink-0">
                <S name="k6-ne" wert={v.ne} setWert={statisch ? undefined : a.neSetzen} optionen={NE_OPTIONEN} klein />
              </div>
            </div>
            <p className="mt-3 min-h-[3lh] text-[13.5px] leading-snug text-ink-600">
              <span className="font-semibold text-ink-800">NE {v.ne}</span> – {neText.lang.replace(/^Netzebene \d: /, "")} Die Netzebene legt der Netzbetreiber fest.
              {v.neUntypisch && (
                <>
                  {" "}
                  Bei <span className="ov-num">{zahl(v.kwp)}</span> kWp ist {v.typischText.replace("typisch", "typischerweise")} üblich ({KENNZEICHNUNG.richtwert}).
                </>
              )}
            </p>
            <K6Einlinie lay={hoch} e={e} k={kS} id="k6h" titel={schaltbildText} className="mt-4 block h-auto w-full max-w-[420px] max-lg:mx-auto" />
            <Kennzeichnung className="mt-3">{KENNZEICHNUNG.schematisch} – vereinfachte Schaltzeichen.</Kennzeichnung>
          </div>
          <div className="mt-4 min-w-0 max-lg:order-[85] lg:order-2 lg:mt-6">
            <TorKarte v={v} a={a} offen={karteOffen} statisch={statisch} />
          </div>
        </div>
      </div>

      <Kennzeichnung className="mt-6 max-md:hidden md:mt-8">{KENNZEICHNUNG.schematisch} – Schutz, Messung und Ausführung legen Planung und Netzbetreiber fest.</Kennzeichnung>
      {slots.ansage}
    </div>
  );
}

/** Textalternative des Schaltbilds (aria-label). */
export function beschreibeSchaltbild(v, e) {
  const teile = e.knoten
    .filter((kn) => kn.art !== "abzweig")
    .map((kn) => [kn.name.join(" ").replace(/- /g, ""), kn.wert].filter(Boolean).join(" "));
  const vorNap = teile.slice(0, e.knoten.filter((kn, i) => kn.art !== "abzweig" && i <= e.nap).length);
  const nachNap = teile.slice(vorNap.length);
  const zusatz = [
    v.sp > 0 ? `Speicher mit ${zahl(v.sp)} kW Wechselrichter am AC-Bus` : null,
    v.bestand > 0 ? `bestehende Erzeugung ${zahl(v.bestand)} kW` : null,
    v.typB ? `Parkregler (EZA-Regler) mit Sollwerten des Netzbetreibers${v.fernwirk ? " über eine Fernwirkschnittstelle" : ""}` : "kein Parkregler",
  ].filter(Boolean);
  return `Einlinienschaltbild (schematisch), ${v.typText}: ${vorNap.join(" → ")} → Netzanschlusspunkt → ${nachNap.join(" → ")}. ${zusatz.join(", ")}.`;
}
