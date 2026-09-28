"use client";

// src/components/Partner/Formularteile.js
//
// Gemeinsame Formularbausteine für die Community-Formulare
// (Elektro-Partner, PV Award, Sponsoring). Optik und Verhalten wie im
// Kontaktformular (src/components/Kontakt/KontaktFormular.js): runde Felder,
// Inline-Fehler mit aria-describedby, Honeypot „website“, Erfolgszustand.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Loader2, Mail, Phone } from "lucide-react";
import { FIRMA } from "@/lib/site";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const telefonOk = (w) => w.replace(/\D/g, "").length >= 6;
export const urlOk = (w) => {
  try {
    const u = new URL(w);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

const basis =
  "w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-inset transition-all placeholder:text-ink-500 focus:ring-2";
const klassen = (fehler) => `${basis} ${fehler ? "ring-red-400 focus:ring-red-500" : "ring-ink-200 hover:ring-ink-300 focus:ring-ov-500"}`;

export function Fehler({ id, children }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[13.5px] font-medium text-red-700">
      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

/**
 * Eingabefeld (input, textarea oder select).
 * art: "input" | "textarea" | "select"; optionen nur bei select.
 */
export function Feld({ id, name, label, wert, setze, fehler, pflicht = false, hinweis, art = "input", optionen = [], className, ...rest }) {
  const fid = `${id}-${name}`;
  const beschreibung = [fehler ? `${fid}-fehler` : null, hinweis ? `${fid}-hinweis` : null].filter(Boolean).join(" ") || undefined;
  const gemeinsam = {
    id: fid,
    name,
    value: wert,
    onChange: (e) => setze(name, e.target.value),
    "aria-invalid": fehler ? true : undefined,
    "aria-describedby": beschreibung,
    required: pflicht || undefined,
    ...rest,
  };
  return (
    <div className={["min-w-0", className].filter(Boolean).join(" ")}>
      <label htmlFor={fid} className="mb-2 flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink-800">
        <span>
          {label} {pflicht ? <span className="text-ov-600" aria-hidden="true">*</span> : <span className="font-normal text-ink-500">(optional)</span>}
        </span>
        {hinweis && (
          <span id={`${fid}-hinweis`} className="text-right text-[12.5px] font-normal text-ink-500">
            {hinweis}
          </span>
        )}
      </label>
      {art === "textarea" ? (
        <textarea rows={5} className={`${klassen(fehler)} resize-y py-3.5 leading-relaxed`} {...gemeinsam} />
      ) : art === "select" ? (
        <select className={`${klassen(fehler)} h-13 cursor-pointer`} {...gemeinsam}>
          <option value="">Bitte wählen</option>
          {optionen.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input className={`${klassen(fehler)} h-13`} {...gemeinsam} />
      )}
      {fehler && <Fehler id={`${fid}-fehler`}>{fehler}</Fehler>}
    </div>
  );
}

/** Mehrfachauswahl als Checkbox-Chips in einem fieldset. */
export function Mehrfachauswahl({ id, name, legende, optionen, werte, setze, fehler, pflicht = false, hinweis }) {
  const fid = `${id}-${name}`;
  const umschalten = (o) => setze(name, werte.includes(o) ? werte.filter((w) => w !== o) : [...werte, o]);
  return (
    <fieldset aria-describedby={fehler ? `${fid}-fehler` : hinweis ? `${fid}-hinweis` : undefined} aria-invalid={fehler ? true : undefined}>
      <legend className="mb-3 text-[14px] font-semibold text-ink-800">
        {legende} {pflicht ? <span className="text-ov-600" aria-hidden="true">*</span> : <span className="font-normal text-ink-500">(optional)</span>}
      </legend>
      {hinweis && (
        <p id={`${fid}-hinweis`} className="-mt-1.5 mb-3 text-[13px] text-ink-500">
          {hinweis}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {optionen.map((o) => {
          const aktiv = werte.includes(o);
          return (
            <label
              key={o}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-all focus-within:ring-2 focus-within:ring-ov-500 ${
                aktiv ? "bg-ov-600 text-white shadow-[0_6px_16px_-6px_rgba(102,153,51,0.7)]" : "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
              }`}
            >
              <input type="checkbox" name={name} value={o} checked={aktiv} onChange={() => umschalten(o)} className="sr-only" />
              {aktiv && <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />}
              {o}
            </label>
          );
        })}
      </div>
      {fehler && <Fehler id={`${fid}-fehler`}>{fehler}</Fehler>}
    </fieldset>
  );
}

/** Checkbox mit Text (Einwilligungen). */
export function Haken({ id, name, wert, setze, fehler, children }) {
  const fid = `${id}-${name}`;
  return (
    <div>
      <label htmlFor={fid} className="flex cursor-pointer items-start gap-3">
        <input
          id={fid}
          type="checkbox"
          name={name}
          checked={wert}
          onChange={(e) => setze(name, e.target.checked)}
          aria-invalid={fehler ? true : undefined}
          aria-describedby={fehler ? `${fid}-fehler` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600"
        />
        <span className="text-[14px] leading-relaxed text-ink-600">{children}</span>
      </label>
      {fehler && <Fehler id={`${fid}-fehler`}>{fehler}</Fehler>}
    </div>
  );
}

/** Standard-Datenschutztext mit Link. */
export function DatenschutzText({ zweck }) {
  return (
    <>
      Ich habe die{" "}
      <Link href="/datenschutz" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
        Datenschutzhinweise
      </Link>{" "}
      gelesen und bin einverstanden, dass die {FIRMA.name} meine Angaben {zweck} verarbeitet. Die Einwilligung kann ich jederzeit per E-Mail an{" "}
      {FIRMA.email} widerrufen. <span className="text-ov-600" aria-hidden="true">*</span>
    </>
  );
}

/** Honeypot gegen Spam-Bots – bleibt für Menschen unsichtbar und leer. */
export function Honeypot({ refObj }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
      <label>
        Website
        <input ref={refObj} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Fehlerbox nach dem Absenden. */
export function SendeFehler({ meldung }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl bg-red-50 p-4 text-[14.5px] leading-relaxed text-red-800 ring-1 ring-red-200">
      <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p>{meldung || "Ihre Angaben konnten leider nicht gesendet werden."}</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
          <a href={`mailto:${FIRMA.email}`} className="inline-flex items-center gap-1.5 underline">
            <Mail aria-hidden="true" className="h-4 w-4" />
            {FIRMA.email}
          </a>
          <a href={FIRMA.telefonHref} className="inline-flex items-center gap-1.5 underline">
            <Phone aria-hidden="true" className="h-4 w-4" />
            {FIRMA.telefon}
          </a>
        </p>
      </div>
    </div>
  );
}

/** Absende-Button mit Ladezustand. */
export function SendenKnopf({ sendet, children, className = "" }) {
  return (
    <button
      type="submit"
      disabled={sendet}
      className={`group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-600 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {sendet ? (
        <>
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
          Wird gesendet …
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Erfolgszustand mit Fokus (Screenreader hören die Bestätigung). */
export function Erfolg({ titel, text, schritte = [], zurueck }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="flex flex-col items-center px-2 py-10 text-center outline-none md:py-14">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ov-50 ring-4 ring-ov-100">
        <Check aria-hidden="true" className="h-10 w-10 text-ov-600" strokeWidth={3} />
      </span>
      <h3 className="ov-h2 mt-8 text-ink-900">{titel}</h3>
      <p className="ov-lead mt-4 max-w-lg text-ink-600">{text}</p>
      {schritte.length > 0 && (
        <ol className="mt-10 grid w-full max-w-lg gap-3 text-left">
          {schritte.map(([t, s], i) => (
            <li key={t} className="flex gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
              <span className="text-[15px] leading-snug text-ink-600">
                <strong className="text-ink-900">{t}</strong> {s}
              </span>
            </li>
          ))}
        </ol>
      )}
      {zurueck && (
        <button type="button" onClick={zurueck} className="mt-10 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
          Weitere Anfrage senden
        </button>
      )}
    </div>
  );
}

/**
 * Sendet JSON an eine eigene API-Route. Wirft bei Fehlern ein Error-Objekt mit
 * `message` (für Menschen) und `felder` (Feldfehler vom Server, falls vorhanden).
 */
export async function sende(url, payload) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    const e = new Error("Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung.");
    throw e;
  }
  const daten = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(daten.error || "Ihre Angaben konnten leider nicht gesendet werden.");
    e.felder = daten.felder || null;
    throw e;
  }
  return daten;
}

/** Kleiner Zustands-Helfer für Formulare: werte, setze(name, wert), fehler. */
export function useFormular(leer) {
  const [werte, setWerte] = useState(leer);
  const [fehler, setFehler] = useState({});
  const setze = (name, wert) => {
    setWerte((w) => ({ ...w, [name]: wert }));
    setFehler((f) => (f[name] ? { ...f, [name]: "" } : f));
  };
  const zuruecksetzen = () => {
    setWerte(leer);
    setFehler({});
  };
  return { werte, setze, fehler, setFehler, zuruecksetzen };
}

/** Fokus auf das erste fehlerhafte Feld setzen. */
export function fokusErsterFehler(formular, fehler, reihenfolge) {
  const erster = reihenfolge.find((k) => fehler[k]);
  if (!erster || !formular) return;
  const el = formular.querySelector(`[name="${erster}"]`);
  el?.focus();
}
