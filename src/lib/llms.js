// src/lib/llms.js
//
// llms.txt (https://llmstxt.org) für KI-Suchmaschinen und Antwortmaschinen.
// Wird aus denselben Quellen erzeugt wie Navigation, Ratgeber, Regionen, Förder- und Netzdaten,
// Projekte und Herstellerliste – neue Einträge erscheinen automatisch.
// Die ausführliche Fassung mit Kernaussagen aller Fachartikel: /llms-full.txt
//
// Regel: In llms.txt steht nur, was indexierbar ist (gleiche Logik wie die Sitemap, siehe indexierbar()).
// Deshalb fehlen z. B. /mediathek (noindex, solange keine Videos da sind), /bildnachweis und
// Druckfassungen. Die Sitemap (src/app/sitemap.js) nutzt dieselben Helfer.

import fs from "node:fs";
import path from "node:path";

import { NAVIGATION } from "@/data/navigation";
import { alleArtikel, artikelPfad, KATEGORIEN } from "@/lib/ratgeber";
import { REGIONEN } from "@/data/regionen";
import { BASE_URL, FIRMA, SCHWESTER } from "@/lib/site";
// Eigenes Hinweisgebersystem nur verlinken, wenn aktiv (HINWEIS_INTERN=1) – sonst leitet
// /hinweisgebersystem auf IntegrityLine um. Siehe src/data/hinweisgeber.js.
import { HINWEIS_INTERN } from "@/data/hinweisgeber";
import { KENNZAHLEN_SATZ, KENNZAHLEN_STAND, zahlText } from "@/data/kennzahlen";
import { PARTNER } from "@/components/Hersteller/partner";
import { LAENDER_SLUGS, STAND as FOERDER_STAND } from "@/data/bundeslaender";
import { NETZBETREIBER, STAND as NETZ_STAND, betreiberPfad } from "@/data/netzbetreiber";
import { STAND as OEMAG_STAND } from "@/data/oemag";
import { PROJEKTE_STAND } from "@/data/projekte";
import { LEXIKON_STAND } from "@/data/lexikon";
import { reelPfad, reelsSortiert } from "@/data/reels";
import { STELLEN } from "@/data/stellen";
import { FOERDERCALL } from "@/lib/foerdercall";
import { VERGABE_STAND } from "@/lib/kommunen/vergabe";
import { LAENDER as WIDMUNG_LAENDER, STAND as WIDMUNG_STAND, widmungsPfad } from "@/lib/flaeche/laender";
import { LAENDER as SCHNEELAST_LAENDER, schneelastPfad } from "@/lib/schneelast/laender";
import { LAENDER as PV_LAENDER, landPfad } from "@/lib/bundesland/auswertung";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";

const link = (name, pfad, text) => `- [${name}](${BASE_URL}${pfad})${text ? `: ${text}` : ""}`;

/* ------------------------------------------------------------------ Indexierbarkeit */

// Seiten mit robots noindex bzw. Weiterleitung – stehen weder in der Sitemap noch in llms.txt.
// Bei neuen noindex-Seiten hier ergänzen.
export const NICHT_INDEXIERT = new Set([
  "/bildnachweis", // noindex
  "/netzanmeldung/checkliste", // Druckfassung, noindex
  "/solarrechner/ergebnis", // Ergebnisansicht, noindex
  "/tv", // Info-Bildschirme, noindex
  "/photovoltaik-bundesland", // 308 → /photovoltaik (nur die Landesseiten sind eigene Seiten)
  "/ratgeber/reststromvermarktung", // 301 → /service/direktvermarktung (Entscheidung E7)
]);

/** Mediathek: indexierbar erst mit mindestens einem Video (sonst noindex, siehe src/app/mediathek/page.js). */
export const mediathekBefuellt = () => reelsSortiert().length > 0;

