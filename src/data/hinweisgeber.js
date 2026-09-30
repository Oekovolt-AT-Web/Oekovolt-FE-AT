// src/data/hinweisgeber.js
// Inhalte zum Hinweisgeberschutz nach dem österreichischen HinweisgeberInnenschutzgesetz (HSchG,
// BGBl. I Nr. 6/2023).
//
// Informationsseite: /hinweisgeberschutz (in beiden Zuständen erreichbar, Ziel von Footer,
// Impressum, LegalShell und llms.txt).
//
// ── Schalter HINWEIS_INTERN ────────────────────────────────────────────────────────────────
// Ein Schalter für alles: process.env.HINWEIS_INTERN === "1"
//   AUS (Standard, Variable leer/0): Meldekanal ist das externe Portal IntegrityLine.
//        /hinweisgebersystem leitet per next.config.mjs (307) dorthin um, /api/hinweis* antwortet 503.
//   AN  (=1): eigenes Hinweisgebersystem (MeldeFormular + anonymes Postfach unter /hinweisgebersystem,
//        Daten im eigenen Backoffice, DocType „Hinweis“). Kein Redirect, Seite indexierbar und in der
//        Sitemap, Datenschutztexte beschreiben das eigene System.
// Erst auf 1 setzen, wenn docs/frappe-hinweisgebersystem/GO-LIVE-AT.md vollständig abgehakt ist.
//
// WANN der Wert gilt: Die Konstanten werden SERVERSEITIG ausgewertet. Alle Seiten, die sie nutzen
// (/hinweisgeberschutz, /hinweisgebersystem, /datenschutz, /barrierefreiheit, sitemap.xml,
// llms.txt), sind Server-Komponenten bzw. werden statisch erzeugt → maßgeblich ist der Wert zur
// BUILD-Zeit; die Redirects in next.config.mjs ebenfalls. Nur /api/hinweis* (force-dynamic) liest
// ihn zur Laufzeit. Nach jeder Änderung daher: neu bauen UND neu starten.
//
// NICHT in Client-Komponenten ("use client") für Verzweigungen verwenden: Dort ist
// process.env.HINWEIS_INTERN im Browser undefined → falscher Zustand bzw. Hydration-Fehler.
// Braucht eine Client-Komponente den Zustand, wird er von einer Server-Komponente per Prop übergeben.
// ───────────────────────────────────────────────────────────────────────────────────────────

import { FIRMA } from "@/lib/site";

/** true = eigenes Hinweisgebersystem aktiv, false = IntegrityLine (Standard). */
export const HINWEIS_INTERN = process.env.HINWEIS_INTERN === "1";

/** Bisheriger interner Meldekanal (Hinweisgeberportal eines spezialisierten Dienstleisters). */
export const INTEGRITYLINE_URL = "https://oekovolt.integrityline.com/";

/** Pfad des eigenen Hinweisgebersystems. */
export const EIGENES_SYSTEM_PFAD = "/hinweisgebersystem";

/** Wohin „Hinweis abgeben“ führt – je nach Schalter. */
export const MELDEKANAL_URL = HINWEIS_INTERN ? EIGENES_SYSTEM_PFAD : INTEGRITYLINE_URL;
/** Sichtbare Bezeichnung des Meldekanals (Linktext). */
export const MELDEKANAL_LABEL = HINWEIS_INTERN ? "www.oekovolt.com/hinweisgebersystem" : "oekovolt.integrityline.com";
/** true = Meldekanal liegt auf fremder Domain (neuer Tab, rel="noopener noreferrer"). */
export const MELDEKANAL_EXTERN = !HINWEIS_INTERN;

