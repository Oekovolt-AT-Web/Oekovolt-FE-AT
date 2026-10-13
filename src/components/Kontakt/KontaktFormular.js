"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AlertCircle, ArrowRight, CalendarCheck2, Loader2, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import {
  EMAIL_FEHLER,
  HONEYPOT_FELD,
  JAHRESVERBRAUCH_WERTE,
  KONTAKT_THEMEN,
  PLZ_FEHLER,
  TELEFON_FEHLER,
  ZEITPLAN_WERTE,
  istEmail,
  istPlz,
  submitContact,
  telefonPruefen,
} from "@/lib/api/contact/create_contact";
import { terminVorbelegungMerken } from "@/lib/api/anfrage/create_anfrage";
import { einwilligung, einwilligungFelder } from "@/lib/einwilligungen";
import { herkunftText } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";
import { FIRMA } from "@/lib/site";

// Terminbuchung erst im Erfolgszustand laden (eigener Chunk, Kalender kommt per /api/termin/kalender)
const TerminBuchung = dynamic(() => import("@/components/Rueckruf/TerminBuchung"), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-[2rem] bg-sand-50 ring-1 ring-ink-100" />,
});

const HINWEIS = einwilligung("kontakt-info");
const ANRUF = einwilligung("rueckruf-anruf");

const LEER = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  plz: "",
  ort: "",
  street: "",
  firma: "",
  rueckruf: false,
};

// Themen → Kurzform für die Termin-Vorbelegung (src/data/erreichbarkeit.js, THEMA_KURZ)
const TERMIN_THEMA = {
  "Gewerbe & Industrie": "gewerbe",
  "Freifläche & Agri-PV": "freiflaeche",
  Landwirtschaft: "landwirtschaft",
  Gemeinde: "gemeinde",
  "Speicher & Laden": "speicher",
  Energiegemeinschaft: "energiegemeinschaft",
  "Service & Wartung": "service",
  "Störung an bestehender Anlage": "service",
};

function pruefe(name, wert, alle = {}) {
  switch (name) {
    case "firstName":
      return wert.trim() ? "" : "Bitte geben Sie Ihren Vornamen an.";
    case "lastName":
      return wert.trim() ? "" : "Bitte geben Sie Ihren Nachnamen an.";
    case "plz":
      return !wert.trim() ? "Bitte geben Sie Ihre Postleitzahl an." : istPlz(wert) ? "" : PLZ_FEHLER;
    case "ort":
      return wert.trim() ? "" : "Bitte geben Sie Ihren Ort an.";
    case "email":
      return !wert.trim() ? "Bitte geben Sie Ihre E-Mail-Adresse an." : istEmail(wert) ? "" : EMAIL_FEHLER;
    case "phone": {
      // Optional – aber wenn angegeben, dann gültig (gemeinsame Regel: telefonNormalisieren, AT/DE/CH)
      const t = telefonPruefen(wert);
      if (t.leer) return alle.rueckruf ? "Für einen Rückruf brauchen wir Ihre Telefonnummer." : "";
      return t.ok ? "" : TELEFON_FEHLER;
    }
    case "message":
      return wert.trim().length >= 10 ? "" : "Bitte beschreiben Sie Ihr Anliegen in ein paar Worten.";
    default:
      return "";
  }
}

/**
 * Kontaktformular – sendet über submitContact() an /api/create_contact.
 * Payload: thema, vorname, nachname, email, telefon (optional), strasse_hausnummer (optional,
 * „für Vor-Ort-Termin“), plz, ort, nachricht, quelle, kontakt_zusatz [Honeypot] und seit Welle A
 * (A08) die strukturierten Felder firma, zeitplan, jahresverbrauch, rueckruf_ok,
 * einwilligung_id/-version. Kein Pflicht-Häkchen und kein AGB-Bezug: Hinweistext „kontakt-info“
 * (Art. 6 Abs. 1 lit. b DSGVO); optional „Ich möchte telefonisch kontaktiert werden“ („rueckruf-anruf“).
 * Der Erfolgszustand bietet direkt einen Termin mit vorbelegten Daten an.
 */
