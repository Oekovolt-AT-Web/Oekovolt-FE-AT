// Ratgeber: Balkonkraftwerk 2026 – Regeln, Ertrag, Mietrecht und der ehrliche
// Vergleich mit einer Dachanlage. Ökovolt verkauft keine Balkonkraftwerke;
// der Artikel informiert neutral. Zahlen der Dachanlage aus dem Solarrechner-Kern.

import { ANNAHMEN } from "@/data/solarrechner";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const ctStr = (n) => String(Math.round(n * 1000) / 10).replace(".", ",");
const jahre = (x) => x.toFixed(1).replace(".", ",");

// --- Balkonkraftwerk (eigene, offengelegte Annahmen) -------------------------
// 800-W-Gerät senkrecht am Balkongeländer, Südseite: rund 665 Volllaststunden
// (Umweltbundesamt) -> ca. 530 kWh; davon werden ohne Speicher ca. 45 % direkt
// genutzt (UBA-Beispiel). Anschaffung 500 € als Mittelwert der von der
// Verbraucherzentrale genannten Spanne.
const BK = { leistungKw: 0.8, vollast: 665, evAnteil: 0.45, preis: 500 };
BK.ertrag = BK.leistungKw * BK.vollast;
BK.eigen = BK.ertrag * BK.evAnteil;
BK.ersparnis = BK.eigen * ANNAHMEN.strompreis;
BK.amort = BK.preis / BK.ersparnis;
// 20-Jahres-Überschuss mit denselben Annahmen wie der Solarrechner
// (0,5 % Degradation, 2 % Strompreissteigerung), ohne Wechselrichtertausch.
BK.ueberschuss20 =
  Array.from({ length: 20 }, (_, t) => BK.ersparnis * Math.pow(1 - ANNAHMEN.degradationProJahr, t) * Math.pow(1 + ANNAHMEN.strompreisSteigerung, t)).reduce((a, b) => a + b, 0) - BK.preis;

// --- Dachanlagen zum Vergleich (Rechenkern des Solarrechners) ----------------
const DACH6 = berechne({ kwp: 6, ausrichtung: "sued", neigung: "mittel", verbrauch: 3000, speicherKwh: 0 });
const DACH10 = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });

