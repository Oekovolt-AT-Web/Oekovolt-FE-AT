"use client";

// src/components/Award/AwardEinreichung.js
//
// Einreichungsformular für den Ökovolt PV Award → /api/award.
// Nur für Kundinnen und Kunden von Ökovolt; Einwilligung zur Veröffentlichung
// ist Teilnahmevoraussetzung.

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  DatenschutzText,
  EMAIL_RE,
  Erfolg,
  Feld,
  Haken,
  Honeypot,
  SendeFehler,
  SendenKnopf,
  fokusErsterFehler,
  sende,
  telefonOk,
  urlOk,
  useFormular,
} from "@/components/Partner/Formularteile";
import { BUNDESLAENDER } from "@/components/Partner/partnerDaten";
import { AWARD_NAME, KATEGORIE_TITEL } from "./awardDaten";

const ID = "award";

const LEER = {
  kategorie: "",
  projektname: "",
  betreiber: "",
  plz: "",
  ort: "",
  bundesland: "",
  inbetriebnahme: "",
  leistung: "",
  speicher: "",
  ertrag: "",
  eigenverbrauch: "",
  beschreibung: "",
  fotolink: "",
  projektnummer: "",
  vorname: "",
  nachname: "",
  funktion: "",
  email: "",
  telefon: "",
  kunde: false,
  veroeffentlichung: false,
  monitoring: false,
  datenschutz: false,
};

const REIHENFOLGE = Object.keys(LEER);

const zahl = (w) => Number(String(w).replace(",", "."));

function pruefe(w) {
  const f = {};
  const t = (k) => String(w[k] || "").trim();
  if (!t("kategorie")) f.kategorie = "Bitte wählen Sie eine Kategorie.";
  if (!t("projektname")) f.projektname = "Bitte geben Sie dem Projekt einen Namen.";
  if (!t("betreiber")) f.betreiber = "Bitte geben Sie Unternehmen, Betrieb oder Gemeinde an.";
  if (!/^\d{4}$/.test(t("plz"))) f.plz = "Bitte die Postleitzahl des Anlagenstandorts (4 Ziffern) angeben.";
  if (!t("ort")) f.ort = "Bitte den Ort des Anlagenstandorts angeben.";
  if (!t("bundesland")) f.bundesland = "Bitte das Bundesland wählen.";
  if (!/^\d{4}-\d{2}$/.test(t("inbetriebnahme"))) f.inbetriebnahme = "Bitte Monat und Jahr der Inbetriebnahme angeben.";
  if (!(zahl(w.leistung) > 0 && zahl(w.leistung) < 100000)) f.leistung = "Bitte die Leistung in kWp angeben.";
  if (t("speicher") && !(zahl(w.speicher) >= 0)) f.speicher = "Bitte eine Zahl in kWh angeben.";
  if (t("ertrag") && !(zahl(w.ertrag) >= 0)) f.ertrag = "Bitte eine Zahl in kWh angeben.";
  if (t("eigenverbrauch") && !(zahl(w.eigenverbrauch) >= 0 && zahl(w.eigenverbrauch) <= 100)) f.eigenverbrauch = "Bitte einen Wert zwischen 0 und 100 angeben.";
  if (t("beschreibung").length < 80) f.beschreibung = "Bitte beschreiben Sie das Projekt in mindestens 80 Zeichen.";
  if (t("fotolink") && !urlOk(t("fotolink"))) f.fotolink = "Bitte einen vollständigen Link angeben, z. B. https://…";
  if (!t("vorname")) f.vorname = "Bitte den Vornamen angeben.";
  if (!t("nachname")) f.nachname = "Bitte den Nachnamen angeben.";
  if (!EMAIL_RE.test(t("email"))) f.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (!telefonOk(t("telefon"))) f.telefon = "Bitte eine Telefonnummer für Rückfragen angeben.";
  if (!w.kunde) f.kunde = "Der Award steht nur Kundinnen und Kunden von Ökovolt offen.";
  if (!w.veroeffentlichung) f.veroeffentlichung = "Die Einwilligung zur Veröffentlichung ist Teilnahmevoraussetzung.";
  if (!w.datenschutz) f.datenschutz = "Bitte bestätigen Sie die Datenschutzhinweise.";
  return f;
}