export default function KontaktFormular() {
  const [werte, setWerte] = useState(LEER);
  const [thema, setThema] = useState("");
  const [fehler, setFehler] = useState({});
  const [beruehrt, setBeruehrt] = useState({});
  const [status, setStatus] = useState("bereit"); // bereit | sendet | erfolg | fehler
  const [serverFehler, setServerFehler] = useState("");
  const [gesendet, setGesendet] = useState(null); // Kontaktdaten für die Termin-Vorbelegung
  const [zeitplan, setZeitplan] = useState("");
  const [jahresverbrauch, setJahresverbrauch] = useState("");
  const [terminOffen, setTerminOffen] = useState(false);
  const erfolgRef = useRef(null);
  const formRef = useRef(null);
  const website = useRef(null); // Honeypot gegen Spam-Bots – bleibt für Menschen leer

  useEffect(() => {
    if (status === "erfolg") erfolgRef.current?.focus();
  }, [status]);

  const themaInfo = KONTAKT_THEMEN.find((t) => t.id === thema);
  const b2b = Boolean(themaInfo?.b2b);
  const projekt = !thema || Boolean(themaInfo?.projekt);

  const aendern = (e) => {
    const { name, value, type, checked } = e.target;
    const wert = type === "checkbox" ? checked : value;
    const neu = { ...werte, [name]: wert };
    setWerte(neu);
    if (beruehrt[name]) setFehler((f) => ({ ...f, [name]: pruefe(name, wert, neu) }));
    // Häkchen „telefonisch kontaktieren“: Telefon ist nur mit Häkchen Pflicht – Meldung nachziehen
    if (name === "rueckruf") setFehler((f) => ({ ...f, phone: beruehrt.phone || !checked ? pruefe("phone", neu.phone, neu) : f.phone }));
  };

  const verlassen = (e) => {
    const { name, value } = e.target;
    setBeruehrt((b) => ({ ...b, [name]: true }));
    setFehler((f) => ({ ...f, [name]: pruefe(name, value, werte) }));
  };

  const absenden = async (e) => {
    e.preventDefault();
    const alle = Object.fromEntries(Object.keys(LEER).map((k) => [k, pruefe(k, werte[k], werte)]));
    setFehler(alle);
    setBeruehrt(Object.fromEntries(Object.keys(LEER).map((k) => [k, true])));
    const erster = Object.keys(LEER).find((k) => alle[k]);
    if (erster) {
      formRef.current?.querySelector(`[name="${erster}"]`)?.focus();
      return;
    }

    setStatus("sendet");
    setServerFehler("");
    // Unternehmen/Organisation ist im Kontakt-Backend kein eigenes Feld -> vorne in die Nachricht
    const firma = werte.firma.trim();
    const nachricht = `${firma ? `Unternehmen/Organisation: ${firma}\n\n` : ""}${werte.message.trim()}\n\n—\n${herkunftText()}`;
    const tel = telefonPruefen(werte.phone);
    const payload = {
      thema: thema || "",
      vorname: werte.firstName.trim(),
      nachname: werte.lastName.trim(),
      email: werte.email.trim(),
      telefon: tel.e164,
      strasse_hausnummer: werte.street.trim(),
      plz: werte.plz.trim(),
      ort: werte.ort.trim(),
      nachricht,
      // Strukturierte Felder (Whitelist in /api/create_contact); Firma bleibt zusätzlich in der Nachricht lesbar
      firma,
      zeitplan: projekt ? zeitplan : "",
      jahresverbrauch: b2b ? jahresverbrauch : "",
      rueckruf_ok: werte.rueckruf ? 1 : 0,
      // Hinweistext statt Checkbox – die Route setzt `einwilligung` für das heutige Backend
      ...einwilligungFelder("kontakt-info"),
      quelle: window.location.pathname,
      [HONEYPOT_FELD]: website.current?.value || "",
    };

    try {
      await submitContact(payload);
      const kontakt = {
        name: `${werte.firstName.trim()} ${werte.lastName.trim()}`.trim(),
        vorname: werte.firstName.trim(),
        email: werte.email.trim(),
        telefon: tel.e164,
        plz: werte.plz.trim(),
        firma,
        thema: TERMIN_THEMA[thema] || "",
        rueckruf: Boolean(werte.rueckruf && tel.e164),
      };
      setGesendet(kontakt);
      terminVorbelegungMerken(kontakt);
      setTerminOffen(false);
      setWerte(LEER);
      setThema("");
      setZeitplan("");
      setJahresverbrauch("");
      setBeruehrt({});
      setFehler({});
      setStatus("erfolg");
      import("@/lib/konfetti").then((m) => m.konfetti()).catch(() => {});
      ereignis("kontakt_gesendet", { thema: thema || "ohne", rueckruf: werte.rueckruf ? 1 : 0 });
    } catch (error) {
      setServerFehler(error?.message && !/Failed to submit/i.test(error.message) ? error.message : "");
      setStatus("fehler");
    }
  };

  if (status === "erfolg") {
    return (
      <div ref={erfolgRef} tabIndex={-1} role="status" className="flex flex-col items-center px-2 py-10 text-center outline-none md:py-16">
        <ErfolgsHaken />
        <h2 className="ov-h2 mt-8 text-ink-900">Vielen Dank{gesendet?.vorname ? `, ${gesendet.vorname}` : ""}!</h2>
        <p className="ov-lead mt-4 max-w-md text-ink-600">
          Ihre Nachricht ist bei uns angekommen. Wir melden uns so schnell wie möglich persönlich bei Ihnen.
        </p>
        <ol className="mt-10 grid w-full max-w-lg gap-3 text-left">
          {[
            ["Wir lesen Ihr Anliegen", "und ordnen es dem passenden Ansprechpartner zu."],
            gesendet?.rueckruf ? ["Wir rufen Sie zurück", "– wie gewünscht unter Ihrer Nummer."] : ["Wir antworten per E-Mail", "– angerufen werden Sie nur, wenn Sie das wünschen."],
            ["Auf Wunsch kommen wir vorbei", "– in ganz Österreich – und sehen uns Dach oder Fläche, Trafo/Zählerplatz und Lastgang vor Ort an."],
          ].map(([t, s], i) => (
            <li key={t} className="flex gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
              <span className="text-[15px] leading-snug text-ink-600">
                <strong className="text-ink-900">{t}</strong> {s}
              </span>
            </li>
          ))}
        </ol>
        {/* Nächster Schritt: Termin mit vorbelegten Daten – gleichwertig daneben „später“ */}
        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            aria-expanded={terminOffen}
            aria-controls="kf-termin"
            onClick={() => {
              setTerminOffen((o) => !o);
              if (!terminOffen) ereignis("termin_angeboten", { quelle: "kontakt" });
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700"
          >
            <CalendarCheck2 aria-hidden="true" className="h-4 w-4" />
            Gleich einen Termin wählen
          </button>
          <Link href="/solarrechner" className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
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
        {terminOffen && (
          <div id="kf-termin" className="mt-8 w-full text-left">
            <TerminBuchung eingebettet name={gesendet?.name} email={gesendet?.email} telefon={gesendet?.telefon} plz={gesendet?.plz} firma={gesendet?.firma} thema={gesendet?.thema} />
          </div>
        )}
      </div>
    );
  }

  const sendet = status === "sendet";

  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-[14px] font-semibold text-ink-800">Worum geht es? <span className="font-normal text-ink-500">(optional)</span></legend>
        <div className="flex flex-wrap gap-2">
          {KONTAKT_THEMEN.map(({ id: t }) => {
            const aktiv = thema === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={aktiv}
                onClick={() => setThema(aktiv ? "" : t)}
                className={`h-11 rounded-full px-4 text-[14px] font-medium transition-all ${
                  aktiv ? "bg-ov-600 text-white shadow-[0_6px_16px_-6px_rgba(102,153,51,0.7)]" : "bg-ink-100 text-ink-700 hover:bg-ink-200/70"
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
        <Feld name="firma" label="Unternehmen / Gemeinde / Betrieb" optional autoComplete="organization" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} className="sm:col-span-2" />
        <Feld name="email" label="E-Mail-Adresse" type="email" autoComplete="email" inputMode="email" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="phone" label="Telefonnummer" optional type="tel" autoComplete="tel" inputMode="tel" hinweis="Für kurze Rückfragen" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="street" label="Straße und Hausnummer" optional hinweis="Für einen Vor-Ort-Termin" autoComplete="street-address" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} className="sm:col-span-2" />
        <Feld name="plz" label="PLZ" inputMode="numeric" autoComplete="postal-code" placeholder="5121" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
        <Feld name="ort" label="Ort" autoComplete="address-level2" placeholder="Ostermiething" werte={werte} fehler={fehler} onChange={aendern} onBlur={verlassen} />
      </div>

      <Feld
        name="message"
        label="Ihre Nachricht"
        mehrzeilig
        placeholder="z. B. Produktionshalle mit Flachdach, ca. 3.000 m², Jahresverbrauch rund 800.000 kWh, Netzebene 6 – wir interessieren uns für PV mit Speicher."
        werte={werte}
        fehler={fehler}
        onChange={aendern}
        onBlur={verlassen}
      />

      {/* Optionale Projekt-Angaben – nur bei Projektthemen bzw. ohne Thema; Jahresverbrauch nur bei B2B-Themen */}
      {projekt && (
        <Chips legende="Wann soll umgesetzt werden?" werte={ZEITPLAN_WERTE} wert={zeitplan} setze={setZeitplan} />
      )}
      {b2b && <Chips legende="Jahresstromverbrauch" werte={JAHRESVERBRAUCH_WERTE} wert={jahresverbrauch} setze={setJahresverbrauch} />}

      {/* Honeypot: bewusst nicht „website“ (Passwortmanager füllen sonst aus) */}
      <input ref={website} type="text" name={HONEYPOT_FELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {/* Optional, nicht vorangekreuzt: Anruf auf Wunsch (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021) */}
      <label htmlFor="kf-rueckruf" className="flex cursor-pointer items-start gap-3">
        <input
          id="kf-rueckruf"
          type="checkbox"
          name="rueckruf"
          checked={werte.rueckruf}
          onChange={aendern}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600"
        />
        <span className="text-[14px] leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-800">Ich möchte telefonisch kontaktiert werden</strong> <span className="text-ink-500">(optional)</span>. {ANRUF.text}
        </span>
      </label>

      {/* Hinweis statt Pflicht-Checkbox (Art. 6 Abs. 1 lit. b DSGVO), kein AGB-Bezug */}
      <p className="flex items-start gap-3 rounded-2xl bg-sand-50 p-4 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-100">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-700" />
        <span>
          {HINWEIS.text} Mehr dazu in der{" "}
          <Link href={HINWEIS.link} className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
            Datenschutzerklärung
          </Link>
          .
        </span>
      </p>

      {status === "fehler" && (
        <div role="alert" className="flex gap-3 rounded-2xl bg-red-50 p-4 text-[14.5px] leading-relaxed text-red-800 ring-1 ring-red-200">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Ihre Nachricht konnte leider nicht gesendet werden{serverFehler ? ` (${serverFehler})` : ""}. Bitte versuchen Sie es erneut oder rufen Sie uns
            direkt an: <a href={FIRMA.telefonHref} className="font-semibold underline">{FIRMA.telefon}</a>.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-ink-200/70 pt-6 sm:items-end">
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
        {/* Lead-Versprechen (src/lib/site.js, A02) direkt unter dem Senden-Knopf */}
        <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-500 sm:max-w-sm sm:text-right">
          <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {FIRMA.leadVersprechen}
        </p>
      </div>
    </form>
  );
}

/** Optionale Einzelwahl als Chips (erneuter Klick hebt die Wahl auf) */
function Chips({ legende, werte, wert, setze }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[14px] font-semibold text-ink-800">
        {legende} <span className="font-normal text-ink-500">(optional)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {werte.map((w) => {
          const aktiv = wert === w;
          return (
            <button
              key={w}
              type="button"
              aria-pressed={aktiv}
              onClick={() => setze(aktiv ? "" : w)}
              className={`h-11 rounded-full px-4 text-[14px] font-medium transition-all ${aktiv ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200/70"}`}
            >
              {w}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Feld({ name, label, type = "text", mehrzeilig, hinweis, optional = false, werte, fehler, onChange, onBlur, className, ...rest }) {
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
          {label}{" "}
          {optional ? <span className="font-normal text-ink-500">(optional)</span> : <span className="text-ov-600" aria-hidden="true">*</span>}
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
            required={!optional}
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
