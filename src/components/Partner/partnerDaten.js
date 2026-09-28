// src/components/Partner/partnerDaten.js
//
// Auswahlwerte des Elektro-Partnerprogramms – gemeinsam genutzt von der Seite
// /partner, dem Registrierungsformular (Client) und der API-Route
// /api/partner-registrierung (Server-Validierung). Keine Client-Direktive,
// damit Server und Client dieselben Listen verwenden.

/** Die neun Bundesländer – auch von Award- und Sponsoring-Formular genutzt. */
export const BUNDESLAENDER = [
  "Burgenland",
  "Kärnten",
  "Niederösterreich",
  "Oberösterreich",
  "Salzburg",
  "Steiermark",
  "Tirol",
  "Vorarlberg",
  "Wien",
];

export const RECHTSFORMEN = ["Einzelunternehmen", "e.U.", "GmbH", "OG", "KG", "GmbH & Co KG", "AG", "Sonstige"];

export const TEAMGROESSEN = ["1–3 Personen", "4–9 Personen", "10–24 Personen", "25–49 Personen", "50 Personen und mehr"];

export const KAPAZITAETEN = ["bis 50 kWp", "50–150 kWp", "150–500 kWp", "500–1.000 kWp", "über 1.000 kWp"];

export const LEISTUNGEN = [
  "DC-Montage (Unterkonstruktion & Module)",
  "DC-Verkabelung & Stringmessung",
  "AC-Anschluss & Wechselrichter",
  "Verteilerbau & Übergabepunkt",
  "Speicher (Gewerbe/Industrie)",
  "Ladeinfrastruktur",
  "Mittelspannung & Trafostation",
  "Blitz- und Überspannungsschutz",
  "Erdungsanlagen",
  "Kabelverlegung & Tiefbau",
  "Freiflächen-Gestellbau / Rammung",
  "Prüfung & Messung (ÖVE/ÖNORM E 8101)",
  "Service & Wartung",
];

export const NACHWEISE = [
  "Unterweisung PSA gegen Absturz",
  "Hubarbeitsbühnen-Befähigung",
  "Schaltberechtigung Mittelspannung",
  "Herstellerzertifizierung Wechselrichter/Speicher",
  "Eintrag in der HFU-Gesamtliste",
  "Betriebshaftpflichtversicherung",
  "Erste-Hilfe-Ausbildung im Team",
  "Kranführer- bzw. Staplerschein im Team",
];

export const PARTNER_THEMA = "Elektro-Partner – Registrierung";
