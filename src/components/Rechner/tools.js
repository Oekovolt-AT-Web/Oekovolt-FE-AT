import { Activity, BatteryCharging, CarFront, FileCheck2, Gift, Sun, Thermometer, Zap } from "lucide-react";

/** Alle Rechner & Tools – eine Quelle für Hub, Querverweise und Schema. */
export const TOOLS = [
  {
    id: "solarrechner",
    href: "/solarrechner",
    titel: "Solarrechner",
    kurz: "Ertrag, Ersparnis & Amortisation Ihrer PV-Anlage",
    text: "Anlagengröße, Dach und Verbrauch eingeben – Jahresertrag, Autarkie und Amortisation in Sekunden.",
    icon: Sun,
    tag: "Beliebt",
  },
  {
    id: "stromspeicher",
    href: "/rechner/stromspeicher",
    titel: "Stromspeicher-Rechner",
    kurz: "Autarkie & wirtschaftliche Speichergröße",
    text: "Stündliche Jahressimulation: Wie viel Autarkie bringt welcher Speicher – und ab wann rechnet er sich?",
    icon: BatteryCharging,
    tag: "Neu",
  },
  {
    id: "waermepumpe",
    href: "/rechner/waermepumpe",
    titel: "Wärmepumpen-Rechner",
    kurz: "Heizkosten Gas/Öl vs. Wärmepumpe mit PV",
    text: "Vergleich der jährlichen Heizkosten und CO₂ – inklusive Solarstrom-Anteil und BEG-Förderung.",
    icon: Thermometer,
    tag: "Neu",
  },
  {
    id: "wallbox",
    href: "/rechner/wallbox",
    titel: "E-Auto-Laderechner",
    kurz: "Tanken vs. Laden mit Netz- und Solarstrom",
    text: "Was kostet Ihr Kilometer mit Benzin, Diesel, Netzstrom oder Sonne vom eigenen Dach?",
    icon: CarFront,
    tag: "Neu",
  },
  {
    id: "dynamisch",
    href: "/rechner/dynamischer-stromtarif",
    titel: "Dynamischer-Tarif-Rechner",
    kurz: "Mit Live-Börsenpreisen von heute",
    text: "Festpreis oder dynamischer Tarif? Mit echten Day-Ahead-Preisen und den günstigsten Ladefenstern.",
    icon: Zap,
    tag: "Live",
  },
  {
    id: "foerdercheck",
    href: "/foerdercheck",
    titel: "Förder-Check",
    kurz: "Zuschüsse, Kredite & Steuervorteile",
    text: "Welche Förderungen für PV, Speicher, Wärmepumpe und Wallbox passen zu Ihrem Vorhaben?",
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
    text: "Börsenstrompreis, Solar- und Windeinspeisung in Deutschland – live aktualisiert.",
    icon: Activity,
    tag: "Live",
  },
];

export const toolById = (id) => TOOLS.find((t) => t.id === id);