// Weitere Meldewege (mündlich / persönlich) – nur für das eigene System.
// TELEFON: eigene Rufnummer der Meldestelle eintragen, sobald vorhanden –
// nicht die Zentrale, damit Anrufe vertraulich bei der Meldestelle landen. Solange null,
// zeigt /hinweisgebersystem keine Telefonnummer, sondern verweist für mündliche Meldungen auf
// das persönliche Gespräch nach Terminvereinbarung (keine Nummer erfinden!).
export const MELDESTELLE = {
  telefon: null, // z. B. "+43 6278 71030-99"
  telefonzeiten: null, // z. B. "Mo–Do 9–15 Uhr"
  postanschrift: [FIRMA.name, "– Interne Meldestelle – persönlich/vertraulich –", FIRMA.strasse, `${FIRMA.plz} ${FIRMA.ort}`],
};

/** Allgemeine externe Stelle nach § 15 HSchG: Bundesamt zur Korruptionsprävention und Korruptionsbekämpfung. */
export const BAK = {
  name: "Bundesamt zur Korruptionsprävention und Korruptionsbekämpfung (BAK)",
  adresse: "Herrengasse 7, 1010 Wien",
  url: "https://www.bak.gv.at/701/start.html",
};

// Rückwärtskompatibel für MeldeFormular/Seite des eigenen Systems
export const EXTERNE_MELDESTELLE_URL = BAK.url;

/** Sachlicher Geltungsbereich (§ 3 HSchG) – vereinfacht. */
export const RECHTSBEREICHE = [
  "öffentliches Auftragswesen",
  "Finanzdienstleistungen, Finanzprodukte und Finanzmärkte",
  "Verhinderung von Geldwäsche und Terrorismusfinanzierung",
  "Produktsicherheit und -konformität",
  "Verkehrssicherheit",
  "Umweltschutz",
  "Strahlenschutz und nukleare Sicherheit",
  "Lebensmittel- und Futtermittelsicherheit, Tiergesundheit und Tierschutz",
  "öffentliche Gesundheit",
  "Verbraucherschutz",
  "Schutz der Privatsphäre und personenbezogener Daten, Sicherheit von Netz- und Informationssystemen",
  "Verhinderung und Ahndung von Korruptionsdelikten und strafbaren Verletzungen der Amtspflicht (§§ 302 bis 309 StGB)",
  "Verletzungen der finanziellen Interessen der Union sowie Binnenmarktvorschriften einschließlich Wettbewerbs- und Beihilfenrecht",
];

/** Weitere externe Stellen, die nach Bundesgesetzen für bestimmte Bereiche zuständig sind. */
export const WEITERE_EXTERNE_STELLEN = [
  { name: "Finanzmarktaufsichtsbehörde (FMA)", url: "https://www.fma.gv.at" },
  { name: "Bundeswettbewerbsbehörde (BWB)", url: "https://www.bwb.gv.at" },
  { name: "Abschlussprüferaufsichtsbehörde (APAB)", url: "https://www.apab.gv.at" },
  { name: "Geldwäschemeldestelle im Bundeskriminalamt", url: "https://www.bundeskriminalamt.at" },
  { name: "Bilanzbuchhaltungsbehörde, Kammer der Steuerberater:innen und Wirtschaftsprüfer:innen, Notariats- und Rechtsanwaltskammern (für ihre Berufsstände)" },
];

