"use client";

// src/components/GewerbeUnikat/K8FahrplanLinie.js
//
// K8 · Fahrplan-Bühne (Client, motion): sieben Stationen auf einer Linie, die sich beim Scrollen zeichnet
// (useScroll → pathLength) und am Abhängigkeits-Schloss vor Station 6 stehen bleibt. Sind Netzzugang (3) und
// Förderantrag (4) geöffnet, löst sich das Schloss: Die Linie läuft – unabhängig vom Scrollstand – bis 07
// durch, und die Erkenntnis „k8-reihenfolge“ erscheint dort, wo geklickt wurde (quer zwischen Stationen und
// Karte, hoch direkt unter der Station). Liegt die Rückmeldung unter dem Bildrand (z. B. 1024 × 768), holt
// die Bühne sie sanft ins Bild. Station 5 trägt das Montagefenster (Segment, Sprungziel #k8-montage) mit
// dem Hinweis auf erkannte ruhige Werktage aus den Daten.
//
// Lernmechanik, kein Gate: Station 6 ist jederzeit lesbar – vor dem Öffnen von 3 und 4 erklärt sie die Regel.
// Bei reduzierter Bewegung: Linie statisch bis zur Grenze, keine Übergänge.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, animate, domAnimation, m, useMotionValue, useScroll, useTransform } from "motion/react";
import { CalendarDays, Lock, LockOpen } from "lucide-react";
import { ereignis } from "@/lib/statistik";
import { cn } from "@/components/ui/cn";
import { Erkenntnis } from "./_bausteine";
import { BEWEGUNG, ERKENNTNISSE, FARBE } from "./_tokens";
import { useAnsage, useProBild, useReduzierteBewegung } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { useGewerbeDaten, vorwaermen } from "./_daten";
import { HochFahrplan, KarteRaster, MontageAspekte, QuerFahrplan, nn } from "./K8FahrplanAnsicht";
import { ruhigeWerktage } from "./K8Ruhe";

const ERKENNTNIS_ID = "k8-reihenfolge";
const ERKENNTNIS_TEXT = ERKENNTNISSE.find((e) => e.id === ERKENNTNIS_ID)?.text ?? "";
const EASE = BEWEGUNG.ease.aus;
/** Stationen, die das Schloss an Station 6 lösen. */
const VORAUS = [3, 4];

// ab 768 px quer (sieben Stationen nebeneinander, auch auf dem Tablet), darunter senkrecht
const QUER_ABFRAGE = "(min-width: 768px)";
function quaderAbo(cb) {
  const mq = window.matchMedia(QUER_ABFRAGE);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
}
const quaderLesen = () => window.matchMedia(QUER_ABFRAGE).matches;
function useQuer() {
  return useSyncExternalStore(quaderAbo, quaderLesen, () => true);
}

export default function K8FahrplanLinie(props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Buehne {...props} />
      </MotionConfig>
    </LazyMotion>
  );
}

