# Übergabe: oekovolt.com (Österreich) – Stand 29.09.2026 (inkl. Premium-Überarbeitung)

Branch `at-launch` (lokal, nicht gepusht). Produktions-Build fehlerfrei, QA-Crawl über alle 199
Sitemap-URLs: 0 Fehlerseiten, 0 interne 404-Links, 0 fehlende Lexikon-Anker, Title/Description/
Canonical/H1/JSON-LD überall gültig. Grundlagen: `docs/AT-BRIEFING.md`, `docs/AT-RATGEBER-PLAN.md`.

## Was gebaut wurde

- **Basis:** zentrale Firmendaten `src/lib/site.js` (FN, UID, GISA, Gesellschafter inkl. Salzburg AG 49 %),
  Organisations-Schema, Navigation mit Gewerbe-Fokus, Footer mit Rechtevermerk der deutschen Schwester.
- **Recht:** Impressum (ECG/UGB/GewO/§ 25 MedienG, Urheber- und Markenrechte bei der ÖKOVOLT GmbH
  Solartechnik), AGB (B2B + KSchG/FAGG), Datenschutz (DSGVO/DSG/TKG 2021), Barrierefreiheit (BaFG),
  Hinweisgeberschutz (HSchG, `/hinweisgeberschutz`), Bildnachweis (`/bildnachweis`, liest alle
  `public/Images/**/QUELLEN*.md` automatisch).
- **Lösungen:** Gewerbe, Freifläche, Agri-PV, Landwirtschaft, Hotellerie & Tourismus, Gewerbespeicher,
  Ladeinfrastruktur, Energiegemeinschaften, Gemeinden/Länder, Luxus-Chalets.
- **Eigene Technik:** `/technik`, Parkregler (EZA-Regler), Fernwartung, SCADA.
- **Service:** Wartung/Wartungsvertrag, E-Check, Reinigung, Drohnen-Thermografie, Versicherung,
  Energieberatung, Notstrom/Blackout, Finanzierung & Leasing, Repowering, Reststromvermarktung,
  Stromtarif, Nachhaltigkeitsmarketing (Solensa), Vorteilswelt.
- **Förderung & Recht:** Bundesförderung (EAG/KPC), 9 Landesförderungen (alte Live-URLs beibehalten),
  Steuern (IFB), Baurecht, Richtlinien/Netzanschluss, Förder-Check.
- **Werkzeuge:** Standort-Check (eHORA-Direktlink, Schneelast nach ÖNORM B 1991-1-3:2022, Modul-
  Prüflasten, PVGIS-Ertrag), Solarrechner mit Gewerbe/Landwirtschaft, Rechner, Energie live (Gebotszone AT).
- **Unternehmen & Community:** Über uns, Team, 11 Jobs mit KV-Mindestentgelt, PV Award, Sponsoring,
  Elektro-Partner-Registrierung (je mit Formular + API-Route).
- **Inhalte:** 69 Ratgeber-Artikel für Österreich, Lexikon mit 142 Begriffen, 51 FAQ,
  37 Regionalseiten mit PVGIS-Werten und Netzbetreibern.
- **SEO/GEO:** Sitemap, robots.txt (Such- und Antwortmaschinen erlaubt, reine Trainings-Crawler
  gesperrt), IndexNow (`node scripts/indexnow.mjs` nach jedem Deploy), `llms.txt` und
  `llms-full.txt` automatisch aus den Inhalten, 301-Weiterleitungen alter URLs und Kurz-URLs.

## Premium-Überarbeitung (zweite Runde)

- **Visuelle Kontrolle im echten Browser** (Playwright/Chromium) für alle Bereiche, Desktop 1440 und Mobil 390,
  im direkten Vergleich zur DE-Seite. Leitfaden: `docs/AT-DESIGN.md`.
- **AT-Logo** statt „Solartechnik Deutschland“ mit Flagge: `public/logo-oekovolt.png` / `logo-oekovolt-weiss.png`.
- **8 neue Gewerbe-Rechner** unter `/rechner/*`: gewerbe-pv, peak-shaving, e-flotte, ladeinfrastruktur,
  energiegemeinschaft, blackout, co2-esg, freiflaeche-pacht; Rechner-Hub `/rechner` mit 19 Werkzeugen,
  eigener Hauptmenüpunkt „Rechner“. Logik als reine Funktionen in `src/lib/rechner/*` (mit Node getestet).
- **Startseite** mit Hallendach-Live-Rechner im Hero (übergibt Werte an /rechner/gewerbe-pv), Live-Strommarkt AT,
  Rechner-Showcase, Referenz-Marquee.
- **Alle Bereiche** (Lösungen, Technik, Service, Förderungen, Unternehmen, Produkte, Regionen, Wissen):
  Foto-Heros, Kennzahlen-Animation, Foto-Bento, je Seite mindestens ein interaktives Element, Fachtiefe in Tabs.
- **Zahlenformat** einheitlich mit Punkt (1.250) – `de-AT` formatiert in Node und Browser unterschiedlich und
  verursachte Hydration-Warnungen. Datumsangaben bleiben `de-AT` („Jänner“).
- **Schneelast**-Formulierungen site-weit auf ÖNORM B 1991-1-3:2022 (keine Zonen mehr, Rasterkarte in eHORA).

### Zusätzlich vor dem Livegang prüfen

- Viele Fotos sind frei lizenzierte **Symbolbilder** (teils DE/CH/USA, gekennzeichnet, CC-Nachweise auf den Seiten
  und unter /bildnachweis). Eigene Ökovolt-Projektfotos würden die Wirkung deutlich steigern.
