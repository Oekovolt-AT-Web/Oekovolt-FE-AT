// src/data/parkreglerDatenblatt.js
//
// Datenblatt des Parkreglers (Funktionsumfang, Protokolle, Normbezug) – EINZIGE Quelle für
// /technik/parkregler/datenblatt. Regel (Welle B, Paket B04): Kein Wert erscheint auf der
// Website, solange er nicht mit freigegeben:true, freigegeben_am und freigegeben_von belegt
// ist (Rechteklärung mit dem Technologiepartner, siehe src/data/marke.js
// PARKREGLER_RECHTE_GEKLAERT). Bis dahin zeigt die Seite „Datenblatt in Vorbereitung“ und
// den Inbetriebnahme-Prüfplan, der sich allein aus den TOR-Standardwerten ergibt.
//
// Die Zeilen tragen nur den Anforderungsrahmen der TOR (was ein Datenblatt belegen muss),
// nicht die Produktwerte. Produktwerte kommen erst mit der Freigabe in `wert`.
// Diese Datei ist bewusst ohne @/-Importe, damit scripts/technik.test.mjs sie laden kann.

export const DATENBLATT = Object.freeze({
  /** Gesamtfreigabe durch Inhaber + Technologiepartner. */
  freigegeben: false,
  freigegeben_am: null,
  freigegeben_von: null,
  stand: "2026-10-11",
  gruppen: [
    {
      id: "funktionen",
      titel: "Funktionsumfang",
      zeilen: [
        { id: "p-sollwert", merkmal: "Wirkleistungsvorgabe (Stufen und Online-Sollwert)", torBezug: "TOR Typ B V1.3 Kap. 5.1.4, Typ A V1.4 Kap. 5.1.4", wert: null, freigegeben: false },
        { id: "q-verfahren", merkmal: "Blindleistungsverfahren cos φ fix, cos φ(P), Q(U), Q fix", torBezug: "TOR Typ A V1.4 / Typ B V1.3 Kap. 5.3.3–5.3.4", wert: null, freigegeben: false },
        { id: "p-u", merkmal: "Spannungsgeführte Wirkleistungsreduktion P(U)", torBezug: "TOR Typ A V1.4 Kap. 5.3.4 (Umrichter im NS-Netz)", wert: null, freigegeben: false },
        { id: "einspeiselimit", merkmal: "Einhaltung der netzwirksamen Leistung am Netzanschlusspunkt", torBezug: "Netzanschlussvertrag; § 76 und § 101 ElWG", wert: null, freigegeben: false },
        { id: "rueckfall", merkmal: "Rückfallwert bei Kommunikationsausfall", torBezug: "TOR Typ A V1.4 Kap. 5.1.4 (Fall-Back-Funktion)", wert: null, freigegeben: false },
        { id: "rampen", merkmal: "Rampenbegrenzung nach Wiederzuschaltung", torBezug: "TOR Typ B V1.3 Kap. 5.4.1 (≤ 10 % Pmax/min)", wert: null, freigegeben: false },
      ],
    },
    {
      id: "protokolle",
      titel: "Protokolle und Schnittstellen",
      zeilen: [
        { id: "fernwirk", merkmal: "Fernwirkanbindung an den Netzbetreiber", torBezug: "TOR Typ B V1.3 Kap. 5.1.4 (IEC 60870-5-101/-104, Modbus RTU/TCP, potentialfreie Kontakte)", wert: null, freigegeben: false },
        { id: "feldbus", merkmal: "Wechselrichter-/Speicheranbindung", torBezug: "SunSpec-Informationsmodelle, Modbus TCP, Herstellerregister", wert: null, freigegeben: false },
        { id: "openadr", merkmal: "Dynamische Vorgabe der netzwirksamen Leistung", torBezug: "TOR Typ A V1.4 (OpenADR), § 76 ElWG", wert: null, freigegeben: false },
        { id: "usv", merkmal: "Backup-Versorgung der Kommunikation", torBezug: "TOR Typ B V1.3 (≥ 30 min bei Online-Sollwerten)", wert: null, freigegeben: false },
      ],
    },
    {
      id: "normen",
      titel: "Normbezug und Nachweise",
      zeilen: [
        { id: "parametrierschutz", merkmal: "Schutz netzrelevanter Einstellungen", torBezug: "TOR Typ A V1.4 / Typ B V1.3 Kap. 6.2", wert: null, freigegeben: false },
        { id: "konformitaet", merkmal: "Konformitätsnachweis der Gesamtanlage", torBezug: "TOR Typ B V1.3 Kap. 8; RKS-AT Typ B V1.1", wert: null, freigegeben: false },
        { id: "doku", merkmal: "Dokumentation und Parameterauszug", torBezug: "ÖVE/ÖNORM EN 62446-1; TOR Anhang A8 (Konformitätsüberwachung)", wert: null, freigegeben: false },
        { id: "security", merkmal: "IT-Sicherheit der Fernzugänge", torBezug: "NISG 2026 (BGBl. I Nr. 94/2025), IEC 62443", wert: null, freigegeben: false },
      ],
    },
  ],
});

