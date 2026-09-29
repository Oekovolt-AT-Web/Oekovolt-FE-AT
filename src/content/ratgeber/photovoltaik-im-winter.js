// Ratgeber: Photovoltaik im Winter – Österreich, Alpenraum, Schnee und Kälte
// Ertragsdaten: EU JRC PVGIS 5.3 (PVGIS-SARAH3, 2005–2023), 1 kWp, 14 % Systemverluste,
// Horizont aus Geländemodell, API-Abfrage vom 28.09.2026. PVGIS berücksichtigt KEINE Schneebedeckung.
// Schneelastwerte: eHORA (ÖNORM B 1991-1-3:2022), abgelesene Beispielwerte für Ortszentren.

const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

// Monatserträge kWh/kWp bei optimaler Neigung (PVGIS)
const MONAT = {
  Linz: [47.1, 72.1, 104.8, 123.7, 125.3, 129.4, 133.3, 125.5, 108.1, 84.8, 48.3, 40.3],
  Innsbruck: [80.3, 108.0, 140.2, 139.9, 127.7, 130.3, 134.7, 130.9, 120.7, 111.8, 75.5, 68.9],
  Graz: [71.0, 82.7, 113.9, 121.8, 123.3, 125.7, 133.5, 127.0, 110.8, 95.6, 61.7, 59.4],
  Lech: [32.3, 58.7, 113.1, 135.6, 125.5, 121.4, 117.9, 112.3, 99.6, 85.0, 45.1, 21.8],
};

// Winter Nov–Feb: optimal geneigt vs. Südfassade 90° (PVGIS), kWh/kWp
// [Ort, Jahr optimal, Nov–Feb optimal, Jahr Fassade, Nov–Feb Fassade]
const WINTER = [
  ["Wien", 1176, 213, 822, 214],
  ["Linz", 1143, 208, 801, 208],
  ["Salzburg", 1074, 189, 743, 180],
  ["Innsbruck", 1369, 333, 1006, 333],
  ["Bregenz", 1140, 231, 802, 231],
  ["Klagenfurt", 1252, 271, 885, 271],
  ["Graz", 1226, 275, 881, 278],
  ["Kitzbühel", 1123, 240, 799, 231],
  ["Lech", 1068, 158, 722, 146],
];

const pct = (a, b) => String(Math.round((a / b) * 1000) / 10).replace(".", ",") + " %";
const r0 = (x) => Math.round(x).toLocaleString("de-DE");