function Buehne({ stationen, spuren, kalender, montage, fenster: FENSTER, schlossText }) {
  const quer = useQuer();
  const ruhig = useReduzierteBewegung();
  const [aktiv, setAktiv] = useState(() => (quer ? 1 : null));
  const [besucht, setBesucht] = useState(() => (quer ? [1] : []));
  const [bewegt, setBewegt] = useState(false); // erst nach der ersten Wahl animieren Karten
  const [loeser, setLoeser] = useState(null); // Station, deren Klick das Schloss gelöst hat
  const [klick, setKlick] = useState(0); // Zähler: nach jeder Wahl prüfen, ob die Rückmeldung im Bild ist
  const [sprung, setSprung] = useState(0); // Zähler: Sprung zum Montagefenster
  const sprungArt = useRef(null);
  const buehneRef = useRef(null);
  const sichtZiel = useRef(null);
  const [ansage, ansagen] = useAnsage();
  const schonGewusst = useSteckbrief((s) => s.erkenntnisse.includes(ERKENNTNIS_ID));
  const fenster = useSteckbrief((s) => s.montagefenster);
  const daten = useGewerbeDaten();
  const knoepfe = useRef({});
  const vorKlick = useRef(null);

  const entsperrt = schonGewusst || VORAUS.every((n) => besucht.includes(n));
  const entsperrtRef = useRef(entsperrt);

  useEffect(() => {
    vorwaermen();
  }, []);

  // Schloss gelöst (durch die Wahl in dieser Sitzung) → Erkenntnis sammeln, Band im Bild halten
  useEffect(() => {
    if (entsperrt && !entsperrtRef.current && !schonGewusst) {
      steckbrief.erkenntnis(ERKENNTNIS_ID);
      ereignis("erkenntnis", { id: ERKENNTNIS_ID });
      ansagen(`Schloss gelöst: ${ERKENNTNIS_TEXT}`);
      sichtZiel.current = "band";
    }
    entsperrtRef.current = entsperrt;
  }, [entsperrt, schonGewusst, ansagen]);

  // Quer: Rückmeldung (Kartenfläche bzw. Erkenntnis-Band) unter ≈ 85 % des Bildes → sanft hereinholen,
  // ohne die Stationszeile unter die Navigation zu schieben
  useEffect(() => {
    const ziel = sichtZiel.current;
    sichtZiel.current = null;
    if (!ziel || !klick) return undefined;
    // Hoch: das Band liegt direkt unter der getippten Station – nach dem Aufklappen ganz ins Bild holen
    if (!quer) {
      if (ziel !== "band") return undefined;
      const t = setTimeout(() => {
        buehneRef.current?.querySelector("[data-k8-band]")?.scrollIntoView({ block: "nearest", behavior: ruhig ? "auto" : "smooth" });
      }, ruhig ? 30 : 820);
      return () => clearTimeout(t);
    }
    const id = requestAnimationFrame(() => {
      const root = buehneRef.current;
      const el = root?.querySelector(ziel === "band" ? "[data-k8-band]" : "[data-k8-flaeche]") || root?.querySelector("[data-k8-flaeche]");
      const kopf = root?.querySelector("[data-k8-kopf]");
      if (!el || !kopf) return;
      const vh = window.innerHeight;
      const oben = el.getBoundingClientRect().top;
      if (oben <= vh * 0.85) return;
      const um = Math.min(oben - vh * 0.55, kopf.getBoundingClientRect().top - 84);
      if (um > 8) window.scrollBy({ top: um, behavior: ruhig ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [klick, entsperrt, quer, ruhig]);

  // Wechsel quer ↔ hoch: im Querformat ist immer eine Karte offen
  useEffect(() => {
    if (quer && aktiv == null) setAktiv(1);
  }, [quer, aktiv]);

  // Links aus dem Steckbrief (#k8-montage) öffnen Station 5 und führen zum Segment selbst (nicht zum Anfang
  // der Liste) – auch beim zweiten Klick. Der Fokus landet auf dem gewählten Fenster.
  useEffect(() => {
    const oeffnen = (art) => {
      sprungArt.current = art;
      setAktiv(5);
      setBesucht((b) => (b.includes(5) ? b : [...b, 5]));
      setSprung((n) => n + 1);
    };
    const pruefen = () => {
      if (window.location.hash === "#k8-montage") oeffnen("sofort");
    };
    const klick = (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href="#k8-montage"]') : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (window.location.hash !== "#k8-montage") window.history.pushState(null, "", "#k8-montage");
      oeffnen("sanft");
    };
    pruefen();
    window.addEventListener("hashchange", pruefen);
    document.addEventListener("click", klick);
    return () => {
      window.removeEventListener("hashchange", pruefen);
      document.removeEventListener("click", klick);
    };
  }, []);

  useEffect(() => {
    const art = sprungArt.current;
    sprungArt.current = null;
    if (!sprung || !art) return undefined;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById("k8-montage");
      if (!el) return;
      el.scrollIntoView({ block: "center", behavior: art === "sanft" && !ruhig ? "smooth" : "auto" });
      const radio = el.querySelector("input:checked") || el.querySelector("input");
      radio?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [sprung, ruhig]);

  const waehle = useCallback(
    (nr) => {
      setBewegt(true);
      const btn = knoepfe.current[nr];
      vorKlick.current = !quer && btn ? { nr, top: btn.getBoundingClientRect().top } : null;
      setAktiv((a) => (!quer && a === nr ? null : nr));
      // Löst diese Wahl das Schloss? Dann erscheint die Erkenntnis an dieser Station (hoch)
      if (!entsperrt && !besucht.includes(nr) && VORAUS.includes(nr) && VORAUS.every((n) => n === nr || besucht.includes(n))) setLoeser(nr);
      setBesucht((b) => (b.includes(nr) ? b : [...b, nr]));
      if (!sichtZiel.current) sichtZiel.current = "karte";
      setKlick((k) => k + 1);
      const s = stationen.find((x) => x.nr === nr);
      if (s?.schloss && !entsperrt) ansagen(`Station ${nn(nr)}: ${schlossText}`);
      ereignis("k8_station", { nr });
    },
    [quer, stationen, entsperrt, besucht, schlossText, ansagen]
  );

  // mobil: getippte Station bleibt unter dem Finger, wenn darüber eine Karte zuklappt
  useLayoutEffect(() => {
    const v = vorKlick.current;
    vorKlick.current = null;
    if (!v) return;
    const btn = knoepfe.current[v.nr];
    if (!btn) return;
    const d = btn.getBoundingClientRect().top - v.top;
    if (Math.abs(d) > 1) window.scrollBy(0, d);
  }, [aktiv]);

  const onTaste = useCallback(
    (e) => {
      const vor = quer ? "ArrowRight" : "ArrowDown";
      const zurueck = quer ? "ArrowLeft" : "ArrowUp";
      const nrs = stationen.map((s) => s.nr);
      const jetzt = nrs.findIndex((nr) => knoepfe.current[nr] === e.currentTarget);
      let ziel = null;
      if (e.key === vor) ziel = Math.min(nrs.length - 1, jetzt + 1);
      else if (e.key === zurueck) ziel = Math.max(0, jetzt - 1);
      else if (e.key === "Home") ziel = 0;
      else if (e.key === "End") ziel = nrs.length - 1;
      if (ziel == null || jetzt < 0) return;
      e.preventDefault();
      knoepfe.current[nrs[ziel]]?.focus();
    },
    [quer, stationen]
  );

  const knopfRef = useCallback((nr) => (el) => {
    if (el) knoepfe.current[nr] = el;
  }, []);

  // Ruhige Werktage (≥ 5 in Folge) aus dem Lastgang – Hinweis im Montagefenster
  const ruhe = useMemo(() => (daten.status === "bereit" && daten.last ? ruhigeWerktage(daten.last) : null), [daten.status, daten.last]);
  const quelle = daten.last?.quelle ?? "beispiel";

  const waehleFenster = useCallback(
    (id) => {
      steckbrief.setze({ montagefenster: id }, "k8");
      ereignis("k8_montagefenster", { fenster: id });
      const f = FENSTER.find((x) => x.id === id);
      if (f) ansagen(`Montagefenster: ${f.label.replace(/\u00AD/g, "")}. Karte 5 zeigt, was sich ändert.`);
    },
    [FENSTER, ansagen]
  );

  const zusatzFuer = (nr) => {
    if (nr === 5)
      return (
        <MontageBlock FENSTER={FENSTER} fenster={fenster} waehle={waehleFenster} montage={montage} ruhe={ruhe} quelle={quelle} ruhig={ruhig} />
      );
    return null;
  };
  const obenFuer = (nr) => {
    const s = stationen.find((x) => x.nr === nr);
    if (!s?.schloss) return null;
    const fehlend = VORAUS.filter((n) => !besucht.includes(n));
    return <SchlossHinweis entsperrt={entsperrt} text={schlossText} fehlend={fehlend} stationen={stationen} waehle={waehle} />;
  };

  const gemeinsam = { stationen, spuren, aktiv, besucht, entsperrt, onWaehle: waehle, onTaste, knopfRef, interaktiv: true };
  // Erkenntnis-Band: quer zwischen Stationen und Karte, hoch unter der Station, die das Schloss gelöst hat
  const band = <ErkenntnisBand sichtbar={entsperrt} ruhig={ruhig} text={schlossText} quer={quer} />;
  const bandBei = loeser ?? 6;

  return (
    <div ref={buehneRef}>
      {quer ? (
        <Quer key="quer" {...gemeinsam} kalender={kalender} obenFuer={obenFuer} zusatzFuer={zusatzFuer} bewegt={bewegt} ruhig={ruhig} zwischen={band} />
      ) : (
        <Hoch
          key="hoch"
          {...gemeinsam}
          kalender={kalender}
          obenFuer={obenFuer}
          zusatzFuer={zusatzFuer}
          bewegt={bewegt}
          ruhig={ruhig}
          nachKnopf={(nr) => (nr === bandBei ? band : null)}
        />
      )}
      <p aria-live="polite" className="sr-only">
        {ansage}
      </p>
    </div>
  );
}

/** Erkenntnis „Förderantrag vor Inbetriebnahme“ – klappt nach dem Lösen des Schlosses auf. */
function ErkenntnisBand({ sichtbar, ruhig, text, quer }) {
  return (
    <AnimatePresence initial={false}>
      {sichtbar && (
        <m.div
          key="erkenntnis"
          data-testid="erkenntnis-reihenfolge"
          data-k8-band=""
          className="scroll-mb-28 scroll-mt-24 overflow-hidden"
          initial={ruhig ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: BEWEGUNG.dauer.lang, ease: EASE, delay: ruhig ? 0 : 0.15 }}
        >
          <div className={quer ? "pt-6" : "pb-4 pl-[58px] pt-1"}>
            <div className={cn("flex items-start gap-4 rounded-[22px] bg-ov-400/[0.09]", quer ? "px-7 py-5" : "px-4 py-4")}>
              <span aria-hidden="true" className={cn("mt-0.5 shrink-0 items-center justify-center rounded-full bg-ov-400/15 text-ov-300", quer ? "flex h-10 w-10" : "hidden")}>
                <LockOpen className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <Erkenntnis dunkel>{ERKENNTNIS_TEXT}</Erkenntnis>
                <p className="mt-1.5 max-w-[70ch] pl-5 text-[14px] leading-relaxed text-white/72">{text}</p>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------------------------------
// Linie: gemessen an den Knoten, gezeichnet per pathLength (Scroll), Grenze vor dem Schloss
// ---------------------------------------------------------------------------------------------------

function useLinie({ wrapRef, knoten, stationen, achse, entsperrt, ruhig }) {
  const [geo, setGeo] = useState(null);
  const messen = useCallback(() => {
    const w = wrapRef.current;
    if (!w) return;
    const r = w.getBoundingClientRect();
    const punkte = [];
    for (const s of stationen) {
      const el = knoten.current[s.nr];
      if (!el) return;
      const b = el.getBoundingClientRect();
      punkte.push({ x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top });
    }
    setGeo((alt) => {
      const neu = { w: r.width, h: r.height, punkte };
      if (alt && alt.w === neu.w && alt.h === neu.h && alt.punkte.every((p, i) => Math.abs(p.x - punkte[i].x) < 0.5 && Math.abs(p.y - punkte[i].y) < 0.5)) return alt;
      return neu;
    });
  }, [wrapRef, knoten, stationen]);
  const messenProBild = useProBild(messen);

  useLayoutEffect(() => {
    messen();
    const w = wrapRef.current;
    if (!w || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => messenProBild());
    ro.observe(w);
    window.addEventListener("resize", messenProBild);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", messenProBild);
    };
  }, [messen, messenProBild, wrapRef]);

  // Position des Schlosses entlang der Linie (0 … 1): kurz hinter Station 5
  const grenzeZu = useMemo(() => {
    if (!geo) return 0.72;
    const p = geo.punkte;
    const i5 = stationen.findIndex((s) => s.nr === 5);
    const i6 = stationen.findIndex((s) => s.nr === 6);
    const a = achse === "x" ? "x" : "y";
    const laenge = p[p.length - 1][a] - p[0][a];
    if (!(laenge > 0) || i5 < 0 || i6 < 0) return 0.72;
    return (p[i5][a] + (p[i6][a] - p[i5][a]) * 0.4 - p[0][a]) / laenge;
  }, [geo, stationen, achse]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 80%", "end 60%"] });
  const grenze = useMotionValue(entsperrt ? 1 : grenzeZu);
  // nach dem Lösen: eigene Füllung bis 07, unabhängig vom Scrollstand (max mit dem Scroll-Anteil)
  const voll = useMotionValue(0);
  const gezeichnet = useTransform([scrollYProgress, grenze, voll], ([p, g, v]) => (ruhig ? g : Math.max(Math.min(p, g), v)));
  const warEntsperrt = useRef(entsperrt);

  useEffect(() => {
    if (!entsperrt) grenze.set(grenzeZu);
  }, [entsperrt, grenzeZu, grenze]);

  useEffect(() => {
    const vorher = warEntsperrt.current;
    warEntsperrt.current = entsperrt;
    if (!entsperrt) {
      voll.set(0);
      return undefined;
    }
    if (vorher || ruhig) {
      grenze.set(1);
      if (ruhig) voll.set(1);
      return undefined;
    }
    voll.set(Math.min(scrollYProgress.get(), grenze.get()));
    const a = animate(grenze, 1, { duration: 0.9, ease: EASE });
    const b = animate(voll, 1, { duration: 1.1, ease: EASE });
    return () => {
      a.stop();
      b.stop();
    };
  }, [entsperrt, ruhig, grenze, voll, scrollYProgress]);

  return { geo, gezeichnet, grenzeZu };
}

function LinienSvg({ geo, gezeichnet, grenzeZu, entsperrt, achse }) {
  if (!geo) return null;
  const p = geo.punkte;
  const a = p[0];
  const z = p[p.length - 1];
  const d = achse === "x" ? `M ${a.x} ${a.y} H ${z.x}` : `M ${a.x} ${a.y} V ${z.y}`;
  const gx = achse === "x" ? a.x + (z.x - a.x) * grenzeZu : a.x;
  const gy = achse === "x" ? a.y : a.y + (z.y - a.y) * grenzeZu;
  const dGesperrt = achse === "x" ? `M ${gx} ${gy} H ${z.x}` : `M ${gx} ${gy} V ${z.y}`;
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      style={{ touchAction: "pan-y" }}
    >
      <path d={d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" strokeLinecap="round" />
      {!entsperrt && <path d={dGesperrt} fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />}
      <m.path data-k8-linie="" d={d} fill="none" stroke={FARBE.weiss} strokeOpacity={0.85} strokeWidth="2" strokeLinecap="round" style={{ pathLength: gezeichnet }} />
    </svg>
  );
}

/** Knoten-Inhalt von Station 6: Schloss → Nummer (ruhiger Übergang). Stabile Komponente, damit der Austritt läuft. */
function SchlossKnoten({ entsperrt, ruhig }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {entsperrt ? (
        <m.span
          key="nr"
          aria-hidden="true"
          className="ov-num"
          initial={ruhig ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: BEWEGUNG.dauer.mittel, ease: EASE, delay: 0.25 }}
        >
          06
        </m.span>
      ) : (
        <m.span key="schloss" className="flex" exit={ruhig ? undefined : { opacity: 0, scale: 0.6, y: -6 }} transition={{ duration: BEWEGUNG.dauer.mittel, ease: EASE }}>
          <Lock aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </m.span>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------------------------------
// Quer (ab 1024 px): Tabelle + Kartenfläche
// ---------------------------------------------------------------------------------------------------

function Quer({ kalender, obenFuer, zusatzFuer, bewegt, ruhig, entsperrt, stationen, aktiv, zwischen, ...rest }) {
  const wrapRef = useRef(null);
  const knoten = useRef({});
  const { geo, gezeichnet, grenzeZu } = useLinie({ wrapRef, knoten, stationen, achse: "x", entsperrt, ruhig });
  const knotenRef = useCallback((nr) => (el) => {
    if (el) knoten.current[nr] = el;
  }, []);

  const panel = (
    <div data-k8-flaeche="" className="mt-6 min-h-[460px] rounded-[28px] bg-white/[0.04] p-6 lg:p-8 xl:p-10">
      {stationen.map((s) => {
        const ist = s.nr === aktiv;
        const inhalt = <KarteRaster s={s} kalender={kalender} oben={obenFuer(s.nr)} vorne={zusatzFuer(s.nr)} />;
        return (
          <div key={s.nr} id={`k8-karte-${s.nr}`} role="region" aria-labelledby={`k8-knopf-${s.nr}`} hidden={!ist}>
            {ist ? (
              <m.div
                key={`an-${s.nr}`}
                initial={bewegt && !ruhig ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: BEWEGUNG.dauer.mittel, ease: EASE }}
              >
                {inhalt}
              </m.div>
            ) : (
              inhalt
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <QuerFahrplan
      {...rest}
      stationen={stationen}
      aktiv={aktiv}
      entsperrt={entsperrt}
      kopfRef={wrapRef}
      knotenRef={knotenRef}
      schlossKnoten={() => <SchlossKnoten entsperrt={entsperrt} ruhig={ruhig} />}
      linie={<LinienSvg geo={geo} gezeichnet={gezeichnet} grenzeZu={grenzeZu} entsperrt={entsperrt} achse="x" />}
      panel={panel}
      zwischen={zwischen}
    />
  );
}

// ---------------------------------------------------------------------------------------------------
// Hoch (unter 1024 px): Liste mit Karten unter der Station
// ---------------------------------------------------------------------------------------------------

function Hoch({ kalender, obenFuer, zusatzFuer, bewegt, ruhig, entsperrt, stationen, aktiv, ...rest }) {
  const wrapRef = useRef(null);
  const knoten = useRef({});
  const { geo, gezeichnet, grenzeZu } = useLinie({ wrapRef, knoten, stationen, achse: "y", entsperrt, ruhig });
  const knotenRef = useCallback((nr) => (el) => {
    if (el) knoten.current[nr] = el;
  }, []);

  const karte = (nr) => {
    const offen = nr === aktiv;
    const inhalt = (
      <div className="pb-7 pl-[58px] pt-1">
        <KarteRaster s={stationen.find((x) => x.nr === nr)} kalender={kalender} oben={obenFuer(nr)} vorne={zusatzFuer(nr)} />
      </div>
    );
    return (
      <div id={`k8-karte-${nr}`} role="region" aria-labelledby={`k8-knopf-${nr}`} hidden={!offen}>
        {offen ? (
          <m.div
            key={`an-${nr}`}
            className="overflow-hidden"
            initial={bewegt && !ruhig ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: BEWEGUNG.dauer.mittel, ease: EASE }}
          >
            {inhalt}
          </m.div>
        ) : (
          inhalt
        )}
      </div>
    );
  };

  return (
    <HochFahrplan
      {...rest}
      stationen={stationen}
      aktiv={aktiv}
      entsperrt={entsperrt}
      listeRef={wrapRef}
      knotenRef={knotenRef}
      schlossKnoten={() => <SchlossKnoten entsperrt={entsperrt} ruhig={ruhig} />}
      linie={<LinienSvg geo={geo} gezeichnet={gezeichnet} grenzeZu={grenzeZu} entsperrt={entsperrt} achse="y" />}
      karte={karte}
    />
  );
}

// ---------------------------------------------------------------------------------------------------
// Karten-Zusätze: Schloss-Erklärung (Station 6) und Montagefenster (Station 5)
// ---------------------------------------------------------------------------------------------------

function SchlossHinweis({ entsperrt, text, fehlend, stationen, waehle }) {
  if (entsperrt) {
    return (
      <p className="mb-7 flex items-start gap-3 rounded-2xl bg-white/[0.05] px-5 py-4 text-[15px] leading-relaxed text-white/85">
        <LockOpen aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" strokeWidth={2} />
        <span>Netzzugang und Förderantrag stehen vor der Inbetriebnahme – die Reihenfolge stimmt.</span>
      </p>
    );
  }
  return (
    <div className="mb-7 flex flex-col gap-4 rounded-2xl bg-white/[0.07] p-5 sm:flex-row sm:items-start md:p-6">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
        <Lock className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[17px] font-bold leading-snug text-white">Erst Netzzugang und Förderantrag – dann die Inbetriebnahme.</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-white/80">{text}</p>
        {fehlend.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {fehlend.map((nr) => {
              const s = stationen.find((x) => x.nr === nr);
              return (
                <button
                  key={nr}
                  type="button"
                  onClick={() => waehle(nr)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.16]"
                >
                  <span className="ov-num text-white/60">{nn(nr)}</span>
                  {String(s?.titel ?? "").replace(/\u00AD/g, "")} öffnen
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Montagefenster als gefüllte Radiogruppe – wie Segment (_gestaltung.js), aber mobil als dreispaltiges Raster
 * (die Labels „laufende Schicht | Wochenenden | Betriebsurlaub“ passen bei 390 px nicht in eine Pillenzeile).
 */
function FensterWahl({ optionen, wert, setWert }) {
  return (
    <fieldset id="k8-montage" data-testid="montagefenster" className="min-w-0 scroll-mt-28 scroll-mb-28">
      <legend className="mb-2 text-[12.5px] font-semibold text-white/60">Montagefenster wählen</legend>
      <div className="grid grid-cols-3 gap-1 rounded-[20px] bg-white/[0.07] p-1 sm:inline-flex sm:rounded-full">
        {optionen.map((o) => {
          const aktiv = o.id === wert;
          return (
            <label
              key={o.id}
              className={[
                "relative flex min-h-12 cursor-pointer select-none items-center justify-center rounded-2xl px-1.5 text-center text-[13px] font-semibold leading-tight transition-colors duration-200 sm:min-h-11 sm:rounded-full sm:px-4",
                aktiv ? "bg-white text-navy-950" : "text-white/75 hover:bg-white/10",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-500",
              ].join(" ")}
            >
              <input type="radio" name="k8-montagefenster" value={o.id} checked={aktiv} onChange={() => setWert(o.id)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function MontageBlock({ FENSTER, fenster, waehle, montage, ruhe, quelle, ruhig }) {
  const chip = ruhe
    ? quelle === "eigen"
      ? `In Ihrem Lastgang: ruhige Werktage ${ruhe.text}`
      : `Betriebsurlaub ${ruhe.text} erkannt (synthetisch)`
    : null;
  const schluessel = fenster && montage[fenster] ? fenster : "offen";
  return (
    <div className="mb-8">
      <FensterWahl optionen={FENSTER} wert={fenster} setWert={waehle} />
      {chip && (
        <button
          type="button"
          data-testid="montage-ruhe"
          onClick={() => waehle("betriebsurlaub")}
          aria-pressed={fenster === "betriebsurlaub"}
          className="mt-3 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-left text-[13.5px] leading-snug text-white/85 transition-colors hover:bg-white/[0.12]"
        >
          <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-white/60" strokeWidth={2} />
          <span>
            {chip}
            {fenster !== "betriebsurlaub" && <span className="font-semibold text-white"> · als Fenster übernehmen</span>}
          </span>
        </button>
      )}
      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={schluessel}
            initial={ruhig ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={ruhig ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: BEWEGUNG.dauer.kurz, ease: EASE }}
          >
            <MontageAspekte texte={montage[schluessel]} />
          </m.div>
        </AnimatePresence>
      </div>
      <p className="mt-5 text-[13px] leading-snug text-white/55">Ob ein Fenster reicht, hängt von Anlagengröße, Dach und Wetter ab – Dauern nennen wir hier bewusst nicht.</p>
      <div aria-hidden="true" className="mt-8 h-px bg-white/[0.08]" />
    </div>
  );
}
