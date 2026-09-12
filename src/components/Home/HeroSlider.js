"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { HERO_SLIDES, HERO_INTERVALL } from "@/data/hero";

/**
 * Startseiten-Slider.
 *
 * Karussells sind bedienbar oder beeindruckend – selten beides. Deshalb:
 *
 *  - Automatischer Wechsel pausiert bei Hover, bei Tastaturfokus im Slider
 *    und wenn der Tab im Hintergrund liegt. Niemand verliert eine Zeile,
 *    weil weitergeschaltet wurde, während er noch liest.
 *  - Bei `prefers-reduced-motion` läuft gar kein Autoplay und es gibt keine
 *    Zoomfahrt auf den Bildern.
 *  - Pfeiltasten links/rechts steuern, wenn der Slider den Fokus hat.
 *  - Wischgesten auf dem Touchscreen.
 *  - Ein sichtbarer Pause-Schalter – Pflicht nach WCAG 2.2.2 für alles, was
 *    sich länger als fünf Sekunden selbst bewegt.
 *  - Nur der erste Slide lädt sofort (LCP), der Rest kommt nach.
 *  - Das Video läuft erst ab `md` und nur auf dem aktiven Slide.
 */
export default function HeroSlider() {
  const [aktiv, setAktiv] = useState(0);
  const [pausiert, setPausiert] = useState(false);
  const [vomNutzerGestoppt, setVomNutzerGestoppt] = useState(false);
  const [reduziert, setReduziert] = useState(false);
  // Video nur ausliefern, wenn es auch gezeigt werden kann. CSS-Ausblenden
  // reicht NICHT: display:none verhindert den Download nicht, sobald play()
  // aufgerufen wird – gemessen wurden so 26 MB auf einem 390-px-Viewport.
  const [videoErlaubt, setVideoErlaubt] = useState(false);

  const containerRef = useRef(null);
  const touchStart = useRef(null);
  const videoRef = useRef(null);

  const anzahl = HERO_SLIDES.length;
  const zu = useCallback((i) => setAktiv(((i % anzahl) + anzahl) % anzahl), [anzahl]);
  const weiter = useCallback(() => zu(aktiv + 1), [aktiv, zu]);
  const zurueck = useCallback(() => zu(aktiv - 1), [aktiv, zu]);

  // Bewegungspräferenz des Systems respektieren
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setzen = () => setReduziert(mq.matches);
    setzen();
    mq.addEventListener("change", setzen);
    return () => mq.removeEventListener("change", setzen);
  }, []);

  // Entscheidet, ob das Video überhaupt in den DOM kommt: nur auf großen
  // Displays, nicht bei aktivem Datensparmodus und nicht bei langsamer
  // Verbindung. Ein 13-MB-Hero über Mobilfunk ist kein Wow-Effekt.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    let frei = false;
    const pruefen = () => {
      const c = navigator.connection;
      const sparsam = c?.saveData === true || /2g/.test(c?.effectiveType || "");
      setVideoErlaubt(frei && mq.matches && !sparsam);
    };

    // Erst laden, wenn die Seite fertig ist und der Hauptthread Luft hat.
    // Die Datei ist 13,7 MB groß – sie darf den ersten Seitenaufbau unter
    // keinen Umständen ausbremsen. Das Standbild trägt den Hero so lange.
    const freigeben = () => {
      frei = true;
      pruefen();
    };
    const planen = () =>
      window.requestIdleCallback
        ? window.requestIdleCallback(freigeben, { timeout: 3000 })
        : setTimeout(freigeben, 1500);

    if (document.readyState === "complete") planen();
    else window.addEventListener("load", planen, { once: true });

    pruefen();
    mq.addEventListener("change", pruefen);
    navigator.connection?.addEventListener?.("change", pruefen);
    return () => {
      mq.removeEventListener("change", pruefen);
      navigator.connection?.removeEventListener?.("change", pruefen);
    };
  }, []);

  // Im Hintergrund nicht weiterschalten – spart Rechenzeit und Akku
  useEffect(() => {
    const onVis = () => setPausiert(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const laeuft = !reduziert && !pausiert && !vomNutzerGestoppt;

  useEffect(() => {
    if (!laeuft) return undefined;
    const t = setTimeout(weiter, HERO_INTERVALL);
    return () => clearTimeout(t);
  }, [laeuft, weiter, aktiv]);

  // Video nur auf dem aktiven Slide abspielen
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (aktiv === 0 && !reduziert && videoErlaubt) v.play().catch(() => {});
    else v.pause();
  }, [aktiv, reduziert, videoErlaubt]);

  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); weiter(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); zurueck(); }
  };

  return (
    <section
      ref={containerRef}
      aria-roledescription="Karussell"
      aria-label="Ökovolt Solartechnik"
      className="relative isolate w-full overflow-hidden bg-[#0a1e35]"
      onMouseEnter={() => setPausiert(true)}
      onMouseLeave={() => setPausiert(false)}
      onFocusCapture={() => setPausiert(true)}
      onBlurCapture={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget)) setPausiert(false);
      }}
      onKeyDown={onKey}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const d = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(d) > 50) (d < 0 ? weiter : zurueck)();
        touchStart.current = null;
      }}
    >
      {/* ---------- Slides ---------- */}
      {HERO_SLIDES.map((s, i) => {
        const ist = i === aktiv;
        return (
          <div
            key={s.id}
            role="group"
            aria-roledescription="Slide"
            aria-label={`${i + 1} von ${anzahl}: ${s.titel}`}
            aria-hidden={!ist}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              ist ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={s.bild}
              alt={s.alt}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={80}
              sizes="100vw"
              className={`object-cover object-center ${
                ist ? "motion-safe:scale-105" : "scale-100"
              } transition-transform duration-[8000ms] ease-out motion-reduce:transform-none`}
            />

            {/* Video liegt über dem Standbild – nur erster Slide, erst ab md,
                damit auf Mobilfunk keine 13 MB geladen werden. */}
            {s.video && i === 0 && videoErlaubt && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="none"
                poster={s.bild}
                aria-hidden="true"
              >
                <source src={s.video} type="video/mp4" />
              </video>
            )}

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/80"
            />
          </div>
        );
      })}

      {/* ---------- Inhalt ---------- */}
      <div className="relative z-10 mx-auto flex min-h-[460px] max-w-3xl flex-col items-center justify-center px-6 pb-28 pt-16 text-center sm:min-h-[520px] sm:pb-24 md:pb-48 lg:min-h-[640px]">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`${i === aktiv ? "block" : "hidden"}`}
          >
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-[13px]">
              {s.kicker}
            </p>
            {/* Nur der erste Slide bekommt das <h1>. Alle drei zu rendern
                hiesse drei <h1> im DOM – Google liest das DOM, nicht die
                Sichtbarkeit. Die übrigen Slides sind optisch identische
                Absätze. */}
            {i === 0 ? (
              <h1 className="text-balance text-[30px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[38px] lg:text-[52px]">
                {s.titel}
              </h1>
            ) : (
              <p className="text-balance text-[30px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[38px] lg:text-[52px]">
                {s.titel}
              </p>
            )}
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-white/85 sm:text-[18px]">
              {s.text}
            </p>
            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Link
                href={s.primaer.href}
                className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#558822]"
                style={{ backgroundColor: "#669933" }}
              >
                {s.primaer.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href={s.sekundaer.href}
                className="inline-flex items-center justify-center rounded-md border border-white/70 px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
              >
                {s.sekundaer.label}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Für Screenreader: Wechsel ansagen, ohne den Lesefluss zu stören */}
      <p aria-live="polite" className="sr-only">
        Slide {aktiv + 1} von {anzahl}: {HERO_SLIDES[aktiv].titel}
      </p>

      {/* ---------- Steuerung ---------- */}
      {/* Der Kartenblock darunter zieht sich ab md um 100px über den Slider.
          Ohne diesen Versatz lägen alle Bedienelemente darunter – gemessen:
          sechs von sechs verdeckt. */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-6 md:pb-[124px]">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 px-6">
          <button
            type="button"
            onClick={zurueck}
            aria-label="Vorheriger Slide"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-gray-900 sm:inline-flex"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>

          {/* Indikatoren mit Fortschritt – zeigen, wie lange der Slide noch steht */}
          <div className="flex flex-1 items-center gap-2 sm:max-w-[240px]">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => zu(i)}
                aria-label={`Slide ${i + 1}: ${s.titel}`}
                aria-current={i === aktiv ? "true" : undefined}
                className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-white ${
                    i < aktiv ? "w-full" : i === aktiv ? "w-full" : "w-0"
                  } ${i === aktiv && laeuft ? "ov-hero-fortschritt" : ""}`}
                  style={
                    i === aktiv && laeuft
                      ? { animationDuration: `${HERO_INTERVALL}ms` }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setVomNutzerGestoppt((v) => !v)}
            aria-label={vomNutzerGestoppt ? "Automatischen Wechsel starten" : "Automatischen Wechsel anhalten"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-gray-900"
          >
            {vomNutzerGestoppt ? (
              <Play aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Pause aria-hidden="true" className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={weiter}
            aria-label="Nächster Slide"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-gray-900 sm:inline-flex"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
