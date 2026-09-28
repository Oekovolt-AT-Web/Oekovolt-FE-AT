# Briefing: oekovolt.com – Website für Österreich

Dieses Repo (`Oekovolt-FE-AT`) ist eine Kopie der deutschen Website (oekovolt.de) und wird zur
österreichischen Website **www.oekovolt.com** umgebaut. Design = Corporate Design, **darf nicht
abweichen**: vorhandene UI-Bausteine (`src/components/ui/*`, `PageHero`, `Section`, `SectionHeading`,
`FeatureGrid`, `Steps`, `Faq`, `CtaBand`, `SplitMedia`, `Querverweise`, Ratgeber-System) verwenden,
Tailwind-Klassen und Farbtokens (`ov-*`, `ink-*`, `sand-*`, `navy-*`) wie auf den bestehenden Seiten.
Keine neuen Designsprachen, keine neuen Bibliotheken, kein TypeScript.

## Zielbild

- Fokus **Gewerbe, Industrie, Landwirtschaft, öffentliche Hand (Gemeinden, Länder, Stadtwerke/
  Landesversorger)**. Privat nur nachgeordnet (Premium, Luxus-Chalets alpin).
- Fachlich die **tiefste PV-Website Österreichs**: konkret, österreichische Rechtslage, echte Zahlen
  mit Quellen, Normen, Praxis. Keine Werbefloskeln. Geschäftsführung, Technik und Einkauf sollen
  jeweils finden, was sie brauchen.
- SEO + GEO (KI-Suchmaschinen): klare H1/H2-Struktur, erster Satz je Abschnitt beantwortet die
  Frage direkt (zitierfähig), Tabellen, FAQ mit `FAQPage`-Schema (muss exakt dem sichtbaren Inhalt
  entsprechen), `Service`/`WebPage`/`BreadcrumbList`-Schema, interne Links mit sprechendem Ankertext.
- Title: max. ~60 Zeichen, endet auf `| Ökovolt` (Template ist `%s`, also vollständigen Titel
  setzen). Description 140–160 Zeichen. `alternates.canonical` immer setzen.
  `openGraph.locale: "de_AT"`, `siteName: "Ökovolt Österreich"`.

## Zentrale Konstanten – IMMER importieren, nie abtippen

`src/lib/site.js`: `BASE_URL` (https://www.oekovolt.com), `FIRMA` (Name, Adresse, Telefon, E-Mail,
FN, UID, GISA, Gesellschafter …), `SCHWESTER` (deutsche Schwester, Markeninhaberin), `SOLENSA`.
`src/data/navigation.js`: `NAVIGATION` (alle Zielrouten der Site), `KONTAKT`.

## Unternehmensfakten (verifiziert 09/2026)

- **Ökovolt Solartechnik GmbH**, Gewerbegebiet 10, 5121 Ostermiething, Oberösterreich (Innviertel,
  an der Grenze zu Salzburg). Tel. +43 6278 71030, office@oekovolt.com.
- FN 375708m, Landesgericht Ried im Innkreis, UID ATU67027148, GISA 17864251, Gewerbe
  Elektrotechnik, Mitglied WKO Oberösterreich. Stammkapital 35.000 €. Gegründet 16.02.2012.
- Geschäftsführer: Andreas Wegscheider. **Gesellschafter: Andreas Wegscheider 51 %, Salzburg AG für
  Energie, Verkehr und Telekommunikation 49 % (derzeit, seit 2021)**. Auf der AT-Site gilt: Die
  Salzburg AG ist aktuell Gesellschafterin. (Die DE-Datei `src/data/unternehmen.js` sagt
  „ausgeschieden 2025“ – das ist für AT FALSCH und muss angepasst werden.)
- Gruppe: Muttergesellschaft ÖKOVOLT GmbH Solartechnik, Türkheim (DE, seit 2010) – dort liegen
  Standards, Technik und **Marken-/Websiterechte**. AT-Schwester seit 2012, mit denselben Prozessen.
  2021 errichtete die AT-Gesellschaft PV-Anlagen mit 30 MWp und zählte zu den TOP 3 der
  IPC-Errichter Österreichs; bevorzugter PV-Errichter des Salzburg AG Konzerns. Beteiligung an der
  ÖkoInvest GmbH (22,60 %; Freifläche, Agri-PV, Contracting, PPA). Gründer betreiben eigene
  Solarparks seit 2012 → „Wir bauen, was wir selbst betreiben würden.“
- Eigene Systeme: **Parkregler (EZA-Regler für Österreich)**, **eigene Fernwartungssysteme**,
  **eigene SCADA-Systeme** (Digitalisierung/IT-Security mit Solensa GmbH, Alexander Messmer,
  „Internet of Energy“).
- Leistungen zusätzlich: Wartung (Ziel: Wartungsvertrag), E-Check/Anlagenprüfung, PV-Reinigung,
  PV-Versicherung (Vermittlung/Beratung – keine Versicherungsprodukte versprechen), Energieberatung,
  Notstrom/Blackout-Vorsorge, Drohnen-Thermografie, Reststromvermarktung, Finanzierung (Leasing
  organisieren wir bzw. Vermittlung), Luxus-Chalets alpin (hohe Schneelast, spezielle Module und
  Unterkonstruktion, Indach, Concierge-Wartung), Nachhaltigkeitsmarketing **über Solensa** (Video
  zur PV-Anlage, Nachhaltigkeits-Imagespot für Unternehmen), **Ökovolt PV Award** (jährlich an
  Kunden für die besten Anlagen und Nachhaltigkeitsinvestitionen), Sponsoring (Anfrageformular),
  **Elektro-Partnerprogramm** (Subunternehmer registrieren sich; Ökovolt als zentrale Plattform).
