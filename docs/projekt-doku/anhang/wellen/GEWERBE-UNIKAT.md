# GEWERBE-UNIKAT – /gewerbe als Unikat-Seite (Konzept, Synthese)

Stand: 2026-10-12 · Rolle: Kreativdirektion und Architektur (Synthese aus fünf Expertenkonzepten: Interaktion/Spiel, Datenvisualisierung, Art Direction, B2B-Vertrieb, Verhaltensökonomie) · Status: **Konzept fertig, gemeinsame Dateien angelegt, Bau offen**

Auftrag des Inhabers (12.10.2026, gekürzt): Die Lösungsseiten folgen alle demselben Konzept und haben zu wenig Interaktivität. Jede Seite soll ein Unikat sein, auf Anfragen ausgerichtet und mit Funktionen, Wissen, Grafiken und Animationen, die man entdecken kann. Der Test läuft nur auf `/gewerbe`.


> **ENTSCHEIDUNG DES INHABERS (12.10.2026, 23:55) – geht dem Konzept vor:** „Den Hero-Bereich nicht abweichen von den anderen Seiten, aber alles, was ihr darunter macht, würde super passen.“
> → Oben bleibt der **Standard-Hero der Lösungsseiten** (`PageHero` wie auf /landwirtschaft, /kommunen usw.: gleiches Layout, gleiches Hintergrundbild-Prinzip, H1, Unterzeile, CTAs). Der **Wochen-Puls**, die Rollen-Weiche (Geschäftsführung/Finanzen/Technik), die KapitelSchiene und die DaumenLeiste kommen **direkt darunter** als erstes eigenes Kapitel („Eine Woche Ihres Betriebs“). Alles Weitere unverändert nach Konzept.

---

## 1. Leitidee

**„Ein Betrieb, 35.040 Viertelstunden – eine Seite, die so rechnet wie wir.“**

Die Seite ist ein begehbares Modell eines Gewerbebetriebs. Hauptfigur ist ein offen gekennzeichneter, **synthetischer Beispielbetrieb** (`src/lib/lastgang/beispiel.js`: 2 Schichten Mo–Fr, Samstagvormittag, Betriebsurlaub im August und zum Jahreswechsel, keine Messdaten). Sein Jahr in Viertelstundenwerten treibt jedes Kapitel. Jedes Kapitel schaut mit einer anderen Linse auf denselben Betrieb, und zwar jedes mit einem **eigenen Instrument**:

| Kapitel | Frage | Instrument (Unikat) |
|---|---|---|
| Hero | Was ist anders bei Gewerbe-PV? | Wochen-Puls: eine Woche Last und Sonne als Linie (SVG, nur CSS) |
| K1 Lastgang | Wann braucht der Betrieb Strom? | Lastgang-Teppich: 365 × 96 Viertelstunden als Canvas, mit 5 Linsen |
| K2 Hallendach | Was passt aufs Dach? | Dach-Labor: 3D-Architekturmodell mit Sonnenstand (three.js) |
| K3 Anlagengröße | Wie groß ist sinnvoll? | Knick-Kurve, drei Tagesbänder und E-Flotte |
| K4 kWh-Wert | Was ist eine kWh vom Dach wert? | Röntgen der Stromrechnung: Rechnungszeilen fliegen in einen Wasserfall, dazu die Netzbereichs-Karte |
| K5 Leistungspreis | Warum senkt PV die Spitze kaum? | Spitzen-Uhr (24-h-Zifferblatt) und ziehbarer Deckel über 12 Monatstürmen mit Batterie |
| K6 Netzanschluss | Ab wann wird es aufwendig? | Logarithmisches Lineal (DC und AC) und mitwachsendes Einlinienschaltbild |
| K7 Wirtschaftlichkeit | Hält die Rechnung? | Rechenweg als Live-Tabelle (Pult) und 25-Jahre-Fächer mit Stresstest |
| K8 Fahrplan | Was passiert wann? | Fahrplan mit Abhängigkeits-Schloss und Projektsteckbrief als Deckblatt |

Jede Entscheidung, die man beim Ausprobieren trifft (Dachart, kWp, Netzbereich, Deckel, Montagefenster …), wandert in den **Projektsteckbrief** (`_steckbrief.js`). Am Ende füllt er die Anfrage vor. Der stärkste und ehrlichste Lead-Hook lautet: **„Legen Sie Ihren eigenen Lastgang darüber.“** Nach bestätigter E-Mail (Lead-Gate `lastgang-analyse`, Stufe 2) rechnen K1, K3 und K5 im Browser mit den eigenen Viertelstundenwerten. Die Datei bleibt dabei im Arbeitsspeicher.

Belohnt wird mit **Erkenntnis**, nicht mit Gamification: Es gibt keine Punkte, kein Konfetti, keine Countdowns. Erkenntnis-Sätze erscheinen erst, wenn die Interaktion den passenden Zustand erreicht, und K8 sammelt sie im Steckbrief (`ERKENNTNISSE` in `_tokens.js`).

### Die Pointen (Probelauf 12.10.2026 mit den Projektbibliotheken, Node)

| Wert | Beispielbetrieb (synthetisch) |
|---|---|
| Jahresverbrauch | 884 MWh |
| Jahresspitze | 312 kW am Fr 05.12.2025 um 06:15 |
| Monatsspitzen | **alle 12 um 06:00 oder 06:15 (Schichtbeginn)**, Mittel 291,5 kW |
| Grundlast (5-%-Quantil) | 34 kW · Benutzungsdauer 2.838 h · 10,8 h/Jahr über 90 % der Spitze |
| Anteil an Sa/So/Feiertagen | 14 % des Stroms |
| Empfehlung bei 80 % Eigenverbrauch (Linz) | Ost-West 280 kWp (EV 80 %, Autarkie 24 %) · Süd 230 kWp · Flach 250 kWp |
| Größen | 100 kWp 95/10 % · 200 kWp 86/18 % · 300 kWp 79/25 % · 400 kWp 70/30 % · 600 kWp 57/36 % (EV/Autarkie) |
| Überschuss bei 280 kWp | 52 MWh, davon **88 % an Sa/So/Feiertagen und im Betriebsurlaub** |
| PV 280 kWp gegen Leistungspreis | Mittel der Monatsspitzen 291,5 → 289,1 kW (−2,4 kW) |
| Speicher (peak.js) | Deckel 265 kW: 50 kW/30 kWh, ≈ 1.745 €/a · 235 kW: 80 kW/55 kWh, ≈ 3.720 €/a · 230 kW: 85 kW/55 kWh, ≈ 4.050 €/a · 190 kW: 125 kW/350 kWh, ≈ 6.690 €/a (NE 6 OÖ, 65,88 €/kW/a) |
| Halle 60 × 100 m | Nutzfläche 4.590 m² (Rand 10 %, Hindernisse 15 %) → Ost-West ≈ 655 kWp/617 MWh, Süd ≈ 460 kWp/478 MWh |
| TOR | 280 kWp → 243 kVA (Typ A, knapp) · plus Speicher 85 kW → 328 kW (243 + 85) → **Typ B** |
| Rechenbeispiel (Tabelle) | 300 kWp, 14,64 ct gegenüber 6,0 ct (× 2,4), ≈ 34.360 €/a, ≈ 6,1 J., IFB ≈ 10.600 € (Differenz 22 % zu 15 % ≈ 3.380 €) |
| Marktwert Mittagsstrom | PV-Referenzmarktwert (E-Control): April 2026 1,70 ct, Jänner 2026 13,95 ct |

**Eine Wahrheit:** Das Rechenbeispiel der Tabelle (300 kWp, 70 % EV, 1.050 kWh/kWp, Innviertel) und das Stundenmodell des synthetischen Lastgangs (Linz, Ost-West, 942 kWh/kWp) sind zwei offen benannte Sichten auf das Projekt. K3 startet mit der Modell-Empfehlung (280 kWp) und zeigt einen Strich „Rechenbeispiel 300 kWp“. K7 startet mit dem Rechenbeispiel und bietet per Chip die Werte aus K2 und K3 an. Wo beide Sichten abweichen, erklärt das ein Satz.

---

## 2. Dramaturgie und Bühnenfolge

Drei Akte, wechselnde Bühnen (dunkel = Daten/Spiel, hell = Lesen/Rechnen). Ein dunkles Kapitel folgt nie direkt auf ein dunkles.

| # | Anker | Ton | Akt |
|---|---|---|---|
| Hero | `#start` (Section) | dunkel (navy-950) | I Verstehen |
| Kurzantwort | `#kurzantwort` | sand | |
| K1 | `#lastgang` | dunkel | I |
| K2 | `#hallendach` | sand | I |
| K3 | `#eigenverbrauch` | dunkel | II Gestalten |
| K4 | `#kwh-wert` | weiß | II |
| K5 | `#leistungspreis` | dunkel | II |
| K6 | `#netzanschluss` | sand | II |
| IfbHinweis (unverändert, blendet sich nach 31.12.2026 aus) | – | – | |
| K7 | `#wirtschaftlichkeit` | weiß | III Entscheiden |
| K8 | `#fahrplan` | dunkel | III |
| BranchenReferenzen (unverändert, nur freigegebene) · FAQ `#faq` · Querverweise · UnsereZusagen · Ansprechpartner · CtaBand · Bildnachweis | | | |

Jedes Kapitel hat denselben **Takt**: (1) Rollen-Frage als Eyebrow, (2) H2 mit Suchbegriff, (3) Instrument in einem sinnvollen Startzustand, das in unter 2 s ohne Anleitung reagiert, (4) Erkenntnis-Satz nach der Interaktion, (5) Wissens-Schublade (`<details>`, Fachtext und HTML-Tabellen für SEO), (6) Kapitel-Ausgang mit genau einem primären und höchstens einem sekundären CTA. Die Einwände wandern als Fußnote ins passende Kapitel (dach-alt → K2, strompreise → K4, netz-voll → K6, zu-teuer/amortisation/foerderung-unsicher/strompreise/technik-warten → K7-Prüfstand, keine-zeit/servicepartner/entfernung/contracting/drei-angebote → K8). Sie ersetzen den langen Akkordeon-Block.

Länge: mobil ≤ 28.000 px (heute 32.576 px). Jedes Kapitel ist mobil ≤ 2.600 px hoch, die Schubladen sind geschlossen.

---

## 3. Gemeinsame Gestaltung (verbindlich für alle Kapitel)

**Haltung:** Messinstrument statt Spielplatz. Hochwertig, ruhig, präzise. Haarlinien, tabellarische Ziffern, Direktbeschriftung an der Kurve statt Legenden, viel Luft. Jedes Kapitel hat seine **eigene Komposition und sein eigenes Instrument**. Gemeinsam sind nur Kopf, Schublade, Ausgang, Pillen, Farben und Bewegung.

**Farben** (nur CD-Tokens, Hex in `_tokens.js` → `FARBE`, Bedeutungen → `BEDEUTUNG`; eine Farbe hat seitenweit genau eine Bedeutung):
- Blau (navy-300 auf dunkel, navy-500 auf hell): Verbrauch, Netzbezug
- ov-Grün (ov-400 dunkel / ov-600 hell): Sonne selbst genutzt, Eigenverbrauch, Werte der selbst genutzten kWh
- sun-300: Überschuss, Einspeisung · sun-500: Lastspitze, Leistungspreis. Beide als Text oder Linie **nur auf Navy**. Auf Hell nur als Fläche mit dunkler Direktbeschriftung (sun-500 auf Weiß hat ≈ 2:1)
- Heatmaps: `LAST_RAMPE` / `LAST_PALETTE` (navy-950 → Weiß, Helligkeit monoton, ohne Grün und Amber) aus `_farbe.js`
- Haarlinien 1 px, 8 % Deckkraft (`BEDEUTUNG.raster`)

**Typografie:** H2 `ov-h2` (Manrope 800), Eyebrow 12,5 px uppercase tracking .16em in ov-700 (hell) oder ov-300 (dunkel) mit Nummer „01“ bis „08“. Zahlen sind immer `ov-num`, Einheiten 0,55 em, ink-500 bzw. white/60. Fließtext Inter 15–16 px, max. 65 Zeichen.

**Pillen, Tabs, Segmente:** gefüllt (`Segment` in `_gestaltung.js`: bg-ink-100 oder bg-white/[0.07], aktiv navy-950 oder weiß), **nie umrahmt**. Buttons über `Button` (ui) und `KapitelAusgang`. Sekundäre CTAs sind gefüllt (bg-ink-100 bzw. bg-white/10), nicht `secondary` mit Ring.

**Bewegung** (`BEWEGUNG`): Einblenden 600 ms ease-out-expo `[0.16, 1, 0.3, 1]`, y höchstens 12 px, Stagger 60 ms. Zustandswechsel 320 ms. Federn steif ohne Überschwingen. Zahlen gleiten (`Zahl` und `useZahlGleiten`, 420 ms). Kein Pulsieren, kein Blinken, keine Dauerschleifen außerhalb des Bildes (`useImSichtfeld({ einmal: false })`). `prefers-reduced-motion` ⇒ sofort Endzustand, keine Partikel, kein Pfad-Zeichnen, keine Flüge (motion: `<MotionConfig reducedMotion="user">`).

**Interaktion:** Jede Direktmanipulation hat ein natives Gegenstück: `input type=range` mit `aria-valuetext`, Radiogruppe (`Segment`), `select`, `button`. Griffe sind mindestens 44 × 44 px groß (mobil 48). Tastatur über `useTastenRegler`: Pfeile, Bild auf/ab, Pos1, Ende. Ausgaben stehen in `<output>` bzw. `aria-live="polite"`, gedrosselt mit `useAnsage`. `touch-action: pan-y` auf allen Canvas- und SVG-Flächen. Scrollen wird nie gefangen, kein Zoom per Rad. Horizontales Ziehen gibt es nur an ausdrücklichen Griffen. Häufige Ereignisse laufen über `useProBild`.

**Kapitel-Muster (Dateien):**
1. `KxName.js`: **Server-Komponente** (default export, keine Props außer Hero/v). Sie rendert `KapitelBuehne`, `KapitelKopf`, den statischen Startzustand oder `GrafikPlatz` mit `figcaption`, die `Wissensschublade` mit Tabellen und den `KapitelAusgang`. Zahlen kommen aus `beispielServer()` (`_server.js`) bzw. `BEISPIEL_ERGEBNIS`.
2. `KxInsel.js`: winziger Client-Wrapper. Er nutzt `next/dynamic({ ssr: false, loading: PlatzhalterAnzeige })` und `InselRahmen`, lädt die Bühne also erst in Bildschirmnähe (1,5 Bildschirmhöhen vorher) und zeigt bis dahin den SSR-Platzhalter in gleicher Größe (kein CLS).
3. `KxBuehne…js`: die interaktive Client-Bühne mit motion, d3 und Canvas. Sie bekommt Daten über `useGewerbeDaten()` (Worker) und Steckbrief über `useSteckbrief()`.
4. Optional `KxName.module.css` (Keyframes, keine globalen Selektoren).

```js
// KxInsel.js
"use client";
import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";
const Buehne = dynamic(() => import("./KxBuehne"), { ssr: false, loading: PlatzhalterAnzeige });
export default function KxInsel({ platzhalter, ...props }) {
  return <InselRahmen platzhalter={platzhalter}><Buehne {...props} /></InselRahmen>;
}
```

**Einheitliche Bausteine** (`_bausteine.js`, server- und clienttauglich): `KapitelBuehne`, `KapitelKopf`, `QuellePille`, `Kennzeichnung`, `Erkenntnis`, `Wissensschublade`, `KapitelAusgang`, `DatenTabelle`, `GrafikPlatz`, `Kennwert`.

