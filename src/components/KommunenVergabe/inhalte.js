// src/components/KommunenVergabe/inhalte.js
//
// Inhalte für /kommunen/vergabe-foerderung (Stand 30.09.2026).
// Jede Angabe mit Quelle – siehe QUELLEN unten und src/lib/kommunen/vergabe.js.
// Keine Rechtsberatung. Was nicht an einer Primärquelle belegt ist, ist als „prüfen“ markiert.

import { EAG_IZ, ENERGIEGEMEINSCHAFTEN } from "@/components/Forderungen/Shared/bund";
import { SCHWELLEN, euro } from "@/lib/kommunen/vergabe";

const K = SCHWELLEN.klassisch;
const S = SCHWELLEN.sektoren;

/** Schwellenwerte klassischer öffentlicher Auftraggeber (Gemeinde, Verband, Land). */
export const TABELLE_KLASSISCH = [
  { verfahren: "Direktvergabe (§ 46)", bau: `unter ${euro(K.bau.direkt)}`, liefer: `unter ${euro(K.lieferDl.direkt)}` },
  { verfahren: "Direktvergabe mit vorheriger Bekanntmachung (§ 47)", bau: `unter ${euro(K.bau.direktBekanntmachung)}`, liefer: `unter ${euro(K.lieferDl.direktBekanntmachung)} (keine Erweiterung)` },
  { verfahren: "Nicht offenes Verfahren ohne Bekanntmachung (§ 43)", bau: `unter ${euro(K.bau.nichtOffenOhne)}`, liefer: "entfällt seit 01.03.2026" },
  { verfahren: "Verhandlungsverfahren ohne Bekanntmachung", bau: "nur in gesetzlichen Ausnahmefällen", liefer: "im Unterschwellenbereich nur bei besonders günstiger Gelegenheit (§ 44 Abs. 2)" },
  { verfahren: "Verfahren mit Bekanntmachung in Österreich", bau: `unter ${euro(K.bau.eu)}`, liefer: `unter ${euro(K.lieferDl.eu)}` },
  { verfahren: "EU-weite Bekanntmachung (Oberschwellenbereich)", bau: `ab ${euro(K.bau.eu)}`, liefer: `ab ${euro(K.lieferDl.eu)}` },
];

export const TABELLE_SEKTOREN = [
  { verfahren: "Direktvergabe", bau: `unter ${euro(S.bau.direkt)}`, liefer: `unter ${euro(S.lieferDl.direkt)}` },
  { verfahren: "Direktvergabe mit vorheriger Bekanntmachung", bau: `unter ${euro(S.bau.direktBekanntmachung)}`, liefer: `unter ${euro(S.lieferDl.direktBekanntmachung)}` },
  { verfahren: "Nicht offenes Verfahren und Verhandlungsverfahren ohne Bekanntmachung", bau: `unter ${euro(S.bau.nichtOffenOhne)}`, liefer: "–" },
  { verfahren: "EU-weite Bekanntmachung", bau: `ab ${euro(S.bau.eu)}`, liefer: `ab ${euro(S.lieferDl.eu)}` },
];

/** Was seit dem Vergaberechtsgesetz 2026 neu ist. */
export const NEU = [
  { titel: "Werte stehen im Gesetz", text: "Die Inhalte der befristeten Schwellenwerteverordnung sind seit 01.03.2026 direkt im Bundesvergabegesetz geregelt – ohne jährliche Verlängerung." },
  { titel: `Bau: Direktvergabe bis unter ${euro(K.bau.direkt)}`, text: `Mit vorheriger Bekanntmachung und im nicht offenen Verfahren ohne Bekanntmachung bis unter ${euro(K.bau.direktBekanntmachung)}.` },
  { titel: "Liefer- und Dienstleistungen enger", text: `Direktvergabe bis unter ${euro(K.lieferDl.direkt)}; das nicht offene Verfahren ohne Bekanntmachung entfällt.` },
  { titel: "Ab 01.10.2026: eForms auch national", text: "Elektronische Standardformulare für Bekanntmachungen werden laut Kundmachungsübersicht auch im nationalen Bereich verpflichtend – Vergabeplattform der Gemeinde früh klären." },
];

