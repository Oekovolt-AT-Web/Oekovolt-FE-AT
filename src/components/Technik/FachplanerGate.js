"use client";

// src/components/Technik/FachplanerGate.js – schlankes Lead-Gate für das Fachplaner-Paket (B04)
//
// Übergangslösung mit denselben Props wie useLeadGate/LeadGateDialog aus Paket A09
// (aktion, kennung, onFrei, onSchliessen). Kennung „fachplaner-paket“ (Eintrag in
// src/data/leadRechner.js als Übergabe an A09/B03). Lead-Gate-Regel des Inhabers vom
// 11.10.2026, Stufe 1: Der Prüfplan bleibt am Bildschirm frei, Druck/PDF erst nach dem Gate
// mit bestätigter E-Mail (Double-Opt-in).
//
// Ablauf:
//  1. Formular: Vorname, Nachname, E-Mail Pflicht; Telefon nur nach Häkchen (optional).
//     Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung des Dokuments), keine Kopplung
//     an Werbe-Einwilligung, kein vorangekreuztes Häkchen, Datenschutz verlinkt.
//  2. POST /api/rechner_lead (A09). Kein Rückfall auf /api/create_contact mehr: der verlangte eine
//     Einwilligung, die dieses Gate nicht abfragt, und kennt keinen Double-Opt-in.
//  3. Wartezustand „Bitte E-Mail bestätigen – Link gesendet an …“, „Erneut senden“ frühestens
//     nach 60 s, Hinweis auf den Spam-Ordner. Freischaltung über /api/lead-gate/status (A09,
//     signiertes HttpOnly-Cookie, 30 Tage).
//  4. Entwicklung/QA: liefert /api/rechner_lead einen Entwicklungslink (bestaetigung "entwicklung"),
//     zeigt der Dialog ihn direkt an. Ist die Route gar nicht erreichbar (404/405/503), erzeugt der
//     Browser ein Token und schreibt den Link in die Konsole; Rückkehr über ?gate=<kennung>&token=…
//     schaltet frei (useGateFreigabe). In Produktion gibt es keinen Browser-Rückfall: ohne Backend
//     erscheint die Fehlermeldung mit Telefonnummer.
//  5. Overlay per Portal an document.body mit z-[9700] wie die übrigen Dialoge der Website (liegt
//     über Kopfzeile und mobiler Schnellzugriff-Leiste); das Formular scrollt bei kleiner Höhe selbst.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CheckCircle2, Loader2, MailCheck, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { FIRMA } from "@/lib/site";
import { ereignis } from "@/lib/statistik";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INFO_VERSION = "1"; // Hinweistext „leadgate-info“ (src/lib/einwilligungen.js)
const KONTAKT_VERSION = "1"; // Text „leadgate-kontakt“
const GUELTIG_MS = 30 * 24 * 60 * 60 * 1000;
const ERNEUT_SEKUNDEN = 60;
const ENTWICKLUNG = process.env.NODE_ENV !== "production";

const speicherKey = (kennung) => `ov_gate_${kennung}`;
const tokenKey = (kennung) => `ov_gate_token_${kennung}`;

function lese(storage, key) {
  try {
    const roh = window[storage].getItem(key);
    return roh ? JSON.parse(roh) : null;
  } catch {
    return null;
  }
}
function schreibe(storage, key, wert) {
  try {
    window[storage].setItem(key, JSON.stringify(wert));
  } catch {
    /* privater Modus – Freischaltung gilt nur für diese Sitzung */
  }
}