const artikel = {
  slug: "balkonkraftwerk",
  title: "Balkonkraftwerk 2026: Regeln, Ertrag und wann Dach-PV mehr bringt",
  seoTitle: "Balkonkraftwerk 2026: Regeln, Ertrag & Kosten | Ökovolt",
  kurzTitel: "Balkonkraftwerk",
  description:
    "Balkonkraftwerk 2026: 800-W-Regel, Anmeldung, Mietrecht, realistischer Ertrag und Ersparnis – plus ehrlicher Vergleich, wann eine Dachanlage mehr bringt.",
  excerpt:
    "Was ist erlaubt, was bringt ein Steckersolargerät wirklich, und ab wann ist eine Photovoltaikanlage auf dem Dach die bessere Wahl? Ein neutraler Überblick mit Rechenbeispiel.",
  hauptKeyword: "balkonkraftwerk",
  keywords: ["Balkonkraftwerk 800 Watt", "Balkonkraftwerk anmelden", "Balkonkraftwerk lohnt sich", "Steckersolargerät Regeln 2026", "Balkonkraftwerk Mieter", "Balkonkraftwerk Ertrag", "Balkonkraftwerk oder PV-Anlage"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/balkonkraftwerk.jpg",
  bildAlt: "Zwei Solarmodule eines Balkonkraftwerks am Balkongeländer eines Mehrfamilienhauses",
  badge: { wert: "800 W", text: "maximale Wechselrichterleistung, bis 2.000 Wp Module" },

  kurzFazit: [
    "**Ein Balkonkraftwerk ist ein Steckersolargerät** mit höchstens 800 W Wechselrichterleistung und bis zu 2.000 Wp Modulleistung. Anmelden müssen Sie es nur im Marktstammdatenregister.",
    `Senkrecht am Balkongeländer erzeugt ein 800-W-Gerät rund **${kwh(BK.ertrag)} im Jahr**. Davon nutzt ein Haushalt ohne Speicher etwa die Hälfte selbst – das spart rund **${eur(BK.ersparnis)} pro Jahr**.`,
    "Mieter und Wohnungseigentümer haben seit Oktober 2024 einen **gesetzlichen Anspruch** auf die Erlaubnis (§ 554 BGB, § 20 WEG).",
    `Für Eigenheimbesitzer mit geeignetem Dach bringt eine **Dachanlage ein Vielfaches**: Eine 6-kWp-Anlage deckt im Beispiel rund ${Math.round(DACH6.autarkie * 100)} % des Verbrauchs statt etwa ${Math.round((BK.eigen / 3000) * 100)} %.`,
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist ein Balkonkraftwerk – und lohnt es sich?",
      tocLabel: "Kurz erklärt",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Balkonkraftwerk ist eine kleine Photovoltaikanlage, die per Stecker in den Stromkreis der Wohnung einspeist und so den Strombezug aus dem Netz senkt.** Es besteht aus ein bis vier Solarmodulen, einem Mikrowechselrichter und einem Anschlusskabel. Rechtlich heißt es „Steckersolargerät“. Der erzeugte Strom fließt zuerst zu den Geräten, die gerade laufen – Kühlschrank, Router, Waschmaschine. Nur was nicht sofort verbraucht wird, geht ins öffentliche Netz.",
        },
        {
          typ: "p",
          text: `**Lohnend ist ein Balkonkraftwerk in den meisten Fällen, aber in kleinem Maßstab.** Bei Anschaffungskosten von einigen hundert Euro amortisiert sich ein gut ausgerichtetes Gerät nach etwa ${jahre(BK.amort)} Jahren. Es deckt aber nur die Grundlast: Eine vollwertige [Photovoltaikanlage](/produkte/photovoltaikanlage) auf dem Dach erzeugt je nach Größe das Zehn- bis Zwanzigfache. Für Mieterinnen und Mieter ist das Steckergerät oft die einzige Möglichkeit, eigenen Solarstrom zu nutzen – für Hausbesitzer ist es meist nur die zweitbeste.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Transparenzhinweis",
          text: "Ökovolt verkauft und montiert keine Balkonkraftwerke. Wir planen und installieren Photovoltaikanlagen auf Dächern. Dieser Ratgeber soll Ihnen trotzdem neutral helfen – auch dann, wenn für Sie ein Steckergerät die richtige Lösung ist.",
        },
      ],
    },
    {
      id: "regeln",
      titel: "Die Regeln für Balkonkraftwerke 2026 auf einen Blick",
      tocLabel: "Regeln 2026",
      bloecke: [
        {
          typ: "p",
          text: "**Seit dem Solarpaket I (Mai 2024) und der neuen Produktnorm DIN VDE V 0126-95 (seit 1. Dezember 2025) ist die Rechtslage für Steckersolargeräte weitgehend geklärt.** Die Anwendungsregel VDE-AR-N 4105 in der Fassung vom März 2026 hat die Vorgaben für den Netzanschluss nachgezogen. Die wichtigsten Punkte:",
        },
        {
          typ: "tabelle",
          caption: "Rechtlicher und technischer Rahmen für Steckersolargeräte, Stand September 2026",
          kopf: ["Thema", "Regel 2026", "Grundlage"],
          zeilen: [
            ["Wechselrichterleistung", "höchstens 800 VA (Summe aller Steckergeräte am Zählpunkt)", "§ 3 Nr. 43 EEG"],
            ["Modulleistung", "höchstens 2.000 Wp; darüber gilt das Gerät als normale Kleinsterzeugungsanlage", "§ 3 Nr. 43 EEG"],
            ["Stecker", "Schukostecker zulässig bis 960 Wp Modulleistung, wenn das Gerät die Produktnorm erfüllt; darüber Einspeisesteckdose (z. B. Wieland)", "DIN VDE V 0126-95"],
            ["Anmeldung", "nur Marktstammdatenregister, innerhalb eines Monats nach Inbetriebnahme", "MaStRV"],
            ["Netzbetreiber", "keine eigene Anmeldung mehr nötig", "Solarpaket I"],
            ["Stromzähler", "Zweirichtungszähler nötig; alter Zähler darf bis zum Tausch übergangsweise weiterlaufen", "EEG / BNetzA"],
            ["Einspeisevergütung", "in der Regel keine – Überschuss wird unentgeltlich abgenommen", "EEG"],
            ["Mieter & WEG", "Anspruch auf Erlaubnis, Ablehnung nur bei Unzumutbarkeit", "§ 554 BGB, § 20 Abs. 2 WEG"],
          ],
          minBreite: 640,
          fussnote: "Vereinfachte Übersicht. Die VDE-AR-N 4105 ist eine Anwendungsregel und kein Gesetz, gilt aber als anerkannte Regel der Technik. Speicher zählen bei der 800-VA-Grenze mit.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Mehr als 2.000 Wp? Dann ist es kein Balkonkraftwerk mehr",
          text: "Wer mehr Module anschließt, verlässt die Sonderregeln – auch wenn der Wechselrichter weiter auf 800 W begrenzt ist. Dann gelten die Installationsnorm für Kleinsterzeugungsanlagen, die Anmeldung beim [Netzbetreiber](/wissen/lexikon#netzbetreiber) und in der Regel der Anschluss durch eine Elektrofachkraft. Bei hohen Gleichspannungen ist das ausdrücklich nichts mehr für Laien.",
        },
        { typ: "h3", text: "Und was ist mit Speichern?" },
        {
          typ: "p",
          text: "Kleine Batteriespeicher für Balkonkraftwerke sind erlaubt, wenn die Einspeiseleistung von Gerät und Speicher zusammen 800 W nicht überschreitet. Für Geräte mit Speicher gibt es noch keine eigene Produktnorm; die Verbraucherzentrale weist darauf hin, dass die vereinfachten Regeln hier noch nicht vollständig greifen. Stiftung Warentest hat im März 2026 fünf Balkonspeicher geprüft – drei davon erhielten wegen zu starker elektromagnetischer Störungen die Note „mangelhaft“.",
        },
      ],
    },
    {
      id: "ertrag",
      titel: "Wie viel Strom erzeugt ein Balkonkraftwerk?",
      tocLabel: "Ertrag & Ersparnis",
      bloecke: [
        {
          typ: "p",
          text: `**Ein 800-W-Balkonkraftwerk erzeugt in Deutschland je nach Montage etwa 500 bis 800 kWh im Jahr.** Entscheidend ist der Winkel: Optimal nach Süden geneigt sind laut Umweltbundesamt rund 950 Volllaststunden möglich, senkrecht am Balkongeländer etwa 30 % weniger. Die Verbraucherzentrale nennt als Faustwert rund 400 kWh je 400-Watt-Modul in guter Südlage. Zum Vergleich: Eine Dachanlage in Süddeutschland erzeugt rund ${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je [kWp](/wissen/lexikon#kwp).`,
        },
        {
          typ: "tabelle",
          caption: "Orientierungswerte für ein 800-W-Balkonkraftwerk ohne Speicher",
          kopf: ["Montage", "Jahresertrag", "Direkt genutzt (ca. 45 %)", `Ersparnis bei ${ctStr(ANNAHMEN.strompreis)} ct/kWh`],
          zeilen: [
            ["Süd, optimal geneigt (ca. 30°)", kwh(0.8 * 950), kwh(0.8 * 950 * 0.45), eur(0.8 * 950 * 0.45 * ANNAHMEN.strompreis)],
            ["Süd, senkrecht am Geländer", kwh(BK.ertrag), kwh(BK.eigen), eur(BK.ersparnis)],
            ["Ost oder West, senkrecht", kwh(BK.ertrag * 0.8), kwh(BK.ertrag * 0.8 * 0.45), eur(BK.ertrag * 0.8 * 0.45 * ANNAHMEN.strompreis)],
          ],
          hervorheben: 3,
          markierteZeile: 1,
          minBreite: 620,
          fussnote: "Volllaststunden nach Umweltbundesamt, Ost/West mit pauschal 20 % Abschlag. Der direkt genutzte Anteil hängt stark vom Haushalt ab: Wer tagsüber zu Hause ist, nutzt mehr, in Haushalten, die tagsüber leer stehen, sind es oft nur rund 30 %. Eingespeister Überschuss wird nicht vergütet.",
        },
        {
          typ: "kennzahl",
          wert: eur(BK.ersparnis),
          titel: "Ersparnis pro Jahr im Beispiel",
          text: `800-W-Gerät senkrecht am Südbalkon, ${kwh(BK.eigen)} direkt genutzt, ${ctStr(ANNAHMEN.strompreis)} ct/kWh Strompreis. Bei ${eur(BK.preis)} Anschaffung rechnet sich das nach rund ${jahre(BK.amort)} Jahren.`,
        },
        { typ: "h3", text: "Lohnt sich ein Speicher am Balkonkraftwerk?" },
        {
          typ: "p",
          text: `Ein Speicher mit rund 2 kWh kann den selbst genutzten Anteil deutlich erhöhen, weil der Mittagsüberschuss abends verbraucht wird. Er kostet aber laut Stiftung Warentest etwa 700 bis 1.000 Euro zusätzlich. Selbst wenn er im Jahr 250 bis 300 kWh mehr nutzbar macht, sind das bei ${ctStr(ANNAHMEN.strompreis)} ct rund 80 bis 100 Euro – der Speicher allein braucht damit etwa zehn Jahre, bis er sich bezahlt hat. Das ist ungefähr seine erwartbare Lebensdauer. Sinnvoll ist er vor allem bei größeren Geräten nahe 2.000 Wp und hohem Abendverbrauch.`,
        },
      ],
    },
    {
      id: "anmelden",
      titel: "Balkonkraftwerk anmelden und installieren: So geht es",
      tocLabel: "Anmeldung",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Balkonkraftwerk müssen Sie 2026 nur noch im Marktstammdatenregister der Bundesnetzagentur eintragen – der Netzbetreiber wird automatisch informiert.** Die vereinfachte Registrierung dauert etwa zehn Minuten und fragt nur wenige technische Daten ab. Den Zählertausch veranlasst der Messstellenbetreiber; die Kosten dafür dürfen Ihnen nicht gesondert berechnet werden.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Gerät mit Normnachweis kaufen", "Auf die Konformität mit DIN VDE V 0126-95 achten. Bis 960 Wp Modulleistung genügt dann der Schukostecker."],
            ["Standort und Befestigung prüfen", "Möglichst Süd, unverschattet. Halterung muss Wind- und Schneelasten tragen – Kabelbinder sind keine Befestigung. Ein Modul wiegt rund 20 kg."],
            ["Erlaubnis einholen (Mietwohnung/WEG)", "Formlos beim Vermieter oder der Eigentümergemeinschaft beantragen, am besten mit Datenblatt und Montageskizze."],
            ["Direkt an eine Wandsteckdose anschließen", "Nie über eine Mehrfachsteckdose oder Kabeltrommel. Der Stromkreis sollte nicht zusätzlich durch Großgeräte ausgelastet sein."],
            ["Im Marktstammdatenregister eintragen", "Innerhalb eines Monats nach Inbetriebnahme unter marktstammdatenregister.de – kostenlos."],
            ["Zählertausch abwarten", "Hat Ihr Zähler keine Rücklaufsperre, darf er bis zum Tausch übergangsweise weiterlaufen."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Versicherung kurz prüfen",
          text: "Eine Pflichtversicherung gibt es nicht. Fragen Sie trotzdem bei Ihrer Haftpflicht- und Hausratversicherung nach, ob Schäden durch herabfallende Module oder Sturm eingeschlossen sind. Häufig ist das ohne Aufpreis möglich.",
        },
      ],
    },
    {
      id: "mietrecht",
      titel: "Balkonkraftwerk als Mieter oder in der Eigentümergemeinschaft",
      tocLabel: "Mietrecht & WEG",
      bloecke: [
        {
          typ: "p",
          text: "**Mieter können seit dem 17. Oktober 2024 verlangen, dass der Vermieter ein Steckersolargerät erlaubt (§ 554 BGB).** Ablehnen darf er nur, wenn ihm die Anlage auch unter Berücksichtigung der Mieterinteressen nicht zuzumuten ist. Rein optische Einwände reichen nach Einschätzung der Verbraucherzentrale nicht aus. Eine abweichende Klausel im Mietvertrag zu Ihrem Nachteil ist unwirksam.",
        },
        {
          typ: "p",
          text: "Für Wohnungseigentümer gilt dasselbe über § 20 Abs. 2 Nr. 5 WEG: Die Gemeinschaft muss eine angemessene Anlage gestatten, darf aber über das „Wie“ mitentscheiden – etwa über Farbe, Montageort oder Befestigung. Die Kosten trägt der Eigentümer, der das Gerät verlangt hat.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Erlaubnis bleibt Pflicht",
          text: "Der Anspruch ersetzt nicht die Zustimmung. Wer ohne Erlaubnis montiert, riskiert eine Abmahnung oder den Rückbau. Stellen Sie deshalb vorher einen kurzen, schriftlichen Antrag. Denkmalschutz, Brandschutz und Bebauungsplan können die Gestaltung zusätzlich einschränken – mehr zur Rechtslage unter [Baurecht](/forderungen/baurecht).",
        },
      ],
    },
    {
      id: "vergleich",
      titel: "Balkonkraftwerk oder Photovoltaikanlage: Was bringt mehr?",
      tocLabel: "Vergleich mit Dach-PV",
      bloecke: [
        {
          typ: "p",
          text: "**Bezogen auf die Anschaffung ist das Balkonkraftwerk günstiger und schneller amortisiert, bezogen auf die Stromrechnung bringt eine Dachanlage ein Vielfaches.** Der Grund: Ein Steckergerät ist auf 800 W begrenzt und deckt fast nur die Grundlast. Eine Dachanlage mit 6 bis 10 kWp versorgt tagsüber auch Waschmaschine, Wärmepumpe oder E-Auto und erhält für Überschüsse eine [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026).",
        },
        {
          typ: "tabelle",
          caption: "Balkonkraftwerk und Dachanlagen im Vergleich (ohne Speicher), Stand September 2026",
          kopf: ["", "Balkonkraftwerk 800 W", "Dachanlage 6 kWp", "Dachanlage 10 kWp"],
          zeilen: [
            ["Beispielhaushalt", "3.000 kWh/Jahr", "3.000 kWh/Jahr", "4.500 kWh/Jahr"],
            ["Anschaffung", eur(BK.preis), eur(DACH6.investition), eur(DACH10.investition)],
            ["Jahresertrag", kwh(BK.ertrag), kwh(DACH6.jahresertrag), kwh(DACH10.jahresertrag)],
            ["Selbst genutzter Solarstrom", kwh(BK.eigen), kwh(DACH6.eigenverbrauch), kwh(DACH10.eigenverbrauch)],
            ["Anteil am Verbrauch (Autarkie)", `ca. ${Math.round((BK.eigen / 3000) * 100)} %`, `${Math.round(DACH6.autarkie * 100)} %`, `${Math.round(DACH10.autarkie * 100)} %`],
            ["Vorteil pro Jahr", eur(BK.ersparnis), eur(DACH6.nutzenProJahr), eur(DACH10.nutzenProJahr)],
            ["Amortisation", `ca. ${jahre(BK.amort)} Jahre`, DACH6.amortisationJahre ? `${jahre(DACH6.amortisationJahre)} Jahre` : "über 20 Jahre", DACH10.amortisationJahre ? `${jahre(DACH10.amortisationJahre)} Jahre` : "über 20 Jahre"],
            ["Überschuss nach 20 Jahren", `ca. ${eur(BK.ueberschuss20)}`, eur(DACH6.ertrag20Jahre), eur(DACH10.ertrag20Jahre)],
          ],
          hervorheben: 3,
          minBreite: 660,
          fussnote: "Balkonkraftwerk: senkrecht am Südbalkon, eigene Annahmen wie oben, ohne Wechselrichtertausch. Dachanlagen: Süddach, Rechenkern des Ökovolt-Solarrechners inkl. Einspeiseerlös und Betriebskosten. Orientierungswerte, keine Angebote.",
        },
        {
          typ: "p",
          text: "Die Tabelle zeigt den Kernunterschied: Das Balkonkraftwerk hat die kürzere Amortisation, weil es wenig kostet. Über die Lebensdauer bleibt bei einer Dachanlage aber ein zwei- bis fünfmal so hoher Überschuss – und vor allem sinkt die Stromrechnung dauerhaft spürbar. Mit einem [Stromspeicher](/produkte/stromspeicher) lässt sich die Autarkie einer Dachanlage auf 60 bis 70 % steigern, ein Balkonkraftwerk bleibt auch mit Speicher bei einem kleinen Anteil.",
        },
        { typ: "h3", text: "Wann eine Dachanlage die bessere Wahl ist" },
        {
          typ: "checkliste",
          punkte: [
            "**Sie besitzen ein Haus** mit einem Dach, das nicht stark verschattet ist und in den nächsten Jahren nicht saniert werden muss.",
            "**Ihr Verbrauch liegt über etwa 2.500 kWh** im Jahr – oder eine Wärmepumpe bzw. ein E-Auto sind vorhanden oder geplant.",
            "**Sie möchten Ihre Stromrechnung deutlich senken**, nicht nur die Grundlast abdecken.",
            "**Sie wollen Speicher, Wallbox oder Wärmepumpe** später einbinden – das geht mit einem Hybridwechselrichter sauber, mit Steckergeräten praktisch nicht.",
          ],
        },
        { typ: "h3", text: "Wann ein Balkonkraftwerk die richtige Lösung ist" },
        {
          typ: "checkliste",
          punkte: [
            "**Sie wohnen zur Miete** oder in einer Eigentumswohnung ohne eigenes Dach.",
            "**Das Dach ist ungeeignet** – etwa wegen Denkmalschutz, Verschattung oder anstehender Sanierung – und Sie möchten trotzdem Solarstrom nutzen.",
            "**Ihr Budget ist klein** und Sie möchten ohne Kredit und Handwerkertermin einsteigen.",
            "**Gartenhaus, Garage oder Carport** bieten eine sonnige Fläche, eine Dachanlage lohnt dort aber nicht.",
          ],
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Was würde eine Dachanlage bei Ihnen bringen?",
          text: "Verbrauch, Dachausrichtung und Anlagengröße eingeben – Ertrag, Autarkie und Amortisation in einer Minute.",
          label: "Zum Solarrechner",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler und Mythen rund ums Balkonkraftwerk",
      tocLabel: "Fehler & Mythen",
      bloecke: [
        { typ: "h3", text: "„Ich stecke einfach mehrere Geräte zusammen“" },
        { typ: "p", text: "Die Grenzen von 800 VA und 2.000 Wp gelten für alle Steckergeräte am selben Zählpunkt zusammen. Wer zwei Sets mit je 800 W betreibt, überschreitet die Regeln. Das kann Ärger mit dem Netzbetreiber bringen, und im Schadensfall muss die Versicherung womöglich nicht zahlen." },
        { typ: "h3", text: "„Mit einem Balkonkraftwerk und Speicher bin ich unabhängig“" },
        { typ: "p", text: `Selbst ein großes Steckergerät mit Speicher deckt in einem Durchschnittshaushalt nur einen kleinen Teil des Jahresverbrauchs. Im Winter liefert es sehr wenig. Echte Unabhängigkeit ist mit keiner Anlage wirtschaftlich erreichbar – mehr dazu im Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).` },
        { typ: "h3", text: "„Erst Balkonkraftwerk, später Dachanlage – das passt schon zusammen“" },
        { typ: "p", text: "Grundsätzlich ist beides möglich. Kommt später eine Dachanlage hinzu, sollten Sie das vorhandene Steckergerät dem Elektrofachbetrieb angeben, damit es bei Messkonzept und Netzanmeldung berücksichtigt wird. Wirtschaftlich ist es meist sinnvoller, das Budget direkt in eine passend dimensionierte Dachanlage zu stecken." },
      ],
    },
    {
      id: "vorgehen",
      titel: "So entscheiden Sie in vier Schritten",
      tocLabel: "Entscheidung",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Wohnsituation klären", "Mietwohnung oder WEG ohne Dachzugang: Balkonkraftwerk prüfen. Eigenes Haus: zuerst die Dachanlage durchrechnen."],
            ["Verbrauch und Pläne notieren", "Jahresverbrauch aus der Stromrechnung, dazu geplante Wärmepumpe oder E-Auto."],
            ["Förderung checken", "Einige Länder und Kommunen bezuschussen Steckersolargeräte oder Dachanlagen – der [Förder-Check](/foerdercheck) zeigt, was bei Ihnen gilt."],
            ["Zahlen vergleichen", "Mit dem [Solarrechner](/solarrechner) den Vorteil einer Dachanlage ermitteln und dem Balkonkraftwerk gegenüberstellen."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Muss ich ein Balkonkraftwerk anmelden?", a: "Ja, aber nur im Marktstammdatenregister der Bundesnetzagentur, innerhalb eines Monats nach Inbetriebnahme. Eine gesonderte Anmeldung beim Netzbetreiber ist seit dem Solarpaket I nicht mehr nötig." },
    { q: "Wie viel Watt darf ein Balkonkraftwerk 2026 haben?", a: "Der Wechselrichter darf höchstens 800 VA ins Hausnetz einspeisen, die angeschlossenen Module dürfen zusammen bis zu 2.000 Wp haben. Über 960 Wp Modulleistung ist statt des Schukosteckers eine spezielle Einspeisesteckdose vorgesehen." },
    { q: "Darf der Vermieter ein Balkonkraftwerk verbieten?", a: "Nur in Ausnahmefällen. Seit Oktober 2024 haben Mieter nach § 554 BGB einen Anspruch auf Erlaubnis; ablehnen darf der Vermieter nur, wenn ihm die Anlage nicht zuzumuten ist. Die Erlaubnis müssen Sie trotzdem vorher einholen." },
    { q: "Wie viel spart ein Balkonkraftwerk im Jahr?", a: `Ein 800-W-Gerät spart je nach Ausrichtung und Verbrauchsverhalten etwa 60 bis 120 Euro im Jahr. Im Beispiel dieses Ratgebers – senkrecht am Südbalkon – sind es rund ${eur(BK.ersparnis)}.` },
    { q: "Bekomme ich für ein Balkonkraftwerk eine Einspeisevergütung?", a: "In der Praxis nein. Der Überschuss wird unentgeltlich ins Netz abgegeben. Theoretisch lässt sich eine Vergütung beantragen, wegen der kleinen Mengen und des Aufwands macht das kaum jemand." },
    { q: "Brauche ich einen neuen Stromzähler?", a: "Ja, einen Zweirichtungszähler. Den Tausch veranlasst der Messstellenbetreiber nach der Registrierung. Bis dahin darf ein alter Zähler ohne Rücklaufsperre übergangsweise weiterlaufen." },
    { q: "Ist ein Balkonkraftwerk oder eine PV-Anlage besser?", a: `Für Mieter ist das Balkonkraftwerk meist die einzige Option. Für Hausbesitzer mit geeignetem Dach bringt eine Photovoltaikanlage deutlich mehr: Eine 6-kWp-Anlage deckt im Beispiel rund ${Math.round(DACH6.autarkie * 100)} % des Verbrauchs. Prüfen können Sie das mit dem [Solarrechner](/solarrechner).` },
    { q: "Verkauft Ökovolt Balkonkraftwerke?", a: "Nein. Ökovolt ist ein Fachbetrieb für Photovoltaikanlagen auf Dächern, Speicher, Wallboxen und Wärmepumpen. Wenn Sie wissen möchten, ob eine Dachanlage bei Ihnen sinnvoll ist, beraten wir Sie gern." },
  ],

  passend: [
    { href: "/ratgeber/photovoltaik-lohnt-sich", titel: "Lohnt sich Photovoltaik 2026?", text: "Ehrliche Rechnung für Dachanlagen mit Beispielen." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und was im Komplettpreis steckt." },
    { href: "/ratgeber/photovoltaik-mehrfamilienhaus", titel: "Photovoltaik im Mehrfamilienhaus", text: "Solarstrom für alle Parteien statt einzelner Steckergeräte." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Ertrag und Amortisation einer Dachanlage berechnen." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Gesetze und Normen für Steckersolar: Was gilt?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/gesetze-und-normen-fuer-steckersolar-was-gilt-was-gilt-noch-nicht-90740", stand: "03/2026" },
    { titel: "Verbraucherzentrale – FAQ zu Steckersolar-Geräten", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/faq-zu-steckersolargeraeten-das-sind-die-haeufigsten-fragen-86652", stand: "03/2026" },
    { titel: "Bundesnetzagentur – Balkon-Solaranlagen (Steckersolargeräte)", url: "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/Solaranlagen/Balkon_table.html", stand: "09/2026" },
    { titel: "Umweltbundesamt – Steckersolargeräte (Balkonkraftwerk)", url: "https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/heizen-bauen/balkonkraftwerk-steckersolargeraet", stand: "09/2026" },
    { titel: "Stiftung Warentest – Speicher für Balkonkraftwerke im Test", url: "https://www.test.de/speicher-fuer-balkonkraftwerke-test-6278221-0/", stand: "03/2026" },
    { titel: "§ 554 BGB – Steckersolargeräte im Mietrecht", url: "https://www.gesetze-im-internet.de/bgb/__554.html", stand: "09/2026" },
    { titel: "pv magazine – Über 2 kW Modulleistung sind es Kleinsterzeugungsanlagen", url: "https://www.pv-magazine.de/2026/04/14/bei-mehr-als-2-kilowatt-modulleistung-handelt-es-sich-nicht-mehr-um-stecker-solar-geraete-sondern-um-kleinsterzeugungsanlagen/", stand: "04/2026" },
  ],

  seitenCta: { titel: "Haus statt Balkon?", text: "Rechnen Sie aus, was eine Dachanlage bei Ihnen bringt.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Eigenes Dach? Dann rechnen wir ehrlich nach.",
    text: "Wir prüfen Dach, Verschattung und Zählerschrank vor Ort und sagen Ihnen offen, ob sich eine Photovoltaikanlage für Sie lohnt.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
