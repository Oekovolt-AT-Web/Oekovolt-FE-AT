"use client";

// src/components/KommunenVergabe/LiegenschaftsCheck.js
//
// Liegenschafts-Check für Gemeinden (Welle B, Paket B09): bis 15 Gebäude mit Typprofil,
// Jahresverbrauch, Dachfläche, Netzebene und Dachalter → kWp, Eigenverbrauch, Überschuss für eine
// Energiegemeinschaft und Rangfolge. GROBABSCHÄTZUNG MIT TYPISIERTEN PROFILEN, Richtwerte.
// Ergebnis auf dem Bildschirm frei; CSV-Export über das Lead-Gate (Kennung „liegenschafts-check“).
// Logik: ./liegenschaften.js (ohne React, getestet in scripts/kommunen-werkzeuge.test.mjs).
// Eingaben bleiben im Browser (Entwurf in localStorage, nur auf diesem Gerät).

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CircleAlert, Download, Lock, Plus, RotateCcw, Trash2, Trophy } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { zahlText } from "@/data/kennzahlen";
import KommunenGate, { useGateFreigabe } from "./KommunenGate";
import {
  AUSLEGUNGEN,
  BEISPIEL_ZEILEN,
  BUNDESLAENDER,
  ERTRAG_QUELLE,
  GEBAEUDE,
  LIEGENSCHAFTEN_STAND,
  MAX_GEBAEUDE,
  NETZEBENEN,
  QM_PRO_KWP,
  csvExport,
  liegenschaftenAuswerten,
  neueZeile,
} from "./liegenschaften";

export const GATE_KENNUNG = "liegenschafts-check";
const ENTWURF_KEY = "ov_liegenschafts_check_v1";

const EINGABE = "h-11 w-full min-w-0 rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500";
const KLEIN = "mb-1 block text-[12.5px] font-semibold text-ink-700";
const pct = (x) => `${zahlText(Math.round(x * 100))} %`;
const kwh = (x) => `${zahlText(Math.round(x))} kWh`;