/** Freischalt-Zustand einer Gate-Kennung (lokal 30 Tage, Backend-Cookie, Rückkehr vom Bestätigungslink). */
export function useGateFreigabe(kennung) {
  const [frei, setFrei] = useState(false);

  const freischalten = useCallback(() => {
    schreibe("localStorage", speicherKey(kennung), { t: Date.now() });
    setFrei(true);
  }, [kennung]);

  useEffect(() => {
    let aktiv = true;
    const lokal = lese("localStorage", speicherKey(kennung));
    if (lokal?.t && Date.now() - lokal.t < GUELTIG_MS) setFrei(true);

    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get("gate") === kennung && q.get("token")) {
        const merk = lese("sessionStorage", tokenKey(kennung));
        if (merk?.token && merk.token === q.get("token") && Date.now() - merk.t < 24 * 60 * 60 * 1000) {
          freischalten();
          try {
            window.sessionStorage.removeItem(tokenKey(kennung)); // einmal verwendbar
          } catch {
            /* ignorieren */
          }
          ereignis("lead_gate_bestaetigt", { kennung, quelle: "fallback" });
        }
        q.delete("gate");
        q.delete("token");
        const s = q.toString();
        window.history.replaceState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}${window.location.hash}`);
      }
    } catch {
      /* URL unverändert lassen */
    }

    fetch(`/api/lead-gate/status?${new URLSearchParams({ kennung })}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (aktiv && j?.frei) freischalten();
      })
      .catch(() => {});
    return () => {
      aktiv = false;
    };
  }, [kennung, freischalten]);

  return [frei, freischalten];
}

/**
 * Gate-Dialog. Props wie LeadGateDialog (A09): aktion ("pdf" | "download" | "auswertung"),
 * kennung, onFrei, onSchliessen; zusammenfassung (nur Kennzahlen), titel/text, rueckkehrHash.
 */
