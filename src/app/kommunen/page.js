import Link from "next/link";
import {
  Building2,
  CalendarCheck2,
  Car,
  ClipboardList,
  Droplets,
  FileCheck2,
  Flame,
  HandCoins,
  Handshake,
  Landmark,
  LineChart,
  School,
  Share2,
  Sprout,
  Users,
  Waves,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import MeldungKarte from "@/components/Kanaele/MeldungKarte";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import TechnikVerbund from "@/components/Loesungen/TechnikVerbund";
import { Fachabschnitt, Hebel, Hinweis, Kennzahlen, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";
import { actorId } from "@/lib/kanaele/activitypub";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL, FIRMA } from "@/lib/site";

export const revalidate = 300;

const PFAD = "/kommunen";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Gemeinden, Länder & Stadtwerke | Ökovolt";
const BESCHREIBUNG =
  "PV für Gemeinden: Schulen, Bauhöfe, Kläranlagen, Freibäder, Energiegemeinschaft und Vergabe nach BVergG 2026 – vom PV-Errichter der Salzburg AG.";
const HERO_BILD = "/Images/Dienstleistungen/Photovoltaik/download-2.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL, types: { "application/activity+json": [{ url: actorId("oekovolt"), title: "@oekovolt@oekovolt.com" }] } },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  other: { "fediverse:creator": "@oekovolt@oekovolt.com" },
};

const salzburgAg = FIRMA.gesellschafter.find((g) => g.name.startsWith("Salzburg AG"));

const FAQ = [
  {
    q: "Darf eine Gemeinde eine PV-Anlage direkt vergeben?",
    a: "Seit dem Vergaberechtsgesetz 2026 (BGBl. I Nr. 8/2026, in Kraft seit 1. März 2026) sind Direktvergaben bei Bauaufträgen bis zu einem geschätzten Auftragswert von 200.000 Euro zulässig, bei Liefer- und Dienstleistungsaufträgen bis zum Schwellenwert nach § 12 Abs. 1 Z 1 BVergG (2026: 140.000 Euro). Ab 50.000 Euro muss sich die Gemeinde um mindestens drei Angebote oder Preisauskünfte bemühen, und die Vergabe ist zu veröffentlichen. Ob eine PV-Anlage Bau- oder Lieferauftrag ist, hängt vom Schwerpunkt der Leistung ab.",
  },
  {
    q: "Welche Gebäude einer Gemeinde eignen sich am besten?",
    a: "Gebäude mit großen Dächern und Tagesverbrauch: Schulen und Kindergärten, Gemeindeamt, Bauhof, Feuerwehrhaus, Sporthallen, Kläranlage, Wasserversorgung und Freibad. Kläranlagen und Pumpwerke haben eine Grundlast rund um die Uhr, Freibäder ihren höchsten Verbrauch genau im Sommer. Entscheidend sind Statik, Dachzustand und Netzanschluss; das prüfen wir je Liegenschaft.",
  },
  {
    q: "Wie kann die Gemeinde ihre Bürgerinnen und Bürger beteiligen?",
    a: "Am einfachsten über eine Energiegemeinschaft, in der Haushalte und Betriebe Strom aus Gemeindeanlagen beziehen. Finanzielle Beteiligungen sind über Genossenschaften, Sale-and-lease-back-Modelle oder Nachrangdarlehen möglich; dafür gelten kapitalmarktrechtliche Vorgaben, etwa nach dem Alternativfinanzierungsgesetz. Wir liefern Anlagen- und Ertragsdaten, die rechtliche Konstruktion übernimmt Ihre Rechtsberatung.",
  },
  {
    q: "Was gilt für Gemeinden in einer Energiegemeinschaft?",
    a: "Gemeinden dürfen Mitglied, Gründerin oder Anlagenbetreiberin einer Erneuerbare-Energie-Gemeinschaft oder Bürgerenergiegemeinschaft sein. Betreibt die Gemeinde Erzeugungsanlagen in der gemeinsamen Nutzung, muss sie nach dem Elektrizitätswirtschaftsgesetz schutzbedürftigen Haushalten den Zugang zu mindestens 10 % der jährlich erzeugten Energie ermöglichen. Preise und Bedingungen legt sie selbst fest.",
  },
  {
    q: "Welche Förderungen und Mittel können Gemeinden nutzen?",
    a: "Den EAG-Investitionszuschuss für PV-Anlagen bis 1.000 kWp und Speicher, Zuschläge für innovative Anlagen wie Parkplatzüberdachungen, Mittel aus dem Kommunalinvestitionsgesetz 2025 sowie Programme für Klima- und Energie-Modellregionen und Landesförderungen. Welche Kombination zulässig ist, hängt von den beihilferechtlichen Höchstgrenzen ab; wir stellen die Varianten für Ihre Gremien zusammen.",
  },
  {
    q: "Welche Rolle spielt die Salzburg AG bei Ökovolt?",
    a: "Die Salzburg AG für Energie, Verkehr und Telekommunikation ist mit 49 % Gesellschafterin der Ökovolt Solartechnik GmbH; Ökovolt ist bevorzugter PV-Errichter des Salzburg AG Konzerns. Für Gemeinden, Länder und Stadtwerke bedeutet das Erfahrung in der Zusammenarbeit mit Landesversorgern, Netzbetreibern und öffentlichen Auftraggebern.",
  },
  {
    q: "Können wir Photovoltaik mit Notstrom für Feuerwehr und Krisenstab kombinieren?",
    a: "Ja. Mit einem inselnetzfähigen Speicher und automatischer Netztrennung bleiben Feuerwehrhaus, Gemeindeamt als Krisenstab, Wasserversorgung oder Notunterkünfte bei einem Stromausfall versorgt. Wir planen, welche Verbraucher wie lange laufen müssen – abgestimmt mit dem Blackout-Konzept der Gemeinde.",
  },
  {
    q: "Wie bleiben wir über Neuigkeiten informiert – ohne kommerzielle Plattformen?",
    a: "Unser Newsroom ist über das Fediverse erreichbar: Folgen Sie @oekovolt@oekovolt.com direkt von Ihrem Mastodon-Konto aus. Alternativ gibt es RSS-Feeds und Push-Benachrichtigungen ohne Tracking.",
  },
];

