import Link from "next/link";
import { FIRMA, SCHWESTER, BASE_URL } from "@/lib/site";

// Rechtsgrundlagen im Rechtsinformationssystem des Bundes (RIS)
const RIS_GEWO = "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517";
const RIS = "https://www.ris.bka.gv.at";

/**
 * Mittelbare Beteiligungen (§ 25 Abs 2 MedienG) über die Gesellschafterin Salzburg AG.
 * Quelle: Offenlegung der Salzburg AG, https://www.salzburg-ag.at/servicemenue/impressum.html
 * (abgerufen 09/2026). Bei Änderungen dort bitte hier nachziehen.
 */
const MITTELBAR_SALZBURG_AG = [
  { name: "Land Salzburg", anteil: "42,56 %" },
  { name: "Stadt Salzburg", anteil: "31,31 %" },
  {
    name: "Energie AG Oberösterreich Service- und Beteiligungsverwaltungs-GmbH (Tochtergesellschaft der Energie AG Oberösterreich)",
    anteil: "26,13 %",
  },
];

const extern = { target: "_blank", rel: "noopener noreferrer" };
const NeuerTab = () => <span className="sr-only"> (öffnet in neuem Tab)</span>;

function Zeile({ label, children }) {
  return (
    <div className="grid gap-1 border-b border-ink-100 py-3 sm:grid-cols-[220px_1fr] sm:gap-6">
      <dt className="text-[14.5px] font-semibold text-ink-900">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

const Impressum = () => {
  return (
    <div>
      <section>
        <h2>Medieninhaberin und Diensteanbieterin</h2>
        <p>
          Informationen und Offenlegung gemäß § 5 E-Commerce-Gesetz (ECG), § 14 Unternehmensgesetzbuch (UGB), § 63
          Gewerbeordnung 1994 (GewO) und § 25 Mediengesetz (MedienG) für die Website{" "}
          <strong>{BASE_URL.replace("https://", "")}</strong>:
        </p>
        <address className="mt-4 not-italic">
          <strong>{FIRMA.name}</strong>
          <br />
          {FIRMA.strasse}
          <br />
          {FIRMA.plz} {FIRMA.ort}
          <br />
          {FIRMA.land}
        </address>

        <dl className="mt-6 border-t border-ink-100">
          <Zeile label="Rechtsform">{FIRMA.rechtsform}</Zeile>
          <Zeile label="Sitz">
            Politische Gemeinde {FIRMA.ort}, {FIRMA.bundesland}
          </Zeile>
          <Zeile label="Telefon">
            <a href={FIRMA.telefonHref}>{FIRMA.telefon}</a>
          </Zeile>
          <Zeile label="E-Mail">
            <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>
          </Zeile>
          <Zeile label="Online-Kontakt">
            <Link href="/kontakt">Kontaktformular</Link>
          </Zeile>
          <Zeile label="Geschäftsführer">{FIRMA.geschaeftsfuehrer}</Zeile>
          <Zeile label="Firmenbuchnummer">{FIRMA.firmenbuch}</Zeile>
          <Zeile label="Firmenbuchgericht">{FIRMA.firmenbuchgericht}</Zeile>
          <Zeile label="EUID">{FIRMA.euid}</Zeile>
          <Zeile label="UID-Nummer">{FIRMA.uid}</Zeile>
          <Zeile label="GISA-Zahl">{FIRMA.gisa}</Zeile>
          <Zeile label="Stammkapital">{FIRMA.stammkapital}</Zeile>
        </dl>
      </section>

      <section>
        <h2>Unternehmensgegenstand</h2>
        <p>
          Planung, Lieferung, Errichtung, Inbetriebnahme, Wartung und Service von Photovoltaikanlagen, Stromspeichern,
          Ladeinfrastruktur und sonstigen elektrotechnischen Anlagen sowie die damit verbundene Beratung,
          Projektentwicklung, Energiedienstleistung und Vermittlung.
        </p>
      </section>

      <section>
        <h2>Gewerberecht und Aufsicht</h2>
        <dl className="border-t border-ink-100">
          <Zeile label="Gewerbe">
            {FIRMA.gewerbe}, eingetragen im Gewerbeinformationssystem Austria (GISA-Zahl {FIRMA.gisa})
          </Zeile>
          <Zeile label="Gewerbebehörde">{FIRMA.behoerde}</Zeile>
          <Zeile label="Kammerzugehörigkeit">
            Mitglied der {FIRMA.kammer}, {FIRMA.innung}
          </Zeile>
          <Zeile label="Berufsrecht">
            Gewerbeordnung 1994 (GewO), abrufbar im{" "}
            <a href={RIS_GEWO} {...extern}>
              Rechtsinformationssystem des Bundes (RIS)
              <NeuerTab />
            </a>
            ; für elektrotechnische Arbeiten zusätzlich das Elektrotechnikgesetz 1992 (ETG 1992) und die
            Elektrotechnikverordnung (ETV) mit den darin verbindlich erklärten elektrotechnischen Sicherheitsvorschriften,
            ebenfalls unter{" "}
            <a href={RIS} {...extern}>
              www.ris.bka.gv.at
              <NeuerTab />
            </a>
            .
          </Zeile>
          <Zeile label="Staat der Gewerbeberechtigung">Österreich</Zeile>
        </dl>
        <p className="mt-4">
          Unseren Eintrag finden Sie auch im{" "}
          <a href={FIRMA.wko} {...extern}>
            WKO Firmen A–Z
            <NeuerTab />
          </a>{" "}
          und bei{" "}
          <a href={FIRMA.firmenabc} {...extern}>
            FirmenABC
            <NeuerTab />
          </a>
          . Das Firmenbuch wird vom {FIRMA.firmenbuchgericht} geführt; Firmenbuchauszüge erhalten Sie über die
          Firmenbuchabfrage der Justiz bzw. über zugelassene Verrechnungsstellen (
          <a href="https://www.justiz.gv.at" {...extern}>
            www.justiz.gv.at
            <NeuerTab />
          </a>
          ).
        </p>
      </section>

      <section>
        <h2>Offenlegung gemäß § 25 Mediengesetz</h2>
        <p>
          Diese Website enthält über die Präsentation unseres Unternehmens hinaus fachliche Beiträge (u. a. Ratgeber,
          Lexikon, Presse). Wir machen daher die vollständigen Angaben nach § 25 Abs 2 bis 4 MedienG.
        </p>

        <h3>Medieninhaberin</h3>
        <p>
          {FIRMA.name}, Sitz in {FIRMA.ort} ({FIRMA.bundesland}); Unternehmensgegenstand siehe oben.
        </p>

        <h3>Geschäftsführung</h3>
        <p>{FIRMA.geschaeftsfuehrer}</p>

        <h3>Beteiligungsverhältnisse</h3>
        <p>Unmittelbar beteiligt sind (Anteile am Stammkapital):</p>
        <ul className="mt-2 space-y-1">
          {FIRMA.gesellschafter.map((g) => (
            <li key={g.name}>
              {g.name}: <strong>{g.anteil}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Mittelbar beteiligt sind über die Salzburg AG für Energie, Verkehr und Telekommunikation (Sitz: Salzburg) deren
          Aktionärinnen:
        </p>
        <ul className="mt-2 space-y-1">
          {MITTELBAR_SALZBURG_AG.map((g) => (
            <li key={g.name}>
              {g.name}: {g.anteil} an der Salzburg AG
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Die weiteren Beteiligungsverhältnisse der Salzburg AG und der Energie AG Oberösterreich sind in deren eigenen
          Offenlegungen veröffentlicht (
          <a href="https://www.salzburg-ag.at/servicemenue/impressum.html" {...extern}>
            salzburg-ag.at
            <NeuerTab />
          </a>
          ,{" "}
          <a href="https://www.energieag.at" {...extern}>
            energieag.at
            <NeuerTab />
          </a>
          ).
        </p>

        <h3>Grundlegende Richtung (Blattlinie)</h3>
        <p>
          Information über die Leistungen der {FIRMA.name} – Photovoltaik, Stromspeicher, Ladeinfrastruktur, Wartung und
          Service – sowie sachliche Fachinformation zu Photovoltaik, Energiewirtschaft, Förderungen und Rechtslage in
          Österreich für Unternehmen, Landwirtschaft, öffentliche Hand und private Bauherren.
        </p>
      </section>

      <section id="urheber-und-markenrechte" className="scroll-mt-28">
        <h2>Urheber- und Markenrechte</h2>
        <div className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
          <p>
            <strong>
              Sämtliche Rechte an dieser Website – insbesondere an Gestaltung und Design, Texten, Grafiken, Fotos, Videos,
              Rechnern, Software und Quellcode – sowie an der Marke ÖKOVOLT, am Unternehmenskennzeichen und an den
              zugehörigen Logos liegen bei der deutschen Schwestergesellschaft:
            </strong>
          </p>
          <address className="mt-3 not-italic">
            <strong>{SCHWESTER.name}</strong>
            <br />
            {SCHWESTER.strasse}
            <br />
            {SCHWESTER.plz} {SCHWESTER.ort}, {SCHWESTER.land}
            <br />
            {SCHWESTER.register}
            <br />
            <a href={SCHWESTER.web} {...extern}>
              {SCHWESTER.web.replace("https://", "")}
              <NeuerTab />
            </a>
          </address>
          <p className="mt-3">
            Die {SCHWESTER.name} ist Inhaberin dieser Urheber- und Nutzungsrechte sowie Markenrechtsinhaberin der Marke
            ÖKOVOLT. Die {FIRMA.name} nutzt diese Rechte in Österreich mit deren Zustimmung.
          </p>
        </div>
        <p className="mt-4">
          Die Inhalte dieser Website sind nach dem Urheberrechtsgesetz (UrhG) und dem Markenschutzgesetz (MSchG) sowie den
          entsprechenden unionsrechtlichen Bestimmungen geschützt. Jede Vervielfältigung, Bearbeitung, Verbreitung,
          öffentliche Zurverfügungstellung oder sonstige Verwertung außerhalb der gesetzlich erlaubten freien
          Werknutzungen – auch auszugsweise – bedarf der vorherigen schriftlichen Zustimmung der Rechteinhaberin. Der Nutzung
          der Inhalte für Text- und Data-Mining (§ 42h UrhG), etwa zum Training von KI-Modellen, wird hiermit ausdrücklich
          widersprochen (Nutzungsvorbehalt). Das Zitieren einzelner Passagen mit Quellenangabe bleibt im gesetzlichen Rahmen
          zulässig. Anfragen zur Nutzung richten Sie bitte an <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>; wir
          leiten sie an die Rechteinhaberin weiter.
        </p>
        <p>
          Soweit Inhalte nicht von der Unternehmensgruppe stammen, werden die Rechte Dritter beachtet und diese Inhalte als
          solche gekennzeichnet (siehe Bildnachweise). Sollten Sie dennoch auf eine Rechtsverletzung aufmerksam werden,
          bitten wir um einen Hinweis; wir entfernen betroffene Inhalte umgehend.
        </p>
      </section>

      <section id="bildnachweise" className="scroll-mt-28">
        <h2>Bildnachweise</h2>
        <p>
          Die Fotos von Anlagen, Montage und Team stammen überwiegend aus Projekten der Ökovolt-Unternehmensgruppe. Ergänzend
          verwenden wir Bilder aus freien Quellen, deren Lizenz die kommerzielle Nutzung erlaubt – insbesondere Pixabay,
          Unsplash und Pexels (jeweils nach deren Lizenzbedingungen) sowie Wikimedia Commons (CC0 bzw. CC BY). Wo eine
          Lizenz eine Namensnennung verlangt, nennen wir Urheberin bzw. Urheber und Lizenz direkt beim Bild oder in dieser
          Rubrik. Karten- und Geodaten stammen, soweit angegeben, von den OpenStreetMap-Mitwirkenden (ODbL) bzw. von
          basemap.at (CC BY 4.0). Produktabbildungen werden im Rahmen der Produktinformation der jeweiligen Hersteller
          verwendet.
        </p>
      </section>

      <section id="streitbeilegung" className="scroll-mt-28">
        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Die frühere EU-Plattform zur Online-Streitbeilegung (OS-Plattform) wurde mit der Aufhebung der Verordnung (EU) Nr.
          524/2013 durch die Verordnung (EU) 2024/3228 am 20. Juli 2025 eingestellt. Ein Hinweis auf diese Plattform ist
          daher nicht mehr vorgesehen.
        </p>
        <p>
          Verbraucherinnen und Verbraucher können sich bei Streitigkeiten an eine staatlich anerkannte Stelle zur
          alternativen Streitbeilegung nach dem Alternative-Streitbeilegung-Gesetz (AStG) wenden, etwa an die{" "}
          <a href="https://www.ombudsstelle.at" {...extern}>
            Internet Ombudsstelle
            <NeuerTab />
          </a>{" "}
          (für online abgeschlossene Verträge) oder an die{" "}
          <a href="https://www.verbraucherschlichtung.at" {...extern}>
            Schlichtung für Verbrauchergeschäfte
            <NeuerTab />
          </a>
          . Wir sind zur Teilnahme an einem solchen Verfahren nicht verpflichtet und haben uns auch nicht freiwillig dazu
          verpflichtet; im Einzelfall prüfen wir eine Teilnahme. Beschwerden können Sie jederzeit direkt an{" "}
          <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a> richten.
        </p>
      </section>

      <section>
        <h2>Haftung für Inhalte</h2>
        <p>
          Wir erstellen die Inhalte dieser Website mit größtmöglicher Sorgfalt und aktualisieren sie regelmäßig. Rechtliche,
          steuerliche und förderrechtliche Informationen geben den Stand zum Zeitpunkt der Veröffentlichung wieder, ersetzen
          keine Beratung im Einzelfall und können sich durch Gesetzesänderungen, Förderaufrufe oder Entscheidungen von
          Netzbetreibern und Behörden kurzfristig ändern. Ergebnisse unserer Rechner und des Standort-Checks sind
          unverbindliche Richtwerte und ersetzen keine Planung vor Ort. Für die Richtigkeit, Vollständigkeit und Aktualität
          der Inhalte übernehmen wir – außer bei Vorsatz oder grober Fahrlässigkeit – keine Haftung.
        </p>
        <p>
          Für fremde Informationen, die wir für Nutzerinnen und Nutzer speichern oder übermitteln, sind wir nach Maßgabe der
          §§ 13 bis 16 und § 18 ECG nicht verpflichtet, diese zu überwachen oder nach rechtswidrigen Tätigkeiten zu forschen.
          Sobald wir von einer konkreten Rechtsverletzung Kenntnis erlangen, entfernen wir die betreffenden Inhalte umgehend.
        </p>
      </section>

      <section>
        <h2>Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese Inhalte ist
          der jeweilige Anbieter verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf erkennbare
          Rechtsverstöße geprüft; rechtswidrige Inhalte waren nicht erkennbar. Eine laufende Kontrolle ist ohne konkrete
          Anhaltspunkte nicht zumutbar (§ 17 ECG). Werden uns Rechtsverletzungen bekannt, entfernen wir solche Links
          umgehend.
        </p>
      </section>

      <section>
        <h2>Weitere Rechtstexte</h2>
        <p>
          Für Angebote und Verträge der {FIRMA.name} gelten unsere{" "}
          <Link href="/agb">Allgemeinen Geschäftsbedingungen</Link>. Informationen zum Umgang mit personenbezogenen Daten
          finden Sie in der <Link href="/datenschutz">Datenschutzerklärung</Link>, zu unserem internen Meldekanal auf der
          Seite <Link href="/hinweisgeberschutz">Hinweisgeberschutz</Link> und zur Zugänglichkeit dieser Website in der{" "}
          <Link href="/barrierefreiheit">Erklärung zur Barrierefreiheit</Link>.
        </p>
      </section>

      <section>
        <h2>Gleichbehandlung</h2>
        <p>
          Wir verwenden nach Möglichkeit geschlechtergerechte Formulierungen. Wo aus Gründen der Lesbarkeit nur eine Form
          verwendet wird, sind alle Geschlechter gleichermaßen gemeint.
        </p>
      </section>
    </div>
  );
};

export default Impressum;