export default function FachplanerGate({ aktion = "pdf", kennung = "fachplaner-paket", onFrei, onSchliessen, zusammenfassung = {}, titel, text, rueckkehrHash = "" }) {
  const [f, setF] = useState({ vorname: "", nachname: "", email: "", telefon: "", kontakt: false });
  const [fehler, setFehler] = useState({});
  const [status, setStatus] = useState("bereit"); // bereit | sendet | wartet | fehler
  const [erneutIn, setErneutIn] = useState(0);
  const [fallback, setFallback] = useState(false); // Browser-Token erzeugt (Link in der Konsole)
  const [devLink, setDevLink] = useState(""); // Entwicklungslink der A09-Route
  const ersterRef = useRef(null);
  const leer = useRef(null); // Honeypot
  const id = useId();

  useEffect(() => {
    ersterRef.current?.focus();
    const esc = (e) => e.key === "Escape" && onSchliessen?.();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onSchliessen]);

  useEffect(() => {
    if (status !== "wartet" || erneutIn <= 0) return undefined;
    const t = setTimeout(() => setErneutIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [status, erneutIn]);

  useEffect(() => {
    if (status !== "wartet" || fallback) return undefined;
    let aktiv = true;
    const pruefen = async () => {
      try {
        const r = await fetch(`/api/lead-gate/status?${new URLSearchParams({ kennung })}`, { cache: "no-store" });
        if (!r.ok) return; // 404/422: kein Status-Backend – Rückkehr über Link/Token schaltet frei
        const j = await r.json();
        if (aktiv && j?.frei) {
          ereignis("lead_gate_bestaetigt", { kennung, quelle: "backend" });
          onFrei?.();
        }
      } catch {
        /* nächster Versuch */
      }
    };
    pruefen();
    const t = setInterval(pruefen, 8000);
    return () => {
      aktiv = false;
      clearInterval(t);
    };
  }, [status, fallback, kennung, onFrei]);

  const lokalerRueckfall = (rueckkehr) => {
    const token = (window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/-/g, "");
    schreibe("sessionStorage", tokenKey(kennung), { token, t: Date.now() });
    const link = `${rueckkehr}?gate=${encodeURIComponent(kennung)}&token=${token}${rueckkehrHash}`;
    console.info(`[Lead-Gate Entwicklungs-Fallback] Kein Backend erreichbar. Bestätigungslink (24 h, einmal verwendbar):\n${link}`);
    setFallback(true);
  };

  const senden = async (e) => {
    e?.preventDefault();
    const neu = {};
    if (!f.vorname.trim()) neu.vorname = "Bitte Vornamen angeben.";
    if (!f.nachname.trim()) neu.nachname = "Bitte Nachnamen angeben.";
    if (!EMAIL.test(f.email.trim())) neu.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (f.kontakt && f.telefon.trim() && f.telefon.replace(/\D/g, "").length < 6) neu.telefon = "Bitte Telefonnummer prüfen.";
    setFehler(neu);
    if (Object.keys(neu).length) return;
    setStatus("sendet");

    const quelle = window.location.pathname;
    const rueckkehr = `${window.location.origin}${window.location.pathname}`;
    const nutzdaten = {
      vorname: f.vorname.trim(),
      nachname: f.nachname.trim(),
      email: f.email.trim(),
      telefon: f.kontakt ? f.telefon.trim() : "",
      kontakt_ok: f.kontakt ? 1 : 0,
      website: leer.current?.value || "",
      kennung,
      aktion,
      segment: "gewerbe",
      quelle,
      rueckkehr: `${window.location.pathname}${rueckkehrHash}`,
      ergebnis: zusammenfassung,
      einwilligung_id: "leadgate-info",
      einwilligung_version: INFO_VERSION,
      ...(f.kontakt ? { kontakt_version: KONTAKT_VERSION } : {}),
    };

    let res = null;
    let j = null;
    try {
      res = await fetch("/api/rechner_lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nutzdaten) });
      j = await res.json().catch(() => null);
    } catch {
      res = null;
    }

    // Feldfehler der Route (gleiche Prüfung wie im Browser, z. B. Sonderzeichen im Namen)
    if (res?.status === 422 && j?.felder && j.code !== "kennung") {
      setFehler(j.felder);
      setStatus("bereit");
      return;
    }
    const keinBackend = !res || [404, 405, 503].includes(res.status);
    if (!res?.ok) {
      if (keinBackend && ENTWICKLUNG) {
        lokalerRueckfall(rueckkehr);
      } else {
        setStatus("fehler");
        return;
      }
    } else if (ENTWICKLUNG && j?.entwicklung_link) {
      setDevLink(j.entwicklung_link);
    }
    ereignis("lead_gate_gesendet", { kennung, aktion, kontakt: f.kontakt ? 1 : 0 });
    setErneutIn(ERNEUT_SEKUNDEN);
    setStatus("wartet");
  };

  const feld = (name, label, typ = "text", extra = {}) => (
    <div className={extra.breit ? "sm:col-span-2" : ""}>
      <label htmlFor={`${id}-${name}`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-800">
        {label}
        {extra.pflicht && (
          <span className="text-ov-600" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      <input
        ref={name === "vorname" ? ersterRef : undefined}
        id={`${id}-${name}`}
        name={name}
        type={typ}
        value={f[name]}
        autoComplete={extra.autoComplete}
        required={!!extra.pflicht}
        aria-invalid={!!fehler[name]}
        aria-describedby={fehler[name] ? `${id}-${name}-f` : undefined}
        onChange={(e) => setF((x) => ({ ...x, [name]: e.target.value }))}
        className={cn("h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset focus:ring-2", fehler[name] ? "ring-red-400 focus:ring-red-500" : "ring-ink-200 focus:ring-ov-500")}
      />
      {fehler[name] && (
        <p id={`${id}-${name}-f`} className="mt-1 text-[12.5px] font-medium text-red-700">
          {fehler[name]}
        </p>
      )}
    </div>
  );

  const dialog = (
    <div className="pp-nicht-drucken fixed inset-0 z-[9700] flex items-end justify-center overflow-y-auto overscroll-contain bg-navy-950/60 p-2 backdrop-blur-sm sm:items-center sm:p-6" onClick={onSchliessen}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titel`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={senden}
        noValidate
        className="relative max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-[1.75rem] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2rem] sm:p-6 md:p-8"
      >
        <button type="button" onClick={onSchliessen} aria-label="Schließen" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100">
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        {status === "wartet" ? (
          <div aria-live="polite">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Fast geschafft</p>
            <h3 id={`${id}-titel`} className="mt-2 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              Bitte E-Mail bestätigen
            </h3>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200/60">
                <MailCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="text-[14px] leading-relaxed text-ink-700">
                Link gesendet an <strong className="text-ink-900">{f.email.trim()}</strong>. Nach dem Klick auf den Bestätigungslink ist der Druck freigeschaltet. Der Link ist 24 Stunden gültig und einmal verwendbar.
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-600">Keine E-Mail? Bitte auch im Spam-Ordner nachsehen. Diese Seite können Sie offen lassen – sie erkennt die Bestätigung automatisch.</p>
            {ENTWICKLUNG && devLink && (
              <p className="mt-3 rounded-xl bg-sun-300/20 p-3 text-[12.5px] leading-relaxed text-ink-700">
                Entwicklungsmodus ohne Mailversand:{" "}
                <a href={devLink} className="font-semibold text-ink-900 underline underline-offset-2">
                  Bestätigungslink öffnen
                </a>{" "}
                (steht auch in der Server-Konsole).
              </p>
            )}
            {ENTWICKLUNG && fallback && !devLink && (
              <p className="mt-3 rounded-xl bg-sun-300/20 p-3 text-[12.5px] leading-relaxed text-ink-700">Entwicklungsmodus ohne Backend: Der Bestätigungslink steht in der Browser-Konsole.</p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={onSchliessen} className="min-h-11 text-[14px] font-semibold text-ink-700 underline-offset-4 hover:underline">
                Später bestätigen
              </button>
              <button type="button" disabled={erneutIn > 0} onClick={() => senden()} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60">
                {erneutIn > 0 ? `Erneut senden (${erneutIn} s)` : "Erneut senden"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{aktion === "auswertung" ? "Auswertung freischalten" : "Druck freischalten"}</p>
            <h3 id={`${id}-titel`} className="mt-2 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              {titel || "Ihr Inbetriebnahme-Prüfplan als Ausdruck oder PDF"}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
              {text || "Wir senden Ihnen einen Bestätigungslink an diese Adresse. Nach dem Klick ist der Druck freigeschaltet; Rückfragen zu diesem Prüfplan beantworten wir per E-Mail (Art. 6 Abs. 1 lit. b DSGVO). Kein Newsletter."}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {feld("vorname", "Vorname", "text", { pflicht: true, autoComplete: "given-name" })}
              {feld("nachname", "Nachname", "text", { pflicht: true, autoComplete: "family-name" })}
              {feld("email", "E-Mail-Adresse", "email", { pflicht: true, autoComplete: "email", breit: true })}
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={f.kontakt} onChange={(e) => setF((x) => ({ ...x, kontakt: e.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
              <span className="text-[13.5px] leading-relaxed text-ink-600">Die {FIRMA.name} darf mich zu diesem Prüfplan kontaktieren – per E-Mail und, wenn ich eine Nummer angebe, telefonisch.</span>
            </label>
            {f.kontakt && <div className="mt-4">{feld("telefon", "Telefonnummer (optional)", "tel", { autoComplete: "tel" })}</div>}
            <input ref={leer} type="text" name="firmenkuerzel" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

            {status === "fehler" && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[13.5px] text-red-800">
                Gerade nicht möglich. Bitte später erneut versuchen oder anrufen:{" "}
                <a href={FIRMA.telefonHref} className="font-semibold underline">
                  {FIRMA.telefon}
                </a>
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] text-ink-500">
                Verschlüsselte Übertragung · * Pflichtfeld ·{" "}
                <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink-800">
                  Datenschutz
                </Link>
              </p>
              <button type="submit" disabled={status === "sendet"} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:cursor-wait disabled:opacity-70">
                {status === "sendet" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
                Bestätigungslink senden
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );

  return typeof document === "undefined" ? dialog : createPortal(dialog, document.body);
}
