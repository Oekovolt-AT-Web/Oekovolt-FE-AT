import Link from "next/link";
import { FIRMA, SCHWESTER } from "@/lib/site";

/** Stand der Datenschutzerklärung – bei jeder inhaltlichen Änderung anpassen. */
export const DATENSCHUTZ_STAND = "29. September 2026";

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

const INHALT = [
  ["verantwortlicher", "Verantwortlicher und Kontakt"],
  ["grundlagen", "Rechtsgrundlagen im Überblick"],
  ["hosting", "Hosting, Server-Logdateien und Sicherheit"],
  ["cookies", "Cookies und Einwilligungsverwaltung"],
  ["statistik", "Besucherstatistik mit Google Analytics"],
  ["karten", "Karten: Google Maps und OpenStreetMap"],
  ["anfragen", "Kontaktformular, Angebots- und Serviceanfragen"],
  ["herkunft", "Herkunft Ihrer Anfrage (Kampagnen-Zuordnung)"],
  ["ip-adresse", "Speicherung der IP-Adresse bei Anfragen"],
  ["rueckruf", "Rückruf, Online-Terminbuchung und CloudTalk"],
  ["unterlagen", "Unterlagen per Smartphone, Texterkennung und KI-Auswertung"],
  ["analyse", "PDF-Analyse aus dem Solarrechner"],
  ["standort-check", "Standort-Check (Geokodierung, Höhendaten, eHORA)"],
  ["partner", "Registrierung als Elektro-Partner"],
  ["sponsoring", "Sponsoring-Anfragen"],
  ["pv-award", "Einreichungen zum Ökovolt PV Award"],
  ["bewerbung", "Bewerbungen"],
  ["kunden", "Kunden, Projekte, Monitoring und Fernwartung"],
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
          {INHALT.map(([id, titel]) => (
            <li key={id}>
              <a href={`#${id}`}>{titel}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Abschnitt id="verantwortlicher" titel="1. Verantwortlicher und Kontakt">
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

      <Abschnitt id="grundlagen" titel="2. Rechtsgrundlagen im Überblick">
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
            Missbrauchsschutz, Nachweis von Einwilligungen, Auswertung unserer Marketingmaßnahmen, Geschäftskommunikation mit
            Unternehmen. Dieser Verarbeitung können Sie nach Art. 21 DSGVO widersprechen.
          </li>
        </ul>
        <p className="mt-3">
          Eine Pflicht zur Bereitstellung Ihrer Daten besteht nicht. Ohne die als Pflichtfelder gekennzeichneten Angaben
          können wir Ihre Anfrage jedoch nicht bearbeiten.
        </p>
      </Abschnitt>

      <Abschnitt id="hosting" titel="3. Hosting, Server-Logdateien und Sicherheit">
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

      <Abschnitt id="cookies" titel="4. Cookies und Einwilligungsverwaltung">
        <p>
          Ohne Ihre Einwilligung setzen wir nur Cookies und Browserspeicher-Einträge, die unbedingt erforderlich sind, damit
          wir einen von Ihnen ausdrücklich gewünschten Dienst bereitstellen können (§ 165 Abs. 3 TKG 2021). Dazu gehört das
          Cookie „cookieConsent“, in dem Ihre Auswahl im Cookie-Banner für ein Jahr gespeichert wird, sowie einzelne Einträge
          im lokalen Speicher Ihres Browsers, die sich merken, dass Sie einen Hinweis geschlossen haben. Diese Einträge
          enthalten keine Kennungen, mit denen wir Sie wiedererkennen könnten.
        </p>
        <p>
          Alle weiteren Dienste – Google Analytics (Statistik), Google Maps und OpenStreetMap-Karten – werden erst nach Ihrer
          Einwilligung geladen. Rechtsgrundlage ist dann Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 165 Abs. 3 TKG 2021.
          Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über „Privatsphäre-Einstellungen“ bzw.
          „Cookie-Einstellungen“ im Seitenfuß ändern oder widerrufen. Zusätzlich können Sie Cookies in Ihrem Browser
          einschränken oder löschen.
        </p>
      </Abschnitt>

      <Abschnitt id="statistik" titel="5. Besucherstatistik mit Google Analytics">
        <p>
          Sofern Sie im Cookie-Banner unter „Statistik“ eingewilligt haben, nutzen wir Google Analytics 4, einen
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
      </Abschnitt>

      <Abschnitt id="karten" titel="6. Karten: Google Maps und OpenStreetMap">
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

      <Abschnitt id="anfragen" titel="7. Kontaktformular, Angebots- und Serviceanfragen">
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
          Anfragen, aus denen kein Angebot oder Auftrag entsteht, löschen wir nach zwölf Monaten. Entsteht ein Angebot oder
          Auftrag, gelten die Fristen unter Punkt 25.
        </p>
      </Abschnitt>

      <Abschnitt id="herkunft" titel="8. Herkunft Ihrer Anfrage (Kampagnen-Zuordnung)">
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
          DSGVO). Die Angaben werden gemeinsam mit der Anfrage gelöscht.
        </p>
      </Abschnitt>

      <Abschnitt id="ip-adresse" titel="9. Speicherung der IP-Adresse bei Anfragen">
        <p>
          Wenn Sie über unsere Website ein Formular absenden, speichern wir zusammen mit Ihren Angaben die IP-Adresse, von der
          aus das Formular abgesendet wurde, und den Zeitpunkt des Absendens. Die IP-Adresse dient ausschließlich dazu, Ihre
          Anfrage bzw. Einwilligung nachweisen zu können (etwa bei der Erlaubnis, Sie anzurufen) und unsere Formulare vor
          Missbrauch und automatisierten Spam-Anfragen zu schützen. Sie wird nicht an Dritte weitergegeben und nicht zu einem
          Profil zusammengeführt.
        </p>
        <p>
          Rechtsgrundlage ist unser berechtigtes Interesse an der Nachweisbarkeit von Einwilligungen und an der Sicherheit
          unserer Website (Art. 6 Abs. 1 lit. f DSGVO). Die IP-Adresse wird gemeinsam mit der Anfrage gelöscht, sobald diese
          abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
        </p>
      </Abschnitt>

      <Abschnitt id="rueckruf" titel="10. Rückruf, Online-Terminbuchung und CloudTalk">
        <p>
          Wenn Sie einen Rückruf anfordern oder einen <Link href="/termin">Beratungstermin</Link> buchen, verarbeiten wir die
          von Ihnen angegebenen Daten (Telefonnummer, Name, E-Mail-Adresse, Postleitzahl, optional Thema und Nachricht, bei
          Vor-Ort-Terminen die Adresse) sowie den gewählten Zeitpunkt. Zweck ist die Durchführung des Gesprächs oder Termins
          und die Terminbestätigung per E-Mail. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO sowie Ihre Einwilligung in den
          Anruf (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021), die Sie jederzeit widerrufen können.
        </p>
        <p>
          Erledigte Rückrufwünsche löschen wir nach 90 Tagen, Termindaten zwölf Monate nach dem Termin – es sei denn, daraus
          entsteht ein Angebot oder Auftrag. Zum Schutz vor Missbrauch nehmen wir nur Rufnummern aus Österreich, Deutschland und
          der Schweiz an und begrenzen die Zahl der Anfragen je Rufnummer.
        </p>
        <p>
          Für den automatischen Sofort-Rückruf nutzen wir den Telefoniedienst CloudTalk (CloudTalk s.r.o., Bratislava,
          Slowakei) als Auftragsverarbeiter. Dabei wird Ihre Telefonnummer an CloudTalk übermittelt, damit eine freie
          Beraterin oder ein freier Berater automatisch mit Ihnen verbunden wird; CloudTalk verarbeitet die üblichen
          Verbindungsdaten des Anrufs. Gespräche werden nicht ohne Ihre ausdrückliche, am Telefon eingeholte Einwilligung
          aufgezeichnet. Einzelheiten:{" "}
          <Ext href="https://www.cloudtalk.io/privacy-policy">Datenschutzerklärung von CloudTalk</Ext>. Die Schaltflächen
          „Zum Kalender hinzufügen“ erzeugen die Kalenderdatei in Ihrem Browser; die Seiten von Google Kalender oder Outlook
          öffnen sich erst durch Ihren Klick.
        </p>
      </Abschnitt>

      <Abschnitt id="unterlagen" titel="11. Unterlagen per Smartphone, Texterkennung und KI-Auswertung">
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
          DSGVO), die Sie jederzeit widerrufen können. Anfragen ohne Angebot oder Auftrag löschen wir nach zwölf Monaten.
        </p>
      </Abschnitt>

      <Abschnitt id="analyse" titel="12. PDF-Analyse aus dem Solarrechner">
        <p>
          Wenn Sie sich Ihre Berechnung als persönliche PDF-Analyse erstellen lassen, verarbeiten wir Ihren Namen, Ihre
          E-Mail-Adresse, optional Postleitzahl und Telefonnummer, Ihre Angaben im Rechner (Anlagengröße, Ausrichtung,
          Neigung, Stromverbrauch, Speicher) und die berechneten Ergebnisse. Das PDF wird auf unserem Server erzeugt, in
          unserem Backoffice gespeichert, Ihnen per E-Mail zugesandt und unserem Vertrieb zur Beratung bereitgestellt.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO sowie Ihre Einwilligung in die Kontaktaufnahme (Art. 6 Abs. 1 lit. a
          DSGVO). Entsteht kein Angebot oder Auftrag, löschen wir die Daten nach zwölf Monaten.
        </p>
      </Abschnitt>

      <Abschnitt id="standort-check" titel="13. Standort-Check (Geokodierung, Höhendaten, eHORA)">
        <p>
          Mit dem <Link href="/standort-check">Standort-Check</Link> schätzen Sie Schneelast, Wind, Hagelgefährdung und
          Ertrag für einen Anlagenstandort ab. Dazu verarbeiten wir die von Ihnen eingegebene Adresse bzw. den gewählten
          Kartenpunkt und die daraus ermittelten Koordinaten und Seehöhe.
        </p>
        <ul className="mt-2 space-y-1.5">
          <li>
            <strong>Geokodierung:</strong> Die Adresse wird zur Ermittlung der Koordinaten an den Suchdienst Nominatim der
            OpenStreetMap Foundation (Vereinigtes Königreich, Angemessenheitsbeschluss) bzw. an basemap.at, die
            Verwaltungsgrundkarte der österreichischen Bundesländer, übermittelt.
          </li>
          <li>
            <strong>Höhendaten:</strong> Zur Ermittlung der Seehöhe werden die Koordinaten an die Elevation-API von Open-Meteo
            (open-meteo.com) übermittelt.
          </li>
          <li>
            <strong>eHORA:</strong> Für die amtlichen Naturgefahren-Informationen (u. a. Schneelast- und Windzonen) verlinken
            wir auf{" "}
            <Ext href="https://www.hora.gv.at">eHORA (hora.gv.at)</Ext>. Die Seite öffnet sich erst durch Ihren Klick; dabei
            gelten die Datenschutzbestimmungen des Bundes.
          </li>
        </ul>
        <p className="mt-3">
          An die genannten Dienste übermitteln wir nur Adresse bzw. Koordinaten, keine Namen oder Kontaktdaten. Soweit eine
          Abfrage oder eine Kartendarstellung direkt aus Ihrem Browser erfolgt, erhält der jeweilige Anbieter zusätzlich Ihre
          IP-Adresse und technische Verbindungsdaten. Wir speichern die Standortangaben nicht, es sei denn, Sie senden uns
          anschließend eine Anfrage – dann gilt Punkt 7. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung der von
          Ihnen angeforderten Berechnung) bzw. Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </Abschnitt>

      <Abschnitt id="partner" titel="14. Registrierung als Elektro-Partner">
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
          löschen wir die Daten zwölf Monate nach unserer Entscheidung; bei einer Partnerschaft für deren Dauer und danach
          nach Maßgabe der gesetzlichen Aufbewahrungsfristen.
        </p>
      </Abschnitt>

      <Abschnitt id="sponsoring" titel="15. Sponsoring-Anfragen">
        <p>
          Über das Formular auf unserer Seite <Link href="/sponsoring">Sponsoring</Link> können Vereine, Kultur- und
          Bildungseinrichtungen sowie Organisationen eine Unterstützung anfragen. Wir verarbeiten Name der Organisation,
          Name und Kontaktdaten der Ansprechperson, Beschreibung des Vorhabens, gewünschte Leistung und beigefügte Unterlagen,
          um die Anfrage zu prüfen und zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Abgelehnte
          Anfragen löschen wir zwölf Monate nach unserer Entscheidung; bei einer Sponsoring-Vereinbarung gelten die
          gesetzlichen Aufbewahrungsfristen.
        </p>
      </Abschnitt>

      <Abschnitt id="pv-award" titel="16. Einreichungen zum Ökovolt PV Award">
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
          widerrufen können. Mit der Einreichung bestätigen Sie, dass Sie über die Rechte an den eingereichten Fotos verfügen
          und abgebildete Personen einverstanden sind. Nicht prämierte Einreichungen löschen wir zwölf Monate nach der
          Preisverleihung.
        </p>
      </Abschnitt>

      <Abschnitt id="bewerbung" titel="17. Bewerbungen">
        <p>
          Wenn Sie sich bei uns bewerben – über die Kurzbewerbung auf unserer <Link href="/uber-uns/jobs">Jobseite</Link>{" "}
          (sie öffnet Ihr E-Mail-Programm mit einer vorausgefüllten Nachricht) oder direkt per E-Mail –, verarbeiten wir Ihre
          Angaben und Unterlagen zur Durchführung des Bewerbungsverfahrens (Art. 6 Abs. 1 lit. b DSGVO). Kommt kein
          Dienstverhältnis zustande, löschen wir Ihre Daten sieben Monate nach Abschluss des Verfahrens, damit wir uns gegen
          allfällige Ansprüche nach dem Gleichbehandlungsgesetz verteidigen können (Art. 6 Abs. 1 lit. f DSGVO). Eine längere
          Aufbewahrung für künftige Stellen erfolgt nur mit Ihrer Einwilligung.
        </p>
      </Abschnitt>

      <Abschnitt id="kunden" titel="18. Kunden, Projekte, Monitoring und Fernwartung">
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

      <Abschnitt id="energiedaten" titel="19. Energiemarktdaten (Energie live)">
        <p>
          Börsenstrompreise und Erzeugungsdaten auf unserer Seite <Link href="/energie-live">Energie live</Link> und in
          einzelnen Rechnern beziehen wir serverseitig von öffentlichen Datenquellen (u. a. Energy-Charts des Fraunhofer ISE
          und aWATTar). Beim Abruf werden keine personenbezogenen Daten von Ihnen an diese Anbieter übermittelt; die
          Diagramme werden in Ihrem Browser aus den bei uns zwischengespeicherten Daten erzeugt.
        </p>
      </Abschnitt>

      <Abschnitt id="teilen" titel="20. Teilen-Funktionen und „Mit KI zusammenfassen“">
        <p>
          Unter Ratgeber-Artikeln, Pressemeldungen und Stellenanzeigen bieten wir Schaltflächen zum Teilen (z. B. LinkedIn,
          XING, WhatsApp, Facebook, X, Telegram, E-Mail) und zum Zusammenfassen mit KI-Assistenten (z. B. ChatGPT,
          Perplexity, Claude, Google, Grok). Es handelt sich um einfache Links: Beim Aufruf unserer Seite werden keine
          Skripte, Pixel oder Cookies dieser Anbieter geladen. Erst wenn Sie eine Schaltfläche anklicken, öffnet sich die
          Seite des Anbieters; dieser erhält die Adresse unserer Seite sowie die üblichen Verbindungsdaten Ihres Browsers, und
          es gelten seine Datenschutzbestimmungen. Geteilte Links enthalten Kampagnenparameter ohne personenbezogene Daten.
        </p>
      </Abschnitt>

      <Abschnitt id="push" titel="21. Push-Benachrichtigungen">
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

      <Abschnitt id="fediverse" titel="22. Fediverse-Konten, RSS-Feeds und Info-Bildschirme">
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
          technisch notwendigen Server-Logdaten verarbeitet (Punkt 3).
        </p>
      </Abschnitt>

      <Abschnitt id="hinweisgeber" titel="23. Hinweisgebersystem">
        <p>
          Hinweise auf Rechtsverletzungen nach dem HinweisgeberInnenschutzgesetz (HSchG) können Sie vertraulich und auf Wunsch
          anonym über unser Hinweisgeberportal{" "}
          <Ext href="https://oekovolt.integrityline.com/">oekovolt.integrityline.com</Ext> abgeben. Das Portal wird nicht über
          diese Website, sondern von einem spezialisierten Dienstleister als Auftragsverarbeiter betrieben. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit dem HSchG. Alle Informationen – auch zur Einschränkung von
          Betroffenenrechten und zur Aufbewahrung nach § 8 HSchG – finden Sie auf unserer Seite{" "}
          <Link href="/hinweisgeberschutz#datenschutz">Hinweisgeberschutz</Link>.
        </p>
      </Abschnitt>

      <Abschnitt id="empfaenger" titel="24. Empfänger, Auftragsverarbeiter und Drittländer">
        <p>
          Wir geben Ihre Daten nur weiter, wenn dies für die genannten Zwecke erforderlich ist, eine Rechtsgrundlage besteht
          oder Sie eingewilligt haben. Unsere Auftragsverarbeiter sind vertraglich nach Art. 28 DSGVO gebunden, insbesondere:
        </p>
        <ul className="mt-2 space-y-1">
          <li>Hosting- und IT-Dienstleister für Website und Backoffice</li>
          <li>Google Ireland Limited (Google Analytics, Google Maps – nur nach Einwilligung)</li>
          <li>CloudTalk s.r.o. (Sofort-Rückruf)</li>
          <li>Anthropic, PBC (KI-Auswertung von Unterlagen – nur nach Einwilligung)</li>
          <li>Betreiber des Hinweisgeberportals</li>
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

      <Abschnitt id="speicherdauer" titel="25. Speicherdauer">
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist; konkrete
          Fristen nennen wir in den einzelnen Abschnitten. Darüber hinaus bewahren wir Daten auf, soweit gesetzliche Pflichten
          dies verlangen – insbesondere Buchhaltungs- und Geschäftsunterlagen sieben Jahre (§ 132 BAO, § 212 UGB) – oder
          soweit dies zur Geltendmachung, Ausübung oder Abwehr von Rechtsansprüchen erforderlich ist, etwa bis zum Ablauf von
          Gewährleistungs- und Verjährungsfristen (in der Regel drei Jahre nach § 1489 ABGB, in Ausnahmefällen länger).
          Einwilligungsbasierte Daten löschen wir nach Widerruf, sofern keine andere Rechtsgrundlage besteht.
        </p>
      </Abschnitt>

      <Abschnitt id="rechte" titel="26. Ihre Rechte und Beschwerde bei der Datenschutzbehörde">
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
