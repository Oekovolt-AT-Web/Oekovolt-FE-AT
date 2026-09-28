// src/app/forderungen/bundesfoerderung/page.js
//
// Bundesförderung Österreich: EAG-Investitionszuschuss (OeMAG), EAG-Marktprämie,
// KPC/Klima- und Energiefonds, Energiegemeinschaften, Kombinierbarkeit.

import Link from "next/link";
import { ArrowRight, BadgeEuro, BatteryCharging, CalendarClock, ClipboardCheck, FileSignature, Gauge, PlugZap, Receipt, Ticket, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import { Checkliste, Hinweis, HowTo, Kennzahlen, PruefenMarke, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_IZ, ENERGIEGEMEINSCHAFTEN, KPC_BEENDET, KPC_PROGRAMME, MARKTPRAEMIE, OEMAG_MARKTPREIS, STAND } from "@/components/Forderungen/Shared/bund";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/forderungen/bundesfoerderung`;
const TITLE = "EAG-Investitionszuschuss 2026: PV & Speicher | Ökovolt";
const DESCRIPTION = "EAG-Investitionszuschuss 2026: Kategorien A–D, Fördersätze, Speicher 150 €/kWh, Fördercalls, Fristen und Fehler – plus Marktprämie, KPC, Energiegemeinschaften.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["EAG-Investitionszuschuss 2026", "OeMAG Fördercall 2026", "Photovoltaik Förderung Österreich", "PV Förderung Unternehmen", "Stromspeicher Förderung 2026", "EAG Marktprämie", "Förderung Energiegemeinschaft"],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "EAG-Investitionszuschuss für Photovoltaik und Speicher" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const FAQ = [
  {
    q: "Wie hoch ist der EAG-Investitionszuschuss 2026?",
    a: "Kategorie A (bis 10 kWp) erhält fix 150 €/kWp, Kategorie B (über 10 bis 20 kWp) fix 140 €/kWp. In Kategorie C (über 20 bis 100 kWp) sind höchstens 130 €/kWp, in Kategorie D (über 100 bis 1.000 kWp) höchstens 120 €/kWp möglich – dort bieten Förderwerber ihren Förderbedarf, gereiht wird vom niedrigsten Gebot an. Stromspeicher erhalten 150 €/kWh. Der Zuschuss ist auf 30 % der förderfähigen Nettokosten gedeckelt.",
  },
  {
    q: "Wann ist der nächste OeMAG-Fördercall?",
    a: "Der dritte und letzte Fördercall 2026 läuft vom 08.10. bis 22.10.2026 mit je 2 Mio. € für die Kategorien A, B, C und D. In den Kategorien A und B entscheidet die Reihenfolge des Tickets; die Ticketziehung startet am 08.10.2026 um 17 Uhr.",
  },
  {
    q: "Muss ich den Förderantrag vor der Bestellung stellen?",
    a: "Nein. Nach der EAG-Investitionszuschüsseverordnung muss der Antrag vor der Inbetriebnahme eingebracht werden – eine Bestellung oder der Baubeginn davor schaden nicht. Allerdings müssen zum Antragszeitpunkt alle nötigen Anzeigen und Genehmigungen vorliegen, und der Netzbetreiber muss die Anschlussmöglichkeit bestätigt haben.",
  },
  {
    q: "Wird ein Stromspeicher 2026 gefördert?",
    a: "Ja, mit 150 €/kWh – aber nur gemeinsam mit einer neuen oder erweiterten PV-Anlage. Der Speicher muss mindestens 0,5 kWh je kWp Modulleistung haben; gefördert werden höchstens 50 kWh je Anlage. Ein Speicher allein oder die Erweiterung eines bestehenden Speichers ist nicht förderfähig.",
  },
  {
    q: "Gibt es einen Abschlag für Freiflächen und Agri-PV?",
    a: "Für PV auf landwirtschaftlich genutzten Flächen oder im Grünland wird der Zuschuss um 25 % gekürzt. Der Abschlag entfällt u. a. auf Gebäuden, Deponien, Altlasten, Infrastrukturflächen und bei Agri-PV mit landwirtschaftlicher Hauptnutzung auf mindestens 75 % der Fläche. Agri-PV mit vertikalen Modulen oder mindestens 2 m Modulunterkante erhält sogar einen Innovationszuschlag von 30 %.",
  },
  {
    q: "Kann ich den EAG-Zuschuss mit einer Landesförderung kombinieren?",
    a: "In den Kategorien A, B und C sowie bei innovativen Anlagen ja, bis zu den beihilferechtlichen Höchstgrenzen. In Kategorie D ist eine Kombination mit Landes- oder Gemeindeförderungen ausgeschlossen. Investitionszuschuss und Marktprämie schließen einander für dieselbe Anlage aus.",
  },
  {
    q: "Investitionszuschuss oder Marktprämie – was ist für Unternehmen besser?",
    a: "Der Investitionszuschuss senkt die Anfangsinvestition einmalig und passt zu Anlagen mit hohem Eigenverbrauch. Die Marktprämie sichert für eingespeisten Strom über 20 Jahre einen Mindestwert ab (Höchstgebot 2026: 7,77 ct/kWh) und lohnt sich eher bei hoher Einspeisung, etwa bei Freiflächen. Wir rechnen für Ihre Anlage beide Varianten mit Ihrem Lastgang.",
  },
];

export default function Bundesfoerderung() {
  const kategorien = EAG_IZ.kategorien.map((k) => ({
    kat: `Kategorie ${k.id}`,
    leistung: k.leistung,
    satz: <strong className="text-ov-700">{k.satz}</strong>,
    reihung: k.reihung,
    call3: EAG_IZ.calls[2].budget[k.id],
  }));
  const calls = EAG_IZ.calls.map((c) => ({ call: `${c.nr}. Call`, zeitraum: c.zeitraum, ab: `${c.budget.A} / ${c.budget.B}`, cd: `${c.budget.C} / ${c.budget.D}`, summe: c.summe, status: c.status }));
  const mp = MARKTPRAEMIE.termine.map((t) => ({ datum: t.datum, volumen: t.volumen, preis: t.hoechstpreis, status: t.status }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Bundesförderung für Photovoltaik in Österreich 2026",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: [
      { "@type": "GovernmentService", name: "EAG-Investitionszuschuss für Photovoltaik und Stromspeicher", provider: { "@type": "Organization", name: "OeMAG Abwicklungsstelle für Ökostrom AG" }, areaServed: "AT" },
      { "@type": "GovernmentService", name: "EAG-Marktprämie für Photovoltaik", provider: { "@type": "Organization", name: "OeMAG Abwicklungsstelle für Ökostrom AG" }, areaServed: "AT" },
    ],
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Bundesförderung" }]}
        eyebrow={`EAG · OeMAG · KPC · Stand ${STAND.kurz}`}
        title={<>Bundesförderung für Photovoltaik: <span className="ov-text-gradient">EAG-Zuschuss 2026</span></>}
        lead="Der EAG-Investitionszuschuss ist die wichtigste Förderung für PV-Anlagen bis 1.000 kWp in ganz Österreich. Hier stehen Kategorien, Sätze, Fördercalls, Fristen und die Fehler, an denen Anträge scheitern – dazu Marktprämie, KPC-Programme und Energiegemeinschaften."
        image={{ src: "/Images/Referenzen/Projekte-3.jpg", alt: "Photovoltaik-Großanlage auf einem Hallendach" }}
        points={["Kategorien A–D mit Sätzen", "Speicher 150 €/kWh", "Ablauf und Fristen", "Kombination mit Land"]}
        actions={[
          { label: "Förder-Check starten", href: "/foerdercheck" },
          { label: "Zum Ablauf", href: "#ablauf", icon: ClipboardCheck },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <CalendarClock aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Nächster Call</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{EAG_IZ.naechsterCall.zeitraum}</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "150 €/kWp", label: "Kategorie A (bis 10 kWp)" },
          { wert: "120 €/kWp", label: "Kategorie D – Höchstsatz bis 1.000 kWp" },
          { wert: "150 €/kWh", label: "Speicher, max. 50 kWh" },
          { wert: "30 %", label: "Deckel der förderfähigen Nettokosten" },
        ]}
      />

      {/* Kategorien */}
      <Section tone="white" space="lg" id="kategorien">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="EAG-Investitionszuschuss"
            title="Kategorien, Fördersätze und Reihung 2026"
            lead="Die Höhe richtet sich nach der Engpassleistung der Neuanlage bzw. Erweiterung. In A und B gibt es Fixbeträge nach Eingang, in C und D ein Bieterverfahren: Wer weniger Förderung je kWp beantragt, wird vorgereiht."
          />
          <StandPille className="shrink-0 self-start md:self-auto">EAG-IZV idF BGBl. II Nr. 12/2026</StandPille>
        </div>
        <Reveal>
          <Tabelle
            caption="EAG-Investitionszuschuss Photovoltaik 2026 – Kategorien und Fördersätze"
            spalten={[
              { key: "kat", label: "Kategorie", breite: "w-[15%]" },
              { key: "leistung", label: "Engpassleistung" },
              { key: "satz", label: "Fördersatz" },
              { key: "reihung", label: "Reihung" },
              { key: "call3", label: "Budget 3. Call", breite: "w-[14%]" },
            ]}
            zeilen={kategorien}
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
            <p className="flex items-center gap-2 font-display text-[19px] font-bold text-ink-900">
              <BatteryCharging aria-hidden="true" className="h-5 w-5 text-ov-600" /> Stromspeicher: {EAG_IZ.speicher.satz}
            </p>
            <Checkliste className="mt-5" items={EAG_IZ.speicher.regeln} />
          </Reveal>
          <Reveal delay={80} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
            <p className="flex items-center gap-2 font-display text-[19px] font-bold text-ink-900">
              <Gauge aria-hidden="true" className="h-5 w-5 text-ov-600" /> Obergrenzen
            </p>
            <Checkliste className="mt-5" items={EAG_IZ.obergrenzen} />
            <p className="mt-4 text-[14px] leading-relaxed text-ink-600">{EAG_IZ.freiflaecheAuflagen}</p>
          </Reveal>
        </div>

        <div className="mt-12">
          <h3 className="ov-h3 text-ink-900">Zu- und Abschläge</h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {EAG_IZ.zuschlaege.map((z, i) => (
              <Reveal as="li" key={z.titel} delay={i * 70} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <p className="font-display text-[18px] font-bold text-ov-700">{z.titel}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{z.text}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
            Für Landwirtschaft und Freiflächen entscheiden diese Regeln über die Wirtschaftlichkeit – Details unter{" "}
            <Link href="/agri-pv" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Agri-PV</Link> und{" "}
            <Link href="/freiflaechen-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Freiflächen-Photovoltaik</Link>.
          </p>
        </div>
      </Section>

      {/* Calls */}
      <Section tone="sand" space="lg" id="foerdercalls">
        <SectionHeading
          eyebrow="Fördercalls 2026"
          title="Drei Zeitfenster, 60 Mio. € – der letzte Call im Oktober"
          lead="Die Förderstelle öffnet 2026 drei Calls. Außerhalb dieser Fenster ist kein Antrag möglich. Ist das Budget einer Kategorie ausgeschöpft, kommen weitere Anträge erst im nächsten Call zum Zug."
          className="mb-10"
        />
        <Reveal>
          <Tabelle
            dicht
            caption="OeMAG-Fördercalls 2026 für Photovoltaik und Speicher"
            spalten={[
              { key: "call", label: "Call", breite: "w-[10%]" },
              { key: "zeitraum", label: "Zeitraum" },
              { key: "ab", label: "Budget A / B" },
              { key: "cd", label: "Budget C / D" },
              { key: "summe", label: "Summe" },
              { key: "status", label: "Status" },
            ]}
            zeilen={calls}
          />
        </Reveal>
        <Hinweis titel="Tipp für Kategorie A und B" className="mt-6">
          {EAG_IZ.naechsterCall.hinweis}. Wer das Ticket früh zieht, wird früher gereiht – der Antrag selbst folgt danach mit den Unterlagen. Wir bereiten Netzbestätigung, Genehmigungsnachweise und Angebot so vor, dass Sie am ersten Tag des Calls bereit sind.
        </Hinweis>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="lg" id="ablauf" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Ablauf in 7 Schritten"
            title="So kommt der EAG-Zuschuss sicher aufs Konto"
            lead="Die Reihenfolge ist entscheidend: Netzbestätigung und Genehmigungen vor dem Antrag, Antrag vor der Inbetriebnahme, Endabrechnung innerhalb der Frist."
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="mt-6 text-[15px] leading-relaxed text-ink-600">
              Ausführlich mit Beispielrechnung im Ratgeber{" "}
              <Link href="/ratgeber/eag-investitionszuschuss" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">EAG-Investitionszuschuss Schritt für Schritt</Link>.
            </p>
          </SectionHeading>
          <HowTo
            name="EAG-Investitionszuschuss für eine Photovoltaikanlage beantragen"
            beschreibung={`Ablauf für PV-Anlagen bis 1.000 kWp in Österreich nach EAG-Investitionszuschüsseverordnung-Strom, Stand ${STAND.label}.`}
            schritte={[
              { icon: Wrench, name: "Anlage planen und Angebot einholen", text: "Ein befugtes Unternehmen plant Anlage und Speicher nach Lastgang und Dach. Das Angebot ist Grundlage für Antrag und Förderbedarf – Eigenleistungen werden nicht gefördert." },
              { icon: PlugZap, name: "Netzzugang beim Netzbetreiber beantragen", text: "Netzzugangsantrag und Einspeisezählpunkt beim Netzbetreiber. Bis 20 kW genügt eine Anzeige (§ 96 ElWG). Die Bestätigung der Anschlussmöglichkeit gehört zum Förderantrag." },
              { icon: FileSignature, name: "Genehmigungen und Anzeigen einholen", text: "Bau-, naturschutz- oder elektrizitätsrechtliche Anzeigen bzw. Bewilligungen müssen beim Antrag in erster Instanz vorliegen – welche das sind, regelt das jeweilige Bundesland." },
              { icon: Ticket, name: "Ticket ziehen und Förderantrag stellen", text: "Im Zeitfenster des Fördercalls elektronisch bei der EAG-Förderabwicklungsstelle. In Kategorie C und D den Förderbedarf in €/kWp angeben; fehlende Unterlagen binnen 4 Wochen nachreichen." },
              { icon: BadgeEuro, name: "Fördervertrag abschließen", text: "Nach positiver Entscheidung folgt der Fördervertrag. Ab jetzt läuft die Inbetriebnahmefrist: 6 Monate bis 100 kWp, 12 Monate darüber." },
              { icon: Zap, name: "Errichten, Fertigstellung melden, in Betrieb nehmen", text: "Montage und Prüfung nach ÖVE/ÖNORM E 8101 und EN 62446, Fertigstellungsmeldung an den Netzbetreiber, Aktivierung des Zählpunkts und Registrierung in der Herkunftsnachweisdatenbank." },
              { icon: Receipt, name: "Endabrechnung einreichen", text: "Spätestens 6 Monate nach Ende der Inbetriebnahmefrist mit Rechnungen und Zahlungsnachweisen (keine Barzahlung). Danach wird der Zuschuss ausbezahlt." },
            ]}
          />
        </div>
      </Section>

      {/* Fristen & Fehler */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Fristen" title="Die Termine, die über die Förderung entscheiden" />
            <dl className="mt-8 divide-y divide-ink-200 rounded-3xl bg-white ring-1 ring-ink-200/70">
              {EAG_IZ.fristen.map((f) => (
                <div key={f.titel} className="grid gap-1 px-6 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <dt className="font-semibold text-ink-900">{f.titel}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink-700">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHeading eyebrow="Typische Fehler" title="Woran Anträge in der Praxis scheitern" />
            <Checkliste variante="nein" className="mt-8" items={EAG_IZ.fehler.map((f) => ({ title: f.titel, text: f.text }))} />
          </div>
        </div>
      </Section>

      {/* Beispiel */}
      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Rechenbeispiel" title="80-kWp-Betriebsdach mit 40-kWh-Speicher" lead="Kategorie C, Gebot zum Höchstsatz, Anlage auf dem Gebäude (kein Abschlag), keine Europa-Zuschläge. Beispielwerte – die Kosten Ihres Projekts und damit der 30-%-Deckel hängen vom Angebot ab." className="mb-10" />
        <Reveal>
          <Tabelle
            dicht
            caption="Beispielrechnung EAG-Investitionszuschuss Kategorie C"
            spalten={[
              { key: "pos", label: "Position", breite: "w-[35%]" },
              { key: "rechnung", label: "Rechnung" },
              { key: "betrag", label: "Zuschuss", className: "font-display font-bold text-ov-700" },
            ]}
            zeilen={[
              { pos: "PV-Anlage 80 kWp", rechnung: "80 kWp × 130 €/kWp (Höchstsatz Kategorie C)", betrag: "10.400 €" },
              { pos: "Speicher 40 kWh", rechnung: "40 kWh × 150 €/kWh (Minimum 0,5 kWh/kWp = 40 kWh erfüllt)", betrag: "6.000 €" },
              { pos: "Summe vor Deckel", rechnung: "max. 30 % der förderfähigen Nettokosten", betrag: "bis 16.400 €" },
            ]}
          />
        </Reveal>
        <p className="mt-5 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Ein niedrigeres Gebot erhöht die Chance auf einen Zuschlag. Zusätzlich wirkt der Investitionsfreibetrag – siehe{" "}
          <Link href="/forderungen/steuerlich" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">steuerliche Vorteile für PV</Link>.
        </p>
      </Section>

      {/* Marktprämie */}
      <Section tone="sand" space="lg" id="marktpraemie" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading eyebrow="EAG-Marktprämie" title="Die Alternative für einspeisestarke Anlagen" lead={MARKTPRAEMIE.text}>
            <Checkliste className="mt-8" items={MARKTPRAEMIE.hinweise} />
          </SectionHeading>
          <div>
            <Reveal>
              <Tabelle
                dicht
                caption="Gebotstermine EAG-Marktprämie Photovoltaik 2026"
                spalten={[
                  { key: "datum", label: "Gebotstermin", breite: "w-[20%]" },
                  { key: "volumen", label: "Volumen" },
                  { key: "preis", label: "Höchstpreis" },
                  { key: "status", label: "Status" },
                ]}
                zeilen={mp}
              />
            </Reveal>
            <Reveal className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="font-display text-[17px] font-bold text-ink-900">OeMAG-Marktpreis PV 2026 (ct/kWh)</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[14.5px] sm:grid-cols-4">
                {OEMAG_MARKTPREIS.werte.map(([m, w]) => (
                  <li key={m} className="flex justify-between gap-2 border-b border-dashed border-ink-200 py-1">
                    <span className="text-ink-600">{m}</span>
                    <span className="ov-num font-semibold text-ink-900">{w}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">
                {OEMAG_MARKTPREIS.hinweis} Wie der Wert entsteht, erklärt der Ratgeber{" "}
                <Link href="/ratgeber/oemag-marktpreis" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">OeMAG-Marktpreis</Link>.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* KPC */}
      <Section tone="white" space="lg" id="kpc">
        <SectionHeading
          eyebrow="KPC & Klima- und Energiefonds"
          title="Weitere Bundesprogramme für Betriebe und Gemeinden"
          lead="Die Umweltförderung im Inland (KPC) fördert PV nur noch in Sonderfällen wie der Insellage. Wichtiger sind 2026 Programme rund um Speicher, Energiemanagement, Wärmepumpen und Energiegemeinschaften."
          className="mb-10"
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {KPC_PROGRAMME.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 3) * 70} className="flex">
              <article className="flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <p className="text-[12.5px] font-medium text-ink-500">{p.traeger}</p>
                <h3 className="mt-1 font-display text-[18px] font-bold leading-snug text-ink-900">{p.name}</h3>
                <p className="mt-3 font-semibold text-ov-700">{p.hoehe}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{p.was}</p>
                <p className="mt-auto pt-4 text-[14px] text-ink-700"><span className="font-semibold">Status:</span> {p.status}</p>
                {p.pruefen && <PruefenMarke stand={STAND.label} />}
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                  Zum Programm<span className="sr-only"> (externer Link, neues Fenster)</span>
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10">
          <h3 className="font-display text-[19px] font-bold text-ink-900">Beendet – wird aber noch oft gesucht</h3>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {KPC_BEENDET.map((b) => (
              <li key={b.name} className="rounded-2xl px-5 py-3 text-[14.5px] text-ink-600 ring-1 ring-ink-200">
                <strong className="text-ink-900">{b.name}</strong> – {b.ende}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Energiegemeinschaften */}
      <Section tone="sand" space="lg" id="energiegemeinschaften">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Energiegemeinschaften"
            title="Günstigere Netzentgelte statt Zuschuss"
            lead="Energiegemeinschaften werden nicht über Zuschüsse, sondern über reduzierte Netzentgelte und Abgabenbefreiungen gefördert. Ab 01.10.2026 gelten die Regeln des ElWG."
          >
            <Link href="/energiegemeinschaften" className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Energiegemeinschaften für Unternehmen und Gemeinden
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionHeading>
          <div>
            <Reveal>
              <Tabelle
                dicht
                caption="Reduktion des Netznutzungsentgelts (Arbeitspreis) für Energiegemeinschaften 2026"
                spalten={[
                  { key: "art", label: "Form" },
                  { key: "reduktion", label: "Reduktion", className: "font-display font-bold text-ov-700" },
                ]}
                zeilen={ENERGIEGEMEINSCHAFTEN.netzentgelt}
              />
            </Reveal>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-600">{ENERGIEGEMEINSCHAFTEN.netzentgeltHinweis}</p>
            <ul className="mt-6 grid gap-3">
              {ENERGIEGEMEINSCHAFTEN.formen.map((f) => (
                <li key={f.titel} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <p className="font-semibold text-ink-900">{f.titel}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Kombinierbarkeit */}
      <Section tone="white" space="lg" id="kombination">
        <SectionHeading eyebrow="Kombinierbarkeit" title="Was sich mit dem EAG-Zuschuss kombinieren lässt" className="mb-10" />
        <Reveal>
          <Tabelle
            caption="Kombinierbarkeit von Förderungen mit dem EAG-Investitionszuschuss"
            spalten={[
              { key: "mit", label: "Kombination", breite: "w-[32%]" },
              { key: "ok", label: "Zulässig?", breite: "w-[16%]", className: "font-display font-bold text-ink-900" },
              { key: "warum", label: "Regel" },
            ]}
            zeilen={[
              { mit: "Landes- oder Gemeindeförderung, Kategorie A–C", ok: "ja", warum: "bis zu den beihilferechtlichen Höchstgrenzen; der Abwicklungsstelle melden (§ 3 Abs. 6 und 7 EAG-IZV)" },
              { mit: "Landes- oder Gemeindeförderung, Kategorie D", ok: "nein", warum: "Kumulierungsverbot – unzulässige Mehrfachförderung ist ein Rückzahlungsgrund" },
              { mit: "EAG-Marktprämie für dieselbe Anlage", ok: "nein", warum: "entweder Investitionszuschuss oder Marktprämie" },
              { mit: "Investitionsfreibetrag (IFB)", ok: "ja", warum: "steuerliche Maßnahme, keine Förderung im Sinn der IZV; steuerfreie Zuschüsse aus öffentlichen Mitteln kürzen aber die Anschaffungskosten – steuerliche Beratung einbinden" },
              { mit: "Energiegemeinschaft (EEG/BEG)", ok: "ja", warum: "Netzentgelt-Reduktion ist keine Investitionsförderung" },
            ]}
          />
        </Reveal>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          Welche Landesprogramme in Ihrem Bundesland dazukommen, zeigen die{" "}
          <Link href="/forderungen/landesforderungen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Landesförderungen aller neun Bundesländer</Link>. Für Unternehmen lohnt der Blick auf{" "}
          <Link href="/gewerbe" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Photovoltaik für Gewerbe und Industrie</Link>, für Gemeinden auf{" "}
          <Link href="/kommunen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">PV für Gemeinden</Link>.
        </p>
      </Section>

      <SolarrechnerTeaser
        href="/foerdercheck"
        cta="Förder-Check starten"
        titel="Welche Programme passen zu Ihrem Projekt?"
        text="Bundesland, Zielgruppe und Vorhaben wählen – der Förder-Check stellt EAG-Zuschuss, Marktprämie, KPC- und Landesprogramme mit Links zusammen."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Bundesförderung – kurz beantwortet" lead={`Rechtsstand ${STAND.label}. Verbindlich sind die Sonderrichtlinien und Verordnungen der Förderstellen.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <Quellen stand={STAND.label} quellen={[...EAG_IZ.quellen, ...MARKTPRAEMIE.quellen, OEMAG_MARKTPREIS.quelle, ...ENERGIEGEMEINSCHAFTEN.quellen, ...KPC_PROGRAMME.map((p) => ({ label: `${p.traeger} – ${p.name}`, url: p.url }))]} />
      </Section>

      <Querverweise pfad="/forderungen/bundesfoerderung" />
      <CtaBand
        eyebrow="Förderantrag ohne Fristfehler"
        title="Wir bereiten Ihren EAG-Antrag für den Oktober-Call vor."
        text="Netzbestätigung, Genehmigungsnachweise, Angebot und Förderbedarf – rechtzeitig vor dem Call. Danach planen wir die Inbetriebnahme innerhalb der Frist."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
    </div>
  );
}
