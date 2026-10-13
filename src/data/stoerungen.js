// src/data/stoerungen.js
//
// Fehlercode-Hub (/service/stoerung) – Paket C05. Reine Daten ohne Imports (Node-lesbar für
// scripts/bestand-service.test.mjs).
//
// GRUNDSÄTZE
//  - Nur Hersteller, deren Einsatz bei Ökovolt nachgewiesen ist (partner.js, Entscheidung E3 vom
//    30.09.2026): Fronius und Huawei. Herstellernamen rein beschreibend – keine Logos, keine
//    Formulierung, die eine Partnerschaft, Zertifizierung oder Freigabe durch den Hersteller nahelegt.
//  - Alle Texte in eigenen Worten. Keine Herstellertabellen kopiert; die Quelle (Handbuch, Version,
//    Abrufdatum) wird je Eintrag verlinkt.
//  - `darf_betreiber_pruefen` enthält NUR Prüfungen ohne Öffnen von Gehäusen und ohne Arbeiten an
//    DC-Leitungen, Steckverbindern oder Sicherungen. Alles andere ist Sache der Elektrofachkraft
//    (`elektrofachkraft_noetig: true`).
//  - Jeder Eintrag trägt `freigabe_elektrofachkraft: false`, bis eine Elektrofachkraft von Ökovolt
//    Bedeutung, Ursachen und Prüfhinweise fachlich geprüft hat. Ohne Freigabe: keine Detailseite
//    (404), kein Eintrag in generateStaticParams, in der Übersicht nur der Hinweis „in Prüfung“.
//  - Codes mit `qu: true` betreffen die Netzspannung: Die Seite erklärt dort die spannungsabhängige
//    Blindleistungsregelung Q(U) nach TOR Erzeuger statt „Netz zu stark“-Mythen.

export const STAND = { geprueftAm: "2026-10-11", label: "11.10.2026" };

export const HERSTELLER = {
  fronius: {
    slug: "fronius",
    name: "Fronius",
    beschreibung: "Wechselrichter der Serien Symo, Primo, Eco, Tauro und GEN24 (Hersteller aus Pettenbach, Oberösterreich).",
    codeFormat: "Statusmeldungen als „STATE“ plus dreistellige Nummer, z. B. STATE 102",
    anzeige: "Display bzw. Status-LED am Gerät, Solar.web oder die Fronius-App; bei GEN24 die Weboberfläche des Geräts.",
    quelle: {
      titel: "Fronius Symo GEN24 6–10 kW Plus – digitale Bedienungsanleitung (Anhang: Statusmeldungen und Behebung)",
      url: "https://manuals.fronius.com/html/4204260315",
      version: "Online-Ausgabe 2026 (manuals.fronius.com, Dokument 42,0426,0315)",
      abgerufen: "2026-10-12",
      // Prüfvermerk (nicht öffentlich): Link am 12.10.2026 geprüft (Weiterleitung auf die Sprachfassung,
      // Kapitel „Status codes and remedy“ vorhanden). Für Symo (ohne GEN24) und Primo gelten eigene
      // Anleitungen – bei der fachlichen Freigabe je Code die passende Geräteserie zuordnen.
      linkGeprueft: true,
    },
  },
  huawei: {
    slug: "huawei",
    name: "Huawei",
    beschreibung: "String-Wechselrichter der Serie SUN2000 (Wohnhaus bis Gewerbe) mit FusionSolar-Überwachung.",
    codeFormat: "Alarm-ID als vierstellige Nummer, z. B. Alarm 2032",
    anzeige: "FusionSolar-App oder -Portal (Alarme), LED-Anzeige am Gerät.",
    quelle: {
      titel: "Huawei Smart PV – Service & Support mit Produktdokumenten (Benutzerhandbuch SUN2000, Kapitel Alarm-Referenz)",
      url: "https://solar.huawei.com/eu/service-support",
      version: "Benutzerhandbuch der jeweiligen Gerätereihe, z. B. SUN2000-(12KTL–25KTL)-M5",
      abgerufen: "2026-10-12",
      // Prüfvermerk (nicht öffentlich): Seite am 12.10.2026 erreichbar, führt zur Produktdokument-Bibliothek
      // (info.support.huawei.com). Ein stabiler Direktlink auf das Handbuch war nicht abrufbar –
      // vor der fachlichen Freigabe Direktlink und Ausgabe (Issue/Datum) nachtragen.
      linkGeprueft: false,
    },
  },
};

