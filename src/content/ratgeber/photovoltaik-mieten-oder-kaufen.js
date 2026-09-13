// Ratgeber: Photovoltaik mieten oder kaufen?
// Vergleich über 20 Jahre auf Basis des Solarrechner-Rechenkerns.
// Mietraten sind Beispielwerte innerhalb der von der Verbraucherzentrale genannten Spanne.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => (n < 0 ? "− " : "") + Math.abs(Math.round(n)).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const ctStr = (eurProKwh) => String(Math.round(eurProKwh * 1000) / 10).replace(".", ",");

const JAHRE = VERGUETUNG.garantieJahre; // 20
const ZINS = 0.04; // angenommener Effektivzins für das Beispiel – keine Kondition
const KREDIT_JAHRE = 10;

function vergleich(speicherKwh) {
  const r = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh });
  const jahre = r.cashflow.slice(1);
  const vorteil = jahre.reduce((s, c) => s + c.ersparnis + c.einspeisung, 0); // Stromersparnis + Einspeisung
  const betrieb = jahre.reduce((s, c) => s + c.betrieb, 0);
  const P = r.investition;
  const rate = (P * ZINS) / (1 - Math.pow(1 + ZINS, -KREDIT_JAHRE));
  const zinsen = rate * KREDIT_JAHRE - P;
  const kauf = vorteil - betrieb - P;
  const kredit = kauf - zinsen;
  // Monatsmiete, bei der Miete und Barkauf nach 20 Jahren gleich abschneiden
  // (Annahme: Versicherung und Wartung sind in der Miete enthalten)
  const breakEven = (P + betrieb) / (JAHRE * 12);
  // Monatsmiete, bei der Miete und Kreditkauf gleich abschneiden
  const breakEvenKredit = (P + betrieb + zinsen) / (JAHRE * 12);
  const miete = (m) => vorteil - m * 12 * JAHRE;
  return { r, vorteil, betrieb, P, rate, zinsen, kauf, kredit, breakEven, breakEvenKredit, miete };
}

const OHNE = vergleich(0);
const MIT = vergleich(8);
const RATE_A = 100;
const RATE_B = 150;