/** Ablauf vom Grundsatzbeschluss bis zur Förderabrechnung (für Prozess-Komponente). */
export const SCHRITTE = [
  { name: "Grundsatz & Potenzial", dauer: "Gemeinderat", text: "Grundsatzentscheidung für Photovoltaik und Auftrag zur Potenzialanalyse: Welche Liegenschaften, welche Verbräuche, welche Dächer und Netzanschlüsse kommen in Frage?" },
  { name: "Projekt festlegen", dauer: "Bauamt", text: "Standorte, Anlagengröße, Speicher und Eigenverbrauch festlegen; beim Netzbetreiber die Anschlussmöglichkeit klären, bevor Beträge fixiert werden." },
  { name: "Wert & Verfahren", dauer: "Amtsleitung", text: "Bau- oder Lieferauftrag nach dem Hauptgegenstand einordnen, Auftragswert ohne Umsatzsteuer sachkundig schätzen (§ 13 BVergG) und das Vergabeverfahren wählen – mit Vermerk." },
  { name: "Bedeckung & Förderung", dauer: "Finanzen", text: "Mittel im Voranschlag bzw. Nachtragsvoranschlag vorsehen, Förderungen und deren Fristen einplanen – etwa EAG-Antrag vor der Inbetriebnahme." },
  { name: "Beschluss", dauer: "zuständiges Organ", text: "Das nach der Gemeindeordnung zuständige Organ beschließt Auftrag und Finanzierung. Welche Wertgrenzen für Gemeinderat, Gemeindevorstand bzw. Stadtrat oder Bürgermeister gelten, regelt das Landesrecht." },
  { name: "Zuschlag & Betrieb", dauer: "Umsetzung", text: "Zuschlag, Montage, Fertigstellungsmeldung an den Netzbetreiber, Förderabrechnung – danach Monitoring und Berichte, etwa zur Verwendung von KIG-Mitteln." },
];

const eagD = EAG_IZ.kategorien.find((k) => k.id === "D");
const eagC = EAG_IZ.kategorien.find((k) => k.id === "C");