function Zeile({ z, i, ergebnis, aendern, entfernen, darfEntfernen }) {
  const id = useId();
  const typ = GEBAEUDE.find((g) => g.id === z.typ);
  return (
    <li className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(3,18,43,0.55)] ring-1 ring-ink-200/60 sm:p-5">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="ov-num mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[12.5px] font-bold text-white">
          {i + 1}
        </span>
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <label htmlFor={`${id}-name`} className={KLEIN}>
              Bezeichnung
            </label>
            <input id={`${id}-name`} className={EINGABE} value={z.name} onChange={(e) => aendern(i, { name: e.target.value })} placeholder={typ?.label || "Gebäude"} autoComplete="off" />
          </div>
          <div>
            <label htmlFor={`${id}-typ`} className={KLEIN}>
              Gebäudetyp (Profil)
            </label>
            <select id={`${id}-typ`} className={EINGABE} value={z.typ} onChange={(e) => aendern(i, { typ: e.target.value })}>
              {GEBAEUDE.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => entfernen(i)}
          disabled={!darfEntfernen}
          aria-label={`Gebäude ${i + 1} entfernen`}
          className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-red-50 hover:text-red-700 disabled:invisible"
        >
          <Trash2 aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:ml-10 lg:grid-cols-4">
        <div>
          <label htmlFor={`${id}-v`} className={KLEIN}>
            Verbrauch kWh/Jahr
          </label>
          <input id={`${id}-v`} inputMode="numeric" className={cn(EINGABE, "ov-num")} value={z.verbrauch} onChange={(e) => aendern(i, { verbrauch: e.target.value, beispiel: false })} />
        </div>
        <div>
          <label htmlFor={`${id}-d`} className={KLEIN}>
            Dachfläche m²
          </label>
          <input id={`${id}-d`} inputMode="numeric" className={cn(EINGABE, "ov-num")} value={z.dachflaeche} onChange={(e) => aendern(i, { dachflaeche: e.target.value, beispiel: false })} />
        </div>
        <div>
          <label htmlFor={`${id}-ne`} className={KLEIN}>
            Netzebene
          </label>
          <select id={`${id}-ne`} className={EINGABE} value={z.netzebene} onChange={(e) => aendern(i, { netzebene: e.target.value })}>
            {NETZEBENEN.map((n) => (
              <option key={n.id} value={n.id}>
                {n.kurz} · {n.text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-a`} className={KLEIN}>
            Dachalter Jahre
          </label>
          <input id={`${id}-a`} inputMode="numeric" className={cn(EINGABE, "ov-num")} value={z.dachalter} onChange={(e) => aendern(i, { dachalter: e.target.value })} />
        </div>
      </div>

      {ergebnis && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-600 sm:ml-10">
          <span>
            <strong className="ov-num text-ink-900">{zahlText(ergebnis.kwp)} kWp</strong>
          </span>
          <span>
            Eigenverbrauch <strong className="ov-num text-ink-900">{pct(ergebnis.evQuote)}</strong>
          </span>
          <span>
            Rang <strong className="ov-num text-ink-900">{ergebnis.rang}</strong>
          </span>
          {z.beispiel && <span className="rounded-full bg-sun-300/50 px-2 py-0.5 text-[11.5px] font-semibold text-ink-800">Beispielwerte</span>}
        </p>
      )}
    </li>
  );
}

export default function LiegenschaftsCheck({ className }) {
  const id = useId();
  const [zeilen, setZeilen] = useState(BEISPIEL_ZEILEN);
  const [land, setLand] = useState("oberoesterreich");
  const [auslegung, setAuslegung] = useState("dach");
  const [frei, freischalten] = useGateFreigabe(GATE_KENNUNG);
  const [gate, setGate] = useState(false);
  const [meldung, setMeldung] = useState("");
  const geladen = useRef(false);

  // Entwurf nur auf diesem Gerät merken
  useEffect(() => {
    try {
      const roh = JSON.parse(window.localStorage.getItem(ENTWURF_KEY) || "null");
      if (roh && Array.isArray(roh.zeilen) && roh.zeilen.length) {
        setZeilen(roh.zeilen.slice(0, MAX_GEBAEUDE));
        if (BUNDESLAENDER.some((b) => b.id === roh.land)) setLand(roh.land);
        if (AUSLEGUNGEN.some((a) => a.id === roh.auslegung)) setAuslegung(roh.auslegung);
      }
    } catch {
      /* ohne Entwurf */
    }
    geladen.current = true;
  }, []);
  useEffect(() => {
    if (!geladen.current) return;
    try {
      window.localStorage.setItem(ENTWURF_KEY, JSON.stringify({ zeilen, land, auslegung }));
    } catch {
      /* privater Modus */
    }
  }, [zeilen, land, auslegung]);

  const bl = BUNDESLAENDER.find((b) => b.id === land) || BUNDESLAENDER[0];
  const auswertung = useMemo(() => liegenschaftenAuswerten(zeilen, { ertragProKwp: bl.ertrag, auslegung }), [zeilen, bl.ertrag, auslegung]);
  const g = auswertung.gesamt;
  const maxErtrag = Math.max(1, ...auswertung.reihung.map((r) => r.ertrag));
  const nurBeispiel = zeilen.some((z) => z.beispiel);

  const aendern = useCallback((i, teil) => setZeilen((zs) => zs.map((z, j) => (j === i ? { ...z, ...teil } : z))), []);
  const entfernen = useCallback((i) => setZeilen((zs) => zs.filter((_, j) => j !== i)), []);
  const hinzufuegen = () => setZeilen((zs) => (zs.length >= MAX_GEBAEUDE ? zs : [...zs, { ...neueZeile("sonstiges"), verbrauch: "", dachflaeche: "", beispiel: false }]));
  const zuruecksetzen = () => setZeilen(BEISPIEL_ZEILEN);

  const exportieren = useCallback(() => {
    const url = URL.createObjectURL(new Blob([csvExport(auswertung)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `liegenschafts-check-${LIEGENSCHAFTEN_STAND.iso}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMeldung("CSV gespeichert – öffnet in Excel oder LibreOffice (Trennzeichen Semikolon).");
  }, [auswertung]);

  const nachFreigabe = useCallback(() => {
    freischalten();
    setGate(false);
    exportieren();
  }, [freischalten, exportieren]);

  // Übergabe an den Amtsvortrag-Generator: die ersten drei Gebäude der Rangfolge mit Leistung
  const fuerAmtsvortrag = auswertung.reihung.filter((r) => r.kwp > 0).slice(0, 3);
  const amtsvortragHref = `/kommunen/vergabe-foerderung?${new URLSearchParams({
    av_liegenschaften: fuerAmtsvortrag.map((r) => r.name).join("|"),
    av_kwp: String(fuerAmtsvortrag.reduce((s, r) => s + r.kwp, 0)),
    av_ertrag: String(fuerAmtsvortrag.reduce((s, r) => s + r.ertrag, 0)),
  })}#amtsvortrag`;

  const zusammenfassung = {
    Werkzeug: "Liegenschafts-Check",
    Gebäude: g.gebaeude,
    Bundesland: bl.label,
    "kWp gesamt": zahlText(g.kwp),
    "Eigenverbrauch kWh": zahlText(g.eigenverbrauch),
    "Überschuss kWh": zahlText(g.ueberschuss),
  };

  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10", className)}>
      {/* Eingaben */}
      <div className="min-w-0">
        <div className="rounded-[1.75rem] bg-sand-50 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-land`} className={KLEIN}>
                Bundesland (spezifischer Ertrag)
              </label>
              <select id={`${id}-land`} className={EINGABE} value={land} onChange={(e) => setLand(e.target.value)}>
                {BUNDESLAENDER.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label} · {zahlText(b.ertrag)} kWh/kWp
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className={KLEIN}>Auslegung</legend>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-white p-1 shadow-sm">
                {AUSLEGUNGEN.map((a) => (
                  <label
                    key={a.id}
                    className={cn(
                      "flex min-h-9 cursor-pointer items-center justify-center rounded-lg px-2 text-center text-[13px] font-semibold leading-tight transition focus-within:ring-2 focus-within:ring-ov-500",
                      auslegung === a.id ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-sand-100",
                    )}
                  >
                    <input type="radio" name={`${id}-ausl`} value={a.id} checked={auslegung === a.id} onChange={() => setAuslegung(a.id)} className="sr-only" />
                    {a.id === "dach" ? "Dach voll" : "Eigenverbrauch"}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <p className="mt-2 text-[12.5px] leading-snug text-ink-600">{AUSLEGUNGEN.find((a) => a.id === auslegung)?.text}</p>
        </div>

        {nurBeispiel && (
          <p className="mt-4 flex gap-2 rounded-2xl bg-sand-100 p-3 text-[13.5px] leading-snug text-ink-800">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
            Beispielwerte zum Ausprobieren – bitte durch die Zählerwerte und Dachflächen Ihrer Gebäude ersetzen.
          </p>
        )}

        <ol className="mt-4 space-y-3" aria-label="Gebäude der Gemeinde">
          {zeilen.map((z, i) => (
            <Zeile key={i} z={z} i={i} ergebnis={auswertung.liste[i]} aendern={aendern} entfernen={entfernen} darfEntfernen={zeilen.length > 1} />
          ))}
        </ol>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={hinzufuegen}
            disabled={zeilen.length >= MAX_GEBAEUDE}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-950 px-5 text-[14.5px] font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Gebäude hinzufügen
            <span className="ov-num font-normal text-white/70">
              ({zeilen.length}/{MAX_GEBAEUDE})
            </span>
          </button>
          <button type="button" onClick={zuruecksetzen} className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold text-ink-700 hover:bg-sand-100">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Beispiel wiederherstellen
          </button>
        </div>
      </div>

      {/* Ergebnis */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="ov-noise relative isolate overflow-hidden rounded-[2rem] bg-navy-950 p-5 text-white sm:p-7" aria-live="polite">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[300px] w-[300px] rounded-full bg-ov-500/25 blur-[110px]" />
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ergebnis · Grobabschätzung mit typisierten Profilen</p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {[
              { k: "Leistung gesamt", v: `${zahlText(g.kwp)} kWp` },
              { k: "Jahresertrag", v: kwh(g.ertrag) },
              { k: "Eigenverbrauch", v: kwh(g.eigenverbrauch), z: `${pct(g.evQuote)} des Solarstroms` },
              { k: "Überschuss für Energiegemeinschaft", v: kwh(g.ueberschuss), z: "oder Einspeisung" },
            ].map((x) => (
              <div key={x.k} className="rounded-2xl bg-white/[0.07] p-3.5">
                <dt className="text-[12px] leading-snug text-white/70">{x.k}</dt>
                <dd className="ov-num mt-1 font-display text-[19px] font-extrabold leading-tight sm:text-[22px]">{x.v}</dd>
                {x.z && <dd className="mt-0.5 text-[11.5px] text-white/60">{x.z}</dd>}
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[12.5px] text-white/70">
            Deckung des Gemeindeverbrauchs: <strong className="ov-num text-white">{pct(g.autarkie)}</strong> von {kwh(g.verbrauch)}
          </p>

          <h3 className="mt-7 flex items-center gap-2 font-display text-[16px] font-bold">
            <Trophy aria-hidden="true" className="h-4 w-4 text-ov-300" />
            Rangfolge – womit beginnen?
          </h3>
          <ol className="mt-3 space-y-2.5">
            {auswertung.reihung.map((r) => (
              <li key={r.index} className="rounded-2xl bg-white/[0.05] p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[14px] font-semibold">
                    <span className="ov-num mr-1.5 text-ov-300">{r.rang}.</span>
                    {r.name}
                  </span>
                  <span className="ov-num shrink-0 text-[13px] text-white/80">{zahlText(r.kwp)} kWp</span>
                </div>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true" style={{ width: `${Math.max(8, (r.ertrag / maxErtrag) * 100)}%` }}>
                  <span className="bg-ov-400" style={{ width: `${r.ertrag > 0 ? (r.eigenverbrauch / r.ertrag) * 100 : 0}%` }} />
                  <span className="bg-sun-300" style={{ width: `${r.ertrag > 0 ? (r.ueberschuss / r.ertrag) * 100 : 0}%` }} />
                </div>
                <p className="mt-1.5 text-[12px] text-white/70">
                  Eigenverbrauch {pct(r.evQuote)} · Überschuss {kwh(r.ueberschuss)}
                </p>
                {r.hinweise.length > 0 && (
                  <ul className="mt-1.5 space-y-1 text-[12px] leading-snug text-white/70">
                    {r.hinweise.map((h) => (
                      <li key={h.id} className="flex gap-1.5">
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sun-300" />
                        {h.text}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 flex items-center gap-4 text-[11.5px] text-white/70" aria-hidden="true">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm bg-ov-400" /> Eigenverbrauch
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm bg-sun-300" /> Überschuss
            </span>
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => (frei ? exportieren() : setGate(true))}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white transition hover:bg-ov-700"
            >
              {frei ? <Download aria-hidden="true" className="h-4 w-4" /> : <Lock aria-hidden="true" className="h-4 w-4" />}
              Liste als CSV
            </button>
            <Link
              href={amtsvortragHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-[14.5px] font-semibold text-white transition hover:bg-white/15"
            >
              <Building2 aria-hidden="true" className="h-4 w-4" />
              Zum Amtsvortrag
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-white/60">{meldung || (frei ? "Export freigeschaltet." : "Ergebnis frei. Export nach kurzer Bestätigung Ihrer E-Mail-Adresse.")}</p>

          <p className="mt-6 border-t border-white/10 pt-4 text-[11.5px] leading-relaxed text-white/60">
            Richtwerte zur Orientierung, keine Planung: typisierte Tagesprofile je Gebäudetyp (keine Messwerte), {QM_PRO_KWP} m² Dachfläche je kWp, spezifischer Ertrag {zahlText(bl.ertrag)} kWh/kWp (
            {ERTRAG_QUELLE.label}). Ein echter Lastgang aus dem Netzbetreiber-Portal, Statik und Netzzugangsauskunft ersetzen die Annahmen. Stand {LIEGENSCHAFTEN_STAND.label}.
          </p>
        </div>
      </div>

      {gate && (
        <KommunenGate
          aktion="export"
          kennung={GATE_KENNUNG}
          anker="check"
          titel="Liegenschaftsliste als CSV"
          text="Wir senden Ihnen einen Bestätigungslink. Danach laden Sie die Rangfolge mit allen Kennzahlen als CSV für Excel herunter – Ihre Gebäudedaten bleiben im Browser, wir erhalten nur die Summen. Rückfragen beantworten wir per E-Mail (Art. 6 Abs. 1 lit. b DSGVO). Kein Newsletter."
          zusammenfassung={zusammenfassung}
          onFrei={nachFreigabe}
          onSchliessen={() => setGate(false)}
        />
      )}
    </div>
  );
}
