// src/data/einwaende.js
//
// Einwände aus Verkaufsgesprächen mit Antwort, Beleg und nächstem Schritt (Welle A, Paket A03).
// Gezeigt von src/components/Verkauf/EinwandKarten.js (Akkordeon + FAQPage-Schema).
//
// Regeln: keine Herabsetzung von Mitbewerbern, keine Anbieternamen, keine Zusagen zu Fristen oder
// Preisen, nur Belege, die auf der Website nachvollziehbar sind (Links auf eigene Seiten oder
// Primärquellen). Der sichtbare Text ist zugleich der Text im FAQPage-Schema.
//
// gruppen: auf welchen Zielgruppenseiten der Einwand erscheint
//   gewerbe | landwirtschaft | kommunen | freiflaeche
// antwortJe (optional): eigene Antwort für einzelne Gruppen, z. B. für Gemeinden ohne
//   Öko-IFB/AfA-Argument (bei Gebietskörperschaften im Hoheitsbereich in der Regel nicht anwendbar).
//   einwaendeFuer() setzt die passende Antwort ein – Karte und Schema nutzen dieselbe.

/** Standardtitel der Einwand-Karten je Gruppe (Seiten können titel setzen oder titel={false}). */
export const EINWAND_TITEL = {
  gewerbe: "Was Betriebe uns entgegnen – und was wir antworten",
  landwirtschaft: "Was Höfe und Betriebe uns entgegnen – und was wir antworten",
  kommunen: "Was Gemeinden uns entgegnen – und was wir antworten",
  freiflaeche: "Was Grundeigentümer und Investoren uns entgegnen – und was wir antworten",
};

export const EINWAND_GRUPPEN = ["gewerbe", "landwirtschaft", "kommunen", "freiflaeche"];

const ALLE = EINWAND_GRUPPEN;