/** ISO-Datum (JJJJ-MM-TT) für die Anzeige im deutschen Format (TT.MM.JJJJ). */
export function datumDe(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(iso || "");
}

export const HERSTELLER_SLUGS = Object.keys(HERSTELLER);

/** Sicherheitshinweis – auf JEDER Seite des Hubs sichtbar. */
export const SICHERHEITSHINWEIS = {
  titel: "Bitte nichts öffnen, nichts abklemmen",
  text:
    "PV-Anlagen führen auf der Gleichstromseite auch bei abgeschaltetem Wechselrichter Spannung, solange Licht auf die Module fällt. Arbeiten an DC-Leitungen, Steckverbindern, Sicherungen, Überspannungsableitern und im Inneren von Wechselrichter oder Anschlusskasten sind ausschließlich Elektrofachkräften vorbehalten (Elektrotechnikgesetz, OVE E 8101). Als Betreiber prüfen Sie nur, was sich ohne Werkzeug und ohne Öffnen von Gehäusen erkennen lässt: Anzeigen, App, Stellung von Leitungsschutzschaltern, Sichtbares von außen.",
};

/** Erklärung zur spannungsabhängigen Blindleistungsregelung – bei allen `qu: true`-Einträgen. */
export const QU_ERKLAERUNG = {
  titel: "Netzspannung zu hoch – warum der Wechselrichter abregelt",
  text:
    "Speist eine Anlage ein, hebt sie die Spannung am Anschlusspunkt an. Liegt sie über dem zulässigen Band (ÖVE/ÖNORM EN 50160: 230 V +10 %), muss der Wechselrichter nach TOR Erzeuger reagieren: zuerst mit spannungsabhängiger Blindleistung Q(U), dann mit wirkleistungsabhängiger Reduktion P(U), zuletzt mit Trennung vom Netz. Das ist kein Gerätefehler, sondern eine Schutzfunktion. Häufige Ursachen sind ein schwacher Netzausläufer, zu lange oder zu dünne AC-Leitungen zwischen Wechselrichter und Zählerkasten oder eine falsche Länderkennung bzw. ein veraltetes Netzprofil im Gerät.",
  massnahmen: [
    "Häufigkeit und Uhrzeit der Meldung notieren (meist sonnige Mittagsstunden bei wenig Verbrauch).",
    "Elektrofachkraft prüft Leitungsquerschnitt, Klemmstellen und das eingestellte Netzprofil (Länderkennung, Q(U)-Kennlinie).",
    "Bleibt die Spannung am Hausanschluss zu hoch, meldet der Betreiber das dem Netzbetreiber – er ist für die Spannungsqualität am Anschlusspunkt zuständig.",
  ],
  quelle: { titel: "E-Control – TOR Erzeuger Typ A, Abschnitt Spannungshaltung (Q(U), P(U))", url: "https://www.e-control.at/marktteilnehmer/strom/netzbetrieb/tor" },
};

const Q = (hersteller) => ({ ...HERSTELLER[hersteller].quelle });

/**
 * Einträge – Felder:
 *  hersteller, code, titel, bedeutung, ursachen[], darf_betreiber_pruefen[], elektrofachkraft_noetig,
 *  dringlichkeit ("normal" | "bald" | "sofort"), qu?, quelle, freigabe_elektrofachkraft
 */
