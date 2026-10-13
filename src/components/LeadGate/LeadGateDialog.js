"use client";

// src/components/LeadGate/LeadGateDialog.js – Lead-Gate 2.0 (Welle A, Paket A09)
//
// Dialog vor Export, PDF, Link oder Auswertung eines Werkzeugs. Ablauf (Lead-Gate-Regel des Inhabers, 11.10.2026):
//   Formular (Vorname, Nachname, E-Mail Pflicht; Telefon nur nach freiwilligem Häkchen) → POST /api/rechner_lead
//   → Wartezustand „Bitte E-Mail bestätigen – Link gesendet an …“ (Erneut senden frühestens nach 60 s, Spam-Hinweis)
//   → Bestätigung über /freischalten (Cookie) → Statusabfrage erkennt die Freischaltung → onFrei().
// Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung des Ergebnisses), Info-Text statt Pflicht-Checkbox;
// Kontaktaufnahme nur mit dem optionalen, nicht vorangekreuzten Häkchen (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021).
// Kein Newsletter, keine Kopplung. Der Dialog bleibt nach dem Schließen gemountet (Zustand und Statusabfrage laufen
// weiter) und zeigt beim nächsten Öffnen wieder den Wartezustand.
//
// Props (gleich wie die Übergangs-Gates KommunenGate/DachGate/FachplanerGate):
//   offen, kennung, aktion ("pdf" | "download" | "export" | "link" | "auswertung" | "senden"),
//   onFrei(), onSchliessen(), onWeiter() (Knopf im Erfolgszustand, z. B. PDF jetzt erstellen), onRollen(rollen),
//   kontext { titel, einleitung, weiterLabel, plz, ergebnis, rueckkehr, segment, mappe, rollen, nachSenden }
//   sowie die Kurzformen titel, text, zusammenfassung, anker der Übergangs-Gates.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Loader2, Lock, MailCheck, PhoneCall, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import useFokusFalle from "@/components/ui/useFokusFalle";
import { oeffneRueckruf } from "@/components/Rueckruf/oeffnen";
import { einwilligung } from "@/lib/einwilligungen";
import { herkunft } from "@/lib/herkunft";
import { ereignis } from "@/lib/statistik";
import { FIRMA } from "@/lib/site";
import { HONIGTOPF, formularPruefen } from "@/lib/rechnerLead";
import { MAPPE_ROLLEN, standardRollen } from "@/data/argumentarien";
import { leadRechner, segmentFuer } from "@/data/leadRechner";
import { freigabeEntfernen, freiMelden, statusAbfragen } from "./freigabe";

const ERNEUT_SEKUNDEN = 60;
const ABFRAGE_MS = 5000;

const TEXTE = {
  pdf: { kopf: "Bericht freischalten", titel: "Ergebnis als PDF für Ihre Entscheider", weiter: "PDF jetzt erstellen" },
  link: { kopf: "Link freischalten", titel: "Link zu Ihrer Berechnung", weiter: "Link jetzt kopieren" },
  export: { kopf: "Export freischalten", titel: "Ergebnis übernehmen", weiter: "Jetzt übernehmen" },
  download: { kopf: "Download freischalten", titel: "Unterlage herunterladen", weiter: "Jetzt herunterladen" },
  auswertung: { kopf: "Auswertung freischalten", titel: "Ihre Auswertung starten", weiter: "Auswertung starten" },
  senden: { kopf: "An einen Fachberater senden", titel: "Kennzahlen an einen Fachberater senden", weiter: "Weiter zur Anfrage" },
};

const leer = { vorname: "", nachname: "", email: "", telefon: "", plz: "", kontakt: false };