/** Förderungen und Mittel für Gemeinden – nur belegte Angaben, mit Stand. */
export const FOERDERUNGEN = [
  {
    id: "eag",
    traeger: "EAG-Förderabwicklungsstelle (OeMAG)",
    titel: "EAG-Investitionszuschuss PV & Speicher",
    status: "3. Call 08.–22.10.2026",
    offen: true,
    punkte: [
      `PV bis 1.000 kWp: Kategorie C ${eagC.satz}, Kategorie D ${eagD.satz} (Gebot)`,
      "Speicher 150 €/kWh, gefördert bis 50 kWh",
      "Antrag vor der Inbetriebnahme",
      "Einhaltung des Vergaberechts ist Fördervoraussetzung (§ 4 Abs. 1 Z 5 EAG-IZV)",
    ],
    link: { label: "Zum Fördercall", href: "/forderungen/eag-foerdercall", intern: true },
  },
  {
    id: "kig",
    traeger: "Bund – Kommunalinvestitionsgesetz 2025",
    titel: "KIG 2025: Mittel ohne Antrag",
    status: "Projekte mit Beginn 15.09.2024–31.12.2028",
    offen: true,
    punkte: [
      "Finanzzuweisung von insgesamt 620 Mio. € an die Gemeinden (§ 2 KIG 2025)",
      "seit dem Budgetbegleitgesetz 2025 ohne Antrag und ohne Eigenanteil",
      "Bericht an den Gemeinderat bis 31.12.2027 und 31.12.2029 – mit besonderem Blick auf Investitionen in die Energiewende",
      "Bericht auf der Homepage der Gemeinde veröffentlichen (§ 3)",
    ],
    link: { label: "Gesetzestext (JUSLINE)", href: "https://www.jusline.at/gesetz/kig_2025/gesamt" },
  },
  {
    id: "kem",
    traeger: "Klima- und Energiefonds",
    titel: "Klima- und Energie-Modellregionen",
    status: "Einreichung 2026 lief bis 30.09.2026, 12 Uhr",
    offen: false,
    punkte: [
      "Regionen aus mehreren Gemeinden mit Modellregionsmanagement",
      "Umsetzungsprojekte und Investitionsförderungen in der Region",
      "nächste Ausschreibung: laut Jahresprogramm des Klimafonds – noch offen",
    ],
    link: { label: "Förderungen des Klimafonds", href: "https://www.klimafonds.gv.at/foerderungen/" },
  },
  {
    id: "flex",
    traeger: "Klima- und Energiefonds / KPC",
    titel: "Energiemanagement – Flexibilisierung im Verteilnetz",
    status: "Einreichung 23.06.2026 – 15.04.2027",
    offen: true,
    punkte: [
      "für Betriebe, Gemeinden und Vereine mit Anschluss an Netzebene 6 oder 7",
      "gefördert: kommunikationsfähige, automatisierte Energiemanagementsysteme",
      "2,45 Mio. € Budget für Betriebe und Gemeinden",
    ],
    link: { label: "Programm beim Klimafonds", href: "https://www.klimafonds.gv.at/foerderung/energiemanagement-betriebe-2026/" },
  },
  {
    id: "ufi",
    traeger: "KPC – Umweltförderung im Inland",
    titel: "Umweltförderung für Gemeinden",
    status: "laufend, je Programm",
    offen: true,
    punkte: [
      "u. a. Wärmepumpe, thermische Solaranlagen, Fernwärmeanschluss, thermische Gebäudesanierung",
      "PV-Muster- und Leuchtturmprojekte: Einreichung 2024 am 05.11.2024 beendet",
      "Antragszeitpunkt je Programm verschieden – teils vor der ersten verbindlichen Bestellung",
    ],
    link: { label: "Programme für Gemeinden", href: "https://www.umweltfoerderung.at/gemeinden" },
  },
  {
    id: "land",
    traeger: "Bundesländer",
    titel: "Landesförderungen kombinieren",
    status: "je Bundesland",
    offen: true,
    punkte: [
      "EAG-Kategorien A–C und innovative PV mit Landes- und Gemeindeförderung kombinierbar – bis zu den beihilferechtlichen Höchstgrenzen",
      "Kategorie D (über 100 kWp): keine zusätzliche Förderung von Bund, Land oder Gemeinde",
      "Förderbedingungen des Landes vor der Bestellung prüfen",
    ],
    link: { label: "Landesförderungen", href: "/forderungen/landesforderungen", intern: true },
  },
];

const eegLokal = ENERGIEGEMEINSCHAFTEN.netzentgelt.find((n) => n.art.startsWith("EEG lokal"));
const eegRegional = ENERGIEGEMEINSCHAFTEN.netzentgelt.find((n) => n.art === "EEG regional (Netzebene 6/7)");

export const ENERGIEGEMEINSCHAFT = [
  { titel: "Mitglied, Gründerin, Betreiberin", text: "Gemeinden können sich an einer Erneuerbare-Energie-Gemeinschaft (lokal oder regional) oder einer Bürgerenergiegemeinschaft (österreichweit) beteiligen und eigene Anlagen einbringen." },
  { titel: "Ab 01.10.2026: 10 % für schutzbedürftige Haushalte", text: "Betreibt die Gemeinde eine Anlage in der gemeinsamen Energienutzung, muss sie schutzbedürftigen Haushalten Zugang zu mindestens 10 % der dafür jährlich erzeugten und eingespeisten Strommenge ermöglichen (§ 68 Abs. 6 ElWG) – auch in bestehenden Gemeinschaften. Preise und Bedingungen legt sie selbst fest." },
  { titel: "Reduzierte Netzentgelte bis Ende 2026", text: `EEG auf Netzebene 6/7: lokal ${eegLokal?.reduktion ?? "–57 %"}, regional ${eegRegional?.reduktion ?? "–28 %"} auf den Arbeitspreis des Netznutzungsentgelts. Die Sätze ab 01.01.2027 legt die E-Control neu fest – zum Prüfdatum noch nicht verordnet.` },
];