- Einzugsgebiet: ganz Österreich (alle neun Bundesländer).
- NICHT erfinden: konkrete Kundennamen, Preise von Ökovolt, Mitarbeiterzahlen, Auszeichnungen,
  Zertifikate, Garantien, Reaktionszeiten als Zusage. Wo Zahlen fehlen: als Richtwert/Beispiel
  kennzeichnen oder weglassen. Branchenzahlen immer mit Quelle.

## Österreich-Fachlich (Leitplanken – jeweils selbst aktuell recherchieren und belegen)

- Recht: EAG (Erneuerbaren-Ausbau-Gesetz), **ElWG** (Elektrizitätswirtschaftsgesetz, löst ElWOG
  ab – aktuellen Stand prüfen!), EEG = *Erneuerbare-Energie-Gemeinschaft* (§ 79 EAG), BEG =
  Bürgerenergiegemeinschaft, GEA = gemeinschaftliche Erzeugungsanlage, Netzebenen 7/6/5/4,
  Netzzugangsvertrag, TOR Erzeuger (Typ A/B/C/D), OVE-Richtlinie R 11-1 (Brandschutz PV), OVE R 25?
  (selbst prüfen), ÖVE/ÖNORM E 8101, ÖVE/ÖNORM EN 62446, ÖNORM B 1991-1-3 (Schnee), B 1991-1-4
  (Wind), Elektrotechnikgesetz/ETV, ESV 2012, Bauordnungen der Länder, Raumordnung (Freifläche:
  Widmung/Zonierung je Bundesland), Elektrizitätsabgabe (Befreiung Eigenverbrauch), USt,
  **Investitionsfreibetrag (IFB)**, Gewinnfreibetrag, AfA, Netzverlustentgelt/Netznutzungsentgelt,
  Leistungspreis, Lastprofil, Smart Meter (IME-VO), Marktpreis OeMAG (§ 41 ÖSG / EAG), Förderung
  EAG-Investitionszuschuss (OeMAG Fördercalls, Kategorien A–D), KPC/UFI (betriebliche
  Umweltförderung), klimaaktiv, Klima- und Energiefonds, Landesförderungen (neun Länder), Hagel
  (Österreichische Hagelversicherung), **eHORA / HORA** (hora.gv.at, Naturgefahren inkl.
  Schneelastzonen), APG (Austrian Power Grid), E-Control, Gebotszone AT (EPEX/EXAA).
- Begriffe Österreich: „Jänner“, „Gemeinde“ (nicht Kommune, außer als Synonym), „Landesversorger“,
  „Netzbetreiber“ (z. B. Netz Oberösterreich, Salzburg Netz, Wiener Netze, Netz NÖ, Energienetze
  Steiermark, KNG-Kärnten Netz, TINETZ, Vorarlberger Energienetze, Netz Burgenland, Linz Netz,
  Energie Graz Netz, IKB …), „Photovoltaik“ und „PV“, „Elektrotechniker/Elektriker“, „Baubewilligung/
  Bauanzeige“, „Förderwerber“, „Einspeisetarif“, „Überschusseinspeisung“, „Förderansuchen“.
- Sprache: Sie-Form, sachlich, österreichisches Deutsch. Umlaute korrekt (UTF-8).

## Bilder

Vorhandene Bilder in `public/Images/**` wiederverwenden. Zusätzliche freie Bilder sind erlaubt
(Pixabay/Unsplash/Pexels-Lizenz oder Wikimedia Commons CC0/CC-BY) – dann unter
`public/Images/AT/<bereich>/` ablegen (≤ 400 KB, jpg/webp, max. 1920 px breit) und in
`public/Images/AT/QUELLEN-<bereich>.md` mit Quelle, Urheber und Lizenz dokumentieren. Keine
Markenlogos Dritter ohne Freigabe. Download z. B. per `curl -L -o`.

## Arbeitsregeln für parallele Agenten

- **Nur die Dateien/Ordner anfassen, die im eigenen Auftrag stehen.** Gemeinsame Dateien
  (`src/data/navigation.js`, `src/lib/site.js`, `src/app/layout.js`, `src/app/sitemap.js`,
  `src/data/verlinkung.js`, `next.config.mjs`, `public/robots.txt`, `public/llms.txt`,
  `src/components/ui/*`, `src/components/Reusable/footer.js`, `src/components/Navbar/*`) NICHT
  ändern – stattdessen am Ende im Bericht auflisten, was dort ergänzt werden muss (z. B. neue
  Sitemap-Einträge, Querverweise).
- **Kein `npm run build`, kein `npm run dev`** (mehrere Agenten gleichzeitig würden sich `.next`
  zerschießen). Syntax prüfen mit `npx eslint <eigene Dateien>`; bei reinen Datenmodulen zusätzlich
  `node --input-type=module -e "import('./pfad.js')"` nur wenn keine `@/`-Imports enthalten sind.
- Kein `git commit`, kein `git push`, keine Pakete installieren.
- Neue Seiten: `src/app/<route>/page.js` als Server-Komponente mit `metadata`; interaktive Teile als
  eigene Client-Komponente unter `src/components/<Bereich>/`.
- Formulare: bestehende API-Routen/Muster nutzen (siehe `src/app/api/create_anfrage`,
  `src/app/api/create_contact`, `src/lib/api/**`). Neue API-Routen dürfen angelegt werden, müssen
  bei fehlendem Backend sauber mit Fehlermeldung + Hinweis auf E-Mail/Telefon reagieren.
- Bericht am Ende: angelegte/geänderte Dateien, neue Routen (für Sitemap), benötigte Änderungen an
  gemeinsamen Dateien, offene Punkte/Unsicherheiten, verwendete Quellen.
