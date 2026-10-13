"use client";

// src/components/GewerbeUnikat/K8Steckbrief.js
//
// K8 · Projektsteckbrief (Client, motion): das Deckblatt aus allen Entscheidungen der Seite. Im Startzustand
// ein vollständig ausgefülltes Beispiel-Dossier; jede Entscheidung ersetzt eine Zeile („Ihr Wert“).
//
// Aufbau beim ersten Eintritt: sechs Blöcke, Stagger 60 ms, gesamt ≤ 0,9 s – der Ausgang (Anfrage-CTA) ist
// NICHT Teil des Aufbaus und sofort sichtbar. Bei reduzierter Bewegung oder wenn das Blatt beim Laden schon
// im Bild ist: sofort.
//
// Aufholen: Solange das Blatt nicht im Bild ist, zeigt es den Stand beim letzten Hinsehen (beim ersten
// Mal: das Beispiel). Kommt es ins Bild, gleiten die neuen Werte Zeile für Zeile hinein und die Zeilen
// werden ov-grün – so sieht der Besucher, was seine Entscheidungen in K1–K7 verändert haben.
//
// Anfrage: anfrageUrl() mit kWp, Speicher und – nur wenn wirklich festgelegt – dem Jahresverbrauch (der
// Startwert ist der des synthetischen Beispielbetriebs und geht nicht als „Ihr Verbrauch“ in die Anfrage).

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { ereignis } from "@/lib/statistik";
import { liesZahlDe } from "@/components/Technik/torTypen";
import { BEWEGUNG, zahl } from "./_tokens";
import { useAnsage, useImSichtfeld, useReduzierteBewegung } from "./_gestaltung";
import { STECKBRIEF_START, anfrageUrl, bausteinZahl, rechnerUrl, steckbrief, useSteckbrief } from "./_steckbrief";
import { mitThema } from "./_cta";
import K8SteckbriefBlatt, { anfrageTeile, anzeigeZahl, eingabeWert } from "./K8SteckbriefBlatt";

const ZEILE = {
  aus: { opacity: 0, y: BEWEGUNG.weg, transition: { duration: 0 } },
  an: { opacity: 1, y: 0, transition: { duration: BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus } },
};
// sechs Blöcke × 60 ms Versatz + 600 ms Einblenden ≈ 0,9 s
const BLATT = {
  aus: {},
  an: { transition: { staggerChildren: BEWEGUNG.versatz } },
};

/** Ein Block des Deckblatts (Teil des Staggers). */
function Zeile(props) {
  return <m.div variants={ZEILE} {...props} />;
}

/** Gleitender Wert (ease-out, 420 ms) mit optionaler Verzögerung – für die Aufhol-Kaskade. */
function useGleiten(ziel, verzoegerung = 0, dauer = 420) {
  const ruhig = useReduzierteBewegung();
  const [wert, setWert] = useState(ziel);
  const ist = useRef(ziel);
  useEffect(() => {
    if (ruhig || !Number.isFinite(ziel) || !Number.isFinite(ist.current) || ist.current === ziel) {
      ist.current = ziel;
      setWert(ziel);
      return undefined;
    }
    const von = ist.current;
    const t0 = performance.now() + verzoegerung;
    let raf = 0;
    const schritt = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / dauer));
      const x = von + (ziel - von) * (1 - Math.pow(1 - p, 4));
      ist.current = x;
      setWert(x);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, verzoegerung, dauer, ruhig]);
  return wert;
}

function GleitZahl({ ziel, format, verzoegerung = 0 }) {
  const x = useGleiten(ziel, verzoegerung);
  return <span className="ov-num">{format(x)}</span>;
}

function GleitZaehler({ ziel }) {
  const x = useGleiten(ziel, 0, 520);
  return <span className="ov-num">{zahl(x)}</span>;
}

/**
 * Zahlenfeld (role="spinbutton") mit echtem Wert – Beispiel oder Ihr Wert, deutsch formatiert.
 * ↑/↓ = Schritt, Bild↑/↓ = 10 Schritte, Pos1/Ende = Grenzen, jeweils vom ANGEZEIGTEN Wert (bzw. Ihrem
 * Entwurf) aus. Ohne Fokus gleitet der Wert, mit Fokus steht der genaue Wert bzw. Ihr Entwurf im Feld.
 */
