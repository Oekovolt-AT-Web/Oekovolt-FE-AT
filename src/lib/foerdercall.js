// src/lib/foerdercall.js
//
// 3. EAG-Fördercall 2026 (Investitionszuschuss Photovoltaik & Stromspeicher,
// § 56 EAG, EAG-Investitionszuschüsseverordnung-Strom idF BGBl. II Nr. 12/2026).
//
// Reine Funktionen ohne React – genutzt von /forderungen/eag-foerdercall,
// dem Startseiten-Hinweis und der Kalenderdatei. Mit node testbar.
//
// Quellen (geprüft am 30.09.2026):
//  - EAG-Abwicklungsstelle (OeMAG), Termin „3. Fördercall 2026 für Photovoltaik und Speicher Kat. A–D“:
//    Start 08.10.2026 17:00 (Ticketziehung), Ende 22.10.2026 23:59, je Kategorie 2 Mio. €
//  - EAG-Abwicklungsstelle, FAQs Investitionszuschuss PV 2026 (Frage 14): Antragseinreichung ab dem
//    zweiten Tag des Calls um 8:00 Uhr; Frage 19/20: Speicher mind. 0,5 kWh/kWp, max. 50 kWh gefördert,
//    PV anteilig bis 1.000 kWp; Frage 32: max. 30 % des Investitionsvolumens
//  - BMWET-Presseaussendung 14.06.2026: 3. Call 08.–22.10.2026 mit 8 Mio. €
//
// Orientierung – verbindlich ist der Fördervertrag der EAG-Förderabwicklungsstelle.

/** Termine des Calls. Oktober 2026 = Sommerzeit (MESZ, +02:00) bis 25.10.2026. */
export const FOERDERCALL = {
  nr: 3,
  jahr: 2026,
  zeitraum: "08.10.–22.10.2026",
  ticketStart: "2026-10-08T17:00:00+02:00",
  antragStart: "2026-10-09T08:00:00+02:00",
  ende: "2026-10-22T23:59:00+02:00",
  budgetJeKategorie: 2_000_000,
  budgetGesamt: 8_000_000,
  portal: "https://einreichen.eag-abwicklungsstelle.at/",
  abwicklungsstelle: "https://www.eag-abwicklungsstelle.at/",
  stand: { iso: "2026-09-30", label: "30.09.2026" },
};

/** Kategorien nach Engpassleistung der Neuanlage bzw. Erweiterung (€/kWp). */
export const KATEGORIEN = [
  { id: "A", bis: 10, satz: 150, fix: true, leistung: "bis 10 kWp", reihung: "nach Zeitpunkt der Ticketziehung" },
  { id: "B", bis: 20, satz: 140, fix: true, leistung: "über 10 bis 20 kWp", reihung: "nach Zeitpunkt der Ticketziehung" },
  { id: "C", bis: 100, satz: 130, fix: false, leistung: "über 20 bis 100 kWp", reihung: "nach niedrigstem Förderbedarf in €/kWp" },
  { id: "D", bis: 1000, satz: 120, fix: false, leistung: "über 100 kWp (gefördert bis 1.000 kWp)", reihung: "nach niedrigstem Förderbedarf in €/kWp" },
];

export const SPEICHER = { satz: 150, minKwhJeKwp: 0.5, maxKwh: 50 };
export const MAX_KWP = 1000;
export const DECKEL = 0.3;

const ms = (iso) => Date.parse(iso);

/**
 * Phase des Calls zu einem Zeitpunkt (ms seit Epoche).
 * "vor" | "ticket" (Ticketziehung ab 17 Uhr am 1. Tag) | "einreichung" (ab 2. Tag 8 Uhr) | "nach"
 */
export function callPhase(jetztMs, call = FOERDERCALL) {
  const t = Number(jetztMs);
  if (!Number.isFinite(t) || t < ms(call.ticketStart)) return "vor";
  if (t < ms(call.antragStart)) return "ticket";
  if (t < ms(call.ende)) return "einreichung";
  return "nach";
}

/** Nächster relevanter Zeitpunkt je Phase (für den Countdown); null nach dem Call. */
export function naechstesZiel(jetztMs, call = FOERDERCALL) {
  const phase = callPhase(jetztMs, call);
  if (phase === "vor") return { phase, iso: call.ticketStart, text: "bis zur Ticketziehung" };
  if (phase === "ticket") return { phase, iso: call.antragStart, text: "bis die Antragseinreichung öffnet" };
  if (phase === "einreichung") return { phase, iso: call.ende, text: "bis der Call schließt" };
  return { phase, iso: null, text: "" };
}

/** Restzeit bis zu einem Ziel, nie negativ. */
export function restZeit(zielMs, jetztMs) {
  const rest = Math.max(0, Number(zielMs) - Number(jetztMs)) || 0;
  return {
    gesamtMs: rest,
    tage: Math.floor(rest / 86_400_000),
    stunden: Math.floor((rest % 86_400_000) / 3_600_000),
    minuten: Math.floor((rest % 3_600_000) / 60_000),
    sekunden: Math.floor((rest % 60_000) / 1000),
  };
}

