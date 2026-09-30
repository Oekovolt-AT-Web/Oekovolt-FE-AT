# VVT (Art. 30 Abs. 1 DSGVO) – Besucherstatistik und Kampagnen-Zuordnung

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (ersetzt die deutsche Fassung vom 14.09.2026) · Verantwortlicher:
> Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) ·
> Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`
>
> Die Klick- und Scroll-Heatmap hat einen eigenen Eintrag: [VVT-Heatmap.md](VVT-Heatmap.md).

**Schalter:** Umami und Google Analytics laufen nur, wenn die jeweiligen Umgebungsvariablen beim Build gesetzt sind
(`UMAMI_SCRIPT_URL` + `UMAMI_WEBSITE_ID` bzw. `NEXT_PUBLIC_GA_ID`, Vorlage
`Import-Backend-Frappe/installation/website_env.txt`). Die Datenschutzerklärung blendet den Umami-Abschnitt automatisch
nur bei gesetzten Variablen ein. `[OFFEN: Welche der beiden Messungen wird beim Livegang tatsächlich aktiviert? Am
30.09.2026 hat statistik.oekovolt.com keinen DNS-Eintrag, und NEXT_PUBLIC_GA_ID ist in der Vorlage leer.]`

## A. Cookielose Reichweitenmessung (Umami, selbst gehostet)

| Angabe | Inhalt |
|---|---|
| **Umsetzung** | `src/components/Statistik/Umami.js` (im Layout eingebunden) |
| **Zweck** | Reichweitenmessung und Verbesserung der Website (genutzte Seiten, Rechner, Kampagnen) |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer datensparsamen, zusammengefassten Auswertung). Kein Speichern oder Auslesen im Endgerät im Sinne von § 165 Abs. 3 TKG 2021 vorgesehen: keine Cookies, kein localStorage. `[OFFEN: Ob das Auslesen von Browser- und Bildschirmdaten durch das Skript ohne Einwilligung zulässig ist, ist in Österreich nicht abschließend geklärt – rechtlich bewerten; Alternative: Umami ebenfalls an die Einwilligung „Statistik“ knüpfen.]` |
| **Betroffene** | Website-Besucher:innen |
| **Daten** | Seitenpfad (URL-Parameter werden vor dem Senden entfernt, nur `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` bleiben, je höchstens 100 Zeichen); verweisende Website nur als Ursprung (Domain); Browser, Betriebssystem, Gerät, Bildschirmgröße, Sprache, Land/Region (aus der IP-Adresse abgeleitet); Ereignisse ohne Formularinhalte. IP-Adresse wird laut Umami nicht gespeichert, sondern für einen täglich wechselnden, gesalzenen Hash verwendet. |
| **Nicht erfasst** | Besucher:innen mit „Do Not Track“ (`data-do-not-track`), Hash-Teile der Adresse, Seiten `/scan`, `/tv`, `/fortsetzen`, `/hinweisgebersystem` (Filter `ovUmamiFilter`) |
| **Empfänger** | Keine Dritten; eigener Umami-Server `[OFFEN: Standort und Anbieter – laut Kommentar im Code „z. B. auf Hetzner“ – bestätigen]` |
| **Auftragsverarbeiter** | Hosting des Statistik-Servers `[OFFEN: AV-Vertrag]` |
| **Drittland** | Nein, sofern Hosting in der EU `[OFFEN: bestätigen]` |
| **Löschung** | `[OFFEN: Aufbewahrung der Rohdaten in Umami festlegen (z. B. 14 oder 25 Monate) und technisch einstellen; die Datenschutzerklärung sagt nur „sobald nicht mehr erforderlich“]` |
| **TOM** | selbst gehostet, TLS, Admin-Zugang nur Marketing/Geschäftsführung `[OFFEN: 2FA, Telemetrie der Umami-Instanz deaktivieren]` |
| **Widerspruch** | Art. 21 DSGVO; technisch über „Do Not Track“ oder per E-Mail an office@oekovolt.at (Datenschutzerklärung Punkt 5 a) |

## B. Google Analytics 4 (nur mit Einwilligung)

| Angabe | Inhalt |
|---|---|
| **Umsetzung** | `src/components/Statistik/GoogleAnalytics.js`; Einwilligung über das Cookie-Banner (`cookieConsent.googleAnalytics`, gekoppelt an die Kategorie „Statistik“) |
| **Zweck** | Reichweitenmessung und Auswertung von Kampagnen |
| **Rechtsgrundlage** | Einwilligung, Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 165 Abs. 3 TKG 2021 |
| **Daten** | Seitenaufrufe (nur `utm_*` als Parameter), Ereignisse, Geräte- und Browserdaten, ungefährer Standort; Cookies `_ga`, `_ga_*` |
| **Einstellungen im Code** | Consent Mode v2 mit Standard „denied“, nach Einwilligung nur `analytics_storage` „granted“; `allow_google_signals: false`, `allow_ad_personalization_signals: false`; Seitenaufrufe manuell ohne Formularparameter; bei Widerruf sofortiger Stopp und Löschen der `_ga`-Cookies; ausgenommen `/scan`, `/fortsetzen`, `/tv`, `/hinweisgebersystem` |
| **Empfänger / Auftragsverarbeiter** | Google Ireland Limited; Unterauftragsverarbeitung durch Google LLC `[OFFEN: Auftragsverarbeitungsbedingungen im GA-Konto akzeptiert?]` |
| **Drittland** | USA möglich – Angemessenheitsbeschluss EU-US Data Privacy Framework (Art. 45 DSGVO) `[OFFEN: DPF-Zertifizierung von Google LLC jährlich prüfen und Datum eintragen]` |
| **Löschung** | Datenaufbewahrung in der GA4-Property: Datenschutzerklärung nennt 14 Monate `[OFFEN: in der Property einstellen und Nachweis ablegen]` |
| **Wichtig** | Eigene GA4-Property für oekovolt.com, keine Übernahme der deutschen Mess-ID (Kommentar in `GoogleAnalytics.js`). |

## C. Kampagnen-Zuordnung von Anfragen

| Angabe | Inhalt |
|---|---|
| **Umsetzung** | `src/lib/herkunft.js` (Browser), `src/lib/herkunftServer.js` (Website-Server); Speicherung in den Feldern `herkunft`, `herkunft_kanal`, `utm_*`, `herkunft_referrer`, `einstiegsseite` der Anfrage-DocTypes bzw. als Text in `herkunft`/`nachricht` bei Terminen |
| **Zweck** | Zuordnung von Anfragen (Kontakt, Angebot, Solarrechner, Rückruf, Termin, Unterlagen per Smartphone) zu Marketingkanälen, um Werbebudgets sinnvoll einzusetzen |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. f DSGVO. Die Angaben werden nur im Arbeitsspeicher der geöffneten Seite gehalten (keine Cookies, kein Browserspeicher) und ausschließlich mit einer von der Person selbst abgesendeten Anfrage übertragen. |
| **Betroffene** | Personen, die eine Anfrage senden |
| **Daten** | UTM-Parameter (source, medium, campaign, term, content), verweisende Domain, Einstiegsseite, abgeleiteter Kanal. Eigene Domains (oekovolt.com, oekovolt.de) zählen nicht als Verweis. |
| **Empfänger** | Backoffice; keine Weitergabe an Werbenetzwerke. Bericht „Anfragen nach Herkunft“ im Desk. |
| **Drittland** | Nein |
| **Löschung** | Mit der jeweiligen Anfrage; bei der Anonymisierung (24 Monate, siehe [VVT-Anfragen.md](VVT-Anfragen.md)) bleiben die Kampagnenfelder für die Statistik erhalten – sie enthalten dann keinen Personenbezug mehr, sofern in UTM-Links keine personenbezogenen Daten stehen. |
| **Hinweis Marketing** | Keine personenbezogenen Daten in UTM-Links verwenden (keine Namen, E-Mail-Adressen, Kundennummern). |
