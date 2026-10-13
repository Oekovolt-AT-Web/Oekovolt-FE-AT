"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, RotateCcw } from "lucide-react";
import { submitAnfrage } from "@/lib/api/anfrage/create_anfrage";
import { herkunft } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";
import { FIRMA } from "@/lib/site";
import { ANFRAGE_THEMA, ANFRAGE_VORHABEN, FORMULAR_FELDER } from "@/data/betriebsfuehrung";

/**
 * Anfrage „Anlagenübernahme“ über /api/create_anfrage (Frappe submit_angebot, Vorhaben „service“).
 * Das Thema steht in der ersten Zeile der Nachricht und in `gebaeudetyp`; kWp geht strukturiert
 * als ergebnis.anlagengroesse_kwp mit. Angaben zur Anlage aus src/data/betriebsfuehrung.js.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const KONTAKT = [
  { name: "firma", label: "Unternehmen / Betreiber", autoComplete: "organization", breit: true },
  { name: "vorname", label: "Vorname", pflicht: true, autoComplete: "given-name" },
  { name: "nachname", label: "Nachname", pflicht: true, autoComplete: "family-name" },
  { name: "email", label: "E-Mail-Adresse", pflicht: true, typ: "email", autoComplete: "email" },
  { name: "telefon", label: "Telefonnummer", pflicht: true, typ: "tel", autoComplete: "tel" },
  { name: "plz", label: "PLZ (Anlagenstandort)", pflicht: true, autoComplete: "postal-code", placeholder: "5121", inputMode: "numeric" },
  { name: "ort", label: "Ort", pflicht: true, autoComplete: "address-level2", placeholder: "Ostermiething" },
];

const NACHRICHT = { name: "nachricht", label: "Was wir noch wissen sollten", typ: "textarea", breit: true, placeholder: "z. B. vorhandene Unterlagen, Monitoring-Zugang, aktuelle Meldung am Wechselrichter" };

function pruefe(feld, wert) {
  const v = typeof wert === "string" ? wert.trim() : wert;
  if (feld.name === "einwilligung") return v ? "" : "Bitte bestätigen Sie die Datenschutzhinweise.";
  if (feld.pflicht && !v) return `Bitte ${feld.label.replace(/\s*\(.*\)$/, "")} angeben.`;
  if (!v) return "";
  if (feld.name === "email" && !EMAIL.test(v)) return "Diese E-Mail-Adresse sieht unvollständig aus.";
  if (feld.name === "telefon" && v.replace(/\D/g, "").length < 6) return "Bitte prüfen Sie die Telefonnummer.";
  if (feld.name === "plz" && !/^\d{4}$/.test(v)) return "Bitte eine österreichische Postleitzahl angeben, z. B. 5121.";
  if (feld.typ === "zahl" && Number.isNaN(Number(String(v).replace(",", ".")))) return "Bitte eine Zahl angeben.";
  return "";
}

export default function UebernahmeFormular() {
  const alle = [...KONTAKT, ...FORMULAR_FELDER, NACHRICHT];
  const leer = () => Object.fromEntries([...alle.map((f) => [f.name, ""]), ["einwilligung", false]]);
  const [werte, setWerte] = useState(leer);
  const [fehler, setFehler] = useState({});
  const [status, setStatus] = useState("bereit");
  const formRef = useRef(null);
  const erfolgRef = useRef(null);
  const honig = useRef(null);
  const id = useId();

  useEffect(() => {
    if (status === "erfolg") erfolgRef.current?.focus();
  }, [status]);

  const feldVon = (name) => (name === "einwilligung" ? { name } : alle.find((f) => f.name === name));
  const aendern = (e) => {
    const { name, value, type, checked } = e.target;
    const wert = type === "checkbox" ? checked : value;
    setWerte((w) => ({ ...w, [name]: wert }));
    if (fehler[name]) setFehler((f) => ({ ...f, [name]: pruefe(feldVon(name), wert) }));
  };
  const verlassen = (e) => setFehler((f) => ({ ...f, [e.target.name]: pruefe(feldVon(e.target.name), e.target.value) }));

  const senden = async (e) => {
    e.preventDefault();
    const neu = {};
    for (const f of alle) neu[f.name] = pruefe(f, werte[f.name]);
    neu.einwilligung = pruefe({ name: "einwilligung" }, werte.einwilligung);
    setFehler(neu);
    const erster = Object.keys(neu).find((k) => neu[k]);
    if (erster) {
      formRef.current?.querySelector(`[name="${erster}"]`)?.focus();
      return;
    }
    setStatus("sendet");

    const zeilen = [`Anfrage: ${ANFRAGE_THEMA}`];
    if (werte.firma.trim()) zeilen.push(`Unternehmen/Betreiber: ${werte.firma.trim()}`);
    for (const f of FORMULAR_FELDER) {
      const v = String(werte[f.name] ?? "").trim();
      if (v) zeilen.push(`${f.label.replace(/\s*\(.*\)$/, "")}: ${v}${f.einheit ? ` ${f.einheit}` : ""}`);
    }
    if (werte.nachricht.trim()) zeilen.push("", werte.nachricht.trim());
    const angaben = zeilen.join("\n");
    const kwp = Number(String(werte.kwp).replace(",", "."));

    try {
      await submitAnfrage({
        vorhaben: ANFRAGE_VORHABEN,
        thema: ANFRAGE_THEMA,
        gebaeudetyp: `Bestandsanlage – ${ANFRAGE_THEMA}`,
        startzeitpunkt: werte.seit ? `Errichter nicht erreichbar seit ${werte.seit.trim()}` : "",
        vorname: werte.vorname.trim(),
        nachname: werte.nachname.trim(),
        email: werte.email.trim(),
        telefon: werte.telefon.trim(),
        plz: werte.plz.trim(),
        ort: werte.ort.trim(),
        einwilligung: 1,
        ergebnis: { anlagengroesse_kwp: Number.isFinite(kwp) ? kwp : null, angaben },
        nachricht: angaben,
        website: honig.current?.value || "",
        herkunft: herkunft(),
      });
      setStatus("erfolg");
      import("@/lib/konfetti").then((m) => m.konfetti()).catch(() => {});
      setWerte(leer());
      setFehler({});
      ereignis("service_anfrage_gesendet", { betreff: ANFRAGE_THEMA });
    } catch {
      setStatus("fehler");
    }
  };

  if (status === "erfolg") {
    return (
      <div ref={erfolgRef} tabIndex={-1} role="status" className="rounded-[2rem] bg-white p-8 text-center shadow-xl ring-1 ring-ink-200/70 outline-none md:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-ov-600" />
        <h3 className="ov-h3 mt-6 text-ink-900">Danke – wir kümmern uns um Ihre Anlage.</h3>
        <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-ink-600">Wir melden uns mit Rückfragen zu den Unterlagen oder direkt mit einem Termin für die Zustandsaufnahme.</p>
        <button type="button" onClick={() => setStatus("bereit")} className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Weitere Anfrage
        </button>
      </div>
    );
  }

  const sendet = status === "sendet";

  return (
    <form ref={formRef} onSubmit={senden} noValidate className="relative rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-ink-200/70 md:p-10">
      <h3 className="ov-h3 text-ink-900">Anfrage Anlagenübernahme</h3>
      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">Eckdaten genügen – fehlende Unterlagen besorgen wir gemeinsam.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {KONTAKT.map((f) => (
          <Feld key={f.name} id={id} feld={f} wert={werte[f.name]} fehler={fehler[f.name]} onChange={aendern} onBlur={verlassen} />
        ))}
      </div>

      <fieldset className="mt-8 border-t border-ink-200/70 pt-6">
        <legend className="sr-only">Angaben zur Anlage</legend>
        <p aria-hidden="true" className="mb-5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
          Angaben zur Anlage
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {FORMULAR_FELDER.map((f) => (
            <Feld key={f.name} id={id} feld={f} wert={werte[f.name]} fehler={fehler[f.name]} onChange={aendern} onBlur={verlassen} />
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <Feld id={id} feld={NACHRICHT} wert={werte.nachricht} fehler={fehler.nachricht} onChange={aendern} onBlur={verlassen} />
      </div>

      <input ref={honig} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="einwilligung" checked={werte.einwilligung} onChange={aendern} aria-invalid={!!fehler.einwilligung} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
          <span className="text-[14px] leading-relaxed text-ink-600">
            Ich habe die{" "}
            <Link href="/datenschutz" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
              Datenschutzhinweise
            </Link>{" "}
            gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Die Einwilligung kann ich jederzeit widerrufen.
          </span>
        </label>
        {fehler.einwilligung && <Fehler id={`${id}-einwilligung-fehler`}>{fehler.einwilligung}</Fehler>}
      </div>

      {status === "fehler" && (
        <div role="alert" className="mt-6 flex gap-3 rounded-2xl bg-red-50 p-4 text-[14.5px] leading-relaxed text-red-800 ring-1 ring-red-200">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Ihre Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut oder erreichen Sie uns direkt: <a href={FIRMA.telefonHref} className="font-semibold underline">{FIRMA.telefon}</a> ·{" "}
            <a href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(ANFRAGE_THEMA)}`} className="font-semibold underline">
              {FIRMA.email}
            </a>
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[13px] text-ink-500">
          <Lock aria-hidden="true" className="h-4 w-4" />
          Unverbindlich · Daten nur für Ihre Anfrage
        </p>
        <button type="submit" disabled={sendet} className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-600 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70">
          {sendet ? (
            <>
              <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
              Wird gesendet …
            </>
          ) : (
            <>
              Übernahme anfragen
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Feld({ id, feld, wert, fehler, onChange, onBlur }) {
  const fid = `${id}-${feld.name}`;
  const klassen = `w-full rounded-2xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-inset transition-all placeholder:text-ink-500 focus:ring-2 ${fehler ? "ring-red-400 focus:ring-red-500" : "ring-ink-200 hover:ring-ink-300 focus:ring-ov-500"}`;
  const gemeinsam = { id: fid, name: feld.name, value: wert, onChange, onBlur, required: !!feld.pflicht, "aria-invalid": !!fehler, "aria-describedby": fehler ? `${fid}-fehler` : undefined };
  let eingabe;
  if (feld.typ === "textarea") eingabe = <textarea {...gemeinsam} rows={4} placeholder={feld.placeholder} className={`${klassen} resize-y py-3.5 leading-relaxed`} />;
  else if (feld.typ === "auswahl")
    eingabe = (
      <select {...gemeinsam} className={`${klassen} h-13 cursor-pointer pr-10`}>
        <option value="">Bitte wählen …</option>
        {(feld.optionen || []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  else
    eingabe = (
      <div className="relative">
        <input
          {...gemeinsam}
          type={feld.typ === "email" ? "email" : feld.typ === "tel" ? "tel" : "text"}
          inputMode={feld.typ === "zahl" ? "decimal" : feld.inputMode || (feld.typ === "email" ? "email" : feld.typ === "tel" ? "tel" : undefined)}
          autoComplete={feld.autoComplete}
          placeholder={feld.placeholder}
          className={`${klassen} h-13 ${feld.einheit ? "pr-16" : ""}`}
        />
        {feld.einheit && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-ink-500">{feld.einheit}</span>}
      </div>
    );
  return (
    <div className={feld.breit ? "min-w-0 sm:col-span-2" : "min-w-0"}>
      <label htmlFor={fid} className="mb-2 block text-[14px] font-semibold text-ink-800">
        {feld.label}
        {feld.pflicht && (
          <span className="text-ov-600" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      {eingabe}
      {fehler && <Fehler id={`${fid}-fehler`}>{fehler}</Fehler>}
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
