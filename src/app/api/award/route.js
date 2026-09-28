// src/app/api/award/route.js
//
// Einreichungen zum Ökovolt PV Award (/pv-award).
// Validiert die Eingaben, verwirft Spam (Honeypot „website“) und leitet an das
// Backoffice weiter (Kontakt-Endpunkt mit eigenem Thema, siehe
// @/lib/api/uber-uns/anfrageWeiterleiten).

import {
  eine,
  gedrosselt,
  honeypotAntwort,
  istEmail,
  istPlzAT,
  istTelefon,
  istUrl,
  leseJson,
  pruefung,
  text,
  validierungsFehler,
  weiterleiten,
} from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { AWARD_JAHR, AWARD_THEMA, KATEGORIE_TITEL } from "@/components/Award/awardDaten";
import { BUNDESLAENDER } from "@/components/Partner/partnerDaten";

const zahl = (w) => {
  const s = text(w, 20).replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

export async function POST(request) {
  const drossel = gedrosselt(request, "award");
  if (drossel) return drossel;

  const { daten, antwort } = await leseJson(request);
  if (antwort) return antwort;

  if (text(daten.website)) return honeypotAntwort();

  const d = {
    kategorie: eine(daten.kategorie, KATEGORIE_TITEL),
    projektname: text(daten.projektname, 160),
    betreiber: text(daten.betreiber, 160),
    plz: text(daten.plz, 10),
    ort: text(daten.ort, 80),
    bundesland: eine(daten.bundesland, BUNDESLAENDER),
    inbetriebnahme: text(daten.inbetriebnahme, 7),
    leistung: zahl(daten.leistung),
    speicher: zahl(daten.speicher),
    ertrag: zahl(daten.ertrag),
    eigenverbrauch: zahl(daten.eigenverbrauch),
    beschreibung: text(daten.beschreibung, 4000),
    fotolink: text(daten.fotolink, 400),
    projektnummer: text(daten.projektnummer, 60),
    vorname: text(daten.vorname, 80),
    nachname: text(daten.nachname, 80),
    funktion: text(daten.funktion, 80),
    email: text(daten.email, 160),
    telefon: text(daten.telefon, 40),
    kunde: daten.kunde === true,
    veroeffentlichung: daten.veroeffentlichung === true,
    monitoring: daten.monitoring === true,
    datenschutz: daten.datenschutz === true,
    quelle: text(daten.quelle, 200),
  };

  const p = pruefung();
  p.wenn(!d.kategorie, "kategorie", "Bitte wählen Sie eine Kategorie.");
  p.wenn(!d.projektname, "projektname", "Bitte geben Sie dem Projekt einen Namen.");
  p.wenn(!d.betreiber, "betreiber", "Bitte geben Sie Unternehmen, Betrieb oder Gemeinde an.");
  p.wenn(!istPlzAT(d.plz), "plz", "Bitte die Postleitzahl des Anlagenstandorts (4 Ziffern) angeben.");
  p.wenn(!d.ort, "ort", "Bitte den Ort des Anlagenstandorts angeben.");
  p.wenn(!d.bundesland, "bundesland", "Bitte das Bundesland wählen.");
  p.wenn(!/^\d{4}-(0[1-9]|1[0-2])$/.test(d.inbetriebnahme), "inbetriebnahme", "Bitte Monat und Jahr der Inbetriebnahme angeben.");
  p.wenn(!(d.leistung > 0 && d.leistung < 100000), "leistung", "Bitte die Leistung in kWp angeben.");
  p.wenn(Number.isNaN(d.speicher) || d.speicher < 0, "speicher", "Bitte eine Zahl in kWh angeben.");
  p.wenn(Number.isNaN(d.ertrag) || d.ertrag < 0, "ertrag", "Bitte eine Zahl in kWh angeben.");
  p.wenn(Number.isNaN(d.eigenverbrauch) || d.eigenverbrauch < 0 || d.eigenverbrauch > 100, "eigenverbrauch", "Bitte einen Wert zwischen 0 und 100 angeben.");
  p.wenn(d.beschreibung.length < 80, "beschreibung", "Bitte beschreiben Sie das Projekt in mindestens 80 Zeichen.");
  p.wenn(d.fotolink && !istUrl(d.fotolink), "fotolink", "Bitte einen vollständigen Link angeben.");
  p.wenn(!d.vorname, "vorname", "Bitte den Vornamen angeben.");
  p.wenn(!d.nachname, "nachname", "Bitte den Nachnamen angeben.");
  p.wenn(!istEmail(d.email), "email", "Bitte eine gültige E-Mail-Adresse angeben.");
  p.wenn(!istTelefon(d.telefon), "telefon", "Bitte eine Telefonnummer für Rückfragen angeben.");
  p.wenn(!d.kunde, "kunde", "Der Award steht nur Kundinnen und Kunden von Ökovolt offen.");
  p.wenn(!d.veroeffentlichung, "veroeffentlichung", "Die Einwilligung zur Veröffentlichung ist Teilnahmevoraussetzung.");
  p.wenn(!d.datenschutz, "datenschutz", "Bitte bestätigen Sie die Datenschutzhinweise.");
  if (!p.ok()) return validierungsFehler(p.felder);

  const opt = (n, einheit) => (n === null ? "" : `${String(n).replace(".", ",")} ${einheit}`);

  return weiterleiten({
    request,
    thema: AWARD_THEMA,
    kontext: "PV-Award API",
    quelle: d.quelle || "/pv-award",
    kontakt: { vorname: d.vorname, nachname: d.nachname, email: d.email, telefon: d.telefon, strasse: "", plz: d.plz, ort: d.ort },
    zeilen: [
      ["Award-Jahrgang", String(AWARD_JAHR)],
      ["Kategorie", d.kategorie],
      ["Projekt", d.projektname],
      ["Betreiber", d.betreiber],
      ["Anlagenstandort", `${d.plz} ${d.ort} (${d.bundesland})`],
      ["Inbetriebnahme", d.inbetriebnahme],
      ["Leistung", opt(d.leistung, "kWp")],
      ["Speicher", opt(d.speicher, "kWh")],
      ["Jahresertrag", opt(d.ertrag, "kWh")],
      ["Eigenverbrauchsanteil", opt(d.eigenverbrauch, "%")],
      ["Beschreibung", d.beschreibung],
      ["Fotos/Unterlagen", d.fotolink],
      ["Projekt-/Kundennummer", d.projektnummer],
      ["Ansprechperson", `${d.vorname} ${d.nachname}${d.funktion ? ` (${d.funktion})` : ""}`],
      ["E-Mail", d.email],
      ["Telefon", d.telefon],
      ["Ökovolt-Kunde bestätigt", "ja"],
      ["Einwilligung Veröffentlichung", "ja"],
      ["Monitoring-Daten für Bewertung", d.monitoring ? "ja" : "nein"],
      ["Datenschutz-Einwilligung", "ja"],
    ],
  });
}
