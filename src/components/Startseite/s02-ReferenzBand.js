"use client";

// src/components/Startseite/s02-ReferenzBand.js
//
// Client-Insel für S02Referenzen: Kennzahl (zählt beim Eintritt hoch), Branchen-Legende
// (ein Modul = ein Betrieb, wie die TV-Folie „Branchen“) und das typografische Laufband.
// Branche überfahren/antippen → Laufband hebt diese Betriebe hervor, die Kennzahl zeigt deren Anzahl.
// Laufband: hält bei Hover/Fokus an, Knopf zum Anhalten (WCAG 2.2.2); bei reduzierter Bewegung
// steht es als ruhige, umbrechende Namensliste da. Ohne JavaScript ist alles sichtbar.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";

/** Branchen auf zwei Reihen verteilen (größte zuerst, jeweils in die kürzere Reihe). */
function reihenBilden(gruppen) {
  const reihen = [[], []];
  const n = [0, 0];
  [...gruppen]
    .sort((a, b) => b.firmen.length - a.firmen.length)
    .forEach((g) => {
      const z = n[0] <= n[1] ? 0 : 1;
      reihen[z].push(g);
      n[z] += g.firmen.length;
    });
  return reihen.filter((r) => r.length);
}

/** Zahl weich zum Ziel bewegen (nur Text, kein Layout-Sprung dank Mindestbreite). */
function useZahl(ziel, bereit) {
  const [wert, setWert] = useState(ziel);
  const aktuell = useRef(ziel);
  const erstes = useRef(true);
  useEffect(() => {
    if (!bereit) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aktuell.current = ziel;
      setWert(ziel);
      return;
    }
    const von = erstes.current ? 0 : aktuell.current;
    const dauer = erstes.current ? 1300 : 420;
    erstes.current = false;
    let raf;
    const t0 = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - t0) / dauer, 1);
      const v = Math.round(von + (ziel - von) * (1 - Math.pow(1 - p, 4)));
      aktuell.current = v;
      setWert(v);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, bereit]);
  return wert;
}

function Firma({ f, branche, gedimmt, kopie }) {
  const klasse = `s02r-firma ${gedimmt ? "s02r-gedimmt" : ""}`;
  const inhalt = (
    <>
      <span>{f.name}</span>
      {f.link && <ArrowUpRight aria-hidden="true" className="s02r-pfeil h-[0.62em] w-[0.62em] shrink-0" strokeWidth={2.4} />}
    </>
  );
  return f.link ? (
    <Link href={`/referenzen/projekte/${f.slug}`} className={klasse} data-b={branche} tabIndex={kopie ? -1 : undefined}>
      {inhalt}
    </Link>
  ) : (
    <span className={klasse} data-b={branche}>
      {inhalt}
    </span>
  );
}

function Reihe({ gruppen, fokus, kopie }) {
  const Tag = kopie ? "div" : "ul";
  const Li = kopie ? "div" : "li";
  return (
    <Tag className="s02r-kopie-inhalt flex shrink-0 items-center" aria-hidden={kopie || undefined}>
      {gruppen.map((g) => {
        const aus = fokus && fokus !== g.branche;
        return [
          <Li key={`${g.branche}-l`} className={`s02r-gl ${aus ? "s02r-gedimmt" : ""} ${fokus === g.branche ? "s02r-gl-an" : ""}`}>
            {g.branche}
          </Li>,
          ...g.firmen.map((f, i) => (
            <Li key={f.slug} className="flex items-center">
              {i > 0 && <span aria-hidden="true" className={`s02r-trenner ${aus ? "s02r-gedimmt" : ""}`} />}
              <Firma f={f} branche={g.branche} gedimmt={aus} kopie={kopie} />
            </Li>
          )),
        ];
      })}
    </Tag>
  );
}