/** true, wenn der Pfad (ohne Host) indexierbar ist und in Sitemap und llms.txt gehört. */
export function indexierbar(pfad) {
  const p = String(pfad || "/").replace(/[?#].*$/, "").replace(/(.)\/$/, "$1");
  if (NICHT_INDEXIERT.has(p)) return false;
  // /schneelast/<land> leitet dauerhaft (308) auf /schneelast#<land> weiter (M26, src/app/schneelast/[bundesland]/page.js)
  if (SCHNEELAST_LAENDER.some((l) => p === schneelastPfad(l.slug))) return false;
  if ((p === "/mediathek" || p.startsWith("/mediathek/")) && !mediathekBefuellt()) return false;
  if (p.startsWith("/hinweisgebersystem") && !HINWEIS_INTERN) return false;
  if (p === "/hinweisgebersystem/postfach") return false;
  // Wechselrichter-Seiten (Paket P4) erst, wenn die Routen existieren – auch wenn die Navigation sie schon nennt
  if (p === "/produkte/wechselrichter" || p.startsWith("/produkte/wechselrichter/")) {
    const r = wechselrichterRouten();
    return p === "/produkte/wechselrichter" ? r.uebersicht : r.detail;
  }
  return true;
}

/* ------------------------------------------------------------------ Hersteller (partner.js) */

// Vor Maßnahme M17 hatte partner.js kein Feld `belegt` – dort standen ausschließlich Marken mit belegter
// Zusammenarbeit (Entscheidung E3: Fronius, Huawei, BYD, Sigenergy, Solis, meteocontrol). Sobald das Feld
// existiert, zählen nur Einträge mit `belegt`.
const HAT_BELEGT_FELD = PARTNER.some((p) => Object.prototype.hasOwnProperty.call(p, "belegt"));

/** Hersteller mit belegtem Verbau bei Ökovolt (einzige Quelle: src/components/Hersteller/partner.js). */
export const belegtePartner = () => PARTNER.filter((p) => (HAT_BELEGT_FELD ? Boolean(p.belegt) : true));

// Wechselrichter-Detailseiten: maßgeblich ist der Produktbereich „wechselrichter“ in `kontexte` (wie bei
// „stromspeicher“); solange ihn noch keine Marke trägt, gilt ersatzweise die Kategorie.
const WR_KONTEXT = PARTNER.some((p) => p.kontexte?.includes("wechselrichter"));
const istWechselrichter = (p) => (WR_KONTEXT ? p.kontexte.includes("wechselrichter") : p.kategorie === "Wechselrichter");

/**
 * Gibt es die Wechselrichter-Seiten (Paket P4, src/app/produkte/wechselrichter/**) schon?
 * Geprüft wird der Quellbaum – ohne Quellbaum (reines Build-Artefakt) zählt der Navigationseintrag.
 */
export function wechselrichterRouten() {
  const app = path.join(process.cwd(), "src", "app");
  try {
    if (!fs.existsSync(app)) {
      const inNavigation = NAVIGATION.some((n) => n.groups.some((g) => g.items.some((i) => i.href === "/produkte/wechselrichter")));
      return { uebersicht: inNavigation, detail: inNavigation };
    }
    const basis = path.join(app, "produkte", "wechselrichter");
    if (!fs.existsSync(basis)) return { uebersicht: false, detail: false };
    const detail = fs
      .readdirSync(basis, { withFileTypes: true })
      .some((d) => d.isDirectory() && /^\[[^.\]][^\]]*\]$/.test(d.name) && fs.existsSync(path.join(basis, d.name, "page.js")));
    return { uebersicht: fs.existsSync(path.join(basis, "page.js")), detail };
  } catch {
    return { uebersicht: false, detail: false };
  }
}

/** Pfade der Wechselrichter-Seiten (nur belegte Marken, nur wenn die Routen existieren). */
export function wechselrichterSeiten() {
  const r = wechselrichterRouten();
  const seiten = [];
  if (r.uebersicht) seiten.push({ pfad: "/produkte/wechselrichter", partner: null });
  if (r.detail) belegtePartner().filter(istWechselrichter).forEach((p) => seiten.push({ pfad: `/produkte/wechselrichter/${p.slug}`, partner: p }));
  return seiten;
}

