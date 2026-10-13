"use client";

// src/components/GewerbeUnikat/K1Ablage.js
//
// K1 · Gemeinsamer Ablauf „Eigener Lastgang“ für ZWEI Stellen der Seite: die Ablage direkt am Teppich
// (Drag-and-drop auf die Fläche, Knopf nach der Sonne) und das Panel darunter (mit Netzbetreiber-Hilfe).
// Beide Inseln laden getrennt nach (next/dynamic) – der Zustand liegt deshalb hier auf Modulebene
// (useSyncExternalStore), nicht in einer der beiden Komponenten. Jede Stelle hat ihr eigenes useLeadGate:
// Bestätigt der Besucher in einem Dialog, meldet das Gate die Freigabe seitenweit (FREI_EREIGNIS), und
// beide Instanzen lesen den Status neu. Ausgewertet wird trotzdem nur EINMAL (Wächter in auswerten()).
//
// Ablauf (Lead-Gate-Regel 11.10.2026, Gate „lastgang-analyse“, modus „auswertung“):
//   leer → Datei gewählt (bleibt NUR im Arbeitsspeicher, wird NICHT gelesen) → gate.oeffnen("auswertung")
//   → Dialog offen („dialog“) → Dialog zu ohne Freigabe („wartet“, neutral formuliert: ob eine Mail
//   unterwegs ist, weiß die Seite nicht) → gate.freigegeben → eigeneDateiAuswerten(file, { freigegeben: true })
//   → alle Kapitel zeigen quelle "eigen". Fehler: Meldung, das Beispiel bleibt stehen.
// Datenschutz: Die Datei verlässt den Browser nicht; Statistik-Ereignisse tragen nur den Schritt.

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import useLeadGate from "@/components/LeadGate/useLeadGate";
import { ereignis } from "@/lib/statistik";
import { eigeneDateiAuswerten, zumBeispiel } from "./_daten";
import { STECKBRIEF_START, steckbrief } from "./_steckbrief";

export const GATE_KONTEXT = {
  titel: "Ihren Lastgang auf dieser Seite auswerten",
  einleitung:
    "Ihre Datei bleibt auf Ihrem Gerät – übertragen werden nur Name und E-Mail. Nach der Bestätigung färbt sich der Teppich mit Ihren Viertelstundenwerten, und die Kapitel zu Anlagengröße, Stromrechnung, Leistungspreis und Wirtschaftlichkeit rechnen damit.",
  segment: "gewerbe",
  anker: "lastgang",
};
const MAX_BYTES = 40 * 1024 * 1024; // Grenze des Parsers (src/lib/lastgang/parser.js)

const START = Object.freeze({ datei: null, phase: "leer", fehler: "" }); // phase: leer | gewaehlt | dialog | wartet | rechnet | fehler
let z = START;
const hoerer = new Set();
function setze(teil) {
  z = { ...z, ...teil };
  for (const h of hoerer) h();
}
const abonnieren = (cb) => {
  hoerer.add(cb);
  return () => hoerer.delete(cb);
};
const lesen = () => z;
const lesenServer = () => START;

/** Zustand der Ablage (beide Stellen sehen denselben). */
export function useK1Ablage() {
  return useSyncExternalStore(abonnieren, lesen, lesenServer);
}

/** Wertet die gewählte Datei aus – nur nach Freigabe, nur einmal gleichzeitig. */
async function auswerten() {
  const f = z.datei;
  if (!f || z.phase === "rechnet") return;
  setze({ phase: "rechnet", fehler: "" });
  ereignis("lastgang_eigen", { schritt: "auswertung" });
  try {
    const l = await eigeneDateiAuswerten(f, { freigegeben: true });
    steckbrief.setze({ quelle: "eigen", jahresverbrauchKwh: Math.round(l.jahresverbrauch) }, "k1");
    setze({ phase: "leer" });
    ereignis("lastgang_eigen", { schritt: "ausgewertet", hochgerechnet: Boolean(l.hochgerechnet) });
  } catch (e) {
    setze({ phase: "fehler", fehler: e?.message || "Die Datei konnte nicht ausgewertet werden." });
    ereignis("lastgang_eigen", { schritt: "fehler", code: String(e?.code || "unbekannt") });
  }
}

