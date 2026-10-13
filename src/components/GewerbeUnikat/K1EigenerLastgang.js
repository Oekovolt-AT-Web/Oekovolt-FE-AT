"use client";

// src/components/GewerbeUnikat/K1EigenerLastgang.js
//
// K1 · „Legen Sie Ihren eigenen Lastgang darüber“ – Ablagezone, Lead-Gate Stufe 2 und Rückweg zum Beispiel.
// Per next/dynamic aus K1Insel.js in Bildschirmnähe geladen (das Gate bringt seinen Dialog mit).
//
// Ablauf und Zustand liegen in ./K1Ablage.js – dieselbe Datei kann auch direkt auf den Teppich gezogen werden
// (K1Teppich), beide Stellen zeigen denselben Stand. Lead-Gate-Regel 11.10.2026: Gate „lastgang-analyse“,
// modus „auswertung“; gelesen wird die Datei erst nach bestätigter E-Mail und nur im Browser.
// Datenschutz: Die Datei verlässt den Browser nicht; Statistik-Ereignisse tragen nur den Schritt.

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, FileUp, RotateCcw, Send } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { useGewerbeDaten } from "./_daten";
import { anfrageUrl, steckbrief } from "./_steckbrief";
import { prozent, zahl } from "./_tokens";
import { ablageZurueck, dateiAus, traegtDateien, useK1Ablage, useK1Gate } from "./K1Ablage";
import { ABLAGE_KLASSE, ANLEITUNG_KLASSE, AUSWAHL_KLASSE, AuswahlHuelle, NetzbetreiberZeile, PANEL_GATE_SATZ, PANEL_TEXT, PanelGeruest, datumTM, datumZahl, minutenVon, uhrzeit } from "./K1Gestell";

/** Fokusziel nach dem Gate-Dialog: der nächste Schritt im Panel, sonst dessen Überschrift (in dieser Rangfolge). */
const PANEL_ZIELE = ['[data-testid="lastgang-bestaetigen"]', '[data-testid="lastgang-auswerten"]', '[role="status"]', "h3"];
const panelFokus = () => {
  const p = document.querySelector('[data-testid="lastgang-panel"]');
  for (const sel of p ? PANEL_ZIELE : []) {
    const el = p.querySelector(sel);
    if (el) return el;
  }
  return null;
};

const groesse = (b) => (b >= 1024 * 1024 ? `${zahl(b / 1024 / 1024, 1)} MB` : `${zahl(Math.max(1, b / 1024))} KB`);

