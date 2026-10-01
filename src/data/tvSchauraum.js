// src/data/tvSchauraum.js
//
// Feste Werbefolien für den Info-Bildschirm /tv im Schauraum (55-Zoll-TV, Querformat).
// Sie laufen automatisch zwischen den Meldungen aus dem Backoffice und der Markenfolie durch;
// ausblenden mit /tv?schauraum=0, einzelne Folie ansehen mit /tv?folie=N.
//
// GESTALTUNG: Jede Folie hat links Text und rechts eine eigens für den Bildschirm gezeichnete
// Grafik (Karte, Diagramm, Schema) – bewusst KEINE Fotos und keine Bausteine der Website.
// Die Grafiken stehen in src/components/Kanaele/TvSchauraum.js, `grafik` wählt sie aus.
//
// GRUNDSATZ wie auf der Website: nur belegte Aussagen, keine neuen Zahlen. Alle Werte kommen aus
// den bestehenden Datenquellen (kennzahlen.js, hero.js, unternehmen.js, mannschaft.js,
// zielgruppen.js) und ändern sich dort mit. Schemata ohne Messwerte sind als solche beschriftet.
// Förderhöhen und Preise stehen bewusst NICHT auf den Folien – sie veralten unbemerkt.
//
// `titel`: ein ganzer Satz, auf Abstand lesbar (max. rund 55 Zeichen).
// `dauer`: Anzeigedauer in Sekunden. `qr`: Pfad auf oekovolt.com (QR-Code wird serverseitig erzeugt).

import { FIRMA } from "@/lib/site";
import { KENNZAHLEN, KENNZAHLEN_HINWEIS, KENNZAHLEN_STAND, zahlText } from "@/data/kennzahlen";
import { REFERENZ_UNTERNEHMEN } from "@/data/hero";
import { CLAIM, HALTUNG } from "@/data/unternehmen";
import { STATIONEN } from "@/data/mannschaft";

const standDatum = KENNZAHLEN_STAND.split("-").reverse().join(".");
const branchen = [...new Set(REFERENZ_UNTERNEHMEN.map((r) => r.branche))];