/** Checkliste „Unterlagen für den Gemeinderat“. */
export const CHECKLISTE = [
  {
    titel: "Projekt & Technik",
    punkte: [
      { id: "liegenschaften", titel: "Liegenschaftsliste mit Prioritäten", text: "Dachflächen, Dachzustand und Restnutzungsdauer, Ausrichtung, Verschattung – je Gebäude." },
      { id: "verbrauch", titel: "Verbrauchsdaten der Zählpunkte", text: "Jahresverbrauch und – wo vorhanden – Lastprofile aus dem Smart-Meter-Portal des Netzbetreibers." },
      { id: "anlage", titel: "Anlagengröße und Ertragsprognose", text: "kWp, erwarteter Ertrag, Eigenverbrauchsanteil, optional Speicher und Notstrom." },
      { id: "netz", titel: "Auskunft zum Netzanschluss", text: "Anschlussmöglichkeit und Netzebene beim Netzbetreiber abgeklärt." },
    ],
  },
  {
    titel: "Recht & Vergabe",
    punkte: [
      { id: "einordnung", titel: "Einordnung Bau- oder Lieferauftrag", text: "Begründung nach dem Hauptgegenstand der Leistung – im Vergabevermerk festgehalten." },
      { id: "auftragswert", titel: "Geschätzter Auftragswert", text: "Gesamtwert ohne Umsatzsteuer inkl. Optionen, sachkundig ermittelt, mit Datum (§ 13 BVergG)." },
      { id: "verfahren", titel: "Gewähltes Vergabeverfahren", text: "Mit Begründung; über 50.000 € die eingeholten Angebote oder Preisauskünfte (§ 46 Abs. 4)." },
      { id: "genehmigung", titel: "Genehmigungen und Anzeigen", text: "Baurechtliche Anzeige oder Bewilligung nach Landesrecht, ggf. Ortsbild- oder Denkmalschutz." },
      { id: "zustaendigkeit", titel: "Zuständiges Organ", text: "Wer beschließt nach der Gemeindeordnung – mit den Wertgrenzen Ihres Bundeslandes." },
    ],
  },
  {
    titel: "Finanzen & Förderung",
    punkte: [
      { id: "kosten", titel: "Kostenschätzung netto und brutto", text: "Die umsatzsteuerliche Behandlung klären Sie mit Ihrer Steuerberatung." },
      { id: "bedeckung", titel: "Bedeckung im Haushalt", text: "Voranschlag bzw. Nachtragsvoranschlag und mittelfristige Finanzplanung." },
      { id: "foerderplan", titel: "Förderplan mit Fristen", text: "Welche Förderung, welcher Antragszeitpunkt – z. B. EAG-Antrag vor der Inbetriebnahme." },
      { id: "wirtschaftlichkeit", titel: "Wirtschaftlichkeit in Szenarien", text: "Annahmen zu Strompreis, Einspeisetarif und Eigenverbrauch offen ausgewiesen." },
    ],
  },
  {
    titel: "Betrieb & Beteiligung",
    punkte: [
      { id: "eeg", titel: "Energiegemeinschaft ja oder nein", text: "Rolle der Gemeinde, Tarifmodell, 10-%-Regel für schutzbedürftige Haushalte ab 01.10.2026." },
      { id: "betrieb", titel: "Betrieb und Wartung", text: "Monitoring, Wartung, Versicherung mit dem Versicherer der Gemeinde abgestimmt." },
      { id: "antrag", titel: "Beschlussantrag formuliert", text: "Betrag, Verfahren, Bedeckung und Ermächtigung des Bürgermeisters klar benannt." },
    ],
  },
];

