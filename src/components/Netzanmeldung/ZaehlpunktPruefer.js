"use client";

import { useId, useState } from "react";
import { CircleAlert, CircleCheck, ScanLine } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Formatprüfung einer österreichischen Zählpunktbezeichnung (33 Stellen) direkt im Browser.
 * Aufbau laut TOR Stromzähler (E-Control): AT + 6-stellige Netzbetreibernummer + 5-stellige
 * Postleitzahl + 20-stellige Zählpunktnummer (A–Z, 0–9). Es wird nichts übertragen oder gespeichert.
 *
 * Die Prüfung sagt NICHT, ob es ein Einspeise- oder Bezugszählpunkt ist – das steht nur in den
 * Unterlagen des Netzbetreibers.
 */

const SEGMENTE = [
  { key: "land", label: "Land", von: 0, bis: 2, ton: "bg-ov-500 text-white" },
  { key: "netz", label: "Netzbetreibernummer", von: 2, bis: 8, ton: "bg-navy-800 text-white" },
  { key: "plz", label: "Postleitzahl", von: 8, bis: 13, ton: "bg-sun-400 text-ink-900" },
  { key: "nr", label: "Zählpunktnummer", von: 13, bis: 33, ton: "bg-ink-200 text-ink-900" },
];

// Beispiel aus der TOR Stromzähler (Punkte als Trennzeichen sind laut TOR zulässig)
const BEISPIEL = "AT.008100.08010.0O6G56M11SN51G21M24S";

function normalisieren(wert) {
  return String(wert || "")
    .toUpperCase()
    .replace(/[\s.\-_/]/g, "");
}

function pruefen(roh) {
  const z = normalisieren(roh);
  if (!z) return { z, status: "leer", fehler: [] };
  const fehler = [];
  if (z.length !== 33) fehler.push(`Die Bezeichnung hat ${z.length} statt 33 Stellen.`);
  if (!z.startsWith("AT")) fehler.push("Österreichische Zählpunkte beginnen mit „AT“.");
  if (!/^\d{6}$/.test(z.slice(2, 8))) fehler.push("Stelle 3–8 (Netzbetreibernummer) muss aus Ziffern bestehen.");
  if (!/^\d{5}$/.test(z.slice(8, 13))) fehler.push("Stelle 9–13 (Postleitzahl) muss aus Ziffern bestehen.");
  if (z.length >= 14 && !/^[A-Z0-9]+$/.test(z.slice(13))) fehler.push("Ab Stelle 14 sind nur Großbuchstaben A–Z und Ziffern erlaubt.");
  return { z, status: fehler.length ? "fehler" : "ok", fehler };
}

export default function ZaehlpunktPruefer({ className }) {
  const [wert, setWert] = useState("");
  const id = useId();
  const { z, status, fehler } = pruefen(wert);

  return (
    <div className={cn("rounded-[2rem] bg-white p-5 shadow-[0_40px_80px_-55px_rgba(3,18,43,0.55)] ring-1 ring-ink-200/70 sm:p-7", className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100">
          <ScanLine aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-[17px] font-bold leading-snug text-ink-900">Zählpunkt-Format prüfen</p>
          <p className="text-[13px] text-ink-500">Läuft nur in Ihrem Browser – nichts wird gesendet.</p>
        </div>
      </div>

      <label htmlFor={id} className="mt-5 block text-[13.5px] font-semibold text-ink-700">
        Zählpunktbezeichnung aus Vertrag oder Zählpunktbrief
      </label>
      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        value={wert}
        onChange={(e) => setWert(e.target.value)}
        placeholder="AT 000000 00000 …"
        aria-describedby={`${id}-ergebnis`}
        className="mt-2 h-12 w-full rounded-2xl border-0 bg-sand-50 px-4 font-mono text-[14px] tracking-wide text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ov-500"
      />
      <button type="button" onClick={() => setWert(BEISPIEL)} className="mt-2 text-[13px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
        Beispiel aus der TOR Stromzähler einsetzen
      </button>

      {/* Segmente */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden={status === "leer"}>
        {SEGMENTE.map((s) => {
          const teil = z.slice(s.von, s.bis);
          return (
            <div key={s.key} className="min-w-0 rounded-2xl bg-sand-50 p-3 ring-1 ring-ink-200/60">
              <span className={cn("inline-block rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider", s.ton)}>
                {s.bis - s.von} Stellen
              </span>
              <p className="mt-2 text-[12.5px] font-semibold text-ink-600">{s.label}</p>
              <p className="mt-0.5 break-all font-mono text-[13px] text-ink-900">{teil || "–"}</p>
            </div>
          );
        })}
      </div>

      <div id={`${id}-ergebnis`} aria-live="polite" className="mt-4 min-h-[3rem]">
        {status === "ok" && (
          <p className="flex gap-2 rounded-2xl bg-ov-50 p-3 text-[14px] leading-relaxed text-ink-800 ring-1 ring-ov-100">
            <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
            Das Format stimmt. Ob es der Einspeise- oder der Bezugszählpunkt ist, steht nur in den Unterlagen Ihres Netzbetreibers – für den EAG-Antrag zählt der Einspeisezählpunkt.
          </p>
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
        {status === "leer" && <p className="text-[13.5px] leading-relaxed text-ink-500">Leerzeichen und Punkte zwischen den Blöcken sind erlaubt und werden ignoriert.</p>}
      </div>
    </div>
  );
}
