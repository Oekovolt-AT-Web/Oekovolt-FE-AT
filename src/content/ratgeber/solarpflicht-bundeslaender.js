// Ratgeber: Solarpflicht 2026 – alle 16 Bundesländer
// Recherchestand 13.09.2026. Jede Landeszeile wurde an Landesrecht bzw. offiziellen
// Landesseiten geprüft; uneinheitliche Stände sind im Text gekennzeichnet.
// Kostenbeispiel nutzt die zentralen Annahmen des Solarrechners.

import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";

const eur100 = (n) => (Math.round(n / 100) * 100).toLocaleString("de-DE") + " €";

// Beispiel: Einfamilienhaus-Neubau mit 140 m² Bruttodachfläche
const DACH = 140;
const kwpFuer = (qm) => Math.round((qm / ANNAHMEN.qmProKwp) * 10) / 10;
const NRW_KWP = kwpFuer(DACH * 0.3); // 30 % der Bruttodachfläche
const NDS_KWP = kwpFuer(DACH * 0.5); // 50 % der Dachfläche
const kwpStr = (k) => String(k).replace(".", ",");
const kosten = (k) => eur100(k * preisProKwp(k));

const artikel = {
  slug: "solarpflicht-bundeslaender",
  title: "Solarpflicht 2026: Was in allen 16 Bundesländern gilt",
  seoTitle: "Solarpflicht 2026: Alle 16 Bundesländer | Ökovolt",
  kurzTitel: "Solarpflicht Bundesländer",
  description:
    "Solarpflicht 2026: Tabelle aller 16 Bundesländer für Neubau und Dachsanierung – mit Stichtagen, Mindestflächen, Ausnahmen und der neuen Bundespflicht ab 2027.",
  excerpt:
    "Sieben Länder verlangen bei neuen Wohnhäusern bereits eine Solaranlage, sechs davon auch bei der Dachsanierung. Die Übersicht zeigt Stichtage, Mindestumfang und Ausnahmen – und was die Bundespflicht ab 2027 ändert.",
  hauptKeyword: "solarpflicht",
  keywords: ["Solarpflicht", "Solarpflicht Bundesländer", "Solarpflicht 2026", "Solarpflicht Neubau", "Solarpflicht Dachsanierung", "PV-Pflicht", "Solarpflicht Bayern", "Solarpflicht NRW"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
  bildAlt: "Reihenhäuser mit Photovoltaikanlagen auf den Satteldächern",
  badge: { wert: "7 von 16", text: "Ländern mit Solarpflicht für neue Wohnhäuser" },

  kurzFazit: [
    "**Eine Solarpflicht für private Wohnhäuser gilt 2026 in sieben Ländern:** Baden-Württemberg, Berlin, Bremen, Hamburg, Niedersachsen, Nordrhein-Westfalen und Schleswig-Holstein – jeweils beim Neubau.",
    "In sechs dieser Länder greift sie auch bei einer **grundlegenden Dachsanierung**. Schleswig-Holstein verlangt das nur bei Nichtwohngebäuden.",
    "Bayern hat für Wohngebäude nur eine **Soll-Vorschrift** ohne Sanktion; Rheinland-Pfalz und das Saarland verlangen bei Neubauten eine Vorbereitung für eine spätere PV-Anlage.",
    "Wer ein bestehendes Haus nur bewohnt, ist nirgends verpflichtet. Der Bund führt über das Gebäudemodernisierungsgesetz eine **gestaffelte Pflicht** ein: ab 2027 für neue Nichtwohngebäude, ab 2030 für neue Wohngebäude.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Gibt es eine Solarpflicht für mein Haus?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Solarpflicht betrifft Sie nur, wenn Sie neu bauen oder das Dach grundlegend erneuern – und auch dann nur in bestimmten Bundesländern.** Für bestehende Häuser ohne Baumaßnahme gibt es 2026 in keinem Bundesland eine Nachrüstpflicht. Die Regeln stehen nicht in einem Bundesgesetz, sondern in Landesbauordnungen oder Klimaschutzgesetzen der Länder – deshalb unterscheiden sich Stichtage, Mindestflächen und Ausnahmen erheblich.",
        },
        {
          typ: "p",
          text: "Entscheidend für die Frage, ob Ihr Vorhaben unter die Pflicht fällt, ist fast immer ein Datum: der Eingang des Bauantrags, der Baubeginn oder der Beginn der Dachsanierung. Wer vor dem Stichtag eingereicht hat, ist in der Regel nicht betroffen. Erfüllen lässt sich die Pflicht praktisch überall mit Photovoltaik, meist alternativ auch mit Solarthermie.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Pflicht für neue Wohnhäuser", text: "Baden-Württemberg, Berlin, Bremen, Hamburg, Niedersachsen, Nordrhein-Westfalen, Schleswig-Holstein." },
            { titel: "Nur Soll-Regel oder Vorbereitung", text: "Bayern (Soll-Vorschrift), Rheinland-Pfalz und Saarland (Tragwerk „PV-ready“)." },
            { titel: "Keine Pflicht für Wohngebäude", text: "Brandenburg, Hessen, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt, Thüringen." },
          ],
        },
      ],
    },
    {
      id: "tabelle",
      titel: "Solarpflicht nach Bundesland: die Übersicht für Wohngebäude",
      tocLabel: "Tabelle 16 Länder",
      bloecke: [
        {
          typ: "p",
          text: "Die Tabelle zeigt, was für **Wohngebäude** gilt – also für Ein-, Zwei- und Mehrfamilienhäuser. Regeln für Gewerbehallen, öffentliche Gebäude und Parkplätze folgen im nächsten Abschnitt. Wo Fachquellen und Landesseiten unterschiedliche Stände nennen, ist das markiert.",
        },
        {
          typ: "tabelle",
          caption: "Solarpflicht für Wohngebäude in allen 16 Bundesländern, Stand 13. September 2026",
          kopf: ["Bundesland", "Neubau", "Dachsanierung im Bestand", "Mindestumfang", "Rechtsgrundlage"],
          zeilen: [
            ["**Baden-Württemberg**", "Pflicht, Bauantrag ab 1.5.2022", "Pflicht bei grundlegender Dachsanierung, Baubeginn ab 1.1.2023", "60 % der geeigneten Dachfläche; nur ab 20 m² zusammenhängender Eignungsfläche", "§ 23 KlimaG BW, PVPf-VO"],
            ["**Bayern**", "nur Soll-Vorschrift, Bauantrag ab 1.1.2025", "nur Soll-Vorschrift bei Dacherneuerung ab 2025", "„angemessene Auslegung“ (Richtwert: ein Drittel der geeigneten Dachfläche)", "Art. 44a BayBO"],
            ["**Berlin**", "Pflicht seit 1.1.2023 (Nutzfläche über 50 m²)", "Pflicht bei wesentlichem Umbau des Dachs seit 1.1.2023", "30 % der Brutto- (Neubau) bzw. Nettodachfläche; bei 1–2 Wohnungen genügen 2 kW", "Solargesetz Berlin"],
            ["**Brandenburg**", "keine Pflicht", "keine Pflicht", "–", "§ 32a BbgBO gilt nur für öffentliche und gewerbliche Gebäude – Streichung 2026 geplant, **Stand prüfen**"],
            ["**Bremen**", "Pflicht, Bauantrag ab 1.7.2025 (Dachfläche ab 50 m²)", "Pflicht bei grundlegender Dachsanierung seit 1.7.2024 (Dachfläche ab 25 m²)", "Neubau: 50 % der Dachfläche; Bestand: mind. 1 kW, Frist zwei Jahre", "Bremisches Solargesetz"],
            ["**Hamburg**", "Pflicht (Neubau), Mindestbelegung seit 1.1.2024", "Pflicht bei wesentlichem Dachumbau (über 50 % der Dachhaut) – **laut hamburg.de seit 2024, Fachportale nennen teils 2025**", "30 % der Brutto- bzw. Nettodachfläche; ab 50 m² Bruttodachfläche", "HmbKliSchG, PVUmsVO"],
            ["**Hessen**", "keine Pflicht", "keine Pflicht", "–", "Hessisches Energiegesetz (nur Landesgebäude, Parkplätze)"],
            ["**Mecklenburg-Vorpommern**", "keine Pflicht", "keine Pflicht", "–", "Klimaschutzgesetz mit Solarpflicht geplant, nicht beschlossen"],
            ["**Niedersachsen**", "Pflicht, Bauantrag ab 1.1.2025 (Dachfläche ab 50 m²)", "Pflicht bei Erneuerung der Dachhaut ab 50 m², seit 2025", "50 % der Dachfläche", "§ 32a NBauO"],
            ["**Nordrhein-Westfalen**", "Pflicht, Bauantrag ab 1.1.2025", "Pflicht bei vollständiger Erneuerung der Dachhaut, Beginn ab 1.1.2026", "30 % der Brutto- bzw. Nettodachfläche oder 3 kWp (1–2 Wohnungen), 4 kWp (3–5), 8 kWp (6–10)", "§ 42a BauO NRW, SAN-VO NRW"],
            ["**Rheinland-Pfalz**", "keine Pflicht; Tragwerk muss PV-tauglich sein (Dach ab 50 m²)", "keine Pflicht; PV-Vorbereitung bei grundlegender Dachsanierung", "–", "Landessolargesetz (LSolarG)"],
            ["**Saarland**", "keine Pflicht; PV-Vorbereitung des Dachs", "keine Pflicht", "–", "Landesbauordnung (Pflicht nur für öffentliche und gewerbliche Gebäude)"],
            ["**Sachsen**", "keine Pflicht", "keine Pflicht", "–", "–"],
            ["**Sachsen-Anhalt**", "keine Pflicht", "keine Pflicht", "–", "–"],
            ["**Schleswig-Holstein**", "Pflicht seit 29.3.2025; Bauanträge und Baubeginne bis 29.3.2026 ausgenommen", "keine Pflicht für Wohngebäude", "geeignete Dachfläche grundsätzlich vollständig", "EWKG Schleswig-Holstein"],
            ["**Thüringen**", "keine Pflicht", "keine Pflicht", "–", "–"],
          ],
          minBreite: 980,
          fussnote: "Vereinfachte Darstellung ohne Gewähr. Maßgeblich ist die jeweils gültige Fassung des Landesrechts; Details zu Ausnahmen, Nachweisen und Übergangsfristen stehen in den Verordnungen und FAQ der Länder (siehe Quellen). Kommunen können in Bebauungsplänen oder Kaufverträgen zusätzliche Solarvorgaben machen.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Hier sind die Angaben 2026 nicht einheitlich",
          text: "**Brandenburg:** Die Landesregierung will die bestehende Pflicht für öffentliche und gewerbliche Gebäude mit der Bauordnungsnovelle streichen; ob und ab wann das gilt, sollten Bauherren beim Bauamt erfragen. **Hamburg:** Für den Dachumbau im Bestand nennen Fachportale teils 2025, die Umweltbehörde auf hamburg.de 2024. **Saarland:** Für die Pflicht an Nichtwohngebäuden werden April und September 2025 als Stichtag genannt. **Mecklenburg-Vorpommern:** Ein Klimaschutzgesetz mit gestaffelter Solarpflicht ist seit Jahren angekündigt, aber nicht beschlossen.",
        },
      ],
    },
    {
      id: "nichtwohngebaeude",
      titel: "Gewerbe, öffentliche Gebäude und Parkplätze: Hier ist die Pflicht weiter verbreitet",
      tocLabel: "Gewerbe & Parkplätze",
      bloecke: [
        {
          typ: "p",
          text: "**Für Nichtwohngebäude gilt die Solarpflicht in deutlich mehr Ländern als für Wohnhäuser.** Viele Länder haben zuerst Gewerbehallen, Bürogebäude und landeseigene Bauten verpflichtet, weil große, flache Dächer besonders wirtschaftlich zu belegen sind. Für Unternehmen lohnt deshalb auch in Ländern ohne Wohngebäudepflicht ein genauer Blick.",
        },
        {
          typ: "liste",
          punkte: [
            "**Bayern:** Pflicht für neue gewerblich oder industriell genutzte Gebäude seit 1. März 2023, für sonstige Nichtwohngebäude seit 1. Juli 2023, bei vollständiger Erneuerung der Dachhaut seit 1. Januar 2025.",
            "**Baden-Württemberg, Berlin, Bremen, Hamburg, Niedersachsen, Nordrhein-Westfalen:** Die Pflicht gilt für Nichtwohngebäude mindestens im gleichen Umfang wie für Wohnhäuser, teils mit früheren Stichtagen (NRW: Neubau seit 1. Januar 2024).",
            "**Schleswig-Holstein:** Nichtwohngebäude seit 2023 – bereits bei Renovierung von mehr als 10 % der Dachfläche. Parkplätze ab 70 Stellplätzen.",
            "**Rheinland-Pfalz:** gewerbliche Neubauten seit 2023, öffentliche Gebäude seit 2024, dazu große Parkplätze.",
            "**Saarland:** öffentliche und gewerbliche Gebäude seit 2025 mit mindestens 60 % der geeigneten Dachfläche ab 100 m² Dachfläche.",
            "**Hessen:** nur landeseigene Gebäude und neue Parkplätze ab 50 Stellplätzen.",
          ],
        },
        {
          typ: "p",
          text: "Wie sich eine Pflichtanlage auf einem Betriebsdach wirtschaftlich nutzen lässt – Eigenverbrauch nach Lastgang, Abschreibung und Direktvermarktung –, erklärt unser Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "bund",
      titel: "Kommt eine bundesweite Solarpflicht?",
      tocLabel: "Bundespflicht ab 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Ja – aber zuerst für Nichtwohngebäude und erst ab 2030 für neue Wohnhäuser.** Das Gebäudemodernisierungsgesetz (GModG), das das Gebäudeenergiegesetz ablöst, wurde am 10. Juli 2026 von Bundestag und Bundesrat verabschiedet und am 28. Juli 2026 im Bundesgesetzblatt verkündet. Es setzt die EU-Gebäuderichtlinie (EPBD) um und enthält in § 106 erstmals eine bundesweite Solarpflicht.",
        },
        {
          typ: "tabelle",
          caption: "Stufenplan der bundesweiten Solarpflicht nach § 106 GModG (nach Angaben von Bundesregierung und Fachpresse)",
          kopf: ["Ab", "Betroffen"],
          zeilen: [
            ["1.1.2027", "neue öffentliche Nichtwohngebäude und neue Nichtwohngebäude mit mehr als 250 m² Nutzfläche"],
            ["1.1.2028", "bestehende Nichtwohngebäude bei größerer Renovierung (Schwellen ab 500 m²) sowie bestehende öffentliche Gebäude ab 2.000 m²"],
            ["1.1.2029 / 2031", "Schwellen für bestehende öffentliche Gebäude sinken auf 750 m² bzw. 250 m²"],
            ["1.1.2030", "**alle neuen Wohngebäude** sowie neue überdachte Stellplätze, die direkt an ein Gebäude grenzen"],
          ],
          fussnote: "Bestehende private Wohngebäude sind nach der Bundesregel nicht betroffen, auch nicht bei Sanierung. Ausnahmen gelten, wenn eine Anlage technisch unmöglich, funktional nicht realisierbar oder wirtschaftlich unzumutbar ist. Die genauen Schwellen der verkündeten Fassung sollten vor einer Planung im Gesetzestext geprüft werden.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Landesrecht bleibt bestehen",
          text: "Die Bundesregel ist ein Mindeststandard. Strengere Landesvorschriften – etwa die Pflicht bei der Dachsanierung in Nordrhein-Westfalen oder Niedersachsen – gelten weiter. Wer 2026 in einem Land mit Solarpflicht baut, muss also schon heute das Landesrecht erfüllen, nicht erst 2030.",
        },
      ],
    },
    {
      id: "dachsanierung",
      titel: "Wann gilt eine Dachsanierung als pflichtauslösend?",
      tocLabel: "Dachsanierung",
      bloecke: [
        {
          typ: "p",
          text: "**Pflichtauslösend ist fast überall nur eine umfassende Erneuerung der Dachhaut – nicht jede Reparatur.** Wer einzelne Ziegel tauscht, eine Rinne erneuert oder eine undichte Stelle abdichtet, löst keine Solarpflicht aus. Die Länder definieren die Schwelle unterschiedlich:",
        },
        {
          typ: "liste",
          punkte: [
            "**Nordrhein-Westfalen:** vollständige Erneuerung der Dachhaut, die ab dem 1. Januar 2026 beginnt.",
            "**Hamburg:** wesentlicher Umbau, wenn mehr als 50 % der wasserführenden Schicht erneuert werden – auch durch Dachausbau oder Aufstockung.",
            "**Bremen:** grundlegende Dachsanierung; die Anlage (mindestens 1 kW) muss innerhalb von zwei Jahren nach Abschluss folgen.",
            "**Niedersachsen:** Erneuerung der Dachhaut bis zur wasserführenden Schicht ab 50 m² erneuerter Fläche; ausgenommen sind unvorhersehbare Unwetterschäden.",
            "**Baden-Württemberg:** grundlegende Dachsanierung mit Baubeginn ab 2023; Nachweis spätestens zwölf Monate nach Fertigstellung.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Sanierung und Solaranlage zusammen planen",
          text: "Wer ohnehin ein Gerüst stellt und die Dachhaut erneuert, spart bei gleichzeitiger Montage Gerüst- und Anfahrtskosten. Klären Sie vor der Sanierung die Statik, Kabelwege und den Platz im [Zählerschrank](/wissen/lexikon#zaehlerschrank). Bei Flachdächern kommen Ballast und Aufständerung dazu – mehr dazu im Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
        },
      ],
    },
    {
      id: "ausnahmen",
      titel: "Ausnahmen: Wann die Solarpflicht entfällt",
      tocLabel: "Ausnahmen",
      bloecke: [
        {
          typ: "p",
          text: "**Die Pflicht entfällt oder verringert sich, wenn eine Anlage technisch nicht möglich, rechtlich unzulässig oder wirtschaftlich unzumutbar ist.** Die Ausnahmen ähneln sich in allen Ländern, im Detail gibt es aber Unterschiede:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Zu kleine oder ungeeignete Dächer:** etwa Nutzflächen bis 50 m² (Berlin, NRW), Dachflächen unter 50 m² (Niedersachsen, Bremen-Neubau) oder weniger als 20 m² zusammenhängende Eignungsfläche (Baden-Württemberg).",
            "**Nordausrichtung oder starke Verschattung:** Nordseitige Dachflächen gelten vielerorts als ungeeignet – Bremen etwa nimmt nach Norden geneigte Dächer mit mehr als 20° Neigung aus.",
            "**Statik und Dachmaterial:** unzureichende Tragfähigkeit, Reet-, Stroh- oder Holzschindeldächer.",
            "**Denkmalschutz und Satzungen:** wenn eine Anlage denkmalrechtlich oder nach Bebauungsplan unzulässig ist.",
            "**Wirtschaftliche Unzumutbarkeit:** in Hamburg etwa bei einer Amortisation über 20 Jahre, in NRW über 25 Jahre; Baden-Württemberg arbeitet mit Mehrkostenschwellen bezogen auf die Baukosten.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          text: "Ausnahmen gelten nicht automatisch. Meist müssen Sie sie dokumentieren oder bei der Behörde beantragen – oft zusammen mit dem Bauantrag. Bewahren Sie Nachweise auf: Hamburg etwa verlangt eine Aufbewahrung von zehn Jahren. Ob eine Anlage auf Ihrem Dach denkmal- oder baurechtlich zulässig ist, erklärt der Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
        },
      ],
    },
    {
      id: "erfuellen",
      titel: "So erfüllen Sie die Solarpflicht – und wann mehr sinnvoll ist",
      tocLabel: "Pflicht erfüllen",
      bloecke: [
        {
          typ: "p",
          text: "**Erfüllt ist die Pflicht, wenn eine Solaranlage im vorgeschriebenen Mindestumfang installiert und betrieben wird.** In den meisten Ländern zählt neben Photovoltaik auch Solarthermie, und Module an der Fassade oder auf Nebengebäuden können angerechnet werden. Einige Länder erlauben, das Dach an Dritte zu verpachten, die die Anlage betreiben.",
        },
        {
          typ: "p",
          text: `Wie groß die Pflichtanlage ausfällt, zeigt ein Beispiel: Ein neues Einfamilienhaus mit ${DACH} m² Bruttodachfläche braucht in Nordrhein-Westfalen mindestens 30 % Belegung – rund ${kwpStr(NRW_KWP)} kWp bei etwa ${ANNAHMEN.qmProKwp} m² je [Kilowatt-Peak](/wissen/lexikon#kwp). Alternativ genügen dort 3 kWp. In Niedersachsen wären 50 % der Dachfläche nötig, also rund ${kwpStr(NDS_KWP)} kWp.`,
        },
        {
          typ: "tabelle",
          caption: `Pflichtumfang und Orientierungskosten für ein Einfamilienhaus mit ${DACH} m² Bruttodachfläche`,
          kopf: ["Variante", "Leistung", "Orientierungspreis"],
          zeilen: [
            ["NRW, Mindestleistung Ein- und Zweifamilienhaus", "3 kWp", kosten(3)],
            ["NRW / Berlin, 30 % der Dachfläche", `ca. ${kwpStr(NRW_KWP)} kWp`, kosten(NRW_KWP)],
            ["Niedersachsen, 50 % der Dachfläche", `ca. ${kwpStr(NDS_KWP)} kWp`, kosten(NDS_KWP)],
          ],
          hervorheben: 2,
          fussnote: "Richtwerte aus den Annahmen unseres Solarrechners (Endpreise bei 0 % Umsatzsteuer, ohne Speicher), keine Angebote. Kleine Anlagen sind je kWp teurer, weil Fixkosten wie Gerüst und Anmeldung anteilig stärker ins Gewicht fallen.",
        },
        {
          typ: "p",
          text: "Die Mindestanlage ist selten die wirtschaftlichste. Weil Gerüst, Elektroinstallation und Anmeldung ohnehin anfallen, sinkt der Preis je kWp mit jeder weiteren Modulreihe. Wer eine Wärmepumpe oder ein E-Auto plant, fährt mit einer größeren, auf den Verbrauch ausgelegten Anlage meist besser – mehr dazu in [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich) und [Was kostet eine Solaranlage?](/ratgeber/solaranlage-kosten).",
        },
        { typ: "tool", href: "/solarrechner", titel: "Pflichtanlage oder größer?", text: "Rechnen Sie Ertrag, Autarkie und Amortisation für verschiedene Anlagengrößen auf Ihrem Dach durch.", label: "Zum Solarrechner" },
        {
          typ: "kasten",
          variant: "info",
          titel: "Zählt ein Balkonkraftwerk?",
          text: "In der Regel nicht. Die Landesgesetze verlangen einen Anteil der Dachfläche oder eine Mindestleistung, die ein Steckersolargerät mit 800 W nicht erreicht. Für Mieter und kleine Budgets bleibt es trotzdem ein sinnvoller Einstieg – siehe [Balkonkraftwerk-Ratgeber](/ratgeber/balkonkraftwerk).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Vorgehen für Bauherren und Sanierer",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Stichtag prüfen", "Klären Sie, ob Bauantrag, Baubeginn oder Sanierungsbeginn nach dem Stichtag Ihres Landes liegt. Bei Unsicherheit gibt das Bauamt Auskunft."],
            ["Dach bewerten", "Geeignete Dachfläche, Ausrichtung, Verschattung und Statik prüfen. Das Solarkataster Ihres Landes liefert eine erste Einschätzung."],
            ["Anlagengröße festlegen", "Pflichtumfang als Untergrenze nehmen und auf Verbrauch, Wärmepumpe und E-Auto auslegen."],
            ["Förderung klären", "Mit dem [Förder-Check](/foerdercheck) und der Übersicht [Förderung nach Bundesland](/forderungen/landesforderungen) prüfen, ob es Zuschüsse oder Landesdarlehen gibt."],
            ["Nachweis führen", "Inbetriebnahme, Eintrag im Marktstammdatenregister und ggf. Ausnahmebegründung dokumentieren – je nach Land innerhalb von zwölf Monaten."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "In welchen Bundesländern gilt eine Solarpflicht?", a: "Für neue Wohngebäude gilt sie 2026 in Baden-Württemberg, Berlin, Bremen, Hamburg, Niedersachsen, Nordrhein-Westfalen und Schleswig-Holstein. Für Nichtwohngebäude kommen unter anderem Bayern, Rheinland-Pfalz, das Saarland und Hessen (Landesgebäude, Parkplätze) hinzu." },
    { q: "Gibt es eine Solarpflicht in Bayern?", a: "Für Wohngebäude nicht im engeren Sinn. Art. 44a BayBO enthält seit 2025 nur eine Soll-Vorschrift ohne Sanktion. Verpflichtend ist eine Solaranlage in Bayern bei neuen Nichtwohngebäuden und bei vollständiger Erneuerung der Dachhaut solcher Gebäude." },
    { q: "Muss ich bei einer Dachsanierung eine PV-Anlage installieren?", a: "In Baden-Württemberg, Berlin, Bremen, Hamburg, Niedersachsen und Nordrhein-Westfalen ja, wenn die Sanierung die Schwelle des Landesrechts erreicht – meist die vollständige oder überwiegende Erneuerung der Dachhaut. Reparaturen einzelner Stellen lösen keine Pflicht aus." },
    { q: "Gilt die Solarpflicht auch für bestehende Häuser?", a: "Nur wenn Sie das Dach grundlegend sanieren und Ihr Land das vorsieht. Eine allgemeine Nachrüstpflicht für bewohnte Bestandshäuser gibt es in keinem Bundesland, und auch die neue Bundesregel nimmt bestehende Wohngebäude aus." },
    { q: "Ab wann gilt die bundesweite Solarpflicht?", a: "Nach § 106 des Gebäudemodernisierungsgesetzes ab 2027 zunächst für neue öffentliche Gebäude und neue Nichtwohngebäude über 250 m² Nutzfläche. Neue Wohngebäude folgen ab dem 1. Januar 2030. Strengere Landesregeln bleiben bestehen." },
    { q: "Kann ich die Solarpflicht mit Solarthermie erfüllen?", a: "In den meisten Ländern ja, ganz oder teilweise. Auch Anlagen an der Fassade oder auf Nebengebäuden können angerechnet werden. Wirtschaftlich ist Photovoltaik heute meist die flexiblere Lösung, weil sich der Strom auch für Wärmepumpe und E-Auto nutzen lässt." },
    { q: "Was passiert, wenn ich die Solarpflicht nicht erfülle?", a: "Verstöße sind in mehreren Ländern Ordnungswidrigkeiten und können mit Bußgeldern geahndet werden; zudem kann die Baubehörde die Nachrüstung anordnen. Wer eine Ausnahme beansprucht, sollte die Gründe schriftlich belegen." },
  ],

  passend: [
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Verfahrensfreiheit, Denkmal- und Brandschutz." },
    { href: "/forderungen/baurecht", titel: "Baurecht für Photovoltaik", text: "Genehmigungs-Check nach Anlagentyp." },
    { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Landesprogramme und kommunale Zuschüsse." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und Einflussfaktoren." },
  ],

  quellen: [
    { titel: "Umweltministerium Baden-Württemberg – FAQ Photovoltaikpflicht", url: "https://um.baden-wuerttemberg.de/de/klima-energie/energiewende/erneuerbare-energien/sonnenenergie/photovoltaik/photovoltaikpflicht/faq-photovoltaikpflicht", stand: "04/2026" },
    { titel: "Bayerisches Staatsministerium für Wohnen, Bau und Verkehr – Vollzugshinweise zu Art. 44a BayBO", url: "https://www.stmb.bayern.de/assets/stmi/buw/baurechtundtechnik/24_baybo-vollzugshinweise_2023-44a.pdf", stand: "09/2026" },
    { titel: "Senatsverwaltung Berlin – Informationen zum Solargesetz Berlin", url: "https://www.berlin.de/sen/energie/erneuerbare-energien/solargesetz-berlin/artikel.1209711.php", stand: "09/2026" },
    { titel: "Senatorin für Umwelt, Klima und Wissenschaft Bremen – Bremisches Solargesetz", url: "https://umwelt.bremen.de/klima/energie/erneuerbare-energien/bremisches-solargesetz-bremsolarg-2155612", stand: "09/2026" },
    { titel: "Freie und Hansestadt Hamburg – FAQ PV-Pflicht", url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/energie/erneuerbare-energien/photovoltaik/faq-pv-pflicht-in-hamburg-956122", stand: "09/2026" },
    { titel: "Land NRW – Solaranlagen-Verordnung (SAN-VO NRW)", url: "https://recht.nrw.de/lrgv/rechtsverordnung/19062024-verordnung-zur-umsetzung-der-solaranlagen-pflicht-nach-ss-42a-und-ss/", stand: "09/2026" },
    { titel: "Land Schleswig-Holstein – FAQ EWKG: Photovoltaik bei Gebäuden", url: "https://www.schleswig-holstein.de/DE/fachinhalte/E/energiewende/_faqs_ewkg/faq_ewkg_pv/faq_ewkg_pv_gebaeude/akkordeon_faq_ewkg_pv_gebaeude", stand: "09/2026" },
    { titel: "GEG-Infoportal des Bundes: Gebäudemodernisierungsgesetz, Inhalt und Verfahren", url: "https://www.gmodg.bund.de/GEGPortal/DE/Home/startseite/GModG_News/GModG_News-node.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Pflichtanlage richtig planen", text: "Größe, Ertrag und Amortisation für Ihr Dach berechnen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Neubau oder Dachsanierung? Wir planen die Anlage passend zur Pflicht.",
    text: "Wir prüfen Dach, Statik und Landesvorgaben, legen die Anlage auf Ihren Verbrauch aus und übernehmen Montage und Anmeldung aus einer Hand.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Baurecht im Überblick", href: "/forderungen/baurecht" },
  },
};

export default artikel;
