// src/lib/flaeche/checkliste.js
//
// Checkliste Pachtvertrag Freiflächen-PV für Grundeigentümer.
// Fragen, die vor der Unterschrift geklärt sein sollten – KEINE Rechts- oder
// Steuerberatung. Aussagen mit Tatsachengehalt tragen eine Quelle (Abruf 30.09.2026).

import { PACHT_QUELLEN } from "./check.js";

export const LK_OOE_CHECKLISTE = {
  label: "Landwirtschaftskammer Oberösterreich – Photovoltaik-Freiflächen-Anlagen: Checkliste über wesentliche Vertragspunkte (09.06.2026)",
  url: "https://ooe.lko.at/photovoltaik-freifl%C3%A4chen-anlagen+2400+3387438",
};

export const CHECKLISTE = [
  {
    id: "laufzeit",
    titel: "Laufzeit und Bindung",
    frage: "Wie lange sind Sie gebunden – einschließlich aller Verlängerungsoptionen des Betreibers?",
    info: "Die Landwirtschaftskammer Steiermark warnt vor Musterverträgen, die Grundeigentümer bis zu 50 Jahre binden.",
    quelle: PACHT_QUELLEN.lkSteiermark,
  },
  {
    id: "zins",
    titel: "Pachtzins und Wertsicherung",
    frage: "Fixbetrag je Hektar, erlösabhängige Pacht oder beides? Ist der Betrag an einen Index wie den VPI gebunden?",
  },
  {
    id: "zahlungsbeginn",
    titel: "Zahlung ab wann",
    frage: "Zahlt der Betreiber schon während Planung und Genehmigung ein Entgelt – oder erst ab Baubeginn bzw. Inbetriebnahme?",
  },
  {
    id: "ausstieg",
    titel: "Ausstiegsrechte",
    frage: "Was gilt, wenn Widmung, Netzanschluss oder Förderung scheitern? Bis wann darf der Betreiber zurücktreten – und welche Rechte haben Sie?",
  },
  {
    id: "rueckbau",
    titel: "Rückbau und Sicherheit",
    frage: "Ist der rückstandslose Rückbau geregelt und von Anfang an abgesichert?",
    info: "Die Landwirtschaftskammern Steiermark und Kärnten halten Rückbauregeln für unverzichtbar und empfehlen eine Absicherung per Bankgarantie oder Patronatserklärung schon bei Vertragsbeginn.",
    quelle: PACHT_QUELLEN.lkSteiermark,
  },
  {
    id: "grundbuch",
    titel: "Dienstbarkeiten und Grundbuch",
    frage: "Welche Rechte werden eingetragen – Kabeltrasse, Zufahrt, Trafostation – und werden sie nach Vertragsende gelöscht?",
  },
  {
    id: "steuer",
    titel: "Steuer und Hofübergabe",
    frage: "Bleibt die Fläche land- und forstwirtschaftliches Vermögen oder wird sie Grundvermögen?",
    info: "Laut Landwirtschaftskammer hängt das von Bauart und Nutzung ab (z. B. Modulhöhe, Reihenabstand, Beweidung). Wird die Fläche Grundvermögen, kann die Grunderwerbsteuer bei einer Hofübergabe deutlich steigen.",
    quelle: PACHT_QUELLEN.lkSteuer,
  },
  {
    id: "agrar",
    titel: "Agrarförderungen",
    frage: "Wie wirkt sich die Verpachtung auf Ihre Agrarförderungen und Ihren Betrieb aus? Klären Sie das mit Ihrer Landwirtschaftskammer.",
  },
  {
    id: "pflege",
    titel: "Pflege, Zaun und Haftung",
    frage: "Wer mäht oder beweidet, wer zäunt ein, wer haftet für Schäden und wer versichert die Anlage?",
  },
  {
    id: "uebertragung",
    titel: "Weitergabe des Vertrags",
    frage: "Darf der Betreiber den Vertrag an Dritte übertragen, etwa an einen Investor – und bleiben alle Sicherheiten dabei bestehen?",
  },
  {
    id: "beratung",
    titel: "Unabhängige Prüfung",
    frage: "Lassen Sie den Entwurf vor der Unterschrift unabhängig prüfen. Die Landwirtschaftskammern beraten Grundeigentümer und stellen Checklisten bzw. Musterverträge bereit.",
    quelle: LK_OOE_CHECKLISTE,
  },
];