export default function ReferenzBand({ gruppen, kopf, link }) {
  const wurzel = useRef(null);
  const [js, setJs] = useState(false);
  const [an, setAn] = useState(false);
  const [aktiv, setAktiv] = useState(null);
  const [vorschau, setVorschau] = useState(null);
  const [angehalten, setAngehalten] = useState(false);

  const reihen = useMemo(() => reihenBilden(gruppen), [gruppen]);
  const gesamt = gruppen.reduce((s, g) => s + g.firmen.length, 0);
  const fokus = vorschau ?? aktiv;
  const fokusGruppe = gruppen.find((g) => g.branche === fokus);
  const zahl = useZahl(fokusGruppe ? fokusGruppe.firmen.length : gesamt, an);

  useEffect(() => {
    setJs(true);
    const el = wurzel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setAn(true);
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let modulIndex = 0;

  return (
    <div ref={wurzel} className={`s02r ${js ? "s02r-js" : ""} ${an ? "s02r-an" : ""}`}>
      <style>{STIL}</style>
      <div className="ov-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">{kopf}</div>

          {/* Kennzahl: Anzahl der hier gezeigten Betriebe (bzw. der hervorgehobenen Branche) */}
          <div className="flex items-end gap-5 lg:col-span-5 lg:justify-self-end">
            <p className="s02r-zahl" aria-hidden="true">
              {zahl}
            </p>
            <div className="pb-1.5">
              <p className="sr-only" aria-live="polite">
                {fokusGruppe ? `${fokusGruppe.firmen.length} Betriebe aus der Branche ${fokusGruppe.branche}` : `${gesamt} Betriebe aus ${gruppen.length} Branchen`}
              </p>
              <p aria-hidden="true" className="font-display text-[clamp(1.3rem,1.1rem+0.6vw,1.6rem)] font-bold leading-tight tracking-[-0.02em] text-ink-900">
                {zahl === 1 ? "Betrieb" : "Betriebe"}
              </p>
              <p aria-hidden="true" className="mt-0.5 text-[15px] text-ink-500">
                {fokusGruppe ? <>aus der Branche <span className="font-semibold text-ov-700">{fokusGruppe.branche}</span></> : `aus ${gruppen.length} Branchen`}
              </p>
              <div className="mt-2.5 -mb-2.5">{link}</div>
            </div>
          </div>
        </div>

        {/* Branchen-Legende: ein Modul je Betrieb */}
        <div className="mt-10 flex items-center gap-3 md:mt-14">
          <div className="s02r-chips -ml-5 flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto py-1 pl-5 pr-6 md:ml-0 md:flex-wrap md:overflow-visible md:p-0 md:gap-3">
          <p className="mr-2 hidden text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-400 md:block">Branchen</p>
          {gruppen.map((g) => {
            const gedrueckt = aktiv === g.branche;
            return (
              <button
                key={g.branche}
                type="button"
                aria-pressed={gedrueckt}
                onClick={() => setAktiv((a) => (a === g.branche ? null : g.branche))}
                onPointerEnter={(e) => e.pointerType === "mouse" && setVorschau(g.branche)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setVorschau(null)}
                className={`s02r-chip ${gedrueckt ? "s02r-chip-an" : ""} ${fokus && fokus !== g.branche ? "s02r-chip-aus" : ""}`}
              >
                <span aria-hidden="true" className="flex items-center gap-[3px]">
                  {g.firmen.map((f) => {
                    const i = modulIndex++;
                    return <span key={f.slug} className="s02r-modul" style={{ "--s02r-i": i }} />;
                  })}
                </span>
                <span>{g.branche}</span>
                <span className="s02r-anzahl">{g.firmen.length}</span>
              </button>
            );
          })}
          </div>
          <button
            type="button"
            onClick={() => setAngehalten((a) => !a)}
            aria-label={angehalten ? "Laufband fortsetzen" : "Laufband anhalten"}
            title={angehalten ? "Laufband fortsetzen" : "Laufband anhalten"}
            className="s02r-pause shrink-0"
          >
            {angehalten ? <Play aria-hidden="true" className="h-3.5 w-3.5" /> : <Pause aria-hidden="true" className="h-3.5 w-3.5" />}
          </button>
        </div>
        <div aria-hidden="true" className="s02r-linie mt-8 md:mt-10" />
      </div>

      {/* Laufband, nach Branchen gruppiert */}
      <div className={`s02r-band mt-8 space-y-5 md:mt-10 md:space-y-7 ${angehalten ? "s02r-halt" : ""}`}>
        {reihen.map((r, ri) => (
          <div key={ri} className="s02r-reihe" style={{ "--s02r-r": ri }}>
            <div className={`s02r-spur ${ri % 2 ? "s02r-rueck" : ""}`} style={{ animationDuration: `${62 + ri * 14}s` }}>
              <Reihe gruppen={r} fokus={fokus} />
              <div className="s02r-kopie">
                <Reihe gruppen={r} fokus={fokus} kopie />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STIL = `
.s02r-zahl {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(4.25rem, 3rem + 5vw, 7.5rem);
  line-height: 0.8;
  letter-spacing: -0.06em;
  font-variant-numeric: tabular-nums;
  min-width: 1.25em;
  text-align: right;
  background: linear-gradient(170deg, #151a24 0%, #252b37 55%, #558227 140%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.s02r-chips { scrollbar-width: none; }
.s02r-chips::-webkit-scrollbar { display: none; }
@media (max-width: 767px) {
  .s02r-chips {
    -webkit-mask-image: linear-gradient(90deg, #000 85%, transparent);
    mask-image: linear-gradient(90deg, #000 85%, transparent);
  }
  .s02r-zahl { text-align: left; min-width: 0; }
}
.s02r-chip {
  flex-shrink: 0; white-space: nowrap;
  display: inline-flex; align-items: center; gap: 0.6rem;
  min-height: 44px; padding: 0 0.95rem 0 0.8rem;
  border-radius: 999px; background: #fff;
  box-shadow: inset 0 0 0 1px var(--color-ink-200);
  font-size: 14px; font-weight: 600; color: var(--color-ink-800);
  transition: background-color 300ms, box-shadow 300ms, color 300ms, opacity 300ms, transform 300ms cubic-bezier(.22,1,.36,1);
  -webkit-tap-highlight-color: transparent;
}
.s02r-chip:hover { box-shadow: inset 0 0 0 1px var(--color-ink-300), 0 8px 20px -14px rgba(3,18,43,.35); }
.s02r-chip:focus-visible { outline: 2px solid var(--color-ov-500); outline-offset: 3px; }
.s02r-chip-an { background: var(--color-navy-950); color: #fff; box-shadow: inset 0 0 0 1px var(--color-navy-950), 0 10px 24px -14px rgba(3,18,43,.7); }
.s02r-chip-an:hover { box-shadow: inset 0 0 0 1px var(--color-navy-950), 0 10px 24px -14px rgba(3,18,43,.7); }
.s02r-chip-aus { opacity: 0.55; }
.s02r-anzahl {
  font-variant-numeric: tabular-nums; font-size: 12px; font-weight: 700;
  min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--color-ink-100); color: var(--color-ink-600);
  transition: background-color 300ms, color 300ms;
}
.s02r-chip-an .s02r-anzahl { background: rgba(255,255,255,.12); color: var(--color-ov-300); }

/* Modul-Glyphe: ein Modul = ein Betrieb */
.s02r-modul {
  position: relative; display: block; width: 9px; height: 13px; border-radius: 2px;
  background: linear-gradient(160deg, #1f58ad, #0a2658);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
  overflow: hidden;
  transition: transform 500ms cubic-bezier(.22,1,.36,1), opacity 500ms;
  transition-delay: calc(var(--s02r-i) * 45ms + 250ms);
}
.s02r-modul::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(160deg, #aed083, #669933);
  opacity: 0; transition: opacity 300ms;
}
.s02r-chip:hover .s02r-modul::after, .s02r-chip-an .s02r-modul::after { opacity: 1; }
.s02r-js:not(.s02r-an) .s02r-modul { opacity: 0; transform: translate3d(0, 6px, 0) scale(.6); }

.s02r-pause {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: 999px; color: var(--color-ink-500);
  box-shadow: inset 0 0 0 1px var(--color-ink-200); background: #fff;
  transition: color 200ms, box-shadow 200ms;
}
.s02r-pause:hover { color: var(--color-ink-900); box-shadow: inset 0 0 0 1px var(--color-ink-300); }
.s02r-pause:focus-visible { outline: 2px solid var(--color-ov-500); outline-offset: 3px; }

.s02r-linie {
  height: 1px; transform-origin: left center;
  background: linear-gradient(90deg, var(--color-ov-400) 0, var(--color-ink-200) 22%, var(--color-ink-100) 100%);
  transition: transform 1400ms cubic-bezier(.65,0,.35,1) 150ms;
}
.s02r-js:not(.s02r-an) .s02r-linie { transform: scaleX(0); }

/* Laufband */
.s02r-band {
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 13%, #000 87%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 13%, #000 87%, transparent 100%);
}
.s02r-reihe {
  overflow: hidden;
  transition: opacity 1100ms cubic-bezier(.22,1,.36,1), transform 1400ms cubic-bezier(.22,1,.36,1);
  transition-delay: calc(var(--s02r-r) * 160ms + 300ms);
}
.s02r-js:not(.s02r-an) .s02r-reihe { opacity: 0; transform: translate3d(calc(48px - var(--s02r-r) * 96px), 0, 0); }
.s02r-spur { display: flex; width: max-content; animation: s02r-lauf 62s linear infinite; }
.s02r-rueck { animation-direction: reverse; }
.s02r-band:hover .s02r-spur, .s02r-band:focus-within .s02r-spur, .s02r-halt .s02r-spur { animation-play-state: paused; }
@keyframes s02r-lauf { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }

.s02r-gl {
  display: inline-flex; align-items: center; gap: 0.7rem; flex-shrink: 0;
  margin: 0 1.6rem 0 3.25rem;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--color-ov-700);
  transition: opacity 400ms, color 300ms;
}
.s02r-gl::after { content: ""; width: 28px; height: 1px; background: var(--color-ov-400); }
.s02r-gl-an { color: var(--color-ov-600); }

.s02r-trenner {
  display: block; flex-shrink: 0; width: 6px; height: 6px; margin: 0 clamp(1.1rem, 0.6rem + 1.4vw, 2rem);
  border-radius: 999px; background: var(--color-ov-400);
  transition: opacity 400ms;
}
.s02r-firma {
  display: inline-flex; align-items: flex-start; gap: 0.12em; white-space: nowrap;
  font-family: var(--font-display); font-weight: 700;
  font-size: clamp(1.35rem, 1rem + 1.35vw, 2.2rem);
  line-height: 1.15; letter-spacing: -0.025em;
  color: var(--color-ink-900);
  transition: opacity 400ms, color 300ms;
}
.s02r-pfeil { margin-top: 0.12em; color: var(--color-ov-600); opacity: 0; transform: translate3d(-4px,4px,0); transition: opacity 300ms, transform 300ms cubic-bezier(.22,1,.36,1); }
a.s02r-firma { border-radius: 6px; }
a.s02r-firma:hover { color: var(--color-ov-700); }
a.s02r-firma:hover .s02r-pfeil, a.s02r-firma:focus-visible .s02r-pfeil { opacity: 1; transform: translate3d(0,0,0); }
a.s02r-firma:focus-visible { outline: 2px solid var(--color-ov-500); outline-offset: 4px; }
@media (hover: hover) {
  .s02r-spur:hover .s02r-firma:not(:hover) { opacity: 0.38; }
}
.s02r-gedimmt, .s02r-spur:hover .s02r-gedimmt:not(:hover) { opacity: 0.14; }

@media (prefers-reduced-motion: reduce) {
  .s02r-band { -webkit-mask-image: none; mask-image: none; }
  .s02r-reihe { overflow: visible; transition: none; }
  .s02r-spur { animation: none; width: auto; max-width: 80rem; margin-inline: auto; padding-inline: 1.25rem; }
  .s02r-spur > ul { flex-wrap: wrap; column-gap: 1.5rem; row-gap: 0.35rem; flex-shrink: 1; }
  .s02r-kopie, .s02r-pause, .s02r-trenner { display: none; }
  .s02r-gl { flex-basis: 100%; margin: 1.1rem 0 0.2rem; }
  .s02r-firma { font-size: clamp(1.15rem, 1rem + 0.6vw, 1.5rem); }
  .s02r-modul, .s02r-linie, .s02r-reihe { transition: none !important; }
}
@media (prefers-reduced-motion: reduce) and (min-width: 768px) {
  .s02r-spur { padding-inline: 2rem; }
}
`;