**Mobil:** Grafiken haben eigene Hochkant-Varianten (Teppich gedreht, Uhr 340 px, Lineal vertikal oder gestaucht). Bedienelemente liegen unter der Grafik in der Daumenzone. Die seitenweite `DaumenLeiste` (Hero) trägt den Haupt-CTA. 16–20 px Rand, kein horizontales Scrollen der Seite.

---

## 4. Architektur und gemeinsame Dateien (bereits angelegt, 12.10.2026)

Alle unter `src/components/GewerbeUnikat/`. Sie sind durch ESLint geprüft. Die reinen Module sind in Node getestet (Werte siehe Abschnitt 1). Bau-Agenten **ändern diese Dateien nicht**. Fehlt etwas, meldet der Bau-Agent das und behilft sich im eigenen Kapitel.

| Datei | Art | Inhalt |
|---|---|---|
| `_tokens.js` | rein (Server+Client) | `FARBE`, `BEDEUTUNG`, `LAST_RAMPE`, `BEWEGUNG`, `EBENE`, `BREITE`, `STAND`, `KENNZEICHNUNG`, `QUELLE` (ElWG, SNE-G-V-Entwurf, ARG), `KAPITEL`, `ROLLEN`, `ERKENNTNISSE`, `SEITENVERHAELTNIS`, `zahl()`, `euroRund()`, `prozent()` |
| `_beispiel.js` | rein | `BEISPIEL` (Annahmen des Rechenbeispiels), `rechenweg(p)`, `BEISPIEL_ERGEBNIS` (≈ 34.360 €/a, 6,1 J., 10.600 €) |
| `_farbe.js` | rein | `LAST_PALETTE` (48 Stufen), `lastStufe(kw, max)` (Wurzel-Skala), `SONNE_RGB`, `rampe()`, `hexZuRgb()`, `rgba()` |
| `_bausteine.js` | ohne Hooks | statische Bausteine (siehe oben) |
| `_gestaltung.js` | `"use client"` | `useReduzierteBewegung`, `useMobil`, `useTouch`, `useSchwachesGeraet`, `useImSichtfeld`, `useNaehe`, `NahInsel`, `InselRahmen`, `PlatzhalterAnzeige`, `useLeerlauf`, `useProBild`, `useAnsage`, `useZahlGleiten`, `Zahl`, `Erscheinen`, `useTastenRegler`, `Segment` |
| `_steckbrief.js` | `"use client"` | Steckbrief-Store (`useSteckbrief`, `steckbrief.setze/erkenntnis/zuruecksetzen`, `STECKBRIEF_START`), Links `anfrageUrl`, `rechnerUrl`, `steckbriefQuery` (`?sb=1&…`, Rückkehr über das Lead-Gate), `bausteinZahl` |
| `_rechnen.js` | rein (Worker, Server, Node) | `beispielLastgang`, `lastgangAusBytes`, `lastAufbereiten`, `pvAufbereiten`, `kappTabelle`, `monatsspitzenMitPv`, `wochenPuls`, `kennzahlen` |
| `_lastgang.worker.js` | Web Worker | rechnet Beispiel oder eigene Datei, danach PV und Kappungstabelle |
| `_daten.js` | `"use client"` | `useGewerbeDaten()`, `vorwaermen()`, `pvSetzen(ortId, ausrichtung)`, `eigeneDateiAuswerten(file, { freigegeben })`, `zumBeispiel()`, `AUSRICHTUNG_FUER_DACHART`; Rückfall in den Hauptthread |
| `_server.js` | nur Server | `beispielServer()`: `kennzahlen`, `puls` (Wochen-Puls), `groessen` (K3-Tabelle), `monatsspitzenMitPv`, `kappung` (K5-Tabelle, NE 6 OÖ), `tagesgang`, `dauerlinie`, `ueberschussRuhe` (0,88) – einmal je Prozess, ≈ 0,5 s, serialisierbar (≈ 25 KB) |

**Server/Client-Regel:** Server-Komponenten importieren nur `_tokens`, `_beispiel`, `_farbe`, `_bausteine`, `_server`. `_gestaltung`, `_steckbrief` und `_daten` nur aus Client-Dateien. `_rechnen` nie direkt in Client-Bühnen (zieht den Parser ins Bundle). Ausnahme: `monatsspitzenMitPv` darf eine Bühne als kleine Kopie selbst rechnen oder per `import("./_rechnen.js")` im Leerlauf laden.

**Datenfluss:** Der Hero ruft `vorwaermen()` im Leerlauf auf → Worker (≈ 0,5–1 s) → `useGewerbeDaten()` liefert `{ status, quelle, last, pv, kapp }` an K1, K3, K5 und K8. K2 ruft `pvSetzen()` bei Ort- oder Dachartwechsel (K3 und K5 folgen). K1 ruft nach bestätigtem Gate `eigeneDateiAuswerten()` auf, dann rechnen alle Kapitel mit `quelle: "eigen"`.

---

## 5. Bibliotheken (Installation nur durch den Vorlauf-Agenten, exakte Version ≥ 2 Wochen alt pinnen)

| Paket | Version (exakt gepinnt) | Lizenz | Zweck | Kapitel |
|---|---|---|---|---|
| `motion` (Import `motion/react`) | **12.43.0** (28.07.2026) | MIT | `LazyMotion` + `m` + `domAnimation`: Einblenden, Zustandswechsel, Federn, `AnimatePresence`; `domMax` nur in K4 (layoutId-Flug Rechnung → Wasserfall); `useScroll`/`useTransform` in K8 (Fahrplan-Linie) | K1, K3, K4, K5, K6, K7, K8 (nicht Hero) |
| `three` | **0.186.1** (24.09.2026) | MIT | 3D-Architekturmodell der Halle, ein DirectionalLight mit Schatten, `InstancedMesh`. Imperativ, ohne react-three-fiber/drei. Nur per dynamischem Import in K2 | K2 |
| `d3-shape` | **3.2.0** (2022) | ISC | `arc` (Spitzen-Uhr), `area`/`line` mit `curveMonotoneX` (Knick-Kurve, Tagesbänder, Grenznutzen, Fächer, Tageskurve) | K2, K3, K5, K7 |
| `d3-scale` | **4.0.2** (2021) | ISC | `scaleLinear`, `scaleLog` (Lineal), `scaleBand` (Monatstürme) | K3, K5, K6, K7 |

### Installation und Prüfung (Vorlauf-Agent, 12.10.2026)

- Befehl: `npm install --save-exact motion@12.43.0 three@0.186.1 d3-shape@3.2.0 d3-scale@4.0.2` → vier Einträge in `dependencies` ohne `^`. Keine andere Version im Lockfile geändert (Vergleich `package-lock.json` vorher/nachher): Next 15.5.27, React/React-DOM 19 und alle übrigen Pakete unverändert.
- **Versionswahl:** Jede Version ist ≥ 14 Tage alt (Veröffentlichungsdatum aus `npm view <paket> time`). `motion` bleibt bewusst auf der Linie **12.x** (letzte 12er: 12.43.0). Die neueren Hauptversionen 13.x/14.x (14.0.0 vom 02.10.2026, 14.1.0 vom 09.10.2026) sind jünger als 14 Tage bzw. bringen einen Hauptversionssprung; ein Wechsel ist erst nach Prüfung der Änderungsliste sinnvoll. `three` 0.186.1 ist die aktuelle Version (18 Tage alt). `d3-shape` 3.2.0 und `d3-scale` 4.0.2 sind die aktuellen, seit Jahren stabilen Versionen der D3-Modulreihe.
- **Mitinstalliert (15 Pakete, alle ≥ 14 Tage alt):** `framer-motion` 12.43.0, `motion-dom` 12.43.0, `motion-utils` 12.39.0 (alle MIT); `d3-path` 3.1.0, `d3-array` 3.2.4, `d3-color` 3.1.0, `d3-format` 3.1.2, `d3-interpolate` 3.0.1, `d3-time` 3.1.0, `d3-time-format` 4.1.0, `internmap` 2.0.3 (alle ISC). `tslib` 2.8.1 (0BSD) war schon vorhanden.
- **Lizenzen:** Alle Lizenzen sind MIT bzw. ISC (geprüft über das `license`-Feld und die `LICENSE`-Datei in `node_modules`). Kommerzielle Nutzung ist erlaubt. Pflicht ist nur der Erhalt des Copyright-Hinweises; er steht in den ausgelieferten Paketen.
- **Kompatibilität:** `motion`/`framer-motion` nennen als Peer `react`/`react-dom` `^18 || ^19` (optional). `@emotion/is-prop-valid` ist ein optionaler Peer und wird nicht gebraucht. `three` hat keine Abhängigkeiten. Die D3-Module sind reines ESM mit `sideEffects: false` und lassen sich im Bundle gut kürzen. Keines der Pakete hat Install-Skripte.
- **Größe (Richtwert):** Entpackt sind es: `motion` 0,7 MB + `framer-motion` 4,8 MB + `motion-dom` 3,5 MB, `three` 20,4 MB, `d3-shape` 0,25 MB, `d3-scale` 0,17 MB. Im Bundle zählt aber nur, was importiert wird. Bei `three` ist das vollständige ESM-Bundle (`three.core.js` + `three.module.js`) minifiziert und gzip-komprimiert **≈ 190 KB** groß (eigene Messung mit terser + gzip -9, ohne Tree-Shaking, also Obergrenze). Deshalb wird es **nur** per `import("three")` in K2 geladen, nach `useNaehe` und WebGL-Prüfung. Bei motion sind laut Hersteller `LazyMotion` + `m` ≈ 5 KB, `domAnimation` ≈ +15 KB und `domMax` ≈ +25 KB (gzip). `domMax` wird deshalb nur in K4 nachgeladen.
- **Sicherheit:** Die Prüfung `npm audit --omit=dev --audit-level=high` meldet **0 Befunde**. Ein volles `npm audit` meldet weiter 7 bekannte Befunde in Dev-Abhängigkeiten (`braces` über `eslint-config-next`, `uuid` über `exceljs`). Das Lockfile vor der Installation hatte genau dieselben Befunde (R-80); sie kommen also nicht von den neuen Paketen.
- **Tests:** `node scripts/alle-tests.mjs`: 41/41 Dateien grün, 13,7 s.
- **Rauchtest** (Node 24.21, ESM-Einstieg wie im Bundler, Skript im Scratchpad `gewerbe/vorlauf/rauchtest.mjs`): Aus `motion/react` sind `LazyMotion`, `m`, `domAnimation`, `domMax`, `AnimatePresence`, `MotionConfig`, `useScroll`, `useTransform` und `useReducedMotion` vorhanden, `motion/react-m` liefert `m.div`. `three` meldet `REVISION 186`, `InstancedMesh` ist anlegbar, `WebGLRenderer` und `HemisphereLight` sind vorhanden. `d3-shape` erzeugt `arc`, `line` und `area` mit `curveMonotoneX`. `d3-scale` liefert `scaleLinear`, `scaleLog` (20 → 5.000) und `scaleBand` (12 Bänder).
- **Dev-Server:** Port 3003 läuft weiter mit webpack und antwortet auf `/gewerbe` mit 200. Neue Pakete löst webpack erst beim ersten Import auf; ein Neustart ist nicht nötig. Nur wenn auf 3003 „Module not found: three/motion/d3-…“ erscheint, wird zusätzlich ein Dev-Server auf Port 3004 gestartet (`NEXT_DIST_DIR=.next-dev3`, `npx next dev -p 3004 -H 127.0.0.1`).

**Import-Regeln für die Bau-Agenten:**
- `import { LazyMotion, domAnimation, m, AnimatePresence, MotionConfig } from "motion/react"`. Immer `m.*` statt `motion.*` verwenden, sonst wird das volle Paket geladen, und immer `<MotionConfig reducedMotion="user">`. `domMax` nur in K4: Es wird in der K4-Bühnendatei importiert, die per `next/dynamic` geladen wird, und landet so im K4-Chunk. Alternativ geht eine eigene Datei `export { domMax as default } from "motion/react"`, eingebunden über `LazyMotion features={() => import("./…").then(r => r.default)}`. Ein `import("motion/react")` ohne eigene Datei trennt `domMax` nicht vom Hauptbundle.
- `three` nur in `K2Szene3D.js` per `await import("three")`. Die Datei hängt an `next/dynamic` mit `ssr: false`. Kein statischer Import, auch keiner nur für Typen oder Konstanten.
- D3 nur benannt importieren (`import { arc, area, line, curveMonotoneX } from "d3-shape"`, `import { scaleLinear, scaleLog, scaleBand } from "d3-scale"`). Die Module sind servertauglich, also dürfen Pfade für statische Grafiken auch in Server-Komponenten entstehen.

**Bewusst nicht:** `gsap` (motion deckt Scroll-Kopplung und Layout ab, ein Paket weniger), `lenis` (Scroll-Hijacking schadet Barrierefreiheit, INP und Mobilgefühl), `@react-three/fiber` und `drei` (für eine Szene nicht nötig, spart rund 60 KB und Abhängigkeiten), `d3-interpolate` direkt (Farbrampe in `_farbe.js`). Der Hero lädt **keine** Bibliothek.

---

## 6. Seitenaufbau `src/app/gewerbe/page.js` (Zusammenbau)

Server-Komponente, `metadata` unverändert (Titel, Beschreibung, canonical, OG). `const v = zielgruppenVariante("gewerbe", await searchParams)`.

```
<div data-variante={v.id} data-seite="gewerbe-unikat">
  <LoesungSchema … unverändert (bild = HERO_BILD bleibt im JSON-LD) />
  <FoerdercallHinweis />
  <Hero v={v} />                 // inkl. Kurzantwort, Rollen-Weiche, DaumenLeiste, KapitelSchiene
  <K1Lastgang />  <K2Hallendach />  <K3Anlagengroesse />  <K4KwhWert />
  <K5Leistungspreis />  <K6Netzanschluss />
  <IfbHinweis />
  <K7Wirtschaftlichkeit />  <K8Fahrplan />
  <BranchenReferenzen zielgruppe="industrie" />
  <Section id="faq" tone="white"> SectionHeading + <Faq items={FAQ} /> </Section>
  <Querverweise pfad="/gewerbe" ueberschrift="Vertiefen: Wirtschaftlichkeit, Technik & Recht" />
  <UnsereZusagen rahmen />  <Ansprechpartner zielgruppe="gewerbe" rahmen />
  <CtaBand … wie bisher (primary v.cta → /termin?art=video&thema=gewerbe, secondary Anfrage mit Lastgang) />
  <Bildnachweis items={nachweise("flachdachDornbirn")} />   // nur tatsächlich genutzte Bilder
</div>
```

Entfällt auf /gewerbe (bleibt für die anderen Seiten unverändert): PageHero, FachTabs, KennzahlenBand, FotoBento, LastprofilExplorer, RechnerLeiste, TechnikSystem, AblaufLeiste, W24KwhWert, KostenDesWartens, EinwandKarten, PreisAnker. Inhalte (Texte, Tabellen) wandern in die Kapitel.

FAQ: Die 8 bisherigen Fragen bleiben wörtlich. Neu kommen hinzu: „Wie groß sollte die PV-Anlage für unseren Betrieb sein?“ (Werte aus `beispielServer()`: 280 kWp Ost-West Linz ≈ 80 % EV, synthetisch) und „Ab wann gilt für eine PV-Anlage TOR Typ B?“ (250 kW AC am Netzanschlusspunkt inkl. Speicher-WR und Bestand; Parkregler über `PARKREGLER_SATZ`).

