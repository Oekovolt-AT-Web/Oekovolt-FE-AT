// src/app/api/partner-registrierung/route.js
//
// Registrierung für das Elektro-Partnerprogramm (/partner).
// Validiert die Eingaben, verwirft Spam (Honeypot „website“) und leitet an das
// Backoffice weiter (Kontakt-Endpunkt mit eigenem Thema, siehe
// @/lib/api/uber-uns/anfrageWeiterleiten).

import {
  auswahl,
  eine,
  gedrosselt,
  honeypotAntwort,
  istEmail,
  istFirmenbuch,
  istGisa,
  istPlzAT,
  istTelefon,
  istUidAT,
  istUrl,
  leseJson,
  pruefung,
  text,
  validierungsFehler,
  weiterleiten,
} from "@/lib/api/uber-uns/anfrageWeiterleiten";
import {
  BUNDESLAENDER,
  KAPAZITAETEN,
  LEISTUNGEN,
  NACHWEISE,
  PARTNER_THEMA,
  RECHTSFORMEN,
  TEAMGROESSEN,
} from "@/components/Partner/partnerDaten";

export async function POST(request) {
  const drossel = gedrosselt(request, "partner");
  if (drossel) return drossel;

  const { daten, antwort } = await leseJson(request);
  if (antwort) return antwort;

  if (text(daten.website)) return honeypotAntwort();

  const d = {
    firma: text(daten.firma, 160),
    rechtsform: eine(daten.rechtsform, RECHTSFORMEN),
    uid: text(daten.uid, 20).replace(/\s/g, "").toUpperCase(),
    gisa: text(daten.gisa, 20).replace(/\s/g, ""),
    firmenbuch: text(daten.firmenbuch, 20),
    strasse: text(daten.strasse, 120),
    plz: text(daten.plz, 10),
    ort: text(daten.ort, 80),
    bundesland: eine(daten.bundesland, BUNDESLAENDER),
    webseite: text(daten.webseite, 200),
    einsatzgebiet: auswahl(daten.einsatzgebiet, BUNDESLAENDER),
    teamgroesse: eine(daten.teamgroesse, TEAMGROESSEN),
    kapazitaet: eine(daten.kapazitaet, KAPAZITAETEN),
    leistungen: auswahl(daten.leistungen, LEISTUNGEN),
    nachweise: auswahl(daten.nachweise, NACHWEISE),
    zertifikate: text(daten.zertifikate, 400),
    referenzen: text(daten.referenzen, 2000),
    vorname: text(daten.vorname, 80),
    nachname: text(daten.nachname, 80),
    funktion: text(daten.funktion, 80),
    email: text(daten.email, 160),
    telefon: text(daten.telefon, 40),
    nachricht: text(daten.nachricht, 2000),
    gewerbe: daten.gewerbe === true,
    datenschutz: daten.datenschutz === true,
    quelle: text(daten.quelle, 200),
  };

  const p = pruefung();
  p.wenn(!d.firma, "firma", "Bitte geben Sie den Firmennamen an.");
  p.wenn(!istUidAT(d.uid), "uid", "Bitte eine gültige UID angeben (ATU + 8 Ziffern).");
  p.wenn(!istGisa(d.gisa), "gisa", "Bitte die GISA-Zahl angeben (nur Ziffern).");
  p.wenn(d.firmenbuch && !istFirmenbuch(d.firmenbuch), "firmenbuch", "Format z. B. FN 123456a.");
  p.wenn(!d.strasse, "strasse", "Bitte Straße und Hausnummer angeben.");
  p.wenn(!istPlzAT(d.plz), "plz", "Bitte eine österreichische Postleitzahl (4 Ziffern) angeben.");
  p.wenn(!d.ort, "ort", "Bitte den Ort angeben.");
  p.wenn(!d.bundesland, "bundesland", "Bitte das Bundesland des Firmensitzes wählen.");
  p.wenn(d.webseite && !istUrl(d.webseite), "webseite", "Bitte eine vollständige Adresse angeben.");
  p.wenn(d.einsatzgebiet.length === 0, "einsatzgebiet", "Bitte mindestens ein Bundesland wählen.");
  p.wenn(!d.teamgroesse, "teamgroesse", "Bitte die Teamgröße wählen.");
  p.wenn(!d.kapazitaet, "kapazitaet", "Bitte die Montagekapazität wählen.");
  p.wenn(d.leistungen.length === 0, "leistungen", "Bitte mindestens eine Leistung wählen.");
  p.wenn(!d.vorname, "vorname", "Bitte den Vornamen angeben.");
  p.wenn(!d.nachname, "nachname", "Bitte den Nachnamen angeben.");
  p.wenn(!istEmail(d.email), "email", "Bitte eine gültige E-Mail-Adresse angeben.");
  p.wenn(!istTelefon(d.telefon), "telefon", "Bitte eine Telefonnummer für Rückfragen angeben.");
  p.wenn(!d.gewerbe, "gewerbe", "Die Registrierung setzt eine Gewerbeberechtigung für Elektrotechnik voraus.");
  p.wenn(!d.datenschutz, "datenschutz", "Bitte bestätigen Sie die Datenschutzhinweise.");
  if (!p.ok()) return validierungsFehler(p.felder);

  return weiterleiten({
    request,
    thema: PARTNER_THEMA,
    kontext: "Partner-Registrierung API",
    quelle: d.quelle || "/partner",
    kontakt: { vorname: d.vorname, nachname: d.nachname, email: d.email, telefon: d.telefon, strasse: d.strasse, plz: d.plz, ort: d.ort },
    zeilen: [
      ["Firma", d.firma],
      ["Rechtsform", d.rechtsform],
      ["UID", d.uid],
      ["GISA-Zahl", d.gisa],
      ["Firmenbuchnummer", d.firmenbuch],
      ["Adresse", `${d.strasse}, ${d.plz} ${d.ort} (${d.bundesland})`],
      ["Website", d.webseite],
      ["Einsatzgebiet", d.einsatzgebiet],
      ["Teamgröße", d.teamgroesse],
      ["Kapazität pro Monat", d.kapazitaet],
      ["Leistungen", d.leistungen],
      ["Nachweise", d.nachweise],
      ["Weitere Zertifikate", d.zertifikate],
      ["Referenzen", d.referenzen],
      ["Ansprechperson", `${d.vorname} ${d.nachname}${d.funktion ? ` (${d.funktion})` : ""}`],
      ["E-Mail", d.email],
      ["Telefon", d.telefon],
      ["Nachricht", d.nachricht],
      ["Gewerbeberechtigung Elektrotechnik & Haftpflicht bestätigt", "ja"],
      ["Datenschutz-Einwilligung", "ja"],
    ],
  });
}
