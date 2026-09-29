# Design-Leitfaden oekovolt.com – Premium-Überarbeitung

Ziel: Die österreichische Site muss optisch mindestens auf dem Niveau von oekovolt.de sein – eher darüber.
Anspruch: „Beste PV-Website des Jahres“. Der Kunde bewertet das AUSSEHEN im Browser, nicht den Code.
Referenz im Browser: DE-Seite läuft auf http://localhost:3000, AT-Seite auf http://localhost:3001
(Dev-Server mit Hot Reload – Änderungen sind nach dem Speichern sofort sichtbar, NICHT neu starten).

## Pflicht: visuelle Kontrolle mit echtem Browser

Werkzeug (Playwright/Chromium ist installiert):

```
node "C:/Users/denis/AppData/Local/Temp/claude/c--Users-denis-Desktop-Oekovolt-Web-DE/e294f8f1-e06d-4d4e-b212-c7906a298855/scratchpad/browser/shot.mjs" <url> <name> [breite] [max-abschnitte]
```

- Speichert Bildschirm-Abschnitte als `.../scratchpad/browser/shots/<name>-NN.png` → mit dem Read-Tool ansehen.
- Gibt JSON aus: Seitenhöhe, horizontaler Überlauf, Konsolenfehler. Überlauf = Fehler, Konsolenfehler beheben.
- JEDE Seite, die du änderst: vorher und nachher ansehen, Desktop (1440) UND Mobil (390).
- Vergleiche mit der passenden DE-Seite (z. B. `http://localhost:3000/produkte/stromspeicher`).
- Wähle für `<name>` ein eindeutiges Präfix (dein Bereich), damit sich Agenten nicht überschreiben.

## Warum die AT-Seiten „billig“ wirken (Befund)

- Textwände: 15–20 Bildschirmhöhen pro Seite (DE: 7–10), Tabelle an Tabelle, kaum Bilder.
- Keine Bild-Text-Kompositionen (SplitMedia), keine großen Fotokarten, keine Logos/Marquees.
- Keine Interaktion: kaum Rechner, Schieberegler, Tabs, Umschalter, Live-Daten.
- Monotoner Rhythmus: weiß – weiß – weiß; zu wenig dunkle Kontrast-Sektionen, wenig Tiefe.

## Gestaltungsregeln (verbindlich)

1. **Corporate Design unverändert**: Farben/Tokens (`ov-*`, `ink-*`, `sand-*`, `navy-*`, `sun-*`), Schriften
   (Manrope Display, Inter Text), Radien (rounded-3xl/[2rem]), vorhandene Klassen (`ov-h1`, `ov-h2`, `ov-h3`,
   `ov-lead`, `ov-card-hover`, `ov-glass`, `ov-noise`, `ov-grid-bg`, `ov-text-gradient`, `ov-text-gradient-light`,
   `ov-num`, `ov-container`) und Komponenten (`PageHero` variant="immersive", `Section` tone white/sand/green/dark,
   `SectionHeading`, `SplitMedia`, `FeatureGrid`, `Steps`, `Faq`, `CtaBand`, `Reveal`, `CountUp`, `Marquee`,
   `Querverweise`, `LiveTicker`, Rechner-`bausteine`). Schau dir `src/app/globals.css` und die DE-Seiten an.
2. **Seitenlänge**: Hauptseiten 8–11 Bildschirmhöhen. Fachtiefe bleibt erhalten, aber verdichtet:
   Detailtabellen/Normtexte in **Tabs, Akkordeons („Für Technik & Einkauf“) oder umschaltbare Ansichten**.
   SEO-Text darf im DOM bleiben (Akkordeon-Inhalt server-gerendert, nur visuell eingeklappt).
3. **Rhythmus je Seite** (Richtschnur): Immersiver Hero mit starkem Foto → Kennzahlenband (CountUp) →
   visuelle Lösungskarten (Foto-Bento) → **interaktives Element** (Rechner/Konfigurator/Umschalter/Live-Daten)
   → SplitMedia mit Foto → dunkle Kontrast-Sektion (Technik, Diagramm, Zahlen) → Ablauf (Steps) →
   Fachdetails (Tabs/Akkordeon) → FAQ → Querverweise → CtaBand.
4. **Bilder**: groß, hochwertig, echt wirkend. Vorhandene aus `public/Images/**` + neue freie Bilder
   (Unsplash/Pexels/Pixabay-Lizenz oder Wikimedia CC0/CC BY), hochauflösend (1920 px, ≤ 450 KB, webp/jpg),
   unter `public/Images/AT/<bereich>/`, dokumentiert in `public/Images/AT/QUELLEN-<bereich>.md`
   (erscheint automatisch auf /bildnachweis). Keine fremden Markenlogos, keine erkennbaren fremden Firmennamen.
   Immer `next/image` mit `sizes`, sinnvolles `alt`.
5. **Animation & Tiefe** (edel, nicht verspielt): Reveal beim Scrollen gestaffelt, CountUp für Zahlen,
   Hover-Lift auf Karten, Glas-Karten auf dunklem Grund, weiche Verläufe/Glows (`blur-[120px]`-Kreise wie in
   CtaBand), Parallax/Scroll-gebundene Effekte dezent, SVG-Diagramme mit Strich-Animation, Marquee für
   Hersteller/Referenzen. `prefers-reduced-motion` respektieren (motion-safe:). Keine Layout-Sprünge (CLS).
6. **Interaktion**: Jede Hauptseite bekommt mindestens ein Element, mit dem der Besucher etwas tun kann
   (Rechner, Vergleichsumschalter, Szenario-Regler, Checkliste, Karte, Live-Wert). Ziel: Anfrage.
7. **Abstände & Proportionen**: Section-Abstände wie DE (`space="lg"`/`"md"`), Überschriften max. 2–3 Zeilen,
   Fließtext max. ~70 Zeichen Zeilenlänge, Karten gleich hoch, Raster sauber (keine verwaisten Einzelkarten
   in der letzten Reihe), Mobil: nichts abgeschnitten, Tabellen scrollbar oder als Karten.
8. **Inhalt bleibt fachlich korrekt** – Zahlen/Quellen nicht verändern, nur präsentieren. Keine erfundenen
   Fakten über Ökovolt (siehe `docs/AT-BRIEFING.md`).

## Technische Regeln

- Kein `npm run build`, kein neuer Dev-Server (läuft auf 3001), kein Commit, keine Paket-Installation im Projekt.
- Nur eigene Dateien/Ordner laut Auftrag bearbeiten. Gemeinsame Dateien (`src/components/ui/*`,
  `globals.css`, `navigation.js`, `layout.js`, `footer.js`, `navbar.js`, `sitemap.js`, `verlinkung.js`)
  NICHT ändern – neue wiederverwendbare Bausteine im eigenen Komponentenordner anlegen; Bedarf melden.
- Client-Komponenten nur wo nötig (`"use client"`), Server-Komponenten für Inhalt/SEO.
- `npx eslint <deine Dateien>` sauber. Metadata/JSON-LD/FAQ-Schema erhalten.
- Bericht am Ende: geänderte Dateien, neue Routen, vorher/nachher-Befund (Seitenhöhe, was verbessert),
  offene Punkte.
