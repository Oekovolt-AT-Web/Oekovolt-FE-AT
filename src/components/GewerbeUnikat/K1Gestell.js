// src/components/GewerbeUnikat/K1Gestell.js
//
// K1 · Lastgang-Teppich – REINE Bausteine (ohne Hooks, ohne "use client"): Datums-/Zeitformate,
// Achsen-Gestell des Teppichs, Linsen-Leiste und die SSR-Platzhalter. Server-Hülle (K1Lastgang.js) und
// Client-Bühne (K1Teppich.js) benutzen DIESELBEN Bausteine – deshalb hat der Platzhalter exakt die Maße
// der fertigen Bühne (kein Springen beim Nachladen, CLS ≤ 0,1).
//
// Zeitstempel sind „Wanduhr-Zeit als UTC-ms“ (siehe src/lib/lastgang/parser.js) – alle Formate lesen
// deshalb getUTC…, damit Server und Browser in jeder Zeitzone gleich rendern.

import Link from "next/link";
import { ArrowDown, ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/components/ui/cn";

export const TAG_MS = 86400000;
export const MONATE_KURZ = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
export const MONATE_LANG = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const WT_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WT_LANG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export const tagBeginn = (t) => t - (((t % TAG_MS) + TAG_MS) % TAG_MS);
const zwei = (n) => String(n).padStart(2, "0");

/** Minuten seit Mitternacht → "06:15" */
export const uhrzeit = (min) => {
  const m = Math.round(min);
  return `${zwei(Math.floor(m / 60))}:${zwei(m % 60)}`;
};
/** Minuten seit Mitternacht eines Zeitstempels */
export const minutenVon = (t) => {
  const d = new Date(t);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};
/** "Fr 5. Dez 2025" */
export const datumKurz = (t) => {
  const d = new Date(t);
  return `${WT_KURZ[d.getUTCDay()]} ${d.getUTCDate()}. ${MONATE_KURZ[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
/** "Freitag, 5. Dezember 2025" (Ansage für Screenreader) */
export const datumLang = (t) => {
  const d = new Date(t);
  return `${WT_LANG[d.getUTCDay()]}, ${d.getUTCDate()}. ${MONATE_LANG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
/** "Fr 5. Dezember" (Erkenntnis-Satz) */
export const datumSatz = (t) => {
  const d = new Date(t);
  return `${WT_KURZ[d.getUTCDay()]} ${d.getUTCDate()}. ${MONATE_LANG[d.getUTCMonth()]}`;
};
/** "Fr 5.12." */
export const datumTM = (t) => {
  const d = new Date(t);
  return `${WT_KURZ[d.getUTCDay()]} ${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
};
/** "05.12.2025" */
export const datumZahl = (t) => {
  const d = new Date(t);
  return `${zwei(d.getUTCDate())}.${zwei(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
};

/**
 * Monatsabschnitte entlang der Tagesachse: [{ start, ende, label }] in Spalten (Tagen ab t0).
 * Monate mit weniger als 5 Tagen bekommen kein Label; ein Jahreswechsel im Zeitraum markiert den Jänner
 * mit Jahreszahl („Jän ’25“).
 */
export function monatsAbschnitte(t0, nTage) {
  const d0 = new Date(t0);
  let j = d0.getUTCFullYear();
  let mo = d0.getUTCMonth();
  const ende = t0 + nTage * TAG_MS;
  const out = [];
  const jahrWechsel = new Date(ende - TAG_MS).getUTCFullYear() !== j;
  for (let guard = 0; guard < 40; guard++) {
    const a = Date.UTC(j, mo, 1);
    if (a >= ende) break;
    const b = Date.UTC(j, mo + 1, 1);
    const s = Math.max(0, Math.round((a - t0) / TAG_MS));
    const e = Math.min(nTage, Math.round((b - t0) / TAG_MS));
    if (e - s >= 5) out.push({ start: s, ende: e, label: mo === 0 && jahrWechsel && s > 0 ? `Jän ’${String(j).slice(2)}` : MONATE_KURZ[mo] });
    mo++;
    if (mo > 11) {
      mo = 0;
      j++;
    }
  }
  return out;
}

/** Monatsabschnitte des Beispieljahres 2025 (SSR-Platzhalter). */
export const ABSCHNITTE_2025 = monatsAbschnitte(Date.UTC(2025, 0, 1), 365);

const STUNDEN = [0, 6, 12, 18, 24];

/** Die fünf Linsen des Teppichs (Reihenfolge = Tab-Reihenfolge). */
export const LINSEN = [
  { id: "jahr", label: "Jahr" },
  { id: "schichtbeginn", label: "Schichtbeginn", labelEigen: "Spitzenzeit" },
  { id: "freie-tage", label: "Freie Tage" },
  { id: "grundlast", label: "Grundlast" },
  { id: "sonne", label: "Sonne" },
];

/** Kleines Farbmuster je Linse (dieselben Bedeutungsfarben wie im Teppich). */
function Muster({ id }) {
  const basis = "inline-block h-2.5 w-2.5 shrink-0 rounded-full";
  if (id === "jahr") return <span aria-hidden="true" className={cn(basis, "bg-[linear-gradient(90deg,#003473,#4a7cbd,#ffffff)]")} />;
  if (id === "schichtbeginn") return <span aria-hidden="true" className={cn(basis, "bg-sun-500 ring-2 ring-white/90")} />;
  if (id === "freie-tage") return <span aria-hidden="true" className="inline-block h-3 w-1.5 shrink-0 rounded-[2px] bg-[linear-gradient(180deg,#b2cbe9,#1f5aa1)]" />;
  if (id === "grundlast") return <span aria-hidden="true" className={cn(basis, "bg-navy-300")} />;
  return <span aria-hidden="true" className={cn(basis, "bg-[linear-gradient(90deg,#8cba58_50%,#ffd873_50%)]")} />;
}

/**
 * Klick auf eine Pillen-Beschriftung: Die Standard-Aktivierung des <label> fokussiert das sr-only-Radio – liegt
 * die Pille knapp unter dem Sticky-Header, hält der Browser das Radio wegen scroll-padding-top (globals.css)
 * für verdeckt und scrollt es in die Bildmitte (gemessen: 100–413 px Sprung). Deshalb die Aktivierung selbst
 * übernehmen, ohne den Fokus zu verschieben (Zeiger-Bedienung braucht ihn nicht, und ein programmatischer
 * Fokus zeigte in Chromium teils den Tastatur-Ring). Tastatur (Tab, Leertaste, Pfeile) bleibt nativ.
 */
const pilleKlick = (id, onWahl) => (e) => {
  if (e.target instanceof HTMLInputElement) return;
  e.preventDefault();
  onWahl(id);
};

/**
 * Linsen-Leiste: gefüllte Pillen ohne Rahmen. Mobil eine horizontal scrollbare Zeile (Snap, ohne sichtbare
 * Scrollbar), ab md ein Pillenband. Ohne onWahl (SSR-Platzhalter) nur Optik – aria-hidden, nicht bedienbar.
 */
export function LinsenOptik({ aktiv = "jahr", onWahl, eigen = false, name = "k1-linse" }) {
  const bedienbar = typeof onWahl === "function";
  const Huelle = bedienbar ? "fieldset" : "div";
  return (
    <Huelle className="-mx-5 min-w-0 md:mx-0" aria-hidden={bedienbar ? undefined : "true"}>
      {bedienbar && <legend className="sr-only">Linse des Lastgang-Teppichs wählen</legend>}
      <div className="ov-no-scrollbar flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 md:overflow-visible md:px-0">
        <div className="flex w-max gap-1.5 md:gap-1 md:rounded-full md:bg-white/[0.07] md:p-1">
          {LINSEN.map((l) => {
            const an = l.id === aktiv;
            const klassen = cn(
              "relative flex min-h-11 shrink-0 snap-start select-none items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors duration-200",
              an ? "bg-white text-navy-950" : "bg-white/[0.07] text-white/80 md:bg-transparent",
              bedienbar && !an && "cursor-pointer hover:bg-white/10 hover:text-white",
              bedienbar && "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-400"
            );
            const text = eigen && l.labelEigen ? l.labelEigen : l.label;
            return bedienbar ? (
              <label key={l.id} className={klassen} data-testid={`linse-${l.id}`} data-aktiv={an ? "true" : "false"} onClick={pilleKlick(l.id, onWahl)}>
                <input type="radio" name={name} value={l.id} checked={an} onChange={() => onWahl(l.id)} className="sr-only" />
                <Muster id={l.id} />
                {text}
              </label>
            ) : (
              <span key={l.id} className={klassen}>
                <Muster id={l.id} />
                {text}
              </span>
            );
          })}
        </div>
      </div>
    </Huelle>
  );
}

/**
 * Achsen-Gestell des Teppichs.
 *  hoch = false (ab md): links Stunden 00–24 (00 oben), unten Monate; Fläche aspect 365/144.
 *  hoch = true (mobil):  oben Stunden 00–24, links Monate (Jän oben); Fläche aspect 96/146.
 * children = Zeichenfläche (Canvas, Overlay); flaecheProps landen auf dem Flächen-div (Pointer, Tastatur).
 */
export function TeppichGestell({ hoch = false, abschnitte = ABSCHNITTE_2025, nTage = 365, children, flaecheRef, flaecheProps, flaecheClassName, flaecheStyle }) {
  const flaeche = (
    <div
      ref={flaecheRef}
      className={cn("relative w-full rounded-[10px] bg-navy-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]", flaecheClassName)}
      style={{ aspectRatio: hoch ? "96 / 146" : "365 / 144", touchAction: "pan-y", ...flaecheStyle }}
      {...flaecheProps}
    >
      {children}
    </div>
  );
  if (hoch) {
    return (
      <div className="grid grid-cols-[26px_minmax(0,1fr)] grid-rows-[20px_auto]">
        <div aria-hidden="true" />
        <div aria-hidden="true" className="relative">
          {STUNDEN.map((h) => (
            <span
              key={h}
              className="ov-num absolute top-0 text-[10.5px] font-medium leading-none text-white/55"
              style={{ left: `${(h / 24) * 100}%`, transform: h === 0 ? "none" : h === 24 ? "translateX(-100%)" : "translateX(-50%)" }}
            >
              {zwei(h)}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="relative">
          {abschnitte.map((a) => (
            <span key={`${a.start}-${a.label}`}>
              <span className="absolute right-1 h-px w-1.5 bg-white/20" style={{ top: `${(a.start / nTage) * 100}%` }} />
              <span className="absolute left-0 -translate-y-1/2 text-[10px] font-medium leading-none text-white/55" style={{ top: `${(((a.start + a.ende) / 2) / nTage) * 100}%` }}>
                {a.label}
              </span>
            </span>
          ))}
        </div>
        {flaeche}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[34px_minmax(0,1fr)] grid-rows-[auto_26px]">
      <div aria-hidden="true" className="relative">
        {STUNDEN.map((h) => (
          <span
            key={h}
            className="ov-num absolute left-0 text-[11px] font-medium leading-none text-white/55"
            style={{ top: `${(h / 24) * 100}%`, transform: h === 0 ? "none" : h === 24 ? "translateY(-100%)" : "translateY(-50%)" }}
          >
            {zwei(h)}
          </span>
        ))}
      </div>
      {flaeche}
      <div aria-hidden="true" />
      <div aria-hidden="true" className="relative">
        {abschnitte.map((a) => (
          <span key={`${a.start}-${a.label}`}>
            <span className="absolute top-0 h-1.5 w-px bg-white/20" style={{ left: `${(a.start / nTage) * 100}%` }} />
            <span className="absolute top-2 -translate-x-1/2 whitespace-nowrap text-[11.5px] font-medium leading-none text-white/55" style={{ left: `${(((a.start + a.ende) / 2) / nTage) * 100}%` }}>
              {a.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Kopfzeile über dem Teppich: Linsen links, Datenherkunft + „Ihr Lastgang statt Beispiel“ rechts (bis xl darüber). */
export function TeppichKopf({ linsen, herkunft, aktion }) {
  return (
    <div className="flex flex-col-reverse gap-2 md:gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
      {linsen}
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 sm:gap-2 xl:shrink-0 xl:justify-end">
        {herkunft}
        {aktion}
      </div>
    </div>
  );
}

/** Ziel der Sprungmarke „Ihr Lastgang statt Beispiel ↓“ (Panel unter den Kennzahlen). */
export const EIGEN_ANKER = "k1-eigener-lastgang";

/**
 * Sprung zur Ablage „Eigener Lastgang“ – gefüllter Sekundär-Link neben der Herkunft. Echter Anker: funktioniert
 * auch ohne JavaScript (SSR-Platzhalter und Bühne rendern denselben Link, kein Springen beim Nachladen).
 */
export function EigenLink({ eigen = false }) {
  return (
    <a
      href={`#${EIGEN_ANKER}`}
      data-testid="k1-eigen-link"
      className="inline-flex min-h-11 items-center gap-1 rounded-full bg-white/10 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/15 sm:px-4 sm:text-[13.5px]"
    >
      {eigen ? (
        "Kennzahlen senden"
      ) : (
        <>
          <span className="sm:hidden">Ihr Lastgang</span>
          <span className="hidden sm:inline">Ihr Lastgang statt Beispiel</span>
        </>
      )}
      <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
    </a>
  );
}

/** Herkunfts-Chip (Beispiel synthetisch oder eigener Lastgang). */
export function HerkunftChip({ eigen = false, text }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/[0.07] px-2 py-1 text-[12px] font-medium leading-snug text-white/75 sm:px-3 sm:text-[12.5px]">
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", eigen ? "bg-ov-400" : "bg-white/45")} />
      {text}
    </span>
  );
}

/**
 * Feste Höhen der Zeilen unter dem Teppich – Platzhalter und Bühne identisch. Gemessen am höchsten Zustand
 * (Linse Sonne mit Bilanz, Satz und Aktionen), damit beim Linsenwechsel und beim Eintreffen der Daten unter
 * dem Teppich nichts nachrutscht (QA 13.10.2026: mobil bis 158 px).
 */
export const ZEILE = {
  legende: "min-h-[100px] md:min-h-[58px]",
  unten: "min-h-[250px] max-[359px]:min-h-[318px] md:min-h-[340px] lg:min-h-[262px]",
};

/** SSR-Platzhalter der Teppich-Bühne: beide Ausrichtungen, per CSS umgeschaltet (md). */
export function TeppichPlatzhalter({ text = "Lastgang wird berechnet …", herkunft }) {
  const flaeche = (
    <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-[14px] font-medium text-white/55">{text}</span>
  );
  return (
    <div data-testid="teppich-platzhalter">
      <TeppichKopf linsen={<LinsenOptik />} herkunft={<HerkunftChip text={herkunft} />} aktion={<EigenLink />} />
      <div className="mt-4 md:hidden">
        <TeppichGestell hoch>{flaeche}</TeppichGestell>
      </div>
      <div className="mt-5 hidden md:block">
        <TeppichGestell>{flaeche}</TeppichGestell>
      </div>
      <div className={cn("mt-4", ZEILE.legende)} />
      <div className={cn("mt-4", ZEILE.unten)} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// Panel „Eigener Lastgang“ – gemeinsames Gerüst für SSR-Platzhalter und Client (gleiche Höhe)
// ---------------------------------------------------------------------------------------------------

export const PANEL_TEXT = "Der Viertelstunden-Export Ihres Netzbetreibers (CSV) färbt den Teppich mit Ihren Werten – und die Kapitel zu Anlagengröße, Stromrechnung, Leistungspreis und Wirtschaftlichkeit rechnen damit.";
export const PANEL_GATE_SATZ = "Für die Auswertung bestätigen Sie einmalig Ihre E-Mail-Adresse.";
export const ABLAGE_KLASSE = "mt-5 flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center transition-colors md:min-h-[112px] md:p-5";
export const AUSWAHL_KLASSE = "min-h-11 w-full appearance-none rounded-xl bg-white/[0.08] pl-3 pr-9 text-[14px] text-white [&>option]:text-ink-900";

/** Hülle der Netzbetreiber-Auswahl: eigener Pfeil (appearance-none – sonst zeichnet WebKit weiß auf weiß). */
export function AuswahlHuelle({ children }) {
  return (
    <div className="relative min-w-[10.5rem] flex-1">
      {children}
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
    </div>
  );
}
export const ANLEITUNG_KLASSE = "inline-flex min-h-11 shrink-0 items-center text-[14px] font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200";

/** Gerüst des Panels: Kopf, Inhalt (children), Datenschutz-Satz, optional „Wo bekomme ich meinen Lastgang?“. */
export function PanelGeruest({ titel, text, datenschutz, zusatz, unten, children, className, ...rest }) {
  return (
    <div className={cn("relative rounded-3xl bg-white/[0.05] p-5 md:p-7", className)} {...rest}>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Eigener Lastgang</p>
      <h3 className="mt-2 font-display text-[20px] font-extrabold leading-tight tracking-[-0.015em] text-white md:text-[21px]">{titel}</h3>
      {text && <p className="mt-3 hidden text-[14.5px] leading-relaxed text-white/70 md:block">{text}</p>}
      {children}
      <p className="mt-4 flex items-start gap-2.5 text-[12.5px] leading-snug text-white/65 md:text-[13px]">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
        <span>
          <strong className="font-semibold text-white">Die Datei verlässt Ihren Browser nicht.</strong> <span className="hidden md:inline">{datenschutz}</span>
          {zusatz && <span className="hidden md:inline"> {zusatz}</span>}
        </span>
      </p>
      {unten}
    </div>
  );
}

/** Zeile „Wo bekomme ich meinen Lastgang?“: Auswahl + Link (Inhalte vom Aufrufer). */
export function NetzbetreiberZeile({ id, auswahl, link }) {
  return (
    <div className="mt-4 md:mt-5">
      <label htmlFor={id} className="block text-[13.5px] font-semibold text-white">
        Wo bekomme ich meinen Lastgang?
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        {auswahl}
        {link}
      </div>
    </div>
  );
}

/** SSR-Platzhalter des Panels „Eigener Lastgang“ (statisch, ohne Gate) – gleiches Gerüst wie die Bühne. */
export function PanelPlatzhalter({ hinweis }) {
  return (
    <PanelGeruest
      data-testid="lastgang-panel-platzhalter"
      titel="Legen Sie Ihren eigenen Lastgang darüber"
      text={PANEL_TEXT}
      datenschutz={hinweis}
      zusatz={PANEL_GATE_SATZ}
      unten={
        <NetzbetreiberZeile
          id="k1-nb-platzhalter"
          auswahl={
            <AuswahlHuelle>
              <select id="k1-nb-platzhalter" disabled className={AUSWAHL_KLASSE} defaultValue="">
                <option value="">Ihr Netzbetreiber</option>
              </select>
            </AuswahlHuelle>
          }
          link={
            <Link href="/smart-meter" className={ANLEITUNG_KLASSE}>
              Anleitungen<span aria-hidden="true" className="ml-1">→</span>
            </Link>
          }
        />
      }
    >
      <div className={cn(ABLAGE_KLASSE, "bg-white/[0.06]")}>
        <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-navy-950">CSV-Datei wählen</span>
        <span className="text-[13px] text-white/55">
          <span className="hidden md:inline">oder hierher ziehen · </span>CSV oder TXT mit Viertelstundenwerten
        </span>
      </div>
    </PanelGeruest>
  );
}
