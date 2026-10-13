"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, MailCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";

/**
 * Schlankes Lead-Gate der Stufe 2 (Auswertung erst nach bestätigter E-Mail) für die Dossier-
 * Werkzeuge (Kennung „dossier“, Aktionen „auswertung“ und „pdf“), bis useLeadGate aus Paket A09
 * den Modus „auswertung“ kennt – gleiche Props (aktion, kennung, onFrei), damit die Zusammen-
 * führung ein Import-Tausch ist.
 *
 * Ablauf (Inhaber-Regel 11.10.2026): Vorname, Nachname, E-Mail Pflicht · Telefon optional nach
 * Häkchen · Senden an /api/rechner_lead (A09; Rückfall /api/create_contact) · Wartezustand
 * „Bitte E-Mail bestätigen – Link gesendet an …“ mit „Erneut senden“ (frühestens nach 60 s) ·
 * Freischaltung über /api/lead-gate/status (A09, signiertes Cookie). Ohne Backend läuft ein
 * Entwicklungs-Fallback (Token in der Konsole, Knopf „Bestätigung simulieren“ – nur außerhalb
 * von production). Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO; keine Kopplung an Werbung,
 * Newsletter nur mit eigenem, nicht vorangekreuztem Häkchen.
 */

export const GATE_STAND = "11.10.2026";
const FREI_PRAEFIX = "ov-gate-frei:";
const KONTAKT_SCHLUESSEL = "ov-gate-kontakt";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ERNEUT_NACH_MS = 60_000;
const ABFRAGE_MS = 6_000;
const ENTWICKLUNG = process.env.NODE_ENV !== "production";

/** Freischaltung in diesem Tab (nach bestätigter E-Mail bzw. Entwicklungs-Fallback). */
export function gateFreiGelesen(kennung) {
  try {
    const roh = sessionStorage.getItem(FREI_PRAEFIX + kennung);
    return !!roh && Date.now() - Number(JSON.parse(roh)?.t || 0) < 30 * 86400000;
  } catch {
    return false;
  }
}

/** Kontakt (nur Name/E-Mail/Firma) für die Beschriftung von Dossier und PDF – bleibt im Tab. */
export function gateKontaktGelesen() {
  try {
    const k = JSON.parse(sessionStorage.getItem(KONTAKT_SCHLUESSEL) || "null");
    return k && typeof k === "object" ? { name: String(k.name || ""), email: String(k.email || ""), firma: String(k.firma || "") } : null;
  } catch {
    return null;
  }
}

/** Kopfzeilen für Downloads: im Entwicklungs-Fallback kennzeichnet x-ov-gate-dev die simulierte Bestätigung. */
export function gateKopfzeilen(kennung) {
  const k = { "Content-Type": "application/json" };
  if (ENTWICKLUNG && gateFreiGelesen(kennung)) k["x-ov-gate-dev"] = "1";
  return k;
}

function freiMerken(kennung, kontakt) {
  try {
    sessionStorage.setItem(FREI_PRAEFIX + kennung, JSON.stringify({ t: Date.now() }));
    if (kontakt) sessionStorage.setItem(KONTAKT_SCHLUESSEL, JSON.stringify(kontakt));
  } catch {
    /* ohne Speicher gilt die Freischaltung nur für diese Ansicht */
  }
}

/** Status beim A09-Backend abfragen; { vorhanden: false } wenn die Route (noch) fehlt. */
export async function gateStatusAbfragen(kennung) {
  try {
    const res = await fetch(`/api/lead-gate/status?kennung=${encodeURIComponent(kennung)}`, { cache: "no-store" });
    if (res.status === 404 || res.status === 405) return { vorhanden: false, frei: false };
    const j = await res.json().catch(() => ({}));
    return { vorhanden: true, frei: !!(j.frei || j.freigeschaltet || j.ok === true) };
  } catch {
    return { vorhanden: false, frei: false };
  }
}

