// Ratgeber: Ablauf einer PV-Installation – von der Anfrage bis zur
// Inbetriebnahme, mit Dauer je Schritt und Aufgaben des Kunden.

import { VERGUETUNG } from "@/data/einspeiseverguetung";

const SCHRITTE = [
  ["Anfrage & Vorabcheck", "Verbrauch, Dachdaten und Fotos übermitteln; erste Einschätzung zu Größe und Machbarkeit."],
  ["Vor-Ort-Termin", "Dach, Statik, Verschattung, Zählerschrank und Kabelwege werden geprüft."],
  ["Angebot & Planung", "Belegungsplan, Komponenten, Ertragsprognose und Festpreis; Sie vergleichen und entscheiden."],
  ["Förderung & Finanzierung", "Zuschüsse oder KfW-Kredit beantragen – meist vor Auftragserteilung."],
  ["Netzanfrage", "Der Fachbetrieb stellt das Anschlussbegehren beim Netzbetreiber und wartet auf die Zusage."],
  ["Montage", "Gerüst, Unterkonstruktion, Module, Wechselrichter, Speicher und Elektroanschluss."],
  ["Inbetriebnahme & Fertigmeldung", "Messungen, Protokoll, Einweisung; Fertigmeldung an den Netzbetreiber."],
  ["Zählertausch & Registrierung", "Zweirichtungszähler oder Smart Meter wird gesetzt; Eintrag im Marktstammdatenregister."],
];

