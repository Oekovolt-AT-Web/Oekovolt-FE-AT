"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck, ScanLine, ShieldCheck } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { SEGMENTE, formatiereZaehlpunkt, zerlegeZaehlpunkt } from "@/data/netzbetreiberKennungen";

/**
 * Zählpunkt-Prüfer: Formatprüfung einer österreichischen Zählpunktbezeichnung
 * (33 Stellen) und Zerlegung in Land, Netzbetreibernummer, Postleitzahl und
 * Zählpunktnummer – samt Zuordnung zum Netzbetreiber über die belegten Kennungen.
 *
 * Datenschutz: Die Eingabe bleibt im React-State dieser Komponente. Sie wird
 * nicht gesendet, nicht im Browser-Speicher oder in der Adresszeile abgelegt,
 * nicht protokolliert und löst kein Analyse-Ereignis aus. Die Logik ist rein
 * (src/data/netzbetreiberKennungen.js) und läuft nur im Browser.
 *
 * Die Prüfung sagt NICHT, ob es ein Einspeise- oder Bezugszählpunkt ist – das
 * steht nur in den Unterlagen des Netzbetreibers.
 */

const TON = { land: "bg-ov-600 text-white", netz: "bg-navy-800 text-white", plz: "bg-sun-400 text-ink-900", nr: "bg-ink-200 text-ink-900" };

// Beispiel aus der TOR Stromzähler (Punkte als Trennzeichen sind laut TOR zulässig)
const BEISPIEL = "AT.008100.08010.0O6G56M11SN51G21M24S";

/**
 * props: betreiberBasis – Pfadpräfix der Betreiberseiten (z. B. "/netzanmeldung"); ohne Angabe kein Link.
 *        kompakt – blendet den Hinweis Einspeise-/Bezugszählpunkt aus (wenn er daneben steht).
 */
export default function ZaehlpunktPruefer({ className, betreiberBasis, kompakt = false }) {
  const [wert, setWert] = useState("");
  const id = useId();
  const { z, status, fehler, teile, plz, betreiber } = zerlegeZaehlpunkt(wert);

  return (
    <div className={cn("rounded-[2rem] bg-white p-5 shadow-[0_40px_80px_-55px_rgba(3,18,43,0.55)] ring-1 ring-ink-200/70 sm:p-7", className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100">
          <ScanLine aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-[17px] font-bold leading-snug text-ink-900">Zählpunkt prüfen und zerlegen</p>
          <p className="text-[13px] text-ink-500">Läuft nur in Ihrem Browser – nichts wird gesendet oder gespeichert.</p>
        </div>
      </div>

      <label htmlFor={id} className="mt-5 block text-[13.5px] font-semibold text-ink-700">
        Zählpunktbezeichnung aus Vertrag, Rechnung oder Zählpunktbrief
      </label>
      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        maxLength={60}
        value={wert}
        onChange={(e) => setWert(e.target.value)}
        placeholder="AT 000000 00000 …"
        aria-describedby={`${id}-ergebnis`}
        className="mt-2 h-12 w-full rounded-2xl border-0 bg-sand-50 px-4 font-mono text-[14px] tracking-wide text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ov-500"
      />
      <div className="mt-1 flex flex-wrap items-center gap-x-4">
        <button type="button" onClick={() => setWert(BEISPIEL)} className="inline-flex min-h-11 items-center text-[13px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
          Beispiel aus der TOR Stromzähler einsetzen
        </button>
        {wert && (
          <button type="button" onClick={() => setWert("")} className="inline-flex min-h-11 items-center text-[13px] font-semibold text-ink-600 underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
            Eingabe löschen
          </button>
        )}
      </div>

      {/* Segmente */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden={status === "leer"}>
        {SEGMENTE.map((s) => (
          <div key={s.key} className="min-w-0 rounded-2xl bg-sand-50 p-3 ring-1 ring-ink-200/60">
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider", TON[s.key])}>
              {s.bis - s.von + 1} Stellen
            </span>
            <p className="mt-2 text-[12.5px] font-semibold text-ink-600">{s.label}</p>
            <p className="mt-0.5 break-all font-mono text-[13px] text-ink-900">{teile[s.key] || "–"}</p>
          </div>
        ))}
      </div>

      <div id={`${id}-ergebnis`} aria-live="polite" className="mt-4 min-h-[3rem] space-y-3">
        {status === "ok" && (
          <>
            <p className="flex gap-2 rounded-2xl bg-ov-50 p-3 text-[14px] leading-relaxed text-ink-800 ring-1 ring-ov-100">
              <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
              <span>
                Das Format stimmt: <span className="font-mono">{formatiereZaehlpunkt(z)}</span>
                {plz ? ` – Postleitzahl der Zählstelle bei Erstvergabe: ${plz}.` : "."}
              </span>
            </p>
            <div className="rounded-2xl bg-sand-50 p-3 text-[14px] leading-relaxed text-ink-800 ring-1 ring-ink-200/60">
              {betreiber ? (
                <>
                  <p>
                    <span className="font-semibold text-ink-900">Netzbetreibernummer {teile.netz}:</span> {betreiber.name}
                    {betreiber.bundesland ? ` (${betreiber.bundesland})` : ""}.
                    {betreiber.beleg !== "primaer" && (
                      <span className="text-ink-600"> Zuordnung laut Marktpartner-Listen Dritter – bitte beim Netzbetreiber prüfen.</span>
                    )}
                  </p>
                  {betreiber.slug && betreiberBasis && (
                    <Link href={`${betreiberBasis}/${betreiber.slug}`} className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                      PV-Anlage bei {betreiber.kurz} anmelden
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  )}
                </>
              ) : (
                <p>
                  <span className="font-semibold text-ink-900">Netzbetreibernummer {teile.netz}:</span> für diese Kennung haben wir keinen belegten Netzbetreiber hinterlegt – vermutlich ein kleinerer Netzbetreiber. Der Name steht auf Ihrer Netzrechnung; die vollständige Liste führt die E-Control.
                </p>
              )}
            </div>
          </>
        )}
        {status === "fehler" && (
          <ul className="space-y-1.5 rounded-2xl bg-sun-300/25 p-3 text-[14px] leading-relaxed text-ink-800 ring-1 ring-sun-400/50">
            {fehler.map((f) => (
              <li key={f} className="flex gap-2">
                <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
                {f}
              </li>
            ))}
          </ul>
        )}
        {status === "leer" && <p className="text-[13.5px] leading-relaxed text-ink-500">Leerzeichen und Punkte zwischen den Blöcken sind erlaubt und werden ignoriert. Groß- und Kleinschreibung spielt keine Rolle.</p>}
        {!kompakt && status !== "leer" && (
          <p className="flex gap-2 text-[13px] leading-relaxed text-ink-600">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
            Ob es der Einspeise- oder der Bezugszählpunkt ist, sieht man der Bezeichnung nicht an – das steht nur in den Unterlagen Ihres Netzbetreibers. Für den EAG-Antrag zählt ausschließlich der Einspeisezählpunkt.
          </p>
        )}
      </div>
    </div>
  );
}
