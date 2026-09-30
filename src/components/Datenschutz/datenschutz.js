import Link from "next/link";
import { FIRMA, SCHWESTER } from "@/lib/site";
// Schalter eigenes Hinweisgebersystem ↔ IntegrityLine (Abschnitte „IP-Adresse“, „Hinweisgebersystem“, „Empfänger“,
// „Speicherdauer“). Wie bei Umami gilt der Wert zur Build-Zeit, weil /datenschutz statisch erzeugt wird – siehe
// src/data/hinweisgeber.js.
import { HINWEIS_INTERN } from "@/data/hinweisgeber";
// A/B-Tests (Abschnitt „Besucherstatistik“): laufende Tests werden zur Build-Zeit genannt.
import { EXPERIMENTE, laeuft } from "@/lib/experimente";

/**
 * Stand der Datenschutzerklärung – bei jeder inhaltlichen Änderung anpassen.
 *
 * Abgleich mit dem Code am 30.09.2026 (Befunde D7, D10, D11 in docs/projekt-doku/05-sicherheit-und-datenschutz.md,
 * Tabelle A1–A8 in docs/datenschutz/00-Uebersicht-VVT.md) – RECHTLICH PRÜFEN. Fristen und ihre Quelle im Code:
 *  - Formular-Anfragen (Kontakt, Konfigurator, PDF-Analyse, Sponsoring, Partner, Award): Anonymisierung 24 Monate ab
 *    Anlage, ausgenommen Status „Angebot erstellt“/„Gewonnen“ – oekovolt_app/website_api/helfer.py
 *    (anfragen_aufraeumen), format.py (LOESCHFRIST_MONATE, ANONYMISIEREN)
 *  - Rückruf und Termin („Website Termin“): Anonymisierung 24 Monate nach Termindatum – termin.py
 *    (loesche_alte_termine), termin_logik.py (LOESCHFRIST_MONATE)
 *  - Unterlagen per Smartphone („Solar Lead“): 12 Monate, offene Vorgänge 24 h – solar_lead/api.py (aufraeumen)
 *  - Heatmap: 14 Monate – heatmap_zelle/heatmap_logik.py (AUFBEWAHRUNG_MONATE)
 *  - Hinweisgebersystem: 5 Jahre nach Abschluss – hinweis/hinweis.py, api.py (loesche_abgelaufene_hinweise)
 * CloudTalk (src/lib/rueckrufApi.js) ist nirgends eingebunden und wird deshalb nicht genannt. Wird der Sofort-Rückruf
 * eingebaut, Abschnitt „Rückruf“ und die Empfängerliste wieder ergänzen.
 * Abschnittsnummern werden aus `inhalt` berechnet – Querverweise immer mit nr("id") schreiben, nie als feste Zahl.
 */
export const DATENSCHUTZ_STAND = "30. September 2026";

const extern = { target: "_blank", rel: "noopener noreferrer" };
const NeuerTab = () => <span className="sr-only"> (öffnet in neuem Tab)</span>;

function Ext({ href, children }) {
  return (
    <a href={href} {...extern}>
      {children}
      <NeuerTab />
    </a>
  );
}

/**
 * Umami (cookielose Reichweitenmessung) läuft nur, wenn UMAMI_SCRIPT_URL und UMAMI_WEBSITE_ID gesetzt sind
 * (siehe src/components/Statistik/Umami.js). Die Datenschutzerklärung nennt Umami nur dann.
 *
 * Diese Datei ist eine Server-Komponente (kein "use client"): Die Umgebungsvariablen werden nur auf dem Server
 * gelesen, an den Browser gelangt allein der fertige Text. /datenschutz wird statisch erzeugt – maßgeblich ist daher
 * der Wert zur Build-Zeit (wie bei Umami.js im Layout). Nach dem Setzen oder Entfernen der Variablen neu bauen.
 */
function umamiAktiv() {
  return Boolean(process.env.UMAMI_SCRIPT_URL && process.env.UMAMI_WEBSITE_ID);
}

const statistikTitel = (umami) =>
  umami
    ? "Besucherstatistik: cookielose Reichweitenmessung, Google Analytics, Heatmap und A/B-Tests"
    : "Besucherstatistik: Google Analytics, Heatmap und A/B-Tests";

const inhalt = (umami) => [
  ["verantwortlicher", "Verantwortlicher und Kontakt"],
  ["grundlagen", "Rechtsgrundlagen im Überblick"],
  ["hosting", "Hosting, Server-Logdateien und Sicherheit"],
  ["cookies", "Cookies und Einwilligungsverwaltung"],
  ["statistik", statistikTitel(umami)],
  ["karten", "Karten: Google Maps und OpenStreetMap"],
  ["anfragen", "Kontaktformular, Angebots- und Serviceanfragen"],
  ["herkunft", "Herkunft Ihrer Anfrage (Kampagnen-Zuordnung)"],
  ["ip-adresse", "Speicherung der IP-Adresse bei Anfragen"],
  ["rueckruf", "Rückruf und Online-Terminbuchung"],
  ["unterlagen", "Unterlagen per Smartphone, Texterkennung und KI-Auswertung"],
  ["analyse", "PDF-Analyse aus dem Solarrechner"],
  ["standort-check", "Standort-Check, Schneelast-Karte und PV-Prognose"],
  ["lastgang", "Lastgang-Analyse im Browser"],
  ["partner", "Registrierung als Elektro-Partner"],
  ["sponsoring", "Sponsoring-Anfragen"],
  ["pv-award", "Einreichungen zum Ökovolt PV Award"],
  ["bewerbung", "Bewerbungen"],
  ["kunden", "Kunden, Projekte, Monitoring und Fernwartung"],
  ["kundenbuehne", "Referenzprojekte und Kundenporträts"],
  ["energiedaten", "Energiemarktdaten (Energie live)"],
  ["teilen", "Teilen-Funktionen und „Mit KI zusammenfassen“"],
  ["push", "Push-Benachrichtigungen"],
  ["fediverse", "Fediverse-Konten, RSS-Feeds und Info-Bildschirme"],
  ["hinweisgeber", "Hinweisgebersystem"],
  ["empfaenger", "Empfänger, Auftragsverarbeiter und Drittländer"],
  ["speicherdauer", "Speicherdauer"],
  ["rechte", "Ihre Rechte und Beschwerde bei der Datenschutzbehörde"],
];

function Abschnitt({ id, titel, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2>{titel}</h2>
      {children}
    </section>
  );
}