const VERGABE = [
  { art: "Direktvergabe – Bauauftrag", wert: "unter 200.000 €", hinweis: "ab 50.000 € mindestens drei Angebote oder Preisauskünfte einholen" },
  { art: "Direktvergabe – Liefer- oder Dienstleistungsauftrag", wert: "unter 140.000 € (§ 12 Abs. 1 Z 1)", hinweis: "wie oben; Schwerpunkt der Leistung entscheidet über die Einordnung" },
  { art: "Direktvergabe mit vorheriger Bekanntmachung – Bau", wert: "unter 2.000.000 €", hinweis: "Bekanntmachung, dann Verhandlung mit geeigneten Unternehmen" },
  { art: "Direktvergabe mit vorheriger Bekanntmachung – Liefer/DL", wert: "unter 140.000 €", hinweis: "für Liefer- und Dienstleistungen keine Erweiterung gegenüber der Direktvergabe" },
  { art: "Sektorenauftraggeber (z. B. Stadtwerke)", wert: "Direktvergabe Bau 200.000 €, Liefer/DL 150.000 €", hinweis: "mit Bekanntmachung: Liefer/DL 200.000 €, Bau 2.000.000 €" },
  { art: "EU-Schwellenwerte 2026/2027", wert: "Bau 5.404.000 € · Liefer/DL 216.000 € (subzentral) · Sektoren 432.000 €", hinweis: "darüber EU-weite Verfahren" },
];

