// Ratgeber: Stromspeicher Lebensdauer (Österreich)
// Alterung im Feld: Figgener et al., Nature Energy 2024 (21 Heimspeicher, bis 8 Jahre, ~2–3 %-Punkte/Jahr).
// Preise: BMWET/FH Technikum Wien, Marktentwicklung 2024 (706 €/kWh nutzbar, exkl. USt).
// Recht: EU-Batterieverordnung (EU) 2023/1542 – Batteriepass ab 18.02.2027 (Battery Pass Konsortium),
// Rückgewinnungsziele Lithium laut Europäischem Parlament.
// Kosten je gespeicherter kWh werden unten selbst berechnet (Annahmen offengelegt).

const zahl = (n, st = 0) => n.toLocaleString("de-AT", { minimumFractionDigits: st, maximumFractionDigits: st });
const eur = (n) => zahl(Math.round(n)) + " €";
const ct = (eurProKwh) => zahl(eurProKwh * 100, 1) + " ct";

// Alterung: linearer Verlust in Prozentpunkten pro Jahr (Feldstudie: rund 2–3)
const soh = (jahr, verlust) => Math.max(0, 1 - verlust * jahr);

/**
 * Kosten je entladener kWh über die Nutzungsdauer (vereinfachte LCOS).
 * Investition / Summe der entladenen kWh; Kapazität sinkt linear, Vollzyklen je Jahr bleiben gleich.
 * Optional mit Diskontierung (Zins i) von Energiemengen, entsprechend der üblichen LCOS-Definition.
 */
function kostenJeKwh({ preis, zyklen, jahre, verlust = 0.025, eta = 0.95, zins = 0 }) {
  let menge = 0;
  for (let t = 1; t <= jahre; t++) {
    const kapAnteil = soh(t - 0.5, verlust);
    menge += (zyklen * kapAnteil * eta) / Math.pow(1 + zins, t);
  }
  return preis / menge; // € je kWh (Preis je kWh nutzbarer Kapazität)
}

const PREIS_AT_2024 = 706; // €/kWh nutzbar, schlüsselfertig, exkl. USt (Marktschnitt 2024)
const PREIS_AT_2024_BRUTTO = PREIS_AT_2024 * 1.2;
const PREISE = [300, 400, 500, 706];
const ZYKLEN_SP = [150, 250, 350];
const JAHRE = 15;
const VERLUST = 0.025;
const ZINS = 0.05;
const MATRIX = PREISE.map((preis) => ({ preis, werte: ZYKLEN_SP.map((zyklen) => kostenJeKwh({ preis, zyklen, jahre: JAHRE, verlust: VERLUST })) }));

// Referenzfall Premium-Haus: Marktschnitt brutto, 250 Zyklen, 15 Jahre
const REF = kostenJeKwh({ preis: PREIS_AT_2024_BRUTTO, zyklen: 250, jahre: JAHRE, verlust: VERLUST });
const REF_ZINS = kostenJeKwh({ preis: PREIS_AT_2024_BRUTTO, zyklen: 250, jahre: JAHRE, verlust: VERLUST, zins: ZINS });
const BEZUG_PRIVAT = 0.26; // €/kWh brutto, Annahme
const EINSP = 0.07; // €/kWh, ≈ Ø OeMAG-Marktpreis PV Jän–Aug 2026 (7,3 ct)
const WERT_JE_KWH = BEZUG_PRIVAT * 0.95 - EINSP / 0.95; // Wert einer verschobenen kWh nach Verlusten (vereinfacht)

// Garantie-Durchsatz: Beispiel 10 kWh
const G_KAP = 10;
const durchsatz = (zyklen, jahre) => (G_KAP * zyklen * jahre) / 1000; // MWh

// Restkapazität nach Jahren
const JAHRE_TAB = [5, 10, 15, 20];
const VERLUSTE = [0.02, 0.025, 0.03];