/** Kategorie zur beantragten PV-Leistung (kWp); über 1.000 kWp Kategorie D (anteilig). */
export function kategorieFuer(kwp) {
  const k = Number(kwp);
  if (!Number.isFinite(k) || k <= 0) return null;
  return KATEGORIEN.find((x) => k <= x.bis) || KATEGORIEN[KATEGORIEN.length - 1];
}

const positiv = (x) => {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Geschätzter Investitionszuschuss nach den offiziellen Sätzen des Calls.
 *
 * eingabe: {
 *   kwp,             beantragte Modulspitzenleistung (Neuanlage bzw. Erweiterung)
 *   speicherKwh,     nutzbare Kapazität (Nettokapazität) des neuen Speichers
 *   gebot,           Förderbedarf in €/kWp (nur Kategorie C/D, max. Höchstsatz); leer = Höchstsatz
 *   kostenPv,        geplante förderfähige Kosten PV (netto, ohne Vorsteuerabzug brutto) – optional
 *   kostenSpeicher,  dto. Speicher – optional
 * }
 * Ohne Zu-/Abschläge (Grünland −25 %, innovativ +30 %, Made in Europe) – die rechnet der
 * ausführliche Rechner auf /forderungen/bundesfoerderung.
 */
export function schaetzeFoerderung({ kwp, speicherKwh = 0, gebot = null, kostenPv = null, kostenSpeicher = null } = {}) {
  const leistung = positiv(kwp);
  const kat = kategorieFuer(leistung);
  if (!kat) {
    return { kategorie: null, kwpFoerderfaehig: 0, satz: 0, pv: 0, pvVorDeckel: 0, speicher: { ok: false, grund: "keine-pv", kwhFoerderfaehig: 0, betrag: 0, betragVorDeckel: 0, minKwh: 0 }, summe: 0, gedeckelt: false, hinweise: ["Ohne PV-Leistung gibt es keinen Investitionszuschuss – ein Speicher allein ist nicht förderfähig."] };
  }

  const hinweise = [];
  const kwpFoerderfaehig = Math.min(leistung, MAX_KWP);
  if (leistung > MAX_KWP) hinweise.push(`Gefördert wird anteilig bis ${MAX_KWP.toLocaleString("de-DE")} kWp.`);

  const g = positiv(gebot);
  const satz = kat.fix ? kat.satz : g ? Math.min(kat.satz, g) : kat.satz;
  if (!kat.fix && g > kat.satz) hinweise.push(`Das Gebot ist auf den Höchstsatz von ${kat.satz} €/kWp begrenzt.`);

  const pvVorDeckel = kwpFoerderfaehig * satz;

  // Speicher: nur mit PV, mind. 0,5 kWh je beantragtem kWp, gefördert höchstens 50 kWh
  const kwh = positiv(speicherKwh);
  const minKwh = Math.round(kwpFoerderfaehig * SPEICHER.minKwhJeKwp * 100) / 100;
  let spOk = false;
  let grund = kwh ? null : "kein-speicher";
  if (kwh) {
    if (kwh + 1e-9 < minKwh) grund = "zu-klein";
    else spOk = true;
  }
  const kwhFoerderfaehig = spOk ? Math.min(kwh, SPEICHER.maxKwh) : 0;
  if (spOk && kwh > SPEICHER.maxKwh) hinweise.push(`Beim Speicher werden höchstens ${SPEICHER.maxKwh} kWh gefördert.`);
  if (grund === "zu-klein") hinweise.push(`Der Speicher braucht mindestens ${minKwh.toLocaleString("de-DE")} kWh (0,5 kWh je kWp), sonst gibt es dafür keinen Zuschuss.`);
  const spVorDeckel = kwhFoerderfaehig * SPEICHER.satz;

  // 30-%-Deckel, wenn Kosten angegeben sind
  const kPv = positiv(kostenPv);
  const kSp = positiv(kostenSpeicher);
  const pv = kPv ? Math.min(pvVorDeckel, kPv * DECKEL) : pvVorDeckel;
  const sp = kSp && spVorDeckel ? Math.min(spVorDeckel, kSp * DECKEL) : spVorDeckel;
  const gedeckelt = pv < pvVorDeckel - 0.005 || sp < spVorDeckel - 0.005;
  if (gedeckelt) hinweise.push("Der Deckel von 30 % der Investitionskosten greift – der Zuschuss ist entsprechend gekürzt.");

  return {
    kategorie: kat,
    kwpFoerderfaehig,
    satz,
    pv: runden(pv),
    pvVorDeckel: runden(pvVorDeckel),
    speicher: { ok: spOk, grund, kwhFoerderfaehig, betrag: runden(sp), betragVorDeckel: runden(spVorDeckel), minKwh },
    summe: runden(pv + sp),
    gedeckelt,
    // Kosten, ab denen der volle Betrag nicht vom 30-%-Deckel gekürzt wird
    mindestKostenPv: runden(pvVorDeckel / DECKEL),
    mindestKostenSpeicher: runden(spVorDeckel / DECKEL),
    hinweise,
  };
}

function runden(x) {
  return Math.round(x * 100) / 100;
}

/** Betrag als „12.345 €“ (österreichische Schreibweise, ganze Euro). */
export function euro(n) {
  return `${Math.round(Number(n) || 0).toLocaleString("de-DE")} €`;
}
