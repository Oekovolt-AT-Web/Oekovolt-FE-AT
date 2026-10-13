// Tests für die Verkaufs-Bausteine aus Welle A, Paket A03:
// src/data/fristen.js (aktiveFristen, Monats- und IFB-Rechnung mit 1-Mio.-Deckel, Stichtag),
// src/data/branchenZuordnung.js (nur abgeleitete Zuordnungen), src/data/einwaende.js (Schema =
// sichtbarer Text), src/data/preisbaender.js und src/data/marke.js (Freigabe-Filter),
// src/data/fachberater.js (keine Person ohne Einwilligung), src/data/zielgruppen.js (neue Varianten).
//
// Aufruf: node scripts/verkauf.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ROOT, srcUrl } from "./lib/alias.mjs";

const lies = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
void fileURLToPath;

const fristen = await import(srcUrl("data/fristen.js"));
const zuordnung = await import(srcUrl("data/branchenZuordnung.js"));
const einwaende = await import(srcUrl("data/einwaende.js"));
const preisbaender = await import(srcUrl("data/preisbaender.js"));
const fachberater = await import(srcUrl("data/fachberater.js"));
const zielgruppen = await import(srcUrl("data/zielgruppen.js"));
const { KUNDEN } = await import(srcUrl("data/kunden.js"));
const hero = await import(srcUrl("data/hero.js"));

const VOR = Date.parse("2026-10-11T12:00:00+02:00");
const NACH = Date.parse("2027-01-01T00:00:00+01:00");

