// src/lib/site.js
//
// Zentrale Angaben zur österreichischen Website (www.oekovolt.com).
// Registerdaten verifiziert am 2026-09-28 über WKO Firmen A–Z, FirmenABC und
// das österreichische Firmenbuch (FN 375708m, Landesgericht Ried im Innkreis).
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
  },
  wko: "https://firmen.wko.at/%C3%96kovolt-solartechnik-gmbh-%C3%96kovolt-solartechnik-gmbh/ober%C3%B6sterreich/?firmaid=683331b8-cc78-405b-983d-55acaee1a686",
  firmenabc: "https://www.firmenabc.at/oekovolt-solartechnik-gmbh_OvcS",
};

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