/** Statische Speicher-Detailseiten der belegten Marken (/produkte/stromspeicher/[slug]). */
export const speicherSeiten = () => belegtePartner().filter((p) => p.kontexte?.includes("stromspeicher")).map((p) => ({ pfad: `/produkte/stromspeicher/${p.slug}`, partner: p }));

/* ------------------------------------------------------------------ Stand */

const iso = (d) => {
  if (!d) return null;
  const s = String(d).trim();
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const t = de ? Date.UTC(+de[3], +de[2] - 1, +de[1]) : Date.parse(s);
  return Number.isFinite(t) ? new Date(t) : null;
};

/** Jüngstes Datum der Inhaltsquellen – „Stand“ im Kopf von llms.txt (nie in der Zukunft). */
export function llmsStand() {
  const kandidaten = [
    ...alleArtikel().map((a) => a.aktualisiert || a.veroeffentlicht),
    ...Object.values(REGIONEN || {}).map((r) => r?.fakten?.stand),
    KENNZAHLEN_STAND,
    FOERDER_STAND.iso,
    NETZ_STAND.iso,
    OEMAG_STAND.geprueftAm,
    PROJEKTE_STAND,
    LEXIKON_STAND,
    FOERDERCALL.stand?.iso,
    VERGABE_STAND.iso,
    WIDMUNG_STAND.iso,
  ]
    .map(iso)
    .filter((d) => d && d.getTime() <= Date.now());
  const max = kandidaten.reduce((a, b) => (b > a ? b : a), kandidaten[0] || new Date());
  return max.toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
}

/* ------------------------------------------------------------------ Blöcke */

export function kopf() {
  const gesellschafter = FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(", ");
  return `# Ökovolt Österreich – ${FIRMA.name}

> Photovoltaik für Gewerbe, Industrie, Landwirtschaft, Tourismus und die öffentliche Hand in ganz Österreich. Dach- und Freiflächenanlagen, Agri-PV, Gewerbespeicher, Ladeinfrastruktur und Energiegemeinschaften – mit eigenem Parkregler (EZA-Regler), eigener Fernwartung und eigenem SCADA-System. Planung, Bau, Netzanschluss, Betrieb und Wartung aus einer Hand, seit 2012.

Stand: ${llmsStand()} · Sprache: Deutsch (Österreich) · Geltungsbereich: Österreich (Recht, Förderung, Netz, Tarife)

## Fakten zum Unternehmen

- Firma: ${FIRMA.name} (Rechtsform GmbH)
- Sitz: ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.bundesland}, ${FIRMA.land}
- Firmenbuch: ${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht} · EUID ${FIRMA.euid} · UID ${FIRMA.uid} · GISA ${FIRMA.gisa}
- Gewerbe: ${FIRMA.gewerbe}, Mitglied der ${FIRMA.kammer}
- Gegründet: 16.02.2012 · Geschäftsführer: ${FIRMA.geschaeftsfuehrer}
- Gesellschafter: ${gesellschafter}
- Kontakt: ${FIRMA.telefon} · ${FIRMA.email}
- Einzugsgebiet: ganz Österreich (alle neun Bundesländer)
- Unternehmensgruppe: Stammhaus der ÖKOVOLT-Gruppe ist die deutsche Schwestergesellschaft ${SCHWESTER.name}, ${SCHWESTER.ort} (seit 2010, ${SCHWESTER.register}). Sie ist Inhaberin der Marke ÖKOVOLT und der Rechte an dieser Website; die österreichische GmbH ist rechtlich selbstständig.
- Kennzahlen (laut Ökovolt Österreich): ${KENNZAHLEN_SATZ}.
- Einordnung: 2021 errichtete die österreichische Gesellschaft PV-Anlagen mit 30 MWp und zählte zu den drei größten EPC-Errichtern (Integrierter Photovoltaik-Contractor) Österreichs; seit 2021 ist die Salzburg AG mit 49 % beteiligt. Die Gründer betreiben seit 2012 eigene Solarparks.
- Zitierhinweis: Unternehmensangaben bitte als „laut Ökovolt“ kennzeichnen; Registerdaten sind im österreichischen Firmenbuch und bei WKO Firmen A–Z überprüfbar.

`;
}

