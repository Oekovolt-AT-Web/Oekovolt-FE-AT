// Ratgeber: Stromspeicher-Größe berechnen
// Alle Simulationswerte stammen aus demselben Rechenkern wie der
// Stromspeicher-Rechner (src/lib/rechner/stromspeicher.js, stündliche Jahressimulation).

import { speicherReihen, speicherKurve, speicherErgebnis } from "@/lib/rechner/stromspeicher";
import { SPEICHER, SOLAR, fmt, fmtEur } from "@/lib/rechner/annahmen";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const pct = (x) => `${Math.round(x * 100)} %`;
const ctStr = (n) => String(Math.round(n * 1000) / 10).replace(".", ",");

// Standardfall: 4.500 kWh Haushaltsstrom, 10 kWp
const BASIS_EINGABE = { verbrauch: 4500, kwp: 10 };
const BASIS = speicherReihen(BASIS_EINGABE);
const KURVE = speicherKurve(BASIS, { kwp: 10 });
const GROESSEN = [3, 5, 6, 8, 10, 12, 15];
const ZEILEN = GROESSEN.map((kap) => ({ kap, ...speicherErgebnis(BASIS, { kwp: 10, speicher: kap }) }));
const OHNE = KURVE.ohne;
const OPT = KURVE.optimum;
const zeile = (kap) => ZEILEN.find((z) => z.kap === kap);

// Haushaltstypen inkl. Wärmepumpe und E-Auto
const FAELLE = [
  { label: "2-Personen-Haushalt", detail: "2.500 kWh, 6 kWp", e: { verbrauch: 2500, kwp: 6 } },
  { label: "4-Personen-Haushalt", detail: "4.500 kWh, 10 kWp", e: { verbrauch: 4500, kwp: 10 } },
  { label: "mit E-Auto", detail: "4.500 kWh + 15.000 km, 12 kWp", e: { verbrauch: 4500, kwp: 12, eAuto: true, km: 15000 } },
  { label: "mit Wärmepumpe", detail: "4.500 kWh + Wärmepumpe, 12 kWp", e: { verbrauch: 4500, kwp: 12, waermepumpe: true } },
  { label: "Wärmepumpe + E-Auto", detail: "4.500 kWh + WP + 15.000 km, 15 kWp", e: { verbrauch: 4500, kwp: 15, waermepumpe: true, eAuto: true, km: 15000 } },
].map((f) => {
  const b = speicherReihen(f.e);
  const k = speicherKurve(b, { kwp: f.e.kwp });
  const opt = k.optimum;
  return { ...f, gesamt: b.gesamtverbrauch, ohne: k.ohne, opt, faustregel: (b.gesamtverbrauch / 1000) * 1.5 };
});
const EAUTO_KWH = Math.round((15000 * SPEICHER.eAutoVerbrauch * SPEICHER.eAutoLadeanteilZuhause) / 100);
const MAX = zeile(15);
const Z6 = zeile(6);