/** Nur Zeilen mit vollständiger Freigabe – leer, solange nichts freigegeben ist. */
export const FREIGEGEBENE_WERTE = DATENBLATT.gruppen.flatMap((g) =>
  g.zeilen.filter((z) => DATENBLATT.freigegeben === true && z.freigegeben === true && z.wert != null && DATENBLATT.freigegeben_am && DATENBLATT.freigegeben_von).map((z) => ({ ...z, gruppe: g.id }))
);

/**
 * Bezeichnung des Reglers: Herstellerbezeichnung erst nach der Rechteklärung
 * (src/data/marke.js PARKREGLER_RECHTE_GEKLAERT). Der freigegebene Name kommt dann hier hinein.
 */
export const REGLER_BEZEICHNUNG_FREIGEGEBEN = null;
export function reglerBezeichnung(rechteGeklaert) {
  return rechteGeklaert && REGLER_BEZEICHNUNG_FREIGEGEBEN ? REGLER_BEZEICHNUNG_FREIGEGEBEN : "Parkregler (Bezeichnung nach Rechteklärung)";
}

/** Sollwertstufen der Wirkleistungsvorgabe (TOR Typ B V1.3 Kap. 5.1.4, Beispiel für ≤ 4 Stufen). */
export const PRUEFPLAN_STUFEN = Object.freeze([100, 60, 30, 0]);

export const Q_VERFAHREN = Object.freeze({
  cosphi: { label: "cos φ fix", pruefung: "Festen Verschiebungsfaktor laut Netzanschlussvertrag vorgeben; Q am Netzanschlusspunkt bei 30/60/100 % P messen und mit dem Sollwert vergleichen." },
  cosphip: { label: "cos φ(P)", pruefung: "Kennlinie P/Pmax 0 → cos φ 1, 0,5 → 1, 1,0 → 0,9 untererregt (Standard) abfahren; Q am Netzanschlusspunkt je Stützpunkt protokollieren." },
  qu: { label: "Q(U)", pruefung: "Spannung über Sollwertvorgabe oder Prüfquelle an den Stützpunkten 0,92/0,96/1,05/1,08 Un prüfen; PT1-Zeitkonstante (Standard 5 s): 95 % des Sollwerts innerhalb 3 τ." },
  qfix: { label: "Q fix", pruefung: "Festen Blindleistungssollwert vorgeben; Erreichen an der Messstelle innerhalb 1 min (ab 1 MW, Typ B) protokollieren." },
});

/**
 * Inbetriebnahme-Prüfplan: Sollwertsprünge 100/60/30/0 %, Q-Verfahren-Test und Rückfallwert.
 * Reine Funktion aus TOR-Standardwerten – keine Produktdaten. Richtwert/Orientierung; die
 * konkreten Prüfschritte und Toleranzen legt der Netzbetreiber im Betriebserlaubnisverfahren fest.
 */
