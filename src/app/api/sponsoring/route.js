// src/app/api/sponsoring/route.js
//
// Sponsoring-Anfragen (/sponsoring).
// Validiert die Eingaben, verwirft Spam (Honeypot „website“) und leitet an das
// Backoffice weiter (Kontakt-Endpunkt mit eigenem Thema, siehe
// @/lib/api/uber-uns/anfrageWeiterleiten).

import {
  auswahl,
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
import { BUNDESLAENDER } from "@/components/Partner/partnerDaten";
import {
  BEREICHE,
  GEGENLEISTUNGEN,
  ORGANISATIONSFORMEN,
  REICHWEITEN,
  SPONSORING_THEMA,
  UNTERSTUETZUNG,
} from "@/components/Sponsoring/sponsoringDaten";

export async function POST(request) {
  const drossel = gedrosselt(request, "sponsoring");
  if (drossel) return drossel;

  const { daten, antwort } = await leseJson(request);
  if (antwort) return antwort;

  if (text(daten.website)) return honeypotAntwort();

  const d = {
    organisation: text(daten.organisation, 160),
    organisationsform: eine(daten.organisationsform, ORGANISATIONSFORMEN),
    zvr: text(daten.zvr, 20).replace(/\s/g, ""),
    bereich: eine(daten.bereich, BEREICHE),
    vorname: text(daten.vorname, 80),
    nachname: text(daten.nachname, 80),
    funktion: text(daten.funktion, 80),
    email: text(daten.email, 160),
    telefon: text(daten.telefon, 40),
    bundesland: eine(daten.bundesland, BUNDESLAENDER),
    plz: text(daten.plz, 10),
    ort: text(daten.ort, 80),
    reichweite: eine(daten.reichweite, REICHWEITEN),
    reichweiteDetails: text(daten.reichweiteDetails, 200),
    unterstuetzung: auswahl(daten.unterstuetzung, UNTERSTUETZUNG),
    betrag: text(daten.betrag, 120),
    zeitraum: text(daten.zeitraum, 120),
    gegenleistungen: auswahl(daten.gegenleistungen, GEGENLEISTUNGEN),
    nachricht: text(daten.nachricht, 4000),
    dateilink: text(daten.dateilink, 400),
    datenschutz: daten.datenschutz === true,
    quelle: text(daten.quelle, 200),
  };

  const p = pruefung();
  p.wenn(!d.organisation, "organisation", "Bitte den Namen der Organisation angeben.");
  p.wenn(!d.bereich, "bereich", "Bitte den Bereich wählen.");
  p.wenn(d.zvr && !/^\d{9,10}$/.test(d.zvr), "zvr", "Die ZVR-Zahl besteht aus 9 Ziffern.");
  p.wenn(!d.vorname, "vorname", "Bitte den Vornamen angeben.");
  p.wenn(!d.nachname, "nachname", "Bitte den Nachnamen angeben.");
  p.wenn(!istEmail(d.email), "email", "Bitte eine gültige E-Mail-Adresse angeben.");
  p.wenn(!istTelefon(d.telefon), "telefon", "Bitte eine Telefonnummer für Rückfragen angeben.");
  p.wenn(!d.bundesland, "bundesland", "Bitte das Bundesland wählen.");
  p.wenn(d.plz && !istPlzAT(d.plz), "plz", "Bitte eine österreichische Postleitzahl (4 Ziffern) angeben.");
  p.wenn(!d.ort, "ort", "Bitte den Ort angeben.");
  p.wenn(!d.reichweite, "reichweite", "Bitte die ungefähre Reichweite wählen.");
  p.wenn(d.unterstuetzung.length === 0, "unterstuetzung", "Bitte mindestens eine Form der Unterstützung wählen.");
  p.wenn(!d.zeitraum, "zeitraum", "Bitte den Zeitraum angeben.");
  p.wenn(d.nachricht.length < 50, "nachricht", "Bitte beschreiben Sie Ihr Vorhaben in mindestens 50 Zeichen.");
  p.wenn(d.dateilink && !istUrl(d.dateilink), "dateilink", "Bitte einen vollständigen Link angeben.");
  p.wenn(!d.datenschutz, "datenschutz", "Bitte bestätigen Sie die Datenschutzhinweise.");
  if (!p.ok()) return validierungsFehler(p.felder);

  return weiterleiten({
    request,
    thema: SPONSORING_THEMA,
    kontext: "Sponsoring API",
    quelle: d.quelle || "/sponsoring",
    kontakt: { vorname: d.vorname, nachname: d.nachname, email: d.email, telefon: d.telefon, strasse: "", plz: d.plz, ort: d.ort },
    zeilen: [
      ["Organisation", d.organisation],
      ["Art der Organisation", d.organisationsform],
      ["ZVR-Zahl", d.zvr],
      ["Bereich", d.bereich],
      ["Standort", `${d.plz ? `${d.plz} ` : ""}${d.ort} (${d.bundesland})`],
      ["Ansprechperson", `${d.vorname} ${d.nachname}${d.funktion ? ` (${d.funktion})` : ""}`],
      ["E-Mail", d.email],
      ["Telefon", d.telefon],
      ["Reichweite", d.reichweite],
      ["Reichweite im Detail", d.reichweiteDetails],
      ["Gewünschte Unterstützung", d.unterstuetzung],
      ["Gewünschter Umfang", d.betrag],
      ["Zeitraum", d.zeitraum],
      ["Angebotene Gegenleistungen", d.gegenleistungen],
      ["Vorhaben", d.nachricht],
      ["Unterlagen", d.dateilink],
      ["Datenschutz-Einwilligung", "ja"],
    ],
  });
}