const artikel = {
  slug: "stromspeicher-groesse",
  title: "Stromspeicher-Größe berechnen: Faustregeln, Tabelle & Beispiele",
  seoTitle: "Stromspeicher Größe berechnen: Faustregel & Tabelle | Ökovolt",
  kurzTitel: "Stromspeicher-Größe",
  description:
    "Stromspeicher-Größe berechnen: Faustregeln im Check, Simulation für 3 bis 15 kWh, Werte mit Wärmepumpe und E-Auto – und warum größer nicht besser ist.",
  excerpt:
    "Wie viele Kilowattstunden braucht Ihr Speicher wirklich? Faustregeln im Check, eine stündliche Jahressimulation für typische Haushalte und die häufigsten Fehler bei der Auslegung.",
  hauptKeyword: "stromspeicher größe berechnen",
  keywords: [
    "Stromspeicher Größe berechnen",
    "Wie groß sollte ein Stromspeicher sein",
    "Stromspeicher Dimensionierung",
    "Speichergröße Faustregel",
    "PV-Speicher Größe Einfamilienhaus",
    "Stromspeicher Größe Wärmepumpe",
    "Stromspeicher Größe E-Auto",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/stromspeicher-groesse.jpg",
  bildAlt: "Modularer Sigenergy-Stromspeicher SigenStor mit mehreren gestapelten Batteriemodulen",
  badge: { wert: `~${fmt(OPT.kap)} kWh`, text: "wirtschaftliches Optimum bei 4.500 kWh und 10 kWp" },

  kurzFazit: [
    "**Faustregel:** rund **1 bis 1,5 kWh nutzbare Speicherkapazität je 1.000 kWh Jahresverbrauch** – und nicht mehr als 1,5 kWh je kWp Anlagenleistung (HTW Berlin).",
    `Für einen 4-Personen-Haushalt mit 4.500 kWh und 10 kWp liegt das wirtschaftliche Optimum in unserer Simulation bei **${fmt(OPT.kap)} kWh**. Die Autarkie steigt damit von ${pct(OHNE.autarkie)} auf ${pct(OPT.autarkie)}.`,
    `Jede weitere Kilowattstunde bringt weniger: Von ${fmt(6)} auf ${fmt(15)} kWh steigt die Autarkie nur noch um ${Math.round((MAX.mit.autarkie - Z6.mit.autarkie) * 100)} Prozentpunkte – die Mehrkosten liegen bei rund ${fmtEur(9 * SPEICHER.preisProKwh)}.`,
    "Mit **Wärmepumpe oder E-Auto** darf der Speicher größer sein, aber nicht proportional: Der Wärmepumpenstrom fällt überwiegend im Winter an, wenn kaum Überschuss zum Laden da ist.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie groß sollte ein Stromspeicher sein?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Stromspeicher sollte so groß sein, dass er den Strombedarf von Abend und Nacht deckt – im Einfamilienhaus sind das meist 5 bis 10 kWh.** Als Richtwert gelten 1 bis 1,5 kWh nutzbare Kapazität je 1.000 kWh Jahresverbrauch. Ein Haushalt mit 4.000 kWh landet damit bei 4 bis 6 kWh, mit Wärmepumpe oder E-Auto entsprechend höher.",
        },
        {
          typ: "p",
          text: `Die Logik dahinter: Ein Speicher verdient nur dann Geld, wenn er möglichst oft voll geladen und wieder entladen wird. Jede Kilowattstunde, die er abends liefert, ersetzt Netzstrom für rund ${ctStr(SOLAR.strompreis)} ct – statt für ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct eingespeist zu werden. Ist der Speicher größer als der nächtliche Verbrauch, bleibt ein Teil der Kapazität an den meisten Tagen ungenutzt. Sie bezahlen dann für Kilowattstunden, die kaum arbeiten.`,
        },
        {
          typ: "kennzahl",
          wert: "1–1,5 kWh",
          titel: "nutzbare Kapazität je 1.000 kWh Jahresverbrauch",
          text: "Obergrenze nach HTW Berlin: 1,5 kWh je 1.000 kWh Verbrauch und 1,5 kWh je kWp Anlagenleistung. Maßgeblich ist jeweils der kleinere Wert.",
        },
      ],
    },
    {
      id: "faustregeln",
      titel: "Die gängigen Faustregeln im Vergleich",
      tocLabel: "Faustregeln",
      bloecke: [
        {
          typ: "p",
          text: "Im Netz kursieren mehrere Faustformeln, die zu unterschiedlichen Ergebnissen führen. Die belastbarsten stammen von der Forschungsgruppe Solarspeichersysteme der HTW Berlin, die mehrere zehntausend Systemkombinationen simuliert hat. Die Verbraucherzentrale nennt inzwischen etwa 1,5 kWh je 1.000 kWh als Richtwert.",
        },
        {
          typ: "tabelle",
          caption: "Faustregeln zur Speichergröße und was sie für einen Haushalt mit 4.500 kWh und 10 kWp bedeuten",
          kopf: ["Faustregel", "Quelle", "Ergebnis im Beispiel", "Einordnung"],
          zeilen: [
            ["max. 1,5 kWh je 1.000 kWh Verbrauch", "HTW Berlin, Verbraucherzentrale", "bis 6,75 kWh nutzbar", "sinnvolle Obergrenze für reinen Haushaltsstrom"],
            ["max. 1,5 kWh je kWp PV-Leistung", "HTW Berlin", "bis 15 kWh nutzbar", "sonst wird der Speicher in Frühjahr und Herbst selten voll"],
            ["mind. 0,5 kWp je 1.000 kWh Verbrauch", "HTW Berlin", "mind. 2,25 kWp", "sonst fehlt Überschuss zum Laden"],
            ["1 kWh je 1.000 kWh Verbrauch", "ältere Empfehlungen", "4,5 kWh", "eher knapp, aber wirtschaftlich robust"],
            ["1 kWh je kWp", "Installateurs-Faustregel", "10 kWh", "bei großen Anlagen oft zu groß"],
          ],
          hervorheben: 2,
          minBreite: 680,
          fussnote: "Nutzbare Kapazität = Anteil, der tatsächlich entladen werden kann (bei LFP-Speichern meist 90–100 % der Nennkapazität).",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Nutzbare Kapazität oder Nennkapazität?",
          text: "Datenblätter nennen oft die **Brutto- oder Nennkapazität**. Entscheidend für Faustregeln ist die **nutzbare Kapazität**. Bei modernen [LFP-Speichern](/wissen/lexikon#lfp) liegt sie meist nur wenig darunter; bei Geräten mit fest eingestellter Notstromreserve kann die frei nutzbare Kapazität deutlich kleiner sein. Mehr zum Begriff im Lexikon unter [Speicherkapazität](/wissen/lexikon#speicherkapazitaet).",
        },
      ],
    },
    {
      id: "simulation",
      titel: "Simulation: Was bringt jede zusätzliche Kilowattstunde?",
      tocLabel: "Simulationstabelle",
      bloecke: [
        {
          typ: "p",
          text: `Faustregeln sind ein Startpunkt. Genauer ist eine Simulation über ein ganzes Jahr in Stundenschritten – mit sonnigen und trüben Tagen, Verbrauchsspitzen am Abend und Speicherverlusten. Die folgenden Werte stammen aus dem Rechenkern unseres [Stromspeicher-Rechners](/rechner/stromspeicher): ${fmt(4500)} kWh Haushaltsstrom, 10 kWp auf einem Süddach, ${fmtEur(SPEICHER.preisProKwh)} je kWh Speicher (gemeinsam mit der PV-Anlage installiert), ${ctStr(SOLAR.strompreis)} ct Strompreis und ${fmt(SPEICHER.lebensdauerJahre)} Jahre Nutzungsdauer.`,
        },
        {
          typ: "tabelle",
          caption: "Speichergrößen im Vergleich: 4-Personen-Haushalt, 4.500 kWh, 10 kWp (Stand September 2026)",
          kopf: ["Speicher", "Autarkie", "Ersparnis/Jahr", "Kosten", "Zyklen/Jahr", `Überschuss ${SPEICHER.lebensdauerJahre} J.`],
          zeilen: [
            ["ohne", pct(OHNE.autarkie), "–", "–", "–", "–"],
            ...ZEILEN.map((z) => [
              `${fmt(z.kap)} kWh`,
              pct(z.mit.autarkie),
              fmtEur(z.ersparnis),
              fmtEur(z.kosten),
              fmt(z.vollzyklen),
              fmtEur(z.ueberschuss),
            ]),
          ],
          markierteZeile: ZEILEN.findIndex((z) => z.kap === OPT.kap) + 1,
          hervorheben: 1,
          minBreite: 620,
          fussnote: `Orientierungswerte, keine Angebote. Speichergröße als Nennkapazität. Ersparnis = vermiedener Netzbezug abzüglich entgangener Einspeisevergütung (${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct). Überschuss = Summe der Ersparnisse über ${SPEICHER.lebensdauerJahre} Jahre bei ${Math.round(SPEICHER.strompreisSteigerung * 100)} % Strompreissteigerung abzüglich Speicherkosten. Markiert: wirtschaftliches Optimum.`,
        },
        {
          typ: "p",
          text: `Die Tabelle zeigt das typische Muster: **Die ersten Kilowattstunden sind die wertvollsten.** Ein ${fmt(3)}-kWh-Speicher durchläuft rund ${fmt(zeile(3).vollzyklen)} Vollzyklen im Jahr und arbeitet fast jeden Tag voll. Ab etwa ${fmt(OPT.kap)} kWh wird der Speicher an vielen Tagen nicht mehr ganz geleert, die Zyklenzahl sinkt, und die Zusatzersparnis deckt die Zusatzkosten nicht mehr. Bei ${fmt(15)} kWh ist der Überschuss weniger als halb so groß wie im Optimum, obwohl die Autarkie weiter steigt.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Autarkie ist nicht gleich Rendite",
          text: "Wer maximale Unabhängigkeit möchte, darf größer planen – das ist eine legitime Entscheidung. Sie sollte nur bewusst fallen: Der Schritt von 70 auf 80 % Autarkie kostet ein Mehrfaches dessen, was der Schritt von 40 auf 70 % gekostet hat. Einen [Autarkiegrad](/wissen/lexikon#autarkiegrad) von 100 % erreicht ein Einfamilienhaus mit Netzanschluss wirtschaftlich nie, weil im Dezember und Januar die Sonne fehlt.",
        },
        { typ: "tool", href: "/rechner/stromspeicher", titel: "Ihre Speichergröße simulieren", text: "Verbrauch, Anlagengröße, E-Auto und Wärmepumpe eingeben – der Rechner zeigt Autarkie und wirtschaftliches Optimum für 0 bis 20 kWh.", label: "Zum Stromspeicher-Rechner" },
      ],
    },
    {
      id: "haushalte",
      titel: "Speichergröße nach Haushalt, Wärmepumpe und E-Auto",
      tocLabel: "Mit Wärmepumpe & E-Auto",
      bloecke: [
        {
          typ: "p",
          text: `**Mit Wärmepumpe oder E-Auto steigt die sinnvolle Speichergröße – aber langsamer als der Verbrauch.** Das E-Auto rechnen wir mit ${fmt(EAUTO_KWH)} kWh Ladestrom zu Hause (15.000 km, ${fmt(SPEICHER.eAutoVerbrauch)} kWh/100 km, ${Math.round(SPEICHER.eAutoLadeanteilZuhause * 100)} % Heimladeanteil), die Wärmepumpe mit ${fmt(SPEICHER.wpStromKwh)} kWh im Jahr.`,
        },
        {
          typ: "tabelle",
          caption: "Wirtschaftlich optimale Speichergröße für typische Haushalte (Simulation, Stand September 2026)",
          kopf: ["Haushalt", "Verbrauch gesamt", "Faustregel", "Optimum", "Autarkie"],
          zeilen: FAELLE.map((f) => [
            `${f.label} (${f.detail})`,
            `${fmt(Math.round(f.gesamt / 10) * 10)} kWh`,
            `${fmt(f.faustregel, 1)} kWh`,
            f.opt ? `${fmt(f.opt.kap)} kWh` : "kein Speicher",
            f.opt ? `${pct(f.ohne.autarkie)} → ${pct(f.opt.autarkie)}` : pct(f.ohne.autarkie),
          ]),
          hervorheben: 3,
          minBreite: 620,
          fussnote: "Faustregel = 1,5 kWh nutzbare Kapazität je 1.000 kWh Gesamtverbrauch. Optimum = größter wirtschaftlicher Überschuss über die Nutzungsdauer (Simulation, Nennkapazität); bei nahezu gleichem Ergebnis wird die kleinere Größe gewählt. Autarkie ohne → mit Speicher im Optimum.",
        },
        { typ: "h3", text: "Wärmepumpe: Der Speicher hilft vor allem in der Übergangszeit" },
        {
          typ: "p",
          text: "Rund drei Viertel des Heizstroms fallen zwischen Oktober und März an – genau dann, wenn die PV-Anlage wenig Überschuss erzeugt. Im Hochwinter bleibt der Speicher an vielen Tagen fast leer. Deshalb liegt das Optimum mit Wärmepumpe deutlich unter dem, was die Faustregel auf den Gesamtverbrauch ergeben würde. Wirksamer ist oft, die Wärmepumpe mittags über [SG Ready oder ein Energiemanagement](/ratgeber/energiemanagementsystem) Warmwasser bereiten zu lassen. Details im Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
        },
        { typ: "h3", text: "E-Auto: Der Speicher ist kein Ersatz für Überschussladen" },
        {
          typ: "p",
          text: "Ein E-Auto-Akku hat 50 bis 80 kWh – ein Heimspeicher kann ihn nicht sinnvoll füllen. Den Speicher abends ins Auto zu entladen, verschiebt Solarstrom nur von einer Batterie in die andere, mit Verlusten. Besser: Das Auto tagsüber mit [PV-Überschussladen](/ratgeber/pv-ueberschussladen) direkt laden, wenn es zu Hause steht, und den Heimspeicher für den Haushalt reservieren. Dass das Optimum mit E-Auto trotzdem steigt, liegt am höheren Abendverbrauch an Tagen, an denen das Auto erst nach Sonnenuntergang lädt.",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Zu groß oder zu klein: die Folgen von Fehlplanung",
      tocLabel: "Über- & Unterdimensionierung",
      bloecke: [
        {
          typ: "karten",
          items: [
            { titel: "Überdimensioniert", text: "Höhere Anschaffungskosten, wenige Vollzyklen, lange Amortisation. Im Winter bleibt ein großer Teil ungenutzt. Außerdem altert ein Speicher auch ohne Zyklen – ungenutzte Kapazität verliert trotzdem an Wert." },
            { titel: "Unterdimensioniert", text: "Der Speicher ist mittags schnell voll, abends früh leer. Die Ersparnis je kWh ist hoch, die absolute Ersparnis bleibt aber begrenzt. Ärgerlich wird es, wenn später Wärmepumpe oder E-Auto dazukommen und sich nicht nachrüsten lässt." },
          ],
        },
        {
          typ: "p",
          text: "Ein leicht zu kleiner Speicher ist wirtschaftlich meist das kleinere Übel. Voraussetzung ist, dass das System **modular erweiterbar** ist. Viele Hochvolt-Speicher lassen sich mit zusätzlichen Batteriemodulen aufstocken. Allerdings geben Hersteller dafür oft Fristen vor, und neue Module neben gealterten Modulen können je nach Systemarchitektur die nutzbare Kapazität begrenzen. Klären Sie das vor dem Kauf.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Kapazität nicht nach Dachgröße wählen,** sondern nach dem Abend- und Nachtverbrauch.",
            "**Lade- und Entladeleistung prüfen:** Unter 2,5 kW kann ein Speicher Lastspitzen wie Herd, Backofen oder Wärmepumpe nicht decken. Mehr zur [C-Rate](/wissen/lexikon#c-rate) im Lexikon.",
            "**Erweiterbarkeit schriftlich klären:** Bis wann lassen sich Module nachkaufen, und zu welchen Bedingungen gilt die Garantie?",
            "**Notstromreserve einplanen:** Wer 20 bis 30 % für den Stromausfall reserviert, braucht entsprechend mehr Kapazität. Mehr dazu unter [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik).",
            "**Pläne der nächsten 5 Jahre berücksichtigen:** Wärmepumpe, E-Auto, Homeoffice oder Auszug der Kinder verändern das Lastprofil stärker als jede Faustregel.",
          ],
        },
      ],
    },
    {
      id: "faktoren",
      titel: "Weitere Faktoren, die 2026 die Größe beeinflussen",
      tocLabel: "Weitere Faktoren",
      bloecke: [
        { typ: "h3", text: "Solarspitzengesetz: 60-%-Einspeisegrenze" },
        {
          typ: "p",
          text: "Neue PV-Anlagen unter 25 kW, die seit dem 25. Februar 2025 ans Netz gehen, dürfen ohne betriebsbereites intelligentes Messsystem mit Steuerungseinrichtung nur 60 % ihrer Leistung einspeisen. Ein Speicher mit **prognosebasierter Ladung** nimmt die Mittagsspitze auf, statt morgens schon voll zu sein. Das ändert die optimale Größe kaum, macht aber die Ladestrategie wichtiger. Hintergründe im Ratgeber zum [Solarspitzengesetz](/ratgeber/solarspitzengesetz).",
        },
        { typ: "h3", text: "Dynamischer Stromtarif" },
        {
          typ: "p",
          text: "Mit einem [dynamischen Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich) kann der Speicher im Winter günstigen Nachtstrom zwischenspeichern. Das erhöht die Zyklenzahl in der sonnenarmen Zeit. Die HTW Berlin weist in der Stromspeicher-Inspektion 2026 allerdings darauf hin, dass sich Netzladen nur bei ausreichender Effizienz lohnt: Bei 10 ct Preisunterschied braucht das System mindestens rund 71 % Wirkungsgrad für den Weg Netz–Batterie–Haus. Für die Größenwahl sollte der Tarif ein Zusatznutzen bleiben, kein Hauptargument.",
        },
        { typ: "h3", text: "AC- oder DC-gekoppelt" },
        {
          typ: "p",
          text: "Bei neuen Anlagen ist der [DC-gekoppelte](/wissen/lexikon#dc-kopplung) Speicher am Hybridwechselrichter Standard – laut HTW Berlin über 90 % der 2025 installierten Systeme. Er arbeitet mit weniger Umwandlungsverlusten. Bei der Nachrüstung einer bestehenden Anlage ist AC-Kopplung oft einfacher. Die Kopplung ändert die sinnvolle Kapazität kaum, wohl aber die Kosten: Was ein Speicher gemeinsam installiert und nachgerüstet kostet, erklärt der Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "In fünf Schritten zur passenden Speichergröße",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Verbrauch ermitteln", "Jahresverbrauch der letzten Abrechnungen notieren. Wer einen Smart Meter hat, kann Tages- und Nachtverbrauch getrennt ablesen – das ist die genaueste Grundlage."],
            ["Zukunft einplanen", "Wärmepumpe, E-Auto oder Klimaanlage in den nächsten Jahren? Dann den zusätzlichen Verbrauch in die Rechnung aufnehmen."],
            ["Faustregel anwenden", "1 bis 1,5 kWh je 1.000 kWh Verbrauch, höchstens 1,5 kWh je kWp. Das ergibt den Korridor."],
            ["Simulieren", "Mit dem [Stromspeicher-Rechner](/rechner/stromspeicher) prüfen, wo innerhalb des Korridors das wirtschaftliche Optimum liegt."],
            ["System auswählen", "Auf nutzbare Kapazität, Leistung, Erweiterbarkeit, Garantiebedingungen und Wirkungsgrad achten. Wie lange ein Speicher hält, lesen Sie im Ratgeber [Stromspeicher Lebensdauer](/ratgeber/stromspeicher-lebensdauer)."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Herstellerneutral planen",
          text: "Ökovolt ist Partner von Sigenergy, Huawei, Fronius, Solis, meteocontrol und beim Speicher von BYD. Für die Größenwahl spielt der Hersteller aber eine untergeordnete Rolle: Entscheidend sind Ihr Lastprofil und die technischen Eckdaten. Wir legen den [Stromspeicher](/produkte/stromspeicher) auf Ihren Verbrauch aus – nicht auf die größte verfügbare Modulzahl.",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie groß sollte ein Stromspeicher für ein Einfamilienhaus sein?", a: `Für einen typischen 4-Personen-Haushalt mit 4.000 bis 5.000 kWh Verbrauch sind 5 bis 8 kWh sinnvoll. In unserer Simulation mit 4.500 kWh und 10 kWp liegt das wirtschaftliche Optimum bei ${fmt(OPT.kap)} kWh.` },
    { q: "Welche Speichergröße brauche ich für 10 kWp?", a: "Die Anlagengröße allein bestimmt die Speichergröße nicht. Nach HTW Berlin sind bei 10 kWp höchstens 15 kWh nutzbar sinnvoll – die tatsächlich passende Größe richtet sich aber nach dem Verbrauch. Bei 4.000 bis 5.000 kWh sind das meist 5 bis 8 kWh." },
    { q: "Ist ein 10-kWh-Speicher zu groß?", a: `Für einen reinen Haushaltsverbrauch unter 5.000 kWh ist 10 kWh meist größer als wirtschaftlich optimal. Mit Wärmepumpe, E-Auto oder hohem Abendverbrauch kann 10 kWh passen – in unserer Simulation etwa für einen Haushalt mit E-Auto und 12 kWp.` },
    { q: "Welche Speichergröße bei Wärmepumpe und E-Auto?", a: "Mit Wärmepumpe und E-Auto sind 10 bis 15 kWh üblich. Weil der Heizstrom vor allem im Winter anfällt, wächst der sinnvolle Speicher nicht proportional zum Verbrauch. Mehr bringt es, Wärmepumpe und Wallbox gezielt mittags laufen zu lassen." },
    { q: "Kann ich einen Stromspeicher später erweitern?", a: "Bei vielen modularen Hochvolt-Systemen ja, meist innerhalb einer vom Hersteller vorgegebenen Frist. Prüfen Sie vor dem Kauf, ob Erweiterungsmodule die Garantie beeinflussen und ob neue und gealterte Module gemeinsam voll genutzt werden können." },
    { q: "Wie berechne ich die Speichergröße selbst?", a: "Jahresverbrauch in kWh durch 1.000 teilen und mit 1 bis 1,5 multiplizieren – das ist die nutzbare Kapazität. Das Ergebnis darf nicht über 1,5 kWh je kWp Anlagenleistung liegen. Genauer wird es mit einer Stundensimulation wie im [Stromspeicher-Rechner](/rechner/stromspeicher)." },
    { q: "Lohnt sich ein kleiner Speicher mit 3 bis 5 kWh?", a: `Oft ja: Kleine Speicher werden fast täglich voll genutzt. In unserer Beispielrechnung spart ein 5-kWh-Speicher rund ${fmtEur(zeile(5).ersparnis)} pro Jahr und erreicht rund ${fmt(zeile(5).vollzyklen)} Vollzyklen jährlich.` },
  ],

  passend: [
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Autarkie und Optimum für Ihren Verbrauch simulieren." },
    { href: "/ratgeber/stromspeicher-kosten", titel: "Stromspeicher Kosten 2026", text: "Preise je kWh, Nachrüstung und Wirtschaftlichkeit." },
    { href: "/ratgeber/eigenverbrauch-erhoehen", titel: "Eigenverbrauch erhöhen", text: "Zehn Maßnahmen – nicht alle kosten Geld." },
    { href: "/ratgeber/stromspeicher-lebensdauer", titel: "Stromspeicher Lebensdauer", text: "Zyklen, Garantie und Kapazitätsverlust." },
  ],

  quellen: [
    { titel: "HTW Berlin – Empfehlungen zur Auslegung von Solarstromspeichern", url: "https://solar.htw-berlin.de/publikationen/auslegung-von-solarstromspeichern/", stand: "09/2026" },
    { titel: "HTW Berlin – Stromspeicher-Inspektion 2026", url: "https://solar.htw-berlin.de/studien/stromspeicher-inspektion-2026/", stand: "09/2026" },
    { titel: "HTW Berlin – Unabhängigkeitsrechner", url: "https://solar.htw-berlin.de/rechner/unabhaengigkeitsrechner/", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Lohnen sich Batteriespeicher für Photovoltaikanlagen?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/lohnen-sich-batteriespeicher-fuer-photovoltaikanlagen-24589", stand: "09/2026" },
    { titel: "Bundesverband Solarwirtschaft – FAQ Solarspitzengesetz", url: "https://www.solarwirtschaft.de/unsere-themen/photovoltaik/standpunkte/faq-solarspitzengesetz/", stand: "09/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
  ],

  seitenCta: { titel: "Welche Größe passt zu Ihnen?", text: "Stundensimulation mit Ihrem Verbrauch – inklusive E-Auto und Wärmepumpe.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Wir legen Ihren Speicher auf Ihren Verbrauch aus.",
    text: "Mit Blick auf Lastprofil, künftige Wärmepumpe oder E-Auto und die Erweiterbarkeit – damit Sie nicht für Kapazität bezahlen, die kaum arbeitet.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