### Zusammenbau (13.10.2026, Lead-Entwicklung)

- **Seitenkopf nach Inhaber-Entscheidung:** `page.js` rendert oben den Standard-`PageHero` (immersive, `HERO_BILD`, Breadcrumbs, H1 wörtlich, Unterzeile `v.titel v.akzent` + `v.lead`, CTAs `v.cta` → `/angebot?objekt=gewerbe` und „Eigenen Lastgang darüberlegen“ → `#lastgang`, vier Punkte). `Hero.js` rendert **keine H1 mehr**, sondern die dunkle Bühne `#start` direkt darunter (H2 „Eine Woche Ihres Betriebs“, Wochen-Puls, Rollen-Weiche), danach Kurzantwort, DaumenLeiste, KapitelSchiene. Die `.h1`-Regeln in `Hero.module.css` entfallen.
- **DaumenLeiste:** Ohne `#hero-cta` beobachtet sie den Seitenkopf (`[data-blk="seitenkopf"]`) und erscheint, sobald er samt CTAs aus dem Bild ist.
- **CLS-Reserve im Seitenkopf (nur /gewerbe, `SEITENKOPF_CSS` in `page.js`):** Die Ersatzschrift bricht die H1 bei 358–402 px und 448–504 px eine Zeile früher um als Manrope (gemessen 320–1920 px in Chromium). Mindesthöhe der H1 in diesen Bändern; zusätzlich Ausrichtung oben (der Inhalt ist auf /gewerbe in jeder Breite höher als die Mindesthöhe, das fertige Bild bleibt gleich), damit ein halb geladener Seitenkopf bei langsamem Netz nicht springt. CLS mobil 0,14 → 0,0585 (10/10 Läufe), vorher in etwa jedem zehnten Lauf 0,18.
- **FAQ** (`#faq`, `data-kapitel="faq"`): 8 + 2 Fragen, Schema nur über `Faq`; links Überschrift (ab lg sticky) und drei gefüllte Links „Vor dem Erstgespräch“ (Lastgang-Analyse, Förder-Check, Standort-Check) statt der entfallenen RechnerLeiste.
- **Bildnachweis** nur `flachdachDornbirn` (Projektsteckbrief in K8). Vorschau-Routen `src/app/gewerbe-vorschau/` gelöscht. `scripts/verkauf.test.mjs`: Die Prüfung „/gewerbe nutzt KostenDesWartens mit quelle=beispiel“ greift nur noch, wenn der Baustein dort wieder eingebunden wird.
- **Messung** (Produktions-Build `.next-verify`, :3002, Playwright Chromium): mobil 390 × 844 mit CPU 4× und Fast 3G (562,5 ms, 1,44 Mbit/s): FCP 2,7–3,4 s, LCP 3,9–4,9 s (Median ≈ 4,4 s, LCP-Element = Foto des Seitenkopfs), CLS 0,0585; Vergleich /landwirtschaft (gleicher PageHero): LCP 4,0–5,3 s (Median ≈ 4,1 s). Das LCP-Ziel 2,5 s ist in diesem Profil seitenweit nicht erreichbar: Die globale CSS (63 KB gz, render-blockierend) ist erst nach ≈ 2,7 s da. Desktop 1440 ohne Drossel: LCP ≈ 1,2 s, CLS 0,005 (inkl. Durchscrollen). JS beim Laden 223 KB gz (Desktop, ohne Prefetch) bzw. 262–297 KB (mobil); nach Durchscrollen aller Inseln 733 KB gz, davon three.js 189 KB (nur K2) und motion 45 KB. HTML 2,09 MB roh / 531 KB über die Leitung (Next-gzip, gestreamt) – etwa doppelt so viel wie /landwirtschaft; Hauptanteil sind die SSR-Startzustände der Kapitel K2–K8 (je 77–132 KB roh, plus gleich großer RSC-Anteil). Seitenhöhe mobil 33.217 px inkl. Fußzeile 3.171 px (Ziel 28.000 nicht erreicht; K6 2.787 px > 2.600).

### Feinschliff nach Jury (13.10.2026, Lead-Entwicklung)

