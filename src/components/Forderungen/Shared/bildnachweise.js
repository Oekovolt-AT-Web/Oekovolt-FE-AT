// Bildnachweise der im Förderbereich wiederverwendeten Wikimedia-Commons-Bilder
// (Details in public/Images/AT/QUELLEN-*.md). Format für <Bildnachweis items={…} />.

export const BILDER = {
  flachdach: { src: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg", motiv: "PV auf Industrie-Flachdach, Dornbirn", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Dornbirn-Rhombergs_Fabrik-photovoltaic_systems-01ASD.jpg" },
  spitalberg: { src: "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg", motiv: "PV-Freifläche am Spitalberg, Kärnten", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Photovoltaik-Anlage_am_Spitalberg_(498_m_%C3%BC.A.),_K%C3%A4rnten_01.jpg" },
  wildkogel: { src: "/Images/AT/loesungen/tourismus-pv-skigebiet-wildkogel.jpg", motiv: "PV im Skigebiet Wildkogel, Salzburg", urheber: "Mr ccep", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Solar_PV_Austrian_Alps.jpg" },
  duernrohr: { src: "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg", motiv: "Photovoltaik-Park Dürnrohr, Niederösterreich", urheber: "C.Stadler/Bwag", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:D%C3%BCrnrohr_-_Photovoltaik-Park.JPG" },
  agriObst: { src: "/Images/AT/loesungen/agri-pv-obstbau.jpg", motiv: "Agri-PV über Apfelanlage (DE)", urheber: "Lisamiri", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Agri-PV-Anlage_Kressbronn.jpg" },
  gemeinde: { src: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg", motiv: "PV am Gemeindeamt Fresach, Kärnten", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Photovoltaik_Anlage_am_Dach_des_Gemeindeamtes_in_Fresach,_K%C3%A4rnten,_%C3%96sterreich.jpg" },
  umspannwerk: { src: "/Images/AT/ratgeber/tor-erzeuger-netzanschluss.jpg", motiv: "Umspannwerk Villach Landskron, Kärnten", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Umspannwerk_Villach_Landskron,_K%C3%A4rnten.jpg" },
  gewerbeDornbirn: { src: "/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg", motiv: "PV auf Gewerbedächern, Dornbirn", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Dornbirn-Montfortstrasse-ground-mounted_photovoltaic_system-14ASD.jpg" },
  wieseWinter: { src: "/Images/AT/ratgeber/freiflaechen-photovoltaik-widmung.jpg", motiv: "Aufgeständerte PV auf Wiese, Dornbirn", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Dornbirn-Montfortstrasse_19-Schnee-Photovoltaik-11ASD.jpg" },
};

/** Bildnachweis-Einträge für eine Liste von Schlüsseln. */
export const nachweise = (...keys) => keys.map((k) => BILDER[k]).filter(Boolean);
