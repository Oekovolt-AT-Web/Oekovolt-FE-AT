"use client";

// src/components/Partner/PartnerRegistrierung.js
//
// Mehrstufige Registrierung für Elektrotechnik-Betriebe (Subunternehmer).
// Schritt 1 Betrieb · Schritt 2 Leistungen & Kapazität · Schritt 3 Kontakt.
// Sendet an /api/partner-registrierung (Validierung + Weiterleitung ans
// Backoffice dort). Jeder Schritt wird vor dem Weitergehen geprüft.

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, ClipboardCheck, UserRound } from "lucide-react";
import {
  DatenschutzText,
  EMAIL_RE,
  Erfolg,
  Feld,
  Haken,
  Honeypot,
  Mehrfachauswahl,
  SendeFehler,
  SendenKnopf,
  fokusErsterFehler,
  sende,
  telefonOk,
  urlOk,
  useFormular,
} from "./Formularteile";
import { BUNDESLAENDER, KAPAZITAETEN, LEISTUNGEN, NACHWEISE, RECHTSFORMEN, TEAMGROESSEN } from "./partnerDaten";

const ID = "partner";

const LEER = {
  firma: "",
  rechtsform: "",
  uid: "",
  gisa: "",
  firmenbuch: "",
  strasse: "",
  plz: "",
  ort: "",
  bundesland: "",
  webseite: "",
  einsatzgebiet: [],
  teamgroesse: "",
  kapazitaet: "",
  leistungen: [],
  nachweise: [],
  zertifikate: "",
  referenzen: "",
  vorname: "",
  nachname: "",
  funktion: "",
  email: "",
  telefon: "",
  nachricht: "",
  gewerbe: false,
  datenschutz: false,
};

const SCHRITTE = [
  { titel: "Betrieb", icon: Building2, felder: ["firma", "rechtsform", "uid", "gisa", "firmenbuch", "strasse", "plz", "ort", "bundesland", "webseite"] },
  { titel: "Leistungen", icon: ClipboardCheck, felder: ["einsatzgebiet", "teamgroesse", "kapazitaet", "leistungen", "nachweise", "zertifikate", "referenzen"] },
  { titel: "Kontakt", icon: UserRound, felder: ["vorname", "nachname", "funktion", "email", "telefon", "nachricht", "gewerbe", "datenschutz"] },
];

function pruefe(w) {
  const f = {};
  const t = (k) => String(w[k] || "").trim();
  if (!t("firma")) f.firma = "Bitte geben Sie den Firmennamen an.";
  if (!/^ATU\d{8}$/.test(t("uid").replace(/\s/g, "").toUpperCase())) f.uid = "Bitte eine gültige UID angeben (ATU + 8 Ziffern).";
  if (!/^\d{6,10}$/.test(t("gisa").replace(/\s/g, ""))) f.gisa = "Bitte die GISA-Zahl angeben (nur Ziffern).";
  if (t("firmenbuch") && !/^(FN\s?)?\d{1,6}\s?[a-z]$/i.test(t("firmenbuch"))) f.firmenbuch = "Format z. B. FN 123456a.";
  if (!t("strasse")) f.strasse = "Bitte Straße und Hausnummer angeben.";
  if (!/^\d{4}$/.test(t("plz"))) f.plz = "Bitte eine österreichische Postleitzahl (4 Ziffern) angeben.";
  if (!t("ort")) f.ort = "Bitte den Ort angeben.";
  if (!t("bundesland")) f.bundesland = "Bitte das Bundesland des Firmensitzes wählen.";
  if (t("webseite") && !urlOk(t("webseite"))) f.webseite = "Bitte eine vollständige Adresse angeben, z. B. https://www.beispiel.at.";
  if (!w.einsatzgebiet.length) f.einsatzgebiet = "Bitte mindestens ein Bundesland wählen.";
  if (!t("teamgroesse")) f.teamgroesse = "Bitte die Teamgröße wählen.";
  if (!t("kapazitaet")) f.kapazitaet = "Bitte die Montagekapazität wählen.";
  if (!w.leistungen.length) f.leistungen = "Bitte mindestens eine Leistung wählen.";
  if (!t("vorname")) f.vorname = "Bitte den Vornamen angeben.";
  if (!t("nachname")) f.nachname = "Bitte den Nachnamen angeben.";
  if (!EMAIL_RE.test(t("email"))) f.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (!telefonOk(t("telefon"))) f.telefon = "Bitte eine Telefonnummer für Rückfragen angeben.";
  if (!w.gewerbe) f.gewerbe = "Die Registrierung setzt eine Gewerbeberechtigung für Elektrotechnik voraus.";
  if (!w.datenschutz) f.datenschutz = "Bitte bestätigen Sie die Datenschutzhinweise.";
  return f;
}

