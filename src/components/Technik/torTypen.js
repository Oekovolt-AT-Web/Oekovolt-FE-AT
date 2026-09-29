// Typeinteilung von Stromerzeugungsanlagen in Österreich (RfG-Schwellenwert-V der
// E-Control) mit Regelwerk und wesentlichen Anforderungen – gemeinsame Datenquelle
// für den TOR-Typ-Finder (Client) und die Übersichtstabelle (Server).

export const TYPEN = {
  A: {
    grenze: "≥ 0,8 kW bis < 250 kW",
    netz: "< 110 kV",
    regelwerk: "TOR Stromerzeugungsanlagen Typ A, V1.4 (gültig ab 01.06.2026)",
    anforderungen: [
      "Wirkleistungsbeendigung über Eingangsport binnen 5 s",
      "bei dynamischer Vorgabe nach § 76 ElWG digitale Schnittstelle (OpenADR), Sollwert in 1 min, Rückfallfunktion",
      "Blindleistungsverfahren nach Netzanschlussvertrag",
      "P(U) bei Umrichtern im NS-Netz standardmäßig aktiv",
    ],
  },
  B: {
    grenze: "≥ 250 kW bis < 35 MW",
    netz: "< 110 kV",
    regelwerk: "TOR Stromerzeugungsanlagen Typ B, V1.3 (gültig ab 01.07.2024)",
    anforderungen: [
      "Wirkleistungsvorgabe in bis zu 4 Stufen (< 1 MW), Sollwert bei Umrichtern in 1 min",
      "Blindleistungsbereich II (cos φ 0,925 unter- bis übererregt)",
      "ab 1 MW Fernwirkschnittstelle nach Wahl des Netzbetreibers, Online-Sollwerte und Umschaltung des Q-Verfahrens",
      "FRT und – im MS-Netz auf Verlangen – dynamische Blindstromstützung",
    ],
  },
  C: {
    grenze: "≥ 35 MW bis < 50 MW",
    netz: "< 110 kV",
    regelwerk: "TOR Erzeuger Typ C",
    anforderungen: [
      "zusätzlich u. a. frequenzabhängiger Modus (FSM) und LFSM-U",
      "erweiterte Spannungs- und Blindleistungsregelung",
      "Echtzeit-Datenaustausch mit Netzbetreiber und Übertragungsnetzbetreiber",
    ],
  },
  D: {
    grenze: "≥ 50 MW",
    netz: "oder Netzanschluss ≥ 110 kV",
    regelwerk: "TOR Erzeuger Typ D",
    anforderungen: ["Anforderungen wie Typ C", "dazu erweiterte Robustheits- und Stabilitätsanforderungen", "Abstimmung mit dem Übertragungsnetzbetreiber (APG)"],
  },
};
