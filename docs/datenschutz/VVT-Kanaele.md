# VVT (Art. 30 Abs. 1 DSGVO) – Ausspielkanäle: Web-Push, Fediverse, RSS

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (ersetzt die deutsche Fassung vom 14.09.2026) · Verantwortlicher:
> Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) ·
> Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

Umsetzung: `src/lib/kanaele/` (Website), Frappe-DocTypes Push Abonnement, Push Nachricht, Fediverse Follower,
Veroeffentlichung, Verteilprotokoll (`Import-Backend-Frappe/apps/oekovoltdeutchland`, API-User „Kanal Webservice“,
Variablen `KANAL_API_KEY`/`KANAL_API_SECRET`). Datenschutzerklärung Punkte 21 und 22.

## A. Web-Push-Benachrichtigungen

| Angabe | Inhalt |
|---|---|
| **Zweck** | Information von Abonnent:innen über neue Beiträge zu selbst gewählten Themen |
| **Rechtsgrundlage** | Einwilligung, Art. 6 Abs. 1 lit. a DSGVO i. V. m. § 165 Abs. 3 TKG 2021 (Abonnement im Browser nach ausdrücklicher Erlaubnis) |
| **Betroffene** | Website-Besucher:innen, die Benachrichtigungen aktivieren |
| **Daten** | Push-Endpoint (Adresse beim Push-Dienst des Browsers), Schlüssel `p256dh` und `auth`, gewählte Themen, Anmeldezeitpunkt. Keine Namen, E-Mail- oder IP-Adressen. |
| **Empfänger** | Push-Dienste der Browserhersteller (z. B. Google FCM, Mozilla, Apple, Microsoft) – sie erhalten nur verschlüsselte Nachrichteninhalte (RFC 8291) |
| **Auftragsverarbeiter** | Hosting Website `[OFFEN]`; Backoffice (Hetzner, Nürnberg) `[OFFEN: AV-Vertrag]` |
| **Drittland** | Möglich über die Push-Dienste (USA); Inhalte Ende-zu-Ende verschlüsselt. `[OFFEN: Einschätzung der Datenschutzberatung – der Push-Dienst ist vom Browser vorgegeben, nicht von Ökovolt ausgewählt]` |
| **Löschung** | Bei Abbestellen sofort; meldet der Push-Dienst HTTP 404/410, wird das Abonnement automatisch entfernt (`src/lib/kanaele/push.js`) |
| **TOM** | VAPID-Signatur, Prüfung der Endpoints gegen eine Liste bekannter Push-Dienste, Rollenrechte, TLS |

## B. Fediverse-Konten (ActivityPub)

| Angabe | Inhalt |
|---|---|
| **Konten** | `@oekovolt@oekovolt.com`, `@ratgeber@oekovolt.com` (`src/lib/kanaele/fediverseKonten.js`) |
| **Zweck** | Zustellung neuer Beiträge an Follower (z. B. Mastodon) |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Zustellung auf Anforderung durch „Folgen“) |
| **Betroffene** | Personen und Organisationen, die einem Konto folgen |
| **Daten** | Öffentliche Profilangaben: Actor-URL, Handle, Anzeigename, Inbox-Adressen, „folgt seit“ |
| **Empfänger** | Server der Follower (Zustellung der öffentlichen Beiträge) |
| **Drittland** | Möglich, abhängig vom Server der Follower; zugestellt werden ausschließlich öffentliche Beiträge |
| **Löschung** | Automatisch bei „Entfolgen“ (Undo) oder Kontolöschung (Delete) |
| **TOM** | HTTP-Signaturen (eingehend geprüft, ausgehend signiert), Follower-Liste wird nicht veröffentlicht, Schutz vor internen Zieladressen (SSRF), Rollenrechte. Reaktionen (Likes, Antworten, Boosts) werden nicht verarbeitet. |

## C. RSS-/JSON-Feeds und Info-Bildschirme

Keine Verarbeitung personenbezogener Daten über die Server-Logdateien hinaus (Datenschutzerklärung Punkt 3).
`[OFFEN: Eintrag „Hosting und Server-Logdateien“ im Verzeichnis anlegen – siehe Deckblatt, Abschnitt 4.]`
