# VVT (Art. 30 Abs. 1 DSGVO) – Kundenbühne der Referenzprojekte

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 · Verantwortlicher: Ökovolt Solartechnik GmbH, Gewerbegebiet 10,
> 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) · Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

## Umsetzung (belegt im Code)

- Seiten je Referenzprojekt: `/referenzen/projekte/[title]` (Kundenporträt), `…/siegel`, `…/teilen` (Social-Media-Kit),
  `…/esg` (ESG-Kurzbericht), Bildrouten `…/bild/[format]`. Komponenten unter `src/components/Kundenbuehne/`.
- Logik: `src/lib/kundenbuehne.js` (reine Funktionen), `src/lib/kundenbuehneServer.js` (Laden).
- Datenquellen, in dieser Reihenfolge:
  1. **Backoffice**, DocType „Projekt“ (`oekovolt_app`): Felder `website_url`, `linkedin`, `instagram`, `facebook`,
     `youtube`, `xing`, `tiktok`, `x` (nur `https://`), `branche`, `portraet`, `portraet_quellen`, `zitat`,
     `zitat_person`, `freigabe_zitat`, `logo`, `freigabe_logo` (`Import-Backend-Frappe/apps/oekovolt_app/README.md`,
     Abschnitt „Kundenbühne“).
  2. **`src/data/kunden.js`** (Stand 30.09.2026): Recherche auf den **offiziellen Websites der Unternehmen** (Impressum,
     „Über uns“); Social-Media-Profile nur, wenn sie im Kopf- oder Fußbereich der offiziellen Website verlinkt sind;
     Porträt in eigenen Worten mit Quellenliste und Prüfdatum.
- **Freigaben:** Zitat und Logo werden nur mit Freigabe gezeigt. Das Backoffice liefert `zitat`/`zitat_person` und
  `logo_url` nur bei gesetztem Häkchen, sonst `null`; in `kunden.js` ist `freigabe` bei allen Einträgen `false`.
- Auf der Seite werden die Quellen des Porträts und das Prüfdatum angezeigt (`KundenPortraet.js`).
- Referenzkarte: Koordinaten auf **Ortsebene** aus dem Ortsnamen (`src/lib/referenzOrte.js`), keine Hausadressen.

## Eintrag

