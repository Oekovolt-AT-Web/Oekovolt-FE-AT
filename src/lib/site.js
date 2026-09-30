// src/lib/site.js
//
// Zentrale Angaben zur österreichischen Website (www.oekovolt.com).
// Registerdaten verifiziert am 2026-09-28 über WKO Firmen A–Z, FirmenABC und
// das österreichische Firmenbuch (FN 375708m, Landesgericht Ried im Innkreis).
// Verbandsmitgliedschaft (PV&B Austria) verifiziert am 2026-09-30 über das
// Mitgliederverzeichnis des Verbands.
//
// Wer eine dieser Angaben ändert, ändert sie hier – nicht in einzelnen Seiten.

export const BASE_URL = "https://www.oekovolt.com";
export const SITE_NAME = "Ökovolt Österreich";
export const LOCALE = "de_AT";
export const LANG = "de-AT";

/** Österreichische Gesellschaft – Betreiberin dieser Website. */
export const FIRMA = {
  name: "Ökovolt Solartechnik GmbH",
  kurz: "Ökovolt",
  rechtsform: "Gesellschaft mit beschränkter Haftung (GmbH)",
  strasse: "Gewerbegebiet 10",
  plz: "5121",
  ort: "Ostermiething",
  bundesland: "Oberösterreich",
  land: "Österreich",
  telefon: "+43 6278 71030",
  telefonHref: "tel:+43627871030",
  email: "office@oekovolt.com",
  web: BASE_URL,
  firmenbuch: "FN 375708m",
  firmenbuchgericht: "Landesgericht Ried im Innkreis",
  euid: "ATBRA.375708-000",
  uid: "ATU67027148",
  gisa: "17864251",
  gewerbe: "Elektrotechnik (reglementiertes Gewerbe)",
  kammer: "Wirtschaftskammer Oberösterreich",
  innung: "Landesinnung der Elektro-, Gebäude-, Alarm- und Kommunikationstechniker Oberösterreich",
  behoerde: "Bezirkshauptmannschaft Braunau am Inn",
  stammkapital: "35.000 €",
  gegruendet: "2012",
  geschaeftsfuehrer: "Andreas Wegscheider",
  // Stand Firmenbuch/FirmenABC 09/2026. Vor Änderungen Firmenbuch prüfen.
  gesellschafter: [
    { name: "Andreas Wegscheider", anteil: "51 %" },
    { name: "Salzburg AG für Energie, Verkehr und Telekommunikation", anteil: "49 %" },
  ],
  geo: { lat: 48.0428, lng: 12.8417 },
  oeffnungszeiten: [
    { tage: "Mo – Do", zeit: "08:00 – 16:00" },
    { tage: "Fr", zeit: "08:00 – 13:00" },
  ],
  social: {
    facebook: "https://www.facebook.com/Oekovolt/",
    linkedin: "https://www.linkedin.com/company/oekovolt",
    // von der bisherigen oekovolt.com verlinkt (geprüft 2026-09-30)
    instagram: "https://www.instagram.com/oekovolt.austria/",
  },
  wko: "https://firmen.wko.at/%C3%96kovolt-solartechnik-gmbh-%C3%96kovolt-solartechnik-gmbh/ober%C3%B6sterreich/?firmaid=683331b8-cc78-405b-983d-55acaee1a686",
  firmenabc: "https://www.firmenabc.at/oekovolt-solartechnik-gmbh_OvcS",
  // Kartenlink für schema.org `hasMap` (Suche nach Firmenname und Adresse).
  karte: "https://www.google.com/maps?q=%C3%96kovolt+Solartechnik+GmbH,+Gewerbegebiet+10,+5121+Ostermiething",
  // Kein X-/Twitter-Handle: Es ist nicht belegt, dass ein Konto der österreichischen GmbH gehört
  // (SEO-Plan E6/M24). Erst mit Nachweis hier eintragen und in layout.js (twitter.site) ergänzen.
  // Google-Unternehmensprofil, Bing Places, Apple Business Connect: Links erst nach Prüfung
  // eintragen (SEO-Plan M29) – leere Werte werden nicht ausgegeben.
  googleUnternehmensprofil: "",
  bingPlaces: "",
  // Verbände mit Mitgliedschaftsnachweis (schema.org `memberOf`).
  verbaende: [
    {
      name: "Bundesverband Photovoltaic & Battery Austria",
      kurz: "PV&B Austria",
      // früher „Bundesverband Photovoltaic Austria (PV Austria)“; pvaustria.at leitet auf pvbaustria.at weiter (geprüft 2026-09-30)
      alternateName: ["PV&B Austria", "PV Austria", "Bundesverband Photovoltaic Austria"],
      url: "https://pvbaustria.at",
      status: "ordentliches Mitglied",
      // Beleg: Mitgliederverzeichnis, Abschnitt „Ordentliche Mitglieder“, Logo „Oekovolt Solartechnik GmbH“
      // mit Link auf oekovolt.com – abgerufen am 2026-09-30.
      beleg: "https://pvbaustria.at/mitglieder/",
      geprueft: "2026-09-30",
    },
  ],
};

/**
 * Profile derselben Firma (schema.org `sameAs`): nur Einträge, die eindeutig die
 * österreichische GmbH zeigen. Leere Werte (noch nicht geprüft) fallen heraus.
 */
FIRMA.profile = [
  FIRMA.social.facebook,
  FIRMA.social.linkedin,
  FIRMA.social.instagram,
  FIRMA.wko,
  FIRMA.firmenabc,
  FIRMA.googleUnternehmensprofil,
  FIRMA.bingPlaces,
].filter(Boolean);

/** Deutsche Schwestergesellschaft – Inhaberin der Marken- und Websiterechte. */
export const SCHWESTER = {
  name: "ÖKOVOLT GmbH Solartechnik",
  strasse: "Schlingener Straße 1a",
  plz: "86842",
  ort: "Türkheim",
  land: "Deutschland",
  register: "HRB 14166, Amtsgericht Memmingen",
  web: "https://www.oekovolt.de",
};

/** Solensa GmbH – Partnerin für Digitalisierung und Nachhaltigkeitsmarketing. */
export const SOLENSA = {
  name: "Solensa GmbH",
  web: "https://www.solensa.com",
};