// Pfade, die in einem eigenen Block stehen – „Weitere Seiten“ (Navigation) lässt sie aus,
// damit jede URL genau einmal vorkommt.
const gelistet = new Set();
const merke = (zeilen) => {
  for (const z of zeilen) {
    const m = z.match(/\]\(https?:\/\/[^/)]+(\/[^)]*)?\)/);
    if (m) gelistet.add(m[1] || "/");
  }
  return zeilen;
};
const nurIndexierbar = (eintraege) => eintraege.filter(([, pfad]) => indexierbar(pfad));
const zeilen = (eintraege) => merke(nurIndexierbar(eintraege).map(([name, pfad, text]) => link(name, pfad, text)));

export function werkzeugeUndDaten() {
  const werkzeuge = zeilen([
    ["Standort-Check Photovoltaik", "/standort-check", "Schneelast, Wind, Hagel und Ertrag für jede Adresse in Österreich (eHORA, ÖNORM B 1991-1-3, PVGIS)"],
    ["Schneelast-Karte Österreich", "/schneelast", "Schneelast-Richtwert je Ort aus eigener Auswertung der GeoSphere-Austria-Daten SNOWGRID-CL (CC BY 4.0) – Orientierung, kein Normwert"],
    ["PV-Prognose", "/pv-prognose", "stündliche PV-Ertragsprognose für rund 60 Stunden an einer Adresse, Wetterdaten GeoSphere Austria"],
    ["Lastgang-Analyse", "/lastgang-analyse", "15-Minuten-Lastgang aus dem Netzbetreiber-Portal im Browser auswerten (ohne Upload): Grundlast, Spitzen, PV- und Speichergröße"],
    ["Flächen-Check Solarpark", "/flaechen-check", "Eignung einer Fläche für Freiflächen-PV: Widmung, Größe, Netz, Hang, Pachtspanne der Landwirtschaftskammer"],
    ["Einspeisung für Gewerbe", "/einspeisung-gewerbe", `OeMAG-Marktpreis seit 2024 mit Quelle, Direktvermarktung, PPA und Marktprämie im Vergleich, Jahreserlös-Rechner (geprüft am ${OEMAG_STAND.label})`],
    ["Energie live", "/energie-live", "Day-Ahead-Preis der Gebotszone Österreich und Erzeugungsmix, viertelstündlich"],
    ["Förder-Check Österreich", "/foerdercheck", "Bundesland, Zielgruppe und Vorhaben wählen – EAG-Zuschuss, Marktprämie, KPC und Landesprogramme mit Links"],
    ["Alle Rechner", "/rechner", "Übersicht aller Rechner"],
    ["Solarrechner", "/solarrechner", "Ertrag, Eigenverbrauch und Amortisation für Betrieb, Landwirtschaft oder Haus"],
    ["Gewerbe-PV-Rechner", "/rechner/gewerbe-pv", "Eigenverbrauch, Amortisation, IRR, EAG-Zuschuss und IFB stündlich simuliert"],
    ["Peak-Shaving-Rechner", "/rechner/peak-shaving", "Leistungspreis je Netzebene, Speichergröße, PV-Eigenverbrauch und Amortisation"],
    ["Finanzierungsvergleich", "/rechner/finanzierung", "Kauf, Kredit, Leasing, Contracting und Dach-PPA über 20 Jahre"],
    ["Freiflächen- & Pacht-Rechner", "/rechner/freiflaeche-pacht", "PV-Leistung, Stromertrag und Pacht einer Fläche (Freifläche oder Agri-PV)"],
    ["E-Flotte-Rechner", "/rechner/e-flotte", "Gesamtkosten Diesel vs. Elektro mit Vorsteuer, Sachbezug, IFB und PV-Strom"],
    ["Ladeinfrastruktur-Planer", "/rechner/ladeinfrastruktur", "Ladepunkte AC/DC, Spitzenlast mit und ohne Lastmanagement, Netzanschluss"],
    ["Energiegemeinschafts-Rechner", "/rechner/energiegemeinschaft", "geteilter Solarstrom, Netzentgelt-Ersparnis, Erlös vs. OeMAG-Marktpreis"],
    ["Blackout-Rechner", "/rechner/blackout", "Ausfallkosten je Szenario, Ersatzstrom-Leistung, Speicher und Aggregat"],
    ["CO₂- & ESG-Rechner", "/rechner/co2-esg", "Scope 2 standort- und marktbasiert vor und nach PV, mit Textbaustein für VSME und ESRS"],
    ["Stromspeicher-Rechner", "/rechner/stromspeicher", "Autarkie, Ersparnis und Amortisation stündlich simuliert"],
    ["Wärmepumpen-Rechner", "/rechner/waermepumpe", "Heizkosten und CO₂ von Gas oder Heizöl mit Wärmepumpe und Solarstrom vergleichen"],
    ["E-Auto-Laderechner", "/rechner/wallbox", "Laden mit Netz- oder Solarstrom vs. Benzin und Diesel"],
    ["Dynamischer Stromtarif", "/rechner/dynamischer-stromtarif", "Spotpreis oder Festpreis – Tageskosten mit Day-Ahead-Preisen der Gebotszone Österreich"],
  ]);
  // Die Schneelast-Landesseiten sind im Hub /schneelast zusammengeführt (308 → /schneelast#<land>) – keine eigenen Einträge.
  return `## Werkzeuge & Daten

Eigene Werkzeuge und Datenauswertungen mit Quellenangabe. Richtwerte ersetzen keine Normabfrage oder Statik.

${werkzeuge.join("\n")}
`;
}

