// Ratgeber: § 14a EnWG – steuerbare Verbrauchseinrichtungen
// Rechtsstand September 2026. Geprüft an: § 14a EnWG (gesetze-im-internet.de),
// Bundesnetzagentur „Integration von steuerbaren Verbrauchseinrichtungen“ (Festlegungen
// BK6-22-300 und BK8-22/010-A vom 27.11.2023), § 30 MsbG, § 19 NAV.
// Rabattspanne und Mindestleistung aus src/data/wallbox.js (identisch mit BNetzA-Angabe).

import { WALLBOX } from "@/data/wallbox";

const P14A = WALLBOX.paragraf14a;
const kw = String(P14A.drosselungKw).replace(".", ",");

// Rechenbeispiel mit ausdrücklich angenommenem Netzentgelt-Arbeitspreis
const AP = 0.08; // €/kWh brutto – Annahme für das Beispiel, je Netzgebiet verschieden
const modul1 = 80 + AP * 3750 * 0.2;
const modul2 = (kwhJahr) => AP * 0.6 * kwhJahr;
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kmIn2h = Math.round(((P14A.drosselungKw * 2) / WALLBOX.verbrauchProHundert) * 100);

const artikel = {
  slug: "paragraf-14a-enwg",
  title: "§ 14a EnWG: Netzentgelt-Rabatt für Wärmepumpe und Wallbox",
  seoTitle: "§ 14a EnWG 2026: Module, Rabatt & Drosselung | Ökovolt",
  kurzTitel: "§ 14a EnWG",
  description:
    "§ 14a EnWG erklärt: Welche Wallboxen, Wärmepumpen und Speicher steuerbar sind, Module 1 bis 3 im Vergleich, Drosselung auf 4,2 kW und Bestandsschutz.",
  excerpt:
    "Seit 2024 dürfen Netzbetreiber neue Wallboxen, Wärmepumpen und Speicher im Notfall dimmen – dafür sinken die Netzentgelte. Welches Modul sich lohnt und was die Drosselung im Alltag bedeutet.",
  hauptKeyword: "14a enwg",
  keywords: [
    "§ 14a EnWG",
    "14a EnWG Wärmepumpe",
    "14a EnWG Wallbox",
    "steuerbare Verbrauchseinrichtung",
    "§ 14a Modul 1 Modul 2",
    "Netzentgelt Reduzierung Wärmepumpe",
    "14a EnWG Stromspeicher",
    "14a EnWG Bestandsanlagen",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Smartphone/smart-home-3920905_1280.jpg",
  bildAlt: "Hände halten ein Tablet mit Smart-Home-Steuerung vor einem Einfamilienhaus in der Abenddämmerung",
  badge: { wert: `${P14A.ersparnisVon}–${P14A.ersparnisBis} €`, text: "pauschaler Netzentgelt-Rabatt pro Jahr (Modul 1)" },

  kurzFazit: [
    `**§ 14a EnWG betrifft neue Wallboxen, Wärmepumpen, Klimaanlagen und Stromspeicher mit mehr als ${kw} kW Anschlussleistung**, die seit dem 1. Januar 2024 in Betrieb gehen.`,
    `**Der Netzbetreiber darf den Strombezug bei drohender Netzüberlastung auf ${kw} kW dimmen** – nie ganz abschalten. Haushaltsstrom und eigener Solarstrom sind nicht betroffen.`,
    `**Im Gegenzug sinken die Netzentgelte:** pauschal um ${P14A.ersparnisVon} bis ${P14A.ersparnisBis} € im Jahr (Modul 1), um 60 % des Netzentgelt-Arbeitspreises mit separatem Zähler (Modul 2) oder zusätzlich zeitvariabel (Modul 3).`,
    "**Bestandsanlagen vor 2024 bleiben geschützt** – Anlagen mit bisheriger Steuerungsvereinbarung wechseln spätestens 2029 ins neue System.",
  ],

  abschnitte: [
    {
      id: "was-regelt",
      titel: "Was regelt § 14a EnWG?",
      bloecke: [
        {
          typ: "p",
          text: `**§ 14a Energiewirtschaftsgesetz verpflichtet Netzbetreiber, neue steuerbare Verbrauchseinrichtungen wie Wärmepumpen und Wallboxen ohne Verzögerung anzuschließen, und erlaubt ihnen im Gegenzug, deren Strombezug bei drohender Netzüberlastung vorübergehend auf ${kw} kW zu begrenzen.** Wer steuerbar ist, zahlt dafür weniger Netzentgelt. Die Details hat die Bundesnetzagentur in zwei Festlegungen vom 27. November 2023 geregelt (BK6-22-300 zur Steuerung, BK8-22/010-A zu den Netzentgelten). Sie gelten seit dem 1. Januar 2024.`,
        },
        {
          typ: "p",
          text: "Der Hintergrund: Wärmepumpen und Ladepunkte haben hohe Leistungen und laufen oft gleichzeitig, etwa am Abend. Viele Niederspannungsnetze sind darauf noch nicht ausgelegt. Statt Anschlüsse abzulehnen, dürfen Netzbetreiber nun im Ausnahmefall dimmen – und müssen ihre Netze parallel digitalisieren und ausbauen.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Rechtsstand",
          text: "Stand September 2026. Dieser Ratgeber gibt die Regeln der Bundesnetzagentur allgemein verständlich wieder und ersetzt keine Rechtsberatung. Konkrete Beträge und Zeitfenster veröffentlicht Ihr Netzbetreiber.",
        },
      ],
    },
    {
      id: "welche-geraete",
      titel: "Welche Geräte fallen unter § 14a?",
      tocLabel: "Betroffene Geräte",
      bloecke: [
        {
          typ: "p",
          text: `**Betroffen sind Verbrauchseinrichtungen mit mehr als ${kw} kW Netzanschlussleistung, die seit dem 1. Januar 2024 in Betrieb genommen wurden.** Mehrere kleinere Wärmepumpen oder Klimageräte desselben Betreibers werden zusammengerechnet, Geräte unterschiedlicher Kategorien nicht.`,
        },
        {
          typ: "tabelle",
          caption: "Anwendungsbereich von § 14a EnWG nach Bundesnetzagentur, Stand September 2026",
          kopf: ["Gerät", "Unter § 14a?", "Hinweis"],
          zeilen: [
            [`Private Wallbox über ${kw} kW`, "ja", "öffentlich zugängliche Ladepunkte sind ausgenommen"],
            ["Wärmepumpe inkl. Heizstab", "ja", "mehrere Geräte werden zusammengerechnet"],
            ["Klimaanlage zur Raumkühlung", "ja", "wie Wärmepumpen"],
            ["Stromspeicher", "ja, beim Laden", "auch wenn er aktuell nur Solarstrom lädt"],
            ["PV-Anlage", "nein", "Einspeisung ist nicht Gegenstand von § 14a"],
            ["Haushaltsgeräte (Herd, Kühlschrank, Licht)", "nein", "normaler Haushaltsstrom bleibt unberührt"],
            ["Nachtspeicherheizung", "nein", "bisherige Regeln gelten dauerhaft fort"],
            [`Neugerät bis ${kw} kW`, "nein", "keine Steuerung erforderlich"],
          ],
          minBreite: 620,
          fussnote: "Quelle: Bundesnetzagentur, Integration von steuerbaren Verbrauchseinrichtungen. Ob ein Speicher betroffen ist, hängt davon ab, ob sein Laden den Bezug aus dem Netz beeinflussen kann.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Muss ich meine PV-Anlage abschalten?",
          text: "Nein. Die Bundesnetzagentur stellt klar, dass § 14a nur den Strombezug aus dem Netz betrifft. Für die Einspeisung von PV-Anlagen gelten eigene Regeln im EEG – etwa die 60-%-Grenze, die der Ratgeber [Solarspitzengesetz](/ratgeber/solarspitzengesetz) erklärt.",
        },
      ],
    },
    {
      id: "drosselung",
      titel: "Drosselung: Wie stark und wie lange darf gedimmt werden?",
      tocLabel: "Drosselung",
      bloecke: [
        {
          typ: "p",
          text: `**Der Netzbetreiber darf den Netzbezug einer steuerbaren Verbrauchseinrichtung nur vorübergehend und nur bei akuter Überlastungsgefahr reduzieren – und zwar höchstens auf ${kw} kW.** Diese Mindestleistung muss immer verfügbar bleiben. Sobald sich die Lage entspannt, muss er die Maßnahme zurücknehmen.`,
        },
        {
          typ: "liste",
          punkte: [
            `**Mindestleistung:** ${kw} kW je Gerät bei Direktansteuerung. Für große Wärmepumpen und Klimaanlagen mit zusammen über 11 kW gilt das 0,4-Fache der Anschlussleistung.`,
            "**Mit Energiemanagement:** Der Netzbetreiber gibt eine Obergrenze für alle angeschlossenen Geräte zusammen vor, berechnet mit einem Gleichzeitigkeitsfaktor. Ihr System verteilt die Leistung selbst.",
            `**Eigener Solarstrom zählt nicht:** Begrenzt wird nur der Bezug aus dem Netz. Mit PV und Speicher darf die Wallbox auch während einer Steuerung mehr als ${kw} kW ziehen.`,
            "**Präventive Steuerung als Übergang:** Wo der Netzbetreiber seinen Netzzustand noch nicht messen kann, darf er auf Basis von Planungsdaten vorbeugend steuern – höchstens zwei Stunden täglich und längstens 24 Monate ab der ersten präventiven Steuerung im betreffenden Netzbereich.",
          ],
        },
        {
          typ: "kennzahl",
          wert: `ca. ${kmIn2h} km`,
          titel: "Reichweite in zwei Stunden Laden bei gedimmter Wallbox",
          text: `Mit ${kw} kW lädt ein E-Auto in zwei Stunden rund ${String(P14A.drosselungKw * 2).replace(".", ",")} kWh – bei ${WALLBOX.verbrauchProHundert} kWh je 100 km also etwa ${kmIn2h} km. Die Bundesnetzagentur nennt rund 50 km und rechnet allenfalls mit geringen Komforteinbußen.`,
        },
      ],
    },
    {
      id: "module",
      titel: "Modul 1, 2 oder 3: Welcher Netzentgelt-Rabatt passt?",
      tocLabel: "Module im Vergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Als Ausgleich für die Steuerbarkeit wählen Sie zwischen einer pauschalen Reduzierung (Modul 1), einem um 60 % reduzierten Netzentgelt-Arbeitspreis mit eigenem Zähler (Modul 2) und – zusätzlich zu Modul 1 – zeitvariablen Netzentgelten (Modul 3).** Reduziert wird immer nur das Netzentgelt, nicht der gesamte Strompreis. Treffen Sie keine Wahl, rechnet der Netzbetreiber automatisch Modul 1 ab.",
        },
        {
          typ: "tabelle",
          caption: "Die drei Module der Netzentgeltreduzierung nach § 14a EnWG",
          kopf: ["", "Modul 1: Pauschale", "Modul 2: prozentual", "Modul 3: zeitvariabel"],
          zeilen: [
            ["Was sinkt", `pauschal ${P14A.ersparnisVon}–${P14A.ersparnisBis} € pro Jahr je Marktlokation`, "Netzentgelt-Arbeitspreis auf 40 %", "Netzentgelt nach Zeitfenster (Hoch-, Standard-, Niedrigtarif)"],
            ["Separater Zähler", "nicht nötig", "erforderlich, ohne Netzentgelt-Grundpreis", "nicht nötig"],
            ["Smart Meter", "nicht zwingend für den Rabatt", "nicht zwingend für den Rabatt", "erforderlich"],
            ["Kombinierbar", "mit Modul 3", "nicht kombinierbar", "nur zusammen mit Modul 1"],
            ["Geeignet für", "E-Auto, kleinere Wärmepumpe", "Wärmepumpe mit hohem Verbrauch", "flexibles Laden, Speicher, Energiemanagement"],
          ],
          minBreite: 680,
          fussnote: "Quelle: Bundesnetzagentur, Festlegung BK8-22/010-A. Die Spanne für Modul 1 nennt die Bundesnetzagentur mit Stand 2023; die tatsächliche Pauschale hängt vom Netzentgelt Ihres Netzbetreibers ab. Modul 3 gibt es seit April 2025.",
        },
        { typ: "h3", text: "Rechenbeispiel: Wann schlägt Modul 2 die Pauschale?" },
        {
          typ: "p",
          text: `Die Pauschale in Modul 1 setzt sich aus einem festen Betrag von 80 € und einer Stabilitätsprämie zusammen: dem Netzentgelt-Arbeitspreis mal 3.750 kWh mal 20 %. Bei einem angenommenen Netzentgelt-Arbeitspreis von 8 ct je kWh brutto ergibt das rund ${eur(modul1)} im Jahr. Modul 2 spart 60 % dieses Arbeitspreises auf jede Kilowattstunde am separaten Zähler: bei 3.000 kWh rund ${eur(modul2(3000))}, bei 5.000 kWh rund ${eur(modul2(5000))}, bei 8.000 kWh rund ${eur(modul2(8000))}.`,
        },
        {
          typ: "p",
          text: "Rechnerisch liegt die Schwelle im Beispiel also bei knapp 3.000 kWh. Weil Modul 2 aber einen zweiten Zählerplatz und dessen Messentgelt erfordert, lohnt es sich in der Praxis meist erst bei Wärmepumpen mit deutlich höherem Verbrauch. Für die Wallbox eines typischen Pendlers ist Modul 1 fast immer die bessere Wahl. Wie viel Strom Ihre Wärmepumpe braucht, schätzt der [Wärmepumpen-Rechner](/rechner/waermepumpe).",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Der Rabatt landet beim Lieferanten",
          text: "Der Netzbetreiber rechnet die Reduzierung mit Ihrem Stromlieferanten ab. Die Festlegung verpflichtet Lieferanten nicht, sie an Sie weiterzugeben – maßgeblich ist Ihr Vertrag. Prüfen Sie deshalb, ob Ihr Tarif die Ersparnis ausweist, oder wählen Sie einen Tarif für steuerbare Verbraucher. Hilfe bietet unser [Stromtarif-Service](/service/stromtarif).",
        },
      ],
    },
    {
      id: "technik",
      titel: "Technik und Kosten: Smart Meter, Steuerbox, Energiemanagement",
      tocLabel: "Technik & Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Gesteuert wird perspektivisch über ein intelligentes Messsystem mit Steuerbox, die der Messstellenbetreiber einbaut.** Die Kosten trägt der Betreiber. Das Messstellenbetriebsgesetz deckelt sie: Bei einer steuerbaren Verbrauchseinrichtung mit § 14a-Vereinbarung darf der Messstellenbetreiber Ihnen höchstens 50 € brutto im Jahr für das Messsystem berechnen, plus höchstens 50 € für die Steuerungseinrichtung (§ 30 Abs. 1 Nr. 4 und Abs. 2 MsbG). Mehr zum Rollout im Ratgeber [Smart-Meter-Pflicht](/ratgeber/smart-meter-pflicht).",
        },
        {
          typ: "p",
          text: "Für den Rabatt genügt schon der Auftrag an Mess- oder Netzbetreiber, die Technik einzubauen – verzögert sich der Einbau, erhalten Sie die Reduzierung trotzdem. Übergangsweise darf auch ältere Steuerungstechnik ohne Smart Meter eingesetzt werden. Ein Gerät, das sich nur ganz ein- und ausschalten lässt, erfüllt die Anforderungen ebenfalls; stufenlos regelbare Geräte nutzen die freigegebene Leistung aber besser.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Direktansteuerung", text: `Die Steuerbox schaltet jedes Gerät einzeln, zum Beispiel über einen Relaiskontakt. Einfach und günstig – aber jedes Gerät bekommt im Steuerungsfall pauschal ${kw} kW.` },
            { titel: "Energiemanagementsystem", text: "Das [Energiemanagementsystem](/ratgeber/energiemanagementsystem) erhält eine Gesamtgrenze und verteilt sie selbst, inklusive PV-Strom und Speicher. Sinnvoll, sobald Wärmepumpe, Wallbox und Speicher zusammenkommen." },
          ],
        },
        {
          typ: "tool",
          href: "/rechner/waermepumpe",
          titel: "Was kostet der Betrieb Ihrer Wärmepumpe?",
          text: "Heizkosten mit Wärmepumpe und optional PV im Vergleich zu Gas oder Öl berechnen.",
          label: "Zum Wärmepumpen-Rechner",
        },
      ],
    },
    {
      id: "bestand",
      titel: "Was gilt für Bestandsanlagen vor 2024?",
      tocLabel: "Bestandsanlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Wärmepumpen, Wallboxen und Speicher, die vor dem 1. Januar 2024 in Betrieb gingen, genießen Bestandsschutz.** Wie lange, hängt davon ab, ob schon eine Steuerung vereinbart war:",
        },
        {
          typ: "tabelle",
          caption: "Übergangsregeln für Bestandsanlagen nach Bundesnetzagentur",
          kopf: ["Situation", "Was gilt", "Freiwilliger Wechsel"],
          zeilen: [
            ["Inbetriebnahme vor 2024, Steuerung vereinbart (z. B. Wärmepumpentarif mit Sperrzeiten)", "bisherige Bedingungen bis 31.12.2028, ab 2029 neue Regeln", "jederzeit möglich, nicht umkehrbar"],
            ["Inbetriebnahme vor 2024, keine Steuerung vereinbart", "dauerhaft ausgenommen", "möglich, nicht umkehrbar"],
            ["Austausch oder wesentliche Änderung des Geräts", "gilt als Neuanlage – § 14a greift", "–"],
            ["Nachtspeicherheizung", "alte Regeln bis zur Außerbetriebnahme", "nicht möglich"],
          ],
          minBreite: 620,
          fussnote: "Der Bestandsschutz ist objektbezogen: Wird eine alte Wärmepumpe gegen ein neues Gerät getauscht – selbst das gleiche Modell –, gelten die neuen Regeln. Ein reduziertes Netzentgelt gibt es nur bei vereinbarter Steuerbarkeit.",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So gehen Sie bei einer neuen Wärmepumpe oder Wallbox vor",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Steuerbares Gerät auswählen", "Auf eine Steuerschnittstelle achten, etwa SG Ready, EEBus oder einen Relaiseingang. Für PV-Haushalte ein Energiemanagement einplanen – siehe [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik)."],
            ["Beim Netzbetreiber anmelden", "Wärmepumpe und Wallbox sind vor der Inbetriebnahme anzumelden, Wallboxen über 12 kVA brauchen die Zustimmung des Netzbetreibers (§ 19 Abs. 2 NAV). Das übernimmt der Elektrofachbetrieb."],
            ["Ansteuerungsart und Modul wählen", "Direktansteuerung oder Energiemanagement festlegen und Modul 1, 2 oder 1+3 bei der Anmeldung oder beim Lieferanten angeben."],
            ["Technik beauftragen", "Messstellenbetreiber oder Netzbetreiber mit dem Einbau von Smart Meter und Steuerbox beauftragen. Der Auftrag genügt für den Rabatt."],
            ["Tarif prüfen", "Kontrollieren, ob der Stromlieferant die Netzentgeltreduzierung weitergibt, und bei Bedarf wechseln."],
          ],
        },
        {
          typ: "p",
          text: "Bei Ökovolt planen wir Wärmepumpe, [Wallbox](/ratgeber/wallbox-installation), Speicher und Steuerung als Gesamtsystem und übernehmen die Anmeldung beim Netzbetreiber. Welche Kosten bei der Wärmepumpe selbst anfallen, zeigt der Ratgeber [Wärmepumpe Kosten](/ratgeber/waermepumpe-kosten).",
        },
      ],
    },
  ],

  faq: [
    { q: "Was ist eine steuerbare Verbrauchseinrichtung nach § 14a EnWG?", a: `Ein Gerät mit mehr als ${kw} kW Netzanschlussleistung, dessen Strombezug der Netzbetreiber bei drohender Überlastung dimmen darf: private Wallboxen, Wärmepumpen, Klimaanlagen und Stromspeicher, die seit dem 1. Januar 2024 in Betrieb gehen.` },
    { q: "Wie viel spart man mit § 14a EnWG?", a: `Mit Modul 1 sinkt das Netzentgelt pauschal um ${P14A.ersparnisVon} bis ${P14A.ersparnisBis} € im Jahr, je nach Netzgebiet. Mit Modul 2 reduziert sich der Netzentgelt-Arbeitspreis am separaten Zähler um 60 %, was sich bei Wärmepumpen mit hohem Verbrauch mehr lohnen kann. Entscheidend ist, ob Ihr Lieferant die Reduzierung weitergibt.` },
    { q: "Wie oft wird meine Wärmepumpe gedrosselt?", a: "Nur wenn eine konkrete Überlastung des lokalen Netzes droht. Wo Netzbetreiber noch präventiv steuern, sind höchstens zwei Stunden am Tag erlaubt, begrenzt auf 24 Monate. Die Wärmepumpe läuft dabei mit mindestens 4,2 kW weiter." },
    { q: "Ist § 14a EnWG Pflicht?", a: "Für neue Geräte über 4,2 kW mit Inbetriebnahme ab 2024 ja – die Teilnahme an der netzorientierten Steuerung ist verpflichtend. Bestandsanlagen ohne bisherige Steuerungsvereinbarung sind dauerhaft ausgenommen und können freiwillig wechseln." },
    { q: "Welches Modul ist besser für die Wallbox?", a: "Meist Modul 1, weil ein E-Auto mit rund 2.500 kWh im Jahr zu wenig verbraucht, damit sich ein separater Zähler für Modul 2 rechnet. Wer flexibel laden kann und ein Smart Meter hat, kann Modul 1 zusätzlich mit zeitvariablen Netzentgelten (Modul 3) kombinieren." },
    { q: "Ist mein Stromspeicher von § 14a betroffen?", a: "Ja, wenn er mit mehr als 4,2 kW aus dem Netz laden kann – auch wenn er derzeit nur Solarstrom speichert. Gedimmt wird aber nur das Laden aus dem Netz; die Entladung ins Haus und die Nutzung von Solarstrom bleiben unberührt." },
    { q: "Was kostet die Steuerbox?", a: "Der grundzuständige Messstellenbetreiber darf für das intelligente Messsystem bei einer § 14a-Vereinbarung höchstens 50 € im Jahr und für die Steuerungseinrichtung höchstens weitere 50 € im Jahr vom Anschlussnehmer verlangen (§ 30 MsbG)." },
  ],

  passend: [
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox-Installation", text: "Kosten, Anmeldung und § 14a in der Praxis." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Wärmepumpe, Wallbox und Speicher intelligent steuern." },
    { href: "/ratgeber/smart-meter-pflicht", titel: "Smart-Meter-Pflicht", text: "Wer ein intelligentes Messsystem bekommt." },
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Messtechnik und Steuerung für Ihr Zuhause." },
  ],

  quellen: [
    { titel: "§ 14a EnWG – Netzorientierte Steuerung von steuerbaren Verbrauchseinrichtungen", url: "https://www.gesetze-im-internet.de/enwg_2005/__14a.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Integration von steuerbaren Verbrauchseinrichtungen", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/start.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Reduzierung des Netzentgelts (Module 1 bis 3)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/Netzentgelt_table.html", stand: "09/2026" },
    { titel: "§ 30 MsbG – Preisobergrenzen für intelligente Messsysteme und Steuerungseinrichtungen", url: "https://www.gesetze-im-internet.de/messbg/__30.html", stand: "09/2026" },
    { titel: "§ 19 NAV – Mitteilungspflichten für Ladeeinrichtungen und Verbrauchsgeräte", url: "https://www.gesetze-im-internet.de/nav/__19.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wärmepumpe & Wallbox steuerbar planen", text: "Mit Energiemanagement und passendem Modul.", href: "/angebot", label: "Beratung anfragen" },
  cta: {
    title: "Wir planen Wärmepumpe, Wallbox und Speicher als ein System.",
    text: "Inklusive Anmeldung beim Netzbetreiber, Steuerungskonzept nach § 14a EnWG und Energiemanagement für Ihren Solarstrom – vom Fachbetrieb aus Türkheim.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Smart Energy Home", href: "/produkte/smartenergyhome" },
  },
};

export default artikel;
