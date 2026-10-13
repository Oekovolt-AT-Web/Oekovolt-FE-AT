// src/data/fristen.js
//
// Fristen und Stichtage, die für die Investitionsentscheidung relevant sind (Welle A, Paket A03).
// Reine Daten und reine Funktionen (ohne React) – genutzt von KostenDesWartens, IfbHinweis und
// scripts/verkauf.test.mjs. Alle Zeitvergleiche laufen über ein explizites „jetzt“, damit
// Server, Client und Test denselben Stand sehen.
//
// Öko-Investitionsfreibetrag (IFB): § 11 EStG. Für Wirtschaftsgüter, die vom 01.11.2025 bis 31.12.2026
// angeschafft oder hergestellt werden, gilt ein erhöhter Satz (Öko-IFB 22 %, sonst 20 %); danach wieder
// 15 % bzw. 10 %. Bemessungsgrundlage höchstens 1 Mio. € Anschaffungs-/Herstellungskosten je
// Wirtschaftsjahr; nicht bei pauschalierter Gewinnermittlung. Maßgeblich ist die Anschaffung bzw.
// Fertigstellung (Übergang der Verfügungsmacht), nicht die Bestellung. Quelle: WKO (Link unten).
// Steuerliche Zuordnung im Einzelfall: Steuerberatung.

export const FRISTEN = [
  {
    id: "ifb",
    titel: "Öko-Investitionsfreibetrag 22 %",
    ende: "2026-12-31",
    danach: "15 %",
    quelle: "https://www.wko.at/steuern/investitionsfreibetrag",
    stand: "2026-10-03",
  },
  {
    id: "leistungspreis",
    titel: "Leistungskomponente im Netzentgelt (ElWG)",
    ab: "2027-01-01",
    status: "Struktur laut ElWG, Tarife folgen per Verordnung",
    // Elektrizitätswirtschaftsgesetz, BGBl. I Nr. 91/2025 (in Kraft seit 24.12.2025)
    quelle: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91",
    stand: "2026-10-03",
  },
  {
    id: "spitzenkappung",
    titel: "Spitzenkappung für neue PV-Anlagen (§ 101 ElWG)",
    ab: "2027-01-01",
    status: "Begrenzung der Einspeisung auf 70 % der Modulspitzenleistung möglich; Zeitpunkt laut Auftrag, Primärquelle vor Veröffentlichung prüfen",
    quelle: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91",
    stand: "2026-10-03",
  },
];

/** Regeln zum Öko-IFB, aus denen KostenDesWartens rechnet. */
export const IFB = {
  satzBis: 22, // % bis 31.12.2026
  satzDanach: 15, // % ab 01.01.2027
  differenz: 0.07, // 22 % − 15 % als Anteil der Investition
  deckel: 1_000_000, // € Bemessungsgrundlage je Wirtschaftsjahr
  koest: 23, // % Körperschaftsteuer (Kapitalgesellschaften) seit 2024
  // Tarifstufen der Einkommensteuer (§ 33 EStG) – Auswahl für Einzelunternehmen und Personengesellschaften
  grenzsteuersaetze: [20, 30, 40, 48, 50, 55],
  grenzsteuersatzStandard: 48,
};

/** Rechtsformen für die IFB-Rechnung. */
export const RECHTSFORMEN = [
  { id: "kapitalgesellschaft", label: "Kapitalgesellschaft (GmbH, AG)", steuer: "KöSt 23 %" },
  { id: "einzelunternehmen", label: "Einzelunternehmen", steuer: "abhängig vom Grenzsteuersatz" },
  { id: "personengesellschaft", label: "Personengesellschaft (OG, KG)", steuer: "abhängig vom Grenzsteuersatz" },
];

/** Ende eines Tages (ISO-Datum) in ms – Wien (UTC+1 im Winter, Stichtag 31.12. → +01:00). */
const endeDesTagesMs = (iso) => Date.parse(`${iso}T23:59:59+01:00`);
const beginnDesTagesMs = (iso) => Date.parse(`${iso}T00:00:00+01:00`);

/** „jetzt“ als ms – akzeptiert Date, ms, ISO-String; Standard: aktuelle Zeit. */
export function jetztMs(jetzt) {
  if (jetzt == null) return Date.now();
  if (jetzt instanceof Date) return jetzt.getTime();
  if (typeof jetzt === "number") return jetzt;
  const t = Date.parse(String(jetzt));
  return Number.isFinite(t) ? t : Date.now();
}

/** Ist eine Frist zum Zeitpunkt noch relevant? Abgelaufen = `ende` liegt vor jetzt. */
export function fristAktiv(f, jetzt) {
  if (!f) return false;
  const t = jetztMs(jetzt);
  if (f.ende && t > endeDesTagesMs(f.ende)) return false;
  return true;
}

/** Alle Fristen, die zum Zeitpunkt nicht abgelaufen sind. */
export const aktiveFristen = (jetzt) => FRISTEN.filter((f) => fristAktiv(f, jetzt));

/** Frist nach id – null, wenn unbekannt oder abgelaufen. */
export function frist(id, jetzt) {
  const f = FRISTEN.find((x) => x.id === id) || null;
  return f && fristAktiv(f, jetzt) ? f : null;
}

/** Gilt der erhöhte Öko-IFB (22 %) zum Zeitpunkt noch? */
export const istIfbAktiv = (jetzt) => fristAktiv(FRISTEN.find((f) => f.id === "ifb"), jetzt);

/** Ist eine Frist mit `ab` zum Zeitpunkt bereits wirksam? */
export function fristWirksam(f, jetzt) {
  if (!f?.ab) return false;
  return jetztMs(jetzt) >= beginnDesTagesMs(f.ab);
}

/** Nicht gesparte Stromkosten je Monat (Richtwert aus der Jahresersparnis), auf 10 € gerundet. */
export function monatsErsparnis(ersparnisJahr) {
  const j = Number(ersparnisJahr);
  if (!Number.isFinite(j) || j <= 0) return 0;
  return Math.round(j / 12 / 10) * 10;
}

/**
 * Steuerwirkung der IFB-Differenz (22 % statt 15 %) bei einer Investition:
 * min(Investition, 1 Mio. €) × 0,07 × Steuersatz. Steuersatz: KöSt 23 % bei Kapitalgesellschaften,
 * sonst der gewählte Grenzsteuersatz. Ergebnis auf 100 € gerundet; 0 bei ungültiger Eingabe.
 */
export function ifbSteuerwirkung(investitionNetto, { rechtsform = "kapitalgesellschaft", grenzsteuersatz = IFB.grenzsteuersatzStandard } = {}) {
  const inv = Number(investitionNetto);
  if (!Number.isFinite(inv) || inv <= 0) return { basis: 0, satz: 0, wirkung: 0, gedeckelt: false };
  const basis = Math.min(inv, IFB.deckel);
  const satz = rechtsform === "kapitalgesellschaft" ? IFB.koest : Number(grenzsteuersatz) || IFB.grenzsteuersatzStandard;
  const wirkung = Math.round((basis * IFB.differenz * (satz / 100)) / 100) * 100;
  return { basis, satz, wirkung, gedeckelt: inv > IFB.deckel };
}

/** 2026-12-31 → „31.12.2026“ (ohne Intl, hydrationssicher). */
export function datumText(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}
