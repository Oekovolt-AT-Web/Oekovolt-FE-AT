# Handbuch der internen Stelle (Hinweisgebersystem nach HSchG)

**Ökovolt Solartechnik GmbH · vertraulich, nur für die interne Stelle**

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (österreichische Fassung; ersetzt das deutsche Handbuch nach HinSchG
> vom 13.09.2026). Grundlage: HinweisgeberInnenschutzgesetz (HSchG), BGBl. I Nr. 6/2023, §§ 6–9, 13 und 20–24, sowie
> [VVT-Hinweisgebersystem.md](VVT-Hinweisgebersystem.md) und [DSFA-Hinweisgebersystem.md](DSFA-Hinweisgebersystem.md).
> Gilt für das eigene System (`HINWEIS_INTERN=1`); solange IntegrityLine der Meldekanal ist, gelten die Abschnitte 1, 3–6
> sinngemäß im Portal. `[OFFEN: Freigabe Geschäftsführung; Aushändigung an die interne Stelle und Vertretung dokumentieren]`

Das Handbuch beschreibt, wie Hinweise bearbeitet werden, und enthält Textvorlagen.

---

## 1. Grundsätze

1. **Vertraulichkeit und Identitätsschutz (§ 7 HSchG):** Die Identität der hinweisgebenden Person – und alle Informationen,
   aus denen sie direkt oder indirekt abgeleitet werden kann – kennen nur Sie. Dasselbe gilt für betroffene Personen
   (§ 7 Abs. 5). Eine Offenlegung ist nur zulässig, wenn eine Verwaltungsbehörde, ein Gericht oder die Staatsanwaltschaft
   dies im Verfahren für unerlässlich und verhältnismäßig hält (§ 7 Abs. 3). Verstöße sind strafbar (§ 24 Z 3).
2. **Unparteilichkeit (§ 13 Abs. 2):** Sie gehen unparteilich und unvoreingenommen vor. Bei einem Interessenkonflikt geben
   Sie den Fall an die Vertretung ab und dokumentieren das.
3. **Unschuldsvermutung:** Ein Hinweis ist kein Beweis. Betroffene Personen werden fair behandelt und angehört, sobald das
   die Aufklärung nicht gefährdet.
4. **Datenminimierung (§ 8 Abs. 10):** Daten, die für die Bearbeitung nicht benötigt werden, nicht erfassen bzw. unverzüglich
   löschen (z. B. überflüssige Gesundheitsangaben aus einem Freitext entfernen und das als interne Notiz vermerken). Keine
   privaten Notizen außerhalb des Backoffice.
5. **Strafrechtlich relevante Daten (§ 8 Abs. 6):** nur bei unbedingter Erforderlichkeit verarbeiten und das **schriftlich
   dokumentieren** (interne Notiz: welche Daten, warum erforderlich).
6. **Kein Enttarnen:** Versuchen Sie nie, anonym Hinweisgebende zu identifizieren.
7. **Geschäftsgeheimnisse (§ 7 Abs. 7):** nur für Zwecke des HSchG und nur im erforderlichen Ausmaß verwenden.

## 2. Zugang und Werkzeuge

- **Backoffice:** Desk → **Hinweis**, Rolle `Hinweis Meldestelle`, Anmeldung nur mit Zwei-Faktor-Authentifizierung
  `[OFFEN: 2FA aktivieren]`.
- **Listenansicht:** Filter Status ≠ „Abgeschlossen“, sortiert nach „Eingangsbestätigung fällig bis“.
- **Benachrichtigungen:** Die E-Mails „Hinweisgebersystem: Neue Meldung eingegangen (HW-…)“ und „… Neue Nachricht der
  meldenden Person“ enthalten keine Inhalte. Nach Kenntnisnahme löschen.
- **Postfach-Sperre:** Die E-Mail „Postfach nach wiederholten Fehlversuchen vorübergehend gesperrt“ bedeutet 10 falsche
  Zugangsschlüssel für diese Fall-Nummer; die Sperre endet nach 30 Minuten. Bei Häufung dokumentieren und die IT
  informieren – ohne Inhalte des Falls.
- **Post:** Umschläge mit dem Vermerk „Interne Meldestelle – persönlich/vertraulich“ werden ungeöffnet übergeben. Sie legen
  den Fall im Backoffice selbst an (Quelle „Post“) und bewahren das Original verschlossen auf.
- **Wochenroutine:** jeden Montag Fristen prüfen; bei Abwesenheit aktiv an die Vertretung übergeben.

## 3. Fristen nach HSchG