function GleitEingabe({ f, ziel, entwurf, verzoegerung, onAendern, onVerlassen, ...rest }) {
  const [fokus, setFokus] = useState(false);
  const x = useGleiten(ziel, verzoegerung);
  const text = entwurf ?? eingabeWert(f, fokus ? ziel : x);
  const jetzt = anzeigeZahl(f, ziel);
  const onKeyDown = (e) => {
    const s = f.schritt ?? 1;
    const basis = Number.isFinite(liesZahlDe(entwurf)) ? liesZahlDe(entwurf) : jetzt ?? f.min;
    let neu = null;
    if (e.key === "ArrowUp") neu = basis + s;
    else if (e.key === "ArrowDown") neu = basis - s;
    else if (e.key === "PageUp") neu = basis + s * 10;
    else if (e.key === "PageDown") neu = basis - s * 10;
    else if (e.key === "Home" && e.ctrlKey) neu = f.min;
    else if (e.key === "End" && e.ctrlKey) neu = f.max;
    if (neu == null) return;
    e.preventDefault();
    onAendern?.(zahl(Math.min(f.max, Math.max(f.min, Math.round(neu)))));
  };
  return (
    <input
      type="text"
      role="spinbutton"
      aria-valuenow={jetzt ?? undefined}
      aria-valuemin={f.min}
      aria-valuemax={f.max}
      aria-valuetext={jetzt == null ? undefined : `${zahl(jetzt)}${f.sprech ? ` ${f.sprech}` : ""}`}
      value={text}
      onKeyDown={onKeyDown}
      onFocus={() => setFokus(true)}
      onBlur={() => {
        setFokus(false);
        onVerlassen?.();
      }}
      onChange={(e) => onAendern?.(e.target.value)}
      {...rest}
    />
  );
}

export default function K8Steckbrief(props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Blatt {...props} />
      </MotionConfig>
    </LazyMotion>
  );
}

/** Jahresverbrauch nur übernehmen, wenn der Besucher ihn festgelegt hat (eigener Lastgang, Kapitel 01 oder hier). */
function anfrageFuer(sb) {
  const fest = sb.quelle === "eigen" || sb.bausteine.includes("k1") || sb.jahresverbrauchKwh !== STECKBRIEF_START.jahresverbrauchKwh;
  const url = anfrageUrl({ ...sb, jahresverbrauchKwh: fest ? sb.jahresverbrauchKwh : null });
  // Thema für den Konfigurator (THEMA_WERTE): eigener Lastgang vor Speicherwunsch
  return mitThema(url, sb.quelle === "eigen" ? "lastgang" : sb.speicherKwh > 0 ? "speicher" : null);
}