export function foerderungUndNetz() {
  const mio = (n) => `${zahlText(n / 1_000_000)} Mio. €`;
  const foerderung = zeilen([
    [
      `${FOERDERCALL.nr}. EAG-Fördercall ${FOERDERCALL.jahr}`,
      "/forderungen/eag-foerdercall",
      `Investitionszuschuss PV und Speicher, Einreichung ${FOERDERCALL.zeitraum}, Budget ${mio(FOERDERCALL.budgetGesamt)} (Stand ${FOERDERCALL.stand.label}; verbindlich ist die EAG-Förderabwicklungsstelle)`,
    ],
    ["Bundesförderung (EAG & KPC)", "/forderungen/bundesfoerderung", "Investitionszuschuss nach EAG (OeMAG), UFI"],
    ["Landesförderungen – Überblick", "/forderungen/landesforderungen", `alle neun Bundesländer, Stand ${FOERDER_STAND.label}`],
    ...LAENDER_SLUGS.map((l) => [`Landesförderung ${l.name}`, l.pfad, `Programme mit Quellen, Stand ${FOERDER_STAND.label}`]),
    ["Steuerliche Vorteile", "/forderungen/steuerlich", "IFB, AfA, Elektrizitätsabgabe"],
    ["Baurecht", "/forderungen/baurecht", "Bauordnungen der Bundesländer"],
    ["Richtlinien & Netzanschluss", "/forderungen/richtlinien", "EAG, ElWG, TOR Erzeuger, OVE"],
    ["Vergabe & Förderung für Gemeinden", "/kommunen/vergabe-foerderung", `Schwellenwerte nach Vergaberecht, Gemeinderatsbeschluss, Förderungen (Stand ${VERGABE_STAND.label})`],
    ["Energiegemeinschaft für Betriebe & Gemeinden", "/energiegemeinschaften/betriebe-gemeinden", "EEG, BEG und P2P nach ElWG: Teilnahme, Netzentgelt, Ablauf"],
  ]);
  const netz = zeilen([
    ["Netzanmeldung Photovoltaik", "/netzanmeldung", `Ablauf, Unterlagen und Fristen beim Netzbetreiber (Stand ${NETZ_STAND.label})`],
    ...NETZBETREIBER.map((b) => [`PV-Anlage bei ${b.kurz || b.name} anmelden`, betreiberPfad(b.slug), `${b.name}: Portal, Ablauf, Unterlagen, Fristen (geprüft am ${NETZ_STAND.label})`]),
  ]);
  const widmung = zeilen([
    ["Widmung für Freiflächen-PV – Überblick", "/freiflaechen-photovoltaik/widmung", `Raumordnung aller Bundesländer mit Rechtsquellen (Stand ${WIDMUNG_STAND.label})`],
    ...WIDMUNG_LAENDER.map((l) => [`Widmung Freiflächen-PV ${l.name}`, widmungsPfad(l.slug), l.gesetz]),
  ]);
  return `## Förderung & Netz

Förderprogramme, Netzanschluss und Genehmigung in Österreich – mit Stand-Datum und Quellen auf jeder Seite. Förderangaben ohne Gewähr, maßgeblich sind die Förderstellen.

${foerderung.join("\n")}

### Netzanschluss

${netz.join("\n")}

### Widmung & Genehmigung

${widmung.join("\n")}
`;
}

