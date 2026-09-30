# VVT (Art. 30 Abs. 1 DSGVO) – Klick- und Scroll-Heatmap

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 · Verantwortlicher: Ökovolt Solartechnik GmbH, Gewerbegebiet 10,
> 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) · Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

## Umsetzung (belegt im Code)

| Baustein | Datei | Wirkung |
|---|---|---|
| Sammler im Browser | `src/components/Statistik/HeatmapSammler.js`, eingebunden über `Heatmap.js` in `src/components/Reusable/LayoutWrapper.js` | läuft nur, wenn im Cookie `cookieConsent` das Feld `statistics` `true` ist; reagiert auf das Ereignis `ov-consent` und verwirft beim Widerruf den laufenden Seitenaufruf |
| Einwilligung | `src/components/Cookies/cookiecomponent.js` | Heatmap hat keinen eigenen Schalter, sie folgt der Kategorie „Statistik“ (gemeinsam mit Google Analytics); eigener Beschreibungstext mit Link auf `/datenschutz#heatmap` |
| Gemeinsame Regeln | `src/lib/heatmap.js` | Ausnahmen, Rundung, Längenprüfung |
| Empfang | `src/app/api/heatmap/route.js` (POST) | prüft und kürzt die Daten, drosselt je IP und leitet **ohne IP-Adresse** an das Backoffice weiter |
| Speicherung | Frappe `heatmap_zelle/api.py` → DocTypes Heatmap Seite, Heatmap Zelle, Heatmap Scroll | nur Monatszählwerte (atomar hochgezählt) |
| Auswertung | Bericht „Heatmap Auswertung“ im Desk; visuelle Ansicht auf der Website nur mit `HEATMAP_TOKEN` (`GET /api/heatmap`, sonst 404) | nur zusammengefasste Werte |

## Eintrag

| Angabe | Inhalt |
|---|---|
| **Zweck** | Verbesserung der Bedienbarkeit der Website: welche Elemente angeklickt oder übersehen werden und wie weit Seiten gelesen werden |
| **Rechtsgrundlage** | Einwilligung, Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 165 Abs. 3 TKG 2021 (Auslesen von Informationen aus dem Endgerät durch das Skript). Widerruf jederzeit über „Privatsphäre-Einstellungen“/„Cookie-Einstellungen“ im Seitenfuß. |
| **Betroffene** | Website-Besucher:innen, die in „Statistik“ eingewilligt haben |
| **Datenkategorien – im Browser erhoben, je Seitenaufruf** | Seitenpfad ohne URL-Parameter; Gerätetyp aus der Fensterbreite (mobil < 768 px, tablet < 1.200 px, sonst desktop); je Klick ein kurzer CSS-Selektor des angeklickten Elements (id, `data-heatmap`, `name` bei Formularfeldern oder Tag mit Position – **nie Texte oder Eingabewerte**) und die relative Klickposition im Element (auf 0,05 gerundet); höchstens 100 Klicks; maximale Scrolltiefe (auf 10 % gerundet) |
| **Kurzfristig verarbeitet, nicht gespeichert** | IP-Adresse: nur im Arbeitsspeicher des Website-Servers als gesalzener SHA-256-Hash für die Drosselung (120 Übermittlungen je 10 Minuten); das Salz wechselt mit jedem Serverstart. Wird nicht an das Backoffice weitergegeben. |
| **Gespeichert (Backoffice)** | Heatmap Seite: `pfad`, `geraet`, `monat`, `aufrufe`; Heatmap Zelle: `pfad`, `geraet`, `selektor`, `rx`, `ry`, `monat`, `anzahl`; Heatmap Scroll: `pfad`, `geraet`, `tiefe`, `monat`, `anzahl`. Keine Sitzungs-, Geräte- oder Personenkennungen, keine einzelnen Besuche oder Klickverläufe. |
| **Nicht erfasst** | Keine Cookies oder Browserspeicher durch den Sammler; Seiten `/scan`, `/fortsetzen`, `/tv…`, `/hinweisgebersystem…`; Pfade mit tokenartigen Segmenten; Adressen mit Parametern wie `token`, `key`, `code`, `secret`, `sig`, `auth`, `heatmap`; Klicks im Ansichtsmodus |
| **Personenbezug** | Die gespeicherten Monatszählwerte sind nach Einschätzung aus der Umsetzung nicht mehr personenbezogen. Personenbezogen ist die Erhebung im Browser und die kurzfristige Verarbeitung der IP-Adresse beim Empfang. `[OFFEN: Einschätzung bestätigen]` |
| **Empfänger intern** | Rollen **Marketing** und System Manager (nur Lesen der Zählwerte, Bericht, Link zur visuellen Ansicht). Die API-Rolle „Website API“ schreibt die Zählwerte. |
| **Empfänger extern / Dritte** | Keine. Eigenes Skript vom eigenen Server; keine Drittanbieter-Bibliothek beim Sammeln (die Anzeige-Bibliothek lädt nur im Ansichtsmodus). |
| **Auftragsverarbeiter** | Hosting Website `[OFFEN]`; Hosting Backoffice (Hetzner, Nürnberg) `[OFFEN: AV-Vertrag]`. Die Datenschutzerklärung sagt Hosting im EWR zu (`Import-Backend-Frappe/README.md`). |
| **Drittland** | Nein |
| **Speicherdauer** | Täglicher Job `heatmap_zelle.api.alte_monate_loeschen`: behalten werden der laufende Monat und die 13 Vormonate – **nichts ist älter als 14 Monate** (Datenschutzerklärung Punkt 5 nennt ebenfalls 14 Monate). |
| **TOM** | Einwilligungsprüfung im Browser; nur Same-Origin-Beacons (`Sec-Fetch-Site`); Größenlimit 40.000 Zeichen; strenge Prüfung von Pfad, Gerät, Selektor und Koordinaten auf Website und Backoffice; höchstens 2.000 verschiedene Pfade je Gerät und Monat; Ansicht nur mit Token (mind. 16 Zeichen, Vergleich in konstanter Zeit, Sperre nach 20 Fehlversuchen je 10 Minuten); Antworten `no-store`, `noindex`. |
| **DSFA** | Nicht erforderlich (keine Profile, keine Kennungen, nur aggregierte Speicherung). `[OFFEN: bestätigen]` |
| **Informationspflicht** | Datenschutzerklärung Punkt 5 (Abschnitt `#heatmap`) und Cookie-Banner. Stimmt mit dem Code überein. |

## Offene Punkte

- `[OFFEN: Die Einwilligung „Statistik“ umfasst Google Analytics und die Heatmap gemeinsam. Prüfen, ob eine getrennte Wahl je Dienst angeboten werden soll (Granularität der Einwilligung).]`
- `[OFFEN: HEATMAP_TOKEN nur an Marketing/Geschäftsführung weitergeben und bei Personalwechsel tauschen; der Token steht in Links des Berichts.]`