export const STOERUNGEN = [
  // ---------------------------------------------------------------- Fronius
  {
    hersteller: "fronius",
    code: "102",
    titel: "Netzspannung zu hoch",
    bedeutung: "Die gemessene Wechselspannung am Anschluss liegt über dem erlaubten Band. Der Wechselrichter regelt ab oder trennt sich kurz vom Netz und versucht es nach einer Wartezeit erneut.",
    ursachen: ["Schwaches Netz oder langer Ausläufer", "Zu lange bzw. zu dünne AC-Leitung zum Zähler", "Falsches Netzprofil oder falsche Länderkennung im Gerät", "Mehrere PV-Anlagen am selben Strang des Netzbetreibers"],
    darf_betreiber_pruefen: ["Tritt die Meldung nur mittags bei Sonne auf?", "Wie oft am Tag und wie lange?", "Zeigt das Portal gleichzeitig reduzierte Leistung?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    qu: true,
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "103",
    titel: "Netzspannung zu niedrig",
    bedeutung: "Die Wechselspannung ist unter die zulässige Grenze gefallen. Der Wechselrichter trennt sich und schaltet nach Rückkehr der Spannung automatisch wieder zu.",
    ursachen: ["Störung oder Unterbrechung im Netz", "Ausgelöster Leitungsschutzschalter des Einspeisezweigs", "Lockere Klemmstelle auf der AC-Seite", "Phasenausfall"],
    darf_betreiber_pruefen: ["Haben auch andere Verbraucher im Gebäude gerade Spannungsprobleme?", "Steht der Leitungsschutzschalter der PV-Anlage im Zählerkasten auf „Ein“? (nur ansehen)"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "105",
    titel: "Netzfrequenz zu hoch",
    bedeutung: "Die Netzfrequenz liegt über dem erlaubten Bereich. Der Wechselrichter reduziert die Leistung oder trennt sich, bis die Frequenz wieder passt.",
    ursachen: ["Kurzzeitige Netzstörung", "Betrieb an einem Notstromaggregat oder in einer Insel ohne passende Einstellung", "Falsches Netzprofil"],
    darf_betreiber_pruefen: ["Lief gerade ein Notstromaggregat oder eine Ersatzstromumschaltung?", "Kam die Meldung nur einmal oder wiederholt?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "normal",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "107",
    titel: "Kein Netz erkannt",
    bedeutung: "Der Wechselrichter findet am AC-Anschluss kein gültiges Netz. Er bleibt getrennt, bis Spannung und Frequenz wieder im Bereich liegen.",
    ursachen: ["Stromausfall oder Abschaltung durch den Netzbetreiber", "Leitungsschutzschalter oder Fehlerstromschutzschalter ausgelöst", "Freischaltstelle geöffnet", "Lose AC-Verbindung"],
    darf_betreiber_pruefen: ["Gibt es im Gebäude Strom?", "Stellung der Schutzschalter im Zählerkasten ansehen (nicht betätigen, wenn wiederholt ausgelöst)"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "108",
    titel: "Inselbetrieb erkannt",
    bedeutung: "Der Wechselrichter vermutet, dass er ohne öffentliches Netz einspeist (Inselbildung) und schaltet sich aus Sicherheitsgründen ab.",
    ursachen: ["Netzausfall bei laufender Anlage", "Netzimpedanz außerhalb der Erwartung", "Fehlerhafte Einstellung der Inselerkennung"],
    darf_betreiber_pruefen: ["Gab es zeitgleich einen Stromausfall?", "Startet die Anlage danach von selbst wieder?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "normal",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "112",
    titel: "Fehlerstromüberwachung hat ausgelöst",
    bedeutung: "Die interne Fehlerstromüberwachung (RCMU) hat einen unzulässigen Ableitstrom erkannt. Der Wechselrichter trennt sich vom Netz.",
    ursachen: ["Feuchtigkeit in Steckverbindern oder Anschlusskästen", "Beschädigte Modul- oder Stringleitung", "Isolationsfehler an Modulen", "Hohe kapazitive Ableitströme bei bestimmten Modultypen"],
    darf_betreiber_pruefen: ["Tritt die Meldung nach Regen oder morgens bei Tau auf?", "Sind von außen beschädigte Leitungen oder Tierverbiss sichtbar? (nur Sichtkontrolle vom Boden)"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "240",
    titel: "Lichtbogen erkannt",
    bedeutung: "Die Lichtbogenerkennung (AFCI) hat auf der Gleichstromseite einen Störlichtbogen gemessen und den Wechselrichter abgeschaltet. Ein Lichtbogen kann Brände auslösen.",
    ursachen: ["Lose oder korrodierte Steckverbindung im String", "Beschädigte DC-Leitung", "Defekte Anschlussdose eines Moduls", "Selten: Fehlauslösung durch Störsignale"],
    darf_betreiber_pruefen: ["Anlage NICHT selbst quittieren oder neu starten", "Gibt es Brandgeruch oder sichtbare Verfärbungen an Dosen oder Leitungen? (vom Boden aus)", "Elektrofachkraft verständigen"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "241",
    titel: "Lichtbogen – Wiedereinschalten gesperrt",
    bedeutung: "Nach einem erkannten Lichtbogen bleibt der Wechselrichter gesperrt, bis die Ursache geprüft und die Meldung am Gerät bestätigt wurde.",
    ursachen: ["Siehe STATE 240 – die Sperre ist Absicht, kein zweiter Fehler"],
    darf_betreiber_pruefen: ["Keine eigene Quittierung – Freigabe erst nach Prüfung der DC-Seite durch die Elektrofachkraft"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "301",
    titel: "Überstrom auf der AC-Seite",
    bedeutung: "Der Ausgangsstrom hat kurzzeitig den zulässigen Wert überschritten. Der Wechselrichter unterbricht die Einspeisung und startet nach einer Wartezeit neu.",
    ursachen: ["Netzstörung oder Spannungseinbruch", "Kurzschluss im AC-Abgang", "Gerätedefekt bei wiederholtem Auftreten"],
    darf_betreiber_pruefen: ["Einmalig (meist unkritisch) oder wiederholt?", "Zeitpunkt notieren"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "302",
    titel: "Überstrom auf der DC-Seite",
    bedeutung: "Der Strom aus einem Stringeingang ist kurzzeitig zu hoch. Der Wechselrichter unterbricht und versucht es erneut.",
    ursachen: ["Zu viele parallele Strings an einem Eingang", "Starke Einstrahlungsspitzen (Wolkenkanten) bei knapp ausgelegter Anlage", "Fehler im Stringaufbau nach Umbau"],
    darf_betreiber_pruefen: ["Nur bei sehr hoher Einstrahlung?", "Wurde die Anlage zuletzt erweitert oder umgebaut?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "303",
    titel: "Übertemperatur DC-Teil",
    bedeutung: "Das Leistungsteil auf der Gleichstromseite ist zu warm. Der Wechselrichter drosselt zum Schutz der Bauteile und läuft nach dem Abkühlen weiter.",
    ursachen: ["Lüftungsschlitze oder Lüfter verschmutzt", "Montageort zu warm oder in der Sonne", "Zu wenig Abstand zu Wänden oder anderen Geräten", "Lüfterdefekt"],
    darf_betreiber_pruefen: ["Steht das Gerät in der Sonne oder in einem heißen Raum?", "Sind die Lüftungsschlitze von außen sichtbar verstaubt? (nicht öffnen, nicht ausblasen)"],
    elektrofachkraft_noetig: false,
    dringlichkeit: "normal",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "306",
    titel: "Zu wenig Leistung zum Einspeisen",
    bedeutung: "Die Spannung im Zwischenkreis reicht nicht für die Einspeisung. In der Dämmerung, bei Schnee oder Nebel normal; tagsüber bei Sonne ein Hinweis auf ein Problem.",
    ursachen: ["Normal: Morgen, Abend, Schnee, dichte Wolken", "Verschattung oder starke Verschmutzung", "Ausgefallener String", "Falsche Stringverschaltung"],
    darf_betreiber_pruefen: ["Nur morgens/abends oder bei Schnee? Dann unkritisch", "Bei Sonne mittags: Modulfeld vom Boden auf Schnee, Laub, Verschmutzung ansehen"],
    elektrofachkraft_noetig: false,
    dringlichkeit: "normal",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "307",
    titel: "DC-Spannung zu niedrig",
    bedeutung: "Die Spannung aus dem Modulfeld liegt unter der Startschwelle. Wie STATE 306 in der Dämmerung normal; bei Sonne ein Hinweis auf einen Fehler im String.",
    ursachen: ["Normal bei wenig Licht", "String unterbrochen oder Steckverbinder gelöst", "Zu wenige Module je String", "Defekte Moduldioden"],
    darf_betreiber_pruefen: ["Zeitpunkt und Wetter notieren", "Zeigt das Portal einen String dauerhaft mit null?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "normal",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "401",
    titel: "Keine Verbindung zum Leistungsteil",
    bedeutung: "Die Steuerung kann mit dem Leistungsteil nicht kommunizieren. Ohne Kommunikation keine Einspeisung.",
    ursachen: ["Interner Gerätefehler", "Steckkontakt nach Service nicht korrekt gesetzt", "Softwarefehler"],
    darf_betreiber_pruefen: ["Bleibt die Meldung nach einem Neustart über den Hauptschalter bestehen? (nur, wenn der Hersteller den Neustart über den Schalter vorsieht; nichts öffnen)"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "457",
    titel: "Netzrelais schaltet nicht korrekt",
    bedeutung: "Der Wechselrichter misst am Ausgang Spannung, obwohl das Netzrelais geöffnet sein sollte, oder das Relais öffnet nicht. Das Gerät bleibt aus Sicherheitsgründen gesperrt.",
    ursachen: ["Verklebtes oder verschlissenes Relais", "Falsche AC-Verdrahtung (z. B. Neutralleiter vertauscht)", "Rückspannung aus einer anderen Quelle"],
    darf_betreiber_pruefen: ["Meldung dokumentieren – keine eigenen Schaltversuche"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "509",
    titel: "24 Stunden keine Einspeisung",
    bedeutung: "Der Wechselrichter hat innerhalb eines Tages keine Energie eingespeist. Im Winter bei Schneedecke erklärbar, sonst ein Hinweis auf einen Ausfall.",
    ursachen: ["Schnee auf allen Modulen", "Ausgelöster Schutzschalter", "Unterbrechung auf der DC-Seite", "Anlage abgeschaltet"],
    darf_betreiber_pruefen: ["Liegt Schnee?", "Zeigt das Gerät eine weitere Meldung?", "Stellung der Schutzschalter ansehen"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "fronius",
    code: "567",
    titel: "Leistungsreduktion wegen Netzspannung",
    bedeutung: "Der Wechselrichter reduziert die Wirkleistung, weil die Netzspannung hoch ist (P(U)-Funktion nach TOR Erzeuger). Kein Fehler, aber Ertragsverlust.",
    ursachen: ["Hohe Netzspannung am Anschlusspunkt", "Lange AC-Leitung", "Viele Einspeiser im selben Netzstrang"],
    darf_betreiber_pruefen: ["Wie viele Stunden pro Tag steht die Meldung an?", "Stimmen die Erträge gegenüber dem Vorjahr?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "normal",
    qu: true,
    quelle: Q("fronius"),
    freigabe_elektrofachkraft: false,
  },
  // ---------------------------------------------------------------- Huawei
  {
    hersteller: "huawei",
    code: "2001",
    titel: "Eingangsspannung eines Strings zu hoch",
    bedeutung: "Die Leerlaufspannung an einem Stringeingang überschreitet die zulässige Grenze – vor allem bei Kälte und klarem Himmel. Das Gerät speist nicht ein, um sich zu schützen.",
    ursachen: ["Zu viele Module in Reihe für diesen Wechselrichter", "Sehr tiefe Temperaturen (Spannung steigt bei Kälte)", "Auslegungsfehler nach Umbau"],
    darf_betreiber_pruefen: ["Nur an kalten, klaren Morgen?", "Wurde die Anlage zuletzt verändert?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2002",
    titel: "DC-Lichtbogen erkannt",
    bedeutung: "Die Lichtbogenerkennung hat auf der Gleichstromseite einen Störlichtbogen gemessen und die Einspeisung gestoppt. Brandgefahr – keine Selbsthilfe.",
    ursachen: ["Lose, korrodierte oder falsch kombinierte Steckverbinder", "Beschädigte Leitung", "Defekte Modulanschlussdose"],
    darf_betreiber_pruefen: ["Nicht quittieren, nicht neu starten", "Brandgeruch oder Verfärbungen von außen sichtbar?", "Elektrofachkraft verständigen"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2011",
    titel: "String verpolt angeschlossen",
    bedeutung: "Plus und Minus eines Strings sind am Eingang vertauscht. Der Eingang liefert keine Leistung.",
    ursachen: ["Verdrahtungsfehler bei Montage oder Umbau"],
    darf_betreiber_pruefen: ["Zeigt das Portal einen Eingang dauerhaft ohne Leistung?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2012",
    titel: "Rückstrom in einen String",
    bedeutung: "In einen String fließt Strom zurück statt heraus. Meist liegt es an ungleich langen oder verschatteten parallelen Strings.",
    ursachen: ["Parallele Strings mit unterschiedlicher Modulzahl", "Starke Teilverschattung eines Strings", "Defekte Module oder Dioden"],
    darf_betreiber_pruefen: ["Ist ein Teil des Modulfelds tageszeitlich verschattet?", "Wurde die Anlage erweitert?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2014",
    titel: "Selbsttest der Lichtbogenerkennung fehlgeschlagen",
    bedeutung: "Die AFCI-Einheit hat ihren Selbsttest nicht bestanden. Ohne funktionierende Erkennung speist das Gerät nicht ein.",
    ursachen: ["Interner Fehler der Erkennungseinheit", "Softwarestand veraltet"],
    darf_betreiber_pruefen: ["Bleibt die Meldung nach Neustart über den Hauptschalter bestehen? (nur, wenn der Hersteller den Neustart über den Schalter vorsieht)"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2032",
    titel: "Netzausfall",
    bedeutung: "Am AC-Anschluss liegt kein Netz an. Der Wechselrichter wartet und startet nach Rückkehr des Netzes automatisch.",
    ursachen: ["Stromausfall", "Ausgelöster Leitungsschutz- oder Fehlerstromschutzschalter", "Geöffnete Freischaltstelle", "Lose AC-Klemme"],
    darf_betreiber_pruefen: ["Gibt es Strom im Gebäude?", "Stellung der Schutzschalter ansehen – bei wiederholtem Auslösen nicht wieder einschalten"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2033",
    titel: "Netzunterspannung",
    bedeutung: "Die Netzspannung liegt unter dem zulässigen Band. Der Wechselrichter trennt sich vorübergehend.",
    ursachen: ["Netzstörung", "Phasenausfall", "Lockere Klemme auf der AC-Seite"],
    darf_betreiber_pruefen: ["Flackert Licht im Gebäude?", "Einmalig oder wiederholt?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2034",
    titel: "Netzüberspannung",
    bedeutung: "Die Netzspannung überschreitet das zulässige Band. Der Wechselrichter reduziert Leistung oder trennt sich – eine Schutzfunktion nach TOR Erzeuger, kein Defekt.",
    ursachen: ["Schwacher Netzausläufer", "Zu lange oder zu dünne AC-Leitung", "Falsches Netzprofil / falsche Länderkennung", "Mehrere Einspeiser im Strang"],
    darf_betreiber_pruefen: ["Nur mittags bei Sonne?", "Dauer und Häufigkeit notieren", "Ertragsvergleich mit Vorjahr"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    qu: true,
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2036",
    titel: "Netzfrequenz zu hoch",
    bedeutung: "Die Frequenz liegt über dem zulässigen Bereich. Der Wechselrichter drosselt oder trennt sich kurz.",
    ursachen: ["Netzstörung", "Betrieb an Notstromaggregat", "Falsches Netzprofil"],
    darf_betreiber_pruefen: ["Lief ein Aggregat?", "Einmalig oder wiederholt?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "normal",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2037",
    titel: "Netzfrequenz zu niedrig",
    bedeutung: "Die Frequenz liegt unter dem zulässigen Bereich – Gegenstück zu Alarm 2036.",
    ursachen: ["Netzstörung", "Aggregat- oder Inselbetrieb", "Falsches Netzprofil"],
    darf_betreiber_pruefen: ["Lief ein Aggregat?", "Einmalig oder wiederholt?"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "normal",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2051",
    titel: "Fehlerstrom zu hoch",
    bedeutung: "Die Fehlerstromüberwachung hat einen unzulässigen Ableitstrom gegen Erde erkannt. Der Wechselrichter trennt sich.",
    ursachen: ["Feuchtigkeit in Steckverbindern oder Anschlussdosen", "Beschädigte DC-Leitung", "Isolationsfehler an Modulen"],
    darf_betreiber_pruefen: ["Nach Regen oder morgens bei Tau?", "Von außen sichtbare Schäden an Leitungen? (nur Sichtkontrolle vom Boden)"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "sofort",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2062",
    titel: "Isolationswiderstand zu niedrig",
    bedeutung: "Der Isolationswiderstand des Modulfelds gegen Erde liegt beim Start unter dem Grenzwert. Das Gerät speist nicht ein, bis der Wert passt.",
    ursachen: ["Feuchte Steckverbinder oder Anschlussdosen", "Beschädigte Leitungsisolierung", "Modul mit Isolationsfehler", "Bei Nässe morgens, trocknet oft bis Mittag ab"],
    darf_betreiber_pruefen: ["Verschwindet die Meldung bei trockenem Wetter?", "Zeitpunkte notieren"],
    elektrofachkraft_noetig: true,
    dringlichkeit: "bald",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
  {
    hersteller: "huawei",
    code: "2063",
    titel: "Übertemperatur",
    bedeutung: "Das Gerät ist zu warm und drosselt die Leistung, bis es abgekühlt ist.",
    ursachen: ["Montage in direkter Sonne oder in zu warmem Raum", "Zu wenig Abstand, verstaubte Kühlrippen", "Lüfterdefekt"],
    darf_betreiber_pruefen: ["Steht das Gerät in der Sonne?", "Kühlrippen von außen sichtbar verstaubt? (nicht öffnen)"],
    elektrofachkraft_noetig: false,
    dringlichkeit: "normal",
    quelle: Q("huawei"),
    freigabe_elektrofachkraft: false,
  },
];

/** Sprechender Pfad eines Eintrags. */
export const stoerungPfad = (e) => `/service/stoerung/${e.hersteller}/${e.code}`;

/** Nur fachlich freigegebene Einträge – Grundlage für generateStaticParams und die Übersicht. */
export const freigegebeneStoerungen = (liste = STOERUNGEN) => liste.filter((e) => e && e.freigabe_elektrofachkraft === true);

/** Eintrag für Route – nur freigegeben, sonst null (→ 404). */
export function stoerungFuer(hersteller, code, liste = STOERUNGEN) {
  const h = String(hersteller || "").toLowerCase();
  const c = String(code || "").trim();
  return freigegebeneStoerungen(liste).find((e) => e.hersteller === h && e.code === c) || null;
}

/** Parameter für generateStaticParams – ohne Freigabe leer. */
export const stoerungStaticParams = (liste = STOERUNGEN) => freigegebeneStoerungen(liste).map((e) => ({ hersteller: e.hersteller, code: e.code }));

/** Anzahl je Hersteller (gesamt und freigegeben) für die Übersicht. */
export function stoerungZaehler(liste = STOERUNGEN) {
  return HERSTELLER_SLUGS.map((slug) => {
    const alle = liste.filter((e) => e.hersteller === slug);
    return { hersteller: slug, gesamt: alle.length, freigegeben: alle.filter((e) => e.freigabe_elektrofachkraft === true).length };
  });
}

export const DRINGLICHKEIT = {
  normal: { label: "Beobachten", text: "Meist Betriebszustand oder Netzereignis – notieren, bei Wiederholung melden." },
  bald: { label: "Zeitnah prüfen lassen", text: "Ertragsverlust oder Ausfall wahrscheinlich – Elektrofachkraft innerhalb weniger Tage." },
  sofort: { label: "Sofort Fachkraft", text: "Sicherheitsrelevant – nicht quittieren, nicht neu starten, Elektrofachkraft verständigen." },
};