| Angabe | Inhalt |
|---|---|
| **Zweck** | Darstellung von Referenzprojekten und Kund:innen (Unternehmensporträt, Siegel, Social-Media-Kit, ESG-Kurzbericht mit geschätzten Kennzahlen) als Nachweis der eigenen Leistung und als Angebot an die Kund:innen zur eigenen Kommunikation |
| **Rechtsgrundlage** | Unternehmensdaten aus öffentlichen Quellen: berechtigtes Interesse an der Darstellung eigener Referenzen (Art. 6 Abs. 1 lit. f DSGVO, soweit überhaupt personenbezogene Daten betroffen sind); Zitat mit Name der zitierten Person und Logo: Einwilligung bzw. Freigabe (Art. 6 Abs. 1 lit. a DSGVO). `[OFFEN: Ist die Nennung als Referenz im Auftrag/in den AGB vereinbart? Sonst Zustimmung der Kund:innen zur Referenznennung einholen – das ist auch vertrags- und wettbewerbsrechtlich relevant.]` |
| **Betroffene** | Überwiegend **juristische Personen** (GmbH, KG, AG). Natürliche Personen, soweit (a) ihr Name im Firmenwortlaut steht (z. B. „Johann Bartlechner GmbH & Co. KG (HABA-Beton)“, „Herbert Handlos Gesellschaft m.b.H.“), (b) das Porträt Gründer:innen oder Eigentümer:innen nennt (z. B. „von den Brüdern Helmuth und Alwin Lehner gegründet“ bei ALPLA), (c) eine Person zitiert wird. |
| **Datenkategorien** | Firmenwortlaut, Branche, Ort, Website, Links auf Social-Media-Profile des Unternehmens, Kurzporträt, Quellen-URLs, Prüfdatum; Projektdaten (Leistung, Jahr, Ort, Bilder); optional Zitat mit Name/Funktion der Person und Logo |
| **Herkunft der Daten (Art. 14 Abs. 2 lit. f)** | Öffentlich zugängliche Quellen: offizielle Websites der Unternehmen (je Eintrag in `quellen` belegt), eigene Projektdaten; Zitat und Logo von den Kund:innen selbst |
| **Besonderheit Österreich** | § 1 DSG (Grundrecht auf Geheimhaltung) wird in Österreich grundsätzlich auch auf juristische Personen angewendet; für öffentlich zugängliche Unternehmensdaten besteht allerdings kein schutzwürdiges Geheimhaltungsinteresse (§ 1 Abs. 1 Satz 2 DSG). `[OFFEN: rechtlich bestätigen]` |
| **Empfänger** | Öffentlichkeit (Website); Kund:innen, die das Social-Media-Kit selbst herunterladen und teilen |
| **Auftragsverarbeiter** | Hosting Website `[OFFEN]`; Backoffice (Hetzner, Nürnberg) `[OFFEN: AV-Vertrag]` |
| **Drittland** | Keines durch die Website. `[OFFEN: Logos nur vom eigenen Server bzw. Backoffice ausliefern. KundenPortraet.js lädt das Logo „ohne next/image“ direkt; läge die Logo-URL auf einem fremden Server, erhielte dieser beim Seitenaufruf die IP-Adresse der Besucher:innen.]` |
| **Speicherdauer** | Solange das Projekt als Referenz veröffentlicht ist (`veroeffentlicht` im Backoffice) bzw. der Eintrag in `kunden.js` steht. Bei Widerspruch oder Widerruf: Entfernen des Eintrags bzw. Zurücksetzen der Freigabe, danach neu bauen/Cache leeren (Projekt-Antworten sind 10 Minuten gecacht). |
| **Richtigkeit (Art. 5 Abs. 1 lit. d)** | Prüfdatum je Eintrag (`geprueftAm`); `[OFFEN: Porträts und Social-Links mindestens jährlich prüfen; zuständige Person benennen]` |
| **TOM** | Social-Links und Quellen nur mit `https://` (Prüfung im Backoffice beim Speichern); Freigabe-Häkchen werden nicht ausgeliefert; Zitat/Logo ohne Freigabe nicht speicherbar bzw. nicht sichtbar; Einträge ohne belegbare Quelle werden nicht aufgenommen (Liste im Dateikopf von `kunden.js`). |
| **DSFA** | Nicht erforderlich. |

## Informationspflicht (Art. 14 DSGVO) und Widerspruch

- Soweit natürliche Personen betroffen sind, greift die Ausnahme des Art. 14 Abs. 5 lit. b DSGVO (unverhältnismäßiger
  Aufwand) nur eingeschränkt. `[OFFEN: Empfehlung – Kund:innen vor der Veröffentlichung der Kundenbühne per E-Mail
  informieren (Porträttext, Quellen, Widerspruchsmöglichkeit) und das Einverständnis zur Referenznennung dokumentieren.]`
- `[OFFEN: Projekte, deren Kund:in ein Einzelunternehmen oder eine Privatperson ist, nur mit ausdrücklicher Einwilligung
  zeigen. kunden.js schließt z. B. „spar-ingrid-teufelberger“ bewusst aus – das Backoffice hat dafür keine Prüfung.]`

**Textvorschlag für die Datenschutzerklärung (neuer Abschnitt, z. B. nach Punkt 18):**

> **Referenzprojekte und Kundenporträts.** Auf den Seiten unserer Referenzprojekte stellen wir unsere Kundinnen und
> Kunden kurz vor. Dafür verwenden wir Angaben, die die Unternehmen selbst öffentlich machen – etwa Firmenwortlaut,
> Branche, Standort, Website und die dort verlinkten Social-Media-Profile – und nennen die Quellen auf der jeweiligen Seite.
> Zitate und Logos zeigen wir nur mit Freigabe. Soweit dabei personenbezogene Daten betroffen sind, etwa Namen im
> Firmenwortlaut, stützen wir uns auf unser berechtigtes Interesse an der Darstellung unserer Referenzen (Art. 6 Abs. 1
> lit. f DSGVO), bei Zitaten auf Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können jederzeit widersprechen bzw.
> Ihre Freigabe widerrufen; eine Nachricht an office@oekovolt.at genügt.
