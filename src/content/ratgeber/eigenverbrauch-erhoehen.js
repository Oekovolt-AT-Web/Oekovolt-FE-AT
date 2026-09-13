// Ratgeber: Eigenverbrauch erhöhen
// Wirkungen der Maßnahmen aus dem gemeinsamen Energiemodell der Rechner
// (src/lib/rechner/profile.js, stündliche Jahressimulation). Lastverschiebung wird
// hier vereinfacht nachgebildet: Ein fester Anteil des Tagesverbrauchs eines Geräts
// wandert in die Stunden mit dem größten Solarüberschuss (begrenzt durch die Geräteleistung).

import { jahresreihen, simuliere } from "@/lib/rechner/profile";
import { SPEICHER, SOLAR, satzFuer, fmt, fmtEur } from "@/lib/rechner/annahmen";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const KWP = 10;
const HAUSHALT = 4500;
const EAUTO_KWH = Math.round((15000 * SPEICHER.eAutoVerbrauch * SPEICHER.eAutoLadeanteilZuhause) / 100);
const OPT = { wirkungsgrad: SPEICHER.wirkungsgradJeRichtung, nutzbarAnteil: SPEICHER.nutzbarAnteil };
const SATZ = satzFuer(KWP, "teileinspeisung") / 100;
const pct = (x) => `${Math.round(x * 100)} %`;
const ctStr = (n) => String(Math.round(n * 1000) / 10).replace(".", ",");

/** Anteil eines Verbrauchers je Tag in die Überschussstunden verschieben */
function verschiebe(r, key, anteil, kapKw) {
  const neu = { ...r, [key]: Float64Array.from(r[key]) };
  delete neu._bilanz;
  const tage = r.pv.length / 24;
  for (let d = 0; d < tage; d++) {
    const i0 = d * 24;
    let flex = 0;
    for (let h = 0; h < 24; h++) {
      const v = neu[key][i0 + h] * anteil;
      flex += v;
      neu[key][i0 + h] -= v;
    }
    const ueber = [];
    for (let h = 0; h < 24; h++) ueber.push([h, Math.max(0, r.pv[i0 + h] - (neu.haushalt[i0 + h] + neu.eauto[i0 + h] + neu.wp[i0 + h]))]);
    ueber.sort((a, b) => b[1] - a[1]);
    let rest = flex;
    for (const [h, s] of ueber) {
      if (rest <= 0 || s <= 0) break;
      const x = Math.min(s, kapKw, rest);
      neu[key][i0 + h] += x;
      rest -= x;
    }
    if (rest > 0) {
      let summe = 0;
      for (let h = 0; h < 24; h++) summe += r[key][i0 + h];
      for (let h = 0; h < 24; h++) neu[key][i0 + h] += summe > 0 ? (rest * r[key][i0 + h]) / summe : rest / 24;
    }
  }
  return neu;
}

const sim = (r, kap = 0) => simuliere(r, kap, OPT);
/** Vergleich vorher/nachher bei gleichem Verbrauch */
function vergleich(vorher, nachher) {
  const mehrKwh = vorher.netz - nachher.netz;
  const ersparnis = mehrKwh * SOLAR.strompreis - (vorher.einspeisung - nachher.einspeisung) * SATZ;
  return { vorher, nachher, mehrKwh, ersparnis };
}

// Haushalt ohne E-Auto und Wärmepumpe
const R_H = jahresreihen({ kwp: KWP, haushaltKwh: HAUSHALT });
const H_BASIS = sim(R_H);
const M_GERAETE = vergleich(H_BASIS, sim(verschiebe(R_H, "haushalt", 0.15, 2)));
const M_SPEICHER = vergleich(H_BASIS, sim(R_H, 6));
const M_BEIDES = vergleich(H_BASIS, sim(verschiebe(R_H, "haushalt", 0.15, 2), 6));
// mit E-Auto
const R_E = jahresreihen({ kwp: KWP, haushaltKwh: HAUSHALT, eAutoKwh: EAUTO_KWH });
const M_EAUTO = vergleich(sim(R_E), sim(verschiebe(R_E, "eauto", 0.6, 11)));
// mit Wärmepumpe
const R_W = jahresreihen({ kwp: KWP, haushaltKwh: HAUSHALT, wpKwh: SPEICHER.wpStromKwh });
const M_WP = vergleich(sim(R_W), sim(verschiebe(R_W, "wp", 0.3, 2.5)));
// alles zusammen: E-Auto + Wärmepumpe, Energiemanagement, Speicher
const R_A = jahresreihen({ kwp: KWP, haushaltKwh: HAUSHALT, eAutoKwh: EAUTO_KWH, wpKwh: SPEICHER.wpStromKwh });
const R_A_EMS = verschiebe(verschiebe(verschiebe(R_A, "haushalt", 0.15, 2), "eauto", 0.6, 11), "wp", 0.3, 2.5);
const A_BASIS = sim(R_A);
const M_EMS = vergleich(A_BASIS, sim(R_A_EMS));
const M_EMS_SP = vergleich(A_BASIS, sim(R_A_EMS, 8));

