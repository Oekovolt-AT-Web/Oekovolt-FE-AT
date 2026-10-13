// src/data/smartmeter.js
//
// Smart-Meter-Hub: „Viertelstundenwerte exportieren und auswerten“ je Netzbetreiber –
// Daten für /smart-meter und /smart-meter/[betreiber]. Reine Daten ohne Imports
// (auch mit node in scripts/smartmeter.test.mjs lesbar).
//
// Recherche am 11.10.2026 ausschließlich an Primärquellen: Websites, Portale, Anleitungen
// und Bedienungsanleitungen der Netzbetreiber, ElWG (BGBl. I Nr. 91/2025, RIS-Ausdruck),
// E-Control. Alle Texte sind eigene Formulierungen; jede Aussage ist über `quellen` belegt.
// Was ein Netzbetreiber nicht öffentlich dokumentiert (z. B. das Dateiformat seines Exports),
// steht NICHT als Tatsache hier, sondern in `offen` als „zu prüfen“.
//
// Neutralität: gleiche Struktur für alle Betreiber, keine Logos, nie „offizielles Portal“,
// keine Wertung der Portale. Ökovolt ist kein Netzbetreiber (HINWEIS_KEIN_NETZBETREIBER).
//
// Slugs entsprechen src/data/netzbetreiber.js (Paket C06): die fünf bestehenden sind
// übernommen; für die fünf neuen Betreiber gelten die hier festgelegten Slugs, bis C06 sie
// nachzieht (siehe docs/projekt-doku/anhang/wellen/C07.md, Übergabe).
//
// PFLEGE: Prüfzyklus 35 Tage (PRUEF_ZYKLUS_TAGE). Nach jeder Prüfung `geprueftAm` je Betreiber
// und STAND setzen – sonst zeigt die Seite einen Hinweis „Angaben älter als 35 Tage“.

export const PFAD = "/smart-meter";
export const LASTGANG_PFAD = "/lastgang-analyse";
export const betreiberPfad = (slug) => `${PFAD}/${slug}`;
/** Ziel des Upload-Felds: Lastgang-Analyse mit Quellen-Kennung (die Datei bleibt im Browser). */
export const lastgangUrl = (slug) => `${LASTGANG_PFAD}?quelle=${encodeURIComponent(slug || "unbekannt")}`;

export const STAND = { iso: "2026-10-11", label: "11.10.2026" };
export const PRUEF_ZYKLUS_TAGE = 35;

export const HINWEIS_KEIN_NETZBETREIBER =
  "Ökovolt ist kein Netzbetreiber und mit keinem der genannten Unternehmen verbunden. Wir beschreiben nur, wie Sie Ihre eigenen Messwerte aus dem Portal Ihres Netzbetreibers bekommen – maßgeblich sind dessen Anleitungen und Bedingungen.";
export const HINWEIS_GEWAEHR = "Angaben ohne Gewähr, geprüft an den öffentlichen Seiten und Anleitungen des Netzbetreibers. Portale ändern sich – Menünamen können abweichen.";
export const HINWEIS_DATENSCHUTZ =
  "Ihre Lastgang-Datei wird ausschließlich in Ihrem Browser gelesen. Es gibt keinen Upload an einen Server, keine Speicherung und keine Weitergabe – auch nicht an uns.";

// ---------------------------------------------------------------------------
// Allgemeine Quellen
// ---------------------------------------------------------------------------

export const Q = {
  elwgRis: { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025, § 54 (Auslesung intelligenter Messgeräte)", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", abgerufen: "11.10.2026" },
  elwgKonsolidiert: {
    titel: "ElWG, Bundesrecht konsolidiert, Fassung vom 07.01.2026 (RIS-Ausdruck, bereitgestellt von Energienetze Steiermark)",
    url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=ElWG_Fassung+vom+07012026.pdf",
    abgerufen: "11.10.2026",
  },
  smartMeterBericht: {
    titel: "E-Control – Bericht zur Einführung intelligenter Messgeräte 2025 (Berichtsjahr 2024), Anhang: Zählpunkte je Verteilernetzbetreiber",
    url: "https://www.e-control.at/documents/1785851/1811582/20251020-Monitoringbericht-SM-2025.pdf/4ce4b22f-8149-5162-770a-83f132511199?t=1763621630772",
    abgerufen: "11.10.2026",
  },
  econtrolSuche: { titel: "E-Control – Strom- und Gasnetzbetreiber finden", url: "https://www.e-control.at/konsumenten/strom-und-gasnetzbetreiber-finden", abgerufen: "11.10.2026" },
};

// ---------------------------------------------------------------------------
// Rechtsrahmen (nur am Gesetzestext belegt)
// ---------------------------------------------------------------------------

/** § 54 ElWG – was für alle Netzbetreiber gilt. */
export const RECHT = {
  kurz: "Seit dem ElWG ist die tägliche Auslesung der Viertelstundenenergiewerte – getrennt nach Einspeisung und Entnahme – der gesetzliche Normalfall. Haushaltskunden können unter Bedingungen widersprechen; wer eine PV-Anlage, einen Speicher, eine Wärmepumpe oder einen Ladepunkt hat oder an einer Energiegemeinschaft teilnimmt, kann das nicht.",
  punkte: [
    { titel: "Viertelstundenwerte als Standard", norm: "§ 54 Abs. 1 ElWG", text: "Der Netzbetreiber liest die Viertelstundenenergiewerte täglich aus – getrennt nach Einspeisung und Entnahme. Ältere Begriffe wie „Opt-in“ beschreiben denselben Zustand: Viertelstundenwerte werden übertragen und im Portal angezeigt." },
    { titel: "Widerspruch (Opt-out) nur für Haushalte ohne Anlagen", norm: "§ 54 Abs. 2 ElWG", text: "Haushaltskunden können der Speicherung und Übertragung von Tages- und Viertelstundenwerten widersprechen – nicht aber bei dynamischem Liefervertrag, Direktleitung, Prepayment, Wärmepumpe, Ladepunkt, Energiespeicher oder Stromerzeugungsanlage am Zählpunkt (Kleinsterzeugungsanlagen nach § 77 ausgenommen) und nicht bei Teilnahme an der gemeinsamen Energienutzung." },
    { titel: "Was bei Widerspruch gemessen wird", norm: "§ 54 Abs. 2 ElWG", text: "Monatswerte und der höchste monatliche Viertelstundenleistungswert werden weiterhin gemessen, für die Abrechnung ausgelesen und übermittelt; sie bleiben 15 Monate am Gerät gespeichert." },
    { titel: "Übergang mit Tageswerten", norm: "§ 54 Abs. 3 ElWG", text: "Ohne Anlagen am Zählpunkt dürfen Netzbetreiber übergangsweise nur Tageswerte übermitteln: bis 31.12.2026 bei bis zu 5.000 kWh Jahresverbrauch, ab 1.1.2027 bei bis zu 1.500 kWh. Die höchsten monatlichen Viertelstundenleistungswerte sind jedenfalls auszulesen. Die Fristen verlängern sich um sechs Monate, wenn die Voraussetzungen fehlen; First-Mover-Netzbetreiber können längere Fristen beantragen (Abs. 4)." },
  ],
  quellen: [Q.elwgRis, Q.elwgKonsolidiert],
};

/** Warum Viertelstundenwerte für die Planung zählen. */
export const WARUM = [
  { titel: "Lastspitzen sichtbar", text: "Der Leistungspreis bemisst sich am höchsten Viertelstundenmittel – Tageswerte verstecken genau diese Spitze." },
  { titel: "PV-Größe nach echtem Verbrauch", text: "Mit 35.000 Viertelstunden eines Jahres lässt sich simulieren, wie viel Solarstrom tatsächlich selbst verbraucht würde – statt mit Pauschalprofilen." },
  { titel: "Pflicht für neue Modelle", text: "Energiegemeinschaften, Peer-to-Peer-Verträge und dynamische Tarife setzen die Viertelstundenauslesung voraus." },
];

