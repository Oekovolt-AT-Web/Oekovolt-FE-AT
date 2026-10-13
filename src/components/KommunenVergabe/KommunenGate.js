"use client";

// src/components/KommunenVergabe/KommunenGate.js – schlankes Lead-Gate für die Gemeinde-Werkzeuge (B09)
//
// Übergangslösung mit denselben Props wie useLeadGate/LeadGateDialog aus Paket A09
// (aktion, kennung, onFrei), bis A09 vorliegt – dann wird diese Datei durch useLeadGate ersetzt
// (Übergabe in docs/projekt-doku/anhang/wellen/B09.md). Kennungen: „gemeinderat-vorlage“
// (Amtsvortrag-Download/Druck) und „liegenschafts-check“ (CSV-Export).
//
// Lead-Gate-Regel des Inhabers (11.10.2026), Stufe 1: Ergebnis auf dem Bildschirm frei, jeder
// Download/Druck/Export erst nach dem Gate. Ablauf:
//  1. Vorname, Nachname, E-Mail Pflicht; Telefon nur nach Häkchen (optional). Rechtsgrundlage
//     Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der Unterlage), keine Kopplung an Werbung,
//     kein vorangekreuztes Häkchen.
//  2. POST /api/rechner_lead (A09, bestaetigung: "double-opt-in"); Rückfall /api/create_contact.
//  3. Wartezustand „Bitte E-Mail bestätigen – Link gesendet an …“, „Erneut senden“ frühestens nach
//     60 s, Hinweis auf den Spam-Ordner; Freischaltung über /api/lead-gate/status (A09, Cookie).
//  4. Ohne Backend (Entwicklung/QA): Token im Browser, Bestätigungslink in der Konsole, zusätzlich
//     Knopf „Bestätigung simulieren“ – beides nur außerhalb von production.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CheckCircle2, Loader2, MailCheck, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import useFokusFalle from "@/components/ui/useFokusFalle";
import { FIRMA } from "@/lib/site";
import { ereignis } from "@/lib/statistik";
import { FREI_EREIGNIS, bestaetigtAusUrl, freiMelden, statusAbfragen } from "@/components/LeadGate/freigabe";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STAND = "2026-10-11";
const GUELTIG_MS = 30 * 24 * 60 * 60 * 1000;
const TOKEN_MS = 24 * 60 * 60 * 1000;
const ERNEUT_SEKUNDEN = 60;
const ENTWICKLUNG = process.env.NODE_ENV !== "production";

const freiKey = (kennung) => `ov_gate_${kennung}`;
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
    if (wert == null) window[storage].removeItem(key);
    else window[storage].setItem(key, JSON.stringify(wert));
  } catch {
    /* privater Modus – Freischaltung gilt dann nur bis zum Neuladen */
  }
}

/**
 * Freischalt-Zustand einer Kennung. Im Betrieb zählt allein das HttpOnly-Cookie des Servers
 * (/api/lead-gate/status, A09) – ein Merker im Browserspeicher schaltet dort nichts frei.
 * Nur in der Entwicklung (ohne Backend) gelten zusätzlich der lokale Merker (30 Tage) und die
 * Rückkehr über den Fallback-Link (?gate=<kennung>&token=…).
 * @returns {[boolean, () => void]}
 */
