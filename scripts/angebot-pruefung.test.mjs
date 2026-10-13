// Tests für src/lib/angebot/pruefung.js (Paket B08) – Aufruf: node scripts/angebot-pruefung.test.mjs
// Prüft Felderkennung aus Angebotstext, Kennzahlen (€/kWp, €/kWh Jahresertrag), Marktbezug nur je
// passender Größenklasse (1.551 €/kWp nur 5 kWp), EAG-30-%-Grenze, Checkliste, Zweck-Liste für
// /api/scan/start und die Regel „keine Wertung, keine Namen“ in den Texten.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ANTWORTEN,
  BEISPIEL,
  EAG_ZUSCHUSS_MAX,
  LEERE_FELDER,
  MARKTSTATISTIK,
  PRUEFPUNKTE,
  QUELLEN,
  ZWECKE,
  checkliste,
  eagPruefung,
  erkenneFelder,
  ertragPlausibel,
  kennzahlen,
  marktbezug,
  pruefen,
  quelleFuerZweck,
  textNormalisieren,
  zusammenfassungZeilen,
  zweckGueltig,
} from "../src/lib/angebot/pruefung.js";

let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};
const nahe = (a, b, tol, text) => assert.ok(Math.abs(a - b) <= tol, `${text}: ${a} ≠ ${b} (±${tol})`);

const ANGEBOT = `Angebot Nr. 2026-0815
Photovoltaikanlage   99,9 kWp  auf Flachdach
Pos 1  227 Stk. Modul 440 Wp Glas-Glas, Hersteller laut Datenblatt
Pos 2  1 Stk. Wechselrichter 100 kW, 3-phasig
Pos 3  Speicher 50 kWh Batterie, nutzbar
Pos 4  Unterkonstruktion Flachdach Ost/West ballastiert
Pos 5  Netzanschluss: Netzebene 7, bestehender Zählpunkt
Gewährleistung: 3 Jahre
Produktgarantie 15 Jahre, Leistungsgarantie 30 Jahre
Summe netto EUR 84.900,00
20 % USt 16.980,00
Gesamt brutto 101.880,00 €
Statik bauseits
Ertragsprognose laut PVGIS 950 kWh/kWp`;

test("Zweck-Liste ist fest und wird korrekt in die Quelle übersetzt", () => {
  assert.deepEqual(ZWECKE, ["angebot", "zweitmeinung", "hof", "stoerung"]);
  for (const z of ZWECKE) assert.ok(zweckGueltig(z), z);
  assert.equal(zweckGueltig("upload"), false);
  assert.equal(zweckGueltig(""), false);
  assert.equal(zweckGueltig(null), false);
  assert.equal(zweckGueltig(["angebot"]), false);
  assert.equal(quelleFuerZweck("zweitmeinung"), "Website · Zweitmeinung");
  assert.equal(quelleFuerZweck("stoerung"), "Website · Störung");
  assert.equal(quelleFuerZweck("x"), "Website");
});

test("Text normalisieren: Mehrfach-Leerzeichen und Leerzeilen", () => {
  assert.equal(textNormalisieren("  a   b \r\n\n\n c\t d  "), "a b\nc d");
  assert.equal(textNormalisieren(null), "");
});

test("Felder aus Angebotstext erkennen", () => {
  const e = erkenneFelder(ANGEBOT);
  assert.equal(e.felder.kwp, 99.9);
  assert.equal(e.felder.preisNetto, 84900);
  assert.match(e.felder.modul, /Modul 440 Wp/);
  assert.match(e.felder.wechselrichter, /Wechselrichter 100 kW/);
  assert.equal(e.felder.speicherKwh, 50);
  assert.match(e.felder.unterkonstruktion, /Unterkonstruktion/);
  assert.match(e.felder.netzanschluss, /Netzebene 7/);
  assert.equal(e.felder.gewaehrleistung, "3 Jahre");
  assert.equal(e.felder.garantie, "15 / 30 Jahre");
  assert.equal(e.treffer.preisNetto, "Summe netto EUR 84.900,00");
  assert.ok(e.zeichen > 100);
});

test("Erkennung: Nettosumme nimmt den größten Netto-Betrag, nicht den Bruttobetrag", () => {
  const e = erkenneFelder("Zwischensumme netto 1.000,00 €\nSumme netto 12.345,67 €\nGesamt brutto 14.814,80 €");
  assert.equal(e.felder.preisNetto, 12345.67);
  const e2 = erkenneFelder("Nettobetrag: € 9.900\nBrutto € 11.880");
  assert.equal(e2.felder.preisNetto, 9900);
});

