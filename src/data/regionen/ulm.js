// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)
// Hinweis: ulm.de war für die Recherche nicht abrufbar; städtische Angaben zu Klimaziel,
// Solarkataster und Altstadt-Regeln fehlen deshalb bewusst.

const ulm = {
  name: "Ulm",
  bundesland: "Baden-Württemberg",
  seoTitel: "Photovoltaik Ulm & Neu-Ulm: ein Netz, zwei Bundesländer | Ökovolt",
  beschreibung:
    "Photovoltaik in Ulm und Neu-Ulm: gemeinsamer Netzbetreiber Ulm Netze, aber unterschiedliches Landesrecht – PV-Pflicht in Baden-Württemberg, bayerische Bauordnung in Neu-Ulm. Mit Förderstand 2026 und standortgenauem Ertrag.",
  eyebrow: "Photovoltaik in Ulm und Neu-Ulm",
  titel: "Eine Donau, zwei Bundesländer –",
  akzent: "Photovoltaik in Ulm und Neu-Ulm.",
  lead: "Wer in Ulm oder Neu-Ulm eine Solaranlage plant, hat denselben Netzbetreiber, aber nicht dieselben Regeln. Welche Pflichten, Behörden und Förderungen gelten, hängt davon ab, auf welcher Seite der Donau das Haus steht.",
  einleitungTitel: "Warum die Donau für Ihre Planung zählt",
  einleitung: [
    "Ulm liegt in Baden-Württemberg, Neu-Ulm auf der anderen Donauseite in Bayern. Für das Stromnetz spielt das keine Rolle: Die Stadtwerke Ulm/Neu-Ulm Netze GmbH betreibt es in beiden Städten, Voranfrage und Anmeldung laufen über dasselbe Netzportal.",
    "Für alles andere schon. In Ulm gilt die baden-württembergische Photovoltaikpflicht bei Neubau und grundlegender Dachsanierung, in Neu-Ulm die Bayerische Bauordnung und das bayerische Denkmalrecht. Auch Förderprogramme sind Sache der jeweiligen Stadt: Neu-Ulm hat 2023 ein eigenes Klimaschutzkonzept mit dem Ziel Klimaneutralität bis 2040 beschlossen.",
    "Mit rund 1.120 kWh je kWp liegt der simulierte Ertrag in Ulm knapp 2,5 % unter unserem Firmensitz Türkheim, 61 Kilometer entfernt. Wie viel Solarstrom auf großen Dächern möglich ist, zeigen die Stadtwerke selbst: Auf dem EvoBus-Werk in Neu-Ulm läuft seit 2008 eine Anlage mit 2,3 Megawatt.",
  ],
  schwerpunkte: [
    {
      titel: "Ulm: PV-Pflicht mitplanen",
      text: "Bei Neubauten und grundlegenden Dachsanierungen auf Ulmer Seite verlangt das Landesrecht Photovoltaik. Wir legen die Pflichtfläche fest und prüfen, ob sich eine größere Anlage mit Speicher wirtschaftlich lohnt.",
    },
    {
      titel: "Neu-Ulm: bayerisches Recht",
      text: "Auf bayerischer Seite gibt es für Bestandsgebäude keine allgemeine PV-Pflicht; Baurecht und Denkmalschutz richten sich nach bayerischen Vorschriften. Das beeinflusst vor allem Anlagen im Ensemble oder an Baudenkmälern.",
    },
    {
      titel: "Ulmer Förderprogramm 2026 gestoppt",
      text: "Laut Regionaler Energieagentur Ulm gilt für das Ulmer Energieförderprogramm 2026 seit dem 1. September 2026 ein Antragstopp, weil die Mittel weitgehend abgerufen sind. Wer 2027 plant, sollte die Neuauflage früh prüfen.",
    },
  ],
  faq: [
    {
      q: "Wer ist Netzbetreiber in Ulm und Neu-Ulm?",
      a: "Für beide Städte die Stadtwerke Ulm/Neu-Ulm Netze GmbH. Der Ablauf: Voranfrage im Netzportal, Anmeldung und Inbetriebnahme durch einen eingetragenen Installateur, Zählersetzung, danach Anmeldung zur EEG-Vergütung. Balkon-PV unter 800 W wird nur im Marktstammdatenregister registriert.",
    },
    {
      q: "Gilt die Solarpflicht auch in Neu-Ulm?",
      a: "Die baden-württembergische Photovoltaikpflicht gilt nur in Ulm. In Neu-Ulm gilt bayerisches Baurecht, das für private Bestandsgebäude keine allgemeine PV-Pflicht vorsieht. Welche Regeln für Ihr konkretes Vorhaben gelten, klären wir vor der Planung.",
    },
    {
      q: "Gibt es in Ulm 2026 noch Förderung?",
      a: "Für das Ulmer Energieförderprogramm 2026 gilt laut Regionaler Energieagentur Ulm seit 1. September 2026 ein Antragstopp. Das Land Baden-Württemberg fördert über zinsgünstige L-Bank-Darlehen, dazu kommen Bundesmittel wie der KfW-Kredit 270.",
    },
    {
      q: "Wo bekomme ich in Ulm eine neutrale Beratung?",
      a: "Bei der Regionalen Energieagentur Ulm im Hafenbad 25 – gegründet von Stadt Ulm, Landkreis Neu-Ulm und Alb-Donau-Kreis. Die Erstberatung ist kostenlos, auch für Mieter.",
    },
  ],
  cta: {
    titel: "Ulm oder Neu-Ulm – wir kennen beide Seiten.",
    text: "Vor-Ort-Termin, Klärung von Landesrecht und Netzanfrage, danach ein Angebot mit Eigenverbrauchsrechnung.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "Stadtwerke Ulm/Neu-Ulm Netze GmbH",
      hinweis: "Netzbetreiber für Ulm und Neu-Ulm; Voranfrage und Anmeldung über das Netzportal.",
      anmeldung_url: "https://www.ulm-netze.de/leistungen/erzeugungsanlagen-speicher",
      url: "https://www.ulm-netze.de/leistungen/erzeugungsanlagen-speicher",
    },
    foerderprogramme: [
      {
        name: "Ulmer Energieförderprogramm 2026",
        traeger: "Stadt Ulm",
        gegenstand: "u. a. erneuerbare Heizanlagen und Dämmung im Bestand",
        status: "Antragstopp seit 01.09.2026 (Mittel weitgehend abgerufen)",
        url: "https://www.regionale-energieagentur-ulm.de/foerderprogramme-2/",
      },
    ],
    klimaziel: { text: "Neu-Ulm: klimaneutrales Stadtgebiet bis 2040, Stadtverwaltung bis 2028 (Klimaschutzkonzept, Stadtrat 13.12.2023).", url: "https://www.wir-leben-neu.de/smart-and-green/klimaschutzkonzept" },
    besonderheiten: [{ text: "Die Stadtwerke Ulm/Neu-Ulm betreiben seit 2008 auf dem EvoBus-Werk in Neu-Ulm eine PV-Anlage mit 2.309 kW auf rund 18.000 m².", url: "https://www.swu.de/privatkunden/unternehmen/erzeugung/photovoltaik/photovoltaik-anlage-neu-ulm" }],
    energieberatung: { name: "Regionale Energieagentur Ulm, Hafenbad 25 (Erstberatung kostenlos)", url: "https://www.regionale-energieagentur-ulm.de/kontakt/" },
  },
};

export default ulm;
