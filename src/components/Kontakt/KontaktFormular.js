"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2, Lock, RotateCcw } from "lucide-react";
import { submitContact } from "@/lib/api/contact/create_contact";
import { herkunftText } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";

const LEER = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  plz: "",
  ort: "",
  street: "",
  acceptTerms: false,
};

const THEMEN = ["Photovoltaik", "Stromspeicher", "Wärmepumpe", "Wallbox", "Service & Wartung", "Sonstiges"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function pruefe(name, wert) {
  switch (name) {
    case "firstName":
      return wert.trim() ? "" : "Bitte geben Sie Ihren Vornamen an.";
    case "lastName":
      return wert.trim() ? "" : "Bitte geben Sie Ihren Nachnamen an.";
    case "street":
      return wert.trim() ? "" : "Bitte geben Sie Straße und Hausnummer an.";
    case "plz":
      return !wert.trim() ? "Bitte geben Sie Ihre Postleitzahl an." : /^\d{4,5}$/.test(wert.trim()) ? "" : "Bitte eine gültige Postleitzahl angeben, z. B. 86842.";
    case "ort":
      return wert.trim() ? "" : "Bitte geben Sie Ihren Ort an.";
    case "email":
      return !wert.trim() ? "Bitte geben Sie Ihre E-Mail-Adresse an." : EMAIL.test(wert.trim()) ? "" : "Diese E-Mail-Adresse sieht unvollständig aus.";
    case "phone":
      return !wert.trim() ? "Bitte geben Sie eine Telefonnummer für Rückfragen an." : wert.replace(/\D/g, "").length >= 6 ? "" : "Bitte prüfen Sie die Telefonnummer.";
    case "message":
      return wert.trim().length >= 10 ? "" : "Bitte beschreiben Sie Ihr Anliegen in ein paar Worten.";
    case "acceptTerms":
      return wert ? "" : "Bitte bestätigen Sie die Datenschutzhinweise.";
    default:
      return "";
  }
}

/**
 * Kontaktformular – sendet über submitContact() an /api/create_contact.
 * Payload-Feldnamen entsprechen dem Zielformat (thema, vorname, nachname,
 * email, telefon, strasse_hausnummer, plz, ort, nachricht, einwilligung,
 * quelle, website [Honeypot]). PLZ und Ort sind eigene Felder (nicht mehr
 * kombiniert). Inline-Validierung, Themenwahl (eigenes Feld) und Erfolgszustand.
 */
export default function KontaktFormular() {
  const [werte, setWerte] = useState(LEER);
  const [thema, setThema] = useState("");
  const [fehler, setFehler] = useState({});
  const [beruehrt, setBeruehrt] = useState({});
  const [status, setStatus] = useState("bereit"); // bereit | sendet | erfolg | fehler
  const [serverFehler, setServerFehler] = useState("");
  const [gesendetAn, setGesendetAn] = useState("");
  const erfolgRef = useRef(null);
  const formRef = useRef(null);
  const website = useRef(null); // Honeypot gegen Spam-Bots – bleibt für Menschen leer

  useEffect(() => {
    if (status === "erfolg") erfolgRef.current?.focus();
  }, [status]);

  const aendern = (e) => {
    const { name, value, type, checked } = e.target;
    const wert = type === "checkbox" ? checked : value;
    setWerte((w) => ({ ...w, [name]: wert }));
    if (beruehrt[name] || type === "checkbox") setFehler((f) => ({ ...f, [name]: pruefe(name, wert) }));
  };

  const verlassen = (e) => {
    const { name, value } = e.target;
    setBeruehrt((b) => ({ ...b, [name]: true }));
    setFehler((f) => ({ ...f, [name]: pruefe(name, value) }));
  };

  const absenden = async (e) => {
    e.preventDefault();
    const alle = Object.fromEntries(Object.keys(LEER).map((k) => [k, pruefe(k, werte[k])]));
    setFehler(alle);
    setBeruehrt(Object.fromEntries(Object.keys(LEER).map((k) => [k, true])));
    const erster = Object.keys(LEER).find((k) => alle[k]);
    if (erster) {
      formRef.current?.querySelector(`[name="${erster}"]`)?.focus();
      return;
    }

    setStatus("sendet");
    setServerFehler("");
    const nachricht = `${werte.message.trim()}\n\n—\n${herkunftText()}`;
    const payload = {
      thema: thema || "",
      vorname: werte.firstName.trim(),
      nachname: werte.lastName.trim(),
      email: werte.email.trim(),
      telefon: werte.phone.trim(),
      strasse_hausnummer: werte.street.trim(),
      plz: werte.plz.trim(),
      ort: werte.ort.trim(),
      nachricht,
      einwilligung: werte.acceptTerms ? 1 : 0,
      quelle: window.location.pathname,
      website: website.current?.value || "",
    };

    try {
      await submitContact(payload);
      setGesendetAn(werte.firstName.trim());
      setWerte(LEER);
      setThema("");
      setBeruehrt({});
      setFehler({});
      setStatus("erfolg");
      ereignis("kontakt_gesendet", { thema: thema || "ohne" });
    } catch (error) {
      setServerFehler(error?.message && !/Failed to submit/i.test(error.message) ? error.message : "");
      setStatus("fehler");
    }
  };

  if (status === "erfolg") {
    return (
      <div ref={erfolgRef} tabIndex={-1} role="status" className="flex flex-col items-center px-2 py-10 text-center outline-none md:py-16">
        <ErfolgsHaken />
        <h2 className="ov-h2 mt-8 text-ink-900">Vielen Dank{gesendetAn ? `, ${gesendetAn}` : ""}!</h2>
        <p className="ov-lead mt-4 max-w-md text-ink-600">
          Ihre Nachricht ist bei uns angekommen. Wir melden uns so schnell wie möglich persönlich bei Ihnen.
        </p>
        <ol className="mt-10 grid w-full max-w-lg gap-3 text-left">
          {[
            ["Wir lesen Ihr Anliegen", "und ordnen es dem passenden Ansprechpartner zu."],
            ["Wir rufen Sie zurück", "oder antworten per E-Mail – ganz wie es passt."],
            ["Auf Wunsch kommen wir vorbei", "und schauen uns Dach, Zählerschrank und Verbrauch vor Ort an."],
          ].map(([t, s], i) => (
            <li key={t} className="flex gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
              <span className="text-[15px] leading-snug text-ink-600">
                <strong className="text-ink-900">{t}</strong> {s}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/solarrechner" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
            Solarertrag schon mal berechnen
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setStatus("bereit")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Weitere Nachricht
          </button>
        </div>
      </div>
    );
  }

  const sendet = status === "sendet";

  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-[14px] font-semibold text-ink-800">Worum geht es? <span className="font-normal text-ink-500">(optional)</span></legend>
        <div className="flex flex-wrap gap-2">
          {THEMEN.map((t) => {
            const aktiv = thema === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={aktiv}
                onClick={() => setThema(aktiv ? "" : t)}
                className={`h-11 rounded-full px-4 text-[14px] font-medium transition-all ${
                  aktiv ? "bg-ov-600 text-white shadow-[0_6px_16px_-6px_rgba(102,153,51,0.7)]" : "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Feld name="firstName" label="Vorname" autoComplete="given-name" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="lastName" label="Nachname" autoComplete="family-name" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="email" label="E-Mail-Adresse" type="email" autoComplete="email" inputMode="email" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="phone" label="Telefonnummer" type="tel" autoComplete="tel" inputMode="tel" hinweis="Für kurze Rückfragen" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="street" label="Straße und Hausnummer" autoComplete="street-address" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} className="sm:col-span-2" />
        <Feld name="plz" label="PLZ" inputMode="numeric" autoComplete="postal-code" placeholder="86842" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="ort" label="Ort" autoComplete="address-level2" placeholder="Türkheim" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
      </div>

      <Feld
        name="message"
        label="Ihre Nachricht"
        mehrzeilig
        placeholder="z. B. Einfamilienhaus, Süddach, ca. 4.500 kWh Verbrauch – wir interessieren uns für eine PV-Anlage mit Speicher."
        werte={werte}
        fehler={fehler}
        onChange={aendern}
        onBlur={verlassen}
      />

      <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={werte.acceptTerms}
            onChange={aendern}
            aria-invalid={!!fehler.acceptTerms}
            aria-describedby={fehler.acceptTerms ? "acceptTerms-fehler" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600"
          />
          <span className="text-[14px] leading-relaxed text-ink-600">
            Ich akzeptiere die{" "}
            <Link href="/agb" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
              Allgemeinen Geschäftsbedingungen
            </Link>{" "}
            und habe die{" "}
            <Link href="/datenschutz" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
              Datenschutzhinweise
            </Link>{" "}
            gelesen. Meine Einwilligung zur Verarbeitung meiner Daten kann ich jederzeit widerrufen.
          </span>
        </label>
        {fehler.acceptTerms && <Fehler id="acceptTerms-fehler">{fehler.acceptTerms}</Fehler>}
      </div>

      {status === "fehler" && (
        <div role="alert" className="flex gap-3 rounded-2xl bg-red-50 p-4 text-[14.5px] leading-relaxed text-red-800 ring-1 ring-red-200">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Ihre Nachricht konnte leider nicht gesendet werden{serverFehler ? ` (${serverFehler})` : ""}. Bitte versuchen Sie es erneut oder rufen Sie uns
            direkt an: <a href="tel:+498245967880" className="font-semibold underline">08245 96 788 0</a>.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[13px] text-ink-500">
          <Lock aria-hidden="true" className="h-4 w-4" />
          Ihre Daten nutzen wir nur für Ihre Anfrage.
        </p>
        <button
          type="submit"
          disabled={sendet}
          className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-600 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {sendet ? (
            <>
              <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
              Wird gesendet …
            </>
          ) : (
            <>
              Nachricht senden
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Feld({ name, label, type = "text", mehrzeilig, hinweis, werte, fehler, onChange, onBlur, className, ...rest }) {
  const f = fehler[name];
  const ok = !f && String(werte[name]).trim() && !pruefe(name, werte[name]);
  const klassen = `peer w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-inset transition-all placeholder:text-ink-500 focus:ring-2 ${
    f ? "ring-red-400 focus:ring-red-500" : "ring-ink-200 hover:ring-ink-300 focus:ring-ov-500"
  }`;
  const beschreibung = [f ? `${name}-fehler` : null, hinweis ? `${name}-hinweis` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={[mehrzeilig ? "" : "min-w-0", className].filter(Boolean).join(" ")}>
      <label htmlFor={`kf-${name}`} className="mb-2 flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink-800">
        <span>
          {label} <span className="text-ov-600" aria-hidden="true">*</span>
        </span>
        {hinweis && (
          <span id={`${name}-hinweis`} className="text-[12.5px] font-normal text-ink-500">
            {hinweis}
          </span>
        )}
      </label>
      <div className="relative">
        {mehrzeilig ? (
          <textarea
            id={`kf-${name}`}
            name={name}
            rows={5}
            value={werte[name]}
            onChange={onChange}
            onBlur={onBlur}
            required
            aria-invalid={!!f}
            aria-describedby={beschreibung}
            className={`${klassen} resize-y py-3.5 leading-relaxed`}
            {...rest}
          />
        ) : (
          <input
            id={`kf-${name}`}
            name={name}
            type={type}
            value={werte[name]}
            onChange={onChange}
            onBlur={onBlur}
            required
            aria-invalid={!!f}
            aria-describedby={beschreibung}
            className={`${klassen} h-13 pr-10`}
            {...rest}
          />
        )}
        {ok && !mehrzeilig && (
          <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ov-500">
            <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
            <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {f && <Fehler id={`${name}-fehler`}>{f}</Fehler>}
    </div>
  );
}

function Fehler({ id, children }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[13.5px] font-medium text-red-700">
      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

/** Animierter Haken (SMIL – ohne globale CSS; bei reduzierter Bewegung sofort fertig) */
function ErfolgsHaken() {
  const [ruhig, setRuhig] = useState(false);
  useEffect(() => {
    setRuhig(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-ov-500/15 motion-safe:animate-ping" style={{ animationIterationCount: 2 }} />
      <svg viewBox="0 0 112 112" className="relative h-28 w-28" aria-hidden="true">
        <circle cx="56" cy="56" r="52" fill="#f4f9ee" />
        <circle cx="56" cy="56" r="52" fill="none" stroke="#669933" strokeWidth="4" strokeLinecap="round" strokeDasharray="327" strokeDashoffset={ruhig ? 0 : 327} transform="rotate(-90 56 56)">
          {!ruhig && <animate attributeName="stroke-dashoffset" from="327" to="0" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />}
        </circle>
        <path d="M36 57l13 13 27-28" fill="none" stroke="#669933" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={ruhig ? 0 : 60}>
          {!ruhig && <animate attributeName="stroke-dashoffset" from="60" to="0" begin="0.55s" dur="0.45s" fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />}
        </path>
      </svg>
    </div>
  );
}
