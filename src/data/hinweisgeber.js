// src/data/hinweisgeber.js
// Inhalte des internen Meldekanals nach dem Hinweisgeberschutzgesetz (HinSchG).

// Weitere Meldewege nach § 16 Abs. 3 HinSchG (mündlich / persönlich).
// TELEFON: eigene Rufnummer der Meldestelle eintragen, sobald vorhanden –
// nicht die Zentrale, damit Anrufe vertraulich bei der Meldestelle landen.
export const MELDESTELLE = {
  telefon: null, // z. B. "+49 8245 96 788 99"
  telefonzeiten: null, // z. B. "Mo–Do 9–15 Uhr"
  postanschrift: ["ÖKOVOLT GmbH Solartechnik", "– Interne Meldestelle – persönlich/vertraulich –", "Schlingener Straße 1a", "86842 Türkheim"],
};

export const EXTERNE_MELDESTELLE_URL = "https://www.bundesjustizamt.de/DE/MeldestelledesBundes/MeldestelledesBundes_node.html";

// Datenschutzhinweise nach Art. 13 und 14 DSGVO für das Hinweisgebersystem.
// Offene Punkte (Serverstandort Backoffice, DSB) siehe docs/datenschutz/.
export const DATENSCHUTZ = [
  {
    titel: "Verantwortlicher",
    text: [
      "ÖKOVOLT GmbH Solartechnik, Schlingener Straße 1a, 86842 Türkheim, Telefon +49 8245 96 788 0, E-Mail office@oekovolt.com. Für Fragen zum Datenschutz im Hinweisgebersystem können Sie uns auch vertraulich über Ihr Postfach oder per Post an die interne Meldestelle kontaktieren.",
    ],
  },
  {
    titel: "Zwecke und Rechtsgrundlagen",
    text: [
      "Wir verarbeiten personenbezogene Daten, um Meldungen entgegenzunehmen, zu prüfen, mit der meldenden Person zu kommunizieren, Folgemaßnahmen zu ergreifen und die Meldung zu dokumentieren.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit §§ 10, 12 und 17 HinSchG. Soweit keine gesetzliche Pflicht zur Einrichtung der Meldestelle besteht, stützen wir die Verarbeitung auf unser berechtigtes Interesse an der Aufdeckung und Verhinderung von Rechtsverstößen (Art. 6 Abs. 1 lit. f DSGVO). Besondere Kategorien personenbezogener Daten (z. B. Gesundheitsdaten) verarbeiten wir nur, soweit sie in einer Meldung enthalten und für die Aufklärung erforderlich sind (Art. 9 Abs. 2 lit. g DSGVO in Verbindung mit § 10 Satz 2 HinSchG).",
    ],
  },
  {
    titel: "Welche Daten wir verarbeiten",
    text: [
      "Inhalt der Meldung (Thema, Sachverhalt, Zeitraum, Ort, genannte Personen), Ihre Nachrichten im Postfach sowie – nur wenn Sie nicht anonym melden – Name, E-Mail-Adresse und Telefonnummer. Betroffen sein können neben der meldenden Person auch Personen, die in der Meldung genannt werden, sowie Zeuginnen und Zeugen.",
      "Beim Absenden speichern wir weder Ihre IP-Adresse noch Browser- oder Gerätedaten zur Meldung. Ihr Zugangsschlüssel wird nicht im Klartext, sondern nur als kryptografischer Hash gespeichert. Es werden keine Cookies oder Analysewerkzeuge für die Meldung eingesetzt.",
    ],
  },
  {
    titel: "Wer Zugriff hat – Empfänger",
    text: [
      "Zugriff haben ausschließlich die für die interne Meldestelle benannten Personen. Sie sind zur Vertraulichkeit verpflichtet (§ 8 HinSchG). Die Identität der meldenden Person und der in der Meldung genannten Personen geben wir nur in den gesetzlich vorgesehenen Ausnahmefällen weiter, etwa an Strafverfolgungsbehörden oder aufgrund einer gerichtlichen Entscheidung (§ 9 HinSchG).",
      "Für den technischen Betrieb setzen wir Dienstleister als Auftragsverarbeiter nach Art. 28 DSGVO ein: den Betreiber der Server von Website und Backoffice sowie Cloudflare, Inc. (USA) als Netzwerk- und Sicherheitsdienstleister, über dessen Infrastruktur die verschlüsselte Verbindung läuft.",
    ],
  },
  {
    titel: "Übermittlung in Drittländer",
    text: [
      "Über Cloudflare, Inc. kann eine Verarbeitung in den USA nicht ausgeschlossen werden. Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert; die Übermittlung erfolgt auf Grundlage des Angemessenheitsbeschlusses der EU-Kommission (Art. 45 DSGVO). Zusätzlich bestehen EU-Standardvertragsklauseln.",
    ],
  },
  {
    titel: "Speicherdauer",
    text: [
      "Die Dokumentation einer Meldung wird drei Jahre nach Abschluss des Verfahrens gelöscht (§ 11 Abs. 5 HinSchG). Eine längere Aufbewahrung erfolgt nur, wenn und solange sie zur Erfüllung gesetzlicher Pflichten erforderlich und verhältnismäßig ist – etwa während eines laufenden Gerichtsverfahrens.",
    ],
  },
  {
    titel: "Information der in einer Meldung genannten Personen",
    text: [
      "Personen, über die in einer Meldung berichtet wird, informieren wir grundsätzlich über die Verarbeitung ihrer Daten. Diese Information kann aufgeschoben werden, solange sie die Aufklärung des Sachverhalts oder die Vertraulichkeit der meldenden Person gefährden würde (Art. 14 Abs. 5 lit. b DSGVO, § 29 Abs. 1 BDSG, § 8 HinSchG). Die Identität der meldenden Person wird dabei nicht offengelegt.",
    ],
  },
  {
    titel: "Ihre Rechte",
    text: [
      "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Widerspruch (Art. 21 DSGVO), soweit die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO beruht. Diese Rechte können eingeschränkt sein, soweit dies zum Schutz der Vertraulichkeit anderer Personen oder zur Aufklärung erforderlich ist (Art. 23 DSGVO, §§ 29, 34 BDSG, § 8 HinSchG).",
      "Bei anonymen Meldungen können wir Anfragen nur beantworten, wenn Sie sich über Ihr Postfach mit Fall-Nummer und Zugangsschlüssel an uns wenden.",
      "Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für uns zuständig ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, www.lda.bayern.de.",
    ],
  },
  {
    titel: "Freiwilligkeit und automatisierte Entscheidungen",
    text: [
      "Die Abgabe einer Meldung und die Angabe Ihrer Identität sind freiwillig. Eine automatisierte Entscheidungsfindung einschließlich Profiling (Art. 22 DSGVO) findet nicht statt.",
    ],
  },
];

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