/** Generischer Ablauf (gilt sinngemäß bei allen Betreibern; Details je Betreiber). */
export const ALLGEMEINE_SCHRITTE = [
  { name: "Netzbetreiber feststellen", text: "Er steht auf der Netz- oder Stromrechnung und steckt in den Stellen 3–8 der 33-stelligen Zählpunktbezeichnung. Im Zweifel hilft die Netzbetreiber-Suche der E-Control." },
  { name: "Im Kundenportal registrieren", text: "Jeder Netzbetreiber hat ein eigenes Webportal. Zur Registrierung brauchen Sie je nach Betreiber Kundennummer, Vertragskonto- oder Zählpunktnummer, teils einen per Post oder E-Mail zugestellten Schlüssel." },
  { name: "Viertelstundenwerte aktivieren", text: "Wenn Ihr Zähler noch Tageswerte überträgt: im Portal der Viertelstundenauslesung zustimmen (bei manchen Betreibern „Opt-in“, „IME“, „Smart Meter Plus“ oder „Prime Meter“ genannt). Die Werte erscheinen meist ab dem Folgetag." },
  { name: "Zeitraum exportieren", text: "Mindestens sieben Tage, besser zwölf volle Monate als Datei (meist CSV) herunterladen – Bezug und, falls vorhanden, Einspeisung." },
  { name: "Datei im Browser auswerten", text: "Die Datei unten auswählen: Sie wird ausschließlich auf Ihrem Gerät gelesen und in der Lastgang-Analyse ausgewertet – Jahresverbrauch, Lastprofil, Spitzen, PV-Größe, Speicher." },
];

// ---------------------------------------------------------------------------
// Die Netzbetreiber (Reihenfolge nach Zählpunkten laut E-Control, Ende 2024)
// ---------------------------------------------------------------------------

