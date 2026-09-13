// Ratgeber: Photovoltaik nach 20 Jahren (Ü20) – Weiterbetrieb, Eigenverbrauch, Direktvermarktung, Repowering
// Recherchestand 13.09.2026: §§ 21, 23b, 53 EEG 2023; Verbraucherzentrale (Stand 08/2026);
// MsbG §§ 29, 30 (gesetze-im-internet.de). Rechenbeispiele mit den Annahmen des Solarrechners.

import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { SPEICHER } from "@/lib/rechner/annahmen";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const kwh = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " kWh";
const ctStr = (n) => String(Math.round(n * 10) / 10).replace(".", ",");
const jahre = (x) => (x ? x.toFixed(0) : "über 20");

// Ü20-Anschlussvergütung: Jahresmarktwert Solar 2025 (4,508 ct) abzüglich
// Vermarktungspauschale 2026 (0,23 ct) – Orientierungswert.
const MARKTWERT_2025 = 4.51;
const PAUSCHALE_2026 = 0.23;
const UE20_CT = MARKTWERT_2025 - PAUSCHALE_2026;
const STROM_CT = ANNAHMEN.strompreis * 100;

// Beispielanlage: 5 kWp aus 2006, nach 20 Jahren rund 10 % Leistungsverlust
// (0,5 %/Jahr wie im Solarrechner) -> gerechnet wie 4,5 kWp.
const VERBRAUCH = 4500;
const ALT = berechne({ kwp: 4.5, ausrichtung: "sued", neigung: "mittel", verbrauch: VERBRAUCH, speicherKwh: 0 });
const ALT_SP = berechne({ kwp: 4.5, ausrichtung: "sued", neigung: "mittel", verbrauch: VERBRAUCH, speicherKwh: 5 });
const NEU = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: VERBRAUCH, speicherKwh: 0 });

const voll = (ALT.jahresertrag * UE20_CT) / 100;
const mitEv = (r) => (r.eigenverbrauch * STROM_CT) / 100 + (r.eingespeist * UE20_CT) / 100;
const A_VOLL = voll;
const A_EV = mitEv(ALT);
const A_SP = mitEv(ALT_SP);
const SPEICHER_KOSTEN = 5 * SPEICHER.preisProKwh + SPEICHER.nachruestAufschlag;
const SP_AMORT = SPEICHER_KOSTEN / (A_SP - A_EV);

