// src/components/KommunenVergabe/amtsvortrag.js
//
// Amtsvortrag-Generator für Gemeinden (Welle B, Paket B09): aus wenigen Angaben entsteht ein
// neutraler Entwurf für die Sitzungsvorlage – Sachverhalt, Rechtsgrundlage, Antrag, Beilagen.
// Reine Funktionen ohne React, mit node testbar (scripts/kommunen-werkzeuge.test.mjs).
//
// Grundsätze:
//  - Keine Rechtsberatung; der Text ist ein Entwurf, den Amtsleitung und Rechtsberatung prüfen.
//  - Neutral: kein Auftragnehmer wird vorweggenommen („ein befugtes Elektrotechnikunternehmen“).
//  - Wertgrenzen der Gemeindeordnung bleiben Platzhalter (Landesrecht, je Bundesland verschieden).
//  - Vergabeverfahren und Pflichten aus src/lib/kommunen/vergabe.js (BVergG 2018 idF 2026).
//  - Förderplan nur mit aktiven Fristen (Programme übergibt die Komponente – siehe foerderungenAktiv).
//
// Rechtsquellen (geprüft am 11.10.2026; RIS an diesem Tag nicht erreichbar – HTTP 503 –, Gesetzestext
// daher über die RIS-Spiegelung von JUSLINE; Zitat § 68 Abs. 6 ElWG wörtlich übernommen):
//  - § 68 Abs. 6 ElWG, BGBl. I Nr. 91/2025: https://www.jusline.at/gesetz/elwg/paragraf/68
//  - §§ 13, 43, 46, 47 BVergG 2018 idF BGBl. I Nr. 8/2026 (siehe src/lib/kommunen/vergabe.js)
//  - § 4 Abs. 1 Z 5 EAG-IZV (Vergaberecht als Fördervoraussetzung): https://www.jusline.at/gesetz/eag-izv/paragraf/4
//  - §§ 2, 3 KIG 2025 idF BGBl. I Nr. 25/2025: https://www.jusline.at/gesetz/kig_2025/gesamt

import { ARTEN, AUFTRAGGEBER, DREI_ANGEBOTE_AB, euro, vergabeWege } from "../../lib/kommunen/vergabe.js";

export const AMTSVORTRAG_STAND = { iso: "2026-10-11", label: "11.10.2026" };

/** Lead-Gate-Kennung für Druck/Download (Übergabe an B03 für src/data/leadRechner.js). */
export const GATE_KENNUNG = "gemeinderat-vorlage";

/** § 68 Abs. 6 ElWG – Wortlaut (JUSLINE, 11.10.2026). */
export const ELWG_68_6 = {
  norm: "§ 68 Abs. 6 ElWG (BGBl. I Nr. 91/2025)",
  zitat:
    "Sofern eine Gebietskörperschaft mit einer Stromerzeugungsanlage, die im Eigentum der Gebietskörperschaft steht, an der gemeinsamen Energienutzung teilnimmt, hat die Gebietskörperschaft sicherzustellen, dass schutzbedürftige Haushalte gemäß § 7 Abs. 1 Z 1 EnDG an der gemeinsamen Energienutzung teilnehmen können und für diese schutzbedürftigen Haushalte oder für karitative oder soziale Einrichtungen, die schutzbedürftige Endkundinnen und Endkunden beherbergen, zumindest 10% der jährlich durch die Stromerzeugungsanlage für die Zwecke der gemeinsamen Energienutzung erzeugten und eingespeisten Strommengen zur Verfügung stehen.",
  gilt: "ab 01.10.2026",
  geprueft: "11.10.2026 (JUSLINE; RIS nicht erreichbar)",
  url: "https://www.jusline.at/gesetz/elwg/paragraf/68",
};

