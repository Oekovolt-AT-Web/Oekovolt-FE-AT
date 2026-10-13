// src/components/GewerbeUnikat/_tokens.js
//
// Gestaltungs-Tokens der Unikat-Seite /gewerbe (Konzept: docs/projekt-doku/anhang/wellen/GEWERBE-UNIKAT.md).
// REINE KONSTANTEN – keine React-Importe, keine Seiteneffekte. Server- UND Client-Komponenten dürfen
// diese Datei importieren. Hooks liegen in ./_gestaltung.js ("use client"), statische Bausteine in
// ./_bausteine.js.
//
// Farben: ausschließlich Werte der Tailwind-Tokens aus src/app/globals.css (ov, navy, ink, sand, sun).
// Für Tailwind-Klassen weiter die Token-Namen benutzen (bg-navy-950, text-ov-700 …); die Hex-Werte hier
// sind für Canvas, SVG-Attribute, three.js und motion gedacht, wo keine Klassen greifen.

/** Hex-Werte der CD-Tokens (identisch mit @theme in globals.css). */
export const FARBE = {
  ov50: "#f4f9ee",
  ov100: "#e6f1d8",
  ov200: "#cde3b1",
  ov300: "#aed083",
  ov400: "#8cba58",
  ov500: "#669933",
  ov600: "#558227",
  ov700: "#436621",
  ov800: "#37521e",
  navy50: "#eef4fb",
  navy100: "#d9e6f5",
  navy200: "#b2cbe9",
  navy300: "#7fa7d6",
  navy400: "#4a7cbd",
  navy500: "#1f5aa1",
  navy600: "#0b4488",
  navy700: "#003473",
  navy800: "#03285a",
  navy900: "#041d42",
  navy950: "#03122b",
  ink50: "#f7f8fa",
  ink100: "#eef0f4",
  ink200: "#dfe3ea",
  ink300: "#c4cad5",
  ink400: "#97a0b0",
  ink500: "#646c7e",
  ink600: "#4e5667",
  ink700: "#394050",
  ink900: "#151a24",
  sand50: "#fbfaf6",
  sand100: "#f5f3ea",
  sun300: "#ffd873",
  sun400: "#ffc53d",
  sun500: "#f5a70f",
  weiss: "#ffffff",
};

/**
 * Bedeutungsfarben – auf der GANZEN Seite gleich (eine Farbe = eine Bedeutung).
 * „dunkel“ = auf Navy-Bühne (navy-950), „hell“ = auf weiß/sand.
 * Regel: sun-500 (Spitze) und sun-300 (Überschuss) als Text/Linie NUR auf Navy (Kontrast ≥ 7:1);
 * auf hellem Grund nur als Fläche mit dunkler Direktbeschriftung (ink-900) – sun-500 auf Weiß hat nur ~2:1.
 */
export const BEDEUTUNG = {
  last: { dunkel: FARBE.navy300, hell: FARBE.navy500 }, // Verbrauch / Netzbezug
  eigen: { dunkel: FARBE.ov400, hell: FARBE.ov600 }, // PV direkt genutzt (Eigenverbrauch)
  ueberschuss: { dunkel: FARBE.sun300, hell: FARBE.sun400 }, // PV-Überschuss / Einspeisung
  spitze: { dunkel: FARBE.sun500, hell: FARBE.sun500 }, // Lastspitze / Leistungspreis
  sonne: { dunkel: FARBE.sun300, hell: FARBE.sun400 }, // Sonnenstand, Sonnenbogen (dekorativ)
  speicher: { dunkel: FARBE.ov300, hell: FARBE.ov700 },
  grenze: { dunkel: "rgba(255,255,255,0.55)", hell: FARBE.ink600 }, // Schwellen, Dachgrenze, Deckel
  raster: { dunkel: "rgba(255,255,255,0.08)", hell: "rgba(21,26,36,0.08)" }, // Haarlinien
};

/**
 * Sequenzielle Rampe für Last-Heatmaps (Teppich): Helligkeit steigt monoton – lesbar auch in Graustufen
 * und für Farbfehlsichtige. Bewusst OHNE Grün und Amber (die sind für Sonne/Spitze reserviert).
 */
export const LAST_RAMPE = [FARBE.navy950, FARBE.navy700, FARBE.navy400, FARBE.navy200, FARBE.weiss];

