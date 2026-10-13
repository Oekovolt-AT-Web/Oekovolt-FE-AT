"use client";

// src/app/smart-meter/LastgangUpload.js
//
// Upload-Feld des Smart-Meter-Hubs: Die exportierte Datei wird NICHT hochgeladen. Sie wird im
// Browser geöffnet, kurz auf Lesbarkeit geprüft (Excel-Erkennung, Größe) und dann an die
// Lastgang-Analyse unter /lastgang-analyse?quelle=<slug> übergeben – per Client-Navigation, die
// Datei bleibt dabei als File-Objekt im selben Browserfenster.
//
// Übergabe-Brücke: LastgangAnalyse (Paket A09) besitzt noch keine Schnittstelle für eine
// vorab gewählte Datei. Bis dahin reicht diese Komponente die Datei nach der Navigation an das
// Datei-Eingabefeld der Lastgang-Analyse weiter (DataTransfer + change-Ereignis). Gesucht wird erst ab der
// Ankunft auf /lastgang-analyse (bis 60 s, Navigation selbst darf bis 5 min dauern). Klappt das nicht, liegt die Datei
// bis zum Neuladen unter window.__ovLastgangUebergabe = { file, quelle } bereit; sonst wählt der Besucher
// sie dort erneut – nichts geht verloren.
// Kein fetch(), kein localStorage mit Inhalten; nur die Quellen-Kennung wandert in die URL.

import { useCallback, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { LastgangFehler, dekodiere } from "@/lib/lastgang/parser";
import { HINWEIS_DATENSCHUTZ, lastgangUrl } from "@/data/smartmeter";

const ACCEPT = ".csv,.txt,.tsv,text/csv,text/plain";

const ZIEL_PFAD = "/lastgang-analyse";
const WARTEN_AUF_NAVIGATION_MS = 5 * 60 * 1000; // so lange darf die Client-Navigation dauern (langsames Mobilnetz)
const SUCHEN_NACH_ANKUNFT_MS = 60 * 1000; // so lange wird nach dem Datei-Feld der Analyse gesucht

/**
 * Reicht die Datei nach der Navigation an das Datei-Feld der Lastgang-Analyse weiter.
 * Der Such-Takt zählt erst ab der Ankunft auf /lastgang-analyse (QA C07: Navigationen von 16 s und mehr
 * ließen den alten 15-s-Takt ab Dateiauswahl ins Leere laufen). Ein MutationObserver reagiert sofort,
 * sobald das Feld gerendert ist; ein Intervall fängt Pfadwechsel ohne DOM-Änderung ab.
 */
function dateiWeiterreichen(file, quelle) {
  if (typeof window === "undefined") return;
  // Für die Lastgang-Analyse (A09) bereitlegen, falls ihr Datei-Feld erst nach dem Lead-Gate erscheint:
  // nur im Arbeitsspeicher dieses Fensters, nicht im Browser-Speicher, nichts verlässt das Gerät.
  const uebergabe = { file, quelle, zeit: Date.now() };
  window.__ovLastgangUebergabe = uebergabe;
  if (typeof DataTransfer === "undefined" || typeof MutationObserver === "undefined") return;

  const start = Date.now();
  let ankunft = 0;
  let fertig = false;
  let beobachter = null;
  let takt = null;

  const beenden = () => {
    fertig = true;
    beobachter?.disconnect();
    if (takt) clearInterval(takt);
  };

  const versuch = () => {
    if (fertig) return;
    // Eine neuere Auswahl hat übernommen
    if (window.__ovLastgangUebergabe && window.__ovLastgangUebergabe !== uebergabe) return beenden();
    const jetzt = Date.now();
    if (!window.location.pathname.startsWith(ZIEL_PFAD)) {
      // Noch unterwegs – oder der Besucher ist inzwischen woanders hin gegangen
      if (ankunft || jetzt - start > WARTEN_AUF_NAVIGATION_MS) beenden();
      return;
    }
    if (!ankunft) ankunft = jetzt;
    // Nur das Datei-Feld der Lastgang-Analyse (CSV-Akzeptanz), nicht unser eigenes
    const input = document.querySelector('input[type="file"][accept*="csv"]:not([data-ov-smartmeter])');
    if (input) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        if (window.__ovLastgangUebergabe === uebergabe) delete window.__ovLastgangUebergabe;
      } catch {
        /* Browser ohne beschreibbare files-Liste: Datei bleibt in __ovLastgangUebergabe, Besucher wählt sie dort erneut */
      }
      return beenden();
    }
    if (jetzt - ankunft > SUCHEN_NACH_ANKUNFT_MS) beenden();
  };

  beobachter = new MutationObserver(versuch);
  beobachter.observe(document.body, { childList: true, subtree: true });
  takt = setInterval(versuch, 250);
}

