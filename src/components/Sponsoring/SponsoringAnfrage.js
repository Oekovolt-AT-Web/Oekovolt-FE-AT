"use client";

// src/components/Sponsoring/SponsoringAnfrage.js
//
// Anfrageformular für Sponsoring → /api/sponsoring.

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
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
} from "@/components/Partner/Formularteile";
import { BUNDESLAENDER } from "@/components/Partner/partnerDaten";
import { BEREICHE, GEGENLEISTUNGEN, ORGANISATIONSFORMEN, REICHWEITEN, UNTERSTUETZUNG } from "./sponsoringDaten";

const ID = "sponsoring";

const LEER = {
  organisation: "",
  organisationsform: "",
  zvr: "",
  bereich: "",
  vorname: "",
  nachname: "",
  funktion: "",
  email: "",
  telefon: "",
  bundesland: "",
  plz: "",
  ort: "",
  reichweite: "",
  reichweiteDetails: "",
  unterstuetzung: [],
  betrag: "",
  zeitraum: "",
  gegenleistungen: [],
  nachricht: "",
  dateilink: "",
  datenschutz: false,
};

const REIHENFOLGE = Object.keys(LEER);

function pruefe(w) {
  const f = {};
  const t = (k) => String(w[k] || "").trim();
  if (!t("organisation")) f.organisation = "Bitte den Namen der Organisation angeben.";
  if (!t("bereich")) f.bereich = "Bitte den Bereich wählen.";
  if (t("zvr") && !/^\d{9,10}$/.test(t("zvr").replace(/\s/g, ""))) f.zvr = "Die ZVR-Zahl besteht aus 9 Ziffern.";
  if (!t("vorname")) f.vorname = "Bitte den Vornamen angeben.";
  if (!t("nachname")) f.nachname = "Bitte den Nachnamen angeben.";
  if (!EMAIL_RE.test(t("email"))) f.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (!telefonOk(t("telefon"))) f.telefon = "Bitte eine Telefonnummer für Rückfragen angeben.";
  if (!t("bundesland")) f.bundesland = "Bitte das Bundesland wählen.";
  if (t("plz") && !/^\d{4}$/.test(t("plz"))) f.plz = "Bitte eine österreichische Postleitzahl (4 Ziffern) angeben.";
  if (!t("ort")) f.ort = "Bitte den Ort angeben.";
  if (!t("reichweite")) f.reichweite = "Bitte die ungefähre Reichweite wählen.";
  if (!w.unterstuetzung.length) f.unterstuetzung = "Bitte mindestens eine Form der Unterstützung wählen.";
  if (!t("zeitraum")) f.zeitraum = "Bitte den Zeitraum angeben, z. B. Saison 2027.";
  if (t("nachricht").length < 50) f.nachricht = "Bitte beschreiben Sie Ihr Vorhaben in mindestens 50 Zeichen.";
  if (t("dateilink") && !urlOk(t("dateilink"))) f.dateilink = "Bitte einen vollständigen Link angeben, z. B. https://…";
  if (!w.datenschutz) f.datenschutz = "Bitte bestätigen Sie die Datenschutzhinweise.";
  return f;
}