export const ORGANE = [
  { id: "gemeinderat", label: "Gemeinderat", anrede: "Der Gemeinderat" },
  { id: "vorstand", label: "Gemeindevorstand / Stadtrat / Stadtsenat", anrede: "Der Gemeindevorstand" },
  { id: "buergermeister", label: "Bürgermeisterin / Bürgermeister", anrede: "Die Bürgermeisterin / der Bürgermeister" },
];

export const BEDECKUNGEN = [
  { id: "voranschlag", label: "Voranschlag des laufenden Jahres", text: "im Voranschlag [Jahr], Ansatz/Konto [__], vorgesehen" },
  { id: "nachtrag", label: "Nachtragsvoranschlag", text: "durch Nachtragsvoranschlag [Jahr], Ansatz/Konto [__], sicherzustellen" },
  { id: "ruecklage", label: "Rücklage", text: "aus der Rücklage [Bezeichnung] zu entnehmen" },
  { id: "kig", label: "Mittel nach dem KIG 2025", text: "aus der Finanzzuweisung nach dem Kommunalinvestitionsgesetz 2025 (§ 2 KIG 2025) zu bedecken" },
  { id: "darlehen", label: "Darlehen", text: "durch Darlehensaufnahme (Laufzeit [__] Jahre) zu finanzieren – aufsichtsbehördliche Genehmigung nach Landesrecht prüfen" },
  { id: "contracting", label: "Contracting / Leasing", text: "ohne eigenes Investitionsbudget über ein Contracting- bzw. Leasingmodell abzubilden – laufende Entgelte im Voranschlag vorsehen" },
];

export const EEG_ROLLEN = [
  { id: "keine", label: "Keine Energiegemeinschaft", text: "" },
  { id: "mitglied", label: "Mitglied einer bestehenden Energiegemeinschaft", text: "Die Gemeinde beteiligt sich mit der Anlage an der bestehenden Energiegemeinschaft [Name]." },
  { id: "gruenderin", label: "Gründerin einer neuen Energiegemeinschaft", text: "Die Gemeinde gründet mit [Partnern] eine Erneuerbare-Energie-Gemeinschaft; die Anlage wird in die gemeinsame Energienutzung eingebracht." },
  { id: "betreiberin", label: "Betreiberin: Anlage speist in die gemeinsame Energienutzung ein", text: "Die Gemeinde bringt die Anlage in ihrem Eigentum in die gemeinsame Energienutzung ein." },
];

/**
 * Förderprogramme für den Förderplan im Amtsvortrag (Stand 11.10.2026). Fristen wie
 * src/data/foerderFristen.js (geprüft 11.10.2026) bzw. src/components/KommunenVergabe/inhalte.js.
 * Nur Programme, deren Einreichung am Stichtag läuft, erscheinen im Generator (foerderungenAktiv).
 */