/** Bewegung: Dauern in Sekunden (motion) und als CSS-Strings. Ruhig, präzise, nie verspielt. */
export const BEWEGUNG = {
  dauer: { kurz: 0.18, mittel: 0.32, lang: 0.6, intro: 0.9 },
  // ease-out-expo-artig: schneller Start, weiches Ankommen – Standard für alles, was erscheint
  ease: { aus: [0.16, 1, 0.3, 1], inAus: [0.65, 0, 0.35, 1] },
  css: { aus: "cubic-bezier(0.16, 1, 0.3, 1)", inAus: "cubic-bezier(0.65, 0, 0.35, 1)" },
  // Federn ohne Überschwingen (Regler, Punkte, Füllstände)
  feder: {
    steif: { type: "spring", stiffness: 320, damping: 36, mass: 0.9 },
    weich: { type: "spring", stiffness: 160, damping: 26, mass: 1 },
  },
  versatz: 0.06, // Stagger zwischen Listenelementen (s)
  weg: 12, // px – maximaler Einblend-Weg (y)
};

/** Ebenen (z-index) – die Rückruf-Schaltfläche liegt global bei 9400, Navbar bei 100. */
export const EBENE = { buehne: 1, overlay: 5, tooltip: 30, kapitelSchiene: 40, daumenLeiste: 9300 };

/** Haltepunkte (px) wie Tailwind; `schiene` = Breite, ab der die Kapitel-Schiene links Platz hat. */
export const BREITE = { sm: 640, md: 768, lg: 1024, xl: 1280, schiene: 1400 };

/** Stand-Angaben – überall gleich formulieren. */
export const STAND = { werte: "Stand 09/2026", kurz: "09/2026", geprueft: "12.10.2026" };

/** Pflicht-Kennzeichnungen (wörtlich verwenden, siehe Konzept „Eine Wahrheit“). */
export const KENNZEICHNUNG = {
  synthetisch: "Synthetischer Beispiel-Lastgang – keine Messdaten eines echten Betriebs",
  synthetischKurz: "Synthetisch · keine Messdaten",
  modell: "Modellprofil – Annahme, keine Messung",
  pvModell: "PV im Modell: PVGIS-Monatssummen, Tagesverlauf aus Sonnenstand, Wetter synthetisch",
  klarhimmel: "Klarhimmel-Näherung – zeigt die Lichtform, keinen Ertrag",
  schematisch: "Schematisch – keine Messung",
  entwurf2027: "Entwurf – die Tarifwerte für 2027 stehen noch aus",
  schnee: "Richtwert aus SNOWGRID-CL (GeoSphere Austria, CC BY 4.0) – kein Normwert nach ÖNORM",
  richtwert: "Richtwert",
  beispiel: "Beispiel, kein Angebot",
  keineBeratung: "Orientierung, keine Rechts- oder Steuerberatung",
};

/**
 * Primärquellen, die mehrere Kapitel zitieren (früher als Konstanten in src/app/gewerbe/page.js).
 * Weitere Quellen kommen aus den Bibliotheken selbst (NETZ_QUELLE, PVGIS_QUELLE, OEMAG QUELLEN …).
 */
