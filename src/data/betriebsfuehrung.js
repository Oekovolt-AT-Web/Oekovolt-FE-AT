// src/data/betriebsfuehrung.js
//
// Betriebsführung und Anlagenübernahme (/service/betriebsfuehrung) – Paket C05.
// Reine Daten ohne Imports, damit scripts/bestand-service.test.mjs die Datei mit Node lesen kann.
//
// GRUNDSATZ (Entscheidung des Inhabers, 05.10.2026): Leistungsstufen, Reaktionszeiten (SLAs) und
// Preise erscheinen auf der Website NUR, wenn die jeweilige Stufe `freigegeben: true` trägt.
// Solange keine Stufe freigegeben ist, zeigt die Seite ausschließlich den Ablauf der Übernahme –
// ohne Preise, ohne zugesicherte Reaktionszeiten. Die Felder `reaktionszeit` und `preisHinweis`
// bleiben leer, bis die Geschäftsführung Werte nennt und freigibt.
//
// Keine Nennung einzelner Errichterfirmen (auch nicht insolventer) – die Seite spricht den
// Betreiber an, nicht den Vorgänger.

export const STAND = { geprueftAm: "2026-10-11", label: "11.10.2026" };

/** Thema für die Anfrage über /api/create_anfrage (steht in der ersten Zeile der Nachricht). */
export const ANFRAGE_THEMA = "Anlagenübernahme";

/** Vorhaben-Kennung der Angebots-API (Frappe `VORHABEN`: "service" = Wartung & Prüfung). */
export const ANFRAGE_VORHABEN = ["service"];

/**
 * Ablauf der Anlagenübernahme – in dieser Reihenfolge, jeder Schritt mit der Norm bzw. Regel,
 * auf die er sich stützt. Kein Schritt enthält Preise oder Fristen.
 */
export const ABLAUF = [
  {
    id: "unterlagen",
    titel: "Unterlagen prüfen",
    kurz: "Anlagenbuch, Prüfbefund, Netzzugangsvertrag, Förder- und Tarifverträge",
    text:
      "Wir sichten, was vorhanden ist: Anlagenbuch und Prüfbefund der Erstprüfung, Stringpläne, Datenblätter, Netzzugangs- und Einspeisevertrag, OeMAG- oder Fördervertrag, Monitoring-Zugänge. Fehlende Unterlagen holen wir – soweit möglich – beim Netzbetreiber, bei der OeMAG oder aus dem Wechselrichter-Portal nach.",
    norm: "OVE E 8101 (Dokumentation), EAG/ÖSG-Verträge",
  },
  {
    id: "e-check",
    titel: "E-Check nach OVE E 8101",
    kurz: "Besichtigen, Erproben, Messen – mit Prüfbefund",
    text:
      "Eine Elektrofachkraft prüft die Anlage wie bei einer wiederkehrenden Prüfung: Sichtprüfung von Modulen, Unterkonstruktion, Leitungsführung und Steckverbindern, Messung von Isolationswiderstand, Durchgängigkeit des Schutzleiters, Leerlaufspannung und Stringströmen, Funktionsprüfung von Freischaltstelle und Schutzeinrichtungen. Das Ergebnis ist ein Prüfbefund, der den Zustand bei Übernahme dokumentiert.",
    norm: "OVE E 8101 Teil 6, OVE EN 62446-1",
  },
  {
    id: "thermografie",
    titel: "Drohnen-Thermografie",
    kurz: "Hotspots, defekte Bypassdioden, Teilabschaltungen",
    text:
      "Aus der Luft erkennen wir, was vom Boden unsichtbar bleibt: Hotspots, ausgefallene Substrings, defekte Bypassdioden, Verschmutzung und Verschattung. Die Aufnahmen entstehen bei ausreichender Einstrahlung und werden mit den Stringmessungen abgeglichen.",
    norm: "IEC TS 62446-3 (Thermografie im Betrieb)",
  },
  {
    id: "scada",
    titel: "SCADA-Anbindung bzw. Parkregler-Nachrüstung",
    kurz: "Fernüberwachung, Einspeisemanagement nach TOR Erzeuger",
    text:
      "Wir binden die Anlage an unsere Fernüberwachung an. Fehlt ein Einspeisemanagement, das der Netzbetreiber nach TOR Erzeuger fordert (Wirkleistungsvorgabe, Blindleistung, Einspeiselimit), rüsten wir einen EZA-Regler bzw. Parkregler nach und stimmen die Parameter mit dem Netzbetreiber ab.",
    norm: "TOR Erzeuger Typ A/B (E-Control), Netzzugangsvertrag",
  },
  {
    id: "angebot",
    titel: "Angebot für Wartung und Direktvermarktung",
    kurz: "Erst nach Zustandsaufnahme – passend zur Anlage",
    text:
      "Auf Basis von Prüfbefund und Thermografie erhalten Sie ein Angebot für die laufende Betriebsführung: Wartung, Störungsdienst, Monitoring und – ab der passenden Anlagengröße – die Direktvermarktung des Stroms. Erst dann sprechen wir über Umfang und Konditionen.",
    norm: "Wartungsvertrag, Direktvermarktung über Stromhändler (EAG-Marktprämie: Voraussetzungen zu prüfen)",
  },
];