test("Erkennung: Leistung mit Schlüsselwort hat Vorrang vor sonstigen kWp-Nennungen", () => {
  const e = erkenneFelder("Vergleichsanlage 50 kWp\nAnlagenleistung: 120,5 kWp\nmax. 50 kWp je String");
  assert.equal(e.felder.kwp, 120.5);
});

test("Erkennung: ohne Treffer bleiben die Felder leer", () => {
  const e = erkenneFelder("Sehr geehrte Damen und Herren, anbei unser Angebot.");
  assert.deepEqual(e.felder, { ...LEERE_FELDER });
  assert.deepEqual(e.treffer, {});
  assert.equal(Object.values(e.stichworte).some(Boolean), false);
});

test("Stichworte je Prüfpunkt", () => {
  const e = erkenneFelder(ANGEBOT);
  assert.equal(e.stichworte.netz, true);
  assert.equal(e.stichworte.statik, true, "„Statik bauseits“ ist eine Erwähnung – kein Nachweis");
  assert.equal(e.stichworte.ertrag, true);
  assert.equal(e.stichworte.parkregler, false);
  assert.equal(e.stichworte.brandschutz, false);
  assert.equal(e.stichworte.monitoring, false);
  assert.equal(e.stichworte.wartung, false);
  assert.equal(e.stichworte.eag, false);
});

test("Kennzahlen: €/kWp und €/kWh Jahresertrag", () => {
  const k = kennzahlen({ kwp: 100, preisNetto: 80000, ertragKwhProKwp: 1000 });
  assert.equal(k.eurProKwp, 800);
  assert.equal(k.jahresertragKwh, 100000);
  assert.equal(k.eurProKwhJahr, 0.8);
  const ohne = kennzahlen({ kwp: 100, preisNetto: 80000 });
  assert.equal(ohne.eurProKwp, 800);
  assert.equal(ohne.eurProKwhJahr, null);
  assert.equal(kennzahlen({ kwp: 0, preisNetto: 1 }), null);
  assert.equal(kennzahlen({ kwp: 10, preisNetto: 0 }), null);
});

test("Marktbezug: 1.551 €/kWp nur für 5-kWp-Kleinanlagen, ohne Abweichung, sonst nichts", () => {
  const klein = marktbezug(5);
  assert.equal(klein.id, "5kwp");
  assert.equal(klein.eurProKwp, 1551);
  assert.equal("abweichung" in klein, false, "keine Prozent-Abweichung (UWG)");
  assert.match(klein.quelle, /Marktstatistik 2024/);
  assert.equal(klein.stand, "2025");
  assert.match(klein.hinweis, /Richtwert/);
  assert.equal(marktbezug(4.5).id, "5kwp");
  assert.equal(marktbezug(5.5).id, "5kwp");
  for (const k of [3, 4, 6, 7, 10, 40, 100, 2]) assert.equal(marktbezug(k), null, `${k} kWp: kein Marktbezug`);
  assert.equal(MARKTSTATISTIK.klassen.length, 1, "nur die 5-kWp-Klasse laut Auftrag");
  assert.equal(MARKTSTATISTIK.klassen[0].eurProKwp, 1551);
});

test("Ertragsrahmen", () => {
  assert.equal(ertragPlausibel(950), true);
  assert.equal(ertragPlausibel(1400), false);
  assert.equal(ertragPlausibel(null), false);
});

test("EAG-Zuschuss gegen 30-%-Grenze", () => {
  assert.equal(EAG_ZUSCHUSS_MAX, 0.3);
  const ok = eagPruefung({ eagZuschuss: 20000, preisNetto: 100000 });
  assert.equal(ok.anteil, 0.2);
  assert.equal(ok.ueberGrenze, false);
  assert.equal(ok.maxBetrag, 30000);
  const zuviel = eagPruefung({ eagZuschuss: 35000, preisNetto: 100000 });
  assert.equal(zuviel.ueberGrenze, true);
  assert.equal(eagPruefung({ eagZuschuss: 0, preisNetto: 100000 }), null);
  assert.equal(eagPruefung({ eagZuschuss: null, preisNetto: 100000 }), null);
});