export default function AwardEinreichung() {
  const { werte, setze, fehler, setFehler, zuruecksetzen } = useFormular(LEER);
  const [status, setStatus] = useState("bereit");
  const [meldung, setMeldung] = useState("");
  const formRef = useRef(null);
  const website = useRef(null);

  const absenden = async (e) => {
    e.preventDefault();
    const f = pruefe(werte);
    setFehler(f);
    if (Object.keys(f).length) {
      fokusErsterFehler(formRef.current, f, REIHENFOLGE);
      return;
    }
    setStatus("sendet");
    setMeldung("");
    try {
      await sende("/api/award", { ...werte, quelle: window.location.pathname, website: website.current?.value || "" });
      setStatus("erfolg");
    } catch (err) {
      if (err.felder) setFehler(err.felder);
      setMeldung(err.message);
      setStatus("fehler");
    }
  };

  if (status === "erfolg") {
    return (
      <Erfolg
        titel="Ihr Projekt ist eingereicht!"
        text={`Danke für Ihre Einreichung zum ${AWARD_NAME}. Wir melden uns bei Ihnen, sobald die Vorprüfung abgeschlossen ist.`}
        schritte={[
          ["Vorprüfung", "von Teilnahmeberechtigung und Anlagendaten."],
          ["Rückfragen", "zu Kennzahlen oder Fotos, falls nötig."],
          ["Jury", "bewertet alle nominierten Projekte je Kategorie."],
        ]}
        zurueck={() => {
          zuruecksetzen();
          setStatus("bereit");
        }}
      />
    );
  }

  const p = { id: ID, setze };

  return (
    <form ref={formRef} onSubmit={absenden} noValidate className="relative space-y-8">
      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-[19px] font-extrabold text-ink-900">1. Das Projekt</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="kategorie" label="Kategorie" art="select" optionen={KATEGORIE_TITEL} wert={werte.kategorie} fehler={fehler.kategorie} pflicht className="sm:col-span-2" />
          <Feld {...p} name="projektname" label="Projektname" wert={werte.projektname} fehler={fehler.projektname} pflicht placeholder="z. B. Hallendach Logistikzentrum" />
          <Feld {...p} name="betreiber" label="Unternehmen, Betrieb oder Gemeinde" wert={werte.betreiber} fehler={fehler.betreiber} pflicht autoComplete="organization" />
          <Feld {...p} name="plz" label="PLZ Anlagenstandort" wert={werte.plz} fehler={fehler.plz} pflicht inputMode="numeric" />
          <Feld {...p} name="ort" label="Ort Anlagenstandort" wert={werte.ort} fehler={fehler.ort} pflicht />
          <Feld {...p} name="bundesland" label="Bundesland" art="select" optionen={BUNDESLAENDER} wert={werte.bundesland} fehler={fehler.bundesland} pflicht />
          <Feld {...p} name="inbetriebnahme" label="Inbetriebnahme" type="month" wert={werte.inbetriebnahme} fehler={fehler.inbetriebnahme} pflicht />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-[19px] font-extrabold text-ink-900">2. Kennzahlen</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="leistung" label="Leistung in kWp" inputMode="decimal" wert={werte.leistung} fehler={fehler.leistung} pflicht placeholder="z. B. 250" />
          <Feld {...p} name="speicher" label="Speicher in kWh" inputMode="decimal" wert={werte.speicher} fehler={fehler.speicher} />
          <Feld {...p} name="ertrag" label="Jahresertrag in kWh" inputMode="decimal" wert={werte.ertrag} fehler={fehler.ertrag} />
          <Feld {...p} name="eigenverbrauch" label="Eigenverbrauchsanteil in %" inputMode="decimal" wert={werte.eigenverbrauch} fehler={fehler.eigenverbrauch} />
        </div>
        <Feld
          {...p}
          name="beschreibung"
          label="Was macht das Projekt besonders?"
          art="textarea"
          hinweis="mind. 80 Zeichen"
          wert={werte.beschreibung}
          fehler={fehler.beschreibung}
          pflicht
          placeholder="Ziele, Lösung, Ergebnis: z. B. Eigenverbrauch durch Speicher erhöht, Kühlhaus tagsüber mit Solarstrom, Energiegemeinschaft mit Nachbarn …"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="fotolink" label="Link zu Fotos oder Unterlagen" type="url" inputMode="url" hinweis="z. B. Cloud-Ordner" wert={werte.fotolink} fehler={fehler.fotolink} placeholder="https://" />
          <Feld {...p} name="projektnummer" label="Ökovolt-Projekt- oder Kundennummer" wert={werte.projektnummer} fehler={fehler.projektnummer} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-[19px] font-extrabold text-ink-900">3. Ansprechperson</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="vorname" label="Vorname" wert={werte.vorname} fehler={fehler.vorname} pflicht autoComplete="given-name" />
          <Feld {...p} name="nachname" label="Nachname" wert={werte.nachname} fehler={fehler.nachname} pflicht autoComplete="family-name" />
          <Feld {...p} name="funktion" label="Funktion" wert={werte.funktion} fehler={fehler.funktion} autoComplete="organization-title" />
          <Feld {...p} name="email" label="E-Mail-Adresse" type="email" inputMode="email" wert={werte.email} fehler={fehler.email} pflicht autoComplete="email" />
          <Feld {...p} name="telefon" label="Telefonnummer" type="tel" inputMode="tel" wert={werte.telefon} fehler={fehler.telefon} pflicht autoComplete="tel" />
        </div>
      </fieldset>

      <div className="space-y-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
        <Haken {...p} name="kunde" wert={werte.kunde} fehler={fehler.kunde}>
          Die Anlage wurde von der Ökovolt Solartechnik GmbH errichtet, erweitert oder wird von ihr betreut, und ich bin berechtigt, sie einzureichen. <span className="text-ov-600" aria-hidden="true">*</span>
        </Haken>
        <Haken {...p} name="veroeffentlichung" wert={werte.veroeffentlichung} fehler={fehler.veroeffentlichung}>
          Ich willige ein, dass Projektname, Betreiber, Standort (Ort), Beschreibung, Fotos und Kennzahlen im Rahmen des {AWARD_NAME} auf oekovolt.com, in sozialen Medien und in Pressemitteilungen veröffentlicht werden. Widerruf bis zur Jurysitzung möglich. <span className="text-ov-600" aria-hidden="true">*</span>
        </Haken>
        <Haken {...p} name="monitoring" wert={werte.monitoring} fehler={fehler.monitoring}>
          Ökovolt darf für die Bewertung Betriebsdaten der Anlage aus Monitoring und Fernwartung heranziehen (optional).
        </Haken>
        <Haken {...p} name="datenschutz" wert={werte.datenschutz} fehler={fehler.datenschutz}>
          <DatenschutzText zweck="zur Durchführung des PV Award (Prüfung, Jurybewertung, Kontaktaufnahme)" />
        </Haken>
      </div>

      <Honeypot refObj={website} />

      {status === "fehler" && <SendeFehler meldung={meldung} />}

      <div className="flex flex-col gap-4 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[13px] text-ink-500">Pflichtfelder sind mit * markiert.</span>
        <SendenKnopf sendet={status === "sendet"}>
          Projekt einreichen
          <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </SendenKnopf>
      </div>
    </form>
  );
}
