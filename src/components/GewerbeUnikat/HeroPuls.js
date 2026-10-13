"use client";

// src/components/GewerbeUnikat/HeroPuls.js
//
// Client-Insel des Wochen-Pulses (ohne Bibliothek). Umschließt das serverseitig gerenderte SVG (children)
// und ergänzt: Fadenkreuz mit Ablesung (Maus, Touch, Tastatur), Umschalter „Sonne“, die Feiertags-Frage
// mit Antwort (Erkenntnis „h-feiertag“ für den Steckbrief) und den Start des Rechen-Workers für die ganze
// Seite (vorwaermen im Leerlauf). Die Werte kommen kompakt kodiert (2 Zeichen Basis 36 je Viertelstunde,
// ganze kW) aus Hero.js – dieselben Zahlen wie das SVG.
//
// Touch: Die Ablesung erscheint erst nach einem Tipp, nach kurzem Halten oder nach waagrechtem Wischen
// (> 8 px). Senkrechtes Wischen scrollt die Seite (touch-action: pan-y) und lässt nichts stehen
// (pointercancel), ein Tipp außerhalb der Grafik blendet die Ablesung aus.
// Erkenntnis: nur durch bewusstes Ablesen – Tastatur, die Frage-Marke oder mindestens 300 ms Verweilen
// auf dem Feiertag. Die Aufbau-Animation startet HeroStart.js (Inline-Skript), hier nur der Rückfall
// nach einer Client-Navigation.

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ereignis } from "@/lib/statistik";
import { useAnsage, useLeerlauf } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { vorwaermen } from "./_daten";
import { ERKENNTNISSE, KAPITEL, zahl } from "./_tokens";
import { pulsStarten } from "./HeroStart";
import s from "./Hero.module.css";

const ERKENNTNIS_ID = "h-feiertag";
const ERKENNTNIS_TEXT = ERKENNTNISSE.find((e) => e.id === ERKENNTNIS_ID)?.text || "";
const BRUECKE = KAPITEL.find((k) => k.id === "k3");
const BRUECKE_NUMMER = String(KAPITEL.indexOf(BRUECKE)).padStart(2, "0");
const STUNDE = 4; // Viertelstunden
const SCHWELLE_PX = 8; // Touch: ab dieser Bewegung gilt eine Geste als Wischen
const HALTEN_MS = 280; // Touch: so lange halten, dann erscheint die Ablesung
const VERWEILEN_MS = 300; // Zeiger: so lange auf dem Feiertag, dann gilt er als entdeckt

