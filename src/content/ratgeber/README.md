# Ratgeber-Artikel Österreich (inhaltsgetrieben)

Jede Datei in diesem Ordner ist ein Artikel unter `https://www.oekovolt.com/ratgeber/<slug>`. Die Seite rendert `src/app/ratgeber/[slug]/page.js` (Sprache `de-AT`, Autor „Ökovolt-Redaktion Österreich“, Fediverse `@ratgeber@oekovolt.com`). Übersicht, Sitemap, RSS, „Weiterlesen“, Inhaltsverzeichnis, Lesezeit und JSON-LD (Article, FAQPage, HowTo, BreadcrumbList) entstehen automatisch.

Die Inhalte gelten für **Österreich** (Rechtslage, Förderung, Steuern, Netzbetreiber). Zielgruppe zuerst: Gewerbe, Industrie, Landwirtschaft, Hotellerie/Tourismus, Gemeinden und Landesversorger; Privat nachgeordnet. Welche Slugs es gibt und wer sie verantwortet, steht in `docs/AT-RATGEBER-PLAN.md` – diese Slugs sind verbindlich.

**Referenz:** `photovoltaik-gewerbe.js`

## Neuen Artikel anlegen

1. Datei `src/content/ratgeber/<slug>.js` nach dem Muster unten anlegen. Der Dateiname entspricht dem Slug.
2. `node scripts/ratgeber-index.mjs` ausführen, damit der Artikel registriert wird.
3. `npx eslint src/content/ratgeber/<slug>.js` und die Seite im Browser prüfen (Desktop und Handy).
4. OG-Bild erzeugen: `node scripts/og-bilder.mjs` (legt `public/og/ratgeber/<slug>.jpg` an).

Dateien, die mit `_` beginnen, werden ignoriert (Entwürfe).

## Aufbau

```js
const artikel = {
  slug: "eag-investitionszuschuss",                  // = Dateiname, nur a–z, 0–9, Bindestrich
  title: "EAG-Investitionszuschuss 2026: Fördercalls, Sätze, Ablauf",   // H1, 50–70 Zeichen
  seoTitle: "EAG-Investitionszuschuss 2026 | Ökovolt",   // <title>, max. 60 Zeichen, endet auf „| Ökovolt“
  kurzTitel: "EAG-Investitionszuschuss",             // Breadcrumb, Karten
  description: "…",                                  // 140–160 Zeichen, Hauptkeyword vorn, Nutzen + Anreiz
  excerpt: "…",                                      // 1–2 Sätze für Karten und Hero
  hauptKeyword: "eag investitionszuschuss",
  keywords: ["…", "…"],                              // 5–8 Varianten und Nebenkeywords
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",           // exakt einer der 6 Werte unten
  bild: "/Images/…",                                 // aus /public
  bildAlt: "Beschreibung des Bildinhalts",
  badge: { wert: "150 €/kWp", text: "Kategorie A, Fördercall 2026" },  // optional, schwebende Kennzahl im Hero

  kurzFazit: ["3–5 zitierfähige Kernaussagen mit Zahlen"],

  abschnitte: [
    { id: "saetze", titel: "H2 als Frage oder klare Aussage", tocLabel: "kurz fürs Inhaltsverzeichnis (optional)", bloecke: [ /* siehe Blocktypen */ ] },
  ],

  faq: [{ q: "Frage wie gesucht?", a: "Antwort, 2–4 Sätze, darf [Links](/pfad) enthalten." }],
  howTo: { name: "…", schritte: [{ name: "…", text: "…" }] },       // optional, nur bei echten Anleitungen
  passend: [{ href: "/…", titel: "…", text: "…" }],                   // 2–4 interne Verweise
  quellen: [{ titel: "Institution – Titel", url: "https://…", stand: "09/2026" }],  // 4–8 belastbare Quellen
  seitenCta: { titel: "…", text: "…", href: "/foerdercheck", label: "…" },
  cta: { title: "…", text: "…", primary: { label: "Projekt anfragen", href: "/angebot" }, secondary: { label: "…", href: "/…" } },
};

export default artikel;
```

**Keine Imports aus `@/data/einspeiseverguetung`, `@/data/solarrechner` oder `@/lib/solarrechner`** in Artikeln – diese Module werden für Österreich umgebaut. Zahlen stehen direkt im Artikel, mit Stand-Datum und Quelle in `quellen`. Rechenbeispiele vorab durchrechnen und gerundet eintragen; Annahmen immer in der Tabellen-`fussnote` offenlegen.

### Kategorien (feste Werte, siehe `KATEGORIEN` in `src/lib/ratgeber.js`)

- `Kosten & Wirtschaftlichkeit`
- `Förderung, Steuern & Recht`
- `Netz, Energiegemeinschaften & Markt`
- `Technik & Planung`
- `Speicher & Eigenverbrauch`
- `E-Mobilität & Sektorkopplung`

### Blocktypen

