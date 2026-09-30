/*
 * A/B-Tests (Experimente) – Verzeichnis, Zuweisung, Kennzeichnung und Auswertung.
 *
 * Grundsätze
 * ----------
 * - Keine Cookies, kein localStorage/sessionStorage: Die Variante wird pro Seitenaufruf ausgelost.
 *   Im Browser bleibt sie nur im Arbeitsspeicher (Modul-Variable), also für die Dauer des
 *   Seitenaufrufs inkl. clientseitiger Navigation; ein Neuladen lost neu aus. Damit ist keine
 *   Einwilligung nach § 165 Abs. 3 TKG 2021 nötig und es entsteht keine Wiedererkennung.
 * - Serverseitige Varianten: Die Middleware lost aus und reicht das Ergebnis im Request-Header
 *   `x-ov-exp` an die Seite weiter (Server-Komponente: `(await headers()).get("x-ov-exp")`).
 *   Das passiert NUR auf den Pfaden, die in `config.matcher` der Middleware stehen, und die Antwort
 *   bekommt `Cache-Control: private, no-store`, damit kein CDN eine Variante für alle zwischenspeichert.
 * - Kein Cloaking: Bots und Menschen werden gleich behandelt (keine User-Agent-Weiche). Varianten
 *   ändern nur Darstellung/Formularlogik, nie Canonical, Titel, Robots-Angaben oder Inhalte für SEO.
 * - Messung: `exp_gesehen` feuert einmal je Experiment und Seitenaufruf, sobald das getestete Element
 *   sichtbar wird (IntersectionObserver, siehe components/Experimente/ExperimentSichtbar.js).
 *   Jedes Anfrage-Ereignis trägt `exp` (z. B. "k1:b"), siehe `expFuerEreignis()`.
 *   Werte sind nie personenbezogen (nur Test-ID und Variante).
 *
 * Einen Test STARTEN
 * ------------------
 * 1. Eintrag in EXPERIMENTE unten anlegen oder vorhandenen anpassen:
 *      { id: "k2", titel, seiten: ["/pfad"], varianten: ["a", "b"], gewichte: [50, 50],
 *        aktiv: true, bis: "JJJJ-MM-TT", ort: "client" | "server" }
 *    - id: kurz, klein, [a-z0-9]; varianten[0] ist immer die Kontrolle (heutiger Stand).
 *    - bis: letzter Testtag (einschließlich, österreichische Zeit). Danach gilt automatisch die Kontrolle.
 *    - ort "client": Komponente liest die Variante mit `useExperiment("k2")`
 *      (components/Experimente/useExperiment.js) – erst nach dem Mounten, darum nur für Elemente,
 *      die beim ersten Bild nicht sichtbar sind (sonst Flackern), z. B. spätere Formularschritte.
 *    - ort "server": zusätzlich den Pfad als statisches Literal in `config.matcher` von
 *      src/middleware.js eintragen (Next.js wertet den Matcher beim Build aus) und die Seite liest
 *      den Header per `headers()` (macht die Seite dynamisch) und `varianteAusHeader(wert, "k2")`.
 * 2. Das getestete Element in <ExperimentSichtbar id="k2" variante={v}> einpacken.
 * 3. Anfrage-Ereignis mit `exp: expFuerEreignis()` senden (im Konfigurator erledigt).
 * 4. Vorschau ohne Aktivierung: Seite mit `?ov-exp=k1:b` aufrufen (wird nicht gezählt).
 * 5. `aktiv: true` setzen, deployen. Vorher Testdauer planen: `stichprobeJeVariante()` unten.
 *
 * Einen Test BEENDEN
 * ------------------
 * - `aktiv: false` setzen (oder `bis` verstreichen lassen) → alle sehen die Kontrolle, keine
 *   exp-Kennzeichnung mehr. Gewinnt B: B-Logik zum Standard machen, Test-Code und Eintrag entfernen
 *   (bzw. Eintrag mit aktiv:false als Protokoll stehen lassen), bei ort "server" den Matcher-Eintrag
 *   aus src/middleware.js löschen.
 *
 * AUSWERTEN
 * ---------
 * - In Umami (cookielos): Ereignisse `exp_gesehen` und das Ziel-Ereignis (K1: `angebot_angefragt`)
 *   nach der Eigenschaft `exp` filtern, z. B. exp = "k1:a" und "k1:b", im Testzeitraum.
 *   Gesehen = Anzahl `exp_gesehen`, Anfragen = Anzahl Ziel-Ereignisse mit derselben exp-Kennung.
 * - Beide Zahlenpaare in `auswerten({ a: { gesehen, anfragen }, b: { gesehen, anfragen } })`
 *   geben (z. B. in `node -e`), Ergebnis: Quoten, relative Veränderung, z-Wert, p-Wert
 *   (zweiseitig), `signifikant` bei p < 0,05. Erst entscheiden, wenn die geplante Stichprobe
 *   erreicht ist (kein „Zwischendurch-Reinschauen und Abbrechen“).
 * - Qualität gegenprüfen: Die Anfrage enthält im Feld `angaben` die Zeile „A/B-Test: k1:b“ – im
 *   Backoffice lässt sich so prüfen, ob Variante B mehr, aber schlechtere Anfragen bringt
 *   (z. B. fehlende Telefonnummer, weniger Abschlüsse).
 */