test("Checkliste: Nutzerantwort vor Feldern vor Stichworten; Status nur bei „ja“ erfüllt", () => {
  const liste = checkliste({ felder: { netzanschluss: "Netzebene 7", modul: "M", wechselrichter: "W" }, antworten: { netz: "nein", statik: "ja" }, stichworte: { brandschutz: true } });
  const by = Object.fromEntries(liste.map((p) => [p.id, p]));
  assert.equal(by.netz.antwort, "nein");
  assert.equal(by.netz.herkunft, "nutzer");
  assert.equal(by.netz.status, "nachfragen");
  assert.equal(by.statik.status, "erfuellt");
  assert.equal(by.komponenten.antwort, "ja");
  assert.equal(by.komponenten.herkunft, "felder");
  assert.equal(by.brandschutz.antwort, "unklar");
  assert.equal(by.brandschutz.herkunft, "text");
  assert.equal(by.brandschutz.imText, true);
  assert.equal(by.monitoring.herkunft, "leer");
  assert.equal(liste.length, PRUEFPUNKTE.length);
  assert.equal(checkliste({ speicher: true }).length, PRUEFPUNKTE.length + 1);
  assert.equal(checkliste({ antworten: { netz: "vielleicht" } }).find((p) => p.id === "netz").antwort, "unklar", "unbekannte Antwort wird ignoriert");
});

test("Checkliste: EAG über Grenze setzt den Punkt auf „nein“, Nutzerantwort bleibt", () => {
  const eag = eagPruefung({ eagZuschuss: 40000, preisNetto: 100000 });
  const p = checkliste({ eag }).find((x) => x.id === "eag");
  assert.equal(p.antwort, "nein");
  assert.match(p.zusatz, /über der 30-%-Grenze/);
  const p2 = checkliste({ eag, antworten: { eag: "ja" } }).find((x) => x.id === "eag");
  assert.equal(p2.antwort, "ja");
});

test("Gesamtprüfung: vollständiger Durchlauf mit erkannten Feldern", () => {
  const e = erkenneFelder(ANGEBOT);
  const r = pruefen({ felder: e.felder, stichworte: e.stichworte, ertragKwhProKwp: 950, ertragQuelle: "PVGIS Test", eagZuschuss: 30000 });
  assert.equal(r.ok, true);
  assert.equal(r.kennzahlen.eurProKwp, 850);
  assert.equal(r.kennzahlen.eurProKwhJahr, 0.89);
  assert.equal(r.marktbezug, null, "99,9 kWp ohne Marktbezug");
  assert.equal(r.eag.ueberGrenze, true);
  assert.equal(r.pruefpunkte.length, PRUEFPUNKTE.length + 1, "Speicherpunkt ergänzt");
  assert.equal(r.vollstaendigkeit.gesamt, r.pruefpunkte.length);
  assert.equal(r.vollstaendigkeit.erfuellt + r.vollstaendigkeit.offen, r.vollstaendigkeit.gesamt);
  assert.ok(r.nachfragen.some((p) => p.id === "parkregler"));
  assert.ok(r.nachfragen.some((p) => p.id === "eag"));
  assert.ok(!r.nachfragen.some((p) => p.id === "komponenten"), "Modul und WR benannt");
  assert.ok(r.hinweise.some((h) => /Speicher/.test(h)));
  assert.equal(r.ertragQuelle, "PVGIS Test");
  assert.equal(r.stand, "11.10.2026");
});

test("Gesamtprüfung: Pflichtfelder fehlen → ok=false mit Fehlerliste", () => {
  const r = pruefen({ felder: { kwp: 10 } });
  assert.equal(r.ok, false);
  assert.deepEqual(r.fehler, ["Angebotssumme netto fehlt."]);
  assert.equal(pruefen({}).fehler.length, 2);
});

test("Gesamtprüfung: unplausible Ertragsannahme erzeugt Hinweis", () => {
  const r = pruefen({ felder: { kwp: 10, preisNetto: 13000 }, ertragKwhProKwp: 1400 });
  assert.ok(r.hinweise.some((h) => /außerhalb/.test(h)));
  assert.equal(r.marktbezug, null, "10 kWp: kein Marktbezug");
});

test("Rein manuell ohne PDF funktioniert (keine Stichworte, keine Treffer)", () => {
  const r = pruefen({ felder: { kwp: 5, preisNetto: 8500 }, antworten: {}, ertragKwhProKwp: 1050 });
  assert.equal(r.ok, true);
  assert.equal(r.kennzahlen.eurProKwp, 1700);
  assert.equal(r.marktbezug.id, "5kwp");
  assert.equal(r.nachfragen.length, PRUEFPUNKTE.length, "alles offen, nichts ausgewiesen");
});

