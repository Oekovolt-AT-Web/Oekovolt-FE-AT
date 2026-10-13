"use client";

// src/components/GewerbeUnikat/K2DachLabor.js
//
// K2 · Dach-Labor: Client-Bühne. Hält den Zustand (Dachart, Hallenmaß, Abzüge, Tag, Uhrzeit, Ort),
// rechnet Kennwerte, Dachplan, Sonnenstand und Tageskurve live (reine Funktionen aus K2Modell/K2Sonne)
// und rendert dieselbe Komposition wie der SSR-Platzhalter (K2Pult) – mit 3D-Szene (K2Szene3D, three.js)
// oder dem Iso-SVG-Rückfall (kein WebGL, schwaches Gerät, Fehler, ?k2=svg).
//
// Kopplung: Ort- oder Dachartwechsel (400 ms entprellt) → pvSetzen(ort, Ausrichtung) für K3/K5 und
// steckbrief.setze({ dachart, laengeM, breiteM, flaecheQm, kwpMax, ortId }, "k2"); die Nutzfläche geht an den
// Ausgang (k2AusgangSetzen → Rechner-Link mit derselben kWp-Zahl).
// Erkenntnis „k2-ostwest“ beim ersten Wechsel Ost-West ↔ Süd (live gerechnet).
// Windrose: folgt der Drehung je gerendertem Bild (onAnsicht), ohne die ganze Bühne neu zu rendern.
// Sonnenlauf: Knopf an der Zeit-Pille spielt den Tag vom Aufgang bis zum Untergang ab (1 h ≈ 0,55 s – der
// Dezembertag ist auch beim Abspielen kurz). Nur auf Klick, endet von selbst, stoppt bei Tag-, Ort- oder
// Zeitwahl; bei reduzierter Bewegung gibt es den Knopf nicht (CSS motion-reduce).

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { ereignis } from "@/lib/statistik";
import { Erkenntnis } from "./_bausteine";
import { BEWEGUNG, zahl } from "./_tokens";
import { Zahl, useLeerlauf, useMobil, useProBild, useReduzierteBewegung, useSchwachesGeraet, useTastenRegler } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { AUSRICHTUNG_FUER_DACHART, pvSetzen, useGewerbeDaten, vorwaermen } from "./_daten";
import { ANSICHT, DACHART_IDS, DACH_INFO, HALLEN_PRESETS, MASS, START, ZEIT, bildunterschrift, dachPlan, kennwerte } from "./K2Modell";
import { sonneAm, sonnenTag, tagesBogen, tageskurve } from "./K2Sonne";
import K2Pult, { ErkenntnisPlatz, KompassBild, SpielKnopf } from "./K2Pult";
import K2IsoSvg from "./K2IsoSvg";
import { k2AusgangSetzen } from "./K2Ausgang";

const Szene3D = dynamic(() => import("./K2Szene3D"), { ssr: false, loading: () => null });

/**
 * WebGL angeboten? Nur die Schnittstelle prüfen – KEIN Wegwerf-Kontext (Firefox meldet sonst bei jedem
 * Besuch „WebGL context was lost“). Scheitert der echte Renderer, greift onFehler → Iso-SVG.
 */
function webglPruefen() {
  try {
    return typeof window.WebGLRenderingContext !== "undefined" || typeof window.WebGL2RenderingContext !== "undefined";
  } catch {
    return false;
  }
}

/** Windrose, die der 3D-Drehung folgt (eigener kleiner Zustand statt Re-Render der Bühne). */
function KompassLive({ abo }) {
  const [dreh, setDreh] = useState(0);
  useEffect(() => abo(setDreh), [abo]);
  return <KompassBild dreh={dreh} />;
}

/** Wie die gewählte Dachart im Erkenntnis-Satz heißt. */
const BEI = { "ost-west": "bei Ost-West", sued: "bei Süd-Aufständerung", trapez: "auf Trapezblech", shed: "auf dem Sheddach" };

/** Startzustand: Seitenbeispiel, oder – wenn der Besucher K2 schon benutzt hat – die Werte aus dem Steckbrief. */
function startZustand(sb) {
  if (!sb?.bausteine?.includes("k2")) return { ...START };
  return {
    ...START,
    dachart: DACHART_IDS.includes(sb.dachart) ? sb.dachart : START.dachart,
    laengeM: Math.min(MASS.laenge.max, Math.max(MASS.laenge.min, Math.round((sb.laengeM || START.laengeM) / 5) * 5)),
    breiteM: Math.min(MASS.breite.max, Math.max(MASS.breite.min, Math.round((sb.breiteM || START.breiteM) / 5) * 5)),
    ortId: sb.ortId || START.ortId,
  };
}