/* ------------------------------------------------------------------ */
/* Verzeichnis                                                         */
/* ------------------------------------------------------------------ */

export const EXPERIMENTE = [
  {
    // K1: Kontaktschritt im Angebots-Konfigurator (/angebot)
    // a = heute: Telefon Pflicht, Pflicht-Checkbox „Kontakt zustimmen + AGB akzeptieren“
    // b = Telefon optional, Hinweistext zur Rechtsgrundlage (Art. 6 Abs. 1 lit. b DSGVO) statt Checkbox,
    //     Button „Kostenlose Einschätzung anfordern“
    id: "k1",
    titel: "Konfigurator: Kontaktschritt ohne Pflicht-Checkbox, Telefon optional",
    seiten: ["/angebot"],
    varianten: ["a", "b"],
    gewichte: [50, 50],
    aktiv: false, // standardmäßig AUS – erst aktivieren, wenn das Backend einwilligung = 0 annimmt (siehe Übergabe)
    bis: "2026-12-31",
    ort: "client",
  },
];

/** Name des Request-/Response-Headers für serverseitig ausgeloste Varianten. */
export const EXP_HEADER = "x-ov-exp";

const ID_MUSTER = /^[a-z0-9]{1,12}$/;
const VARIANTE_MUSTER = /^[a-z0-9]{1,8}$/;

/* ------------------------------------------------------------------ */
/* Reine Hilfsfunktionen (Server, Middleware/Edge und Browser)         */
/* ------------------------------------------------------------------ */

/** Letzter Testtag einschließlich, Ende des Tages in Wien (vereinfachend UTC+1 – eine Stunde Unschärfe genügt). */
export function endeVon(bis) {
  if (!bis || !/^\d{4}-\d{2}-\d{2}$/.test(bis)) return null;
  return new Date(`${bis}T23:59:59.999+01:00`);
}

/** Läuft das Experiment zum Zeitpunkt `jetzt`? */
export function laeuft(exp, jetzt = new Date()) {
  if (!exp || !exp.aktiv) return false;
  if (!Array.isArray(exp.varianten) || exp.varianten.length < 2) return false;
  const ende = endeVon(exp.bis);
  if (exp.bis && !ende) return false;
  return !ende || jetzt.getTime() <= ende.getTime();
}

/** Pfad normalisieren: ohne Query/Hash, ohne abschließenden Schrägstrich (außer „/“). */
export function normalisierePfad(pfad) {
  const p = String(pfad || "/").split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") || "/" : p;
}

/**
 * Passt ein Pfad zu einem Seitenmuster? Muster: exakter Pfad ("/angebot") oder Präfix mit
 * "/*" ("/ratgeber/*" passt auf "/ratgeber/x", nicht auf "/ratgeber").
 */
export function pfadPasst(muster, pfad) {
  const p = normalisierePfad(pfad);
  if (muster.endsWith("/*")) return p.startsWith(muster.slice(0, -1));
  return normalisierePfad(muster) === p;
}

export function experiment(id) {
  return EXPERIMENTE.find((e) => e.id === id) || null;
}

/** Laufende Experimente für einen Pfad, optional nur ein Ort ("client" | "server"). */
export function experimenteFuerPfad(pfad, { ort, jetzt = new Date(), verzeichnis = EXPERIMENTE } = {}) {
  return verzeichnis.filter((e) => laeuft(e, jetzt) && (!ort || e.ort === ort) && (e.seiten || []).some((m) => pfadPasst(m, pfad)));
}

/**
 * Variante nach Gewichten auslosen. `zufall` in [0, 1). Fehlen Gewichte oder sind sie ungültig,
 * wird gleich verteilt.
 */
