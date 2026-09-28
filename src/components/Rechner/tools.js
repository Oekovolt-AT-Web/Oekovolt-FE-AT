import { Activity, BatteryCharging, CarFront, FileCheck2, Gift, Mountain, Sun, Thermometer, Zap } from "lucide-react";

/** Alle Rechner & Tools – eine Quelle für Hub, Querverweise und Schema. */
export const TOOLS = [
  {
    id: "solarrechner",
    href: "/solarrechner",
    titel: "Solarrechner",
    kurz: "Ertrag & Amortisation für Betrieb, Hof und Haus",
    text: "Für Gewerbe, Landwirtschaft und Privat: Anlagengröße, Verbrauch, Betriebszeiten und Dach eingeben – Eigenverbrauch, Ersparnis und Amortisation in Sekunden.",
    icon: Sun,
    tag: "Beliebt",
  },
  {
    id: "standort-check",
    href: "/standort-check",
    titel: "Standort-Check",
    kurz: "Schneelast, Wind, Hagel & Ertrag für Ihre Adresse",
    text: "Schneelast, Wind, Hagel & Ertrag für Ihre Adresse – mit eHORA und PVGIS.",
    icon: Mountain,
    tag: "Neu",
  },
  {
    id: "stromspeicher",
    href: "/rechner/stromspeicher",
    titel: "Stromspeicher-Rechner",
    kurz: "Autarkie & wirtschaftliche Speichergröße",
    text: "Stündliche Jahressimulation: Wie viel Autarkie bringt welcher Speicher – und ab wann rechnet er sich?",
    icon: BatteryCharging,
  },
  {
    id: "waermepumpe",
    href: "/rechner/waermepumpe",
    titel: "Wärmepumpen-Rechner",
    kurz: "Heizkosten Gas/Öl vs. Wärmepumpe mit PV",
    text: "Vergleich der jährlichen Heizkosten und CO₂ gegenüber Gas und Heizöl – inklusive Solarstrom-Anteil je Monat.",
    icon: Thermometer,
  },
  {
    id: "wallbox",
    href: "/rechner/wallbox",
    titel: "E-Auto-Laderechner",
    kurz: "Tanken vs. Laden mit Netz- und Solarstrom",
    text: "Was kostet Ihr Kilometer mit Benzin, Diesel, Netzstrom oder Sonne vom eigenen Dach?",
    icon: CarFront,
  },
  {
    id: "dynamisch",
    href: "/rechner/dynamischer-stromtarif",
    titel: "Dynamischer-Tarif-Rechner",
    kurz: "Mit Börsenpreisen der Gebotszone Österreich",
    text: "Festpreis oder Spotpreis-Tarif? Mit echten Day-Ahead-Preisen für Österreich und den günstigsten Ladefenstern.",
    icon: Zap,
    tag: "Live",
  },
  {
    id: "foerdercheck",
    href: "/foerdercheck",
    titel: "Förder-Check",
    kurz: "Zuschüsse & Steuervorteile in Österreich",
    text: "Welche Bundes- und Landesförderungen und welche steuerlichen Vorteile passen zu Ihrem Vorhaben?",
    icon: Gift,
  },
  {
    id: "angebot",
    href: "/angebot",
    titel: "Angebots-Konfigurator",
    kurz: "In 2 Minuten zum persönlichen Angebot",
    text: "Dach, Verbrauch und Wünsche angeben – wir melden uns mit einem konkreten Angebot.",
    icon: FileCheck2,
  },
  {
    id: "energie-live",
    href: "/energie-live",
    titel: "Energie live",
    kurz: "Strompreis & Solarstrom in Echtzeit",
    text: "Börsenstrompreis, Solar- und Windeinspeisung – live aktualisiert.",
    icon: Activity,
    tag: "Live",
  },
];

export const toolById = (id) => TOOLS.find((t) => t.id === id);
