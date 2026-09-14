// src/data/navigation.js
// Zentrale Seitenstruktur – genutzt von Navigation, Footer und Sitemap.
// Icons werden als Namen gespeichert und in den Komponenten aufgelöst,
// damit diese Datei auch in Server-Komponenten importierbar bleibt.

export const NAVIGATION = [
  {
    title: "Produkte",
    slug: "produkte",
    intro: "Alles für Ihr eigenes Kraftwerk – abgestimmt aus einer Hand.",
    groups: [
      {
        label: "Erzeugen & Speichern",
        items: [
          { name: "Photovoltaikanlage", href: "/produkte/photovoltaikanlage", icon: "Sun", text: "Komplettanlage für Eigenheim & Gewerbe" },
          { name: "Stromspeicher", href: "/produkte/stromspeicher", icon: "BatteryCharging", text: "Solarstrom abends und nachts nutzen" },
          { name: "Smart Energy Home", href: "/produkte/smartenergyhome", icon: "HousePlug", text: "Erzeugung, Speicher & Verbrauch vernetzt" },
          { name: "Mieterstrom", href: "/produkte/mieterstrom", icon: "Building2", text: "Solarstrom für Mehrfamilienhäuser" },
        ],
      },
      {
        label: "Nutzen & Steuern",
        items: [
          { name: "Wärmepumpe", href: "/produkte/warmepumpe", icon: "Thermometer", text: "Heizen mit eigenem Sonnenstrom" },
          { name: "Wallbox", href: "/produkte/wallbox", icon: "PlugZap", text: "E-Auto mit Solarüberschuss laden" },
          { name: "Smart Meter", href: "/produkte/smartmeter", icon: "Gauge", text: "Intelligentes Messsystem" },
          { name: "Hersteller", href: "/produkte/hersteller", icon: "Factory", text: "Marken, denen wir vertrauen" },
        ],
      },
    ],
    feature: { title: "Anlage in 2 Minuten konfigurieren", text: "Dach, Verbrauch, Wünsche – Sie erhalten eine fundierte Ersteinschätzung.", href: "/angebot", cta: "Konfigurator starten" },
  },
  {
    title: "Service",
    slug: "service",
    intro: "Von der Planung bis 20 Jahre nach der Inbetriebnahme.",
    groups: [
      {
        label: "Leistungen",
        items: [
          { name: "Photovoltaik-Montage", href: "/dienstleistungen/photovoltaik", icon: "Wrench", text: "Planung, Installation & Anmeldung" },
          { name: "Smarthome", href: "/dienstleistungen/smarthome", icon: "Cpu", text: "Energiemanagement im ganzen Haus" },
          { name: "Photovoltaik Repowering", href: "/service/repowering", icon: "RefreshCw", text: "Altanlagen modernisieren" },
          { name: "Direktvermarktung", href: "/service/direktvermarktung", icon: "TrendingUp", text: "Mehr Erlös nach dem EEG" },
        ],
      },
      {
        label: "Für Unternehmen",
        items: [
          { name: "Gewerbe & Industrie", href: "/gewerbe", icon: "Warehouse", text: "PV nach Lastgang, Speicher, E-Flotte" },
          { name: "Landwirtschaft & Agri-PV", href: "/landwirtschaft", icon: "Tractor", text: "Stall, Scheune, Agri-PV" },
          { name: "Kommunen & Stadtwerke", href: "/kommunen", icon: "Landmark", text: "Schulen, Freiflächen, Quartiere" },
          { name: "Einzugsgebiet", href: "/photovoltaik", icon: "MapPin", text: "24 Städte mit Standortdaten" },
        ],
      },
      {
        label: "Vorteile",
        items: [
          { name: "Finanzierung", href: "/service/finanzierung", icon: "Wallet", text: "Solaranlage ohne Eigenkapital" },
          { name: "Dynamischer Stromtarif", href: "/service/stromtarif", icon: "Zap", text: "Günstig laden, wenn die Börse fällt" },
          { name: "Ökovolt Vorteilswelt", href: "/service/vorteilswelt", icon: "Gift", text: "Exklusive Leistungen für Kunden" },
        ],
      },
    ],
    feature: { title: "Strompreis live", text: "Börsenpreis und Solaranteil im deutschen Netz – viertelstündlich aktuell.", href: "/energie-live", cta: "Zum Live-Dashboard", live: true },
  },
  {
    title: "Rechner & Tools",
    slug: "rechner",
    intro: "Ehrliche Zahlen, bevor Sie mit uns sprechen.",
    groups: [
      {
        label: "Rechner",
        items: [
          { name: "Solarrechner", href: "/solarrechner", icon: "Calculator", text: "Ertrag, Ersparnis & Amortisation" },
          { name: "Stromspeicher-Rechner", href: "/rechner/stromspeicher", icon: "BatteryCharging", text: "Die passende Speichergröße" },
          { name: "Wärmepumpen-Rechner", href: "/rechner/waermepumpe", icon: "Thermometer", text: "Heizkosten mit PV vergleichen" },
          { name: "E-Auto-Laderechner", href: "/rechner/wallbox", icon: "PlugZap", text: "Solar laden statt tanken" },
        ],
      },
      {
        label: "Tools",
        items: [
          { name: "Angebots-Konfigurator", href: "/angebot", icon: "Sparkles", text: "Ihre Anlage in 2 Minuten" },
          { name: "Förder-Check", href: "/foerdercheck", icon: "BadgeEuro", text: "Förderung für Ihr Bundesland" },
          { name: "Dynamischer-Tarif-Rechner", href: "/rechner/dynamischer-stromtarif", icon: "Zap", text: "Mit Live-Börsenpreisen" },
          { name: "Energie live", href: "/energie-live", icon: "Activity", text: "Strommarkt in Echtzeit" },
        ],
      },
    ],
    feature: { title: "Alle Rechner auf einen Blick", text: "Acht Werkzeuge, die Ihnen die Entscheidung leichter machen.", href: "/rechner", cta: "Zur Übersicht" },
  },
  {
    title: "Förderungen",
    slug: "forderungen",
    intro: "Kein Zuschuss soll liegen bleiben.",
    groups: [
      {
        label: "Förderungen",
        items: [
          { name: "Förder-Check", href: "/foerdercheck", icon: "BadgeEuro", text: "In 30 Sekunden zur passenden Förderung" },
          { name: "Landesförderungen", href: "/forderungen/landesforderungen", icon: "Map", text: "Programme aller 16 Bundesländer" },
          { name: "Steuerliche Vorteile", href: "/forderungen/steuerlich", icon: "Percent", text: "0 % MwSt. & Einkommensteuer" },
          { name: "Baurecht", href: "/forderungen/baurecht", icon: "Landmark", text: "Genehmigung & Vorschriften" },
          { name: "Richtlinien", href: "/forderungen/richtlinien", icon: "FileCheck2", text: "Normen, EEG & Netzbetreiber" },
        ],
      },
    ],
  },
  {
    title: "Referenzen",
    slug: "referenzen",
    intro: "Anlagen, die wir gebaut haben – mit echten Zahlen.",
    groups: [
      {
        label: "Referenzen",
        items: [
          { name: "Projekte", href: "/referenzen/projekte", icon: "Images", text: "Ausgewählte Kundenanlagen" },
          { name: "Referenzkarte", href: "/referenzen/referenzkarte", icon: "MapPin", text: "Unsere Anlagen in Ihrer Nähe" },
        ],
      },
    ],
  },
  {
    title: "Wissen",
    slug: "wissen",
    intro: "Unabhängig erklärt – vom Fachbetrieb.",
    groups: [
      {
        label: "Wissen",
        items: [
          { name: "Ratgeber", href: "/ratgeber", icon: "BookOpen", text: "Fundierte Artikel rund um PV" },
          { name: "Photovoltaik-Lexikon", href: "/wissen/lexikon", icon: "Library", text: "Fachbegriffe von A bis Z" },
          { name: "Solaranlage Kosten 2026", href: "/ratgeber/solaranlage-kosten", icon: "Euro", text: "Preise je kWp im Überblick" },
          { name: "Einspeisevergütung 2026", href: "/ratgeber/einspeiseverguetung-2026", icon: "TrendingUp", text: "Aktuelle Sätze nach EEG" },
          { name: "FAQs", href: "/faqs", icon: "HelpCircle", text: "Häufige Fragen, kurz beantwortet" },
          { name: "Presse & Neuigkeiten", href: "/presse", icon: "Newspaper", text: "Newsroom, RSS & Fediverse" },
        ],
      },
    ],
  },
  {
    title: "Über uns",
    slug: "uber-uns",
    intro: "Ein Team aus Türkheim, das Energie ernst nimmt.",
    groups: [
      {
        label: "Unternehmen",
        items: [
          { name: "Team", href: "/uber-uns/team", icon: "Users", text: "Die Menschen hinter Ökovolt" },
          { name: "Jobs & Karriere", href: "/uber-uns/jobs", icon: "Briefcase", text: "Werden Sie Teil der Energiewende" },
          { name: "Kontakt", href: "/kontakt", icon: "MessageCircle", text: "Beratung, Anfahrt & Öffnungszeiten" },
          { name: "Termin buchen", href: "/termin", icon: "CalendarDays", text: "Telefon, Video oder vor Ort – online" },
        ],
      },
    ],
  },
];

export const KONTAKT = {
  telefon: "+49 8245 96 788 0",
  telefonHref: "tel:+498245967880",
  email: "office@oekovolt.de",
  strasse: "Schlingener Straße 1a",
  ort: "86842 Türkheim",
  oeffnungszeiten: [
    { tage: "Mo – Do", zeit: "08:00 – 16:00" },
    { tage: "Fr", zeit: "08:00 – 13:00" },
  ],
};
