"use client";

import { useCallback, useDeferredValue, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  BatteryCharging,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileUp,
  Gauge,
  Loader2,
  MonitorSmartphone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Timer,
  Trash2,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter } from "@/components/Rechner/bausteine";
import { DiagrammKarte, GewerbeStil, Hinweis, Karte, Liste, Umschalter } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { Dauerlinie, FARBE, Heatmap, Legende, Monate, PvKurve, Tagesgang, Wochentage } from "./Diagramme";
import { EINHEITEN, LastgangFehler, dekodiere, leseLastgang } from "@/lib/lastgang/parser";
import { analysiere } from "@/lib/lastgang/analyse";
import { AUSRICHTUNGEN, empfehlung, kurve, pvProfil, simuliere } from "@/lib/lastgang/pv";
import { ersparnisLeistungspreis, schwellenBereich, speicherFuerSchwelle } from "@/lib/lastgang/peak";
import { datum, datumZeit, energie, leistung, prozent, zahl } from "@/lib/lastgang/format";
import { NETZBEREICHE, PS_ANNAHMEN, netzpreise } from "@/lib/rechner/peakshaving";
import { angebotUrl } from "@/lib/rechner/angebot";

const BEISPIEL = "/beispiele/lastgang-beispiel.csv";

/**
 * Lastgang-Analyse im Browser. Die Datei wird mit der File-API gelesen und ausschließlich hier
 * ausgewertet – es gibt in dieser Komponente keinen Upload, keinen fetch() mit Nutzerdaten und
 * keine Speicherung (auch nicht im localStorage). Einzige Netzwerkanfrage: das Laden der
 * Beispieldatei, wenn der Besucher sie ausdrücklich anfordert.
 *
 * props: orte – [{ land, name, orte: [{ slug, name, lat, lon, monate_sued35, sued35_kwh_kwp, … }] }]
 */
export default function LastgangAnalyse({ orte, startOrt = "ostermiething" }) {
  const textRef = useRef(null);
  const [datei, setDatei] = useState(null); // { name, groesse, beispiel }
  const [optionen, setOptionen] = useState({ einheit: "auto", spalte: null });
  const [lg, setLg] = useState(null);
  const [fehler, setFehler] = useState(null);
  const [laedt, setLaedt] = useState(false);

  const auswerten = useCallback((text, opt) => {
    setLaedt(true);
    setFehler(null);
    // kurz Zeit zum Zeichnen des Ladezustands lassen
    setTimeout(() => {
      try {
        setLg(leseLastgang(text, opt));
      } catch (e) {
        setLg(null);
        setFehler(e instanceof LastgangFehler ? e.message : "Die Datei konnte nicht gelesen werden. Bitte prüfen Sie, ob es eine CSV- oder Textdatei mit Viertelstundenwerten ist.");
      } finally {
        setLaedt(false);
      }
    }, 30);
  }, []);

  const ladeBytes = useCallback(
    (bytes, meta) => {
      try {
        const text = dekodiere(bytes);
        textRef.current = text;
        const opt = { einheit: "auto", spalte: null };
        setOptionen(opt);
        setDatei(meta);
        auswerten(text, opt);
      } catch (e) {
        setLg(null);
        setDatei(meta);
        setFehler(e instanceof LastgangFehler ? e.message : "Die Datei konnte nicht gelesen werden.");
      }
    },
    [auswerten]
  );

  const ladeDatei = useCallback(
    async (file) => {
      if (!file) return;
      setLaedt(true);
      try {
        const buf = await file.arrayBuffer();
        ladeBytes(new Uint8Array(buf), { name: file.name, groesse: file.size, beispiel: false });
      } catch {
        setFehler("Die Datei konnte nicht geöffnet werden.");
      } finally {
        setLaedt(false);
      }
    },
    [ladeBytes]
  );

  const ladeBeispiel = useCallback(async () => {
    setLaedt(true);
    try {
      const r = await fetch(BEISPIEL);
      if (!r.ok) throw new Error();
      const buf = await r.arrayBuffer();
      ladeBytes(new Uint8Array(buf), { name: "lastgang-beispiel.csv (synthetisch)", groesse: buf.byteLength, beispiel: true });
    } catch {
      setFehler("Die Beispieldatei konnte nicht geladen werden. Bitte versuchen Sie es erneut.");
      setLaedt(false);
    }
  }, [ladeBytes]);

  const verwerfen = () => {
    textRef.current = null;
    setDatei(null);
    setLg(null);
    setFehler(null);
    setOptionen({ einheit: "auto", spalte: null });
  };

  const setzeOption = (neu) => {
    const opt = { ...optionen, ...neu };
    setOptionen(opt);
    if (textRef.current) auswerten(textRef.current, opt);
  };

  return (
    <Karte>
      <GewerbeStil />
      {!lg ? (
        <Start onDatei={ladeDatei} onBeispiel={ladeBeispiel} laedt={laedt} fehler={fehler} datei={datei} />
      ) : (
        <Ergebnis
          key={`${datei?.name}-${optionen.einheit}-${optionen.spalte}-${lg.kwh.length}`}
          lg={lg}
          datei={datei}
          optionen={optionen}
          setzeOption={setzeOption}
          laedt={laedt}
          onDatei={ladeDatei}
          onVerwerfen={verwerfen}
          orte={orte}
          startOrt={startOrt}
        />
      )}
    </Karte>
  );
}