const zeile = (massnahme, lage, m, invest) => [
  `${massnahme} (${lage})`,
  `${pct(m.vorher.eigenverbrauchsquote)} → ${pct(m.nachher.eigenverbrauchsquote)}`,
  `+${fmt(Math.round(m.mehrKwh / 10) * 10)} kWh`,
  fmtEur(Math.round(m.ersparnis / 5) * 5),
  invest,
];
const WERT_KWH = SOLAR.strompreis - VERGUETUNG.saetze[0].teileinspeisung / 100;

const artikel = {
  slug: "eigenverbrauch-erhoehen",
  title: "Eigenverbrauch erhöhen: 10 Maßnahmen für mehr Solarstrom im Haus",
  seoTitle: "Eigenverbrauch erhöhen: 10 Maßnahmen für PV | Ökovolt",
  kurzTitel: "Eigenverbrauch erhöhen",
  description:
    "Eigenverbrauch erhöhen bei Photovoltaik: 10 Maßnahmen mit berechneter Wirkung – von Lastverschiebung über Speicher bis Energiemanagement. Was sich lohnt.",
  excerpt:
    "Jede selbst genutzte Kilowattstunde ist gut viermal so viel wert wie eine eingespeiste. Zehn Maßnahmen im Vergleich – mit simulierter Wirkung, Kosten und den Fehlern, die Eigenverbrauch teuer machen.",
  hauptKeyword: "eigenverbrauch erhöhen photovoltaik",
  keywords: [
    "Eigenverbrauch erhöhen Photovoltaik",
    "PV-Eigenverbrauch optimieren",
    "Eigenverbrauch erhöhen ohne Speicher",
    "Eigenverbrauchsquote erhöhen",
    "Solarstrom selbst nutzen",
    "Lastverschiebung Photovoltaik",
    "Überschuss Photovoltaik nutzen",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/eigenverbrauch-erhoehen.jpg",
  bildAlt: "Einfamilienhaus mit Photovoltaik, Huawei-Stromspeicher an der Hauswand und E-Auto an der Wallbox",
  badge: { wert: `${ctStr(WERT_KWH)} ct`, text: "mehr wert ist jede selbst genutzte statt eingespeiste kWh" },

  kurzFazit: [
    `**Jede Kilowattstunde, die Sie selbst nutzen statt einzuspeisen, bringt rund ${ctStr(WERT_KWH)} ct** – die Differenz aus ${ctStr(SOLAR.strompreis)} ct Netzstrom und ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct Einspeisevergütung.`,
    `Ohne Maßnahmen nutzt ein Haushalt mit ${fmt(HAUSHALT)} kWh und 10 kWp in unserer Simulation nur **${pct(H_BASIS.eigenverbrauchsquote)} des Solarstroms** selbst. Ein 6-kWh-Speicher hebt das auf ${pct(M_SPEICHER.nachher.eigenverbrauchsquote)}.`,
    `**Kostenlos wirkt Lastverschiebung:** Wasch-, Spülmaschine und Trockner mittags laufen zu lassen, bringt im Beispiel rund ${fmtEur(Math.round(M_GERAETE.ersparnis / 5) * 5)} pro Jahr.`,
    `**Am meisten bringt die Kombination:** Mit E-Auto, Wärmepumpe, Energiemanagement und 8-kWh-Speicher nutzt der Beispielhaushalt rund ${fmt(Math.round(M_EMS_SP.mehrKwh / 100) * 100)} kWh mehr Solarstrom selbst – etwa ${fmtEur(Math.round(M_EMS_SP.ersparnis / 5) * 5)} im Jahr.`,
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie erhöhe ich den Eigenverbrauch meiner PV-Anlage?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Den Eigenverbrauch erhöhen Sie, indem Sie Strom dann verbrauchen, wenn die Sonne scheint – oder Solarstrom für später speichern.** Die wirksamsten Hebel sind: Haushaltsgeräte in die Mittagsstunden verschieben, einen passend dimensionierten Stromspeicher nutzen, das E-Auto mit Solarüberschuss laden, die Wärmepumpe tagsüber Warmwasser bereiten lassen und alles über ein Energiemanagementsystem koordinieren.",
        },
        {
          typ: "p",
          text: `Warum sich das lohnt, zeigt eine einfache Rechnung: Netzstrom kostet im Mittel rund ${ctStr(SOLAR.strompreis)} ct je kWh, für eingespeisten Strom erhalten neue Anlagen bis 10 kWp ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct ([Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026)). Seit dem Solarspitzengesetz entfällt die Vergütung für neue Anlagen zudem in Stunden mit negativen Börsenstrompreisen, und ohne intelligentes Messsystem ist die Einspeisung bei Neuanlagen unter 25 kW auf 60 % der Leistung begrenzt. Selbst genutzter Strom ist davon nicht betroffen.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Eigenverbrauchsquote oder Autarkiegrad?",
          text: "Die **[Eigenverbrauchsquote](/wissen/lexikon#eigenverbrauchsquote)** gibt an, welcher Anteil des erzeugten Solarstroms im Haus genutzt wird. Der **[Autarkiegrad](/wissen/lexikon#autarkiegrad)** sagt, welcher Anteil des Verbrauchs aus der eigenen Anlage stammt. Eine kleine Anlage hat eine hohe Quote, deckt aber wenig vom Verbrauch. Ziel ist deshalb nicht die höchste Quote, sondern möglichst viele selbst genutzte Kilowattstunden.",
        },
      ],
    },
    {
      id: "wirkung",
      titel: "Was die Maßnahmen bringen: Simulation für typische Haushalte",
      tocLabel: "Wirkung im Vergleich",
      bloecke: [
        {
          typ: "p",
          text: `Die folgenden Werte stammen aus der stündlichen Jahressimulation, die auch unseren Rechnern zugrunde liegt: 10 kWp Süddach, ${fmt(HAUSHALT)} kWh Haushaltsstrom, E-Auto mit ${fmt(EAUTO_KWH)} kWh Heimladung, Wärmepumpe mit ${fmt(SPEICHER.wpStromKwh)} kWh. Für die Lastverschiebung haben wir angenommen, dass sich 15 % des Haushaltsstroms, 60 % des Ladestroms und 30 % des Wärmepumpenstroms in sonnige Stunden legen lassen.`,
        },
        {
          typ: "tabelle",
          caption: "Wirkung einzelner Maßnahmen auf Eigenverbrauch und Stromkosten (Simulation, Stand September 2026)",
          kopf: ["Maßnahme (Haushalt)", "Eigenverbrauchsquote", "mehr selbst genutzt", "Ersparnis/Jahr", "Investition"],
          zeilen: [
            zeile("Geräte mittags laufen lassen", "Haushalt", M_GERAETE, "0 €"),
            zeile("Stromspeicher 6 kWh", "Haushalt", M_SPEICHER, fmtEur(6 * SPEICHER.preisProKwh)),
            zeile("Geräte verschieben + Speicher", "Haushalt", M_BEIDES, fmtEur(6 * SPEICHER.preisProKwh)),
            zeile("E-Auto mit Überschuss laden", "mit E-Auto", M_EAUTO, "Wallbox mit PV-Modus"),
            zeile("Wärmepumpe tagsüber per SG Ready/EMS", "mit Wärmepumpe", M_WP, "meist gering"),
            zeile("Energiemanagement für alles", "mit E-Auto und WP", M_EMS, "oft über 1.000 €"),
            zeile("Energiemanagement + Speicher 8 kWh", "mit E-Auto und WP", M_EMS_SP, `ab ${fmtEur(8 * SPEICHER.preisProKwh)} plus EMS`),
          ],
          hervorheben: 3,
          minBreite: 640,
          fussnote: `Ersparnis = vermiedener Netzbezug × ${ctStr(SOLAR.strompreis)} ct abzüglich entgangener Einspeisevergütung (${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct). Speicherpreis gemeinsam mit der PV-Anlage installiert (${fmtEur(SPEICHER.preisProKwh)}/kWh). Vereinfachtes Modell ohne Ost-West-Dach und ohne Heizstab – Orientierungswerte, keine Angebote.`,
        },
        {
          typ: "p",
          text: `Drei Erkenntnisse aus der Tabelle: Erstens bringt Lastverschiebung ohne jede Investition spürbar Geld. Zweitens bleibt der **Speicher der stärkste Einzelhebel** für den reinen Haushaltsstrom – er kostet aber auch am meisten. Drittens wirken Maßnahmen zusammen: Mit E-Auto, Wärmepumpe, Energiemanagement und Speicher werden im Beispiel rund ${fmt(Math.round(M_EMS_SP.mehrKwh / 100) * 100)} kWh mehr Solarstrom im Haus genutzt als ohne Steuerung.`,
        },
        { typ: "tool", href: "/rechner/stromspeicher", titel: "Ihren Eigenverbrauch berechnen", text: "Verbrauch, Anlagengröße, E-Auto und Wärmepumpe eingeben – der Rechner zeigt Eigenverbrauch und Autarkie mit und ohne Speicher.", label: "Zum Stromspeicher-Rechner" },
      ],
    },
    {
      id: "massnahmen",
      titel: "10 Maßnahmen, um mehr Solarstrom selbst zu nutzen",
      tocLabel: "10 Maßnahmen",
      bloecke: [
        { typ: "h3", text: "1. Große Haushaltsgeräte in die Mittagszeit legen" },
        {
          typ: "p",
          text: "Waschmaschine, Geschirrspüler und Trockner verbrauchen je Durchlauf 0,5 bis 2,5 kWh. Starten Sie sie zwischen etwa 10 und 16 Uhr – per Startzeitvorwahl, App oder einfach vor dem Verlassen des Hauses. Das kostet nichts und ist die erste Maßnahme, die jeder umsetzen sollte. Tipp: Laufen die Geräte nacheinander statt gleichzeitig, übersteigt ihr Verbrauch seltener die aktuelle PV-Leistung.",
        },
        { typ: "h3", text: "2. Einen passend dimensionierten Stromspeicher nutzen" },
        {
          typ: "p",
          text: "Ein Speicher verschiebt Mittagsstrom in den Abend. Wichtig ist die richtige Größe: Ab etwa 1 bis 1,5 kWh nutzbarer Kapazität je 1.000 kWh Verbrauch steigt der Nutzen nur noch langsam. Die Details stehen im Ratgeber [Stromspeicher-Größe berechnen](/ratgeber/stromspeicher-groesse).",
        },
        { typ: "h3", text: "3. Das E-Auto mit Solarüberschuss laden" },
        {
          typ: "p",
          text: "Ein E-Auto kann in wenigen Stunden mehr Solarstrom aufnehmen als jedes andere Gerät im Haus. Eine Wallbox mit Überschussladen passt die Ladeleistung laufend an den Überschuss an und schaltet bei Bedarf zwischen ein- und dreiphasigem Laden um. Das funktioniert nur, wenn das Auto tagsüber zu Hause steht – etwa am Wochenende, im Homeoffice oder bei einem Zweitwagen. Mehr dazu im Ratgeber [PV-Überschussladen](/ratgeber/pv-ueberschussladen).",
        },
        { typ: "h3", text: "4. Die Wärmepumpe mittags arbeiten lassen" },
        {
          typ: "p",
          text: "Über SG Ready oder eine digitale Schnittstelle kann die Wärmepumpe bei Überschuss den Warmwasserspeicher höher aufheizen oder das Haus leicht vorheizen. Die Wärme wird gespeichert und später genutzt. Wie viel Solarstrom eine Wärmepumpe realistisch nutzt, zeigt der Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
        },
        { typ: "h3", text: "5. Warmwasser mit Solarüberschuss bereiten" },
        {
          typ: "p",
          text: "Ohne Wärmepumpe kann ein regelbarer Heizstab im Warmwasserspeicher Überschüsse aufnehmen. Er arbeitet allerdings mit einem Wirkungsgrad von etwa 1 – eine Kilowattstunde Strom wird zu einer Kilowattstunde Wärme. Er lohnt sich daher vor allem, wenn sonst viel eingespeist würde. Alternativen und Rechnung im Ratgeber [Heizstab und Photovoltaik](/ratgeber/heizstab-photovoltaik).",
        },
        { typ: "h3", text: "6. Ein Energiemanagementsystem einsetzen" },
        {
          typ: "p",
          text: "Sobald mehr als ein großer Verbraucher im Haus ist, lohnt sich eine zentrale Steuerung. Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) verteilt den Überschuss nach Prioritäten auf Speicher, Wallbox und Wärmepumpe, berücksichtigt Wetterprognosen und kann auch dynamische Stromtarife einbeziehen.",
        },
        { typ: "h3", text: "7. Grundlast senken" },
        {
          typ: "p",
          text: "Standby-Geräte, alte Umwälzpumpen oder Kühlgeräte laufen rund um die Uhr – auch nachts, wenn keine Sonne scheint. 50 Watt Dauerlast ergeben rund 440 kWh im Jahr. Weniger Grundlast erhöht zwar nicht den Eigenverbrauch, senkt aber den Netzbezug und damit die Stromrechnung. Außerdem reicht der Speicher länger.",
        },
        { typ: "h3", text: "8. Anlage auf den Verbrauch ausrichten" },
        {
          typ: "p",
          text: "Bei der Planung lässt sich der Eigenverbrauch schon beeinflussen: Eine [Ost-West-Ausrichtung](/wissen/lexikon#ost-west-ausrichtung) verteilt die Erzeugung über den Tag und liefert morgens und abends mehr Strom. Wer eine Wärmepumpe oder ein E-Auto plant, sollte die Anlagengröße darauf abstimmen. Faustregeln für die Größe finden Sie im Ratgeber [PV-Anlagengröße berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
        { typ: "h3", text: "9. Geräte mit Zeitsteuerung oder smarter Steckdose ausstatten" },
        {
          typ: "p",
          text: "Poolpumpe, Luftentfeuchter, Akkus von Gartengeräten und E-Bikes lassen sich über Zeitschaltuhren oder schaltbare Steckdosen in die Mittagsstunden legen. Viele Wechselrichter-Apps können solche Steckdosen bei Überschuss direkt schalten.",
        },
        { typ: "h3", text: "10. Dynamischen Stromtarif ergänzend nutzen" },
        {
          typ: "p",
          text: "Ein dynamischer Tarif erhöht den Eigenverbrauch nicht, senkt aber die Kosten des verbleibenden Netzstroms – vor allem im Winter, wenn die PV-Anlage wenig liefert. Voraussetzung ist ein intelligentes Messsystem. Für wen sich das rechnet, zeigt der Ratgeber [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler: Wann mehr Eigenverbrauch Geld kostet",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            `**Verbrauch künstlich erzeugen:** Ein Gerät, das nur läuft, „weil die Sonne scheint“, spart nichts. Jede Kilowattstunde, die sonst nicht verbraucht würde, kostet Sie ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct entgangene Vergütung.`,
            "**Den Speicher zu groß kaufen,** um die Quote zu steigern: Die letzten Prozentpunkte kosten überproportional viel.",
            "**Heizstab vor Wärmepumpe:** Wo eine Wärmepumpe vorhanden ist, erzeugt sie aus derselben Kilowattstunde drei- bis viermal so viel Wärme.",
            "**Das E-Auto aus dem Heimspeicher laden:** Das verschiebt Solarstrom von einer Batterie in die andere – mit Verlusten.",
            "**Die Eigenverbrauchsquote als Ziel sehen:** Entscheidend sind eingesparte Euro, nicht Prozentwerte.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Steuerlich unkompliziert",
          text: "Für Anlagen bis 30 kWp auf Wohngebäuden sind Einnahmen und Entnahmen nach § 3 Nr. 72 EStG von der Einkommensteuer befreit. Selbst genutzter Strom muss daher nicht versteuert werden. Details im Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "In vier Schritten zu mehr Eigenverbrauch",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Verbrauch sichtbar machen", "Die Wechselrichter-App oder das Monitoring zeigt, wann Sie Strom beziehen und wann Sie einspeisen. Darauf bauen alle weiteren Schritte auf."],
            ["Kostenlose Maßnahmen umsetzen", "Geräte in die Mittagszeit legen, Zeitvorwahl nutzen, Grundlast prüfen."],
            ["Große Verbraucher einbinden", "Wallbox mit Überschussladen, Wärmepumpe mit SG Ready oder digitaler Schnittstelle, gegebenenfalls Heizstab."],
            ["Speicher und Energiemanagement ergänzen", "Wenn abends viel Strom gebraucht wird oder mehrere Verbraucher zu koordinieren sind – mit dem [Stromspeicher-Rechner](/rechner/stromspeicher) die passende Größe prüfen."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Aus einer Hand geplant",
          text: "Ökovolt plant PV-Anlage, Speicher, Wallbox und Energiemanagement aufeinander abgestimmt – als Partner von Sigenergy, Huawei, Fronius, Solis, meteocontrol und BYD, aber mit herstellerneutraler Beratung. Mehr zum [Smart Energy Home](/produkte/smartenergyhome).",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie hoch ist der Eigenverbrauch ohne Speicher?", a: `Ohne Speicher nutzen Einfamilienhäuser typischerweise 20 bis 40 % des Solarstroms selbst, abhängig von Anlagengröße und Verbrauch. In unserem Beispiel mit 10 kWp und ${fmt(HAUSHALT)} kWh sind es ${pct(H_BASIS.eigenverbrauchsquote)}.` },
    { q: "Wie kann ich den Eigenverbrauch ohne Speicher erhöhen?", a: "Legen Sie Waschmaschine, Geschirrspüler und Trockner in die Mittagszeit, laden Sie das E-Auto mit Überschuss, lassen Sie die Wärmepumpe tagsüber Warmwasser bereiten und nutzen Sie Zeitschaltuhren oder smarte Steckdosen. Ein Energiemanagementsystem automatisiert das." },
    { q: "Was ist eine gute Eigenverbrauchsquote?", a: "Ohne Speicher sind 25 bis 40 % gut, mit Speicher 50 bis 70 %. Eine sehr hohe Quote kann aber auch bedeuten, dass die Anlage zu klein ist. Wichtiger ist, wie viele Kilowattstunden Sie insgesamt selbst nutzen." },
    { q: "Lohnt sich ein Heizstab für den Eigenverbrauch?", a: "Er lohnt sich vor allem, wenn viel Überschuss eingespeist würde und keine Wärmepumpe vorhanden ist. Weil er Strom nur eins zu eins in Wärme umwandelt, ist eine Wärmepumpe bei gleicher Strommenge deutlich effizienter." },
    { q: "Wie viel spart mehr Eigenverbrauch?", a: `Jede zusätzlich selbst genutzte Kilowattstunde spart rund ${ctStr(WERT_KWH)} ct gegenüber der Einspeisung. 500 kWh mehr Eigenverbrauch entsprechen damit etwa ${fmtEur(500 * WERT_KWH)} im Jahr.` },
    { q: "Muss ich selbst verbrauchten Solarstrom versteuern?", a: "Bei Anlagen bis 30 kWp auf Wohngebäuden nicht: Nach § 3 Nr. 72 EStG sind Einnahmen und Entnahmen steuerfrei. Umsatzsteuerlich gilt für Kauf und Installation der Nullsteuersatz." },
  ],

  passend: [
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Funktionen, Standards und § 14a EnWG." },
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe berechnen", text: "Faustregeln und Simulationstabelle." },
    { href: "/ratgeber/pv-ueberschussladen", titel: "PV-Überschussladen", text: "E-Auto mit Solarstrom laden." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Eigenverbrauch und Autarkie berechnen." },
  ],

  quellen: [
    { titel: "HTW Berlin – Unabhängigkeitsrechner", url: "https://solar.htw-berlin.de/rechner/unabhaengigkeitsrechner/", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Energiemanagementsystem für zu Hause", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/energiemanagementsystem-fuer-zu-hause-mehr-eigenen-strom-selber-nutzen-48095", stand: "09/2026" },
    { titel: "Bundesverband Solarwirtschaft – FAQ Solarspitzengesetz", url: "https://www.solarwirtschaft.de/unsere-themen/photovoltaik/standpunkte/faq-solarspitzengesetz/", stand: "09/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "BDEW – Strompreisanalyse", url: "https://www.bdew.de/service/daten-und-grafiken/bdew-strompreisanalyse/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wie viel nutzen Sie selbst?", text: "Eigenverbrauch und Autarkie mit Ihren Werten berechnen.", href: "/rechner/stromspeicher", label: "Jetzt berechnen" },
  cta: {
    title: "Mehr Solarstrom im eigenen Haus.",
    text: "Wir stimmen PV-Anlage, Speicher, Wallbox und Wärmepumpe so aufeinander ab, dass möglichst viel Solarstrom dort ankommt, wo er am meisten spart.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
