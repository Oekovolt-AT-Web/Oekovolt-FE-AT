"use client";

import { useEffect, useMemo, useState } from "react";
import { BatteryCharging, Calculator, CheckCircle2, Circle, Fuel, Gauge, ListChecks, ShieldCheck, Sun, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { fmt } from "@/lib/rechner/annahmen";
import {
  BO_ANNAHMEN,
  BRANCHEN,
  CHECKLISTE_BASIS,
  JAHRESZEITEN,
  boAusParams,
  boParams,
  branche as brancheVon,
  kostenJeStunde,
  simuliereAusfall,
  speicherVorschlag,
  szenarien,
} from "@/lib/rechner/blackout";
import { DiagrammKarte, GewerbeStil, Hinweis, Karte, LinkTeilen, Vorlagen, Zahlfeld, euro, useStartAusUrl } from "./GewerbeBausteine";
import { BlackoutVerlauf } from "./BlackoutDiagramme";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";

const PFAD = "/rechner/blackout";
const START = BRANCHEN[0];

function ausBranche(b) {
  return {
    branche: b.id,
    last: b.last,
    ziel: b.ziel,
    db: b.db,
    personen: b.personen,
    lohn: b.lohn,
    ware: b.ware,
    verderb: b.verderb,
    wiederanlauf: b.wiederanlauf,
    wiederanlaufKosten: b.wiederanlaufKosten,
    kwp: b.kwp,
    speicher: null, // null = Vorschlag
    aggregat: true,
    jahreszeit: "winter",
    startStunde: 8,
  };
}

export default function BlackoutRechner() {
  const [e, setE] = useState(() => ausBranche(START));
  const [vorlage, setVorlage] = useState(START.id);
  const b = brancheVon(e.branche);
  const setze = (feld) => (wert) => {
    setVorlage(null);
    setE((alt) => ({ ...alt, [feld]: wert }));
  };

  useStartAusUrl(boAusParams, (p) => {
    setVorlage(null);
    setE({ ...ausBranche(brancheVon(p.branche)), ...p, speicher: p.speicher > 0 ? p.speicher : null });
  });

  // Branchenwerte, die nicht editierbar sind (Auslastung, Anlaufreserve, Weiterbetrieb)
  const eingabe = { ...e, auslastung: b.auslastung, anlauf: b.anlauf, weiterbetrieb: b.weiterbetrieb, stillsetzen: Boolean(b.stillsetzen) };
  const vorschlag = speicherVorschlag(eingabe);
  const speicher = e.speicher == null ? vorschlag : e.speicher;
  const volle = { ...eingabe, speicher };
  const sim = useMemo(() => simuliereAusfall(volle), [JSON.stringify(volle)]); // eslint-disable-line react-hooks/exhaustive-deps
  const sz = useMemo(() => szenarien(volle, sim), [sim]); // eslint-disable-line react-hooks/exhaustive-deps
  const aus = sim.auslegung;
  const kh = kostenJeStunde(e);
  const blackout = sz.find((s) => s.id === "blackout");
  const speicherMax = Math.max(500, Math.ceil((vorschlag * 4) / 100) * 100);
  const liter48 = useMemo(() => (e.ziel >= 48 ? sim.liter : simuliereAusfall({ ...volle, ziel: 48 }).liter), [sim]); // eslint-disable-line react-hooks/exhaustive-deps
  useRechnerErgebnis("blackout", sim);

  return (
    <div className="space-y-6">
      <Karte>
        <GewerbeStil />
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,410px)_minmax(0,1fr)]">
          {/* ---------------- Eingaben ---------------- */}
          <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
            <MobilKurz
              werte={[
                ["Blackout 48 h", <Zahl key="b" wert={Math.round(blackout.ohne / 100) * 100} suffix=" €" />],
                ["Ersatzstrom", <Zahl key="l" wert={Math.round(aus.leistung)} suffix=" kW" />],
                ["Diesel", e.aggregat ? <Zahl key="d" wert={Math.round(sim.liter)} suffix=" l" /> : "–"],
              ]}
            />
            <div className="space-y-8">
              <Vorlagen
                titel="Branche wählen"
                vorlagen={BRANCHEN}
                aktiv={vorlage}
                onWahl={(v) => {
                  setVorlage(v.id);
                  setE(ausBranche(v));
                }}
              />

              <Gruppe titel="Kritische Versorgung">
                <p className="-mt-2 rounded-2xl bg-white px-4 py-3 text-[13px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
                  <strong className="text-ink-800">Typisch kritisch:</strong> {b.kritisch}
                </p>
                <Regler label="Kritische Last" wert={e.last} min={5} max={Math.max(600, e.last)} step={5} einheit="kW" onChange={setze("last")} hinweis={`Mittlere Last ≈ ${fmt(aus.mittlereLast)} kW (${fmt(b.auslastung * 100)} % der Spitze, Beispielwert der Branche).`} />
                <Regler label="Gewünschte Überbrückung" wert={e.ziel} min={1} max={72} step={1} format={(v) => `${v} h`} minLabel="1 h" maxLabel="72 h" onChange={setze("ziel")} hinweis="GfKV: Bei einem Blackout rechnet Österreich mit 10–48 Stunden ohne Strom." />
              </Gruppe>

              <Gruppe titel="Ausfallkosten je Stunde · Hilfsrechnung">
                <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <Zahlfeld klein label={b.id === "gemeinde" ? "Ersatzmaßnahmen je Stunde (Notversorgung, Einsatzkräfte)" : "Entgangener Deckungsbeitrag je Stunde"} wert={e.db} min={0} max={1000000} step={50} einheit="€/h" onChange={setze("db")} />
                  <div className="grid grid-cols-2 gap-3">
                    <Zahlfeld klein label="Personal im Stillstand" wert={e.personen} min={0} max={5000} einheit="Pers." onChange={(v) => setze("personen")(Math.round(v))} />
                    <Zahlfeld klein label="Lohnkosten" wert={e.lohn} min={0} max={500} einheit="€/h" onChange={setze("lohn")} />
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-ink-100 pt-3">
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700">
                      <Calculator aria-hidden="true" className="h-4 w-4 text-ov-600" /> Ausfallkosten
                    </span>
                    <span className="ov-num font-display text-[20px] font-extrabold text-ink-900">
                      <Zahl wert={kh} suffix=" €/h" />
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Zahlfeld klein label={b.ware > 0 ? b.wareLabel : "Gefährdeter Warenwert"} wert={e.ware} min={0} max={50000000} step={500} einheit="€" onChange={setze("ware")} />
                  <Zahlfeld klein label="verloren nach" wert={e.verderb} min={0} max={72} step={0.25} einheit="h" onChange={setze("verderb")} />
                  <Zahlfeld klein label="Wiederanlauf" wert={e.wiederanlauf} min={0} max={72} step={0.5} einheit="h" onChange={setze("wiederanlauf")} />
                  <Zahlfeld klein label="Wiederanlauf-Kosten" wert={e.wiederanlaufKosten} min={0} max={10000000} step={100} einheit="€" onChange={setze("wiederanlaufKosten")} />
                </div>
                <p className="text-[12.5px] leading-relaxed text-ink-500">Branchenwerte sind Beispiele – ersetzen Sie sie durch Ihre Zahlen.</p>
              </Gruppe>

              <Gruppe titel="Ersatzstrom-Kombination">
                <Regler label="PV-Anlage (ersatzstromfähig)" wert={e.kwp} min={0} max={1000} step={10} format={(v) => (v === 0 ? "keine" : `${fmt(v)} kWp`)} minLabel="0" maxLabel="1.000 kWp" onChange={setze("kwp")} />
                <Regler
                  label="Speicher (Nennkapazität)"
                  wert={Math.min(speicher, speicherMax)}
                  min={0}
                  max={speicherMax}
                  step={5}
                  format={(v) => (v === 0 ? "ohne" : `${fmt(v)} kWh`)}
                  minLabel="0"
                  maxLabel={`${fmt(speicherMax)} kWh`}
                  onChange={setze("speicher")}
                  hinweis={e.speicher != null && e.speicher !== vorschlag ? undefined : `Vorschlag: 2 Stunden mittlere Last = ${fmt(vorschlag)} kWh`}
                />
                {e.speicher != null && e.speicher !== vorschlag && (
                  <button type="button" onClick={() => setze("speicher")(null)} className="-mt-2 text-[13px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                    Vorschlag {fmt(vorschlag)} kWh übernehmen
                  </button>
                )}
                <Schalter icon={Fuel} label="Notstromaggregat (Diesel)" beschreibung={`${fmt(aus.kva)} kVA · startet bei ${fmt(BO_ANNAHMEN.aggregatStartSoc * 100)} % Ladezustand`} an={e.aggregat} onChange={setze("aggregat")} />
                <Auswahl legende="Jahreszeit" wert={e.jahreszeit} onChange={setze("jahreszeit")} optionen={JAHRESZEITEN.map((j) => ({ id: j.id, label: j.label }))} />
                <Auswahl
                  legende="Ausfall beginnt"
                  wert={e.startStunde}
                  onChange={setze("startStunde")}
                  optionen={[
                    { id: 8, label: "8 Uhr" },
                    { id: 18, label: "18 Uhr" },
                    { id: 2, label: "2 Uhr" },
                  ]}
                />
              </Gruppe>
            </div>
          </div>

          {/* ---------------- Ergebnis ---------------- */}
          <div className="min-w-0 p-5 sm:p-6 md:p-8">
            <p className="sr-only" aria-live="polite">
              {`Blackout 48 Stunden kostet ohne Ersatzstrom rund ${Math.round(blackout.ohne)} Euro, mit Ersatzstrom ${Math.round(blackout.mit)} Euro. Ersatzstrom-Leistung ${Math.round(aus.leistung)} Kilowatt.`}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihr Ergebnis</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ov-500 motion-reduce:animate-none" aria-hidden="true" />
                {b.label} · {fmt(e.ziel)} h Überbrückung
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <Kennzahl ton="navy" icon={Zap} label="Blackout 48 h" zusatz="Kosten ohne Ersatzstrom">
                <Zahl wert={Math.round(blackout.ohne / 100) * 100} suffix=" €" />
              </Kennzahl>
              <Kennzahl ton="gruen" icon={ShieldCheck} label="Vermieden" zusatz={sim.vollGedeckt ? `mit ${fmt(e.ziel)} h Überbrückung` : `nur ${fmt(sim.ueberbrueckt)} von ${fmt(e.ziel)} h gedeckt`}>
                <Zahl wert={Math.max(0, Math.round(blackout.vermieden / 100) * 100)} suffix=" €" />
              </Kennzahl>
              <Kennzahl icon={Gauge} label="Ersatzstrom-Leistung" zusatz={`inkl. Anlaufreserve · Aggregat ${fmt(aus.kva)} kVA`}>
                <Zahl wert={Math.round(aus.leistung)} suffix=" kW" />
              </Kennzahl>
              <Kennzahl icon={Fuel} label={`Diesel für ${fmt(e.ziel)} h`} zusatz={e.aggregat ? `nur Aggregat: ${fmt(sim.nurAggregatLiter)} l` : "kein Aggregat gewählt"}>
                {e.aggregat ? <Zahl wert={Math.round(sim.liter)} suffix=" l" /> : "–"}
              </Kennzahl>
            </div>

            {!sim.vollGedeckt && (
              <Hinweis ton="warn" titel={`Ersatzstrom reicht ${sim.ueberbrueckt} von ${sim.dauer} Stunden`} className="mt-4">
                Ohne Aggregat trägt die Kombination die kritische Last nicht über die gewünschte Dauer. Mehr Speicher, mehr PV oder ein Aggregat schließen die Lücke.
              </Hinweis>
            )}

            {/* Szenarien */}
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {sz.map((s) => {
                const max = Math.max(...sz.map((x) => x.ohne), 1);
                return (
                  <div key={s.id} className={cn("rounded-3xl p-5 ring-1", s.id === "blackout" ? "bg-navy-950 text-white ring-navy-950" : "bg-white ring-ink-200/70")}>
                    <p className={cn("text-[12.5px] font-semibold uppercase tracking-[0.12em]", s.id === "blackout" ? "text-sun-300" : "text-ov-700")}>{s.label}</p>
                    <p className={cn("text-[12.5px]", s.id === "blackout" ? "text-white/60" : "text-ink-500")}>{s.sub}</p>
                    <div className="mt-4 space-y-2.5">
                      <SzenarioBalken label="ohne Ersatzstrom" wert={s.ohne} max={max} dunkel={s.id === "blackout"} klasse={s.id === "blackout" ? "bg-white/35" : "bg-ink-300"} />
                      <SzenarioBalken label="mit Ersatzstrom" wert={s.mit} max={max} dunkel={s.id === "blackout"} klasse="bg-ov-500" />
                    </div>
                    <p className={cn("mt-3 text-[12.5px] leading-snug", s.id === "blackout" ? "text-white/70" : "text-ink-500")}>
                      {s.wareOhne > 0 && s.wareMit === 0 ? (b.stillsetzen && s.offen > 0 ? "Anlagen werden geordnet stillgesetzt – kein Ausschuss." : `${b.wareLabel} bleibt erhalten.`) : s.wareMit > 0 ? `${b.wareLabel} geht verloren – Überbrückung zu kurz.` : s.offen > 0 ? `${fmt(s.offen)} h ohne Ersatzstrom.` : "Kritische Prozesse laufen durch."}
                    </p>
                  </div>
                );
              })}
            </div>

            <DiagrammKarte
              className="mt-5"
              titel="Überbrückung Stunde für Stunde"
              unter={`${JAHRESZEITEN.find((j) => j.id === e.jahreszeit).label}, Beginn ${e.startStunde} Uhr · PV ${fmt(sim.anteile.pv * 100)} % · Speicher ${fmt(sim.anteile.speicher * 100)} % · Aggregat ${fmt(sim.anteile.aggregat * 100)} %`}
            >
              <BlackoutVerlauf verlauf={sim.verlauf} mitSpeicher={speicher > 0} />
            </DiagrammKarte>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-ink-50 p-5 md:p-6">
                <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                  <BatteryCharging aria-hidden="true" className="h-4 w-4 text-ov-600" /> Auslegung
                </h3>
                <dl className="mt-3 divide-y divide-ink-200/70 text-[14px]">
                  <Zeile k="Kritische Last × Anlaufreserve" v={`${fmt(e.last)} × ${fmt(b.anlauf, 2)} = ${fmt(aus.leistung)} kW`} />
                  <Zeile k="Aggregat (cos φ 0,8)" v={`${fmt(aus.kva)} kVA`} />
                  <Zeile k={`Energie für ${fmt(e.ziel)} h`} v={`${fmt(aus.energie)} kWh`} />
                  <Zeile k="Nur Speicher (ohne PV/Aggregat)" v={`${fmt(Math.ceil(aus.speicherNur / 10) * 10)} kWh`} />
                  {speicher > 0 && <Zeile k="Speicher Richtinvest (netto)" v={`≈ ${euro(Math.round(sim.speicherInvest / 100) * 100)}`} marke />}
                </dl>
              </div>
              <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
                <h3 className="flex items-center gap-2 font-display text-[17px] font-bold">
                  <Sun aria-hidden="true" className="h-4 w-4 text-sun-300" /> PV + Speicher + Aggregat
                </h3>
                {e.aggregat ? (
                  <dl className="mt-3 divide-y divide-white/10 text-[14px]">
                    <Zeile dunkel k="Aggregat-Laufzeit" v={`${fmt(sim.laufzeit)} von ${fmt(sim.dauer)} h`} />
                    <Zeile dunkel k="Diesel Kombination" v={`${fmt(sim.liter)} l`} />
                    <Zeile dunkel k="Diesel nur Aggregat" v={`${fmt(sim.nurAggregatLiter)} l`} />
                    <Zeile dunkel k="Ersparnis" v={`−${fmt(sim.ersparnisLiter)} l`} stark />
                    <Zeile dunkel k="Vorrat für 48 h Blackout" v={`≈ ${fmt(Math.ceil(liter48 / 10) * 10)} l`} />
                  </dl>
                ) : (
                  <p className="mt-3 text-[14px] leading-relaxed text-white/75">
                    Ohne Aggregat überbrückt die Kombination {sim.ueberbrueckt} Stunden. Für Nächte und trübe Wintertage ist ein Aggregat meist die robuste Ergänzung – der Speicher verkürzt seine Laufzeit.
                  </p>
                )}
                <p className="mt-3 text-[12px] leading-relaxed text-white/55">
                  Verbrauch nach Datenblattwerten (Deutz 2011, {fmt(BO_ANNAHMEN.dichte, 3)} kg/l, Generator {fmt(BO_ANNAHMEN.etaGenerator * 100)} %). Das Aggregat läuft im Bestpunkt und lädt den Speicher mit.
                </p>
              </div>
            </div>

            <Hinweis ton="recht" titel="Technik, die im Blackout wirklich hilft" className="mt-5">
              PV und Speicher liefern nur mit Ersatzstromfunktion: automatische Netztrennung, netzbildender Wechselrichter, Schwarzstart – nach TOR und ÖVE/ÖNORM E 8101 geplant und lokal bedienbar, weil Internet und Mobilfunk mit ausfallen.
            </Hinweis>

            <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
                Beispielwerte und vereinfachte Simulation – kein Angebot. Wir messen Ihre kritischen Lasten und Anlaufströme vor Ort.
              </p>
              <Button href="/service/notstrom" size="lg" pfeil className="shrink-0">
                Notstrom-Konzept anfragen
              </Button>
            </div>
            <div className="mt-4">
              <LinkTeilen
                pfad={PFAD}
                query={boParams({ ...e, speicher })}
                titel="Blackout-Rechner: Was kostet ein Stromausfall?"
                text="So viel kostet ein Blackout bei diesen Werten – und so viel Ersatzstrom braucht es. Gerechnet mit dem Ökovolt Blackout-Rechner."
                kampagne="rechner_blackout"
              />
            </div>
          </div>
        </div>
      </Karte>

      <Checkliste branche={b} />
    </div>
  );
}