test("Zusammenfassung: nur Kennzahlen, keine Datei, keine Namen", () => {
  const r = pruefen({ felder: { kwp: 5, preisNetto: 8500 }, ertragKwhProKwp: 1050 });
  const z = zusammenfassungZeilen(r);
  assert.equal(z.length, 4);
  assert.match(z[0], /5,0 kWp/);
  assert.match(z[1], /1\.700 €\/kWp/);
  assert.match(z[2], /5-kWp-Kleinanlage 1\.551 €\/kWp/);
  assert.match(z[3], /Prüfpunkte zum Nachfragen/);
  assert.deepEqual(zusammenfassungZeilen({ ok: false }), []);
});

test("Texte: keine Wertung, keine Anbieternamen; jede Quelle mit Titel und Link", () => {
  const verboten = /zu teuer|Abzocke|unseriös|schlechtes Angebot|bestes Angebot|Testsieger|Marktführer|TOP 3|eigener Parkregler|eigenem Parkregler/i;
  const texte = [...PRUEFPUNKTE.flatMap((p) => [p.frage, p.warum, p.quelle]), MARKTSTATISTIK.hinweis, ...ANTWORTEN.map((a) => a.label), ...QUELLEN.map((q) => q.titel)];
  for (const t of texte) assert.doesNotMatch(t, verboten, t);
  for (const q of QUELLEN) {
    assert.ok(q.titel.length > 10);
    assert.match(q.href, /^https:\/\//);
  }
  for (const p of PRUEFPUNKTE) assert.ok(p.frage.endsWith("?"), `Frage ohne Fragezeichen: ${p.frage}`);
  assert.ok(PRUEFPUNKTE.some((p) => /ÖNORM B 1991-1-3/.test(p.frage)));
  assert.ok(PRUEFPUNKTE.some((p) => /OVE R 11-1/.test(p.frage)));
  assert.ok(PRUEFPUNKTE.some((p) => /30 %/.test(p.frage)));
});

test("Beispiel für die Vorschau rechnet durch und ist als Beispiel erkennbar", () => {
  const r = pruefen(BEISPIEL);
  assert.equal(r.ok, true);
  assert.match(BEISPIEL.felder.modul, /Beispiel/);
  assert.ok(r.nachfragen.length > 0 && r.nachfragen.length < r.pruefpunkte.length);
});

test("Quelltexte: scan/start prüft den Zweck, Prüfer lädt nichts hoch und nichts vom CDN, Ratgeber verlinkt", () => {
  const lies = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
  const route = lies("src/app/api/scan/start/route.js");
  assert.match(route, /zweckGueltig\(zweck\)/);
  assert.match(route, /fehler: "zweck"/);
  assert.match(route, /quelleFuerZweck\(zweck\)/);
  const pruefer = lies("src/components/AngebotPruefer/AngebotPruefer.js");
  assert.match(pruefer, /import\("pdfjs-dist"\)/);
  assert.match(pruefer, /new URL\("pdfjs-dist\/build\/pdf\.worker\.min\.mjs", import\.meta\.url\)/);
  assert.doesNotMatch(pruefer, /FormData|cdnjs|unpkg|jsdelivr/);
  // An den Server geht nur /api/standort (Koordinaten); das Gate sendet nur Kontakt + bestätigte Kennzahlen
  const fetches = [...pruefer.matchAll(/fetch\(([^,)]+)/g)].map((m) => m[1]);
  assert.ok(fetches.every((f) => /api\/standort|^u$/.test(f.trim())), `unerwarteter fetch: ${fetches}`);
  assert.match(pruefer, /zweck=zweitmeinung/);
  // Gate Stufe 2 über useLeadGate (A09): Freischaltung nur vom Server, nie aus dem Browserspeicher
  assert.match(pruefer, /useLeadGate\(\{ kennung: GATE_KENNUNG, modus: "auswertung"/);
  assert.doesNotMatch(pruefer, /ov-lead-bestaetigt|gateBestaetigt|GateAuswertung/, "keine lokale Freischaltung");
  assert.doesNotMatch(pruefer, /segment: "gewerbe"/, "Segment kommt aus src/data/leadRechner.js");
  assert.match(pruefer, /"h-11 min-w-\[44px\] rounded-full/, "Antwort-Pillen mindestens 44 px");
  assert.doesNotMatch(pruefer, /h-9 w-9|inline-flex h-10 /, "Tap-Ziele mindestens 44 px");
  assert.doesNotMatch(pruefer, /abweichung|liegt [+−±]/i, "kein Prozentvergleich zum Marktbezug");
  const ratgeber = lies("src/content/ratgeber/photovoltaik-angebot-vergleichen.js");
  assert.match(ratgeber, /\(\/angebot-pruefen\)/);
  assert.doesNotMatch(ratgeber, /eigene[nm]? (\[)?Parkregler/);
});

console.log(`\n${n} Tests bestanden – angebot-pruefung`);