/** FAQ – Antworten als Text (auch für das FAQPage-Schema). */
export const FAQ = [
  {
    q: "Bis zu welchem Betrag darf eine Gemeinde eine PV-Anlage direkt vergeben?",
    a: `Seit dem Vergaberechtsgesetz 2026 (in Kraft seit 01.03.2026) ist eine Direktvergabe bei Bauaufträgen zulässig, wenn der geschätzte Auftragswert ${euro(K.bau.direkt)} nicht erreicht, bei Liefer- und Dienstleistungsaufträgen unter ${euro(K.lieferDl.direkt)} (§ 46 Abs. 2 BVergG). Alle Werte netto. Stadtwerke als Sektorenauftraggeber haben teils höhere Grenzen.`,
  },
  {
    q: "Ist eine PV-Anlage ein Bau- oder ein Lieferauftrag?",
    a: "Das hängt vom Hauptgegenstand der Leistung ab. Überwiegt die Lieferung von Modulen, Wechselrichtern und Speicher, spricht viel für einen Lieferauftrag; stehen Bauleistungen im Vordergrund, etwa bei Dachsanierung oder Überdachungen, für einen Bauauftrag. Halten Sie die Einordnung mit Begründung im Vergabevermerk fest – davon hängt ab, ob 200.000 € oder 140.000 € als Direktvergabegrenze gelten.",
  },
  {
    q: "Wie viele Angebote braucht eine Direktvergabe?",
    a: "Übersteigt der geschätzte Auftragswert 50.000 €, muss sich die Gemeinde um mindestens drei Angebote oder unverbindliche Preisauskünfte bemühen, sofern keine sachlichen Gründe entgegenstehen (§ 46 Abs. 4 BVergG). Angebote, Gegenstand, Wert, Auftragnehmer und – wenn wirtschaftlich vertretbar – die Prüfung der Preisangemessenheit sind zu dokumentieren.",
  },
  {
    q: "Darf ein Auftrag geteilt werden, um unter einer Grenze zu bleiben?",
    a: "Nein. Maßgeblich ist der Gesamtwert aller zum Vorhaben gehörigen Leistungen ohne Umsatzsteuer, einschließlich Optionen (§ 13 Abs. 1 BVergG). Die Berechnungsmethode darf nicht den Zweck verfolgen, das Vergaberecht zu umgehen (§ 13 Abs. 5 BVergG).",
  },
  {
    q: "Wer beschließt in der Gemeinde über den Auftrag?",
    a: "Das regelt die Gemeindeordnung des jeweiligen Bundeslandes: Je nach Wertgrenzen sind Gemeinderat, Gemeindevorstand bzw. Stadtrat oder die Bürgermeisterin bzw. der Bürgermeister zuständig. Voraussetzung ist in der Regel, dass die Mittel im Voranschlag vorgesehen sind. Klären Sie Zuständigkeit und Bedeckung mit der Amtsleitung und gegebenenfalls der Gemeindeaufsicht.",
  },
  {
    q: "Kann die Gemeinde den EAG-Investitionszuschuss bekommen?",
    a: "Ja, der Investitionszuschuss für PV bis 1.000 kWp und Speicher steht auch Gemeinden offen. Voraussetzung ist unter anderem, dass die Gemeinde die für sie geltenden vergaberechtlichen Bestimmungen beachtet (§ 4 Abs. 1 Z 5 EAG-IZV) und den Antrag vor der Inbetriebnahme einbringt. Der nächste Call läuft von 08. bis 22.10.2026; in Kategorie C und D entscheidet das Gebot in €/kWp über die Reihung.",
  },
  {
    q: "Dürfen KIG-Mittel für Photovoltaik verwendet werden?",
    a: "Das Kommunalinvestitionsgesetz 2025 stellt insgesamt 620 Mio. € als Finanzzuweisung bereit, seit dem Budgetbegleitgesetz 2025 ohne Antrag und ohne Eigenanteil. Die Bürgermeisterin bzw. der Bürgermeister berichtet dem Gemeinderat bis 31.12.2027 und 31.12.2029 über die Verwendung – ausdrücklich mit besonderer Berücksichtigung von Investitionen in die Energiewende. Ob ein konkretes Projekt passt, prüfen Sie mit Ihrer Finanzverwaltung.",
  },
  {
    q: "Was ändert sich am 1. Oktober 2026 für Energiegemeinschaften der Gemeinde?",
    a: "Ab 01.10.2026 gilt das neue Regime des Elektrizitätswirtschaftsgesetzes. Betreibt eine Gemeinde eine Erzeugungsanlage in der gemeinsamen Energienutzung, muss sie schutzbedürftigen Haushalten Zugang zu mindestens 10 % der dafür jährlich erzeugten und eingespeisten Strommenge ermöglichen (§ 68 Abs. 6 ElWG) – auch in bestehenden Gemeinschaften.",
  },
  {
    q: "Übernimmt Ökovolt die Ausschreibung oder die Rechtsberatung?",
    a: "Nein, wir erbringen keine Rechtsberatung. Wir liefern technische Grundlagen: Dachbewertung, Ertragsprognose, Kostenrahmen, technische Mindestanforderungen sowie Unterlagen für Förderantrag und Netzanmeldung. An Vergabeverfahren nehmen wir nach den jeweiligen Vorgaben teil. Wirkt ein Unternehmen an der Vorbereitung mit, muss der Auftraggeber einen fairen Wettbewerb sicherstellen (§ 25 BVergG, Vorarbeiten).",
  },
];