export function useGateFreigabe(kennung) {
  const [frei, setFrei] = useState(false);

  // Wird nur nach bestätigter Freigabe aufgerufen (Statusabfrage des Servers oder – nur in der
  // Entwicklung – „Bestätigung simulieren“/Fallback-Link).
  const freischalten = useCallback(() => {
    if (ENTWICKLUNG) schreibe("localStorage", freiKey(kennung), { t: Date.now() });
    setFrei(true);
    freiMelden(kennung);
  }, [kennung]);

  useEffect(() => {
    let aktiv = true;
    const pruefen = () =>
      statusAbfragen(kennung).then((s) => {
        if (aktiv && s?.frei) setFrei(true);
      });

    if (ENTWICKLUNG) {
      const lokal = lese("localStorage", freiKey(kennung));
      if (lokal?.t && Date.now() - lokal.t < GUELTIG_MS) setFrei(true);
      try {
        const q = new URLSearchParams(window.location.search);
        if (q.get("gate") === kennung && q.get("token")) {
          const merk = lese("sessionStorage", tokenKey(kennung));
          if (merk?.token && merk.token === q.get("token") && Date.now() - merk.t < TOKEN_MS) {
            schreibe("sessionStorage", tokenKey(kennung), null); // einmal verwendbar
            freischalten();
            ereignis("lead_gate_bestaetigt", { kennung, quelle: "fallback" });
          }
          q.delete("gate");
          q.delete("token");
          const s = q.toString();
          window.history.replaceState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}${window.location.hash}`);
        }
      } catch {
        /* URL bleibt unverändert */
      }
    }

    // Rückkehr von /freischalten (?lead-frei=<kennung>): Parameter entfernen, Cookie gilt erst nach der Statusabfrage
    bestaetigtAusUrl(kennung);
    pruefen();

    // Andere Knöpfe derselben Seite oder ein anderer Tab haben freigeschaltet → Server erneut fragen
    const beiFrei = (ev) => {
      if (ev?.detail?.kennung === kennung) pruefen();
    };
    const beiSichtbar = () => {
      if (document.visibilityState === "visible") pruefen();
    };
    window.addEventListener(FREI_EREIGNIS, beiFrei);
    document.addEventListener("visibilitychange", beiSichtbar);
    return () => {
      aktiv = false;
      window.removeEventListener(FREI_EREIGNIS, beiFrei);
      document.removeEventListener("visibilitychange", beiSichtbar);
    };
  }, [kennung, freischalten]);

  return [frei, freischalten];
}

/**
 * Gate-Dialog. Props wie LeadGateDialog (A09): aktion ("download" | "pdf" | "export"), kennung,
 * onFrei, onSchliessen; dazu titel, text, zusammenfassung (nur Kennzahlen, keine Personendaten)
 * und anker (Abschnitt, auf den der Bestätigungslink zurückführt).
 */
export default function KommunenGate({ aktion = "download", kennung, onFrei, onSchliessen, titel, text, zusammenfassung = {}, anker = "" }) {
  const [f, setF] = useState({ vorname: "", nachname: "", email: "", telefon: "", kontakt: false });
  const [fehler, setFehler] = useState({});
  const [status, setStatus] = useState("bereit"); // bereit | sendet | wartet | fehler
  const [erneutIn, setErneutIn] = useState(0);
  const [fallback, setFallback] = useState(false);
  const dialogRef = useRef(null);
  const ersterRef = useRef(null);
  const leer = useRef(null); // Honigtopf
  const id = useId();

  useFokusFalle(true, dialogRef, { beiEscape: onSchliessen, startRef: ersterRef });

  useEffect(() => {
    if (status !== "wartet" || erneutIn <= 0) return undefined;
    const t = setTimeout(() => setErneutIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [status, erneutIn]);

  // Wartezustand: Freischaltung über das Cookie des Backends (A09) abfragen; 404 = noch kein Backend
  useEffect(() => {
    if (status !== "wartet" || fallback) return undefined;
    let aktiv = true;
    const pruefen = async () => {
      try {
        const r = await fetch(`/api/lead-gate/status?${new URLSearchParams({ kennung })}`, { cache: "no-store" });
        if (r.status === 404) {
          if (aktiv) setFallback(true);
          return;
        }
        const j = r.ok ? await r.json() : null;
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
    const basis = {
      vorname: f.vorname.trim(),
      nachname: f.nachname.trim(),
      email: f.email.trim(),
      telefon: f.kontakt ? f.telefon.trim() : "",
      kontakt_ok: f.kontakt ? 1 : 0,
      website: leer.current?.value || "",
    };
    const zeilen = [
      `Werkzeug-Lead: ${kennung} (${aktion}, Double-Opt-in erforderlich)`,
      ...Object.entries(zusammenfassung).map(([k, v]) => `${k}: ${v}`),
      `Kontakt erwünscht: ${f.kontakt ? "ja" : "nein"}`,
      `Rückkehr-URL: ${rueckkehr}`,
    ];

    let erreichbar = false;
    try {
      let res = await fetch("/api/rechner_lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basis,
          kennung,
          aktion,
          segment: "gemeinde",
          quelle,
          rueckkehr,
          bestaetigung: "double-opt-in",
          ergebnis: zusammenfassung,
          einwilligung_id: "leadgate-info",
          einwilligung_version: STAND,
        }),
      }).catch(() => null);
      if (!res || res.status === 404 || res.status === 405) {
        res = await fetch("/api/create_contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thema: "Gemeinde",
            vorname: basis.vorname,
            nachname: basis.nachname,
            email: basis.email,
            telefon: basis.telefon,
            nachricht: zeilen.join("\n"),
            einwilligung: 1,
            quelle,
            website: basis.website,
          }),
        }).catch(() => null);
      }
      erreichbar = Boolean(res?.ok);
    } catch {
      erreichbar = false;
    }

    if (!erreichbar && !ENTWICKLUNG) {
      setStatus("fehler");
      return;
    }
    if (!erreichbar) {
      const token = (window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/-/g, "");
      schreibe("sessionStorage", tokenKey(kennung), { token, t: Date.now() });
      const link = `${rueckkehr}?gate=${encodeURIComponent(kennung)}&token=${token}${anker ? `#${anker}` : ""}`;
      console.info(`[Lead-Gate Entwicklungs-Fallback] Kein Backend erreichbar. Bestätigungslink (24 h, einmal verwendbar):\n${link}`);
      setFallback(true);
    }
    ereignis("lead_gate_gesendet", { kennung, aktion, kontakt: f.kontakt ? 1 : 0 });
    setErneutIn(ERNEUT_SEKUNDEN);
    setStatus("wartet");
  };

  const simulieren = () => {
    if (!ENTWICKLUNG) return;
    schreibe("sessionStorage", tokenKey(kennung), null);
    schreibe("localStorage", freiKey(kennung), { t: Date.now() });
    ereignis("lead_gate_bestaetigt", { kennung, quelle: "simuliert" });
    onFrei?.();
  };

  const feld = (name, label, typ = "text", extra = {}) => (
    <div className={extra.breit ? "sm:col-span-2" : ""}>
      <label htmlFor={`${id}-${name}`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-800">
        {label}
        {extra.pflicht && (
          <span className="text-ov-700" aria-hidden="true">
            {" "}
            *
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
        className={cn(
          "h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset focus:ring-2",
          fehler[name] ? "ring-red-400 focus:ring-red-500" : "ring-ink-200 focus:ring-ov-500",
        )}
      />
      {fehler[name] && (
        <p id={`${id}-${name}-f`} className="mt-1 text-[12.5px] font-medium text-red-700">
          {fehler[name]}
        </p>
      )}
    </div>
  );

  // Portal an document.body und z-[9700]: liegt über Sticky-Header, Schnellzugriffsleiste und
  // Rückruf-Widget (wie RechnerGewerbe/DachGate.js) – sonst verdecken diese den Absende-Knopf.
  const dialog = (
    <div className="fixed inset-0 z-[9700] flex items-end justify-center overflow-y-auto overscroll-contain bg-navy-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6" onClick={onSchliessen}>
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titel`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={senden}
        noValidate
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8"
      >
        <button type="button" onClick={onSchliessen} aria-label="Schließen" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100">
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        {status === "wartet" ? (
          <div aria-live="polite">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Fast geschafft</p>
            <h3 id={`${id}-titel`} className="mt-2 pr-10 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              Bitte E-Mail bestätigen
            </h3>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sand-50 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-ov-700 shadow-sm">
                <MailCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="text-[14px] leading-relaxed text-ink-700">
                Link gesendet an <strong className="break-all text-ink-900">{f.email.trim()}</strong>. Nach dem Klick auf den Bestätigungslink ist der Download freigeschaltet. Der Link ist 24 Stunden
                gültig und einmal verwendbar.
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-600">
              Keine E-Mail? Bitte auch im Spam-Ordner nachsehen. Diese Seite können Sie offen lassen – sie erkennt die Bestätigung automatisch.
            </p>
            {fallback && ENTWICKLUNG && (
              <div className="mt-3 rounded-xl bg-sand-100 p-3 text-[12.5px] leading-relaxed text-ink-700">
                <p>Entwicklungsmodus ohne Backend: Der Bestätigungslink steht in der Browser-Konsole.</p>
                <button type="button" onClick={simulieren} className="mt-2 font-semibold text-ov-800 underline underline-offset-2">
                  Bestätigung simulieren
                </button>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={onSchliessen} className="text-[14px] font-semibold text-ink-700 underline-offset-4 hover:underline">
                Später bestätigen
              </button>
              <button
                type="button"
                disabled={erneutIn > 0}
                onClick={() => senden()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sand-100 px-5 text-[14.5px] font-semibold text-ink-900 hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {erneutIn > 0 ? `Erneut senden (${erneutIn} s)` : "Erneut senden"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Download freischalten</p>
            <h3 id={`${id}-titel`} className="mt-2 pr-10 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              {titel || "Unterlage herunterladen"}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
              {text ||
                "Wir senden Ihnen einen Bestätigungslink an diese Adresse. Nach dem Klick können Sie die Unterlage herunterladen; Rückfragen dazu beantworten wir per E-Mail (Art. 6 Abs. 1 lit. b DSGVO). Kein Newsletter."}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {feld("vorname", "Vorname", "text", { pflicht: true, autoComplete: "given-name" })}
              {feld("nachname", "Nachname", "text", { pflicht: true, autoComplete: "family-name" })}
              {feld("email", "E-Mail-Adresse", "email", { pflicht: true, autoComplete: "email", breit: true })}
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={f.kontakt}
                onChange={(e) => setF((x) => ({ ...x, kontakt: e.target.checked }))}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600"
              />
              <span className="text-[13.5px] leading-relaxed text-ink-600">
                Die {FIRMA.name} darf mich zu dieser Unterlage kontaktieren – per E-Mail und, wenn ich eine Nummer angebe, telefonisch.
              </span>
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
                * Pflichtfeld ·{" "}
                <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink-800">
                  Datenschutz
                </Link>
              </p>
              <button
                type="submit"
                disabled={status === "sendet"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:cursor-wait disabled:opacity-70"
              >
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
