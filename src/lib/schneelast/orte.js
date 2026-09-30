// src/lib/schneelast/orte.js
//
// Orte für die Bundesland-Seiten /schneelast/[bundesland]: je Bundesland die Bezirkshauptorte
// (Verwaltungssitz der Bezirkshauptmannschaft bzw. Statutarstadt), ergänzt um Orte mit eigener
// Regionalseite (/photovoltaik/[stadt]); in Wien die 23 Gemeindebezirke.
//
// Quellen (abgerufen 30.09.2026):
//  - Bezirke und Verwaltungssitze: Wikipedia „Liste der Bezirke in Österreich“
//    https://de.wikipedia.org/wiki/Liste_der_Bezirke_in_%C3%96sterreich
//  - Koordinaten: Orte mit Regionalseite aus src/data/regionen-pvgis.json (Ortszentrum laut
//    OpenStreetMap). Übrige Orte: OpenStreetMap Nominatim (© OpenStreetMap-Mitwirkende, ODbL),
//    Gemeinde bzw. – in Wien – Bezirk, Punkt laut Nominatim, auf 4 Stellen gerundet. Einmalig
//    abgefragt (unter 1 Anfrage/Sekunde), NICHT zur Laufzeit.
//  - Seehöhe: EU-DEM v1.1 25 m (Copernicus Land Monitoring Service) über Open Topo Data,
//    einmalig abgefragt am 30.09.2026.
//
// Die Schneelast-Richtwerte selbst stehen NICHT hier: Sie werden zur Build-Zeit aus dem Raster
// data/schneelast/sk50-at.bin gelesen (src/lib/schneelast/laender.js).
//
// Felder: ort, bezirke (Bezirke mit Sitz in diesem Ort; leer = kein Bezirkshauptort),
// lat, lon (WGS84), hoehe (m ü. A.), region (Slug der Regionalseite oder null).

export const ORTE_QUELLEN = {
  abgerufen: "2026-09-30",
  bezirke: { name: "Wikipedia: Liste der Bezirke in Österreich", url: "https://de.wikipedia.org/wiki/Liste_der_Bezirke_in_%C3%96sterreich" },
  koordinaten: { name: "OpenStreetMap Nominatim (© OpenStreetMap-Mitwirkende, ODbL)", url: "https://nominatim.openstreetmap.org/" },
  seehoehe: { name: "EU-DEM v1.1 25 m (Copernicus) über Open Topo Data", url: "https://www.opentopodata.org/datasets/eudem/" },
};