const artikel = {
  slug: "photovoltaik-mieten-oder-kaufen",
  title: "Photovoltaik mieten oder kaufen? Gesamtkosten über 20 Jahre",
  seoTitle: "Photovoltaik mieten oder kaufen? Kostenvergleich | Ökovolt",
  kurzTitel: "PV mieten oder kaufen",
  description:
    "Photovoltaik mieten oder kaufen? Kauf, Kredit, Miete und Pacht im 20-Jahres-Vergleich: ab welcher Monatsrate Miete teurer wird und worauf Sie im Vertrag achten.",
  excerpt:
    "Mietangebote locken ohne Anschaffungskosten – doch was bleibt nach 20 Jahren übrig? Kauf, Kredit, Miete und Pacht im ehrlichen Gesamtkostenvergleich mit Vertrags-Checkliste.",
  hauptKeyword: "photovoltaik mieten oder kaufen",
  keywords: [
    "Photovoltaik mieten oder kaufen",
    "PV-Anlage mieten Erfahrungen",
    "Solaranlage mieten Kosten",
    "Photovoltaik pachten",
    "PV-Anlage finanzieren oder mieten",
    "Photovoltaik Miete Nachteile",
    "Solaranlage Mietkauf",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Kontakt/faqs.jpg",
  bildAlt: "Photovoltaikmodule vor blauem Himmel mit Wolken",
  badge: { wert: `~${eur10(OHNE.breakEven)}`, text: "Monatsmiete, ab der Mieten teurer ist als Kaufen (10 kWp)" },

  kurzFazit: [
    "**Kaufen ist über 20 Jahre fast immer günstiger als Mieten.** Mietangebote kosten laut Verbraucherzentrale meist 80 bis 300 € im Monat und sind durch Finanzierungs- und Servicekosten teurer als gekaufte Anlagen.",
    `In unserem Beispiel (10 kWp, ohne Speicher) ist die Miete schon ab rund **${eur10(OHNE.breakEven)} im Monat** teurer als der Barkauf – mit 8-kWh-Speicher ab rund ${eur10(MIT.breakEven)}.`,
    `Ohne Eigenkapital ist der **Kredit** die naheliegende Alternative: Mit angenommenen ${Math.round(ZINS * 100)} % Zinsen bleiben im Beispiel nach 20 Jahren rund ${eur(OHNE.kredit)} Überschuss. Eine Miete schneidet nur bei Raten unter rund ${eur10(OHNE.breakEvenKredit)} im Monat besser ab.`,
    "Miete kann passen, wenn Sie **keinen Kredit bekommen** oder sich um nichts kümmern möchten – dann sollten Laufzeit, Leistungen und Übernahme am Vertragsende genau geprüft werden.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Mieten oder kaufen: die kurze Antwort",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Wer eine Photovoltaikanlage bar oder per Kredit kauft, hat nach 20 Jahren in aller Regel deutlich mehr Geld übrig als mit einem Mietmodell.** Der Grund: In der Monatsmiete stecken neben der Anlage auch Finanzierungskosten, Service und die Marge des Anbieters – und das über 15 bis 25 Jahre. Die Verbraucherzentrale kommt zum selben Schluss: Miete oder Pacht sind am Ende meist deutlich teurer als ein Kauf.",
        },
        {
          typ: "p",
          text: "Mieten ist trotzdem kein schlechtes Produkt an sich. Es verschiebt Aufwand und Risiko: Sie zahlen eine feste Rate, der Anbieter kümmert sich im besten Fall um Wartung, Reparaturen und Versicherung. Ob Ihnen dieser Komfort mehrere tausend Euro wert ist, lässt sich mit dem Vergleich unten beantworten.",
        },
        {
          typ: "tabelle",
          caption: "Die vier Modelle im Überblick",
          kopf: ["", "Kauf (bar)", "Kauf mit Kredit", "Miete", "Dachpacht"],
          zeilen: [
            ["Anschaffungskosten", "voll zu Beginn", "keine oder gering", "keine", "keine"],
            ["Laufende Zahlung", "Betriebskosten", "Kreditrate + Betriebskosten", "Monatsmiete", "keine – Sie erhalten ggf. Pacht"],
            ["Eigentum", "sofort", "sofort", "beim Anbieter, oft Übernahme am Ende", "beim Investor"],
            ["Eigener Solarstrom", "ja", "ja", "ja", "nur per Stromliefervertrag"],
            ["Einspeisevergütung", "Sie", "Sie", "meist Sie als Mieter", "Investor"],
            ["Wartung & Versicherung", "Sie", "Sie", "je nach Vertrag Anbieter", "Investor"],
            ["Wirtschaftlich über 20 Jahre", "am besten", "sehr gut", "meist deutlich schlechter", "nur bei großen Dächern relevant"],
          ],
          hervorheben: 1,
          minBreite: 720,
        },
      ],
    },
    {
      id: "vergleich",
      titel: "Gesamtkostenvergleich über 20 Jahre",
      tocLabel: "20-Jahres-Vergleich",
      bloecke: [
        {
          typ: "p",
          text: `**Entscheidend ist, was nach 20 Jahren unter dem Strich übrig bleibt.** Wir rechnen mit derselben Beispielanlage wie im [Solarrechner](/solarrechner): 10 kWp auf einem Süddach, ${(4500).toLocaleString("de-DE")} kWh Jahresverbrauch, ${ctStr(ANNAHMEN.strompreis)} ct Strompreis mit ${Math.round(ANNAHMEN.strompreisSteigerung * 100)} % Steigerung pro Jahr. Die Anlage erzeugt in allen Modellen gleich viel – verschieden ist nur, wer was bezahlt.`,
        },
        {
          typ: "tabelle",
          caption: "10 kWp ohne Speicher: Ergebnis nach 20 Jahren je Modell",
          kopf: ["Posten (Summe 20 Jahre)", "Kauf bar", `Kredit (${KREDIT_JAHRE} J., ${Math.round(ZINS * 100)} %)`, `Miete ${RATE_A} €/Monat`, `Miete ${RATE_B} €/Monat`],
          zeilen: [
            ["Stromersparnis + Einspeisung", eur(OHNE.vorteil), eur(OHNE.vorteil), eur(OHNE.vorteil), eur(OHNE.vorteil)],
            ["Anschaffung", eur(-OHNE.P), eur(-OHNE.P), "–", "–"],
            ["Zinsen", "–", eur(-OHNE.zinsen), "–", "–"],
            ["Betriebskosten", eur(-OHNE.betrieb), eur(-OHNE.betrieb), "in Miete enthalten", "in Miete enthalten"],
            ["Mietzahlungen", "–", "–", eur(-RATE_A * 12 * JAHRE), eur(-RATE_B * 12 * JAHRE)],
            ["Ergebnis nach 20 Jahren", eur(OHNE.kauf), eur(OHNE.kredit), eur(OHNE.miete(RATE_A)), eur(OHNE.miete(RATE_B))],
          ],
          markierteZeile: 5,
          hervorheben: 1,
          minBreite: 720,
          fussnote: `Rechenkern des Solarrechners inkl. ${String(ANNAHMEN.degradationProJahr * 100).replace(".", ",")} % Moduldegradation und Betriebskosten von ${ANNAHMEN.betriebskostenProKwp} €/kWp mit Inflation. Kredit: angenommener Effektivzins von ${Math.round(ZINS * 100)} % als Rechenbeispiel, keine Kondition – Ihr Zinssatz hängt von Bank und Bonität ab. Mietraten sind Beispielwerte innerhalb der von der Verbraucherzentrale genannten Spanne (80–300 €/Monat); zugunsten der Miete ist unterstellt, dass Versicherung und Wartung vollständig enthalten sind.`,
        },
        {
          typ: "tabelle",
          caption: "10 kWp mit 8-kWh-Speicher: Ergebnis nach 20 Jahren je Modell",
          kopf: ["", "Kauf bar", `Kredit (${KREDIT_JAHRE} J., ${Math.round(ZINS * 100)} %)`, `Miete ${RATE_A} €/Monat`, `Miete ${RATE_B} €/Monat`],
          zeilen: [
            ["Anschaffung", eur(MIT.P), eur(MIT.P), "–", "–"],
            ["Ergebnis nach 20 Jahren", eur(MIT.kauf), eur(MIT.kredit), eur(MIT.miete(RATE_A)), eur(MIT.miete(RATE_B))],
          ],
          markierteZeile: 1,
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Annahmen wie oben. Beim Kauf ist ein Speichertausch nach etwa 15 Jahren nicht eingerechnet; prüfen Sie bei Mietverträgen, ob der Anbieter den Speicher bei nachlassender Leistung tauscht.",
        },
        {
          typ: "kennzahl",
          wert: `${eur10(OHNE.breakEven)}`,
          titel: "Monatsmiete, ab der die Miete im Beispiel teurer ist als der Kauf",
          text: `Mit 8-kWh-Speicher liegt die Grenze bei rund ${eur10(MIT.breakEven)}. Verglichen mit einem Kredit (${Math.round(ZINS * 100)} % Zinsen) liegen die Grenzen bei rund ${eur10(OHNE.breakEvenKredit)} ohne und ${eur10(MIT.breakEvenKredit)} mit Speicher. Die Verbraucherzentrale nennt für Mietangebote 80 bis 300 € im Monat.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "So berechnen Sie die Grenze für Ihr Angebot",
          text: `Teilen Sie den Kaufpreis einer vergleichbaren Anlage plus rund ${ANNAHMEN.betriebskostenProKwp} € je kWp Betriebskosten pro Jahr durch die Zahl der Mietmonate. Liegt die angebotene Monatsmiete darüber, zahlen Sie für den Service drauf. Beispiel: (${eur(OHNE.P)} + ${eur(OHNE.betrieb)} Betriebskosten) ÷ 240 Monate ≈ ${eur10(OHNE.breakEven)}.`,
        },
      ],
    },
    {
      id: "kauf",
      titel: "Kaufen: höchste Rendite, volle Verantwortung",
      tocLabel: "Kaufen",
      bloecke: [
        {
          typ: "p",
          text: `**Beim Kauf gehört Ihnen die Anlage vom ersten Tag an – mit allen Erträgen und Pflichten.** Auf Wohngebäuden fällt keine Umsatzsteuer an (§ 12 Abs. 3 UStG), und Erträge aus Anlagen bis 30 kWp sind einkommensteuerfrei. Im Beispiel amortisiert sich die Anlage nach rund ${OHNE.r.amortisationJahre.toFixed(1).replace(".", ",")} Jahren; wie die Rechnung funktioniert, erklärt der Ratgeber [Amortisation Photovoltaik](/ratgeber/photovoltaik-amortisation).`,
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Vorteile", text: "Höchster Überschuss, freie Wahl von Anbieter und Komponenten, keine Vertragsbindung, volle Flexibilität bei Hausverkauf, Erweiterung oder Speicher-Nachrüstung." },
            { titel: "Nachteile", text: "Hohe Anfangsinvestition, Sie tragen Reparaturen außerhalb der Garantie, den Wechselrichtertausch und schließen selbst eine [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung) ab." },
          ],
        },
      ],
    },
    {
      id: "kredit",
      titel: "Kaufen mit Kredit: die Alternative ohne Eigenkapital",
      tocLabel: "Kredit",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Kredit verbindet die Vorteile des Kaufs mit geringem Eigenkapitalbedarf.** Im Beispiel kostet ein Kredit über ${eur(OHNE.P)} bei angenommenen ${Math.round(ZINS * 100)} % über ${KREDIT_JAHRE} Jahre rund ${eur(OHNE.zinsen)} Zinsen – die jährliche Rate von rund ${eur(OHNE.rate)} wird zu einem großen Teil durch die Ersparnis von rund ${eur(OHNE.r.ersparnis + OHNE.r.einspeiseErloes)} im ersten Jahr gedeckt. Nach der Tilgung gehören alle Erträge Ihnen.`,
        },
        {
          typ: "liste",
          punkte: [
            "**KfW-Kredit 270:** finanziert PV-Anlagen und Batteriespeicher bis 100 % der Investitionskosten, Laufzeiten bis 30 Jahre, bis zu fünf tilgungsfreie Anlaufjahre. Der Antrag läuft über die Hausbank und muss vor Vorhabenbeginn gestellt werden. Mehr im Ratgeber [KfW 270](/ratgeber/kfw-kredit-270).",
            "**Modernisierungs- oder Ratenkredit:** oft schneller, aber teils teurer. Vergleichen Sie den effektiven Jahreszins.",
            "**Baufinanzierung:** Bei Neubau oder Kauf lässt sich die Anlage oft günstig mitfinanzieren.",
          ],
        },
        {
          typ: "p",
          text: "Welche Wege es gibt und wie wir dabei unterstützen, zeigt die Seite [Finanzierung](/service/finanzierung). Prüfen Sie außerdem mit dem [Förder-Check](/foerdercheck), ob Ihr Land oder Ihre Kommune Zuschüsse oder zinsgünstige Darlehen anbietet.",
        },
      ],
    },
    {
      id: "miete",
      titel: "Mieten: Komfort gegen Aufpreis",
      tocLabel: "Mieten",
      bloecke: [
        {
          typ: "p",
          text: "**Bei der Miete stellt ein Anbieter die Anlage auf Ihr Dach, und Sie zahlen über 15 bis 25 Jahre eine feste Monatsrate.** Den Solarstrom nutzen Sie selbst, die Einspeisevergütung erhalten in der Regel Sie als Mieterin oder Mieter. Viele Anbieter haben ihre Verträge seit 2023 so gestaltet, dass der Nullsteuersatz auch für die Miete gilt – mit Ausnahme des Service-Anteils.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Vorteile", text: "Keine Anfangsinvestition, keine Kreditprüfung bei der Bank, planbare Rate. Je nach Vertrag sind Wartung, Reparaturen, Versicherung und Monitoring enthalten." },
            { titel: "Nachteile", text: "Über die Laufzeit meist deutlich teurer, lange Bindung, eingeschränkte Produktauswahl, Übergabepflicht bei Hausverkauf oder Erbe, Risiko bei Insolvenz des Anbieters." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Die Anlage muss sich in der Mietzeit rechnen",
          text: "Die Verbraucherzentrale empfiehlt, die Wirtschaftlichkeit nur über den Mietzeitraum zu betrachten: Innerhalb dieser Zeit sollte sich die Anlage bezahlt gemacht haben. Oft wäre es während der Mietdauer ähnlich teuer oder sogar günstiger, den Strom weiter vollständig aus dem Netz zu beziehen.",
        },
        { typ: "h3", text: "Was passiert am Vertragsende?" },
        {
          typ: "p",
          text: "Üblich sind drei Varianten: Die Anlage geht für einen symbolischen oder vorab festgelegten Betrag in Ihr Eigentum über, der Vertrag verlängert sich, oder der Anbieter baut die Anlage ab. Klären Sie das vor der Unterschrift – ebenso, wer bei einer Dachsanierung die Demontage bezahlt.",
        },
      ],
    },
    {
      id: "pacht",
      titel: "Pacht, Dachverpachtung und Mietkauf: die Sonderformen",
      tocLabel: "Pacht & Sonderformen",
      bloecke: [
        {
          typ: "p",
          text: "**Der Begriff „Pacht“ wird für zwei gegensätzliche Modelle verwendet – achten Sie auf die Richtung des Geldflusses.**",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Anlagenpacht", text: "Rechtlich etwas anders gestaltet, wirtschaftlich wie die Miete: Sie zahlen eine monatliche Pacht und nutzen den Strom. Es gelten dieselben Prüfpunkte." },
            { titel: "Dachverpachtung", text: "Sie überlassen Ihr Dach einem Investor, der die Anlage baut und betreibt. Sie erhalten eine Pacht oder eine Einmalzahlung, aber keinen eigenen Solarstrom. Meist erst ab großen Dachflächen, etwa auf Hallen – siehe [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe)." },
            { titel: "Mietkauf / Leasing", text: "Raten mit festem Eigentumsübergang am Ende. Rechnen Sie den effektiven Finanzierungssatz aus und vergleichen Sie ihn mit einem Kredit." },
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Dienstbarkeit im Grundbuch",
          text: "Bei Dachverpachtung und teilweise bei Mietmodellen sichern Anbieter ihr Recht am Dach über eine beschränkte persönliche Dienstbarkeit im Grundbuch ab. Das bindet auch spätere Käufer und kann Verkauf oder Beleihung erschweren. Lassen Sie solche Verträge vor der Unterschrift prüfen.",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Mietvertrag prüfen, bevor Sie unterschreiben",
      tocLabel: "Vertrags-Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Gesamtkosten:** Monatsrate × Laufzeit in Monaten ausrechnen und mit einem Kaufangebot plus Betriebskosten vergleichen.",
            "**Rate fest oder mit Preisgleitklausel?** Steigende Raten verschlechtern die Rechnung erheblich.",
            "**Leistungsumfang:** Sind Wartung, Reparaturen, Wechselrichtertausch, Versicherung und Monitoring vollständig enthalten – oder nur teilweise?",
            "**Speicher:** Wird der Speicher getauscht, wenn seine Kapazität nachlässt?",
            "**Vertragsende:** Übernahme zu welchem Preis, Verlängerung oder Abbau – und wer zahlt den Abbau?",
            "**Hausverkauf und Erbe:** Muss der Käufer den Vertrag übernehmen? Gibt es eine Ablösesumme?",
            "**Insolvenz des Anbieters:** Was passiert mit Anlage, Garantien und Service?",
            "**Dachsanierung:** Wer trägt Demontage und Wiedermontage?",
            "**Ertragsprognose:** Mit welchem Eigenverbrauch und welcher Strompreissteigerung wurde gerechnet? Angaben über 3 % Preissteigerung pro Jahr oder 50 % Autarkie ohne Speicher sind kritisch zu sehen.",
          ],
        },
        {
          typ: "p",
          text: "Wie Sie Kaufangebote Position für Position einordnen, zeigt der Ratgeber [Photovoltaik-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen). Eine Übersicht der aktuellen Preise je kWp finden Sie unter [Solaranlage Kosten](/ratgeber/solaranlage-kosten).",
        },
      ],
    },
    {
      id: "fuer-wen",
      titel: "Für wen sich welches Modell eignet",
      tocLabel: "Für wen?",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Entscheidungshilfe: Welches Modell passt zu Ihrer Situation?",
          kopf: ["Ihre Situation", "Empfehlung"],
          zeilen: [
            ["Eigenkapital vorhanden, langfristig im Haus", "Kauf – höchster Überschuss"],
            ["Wenig Eigenkapital, gute Bonität", "Kauf mit Kredit, z. B. KfW 270"],
            ["Kein Kredit möglich, Wunsch nach Rundum-Service", "Miete prüfen – nur mit sorgfältigem Vertragscheck"],
            ["Hausverkauf in wenigen Jahren geplant", "Kauf; eine PV-Anlage steigert in der Regel den Immobilienwert, ein Mietvertrag muss übertragen werden"],
            ["Große Dachfläche (Halle, Stall), kein Eigenbedarf", "Eigeninvestition oder Dachverpachtung vergleichen"],
          ],
          hervorheben: 1,
          minBreite: 560,
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Kaufen durchrechnen",
          text: "Mit dem Solarrechner sehen Sie Investition, Amortisation und 20-Jahres-Cashflow Ihrer Anlage – die Basis für jeden Vergleich mit einem Mietangebot.",
          label: "Zum Solarrechner",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ist es besser, eine PV-Anlage zu mieten oder zu kaufen?",
      a: "Finanziell ist Kaufen – bar oder mit Kredit – über 20 Jahre fast immer besser. Die Miete lohnt sich allenfalls, wenn keine Finanzierung möglich ist und Sie Wert auf einen Rundum-Service legen. Auch die Verbraucherzentrale bewertet Miete und Pacht in der Regel als deutlich teurer.",
    },
    {
      q: "Was kostet es, eine Solaranlage zu mieten?",
      a: "Mietangebote kosten laut Verbraucherzentrale meist zwischen 80 und 300 € im Monat, je nach Größe, Speicher und Leistungsumfang. Über eine Laufzeit von 20 Jahren summiert sich das auf einen hohen fünfstelligen Betrag.",
    },
    {
      q: "Wer bekommt bei einer gemieteten PV-Anlage die Einspeisevergütung?",
      a: "In der Regel die Mieterin oder der Mieter, sofern der Vertrag nichts anderes vorsieht. Sie gelten dann meist auch als Anlagenbetreiber und müssen die Anlage im Marktstammdatenregister eintragen – prüfen Sie, ob der Anbieter das übernimmt.",
    },
    {
      q: "Was passiert mit der Mietanlage, wenn ich mein Haus verkaufe?",
      a: "Die meisten Verträge verpflichten Sie, den Mietvertrag auf den Käufer oder die Erben zu übertragen. Stimmt der Käufer nicht zu, drohen Ablösezahlungen. Klären Sie diese Regelung vor der Unterschrift.",
    },
    {
      q: "Kann ich eine gemietete PV-Anlage vorzeitig kaufen?",
      a: "Das hängt vom Vertrag ab. Manche Anbieter erlauben eine vorzeitige Übernahme gegen einen Restwert, andere schließen sie aus. Lassen Sie sich den Ablösewert für verschiedene Zeitpunkte schriftlich geben.",
    },
    {
      q: "Fällt bei der Miete einer PV-Anlage Umsatzsteuer an?",
      a: "Viele Anbieter haben ihre Verträge so umgestellt, dass der Nullsteuersatz nach § 12 Abs. 3 UStG auch für die Miete gilt – ausgenommen der Anteil für Serviceleistungen, auf den regulär Umsatzsteuer anfällt.",
    },
    {
      q: "Lohnt sich Dachverpachtung für ein Einfamilienhaus?",
      a: "Selten. Investoren suchen meist große Dachflächen ab mehreren hundert Quadratmetern. Beim Einfamilienhaus bringt die eigene Anlage durch den Eigenverbrauch deutlich mehr als eine Pachtzahlung.",
    },
  ],

  passend: [
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Wege, eine PV-Anlage ohne Eigenkapital zu kaufen." },
    { href: "/ratgeber/photovoltaik-amortisation", titel: "Amortisation Photovoltaik", text: "Formel, Beispiele und Rendite." },
    { href: "/ratgeber/kfw-kredit-270", titel: "KfW-Kredit 270", text: "Konditionen, Antrag und Voraussetzungen." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp 2026." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Photovoltaik: Solaranlage mieten – eine Alternative zum Kauf?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-solaranlage-mieten-eine-alternative-zum-kauf-71086", stand: "07/2026" },
    { titel: "Verbraucherzentrale – Photovoltaik: Was bei der Planung einer Solaranlage wichtig ist", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-bei-der-planung-einer-solaranlage-wichtig-ist-5574", stand: "08/2026" },
    { titel: "KfW – Erneuerbare Energien – Standard (270)", url: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Erneuerbare-Energien-Standard-(270)/", stand: "09/2026" },
    { titel: "§ 12 Abs. 3 UStG – Nullsteuersatz für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html", stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung für Photovoltaikanlagen bis 30 kWp", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Kaufen durchrechnen", text: "Investition, Amortisation und Überschuss Ihrer Anlage.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Kaufangebot als Vergleichsbasis?",
    text: "Wir erstellen Ihnen ein transparentes Kaufangebot mit Wirtschaftlichkeitsrechnung – ideal, um ein Mietangebot fair dagegenzurechnen.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Finanzierung ansehen", href: "/service/finanzierung" },
  },
};

export default artikel;
