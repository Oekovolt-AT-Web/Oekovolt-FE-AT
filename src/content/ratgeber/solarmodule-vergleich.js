// Ratgeber: Solarmodule im Vergleich – Zelltechnik, Glas-Glas, Bifazial, Prüflasten, Lieferkette
// Recherchestand 28.09.2026. Wirkungsgrade: Fraunhofer ISE Photovoltaics Report (14.07.2026).
// Mechanik/Hagel: IEC 61215-2 (MQT 16/17), IEC 62938; HW-Klassen: Elementarschutzregister Hagel (VKF/EPZ).
// Förderzuschlag EU-Wertschöpfung: EAG-IZ-VO Strom § 6 Abs. 6/8 (Fassung 2026).
// Temperaturkoeffizienten, Bifazialität, Garantien: typische Datenblattwerte (Marktübersicht), keine Herstellerzusagen.
// Hersteller-Vergleich (P4/M20, 30.09.2026): neutrale Datenblattwerte, alphabetisch, ohne Verbau- oder
// Partner-Aussage; jede Zeile mit Herstellerdatenblatt, Version und Abrufdatum. Vor Veröffentlichung
// rechtlich prüfen lassen (E12).

const artikel = {
  slug: "solarmodule-vergleich",
  title: "Solarmodule im Vergleich: TOPCon, HJT, Glas-Glas, Bifazial",
  seoTitle: "Solarmodule Vergleich 2026: TOPCon, HJT | Ökovolt",
  kurzTitel: "Solarmodule im Vergleich",
  description:
    "Solarmodule 2026 im Vergleich: TOPCon, Heterojunction und Back-Contact, Glas-Glas und bifazial, Schnee- und Hagelprüfung, Garantien und Lieferkette erklärt.",
  excerpt:
    "Welche Zelltechnik, welcher Aufbau, welche Prüflast? Was Datenblätter über Wirkungsgrad, Temperaturverhalten, Schnee- und Hagelfestigkeit wirklich aussagen – und worauf Betriebe in Österreich beim Einkauf achten sollten.",
  hauptKeyword: "solarmodule vergleich",
  keywords: [
    "Solarmodule Vergleich",
    "TOPCon Module",
    "Heterojunction HJT Module",
    "Glas-Glas-Modul",
    "bifaziale Solarmodule",
    "Schneelast Solarmodul 5400 Pa",
    "Solarmodul Hagelwiderstand",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/wissen/pv-modul-pruefung.jpg",
  bildAlt: "Techniker prüft ein monokristallines Solarmodul auf einem Dach",
  badge: { wert: "22,7 %", text: "mittlerer Wirkungsgrad kristalliner Module (Fraunhofer ISE)" },

  kurzFazit: [
    "**n-Typ-Zellen haben PERC abgelöst: TOPCon ist 2026 die dominierende Technologie, Heterojunction (HJT) und Back-Contact (BC) besetzen das obere Segment.** Der gewichtete Durchschnitt kristalliner Module lag laut Fraunhofer ISE Ende 2024 bei 22,7 % Wirkungsgrad, die besten Serienmodule bei 24,8 %.",
    "Für Österreich zählen neben dem Wirkungsgrad vor allem **Temperaturverhalten, mechanische Belastbarkeit und Hagelfestigkeit**. Die übliche Angabe 5.400 Pa ist eine Prüflast – die zulässige Designlast beträgt 3.600 Pa.",
    "**Glas-Glas-Module** sind langlebiger und oft mit 30 Jahren Leistungsgarantie erhältlich; **bifaziale** Module bringen auf hellen Flachdächern, Freiflächen und bei Schnee einige Prozent Mehrertrag.",
    "Beim Einkauf wird die **Lieferkette** wichtiger: Die EU-Zwangsarbeitsverordnung gilt ab Dezember 2027, und der EAG-Investitionszuschuss gewährt **10 % Zuschlag** für Module aus europäischer Fertigung.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Welche Solarmodule sind 2026 die besten?",
      tocLabel: "Die besten Module?",
      bloecke: [
        {
          typ: "p",
          text: "**Das beste Modul gibt es nicht – es gibt das passende Modul für Dach, Standort und Betrieb.** Auf einem statisch knappen Hallendach zählt das Gewicht, in Kitzbühel die Schneelast, im Grazer Becken die Hagelfestigkeit und auf einer Freifläche der Preis je Kilowattstunde über 30 Jahre. Der Wirkungsgrad ist wichtig, wenn die Fläche knapp ist; sonst entscheiden oft andere Kriterien.",
        },
        {
          typ: "p",
          text: "Technologisch hat sich der Markt in den letzten drei Jahren grundlegend verändert. Laut Fraunhofer ISE ersetzen n-Typ-TOPCon- und Heterojunction-Zellen die p-Typ-PERC-Technik, die bis 2023 dominierte; monokristallines n-Typ-TOPCon ist inzwischen der Standard. Die zehn größten Hersteller vereinen rund 85 % der weltweiten Liefermenge, überwiegend aus Asien.",
        },
      ],
    },
    {
      id: "zelltechnik",
      titel: "Zelltechnologien: PERC, TOPCon, Heterojunction, Back-Contact",
      tocLabel: "Zelltechnik",
      bloecke: [
        {
          typ: "p",
          text: "**Die Zelltechnik bestimmt Wirkungsgrad, Temperaturverhalten, Bifazialität und Alterung eines Moduls.** Die folgende Übersicht fasst typische Datenblattwerte zusammen; einzelne Produkte weichen davon ab.",
        },
        {
          typ: "tabelle",
          caption: "Zelltechnologien im Vergleich (typische Datenblattwerte, Stand 09/2026)",
          kopf: ["Technologie", "Modulwirkungsgrad", "Temperaturkoeffizient Pmax", "Bifazialität", "Einordnung"],
          zeilen: [
            ["PERC (p-Typ, mono)", "ca. 20–21,5 %", "ca. −0,34 bis −0,37 %/K", "ca. 70 %", "auslaufend, kaum noch Neuware"],
            ["TOPCon (n-Typ)", "ca. 22–23,5 %", "ca. −0,29 bis −0,30 %/K", "ca. 80 %", "Marktstandard, gutes Preis-Leistungs-Verhältnis"],
            ["Heterojunction / HJT (n-Typ)", "ca. 22,5–24 %", "ca. −0,24 bis −0,26 %/K", "ca. 85–90 %", "sehr gutes Hitze- und Schwachlichtverhalten"],
            ["Back-Contact (BC, n- oder p-Typ)", "ca. 23–24,8 %", "ca. −0,26 bis −0,29 %/K", "ca. 70 % oder monofazial", "höchster Wirkungsgrad, ohne Frontkontakte, ästhetisch"],
          ],
          hervorheben: 1,
          minBreite: 720,
          fussnote: "Bandbreiten typischer Datenblattwerte führender Hersteller; Einordnung nach Fraunhofer ISE Photovoltaics Report (07/2026): gewichteter Mittelwert kristalliner Module 22,7 % (Q4/2024), Spanne 18,9 bis 24,8 %. Rekordwirkungsgrad im Labor: 26,0 % für Module aus monokristallinem Silizium.",
        },
        {
          typ: "p",
          text: "Für Gewerbedächer in Österreich ist [TOPCon](/wissen/lexikon#topcon) meist die wirtschaftlichste Wahl. [Heterojunction](/wissen/lexikon#heterojunction) spielt seine Stärken bei heißen Blechdächern aus: Mit einem Temperaturkoeffizienten von −0,25 %/K statt −0,35 %/K verliert ein HJT-Modul bei 65 °C Zelltemperatur rund 4 Prozentpunkte weniger Leistung als ein PERC-Modul. Back-Contact-Module punkten mit Optik und Flächenertrag, etwa bei Chalets und repräsentativen Gebäuden. Für Freiflächen und große Hallen zählt dagegen vor allem der Preis je Kilowattstunde über die Laufzeit – dort setzt sich meist das günstigste Modul mit soliden Prüfnachweisen durch.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Degradation: LeTID, UVID und PID",
          text: "Neue Zelltechnologien bringen neue Alterungsmechanismen. PERC-Module waren anfällig für lichtinduzierte Degradation bei erhöhter Temperatur (LeTID); bei TOPCon wird eine UV-induzierte Degradation (UVID) diskutiert. Potenzialinduzierte Degradation (PID) betrifft vor allem große Anlagen mit hohen Systemspannungen. Fragen Sie nach Prüfberichten unabhängiger Labore über die Normprüfung hinaus – etwa verlängerte UV- und Klimakammertests.",
        },
      ],
    },
    {
      id: "aufbau",
      titel: "Glas-Folie oder Glas-Glas, monofazial oder bifazial?",
      tocLabel: "Aufbau & Bifazial",
      bloecke: [
        {
          typ: "p",
          text: "**Glas-Glas-Module schützen die Zellen auf beiden Seiten mit Glas und gelten als langlebiger; Glas-Folie-Module sind leichter und günstiger.** Für die meisten Gewerbeanlagen sind beide Bauarten geeignet – die Wahl hängt von Statik, Umgebung und gewünschter Laufzeit ab.",
        },
        {
          typ: "tabelle",
          caption: "Glas-Folie und Glas-Glas im Vergleich",
          kopf: ["Merkmal", "Glas-Folie", "Glas-Glas"],
          zeilen: [
            ["Aufbau", "Frontglas (meist 3,2 mm) + Kunststoff-Rückseitenfolie", "zwei Gläser (oft je 2,0 mm), meist gerahmt"],
            ["Gewicht", "leichter", "etwas schwerer"],
            ["Feuchte, Ammoniak, Salz", "gut", "sehr gut – geeignet für Stallungen, Küstennähe, Floating-PV"],
            ["Brandverhalten", "Folie brennbar", "günstiger, Glas nicht brennbar"],
            ["Garantien (typisch)", "12–25 Jahre Produkt, 25–30 Jahre Leistung", "bis 30 Jahre Produkt und Leistung"],
            ["Bifazial möglich", "mit transparenter Rückseitenfolie", "ja, Standard"],
          ],
          fussnote: "Typische Marktangaben; Garantiebedingungen je Hersteller genau prüfen.",
        },
        {
          typ: "p",
          text: "[Bifaziale Module](/wissen/lexikon#bifazial) nutzen zusätzlich das Licht, das auf die Rückseite fällt. Der Mehrertrag hängt stark vom Untergrund ab: Auf Wiese und dunklem Kies sind es wenige Prozent, auf hellen Dachbahnen, Beton und bei Schnee mehr, bei vertikaler Aufstellung in der [Agri-PV](/ratgeber/agri-pv-oesterreich) ist die Rückseite gleichwertiger Teil der Anlage. Auf Flachdächern lohnt Bifazialität nur mit ausreichend Abstand zum Dach und hellem Untergrund. Mehr zum [Glas-Glas-Modul](/wissen/lexikon#glas-glas-modul) im Lexikon.",
        },
      ],
    },
    {
      id: "flaeche",
      titel: "Wirkungsgrad, Format und Gewicht: Was auf dem Dach zählt",
      tocLabel: "Format & Fläche",
      bloecke: [
        {
          typ: "p",
          text: "**Ein höherer Wirkungsgrad bringt mehr Leistung auf dieselbe Fläche – er lohnt sich vor allem, wenn das Dach knapp oder die Statik der Engpass ist.** Auf 1.000 m² Modulfläche passen bei 21 % Wirkungsgrad rund 210 kWp, bei 22,7 % rund 227 kWp und bei 24 % rund 240 kWp. Der Unterschied von drei Prozentpunkten entspricht also rund 14 % mehr Leistung und Ertrag auf demselben Dach – bei praktisch gleicher Unterkonstruktion, Montagezeit und Dachlast.",
        },
        {
          typ: "tabelle",
          caption: "Leistung auf 1.000 m² Modulfläche nach Wirkungsgrad",
          kopf: ["Wirkungsgrad", "Leistung je 1.000 m² Modulfläche", "Jahresertrag bei 1.040 kWh/kWp (Linz, Süd 10°)"],
          zeilen: [
            ["21,0 %", "ca. 210 kWp", "ca. 218 MWh"],
            ["22,7 %", "ca. 227 kWp", "ca. 236 MWh"],
            ["24,0 %", "ca. 240 kWp", "ca. 250 MWh"],
          ],
          fussnote: "Leistung = Fläche × 1.000 W/m² × Wirkungsgrad (Standard-Testbedingungen); Ertrag nach PVGIS 5.3 für Linz. Die belegbare Modulfläche eines Daches ist kleiner als die Dachfläche.",
        },
        {
          typ: "p",
          text: "Gewerbemodule sind in den letzten Jahren deutlich größer geworden: Formate um 2,3 × 1,1 m mit 550 bis 650 Wp sind für Freiflächen üblich, auf Dächern haben sich Formate um 1,7 bis 2,0 m Länge bewährt. Große Module sparen Montagezeit, sind aber schwerer zu handhaben, biegen sich unter Last stärker durch und brauchen eine Unterkonstruktion, die exakt zur Klemmfreigabe passt. Auf Dächern mit begrenztem Zugang, schwacher Statik oder hoher Schneelast sind mittlere Formate oft die bessere Wahl.",
        },
      ],
    },
    {
      id: "mechanik",
      titel: "Schnee- und Windlast: Was die Pascal-Angaben bedeuten",
      tocLabel: "Schnee & Wind",
      bloecke: [
        {
          typ: "p",
          text: "**Datenblätter nennen meist 5.400 Pa Druck- und 2.400 Pa Soglast – das sind Prüflasten nach IEC 61215-2 (MQT 16), die bereits einen Sicherheitsfaktor von mindestens 1,5 enthalten.** Die zulässige Designlast beträgt entsprechend 3.600 Pa auf der Vorderseite und 1.600 Pa auf der Rückseite, und zwar nur in den vom Hersteller freigegebenen Klemmbereichen und Montagearten.",
        },
        {
          typ: "tabelle",
          caption: "Mechanische Prüfungen für Solarmodule",
          kopf: ["Prüfung", "Inhalt", "Bedeutung für Österreich"],
          zeilen: [
            ["IEC 61215-2 MQT 16", "statische Last auf Vorder- und Rückseite, Prüflast = Designlast × ≥ 1,5, Mindestprüflast 2.400 Pa", "Grundnachweis; für Schnee in Tallagen meist ausreichend"],
            ["Erhöhte Prüflasten (herstellerspezifisch)", "Prüflasten über 5.400 Pa, teils über 8.000 Pa", "für schneereiche Lagen wie Pinzgau, Pongau, Arlberg"],
            ["IEC 62938", "ungleichmäßige Schneelast, Schnee staut sich am unteren Rahmen", "entscheidend bei geneigten Modulen in Schneeregionen"],
            ["IEC 61215-2 MQT 17", "Hagelprüfung mit 25-mm-Eiskugeln bei 23 m/s", "Mindestnachweis; für Hagelregionen zu wenig"],
          ],
          minBreite: 680,
          fussnote: "Welche Last am Standort tatsächlich wirkt, ergibt sich aus der Schneelast laut eHORA (ÖNORM B 1991-1-3) und der Statik. Die Designlast des Moduls muss den Bemessungswert abdecken.",
        },
        {
          typ: "p",
          text: "Wie die Bodenschneelast in eine Belastung der Modulfläche umgerechnet wird und ab welcher Seehöhe Standardmodule an ihre Grenzen stoßen, zeigt der Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik) mit Beispielen von Linz bis Lech.",
        },
      ],
    },
    {
      id: "hagel",
      titel: "Hagelfestigkeit: IEC-Test und Hagelwiderstandsklasse",
      tocLabel: "Hagel",
      bloecke: [
        {
          typ: "p",
          text: "**Die IEC-Hagelprüfung mit 25-mm-Eiskugeln entspricht rund 2 Joule Aufprallenergie – ein 4-cm-Hagelkorn bringt über 11 Joule.** Laut HORA fallen in weiten Teilen Österreichs statistisch alle 30 Jahre Körner von 4 bis 5 cm. Aussagekräftiger ist deshalb die [Hagelwiderstandsklasse](/wissen/lexikon#hagelwiderstandsklasse) HW 1 bis HW 5 des Elementarschutzregisters Hagel oder ein Prüfbericht mit größeren Eiskugeln.",
        },
        {
          typ: "p",
          text: "Für Gewerbedächer in hagelgefährdeten Regionen – etwa im Grazer und Klagenfurter Becken, im Mostviertel oder im Linzer Zentralraum – empfehlen wir Module mit nachgewiesener Klasse HW 4 oder vergleichbarem Prüfnachweis. Die Details, Tabellen und das Vorgehen nach einem Schaden erklärt der Ratgeber [Hagel und Photovoltaik](/ratgeber/hagel-photovoltaik).",
        },
      ],
    },
    {
      id: "garantie-lieferkette",
      titel: "Garantien, Zertifikate und Lieferkette",
      tocLabel: "Garantie & Lieferkette",
      bloecke: [
        {
          typ: "p",
          text: "**Neben Technik entscheiden Garantiebedingungen und die Herkunft der Module zunehmend über den Einkauf – bei Förderungen, Ausschreibungen und im Nachhaltigkeitsbericht.**",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Produktgarantie:** deckt Material- und Verarbeitungsfehler, typisch 12 bis 25 Jahre, bei Glas-Glas bis 30 Jahre. Prüfen Sie, wer im Garantiefall Aus- und Einbau zahlt.",
            "**Leistungsgarantie:** lineare Garantie über 25 bis 30 Jahre mit einem Endwert von typischerweise rund 85 bis 89 % der Nennleistung; entscheidend ist die zulässige Degradation im ersten Jahr und pro Jahr danach.",
            "**Sicherheit und Zulassung:** IEC 61215 (Bauartzulassung) und IEC 61730 (Sicherheit, Schutzklasse II) sind Pflicht; zusätzlich Nachweise zu Brandverhalten für Dachanwendungen.",
            "**Herkunft und Zwangsarbeit:** Die EU-Verordnung (EU) 2024/3015 verbietet ab 14. Dezember 2027 Produkte aus Zwangsarbeit auf dem EU-Markt. Lassen Sie sich Rückverfolgbarkeit bis zum Polysilizium dokumentieren.",
            "**Europäische Wertschöpfung:** Der EAG-Investitionszuschuss erhöht sich um 10 % für Module, bei denen alle in der Verordnung genannten Fertigungsschritte in der EU, im EWR oder in der Schweiz erfolgen; die EAG-Abwicklungsstelle führt dazu eine Herstellerliste.",
            "**Bankability:** Für finanzierte Anlagen verlangen Banken oft Module von Herstellern mit stabiler Bilanz und unabhängigen Zuverlässigkeitstests.",
          ],
        },
        {
          typ: "p",
          text: "Die Regeln zum EAG-Zuschlag erklärt der Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss); die Bedeutung von Lieferketten für den Nachhaltigkeitsbericht behandelt [CSRD, ESG und Photovoltaik](/ratgeber/csrd-esg-photovoltaik).",
        },
      ],
    },
    {
      id: "hersteller-vergleich",
      titel: "Module verbreiteter Hersteller im Datenblattvergleich",
      tocLabel: "Hersteller-Vergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Die Tabelle stellt Datenblattwerte von Modulen im Dachformat (108 Halbzellen, rund 1,76 bis 1,80 m Länge) verbreiteter Hersteller neutral gegenüber – alphabetisch und ohne Rangfolge.** Die Aufnahme bedeutet nicht, dass Ökovolt ein Modul verbaut oder empfiehlt, und sagt nichts über eine Geschäftsbeziehung zum Hersteller aus. Konkrete Modultypen nennen wir im Angebot mit Datenblatt.",
        },
        {
          typ: "tabelle",
          caption: "Solarmodule im Dachformat laut Herstellerdatenblatt",
          kopf: ["Hersteller und Modul", "Zelltechnik laut Datenblatt", "Leistung", "Max. Wirkungsgrad", "Temperaturkoeffizient Pmax", "Aufbau", "Mechanische Last Front / Rück", "Garantie Produkt / Leistung", "Quelle (Version, Abruf)"],
          zeilen: [
            ["Aiko Neostar 3S+54 (AIKO-A-MCE54Db)", "n-Typ ABC (Rückkontakt)", "460–485 Wp", "24,3 %", "−0,26 %/°C", "Glas-Glas, 2,0 + 2,0 mm", "5.400 / 2.400 Pa (max. statische Last)", "k. A. / 30 Jahre", "[Datenblatt](https://aikosolar.com/wp-content/uploads/2024/10/Neostar-3S_Plus_54_AIKO-A-MCE54Db-460W-485W.pdf), DSDr_EN_2405_V1.5, abgerufen 30.09.2026"],
            ["Astronergy CHSM54RNs(DG)(BLH)/F-BH", "n-Typ TOPCon", "440–460 Wp", "23,0 %", "−0,29 %/°C", "Glas-Glas, 1,6 + 1,6 mm, bifazial", "5.400 / 2.400 Pa (Prüflast)", "25 / 30 Jahre", "[Datenblatt](https://www.astronergy.com/wp-content/uploads/2024/03/440460ASTRO-N7s_CHSM54RNsDGBLHF-BH_1762%C3%971134%C3%9730_EN_20240601.pdf), Stand 202406, abgerufen 30.09.2026"],
            ["DAS Solar DAS-DH108NA (445–450 W)", "n-Typ", "445–450 Wp", "23,0 %", "−0,30 %/°C", "Glas-Glas, 1,6 mm, bifazial", "5.400 / 2.400 Pa (statische Last)", "25 / 30 Jahre", "[Datenblatt](https://www.das-solar.com/uploads/Product%20Specifications%20%28New%29/DAS-DH108NA-EN-445-450%EF%BC%88Black%20Frame%EF%BC%89.pdf), Version 2024.05.22, abgerufen 30.09.2026"],
            ["JinkoSolar Tiger Neo JKM420–440N-54HL4R-BDV", "n-Typ monokristallin", "420–440 Wp", "22,02 %", "−0,29 %/°C", "Glas-Glas, 1,6 + 1,6 mm, bifazial", "6.000 Pa Schnee / 4.000 Pa Wind (zertifiziert)", "15 / 30 Jahre", "[Datenblatt](https://jinkosolar.eu/wp-content/uploads/JKM420-440N-54HL4R-BDV-F1.2-EN-4.pdf), JKM420-440N-54HL4R-BDV-F1.2-EN, abgerufen 30.09.2026"],
            ["LONGi Hi-MO X10 LR7-54HVH", "BC (Rückkontakt)", "475–490 Wp", "24,0 %", "−0,26 %/°C", "Einglas-Modul, 3,2 mm Frontglas", "5.400 / 2.400 Pa (max. statische Last)", "15 / 30 Jahre", "[Datenblatt](https://static.longi.com/Hi_MO_X10_Explorer_LR_7_54_HVH_475_490_M_30_30_and_15_Frame_e909d07793.pdf), 20241118 BGV02, abgerufen 30.09.2026"],
            ["Risen RSM108-10-435-455NDGB", "n-Typ TOPCon", "435–455 Wp", "22,3 %", "−0,29 %/°C", "Glas-Glas", "k. A.", "25 / 30 Jahre", "[Datenblatt](https://en.risen.com/uploads/20240528/RSM108-10-435-455NDGB%20%20IEC1500V-30mm%202024H1-3-EN.pdf), REM108-NDGB-16BB-EN-H1-3-2024, abgerufen 30.09.2026"],
            ["Trina Solar Vertex S+ TSM-NEG9RC.27", "n-Typ i-TOPCon", "415–440 Wp", "22,0 %", "−0,30 %/K", "Glas-Glas, 1,6 + 1,6 mm, bifazial", "5.400 / 4.000 Pa (Prüflast)", "25 / 30 Jahre", "[Datenblatt](https://static.trinasolar.com/sites/default/files/VertexS_NEG9RC.27_EN_2023_B_web.pdf), TSM_EN_2023_B, abgerufen 30.09.2026"],
          ],
          minBreite: 1100,
          fussnote: "Herstellerangaben aus den verlinkten Datenblättern, abgerufen am 30.09.2026; Wirkungsgrad der stärksten Leistungsklasse unter Standard-Testbedingungen. Die Hersteller bezeichnen die mechanische Last unterschiedlich (Prüflast, maximale statische Last, zertifizierte Last) – vergleichbar sind nur Werte, die nach derselben Norm ermittelt wurden, siehe Abschnitt [Schnee & Wind](#mechanik). „k. A.“: im Datenblatt nicht angegeben. Formate und Leistungsklassen weichen voneinander ab. Änderungen durch die Hersteller vorbehalten; die Marken gehören ihren jeweiligen Inhabern.",
        },
        {
          typ: "p",
          text: "Die Werte bestätigen die Einordnung oben: Rückkontakt-Module (BC, ABC) erreichen im Dachformat 24 % und mehr, TOPCon-Module liegen bei 22 bis 23 %. Für die Auswahl zählen neben dem Wirkungsgrad die freigegebenen Montagearten und Klemmbereiche, die Hagelwiderstandsklasse und die Garantiebedingungen. Wie Sie das gesamte Angebot prüfen, zeigt die [Checkliste „PV-Firma prüfen“](/ratgeber/photovoltaik-angebot-vergleichen#pv-firma-pruefen).",
        },
      ],
    },
    {
      id: "auswahl",
      titel: "Auswahl-Checkliste für Gewerbe und alpine Lagen",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Gewerbehalle im Flachland", text: "TOPCon, Glas-Folie oder Glas-Glas je nach Statik, Designlast ≥ 3.600 Pa, Hagelklasse passend zur HORA-Gefährdung, Temperaturkoeffizient ≤ −0,30 %/K bei Blechdächern." },
            { titel: "Landwirtschaft und Stall", text: "Glas-Glas mit Ammoniakbeständigkeit (IEC 62716), robuste Rahmen, PID-Resistenz; bei Agri-PV bifaziale Module." },
            { titel: "Alpin und schneereich", text: "Erhöhte Prüflasten und Nachweis zur ungleichmäßigen Schneelast (IEC 62938), Montage nach Herstellerfreigabe, Stützschienen; Frostspannung in der Stringplanung." },
            { titel: "Fassade und Architektur", text: "Glas-Glas, rahmenlos oder mit schmalem Rahmen, Back-Contact oder farbige Gläser; Bauproduktnachweise für BIPV – siehe [Fassade und BIPV](/ratgeber/photovoltaik-fassade-bipv)." },
          ],
        },
        {
          typ: "p",
          text: "Welche Hersteller wir einsetzen und wie wir Module und Wechselrichter kombinieren, zeigt die Seite [Photovoltaikanlage](/produkte/photovoltaikanlage). Die passende Wechselrichtertechnik erklärt der Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Welche Solarzellen-Technologie ist 2026 Standard?",
      a: "TOPCon auf n-Typ-Silizium. Laut Fraunhofer ISE hat es die bis 2023 dominierende PERC-Technik abgelöst. Heterojunction und Back-Contact sind die effizienteren, meist teureren Alternativen.",
    },
    {
      q: "Wie hoch ist der Wirkungsgrad aktueller Solarmodule?",
      a: "Der gewichtete Durchschnitt kristalliner Module lag laut Fraunhofer ISE Ende 2024 bei 22,7 %, die besten Serienmodule erreichten 24,8 %. Im Labor wurden 26,0 % für Silizium-Module gemessen.",
    },
    {
      q: "Sind Glas-Glas-Module besser?",
      a: "Sie sind langlebiger, feuchte- und ammoniakbeständiger und haben oft längere Garantien, sind aber etwas schwerer. Für Stallungen, Freiflächen und Fassaden sind sie meist erste Wahl, für statisch knappe Hallendächer kann Glas-Folie sinnvoller sein.",
    },
    {
      q: "Was bedeutet 5.400 Pa im Datenblatt?",
      a: "Die Prüflast nach IEC 61215 für die Vorderseite. Sie enthält einen Sicherheitsfaktor von mindestens 1,5; die zulässige Designlast beträgt 3.600 Pa – und gilt nur für die freigegebenen Klemmbereiche.",
    },
    {
      q: "Lohnen sich bifaziale Module auf dem Dach?",
      a: "Auf hellen Flachdächern mit ausreichend Abstand zur Dachfläche und bei Freiflächen meist ja, der Mehrertrag liegt je nach Untergrund bei einigen Prozent. Auf dunklen Dächern und bei dachparalleler Montage bringt die Rückseite kaum etwas.",
    },
    {
      q: "Wie lange halten Solarmodule?",
      a: "Hochwertige Module sind für 25 bis 30 Jahre und mehr ausgelegt; Hersteller garantieren meist, dass sie nach 25 bis 30 Jahren noch rund 85 bis 89 % ihrer Nennleistung liefern. Viele Anlagen laufen danach weiter. Wie Betreiber alte Anlagen weiterbetreiben oder erneuern, erklärt der Ratgeber Photovoltaik nach 20 Jahren.",
    },
    {
      q: "Gibt es mehr Förderung für europäische Module?",
      a: "Ja. Beim EAG-Investitionszuschuss erhöht sich die Förderung um 10 %, wenn die Module nachweislich in der EU, im EWR oder in der Schweiz gefertigt wurden, weitere 10 % sind für europäische Wechselrichter möglich.",
    },
  ],

  passend: [
    { href: "/produkte/photovoltaikanlage", titel: "Photovoltaikanlage", text: "Module, Wechselrichter, Unterkonstruktion." },
    { href: "/ratgeber/hagel-photovoltaik", titel: "Hagel und Photovoltaik", text: "Hagelwiderstandsklassen und Versicherung." },
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast und Photovoltaik", text: "Prüflast, Designlast, eHORA." },
    { href: "/produkte/hersteller", titel: "Hersteller bei Ökovolt", text: "Marken, die wir in Österreich verbauen." },
  ],

  quellen: [
    { titel: "Fraunhofer ISE – Photovoltaics Report (14.07.2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
    { titel: "VDMA – International Technology Roadmap for Photovoltaic (ITRPV)", url: "https://www.vdma.org/international-technology-roadmap-photovoltaic", stand: "09/2026" },
    { titel: "IEC 61215-2:2021 – Design qualification and type approval, test procedures", url: "https://webstore.iec.ch/en/publication/61350", stand: "09/2026" },
    { titel: "VKF/EPZ – Hagelwiderstand von Baumaterialien (Hagelwiderstandsklassen)", url: "https://www.hagelregister.at/wp-content/uploads/2018/03/Hagelwiderstand-Baumaterialien_d.pdf", stand: "09/2026" },
    { titel: "EUR-Lex – Verordnung (EU) 2024/3015 über das Verbot von Produkten aus Zwangsarbeit", url: "https://eur-lex.europa.eu/eli/reg/2024/3015/oj", stand: "09/2026" },
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, § 6 (Zuschlag europäische Wertschöpfung)", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40275221/NOR40275221.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Welches Modul passt?", text: "Wir wählen Module nach Dach, Last und Standort.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Module, die zu Ihrem Dach und Standort passen.",
    text: "Wir vergleichen Zelltechnik, Prüflasten, Hagelklassen und Garantien und wählen Module, die auf Ihrem Dach 30 Jahre zuverlässig arbeiten.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Photovoltaikanlage", href: "/produkte/photovoltaikanlage" },
  },
};

export default artikel;
