# Welle A – Integration (12.10.2026)

Umsetzung der Übergaben zwischen den Paketen A02–A12. Nicht committet.

## Umgesetzt

- **Parkregler/SCADA (Entscheidung 4):** „eigener/selbst entwickelter Parkregler“, „eigene Fernwartung/SCADA“, „aus eigener Entwicklung“ in rund 55 Dateien (Seiten, Ratgeber, Daten, Meta-Descriptions, TechnikSystem/DunkelSektion/TechnikVerbund, mannschaft.js, TV-Folie) auf die Solensa-Formulierung bzw. neutrale Titel umgestellt. Der MannschaftTeaser auf /landwirtschaft erscheint damit wieder.
- **Lead-Gate Website ↔ Backoffice (A09/A11):** Das Backoffice übernimmt den signierten Website-Token aus `bestaetigungs_link`. Die Link-Basis kommt weiterhin aus `oekovolt_website_url`. Damit funktioniert der Link aus der Mail auf /freischalten. Ergänzt wurden außerdem `token` bis 2.400 Zeichen, die Herkunft als Zeile, `lead_id` in der Antwort, `ip_adresse` beim Bestätigen und die Zuordnung des Grunds „verwendet“. Ein neuer Test steht in test_rechner_lead.py, die Spezifikation in §3b ist ergänzt.
- **Backoffice (A06/A11):** Der Job `rechner.unbestaetigte_loeschen` läuft täglich. In lead_eingang gibt es jetzt den Aufschub für Rechner-Leads (`AUFSCHUB_UNTERSTUETZT`). DROSSEL_JE_STUNDE kennt die Bereiche rechner/bestaetigung. In install.py sind 7 Rollen ergänzt.
- **Kundenbühne (A07):** Plakette, Social-Kit, ESG und Social-Bilder werden nur mit der jeweiligen Freigabe ausgeliefert (sonst 404). Die Texte heißen jetzt „Projekt-Plakette“, ohne CO₂-Satz. Die Projektseite lädt die Freigaben aus dem Backoffice; Firmenname, Porträt und Kit erscheinen nur mit Freigabe. Die siegel*-Aliase sind entfernt.
- **Rechner (A10/A12):** eagZuschuss() fördert Speicher erst ab 0,5 kWh je förderfähigem kWp. torTyp im Hybridpark kommt aus torTypen.js. Der Finanzierungsvergleich hat einen Stresstest (neue Datei StresstestFinanzierung.js). Der Gewerbe-PV-Rechner hat den Kopf-Knopf „Jetzt rechnen“ (#rechner), und die TOR-FAQ rechnet mit AC-Leistung. Das Dossier prüft die Freigabe über leadGateServer.freigabePruefen.
- **Sonstiges:** brancheKurz-Regex, THEMA_KURZ tourismus/hotellerie, Kontrast in VergabeWegweiser und Kennzahlenband, „TOP 3“-Beispiel entfernt, Kennzahlen mit „Angaben Ökovolt Österreich · Stand“ (Referenzen, Referenzkarte, SeoTextSection; „PV-Kraftwerke“ → „PV-Anlagen“), Symbolbild-Kennzeichnung in Zeitreise, „umweltfreundlich“/„garantiert“ umformuliert, Einwilligungs-Kennung im Rückruf-Weg, schwebende Knöpfe über der Konfigurator-Fußleiste ausgeblendet, Fundstellen für „gruender-betreiben“.

## Offen (bewusst nicht umgesetzt)

- COOKIE_KOPF_SKRIPT in layout.js: Die Konstante liegt in einem „use client“-Modul. Ein Import in die Server-Komponente liefert keine Zeichenkette. Dafür müsste sie zuerst in ein eigenes Modul ausgelagert werden. Die Zwischenlösung bleibt.
- bericht().mappe mit Rohzahlen je Rechner (A09) und Stresstest im Druckblatt: noch nicht umgesetzt.
- Trefferfläche der Range-Inputs ≥ 44 px, BackToTop-Klasse, Experiment k4: offen (k4 wartet auf eine Entscheidung des Inhabers).
- Projekttitel aus dem Backoffice (z. B. Andritz, Hammerer) sind auf /referenzen/projekte/<slug> weiterhin als Titel sichtbar. Sie stammen aus öffentlich freigeschalteten Frappe-Projekten. Eine Anonymisierung der Projektseiten entscheidet der Inhaber.
- LastgangAnalyse ?ref=: Noch keine Seite verlinkt mit ?ref= auf /lastgang-analyse; rechnerLead kennt kein Feld bezug.
