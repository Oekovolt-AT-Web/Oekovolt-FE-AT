// Ratgeber: KfW-Kredit 270 „Erneuerbare Energien – Standard“
// Quellen: KfW-Merkblatt Kredit Nr. 270 (Stand 05/2025, abgerufen 09/2026) und
// KfW-Konditionenübersicht für Endkreditnehmer, Stand 11.09.2026 (Programm 270,
// Verwendungszweck „PV-Aufdach“, beihilfefrei). Zinsen ändern sich laufend –
// die Tabelle bei der nächsten Aktualisierung mit www.kfw.de/konditionen abgleichen.

import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur100 = (n) => (Math.round(n / 100) * 100).toLocaleString("de-DE") + " €";
const pz = (n) => n.toFixed(2).replace(".", ",") + " %";

// Maximalzinssätze KfW 270, PV-Aufdach, beihilfefrei – Stand 11.09.2026
// [Sollzins, Effektivzins] je Preisklasse A, C, E, I
const KONDITIONEN_STAND = "11.09.2026";
const KOND = [
  { variante: "5 Jahre / 1 tilgungsfrei / 5 Jahre Zinsbindung", A: [4.24, 4.31], C: [4.94, 5.04], E: [6.04, 6.18], I: [10.64, 11.08] },
  { variante: "10 Jahre / 2 tilgungsfrei / 10 Jahre Zinsbindung", A: [4.43, 4.51], C: [5.13, 5.23], E: [6.23, 6.38], I: [10.83, 11.28] },
  { variante: "15 Jahre / 3 tilgungsfrei / 15 Jahre Zinsbindung", A: [4.83, 4.92], C: [5.53, 5.65], E: [6.63, 6.8], I: [11.23, 11.72] },
  { variante: "20 Jahre / 3 tilgungsfrei / 10 Jahre Zinsbindung", A: [4.62, 4.7], C: [5.32, 5.43], E: [6.42, 6.58], I: [11.02, 11.49] },
  { variante: "20 Jahre / 3 tilgungsfrei / 20 Jahre Zinsbindung", A: [5.08, 5.18], C: [5.78, 5.91], E: [6.88, 7.06], I: [11.48, 11.99] },
  { variante: "30 Jahre / 5 tilgungsfrei / 10 Jahre Zinsbindung", A: [4.65, 4.73], C: [5.35, 5.46], E: [6.45, 6.61], I: [11.05, 11.52] },
];
const zelle = ([soll, eff]) => `${pz(soll)} (${pz(eff)})`;

// Beispiel: 10-kWp-Anlage ohne Speicher aus dem Solarrechner, voll finanziert
const ANLAGE = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const KREDIT = Math.round(ANLAGE.investition / 100) * 100;

/** KfW-Tilgung: tilgungsfreie Jahre nur Zinsen, danach gleich hohe vierteljährliche Tilgungsraten. */
function kfwPlan(betrag, sollzins, jahre, freiJahre) {
  const quartaleTilgung = (jahre - freiJahre) * 4;
  const tilgung = betrag / quartaleTilgung;
  let rest = betrag;
  let zinsen = betrag * sollzins * freiJahre;
  let ersteRate = 0;
  for (let q = 0; q < quartaleTilgung; q++) {
    const z = (rest * sollzins) / 4;
    if (q === 0) ersteRate = tilgung + z;
    zinsen += z;
    rest -= tilgung;
  }
  return { zinsenGesamt: zinsen, rateFreiJahre: (betrag * sollzins) / 4, ersteRate };
}
const P10 = kfwPlan(KREDIT, KOND[1].C[0] / 100, 10, 2);
const P20 = kfwPlan(KREDIT, KOND[3].C[0] / 100, 20, 3);