const artikel = {
  slug: "photovoltaik-ablauf",
  title: "PV-Anlage Ablauf: Von der Anfrage bis zur Inbetriebnahme 2026",
  seoTitle: "Photovoltaik Installation: Ablauf & Dauer | Ökovolt",
  kurzTitel: "Ablauf der PV-Installation",
  description:
    "Photovoltaik-Installation Ablauf: alle 8 Schritte von der Anfrage bis zur Inbetriebnahme, Dauer je Schritt, Fristen und was Sie selbst erledigen müssen.",
  excerpt:
    "Wie lange dauert es, bis die eigene Solaranlage Strom liefert? Alle Schritte mit realistischen Zeiten, gesetzlichen Fristen und einer Checkliste für Ihre Aufgaben.",
  hauptKeyword: "photovoltaik installation ablauf",
  keywords: ["PV-Anlage Ablauf", "Photovoltaik Montage Dauer", "Wie lange dauert die Installation einer PV-Anlage", "PV-Anlage Inbetriebnahme", "Solaranlage Installation Schritte", "PV-Anlage Netzanmeldung Dauer"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Team/download-1.jpg",
  bildAlt: "Monteure installieren Solarmodule auf einem Dach",
  badge: { wert: "2–5 Monate", text: "typisch von der Anfrage bis zum Netzanschluss" },

  kurzFazit: [
    "**Von der ersten Anfrage bis zur fertig angeschlossenen PV-Anlage vergehen 2026 meist zwei bis fünf Monate.** Die Montage selbst dauert beim Einfamilienhaus nur ein bis drei Tage.",
    "Die längsten Wartezeiten entstehen bei der **Netzanfrage** (bis zu acht Wochen gesetzliche Prüffrist) und beim **Zählertausch** durch den Messstellenbetreiber.",
    "Sie selbst müssen vor allem **Unterlagen liefern, Förderung rechtzeitig beantragen** und die Anlage **innerhalb eines Monats** im Marktstammdatenregister eintragen – sofern das nicht der Fachbetrieb übernimmt.",
    `Für die Einspeisevergütung zählt das **Datum der Inbetriebnahme**. Die Sätze sinken halbjährlich, der nächste Stichtag ist der ${VERGUETUNG.naechsteAnpassungLabel}.`,
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Wie läuft die Installation einer PV-Anlage ab?",
      tocLabel: "Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Die Installation einer Photovoltaikanlage läuft in acht Schritten ab: Anfrage, Vor-Ort-Termin, Angebot, Förderung, Netzanfrage, Montage, Inbetriebnahme und Zählertausch mit Registrierung.** Den größten Teil übernimmt ein Fachbetrieb, der Planung, Montage und Anmeldung aus einer Hand anbietet. Ihre Aufgaben konzentrieren sich auf die Entscheidung, die Unterlagen und die Förderanträge.",
        },
        { typ: "ablauf", schritte: SCHRITTE },
        {
          typ: "tabelle",
          caption: "Realistische Dauer je Schritt beim Einfamilienhaus, Stand September 2026",
          kopf: ["Schritt", "Typische Dauer", "Wer ist zuständig?", "Ihre Aufgabe"],
          zeilen: [
            ["1. Anfrage & Vorabcheck", "wenige Tage", "Fachbetrieb", "Stromrechnung, Dachfotos, Adresse"],
            ["2. Vor-Ort-Termin", "1–3 Wochen bis zum Termin", "Fachbetrieb", "Zugang zu Dachboden und Zählerschrank"],
            ["3. Angebot & Planung", "1–3 Wochen", "Fachbetrieb, Sie", "Angebote vergleichen, Fragen klären"],
            ["4. Förderung & Finanzierung", "1–6 Wochen", "Sie, ggf. Hausbank", "Anträge vor Auftrag stellen"],
            ["5. Netzanfrage", "2–8 Wochen", "Fachbetrieb, Netzbetreiber", "Vollmacht unterschreiben"],
            ["6. Montage", "1–3 Tage (plus Gerüst)", "Fachbetrieb", "Zufahrt, Stellfläche, Strom und Zugang"],
            ["7. Inbetriebnahme", "am letzten Montagetag", "Fachbetrieb", "Einweisung, App einrichten"],
            ["8. Zählertausch & MaStR", "2–6 Wochen nach Fertigmeldung", "Messstellenbetreiber, Sie/Fachbetrieb", "Termin wahrnehmen, Registrierung prüfen"],
          ],
          hervorheben: 1,
          minBreite: 700,
          fussnote: "Die Dauer schwankt je nach Auslastung des Fachbetriebs, Netzbetreiber und Jahreszeit. Schritte 4 und 5 laufen in der Praxis oft parallel. Mit Speicher, Wallbox oder Zählerschrank-Erneuerung kann ein zusätzlicher Arbeitstag nötig werden.",
        },
        {
          typ: "kennzahl",
          wert: "1–3 Tage",
          titel: "dauert die eigentliche Montage",
          text: "Ein Großteil der Gesamtzeit sind Wartezeiten auf Termine, Zusagen und den Zählertausch – nicht die Arbeit auf dem Dach.",
        },
      ],
    },
    {
      id: "planung",
      titel: "Schritt 1 bis 3: Anfrage, Vor-Ort-Termin und Angebot",
      tocLabel: "Anfrage & Planung",
      bloecke: [
        {
          typ: "p",
          text: "**In der Planungsphase entscheidet sich, ob die Anlage wirtschaftlich zu Ihrem Haus passt.** Je besser Ihre Unterlagen sind, desto schneller entsteht ein belastbares Angebot. Eine erste Orientierung zu Größe, Ertrag und Amortisation liefert vorab der [Solarrechner](/solarrechner).",
        },
        { typ: "h3", text: "Diese Unterlagen beschleunigen die Planung" },
        {
          typ: "checkliste",
          punkte: [
            "**Letzte Stromjahresabrechnung** mit Jahresverbrauch und Zählernummer",
            "**Fotos** von Dach, Dachboden, Zählerschrank (geöffnet) und Hausanschluss",
            "**Baujahr und Dacheindeckung**, idealerweise Grundriss oder Bauplan mit Dachmaßen",
            "**Pläne für Wärmepumpe, E-Auto oder Wallbox** in den nächsten Jahren",
            "**Besonderheiten** wie Denkmalschutz, Bebauungsplan oder anstehende Dachsanierung",
          ],
        },
        { typ: "h3", text: "Was beim Vor-Ort-Termin geprüft wird" },
        {
          typ: "p",
          text: "Der Fachbetrieb prüft Dachzustand und Statik, misst Verschattungen durch Kamine, Gauben oder Bäume, beurteilt den Zählerschrank und legt Kabelwege sowie den Platz für Wechselrichter und Speicher fest. Besonders der Zählerschrank ist ein häufiger Kostenfaktor: Ältere Anlagen entsprechen oft nicht mehr der [VDE-AR-N 4100](/wissen/lexikon#vde-ar-n-4100) und müssen erneuert werden.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Angebote vergleichbar machen",
          text: "Achten Sie darauf, dass Gerüst, Zählerschrank, Netzanmeldung und Inbetriebnahme im Angebot enthalten sind und alle Komponenten mit Hersteller und Modell genannt werden. Wie Sie dabei vorgehen, zeigt unser Ratgeber [PV-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Schritt 4: Förderung und Finanzierung rechtzeitig beantragen",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Förderanträge müssen in der Regel gestellt werden, bevor Sie den Auftrag erteilen.** Wer zuerst unterschreibt und dann beantragt, verliert bei vielen Programmen den Anspruch. Das gilt für die meisten kommunalen Zuschüsse ebenso wie für den KfW-Kredit 270, der über die Hausbank beantragt wird.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Nullsteuersatz", text: "Kein Antrag nötig: Für PV-Anlagen und Speicher auf Wohngebäuden fallen 0 % Umsatzsteuer an. Details unter [steuerliche Vorteile](/forderungen/steuerlich)." },
            { titel: "KfW-Kredit 270", text: "Zinsgünstiger Kredit für PV und Speicher, zu beantragen über die Hausbank vor Beginn des Vorhabens." },
            { titel: "Land & Kommune", text: "Zuschüsse für Speicher, Wallboxen oder Dachanlagen – je nach Wohnort. Überblick unter [Landesförderungen](/forderungen/landesforderungen)." },
          ],
        },
        {
          typ: "tool",
          href: "/foerdercheck",
          titel: "Welche Förderung gilt bei Ihnen?",
          text: "Bundesland, Vorhaben und Postleitzahl eingeben – der Förder-Check zeigt passende Programme und worauf Sie beim Antrag achten müssen.",
          label: "Zum Förder-Check",
        },
      ],
    },
    {
      id: "netzanfrage",
      titel: "Schritt 5: Netzanfrage beim Netzbetreiber",
      tocLabel: "Netzanfrage",
      bloecke: [
        {
          typ: "p",
          text: "**Vor der Montage stellt der Fachbetrieb beim örtlichen Netzbetreiber ein Netzanschlussbegehren – für Einfamilienhäuser dauert die Zusage meist zwei bis acht Wochen.** Der Netzbetreiber prüft, ob das Netz die zusätzliche Einspeisung aufnehmen kann. Die Anfrage läuft heute fast überall über ein Online-Portal; Sie unterschreiben dafür in der Regel nur eine Vollmacht.",
        },
        {
          typ: "tabelle",
          caption: "Gesetzliche Fristen für den Netzbetreiber nach § 8 EEG",
          kopf: ["Situation", "Frist", "Folge bei Überschreitung"],
          zeilen: [
            ["Eingang des Netzanschlussbegehrens", "unverzüglich einen genauen Zeitplan übermitteln", "–"],
            ["Anlagen bis 30 kW auf einem Grundstück mit bestehendem Netzanschluss", "Zeitplan innerhalb eines Monats", "Anlage darf unter Einhaltung der technischen Regeln angeschlossen werden"],
            ["Netzverträglichkeitsprüfung", "spätestens acht Wochen nach Eingang der erforderlichen Informationen", "nachhaken; bei Streit kann die Clearingstelle EEG|KWKG vermitteln"],
          ],
          minBreite: 640,
          fussnote: "Vereinfachte Darstellung von § 8 Abs. 5 und 6 EEG, Stand September 2026. Die Fristen beginnen erst, wenn alle nötigen Unterlagen vollständig vorliegen.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Solarspitzengesetz: Was bei neuen Anlagen gilt",
          text: "Neue Anlagen dürfen bis zum Einbau eines intelligenten Messsystems mit Steuereinrichtung höchstens 60 % ihrer Modulleistung einspeisen, und in Zeiten negativer Börsenpreise gibt es keine Vergütung. Bei Anlagen über 7 kW ist ein Smart Meter mit Steuerbox vorgesehen. Die Einspeisebegrenzung stellt der Fachbetrieb bei der Inbetriebnahme ein – mehr dazu im Lexikon unter [Einspeisebegrenzung](/wissen/lexikon#einspeisebegrenzung).",
        },
      ],
    },
    {
      id: "montage",
      titel: "Schritt 6: Die Montage Tag für Tag",
      tocLabel: "Montage",
      bloecke: [
        {
          typ: "p",
          text: "**Die Montage einer PV-Anlage auf einem Einfamilienhaus dauert meist ein bis drei Arbeitstage.** Das Gerüst wird oft am Vortag gestellt. Ein typischer Ablauf bei einer 10-kWp-Anlage mit Speicher:",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Vortag: Gerüst und Material", "Gerüst mit Absturzsicherung wird aufgebaut, Module und Unterkonstruktion angeliefert."],
            ["Tag 1: Unterkonstruktion und Module", "Dachhaken werden gesetzt, Schienen montiert, Module verlegt und zu Strings verkabelt."],
            ["Tag 2: Wechselrichter, Speicher, Zählerschrank", "Elektrofachkräfte montieren Wechselrichter und Speicher, verlegen die Leitungen und bauen den Zählerschrank um oder neu."],
            ["Tag 2 oder 3: Prüfung und Inbetriebnahme", "Isolations- und Stringmessungen, Einstellung der Einspeisebegrenzung, Einrichtung von Monitoring und App, Einweisung."],
            ["Danach: Gerüstabbau", "Das Gerüst wird meist in den Folgetagen abgeholt."],
          ],
        },
        {
          typ: "p",
          text: "Während der Montage wird der Strom im Haus für einige Stunden abgeschaltet, meist beim Umbau des Zählerschranks. Planen Sie das ein, wenn Sie im Homeoffice arbeiten oder Geräte mit Dauerbetrieb haben. Bei starkem Wind, Regen oder Glätte darf aus Arbeitsschutzgründen nicht auf dem Dach gearbeitet werden – im Winter verschieben sich Termine deshalb häufiger.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Zufahrt und Stellfläche** für Lieferwagen und Gerüst freihalten",
            "**Zugang** zu Dachboden, Keller, Zählerschrank und Aufstellort des Speichers ermöglichen",
            "**WLAN-Zugangsdaten** für Wechselrichter und Monitoring bereithalten",
            "**Nachbarn informieren**, wenn das Gerüst auf deren Grundstück reicht",
          ],
        },
      ],
    },
    {
      id: "inbetriebnahme",
      titel: "Schritt 7 und 8: Inbetriebnahme, Zählertausch und Registrierung",
      tocLabel: "Inbetriebnahme",
      bloecke: [
        {
          typ: "p",
          text: "**Mit der Inbetriebnahme erzeugt die Anlage erstmals Strom – dieses Datum bestimmt die Höhe der Einspeisevergütung für 20 Jahre.** Der Fachbetrieb dokumentiert sie im Inbetriebsetzungsprotokoll und schickt die Fertigmeldung an den Netzbetreiber. Danach setzt der Messstellenbetreiber den Zweirichtungszähler oder das intelligente Messsystem; das dauert in der Praxis meist zwei bis sechs Wochen.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Einspeisen erst nach Freigabe",
          text: "Ob die Anlage vor dem Zählertausch schon laufen darf, regeln die Netzbetreiber unterschiedlich. Halten Sie sich an die Vorgaben aus der Netzzusage und an die Hinweise Ihres Fachbetriebs. Das Inbetriebnahmedatum für die Vergütung bleibt davon unberührt, wenn es korrekt dokumentiert ist.",
        },
        { typ: "h3", text: "Marktstammdatenregister: Frist ein Monat" },
        {
          typ: "p",
          text: "Jede PV-Anlage und jeder Speicher muss innerhalb eines Monats nach Inbetriebnahme im [Marktstammdatenregister](/wissen/lexikon#marktstammdatenregister) der Bundesnetzagentur eingetragen werden. Ohne Eintrag kann der Anspruch auf Einspeisevergütung ruhen. Viele Fachbetriebe übernehmen die Registrierung; lassen Sie sich die Bestätigung mit der MaStR-Nummer geben, denn diese brauchen Netzbetreiber und gegebenenfalls das Finanzamt.",
        },
        { typ: "h3", text: "Und das Finanzamt?" },
        {
          typ: "p",
          text: "Für typische Anlagen auf Einfamilienhäusern ist meist keine Anmeldung beim Finanzamt mehr nötig: Erträge aus Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit sind nach § 3 Nr. 72 EStG steuerfrei, und wer die Kleinunternehmerregelung nutzt, muss laut BMF-Schreiben keinen Fragebogen zur steuerlichen Erfassung einreichen. Das Finanzamt kann ihn im Einzelfall trotzdem anfordern. Mehr dazu unter [steuerliche Vorteile](/forderungen/steuerlich).",
        },
      ],
    },
    {
      id: "verzoegerungen",
      titel: "Typische Verzögerungen und wie Sie sie vermeiden",
      tocLabel: "Verzögerungen",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten Verzögerungen entstehen durch fehlende Unterlagen, einen veralteten Zählerschrank und Wartezeiten beim Netz- oder Messstellenbetreiber.** Einiges davon können Sie beeinflussen:",
        },
        {
          typ: "tabelle",
          caption: "Häufige Ursachen für Verzögerungen",
          kopf: ["Ursache", "Auswirkung", "Was hilft"],
          zeilen: [
            ["Unvollständige Unterlagen", "Netzanfrage startet später, Fristen laufen nicht", "Stromrechnung, Fotos und Vollmacht früh bereitstellen"],
            ["Zählerschrank muss erneuert werden", "zusätzlicher Arbeitstag, ggf. Abstimmung mit Netzbetreiber", "beim Vor-Ort-Termin klären und im Angebot festhalten"],
            ["Förderantrag zu spät", "Förderung entfällt oder Auftrag muss warten", "Programme vor Unterschrift prüfen"],
            ["Wetter", "Dacharbeiten werden verschoben", "Puffer einplanen, vor allem November bis Februar"],
            ["Zählertausch dauert", "Einspeisung verzögert sich", "beim Messstellenbetreiber nachhaken, Fertigmeldung vollständig einreichen"],
            ["Nachträgliche Änderungen", "neue Planung und ggf. neue Netzanfrage", "Speicher, Wallbox und Wärmepumpe von Anfang an mitdenken"],
          ],
          minBreite: 640,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Speicher und Wallbox gleich mitplanen",
          text: "Wer einen [Stromspeicher](/produkte/stromspeicher) oder eine [Wallbox](/produkte/wallbox) später nachrüstet, braucht oft einen zweiten Termin, teils eine neue Anmeldung und manchmal einen anderen Wechselrichter. Auch wenn Sie erst in einigen Jahren kaufen: Ein speicherfähiger Hybridwechselrichter und Platz im Zählerschrank sparen später Zeit und Geld.",
        },
      ],
    },
    {
      id: "nach-der-installation",
      titel: "Nach der Installation: Die ersten Wochen mit der Anlage",
      tocLabel: "Nach der Installation",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Unterlagen ablegen:** Inbetriebsetzungsprotokoll, Datenblätter, Stringplan, Garantiebedingungen und MaStR-Bestätigung",
            "**Monitoring prüfen:** Stimmen die Tageserträge grob mit der Prognose überein? Fehlermeldungen sofort melden.",
            "**Versicherung informieren:** Anlage in die Wohngebäudeversicherung aufnehmen oder separat versichern",
            "**Zählerstände notieren** am Tag des Zählertauschs – für die erste Abrechnung mit Netzbetreiber und Stromlieferant",
            "**Verbrauch verschieben:** Waschmaschine, Spülmaschine und Wallbox möglichst tagsüber laufen lassen, um den Eigenverbrauch zu erhöhen",
          ],
        },
        {
          typ: "p",
          text: "Ob sich die Anlage wie geplant rechnet, sehen Sie nach dem ersten vollen Jahr. Wie Sie Ertrag und Ersparnis einordnen, erklärt der Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich); die aktuellen Vergütungssätze finden Sie unter [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026).",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie lange dauert die Installation einer PV-Anlage?", a: "Die Montage auf einem Einfamilienhaus dauert meist ein bis drei Tage. Von der ersten Anfrage bis zum fertigen Netzanschluss mit neuem Zähler sollten Sie zwei bis fünf Monate einplanen." },
    { q: "Wer meldet die PV-Anlage beim Netzbetreiber an?", a: "Das übernimmt der Elektrofachbetrieb. Arbeiten an der Kundenanlage am Netz darf nur ein Unternehmen ausführen, das im Installateurverzeichnis eines Netzbetreibers eingetragen ist. Sie unterschreiben in der Regel nur eine Vollmacht." },
    { q: "Wie lange hat der Netzbetreiber für die Zusage Zeit?", a: "Er muss unverzüglich einen Zeitplan schicken und das Ergebnis der Netzverträglichkeitsprüfung spätestens acht Wochen nach Eingang aller Unterlagen mitteilen. Bei Anlagen bis 30 kW mit bestehendem Netzanschluss darf angeschlossen werden, wenn innerhalb eines Monats kein Zeitplan kommt." },
    { q: "Darf ich die PV-Anlage vor dem Zählertausch einschalten?", a: "Das regeln Netzbetreiber unterschiedlich. Richten Sie sich nach der Netzzusage und den Vorgaben Ihres Fachbetriebs. Für die Vergütung zählt das dokumentierte Inbetriebnahmedatum." },
    { q: "Muss ich die PV-Anlage selbst im Marktstammdatenregister eintragen?", a: "Verpflichtet ist der Anlagenbetreiber, also Sie. Viele Fachbetriebe übernehmen die Registrierung als Service. Die Frist beträgt einen Monat ab Inbetriebnahme." },
    { q: "Kann man eine PV-Anlage im Winter installieren?", a: "Ja. Bei Schnee, Eis, Sturm oder Dauerregen wird die Dacharbeit verschoben, dazwischen ist die Montage problemlos möglich. Ein Vorteil: Die Anlage ist zum ertragreichen Frühjahr betriebsbereit." },
    { q: "Brauche ich für eine PV-Anlage eine Baugenehmigung?", a: "Aufdachanlagen auf Wohnhäusern sind in allen Bundesländern in der Regel verfahrensfrei. Ausnahmen gibt es etwa bei Denkmalschutz oder besonderen Festsetzungen im Bebauungsplan. Mehr unter [Baurecht](/forderungen/baurecht)." },
  ],

  howTo: {
    name: "Photovoltaikanlage installieren lassen: Ablauf in 8 Schritten",
    schritte: SCHRITTE.map(([name, text]) => ({ name, text })),
  },

  passend: [
    { href: "/ratgeber/photovoltaik-angebot-vergleichen", titel: "PV-Angebote vergleichen", text: "Checkliste, Preis je kWp und Warnsignale." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und Zusatzkosten 2026." },
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik vom Fachbetrieb", text: "Planung, Montage und Anmeldung aus einer Hand." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Passende Programme vor dem Auftrag finden." },
  ],

  quellen: [
    { titel: "§ 8 EEG – Anschluss von Anlagen, Fristen des Netzbetreibers", url: "https://www.gesetze-im-internet.de/eeg_2014/__8.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Marktstammdatenregister", url: "https://www.marktstammdatenregister.de/MaStR", stand: "09/2026" },
    { titel: "§ 13 NAV – Installateurverzeichnis", url: "https://www.gesetze-im-internet.de/nav/__13.html", stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung kleiner Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "Verbraucherzentrale NRW – Checkliste Vergleich von Photovoltaik-Angeboten", url: "https://www.verbraucherzentrale.nrw/sites/default/files/2024-07/checkliste_photovoltaik_edit_final.pdf", stand: "07/2024" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Fördersätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
  ],

  seitenCta: { titel: "Bereit für den ersten Schritt?", text: "Anlage in zwei Minuten konfigurieren und Vor-Ort-Termin anfragen.", href: "/angebot", label: "Angebot anfragen" },
  cta: {
    title: "Planung, Montage und Anmeldung aus einer Hand.",
    text: "Als Fachbetrieb aus Türkheim mit über 15 Jahren Erfahrung kümmern wir uns um Netzanfrage, Montage, Inbetriebnahme und Registrierung – Sie behalten jederzeit den Überblick.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Zum Solarrechner", href: "/solarrechner" },
  },
};

export default artikel;