- **Hero-Video** `intro.mp4` zeigt das ALPLA-Logo – Freigabe einholen oder `HOME_HERO.video = null` in `src/data/hero.js`.
- **Rechner-Annahmen** mit Richtwert-Charakter fachlich freigeben (Speicher-, Ladepunkt-, Fahrzeug-, Pachtwerte).
  CO₂-Faktor Strom: E-Flotte-Rechner 209 g/kWh (UBA inkl. Vorkette), übrige Rechner 105,4 g/kWh
  (Marktentwicklung 2024) – bewusst unterschiedlich, auf Wunsch vereinheitlichen.
- Einige Seiten liegen mit 12–13 Bildschirmhöhen leicht über dem Ziel (Fachtiefe); bei Bedarf weiter verdichten.
- Ungenutzte Altkomponenten (u. a. `Technik/Systemverbund.js`, `Kennlinien.js`, `Signalkette.js`, alte DE-Bausteine)
  können gelöscht werden.

## Vor dem Livegang – technisch

1. **Umgebungsvariablen:** `SERVER`, `API_KEY`, `API_SECRET` auf das österreichische Backoffice setzen.
   Referenzprojekte (`/referenzen/projekte/<slug>`) und Hersteller-Detailseiten kommen aus der API –
   die Slugs der bisherigen Live-Seite (z. B. `alpla-werke-alwin-lehner-gmbh-co-kg`) müssen dort
   wieder entstehen. Die Startseite verlinkt Referenzen nur, wenn das Projekt existiert.
2. **`NEXT_PUBLIC_GA_ID`** mit einer eigenen GA4-Property für oekovolt.com (ohne ID lädt kein Analytics).
3. **Backoffice-Felder:** Angebot, Award, Sponsoring und Partner senden Zusatzangaben derzeit als Text
   in `nachricht`. Eigene Felder/Doctypes wären sauberer. Prüfen, ob `submit_kontakt` eine leere
   Straße akzeptiert.
4. **Nach dem Deploy:** Search Console + Bing Webmaster für oekovolt.com, Sitemap einreichen,
   `node scripts/indexnow.mjs` ausführen.
5. **hreflang:** Die DE-Seite muss für gemeinsame Pfade weiterhin auf .com verweisen (bidirektional).
   Aus `SHARED_PATHS` entfernt: Impressum, Datenschutz, AGB und fünf nicht belegte Herstellerseiten –
   bitte in oekovolt.de ebenso.
6. **Aufräumen (vom Rechte-Filter blockiert, bitte selbst entscheiden):** rund 150 ungenutzte
   DE-Altkomponenten unter `src/components/**` (nirgends importiert, keine Wirkung auf die Seite);
   veraltete DE-OG-Bilder unter `public/og/jobs/`; `docs/regionen/` (DE-Recherche).

## Vor dem Livegang – fachlich/rechtlich bestätigen

- **E-Mail:** Live-Seite nennt office@oekovolt.at, WKO/FirmenABC office@oekovolt.at (verwendet: .com).
- **Offenlegung:** Aufsichtsrat? Beteiligung an Medienunternehmen?
- **Datenschutz:** Hosting-Anbieter, E-Mail-Dienstleister, Datenschutzbeauftragter, Vertrag
  Art. 26/28 DSGVO mit der DE-Schwester (gemeinsames Backoffice), AV-Vertrag IntegrityLine.
- **AGB:** österreichische Anwältin/Anwalt prüfen (u. a. B2B-Gewährleistung, Stornopauschale 20 %).
- **Gewerberecht:** Versicherungs- und Leasingvermittlung brauchen ggf. eigene Berechtigungen – die
  Seiten bieten bis dahin nur Beratung/Unterlagen an.
- **Eigene Technik:** echte Leistungsdaten Parkregler (Wechselrichter, Protokolle, Abnahmen bei
  Netzbetreibern), SCADA-Produktname/Portal/Screenshots, 24/7-Besetzung, Hosting, ISMS bei Solensa.
- **Service:** Wartungspakete, eigene Drohnenpiloten/Elektrolumineszenz, gelistete Energieauditor:innen.
- **Zahlen mit Richtwert-Charakter:** Gewerbe-PV-Preise ab 50 kWp, Gewerbespeicher 200–750 €/kWh,
  Betriebskosten, `TARIF_ANNAHMEN` in `src/lib/energy.js` – mit echten Angeboten abgleichen.
- **Jobs:** KV-Einstufung je Stelle (Metallgewerbe), jährlich zum 1.1. aktualisieren.
- **PV Award:** Termine, Jury, Preise, Teilnahmebedingungen.
- **Vorteilswelt:** Höhe/Bedingungen der Empfehlungsprämie für AT.
- **Standort-Check:** HORA-Direktlinks im Browser testen; Richtwerte für Unterkonstruktions-Stufen freigeben.
- **Bilder:** Partnerbilder (Huawei, Sigenergy, meteocontrol) – gilt die Freigabe auch für AT?
  Eigene Projektfotos würden Symbolbilder (teils DE/CH/USA, als solche gekennzeichnet) ersetzen.

## Regelmäßig aktualisieren

- OeMAG-Marktpreis (monatlich), E-Control-Quartalsmarktpreise, EAG-Fördercalls (nächster 8.–22.10.2026),
  Landesförderungen (`STAND` in `src/data/bundeslaender.js`), SNE-Verordnung 2027 (Netzentgelte,
  Energiegemeinschaften), IFB-Befristung (31.12.2026), Sachbezug E-Auto ab 2027, KV-Werte.
- Nach neuen Artikeln/Stellen: `node scripts/ratgeber-index.mjs`, `node scripts/og-bilder.mjs`.