export default function SponsoringAnfrage() {
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
      await sende("/api/sponsoring", { ...werte, quelle: window.location.pathname, website: website.current?.value || "" });
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
        titel="Danke für Ihre Anfrage!"
        text="Ihre Sponsoring-Anfrage ist bei uns angekommen. Wir prüfen sie anhand unserer Kriterien und melden uns bei Ihnen."
        schritte={[
          ["Prüfung", "von Bezug zu Österreich, Zweck und Reichweite."],
          ["Gespräch", "zu Umfang, Zeitraum und Gegenleistungen."],
          ["Vereinbarung", "schriftlich, mit Bericht nach Abschluss."],
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
        <legend className="mb-1 font-display text-[19px] font-extrabold text-ink-900">1. Organisation</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="organisation" label="Name der Organisation" wert={werte.organisation} fehler={fehler.organisation} pflicht autoComplete="organization" className="sm:col-span-2" />
          <Feld {...p} name="bereich" label="Bereich" art="select" optionen={BEREICHE} wert={werte.bereich} fehler={fehler.bereich} pflicht />
          <Feld {...p} name="organisationsform" label="Art der Organisation" art="select" optionen={ORGANISATIONSFORMEN} wert={werte.organisationsform} fehler={fehler.organisationsform} />
          <Feld {...p} name="zvr" label="ZVR-Zahl" hinweis="bei Vereinen" wert={werte.zvr} fehler={fehler.zvr} inputMode="numeric" placeholder="123456789" />
          <Feld {...p} name="bundesland" label="Bundesland" art="select" optionen={BUNDESLAENDER} wert={werte.bundesland} fehler={fehler.bundesland} pflicht />
          <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
            <Feld {...p} name="plz" label="PLZ" wert={werte.plz} fehler={fehler.plz} inputMode="numeric" autoComplete="postal-code" />
            <Feld {...p} name="ort" label="Ort" wert={werte.ort} fehler={fehler.ort} pflicht autoComplete="address-level2" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-[19px] font-extrabold text-ink-900">2. Ansprechperson</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="vorname" label="Vorname" wert={werte.vorname} fehler={fehler.vorname} pflicht autoComplete="given-name" />
          <Feld {...p} name="nachname" label="Nachname" wert={werte.nachname} fehler={fehler.nachname} pflicht autoComplete="family-name" />
          <Feld {...p} name="funktion" label="Funktion" wert={werte.funktion} fehler={fehler.funktion} placeholder="z. B. Obfrau, Direktor, Kassier" />
          <Feld {...p} name="email" label="E-Mail-Adresse" type="email" inputMode="email" wert={werte.email} fehler={fehler.email} pflicht autoComplete="email" />
          <Feld {...p} name="telefon" label="Telefonnummer" type="tel" inputMode="tel" wert={werte.telefon} fehler={fehler.telefon} pflicht autoComplete="tel" />
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="mb-1 font-display text-[19px] font-extrabold text-ink-900">3. Vorhaben</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld {...p} name="reichweite" label="Reichweite" hinweis="Mitglieder, Besucher, Follower" art="select" optionen={REICHWEITEN} wert={werte.reichweite} fehler={fehler.reichweite} pflicht />
          <Feld {...p} name="reichweiteDetails" label="Reichweite im Detail" wert={werte.reichweiteDetails} fehler={fehler.reichweiteDetails} placeholder="z. B. 180 Mitglieder, 12 Heimspiele" />
          <Feld {...p} name="zeitraum" label="Zeitraum" wert={werte.zeitraum} fehler={fehler.zeitraum} pflicht placeholder="z. B. Saison 2027 oder 14. Mai 2027" />
          <Feld {...p} name="betrag" label="Gewünschter Umfang" wert={werte.betrag} fehler={fehler.betrag} placeholder="z. B. 1.500 € oder Sachleistung" />
        </div>
        <Mehrfachauswahl {...p} name="unterstuetzung" legende="Gewünschte Unterstützung" optionen={UNTERSTUETZUNG} werte={werte.unterstuetzung} fehler={fehler.unterstuetzung} pflicht />
        <Mehrfachauswahl {...p} name="gegenleistungen" legende="Was Sie anbieten können" optionen={GEGENLEISTUNGEN} werte={werte.gegenleistungen} fehler={fehler.gegenleistungen} />
        <Feld
          {...p}
          name="nachricht"
          label="Ihr Vorhaben"
          art="textarea"
          hinweis="mind. 50 Zeichen"
          wert={werte.nachricht}
          fehler={fehler.nachricht}
          pflicht
          placeholder="Wofür wird die Unterstützung eingesetzt, wer profitiert davon, und wie passt das Vorhaben zu Energie, Umwelt oder Region?"
        />
        <Feld {...p} name="dateilink" label="Link zu Konzept oder Unterlagen" type="url" inputMode="url" hinweis="z. B. Cloud-Ordner, PDF" wert={werte.dateilink} fehler={fehler.dateilink} placeholder="https://" />
      </fieldset>

      <Haken {...p} name="datenschutz" wert={werte.datenschutz} fehler={fehler.datenschutz}>
        <DatenschutzText zweck="zur Prüfung der Sponsoring-Anfrage und zur Kontaktaufnahme" />
      </Haken>

      <Honeypot refObj={website} />

      {status === "fehler" && <SendeFehler meldung={meldung} />}

      <div className="flex flex-col gap-4 border-t border-ink-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[13px] text-ink-500">Pflichtfelder sind mit * markiert.</span>
        <SendenKnopf sendet={status === "sendet"}>
          Anfrage senden
          <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </SendenKnopf>
      </div>
    </form>
  );
}
