import Link from "next/link";
import { FIRMA } from "@/lib/site";

/** Stand der AGB – bei jeder inhaltlichen Änderung anpassen (gilt nur für Neuverträge). */
export const AGB_STAND = "29. September 2026";

const extern = { target: "_blank", rel: "noopener noreferrer" };
const NeuerTab = () => <span className="sr-only"> (öffnet in neuem Tab)</span>;

const INHALT = [
  { teil: "Teil A – Allgemeine Bestimmungen (alle Kunden)" },
  { id: "geltung", titel: "1. Geltungsbereich und Begriffe" },
  { id: "vertrag", titel: "2. Angebot, Kostenvoranschlag und Vertragsabschluss" },
  { id: "leistung", titel: "3. Leistungsumfang, Planung und Prognosen" },
  { id: "mitwirkung", titel: "4. Mitwirkungspflichten des Kunden" },
  { id: "preise", titel: "5. Preise und Zusatzleistungen" },
  { id: "zahlung", titel: "6. Zahlung und Zahlungsverzug" },
  { id: "fristen", titel: "7. Liefer- und Leistungsfristen" },
  { id: "gefahr", titel: "8. Lieferung, Gefahrübergang und Lagerung" },
  { id: "abnahme", titel: "9. Montage, Inbetriebnahme und Übernahme" },
  { id: "eigentum", titel: "10. Eigentumsvorbehalt" },
  { id: "gewaehrleistung", titel: "11. Gewährleistung und Herstellergarantien" },
  { id: "haftung", titel: "12. Haftung" },
  { id: "foerderung", titel: "13. Förderungen, Netzzugang und Behörden" },
  { id: "wartung", titel: "14. Wartungs- und Serviceverträge" },
  { id: "fernwartung", titel: "15. Monitoring, Fernwartung und Software" },
  { id: "ruecktritt", titel: "16. Rücktritt und Stornierung" },
  { id: "referenzen", titel: "17. Datenschutz und Referenzen" },
  { id: "schluss", titel: "18. Anwendbares Recht, Gerichtsstand, Schlussbestimmungen" },
  { teil: "Teil B – Ergänzende Bestimmungen für Unternehmer" },
  { id: "b2b", titel: "19. Bestimmungen für Unternehmer und öffentliche Auftraggeber" },
  { teil: "Teil C – Ergänzende Bestimmungen für Verbraucher" },
  { id: "verbraucher", titel: "20. Bestimmungen für Verbraucher" },
  { id: "widerruf", titel: "21. Rücktrittsrecht bei Fern- und Auswärtsgeschäften (FAGG)" },
  { id: "formular", titel: "22. Muster-Rücktrittsformular" },
];

function Abschnitt({ id, titel, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h3>{titel}</h3>
      {children}
    </section>
  );
}

