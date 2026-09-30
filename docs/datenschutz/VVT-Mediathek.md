# VVT (Art. 30 Abs. 1 DSGVO) – Mediathek (selbst gehostete Kurzvideos)

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 · Verantwortlicher: Ökovolt Solartechnik GmbH, Gewerbegebiet 10,
> 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) · Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

## Umsetzung (belegt im Code)

- Seiten: `/mediathek`, `/mediathek/[slug]`; Baustein „Presse & News“ (`src/components/Reels/ReelsAbschnitt.js`).
- Daten: `src/data/reels.js`. Laut Dateikopf: „Die Videos liegen auf unserem eigenen Server (public/videos/reels/). Es wird
  nichts von Facebook eingebettet oder automatisiert abgerufen – keine Verbindung zu Meta.“ Die Facebook-Seite ist nur als
  normaler Link hinterlegt.
- Wiedergabe mit dem HTML-`<video>`-Element (`ReelPlayer.js`, `ReelKachel.js`): `preload="none"`, Vorschaubild als
  `poster`, optional Untertitel (WebVTT) vom eigenen Server; Kacheln spielen stumm. Keine Einbettung von YouTube, Vimeo oder
  Meta, keine Drittanbieter-Skripte.
- Einpflegen: Marketing lädt eigene Reels aus der Meta Business Suite herunter und optimiert sie lokal mit
  `scripts/reels-optimieren.mjs` (ffmpeg).
- **Stand 30.09.2026:** Die Liste `REELS` ist leer (nur ein auskommentiertes Beispiel); es ist noch kein Video
  veröffentlicht.

## Zwei getrennte Blickwinkel

### 1. Besucher:innen der Mediathek

Beim Abspielen werden nur die Videodateien vom eigenen Server geladen. Dabei fallen ausschließlich die üblichen
Server-Logdaten an (Datenschutzerklärung Punkt 3). **Keine Übermittlung an Dritte**, keine Cookies, kein Tracking durch die
Mediathek selbst. Die allgemeine Statistik (Umami, Google Analytics nach Einwilligung, Heatmap nach Einwilligung) erfasst
Seitenaufrufe und Klicks wie auf jeder anderen Seite. Ein eigener VVT-Eintrag für Besucher:innen ist daher nicht nötig.

### 2. In den Videos gezeigte Personen

| Angabe | Inhalt |
|---|---|
| **Zweck** | Darstellung des Unternehmens, von Projekten, Baustellen und Team in der eigenen Öffentlichkeitsarbeit |
| **Rechtsgrundlage** | Beschäftigte und Kund:innen, die erkennbar im Mittelpunkt stehen: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), schriftlich dokumentiert und jederzeit widerrufbar; Personen als Beiwerk (z. B. Passant:innen, Gruppen bei Veranstaltungen): berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO). Zusätzlich Bildnisschutz nach § 78 UrhG (keine Verbreitung, wenn berechtigte Interessen der abgebildeten Person verletzt würden). `[OFFEN: rechtlich bestätigen, insbesondere für Beschäftigte im Dienstverhältnis – Einwilligung muss freiwillig sein.]` |
| **Betroffene** | Beschäftigte, Kund:innen und deren Mitarbeitende, Partnerbetriebe, Gäste bei Veranstaltungen |
| **Datenkategorien** | Bild und Ton (Stimme), ggf. Name und Funktion in Titel, Beschreibung oder Untertitel; ggf. erkennbare Kfz-Kennzeichen oder Hausadressen im Bild |
| **Empfänger** | Öffentlichkeit (Website); dieselben Videos sind bereits auf Meta-Plattformen veröffentlicht (eigener Kanal, eigene Verantwortung dort) |
| **Auftragsverarbeiter** | Hosting der Website `[OFFEN]` |
| **Drittland** | Keines durch die Website |
| **Speicherdauer** | Solange das Video veröffentlicht ist; bei Widerruf einer Einwilligung Entfernung aus `REELS` und Löschen der Dateien in `public/videos/reels/` mit dem nächsten Deploy. `[OFFEN: Frist für die Umsetzung eines Widerrufs festlegen, z. B. 5 Arbeitstage]` |
| **TOM / Prozess** | Vor dem Einpflegen: Einwilligungen der erkennbaren Personen prüfen; Kfz-Kennzeichen, Hausnummern und Bildschirminhalte unkenntlich machen; keine Aufnahmen von Kindern ohne Einwilligung der Obsorgeberechtigten; Musikrechte prüfen (Hinweis im Dateikopf von `reels.js`). `[OFFEN: Prozess und Vorlage für Einwilligungserklärungen erstellen; zuständige Person im Marketing benennen]` |
| **DSFA** | Nicht erforderlich. |
| **Informationspflicht** | Gegenüber den gezeigten Personen mit der Einwilligungserklärung (Art. 13 DSGVO). In der Datenschutzerklärung genügt ein kurzer Hinweis `[OFFEN: optional ergänzen]`. |