| Frist | Rechtsgrundlage | Im Backoffice |
|---|---|---|
| Eingang **schriftlicher** Hinweise bestätigen: unverzüglich, spätestens nach **7 Kalendertagen** – außer die Person hat ausdrücklich verzichtet oder die Bestätigung würde ihre Identität gefährden | § 9 Abs. 1 | Feld „Eingangsbestätigung fällig bis“ |
| Auf Ersuchen eine **Zusammenkunft** anbieten: spätestens innerhalb von **14 Kalendertagen** | § 13 Abs. 5 | nicht überwacht – selbst im Kalender eintragen |
| Ergänzungen/Berichtigungen der Person **auf Verlangen** schriftlich bestätigen: spätestens nach **7 Kalendertagen** | § 13 Abs. 8 | nicht überwacht |
| **Rückmeldung** zu ergriffenen oder geplanten Folgemaßnahmen bzw. Gründen der Nichtverfolgung: spätestens **3 Monate nach Entgegennahme** des Hinweises | § 13 Abs. 9 | Feld „Rückmeldung fällig bis“ – **Achtung:** das Backend rechnet derzeit ab der Eingangsbestätigung. Bis zur Korrektur die Frist selbst ab dem Eingangsdatum rechnen. `[OFFEN: Korrektur in hinweis.py]` |
| Aufbewahrung **5 Jahre** ab letztmaliger Verarbeitung oder Übermittlung, darüber hinaus für bereits eingeleitete Verfahren | § 8 Abs. 11 | automatisch 5 Jahre nach „Abgeschlossen“; bei laufendem Verfahren „Aufbewahrung verlängert“ mit Grund setzen |

## 4. Ablauf je Hinweis

| Schritt | Frist | Tätigkeit |
|---|---|---|
| 1. Eingang | Tag 0 | Fall öffnen. Geltungsbereich grob prüfen (§ 3 HSchG). Interessenkonflikt prüfen. |
| 2. Eingangsbestätigung | spätestens Tag 7 | Nachricht mit Vorlage A (Absender *Meldestelle*), dann Status → **Eingang bestätigt**. |
| 3. Prüfung der Stichhaltigkeit | laufend | Rückfragen mit Vorlage B. Interne Notizen immer mit Haken **Intern**. Feld *Stichhaltigkeit* pflegen. Status → **In Prüfung**. |
| 4. Betroffene Person | erst, wenn keine Gefährdung mehr besteht | Solange es zum Schutz der Identität oder zur Aufklärung erforderlich ist, **sind Information und Auskunft zum Hinweis zu unterlassen** (§ 8 Abs. 9 HSchG). Beginn und Grund der Beschränkung als interne Notiz dokumentieren; danach Vorlage D. |
| 5. Folgemaßnahmen (§ 5 Z 3) | laufend | Im Feld *Folgemaßnahmen* dokumentieren: interne Untersuchung, Abgabe an die zuständige Stelle im Unternehmen (§ 13 Abs. 3), Verweis an eine Behörde, Einstellung. Status → **Folgemaßnahmen**. |
| 6. Rückmeldung | spätestens 3 Monate nach Eingang | Vorlage C. Nur mitteilen, was interne Ermittlungen und Rechte Dritter nicht beeinträchtigt. |
| 7. Abschluss | – | Status → **Abgeschlossen**. Löschung automatisch nach 5 Jahren; Verlängerung nur mit Grund. |

**Nicht nachzugehen ist Hinweisen (§ 13 Abs. 6),** die nicht in den Geltungsbereich des HSchG fallen oder aus denen keine
Anhaltspunkte für ihre Stichhaltigkeit hervorgehen: freundlich rückmelden (Vorlage C, Variante 2) und abschließen.
Hinweise außerhalb des HSchG, die dennoch intern relevant sind (z. B. Arbeitnehmerschutz), können mit Zustimmung der
Person an die zuständige Stelle weitergegeben werden – ohne Identität, soweit nicht ausdrücklich gewünscht.

**Offenkundig falsche Hinweise (§ 6 Abs. 4, § 13 Abs. 6):** zurückweisen mit dem Hinweis, dass solche Hinweise
Schadenersatzansprüche begründen und als Verwaltungsübertretung verfolgt werden können (§ 24 Z 4) – Vorlage C, Variante 3.

**Verbraucherbeschwerden:** auf Kundenservice/Kontakt verweisen, ohne den Hinweis weiterzuleiten.

## 5. Mündliche Hinweise und Zusammenkunft (§ 9 Abs. 2–5, § 13 Abs. 5)

- Eine Zusammenkunft (auch per Videokonferenz) findet auf Ersuchen spätestens innerhalb von 14 Kalendertagen statt.
  Termin über das Postfach vereinbaren.
- **Mit Zustimmung** der Person: Tonaufzeichnung oder vollständige, genaue Transkription (§ 9 Abs. 4). **Ohne Aufzeichnung:**
  detailliertes Protokoll (§ 9 Abs. 5).
