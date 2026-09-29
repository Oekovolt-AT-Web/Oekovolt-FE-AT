// Ratgeber: Schneelast und Photovoltaik in Österreich
// Schneelastwerte: HORA-Standortabfragen (ÖNORM B 1991-1-3:2022-05-15), abgerufen 28.09.2026.
// Alte Zonenformel: ÖNORM B 1991-1-3 (Ausgaben 2006/2018) – nur historische Einordnung (Bestandsstatiken).
// Rechenweg vereinfacht: s = µ1 · Ce · Ct · sk mit µ1 = 0,8, Ce = Ct = 1; Normalanteil auf die
// Modulebene = s · cos²α; Bemessungswert mit Teilsicherheitsbeiwert 1,5.

const kn = (x) => x.toFixed(1).replace(".", ",");
const pa = (x) => Math.round(x).toLocaleString("de-DE");
const alteFormel = (z, a) => (0.642 * z + 0.009) * (1 + (a / 728) ** 2);
const normal = (sk, grad) => 0.8 * sk * Math.cos((grad * Math.PI) / 180) ** 2 * 1000; // Pa, charakteristisch

// HORA-Werte (sk = 50-jährliches Ereignis) für Ortszentren, Seehöhe laut HORA
const ORTE = [
  { ort: "Linz", hoehe: 261, sk: 0.6 },
  { ort: "Salzburg (Stadt)", hoehe: 430, sk: 1.6 },
  { ort: "Innsbruck", hoehe: 576, sk: 1.7 },
  { ort: "Kitzbühel", hoehe: 747, sk: 4.2 },
  { ort: "Lech am Arlberg", hoehe: 1439, sk: 10.3 },
];

const WEITERE = [
  ["Wien (Innere Stadt)", 172, 0.7],
  ["Graz", 350, 1.0],
  ["Klagenfurt", 444, 1.5],
  ["Villach", 494, 1.8],
  ["Zell am See", 767, 3.9],
  ["Schladming", 731, 4.6],
  ["Mariazell", 867, 7.1],
  ["Saalbach", 997, 6.1],
  ["Bad Gastein", 1013, 3.2],
  ["Seefeld in Tirol", 1178, 5.5],
  ["St. Anton am Arlberg", 1302, 6.3],
  ["Obertauern", 1760, 10.9],
];

