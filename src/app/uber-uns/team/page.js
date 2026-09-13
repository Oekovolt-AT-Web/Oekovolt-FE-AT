// uber-uns/team/page.js

import {
  Briefcase, Calculator, ClipboardList, GraduationCap, HandHeart, HardHat, Headset, Leaf, Mail, MessagesSquare, Phone, PlugZap,
  ShieldCheck, Sparkles, TrendingUp, Users, Wrench,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Fliesstext from "@/components/Reusable/Fliesstext";
import TeamKarte, { normalisiereMitglied } from "@/components/Team/TeamKarte";
import FirmenTimeline from "@/components/Team/FirmenTimeline";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import { bildUrl, normalisiereProjekt } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.team_page.api.get_team_page`;
const TEAM_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.team.api.teamde_data`;
const PAGE_URL = "https://www.oekovolt.de/uber-uns/team";

async function fetchTeamData() {
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

// Teammitglieder serverseitig laden (vorher nur clientseitig über /api/team)
async function fetchTeamMitglieder() {
  if (!isApiConfigured()) return [];
  try {
    const res = await fetch(TEAM_URL, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.message) ? data.message.filter((p) => !p?.status || p.status === "Aktiv") : [];
  } catch (error) {
    console.error("Error fetching team:", error);
    return [];
  }
}

export async function generateMetadata() {
  const seoData = await fetchTeamData();

  const defaultKeywords = ["Ökovolt Team", "Photovoltaik Experten", "Solar Fachleute", "Energieberater Team", "PV-Installateure"];

  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = "Unser Team – die Photovoltaik-Experten | Ökovolt";
  const description = "Lernen Sie das Ökovolt-Team kennen: erfahrene Photovoltaik-Experten aus Türkheim – von der Planung bis zur Montage Ihrer Solaranlage mit Leidenschaft dabei.";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Team" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/og-image.jpg"]
    },
  };
}

// Werte – abgeleitet aus den Texten der Team-Seite im Backoffice
const WERTE = [
  { icon: ShieldCheck, title: "Qualität", text: "Saubere, wirtschaftliche und langlebige Solaranlagen – geplant mit moderner Technik und ausgeführt mit Sorgfalt." },
  { icon: MessagesSquare, title: "Persönliche Beratung", text: "Ein fester Ansprechpartner von der ersten Frage bis zur Inbetriebnahme – verständlich, ehrlich und erreichbar." },
  { icon: HandHeart, title: "Alles aus einer Hand", text: "Planung, Montage, Anmeldung und Service: Bei uns ziehen Technik, Vertrieb und Kundenservice an einem Strang." },
  { icon: Leaf, title: "Nachhaltigkeit", text: "Jede Anlage ist ein Beitrag zur Energiewende – ökologisch sinnvoll und wirtschaftlich überzeugend." },
];

// Rollen im Team – laut Team-Seite im Backoffice
const ROLLEN = [
  { icon: Headset, title: "Kundenberatung & Vertrieb", text: "Hört zu, klärt Ihre Ziele und erstellt ein Angebot, das zu Dach, Verbrauch und Budget passt." },
  { icon: ClipboardList, title: "Projektleitung", text: "Koordiniert Termine, Material und Gewerke – und hält Sie während des Projekts auf dem Laufenden." },
  { icon: Calculator, title: "Planung & Ingenieure", text: "Modulbelegung, Statik, Wechselrichter und Speicher – digital geplant und wirtschaftlich durchgerechnet." },
  { icon: HardHat, title: "Solartechnik & Montage", text: "Montiert Unterkonstruktion und Module fachgerecht auf Ziegel-, Flach- und Blechdächern." },
  { icon: PlugZap, title: "Elektrofachkräfte", text: "Anschluss von Wechselrichter, Speicher und Wallbox sowie die Inbetriebnahme Ihrer Anlage." },
  { icon: Briefcase, title: "Kaufmännisches Team", text: "Kümmert sich um Unterlagen, Anmeldung beim Netzbetreiber und im Marktstammdatenregister." },
];

const KARRIERE_ICONS = [GraduationCap, Users, TrendingUp, Sparkles];

