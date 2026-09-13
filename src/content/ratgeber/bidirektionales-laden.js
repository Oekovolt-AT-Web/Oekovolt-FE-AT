// Ratgeber: Bidirektionales Laden (V2H/V2G) – Stand September 2026
// Strompreis und Vergütung aus @/data/solarrechner und @/data/einspeiseverguetung,
// Förderprogramm und § 14a-Werte aus @/data/wallbox.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WALLBOX } from "@/data/wallbox";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const komma = (n, s = 1) => n.toFixed(s).replace(".", ",");

const STROM = ANNAHMEN.strompreis * 100;
const EINSP = VERGUETUNG.saetze[0].teileinspeisung;

// Modellrechnung V2H: Solarstrom tagsüber ins Auto, abends ins Haus
const KWH_ABEND = 5; // kWh je Abend/Nacht aus dem Auto
const TAGE = 200; // Tage im Jahr mit Auto zu Hause und ausreichend Solarüberschuss
const RUNDLAUF = 0.85; // Wirkungsgrad Laden + Entladen
const V2H_KWH = KWH_ABEND * TAGE;
const V2H_VORTEIL = (V2H_KWH * STROM - (V2H_KWH / RUNDLAUF) * EINSP) / 100;

// Nutzbarer Akkuinhalt im schonenden Fenster
const AKKU = 77;
const FENSTER = AKKU * 0.6; // 20–80 %

const BIDI_FOERDERUNG = WALLBOX.mfhProgramm.saetze.find((s) => /bidirektional/i.test(s.was));

