// Ratgeber: Notstrom und Ersatzstrom mit Photovoltaik (Österreich, Gewerbe/Landwirtschaft/Gemeinden)
// Quellen: TOR Stromerzeugungsanlagen Typ A V1.4 (gültig ab 01.06.2026) – Notstromsysteme < 5 min/Monat
// Netzparallelbetrieb, not-/ersatzstromfähige Umrichter ≤ 30 kVA mit Netztrennzeit ≤ 20 ms (FRT-Ausnahme),
// verriegelte Umschalteinrichtung für Ersatzstromversorgungsanlagen ohne Netzparallelbetrieb, Verweis auf
// OVE E 8101-5-551, OVE E 8101-7-717 und OVE-Richtlinie R 20; asynchrones Wiederzuschalten verhindern;
// vierpolige Abschaltung kann gefordert werden. TOR Verteilernetzanschluss NS V1.3.1 (Speicher).
// GfKV-Leitfaden (Blackout-Dauer in Österreich 10–48 h). Keine Preisangaben.

const artikel = {
  slug: "notstrom-photovoltaik",
  title: "Notstrom mit Photovoltaik: Ersatzstrom und Inselbetrieb für Betriebe",
  seoTitle: "Notstrom mit Photovoltaik: Ersatzstrom & TOR | Ökovolt",
  kurzTitel: "Notstrom mit Photovoltaik",
  description:
    "Notstrom mit PV in Österreich: Unterschied Notstrom, Ersatzstrom, Inselbetrieb, Anforderungen der TOR, Umschaltung, Speicher, Aggregat und Dimensionierung.",
  excerpt:
    "Eine normale PV-Anlage schaltet bei Netzausfall ab. Wie Betriebe, Landwirte und Gemeinden mit Speicher, Umschalteinrichtung und Aggregat eine Ersatzstromversorgung aufbauen – und was die TOR dazu verlangen.",
  hauptKeyword: "notstrom photovoltaik",
  keywords: [
    "Notstrom Photovoltaik",
    "Ersatzstrom PV-Anlage",
    "Inselbetrieb Photovoltaik Österreich",
    "Notstromversorgung Gewerbe",
    "PV Speicher Notstrom Landwirtschaft",
    "TOR Ersatzstromanlage",
    "Notstromaggregat Photovoltaik kombinieren",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/notstrom-photovoltaik.jpg",
  bildAlt: "Stromspeicher mit Umschalteinrichtung für die Ersatzstromversorgung an einer Hauswand",
  badge: { wert: "≤ 20 ms", text: "Netztrennzeit ersatzstromfähiger Umrichter bis 30 kVA laut TOR Typ A" },

  kurzFazit: [
    "**Eine netzgekoppelte PV-Anlage liefert bei Stromausfall keinen Strom – sie muss sich aus Sicherheitsgründen vom Netz trennen.** Notstrom gibt es erst mit ersatzstromfähigem Wechselrichter, Speicher und einer Umschalteinrichtung, die die Anlage allpolig vom öffentlichen Netz trennt.",
    "**Die TOR Stromerzeugungsanlagen (Typ A, Version 1.4, gültig ab 1. Juni 2026) regeln die Netzseite:** Ersatzstromanlagen ohne Netzparallelbetrieb brauchen eine verriegelte Umschaltung, inselbetriebsfähige Anlagen dürfen nach Netzwiederkehr nicht asynchron zuschalten, der Netzbetreiber kann eine vierpolige Trennung verlangen.",
    "**Die Anlage im Gebäude richtet sich nach OVE E 8101** (u. a. Teil 5-551 Stromerzeugungseinrichtungen) und der OVE-Richtlinie R 20 – geplant und errichtet von einem befugten Elektrotechniker.",
    "**Für Betriebe ist die Kombination aus PV, Speicher und Aggregat am robustesten:** Der Speicher überbrückt Sekunden bis Stunden, die PV verlängert tagsüber, das Aggregat sichert Nächte und den Winter. Für einen Blackout rechnet die Gesellschaft für Krisenvorsorge in Österreich mit 10 bis 48 Stunden Stromausfall.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Liefert eine PV-Anlage bei Stromausfall Strom?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Nein – eine normale, netzgekoppelte PV-Anlage schaltet sich bei Netzausfall innerhalb von Sekundenbruchteilen ab, auch wenn die Sonne scheint.** Dafür sorgt der Netz- und Anlagenschutz (NA-Schutz) im Wechselrichter. Er verhindert, dass die Anlage ein vermeintlich spannungsfreies Netz wieder unter Spannung setzt und dort Monteure gefährdet. Damit die Anlage weiterliefert, braucht es eine Ersatzstromversorgung: ein System, das den eigenen Betrieb vom öffentlichen Netz trennt und als kleines Inselnetz weiterversorgt.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Nie ohne Umschalteinrichtung",
          text: "Ein Aggregat oder Speicher, der ohne normgerechte Trennung ins Hausnetz einspeist, kann das öffentliche Netz rückwärts unter Spannung setzen. Das ist lebensgefährlich für Netzmonteure und unzulässig. Ersatzstromanlagen ohne Netzparallelbetrieb brauchen laut TOR eine verriegelte Umschalteinrichtung (Umschaltung mit Unterbrechung).",
        },
      ],
    },
    {
      id: "begriffe",
      titel: "Notstrom, Ersatzstrom, Inselbetrieb: Was ist der Unterschied?",
      tocLabel: "Begriffe",
      bloecke: [
        {
          typ: "p",
          text: "**Die Begriffe werden oft vermischt, beschreiben aber unterschiedliche Qualitäten der Versorgung.** Für die Planung ist entscheidend, wie schnell umgeschaltet wird, welche Verbraucher versorgt werden und ob die PV-Anlage im Inselbetrieb weiter nachladen kann.",
        },
        {
          typ: "tabelle",
          caption: "Begriffe der Not- und Ersatzstromversorgung",
          kopf: ["Begriff", "Bedeutung", "Umschaltzeit", "Typische Anwendung"],
          zeilen: [
            ["Notstromsteckdose", "einzelne Steckdose am Wechselrichter, versorgt nur dort angesteckte Geräte", "manuell, Sekunden bis Minuten", "Kühlschrank, Router, Ladegeräte"],
            ["Ersatzstrom (Backup)", "definierte Stromkreise oder das ganze Gebäude werden automatisch vom Netz getrennt und aus Speicher/PV versorgt", "je nach System wenige Millisekunden bis Sekunden", "Büro, Stall, Kühlung, Heizung"],
            ["USV", "unterbrechungsfreie Stromversorgung, meist Batterie direkt vor dem Verbraucher", "unterbrechungsfrei", "Server, Steuerungen, Medizintechnik"],
            ["Inselbetrieb", "Betrieb eines eigenen Netzes ohne öffentliches Netz, PV lädt den Speicher weiter nach", "–", "Blackout-Vorsorge, Almhütten, abgelegene Objekte"],
            ["Schwarzstartfähigkeit", "System kann aus dem stromlosen Zustand ohne Netz hochfahren", "–", "Voraussetzung für echten Blackout-Betrieb"],
          ],
          minBreite: 720,
        },
        {
          typ: "p",
          text: "Die Begriffe [Ersatzstrom](/wissen/lexikon#ersatzstrom), [Inselbetrieb](/wissen/lexikon#inselbetrieb) und [Notstrom](/wissen/lexikon#notstrom) sind im Lexikon ausführlich erklärt. Für einen Betrieb ist meist eine Ersatzstromversorgung mit Inselbetrieb und Schwarzstartfähigkeit das Ziel – eine Notstromsteckdose ist für Unternehmen selten ausreichend.",
        },
      ],
    },
    {
      id: "tor",
      titel: "Was verlangen Netzbetreiber und TOR?",
      tocLabel: "TOR & Netzbetreiber",
      bloecke: [
        {
          typ: "p",
          text: "**Die Anforderungen an Stromerzeugungsanlagen und Speicher am Netz stehen in den Technischen und organisatorischen Regeln (TOR) der E-Control; für Anlagen unter 250 kW gilt der Teil „TOR Stromerzeugungsanlagen Typ A“ in Version 1.4, gültig ab 1. Juni 2026.** Er enthält mehrere Punkte, die Notstrom- und Ersatzstromanlagen direkt betreffen.",
        },
        {
          typ: "tabelle",
          caption: "Notstrom-relevante Regelungen der TOR Stromerzeugungsanlagen Typ A (Version 1.4)",
          kopf: ["Regelung", "Inhalt", "Bedeutung für die Praxis"],
          zeilen: [
            ["Notstromsysteme", "Anlagen, die als Notstromsysteme installiert sind und weniger als 5 Minuten je Monat netzparallel laufen, sind – bis auf Schutzeinrichtungen und Netzentkupplungsschutz – vom Großteil der TOR ausgenommen", "klassisches Notstromaggregat mit kurzen Probeläufen"],
            ["Kommerzieller Einsatz", "Nutzt ein Notstromsystem über die Grundfunktion hinaus kommerziell (z. B. Lastspitzenkappung), legt der Netzbetreiber die Anforderungen fest", "Aggregat für Peak Shaving vorher abstimmen"],
            ["Ersatzstromfähige Umrichter", "bis 30 kVA mit Netztrennzeit ≤ 20 ms von der vollständigen FRT-Fähigkeit ausgenommen, müssen sich bis zur Trennung aber an der Netzstützung beteiligen", "typische Speicher-/Hybridsysteme im Gewerbe"],
            ["Verriegelte Umschaltung", "Ersatzstromanlagen ohne Netzparallelbetrieb sind mit verriegelter Umschalteinrichtung (Umschaltung mit Unterbrechung) auszurüsten", "Aggregat-Einspeisung nur über Umschalter"],
            ["Wiederzuschaltung", "Bei inselbetriebsfähigen Anlagen inkl. Speicher ist ein asynchrones Wiederzuschalten nach Netzwiederkehr zu verhindern", "Synchronisations- bzw. Verriegelungslogik"],
            ["Entkupplungsstelle", "Bei inselbetriebsfähigen Anlagen im Niederspannungsnetz kann der Netzbetreiber eine vierpolige Abschaltung fordern (Trennung und Erdung des PEN-Leiters beachten)", "Erdungskonzept im Inselbetrieb planen"],
          ],
          minBreite: 740,
          fussnote: "Zusammenfassung ausgewählter Punkte, Quelle: E-Control, TOR Stromerzeugungsanlagen Typ A V1.4. Für Anlagen ab 250 kW gelten die TOR-Teile Typ B bis D. Maßgeblich sind der Originaltext und die Vorgaben des jeweiligen Netzbetreibers.",
        },
        {
          typ: "p",
          text: "Die TOR verweisen für Stromerzeugungsanlagen, die eine umschaltbare Alternative zur öffentlichen Versorgung darstellen, auf die OVE E 8101 (u. a. Teil 5-551) und die OVE-Richtlinie R 20. Die Versorgungsqualität im Inselbetrieb liegt ausdrücklich in der Verantwortung des Anlagenbetreibers. Speicher werden zusätzlich wie Stromerzeugungsanlagen angemeldet – den Ablauf beschreiben die Ratgeber [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden) und [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss).",
        },
      ],
    },
    {
      id: "technik",
      titel: "Wie ist eine Ersatzstromversorgung mit PV aufgebaut?",
      tocLabel: "Aufbau & Technik",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Ersatzstromversorgung mit PV besteht aus vier Kernkomponenten: ersatzstromfähigem Wechselrichter oder Batteriewechselrichter, Speicher, automatischer Netztrennung und einem Konzept für kritische Verbraucher.** Für längere Ausfälle kommt ein Aggregat hinzu. Wichtig ist, dass der Wechselrichter im Inselbetrieb ein stabiles Netz bildet und die PV-Anlage über Frequenz- oder Kommunikationssteuerung drosseln kann, wenn der Speicher voll ist.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "DC-gekoppelter Hybridwechselrichter", text: "PV und Speicher an einem Gerät, integrierte Ersatzstromfunktion. Einfach und effizient, typisch bis in den unteren zweistelligen kW-Bereich. Mehr zum [Hybridwechselrichter](/wissen/lexikon#hybridwechselrichter)." },
            { titel: "AC-gekoppeltes System", text: "Bestehende PV-Wechselrichter bleiben, ein Batteriewechselrichter bildet das Inselnetz und regelt die PV über die Netzfrequenz ab. Gut für Nachrüstung und größere Gewerbeanlagen." },
            { titel: "Gewerbespeicher mit Netzumschaltung", text: "Speichersysteme ab rund 50 kWh mit eigenem Trennschalter vor der Hauptverteilung. Versorgen ganze Betriebsteile und übernehmen im Alltag Peak Shaving." },
            { titel: "Aggregat + PV + Speicher", text: "Aggregat bildet bei Bedarf das Netz oder lädt den Speicher; PV reduziert Treibstoffverbrauch. Braucht abgestimmte Regelung, damit PV das Aggregat nicht rückspeist." },
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum PV allein im Inselbetrieb nicht funktioniert",
          text: "PV-Wechselrichter folgen der Netzspannung – sie bilden selbst kein Netz. Im Inselbetrieb braucht es daher einen netzbildenden Speicherwechselrichter oder ein Aggregat. Erst dann kann die PV mitlaufen, und nur so viel einspeisen, wie Verbraucher und Speicher aufnehmen. Ohne Regelung schaltet das System bei Überschuss ab.",
        },
      ],
    },
    {
      id: "dimensionierung",
      titel: "Wie groß muss die Notstromversorgung für einen Betrieb sein?",
      tocLabel: "Dimensionierung",
      bloecke: [
        {
          typ: "p",
          text: "**Dimensioniert wird nicht nach Gesamtverbrauch, sondern nach kritischen Lasten: Welche Verbraucher müssen wie lange laufen, damit Menschen, Tiere, Waren und Daten geschützt sind?** Leistung (kW) bestimmt Wechselrichter und Aggregat, Energie (kWh) den Speicher. Anlaufströme von Motoren, Pumpen und Kompressoren sind oft das Nadelöhr.",
        },
        {
          typ: "tabelle",
          caption: "Kritische Lasten nach Branche (Beispiele zur Orientierung)",
          kopf: ["Branche", "Kritische Verbraucher", "Worauf achten"],
          zeilen: [
            ["Landwirtschaft (Milchvieh)", "Melkanlage, Milchkühlung, Tränke, Stalllüftung, Futtermischung", "Melkzeiten fix, Kühlung innerhalb weniger Stunden nötig, hohe Anlaufströme"],
            ["Schweine-/Geflügelhaltung", "Lüftung, Heizung, Fütterung, Alarmanlage", "Lüftungsausfall ist in Minuten kritisch – Aggregat meist unverzichtbar"],
            ["Lebensmittelhandel, Gastronomie", "Kühl- und Tiefkühlzellen, Kassen, Beleuchtung", "Kühlkette dokumentieren, Türöffnungen minimieren"],
            ["Hotellerie", "Heizung/Warmwasser, Aufzüge, Notbeleuchtung, Küche, IT", "Gästesicherheit, Kommunikation, Wasserversorgung"],
            ["Gewerbe/Industrie", "Steuerungen, IT, Server, Brandmeldeanlage, geordnetes Herunterfahren", "Prozesse sicher beenden statt weiterproduzieren"],
            ["Gemeinde", "Amtsgebäude als Anlaufstelle, Wasserversorgung, Abwasserpumpen, Feuerwehrhaus", "Teil des Blackout-Konzepts der Gemeinde"],
          ],
          minBreite: 700,
        },
        {
          typ: "ablauf",
          schritte: [
            ["Lastliste erstellen", "Alle kritischen Verbraucher mit Nennleistung, Anlaufstrom und benötigter Laufzeit erfassen – Lastgangdaten helfen."],
            ["Prioritäten setzen", "Stufe 1 (sofort, unterbrechungsfrei), Stufe 2 (nach Minuten), Stufe 3 (verzichtbar). Stromkreise entsprechend trennen."],
            ["Leistung auslegen", "Wechselrichter- bzw. Aggregatleistung inkl. Reserve für Anlaufströme; Schieflast bei einphasigen Verbrauchern beachten."],
            ["Energie auslegen", "Speicher für die Überbrückung bis Aggregatstart bzw. über die Nacht; im Winter mit wenig PV-Nachladung rechnen."],
            ["Betrieb organisieren", "Probeläufe, Treibstoffvorrat, Zuständigkeiten, Unterweisung – und regelmäßig testen."],
          ],
        },
        {
          typ: "p",
          text: "Die Größe des Speichers bestimmt auch den Alltagsnutzen: Ein Gewerbespeicher, der im Normalbetrieb Lastspitzen kappt und Eigenverbrauch erhöht, rechnet sich besser als eine reine Notstrombatterie. Hintergründe liefern die Ratgeber [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten) und [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis) sowie die Seite [Gewerbespeicher](/gewerbespeicher).",
        },
      ],
    },
    {
      id: "winter",
      titel: "Reicht PV im Winter für den Notbetrieb?",
      tocLabel: "Winter & Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Im Winter reicht PV allein selten – im Dezember und Jänner erzeugt eine Anlage in Österreich nur einen kleinen Bruchteil ihres Jahresertrags, und Schnee kann die Module tagelang bedecken.** Wer auch im Winter mehrere Tage überbrücken muss, braucht ein Aggregat oder ein striktes Lastmanagement mit wenigen, priorisierten Verbrauchern.",
        },
        {
          typ: "liste",
          punkte: [
            "**Sommer:** PV kann Speicher tagsüber vollständig nachladen – mehrtägiger Inselbetrieb ist mit angepasster Last realistisch.",
            "**Übergangszeit:** PV deckt einen Teil, das Aggregat läuft kürzer und spart Treibstoff.",
            "**Winter:** Speicher überbrückt Stunden, das Aggregat trägt die Hauptlast; schneebedeckte Module liefern nichts.",
            "**Heizung:** Wärmepumpen haben hohe Leistung und Anlaufströme – im Notbetrieb gezielt einplanen oder auf Frostschutz beschränken, siehe [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
          ],
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet eine Ersatzstromversorgung – und wann rechnet sie sich?",
      tocLabel: "Kosten & Nutzen",
      bloecke: [
        {
          typ: "p",
          text: "**Die Kosten einer Ersatzstromversorgung werden vor allem von der geforderten Leistung, der Überbrückungsdauer und dem Umbauaufwand in der Verteilung bestimmt – nicht vom PV-Generator.** Eine Notstromfunktion für ausgewählte Stromkreise ist mit einem ohnehin geplanten Speicher vergleichsweise günstig; die Versorgung eines ganzen Betriebs mit großen Motoren erfordert dagegen leistungsstarke Wechselrichter, Umschalttechnik auf Hauptverteilerebene und meist ein Aggregat.",
        },
        {
          typ: "liste",
          punkte: [
            "**Doppelnutzen einplanen:** Ein Speicher, der im Alltag Eigenverbrauch erhöht und Lastspitzen senkt, finanziert die Notstromfunktion teilweise mit.",
            "**Schaden gegenrechnen:** Verdorbene Ware, Tierverluste, Produktionsausfall und Datenverlust bei einem mehrstündigen Ausfall sind der Maßstab – nicht der Strompreis.",
            "**Umbau der Verteilung** (Trennung kritischer Stromkreise, Umschalter, Erdungskonzept) ist oft der größte Einzelposten und sollte früh bewertet werden.",
            "**Förderungen** gibt es in Österreich vor allem für Speicher in Verbindung mit PV; reine Notstromaggregate werden selten gefördert. Aktuelle Programme zeigt der [Förder-Check](/foerdercheck).",
          ],
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Notstrom mit PV planen",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Ziel definieren: Notstromsteckdose, Ersatzstrom für Teilbereiche oder ganzer Betrieb, Überbrückungsdauer.",
            "Kritische Lasten mit Leistung, Anlaufstrom und Laufzeit erfassen; Stromkreise für den Ersatzstrombetrieb trennen.",
            "Ersatzstromfähigen, netzbildenden Wechselrichter bzw. Speicher wählen; Schwarzstartfähigkeit prüfen.",
            "Automatische Netztrennung und Verriegelung nach TOR und OVE E 8101, Erdungskonzept für den Inselbetrieb.",
            "Aggregat-Anschluss mit verriegeltem Umschalter vorsehen, Einspeisung der PV ins Aggregat verhindern.",
            "Anmeldung von Speicher und geänderter Anlage beim Netzbetreiber; Versicherung informieren.",
            "Brandschutz für Speicher und Treibstofflager (Aufstellraum, Abstände, Belüftung).",
            "Regelmäßige Tests unter Last, Unterweisung der Mitarbeitenden, Dokumentation im Anlagenbuch.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Einmal im Jahr den Ernstfall proben",
          text: "Ein Notstromsystem, das nie getestet wurde, ist eine Annahme, keine Vorsorge. Planen Sie mindestens jährlich einen Umschalttest unter realer Last – idealerweise gemeinsam mit der Blackout-Übung Ihres Betriebs oder Ihrer Gemeinde. Wie ein vollständiges Krisenkonzept aussieht, zeigt der Ratgeber [Blackout-Vorsorge für Unternehmen](/ratgeber/blackout-vorsorge-unternehmen).",
        },
        {
          typ: "p",
          text: "Ökovolt plant und errichtet [Notstrom- und Ersatzstromlösungen](/service/notstrom) mit PV und Speicher für Gewerbe, Landwirtschaft und Gemeinden in ganz Österreich – von der Lastanalyse über die Abstimmung mit dem Netzbetreiber bis zur Inbetriebnahme mit Prüfbefund.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Funktioniert meine PV-Anlage bei Stromausfall?",
      a: "Nicht ohne Zusatztechnik. Netzgekoppelte Wechselrichter schalten bei Netzausfall aus Sicherheitsgründen ab. Erst ein ersatzstromfähiger Wechselrichter mit Speicher und automatischer Netztrennung ermöglicht die Weiterversorgung.",
    },
    {
      q: "Was ist der Unterschied zwischen Notstrom und Ersatzstrom?",
      a: "Umgangssprachlich wird beides gleich verwendet. Fachlich meint Notstrom oft eine einfache Notstromsteckdose, Ersatzstrom die automatische Versorgung ganzer Stromkreise oder Gebäude über eine Netztrennung. Für Betriebe ist Ersatzstrom mit Inselbetrieb die sinnvolle Lösung.",
    },
    {
      q: "Muss ich eine Ersatzstromanlage beim Netzbetreiber melden?",
      a: "Speicher und Änderungen an der Erzeugungsanlage sind anzumelden. Die TOR Stromerzeugungsanlagen regeln, welche Anforderungen gelten – etwa verriegelte Umschaltung oder die Verhinderung asynchroner Wiederzuschaltung. Die Anmeldung übernimmt der Elektrotechniker.",
    },
    {
      q: "Wie lange reicht ein Speicher bei Stromausfall?",
      a: "Das hängt von Kapazität, Last und Jahreszeit ab. Im Sommer kann die PV den Speicher tagsüber nachladen, im Winter kaum. Für mehrtägige Ausfälle braucht ein Betrieb meist zusätzlich ein Aggregat.",
    },
    {
      q: "Kann ich ein Notstromaggregat mit der PV-Anlage kombinieren?",
      a: "Ja, wenn die Regelung abgestimmt ist. Das Aggregat bildet das Netz oder lädt den Speicher, die PV spart Treibstoff. Eine Rückspeisung der PV in das Aggregat muss verhindert werden, und der Anschluss erfolgt über eine verriegelte Umschalteinrichtung.",
    },
    {
      q: "Ist eine Notstromversorgung für landwirtschaftliche Betriebe sinnvoll?",
      a: "Für Tierhaltung ist sie oft unverzichtbar: Lüftung, Melk- und Kühltechnik dürfen nicht lange ausfallen. PV mit Speicher überbrückt kurze Ausfälle und reduziert den Treibstoffbedarf, ein Aggregat sichert längere Ausfälle ab.",
    },
    {
      q: "Darf ich im Inselbetrieb Strom ins Netz einspeisen?",
      a: "Nein. Während eines Netzausfalls muss die Anlage allpolig vom öffentlichen Netz getrennt sein. Nach Netzwiederkehr darf sie nur synchron und nach den Zuschaltbedingungen der TOR wieder parallel gehen.",
    },
  ],

  passend: [
    { href: "/service/notstrom", titel: "Notstrom & Blackout-Vorsorge", text: "Ersatzstrom mit PV, Speicher und Aggregat." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicher für Eigenverbrauch, Peak Shaving und Ersatzstrom." },
    { href: "/ratgeber/blackout-vorsorge-unternehmen", titel: "Blackout-Vorsorge", text: "Krisenplan für Betriebe und Gemeinden." },
    { href: "/ratgeber/gewerbespeicher-kosten", titel: "Gewerbespeicher Kosten", text: "Was ein Speicher im Betrieb kostet." },
  ],

  quellen: [
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.4 (gültig ab 01.06.2026)", url: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+%287%29.pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", stand: "06/2026" },
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "E-Control – Übersicht TOR (Technische und organisatorische Regeln)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "OVE – OVE E 8101:2025, Errichtungsbestimmungen für Niederspannungsanlagen", url: "https://www.ove.at/ove-standardization/normen-produkte/ove-e-8101/", stand: "09/2026" },
    { titel: "OVE – Richtlinien (u. a. R 20, Prüfanforderungen an Erzeugungseinheiten)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
    { titel: "Gesellschaft für Krisenvorsorge – Leitfaden für die Blackout-Vorsorge in Unternehmen und Organisationen", url: "https://gfkv.org/wp-content/uploads/2024/03/GfKV-Leitfaden-fuer-die-Blackout-Vorsorge-in-Unternehmen-und-Organisationen.pdf", stand: "03/2024" },
  ],

  seitenCta: { titel: "Ersatzstrom planen?", text: "Lastanalyse, Speicher und Umschaltung aus einer Hand.", href: "/service/notstrom", label: "Notstrom anfragen" },
  cta: {
    title: "Strom, wenn das Netz ausfällt – mit PV, Speicher und Konzept.",
    text: "Ökovolt aus Ostermiething (OÖ) plant Ersatzstromlösungen für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich – abgestimmt mit Ihrem Netzbetreiber.",
    primary: { label: "Notstrom anfragen", href: "/service/notstrom" },
    secondary: { label: "Gewerbespeicher", href: "/gewerbespeicher" },
  },
};

export default artikel;
