// service/nachhaltigkeitsmarketing/page.js – Österreich: Nachhaltigkeitsmarketing, ausgeführt durch Solensa GmbH

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Camera, Check, Clapperboard, ExternalLink, FileBarChart, Film, Megaphone, Newspaper, PenLine, Share2, Trophy, Video, X } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import Showreel from "@/components/ServiceAT/B/Showreel";
import { SOLENSA } from "@/lib/site";

const PFAD = "/service/nachhaltigkeitsmarketing";
const TITEL = "Nachhaltigkeitsmarketing mit Solensa | Ökovolt";
const BESCHREIBUNG =
  "Video zur eigenen PV-Anlage, Imagespot, Social Media, Pressetext und ESG-Kennzahlen – umgesetzt von der Solensa GmbH, ohne Greenwashing, mit belegten Aussagen.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

// Beispielmotive für den Showreel-Rahmen (freie Fotos, keine Kundenproduktionen)
const SZENEN = [
  { bild: { src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg", alt: "Luftaufnahme eines Hotels am See mit Photovoltaik auf mehreren Dächern" }, einstellung: "Totale · Drohne", titel: "Das Dach aus der Luft", text: "Der Drohnenflug zeigt Größe und Lage der Anlage – der stärkste Einstieg für Website und Social Media." },
  { bild: { src: "/Images/AT/service-b/drohne-solarpark-1.jpg", alt: "Luftaufnahme eines Solarparks in grüner Landschaft" }, einstellung: "Kamerafahrt · Landschaft", titel: "Energie aus der Region", text: "Anlage und Umgebung in einem Bild: Wo der Strom entsteht, wird Nachhaltigkeit greifbar." },
  { bild: { src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Drohnenaufnahme von Monteuren bei der Installation von Solarmodulen" }, einstellung: "Zeitraffer · Baustelle", titel: "Von der ersten Schiene bis zum letzten Modul", text: "Der Baustellen-Zeitraffer erzählt die Montage in Sekunden – die Kamera steht vor Baubeginn." },
  { bild: { src: "/Images/AT/service-b/drohne-solarpark-3.jpg", alt: "Solarpark im warmen Gegenlicht aus der Luft" }, einstellung: "Detail · Gegenlicht", titel: "Technik, die man zeigen kann", text: "Nahaufnahmen von Modulen, Wechselrichtern und Monitoring machen die Investition sichtbar." },
  { bild: { src: "/Images/AT/service-b/drohne-solarpark-2.jpg", alt: "Gewerbedach voller Photovoltaikmodule, senkrecht von oben" }, einstellung: "Top-Shot · Geometrie", titel: "Die Fläche, die arbeitet", text: "Senkrecht von oben wird aus dem Dach ein Muster – ideal für Titel, Übergänge und Social Media." },
  { bild: { src: "/Images/AT/service-b/solarpark-abend.jpg", alt: "Solarpark im goldenen Abendlicht aus der Luft" }, einstellung: "Abschluss · Kennzahl", titel: "Die Zahl, die bleibt", text: "Erzeugte Kilowattstunden und Anteil am Strombedarf – gemessen, nicht geschönt." },
];

const FORMATE = [
  { icon: Video, titel: "Video zur eigenen PV-Anlage", text: "Drohnenflug über das Dach, Baustellen-Zeitraffer von der ersten Schiene bis zur Inbetriebnahme, Interview mit der Geschäftsführung.", format: "16:9", bild: "/Images/AT/service-b/drohne-flug.jpg" },
  { icon: Clapperboard, titel: "Nachhaltigkeits-Imagespot", text: "Kurzfilm über Ihr Unternehmen und seine Energiewende – für Website, Recruiting und Messen.", format: "16:9", bild: "/Images/AT/loesungen/tourismus-seilbahn-pv-fassade.jpg" },
  { icon: Share2, titel: "Social-Media-Content", text: "Kurzvideos, Karussells und Kennzahlen-Grafiken für LinkedIn, Instagram und Co. – im Corporate Design.", format: "9:16 · 1:1", bild: "/Images/AT/service-b/drohne-solarpark-4.jpg" },
  { icon: Newspaper, titel: "Pressemitteilung", text: "Text und Bildmaterial zur Inbetriebnahme für Regional- und Fachmedien, auf Wunsch mit Gemeinde und Partnern.", format: "Text & Bild", bild: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg" },
  { icon: FileBarChart, titel: "Einbindung in den ESG-Bericht", text: "Erzeugung, Eigenverbrauch und vermiedene Emissionen mit offengelegter Methode – für Bericht, Lieferanten-Fragebogen und Bank.", format: "Kennzahlen", bild: "/Images/AT/technik/leitwarte-netzbetrieb.jpg" },
  { icon: Trophy, titel: "Teilnahme am PV Award", text: "Unterstützung bei der Einreichung zum jährlichen Ökovolt PV Award für die besten Anlagen und Nachhaltigkeitsinvestitionen.", format: "Einreichung", bild: "/Images/AT/loesungen/agri-pv-obstbau.jpg", href: "/pv-award" },
];

const STORYBOARD = [
  { zeit: "Bei Auftragsvergabe", titel: "Wunsch nennen", text: "Wir planen Kamerastandort und Drehtage in den Bauablauf ein.", bild: "/Images/AT/service-b/besprechung-vertrag.jpg" },
  { zeit: "Während der Montage", titel: "Drehen", text: "Zeitraffer, Drohnenflüge, Interviews mit Team und Geschäftsführung.", bild: "/Images/AT/service-b/module-montage-dach.jpg" },
  { zeit: "Zur Inbetriebnahme", titel: "Veröffentlichen", text: "Pressetext, Social-Media-Paket, Veranstaltung mit Gemeinde oder Kunden.", bild: "/Images/AT/ratgeber/photovoltaik-hotel.jpg" },
  { zeit: "Nach einem Jahr", titel: "Bilanz ziehen", text: "Erste echte Ertragszahlen – die glaubwürdigste Geschichte.", bild: "/Images/AT/service-b/energieberatung-daten.jpg" },
];

const CLAIMS = [
  { aussage: "„Unsere PV-Anlage hat 2026 rund 410 MWh erzeugt – das deckte 38 % unseres Strombedarfs.“", urteil: "ja", warum: "Konkret, gemessen, mit Zeitraum (Zahlen hier nur als Beispiel)" },
  { aussage: "„Mit unserem Solarstrom vermeiden wir rechnerisch rund … t CO₂ pro Jahr (Faktor und Quelle im Anhang).“", urteil: "ja", warum: "Zulässig, wenn Methode, Emissionsfaktor und Zeitraum offengelegt sind" },
  { aussage: "„100 % Ökostrom“", urteil: "nachweis", warum: "Nur wenn Eigenerzeugung plus Bezug laut Stromkennzeichnung bzw. Herkunftsnachweisen das belegen" },
  { aussage: "„Wir sind klimaneutral“ – auf Basis von Kompensationszertifikaten", urteil: "nein", warum: "Ab 27. 9. 2026 als irreführend verboten, wenn die Aussage auf Kompensation beruht" },
  { aussage: "„Grünes Unternehmen“, „umweltfreundlich“, „nachhaltig produziert“", urteil: "nein", warum: "Allgemeine Umweltaussagen ohne anerkannte hervorragende Umweltleistung sind unzulässig" },
  { aussage: "Eigenes „Nachhaltigkeitssiegel“ oder Logo", urteil: "nein", warum: "Nachhaltigkeitssiegel müssen auf einem Zertifizierungssystem beruhen oder staatlich festgelegt sein" },
];

const URTEIL = {
  ja: { label: "Zulässig", icon: Check, klasse: "bg-ov-500 text-white", karte: "bg-white ring-ov-200" },
  nachweis: { label: "Nur mit Nachweis", icon: BadgeCheck, klasse: "bg-sun-400 text-navy-950", karte: "bg-white ring-sun-300" },
  nein: { label: "Unzulässig", icon: X, klasse: "bg-red-600 text-white", karte: "bg-white ring-ink-200/70" },
};

const FAQ = [
  {
    q: "Wer erbringt die Marketingleistungen?",
    a: "Alle Leistungen auf dieser Seite – Videoproduktion, Drohnenaufnahmen, Social-Media-Content, Pressetexte und ESG-Aufbereitung – erbringt die Solensa GmbH. Ökovolt stellt den Kontakt her, liefert Anlagendaten und koordiniert Dreharbeiten auf der Baustelle. Den Vertrag über die Marketingleistungen schließen Sie mit Solensa.",
  },
  {
    q: "Was kostet ein Video zur eigenen PV-Anlage?",
    a: "Das hängt von Umfang, Drehtagen, Drohnenflügen, Zeitraffer-Dauer und Nutzungsrechten ab. Solensa erstellt nach einem kurzen Briefing ein individuelles Angebot. Wir nennen hier bewusst keine Pauschalpreise.",
  },
  {
    q: "Wann muss ein Baustellen-Zeitraffer geplant werden?",
    a: "Vor Baubeginn. Die Kamera muss vor der ersten Montage stehen, Strom und Blickwinkel müssen geklärt sein. Wer erst während der Montage daran denkt, verpasst die spannendsten Bilder. Sagen Sie es uns deshalb am besten schon bei der Auftragsvergabe.",
  },
  {
    q: "Dürfen wir mit „klimaneutral“ werben?",
    a: "Vorsicht: Nach der EU-Richtlinie 2024/825 zur Stärkung der Verbraucher, die ab 27. September 2026 anzuwenden ist, sind Aussagen über eine neutrale oder verringerte Klimawirkung eines Produkts unzulässig, wenn sie auf Kompensation beruhen. Auch allgemeine Umweltaussagen wie „grün“ oder „umweltfreundlich“ ohne Nachweis sind verboten. Irreführende Werbung ist in Österreich zudem nach § 2 UWG unzulässig. Belegbare Zahlen zur eigenen Anlage sind die bessere Botschaft.",
  },
  {
    q: "Welche Kennzahlen eignen sich für den Nachhaltigkeitsbericht?",
    a: "Erzeugte Strommenge, Eigenverbrauchsquote, Anteil erneuerbarer Energie am Stromverbrauch und – mit offengelegter Methode – vermiedene Emissionen im Scope 2. Die Daten stammen aus dem Monitoring der Anlage; Solensa bereitet sie grafisch und textlich für Bericht, Website und Lieferantenfragebögen auf.",
  },
  {
    q: "Braucht der Drohnendreh eine Genehmigung?",
    a: "Drohnenflüge sind nach EU-Recht geregelt; je nach Drohne, Umgebung und Lage kann eine Registrierung, ein Kompetenznachweis oder eine Freigabe nötig sein – etwa nahe Flughäfen. Das klärt das Produktionsteam vor dem Dreh.",
  },
  {
    q: "Was ist der Ökovolt PV Award?",
    a: "Mit dem Ökovolt PV Award zeichnen wir jährlich Kundinnen und Kunden für besonders gelungene Anlagen und Nachhaltigkeitsinvestitionen aus. Ein Video oder eine gute Projektdokumentation ist eine starke Grundlage für die Einreichung.",
  },
];

function SolensaSiegel({ dunkel = false }) {
  return (
    <a
      href={SOLENSA.web}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${dunkel ? "ov-glass text-white hover:bg-white/15" : "bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ov-300"}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ov-500 text-white">
        <Clapperboard aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="text-left">
        <span className={`block text-[11.5px] font-semibold uppercase tracking-[0.14em] ${dunkel ? "text-ov-300" : "text-ov-700"}`}>Leistung erbracht durch</span>
        <span className="block font-display text-[16px] font-bold">
          {SOLENSA.name}
          <ExternalLink aria-hidden="true" className="ml-1.5 inline h-3.5 w-3.5 align-[-1px] opacity-60" />
        </span>
      </span>
    </a>
  );
}

export default function NachhaltigkeitsmarketingPage() {
  return (
    <div>
      <Stil />
      <JsonLd
        daten={serviceSchema({
          pfad: PFAD,
          name: "Nachhaltigkeitsmarketing zur eigenen Photovoltaikanlage",
          beschreibung: BESCHREIBUNG,
          serviceType: "Video- und Contentproduktion zu Photovoltaik und Nachhaltigkeit",
          anbieter: SOLENSA,
        })}
      />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Nachhaltigkeitsmarketing" }]}
        eyebrow={`Nachhaltigkeitsmarketing · ausgeführt durch ${SOLENSA.name}`}
        title={
          <>
            Zeigen Sie, was Ihr Dach leistet – <span className="ov-text-gradient-light">belegbar statt geschönt</span>
          </>
        }
        lead={`Ihre PV-Anlage ist eine sichtbare Investition in die Zukunft. Die ${SOLENSA.name} macht daraus Video, Imagespot, Social-Media-Content, Pressetext und ESG-Kennzahlen – mit Aussagen, die einer Prüfung standhalten. Ökovolt liefert die Anlagendaten und koordiniert den Dreh.`}
        image={{ src: "/Images/AT/service-b/filmset-kamera.jpg", alt: "Videoproduktion in einer Industriehalle mit Kamera, Licht und Monitoren" }}
        points={["Drohnenflug & Baustellen-Zeitraffer", "Nachhaltigkeits-Imagespot", "Social Media & Pressetext", "ESG-Bericht & PV Award"]}
        actions={[
          { label: "Projekt anfragen", href: "#anfrage" },
          { label: "Showreel ansehen", href: "#showreel", icon: Film },
        ]}
        aside={
          <div className="hidden lg:block">
            <SolensaSiegel dunkel />
          </div>
        }
      />

      {/* Kennzeichnung */}
      <section aria-label="Leistungserbringer" className="border-b border-ink-200/70 bg-white">
        <div className="ov-container flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between md:py-10">
          <Reveal className="max-w-3xl text-[15.5px] leading-relaxed text-ink-700">
            <p>
              <strong className="text-ink-900">Alle Marketing- und Produktionsleistungen auf dieser Seite erbringt die {SOLENSA.name}</strong>, Partnerin der Ökovolt-Gruppe für
              Digitalisierung und Nachhaltigkeitsmarketing. Ökovolt vermittelt den Kontakt, liefert Anlagen- und Ertragsdaten und koordiniert Termine auf der Baustelle.
            </p>
          </Reveal>
          <Reveal delay={80} className="shrink-0">
            <SolensaSiegel />
          </Reveal>
        </div>
      </section>

      {/* Showreel */}
      <section id="showreel" className="ov-noise relative isolate scroll-mt-24 overflow-hidden bg-[#05070c] py-20 text-white md:py-28">
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-ov-500/10 blur-[140px]" />
        <div className="ov-container">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
            <SectionHeading
              dark
              eyebrow="Showreel · Beispielmotive"
              title={
                <>
                  Ihre Anlage, <span className="ov-text-gradient-light">in Szene gesetzt</span>
                </>
              }
            />
            <Reveal delay={100}>
              <p className="ov-lead text-white/65">
                Kunden, Beschäftigte, Banken und Gemeinden wollen sehen, was ein Unternehmen tut – nicht nur lesen, was es verspricht. So könnte der Film zu Ihrer Anlage aufgebaut sein.
              </p>
            </Reveal>
          </div>
          <Reveal dir="scale" className="mt-12">
            <Showreel szenen={SZENEN} />
          </Reveal>
          <p className="mt-4 text-[12.5px] text-white/45">Standbilder: freie Beispielmotive, keine Kundenproduktionen. Produktion und Rechte liegen bei der {SOLENSA.name}.</p>
        </div>
      </section>

      {/* Formate */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Formate"
          title="Sechs Formate für Ihre Nachhaltigkeitskommunikation"
          lead="Vom Drohnenflug bis zur Kennzahl im ESG-Bericht – einzeln oder als Paket, abgestimmt auf Ihre Kanäle."
          className="mb-12"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATE.map((f, i) => {
            const Karte = (
              <>
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  <Image src={f.bild} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover opacity-90 transition-transform duration-[1400ms] group-hover:scale-[1.06]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/20" />
                  <span className="absolute left-4 top-4 rounded-md bg-black/55 px-2 py-1 font-mono text-[11.5px] font-semibold tracking-wider text-white backdrop-blur">{f.format}</span>
                  <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                    <f.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[19px] font-bold leading-snug text-ink-900">{f.titel}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{f.text}</p>
                </div>
              </>
            );
            const basis = "group ov-card-hover flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200";
            return (
              <Reveal key={f.titel} delay={i * 70}>
                {f.href ? (
                  <Link href={f.href} className={basis}>
                    {Karte}
                  </Link>
                ) : (
                  <div className={basis}>{Karte}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Storyboard */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Storyboard & Timing"
          title="Die besten Bilder entstehen, bevor das erste Modul liegt"
          lead="Ein Baustellen-Zeitraffer braucht eine fest montierte Kamera vor Baubeginn, der Drohnenflug gutes Licht und eine Flugfreigabe. Wer das Marketing schon bei der Auftragsvergabe mitdenkt, bekommt mehr Material für weniger Aufwand."
          className="mb-12"
        />
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[92px] hidden h-px bg-gradient-to-r from-transparent via-ov-300 to-transparent lg:block" />
          {STORYBOARD.map((s, i) => (
            <Reveal as="li" key={s.titel} delay={i * 100} className="relative">
              <div className="overflow-hidden rounded-2xl bg-navy-950 p-2 shadow-lg ring-1 ring-ink-200/70">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image src={s.bild} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-white">SZ {String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
              <p className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{s.zeit}</p>
              <h3 className="mt-1 font-display text-[19px] font-bold text-ink-900">{s.titel}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Green Claims */}
      <Section tone="white" space="lg" id="green-claims" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Green Claims"
              title="Werben ohne Greenwashing"
              lead="Ab 27. September 2026 ist die EU-Richtlinie 2024/825 anzuwenden. Sie verbietet unter anderem allgemeine Umweltaussagen ohne Nachweis und Klimaneutralitäts-Aussagen, die auf Kompensation beruhen. Irreführende Werbung ist in Österreich schon heute nach § 2 UWG unzulässig."
            />
            <Hinweis ton="achtung" titel="Unser Grundsatz" className="mt-8">
              <p>
                Wir kommunizieren, was gemessen ist: erzeugte Kilowattstunden, Eigenverbrauch, Anteil am Strombedarf. Aussagen zu vermiedenen Emissionen nur mit offengelegtem
                Emissionsfaktor und Zeitraum. Keine Pauschalversprechen, keine selbst erfundenen Siegel. Die rechtliche Freigabe Ihrer Werbung bleibt bei Ihnen bzw. Ihrer Rechtsberatung.
              </p>
            </Hinweis>
          </div>
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {CLAIMS.map((c, i) => {
                const u = URTEIL[c.urteil];
                return (
                  <Reveal as="li" key={c.aussage} delay={(i % 2) * 80} className={`flex flex-col rounded-3xl p-5 ring-1 ${u.karte}`}>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${u.klasse}`}>
                      <u.icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                      {u.label}
                    </span>
                    <p className="mt-3 font-display text-[16px] font-bold leading-snug text-ink-900">{c.aussage}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{c.warum}</p>
                  </Reveal>
                );
              })}
            </ul>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
              Vereinfachte Orientierung nach Richtlinie (EU) 2024/825 und § 2 UWG. Keine Rechtsberatung. Die geplante Green-Claims-Richtlinie der EU ist bisher nicht beschlossen.
            </p>
          </div>
        </div>
      </Section>

      {/* Ablauf */}
      <section className="ov-noise relative isolate overflow-hidden bg-[#05070c] py-16 text-white md:py-24">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
        <div className="ov-container">
          <SectionHeading dark eyebrow="Ablauf" title="So entsteht Ihr Nachhaltigkeitsauftritt" align="center" className="mb-14" />
          <Steps
            tone="dark"
            items={[
              { icon: Megaphone, title: "Briefing", text: "Ziele, Zielgruppen, Kanäle und Budget – gemeinsam mit Solensa." },
              { icon: PenLine, title: "Konzept", text: "Drehplan, Formate und Kernaussagen mit Claim-Check." },
              { icon: Camera, title: "Produktion", text: "Dreh auf der Baustelle und im Betrieb, Drohnenflug, Zeitraffer." },
              { icon: Film, title: "Freigabe & Veröffentlichung", text: "Schnitt, Freigabe durch Sie, Veröffentlichung und Pressearbeit." },
            ]}
          />
        </div>
      </section>

      <AnfrageSektion
        titel="Nachhaltigkeitsmarketing anfragen"
        lead={`Beschreiben Sie kurz Ihr Vorhaben. Ihre Anfrage wird zur Angebotserstellung an die ${SOLENSA.name} weitergegeben, die Ihnen ein individuelles Angebot macht.`}
        schritte={["Sie beschreiben Anlage und gewünschte Formate.", `Die ${SOLENSA.name} meldet sich für ein kurzes Briefing.`, "Sie erhalten Konzept und Angebot direkt von Solensa."]}
        formular={{
          betreff: `Nachhaltigkeitsmarketing (Ausführung ${SOLENSA.name})`,
          thema: "Sonstiges",
          titel: "Anfrage Nachhaltigkeitsmarketing",
          text: `Mit dem Absenden stimmen Sie zu, dass Ökovolt Ihre Angaben zur Angebotserstellung an die ${SOLENSA.name} weitergibt.`,
          absenden: "Anfrage senden",
          felder: [
            { name: "format", label: "Gewünschtes Format", typ: "auswahl", pflicht: true, optionen: ["Video zur PV-Anlage (Drohne, Zeitraffer)", "Nachhaltigkeits-Imagespot", "Social-Media-Content", "Pressemitteilung", "ESG-Bericht / Kennzahlen", "PV Award Einreichung", "Mehrere Formate / Paket"] },
            { name: "status", label: "Status der PV-Anlage", typ: "auswahl", pflicht: true, optionen: ["In Planung", "Beauftragt, Montage noch nicht begonnen", "In Montage", "In Betrieb"] },
            { name: "anlagengroesse", label: "Anlagengröße", typ: "zahl", einheit: "kWp", placeholder: "z. B. 500" },
            { name: "termin", label: "Wunschtermin / Anlass", placeholder: "z. B. Eröffnung im Mai, Nachhaltigkeitsbericht 2026", breit: true },
          ],
        }}
      />

      <FaqSektion items={FAQ} titel="Nachhaltigkeitsmarketing – häufige Fragen" tone="white" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Nachhaltigkeit und Kommunikation" />

      <Abschluss
        links={[
          { href: "/pv-award", art: "Unternehmen", titel: "Ökovolt PV Award" },
          { href: "/ratgeber/csrd-esg-photovoltaik", art: "Ratgeber", titel: "CSRD, ESG & Photovoltaik" },
          { href: "/technik/scada", art: "Technik", titel: "SCADA & Reporting" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnenflüge & Recht" },
          { href: "/hotellerie-tourismus", art: "Lösung", titel: "Hotellerie & Tourismus" },
          { href: "/gewerbe", art: "Lösung", titel: "Gewerbe & Industrie" },
        ]}
        quellen={[
          { titel: "Richtlinie (EU) 2024/825 – Stärkung der Verbraucher für den ökologischen Wandel", href: "https://eur-lex.europa.eu/eli/dir/2024/825/oj", hinweis: "anzuwenden ab 27. September 2026" },
          { titel: "Bundesgesetz gegen den unlauteren Wettbewerb (UWG) § 2 – Irreführende Geschäftspraktiken", href: "https://www.jusline.at/gesetz/uwg/paragraf/2" },
          { titel: `${SOLENSA.name}`, href: SOLENSA.web, hinweis: "ausführende Partnerin" },
          { titel: "Austro Control – dronespace.at", href: "https://www.dronespace.at/", hinweis: "Drohnenflüge in Österreich" },
        ]}
      />

      <CtaBand
        eyebrow={`Mit ${SOLENSA.name}`}
        title="Ihre Anlage verdient mehr als ein Foto im Geschäftsbericht."
        text={`Video, Imagespot, Social Media, Pressetext und ESG-Kennzahlen – produziert von der ${SOLENSA.name}, mit Daten aus Ihrer Anlage und ohne Greenwashing.`}
        primary={{ label: "Projekt anfragen", href: "#anfrage" }}
        secondary={{ label: "Zum PV Award", href: "/pv-award", icon: Trophy }}
      />
    </div>
  );
}