/**
 * Leistungsstufen – NUR mit `freigegeben: true` sichtbar. Reaktionszeiten und Preise bleiben leer,
 * bis die Geschäftsführung sie nennt (dann hier eintragen UND freigeben).
 */
export const LEISTUNGSSTUFEN = [
  {
    id: "monitoring",
    name: "Monitoring",
    kurz: "Fernüberwachung mit Störungsmeldung",
    enthalten: ["Anbindung an die Fernüberwachung", "Ertrags- und Störungsmeldung", "Jährlicher Ertragsbericht"],
    reaktionszeit: "",
    preisHinweis: "",
    freigegeben: false,
  },
  {
    id: "wartung",
    name: "Monitoring + Wartung",
    kurz: "Wiederkehrende Prüfung und Wartung vor Ort",
    enthalten: ["Alles aus Monitoring", "Wiederkehrende Prüfung nach OVE E 8101", "Sicht- und Funktionsprüfung vor Ort", "Thermografie nach Bedarf"],
    reaktionszeit: "",
    preisHinweis: "",
    freigegeben: false,
  },
  {
    id: "betriebsfuehrung",
    name: "Technische Betriebsführung",
    kurz: "Störungsdienst, Ersatzteile, Behörden- und Netzbetreiberkontakt",
    enthalten: ["Alles aus Monitoring + Wartung", "Störungsdienst mit Vor-Ort-Einsatz", "Ersatzteilbeschaffung und Garantieabwicklung", "Ansprechpartner für Netzbetreiber, OeMAG und Förderstelle", "Direktvermarktung auf Wunsch"],
    reaktionszeit: "",
    preisHinweis: "",
    freigegeben: false,
  },
];

/** Nur freigegebene Stufen – die Seite zeigt ohne Freigabe keine Stufen, Preise oder SLAs. */
export const freigegebeneStufen = (stufen = LEISTUNGSSTUFEN) => stufen.filter((s) => s && s.freigegeben === true);

/** Felder im Anfrageformular (zusätzlich zu Kontakt und Standort). */
export const FORMULAR_FELDER = [
  { name: "kwp", label: "Anlagenleistung", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 99" },
  { name: "baujahr", label: "Baujahr / Inbetriebnahme", typ: "zahl", pflicht: true, placeholder: "z. B. 2013" },
  { name: "wechselrichter", label: "Wechselrichter (Hersteller, Typ, Anzahl)", placeholder: "laut Typenschild, z. B. 4 Stück", breit: true },
  { name: "seit", label: "Errichter nicht erreichbar seit", placeholder: "z. B. Frühjahr 2026" },
  {
    name: "status",
    label: "Aktueller Zustand",
    typ: "auswahl",
    optionen: ["Anlage läuft, aber ohne Betreuung", "Störung, Anlage steht", "Ertrag deutlich gesunken", "Unterlagen fehlen", "Netzbetreiber oder OeMAG fordert etwas"],
  },
];

export const QUELLEN = [
  { titel: "OVE E 8101 – Errichtung von elektrischen Niederspannungsanlagen (Teil 6: Prüfungen)", href: "https://www.ove.at/standardisierung/ove-e-8101" },
  { titel: "ÖVE/ÖNORM EN 62446-1 – Prüfung, Dokumentation und Instandhaltung von PV-Systemen", href: "https://shop.austrian-standards.at/" },
  { titel: "E-Control – Technische und organisatorische Regeln für Betreiber und Benutzer von Netzen (TOR Erzeuger)", href: "https://www.e-control.at/marktteilnehmer/strom/netzbetrieb/tor" },
  { titel: "Elektroschutzverordnung 2012 (ESV 2012) – Prüfpflichten des Arbeitgebers", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007741" },
  { titel: "OeMAG – Vertragsübernahme bei Betreiberwechsel", href: "https://www.oem-ag.at/" },
];