export default async function KommunenPage() {
  // Ohne Kampagnenvarianten: Seite bleibt statisch (ISR), damit der Newsroom-Block gecacht wird.
  const v = zielgruppenVariante("gemeinden");
  const meldungen = (await veroeffentlichungen({ kanal: "website", kategorie: "Kommunen & Stadtwerke", limit: 3 })).slice(0, 3);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Gemeinden, Länder und Stadtwerke in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Gemeinden, Länder, Stadtwerke, Landesversorger"
        bild={HERO_BILD}
        leistungen={["Potenzialanalyse kommunaler Liegenschaften", "PV auf Schulen, Bauhöfen, Kläranlagen und Freibädern", "Energiegemeinschaft der Gemeinde", "Unterstützung bei Vergabeverfahren", "Notstrom und Blackout-Vorsorge", "Monitoring und Wartung"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gemeinden, Länder & Stadtwerke" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Photovoltaikanlagen auf Dächern einer Siedlung" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Liegenschaften bewerten lassen", href: "/angebot", icon: ClipboardList },
        ]}
        points={["Schulen, Bauhöfe, Kläranlagen, Freibäder", "Vergabe nach BVergG 2026", "Energiegemeinschaft der Gemeinde", "Salzburg AG als Gesellschafterin"]}
      />

      <Kennzahlen
        items={[
          { wert: "200.000 €", label: "Direktvergabe bei Bauaufträgen seit 1. März 2026 (Vergaberechtsgesetz 2026)" },
          { wert: "50.000 €", label: "darüber drei Angebote bzw. Preisauskünfte und Veröffentlichung der Vergabe" },
          { wert: "10 %", label: "der Erzeugung von Gemeinde-Anlagen in Energiegemeinschaften für schutzbedürftige Haushalte" },
          { wert: salzburgAg?.anteil || "49 %", label: "Anteil der Salzburg AG an der Ökovolt Solartechnik GmbH" },
        ]}
        quelle="Quellen: Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 (Regierungsvorlage 302 BlgNR XXVIII. GP); Österreichische Koordinationsstelle für Energiegemeinschaften (FAQ zum ElWG); Firmenbuch FN 375708m."
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Einsatzfelder"
          title="Wo Gemeinden am meisten gewinnen"
          lead="Kommunale Liegenschaften verbinden große Dächer mit Verbrauch zu Tageszeiten – und haben eine Vorbildfunktion. Diese Einsatzfelder bringen in Österreich die höchsten Eigenverbrauchsquoten."
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: School, title: "Schulen & Kindergärten", text: "Große Dächer, Verbrauch am Vormittag – und ein Lernthema für den Unterricht mit Live-Anzeige." },
            { icon: Landmark, title: "Gemeindeamt & Verwaltung", text: "Eigenverbrauch senken, Kosten planbar machen und bei Stromausfall als Krisenstab arbeitsfähig bleiben." },
            { icon: Flame, title: "Bauhof & Feuerwehr", text: "Werkstatt, E-Fuhrpark und Notstrom für Einsatzbereitschaft – mit Speicher und Netztrennung.", href: "/service/notstrom" },
            { icon: Droplets, title: "Kläranlage & Wasserversorgung", text: "Belüftung, Pumpen und Hochbehälter mit Grundlast rund um die Uhr – ideal für PV mit Lastmanagement." },
            { icon: Waves, title: "Freibad & Sportanlagen", text: "Umwälzung, Filter und Warmwasser laufen im Sommer auf Hochlast – genau zur Solarkurve." },
            { icon: Car, title: "Ladeinfrastruktur & Fuhrpark", text: "Ladepunkte für Gemeindefahrzeuge und Bevölkerung, gesteuert nach PV-Überschuss.", href: "/ladeinfrastruktur" },
            { icon: Share2, title: "Energiegemeinschaft", text: "Strom aus Gemeindeanlagen an Haushalte und Betriebe im Ort – mit reduzierten Netzentgelten.", href: "/energiegemeinschaften" },
            { icon: Sprout, title: "Freiflächen & Agri-PV", text: "Deponien, Schottergruben und Gemeindegründe als Solarpark – Widmung liegt in Ihrer Hand.", href: "/freiflaechen-photovoltaik" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="vergabe">
        <Fachabschnitt
          eyebrow="Vergaberecht"
          title="Vergabe nach dem BVergG 2026 – was sich für PV-Projekte geändert hat"
          lead="Mit dem Vergaberechtsgesetz 2026 hat Österreich die Direktvergabe-Grenzen dauerhaft angehoben. Für viele kommunale PV-Anlagen bis rund 200 kWp ist damit eine Direktvergabe möglich – mit mehr Pflichten zur Dokumentation."
          aside={<StandPille>In Kraft seit 1. März 2026</StandPille>}
        >
          <Tabelle
            dicht
            caption="Schwellenwerte für Direktvergaben nach dem Vergaberechtsgesetz 2026"
            spalten={[
              { key: "art", label: "Verfahren", breite: "w-[34%]" },
              { key: "wert", label: "Geschätzter Auftragswert", breite: "w-[28%]" },
              { key: "hinweis", label: "Hinweis" },
            ]}
            zeilen={VERGABE}
            fuss="Quellen: Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026 (§§ 46, 47, 213, 214 BVergG 2018 idF; Regierungsvorlage 302 BlgNR XXVIII. GP); EU-Schwellenwerte laut Rundschreiben des BMJ vom 8.1.2026. Alle Werte netto. Keine Rechtsberatung – die Wahl des Verfahrens verantwortet der Auftraggeber."
          />
          <Prosa className="mt-8">
            <p>
              <strong>Wie wir öffentliche Auftraggeber unterstützen:</strong> Schon in der Bedarfsermittlung liefern wir Ertragsprognosen,
              Dachbewertungen, Kostenschätzungen und technische Mindestanforderungen, damit Leistungsverzeichnisse realistisch sind. An
              Vergabeverfahren beteiligen wir uns nach den jeweiligen Vorgaben. Mehr im Ratgeber{" "}
              <Link href="/ratgeber/photovoltaik-gemeinde">Photovoltaik für Gemeinden</Link>.
            </p>
            <p>
              <strong>Stadtwerke und Landesversorger</strong> sind häufig Sektorenauftraggeber mit eigenen Grenzen. Für große Anlagen auf
              Mittelspannung gelten zusätzlich die Anforderungen der TOR Erzeuger – dafür setzen wir eigene Parkregler und Leitwarten ein.
            </p>
          </Prosa>
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg" id="finanzierung">
        <Fachabschnitt
          eyebrow="Förderung, Mittel & Beteiligung"
          title="Wie Gemeinden PV-Projekte finanzieren"
          lead="Gemeinden kombinieren in Österreich meist Bundesförderung nach EAG, Mittel aus dem Kommunalinvestitionsgesetz, Programme der Modellregionen und Landesförderungen – ergänzt um Bürgerbeteiligung."
        >
          <Hebel
            cols={2}
            items={[
              { icon: HandCoins, titel: "EAG-Investitionszuschuss", text: "PV bis 1.000 kWp und Speicher bis 50 kWh; 30 % Zuschlag für Parkplatzüberdachungen ab 10 Stellplätzen und gebäudeintegrierte PV. Letzter Call 2026: 8.–22. Oktober." },
              { icon: Landmark, titel: "Kommunalinvestitionsgesetz", text: "Das KIG 2025 stellt 500 Mio. € zweckgebunden für kommunale Investitionen bereit, nach der Novelle in Tranchen bis 2028 ohne gesonderten Antrag – Energieprojekte zählen dazu." },
              { icon: Sprout, titel: "KEM & KLAR!", text: "Klima- und Energie-Modellregionen sowie Klimawandel-Anpassungsregionen des Klima- und Energiefonds bündeln Beratung und Projekte über Gemeindegrenzen hinweg." },
              { icon: Users, titel: "Bürgerbeteiligung", text: "Energiegemeinschaft, Genossenschaft, Sale-and-lease-back oder Nachrangdarlehen – mit Blick auf Kapitalmarkt- und Gemeinderecht." },
            ]}
          />
          <Hinweis className="mt-8" titel="Förderkombinationen prüfen">
            Beim EAG-Investitionszuschuss sind Kombinationen mit Landes- und Gemeindeförderungen für PV-Anlagen der Kategorien A bis C und für
            innovative Anlagen im Rahmen der beihilferechtlichen Höchstgrenzen möglich; bei Kategorie D nicht. Wir stellen die Varianten für
            Gemeinderat und Prüfungsausschuss transparent zusammen. Überblick: <Link href="/forderungen/bundesfoerderung" className="text-ov-700 underline">Bundesförderung</Link> und{" "}
            <Link href="/forderungen/landesforderungen" className="text-ov-700 underline">Landesförderungen</Link>.
          </Hinweis>
        </Fachabschnitt>
      </Section>

      <Section tone="navy" space="lg" id="salzburg-ag">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Partner der Landesversorger"
            title="Bevorzugter PV-Errichter des Salzburg AG Konzerns"
            lead={`Die ${salzburgAg?.name || "Salzburg AG für Energie, Verkehr und Telekommunikation"} ist mit ${salzburgAg?.anteil || "49 %"} Gesellschafterin der ${FIRMA.name}. Aus dieser Zusammenarbeit kennen wir die Anforderungen von Landesversorgern, Netzbetreibern und öffentlichen Auftraggebern – von der Ausschreibung über den Netzanschluss bis zum Betrieb. Diese Erfahrung bringen wir in Projekte von Gemeinden, Ländern und Stadtwerken in ganz Österreich ein.`}
          />
          <Hebel
            cols={2}
            items={[
              { icon: Handshake, titel: "Kooperation", text: "Gemeinsame Projekte mit Landesversorgern und Stadtwerken – als Errichter, Planer oder Generalunternehmer." },
              { icon: Building2, titel: "Seit 2012 in Österreich", text: "Ökovolt Solartechnik GmbH mit Sitz in Ostermiething (OÖ), tätig in allen neun Bundesländern." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Technik & Betrieb"
          title="Anlagen, die Gemeinden selbst im Blick haben"
          lead="Eigene Systeme für Regelung, Fernwartung und Monitoring – mit Kennzahlen für Energiebuchhaltung, Klimaberichte und Öffentlichkeitsarbeit."
          className="mb-12"
        />
        <TechnikVerbund
          texte={{
            parkregler: "Für Freiflächen und große Dächer auf Mittelspannung: TOR-konforme Regelung am Netzverknüpfungspunkt.",
            fernwartung: "Überwachung aller Gemeindeanlagen, Störmeldung an Bauhof oder Wartungsdienst – ohne eigenes IT-Projekt.",
            scada: "Alle Liegenschaften in einer Übersicht: Erzeugung, Eigenverbrauch, CO₂-Einsparung und Energiegemeinschaft – für Gemeinderat und Bevölkerung.",
          }}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Vorgehen" title="Vom Gemeinderatsbeschluss zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardList, title: "Potenzialanalyse", text: "Liegenschaften, Verbräuche, Dächer und Netzanschlüsse bewerten – mit Prioritätenliste für Gemeinderat und Ausschüsse." },
            { icon: HandCoins, title: "Finanzierung & Förderung", text: "Investition, Eigenverbrauch, Energiegemeinschaft, EAG, KIG und Landesmittel transparent gegenübergestellt." },
            { icon: FileCheck2, title: "Vergabe & Umsetzung", text: "Unterlagen für die Vergabe, Netzanschluss, Statik, Brandschutz und Montage – abgestimmt mit Bauamt und Netzbetreiber." },
            { icon: LineChart, title: "Betrieb & Berichte", text: "Monitoring, Wartung, E-Check und Kennzahlen für Klimaschutzberichte und Bürgerinformation." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg" id="folgen" className="scroll-mt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Direkter Draht – ohne Algorithmus"
              title="Folgen Sie uns vom Gemeinde-Konto aus"
              lead="Unser Newsroom ist über Mastodon und das Fediverse erreichbar: Leitfäden, Projektberichte und Neuigkeiten zu Förderungen und Recht landen ohne Werbung und ohne Algorithmus in Ihrer Timeline."
            />
            <ul className="mt-8 grid gap-3 text-[15.5px] text-ink-700">
              {[
                "Ein Klick auf „Folgen“ genügt – kein Konto bei einer kommerziellen Plattform nötig",
                "Beiträge mit Hashtags wie #Gemeinden, #Energiegemeinschaft und #Klimaschutz",
                "Alternativ: RSS-Feed für Intranet, Gemeindezeitung oder Newsletter-Tools",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CalendarCheck2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <FolgenBox konten={["oekovolt", "ratgeber"]} pushThema="news" />
        </div>
      </Section>

      {meldungen.length > 0 && (
        <Section tone="sand" space="md">
          <SectionHeading eyebrow="Newsroom" title="Aktuelles für Gemeinden & Stadtwerke" className="mb-8" />
          <div className="grid gap-5 md:grid-cols-3">
            {meldungen.map((m) => (
              <MeldungKarte key={m.slug} m={m} />
            ))}
          </div>
        </Section>
      )}

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Vergabe, Energiegemeinschaft und Förderung" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Bürgermeister, Amtsleitung und Gremien" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Lassen Sie uns Ihre Liegenschaften gemeinsam bewerten."
        text="Erstgespräch per Video oder vor Ort – mit ersten Zahlen zu Potenzial, Wirtschaftlichkeit, Vergabeweg, Förderung und Energiegemeinschaft."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Zum Newsroom", href: "/presse?kategorie=Kommunen%20%26%20Stadtwerke", icon: Users }}
      />
    </div>
  );
}