export const SMART_METER_BETREIBER = [
  // ------------------------------------------------------------------ Wien
  {
    slug: "wiener-netze",
    name: "Wiener Netze GmbH",
    kurz: "Wiener Netze",
    bundesland: "Wien",
    gebiet: "Wien sowie angrenzende Teile Niederösterreichs und des Burgenlands",
    zaehlpunkte: 1646935,
    portal: {
      name: "Smart Meter-Webportal",
      url: "https://smartmeter-web.wienernetze.at",
      hinweis: "Das Smart Meter-Webportal ist für Privatkunden gedacht; Gemeinden, Hausverwaltungen und Geschäftskunden nutzen das Smart Meter-Businessportal (bis 800 Zählpunkte statt 20, Gruppen, Zählpunkte teilen).",
      weitere: [{ name: "Smart Meter-Businessportal", url: "https://smartmeter-business.wienernetze.at/" }],
    },
    login: {
      text: "Beide Portale laufen über ein logwien-Konto (E-Mail-Adresse und Passwort). In der Registrierungsmaske fordern Sie einen Zugangsschlüssel an – er kommt per E-Mail an die logwien-Adresse.",
      angaben: ["logwien-Konto", "Zählertyp", "Kundennummer (Energie- oder Netzrechnung)", "die letzten zwölf Stellen der Zählpunktnummer", "Zugangsschlüssel aus der E-Mail"],
      url: "https://www.wienernetze.at/smart-meter-webportal",
    },
    viertelstundenAktivieren: {
      standard: "Ohne Aktivierung überträgt der Zähler Tageswerte. Wiener Netze stellt schrittweise automatisch auf Viertelstundenwerte um: zuerst Kunden über 5.000 kWh Jahresverbrauch oder mit Wärmepumpe, Ladepunkt bzw. Erzeugungsanlage, ab 1.1.2027 Kunden mit 1.500 bis 5.000 kWh.",
      text: "Im Webportal der Messung und Übertragung des Viertelstunden-Intervalls zustimmen (Zähler-Funktion unter „Anlagendaten“). Alternativ schriftlich mit dem Opt-in-Formular des Kundenservice.",
      schritte: ["Im Smart Meter-Webportal oder -Businessportal anmelden", "Unter „Anlagendaten“ beim Zähler das Viertelstunden-Intervall aktivieren und bestätigen", "Werte erscheinen ab dem Folgetag, bis zu drei Jahre rückwirkend abrufbar"],
    },
    exportWeg: {
      text: "Menüpunkt „Datenexport“: Tages- oder Viertelstundenwerte von Verbrauch, Einspeisung und Zählerständen für den gewählten Zählpunkt und Zeitraum exportieren.",
      schritte: ["Zählpunkt auswählen", "„Datenexport“ öffnen, Zeitraum und Viertelstundenwerte wählen", "Datei speichern"],
      zeitraum: "Verbrauchsdaten bis zu 36 Monate abrufbar; bei Opt-out ist kein Export möglich.",
    },
    dateiformat: { format: "CSV", text: "CSV laut Hilfeseite zum Webportal; Spaltenaufbau nicht öffentlich dokumentiert.", belegt: true },
    optOut: {
      text: "Opt-out (nur Basisfunktionen) ist nur für Haushalte ohne dynamischen Tarif, ohne Energiegemeinschaft bzw. GEA und ohne PV-Anlage, Speicher, Wärmepumpe oder Ladepunkt möglich (§ 54 Abs. 2 ElWG).",
      weg: "Schriftlich mit Zählpunktnummer: Brief an Wiener Netze GmbH, Postfach 550, 1006 Wien, E-Mail an info@wienernetze.at oder persönlich im Service Treff.",
      folgen: "Gemessen wird nur der Verbrauch für die Jahresabrechnung (auch bei Lieferanten-, Tarifwechsel und Umzug); Speicherung der Zählerstände, Abschalte- und Leistungsbegrenzungsfunktion sind deaktiviert. Kein Datenexport.",
    },
    datenVerfuegbar: "Am Folgetag im Webportal; Viertelstundenwerte bis zu drei Jahre rückwirkend.",
    kontakt: [{ label: "Kundenservice", wert: "+43 50128-10100" }, { label: "E-Mail", wert: "info@wienernetze.at" }],
    quellen: [
      { titel: "Wiener Netze – Smart Meter-Webportal (Registrierung, Funktionen, Datenexport)", url: "https://www.wienernetze.at/smart-meter-webportal", abgerufen: "11.10.2026" },
      { titel: "Wiener Netze – Hilfe Smart Meter-Webportal (Datenexport CSV, 36 Monate, Vergleich Businessportal)", url: "https://www.wienernetze.at/hilfe-smart-meter-webportal", abgerufen: "11.10.2026" },
      { titel: "Wiener Netze – Smart Meter Einstellungen (Standard, Opt-in, Opt-out, § 54 ElWG)", url: "https://www.wienernetze.at/smart-meter-einstellung", abgerufen: "11.10.2026" },
      { titel: "Wiener Netze – Smart Meter (Übersicht, Businessportal)", url: "https://www.wienernetze.at/smartmeter", abgerufen: "11.10.2026" },
      { titel: "Wiener Netze – Registrierungsanleitung Webportal/Businessportal (PDF EX022, 3/2025)", url: "https://www.wienernetze.at/documents/16405179/27116028/EX022_SM_Registrierungsanleitungen_Webportal_Businessportal_v3BF.pdf/2a8b0b1f-ad39-d7e6-65d8-2af0c89dcf53?t=1747056662321", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Spaltenaufbau und Trennzeichen der CSV-Datei nicht veröffentlicht", "Laut Wiener Netze sind die Smart-Meter-Portale vom 22.10.2026, 18 Uhr, bis 27.10.2026 wegen IT-Umstellung nicht erreichbar"],
  },

  // ------------------------------------------------------------------ Niederösterreich
  {
    slug: "netz-niederoesterreich",
    name: "Netz Niederösterreich GmbH",
    kurz: "Netz NÖ",
    bundesland: "Niederösterreich",
    gebiet: "Niederösterreich (Gemeinden am Wiener Stadtrand teils Wiener Netze)",
    zaehlpunkte: 945234,
    portal: {
      name: "Smart Meter Portal",
      url: "https://smartmeter.netz-noe.at/#/",
      hinweis: "Eigener Online-Bereich für die Stromanlage; die Netzanmeldung läuft getrennt davon über das Kunden Portal.",
      weitere: [{ name: "Infoseite Smart Meter Portal", url: "https://netz-noe.at/services/smart-meter-portal" }],
    },
    login: {
      text: "Registrierung direkt im Smart Meter Portal. Welche Angaben dabei abgefragt werden, beschreibt Netz NÖ auf der Infoseite nicht – siehe „Offen“.",
      angaben: ["Zugang zum Smart Meter Portal (Registrierung im Portal)"],
      url: "https://smartmeter.netz-noe.at/#/",
    },
    viertelstundenAktivieren: {
      standard: "Laut Netz NÖ wird der Smart Meter vom Netzbetreiber automatisch auf die Übermittlung von Viertelstunden-Energiewerten (Opt-in) umgestellt; der Zeitpunkt richtet sich nach dem Stufenplan.",
      text: "Wer nicht warten will, stellt im Smart Meter Portal selbst auf Opt-in um (15-min-Profilwerte aktivieren bzw. deaktivieren).",
      schritte: ["Im Smart Meter Portal anmelden", "15-Minuten-Profilwerte aktivieren", "Werte stehen danach täglich im Portal"],
    },
    exportWeg: {
      text: "Über das Smart Meter Portal haben Sie Zugriff auf Ihre Energiewerte. Einen Download-Menüpunkt und das Dateiformat beschreibt Netz NÖ öffentlich nicht – im Portal prüfen.",
      schritte: ["Im Smart Meter Portal anmelden", "Zeitraum mit Viertelstundenwerten wählen", "Export-Funktion des Portals nutzen (Format: zu prüfen)"],
      zeitraum: "Verbrauchsdaten für Abrechnung und Portal werden 36 Monate aufbewahrt; im Zähler selbst 60 Kalendertage.",
    },
    dateiformat: { format: null, text: "Nicht veröffentlicht – zu prüfen.", belegt: false },
    optOut: {
      text: "Haushaltskunden können nach § 54 Abs. 2 ElWG der Speicherung und Übertragung von Tages- und Viertelstundenwerten widersprechen – nicht bei dynamischem Liefervertrag, Direktleitung oder Prepayment, meldepflichtigen Geräten (Wärmepumpe, Ladestation, Batteriespeicher, Erzeugungsanlage) und nicht bei Teilnahme an einer Energiegemeinschaft.",
      weg: "Schriftlich oder per E-Mail an Netz Niederösterreich GmbH, EVN Platz, 2344 Maria Enzersdorf (E-Mail-Adresse auf der Infoseite).",
      folgen: "Viertelstunden- und Tageswerte werden weder gespeichert noch übertragen; Monatswerte und der höchste monatliche Viertelstundenleistungswert bleiben 15 Monate am Gerät.",
    },
    datenVerfuegbar: "Täglich im Smart Meter Portal; Weitergabe an Lieferant oder Energiegemeinschaft nur mit ausdrücklicher Zustimmung (Formulare B858/B859).",
    quellen: [
      { titel: "Netz NÖ – Smart Meter Portal (Opt-in, Widerspruch, Zustimmungserklärungen)", url: "https://netz-noe.at/services/smart-meter-portal", abgerufen: "11.10.2026" },
      { titel: "Netz NÖ – FAQ Smart Meter (automatische Umstellung, Speicherdauer, Widerspruch)", url: "https://netz-noe.at/services/smart-meter-portal/faq-smart-meter", abgerufen: "11.10.2026" },
      { titel: "Netz NÖ – Smart Meter Web-Portal (Login)", url: "https://smartmeter.netz-noe.at/", abgerufen: "11.10.2026" },
      { titel: "Netz NÖ – Was das ElWG für Kundinnen und Kunden bringt", url: "https://netz-noe.at/energiezukunft/elwg-zu-smart-meter", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Registrierungsangaben (Kundennummer, Zählpunkt) nicht auf der Infoseite genannt", "Download-Menüpunkt und Dateiformat des Exports nicht veröffentlicht – zu prüfen"],
  },

  // ------------------------------------------------------------------ Oberösterreich
  {
    slug: "netz-oberoesterreich",
    name: "Netz Oberösterreich GmbH",
    kurz: "Netz OÖ",
    bundesland: "Oberösterreich",
    gebiet: "Oberösterreich außerhalb des Stadtgebiets von Linz (dort LINZ NETZ)",
    zaehlpunkte: 736171,
    portal: {
      name: "eService-Portal",
      url: "https://eservice.netzooe.at/",
      hinweis: "Für Strom- und Erdgas-Netzkunden; Verbrauchsdaten des Smart Meters (System „AMIS“) sind dort einsehbar.",
      weitere: [{ name: "Neu registrieren", url: "https://eservice.netzooe.at/app/registration" }],
    },
    login: {
      text: "Die Registrierung verlangt die 33-stellige Zählpunktnummer (beginnt mit AT; Stromrechnung oder Netzzugangsvertrag) und die neunstellige Zählernummer vom Zähler.",
      angaben: ["Zählpunktnummer (33 Stellen, AT…)", "Zählernummer (9 Stellen, am Zähler)", "E-Mail-Adresse"],
      url: "https://eservice.netzooe.at/app/registration",
    },
    viertelstundenAktivieren: {
      standard: "Netz OÖ erklärt: Elektronische Zähler können im Viertelstunden-Takt auslesen, dem Ausleseverfahren müssen Kunden ausdrücklich zustimmen. Ob und wann die automatische Umstellung nach § 54 ElWG erfolgt, beschreibt Netz OÖ öffentlich nicht.",
      text: "Zustimmung zur Verarbeitung der Viertelstundenwerte – Netz OÖ stellt dafür eine Zustimmungserklärung (PDF) bereit; Widerruf jederzeit per E-Mail an service@netzooe.at oder per Post.",
      schritte: ["Zustimmungserklärung ausfüllen (Kundennummer, Zählpunkt) oder im eService-Portal prüfen, ob die Zustimmung dort möglich ist", "Viertelstundenwerte erscheinen danach im eService-Portal"],
    },
    exportWeg: {
      text: "Verbrauchsdaten stehen im eService-Portal („Verbrauchsdaten im online eService-Portal“). Export-Menüpunkt und Dateiformat sind nicht öffentlich beschrieben – im Portal prüfen.",
      schritte: ["Im eService-Portal anmelden", "Verbrauchsdaten des Zählpunkts öffnen", "Export-Funktion des Portals nutzen (Format: zu prüfen)"],
      zeitraum: "Nicht veröffentlicht.",
    },
    dateiformat: { format: null, text: "Nicht veröffentlicht – zu prüfen.", belegt: false },
    optOut: {
      text: "Laut den Allgemeinen Verteilernetzbedingungen Strom kommt Netz OÖ dem Wunsch, kein intelligentes Messgerät zu erhalten, nach, indem die Aufzeichnung der Viertelstundenwerte deaktiviert wird – am Zählerdisplay ersichtlich. Die gesetzlichen Ausschlüsse des § 54 Abs. 2 ElWG (PV, Speicher, Wärmepumpe, Ladepunkt, Energiegemeinschaft, dynamischer Tarif) gelten auch hier.",
      weg: "Nicht öffentlich beschrieben – Kundenservice: service@netzooe.at.",
      folgen: "Keine Viertelstundenaufzeichnung; Jahres- bzw. Monatswerte für die Abrechnung bleiben.",
    },
    datenVerfuegbar: "Im eService-Portal; Zeitpunkt der Bereitstellung nicht veröffentlicht.",
    quellen: [
      { titel: "Netz OÖ – Verbrauchsdaten im online eService-Portal (Zustimmung zur Viertelstundenauslesung)", url: "https://www.netzooe.at/Themen/Information/Auslesung-Viertelstundenwerte", abgerufen: "11.10.2026" },
      { titel: "Netz OÖ – Zustimmungserklärung zur Verarbeitung von Viertelstundenwerten (PDF)", url: "https://netzooe.at/Zustimmungserklaerung-fuer-Auslesung-der-Viertelstunden-Werte-aus-dem-Smart-Meter.pdf", abgerufen: "11.10.2026" },
      { titel: "Netz OÖ – eService-Portal: Neu registrieren (Zählpunkt- und Zählernummer)", url: "https://eservice.netzooe.at/app/registration", abgerufen: "11.10.2026" },
      { titel: "Netz OÖ – Allgemeine Verteilernetzbedingungen Strom (AVB Strom, PDF; Deaktivierung der Viertelstundenwerte)", url: "https://www.netzooe.at/Allgemeine-Verteilernetzbedingungen-Strom-AVB-Strom-.pdf", abgerufen: "11.10.2026" },
      { titel: "Netz OÖ – Smart Meter, der elektronische Stromzähler", url: "https://www.netzooe.at/themen/information/smart-meter", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: [
      "Export-Menüpunkt und Dateiformat nicht veröffentlicht – zu prüfen",
      "Ob die Zustimmung zur Viertelstundenauslesung direkt im eService-Portal erteilt werden kann, ist nicht belegt (Zustimmungserklärung nennt noch § 84a ElWOG)",
      "Umsetzung der automatischen Umstellung nach § 54 ElWG nicht beschrieben",
    ],
  },

  // ------------------------------------------------------------------ Steiermark
  {
    slug: "energienetze-steiermark",
    name: "Energienetze Steiermark GmbH",
    kurz: "Energienetze Steiermark",
    bundesland: "Steiermark",
    gebiet: "Steiermark (ohne die Netzgebiete einzelner Stadtwerke)",
    zaehlpunkte: 524795,
    portal: {
      name: "Serviceportal",
      url: "https://portal.e-netze.at/",
      hinweis: "Verbrauchswerte je Zählpunkt, Gerätekonfiguration (IME/IMS/DSZ) und Kundenschnittstelle. Volle Verfügbarkeit laut Anleitung drei Wochen bis drei Monate nach Zählertausch.",
    },
    login: {
      text: "Registrierung mit Partnernummer und Anschlussobjektnummer aus dem Smart-Meter-Informationsschreiben plus persönlichem Datenschutz-PIN (wird per Post zugestellt).",
      angaben: ["Partnernummer", "Anschlussobjektnummer", "Datenschutz-PIN (per Post)"],
      url: "https://portal.e-netze.at/",
    },
    viertelstundenAktivieren: {
      standard: "Drei Gerätekonfigurationen: IME (viertelstundengenaue Ablesung), IMS (Standard mit Tageswerten) und DSZ (digitaler Standardzähler, Opt-out). Die Umstellung ist kostenlos und ohne Gerätetausch möglich.",
      text: "Im Serviceportal die Stromanlage wählen, „Anlage anzeigen“ und unter „Gerätekonfiguration“ den Typ „IME: viertelstundengenaue Ablesung“ einstellen – die Umstellung erfolgt innerhalb von höchstens drei Tagen.",
      schritte: ["Im Serviceportal anmelden, Stromanlage auswählen", "„Anlage anzeigen“ → Gerätekonfiguration → „IME: viertelstundengenaue Ablesung“", "Nach spätestens drei Tagen Viertelstunden-, Wochen- und Monatswerte sowie PV-Einspeisung im Portal"],
    },
    exportWeg: {
      text: "Im Serviceportal sind Tagesdaten, bei IME zusätzlich Viertelstundenwerte und Einspeisewerte einer PV-Anlage einsehbar. Einen Export-Menüpunkt und das Dateiformat nennt Energienetze Steiermark öffentlich nicht – im Portal prüfen.",
      schritte: ["Im Serviceportal anmelden", "Verbrauchswerte des Zählpunkts (IME) öffnen", "Export-Funktion des Portals nutzen (Format: zu prüfen)"],
      zeitraum: "Nicht veröffentlicht.",
    },
    dateiformat: { format: null, text: "Nicht veröffentlicht – zu prüfen.", belegt: false },
    optOut: {
      text: "Digitaler Standardzähler (DSZ): nur ein Jahresverbrauchswert im Serviceportal. Nicht möglich bei Einspeiseanlagen (PV), viertelstündlicher Erfassung, Viertelstunden-Maximumzählung, unterbrechbarer Lieferung und Teilnahme an einer Energiegemeinschaft.",
      weg: "Netzbetreiber informieren – Kontaktformular im Serviceportal oder Info-Hotline 0316 90555.",
      folgen: "Nur Jahreswert sichtbar; keine Viertelstunden- und Tageswerte, keine Kundenschnittstelle.",
    },
    datenVerfuegbar: "Im Serviceportal je Zählpunkt; Zeitpunkt der täglichen Bereitstellung nicht genannt.",
    kontakt: [{ label: "Info-Hotline", wert: "0316 90555" }],
    quellen: [
      { titel: "Energienetze Steiermark – Smart Meter (Serviceportal, Registrierung, Gerätekonfiguration, DSZ)", url: "https://www.e-netze.at/strom/smartmeter/Default.aspx", abgerufen: "11.10.2026" },
      { titel: "Energienetze Steiermark – Bedienungsanleitung Smart Meter, Version April 2026 (PDF; Registrierung, IME einstellen)", url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=EN_Bedienungsanleitung_Smart%20Meter_Version_April%202026_bf.pdf", abgerufen: "11.10.2026" },
      { titel: "Energienetze Steiermark – Serviceportal (Login)", url: "https://portal.e-netze.at/", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Export-Menüpunkt und Dateiformat nicht veröffentlicht – zu prüfen", "Umsetzung der automatischen Umstellung nach § 54 ElWG nicht beschrieben"],
  },

  // ------------------------------------------------------------------ Salzburg
  {
    slug: "salzburg-netz",
    name: "Salzburg Netz GmbH",
    kurz: "Salzburg Netz",
    bundesland: "Salzburg",
    gebiet: "Land Salzburg sowie Teile Oberösterreichs und der Steiermark",
    zaehlpunkte: 465566,
    portal: {
      name: "Serviceportal",
      url: "https://www.salzburgnetz.at/portal",
      hinweis: "Verbrauchs- und Einspeisewerte, Smart-Meter-Einstellungen, Kundenschnittstelle und eine Programmierschnittstelle (API).",
      weitere: [{ name: "Anleitungen zum Serviceportal", url: "https://www.salzburgnetz.at/service/serviceportal.html" }],
    },
    login: {
      text: "Registrierung mit E-Mail-Adresse und Prüfcode, danach Name und Kennwort; anschließend die Kundennummer mit Vertragskonto- bzw. Zählpunktnummer (laut Rechnung) verknüpfen.",
      angaben: ["E-Mail-Adresse und Prüfcode", "Vor-/Nachname oder Firma, Kennwort", "Kundennummer und Vertragskonto- bzw. Zählpunktnummer zum Verknüpfen"],
      url: "https://www.salzburgnetz.at/service/serviceportal/registrierung.html",
    },
    viertelstundenAktivieren: {
      standard: "Salzburg Netz nennt drei Konfigurationen: „Prime Meter“ (neuer Standard nach ElWG: tägliche Auslesung der Viertelstundenenergiewerte, getrennt nach Einspeisung und Entnahme), „Smart Meter“ (alter Standard mit Tageswerten, Umstellung nach Stufenplan) und „Blind Meter“ (Opt-out).",
      text: "Im Serviceportal unter Anlagendetails → „Smart Meter Einstellungen“ der Ablesung von Viertelstundenwerten zustimmen (bei aktivem Blind Meter zuerst diesen deaktivieren und speichern, dann Prime Meter aktivieren). Ab der Umstellung gilt der Sommer-Nieder-Arbeitspreis (SNAP).",
      schritte: ["Serviceportal → Dashboard → „Anlagendetails“", "Tab „Anlagen“ → beim Zählpunkt „Anlagendetails“ → „Smart Meter Einstellungen“", "Zustimmung zu Viertelstundenwerten aktivieren (Anleitung PDF, Stand Juli 2026)"],
    },
    exportWeg: {
      text: "Kachel „Datenanalyse & -download“: Verbrauchs- oder Einspeisewerte analysieren und herunterladen; mit Prime Meter sind die 15-Minuten-Werte exportierbar. Lastprofilwerte finden sich unter „Anlagendetails“.",
      schritte: ["Im Serviceportal anmelden", "Anlagendetails → Verbrauchs- bzw. Lastprofilwerte, Zeitraum wählen", "Download als xls oder csv"],
      zeitraum: "Nicht veröffentlicht.",
    },
    dateiformat: { format: "CSV oder XLS", text: "xls oder csv laut Serviceportal-Seite; Spaltenaufbau nicht öffentlich dokumentiert.", belegt: true },
    optOut: {
      text: "„Blind Meter“ nur für Haushaltskunden ohne Ausschlussgrund: nicht bei dynamischem Liefervertrag, Einspeisung über Direktleitung, Prepayment, Wärmepumpe, Ladepunkt, Energiespeicher oder Stromerzeugungsanlage am Zählpunkt.",
      weg: "Widerspruch über das Serviceportal (Anleitung „Smart Meter Einstellungen“).",
      folgen: "Monatswerte und der höchste monatliche Viertelstundenleistungswert werden für die Abrechnung gemessen und bleiben 15 Monate am Gerät; Abschalt- und Leistungsbegrenzungsfunktion werden nicht mehr deaktiviert.",
    },
    datenVerfuegbar: "Tageswerte (Smart Meter) bzw. 15-Minuten-Werte (Prime Meter) im Serviceportal; SNAP seit 1.4.2026: 20 % weniger Netznutzungsentgelt (Arbeitspreis) von 10 bis 16 Uhr, April bis September, Netzebene 7.",
    kontakt: [{ label: "Serviceline", wert: "0800 660 661" }, { label: "E-Mail", wert: "kundenservice@salzburgnetz.at" }],
    quellen: [
      { titel: "Salzburg Netz – Smart Meter (Prime Meter, Blind Meter, Stufenplan, Opt-out)", url: "https://www.salzburgnetz.at/stromnetz/smart-meter.html", abgerufen: "11.10.2026" },
      { titel: "Salzburg Netz – Smart Meter Viertelstundenwerte: Umstellung (Anleitung, Stand Juli 2026)", url: "https://www.salzburgnetz.at/stromnetz/smart-meter/umstellung.html", abgerufen: "11.10.2026" },
      { titel: "Salzburg Netz – Anleitungen für unser Serviceportal (Datenanalyse & -download, xls/csv)", url: "https://www.salzburgnetz.at/service/serviceportal.html", abgerufen: "11.10.2026" },
      { titel: "Salzburg Netz – Smart Meter Einstellungen im Serviceportal", url: "https://www.salzburgnetz.at/service/serviceportal/smart-meter-einstellungen.html", abgerufen: "11.10.2026" },
      { titel: "Salzburg Netz – Registrierung im Serviceportal", url: "https://www.salzburgnetz.at/service/serviceportal/registrierung.html", abgerufen: "11.10.2026" },
      { titel: "Salzburg Netz – Smart Meter Quick Start Guide, März 2026 (PDF; Export der 15-Minuten-Werte)", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/stromnetz/Smart%20Meter%20Quick%20Start%20Guide.pdf", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Spaltenaufbau der Exportdateien nicht veröffentlicht"],
  },

  // ------------------------------------------------------------------ Kärnten
  {
    slug: "kng-kaernten-netz",
    name: "KNG-Kärnten Netz GmbH",
    kurz: "Kärnten Netz",
    bundesland: "Kärnten",
    gebiet: "Kärnten (ohne einzelne Stadtwerke-Netze)",
    zaehlpunkte: 341365,
    portal: {
      name: "Mein Portal",
      url: "https://services.kaerntennetz.at/meinPortal/login.aspx?service=Services",
      hinweis: "Online-Services mit „Meine Messwerte“, „Meine Anlagen“, Freigaben und Postfach; Messwerte lassen sich täglich mitverfolgen.",
      weitere: [{ name: "Registrierung", url: "https://services.kaerntennetz.at/meinPortal/Register.aspx" }],
    },
    login: {
      text: "Registrierung mit Kundennummer oder Zählpunktbezeichnung (letzte Rechnung bzw. personalisierte Schreiben), Nachname oder Firmenname wie auf der Rechnung, E-Mail-Adresse und Passwort.",
      angaben: ["Kundennummer oder Zählpunktbezeichnung", "Nachname bzw. Firmenname laut Rechnung", "E-Mail-Adresse, Passwort"],
      url: "https://services.kaerntennetz.at/meinPortal/Register.aspx",
    },
    viertelstundenAktivieren: {
      standard: "Kärnten Netz stellt Haushalte mit Smart Meter und täglicher Zählerwertübertragung nach § 54 ElWG automatisch auf Viertelstundenwerte um; der Zeitpunkt richtet sich nach dem Jahresverbrauch (Meldung vom 01.04.2026).",
      text: "Die Umstellung kann vorab im Kundenportal selbst aktiviert werden – die Viertelstundenwerte werden dann ohne Mehrkosten einmal täglich ausgelesen.",
      schritte: ["In „Mein Portal“ anmelden", "Unter „Meine Messwerte“ der Auslesung der Viertelstundenwerte zustimmen", "Tageswerte werden am Folgetag ausgelesen, Viertelstundenwerte täglich"],
    },
    exportWeg: {
      text: "„Meine Messwerte“ in Mein Portal; einen Profil-Download der Messreihen als Datei nennt das Portal, Menüpfad und Dateiformat sind öffentlich nicht beschrieben – im Portal prüfen.",
      schritte: ["In „Mein Portal“ anmelden", "„Meine Messwerte“ öffnen, Zählpunkt und Zeitraum wählen", "Profil-Download nutzen (Format: zu prüfen)"],
      zeitraum: "Nicht veröffentlicht.",
    },
    dateiformat: { format: null, text: "Nicht veröffentlicht – zu prüfen.", belegt: false },
    optOut: {
      text: "Haushaltskunden können der Auslesung und Übertragung von Viertelstundenwerten widersprechen, sofern keine gesetzlichen Gründe nach § 54 Abs. 2 ElWG vorliegen – kein Widerspruchsrecht bei dynamischen Energiepreisen, gemeinsamer Energienutzung (z. B. Energiegemeinschaft), Wärmepumpe, PV-Anlage, Energiespeicher oder E-Ladepunkt.",
      weg: "Nicht öffentlich beschrieben – Kontakt über kaerntennetz.at/kontakt.",
      folgen: "Keine Viertelstunden- und Tageswerte; Monatswerte für die Abrechnung bleiben (§ 54 Abs. 2 ElWG).",
    },
    datenVerfuegbar: "Tageswerte am Folgetag in Mein Portal; Sommer-Nieder-Arbeitspreis (1.4.–30.9., 10–16 Uhr, −20 % Netznutzungsentgelt) setzt aktive Viertelstundenmessung voraus.",
    quellen: [
      { titel: "Kärnten Netz – Smart Meter (Mein Portal, tägliche Messwerte)", url: "https://kaerntennetz.at/smartmeter.htm", abgerufen: "11.10.2026" },
      { titel: "Kärnten Netz – Neue gesetzliche Regelungen: Umstellung der Zählerwertübertragung und reduziertes Netznutzungsentgelt (01.04.2026)", url: "https://kaerntennetz.at/m3-k38-news-detail-kng-74095-74095.htm", abgerufen: "11.10.2026" },
      { titel: "Kärnten Netz – Mein Portal: Registrierung (Kundennummer oder Zählpunkt, Name)", url: "https://services.kaerntennetz.at/meinPortal/Register.aspx", abgerufen: "11.10.2026" },
      { titel: "Kärnten Netz – Mein Portal: Services (Meine Messwerte, Freigaben)", url: "https://services.kaerntennetz.at/meinPortal/Services.aspx", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Menüpfad und Dateiformat des Profil-Downloads nicht veröffentlicht – zu prüfen", "Weg für den Widerspruch (Opt-out) nicht beschrieben"],
  },

  // ------------------------------------------------------------------ Linz
  {
    slug: "linz-netz",
    name: "LINZ NETZ GmbH",
    kurz: "LINZ NETZ",
    bundesland: "Oberösterreich",
    gebiet: "Stadt Linz und Umgebung",
    zaehlpunkte: 309356,
    portal: {
      name: "Serviceportal",
      url: "https://www.linznetz.at/portal/de/home/online_services/serviceportal",
      hinweis: "Mit „Zähler Konfiguration“ (wie Werte erfasst, gespeichert und übermittelt werden), „Verbrauchsdateninformation“, Freigabeverwaltung und Kundenschnittstelle.",
      weitere: [{ name: "Verbrauchsdateninformation", url: "https://www.linznetz.at/portal/de/home/online_services/serviceportal/verbrauchsdateninformation_1/verbrauchsdateninformation.html" }],
    },
    login: {
      text: "Registrierung mit Kundennummer und Verrechnungskontonummer; wer sie nicht zur Hand hat, nutzt die Kundendatenanforderung oder das Service-Team.",
      angaben: ["Kundennummer", "Verrechnungskontonummer"],
      url: "https://www.linznetz.at/portal/start.app?id=5&nav=/de/linz_netz_website/online_services/serviceportal/registrierung/registrierung.xhtml",
    },
    viertelstundenAktivieren: {
      standard: "LINZ NETZ beschreibt drei Konfigurationen: „IMS Standard“ (Viertelstunden- und Tageswerte im Zähler, nur Tageswerte werden übermittelt), „IME erweitert“ (Viertelstundenwerte einmal täglich übermittelt, Pflicht für Energiegemeinschaften) und „Opt-Out“.",
      text: "Im Serviceportal unter „Zähler Konfiguration“ festlegen, wie Verbrauchswerte erfasst, gespeichert und übermittelt werden; Viertelstundenwerte erscheinen in der Verbrauchsdateninformation nur mit Zustimmung zur Auslesung.",
      schritte: ["Im Serviceportal anmelden", "„Zähler Konfiguration“ → Viertelstundenauslesung (IME) wählen", "Werte am Folgetag ab 12:00 Uhr in der Verbrauchsdateninformation"],
    },
    exportWeg: {
      text: "Die Verbrauchsdateninformation zeigt Vortageswerte fernauslesbarer Zähler – bis zu drei Jahre zurück, für Smart Meter Tages- bzw. mit Zustimmung Viertelstundenwerte. Einen Export-Menüpunkt und das Dateiformat dokumentiert LINZ NETZ öffentlich nicht – im Portal prüfen.",
      schritte: ["Im Serviceportal anmelden", "„Meine Verbräuche“ → Verbrauchsdateninformation, Zeitraum wählen", "Export-Funktion des Portals nutzen (Format: zu prüfen)"],
      zeitraum: "Tageswerte bis zu drei Jahre im Portal.",
    },
    dateiformat: { format: null, text: "Nicht veröffentlicht – zu prüfen.", belegt: false },
    optOut: {
      text: "Opt-Out wird auf Wunsch eingestellt; der Netzbetreiber darf die Konfiguration nicht ohne Einverständnis ändern. Es werden keine Tages- und Viertelstundenwerte gespeichert oder übertragen, Monatswerte schon; die Kundenschnittstelle ist dann nicht nutzbar. Die Ausschlüsse des § 54 Abs. 2 ElWG gelten.",
      weg: "Nicht öffentlich beschrieben – Service-Team 0732 3403-9050, office@linznetz.at.",
      folgen: "Keine Verbrauchsdaten im Serviceportal, keine Kundenschnittstelle.",
    },
    datenVerfuegbar: "Am Folgetag ab 12:00 Uhr; bei Übertragungsausfall vorübergehend gekennzeichnete Ersatzwerte.",
    kontakt: [{ label: "Service-Team", wert: "0732 3403-9050" }, { label: "E-Mail", wert: "office@linznetz.at" }],
    quellen: [
      { titel: "LINZ NETZ – Smart Metering (Konfigurationen IMS, IME, Opt-Out; Serviceportal; Registrierung)", url: "https://www.linznetz.at/portal/de/home/wissenswertes/smart_meter", abgerufen: "11.10.2026" },
      { titel: "LINZ NETZ – Serviceportal (Zähler Konfiguration, Verbrauchsdateninformation, Freigabeverwaltung)", url: "https://www.linznetz.at/portal/de/home/online_services/serviceportal", abgerufen: "11.10.2026" },
      { titel: "LINZ NETZ – Verbrauchsdateninformation (Vortageswerte, drei Jahre, Viertelstundenwerte nur mit Zustimmung)", url: "https://www.linznetz.at/portal/de/home/online_services/serviceportal/verbrauchsdateninformation_1/verbrauchsdateninformation.html", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Export-Menüpunkt und Dateiformat nicht veröffentlicht – zu prüfen", "Weg für Opt-Out nicht beschrieben", "Umsetzung der automatischen Umstellung nach § 54 ElWG nicht beschrieben"],
  },

  // ------------------------------------------------------------------ Tirol
  {
    slug: "tinetz",
    name: "TINETZ-Tiroler Netze GmbH",
    kurz: "TINETZ",
    bundesland: "Tirol",
    gebiet: "Tirol (ohne einzelne Stadtwerke-Netze, z. B. Innsbruck)",
    zaehlpunkte: 264135,
    portal: {
      name: "Kundenportal",
      url: "https://kundenportal.tinetz.at/",
      hinweis: "Verbrauchsdaten 36 Monate sichtbar; Konfiguration des Zählers einsehbar und änderbar; Kundenschnittstelle und Datenfreigabe für Energiegemeinschaften.",
    },
    login: {
      text: "Registrierung mit Kunden- und Vertragskontonummer; für die erste Anmeldung kommt ein Einmalpasswort per E-Mail.",
      angaben: ["Kundennummer", "Vertragskontonummer", "E-Mail-Adresse (Einmalpasswort)"],
      url: "https://kundenportal.tinetz.at/",
    },
    viertelstundenAktivieren: {
      standard: "Standardkonfiguration „IME“: der Smart Meter überträgt einmal täglich Tageswerte und 15-Minuten-Verbrauchswerte, ab dem Folgetag im Kundenportal sichtbar. Alternative: digitaler Standardzähler „DSZ“ (Opt-out).",
      text: "Die Anzeige historischer 15-Minuten-Werte ist im Standard deaktiviert und wird im Kundenportal im Reiter „Zähler“ unter „Wahlmöglichkeiten für intelligente Messgeräte“ aktiviert (Anleitung TINETZ, 05/2025).",
      schritte: ["Im Kundenportal anmelden", "Reiter „Zähler“ → „Wahlmöglichkeiten für intelligente Messgeräte“ → 15-Minuten-Werte ankreuzen", "Werte spätestens zwölf Stunden nach Übertragung vom Zähler verfügbar"],
    },
    exportWeg: {
      text: "Verbrauchsdaten stehen 36 Monate im Kundenportal. Einen Download-Menüpunkt und das Dateiformat beschreibt TINETZ öffentlich nicht – im Portal prüfen.",
      schritte: ["Im Kundenportal anmelden", "Verbrauchsdaten des Zählpunkts, Zeitraum wählen", "Export-Funktion des Portals nutzen (Format: zu prüfen)"],
      zeitraum: "36 Monate im Kundenportal; 60 Tage im Zähler.",
    },
    dateiformat: { format: null, text: "Nicht veröffentlicht – zu prüfen.", belegt: false },
    optOut: {
      text: "Haushaltskunden können der Auslesung der 15-Minuten-Werte unter bestimmten Voraussetzungen widersprechen (digitaler Standardzähler). Dann werden keine Tages- und Viertelstundenwerte gespeichert oder übertragen; Monatswerte und der höchste monatliche Viertelstundenleistungswert bleiben 15 Monate am Gerät. Kundenschnittstelle und tageszeitabhängige Tarife entfallen.",
      weg: "Nicht öffentlich beschrieben – Kundencenter +43 50708-190, sc@tinetz.at.",
      folgen: "Wahlrecht zwischen monatlicher und jährlicher Abrechnung; Verbrauchsinformation mit der Rechnung.",
    },
    datenVerfuegbar: "Spätestens zwölf Stunden nach Übertragung vom Zähler; einmal monatlich gehen die Daten an den Lieferanten für die Abrechnung.",
    kontakt: [{ label: "Kundencenter", wert: "+43 50708-190" }, { label: "E-Mail", wert: "sc@tinetz.at" }],
    quellen: [
      { titel: "TINETZ – Einstellungen am Smart Meter (IME, DSZ, Kundenportal)", url: "https://www.tinetz.at/infobereich/stromzaehler/einstellungen-am-smart-meter/", abgerufen: "11.10.2026" },
      { titel: "TINETZ – Smart Meter Anleitung & FAQ (Verfügbarkeit, 36 Monate, Opt-out, Datenweitergabe)", url: "https://www.tinetz.at/infobereich/stromzaehler/smart-meter-anleitung-faq/", abgerufen: "11.10.2026" },
      { titel: "TINETZ – Aktivierung der 15-Minuten-Verbrauchswerte des Smart Meters (PDF, Registrierung mit Kunden- und Vertragskontonummer)", url: "https://www.tinetz.at/uploads/tx_bh/600/tinetz_anleitung_15-minuten-verbrauchswerte_sm.pdf?mod=1746431522", abgerufen: "11.10.2026" },
      { titel: "TINETZ – Kundenportal", url: "https://kundenportal.tinetz.at/", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Download-Menüpunkt und Dateiformat nicht veröffentlicht – zu prüfen", "Weg für den Widerspruch (DSZ) nicht beschrieben"],
  },

  // ------------------------------------------------------------------ Burgenland
  {
    slug: "netz-burgenland",
    name: "Netz Burgenland GmbH",
    kurz: "Netz Burgenland",
    bundesland: "Burgenland",
    gebiet: "Burgenland",
    zaehlpunkte: 239590,
    portal: {
      name: "Smart Meter Verbrauchsdatenportal",
      url: "https://smartmeter.netzburgenland.at/",
      hinweis: "Dieselben Zugangsdaten wie im Netz Kundenportal; dort wird auch die Umstellung auf „Smart Plus“ beantragt.",
      weitere: [{ name: "Netz Kundenportal", url: "https://kundencenter.netzburgenland.at/" }],
    },
    login: {
      text: "Anmeldung mit E-Mail-Adresse und dem Passwort des Netz Kundenportals; ohne Zugang zuerst registrieren.",
      angaben: ["E-Mail-Adresse", "Passwort des Netz Kundenportals (Registrierung unter portal.netzburgenland.at/auth)"],
      url: "https://portal.netzburgenland.at/auth/",
    },
    viertelstundenAktivieren: {
      standard: "Standardmäßig werden Viertelstundenwerte nicht angezeigt. Mit „Smart Plus“ (Opt-in) liest Netz Burgenland die 15-Minuten-Werte einmal täglich aus und stellt sie im Portal bereit – ohne Mehrkosten.",
      text: "Die Umstellung auf Smart Plus im Netz Kundenportal beantragen („mit wenigen Klicks“) oder beim Kundentelefon 0800 8889001. Danach erscheint im Verbrauchsdatenportal die „Smart Plus Ansicht“ mit Viertelstundenwerten je Tag.",
      schritte: ["Im Netz Kundenportal Umstellung auf Smart Plus beantragen", "Im Verbrauchsdatenportal Zeitspanne „Tag“ wählen – Smart Plus Ansicht zeigt die 15-Minuten-Werte"],
    },
    exportWeg: {
      text: "Export-Schaltfläche im Verbrauchsdatenportal: Zeitraum und Intervall wählen – Smart-Plus-Kunden können auch die 15-Minuten-Werte exportieren.",
      schritte: ["Im Verbrauchsdatenportal anmelden", "Diagramm oder Liste → Export → Zeitraum und Intervall (15 Minuten)", "CSV speichern"],
      zeitraum: "Nicht veröffentlicht.",
    },
    dateiformat: { format: "CSV", text: "CSV laut Benutzeranleitung vom 23.02.2026 (mit Tabellenkalkulation wie Excel bearbeitbar).", belegt: true },
    optOut: {
      text: "Netz Burgenland beschreibt im Smart-Meter-Folder (Stand Jänner 2018) die Opt-out-Regelung: digitaler Standardzähler, Auslesung nur einmal jährlich für die Jahresabrechnung; der Einbau selbst kann nicht verweigert werden. Die heutigen Ausschlüsse des § 54 Abs. 2 ElWG (PV, Speicher, Wärmepumpe, Ladepunkt, Energiegemeinschaft, dynamischer Tarif) gelten.",
      weg: "Nicht aktuell beschrieben – Kundentelefon 0800 8889001.",
      folgen: "Keine Viertelstunden- und Tageswerte; keine Smart Plus Ansicht, kein Export der 15-Minuten-Werte.",
    },
    datenVerfuegbar: "Tageswerte täglich um 0:00 Uhr aktualisiert; Smart Plus: 15-Minuten-Werte einmal täglich ausgelesen.",
    kontakt: [{ label: "Kundentelefon", wert: "0800 8889001" }],
    quellen: [
      { titel: "Netz Burgenland – Smart Meter (Portal-Zugang, Opt-in im Netz Kundenportal, ohne Mehrkosten)", url: "https://www.netzburgenland.at/smart-meter", abgerufen: "11.10.2026" },
      { titel: "Netz Burgenland – Benutzeranleitung Verbrauchsdatenportal, 23.02.2026 (PDF; Login, Smart Plus Ansicht, Datenexport CSV)", url: "https://assets.netzburgenland.at/20260223_Kurzanleitung_Verbrauchsdatenportal_8eed5b7855.pdf", abgerufen: "11.10.2026" },
      { titel: "Netz Burgenland – Smart Meter Folder, Stand Jänner 2018 (PDF; Opt-out-Regelung)", url: "https://assets.netzburgenland.at/Folder_Smart_Meter_WEB_29d5523be2.pdf", abgerufen: "11.10.2026" },
      { titel: "Netz Burgenland – Smart Meter Verbrauchsdatenportal (Login)", url: "https://smartmeter.netzburgenland.at/", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Opt-out-Weg nur im Folder von 2018 beschrieben – aktuelle Regelung beim Kundentelefon erfragen"],
  },

  // ------------------------------------------------------------------ Vorarlberg
  {
    slug: "vorarlberg-netz",
    name: "Vorarlberger Energienetze GmbH",
    kurz: "vorarlberg netz",
    bundesland: "Vorarlberg",
    gebiet: "Vorarlberg (ohne einzelne Stadt- und Gemeindewerke)",
    zaehlpunkte: 234169,
    portal: {
      name: "vorarlberg netz Portal (Webportal)",
      url: "https://webportal.vorarlbergnetz.at",
      hinweis: "Verbrauchs- und Einspeisedaten je Vertragskonto, Freigaben (Viertelstundenwerte, Energiegemeinschaft), Daten-Export; voller Funktionsumfang nach Identitäts-Check.",
    },
    login: {
      text: "Registrierung über „Login“ auf vorarlbergnetz.at mit E-Mail-Adresse und Bestätigungsmail; danach Kunden- und Vertragskontonummer aus dem Schreiben von vorarlberg netz eingeben.",
      angaben: ["E-Mail-Adresse (Bestätigung)", "Kundennummer", "Vertragskontonummer", "Identitäts-Check für alle Funktionen"],
      url: "https://webportal.vorarlbergnetz.at",
    },
    viertelstundenAktivieren: {
      standard: "Seit 24.12.2025 ist „Smart Meter Plus“ (Viertelstundenwerte einmal täglich übertragen) laut vorarlberg netz die gesetzlich vorgesehene Standardkonfiguration; die Umstellung bestehender „Standard“-Zähler (nur Tageswerte) erfolgt nach den gesetzlichen Fristen. „Stromzähler Light“ ist das Opt-out.",
      text: "Viertelstundenwerte im Portal unter dem Reiter „Freigaben“ anfordern (Benutzerhandbuch, Kapitel 5.1).",
      schritte: ["Im Webportal anmelden", "Reiter „Freigaben“ → Viertelstundenwerte anfordern", "Werte im Reiter „Verbräuche / Einspeisung“ je Vertragskonto und Zeitraum"],
    },
    exportWeg: {
      text: "Reiter „Verbräuche / Einspeisung“: Vertragskonto und Zeitraum wählen, über die Schaltfläche „Export“ die angezeigten Daten für einen frei wählbaren Zeitraum als CSV herunterladen – wahlweise im Standard-AT-Format oder in einem Format für den E-Control-Tarifkalkulator (nur bei vollständigen Daten für 365 Tage).",
      schritte: ["Reiter „Verbräuche / Einspeisung“ öffnen", "Vertragskonto, Zeitraum und Darstellung wählen", "„Export“ → Download AT-Format (für die Lastgang-Analyse) oder E-Control-Format"],
      zeitraum: "Frei wählbar; E-Control-Format nur mit 365 vollständigen Tagen.",
    },
    dateiformat: { format: "CSV", text: "CSV in zwei Varianten laut Benutzerhandbuch (Standard-AT-Format, E-Control-Tarifkalkulator-Format).", belegt: true },
    optOut: {
      text: "„Stromzähler Light“ speichert keine Viertelstunden- und Tageswerte, nur Monatswerte und den höchsten monatlichen Viertelstundenleistungswert; Übermittlung bei Anlässen wie Abrechnung, Lieferantenwechsel oder Umzug. Laut ElWG nicht zulässig, wenn z. B. eine PV-Anlage betrieben wird.",
      weg: "Nicht öffentlich beschrieben – Kontakt smartmeter@vorarlbergnetz.at.",
      folgen: "Keine Viertelstundenwerte im Portal, kein flexibler Tarif.",
    },
    datenVerfuegbar: "Täglich; Viertelstundenwerte 60 Tage im Zähler; vollständige Darstellung laut Handbuch am besten zusammen mit der Exportdatei auswerten.",
    kontakt: [{ label: "E-Mail Smart Meter", wert: "smartmeter@vorarlbergnetz.at" }],
    quellen: [
      { titel: "vorarlberg netz – Smart Meter-Konfiguration (Plus, Standard, Light; ElWG-Standard seit 24.12.2025)", url: "https://www.vorarlbergnetz.at/smart-meter-konfiguration.htm", abgerufen: "11.10.2026" },
      { titel: "vorarlberg netz – Benutzerhandbuch vorarlberg netz Portal (PDF; Registrierung, Freigaben, Daten-Export CSV)", url: "https://identity.vorarlbergnetz.at/media/vne/Benutzungshandbuch.pdf", abgerufen: "11.10.2026" },
      { titel: "vorarlberg netz – Das kann Ihr neuer Stromzähler (Webportal, Kundenschnittstelle)", url: "https://www.vorarlbergnetz.at/das-kann-ihr-neuer-stromzaehler.htm", abgerufen: "11.10.2026" },
    ],
    geprueftAm: "2026-10-11",
    offen: ["Weg für Opt-out (Light) nicht beschrieben"],
  },
];

export const BETREIBER_SLUGS = SMART_METER_BETREIBER.map((b) => b.slug);

export function betreiberFuerSlug(slug) {
  return SMART_METER_BETREIBER.find((b) => b.slug === slug) || null;
}

/** Datum "2026-10-11" -> "11.10.2026" */
export function datumLabel(iso) {
  const [j, m, t] = String(iso).split("-");
  return j && m && t ? `${t}.${m}.${j}` : String(iso);
}

/** Tage seit der letzten Prüfung (jetzt als Zeitstempel, für Tests übergebbar). */
export function tageSeit(iso, jetzt = Date.now()) {
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(t)) return Infinity;
  return Math.floor((jetzt - t) / 86400000);
}

/** true, wenn die Angaben älter als der Prüfzyklus sind. */
export function pruefungFaellig(b, jetzt = Date.now()) {
  return tageSeit(b.geprueftAm, jetzt) > PRUEF_ZYKLUS_TAGE;
}

/** Kurzstatus des Exports für Karten und Tabelle. */
export function exportStatus(b) {
  if (b.dateiformat?.belegt && b.dateiformat.format) return { label: b.dateiformat.format, belegt: true };
  return { label: "Format zu prüfen", belegt: false };
}

/** HowTo je Betreiber (für HowTo-Schema und Schrittliste) – aus den Daten erzeugt. */
export function betreiberHowTo(b) {
  return {
    name: `Smart Meter ${b.kurz}: Viertelstundenwerte exportieren`,
    beschreibung: `In vier Schritten vom Portal „${b.portal.name}“ zur ausgewerteten Lastgang-Datei – ohne Upload, die Datei bleibt im Browser.`,
    schritte: [
      { name: `Im Portal „${b.portal.name}“ registrieren`, text: `${b.login.text} Benötigt: ${b.login.angaben.join(", ")}.` },
      { name: "Viertelstundenwerte aktivieren", text: b.viertelstundenAktivieren.text },
      { name: "Zeitraum exportieren", text: `${b.exportWeg.text} ${b.exportWeg.schritte.join(" · ")}.` },
      { name: "Datei im Browser auswerten", text: "Die exportierte Datei unten auswählen. Sie wird ausschließlich auf Ihrem Gerät gelesen und in der Lastgang-Analyse ausgewertet." },
    ],
  };
}

/** FAQ je Betreiber – aus den Daten erzeugt, damit alle Seiten gleich aufgebaut sind. */
export function betreiberFaq(b) {
  const format = exportStatus(b);
  return [
    {
      q: `Wo sehe ich meine Smart-Meter-Daten bei ${b.kurz}?`,
      a: `Im Portal „${b.portal.name}“ (${b.portal.url}). ${b.login.text}`,
    },
    {
      q: `Wie aktiviere ich bei ${b.kurz} die Viertelstundenwerte?`,
      a: `${b.viertelstundenAktivieren.standard} ${b.viertelstundenAktivieren.text}`,
    },
    {
      q: `In welchem Format exportiert ${b.kurz} die Viertelstundenwerte?`,
      a: format.belegt
        ? `${b.dateiformat.text} Die Lastgang-Analyse erkennt gängige Portal-Exporte automatisch (Trennzeichen, Datumsformat, kWh oder kW).`
        : `${b.kurz} veröffentlicht das Dateiformat seines Exports nicht. Die Lastgang-Analyse liest CSV- und Textdateien mit Zeitstempel und Messwert je Zeile – Excel-Dateien zuvor als CSV speichern.`,
    },
    {
      q: `Kann ich bei ${b.kurz} der Viertelstundenauslesung widersprechen (Opt-out)?`,
      a: `${b.optOut.text} Weg: ${b.optOut.weg}`,
    },
    {
      q: "Wird meine exportierte Datei beim Auswerten hochgeladen?",
      a: `Nein. ${HINWEIS_DATENSCHUTZ} Nur wenn Sie anschließend ein Angebot anfragen, stehen Jahresverbrauch und Anlagengröße als Zahlen im Link.`,
    },
    {
      q: `Ist Ökovolt der Netzbetreiber ${b.kurz}?`,
      a: `Nein. ${HINWEIS_KEIN_NETZBETREIBER}`,
    },
  ];
}

/** FAQ für die Übersichtsseite. */
export const FAQ = [
  {
    q: "Wie lese ich meinen Smart Meter aus?",
    a: "Nicht am Gerät, sondern im Webportal Ihres Netzbetreibers: registrieren, Viertelstundenwerte aktivieren (falls noch Tageswerte übertragen werden) und den gewünschten Zeitraum als Datei exportieren. Die Portale unterscheiden sich – die Schritte je Netzbetreiber stehen auf den Unterseiten.",
  },
  {
    q: "Welcher Netzbetreiber ist für mich zuständig?",
    a: "Er steht auf der Netz- bzw. Stromrechnung – nicht zu verwechseln mit dem Stromlieferanten. Die Stellen 3 bis 8 der 33-stelligen Zählpunktbezeichnung enthalten seine Kennung. Die E-Control bietet eine Netzbetreiber-Suche nach Adresse.",
  },
  {
    q: "Muss ich für Viertelstundenwerte etwas bezahlen?",
    a: "Nein. Die Viertelstundenauslesung ist nach § 54 ElWG der gesetzliche Normalfall; mehrere Netzbetreiber weisen ausdrücklich auf „ohne Mehrkosten“ hin. Auch die Umstellung der Konfiguration ist kostenlos.",
  },
  {
    q: "Was ist der Unterschied zwischen Opt-in, IME, Smart Meter Plus und Prime Meter?",
    a: "Verschiedene Namen für dieselbe Einstellung: Der Zähler speichert Viertelstundenwerte und überträgt sie täglich an den Netzbetreiber, der sie im Portal anzeigt. „IMS“, „Standard“ oder „Smart Meter“ bezeichnen meist die ältere Einstellung mit Tageswerten, „DSZ“, „Light“, „Blind Meter“ oder „Opt-out“ den digitalen Standardzähler ohne Tages- und Viertelstundenwerte.",
  },
  {
    q: "Wie lange reichen die Daten zurück?",
    a: "Im Zähler selbst meist 60 Tage, im Portal je nach Netzbetreiber bis zu 36 Monate. Für eine belastbare PV- oder Speicherplanung sind zwölf volle Monate ideal, sieben Tage das Minimum.",
  },
  {
    q: "Was passiert mit meiner Datei in der Lastgang-Analyse?",
    a: `${HINWEIS_DATENSCHUTZ} Die Auswertung – Jahresverbrauch, Lastprofil, Grundlast, Spitzen, PV-Größe und Speicher – läuft vollständig auf Ihrem Gerät.`,
  },
];