/**
 * props:
 *  quelle   Slug des Netzbetreibers (oder "unbekannt" auf der Übersicht)
 *  name     Anzeigename des Netzbetreibers (optional)
 *  kompakt  schmalere Darstellung
 */
export default function LastgangUpload({ quelle = "unbekannt", name, kompakt = false, className }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const id = useId();
  const [ziehen, setZiehen] = useState(false);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState(null);

  const uebergeben = useCallback(
    async (file) => {
      if (!file) return;
      setFehler(null);
      setLaedt(true);
      try {
        // Nur Lesbarkeit prüfen (Excel, leer, zu groß) – die eigentliche Auswertung macht die Analyse
        const buf = await file.slice(0, 64 * 1024).arrayBuffer();
        dekodiere(new Uint8Array(buf));
        if (file.size > 40 * 1024 * 1024) throw new LastgangFehler("Die Datei ist größer als 40 MB. Bitte höchstens zwölf bis 36 Monate exportieren.", "gross");
        try {
          sessionStorage.setItem("ov-lastgang-quelle", quelle);
        } catch {
          /* ohne Speicher weiter */
        }
        dateiWeiterreichen(file, quelle);
        router.push(lastgangUrl(quelle));
      } catch (e) {
        setLaedt(false);
        setFehler(e instanceof LastgangFehler ? e.message : "Die Datei konnte nicht geöffnet werden. Bitte eine CSV- oder Textdatei mit Viertelstundenwerten wählen.");
      }
    },
    [quelle, router]
  );

  return (
    <div className={cn("rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-6", className)}>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setZiehen(true);
        }}
        onDragLeave={() => setZiehen(false)}
        onDrop={(e) => {
          e.preventDefault();
          setZiehen(false);
          uebergeben(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ov-500 has-[:focus-visible]:ring-offset-2",
          kompakt ? "px-4 py-6" : "px-4 py-8 md:py-10",
          ziehen ? "border-ov-500 bg-ov-50" : "border-ink-200 bg-sand-50 hover:border-ov-400 hover:bg-ov-50/60"
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200">
          {laedt ? <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" /> : <FileUp aria-hidden="true" className="h-6 w-6" />}
        </span>
        <span className="mt-4 font-display text-[17px] font-bold text-ink-900 md:text-[18px]">
          {laedt ? "Datei wird übergeben …" : `Export${name ? ` von ${name}` : ""} hier ablegen oder auswählen`}
        </span>
        <span className="mt-1.5 max-w-md text-[14px] leading-relaxed text-ink-600">
          CSV- oder Textdatei mit Viertelstundenwerten. Sie wird direkt in der Lastgang-Analyse geöffnet – auf Ihrem Gerät, ohne Upload.
        </span>
        <input
          ref={inputRef}
          id={id}
          data-ov-smartmeter="1"
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            uebergeben(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {fehler && (
        <p role="alert" className="mt-3 rounded-2xl bg-sun-300/25 px-4 py-3 text-[14px] leading-relaxed text-ink-800 ring-1 ring-sun-400/50">
          {fehler}
        </p>
      )}
      <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
        {HINWEIS_DATENSCHUTZ}
      </p>
    </div>
  );
}