const artikel = {
  slug: "schneelast-photovoltaik",
  title: "Schneelast und Photovoltaik: ÖNORM B 1991-1-3, eHORA, Module",
  seoTitle: "Schneelast Photovoltaik: ÖNORM & eHORA | Ökovolt",
  kurzTitel: "Schneelast & Photovoltaik",
  description:
    "Schneelast für PV-Anlagen in Österreich: ÖNORM B 1991-1-3:2022, Werte aus eHORA, Rechenbeispiele Linz bis Lech, Modul-Prüflasten 5.400 Pa und alpine Planung.",
  excerpt:
    "Von 0,6 kN/m² in Linz bis 10,3 kN/m² in Lech: Wie Sie die Schneelast für Ihren Standort ermitteln, was sie für Dach, Unterkonstruktion und Module bedeutet – mit Rechenbeispielen.",
  hauptKeyword: "schneelast photovoltaik",
  keywords: [
    "Schneelast Photovoltaik",
    "Schneelastzone Österreich",
    "ÖNORM B 1991-1-3",
    "eHORA Schneelast",
    "Schneelast PV-Module 5400 Pa",
    "Photovoltaik alpin Schnee",
    "Schneelast Dach berechnen",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/schneelast-photovoltaik.jpg",
  bildAlt: "Aufgeständerte Photovoltaik-Modulreihen auf einem Flachdach, vollständig mit Schnee bedeckt",
  badge: { wert: "10,3 kN/m²", text: "charakteristische Schneelast in Lech (1.439 m)" },

  kurzFazit: [
    "**Die Schneelast für eine PV-Anlage in Österreich richtet sich nach der ÖNORM B 1991-1-3:2022, deren Werte für jeden Standort in einem 50-×-50-m-Raster über [eHORA](https://hora.gv.at) abrufbar sind.** Schneelastzonen mit Seehöhenformel gibt es seither nicht mehr – sie tauchen nur noch in Bestandsstatiken auf.",
    "Die charakteristische Bodenschneelast reicht von **0,6 kN/m² in Linz** über 1,6 kN/m² in Salzburg und 4,2 kN/m² in Kitzbühel bis **10,3 kN/m² in Lech** – das sind rund 60 bis über 1.000 kg pro Quadratmeter.",
    "Auf dem Dach wirkt davon meist **80 %** (Formbeiwert µ₁ = 0,8). Eine übliche Modul-Prüflast von **5.400 Pa** entspricht nur **3.600 Pa Designlast** – in Kitzbühel ist das auf einem 30°-Dach bereits knapp, in Lech deutlich zu wenig.",
    "Entscheidend sind drei Nachweise: **Dachtragwerk**, **Unterkonstruktion** samt Befestigung und **Modul** (Designlast, Klemmbereiche, Schneeabgleitlast an der Traufe). Ohne Statik kein PV-Projekt im Alpenraum.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Welche Schneelast gilt für meine PV-Anlage?",
      tocLabel: "Welche Schneelast gilt?",
      bloecke: [
        {
          typ: "p",
          text: "**Maßgeblich ist die charakteristische Schneelast am Boden sₖ nach ÖNORM B 1991-1-3:2022-05-15 – ein 50-jährliches Ereignis, das Sie adressgenau über HORA (hora.gv.at) abfragen.** Daraus berechnet der Tragwerksplaner die Schneelast auf dem Dach, die das Gebäude, die Unterkonstruktion und die Module tragen müssen. Wer eine Photovoltaikanlage plant, braucht diesen Wert ganz am Anfang – nicht erst bei der Montage.",
        },
        {
          typ: "p",
          text: "Seit der Neuausgabe 2022 gibt es in Österreich keine klassischen [Schneelastzonen](/wissen/lexikon#schneelastzone) mehr. An ihre Stelle trat eine Schneelastkarte mit einem Raster von 50 × 50 m, erstellt im Projekt „Schneelast.Reform“ auf Basis von rund 900 Messstationen und 30 Jahren Daten. Die Karte gilt bis 2.000 m Seehöhe; die Vorgängernorm war nur bis 1.500 m anwendbar. Holzbau Austria fasst den Effekt mit „im Schnitt 80 Kilo weniger“ zusammen: Die alte Zonenformel lag in vielen Lagen zu hoch. In einzelnen schneereichen Staulagen liefert die neue Karte allerdings auch höhere Werte – maßgeblich ist immer der abgelesene Wert für die konkrete Adresse.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Was HORA liefert",
          text: "Die [eHORA-Abfrage](/wissen/lexikon#ehora) zeigt pro Standort die Seehöhe, sₖ (50-jährlich) sowie die Werte für ein 25- und ein 100-jährliches Ereignis (s₂₅, s₁₀₀). Für Planungsunterlagen können Sie eine „Normen-Standortabfrage“ als PDF herunterladen. Im Zweifel gelten laut HORA die Werte der Druckversion der ÖNORM. Über 2.000 m Seehöhe gibt es keine normativen Werte – dort ist ein Gutachten nötig, etwa über GeoSphere Austria.",
        },
        {
          typ: "tool",
          href: "/standort-check",
          titel: "Schneelast, Wind und Hagel für Ihre Adresse",
          text: "Unser Standort-Check bündelt die HORA-Werte zu Schneelast, Basiswindgeschwindigkeit und Hagelgefährdung mit dem PV-Ertrag – als Grundlage für das Gespräch mit Statik und Planung.",
          label: "Standort prüfen",
        },
      ],
    },
    {
      id: "formel",
      titel: "Von der Bodenschneelast zur Dachschneelast: die Formel",
      tocLabel: "Formel & Beiwerte",
      bloecke: [
        {
          typ: "p",
          text: "**Die Schneelast auf dem Dach ergibt sich aus s = µᵢ · Cₑ · Cₜ · sₖ.** µᵢ ist der Formbeiwert, der von Dachform und Dachneigung abhängt, Cₑ der Umgebungskoeffizient (Wind, Lage) und Cₜ der Temperaturkoeffizient (Wärmeverlust durch das Dach). In der Praxis werden Cₑ und Cₜ in Österreich meist mit 1,0 angesetzt; Abminderungen darf nur die Statik begründen.",
        },
        {
          typ: "tabelle",
          caption: "Formbeiwert µ₁ für Pult- und Satteldächer nach ÖNORM EN 1991-1-3 (vereinfachte Darstellung)",
          kopf: ["Dachneigung α", "µ₁", "Bedeutung für PV"],
          zeilen: [
            ["0° bis 30°", "0,8", "Flach- und Hallendächer, übliche Steildächer – volle Last"],
            ["30° bis 60°", "0,8 · (60 − α) / 30", "Schnee kann abgleiten, Last sinkt linear"],
            ["ab 60°", "0", "praktisch kein Schnee – Fassade, sehr steile Dächer"],
            ["Schneefang, Attika, Module mit Randaufkantung", "mindestens 0,8", "Abgleiten verhindert – keine Abminderung erlaubt"],
          ],
          fussnote: "Zusätzlich sind Verwehungen (Schneesäcke) an Höhensprüngen, Attiken und hinter aufgeständerten Modulreihen zu untersuchen. Keine Statik – die Bemessung erfolgt durch befugte Tragwerksplaner.",
        },
        {
          typ: "p",
          text: "Für PV-Module zählt nicht nur die Last pro Quadratmeter Grundriss, sondern der Anteil, der senkrecht auf die Glasfläche drückt. Bei einer Neigung α beträgt er vereinfacht **s · cos²α**. Hinzu kommt der Teilsicherheitsbeiwert von 1,5 für veränderliche Einwirkungen nach ÖNORM EN 1990 – erst dieser Bemessungswert wird mit der zulässigen Last von Modul und Klemme verglichen.",
        },
        { typ: "h3", text: "Historische Einordnung: die alte Zonenformel (bis 2022)" },
        {
          typ: "p",
          text: "Für Neuplanungen spielt sie keine Rolle mehr. Viele Bestandsstatiken, etwa von Hallen aus den 2000er- und 2010er-Jahren, wurden aber noch mit der Zonenformel der ÖNORM B 1991-1-3 (Ausgaben 2006 bis 2018) gerechnet: **sₖ = (0,642 · Z + 0,009) · [1 + (A / 728)²]**, mit der Seehöhe A in Metern und dem Zonenwert Z (Zone 2* = 1,6; Zone 2 = 2; Zone 3 = 3; Zone 4 = 4,5). Wer eine PV-Anlage auf ein solches Dach setzt, sollte wissen, mit welchem Wert das Tragwerk damals bemessen wurde.",
        },
        {
          typ: "tabelle",
          caption: "Historisch: sₖ in kN/m² nach der alten Zonenformel (ÖNORM B 1991-1-3, Ausgaben bis 2018) – nur zur Einordnung von Bestandsstatiken",
          kopf: ["Seehöhe", "Zone 2* (Z = 1,6)", "Zone 2 (Z = 2)", "Zone 3 (Z = 3)", "Zone 4 (Z = 4,5)"],
          zeilen: [200, 400, 600, 800, 1000, 1200, 1500].map((a) => [
            `${a.toLocaleString("de-DE")} m`,
            kn(alteFormel(1.6, a)),
            kn(alteFormel(2, a)),
            kn(alteFormel(3, a)),
            kn(alteFormel(4.5, a)),
          ]),
          hervorheben: 2,
          fussnote: "Eigene Berechnung nach der Formel der ÖNORM B 1991-1-3 (2006/2018). Für Neuplanungen gelten ausschließlich die Kartenwerte der Ausgabe 2022 (HORA).",
        },
      ],
    },
    {
      id: "rechenbeispiele",
      titel: "Rechenbeispiele: Linz, Salzburg, Innsbruck, Kitzbühel, Lech",
      tocLabel: "Rechenbeispiele",
      bloecke: [
        {
          typ: "p",
          text: "**Die folgenden Beispiele zeigen, wie stark sich die Last zwischen Donauraum und Arlberg unterscheidet – bei gleicher Anlage.** Grundlage sind Beispielwerte, die wir für das jeweilige Ortszentrum in eHORA abgelesen haben (Abfrage am 28.09.2026), ein Dach bis 30° Neigung (µ₁ = 0,8) und Cₑ = Cₜ = 1. Die letzte Spalte vergleicht den Bemessungswert senkrecht zur Modulebene bei 30° Neigung mit der typischen Designlast eines Standardmoduls von 3.600 Pa (Prüflast 5.400 Pa).",
        },
        {
          typ: "tabelle",
          caption: "Schneelast und Modulbeanspruchung an fünf Standorten, Stand 09/2026",
          kopf: ["Ort (Ortszentrum)", "Seehöhe", "sₖ laut eHORA (Beispielwert)", "Dachschneelast s = 0,8 · sₖ", "senkrecht aufs Modul bei 30°, Bemessung (×1,5)"],
          zeilen: ORTE.map((o) => [
            o.ort,
            `${o.hoehe.toLocaleString("de-DE")} m`,
            `${kn(o.sk)} kN/m²`,
            `${kn(0.8 * o.sk)} kN/m² (≈ ${Math.round(0.8 * o.sk * 102)} kg/m²)`,
            `${pa(normal(o.sk, 30) * 1.5)} Pa`,
          ]),
          markierteZeile: 3,
          hervorheben: 4,
          minBreite: 700,
          fussnote: "sₖ = charakteristische Bodenschneelast (50-jährliches Ereignis) gemäß ÖNORM B 1991-1-3:2022, in eHORA für das Ortszentrum abgelesen – Beispielwerte; an Ihrer Adresse und Seehöhe weicht der Wert ab. 1 kN/m² ≈ 102 kg/m². Vereinfachte Abschätzung ohne Verwehung, Wind und Eigengewicht; ersetzt keine Statik.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Linz, 261 m: unkritisch", text: "0,6 kN/m² Bodenschneelast, auf dem Dach 0,48 kN/m². Senkrecht auf ein 30°-Modul wirken als Bemessungswert rund 540 Pa – ein Bruchteil der Designlast. Hier entscheidet eher Wind (Sog am Rand) über die Befestigung." },
            { titel: "Salzburg und Innsbruck: moderat", text: "1,6 bzw. 1,7 kN/m². Bemessungswerte um 1.500 Pa liegen deutlich unter 3.600 Pa. Aufmerksamkeit verlangen Schneesäcke hinter Modulreihen auf Flachdächern und die Tragreserve älterer Hallen." },
            { titel: "Kitzbühel, 747 m: an der Grenze", text: "4,2 kN/m² Bodenschneelast. Auf dem Dach 3,36 kN/m² (≈ 340 kg/m²); senkrecht aufs Modul rund 3.780 Pa Bemessungswert. Ein Standardmodul mit 3.600 Pa Designlast reicht nicht mehr aus – verstärkte Module, engere Klemmung oder Stützschienen sind nötig." },
            { titel: "Lech, 1.439 m: Sonderkonstruktion", text: "10,3 kN/m² – rund 840 kg/m² auf dem Dach. Senkrecht auf ein 30°-Modul wirken als Bemessungswert über 9.000 Pa. Das schafft kein Standardaufbau: gefragt sind Indach- oder Sonderlösungen mit sehr dichter Auflagerung, Fassaden-PV oder steile Flächen, von denen Schnee abgleitet." },
          ],
        },
        {
          typ: "p",
          text: "Auffällig ist, dass die Seehöhe allein wenig aussagt: Mariazell liegt auf 867 m und kommt auf 7,1 kN/m², das höher gelegene Bad Gastein (1.013 m) auf 3,2 kN/m². Nordstaulagen am Alpenrand erhalten deutlich mehr Schnee als inneralpine Täler. Genau deshalb ersetzt die Rasterkarte die früheren Zonen. Weitere Werte finden Sie in der Tabelle unten; die Ertragsseite desselben Standorts zeigt der Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
        {
          typ: "tabelle",
          caption: "Charakteristische Schneelast sₖ weiterer Orte laut HORA (Ortszentrum), Stand 09/2026",
          kopf: ["Ort (Ortszentrum)", "Seehöhe", "sₖ laut eHORA (Beispielwert)", "Dachschneelast (µ₁ = 0,8)"],
          zeilen: WEITERE.map(([ort, h, sk]) => [ort, `${h.toLocaleString("de-DE")} m`, `${kn(sk)} kN/m²`, `${kn(0.8 * sk)} kN/m²`]),
          fussnote: "Quelle: HORA, Schneelastkarte gemäß ÖNORM B 1991-1-3:2022-05-15, Einzelabfragen je Ortszentrum. Werte ändern sich mit Seehöhe und Lage oft schon innerhalb einer Gemeinde deutlich.",
        },
      ],
    },
    {
      id: "module",
      titel: "Was Module aushalten: Prüflast, Designlast und Schneeabgleitlast",
      tocLabel: "Modul-Prüflasten",
      bloecke: [
        {
          typ: "p",
          text: "**Die oft beworbenen 5.400 Pa sind eine Prüflast, keine zulässige Last.** Nach IEC 61215-2 (Prüfung MQT 16, statische mechanische Belastung) gibt der Hersteller eine Designlast an; geprüft wird mit dem Produkt aus Designlast und Sicherheitsfaktor γₘ von mindestens 1,5. 5.400 Pa Prüflast bedeuten also 3.600 Pa Designlast auf der Vorderseite, 2.400 Pa Prüflast auf der Rückseite (Sog) entsprechen 1.600 Pa. Die Mindestprüflast der Norm liegt bei 2.400 Pa.",
        },
        {
          typ: "tabelle",
          caption: "Typische Angaben im Moduldatenblatt und ihre Bedeutung",
          kopf: ["Angabe", "Typischer Wert", "Was sie bedeutet"],
          zeilen: [
            ["Prüflast Vorderseite (Schnee/Druck)", "5.400 Pa", "Test nach IEC 61215 MQT 16 bestanden – mit Sicherheitsfaktor 1,5"],
            ["Designlast Vorderseite", "3.600 Pa", "maximal zulässige Last im Betrieb bei vorgeschriebener Klemmung"],
            ["Prüflast Rückseite (Sog)", "2.400 Pa", "entspricht 1.600 Pa Designlast – relevant für Wind am Dachrand"],
            ["Verstärkte Module (alpin)", "Prüflasten bis über 8.000 Pa", "dickere Rahmen, Glas-Glas, zusätzliche Querstreben – nur mit Montageanleitung gültig"],
          ],
          fussnote: "Werte gelten ausschließlich für die im Handbuch des Herstellers freigegebenen Klemmbereiche und Montagearten (lange oder kurze Seite, Anzahl der Klemmen, Einlegesystem). Andere Befestigung = andere, meist niedrigere Last.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Unterschätzt: Schnee, der am Modulrand hängen bleibt",
          text: "Rutscht Schnee auf einem geneigten Modul nach unten, staut er sich an der unteren Rahmenkante und belastet sie als Linienlast. Das verbiegt Rahmen, lässt Glas brechen oder reißt Rahmenecken auf – typische Winterschäden an Anlagen in 700 bis 1.200 m Seehöhe. Die Norm IEC 62938 beschreibt eine eigene Prüfung für ungleichmäßige Schneelast. Abhilfe: Module mit geprüfter Schneeabgleitlast, Stützschienen unter der Traufkante, Hochformat mit Klemmung an der langen Seite, keine Schneefänge direkt unter dem Modulfeld.",
        },
        {
          typ: "p",
          text: "Glas-Glas-Module mit robustem Rahmen und die Frage, welche Zelltechnologie im Winter Vorteile bringt, vergleicht der Ratgeber [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich). Wie sich [Glas-Glas-Module](/wissen/lexikon#glas-glas-modul) von Standardmodulen unterscheiden, erklärt das Lexikon.",
        },
      ],
    },
    {
      id: "dach-unterkonstruktion",
      titel: "Dach und Unterkonstruktion: Wo die Reserven fehlen",
      tocLabel: "Dach & Unterkonstruktion",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten Probleme entstehen nicht am Modul, sondern im Dachtragwerk und in der Befestigung.** Eine PV-Anlage bringt je nach System 12 bis 25 kg/m² Eigengewicht aufs Dach – auf einer leicht bemessenen Stahlhalle mit Trapezblech kann schon das die letzte Reserve sein. Dazu kommen Schneesäcke: Hinter aufgeständerten Reihen und an Attiken sammelt sich Treibschnee, lokal ein Vielfaches der gleichmäßigen Last.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Bestandsstatik anfordern:** Mit welcher Schneelast und welcher Zusatzlast wurde das Dach bemessen? Bei älteren Gebäuden liegt oft noch die historische Zonenformel zugrunde.",
            "**Aktuellen HORA-Wert gegenüberstellen:** Ist sₖ heute niedriger, entsteht mitunter Reserve für die PV-Anlage – ist er höher, muss geprüft werden, ob das Dach selbst noch ausreicht.",
            "**Lastpfad klären:** Dachhaken, Stockschrauben oder Klemmen müssen die Last in Sparren, Pfetten oder Trapezblechrippen leiten. Im Alpenraum sind engere Hakenabstände und zusätzliche Tragprofile üblich.",
            "**Flachdach:** Ballastierte Systeme erhöhen die Dauerlast; bei hoher Schneelast sind flache Neigungen (10–15°) mit großem Reihenabstand oder Ost-West-Systeme mit geringer Bauhöhe günstiger – siehe [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
            "**Schneefang und Traufe:** Wo Schnee abgleiten darf, braucht es Schutz für Verkehrsflächen. Wo er gehalten wird, ist mit µ₁ ≥ 0,8 und zusätzlicher Last am Schneefang zu rechnen.",
            "**Wind nicht vergessen:** Die Basiswindgeschwindigkeit nach ÖNORM B 1991-1-4 ist ebenfalls in HORA abrufbar; im Winter kann Sog am Rand und Schnee im Feld gleichzeitig auftreten.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Wer darf den Nachweis erstellen?",
          text: "Statische Nachweise erstellen Ziviltechniker (Bauingenieurwesen) oder befugte Baumeister bzw. Holzbau-Meister im Rahmen ihrer Gewerbeberechtigung. Viele Bauordnungen verlangen bei Anlagen, die das Tragwerk wesentlich zusätzlich belasten, einen Nachweis der Tragfähigkeit – unabhängig davon, ob die PV-Anlage selbst anzeige- oder bewilligungsfrei ist. Die Verfahren je Bundesland beschreibt der Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
        },
      ],
    },
    {
      id: "alpin",
      titel: "Alpine Lagen: Was bei Chalets, Hotels und Bergbahnen anders ist",
      tocLabel: "Alpin planen",
      bloecke: [
        {
          typ: "p",
          text: "**Über rund 800 m Seehöhe ist die Schneelast in vielen Tälern Österreichs das bestimmende Planungskriterium – wichtiger als die Ausrichtung.** Dort lohnt es sich, die PV-Anlage von Beginn an mit Architektur und Statik zu entwickeln, statt Standardkomponenten nachträglich aufs Dach zu setzen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Indach statt Aufdach:** Gebäudeintegrierte Systeme ersetzen die Dacheindeckung, liegen tiefer und lassen sich auf das Tragwerk abstimmen. Mehr im Ratgeber [Fassade und BIPV](/ratgeber/photovoltaik-fassade-bipv).",
            "**Steile Flächen und Fassaden:** Ab etwa 60° bleibt kaum Schnee liegen. Senkrechte Module liefern in der tief stehenden Wintersonne sogar überdurchschnittlich – Details im Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).",
            "**Verstärkte Module und dichte Auflagerung:** Glas-Glas mit hoher Designlast, Stützschiene unter jeder Modulreihe, Klemmung exakt nach Herstellerfreigabe.",
            "**Wartung einplanen:** Sichtkontrolle nach Starkschneefällen, Kontrolle von Rahmen und Klemmen im Frühjahr, Schneeräumung nur mit geeignetem Werkzeug – nie mit Metallschaufeln auf dem Glas.",
          ],
        },
        {
          typ: "p",
          text: "Für Luxus-Chalets und Premiumobjekte im Hochgebirge planen wir Indach-Lösungen, abgestimmte Unterkonstruktionen und Wartung aus einer Hand – siehe [Photovoltaik für Chalets](/chalets). Für Hotels und Bergbahnen, bei denen große Dachflächen und hohe Schneelasten zusammenkommen, empfiehlt sich der Blick in den Ratgeber zur [Photovoltaik in der Hotellerie](/ratgeber/photovoltaik-hotel).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So gehen Sie vor: Schneelast im PV-Projekt richtig berücksichtigen",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Standortwerte abrufen", "sₖ, s₁₀₀ und Seehöhe aus HORA für die exakte Adresse, dazu Basiswindgeschwindigkeit und Hagelgefährdung – etwa über den [Standort-Check](/standort-check)."],
            ["Bestand prüfen", "Bestandsstatik, Dachaufbau, Zustand von Sparren, Pfetten oder Trapezblech erheben; bei Hallen die Lastannahmen von damals mit den heutigen Werten vergleichen."],
            ["System wählen", "Aufdach, Indach, Flachdach-Aufständerung oder Fassade – passend zu Last, Dachneigung und Nutzung. Module mit ausreichender Designlast auswählen."],
            ["Statischen Nachweis erstellen lassen", "Dachtragwerk, Unterkonstruktion und Befestigung für Schnee, Wind und Eigengewicht nachweisen – inklusive Schneesäcken und Randbereichen."],
            ["Montage nach Freigabe", "Klemmbereiche, Hakenabstände und Drehmomente exakt nach Hersteller- und Statikvorgabe; Abweichungen dokumentieren."],
            ["Betrieb absichern", "Kontrolle nach Schneeereignissen, Wartungsvertrag und passende Versicherung – Schneedruck ist in vielen Polizzen eingeschlossen, aber nur bei fachgerechter Ausführung."],
          ],
        },
        {
          typ: "p",
          text: "Wie Schneedruck, Lawinen- und Elementarschäden versichert werden können, erklärt die Seite [PV-Versicherung](/service/versicherung). Für die Ertragsplanung im Winter und die Frage, ob Schnee geräumt werden sollte, lesen Sie weiter im Ratgeber [Hagel und Photovoltaik](/ratgeber/hagel-photovoltaik) – dort geht es um die zweite große Naturgefahr für Module.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Welche Schneelastzone habe ich in Österreich?",
      a: "Seit der ÖNORM B 1991-1-3:2022 gibt es keine Schneelastzonen mit Seehöhenformel mehr, sondern eine Rasterkarte (50 × 50 m, bis 2.000 m Seehöhe). Den Wert sₖ für Ihre Adresse lesen Sie kostenlos in eHORA auf hora.gv.at ab. Die alten Zonen 2*, 2, 3 und 4 finden Sie nur noch in Bestandsstatiken.",
    },
    {
      q: "Wie berechne ich die Schneelast auf dem Dach?",
      a: "Vereinfacht mit s = µ₁ · Cₑ · Cₜ · sₖ. Für Dächer bis 30° Neigung ist µ₁ = 0,8, Cₑ und Cₜ sind meist 1,0. Bei sₖ = 1,6 kN/m² (Salzburg) ergibt das 1,28 kN/m² auf dem Dach. Verwehungen, Schneefänge und Höhensprünge muss die Statik zusätzlich berücksichtigen.",
    },
    {
      q: "Reichen Module mit 5.400 Pa für hohe Schneelasten?",
      a: "Nur bis zu einem gewissen Punkt. 5.400 Pa sind die Prüflast, die zulässige Designlast beträgt 3.600 Pa. In Lagen wie Kitzbühel wird sie auf einem 30°-Dach bereits erreicht, in Lech oder Obertauern deutlich überschritten – dort braucht es verstärkte Module und Sonderkonstruktionen.",
    },
    {
      q: "Ist die neue Schneelast niedriger als früher?",
      a: "In den meisten Lagen ja – Holzbau Austria spricht von „im Schnitt 80 Kilo weniger“ pro Quadratmeter, weil die alte Zonenformel vielerorts zu hoch lag. In schneereichen Staulagen am Alpenrand kann der neue Kartenwert aber auch höher sein. Verlässlich ist nur der Wert, den Sie für Ihre Adresse in eHORA ablesen.",
    },
    {
      q: "Brauche ich für eine PV-Anlage einen Statiker?",
      a: "Bei Gewerbehallen, Flachdächern mit Ballast und allen Dächern in schneereichen Lagen ist ein statischer Nachweis dringend zu empfehlen und oft auch baurechtlich gefordert. Bei Einfamilienhäusern in Tallagen genügt häufig die Bemessung der Unterkonstruktion durch den Systemhersteller.",
    },
    {
      q: "Was gilt über 2.000 m Seehöhe?",
      a: "Die ÖNORM B 1991-1-3:2022 enthält oberhalb von 2.000 m keine normativen Werte. Für Hütten, Bergstationen oder exponierte Lagen oberhalb der Waldgrenze ist ein Schneelastgutachten nötig, zum Beispiel über GeoSphere Austria.",
    },
    {
      q: "Soll ich Schnee von der PV-Anlage räumen?",
      a: "Nur wenn die Statik es verlangt oder Gefahr besteht – und nur mit weichen Werkzeugen, ohne das Glas zu zerkratzen. Den Ertrag verbessert das Räumen im Winter kaum, weil Dezember und Jänner zusammen je nach Standort nur rund 5 bis 11 % der Jahresproduktion liefern (PVGIS).",
    },
  ],

  passend: [
    { href: "/standort-check", titel: "Standort-Check", text: "Schneelast, Wind, Hagel und Ertrag für Ihre Adresse." },
    { href: "/chalets", titel: "PV für Chalets & alpin", text: "Indach, Schneelast, Concierge-Wartung." },
    { href: "/ratgeber/photovoltaik-im-winter", titel: "Photovoltaik im Winter", text: "Ertrag, Kälte und Schnee im Alpenraum." },
    { href: "/ratgeber/photovoltaik-flachdach", titel: "Photovoltaik auf dem Flachdach", text: "Ballast, Statik und Hallendächer." },
  ],

  quellen: [
    { titel: "HORA – Natural Hazard Overview & Risk Assessment Austria, Schneelastkarte gemäß ÖNORM B 1991-1-3:2022", url: "https://hora.gv.at/#/cschneelast/bgrau/a-/@47.62609,11.91696,7z", stand: "09/2026" },
    { titel: "Holzbau Austria – Neue Schneelastnorm veröffentlicht (ÖNORM B 1991-1-3:2022)", url: "https://www.holzbauaustria.at/technik/2022/07/neue-schneelastnorm-veroeffentlicht.html", stand: "09/2026" },
    { titel: "Holzbau Austria – Im Schnitt 80 Kilo weniger: Projekt Schneelast.Reform", url: "https://www.holzbauaustria.at/technik/2021/11/im-schnitt-80-kilo-weniger-.html", stand: "09/2026" },
    { titel: "Austrian Standards – ÖNORM EN 1991-1-3: Eurocode 1, Schneelasten", url: "https://www.austrian-standards.at/en/shop/onorm-en-1991-1-3-2012-03-01~p1924497", stand: "09/2026" },
    { titel: "Wikipedia – Schneelasten in Österreich (Normenhistorie, Zonenformel)", url: "https://de.wikipedia.org/wiki/Schneelasten_in_%C3%96sterreich", stand: "09/2026" },
    { titel: "WKO Tirol – Projekt Schneelast.Reform", url: "https://www.wko.at/tirol/gewerbe-handwerk/holzbau/schneelast-reform", stand: "09/2026" },
  ],

  seitenCta: { titel: "Schneelast am Standort?", text: "Werte aus eHORA plus PV-Ertrag in einer Abfrage.", href: "/standort-check", label: "Standort prüfen" },
  cta: {
    title: "PV-Anlage für schneereiche Lagen – mit Statik von Anfang an.",
    text: "Wir planen Unterkonstruktion, Module und Befestigung passend zur Schneelast Ihres Standorts – von der Halle im Innviertel bis zum Chalet am Arlberg.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Standort-Check", href: "/standort-check" },
  },
};

export default artikel;