// Datenschutzhinweise nach Art. 13 und 14 DSGVO für das EIGENE Hinweisgebersystem (HINWEIS_INTERN=1).
// Angezeigt auf /hinweisgebersystem#datenschutz und – im AN-Zustand – auf /hinweisgeberschutz#datenschutz.
// Nur beschreiben, was technisch umgesetzt ist (src/lib/hinweisApi.js, /api/hinweis*, Frappe-DocType „Hinweis“).
export const DATENSCHUTZ = [
  {
    titel: "Verantwortlicher",
    text: [
      `${FIRMA.name}, ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, Telefon ${FIRMA.telefon}, E-Mail ${FIRMA.email}. Für Fragen zum Datenschutz im Hinweisgebersystem können Sie uns auch vertraulich über Ihr Postfach oder per Post an die interne Meldestelle kontaktieren.`,
    ],
  },
  {
    titel: "Zwecke und Rechtsgrundlagen",
    text: [
      "Wir verarbeiten personenbezogene Daten, um Hinweise entgegenzunehmen, zu prüfen, mit der hinweisgebenden Person zu kommunizieren, Folgemaßnahmen zu ergreifen und den Hinweis zu dokumentieren.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 8 HSchG. Soweit keine gesetzliche Pflicht zur Einrichtung einer internen Stelle besteht oder ein Hinweis nicht in den Geltungsbereich des HSchG fällt, stützen wir die Verarbeitung auf unser berechtigtes Interesse an der Aufdeckung und Verhinderung von Rechtsverstößen (Art. 6 Abs. 1 lit. f DSGVO). Besondere Kategorien personenbezogener Daten und Daten über strafrechtlich relevante Sachverhalte verarbeiten wir nur, soweit sie in einem Hinweis enthalten und für die Aufklärung unbedingt erforderlich sind (Art. 9 Abs. 2 lit. g und Art. 10 DSGVO in Verbindung mit § 8 HSchG).",
    ],
  },
  {
    titel: "Welche Daten wir verarbeiten",
    text: [
      "Inhalt des Hinweises (Thema, Sachverhalt, Zeitraum, Ort, genannte Personen), Ihre Nachrichten im Postfach sowie – nur wenn Sie nicht anonym melden – Name, E-Mail-Adresse und Telefonnummer. Betroffen sein können neben der hinweisgebenden Person auch Personen, die im Hinweis genannt werden, sowie Zeuginnen und Zeugen.",
      "Anonyme Meldung: Angaben zu Ihrer Person sind freiwillig. Nach dem Absenden erhalten Sie eine Fall-Nummer und einen Zugangsschlüssel für Ihr Postfach, über das Sie Rückfragen beantworten und den Bearbeitungsstand abrufen. Der Zugangsschlüssel wird nicht im Klartext, sondern nur als kryptografischer Hash gespeichert; verlorene Zugangsdaten können wir daher nicht wiederherstellen.",
      "Ihre IP-Adresse sowie Browser- oder Gerätedaten werden nicht mit dem Hinweis gespeichert und nicht an unser Backoffice übermittelt. Ihre Eingaben werden nicht im Browser zwischengespeichert. Inhalte von Hinweisen und Postfach-Nachrichten werden nicht an Statistik- oder Analysewerkzeuge übermittelt.",
    ],
  },
  {
    titel: "Wo die Daten verarbeitet werden – Sicherheit",
    text: [
      "Hinweise werden nicht bei einem externen Portalanbieter, sondern in unserem eigenen Backoffice gespeichert. Die Übertragung von Ihrem Browser an unsere Website und von dort an das Backoffice erfolgt verschlüsselt (HTTPS/TLS). Das Formular übermittelt die Meldung ausschließlich serverseitig über einen eigenen, eingeschränkten Zugang, der Hinweise anlegen, aber nicht lesen kann.",
      "Die Meldestelle wird über neue Meldungen und Nachrichten per E-Mail ohne Inhalte benachrichtigt; die Inhalte sind nur nach Anmeldung im Backoffice einsehbar.",
    ],
  },
  {
    titel: "Wer Zugriff hat – Empfänger",
    text: [
      "Zugriff haben ausschließlich die für die interne Stelle benannten Personen. Sie sind unparteiisch, bei der Bearbeitung nicht weisungsgebunden und zur Vertraulichkeit verpflichtet (§ 7 HSchG). Die Identität der hinweisgebenden Person und der im Hinweis genannten Personen geben wir nur in den gesetzlich vorgesehenen Ausnahmefällen weiter, etwa wenn dies in einem verwaltungsbehördlichen oder gerichtlichen Verfahren unerlässlich ist.",
      "Für den technischen Betrieb setzen wir Dienstleister als Auftragsverarbeiter nach Art. 28 DSGVO ein, insbesondere den Betreiber der Server von Website und Backoffice.",
    ],
  },
  {
    titel: "Speicherdauer",
    text: [
      // RECHTLICH PRÜFEN: Frist wie im Backend umgesetzt (Frappe hinweis.py: loeschung_faellig =
      // abgeschlossen_am + 5 Jahre; täglicher Job loesche_abgelaufene_hinweise). § 8 Abs. 11 HSchG
      // knüpft an die „letztmalige Verarbeitung oder Übermittlung“ an – Gleichsetzung mit dem Abschluss
      // und Umgang mit Protokolldaten durch Jurist/DSB bestätigen lassen (siehe GO-LIVE-AT.md).
      "Hinweise und die zugehörige Dokumentation bewahren wir fünf Jahre nach Abschluss des Verfahrens auf und darüber hinaus nur so lange, als es zur Durchführung bereits eingeleiteter verwaltungsbehördlicher oder gerichtlicher Verfahren erforderlich ist (§ 8 Abs. 11 HSchG). Danach werden sie automatisch gelöscht.",
    ],
  },
  {
    titel: "Einschränkung von Betroffenenrechten",
    text: [
      "Solange und soweit es zum Schutz der Identität der hinweisgebenden Person oder der im Hinweis genannten Personen oder zur Erreichung der Zwecke des HSchG erforderlich ist – insbesondere während laufender Ermittlungen oder Verfahren –, sind das Recht auf Information, Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Widerspruch sowie die Benachrichtigung bei Datenschutzverletzungen eingeschränkt (§ 8 HSchG in Verbindung mit Art. 23 DSGVO).",
      "Bei anonymen Hinweisen können wir Anfragen nur beantworten, wenn Sie sich über Ihr Postfach mit Fall-Nummer und Zugangsschlüssel an uns wenden.",
    ],
  },
  {
    titel: "Ihre Rechte und Beschwerde",
    text: [
      "Im Übrigen haben Sie die Rechte nach Art. 15 bis 21 DSGVO. Sie können sich bei der Österreichischen Datenschutzbehörde beschweren: Barichgasse 40–42, 1030 Wien, dsb@dsb.gv.at, www.dsb.gv.at.",
      "Die Abgabe eines Hinweises und die Angabe Ihrer Identität sind freiwillig. Eine automatisierte Entscheidungsfindung einschließlich Profiling (Art. 22 DSGVO) findet nicht statt.",
    ],
  },
];

