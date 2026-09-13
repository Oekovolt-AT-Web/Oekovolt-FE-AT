# Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO) – Ausspielkanäle

Stand: 14.09.2026 · Verantwortlicher: ÖKOVOLT GmbH Solartechnik, Schlingener Str. 1a, 86842 Türkheim · Prüfung DSB: [OFFEN]

## A. Web-Push-Benachrichtigungen

| Angabe | Inhalt |
|---|---|
| Zweck | Information von Abonnenten über neue Beiträge zu gewählten Themen |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TDDDG (Speicherung des Abos im Endgerät nach Einwilligung) |
| Betroffene | Website-Besucher, die Benachrichtigungen aktivieren |
| Daten | Push-Endpoint (URL des Push-Dienstes des Browsers), Verschlüsselungsschlüssel p256dh/auth, Themen, Anmeldezeitpunkt. Keine Namen, E-Mail- oder IP-Adressen |
| Empfänger | Push-Dienste der Browserhersteller (Google FCM, Mozilla, Apple, Microsoft) – nur verschlüsselte Nachrichteninhalte; Website-Hosting [OFFEN]; Backoffice-Hosting [OFFEN] |
| Drittland | Möglich über Push-Dienste (z. B. Google, Apple, Microsoft, USA) – Inhalte Ende-zu-Ende verschlüsselt (RFC 8291); Einschätzung DSB [OFFEN] |
| Löschung | Bei Abbestellung sofort; bei Meldung „abgelaufen“ (HTTP 404/410) durch den Push-Dienst automatisch |
| TOM | VAPID-Signatur, Endpoint-Allowlist, Rollenrechte, Hash-Index, TLS |

## B. Fediverse-Konten (ActivityPub)

| Angabe | Inhalt |
|---|---|
| Zweck | Zustellung neuer Beiträge an Follower (Mastodon, Threads u. a.) |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b DSGVO (Zustellung auf Anforderung durch „Folgen“) |
| Betroffene | Personen/Organisationen, die einem Konto folgen |
| Daten | Öffentliche Profildaten: Actor-URL, Handle, Anzeigename, Inbox-Adressen, Folgt-seit |
| Empfänger | Server der Follower (Zustellung der öffentlichen Beiträge) |
| Drittland | Möglich, abhängig vom Server des Followers (z. B. Threads/Meta, USA); es werden ausschließlich öffentliche Beiträge zugestellt |
| Löschung | Bei „Entfolgen“ (Undo) oder Kontolöschung (Delete) automatisch |
| TOM | HTTP-Signaturen (Prüfung eingehend, Signatur ausgehend), keine Veröffentlichung der Follower-Liste, Schutz vor internen Zieladressen (SSRF), Rollenrechte |

## C. RSS-/JSON-Feeds und Info-Bildschirm

Keine Verarbeitung personenbezogener Daten über die Server-Logdateien hinaus (siehe allgemeiner VVT-Eintrag „Website-Betrieb“).
