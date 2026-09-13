# Korrekturliste für das Backoffice (Redaktion)

Beim Redesign im September 2026 sind Inhalte im Frappe-Backoffice aufgefallen, die falsch, veraltet oder uneinheitlich sind.
Die Website fängt einige davon im Code ab (Ersatztexte, Filter). Die eigentliche Korrektur muss aber im Backoffice passieren.
Danach können die Ausweichlösungen im Code entfallen.

| # | Seite / Datensatz | Problem | Empfehlung |
|---|---|---|---|
| 1 | Team (API „team“) | Liefert keine Teammitglieder. Die Seite zeigt deshalb Rollen statt Personen. | Teammitglieder mit Foto, Funktion und Kurztext pflegen; die Karten erscheinen automatisch. |
| 2 | Jobs (API „jobs“) | Liefert keine Stellen. Die Seite zeigt deshalb nur die Initiativbewerbung. | Offene Stellen pflegen. Texte in Sie-Form (aktuell Du-Form). |
| 3 | Wärmepumpe → Hersteller | Schrack, Schweizer, Trina und Fronius sind Solar-/Elektrohersteller, keine Wärmepumpenmarken. | Tatsächlich verbaute Wärmepumpenmarken eintragen. |
| 4 | Stromspeicher → BYD | Die Produktseite zeigt Solarmodule statt Speicher. | Speicherprodukte (z. B. BYD Battery-Box) pflegen. |
| 5 | Hersteller → Fronius | Keine aktiven Produkte; Logo auf weißem Grund kaum sichtbar. | Produkte ergänzen, Logo mit Transparenz oder dunkler Variante hochladen. |
| 6 | Smart Meter | Preisobergrenzen veraltet (20/50 €). | Werte nach § 30 MsbG: 40 / 50 / 110 / 140 €, optional 30 €, Steuerbox 50 €. Die Website zeigt diese Werte derzeit statisch. |
| 7 | Smart Meter | „Recht auf freiwilligen Smart Meter seit 2026“ | Richtig: seit 2025. |
| 8 | Steuerlich | „15 kWp pro Einheit bei Mehrfamilienhäusern“ | Gilt seit dem Jahressteuergesetz 2024 nicht mehr: 30 kWp je Wohn-/Gewerbeeinheit (§ 3 Nr. 72 EStG). |
| 9 | Baurecht | „Vereinfachte Anmeldung beim Netzbetreiber“ für Balkonkraftwerke | Seit dem Solarpaket I (Mai 2024) entfallen; nur noch Eintrag im Marktstammdatenregister. |
| 10 | Direktvermarktung → FAQ | „aktuell hohe Strompreise“, „iMSys seit 2025 gesetzlich vorgeschrieben“ | Fachlich prüfen und zeitlos bzw. korrekt formulieren. |
| 11 | Repowering, Direktvermarktung | Texte teils in Du-Form. | Einheitlich Sie-Form; die Website wandelt derzeit im Code um. |
| 12 | Dienstleistungen → Photovoltaik | Texte zu „Fördermöglichkeiten“ und „CO₂-Emissionen reduzieren“ passen nicht zu den Überschriften. | Texte den Überschriften zuordnen; die Website zeigt derzeit Ersatztexte. |
| 13 | Hersteller / Mieterstrom | Keywords fachfremd (Empfehlungsprogramm bzw. Finanzierung). | Keywords je Seite thematisch pflegen. |
| 14 | Referenzen | „Bad Wörishofen“ und „Bad Wörishofen 4“ vermutlich doppelt (gleiche Leistung, gleiches Jahr). | Dublette prüfen und entfernen. |
| 15 | Referenzen | Tippfehler „Türkheim (ÖKOLT)“ | → „Türkheim (ÖKOVOLT)“ |
| 16 | Referenzen | Feld `ort` oft leer. | Ort je Projekt pflegen (für Filter und Karte). |
| 17 | Referenzen | Bild `/files/download-8dddb03.jpg` liefert 404. | Bild neu hochladen oder Eintrag entfernen. |
| 18 | Referenzkarte | Korrigiert: doppelter Eintrag „Türkenfeld“ bei 47.49/9.69 → „Vorarlberg“; „Innsbruck“-Koordinaten auf den echten Standort gesetzt. | Fachlich bestätigen. |
| 19 | Startseite (API) | Die Kennzahlen 5.000 Anlagen / 340.000 kWp / 112.000 t CO₂ werden jetzt prominent angezeigt. | Aktualität und Belegbarkeit regelmäßig prüfen (werbliche Aussagen). |

Nach jeder Korrektur ist die Seite spätestens nach 10 Minuten aktuell (Cache `revalidate: 600`).