export default function LeadGateSchlank({ aktion = "auswertung", kennung = "dossier", onFrei, kennzahlen = {}, segment = "gewerbe", titel, text, className }) {
  const [f, setF] = useState({ vorname: "", nachname: "", firma: "", email: "", telefon: "", kontakt: false, newsletter: false });
  const [fehler, setFehler] = useState({});
  const [status, setStatus] = useState("bereit"); // bereit | sendet | warten | fehler
  const [erneutAb, setErneutAb] = useState(0);
  const [jetzt, setJetzt] = useState(() => Date.now());
  const [backendFehlt, setBackendFehlt] = useState(false);
  const leer = useRef(null); // Honeypot
  const start = useRef(Date.now());
  const id = useId();

  // Bereits freigeschaltet (Rückkehr von /freischalten oder gleicher Tab)?
  useEffect(() => {
    let aktiv = true;
    if (gateFreiGelesen(kennung)) {
      onFrei?.({ aktion, kontakt: gateKontaktGelesen() });
      return undefined;
    }
    gateStatusAbfragen(kennung).then((s) => {
      if (!aktiv) return;
      if (s.frei) {
        freiMerken(kennung, gateKontaktGelesen());
        onFrei?.({ aktion, kontakt: gateKontaktGelesen() });
      }
    });
    return () => {
      aktiv = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kennung]);

  // Im Wartezustand regelmäßig beim Backend nachfragen, Uhr für „Erneut senden“
  useEffect(() => {
    if (status !== "warten") return undefined;
    const uhr = setInterval(() => setJetzt(Date.now()), 1000);
    const abfrage = setInterval(async () => {
      const s = await gateStatusAbfragen(kennung);
      if (!s.vorhanden) setBackendFehlt(true);
      if (s.frei) {
        freiMerken(kennung, { name: `${f.vorname} ${f.nachname}`.trim(), email: f.email.trim(), firma: f.firma.trim() });
        ereignis("lead_gate_bestaetigt", { kennung, aktion });
        onFrei?.({ aktion, kontakt: gateKontaktGelesen() });
      }
    }, ABFRAGE_MS);
    return () => {
      clearInterval(uhr);
      clearInterval(abfrage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, kennung]);

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
    // Rücksprung nach dem Double-Opt-in auf genau diese Seite (inkl. Eingaben in der URL), nicht auf den Standardpfad der Kennung
    const rueckkehr = (window.location.pathname + window.location.search).slice(0, 400);
    const basis = { vorname: f.vorname.trim(), nachname: f.nachname.trim(), firma: f.firma.trim(), email: f.email.trim(), telefon: f.kontakt ? f.telefon.trim() : "", kontakt_ok: f.kontakt ? 1 : 0, newsletter: f.newsletter ? 1 : 0, website: leer.current?.value || "", dauer: Date.now() - start.current };
    try {
      let res = await fetch("/api/rechner_lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basis, kennung, aktion, segment, quelle, rueckkehr, ergebnis: kennzahlen, bestaetigung: "double-opt-in", einwilligung_id: "leadgate-info", einwilligung_version: GATE_STAND }),
      }).catch(() => null);
      if (!res || res.status === 404 || res.status === 405) {
        setBackendFehlt(true);
        res = await fetch("/api/create_contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thema: "Photovoltaik",
            vorname: basis.vorname,
            nachname: basis.nachname,
            firma: basis.firma,
            email: basis.email,
            telefon: basis.telefon,
            nachricht: [`Rechner-Lead: ${kennung} (${aktion}, Double-Opt-in ausstehend – Lead-Gate-Backend A09 fehlt)`, `Seite: ${quelle}`, `Kennzahlen: ${JSON.stringify(kennzahlen).slice(0, 600)}`, `Kontakt erwünscht: ${f.kontakt ? "ja" : "nein"}`].join("\n"),
            einwilligung: 1,
            quelle,
            website: basis.website,
          }),
        }).catch(() => null);
      }
      if (!res || !res.ok) throw new Error(String(res?.status || "netz"));
      ereignis("lead_gate_gesendet", { kennung, aktion, kontakt: f.kontakt ? 1 : 0 });
      if (ENTWICKLUNG) {
        const token = Math.random().toString(36).slice(2, 10);
        console.info(`[Lead-Gate ${kennung}] Entwicklungs-Fallback: Bestätigungs-Token ${token} (24 h, einmal verwendbar) – im Betrieb schickt A11 die Mail mit /freischalten?token=…`);
      }
      setErneutAb(Date.now() + ERNEUT_NACH_MS);
      setStatus("warten");
    } catch {
      setStatus("fehler");
    }
  };

  const simulieren = () => {
    freiMerken(kennung, { name: `${f.vorname} ${f.nachname}`.trim(), email: f.email.trim(), firma: f.firma.trim() });
    ereignis("lead_gate_bestaetigt", { kennung, aktion, simuliert: 1 });
    onFrei?.({ aktion, kontakt: gateKontaktGelesen(), simuliert: true });
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

  if (status === "warten") {
    const restSek = Math.max(0, Math.ceil((erneutAb - jetzt) / 1000));
    return (
      <div className={cn("rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-7", className)} aria-live="polite">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-600 text-white">
            <MailCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[19px] font-extrabold text-ink-900">Bitte E-Mail bestätigen</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-ink-700">
              Link gesendet an <strong className="text-ink-900">{f.email.trim()}</strong>. Nach dem Klick auf den Bestätigungslink startet die Auswertung automatisch auf dieser Seite. Der Link ist 24 Stunden gültig und einmal verwendbar.
            </p>
            <p className="mt-2 text-[13px] text-ink-500">Keine E-Mail? Bitte auch den Spam-Ordner prüfen.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={restSek > 0}
                onClick={senden}
                className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {restSek > 0 ? `Erneut senden (in ${restSek} s)` : "Erneut senden"}
              </button>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-500">
                <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> Warten auf Bestätigung …
              </span>
            </div>
            {ENTWICKLUNG && (
              <div className="mt-4 rounded-2xl bg-sun-300/20 p-3 text-[13px] text-ink-700 ring-1 ring-sun-400/40">
                <p className="font-semibold text-ink-900">Entwicklungs-Fallback{backendFehlt ? " – Lead-Gate-Backend (A09/A11) nicht erreichbar" : ""}</p>
                <p className="mt-0.5">Der Bestätigungs-Token steht in der Browser-Konsole. Für die QA:</p>
                <button type="button" onClick={simulieren} className="mt-2 inline-flex min-h-9 items-center rounded-full bg-navy-950 px-4 text-[13px] font-semibold text-white hover:bg-navy-800">
                  Bestätigung simulieren (nur Entwicklung)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={senden} noValidate className={cn("rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-7", className)} aria-labelledby={`${id}-titel`}>
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-white">
          <Lock aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p id={`${id}-titel`} className="font-display text-[19px] font-extrabold text-ink-900">
            {titel || "Auswertung freischalten"}
          </p>
          <p className="mt-1 text-[14.5px] leading-relaxed text-ink-700">
            {text || "Die individuelle Auswertung erstellen wir für Sie persönlich. Wir brauchen dafür Ihren Namen und eine E-Mail-Adresse, an die wir den Bestätigungslink und das Ergebnis schicken."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {feld("vorname", "Vorname", "text", { pflicht: true, autoComplete: "given-name" })}
        {feld("nachname", "Nachname", "text", { pflicht: true, autoComplete: "family-name" })}
        {feld("firma", "Firma / Gemeinde", "text", { autoComplete: "organization" })}
        {feld("email", "E-Mail", "email", { pflicht: true, autoComplete: "email" })}
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[14px] text-ink-700">
            <input type="checkbox" checked={f.kontakt} onChange={(e) => setF((x) => ({ ...x, kontakt: e.target.checked }))} className="mt-0.5 h-4.5 w-4.5 rounded accent-ov-600" />
            <span>Ich wünsche eine Rückfrage zu meinem Ergebnis – per E-Mail und, falls angegeben, telefonisch.</span>
          </label>
          {f.kontakt && <div className="mt-3 sm:max-w-xs">{feld("telefon", "Telefon (optional)", "tel", { autoComplete: "tel" })}</div>}
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[14px] text-ink-700">
            <input type="checkbox" checked={f.newsletter} onChange={(e) => setF((x) => ({ ...x, newsletter: e.target.checked }))} className="mt-0.5 h-4.5 w-4.5 rounded accent-ov-600" />
            <span>Ich möchte den Ökovolt-Newsletter zu Photovoltaik, Förderungen und Energierecht erhalten (jederzeit abbestellbar).</span>
          </label>
        </div>
      </div>
      <input ref={leer} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
          <span>
            Verarbeitung zur Bereitstellung der Auswertung (Art. 6 Abs. 1 lit. b DSGVO), unabhängig von Werbung. Details in der{" "}
            <Link href="/datenschutz" className="font-semibold text-ov-700 underline underline-offset-2">
              Datenschutzerklärung
            </Link>
            .
          </span>
        </p>
        <button type="submit" disabled={status === "sendet"} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:opacity-60">
          {status === "sendet" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Bestätigungslink senden
        </button>
      </div>
      {status === "fehler" && (
        <p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-[14px] text-red-800 ring-1 ring-red-200">
          Das hat nicht geklappt. Bitte später noch einmal versuchen oder uns direkt schreiben.
        </p>
      )}
    </form>
  );
}