function dekodiere(text) {
  const out = new Array(text.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(text.slice(i * 2, i * 2 + 2), 36);
  return out;
}

const uhrzeit = (slot, slots) => {
  const min = Math.round((slot * 1440) / slots);
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
};

/** CSS-Variablen für die Beschriftungen: Zahlen werden zu Prozent der Grafikfläche. */
const lage = (o) => Object.fromEntries(Object.entries(o).map(([k, w]) => [`--${k}`, typeof w === "number" ? `${w}%` : w]));

export default function HeroPuls({ daten, oben, start = 0, slots = 96, tage, feiertag = null, ruheAnteil = null, ariaLabel, kopf, legende, tagesleiste, caption, className = "", children }) {
  const last = useMemo(() => dekodiere(daten.last), [daten.last]);
  const pv = useMemo(() => dekodiere(daten.pv), [daten.pv]);
  const anzahl = last.length;
  const feiertagTag = feiertag ? feiertag.tag : -1;

  const [sonne, setSonne] = useState(true);
  const [idx, setIdx] = useState(null);
  const [ansage, ansagen] = useAnsage();
  const entdeckt = useSteckbrief((z) => z.erkenntnisse.includes(ERKENNTNIS_ID));

  const figur = useRef(null);
  const flaeche = useRef(null);
  const bedienung = useRef(null);
  const raf = useRef(0);
  const offenX = useRef(null);
  const gemeldet = useRef(false);
  const verweilen = useRef(0);
  const beruehrung = useRef(null); // { id, x, y, aktiv, timer }
  const sonneRef = useRef(sonne);
  sonneRef.current = sonne;
  // schon in dieser Sitzung entdeckt (Steckbrief im sessionStorage): nicht noch einmal melden
  if (entdeckt) gemeldet.current = true;

  // Aufbau-Animation: Das Inline-Skript aus Hero.js hat sie beim Parsen übernommen. Nach einer
  // Client-Navigation lief es nicht – dann hier vor dem ersten Bild dasselbe tun.
  useLayoutEffect(() => {
    pulsStarten(figur.current);
  }, []);

  // Worker für alle Kapitel im Leerlauf starten (Beispiel-Lastgang + PV einmal rechnen)
  useLeerlauf(() => vorwaermen());
  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(verweilen.current);
      clearTimeout(beruehrung.current?.timer);
    },
    []
  );

  const antwort = useMemo(() => {
    if (!feiertag) return null;
    const mwh = zahl(feiertag.uebrigKwh / 1000, 1);
    const woche = zahl(feiertag.anteilWoche * 100);
    const jahr = ruheAnteil != null ? zahl(ruheAnteil * 100) : null;
    return {
      kurz: `≈ ${mwh} MWh Sonne übrig`,
      satz: `${feiertag.name}: ≈ ${mwh} MWh Sonne übrig – ${woche} % des Überschusses dieser Woche an einem einzigen Tag.`,
      jahr: jahr ? `Übers Jahr fallen ${jahr} % des Überschusses an, wenn der Betrieb ruht.` : ERKENNTNIS_TEXT,
    };
  }, [feiertag, ruheAnteil]);

  const beschreiben = useCallback(
    (i) => {
      const d = Math.floor(i / slots);
      const t = tage[d];
      const kopfText = `${t.kurz} ${t.datum}${t.name ? ` (${t.name})` : ""}, ${uhrzeit(i % slots, slots)}`;
      const teile = [`Last ${zahl(last[i])} kW`];
      if (sonneRef.current) {
        teile.push(`Sonne ${zahl(pv[i])} kW`);
        if (pv[i] > last[i]) teile.push(`Sonne deckt die ganze Last, übrig ${zahl(pv[i] - last[i])} kW`);
        else if (pv[i] > 0 && last[i] > 0) teile.push(`Sonne deckt ${zahl((pv[i] / last[i]) * 100)} Prozent`);
      }
      return `${kopfText}: ${teile.join(", ")}`;
    },
    [last, pv, slots, tage]
  );

  const entdecken = useCallback(
    (i) => {
      if (gemeldet.current) return;
      gemeldet.current = true;
      steckbrief.erkenntnis(ERKENNTNIS_ID);
      ereignis("erkenntnis", { id: ERKENNTNIS_ID });
      if (antwort) ansagen(`${beschreiben(i)}. ${antwort.satz} ${antwort.jahr}`);
    },
    [ansagen, antwort, beschreiben]
  );

  // sofort = bewusste Handlung (Tastatur, Frage-Marke); sonst zählt erst Verweilen auf dem Feiertag
  const zeigen = useCallback(
    (i, { sofort = false } = {}) => {
      setIdx(i);
      clearTimeout(verweilen.current);
      if (i == null) return;
      ansagen(beschreiben(i));
      if (gemeldet.current || Math.floor(i / slots) !== feiertagTag) return;
      if (sofort) entdecken(i);
      else verweilen.current = setTimeout(() => entdecken(i), VERWEILEN_MS);
    },
    [ansagen, beschreiben, entdecken, feiertagTag, slots]
  );

  // Zeiger: höchstens eine Auswertung je Bild
  const ausZeiger = useCallback(
    (clientX) => {
      offenX.current = clientX;
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        const el = flaeche.current;
        const x = offenX.current;
        if (!el || x == null) return;
        const r = el.getBoundingClientRect();
        if (!(r.width > 0)) return;
        const i = Math.min(anzahl - 1, Math.max(0, Math.floor(((x - r.left) / r.width) * anzahl)));
        zeigen(i);
      });
    },
    [anzahl, zeigen]
  );

  const verlassen = useCallback(() => {
    offenX.current = null;
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    clearTimeout(verweilen.current);
    setIdx(null);
  }, []);

  const beruehrungEnde = () => {
    clearTimeout(beruehrung.current?.timer);
    beruehrung.current = null;
  };

  // --- Zeiger-Ereignisse: Maus folgt sofort, Touch/Stift erst nach Tipp, Halten oder waagrechtem Wischen
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse") {
      ausZeiger(e.clientX);
      return;
    }
    beruehrungEnde();
    const b = { id: e.pointerId, x: e.clientX, y: e.clientY, aktiv: false, timer: 0 };
    b.timer = setTimeout(() => {
      if (beruehrung.current !== b || b.aktiv) return;
      b.aktiv = true;
      ausZeiger(b.x);
    }, HALTEN_MS);
    beruehrung.current = b;
  };
  const onPointerMove = (e) => {
    if (e.pointerType === "mouse") {
      ausZeiger(e.clientX);
      return;
    }
    const b = beruehrung.current;
    if (!b || b.id !== e.pointerId) return;
    if (!b.aktiv) {
      const dx = Math.abs(e.clientX - b.x);
      const dy = Math.abs(e.clientY - b.y);
      if (dy > SCHWELLE_PX && dy >= dx) {
        // senkrecht: das ist Scrollen – nichts anzeigen
        beruehrungEnde();
        return;
      }
      if (!(dx > SCHWELLE_PX && dx > dy)) return;
      b.aktiv = true;
      clearTimeout(b.timer);
    }
    ausZeiger(e.clientX);
  };
  const onPointerUp = (e) => {
    if (e.pointerType === "mouse") return;
    const b = beruehrung.current;
    if (!b || b.id !== e.pointerId) return;
    const tipp = !b.aktiv && Math.abs(e.clientX - b.x) <= SCHWELLE_PX && Math.abs(e.clientY - b.y) <= SCHWELLE_PX;
    beruehrungEnde();
    if (tipp) ausZeiger(e.clientX);
  };
  const onPointerCancel = () => {
    // Der Browser übernimmt (senkrechtes Scrollen): Geste und Ablesung beenden
    beruehrungEnde();
    verlassen();
  };

  // Tipp/Klick außerhalb der Grafikfläche blendet die Ablesung aus (Sonne-Schalter und Erkenntnis zählen mit)
  const offen = idx != null;
  useEffect(() => {
    if (!offen) return undefined;
    const aussen = (e) => {
      const ziel = e.target;
      if (flaeche.current?.contains(ziel) || bedienung.current?.contains(ziel)) return;
      verlassen();
    };
    document.addEventListener("pointerdown", aussen, true);
    return () => document.removeEventListener("pointerdown", aussen, true);
  }, [offen, verlassen]);

  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    const tag = e.shiftKey ? slots : STUNDE;
    const basis = idx ?? start;
    let neu = null;
    if (e.key === "ArrowRight") neu = idx == null ? start : basis + tag;
    else if (e.key === "ArrowLeft") neu = idx == null ? start : basis - tag;
    else if (e.key === "Home") neu = 0;
    else if (e.key === "End") neu = anzahl - 1;
    else if (e.key === "Escape" && idx != null) {
      e.preventDefault();
      verlassen();
      return;
    }
    if (neu == null) return;
    e.preventDefault();
    zeigen(Math.min(anzahl - 1, Math.max(0, neu)), { sofort: true });
  };

  const feiertagZeigen = () => {
    if (!feiertag) return;
    zeigen(feiertag.slot, { sofort: true });
    ereignis("hero_frage", { entdeckt: gemeldet.current });
  };

  const umschalten = () => {
    const an = !sonne;
    setSonne(an);
    ereignis("hero_sonne", { an });
  };

  const ruhetag = idx != null && tage[Math.floor(idx / slots)]?.ruhe;

  return (
    <figure
      ref={figur}
      id="hero-puls"
      data-testid="hero-puls"
      data-sonne={sonne ? "an" : "aus"}
      data-ablesen={idx != null ? "" : undefined}
      data-entdeckt={entdeckt ? "" : undefined}
      data-linse={sonne && ruhetag ? "uebrig" : undefined}
      // data-warten/data-laeuft setzt das Inline-Skript vor der Hydrierung (HeroStart.js)
      suppressHydrationWarning
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
      aria-describedby="hero-puls-text"
      onKeyDown={onKeyDown}
      className={`${s.figur} ${className}`}
    >
      {/* Kopf und Legende erst ab xl nebeneinander – darunter hätte der Kernsatz nur eine schmale Spalte */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
        {/* Server-Elemente einzeln einhüllen: als Geschwister in einer Liste meldet React sonst fehlende Schlüssel */}
        <Fragment key="kopf">{kopf}</Fragment>
        <Fragment key="legende">{legende}</Fragment>
      </div>

      <div
        ref={flaeche}
        data-puls-flaeche=""
        className={`${s.flaeche} relative mt-5 aspect-[390/300] w-full touch-pan-y select-none md:mt-6 md:aspect-[1200/420]`}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") verlassen();
        }}
      >
        <Fragment key="grafik">{children}</Fragment>

        {feiertag && antwort && (
          <div className={`${s.marken} ${s.sonnenMarke} pointer-events-none absolute inset-0`}>
            <span aria-hidden="true" className={`${s.leitlinie} ${s.marke}`} style={{ ...lage({ x: feiertag.x, y: feiertag.y }), "--i": 1 }} />
            <span
              aria-hidden="true"
              className={`${s.punkt} ${s.marke} ${s.feiertagPunkt} h-2 w-2 rounded-full bg-sun-300`}
              style={{ ...lage({ x: feiertag.x, y: feiertag.y }), "--i": 1 }}
            />
            <span className={s.labelFeiertag} style={lage({ mitte: feiertag.mitte })}>
              <span className={`${s.marke} block`} style={{ "--i": 1 }}>
                <button
                  type="button"
                  data-testid="hero-frage"
                  onClick={feiertagZeigen}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`${s.frage} block text-left text-[11.5px] font-semibold leading-tight text-sun-300 md:text-center md:text-[13px]`}
                >
                  <span className={`${s.frageText} ${s.frageTeil}`}>{`${feiertag.kurz} ${feiertag.datum} – was passiert hier?`}</span>
                  <span className={`${s.antwortTeil} block md:whitespace-nowrap`}>
                    <span className="max-md:block">{`${feiertag.name}: Betrieb ruht –`}</span> die Sonne nicht
                    <span className="ov-num mt-0.5 block font-medium text-white/80">{antwort.kurz}</span>
                  </span>
                </button>
              </span>
            </span>
          </div>
        )}

        {idx != null && <Fadenkreuz i={idx} last={last} pv={pv} sonne={sonne} oben={oben} anzahl={anzahl} slots={slots} tage={tage} />}
      </div>

      <Fragment key="tage">{tagesleiste}</Fragment>

      {/* Bedienleiste unter der Grafik (Daumenzone): Sonne-Schalter, dann Hinweis bzw. Erkenntnis.
          Ab sm liegen Hinweis und Erkenntnis in derselben Zelle – die Höhe steht vorab, nichts springt. */}
      <div ref={bedienung} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
        <button
          type="button"
          aria-pressed={sonne}
          onClick={umschalten}
          data-testid="hero-sonne"
          className="inline-flex min-h-11 shrink-0 items-center gap-2.5 self-start rounded-full bg-white/[0.07] pl-2.5 pr-4 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-white/[0.12]"
        >
          <span aria-hidden="true" className={`relative block h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${sonne ? "bg-sun-300" : "bg-white/20"}`}>
            <span className={`absolute left-0.5 top-0.5 block h-4 w-4 rounded-full bg-navy-950 transition-transform duration-300 ${sonne ? "translate-x-4" : "translate-x-0"}`} />
          </span>
          Sonne
        </button>
        <div className="grid min-w-0 flex-1 sm:min-h-11 sm:items-center">
          <p className={`col-start-1 row-start-1 flex items-center text-[14px] leading-snug text-white/55 sm:min-h-11 ${entdeckt && antwort ? "invisible max-sm:hidden" : ""}`}>
            <span className="pointer-coarse:hidden">Fahren Sie über die Woche – jede Viertelstunde lässt sich ablesen.</span>
            <span className="hidden pointer-coarse:inline">Tippen, kurz halten oder seitlich wischen – jede Viertelstunde lässt sich ablesen.</span>
          </p>
          {antwort && (
            <div data-testid="hero-erkenntnis" className={`col-start-1 row-start-1 min-w-0 ${entdeckt ? s.erkenntnis : "invisible max-sm:hidden"}`}>
              <p className="relative pl-4 font-display text-[15px] font-bold leading-snug text-white md:text-[16px]">
                <span aria-hidden="true" className="absolute left-0 top-[0.18em] h-[1.1em] w-[3px] rounded-full bg-ov-400" />
                {antwort.satz}
              </p>
              <p className="mt-1 pl-4 text-[13.5px] leading-snug text-white/65">
                {antwort.jahr}{" "}
                {BRUECKE && (
                  <a
                    href={`#${BRUECKE.anker}`}
                    className="inline-flex min-h-6 items-center gap-1 whitespace-nowrap font-semibold text-ov-300 underline-offset-4 hover:text-ov-200 hover:underline"
                  >
                    {`Was das für die Anlagengröße heißt · ${BRUECKE_NUMMER}`}
                  </a>
                )}
                <span className="mt-1 block text-[12.5px] font-medium text-white/60 sm:ml-2 sm:mt-0 sm:inline-block">Im Steckbrief gesammelt</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {ansage}
      </p>

      <Fragment key="caption">{caption}</Fragment>
    </figure>
  );
}