export default async function TeamPage() {
  const [data, mitgliederRoh, projekteRoh] = await Promise.all([fetchTeamData(), fetchTeamMitglieder(), ladeProjekte()]);
  const mitglieder = mitgliederRoh.map(normalisiereMitglied).filter((m) => m.name);
  const projekte = projekteRoh.map(normalisiereProjekt).filter((p) => p.slug);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Unser Team | Ökovolt Deutschland",
    description: data?.description?.trim() || "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    ...(mitglieder.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        itemListElement: mitglieder.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Person", name: m.name, ...(m.rolle && { jobTitle: m.rolle }), worksFor: { "@id": "https://www.oekovolt.de/#organization" } },
        })),
      },
    }),
  };

  const introText = (data?.first_card_table || []).map((o) => o.option).join("\n\n").replace(" ,.um", ", um").replace(",.um", ", um");

  const karriere = (data?.second_card_table || []).map((o, i) => ({
    icon: KARRIERE_ICONS[i % KARRIERE_ICONS.length],
    title: o.primary_paragraph,
    text: o.secondary_paragraph,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns/team" }, { name: "Team" }]}
        eyebrow={data?.title || "Der Photovoltaik-Komplettanbieter"}
        title={<>Das Team hinter <span className="ov-text-gradient">Ihrer Solaranlage</span></>}
        lead={data?.description?.trim() || "Ein starkes Team sorgt für die erfolgreiche Umsetzung Ihres Projekts – mit Erfahrung, Leidenschaft und Know-how."}
        image={{ src: bildUrl(data?.image, "/Images/Team/solar-power-6860359_1280.jpg"), alt: data?.alt_image || "Photovoltaik-Team montiert Solarmodule auf einem Dach" }}
        points={["Fachbetrieb aus Türkheim", "Über 15 Jahre Erfahrung", "Planung, Montage & Anmeldung", "Fester Ansprechpartner"]}
        actions={[
          { label: "Beratung anfragen", href: "/angebot" },
          { label: "Offene Stellen", href: "/uber-uns/jobs", icon: Briefcase },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Users aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                15+ <span className="text-[14px] font-semibold text-ink-500">Jahre</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Photovoltaik-Erfahrung aus dem Allgäu</p>
            </div>
          </div>
        }
      />

      {/* Werte */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Wofür wir stehen"
          title={<>Vier Werte, <span className="ov-text-gradient">ein Anspruch</span></>}
          lead="Hinter jeder erfolgreichen Photovoltaikanlage steht ein engagiertes Team. Diese Grundsätze prägen, wie wir mit Ihnen und miteinander arbeiten."
          align="center"
          className="mb-12"
        />
        <FeatureGrid items={WERTE} cols={4} />
      </Section>

      {/* Wer wir sind */}
      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow={data?.first_card_title || "Unser Team"}
          title={data?.first_card_subtitle || "Gemeinsam für eine nachhaltige Zukunft"}
          image={{ src: bildUrl(data?.second_card_image, "/Images/Team/in-diverse-workspace-project-manager-presents-eco-2025-01-08-23-29-22-utc-1.jpg"), alt: data?.second_card_alt_text || "Projektbesprechung im Ökovolt-Team" }}
        >
          <Fliesstext text={introText} className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-600" />
        </SplitMedia>
      </Section>

      {/* Team / Rollen */}
      <Section tone="white" space="lg" id="team">
        {mitglieder.length > 0 ? (
          <>
            <SectionHeading eyebrow="Ansprechpartner" title="Die Menschen bei Ökovolt" lead="Persönlich statt anonym: Diese Kolleginnen und Kollegen begleiten Ihr Projekt." className="mb-12" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mitglieder.map((m, i) => (
                <Reveal as="li" key={`${m.name}-${i}`} delay={(i % 4) * 80}>
                  <TeamKarte m={m} />
                </Reveal>
              ))}
            </ul>
          </>
        ) : null}

        <div className={mitglieder.length > 0 ? "mt-20" : ""}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Wer an Ihrer Anlage arbeitet"
                title="Ein interdisziplinäres Team – ein Ziel"
                lead="Von Solaranlagen-Technikern über Ingenieure, Elektriker und Projektleiter bis zu kaufmännischen Fachkräften: Jeder bringt seine Stärken in Ihr Projekt ein."
              />
              <Reveal className="mt-8 rounded-3xl bg-navy-950 p-6 text-white md:p-7">
                <p className="text-[13px] font-medium text-white/60">Ihr direkter Draht ins Team</p>
                <a href="tel:+498245967880" className="group mt-2 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:scale-110">
                    <Phone aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[22px] font-extrabold tracking-tight">08245 96 788 0</span>
                </a>
                <a href="mailto:office@oekovolt.de" className="mt-3 flex items-center gap-3 text-[15px] text-white/80 hover:text-white">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Mail aria-hidden="true" className="h-5 w-5" />
                  </span>
                  office@oekovolt.de
                </a>
                <p className="mt-4 border-t border-white/10 pt-4 text-[13.5px] text-white/55">Mo–Do 8–16 Uhr · Fr 8–13 Uhr</p>
              </Reveal>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {ROLLEN.map((r, i) => (
                <Reveal as="li" key={r.title} delay={(i % 2) * 90} className="group ov-card-hover relative rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                      <r.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <span aria-hidden="true" className="ov-num font-display text-[30px] font-extrabold leading-none text-ink-200">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="ov-h3 mt-5 text-ink-900">{r.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{r.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Zeitleiste */}
      {projekte.length > 0 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
          <SectionHeading
            dark
            eyebrow="Unsere Geschichte in Projekten"
            title={<>Gewachsen <span className="ov-text-gradient-light">Dach für Dach</span></>}
            lead="Die Zeitleiste zeigt belegte Stationen: unseren Firmensitz in Türkheim und die Baujahre der Referenzprojekte aus unserer Projektdatenbank."
            align="center"
            className="mb-14 md:mb-20"
          />
          <FirmenTimeline projekte={projekte} />
          <div className="mt-14 flex justify-center">
            <Button href="/referenzen/projekte" variant="outlineLight" pfeil>
              Alle Referenzprojekte ansehen
            </Button>
          </div>
        </Section>
      )}

      {/* Arbeitsweise */}
      <Section tone="white" space="lg">
        <SplitMedia
          reverse
          eyebrow="So arbeiten wir"
          title={data?.third_card_title || "Gemeinsam die Zukunft gestalten"}
          text={data?.third_card_card_description?.trim() || "Wir begleiten unsere Kunden ganzheitlich: von der ersten Beratung über die technische Planung bis hin zur Umsetzung und langfristigen Betreuung."}
          points={(data?.third_card_options_table || []).map((o) => o.option.replace(/\.$/, ""))}
          image={{ src: bildUrl(data?.third_card_image, "/Images/Referenzen/referenzkarte3.jpg"), alt: data?.third_card_alt_text || "Ökovolt-Team installiert Solarmodule auf einem Dach" }}
        >
          {data?.third_card_description && (
            <details className="group mt-6">
              <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800 [&::-webkit-details-marker]:hidden">
                <Wrench aria-hidden="true" className="h-4 w-4" />
                <span className="group-open:hidden">Mehr über unser Selbstverständnis</span>
                <span className="hidden group-open:inline">Weniger anzeigen</span>
              </summary>
              <Fliesstext text={data.third_card_description} className="mt-4 space-y-4 text-[16px] leading-relaxed text-ink-600" />
            </details>
          )}
        </SplitMedia>
      </Section>

      {/* Karriere-Teaser */}
      <Section tone="green" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg-light absolute inset-0" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Karriere bei Ökovolt"
              title={data?.second_card_title || "Ein starkes Team mit einer gemeinsamen Vision"}
              lead={data?.second_card_description?.trim()}
            />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/uber-uns/jobs" size="lg" pfeil>
                Offene Stellen ansehen
              </Button>
              <Button href="mailto:office@oekovolt.de?subject=Initiativbewerbung" size="lg" variant="secondary" icon={Mail}>
                Initiativ bewerben
              </Button>
            </div>
          </div>
          {karriere.length > 0 && <FeatureGrid items={karriere} cols={2} />}
        </div>
      </Section>

      <Querverweise pfad="/uber-uns/team" />
      <CtaBand
        eyebrow="Lernen Sie uns kennen"
        title="Persönlich beraten – vom Team, das Ihre Anlage baut."
        text="Erzählen Sie uns von Ihrem Vorhaben. Wir prüfen Dach und Verbrauch und erstellen Ihnen ein ehrliches Angebot – mit festem Ansprechpartner aus Türkheim."
        primary={{ label: "Kostenlose Beratung anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
