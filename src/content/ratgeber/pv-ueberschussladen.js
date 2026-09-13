// Ratgeber: PV-Überschussladen
// Kosten aus dem E-Auto-Laderechner (@/lib/rechner/wallbox), Wallbox-Preise
// und § 14a-Werte aus @/data/wallbox.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WALLBOX, spanne } from "@/data/wallbox";
import { SPEICHER, WALLBOX as LADEN } from "@/lib/rechner/annahmen";
import { rechneWallbox } from "@/lib/rechner/wallbox";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const kwh = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " kWh";
const komma = (n, s = 1) => n.toFixed(s).replace(".", ",");
const ctStr = (n) => komma(n, 1);

const KM = 15000;
const VERBRAUCH = SPEICHER.eAutoVerbrauch; // kWh/100 km inkl. Ladeverluste
const ZUHAUSE = SPEICHER.eAutoLadeanteilZuhause;
const fall = (anteilPv) => rechneWallbox({ km: KM, verbrauch: VERBRAUCH, anteilZuhause: ZUHAUSE, anteilPv, kwp: 10 });
const NETZ = fall(0);
const PV30 = fall(0.3);
const PV55 = fall(0.55);
const PV75 = fall(0.75);

const STROM_CT = ANNAHMEN.strompreis * 100;
const EINSP_CT = VERGUETUNG.saetze[0].teileinspeisung;
const VORTEIL_CT = STROM_CT - EINSP_CT;

// Ladeleistung bei 230 V je Phase
const kw = (phasen, ampere) => komma((phasen * 230 * ampere) / 1000, 1);

