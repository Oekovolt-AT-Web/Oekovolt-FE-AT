"use client";

// src/components/FlaechenCheck/NetzSteckbrief.js – Werkzeug auf /netzanmeldung/netzkapazitaet (Welle B, Paket B06)
//
// Karte und Ergebnis (Luftlinie zum nächsten Umspannwerk, Links zu den Kapazitätsseiten) sind FREI.
// Nur der individuelle Export „Netz-Steckbrief“ (Textdatei mit Punkt, Stationen und Links für die
// Netzanfrage) läuft über das Lead-Gate, Kennung „netzkapazitaet“ (Stufe 1, Aktion download).
// Statische Inhalte (Links, Erklärungen, ODbL-Datensatz) werden nie gegated.

import { useId, useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import useLeadGate from "@/components/LeadGate/useLeadGate";
import NetzSchritt from "./NetzSchritt";
import { LAENDER } from "@/lib/flaeche/laender";
import { BASE_URL } from "@/lib/site";
import { netzSteckbriefText } from "@/lib/flaeche/netz";
import { KAPAZITAET_GATE, KAPAZITAET_PFAD } from "@/data/netzkapazitaetQuellen";

function herunterladen(text, name) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function NetzSteckbrief({ startLand = "oberoesterreich" }) {
  const landId = useId();
  const [landSlug, setLandSlug] = useState(LAENDER.some((l) => l.slug === startLand) ? startLand : "oberoesterreich");
  const [ergebnis, setErgebnis] = useState(null);
  const land = LAENDER.find((l) => l.slug === landSlug);
  const kontext = useMemo(() => ({ rueckkehr: `${KAPAZITAET_PFAD}#werkzeug` }), []);
  const gate = useLeadGate({ kennung: KAPAZITAET_GATE, modus: "download", kontext });

  const exportieren = () => {
    if (!ergebnis) return;
    const datum = new Date().toLocaleDateString("de-AT");
    const text = netzSteckbriefText({ ...ergebnis, land, datum, basisUrl: BASE_URL });
    gate.ausfuehren("download", () => herunterladen(text, "netz-steckbrief.txt"), {
      titel: "Netz-Steckbrief für Ihre Netzanfrage",
      einleitung: "Karte und Entfernungen sehen Sie frei auf der Seite. Den Steckbrief als Datei schalten Sie einmalig mit Name und E-Mail frei.",
      weiterLabel: "Steckbrief herunterladen",
      ergebnis: {
        Bundesland: land?.name,
        "Luftlinie ab 20 kV (km)": Math.round(ergebnis.vorschlag.mittel.km * 10) / 10,
        "Luftlinie ab 110 kV (km)": ergebnis.vorschlag.hoch ? Math.round(ergebnis.vorschlag.hoch.km * 10) / 10 : null,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={landId} className="mb-2 block text-[14.5px] font-semibold text-ink-800">
          Bundesland der Fläche
        </label>
        <select
          id={landId}
          value={landSlug}
          onChange={(e) => setLandSlug(e.target.value)}
          className="block h-12 w-full cursor-pointer rounded-2xl bg-white px-4 text-[15px] font-semibold text-ink-900 outline-none ring-1 ring-ink-200 transition focus-visible:ring-2 focus-visible:ring-ov-500"
        >
          {LAENDER.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <NetzSchritt bundesland={landSlug} onErgebnis={setErgebnis} startOffen />
      <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 ring-1 ring-ink-200/70 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] leading-relaxed text-ink-600">
          {ergebnis ? "Punkt, Stationen und die passenden Kapazitätsseiten als Datei – zum Weiterleiten an Planer oder Netzbetreiber." : "Markieren Sie zuerst Ihre Fläche – dann können Sie den Netz-Steckbrief herunterladen."}
        </p>
        <button
          type="button"
          onClick={exportieren}
          disabled={!ergebnis}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-ov-600 px-4 py-3 text-[14.5px] font-semibold text-white transition hover:bg-ov-700 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:text-ink-700"
        >
          <FileDown aria-hidden="true" className="h-4 w-4" />
          Netz-Steckbrief herunterladen
        </button>
      </div>
      {gate.dialog}
    </div>
  );
}