- Der Person Gelegenheit geben, Transkription bzw. Protokoll zu **prüfen, zu berichtigen und durch Unterschrift zu
  bestätigen** (bei anonymen Hinweisen, soweit tunlich).
- Das Protokoll als interne Notiz bzw. Anhang im Fall ablegen (Quelle „Persönliches Gespräch“). Aufzeichnungen nur im
  Backoffice speichern (§ 9 Abs. 6: vertrauliches, sicheres System mit protokolliertem und beschränktem Zugang).
- Telefonische Hinweise (Quelle „Telefon“) werden gleich behandelt (§ 9 Abs. 2 und 3). Eine eigene Rufnummer gibt es derzeit
  nicht.

## 6. Weitergabe von Informationen

- An Geschäftsführung oder Personal nur, soweit für Folgemaßnahmen **erforderlich**, und grundsätzlich **ohne Identität**
  der hinweisgebenden Person.
- Die Identität darf nur offengelegt werden:
  - mit ausdrücklicher Zustimmung der Person (schriftlich im Postfach dokumentieren), oder
  - wenn eine Verwaltungsbehörde, ein Gericht oder die Staatsanwaltschaft dies nach § 7 Abs. 3 HSchG für unerlässlich hält.
    Die Behörde unterrichtet die Person vorher, außer das gefährdet das Verfahren (§ 7 Abs. 4).
- Jede Weitergabe als interne Notiz dokumentieren: an wen, was, warum, Rechtsgrundlage. Übermittlungen sind nach
  § 8 Abs. 12 HSchG zu protokollieren.

## 7. Textvorlagen

Platzhalter in `‹…›` ersetzen. Im Postfach ist keine Anrede mit Namen nötig.

### Vorlage A – Eingangsbestätigung (spätestens 7 Kalendertage)

> Guten Tag,
>
> vielen Dank für Ihren Hinweis vom ‹Datum›. Hiermit bestätigen wir den Eingang.
>
> Ihr Hinweis wird von der internen Stelle vertraulich geprüft. Ihre Identität, sofern Sie diese angegeben haben, ist nach
> § 7 HinweisgeberInnenschutzgesetz (HSchG) geschützt. Spätestens drei Monate nach Eingang Ihres Hinweises erhalten Sie hier
> eine Rückmeldung zu den ergriffenen oder geplanten Folgemaßnahmen.
>
> Sie können Ihren Hinweis jederzeit über dieses Postfach ergänzen oder berichtigen. Auf Wunsch vereinbaren wir auch ein
> persönliches Gespräch. Möglicherweise haben wir Rückfragen – bitte schauen Sie daher gelegentlich in dieses Postfach.
>
> Mit freundlichen Grüßen
> Interne Stelle der Ökovolt Solartechnik GmbH

### Vorlage B – Rückfrage

> Guten Tag,
>
> zur weiteren Prüfung Ihres Hinweises haben wir folgende Fragen:
>
> 1. ‹Frage›
> 2. ‹Frage›
>
> Bitte beantworten Sie nur, was Sie wissen und mitteilen möchten. Wenn Sie anonym bleiben wollen, achten Sie bitte darauf,
> keine Angaben zu machen, die auf Ihre Person schließen lassen.
>
> Mit freundlichen Grüßen
> Interne Stelle

### Vorlage C – Rückmeldung (spätestens 3 Monate nach Eingang)

**Variante 1 – Folgemaßnahmen ergriffen oder geplant**

> Guten Tag,
>
> wir haben Ihren Hinweis geprüft und informieren Sie über den Stand: ‹z. B. „Der Sachverhalt wurde intern untersucht.
> Es wurden Maßnahmen ergriffen, um den Missstand abzustellen.“ / „Der Vorgang wurde an die zuständige Stelle zur weiteren
> Bearbeitung abgegeben.“›
>
> Aus Rücksicht auf laufende Verfahren und die Rechte der betroffenen Personen können wir keine weiteren Einzelheiten nennen.
>
> Wir danken Ihnen ausdrücklich für Ihren Hinweis. Vergeltungsmaßnahmen wegen eines berechtigten Hinweises sind nach § 20
> HSchG rechtsunwirksam. Sollten Sie dennoch Nachteile erfahren, wenden Sie sich bitte über dieses Postfach an uns.
>
> Mit freundlichen Grüßen
> Interne Stelle

**Variante 2 – nicht stichhaltig oder nicht im Geltungsbereich**