/** Nummerierte Klausel – Nummer links, Text rechts. */
function K({ n, children }) {
  return (
    <div className="mt-3 grid grid-cols-[3rem_1fr] gap-2">
      <span className="font-semibold text-ink-900">{n}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const AGComponent = () => {
  return (
    <div>
      <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-ov-700">Stand: {AGB_STAND}</p>
      <p className="mt-3">
        Diese Allgemeinen Geschäftsbedingungen (AGB) regeln Lieferung, Planung, Montage, Inbetriebnahme, Wartung und Service
        von Photovoltaikanlagen, Stromspeichern, Ladeinfrastruktur und zugehöriger Elektro- und Regelungstechnik durch die{" "}
        <strong>{FIRMA.name}</strong>, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}, {FIRMA.firmenbuch},{" "}
        {FIRMA.firmenbuchgericht} (im Folgenden „Ökovolt“ oder „wir“). Teil A gilt für alle Kunden, Teil B ergänzend für
        Unternehmer, Teil C ergänzend für Verbraucher.
      </p>

      <nav aria-label="Inhaltsverzeichnis der AGB" className="mt-8 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
        <p className="font-display text-[17px] font-bold text-ink-900">Inhaltsverzeichnis</p>
        <ul className="!list-none !pl-0 mt-2 space-y-1 text-[15px]">
          {INHALT.map((e) =>
            e.teil ? (
              <li key={e.teil} className="pt-3 font-semibold text-ink-900">
                {e.teil}
              </li>
            ) : (
              <li key={e.id}>
                <a href={`#${e.id}`}>{e.titel}</a>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* ------------------------------------------------------------------ */}
      <h2>Teil A – Allgemeine Bestimmungen</h2>

      <Abschnitt id="geltung" titel="1. Geltungsbereich und Begriffe">
        <K n="1.1">
          Diese AGB gelten für alle Angebote, Verträge und vorvertraglichen Schuldverhältnisse zwischen Ökovolt und ihren
          Kunden, insbesondere für Kauf-, Werk- und Werklieferungsverträge über Photovoltaikanlagen, Stromspeicher,
          Ladeinfrastruktur, Energiemanagement- und Regelungssysteme (z. B. Parkregler) sowie für Wartungs-, Prüf- und
          Serviceverträge.
        </K>
        <K n="1.2">
          <strong>Verbraucher</strong> ist, wer nicht Unternehmer ist (§ 1 Konsumentenschutzgesetz, KSchG).{" "}
          <strong>Unternehmer</strong> ist, wem das Geschäft zum Betrieb seines Unternehmens gehört (§ 1 KSchG, § 1 UGB),
          einschließlich Land- und Forstwirten sowie juristischer Personen des öffentlichen Rechts (z. B. Gemeinden, Länder,
          Verbände) und der von ihnen beherrschten Unternehmen.
        </K>
        <K n="1.3">
          Es gilt folgende Rangfolge: (1) individuell ausgehandelte Vereinbarungen, (2) unser Angebot bzw. unsere
          Auftragsbestätigung samt Leistungsbeschreibung, (3) diese AGB, (4) gegenüber Unternehmern für Bauleistungen
          ergänzend die ÖNORM B 2110 nach Punkt 19.1, (5) die gesetzlichen Bestimmungen.
        </K>
        <K n="1.4">
          Gegenüber Unternehmern gelten diese AGB auch für künftige Geschäfte, ohne dass erneut darauf hingewiesen werden
          muss. Allgemeine Geschäfts- oder Einkaufsbedingungen des Kunden gelten nur, wenn wir ihnen ausdrücklich schriftlich
          zustimmen; dies gilt auch, wenn wir in Kenntnis solcher Bedingungen leisten.
        </K>
        <K n="1.5">
          Zwingende gesetzliche Rechte von Verbrauchern – insbesondere nach KSchG, Fern- und Auswärtsgeschäfte-Gesetz (FAGG),
          Verbrauchergewährleistungsgesetz (VGG) und ABGB – werden durch diese AGB nicht eingeschränkt.
        </K>
      </Abschnitt>

      <Abschnitt id="vertrag" titel="2. Angebot, Kostenvoranschlag und Vertragsabschluss">
        <K n="2.1">
          Unsere Angebote sind freibleibend, sofern darin keine Bindungsfrist angegeben ist. Beschreibungen, Abbildungen und
          technische Daten auf der Website, in Prospekten oder Rechnern sind unverbindliche Produktinformationen und keine
          Angebote.
        </K>
        <K n="2.2">
          Der Vertrag kommt durch unsere schriftliche Auftragsbestätigung (auch per E-Mail oder elektronischer Signatur), durch
          Unterzeichnung des Angebots durch beide Seiten oder durch Beginn der Leistungsausführung zustande.
        </K>
        <K n="2.3">
          Kostenvoranschläge erstellen wir nach bestem Fachwissen auf Grundlage der uns bekannten Angaben. Gegenüber
          Unternehmern sind sie unverbindlich, sofern sie nicht ausdrücklich als verbindlich bezeichnet sind. Für Verbraucher
          gilt Punkt 20.2. Ein Kostenvoranschlag ist nur dann entgeltlich, wenn dies vor seiner Erstellung vereinbart wurde.
        </K>
        <K n="2.4">
          Pläne, Berechnungen, Belegungspläne, Simulationen und sonstige Planungsunterlagen, die wir vor oder bei
          Vertragsabschluss übergeben, bleiben urheberrechtlich geschützt. Sie dürfen ohne unsere Zustimmung weder
          vervielfältigt noch Dritten zugänglich gemacht oder zur Ausführung durch Dritte verwendet werden. Kommt kein Vertrag
          zustande, sind sie auf Verlangen zurückzugeben bzw. zu löschen.
        </K>
      </Abschnitt>

      <Abschnitt id="leistung" titel="3. Leistungsumfang, Planung und Prognosen">
        <K n="3.1">
          Der Leistungsumfang ergibt sich abschließend aus Angebot bzw. Auftragsbestätigung und Leistungsbeschreibung.
          Leistungen, die dort nicht genannt sind – etwa Statik-Nachweise, Dacharbeiten, Gerüste, Erdarbeiten,
          Brandschutzmaßnahmen, Zählerplatz-Umbauten, Netzausbau oder Blitzschutz –, sind nur geschuldet, wenn sie
          ausdrücklich vereinbart wurden.
        </K>
        <K n="3.2">
          Wir führen unsere Leistungen nach den anerkannten Regeln der Technik und den bei Vertragsabschluss geltenden
          elektrotechnischen Sicherheitsvorschriften (Elektrotechnikgesetz 1992, Elektrotechnikverordnung und darin
          verbindlich erklärte ÖVE/ÖNORM-Bestimmungen), den Technischen und Organisatorischen Regeln (TOR) sowie den
          technischen Anschlussbedingungen des jeweiligen Netzbetreibers aus.
        </K>
        <K n="3.3">
          Wir dürfen gleichwertige oder höherwertige Komponenten anderer Hersteller oder Typen verwenden, wenn die
          vereinbarten Komponenten nicht oder nur mit erheblicher Verzögerung lieferbar sind und dem Kunden die Änderung
          zumutbar ist, insbesondere weil sie geringfügig und sachlich gerechtfertigt ist. Gegenüber Verbrauchern informieren
          wir vorab.
        </K>
        <K n="3.4">
          Ertrags-, Eigenverbrauchs-, Autarkie- und Wirtschaftlichkeitsberechnungen sowie Ergebnisse unserer Online-Rechner
          und des Standort-Checks beruhen auf Annahmen (u. a. Wetter- und Einstrahlungsdaten, Verbrauchsprofile,
          Strompreise, Tarife, Förderungen, Steuern). Sie sind unverbindliche Prognosen und keine zugesicherten Eigenschaften,
          sofern nicht ausdrücklich schriftlich eine bestimmte Leistung oder ein bestimmter Ertrag zugesichert wird.
          Leistungstoleranzen der Komponenten richten sich nach den Datenblättern der Hersteller.
        </K>
        <K n="3.5">
          Wir dürfen geeignete, befugte Subunternehmer (z. B. Elektro-Partnerbetriebe, Dachdecker, Gerüstbauer) einsetzen. Wir
          bleiben gegenüber dem Kunden für deren Leistungen verantwortlich.
        </K>
      </Abschnitt>

      <Abschnitt id="mitwirkung" titel="4. Mitwirkungspflichten des Kunden">
        <K n="4.1">
          Der Kunde stellt uns rechtzeitig alle für Planung und Ausführung nötigen Angaben und Unterlagen vollständig und
          richtig zur Verfügung, insbesondere zu Eigentumsverhältnissen, Dachaufbau und Tragfähigkeit, Leitungsführungen
          (Strom, Gas, Wasser, Daten), Schadstoffen (z. B. Asbest), Brandabschnitten sowie Verbrauchs- und Lastgangdaten.
        </K>
        <K n="4.2">
          Sofern nicht anders vereinbart, sorgt der Kunde für die statische Eignung des Gebäudes bzw. der Aufstellfläche, für
          freie und sichere Zufahrt und Zugänge, geeignete Lagerflächen, Baustrom und die Zustimmung von Miteigentümern,
          Vermietern, Verpächtern oder Dienstbarkeitsberechtigten.
        </K>
        <K n="4.3">
          Stellt sich bei der Ausführung heraus, dass die bestehende elektrische Anlage, der Zählerplatz oder die
          Dachkonstruktion nicht den geltenden Vorschriften entspricht oder für die Anlage nicht geeignet ist, informieren
          wir den Kunden. Erforderliche Zusatzarbeiten führen wir nur nach Beauftragung und gegen gesondertes Entgelt aus.
        </K>
        <K n="4.4">
          Verzögert sich die Ausführung aus Gründen, die in der Sphäre des Kunden liegen, verlängern sich die Fristen
          angemessen. Dadurch entstehende Mehrkosten (z. B. Wartezeiten, zusätzliche Anfahrten, Umlagerung) kann Ökovolt
          gesondert verrechnen.
        </K>
      </Abschnitt>

      <Abschnitt id="preise" titel="5. Preise und Zusatzleistungen">
        <K n="5.1">
          Preise gegenüber Unternehmern verstehen sich in Euro netto zuzüglich der gesetzlichen Umsatzsteuer; Preise gegenüber
          Verbrauchern verstehen sich als Endpreise einschließlich Umsatzsteuer. Sofern im Angebot nicht anders angegeben,
          sind Lieferung und Montage innerhalb Österreichs enthalten.
        </K>
        <K n="5.2">
          Nicht im Angebot enthaltene Leistungen, die der Kunde zusätzlich beauftragt oder die nach Punkt 4.3 erforderlich
          werden, verrechnen wir nach Vereinbarung bzw. zu unseren im Angebot genannten, ansonsten ortsüblichen Stunden- und
          Materialsätzen.
        </K>
        <K n="5.3">
          Gebühren und Entgelte Dritter – insbesondere Netzzutritts- und Netzbereitstellungsentgelte, Messentgelte,
          Kosten der Zählersetzung, Behördengebühren und Verwaltungsabgaben – trägt der Kunde, sofern sie nicht ausdrücklich
          im Angebot enthalten sind.
        </K>
      </Abschnitt>

      <Abschnitt id="zahlung" titel="6. Zahlung und Zahlungsverzug">
        <K n="6.1">
          Zahlungen sind nach dem im Angebot vereinbarten Zahlungsplan zu leisten. Fehlt ein Zahlungsplan, ist das Entgelt
          nach Übernahme und Rechnungslegung binnen 14 Tagen ohne Abzug fällig. Bei umfangreichen Aufträgen dürfen wir
          Teilrechnungen entsprechend dem Leistungsfortschritt legen.
        </K>
        <K n="6.2">
          Bei Zahlungsverzug schuldet der Kunde Verzugszinsen in gesetzlicher Höhe (gegenüber Unternehmern nach Punkt 19.5)
          sowie den Ersatz notwendiger und zweckentsprechender Mahn- und Betreibungskosten, gegenüber Verbrauchern nur, soweit
          sie verschuldet sind und in einem angemessenen Verhältnis zur Forderung stehen (§ 1333 Abs 2 ABGB).
        </K>
        <K n="6.3">
          Ist der Kunde mit einer fälligen Zahlung in Verzug, dürfen wir nach schriftlicher Mahnung unter Setzung einer
          Nachfrist von mindestens 14 Tagen weitere Leistungen bis zur Zahlung zurückhalten. Vereinbarte Fristen verlängern
          sich entsprechend.
        </K>
        <K n="6.4">
          Zahlungen gelten mit dem Tag als geleistet, an dem der Betrag auf unserem Konto gutgeschrieben ist.
        </K>
      </Abschnitt>

      <Abschnitt id="fristen" titel="7. Liefer- und Leistungsfristen">
        <K n="7.1">
          Liefer- und Montagetermine sind nur verbindlich, wenn sie ausdrücklich als verbindlich vereinbart wurden. Sie setzen
          voraus, dass alle technischen und behördlichen Voraussetzungen geklärt, die Mitwirkungspflichten erfüllt und
          vereinbarte Anzahlungen eingegangen sind.
        </K>
        <K n="7.2">
          Montagearbeiten auf Dächern und im Freien sind witterungsabhängig. Bei Niederschlag, Schnee, Eis, Sturm, Gewitter
          oder großer Hitze dürfen wir Arbeiten aus Gründen des Arbeitnehmerschutzes und der Ausführungsqualität unterbrechen
          oder verschieben.
        </K>
        <K n="7.3">
          Ereignisse, die wir nicht zu vertreten haben – insbesondere höhere Gewalt, behördliche Maßnahmen,
          Lieferengpässe oder -verzögerungen von Herstellern trotz rechtzeitiger Bestellung, Verzögerungen durch den
          Netzbetreiber (z. B. Netzzugangsbeurteilung, Zählersetzung) oder Behörden –, verlängern die Fristen um die Dauer
          der Behinderung und eine angemessene Anlaufzeit. Wir informieren den Kunden unverzüglich.
        </K>
        <K n="7.4">
          Bei Verzug kann der Kunde nach Setzung einer angemessenen Nachfrist unter Rücktrittsandrohung vom Vertrag
          zurücktreten (§ 918 ABGB). Schadenersatzansprüche richten sich nach Punkt 12.
        </K>
      </Abschnitt>

      <Abschnitt id="gefahr" titel="8. Lieferung, Gefahrübergang und Lagerung">
        <K n="8.1">
          Gegenüber Unternehmern geht die Gefahr mit der Anlieferung an den vereinbarten Lieferort (Baustelle) über, bei
          vereinbarter Abholung mit der Bereitstellung. Gegenüber Verbrauchern gilt § 7b KSchG: Die Gefahr geht erst über,
          wenn die Ware an den Verbraucher oder an einen von ihm bestimmten Dritten abgeliefert wird.
        </K>
        <K n="8.2">
          An die Baustelle geliefertes Material lagert der Kunde bis zum Einbau geschützt und versperrt, sofern keine andere
          Vereinbarung besteht. Unternehmer tragen ab Anlieferung das Risiko von Diebstahl und Beschädigung durch Dritte und
          sorgen für ausreichenden Versicherungsschutz.
        </K>
        <K n="8.3">
          Teillieferungen und Teilleistungen sind zulässig, soweit sie dem Kunden zumutbar sind.
        </K>
      </Abschnitt>

      <Abschnitt id="abnahme" titel="9. Montage, Inbetriebnahme und Übernahme">
        <K n="9.1">
          Nach Fertigstellung führen wir die Erstprüfung der elektrischen Anlage durch, nehmen die Anlage in Betrieb, soweit
          der Netzbetreiber den Netzanschluss hergestellt hat, und zeigen die Fertigstellung an. Der Kunde erhält die
          Anlagendokumentation mit Prüfbefund, Datenblättern und den für den Betrieb wesentlichen Hinweisen.
        </K>
        <K n="9.2">
          Die Übernahme erfolgt durch eine gemeinsame Begehung mit Übernahmeprotokoll, in dem festgestellte Mängel vermerkt
          werden. Unwesentliche Mängel, die den bestimmungsgemäßen Betrieb nicht beeinträchtigen, berechtigen nicht zur
          Verweigerung der Übernahme; sie werden in angemessener Frist behoben.
        </K>
        <K n="9.3">
          Die Zählersetzung, die Freigabe der Einspeisung und die Aktivierung des Netzzugangs obliegen dem Netzbetreiber.
          Verzögerungen dabei hindern die Fertigstellung und Übernahme unserer Leistung nicht, sofern die Anlage
          betriebsbereit errichtet ist.
        </K>
        <K n="9.4">
          Der Kunde darf die Anlage nur nach Maßgabe der übergebenen Betriebshinweise betreiben und nicht selbst oder durch
          nicht befugte Personen verändern. Wiederkehrende Prüfungen nach den elektrotechnischen Vorschriften und den
          Bedingungen des Versicherers veranlasst der Kunde; wir bieten diese gerne im Rahmen eines Wartungsvertrags an.
        </K>
      </Abschnitt>

      <Abschnitt id="eigentum" titel="10. Eigentumsvorbehalt">
        <K n="10.1">
          Gelieferte Waren bleiben bis zur vollständigen Bezahlung des Entgelts samt Nebenforderungen unser Eigentum.
        </K>
        <K n="10.2">
          Der Kunde hat uns Pfändungen oder sonstige Zugriffe Dritter auf Vorbehaltsware unverzüglich mitzuteilen und
          die Dritten auf unser Eigentum hinzuweisen. Wird die Anlage auf einer fremden Liegenschaft oder einem gepachteten
          Dach errichtet, teilt der Kunde dies vor Vertragsabschluss mit.
        </K>
        <K n="10.3">
          Soweit Vorbehaltsware durch den Einbau unselbständiger Bestandteil eines Gebäudes wird und unser Eigentum dadurch
          erlischt, bleiben unsere Ansprüche aus dem Vertrag unberührt. Bei Zahlungsverzug dürfen wir nach Rücktritt vom
          Vertrag noch nicht eingebaute oder ohne Beschädigung abtrennbare Vorbehaltsware herausverlangen; die Kosten der
          Rücknahme trägt der Kunde, sofern er den Rücktritt verschuldet hat.
        </K>
      </Abschnitt>

      <Abschnitt id="gewaehrleistung" titel="11. Gewährleistung und Herstellergarantien">
        <K n="11.1">
          Wir leisten Gewährleistung nach den gesetzlichen Bestimmungen, gegenüber Unternehmern mit den Maßgaben von Punkt
          19, gegenüber Verbrauchern nach Punkt 20.
        </K>
        <K n="11.2">
          Keine Mängel sind insbesondere: gewöhnliche Abnutzung; Leistungsminderungen innerhalb der vom Hersteller
          angegebenen Toleranzen und Degradationswerte; Ertragsabweichungen durch Wetter, Verschmutzung, Schnee oder später
          entstandene Verschattung; Schäden durch unsachgemäße Bedienung, fehlende Wartung, Eingriffe nicht befugter
          Dritter, Überspannung aus dem öffentlichen Netz oder Naturereignisse (z. B. Hagel, Sturm, Blitzschlag,
          Schneelast über den Bemessungswerten), soweit diese nicht auf einem Mangel unserer Leistung beruhen.
        </K>
        <K n="11.3">
          Garantien der Hersteller (z. B. Produkt- und Leistungsgarantien für Module, Wechselrichter oder Speicher) sind
          Zusagen des jeweiligen Herstellers nach dessen Bedingungen. Sie bestehen neben den gesetzlichen
          Gewährleistungsrechten und schränken diese nicht ein. Wir unterstützen den Kunden bei der Geltendmachung. Arbeiten,
          die außerhalb unserer Gewährleistungspflicht für den Tausch von Garantiekomponenten anfallen, verrechnen wir nach
          Aufwand, sofern der Hersteller sie nicht vergütet.
        </K>
      </Abschnitt>

      <Abschnitt id="haftung" titel="12. Haftung">
        <K n="12.1">
          Wir haften für Schäden, die wir oder unsere Erfüllungsgehilfen vorsätzlich oder grob fahrlässig verursacht haben.
          Für leichte Fahrlässigkeit haften wir nur bei Personenschäden sowie – gegenüber Verbrauchern – für Schäden an
          Sachen, die wir zur Bearbeitung übernommen haben.
        </K>
        <K n="12.2">
          Gegenüber Unternehmern gelten zusätzlich die Beschränkungen nach Punkt 19.4.
        </K>
        <K n="12.3">
          Die Haftung nach dem Produkthaftungsgesetz sowie für Personenschäden bleibt von allen Haftungsbeschränkungen
          unberührt.
        </K>
      </Abschnitt>

      <Abschnitt id="foerderung" titel="13. Förderungen, Netzzugang und Behörden">
        <K n="13.1">
          Auf Wunsch unterstützen wir den Kunden bei der Vorbereitung von Förderansuchen (z. B. EAG-Investitionszuschuss über
          die OeMAG, Umweltförderung im Inland über die KPC, Landes- und Gemeindeförderungen). Förderwerber ist stets der
          Kunde. Er ist für die Einhaltung der Förderrichtlinien, Fristen und Voraussetzungen sowie für die Richtigkeit der
          Angaben verantwortlich.
        </K>
        <K n="13.2">
          Viele Förderrichtlinien verlangen, dass das Förderansuchen vor Bestellung oder Baubeginn eingebracht wird. Der Kunde
          klärt dies vor Auftragserteilung. Auf Wunsch schließen wir den Vertrag unter der aufschiebenden Bedingung einer
          Förderzusage ab; dies muss ausdrücklich vereinbart werden.
        </K>
        <K n="13.3">
          Wir übernehmen keine Haftung für die Gewährung, die Höhe, die Auszahlung oder den Bestand einer Förderung und für
          Rückforderungen durch die Förderstelle, es sei denn, wir haben eine konkrete Tätigkeit im Förderverfahren
          ausdrücklich übernommen und den Schaden durch deren fehlerhafte Ausführung schuldhaft verursacht. Die Gewährung
          einer Förderung ist nur dann Bedingung oder Geschäftsgrundlage des Vertrags, wenn dies ausdrücklich vereinbart
          ist; die Rechte von Verbrauchern nach § 3a KSchG bleiben unberührt (Punkt 20.6).
        </K>
        <K n="13.4">
          Über Netzzugang, Anschlusspunkt, zulässige Einspeiseleistung und allfällige Einspeisebegrenzungen entscheidet der
          Netzbetreiber. Wir bereiten auf Wunsch die Netzzugangsunterlagen vor. Wir haften nicht für Entscheidungen,
          Auflagen, Kosten oder Verzögerungen des Netzbetreibers.
        </K>
        <K n="13.5">
          Baurechtliche Bewilligungen oder Anzeigen, naturschutz-, denkmalschutz- oder elektrizitätsrechtliche Genehmigungen
          sowie raumordnungsrechtliche Voraussetzungen (z. B. Widmung bei Freiflächenanlagen) holt der Kunde ein, sofern wir
          dies nicht ausdrücklich übernommen haben. Wir stellen die dafür nötigen technischen Unterlagen zur Verfügung.
        </K>
      </Abschnitt>

      <Abschnitt id="wartung" titel="14. Wartungs- und Serviceverträge">
        <K n="14.1">
          Umfang, Intervalle, Service-Level und allfällige Reaktionszeiten von Wartungs-, Prüf-, Reinigungs- und
          Serviceleistungen ergeben sich ausschließlich aus dem jeweiligen Wartungsvertrag bzw. der Leistungsbeschreibung.
          Nicht enthaltene Leistungen, Ersatzteile und Reparaturen verrechnen wir gesondert nach Aufwand.
        </K>
        <K n="14.2">
          Wartungsverträge werden, sofern nicht anders vereinbart, auf unbestimmte Zeit geschlossen und können von beiden
          Seiten unter Einhaltung einer Frist von drei Monaten zum Ende eines Vertragsjahres schriftlich gekündigt werden.
          Für Verbraucher gilt zusätzlich Punkt 20.7. Das Recht zur Kündigung aus wichtigem Grund bleibt unberührt.
        </K>
        <K n="14.3">
          Laufende Entgelte aus Wartungsverträgen sind wertgesichert nach dem Verbraucherpreisindex 2020 (VPI 2020) der
          Statistik Austria oder dem an seine Stelle tretenden Index. Ausgangsbasis ist die für den Monat des
          Vertragsabschlusses verlautbarte Indexzahl. Das Entgelt wird jährlich zum Beginn eines Vertragsjahres im Ausmaß der
          Indexveränderung angepasst, und zwar sowohl nach oben als auch nach unten; Veränderungen bis einschließlich 3 %
          bleiben unberücksichtigt, werden aber bei der nächsten Überschreitung mitberücksichtigt. Gegenüber Verbrauchern
          erfolgt eine Erhöhung frühestens zwei Monate nach Vertragsabschluss.
        </K>
        <K n="14.4">
          Der Kunde gewährt uns zu den vereinbarten Terminen Zugang zur Anlage und sorgt für einen sicheren Arbeitsplatz
          (z. B. Anschlagpunkte, Zugang zum Dach). Hält er einen vereinbarten Termin ohne rechtzeitige Absage (mindestens zwei
          Werktage vorher) nicht ein, dürfen wir den vergeblichen Aufwand verrechnen.
        </K>
      </Abschnitt>

      <Abschnitt id="fernwartung" titel="15. Monitoring, Fernwartung und Software">
        <K n="15.1">
          Soweit vereinbart, überwachen und warten wir Anlagen aus der Ferne (z. B. über unsere Fernwartungs- und
          SCADA-Systeme oder Portale der Hersteller). Der Kunde stellt dafür eine geeignete Internetverbindung bereit und
          gestattet den Fernzugriff. Für Ausfälle von Kommunikationsverbindungen oder Portalen Dritter haften wir nicht.
        </K>
        <K n="15.2">
          An Software, Firmware und Parametrierungen, die wir bereitstellen, erhält der Kunde ein einfaches, nicht
          übertragbares Recht zur Nutzung für den Betrieb der Anlage; eine Weitergabe mit der Anlage ist zulässig. Updates
          spielen wir im Rahmen eines Wartungsvertrags oder auf Anfrage ein.
        </K>
        <K n="15.3">
          Wir setzen angemessene technische und organisatorische Maßnahmen zur IT-Sicherheit um. Der Kunde verändert
          Zugangsdaten, Netzwerkeinstellungen und Regelungsparameter nicht ohne Abstimmung mit uns, insbesondere wenn diese
          Vorgaben des Netzbetreibers umsetzen (z. B. Einspeisebegrenzung, Blindleistungsregelung).
        </K>
      </Abschnitt>

      <Abschnitt id="ruecktritt" titel="16. Rücktritt und Stornierung">
        <K n="16.1">
          Wir dürfen vom Vertrag zurücktreten, wenn der Kunde trotz Mahnung und Setzung einer Nachfrist von mindestens 14
          Tagen eine fällige Zahlung oder wesentliche Mitwirkungspflicht nicht erfüllt, oder wenn sich die Ausführung aus
          Gründen, die in der Sphäre des Kunden liegen, trotz Nachfrist nicht beginnen oder fortsetzen lässt. Zwingende
          Bestimmungen der Insolvenzordnung bleiben unberührt.
        </K>
        <K n="16.2">
          Unterbleibt die Ausführung aus Gründen, die auf Seiten des Kunden liegen, oder tritt der Kunde ohne rechtfertigenden
          Grund zurück, gebührt uns nach § 1168 ABGB das vereinbarte Entgelt abzüglich dessen, was wir uns infolge des
          Unterbleibens erspart oder durch anderweitige Verwendung erworben oder zu erwerben absichtlich versäumt haben.
          Gegenüber Unternehmern gilt zusätzlich Punkt 19.8.
        </K>
        <K n="16.3">
          Gesetzliche Rücktrittsrechte von Verbrauchern (insbesondere nach FAGG sowie §§ 3 und 3a KSchG) bleiben unberührt.
        </K>
      </Abschnitt>

      <Abschnitt id="referenzen" titel="17. Datenschutz und Referenzen">
        <K n="17.1">
          Wir verarbeiten personenbezogene Daten zur Vertragsabwicklung nach Maßgabe unserer{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </K>
        <K n="17.2">
          Gegenüber Unternehmern dürfen wir die errichtete Anlage (ohne erkennbare Personen und ohne vertrauliche
          Betriebsdaten) fotografieren und das Projekt unter Nennung von Firma, Ort, Anlagengröße und Anlagentyp als Referenz
          veröffentlichen, sofern der Kunde nicht widerspricht; die Verwendung von Logos und Marken des Kunden bedarf seiner
          Zustimmung. Anlagen von Verbrauchern veröffentlichen wir nur mit deren ausdrücklicher Zustimmung.
        </K>
      </Abschnitt>

      <Abschnitt id="schluss" titel="18. Anwendbares Recht, Gerichtsstand, Schlussbestimmungen">
        <K n="18.1">
          Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG) und der Verweisungsnormen des
          internationalen Privatrechts. Gegenüber Verbrauchern mit gewöhnlichem Aufenthalt in einem anderen Staat bleibt der
          Schutz zwingender Bestimmungen des Aufenthaltsstaats unberührt.
        </K>
        <K n="18.2">
          Der Gerichtsstand gegenüber Unternehmern richtet sich nach Punkt 19.9, gegenüber Verbrauchern nach Punkt 20.8.
        </K>
        <K n="18.3">
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          Gegenüber Unternehmern tritt an die Stelle der unwirksamen Bestimmung eine wirksame Regelung, die dem
          wirtschaftlichen Zweck am nächsten kommt.
        </K>
        <K n="18.4">
          Änderungen dieser AGB gelten nur für Verträge, die nach ihrer Veröffentlichung abgeschlossen werden.
        </K>
      </Abschnitt>

      {/* ------------------------------------------------------------------ */}
      <h2>Teil B – Ergänzende Bestimmungen für Unternehmer</h2>

      <Abschnitt id="b2b" titel="19. Bestimmungen für Unternehmer und öffentliche Auftraggeber">
        <K n="19.1">
          <strong>ÖNORM B 2110.</strong> Für Bauleistungen – insbesondere Montage-, Installations- und Elektroarbeiten an
          Bauwerken und Freiflächenanlagen – gilt ergänzend die ÖNORM B 2110 „Allgemeine Vertragsbestimmungen für
          Bauleistungen – Werkvertragsnorm“ in der bei Vertragsabschluss geltenden Fassung (derzeit Ausgabe 2023-05-01),
          soweit Angebot, Auftragsbestätigung, individuelle Vereinbarungen und diese AGB nichts Abweichendes regeln. Bei
          Widersprüchen gehen diese AGB der ÖNORM B 2110 vor. Die Norm ist bei Austrian Standards erhältlich (
          <a href="https://www.austrian-standards.at" {...extern}>
            austrian-standards.at
            <NeuerTab />
          </a>
          ); auf Wunsch gewähren wir Einsicht. Für reine Warenlieferungen ohne Montage gilt die ÖNORM B 2110 nicht.
        </K>
        <K n="19.2">
          <strong>Untersuchungs- und Rügepflicht.</strong> Es gilt § 377 UGB. Offensichtliche Mängel sind binnen sieben
          Tagen nach Lieferung bzw. Übernahme, versteckte Mängel binnen sieben Tagen nach ihrer Entdeckung schriftlich und
          unter genauer Beschreibung zu rügen. Unterbleibt die rechtzeitige Rüge, können Ansprüche auf Gewährleistung,
          Schadenersatz wegen des Mangels selbst und aus Irrtum über die Mangelfreiheit nicht mehr geltend gemacht werden.
        </K>
        <K n="19.3">
          <strong>Gewährleistung.</strong> Die Gewährleistungsfrist beträgt zwölf Monate ab Übergabe bzw. Übernahme, bei
          Arbeiten an unbeweglichen Sachen 24 Monate. Die Vermutung der Mangelhaftigkeit nach § 924 ABGB ist ausgeschlossen;
          der Kunde hat nachzuweisen, dass der Mangel bei Übergabe bereits vorhanden war. Wir können nach unserer Wahl
          verbessern oder austauschen; Preisminderung oder Wandlung kann der Kunde erst verlangen, wenn Verbesserung und
          Austausch fehlgeschlagen, unmöglich oder für uns mit unverhältnismäßigem Aufwand verbunden sind. Der
          Rückgriffsanspruch nach § 933b ABGB bleibt unberührt.
        </K>
        <K n="19.4">
          <strong>Haftungsbeschränkung.</strong> Bei grober Fahrlässigkeit ist unsere Haftung – außer bei Personenschäden –
          der Höhe nach mit dem Netto-Auftragswert des betroffenen Vertrags begrenzt, höchstens jedoch mit der
          Versicherungssumme unserer Betriebshaftpflichtversicherung. Die Haftung für entgangenen Gewinn, Ertrags- und
          Produktionsausfall, Einspeiseverluste, mittelbare Schäden und Folgeschäden sowie für Datenverluste ist
          ausgeschlossen, soweit sie nicht auf Vorsatz beruht. Schadenersatzansprüche sind bei sonstigem Verfall binnen
          sechs Monaten ab Kenntnis von Schaden und Schädiger gerichtlich geltend zu machen.
        </K>
        <K n="19.5">
          <strong>Verzug.</strong> Bei Zahlungsverzug schuldet der Kunde Verzugszinsen nach § 456 UGB (9,2 Prozentpunkte
          über dem Basiszinssatz) sowie den Pauschalbetrag von 40 € nach § 458 UGB zuzüglich weiterer notwendiger
          Betreibungskosten.
        </K>
        <K n="19.6">
          <strong>Aufrechnung und Zurückbehaltung.</strong> Der Kunde darf nur mit Forderungen aufrechnen, die von uns
          anerkannt oder gerichtlich festgestellt sind. Wegen behaupteter Mängel darf er nur einen angemessenen, dem
          voraussichtlichen Behebungsaufwand entsprechenden Teil des Entgelts zurückbehalten.
        </K>
        <K n="19.7">
          <strong>Sicherstellung und Eigentumsvorbehalt.</strong> Unser Recht, bei Bauwerkverträgen eine Sicherstellung nach
          § 1170b ABGB zu verlangen, bleibt unberührt; es gilt nicht gegenüber juristischen Personen des öffentlichen Rechts.
          Veräußert der Kunde Vorbehaltsware im ordentlichen Geschäftsgang weiter, tritt er uns bereits jetzt die daraus
          entstehenden Forderungen bis zur Höhe unserer offenen Forderung ab und vermerkt dies in seinen Büchern.
        </K>
        <K n="19.8">
          <strong>Übernahme und Stornierung.</strong> Die Leistung gilt als übernommen, wenn der Kunde nach
          Fertigstellungsanzeige nicht binnen 14 Tagen an einer Übernahmebegehung mitwirkt oder die Anlage in Gebrauch nimmt
          (z. B. durch Einspeisung oder Eigenverbrauch), sofern wir auf diese Folge in der Fertigstellungsanzeige hingewiesen
          haben. Tritt der Kunde ohne rechtfertigenden Grund vom Vertrag zurück, können wir statt der Abrechnung nach § 1168
          ABGB eine pauschale Entschädigung von 20 % des Netto-Auftragswerts verlangen; der Nachweis eines höheren oder
          geringeren Schadens bleibt beiden Seiten vorbehalten.
        </K>
        <K n="19.9">
          <strong>Erfüllungsort und Gerichtsstand.</strong> Erfüllungsort für Zahlungen ist {FIRMA.ort}, für Montage- und
          Serviceleistungen der Standort der Anlage. Für alle Streitigkeiten aus oder im Zusammenhang mit dem Vertrag ist
          ausschließlich das für Ried im Innkreis sachlich zuständige Gericht zuständig. Wir sind berechtigt, den Kunden
          auch an seinem allgemeinen Gerichtsstand zu klagen. Gegenüber Unternehmern gelten Formvorbehalte: Änderungen und
          Ergänzungen des Vertrags bedürfen der Schriftform; E-Mail genügt.
        </K>
      </Abschnitt>

      {/* ------------------------------------------------------------------ */}
      <h2>Teil C – Ergänzende Bestimmungen für Verbraucher</h2>

      <Abschnitt id="verbraucher" titel="20. Bestimmungen für Verbraucher">
        <K n="20.1">
          Die Bestimmungen dieses Teils gehen den Teilen A und B vor. Die ÖNORM B 2110 und die Regelungen des Teils B werden
          mit Verbrauchern nicht vereinbart.
        </K>
        <K n="20.2">
          <strong>Kostenvoranschlag.</strong> Wird dem Vertrag ein Kostenvoranschlag zugrunde gelegt, so gilt dessen
          Richtigkeit als gewährleistet, wenn nicht das Gegenteil ausdrücklich erklärt ist (§ 5 Abs 2 KSchG). Ist er
          unverbindlich und zeigt sich eine beträchtliche Überschreitung als unvermeidlich, zeigen wir dies unverzüglich an
          (§ 1170a Abs 2 ABGB).
        </K>
        <K n="20.3">
          <strong>Preise.</strong> Die vereinbarten Preise sind Fixpreise. Eine nachträgliche Erhöhung für Leistungen, die
          innerhalb von zwei Monaten nach Vertragsabschluss zu erbringen sind, ist nur zulässig, wenn sie im Einzelnen
          ausgehandelt wurde (§ 6 Abs 2 Z 4 KSchG).
        </K>
        <K n="20.4">
          <strong>Gewährleistung.</strong> Es gelten die gesetzlichen Bestimmungen des Verbrauchergewährleistungsgesetzes
          (VGG) und des ABGB. Die Gewährleistungsfrist beträgt zwei Jahre ab Übergabe, bei unbeweglichen Sachen – etwa wenn
          die Anlage unselbständiger Bestandteil eines Gebäudes wird – drei Jahre. Tritt ein Mangel innerhalb eines Jahres
          nach Übergabe hervor, wird vermutet, dass er bereits bei Übergabe vorhanden war. Ansprüche können noch drei Monate
          nach Ablauf der Frist gerichtlich geltend gemacht werden. Sie können zunächst Verbesserung oder Austausch
          verlangen, unter den gesetzlichen Voraussetzungen Preisminderung oder Vertragsauflösung. Eine Rügepflicht besteht
          nicht.
        </K>
        <K n="20.5">
          <strong>Aufrechnung und Zurückbehaltung.</strong> Sie können mit Gegenforderungen aufrechnen, die mit Ihrer
          Verbindlichkeit rechtlich zusammenhängen, die gerichtlich festgestellt oder von uns anerkannt sind, sowie im Fall
          unserer Zahlungsunfähigkeit (§ 6 Abs 1 Z 8 KSchG). Ihr gesetzliches Zurückbehaltungsrecht bei mangelhafter
          Leistung bleibt unberührt.
        </K>
        <K n="20.6">
          <strong>Rücktritt nach § 3a KSchG.</strong> Sind maßgebliche Umstände, die wir bei den Vertragsverhandlungen als
          wahrscheinlich dargestellt haben – etwa die Aussicht auf eine öffentliche Förderung, auf steuerliche Vorteile oder
          auf einen Kredit –, ohne Ihre Veranlassung nicht oder nur in erheblich geringerem Ausmaß eingetreten, können Sie
          nach Maßgabe des § 3a KSchG binnen einer Woche vom Vertrag zurücktreten. Unabhängig davon gilt Punkt 21 für Fern-
          und Auswärtsgeschäfte sowie § 3 KSchG, wenn Sie Ihre Vertragserklärung außerhalb unserer Geschäftsräume abgegeben
          haben und das FAGG nicht anwendbar ist.
        </K>
        <K n="20.7">
          <strong>Wartungsverträge.</strong> Wartungsverträge auf unbestimmte oder mehr als einjährige Dauer können Sie
          unbeschadet Punkt 14.2 unter Einhaltung einer zweimonatigen Frist zum Ablauf des ersten Jahres, danach zum Ablauf
          jeweils eines halben Jahres kündigen (§ 15 KSchG).
        </K>
        <K n="20.8">
          <strong>Gerichtsstand.</strong> Haben Sie im Inland Ihren Wohnsitz, gewöhnlichen Aufenthalt oder Ort der
          Beschäftigung, können Sie nur bei dem Gericht geklagt werden, in dessen Sprengel einer dieser Orte liegt (§ 14
          KSchG).
        </K>
        <K n="20.9">
          <strong>Form.</strong> Für Ihre Erklärungen an uns genügt jede Form; Formvorbehalte dieser AGB gelten Ihnen
          gegenüber nicht (§ 10 Abs 3 KSchG). Ihr Schweigen gilt nicht als Zustimmung, es sei denn, wir haben Sie im
          Einzelfall ausdrücklich auf diese Bedeutung hingewiesen und Ihnen eine angemessene Frist zur Erklärung gesetzt (§ 6
          Abs 1 Z 2 KSchG).
        </K>
      </Abschnitt>

      <Abschnitt id="widerruf" titel="21. Rücktrittsrecht bei Fern- und Auswärtsgeschäften (FAGG)">
        <p className="mt-3">
          Haben Sie als Verbraucher den Vertrag ausschließlich über Fernkommunikationsmittel (z. B. Online, E-Mail, Telefon)
          oder außerhalb unserer Geschäftsräume (z. B. bei Ihnen vor Ort) geschlossen, gilt folgende Belehrung:
        </p>
        <div className="mt-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
          <p>
            <strong>Rücktrittsrecht</strong>
          </p>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
            Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses (bei Dienstleistungs- und
            Werkverträgen ohne Warenlieferung) bzw. ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der
            Beförderer ist, die Waren in Besitz genommen haben bzw. hat (bei Verträgen über die Lieferung von Waren, auch
            wenn diese montiert werden; bei Teillieferungen ab Erhalt der letzten Ware).
          </p>
          <p>
            Um Ihr Rücktrittsrecht auszuüben, müssen Sie uns ({FIRMA.name}, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort},
            Telefon {FIRMA.telefon}, E-Mail {FIRMA.email}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post
            versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
            dafür das Muster-Rücktrittsformular unter Punkt 22 verwenden, das jedoch nicht vorgeschrieben ist. Zur Wahrung
            der Rücktrittsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Rücktrittsrechts vor Ablauf der
            Rücktrittsfrist absenden.
          </p>
          <p>
            <strong>Folgen des Rücktritts</strong>
          </p>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
            einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine
            andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich
            und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Rücktritt bei
            uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
            Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
            werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Bei Warenlieferungen können wir die Rückzahlung
            verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die
            Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.
          </p>
          <p>
            Bereits gelieferte Waren (z. B. Module, Wechselrichter, Speicher), die üblicherweise nicht per Post zurückgesandt
            werden können, holen wir nach Terminvereinbarung bei Ihnen ab; die Kosten der Abholung tragen wir. Sie müssen für
            einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der
            Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
          </p>
          <p>
            Haben Sie verlangt, dass die Dienstleistungen (z. B. Planung, Montage, Wartung) während der Rücktrittsfrist
            beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt,
            zu dem Sie uns von der Ausübung des Rücktrittsrechts hinsichtlich dieses Vertrags unterrichten, bereits
            erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen
            entspricht.
          </p>
          <p>
            <strong>Ausnahmen</strong>
          </p>
          <p>
            Das Rücktrittsrecht besteht nach § 18 FAGG unter anderem nicht bei Dienstleistungen, die auf Ihr ausdrückliches
            Verlangen vor Ablauf der Rücktrittsfrist vollständig erbracht wurden, nachdem Sie Ihre Kenntnis vom Verlust des
            Rücktrittsrechts bestätigt haben; bei Waren, die nach Ihren Spezifikationen angefertigt oder eindeutig auf Ihre
            persönlichen Bedürfnisse zugeschnitten sind; sowie bei dringenden Reparatur- oder Instandhaltungsarbeiten, zu
            denen Sie uns ausdrücklich aufgefordert haben.
          </p>
        </div>
      </Abschnitt>

      <Abschnitt id="formular" titel="22. Muster-Rücktrittsformular">
        <p className="mt-3">
          (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
        </p>
        <div className="mt-4 rounded-2xl border border-dashed border-ink-300 p-5 md:p-6">
          <p>
            An {FIRMA.name}, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}, {FIRMA.land}, E-Mail: {FIRMA.email}:
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden
            Waren (*)/die Erbringung der folgenden Dienstleistung (*)
          </p>
          <p>– Bestellt am (*)/erhalten am (*)</p>
          <p>– Name des/der Verbraucher(s)</p>
          <p>– Anschrift des/der Verbraucher(s)</p>
          <p>– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
          <p>– Datum</p>
          <p className="text-[14px] text-ink-500">(*) Unzutreffendes streichen.</p>
        </div>
      </Abschnitt>

      <p className="mt-10 text-[14px] text-ink-500">
        {FIRMA.name} · {FIRMA.strasse} · {FIRMA.plz} {FIRMA.ort} · {FIRMA.firmenbuch}, {FIRMA.firmenbuchgericht} · UID{" "}
        {FIRMA.uid} · Stand: {AGB_STAND}
      </p>
    </div>
  );
};

export default AGComponent;