const artikel = {
  slug: "stromspeicher-lebensdauer",
  title: "Stromspeicher Lebensdauer: Zyklen, Alterung und Garantie",
  seoTitle: "Stromspeicher Lebensdauer: Zyklen & Garantie | Ökovolt",
  kurzTitel: "Stromspeicher Lebensdauer",
  description:
    "Stromspeicher Lebensdauer: LFP vs. NMC, Zyklen, Temperatur im Keller oder alpin im Freien, Garantie, Gewerbe-Zyklen, Batteriepass 2027 und Kosten je kWh.",
  excerpt:
    "Wie lange hält ein Heim- oder Gewerbespeicher wirklich? Was Feldmessungen zeigen, wie Aufstellort, Ladestand und Anwendung die Alterung treiben und was eine gespeicherte Kilowattstunde über die Lebensdauer kostet.",
  hauptKeyword: "stromspeicher lebensdauer",
  keywords: [
    "Stromspeicher Lebensdauer",
    "Wie lange hält ein Stromspeicher",
    "Batteriespeicher Zyklen",
    "LFP Speicher Lebensdauer",
    "Stromspeicher Garantie Restkapazität",
    "Gewerbespeicher Lebensdauer",
    "Batteriepass 2027",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/stromspeicher-lebensdauer.jpg",
  bildAlt: "Huawei-Stromspeicher LUNA2000 an der Außenwand eines Einfamilienhauses im Winter",
  badge: { wert: "2–3 %-Pkt.", text: "Kapazitätsverlust pro Jahr im Feld (Heimspeicher)" },

  kurzFazit: [
    "**Ein LFP-Stromspeicher ist bei guter Aufstellung realistisch 15 bis 20 Jahre in Betrieb** – mit sinkender Kapazität. Begrenzend ist im Haus meist die kalendarische Alterung, nicht die Zyklenzahl.",
    "**Feldmessungen an 21 Heimspeichern über bis zu 8 Jahre zeigen rund 2 bis 3 Prozentpunkte Kapazitätsverlust pro Jahr** (Figgener et al., Nature Energy 2024).",
    `**Zyklen sind im Haus selten der Engpass:** Bei 250 Vollzyklen im Jahr reichen 6.000 Zyklen rechnerisch ${zahl(6000 / 250)} Jahre. Im Gewerbe mit Spotmarkt- oder Mehrfachnutzung kann das anders aussehen.`,
    `**Eine gespeicherte Kilowattstunde kostet über die Lebensdauer** im Referenzfall (Marktschnitt 2024 inkl. USt, 250 Zyklen, ${JAHRE} Jahre) rund **${ct(REF)}** – ohne Zinsen. Günstigere Systeme und mehr Zyklen senken den Wert deutlich.`,
    "**Ab 18. Februar 2027 gilt der digitale Batteriepass** der EU-Batterieverordnung für Industriebatterien über 2 kWh – dazu zählen auch stationäre Speicher.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie lange hält ein Stromspeicher?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein moderner Lithium-Eisenphosphat-Speicher (LFP) ist im Haus oder Betrieb typischerweise 15 bis 20 Jahre in Betrieb; nach 10 bis 15 Jahren sind nach Feldwerten noch rund 70 % der Kapazität übrig.** Wann ein Tausch wirtschaftlich sinnvoll wird, hängt davon ab, wie viel des Abendbedarfs der gealterte Speicher noch deckt. Das ist kürzer als die Nutzungsdauer von Modulen und Unterkonstruktion. Ein Speichertausch oder eine Erweiterung während der PV-Laufzeit gehört deshalb in jede Planung – bei Heim- und Chalet-[Stromspeichern](/produkte/stromspeicher) ebenso wie im Betrieb.",
        },
        {
          typ: "p",
          text: "Ein Speicher fällt selten plötzlich aus – er verliert Jahr für Jahr Kapazität. Den Zustand beschreibt der State of Health (SoH): 100 % im Neuzustand, 70 % bedeutet, dass nur noch 70 % der ursprünglichen Energie gespeichert werden kann. Das Gerät arbeitet weiter, speichert aber weniger. Den Begriff erklärt das Lexikon unter [Degradation](/wissen/lexikon#degradation).",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Kalendarische Alterung", text: "Zellen altern auch ohne Nutzung – schneller bei Wärme und dauerhaft hohem Ladestand. Im Haus meist der dominierende Faktor." },
            { titel: "Zyklische Alterung", text: "Jeder Lade- und Entladevorgang verschleißt die Zellen etwas. Entscheidend sind Vollzyklen, Entladetiefe und C-Rate." },
            { titel: "System und Peripherie", text: "Wechselrichter, BMS, Lüfter und Klimatisierung haben eigene Lebensdauern. Ein Wechselrichtertausch ist oft früher fällig als der Batterietausch." },
          ],
        },
      ],
    },
    {
      id: "chemie",
      titel: "LFP oder NMC: welche Zellchemie hält länger?",
      tocLabel: "LFP vs. NMC",
      bloecke: [
        {
          typ: "p",
          text: "**Für stationäre Speicher hat sich LFP durchgesetzt, weil die Zellchemie mehr Zyklen verträgt und thermisch stabiler ist als NMC.** NMC (Nickel-Mangan-Kobalt) speichert mehr Energie je Kilogramm – ein Vorteil im Fahrzeug, im Keller oder Container kaum relevant. Die österreichische Marktstatistik weist für 2024 fast ausschließlich Lithium-Ionen-Speicher aus; die Zellchemie im Detail steht im Datenblatt. Mehr zu [LFP](/wissen/lexikon#lfp) im Lexikon.",
        },
        {
          typ: "tabelle",
          caption: "LFP und NMC im stationären Einsatz, Richtwerte Stand September 2026",
          kopf: ["Merkmal", "LFP (Lithium-Eisenphosphat)", "NMC (Nickel-Mangan-Kobalt)"],
          zeilen: [
            ["Zyklenfestigkeit laut Datenblatt", "häufig 6.000 Vollzyklen und mehr", "meist deutlich weniger"],
            ["Thermische Stabilität", "hoch, geringere Neigung zum thermischen Durchgehen", "empfindlicher bei Überladung und Hitze"],
            ["Energiedichte", "niedriger", "höher"],
            ["Empfindlich gegen", "Laden bei Frost, dauerhaft hohe Temperatur", "hohen Ladestand bei Wärme, Tiefentladung"],
            ["Rohstoffe", "ohne Kobalt und Nickel", "Kobalt und Nickel"],
            ["Typischer Einsatz heute", "Heim-, Gewerbe- und Großspeicher", "ältere Heimspeicher, Fahrzeuge"],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Richtwerte, keine Herstellerangaben. Datenblatt-Zyklen werden unter Laborbedingungen (Temperatur, C-Rate, Entladetiefe) ermittelt und sind nicht direkt auf den Feldbetrieb übertragbar. Die [Zyklenfestigkeit](/wissen/lexikon#zyklenfestigkeit) gilt bis zu einer definierten Restkapazität, meist 60–80 %.",
        },
      ],
    },
    {
      id: "faktoren",
      titel: "Was die Alterung treibt: Temperatur, Ladestand, Entladetiefe, C-Rate",
      tocLabel: "Alterungsfaktoren",
      bloecke: [
        {
          typ: "p",
          text: "**Am stärksten beschleunigen hohe Temperatur und ein dauerhaft voller Speicher die Alterung.** Beides lässt sich durch Aufstellort und Betriebsstrategie beeinflussen – ohne auf Nutzen zu verzichten.",
        },
        {
          typ: "liste",
          punkte: [
            "**Temperatur:** Lithium-Ionen-Zellen fühlen sich bei gemäßigten Raumtemperaturen am wohlsten (Richtwert ca. 15–25 °C). Hitze beschleunigt die chemische Alterung; als Faustregel aus der Batterieforschung verdoppelt sich die Alterungsgeschwindigkeit grob je 10 °C Temperaturanstieg. Laden bei Frost schädigt die Zellen, deshalb begrenzt das Batteriemanagement (BMS) dann die Ladeleistung oder heizt vor.",
            "**Ladestand (SoC):** Stunden oder Tage bei 100 % – etwa im Sommer, wenn der Speicher schon vormittags voll ist – belasten die Zellen mehr als ein mittlerer Ladestand. Prognosebasiertes Laden, das den Speicher erst gegen Mittag füllt, schont ihn und nimmt zugleich Einspeisespitzen auf.",
            "**Entladetiefe (DoD):** LFP verträgt tiefe Entladungen gut; Hersteller begrenzen die nutzbare Kapazität trotzdem mit einer kleinen Reserve. Tiefentladung über Wochen (etwa im Winter ohne Überschuss) vermeidet das BMS durch Erhaltungsladung.",
            "**C-Rate:** Hohe Lade- und Entladeleistungen erzeugen mehr Wärme. Heimspeicher mit 0,5 C sind unkritisch; Speicher für Peak Shaving oder Regelreserve mit 1 C und mehr brauchen ein gutes Thermomanagement. Mehr zur [C-Rate](/wissen/lexikon#c-rate).",
          ],
        },
        { typ: "h3", text: "Aufstellort: Keller, Garage oder außen in alpinen Lagen" },
        {
          typ: "tabelle",
          caption: "Aufstellorte und ihr Einfluss auf die Lebensdauer, Stand September 2026",
          kopf: ["Aufstellort", "Vorteil", "Risiko", "Worauf achten"],
          zeilen: [
            ["Keller / Technikraum", "stabile Temperatur ganzjährig", "Feuchte, Brandlast im Gebäude", "Belüftung, Abstand zu Brennbarem, Rauchmelder, Zugänglichkeit"],
            ["Unbeheizte Garage", "einfache Montage, Abstand zu Wohnräumen", "Frost im Winter, Hitze unter dem Dach im Sommer", "zulässigen Temperaturbereich prüfen, Anfahrschutz"],
            ["Außenwand / Freiaufstellung", "kein Platzbedarf im Gebäude", "Sonne, Frost, Schnee, in alpinen Lagen lange Frostperioden", "Schutzart, Beschattung, Heizfunktion, Schneefreiheit, Abstand zu Fenstern"],
            ["Container (Gewerbe)", "definierte Klimatisierung, Brandschutzkonzept", "Eigenverbrauch der Klimatisierung, Filterwartung", "Klimaanlage und Heizung warten, Temperaturen überwachen"],
          ],
          minBreite: 680,
          fussnote: "Zulässige Betriebs- und Ladetemperaturen stehen im Datenblatt und in den Garantiebedingungen. Abweichungen können die Garantie gefährden.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Brandschutz und Versicherung früh klären",
          text: "Aufstellort, Abstände und Löschkonzept entscheiden auch über Genehmigung und Versicherbarkeit, gerade bei Gewerbespeichern. Welche Anforderungen in Österreich gelten, beschreibt der Ratgeber [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz); melden Sie den Speicher Ihrem Versicherer.",
        },
      ],
    },
    {
      id: "feld",
      titel: "Was Feldmessungen zeigen: Restkapazität nach Jahren",
      tocLabel: "Feldwerte & SoH",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Langzeitmessung an 21 privat betriebenen Lithium-Ionen-Heimspeichern ergab im Mittel einen Verlust von rund 2 bis 3 Prozentpunkten nutzbarer Kapazität pro Jahr.** Die Forschenden der RWTH Aachen werteten bis zu acht Jahre hochaufgelöste Betriebsdaten aus und prüften die Schätzung mit regelmäßigen Kapazitätstests (Figgener et al., Nature Energy 2024). Die Systeme stammen aus früheren Produktgenerationen; neuere LFP-Speicher dürften eher am unteren Rand liegen, belegt ist das aber noch nicht.",
        },
        {
          typ: "tabelle",
          caption: "Restkapazität (State of Health) nach Betriebsjahren bei linearem Verlust, Stand September 2026",
          kopf: ["Verlust pro Jahr", ...JAHRE_TAB.map((j) => `nach ${j} Jahren`)],
          zeilen: VERLUSTE.map((v) => [`${zahl(v * 100, 1)} %-Punkte`, ...JAHRE_TAB.map((j) => zahl(soh(j, v) * 100) + " %")]),
          markierteZeile: 1,
          minBreite: 560,
          fussnote: "Vereinfachte lineare Fortschreibung der Feldwerte (2–3 %-Punkte/Jahr). Reale Verläufe sind nicht linear: Zu Beginn sinkt die Kapazität oft etwas schneller, später kann ein beschleunigter Abfall einsetzen. Keine Prognose für ein bestimmtes Produkt.",
        },
        {
          typ: "p",
          text: "Den aktuellen SoH zeigt das Batteriemanagement in der Regel im Portal des Herstellers. Aussagekräftiger ist ein Trend über Jahre oder ein definierter Kapazitätstest. Wer ein Monitoring laufen lässt, erkennt auffällige Zellen, steigende Temperaturen oder Kommunikationsfehler früh – im Gewerbe über eine [Fernwartung](/technik/fernwartung) mit Alarmierung.",
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Gewerbespeicher: Die Anwendung bestimmt die Zyklenzahl",
      tocLabel: "Gewerbe & Zyklen",
      bloecke: [
        {
          typ: "p",
          text: "**Im Gewerbe entscheidet die Betriebsweise, ob Zyklen oder Kalenderjahre die Lebensdauer begrenzen.** Ein Speicher, der nur Eigenverbrauch optimiert, läuft ähnlich wie ein Heimspeicher. Wird er zusätzlich am Spotmarkt oder für Regelreserve eingesetzt, steigen Durchsatz und Wärmelast – und die Garantiebedingungen werden zum Engpass.",
        },
        {
          typ: "tabelle",
          caption: "Vollzyklen nach Anwendung und rechnerische Jahre bis 6.000 Zyklen, Richtwerte Stand September 2026",
          kopf: ["Anwendung", "Vollzyklen/Jahr (Richtwert)", "Jahre bis 6.000 Zyklen", "Begrenzend meist"],
          zeilen: [
            ["Eigenverbrauch (PV-Überschuss)", "250–300", `${zahl(6000 / 300)}–${zahl(6000 / 250)}`, "kalendarische Alterung"],
            ["Peak Shaving allein", "deutlich unter 250, je nach Lastgang", "über 25", "kalendarische Alterung"],
            ["Spotpreis-Optimierung (ein Zyklus pro Tag)", "rund 365", zahl(6000 / 365), "beides"],
            ["Mehrfachnutzung (Spot, Intraday, Regelreserve)", "400–600", `${zahl(6000 / 600)}–${zahl(6000 / 400)}`, "Zyklen und Durchsatzgarantie"],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Richtwerte zur Einordnung; tatsächliche Zyklen hängen von Lastgang, Marktpreisen und Strategie ab. 6.000 Zyklen als häufige Datenblattangabe für LFP, nicht als garantierter Wert. Zur Wirtschaftlichkeit siehe [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
        { typ: "h3", text: "Augmentation: Kapazität nachrüsten statt tauschen" },
        {
          typ: "p",
          text: "Bei größeren Gewerbe- und Großspeichern wird der Kapazitätsverlust oft durch **Augmentation** ausgeglichen: Nach einigen Jahren kommen zusätzliche Batteriemodule oder -schränke dazu, damit die zugesagte Kapazität erhalten bleibt. Das muss von Anfang an eingeplant sein – mit Platz, Reserven im Wechselrichter und in der Verkabelung sowie einem System, das Module unterschiedlichen Alters betreiben kann. Ob das für Ihren Anwendungsfall passt, klären wir bei der Planung von [Gewerbespeichern](/gewerbespeicher).",
        },
      ],
    },
    {
      id: "garantie",
      titel: "Garantie: Jahre, Durchsatz und Restkapazität",
      tocLabel: "Garantie",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Speichergarantie besteht fast immer aus drei Grenzen – Laufzeit, Energiedurchsatz und garantierte Restkapazität – und endet, sobald die erste erreicht ist.** Typisch sind 10 Jahre, eine Restkapazität von 60 bis 80 % und eine Durchsatzgrenze in Megawattstunden. Diese Werte sind Richtwerte; maßgeblich sind die Garantiebedingungen des konkreten Produkts.",
        },
        {
          typ: "tabelle",
          caption: `Energiedurchsatz eines ${G_KAP}-kWh-Speichers über die Garantielaufzeit, Stand September 2026`,
          kopf: ["Vollzyklen/Jahr", "nach 10 Jahren", "nach 15 Jahren", "Einordnung"],
          zeilen: [
            ["200", `${zahl(durchsatz(200, 10))} MWh`, `${zahl(durchsatz(200, 15))} MWh`, "Haus mit geringem Abendverbrauch"],
            ["300", `${zahl(durchsatz(300, 10))} MWh`, `${zahl(durchsatz(300, 15))} MWh`, "Haus mit Wärmepumpe oder E-Auto, Eigenverbrauch Gewerbe"],
            ["365", `${zahl(durchsatz(365, 10), 1)} MWh`, `${zahl(durchsatz(365, 15), 1)} MWh`, "täglicher Zyklus, z. B. dynamischer Tarif"],
            ["500", `${zahl(durchsatz(500, 10))} MWh`, `${zahl(durchsatz(500, 15))} MWh`, "Mehrfachnutzung"],
          ],
          minBreite: 560,
          fussnote: `Durchsatz = ${G_KAP} kWh × Vollzyklen × Jahre, ohne Kapazitätsverlust. Liegt die garantierte Durchsatzgrenze unter diesen Werten, endet die Garantie vor Ablauf der Jahre. Für andere Größen linear umrechnen.`,
        },
        {
          typ: "checkliste",
          punkte: [
            "**Bezugsgröße der Restkapazität:** nutzbare oder Nennkapazität? Wie und von wem wird sie gemessen?",
            "**Durchsatzgrenze:** in MWh oder Zyklen, und passt sie zu Ihrer Anwendung (siehe Tabelle)?",
            "**Bedingungen:** zulässige Temperaturen, Internetverbindung für Updates und Datenaufzeichnung, Installation durch zertifizierte Fachbetriebe, Registrierung.",
            "**Leistungsumfang:** Tausch oder Reparatur, Arbeitszeit und Anfahrt, Wechselrichter und BMS eingeschlossen?",
            "**Erweiterung:** Wirkt eine spätere Modulergänzung auf die Garantie der Bestandsmodule?",
          ],
        },
      ],
    },
    {
      id: "kosten",
      titel: "Rechenbeispiel: Was kostet eine gespeicherte Kilowattstunde?",
      tocLabel: "Kosten je kWh",
      bloecke: [
        {
          typ: "p",
          text: `**Die Kosten je gespeicherter Kilowattstunde ergeben sich aus Investition geteilt durch die über die Lebensdauer entladene Energie – und liegen im Referenzfall bei rund ${ct(REF)}.** Referenzfall: Premium-Haus, Speicherpreis ${eur(PREIS_AT_2024)} je kWh nutzbar (österreichischer Marktschnitt 2024, exkl. USt), für Private inkl. 20 % USt also ${eur(PREIS_AT_2024_BRUTTO)}; 250 Vollzyklen pro Jahr, ${JAHRE} Jahre, ${zahl(VERLUST * 100, 1)} Prozentpunkte Kapazitätsverlust pro Jahr, 95 % Entladewirkungsgrad. Netto – etwa für vorsteuerabzugsberechtigte Betriebe – sind es ${ct(MATRIX[3].werte[1])}. Die Preise sind seither gesunken: BloombergNEF meldet für 2025 stark gefallene Preise für stationäre Batteriepacks; ein Pack ist aber nicht das System – Wechselrichter, BMS, Brandschutz, Montage und Netzanschluss kommen dazu. Die Tabelle zeigt deshalb mehrere Preisstufen.`,
        },
        {
          typ: "tabelle",
          caption: `Kosten je entladener kWh über ${JAHRE} Jahre nach Systempreis und Zyklenzahl, Stand September 2026`,
          kopf: ["Systempreis je kWh nutzbar", ...ZYKLEN_SP.map((z) => `${z} Zyklen/Jahr`)],
          zeilen: MATRIX.map((r) => [`${eur(r.preis)}${r.preis === PREIS_AT_2024 ? " (Ø AT 2024)" : ""}`, ...r.werte.map((w) => ct(w))]),
          markierteZeile: 3,
          hervorheben: 2,
          minBreite: 560,
          fussnote: `Eigene Beispielrechnung, netto. Annahmen: ${JAHRE} Jahre Nutzung, linearer Kapazitätsverlust ${zahl(VERLUST * 100, 1)} %-Punkte/Jahr (Mitte der Feldwerte 2–3), 95 % Entladewirkungsgrad, keine Zinsen, keine Wartungs- und Versicherungskosten, kein Restwert. 706 €/kWh = mittlerer Systempreis 2024 laut BMWET-Marktstatistik (Heimspeicher bis 50 kWh); 300–500 €/kWh als Rechenvarianten für gesunkene Preise und größere Systeme, keine Marktpreisangabe.`,
        },
        {
          typ: "p",
          text: `Mit 5 % Kapitalkosten steigt der Wert im Referenzfall von ${ct(REF)} auf ${ct(REF_ZINS)}. Dem steht der Nutzen gegenüber: Eine verschobene Kilowattstunde spart im Haus rund ${ct(BEZUG_PRIVAT)} Netzbezug (Annahme, brutto) und kostet rund ${ct(EINSP)} entgangenen Einspeiseerlös (≈ mittlerer OeMAG-Marktpreis PV Jänner–August 2026) – nach Wirkungsgradverlusten bleiben rund ${ct(WERT_JE_KWH)}. Solange die Kosten je gespeicherter kWh darüber liegen, rechnet sich der Speicher allein über den Eigenverbrauch nicht; niedrigere Systempreise, Förderung, mehr Zyklen oder zusätzliche Nutzen wie Peak Shaving ändern das. Aktuelle Preise stehen im Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten).`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Lebensdauer rechnet sich doppelt",
          text: "Jedes zusätzliche Betriebsjahr senkt die Kosten je kWh, ohne dass zusätzlich investiert wird. Ein kühler Aufstellort, prognosebasiertes Laden und regelmäßige Firmware-Updates sind deshalb keine Nebensache, sondern Teil der Wirtschaftlichkeit.",
        },
      ],
    },
    {
      id: "betrieb",
      titel: "Wartung und Monitoring: so verlängern Sie die Lebensdauer",
      tocLabel: "Wartung & Monitoring",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Speicher ist weitgehend wartungsarm, aber nicht wartungsfrei – vor allem Thermomanagement, Software und Überwachung entscheiden über die Lebensdauer.** Im Gewerbe gehört der Speicher deshalb in den Wartungsvertrag der PV-Anlage.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Monitoring einrichten:** Ladestand, Temperaturen, Zyklen und SoH regelmäßig prüfen; Alarme für Kommunikationsausfall und Übertemperatur setzen. Ökovolt betreibt dafür eigene SCADA- und [Fernwartungssysteme](/technik/fernwartung).",
            "**Firmware aktuell halten:** Updates verbessern oft Lade-Algorithmen und Schutzfunktionen – und sind teils Garantiebedingung.",
            "**Betriebsstrategie anpassen:** prognosebasiert laden, lange Standzeiten bei 100 % vermeiden. Wie Marktpreise und Erzeugung über den Tag schwanken, zeigt [Energie live](/energie-live).",
            "**Thermomanagement warten:** Lüfter, Filter und Klimageräte bei Gewerbespeichern und Containern regelmäßig prüfen.",
            "**Sichtprüfung und Anschlüsse:** Gehäuse, Kabel, Klemmen und Umgebung (Feuchte, Brandlast, Zugänglichkeit) kontrollieren – bei Gewerbeanlagen im Rahmen der [Wartung](/service/wartung).",
          ],
        },
      ],
    },
    {
      id: "recycling",
      titel: "Second Life, Recycling und Batteriepass",
      tocLabel: "Recycling & Batteriepass",
      bloecke: [
        {
          typ: "p",
          text: "**Ab 18. Februar 2027 brauchen neu in Verkehr gebrachte Industriebatterien mit mehr als 2 kWh Kapazität einen digitalen Batteriepass – das betrifft auch stationäre Speicher.** Grundlage ist die EU-Batterieverordnung (EU) 2023/1542, die unmittelbar in Österreich gilt. Der Pass dokumentiert unter anderem Materialherkunft, CO₂-Fußabdruck, Leistungs- und Haltbarkeitsdaten und soll auch Angaben zum Zustand der Batterie zugänglich machen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Second Life:** Speicher mit 60–70 % Restkapazität sind für den ursprünglichen Zweck oft zu klein, aber für weniger anspruchsvolle Anwendungen noch nutzbar. Voraussetzung sind dokumentierte Zustandsdaten – hier setzt der Batteriepass an.",
            "**Recycling:** Die Verordnung schreibt Mindestquoten für die Rückgewinnung von Rohstoffen vor, für Lithium 50 % bis 2027 und 80 % bis 2031 (Europäisches Parlament).",
            "**Rücknahme:** Hersteller bzw. Inverkehrbringer sind für die Rücknahme ihrer Batterien verantwortlich. Klären Sie beim Kauf, wie Rückbau und Entsorgung am Ende der Nutzung ablaufen und wer die Kosten trägt.",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie lange hält ein Stromspeicher?",
      a: "Ein LFP-Speicher ist bei guter Aufstellung realistisch 15 bis 20 Jahre in Betrieb, mit abnehmender Kapazität. Feldmessungen zeigen einen Kapazitätsverlust von rund 2 bis 3 Prozentpunkten pro Jahr; nach 10 Jahren sind damit etwa 70 bis 80 % der ursprünglichen Kapazität übrig.",
    },
    {
      q: "Wie viele Ladezyklen hat ein Stromspeicher?",
      a: "LFP-Speicher werden häufig mit 6.000 Vollzyklen und mehr angegeben, gemessen unter Laborbedingungen. Im Haus fallen rund 200 bis 300 Vollzyklen pro Jahr an, sodass meist die kalendarische Alterung und nicht die Zyklenzahl begrenzt.",
    },
    {
      q: "Ist ein Speicher in der unbeheizten Garage oder im Freien ein Problem?",
      a: "Nicht grundsätzlich, wenn das Gerät für den Temperaturbereich zugelassen ist. In alpinen Lagen mit langen Frostperioden braucht es eine Heizfunktion oder einen frostfreien Raum, im Sommer Schutz vor direkter Sonne. Die Grenzwerte stehen im Datenblatt und in den Garantiebedingungen.",
    },
    {
      q: "Was bedeutet 70 % Restkapazität in der Garantie?",
      a: "Der Hersteller garantiert, dass der Speicher bis zum Ende der Garantie mindestens 70 % seiner ursprünglichen Kapazität speichern kann. Typisch sind 60 bis 80 % nach 10 Jahren, oft kombiniert mit einer Durchsatzgrenze in MWh – es gilt die Grenze, die zuerst erreicht wird.",
    },
    {
      q: "Wie viele Zyklen macht ein Gewerbespeicher?",
      a: "Bei reiner Eigenverbrauchsoptimierung rund 250 bis 300 Vollzyklen pro Jahr (Richtwert), bei Peak Shaving allein weniger. Mit Spotmarkt-Optimierung oder Regelreserve können es 365 und mehr sein – dann prüfen Sie die Durchsatzgrenze der Garantie besonders genau. Mehr unter [Gewerbespeicher](/gewerbespeicher).",
    },
    {
      q: "Was ist der Batteriepass und ab wann gilt er?",
      a: "Ein digitaler Datensatz zu Herkunft, CO₂-Fußabdruck, Leistung und Haltbarkeit einer Batterie, abrufbar über einen QR-Code. Er gilt nach der EU-Batterieverordnung ab 18. Februar 2027 für Industriebatterien über 2 kWh, darunter stationäre Speicher, sowie für Fahrzeug- und LMT-Batterien.",
    },
    {
      q: "Lohnt sich ein Speichertausch nach 15 Jahren?",
      a: "Das hängt von Restkapazität, Wechselrichter und Preisen ab. Solange der alte Speicher noch einen Großteil des Abendverbrauchs deckt, ist Weiterbetrieb meist günstiger. Planen Sie Tausch oder Erweiterung gemeinsam mit dem Wechselrichter, der oft zuerst erneuert werden muss.",
    },
  ],

  passend: [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Speicher für Haus, Chalet und Betrieb." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Auslegung, Betrieb und Mehrfachnutzung." },
    { href: "/service/wartung", titel: "Wartung", text: "PV-Anlage und Speicher im Wartungsvertrag." },
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe", text: "Kapazität und Leistung richtig dimensionieren." },
  ],

  quellen: [
    { titel: "Figgener et al. – Multi-year field measurements of home storage systems and their use in capacity estimation, Nature Energy", url: "https://www.nature.com/articles/s41560-024-01620-9", stand: "09/2024" },
    { titel: "BMWET / FH Technikum Wien – PV-Batteriespeichersysteme: Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "06/2025" },
    { titel: "EUR-Lex – Verordnung (EU) 2023/1542 über Batterien und Altbatterien", url: "https://eur-lex.europa.eu/eli/reg/2023/1542/oj", stand: "09/2026" },
    { titel: "Battery Pass Konsortium – EU-Batteriepass ab 18. Februar 2027", url: "https://thebatterypass.eu/", stand: "09/2026" },
    { titel: "Europäisches Parlament – Neue EU-Vorschriften für nachhaltige Batterien", url: "https://www.europarl.europa.eu/news/de/press-room/20230609IPR96210/parlament-stimmt-fur-neue-eu-vorschriften-fur-nachhaltige-batterien", stand: "06/2023" },
    { titel: "BloombergNEF – Lithium-ion battery pack prices fall to $108 per kWh", url: "https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/", stand: "12/2025" },
  ],

  seitenCta: { titel: "Speicher in die Wartung aufnehmen?", text: "Monitoring, Firmware und Thermomanagement im Blick – für Haus und Betrieb.", href: "/service/wartung", label: "Zur Wartung" },
  cta: {
    title: "Ein Speicher, der lange hält, beginnt bei der Planung.",
    text: "Aufstellort, Zellchemie, Leistung und Garantiebedingungen passend zu Ihrer Anwendung – für Haus, Chalet und Gewerbe.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Stromspeicher", href: "/produkte/stromspeicher" },
  },
};

export default artikel;
