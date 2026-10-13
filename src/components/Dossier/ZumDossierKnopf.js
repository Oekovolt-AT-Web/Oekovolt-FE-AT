"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, Check, FolderPlus } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { DOSSIER_EREIGNIS, DOSSIER_MAX, dossierEnthaelt, dossierHinzufuegen, eintragErzeugen } from "@/lib/dossier/ablage";

/**
 * „Zum Dossier hinzufügen“ – legt ein Rechner- oder Check-Ergebnis in der Dossier-Ablage
 * (sessionStorage, siehe src/lib/dossier/ablage.js) ab und verlinkt danach auf /dossier.
 *
 * Props:
 *  - eintrag: { quelle, titel, kennzahlen: [{label, wert, einheit?}], annahmen, stand, art?, eingaben? }
 *             oder eine Funktion, die den Eintrag beim Klick erzeugt (keine Personendaten!)
 *  - dunkel:  Darstellung auf dunklem Hintergrund
 *  - klein:   kompakte Höhe
 *  - deaktiviert: z. B. solange noch kein Ergebnis vorliegt
 *  - stand:   beliebiger Text, der sich mit dem Ergebnis ändert (z. B. Standort + Eingaben) –
 *             ändert er sich, wird der Knopf wieder aktiv und ersetzt beim Klick den alten Eintrag
 *
 * Wird von StandortCheck und FoerderWizard (B07) sowie GewerbePVRechner (B03) und
 * LastgangAnalyse (B11) eingebunden.
 */
export default function ZumDossierKnopf({ eintrag, dunkel = false, klein = false, deaktiviert = false, stand = "", className }) {
  const [zustand, setZustand] = useState("bereit"); // bereit | gespeichert | fehler
  const [anzahl, setAnzahl] = useState(0);
  const [gespeichertBei, setGespeichertBei] = useState(null);

  // Ergebnis hat sich seit dem Ablegen geändert → Knopf wieder anbieten (ersetzt den Eintrag)
  useEffect(() => {
    if (gespeichertBei !== null && gespeichertBei !== stand) setZustand("bereit");
  }, [stand, gespeichertBei]);

  useEffect(() => {
    const lesen = () => {
      try {
        const e = typeof eintrag === "function" ? null : eintragErzeugen(eintrag || {});
        if (e && dossierEnthaelt(e.id)) setZustand("gespeichert");
      } catch {
        /* ohne Speicher bleibt der Knopf im Grundzustand */
      }
    };
    lesen();
    const aufEreignis = (ev) => setAnzahl(Number(ev?.detail?.anzahl) || 0);
    window.addEventListener(DOSSIER_EREIGNIS, aufEreignis);
    return () => window.removeEventListener(DOSSIER_EREIGNIS, aufEreignis);
  }, [eintrag]);

  const hinzufuegen = () => {
    let roh;
    try {
      roh = typeof eintrag === "function" ? eintrag() : eintrag;
    } catch {
      roh = null;
    }
    const r = dossierHinzufuegen(roh || {});
    if (r.ok) {
      setZustand("gespeichert");
      setGespeichertBei(stand);
      setAnzahl(r.liste.length);
      ereignis("dossier_hinzugefuegt", { quelle: String(roh?.quelle || "").slice(0, 60), anzahl: r.liste.length });
    } else {
      setZustand("fehler");
    }
  };

  const basis = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
    klein ? "min-h-11 px-4 text-[13.5px]" : "min-h-11 px-5 text-[14.5px]",
    className
  );

  if (zustand === "gespeichert") {
    return (
      <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
        <span className={cn(basis, dunkel ? "bg-white/10 text-white" : "bg-ov-50 text-ov-800 ring-1 ring-ov-200")}>
          <Check aria-hidden="true" className="h-4 w-4" /> Im Dossier{anzahl ? ` (${anzahl}/${DOSSIER_MAX})` : ""}
        </span>
        <Link href="/dossier" className={cn("inline-flex items-center gap-1.5 text-[14px] font-semibold underline decoration-ov-300 underline-offset-2", dunkel ? "text-white" : "text-ov-700 hover:text-ov-800")}>
          <BookMarked aria-hidden="true" className="h-4 w-4" /> Dossier öffnen
        </Link>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={hinzufuegen}
        disabled={deaktiviert}
        className={cn(basis, dunkel ? "bg-white text-navy-950 hover:bg-ov-50" : "bg-navy-950 text-white hover:bg-navy-800", "disabled:cursor-not-allowed disabled:opacity-50")}
      >
        <FolderPlus aria-hidden="true" className="h-4 w-4" /> Zum Dossier hinzufügen
      </button>
      {zustand === "fehler" && (
        <span role="alert" className={cn("text-[12.5px]", dunkel ? "text-white/80" : "text-red-700")}>
          Konnte nicht abgelegt werden – bitte Browserspeicher erlauben.
        </span>
      )}
    </span>
  );
}
