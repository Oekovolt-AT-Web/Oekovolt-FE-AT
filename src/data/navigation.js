// src/data/navigation.js
// Zentrale Seitenstruktur – genutzt von Navigation, Footer und Sitemap.
// Icons werden als Namen gespeichert und in den Komponenten aufgelöst,
// damit diese Datei auch in Server-Komponenten importierbar bleibt.
//
// Österreich: Schwerpunkt Gewerbe, Industrie, Landwirtschaft und öffentliche
// Hand. Privat ist bewusst nachgeordnet (Premium-Objekte, Chalets).

import { FIRMA } from "@/lib/site";

export const NAVIGATION = [
  {
    title: "Lösungen",
    slug: "loesungen",
    intro: "Photovoltaik für Unternehmen, Land- und Forstwirtschaft und die öffentliche Hand.",
    groups: [
      {
        label: "Für Unternehmen",
        items: [
          { name: "Gewerbe & Industrie", href: "/gewerbe", icon: "Warehouse", text: "PV nach Lastgang, Hallen- und Flachdächer" },
          { name: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik", icon: "Sun", text: "Solarparks von 500 kWp bis in den MW-Bereich" },
          { name: "Agri-PV", href: "/agri-pv", icon: "Sprout", text: "Doppelte Ernte auf derselben Fläche" },
          { name: "Landwirtschaft", href: "/landwirtschaft", icon: "Tractor", text: "Stall, Scheune, Maschinenhalle" },
          { name: "Hotellerie & Tourismus", href: "/hotellerie-tourismus", icon: "Hotel", text: "Hotels, Bergbahnen, Thermen" },
        ],
      },
      {
        label: "Energie nutzen",
        items: [
          { name: "Gewerbespeicher", href: "/gewerbespeicher", icon: "BatteryCharging", text: "Peak Shaving, Eigenverbrauch, Notstrom" },
          { name: "Ladeinfrastruktur", href: "/ladeinfrastruktur", icon: "PlugZap", text: "E-Flotte, Kundenparkplatz, Lkw" },
          { name: "Energiegemeinschaften", href: "/energiegemeinschaften", icon: "Share2", text: "EEG, BEG & GEA richtig aufsetzen" },
          { name: "Reststromvermarktung", href: "/service/direktvermarktung", icon: "TrendingUp", text: "Überschuss, PPA & Marktpreis" },
        ],
      },
      {
        label: "Öffentlich & Premium",
        items: [
          { name: "Gemeinden & Länder", href: "/kommunen", icon: "Landmark", text: "Schulen, Bauhöfe, Kläranlagen" },
          { name: "Luxus-Chalets & Alpin", href: "/chalets", icon: "Mountain", text: "Indach, Schneelast, Concierge-Wartung" },
          { name: "Einzugsgebiet Österreich", href: "/photovoltaik", icon: "MapPin", text: "Alle Bundesländer & Städte" },
        ],
      },
    ],
    feature: { title: "Standort-Check mit eHORA", text: "Schneelast, Wind, Hagel und Ertrag für Ihre Adresse – in einer Minute.", href: "/standort-check", cta: "Standort prüfen" },
  },
  {
    title: "Technik",
    slug: "technik",
    intro: "Eigene Regelungs- und Leittechnik – entwickelt für den österreichischen Netzanschluss.",
    groups: [
      {
        label: "Eigene Systeme",
        items: [
          { name: "Parkregler (EZA-Regler)", href: "/technik/parkregler", icon: "SlidersHorizontal", text: "TOR-Erzeuger-konform, Blindleistung & Einspeiselimit" },
          { name: "Fernwartung", href: "/technik/fernwartung", icon: "Radio", text: "Sichere Fernzugriffe, 24/7-Überwachung" },
          { name: "SCADA & Leitwarte", href: "/technik/scada", icon: "MonitorDot", text: "Portfolio-Monitoring & Reporting" },
          { name: "Technik-Übersicht", href: "/technik", icon: "Cpu", text: "Unser Systemverbund im Überblick" },
        ],
      },
      {
        label: "Komponenten",
        items: [
          { name: "Photovoltaikanlage", href: "/produkte/photovoltaikanlage", icon: "Sun", text: "Module, Wechselrichter, Unterkonstruktion" },
          { name: "Stromspeicher", href: "/produkte/stromspeicher", icon: "BatteryCharging", text: "Heim- und Gewerbespeicher" },
          { name: "Wärmepumpe", href: "/produkte/warmepumpe", icon: "Thermometer", text: "Heizen und Kühlen mit Solarstrom" },
          { name: "Wallbox", href: "/produkte/wallbox", icon: "PlugZap", text: "Laden mit PV-Überschuss" },
          { name: "Smart Meter & EMS", href: "/produkte/smartmeter", icon: "Gauge", text: "Messung, Steuerung, Energiemanagement" },
          { name: "Hersteller", href: "/produkte/hersteller", icon: "Factory", text: "Marken, denen wir vertrauen" },
        ],
      },
    ],
    feature: { title: "Strommarkt Österreich live", text: "Day-Ahead-Preis der Gebotszone AT und Erzeugungsmix – viertelstündlich.", href: "/energie-live", cta: "Zum Live-Dashboard", live: true },
  },
  {
    title: "Service",
    slug: "service",
    intro: "Über die gesamte Lebensdauer: Betrieb, Prüfung, Absicherung.",
    groups: [
      {
        label: "Betrieb & Wartung",
        items: [
          { name: "Wartung & Wartungsvertrag", href: "/service/wartung", icon: "Wrench", text: "Service-Level nach Anlagengröße" },
          { name: "E-Check & Anlagenprüfung", href: "/service/e-check", icon: "ClipboardCheck", text: "Wiederkehrende Prüfung nach ÖVE/ÖNORM" },
          { name: "Drohnen-Thermografie", href: "/service/drohneninspektion", icon: "ScanSearch", text: "Hotspots aus der Luft finden" },
          { name: "PV-Reinigung", href: "/service/reinigung", icon: "Droplets", text: "Mehr Ertrag, Garantie erhalten" },
          { name: "Repowering", href: "/service/repowering", icon: "RefreshCw", text: "Bestandsanlagen modernisieren" },
        ],
      },
      {
        label: "Absichern & Beraten",
        items: [
          { name: "Notstrom & Blackout-Vorsorge", href: "/service/notstrom", icon: "ShieldAlert", text: "Ersatzstrom und Inselbetrieb" },
          { name: "PV-Versicherung", href: "/service/versicherung", icon: "ShieldCheck", text: "Allgefahren, Ertragsausfall, Haftpflicht" },
          { name: "Energieberatung", href: "/service/energieberatung", icon: "Lightbulb", text: "Lastganganalyse & Energieaudit" },
          { name: "Finanzierung & Leasing", href: "/service/finanzierung", icon: "Wallet", text: "Leasing, Kredit, Contracting" },
        ],
      },
      {
        label: "Mehr Wirkung",
        items: [
          { name: "Nachhaltigkeitsmarketing", href: "/service/nachhaltigkeitsmarketing", icon: "Clapperboard", text: "Imagefilm & Content mit Solensa" },
          { name: "Dynamischer Stromtarif", href: "/service/stromtarif", icon: "Zap", text: "Laden, wenn die Börse günstig ist" },
          { name: "Ökovolt Vorteilswelt", href: "/service/vorteilswelt", icon: "Gift", text: "Exklusiv für Kunden" },
        ],
      },
    ],
    feature: { title: "Wartungsvertrag anfragen", text: "Service-Level, Reaktionszeiten und Preis passend zu Ihrer Anlage.", href: "/service/wartung#anfrage", cta: "Angebot anfordern" },
  },
  {
    title: "Förderungen",
    slug: "forderungen",
    intro: "Bund, Länder, Steuern und Recht – aktuell für Österreich.",
    groups: [
      {
        label: "Förderungen",
        items: [
          { name: "Förder-Check", href: "/foerdercheck", icon: "BadgeEuro", text: "Passende Programme in 30 Sekunden" },
          { name: "Bundesförderung (EAG & KPC)", href: "/forderungen/bundesfoerderung", icon: "Landmark", text: "OeMAG-Investitionszuschuss, UFI" },
          { name: "Landesförderungen", href: "/forderungen/landesforderungen", icon: "Map", text: "Alle neun Bundesländer" },
          { name: "Steuerliche Vorteile", href: "/forderungen/steuerlich", icon: "Percent", text: "IFB, AfA, Elektrizitätsabgabe" },
        ],
      },
      {
        label: "Recht & Normen",
        items: [
          { name: "Baurecht", href: "/forderungen/baurecht", icon: "Building2", text: "Bauordnungen der Bundesländer" },
          { name: "Richtlinien & Netzanschluss", href: "/forderungen/richtlinien", icon: "FileCheck2", text: "EAG, ElWG, TOR Erzeuger, OVE" },
          { name: "Netzanmeldung", href: "/netzanmeldung", icon: "PlugZap", text: "PV beim Netzbetreiber anmelden" },
        ],
      },
    ],
  },
  {
    title: "Wissen",
    slug: "wissen",
    intro: "Fachwissen für Geschäftsführung, Technik und Einkauf.",
    groups: [
      {
        label: "Wissen",
        items: [
          { name: "Ratgeber", href: "/ratgeber", icon: "BookOpen", text: "Fachartikel für Österreich" },
          { name: "Photovoltaik-Lexikon", href: "/wissen/lexikon", icon: "Library", text: "Fachbegriffe von A bis Z" },
          { name: "FAQs", href: "/faqs", icon: "HelpCircle", text: "Häufige Fragen, kurz beantwortet" },
          { name: "Presse & News", href: "/presse", icon: "Newspaper", text: "Newsroom, RSS & Fediverse" },
          { name: "Mediathek", href: "/mediathek", icon: "Clapperboard", text: "Kurzvideos von Baustellen und Projekten" },
        ],
      },
      {
        label: "Werkzeuge",
        items: [
          { name: "Energie live", href: "/energie-live", icon: "Activity", text: "Strommarkt Österreich in Echtzeit" },
          { name: "Standort-Check (eHORA)", href: "/standort-check", icon: "Mountain", text: "Schneelast, Wind, Hagel, Ertrag" },
        ],
      },
    ],
    feature: { title: "Alle Rechner & Tools", text: "Gewerbe-PV, Peak Shaving, E-Flotte, Energiegemeinschaft, Blackout, CO₂ – rechnen Sie Ihr Projekt selbst durch.", href: "/rechner", cta: "Zur Übersicht" },
  },
  {
    title: "Rechner",
    slug: "rechner",
    intro: "Ehrliche Zahlen für Ihren Betrieb – bevor Sie mit uns sprechen.",
    groups: [
      {
        label: "Wirtschaftlichkeit",
        items: [
          { name: "Gewerbe-PV-Rechner", href: "/rechner/gewerbe-pv", icon: "Warehouse", text: "Was bringt Ihr Hallendach?" },
          { name: "Solarrechner", href: "/solarrechner", icon: "Calculator", text: "Privat, Gewerbe, Landwirtschaft" },
          { name: "Freiflächen & Pacht", href: "/rechner/freiflaeche-pacht", icon: "Sun", text: "Für Grundeigentümer" },
          { name: "CO₂- & ESG-Rechner", href: "/rechner/co2-esg", icon: "Leaf", text: "Scope 2 für den Bericht" },
        ],
      },
      {
        label: "Speicher & Netz",
        items: [
          { name: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving", icon: "Gauge", text: "Leistungspreis senken" },
          { name: "Stromspeicher-Rechner", href: "/rechner/stromspeicher", icon: "BatteryCharging", text: "Die passende Speichergröße" },
          { name: "Energiegemeinschaft", href: "/rechner/energiegemeinschaft", icon: "Share2", text: "Netzentgelt teilen und sparen" },
          { name: "Blackout-Rechner", href: "/rechner/blackout", icon: "ShieldAlert", text: "Ausfallkosten vs. Ersatzstrom" },
        ],
      },
      {
        label: "Mobilität & Standort",
        items: [
          { name: "E-Flotte-Rechner", href: "/rechner/e-flotte", icon: "Car", text: "Firmenflotte auf Elektro" },
          { name: "Ladeinfrastruktur-Planer", href: "/rechner/ladeinfrastruktur", icon: "PlugZap", text: "Ladepunkte & Lastmanagement" },
          { name: "Standort-Check (eHORA)", href: "/standort-check", icon: "Mountain", text: "Schneelast, Wind, Hagel, Ertrag" },
          { name: "Förder-Check", href: "/foerdercheck", icon: "BadgeEuro", text: "Passende Programme finden" },
        ],
      },
    ],
    feature: { title: "Angebot in 2 Minuten", text: "Dach, Lastgang, Wünsche – Sie erhalten eine fundierte Ersteinschätzung.", href: "/angebot", cta: "Konfigurator starten" },
  },
  {
    title: "Unternehmen",
    slug: "uber-uns",
    intro: "Seit 2012 in Österreich – aus Ostermiething für das ganze Land.",
    groups: [
      {
        label: "Ökovolt",
        items: [
          { name: "Über uns", href: "/uber-uns", icon: "Building2", text: "Geschichte, Gesellschafter, Haltung" },
          { name: "Team", href: "/uber-uns/team", icon: "Users", text: "Die Menschen hinter Ökovolt" },
          { name: "Referenzen", href: "/referenzen/projekte", icon: "Images", text: "Anlagen mit echten Zahlen" },
          { name: "Referenzkarte", href: "/referenzen/referenzkarte", icon: "MapPin", text: "Unsere Anlagen in Ihrer Nähe" },
        ],
      },
      {
        label: "Gemeinsam",
        items: [
          { name: "Ökovolt PV Award", href: "/pv-award", icon: "Trophy", text: "Die besten Anlagen des Jahres" },
          { name: "Sponsoring", href: "/sponsoring", icon: "HeartHandshake", text: "Vereine, Kultur, Nachwuchs" },
          { name: "Elektro-Partner werden", href: "/partner", icon: "Handshake", text: "Energiewende gemeinsam bauen" },
          { name: "Jobs & Karriere", href: "/uber-uns/jobs", icon: "Briefcase", text: "Werden Sie Teil des Teams" },
        ],
      },
      {
        label: "Kontakt",
        items: [
          { name: "Kontakt", href: "/kontakt", icon: "MessageCircle", text: "Beratung, Anfahrt & Öffnungszeiten" },
          { name: "Termin buchen", href: "/termin", icon: "CalendarDays", text: "Telefon, Video oder vor Ort" },
        ],
      },
    ],
  },
];

export const KONTAKT = {
  telefon: FIRMA.telefon,
  telefonHref: FIRMA.telefonHref,
  email: FIRMA.email,
  strasse: FIRMA.strasse,
  ort: `${FIRMA.plz} ${FIRMA.ort}`,
  oeffnungszeiten: FIRMA.oeffnungszeiten,
};