function Blatt({ orte, bereiche, beispiel }) {
  const sb = useSteckbrief();
  const ruhig = useReduzierteBewegung();
  const ref = useRef(null);
  const imBild = useImSichtfeld(ref, { einmal: false, schwelle: 0.04, rand: "0px 0px -8% 0px" });
  const [aufbauen, setAufbauen] = useState(false);
  const [gesehen, setGesehen] = useState(false);
  const [eingefroren, setEingefroren] = useState(null);
  const [ankunft, setAnkunft] = useState(false);
  const [entwurf, setEntwurf] = useState({});
  const [offen, setOffen] = useState({});
  const [frage, setFrage] = useState(false);
  const [ansage, ansagen] = useAnsage();
  const leerenRef = useRef(null);
  const abbrechenRef = useRef(null);
  const fokusNach = useRef(null);
  const erstesMal = useRef(true);

  // Liegt das Blatt beim Laden außerhalb des Bildes: zusammensetzen beim Eintritt, Beispiel → Ihre Werte
  useLayoutEffect(() => {
    if (ruhig || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.9 || r.bottom < 0) {
      if (r.top > 0) setAufbauen(true);
      setEingefroren(STECKBRIEF_START);
    }
  }, [ruhig]);

  // Außerhalb des Bildes einfrieren, im Bild nach kurzer Pause aufholen (Kaskade)
  useEffect(() => {
    if (ruhig) {
      setEingefroren(null);
      return undefined;
    }
    if (!imBild) {
      setEingefroren((e) => e ?? steckbrief.lesen());
      return undefined;
    }
    setGesehen(true);
    if (eingefroren == null) return undefined;
    // beim ersten Eintritt erst nach dem Aufbau der Blöcke aufholen, danach rasch
    const pause = aufbauen && erstesMal.current ? 620 : 260;
    const t = setTimeout(() => {
      erstesMal.current = false;
      setAnkunft(true);
      setEingefroren(null);
    }, pause);
    return () => clearTimeout(t);
  }, [imBild, ruhig, eingefroren, aufbauen]);

  useEffect(() => {
    if (!ankunft) return undefined;
    const t = setTimeout(() => setAnkunft(false), 1600);
    return () => clearTimeout(t);
  }, [ankunft]);

  // Fokus nach „Steckbrief leeren“-Rückfrage nicht verlieren
  useEffect(() => {
    const ziel = fokusNach.current;
    fokusNach.current = null;
    if (ziel === "abbrechen") abbrechenRef.current?.focus();
    else if (ziel === "leeren") leerenRef.current?.focus();
  }, [frage]);

  const onFeld = useCallback((f, a, text) => {
    setEingefroren(null);
    setEntwurf((e) => ({ ...e, [f.id]: text }));
    // leeres oder ungültiges Feld: der vorige Wert bleibt (Beispiel oder Ihr Wert)
    const n = Math.round(liesZahlDe(text));
    if (!Number.isFinite(n) || n < f.min || n > f.max) return;
    steckbrief.setze({ [f.id]: f.faktor ? n * f.faktor : n }, f.kapitel || a.kapitel);
  }, []);
  const onVerlassen = useCallback(
    (f) => {
      setEntwurf((e) => {
        const text = e[f.id];
        if (text != null) {
          const n = Math.round(liesZahlDe(text));
          if (!Number.isFinite(n) || n < f.min || n > f.max)
            ansagen(`${f.label}: bitte einen Wert zwischen ${zahl(f.min)} und ${zahl(f.max)}${f.einheit ? ` ${f.einheit}` : ""} eingeben – der vorige Wert bleibt.`);
        }
        const { [f.id]: _weg, ...rest } = e;
        return rest;
      });
    },
    [ansagen]
  );
  const onAbschnitt = useCallback((id) => setOffen((o) => ({ ...o, [id]: !o[id] })), []);

  const onAnfrage = useCallback(() => {
    const s = steckbrief.lesen();
    ereignis("steckbrief_anfrage", { bausteine: bausteinZahl(s) });
  }, []);

  const leeren = frage ? (
    <span role="group" aria-label="Steckbrief leeren" className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-700">
      Alle Werte zurück auf das Beispiel?
      <button
        type="button"
        onClick={() => {
          steckbrief.zuruecksetzen();
          setEntwurf({});
          fokusNach.current = "leeren";
          setFrage(false);
          ansagen("Steckbrief geleert – alle Werte stehen wieder auf dem Beispiel.");
          ereignis("steckbrief_leeren");
        }}
        className="inline-flex min-h-11 items-center font-semibold text-ink-900 underline decoration-ink-500 underline-offset-4"
      >
        Ja, leeren
      </button>
      <button
        ref={abbrechenRef}
        type="button"
        onClick={() => {
          fokusNach.current = "leeren";
          setFrage(false);
        }}
        className="inline-flex min-h-11 items-center font-semibold text-ink-600 underline decoration-ink-300 underline-offset-4"
      >
        Abbrechen
      </button>
    </span>
  ) : (
    <button
      ref={leerenRef}
      type="button"
      data-testid="steckbrief-leeren"
      onClick={() => {
        fokusNach.current = "abbrechen";
        setFrage(true);
      }}
      className="inline-flex min-h-11 items-center font-semibold text-ink-600 underline decoration-ink-300 underline-offset-4 hover:text-ink-900"
    >
      Steckbrief leeren
    </button>
  );

  const zeigen = !aufbauen || gesehen;
  const anzeige = eingefroren ?? sb;
  const teile = anfrageTeile(sb, STECKBRIEF_START);
  return (
    <m.div
      ref={ref}
      initial={false}
      animate={zeigen ? "an" : "aus"}
      variants={BLATT}
      data-uebernimmt={teile.length}
      data-aufholen={eingefroren ? "wartet" : ankunft ? "laeuft" : "fertig"}
      onFocusCapture={() => setEingefroren(null)}
    >
      <K8SteckbriefBlatt
        sb={anzeige}
        start={STECKBRIEF_START}
        bsp={beispiel}
        orte={orte}
        bereiche={bereiche}
        teile={teile}
        entwurf={entwurf}
        onFeld={onFeld}
        onVerlassen={onVerlassen}
        offen={offen}
        onAbschnitt={onAbschnitt}
        Zeile={Zeile}
        Zahl={GleitZahl}
        Eingabe={GleitEingabe}
        Zaehler={GleitZaehler}
        ankunft={ankunft}
        anfrageHref={anfrageFuer(sb)}
        rechnerHref={rechnerUrl(sb)}
        onAnfrage={onAnfrage}
        leeren={leeren}
        ansage={ansage}
        interaktiv
      />
    </m.div>
  );
}