const artikel = {
  slug: "photovoltaik-nach-20-jahren",
  title: "Ü20-Photovoltaik: Was nach 20 Jahren EEG-Förderung gilt",
  seoTitle: "Ü20 Photovoltaik 2026: Optionen nach 20 Jahren | Ökovolt",
  kurzTitel: "Photovoltaik nach 20 Jahren",
  description:
    "Ü20 Photovoltaik: Was nach 20 Jahren EEG-Förderung gilt. Weiter einspeisen, auf Eigenverbrauch umrüsten, Speicher oder Repowering – mit Rechenbeispiel.",
  excerpt:
    "Ende 2026 fallen die Anlagen des Baujahrs 2006 aus der Förderung. Sie dürfen weiter einspeisen – bekommen aber nur noch den Marktwert. Vier Wege im Vergleich, mit ehrlicher Rechnung.",
  hauptKeyword: "ü20 photovoltaik",
  keywords: ["Ü20 Photovoltaik", "Photovoltaik nach 20 Jahren", "EEG-Förderung ausgelaufen", "Anschlussvergütung", "ausgeförderte PV-Anlage", "PV-Anlage Eigenverbrauch umrüsten", "Repowering Photovoltaik"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Team/solar-power-6860359_1280.jpg",
  bildAlt: "Monteure mit Schutzhelm arbeiten an Solarmodulen auf einem Dach",
  badge: { wert: `~${ctStr(UE20_CT)} ct`, text: "je kWh Anschlussvergütung (Orientierung 2026)" },

  kurzFazit: [
    "**Nach 20 Jahren endet die feste EEG-Vergütung, nicht der Betrieb.** Anlagen bis 100 kW dürfen weiter einspeisen und erhalten bis Ende 2032 automatisch eine Anschlussvergütung.",
    `Diese orientiert sich am Jahresmarktwert Solar abzüglich einer Vermarktungspauschale – 2025 lag der Marktwert bei rund ${ctStr(MARKTWERT_2025)} ct/kWh, die Pauschale beträgt 2026 ${ct(PAUSCHALE_2026)} ct.`,
    `Wirtschaftlich besser ist meist die **Umstellung auf Eigenverbrauch**: Jede selbst genutzte Kilowattstunde spart rund ${ctStr(STROM_CT)} ct statt ${ctStr(UE20_CT)} ct Erlös.`,
    "Ein Speicher allein rechnet sich an einer 20 Jahre alten Anlage selten. Sind Module oder Wechselrichter am Ende, ist ein **Repowering** mit deutlich mehr Leistung oft die bessere Investition.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was passiert mit meiner PV-Anlage nach 20 Jahren?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Nach Ablauf der 20-jährigen EEG-Förderung darf Ihre Anlage ohne Unterbrechung weiterlaufen und weiter einspeisen.** Der Netzbetreiber muss den Strom abnehmen und vergüten. Statt der alten, festen Vergütung von oft 50 Cent und mehr je Kilowattstunde erhalten Sie aber nur noch die sogenannte [Anschlussvergütung](/wissen/lexikon#anschlussverguetung) – den Marktwert des Solarstroms abzüglich einer Pauschale. Eine Anmeldung oder ein neuer Vertrag ist dafür nicht nötig.",
        },
        {
          typ: "p",
          text: "Die Förderung läuft 20 Jahre plus das Jahr der Inbetriebnahme. Eine Anlage, die irgendwann im Jahr 2006 ans Netz ging, erhält ihre feste Vergütung also bis zum 31. Dezember 2026. Nach Branchenberichten betrifft das allein in diesem Jahr rund 60.000 Anlagen; weil der Photovoltaik-Zubau ab 2009 stark anstieg, werden es in den Folgejahren deutlich mehr.",
        },
        {
          typ: "karten",
          items: [
            { titel: "1. Weiter voll einspeisen", text: "Keine Umbauten, automatische Anschlussvergütung. Einfach, aber der Erlös deckt bei kleinen Anlagen kaum die laufenden Kosten." },
            { titel: "2. Auf Eigenverbrauch umrüsten", text: "Strom selbst nutzen, Überschuss einspeisen. Erfordert einen Umbau am Zählerplatz – ist aber meist die wirtschaftlichste Variante." },
            { titel: "3. Direktvermarktung", text: "Verkauf über einen Direktvermarkter. Für kleine Dachanlagen wegen Gebühren und Messtechnik selten lohnend." },
            { titel: "4. Repowering", text: "Alte Module und Wechselrichter durch neue ersetzen. Die neue Anlage liefert auf gleicher Fläche deutlich mehr Leistung; ob sie neu EEG-vergütet wird, ist vorab zu klären." },
          ],
        },
      ],
    },
    {
      id: "anschlussverguetung",
      titel: "Anschlussvergütung: So viel bekommen Ü20-Anlagen",
      tocLabel: "Anschlussvergütung",
      bloecke: [
        {
          typ: "p",
          text: "**Ausgeförderte Anlagen bis 100 kW erhalten nach § 21 EEG eine Einspeisevergütung in Höhe des Jahresmarktwerts Solar, gedeckelt auf 10 Cent je Kilowattstunde (§ 23b EEG).** Davon ziehen die Netzbetreiber eine Pauschale für die Vermarktungskosten ab, die jedes Jahr im Oktober für das Folgejahr veröffentlicht wird. Mit einem intelligenten Messsystem halbiert sich dieser Abzug (§ 53 EEG). Die Regelung gilt nach dem Solarpaket I bis zum 31. Dezember 2032.",
        },
        {
          typ: "tabelle",
          caption: "Kennzahlen zur Ü20-Anschlussvergütung, Stand September 2026",
          kopf: ["Kennzahl", "Wert", "Hinweis"],
          zeilen: [
            ["Jahresmarktwert Solar 2025", `${ctStr(MARKTWERT_2025)} ct/kWh`, "Basis für die Abrechnung 2025; der Wert für 2026 steht erst Anfang 2027 fest"],
            ["Vermarktungspauschale 2025", "0,72 ct/kWh", "mit intelligentem Messsystem halbiert"],
            ["Vermarktungspauschale 2026", `${ct(PAUSCHALE_2026)} ct/kWh`, "mit intelligentem Messsystem halbiert"],
            ["Deckel", "10 ct/kWh", "gilt seit 2023 für den anzulegenden Jahresmarktwert"],
            ["**Orientierung 2026**", `**ca. ${ctStr(UE20_CT)} ct/kWh**`, "wenn der Marktwert auf dem Niveau von 2025 bleibt"],
            ["Befristung", "31.12.2032", "danach nur noch Eigenverbrauch oder Direktvermarktung"],
          ],
          markierteZeile: 4,
          minBreite: 620,
          fussnote: "Quellen: § 23b und § 53 EEG 2023, Verbraucherzentrale, Übertragungsnetzbetreiber (netztransparenz.de). Weil viel Solarstrom zur Mittagszeit die Börsenpreise drückt, liegt der Marktwert Solar meist unter dem durchschnittlichen Börsenstrompreis.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum der Solarmarktwert so niedrig ist",
          text: "Solarstrom wird überwiegend dann erzeugt, wenn alle Anlagen gleichzeitig liefern. An sonnigen Mittagen sinken die Börsenpreise deshalb stark, teils bis ins Negative. Wie oft das inzwischen vorkommt, zeigt unser Ratgeber [Negative Strompreise](/ratgeber/negative-strompreise).",
        },
      ],
    },
    {
      id: "rechnung",
      titel: "Rechenbeispiel: Welche Variante lohnt sich?",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Für eine typische Ü20-Anlage bringt die Umstellung auf Eigenverbrauch pro Jahr ein Mehrfaches der reinen Einspeisung.** Unser Beispiel: eine 5-kWp-Anlage von 2006 auf einem Süddach, ein Haushalt mit ${VERBRAUCH.toLocaleString("de-DE")} kWh Jahresverbrauch. Nach 20 Jahren hat die Anlage rund 10 % Leistung verloren und erzeugt noch etwa ${kwh(ALT.jahresertrag)} im Jahr. Gerechnet wird mit ${ctStr(STROM_CT)} ct Strompreis und ${ctStr(UE20_CT)} ct Anschlussvergütung.`,
        },
        {
          typ: "tabelle",
          caption: "Ü20-Anlage 5 kWp (Baujahr 2006): jährlicher Vorteil nach Variante",
          kopf: ["", "Volleinspeisung", "Eigenverbrauch", "Eigenverbrauch + 5 kWh Speicher"],
          zeilen: [
            ["Selbst genutzt", "0 kWh", kwh(ALT.eigenverbrauch), kwh(ALT_SP.eigenverbrauch)],
            ["Eingespeist", kwh(ALT.jahresertrag), kwh(ALT.eingespeist), kwh(ALT_SP.eingespeist)],
            ["Stromkosten-Ersparnis", "0 €", eur10((ALT.eigenverbrauch * STROM_CT) / 100), eur10((ALT_SP.eigenverbrauch * STROM_CT) / 100)],
            ["Anschlussvergütung", eur10(A_VOLL), eur10((ALT.eingespeist * UE20_CT) / 100), eur10((ALT_SP.eingespeist * UE20_CT) / 100)],
            ["**Vorteil pro Jahr (vor Kosten)**", `**${eur10(A_VOLL)}**`, `**${eur10(A_EV)}**`, `**${eur10(A_SP)}**`],
            ["Einmalige Investition", "keine", "Umbau Zählerplatz, ab ca. 200 €", `Speicher ca. ${eur10(SPEICHER_KOSTEN)} + Umbau`],
          ],
          hervorheben: 2,
          minBreite: 700,
          fussnote: `Orientierungswerte ohne laufende Kosten wie Versicherung, Messstellenbetrieb und Anlagencheck. Eigenverbrauch und Autarkie berechnet mit denselben Kurven wie unser Solarrechner; Speicherpreis ${SPEICHER.preisProKwh} €/kWh plus ${eur(SPEICHER.nachruestAufschlag)} Nachrüstaufschlag wie im Stromspeicher-Rechner.`,
        },
        {
          typ: "p",
          text: `Die Volleinspeisung bringt in diesem Beispiel rund ${eur10(A_VOLL)} im Jahr. Nach Abzug von Versicherung, Zählermiete und gelegentlicher Wartung bleibt davon wenig bis nichts – die Verbraucherzentrale kommt für kleine Anlagen sogar auf ein Minus. Mit Eigenverbrauch steigt der Vorteil auf etwa ${eur10(A_EV)}, weil jede selbst genutzte Kilowattstunde mehr als siebenmal so viel wert ist wie eine eingespeiste.`,
        },
        {
          typ: "p",
          text: `Der Speicher erhöht den Vorteil um weitere rund ${eur10(A_SP - A_EV)} pro Jahr. Bei Kosten von etwa ${eur10(SPEICHER_KOSTEN)} bräuchte er rund ${jahre(SP_AMORT)} Jahre, um sich zu bezahlen – länger, als Module und Wechselrichter einer 20 Jahre alten Anlage realistisch noch halten. Ein Speicher ist deshalb vor allem dann sinnvoll, wenn er ohnehin mit einer späteren Modernisierung weitergenutzt wird.`,
        },
        {
          typ: "tool",
          href: "/rechner/stromspeicher",
          titel: "Rechnet sich ein Speicher für Ihre Anlage?",
          text: "Anlagengröße, Verbrauch und Speichergröße eingeben – inklusive Nachrüstung an einer bestehenden Anlage.",
          label: "Zum Stromspeicher-Rechner",
        },
      ],
    },
    {
      id: "umruesten",
      titel: "Auf Eigenverbrauch umrüsten: So geht es",
      tocLabel: "Eigenverbrauch umrüsten",
      bloecke: [
        {
          typ: "p",
          text: "**Für den Wechsel von Voll- auf Überschusseinspeisung muss ein Elektrofachbetrieb die Anlage so umklemmen, dass der Solarstrom zuerst ins Hausnetz fließt, und einen Zweirichtungszähler setzen lassen.** Viele Altanlagen haben einen eigenen Einspeisezähler; nach dem Umbau misst ein gemeinsamer [Zweirichtungszähler](/wissen/lexikon#zweirichtungszaehler) Bezug und Einspeisung. Ist der Zählerschrank veraltet, kann eine Erneuerung nötig werden – dann steigen die Kosten deutlich über die Mindestsumme.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Anlagencheck", "Module, Verkabelung, Wechselrichter und Befestigung prüfen lassen. Die Verbraucherzentrale nennt dafür rund 250 bis 300 €. Bei beschädigten Modulen oder Isolationsfehlern zuerst reparieren."],
            ["Umbau planen", "Messkonzept und Zählerplatz mit dem Fachbetrieb klären. Er meldet die Änderung beim Netzbetreiber an."],
            ["Zähler tauschen", "Der Messstellenbetreiber setzt einen Zweirichtungszähler oder ein intelligentes Messsystem."],
            ["Register aktualisieren", "Den Wechsel der Einspeiseart im [Marktstammdatenregister](/wissen/lexikon#marktstammdatenregister) eintragen."],
            ["Verbrauch verlagern", "Waschmaschine, Spülmaschine, Warmwasser und E-Auto möglichst in die Sonnenstunden legen – siehe [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen)."],
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Der Wechselrichter ist oft das schwächste Glied",
          text: "Wechselrichter halten typischerweise 10 bis 20 Jahre; an vielen Ü20-Anlagen wurde er bereits einmal getauscht oder steht kurz davor. Ein neues Gerät muss den heute geltenden Netzanschlussregeln entsprechen. Wer ohnehin tauscht, sollte gleich einen Hybridwechselrichter prüfen, an den sich später ein Speicher anschließen lässt – Grundlagen im Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik).",
        },
        {
          typ: "h3",
          text: "Smart Meter: Pflicht oder nicht?",
        },
        {
          typ: "p",
          text: "Anlagen mit **mehr als 7 kW** gehören nach § 29 Messstellenbetriebsgesetz zu den Pflichteinbaufällen für ein intelligentes Messsystem mit Steuerungseinrichtung – auch Bestandsanlagen, die der Messstellenbetreiber schrittweise bis 2032 ausstattet. Die jährlichen Kosten sind gedeckelt: für Anlagen über 7 bis 15 kW auf 50 € für den Anlagenbetreiber, dazu bis zu 50 € für die Steuerungseinrichtung. Kleinere Ü20-Anlagen sind optionale Einbaufälle. Ein Vorteil des Smart Meters: Die Vermarktungspauschale halbiert sich. Mehr dazu im Ratgeber [Smart-Meter-Pflicht](/ratgeber/smart-meter-pflicht).",
        },
      ],
    },
    {
      id: "direktvermarktung",
      titel: "Direktvermarktung: Für wen sie sich lohnt",
      tocLabel: "Direktvermarktung",
      bloecke: [
        {
          typ: "p",
          text: "**Statt der Anschlussvergütung können Sie den Strom über einen Direktvermarkter an der Börse verkaufen (sonstige Direktvermarktung).** Für Anlagen über 100 kW ist das nach Förderende der Regelfall. Kleine Anlagen können freiwillig wechseln, zahlen dann aber Grund- und Dienstleistungsentgelte, brauchen ein intelligentes Messsystem mit viertelstündlicher Messung und müssen ab 25 kW fernsteuerbar sein.",
        },
        {
          typ: "p",
          text: "Für die typische Ü20-Dachanlage mit 3 bis 10 kW übersteigen die Kosten meist den Mehrerlös gegenüber der Anschlussvergütung. Interessant wird die Direktvermarktung bei größeren Anlagen auf Hallen- oder Stalldächern – oder wenn nach 2032 die Anschlussvergütung wegfällt. Details bietet unsere Seite [Direktvermarktung](/service/direktvermarktung).",
        },
      ],
    },
    {
      id: "repowering",
      titel: "Repowering: Neue Module, neue Vergütung",
      tocLabel: "Repowering",
      bloecke: [
        {
          typ: "p",
          text: "**Beim Repowering ersetzen Sie die alten Module und den Wechselrichter durch eine neue, meist deutlich leistungsstärkere Anlage.** Wirtschaftlich zählt vor allem der höhere Eigenverbrauch; ob die neue Anlage zusätzlich wieder 20 Jahre EEG-Vergütung erhält, hängt von der rechtlichen Einordnung ab (siehe Kasten). Weil Module von 2006 oft nur 150 bis 200 Watt leisteten und heutige Module 400 Watt und mehr erreichen, passt auf dieselbe Dachfläche etwa die doppelte Leistung.",
        },
        {
          typ: "tabelle",
          caption: `Repowering-Beispiel: neue 10-kWp-Anlage auf dem Dach der alten 5-kWp-Anlage (${VERBRAUCH.toLocaleString("de-DE")} kWh Verbrauch, ohne Speicher)`,
          kopf: ["Kennzahl", "Wert"],
          zeilen: [
            ["Investition (Richtwert)", eur(NEU.investition)],
            ["Jahresertrag", kwh(NEU.jahresertrag)],
            ["Autarkie", `${Math.round(NEU.autarkie * 100)} %`],
            [`Vergütung neuer Anlagen ab ${VERGUETUNG.gueltigAbLabel} (bis 10 kWp)`, `${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct/kWh – Anspruch im Einzelfall klären`],
            ["Vorteil pro Jahr", eur(NEU.nutzenProJahr)],
            ["Amortisation", `ca. ${NEU.amortisationJahre ? NEU.amortisationJahre.toFixed(1).replace(".", ",") : "über 20"} Jahre`],
          ],
          fussnote: `Werte aus dem Rechenkern unseres Solarrechners, gerechnet mit der Vergütung einer Neuanlage (Anlagenpreis ${Math.round(preisProKwp(10)).toLocaleString("de-DE")} €/kWp bei 10 kWp, ohne Kosten für Demontage und Entsorgung der Altanlage). Keine Angebote.`,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Neue Vergütung nach Repowering: vorab klären",
          text: "Die Verbraucherzentrale geht davon aus, dass eine komplett neue Anlage auf dem Dach einer Ü20-Anlage als Neuanlage 20 Jahre zu den aktuellen Sätzen vergütet wird. Nach dem Wortlaut von § 38b Abs. 2 EEG gelten Solaranlagen, die Anlagen **an demselben Standort ersetzen**, bis zur bisherigen Leistung jedoch als zum Zeitpunkt der ersetzten Anlagen in Betrieb genommen – bei ausgeförderten Anlagen hieße das: für diesen Leistungsanteil keine neue Förderung. Die Einordnung ist nicht abschließend geklärt. Lassen Sie sie vor der Bestellung vom Netzbetreiber schriftlich bestätigen; bei Streit hilft die Clearingstelle EEG|KWKG.",
        },
        {
          typ: "p",
          text: "Ein Repowering lohnt sich besonders, wenn das Dach ohnehin saniert werden muss, die alten Module deutliche Schäden oder starke Leistungsverluste zeigen oder künftig eine Wärmepumpe oder ein E-Auto dazukommt. Wie das bei uns abläuft, zeigt die Seite [Repowering](/service/repowering).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Speicher und Wechselrichter herstellerneutral auswählen",
          text: "Für Nachrüstung und Repowering kommen sowohl AC-gekoppelte Speicher als auch Hybridwechselrichter infrage. Ökovolt ist Partner von Sigenergy, Fronius, Huawei, Solis, BYD und meteocontrol – entscheidend für die Auswahl ist aber, was technisch zur vorhandenen Anlage und zu Ihrem Verbrauch passt.",
        },
      ],
    },
    {
      id: "pflichten",
      titel: "Steuern, Versicherung und Pflichten nach dem Förderende",
      tocLabel: "Steuern & Pflichten",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Einkommensteuer:** Einnahmen aus Anlagen bis 30 kWp auf Wohngebäuden sind nach § 3 Nr. 72 EStG steuerfrei – das gilt auch für Ü20-Anlagen. Details im Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
            "**Marktstammdatenregister:** Änderungen wie der Wechsel der Einspeiseart oder eine Stilllegung müssen dort und beim Netzbetreiber gemeldet werden.",
            "**Versicherung:** Alte Spezialpolicen prüfen. Oft ist eine Absicherung über die Wohngebäudeversicherung günstiger – siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
            "**Betriebssicherheit:** Sie bleiben als Betreiber für den sicheren Zustand verantwortlich. Ein regelmäßiger Anlagencheck ist bei 20 Jahre alten Komponenten besonders sinnvoll.",
            "**Stilllegung:** Wer die Anlage abbaut, muss sie abmelden und die Module fachgerecht entsorgen; Hersteller und Händler sind zur Rücknahme verpflichtet.",
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Was bekomme ich nach 20 Jahren für meinen Solarstrom?", a: `Anlagen bis 100 kW erhalten automatisch die Anschlussvergütung: den Jahresmarktwert Solar (2025 rund ${ctStr(MARKTWERT_2025)} ct/kWh, höchstens 10 ct) abzüglich einer Vermarktungspauschale von ${ct(PAUSCHALE_2026)} ct/kWh im Jahr 2026. Mit intelligentem Messsystem halbiert sich die Pauschale.` },
    { q: "Muss ich meine Ü20-Anlage beim Netzbetreiber neu anmelden?", a: "Für den reinen Weiterbetrieb mit Volleinspeisung nein – die Anschlussvergütung greift automatisch. Wer auf Eigenverbrauch umrüstet, Komponenten tauscht oder stilllegt, muss das dem Netzbetreiber und im Marktstammdatenregister melden." },
    { q: "Wie lange gilt die Anschlussvergütung für Ü20-Anlagen?", a: "Nach dem Solarpaket I bis zum 31. Dezember 2032. Danach bleiben Eigenverbrauch, Direktvermarktung oder ein Repowering als neue Anlage." },
    { q: "Lohnt sich ein Stromspeicher für eine Ü20-Anlage?", a: "Nur in wenigen Fällen. Der zusätzliche Eigenverbrauch bringt meist einige Hundert Euro im Jahr, der Speicher kostet mehrere Tausend. Sinnvoll ist er, wenn er bei einer späteren Modernisierung weitergenutzt wird oder mit einem ohnehin fälligen Hybridwechselrichter kommt." },
    { q: "Bekomme ich nach einem Modultausch wieder EEG-Vergütung?", a: "Das ist nicht eindeutig geregelt. Nach § 38b Abs. 2 EEG übernehmen Ersatzanlagen am selben Standort bis zur bisherigen Leistung das alte Inbetriebnahmedatum – bei ausgeförderten Anlagen entstünde für diesen Anteil keine neue Förderung. Die Verbraucherzentrale geht bei einer komplett neuen Anlage dagegen von 20 Jahren Vergütung aus. Lassen Sie die Einordnung vorab vom Netzbetreiber bestätigen." },
    { q: "Muss ich für eine Ü20-Anlage Steuern zahlen?", a: "Bei Anlagen bis 30 kWp auf Wohngebäuden in der Regel nicht: Einnahmen und Entnahmen sind nach § 3 Nr. 72 EStG von der Einkommensteuer befreit." },
    { q: "Brauche ich für meine Ü20-Anlage einen Smart Meter?", a: "Bei mehr als 7 kW installierter Leistung ist die Anlage ein Pflichteinbaufall; der Messstellenbetreiber stattet sie bis spätestens 2032 aus. Die Kosten sind gesetzlich gedeckelt. Kleinere Anlagen können freiwillig umgerüstet werden." },
  ],

  passend: [
    { href: "/service/repowering", titel: "Repowering", text: "Alte Anlage modernisieren, neue Vergütung sichern." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Die aktuellen Sätze für neue Anlagen." },
    { href: "/ratgeber/stromspeicher-kosten", titel: "Stromspeicher Kosten", text: "Preise je kWh und Nachrüstung." },
    { href: "/ratgeber/smart-meter-pflicht", titel: "Smart-Meter-Pflicht", text: "Wer ein intelligentes Messsystem braucht." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Photovoltaik: Was tun mit der Ü20-Anlage, wenn die EEG-Förderung endet?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-tun-mit-der-ue20anlage-wenn-die-eegfoerderung-endet-50846", stand: "08/2026" },
    { titel: "§ 23b EEG 2023 – Einspeisevergütung bei ausgeförderten Anlagen", url: "https://www.gesetze-im-internet.de/eeg_2014/__23b.html", stand: "09/2026" },
    { titel: "§ 21 EEG 2023 – Einspeisevergütung", url: "https://www.gesetze-im-internet.de/eeg_2014/__21.html", stand: "09/2026" },
    { titel: "Clearingstelle EEG|KWKG – Möglichkeiten nach Ablauf des Vergütungszeitraums", url: "https://www.clearingstelle-eeg-kwkg.de/haeufige-rechtsfrage/69", stand: "09/2026" },
    { titel: "Clearingstelle EEG|KWKG – Erweitern oder Repowern zu früheren Vergütungssätzen?", url: "https://www.clearingstelle-eeg-kwkg.de/haeufige-rechtsfrage/100", stand: "09/2026" },
    { titel: "Solarenergie-Förderverein Deutschland – Grundlagen für den Weiterbetrieb von Ü20-Anlagen", url: "https://www.sfv.de/weiterbetrieb-ue20-grundlagen", stand: "01/2026" },
    { titel: "DGS – Der Jahresmarktwert Solar 2025", url: "https://www.dgs.de/newsletter/der-jahresmarktwert-solar-2025/", stand: "01/2026" },
    { titel: "§ 29 Messstellenbetriebsgesetz – Ausstattung mit intelligenten Messsystemen", url: "https://www.gesetze-im-internet.de/messbg/__29.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Ü20-Anlage modernisieren?", text: "Ertrag und Amortisation einer neuen Anlage berechnen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Weiterbetreiben, umrüsten oder erneuern? Wir prüfen Ihre Ü20-Anlage.",
    text: "Anlagencheck vor Ort, ehrliche Rechnung für alle Varianten und auf Wunsch Umbau, Speicher oder Repowering mit Anmeldung aus einer Hand.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Repowering ansehen", href: "/service/repowering" },
  },
};

export default artikel;
