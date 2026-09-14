// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const landshut = {
  name: "Landshut",
  bundesland: "Bayern",
  seoTitel: "Photovoltaik Landshut: Gestaltungssatzung, Netz & Ertrag | Ökovolt",
  beschreibung:
    "Photovoltaik in Landshut: strenge Regeln der Gestaltungssatzung für die Altstadt, Anmeldung bei den Stadtwerken Landshut, Netzkapazität als Engpass und standortgenauer Solarertrag für Niederbayern.",
  eyebrow: "Photovoltaik in Landshut",
  titel: "Photovoltaik in Landshut –",
  akzent: "mit Blick auf Burgberg und Netz.",
  lead: "In der Landshuter Altstadt gehören Solaranlagen zu den am strengsten geregelten Bauteilen Bayerns, im übrigen Stadtgebiet ist das Netz der eigentliche Engpass. Beides lässt sich planen – wenn man es von Anfang an berücksichtigt.",
  einleitungTitel: "Warum in Landshut Eigenverbrauch zählt",
  einleitung: [
    "Landshut hat früh auf Sonnenstrom gesetzt: Die Stadt nennt für ihr Gebiet eine Globalstrahlung von rund 1.160 kWh je Quadratmeter, und schon 2018 wurden über 54.000 Megawattstunden Solarstrom ins Netz eingespeist. Stadt und Stadtwerke betreiben selbst Dutzende Anlagen auf eigenen Dächern.",
    "Der Klimaaktionsplan der Stadt benennt aber auch die Grenze: Für den nötigen Zubau fehlt dem Stromnetz in dieser Größenordnung die Kapazität. Für Hausbesitzer ist das ein Argument, Anlagen auf hohen Eigenverbrauch auszulegen – mit Speicher, Wallbox oder Wärmepumpe statt maximaler Einspeisung.",
    "Netzbetreiber im Netzgebiet Landshut sind die Stadtwerke Landshut. Die Anmeldung läuft über deren Anlagenportal; das übernehmen wir als Fachbetrieb für Sie.",
  ],
  schwerpunkte: [
    {
      titel: "Mittelalterliche Innenstadt: grundsätzlich keine PV",
      text: "Die Gestaltungssatzung von 2021 schließt Solaranlagen im mittelalterlichen Innenstadtbereich grundsätzlich aus. Ausnahmen: ziegelrote, bündig verlegte Module, die weder von öffentlichen Straßen noch von den Aussichtspunkten auf dem Burgberg einsehbar sind – und nur mit Erlaubnis.",
    },
    {
      titel: "Auslegung auf das Netz",
      text: "Wo die Netzkapazität knapp ist, rechnet sich Solarstrom vor allem, wenn er im Haus bleibt. Wir dimensionieren Anlage und Speicher nach Ihrem Verbrauch und klären den Netzanschluss vorab mit den Stadtwerken.",
    },
    {
      titel: "Beratung über die Stadtwerke",
      text: "Stromkunden der Stadtwerke Landshut bekommen dort eine kostenlose Energie- und Umweltberatung, auch zu Photovoltaik. Ein kommunales Zuschussprogramm gibt es aktuell nicht.",
    },
  ],
  faq: [
    {
      q: "Darf ich in der Landshuter Altstadt Solarmodule aufs Dach setzen?",
      a: "Nur ausnahmsweise. Nach der Gestaltungssatzung vom 29. März 2021 sind PV- und Solaranlagen im mittelalterlichen Innenstadtbereich grundsätzlich unzulässig. Zulässig sein kann eine Dachanlage mit ziegelroten, bündig verlegten Modulen, wenn sie von öffentlichen Verkehrsflächen und vom Burgberg aus nicht zu sehen ist. Aufständerungen sind ausgeschlossen, der Einbau ist erlaubnispflichtig.",
    },
    {
      q: "Wer ist in Landshut Netzbetreiber für meine PV-Anlage?",
      a: "Im Netzgebiet Landshut sind es die Stadtwerke Landshut. Anlagen und Batteriespeicher werden über ihr Anlagenportal angemeldet. Ob Ihre Adresse im Netzgebiet liegt, prüfen wir vor der Anmeldung.",
    },
    {
      q: "Gibt es in Landshut eine Förderung für Photovoltaik?",
      a: "Ein städtisches Förderprogramm für PV, Speicher oder Balkonkraftwerke haben wir auf den Seiten von Stadt und Stadtwerken nicht gefunden (Stand September 2026). Bayern hat derzeit ebenfalls kein Landesprogramm; es bleiben Bundesmittel wie der KfW-Kredit 270 und die steuerlichen Vorteile.",
    },
    {
      q: "Wie viel Schnee muss eine Anlage in Landshut aushalten?",
      a: "Landshut liegt nach der DIBt-Zuordnung in Schneelastzone 1a, also in einer der niedrigeren Zonen. Die maßgebliche Last für Ihr Gebäude ergibt sich zusätzlich aus Höhe und Dachform; Befestigung und Module legen wir danach aus.",
    },
  ],
  cta: {
    titel: "Solarstrom für Landshut – passend zu Satzung und Netz.",
    text: "Erstberatung per Video, Unterlagen bequem per Smartphone, danach Vor-Ort-Termin und Angebot mit Eigenverbrauchsrechnung.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "Stadtwerke Landshut",
      hinweis: "Netzbetreiber im Netzgebiet Landshut; Anmeldung über das Anlagenportal.",
      anmeldung_url: "https://www.stadtwerke-landshut.de/en/netze/erzeugungsanlagen/",
      url: "https://www.stadtwerke-landshut.de/netze/",
    },
    foerderprogramme: [],
    klimaziel: { text: "Klimaaktionsplan 2023/24: untersucht Klimaneutralität bis 2034, alternativ bis 2040. Der Plan nennt fehlende Netzkapazität als Engpass für den PV-Zubau.", url: "https://landshut.de/sites/default/files/filemanager/Benutzerdaten/La31/Klimaaktionsplan/Klimaaktionsplan.pdf" },
    schneelastzone: { zone: "1a", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    ortsbild: [
      {
        text: "Gestaltungssatzung (29.03.2021): Im mittelalterlichen Innenstadtbereich sind PV-Anlagen grundsätzlich unzulässig; ausnahmsweise ziegelrote, bündige Module, wenn nicht von öffentlichen Flächen oder dem Burgberg einsehbar. Erlaubnispflichtig.",
        url: "https://landshut.de/sites/default/files/filemanager/Benutzerdaten/La17/2021_03_29%20Gestaltungssatzung.pdf",
      },
    ],
    besonderheiten: [{ text: "2018 wurden im Stadtgebiet 54.151 MWh Solarstrom eingespeist; Stadt und Stadtwerke betreiben zusammen PV auf 50 eigenen Gebäuden (Stand 2021).", url: "https://landshut.de/umwelt/klimaschutzmanagement/klima-infoplattform" }],
    energieberatung: { name: "Stadtwerke Landshut – Energie- und Umweltberatung (für Stromkunden kostenlos)", url: "https://www.stadtwerke-landshut.de/energie/energiedienste/" },
  },
};

export default landshut;