// Kategorien des eigenen Meldeformulars. Die id wird von /api/hinweis geprüft ("Sonstiges" als Rückfall).
export const KATEGORIEN = [
  { id: "Korruption", label: "Korruption & Amtsdelikte", text: "z. B. Bestechung, Vorteilsannahme, Amtsmissbrauch (§§ 302–309 StGB)" },
  { id: "Vergabe", label: "Vergabe & Wettbewerb", text: "z. B. Absprachen bei Ausschreibungen, Verstöße gegen das Bundesvergabegesetz" },
  { id: "Produktsicherheit", label: "Produkt- & Anlagensicherheit", text: "z. B. Verstöße gegen elektrotechnische Sicherheitsvorschriften oder Normen" },
  { id: "Umwelt", label: "Umweltschutz", text: "z. B. unsachgemäße Entsorgung von Modulen oder Batterien" },
  { id: "Datenschutz", label: "Datenschutz & IT-Sicherheit", text: "z. B. unzulässige Weitergabe personenbezogener Daten" },
  { id: "Verbraucherschutz", label: "Verbraucherschutz", text: "z. B. irreführende Angaben gegenüber Kundinnen und Kunden" },
  { id: "Finanzen", label: "Finanzen & Geldwäsche", text: "z. B. Förder- oder Abrechnungsbetrug, verdächtige Zahlungsflüsse" },
  { id: "Arbeitssicherheit", label: "Arbeitnehmerschutz", text: "z. B. fehlende Absturzsicherung, Gefährdungen auf der Baustelle" },
  { id: "Sonstiges", label: "Sonstiger Verstoß", text: "Ein anderer Verstoß gegen Gesetze oder interne Regeln" },
];