export const ORTE = {
  burgenland: [
    { ort: "Eisenstadt", bezirke: ["Eisenstadt (Stadt)","Eisenstadt-Umgebung"], lat: 47.8468, lon: 16.5256, hoehe: 182, region: "eisenstadt" },
    { ort: "Güssing", bezirke: ["Güssing"], lat: 47.0588, lon: 16.3243, hoehe: 240, region: null },
    { ort: "Jennersdorf", bezirke: ["Jennersdorf"], lat: 46.9372, lon: 16.1413, hoehe: 244, region: null },
    { ort: "Mattersburg", bezirke: ["Mattersburg"], lat: 47.7368, lon: 16.398, hoehe: 241, region: null },
    { ort: "Neusiedl am See", bezirke: ["Neusiedl am See"], lat: 47.9493, lon: 16.8415, hoehe: 128, region: "neusiedl-am-see" },
    { ort: "Oberpullendorf", bezirke: ["Oberpullendorf"], lat: 47.5013, lon: 16.5055, hoehe: 247, region: null },
    { ort: "Oberwart", bezirke: ["Oberwart"], lat: 47.2862, lon: 16.2124, hoehe: 315, region: null },
    { ort: "Rust", bezirke: ["Rust (Stadt)"], lat: 47.8037, lon: 16.689, hoehe: 115, region: null },
  ],
  kaernten: [
    { ort: "Klagenfurt am Wörthersee", bezirke: ["Klagenfurt (Stadt)","Klagenfurt-Land"], lat: 46.6241, lon: 14.3069, hoehe: 452, region: "klagenfurt" },
    { ort: "Villach", bezirke: ["Villach (Stadt)","Villach-Land"], lat: 46.614, lon: 13.8466, hoehe: 504, region: "villach" },
    { ort: "Feldkirchen in Kärnten", bezirke: ["Feldkirchen"], lat: 46.7229, lon: 14.0965, hoehe: 545, region: null },
    { ort: "Hermagor-Pressegger See", bezirke: ["Hermagor"], lat: 46.6126, lon: 13.3552, hoehe: 579, region: null },
    { ort: "Spittal an der Drau", bezirke: ["Spittal an der Drau"], lat: 46.7982, lon: 13.4963, hoehe: 565, region: null },
    { ort: "St. Veit an der Glan", bezirke: ["St. Veit an der Glan"], lat: 46.7673, lon: 14.3577, hoehe: 491, region: null },
    { ort: "Völkermarkt", bezirke: ["Völkermarkt"], lat: 46.6604, lon: 14.6341, hoehe: 469, region: null },
    { ort: "Wolfsberg", bezirke: ["Wolfsberg"], lat: 46.8391, lon: 14.8452, hoehe: 475, region: "wolfsberg" },
  ],
  niederoesterreich: [
    { ort: "St. Pölten", bezirke: ["St. Pölten (Stadt)","St. Pölten-Land"], lat: 48.2051, lon: 15.6232, hoehe: 277, region: "st-poelten" },
    { ort: "Krems an der Donau", bezirke: ["Krems an der Donau (Stadt)","Krems-Land"], lat: 48.4096, lon: 15.596, hoehe: 203, region: "krems" },
    { ort: "Wiener Neustadt", bezirke: ["Wiener Neustadt (Stadt)","Wiener Neustadt-Land"], lat: 47.8132, lon: 16.2444, hoehe: 271, region: "wiener-neustadt" },
    { ort: "Waidhofen an der Ybbs", bezirke: ["Waidhofen an der Ybbs (Stadt)"], lat: 47.9513, lon: 14.7445, hoehe: 537, region: null },
    { ort: "Amstetten", bezirke: ["Amstetten"], lat: 48.1236, lon: 14.871, hoehe: 282, region: "amstetten" },
    { ort: "Baden", bezirke: ["Baden"], lat: 48.0077, lon: 16.2344, hoehe: 236, region: null },
    { ort: "Bruck an der Leitha", bezirke: ["Bruck an der Leitha"], lat: 48.0255, lon: 16.779, hoehe: 160, region: null },
    { ort: "Gänserndorf", bezirke: ["Gänserndorf"], lat: 48.3404, lon: 16.7187, hoehe: 167, region: null },
    { ort: "Gmünd", bezirke: ["Gmünd"], lat: 48.7729, lon: 14.9862, hoehe: 491, region: null },
    { ort: "Hollabrunn", bezirke: ["Hollabrunn"], lat: 48.5625, lon: 16.0798, hoehe: 233, region: null },
    { ort: "Horn", bezirke: ["Horn"], lat: 48.6637, lon: 15.6563, hoehe: 315, region: null },
    { ort: "Korneuburg", bezirke: ["Korneuburg"], lat: 48.3441, lon: 16.3334, hoehe: 171, region: null },
    { ort: "Lilienfeld", bezirke: ["Lilienfeld"], lat: 48.015, lon: 15.5966, hoehe: 375, region: null },
    { ort: "Melk", bezirke: ["Melk"], lat: 48.2272, lon: 15.337, hoehe: 234, region: null },
    { ort: "Mistelbach", bezirke: ["Mistelbach"], lat: 48.5695, lon: 16.572, hoehe: 203, region: null },
    { ort: "Mödling", bezirke: ["Mödling"], lat: 48.0855, lon: 16.2833, hoehe: 234, region: "moedling" },
    { ort: "Neunkirchen", bezirke: ["Neunkirchen"], lat: 47.7221, lon: 16.0816, hoehe: 370, region: null },
    { ort: "Scheibbs", bezirke: ["Scheibbs"], lat: 48.0054, lon: 15.1675, hoehe: 339, region: null },
    { ort: "Tulln an der Donau", bezirke: ["Tulln"], lat: 48.3309, lon: 16.0509, hoehe: 181, region: "tulln" },
    { ort: "Waidhofen an der Thaya", bezirke: ["Waidhofen an der Thaya"], lat: 48.8146, lon: 15.2845, hoehe: 512, region: null },
    { ort: "Zwettl", bezirke: ["Zwettl"], lat: 48.6053, lon: 15.1682, hoehe: 527, region: null },
  ],
  oberoesterreich: [
    { ort: "Linz", bezirke: ["Linz (Stadt)","Linz-Land","Urfahr-Umgebung"], lat: 48.3058, lon: 14.2865, hoehe: 268, region: "linz" },
    { ort: "Steyr", bezirke: ["Steyr (Stadt)","Steyr-Land"], lat: 48.0382, lon: 14.4185, hoehe: 305, region: "steyr" },
    { ort: "Wels", bezirke: ["Wels (Stadt)","Wels-Land"], lat: 48.157, lon: 14.0252, hoehe: 325, region: "wels" },
    { ort: "Braunau am Inn", bezirke: ["Braunau am Inn"], lat: 48.2577, lon: 13.0352, hoehe: 357, region: "braunau" },
    { ort: "Freistadt", bezirke: ["Freistadt"], lat: 48.5113, lon: 14.5048, hoehe: 566, region: null },
    { ort: "Gmunden", bezirke: ["Gmunden"], lat: 47.9181, lon: 13.7999, hoehe: 428, region: "gmunden" },
    { ort: "Grieskirchen", bezirke: ["Grieskirchen","Eferding"], lat: 48.235, lon: 13.8262, hoehe: 338, region: null },
    { ort: "Kirchdorf an der Krems", bezirke: ["Kirchdorf an der Krems"], lat: 47.9052, lon: 14.1244, hoehe: 451, region: null },
    { ort: "Perg", bezirke: ["Perg"], lat: 48.2501, lon: 14.6338, hoehe: 254, region: null },
    { ort: "Ried im Innkreis", bezirke: ["Ried im Innkreis"], lat: 48.2099, lon: 13.4883, hoehe: 439, region: "ried-im-innkreis" },
    { ort: "Rohrbach-Berg", bezirke: ["Rohrbach"], lat: 48.5723, lon: 13.9908, hoehe: 606, region: null },
    { ort: "Schärding", bezirke: ["Schärding"], lat: 48.457, lon: 13.4318, hoehe: 324, region: null },
    { ort: "Vöcklabruck", bezirke: ["Vöcklabruck"], lat: 48.0079, lon: 13.6542, hoehe: 436, region: "voecklabruck" },
    { ort: "Ostermiething", bezirke: [], lat: 48.0428, lon: 12.8417, hoehe: 412, region: "ostermiething" },
  ],
  salzburg: [
    { ort: "Salzburg", bezirke: ["Salzburg (Stadt)"], lat: 47.7985, lon: 13.0462, hoehe: 434, region: "salzburg" },
    { ort: "Seekirchen am Wallersee", bezirke: ["Salzburg-Umgebung"], lat: 47.8942, lon: 13.1261, hoehe: 511, region: null },
    { ort: "Hallein", bezirke: ["Hallein"], lat: 47.6822, lon: 13.095, hoehe: 452, region: "hallein" },
    { ort: "St. Johann im Pongau", bezirke: ["St. Johann im Pongau"], lat: 47.3478, lon: 13.2025, hoehe: 607, region: null },
    { ort: "Tamsweg", bezirke: ["Tamsweg"], lat: 47.1261, lon: 13.8104, hoehe: 1025, region: null },
    { ort: "Zell am See", bezirke: ["Zell am See"], lat: 47.3234, lon: 12.7982, hoehe: 765, region: "zell-am-see" },
    { ort: "Bischofshofen", bezirke: [], lat: 47.4172, lon: 13.2194, hoehe: 549, region: "bischofshofen" },
  ],
  steiermark: [
    { ort: "Graz", bezirke: ["Graz (Stadt)","Graz-Umgebung"], lat: 47.0712, lon: 15.438, hoehe: 365, region: "graz" },
    { ort: "Bruck an der Mur", bezirke: ["Bruck-Mürzzuschlag"], lat: 47.4122, lon: 15.2722, hoehe: 508, region: null },
    { ort: "Deutschlandsberg", bezirke: ["Deutschlandsberg"], lat: 46.8146, lon: 15.2138, hoehe: 372, region: null },
    { ort: "Hartberg", bezirke: ["Hartberg-Fürstenfeld"], lat: 47.2809, lon: 15.9693, hoehe: 364, region: "hartberg" },
    { ort: "Leibnitz", bezirke: ["Leibnitz"], lat: 46.7805, lon: 15.5407, hoehe: 275, region: null },
    { ort: "Leoben", bezirke: ["Leoben"], lat: 47.3805, lon: 15.0947, hoehe: 547, region: "leoben" },
    { ort: "Liezen", bezirke: ["Liezen"], lat: 47.5677, lon: 14.2421, hoehe: 662, region: null },
    { ort: "Murau", bezirke: ["Murau"], lat: 47.1123, lon: 14.1691, hoehe: 838, region: null },
    { ort: "Judenburg", bezirke: ["Murtal"], lat: 47.1694, lon: 14.6601, hoehe: 741, region: null },
    { ort: "Feldbach", bezirke: ["Südoststeiermark"], lat: 46.9528, lon: 15.8886, hoehe: 286, region: null },
    { ort: "Voitsberg", bezirke: ["Voitsberg"], lat: 47.0505, lon: 15.1475, hoehe: 403, region: null },
    { ort: "Weiz", bezirke: ["Weiz"], lat: 47.2173, lon: 15.6222, hoehe: 476, region: "weiz" },
    { ort: "Kapfenberg", bezirke: [], lat: 47.4405, lon: 15.2902, hoehe: 516, region: "kapfenberg" },
  ],
  tirol: [
    { ort: "Innsbruck", bezirke: ["Innsbruck (Stadt)","Innsbruck-Land"], lat: 47.2639, lon: 11.3948, hoehe: 584, region: "innsbruck" },
    { ort: "Imst", bezirke: ["Imst"], lat: 47.2382, lon: 10.7407, hoehe: 788, region: null },
    { ort: "Kitzbühel", bezirke: ["Kitzbühel"], lat: 47.4472, lon: 12.3906, hoehe: 755, region: "kitzbuehel" },
    { ort: "Kufstein", bezirke: ["Kufstein"], lat: 47.583, lon: 12.1708, hoehe: 496, region: "kufstein" },
    { ort: "Landeck", bezirke: ["Landeck"], lat: 47.1424, lon: 10.5705, hoehe: 806, region: null },
    { ort: "Lienz", bezirke: ["Lienz"], lat: 46.8293, lon: 12.7688, hoehe: 679, region: "lienz" },
    { ort: "Reutte", bezirke: ["Reutte"], lat: 47.4891, lon: 10.7188, hoehe: 856, region: null },
    { ort: "Schwaz", bezirke: ["Schwaz"], lat: 47.345, lon: 11.7084, hoehe: 545, region: null },
    { ort: "Wörgl", bezirke: [], lat: 47.4873, lon: 12.0638, hoehe: 511, region: "woergl" },
  ],
  vorarlberg: [
    { ort: "Bregenz", bezirke: ["Bregenz"], lat: 47.5046, lon: 9.7463, hoehe: 398, region: "bregenz" },
    { ort: "Bludenz", bezirke: ["Bludenz"], lat: 47.153, lon: 9.8219, hoehe: 566, region: null },
    { ort: "Dornbirn", bezirke: ["Dornbirn"], lat: 47.4137, lon: 9.7437, hoehe: 441, region: "dornbirn" },
    { ort: "Feldkirch", bezirke: ["Feldkirch"], lat: 47.2378, lon: 9.5985, hoehe: 464, region: "feldkirch" },
  ],
  wien: [
    { ort: "Innere Stadt", bezirke: ["1. Bezirk"], lat: 48.21, lon: 16.3697, hoehe: 193, region: null },
    { ort: "Leopoldstadt", bezirke: ["2. Bezirk"], lat: 48.2006, lon: 16.4269, hoehe: 168, region: null },
    { ort: "Landstraße", bezirke: ["3. Bezirk"], lat: 48.1942, lon: 16.3956, hoehe: 179, region: null },
    { ort: "Wieden", bezirke: ["4. Bezirk"], lat: 48.1923, lon: 16.3714, hoehe: 189, region: null },
    { ort: "Margareten", bezirke: ["5. Bezirk"], lat: 48.1881, lon: 16.3534, hoehe: 186, region: null },
    { ort: "Mariahilf", bezirke: ["6. Bezirk"], lat: 48.1955, lon: 16.347, hoehe: 200, region: null },
    { ort: "Neubau", bezirke: ["7. Bezirk"], lat: 48.2023, lon: 16.3491, hoehe: 214, region: null },
    { ort: "Josefstadt", bezirke: ["8. Bezirk"], lat: 48.2109, lon: 16.3474, hoehe: 210, region: null },
    { ort: "Alsergrund", bezirke: ["9. Bezirk"], lat: 48.2218, lon: 16.3593, hoehe: 172, region: null },
    { ort: "Favoriten", bezirke: ["10. Bezirk"], lat: 48.153, lon: 16.3828, hoehe: 209, region: null },
    { ort: "Simmering", bezirke: ["11. Bezirk"], lat: 48.1631, lon: 16.458, hoehe: 157, region: null },
    { ort: "Meidling", bezirke: ["12. Bezirk"], lat: 48.172, lon: 16.3287, hoehe: 224, region: null },
    { ort: "Hietzing", bezirke: ["13. Bezirk"], lat: 48.1785, lon: 16.253, hoehe: 342, region: null },
    { ort: "Penzing", bezirke: ["14. Bezirk"], lat: 48.2257, lon: 16.2228, hoehe: 364, region: null },
    { ort: "Rudolfsheim-Fünfhaus", bezirke: ["15. Bezirk"], lat: 48.1955, lon: 16.3263, hoehe: 224, region: null },
    { ort: "Ottakring", bezirke: ["16. Bezirk"], lat: 48.215, lon: 16.3021, hoehe: 238, region: null },
    { ort: "Hernals", bezirke: ["17. Bezirk"], lat: 48.2353, lon: 16.2841, hoehe: 310, region: null },
    { ort: "Währing", bezirke: ["18. Bezirk"], lat: 48.2341, lon: 16.3216, hoehe: 245, region: null },
    { ort: "Döbling", bezirke: ["19. Bezirk"], lat: 48.2613, lon: 16.3285, hoehe: 321, region: null },
    { ort: "Brigittenau", bezirke: ["20. Bezirk"], lat: 48.2438, lon: 16.3781, hoehe: 166, region: null },
    { ort: "Floridsdorf", bezirke: ["21. Bezirk"], lat: 48.2798, lon: 16.4121, hoehe: 165, region: null },
    { ort: "Donaustadt", bezirke: ["22. Bezirk"], lat: 48.2144, lon: 16.4861, hoehe: 158, region: null },
    { ort: "Liesing", bezirke: ["23. Bezirk"], lat: 48.1411, lon: 16.2939, hoehe: 215, region: null },
  ],
};