export const EINWAENDE = [
  {
    id: "zu-teuer",
    einwand: "Zu teuer.",
    antwort:
      "Entscheidend ist nicht die Investitionssumme, sondern der Preis je erzeugter Kilowattstunde über die Laufzeit. Rechnet man Investition und Betriebskosten auf die Erzeugung von 25 Jahren um, steht dieser Wert dem Netzbezugspreis gegenüber – mit allen Bestandteilen: Energie, Netz und Abgaben. Wer nicht aus der Liquidität investieren will, finanziert über Leasing oder Mietkauf; dann steht der monatlichen Rate die monatliche Ersparnis gegenüber.",
    beleg: "Rechenweg Stromgestehungskosten gegen Netzbezug im Gewerbe-PV-Rechner, Finanzierungsvarianten unter Service → Finanzierung.",
    belegHref: "/rechner/gewerbe-pv",
    schritt: { label: "Finanzierung vergleichen", href: "/service/finanzierung" },
    gruppen: ALLE,
  },
  {
    id: "netz-voll",
    einwand: "Unser Netz ist voll.",
    antwort:
      "Ein volles Netz betrifft die Einspeisung, nicht den Eigenverbrauch. Eine Anlage, die nach Ihrem Lastgang ausgelegt ist, nutzt den Strom im Betrieb, bevor er ins Netz geht. Was darüber hinausgeht, begrenzt ein Parkregler nach TOR Erzeuger am Netzanschlusspunkt; ein Speicher verschiebt Überschüsse in die Abendstunden. Ob und wie viel eingespeist werden darf, klärt eine Vorprüfung beim Netzbetreiber – vor der Planung, nicht danach.",
    beleg: "Netzanschluss nach TOR Erzeuger Typ A/B, Einspeisebegrenzung über den Parkregler (Technik → Parkregler).",
    belegHref: "/technik/parkregler",
    schritt: { label: "Netzanmeldung vorbereiten", href: "/netzanmeldung" },
    gruppen: ALLE,
  },
  {
    id: "dach-alt",
    einwand: "Unser Dach ist alt.",
    antwort:
      "Dann prüfen wir zuerst Statik und Dachhaut. Ein Dach, das in zehn Jahren saniert werden muss, trägt keine Anlage mit 25 Jahren Laufzeit. Ist eine Sanierung nötig, koordinieren wir sie mit dem Dachdecker, damit Abdichtung, Durchdringungen und Unterkonstruktion zusammenpassen. Oft ist der Zeitpunkt der Sanierung der beste Zeitpunkt für Photovoltaik.",
    beleg: "Schneelast-Richtwert je Standort unter Schneelast, Prüfung der Dachfläche unter Flächen-Check.",
    belegHref: "/schneelast",
    schritt: { label: "Dachfläche prüfen lassen", href: "/flaechen-check" },
    gruppen: ["gewerbe", "landwirtschaft", "kommunen"],
  },
  {
    id: "foerderung-unsicher",
    einwand: "Die Förderung ist unsicher.",
    antwort:
      "Deshalb rechnen wir jedes Projekt mit und ohne Zuschuss. Die Förderung verbessert die Rendite, sie darf das Projekt aber nicht tragen: Rechnet sich das Projekt nur mit Förderung, sagen wir Ihnen das. Welche Programme für Ihr Vorhaben in Frage kommen – EAG-Investitionszuschuss, Landesförderungen, Öko-Investitionsfreibetrag –, zeigt der Fördercheck.",
    beleg: "Termine und Bedingungen des EAG-Fördercalls laut EAG-Abwicklungsstelle, Stand auf der Seite zum Fördercall.",
    belegHref: "/forderungen/eag-foerdercall",
    schritt: { label: "Fördercheck starten", href: "/foerdercheck" },
    gruppen: ALLE,
  },
  {
    id: "amortisation",
    einwand: "Die Amortisation ist zu lang.",
    antwort:
      "Die statische Amortisation sagt wenig über die Rendite aus. Aussagekräftiger ist der interne Zinsfuß über 25 Jahre – und der Vergleich mit dem, was das Kapital sonst erwirtschaftet: Festgeld, Kredittilgung, eine Maschine. Dazu kommen Öko-Investitionsfreibetrag und Abschreibung, die im ersten Jahr wirken. Wir zeigen Ihnen beide Zahlen und den Rechenweg.",
    beleg: "Interner Zinsfuß, Cashflow und Amortisation je Eingabe im Gewerbe-PV-Rechner, Annahmen offengelegt.",
    belegHref: "/rechner/gewerbe-pv",
    schritt: { label: "Rendite berechnen", href: "/rechner/gewerbe-pv" },
    gruppen: ["gewerbe", "landwirtschaft", "freiflaeche"],
  },
  {
    id: "strompreise",
    einwand: "Strompreise fallen wieder.",
    antwort:
      "Möglich – deshalb rechnen wir den Fall durch: Im Gewerbe-PV-Rechner lässt sich die Anlage mit einem Strompreis von minus 30 Prozent und einem Ertrag von minus 10 Prozent rechnen. Steht sie dann noch, ist die Entscheidung robust. Außerdem besteht Ihr Strompreis aus Energie, Netz und Abgaben: Fällt der Energiepreis, bleiben Netzentgelte und Abgaben, die Sie mit jeder selbst erzeugten Kilowattstunde ebenfalls vermeiden.",
    beleg: "Stresstest mit Strompreis −30 % und Ertrag −10 % im Gewerbe-PV-Rechner.",
    belegHref: "/rechner/gewerbe-pv",
    schritt: { label: "Stresstest rechnen", href: "/rechner/gewerbe-pv" },
    gruppen: ["gewerbe", "landwirtschaft", "freiflaeche"],
  },
  {
    id: "technik-warten",
    einwand: "Wir warten auf bessere Technik.",
    antwort:
      "Module werden seit Jahren in kleinen Schritten effizienter. Jedes Jahr Warten kostet aber die gesamte Stromersparnis dieses Jahres – und die holt ein Wirkungsgradgewinn von einem Prozentpunkt nicht zurück. Dazu kommt: Der erhöhte Öko-Investitionsfreibetrag von 22 Prozent gilt nur für Anschaffungen bis 31.12.2026. Was Warten konkret kostet, rechnen wir mit Ihren Zahlen vor.",
    beleg: "Öko-Investitionsfreibetrag 22 % bis 31.12.2026, danach 15 % (Wirtschaftskammer Österreich).",
    belegHref: "https://www.wko.at/steuern/investitionsfreibetrag",
    schritt: { label: "Kosten des Wartens ansehen", href: "/rechner/gewerbe-pv#kosten-des-wartens" },
    gruppen: ["gewerbe", "landwirtschaft", "kommunen"],
  },
  {
    id: "keine-zeit",
    einwand: "Keine Zeit für so ein Projekt.",
    antwort:
      "Netzanmeldung, Förderantrag und Statik übernehmen wir. Von Ihnen brauchen wir drei Dinge: den Lastgang (Viertelstundenwerte vom Netzbetreiber), die letzten Stromrechnungen und Pläne des Gebäudes. Alles Weitere – Netzbetreiber, Behörden, Fördergeber – läuft über eine Ansprechperson bei uns.",
    beleg: "Checkliste mit allen Unterlagen für die Netzanmeldung.",
    belegHref: "/netzanmeldung/checkliste",
    schritt: { label: "Checkliste ansehen", href: "/netzanmeldung/checkliste" },
    gruppen: ALLE,
  },
  {
    id: "contracting",
    einwand: "Warum nicht Contracting oder Pacht statt Kauf?",
    antwort:
      "Beides kann passen – der Unterschied liegt im Eigentum. Beim Kauf gehören Anlage, Strom und Daten Ihnen; Öko-Investitionsfreibetrag und Abschreibung stehen nur dem Eigentümer zu. Beim Contracting zahlen Sie einen vereinbarten Strompreis ohne eigene Investition, beim Pachtmodell stellen Sie die Fläche und beziehen Strom nach Vertrag. Wir vergleichen die drei Wege neutral mit Ihren Zahlen – ohne Anbieternamen und ohne Vorfestlegung.",
    antwortJe: {
      kommunen:
        "Beides kann passen – der Unterschied liegt im Eigentum. Beim Kauf gehören Anlage, Strom und Daten der Gemeinde; die Investition läuft über Haushalt und Gemeinderatsbeschluss. Beim Contracting zahlt die Gemeinde einen vereinbarten Strompreis ohne eigene Investition, beim Pachtmodell stellt sie die Fläche und bezieht Strom nach Vertrag – mit jeweils eigenen Fragen zu Vergabe, Laufzeit und Haushalt. Wir vergleichen die drei Wege neutral mit Ihren Zahlen – ohne Anbieternamen und ohne Vorfestlegung.",
    },
    beleg: "Finanzierungs- und Betreibermodelle im Vergleich unter Service → Finanzierung.",
    belegHref: "/service/finanzierung",
    schritt: { label: "Modelle vergleichen", href: "/service/finanzierung" },
    gruppen: ALLE,
  },
  {
    id: "servicepartner",
    einwand: "Was, wenn wir später einen anderen Servicepartner wollen?",
    antwort:
      "Dann bleibt die Anlage für Sie offen. Der Regler bindet Wechselrichter über offene Schnittstellen an – Modbus TCP und SunSpec-Informationsmodelle –, und Sie erhalten die Parameterdokumentation Ihrer Anlage. Ein anderer Betrieb kann Wartung und Betrieb damit übernehmen; wir binden niemanden über die Technik.",
    beleg: "Protokolle laut Technik-Seite Parkregler: Modbus TCP, SunSpec.",
    belegHref: "/technik/parkregler",
    schritt: { label: "Technik ansehen", href: "/technik/parkregler" },
    gruppen: ["gewerbe", "kommunen", "freiflaeche"],
  },
  {
    id: "entfernung",
    einwand: "Ostermiething ist weit weg – wer kommt im Störfall?",
    antwort:
      "Die meisten Störungen sehen wir, bevor Sie anrufen: Parkregler, Fernwartung und SCADA mit unserem Technologiepartner Solensa – parametriert, betreut und gewartet von uns – melden Abweichungen, viele lassen sich aus der Ferne beheben. Für alles andere fahren unsere Monteure; unsere Referenzen reichen von Oberösterreich bis Vorarlberg.",
    beleg: "Referenzprojekte bis Vorarlberg (Referenzliste, ohne Firmennamen bis zur Freigabe); Fernwartung siehe Technik → Parkregler.",
    belegHref: "/referenzen/projekte",
    schritt: { label: "Referenzen ansehen", href: "/referenzen/projekte" },
    gruppen: ALLE,
  },
  {
    id: "drei-angebote",
    einwand: "Wir haben schon drei Angebote.",
    antwort:
      "Gut – dann vergleichen Sie sie an denselben Punkten: Ertragsannahme je kWp und ihre Quelle, Netzanschluss (wer meldet an, welcher TOR-Typ), Regler und Monitoring, Garantiegeber für Module und Wechselrichter, Wartung und Reaktionszeiten, und was im Preis nicht enthalten ist. Unser Angebot legen wir entlang dieser Punkte offen; die Angebote anderer bewerten wir nicht.",
    beleg: "Prüfpunkte im Ratgeber „Photovoltaik-Angebot vergleichen“.",
    belegHref: "/ratgeber/photovoltaik-angebot-vergleichen",
    schritt: { label: "Prüfpunkte ansehen", href: "/ratgeber/photovoltaik-angebot-vergleichen" },
    gruppen: ALLE,
  },
];