function Fadenkreuz({ i, last, pv, sonne, oben, anzahl, slots, tage }) {
  const x = ((i + 0.5) / anzahl) * 100;
  const yProzent = (kw) => ((300 - (Math.max(0, kw) * 280) / oben) / 320) * 100;
  const d = Math.floor(i / slots);
  const t = tage[d];
  const l = last[i];
  const p = pv[i];
  const uebrig = sonne && p > l;
  const deckung = l > 0 ? Math.min(1, p / l) : 0;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={s.tagAblesen} style={{ "--links": `${(d * slots * 100) / anzahl}%`, "--breite": `${(slots * 100) / anzahl}%` }} />
      <span className={`${s.linieAblesen} bg-white/45`} style={{ "--x": `${x}%` }} />
      {sonne && p > 0 && (
        <span
          className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-navy-950 ${uebrig ? "bg-sun-300" : "bg-ov-400"}`}
          style={{ left: `${x}%`, top: `${yProzent(p)}%` }}
        />
      )}
      <span className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-navy-950" style={{ left: `${x}%`, top: `${yProzent(l)}%` }} />
      <div
        className={`${s.ablesung} min-w-[180px] rounded-xl bg-navy-900/95 px-3 py-2 text-[12.5px] leading-snug text-white/80 shadow-[0_14px_32px_-14px_rgba(0,0,0,0.7)] backdrop-blur-sm`}
        style={{ "--x": `${x}%` }}
      >
        <span className="block whitespace-nowrap font-semibold text-white">
          {t.kurz} {t.datum} · <span className="ov-num">{uhrzeit(i % slots, slots)}</span>
          {t.name && <span className="text-sun-300"> · Feiertag</span>}
        </span>
        <span className="ov-num block whitespace-nowrap">
          Last <span className="font-semibold text-white">{`${zahl(l)} kW`}</span>
          {sonne && (
            <>
              {" · "}Sonne <span className="font-semibold text-ov-300">{`${zahl(p)} kW`}</span>
            </>
          )}
        </span>
        {sonne && p > 0 && (
          <span className="ov-num block whitespace-nowrap">
            {uebrig ? (
              <>
                deckt <span className="font-semibold text-ov-300">{"100\u00a0%"}</span> · <span className="text-sun-300">{`übrig ${zahl(p - l)} kW`}</span>
              </>
            ) : (
              <>
                Sonne deckt <span className="font-semibold text-ov-300">{`${zahl(deckung * 100)}\u00a0%`}</span> der Last
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