export default function LeadGateDialog({
  offen = true,
  kennung,
  aktion = "export",
  onFrei,
  onSchliessen,
  onWeiter,
  onRollen,
  kontext = {},
  // Kurzformen der Übergangs-Gates
  titel: titelProp,
  text: textProp,
  zusammenfassung,
  anker,
}) {
  const eintrag = leadRechner(kennung);
  const segment = kontext.segment || segmentFuer(kennung);
  const t = TEXTE[aktion] || TEXTE.export;
  const titel = kontext.titel || titelProp || t.titel;
  const einleitung = kontext.einleitung || textProp || "";
  const ergebnis = kontext.ergebnis || zusammenfassung || {};
  const senden = aktion === "senden";

  const [f, setF] = useState(() => ({ ...leer, plz: /^\d{4}$/.test(String(kontext.plz || "")) ? String(kontext.plz) : "" }));
  const [rollen, setRollen] = useState(() => (Array.isArray(kontext.rollen) && kontext.rollen.length ? kontext.rollen : standardRollen(segment)));
  const [fehler, setFehler] = useState({});
  // bereit | sendet | wartet | frei | gesendet | fehler
  const [status, setStatus] = useState("bereit");
  const [meldung, setMeldung] = useState("");
  const [art, setArt] = useState("email"); // email | team | entwicklung | keine
  const [entwicklungLink, setEntwicklungLink] = useState("");
  const [erneutIn, setErneutIn] = useState(0);
  const [entfernt, setEntfernt] = useState(false);
  const dialogRef = useRef(null);
  const ersterRef = useRef(null);
  const honigRef = useRef(null);
  const feldRefs = useRef({});
  const id = useId();

  const info = einwilligung("leadgate-info");
  const kontaktText = einwilligung("leadgate-kontakt");

  useFokusFalle(offen, dialogRef, { beiEscape: onSchliessen, startRef: ersterRef });

  // Erneut geöffnet nach Erfolg (z. B. „Kennzahlen senden“ nach der Freischaltung): wieder das Formular zeigen,
  // die eingegebenen Werte bleiben erhalten.
  const warOffen = useRef(offen);
  useEffect(() => {
    if (offen && !warOffen.current && (status === "frei" || status === "gesendet")) setStatus("bereit");
    warOffen.current = offen;
  }, [offen, status]);

  // Zähler „Erneut senden“
  useEffect(() => {
    if (status !== "wartet" || erneutIn <= 0) return undefined;
    const z = setTimeout(() => setErneutIn((s) => s - 1), 1000);
    return () => clearTimeout(z);
  }, [status, erneutIn]);

  // Wartezustand: Freischaltung (Cookie aus /freischalten, auch in anderem Tab) regelmäßig und beim Zurückkehren abfragen
  const frei = useCallback(() => {
    setStatus("frei");
    ereignis("lead_gate_bestaetigt", { kennung, aktion });
    freiMelden(kennung);
    onFrei?.();
  }, [kennung, aktion, onFrei]);

  useEffect(() => {
    if (status !== "wartet") return undefined;
    let aktiv = true;
    const pruefen = async () => {
      const s = await statusAbfragen(kennung);
      if (aktiv && s?.frei) frei();
    };
    const sichtbar = () => {
      if (document.visibilityState === "visible") pruefen();
    };
    const z = setInterval(pruefen, ABFRAGE_MS);
    window.addEventListener("focus", pruefen);
    document.addEventListener("visibilitychange", sichtbar);
    return () => {
      aktiv = false;
      clearInterval(z);
      window.removeEventListener("focus", pruefen);
      document.removeEventListener("visibilitychange", sichtbar);
    };
  }, [status, kennung, frei]);

  const setze = (name) => (e) => {
    const wert = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((x) => ({ ...x, [name]: wert }));
    if (fehler[name]) setFehler((x) => ({ ...x, [name]: undefined }));
  };

  const absenden = async (e) => {
    e?.preventDefault();
    const pruefung = formularPruefen({ ...f, kontakt_ok: f.kontakt ? 1 : 0 });
    setFehler(pruefung.fehler);
    if (!pruefung.ok) {
      // Fokus auf das erste Fehlerfeld (Reihenfolge wie im Formular)
      const erstes = ["vorname", "nachname", "email", "plz", "telefon"].find((k) => pruefung.fehler[k]);
      feldRefs.current[erstes]?.focus();
      return;
    }
    setStatus("sendet");
    setMeldung("");
    const rueckkehr = kontext.rueckkehr || `${window.location.pathname}${window.location.search}${anker ? `#${anker}` : kontext.anker ? `#${kontext.anker}` : ""}`;
    try {
      const res = await fetch("/api/rechner_lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kennung,
          aktion,
          vorname: f.vorname.trim(),
          nachname: f.nachname.trim(),
          email: f.email.trim(),
          telefon: f.kontakt ? f.telefon.trim() : "",
          kontakt_ok: f.kontakt ? 1 : 0,
          kontakt_version: f.kontakt ? String(kontaktText?.version || "") : "",
          plz: f.plz.trim(),
          segment,
          mappe_rollen: kontext.mappe && aktion === "pdf" ? rollen : [],
          einwilligung_id: "leadgate-info",
          einwilligung_version: String(info?.version || ""),
          quelle: window.location.pathname,
          rueckkehr,
          ergebnis,
          herkunft: herkunft(),
          [HONIGTOPF]: honigRef.current?.value || "",
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (j?.felder && typeof j.felder === "object") setFehler(j.felder);
        setMeldung(j?.error || "");
        setStatus("fehler");
        return;
      }
      setArt(j.bestaetigung || "email");
      setEntwicklungLink(typeof j.entwicklung_link === "string" ? j.entwicklung_link : "");
      ereignis("lead_gate_gesendet", { kennung, aktion, kontakt: f.kontakt ? 1 : 0, stufe: eintrag?.stufe || 0 });
      if (kontext.mappe && aktion === "pdf") ereignis("mappe_rollen", { kennung, anzahl: rollen.length, rollen: rollen.join("-") });
      if (senden || j.bestaetigung === "keine") {
        setStatus("gesendet");
        return;
      }
      setErneutIn(ERNEUT_SEKUNDEN);
      setStatus("wartet");
    } catch {
      setMeldung("");
      setStatus("fehler");
    }
  };

  const entfernen = async () => {
    await freigabeEntfernen();
    setEntfernt(true);
    ereignis("lead_gate_entfernt", { kennung });
  };

  const rolleUmschalten = (rid) => {
    const neu = rollen.includes(rid) ? rollen.filter((r) => r !== rid) : [...rollen, rid];
    setRollen(neu);
    onRollen?.(neu);
  };

  if (!offen || typeof document === "undefined") return null;

  const feld = (name, label, typ = "text", extra = {}) => (
    <div className={extra.breit ? "sm:col-span-2" : ""}>
      <label htmlFor={`${id}-${name}`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-800">
        {label}
        {extra.pflicht ? (
          <span className="text-ov-700" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-500"> (optional)</span>
        )}
      </label>
      <input
        ref={(el) => {
          feldRefs.current[name] = el;
          if (name === "vorname") ersterRef.current = el;
        }}
        id={`${id}-${name}`}
        name={name}
        type={typ}
        inputMode={extra.inputMode}
        value={f[name]}
        autoComplete={extra.autoComplete}
        required={!!extra.pflicht}
        maxLength={extra.maxLength || 120}
        aria-invalid={!!fehler[name]}
        aria-describedby={fehler[name] ? `${id}-${name}-f` : undefined}
        onChange={setze(name)}
        className={cn(
          "h-12 w-full rounded-xl bg-white px-3.5 text-[16px] text-ink-900 outline-none ring-1 ring-inset transition-shadow focus:ring-2",
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

  const weiterLabel = kontext.weiterLabel || t.weiter;

  // Portal in <body>: Werkzeug-Karten mit transform/overflow würden sonst „fixed“ und z-index einschließen
  // (Kopfzeile und mobile CTA-Leiste lagen über dem Dialog). z-[9700] wie die übrigen Dialoge der Website.
  return createPortal(
    <div className="fixed inset-0 z-[9700] flex items-end justify-center overflow-y-auto bg-navy-950/60 p-2 backdrop-blur-sm sm:items-center sm:p-6" onClick={onSchliessen}>
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titel`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={absenden}
        noValidate
        className="relative max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2rem] sm:p-8"
      >
        <button
          type="button"
          onClick={onSchliessen}
          aria-label="Schließen"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        {status === "frei" ? (
          <div aria-live="polite">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">E-Mail bestätigt</p>
            <h3 id={`${id}-titel`} className="mt-2 pr-12 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              Freigeschaltet – danke!
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
              {eintrag?.stufe === 2 ? "Ihre Auswertung ist auf diesem Gerät freigeschaltet." : "Export, PDF und Link sind auf diesem Gerät 30 Tage freigeschaltet – für alle unsere Rechner."}
            </p>
            {onWeiter && (
              <button
                type="button"
                onClick={onWeiter}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 sm:w-auto"
              >
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                {weiterLabel}
              </button>
            )}
            <div className="mt-6 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/70">
              <p className="text-[14px] font-semibold text-ink-900">Fragen zu den Zahlen?</p>
              <button
                type="button"
                onClick={() => {
                  onSchliessen?.();
                  oeffneRueckruf("rueckruf");
                }}
                className="mt-1 inline-flex min-h-11 items-center gap-2 text-left text-[14px] font-semibold text-ov-800 underline decoration-ov-300 underline-offset-4 hover:text-ov-900"
              >
                <PhoneCall aria-hidden="true" className="h-4 w-4 shrink-0" />
                Fachberater ruft Sie zurück – Wunschzeit wählen
              </button>
            </div>
            <p className="mt-4 text-[12.5px] text-ink-500">
              {entfernt ? (
                <span role="status">Freischaltung auf diesem Gerät entfernt.</span>
              ) : (
                <button type="button" onClick={entfernen} className="min-h-11 underline underline-offset-2 hover:text-ink-800">
                  Freischaltung auf diesem Gerät entfernen
                </button>
              )}
            </p>
          </div>
        ) : status === "gesendet" ? (
          <div aria-live="polite">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Gesendet</p>
            <h3 id={`${id}-titel`} className="mt-2 pr-12 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              Danke – Ihre Kennzahlen sind bei uns
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
              Ein Fachberater legt die Anlage an Ihren Kennzahlen aus und meldet sich per E-Mail{f.kontakt && f.telefon.trim() ? " oder telefonisch" : ""}. {FIRMA.leadVersprechen}
            </p>
            {(onWeiter || kontext.nachSenden) && (
              <div className="mt-5">
                {kontext.nachSenden ? (
                  <Link
                    href={kontext.nachSenden}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2"
                  >
                    {weiterLabel}
                  </Link>
                ) : (
                  <button type="button" onClick={onWeiter} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
                    {weiterLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : status === "wartet" ? (
          <div aria-live="polite">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Fast geschafft</p>
            <h3 id={`${id}-titel`} className="mt-2 pr-12 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              Bitte E-Mail bestätigen
            </h3>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sand-50 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-ov-700 shadow-sm">
                <MailCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="min-w-0 text-[14px] leading-relaxed text-ink-700">
                {art === "team" ? "Wir senden den Bestätigungslink an " : "Link gesendet an "}
                <strong className="break-all text-ink-900">{f.email.trim()}</strong>. Nach dem Klick auf den Link ist{" "}
                {eintrag?.stufe === 2 ? "die Auswertung" : "der Export"} freigeschaltet. Der Link ist 24 Stunden gültig und einmal verwendbar.
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-600">
              Keine E-Mail? Bitte auch im Spam-Ordner nachsehen. Diese Seite können Sie offen lassen – sie erkennt die Bestätigung automatisch.
            </p>
            {entwicklungLink && (
              <div className="mt-3 rounded-xl bg-sun-300/20 p-3 text-[12.5px] leading-relaxed text-ink-800 ring-1 ring-sun-400/60">
                <p>Entwicklungsmodus ohne Backoffice – es wird keine E-Mail versendet. Der Link steht auch im Server-Log.</p>
                <a href={entwicklungLink} target="_blank" rel="noopener" className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ov-800 underline underline-offset-2">
                  Bestätigungslink öffnen (nur Entwicklung)
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={onSchliessen} className="min-h-11 text-[14px] font-semibold text-ink-700 underline-offset-4 hover:underline">
                Später bestätigen
              </button>
              <button
                type="button"
                disabled={erneutIn > 0}
                onClick={() => absenden()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sand-100 px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-ink-200 hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {erneutIn > 0 ? `Erneut senden (${erneutIn} s)` : "Erneut senden"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              {t.kopf}
            </p>
            <h3 id={`${id}-titel`} className="mt-2 pr-12 font-display text-[22px] font-extrabold leading-tight text-ink-900">
              {titel}
            </h3>
            {einleitung && <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{einleitung}</p>}
            {/* Standardsatz nur ohne eigene Einleitung – sonst doppelt und die Felder rutschen auf dem Handy weit nach unten */}
            {!senden && !einleitung && (
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                Einmalig mit Name und E-Mail: Sie erhalten einen Bestätigungslink, danach ist {eintrag?.stufe === 2 ? "die Auswertung" : "der Export"} freigeschaltet.
              </p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {feld("vorname", "Vorname", "text", { pflicht: true, autoComplete: "given-name", maxLength: 60 })}
              {feld("nachname", "Nachname", "text", { pflicht: true, autoComplete: "family-name", maxLength: 60 })}
              {feld("email", "E-Mail-Adresse", "email", { pflicht: true, autoComplete: "email", breit: true, inputMode: "email" })}
              {feld("plz", "PLZ des Standorts", "text", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 4 })}
            </div>

            {kontext.mappe && aktion === "pdf" && (
              <fieldset className="mt-5">
                <legend className="text-[13.5px] font-semibold text-ink-800">
                  Für wen ist der Bericht? <span className="font-normal text-ink-500">(je Rolle ein Kapitel)</span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MAPPE_ROLLEN.map((r) => {
                    const an = rollen.includes(r.id);
                    return (
                      <label
                        key={r.id}
                        className={cn(
                          "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors focus-within:ring-2 focus-within:ring-ov-500",
                          an ? "bg-ov-50 text-ov-800" : "bg-sand-100 text-ink-700 hover:bg-sand-200",
                        )}
                      >
                        <input type="checkbox" checked={an} onChange={() => rolleUmschalten(r.id)} className="h-4 w-4 accent-ov-600" />
                        {r.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <p className="mt-5 rounded-xl bg-sand-50 p-3 text-[13px] leading-relaxed text-ink-700">
              {info?.text}{" "}
              <Link href={info?.link || "/datenschutz#rechner-export"} className="font-semibold text-ov-800 underline underline-offset-2" target="_blank">
                Datenschutz
              </Link>
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={f.kontakt} onChange={setze("kontakt")} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
              <span className="text-[13.5px] leading-relaxed text-ink-700">
                {kontaktText?.text} <span className="text-ink-500">(optional)</span>
              </span>
            </label>
            {f.kontakt && <div className="mt-4">{feld("telefon", "Telefonnummer", "tel", { autoComplete: "tel", inputMode: "tel", maxLength: 30 })}</div>}

            {/* Honigtopf – für Menschen unsichtbar, nicht per Tab erreichbar */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
              <label htmlFor={`${id}-hp`}>Bitte leer lassen</label>
              <input ref={honigRef} id={`${id}-hp`} type="text" name={HONIGTOPF} tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {status === "fehler" && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[13.5px] text-red-800">
                {/* Server-Meldungen mit eigenem Kontakthinweis (503/502) nicht doppelt ergänzen */}
                {meldung && meldung.includes(FIRMA.telefon) ? (
                  meldung
                ) : (
                  <>
                    {meldung || "Gerade nicht möglich."} Bitte später erneut versuchen oder anrufen:{" "}
                    <a href={FIRMA.telefonHref} className="font-semibold underline">
                      {FIRMA.telefon}
                    </a>
                  </>
                )}
              </p>
            )}

            {/* Knopf und Hinweis untereinander – nebeneinander brach beides bei max-w-lg um */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={status === "sendet"}
                className="inline-flex h-12 w-full items-center whitespace-nowrap justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
              >
                {status === "sendet" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <MailCheck aria-hidden="true" className="h-4 w-4" />}
                {senden ? "Kennzahlen senden" : "Bestätigungslink senden"}
              </button>
              <p className="text-center text-[12px] text-ink-500">Verschlüsselte Übertragung · * Pflichtfeld</p>
            </div>
          </>
        )}
      </form>
    </div>,
    document.body,
  );
}