const artikel = {
  slug: "pv-ueberschussladen",
  title: "PV-Überschussladen: So lädt Ihr E-Auto mit reinem Solarstrom",
  seoTitle: "PV-Überschussladen: Funktion & Wallbox-Tipps | Ökovolt",
  kurzTitel: "PV-Überschussladen",
  description:
    "PV-Überschussladen erklärt: Wie die Wallbox Solarstrom nutzt, warum Phasenumschaltung und 6 A Mindeststrom zählen, was es spart und worauf es ankommt.",
  excerpt:
    "Überschussladen macht aus schlecht vergüteter Einspeisung günstigen Fahrstrom. Wie die Regelung funktioniert, was Phasenumschaltung und Mindeststrom bedeuten und welche Wallbox Sie brauchen.",
  hauptKeyword: "pv überschussladen",
  keywords: [
    "PV-Überschussladen",
    "Überschussladen Wallbox",
    "E-Auto mit Solarstrom laden",
    "Phasenumschaltung Wallbox",
    "Wallbox 1-phasig 3-phasig umschalten",
    "Mindestladestrom 6 A",
    "Überschussladen lohnt sich",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Wärmepumpe & E-Mobilität",
  bild: "/Images/Ratgeber/pv-ueberschussladen.jpg",
  bildAlt: "Fronius-Wattpilot-Wallbox auf einer Standsäule vor einer Holzfassade, daneben ein Elektroauto",
  badge: { wert: "+25 Punkte", text: "mehr Solaranteil beim Laden durch dynamisches Überschussladen (HTW Berlin)" },

  kurzFazit: [
    "**Beim PV-Überschussladen passt die Wallbox ihre Ladeleistung laufend an den Solarstrom an, der gerade nicht im Haus gebraucht wird.** Das Auto lädt dann fast ausschließlich mit eigenem Strom.",
    `Jede so geladene Kilowattstunde spart rund ${ctStr(STROM_CT)} ct Netzstrom und kostet nur die entgangene Einspeisevergütung von ${ct(EINSP_CT)} ct – ein Vorteil von gut **${Math.round(VORTEIL_CT)} ct je kWh**.`,
    "Laut HTW Berlin steigert dynamisches Überschussladen den Solaranteil an der Fahrzeugladung **im Mittel um 25 Prozentpunkte**.",
    "Wegen des Mindestladestroms von 6 A startet eine dreiphasige Ladung erst bei rund **4,1 kW Überschuss**, einphasig schon bei **1,4 kW**. Eine automatische 1-/3-Phasen-Umschaltung nutzt deshalb deutlich mehr Sonnenstunden.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist PV-Überschussladen – und lohnt es sich?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: `**PV-Überschussladen bedeutet, dass ein Elektroauto nur mit dem Solarstrom geladen wird, der sonst ins Netz fließen würde.** Ein Energiemanager misst dazu am Hausanschluss, wie viel Strom gerade übrig ist, und gibt der [Wallbox](/produkte/wallbox) laufend einen passenden Ladestrom vor. Scheint mehr Sonne, lädt das Auto schneller; kocht jemand Mittagessen, wird die Ladeleistung reduziert.`,
        },
        {
          typ: "p",
          text: `Es lohnt sich für fast jeden Haushalt mit [Photovoltaikanlage](/produkte/photovoltaikanlage) und E-Auto, das tagsüber regelmäßig zu Hause steht – etwa im Homeoffice, am Wochenende oder bei einem Zweitwagen. Denn eingespeister Strom bringt neuen Anlagen bis 10 kWp nur ${ct(EINSP_CT)} ct je kWh ([Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026)), Netzstrom kostet dagegen über 30 ct.`,
        },
        {
          typ: "kennzahl",
          wert: `${Math.round(VORTEIL_CT)} ct`,
          titel: "Vorteil je Kilowattstunde, die per Überschuss ins Auto geht",
          text: `Ersparter Netzstrom (${ctStr(STROM_CT)} ct, vorsichtiger Mittelwert) abzüglich entgangener Einspeisevergütung (${ct(EINSP_CT)} ct, Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}).`,
        },
      ],
    },
    {
      id: "funktionsweise",
      titel: "Wie funktioniert Überschussladen technisch?",
      tocLabel: "Funktionsweise",
      bloecke: [
        {
          typ: "p",
          text: "**Drei Bausteine arbeiten zusammen: ein Zähler am Netzanschlusspunkt, eine Regelung (im Wechselrichter, Energiemanager oder in der Wallbox-App) und eine Wallbox, die ihren Ladestrom fein verstellen kann.**",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Überschuss messen", "Ein Energiezähler oder Smart Meter am Hausanschluss erfasst, ob gerade Strom ins Netz fließt oder bezogen wird. Die Erzeugung allein reicht nicht – entscheidend ist der Saldo nach dem Hausverbrauch."],
            ["Ladestrom berechnen", "Das [Energiemanagementsystem](/ratgeber/energiemanagementsystem) rechnet den Überschuss in einen Ladestrom um: Bei 230 V entsprechen 1 A etwa 0,23 kW je genutzter Phase."],
            ["Wallbox ansteuern", "Die Wallbox teilt dem Auto über das Pilotsignal den erlaubten Strom mit – meist in Schritten von 1 A. Das Fahrzeug übernimmt den neuen Wert innerhalb weniger Sekunden."],
            ["Nachregeln oder pausieren", "Sinkt der Überschuss unter den Mindeststrom, schaltet die Regelung nach einer Verzögerung auf einphasig um, pausiert oder lädt – je nach Modus – mit etwas Netzstrom weiter."],
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Hausspeicher, Wärmepumpe, Auto: Wer bekommt den Strom zuerst?",
          text: "In den meisten Systemen legen Sie eine Reihenfolge fest. Häufig sinnvoll: vormittags zuerst den Hausspeicher laden, mittags das Auto, am Nachmittag wieder den Speicher für den Abend. Ein Speicher sollte das Auto dagegen nicht nachts leeren – das kostet Zyklen und bringt wenig. Mehr dazu unter [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "phasen",
      titel: "1-phasig, 3-phasig und Phasenumschaltung",
      tocLabel: "Phasenumschaltung",
      bloecke: [
        {
          typ: "p",
          text: `**Der Mindestladestrom von 6 A je Phase (Norm IEC 61851) bestimmt, ab welchem Überschuss überhaupt geladen werden kann.** Dreiphasig sind das ${kw(3, 6)} kW, einphasig nur ${kw(1, 6)} kW. Eine Wallbox mit automatischer Phasenumschaltung beginnt deshalb schon bei kleinem Überschuss einphasig und schaltet bei viel Sonne auf drei Phasen hoch.`,
        },
        {
          typ: "tabelle",
          caption: "Ladeleistung einer Wallbox je nach Phasenzahl und Ladestrom (230 V)",
          kopf: ["Betrieb", "Minimum (6 A)", "16 A", "Regelschritt je 1 A", "Typischer Einsatz"],
          zeilen: [
            ["1-phasig", `${kw(1, 6)} kW`, `${kw(1, 16)} kW`, "0,23 kW", "Frühjahr, Herbst, Winter, wechselhaftes Wetter"],
            ["3-phasig", `${kw(3, 6)} kW`, `${kw(3, 16)} kW`, "0,69 kW", "Sonnige Mittagsstunden, große Anlagen"],
            ["mit Umschaltung", `${kw(1, 6)} kW`, `${kw(3, 16)} kW`, "0,23 / 0,69 kW", "Ganzjährig – nutzt beide Bereiche"],
          ],
          hervorheben: 1,
          markierteZeile: 2,
          minBreite: 760,
          fussnote: "Rechenwerte bei 230 V Nennspannung. Wie viel das Auto tatsächlich aufnimmt, begrenzt zusätzlich sein Bordlader (manche Modelle laden einphasig nur mit 16 A oder nur zwei Phasen).",
        },
        {
          typ: "p",
          text: "Die HTW Berlin hat Messdaten von Haushalten mit PV-Anlage und E-Auto ausgewertet. Ergebnis: Dreiphasige Wallboxen ohne Umschaltung erreichen höhere Solaranteile erst bei Anlagen über etwa 15 kW. Kleinere Anlagen profitieren von der niedrigen Einstiegsleistung einphasiger Ladung.",
        },
        { typ: "h3", text: "Worauf es bei der Umschaltung ankommt" },
        {
          typ: "liste",
          punkte: [
            "**Pausen und Verzögerungen:** Für die Umschaltung wird die Ladung kurz unterbrochen. Gute Systeme warten einige Minuten, bevor sie umschalten, damit eine Wolke nicht ständig Schaltvorgänge auslöst.",
            "**Fahrzeugverträglichkeit:** Nicht jedes Auto reagiert gleich gut auf häufige Start-Stopp-Vorgänge oder Phasenwechsel. Einige Modelle benötigen einen höheren Mindeststrom als 6 A. Prüfen Sie Erfahrungswerte für Ihr Modell.",
            "**Schieflast:** Einphasiges Laden belastet eine Phase. Die Anschlussregeln (VDE-AR-N 4100) begrenzen die Unsymmetrie; die Wallbox muss das berücksichtigen.",
            "**Wirkungsgrad:** Bei kleiner Leistung sind die Ladeverluste relativ höher. Laut HTW erreichen bei 1,4 kW im Mittel nur 76 % der Solarenergie die Fahrzeugbatterie, bei 11 kW rund 90 %.",
          ],
        },
      ],
    },
    {
      id: "modi",
      titel: "Lademodi: reiner Überschuss, Mindestladung oder Zielzeit",
      tocLabel: "Lademodi",
      bloecke: [
        {
          typ: "p",
          text: "**Gute Systeme bieten mehrere Lademodi, damit das Auto trotz Solarfokus rechtzeitig voll ist.** Die Bezeichnungen unterscheiden sich je nach Hersteller, das Prinzip ist gleich:",
        },
        {
          typ: "tabelle",
          caption: "Übliche Lademodi beim Überschussladen",
          kopf: ["Modus", "Wie geladen wird", "Geeignet für"],
          zeilen: [
            ["Nur PV", "Ausschließlich Überschuss, Pause bei zu wenig Sonne", "Zweitwagen, lange Standzeiten"],
            ["Min + PV", "Mindestleistung aus dem Netz, Überschuss obendrauf", "Täglich genutztes Auto, Winterhalbjahr"],
            ["Zielladung", "Solar bevorzugt, Netzstrom nur, wenn der Zielstand zur gewünschten Uhrzeit sonst nicht erreicht wird", "Pendler mit festen Abfahrtszeiten"],
            ["Sofort / Schnell", "Volle Leistung, unabhängig von der Sonne", "Kurzfristig benötigte Reichweite"],
          ],
          minBreite: 600,
        },
        {
          typ: "kasten",
          variant: "tipp",
          text: "Wer einen [dynamischen Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich) hat, kann die Zielladung mit günstigen Nachtstunden kombinieren: Solarstrom tagsüber, Restladung dann, wenn der Börsenstrompreis niedrig ist.",
        },
      ],
    },
    {
      id: "ersparnis",
      titel: "Wie viel spart Überschussladen im Jahr?",
      tocLabel: "Ersparnis",
      bloecke: [
        {
          typ: "p",
          text: `**Bei ${KM.toLocaleString("de-DE")} km im Jahr spart ein Solaranteil von 55 % an der Heimladung rund ${eur10(PV55.solarVorteil)} pro Jahr gegenüber reinem Netzstrom.** Die Werte stammen aus unserem [E-Auto-Laderechner](/rechner/wallbox): ${VERBRAUCH} kWh je 100 km inklusive Ladeverlusten, ${Math.round(ZUHAUSE * 100)} % der Ladung zu Hause, Rest öffentlich.`,
        },
        {
          typ: "tabelle",
          caption: `Jährliche Ladekosten bei ${KM.toLocaleString("de-DE")} km, Stand September 2026`,
          kopf: ["Solaranteil an der Heimladung", "Solarstrom", "Ladekosten gesamt", "je 100 km", "Vorteil ggü. Netzstrom"],
          zeilen: [
            ["0 % (nur Netzstrom)", "–", eur10(NETZ.solar.summe), `${komma(NETZ.solar.je100, 2)} €`, "–"],
            ["30 % (z. B. ohne Überschussregelung)", kwh(PV30.kwhSolar), eur10(PV30.solar.summe), `${komma(PV30.solar.je100, 2)} €`, eur10(PV30.solarVorteil)],
            ["55 % (typisch mit Überschussladen)", kwh(PV55.kwhSolar), eur10(PV55.solar.summe), `${komma(PV55.solar.je100, 2)} €`, `**${eur10(PV55.solarVorteil)}**`],
            ["75 % (Überschussladen, viel Standzeit tagsüber)", kwh(PV75.kwhSolar), eur10(PV75.solar.summe), `${komma(PV75.solar.je100, 2)} €`, eur10(PV75.solarVorteil)],
          ],
          hervorheben: 4,
          markierteZeile: 2,
          minBreite: 680,
          fussnote: `Netzstrom ${ctStr(STROM_CT)} ct/kWh, öffentliches Laden mit ${LADEN.oeffentlichCt} ct/kWh (Mischpreis) enthalten, Solarstrom mit ${ct(EINSP_CT)} ct entgangener Einspeisevergütung bewertet. Orientierungswerte.`,
        },
        {
          typ: "p",
          text: `Zum Vergleich: Ein Benziner mit ${komma(LADEN.kraftstoffe.benzin.verbrauch).replace(",0", "")} Litern auf 100 km kostet bei derselben Fahrleistung rund ${eur10(PV55.verbrenner.summe)} im Jahr an Kraftstoff. Die Wallbox selbst kostet mit Installation typischerweise ${spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])} – Details im Ratgeber [Wallbox-Installation](/ratgeber/wallbox-installation).`,
        },
        { typ: "h3", text: "Wie viel Reichweite passt an einem Sonnentag ins Auto?" },
        {
          typ: "p",
          text: `Eine 10-kWp-Anlage liefert an einem klaren Sommertag mittags oft 6 bis 7 kW, von denen nach dem Hausverbrauch meist 4 bis 6 kW übrig bleiben. Über vier bis fünf Stunden kommen so rund 20 bis 25 kWh ins Auto – bei ${VERBRAUCH} kWh je 100 km also etwa ${Math.round(20 / VERBRAUCH * 100)} bis ${Math.round(25 / VERBRAUCH * 100)} km Reichweite. An einem wechselhaften Frühjahrstag sind es eher 5 bis 10 kWh, im Dezember oft nur wenige Kilowattstunden. Wer werktags pendelt, lädt deshalb am Wochenende und an Homeoffice-Tagen gezielt voll.`,
        },
        { typ: "tool", href: "/rechner/wallbox", titel: "Ladekosten mit Ihrem Solaranteil berechnen", text: "Fahrleistung, Verbrauch und Anteil der Heimladung eingeben – mit Vergleich zum Verbrenner.", label: "Zum E-Auto-Laderechner" },
      ],
    },
    {
      id: "anforderungen",
      titel: "Welche Wallbox eignet sich für Überschussladen?",
      tocLabel: "Anforderungen an die Wallbox",
      bloecke: [
        {
          typ: "p",
          text: "**Geeignet ist jede Wallbox, deren Ladestrom sich von außen in kleinen Schritten vorgeben lässt – ideal mit automatischer 1-/3-Phasen-Umschaltung.** Diese Punkte sollten Sie prüfen:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Offene Schnittstelle:** Modbus TCP, EEBus oder [OCPP](/wissen/lexikon#ocpp) – oder eine direkte Kopplung an Wechselrichter bzw. Energiemanager desselben Systems.",
            "**Feine Regelung:** Stromvorgabe in 1-A-Schritten ab 6 A.",
            "**Phasenumschaltung:** Automatisch und mit einstellbaren Verzögerungen.",
            "**Zähler am Netzanschluss:** Ohne Messung des Hausverbrauchs gibt es kein echtes Überschussladen.",
            "**Steuerbarkeit nach § 14a EnWG:** Wallboxen über 4,2 kW müssen vom Netzbetreiber gedimmt werden können – das betrifft nur den Netzbezug, nicht den eigenen Solarstrom.",
            "**Anmeldung:** 11-kW-Wallboxen sind beim Netzbetreiber anzumelden, 22-kW-Geräte brauchen seine Zustimmung.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Aus einem System oder herstellerübergreifend?",
          text: "Wallbox, Wechselrichter und Speicher aus einem System lassen sich meist am einfachsten einrichten. So schaltet etwa die Fronius-Wallbox Wattpilot Flex laut Hersteller automatisch zwischen einer und drei Phasen und nutzt Überschüsse ab 1,38 kW. Ökovolt ist Partner von Fronius, Sigenergy, Huawei, Solis und meteocontrol; wir planen aber auch herstellerübergreifende Lösungen, etwa mit einem offenen Energiemanager, wenn bereits Komponenten vorhanden sind.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "§ 14a EnWG und Überschussladen",
          text: `Wird die Wallbox als steuerbare Verbrauchseinrichtung angemeldet, darf der Netzbetreiber den Netzbezug im Ausnahmefall auf mindestens 4,2 kW begrenzen. Laut Bundesnetzagentur ist selbst erzeugter Solarstrom davon nicht betroffen. Im Gegenzug sinken die Netzentgelte – pauschal um etwa ${WALLBOX.paragraf14a.ersparnisVon} bis ${WALLBOX.paragraf14a.ersparnisBis} € im Jahr. Mehr im [Lexikon zu § 14a EnWG](/wissen/lexikon#paragraf-14a-enwg).`,
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler und wie Sie sie vermeiden",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Nur die Erzeugung messen:** Ohne Zähler am Hausanschluss lädt das Auto auch dann, wenn Herd und Waschmaschine den Solarstrom schon verbrauchen.",
            "**Schwellen zu knapp einstellen:** Ständiges Ein- und Ausschalten bei Wolken belastet Schütze und nervt. Etwas Puffer und Verzögerung sind besser.",
            "**Winter unterschätzen:** Von November bis Februar reicht der Überschuss oft nicht für 4,1 kW. Ohne Phasenumschaltung oder Min+PV-Modus bleibt das Auto leer.",
            "**Speicher entleert ins Auto:** Der Hausspeicher sollte nicht nachts das Auto laden – das verschiebt nur Strom und kostet Zyklen.",
            "**Einspeisebegrenzung vergessen:** Neue Anlagen ohne Smart Meter speisen nach dem [Solarspitzengesetz](/ratgeber/solarspitzengesetz) höchstens 60 % der Modulleistung ein. Überschussladen hilft, sonst abgeregelten Strom zu nutzen.",
          ],
        },
      ],
    },
  ],

  howTo: {
    name: "PV-Überschussladen einrichten",
    schritte: [
      { name: "Voraussetzungen prüfen", text: "PV-Anlage, Zähler am Netzanschlusspunkt und eine regelbare Wallbox (ab 6 A, möglichst mit Phasenumschaltung) müssen vorhanden sein." },
      { name: "Wallbox anmelden und koppeln", text: "Wallbox beim Netzbetreiber anmelden und per Modbus, EEBus, OCPP oder Hersteller-App mit Wechselrichter bzw. Energiemanager verbinden." },
      { name: "Lademodus wählen", text: "Nur PV, Min + PV oder Zielladung einstellen und die gewünschte Uhrzeit bzw. den Ziel-Ladestand festlegen." },
      { name: "Prioritäten festlegen", text: "Reihenfolge zwischen Hausspeicher, Wärmepumpe und Auto definieren." },
      { name: "Schwellen feinjustieren", text: "Nach einigen Tagen Umschaltverzögerung und Mindestüberschuss so anpassen, dass möglichst wenig Schaltvorgänge entstehen." },
    ],
  },

  faq: [
    { q: "Ab wie viel Überschuss kann ich mein E-Auto laden?", a: `Einphasig ab etwa ${kw(1, 6)} kW, dreiphasig ab etwa ${kw(3, 6)} kW. Grund ist der Mindestladestrom von 6 A je Phase. Wallboxen mit automatischer Phasenumschaltung decken beide Bereiche ab.` },
    { q: "Brauche ich für Überschussladen einen Stromspeicher?", a: "Nein. Überschussladen funktioniert ohne Speicher. Ist einer vorhanden, legen Sie fest, ob zuerst der Speicher oder das Auto geladen wird. Laut HTW Berlin erhöht ein Speicher den Solaranteil an der Fahrzeugladung im Mittel um 9 Prozentpunkte." },
    { q: "Kann jede Wallbox Überschussladen?", a: "Nur Wallboxen, deren Ladestrom sich extern regeln lässt, etwa über Modbus, EEBus, OCPP oder eine Hersteller-Kopplung. Einfache Wallboxen ohne Kommunikation laden immer mit fester Leistung." },
    { q: "Ist einphasiges Laden schlechter für das Auto?", a: "Nein, für den Akku ist die geringe Leistung unkritisch. Der Wirkungsgrad ist bei kleiner Leistung etwas schlechter, dafür wird Solarstrom genutzt, der sonst eingespeist würde. Manche Autos laden einphasig nur mit begrenzter Leistung." },
    { q: "Wie viel spart Überschussladen?", a: `Bei ${KM.toLocaleString("de-DE")} km im Jahr und 55 % Solaranteil an der Heimladung rund ${eur10(PV55.solarVorteil)} gegenüber reinem Netzstrom. Jede Kilowattstunde bringt einen Vorteil von gut ${Math.round(VORTEIL_CT)} ct.` },
    { q: "Funktioniert Überschussladen auch im Winter?", a: "Eingeschränkt. An sonnigen Wintertagen reicht der Überschuss meist für einphasiges Laden, an trüben Tagen nicht. Ein Min+PV- oder Zielladungsmodus sorgt dafür, dass das Auto trotzdem geladen wird." },
    { q: "Wird die Wallbox beim Überschussladen nach § 14a gedrosselt?", a: "Eine Dimmung durch den Netzbetreiber begrenzt nur den Strombezug aus dem Netz auf mindestens 4,2 kW. Solarstrom aus der eigenen Anlage ist davon nicht betroffen." },
  ],

  passend: [
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox-Installation", text: "Kosten, Anmeldung und Förderung." },
    { href: "/rechner/wallbox", titel: "E-Auto-Laderechner", text: "Ladekosten mit Solaranteil berechnen." },
    { href: "/ratgeber/bidirektionales-laden", titel: "Bidirektionales Laden", text: "Wann das E-Auto das Haus versorgt." },
    { href: "/produkte/wallbox", titel: "Wallbox von Ökovolt", text: "PV-optimierte Ladelösungen aus einer Hand." },
  ],

  quellen: [
    { titel: "HTW Berlin – Solares Laden von Elektrofahrzeugen", url: "https://solar.htw-berlin.de/studien/solares-laden-von-elektrofahrzeugen/", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Steuerbare Verbrauchseinrichtungen (§ 14a EnWG)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/start.html", stand: "09/2026" },
    { titel: "Fronius – Wattpilot Flex: Technische Daten und Phasenumschaltung", url: "https://www.fronius.com/de-de/germany/solarenergie/eigenheim/produkte-und-loesungen/e-mobilitaet/wattpilot-flex-e-auto-ladestation", stand: "09/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
    { titel: "VDE FNN – VDE-AR-N 4100 Technische Anschlussregeln Niederspannung", url: "https://www.vde.com/de/fnn/arbeitsgebiete/tar/tar-niederspannung", stand: "09/2026" },
  ],

  seitenCta: { titel: "Was spart Solarstrom im Tank?", text: "Ladekosten mit Ihrem Solaranteil berechnen.", href: "/rechner/wallbox", label: "Zum Laderechner" },
  cta: {
    title: "Wallbox, PV und Speicher, die zusammenarbeiten.",
    text: "Wir planen Überschussladen mit passender Wallbox, Zähler und Energiemanagement – und melden alles beim Netzbetreiber an.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Ladekosten berechnen", href: "/rechner/wallbox" },
  },
};

export default artikel;