/* ================================================================
   Startansicht: Datei wählen, Datenschutz
   ================================================================ */

function Dropzone({ onDatei, laedt, kompakt = false }) {
  const id = useId();
  const [ueber, setUeber] = useState(false);
  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setUeber(true);
      }}
      onDragLeave={() => setUeber(false)}
      onDrop={(e) => {
        e.preventDefault();
        setUeber(false);
        onDatei(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ov-500 has-[:focus-visible]:ring-offset-2",
        kompakt ? "min-h-12 flex-row gap-2 rounded-full border px-4 py-2" : "min-h-[260px] px-6 py-10",
        ueber ? "border-ov-500 bg-ov-50" : "border-ink-300 bg-white hover:border-ov-400 hover:bg-ov-50/40"
      )}
    >
      <input
        id={id}
        type="file"
        accept=".csv,.txt,.tsv,text/csv,text/plain"
        className="sr-only"
        onChange={(e) => {
          onDatei(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {kompakt ? (
        <>
          <FileUp aria-hidden="true" className="h-4 w-4 text-ov-600" />
          <span className="text-[14px] font-semibold text-ink-800">Andere Datei</span>
        </>
      ) : (
        <>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ov-600 text-white shadow-[0_12px_30px_-12px_rgba(102,153,51,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5">
            {laedt ? <Loader2 aria-hidden="true" className="h-7 w-7 motion-safe:animate-spin" /> : <FileUp aria-hidden="true" className="h-7 w-7" />}
          </span>
          <span className="mt-5 font-display text-[20px] font-extrabold tracking-tight text-ink-900">
            {laedt ? "Wird ausgewertet …" : "Lastgang-Datei hierher ziehen"}
          </span>
          <span className="mt-1.5 text-[14.5px] text-ink-600">
            oder <span className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">Datei auswählen</span> – CSV oder TXT, 15-Minuten-Werte
          </span>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-800 ring-1 ring-ov-200">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Bleibt auf Ihrem Gerät – kein Upload
          </span>
        </>
      )}
    </label>
  );
}

function Start({ onDatei, onBeispiel, laedt, fehler, datei }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="p-5 sm:p-6 md:p-8">
        <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Lastgang auswerten</h2>
        <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-ink-600">
          Exportieren Sie im Portal Ihres Netzbetreibers die Viertelstundenwerte (Bezug) der letzten zwölf Monate als CSV und legen Sie die Datei hier ab.
        </p>
        <div className="mt-6">
          <Dropzone onDatei={onDatei} laedt={laedt} />
        </div>
        {fehler && (
          <div role="alert" className="mt-4 flex gap-3 rounded-2xl bg-sun-300/15 px-4 py-3.5 text-[14px] leading-relaxed text-ink-800 ring-1 ring-sun-400/50">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
            <div className="min-w-0">
              <p className="font-semibold text-ink-900">{datei?.name ? `„${datei.name}“ konnte nicht ausgewertet werden` : "Die Datei konnte nicht ausgewertet werden"}</p>
              <p className="mt-0.5">{fehler}</p>
              <p className="mt-1.5 text-[13px] text-ink-600">
                Tipp: Öffnen Sie die Datei mit einem Texteditor – je Zeile sollten ein Zeitstempel und ein Messwert stehen. Klappt es nicht, schicken Sie uns die Datei mit Ihrer Anfrage; wir werten sie für Sie aus.
              </p>
            </div>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" icon={Sparkles} onClick={onBeispiel} disabled={laedt}>
            Beispiel-Lastgang laden
          </Button>
          <a href={BEISPIEL} download className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold text-ink-600 underline decoration-ink-300 underline-offset-4 hover:text-ink-900">
            <Download aria-hidden="true" className="h-4 w-4" />
            Beispiel-CSV herunterladen
          </a>
        </div>
        <p className="mt-2 text-[12.5px] text-ink-500">Das Beispiel ist ein synthetischer, frei erfundener Gewerbebetrieb (zwei Schichten, 2025) – keine echten Messdaten.</p>
      </div>

      <aside aria-labelledby="lg-datenschutz" className="relative overflow-hidden border-t border-white/10 bg-navy-950 p-5 text-white sm:p-6 md:p-8 lg:border-l lg:border-t-0">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ov-500/25 blur-[90px]" />
        <div className="relative">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500 text-white">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <h2 id="lg-datenschutz" className="mt-5 font-display text-[21px] font-extrabold leading-snug tracking-tight">
            Ihre Messdaten verlassen Ihren Browser nicht.
          </h2>
          <ul className="mt-5 space-y-3.5 text-[14.5px] leading-relaxed text-white/80">
            {[
              [MonitorSmartphone, "Die Auswertung läuft vollständig auf Ihrem Gerät, im Browser. Die Datei wird nicht an unseren oder einen anderen Server übertragen."],
              [Trash2, "Nichts wird gespeichert – weder auf dem Server noch im Browser. Tab schließen oder „Daten verwerfen“, und alles ist weg."],
              [Activity, "Prüfbar: Nach dem Laden der Seite funktioniert die Analyse auch offline, und im Netzwerk-Tab Ihres Browsers erscheint beim Auswerten keine Anfrage."],
              [FileSpreadsheet, "Ins Angebot übernehmen Sie nur, was Sie wollen: Jahresverbrauch, Anlagengröße und Speicher – als drei Zahlen im Link."],
            ].map(([Icon, text]) => (
              <li key={text} className="flex gap-3">
                <Icon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-300" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* ================================================================
   Ergebnis
   ================================================================ */

function Abschnitt({ nummer, titel, lead, children, id }) {
  return (
    <section aria-labelledby={id} className="border-t border-ink-100 px-5 py-8 sm:px-6 md:px-8 md:py-10">
      <div className="mb-6 flex items-start gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-900 font-display text-[14px] font-extrabold text-white">{nummer}</span>
        <div className="min-w-0">
          <h3 id={id} className="font-display text-[20px] font-extrabold tracking-tight text-ink-900 md:text-[23px]">
            {titel}
          </h3>
          {lead && <p className="mt-1 max-w-3xl text-[14px] leading-relaxed text-ink-600">{lead}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function OrtWahl({ orte, wert, onChange }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-[14.5px] font-semibold text-ink-800">
        Standort (PVGIS-Daten)
      </label>
      <div className="relative">
        <select
          id={id}
          value={wert}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-2xl bg-white pl-4 pr-10 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:ring-ink-300 focus:outline-none focus:ring-2 focus:ring-ov-500"
        >
          {orte.map((g) => (
            <optgroup key={g.land} label={g.name}>
              {g.orte.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Ergebnis({ lg, datei, optionen, setzeOption, laedt, onDatei, onVerwerfen, orte, startOrt }) {
  const a = useMemo(() => analysiere(lg), [lg]);
  const alleOrte = useMemo(() => orte.flatMap((g) => g.orte), [orte]);

  // ---------- PV ----------
  const [ortSlug, setOrtSlug] = useState(alleOrte.some((o) => o.slug === startOrt) ? startOrt : alleOrte[0]?.slug);
  const [ausr, setAusr] = useState("sued");
  const [ziel, setZiel] = useState(80);
  const [kwpWahl, setKwpWahl] = useState(null);
  const ort = alleOrte.find((o) => o.slug === ortSlug) || alleOrte[0];
  const zielVerz = useDeferredValue(ziel);
  const pv = useMemo(() => pvProfil(lg, ort, ausr), [lg, ort, ausr]);
  const emp = useMemo(() => empfehlung(lg.kwh, pv.pv, a.jahresverbrauch, pv.jahresErtrag, zielVerz / 100), [lg, pv, a.jahresverbrauch, zielVerz]);
  const kurvenMax = Math.max(20, Math.min(emp.kwpMax, Math.max(emp.kwp * 3, 50)));
  const punkte = useMemo(() => kurve(lg.kwh, pv.pv, kurvenMax, 40), [lg, pv, kurvenMax]);
  const kwpReglerMax = Math.max(10, Math.ceil(kurvenMax / 10) * 10);
  const kwp = Math.min(kwpWahl ?? emp.kwp, kwpReglerMax);
  const kwpVerz = useDeferredValue(kwp);
  const sim = useMemo(() => simuliere(lg.kwh, pv.pv, kwpVerz), [lg, pv, kwpVerz]);
  const ertragJahr = kwp * pv.jahresErtrag;
  const evJahr = ertragJahr * sim.evQuote;

  // ---------- Peak Shaving ----------
  const bereichPs = schwellenBereich(a);
  const [schwelleWahl, setSchwelle] = useState(null);
  const schwelle = Math.min(bereichPs.max, Math.max(bereichPs.min, schwelleWahl ?? bereichPs.standard));
  const schwelleVerz = useDeferredValue(schwelle);
  const [bereich, setBereich] = useState("ooe");
  const [ne, setNe] = useState(a.spitze.kw > 250 ? 6 : 7);
  const netz = netzpreise(bereich, ne);
  const ps = useMemo(() => speicherFuerSchwelle(a.kw, lg.intervall, schwelleVerz), [a, lg.intervall, schwelleVerz]);
  const lp = ersparnisLeistungspreis(a.monate, schwelleVerz, netz.lp);
  const leistungsgemessen = a.jahresverbrauch > PS_ANNAHMEN.messpflichtKwh || a.spitze.kw > PS_ANNAHMEN.messpflichtKw;

  // ---------- Angebot ----------
  const [mitSpeicher, setMitSpeicher] = useState(false);
  const link = angebotUrl({ objekt: "gewerbe", kwp, verbrauch: a.jahresverbrauch, speicher: mitSpeicher && ps.moeglich ? ps.nennKwh : 0 });

  const [tgSicht, setTgSicht] = useState("alle");
  const sichtbar = tgSicht === "alle" ? ["werktag", "samstag", "sonntag"] : ["werktag", "max"];
  const einheitOptionen = [{ id: "auto", label: `Automatisch (${EINHEITEN[lg.einheit].label})` }, ...Object.entries(EINHEITEN).map(([id, e]) => ({ id, label: e.label }))];

  return (
    <div className={cn(laedt && "opacity-60 transition-opacity")}>
      <p className="sr-only" aria-live="polite">
        {`Auswertung fertig: Jahresverbrauch ${zahl(a.jahresverbrauch)} Kilowattstunden, Spitzenlast ${zahl(a.spitze.kw)} Kilowatt, empfohlene PV-Anlage ${zahl(emp.kwp)} Kilowatt-Peak.`}
      </p>

      {/* ---------- Kopf: Datei, Erkennung, Optionen ---------- */}
      <div className="bg-sand-50 px-5 py-6 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Ihre Auswertung</p>
            <h2 className="mt-1 break-words font-display text-[21px] font-extrabold tracking-tight text-ink-900 md:text-[25px]">{datei?.name}</h2>
            <p className="mt-1 text-[13.5px] text-ink-600">
              {datum(a.von)} bis {datum(a.bis - 1)} · {zahl(a.n)} Werte à {lg.intervall} Minuten
              {a.fehlend > 0 ? ` · ${zahl(a.fehlend)} fehlen` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dropzone onDatei={onDatei} laedt={laedt} kompakt />
            <button
              type="button"
              onClick={onVerwerfen}
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-[14px] font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-white hover:text-ink-900"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Daten verwerfen
            </button>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2 text-[12.5px]" aria-label="Erkanntes Dateiformat">
          {[
            `Trennzeichen: ${lg.erkannt.trenner}`,
            `Dezimal: ${lg.erkannt.dezimal}`,
            lg.erkannt.zeitformat,
            `Zeitstempel = ${lg.erkannt.zeitstempel}`,
            `Werte: „${lg.erkannt.wertspalte}“`,
          ].map((t) => (
            <li key={t} className="rounded-full bg-white px-3 py-1 text-ink-600 ring-1 ring-ink-200/80">
              {t}
            </li>
          ))}
        </ul>

        <div className={cn("mt-5 grid gap-4", lg.spalten.length > 1 ? "md:grid-cols-2" : "md:max-w-md")}>
          <Liste label="Einheit der Werte" wert={optionen.einheit} onChange={(v) => setzeOption({ einheit: v })} optionen={einheitOptionen} />
          {lg.spalten.length > 1 && (
            <Liste
              label="Wertspalte"
              wert={String(optionen.spalte ?? lg.spalte)}
              onChange={(v) => setzeOption({ spalte: Number(v) })}
              optionen={lg.spalten.map((s) => ({ id: String(s.index), label: s.name }))}
            />
          )}
        </div>

        {(lg.hinweise.length > 0 || a.hochgerechnet || datei?.beispiel) && (
          <div className="mt-5 space-y-2">
            {datei?.beispiel && (
              <Hinweis ton="gruen" titel="Synthetischer Beispiel-Lastgang">
                Frei erfundener Gewerbebetrieb zum Ausprobieren – keine echten Messdaten. Laden Sie Ihre eigene Datei für Ihre Werte.
              </Hinweis>
            )}
            {a.hochgerechnet && (
              <Hinweis ton="warn" titel="Weniger als ein Jahr Daten">
                Die Datei deckt rund {zahl(a.tage)} Tage ab. Jahresverbrauch und Erträge sind hochgerechnet; saisonale Effekte (Winter/Sommer) können fehlen – ideal sind zwölf volle Monate.
              </Hinweis>
            )}
            {lg.hinweise.map((h) => (
              <Hinweis key={h}>{h}</Hinweis>
            ))}
          </div>
        )}
      </div>

      {/* ---------- 1 Kennzahlen & Lastprofil ---------- */}
      <Abschnitt nummer="1" id="lg-profil" titel="Kennzahlen & Lastprofil" lead="Richtwerte aus Ihren Messwerten. Leistung = mittlere Leistung je Viertelstunde (so misst auch der Netzbetreiber die Spitze).">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Kennzahl ton="gruen" label={a.hochgerechnet ? "Jahresverbrauch (hochgerechnet)" : "Jahresverbrauch"} icon={Zap} zusatz={a.hochgerechnet ? `gemessen: ${zahl(a.summe)} kWh in ${zahl(a.tage)} Tagen` : `${zahl(a.jahresverbrauch)} kWh · ${zahl(a.tage)} Tage`}>
            {energie(a.jahresverbrauch)}
          </Kennzahl>
          <Kennzahl ton="navy" label="Spitzenlast" icon={Gauge} zusatz={datumZeit(a.spitze.t)}>
            {leistung(a.spitze.kw)}
          </Kennzahl>
          <Kennzahl label="Grundlast" icon={Timer} zusatz={`≈ ${prozent(a.grundlastAnteil)} des Verbrauchs`}>
            {leistung(a.grundlast)}
          </Kennzahl>
          <Kennzahl label="Mittlere Last" icon={Activity} zusatz={`Lastfaktor ${zahl(a.lastfaktor * 100)} %`}>
            {leistung(a.mittelKw)}
          </Kennzahl>
          <Kennzahl label="Benutzungsdauer" icon={CalendarDays} zusatz="Jahresverbrauch ÷ Spitze">
            {zahl(a.benutzungsdauer)} h
          </Kennzahl>
          <Kennzahl label="Mittel der Monatsspitzen" icon={Gauge} zusatz="Basis Leistungspreis (bis 2026)">
            {leistung(a.mittelMonatsspitze)}
          </Kennzahl>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <DiagrammKarte
            titel="Tagesgang"
            unter="Mittlere Leistung je Uhrzeit – Feiertage zählen als Sonntag"
            rechts={
              <Umschalter
                label="Ansicht Tagesgang"
                wert={tgSicht}
                onChange={setTgSicht}
                optionen={[
                  { id: "alle", label: "Tagtypen" },
                  { id: "max", label: "Werktag + Maximum" },
                ]}
              />
            }
          >
            <Tagesgang tagesgang={a.tagesgang} sichtbar={sichtbar} />
            <Legende
              eintraege={
                tgSicht === "alle"
                  ? [
                      { label: "Werktag (Mo–Fr)", farbe: FARBE.werktag },
                      { label: "Samstag", farbe: FARBE.samstag },
                      { label: "Sonn- und Feiertag", farbe: FARBE.sonntag },
                    ]
                  : [
                      { label: "Werktag, Mittel", farbe: FARBE.werktag },
                      { label: "Werktag, höchster Wert", farbe: FARBE.spitze },
                    ]
              }
            />
          </DiagrammKarte>
          <DiagrammKarte titel="Wochentage" unter={`Mittlerer Verbrauch je Tag · Wochenende/Feiertag: ${prozent(a.anteilFrei)} der Energie`}>
            <Wochentage wochentage={a.wochentage} />
          </DiagrammKarte>
        </div>

        <DiagrammKarte className="mt-5" titel="Monate" unter="Balken: Verbrauch · Linie: höchste Viertelstunde des Monats (Leistungspreis)">
          <Monate monate={a.monate} />
          <Legende
            eintraege={[
              { label: "Verbrauch (MWh)", farbe: FARBE.werktag },
              { label: "Monatsspitze (kW)", farbe: FARBE.spitze },
              ...(a.monate.some((m) => m.abdeckung < 0.9) ? [{ label: "Monat unvollständig", farbe: FARBE.werktag, blass: true }] : []),
            ]}
          />
        </DiagrammKarte>

        <DiagrammKarte className="mt-5" titel="Jahres-Heatmap" unter="Jede Spalte ein Tag, von oben 0 Uhr bis unten 24 Uhr – Schichten, Wochenenden, Urlaube und Spitzen auf einen Blick">
          <div className="pt-4">
            <Heatmap heat={a.heat} />
          </div>
        </DiagrammKarte>

        <div className="mt-5 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
          <h4 className="font-display text-[16px] font-bold text-ink-900">Die fünf höchsten Viertelstunden (an verschiedenen Tagen)</h4>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {a.topSpitzen.map((s, i) => (
              <li key={s.t} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-200/70">
                <span className="text-[12px] font-semibold text-ink-500">#{i + 1}</span>
                <span className="ov-num block font-display text-[18px] font-extrabold text-ink-900">{leistung(s.kw)}</span>
                <span className="block text-[12.5px] text-ink-600">{datumZeit(s.t)}</span>
              </li>
            ))}
          </ol>
        </div>
      </Abschnitt>

      {/* ---------- 2 PV-Größe ---------- */}
      <Abschnitt
        nummer="2"
        id="lg-pv"
        titel="PV-Größe für hohen Eigenverbrauch"
        lead="Viertelstundengenaue Simulation: typisches PV-Profil je Monat (PVGIS-Monatswerte für den gewählten Ort, Tagesverlauf aus dem Sonnenstand) gegen Ihren Lastgang – ohne Speicher."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
          <Gruppe>
            <OrtWahl
              orte={orte}
              wert={ortSlug}
              onChange={(v) => {
                setOrtSlug(v);
                setKwpWahl(null);
              }}
            />
            <Auswahl
              legende="Ausrichtung"
              wert={ausr}
              klein
              onChange={(v) => {
                setAusr(v);
                setKwpWahl(null);
              }}
              optionen={AUSRICHTUNGEN.map((o) => ({ id: o.id, label: o.kurz, sub: `${zahl(ort[o.schluessel])} kWh/kWp` }))}
            />
            <Regler
              label="Ziel: Eigenverbrauchsanteil"
              wert={ziel}
              min={60}
              max={95}
              step={5}
              format={(v) => `${v} %`}
              onChange={(v) => {
                setZiel(v);
                setKwpWahl(null);
              }}
              hinweis="Anteil des PV-Stroms, den Ihr Betrieb selbst verbraucht. Höher = kleinere Anlage, weniger Einspeisung."
            />
            <Regler
              label="Anlagengröße prüfen"
              wert={kwp}
              min={0}
              max={kwpReglerMax}
              step={kwpReglerMax > 400 ? 10 : kwpReglerMax > 100 ? 5 : 1}
              format={(v) => `${zahl(v)} kWp`}
              onChange={(v) => setKwpWahl(Math.max(1, v))}
            />
            {kwpWahl != null && kwpWahl !== emp.kwp && (
              <button type="button" onClick={() => setKwpWahl(null)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink-900 px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-ov-600">
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Empfehlung {zahl(emp.kwp)} kWp übernehmen
              </button>
            )}
          </Gruppe>

          <div className="min-w-0 space-y-5">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Kennzahl ton="gruen" label={kwpWahl == null || kwpWahl === emp.kwp ? "Empfehlung" : "Gewählt"} icon={Sun} zusatz={`Ziel ≥ ${ziel} % Eigenverbrauch`}>
                {zahl(kwp)} kWp
              </Kennzahl>
              <Kennzahl label="Eigenverbrauchsanteil" zusatz="vom PV-Strom">
                {prozent(sim.evQuote)}
              </Kennzahl>
              <Kennzahl label="Autarkiegrad" zusatz="vom Verbrauch">
                {prozent(sim.autarkie)}
              </Kennzahl>
              <Kennzahl label="PV-Ertrag/Jahr" zusatz={`davon ${energie(ertragJahr - evJahr)} Einspeisung`}>
                {energie(ertragJahr)}
              </Kennzahl>
            </div>
            <DiagrammKarte titel="Eigenverbrauch und Autarkie nach Anlagengröße" unter={`${ort.name} · ${AUSRICHTUNGEN.find((o) => o.id === ausr).label} · ohne Speicher`}>
              <PvKurve punkte={punkte} kwp={kwp} ziel={ziel / 100} />
              <Legende
                eintraege={[
                  { label: "Eigenverbrauchsanteil", farbe: FARBE.werktag },
                  { label: "Autarkiegrad", farbe: FARBE.samstag },
                ]}
              />
            </DiagrammKarte>
            {emp.begrenzt && <Hinweis>Selbst eine Anlage mit dem 1,5-Fachen Ihres Jahresverbrauchs erreicht noch das Ziel – die Größe begrenzt dann eher die Dachfläche als der Eigenverbrauch.</Hinweis>}
            <Hinweis ton="recht">
              Richtwert ohne Dachprüfung: Wie viel Leistung auf Ihr Dach passt, klären Statik, Verschattung und Netzanschluss. Das Wetter ist eine typische Folge sonniger und trüber Tage, nicht das Wetter Ihres Messjahres.
            </Hinweis>
          </div>
        </div>
      </Abschnitt>

      {/* ---------- 3 Peak Shaving ---------- */}
      <Abschnitt
        nummer="3"
        id="lg-peak"
        titel="Peak-Shaving-Potenzial"
        lead="Wie groß müsste ein Speicher sein, um Ihre Spitze auf ein Ziel zu kappen? Simuliert über alle Viertelstunden, mit Nachladen aus dem Netz unterhalb des Ziels."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
          <Gruppe>
            <Regler
              label="Spitze kappen auf"
              wert={schwelle}
              min={bereichPs.min}
              max={bereichPs.max}
              step={bereichPs.schritt}
              format={(v) => `${zahl(v)} kW`}
              onChange={setSchwelle}
              hinweis={`−${zahl(a.spitze.kw - schwelle)} kW (${prozent((a.spitze.kw - schwelle) / a.spitze.kw)}) gegenüber Ihrer Jahresspitze`}
            />
            <Liste
              label="Netzbereich"
              wert={bereich}
              onChange={setBereich}
              optionen={NETZBEREICHE.map((b) => ({ id: b.id, label: `${b.label} · ${b.betreiber}` }))}
            />
            <Auswahl
              legende="Netzebene (siehe Netzrechnung)"
              wert={ne}
              onChange={setNe}
              optionen={[5, 6, 7].map((n) => ({ id: n, label: `NE ${n}`, sub: `${zahl(netzpreise(bereich, n).lp, 2)} €/kW` }))}
            />
          </Gruppe>

          <div className="min-w-0 space-y-5">
            {ps.moeglich ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Kennzahl ton="navy" label="Speicherleistung" icon={Zap} zusatz="Entladeleistung">
                  {ps.leistungKw > 0 ? `${zahl(ps.leistungKw)} kW` : "–"}
                </Kennzahl>
                <Kennzahl ton="navy" label="Speicherkapazität" icon={BatteryCharging} zusatz={`nutzbar nötig: ${zahl(ps.nutzbarKwh)} kWh`}>
                  {ps.nennKwh > 0 ? `${zahl(ps.nennKwh)} kWh` : "–"}
                </Kennzahl>
                <Kennzahl label="Tage mit Einsatz" zusatz={`${zahl((ps.intervalleUeber * lg.intervall) / 60, 1)} h über dem Ziel`}>
                  {zahl(ps.tageMitEingriff)}
                </Kennzahl>
                <Kennzahl ton="gruen" label="Leistungspreis/Jahr" zusatz={`−${zahl(lp.senkungKw, 1)} kW im Monatsmittel`}>
                  {leistungsgemessen ? `−${zahl(lp.euro)} €` : "–"}
                </Kennzahl>
              </div>
            ) : (
              <Hinweis ton="warn" titel="Ziel so nicht erreichbar">
                Bei {zahl(schwelle)} kW müsste der Speicher über mehrere Tage entladen, ohne nachladen zu können. Wählen Sie ein höheres Ziel.
              </Hinweis>
            )}
            <DiagrammKarte titel="Jahresdauerlinie" unter="Alle Viertelstunden des Jahres, der Größe nach sortiert – orange: Energie über dem Ziel">
              <Dauerlinie dauerlinie={a.dauerlinie} schwelle={schwelle} stundenJahr={(a.n * lg.intervall) / 60} />
            </DiagrammKarte>
            {!leistungsgemessen && (
              <Hinweis>
                Mit rund {energie(a.jahresverbrauch)} und {leistung(a.spitze.kw)} Spitze liegt Ihr Betrieb unter der Schwelle für die Leistungsmessung ({zahl(PS_ANNAHMEN.messpflichtKwh)} kWh oder {PS_ANNAHMEN.messpflichtKw} kW) – bis Ende 2026 fällt dann meist kein Leistungspreis an.
              </Hinweis>
            )}
            <Hinweis ton="recht">
              Richtwert: Leistungspreis {netz.bereich.label}, Netzebene {ne}: {zahl(netz.lp, 2)} € je kW und Jahr (SNE-V 2026), abgerechnet bis Ende 2026 auf das Mittel der zwölf Monatsspitzen. Kapazität inkl. {zahl((PS_ANNAHMEN.reserve - 1) * 100)} % Reserve und {zahl(PS_ANNAHMEN.sohEnde * 100)} % Restkapazität am Lebensende. Ab 2027 wird laut ElWG jeder Monat einzeln abgerechnet; die Tarife 2027 stehen noch aus. Speicherpreise nennen wir erst im Angebot.
            </Hinweis>
          </div>
        </div>
      </Abschnitt>

      {/* ---------- 4 Angebot ---------- */}
      <section aria-labelledby="lg-angebot" className="relative overflow-hidden bg-navy-950 px-5 py-8 text-white sm:px-6 md:px-8 md:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ov-500/25 blur-[90px]" />
        <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h3 id="lg-angebot" className="font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
              Mit diesen Werten ein Angebot anfragen
            </h3>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["Jahresverbrauch", energie(a.jahresverbrauch)],
                ["PV-Anlage", `${zahl(kwp)} kWp`],
                ["Speicher", mitSpeicher && ps.moeglich && ps.nennKwh > 0 ? `${zahl(ps.nennKwh)} kWh` : "–"],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0 rounded-2xl bg-white/[0.06] px-3 py-3 ring-1 ring-white/10">
                  <dt className="truncate text-[12px] text-white/70">{k}</dt>
                  <dd className="ov-num mt-0.5 font-display text-[17px] font-extrabold md:text-[19px]">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/70">
              Übertragen werden nur diese Zahlen im Link – nicht Ihre Datei. Den vollständigen Lastgang können Sie uns später im Gespräch geben, wenn Sie möchten.
            </p>
          </div>
          <div className="space-y-4">
            {ps.moeglich && ps.nennKwh > 0 && (
              <div className="rounded-2xl bg-white text-ink-900">
                <Schalter label="Speicher mit anfragen" beschreibung={`${zahl(ps.leistungKw)} kW / ${zahl(ps.nennKwh)} kWh für Peak Shaving`} an={mitSpeicher} onChange={setMitSpeicher} icon={BatteryCharging} />
              </div>
            )}
            <Link
              href={link}
              className="group flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-ov-600 px-6 py-3 text-center text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all duration-300 hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Mit diesen Werten Angebot anfragen
              <ArrowRight aria-hidden="true" className="h-[1.05em] w-[1.05em] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