const artikel = {
  slug: "kfw-kredit-270",
  title: "KfW-Kredit 270: Konditionen, Antrag und Voraussetzungen 2026",
  seoTitle: "KfW 270 für Photovoltaik 2026: Zinsen & Antrag | Ökovolt",
  kurzTitel: "KfW-Kredit 270",
  description:
    "KfW 270 für Photovoltaik und Speicher: aktuelle Zinsen (Stand 09/2026), wer den Kredit bekommt, Antrag über die Bank Schritt für Schritt und ob er sich lohnt.",
  excerpt:
    "Der KfW-Kredit 270 finanziert PV-Anlage und Speicher bis zu 100 %. Was er aktuell kostet, warum der Antrag vor dem Auftrag kommen muss und wann andere Wege günstiger sind.",
  hauptKeyword: "kfw 270",
  keywords: [
    "KfW 270",
    "KfW-Kredit 270 Photovoltaik",
    "KfW 270 Konditionen",
    "KfW 270 Privatpersonen",
    "KfW 270 Stromspeicher",
    "KfW Erneuerbare Energien Standard",
    "Photovoltaik Kredit KfW",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Home/download.jpg",
  bildAlt: "Luftbild eines Hausdachs mit dunklen Photovoltaikmodulen",
  badge: { wert: `ab ${pz(KOND[0].A[1])}`, text: `effektiv in der besten Preisklasse, Stand ${KONDITIONEN_STAND}` },

  kurzFazit: [
    "**KfW 270 ist ein zinsgünstiger Förderkredit, kein Zuschuss.** Er finanziert bis zu 100 % der Kosten für PV-Anlage und Batteriespeicher, auch für Privatpersonen, die einen Teil ihres Stroms einspeisen.",
    "**Der Antrag läuft über Ihre Bank und muss vor Beginn des Vorhabens gestellt werden** – eine nachträgliche Finanzierung schließt die KfW aus.",
    `**Der Zinssatz hängt von Bonität und Sicherheiten ab:** Für PV-Aufdachanlagen lagen die Maximalzinssätze am ${KONDITIONEN_STAND} je nach Laufzeit und Preisklasse zwischen ${pz(KOND[0].A[1])} und ${pz(KOND[4].I[1])} effektiv.`,
    "**Laufzeiten von 5 bis 30 Jahren mit bis zu 5 tilgungsfreien Jahren** – kostenlose Sondertilgungen sind aber nicht vorgesehen.",
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist der KfW-Kredit 270?",
      bloecke: [
        {
          typ: "p",
          text: "**Der KfW-Kredit 270 „Erneuerbare Energien – Standard“ ist ein Förderdarlehen der staatlichen KfW für Anlagen, die Strom oder Wärme aus erneuerbaren Energien erzeugen, und für Batteriespeicher.** Die KfW vergibt ihn nicht direkt, sondern über Banken und Sparkassen. Finanziert werden bis zu 100 % der förderfähigen Kosten, maximal 150 Millionen Euro je Vorhaben – für ein Einfamilienhaus also die komplette Anlage inklusive Planung und Montage. Die Kurzdefinition steht auch im [Lexikon](/wissen/lexikon#kfw-270).",
        },
        {
          typ: "p",
          text: "Anders als oft angenommen gibt es keinen Tilgungszuschuss. Der Vorteil liegt in langen Laufzeiten, tilgungsfreien Anlaufjahren und einer festen Zinsbindung. Ob der Kredit günstiger ist als ein normaler Bankkredit, hängt von Ihrer Bonität ab – dazu unten mehr. Einen Überblick über alle Förderwege gibt die Seite [Finanzierung](/service/finanzierung).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Stand und Hinweis",
          text: `Konditionen laut KfW-Konditionenübersicht vom ${KONDITIONEN_STAND}, Programmregeln laut Merkblatt Kredit Nr. 270 (Stand 05/2025). Die KfW passt die Zinsen regelmäßig an; verbindlich ist der Zinssatz am Tag der Zusage. Dieser Ratgeber ist keine Finanz- oder Rechtsberatung.`,
        },
      ],
    },
    {
      id: "konditionen",
      titel: "KfW 270 Konditionen: Zinsen und Laufzeiten 2026",
      tocLabel: "Konditionen",
      bloecke: [
        {
          typ: "p",
          text: "**Der Zinssatz im KfW-Kredit 270 ist risikogerecht: Ihre Bank ordnet Sie nach Bonität und Sicherheiten einer von neun Preisklassen (A bis I) zu, für jede Klasse legt die KfW einen Maximalzinssatz fest.** Ihre Bank kann darunter bleiben, aber nicht darüber. Für PV-Aufdachanlagen und dazugehörige Speicher gibt es einen eigenen Verwendungszweck mit etwas günstigeren Sätzen.",
        },
        {
          typ: "tabelle",
          caption: `KfW 270, Verwendungszweck PV-Aufdach (beihilfefrei): Maximalzinssätze, Sollzins (Effektivzins), Stand ${KONDITIONEN_STAND}`,
          kopf: ["Laufzeit / tilgungsfreie Jahre / Zinsbindung", "Preisklasse A", "Preisklasse C", "Preisklasse E", "Preisklasse I"],
          zeilen: KOND.map((k) => [k.variante, zelle(k.A), zelle(k.C), zelle(k.E), zelle(k.I)]),
          hervorheben: 1,
          markierteZeile: 1,
          minBreite: 760,
          fussnote: "Quelle: KfW-Konditionenübersicht für Endkreditnehmer. Auszahlung 100 %, Bereitstellungsprovision 0,15 % pro Monat. Preisklassen B, D und F bis H liegen dazwischen. Bei Laufzeiten über der Zinsbindung macht die KfW vor deren Ende ein Anschlussangebot.",
        },
        {
          typ: "liste",
          punkte: [
            "**Mindestlaufzeit:** 2 Jahre. Bis 5 Jahre mit höchstens 1, bis 10 Jahre mit höchstens 2, bis 15 und 20 Jahre mit höchstens 3 und bis 30 Jahre mit höchstens 5 tilgungsfreien Anlaufjahren.",
            "**Tilgung:** Nach den tilgungsfreien Jahren vierteljährlich in gleich hohen Tilgungsraten, vorher nur Zinsen.",
            "**Abruf:** innerhalb von 12 Monaten nach Zusage, verlängerbar um bis zu 24 Monate. Ab 6 Monaten nach Zusage kostet der nicht abgerufene Betrag 0,15 % Bereitstellungsprovision pro Monat.",
            "**Sondertilgung:** Außerplanmäßige Tilgungen sind nur gegen Vorfälligkeitsentschädigung möglich.",
          ],
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Wer bekommt den KfW-Kredit 270 – auch Privatpersonen?",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Ja, Privatpersonen können KfW 270 beantragen, wenn sie mit der PV-Anlage einen Teil des Stroms ins Netz einspeisen oder verkaufen.** Die KfW behandelt sie dann als gewerblich tätig. Wer dagegen den gesamten Strom selbst verbraucht und keine Einspeisung plant, gehört nach dem Merkblatt nicht zum Kreis der Antragsberechtigten. Steuerlich ändert das nichts: Die Anlage bleibt in aller Regel einkommensteuerfrei, wie der Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern) zeigt.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Antragsberechtigt", text: "Privatpersonen mit Einspeisung, Unternehmen jeder Größe, Freiberufler, Landwirte, gemeinnützige Organisationen mit Einspeisung, Contracting-Anbieter sowie Unternehmen mit mehrheitlich öffentlicher Beteiligung." },
            { titel: "Nicht antragsberechtigt", text: "Bund, Länder und deren Einrichtungen, Kommunen und kommunale Eigenbetriebe. Ausgeschlossen sind außerdem Umschuldungen und bereits begonnene Vorhaben." },
          ],
        },
        { typ: "h3", text: "Was finanziert wird" },
        {
          typ: "checkliste",
          punkte: [
            "**Photovoltaikanlagen** auf Dach, Fassade oder Freifläche, die die technischen Anforderungen des EEG erfüllen – inklusive Planung, Projektierung und Installation.",
            "**Batteriespeicher** zur PV-Anlage, auch als Nachrüstung zu einer bestehenden Anlage.",
            "**Erweiterungen, Modernisierungen und gebrauchte Anlagen**, zum Beispiel beim [Repowering](/service/repowering).",
            "**Moderne Messeinrichtungen und intelligente Messsysteme** mit den nötigen Umbauten.",
            "**Anlagen zur Wärmeerzeugung aus erneuerbaren Energien** wie Wärmepumpen und Solarthermie – für Privathaushalte ist bei der Wärmepumpe meist die Heizungsförderung der KfW das passendere Programm, siehe [Wärmepumpe Kosten](/ratgeber/waermepumpe-kosten).",
          ],
        },
      ],
    },
    {
      id: "antrag",
      titel: "KfW 270 beantragen: Schritt für Schritt",
      tocLabel: "Antrag",
      bloecke: [
        {
          typ: "p",
          text: "**Den Antrag stellen Sie bei einer Bank oder Sparkasse Ihrer Wahl – und zwar bevor Sie die Anlage verbindlich beauftragen.** Als Vorhabensbeginn gilt in der Regel der Abschluss eines Liefer- oder Leistungsvertrags. Angebote einholen, Dach prüfen lassen und planen dürfen Sie vorher. Wer zuerst unterschreibt und dann den Kredit beantragt, bekommt ihn nicht mehr.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Angebot einholen", "Lassen Sie sich ein detailliertes Angebot für Anlage und Speicher erstellen, noch ohne verbindliche Auftragserteilung. Es dient der Bank als Kostennachweis."],
            ["Bank ansprechen", "Nicht jede Bank vermittelt Förderkredite gern, gerade bei kleinen Beträgen. Fragen Sie Hausbank und weitere Institute früh an und vergleichen Sie die Zinssätze."],
            ["Bestätigung zum Antrag erzeugen", "Im gBzA-Center der KfW geben Sie die Vorhabensdaten online ein und erhalten die „gewerbliche Bestätigung zum Antrag“ mit einer ID, die Sie an die Bank weitergeben."],
            ["Bonitätsprüfung und Zusage", "Die Bank prüft Einkommen und Sicherheiten, ordnet die Preisklasse zu und leitet den Antrag an die KfW weiter. Der Zinssatz wird am Tag der Zusage festgelegt."],
            ["Auftrag erteilen und abrufen", "Nach der Zusage beauftragen Sie den Fachbetrieb. Das Geld rufen Sie innerhalb von 12 Monaten ab – ab dem 7. Monat fällt Bereitstellungsprovision an."],
            ["Anlage anmelden und tilgen", "Nach der Inbetriebnahme folgen Netzbetreiber und Marktstammdatenregister, siehe [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden). Die Rückzahlung beginnt nach den tilgungsfreien Jahren."],
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Einspeisevergütung und KfW: nur beihilfefrei",
          text: "Laut Merkblatt darf eine Anlage, die EEG-Einspeisevergütung erhält, nur mit einem KfW-Kredit ohne staatliche Beihilfe finanziert werden. Deshalb gelten für private PV-Anlagen die beihilfefreien Konditionen aus der Tabelle oben. Andere Förderungen wie Landeszuschüsse lassen sich grundsätzlich kombinieren, soweit sie ebenfalls keine Beihilfe darstellen oder die Beihilfegrenzen eingehalten werden.",
        },
      ],
    },
    {
      id: "rechenbeispiel",
      titel: "Rechenbeispiel: Was kostet eine PV-Anlage mit KfW-Kredit?",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Eine 10-kWp-Anlage für rund ${eur100(KREDIT)}, voll über KfW 270 finanziert, kostet in Preisklasse C bei 10 Jahren Laufzeit rund ${eur100(P10.zinsenGesamt)} Zinsen, bei 20 Jahren rund ${eur100(P20.zinsenGesamt)}.** Die Anlagekosten stammen aus unserem [Solarrechner](/solarrechner) (Süddach, ohne Speicher), die Zinssätze aus der Konditionenübersicht vom ${KONDITIONEN_STAND}.`,
        },
        {
          typ: "tabelle",
          caption: `KfW 270 für ${eur100(KREDIT)} Kreditbetrag, Preisklasse C (Maximalzinssatz), vereinfachte Rechnung`,
          kopf: ["", "10 Jahre / 2 tilgungsfrei", "20 Jahre / 3 tilgungsfrei, 10 Jahre Zinsbindung"],
          zeilen: [
            ["Sollzins", pz(KOND[1].C[0]), pz(KOND[3].C[0])],
            ["Quartalsrate in den tilgungsfreien Jahren", eur(P10.rateFreiJahre), eur(P20.rateFreiJahre)],
            ["Erste Quartalsrate mit Tilgung", eur(P10.ersteRate), eur(P20.ersteRate)],
            ["Zinsen über die Laufzeit", eur100(P10.zinsenGesamt), eur100(P20.zinsenGesamt)],
            ["Vorteil der Anlage pro Jahr (Solarrechner)", eur(ANLAGE.nutzenProJahr), eur(ANLAGE.nutzenProJahr)],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Annahmen: gleich hohe vierteljährliche Tilgungsraten nach den tilgungsfreien Jahren, Zinsen quartalsweise auf die Restschuld, keine Bereitstellungsprovision. Beim 20-Jahres-Kredit wird für die Jahre nach der Zinsbindung derselbe Zins angenommen. Die Quartalsraten sinken mit jeder Tilgung. Orientierungswerte, keine Kreditzusage.",
        },
        {
          typ: "p",
          text: `Die Zahlen zeigen den wichtigsten Punkt: Die Anlage erwirtschaftet im Beispiel rund ${eur(ANLAGE.nutzenProJahr)} Vorteil im Jahr. Bei 10 Jahren Laufzeit zahlen Sie nach der tilgungsfreien Zeit anfangs rund ${eur100(P10.ersteRate * 4)} im Jahr, bei 20 Jahren rund ${eur100(P20.ersteRate * 4)} – ${P20.ersteRate * 4 > ANLAGE.nutzenProJahr ? "in beiden Fällen mehr, als die Anlage in diesen Jahren einbringt. Die Differenz schrumpft mit jeder Tilgung, die längere Laufzeit kostet aber deutlich mehr Zinsen." : "die längere Laufzeit deckt sich damit weitgehend mit dem Ertrag, kostet aber deutlich mehr Zinsen."} Wie lange es dauert, bis sich die Anlage bezahlt macht, erklärt der Ratgeber [Amortisation](/ratgeber/photovoltaik-amortisation).`,
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Rechnen Sie Ihre Anlage durch",
          text: "Investition, jährlicher Vorteil und Amortisation für Ihr Dach – als Grundlage für das Gespräch mit der Bank.",
          label: "Zum Solarrechner",
        },
      ],
    },
    {
      id: "lohnt-sich",
      titel: "Lohnt sich KfW 270? Vorteile, Nachteile und Alternativen",
      tocLabel: "Lohnt es sich?",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Vorteile", text: "Bis zu 100 % Finanzierung ohne Eigenkapital, lange Laufzeiten, tilgungsfreie Anlaufjahre, feste Zinsbindung und kombinierbar mit Zuschüssen und Steuervorteilen. Auch Speicher-Nachrüstungen sind finanzierbar." },
            { titel: "Nachteile", text: "Zins abhängig von Bonität und nicht automatisch niedriger als bei anderen Krediten, bankübliche Sicherheiten, keine kostenlosen Sondertilgungen, Bereitstellungsprovision bei spätem Abruf und für Banken bei kleinen Beträgen wenig attraktiv." },
          ],
        },
        {
          typ: "p",
          text: "**KfW 270 lohnt sich vor allem, wenn Sie kein Eigenkapital einsetzen wollen, eine gute Bonität haben und eine lange feste Zinsbindung schätzen.** Vergleichen Sie den Effektivzins immer mit Alternativen: einem Modernisierungskredit, der Aufstockung einer Baufinanzierung oder – wenn Liquidität vorhanden ist – dem Kauf aus Eigenkapital. Wer gar nicht investieren möchte, findet einen Vergleich im Ratgeber [Photovoltaik mieten oder kaufen](/ratgeber/photovoltaik-mieten-oder-kaufen).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Förderung kombinieren",
          text: "Zusätzlich zum KfW-Kredit gelten immer der Nullsteuersatz, die Einkommensteuerbefreiung und die EEG-Vergütung. In einigen Bundesländern und Kommunen gibt es Zuschüsse, etwa für Speicher. Welche Programme für Ihren Standort infrage kommen, zeigen der [Förder-Check](/foerdercheck) und die Übersicht der [Landesförderungen](/forderungen/landesforderungen). Wichtig: Auch Zuschussanträge müssen meist vor der Auftragsvergabe gestellt werden.",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie hoch ist der Zinssatz für den KfW-Kredit 270 aktuell?", a: `Am ${KONDITIONEN_STAND} lagen die Maximalzinssätze für PV-Aufdachanlagen in der besten Preisklasse A zwischen ${pz(KOND[0].A[1])} (5 Jahre) und ${pz(KOND[4].A[1])} (20 Jahre Zinsbindung) effektiv. Welche Preisklasse Sie erhalten, entscheidet Ihre Bank nach Bonität und Sicherheiten. Aktuelle Werte veröffentlicht die KfW unter kfw.de/konditionen.` },
    { q: "Kann ich KfW 270 als Privatperson beantragen?", a: "Ja, wenn Sie mit der Anlage einen Teil des Stroms einspeisen oder verkaufen. Privatpersonen gelten dann im Sinne des Programms als gewerblich tätig. Der Antrag läuft wie bei Unternehmen über eine Bank." },
    { q: "Ist der KfW-Kredit 270 ein Zuschuss?", a: "Nein. KfW 270 ist ein reines Darlehen ohne Tilgungszuschuss. Der Vorteil liegt in den Konditionen: bis zu 100 % Finanzierung, lange Laufzeiten, tilgungsfreie Anlaufjahre und feste Zinsbindung." },
    { q: "Kann ich den KfW-Kredit nach dem Kauf der Anlage beantragen?", a: "Nein. Der Antrag muss vor Beginn des Vorhabens bei der Bank gestellt werden. Umschuldungen und Nachfinanzierungen bereits begonnener oder abgeschlossener Vorhaben schließt die KfW ausdrücklich aus." },
    { q: "Kann ich mit KfW 270 einen Stromspeicher finanzieren?", a: "Ja. Batteriespeicher für PV-Aufdachanlagen sind förderfähig – gemeinsam mit der Anlage oder als Nachrüstung zu einer bestehenden Anlage, wenn Sie einen Teil des Stroms einspeisen." },
    { q: "Kann ich den KfW-Kredit 270 vorzeitig zurückzahlen?", a: "Außerplanmäßige Tilgungen sind nur gegen Zahlung einer Vorfälligkeitsentschädigung möglich. Wer flexibel sondertilgen möchte, sollte das beim Vergleich mit anderen Krediten berücksichtigen." },
    { q: "Welche Sicherheiten verlangt die Bank?", a: "Die KfW verlangt bankübliche Sicherheiten, Art und Umfang vereinbaren Sie mit Ihrer Bank. Bessere Sicherheiten führen zu einer günstigeren Preisklasse und damit zu einem niedrigeren Zinssatz." },
  ],

  howTo: {
    name: "KfW-Kredit 270 beantragen",
    schritte: [
      { name: "Angebot einholen", text: "Detailliertes Angebot für PV-Anlage und Speicher ohne verbindliche Beauftragung erstellen lassen." },
      { name: "Bank auswählen", text: "Hausbank und weitere Institute anfragen und Konditionen vergleichen." },
      { name: "gBzA erzeugen", text: "Im gBzA-Center der KfW die Bestätigung zum Antrag erstellen und an die Bank geben." },
      { name: "Zusage abwarten", text: "Bank prüft Bonität und Sicherheiten, die KfW sagt den Kredit zu und legt den Zinssatz fest." },
      { name: "Auftrag erteilen", text: "Erst nach der Zusage den Fachbetrieb beauftragen und den Kredit innerhalb von 12 Monaten abrufen." },
    ],
  },

  passend: [
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Rate berechnen und Finanzierungswege vergleichen." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Alle Programme für Ihren Standort auf einen Blick." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp als Grundlage für den Kreditbetrag." },
    { href: "/ratgeber/photovoltaik-steuern", titel: "Photovoltaik und Steuern", text: "Nullsteuersatz und Einkommensteuerbefreiung." },
  ],

  quellen: [
    { titel: "KfW – Merkblatt Kredit Nr. 270, Erneuerbare Energien „Standard“", url: "https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000000178_M_270_EE-Standard.pdf", stand: "05/2025" },
    { titel: "KfW – Konditionenübersicht für Endkreditnehmer", url: "https://www.kfw.de/konditionen", stand: "09/2026" },
    { titel: "KfW – Erneuerbare Energien – Standard (270)", url: "https://www.kfw.de/inlandsfoerderung/Unternehmen/Energie-Umwelt/F%C3%B6rderprodukte/Erneuerbare-Energien-Standard-(270)/", stand: "09/2026" },
    { titel: "KfW – Erläuterungen zum Konditionentableau", url: "https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-(Inlandsf%C3%B6rderung)/PDF-Dokumente/6000004515_Fu%C3%9Fnoten_Konditionentableau.pdf", stand: "09/2026" },
  ],

  seitenCta: { titel: "Finanzierung klären", text: "Angebot als Grundlage für Ihren KfW-Antrag.", href: "/angebot", label: "Angebot anfragen" },
  cta: {
    title: "Ihr Angebot – passend für den KfW-Antrag.",
    text: "Wir erstellen ein detailliertes Angebot für Anlage und Speicher, das Sie vor der Beauftragung bei Ihrer Bank einreichen können, und übernehmen nach der Zusage Planung, Montage und Anmeldung.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Finanzierung ansehen", href: "/service/finanzierung" },
  },
};

export default artikel;