export const SCHAURAUM_FOLIEN = [
  {
    // Markenmoment zum Start der Schleife, ganze Bühne ohne Textspalte (`vollbild`).
    id: "schauraum-intro",
    grafik: "intro",
    vollbild: true,
    dauer: 11,
    kategorie: "Ökovolt Österreich",
    titel: CLAIM.replace(/^ÖKOVOLT\.\s*/, ""),
    text: "Photovoltaik aus Ostermiething für ganz Österreich. Seit 2012.",
  },
  {
    id: "schauraum-zahlen",
    grafik: "karte",
    dauer: 15,
    kategorie: "Ökovolt Österreich, seit 2012",
    titel: "Photovoltaik aus Ostermiething für ganz Österreich.",
    zahlen: [
      ...KENNZAHLEN.map((k) => ({ wert: zahlText(k.zahl), einheit: k.suffix.trim(), label: k.label })),
      { wert: "TOP 3", label: "der EPC-Errichter Österreichs 2021" },
    ],
    fussnote: `${KENNZAHLEN_HINWEIS}, Stand ${standDatum}`,
  },
  {
    id: "schauraum-haltung",
    grafik: "betrieb",
    dauer: 15,
    kategorie: HALTUNG.kopf,
    titel: "Wir bauen, was wir selbst betreiben würden.",
    text: "Die Gründer betreiben seit 2012 eigene Solarparks. Wer selbst Betreiber ist, plant anders.",
    punkte: ["Gesellschafterin: Salzburg AG (49 %)"],
    qr: "/uber-uns",
  },
  {
    id: "schauraum-stationen",
    grafik: "ring",
    dauer: 16,
    kategorie: "Planung, Bau und Betrieb",
    titel: "Vom ersten Plan bis zum Betrieb aus einer Hand.",
    text: "Sie erklären Ihr Projekt einmal. Planung, Bau und Inbetriebnahme liegen bei uns.",
    stationen: STATIONEN.map(({ id, titel, eigen, icon }) => ({ id, titel, eigen, icon })),
  },
  {
    id: "schauraum-referenzen",
    grafik: "branchen",
    dauer: 15,
    kategorie: "Referenzen",
    titel: "Diese Unternehmen setzen auf Solarstrom von Ökovolt.",
    text: `${REFERENZ_UNTERNEHMEN.length} Betriebe aus ${branchen.slice(0, -1).join(", ")} und ${branchen.at(-1)}.`,
    namen: REFERENZ_UNTERNEHMEN.map((r) => ({ name: r.name, branche: r.branche })),
    qr: "/referenzen",
  },
  {
    // Live-Werte (Börsenpreis, Tagesverlauf, Erzeugung) kommen im Browser aus /api/energie/live,
    // wie auf /energie-live – hier stehen nur die festen Texte.
    id: "schauraum-strom",
    grafik: "strom",
    dauer: 18,
    kategorie: "Strommarkt Österreich, live",
    titel: "Was Strom an der Börse gerade kostet.",
    qr: "/energie-live",
  },
  {
    id: "schauraum-gewerbe",
    grafik: "lastgang",
    dauer: 16,
    kategorie: "Gewerbe und Industrie",
    titel: "Solarstrom, der zum Lastgang Ihres Betriebs passt.",
    text: "Wir legen Anlagen nach Ihren Viertelstundenwerten aus, nicht nach der Dachfläche.",
    punkte: ["Photovoltaik auf Hallen- und Bürodächern", "Gewerbespeicher gegen Lastspitzen"],
    qr: "/gewerbe",
  },
  {
    id: "schauraum-landwirtschaft",
    grafik: "agri",
    dauer: 15,
    kategorie: "Landwirtschaft und Agri-PV",
    titel: "Strom und Ertrag auf derselben Fläche.",
    text: "Wir planen Anlagen, die zum Betrieb passen, steuerlich sauber abgestimmt und mit Blick auf die Förderung.",
    punkte: ["Stall-, Scheunen- und Hallendächer", "Speicher für Melk- und Kühltechnik"],
    qr: "/landwirtschaft",
  },
  {
    id: "schauraum-gemeinden",
    grafik: "netzwerk",
    dauer: 15,
    kategorie: "Gemeinden und Energiegemeinschaften",
    titel: "Strom vom Gemeindedach, gemeinsam genutzt.",
    text: "Photovoltaik auf öffentlichen Gebäuden. Überschüsse bleiben in der Energiegemeinschaft vor Ort.",
    qr: "/energiegemeinschaften",
  },
  {
    id: "schauraum-technik",
    grafik: "regelung",
    dauer: 16,
    kategorie: "Eigene Technik",
    titel: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung.",
    text: "Unser EZA-Regler setzt die Vorgaben des Netzbetreibers am Netzanschlusspunkt um. Entwickelt mit unserem Partner Solensa.",
    qr: "/technik",
  },
  {
    id: "schauraum-service",
    grafik: "thermo",
    dauer: 15,
    kategorie: "Service und Wartung",
    titel: "Damit Ihre Anlage dauerhaft Ertrag bringt.",
    text: "Wartung, Prüfung und Betreuung aus einer Hand, mit einem festen Ansprechpartner.",
    punkte: ["Wartungsverträge und Anlagenprüfung", "Drohnen-Thermografie", "Reinigung und Repowering"],
    qr: "/service/wartung",
  },
  {
    id: "schauraum-beratung",
    grafik: "kontakt",
    dauer: 15,
    kategorie: "Ihr Projekt",
    titel: "Lassen Sie uns über Ihr Dach sprechen.",
    text: "Unverbindliches Angebot anfragen. Wir melden uns mit einem festen Ansprechpartner für Ihr Projekt.",
    kontakt: [FIRMA.telefon, FIRMA.email, `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}`],
    qr: "/angebot",
  },
];
