// src/data/hinweisgeber.js
// Inhalte des internen Meldekanals nach dem Hinweisgeberschutzgesetz (HinSchG).

export const KATEGORIEN = [
  { id: "Straftat", label: "Straftat", text: "z. B. Betrug, Diebstahl, Untreue, Bestechung" },
  { id: "Ordnungswidrigkeit", label: "Ordnungswidrigkeit", text: "z. B. Verstöße gegen Arbeitsschutz oder Mindestlohn" },
  { id: "Arbeitssicherheit", label: "Arbeits- & Gesundheitsschutz", text: "z. B. fehlende Absturzsicherung, Gefährdungen" },
  { id: "Umwelt", label: "Umweltschutz", text: "z. B. unsachgemäße Entsorgung von Modulen oder Batterien" },
  { id: "Datenschutz", label: "Datenschutz & IT-Sicherheit", text: "z. B. unzulässige Weitergabe personenbezogener Daten" },
  { id: "Produktsicherheit", label: "Produkt- & Anlagensicherheit", text: "z. B. Verstöße gegen technische Normen" },
  { id: "Wettbewerb", label: "Wettbewerb & Vergabe", text: "z. B. Preisabsprachen, Verstöße im Vergaberecht" },
  { id: "Diskriminierung", label: "Diskriminierung & Belästigung", text: "z. B. Benachteiligung, Mobbing, sexuelle Belästigung" },
  { id: "Sonstiges", label: "Sonstiger Verstoß", text: "Ein anderer Verstoß gegen Gesetze oder interne Regeln" },
];

export const BEZIEHUNG = ["Mitarbeiter/in", "Ehemalige/r Mitarbeiter/in", "Bewerber/in", "Kunde/Kundin", "Lieferant / Geschäftspartner", "Sonstiges", "Keine Angabe"];

export const ABLAUF = [
  { title: "Meldung abgeben", text: "Sie schildern den Sachverhalt – auf Wunsch vollständig anonym. Sie erhalten eine Fall-Nummer und einen persönlichen Zugangsschlüssel." },
  { title: "Eingangsbestätigung", text: "Spätestens nach 7 Tagen bestätigt die Meldestelle den Eingang in Ihrem Postfach." },
  { title: "Prüfung & Rückfragen", text: "Die Meldestelle prüft den Hinweis vertraulich und kann Ihnen über das Postfach Rückfragen stellen." },
  { title: "Rückmeldung", text: "Spätestens 3 Monate nach der Eingangsbestätigung erfahren Sie, welche Folgemaßnahmen ergriffen wurden." },
];

export const FAQ = [
  {
    q: "Wer kann eine Meldung abgeben?",
    a: "Alle Personen, die im Zusammenhang mit ihrer beruflichen Tätigkeit Informationen über Verstöße bei der ÖKOVOLT GmbH Solartechnik erlangt haben – zum Beispiel Mitarbeitende, ehemalige Mitarbeitende, Bewerbende, Lieferanten, Geschäftspartner oder Kunden.",
  },
  {
    q: "Kann ich anonym melden?",
    a: "Ja. Sie müssen keine Angaben zu Ihrer Person machen. Über die Fall-Nummer und Ihren Zugangsschlüssel können Sie trotzdem Rückfragen der Meldestelle beantworten und den Bearbeitungsstand verfolgen. Bewahren Sie beides sicher auf – aus Gründen der Anonymität können wir einen verlorenen Schlüssel nicht wiederherstellen.",
  },
  {
    q: "Wer liest meine Meldung?",
    a: "Ausschließlich die intern benannte, unabhängige Meldestelle. Sie ist bei der Bearbeitung nicht weisungsgebunden und zur Vertraulichkeit verpflichtet. Die Identität meldender Personen wird nach § 8 HinSchG geschützt.",
  },
  {
    q: "Bin ich vor Nachteilen geschützt?",
    a: "Ja. Das Hinweisgeberschutzgesetz verbietet Repressalien gegen Personen, die in gutem Glauben Verstöße melden – etwa Kündigung, Abmahnung oder Benachteiligung (§ 36 HinSchG). Wissentlich falsche Meldungen sind davon nicht geschützt.",
  },
  {
    q: "Welche Daten werden gespeichert?",
    a: "Nur die Angaben, die Sie selbst machen. Beim Absenden speichern wir weder Ihre IP-Adresse noch Browserdaten zur Meldung. Die Dokumentation wird drei Jahre nach Abschluss des Verfahrens gelöscht (§ 11 HinSchG), sofern keine längere Aufbewahrung gesetzlich erforderlich ist.",
  },
  {
    q: "Gibt es externe Meldestellen?",
    a: "Ja. Sie können sich alternativ an die externe Meldestelle des Bundes beim Bundesamt für Justiz wenden. Wir empfehlen die interne Meldung, weil wir Hinweisen so am schnellsten nachgehen können – die Wahl liegt aber bei Ihnen.",
  },
];