export default function PartnerRegistrierung() {
  const { werte, setze, fehler, setFehler, zuruecksetzen } = useFormular(LEER);
  const [schritt, setSchritt] = useState(0);
  const [status, setStatus] = useState("bereit"); // bereit | sendet | erfolg | fehler
  const [meldung, setMeldung] = useState("");
  const formRef = useRef(null);
  const kopfRef = useRef(null);
  const website = useRef(null);

  const fehlerIn = (idx, alle) => Object.fromEntries(SCHRITTE[idx].felder.filter((k) => alle[k]).map((k) => [k, alle[k]]));

  const geheZu = (idx) => {
    setSchritt(idx);
    requestAnimationFrame(() => kopfRef.current?.focus());
  };

  const weiter = () => {
    const f = fehlerIn(schritt, pruefe(werte));
    setFehler(f);
    if (Object.keys(f).length) {
      fokusErsterFehler(formRef.current, f, SCHRITTE[schritt].felder);
      return;
    }
    geheZu(schritt + 1);
  };

  const absenden = async (e) => {
    e.preventDefault();
    if (schritt < SCHRITTE.length - 1) {
      weiter();
      return;
    }
    const alle = pruefe(werte);
    if (Object.keys(alle).length) {
      setFehler(alle);
      const idx = SCHRITTE.findIndex((s) => s.felder.some((k) => alle[k]));
      if (idx !== schritt) geheZu(idx);
      else fokusErsterFehler(formRef.current, alle, SCHRITTE[idx].felder);
      return;
    }
    setStatus("sendet");
    setMeldung("");
    try {
      await sende("/api/partner-registrierung", { ...werte, quelle: window.location.pathname, website: website.current?.value || "" });
      setStatus("erfolg");
    } catch (err) {
      if (err.felder) {
        setFehler(err.felder);
        const idx = SCHRITTE.findIndex((s) => s.felder.some((k) => err.felder[k]));
        if (idx >= 0 && idx !== schritt) geheZu(idx);
      }
      setMeldung(err.message);
      setStatus("fehler");
    }
  };

  if (status === "erfolg") {
    return (
      <Erfolg
        titel="Danke für Ihre Registrierung!"
        text="Ihre Angaben sind bei uns angekommen. Wir prüfen Gewerbeberechtigung, Leistungen und Einsatzgebiet und melden uns für das Kennenlerngespräch."
        schritte={[
          ["Prüfung", "von Gewerbeberechtigung, Versicherung und Nachweisen."],
          ["Kennenlernen", "per Video oder bei Ihnen im Betrieb."],
          ["Onboarding", "mit Standards, Dokumentation und ersten Projekten."],
        ]}
        zurueck={() => {
          zuruecksetzen();
          setSchritt(0);
          setStatus("bereit");
        }}
      />
    );
  }

  const p = { id: ID, setze };
  const aktiv = SCHRITTE[schritt];

  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="relative space-y-8">
      {/* Fortschritt */}
      <ol className="grid grid-cols-3 gap-2" aria-label="Fortschritt der Registrierung">
        {SCHRITTE.map((s, i) => {
          const erledigt = i < schritt;
          const jetzt = i === schritt;
          return (
            <li key={s.titel} aria-current={jetzt ? "step" : undefined}>
              <button
                type="button"
                onClick={() => (i < schritt ? geheZu(i) : undefined)}
                disabled={i > schritt}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-3 text-left text-[14px] font-semibold transition-colors ${
                  jetzt ? "bg-navy-950 text-white" : erledigt ? "bg-ov-50 text-ov-800 ring-1 ring-ov-200 hover:bg-ov-100" : "bg-ink-50 text-ink-500"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${jetzt ? "bg-ov-500 text-white" : erledigt ? "bg-ov-500 text-white" : "bg-white text-ink-400 ring-1 ring-ink-200"}`}>
                  <s.icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-medium uppercase tracking-wider opacity-70">Schritt {i + 1}</span>
                  <span className="block truncate">{s.titel}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <h3 ref={kopfRef} tabIndex={-1} className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 outline-none">
        {schritt + 1}. {aktiv.titel === "Betrieb" ? "Ihr Betrieb" : aktiv.titel === "Leistungen" ? "Leistungen, Einsatzgebiet & Kapazität" : "Ansprechperson & Abschluss"}
      </h3>

      {schritt === 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="firma" label="Firmenname laut Firmenbuch bzw. GISA" wert={werte.firma} fehler={fehler.firma} pflicht autoComplete="organization" className="sm:col-span-2" />
          <Feld {...p} name="rechtsform" label="Rechtsform" art="select" optionen={RECHTSFORMEN} wert={werte.rechtsform} fehler={fehler.rechtsform} />
          <Feld {...p} name="uid" label="UID-Nummer" wert={werte.uid} fehler={fehler.uid} pflicht placeholder="ATU12345678" autoCapitalize="characters" />
          <Feld {...p} name="gisa" label="GISA-Zahl" hinweis="Gewerbeinformationssystem Austria" wert={werte.gisa} fehler={fehler.gisa} pflicht inputMode="numeric" placeholder="12345678" />
          <Feld {...p} name="firmenbuch" label="Firmenbuchnummer" wert={werte.firmenbuch} fehler={fehler.firmenbuch} placeholder="FN 123456a" />
          <Feld {...p} name="strasse" label="Straße und Hausnummer" wert={werte.strasse} fehler={fehler.strasse} pflicht autoComplete="street-address" className="sm:col-span-2" />
          <Feld {...p} name="plz" label="PLZ" wert={werte.plz} fehler={fehler.plz} pflicht inputMode="numeric" autoComplete="postal-code" placeholder="5121" />
          <Feld {...p} name="ort" label="Ort" wert={werte.ort} fehler={fehler.ort} pflicht autoComplete="address-level2" />
          <Feld {...p} name="bundesland" label="Bundesland des Firmensitzes" art="select" optionen={BUNDESLAENDER} wert={werte.bundesland} fehler={fehler.bundesland} pflicht />
          <Feld {...p} name="webseite" label="Website" type="url" inputMode="url" wert={werte.webseite} fehler={fehler.webseite} placeholder="https://" />
        </div>
      )}

      {schritt === 1 && (
        <div className="space-y-7">
          <Mehrfachauswahl {...p} name="einsatzgebiet" legende="Einsatzgebiet (Bundesländer)" optionen={BUNDESLAENDER} werte={werte.einsatzgebiet} fehler={fehler.einsatzgebiet} pflicht />
          <div className="grid gap-5 sm:grid-cols-2">
            <Feld {...p} name="teamgroesse" label="Teamgröße (Montage & Elektro)" art="select" optionen={TEAMGROESSEN} wert={werte.teamgroesse} fehler={fehler.teamgroesse} pflicht />
            <Feld {...p} name="kapazitaet" label="Kapazität pro Monat" hinweis="installierbare PV-Leistung" art="select" optionen={KAPAZITAETEN} wert={werte.kapazitaet} fehler={fehler.kapazitaet} pflicht />
          </div>
          <Mehrfachauswahl {...p} name="leistungen" legende="Leistungen" optionen={LEISTUNGEN} werte={werte.leistungen} fehler={fehler.leistungen} pflicht />
          <Mehrfachauswahl {...p} name="nachweise" legende="Nachweise & Befähigungen" hinweis="Nachweise fordern wir bei der Prüfung an." optionen={NACHWEISE} werte={werte.nachweise} fehler={fehler.nachweise} />
          <Feld {...p} name="zertifikate" label="Weitere Zertifikate & Schulungen" wert={werte.zertifikate} fehler={fehler.zertifikate} placeholder="z. B. Herstellerschulungen, Blitzschutz, Prüftechnik" />
          <Feld {...p} name="referenzen" label="Referenzen" art="textarea" wert={werte.referenzen} fehler={fehler.referenzen} placeholder="z. B. 2025: 420 kWp Hallendach, AC-Anschluss inkl. Übergabe; 2024: Ladeinfrastruktur für einen Fuhrpark …" />
        </div>
      )}

      {schritt === 2 && (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Feld {...p} name="vorname" label="Vorname" wert={werte.vorname} fehler={fehler.vorname} pflicht autoComplete="given-name" />
            <Feld {...p} name="nachname" label="Nachname" wert={werte.nachname} fehler={fehler.nachname} pflicht autoComplete="family-name" />
            <Feld {...p} name="funktion" label="Funktion" wert={werte.funktion} fehler={fehler.funktion} placeholder="z. B. Geschäftsführung" autoComplete="organization-title" />
            <Feld {...p} name="email" label="E-Mail-Adresse" type="email" inputMode="email" wert={werte.email} fehler={fehler.email} pflicht autoComplete="email" />
            <Feld {...p} name="telefon" label="Telefonnummer" type="tel" inputMode="tel" wert={werte.telefon} fehler={fehler.telefon} pflicht autoComplete="tel" />
          </div>
          <Feld {...p} name="nachricht" label="Nachricht" art="textarea" wert={werte.nachricht} fehler={fehler.nachricht} placeholder="Was sollten wir noch über Ihren Betrieb wissen?" />
          <Haken {...p} name="gewerbe" wert={werte.gewerbe} fehler={fehler.gewerbe}>
            Unser Betrieb verfügt über eine aufrechte Gewerbeberechtigung für Elektrotechnik und eine Betriebshaftpflichtversicherung. <span className="text-ov-600" aria-hidden="true">*</span>
          </Haken>
          <Haken {...p} name="datenschutz" wert={werte.datenschutz} fehler={fehler.datenschutz}>
            <DatenschutzText zweck="zur Prüfung der Registrierung und zur Kontaktaufnahme im Rahmen des Elektro-Partnerprogramms" />
          </Haken>
        </div>
      )}

      <Honeypot refObj={website} />

      {status === "fehler" && <SendeFehler meldung={meldung} />}

      <div className="flex flex-col-reverse gap-3 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {schritt > 0 ? (
          <button
            type="button"
            onClick={() => geheZu(schritt - 1)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Zurück
          </button>
        ) : (
          <span className="text-[13px] text-ink-500">Pflichtfelder sind mit * markiert.</span>
        )}
        {schritt < SCHRITTE.length - 1 ? (
          <button
            type="button"
            onClick={weiter}
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ov-600 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700"
          >
            Weiter zu Schritt {schritt + 2}
            <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <SendenKnopf sendet={status === "sendet"}>
            Registrierung absenden
            <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </SendenKnopf>
        )}
      </div>
    </form>
  );
}
