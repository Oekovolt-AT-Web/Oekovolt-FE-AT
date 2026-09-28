import Link from "next/link";
import LegalShell from "@/components/Reusable/LegalShell";
import { BASE_URL, FIRMA, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/barrierefreiheit`;
const TITEL = "Erklärung zur Barrierefreiheit | Ökovolt";
const BESCHREIBUNG =
  "Barrierefreiheit von www.oekovolt.com nach dem Barrierefreiheitsgesetz (BaFG): Standards EN 301 549 und WCAG, bekannte Einschränkungen, Kontakt und Beschwerde.";

const SMS_BAFG =
  "https://www.sozialministeriumservice.gv.at/Marktueberwachung_digitale_Barrierefreiheit/Allgemeine_Informationen_zum_Barrierefreiheitsgesetz/Allgemeine-Informationen-zum-Barrierefreiheitsgesetz.de.html";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: LOCALE,
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

/** Datum der Erstellung bzw. letzten Überprüfung dieser Erklärung */
const STAND = "29. September 2026";

const extern = { target: "_blank", rel: "noopener noreferrer" };
const NeuerTab = () => <span className="sr-only"> (öffnet in neuem Tab)</span>;

export default function BarrierefreiheitPage() {
  const zeiten = FIRMA.oeffnungszeiten.map((o) => `${o.tage} ${o.zeit} Uhr`).join(", ");
  return (
    <LegalShell
      titel="Erklärung zur Barrierefreiheit"
      pfad="/barrierefreiheit"
      lead="Wir möchten, dass alle Menschen unsere Website und unsere Online-Dienste ohne Hürden nutzen können – unabhängig von Einschränkungen, Endgerät oder Hilfsmitteln."
    >
      <>
        <h2>Geltungsbereich</h2>
        <p>
          Diese Erklärung gilt für die Website <strong>www.oekovolt.com</strong> der {FIRMA.name} einschließlich der dort
          angebotenen Online-Dienste:
        </p>
        <ul className="space-y-1.5">
          <li>Angebots-Konfigurator (Anfrage einer Photovoltaik-Ersteinschätzung)</li>
          <li>Rechner und Werkzeuge (u. a. Solarrechner, Standort-Check, Stromspeicher- und Finanzierungsrechner, Förder-Check)</li>
          <li>Rückruf-Service und Online-Terminbuchung</li>
          <li>Kontaktformular, Partner-Registrierung, Sponsoring-Anfrage, Einreichung zum PV Award und Kurzbewerbung</li>
        </ul>
      </>

      <>
        <h2>Rechtsgrundlage und angewandte Standards</h2>
        <p>
          Seit 28. Juni 2025 gilt in Österreich das <strong>Barrierefreiheitsgesetz (BaFG)</strong>, mit dem die Richtlinie (EU)
          2019/882 (European Accessibility Act) umgesetzt wurde. Es verpflichtet unter anderem Anbieter von Dienstleistungen im
          elektronischen Geschäftsverkehr gegenüber Verbraucherinnen und Verbrauchern zur Barrierefreiheit. Unabhängig davon,
          in welchem Umfang einzelne Funktionen unserer Website in den Anwendungsbereich des BaFG fallen, richten wir die
          gesamte Website an seinen Anforderungen aus.
        </p>
        <p>
          Technisch orientieren wir uns an der harmonisierten europäischen Norm <strong>EN 301 549 V3.2.1</strong> und den
          darin in Bezug genommenen <strong>Web Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA</strong>.
          Darüber hinaus ist unser Ziel die Konformität mit den <strong>WCAG 2.2, Stufe AA</strong>.
        </p>
      </>

      <>
        <h2>So ist unser Angebot barrierefrei nutzbar</h2>
        <ul className="space-y-1.5">
          <li>
            <strong>Bedienung per Tastatur:</strong> Alle Menüs, Formulare, Rechner und Dialoge lassen sich ohne Maus bedienen.
            Ein Sprunglink führt direkt zum Hauptinhalt, der Tastaturfokus ist deutlich sichtbar. Dialoge (Menü, Rückruf,
            Cookie-Einstellungen) halten den Fokus, lassen sich mit der Escape-Taste schließen und geben den Fokus an den
            Auslöser zurück.
          </li>
          <li>
            <strong>Screenreader:</strong> Seiten sind mit Überschriften, Landmarken und Listen gegliedert. Bedienelemente,
            Formularfelder, Pflichtfelder und Fehlermeldungen sind programmatisch beschriftet; Statusmeldungen werden angesagt.
            Tabellen haben Beschriftungen und Kopfzellen, Diagramme eine textliche bzw. tabellarische Alternative.
          </li>
          <li>
            <strong>Kontraste und Farbe:</strong> Texte und Bedienelemente erfüllen die geforderten Mindestkontraste.
            Informationen werden nicht allein über Farbe vermittelt.
          </li>
          <li>
            <strong>Bewegung:</strong> Die Einstellung „Bewegung reduzieren“ Ihres Betriebssystems wird berücksichtigt –
            Animationen und Hintergrundvideos entfallen dann. Hintergrundvideo und Logo-Laufband lassen sich außerdem jederzeit
            anhalten.
          </li>
          <li>
            <strong>Zoom und Darstellung:</strong> Die Inhalte lassen sich bis 400 % vergrößern und passen sich ohne
            horizontales Scrollen an schmale Bildschirme an (breite Tabellen scrollen innerhalb ihres Rahmens).
          </li>
          <li>
            <strong>Keine Zeitbegrenzungen:</strong> Formulare und Terminbuchung haben keine Zeitlimits; Eingaben gehen beim
            Wechsel zwischen den Schritten nicht verloren. Ausnahme ist der QR-Code für Unterlagen per Smartphone, der aus
            Sicherheitsgründen nach 45 Minuten abläuft und jederzeit neu erzeugt werden kann.
          </li>
          <li>
            <strong>Sprache:</strong> Die Seiten sind als deutschsprachig ausgezeichnet, damit Vorleseprogramme die richtige
            Aussprache verwenden.
          </li>
        </ul>
      </>

      <>
        <h2>Stand der Vereinbarkeit</h2>
        <p>
          Die Website ist mit den oben genannten Anforderungen <strong>teilweise vereinbar</strong>. Die folgenden Inhalte bzw.
          Funktionen sind aus den genannten Gründen noch nicht vollständig barrierefrei.
        </p>

        <h3>Bekannte Einschränkungen</h3>
        <ul className="space-y-1.5">
          <li>
            <strong>Eingebettete Google-Maps-Karte</strong> (Kontaktseite): Die Karte eines Drittanbieters ist nicht
            vollständig per Tastatur und Screenreader bedienbar. <em>Alternative:</em> Unsere Anschrift steht als Text auf der
            Kontaktseite, im Fußbereich jeder Seite und in dieser Erklärung.
          </li>
          <li>
            <strong>Interaktive Karten</strong> (Referenzkarte, Förderkarte der Bundesländer, Standort-Check): Die grafische
            Karte selbst ist nur eingeschränkt für Screenreader erschlossen. <em>Alternative:</em> Die Inhalte stehen zusätzlich
            als Liste, Auswahl bzw. Adresseingabe neben der Karte bereit.
          </li>
          <li>
            <strong>Inhalte und Dienste Dritter</strong> (z. B. Energiemarktdaten, verlinkte Profile in sozialen Netzwerken,
            Telefonie-Dienstleister, das externe Hinweisgeberportal, eHORA): Auf deren Barrierefreiheit haben wir nur
            begrenzt Einfluss.
          </li>
          <li>
            <strong>PDF-Dokumente und Bilder aus dem Redaktionssystem</strong> (z. B. Datenblätter, Stellenanzeigen,
            Referenzfotos): Ältere Dokumente sind teilweise nicht barrierefrei getaggt; einzelne Bilder haben noch keine
            aussagekräftige Textalternative. Wir überarbeiten diese Inhalte schrittweise. <em>Alternative:</em> Auf Anfrage
            senden wir Ihnen die Informationen in einem für Sie zugänglichen Format.
          </li>
          <li>
            <strong>Diagramme mit Mausinteraktion</strong> (Börsenstrompreis, Stromerzeugung, Rechner-Verläufe): Einzelwerte
            sind per Tastatur abrufbar; die vollständigen Daten stehen zusätzlich als Tabelle bzw. Text zur Verfügung.
          </li>
          <li>
            <strong>Neue und überarbeitete Seiten</strong> der österreichischen Website werden laufend ergänzt; vereinzelt
            können Kontrast- oder Strukturmängel auftreten, bis die Prüfung der jeweiligen Seite abgeschlossen ist.
          </li>
          <li>
            <strong>Leichte Sprache und Gebärdensprache:</strong> Informationen in Leichter Sprache oder in Österreichischer
            Gebärdensprache (ÖGS) bieten wir derzeit nicht an.
          </li>
        </ul>

        <h3>Alternative Zugangswege</h3>
        <p>
          Alle Leistungen, die Sie online anfragen können, erreichen Sie auch persönlich: telefonisch unter{" "}
          <a href={FIRMA.telefonHref}>{FIRMA.telefon}</a> ({zeiten}) oder per E-Mail an{" "}
          <a href={`mailto:${FIRMA.email}`}>{FIRMA.email}</a>. Wir beraten Sie gerne auch vor Ort.
        </p>
      </>

      <>
        <h2>Erstellung dieser Erklärung</h2>
        <p>
          Diese Erklärung wurde am <strong>{STAND}</strong> erstellt. Grundlage ist eine Selbstbewertung des gemeinsamen
          Designsystems und der wichtigsten Seiten: automatisierte Prüfungen mit axe-core (WCAG 2.1 A/AA) in Desktop- und
          Smartphone-Breite sowie manuelle Tests der Tastaturbedienung, Fokusführung, Kontraste, Vergrößerung und reduzierten
          Bewegung. Die zusätzlichen Erfolgskriterien der WCAG 2.2 (u. a. nicht verdeckter Fokus, Mindestgröße von
          Zielbereichen, barrierefreie Authentifizierung) prüfen wir im Rahmen der laufenden Überarbeitung. Die Erklärung
          wird bei wesentlichen Änderungen der Website, mindestens jedoch jährlich, überprüft.
        </p>
      </>

      <>
        <h2>Feedback und Kontakt</h2>
        <p>
          Sind Ihnen Barrieren aufgefallen oder benötigen Sie Informationen in einer anderen Form? Bitte schreiben Sie uns –
          wir antworten so rasch wie möglich und suchen gemeinsam mit Ihnen eine Lösung.
        </p>
        <address className="mt-4 not-italic">
          <strong>{FIRMA.name}</strong>
          <br />
          Stichwort „Barrierefreiheit“
          <br />
          {FIRMA.strasse}
          <br />
          {FIRMA.plz} {FIRMA.ort}
          <br />
          Telefon: <a href={FIRMA.telefonHref}>{FIRMA.telefon}</a>
          <br />
          E-Mail: <a href={`mailto:${FIRMA.email}?subject=Barrierefreiheit`}>{FIRMA.email}</a>
        </address>
        <p className="mt-4">
          Alternativ erreichen Sie uns über unser <Link href="/kontakt">Kontaktformular</Link>.
        </p>
      </>

      <>
        <h2>Beschwerde bei der Marktüberwachungsbehörde</h2>
        <p>
          Wenn Sie der Meinung sind, dass unser Angebot die Anforderungen an die Barrierefreiheit nicht erfüllt, und wir Ihr
          Anliegen nicht zufriedenstellend lösen konnten, können Sie sich an die Marktüberwachungsbehörde nach dem BaFG
          wenden:
        </p>
        <address className="mt-4 not-italic">
          <strong>Sozialministeriumservice – Landesstelle Oberösterreich</strong>
          <br />
          Marktüberwachung Digitale Barrierefreiheit
          <br />
          Gruberstraße 63, 4021 Linz
          <br />
          E-Mail:{" "}
          <a href="mailto:marktueberwachung-bafg@sozialministeriumservice.gv.at">
            marktueberwachung-bafg@sozialministeriumservice.gv.at
          </a>
          <br />
          <a href={SMS_BAFG} {...extern}>
            Informationen und Meldeformular zum Barrierefreiheitsgesetz
            <NeuerTab />
          </a>
        </address>
      </>

      <>
        <h2>Schlichtung</h2>
        <p>
          Menschen mit Behinderungen, die sich wegen einer Barriere diskriminiert fühlen, können Ansprüche nach dem
          Bundes-Behindertengleichstellungsgesetz (BGStG) geltend machen. Vor einer Klage bei Gericht ist ein kostenloses
          Schlichtungsverfahren beim Sozialministeriumservice durchzuführen; zuständig ist die Landesstelle in Ihrem
          Bundesland. Beratung und Unterstützung bietet auch die{" "}
          <a href="https://www.behindertenanwalt.gv.at" {...extern}>
            Behindertenanwaltschaft
            <NeuerTab />
          </a>
          . Weitere Informationen finden Sie unter{" "}
          <a href="https://www.sozialministeriumservice.gv.at" {...extern}>
            www.sozialministeriumservice.gv.at
            <NeuerTab />
          </a>
          .
        </p>
      </>
    </LegalShell>
  );
}