/** projekte: normalisierte Projekte (ladeProjekte()); ohne Liste nur die Übersichtsseiten. */
export function referenzen(projekte = []) {
  const mitSlug = projekte.filter((p) => p?.slug);
  const summe = mitSlug.reduce((s, p) => s + (p.kwp || 0), 0);
  // alle Projektseiten, größte Anlagen zuerst (ohne Leistungsangabe am Ende)
  const sortiert = [...mitSlug].sort((a, b) => (b.kwp ?? -1) - (a.kwp ?? -1));
  const uebersicht = zeilen([
    ["Referenzprojekte", "/referenzen/projekte", mitSlug.length ? `${mitSlug.length} Projektseiten${summe ? `, zusammen rund ${zahlText(Math.round(summe))} kWp` : ""}` : "Projektseiten mit Leistung und Fotos"],
    ["Referenzkarte", "/referenzen/referenzkarte", "Standorte der Referenzanlagen auf der Karte"],
  ]);
  const liste = zeilen(sortiert.map((p) => [p.titel, `/referenzen/projekte/${p.slug}`, [p.leistungText, p.ort].filter(Boolean).join(" · ")]));
  return `## Referenzen

${uebersicht.join("\n")}
${liste.length ? `\n### Referenzanlagen (nach Leistung)\n\n${liste.join("\n")}\n` : ""}`;
}

/** Presse-Detailseiten (Kanal „website“) und – sobald befüllt – die Videos der Mediathek. */
export function presse(meldungen = []) {
  const eintraege = zeilen(
    meldungen
      .filter((m) => m?.slug)
      .map((m) => [m.titel, `/presse/${m.slug}`, [m.kategorie, m.datum ? String(m.datum).slice(0, 10) : ""].filter(Boolean).join(" · ")]),
  );
  const videos = mediathekBefuellt() ? zeilen(reelsSortiert().map((r) => [r.titel, reelPfad(r.slug), r.datum])) : [];
  if (!eintraege.length && !videos.length) return "";
  return `## Presse & Neuigkeiten
${eintraege.length ? `\n${eintraege.join("\n")}\n` : ""}${videos.length ? `\n### Videos\n\n${videos.join("\n")}\n` : ""}`;
}