export const PROGRAMME = [
  {
    id: "eag",
    titel: "EAG-Investitionszuschuss Photovoltaik und Speicher",
    traeger: "EAG-Förderabwicklungsstelle (OeMAG)",
    startIso: "2026-10-08",
    fristIso: "2026-10-22",
    kurz: "3. Fördercall 2026: Ticketziehung 08.10., Einreichung bis 22.10.2026 im EAG-Portal; Antrag vor der Inbetriebnahme",
    norm: "Erneuerbaren-Ausbau-Gesetz (EAG) und EAG-Investitionszuschüsseverordnung-Strom; Einhaltung des Vergaberechts ist Fördervoraussetzung (§ 4 Abs. 1 Z 5 EAG-IZV)",
    quelle: { label: "EAG-Förderabwicklungsstelle – Förderkalender", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/" },
  },
  {
    id: "kig",
    titel: "Kommunalinvestitionsgesetz 2025 (KIG 2025)",
    traeger: "Bund – Finanzzuweisung an die Gemeinden",
    startIso: "2024-09-15",
    fristIso: "2028-12-31",
    kurz: "Finanzzuweisung ohne Antrag und ohne Eigenanteil für Projekte mit Beginn 15.09.2024–31.12.2028; Bericht an den Gemeinderat",
    norm: "§§ 2, 3 KIG 2025 idF BGBl. I Nr. 25/2025 (Mittelverwendung, Bericht an den Gemeinderat und Veröffentlichung)",
    quelle: { label: "KIG 2025 (JUSLINE)", url: "https://www.jusline.at/gesetz/kig_2025/gesamt" },
  },
  {
    id: "ge2026",
    titel: "Klimafonds „Gemeinsame Energienutzung 2026“",
    traeger: "Klima- und Energiefonds / KPC",
    startIso: "2026-10-01",
    fristIso: "2027-03-10",
    kurz: "Einreichung 01.10.2026 bis 10.03.2027, 12 Uhr – für Energiegemeinschaften und Gemeinden",
    norm: "Leitfaden „Gemeinsame Energienutzung 2026“ des Klima- und Energiefonds",
    quelle: { label: "Klima- und Energiefonds – Gemeinsame Energienutzung 2026", url: "https://www.klimafonds.gv.at/foerderung/gemeinsame-energienutzung-2026/" },
  },
  {
    id: "flex",
    titel: "Klimafonds „Energiemanagement – Flexibilisierung im Verteilnetz“",
    traeger: "Klima- und Energiefonds / KPC",
    startIso: "2026-06-23",
    fristIso: "2027-04-15",
    kurz: "Einreichung 23.06.2026 bis 15.04.2027 – Energiemanagementsysteme für Gemeinden an Netzebene 6/7",
    norm: "Leitfaden „Energiemanagement – Flexibilisierung im Verteilnetz“ des Klima- und Energiefonds",
    quelle: { label: "Klima- und Energiefonds – Energiemanagement 2026", url: "https://www.klimafonds.gv.at/foerderung/energiemanagement-betriebe-2026/" },
  },
];

/** Reihung von Förderprogrammen: nur aktive Fristen (Einreichung läuft am Stichtag). */
export function foerderungenAktiv(programme = [], heuteIso = AMTSVORTRAG_STAND.iso) {
  return (Array.isArray(programme) ? programme : []).filter((p) => {
    if (!p || !p.id) return false;
    const start = p.startIso || "0000-00-00";
    const ende = p.fristIso || "9999-12-31";
    return start <= heuteIso && heuteIso <= ende;
  });
}

const zahl = (v) => {
  const n = typeof v === "string" ? Number(String(v).replace(/\./g, "").replace(",", ".")) : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const deZahl = (n) => {
  const x = Math.round(Number(n));
  return Number.isFinite(x) ? String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
};

const liegenschaftenText = (liste) => {
  const l = (Array.isArray(liste) ? liste : String(liste || "").split(/[\n;,]/)).map((x) => String(x).trim()).filter(Boolean);
  if (!l.length) return "[Liegenschaft(en)]";
  if (l.length === 1) return l[0];
  return `${l.slice(0, -1).join(", ")} und ${l[l.length - 1]}`;
};

/**
 * Entwurf erzeugen.
 * @param {object} e Eingaben: { gemeinde, liegenschaften, kwp, speicherKwh, ertragKwh?, auftragswert, auftraggeber, art,
 *   verfahrenId?, organ, bedeckung, bedeckungText?, foerderungen: string[], eegRolle, kontakt? }
 * @param {object} o { heute, programme: [{ id, titel, traeger, fristIso, startIso, kurz, norm }] }
 * @returns {{ titel, untertitel, abschnitte: [{ id, titel, absaetze: string[], liste?: string[] }], beilagen: string[], hinweise: string[], vergabe, platzhalter: number }}
 */
export function amtsvortragErzeugen(e = {}, { heute = AMTSVORTRAG_STAND.iso, programme = PROGRAMME } = {}) {
  const gemeinde = String(e.gemeinde || "").trim() || "[Gemeinde]";
  const kwp = zahl(e.kwp);
  const speicher = zahl(e.speicherKwh);
  const ertrag = zahl(e.ertragKwh);
  const wert = zahl(e.auftragswert);
  const auftraggeber = AUFTRAGGEBER.some((a) => a.id === e.auftraggeber) ? e.auftraggeber : "klassisch";
  const art = ARTEN.some((a) => a.id === e.art) ? e.art : "bau";
  const artLabel = ARTEN.find((a) => a.id === art).label;
  const organ = ORGANE.find((o) => o.id === e.organ) || ORGANE[0];
  const bedeckung = BEDECKUNGEN.find((b) => b.id === e.bedeckung) || BEDECKUNGEN[0];
  const eeg = EEG_ROLLEN.find((r) => r.id === e.eegRolle) || EEG_ROLLEN[0];
  const liegenschaften = liegenschaftenText(e.liegenschaften);

  const vergabe = wert > 0 ? vergabeWege({ auftraggeber, art, wert }) : null;
  const zulaessig = vergabe ? vergabe.wege.filter((w) => w.zulaessig) : [];
  const verfahren = zulaessig.find((w) => w.id === e.verfahrenId) || zulaessig[0] || null;

  const aktiv = foerderungenAktiv(programme, heute).filter((p) => (Array.isArray(e.foerderungen) ? e.foerderungen : []).includes(p.id));

  const anlage = `${kwp > 0 ? `rund ${deZahl(kwp)} kWp` : "[__ kWp]"}${speicher > 0 ? ` mit Stromspeicher rund ${deZahl(speicher)} kWh` : ""}`;

  // Sachverhalt
  const sachverhalt = [
    `Die ${gemeinde} beabsichtigt, auf ${liegenschaften} eine Photovoltaikanlage mit ${anlage} zu errichten.${ertrag > 0 ? ` Der erwartete Jahresertrag liegt bei rund ${deZahl(ertrag)} kWh (Grobabschätzung mit typisierten Profilen, Richtwert).` : ""} Der erzeugte Strom wird vorrangig in den Gebäuden der Gemeinde genutzt${eeg.id !== "keine" ? "; Überschüsse sollen in einer Energiegemeinschaft im Gemeindegebiet verwertet werden" : "; Überschüsse werden in das öffentliche Netz eingespeist"}.`,
    `Der geschätzte Auftragswert beträgt ${wert > 0 ? euro(wert) : "[__ €]"} netto (Gesamtwert aller zum Vorhaben gehörigen Leistungen einschließlich Optionen, ohne Umsatzsteuer; sachkundig ermittelt am [Datum] auf Basis von [Kostenschätzung/Preisauskünften]).`,
    `Die Leistung wird nach ihrem Hauptgegenstand als ${artLabel} eingeordnet. Begründung: [z. B. überwiegend Lieferung und Montage von Modulen, Wechselrichtern und Speicher / überwiegend Bauleistungen an Dach und Tragkonstruktion].`,
  ];
  if (eeg.text) sachverhalt.push(eeg.text);

  // Rechtsgrundlage
  const rechtsgrundlage = [];
  rechtsgrundlage.push(`Bundesvergabegesetz 2018 (BVergG 2018) in der Fassung des Vergaberechtsgesetzes 2026, BGBl. I Nr. 8/2026: Schätzung des Auftragswerts nach § 13 (Gesamtwert ohne Umsatzsteuer, keine Aufteilung zur Umgehung).`);
  if (vergabe && verfahren) {
    rechtsgrundlage.push(
      `Verfahren: ${verfahren.name} (${verfahren.norm})${verfahren.grenze != null ? ` – zulässig, weil der geschätzte Auftragswert von ${euro(wert)} unter ${euro(verfahren.grenze)} liegt` : ""}.`
    );
    for (const p of vergabe.pflichten) rechtsgrundlage.push(p);
  } else {
    rechtsgrundlage.push("Verfahren: [Auftragswert eingeben – der Entwurf ergänzt das zulässige Verfahren nach §§ 43, 46, 47 BVergG].");
  }
  rechtsgrundlage.push(
    `Zuständigkeit: ${organ.label} nach § [__] der Gemeindeordnung [Bundesland] – Wertgrenze [__ €] laut Gemeindeordnung bzw. Stadtrecht; Mittelverwendung nach dem Haushaltsrecht des Landes (VRV 2015).`
  );
  for (const p of aktiv) rechtsgrundlage.push(`${p.titel}: ${p.norm || p.kurz}`);
  if (eeg.id === "betreiberin" || eeg.id === "gruenderin") {
    rechtsgrundlage.push(
      `${ELWG_68_6.norm}, ${ELWG_68_6.gilt}: Nimmt die Gemeinde mit einer Anlage in ihrem Eigentum an der gemeinsamen Energienutzung teil, hat sie sicherzustellen, dass schutzbedürftige Haushalte (§ 7 Abs. 1 Z 1 EnDG) teilnehmen können und ihnen bzw. karitativen oder sozialen Einrichtungen zumindest 10 % der jährlich für die gemeinsame Energienutzung erzeugten und eingespeisten Strommenge zur Verfügung stehen.`
    );
  }

  // Antrag
  const antrag = [];
  antrag.push(`Die Errichtung einer Photovoltaikanlage mit ${anlage} auf ${liegenschaften} wird genehmigt.`);
  antrag.push(
    `Der geschätzte Auftragswert von ${wert > 0 ? euro(wert) : "[__ €]"} netto wird zur Kenntnis genommen. Die Vergabe erfolgt ${verfahren ? `im Wege der ${verfahren.name} (${verfahren.norm})` : "nach dem gewählten Verfahren des BVergG"}${wert > DREI_ANGEBOTE_AB && verfahren?.id === "direkt" ? ` unter Einholung von mindestens drei Angeboten oder Preisauskünften` : ""} an ein befugtes Elektrotechnikunternehmen mit Gewerbeberechtigung; die Vergabe wird dokumentiert.`
  );
  antrag.push(`Die Bedeckung erfolgt ${bedeckung.text}${e.bedeckungText ? ` (${String(e.bedeckungText).trim()})` : ""}.`);
  if (aktiv.length) {
    antrag.push(`Die Bürgermeisterin / der Bürgermeister wird ermächtigt, die Förderanträge zu stellen: ${aktiv.map((p) => `${p.titel} (${p.kurz})`).join("; ")}. Reihenfolge beachten: Antrag vor Inbetriebnahme bzw. vor der ersten verbindlichen Bestellung, soweit das Programm es verlangt.`);
  }
  if (eeg.id !== "keine") {
    antrag.push(
      eeg.id === "mitglied"
        ? "Die Gemeinde tritt mit der Anlage der Energiegemeinschaft [Name] bei; die Bürgermeisterin / der Bürgermeister wird ermächtigt, die Beitrittsvereinbarung zu unterzeichnen."
        : `Die Anlage wird in die gemeinsame Energienutzung eingebracht. Die Gemeinde stellt den Zugang schutzbedürftiger Haushalte und den Anteil von zumindest 10 % der jährlich dafür erzeugten und eingespeisten Strommenge sicher (${ELWG_68_6.norm}); Preise und Bedingungen werden gesondert beschlossen.`
    );
  }
  antrag.push(`Die Bürgermeisterin / der Bürgermeister wird ermächtigt, nach Abschluss des Vergabeverfahrens den Auftrag bis zu einem Betrag von [__ €] zu erteilen und die Fertigstellungsmeldung an den Netzbetreiber sowie die Förderabrechnung zu veranlassen.`);

  // Beilagen
  const beilagen = [
    "Liegenschaftsliste mit Dachflächen, Dachzustand und Rangfolge (z. B. aus dem Liegenschafts-Check)",
    "Verbrauchsdaten der Zählpunkte und Ertragsabschätzung",
    "Kostenschätzung netto/brutto mit Datum und Grundlage",
    "Vergabevermerk: Einordnung Bau-/Lieferauftrag, geschätzter Auftragswert (§ 13 BVergG), gewähltes Verfahren",
  ];
  if (wert > DREI_ANGEBOTE_AB) beilagen.push("Eingeholte Angebote bzw. unverbindliche Preisauskünfte (§ 46 Abs. 4 BVergG)");
  beilagen.push("Funktionale Leistungsbeschreibung und Bewertungsmatrix (Muster unter /vorlagen)");
  beilagen.push("Netzzugangsauskunft bzw. Anschlusszusage des Netzbetreibers");
  if (aktiv.length) beilagen.push(`Förderplan mit Fristen: ${aktiv.map((p) => p.titel).join(", ")}`);
  beilagen.push("Bedeckungsnachweis (Voranschlag, Rücklage, KIG-Mittel oder Finanzierungsangebot)");
  if (eeg.id !== "keine") beilagen.push("Entwurf Statuten bzw. Beitrittsvereinbarung der Energiegemeinschaft, Tarifmodell inkl. Anteil für schutzbedürftige Haushalte");
  beilagen.push("Baurechtliche Anzeige/Bewilligung, ggf. Ortsbild- oder Denkmalschutz (Landesrecht)");

  const hinweise = [
    "Keine Rechtsberatung: Entwurf zur Vorbereitung der Sitzungsvorlage. Zuständigkeiten, Wertgrenzen und Formvorschriften richten sich nach der Gemeindeordnung bzw. dem Stadtrecht Ihres Bundeslandes – Platzhalter [__] ausfüllen und von Amtsleitung bzw. Rechtsberatung prüfen lassen.",
    "Neutral formuliert: Der Entwurf nennt keinen Auftragnehmer; die Wahl erfolgt erst im Vergabeverfahren.",
    `Stand der Rechtsgrundlagen: ${AMTSVORTRAG_STAND.label}. Vergabewerte nach BVergG 2018 idF BGBl. I Nr. 8/2026 (seit 01.03.2026).`,
  ];

  const text = [...sachverhalt, ...rechtsgrundlage, ...antrag, ...beilagen].join(" ");
  const platzhalter = (text.match(/\[[^\]]*\]/g) || []).length;

  return {
    titel: `Amtsvortrag: Photovoltaikanlage ${liegenschaften === "[Liegenschaft(en)]" ? "" : `auf ${liegenschaften}`}`.trim(),
    untertitel: `${gemeinde} · ${organ.label} · Sitzung am [Datum] · Entwurf vom ${AMTSVORTRAG_STAND.label}`,
    abschnitte: [
      { id: "sachverhalt", titel: "1. Sachverhalt", absaetze: sachverhalt },
      { id: "rechtsgrundlage", titel: "2. Rechtsgrundlage", absaetze: [], liste: rechtsgrundlage },
      { id: "antrag", titel: "3. Antrag", absaetze: [`${organ.anrede} möge beschließen:`], liste: antrag, nummeriert: true },
      { id: "beilagen", titel: "4. Beilagen", absaetze: [], liste: beilagen },
    ],
    beilagen,
    hinweise,
    vergabe: vergabe ? { bereich: vergabe.bereich, kurz: vergabe.kurz, verfahren: verfahren ? { id: verfahren.id, name: verfahren.name, norm: verfahren.norm } : null, zulaessig: zulaessig.map((w) => ({ id: w.id, name: w.name, norm: w.norm })) } : null,
    foerderungen: aktiv.map((p) => ({ id: p.id, titel: p.titel, kurz: p.kurz })),
    platzhalter,
    meta: { gemeinde, kwp, speicher, ertrag, wert, auftraggeber, art, organ: organ.id, bedeckung: bedeckung.id, eegRolle: eeg.id },
  };
}

/** Reiner Text (für Zwischenablage). */
export function amtsvortragText(doc) {
  const z = [doc.titel, doc.untertitel, ""];
  for (const a of doc.abschnitte) {
    z.push(a.titel.toUpperCase());
    for (const p of a.absaetze) z.push(p);
    if (a.liste) a.liste.forEach((l, i) => z.push(a.nummeriert ? `${i + 1}. ${l}` : `– ${l}`));
    z.push("");
  }
  z.push("Hinweise");
  for (const h of doc.hinweise) z.push(`– ${h}`);
  return z.join("\n");
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Eigenständige HTML-Datei (druckbar, ohne externe Abhängigkeiten) für den Download. */
export function amtsvortragHtml(doc) {
  const teile = doc.abschnitte
    .map((a) => {
      const absaetze = a.absaetze.map((p) => `<p>${esc(p)}</p>`).join("");
      const liste = a.liste ? `<${a.nummeriert ? "ol" : "ul"}>${a.liste.map((l) => `<li>${esc(l)}</li>`).join("")}</${a.nummeriert ? "ol" : "ul"}>` : "";
      return `<section><h2>${esc(a.titel)}</h2>${absaetze}${liste}</section>`;
    })
    .join("");
  const hinweise = doc.hinweise.map((h) => `<li>${esc(h)}</li>`).join("");
  return `<!doctype html>
<html lang="de-AT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.titel)}</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; color: #111; max-width: 46rem; margin: 2rem auto; padding: 0 1.25rem; line-height: 1.5; }
  h1 { font-size: 1.5rem; margin: 0 0 .25rem; } .unter { color: #444; margin: 0 0 1.5rem; }
  h2 { font-size: 1.1rem; margin: 1.5rem 0 .5rem; border-bottom: 1px solid #999; padding-bottom: .2rem; }
  li { margin: .3rem 0; } .hinweise { font-size: .9rem; color: #444; border-top: 1px solid #ccc; margin-top: 2rem; padding-top: .75rem; }
  .unterschrift { margin-top: 3rem; display: flex; gap: 3rem; } .unterschrift div { flex: 1; border-top: 1px solid #333; padding-top: .3rem; font-size: .9rem; }
  @media print { body { margin: 0; max-width: none; } }
</style>
</head>
<body>
<h1>${esc(doc.titel)}</h1>
<p class="unter">${esc(doc.untertitel)}</p>
${teile}
<div class="unterschrift"><div>Berichterstattung / Amtsleitung</div><div>Bürgermeisterin / Bürgermeister</div></div>
<div class="hinweise"><strong>Hinweise – keine Rechtsberatung</strong><ul>${hinweise}</ul></div>
</body>
</html>`;
}

export const QUELLEN = [
  { label: "§ 68 ElWG – Gemeinsame Energienutzung, Abs. 6 (JUSLINE, geprüft 11.10.2026)", url: ELWG_68_6.url },
  { label: "RIS – ElWG, BGBl. I Nr. 91/2025 (am 11.10.2026 nicht erreichbar)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html" },
  { label: "§ 46 BVergG 2018 – Direktvergabe (idF ab 01.03.2026)", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/46" },
  { label: "§ 13 BVergG 2018 – Geschätzter Auftragswert", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/13" },
  { label: "§ 25 BVergG 2018 – Vorarbeiten", url: "https://www.jusline.at/gesetz/bvergg_2018/paragraf/25" },
  { label: "EAG-IZV § 4 – Fördervoraussetzungen", url: "https://www.jusline.at/gesetz/eag-izv/paragraf/4" },
  { label: "Kommunalinvestitionsgesetz 2025 (JUSLINE)", url: "https://www.jusline.at/gesetz/kig_2025/gesamt" },
];
