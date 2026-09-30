// src/app/sponsoring/page.js
//
// Sponsoring-Engagement der Ökovolt Solartechnik GmbH in Österreich.
// Formular: src/components/Sponsoring/SponsoringAnfrage.js → /api/sponsoring

import Image from "next/image";
import {
  Ban, BookOpen, CalendarCheck2, ClipboardList, FileSignature, HandHeart, Leaf, Medal, Music, Receipt, SearchCheck, Sprout, Trophy, Users,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import SponsoringAnfrage from "@/components/Sponsoring/SponsoringAnfrage";
import SponsoringCheck from "@/components/Sponsoring/SponsoringCheck";
import { GEFOERDERTE_SICHTBAR, SPONSORING_REL } from "@/components/Sponsoring/sponsoringDaten";
import FotoKachel from "@/components/Team/FotoKachel";
import { BASE_URL, FIRMA, SITE_NAME } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/sponsoring`;
const TITEL = "Sponsoring – Vereine, Kultur & Nachwuchs | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt unterstützt Vereine, Schulen, Kultur, Nachwuchs und Umweltprojekte in Österreich. Kriterien, was wir erwarten und bieten, Ablauf und Anfrageformular.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Sponsoring von Ökovolt in Österreich" }],
  },
};

const BEREICHE = [
  { icon: Trophy, title: "Sport", text: "Breitensport und Vereinsleben – vom Fußballverein bis zur Stocksportgemeinschaft.", bild: { src: "/Images/AT/unternehmen-b/sponsoring-jugendfussball.jpg", alt: "Jugendfußballspiel auf einem Rasenplatz, Szene vor dem Tor", pos: "40% 55%" } },
  { icon: Music, title: "Kultur", text: "Musikkapellen, Theatergruppen, Feste und Kulturinitiativen in der Region.", bild: { src: "/Images/AT/unternehmen-b/sponsoring-musikkapelle-innviertel.jpg", alt: "Musikkapelle in Tracht marschiert durch einen Ort im Innviertel" } },
  { icon: BookOpen, title: "Bildung & Schulen", text: "Projekte zu Energie, Technik und Klimaschutz an Schulen und in der Lehrlingsausbildung.", bild: { src: "/Images/AT/unternehmen-b/sponsoring-schule-photovoltaik.jpg", alt: "Schülerinnen und Schüler lernen an einer Photovoltaikanlage", pos: "40% 60%" } },
  { icon: Sprout, title: "Nachwuchs & Jugend", text: "Nachwuchsmannschaften, Jugendgruppen und Ferienprogramme.", bild: { src: "/Images/AT/unternehmen-b/sponsoring-feuerwehrjugend.jpg", alt: "Jugendgruppe sitzt bei einem Zeltlager auf einer Wiese" } },
  { icon: Leaf, title: "Umwelt & Natur", text: "Naturschutz, Biodiversität und Projekte, die Energiewende vor Ort sichtbar machen.", bild: { src: "/Images/AT/unternehmen-b/sponsoring-blumenwiese-ostermiething.jpg", alt: "Mohn und Kornblume auf einer Blumenwiese" } },
  { icon: HandHeart, title: "Soziales", text: "Initiativen, die Menschen in der Gemeinde zusammenbringen und unterstützen.", bild: { src: "/Images/AT/unternehmen-b/sponsoring-feuerwehrfest.jpg", alt: "Besucherinnen und Besucher an Bierbänken in einem Festzelt", pos: "50% 40%" } },
];

const KRITERIEN = [
  { pflicht: true, titel: "Bezug zu Österreich und zur Region", text: "Vorrang haben Projekte in Österreich, insbesondere in Regionen, in denen wir Anlagen bauen und betreuen." },
  { pflicht: true, titel: "Gemeinnütziger Zweck", text: "Vereine mit ZVR-Zahl, Schulen, Gemeinden und Initiativen mit nachvollziehbarem, nicht gewinnorientiertem Zweck." },
  { titel: "Nachhaltigkeit & Nachwuchs", text: "Besonders gern unterstützen wir Projekte mit Bezug zu Energie, Umwelt, Bildung oder jungen Menschen." },
  { titel: "Transparenz", text: "Klarer Verwendungszweck, verantwortliche Ansprechperson und ein kurzer Bericht nach Abschluss." },
  { titel: "Passende Gegenleistung", text: "Sichtbarkeit in angemessenem Umfang – vom Logo auf der Website bis zur Bande am Sportplatz." },
  { titel: "Frühzeitige Anfrage", text: "Sponsoring planen wir mit Budget. Je früher die Anfrage vorliegt, desto besser können wir sie berücksichtigen." },
];

const NICHT = [
  "Politische Parteien und parteinahe Organisationen",
  "Einzelpersonen ohne Vereins- oder Projektbezug",
  "Projekte mit diskriminierenden, extremistischen oder gewaltverherrlichenden Inhalten",
  "Religiöse oder weltanschauliche Werbung",
  "Vorhaben, die ökologischen Zielen widersprechen",
];

const ERWARTEN = [
  "Eine feste Ansprechperson und verlässliche Absprachen",
  "Sichtbarkeit von Ökovolt im vereinbarten Umfang",
  "Fotos bzw. Beiträge, die wir – nach Absprache – veröffentlichen dürfen",
  "Einen kurzen Bericht, wofür die Unterstützung verwendet wurde",
];

const BIETEN = [
  "Finanzielles Sponsoring oder Sachleistungen nach Vereinbarung",
  "Vorträge und Workshops zu Energie, Photovoltaik und Energiegemeinschaften",
  "Fachliche Beratung, wenn ein Vereins- oder Schulgebäude eine PV-Anlage bekommen soll",
  "Eine schriftliche Vereinbarung mit klaren Leistungen und Gegenleistungen",
];

const ABLAUF = [
  { icon: ClipboardList, title: "Anfrage", text: "Sie beschreiben Organisation, Vorhaben, Reichweite und Zeitraum im Formular." },
  { icon: SearchCheck, title: "Prüfung", text: "Wir prüfen die Anfrage nach unseren Kriterien und dem verfügbaren Budget." },
  { icon: FileSignature, title: "Vereinbarung", text: "Bei einer Zusage halten wir Leistungen, Gegenleistungen und Zeitraum schriftlich fest." },
  { icon: Medal, title: "Umsetzung & Bericht", text: "Nach Abschluss erhalten wir einen kurzen Bericht mit Fotos zur Verwendung." },
];

const FAQ = [
  {
    q: "Wen unterstützt Ökovolt mit Sponsoring?",
    a: "Vereine, Schulen, Kulturinitiativen, Nachwuchs-, Umwelt- und Sozialprojekte in Österreich – bevorzugt in Regionen, in denen wir Anlagen bauen, und bei Vorhaben mit Bezug zu Energie, Umwelt, Bildung oder jungen Menschen.",
  },
  {
    q: "Was ist der Unterschied zwischen Sponsoring und Spende?",
    a: "Beim Sponsoring steht der Unterstützung eine Gegenleistung gegenüber, etwa Werbung oder Nennung. Eine Spende erfolgt ohne Gegenleistung; steuerlich absetzbar ist sie in Österreich nur an begünstigte Empfänger nach § 4a EStG. Wie eine Sponsorleistung beim Verein steuerlich zu behandeln ist, regeln die Vereinsrichtlinien 2001 des Finanzministeriums – im Zweifel klären Sie das mit Ihrer Steuerberatung.",
  },
  {
    q: "Welche Unterlagen brauchen Sie?",
    a: "Das Formular genügt für den ersten Schritt. Hilfreich sind ein kurzes Konzept, Angaben zur Reichweite und bei Vereinen die ZVR-Zahl aus dem Zentralen Vereinsregister. Unterlagen können Sie als Link teilen.",
  },
  {
    q: "Wie früh sollten wir anfragen?",
    a: "So früh wie möglich. Sponsoring planen wir mit einem Jahresbudget; kurzfristige Anfragen können wir nur berücksichtigen, wenn noch Mittel frei sind.",
  },
  {
    q: "Wie werden Links im Rahmen eines Sponsorings gekennzeichnet?",
    a: "Als bezahlte Links: Verlinken wir auf eine geförderte Organisation, trägt der Link das Attribut rel=\"sponsored\". Um dasselbe bitten wir, wenn Sie Ökovolt als Sponsor auf Ihrer Website verlinken. So entspricht die Nennung den Richtlinien der Suchmaschinen zu bezahlten Links.",
  },
  {
    q: "Gibt es einen Anspruch auf Unterstützung?",
    a: "Nein. Wir prüfen jede Anfrage nach denselben Kriterien, entscheiden aber im Rahmen unseres Budgets und können nicht alle Vorhaben unterstützen.",
  },
];

function Liste({ titel, punkte, icon: Icon, ton = "ov" }) {
  return (
    <Reveal className="h-full rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
      <h3 className="flex items-center gap-3 font-display text-[20px] font-extrabold tracking-tight text-ink-900">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${ton === "rot" ? "bg-red-50 text-red-700" : "bg-ov-500 text-white"}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        {titel}
      </h3>
      <ul className="mt-5 space-y-3 text-[15.5px] leading-relaxed text-ink-700">
        {punkte.map((t) => (
          <li key={t} className="flex gap-3">
            <span aria-hidden="true" className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${ton === "rot" ? "bg-red-400" : "bg-ov-500"}`} />
            {t}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function SponsoringPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: TITEL,
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
  };

  const [gross, ...klein] = BEREICHE;
  const breit = klein.pop();

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns" }, { name: "Sponsoring" }]}
        eyebrow="Sponsoring in Österreich"
        title={<>Energie für <span className="ov-text-gradient-light">Vereine, Kultur und Nachwuchs</span></>}
        lead="Ökovolt unterstützt Vereine, Schulen, Kulturinitiativen, Nachwuchs- und Umweltprojekte in Österreich – bevorzugt dort, wo wir Anlagen bauen, und dort, wo Energie, Umwelt und junge Menschen zusammenkommen."
        image={{ src: "/Images/AT/unternehmen-b/sponsoring-musikkapelle-tracht.jpg", alt: "Junge Musikerin einer Musikkapelle in Tracht spielt bei einem Umzug", position: "70% 30%" }}
        points={["Sport, Kultur, Bildung, Nachwuchs, Umwelt, Soziales", "Klare Kriterien", "Schriftliche Vereinbarung"]}
        actions={[
          { label: "Sponsoring anfragen", href: "#anfrage" },
          { label: "Passt mein Vorhaben?", href: "#kriterien", icon: ClipboardList },
        ]}
      />

      {/* Förderbereiche als Foto-Kacheln */}
      <Section tone="white" space="lg">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Bereiche" title={<>Was wir <span className="ov-text-gradient">unterstützen</span></>} />
          <p className="text-[16.5px] leading-relaxed text-ink-600">
            Unser Engagement gilt dem, was Gemeinden lebendig macht: vom Nachwuchstraining am Samstag bis zum Platzkonzert am Kirchenplatz. Sechs Bereiche stehen im Mittelpunkt.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <Reveal as="li" className="md:col-span-2 lg:row-span-2">
            <FotoKachel bild={gross.bild} icon={gross.icon} kopf="Förderbereich" titel={gross.title} text={gross.text} sizes="(max-width: 1024px) 100vw, 50vw" className="h-full min-h-[320px] lg:min-h-[600px]" />
          </Reveal>
          {klein.map((b, i) => (
            <Reveal as="li" key={b.title} delay={(i + 1) * 80}>
              <FotoKachel bild={b.bild} icon={b.icon} kopf="Förderbereich" titel={b.title} text={b.text} sizes="(max-width: 768px) 100vw, 25vw" className="h-full min-h-[230px] sm:min-h-[292px]" />
            </Reveal>
          ))}
          <Reveal as="li" className="md:col-span-2 lg:col-span-4">
            <FotoKachel bild={breit.bild} icon={breit.icon} kopf="Förderbereich" titel={breit.title} text={breit.text} sizes="100vw" className="min-h-[230px] md:min-h-[260px]" />
          </Reveal>
        </ul>
      </Section>

      {/* Kriterien als Selbstcheck */}
      <Section tone="sand" space="lg" id="kriterien" className="scroll-mt-20">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Kriterien"
            title="Passt Ihr Vorhaben? Der Schnell-Check"
            lead="Jede Anfrage prüfen wir nach denselben sechs Kriterien. Das macht Entscheidungen nachvollziehbar – auch dann, wenn wir absagen müssen."
          />
          <p className="text-[15px] leading-relaxed text-ink-600">
            <strong className="text-ink-900">Regional verwurzelt:</strong> Vom Innviertel aus sind wir in allen neun Bundesländern tätig – und dort unterstützen wir auch. Beantworten Sie die Fragen, um eine erste Orientierung zu bekommen.
          </p>
        </div>
        <SponsoringCheck kriterien={KRITERIEN} ausschluss={NICHT} />
      </Section>

      {/* Partnerschaft */}
      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Partnerschaft" title="Was wir erwarten – und was wir bieten" align="center" className="mb-12" />
        <div className="grid gap-5 lg:grid-cols-3">
          <Liste titel="Was wir erwarten" punkte={ERWARTEN} icon={Users} />
          <Liste titel="Was wir bieten" punkte={BIETEN} icon={HandHeart} />
          <Liste titel="Was wir nicht fördern" punkte={NICHT} icon={Ban} ton="rot" />
        </div>
        <Reveal className="mx-auto mt-10 flex max-w-3xl items-start gap-4 rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-200 md:p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ov-200">
            <Receipt aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="text-[15px] leading-relaxed text-ink-700">
            <strong className="text-ink-900">Sponsoring ist keine Spende:</strong> Sponsoring beruht auf Leistung und Gegenleistung. Spenden sind in Österreich nur an begünstigte Empfänger nach § 4a EStG absetzbar. Wie eine Sponsorleistung beim Verein steuerlich zu behandeln ist, regeln die Vereinsrichtlinien 2001 – im Zweifel mit Ihrer Steuerberatung klären.
          </p>
        </Reveal>
      </Section>

      {/* Aktuell unterstützt – nur freigegebene Einträge, Links als rel="sponsored" */}
      {GEFOERDERTE_SICHTBAR.length > 0 && (
        <Section tone="white" space="md" id="aktuell">
          <SectionHeading eyebrow="Aktuell unterstützt" title="Organisationen, die wir fördern" className="mb-8" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GEFOERDERTE_SICHTBAR.map((g) => (
              <li key={g.url} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <a href={g.url} target="_blank" rel={SPONSORING_REL} className="font-display text-[16.5px] font-bold text-ink-900 hover:text-ov-700">
                  {g.name}
                </a>
                <p className="mt-1 text-[14px] text-ink-600">{[g.bereich, g.ort, g.zeitraum].filter(Boolean).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Ablauf */}
      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Von der Anfrage zur Vereinbarung" align="center" className="mb-14" />
        <Steps items={ABLAUF} />
      </Section>

      {/* Anfrage */}
      <section id="anfrage" className="relative isolate scroll-mt-20 overflow-clip bg-navy-950 py-20 md:py-32">
        <Image src="/Images/AT/unternehmen-b/sponsoring-musikkapelle-innviertel.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/70" />
        <div className="ov-container grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div className="text-white lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              dark
              eyebrow="Anfrage"
              title={<>Sponsoring <span className="ov-text-gradient-light">anfragen</span></>}
              lead="Beschreiben Sie Organisation, Vorhaben und Zeitraum. Konzepte oder Unterlagen können Sie als Link teilen."
            />
            <ul className="mt-8 space-y-3 text-[15px] text-white/75">
              {["Organisation und Ansprechperson", "Vorhaben, Reichweite und Zeitraum", "Gewünschte Unterstützung und Gegenleistungen"].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="ov-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ov-500 font-display text-[13px] font-bold text-white">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[14.5px] leading-relaxed text-white/60">
              Fragen vorab?{" "}
              <a href={`mailto:${FIRMA.email}?subject=${encodeURIComponent("Sponsoring")}`} className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-white">
                {FIRMA.email}
              </a>{" "}
              oder{" "}
              <a href={FIRMA.telefonHref} className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-white">
                {FIRMA.telefon}
              </a>
            </p>
          </div>
          <Reveal dir="scale" className="rounded-[2rem] bg-white p-5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] ring-1 ring-ink-200/70 sm:p-7 md:p-9">
            <SponsoringAnfrage />
          </Reveal>
        </div>
      </section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Sponsoring bei Ökovolt" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/sponsoring" />
      <CtaBand
        eyebrow="Energie für Ihren Verein"
        title="Das Vereinsheim mit eigener PV-Anlage? Wir beraten Sie."
        text="Viele Vereine und Gemeinden senken ihre Energiekosten mit Photovoltaik – oft gemeinsam in einer Energiegemeinschaft. Wir zeigen, was an Ihrem Standort möglich ist."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: "/termin", icon: CalendarCheck2 }}
      />
    </div>
  );
}