export const BEZIEHUNG = ["Mitarbeiter/in", "Ehemalige/r Mitarbeiter/in", "Bewerber/in", "Leiharbeitskraft / Praktikant/in", "Selbständige/r Auftragnehmer/in", "Lieferant / Geschäftspartner", "Kunde/Kundin", "Sonstiges", "Keine Angabe"];

// ── Fristen (HSchG, BGBl. I Nr. 6/2023; im RIS geprüft am 30.09.2026, §§ 9 und 13 seit 25.02.2023 unverändert) ──
// § 9 Abs. 1: Eingang schriftlicher Hinweise unverzüglich, spätestens nach sieben Kalendertagen bestätigen.
// § 13 Abs. 9: Rückmeldung spätestens drei Monate nach ENTGEGENNAHME des Hinweises – nicht ab der Bestätigung.
// Das Backend rechnet genauso (Frappe hinweis.py → fristen_ab_eingang). Andere Seiten sollen FRISTEN_TEXT
// übernehmen, statt die Fristen selbst zu formulieren. RECHTLICH PRÜFEN (Befund D8).
export const FRISTEN = { bestaetigungTage: 7, rueckmeldungMonate: 3 };

/** Ein Satz für Hinweiskästen und Aufzählungen (Quelle: § 9 Abs. 1 und § 13 Abs. 9 HSchG). */
export const FRISTEN_TEXT =
  "Eingangsbestätigung spätestens nach sieben Kalendertagen (§ 9 Abs. 1 HSchG), Rückmeldung zu den Folgemaßnahmen spätestens drei Monate nach Eingang des Hinweises (§ 13 Abs. 9 HSchG).";

export const ABLAUF = [
  { title: "Hinweis abgeben", text: "Sie schildern den Sachverhalt – auf Wunsch vollständig anonym. Sie erhalten eine Fall-Nummer und einen persönlichen Zugangsschlüssel." },
  { title: "Eingangsbestätigung", text: "Spätestens nach sieben Kalendertagen bestätigt die interne Stelle den Eingang (§ 9 Abs. 1 HSchG)." },
  { title: "Prüfung & Rückfragen", text: "Die interne Stelle prüft den Hinweis vertraulich und kann Ihnen über das Postfach Rückfragen stellen." },
  { title: "Rückmeldung", text: "Spätestens drei Monate nach Eingang Ihres Hinweises erfahren Sie, welche Folgemaßnahmen ergriffen wurden oder geplant sind – oder aus welchen Gründen der Hinweis nicht weiterverfolgt wird (§ 13 Abs. 9 HSchG)." },
];