export function hersteller() {
  const partner = belegtePartner();
  if (!partner.length) return "";
  const wr = new Map(wechselrichterSeiten().filter((s) => s.partner).map((s) => [s.partner.slug, s.pfad]));
  const speicher = new Map(speicherSeiten().map((s) => [s.partner.slug, s.pfad]));
  const eintraege = partner.flatMap((p) => {
    const verb = p.kategorie === "Monitoring" ? "bei Ökovolt eingesetzt" : "bei Ökovolt verbaut";
    // ohne eigene Detailseite: Anker der Marke auf der Herstellerübersicht (HerstellerFilter.js)
    const pfad = wr.get(p.slug) || speicher.get(p.slug) || `/produkte/hersteller#hersteller-${p.slug}`;
    const zeilen = [[p.title, pfad, `${p.rolle} – ${verb}`]];
    if (wr.has(p.slug) && speicher.has(p.slug)) zeilen.push([`${p.title} ${p.speicher?.serie || "Speicher"}`, speicher.get(p.slug), `Stromspeicher – ${verb}`]);
    return zeilen;
  });
  const uebersicht = [["Hersteller – Übersicht", "/produkte/hersteller", "Marken, mit denen Ökovolt in Österreich arbeitet"]];
  if (wechselrichterRouten().uebersicht) uebersicht.push(["Wechselrichter", "/produkte/wechselrichter", "Wechselrichter der Marken, die Ökovolt verbaut"]);
  // Übersicht und Marken getrennt merken: dieselbe Übersichtsseite darf als Ziel mehrerer Marken vorkommen
  const zeilenUebersicht = zeilen(uebersicht);
  const zeilenMarken = nurIndexierbar(eintraege).map(([name, pfad, text]) => link(name, pfad, text));
  merke(zeilenMarken);
  return `## Hersteller

Nur Marken, deren Einsatz bei Ökovolt belegt ist. Keine Aussage über Partnerschaften; neutrale Vergleiche weiterer Marken stehen in den Ratgeber-Artikeln.

${[...zeilenUebersicht, ...zeilenMarken].join("\n")}
`;
}

/** Navigation ohne die Pfade, die schon in einem eigenen Block stehen. */
export function seiten() {
  const bereiche = NAVIGATION.map((n) => {
    const items = n.groups.flatMap((g) => g.items).filter((i) => i.href?.startsWith("/") && indexierbar(i.href) && !gelistet.has(i.href));
    if (!items.length) return "";
    return `### ${n.title}\n\n${n.intro}\n\n${merke(items.map((i) => link(i.name, i.href, i.text))).join("\n")}`;
  })
    .filter(Boolean)
    .join("\n\n");
  const weitere = zeilen([
    ["Photovoltaik planen, errichten, anschließen", "/dienstleistungen/photovoltaik", "Leistungen von der Lastganganalyse bis zur Wartung"],
    ["Gemeinschaftliche Erzeugungsanlage (GEA)", "/produkte/mieterstrom", "PV-Strom im Mehrparteienhaus und Gewerbepark teilen"],
    ["Smarthome & Energiemanagement", "/dienstleistungen/smarthome", "Speicher, Wallbox, Notstrom und Smart Meter als ein System"],
    ["Smart Energy Home", "/produkte/smartenergyhome", "Energiemanagement für Wohnhaus und Chalet"],
    ["PV-Angebot anfragen", "/angebot", "Ersteinschätzung zu Größe und Ertrag für Betriebe"],
  ].filter(([, pfad]) => !gelistet.has(pfad)));
  const stellen = zeilen(STELLEN.map((st) => [st.titel, `/uber-uns/jobs/${st.slug}`]));
  return `## Weitere Seiten\n\n${bereiche}${weitere.length ? `\n\n### Weitere Leistungen\n\n${weitere.join("\n")}` : ""}${stellen.length ? `\n\n### Offene Stellen\n\n${stellen.join("\n")}` : ""}\n`;
}