| typ | Felder | Zweck |
|---|---|---|
| `p` | `text` | Absatz. Erster Satz eines Abschnitts beantwortet die H2 direkt, gern **fett** (Featured Snippet / KI-Antworten). |
| `h3` | `text` | Zwischenüberschrift |
| `liste` | `punkte[]`, `nummeriert?` | Aufzählung |
| `checkliste` | `punkte[]` | Haken-Liste |
| `tabelle` | `caption`, `kopf[]`, `zeilen[][]`, `hervorheben?` (Spaltenindex), `markierteZeile?`, `fussnote?`, `minBreite?` | Echte Tabelle – wichtig für Snippets |
| `kasten` | `variant` (`info`/`tipp`/`wichtig`/`recht`), `titel?`, `text` | Merkkasten |
| `kennzahl` | `wert`, `titel`, `text` | Große Kennzahl (dunkel) |
| `karten` | `items[{titel,text}]`, `cols?` (2/3) | Karten-Raster |
| `ablauf` | `schritte[[titel, text]]` | Nummerierter Ablauf |
| `tool` | `href`, `titel`, `text`, `label` | Grüne Karte zu einem Rechner/Tool |

**Textformatierung** in allen Textfeldern: `**fett**`, `[Linktext](/interner/pfad)` oder `[Linktext](https://extern)`. Kein HTML.

## Redaktionelle Regeln (Österreich)

- **Sie-Form**, sachlich, österreichisches Deutsch: Jänner, Gemeinde (nicht „Kommune“), Netzbetreiber, Förderwerber, Förderansuchen, Einspeisetarif, Überschusseinspeisung, Elektrotechniker, Baubewilligung/Bauanzeige. Keine Werbefloskeln.
- **Rechtslage Österreich** mit Stand-Datum: EAG, ElWG, EABG, EStG (IFB, AfA, GFB), UStG, ElAbgG, TOR Erzeuger, OVE/ÖVE-Normen, Bauordnungen der Länder. Keine deutschen Begriffe oder Normen (EEG 2023, KfW, § 14a EnWG, VDE-AR-N, Marktstammdatenregister, Bundesnetzagentur).
- **Fakten:** Jede Zahl muss belegbar sein; Quellen in `quellen` (4–8). Bevorzugt: BMF, USP.gv.at, RIS, OeMAG/EAG-Förderabwicklungsstelle, E-Control, WKO, KPC/umweltfoerderung.at, Statistik Austria, BMWET/BMIMI-Marktstatistik (nachhaltigwirtschaften.at), PV&B Austria (Bundesverband Photovoltaic & Battery Austria), Eurostat. Wo Zahlen fehlen: als Richtwert/Annahme kennzeichnen.
- **Belegte Aussagen über Ökovolt Österreich** (nichts darüber hinaus): Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething (Oberösterreich), seit 2012, in ganz Österreich tätig; Planung, Netzanmeldung, Montage, Wartung aus einer Hand; **eigene Technik: Parkregler (EZA-Regler), Fernwartung, SCADA**; Partner/Hersteller: Fronius, Huawei, Solis, Sigenergy, BYD, meteocontrol (Freigabe für deren Marketing- und Produktfotos; Bildquellen dokumentieren). Keine Ökovolt-Preise, Kundennamen, Mitarbeiterzahlen, Garantien, Reaktionszeiten oder Auszeichnungen erfinden.
- **Bilder:** vorhandene aus `public/Images/**` oder freie Bilder (Pixabay/Unsplash/Pexels-Lizenz, Wikimedia Commons CC0/CC BY) unter `public/Images/AT/ratgeber/`, ≤ 400 KB, dokumentiert in `public/Images/AT/QUELLEN-ratgeber-*.md`.
- **Interne Links:** mindestens 5 im Fließtext – zu passenden Ratgebern (Slugs laut Plan), AT-Leistungsseiten (`/gewerbe`, `/gewerbespeicher`, `/kommunen`, `/hotellerie-tourismus`, `/landwirtschaft`, `/service/finanzierung`, `/service/direktvermarktung`, `/technik/parkregler`, `/foerdercheck`, `/forderungen/bundesfoerderung`, `/forderungen/steuerlich` …) und zum Lexikon (`/wissen/lexikon#<id>`, IDs in kebab-case aus `src/data/lexikon.js`, z. B. `#ifb`, `#eag`, `#oemag`, `#leistungspreis`, `#netzebene`, `#ppa`, `#peak-shaving`, `#tor-erzeuger`, `#eza-regler`; im Zweifel nur `/wissen/lexikon`).
- **Umfang:** 1.800–3.000 Wörter Inhalt. Tiefe vor Länge – nichts aufblähen.
- **Aufbau:** Suchintention zuerst beantworten (Kurzfazit + erster Abschnitt), dann Details, Tabellen, Praxisbeispiele mit offengelegten Annahmen, Fehler/Grenzen, Vorgehen, FAQ (5–8). Hinweis „keine Steuer- oder Rechtsberatung“, wo Steuer/Recht behandelt wird.