// FAQ des eigenen Systems (Seite /hinweisgebersystem; im AUS-Zustand per Redirect nicht erreichbar)
export const FAQ = [
  {
    q: "Wer kann einen Hinweis abgeben?",
    a: `Alle Personen, die im Zusammenhang mit ihrer beruflichen Tätigkeit Informationen über Rechtsverletzungen bei der ${FIRMA.name} erlangt haben – zum Beispiel Mitarbeitende, ehemalige Mitarbeitende, Bewerbende, Leiharbeitskräfte, selbständige Auftragnehmer, Lieferanten oder Geschäftspartner.`,
  },
  {
    q: "Kann ich anonym melden?",
    a: "Ja. Sie müssen keine Angaben zu Ihrer Person machen. Über die Fall-Nummer und Ihren Zugangsschlüssel können Sie trotzdem Rückfragen beantworten und den Bearbeitungsstand verfolgen. Bewahren Sie beides sicher auf – einen verlorenen Schlüssel können wir aus Gründen der Anonymität nicht wiederherstellen.",
  },
  {
    q: "Wer liest meinen Hinweis?",
    a: "Ausschließlich die intern benannte interne Stelle. Sie ist bei der Bearbeitung unparteiisch, nicht weisungsgebunden und zur Vertraulichkeit verpflichtet. Die Identität hinweisgebender Personen wird nach § 7 HSchG geschützt.",
  },
  {
    q: "Bin ich vor Nachteilen geschützt?",
    a: "Ja. Vergeltungsmaßnahmen gegen Personen, die mit hinreichendem Grund einen berechtigten Hinweis geben – etwa Kündigung, Versetzung, Benachteiligung oder Einschüchterung –, sind nach § 20 HSchG rechtsunwirksam und begründen Schadenersatzansprüche. Wissentlich falsche Hinweise sind nicht geschützt und können bestraft werden (§ 24 HSchG).",
  },
  {
    q: "Welche Daten werden gespeichert?",
    a: "Nur die Angaben, die Sie selbst machen. Beim Absenden speichern wir weder Ihre IP-Adresse noch Browserdaten zum Hinweis. Die Daten werden fünf Jahre nach Abschluss des Verfahrens gelöscht, sofern sie nicht für ein bereits eingeleitetes behördliches oder gerichtliches Verfahren benötigt werden (§ 8 Abs. 11 HSchG).",
  },
  {
    q: "Gibt es externe Stellen?",
    a: "Ja. Allgemein zuständige externe Stelle ist das Bundesamt zur Korruptionsprävention und Korruptionsbekämpfung (BAK). Wir empfehlen die interne Meldung, weil wir Hinweisen so am schnellsten nachgehen können – die Wahl liegt aber bei Ihnen.",
  },
];