export const QUELLE = {
  elwg: { titel: "ElWG, BGBl. I Nr. 91/2025 (RIS)", href: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91" },
  sneEntwurf: {
    titel: "E-Control – Begutachtungsentwurf SNE-G-V samt Erläuterungen",
    href: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf",
    stand: "Entwurf vom 29.06.2026",
  },
  // Link aus src/lib/lastgang/analyse.js übernommen (dort geprüft)
  arg: { titel: "§ 7 Arbeitsruhegesetz – Feiertage (RIS)", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008541" },
};

/**
 * Kapitel der Seite in Reihenfolge. `anker` = id der <section>, `kurz` = Label für Kapitel-Schiene und
 * Steckbrief, `rollen` = für welche Rolle der Rollen-Weiche das Kapitel „Für Sie“ markiert ist.
 * Rollen-Kennungen wie MAPPE_ROLLEN in src/data/argumentarien.js (gf, cfo, technik).
 */
export const KAPITEL = [
  { id: "hero", anker: "start", kurz: "Überblick", rollen: ["gf", "cfo", "technik"] },
  { id: "k1", anker: "lastgang", kurz: "Lastgang", rollen: ["technik", "gf"] },
  { id: "k2", anker: "hallendach", kurz: "Hallendach", rollen: ["technik"] },
  { id: "k3", anker: "eigenverbrauch", kurz: "Anlagengröße", rollen: ["gf", "technik"] },
  { id: "k4", anker: "kwh-wert", kurz: "kWh-Wert", rollen: ["cfo", "gf"] },
  { id: "k5", anker: "leistungspreis", kurz: "Leistungspreis", rollen: ["cfo", "technik"] },
  { id: "k6", anker: "netzanschluss", kurz: "Netzanschluss", rollen: ["technik"] },
  { id: "k7", anker: "wirtschaftlichkeit", kurz: "Wirtschaftlichkeit", rollen: ["cfo", "gf"] },
  { id: "k8", anker: "fahrplan", kurz: "Fahrplan", rollen: ["gf", "technik", "cfo"] },
];

/**
 * Erkenntnisse, die der Besucher durch Interaktion aufdeckt. Kapitel melden sie mit
 * steckbrief.erkenntnis(id) und ereignis("erkenntnis", { id }); K8 listet die gesammelten im Steckbrief
 * (allgemeine Fassung ohne Zahlen – die Zahlen stehen im jeweiligen Kapitel). Nur diese Ids verwenden.
 */
export const ERKENNTNISSE = [
  { id: "h-feiertag", kapitel: "hero", text: "Am Feiertag ruht der Betrieb – die Sonne nicht." },
  { id: "k1-schichtbeginn", kapitel: "k1", text: "Die Monatsspitzen entstehen beim Schichtbeginn, nicht im Dauerbetrieb." },
  { id: "k1-freie-tage", kapitel: "k1", text: "Ein Teil des Stroms fließt an Tagen, an denen kaum jemand arbeitet." },
  { id: "k1-grundlast", kapitel: "k1", text: "Nachts läuft der Betrieb nie auf null – die Grundlast trägt jede Anlage." },
  { id: "k1-sonne", kapitel: "k1", text: "Sonne und Schicht treffen sich werktags mittags." },
  { id: "k2-ostwest", kapitel: "k2", text: "Ost-West bringt mehr Leistung aufs gleiche Dach – jedes Modul erntet weniger, das Dach mehr." },
  { id: "k3-knick", kapitel: "k3", text: "Doppelte Anlage heißt nicht doppelte Ersparnis – Überschuss entsteht vor allem, wenn der Betrieb ruht." },
  { id: "k3-flotte", kapitel: "k3", text: "Eine E-Flotte, die mittags lädt, macht aus Überschuss Eigenverbrauch." },
  { id: "k3-marktwert", kapitel: "k3", text: "Sommerlicher Mittagsstrom ist am Markt wenig wert – selbst genutzt ist er am meisten wert." },
  { id: "k4-faktor", kapitel: "k4", text: "Eine selbst genutzte kWh ist ein Mehrfaches einer eingespeisten wert." },
  { id: "k5-sonne-schlaeft", kapitel: "k5", text: "Um 06:15 schläft die Sonne noch – PV allein senkt den Leistungspreis kaum." },
  { id: "k5-speicher", kapitel: "k5", text: "Ein kleiner Speicher kappt die teuersten Viertelstunden planbar." },
  { id: "k6-typ-b", kapitel: "k6", text: "Für TOR Typ B zählt die AC-Leistung am Netzanschluss – inklusive Speicher." },
  { id: "k7-stresstest", kapitel: "k7", text: "Sie haben den schlechten Fall selbst durchgerechnet." },
  { id: "k8-reihenfolge", kapitel: "k8", text: "Förderantrag vor Inbetriebnahme – die Reihenfolge entscheidet." },
];

/** Rollen der Rollen-Weiche (Labels kurz; Kennungen = MAPPE_ROLLEN-Ids). */
export const ROLLEN = [
  { id: "gf", label: "Geschäftsführung" },
  { id: "cfo", label: "Finanzen" },
  { id: "technik", label: "Technik" },
];

// ---------------------------------------------------------------------------------------------------
// Formatierung – ohne Intl, damit Server und Browser identisch rendern (keine Hydrierungs-Abweichung).
// ---------------------------------------------------------------------------------------------------

/** Zahl deutsch: Tausenderpunkt, Dezimalkomma, echtes Minus. zahl(14644.4, 0) → "14.644" */
export function zahl(n, stellen = 0) {
  if (!Number.isFinite(n)) return "–";
  const f = Math.pow(10, stellen);
  const r = Math.round(Math.abs(n) * f) / f;
  const [ganz, dez] = r.toFixed(stellen).split(".");
  const text = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (dez ? `,${dez}` : "");
  return n < 0 && r !== 0 ? `−${text}` : text;
}

/** Euro gerundet auf 10 € (unter 10.000) bzw. 100 € – für Live-Ausgaben, die nicht flackern sollen. */
export function euroRund(n) {
  if (!Number.isFinite(n)) return "–";
  const schritt = Math.abs(n) >= 10000 ? 100 : 10;
  return `${zahl(Math.round(n / schritt) * schritt)} €`;
}

/** Prozent aus Anteil: prozent(0.803) → "80 %" */
export const prozent = (anteil, stellen = 0) => `${zahl(anteil * 100, stellen)} %`;

/** Feste Seitenverhältnisse der Grafik-Platzhalter (verhindern CLS beim Nachladen). */
export const SEITENVERHAELTNIS = {
  teppichQuer: "365 / 144", // Desktop: 365 Tage × 96 Viertelstunden, Zeitachse 1,5-fach gestreckt
  teppichHoch: "96 / 146", // Mobil: 96 Viertelstunden quer × 365 Tage hoch (Tage gestaucht)
  dach3d: "16 / 10",
  dach3dMobil: "4 / 3.4",
  puls: "1200 / 420",
  pulsMobil: "390 / 300",
};