export function waehleVariante(exp, zufall) {
  const v = exp.varianten;
  const g = Array.isArray(exp.gewichte) && exp.gewichte.length === v.length && exp.gewichte.every((x) => Number.isFinite(x) && x >= 0) ? exp.gewichte : v.map(() => 1);
  const summe = g.reduce((a, b) => a + b, 0);
  if (!(summe > 0)) return v[0];
  const z = Math.min(Math.max(Number(zufall) || 0, 0), 0.999999999) * summe;
  let lauf = 0;
  for (let i = 0; i < v.length; i++) {
    lauf += g[i];
    if (z < lauf) return v[i];
  }
  return v[v.length - 1];
}

/** Zufallszahl in [0, 1) – kryptografisch, wenn verfügbar (Edge, Browser, Node ≥ 19). */
export function zufallszahl() {
  try {
    const a = new Uint32Array(1);
    globalThis.crypto.getRandomValues(a);
    return a[0] / 4294967296;
  } catch {
    return Math.random();
  }
}

/** { k1: "b", k2: "a" } -> "k1=b;k2=a" (nur gültige IDs/Varianten, sortiert). */
export function headerWert(zuweisungen) {
  return Object.entries(zuweisungen || {})
    .filter(([id, v]) => ID_MUSTER.test(id) && VARIANTE_MUSTER.test(String(v)))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, v]) => `${id}=${v}`)
    .join(";");
}

/** "k1=b;k2=a" -> { k1: "b", k2: "a" }; Unbekanntes und Ungültiges wird verworfen. */
export function leseHeader(wert, verzeichnis = EXPERIMENTE) {
  const aus = {};
  for (const teil of String(wert || "").split(";")) {
    const [id, v] = teil.split("=").map((s) => (s || "").trim());
    const exp = verzeichnis.find((e) => e.id === id);
    if (exp && exp.varianten.includes(v)) aus[id] = v;
  }
  return aus;
}

/**
 * Variante eines serverseitigen Experiments aus dem Header lesen. Ohne (gültigen) Header oder wenn
 * das Experiment nicht läuft: Kontrolle (varianten[0]).
 */
export function varianteAusHeader(wert, id, { jetzt = new Date(), verzeichnis = EXPERIMENTE } = {}) {
  const exp = verzeichnis.find((e) => e.id === id);
  if (!exp) return null;
  if (!laeuft(exp, jetzt)) return exp.varianten[0];
  return leseHeader(wert, verzeichnis)[id] || exp.varianten[0];
}

/**
 * Für die Middleware: laufende serverseitige Experimente für den Pfad auslosen.
 * Ergebnis: Header-Wert ("k3=b") oder "" wenn nichts läuft.
 */
export function middlewareZuweisung(pfad, { zufall = zufallszahl, jetzt = new Date(), verzeichnis = EXPERIMENTE } = {}) {
  const zuw = {};
  for (const e of experimenteFuerPfad(pfad, { ort: "server", jetzt, verzeichnis })) zuw[e.id] = waehleVariante(e, zufall());
  return headerWert(zuw);
}

/** { k1: "b" } -> "k1:b" (Format für Statistik-Ereignisse, max. 80 Zeichen). */
export function expKennung(zuweisungen) {
  return Object.entries(zuweisungen || {})
    .filter(([id, v]) => ID_MUSTER.test(id) && VARIANTE_MUSTER.test(String(v)))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, v]) => `${id}:${v}`)
    .join(",")
    .slice(0, 80);
}

/* ------------------------------------------------------------------ */
/* Zuweisung im Browser (Arbeitsspeicher, je Seitenaufruf)             */
/* ------------------------------------------------------------------ */

const IM_SPEICHER = new Map();

/**
 * Variante für einen clientseitigen Test. Erste Abfrage lost aus, danach bleibt sie bis zum
 * Neuladen gleich. Läuft der Test nicht (oder falsche Seite): Kontrolle, ohne Kennzeichnung.
 * `pfad` optional – ohne Angabe gilt das Experiment auf jeder Seite, auf der es eingebaut ist.
 */
export function zuweisen(id, { pfad, zufall = zufallszahl, jetzt = new Date(), verzeichnis = EXPERIMENTE } = {}) {
  const exp = verzeichnis.find((e) => e.id === id);
  if (!exp) return null;
  const passt = !pfad || (exp.seiten || []).some((m) => pfadPasst(m, pfad));
  if (!laeuft(exp, jetzt) || !passt) {
    IM_SPEICHER.delete(id);
    return exp.varianten[0];
  }
  if (!IM_SPEICHER.has(id)) IM_SPEICHER.set(id, waehleVariante(exp, zufall()));
  return IM_SPEICHER.get(id);
}