/** Zurück zum synthetischen Beispiel (eigene Daten werden verworfen). */
export function ablageZurueck() {
  zumBeispiel();
  steckbrief.setze({ quelle: "beispiel", jahresverbrauchKwh: STECKBRIEF_START.jahresverbrauchKwh });
  setze({ datei: null, phase: "leer", fehler: "" });
  ereignis("lastgang_eigen", { schritt: "zurueck" });
}

/** Erste Datei aus einem Drag-Ereignis bzw. Datei-Eingabe, sonst null. */
export const dateiAus = (liste) => (liste && liste.length ? liste[0] : null);

/** true, wenn ein Drag-Ereignis Dateien trägt (Text oder Links zählen nicht). */
export const traegtDateien = (e) => Array.from(e?.dataTransfer?.types || []).includes("Files");

/**
 * Gate + Ablauf für EINE Stelle (Teppich oder Panel). Gibt das Gate (für gate.dialog) und die Aktionen
 * zurück. Mehrere Stellen dürfen den Hook gleichzeitig benutzen.
 */
export function useK1Gate({ fokus } = {}) {
  const gate = useLeadGate({ kennung: "lastgang-analyse", modus: "auswertung", kontext: GATE_KONTEXT });
  const { phase, datei } = useK1Ablage();
  const { freigegeben, offen } = gate;

  // Freigabe kommt (Statusabfrage nach dem Bestätigungslink, Rückkehr in den Tab) → wartende Datei auswerten
  useEffect(() => {
    if ((phase === "dialog" || phase === "wartet") && freigegeben && datei) auswerten();
  }, [phase, freigegeben, datei]);

  // Dialog dieser Stelle geschlossen, ohne dass die Freigabe da ist → neutral „wartet“ (nicht „Mail unterwegs“)
  const warOffen = useRef(false);
  useEffect(() => {
    if (offen) {
      warOffen.current = true;
      return;
    }
    if (warOffen.current) {
      warOffen.current = false;
      if (z.phase === "dialog" && !freigegeben) setze({ phase: "wartet" });
      // Fokus-Rückgabe (Jury 13.10.2026): Der auslösende Knopf ist beim Schließen schon ersetzt („wartet“,
      // „rechnet“ oder das Ergebnis-Panel) – der Fokus fiele auf <body>. Dann auf das Ziel dieser Stelle setzen.
      if (typeof fokus === "function") {
        requestAnimationFrame(() => {
          const aktiv = document.activeElement;
          if (aktiv && aktiv !== document.body && aktiv.isConnected) return;
          const ziel = fokus();
          if (ziel) {
            if (!ziel.matches("button, a, input, select, textarea, [tabindex]")) ziel.setAttribute("tabindex", "-1");
            ziel.focus({ preventScroll: false });
          }
        });
      }
    }
  }, [offen, freigegeben, fokus]);

  const waehlen = useCallback(
    (f, wo = "panel") => {
      if (!f) return;
      if (f.size > MAX_BYTES) {
        setze({ datei: null, phase: "fehler", fehler: "Die Datei ist größer als 40 MB. Bitte exportieren Sie höchstens zwölf bis 36 Monate Viertelstundenwerte." });
        return;
      }
      setze({ datei: f, phase: "gewaehlt", fehler: "" });
      ereignis("lastgang_eigen", { schritt: "datei_gewaehlt", wo });
      // Schon freigeschaltet (z. B. nach dem Bestätigungslink in diesem Tab): sofort auswerten
      if (freigegeben) auswerten();
    },
    [freigegeben]
  );

  const oeffneGate = gate.oeffnen;
  const starten = useCallback(() => {
    if (!z.datei) return;
    if (freigegeben) {
      auswerten();
      return;
    }
    setze({ phase: "dialog" });
    ereignis("lastgang_eigen", { schritt: "gate" });
    oeffneGate("auswertung", { titel: GATE_KONTEXT.titel });
  }, [freigegeben, oeffneGate]);

  return { gate, phase, datei, waehlen, starten };
}