const artikel = {
  slug: "photovoltaik-im-winter",
  title: "Photovoltaik im Winter: Ertrag, Schnee und Kälte in Österreich",
  seoTitle: "Photovoltaik im Winter: Ertrag & Schnee | Ökovolt",
  kurzTitel: "Photovoltaik im Winter",
  description:
    "Photovoltaik im Winter in Österreich: PVGIS-Monatswerte von Linz bis Lech, warum Kälte hilft, Schnee bremst und eine Südfassade so viel liefert wie das Dach.",
  excerpt:
    "Von November bis Februar liefert eine PV-Anlage in Linz rund 18 % ihres Jahresertrags, in Innsbruck 24 %. Was Kälte, Schnee und Nebel ausmachen – und wie Sie im Alpenraum für den Winter planen.",
  hauptKeyword: "photovoltaik im winter",
  keywords: [
    "Photovoltaik im Winter",
    "PV Ertrag Winter Österreich",
    "Photovoltaik Schnee",
    "Solaranlage Winter Ertrag Dezember",
    "Photovoltaik Kälte Wirkungsgrad",
    "Fassaden-PV Winter",
    "Photovoltaik alpin",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/photovoltaik-im-winter.jpg",
  bildAlt: "Aufgeständerte Photovoltaik-Modulreihen an einem verschneiten Hang in den österreichischen Alpen unter blauem Himmel",
  badge: { wert: "24 %", text: "des Jahresertrags von Nov. bis Feb. in Innsbruck" },

  kurzFazit: [
    "**Eine PV-Anlage erzeugt in Österreich auch im Winter Strom – von November bis Februar je nach Standort rund 15 bis 24 % des Jahresertrags.** In Linz sind es laut PVGIS 208 kWh je kWp, in Innsbruck 333 kWh.",
    "Der Dezember ist der schwächste Monat: In Linz liefert ein optimal geneigtes Modul etwa **40 kWh/kWp** – knapp ein Drittel des Juli. Inneralpine Lagen und der Süden (Graz, Klagenfurt) schneiden im Winter deutlich besser ab als Donauraum und Alpenvorland.",
    "**Kälte steigert den Wirkungsgrad**: Pro Grad unter 25 °C Zelltemperatur leisten moderne Module etwa 0,3 % mehr. Schnee dagegen stoppt die Produktion, bis er abrutscht – PVGIS rechnet diese Verluste nicht ein.",
    "**Eine Südfassade liefert von November bis Februar praktisch gleich viel wie ein optimal geneigtes Dachmodul** – und bleibt schneefrei. Für Winterstrom und alpine Gebäude ist senkrechte PV deshalb eine ernsthafte Option.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie viel Strom erzeugt eine PV-Anlage im Winter?",
      tocLabel: "Winterertrag",
      bloecke: [
        {
          typ: "p",
          text: "**Im österreichischen Winter erzeugt eine Photovoltaikanlage deutlich weniger als im Sommer, aber keineswegs nichts: Zwischen November und Februar kommen je nach Standort 150 bis über 330 kWh pro kWp zusammen.** Die Zahlen stammen aus PVGIS, dem Photovoltaik-Informationssystem der EU-Kommission, für optimal geneigte, nach Süden ausgerichtete Module mit 14 % Systemverlusten. Eine 100-kWp-Hallenanlage in Linz liefert damit in den vier Wintermonaten rund 20.800 kWh, in Graz rund 27.500 kWh.",
        },
        {
          typ: "tabelle",
          caption: "Monatsertrag in kWh je kWp bei optimaler Neigung, Süd (PVGIS 5.3, Mittel 2005–2023)",
          kopf: ["Monat", "Linz", "Graz", "Innsbruck", "Lech (1.447 m)"],
          zeilen: MONATE.map((m, i) => [m, r0(MONAT.Linz[i]), r0(MONAT.Graz[i]), r0(MONAT.Innsbruck[i]), r0(MONAT.Lech[i])]),
          markierteZeile: 11,
          fussnote: "Quelle: EU JRC, PVGIS 5.3 (Strahlungsdatenbank SARAH3), eigene API-Abfrage vom 28.09.2026 für die Ortszentren, 1 kWp kristallin, 14 % Systemverluste, Geländehorizont berücksichtigt. Ohne Verluste durch Schneebedeckung. Satellitendaten haben in Gebirgstälern eine höhere Unsicherheit.",
        },
        {
          typ: "p",
          text: "Die Unterschiede sind größer, als viele erwarten: In Linz ist der Juli 3,3-mal so ertragreich wie der Dezember, in Innsbruck nur 2-mal. Der Grund liegt im Winterwetter. Donauraum, Alpenvorland und Salzburger Becken liegen oft tagelang unter Hochnebel, während inneralpine Lagen und der Süden mehr Sonnenstunden haben. Lech zeigt das Gegenbeispiel: Die Talsohle liegt im Dezember lange im Bergschatten, der Ertrag bricht auf 22 kWh/kWp ein. Die vollständigen Jahreswerte aller Landeshauptstädte finden Sie im Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
      ],
    },
    {
      id: "kaelte",
      titel: "Warum Kälte gut für Solarmodule ist",
      tocLabel: "Kälte & Wirkungsgrad",
      bloecke: [
        {
          typ: "p",
          text: "**Solarzellen arbeiten bei niedrigen Temperaturen effizienter: Die Leistung steigt pro Kelvin unter 25 °C Zelltemperatur um den Betrag des Temperaturkoeffizienten, bei modernen TOPCon- und Heterojunction-Modulen etwa 0,26 bis 0,32 % pro Kelvin.** An einem klaren Jännertag mit −5 °C Zelltemperatur leistet ein Modul damit rund 8 bis 10 % mehr als unter Standard-Testbedingungen. Im Sommer ist es umgekehrt: Bei 65 °C auf dem Blechdach verliert es 10 bis 13 %.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Planungsfehler: Spannung bei Frost",
          text: "Mit der Kälte steigt auch die Leerlaufspannung der Module. Bei der Stringplanung muss die niedrigste zu erwartende Modultemperatur angesetzt werden – im Flachland meist −10 bis −15 °C, in alpinen Lagen −20 °C und darunter. Überschreitet die Stringspannung an einem sonnigen Frostmorgen die maximale Eingangsspannung des Wechselrichters oder die Systemspannung von 1.000 bzw. 1.500 V, drohen Abschaltungen oder Schäden. Mehr dazu im Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik).",
        },
        {
          typ: "p",
          text: "Wie stark ein Modul von Kälte profitiert und wie gut es Hitze verträgt, lesen Sie am Temperaturkoeffizienten im Datenblatt ab. Die Unterschiede zwischen [TOPCon](/wissen/lexikon#topcon), [Heterojunction](/wissen/lexikon#heterojunction) und älteren PERC-Modulen vergleicht der Ratgeber [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich).",
        },
      ],
    },
    {
      id: "schnee",
      titel: "Schnee auf den Modulen: Was er kostet und was er bringt",
      tocLabel: "Schnee",
      bloecke: [
        {
          typ: "p",
          text: "**Eine geschlossene Schneedecke auf den Modulen stoppt die Stromerzeugung fast vollständig – wie lange, hängt vor allem von der Neigung und der Rahmenkonstruktion ab.** Auf Dächern ab etwa 30° rutscht Schnee nach dem ersten sonnigen Tag meist ab, weil sich die dunklen Module erwärmen. Auf flachen Hallendächern mit 10–15° Aufständerung bleibt er dagegen oft wochenlang liegen.",
        },
        {
          typ: "tabelle",
          caption: "Schnee und Ertrag: typische Situationen",
          kopf: ["Situation", "Wirkung", "Was hilft"],
          zeilen: [
            ["Steildach ab ca. 30°", "Schnee gleitet meist nach 1–3 Sonnentagen ab", "Schneefang über Wegen, freie Traufe ohne Hindernis"],
            ["Flachdach, 10–15° Aufständerung", "Bedeckung oft wochenlang, Schneesäcke zwischen den Reihen", "größerer Reihenabstand, steilere Aufständerung, Monitoring"],
            ["Ost-West-System, sehr flach", "Schnee bleibt am längsten liegen", "im Alpenraum nur mit Statik und Ertragsabschlag planen"],
            ["Fassade und Geländer (90°)", "praktisch schneefrei, zusätzlich Reflexion vom Schnee", "Südfassade, bifaziale Module bei Vordächern"],
            ["Freifläche mit hoher Unterkante", "Schnee rutscht ab, sammelt sich aber an der Unterkante", "Modulunterkante über der üblichen Schneehöhe planen"],
          ],
          fussnote: "Qualitative Erfahrungswerte; der Ertragsverlust durch Schnee hängt von Schneehäufigkeit, Neigung, Temperatur und Sonnenstunden nach dem Schneefall ab. PVGIS-Werte enthalten diese Verluste nicht.",
        },
        {
          typ: "p",
          text: "Schnee hat auch einen Vorteil: Frischer Schnee reflektiert einen Großteil des Sonnenlichts (hohe Albedo). Davon profitieren senkrechte Fassadenmodule und [bifaziale Module](/wissen/lexikon#bifazial), die auch auf der Rückseite Licht aufnehmen. Auf Freiflächen im Hochgebirge kann dieser Effekt den Winterertrag deutlich anheben – ein Grund, warum alpine Solaranlagen besonders für Winterstrom diskutiert werden.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Räumen – ja oder nein?",
          text: "Bei Anlagen auf Gebäuden gilt: nur räumen, wenn die Statik es verlangt oder der Schnee eine Gefahr darstellt – und nur mit weichen Schiebern oder Besen, nie mit Metallschaufeln, Streusalz oder heißem Wasser. Der Mehrertrag ist klein, das Risiko für Glas, Rahmen und Menschen auf dem Dach groß. Welche Lasten Dach und Module aushalten, zeigt der Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
        },
      ],
    },
    {
      id: "fassade",
      titel: "Fassaden-PV: Im Winter so stark wie das Dach",
      tocLabel: "Fassade im Winter",
      bloecke: [
        {
          typ: "p",
          text: "**Senkrecht montierte Module an einer Südfassade liefern übers Jahr rund 68 bis 74 % des Ertrags einer optimal geneigten Anlage – von November bis Februar aber praktisch genauso viel.** Die tief stehende Wintersonne trifft fast senkrecht auf die Fassade, und Schnee bleibt nicht liegen. Das zeigen die PVGIS-Werte für alle Landeshauptstädte.",
        },
        {
          typ: "tabelle",
          caption: "Winterertrag November bis Februar: optimal geneigt vs. Südfassade 90°, kWh je kWp (PVGIS 5.3)",
          kopf: ["Ort", "Jahr optimal", "Nov–Feb optimal", "Anteil", "Jahr Fassade", "Nov–Feb Fassade", "Anteil"],
          zeilen: WINTER.map(([ort, jOpt, wOpt, jV, wV]) => [ort, r0(jOpt), r0(wOpt), pct(wOpt, jOpt), r0(jV), r0(wV), pct(wV, jV)]),
          hervorheben: 5,
          minBreite: 720,
          fussnote: "Quelle: EU JRC, PVGIS 5.3, API-Abfrage 28.09.2026; Fassade = Neigung 90°, Azimut Süd. Ohne Schneeverluste – die schneebedeckte Dachanlage liegt real darunter, die Fassade kaum.",
        },
        {
          typ: "p",
          text: "Für Gebäude mit hohem Winterverbrauch – Hotels, Seilbahnstationen, Gewerbebetriebe mit Wärmepumpe – ist die Fassade deshalb mehr als ein Architekturelement. Sie glättet das Erzeugungsprofil und verringert Mittagsspitzen im Sommer. Gebäudeintegrierte Lösungen, Normen und Förderzuschläge behandelt der Ratgeber [Fassade und BIPV](/ratgeber/photovoltaik-fassade-bipv).",
        },
      ],
    },
    {
      id: "alpin",
      titel: "Alpine Standorte: Mehr Sonne über dem Nebel, mehr Last auf dem Dach",
      tocLabel: "Alpin",
      bloecke: [
        {
          typ: "p",
          text: "**In höheren Lagen scheint im Winter oft die Sonne, während Täler und Flachland unter Hochnebel liegen – dafür werden Schnee, Frost und Horizontverschattung zu Planungsthemen.** Wer in Kitzbühel, im Pongau oder am Arlberg plant, muss Ertrag und Tragwerk gemeinsam betrachten.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Horizont prüfen", text: "Berge verschatten Täler im Winter oft stundenlang. PVGIS berücksichtigt den Horizont aus dem Geländemodell; für Detailplanungen hilft ein Horizontfoto vom Dach. Mehr im Ratgeber [Verschattung](/ratgeber/photovoltaik-verschattung)." },
            { titel: "Schneelast zuerst", text: "Für das Ortszentrum von Kitzbühel zeigt eHORA eine charakteristische Schneelast von 4,2 kN/m², für Lech 10,3 kN/m² (Beispielwerte). Standardmodule stoßen hier an ihre Grenzen – Statik und Modulauswahl gehören an den Anfang." },
            { titel: "Kälte und Spannung", text: "Tiefe Temperaturen erhöhen die Modulspannung. Strings werden im Hochgebirge kürzer ausgelegt; Kabel, Stecker und Wechselrichter müssen für Frost und Kondensat geeignet sein." },
            { titel: "Zugänglichkeit", text: "Wartung, Eisabgang und Rettungswege im Winter mitdenken: Schneefänge über Eingängen, Fernüberwachung der Anlage und ein Serviceplan, der auch im Jänner funktioniert." },
          ],
        },
        {
          typ: "p",
          text: "Für Chalets und Premiumobjekte planen wir Indach-Lösungen mit abgestimmter Unterkonstruktion und Wartung – siehe [Photovoltaik für Chalets](/chalets). Welche Schneelast, Windgeschwindigkeit und Hagelgefahr an Ihrer Adresse gilt, zeigt der [Standort-Check](/standort-check), der eHORA direkt am Standort öffnet.",
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Winterstrom im Betrieb: Eigenverbrauch, Speicher und Wärmepumpe",
      tocLabel: "Gewerbe & Winter",
      bloecke: [
        {
          typ: "p",
          text: "**Im Winter wird praktisch jede erzeugte Kilowattstunde im Betrieb selbst verbraucht – die Frage ist nicht der Überschuss, sondern die Lücke.** Eine 100-kWp-Anlage in Linz liefert im Dezember rund 4.000 kWh; ein Produktionsbetrieb mit 400 MWh Jahresverbrauch benötigt im selben Monat 30.000 kWh und mehr. Der Winter entscheidet deshalb selten über die Anlagengröße, wohl aber über die Erwartungen an Autarkie.",
        },
        {
          typ: "liste",
          punkte: [
            "**Wärmepumpen** verschieben den Strombedarf in den Winter. Die PV-Anlage deckt davon vor allem in der Übergangszeit einen relevanten Teil – Details im Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
            "**Speicher** helfen im Winter weniger als im Sommer, weil kaum Überschüsse entstehen. Für Lastspitzen und Leistungspreis können sie trotzdem sinnvoll sein – siehe [Peak Shaving](/ratgeber/peak-shaving-leistungspreis).",
            "**Energiegemeinschaften** gleichen aus: Im Sommer geben Betriebe Überschüsse an Mitglieder ab, im Winter beziehen sie Strom etwa aus Wasserkraft oder Wind in der Gemeinschaft – siehe [Energiegemeinschaften](/energiegemeinschaften).",
            "**Ausrichtung** beeinflusst den Winteranteil: Steilere Süd-Module und Fassaden verschieben Ertrag in den Winter, flache Ost-West-Systeme in den Sommer.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Checkliste: Die PV-Anlage winterfest planen",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Winterertrag realistisch ansetzen: PVGIS-Monatswerte plus Abschlag für Schneebedeckung auf flachen Flächen.",
            "Schneelast und Windlast für die Adresse aus eHORA erheben, Statik für Dach und Unterkonstruktion beauftragen.",
            "Module mit ausreichender Designlast und geprüfter Schneeabgleitlast wählen; Klemmbereiche laut Herstellerfreigabe.",
            "Stringauslegung mit minimaler Modultemperatur des Standorts rechnen (Frostspannung).",
            "Traufe und Wege absichern: Schneefang, Eisabgang, sichere Zugänge für Wartung.",
            "Monitoring nutzen: Schneebedeckung, Stringausfälle und Frostschäden fallen im Winter nur mit Fernüberwachung rasch auf – siehe [Fernwartung](/technik/fernwartung).",
            "Nach dem Winter prüfen: Rahmen, Klemmen, Glas und Kabelführung auf Schnee- und Eisschäden kontrollieren, etwa im Rahmen eines [Wartungsvertrags](/service/wartung).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Lohnt sich Photovoltaik im Winter überhaupt?",
      a: "Ja, aber der Winter ist nicht der Grund für die Investition. Von November bis Februar erzeugt eine Anlage in Österreich rund 15 bis 24 % ihres Jahresertrags. Wirtschaftlich zählt die Jahresbilanz – und im Winter wird fast alles selbst verbraucht.",
    },
    {
      q: "Wie viel Strom produziert eine PV-Anlage im Dezember?",
      a: "Laut PVGIS bei optimaler Neigung rund 40 kWh je kWp in Linz, 43 kWh in Wien, 59 kWh in Graz und 69 kWh in Innsbruck. Eine 10-kWp-Anlage in Linz liefert im Dezember also etwa 400 kWh – ohne Schneebedeckung gerechnet.",
    },
    {
      q: "Produziert eine PV-Anlage bei Nebel oder bewölktem Himmel Strom?",
      a: "Ja, aber deutlich weniger, weil nur diffuses Licht ankommt. Deshalb schneidet der hochnebelreiche Donauraum im Winter schwächer ab als inneralpine Lagen oder die Steiermark und Kärnten – in den PVGIS-Werten gut sichtbar.",
    },
    {
      q: "Schadet Kälte den Solarmodulen?",
      a: "Nein, Kälte erhöht sogar den Wirkungsgrad. Problematisch sind die höhere Spannung bei Frost, die bei der Stringplanung berücksichtigt werden muss, und mechanische Lasten durch Schnee und Eis.",
    },
    {
      q: "Soll ich Schnee von den Modulen entfernen?",
      a: "In der Regel nicht. Der Mehrertrag ist gering und das Risiko, Glas oder Rahmen zu beschädigen oder vom Dach zu stürzen, hoch. Räumen Sie nur, wenn die Statik es erfordert, und dann mit weichem Werkzeug.",
    },
    {
      q: "Erkennt man Schnee auf der Anlage im Monitoring?",
      a: "Ja. Liegt Schnee auf den Modulen, fällt die Leistung an sonnigen Tagen auf nahezu null, während vergleichbare Anlagen oder Einstrahlungssensoren Werte liefern. Ein gutes Monitoring unterscheidet so zwischen Schneebedeckung und technischem Fehler – wichtig bei Gewerbeanlagen mit Ertragsgarantien oder Wartungsverträgen.",
    },
    {
      q: "Welche Ausrichtung ist für Winterstrom am besten?",
      a: "Steile Südflächen und Südfassaden. Eine 90°-Fassade liefert von November bis Februar laut PVGIS praktisch so viel wie ein optimal geneigtes Modul und bleibt dabei schneefrei. Flache Ost-West-Anlagen liefern im Winter am wenigsten.",
    },
  ],

  passend: [
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast und Photovoltaik", text: "ÖNORM B 1991-1-3, eHORA, Modul-Prüflasten." },
    { href: "/chalets", titel: "PV für Chalets & alpin", text: "Indach, Schneelast, Concierge-Wartung." },
    { href: "/ratgeber/photovoltaik-ertrag-pro-kwp", titel: "Ertrag pro kWp", text: "PVGIS-Werte aller Landeshauptstädte." },
    { href: "/standort-check", titel: "Standort-Check", text: "Schnee, Wind, Hagel und Ertrag für Ihre Adresse." },
  ],

  quellen: [
    { titel: "EU JRC – PVGIS 5.3 Photovoltaic Geographical Information System (API-Abfragen)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "HORA – Schneelastkarte gemäß ÖNORM B 1991-1-3:2022", url: "https://hora.gv.at/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
    { titel: "Holzbau Austria – Neue Schneelastnorm veröffentlicht", url: "https://www.holzbauaustria.at/technik/2022/07/neue-schneelastnorm-veroeffentlicht.html", stand: "09/2026" },
    { titel: "GeoSphere Austria – Klima und Sonnenscheindauer in Österreich", url: "https://www.geosphere.at/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Winterertrag am Standort?", text: "Ertrag, Schneelast und Horizont für Ihre Adresse.", href: "/standort-check", label: "Standort prüfen" },
  cta: {
    title: "Photovoltaik, die auch im Winter funktioniert.",
    text: "Wir planen Ausrichtung, Statik und Stringauslegung passend zu Schnee, Frost und Winterverbrauch – vom Gewerbedach im Flachland bis zum Chalet in den Bergen.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Standort-Check", href: "/standort-check" },
  },
};

export default artikel;