const PrivacyPolicy = () => {
  const umami = umamiAktiv();
  const liste = inhalt(umami);
  /** Nummer eines Abschnitts (1-basiert) – für Überschriften und Querverweise. */
  const nr = (id) => liste.findIndex(([i]) => i === id) + 1;
  const T = (id) => `${nr(id)}. ${liste[nr(id) - 1][1]}`;
  // Unterpunkte im Abschnitt „Besucherstatistik“ lückenlos nummerieren – je nachdem, ob Umami aktiv ist
  const [buchstabeGa, buchstabeHeatmap, buchstabeAb] = umami ? ["b", "c", "d"] : ["a", "b", "c"];
  // Zum Build-Zeitpunkt laufende A/B-Tests (src/lib/experimente.js). Ein Test startet nur mit Code-Änderung und
  // neuem Build; endet er über „bis“, bleibt die Nennung bis zum nächsten Build stehen (unschädlich).
  const aktiveTests = EXPERIMENTE.filter((e) => laeuft(e));
  return (
    <div>
      <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-ov-700">Stand: {DATENSCHUTZ_STAND}</p>
      <p className="mt-3">
        Mit dieser Datenschutzerklärung informieren wir Sie nach Art. 13 und 14 der Datenschutz-Grundverordnung (DSGVO), dem
        österreichischen Datenschutzgesetz (DSG) und § 165 Telekommunikationsgesetz 2021 (TKG 2021) darüber, welche
        personenbezogenen Daten wir beim Besuch von www.oekovolt.com und bei der Nutzung unserer Online-Dienste verarbeiten,
        zu welchen Zwecken, auf welcher Rechtsgrundlage und wie lange.
      </p>

      <nav aria-label="Inhalt der Datenschutzerklärung" className="mt-8 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
        <p className="font-display text-[17px] font-bold text-ink-900">Inhalt</p>
        <ol className="mt-2 grid gap-x-8 gap-y-1 text-[15px] md:grid-cols-2">
          {liste.map(([id, titel]) => (
            <li key={id}>
              <a href={`#${id}`}>{titel}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Abschnitt id="verantwortlicher" titel={T("verantwortlicher")}>
        <p>Verantwortlicher im Sinne des Art. 4 Z 7 DSGVO ist:</p>
        <address className="mt-3 not-italic">
          <strong>{FIRMA.name}</strong>
          <br />
          {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}, {FIRMA.land}
          <br />
          Telefon: <a href={FIRMA.telefonHref}>{FIRMA.telefon}</a>
          <br />
          E-Mail: <a href={`mailto:${FIRMA.email}?subject=Datenschutz`}>{FIRMA.email}</a> (Betreff „Datenschutz“)
          <br />
          {FIRMA.firmenbuch}, {FIRMA.firmenbuchgericht}
        </address>
        <p className="mt-4">
          Anfragen zum Datenschutz und zur Ausübung Ihrer Rechte richten Sie bitte an die oben genannte Adresse. Weitere
          Angaben finden Sie im <Link href="/impressum">Impressum</Link>.
        </p>
      </Abschnitt>

      <Abschnitt id="grundlagen" titel={T("grundlagen")}>
        <ul className="space-y-1.5">
          <li>
            <strong>Einwilligung</strong> (Art. 6 Abs. 1 lit. a DSGVO) – z. B. Statistik, Karten, Push-Benachrichtigungen,
            KI-Auswertung. Für das Speichern und Auslesen von Informationen auf Ihrem Endgerät, das nicht unbedingt
            erforderlich ist, gilt zusätzlich § 165 Abs. 3 TKG 2021.
          </li>
          <li>
            <strong>Vertrag und vorvertragliche Maßnahmen</strong> (Art. 6 Abs. 1 lit. b DSGVO) – z. B. Bearbeitung Ihrer
            Anfrage, Angebot, Auftrag, Wartung.
          </li>
          <li>
            <strong>Rechtliche Verpflichtung</strong> (Art. 6 Abs. 1 lit. c DSGVO) – z. B. Aufbewahrungspflichten nach § 132
            Bundesabgabenordnung (BAO) und § 212 Unternehmensgesetzbuch (UGB), Pflichten nach dem
            HinweisgeberInnenschutzgesetz (HSchG).
          </li>
          <li>
            <strong>Berechtigte Interessen</strong> (Art. 6 Abs. 1 lit. f DSGVO) – z. B. sicherer Betrieb der Website,
            Missbrauchsschutz, Nachweis von Einwilligungen, {umami ? "cookielose Reichweitenmessung, " : ""}Auswertung unserer
            Marketingmaßnahmen, Geschäftskommunikation mit Unternehmen. Dieser Verarbeitung können Sie nach Art. 21 DSGVO widersprechen.
          </li>
        </ul>
        <p className="mt-3">
          Eine Pflicht zur Bereitstellung Ihrer Daten besteht nicht. Ohne die als Pflichtfelder gekennzeichneten Angaben
          können wir Ihre Anfrage jedoch nicht bearbeiten.
        </p>
      </Abschnitt>

      <Abschnitt id="hosting" titel={T("hosting")}>
        <p>
          Unsere Website und unser Backoffice werden auf Servern eines Hosting-Dienstleisters betrieben, den wir als
          Auftragsverarbeiter nach Art. 28 DSGVO vertraglich gebunden haben. Beim Aufruf der Website verarbeitet der Server
          automatisch technisch notwendige Daten, die Ihr Browser übermittelt:
        </p>
        <ul className="mt-2">
          <li>aufgerufene Seite bzw. Datei, Datum und Uhrzeit des Zugriffs, übertragene Datenmenge, Statuscode</li>
          <li>Browsertyp und -version, Betriebssystem, Referrer-URL</li>
          <li>IP-Adresse (in Protokollen gekürzt bzw. nur kurzfristig vollständig zur Abwehr von Angriffen)</li>
        </ul>
        <p className="mt-3">
          Zweck ist die Auslieferung der Website, die Gewährleistung von Stabilität und Sicherheit sowie die Abwehr und
          Aufklärung von Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Protokolle werden nach kurzer Zeit
          gelöscht, sofern sie nicht zur Aufklärung eines konkreten Sicherheitsvorfalls benötigt werden. Eine
          Zusammenführung mit anderen Datenquellen findet nicht statt.
        </p>
        <p>
          Die Übertragung erfolgt ausschließlich verschlüsselt (TLS, erkennbar an „https://“ und dem Schloss-Symbol). Schriften
          und Programmbibliotheken liefern wir von unserem eigenen Server aus; beim bloßen Aufruf der Website werden keine
          Inhalte von Drittanbietern geladen.
        </p>
      </Abschnitt>

      <Abschnitt id="cookies" titel={T("cookies")}>
        <p>
          Ohne Ihre Einwilligung setzen wir nur Cookies und Browserspeicher-Einträge, die unbedingt erforderlich sind, damit
          wir einen von Ihnen ausdrücklich gewünschten Dienst bereitstellen können (§ 165 Abs. 3 TKG 2021). Dazu gehört das
          Cookie „cookieConsent“, in dem Ihre Auswahl im Cookie-Banner für ein Jahr gespeichert wird, sowie einzelne Einträge
          im lokalen Speicher Ihres Browsers, die sich merken, dass Sie einen Hinweis geschlossen haben. Diese Einträge
          enthalten keine Kennungen, mit denen wir Sie wiedererkennen könnten.
        </p>
        <p>
          {umami ? (
            <>
              Die cookielose Reichweitenmessung (Abschnitt {nr("statistik")}) setzt keine Cookies und legt nichts im Speicher Ihres Browsers
              ab. Alle weiteren Dienste – Google Analytics und unsere Heatmap (Statistik), Google Maps und
              OpenStreetMap-Karten – werden erst nach Ihrer Einwilligung geladen bzw. aktiviert.
            </>
          ) : (
            <>
              Google Analytics und unsere Heatmap (Statistik, Abschnitt {nr("statistik")}) sowie Google Maps und OpenStreetMap-Karten werden
              erst nach Ihrer Einwilligung geladen bzw. aktiviert.
            </>
          )}{" "}
          Rechtsgrundlage ist dann Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 165 Abs. 3 TKG 2021.
          Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über „Privatsphäre-Einstellungen“ bzw.
          „Cookie-Einstellungen“ im Seitenfuß ändern oder widerrufen. Zusätzlich können Sie Cookies in Ihrem Browser
          einschränken oder löschen.
        </p>
      </Abschnitt>

      <Abschnitt id="statistik" titel={T("statistik")}>
        {umami && (
          <>
            <p>
              <strong>a) Cookielose Reichweitenmessung mit Umami.</strong> Um zu verstehen, welche Seiten und Funktionen unserer
              Website genutzt werden (z. B. wie viele Besucher einen Rechner verwenden oder eine Anfrage beginnen), setzen wir die
              quelloffene Statistiksoftware Umami ein. Sie läuft auf einem Server, den wir selbst betreiben und bei einem
              Hosting-Dienstleister in der Europäischen Union angemietet haben; dieser ist als Auftragsverarbeiter nach Art. 28
              DSGVO gebunden. Eine Weitergabe an Dritte zu eigenen Zwecken findet nicht statt.
            </p>
            <p>
              Umami setzt keine Cookies, legt nichts im Speicher Ihres Browsers ab und bildet keine Nutzerprofile. Erfasst werden die aufgerufene Seite (ohne Such- und Formularparameter; Kampagnenparameter wie
              utm_source bleiben erhalten), die Domain der verweisenden Website, Browsertyp, Betriebssystem, Gerätekategorie,
              Bildschirmgröße, Sprache und das ungefähre Herkunftsland bzw. die Region sowie Ereignisse wie „Rechner-Ergebnis
              angezeigt“, „Konfigurator-Schritt“ oder „Rückruf-Fenster geöffnet“ – ohne Namen, Kontaktdaten oder andere
              Formularinhalte. Ihre IP-Adresse wird nur kurzzeitig zur Bestimmung des Landes und zur Bildung eines gesalzenen
              Hashwerts verwendet, dessen Salt regelmäßig wechselt, und nicht gespeichert; eine Zuordnung zu Ihrer Person oder
              eine Wiedererkennung über längere Zeit ist damit nicht vorgesehen. Seiten mit Einmal-Zugangscodes (z. B. Upload per
              QR-Code) und die Info-Bildschirme werden nicht erfasst. Ist in Ihrem Browser „Do Not Track“ aktiviert, findet keine
              Messung statt.
            </p>
            <p>
              Rechtsgrundlage ist unser berechtigtes Interesse an einer datensparsamen, zusammengefassten Auswertung und
              Verbesserung unseres Webangebots (Art. 6 Abs. 1 lit. f DSGVO). Sie können dieser Verarbeitung nach Art. 21 DSGVO
              jederzeit widersprechen – z. B. durch Aktivieren von „Do Not Track“ in Ihrem Browser oder durch eine Nachricht an{" "}
              {FIRMA.email}. Die Messdaten werden gelöscht, sobald sie für die Auswertung nicht mehr erforderlich sind.
            </p>
          </>
        )}
        <p>
          <strong>{buchstabeGa}) Google Analytics (nur mit Einwilligung).</strong> Sofern Sie im Cookie-Banner unter „Statistik“ eingewilligt haben, nutzen wir Google Analytics 4, einen
          Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland („Google“). Ohne Ihre
          Einwilligung wird Google Analytics nicht geladen und es werden keine Daten an Google übertragen.
        </p>
        <p>
          Erfasst werden die aufgerufenen Seiten (ohne Such- und Formularparameter; Kampagnenparameter wie utm_source
          bleiben erhalten), die Herkunftsseite, Verweildauer, Browsertyp, Betriebssystem, Gerätekategorie,
          Bildschirmgröße, Sprache, ungefährer Standort (Land/Region) sowie Ereignisse wie „Formular abgesendet“. Namen,
          E-Mail-Adressen oder andere Formularinhalte werden nicht an Google übermittelt. Zur Wiedererkennung Ihres Browsers
          setzt Google Analytics die Cookies „_ga“ und „_ga_*“ (Speicherdauer bis zu zwei Jahre). IP-Adressen werden von
          Google Analytics 4 nicht gespeichert. Google Signals, Werbefunktionen und personalisierte Werbung sind deaktiviert
          (Google Consent Mode mit Standardeinstellung „abgelehnt“). Seiten mit Einmal-Zugangscodes (z. B. Upload per
          QR-Code) und die Info-Bildschirme werden grundsätzlich nicht erfasst.
        </p>
        <p>
          Google kann Daten auch in den USA verarbeiten. Google LLC ist nach dem EU-US Data Privacy Framework zertifiziert,
          für das ein Angemessenheitsbeschluss der Europäischen Kommission besteht (Art. 45 DSGVO). Mit Google besteht ein
          Vertrag zur Auftragsverarbeitung. Die Daten werden nach 14 Monaten automatisch gelöscht.
        </p>
        <p>
          Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 165 Abs. 3 TKG 2021). Bei einem Widerruf wird
          die Messung sofort beendet und die Analytics-Cookies werden gelöscht. Weitere Informationen:{" "}
          <Ext href="https://policies.google.com/privacy">Datenschutzerklärung von Google</Ext>.
        </p>
        <p id="heatmap" className="scroll-mt-28">
          <strong>{buchstabeHeatmap}) Klick- und Scroll-Heatmap (nur mit Einwilligung).</strong> Sofern Sie im Cookie-Banner
          unter „Statistik“ eingewilligt haben, erfassen wir mit einem eigenen Skript, das von unserem Server ausgeliefert
          wird, wie unsere Seiten bedient werden – etwa welche Schaltflächen genutzt oder übersehen werden und wie weit
          Besucher nach unten scrollen. Ohne Ihre Einwilligung ist die Erfassung nicht aktiv. Je Seitenaufruf erfasst werden:
        </p>
        <ul className="mt-2">
          <li>die aufgerufene Seite (ohne URL-Parameter),</li>
          <li>der Gerätetyp (Smartphone, Tablet oder Desktop – abgeleitet aus der Fensterbreite),</li>
          <li>
            welche Elemente der Seite Sie anklicken (als technische Position im Seitenaufbau) und die ungefähre Klickposition
            innerhalb des Elements (relativ, auf 5 % gerundet), höchstens 100 Klicks je Seitenaufruf,
          </li>
          <li>die maximale Scrolltiefe (auf 10 % gerundet).</li>
        </ul>
        <p className="mt-3">
          Texteingaben, Formularinhalte sowie Texte oder Werte der angeklickten Elemente werden nicht erfasst; bei
          Eingabefeldern halten wir nur fest, dass das Feld angeklickt wurde. Das Skript setzt keine Cookies, legt nichts im
          Speicher Ihres Browsers ab und verwendet keine Kennung, mit der Ihr Browser wiedererkannt werden könnte. Die Angaben
          werden beim Verlassen der Seite an unseren Server übermittelt. Ihre IP-Adresse wird dabei nur kurzzeitig im
          Arbeitsspeicher zur Missbrauchsabwehr (Begrenzung der Zahl der Übermittlungen) verarbeitet, nicht gespeichert und
          nicht an unser Backoffice weitergegeben. Seiten mit Einmal-Zugangscodes (z. B. Upload per QR-Code), die
          Info-Bildschirme und das Hinweisgebersystem werden nicht erfasst.
        </p>
        <p>
          In unserem eigenen Backoffice werden die Angaben ausschließlich zusammengefasst als Zählwerte je Seite, Gerätetyp und
          Monat gespeichert (z. B. „Schaltfläche X auf Seite Y wurde im Mai 17-mal angeklickt“ oder „60 % der Aufrufe
          erreichten 70 % Scrolltiefe“); einzelne Besuche oder Klickverläufe werden nicht gespeichert. Eine Weitergabe an
          Dritte findet nicht statt. Die Zählwerte werden nach 14 Monaten gelöscht.
        </p>
        <p>
          Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 165 Abs. 3 TKG 2021). Sie können sie jederzeit
          mit Wirkung für die Zukunft über „Privatsphäre-Einstellungen“ bzw. „Cookie-Einstellungen“ im Seitenfuß widerrufen.
          Die Erfassung endet dann sofort; noch nicht übermittelte Angaben des laufenden Seitenaufrufs werden verworfen.
        </p>
        <p id="ab-tests" className="scroll-mt-28">
          <strong>{buchstabeAb}) Varianten-Tests (A/B-Tests).</strong> Um Seiten und Formulare verständlicher zu machen, können
          wir zwei Fassungen eines Seitenelements gegeneinander testen – etwa einen Formularschritt in der bisherigen und in
          einer vereinfachten Form. Welche Fassung Sie sehen, wird bei jedem Seitenaufruf zufällig bestimmt. Dafür setzen wir
          keine Cookies, legen nichts im Speicher Ihres Browsers ab und verwenden keine Kennung, mit der Ihr Browser
          wiedererkannt werden könnte; beim nächsten Aufruf wird neu ausgelost. Suchmaschinen erhalten dieselben Fassungen wie
          Besucherinnen und Besucher.
        </p>
        <p>
          Den Statistik-Ereignissen der getesteten Seite fügen wir nur die Bezeichnung des Tests und der Fassung bei (z. B.
          „k1:b“) –{" "}
          {umami
            ? `in der cookielosen Reichweitenmessung (Buchstabe a) und, nur mit Ihrer Einwilligung, in Google Analytics (Buchstabe ${buchstabeGa}).`
            : `nur mit Ihrer Einwilligung in Google Analytics (Buchstabe ${buchstabeGa}).`}{" "}
          Ausgewertet wird ausschließlich zusammengefasst: wie oft jede Fassung angezeigt wurde und wie viele Anfragen darauf
          folgten. Senden Sie auf einer getesteten Seite eine Anfrage, vermerken wir die Fassung zusätzlich in der Anfrage, um
          die Qualität der Anfragen je Fassung vergleichen zu können; der Vermerk wird mit der Anfrage anonymisiert (Punkt{" "}
          {nr("anfragen")}). Wofür wir die Angaben in Ihrer Anfrage verwenden und auf welcher Rechtsgrundlage, ändert sich durch
          einen Test nicht.
        </p>
        <p>
          Rechtsgrundlage ist unser berechtigtes Interesse an der Verbesserung unseres Webangebots (Art. 6 Abs. 1 lit. f
          DSGVO); Sie können dieser Verarbeitung nach Art. 21 DSGVO widersprechen.{" "}
          {aktiveTests.length > 0
            ? `Zum Stand dieser Datenschutzerklärung laufende Tests: ${aktiveTests
                .map((e) => `${e.titel} (Seite ${e.seiten.join(", ")})`)
                .join("; ")}.`
            : "Zum Stand dieser Datenschutzerklärung läuft kein solcher Test."}
        </p>
      </Abschnitt>

      <Abschnitt id="karten" titel={T("karten")}>
        <p>
          <strong>Google Maps.</strong> Auf der Kontaktseite kann eine Karte von Google Maps (Google Ireland Limited, Adresse
          siehe oben) angezeigt werden. Sie wird erst geladen, wenn Sie im Cookie-Banner oder direkt an der Karte zustimmen.
          Dabei werden Ihre IP-Adresse und technische Daten an Google übertragen; Google kann Cookies setzen und Daten auch in
          den USA verarbeiten (Data Privacy Framework, siehe oben). Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit.
          a DSGVO, § 165 Abs. 3 TKG 2021).
        </p>
        <p>
          <strong>OpenStreetMap.</strong> Die Detailkarte unserer Referenzkarte lädt Kartenkacheln von den Servern der
          OpenStreetMap Foundation (St John’s Innovation Centre, Cowley Road, Cambridge, CB4 0WS, Vereinigtes Königreich)
          erst, nachdem Sie auf „Karte laden“ geklickt haben. Dabei erhält die OpenStreetMap Foundation Ihre IP-Adresse und
          technische Verbindungsdaten. Für das Vereinigte Königreich besteht ein Angemessenheitsbeschluss der Europäischen
          Kommission. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Ohne Einwilligung zeigen wir eine
          Vorschau ohne externe Daten. Weitere Informationen:{" "}
          <Ext href="https://osmfoundation.org/wiki/Privacy_Policy">Datenschutzerklärung der OpenStreetMap Foundation</Ext>.
        </p>
      </Abschnitt>

      <Abschnitt id="anfragen" titel={T("anfragen")}>
        <p>
          Wenn Sie uns über das <Link href="/kontakt">Kontaktformular</Link>, den{" "}
          <Link href="/angebot">Angebots-Konfigurator</Link>, den Förder-Check, eine Wartungs- oder Serviceanfrage, per
          E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben (z. B. Name, Unternehmen, Funktion,
          Kontaktdaten, Anschrift bzw. Anlagenstandort, Angaben zu Gebäude, Dach, Verbrauch und Lastgang sowie Ihre
          Nachricht), um Ihre Anfrage zu bearbeiten, Ihnen ein Angebot zu erstellen und Rückfragen zu beantworten.
        </p>
        <p>
          Die Daten werden in unserem Backoffice-System (auf Basis des Open-Source-Frameworks Frappe) gespeichert. Zugriff
          haben nur die jeweils zuständigen Mitarbeiterinnen und Mitarbeiter aus Vertrieb, Technik und Innendienst.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen); bei allgemeinen Anfragen sowie bei
          Anfragen von Unternehmen, Gemeinden und sonstigen Organisationen unser berechtigtes Interesse an der Beantwortung
          (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <p>
          Anfragen über unsere Website-Formulare, aus denen kein Angebot oder Auftrag entsteht, anonymisieren wir automatisch
          24 Monate nach ihrem Eingang: Name, E-Mail-Adresse, Telefonnummer, Straße, Ihre Nachricht, interne Notizen und die
          IP-Adresse werden gelöscht, angehängte Dateien entfernt. Erhalten bleiben nur Angaben ohne Namen und Kontaktdaten –
          etwa Postleitzahl, Ort, Thema, Eckdaten des Vorhabens und die Kampagnen-Herkunft (Punkt {nr("herkunft")}) –, die wir
          ausschließlich für zusammengefasste Auswertungen verwenden. Für Anfragen per E-Mail oder Telefon gilt dieselbe Frist.
          Entsteht ein Angebot oder Auftrag, gelten die Fristen unter Punkt {nr("speicherdauer")}.
        </p>
      </Abschnitt>

      <Abschnitt id="herkunft" titel={T("herkunft")}>
        <p>
          Wenn Sie uns eine Anfrage senden (z. B. Kontakt, Rückruf, Terminbuchung, PDF-Analyse, Angebots-Konfigurator oder
          Unterlagen per Smartphone), speichern wir zusammen mit der Anfrage, über welchen Weg Sie auf unsere Website gekommen
          sind: Kampagnenparameter aus dem Link (utm_source, utm_medium, utm_campaign, utm_term, utm_content), die Domain der
          verweisenden Website, die Einstiegsseite und die Seite, auf der Sie die Anfrage gestellt haben.
        </p>
        <p>
          Diese Angaben werden während Ihres Besuchs nur im Arbeitsspeicher der geöffneten Seite gehalten, nicht in Cookies
          oder im Browserspeicher abgelegt und ausschließlich mit einer von Ihnen abgesendeten Anfrage übertragen.
          Rechtsgrundlage ist unser berechtigtes Interesse an der Auswertung unserer Marketingmaßnahmen (Art. 6 Abs. 1 lit. f
          DSGVO). Wird die Anfrage anonymisiert (Punkt {nr("anfragen")} bzw. {nr("rueckruf")}), bleiben die Kampagnenangaben ohne
          Namen und Kontaktdaten nur noch für zusammengefasste Auswertungen erhalten.
        </p>
      </Abschnitt>

      <Abschnitt id="ip-adresse" titel={T("ip-adresse")}>
        <p>
          Wenn Sie über unsere Website ein Formular absenden, speichern wir zusammen mit Ihren Angaben die IP-Adresse, von der
          aus das Formular abgesendet wurde, und den Zeitpunkt des Absendens. Die IP-Adresse dient ausschließlich dazu, Ihre
          Anfrage bzw. Einwilligung nachweisen zu können (etwa bei der Erlaubnis, Sie anzurufen) und unsere Formulare vor
          Missbrauch und automatisierten Spam-Anfragen zu schützen. Sie wird nicht an Dritte weitergegeben und nicht zu einem
          Profil zusammengeführt.
          {HINWEIS_INTERN && ` Für Meldungen über das Hinweisgebersystem gilt das ausdrücklich nicht (siehe Punkt ${nr("hinweisgeber")}).`}
        </p>
        <p>
          Rechtsgrundlage ist unser berechtigtes Interesse an der Nachweisbarkeit von Einwilligungen und an der Sicherheit
          unserer Website (Art. 6 Abs. 1 lit. f DSGVO). Die IP-Adresse wird gelöscht, wenn die Anfrage anonymisiert wird – bei
          Formular-Anfragen 24 Monate nach Eingang (Punkt {nr("anfragen")}), bei Rückrufen und Terminen 24 Monate nach dem
          Termin (Punkt {nr("rueckruf")}). Entsteht ein Angebot oder Auftrag, gelten die Fristen unter Punkt{" "}
          {nr("speicherdauer")}.
        </p>
      </Abschnitt>

      <Abschnitt id="rueckruf" titel={T("rueckruf")}>
        <p>
          Wenn Sie einen Rückruf anfordern oder einen <Link href="/termin">Beratungstermin</Link> buchen, verarbeiten wir die
          von Ihnen angegebenen Daten (Telefonnummer, Name, E-Mail-Adresse, Postleitzahl, optional Thema und Nachricht, bei
          Vor-Ort-Terminen die Adresse) sowie den gewählten Zeitpunkt. Zweck ist die Durchführung des Gesprächs oder Termins
          und die Terminbestätigung per E-Mail. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO sowie Ihre Einwilligung in den
          Anruf (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021), die Sie jederzeit widerrufen können.
        </p>
        <p>
          Rückrufwünsche speichern wir wie gebuchte Termine in unserem Backoffice. 24 Monate nach dem Termin bzw. dem
          gewünschten Rückrufzeitpunkt anonymisieren wir die Daten automatisch: Name, Unternehmen, E-Mail-Adresse,
          Telefonnummer, Adresse, Nachricht, interne Notizen und IP-Adresse werden gelöscht; Terminart, Datum, Postleitzahl,
          Thema und Kampagnen-Herkunft bleiben ohne Personenbezug für unsere Statistik erhalten. Entsteht aus dem Gespräch ein
          Angebot oder Auftrag, gelten für die dabei verarbeiteten Daten die Fristen unter Punkt {nr("speicherdauer")}.
        </p>
        <p>
          Zum Schutz vor Missbrauch nehmen wir nur Rufnummern aus Österreich, Deutschland und der Schweiz an (keine
          Mehrwert- und Sondernummern) und begrenzen die Zahl der Buchungen je IP-Adresse. Den Anruf führen unsere
          Mitarbeiterinnen und Mitarbeiter selbst durch; ein externer Telefoniedienst ist dabei nicht eingebunden. Die
          Schaltflächen „Zum Kalender hinzufügen“ erzeugen die Kalenderdatei in Ihrem Browser; die Seiten von Google Kalender
          oder Outlook öffnen sich erst durch Ihren Klick.
        </p>
      </Abschnitt>

      <Abschnitt id="unterlagen" titel={T("unterlagen")}>
        <p>
          Für ein präzises Angebot können Sie am Computer einen QR-Code erzeugen und mit Ihrem Smartphone Fotos von
          Stromzähler, Stromrechnung und optional Zählerschrank und Gebäude hochladen. Dabei verarbeiten wir Ihre Kontaktdaten,
          Ihre Angaben im Rechner, die Fotos bzw. Dokumente sowie den Zählerstand. Der QR-Code enthält einen zufälligen
          Einmal-Schlüssel, der nach 45 Minuten ungültig wird; wir speichern nur einen nicht umkehrbaren Hashwert davon. Die
          Fotos werden vor dem Hochladen auf Ihrem Gerät verkleinert, dabei werden Standort- und Kameradaten (EXIF) entfernt.
        </p>
        <p>
          <strong>Texterkennung (OCR) auf Ihrem Gerät:</strong> Der Zählerstand wird per Texterkennung direkt auf Ihrem
          Smartphone ausgelesen. Die dafür nötigen Programmdateien laden wir von unserem eigenen Server; es werden dabei keine
          Daten an Dritte übertragen.
        </p>
        <p>
          <strong>Erinnerung:</strong> Sind zwei Stunden nach dem Start noch keine Unterlagen eingegangen, senden wir Ihnen
          einmalig eine E-Mail mit einem persönlichen Link, der 72 Stunden gültig ist. Nicht abgeschlossene Vorgänge löschen
          wir 24 Stunden nach Ablauf des QR-Codes bzw. des Links.
        </p>
        <p>
          <strong>Optionale KI-Auswertung:</strong> Nur wenn Sie dies auf dem Smartphone ausdrücklich ankreuzen, übermitteln
          wir die hochgeladenen Unterlagen an die Anthropic, PBC (San Francisco, USA), die mit dem KI-Modell Claude
          Verbrauch, Preise, Tarif und Zählerdaten ausliest sowie Zählerschrank und Dach beschreibt. Anthropic verarbeitet die
          Daten als Auftragsverarbeiter ausschließlich zu diesem Zweck und nutzt sie nicht zum Training von KI-Modellen. Die
          Übermittlung in die USA erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 49 Abs. 1 lit. a DSGVO) und
          der mit Anthropic vereinbarten Standardvertragsklauseln (Art. 46 DSGVO). Ohne Einwilligung prüft eine Mitarbeiterin
          oder ein Mitarbeiter Ihre Unterlagen manuell. Die ausgelesenen Werte werden von unseren Beratern geprüft; eine
          automatisierte Entscheidung im Sinne von Art. 22 DSGVO findet nicht statt.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO sowie für die KI-Auswertung Ihre Einwilligung (Art. 6 Abs. 1 lit. a
          DSGVO), die Sie jederzeit widerrufen können. Vorgänge, aus denen kein Angebot oder Auftrag entsteht, löschen wir
          zwölf Monate nach Eingang samt Fotos und Dokumenten.
        </p>
      </Abschnitt>

      <Abschnitt id="analyse" titel={T("analyse")}>
        <p>
          Wenn Sie sich Ihre Berechnung als persönliche PDF-Analyse erstellen lassen, verarbeiten wir Ihren Namen, Ihre
          E-Mail-Adresse, optional Postleitzahl und Telefonnummer, Ihre Angaben im Rechner (Anlagengröße, Ausrichtung,
          Neigung, Stromverbrauch, Speicher) und die berechneten Ergebnisse. Das PDF wird auf unserem Server erzeugt, in
          unserem Backoffice gespeichert, Ihnen per E-Mail zugesandt und unserem Vertrieb zur Beratung bereitgestellt.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO sowie Ihre Einwilligung in die Kontaktaufnahme (Art. 6 Abs. 1 lit. a
          DSGVO). Entsteht kein Angebot oder Auftrag, anonymisieren wir die Anfrage 24 Monate nach Eingang und löschen dabei
          das PDF (Punkt {nr("anfragen")}).
        </p>
      </Abschnitt>

      <Abschnitt id="standort-check" titel={T("standort-check")}>
        <p>
          Mit dem <Link href="/standort-check">Standort-Check</Link>, der <Link href="/schneelast">Schneelast-Karte</Link> und
          der <Link href="/pv-prognose">PV-Prognose</Link> schätzen Sie Schneelast, Wind, Hagelgefährdung, Jahresertrag bzw.
          die in den nächsten Tagen erwartete Leistung einer Anlage ab. Dazu verarbeiten wir die von Ihnen eingegebene Adresse
          bzw. den gewählten Kartenpunkt und die daraus ermittelten Koordinaten und Seehöhe.
        </p>
        <ul className="mt-2 space-y-1.5">
          <li>
            <strong>Geokodierung:</strong> Die Adresse wird von unserem Server aus – ohne Ihre IP-Adresse – an den
            Suchdienst Nominatim der OpenStreetMap Foundation (Vereinigtes Königreich, Angemessenheitsbeschluss)
            übermittelt, um die Koordinaten zu ermitteln.
          </li>
          <li>
            <strong>Höhendaten und Ertrag:</strong> Von unserem Server aus werden nur die Koordinaten an Open Topo Data
            (Höhenmodell EU-DEM; Standort-Check und Schneelast-Karte) sowie an PVGIS, das Photovoltaik-Informationssystem der
            Europäischen Kommission (Gemeinsame Forschungsstelle; Standort-Check), übermittelt.
          </li>
          <li>
            <strong>Schneelast-Richtwert:</strong> Die Richtwerte der Schneelast-Karte berechnen wir aus einem auf unserem
            Server gespeicherten Datensatz, der aus Schneedaten von GeoSphere Austria abgeleitet ist. Beim Abruf wird dafür
            keine Anfrage an GeoSphere Austria gesendet; die Karte selbst ist ein Bild von unserem Server.
          </li>
          <li id="pv-prognose" className="scroll-mt-28">
            <strong>PV-Prognose:</strong> Ihr Browser rundet den gewählten Punkt auf ein Raster von 0,05 Grad (rund 5,6 km in
            Nord-Süd- und 3,8 km in Ost-West-Richtung) und übermittelt nur den Mittelpunkt dieser Rasterzelle an unseren
            Server. Von dort fragen wir mit diesen Koordinaten die Wettervorhersage im Data Hub von GeoSphere Austria
            (Bundesanstalt für Geologie, Geophysik, Klimatologie und Meteorologie, Wien) ab und halten die Antwort je
            Rasterzelle im Arbeitsspeicher vor, bis ein neuer Modelllauf vorliegt. Die Börsenstrompreise stammen aus
            öffentlichen Quellen (Punkt {nr("energiedaten")}).
          </li>
          <li>
            <strong>Aktueller Standort:</strong> Nur wenn Sie in der PV-Prognose die Schaltfläche für Ihren aktuellen Standort
            anklicken und die Abfrage in Ihrem Browser erlauben, ermittelt Ihr Browser Ihre Position. Auch sie wird vor der
            Übermittlung an unseren Server auf die Rasterzelle gerundet.
          </li>
          <li>
            <strong>Karte:</strong> Die Karte lädt Kartenkacheln von basemap.at (Verwaltungsgrundkarte Österreich, Server
            der Stadt Wien) direkt in Ihren Browser; dabei wird Ihre IP-Adresse an diesen Server übermittelt.
          </li>
          <li>
            <strong>eHORA:</strong> Für die amtlichen Naturgefahren-Informationen (u. a. Schneelast, Wind und Hagel) verlinken
            wir auf{" "}
            <Ext href="https://www.hora.gv.at">eHORA (hora.gv.at)</Ext>. Die Seite öffnet sich erst durch Ihren Klick; dabei
            gelten die Datenschutzbestimmungen des Bundes.
          </li>
        </ul>
        <p className="mt-3">
          An die genannten Dienste übermitteln wir nur Adresse bzw. Koordinaten, keine Namen oder Kontaktdaten. Soweit eine
          Abfrage oder eine Kartendarstellung direkt aus Ihrem Browser erfolgt, erhält der jeweilige Anbieter zusätzlich Ihre
          IP-Adresse und technische Verbindungsdaten. Zum Schutz vor Missbrauch verarbeiten wir Ihre IP-Adresse nur kurzzeitig
          im Arbeitsspeicher unseres Servers, um die Zahl der Abfragen zu begrenzen; sie wird nicht gespeichert. Wir speichern
          die Standortangaben nicht, es sei denn, Sie senden uns anschließend eine Anfrage – dann gilt Punkt {nr("anfragen")}.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung der von Ihnen angeforderten Berechnung) bzw. Art. 6
          Abs. 1 lit. f DSGVO.
        </p>
      </Abschnitt>

      <Abschnitt id="lastgang" titel={T("lastgang")}>
        <p>
          Mit der <Link href="/lastgang-analyse">Lastgang-Analyse</Link> werten Sie eine Lastgang-Datei Ihres Netzbetreibers
          (Viertelstundenwerte) aus. Solche Dateien können neben den Messwerten auch Zählpunkt, Kundennummer, Name und
          Anschrift enthalten. Die Datei wird ausschließlich in Ihrem Browser gelesen und ausgewertet: Sie und die Ergebnisse
          werden weder an uns noch an Dritte übertragen und weder auf unserem Server noch im Speicher Ihres Browsers abgelegt;
          nach dem Schließen der Seite sind sie verworfen. Fordern Sie unsere Beispieldatei an, wird nur diese von unserem
          Server geladen. Unsere Statistik (Punkt {nr("statistik")}) erfasst weder Dateiinhalte noch Ergebnisse.
        </p>
        <p>
          Übernehmen Sie Ergebnisse in den Angebots-Konfigurator, enthält der Link nur die Zahlen, die Sie dort sehen
          (Jahresverbrauch, Anlagengröße, Speicher) – nicht Ihre Datei. Erst wenn Sie die Anfrage absenden, verarbeiten wir
          diese Angaben wie unter Punkt {nr("anfragen")} beschrieben.
        </p>
      </Abschnitt>

      <Abschnitt id="partner" titel={T("partner")}>
        <p>
          Elektrotechnik-Betriebe können sich über unsere Seite <Link href="/partner">Elektro-Partner werden</Link> als
          Subunternehmer registrieren. Wir verarbeiten dabei Firmendaten (Firma, Anschrift, UID, Firmenbuch- bzw.
          GISA-Angaben), Name, Funktion und Kontaktdaten der Ansprechpersonen, Angaben zu Gewerbeberechtigung, Qualifikationen,
          Mitarbeiterzahl, Einsatzgebiet, Kapazitäten, Referenzen und Versicherungsnachweisen sowie Ihre Nachricht.
        </p>
        <p>
          Zweck ist die Prüfung Ihrer Eignung, die Aufnahme in unser Partnernetzwerk und die Vergabe und Abwicklung von
          Aufträgen. Angaben zur Gewerbeberechtigung können wir mit öffentlichen Registern (GISA, Firmenbuch, WKO Firmen A–Z)
          abgleichen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; für personenbezogene Daten von Ansprechpersonen unser
          berechtigtes Interesse an der Geschäftsanbahnung (Art. 6 Abs. 1 lit. f DSGVO). Kommt keine Zusammenarbeit zustande,
          wird Ihre Registrierung 24 Monate nach Eingang automatisch anonymisiert (Punkt {nr("anfragen")}); bei einer
          Partnerschaft speichern wir die Daten für deren Dauer und danach nach Maßgabe der gesetzlichen Aufbewahrungsfristen.
        </p>
      </Abschnitt>

      <Abschnitt id="sponsoring" titel={T("sponsoring")}>
        <p>
          Über das Formular auf unserer Seite <Link href="/sponsoring">Sponsoring</Link> können Vereine, Kultur- und
          Bildungseinrichtungen sowie Organisationen eine Unterstützung anfragen. Wir verarbeiten Name der Organisation,
          Name und Kontaktdaten der Ansprechperson, Beschreibung des Vorhabens, gewünschte Leistung und beigefügte Unterlagen,
          um die Anfrage zu prüfen und zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Abgelehnte
          Anfragen werden 24 Monate nach Eingang automatisch anonymisiert (Punkt {nr("anfragen")}); bei einer
          Sponsoring-Vereinbarung gelten die gesetzlichen Aufbewahrungsfristen.
        </p>
        <p>
          Anfragen über die Formulare für Sponsoring, Elektro-Partner und PV Award werden in unser Kunden- und
          Anfragesystem (Backoffice) übertragen. Zum Schutz vor Missbrauch speichern wir dabei die IP-Adresse und den
          Zeitpunkt der Übermittlung als Nachweis (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </Abschnitt>

      <Abschnitt id="pv-award" titel={T("pv-award")}>
        <p>
          Für den <Link href="/pv-award">Ökovolt PV Award</Link> verarbeiten wir die Angaben der Einreichenden (Unternehmen
          bzw. Name, Ansprechperson, Kontaktdaten), die Angaben zur Anlage und zu Nachhaltigkeitsmaßnahmen sowie eingereichte
          Fotos und Texte. Zweck ist die Durchführung des Wettbewerbs, die Bewertung durch die Jury und die Benachrichtigung
          der Einreichenden. Jurymitglieder sind zur Vertraulichkeit verpflichtet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO (Teilnahme).
        </p>
        <p>
          Namen, Fotos und Projektbeschreibungen von Nominierten und Preisträgern veröffentlichen wir (z. B. auf der Website,
          im Newsroom und in sozialen Medien) nur mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit
          widerrufen können; ein Widerruf bis zur Jurysitzung führt dazu, dass Ihre Einreichung nicht öffentlich genannt wird.
          Freiwillig freigegebene Monitoring-Daten der Anlage verwenden wir nur für die Bewertung. Mit der Einreichung bestätigen Sie, dass Sie über die Rechte an den eingereichten Fotos verfügen
          und abgebildete Personen einverstanden sind. Nicht prämierte Einreichungen werden 24 Monate nach Eingang automatisch
          anonymisiert (Punkt {nr("anfragen")}).
        </p>
      </Abschnitt>

      <Abschnitt id="bewerbung" titel={T("bewerbung")}>
        <p>
          Wenn Sie sich bei uns bewerben – über die Kurzbewerbung auf unserer <Link href="/uber-uns/jobs">Jobseite</Link>{" "}
          (sie öffnet Ihr E-Mail-Programm mit einer vorausgefüllten Nachricht) oder direkt per E-Mail –, verarbeiten wir Ihre
          Angaben und Unterlagen zur Durchführung des Bewerbungsverfahrens (Art. 6 Abs. 1 lit. b DSGVO). Kommt kein
          Dienstverhältnis zustande, löschen wir Ihre Daten sieben Monate nach Abschluss des Verfahrens, damit wir uns gegen
          allfällige Ansprüche nach dem Gleichbehandlungsgesetz verteidigen können (Art. 6 Abs. 1 lit. f DSGVO). Eine längere
          Aufbewahrung für künftige Stellen erfolgt nur mit Ihrer Einwilligung.
        </p>
      </Abschnitt>

      <Abschnitt id="kunden" titel={T("kunden")}>
        <p>
          Im Rahmen von Angeboten, Aufträgen und Wartungsverträgen verarbeiten wir Stamm-, Vertrags-, Projekt-, Abrechnungs-
          und Kommunikationsdaten sowie Anlagendaten (z. B. Standort, Komponenten, Seriennummern, Zählpunkt,
          Netzbetreiber, Prüfbefunde). Soweit vereinbart, verarbeiten wir über unsere Fernwartungs- und SCADA-Systeme bzw. die
          Portale der Hersteller Betriebs- und Ertragsdaten der Anlage, um Störungen zu erkennen, Wartungen durchzuführen und
          Berichte zu erstellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und c DSGVO.
        </p>
        <p>
          Soweit für die Vertragserfüllung erforderlich, übermitteln wir Daten an Netzbetreiber (Netzzugang,
          Fertigstellungsmeldung), Förderstellen (z. B. OeMAG, KPC, Landesförderstellen – nur auf Ihren Wunsch), Behörden,
          Hersteller (Garantieregistrierung), Subunternehmer und Elektro-Partnerbetriebe, Versicherungen, Banken bzw.
          Leasinggeber (bei Finanzierung auf Ihren Wunsch) sowie an unsere Steuerberatung.
        </p>
        <p>
          Wir gehören zur Ökovolt-Unternehmensgruppe. Soweit wir IT-Systeme oder Dienstleistungen gemeinsam mit unserer
          deutschen Schwestergesellschaft {SCHWESTER.name} ({SCHWESTER.ort}) nutzen, geschieht dies auf Grundlage einer
          Vereinbarung nach Art. 28 bzw. Art. 26 DSGVO; die Daten verbleiben im Europäischen Wirtschaftsraum.
        </p>
      </Abschnitt>

      <Abschnitt id="kundenbuehne" titel={T("kundenbuehne")}>
        {/* Quelle: docs/datenschutz/VVT-Kundenbuehne.md; Code: src/lib/kundenbuehne*.js, src/data/kunden.js,
            src/components/Kundenbuehne/ – RECHTLICH PRÜFEN (Befund D11, Art. 14 DSGVO, § 1 DSG). */}
        <p>
          Auf den Seiten unserer <Link href="/referenzen/projekte">Referenzprojekte</Link> stellen wir Anlagen und unsere Kundinnen und
          Kunden vor – mit Kundenporträt, Siegel, Vorlagen für soziale Medien und einem ESG-Kurzbericht mit geschätzten
          Kennzahlen der Anlage. Dafür verwenden wir eigene Projektdaten (z. B. Leistung, Jahr, Ort und Bilder der Anlage)
          sowie Angaben, die die Unternehmen selbst öffentlich machen: Firmenwortlaut, Branche, Standort, Website, die dort
          verlinkten Social-Media-Profile und eine kurze, in eigenen Worten verfasste Beschreibung. Diese Angaben stammen aus
          öffentlich zugänglichen Quellen, vor allem den offiziellen Websites der Unternehmen (Impressum, „Über uns“); die
          Quellen und das Datum der letzten Prüfung nennen wir auf der jeweiligen Seite. In der Referenzkarte zeigen wir
          Projekte nur auf Ebene des Ortes, nicht mit Hausadresse.
        </p>
        <p>
          Die Darstellung betrifft überwiegend Unternehmen. Personenbezogene Daten können enthalten sein, wenn ein Name im
          Firmenwortlaut steht oder die Beschreibung Gründerinnen, Gründer oder Inhaber nennt. Rechtsgrundlage ist insoweit
          unser berechtigtes Interesse, unsere Arbeit anhand realer Projekte zu zeigen (Art. 6 Abs. 1 lit. f DSGVO). Zitate mit
          dem Namen der zitierten Person und Firmenlogos zeigen wir nur mit Freigabe (Art. 6 Abs. 1 lit. a DSGVO). Empfänger
          ist die Öffentlichkeit; die Vorlagen für soziale Medien laden die Kundinnen und Kunden selbst herunter.
        </p>
        <p>
          Die Angaben bleiben veröffentlicht, solange wir das Projekt als Referenz zeigen. Sie können der Darstellung
          jederzeit widersprechen (Art. 21 DSGVO) bzw. eine erteilte Freigabe widerrufen – eine Nachricht an{" "}
          <a href={`mailto:${FIRMA.email}?subject=Datenschutz`}>{FIRMA.email}</a> genügt. Wir entfernen die Angaben dann bzw.
          zeigen das Projekt ohne Kundenporträt.
        </p>
      </Abschnitt>

      <Abschnitt id="energiedaten" titel={T("energiedaten")}>
        <p>
          Börsenstrompreise und Erzeugungsdaten auf unserer Seite <Link href="/energie-live">Energie live</Link> und in
          einzelnen Rechnern beziehen wir serverseitig von öffentlichen Datenquellen (u. a. Energy-Charts des Fraunhofer ISE
          und aWATTar). Beim Abruf werden keine personenbezogenen Daten von Ihnen an diese Anbieter übermittelt; die
          Diagramme werden in Ihrem Browser aus den bei uns zwischengespeicherten Daten erzeugt.
        </p>
      </Abschnitt>

      <Abschnitt id="teilen" titel={T("teilen")}>
        <p>
          Unter Ratgeber-Artikeln, Pressemeldungen und Stellenanzeigen bieten wir Schaltflächen zum Teilen (z. B. LinkedIn,
          XING, WhatsApp, Facebook, X, Telegram, E-Mail) und zum Zusammenfassen mit KI-Assistenten (z. B. ChatGPT,
          Perplexity, Claude, Google, Grok). Es handelt sich um einfache Links: Beim Aufruf unserer Seite werden keine
          Skripte, Pixel oder Cookies dieser Anbieter geladen. Erst wenn Sie eine Schaltfläche anklicken, öffnet sich die
          Seite des Anbieters; dieser erhält die Adresse unserer Seite sowie die üblichen Verbindungsdaten Ihres Browsers, und
          es gelten seine Datenschutzbestimmungen. Geteilte Links enthalten Kampagnenparameter ohne personenbezogene Daten.
        </p>
      </Abschnitt>

      <Abschnitt id="push" titel={T("push")}>
        <p>
          Sie können sich über neue Beiträge zu selbst gewählten Themen per Push-Benachrichtigung informieren lassen. Nach
          Ihrer Erlaubnis im Browser erzeugt dieser ein Abonnement mit einer technischen Zustelladresse (Endpoint) des
          Push-Dienstes Ihres Browserherstellers (z. B. Google, Mozilla, Apple, Microsoft) und zwei Schlüsseln zur
          Verschlüsselung. Wir speichern diese Angaben mit den gewählten Themen und dem Zeitpunkt der Anmeldung – ohne Namen,
          E-Mail-Adresse oder IP-Adresse. Die Nachrichten werden Ende-zu-Ende-verschlüsselt über den Push-Dienst Ihres
          Browsers zugestellt.
        </p>
        <p>
          Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 165 Abs. 3 TKG 2021). Sie können die
          Benachrichtigungen jederzeit über „Abbestellen“ auf unserer Website oder in den Browsereinstellungen beenden; das
          Abonnement wird dann gelöscht. Abonnements, die der Push-Dienst als abgelaufen meldet, löschen wir automatisch.
        </p>
      </Abschnitt>

      <Abschnitt id="fediverse" titel={T("fediverse")}>
        <p>
          Unsere Website betreibt eigene Konten im Fediverse (z. B. @oekovolt@oekovolt.com), denen Sie etwa über Mastodon
          folgen können. Wenn Sie folgen, übermittelt Ihr Server uns die öffentlichen Angaben Ihres Profils (Profiladresse,
          Benutzername, Anzeigename, Adresse Ihres Posteingangs). Wir speichern diese Angaben, um Ihnen neue Beiträge
          zuzustellen (Art. 6 Abs. 1 lit. b DSGVO). Die Liste unserer Follower veröffentlichen wir nicht. Wenn Sie nicht mehr
          folgen oder Ihr Konto löschen, entfernen wir die Angaben. Reaktionen wie Likes, geteilte Beiträge oder Antworten
          verarbeiten wir nicht.
        </p>
        <p>
          RSS- und JSON-Feeds sowie die Info-Bildschirme können ohne Anmeldung abgerufen werden; dabei werden nur die
          technisch notwendigen Server-Logdaten verarbeitet (Punkt {nr("hosting")}).
        </p>
      </Abschnitt>

      <Abschnitt id="hinweisgeber" titel={T("hinweisgeber")}>
        {HINWEIS_INTERN ? (
          <>
            {/* Eigenes Hinweisgebersystem (HINWEIS_INTERN=1). Frist wie im Backend umgesetzt (Frappe-DocType „Hinweis“:
                Löschung 5 Jahre nach Abschluss) – RECHTLICH PRÜFEN, siehe docs/frappe-hinweisgebersystem/GO-LIVE-AT.md. */}
            <p>
              Hinweise auf Rechtsverletzungen nach dem HinweisgeberInnenschutzgesetz (HSchG) können Sie vertraulich und auf
              Wunsch anonym über unser eigenes <Link href="/hinweisgebersystem">Hinweisgebersystem</Link> abgeben.
              Verantwortlicher ist die {FIRMA.name} (Punkt {nr("verantwortlicher")}). Die Meldung wird verschlüsselt (HTTPS/TLS) an unsere Website
              und von dort an unser eigenes Backoffice übertragen und dort gespeichert; ein externer Portalbetreiber ist nicht
              beteiligt. Zugriff auf die Meldungen haben ausschließlich die benannten, zur Vertraulichkeit verpflichteten
              Personen der internen Meldestelle.
            </p>
            <p>
              Angaben zu Ihrer Person sind freiwillig. Nach dem Absenden erhalten Sie eine Fall-Nummer und einen
              Zugangsschlüssel; damit können Sie in Ihrem Postfach Rückfragen beantworten und den Bearbeitungsstand abrufen,
              ohne Ihre Identität preiszugeben. Der Zugangsschlüssel wird nur als kryptografischer Hash gespeichert. Ihre
              IP-Adresse und Browserdaten werden – anders als bei den übrigen Formularen (Punkt {nr("ip-adresse")}) – nicht mit der Meldung
              gespeichert und nicht an das Backoffice übermittelt.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 8 HSchG. Meldungen und ihre Dokumentation
              werden fünf Jahre nach Abschluss des Verfahrens gelöscht, sofern sie nicht für ein bereits eingeleitetes
              verwaltungsbehördliches oder gerichtliches Verfahren weiter benötigt werden (§ 8 Abs. 11 HSchG). Alle
              Informationen – auch für Personen, die in einer Meldung genannt werden, und zur Einschränkung von
              Betroffenenrechten – finden Sie in den{" "}
              <Link href="/hinweisgebersystem#datenschutz">Datenschutzhinweisen zum Hinweisgebersystem</Link>.
            </p>
          </>
        ) : (
          <p>
            Hinweise auf Rechtsverletzungen nach dem HinweisgeberInnenschutzgesetz (HSchG) können Sie vertraulich und auf Wunsch
            anonym über unser Hinweisgeberportal{" "}
            <Ext href="https://oekovolt.integrityline.com/">oekovolt.integrityline.com</Ext> abgeben. Das Portal wird nicht über
            diese Website, sondern von einem spezialisierten Dienstleister als Auftragsverarbeiter betrieben. Rechtsgrundlage
            ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit dem HSchG. Alle Informationen – auch zur Einschränkung von
            Betroffenenrechten und zur Aufbewahrung nach § 8 HSchG – finden Sie auf unserer Seite{" "}
            <Link href="/hinweisgeberschutz#datenschutz">Hinweisgeberschutz</Link>.
          </p>
        )}
      </Abschnitt>

      <Abschnitt id="empfaenger" titel={T("empfaenger")}>
        <p>
          Wir geben Ihre Daten nur weiter, wenn dies für die genannten Zwecke erforderlich ist, eine Rechtsgrundlage besteht
          oder Sie eingewilligt haben. Unsere Auftragsverarbeiter sind vertraglich nach Art. 28 DSGVO gebunden, insbesondere:
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            {umami
              ? "Hosting- und IT-Dienstleister für Website, Backoffice und die cookielose Reichweitenmessung (Server in der EU)"
              : "Hosting- und IT-Dienstleister für Website und Backoffice (Server in der EU)"}
          </li>
          <li>Google Ireland Limited (Google Analytics, Google Maps – nur nach Einwilligung)</li>
          <li>Anthropic, PBC (KI-Auswertung von Unterlagen – nur nach Einwilligung)</li>
          {/* Eigenes Hinweisgebersystem: kein externer Portalbetreiber mehr (läuft über Website und Backoffice oben) */}
          {!HINWEIS_INTERN && <li>Betreiber des Hinweisgeberportals</li>}
          <li>E-Mail- und Kommunikationsdienstleister</li>
        </ul>
        <p className="mt-3">
          Eine Übermittlung in Staaten außerhalb des Europäischen Wirtschaftsraums erfolgt nur, soweit ein
          Angemessenheitsbeschluss der Europäischen Kommission besteht (z. B. EU-US Data Privacy Framework, Vereinigtes
          Königreich, Schweiz), geeignete Garantien wie Standardvertragsklauseln vereinbart sind (Art. 46 DSGVO) oder Sie
          ausdrücklich eingewilligt haben (Art. 49 Abs. 1 lit. a DSGVO). Bei einer Übermittlung in die USA besteht das Risiko,
          dass Behörden auf die Daten zugreifen und Ihnen dagegen nur eingeschränkte Rechtsbehelfe zur Verfügung stehen.
        </p>
      </Abschnitt>

      <Abschnitt id="speicherdauer" titel={T("speicherdauer")}>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist; konkrete
          Fristen nennen wir in den einzelnen Abschnitten. Darüber hinaus bewahren wir Daten auf, soweit gesetzliche Pflichten
          dies verlangen – insbesondere Buchhaltungs- und Geschäftsunterlagen sieben Jahre (§ 132 BAO, § 212 UGB) – oder
          soweit dies zur Geltendmachung, Ausübung oder Abwehr von Rechtsansprüchen erforderlich ist, etwa bis zum Ablauf von
          Gewährleistungs- und Verjährungsfristen (in der Regel drei Jahre nach § 1489 ABGB, in Ausnahmefällen länger).
          Einwilligungsbasierte Daten löschen wir nach Widerruf, sofern keine andere Rechtsgrundlage besteht.
        </p>
        <p>Automatische Fristen in unserem Backoffice im Überblick:</p>
        <ul className="mt-2 space-y-1">
          <li>
            Formular-Anfragen ohne Angebot oder Auftrag (Kontakt, Angebots-Konfigurator, PDF-Analyse, Elektro-Partner,
            Sponsoring, PV Award): Anonymisierung 24 Monate nach Eingang (Punkt {nr("anfragen")})
          </li>
          <li>Rückrufe und Termine: Anonymisierung 24 Monate nach dem Termin (Punkt {nr("rueckruf")})</li>
          <li>
            Unterlagen per Smartphone ohne Angebot oder Auftrag: Löschung zwölf Monate nach Eingang, nicht abgeschlossene
            Vorgänge 24 Stunden nach Ablauf des QR-Codes bzw. Links (Punkt {nr("unterlagen")})
          </li>
          <li>Heatmap: Zählwerte je Monat werden nach 14 Monaten gelöscht (Punkt {nr("statistik")})</li>
          {HINWEIS_INTERN && (
            <li>Hinweisgebersystem: Löschung fünf Jahre nach Abschluss des Verfahrens (Punkt {nr("hinweisgeber")})</li>
          )}
        </ul>
      </Abschnitt>

      <Abschnitt id="rechte" titel={T("rechte")}>
        <p>Ihnen stehen nach der DSGVO folgende Rechte zu:</p>
        <ul className="mt-2 space-y-1">
          <li>Auskunft über Ihre verarbeiteten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>
            <strong>Widerspruch</strong> gegen Verarbeitungen auf Grundlage berechtigter Interessen aus Gründen, die sich aus
            Ihrer besonderen Situation ergeben, sowie jederzeit gegen Direktwerbung (Art. 21 DSGVO)
          </li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p className="mt-3">
          Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht an <a href={`mailto:${FIRMA.email}?subject=Datenschutz`}>{FIRMA.email}</a>.
          Wir können einen Identitätsnachweis verlangen, wenn Zweifel an Ihrer Identität bestehen. Eine automatisierte
          Entscheidungsfindung einschließlich Profiling (Art. 22 DSGVO) findet nicht statt.
        </p>
        <p>
          Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei
          der Aufsichtsbehörde beschweren (Art. 77 DSGVO, § 24 DSG). In Österreich zuständig ist die:
        </p>
        <address className="mt-3 not-italic">
          <strong>Österreichische Datenschutzbehörde</strong>
          <br />
          Barichgasse 40–42, 1030 Wien
          <br />
          Telefon: +43 1 52 152-0
          <br />
          E-Mail: <a href="mailto:dsb@dsb.gv.at">dsb@dsb.gv.at</a>
          <br />
          <Ext href="https://www.dsb.gv.at">www.dsb.gv.at</Ext>
        </address>
        <p className="mt-6 text-[14px] text-ink-500">
          Wir passen diese Datenschutzerklärung an, wenn sich unsere Verarbeitungen oder die Rechtslage ändern. Es gilt die
          jeweils hier veröffentlichte Fassung. Stand: {DATENSCHUTZ_STAND}.
        </p>
      </Abschnitt>
    </div>
  );
};

export default PrivacyPolicy;
