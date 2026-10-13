"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock, MailCheck, RefreshCw } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { FIRMA } from "@/lib/site";

/**
 * VERALTET (QA-Nacharbeit 12.10.2026): Nicht mehr eingebunden – AngebotPruefer nutzt jetzt
 * useLeadGate aus A09 (Modus „auswertung“, Freischaltung nur über das Server-Cookie). Datei kann nach
 * Freigabe gelöscht werden.
 *
 * Schlankes Lead-Gate der Stufe 2 („Auswertung erst nach bestätigter E-Mail“) für Paket B08, bis
 * src/components/LeadGate/useLeadGate.js (A09) den Modus „auswertung“ anbietet. Gleiche Props wie
 * der Hook-Dialog: aktion, kennung, onFrei (+ kontext, kompakt). Ablauf:
 *   Kontaktdaten (Vorname, Nachname, E-Mail Pflicht; Telefon nur nach Häkchen)
 *   → POST /api/rechner_lead (A09; fehlt die Route: /api/create_contact mit Kennzeichnung „Rechner-Lead“)
 *   → Wartezustand „Bitte E-Mail bestätigen – Link gesendet an …“, Erneut senden frühestens nach 60 s
 *   → Abfrage /api/lead-gate/status (A09, Freischalt-Cookie) alle 6 s und beim Zurückkehren in den Tab
 *   → frei: onFrei({ email }) und lokale Merkung (30 Tage), damit die Seite das Gate nicht erneut zeigt.
 * Ohne Backoffice (Route 404) gibt es im Entwicklungsmodus einen Knopf „Bestätigung simulieren“
 * (Token/Hinweis in der Konsole), damit QA testbar bleibt. Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO,
 * keine Kopplung an Werbung, kein Newsletter.
 */

export const GATE_SPEICHER = "ov-lead-bestaetigt";
const GATE_TAGE = 30;
const ERNEUT_SEKUNDEN = 60;
const ABFRAGE_MS = 6000;
const STAND = "11.10.2026";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ENTWICKLUNG = process.env.NODE_ENV !== "production";

/** Lokale Merkung je Kennung lesen (Zeitstempel, 30 Tage). */
export function gateBestaetigt(kennung) {
  try {
    const roh = JSON.parse(localStorage.getItem(GATE_SPEICHER) || "{}");
    const t = Number(roh?.[kennung]);
    return Number.isFinite(t) && Date.now() - t < GATE_TAGE * 86400000;
  } catch {
    return false;
  }
}

export function gateMerken(kennung) {
  try {
    const roh = JSON.parse(localStorage.getItem(GATE_SPEICHER) || "{}");
    localStorage.setItem(GATE_SPEICHER, JSON.stringify({ ...(roh && typeof roh === "object" ? roh : {}), [kennung]: Date.now() }));
  } catch {}
}

/** Serverseitiger Zustand (Freischalt-Cookie, A09): { bestaetigt: true|false } oder null, wenn die Route fehlt. */
async function statusAbfragen(kennung) {
  try {
    const res = await fetch(`/api/lead-gate/status?kennung=${encodeURIComponent(kennung)}`, { cache: "no-store" });
    if (res.status === 404 || res.status === 405) return null;
    if (!res.ok) return { bestaetigt: false };
    const json = await res.json().catch(() => ({}));
    return { bestaetigt: json?.bestaetigt === true || json?.frei === true || json?.freigegeben === true };
  } catch {
    return { bestaetigt: false };
  }
}