Grundlage: zwölf Jury-Befunde (2 × hoch, 8 × mittel, 1 × Info, 1 × bestanden) und sechs Top-Verbesserungen. Umgesetzt wurde, was schnell und ohne Risiko für die geteilten Bausteine machbar war. Geteilte Bausteine (Loesungen/*, Verkauf/*, Referenzen/*, PageHero, LeadGate, Konfigurator) sind unverändert.

**Umgesetzt**

- **Daumenleiste iPhone (hoch):** `DaumenLeiste.js` misst die Sichtbarkeit bei jedem gedrosselten Scroll-, Größen-, `scrollend`-, `pageshow`- und Sichtbarkeits-Ereignis direkt per `getBoundingClientRect` (≤ alle 100 ms im nächsten Bild plus Nachlauf nach 180 ms). Der IntersectionObserver ist nur noch zusätzlicher Auslöser. Damit gibt es keinen veralteten Zustand „Footer darüber“ mehr. Geprüft in WebKit (iPhone 14): Footer → „Nach oben“ → Sprung auf y = 5.600 ergibt `sichtbar`, ebenso Footer → y = 9.000. Am Steckbrief tritt die Leiste zurück.
- **Tablet:** Die Daumenleiste steht nur noch unter `md`. Ab `md` trägt die Kopfzeile den CTA, die globale MobileCta bleibt bis `lg` aus. „Nach oben“ tritt nur unter `md` zurück (`SEITEN_CSS` in `Hero.js`). Der K8-Fahrplan erscheint ab `md` als Zeitleiste statt als Handy-Akkordeon (`K8FahrplanAnsicht`, `K8FahrplanLinie` `QUER_ABFRAGE` 768 px).
- **Erster Bildschirm:** `PageHero` bleibt unverändert. Neu ist `HeroSignatur.js` (Server, ohne JS): eine Wochen-Puls-Karte über dem rechten, textfreien Teil des Fotos (ab `xl`). Sie zeigt die Juniwoche in Stundenwerten mit Last, Sonne genutzt und Sonne übrig sowie die Anlaufspitze und springt zu `#start`. Die Linie zeichnet sich einmal per CSS, bei reduzierter Bewegung steht sofort das Endbild. Auf /gewerbe ersetzt sie den allgemeinen Tagesbogen (`signatur={false}`). Die Puls-Überschrift „Eine Woche Ihres Betriebs“ ist jetzt `ov-h2` und damit so groß wie die Kapitel-H2.
- **Eigene Eröffnung je Kapitel:** `KapitelKopf` hat jetzt `form` und `zier` (`_bausteine.js`). Typografie und Farben bleiben gleich, nur die Komposition wechselt:
  - K1 `ziffer`: große „35.040“
  - K2 `umgekehrt`: H2 zuerst, darunter Frage und Lead
  - K3 `zitat`: Rollen-Frage als Zitat
  - K4 `beleg`: zentriert wie ein Rechnungskopf, ab `md` mit den Rechnungsteilen
  - K5 `uhr`: „06:15“ groß in sun-500, mit Datum und Spitze aus `beispielServer()`
  - K6 `lineal`: Schwelle 250 kW mit ≈ 243 kVA (PV allein) und ≈ 328 kW (mit Speicher-WR)
  - K7 `spalte`: senkrechte Kapitelziffer
  - K8 `weg`: zentriert

  `beleg` und `weg` sind erst ab `md` zentriert, mobil linksbündig. Mobil ist die Zier sparsamer, damit die Kapitel unter 2.600 px bleiben:
  - K1: Ziffer erst ab `md`
  - K4: Rechnungsteile erst ab `md`
  - K5: Uhrzeit mit einer Zeile Kontext; der doppelte Fazit-Satz ist mobil nur für Screenreader
  - K6: Schwelle bleibt; die Bildunterschrift mit derselben Pointe ist mobil nur für Screenreader
- **Verschlanken:** Neuer Baustein `Vertiefen` (`_bausteine.js`). In K3 liegen „Drei Tage im Detail“ mit E-Flotte, „Was Überschuss wert ist“ und „Wohin mit dem Überschuss“ jetzt in einer Schublade. Im SSR-Startzustand stehen dort nur Zusammenfassung und Ersatztext, die Bühne liefert den Inhalt nach. Mobil entfallen die Rechnungsteile im K4-Kopf und der Untertitel der K1-Ziffer.
- **Haupt-CTA vereinheitlicht** (`_cta.js`): „Ersteinschätzung anfragen“ führt überall zu `/angebot?objekt=gewerbe` bzw. zum Steckbrief-Link, mit dem Zusatz „mit oder ohne Lastgang“. Das gilt für Seitenkopf (Standard-Variante; Kampagnen-Varianten behalten ihr Versprechen), Daumenleiste, alle Kapitel-Ausgänge, Steckbrief und CtaBand. Im CtaBand ist der Termin jetzt der klar benannte Zweitweg „Erstgespräch per Video vereinbaren“. `thema=` wird übergeben, wo der Konfigurator es kennt: K1 `lastgang`, K5 `speicher`, K6 `netzanmeldung`, eigener Lastgang `lastgang`, K8 `lastgang` bzw. `speicher`.
- **Lead-Abfluss:** Sekundärwege der Kapitel („Im … Rechner weiterrechnen“, Parkregler, Luftbild-Werkzeug, Videotermin) sind Textlinks statt gleich großer Knöpfe (`KapitelAusgang`). Entfallen sind der zweite Textlink in K2 (Standort-Check, steht bei der FAQ), in K3 (Ladeinfrastruktur) und in K7 (Finanzierung, steht in der Schublade).
- **Eigener Lastgang (Befund nach Gate):** Diese Texte rechnen jetzt mit den eigenen Viertelstunden nach:
  - K1 „Was daraus für die Anlage folgt“ (`K1Folgen` in `K1Live.js`): Monatsspitzen-Zeitfenster, Mittel mit PV, Grundlast, Überschuss an freien Tagen
  - der Kernsatz der K3-Bildunterschrift (`K3Bildtext.js`)
  - das K5-Fazit (`K5Bildtext.js`, Deckel bei 74 % der Jahresspitze aus der Kappungstabelle des Workers, Leistungspreis NE 6 OÖ offen benannt)

  Die Steckbrief-Hinweise zu Anlage, Leistungspreis und Montagefenster nennen bei eigenen Daten „Grau = Beispielbetrieb“ statt synthetischer Fakten. Das Panel-Versprechen ist eingeschränkt: Es nennt nur noch die Kapitel, die wirklich mitrechnen (03, 04, 05, 07, 08).
- **Barrierefreiheit:**
  - Fokus-Rückgabe nach dem K1-Gate-Dialog (`useK1Gate({ fokus })`): auf den nächsten Schritt im Panel bzw. an der Teppich-Ablage
  - Kontraste: K5 `white/45` → `white/60`, außerdem HeroPuls, HeroRollen, K3Woche und der K8-Pfeil; `kontrast-klassen.test` meldet in GewerbeUnikat nichts mehr
- **HTML-Gewicht:**
  - K3-Schublade leicht im SSR
  - K7-Fächer nur noch in der Desktop-Fassung: Mobil war er im Startzustand ohnehin verborgen
  - d3-Pfade in K2-Tageskurve und K7-Fächer auf eine Nachkommastelle (`digits(1)`)

**Messwerte** (Produktions-Build `.next-verify`, :3002, Playwright)

- **HTML /gewerbe:**
  - Gesamt: 2,10 MB → 1,98 MB roh, über die Leitung 532 → 506 KB (Next-gzip, gestreamt)
  - DOM-HTML 972 → 923 KB, RSC-Payload 980 → 921 KB
  - je Kapitel: K3 117 → 72 KB, K7 102 → 90 KB, K2 87 → 83 KB
  - Vergleich /gewerbespeicher: 663 KB roh / 173 KB über die Leitung

  Das Ziel „HTML etwa halbieren“ ist **nicht erreicht**, siehe Offen.
- **JS First Load /gewerbe:** 161 → 164 KB laut Build-Tabelle. Die +3 KB entfallen auf `K1Folgen`, `K3Bildtext`, `K5Bildtext` und die Daumenleiste.
- **Ladezeit mobil** (Chromium 390 × 844, CPU 4×, 150 ms RTT, 1,44 Mbit/s, ohne Consent-Cookie, je 3 Läufe):

  | | /gewerbe | /gewerbespeicher (gleicher Seitenkopf) |
  |---|---|---|
  | LCP (Foto des Seitenkopfs) | 4,0 / 4,3 s | 3,4–4,0 s |
  | FCP | 2,8–3,2 s | – |
  | `load` | 9,4–10,3 s | 6,3–6,8 s |

  Der erste Lauf nach dem Serverstart lag bei 7,5 s, weil die Bildoptimierung kalt war. CLS beim Laden 0,0003–0,0585: Das ist der bekannte H1-Font-Tausch des Seitenkopfs, er liegt unter 0,1. Desktop zeigt die Wochen-Puls-Karte im ersten Bildschirm; LCP bleibt das Seitenkopf-Foto.
- **Seitenhöhe mobil (390 px):** 33.217 → 32.567 px.
  - K1 2.563, K2 2.240, K3 2.569 → 1.876, K4 2.580, K5 2.602, K7 2.418, K8 2.561 px
  - K6 2.784 px, vorher 2.787; mobil noch über 2.600
  - Desktop 1440: 31.254 → 31.179 px
- **Daumenleiste:** Footer → „Nach oben“ → Sprung ergibt `sichtbar` in WebKit iPhone 14 (normal und reduzierte Bewegung) und in Chromium Pixel 7. Auf dem iPad ist die Leiste ausgeblendet (`display: none`).
- **Gate-Fokus:** Nach dem Schließen des Dialogs liegt der Fokus auf „E-Mail bestätigen“, nicht mehr auf `<body>`.
- **K3-Schublade:** Geöffnet zeigt sie Tagesbänder, E-Flotte und Marktwert (Bühne geladen); im SSR steht nur der Ersatztext.
- **K8 bei 768 px:** Die Zeitleiste ist ohne Überlauf lesbar (schmalere Kopfspalte, Silbentrennung).
- **Prüfungen:**
  - ESLint (GewerbeUnikat, /gewerbe) ohne Befund
  - `node scripts/alle-tests.mjs`: 41/41
  - `kontrast-klassen`: 0 Befunde in GewerbeUnikat
  - `NEXT_DIST_DIR=.next-verify next build` grün
  - :3002 neu gestartet (200)

**Offen**

- **Mobil weiter lang:** Die Seite ist mobil noch rund 33.000 px hoch (Ziel 28.000). Weitere Kürzungen brauchen redaktionelle Entscheidungen je Kapitel: K4, K5 und K6 jeweils ≈ 2.600–2.900 px, dazu geteilte Blöcke wie BranchenReferenzen (1.915 px), FAQ, Querverweise und CtaBand.
- **HTML/RSC weiter schwer:** Der größte Teil sind die SSR-Startzustände der Kapitel. Sie stehen einmal im HTML und noch einmal als RSC-Baum. Halbieren ginge nur mit Umbau: Startzustände als Client-Komponenten aus kleinen Daten rendern oder als nicht hydrierte HTML-Inseln ausliefern. Zum Startzustand gehören auch die sieben Stationskarten in K8, die bewusst für SEO bleiben.
- **LCP mobil:** LCP ≤ 2,5 s ist im Drosselprofil weiter nicht nachgewiesen. Die Ursache liegt seitenweit: render-blockierende globale CSS und das Foto des PageHero. Siehe Messwerte.
- **Netzebene im Konfigurator:** `ne=` (K6) wird übergeben, der Konfigurator liest den Wert aber nicht. Eine Vorbelegung braucht eine Änderung an `/angebot`, das ist ein geteilter Baustein.
- **Bewusst nicht umgesetzt:** Der K1-Teppich blendet nicht von selbst auf die Sonnen-Linse. Die Erkenntnis erscheint nur nach einer Interaktion (Takt-Regel), ein automatischer Linsenwechsel würde sie ohne Zutun auslösen.
- **Tablet:** K5 und K7 sind von 768 bis 1.023 px noch einspaltig. Die Kapitel-Schiene erscheint erst ab 1.400 px.
- **Manrope in WebKit:** Unter Windows wirkt Manrope in WebKit dünn, obwohl `font-weight` 800 berechnet ist. Sehr wahrscheinlich liegt das an Playwright-WebKit unter Windows. Einmal auf einem echten iPhone gegenprüfen.

---

## 7. Kapitel-Spezifikationen

> Gemeinsam für alle: Abschnitt 3 (Gestaltung), Abschnitt 4 (Dateien). Jede Zahl trägt Quelle, Stand und „Richtwert“ (`QuellePille`). Pflicht-Kennzeichnungen wörtlich aus `KENNZEICHNUNG`. QA-Anker: `data-kapitel` am Section und `data-testid` an jedem Regler.

### Hero · „Eine Woche Ihres Betriebs“ (H1 unverändert)

**Dateien:** `Hero.js` (Server, `Hero({ v })`), `HeroPuls.js`, `HeroRollen.js`, `DaumenLeiste.js`, `KapitelSchiene.js` (Client, ohne Bibliothek), `Hero.module.css`.

**Ziel:** In 3 s ist klar: „Wir legen nach Viertelstundenwerten aus, nicht nach der Dachfläche.“ Die H1 als Text ist das LCP-Element. Der primäre CTA liegt mobil bei 390 × 844 oberhalb von 700 px.

**Aufbau** (navy-950, `ov-noise`, `ov-grid-bg` dezent, kein Foto): Breadcrumbs (dark, `[{ name: "Gewerbe & Industrie" }]`) → Eyebrow `v.eyebrow` → **H1 wörtlich** „Photovoltaik für Gewerbe und Industrie <span ov-text-gradient-light>in Österreich</span>“ (ohne Einblend-Animation) → Unterzeile `v.titel v.akzent` (font-display bold) → `v.lead` (white/72, mobil `line-clamp-4`, Text bleibt im DOM) → CTA-Zeile `id="hero-cta"`: primär `v.cta` → `/angebot?objekt=gewerbe`, sekundär gefüllt „Eigenen Lastgang darüberlegen“ → `#lastgang`.

**Wochen-Puls** (`<figure data-testid="hero-puls">`, volle Breite, Desktop `aspect-[1200/420]`, mobil `aspect-[390/300]`): Das SVG wird **serverseitig** aus `beispielServer().puls` erzeugt (672 Viertelstunden, Mo 16.6.–So 22.6.2025, PV 280 kWp Ost-West Linz). `viewBox="0 0 672 320"`, `preserveAspectRatio="none"`, Linien mit `vector-effect="non-scaling-stroke"`, y 0 kW = 300, Oberkante = nächste 50 kW über dem Maximum = 20. Ebenen: Lastfläche navy-500/22 %, „Sonne genutzt“ = min(pv, last) in ov-400/85 %, „Sonne übrig“ = pv über last in sun-300/90 %, Lastlinie weiß 1,5 px. Koordinaten auf 1 Nachkommastelle runden. Tageslabels als HTML (% positioniert). Den Feiertag erkennen (raster `typ` 2, kein Sonntag) und benennen (Fronleichnam usw. über `ostersonntag()` aus `src/lib/lastgang/analyse.js`). Direktbeschriftungen als HTML-Overlays: ① „Mo 06:00 · Anlaufspitze 275 kW“ (an `puls.spitze`, sun-500-Punkt mit weißem Ring), ② „Feiertag: Betrieb ruht – die Sonne nicht“, ③ „Grundlast ≈ 34 kW“ (Sonntag), ④ „Sonne trifft Schicht“ (Mi 12 Uhr). Mobil nur ① und ②. Legende als gefüllte Chips.

**Animation** (nur CSS): Die Lastlinie zeichnet sich (`pathLength=1`, Dashoffset 1→0, 1,4 s, Start 0,25 s). Dann wischt die Sonne über die Woche (clip-path inset 100 % → 0, 1,2 s ab 1,3 s). Die Labels folgen gestaffelt ab 2,2 s. Bei reduzierter Bewegung steht sofort der Endzustand.

**HeroPuls (Client)** umschließt das SSR-SVG (children). Er ergänzt ein Fadenkreuz per pointermove und Touch-Drag (`touch-action: pan-y`) mit der Ablesung „Mi 18.6. · 12:15 · Last 182 kW · Sonne 171 kW“. Tastatur: figure `tabIndex=0`, ←/→ 1 h, Umschalt 1 Tag, Esc aus; Ansage über `useAnsage`. Ein Umschalter „Sonne“ (`aria-pressed`) blendet die PV-Ebenen aus. Erreicht der Cursor den Feiertag, folgt `steckbrief.erkenntnis("h-feiertag")`. HeroPuls ruft `vorwaermen()` über `useLeerlauf` auf. figcaption (SSR): „Eine Juniwoche im synthetischen Beispielbetrieb (2 Schichten Mo–Fr): werktags Anlaufspitze um 06:00 (bis 275 kW), mittags deckt eine Ost-West-Anlage mit 280 kWp einen Großteil der Last; am Feiertag und am Wochenende bleibt Sonne übrig. Grundlast ≈ 34 kW.“ Dazu `KENNZEICHNUNG.synthetischKurz` und `pvModell`. Alle Zahlen kommen aus `beispielServer()`.

**Rollen-Weiche** (HeroRollen): „Wo möchten Sie einsteigen?“ mit drei gefüllten Chips (`ROLLEN`). Ein Klick setzt `steckbrief.setze({ rolle })` und scrollt sanft zu: gf → `#eigenverbrauch`, cfo → `#kwh-wert`, technik → `#lastgang`. Vorbelegung ohne Scrollen aus `v.id`: cfo/leistungspreis → cfo, speicher/halle → technik. Nichts wird ausgeblendet. Ereignis `rolle_gewaehlt`.

**Kurzantwort** (`<section id="kurzantwort">`, sand): H2 „Kurz beantwortet: Lohnt sich Photovoltaik für Ihren Betrieb?“ und vier Sätze mit Werten aus `BEISPIEL_ERGEBNIS`: „Ja, wenn Ihr Betrieb tagsüber Strom braucht. Jede selbst genutzte Kilowattstunde spart Energiepreis, Netz-Arbeitsentgelt, Netzverlust und Elektrizitätsabgabe – im Rechenbeispiel (300 kWp, Netzebene 6, Oberösterreich) 14,64 ct netto, rund 2,4-mal so viel wie eine eingespeiste. Daraus ergeben sich ≈ 34.360 € Überschuss im Jahr und ≈ 6,1 Jahre statische Amortisation; der Öko-Investitionsfreibetrag von 22 % wirkt mit ≈ 10.600 € (Anschaffung bis 31.12.2026). Die Größe folgt dem Lastgang, nicht der Dachfläche – den Leistungspreis senken planbar Speicher und Lastmanagement.“ Dazu drei `Kennwert`-Kacheln, die QuellePille „Beispiel · 300 kWp · Netzebene 6 · OÖ · Stand 09/2026 · kein Angebot“ und der Link „Rechenweg prüfen“ → `#wirtschaftlichkeit`. Mobil ≤ 650 px.

**DaumenLeiste** (nur < lg): fixed `bottom-4`, links 72 px (der Rückruf-Knopf bleibt frei), rechts 12 px, Höhe 52 px, rounded-full, ov-600, z 9300, safe-area. Text „Ersteinschätzung anfragen“, bei `bausteinZahl > 0` ergänzt um „· n Werte übernommen“, Link `anfrageUrl(steckbrief)`. Sie erscheint, sobald `#hero-cta` aus dem Bild ist, und verschwindet bei sichtbarem `[data-steckbrief]` (K8) oder CtaBand. Ereignis `daumen_cta`.

**KapitelSchiene** (≥ 1400 px): fixed links 24 px, `<nav aria-label="Kapitel dieser Seite">` mit 8 Punkten (`KAPITEL` k1–k8). Labels erscheinen bei Hover oder Fokus. Den aktiven Punkt bestimmt ein IntersectionObserver auf `[data-kapitel]`. Die Kapitel der gewählten Rolle tragen einen ov-Punkt „für Sie“. Unten steht „Steckbrief n/7“ → `#fahrplan`. Sichtbar erst nach dem Hero.

**Leistung/Recht/QA:** kein Gate. Client-JS der Hero-Inseln ≤ 20 KB gz. Der Hero ist ≤ 35 KB HTML. Keine Bibliothek. H1 und Zielgruppentexte bleiben unverändert. `data-kapitel="hero"`, testids `hero-puls`, `rolle-gf|cfo|technik`, `daumen-leiste`, `kapitel-schiene`. Das SSR-HTML enthält „275 kW“ und „34 kW“.

### K1 · Lastgang-Teppich · „Lastgang verstehen: 35.040 Viertelstunden sind der Fingerabdruck Ihres Betriebs“

**Dateien:** `K1Lastgang.js` (Server), `K1Insel.js`, `K1Teppich.js` (Client), optional `K1EigenerLastgang.js`, `K1Lastgang.module.css`. Ton **dunkel**, `#lastgang`, `data-kapitel="k1"`.

**Kopf:** „01 · Technik fragt: Wann braucht unser Betrieb den Strom wirklich?“, H2 wie oben, Lead „Ein Lastgang zeigt jede Viertelstunde eines Jahres. Darin steckt, was die Anlage später entscheidet: Schichtbeginn, Pausen, Wochenenden, Betriebsurlaub und Grundlast.“

**Instrument:** Ein Canvas-Teppich mit dem Beispielbetrieb (oder dem eigenen Lastgang). Desktop: x = 365 Tage, y = 00–24 Uhr (oben 00:00), `aspect-[365/144]`. Mobil **hochkant**: x = 96 Viertelstunden, y = 365 Tage, `aspect-[96/146]`. Zeichnung: ImageData 365×96 (bzw. 96×365) mit `LAST_PALETTE[lastStufe(kw, max)]`, per `drawImage` mit `imageSmoothingEnabled=false` DPR-genau skaliert (NaN-Zellen = navy-950). Monatslabels und Stundenmarken (00/06/12/18/24) als HTML.

**Fünf Linsen** (`Segment`, Radiogruppe; Überblendung zweier gestapelter Canvas 320 ms; der Erkenntnis-Satz kommt per `AnimatePresence`):
1. **Jahr**: volle Rampe. „Jahresspitze 312 kW am Fr 5. Dezember um 06:15 – beim Schichtbeginn.“
2. **Schichtbeginn**: Band 05:45–06:45 hell, Rest auf 25 % abgedunkelt. Die 12 Monatsspitzen erscheinen als sun-500-Punkte mit weißem Ring (SVG-Overlay). Erkenntnis `k1-schichtbeginn`: „Alle 12 Monatsspitzen liegen zwischen 06:00 und 06:15 Uhr.“ Die Spanne wird gerechnet. Liegen die Spitzen weiter als 1 h auseinander, lautet der Satz: „Ihre Monatsspitzen verteilen sich auf X bis Y Uhr.“
3. **Freie Tage**: Spalten mit `typ > 0` hell. `k1-freie-tage`: „14 % des Stroms fließen an Samstagen, Sonn- und Feiertagen.“ (`anteilFrei`)
4. **Grundlast**: Zellen ≤ 1,2 × Grundlast in navy-300, Rest abgedunkelt. `k1-grundlast`: „Nachts läuft der Betrieb nie auf null: Grundlast ≈ 34 kW.“ Nur beim Beispiel folgt der Zusatz „(im Beispiel IT, Kühlung, Druckluft)“.
5. **Sonne** (kWp = `steckbrief.kwp ?? pv.empfehlung.kwp`): Zellfarbe = Mischung aus Last-Rampe und ov-400 im Verhältnis min(pv, last)/last. Zellen mit pv > 1,05 × last in sun-300 nach (pv−last)/pv. `k1-sonne`: „Sonne und Schicht treffen sich werktags mittags – an Wochenenden, Feiertagen und im Betriebsurlaub bleibt Sonne übrig.“ Dazu der Link „Größe ausprobieren“ → `#eigenverbrauch`.

**Fadenkreuz:** Ein Pointer über der Zelle zeigt den Tooltip „Fr 5. Dez 2025 · 06:15 · 312 kW“ (Linse Sonne: „· Sonne 0 kW“). Tastatur: Wrapper `tabIndex=0`. ←/→ wechselt den Tag, ↑/↓ die Viertelstunde, mit Umschalt eine Woche bzw. eine Stunde. Ansage über `useAnsage`. Touch: Tippen setzt, horizontales Ziehen bewegt (`touch-action: pan-y`).

**Kennzahlen-Leiste** (`<dl>`, `Zahl`): Jahresverbrauch MWh · Jahresspitze kW (+ Zeitpunkt) · Grundlast · Benutzungsdauer h · Mittel der Monatsspitzen kW.

**Eigener Lastgang** (Panel rechts ab xl, sonst darunter): Ablagezone (button + `input type=file accept=".csv,.txt,text/csv,text/plain"`, Drag-and-drop am Desktop). Zustände: leer → Datei gewählt (bleibt nur im State, **wird nicht gelesen**) → „E-Mail bestätigen und auswerten“ → `gate.oeffnen("auswertung", { titel: "Ihren Lastgang auf dieser Seite auswerten" })` → Rückkehr in den Tab: `useLeadGate` meldet `freigegeben` → `eigeneDateiAuswerten(file, { freigegeben: true })` → alle Kapitel zeigen `quelle: "eigen"`. Chip „Ihr Lastgang · ausgewertet nur in diesem Browser“, Knopf „Zurück zum Beispiel“ (`zumBeispiel()`). Fehler (Meldung aus `LastgangFehler`) erscheinen in `role="status"`, das Beispiel bleibt stehen. `gate.dialog` rendern. Ohne Datei hilft „Wo bekomme ich meinen Lastgang?“: ein `select` aus `SMART_METER_BETREIBER` führt zu „Anleitung für …“ → `betreiberPfad(slug)`, dazu `HINWEIS_DATENSCHUTZ`. Steckbrief: `setze({ quelle: "eigen", jahresverbrauchKwh }, "k1")`. Ereignis `lastgang_eigen` mit `{ schritt }`, ohne personenbezogene Daten.

**SSR-Hülle:** Kopf, `GrafikPlatz` (dunkel, Seitenverhältnis wie oben, Text „Lastgang wird berechnet …“ ohne Spinner), figcaption mit SSR-Zahlen und `Kennzeichnung` synthetisch. Wissensschublade „Lastgang lesen – Begriffe, Regeln und die Werte des Beispielbetriebs“: Viertelstundenwerte (96/Tag), Leistungsmessung ab > 100.000 kWh oder > 50 kW (`PS_ANNAHMEN`), Grundlast als 5-%-Quantil, Benutzungsdauer, Feiertage nach ARG § 7 (`QUELLE.arg`), dazu eine `DatenTabelle` „Monatsverbrauch und Monatsspitzen des Beispielbetriebs“ mit 12 Zeilen (Monat | MWh | Spitze kW | Zeitpunkt). Ausgang: primär „Lastgang auswerten lassen“ → `/angebot?objekt=gewerbe`, sekundär „Detail-Analyse im Browser“ → `/lastgang-analyse`, Hinweis „Ohne Datei reichen Jahresverbrauch und Netzrechnung für die erste Einschätzung.“

**Gate:** Stufe 2 `lastgang-analyse`, `modus: "auswertung"`, nur für die eigene Datei. Das Beispiel ist frei. **Recht:** Die Kennzeichnung ist immer sichtbar. Für eigene Daten gibt es keine Ursachen-Behauptungen. Datenschutz-Satz: Die Datei verlässt den Browser nicht. **Leistung:** Neufärben ≤ 3 ms, Daten aus dem Worker. **QA:** testids `teppich`, `linse-jahr|schichtbeginn|freie-tage|grundlast|sonne`, `teppich-readout`, `lastgang-upload`. In der Linse Schichtbeginn stehen 12 Marker mit 06:00/06:15.

### K2 · Dach-Labor · „Hallendach und Flachdach: Ost-West, Süd, Trapezblech oder Shed?“

**Dateien:** `K2Hallendach.js` (Server), `K2Insel.js`, `K2DachLabor.js` (Client: Steuerung, Werte, Tageskurve), `K2Szene3D.js` (three, `import("three")` erst bei Bedarf), `K2IsoSvg.js` (reine Komponente ohne Hooks: SSR-Platzhalter und Rückfall). Ton **sand**, `#hallendach`.

**Kopf:** „02 · Technik fragt: Was passt auf unsere Halle – und wie viel davon ist sinnvoll?“

**Instrument:** ein 3D-Architekturmodell wie Modellbau-Karton. Halle L × B (Standard 100 × 60 m = 6.000 m², passend zu `GEWERBE_PRESETS` logistik), Höhe 9 m, Attika. Hallenmaterial ist weiß-sand (`MeshStandardMaterial`, roughness 0,9), die Module navy-800 (roughness 0,35). Boden sand-50, Nordpfeil. Die Längsachse liegt Nord–Süd.
- **Dachart** (`Segment` aus `GEWERBE_PV.dacharten`): Ost-West (A-Paare 15°, 7 m²/kWp) · Süd (Reihen 10–15° mit großen Abständen, 10 m²/kWp) · Trapezblech (flaches Satteldach 5°, dachparallel, 5 m²/kWp) · Shed (Sägezahn, Module nur auf den Südflächen 35°, 10 m²/kWp). Die Module ordnen sich in 400 ms gestaffelt um (Instanzen, lerp). Raster: 1 Instanz = 1 Modul (Annahme 430 Wp, 1,13 × 1,72 m), über 2.400 Instanzen 1 Instanz = 2 × 2 Module. Hinweis „Modulraster schematisch“.
- **Hallenmaß:** Chips 2.500 m² (50 × 50) · 6.000 m² (60 × 100) · 12.000 m² (80 × 150) und zwei Regler Länge 20–200 m, Breite 15–120 m.
- **Abzüge** (`DACH_ABZUEGE`): Randabstand 10 % (0–30), „Lichtkuppeln, Technik und Brandschutz-Freihaltezonen (OVE R 11-1)“ 15 % (0–50). Der Rand erscheint schraffiert, Lichtkuppeln als Kästen, Freihaltestreifen quer übers Dach. Alles ist in diesen Prozenten enthalten, es gibt keinen eigenen Abzug.
- **Sonnen-Schieber:** Chips 21. März, 21. Juni, 21. Dezember und Uhrzeit 04:30–21:30 in 15-min-Schritten (Start 21.6., 10:00). Sonnenrichtung über `sonnenstand(wandZuUtc(Date.UTC(2026, m, d, h, min)), lat, lon)` (`src/lib/lastgang/pv.js`, `parser.js`). Bei Zenit ≥ 90° wird die Szene gedimmt: „Sonne unter dem Horizont“. Bei Ost-West leuchten vormittags die Ostflanken. Bei Süd wandern die Schatten in die Reihenabstände.
- **Ort:** ein `select`, gruppiert nach Bundesland (37 Orte aus `standortGruppen()` in `src/components/RechnerGewerbe/standorte.js`, lat/lon aus `regionen-pvgis.json`), dazu die **Ertrags-Leiste**: 37 Striche nach spezifischem Ertrag der gewählten Dachart sortiert, der gewählte hervorgehoben (z. B. „Linz · 942 kWh/kWp · Ost-West 15°“). Bewusst **keine** Karte, die gehört K4.
- **Werte** (`<output>`, gleitend): Brutto m² · Nutzfläche (`nutzflaeche(brutto, { randPct, hindernisPct }).netto`) · max. kWp (`kwpAusNutzflaeche(netto, dachart.qmProKwp)`, auf 5 gerundet) · spezifischer Ertrag (`spezifischerErtrag(dachartId, { sued35, ostwest15, flach10 })`) · Jahresertrag MWh. Beispiel 6.000 m²: Ost-West ≈ 655 kWp / 617 MWh, Süd ≈ 460 kWp / 478 MWh.
- **Tageskurve** unter der Szene (SVG ≈ 120 px, d3-shape): Lichtform `klarhimmel(zenit, azimut, tag, flaechen)` für Süd, Ost-West und Flach am gewählten Tag, auf das Maximum von Süd normiert. Die Kurve der aktiven Dachart ist hervorgehoben, ein Cursor folgt der Uhrzeit. Kennzeichnung `KENNZEICHNUNG.klarhimmel`.
- **Erkenntnis `k2-ostwest`** beim ersten Wechsel zwischen Ost-West und Süd: „Gleiche Halle: Ost-West bringt ≈ 655 statt 460 kWp aufs Dach und ≈ 617 statt 478 MWh im Jahr – jedes Modul erntet weniger, das Dach mehr.“ (live gerechnet). Zweiter Satz: „Sinnvoll ist, was der Lastgang braucht – im Beispiel 280 kWp (Kapitel 03).“ (`pv.empfehlung`)
- Bei Ort- oder Dachartwechsel (400 ms entprellt): `pvSetzen(ortId, AUSRICHTUNG_FUER_DACHART[dachart])` und `steckbrief.setze({ dachart, laengeM, breiteM, flaecheQm, kwpMax, ortId }, "k2")`.

**3D-Technik:** `WebGLRenderer({ antialias: true })`, `setPixelRatio(min(dpr, 1,75))`, Rendern nur bei Änderung (kein Dauer-RAF, außer während 400-ms-Übergängen und beim Ziehen). PerspectiveCamera fov 30 in fester 3/4-Aufsicht von Südost, Ziehen dreht nur ±20° um die Hochachse, kein Zoom, `touch-action: pan-y`. HemisphereLight und ein DirectionalLight (Sonne) mit Shadow-Map 1024 (mobil 512). `InstancedMesh` ≤ 2.400. Beim Unmount alles `dispose()`. Bei `webglcontextlost` greift der Rückfall. **Rückfall** `K2IsoSvg` (kein WebGL, `useSchwachesGeraet()`, Fehler): eine isometrische SVG-Halle mit Dachart-Muster (Ost-West Chevrons, Süd Streifen mit Lücken, Trapez dicht, Shed Sägezahn) und 2D-Sonnenpfeil, Steuerung und Werte identisch. Dieselbe Komponente ist der SSR-Platzhalter (`aspect-[16/10]`, mobil `aspect-[4/3.4]`).

**SSR-Hülle und Wissen:** figcaption mit Live-Zustand im Client bzw. Startzustand im SSR („Halle 60 × 100 m, Ost-West aufgeständert: Nutzfläche 4.590 m², bis ≈ 655 kWp, ≈ 942 kWh/kWp in Linz (PVGIS)“). Wissensschublade „Dacharten, Flächenbedarf, Statik und Brandschutz“: Tabelle aus `GEWERBE_PV.dacharten` (Dachart | Montage | m²/kWp | Ertragsbasis), `DACH_ABZUEGE`, Texte zu Schnee (ÖNORM B 1991-1-3) und Wind (B 1991-1-4), Brandschutz OVE R 11-1, Ballast und Statikunterlagen sowie Gewerberecht (Erlass 1.3.2021) aus der bisherigen page.js. Links `/standort-check`, `/schneelast`. Einwand `dach-alt` als `<details>` (`einwaendeFuer("gewerbe", ["dach-alt"])`). Schneelastwerte werden **nicht** angezeigt (kein Raster-Lesen auf /gewerbe, HORA nie): Es bleibt beim Link zum Standort-Check.

**Ausgang:** primär „Dach und Statik prüfen lassen“ → `anfrageUrl(sb)`, sekundär „Dach auf dem Luftbild einzeichnen“ → `/rechner/gewerbe-pv#dach-einzeichnen` (dort Gate `hallendach-planer`, Stufe 2), Textlink „Schnee und Wind am Standort prüfen“ → `/standort-check`.

**Mobil:** Szene volle Breite, darunter die Werte-Zeile, dann Dachart (2 × 2), Maß, Abzüge, Sonne, Ort. **Gate:** keins auf der Seite. **Leistung:** Der three-Chunk lädt nur in K2-Nähe. Ohne WebGL fällt nichts weg. **QA:** testids `dachart-ost-west|sued|trapez|shed`, `dach-kwp`, `dach-ort`, `sonne-zeit`. Der Wechsel Süd → Ost-West bei 6.000 m² erhöht die kWp (460 → 655).

### K3 · Sonne trifft Schicht · „Eigenverbrauch und Anlagengröße: wo die Sonne auf Ihre Schicht trifft“

**Dateien:** `K3Anlagengroesse.js` (Server), `K3Insel.js`, `K3SonneSchicht.js` (Client). Ton **dunkel**, `#eigenverbrauch`.

**Kopf:** „03 · Geschäftsführung fragt: Wie groß soll die Anlage sein – und was bringt mehr?“

**A · Knick-Kurve** (SVG, d3-shape `curveMonotoneX`): x = kWp (0 bis `pv.kurveMax` bzw. Dachgrenze). Linien Eigenverbrauchsquote (ov-400) und Autarkie (navy-300) aus `pv.kurve`. Die senkrechte „Dachgrenze“ kommt aus `steckbrief.kwpMax` (ohne K2: Startwert der Modellhalle mit Hinweis „Dachgrenze der Modellhalle aus Kapitel 02“). Striche markieren „Empfehlung 80 % Eigenverbrauch: 280 kWp“ und „Rechenbeispiel 300 kWp“. Ein Punkt mit steifer Feder zeigt die Wahl. Regler: natives `range` von 50 bis min(kurveMax, Dachgrenze), Schritt 5/10, Start = `pv.empfehlung.kwp`, `aria-valuetext` „280 Kilowatt-Peak, Eigenverbrauch 80 Prozent“. Live über `simuliere(last.reihe.kwh, pv.reihe, kwp)` (≈ 0,2 ms, `useProBild`): EV %, Autarkie %, Eigenverbrauch MWh, Überschuss MWh, Erzeugung MWh.

**A2 · Wochenstreifen** (Nacharbeit nach QA, 13.10.2026; `K3Woche.js`): Direkt am Regler steht dieselbe Juniwoche wie im Hero (Mo 16.–So 22.6.2025, Fronleichnam). Sieben kleine Tagesflächen zeigen genutzt/übrig, darunter steht je Tag „Sonne übrig“ in kWh. Der Streifen folgt dem Federwert des Läufers. Beim Ziehen blüht der Überschuss an Feiertag und Wochenende auf, die Werktage bleiben bis etwa zur 1,5-fachen Empfehlung grün. Der Jahresbalken zeigt den Überschuss in MWh und den Anteil an Ruhetagen (88 % bei 280 kWp, 60 % bei 560 kWp), beides live über `ueberschussTeile()`. Mobil steht der Streifen über dem Regler, damit der Daumen nichts verdeckt. Jenseits der 1,5-fachen Empfehlung leuchtet die Grenz-Linie einmal auf (Web Animations, kein Dauerpuls) und wird am Läufer beschriftet: „von jeder weiteren kWh nur noch 25 % selbst genutzt“. Kurven-Beschriftungen sind kollisionsgeprüft und blenden in Läufer-Nähe aus. Die Erkenntnis „Knick“ erscheint beim Loslassen, nicht mitten im Ziehen. Startdaten (vollständige 60-Punkte-Kurve, Woche, 6.8.) kommen aus `K3Server.js` mit denselben Funktionen wie der Worker; Startbild und gerechnetes Bild sind deshalb identisch, und die Kurven morphen statt neu zu zeichnen. E-Flotte: Der Tagesbedarf rechnet mit den Arbeitstagen eines Jahres (`jahresArbeitstage`), auch bei Lastgängen unter einem Jahr. Mit Flotte wandert die Empfehlungsmarke mit („Empfehlung mit Flotte: 290 kWp“, Chip „Auf 290 kWp setzen“).

**B · Drei Tage** (Small Multiples, je 96 Viertelstunden): „Werktag im Juni“, „Samstag im Juni“, „Betriebsurlaub im August“. Für den Beispielbetrieb: Mi 18.6., Sa 21.6., Mi 6.8.2025. Für eigene Daten: der Werktag im Juni mit dem Median-Verbrauch, der erste Samstag im Juni und der verbrauchsärmste Werktag Juli/August (unter 50 % des Werktags-Medians, sonst ein Sonntag im August). Jedes Band zeigt die Lastlinie (navy-300), die PV-Fläche geteilt in genutzt (ov-400) und übrig (sun-300) für die gewählte kWp und die Tageswerte in kWh.

**E-Flotte** (Stepper 0–20 Transporter): Annahme aus `KLASSEN.transporter` (`src/lib/rechner/eflotte.js`): 20.000 km/a, 30 kWh/100 km, also 6.000 kWh/a bzw. ≈ 24 kWh je Werktag. Geladen wird mit 11 kW AC ab 10:00 an Werktagen (typ 0), bis der Tagesbedarf gedeckt ist. Die zusätzliche Last erscheint in den Tagesbändern schraffiert. EV, Kurve (entprellt) und Bänder werden neu gerechnet. Erkenntnis `k3-flotte`: „10 Transporter laden mittags: Eigenverbrauch steigt von 80 auf X % – am Wochenende bleibt der Überschuss.“ Kennzeichnung „Annahme wie E-Flotten-Rechner“.

**Erkenntnis `k3-knick`** bei kWp > 1,5 × Empfehlung: „Doppelte Anlage heißt nicht doppelte Ersparnis: Bei 560 kWp sinkt der Eigenverbrauch auf 59 % – 88 % des Überschusses entstehen an Wochenenden, Feiertagen und im Betriebsurlaub.“ Der Anteil wird live aus den Rastern gerechnet (Betriebsurlaub = Werktage mit Tagesmittel < 1,3 × Grundlast).

**C · Was Überschuss wert ist** (kompakte Zeile): 24 Monatsbalken `REFERENZMARKTWERT_PV` (09/2024–08/2026, E-Control) gegen eine Linie „selbst genutzt: 14,64 ct“ (`steckbrief.vermiedenCt` oder Beispiel). Direkt beschriftet: „April 2026: 1,70 ct · Jänner 2026: 13,95 ct“. Erkenntnis `k3-marktwert`. Darunter die Überschuss-Weiche als Liste: OeMAG-Marktpreis (letzter Monat `OEMAG_MONATE`, nur unter 500 kW nach `OEMAG_REGELN.grenzeKwp`, bei kWp ≥ 500 ausgegraut), Marktprämie (über 10 kWp, Höchstpreis 2026 7,77 ct, Ausschreibung), Energiegemeinschaft (`/energiegemeinschaften`), Stromhändler/PPA (`/service/direktvermarktung`). Jede Zeile mit Stand.

**SSR-Hülle:** figcaption und `DatenTabelle` „Anlagengröße und Eigenverbrauch im Beispielbetrieb (Linz, Ost-West, Modell)“ aus `beispielServer().groessen` (100/200/280/300/400/600 kWp → EV %, Autarkie %, Einspeisung MWh). Wissensschublade „Eigenverbrauch, Autarkie und Überschuss – Begriffe und Regeln“ mit den unterschiedlichen Nennern, der Abweichung Rechenbeispiel ↔ Modell in einem Satz, OeMAG-Regeln und Marktprämie. Kennzeichnung synthetisch und `pvModell`.

**Ausgang:** primär „Anlagengröße mit Ihrem Lastgang auslegen lassen“ → `anfrageUrl(sb)` (enthält kWp), sekundär „Im Gewerbe-PV-Rechner weiterrechnen“ → `rechnerUrl(sb)`. Bei Flotte > 0 zusätzlich der Textlink `/rechner/e-flotte` und `/ladeinfrastruktur`. Steckbrief beim Loslassen: `setze({ kwp, evQuote, autarkie, flotte }, "k3")`.

**Mobil:** Kurve 358 × 260, Regler darunter (48-px-Griff), die drei Bänder untereinander (je 110 px), die Marktwert-Zeile horizontal scrollbar (nur innerhalb, `snap`). **Gate:** keins (mit eigenen Daten nach K1-Gate). **QA:** testids `kwp-regler`, `ev-ausgabe`, `flotte`. Start: 280 kWp, EV 80 %, Autarkie 24 %.

### K4 · Röntgen der Stromrechnung · „Was eine Kilowattstunde vom Dach wert ist – nach Netzbereich und Netzebene“

**Dateien:** `K4KwhWert.js` (Server), `K4Insel.js`, `K4Roentgen.js` (Client), `K4Rechnung.js` (reine Komponente: dieselbe Rechnung statisch im SSR und als Startzustand im Client), `K4Boerse.js` (async Server). Ton **weiß**, `#kwh-wert` (zusätzlich leerer Anker `id="stromrechnung"`).

**Kopf:** „04 · Finanzen fragt: Was spart eine selbst genutzte Kilowattstunde wirklich?“

**Instrument:** links eine **Rechnung** (Papierkarte bg-sand-50, weicher Schatten, Netz- und Energierechnung kombiniert) mit den Zeilen: Energiepreis (Liefervertrag) 11,00 ct · Netznutzungsentgelt Arbeitspreis 2,37 ct · Netzverlustentgelt 0,454 ct · Elektrizitätsabgabe 0,82 ct · **Leistungspreis 65,88 €/kW/Jahr** (ausgegraut, Etikett „bleibt – Kapitel 05“). Knopf „Rechnung röntgen“ (beim ersten Sichtkontakt zu 50 % nach 400 ms automatisch einmal ausgelöst): Die vier ct-Zeilen **fliegen** (motion `layoutId`, LazyMotion `domMax`, 600 ms ease-aus) rechts in einen gestapelten Balken „Selbst genutzte kWh 14,64 ct“ (Energie ov-500, Netz navy-500, Verlust navy-300, Abgabe sun-400 als Fläche mit dunkler Beschriftung). Daneben steht ein dünner Balken „Eingespeiste kWh 6,0 ct“ und der Faktor „× 2,4“, der live zählt. „Zurück zur Rechnung“ macht es umkehrbar.
- **Netzbereich:** eine Österreich-Karte (`BUNDESLAND_PFADE`, `projiziereAT`) mit 9 Ländern. noe → niederoesterreich, ooe → oberoesterreich, die Stadtnetze Linz, Graz, Klagenfurt und Innsbruck als Punkte (lat/lon aus `regionen-pvgis.json`). Eingefärbt nach Netz-ct (AP + NV) der gewählten Netzebene (ov-100 → ov-600). Die Wahl steht in navy-700 mit weißem Label. Gleichwertig gibt es ein `select` über alle 13 `NETZBEREICHE` (Tastatur-Weg; Kartenpfade nur für Zeiger, aria-hidden).
- **Netzebene** 5/6/7 (`Segment`). **Energiepreis** (Zahl und Regler 6–25 ct, Start 11,0). **Elektrizitätsabgabe** (`Segment`): „2026: 0,82 ct (befristet)“ oder „regulär 1,5 ct“, Hinweis „Verlängerung offen – Finanzausschuss vertagt am 29.09.2026“ (`foerderFristen.js`).
- Werte über `netzpreise(bereich, ne)` (`peakshaving.js`). Die Summe gleitet. Erkenntnis `k4-faktor` beim ersten Röntgen: „In {Bereich} auf Netzebene {ne} spart jede selbst genutzte kWh {x} ct – {f}-mal so viel wie eine eingespeiste.“ Beim ersten Wechsel auf NE 7 folgt der Zusatz: „Hier ist allein das Netz-Arbeitsentgelt {ap} ct wert.“ (z. B. Steiermark 6,78 ct).
- **Börse jetzt** (`K4Boerse`, async Server in `<Suspense fallback={null}>`, `Promise.race` mit 1,5 s Zeitlimit): `getSpotPrices()` → aktuelle Viertelstunde AT in ct/kWh netto und das Mittel heute 12–14 Uhr, mit Zeitstempel (Wien), daneben „Ihre selbst genutzte Dach-kWh (Rechenbeispiel): 14,64 ct“. Attribution `SMARD_ATTRIBUTION` und CC BY 4.0. Ohne Daten wird nichts angezeigt.

**SSR-Hülle:** Die Rechnung (`K4Rechnung`) im Startzustand ist der Platzhalter. Wissensschublade „Netzentgelte 2026 aller 13 Netzbereiche“: `DatenTabelle` aus `NETZBEREICHE` (Bereich/Betreiber | NE 5 LP · AP · NV | NE 6 … | NE 7 …), Quelle `NETZ_QUELLE`. Das erweitert die Tabelle von 3 auf 13 Bereiche (SEO). Texte: § 2 ElAbgG, Leistungsmessung (> 100.000 kWh oder > 50 kW), NE 7 Pauschale 54 €/a, ab 2027 laut Entwurf (`QUELLE.elwg`, `QUELLE.sneEntwurf`). Einwand `strompreise` als `<details>`.

**Ausgang:** primär „Netzrechnung analysieren lassen“ → `/angebot?objekt=gewerbe`, Hinweis „Sie bekommen die vier Teile aufgeschlüsselt zurück.“; sekundär „Weiter: der Leistungspreis“ → `#leistungspreis`. Steckbrief: `setze({ bereich, ne, energieCt, vermiedenCt }, "k4")`.

**Mobil:** Rechnung oben, der Flug geht vertikal nach unten in den Balken, die Karte darunter (358 px breit), danach select und Segmente. **Gate:** keins. **QA:** testids `roentgen`, `netzbereich`, `netzebene`, `kwh-summe`. Start 14,64 ct und × 2,4. NE 7 Steiermark zeigt AP 6,78.

**Umsetzung nach QA (13.10.2026):** Das Röntgen endet in **Euro je Jahr**. Die Musterrechnung ist die Jahres-Stromrechnung des synthetischen Beispielbetriebs (884 MWh, Mittel der Monatsspitzen 291,5 kW aus `beispielServer()`; nach dem K1-Gate der eigene Lastgang): je Zeile ct/kWh und €/Jahr, Leistungspreis „bleibt – Kap. 05“, Jahressumme 148.697 € → 116.407 € (−21,7 %). Der Solar-Anteil jeder Zeile (selbst genutzte kWh ÷ Verbrauch) fliegt in den Balken „Solarstrom streicht je Jahr“ (Rechenbeispiel 32.290 €; mit 5.670 € Einspeiseerlös und 3.600 € Betrieb = 34.360 € wie Kurzantwort/K7). Anlage wählbar im Röntgenbild: Rechenbeispiel 300 kWp oder Stundenmodell (K3-Steckbrief bzw. Empfehlung 280 kWp). Unter 1024 px steht statt des großen Bilds ein waagrechter **Film in der Rechnung** direkt unter den Zeilen (Flug ganz sichtbar, Auto-Röntgen erst, wenn Zeilen und Film im freien Bild stehen). Abgabe-Segment ink-500 (neutral, Amber bleibt Einspeisung). Börse rechnet live „Börse + Netz/Abgabe = Ersparnis je selbst genutzter kWh“ und kann ihr Mittel 12–14 Uhr als Energiepreis übernehmen. Stadtnetze zusätzlich als Pillen (44/48 px). Höhe: 390 px 2.579, 375 px 2.595, 768 px 2.503 px.

### K5 · Die teuerste Viertelstunde · „Leistungspreis senken: die teuerste Viertelstunde des Monats“

**Dateien:** `K5Leistungspreis.js` (Server), `K5Insel.js`, `K5SpitzenJagd.js` (Client), optional `K5Staffelstart.js`. Ton **dunkel**, `#leistungspreis`.

**Kopf:** „05 · Finanzen fragt: Warum senkt die PV unseren Leistungspreis kaum?“

**A · Spitzen-Uhr** (SVG, d3-shape `arc`, 24-h-Zifferblatt, 0 Uhr oben, im Uhrzeigersinn; 12 Ringe Jänner innen bis Dezember außen):
- Auf jedem Ring liegt der **Sonnenbogen** des 15. dieses Monats von Aufgang bis Untergang am gewählten Ort (`sonnenstand` in 5-min-Schritten, Zenit < 90°, Ort = `useGewerbeDaten().ortId`), sun-300 mit 35 %.
- Der **Spitzenpunkt** jedes Monats (sun-500, weißer Ring) sitzt bei `monate[i].spitzeT` (Stunde:Minute).
- Intro einmal beim Eintritt: Die Punkte starten bei 00:00 und wandern im Uhrzeigersinn zu ihrer Uhrzeit (Stagger 40 ms), die Sonnenbögen wachsen (pathLength). Bei reduzierter Bewegung steht alles sofort.
- Hover oder Fokus auf einem Ring (12 Buttons in einer Liste neben der Uhr, synchron) zeigt: „Dezember: 312 kW am Fr 5.12. um 06:15 – Sonne: noch unter dem Horizont · PV liefert 0 kW“ (PV = `pv.reihe[i] × kWp × 60/intervall` am Index von `spitzeT`, kWp = `steckbrief.kwp ?? empfehlung`).
- Erkenntnis `k5-sonne-schlaeft`: „Um 06:15 schläft die Sonne noch: In {n} von 12 Monaten liefert die Anlage zur Monatsspitze 0 kW.“ (gerechnet)

**B · Deckel über 12 Monatstürmen** (SVG, d3-scale, y-Achse **ab 0**): 12 Balken (Monatsspitzen, navy-300) und ein ziehbarer Deckel (Linie mit Griff 44 × 44, `useTastenRegler` ↑/↓ 1 kW, Umschalt/Bild 10 kW, dazu ein natives `range`). Was über dem Deckel liegt, wird sun-500 („gekappt“). Der Griff trägt live „230 kW / ≈ 4.050 €/a“ (Geste, Deckel und Geld in einem Blick, auch mobil über der Daumenleiste). Beim Absenken lösen sich die neu gekappten Stücke als **Kappen** (ein Block je Monat, sun-500 mit Navy-Kontur, Wellen alle 280 ms, höchstens 40 gleichzeitig) und fallen im Bogen auf eine **Batterie** (SVG), die immer voll ist und als **Speichergröße** mitwächst (Höhe auf beschrifteter Wurzelskala, Desktop mit Achse „Speichergröße“ und mitfahrendem Etikett kWh/kW, mobil kWh unter der Grundlinie). Kappen gibt es nur bei Interaktion, bei reduzierter Bewegung nicht. Höhen gleiten als Tween ohne Überschwingen; bei Breitenwechsel wird sofort neu gezeichnet. (Überarbeitung nach QA, 13.10.2026: vorher 6 × 3,5-px-Splitter Amber auf Amber und Füllstand „Nennkapazität ÷ größte Kapazität“, der wie ein leerer Ladezustand wirkte.)
- Live aus `kapp.zeilen` (nächste Schwelle, keine Rechenlast): Speicher-Leistung kW · Nennkapazität kWh · Tage mit Eingriff · Stunden über dem Deckel · **€/Jahr = senkungKw × LP** (`netzpreise(sb.bereich, sb.ne).lp`, Etikett „bis Ende 2026: Mittel der 12 Monatsspitzen“). Bei `moeglich: false`: „Zu nah an der Dauerlast – hier hilft kein Speicher allein.“
- Start: Deckel bei 74 % der Jahresspitze, auf 5 kW abgerundet (Beispiel 230 kW → 85 kW / 55 kWh / ≈ 4.050 €/Jahr bei NE 6 OÖ).
- **„Sonne einschalten“** (`aria-pressed`): Die Türme werden zu den Monatsspitzen des Netzbezugs mit PV (`monatsspitzenMitPv`, kWp aus Steckbrief oder Empfehlung) und bewegen sich kaum. Erkenntnis `k5-speicher`: „PV allein: −2,4 kW im Mittel ≈ 160 €/Jahr. Speicher 85 kW / 55 kWh: −61,5 kW ≈ 4.050 €/Jahr.“ (gerechnet)
- **Grenznutzen** (Mini-Kurve 140 px, d3-shape): €/Jahr über Nennkapazität aus `kapp.zeilen` mit dem aktuellen Punkt. Satz gerechnet: „Die ersten 60 kW Kappung brauchen {a} kWh, die nächsten 40 kW {b} kWh.“
- **Abrechnung ab 2027** (`Segment` „bis 2026 | ab 2027 (Entwurf)“): Im Modus 2027 sind die Balken einzelne Monatsrechnungen, jeder trägt „−x kW“. Statt € erscheint „Monatsmaximum × Monatsleistungspreis – Beträge stehen aus“ (`KENNZEICHNUNG.entwurf2027`, `QUELLE.sneEntwurf`).
- **Staffelstart** (klein, schematisch): drei Verbraucher (Kompressor 45 kW, Presse 60 kW, Lüftung 30 kW, „schematische Beispielwerte“) mit Anlaufspitze ×1,5 für 15 min; Umschalter „gleichzeitig | gestaffelt“ (die Zeiten 06:00/06:15/06:30 stehen im Text und auf der Zeitachse; bis lg einspaltig, Grafik in Pixelbreite). Die Summenspitze sinkt sichtbar (motion layout). Kennzeichnung `KENNZEICHNUNG.schematisch`.

**SSR-Hülle:** `GrafikPlatz` mit figcaption: „Im synthetischen Beispielbetrieb liegen alle 12 Monatsspitzen um 06:00/06:15 Uhr. Eine 280-kWp-Anlage senkt ihr Mittel nur von 291,5 auf 289,1 kW; ein Speicher mit 85 kW / 55 kWh senkt es um 61,5 kW (≈ 4.050 €/Jahr bei Netzebene 6, OÖ).“ (Werte aus `beispielServer().monatsspitzenMitPv`, `.kennzahlen` und `.kappung` – serverseitig gerechnet). Wissensschublade „Leistungspreis in Österreich – Regeln 2026 und 2027, Speicherauslegung“: Regeln (§ 52 ElWOG, SNE-V 2018 Novelle 2026, ElWG und Entwurf SNE-G-V), `PEAK_ANNAHMEN` (Reserve 1,25, Restkapazität 0,8, Wirkungsgrad 0,9), `DatenTabelle` „Deckel → Speicher → Ersparnis“ aus `beispielServer().kappung` (290/265/250/230/210/190 kW, NE 6 OÖ). Satz „Speicherpreise nennen wir hier bewusst nicht.“ Links `/gewerbespeicher`, `/ratgeber/peak-shaving-leistungspreis`.

**Ausgang:** primär „Ihre teuerste Viertelstunde finden – Lastgang auswerten lassen“ → `/angebot?objekt=gewerbe`; mit eigenen Daten „Speicher mit Ihren Werten anfragen“ → `anfrageUrl(sb)`. Sekundär „Im Peak-Shaving-Rechner weiterrechnen“ → `/rechner/peak-shaving?${psParams({ verbrauch, spitzen: 12 Monatsspitzen, kappung: schwelle, schichten: 2, art: "anlauf", bereich, ne, kwp, speicher: nennKwh, lp })}`, nur mit 12 vollen Monaten (dort Gate `peak-shaving`, Stufe 1). Steckbrief beim Loslassen: `setze({ schwelleKw, speicherKw, speicherKwh, lpErsparnisEuro }, "k5")`.

**Mobil:** Uhr 340 px, darunter die Ring-Liste als 6 × 2-Raster (bis lg, Tabelle mit Sonne/PV ab lg), dann die Türme (Höhe 264) mit dem Regler in der Daumenzone, Batterie rechts daneben (50 px). Grenznutzen und Staffelstart bis lg aufklappbar; Kapitel im Startzustand ≈ 2.540 px bei 375 px. Hover auf Uhr/Liste ist nur Vorschau (echte Mausbewegung, kein Wechsel beim Scrollen); Auswahl und Erkenntnis erst per Klick, Tippen, Fokus. **Gate:** keins. **QA:** testids `spitzen-uhr`, `deckel`, `deckel-range`, `sonne-an`, `lp-euro`, Anker `data-k5-intro` (warten → los → fertig). 12 Punkte mit 06:00/06:15. Deckel 230 → 85 kW / 55 kWh / ≈ 4.050 € (alle Euro-Angaben einheitlich auf 10 € gerundet, Richtwert).

### K6 · Schwellen-Lineal · „Netzanschluss: Netzebene 7, 6 oder 5 – TOR Typ A oder B und Parkregler“

**Dateien:** `K6Netzanschluss.js` (Server), `K6Insel.js`, `K6Lineal.js` (Client), optional `K6Einlinie.js`. Ton **sand**, `#netzanschluss`.

**Kopf:** „06 · Technik fragt: Ab wann wird der Netzanschluss aufwendig?“

**Instrument A – zwei Lineale** (d3-scale `scaleLog`):
- **DC-Lineal** kWp 20 → 5.000 mit Schieber (Start `steckbrief.kwp ?? 280`). Tore, die beim Überfahren als Karte aufklappen (rotateX 8°, ruhig): >20 kWp EAG Kategorie C (Reihung nach Förderbedarf, höchstens 130 €/kWp) · >100 kWp Kategorie D (höchstens 120 €/kWp, `KATEGORIEN`) · 500 kWp Ende der OeMAG-Abnahmepflicht (`OEMAG_REGELN.grenzeKwp`) · 1.000 kWp EAG-Förderung nur bis 1.000 kWp (`MAX_KWP`). Darunter Netzebenen-Bänder als weiche, überlappende Flächen (NE 7 bis etwa 100–250 kWp, NE 6 etwa 150 kWp–1 MWp, NE 5 etwa 0,5–10 MWp), Etikett „Richtwert – die Netzebene legt der Netzbetreiber fest“.
- **AC-Lineal** kW 20 → 5.000 mit gestapeltem Balken: Wechselrichter (Start `acVorschlag(kwp)`, Feld editierbar) + Speicher-Wechselrichter (Start 0, Chip „aus Kapitel 05 übernehmen: {speicherKw} kW“) + Bestand (0). Tore bei **250 kW (TOR Typ B)** und **1 MW (Fernwirkschnittstelle)**. Ausgabe `acSumme()`, `torTyp()`, Badge Typ A/B, bei `KNAPP_BAND` der `KNAPP_HINWEIS`.
- Erkenntnis `k6-typ-b`: Bleibt die PV allein unter 250 kW und hebt erst der Speicher die Summe darüber, heißt es: „Erst der Speicher-Wechselrichter macht Ihre Anlage zu Typ B.“ Sonst gilt der Satz „Maßgeblich ist die AC-Leistung am Netzanschlusspunkt – nicht die kWp.“

**Instrument B – Einlinienschaltbild** (SVG, wächst mit, `AnimatePresence`, Leitungen per pathLength 400 ms): PV-Generator → Wechselrichter → (bei Speicher > 0: Batterie + Batterie-WR) → Zähler/Übergabe → je Netzebene (`Segment` 7/6/5, Start `steckbrief.ne`, synchron): NE 7 Niederspannungsnetz · NE 6 Trafostation des Netzbetreibers · NE 5 kundeneigene Trafostation mit MS-Schaltanlage → Netz. Bei Typ B kommt der **Parkregler (EZA-Regler)** hinzu, mit gestrichelten Signallinien „Sollwerte des Netzbetreibers: Wirkleistung, Q(U) / cos φ“. Ab 1 MW AC folgt „Fernwirkschnittstelle“. Darunter `TYPEN[typ].anforderungen` als echte `<ul>`. Der Parkregler-Text steht **ausschließlich** als `PARKREGLER_SATZ` (`src/data/marke.js`), nie „eigener“.

**SSR-Hülle:** Das Einlinienschaltbild im Startzustand (280 kWp, NE 6, Typ A) als statisches SVG plus figcaption. Wissensschublade „Netzebenen, TOR-Typen und Netzzugang“: Tabelle Netzebenen (bisherige `NETZEBENEN`-Daten aus page.js, ins Kapitel übernommen), TOR-Grenzen A–D (`TOR_GRENZEN`), Texte Typ B, Netzverträglichkeit („verbindlich prüft der Netzbetreiber“), OeMAG-Regeln, Links `/netzanmeldung`, `/ratgeber/tor-erzeuger-netzanschluss`, `/forderungen/richtlinien`. Einwand `netz-voll` als `<details>`.

**Ausgang:** primär „Netzebene und TOR-Typ mit Ihrem Netzbetreiber klären lassen“ → `anfrageUrl(sb)`; sekundär „Parkregler & Leittechnik“ → `/technik/parkregler` (dort Fachplaner-Paket, Gate `fachplaner-paket`). Steckbrief: `setze({ kwp, wrKva, acSummeKw, torTyp, ne }, "k6")`.

**Mobil:** Die Lineale bleiben horizontal (358 px, log), Tor-Karten klappen unter dem Lineal auf, das Schaltbild läuft vertikal von oben nach unten. **Gate:** keins. **Recht:** nur `PARKREGLER_SATZ`/`PARKREGLER_KURZ`. Der Netzbetreiber legt die Netzebene fest. **QA:** testids `kwp-lineal`, `wr-kva`, `speicher-kw`, `tor-typ`. 280 kWp + 85 kW Speicher ergibt Typ B (328 kW = acVorschlag(280) 243 + 85).

### K7 · Rechenweg und Stresstest · „Wirtschaftlichkeit: Amortisation, Öko-IFB 22 % und EAG-Förderung – mit Rechenweg“

**Dateien:** `K7Wirtschaftlichkeit.js` (Server), `K7Insel.js`, `K7Pult.js` (Client), `K7Stresstest.js` (Client, d3), `K7Tabelle.js` (reine Komponente: Rechenweg-Tabelle, statisch im SSR und als Startzustand). Ton **weiß**, `#wirtschaftlichkeit` (Schublade zusätzlich `id="beispielrechnung"`).

**Kopf:** „07 · Finanzen fragt: Hält die Rechnung auch im schlechten Fall?“

**A · Rechenweg live (Pult):** Die Beispieltabelle wird zum Instrument. Eine echte `<table>` mit den Zeilen von `rechenweg()`. Die Annahme-Zellen tragen Regler: am Desktop inline (Zelle klicken oder fokussieren → Regler erscheint unter der Zeile), mobil als Reglergruppe unter der Tabelle. Regler: Anlagengröße 100–1.000 kWp (Chip „aus Kapitel 03: {kwp}“), Ertrag 850–1.200 kWh/kWp (Chip „Ort aus Kapitel 02“: `spezifischerErtrag`), Eigenverbrauch 40–95 % (Chip aus K3), Energiepreis 6–25 ct (aus K4), Netz-Arbeitspreis und Netzverlust nur lesbar aus `netzpreise(sb.bereich, sb.ne)`, Abgabe 0,82/1,5, Überschusserlös 0–12 ct, Investition 500–1.200 €/kWp (Strich „Richtwert Marktstatistik“ = `preisProKwp(kwp, "gewerbe")` aus `src/data/solarrechner.js`), EAG 0–120 €/kWp (Satz: „Wer weniger beantragt, wird besser gereiht – und erhält weniger.“), IFB als `Segment` „Übergabe bis 31.12.2026 (22 %) | ab 2027 (15 %)“ (Start über `istIfbAktiv(Date.now())`). Die Ergebniszeilen gleiten: Ersparnis, Erlös, Betrieb, **Jahresüberschuss**, Investition, Zuschuss, **Amortisation**, IFB-Wirkung. Knopf „Zurück zum Rechenbeispiel“. **Startzustand = BEISPIEL exakt** (≈ 34.360 €/a, ≈ 6,1 J., ≈ 10.600 €).
- **Warte-Regler** 0–24 Monate „Wir entscheiden in … Monaten“ → „≈ {N × Jahresüberschuss ÷ 12} € Überschuss entgehen (Rechenbeispiel)“. Die IFB-Differenz 22 % → 15 % (`ifbDifferenz`, ≈ 3.380 €) steht nur als Rechenfakt im IFB-Segment. Kein Countdown, keine Projektdauer-Annahme.
- **Einwand-Prüfstand:** Chips für `strompreise` (Energiepreis und Überschusserlös × `STRESSTEST.konservativ.strompreisFaktor`), `foerderung-unsicher` (EAG 0), `zu-teuer` (Investition = Richtwert Marktstatistik), `amortisation` (Ertrag × `ertragFaktor` 0,9), `technik-warten` (Warte-Regler 12). Ein Klick stellt das Pult um, markiert die geänderten Zellen ov-50 und zeigt `antwort`, `beleg` und `belegHref` des Einwands. Die fünf Einwände stehen zusätzlich vollständig im SSR-HTML (`<details>`). Ereignis `einwand_geprueft`.

**B · 25 Jahre & Stresstest** (`K7Stresstest`, d3-shape): Eingaben kWp, Dachart, Ort (`standort` aus der Ortsliste, die die Hülle übergibt), Verbrauch (`sb.jahresverbrauchKwh`), Schichten, `arbeitspreisCt` = vermiedene ct des Pults, `einspeiseCt` = Überschusserlös des Pults, `eag` = EAG > 0, `ifb: true`. Drei Läufe `rechneGewerbePv` mit den Faktoren aus `STRESSTEST` (konservativ: Preis und Einspeisung ×0,7, Standort ×0,9, Steigerung 0; günstig: Steigerung +1 Pp.), so wie `stresstest()` es intern tut. Gezeichnet wird der **kumulierte Cashflow** (`cashflow[].kumuliert`) über 0–25 Jahre: ein Band zwischen konservativ und günstig (ov-100) und die Linie erwartet (ov-600), Nulllinie, Marker an der Amortisation, Linien direkt beschriftet. Darunter `stresstest(e, { erwartet }).satz.text` und `breakEven.text`. Satz zur Abweichung: „Stundenmodell mit Degradation, Preissteigerung und Investition laut Marktstatistik-Richtwert – deshalb weicht es vom Rechenweg oben ab. Der IFB-Satz im Modell ist 22 %.“ Neu gerechnet wird entprellt (150 ms, `useDeferredValue`). Erkenntnis `k7-stresstest`, sobald der Fächer gesehen und ein Einwand geprüft wurde.

**Entscheider-Mappe:** `RechnerTeilen` **unverändert** importiert: `rechner="gewerbe-pv"`, `name="Gewerbe-PV-Rechner"`, `pfad="/gewerbe"`, `query={steckbriefQuery(sb)}`, `titel="Photovoltaik für unseren Betrieb – Rechenweg und Stresstest"`, `kampagne="gewerbe_unikat"`, `bericht` im Aufbau wie `bericht()` in `src/components/RechnerGewerbe/GewerbePVRechner.js` (kennzahlen, eingaben, ergebnisse, annahmen, hinweise, `mappe` mit `MAPPE_FELDER`, `stresstest: stresstestBericht(st)`). Am Bildschirm ist alles frei, PDF, Link und Teilen gibt es nach bestätigter E-Mail (Stufe 1). Über `?sb=1…` stellt der Steckbrief den Zustand nach der Rückkehr wieder her.

**SSR-Hülle:** `K7Tabelle` im Startzustand (Caption „Beispielrechnung Wirtschaftlichkeit einer 300-kWp-PV-Anlage auf Netzebene 6“, Fußtext der bisherigen Tabelle wörtlich). Wissensschublade „Steuer, Förderung und Annahmen“ mit den bisherigen Texten (IFB, AfA, EAG, Marktprämie) und dem Satz „Förderungen können die Bemessungsgrundlage des IFB mindern – bitte mit der Steuerberatung abstimmen.“ Dazu `KENNZEICHNUNG.keineBeratung`.

**Ausgang:** primär „Rechenweg mit Ihren Zahlen anfordern“ → `anfrageUrl(sb)`; sekundär „Videotermin – gern mit Ihrer Steuerberatung“ → `/termin?art=video&thema=gewerbe`; Textlink „Kauf, Kredit oder Leasing vergleichen“ → `/rechner/finanzierung`. Steckbrief: `setze({ kwp, amortisationJahre, ueberschussJahr }, "k7")`.

**Mobil:** Die Tabelle bleibt eine Tabelle (2 Spalten: Position | Ergebnis, die Annahme als Unterzeile). Die Regler stehen in Gruppen darunter, Fächer 358 × 240. **Gate:** Stufe 1 `gewerbe-pv` nur für PDF/Link/Teilen. **Recht:** kein Countdown, Fördercall und IFB nur als Kalender- bzw. Rechenfakt, keine Partner-Konditionen, „Beispiel, kein Angebot“. **QA:** testids `pult-tabelle`, `pult-reset`, `einwand-<id>`, `faecher`, `mappe`. Start 34.360 / 6,1 / 10.600.

### K8 · Fahrplan & Projektsteckbrief · „Ablauf und Genehmigung: vom Lastgang zur laufenden Anlage“

**Dateien:** `K8Fahrplan.js` (Server), `K8Insel.js`, `K8FahrplanLinie.js` (Client), `K8Steckbrief.js` (Client). Ton **dunkel**, `#fahrplan`.

**Kopf:** „08 · Geschäftsführung fragt: Was passiert wann – und was müssen wir beitragen?“

**A · Fahrplan:** eine Linie (Desktop horizontal, mobil vertikal) mit 7 Stationen als Buttons: (1) Lastgang & Dach · (2) Wirtschaftlichkeit & Förderung · (3) Netzzugang · (4) EAG-Förderantrag · (5) Montage im laufenden Betrieb · (6) Inbetriebnahme & Erstprüfung · (7) Betrieb, Service & Ausbau. Eine Karte je Station zeigt: was passiert, was Sie liefern, was wir tun, Rechtsgrundlage. Die Texte kommen aus der bisherigen page.js (AblaufLeiste, Recht), **ohne Dauern**. Die Linie zeichnet sich scroll-gekoppelt (motion `useScroll` mit `offset: ["start 80%", "end 60%"]` → pathLength), bei reduzierter Bewegung statisch.
- **Abhängigkeits-Schloss:** Station 6 trägt ein Schloss-Symbol und den Text „erst nach Netzzugang und Förderantrag“. Vor dem Öffnen von 3 und 4 erklärt ein Klick: „Der EAG-Antrag muss vor der Inbetriebnahme gestellt sein; Anzeigen und Genehmigungen müssen dann in erster Instanz vorliegen.“ Sind beide geöffnet, löst sich das Schloss: Die Linie läuft unabhängig vom Scrollstand bis 07 durch (`max(min(scroll, grenze), füllung)`), die Erkenntnis `k8-reihenfolge` erscheint dort, wo geklickt wurde (quer als Band zwischen Stationszeile und Kartenfläche, hoch direkt unter der Station, die das Schloss gelöst hat). Liegt die Rückmeldung eines Klicks unter ≈ 85 % des Bildes (z. B. 1024 × 768), holt die Bühne sie sanft ins Bild, ohne die Stationszeile unter die Navigation zu schieben. Das ist eine Lernmechanik, kein Gate. Sprungziel `#k8-montage` ist das Segment selbst (öffnet Station 5, Fokus auf das gewählte Fenster).
- **Montagefenster** (`Segment` laufende Schicht | Wochenenden | Betriebsurlaub) ändert Karte 5: Kranstellplatz und Logistikwege, Abschaltungen, Brandschutz und Sicherheitsunterweisung. Hinweis-Chip aus den Daten: Werktage mit Tagesmittel < 1,3 × Grundlast in Folge ≥ 5 → „Betriebsurlaub 4.–15. August erkannt (synthetisch)“. Bei eigenen Daten steht das jeweilige Datum.
- Station 4 nennt den Fördercall nur als Kalenderfakt (`FOERDERCALL.zeitraum`, Portal-Link), dazu `fristenImFenster({ zielgruppe: "gewerbe" })` aus `src/data/foerderFristen.js` als Liste. Kein Countdown.
- Station 5 zeigt ein Foto (`/Images/AT/ratgeber/photovoltaik-flachdach.jpg`, next/image, lazy, Alt-Text wie bisher, Bildnachweis `flachdachDornbirn`).
- Rechtliches als Schublade mit vollem Text (SEO): Netzzugang (ElWG), Gewerberecht (Erlass 1.3.2021), Elektrizitätsrecht des Landes, Bauordnung (`/forderungen/baurecht`), Förderung, Versicherung und Brandschutz (ÖVE/ÖNORM E 8101, EN 62446-1). Karte „Mieter der Halle?“ (Dachnutzungsvereinbarung). Einwände `keine-zeit`, `servicepartner`, `entfernung`, `contracting`, `drei-angebote` als kompakte `<details>`.

**B · Projektsteckbrief** (`<section data-steckbrief>` in K8): ein weißes **Deckblatt** auf Navy (max-w 760, weicher Schatten). **Startzustand = vollständig ausgefülltes Beispiel-Dossier** (Endowed Progress, Stand 13.10.2026): Jedes Feld trägt den Startwert seines Kapitels, serverseitig aus denselben Bibliotheken gerechnet (`steckbriefBeispiel()` in `K8Daten.js`: 884 MWh, 2 Schichten, Ost-West 6.000 m² Linz bis 655 kWp, 280 kWp/80 % EV/24 % Autarkie, OÖ NE 6 14,64 ct/kWh, Deckel 230 kW → 85 kW/55 kWh ≈ 4.050 €/a, 243 kVA TOR Typ A, ≈ 6,1 J./≈ 34.360 €/a, Betriebsurlaub). Beispielwerte stehen grau (ink-500, AA) mit Zustands-Pille „Beispiel“; Werte des Besuchers stehen schwarz in einer ov-50-Zeile mit „Ihr Wert“. Oben vier Eckdaten (Anlage, Eigenverbrauch, Überschuss/Jahr, Amortisation) mit Pille „Richtwert · Stand 09/2026“ und dem Satz zu den zwei Sichten (Rechenbeispiel 300 kWp gegenüber Stundenmodell 280 kWp). Je Abschnitt ein Erklärsatz zur Beispielbasis bzw. zu Abweichungen (z. B. Speicher aus 05 → AC 328 kW, TOR Typ B) mit Anker-Link ins Kapitel. **Beispielwerte gehen nie in die Anfrage.** Abschnitte 01–08 = Kapitel: Betrieb · Dach · Anlage · Wert der kWh (Bereich, NE, vermiedene ct) · Leistungspreis · Netzanschluss (AC, TOR-Typ) · Wirtschaftlichkeit · Montagefenster · **„Ihre Erkenntnisse“** (gesammelte `ERKENNTNISSE`-Texte). Aufbau beim Eintritt: sechs Blöcke, Stagger 60 ms, ≤ 0,9 s; der Ausgang (CTA) gehört nicht dazu und ist sofort sichtbar. Außerhalb des Bildes friert das Blatt den zuletzt gesehenen Stand ein (beim ersten Mal: das Beispiel); im Bild gleiten die neuen Werte Zeile für Zeile hinein (Kaskade ≤ 0,7 s, 420 ms je Zahl), bei reduzierter Bewegung sofort. Zahlenfelder sind direkt editierbar (`role="spinbutton"`, deutsch formatiert, ↑/↓/Bild↑/↓ vom angezeigten Wert aus, `liesZahlDe`, `steckbrief.setze`). Fortschritt: „{bausteinZahl} von 7 Bausteinen sind schon Ihre“. CTAs: primär „Anfrage mit diesen Werten senden“ → `anfrageUrl(sb)` (Ereignis `steckbrief_anfrage` mit `{ bausteine }`), sekundär „Im Gewerbe-PV-Rechner weiterrechnen“ → `rechnerUrl(sb)`, Textlinks „Videotermin vereinbaren“ (`/termin?art=video&thema=gewerbe`) und „Steckbrief leeren“. Hinweis: „Der Steckbrief enthält keine personenbezogenen Daten und bleibt in diesem Browser-Tab, bis Sie die Anfrage senden.“

**SSR-Hülle:** Die Stationen und das Deckblatt im Startzustand (vollständiges Beispiel-Dossier) sind statisches HTML und zugleich Platzhalter. **Gate:** keins. **QA:** testids `station-1…7`, `schloss`, `montagefenster`, `steckbrief`, `steckbrief-anfrage`. Die Anfrage-URL enthält kwp, verbrauch und speicher, sobald diese gesetzt sind.

---

## 8. SEO

- Metadaten, canonical und OG bleiben, die H1 bleibt wörtlich. `LoesungSchema` mit `HERO_BILD` bleibt im JSON-LD. Das BreadcrumbList-Schema liefert Breadcrumbs im Hero. FAQPage-Schema kommt **nur** von `Faq` (Einwände ohne Schema).
- Neuer Antwortblock **Kurzantwort** direkt unter dem Hero (H2 + 4 Sätze mit Zahlen, Quelle, Stand) für Snippets und KI-Antworten.
- H2 je Kapitel mit Suchbegriff: Lastgang verstehen · Hallendach/Flachdach Ost-West Süd Trapezblech Shed · Eigenverbrauch und Anlagengröße · Was eine kWh wert ist (Netzbereich, Netzebene) · Leistungspreis senken · Netzanschluss Netzebene 7/6/5, TOR Typ A/B, Parkregler · Wirtschaftlichkeit, Amortisation, Öko-IFB 22 %, EAG · Ablauf und Genehmigung.
- Alle Zahlen stehen als SSR-HTML in den Server-Hüllen. Jede Canvas-, SVG- und 3D-Grafik hat figcaption bzw. aria-label und eine Datentabelle. Neue Tabellen: Netzentgelte 2026 aller 13 Netzbereiche × NE 5/6/7 (vorher 3), Monatsspitzen des Beispielbetriebs, Dacharten, Anlagengröße → Eigenverbrauch, Deckel → Speicher → Ersparnis, Netzebenen, Beispielrechnung.
- Interne Links: `/lastgang-analyse`, `/smart-meter/<betreiber>`, `/rechner/gewerbe-pv(#dach-einzeichnen)`, `/standort-check`, `/schneelast`, `/rechner/e-flotte`, `/ladeinfrastruktur`, `/energiegemeinschaften`, `/service/direktvermarktung`, `/rechner/peak-shaving`, `/gewerbespeicher`, `/ratgeber/peak-shaving-leistungspreis`, `/netzanmeldung`, `/technik/parkregler`, `/ratgeber/tor-erzeuger-netzanschluss`, `/forderungen/richtlinien`, `/forderungen/baurecht`, `/forderungen/steuerlich`, `/ratgeber/investitionsfreibetrag-photovoltaik`, `/ratgeber/eag-investitionszuschuss`, `/ratgeber/photovoltaik-genehmigung`, `/rechner/finanzierung`, `/termin`, `/angebot`.
- Stabile Anker: `#kurzantwort #lastgang #hallendach #eigenverbrauch #kwh-wert #leistungspreis #netzanschluss #wirtschaftlichkeit #fahrplan #faq`, dazu `#stromrechnung` und `#beispielrechnung` für alte Links.
- FAQ: 8 bisherige plus 2 neue (Abschnitt 6).

---

## 9. Rahmenprüfung je Kapitel

| Kapitel | Recht (UWG/EmpCo, Werbeaussagen) | Lead-Gate | Ladezeit | Barrierefreiheit |
|---|---|---|---|---|
| Hero | H1/Zielgruppen-Texte unverändert, „synthetisch“ sichtbar, keine Spitzenaussage | keins | kein Paket, SSR-SVG, LCP = H1, ≤ 20 KB JS | Figure fokussierbar, Pfeiltasten, figcaption, Chips als Buttons |
| K1 | Kennzeichnung synthetisch; eigene Daten ohne Ursachen-Behauptung; Datenschutz-Satz | **Stufe 2** `lastgang-analyse` für eigene Datei (vorher nichts gelesen) | Worker, Canvas, Insel lädt in Nähe | Linsen als Radios, Tastatur-Cursor, aria-live, Monats-Tabelle |
| K2 | Modell und Raster schematisch, Klarhimmel-Hinweis, keine Schneewerte (HORA nie) | keins (Planer-Gate dort) | three nur hier, on demand, Rückfall-SVG | alle Regler nativ, figcaption live, Rückfall ohne WebGL |
| K3 | Annahmen Flotte offen, Marktwerte mit Quelle/Stand, OeMAG-Grenze | keins | simuliere 0,2 ms, rAF | range mit valuetext, Tabelle SSR |
| K4 | Netzentgelte mit BGBl.-Quelle, Abgabe-Verlängerung „offen“, Börse mit SMARD-Attribution | keins | Börse gestreamt (Suspense, 1,5 s) | select statt Karte, Werte als dl |
| K5 | Entwurf 2027 gekennzeichnet, keine Speicherpreise, Staffelstart schematisch | keins (Peak-Rechner-Gate dort) | Kappung vorberechnet im Worker | Deckel per Tastatur + range, Ring-Liste |
| K6 | nur `PARKREGLER_SATZ`, Netzebene „legt der Netzbetreiber fest“ | keins (Fachplaner-Gate dort) | leichtes SVG | Lineal-range, Liste als HTML |
| K7 | Beispiel, kein Angebot; kein Countdown; keine Partner-Konditionen; keine Steuerberatung | **Stufe 1** `gewerbe-pv` (RechnerTeilen) für PDF/Link | 5 Läufe ≈ 15 ms entprellt | echte Tabelle, Regler nativ, output |
| K8 | keine Dauern, Fördercall nur Kalenderfakt, keine personenbezogenen Daten im Steckbrief | keins | leicht | Stationen als Buttons, Schloss erklärt, Felder beschriftet |

Werbeaussagen-Schalter (`src/data/werbeaussagen.js`) bleiben aus: kein TOP 3, kein Marktführer, kein Meisterbetrieb-Siegel, kein eigener Parkregler, keine Kundennamen oder -logos ohne Freigabe, Salzburg AG wird nicht erwähnt. Referenzen nur über `BranchenReferenzen` (freigegeben). Keine erfundenen Zitate, Bewertungen oder Knappheit.

---

## 10. QA und Abnahme

- Playwright bei 390, 768 und 1440 sowie mit `reducedMotion: "reduce"`. Screenshots je Kapitel werden mit dem Read-Werkzeug angesehen.
- Prüfpunkte: Hero-SSR enthält „275 kW“ · K1 zeigt 12 Marker 06:00/06:15 · K2 Süd → Ost-West: 460 → 655 kWp · K3 Start 280 kWp/80 % · K4 Start 14,64 ct/× 2,4 · K5 Deckel 230 → 85 kW/55 kWh/≈ 4.050 € · K6 280 kWp + 85 kW → Typ B · K7 Start 34.360/6,1/10.600 · K8 Anfrage-URL mit kwp/verbrauch/speicher.
- Lighthouse mobil: LCP ≤ 2,5 s, CLS ≤ 0,1, INP < 200 ms. Seitenhöhe mobil ≤ 28.000 px. Keine Konsolenfehler.
- Kontrast AA (inkl. sun-300/ov-400 auf navy-950), Tastatur-Durchlauf aller Regler, sichtbarer Fokus.
- Danach Perfektions-Schleife (abschluss-perfektion.js) bis zwei Runden ohne Befund.

---

## 11. Bewusst verworfen (aus den Expertenkonzepten)

- Serverseitige Paletten-PNG des Teppichs als data-URI (+50–80 KB HTML). Der Teppich liegt unter dem Falz, der Worker ist rechtzeitig fertig.
- Scrollytelling mit fixierter Grafik in K1 (mobil zu lang). Stattdessen fünf Linsen.
- Schneelast-Richtwerte in K2 (Rasterzugriff auf /gewerbe nicht freigegeben). Es bleibt beim Link zum Standort-Check.
- Zweite Österreich-Karte in K2 (Unikat-Regel: die Karte gehört K4).
- Leasing im Pult (keine Partnerkonditionen; Link zum Finanzierungsvergleich).
- „Ein Tag in der Leitwarte“ als zehntes Kapitel (Umfang). Parkregler und Betrieb stecken in K6 und K8.
- Punkte, Zähler, Konfetti, Countdowns.

## 12. Offen

- ~~Bau aller Kapitel (Bau-Agenten), Zusammenbau page.js~~ (erledigt 13.10.2026), ~~Jury-Feinschliff~~ (erledigt 13.10.2026, siehe Abschnitt 6 „Feinschliff nach Jury“), Perfektions-Schleife über die zusammengebaute Seite.
- HTML-Gewicht der Kapitel weiter senken: Die SSR-Startzustände K2–K8 stehen doppelt im HTML und im RSC-Baum. Seitenhöhe mobil kürzen (≈ 33.000 px, Ziel 28.000). Beides braucht einen Umbau der Startzustände bzw. redaktionelle Entscheidungen je Kapitel.
- LCP mobil ≤ 2,5 s nur seitenweit lösbar (render-blockierende globale CSS, Foto-Animation im geteilten PageHero).
- Netzebene (`ne=`) im Angebots-Konfigurator vorbelegen (geteilter Baustein `/angebot`).
- Manrope-Gewichte auf einem echten iPhone prüfen (WebKit unter Windows zeigt sie dünn).
- Die Bündelung des Web Workers (`new URL("./_lastgang.worker.js", import.meta.url)`) im ersten Build bestätigen. Rückfall im Hauptthread ist vorhanden.
- Vorlauf-Agent: `motion`, `three`, `d3-shape`, `d3-scale` mit exakter Version installieren.