export default function K2DachLabor({ dacharten, orte, pvgis, empfehlungKwp }) {
  const sb = useSteckbrief();
  const daten = useGewerbeDaten();
  const ruhig = useReduzierteBewegung();
  const mobil = useMobil();
  const schwach = useSchwachesGeraet();

  const [z, setZ] = useState(() => startZustand(steckbrief.lesen()));
  const [dreh, setDreh] = useState(0);
  const [webgl, setWebgl] = useState(null);
  const [fehler3d, setFehler3d] = useState(false);
  const [bereit3d, setBereit3d] = useState(false);
  const [svgWeg, setSvgWeg] = useState(false);
  const [gezogen, setGezogen] = useState(false);
  const [erkenntnisAn, setErkenntnisAn] = useState(() => steckbrief.lesen().erkenntnisse.includes("k2-ostwest"));
  const beruehrt = useRef(false);
  const uebernommen = useRef(false);
  const vorher = useRef(z.dachart);
  const kompassFn = useRef(null);
  const kompassAbo = useCallback((fn) => {
    kompassFn.current = fn;
    return () => {
      kompassFn.current = null;
    };
  }, []);

  // Rechnen im Leerlauf anstoßen (idempotent – der Hero tut das auf der Seite ohnehin)
  useLeerlauf(() => vorwaermen());

  useEffect(() => {
    let erzwungen = false;
    try {
      erzwungen = new URLSearchParams(window.location.search).get("k2") === "svg";
    } catch {
      erzwungen = false;
    }
    setWebgl(!erzwungen && webglPruefen());
  }, []);

  // Steckbrief kam erst nach dem ersten Render (sessionStorage/URL): einmalig übernehmen
  useEffect(() => {
    if (uebernommen.current || beruehrt.current) return;
    if (sb.bausteine.includes("k2")) {
      uebernommen.current = true;
      setZ((alt) => ({ ...alt, ...startZustand(sb), tag: alt.tag, zeitMin: alt.zeitMin }));
    }
    if (sb.erkenntnisse.includes("k2-ostwest")) setErkenntnisAn(true);
  }, [sb]);

  // ------------------------------------------------------------------------------------ Ableitungen
  const alleOrte = useMemo(() => orte.flatMap((g) => g.orte), [orte]);
  const ort = alleOrte.find((o) => o.slug === z.ortId) || alleOrte[0];
  const qm = useMemo(() => Object.fromEntries(dacharten.map((d) => [d.id, d.qmProKwp])), [dacharten]);
  const proDachart = useMemo(
    () =>
      Object.fromEntries(
        dacharten.map((d) => [
          d.id,
          kennwerte({ laengeM: z.laengeM, breiteM: z.breiteM, randPct: z.randPct, hindernisPct: z.hindernisPct, qmProKwp: d.qmProKwp, spez: ort.ertrag[d.id] }),
        ]),
      ),
    [dacharten, z.laengeM, z.breiteM, z.randPct, z.hindernisPct, ort],
  );
  const w = proDachart[z.dachart];
  const plan = useMemo(
    () =>
      dachPlan({
        laengeM: z.laengeM,
        breiteM: z.breiteM,
        randPct: z.randPct,
        hindernisPct: z.hindernisPct,
        dachart: z.dachart,
        qmProKwp: qm[z.dachart],
        module: w.module,
      }),
    [z.laengeM, z.breiteM, z.randPct, z.hindernisPct, z.dachart, qm, w.module],
  );
  const sonne = useMemo(() => sonneAm(z.tag, z.zeitMin, ort.lat, ort.lon), [z.tag, z.zeitMin, ort]);
  const kurve = useMemo(() => tageskurve(z.tag, ort.lat, ort.lon), [z.tag, ort]);
  const bogen = useMemo(() => tagesBogen(z.tag, ort.lat, ort.lon, kurve), [z.tag, ort, kurve]);
  const caption = bildunterschrift({ laengeM: z.laengeM, breiteM: z.breiteM, dachart: z.dachart, netto: w.netto, kwp: w.kwp, spez: w.spez, ortName: ort.name });

  // Bildunterschrift (aria-live) gedrosselt: erst nach 450 ms Ruhe
  const [ansage, setAnsage] = useState(caption);
  useEffect(() => {
    const t = setTimeout(() => setAnsage(caption), 450);
    return () => clearTimeout(t);
  }, [caption]);

  // ------------------------------------------------------------------------------------ Aktionen
  const aendern = useCallback((teil) => {
    beruehrt.current = true;
    setZ((alt) => ({ ...alt, ...teil }));
  }, []);
  const proBild = useProBild((teil) => aendern(teil));

  // Sonnenlauf abspielen (Aufgang → Untergang)
  const [spielt, setSpielt] = useState(false);
  const spielRaf = useRef(0);
  const svgModus = useRef(true);
  const stopp = useCallback(() => {
    if (!spielRaf.current) return;
    cancelAnimationFrame(spielRaf.current);
    spielRaf.current = 0;
    setSpielt(false);
  }, []);
  useEffect(() => () => cancelAnimationFrame(spielRaf.current), []);
  const abspielen = useCallback(() => {
    if (spielRaf.current) {
      stopp();
      return;
    }
    if (kurve.auf == null || kurve.unter == null) return;
    const von = Math.max(ZEIT.min, Math.ceil((kurve.auf + 5) / 5) * 5);
    const bis = Math.min(ZEIT.max, Math.floor((kurve.unter - 5) / 5) * 5);
    const minProSek = 110;
    // Im Iso-SVG-Rückfall (schwache Geräte) höchstens ≈ 15 Bilder je Sekunde – das SVG wird ganz neu gezeichnet
    const takt = svgModus.current ? 66 : 0;
    let zuletzt = -1e9;
    const t0 = performance.now();
    beruehrt.current = true;
    setSpielt(true);
    ereignis("k2_sonnenlauf", { tag: z.tag });
    const schritt = (jetzt) => {
      const min = von + ((jetzt - t0) / 1000) * minProSek;
      if (min >= bis) {
        setZ((alt) => ({ ...alt, zeitMin: bis }));
        spielRaf.current = 0;
        setSpielt(false);
        return;
      }
      if (jetzt - zuletzt >= takt) {
        zuletzt = jetzt;
        setZ((alt) => ({ ...alt, zeitMin: min }));
      }
      spielRaf.current = requestAnimationFrame(schritt);
    };
    spielRaf.current = requestAnimationFrame(schritt);
  }, [kurve, stopp, z.tag]);

  const a = useMemo(
    () => ({
      setDachart: (id) => aendern({ dachart: id }),
      setPreset: (id) => {
        const h = HALLEN_PRESETS.find((x) => x.id === id);
        if (h) aendern({ laengeM: h.laengeM, breiteM: h.breiteM });
      },
      setLaenge: (v) => proBild({ laengeM: v }),
      setBreite: (v) => proBild({ breiteM: v }),
      setRand: (v) => proBild({ randPct: v }),
      setHindernis: (v) => proBild({ hindernisPct: v }),
      setTag: (id) => {
        stopp();
        aendern({ tag: id });
      },
      setZeit: (v) => {
        stopp();
        proBild({ zeitMin: v });
      },
      setOrt: (id) => {
        stopp();
        aendern({ ortId: id });
      },
    }),
    [aendern, proBild, stopp],
  );

  // Erkenntnis beim ersten Wechsel Ost-West ↔ Süd
  useEffect(() => {
    const von = vorher.current;
    vorher.current = z.dachart;
    if (von === z.dachart || !beruehrt.current) return;
    const paar = (von === "ost-west" && z.dachart === "sued") || (von === "sued" && z.dachart === "ost-west");
    if (paar && !erkenntnisAn) {
      setErkenntnisAn(true);
      steckbrief.erkenntnis("k2-ostwest");
      ereignis("erkenntnis", { id: "k2-ostwest" });
    }
  }, [z.dachart, erkenntnisAn]);

  // Kopplung an Daten (K3/K5) und Steckbrief – 400 ms entprellt, nur nach eigener Bedienung
  useEffect(() => {
    if (!beruehrt.current) return undefined;
    const t = setTimeout(() => {
      pvSetzen(z.ortId, AUSRICHTUNG_FUER_DACHART[z.dachart]);
      steckbrief.setze({ dachart: z.dachart, laengeM: z.laengeM, breiteM: z.breiteM, flaecheQm: w.brutto, kwpMax: w.kwp, ortId: z.ortId }, "k2");
    }, 400);
    return () => clearTimeout(t);
  }, [z.dachart, z.ortId, z.laengeM, z.breiteM, w.brutto, w.kwp]);

  // Nutzfläche an den Ausgang (Rechner-Link) – entprellt wie die Kopplung, auch ohne Bedienung
  useEffect(() => {
    const t = setTimeout(() => k2AusgangSetzen({ netto: Math.round(w.netto) }), 400);
    return () => clearTimeout(t);
  }, [w.netto]);

  // ------------------------------------------------------------------------------------ 3D oder Rückfall
  const modus = webgl === null ? "pruefen" : webgl && !schwach && !fehler3d ? "3d" : "svg";
  useEffect(() => {
    if (!bereit3d) return undefined;
    const t = setTimeout(() => setSvgWeg(true), ruhig ? 0 : 650);
    return () => clearTimeout(t);
  }, [bereit3d, ruhig]);
  const zeigeSvg = modus !== "3d" || !svgWeg;
  useEffect(() => {
    svgModus.current = modus !== "3d";
  }, [modus]);
  const dreh3d = modus === "3d" && bereit3d;

  const tasten = useTastenRegler({ wert: dreh, setWert: setDreh, min: -ANSICHT.drehung, max: ANSICHT.drehung, schritt: 5, grob: 10, achse: "x" });

  const szene = (
    <>
      {zeigeSvg && (
        <K2IsoSvg
          plan={plan}
          dachart={z.dachart}
          sonne={sonne}
          bogen={bogen}
          qmProKwp={qm[z.dachart]}
          kennung="k2live"
          pfeil={modus === "svg"}
          className="absolute inset-0 h-full w-full"
        />
      )}
      {modus === "3d" && (
        <Szene3D
          plan={plan}
          dachart={z.dachart}
          sonne={sonne}
          bogen={bogen}
          drehung={dreh}
          mobil={mobil}
          ruhig={ruhig}
          onBereit={() => setBereit3d(true)}
          onFehler={() => {
            setFehler3d(true);
            setBereit3d(false);
            setSvgWeg(false);
          }}
          onDrehung={setDreh}
          onGezogen={() => setGezogen(true)}
          onAnsicht={(g) => kompassFn.current?.(Math.round(g * 2) / 2)}
        />
      )}
    </>
  );

  const szeneHinweis = dreh3d ? (
    <p
      id="k2-dreh-hinweis"
      className={[
        "pointer-events-none absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-[11.5px] font-medium leading-none text-ink-600 backdrop-blur-sm transition-opacity duration-500 motion-reduce:transition-none md:bottom-4 md:right-4",
        gezogen ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <svg viewBox="0 0 20 10" className="h-2.5 w-5" aria-hidden="true">
        <path d="M1 5h18M5 1L1 5l4 4M15 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="min-[360px]:hidden">Wischen dreht</span>
      <span className="hidden min-[360px]:inline md:hidden">Seitlich wischen dreht</span>
      <span className="hidden md:inline">Ziehen oder Pfeiltasten drehen die Ansicht</span>
    </p>
  ) : null;

  // ------------------------------------------------------------------------------------ Erkenntnis
  const ow = proDachart["ost-west"];
  const sued = proDachart.sued;
  const quelle = daten.quelle === "eigen" ? "eigen" : "beispiel";
  const pvPasst = daten.status === "bereit" && !daten.pvLaedt && daten.pv && daten.ortId === z.ortId && daten.ausrichtung === AUSRICHTUNG_FUER_DACHART[z.dachart];
  // Empfehlung aus dem Lastgang je Quelle, Ort und Ausrichtung merken – so nennt der Satz bei Süd, Trapez und
  // Shed die Ost-West-Zahl daneben (Seitenzahl 280 kWp = Beispielbetrieb, Linz, Ost-West).
  const [empfMerk, setEmpfMerk] = useState(() => (empfehlungKwp ? { "beispiel:linz:ostwest": empfehlungKwp } : {}));
  const schluessel = `${quelle}:${z.ortId}:${AUSRICHTUNG_FUER_DACHART[z.dachart]}`;
  const empfLive = pvPasst ? daten.pv.empfehlung.kwp : null;
  useEffect(() => {
    if (empfLive != null) setEmpfMerk((alt) => (alt[schluessel] === empfLive ? alt : { ...alt, [schluessel]: empfLive }));
  }, [empfLive, schluessel]);
  const empf = empfLive ?? empfMerk[schluessel] ?? null;
  const empfOw = z.dachart === "ost-west" ? null : (empfMerk[`${quelle}:${z.ortId}:ostwest`] ?? null);
  const bezug = quelle === "eigen" ? "bei Ihrem Lastgang" : "im Beispiel";
  const kapitel3 = (
    <a href="#eigenverbrauch" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
      Kapitel 03
    </a>
  );
  const bei = z.dachart === "ost-west" ? "" : ` ${BEI[z.dachart]}`;
  const klammer = empfOw && empfOw !== empf ? <>(Ost-West: {zahl(empfOw)} kWp · {kapitel3})</> : <>({kapitel3})</>;
  let satz2;
  if (empf && empf > w.kwp) {
    satz2 = (
      <>
        Sinnvoll ist, was der Lastgang braucht – {bezug} ≈ {zahl(empf)} kWp{bei} {klammer}. Mit {DACH_INFO[z.dachart].kurz} passen auf diese Halle nur ≈ {zahl(w.kwp)} kWp.
      </>
    );
  } else if (empf) {
    satz2 = (
      <>
        Sinnvoll ist, was der Lastgang braucht – {bezug} ≈ {zahl(empf)} kWp{bei} {klammer}, nicht das ganze Dach.
      </>
    );
  } else {
    satz2 = <>Sinnvoll ist, was der Lastgang braucht – das rechnet {kapitel3} mit dem Lastgang des Betriebs.</>;
  }

  const erkenntnis = (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {erkenntnisAn ? (
          <m.div
            key="erkenntnis"
            data-erkenntnis="k2-ostwest"
            initial={{ opacity: 0, y: BEWEGUNG.weg }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: BEWEGUNG.dauer.lang, ease: BEWEGUNG.ease.aus }}
            className="rounded-[20px] bg-white px-4 py-4 shadow-[0_14px_34px_-22px_rgba(21,26,36,0.25)] md:rounded-[22px] md:px-7 md:py-6 lg:px-5 lg:py-5"
          >
            <Erkenntnis className="max-md:text-[16px] max-[359px]:text-[15px] lg:text-[18px]">
              Gleiche Halle: Ost-West bringt ≈ <Zahl wert={ow.kwp} /> statt <Zahl wert={sued.kwp} /> kWp<span className="max-md:hidden"> aufs Dach</span> und ≈{" "}
              <Zahl wert={ow.mwh} /> statt <Zahl wert={sued.mwh} /> MWh<span className="max-md:hidden"> im Jahr</span> – jedes Modul erntet weniger, das Dach mehr.
            </Erkenntnis>
            <p className="mt-1.5 max-w-[72ch] pl-5 text-[13.5px] leading-snug text-ink-600 md:mt-2.5 md:text-[15px] md:leading-relaxed lg:text-[14px] lg:leading-snug">{satz2}</p>
          </m.div>
        ) : (
          <m.div key="platz" exit={{ opacity: 0 }} transition={{ duration: BEWEGUNG.dauer.kurz }}>
            <ErkenntnisPlatz />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <K2Pult
          z={z}
          w={w}
          proDachart={proDachart}
          dacharten={dacharten}
          orte={orte}
          ort={ort}
          sonne={sonne}
          kurve={kurve}
          caption={ansage}
          pvgis={pvgis}
          erkenntnis={erkenntnis}
          szene={szene}
          szeneHinweis={szeneHinweis}
          szeneTasten={dreh3d ? { tabIndex: 0, onKeyDown: tasten, "aria-describedby": "k2-dreh-hinweis", "data-testid": "dach-szene" } : { "data-testid": "dach-szene" }}
          kompass={<KompassLive abo={kompassAbo} />}
          spielKnopf={<SpielKnopf spielt={spielt} onClick={abspielen} kurz={sonnenTag(z.tag).label} />}
          spielt={spielt}
          erkenntnisAn={erkenntnisAn}
          a={a}
          Z={Zahl}
        />
      </MotionConfig>
    </LazyMotion>
  );
}
