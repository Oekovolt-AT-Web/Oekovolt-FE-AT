// src/components/Repowering/tarifRechnung.js
//
// Rechenkern des Tarifauslauf-Radars (reines JS ohne JSX, damit scripts/bestand-service.test.mjs
// ihn mit Node prüfen kann). Die Komponente TarifAuslauf.js stellt nur dar.
// (Eigener Dateiname in Kleinschreibung reicht auf Windows nicht – das Dateisystem unterscheidet
// TarifAuslauf.js und tarifAuslauf.js nicht.)
//
// Grundlage: Einspeisetarifverträge nach dem Ökostromgesetz 2012 wurden für Photovoltaik über
// 13 Jahre abgeschlossen (§ 16 Abs. 1 ÖSG 2012; Kontrahierungspflicht der OeMAG). Ältere Verträge
// nach den Ökostromverordnungen 2006–2011 hatten teils abweichende Laufzeiten – der Vertrag selbst
// ist maßgeblich. Alle Ausgaben sind Richtwerte zur Orientierung.

export const TARIF_JAHRE = 13;
export const JETZT = { jahr: 2026, monat: 10 };
export const ERTRAG_JE_KWP = 1000; // kWh je kWp und Jahr – Richtwert Österreich, Bestandsanlage
export const DEGRADATION_PRO_JAHR = 0.005; // Annahme: 0,5 % je Jahr
export const WR_LEBENSDAUER = { von: 10, bis: 15 }; // Jahre, typisch

export const QUELLEN = [
  { titel: "Ökostromgesetz 2012, § 16 – Kontrahierungspflicht und Vertragsdauer (13 Jahre Photovoltaik)", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007386" },
  { titel: "OeMAG – Marktpreis und Vertragsregeln nach Tarifende", href: "https://www.oem-ag.at/marktpreis" },
  { titel: "Erneuerbaren-Ausbau-Gesetz § 56 – Investitionszuschuss für Erweiterung und Speicher", href: "https://www.jusline.at/gesetz/eag/paragraf/56" },
];

const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
export const monatName = (m) => MONATE[Math.min(11, Math.max(0, (m || 1) - 1))];

/**
 * @param {{ jahr:number, monat?:number, kwp:number, jetzt?:{jahr:number,monat:number} }} e
 */
export function tarifAuslauf({ jahr, monat = 7, kwp = 0, jetzt = JETZT }) {
  const j = Math.round(Number(jahr) || jetzt.jahr);
  const m = Math.min(12, Math.max(1, Math.round(Number(monat) || 7)));
  const ende = { jahr: j + TARIF_JAHRE, monat: m };
  const restMonate = (ende.jahr - jetzt.jahr) * 12 + (ende.monat - jetzt.monat);
  const alterJahre = Math.max(0, jetzt.jahr - j + (jetzt.monat - m) / 12);
  const phase = restMonate <= 0 ? "abgelaufen" : restMonate <= 24 ? "bald" : "laeuft";
  const ertragRichtwert = Math.max(0, Number(kwp) || 0) * ERTRAG_JE_KWP * Math.max(0.7, 1 - DEGRADATION_PRO_JAHR * alterJahre);

  const wrAlt = alterJahre >= WR_LEBENSDAUER.von;
  const optionen = [
    {
      id: "repowering",
      titel: "Repowering",
      passt: alterJahre >= 12 ? "empfohlen" : alterJahre >= 8 ? "moeglich" : "bedingt",
      grund:
        alterJahre >= 12
          ? "Module und Wechselrichter sind im typischen Tauschalter; neue Module bringen auf gleicher Fläche deutlich mehr Leistung."
          : alterJahre >= 8
            ? "Noch kein Muss – sinnvoll, wenn der Wechselrichter ausfällt oder der Strombedarf steigt."
            : "Anlage ist jung; Tausch erst bei Defekt oder Dachsanierung.",
    },
    {
      id: "speicher",
      titel: "Speicher nachrüsten",
      passt: phase !== "laeuft" ? "empfohlen" : "moeglich",
      grund:
        phase !== "laeuft"
          ? "Nach dem Tarif zählt Eigenverbrauch; ein Speicher verschiebt Überschuss in Abend und Nacht."
          : "Lohnt sich bereits bei hohem Abendverbrauch; EAG-Speicherförderung nur zusammen mit PV-Erweiterung.",
    },
    {
      id: "eigenverbrauch",
      titel: "Auf Eigenverbrauch umstellen",
      passt: phase === "laeuft" ? "moeglich" : "empfohlen",
      grund:
        phase === "laeuft"
          ? "Messkonzept und Zähler rechtzeitig vor dem Tarifende mit dem Netzbetreiber umstellen."
          : "Volleinspeiser nutzen den Strom künftig selbst und speisen nur den Überschuss ein – jede kWh ersetzt Netzbezug.",
    },
    {
      id: "direktvermarktung",
      titel: "Direktvermarktung",
      passt: kwp >= 100 ? "empfohlen" : "moeglich",
      grund:
        kwp >= 500
          ? "Ab 500 kWp ist der OeMAG-Marktpreis nicht möglich – Überschuss über Direktvermarkter oder Stromhändler verkaufen."
          : kwp >= 100
            ? "Ab etwa 100 kWp lohnt der Vergleich: OeMAG-Marktpreis, Stromhändler oder Direktvermarkter mit Spotmarkt-Erlös."
            : "Kleinere Anlagen verkaufen den Überschuss meist an die OeMAG zum Marktpreis oder an den Stromhändler.",
    },
  ];

  return { eingabe: { jahr: j, monat: m, kwp: Number(kwp) || 0 }, ende, restMonate, restJahre: restMonate / 12, alterJahre, phase, wrAlt, ertragRichtwert, optionen };
}

/** „noch 2 Jahre und 3 Monate“ bzw. „seit 1 Jahr und 4 Monaten abgelaufen“ (nach „seit“ im Dativ) */
export function restText(restMonate) {
  const abs = Math.abs(restMonate);
  const j = Math.floor(abs / 12);
  const m = abs % 12;
  const vorbei = restMonate <= 0;
  const teile = [];
  if (j) teile.push(`${j} ${j === 1 ? "Jahr" : vorbei ? "Jahren" : "Jahre"}`);
  if (m) teile.push(`${m} ${m === 1 ? "Monat" : vorbei ? "Monaten" : "Monate"}`);
  const text = teile.join(" und ") || (vorbei ? "wenigen Wochen" : "wenige Wochen");
  return vorbei ? `seit ${text} abgelaufen` : `noch ${text}`;
}
