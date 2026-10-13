"use client";

// src/components/LeadGate/useLeadGate.js – Lead-Gate 2.0 (Welle A, Paket A09)
//
// Hook für alle Werkzeuge mit Gate. Die Freischaltung kommt ausschließlich vom Server
// (/api/lead-gate/status, signiertes HttpOnly-Cookie nach bestätigter E-Mail) – nie aus dem Browserspeicher.
//
//   const gate = useLeadGate({ kennung: "gewerbe-pv", modus: "export", kontext: { titel, mappe: true } });
//   gate.freigegeben          true nach bestätigter E-Mail (Stufe 1: alle Rechner, Stufe 2: diese Kennung)
//   gate.geprueft             Status wurde geladen (vorher Knöpfe nicht als „frei“ zeigen)
//   gate.geradeBestaetigt     Seite wurde über den Bestätigungslink geöffnet (?lead-frei=<kennung>)
//   gate.ausfuehren(aktion, fn, kontextExtra)
//                             frei → fn() sofort; sonst Dialog öffnen und fn als „Weiter“-Knopf im Erfolgszustand
//                             anbieten (Druck und Zwischenablage brauchen einen Klick des Nutzers).
//   gate.oeffnen(aktion, kontextExtra)   Dialog ohne Folgeaktion (Modus „auswertung“: Werkzeug reagiert auf freigegeben)
//   gate.rollen               gewählte Rollen der Entscheider-Mappe
//   gate.dialog               JSX – irgendwo im Werkzeug rendern (bleibt gemountet, Zustand bleibt erhalten)
//
// Modus „auswertung“ (Stufe 2): Die Auswertung startet erst, wenn freigegeben true ist; davor zeigt das
// Werkzeug nur eine gekennzeichnete Beispielvorschau.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LeadGateDialog from "./LeadGateDialog";
import { FREI_EREIGNIS, bestaetigtAusUrl, freigabeEntfernen, statusAbfragen } from "./freigabe";
import { standardRollen } from "@/data/argumentarien";
import { segmentFuer, stufeFuer } from "@/data/leadRechner";
import { ereignis } from "@/lib/statistik";

// Gewählte Rollen der Entscheider-Mappe je Rechner merken: Der Bestätigungslink öffnet meist einen neuen Tab,
// dort soll das PDF dieselben Kapitel enthalten. Nur Rollen-Kennungen, keine personenbezogenen Daten.
const ROLLEN_SPEICHER = "ov-mappe-rollen";

function gespeicherteRollen(kennung) {
  try {
    if (typeof window === "undefined") return null;
    const alle = JSON.parse(window.localStorage.getItem(ROLLEN_SPEICHER) || "{}");
    return Array.isArray(alle?.[kennung]) && alle[kennung].every((r) => typeof r === "string") ? alle[kennung] : null;
  } catch {
    return null;
  }
}

function rollenMerken(kennung, rollen) {
  try {
    const alle = JSON.parse(window.localStorage.getItem(ROLLEN_SPEICHER) || "{}") || {};
    alle[kennung] = rollen;
    window.localStorage.setItem(ROLLEN_SPEICHER, JSON.stringify(alle));
  } catch {
    // Speicher gesperrt (privates Fenster) – dann gelten die Standardrollen
  }
}

export default function useLeadGate({ kennung, modus = "export", kontext = {} } = {}) {
  const [freigegeben, setFreigegeben] = useState(false);
  const [geprueft, setGeprueft] = useState(false);
  const [geradeBestaetigt, setGeradeBestaetigt] = useState(false);
  const [offen, setOffen] = useState(false);
  const [aktion, setAktion] = useState(modus);
  const [extra, setExtra] = useState({});
  const [hatWeiter, setHatWeiter] = useState(false);
  const [rollen, setRollenZustand] = useState(() => kontext.rollen || gespeicherteRollen(kennung) || standardRollen(kontext.segment || segmentFuer(kennung)));
  const setRollen = useCallback(
    (neu) => {
      setRollenZustand(neu);
      if (Array.isArray(neu)) rollenMerken(kennung, neu);
    },
    [kennung],
  );
  const weiterRef = useRef(null);
  const stufe = stufeFuer(kennung);

  // Status beim Laden, beim Zurückkehren in den Tab und wenn ein anderes Gate der Seite frei meldet
  useEffect(() => {
    let aktiv = true;
    if (bestaetigtAusUrl(kennung)) setGeradeBestaetigt(true);
    const laden = async () => {
      const s = await statusAbfragen(kennung);
      if (!aktiv) return;
      if (s) setFreigegeben(s.frei);
      setGeprueft(true);
    };
    laden();
    const beiFrei = (e) => {
      const k = e.detail?.kennung;
      if (k === kennung || (stufe === 1 && stufeFuer(k) === 1)) laden();
    };
    const sichtbar = () => {
      if (document.visibilityState === "visible") laden();
    };
    window.addEventListener(FREI_EREIGNIS, beiFrei);
    document.addEventListener("visibilitychange", sichtbar);
    return () => {
      aktiv = false;
      window.removeEventListener(FREI_EREIGNIS, beiFrei);
      document.removeEventListener("visibilitychange", sichtbar);
    };
  }, [kennung, stufe]);

  const oeffnen = useCallback(
    (a = modus, kontextExtra = {}) => {
      setAktion(a);
      setExtra(kontextExtra);
      setOffen(true);
      ereignis("lead_gate_geoeffnet", { kennung, aktion: a });
    },
    [kennung, modus],
  );

  const ausfuehren = useCallback(
    (a, fn, kontextExtra = {}) => {
      if (freigegeben && a !== "senden") {
        fn?.();
        return;
      }
      weiterRef.current = fn || null;
      setHatWeiter(Boolean(fn));
      oeffnen(a, kontextExtra);
    },
    [freigegeben, oeffnen],
  );

  const schliessen = useCallback(() => setOffen(false), []);

  const beiFrei = useCallback(() => {
    setFreigegeben(true);
    setGeprueft(true);
  }, []);

  const weiter = useCallback(() => {
    const fn = weiterRef.current;
    weiterRef.current = null;
    setHatWeiter(false);
    setOffen(false);
    // Nach dem Schließen ausführen (Druckblatt/Zwischenablage brauchen den Fokus der Seite)
    if (fn) requestAnimationFrame(() => fn());
  }, []);

  const entfernen = useCallback(async () => {
    await freigabeEntfernen();
    setFreigegeben(false);
    ereignis("lead_gate_entfernt", { kennung });
  }, [kennung]);

  const kontextGesamt = useMemo(() => ({ ...kontext, ...extra, rollen }), [kontext, extra, rollen]);

  const dialog = (
    <LeadGateDialog
      offen={offen}
      kennung={kennung}
      aktion={aktion}
      kontext={kontextGesamt}
      onFrei={beiFrei}
      onSchliessen={schliessen}
      onWeiter={hatWeiter || aktion === "auswertung" ? weiter : undefined}
      onRollen={setRollen}
    />
  );

  return { freigegeben, geprueft, geradeBestaetigt, stufe, offen, ausfuehren, oeffnen, schliessen, entfernen, rollen, setRollen, dialog };
}