export default function K1EigenerLastgang({ betreiber = [], hinweisDatenschutz = "" }) {
  const { gate, phase, datei, waehlen, starten } = useK1Gate({ fokus: panelFokus });
  const { fehler } = useK1Ablage();
  const quelle = useGewerbeDaten((s) => s.quelle);
  const last = useGewerbeDaten((s) => s.last);
  const [ueber, setUeber] = useState(false);
  const [nb, setNb] = useState("");
  const inputRef = useRef(null);
  const id = useId();
  const eigen = quelle === "eigen";
  const zurueck = ablageZurueck;

  const senden = () => {
    if (!last) return;
    ereignis("lastgang_eigen", { schritt: "senden" });
    gate.oeffnen("senden", {
      titel: "Kennzahlen an einen Fachberater senden",
      einleitung: "Ihre Datei bleibt auf Ihrem Gerät. Senden Sie uns nur die Kennzahlen – wir legen die Anlage daran aus statt an der Dachfläche.",
      ergebnis: {
        Jahresverbrauch: `${zahl(last.jahresverbrauch / 1000)} MWh${last.hochgerechnet ? " (hochgerechnet)" : ""}`,
        Jahresspitze: `${zahl(last.spitze.kw)} kW (${datumTM(last.spitze.t)} ${uhrzeit(minutenVon(last.spitze.t))})`,
        Grundlast: `${zahl(last.grundlast)} kW`,
        Benutzungsdauer: `${zahl(last.benutzungsdauer)} h`,
        "Mittel der Monatsspitzen": `${zahl(last.mittelMonatsspitze, 1)} kW`,
        "Anteil Sa/So/Feiertag": prozent(last.anteilFrei),
        Herkunft: "/gewerbe · Lastgang-Teppich",
      },
      nachSenden: anfrageUrl(steckbrief.lesen()),
      weiterLabel: "Weiter zur Anfrage",
    });
  };

  const dateiWaehlen = () => inputRef.current?.click();
  const gewaehlteBetreiber = betreiber.find((b) => b.slug === nb);

  const eingabe = (
    <input
      ref={inputRef}
      id={`${id}-datei`}
      type="file"
      accept=".csv,.txt,text/csv,text/plain"
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
      data-testid="lastgang-upload"
      onChange={(e) => {
        waehlen(dateiAus(e.target.files), "panel");
        e.target.value = "";
      }}
    />
  );

  if (eigen) {
    return (
      <PanelGeruest data-testid="lastgang-panel" data-phase="eigen" titel="Ihr Lastgang liegt jetzt darüber" datenschutz={hinweisDatenschutz}>
        {eingabe}
        <p className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-ov-400/15 px-3 py-1 text-[12.5px] font-semibold text-ov-200">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-400" />
          Ihr Lastgang · ausgewertet nur in diesem Browser
        </p>
        {last && (
          <p className="mt-3 text-[14px] leading-relaxed text-white/70">
            {datei ? <span className="font-semibold text-white">{datei.name}</span> : "Ihre Datei"} · {zahl(last.raster.tage.length)} Tage ({datumZahl(last.von)} bis{" "}
            {datumZahl(last.bis - 1)}){last.hochgerechnet ? " · auf ein Jahr hochgerechnet" : ""}. Anlagengröße (03), Stromrechnung (04), Leistungspreis (05),
            Wirtschaftlichkeit (07) und Steckbrief (08) rechnen jetzt mit Ihren Werten; was noch vom Beispielbetrieb stammt, ist so gekennzeichnet.
          </p>
        )}
        <button
          type="button"
          onClick={senden}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          Kennzahlen an Fachberater senden
        </button>
        <button
          type="button"
          onClick={zurueck}
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/15"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Zurück zum Beispiel
        </button>
        {gate.dialog}
      </PanelGeruest>
    );
  }

  return (
    <PanelGeruest
      data-testid="lastgang-panel"
      data-phase={phase}
      titel="Legen Sie Ihren eigenen Lastgang darüber"
      text={PANEL_TEXT}
      datenschutz={hinweisDatenschutz}
      zusatz={PANEL_GATE_SATZ}
      unten={
        betreiber.length > 0 && (
          <NetzbetreiberZeile
            id={`${id}-nb`}
            auswahl={
              <AuswahlHuelle>
                <select id={`${id}-nb`} value={nb} onChange={(e) => setNb(e.target.value)} className={AUSWAHL_KLASSE}>
                  <option value="">Ihr Netzbetreiber</option>
                  {betreiber.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.kurz} ({b.bundesland})
                    </option>
                  ))}
                </select>
              </AuswahlHuelle>
            }
            link={
              <Link href={gewaehlteBetreiber ? gewaehlteBetreiber.pfad : "/smart-meter"} className={ANLEITUNG_KLASSE}>
                {gewaehlteBetreiber ? (
                  <>
                    Anleitung<span className="sr-only"> für {gewaehlteBetreiber.kurz}</span>
                  </>
                ) : (
                  "Anleitungen"
                )}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </Link>
            }
          />
        )
      }
    >
      {eingabe}
      {phase === "leer" || (phase === "fehler" && !datei) ? (
        <div
          className={cn(ABLAGE_KLASSE, ueber ? "bg-ov-400/15 ring-2 ring-ov-400/50" : "bg-white/[0.06]")}
          onDragOver={(e) => {
            if (!traegtDateien(e)) return;
            e.preventDefault();
            setUeber(true);
          }}
          onDragLeave={() => setUeber(false)}
          onDrop={(e) => {
            if (!traegtDateien(e)) return;
            e.preventDefault();
            setUeber(false);
            waehlen(dateiAus(e.dataTransfer?.files), "panel");
          }}
        >
          <button
            type="button"
            onClick={dateiWaehlen}
            data-testid="lastgang-waehlen"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-navy-950 transition-colors hover:bg-ov-50"
          >
            <FileUp aria-hidden="true" className="h-4 w-4" />
            CSV-Datei wählen
          </button>
          <span className="text-[13px] text-white/55">
            <span className="hidden md:inline">oder hierher ziehen · </span>CSV oder TXT mit Viertelstundenwerten
          </span>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-white/[0.06] p-4">
          {datei && (
            <p className="flex min-w-0 items-center gap-3 text-[14px] text-white">
              <FileSpreadsheet aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-300" />
              <span className="min-w-0 flex-1 truncate font-semibold">{datei.name}</span>
              <span className="ov-num shrink-0 text-white/55">{groesse(datei.size)}</span>
            </p>
          )}
          {phase === "gewaehlt" && (
            <>
              <button
                type="button"
                onClick={starten}
                data-testid="lastgang-auswerten"
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700"
              >
                {gate.freigegeben ? "Jetzt auswerten" : "E-Mail bestätigen und auswerten"}
              </button>
              <p className="mt-2.5 text-[12.5px] leading-snug text-white/55">Gelesen wird die Datei erst nach Ihrer Bestätigung – und nur hier im Browser.</p>
            </>
          )}
          {(phase === "dialog" || phase === "wartet") && !gate.freigegeben && (
            <div role="status" className="mt-3">
              <p className="text-[13.5px] leading-snug text-white/75">
                {phase === "dialog"
                  ? "Bestätigung läuft im Dialog."
                  : "Noch nicht freigeschaltet – E-Mail bestätigen, dann startet die Auswertung hier automatisch."}
              </p>
              {phase === "wartet" && (
                <button
                  type="button"
                  onClick={starten}
                  data-testid="lastgang-bestaetigen"
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700"
                >
                  E-Mail bestätigen
                </button>
              )}
            </div>
          )}
          {phase === "rechnet" && (
            <p role="status" className="mt-3 text-[13.5px] font-medium text-white/80">
              Ihr Lastgang wird ausgewertet …
            </p>
          )}
          {phase === "fehler" && (
            <p role="status" className="mt-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-[13.5px] leading-snug text-white">
              {fehler} Das Beispiel bleibt stehen.
            </p>
          )}
          {phase !== "rechnet" && (
            <button type="button" onClick={dateiWaehlen} className="mt-2 inline-flex min-h-11 items-center text-[13.5px] font-semibold text-white/70 underline underline-offset-4 hover:text-white">
              Andere Datei wählen
            </button>
          )}
        </div>
      )}
      {phase === "fehler" && !datei && (
        <p role="status" className="mt-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-[13.5px] leading-snug text-white">
          {fehler}
        </p>
      )}
      {gate.geradeBestaetigt && phase === "leer" && (
        <p role="status" className="mt-3 text-[13.5px] leading-snug text-ov-200">
          E-Mail bestätigt. Wählen Sie Ihre Datei hier noch einmal – die Auswertung startet sofort.
        </p>
      )}
      {gate.dialog}
    </PanelGeruest>
  );
}