export const QUELLEN = [
  { label: "Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 – Übersicht der Bundeskammer der ZiviltechnikerInnen (Stand 01.03.2026)", url: "https://bund.zt.at/fileadmin/user_upload/redakteure/Amtliche_Nachrichten/2026/260101_Schwellenwerte_und_Vergabeverfahren_ab_01012026_1.pdf" },
  { label: "WKO – Vergaberecht 2026 im Überblick (inkl. Sektorenauftraggeber)", url: "https://www.wko.at/wirtschaftsrecht/highlights-vergaberechtsgesetz-2026" },
  { label: "WKO – EU-Schwellenwerte ab 01.01.2026 (gültig bis 31.12.2027)", url: "https://www.wko.at/wirtschaftsrecht/schwellenwerte-eu-weite-ausschreibungen" },
  { label: "§ 46 BVergG 2018 – Direktvergabe (idF ab 01.03.2026)", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/46" },
  { label: "§ 47 BVergG 2018 – Direktvergabe mit vorheriger Bekanntmachung", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/47" },
  { label: "§ 43 BVergG 2018 – Nicht offenes Verfahren ohne Bekanntmachung", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/43" },
  { label: "§ 44 BVergG 2018 – Verhandlungsverfahren im Unterschwellenbereich", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/44" },
  { label: "§ 13 BVergG 2018 – Geschätzter Auftragswert", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/13" },
  { label: "§ 25 BVergG 2018 – Vorarbeiten", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/25" },
  { label: "RIS – Bundesvergabegesetz 2018, geltende Fassung", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010295" },
  { label: "Fellner Wratzfeld & Partner – Kundmachung Vergaberechtsgesetz 2026 (eForms ab 01.10.2026)", url: "https://www.fwp.at/news/blog/kundmachung-vergaberechtsgesetz-2026" },
  { label: "Kommunalinvestitionsgesetz 2025 idF BGBl. I Nr. 25/2025 (JUSLINE)", url: "https://www.jusline.at/gesetz/kig_2025/gesamt" },
  { label: "KOMMUNAL – KIG-Mittel künftig ohne Antrag und ohne Eigenanteil", url: "https://kommunal.at/kig-mittel-kuenftig-ohne-antrag-und-ohne-eigenanteil" },
  { label: "EAG-IZV § 4 – Fördervoraussetzungen (JUSLINE)", url: "https://www.jusline.at/gesetz/eag-izv/paragraf/4" },
  ...EAG_IZ.quellen.slice(0, 3),
  { label: "Klima- und Energiefonds – Energiemanagement: Flexibilisierung im Verteilnetz", url: "https://www.klimafonds.gv.at/foerderung/energiemanagement-betriebe-2026/" },
  { label: "Klima- und Energiefonds – Förderungen (KEM)", url: "https://www.klimafonds.gv.at/foerderungen/" },
  { label: "KPC – Umweltförderung für Gemeinden", url: "https://www.umweltfoerderung.at/gemeinden" },
  { label: "KPC – Muster- und Leuchtturmprojekte Photovoltaik", url: "https://www.umweltfoerderung.at/gemeinden/muster-und-leuchtturmprojekte-photovoltaik" },
  { label: "Koordinationsstelle für Energiegemeinschaften – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/" },
  ...ENERGIEGEMEINSCHAFTEN.quellen.slice(1, 2),
];