// FAQ der Informationsseite /hinweisgeberschutz (sichtbarer Text = FAQPage-Schema, daher nur Strings).
// Die ersten Antworten hängen vom Schalter HINWEIS_INTERN ab (Build-Zeit, siehe oben).
export const FAQ_INFO = [
  {
    q: "Wie gebe ich einen Hinweis bei Ökovolt ab?",
    a: HINWEIS_INTERN
      ? "Über unser Hinweisgebersystem unter www.oekovolt.com/hinweisgebersystem. Das Formular ist rund um die Uhr erreichbar, die Übertragung ist verschlüsselt und eine anonyme Meldung ist möglich. Über ein geschütztes Postfach mit Fall-Nummer und Zugangsschlüssel können Sie mit der internen Stelle kommunizieren, ohne Ihre Identität preiszugeben. Alternativ nehmen wir Hinweise per Post und im persönlichen Gespräch nach Terminvereinbarung entgegen."
      : "Über unser Hinweisgeberportal unter oekovolt.integrityline.com. Das Portal ist rund um die Uhr erreichbar, verschlüsselt und erlaubt auf Wunsch eine anonyme Meldung. Über ein geschütztes Postfach können Sie mit der internen Stelle kommunizieren, ohne Ihre Identität preiszugeben.",
  },
  {
    q: "Wer kann einen Hinweis abgeben?",
    a: "Personen, die im Zusammenhang mit ihrer beruflichen Tätigkeit Informationen über Rechtsverletzungen bei uns erlangt haben – etwa Mitarbeitende, ehemalige Mitarbeitende, Bewerbende, Leiharbeitskräfte, Praktikantinnen und Praktikanten, selbständige Auftragnehmer, Subunternehmer und Elektro-Partner, Lieferanten sowie Anteilseigner. Geschützt sind auch Personen, die Hinweisgebende unterstützen, etwa Betriebsratsmitglieder, Kolleginnen und Kollegen oder Angehörige.",
  },
  {
    q: "Welche Verstöße fallen unter das HinweisgeberInnenschutzgesetz?",
    a: "Das HSchG schützt Hinweise auf Rechtsverletzungen in den in § 3 HSchG genannten Bereichen, unter anderem öffentliches Auftragswesen, Produktsicherheit, Umweltschutz, Verbraucherschutz, Datenschutz und IT-Sicherheit, Geldwäsche sowie Korruptionsdelikte nach den §§ 302 bis 309 StGB. Hinweise auf andere Verstöße gegen Gesetze oder interne Regeln nehmen wir ebenfalls entgegen und behandeln sie vertraulich; der besondere gesetzliche Schutz des HSchG gilt dafür allerdings nur, soweit der Hinweis in dessen Geltungsbereich fällt.",
  },
  {
    q: "Kann ich anonym melden?",
    a: HINWEIS_INTERN
      ? "Ja. Sie müssen im Formular keine Angaben zu Ihrer Person machen. Bewahren Sie Fall-Nummer und Zugangsschlüssel sicher auf, damit Sie Rückfragen beantworten und die Rückmeldung abrufen können – einen verlorenen Schlüssel können wir aus Gründen der Anonymität nicht wiederherstellen. Wird Ihre Identität später ohne Ihr Zutun bekannt, genießen Sie denselben Schutz wie namentlich Hinweisgebende."
      : "Ja. Sie müssen im Portal keine Angaben zu Ihrer Person machen. Merken Sie sich die Zugangsdaten zu Ihrem Postfach gut, damit Sie Rückfragen beantworten und die Rückmeldung abrufen können. Wird Ihre Identität später ohne Ihr Zutun bekannt, genießen Sie denselben Schutz wie namentlich Hinweisgebende.",
  },
  {
    q: "Welche Fristen gelten?",
    a: "Wir bestätigen den Eingang Ihres Hinweises spätestens nach sieben Kalendertagen, sofern Sie nicht ausdrücklich darauf verzichten oder die Bestätigung Ihre Identität gefährden würde (§ 9 Abs. 1 HSchG). Spätestens drei Monate nach Eingang des Hinweises erhalten Sie eine Rückmeldung, welche Folgemaßnahmen ergriffen wurden oder geplant sind oder aus welchen Gründen der Hinweis nicht weiterverfolgt wird (§ 13 Abs. 9 HSchG).",
  },
  {
    q: "Bin ich vor Nachteilen geschützt?",
    a: "Ja, wenn Sie zum Zeitpunkt des Hinweises hinreichende Gründe zur Annahme hatten, dass die Informationen wahr sind und in den Geltungsbereich des HSchG fallen. Vergeltungsmaßnahmen wie Kündigung, Versetzung, Herabstufung, Disziplinarmaßnahmen, Einschüchterung oder Rufschädigung sind rechtsunwirksam und begründen Schadenersatzansprüche (§ 20 HSchG). In einem Verfahren genügt es, glaubhaft zu machen, dass eine Maßnahme eine Vergeltung für den Hinweis ist; das Unternehmen muss dann darlegen, dass ein anderes Motiv ausschlaggebend war (§ 23 HSchG).",
  },
  {
    q: "Muss ich mich zuerst intern melden?",
    a: "Nein. Sie können sich wahlweise an unsere interne Stelle oder an eine externe Stelle wenden, insbesondere an das Bundesamt zur Korruptionsprävention und Korruptionsbekämpfung (BAK). Wir empfehlen die interne Meldung, weil wir einem Hinweis so am schnellsten nachgehen und Missstände abstellen können.",
  },
  {
    q: "Was passiert bei wissentlich falschen Hinweisen?",
    a: "Wer wissentlich falsche Hinweise gibt, ist nicht geschützt. Nach § 24 HSchG ist das eine Verwaltungsübertretung, die mit Geldstrafe bis 20.000 Euro, im Wiederholungsfall bis 40.000 Euro bestraft werden kann. Dieselben Strafen drohen Personen, die Hinweisgebende behindern, unter Druck setzen oder Vergeltungsmaßnahmen ergreifen.",
  },
];
