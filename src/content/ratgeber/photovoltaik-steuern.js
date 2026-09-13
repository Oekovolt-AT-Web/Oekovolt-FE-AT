// Ratgeber: Photovoltaik und Steuern 2026
// Rechtsstand September 2026. Normen geprüft an gesetze-im-internet.de
// (§ 3 Nr. 72 EStG, § 12 Abs. 3 UStG, § 19 UStG, § 3 Nr. 32 GewStG) sowie
// BMF-Schreiben vom 17.07.2023 und LfSt Bayern „Hilfe zu Photovoltaikanlagen“ (06/2025).
// Beispielzahlen kommen aus dem Rechenkern des Solarrechners.

import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WALLBOX } from "@/data/wallbox";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";

// Beispielhaushalt wie im Referenzartikel: 10 kWp Süd, 4.500 kWh Verbrauch, ohne Speicher
const BSP = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const HWB = WALLBOX.handwerkerbonus;

const artikel = {
  slug: "photovoltaik-steuern",
  title: "Photovoltaik und Steuern 2026: Was für Ihre PV-Anlage gilt",
  seoTitle: "Photovoltaik Steuern 2026: Alle Regeln | Ökovolt",
  kurzTitel: "Photovoltaik & Steuern",
  description:
    "Photovoltaik Steuern 2026: 0 % Umsatzsteuer, Einkommensteuerbefreiung bis 30 kWp, Kleinunternehmerregelung und was für Altanlagen gilt – mit Paragrafen.",
  excerpt:
    "Für die meisten privaten PV-Anlagen fallen 2026 weder Umsatz- noch Einkommensteuer an. Wo die Grenzen liegen, was Altanlagen beachten müssen und wann das Finanzamt doch Post bekommt.",
  hauptKeyword: "photovoltaik steuern",
  keywords: [
    "Photovoltaik Steuern",
    "PV-Anlage Steuer 2026",
    "Photovoltaik Steuererklärung",
    "Nullsteuersatz Photovoltaik",
    "§ 3 Nr. 72 EStG",
    "Photovoltaik Kleinunternehmerregelung",
    "PV-Anlage Finanzamt",
    "Photovoltaik Altanlage Umsatzsteuer",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
  bildAlt: "Reihenhäuser mit Photovoltaikanlagen auf den Dächern",
  badge: { wert: "0 %", text: "Umsatzsteuer auf Anlage und Speicher bis 30 kWp" },

  kurzFazit: [
    "**Beim Kauf 0 % Umsatzsteuer:** Module, Wechselrichter, Speicher und Montage für Anlagen auf Wohngebäuden sind nach § 12 Abs. 3 UStG umsatzsteuerfrei – bis 30 kWp ohne weiteren Nachweis.",
    "**Keine Einkommensteuer:** Einnahmen aus Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit (höchstens 100 kWp je Person) sind nach § 3 Nr. 72 EStG steuerfrei – auch für Altanlagen seit 2022.",
    "**Kein Papierkram beim Finanzamt:** Wer Kleinunternehmer bleibt, muss seit 2023 weder Fragebogen noch Umsatzsteuererklärung für die Anlage abgeben.",
    "**Aufpassen bei Altanlagen mit Regelbesteuerung, Wallboxen und Anlagen über den Grenzen** – dort gelten weiter die klassischen Steuerpflichten.",
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Welche Steuern fallen bei einer PV-Anlage 2026 an?",
      tocLabel: "Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Für eine typische private Photovoltaikanlage auf dem Wohnhaus fallen 2026 praktisch keine Steuern an.** Der Kauf ist umsatzsteuerfrei, die Einspeisevergütung und der selbst verbrauchte Strom sind einkommensteuerfrei, Gewerbesteuer entfällt, und als Kleinunternehmer führen Sie auch auf die Vergütung keine Umsatzsteuer ab. Möglich machen das drei Gesetzesänderungen der Jahre 2022 bis 2024, die bis heute unverändert gelten.",
        },
        {
          typ: "tabelle",
          caption: "Steuerliche Behandlung einer privaten PV-Anlage bis 30 kWp, Rechtsstand September 2026",
          kopf: ["Steuerart", "Regel für die typische Dachanlage", "Rechtsgrundlage", "Was Sie tun müssen"],
          zeilen: [
            ["Umsatzsteuer beim Kauf", "0 % auf Module, Wechselrichter, Speicher und Installation", "§ 12 Abs. 3 UStG", "Rechnung auf 0 % prüfen"],
            ["Einkommensteuer", "Einnahmen und Eigenverbrauch steuerfrei", "§ 3 Nr. 72 EStG", "Nichts – kein Gewinn zu ermitteln"],
            ["Umsatzsteuer auf Einspeisung", "Keine, wenn Kleinunternehmer", "§ 19 UStG", "Kleinunternehmerstatus behalten"],
            ["Gewerbesteuer", "Befreit bis 30 kW", "§ 3 Nr. 32 GewStG", "Nichts"],
            ["Stromsteuer auf Eigenverbrauch", "Befreit bei Anlagen bis 2 MW", "§ 9 Abs. 1 Nr. 3 StromStG", "Nichts"],
          ],
          minBreite: 680,
          fussnote: "Vereinfachte Darstellung. Maßgeblich ist die installierte Bruttoleistung laut Marktstammdatenregister. Abweichungen gelten bei Anlagen über den Grenzen, bei Regelbesteuerung und bei Altanlagen.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Keine Steuerberatung",
          text: "Dieser Ratgeber erklärt die allgemeine Rechtslage (Stand September 2026) und ersetzt keine Steuer- oder Rechtsberatung. Bei Anlagen über 30 kWp, Mehrfamilienhäusern, Betriebsvermögen oder einer bestehenden Regelbesteuerung sollten Sie Ihren Fall mit einer Steuerberaterin oder einem Steuerberater klären.",
        },
      ],
    },
    {
      id: "umsatzsteuer-kauf",
      titel: "Nullsteuersatz: Keine Umsatzsteuer beim Kauf",
      tocLabel: "Nullsteuersatz",
      bloecke: [
        {
          typ: "p",
          text: "**Seit dem 1. Januar 2023 liefern und installieren Fachbetriebe Photovoltaikanlagen für Wohngebäude mit 0 % Umsatzsteuer.** Grundlage ist der [Nullsteuersatz](/wissen/lexikon#nullsteuersatz) nach § 12 Abs. 3 UStG. Er gilt für Anlagen „auf oder in der Nähe von Privatwohnungen, Wohnungen sowie öffentlichen und anderen Gebäuden, die für dem Gemeinwohl dienende Tätigkeiten genutzt werden“. Das Gesetz enthält eine wichtige Vereinfachung: Liegt die installierte Bruttoleistung laut Marktstammdatenregister bei höchstens 30 kWp, gelten diese Voraussetzungen automatisch als erfüllt.",
        },
        {
          typ: "p",
          text: "Für Sie heißt das: Die Rechnung weist 0 % aus, und der Preis, den Sie im [Kostenratgeber](/ratgeber/solaranlage-kosten) oder im Angebot sehen, ist bereits der Endpreis. Einen Antrag gibt es nicht – die Pflicht zur richtigen Besteuerung liegt beim liefernden Betrieb.",
        },
        { typ: "h3", text: "Was unter den Nullsteuersatz fällt – und was nicht" },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "0 % Umsatzsteuer", text: "Solarmodule, Wechselrichter, Montagegestell, Solarkabel, Batteriespeicher (auch nachgerüstet), Energiemanagement- und Notstromkomponenten sowie die Installation dieser Teile. Auch Balkonkraftwerke sind begünstigt." },
            { titel: "19 % Umsatzsteuer", text: "Wallbox, Wärmepumpe, Heizstab, reine Wartungs- und Reparaturleistungen sowie in der Regel die Miete einer Anlage. Dachsanierungen sind eigenständige Leistungen und nicht begünstigt." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Wallbox gehört nicht dazu",
          text: "Die Finanzverwaltung stellt klar: Eine Wallbox ist ein eigenständiger Gegenstand und fällt nicht unter § 12 Abs. 3 UStG. Wird sie im selben Auftrag installiert, sollte das Angebot sie deshalb getrennt mit 19 % ausweisen. Mehr zu Kosten und Förderung im Ratgeber [Wallbox-Installation](/ratgeber/wallbox-installation).",
        },
        {
          typ: "p",
          text: "Anlagen über 30 kWp können den Nullsteuersatz ebenfalls erhalten, wenn sie auf einem begünstigten Gebäude sitzen – etwa einem großen Mehrfamilienhaus. Dann muss der Betrieb die Voraussetzungen aber im Einzelfall prüfen und dokumentieren. Gewerbehallen oder Freiflächenanlagen über 30 kWp werden dagegen regulär mit 19 % abgerechnet.",
        },
      ],
    },
    {
      id: "einkommensteuer",
      titel: "Einkommensteuer: Befreiung nach § 3 Nr. 72 EStG",
      tocLabel: "Einkommensteuer",
      bloecke: [
        {
          typ: "p",
          text: "**Einnahmen aus PV-Anlagen auf, an oder in Gebäuden sind einkommensteuerfrei, wenn die Anlage höchstens 30 kWp je Wohn- oder Gewerbeeinheit hat und Sie insgesamt nicht mehr als 100 kWp betreiben.** So steht es in § 3 Nr. 72 EStG. Die Befreiung umfasst alles, was die Anlage abwirft: die [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026), den selbst verbrauchten Strom und auch Strom, den Sie an Mieter verkaufen. Ein Gewinn muss nicht ermittelt werden, eine Anlage EÜR entfällt.",
        },
        {
          typ: "tabelle",
          caption: "Leistungsgrenzen nach § 3 Nr. 72 EStG je nach Inbetriebnahme",
          kopf: ["Gebäude", "Anlage bis 31.12.2024 (ohne spätere Erweiterung)", "Anlage ab 01.01.2025 oder erweitert"],
          zeilen: [
            ["Einfamilienhaus, Nichtwohngebäude", "bis 30 kWp", "bis 30 kWp je Einheit"],
            ["Mehrfamilienhaus, gemischt genutztes Gebäude", "bis 15 kWp je Wohn- oder Gewerbeeinheit", "bis 30 kWp je Wohn- oder Gewerbeeinheit"],
            ["Obergrenze je Steuerpflichtigem", "100 kWp", "100 kWp"],
            ["Freiflächenanlagen", "nicht begünstigt", "nicht begünstigt"],
          ],
          hervorheben: 2,
          minBreite: 620,
          fussnote: "Die Vereinheitlichung auf 30 kWp je Einheit stammt aus dem Jahressteuergesetz 2024 und gilt für Anlagen, die nach dem 31.12.2024 angeschafft, in Betrieb genommen oder erweitert wurden. Quelle: § 3 Nr. 72 EStG, LfSt Bayern.",
        },
        { typ: "h3", text: "Die Grenze ist eine Freigrenze, kein Freibetrag" },
        {
          typ: "p",
          text: "Wer die Grenze überschreitet, versteuert nicht nur den Teil darüber, sondern sämtliche Einnahmen der Anlagen. Deshalb lohnt ein Blick auf die Summe: Mitgezählt werden alle Anlagen desselben Steuerpflichtigen, auch auf Garage, Carport oder Scheune – das Gesetz schließt Nebengebäude ausdrücklich ein. Ein Wahlrecht gibt es nicht; auf die Befreiung verzichten können Sie auch dann nicht, wenn Sie Verluste geltend machen wollten. Im Gegenzug sind Kosten wie Abschreibung oder Kreditzinsen nicht abziehbar.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Beispiel 1: steuerfrei", text: "Einfamilienhaus mit 14 kWp auf dem Dach und 6 kWp auf der Garage: 20 kWp für eine Wohneinheit – unter der Grenze." },
            { titel: "Beispiel 2: steuerfrei", text: "Mehrfamilienhaus mit 4 Wohnungen und 60 kWp, neu ab 2025: erlaubt wären 4 × 30 = 120 kWp, begrenzt auf 100 kWp je Betreiber." },
            { titel: "Beispiel 3: steuerpflichtig", text: "Mehrfamilienhaus mit 3 Wohnungen und 50 kWp, in Betrieb seit 2023 und nicht erweitert: Nach alter Regel gelten 3 × 15 = 45 kWp. Die Grenze ist überschritten – alle Einnahmen sind steuerpflichtig." },
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: `Handwerkerbonus trotz Steuerbefreiung`,
          text: `Laut BMF-Schreiben vom 17.07.2023 können Sie für die Installation einer steuerfreien Anlage auf dem selbst genutzten Wohnhaus die Steuerermäßigung für Handwerkerleistungen nach § 35a EStG nutzen: ${Math.round(HWB.anteil * 100)} % der Arbeits- und Fahrtkosten, höchstens ${HWB.maxProJahr.toLocaleString("de-DE")} € Steuerermäßigung im Jahr. Materialkosten zählen nicht, die Zahlung muss per Überweisung erfolgen.`,
        },
      ],
    },
    {
      id: "kleinunternehmer",
      titel: "Umsatzsteuer auf die Einspeisung: Kleinunternehmer oder Regelbesteuerung?",
      tocLabel: "Kleinunternehmerregelung",
      bloecke: [
        {
          typ: "p",
          text: "**Wer Strom ins Netz einspeist, ist umsatzsteuerlich Unternehmer – mit der Kleinunternehmerregelung nach § 19 UStG fällt darauf aber keine Umsatzsteuer an.** Seit 2025 gilt: Umsätze sind steuerfrei, wenn der Gesamtumsatz im Vorjahr 25.000 € nicht überschritten hat und im laufenden Jahr 100.000 € nicht überschreitet. Kleinunternehmer sind zudem von den Erklärungspflichten nach § 18 Abs. 1 bis 4 UStG ausgenommen – eine Umsatzsteuererklärung für die Anlage entfällt.",
        },
        {
          typ: "p",
          text: `Zur Einordnung: Unsere 10-kWp-Beispielanlage aus dem [Solarrechner](/solarrechner) speist rund ${kwh(BSP.eingespeist)} im Jahr ein und erzielt damit etwa ${eur(BSP.einspeiseErloes)} Einspeisevergütung (${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct je kWh bis 10 kWp, Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}). Das liegt weit unter der Grenze. Achtung nur, wenn Sie bereits selbstständig tätig sind: Dann zählen Photovoltaik und Ihr übriges Unternehmen zu einem Gesamtumsatz zusammen.`,
        },
        {
          typ: "tabelle",
          caption: "Kleinunternehmerregelung und Regelbesteuerung im Vergleich (neue Anlage mit 0 % Umsatzsteuer beim Kauf)",
          kopf: ["", "Kleinunternehmer (§ 19 UStG)", "Regelbesteuerung (Verzicht nach § 19 Abs. 3 UStG)"],
          zeilen: [
            ["Umsatzsteuer auf Einspeisevergütung", "keine", "19 %, an das Finanzamt abzuführen"],
            ["Vorsteuererstattung beim Kauf", "entfällt (0 % gezahlt)", "entfällt ebenfalls (0 % gezahlt)"],
            ["Voranmeldungen und Jahreserklärung", "keine", "ja, anfangs quartalsweise oder monatlich"],
            ["Fragebogen zur steuerlichen Erfassung", "nicht erforderlich*", "erforderlich"],
            ["Bindung", "keine", "mindestens 5 Kalenderjahre"],
          ],
          hervorheben: 1,
          minBreite: 640,
          fussnote: "* Nach BMF-Schreiben vom 12.06.2023 entfällt der Fragebogen, wenn die Anlage nach § 3 Nr. 72 EStG befreit ist, unter § 12 Abs. 3 UStG fällt und die Kleinunternehmerregelung angewendet wird. Dem Netzbetreiber teilen Sie dann statt einer Steuernummer Ihre MaStR-Nummer mit. Das Finanzamt kann im Einzelfall trotzdem Angaben anfordern.",
        },
        {
          typ: "p",
          text: "Früher war die Regelbesteuerung der Normalfall, weil Betreiber sich so die Umsatzsteuer aus dem Anlagenkauf zurückholen konnten. Mit dem Nullsteuersatz ist dieser Vorteil entfallen. Sinnvoll bleibt sie heute vor allem, wenn ohnehin ein umsatzsteuerpflichtiges Unternehmen besteht oder die Anlage nicht unter den Nullsteuersatz fällt, etwa auf einem Gewerbedach über 30 kWp.",
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Gewerbesteuer und Gewerbeanmeldung",
      bloecke: [
        {
          typ: "p",
          text: "**Gewerbesteuer zahlen Betreiber von Dachanlagen bis 30 kW nicht.** § 3 Nr. 32 GewStG befreit Betriebe, deren Tätigkeit sich auf Erzeugung und Vermarktung von Strom aus einer Solaranlage auf, an oder in einem Gebäude mit bis zu 30 kW beschränkt. Bei größeren Anlagen greift für Einzelpersonen der Freibetrag von 24.500 € Gewerbeertrag im Jahr (§ 11 GewStG) – eine Belastung entsteht bei Anlagen auf dem eigenen Wohnhaus deshalb regelmäßig nicht.",
        },
        {
          typ: "p",
          text: "Die Gewerbeanmeldung bei der Gemeinde ist eine Frage des Gewerberechts, nicht des Steuerrechts. Viele Gewerbeämter verlangen sie für private Dachanlagen nicht; die Handhabung ist aber nicht bundeseinheitlich. Im Zweifel genügt eine kurze Nachfrage bei Ihrer Gemeinde. Pflicht sind dagegen immer die Anmeldung beim Netzbetreiber und die Registrierung im Marktstammdatenregister – Schritt für Schritt erklärt im Ratgeber [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
        },
      ],
    },
    {
      id: "altanlagen",
      titel: "Was gilt für Altanlagen vor 2023?",
      tocLabel: "Altanlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Bei der Einkommensteuer profitieren auch ältere Anlagen: Die Befreiung nach § 3 Nr. 72 EStG gilt ab dem Veranlagungszeitraum 2022 unabhängig vom Inbetriebnahmejahr.** Für Anlagen, die vor 2025 in Betrieb gingen und nicht erweitert wurden, gelten allerdings die alten Grenzen – bei Mehrfamilienhäusern also 15 kWp je Einheit. Wird eine solche Anlage ab 2025 erweitert, gelten die neuen Grenzen; die Erweiterung sollten Sie im Marktstammdatenregister innerhalb eines Monats nachtragen.",
        },
        {
          typ: "p",
          text: "Bei der Umsatzsteuer ändert sich für Bestandsanlagen dagegen nichts von selbst. Wer vor 2023 zur Regelbesteuerung optiert hat, muss weiter Umsatzsteuer auf die Einspeisevergütung abführen und den selbst verbrauchten Strom als unentgeltliche Wertabgabe versteuern. Drei Wege aus dieser Bürokratie:",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Zur Kleinunternehmerregelung wechseln", "Nach Ablauf der fünfjährigen Bindung können Sie den Verzicht mit Wirkung zum nächsten Kalenderjahr widerrufen (§ 19 Abs. 3 UStG). Liegt die Anschaffung weniger als fünf Jahre zurück (dachintegriert: zehn Jahre), kann eine anteilige Vorsteuerkorrektur nach § 15a UStG anfallen."],
            ["Anlage aus dem Unternehmen entnehmen", "Laut BMF-Schreiben vom 27.02.2023 kann eine vor 2023 gekaufte Anlage zum Nullsteuersatz entnommen werden, wenn künftig voraussichtlich mehr als 90 % des Stroms privat genutzt werden. Davon geht die Verwaltung zum Beispiel aus, wenn ein Speicher, eine Wärmepumpe oder ein privat genutztes E-Auto Solarstrom verbraucht. Die Entnahme sollte dem Finanzamt schriftlich angezeigt werden."],
            ["Beraten lassen", "Welcher Weg günstiger ist, hängt von Restlaufzeit, Vorsteuer und Eigenverbrauch ab. Hier lohnt eine einmalige Steuerberatung."],
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Speicher nachrüsten ist steuerlich einfach",
          text: "Ein nachgerüsteter [Stromspeicher](/produkte/stromspeicher) für eine bestehende Anlage wird ebenfalls mit 0 % Umsatzsteuer geliefert und installiert. Die Größe des Speichers spielt für die kWp-Grenzen keine Rolle, weil dort nur die Modulleistung zählt.",
        },
      ],
    },
    {
      id: "grosse-anlagen",
      titel: "Wenn die Grenzen überschritten sind: Gewinn, Abschreibung, Speicher",
      tocLabel: "Anlagen über den Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Liegt eine Anlage über den Grenzen von § 3 Nr. 72 EStG, sind ihre Einnahmen gewerbliche Einkünfte und per Einnahmen-Überschuss-Rechnung (Anlage EÜR und Anlage G) zu erklären.** Dafür können Sie im Gegenzug alle Kosten absetzen. Das trifft vor allem große Mehrfamilienhäuser, Landwirte und Unternehmen – Details zu Letzteren im Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe).",
        },
        {
          typ: "liste",
          punkte: [
            "**Abschreibung:** Die Anlage wird linear über 20 Jahre abgeschrieben (5 % pro Jahr), im ersten Jahr zeitanteilig.",
            "**Sonderabschreibung und Investitionsabzugsbetrag:** Unter den Voraussetzungen des § 7g EStG sind bis zu 40 % Sonderabschreibung und vorab bis zu 50 % Investitionsabzugsbetrag möglich.",
            "**Batteriespeicher:** Ein gleichstromseitig (DC) angeschlossener Speicher gilt als Teil der Anlage und wird mit ihr abgeschrieben. Ein wechselstromseitig (AC) angeschlossener Speicher ist ein eigenes Wirtschaftsgut mit 10 Jahren Nutzungsdauer.",
            "**Eigenverbrauch:** Selbst verbrauchter Strom ist als Entnahme zu versteuern – bewertet mit den anteiligen Kosten oder, falls niedriger, abgeleitet aus der Einspeisevergütung.",
          ],
        },
        {
          typ: "p",
          text: "In Mehrfamilienhäusern kommt die Frage hinzu, wie der Strom an die Bewohner geht. Verkaufter Strom unterliegt der Umsatzsteuer, sofern Sie nicht Kleinunternehmer sind; die Stromsteuer entfällt bei Anlagen bis 2 MW in räumlichem Zusammenhang (§ 9 Abs. 1 Nr. 3 StromStG). Welche Modelle es gibt, erklärt der Ratgeber [Photovoltaik im Mehrfamilienhaus](/ratgeber/photovoltaik-mehrfamilienhaus).",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: So bleibt Ihre Anlage steuerlich sauber",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Angebot und Rechnung prüfen:** PV-Anlage und Speicher mit 0 %, Wallbox oder Wärmepumpe separat mit 19 %.",
            "**Anlagengröße im Marktstammdatenregister korrekt eintragen** – die Bruttoleistung dort ist für beide Steuerbefreiungen maßgeblich.",
            "**MaStR-Nummer an den Netzbetreiber** geben und angeben, dass Sie Kleinunternehmer sind. Die Gutschrift darf dann keine Umsatzsteuer ausweisen.",
            "**Handwerkerbonus nutzen:** Arbeitskosten in der Einkommensteuererklärung als Handwerkerleistung angeben.",
            "**Erweiterungen im Blick behalten:** Neue Module auf Garage oder Carport zählen zur Grenze. Erweiterungen im Register nachtragen.",
            "**Unterlagen aufbewahren:** Rechnung, Inbetriebnahmeprotokoll, MaStR-Bestätigung und Abrechnungen des Netzbetreibers.",
          ],
        },
        {
          typ: "tool",
          href: "/foerdercheck",
          titel: "Welche Vorteile gelten für Ihr Projekt?",
          text: "Der Förder-Check zeigt Steuervorteile, KfW-Kredit und Programme in Ihrem Bundesland auf einen Blick.",
          label: "Zum Förder-Check",
        },
      ],
    },
  ],

  faq: [
    { q: "Muss ich meine PV-Anlage in der Steuererklärung angeben?", a: "Nein, solange die Anlage unter § 3 Nr. 72 EStG fällt – also höchstens 30 kWp je Wohn- oder Gewerbeeinheit und insgesamt 100 kWp. Dann ist kein Gewinn zu ermitteln und die Einnahmen tauchen in der Einkommensteuererklärung nicht auf. Angeben können Sie aber die Arbeitskosten der Installation als Handwerkerleistung." },
    { q: "Muss ich die Einspeisevergütung versteuern?", a: "Bei Anlagen innerhalb der Grenzen von § 3 Nr. 72 EStG nicht. Umsatzsteuer fällt darauf nur an, wenn Sie auf die Kleinunternehmerregelung verzichtet haben. Die aktuellen Sätze finden Sie im Ratgeber [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026)." },
    { q: "Muss ich das Finanzamt über meine neue PV-Anlage informieren?", a: "In der Regel nicht. Laut BMF-Schreiben vom 12.06.2023 entfällt der Fragebogen zur steuerlichen Erfassung, wenn die Anlage einkommensteuerfrei ist, zum Nullsteuersatz gekauft wurde und Sie Kleinunternehmer sind. Das Finanzamt kann im Einzelfall trotzdem Angaben anfordern." },
    { q: "Kann ich die PV-Anlage von der Steuer absetzen?", a: "Die Anschaffungskosten nicht, weil die Einnahmen steuerfrei sind und Kosten dann nicht abziehbar sind. Für die Arbeitskosten der Montage auf dem selbst genutzten Wohnhaus können Sie aber 20 % als Handwerkerleistung nach § 35a EStG geltend machen, höchstens 1.200 € Steuerermäßigung im Jahr." },
    { q: "Gilt der Nullsteuersatz auch für den Stromspeicher?", a: "Ja. Speicher, die Solarstrom speichern, sind nach § 12 Abs. 3 UStG ausdrücklich begünstigt – auch wenn sie später zu einer bestehenden Anlage nachgerüstet werden." },
    { q: "Was passiert, wenn meine Anlage größer als 30 kWp ist?", a: "Bei der Einkommensteuer zählt die Grenze je Wohn- oder Gewerbeeinheit: Ein Haus mit zwei Wohnungen darf bis zu 60 kWp haben. Liegt die Anlage darüber, werden alle Einnahmen steuerpflichtig und Sie ermitteln den Gewinn per Einnahmen-Überschuss-Rechnung. Den Nullsteuersatz erhalten große Anlagen nur, wenn sie auf einem begünstigten Gebäude wie einem Wohnhaus installiert werden." },
    { q: "Muss ich für ein Balkonkraftwerk Steuern zahlen?", a: "Nein. Steckersolargeräte werden mit 0 % Umsatzsteuer verkauft und liegen weit unter den Grenzen der Einkommensteuerbefreiung. Pflicht ist nur die Registrierung im Marktstammdatenregister. Mehr dazu im Ratgeber [Balkonkraftwerk](/ratgeber/balkonkraftwerk)." },
    { q: "Brauche ich für die PV-Anlage eine Gewerbeanmeldung?", a: "Für private Dachanlagen verlangen viele Gemeinden keine Gewerbeanmeldung, die Praxis ist aber nicht einheitlich – eine kurze Nachfrage beim Gewerbeamt schafft Klarheit. Gewerbesteuer fällt bei Dachanlagen bis 30 kW nach § 3 Nr. 32 GewStG ohnehin nicht an." },
  ],

  passend: [
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile im Überblick", text: "Nullsteuersatz, Einkommensteuerbefreiung und Checkliste." },
    { href: "/ratgeber/photovoltaik-anmelden", titel: "PV-Anlage anmelden", text: "Netzbetreiber, Marktstammdatenregister und Fristen." },
    { href: "/ratgeber/kfw-kredit-270", titel: "KfW-Kredit 270", text: "Konditionen und Antrag für die Finanzierung." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Die aktuellen Sätze in ct/kWh." },
  ],

  quellen: [
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "§ 12 Abs. 3 UStG – Nullsteuersatz für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html", stand: "09/2026" },
    { titel: "§ 19 UStG – Kleinunternehmer", url: "https://www.gesetze-im-internet.de/ustg_1980/__19.html", stand: "09/2026" },
    { titel: "§ 3 Nr. 32 GewStG – Gewerbesteuerbefreiung kleiner Solaranlagen", url: "https://www.gesetze-im-internet.de/gewstg/__3.html", stand: "09/2026" },
    { titel: "Bundesministerium der Finanzen – BMF-Schreiben vom 17.07.2023 zu § 3 Nr. 72 EStG", url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2023-07-17-Photovoltaikanlagen-Steuerbefreiung.html", stand: "07/2023" },
    { titel: "Bundesministerium der Finanzen – FAQ Umsatzsteuerliche Maßnahmen zur Förderung von Photovoltaikanlagen", url: "https://www.bundesfinanzministerium.de/Content/DE/FAQ/foerderung-photovoltaikanlagen.html", stand: "09/2026" },
    { titel: "Bayerisches Landesamt für Steuern – Hilfe zu Photovoltaikanlagen", url: "https://www.lfst.bayern.de/fileadmin/RESSOURCEN/INFORMATIONEN/Steuerinfos/Weitere_Themen/Photovoltaikanlagen/Hilfe_zu_Photovoltaikanlagen_Juni_2025.pdf", stand: "06/2025" },
  ],

  seitenCta: { titel: "Steuerlich im grünen Bereich planen", text: "Anlagengröße so wählen, dass die Befreiungen greifen.", href: "/angebot", label: "Angebot anfragen" },
  cta: {
    title: "Wir planen Ihre Anlage steuerlich sauber.",
    text: "Mit korrekt ausgewiesenem Nullsteuersatz, passender Anlagengröße und Anmeldung bei Netzbetreiber und Marktstammdatenregister aus einer Hand – vom Fachbetrieb aus Türkheim.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Steuervorteile ansehen", href: "/forderungen/steuerlich" },
  },
};

export default artikel;