const artikel = {
  slug: "bidirektionales-laden",
  title: "Bidirektionales Laden 2026: Was V2H und V2G heute können",
  seoTitle: "Bidirektionales Laden 2026: V2H, V2G & Recht | Ökovolt",
  kurzTitel: "Bidirektionales Laden",
  description:
    "Bidirektionales Laden 2026: Was V2H und V2G in Deutschland heute können, welche Autos und Wallboxen es gibt, was rechtlich gilt und für wen es sich lohnt.",
  excerpt:
    "Das E-Auto als Hausspeicher: Welche Fahrzeuge und Wallboxen 2026 wirklich bidirektional laden, was die neuen Regeln zu Netzentgelten und MiSpeL bedeuten und wie viel sich damit sparen lässt.",
  hauptKeyword: "bidirektionales laden",
  keywords: [
    "Bidirektionales Laden",
    "Vehicle-to-Home",
    "Vehicle-to-Grid Deutschland",
    "V2H Wallbox",
    "Bidirektionales Laden Autos 2026",
    "E-Auto als Stromspeicher",
    "Bidirektionales Laden PV-Anlage",
    "MiSpeL bidirektionales Laden",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Wärmepumpe & E-Mobilität",
  bild: "/Images/Ratgeber/bidirektionales-laden.jpg",
  bildAlt: "Einfamilienhaus mit Photovoltaikanlage und Sigenergy-Energiespeicher am Abend, davor ein Elektroauto",
  badge: { wert: `${Math.round(FENSTER)} kWh`, text: `nutzbar aus einem ${AKKU}-kWh-Akku im Fenster 20–80 % – ein Vielfaches eines Hausspeichers` },

  kurzFazit: [
    "**Bidirektionales Laden heißt: Das E-Auto kann Strom nicht nur laden, sondern auch wieder abgeben – an Geräte (V2L), ans eigene Haus (V2H) oder ins Stromnetz (V2G).**",
    "**Stand September 2026 ist V2H in Deutschland mit ausgewählten Fahrzeugen nutzbar**, etwa mit VW-Konzernmodellen und passender DC-Wallbox. Das erste kommerzielle V2G-Angebot für Privatkunden starteten BMW und E.ON im Februar 2026.",
    "Rechtlich wurde 2025 die doppelte Belastung mit Netzentgelten für zurückgespeisten Strom beseitigt. Die Bundesnetzagentur will die Detailregeln für den gemischten Betrieb (MiSpeL) am 1. Oktober 2026 festlegen.",
    `Mit PV-Anlage kann ein Auto abends Solarstrom ins Haus zurückgeben. In unserer Modellrechnung spart das rund **${eur10(V2H_VORTEIL)} im Jahr** – bei derzeit noch deutlich teureren Wallboxen.`,
    "Für die meisten Haushalte gilt 2026: Beim Kauf von Auto und Wallbox auf Bidi-Fähigkeit achten, aber nicht allein deswegen investieren.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist bidirektionales Laden?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Beim bidirektionalen Laden fließt Strom in beide Richtungen: vom Netz oder der PV-Anlage ins Auto und bei Bedarf wieder aus dem Auto heraus.** Damit wird die Fahrzeugbatterie zum großen, mobilen Stromspeicher. Ein typischer E-Auto-Akku fasst 60 bis 80 kWh und damit ein Vielfaches eines Hausspeichers mit 8 bis 10 kWh.",
        },
        {
          typ: "tabelle",
          caption: "Die drei Formen des bidirektionalen Ladens",
          kopf: ["Abkürzung", "Bedeutung", "Wohin fließt der Strom?", "Stand in Deutschland 2026"],
          zeilen: [
            ["V2L", "Vehicle-to-Load", "Über eine Steckdose am Auto an einzelne Geräte", "Bei vielen Modellen serienmäßig"],
            ["V2H", "Vehicle-to-Home", "Ins eigene Hausnetz, gesteuert vom Energiemanagement", "Mit ausgewählten Autos und passender Wallbox nutzbar"],
            ["V2G", "Vehicle-to-Grid", "Ins öffentliche Netz, vermarktet über einen Stromanbieter", "Erste Angebote seit 2026, Regeln werden 2026/2027 konkretisiert"],
          ],
          hervorheben: 3,
          markierteZeile: 1,
          minBreite: 640,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "V2L ist kein V2H",
          text: "Eine Schuko-Steckdose im Kofferraum kann einen Wasserkocher oder eine Kühlbox versorgen, aber nicht das Hausnetz. Für V2H braucht es eine Ladestation, die mit dem Auto kommuniziert, die Netzanschlussregeln erfüllt und vom Energiemanagement gesteuert wird. Erklärt auch im [Lexikon: Bidirektionales Laden](/wissen/lexikon#bidirektionales-laden).",
        },
      ],
    },
    {
      id: "stand-2026",
      titel: "Welche Autos und Wallboxen können 2026 bidirektional laden?",
      tocLabel: "Autos & Wallboxen 2026",
      bloecke: [
        {
          typ: "p",
          text: "**Funktionierendes V2H und V2G gibt es 2026 nur als abgestimmtes Paket aus Fahrzeug, Softwarestand, Wallbox und teils Stromtarif.** Viele Autos sind technisch vorbereitet, aber noch nicht vom Hersteller freigegeben. Die Übersicht zeigt belegte Beispiele, keine vollständige Liste:",
        },
        {
          typ: "tabelle",
          caption: "Beispiele für bidirektionale Lösungen in Deutschland, Stand September 2026",
          kopf: ["Hersteller / Angebot", "Art", "Voraussetzungen laut Anbieter", "Status"],
          zeilen: [
            ["VW ID.-Modelle, Cupra Born/Tavascan, Škoda Enyaq/Elroq", "V2H (DC)", "Akku ab 77 kWh bzw. 85 kWh, Software ab 3.5, DC-Wallbox und Hausspeicher von E3/DC", "Nutzbar"],
            ["Ford Explorer, Capri", "V2H (DC)", "Kompatible DC-Wallbox", "Laut ADAC seit 2025 nutzbar"],
            ["BMW iX3 (Neue Klasse) mit E.ON", "V2G (AC)", "BMW Wallbox Professional (11 kW), Tarif mit V2G-Vertrag, Smart Meter; mit PV derzeit nur bei Volleinspeisung", "Seit Februar 2026 bestellbar"],
            ["Mercedes-Benz MB.CHARGE Home", "V2G / V2H", "Elektrischer GLC als erstes Modell, Wallbox und Tarif über Partner", "Start 2026, schrittweise"],
            ["Renault 5 mit Mobilize", "V2G (AC)", "Bidirektionale AC-Ladestation und Energievertrag", "In Frankreich gestartet, Deutschland angekündigt"],
          ],
          minBreite: 720,
          fussnote: "Quellen: ADAC, Herstellerangaben (BMW Group, Mercedes-Benz, Volkswagen). Freigaben hängen von Modelljahr und Softwarestand ab – vor dem Kauf beim Hersteller prüfen.",
        },
        { typ: "h3", text: "AC oder DC: Wo sitzt der Wechselrichter?" },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "DC-bidirektional", text: "Der Wechselrichter steckt in der Wallbox. Das Auto gibt Gleichstrom ab – wie beim Schnellladen. Vorteil: funktioniert mit vielen Fahrzeugen, sobald der Hersteller es freigibt. Nachteil: teure Ladestation. Einige Systeme koppeln das Auto direkt an den DC-Bus von PV und Speicher." },
            { titel: "AC-bidirektional", text: "Der Wechselrichter sitzt im Auto (Bordlader). Die Wallbox ist einfacher und günstiger, das Fahrzeug muss aber als Erzeugungsanlage die Netzanschlussregeln ([VDE-AR-N 4105](/wissen/lexikon#vde-ar-n-4105)) erfüllen. Die Kommunikation läuft über ISO 15118-20." },
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Systemlösungen mit Speicher",
          text: "Einige Heimspeicher-Systeme bieten ein bidirektionales DC-Lademodul als Erweiterung an – etwa Sigenergy mit bis zu 25 kW Lade- und Entladeleistung (laut Hersteller V2H- und V2G-fähig, Nutzung abhängig von der Freigabe des Fahrzeugherstellers). Ökovolt ist Partner von Sigenergy, Fronius, Huawei, Solis und meteocontrol und berät dabei herstellerneutral: Entscheidend ist, ob Ihr Auto die jeweilige Ladestation offiziell unterstützt.",
        },
      ],
    },
    {
      id: "recht",
      titel: "Rechtslage 2026: Netzentgelte, MiSpeL und § 14a",
      tocLabel: "Rechtslage",
      bloecke: [
        {
          typ: "p",
          text: "**Die größten rechtlichen Hürden wurden 2025 und 2026 abgebaut: Zurückgespeister Strom aus dem Auto wird inzwischen wie Speicherstrom behandelt, und die Bundesnetzagentur regelt, wie Solar- und Netzstrom im gemischten Betrieb abgegrenzt werden.**",
        },
        {
          typ: "tabelle",
          caption: "Rechtliche Eckpunkte für bidirektionales Laden, Stand September 2026",
          kopf: ["Thema", "Was gilt", "Bedeutung für Sie"],
          zeilen: [
            ["Netzentgelte (§ 118 Abs. 6 EnWG)", "Seit der EnWG-Novelle (Bundestag 13.11.2025, Bundesrat 21.11.2025) sind bidirektional genutzte Ladepunkte in die Netzentgeltbefreiung für Speicher einbezogen", "Keine doppelten Netzentgelte mehr für Strom, der aus dem Netz geladen und wieder eingespeist wird"],
            ["MiSpeL (Bundesnetzagentur)", "Festlegung zur Marktintegration von Speichern und Ladepunkten; Veröffentlichung für den 1. Oktober 2026 geplant, mit Abgrenzungs- und Pauschaloption (PV bis 30 kWp)", "Regelt, welcher eingespeiste Strom als Solarstrom vergütet wird und welcher als zwischengespeicherter Netzstrom gilt"],
            ["Messung", "V2G-Angebote setzen ein [intelligentes Messsystem](/wissen/lexikon#smart-meter-gateway) voraus", "Smart Meter frühzeitig beim Messstellenbetreiber anfragen"],
            ["§ 14a EnWG", "Ladepunkte über 4,2 kW sind steuerbare Verbrauchseinrichtungen", `Netzentgelt-Rabatt (pauschal rund ${WALLBOX.paragraf14a.ersparnisVon}–${WALLBOX.paragraf14a.ersparnisBis} € pro Jahr), dafür Dimmung des Netzbezugs im Ausnahmefall`],
            ["Netzanschluss", "Rückspeisende Ladepunkte gelten als Erzeugungsanlage", "Anmeldung beim Netzbetreiber, Nachweise nach VDE-AR-N 4105; je nach Betriebsweise Registrierung im Marktstammdatenregister"],
          ],
          minBreite: 720,
          fussnote: "Keine Rechtsberatung. Details der MiSpeL-Festlegung und die Umsetzung durch Netzbetreiber können sich bis zur Veröffentlichung noch ändern.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "V2H ohne Einspeisung ist am einfachsten",
          text: "Solange das Auto nur das eigene Haus versorgt und kein Strom ins Netz fließt, stellen sich viele Abgrenzungsfragen nicht. Für V2G mit PV-Anlage ist dagegen entscheidend, wie Solarstrom und zwischengespeicherter Netzstrom gemessen werden – genau das regelt MiSpeL. Zusammenhänge mit dem [§ 14a EnWG](/ratgeber/paragraf-14a-enwg) und dem [Smart-Meter-Rollout](/ratgeber/smart-meter-pflicht) lesen Sie in unseren Ratgebern.",
        },
      ],
    },
    {
      id: "nutzen",
      titel: "Was bringt bidirektionales Laden mit PV-Anlage?",
      tocLabel: "Nutzen & Rechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Mit V2H lädt das Auto tagsüber Solarüberschuss und gibt ihn abends und nachts an das Haus ab – der Effekt entspricht einem sehr großen Stromspeicher, allerdings nur, wenn das Auto zu Hause steht.** Aus einem ${AKKU}-kWh-Akku lassen sich im schonenden Bereich zwischen 20 und 80 % rund ${Math.round(FENSTER)} kWh nutzen. Ein Einfamilienhaus braucht abends und nachts meist nur 4 bis 8 kWh.`,
        },
        {
          typ: "tabelle",
          caption: "Modellrechnung V2H mit PV-Anlage (ohne Kosten der Ladestation)",
          kopf: ["Annahme / Ergebnis", "Wert"],
          zeilen: [
            ["Strom aus dem Auto ins Haus pro Abend", `${KWH_ABEND} kWh`],
            ["Tage mit Auto zu Hause und genug Solarüberschuss", `${TAGE}`],
            ["Ins Haus abgegebener Solarstrom pro Jahr", `${V2H_KWH.toLocaleString("de-DE")} kWh`],
            ["Wirkungsgrad Laden und Entladen", `${Math.round(RUNDLAUF * 100)} %`],
            ["Ersparter Netzstrom", `${eur10((V2H_KWH * STROM) / 100)} (${komma(STROM)} ct/kWh)`],
            ["Entgangene Einspeisevergütung", `${eur10(((V2H_KWH / RUNDLAUF) * EINSP) / 100)} (${ct(EINSP)} ct/kWh)`],
            ["**Vorteil pro Jahr**", `**${eur10(V2H_VORTEIL)}**`],
          ],
          hervorheben: 1,
          minBreite: 460,
          fussnote: "Vereinfachte Modellrechnung; ohne zusätzlichen Batterieverschleiß, ohne Erlöse aus V2G oder dynamischen Tarifen. Hat das Haus bereits einen Stromspeicher, fällt der zusätzliche Nutzen kleiner aus.",
        },
        {
          typ: "p",
          text: "Beim V2G-Angebot von BMW und E.ON zahlt der Anbieter für die Bereitschaft einen Bonus von bis zu 720 € im Jahr (0,24 € je angeschlossener Stunde, maximal 60 € pro Monat) und vergütet tatsächlich zurückgespeiste Kilowattstunden mit 40 ct. Solche Angebote setzen voraus, dass der Anbieter über Lade- und Entladezeiten mitentscheidet.",
        },
        {
          typ: "p",
          text: `Wer die Speicherfrage zuerst klären möchte: Ein stationärer Speicher arbeitet jeden Tag, auch wenn das Auto unterwegs ist. Welche Größe sich rechnet, zeigt der Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten). Für V2G sind zudem [dynamische Stromtarife](/wissen/lexikon#dynamischer-stromtarif) ein wichtiger Baustein.`,
        },
        { typ: "tool", href: "/rechner/stromspeicher", titel: "Brauchen Sie überhaupt einen zusätzlichen Speicher?", text: "Autarkie und Wirtschaftlichkeit verschiedener Speichergrößen – mit E-Auto und Wärmepumpe.", label: "Zum Stromspeicher-Rechner" },
      ],
    },
    {
      id: "akku",
      titel: "Schadet bidirektionales Laden dem Akku?",
      tocLabel: "Akku & Garantie",
      bloecke: [
        {
          typ: "p",
          text: "**Zusätzliche Zyklen belasten den Akku, im moderaten Ladefenster und mit geringer Leistung ist der Effekt nach Herstellerangaben aber begrenzt.** Wichtiger als die Chemie ist die Frage, was die Garantie abdeckt.",
        },
        {
          typ: "liste",
          punkte: [
            "**Volkswagen:** Für V2H mit ID.-Modellen werden rund 4.000 Betriebsstunden bzw. 10.000 kWh Rückspeisung genannt, ohne dass Ansprüche aus der Batteriegarantie berührt werden.",
            "**Ladefenster:** Viele Systeme nutzen nur den Bereich zwischen etwa 20 und 80 % – das schont die Zellen und lässt Reichweite für spontane Fahrten.",
            "**Mindestladestand einstellen:** Legen Sie fest, wie weit das Haus den Akku entladen darf, damit das Auto morgens fahrbereit ist.",
            "**Garantiebedingungen schriftlich prüfen:** Hersteller regeln Grenzen unterschiedlich. Ohne Freigabe kann eine Rückspeisung Garantieansprüche gefährden.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Notstrom über das Auto?",
          text: "V2H kann bei einem Stromausfall das Haus versorgen – aber nur, wenn Wallbox und Hausinstallation dafür ausgelegt sind (Netztrennung, Ersatzstromumschaltung). Das ist nicht automatisch der Fall. Unterschiede zwischen Notstrom und Ersatzstrom erklärt der Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik).",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet eine bidirektionale Wallbox?",
      tocLabel: "Kosten & Förderung",
      bloecke: [
        {
          typ: "p",
          text: `**Bidirektionale Ladestationen sind 2026 deutlich teurer als normale Wallboxen – der ADAC nennt etwa das Drei- bis Vierfache.** Eine konventionelle 11-kW-Wallbox kostet mit Installation typischerweise ${WALLBOX.gesamtVon.toLocaleString("de-DE")} bis ${WALLBOX.gesamtBis.toLocaleString("de-DE")} €. DC-Lösungen mit integriertem Wechselrichter liegen darüber, AC-Systeme mit Wechselrichter im Fahrzeug darunter. Manche Anbieter rabattieren die Wallbox im Paket mit einem V2G-Tarif.`,
        },
        {
          typ: "p",
          text: BIDI_FOERDERUNG
            ? `Im Bundesprogramm „Laden im Mehrparteienhaus“ werden Ladepunkte mit bidirektionaler Funktion mit bis zu ${BIDI_FOERDERUNG.bis.toLocaleString("de-DE")} € gefördert (Antragszeitraum ${WALLBOX.mfhProgramm.von} bis ${WALLBOX.mfhProgramm.bis}). Für Einfamilienhäuser gibt es 2026 kein bundesweites Wallbox-Programm; Landes- und Kommunalförderungen prüft der [Förder-Check](/foerdercheck).`
            : "Für Einfamilienhäuser gibt es 2026 kein bundesweites Wallbox-Programm; Landes- und Kommunalförderungen prüft der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "empfehlung",
      titel: "Lohnt sich bidirektionales Laden schon? Unsere Einschätzung",
      tocLabel: "Einschätzung & Checkliste",
      bloecke: [
        {
          typ: "p",
          text: "**Für Pioniere mit passendem Auto kann V2H 2026 bereits sinnvoll sein, für die meisten Haushalte ist es eine Option für die nächste Anschaffung.** Die Technik funktioniert, die Rechtslage wird klarer, das Angebot an freigegebenen Fahrzeugen und Wallboxen wächst. Wer jetzt eine PV-Anlage oder Wallbox plant, sollte die Tür offenhalten:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Beim Autokauf** nach offizieller V2H-/V2G-Freigabe für Deutschland fragen – nicht nur nach „vorbereitet“.",
            "**Leitungen und Zählerschrank** so planen, dass eine spätere bidirektionale Ladestation ohne großen Umbau möglich ist.",
            "**Energiemanagement** wählen, das Wallbox, Speicher und PV herstellerübergreifend steuern kann (z. B. über EEBus oder ISO 15118).",
            "**Smart Meter** beantragen – ohne intelligentes Messsystem sind V2G und dynamische Tarife nicht möglich.",
            "**Garantie und Tarifbedingungen** schriftlich prüfen, bevor das Auto ins Netz zurückspeist.",
            "**Wirtschaftlich rechnen:** Mehrkosten der Ladestation mit dem realistischen jährlichen Vorteil vergleichen.",
          ],
        },
        {
          typ: "p",
          text: "Solange V2H nicht infrage kommt, ist [PV-Überschussladen](/ratgeber/pv-ueberschussladen) der einfachste Weg, Solarstrom ins Auto zu bringen – mit jeder regelbaren [Wallbox](/produkte/wallbox).",
        },
      ],
    },
  ],

  faq: [
    { q: "Welche Autos können 2026 bidirektional laden?", a: "V2H ist in Deutschland unter anderem mit VW-Konzernmodellen (ID.-Familie, Cupra, Škoda mit großem Akku und aktueller Software) und Ford Explorer/Capri nutzbar. BMW bietet mit dem iX3 seit Februar 2026 V2G an, Mercedes startet 2026 mit dem elektrischen GLC. Viele weitere Modelle sind vorbereitet, aber noch nicht freigegeben." },
    { q: "Was ist der Unterschied zwischen V2H und V2G?", a: "Bei V2H (Vehicle-to-Home) versorgt das Auto nur das eigene Haus. Bei V2G (Vehicle-to-Grid) speist es Strom ins öffentliche Netz ein, meist gesteuert von einem Stromanbieter, der dafür vergütet." },
    { q: "Ist bidirektionales Laden in Deutschland erlaubt?", a: "Ja. Seit der EnWG-Novelle Ende 2025 wird zurückgespeister Strom aus dem Auto bei den Netzentgelten wie Speicherstrom behandelt. Die Bundesnetzagentur konkretisiert mit der MiSpeL-Festlegung (geplant ab 1. Oktober 2026) die Abgrenzung im gemischten Betrieb mit PV-Anlagen." },
    { q: "Brauche ich für bidirektionales Laden eine spezielle Wallbox?", a: "Ja. Nötig ist eine bidirektionale Ladestation, die vom Autohersteller für das Modell freigegeben ist – entweder eine DC-Wallbox mit eigenem Wechselrichter oder eine AC-Wallbox für Fahrzeuge mit bidirektionalem Bordlader." },
    { q: "Kann ich mein Haus bei Stromausfall mit dem E-Auto versorgen?", a: "Nur, wenn die Ladestation und die Hausinstallation ersatzstromfähig ausgelegt sind. Eine normale V2H-Installation schaltet bei Netzausfall aus Sicherheitsgründen ab." },
    { q: "Lohnt sich bidirektionales Laden mit einer PV-Anlage?", a: `In unserer Modellrechnung spart V2H mit PV rund ${eur10(V2H_VORTEIL)} pro Jahr. Ob sich das rechnet, hängt vor allem vom Aufpreis der Ladestation, der Standzeit des Autos zu Hause und davon ab, ob bereits ein Hausspeicher vorhanden ist.` },
    { q: "Verliere ich durch V2H die Batteriegarantie?", a: "Nicht zwingend. Für VW-Modelle werden etwa rund 4.000 Stunden oder 10.000 kWh Rückspeisung ohne Einfluss auf die Garantie genannt. Die Regeln unterscheiden sich je Hersteller und sollten vorab geprüft werden." },
  ],

  passend: [
    { href: "/ratgeber/pv-ueberschussladen", titel: "PV-Überschussladen", text: "E-Auto mit Solarstrom laden – heute mit jeder regelbaren Wallbox." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox-Installation", text: "Kosten, Anmeldung und Förderung." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "PV, Speicher, Auto und Wärmepumpe steuern." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Speicherlösungen, die täglich arbeiten." },
  ],

  quellen: [
    { titel: "ADAC – Bidirektionales Laden: E-Auto wird zum Stromspeicher", url: "https://www.adac.de/rund-ums-fahrzeug/elektromobilitaet/laden/bidirektionales-laden/", stand: "07/2025" },
    { titel: "BMW Group – Erstes V2G-Ladeangebot Deutschlands mit E.ON", url: "https://www.press.bmwgroup.com/deutschland/article/detail/T0455460DE/erstes-bidirektionales-vehicle-to-grid-v2g-ladeangebot-deutschlands-von-bmw-group-und-e-on:-wallbox-und-stromtarif-ab-sofort-bestellbar?language=de", stand: "02/2026" },
    { titel: "Bundesnetzagentur – Festlegung zur Marktintegration von Speichern und Ladepunkten (MiSpeL)", url: "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Aufsicht/MiSpeL/artikel.html", stand: "09/2026" },
    { titel: "§ 118 EnWG – Übergangsregelungen (Netzentgeltbefreiung für Speicher)", url: "https://www.gesetze-im-internet.de/enwg_2005/__118.html", stand: "09/2026" },
    { titel: "Volkswagen – Bidirektionales Laden mit dem ID.", url: "https://www.volkswagen.de/de/elektromobilitaet/laden/laden-zuhause/bidirektionales-laden.html", stand: "09/2026" },
    { titel: "Mercedes-Benz – MB.CHARGE Home", url: "https://home-intelligent.mercedes-benz.com/", stand: "09/2026" },
    { titel: "Sigenergy – Bidirektionales DC-Lademodul", url: "https://www.sigenergy.com/de/products/dc-charger", stand: "09/2026" },
    { titel: "electrive – AgNes und MiSpeL: Neue Regeln für bidirektionales Laden", url: "https://www.electrive.net/2026/08/06/agnes-und-mispel-neue-regeln-fuer-ladeparks-und-bidirektionales-laden/", stand: "08/2026" },
  ],

  seitenCta: { titel: "Speicher oder Auto als Speicher?", text: "Autarkie und Wirtschaftlichkeit mit Ihren Werten.", href: "/rechner/stromspeicher", label: "Zum Speicher-Rechner" },
  cta: {
    title: "Heute planen, morgen bidirektional laden.",
    text: "Wir legen PV-Anlage, Wallbox, Zählerschrank und Energiemanagement so aus, dass Überschussladen sofort funktioniert und V2H später möglich bleibt.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Wallbox-Lösungen ansehen", href: "/produkte/wallbox" },
  },
};

export default artikel;