/** Serverseitig ausgeloste Varianten (aus dem Header) im Browser übernehmen, damit Ereignisse sie tragen. */
export function uebernehmen(zuweisungen) {
  for (const [id, v] of Object.entries(zuweisungen || {})) {
    const exp = experiment(id);
    if (exp && laeuft(exp) && exp.varianten.includes(v)) IM_SPEICHER.set(id, v);
  }
}

/** Alle aktuell zugewiesenen, laufenden Experimente als { id: variante }. */
export function aktiveZuweisungen({ jetzt = new Date() } = {}) {
  const aus = {};
  for (const [id, v] of IM_SPEICHER) {
    const exp = experiment(id);
    if (exp && laeuft(exp, jetzt)) aus[id] = v;
  }
  return aus;
}

/** exp-Kennung für Anfrage-Ereignisse, z. B. "k1:b" – leer, wenn kein Test läuft. */
export function expFuerEreignis() {
  return expKennung(aktiveZuweisungen());
}

/**
 * Vorschau für Redaktion/QA: `?ov-exp=k1:b` zeigt Variante b, auch wenn der Test aus ist.
 * Gilt für jeden Besucher gleich (kein Cloaking), wird NICHT als Zuweisung gezählt und erzeugt
 * darum keine exp-Kennung in Ereignissen. Ergebnis: Variante oder null.
 */
export function vorschauVariante(suche, id, verzeichnis = EXPERIMENTE) {
  const exp = verzeichnis.find((e) => e.id === id);
  if (!exp) return null;
  let wert = "";
  try {
    wert = new URLSearchParams(String(suche || "")).get("ov-exp") || "";
  } catch {
    return null;
  }
  for (const teil of wert.split(",")) {
    const [i, v] = teil.split(":").map((s) => (s || "").trim());
    if (i === id && exp.varianten.includes(v)) return v;
  }
  return null;
}

/** Nur für Tests: Arbeitsspeicher leeren. */
export function _zuruecksetzen() {
  IM_SPEICHER.clear();
}

/* ------------------------------------------------------------------ */
/* Auswertung                                                          */
/* ------------------------------------------------------------------ */

/** Standardnormalverteilung Φ(x) – Näherung nach Abramowitz/Stegun 26.2.17 (Fehler < 7,5e-8). */
export function normalVerteilung(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

/**
 * Zwei-Stichproben-Test für Anteile (Konversionsrate A gegen B).
 * @param {{a:{gesehen:number, anfragen:number}, b:{gesehen:number, anfragen:number}}} zahlen
 * @returns {{quoteA:number, quoteB:number, veraenderung:number|null, z:number|null, p:number|null, signifikant:boolean}}
 */
export function auswerten({ a, b }, alpha = 0.05) {
  const nA = Math.max(0, Number(a?.gesehen) || 0);
  const nB = Math.max(0, Number(b?.gesehen) || 0);
  const xA = Math.min(Math.max(0, Number(a?.anfragen) || 0), nA);
  const xB = Math.min(Math.max(0, Number(b?.anfragen) || 0), nB);
  const quoteA = nA ? xA / nA : 0;
  const quoteB = nB ? xB / nB : 0;
  const veraenderung = quoteA > 0 ? quoteB / quoteA - 1 : null;
  if (!nA || !nB) return { quoteA, quoteB, veraenderung, z: null, p: null, signifikant: false };
  const gemeinsam = (xA + xB) / (nA + nB);
  const se = Math.sqrt(gemeinsam * (1 - gemeinsam) * (1 / nA + 1 / nB));
  if (!(se > 0)) return { quoteA, quoteB, veraenderung, z: null, p: null, signifikant: false };
  const z = (quoteB - quoteA) / se;
  const p = Math.min(1, 2 * (1 - normalVerteilung(Math.abs(z))));
  return { quoteA, quoteB, veraenderung, z, p, signifikant: p < alpha };
}

/**
 * Benötigte Zahl „gesehen“ je Variante, um eine relative Verbesserung `uplift` der Basisquote
 * `basis` zu erkennen (zweiseitig α = 5 %, Power 80 %). Zum Planen der Testdauer.
 */
export function stichprobeJeVariante(basis, uplift) {
  const p1 = Number(basis);
  const p2 = p1 * (1 + Number(uplift));
  if (!(p1 > 0 && p1 < 1 && p2 > 0 && p2 < 1 && p1 !== p2)) return null;
  const zA = 1.959963984540054;
  const zB = 0.8416212335729143;
  const pq = (p1 + p2) / 2;
  const n = (zA * Math.sqrt(2 * pq * (1 - pq)) + zB * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / (p2 - p1) ** 2;
  return Math.ceil(n);
}
