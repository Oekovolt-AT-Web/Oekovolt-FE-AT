// Bildnachweise (CC-Lizenzen) für die Lösungsseiten Gewerbe, Freifläche, Agri-PV, Landwirtschaft, Gemeinden.
// Vollständige Liste: public/Images/AT/QUELLEN-loesungen-a.md (und QUELLEN-loesungen/-technik/-ratgeber-*).
const C = "https://commons.wikimedia.org/wiki/File:";

export const BILDNACHWEIS = {
  flachdachDornbirn: { motiv: "PV auf Industrie-Flachdach, Dornbirn", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: `${C}Dornbirn-Rhombergs_Fabrik-photovoltaic_systems-01ASD.jpg` },
  batteriecontainer: { motiv: "Batteriespeicher Theiß (Ausschnitt)", urheber: "Bp 95", lizenz: "CC BY 4.0", href: `${C}Batteriespeicher_Theiss.jpg` },
  carport: { motiv: "Solar-Carports (Symbolbild)", urheber: "pedrik", lizenz: "CC BY 2.0", href: `${C}Parking_under_Solar_Canopy_(52937580768).jpg` },
  weitendorf: { motiv: "Hochspannungsleitung Weitendorf", urheber: "Clemens Stockner", lizenz: "CC BY-SA 4.0", href: `${C}Weitendorf_Hochspannungsleitung.jpg` },
  molln: { motiv: "Hochspannungsleitung Molln", urheber: "Naturpuur", lizenz: "CC BY-SA 4.0", href: `${C}Gradau_Hochspannungsleitung,_Marktgemeinde_Molln.jpg` },
  leitwarte: { motiv: "Netzleitwarte (Symbolbild)", urheber: "Dpysh w", lizenz: "CC BY 3.0", href: `${C}ERCOTOperator_2.jpg` },
  umspannwerk: { motiv: "Umspannwerk Obersielach", urheber: "Christiankral", lizenz: "CC BY 4.0", href: `${C}Umspannwerk_Obersielach.jpg` },
  duernrohr: { motiv: "Photovoltaik-Park Dürnrohr", urheber: "C.Stadler/Bwag", lizenz: "CC BY-SA 4.0", href: `${C}D%C3%BCrnrohr_-_Photovoltaik-Park.JPG` },
  spitalberg: { motiv: "PV-Anlage am Spitalberg", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: `${C}Photovoltaik-Anlage_am_Spitalberg_(498_m_%C3%BC.A.),_K%C3%A4rnten_01.jpg` },
  widmungDornbirn: { motiv: "PV auf Wiese, Dornbirn (Winter)", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: `${C}Dornbirn-Montfortstrasse_19-Schnee-Photovoltaik-11ASD.jpg` },
  solarparkLuftbild: { motiv: "Solarpark, Luftbild (Symbolbild)", urheber: "Peter Facey", lizenz: "CC BY-SA 2.0", href: `${C}Solar_Park_-_geograph.org.uk_-_7353996.jpg` },
  schafe: { motiv: "Schafe im Solarpark (Symbolbild)", urheber: "Jonathan Hutchins", lizenz: "CC BY-SA 2.0", href: `${C}Solar_and_sheep_farming_-_geograph.org.uk_-_5813300.jpg` },
  aasen: { motiv: "Agri-PV Aasen (vertikal bifazial)", urheber: "Tobi Kellner", lizenz: "CC BY-SA 4.0", href: `${C}Aasen_agrivoltaics_solar_plant_with_walls_of_vertical_bifacial_modules_near_Donaueschingen_Germany_1.jpg` },
  kressbronn: { motiv: "Agri-PV-Anlage Kressbronn (Obstbau)", urheber: "Lisamiri", lizenz: "CC BY-SA 4.0", href: `${C}Agri-PV-Anlage_Kressbronn.jpg` },
  foulum: { motiv: "Agri-PV Foulum (vertikal, Getreide)", urheber: "Marta Victoria", lizenz: "CC BY-SA 4.0", href: `${C}Agrivoltaic_installation_Foulum.jpg` },
  heggelbach: { motiv: "Agri-PV Heggelbach (hoch aufgeständert)", urheber: "Tobi Kellner", lizenz: "CC BY-SA 4.0", href: `${C}Agrivoltaics_pilot_plant_at_Heggelbach_Farm_in_Germany_1.jpg` },
  tracker: { motiv: "Nachgeführte PV-Anlage, Dedinghausen (Symbolbild)", urheber: "Achim Raschka", lizenz: "CC BY-SA 4.0", href: `${C}Dedinghausen_Solaranlage_02.jpg` },
  hagelnetz: { motiv: "Apfelanlage mit Hagelnetz, Thurgau", urheber: "GabrielleMerk", lizenz: "CC BY-SA 4.0", href: `${C}Apple-Orchard-Thurgau.jpg` },
  hofStalldaecher: { motiv: "Hof mit PV auf Stalldächern", urheber: "GabrielleMerk", lizenz: "CC BY-SA 4.0", href: `${C}Barns-with-Solar-Panels.jpg` },
  hofLuftbild: { motiv: "Hof mit PV-Hallen, Nieder-Olm", urheber: "Matti Blume", lizenz: "CC BY-SA 4.0", href: `${C}Solar_power,_Nieder-Olm_(P1090617).jpg` },
  scheune: { motiv: "Scheune mit PV, Odelzhausen", urheber: "Usien", lizenz: "CC BY-SA 3.0", href: `${C}Solarzellen_auf_dem_Dach_eine_Scheune_in_Odelzhausen.JPG` },
  stall: { motiv: "Stall mit PV, Bylerward", urheber: "Pieter Delicaat", lizenz: "CC BY-SA 4.0", href: `${C}Bylerward_Haupthof_PM19-01.jpg` },
  montageHof: { motiv: "PV-Montage auf einem Hofdach", urheber: "Kristian Buus / 1010 Climate Action", lizenz: "CC BY 2.0", href: `${C}Solar_panel_installation_at_Grange_farm.jpg` },
  batteriespeicher: { motiv: "Batteriespeicher-Anlage (Symbolbild)", urheber: "Qurren", lizenz: "CC BY-SA 4.0", href: `${C}Nirazuka_Battery_Storage_Power_Station_2.jpg` },
  gemeindeamt: { motiv: "Gemeindeamt Fresach mit PV", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: `${C}Photovoltaik_Anlage_am_Dach_des_Gemeindeamtes_in_Fresach,_K%C3%A4rnten,_%C3%96sterreich.jpg` },
  klaeranlage: { motiv: "Kläranlage Wartberg an der Krems", urheber: "Isiwal", lizenz: "CC BY-SA 4.0", href: `${C}Wartberg_ad_Krems_Kl%C3%A4ranlage_KG_Penzendorf-DJI_20250920134211_0002_D.jpg` },
  feuerwehr: { motiv: "Feuerwehr Fladnitz im Raabtal", urheber: "Skunk", lizenz: "CC BY-SA 4.0", href: `${C}Freiwillige_Feuerwehr_Fladnitz_im_Raabtal,_2025-04-19.jpg` },
  schuleLuftbild: { motiv: "HTL1 Lastenstraße, Klagenfurt", urheber: "Ci14", lizenz: "CC BY-SA 4.0", href: `${C}HTL1_Lastenstra%C3%9Fe.jpg` },
  schuleDach: { motiv: "PV-Anlage Schule am See, Hard", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: `${C}Hard-Schule_am_See_PV-Anlage-Dach-02.jpg` },
  freibad: { motiv: "Freibad Großarl", urheber: "Usien", lizenz: "CC BY-SA 3.0", href: `${C}Fu%C3%9Fballplatz_Freibad_von_Gro%C3%9Farl.JPG` },
  hochbehaelter: { motiv: "PV am Hochbehälter Götzis", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: `${C}Goetzis-Hochbehaelter_Bulitta-Photovoltaic-03ASD.jpg` },
};

/** Liste für <Bildnachweis items={…}/> aus Schlüsseln. */
export const nachweise = (...keys) => keys.map((k) => BILDNACHWEIS[k]).filter(Boolean);
