// uber-uns/jobs/page.js

import {
  Briefcase, CalendarCheck, ClipboardList, Compass, GraduationCap, HardHat, Headset, Leaf, Mail, MessagesSquare, Rocket, Send, ShieldCheck,
  TrendingUp, Users, Wrench, Zap,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import JobsListe from "@/components/Jobs/JobsListe";
import { bewerbungsLink, normalisiereJob } from "@/components/Jobs/jobDaten";
import { bildUrl } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.jobs_page.api.get_jobs_de`;
const JOBS_LIST_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;
const JOBS_PAGE_URL = "https://www.oekovolt.de/uber-uns/jobs";

async function fetchJobsPageData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

async function fetchJobsList() {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(JOBS_LIST_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      console.error(`Jobs API returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data?.message)) {
      return data.message;
    }
    return [];
  } catch (error) {
    console.error("Error fetching jobs list:", error);
    return [];
  }
}

export async function generateMetadata() {
  const seoData = await fetchJobsPageData();

  const defaultKeywords = [
    "Solar Jobs",
    "Photovoltaik Karriere",
    "Erneuerbare Energien Stellen",
    "Ökovolt Jobs",
    "Energiebranche Karriere",
  ];

  // Process keywords - combine API keywords with defaults if available
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const title = "Jobs & Karriere in der Photovoltaik | Ökovolt";
  const description = "Arbeiten in der Solarbranche: Karrieremöglichkeiten bei Ökovolt in Türkheim – von Montage bis Projektplanung. Jetzt informieren und Teil des Teams werden!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: JOBS_PAGE_URL, languages: hreflangLanguages(JOBS_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: JOBS_PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Jobs" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

// Vorteile: Titel aus dem Backoffice, Texte in Sie-Form (inhaltlich identisch)
const VORTEIL_TEXT = {
  "Sinnvolle Arbeit": "Sie tragen aktiv zur Energiewende bei und arbeiten an nachhaltigen Projekten mit echtem Mehrwert.",
  "Berufliche Weiterentwicklung": "Wir fördern unsere Mitarbeitenden mit Schulungen, Workshops und Weiterbildungsmöglichkeiten.",
  "Dynamisches Umfeld": "Abwechslungsreiche Aufgaben mit spannenden Herausforderungen und moderner Technik.",
  "Langfristige Perspektiven": "Erneuerbare Energien sind die Zukunft – ein Arbeitsplatz in einer wachsenden Branche.",
};
const VORTEIL_ICONS = [Leaf, GraduationCap, Zap, TrendingUp];

const FELDER = [
  { icon: Compass, title: "Planung & Projektierung", text: "Anlagen auslegen, Modulbelegung und Wirtschaftlichkeit berechnen, Projekte vom Angebot bis zur Übergabe steuern." },
  { icon: HardHat, title: "Montage & Installation", text: "Unterkonstruktion und Module auf dem Dach montieren – handwerklich, im Team und mit sichtbarem Ergebnis." },
  { icon: Wrench, title: "Technik & Wartung", text: "Wechselrichter, Speicher und Elektrik anschließen, Anlagen in Betrieb nehmen und optimieren." },
  { icon: Headset, title: "Vertrieb & Beratung", text: "Kundinnen und Kunden verständlich beraten und gemeinsam die passende Lösung finden." },
];

const ABLAUF = [
  { icon: Send, title: "Bewerbung senden", text: "Lebenslauf und ein paar Sätze zu Ihnen per E-Mail an office@oekovolt.de – ein aufwendiges Anschreiben ist nicht nötig." },
  { icon: MessagesSquare, title: "Erstes Gespräch", text: "Wir melden uns bei Ihnen und lernen uns am Telefon oder persönlich kennen." },
  { icon: Users, title: "Kennenlernen", text: "Sie lernen Team und Aufgaben kennen und stellen all Ihre Fragen – gern auch bei uns in Türkheim." },
  { icon: Rocket, title: "Start im Team", text: "Einarbeitung im Team und Schulungen, damit Sie gut in Ihre neue Aufgabe starten." },
];

const FAQ = [
  {
    q: "Kann ich mich auch ohne ausgeschriebene Stelle bewerben?",
    a: "Ja. Wir freuen uns jederzeit über Initiativbewerbungen an office@oekovolt.de. Schreiben Sie kurz, welcher Bereich Sie interessiert – Planung, Montage, Technik, Vertrieb oder Verwaltung.",
  },
  {
    q: "Brauche ich Erfahrung in der Photovoltaik?",
    a: "Nicht zwingend. Ob mit oder ohne Branchenerfahrung: Mit Schulungen und Einarbeitung im Team finden auch Quereinsteigerinnen und Quereinsteiger bei uns einen Einstieg. Handwerkliche, elektrotechnische oder kaufmännische Vorkenntnisse sind je nach Aufgabe hilfreich.",
  },
  {
    q: "Welche Unterlagen soll ich schicken?",
    a: "Ein aktueller Lebenslauf reicht für den ersten Schritt. Zeugnisse, Zertifikate oder Führerscheinangaben können Sie gern ergänzen. Am besten senden Sie alles als PDF.",
  },
  {
    q: "Wo arbeite ich bei Ökovolt?",
    a: "Unser Firmensitz ist in Türkheim im Unterallgäu. Montage- und Serviceeinsätze finden bei unseren Kundinnen und Kunden in der Region und darüber hinaus statt.",
  },
  {
    q: "Gibt es Weiterbildungsmöglichkeiten?",
    a: "Ja. Wir investieren in Schulungen, Workshops und Weiterbildung, damit Sie mit der Technik wachsen – von Speichern über Wallboxen bis zu Energiemanagementsystemen.",
  },
];

export default async function JobsPage() {
  const [data, jobsList] = await Promise.all([
    fetchJobsPageData(),
    fetchJobsList(),
  ]);

  const jobs = jobsList.map(normalisiereJob).filter((j) => j.slug);

  const jobListingSchema = jobs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${JOBS_PAGE_URL}/#joblist`,
    name: "Stellenangebote bei Ökovolt Solartechnik",
    url: JOBS_PAGE_URL,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${JOBS_PAGE_URL}/${job.slug}`,
      name: job.titel,
    })),
  } : null;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${JOBS_PAGE_URL}/#webpage`,
    url: JOBS_PAGE_URL,
    name: data?.title || "Karriere bei Ökovolt | Jobs in der Solarbranche",
    description: data?.description?.trim() || "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const vorteile = (data?.second_card_table?.length ? data.second_card_table : Object.keys(VORTEIL_TEXT).map((k) => ({ primary_paragraph: k }))).map((v, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: v.primary_paragraph,
    text: VORTEIL_TEXT[v.primary_paragraph] || v.secondary_paragraph,
  }));

  // Einleitung ohne direkte Du-Ansprache am Anfang
  const intro = (typeof data?.first_card_table === "string" ? data.first_card_table : "").replace(/^Werde Teil[^.]*\.\s*/, "");

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {jobListingSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListingSchema) }} />
      )}

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns/team" }, { name: "Jobs" }]}
        eyebrow="Karriere bei Ökovolt"
        title={<>Jobs mit Zukunft: Machen Sie die <span className="ov-text-gradient-light">Energiewende</span> zum Beruf</>}
        lead="Werden Sie Teil unseres Teams in Türkheim und gestalten Sie die Energieversorgung von morgen – in Planung, Montage, Technik oder Vertrieb."
        image={{ src: bildUrl(data?.image, "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg"), alt: data?.alt_image || "Solarmodule einer Photovoltaikanlage" }}
        points={["Firmensitz in Türkheim", "Mit oder ohne Branchenerfahrung", "Schulungen & Weiterbildung", "Zukunftsbranche Photovoltaik"]}
        actions={[
          { label: jobs.length ? "Offene Stellen ansehen" : "Jetzt bewerben", href: "#stellen" },
          { label: "Initiativ bewerben", href: bewerbungsLink(), icon: Mail },
        ]}
      />

      {/* Stellen */}
      <Section tone="sand" space="lg" id="stellen" className="scroll-mt-20">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Offene Stellen"
            title={<>Ihr nächster Job – <span className="ov-text-gradient">mit Sinn</span></>}
            lead="Alle aktuellen Stellenangebote von Ökovolt. Ein Klick zeigt Aufgaben, Anforderungen und wie Sie sich bewerben."
          />
          {intro && <p className="hidden text-[16px] leading-relaxed text-ink-600 lg:block lg:pb-1">{intro.split(/(?<=\.)\s/).slice(0, 2).join(" ")}</p>}
        </div>
        <JobsListe jobs={jobs} />
      </Section>

      {/* Vorteile */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Warum Ökovolt"
              title={<>Ihre Vorteile <span className="ov-text-gradient-light">bei Ökovolt</span></>}
              lead={data?.second_card_description?.trim() || "Wir legen großen Wert auf ein attraktives Arbeitsumfeld mit offener Kultur, Vertrauen und Teamarbeit."}
            />
            <Reveal className="mt-10 grid grid-cols-3 gap-3 border-t border-white/15 pt-8">
              {[
                { w: "15+", l: "Jahre Photovoltaik-Erfahrung" },
                { w: String(FELDER.length), l: "Tätigkeitsfelder von Technik bis Vertrieb" },
                { w: "Allgäu", l: "Firmensitz in Türkheim" },
              ].map((k) => (
                <div key={k.l}>
                  <p className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-extrabold leading-none text-white">{k.w}</p>
                  <p className="mt-2 text-[13px] leading-snug text-white/60">{k.l}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <FeatureGrid items={vorteile} cols={2} tone="dark" />
        </div>
      </Section>

      {/* Tätigkeitsfelder */}
      <Section tone="white" space="lg">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Tätigkeitsfelder"
            title={data?.fifth_card_title || "Vielfältige Karrieremöglichkeiten in der Photovoltaik"}
          />
          <div className="flex items-start gap-4 rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-200 lg:mb-1">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <p className="text-[15px] leading-relaxed text-ink-700">
              <strong className="text-ink-900">Ob mit oder ohne Erfahrung:</strong> Mit Schulungen und Teamgeist finden Sie bei uns eine sinnvolle Karriere in der Photovoltaik.
            </p>
          </div>
        </div>
        <FeatureGrid items={FELDER} cols={4} />
      </Section>

      {/* Bewerbungsprozess */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Bewerbung"
          title={<>In vier Schritten <span className="ov-text-gradient">ins Team</span></>}
          lead="Unkompliziert und persönlich – so läuft Ihre Bewerbung bei Ökovolt ab."
          align="center"
          className="mb-14"
        />
        <Steps items={ABLAUF} />
        <Reveal className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={bewerbungsLink()} className="inline-flex h-14 items-center gap-2.5 rounded-full bg-ov-500 px-8 text-[16px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition hover:bg-ov-600">
            <Mail aria-hidden="true" className="h-5 w-5" />
            Bewerbung per E-Mail senden
          </a>
          <a href="tel:+498245967880" className="inline-flex h-14 items-center gap-2.5 rounded-full bg-white px-8 text-[16px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50">
            <CalendarCheck aria-hidden="true" className="h-5 w-5 text-ov-600" />
            Vorab Fragen klären
          </a>
        </Reveal>
      </Section>

      {/* Branche */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.third_card_title || "Beruf & Perspektiven"}
          title={data?.fourth_card_title || "Arbeiten in einer zukunftssicheren Branche"}
          text={(data?.fourth_card_description || []).map((o) => o.option).slice(0, 2)}
          points={(data?.fifth_card_options_table || []).map((o) => o.option.replace(/\.$/, ""))}
          image={{ src: bildUrl(data?.third_card_first_image, "/Images/Jobs/jobs1.jpg"), alt: data?.third_card_fisrt_alt_text || "Mitarbeiter installieren eine Photovoltaikanlage" }}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Karriere bei Ökovolt"
            lead={<>Noch etwas unklar? Schreiben Sie uns an <a href={bewerbungsLink()} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">office@oekovolt.de</a> oder rufen Sie an.</>}
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/uber-uns/jobs" />
      <CtaBand
        eyebrow="Werden Sie Teil des Teams"
        title="Gestalten Sie die Energiewende mit – von Türkheim aus."
        text="Senden Sie uns Ihren Lebenslauf und ein paar Sätze zu Ihnen. Wir melden uns persönlich bei Ihnen."
        primary={{ label: "Jetzt bewerben", href: bewerbungsLink() }}
        secondary={null}
      />
    </div>
  );
}