describe("fristen.js – aktiveFristen und Stichtag 31.12.2026", () => {
  test("alle Fristen haben id, titel, quelle (https) und stand", () => {
    assert.ok(fristen.FRISTEN.length >= 3);
    for (const f of fristen.FRISTEN) {
      assert.match(f.id, /^[a-z-]+$/);
      assert.ok(f.titel);
      assert.match(f.quelle, /^https:\/\//, f.id);
      assert.match(f.stand, /^\d{4}-\d{2}-\d{2}$/, f.id);
    }
    const ifb = fristen.FRISTEN.find((f) => f.id === "ifb");
    assert.equal(ifb.ende, "2026-12-31");
    assert.equal(ifb.danach, "15 %");
    assert.equal(ifb.quelle, "https://www.wko.at/steuern/investitionsfreibetrag");
  });
  test("vor dem Stichtag ist der IFB aktiv, am 01.01.2027 nicht mehr", () => {
    assert.ok(fristen.aktiveFristen(VOR).some((f) => f.id === "ifb"));
    assert.equal(fristen.istIfbAktiv(VOR), true);
    assert.equal(fristen.istIfbAktiv("2026-12-31T20:00:00+01:00"), true);
    assert.equal(fristen.istIfbAktiv(NACH), false);
    assert.ok(!fristen.aktiveFristen(NACH).some((f) => f.id === "ifb"), "IFB fällt nach dem 31.12.2026 heraus");
    assert.equal(fristen.frist("ifb", NACH), null);
    assert.ok(fristen.frist("ifb", VOR));
  });
  test("Fristen mit „ab“ bleiben aktiv und werden ab dem Datum wirksam", () => {
    const lp = fristen.FRISTEN.find((f) => f.id === "leistungspreis");
    assert.equal(lp.ab, "2027-01-01");
    assert.ok(fristen.aktiveFristen(NACH).some((f) => f.id === "leistungspreis"));
    assert.equal(fristen.fristWirksam(lp, VOR), false);
    assert.equal(fristen.fristWirksam(lp, NACH), true);
    assert.ok(fristen.FRISTEN.find((f) => f.id === "spitzenkappung")?.ab === "2027-01-01");
  });
  test("datumText ohne Intl", () => {
    assert.equal(fristen.datumText("2026-12-31"), "31.12.2026");
    assert.equal(fristen.datumText(""), "");
  });
});

describe("fristen.js – Monats- und IFB-Rechnung", () => {
  test("monatsErsparnis: Jahreswert / 12, auf 10 € gerundet, 0 bei Unsinn", () => {
    assert.equal(fristen.monatsErsparnis(34360), 2860);
    assert.equal(fristen.monatsErsparnis(12000), 1000);
    assert.equal(fristen.monatsErsparnis(0), 0);
    assert.equal(fristen.monatsErsparnis(-5), 0);
    assert.equal(fristen.monatsErsparnis("abc"), 0);
  });
  test("ifbSteuerwirkung: 7 Prozentpunkte × KöSt 23 % bei Kapitalgesellschaften", () => {
    const w = fristen.ifbSteuerwirkung(500_000);
    assert.equal(w.basis, 500_000);
    assert.equal(w.satz, 23);
    assert.equal(w.wirkung, Math.round((500_000 * 0.07 * 0.23) / 100) * 100); // 8.050 → 8.100
    assert.equal(w.gedeckelt, false);
  });
  test("Deckel 1 Mio. €: 2,5 Mio. Investition rechnet wie 1 Mio.", () => {
    const gross = fristen.ifbSteuerwirkung(2_500_000);
    const mio = fristen.ifbSteuerwirkung(1_000_000);
    assert.equal(gross.basis, 1_000_000);
    assert.equal(gross.wirkung, mio.wirkung);
    assert.equal(gross.wirkung, 16_100);
    assert.equal(gross.gedeckelt, true);
    assert.equal(mio.gedeckelt, false);
  });
  test("Einzelunternehmen / Personengesellschaft rechnen mit dem Grenzsteuersatz", () => {
    const e = fristen.ifbSteuerwirkung(300_000, { rechtsform: "einzelunternehmen", grenzsteuersatz: 50 });
    assert.equal(e.satz, 50);
    assert.equal(e.wirkung, 10_500);
    const p = fristen.ifbSteuerwirkung(300_000, { rechtsform: "personengesellschaft" });
    assert.equal(p.satz, fristen.IFB.grenzsteuersatzStandard);
    assert.ok(fristen.IFB.grenzsteuersaetze.includes(p.satz));
    assert.ok(fristen.RECHTSFORMEN.filter((r) => r.id !== "kapitalgesellschaft").every((r) => r.steuer === "abhängig vom Grenzsteuersatz"));
  });
  test("ungültige Investition → 0", () => {
    assert.equal(fristen.ifbSteuerwirkung(0).wirkung, 0);
    assert.equal(fristen.ifbSteuerwirkung(null).wirkung, 0);
    assert.equal(fristen.ifbSteuerwirkung("x").wirkung, 0);
  });
});

describe("branchenZuordnung.js – nur abgeleitete Zuordnungen", () => {
  const Z = zuordnung.BRANCHEN_ZUORDNUNG;
  test("jeder Slug stammt aus kunden.js oder REFERENZ_KUNDEN, jede Zielgruppe ist bekannt", () => {
    const heroSlugs = new Set(hero.REFERENZ_KUNDEN.map((r) => r.slug));
    for (const [slug, zg] of Object.entries(Z)) {
      assert.ok(KUNDEN[slug] || heroSlugs.has(slug), `unbekannter Slug ${slug}`);
      assert.ok(zuordnung.ZIELGRUPPEN_IDS.includes(zg), `${slug}: ${zg}`);
    }
  });
  test("belegte Beispiele aus dem Auftrag", () => {
    const erwartet = {
      "steinbacher-daemmstoff-gmbh": "industrie",
      "penn-gmbh": "industrie",
      "felbermayer-fenster-tueren-erzeugungs-gmbh": "industrie",
      "alpla-werke-alwin-lehner-gmbh-co-kg": "industrie",
      "br-industrial-automation-gmbh": "industrie",
      "transdanubia-speditionsgesellschaft-mbh-pasching": "handel-logistik",
      "baumaerkte-a-sochor-co-gmbh": "handel-logistik",
      "wuerth-handelsgesmbh": "handel-logistik",
      "gebrueder-woerle-gesmbh": "lebensmittel-agrar",
      "fs-agrar-gmbh": "lebensmittel-agrar",
      "sporthotel-brixen-gmbh-co-kg": "tourismus",
      "campingwelt-brixen-im-thale": "tourismus",
      "destalles-autohandels-und-reparatur-gmbh": "autohaus",
      "ah-weichselbaumer-gmbh": "autohaus",
      "ac-auto-vertrieb-und-service-gmbh": "autohaus",
      "4you-store-gmbh": "autohaus",
    };
    for (const [slug, zg] of Object.entries(erwartet)) assert.equal(zuordnung.zielgruppeVon(slug), zg, slug);
    assert.equal(zuordnung.slugsFuerZielgruppe("autohaus").length, 4);
  });
  test("unklare Fälle und leere Zielgruppen", () => {
    assert.equal(zuordnung.zielgruppeVon("fuschl-am-see-betriebs-gmbh"), null, "Fuschl am See bleibt offen");
    assert.deepEqual(zuordnung.slugsFuerZielgruppe("gemeinde"), [], "gemeinde bleibt leer, bis ein Gemeindeprojekt belegt ist");
    assert.deepEqual(zuordnung.slugsFuerZielgruppe("freiflaeche"), []);
    assert.equal(zuordnung.zielgruppeVon("gibt-es-nicht"), null);
    assert.equal(zuordnung.zielgruppeAusBranche(""), null);
  });
  test("Zuordnung aus kunden.js stimmt mit den Regeln überein (nichts von Hand)", () => {
    for (const [slug, k] of Object.entries(KUNDEN)) {
      const erwartet = zuordnung.UNKLAR.includes(slug) ? null : zuordnung.zielgruppeAusBranche(k.branche);
      assert.equal(Z[slug] || null, erwartet, slug);
    }
  });
  test("Namen ohne Freigabe standardmäßig aus", () => {
    assert.equal(zuordnung.NAMEN_OHNE_FREIGABE, false);
  });
});

describe("einwaende.js – Gruppen, ids, Schema = sichtbarer Text", () => {
  const ids = ["zu-teuer", "netz-voll", "dach-alt", "foerderung-unsicher", "amortisation", "strompreise", "technik-warten", "keine-zeit", "contracting", "servicepartner", "entfernung", "drei-angebote"];
  test("alle zwölf Einwände mit Antwort, Beleg, Schritt und Gruppen", () => {
    assert.deepEqual(einwaende.EINWAENDE.map((e) => e.id), ids);
    for (const e of einwaende.EINWAENDE) {
      assert.ok(e.einwand && e.antwort && e.beleg && e.schritt?.label && e.schritt?.href, e.id);
      assert.ok(e.gruppen.length && e.gruppen.every((g) => einwaende.EINWAND_GRUPPEN.includes(g)), e.id);
      assert.match(e.schritt.href, /^(\/|https:\/\/)/, e.id);
    }
  });
  test("interne Links zeigen auf vorhandene Seiten", () => {
    const hrefs = einwaende.EINWAENDE.flatMap((e) => [e.schritt.href, e.belegHref]).filter((h) => h && h.startsWith("/"));
    for (const h of new Set(hrefs)) {
      const pfad = h.split("#")[0].replace(/^\//, "");
      const seite = path.join(ROOT, "src/app", pfad, "page.js");
      const ratgeber = pfad.startsWith("ratgeber/") ? path.join(ROOT, "src/content/ratgeber", `${pfad.slice("ratgeber/".length)}.js`) : null;
      assert.ok(fs.existsSync(seite) || (ratgeber && fs.existsSync(ratgeber)), `Seite fehlt: ${h}`);
    }
  });
  test("einwaendeFuer filtert nach Gruppe und ids (in ids-Reihenfolge)", () => {
    assert.equal(einwaende.einwaendeFuer("gewerbe").length, 12);
    assert.ok(einwaende.einwaendeFuer("kommunen").every((e) => e.gruppen.includes("kommunen")));
    assert.ok(!einwaende.einwaendeFuer("kommunen").some((e) => e.id === "amortisation"));
    assert.deepEqual(einwaende.einwaendeFuer("gewerbe", ["netz-voll", "zu-teuer", "strompreise"]).map((e) => e.id), ["netz-voll", "zu-teuer", "strompreise"]);
    assert.deepEqual(einwaende.einwaendeFuer("freiflaeche", ["dach-alt", "unbekannt"]), [], "ids außerhalb der Gruppe fallen weg");
  });
  test("FAQPage-Schema nur für die übergebenen Karten, Text identisch", () => {
    const liste = einwaende.einwaendeFuer("gewerbe", ["zu-teuer", "netz-voll"]);
    const s = einwaende.einwaendeSchema(liste);
    assert.equal(s["@type"], "FAQPage");
    assert.equal(s.mainEntity.length, 2);
    assert.equal(s.mainEntity[0].name, "Zu teuer.");
    assert.equal(s.mainEntity[0].acceptedAnswer.text, einwaende.einwandAntwortText(liste[0]));
    assert.ok(s.mainEntity[0].acceptedAnswer.text.includes("Beleg:") && s.mainEntity[0].acceptedAnswer.text.includes("Nächster Schritt: Finanzierung vergleichen."));
    assert.equal(einwaende.einwaendeSchema([]), null);
  });
  test("keine Herabsetzung, keine Anbieternamen, keine verbotenen Werbewörter", () => {
    const text = einwaende.EINWAENDE.map((e) => `${e.einwand} ${e.antwort} ${e.beleg}`).join(" ");
    assert.doesNotMatch(text, /Marktführer|Testsieger|klimaneutral|CO₂-neutral|umweltfreundlich|\bgarantiert\b|TOP 3|führende/i);
    assert.doesNotMatch(text, /eigener Parkregler|eigenen Parkregler/i);
    assert.ok(text.includes("Technologiepartner Solensa"));
  });
  test("Titel je Gruppe; Gemeinden ohne IFB/AfA-Argument (Karte und Schema gleich)", () => {
    for (const g of einwaende.EINWAND_GRUPPEN) assert.ok(einwaende.EINWAND_TITEL[g], g);
    assert.doesNotMatch(einwaende.EINWAND_TITEL.kommunen, /Betriebe/);
    const k = einwaende.einwaendeFuer("kommunen", ["contracting"])[0];
    assert.ok(k, "contracting für Gemeinden vorhanden");
    assert.doesNotMatch(k.antwort, /Investitionsfreibetrag|IFB|Abschreibung|AfA/);
    assert.match(einwaende.einwaendeSchema([k]).mainEntity[0].acceptedAnswer.text, /Gemeinderatsbeschluss/);
    const g = einwaende.einwaendeFuer("gewerbe", ["contracting"])[0];
    assert.match(g.antwort, /Öko-Investitionsfreibetrag/);
    assert.ok(!("antwortJe" in einwaende.EINWAENDE[0]) || einwaende.EINWAENDE[0].antwortJe);
  });
  test("EinwandKarten: titel={false} lässt den Kopf weg, rahmen setzt eigenen Container", () => {
    const quelle = lies("src/components/Verkauf/EinwandKarten.js");
    assert.match(quelle, /const kopf = titel !== false/);
    assert.match(quelle, /if \(!rahmen\) return inhalt/);
  });
  test("EinwandKarten: Seite mit eigener FAQ setzt mitSchema=false (Komponente rendert dann kein Schema)", () => {
    const quelle = lies("src/components/Verkauf/EinwandKarten.js");
    assert.match(quelle, /mitSchema = true/);
    assert.match(quelle, /mitSchema \? einwaendeSchema\(liste\) : null/);
  });
});

describe("Freigabe-Filter – Zusagen, Preisbänder, Logos", () => {
  test("Preisbänder: Startbestand leer und nicht freigegeben → nichts", () => {
    assert.ok(preisbaender.PREISBAENDER.length >= 1);
    assert.equal(preisbaender.PREISBAENDER[0].klasse, "100–250 kWp");
    assert.ok(preisbaender.PREISBAENDER.every((b) => b.freigegeben === false && b.vonEurKwp == null && b.bisEurKwp == null));
    assert.deepEqual(preisbaender.freigegebenePreisbaender(), []);
  });
  test("Preisbänder: nur freigegeben === true (strikt) UND vollständige Werte", () => {
    const liste = [
      { klasse: "a", vonEurKwp: 900, bisEurKwp: 1100, freigegeben: true },
      { klasse: "b", vonEurKwp: 900, bisEurKwp: 1100, freigegeben: "true" },
      { klasse: "c", vonEurKwp: 900, bisEurKwp: 1100, freigegeben: 1 },
      { klasse: "d", vonEurKwp: null, bisEurKwp: 1100, freigegeben: true },
      { klasse: "e", vonEurKwp: 1200, bisEurKwp: 1100, freigegeben: true },
    ];
    assert.deepEqual(preisbaender.freigegebenePreisbaender(liste).map((b) => b.klasse), ["a"]);
    assert.equal(preisbaender.nurFreigegeben([{ freigegeben: true }, { freigegeben: "ja" }, null]).length, 1);
    assert.deepEqual(preisbaender.nurFreigegeben(null), []);
  });
  test("Preis je kWh über 25 Jahre: 1.050 €/kWp → 4 ct", () => {
    assert.equal(preisbaender.preisJeKwhCt(1050), 4);
    assert.equal(preisbaender.preisJeKwhCt(1000), 3.8);
    assert.equal(preisbaender.preisJeKwhCt(0), null);
  });
  test("Zusagen aus marke.js: im Startbestand nichts freigegeben", async () => {
    const marke = await import(srcUrl("data/marke.js"));
    assert.ok(Array.isArray(marke.ZUSAGEN) && marke.ZUSAGEN.length >= 6);
    const frei = preisbaender.nurFreigegeben(marke.ZUSAGEN).filter((z) => z.freigegeben_am && z.freigegeben_von);
    assert.deepEqual(frei, []);
    const quelle = lies("src/components/Verkauf/UnsereZusagen.js");
    assert.match(quelle, /nurFreigegeben\(liste\)\.filter\(\(z\) => z\.freigegeben_am && z\.freigegeben_von/);
    assert.match(quelle, /if \(!liste\.length\) return null/);
  });
  test("Logos und Zitate: in kunden.js nichts freigegeben; Komponente prüft === true", () => {
    for (const [slug, k] of Object.entries(KUNDEN)) {
      assert.notEqual(k.freigabe?.logo, true, slug);
      assert.notEqual(k.freigabe?.zitat, true, slug);
      assert.notEqual(k.freigabe?.name, true, slug);
    }
    const quelle = lies("src/components/Referenzen/BranchenReferenzen.js");
    assert.match(quelle, /freigabe\?\.logo === true/);
    assert.match(quelle, /freigabe\?\.zitat === true/);
    assert.match(quelle, /fotosFrei === true && !!projekt\.bild/);
    assert.match(quelle, /fotosFrei=\{kunde\?\.freigabe\?\.fotos === true\}/);
    assert.match(quelle, /if \(!treffer\.length\) return null/);
    assert.match(quelle, /NAMEN_OHNE_FREIGABE \|\| nameFrei\(kunde\)/);
  });
});

describe("Referenzen ohne Namensfreigabe – nicht wiedererkennbar", () => {
  test("Ort → Bundesland", () => {
    assert.equal(zuordnung.regionOhneFreigabe("Hard, Vorarlberg"), "Vorarlberg");
    assert.equal(zuordnung.regionOhneFreigabe("Erpfendorf, Tirol"), "Tirol");
    assert.equal(zuordnung.regionOhneFreigabe("Pasching, Oberösterreich (Standort); Firmensitz Guntramsdorf"), "Oberösterreich");
    assert.equal(zuordnung.regionOhneFreigabe("Wien"), "Wien");
    assert.equal(zuordnung.regionOhneFreigabe("Bad Wörishofen"), "Österreich");
    assert.equal(zuordnung.regionOhneFreigabe(""), "");
  });
  test("Leistung gerundet, nie exakt", () => {
    const nb = " ";
    assert.equal(zuordnung.leistungOhneFreigabe(1986.79), `rund 2${nb}MWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(3172.98), `rund 3${nb}MWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(1643.07), `rund 1,5${nb}MWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(984.64), `rund 1${nb}MWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(728), `rund 750${nb}kWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(82.5), `rund 80${nb}kWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(35.2), `rund 40${nb}kWp`);
    assert.equal(zuordnung.leistungOhneFreigabe(null), "");
    assert.equal(zuordnung.leistungOhneFreigabe(0), "");
  });
  test("BranchenReferenzen: neutrale Karte nutzt Vergröberung, größte Anlage erst ab Mindestanzahl, Leistung in MWp", () => {
    const quelle = lies("src/components/Referenzen/BranchenReferenzen.js");
    assert.match(quelle, /regionOhneFreigabe\(projekt\.ort \|\| kundeOrt/);
    assert.match(quelle, /leistungOhneFreigabe\(projekt\.kwp\)/);
    assert.doesNotMatch(quelle, /projekt\.leistungText/);
    assert.match(quelle, /treffer\.length >= MIN_FUER_GROESSTE/);
    assert.match(quelle, /MWp/);
  });
});

describe("KostenDesWartens – Beispielwerte nicht als persönliche Rechnung", () => {
  test("quelle=beispiel ersetzt „aus Ihren Eingaben“ und „bei Ihrer Investition“; € mit geschütztem Leerzeichen; Select ≥ 44 px", () => {
    const quelle = lies("src/components/Verkauf/KostenDesWartens.js");
    assert.match(quelle, /quelle = "eingaben"/);
    assert.match(quelle, /ausBeispiel \? ` – \$\{beispielText\}, Richtwert\.`/);
    assert.match(quelle, /ausBeispiel \? beispielText : "bei Ihrer Investition"/);
    assert.ok(quelle.includes("\\u00a0€"), "geschütztes Leerzeichen vor €");
    assert.doesNotMatch(quelle, /className="h-10 /);
    // Seit der Unikat-Seite (13.10.2026) bindet /gewerbe den Baustein nicht mehr ein (Rechenweg in Kapitel 07).
    // Kommt er zurück, dann nur mit den Beispielwerten gekennzeichnet.
    const gewerbe = lies("src/app/gewerbe/page.js");
    if (/<KostenDesWartens/.test(gewerbe)) assert.match(gewerbe, /<KostenDesWartens[^>]*quelle="beispiel"/);
  });
});

describe("fachberater.js – keine Person ohne Einwilligung", () => {
  test("Startbestand unsichtbar, Teamfunktion greift", () => {
    assert.ok(fachberater.FACHBERATER.length >= 1);
    assert.ok(fachberater.FACHBERATER.every((p) => p.einwilligung === false));
    assert.equal(fachberater.fachberaterFuer("gewerbe"), null);
    assert.equal(fachberater.fachberaterFuer("gewerbe", "ooe"), null);
    assert.equal(fachberater.teamfunktion("gewerbe"), "Ihr Projektteam Gewerbe & Industrie");
    assert.equal(fachberater.teamfunktion("unbekannt"), "Ihr Projektteam");
    assert.match(fachberater.ZENTRALE.telefon, /^\+43/);
  });
  test("istSichtbar verlangt Einwilligung, Name und Rolle", () => {
    assert.equal(fachberater.istSichtbar({ einwilligung: true, name: "X", rolle: "" }), false);
    assert.equal(fachberater.istSichtbar({ einwilligung: "true", name: "X", rolle: "R" }), false);
    assert.equal(fachberater.istSichtbar({ einwilligung: true, name: "X", rolle: "R" }), true);
  });
  test("Termin-Themen sind Kurzformen aus erreichbarkeit.js", async () => {
    const { themaAusParam } = await import(srcUrl("data/erreichbarkeit.js"));
    for (const [zg, thema] of Object.entries(fachberater.TERMIN_THEMA)) assert.ok(themaAusParam(thema), `${zg} → ${thema}`);
  });
});

describe("zielgruppen.js – Texte A03", () => {
  const Z = zielgruppen.ZIELGRUPPEN;
  test("gemeinden ohne Salzburg AG, mit Beschlussvorlage", () => {
    assert.equal(Z.gemeinden.standard.titel, "Gemeinderatstauglich –");
    assert.equal(Z.gemeinden.standard.cta, "Beschlussvorlage anfordern");
    assert.doesNotMatch(JSON.stringify(Z), /Salzburg AG|bevorzugter PV-Errichter/);
  });
  test("landwirtschaft und tourismus", () => {
    assert.equal(Z.landwirtschaft.standard.titel, "Vom Hofbesuch bis zum Netzanschluss –");
    assert.ok(Z.landwirtschaft.standard.lead.includes("Wir sagen Ihnen auch, wenn sich Ihr Dach nicht lohnt"));
    assert.equal(Z.landwirtschaft.standard.kurz, "Melken, Kühlen, Trocknen mit Strom vom eigenen Dach.");
    assert.equal(Z.agripv.standard.kurz, "30 % Förderzuschlag – wenn die Landwirtschaft im Vordergrund bleibt.");
    assert.equal(Z.tourismus.standard.titel, "Strom vom eigenen Dach in der Hauptsaison –");
  });
  test("neue Varianten cfo, leistungspreis, handel über utm-Parameter", () => {
    assert.equal(zielgruppen.zielgruppenVariante("gewerbe", { utm_term: "cfo" }).id, "cfo");
    assert.equal(zielgruppen.zielgruppenVariante("gewerbe", { utm_campaign: "ifb-2026" }).id, "cfo");
    const lp = zielgruppen.zielgruppenVariante("gewerbe", { utm_term: "leistungspreis" });
    assert.equal(lp.id, "leistungspreis");
    assert.ok(lp.lead.startsWith("Sie zahlen für Energie, Netz, Leistung und Abgaben."));
    assert.equal(zielgruppen.zielgruppenVariante("gewerbe", { utm_content: "handel" }).id, "handel");
    assert.equal(zielgruppen.zielgruppenVariante("gewerbe", { utm_term: "speicher" }).id, "speicher");
    assert.equal(zielgruppen.zielgruppenVariante("gewerbe", {}).id, "standard");
  });
});