function SzenarioBalken({ label, wert, max, klasse, dunkel }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-[12.5px]">
        <span className={dunkel ? "text-white/70" : "text-ink-600"}>{label}</span>
        <span className={cn("ov-num font-display text-[15px] font-extrabold", dunkel ? "text-white" : "text-ink-900")}>{euro(wert)}</span>
      </div>
      <div className={cn("h-2.5 overflow-hidden rounded-full", dunkel ? "bg-white/10" : "bg-ink-100")}>
        <div className={cn("h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500", klasse)} style={{ width: `${Math.round((Math.max(0, wert) / max) * 10000) / 100}%` }} />
      </div>
    </div>
  );
}

function Zeile({ k, v, stark, dunkel, marke }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={dunkel ? "text-white/70" : "text-ink-600"}>
        {k}
        {marke && <span className="ml-2 rounded-full bg-sun-400 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-navy-950">Richtwert</span>}
      </dt>
      <dd className={cn("ov-num shrink-0 text-right font-semibold", dunkel ? (stark ? "text-ov-300" : "text-white") : "text-ink-900")}>{v}</dd>
    </div>
  );
}

const SPEICHER_KEY = "ov-blackout-checkliste-v1";

/** Interaktive Abhakliste mit Fortschrittsbalken (gespeichert nur im eigenen Browser) */
function Checkliste({ branche }) {
  const punkte = [...CHECKLISTE_BASIS, ...branche.check];
  const [erledigt, setErledigt] = useState({});
  useEffect(() => {
    try {
      const roh = window.localStorage.getItem(SPEICHER_KEY);
      if (roh) setErledigt(JSON.parse(roh) || {});
    } catch {
      /* Speicher nicht verfügbar */
    }
  }, []);
  const umschalten = (p) => {
    setErledigt((alt) => {
      const neu = { ...alt, [p]: !alt[p] };
      try {
        window.localStorage.setItem(SPEICHER_KEY, JSON.stringify(neu));
      } catch {
        /* egal */
      }
      return neu;
    });
  };
  const anzahl = punkte.filter((p) => erledigt[p]).length;
  const anteil = anzahl / punkte.length;
  return (
    <Karte>
      <div className="grid gap-8 p-5 sm:p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div>
          <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <ListChecks aria-hidden="true" className="h-4 w-4" /> Checkliste
          </p>
          <h2 className="mt-3 font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[28px]">Wie gut ist Ihr Betrieb vorbereitet?</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
            Haken Sie ab, was bereits erledigt ist. Die Punkte folgen dem GfKV-Leitfaden für Unternehmen, ergänzt um Punkte für {branche.label}. Gespeichert wird nur in Ihrem Browser.
          </p>
          <div className="mt-6 rounded-3xl bg-navy-950 p-5 text-white">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-white/70">Fortschritt</span>
              <span className="font-display text-[28px] font-extrabold">
                <Zahl wert={Math.round(anteil * 100)} suffix=" %" />
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={punkte.length} aria-valuenow={anzahl} aria-label="Fortschritt der Checkliste">
              <div className={cn("h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500", anteil >= 1 ? "bg-ov-400" : "bg-sun-400")} style={{ width: `${Math.round(anteil * 10000) / 100}%` }} />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-white/70">
              {anzahl} von {punkte.length} erledigt.{" "}
              {anteil >= 1 ? "Sehr gut – jetzt jährlich üben und aktualisieren." : anteil >= 0.6 ? "Gute Basis – schließen Sie die offenen Punkte." : "Viele Punkte lassen sich ohne Investition erledigen."}
            </p>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {punkte.map((p) => {
            const an = Boolean(erledigt[p]);
            return (
              <li key={p}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={an}
                  onClick={() => umschalten(p)}
                  className={cn(
                    "flex h-full min-h-14 w-full items-start gap-3 rounded-2xl px-4 py-3 text-left text-[14px] leading-snug ring-1 transition-colors duration-200",
                    an ? "bg-ov-50 text-ink-800 ring-ov-200" : "bg-white text-ink-700 ring-ink-200 hover:ring-ink-300"
                  )}
                >
                  {an ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" /> : <Circle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-300" />}
                  <span className={an ? "line-through decoration-ov-300" : ""}>{p}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Karte>
  );
}