> Guten Tag,
>
> wir haben Ihren Hinweis sorgfältig geprüft. ‹Die geschilderten Umstände haben sich nicht bestätigt. / Der Sachverhalt
> fällt nicht in den Geltungsbereich des HinweisgeberInnenschutzgesetzes; für Anliegen dieser Art wenden Sie sich bitte an
> ‹Stelle›.›
>
> Das Verfahren ist damit abgeschlossen. Wenn Sie neue Informationen haben, können Sie jederzeit einen neuen Hinweis geben.
>
> Mit freundlichen Grüßen
> Interne Stelle

**Variante 3 – offenkundig falscher Hinweis (§ 6 Abs. 4 HSchG)** `[OFFEN: Formulierung rechtlich prüfen]`

> Guten Tag,
>
> nach Prüfung weisen wir Ihren Hinweis zurück, weil er offenkundig nicht zutrifft. Wir weisen darauf hin, dass offenkundig
> falsche Hinweise Schadenersatzansprüche begründen und gerichtlich oder als Verwaltungsübertretung (§ 24 Z 4 HSchG)
> verfolgt werden können.
>
> Interne Stelle

### Vorlage D – Information der betroffenen Person (Art. 14 DSGVO) – erst nach Wegfall der Beschränkung (§ 8 Abs. 9 HSchG)

> Vertraulich
>
> Sehr geehrte/r ‹Name›,
>
> wir informieren Sie, dass im Rahmen unseres internen Hinweisgebersystems personenbezogene Daten über Sie verarbeitet
> wurden bzw. werden. Anlass ist ein Hinweis zu ‹allgemeine Beschreibung des Themas, ohne Rückschluss auf die
> hinweisgebende Person›.
>
> **Verantwortlicher:** Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething, office@oekovolt.at.
> **Zweck und Rechtsgrundlage:** Prüfung des Hinweises und Folgemaßnahmen nach dem HinweisgeberInnenschutzgesetz
> (Art. 6 Abs. 1 lit. c DSGVO i. V. m. § 8 HSchG).
> **Kategorien der Daten:** ‹z. B. Name, Funktion, Beschreibung des Verhaltens›.
> **Herkunft:** ein Hinweis an unsere interne Stelle. Die Identität der hinweisgebenden Person teilen wir nicht mit (§ 7 HSchG).
> **Empfänger:** interne Stelle; ggf. ‹zuständige Stellen/Behörden›.
> **Speicherdauer:** fünf Jahre ab der letztmaligen Verarbeitung und darüber hinaus, solange es für bereits eingeleitete
> Verfahren erforderlich ist (§ 8 Abs. 11 HSchG).
> **Ihre Rechte:** Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch nach Art. 15 bis 21 DSGVO sowie
> Beschwerde bei der Österreichischen Datenschutzbehörde, Barichgasse 40–42, 1030 Wien, www.dsb.gv.at. Diese Rechte können
> eingeschränkt sein, soweit dies zum Schutz der Identität der hinweisgebenden Person oder zur Erreichung der Zwecke des
> HSchG erforderlich ist (§ 8 Abs. 9 HSchG).
>
> Ausführliche Informationen: www.oekovolt.com/hinweisgebersystem#datenschutz
>
> Sie haben Gelegenheit, zum Sachverhalt Stellung zu nehmen: ‹Termin/Kontakt›.
>
> Interne Stelle

### Vorlage E – Übergang von IntegrityLine (an Hinweisgebende mit offenen Fällen)

> Guten Tag,
>
> unser bisheriges Hinweisgeberportal (IntegrityLine) wird zum ‹Datum› eingestellt. Ihren Hinweis ‹Fall-Nr. alt›
> bearbeiten wir selbstverständlich weiter.
>
> Damit Sie auch danach mit uns in Kontakt bleiben können – weiterhin auf Wunsch anonym –, geben Sie bitte über unser neues
> Hinweisgebersystem eine kurze Nachricht mit dem Vermerk „Fortsetzung Fall ‹Fall-Nr. alt›“ ab:
> https://www.oekovolt.com/hinweisgebersystem
>
> Sie erhalten dort eine neue Fall-Nummer und einen Zugangsschlüssel. Wir führen beide Vorgänge zusammen.
>
> Mit freundlichen Grüßen
> Interne Stelle

## 8. Checkliste Vertretung und Abwesenheit

- [ ] Die Vertretung hat im Backoffice die Rolle `Hinweis Meldestelle` und 2FA (nicht das Konto `Administrator` – es wird bei
      Benachrichtigungen übersprungen).
- [ ] Offene Fälle mit Fristen in der Abwesenheit sind übergeben: interne Notiz „Übergabe an ‹Name› am ‹Datum›“.
- [ ] Die Benachrichtigungs-E-Mails erreichen auch die Vertretung.
- [ ] Erbetene Zusammenkünfte (14-Tage-Frist) sind im Kalender der Vertretung eingetragen.