export default function GateAuswertung({ aktion = "auswertung", kennung, kontext, onFrei, titel, einleitung, className }) {
  const [f, setF] = useState({ vorname: "", nachname: "", email: "", telefon: "", kontakt: false });
  const [fehler, setFehler] = useState({});
  const [phase, setPhase] = useState("formular"); // formular | sendet | wartet | frei
  const [sendeFehler, setSendeFehler] = useState(false);
  const [gesendetAn, setGesendetAn] = useState("");
  const [erneutIn, setErneutIn] = useState(0);
  const [ohneBackoffice, setOhneBackoffice] = useState(false);
  const leer = useRef(null); // Honeypot
  const ersterRef = useRef(null);
  const id = useId();

  const freigeben = useCallback(
    (email) => {
      gateMerken(kennung);
      setPhase("frei");
      onFrei?.({ email: email || gesendetAn });
    },
    [kennung, onFrei, gesendetAn]
  );

  // Beim Laden: lokale Merkung oder serverseitiger Cookie-Status (Rückkehr vom Freischalt-Link).
  // Bewusst KEIN URL-Parameter als Abkürzung – freigeschaltet wird nur über das Cookie (A09).
  useEffect(() => {
    let aktiv = true;
    if (gateBestaetigt(kennung)) {
      freigeben();
      return undefined;
    }
    statusAbfragen(kennung).then((s) => {
      if (!aktiv) return;
      if (s === null) setOhneBackoffice(true);
      else if (s.bestaetigt) freigeben();
    });
    return () => {
      aktiv = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kennung]);

  // Wartezustand: Status abfragen (Intervall + Rückkehr in den Tab), Countdown für „Erneut senden“
  useEffect(() => {
    if (phase !== "wartet") return undefined;
    let aktiv = true;
    const pruefen = async () => {
      const s = await statusAbfragen(kennung);
      if (!aktiv) return;
      if (s === null) setOhneBackoffice(true);
      else if (s.bestaetigt) freigeben();
    };
    const intervall = setInterval(() => {
      if (!ohneBackoffice) pruefen();
    }, ABFRAGE_MS);
    const sichtbar = () => document.visibilityState === "visible" && pruefen();
    document.addEventListener("visibilitychange", sichtbar);
    const tick = setInterval(() => setErneutIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => {
      aktiv = false;
      clearInterval(intervall);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", sichtbar);
    };
  }, [phase, kennung, ohneBackoffice, freigeben]);

  useEffect(() => {
    if (phase === "formular") ersterRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const senden = async (e) => {
    e?.preventDefault();
    const neu = {};
    if (!f.vorname.trim()) neu.vorname = "Bitte Vornamen angeben.";
    if (!f.nachname.trim()) neu.nachname = "Bitte Nachnamen angeben.";
    if (!EMAIL.test(f.email.trim())) neu.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (f.kontakt && f.telefon.trim() && f.telefon.replace(/\D/g, "").length < 6) neu.telefon = "Bitte Telefonnummer prüfen.";
    setFehler(neu);
    if (Object.keys(neu).length) return;
    setSendeFehler(false);
    setPhase("sendet");

    const quelle = window.location.pathname;
    const basis = { vorname: f.vorname.trim(), nachname: f.nachname.trim(), email: f.email.trim(), telefon: f.kontakt ? f.telefon.trim() : "", kontakt_ok: f.kontakt ? 1 : 0, website: leer.current?.value || "" };
    const zeilen = [`Rechner-Lead: ${kennung} (${aktion}, E-Mail-Bestätigung ausstehend)`, ...(kontext?.zeilen || []), `Kontakt erwünscht: ${f.kontakt ? "ja" : "nein"}`];

    try {
      let res = await fetch("/api/rechner_lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basis, kennung, aktion, segment: "gewerbe", quelle, ergebnis: kontext?.ergebnis || null, einwilligung_id: "leadgate-info", einwilligung_version: STAND, bestaetigung: "email", rueckkehr: quelle }),
      }).catch(() => null);
      let ersatz = false;
      if (!res || res.status === 404 || res.status === 405) {
        ersatz = true;
        res = await fetch("/api/create_contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thema: "Gewerbe & Industrie", vorname: basis.vorname, nachname: basis.nachname, email: basis.email, telefon: basis.telefon, nachricht: zeilen.join("\n"), einwilligung: 1, quelle, website: basis.website }),
        });
      }
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json().catch(() => ({}));
      ereignis("lead_gate_gesendet", { kennung, aktion, kontakt: f.kontakt ? 1 : 0 });
      setGesendetAn(basis.email);
      if (json?.bestaetigt === true || json?.frei === true) {
        freigeben(basis.email);
        return;
      }
      if (ersatz) {
        setOhneBackoffice(true);
        if (ENTWICKLUNG) console.info(`[Entwicklung] Lead-Gate „${kennung}“ ohne Backoffice: Bestätigungsmail wird nicht versendet – Bestätigung über den Knopf simulieren.`);
      }
      setErneutIn(ERNEUT_SEKUNDEN);
      setPhase("wartet");
    } catch {
      setSendeFehler(true);
      setPhase("formular");
    }
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

  if (phase === "frei") return null;

  if (phase === "wartet") {
    return (
      <section aria-live="polite" className={cn("rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 md:p-8", className)}>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Schritt 2 von 3 · E-Mail bestätigen</p>
        <div className="mt-3 flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100">
            <MailCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[22px] font-extrabold leading-tight text-ink-900">Bitte E-Mail bestätigen</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
              Link gesendet an <strong className="break-all text-ink-900">{gesendetAn}</strong>. Sobald Sie den Bestätigungslink anklicken, startet die Prüfung hier automatisch – der Link gilt 24 Stunden und ist einmal verwendbar.
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">Keine Mail? Bitte auch den Spam-Ordner prüfen. Diese Seite kann geöffnet bleiben.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={erneutIn > 0}
            onClick={senden}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-100 px-5 text-[14.5px] font-semibold text-ink-800 hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            {erneutIn > 0 ? `Erneut senden (${erneutIn} s)` : "Erneut senden"}
          </button>
          <button type="button" onClick={() => setPhase("formular")} className="text-[14px] font-semibold text-ov-700 underline-offset-4 hover:underline">
            Andere Adresse verwenden
          </button>
          {ENTWICKLUNG && ohneBackoffice && (
            <button
              type="button"
              onClick={() => {
                console.info(`[Entwicklung] Lead-Gate „${kennung}“: Bestätigung simuliert (lokale Merkung ${GATE_SPEICHER}, ${GATE_TAGE} Tage).`);
                freigeben();
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-sun-400 px-5 text-[14px] font-semibold text-navy-950"
            >
              Entwicklung: Bestätigung simulieren
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={senden} noValidate aria-labelledby={`${id}-titel`} className={cn("rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 md:p-8", className)}>
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Schritt 2 von 3 · Prüfung freischalten</p>
      <h3 id={`${id}-titel`} className="mt-2 font-display text-[22px] font-extrabold leading-tight text-ink-900">
        {titel || "Prüfpunkte für Ihr Angebot freischalten"}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
        {einleitung || "Wir senden Ihnen den Link zu Ihrem Ergebnis an diese Adresse und beantworten Rückfragen zu diesem Ergebnis (Art. 6 Abs. 1 lit. b DSGVO). Kein Newsletter."} Die Prüfung startet, sobald Sie die E-Mail bestätigt haben.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {feld("vorname", "Vorname", "text", { pflicht: true, autoComplete: "given-name" })}
        {feld("nachname", "Nachname", "text", { pflicht: true, autoComplete: "family-name" })}
        {feld("email", "E-Mail-Adresse", "email", { pflicht: true, autoComplete: "email", breit: true })}
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={f.kontakt} onChange={(e) => setF((x) => ({ ...x, kontakt: e.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
        <span className="text-[13.5px] leading-relaxed text-ink-600">Die {FIRMA.name} darf mich zu diesem Ergebnis kontaktieren – per E-Mail und, wenn ich eine Nummer angebe, telefonisch.</span>
      </label>
      {f.kontakt && <div className="mt-4">{feld("telefon", "Telefonnummer (optional)", "tel", { autoComplete: "tel" })}</div>}
      <input ref={leer} type="text" name="firmenkuerzel" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {sendeFehler && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[13.5px] text-red-800 ring-1 ring-red-200">
          Gerade nicht möglich. Bitte später erneut versuchen oder anrufen:{" "}
          <a href={FIRMA.telefonHref} className="font-semibold underline">
            {FIRMA.telefon}
          </a>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-[12px] text-ink-500">
          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
          Verschlüsselte Übertragung · * Pflichtfeld ·{" "}
          <Link href="/datenschutz#rechner-export" className="underline underline-offset-2 hover:text-ink-800">
            Datenschutz
          </Link>
        </p>
        <button type="submit" disabled={phase === "sendet"} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:cursor-wait disabled:opacity-70">
          {phase === "sendet" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
          Bestätigungslink senden
        </button>
      </div>
    </form>
  );
}
