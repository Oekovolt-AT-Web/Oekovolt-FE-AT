// src/data/photovoltaik-seite.js
//
// Zusatzinhalte für /dienstleistungen/photovoltaik – Österreich, Stand 09/2026.
// Aussagen zur Rechtslage: Netzanschluss (Netzzugangsantrag,
// Fertigstellungsmeldung, Stromabnehmer), TOR Stromerzeugungsanlagen
// (E-Control), EAG-Investitionszuschuss (OeMAG), Umsatzsteuer (Nullsteuersatz
// endete 31.03.2025), Baurecht je Bundesland (siehe @/data/regionen/laender).

/**
 * @deprecated Ortsliste der deutschen Seite. Österreichische Standorte kommen
 * aus @/lib/regionen (RegionOesterreich). Bleibt leer, bis kein Import mehr
 * darauf verweist.
 */
export const REGION_ORTE = [];

export const PV_FAQ = [
  {
    frage: "Wie lange dauert ein Photovoltaikprojekt für einen Betrieb?",
    antwort:
      "Bei Dachanlagen bis rund 250 kWp vergehen meist drei bis sechs Monate von der Lastganganalyse bis zur Inbetriebnahme. Die Montage selbst dauert wenige Tage bis Wochen. Den größten Einfluss haben die Bearbeitungszeit des Netzbetreibers, Förderfristen und Lieferzeiten – bei Anlagen mit Mittelspannungsanschluss auch die Netzprüfung.",
  },
  {
    frage: "Wie läuft der Netzanschluss in Österreich ab?",
    antwort:
      "Wir stellen den Netzzugangsantrag im Portal des zuständigen Netzbetreibers. Dieser prüft Anschlusspunkt und Leistung und bietet einen Netzzugangsvertrag an. Nach der Montage übermittelt unser Elektrotechniker die Fertigstellungsmeldung, und Sie geben den Stromabnehmer für den Überschuss bekannt – einen Stromhändler oder die OeMAG. Danach wird die Einspeisung freigegeben.",
  },
  {
    frage: "Was bedeutet TOR Stromerzeugungsanlagen für meine Anlage?",
    antwort:
      "Die Technischen und organisatorischen Regeln (TOR) legen fest, welche Anforderungen eine Erzeugungsanlage am Netz erfüllen muss. Anlagen ab 0,8 kW bis unter 250 kW sind Typ A, ab 250 kW bis unter 35 MW Typ B. Ab Typ B kommen Anforderungen an Fernsteuerbarkeit, Blindleistung und Nachweise hinzu – dafür setzen wir unseren eigenen Parkregler ein.",
  },
  {
    frage: "Brauche ich für eine Photovoltaikanlage eine Baubewilligung?",
    antwort:
      "Das regelt jedes Bundesland in seiner Bauordnung. Dachanlagen sind in den meisten Ländern bewilligungs- und anzeigefrei, solange sie bestimmte Abstände und Höhen einhalten und keine Schutzzone betroffen ist. Freiflächenanlagen brauchen in der Regel eine passende Widmung oder Sonderausweisung nach dem Raumordnungsrecht. Wir klären das vor der Planung für Ihren Standort.",
  },
  {
    frage: "Welche Förderung gibt es für Photovoltaik im Betrieb?",
    antwort:
      "Auf Bundesebene den EAG-Investitionszuschuss, der in Fördercalls der OeMAG in den Kategorien A bis D bis 1.000 kWp vergeben wird. Er muss vor der Bestellung beantragt werden. Dazu kommen steuerliche Instrumente wie Investitionsfreibetrag und Abschreibung sowie Programme einzelner Bundesländer. Weil sich Sätze und Termine je Call ändern, prüfen wir die Förderfähigkeit im Angebot.",
  },
  {
    frage: "Fällt auf die Photovoltaikanlage Umsatzsteuer an?",
    antwort:
      "Ja. Der befristete Nullsteuersatz für kleine Anlagen endete mit 31. März 2025; seither gilt wieder der Normalsteuersatz von 20 %. Für vorsteuerabzugsberechtigte Unternehmen ist die Umsatzsteuer kein Kostenfaktor. Die steuerliche Gestaltung im Einzelfall klären Sie mit Ihrer Steuerberatung.",
  },
  {
    frage: "Was passiert mit dem Strom, den der Betrieb nicht selbst nutzt?",
    antwort:
      "Der Überschuss wird eingespeist und an einen Stromabnehmer verkauft: an einen Stromhändler, an die OeMAG zum veröffentlichten Marktpreis oder über einen Stromliefervertrag (PPA). Alternativ kann er in einer Energiegemeinschaft oder – im Gebäude – über eine gemeinschaftliche Erzeugungsanlage geteilt werden.",
  },
  {
    frage: "Übernimmt Ökovolt auch die Wartung?",
    antwort:
      "Ja. Wir überwachen Anlagen mit eigenen Fernwartungs- und SCADA-Systemen und bieten Wartungsverträge mit Service-Level passend zur Anlagengröße – inklusive wiederkehrender Prüfung, Reinigung und Thermografie auf Wunsch.",
  },
];
