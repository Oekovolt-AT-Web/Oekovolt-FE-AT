// src/app/netzanmeldung/zaehlpunkt/page.js
//
// „Zählpunkt prüfen“: Aufbau der 33-stelligen Zählpunktbezeichnung, Prüfer im
// Browser (Format, Zerlegung, Netzbetreiber-Kennung), Einspeise- gegenüber
// Bezugszählpunkt, belegte Netzbetreibernummern, HowTo- und FAQ-Schema.
// Daten: src/data/netzbetreiber.js und src/data/netzbetreiberKennungen.js.
// Datenschutz: Die Eingabe verlässt den Browser nicht (siehe ZaehlpunktPruefer).

import Link from "next/link";
import { ArrowRight, CalendarClock, FileSearch, Hash, Landmark, PlugZap, Receipt, ScanLine, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Hinweis, HowTo, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import ZaehlpunktPruefer from "@/components/Netzanmeldung/ZaehlpunktPruefer";
import { EAG_BEZUG, HINWEIS_GEWAEHR, PFAD, Q, ZAEHLPUNKT, ZAEHLPUNKT_PFAD, betreiberPfad } from "@/data/netzbetreiber";
import { DRITTLISTEN, KENNUNGEN, KENNUNGEN_STAND, KENNUNG_QUELLE_TOR } from "@/data/netzbetreiberKennungen";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}${ZAEHLPUNKT_PFAD}`;
const TITLE = "Zählpunkt prüfen: Aufbau & Netzbetreiber | Ökovolt";
const DESCRIPTION = "Zählpunktbezeichnung (33 Stellen, AT…) prüfen und zerlegen: Netzbetreiber-Kennung, Postleitzahl, Zählpunktnummer. Einspeise- oder Bezugszählpunkt? Nur im Browser, nichts wird gesendet.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Zählpunkt prüfen", "Zählpunktbezeichnung Aufbau", "Zählpunktnummer 33 Stellen", "Netzbetreiber Zählpunkt erkennen", "Einspeisezählpunkt Bezugszählpunkt Unterschied", "Zählpunkt Österreich AT"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Zählpunkt prüfen" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

const FUNDORTE = [
  { icon: Receipt, titel: "Netzrechnung oder Stromrechnung", text: "Meist auf dem Detailblatt unter „Allgemeine Daten“ oder „Zählpunkt“. Bei getrennten Rechnungen steht er auf der Rechnung des Netzbetreibers." },
  { icon: FileSearch, titel: "Netzzugangsvertrag, Zusage oder Zählpunktbrief", text: "Dort steht der Einspeisezählpunkt Ihrer PV-Anlage – die Unterlage, die der EAG-Antrag braucht." },
  { icon: Landmark, titel: "Kundenportal des Netzbetreibers", text: "Unter „Mein Vertrag“, „Zählpunkte“ oder „Datenfreigaben“; dort sehen Sie auch Nahbereichskennzeichen für Energiegemeinschaften." },
];

const SCHRITTE = [
  { icon: Receipt, name: "Bezeichnung heraussuchen", text: "Netzrechnung, Netzzugangsvertrag oder Zählpunktbrief nehmen. Die Zählernummer auf dem Gerät ist etwas anderes – sie ändert sich beim Zählertausch, der Zählpunkt nicht." },
  { icon: ScanLine, name: "Eingeben und prüfen", text: "Die 33 Stellen oben eintippen oder einfügen; Leerzeichen und Punkte sind egal. Der Prüfer zeigt Land, Netzbetreibernummer, Postleitzahl und Zählpunktnummer getrennt an." },
  { icon: Hash, name: "Netzbetreiber ablesen", text: "Die Stellen 3 bis 8 sind die Nummer des Netzbetreibers. Für belegte Kennungen zeigen wir den Namen und verlinken die Anmeldeseite – sonst steht der Name auf Ihrer Netzrechnung." },
  { icon: ShieldCheck, name: "Einspeise- oder Bezugszählpunkt klären", text: "Das sagt die Bezeichnung nicht. Für den EAG-Fördercall zählt nur der Einspeisezählpunkt aus Zusage, Angebot oder Zählpunktbrief – nicht der Bezugszählpunkt des Hausanschlusses." },
];

const FAQ = [
  {
    q: "Wie ist eine österreichische Zählpunktbezeichnung aufgebaut?",
    a: "Sie hat 33 Stellen: „AT“ als Landeskennung, dann sechs Ziffern Netzbetreibernummer (vergeben von der Verrechnungsstelle, mit führenden Nullen), fünf Ziffern Postleitzahl der Zählstelle bei der Erstvergabe und 20 Stellen Zählpunktnummer aus Großbuchstaben und Ziffern. So steht es in der TOR Stromzähler der E-Control.",
  },
  {
    q: "Woran erkenne ich meinen Netzbetreiber an der Zählpunktnummer?",
    a: "An den Stellen 3 bis 8. Wiener Netze, Netz Niederösterreich, Netz Oberösterreich, LINZ NETZ, Salzburg Netz, TINETZ, vorarlberg netz, Kärnten Netz, Energienetze Steiermark und Netz Burgenland haben jeweils eine eigene sechsstellige Nummer; kleinere Netzbetreiber ebenfalls. Nur zwei Kennungen sind an Unterlagen der Netzbetreiber selbst belegt, die übrigen stammen aus übereinstimmenden Marktpartner-Listen – im Zweifel gilt Ihre Netzrechnung.",
  },
  {
    q: "Ist der Zählpunkt dasselbe wie die Zählernummer?",
    a: "Nein. Die Zählernummer steht auf dem Gerät und ändert sich beim Zählertausch. Die Zählpunktbezeichnung bleibt dauerhaft der Zählstelle zugeordnet – auch bei Zählertausch oder geänderter Postleitzahl.",
  },
  {
    q: "Was ist der Unterschied zwischen Einspeise- und Bezugszählpunkt?",
    a: "Bezug (Entnahme) und Einspeisung werden über getrennte Zählpunkte abgerechnet. Der Bezugszählpunkt gehört zum Hausanschluss und steht auf jeder Stromrechnung. Den Einspeisezählpunkt bekommt die PV-Anlage vom Netzbetreiber – mit der Zusage, dem Angebot oder einem Zählpunktbrief. Der Bezeichnung selbst sieht man nicht an, welcher von beiden es ist.",
  },
  {
    q: "Welchen Zählpunkt braucht der EAG-Fördercall?",
    a: "Ausschließlich den Einspeisezählpunkt. Die Unterlage des Netzbetreibers muss Zählpunktinhaber, Anlagenstandort und Netzanschlussleistung zeigen. Der Bezugszählpunkt gilt nicht.",
  },
  {
    q: "Wird meine Eingabe gespeichert oder übertragen?",
    a: "Nein. Die Prüfung läuft vollständig in Ihrem Browser; die Bezeichnung wird nicht gesendet, nicht in die Adresszeile geschrieben, nicht protokolliert und löst kein Analyse-Ereignis aus. Beim Verlassen der Seite ist sie weg.",
  },
  {
    q: "Mein Zählpunkt hat keine 33 Stellen – was nun?",
    a: "Prüfen Sie, ob ein Block fehlt oder Zeichen vertauscht sind; Leerzeichen und Punkte zwischen den Blöcken sind erlaubt. Bleibt die Länge falsch, fragen Sie beim Netzbetreiber nach – er muss Ihnen die Zählpunktbezeichnung auf Verlangen binnen eines Arbeitstages nennen (§ 109 ElWG).",
  },
];

// Primärquellen der Kennungen (Unterlagen der Netzbetreiber selbst); die
// Marktpartner-Listen Dritter (DRITTLISTEN) stehen getrennt als Sekundärquellen.
const DRITT_URLS = new Set(DRITTLISTEN.map((q) => q.url));
const KENNUNG_PRIMAERQUELLEN = Array.from(
  new Map(
    KENNUNGEN.flatMap((k) => k.quellen)
      .filter((q) => !DRITT_URLS.has(q.url))
      .map((q) => [q.url, { label: q.titel, url: q.url }])
  ).values()
);

export default function ZaehlpunktPage() {
  const kennungen = [...KENNUNGEN].sort((a, b) => a.kennung.localeCompare(b.kennung));
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Zählpunkt prüfen und zerlegen",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: KENNUNGEN_STAND.iso,
    mainEntity: { "@type": "SoftwareApplication", name: "Zählpunkt-Prüfer", applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Netzanmeldung", href: PFAD }, { name: "Zählpunkt prüfen" }]}
        eyebrow={`Werkzeug · Stand ${KENNUNGEN_STAND.label}`}
        title={<>Zählpunkt <span className="ov-text-gradient-light">prüfen</span> und zerlegen</>}
        lead="33 Stellen, beginnend mit AT: Der Prüfer zeigt, ob das Format stimmt, welcher Netzbetreiber hinter den Stellen 3 bis 8 steckt und welche Postleitzahl die Zählstelle bei der Erstvergabe hatte – direkt im Browser, ohne dass etwas gesendet wird."
        points={["Format nach TOR Stromzähler", "Netzbetreiber aus der Kennung", "Nichts wird übertragen", "Einspeise- oder Bezugszählpunkt?"]}
        actions={[
          { label: "Zum Prüfer", href: "#pruefer", icon: ScanLine },
          { label: "Netzanmeldung im Überblick", href: PFAD, variant: "secondary", icon: PlugZap },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: 33, suffix: " Stellen", label: "hat jede Zählpunktbezeichnung in Österreich" },
          { value: 6, suffix: " Ziffern", label: "Netzbetreibernummer an den Stellen 3 bis 8" },
          { value: 5, suffix: " Ziffern", label: "Postleitzahl der Zählstelle bei der Erstvergabe" },
          { value: 20, suffix: " Stellen", label: "Zählpunktnummer aus Buchstaben und Ziffern" },
        ]}
      />

      {/* Prüfer */}
      <Section tone="sand" space="md" id="pruefer" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
          <ZaehlpunktPruefer betreiberBasis={PFAD} />
          <div>
            <SectionHeading eyebrow="Wo steht er?" title="Drei Fundorte für Ihre Zählpunktbezeichnung" lead="Die Zählernummer auf dem Gerät ist nicht gemeint – gesucht ist die 33-stellige Bezeichnung, die mit AT beginnt." />
            <ul className="mt-7 grid gap-3">
              {FUNDORTE.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal as="li" key={f.titel} delay={i * 80} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink-200/60">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-[16.5px] font-bold text-ink-900">{f.titel}</p>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{f.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ink-600">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
              Datenschutz: Die Eingabe bleibt in Ihrem Browser – kein Versand, kein Eintrag in der Adresszeile, keine Protokollierung, kein Analyse-Ereignis.
            </p>
          </div>
        </div>
      </Section>

      {/* Aufbau */}
      <Section tone="white" space="md" id="aufbau" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Aufbau" title={<>So liest man eine <span className="ov-text-gradient">Zählpunktbezeichnung</span></>} lead="Vier Blöcke, feste Länge, dauerhaft der Zählstelle zugeordnet – festgelegt in der TOR Stromzähler der E-Control." />
          <StandPille className="shrink-0 self-start bg-sand-50 md:self-auto">Aufbau laut TOR Stromzähler 1.0</StandPille>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ZAEHLPUNKT.aufbau.map((a, i) => (
            <Reveal as="li" key={a.teil} delay={i * 80} className="flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <span className="ov-num text-[12.5px] font-bold uppercase tracking-[0.14em] text-ov-700">
                Stellen {ZAEHLPUNKT.aufbau.slice(0, i).reduce((s, x) => s + x.stellen, 1)}–{ZAEHLPUNKT.aufbau.slice(0, i + 1).reduce((s, x) => s + x.stellen, 0)}
              </span>
              <p className="mt-2 font-display text-[19px] font-bold leading-snug text-ink-900">{a.teil}</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">
                {a.stellen} Stellen – {a.text}
              </p>
            </Reveal>
          ))}
        </ol>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {ZAEHLPUNKT.punkte.map((p) => (
            <li key={p} className="flex gap-2.5 rounded-2xl bg-white p-4 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ink-200/70">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />
              {p}
            </li>
          ))}
        </ul>
      </Section>

      {/* Anleitung + Einspeise/Bezug */}
      <Section tone="navy" space="md" id="anleitung" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading dark eyebrow="Schritt für Schritt" title="Zählpunkt finden, prüfen, richtig verwenden" lead="Vier Schritte vom Dokument bis zur Frage, die der Prüfer nicht beantworten kann: Einspeise- oder Bezugszählpunkt?" />
            <div className="mt-8 rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <p className="font-display text-[17px] font-bold text-white">{EAG_BEZUG.titel}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{EAG_BEZUG.text}</p>
              <Link href="/forderungen/eag-foerdercall" className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-300 hover:text-white">
                Zum EAG-Fördercall
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <HowTo
            name="Zählpunktbezeichnung prüfen und Netzbetreiber erkennen"
            beschreibung="So finden und prüfen Sie Ihre 33-stellige Zählpunktbezeichnung und lesen den Netzbetreiber daraus ab."
            dauer="PT3M"
            schritte={SCHRITTE}
          />
        </div>
      </Section>

      {/* Kennungen */}
      <Section tone="sand" space="md" id="kennungen" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Netzbetreibernummern" title="Belegte Kennungen der großen Netzbetreiber" lead="Stellen 3 bis 8 der Zählpunktbezeichnung. Primär belegt heißt: an einer Unterlage des Netzbetreibers selbst; sonst stammt die Zuordnung aus übereinstimmenden Marktpartner-Listen Dritter und ist beim Netzbetreiber zu prüfen." />
          <StandPille className="shrink-0 self-start bg-white md:self-auto">Geprüft am {KENNUNGEN_STAND.label}</StandPille>
        </div>
        <Tabelle
          dicht
          caption="Netzbetreibernummern in der Zählpunktbezeichnung"
          spalten={[
            { key: "kennung", label: "Kennung", breite: "w-[16%]" },
            { key: "name", label: "Netzbetreiber" },
            { key: "land", label: "Bundesland", breite: "w-[18%]" },
            { key: "beleg", label: "Beleg", breite: "w-[22%]" },
          ]}
          zeilen={kennungen.map((k) => ({
            kennung: <span className="font-mono">AT {k.kennung}</span>,
            name: k.slug ? (
              <Link href={betreiberPfad(k.slug)} className={LINK}>
                {k.name}
              </Link>
            ) : (
              k.name
            ),
            land: k.bundesland,
            beleg:
              k.beleg === "primaer" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ov-50 px-2.5 py-0.5 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-100">Unterlage des Netzbetreibers</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-300/35 px-2.5 py-0.5 text-[12.5px] font-semibold text-ink-800">Marktpartner-Listen, bitte prüfen</span>
              ),
          }))}
        />
        <Hinweis className="mt-6" titel="Kleinere Netzbetreiber">
          Österreich hat über hundert Verteilernetzbetreiber – Stadtwerke, Genossenschaften, E-Werke. Ihre Kennungen führen wir nur, wenn sie belegt sind. Fehlt Ihre Nummer, steht der Netzbetreiber auf der Netzrechnung; die vollständige Übersicht bietet die{" "}
          <a href={Q.econtrolSuche.url} target="_blank" rel="noopener noreferrer" className={LINK}>
            Netzbetreiber-Suche der E-Control
          </a>
          .
        </Hinweis>
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Zählpunkt – kurz beantwortet" lead={`Stand ${KENNUNGEN_STAND.label}. ${HINWEIS_GEWAEHR}`}>
            <Link href={PFAD} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              PV-Anlage beim Netzbetreiber anmelden
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={KENNUNGEN_STAND.label}
          quellen={[
            { label: KENNUNG_QUELLE_TOR.titel, url: KENNUNG_QUELLE_TOR.url },
            { label: Q.elwgRis.titel, url: Q.elwgRis.url },
            { label: Q.econtrolSuche.titel, url: Q.econtrolSuche.url },
            ...KENNUNG_PRIMAERQUELLEN,
            { label: Q.eagUnterlagen.titel, url: Q.eagUnterlagen.url },
          ]}
          hinweis={`${HINWEIS_GEWAEHR} Der Prüfer kontrolliert nur das Format; ob ein Zählpunkt aktiv, ein Einspeise- oder ein Bezugszählpunkt ist, weiß nur der Netzbetreiber. Keine Rechtsberatung.`}
        />
        <Hinweis className="mt-6" ton="warn" titel="Sekundärquellen (bitte prüfen)">
          Die Kennungen ohne Unterlage des Netzbetreibers stammen aus übereinstimmenden Marktpartner-Listen Dritter – nicht amtlich, ohne Gewähr:{" "}
          {DRITTLISTEN.map((q, i) => (
            <span key={q.url}>
              <a href={q.url} target="_blank" rel="noopener noreferrer" className={`${LINK} inline-block py-2`}>
                {q.titel}
                <span className="sr-only"> (externer Link, neues Fenster)</span>
              </a>
              {i < DRITTLISTEN.length - 1 ? "; " : "."}
            </span>
          ))}{" "}
          Im Zweifel gilt die Angabe auf Ihrer Netzrechnung.
        </Hinweis>
      </Section>

      <Querverweise pfad={ZAEHLPUNKT_PFAD} />
      <CtaBand
        eyebrow="Netzanmeldung aus einer Hand"
        title="Wir holen den Einspeisezählpunkt für Ihre Anlage."
        text="Netzanfrage, Zusage, Einspeisezählpunkt und Fertigmeldung: Unsere Elektrofachkräfte erledigen die Netzanmeldung beim zuständigen Netzbetreiber und bereiten die Unterlagen für den EAG-Fördercall vor."
        primary={{ label: "Anlage anfragen", href: "/angebot?objekt=gewerbe" }}
        secondary={{ label: "Beratungstermin buchen", href: "/termin?thema=gewerbe", icon: CalendarClock }}
      />
    </div>
  );
}