export function ratgeber() {
  const artikel = alleArtikel().filter((a) => indexierbar(artikelPfad(a.slug)));
  const gruppen = [...KATEGORIEN, ...new Set(artikel.map((a) => a.kategorie).filter((k) => !KATEGORIEN.includes(k)))]
    .map((k) => {
      const liste = artikel.filter((a) => a.kategorie === k);
      if (!liste.length) return "";
      return `### ${k}\n\n${liste.map((a) => link(a.title, artikelPfad(a.slug), a.excerpt || a.description)).join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");
  return `## Ratgeber – Fachartikel für Österreich (mit Quellen, Rechenbeispielen, FAQ)\n\n${gruppen}\n`;
}

export function regionen() {
  const laender = zeilen(PV_LAENDER.map((l) => [`Photovoltaik ${l.name}`, landPfad(l.slug), `Standorte mit PVGIS-Ertrag, Netzbetreiber, Schneelast-Richtwerte und Baurecht ${l.imLand}`]));
  const eintraege = zeilen(
    Object.entries(REGIONEN || {}).map(([slug, r]) => [`Photovoltaik ${r?.name || r?.stadt || r?.ort || slug}`, `/photovoltaik/${slug}`]),
  );
  return `## Regionen in Österreich

${zeilen([["Übersicht Einzugsgebiet", "/photovoltaik"]])[0] || ""}

### Bundesländer

${laender.join("\n")}

### Städte und Bezirke

${eintraege.join("\n")}
`;
}

export function fuss() {
  return `## Feeds & Rechtliches

${link("Startseite", "")}
${link("RSS: alle Neuigkeiten und Fachartikel", "/rss.xml")}
${link("Impressum", "/impressum")}
${link("Datenschutz", "/datenschutz")}
${link("AGB", "/agb")}
${link("Barrierefreiheit", "/barrierefreiheit")}
${HINWEIS_INTERN ? [link("Hinweisgeberschutz (HSchG): Informationen, Fristen, externe Stelle BAK", "/hinweisgeberschutz"), link("Hinweisgebersystem (HSchG, anonym möglich)", "/hinweisgebersystem")].join("\n") : link("Hinweisgebersystem (HSchG)", "/hinweisgeberschutz")}
${link("Sitemap (XML)", "/sitemap.xml")}
${link("Ausführliche Fassung für KI-Systeme", "/llms-full.txt")}
`;
}

/** Blöcke in fester Reihenfolge; `mitte` ersetzt den Ratgeber-Block (llms-full.txt: Kernaussagen). */
export function llmsText({ projekte = [], meldungen = [], mitte } = {}) {
  gelistet.clear();
  // Eigene Blöcke zuerst erzeugen, damit „Weitere Seiten“ deren Pfade auslässt
  const bloecke = [kopf(), werkzeugeUndDaten(), foerderungUndNetz(), referenzen(projekte), hersteller(), presse(meldungen)];
  const rest = regionen();
  return [...bloecke, seiten(), mitte ?? ratgeber(), rest, fuss()].filter(Boolean).join("\n");
}

/** Daten für die llms-Routen: Projekte und Presse-Meldungen, je mit Zeitdeckel (Backend darf nie blockieren). */
export async function llmsDaten() {
  const mitDeckel = (versprechen, ms, ersatz) => {
    let timer;
    const deckel = new Promise((r) => {
      timer = setTimeout(() => r(ersatz), ms);
    });
    return Promise.race([versprechen.catch(() => ersatz), deckel]).finally(() => clearTimeout(timer));
  };
  const [projekte, meldungen] = await Promise.all([
    mitDeckel(ladeProjekte(), 8000, []),
    mitDeckel(veroeffentlichungen({ kanal: "website", limit: 50 }), 5000, []),
  ]);
  return { projekte: Array.isArray(projekte) ? projekte : [], meldungen: (Array.isArray(meldungen) ? meldungen : []).filter((m) => m?.kanaele?.website) };
}