export function pruefplan({ pmaxKw, qVerfahren = "qu", rueckfallProzent = 70, typ = "B", umrichter = true }) {
  const p = Number(pmaxKw);
  if (!(p > 0)) throw new Error("pmaxKw muss größer 0 sein");
  const rf = Math.min(100, Math.max(0, Number(rueckfallProzent)));
  const frist = umrichter ? "≤ 1 min (Umrichter) / ≤ 5 min (sonst)" : "≤ 5 min";
  const q = Q_VERFAHREN[qVerfahren] ?? Q_VERFAHREN.qu;
  const schritte = [
    {
      nr: 1,
      art: "vorbereitung",
      titel: "Vorgaben und Messkette prüfen",
      text: "Netzanschlussvertrag, Signalliste, Stützpunkte und Rückfallwert des Netzbetreibers in der Parametrierung gegenprüfen; Wandlerübersetzung und Phasenlage der Messung am Netzanschlusspunkt gegen die Verrechnungsmessung abgleichen.",
      nachweis: "Parameterauszug (maschinenlesbar), Messprotokoll",
    },
    ...PRUEFPLAN_STUFEN.map((stufe, i) => ({
      nr: 2 + i,
      art: "sollwertsprung",
      sollProzent: stufe,
      sollKw: Math.round((p * stufe) / 100),
      titel: `Sollwertsprung auf ${stufe} % Pmax`,
      text: `Sollwert ${stufe} % (${Math.round((p * stufe) / 100)} kW) über die Fernwirkschnittstelle vorgeben; Wirkleistung am Netzanschlusspunkt aufzeichnen: Verzögerung, Anschwing- und Einschwingzeit, Toleranzband.`,
      frist,
      nachweis: "Zeitverlauf P am Netzanschlusspunkt, Rückmeldung an Leitstelle",
    })),
    {
      nr: 2 + PRUEFPLAN_STUFEN.length,
      art: "q-verfahren",
      titel: `Blindleistungsverfahren ${q.label} prüfen`,
      text: q.pruefung,
      frist: typ === "B" ? "Q-Sollwert an der Messstelle ≤ 1 min (ab 1 MW)" : "laut Netzbetreiber",
      nachweis: "Zeitverlauf Q und U am Netzanschlusspunkt, Kennlinienprotokoll",
    },
    {
      nr: 3 + PRUEFPLAN_STUFEN.length,
      art: "rueckfall",
      sollProzent: rf,
      sollKw: Math.round((p * rf) / 100),
      titel: `Kommunikationsausfall: Rückfallwert ${rf} % Pmax`,
      text: `Verbindung zur Fernwirktechnik trennen; der Regler muss den Rückfallwert ${rf} % (${Math.round((p * rf) / 100)} kW) einnehmen. Backup-Versorgung der Kommunikation (≥ 30 min bei Online-Sollwerten) prüfen.`,
      frist: "laut Netzbetreiber (Rückfallzeit)",
      nachweis: "Zeitverlauf P, Ereignisliste des Reglers",
    },
    {
      nr: 4 + PRUEFPLAN_STUFEN.length,
      art: "abschluss",
      titel: "Dokumentation übergeben",
      text: "Prüfprotokoll, Parameterauszug und Konformitätserklärung nach Bestandteilen an Netzbetreiber und Betreiber übergeben; Unterlagen nach ÖVE/ÖNORM EN 62446-1 ablegen.",
      nachweis: "Prüfprotokoll, Konformitätserklärung",
    },
  ];
  return {
    pmaxKw: p,
    typ,
    qVerfahren: q.label,
    rueckfallProzent: rf,
    schritte,
    hinweis:
      "Richtwert/Orientierung aus den Standardwerten der TOR Stromerzeugungsanlagen (Typ A V1.4, Typ B V1.3). Verbindlich sind Netzanschlussvertrag und die Prüfschritte, die Ihr Netzbetreiber im Betriebserlaubnisverfahren vorgibt.",
    stand: DATENBLATT.stand,
  };
}