/**
 * Einwände für eine Zielgruppe; `ids` schränkt auf diese Einwände ein (Reihenfolge der ids).
 * Unbekannte ids und Einwände außerhalb der Gruppe fallen weg.
 */
export function einwaendeFuer(gruppe, ids) {
  const inGruppe = EINWAENDE.filter((e) => !gruppe || e.gruppen.includes(gruppe)).map((e) =>
    gruppe && e.antwortJe?.[gruppe] ? { ...e, antwort: e.antwortJe[gruppe] } : e
  );
  if (!Array.isArray(ids) || !ids.length) return inGruppe;
  return ids.map((id) => inGruppe.find((e) => e.id === id)).filter(Boolean);
}

/** Sichtbarer Antworttext (Antwort, Beleg, nächster Schritt) – identisch im Schema. */
export const einwandAntwortText = (e) => `${e.antwort} Beleg: ${e.beleg} Nächster Schritt: ${e.schritt.label}.`;

/** FAQPage-Schema nur für die übergebenen (sichtbaren) Einwände; null ohne Einträge. */
export function einwaendeSchema(liste) {
  if (!liste?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: liste.map((e) => ({
      "@type": "Question",
      name: e.einwand,
      acceptedAnswer: { "@type": "Answer", text: einwandAntwortText(e) },
    })),
  };
}
