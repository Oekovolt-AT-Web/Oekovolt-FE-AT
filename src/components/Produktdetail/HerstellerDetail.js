import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Calculator,
  ClipboardCheck,
  FileCheck2,
  Mail,
  Phone,
  Plug,
  UserRound,
  Wrench,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import ProduktGalerie from "@/components/Produktdetail/ProduktGalerie";
import { generateSlug } from "@/lib/slugify";
import { BASE_URL, FIRMA } from "@/lib/site";

const BASE = BASE_URL;
const img = (p) => (p ? `/api/image?path=${p}` : null);

/** Einstellungen je Produktbereich */
export const KONTEXTE = {
  stromspeicher: {
    label: "Stromspeicher",
    pfad: "/produkte/stromspeicher",
    rechner: { href: "/rechner/stromspeicher", label: "Speichergröße berechnen", titel: "Welche Speichergröße passt zu Ihnen?", text: "Verbrauch, Anlagengröße und E-Auto oder Wärmepumpe eingeben – der Rechner zeigt Autarkie, Ersparnis und die sinnvolle Kapazität." },
    fallbackBild: "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg",
    vorteil: { icon: Plug, title: "Auch zum Nachrüsten", text: "Wir prüfen Ihre Bestandsanlage und binden den Speicher DC- oder AC-seitig ein – im Gewerbe auch für Peak Shaving." },
  },
  warmepumpe: {
    label: "Wärmepumpe",
    pfad: "/produkte/warmepumpe",
    rechner: { href: "/rechner/waermepumpe", label: "Ersparnis berechnen", titel: "Was spart eine Wärmepumpe in Ihrem Haus?", text: "Wärmebedarf, Heizsystem und PV-Anlage eingeben – der Rechner zeigt Heizkosten, Förderung und Amortisation." },
    fallbackBild: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg",
    vorteil: { icon: FileCheck2, title: "Förderung im Blick", text: "Wir prüfen Bundes- und Landesförderungen vor der Bestellung, damit Registrierung und Förderansuchen rechtzeitig gestellt sind." },
  },
};

/**
 * Hersteller, mit denen die österreichische Gesellschaft eine belegte
 * Zusammenarbeit hat (Stand 09/2026). Detailseiten anderer Marken aus dem
 * Backoffice der deutschen Seite werden auf noindex gesetzt und in
 * Übersichten nicht verlinkt.
 */
export const BELEGTE_PARTNER = ["Fronius", "Huawei", "Solis", "BYD", "Sigenergy", "meteocontrol"];
export const istBelegterPartner = (titel = "") => BELEGTE_PARTNER.some((p) => String(titel).toLowerCase().includes(p.toLowerCase()));

/** Aktive Produkte aus den festen Feldern first…fifth des Herstellers */
export function produkteAus(hersteller) {
  if (!hersteller) return [];
  return ["first", "second", "third", "fourth", "fifth"]
    .map((n) => ({
      status: hersteller[`${n}_product_status`],
      name: (hersteller[`${n}_product_name`] || "").trim(),
      bild: img(hersteller[`${n}_product_image`]),
      bildPfad: hersteller[`${n}_product_image`],
      alt: hersteller[`${n}_product_image_alt`],
      beschreibung: hersteller[`${n}_product_description`] || "",
      merkmale: Array.isArray(hersteller[`${n}_product_options`])
        ? hersteller[`${n}_product_options`].map((o) => (o.options || "").trim()).filter(Boolean)
        : [],
    }))
    .filter((p) => p.status === "Aktiv" && p.name);
}

/** Text an einer Wortgrenze kürzen (für Meta-Descriptions) */
export function kuerzen(text = "", max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const schnitt = t.slice(0, max - 1);
  return `${schnitt.slice(0, schnitt.lastIndexOf(" "))} …`;
}

const mailAdresse = (m) => (m || "").replace(/\s*\(at\)\s*/i, "@").trim();

export default function HerstellerDetail({ kontext = "stromspeicher", slug, item, hersteller, alleItems = [] }) {
  const k = KONTEXTE[kontext];
  const titel = hersteller?.title || item.title;
  const seitenUrl = `${BASE}${k.pfad}/${slug}`;
  const produkte = produkteAus(hersteller);
  const beschreibung = hersteller?.main_description || item.main_description || "";
  const banner = img(hersteller?.banner_image || item.banner_image) || k.fallbackBild;
  const logo = img(hersteller?.logo_image || item.logo_image);
  const verwandte = alleItems.filter((i) => i.title && generateSlug(i.title) !== slug && i.status !== "Passiv" && istBelegterPartner(i.title)).slice(0, 4);
  const email = mailAdresse(hersteller?.email);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${seitenUrl}/#webpage`,
        url: seitenUrl,
        name: `${titel} – ${k.label} & Komponenten`,
        description: kuerzen(beschreibung, 300),
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE}/#website` },
        about: { "@id": `${seitenUrl}/#brand` },
        ...(produkte.length ? { mainEntity: { "@id": `${seitenUrl}/#produkte` } } : {}),
      },
      {
        "@type": "Brand",
        "@id": `${seitenUrl}/#brand`,
        name: titel,
        ...(logo ? { logo: `${BASE}${logo}` } : {}),
        ...(hersteller?.website_url ? { url: hersteller.website_url } : {}),
      },
      ...(produkte.length
        ? [
            {
              "@type": "ItemList",
              "@id": `${seitenUrl}/#produkte`,
              name: `Produkte von ${titel}`,
              itemListElement: produkte.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: p.name,
                  brand: { "@id": `${seitenUrl}/#brand` },
                  ...(p.beschreibung ? { description: kuerzen(p.beschreibung, 400) } : {}),
                  ...(p.bild ? { image: `${BASE}${p.bild}` } : {}),
                },
              })),
            },
          ]
        : []),
    ],
  };

  const kerndaten = [
    ["Hersteller", hersteller?.company_name || titel],
    hersteller?.location && ["Sitz / Region", hersteller.location],
    ["Produktbereich", k.label],
    produkte.length > 0 && ["Produktlinien", produkte.map((p) => p.name).join(", ")],
    hersteller?.website_url && [
      "Website",
      <a key="w" href={hersteller.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all font-semibold text-ov-700 hover:text-ov-800">
        {hersteller.website_url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      </a>,
    ],
    ["Planung & Einbau", `${FIRMA.name}, ${FIRMA.ort}`],
  ].filter(Boolean);

  const ueberText = [hersteller?.company_description, hersteller?.details_description].filter(Boolean).join("\n\n");

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte" }, { name: k.label, href: k.pfad }, { name: titel }]}
        eyebrow={`Hersteller · ${k.label}`}
        title={
          <>
            {titel}-Produkte, <span className="ov-text-gradient">fachgerecht eingebaut</span>
          </>
        }
        lead={beschreibung}
        image={{ src: banner, alt: hersteller?.alt_banner_image || item.alt_banner_image || titel }}
        actions={[
          { label: "Angebot anfragen", href: "/angebot" },
          { label: k.rechner.label, href: k.rechner.href, icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            {logo ? (
              <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-ink-100">
                <Image src={logo} alt={hersteller?.alt_logo_image || item.alt_logo_image || `${titel} Logo`} width={88} height={40} className="max-h-10 w-auto object-contain" />
              </span>
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
                <BadgeCheck aria-hidden="true" className="h-6 w-6" />
              </span>
            )}
            <div>
              <p className="font-display text-[16px] font-extrabold leading-tight text-ink-900">Planung & Einbau</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">durch unser Fachteam aus {FIRMA.ort}, ganz Österreich</p>
            </div>
          </div>
        }
      />

      {produkte.length > 0 && (
        <Section tone="white" space="lg" id="produkte">
          <SectionHeading
            eyebrow="Produktpalette"
            title={
              <>
                Produkte von <span className="ov-text-gradient">{titel}</span>
              </>
            }
            lead={`${produkte.length === 1 ? "Diese Produktlinie" : `Diese ${produkte.length} Produktlinien`} von ${titel} planen und installieren wir. Welche Lösung zu Ihrem Betrieb oder Gebäude passt, klären wir in der Beratung.`}
            className="mb-12"
          />
          <Reveal dir="scale">
            <ProduktGalerie produkte={produkte.map(({ name, bild, alt, beschreibung, merkmale }) => ({ name, bild, alt, beschreibung, merkmale }))} hersteller={titel} />
          </Reveal>
        </Section>
      )}

      <Section tone="sand" space="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Über den Hersteller" title={`${titel} im Überblick`} />
            <Reveal delay={80}>
              <Fliesstext text={ueberText || beschreibung} className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-600" />
              {(email || hersteller?.phone_number) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {email && (
                    <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300">
                      <Mail aria-hidden="true" className="h-4 w-4 text-ov-600" />
                      <span className="break-all">{email}</span>
                    </a>
                  )}
                  {hersteller?.phone_number && (
                    <a href={`tel:${hersteller.phone_number.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300">
                      <Phone aria-hidden="true" className="h-4 w-4 text-ov-600" />
                      {hersteller.phone_number.replace(/\s+/g, " ")}
                    </a>
                  )}
                </div>
              )}
              {(email || hersteller?.phone_number) && (
                <p className="mt-3 text-[13px] text-ink-500">Kontaktdaten des Herstellers. Für Angebot, Planung und Einbau sind wir Ihr Ansprechpartner.</p>
              )}
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-ink-200/70">
              <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-6 py-5">
                <h2 className="font-display text-[18px] font-bold text-ink-900">Auf einen Blick</h2>
                {logo && <Image src={logo} alt="" width={72} height={28} className="h-7 w-auto object-contain" />}
              </div>
              <table className="w-full text-left text-[14.5px]">
                <caption className="sr-only">Kerndaten {titel}</caption>
                <tbody className="divide-y divide-ink-100">
                  {kerndaten.map(([label, wert]) => (
                    <tr key={label} className="align-top">
                      <th scope="row" className="w-[42%] px-6 py-3.5 font-medium text-ink-500">{label}</th>
                      <td className="px-6 py-3.5 font-semibold text-ink-900">{wert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-ink-100 bg-sand-50 p-5">
                <Link href="/angebot" className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-ov-600 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700">
                  Angebot mit {titel} anfragen
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Mit Ökovolt"
            title={`${titel} kaufen ist das eine – richtig einbauen das andere`}
            lead="Die beste Technik bringt nur dann, was sie verspricht, wenn Planung, Installation und Einbindung ins Gesamtsystem stimmen."
            className="mb-12"
          />
          <FeatureGrid
            cols={4}
            tone="dark"
            items={[
              { icon: UserRound, title: "Herstellerunabhängige Beratung", text: "Wir empfehlen, was zu Lastgang, Gebäude und Ziel passt – nicht das teuerste Modell." },
              { icon: Wrench, title: "Fachgerechte Installation", text: "Montage und Elektroinstallation durch unser eigenes Elektrotechnik-Team nach ÖVE/ÖNORM E 8101." },
              { icon: ClipboardCheck, title: "Meldung inklusive", text: "Meldung an den Netzbetreiber, Fertigstellungsmeldung und Prüfprotokoll erledigen wir." },
              k.vorteil,
            ]}
          />
        </div>
      </Section>

      {verwandte.length > 0 && (
        <Section tone="white" space="lg">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Weitere Hersteller" title={`Weitere Marken für Ihre ${k.label === "Wärmepumpe" ? "Wärmepumpe" : "Speicherlösung"}`} />
            <Link href={k.pfad} className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alle Infos zum Thema {k.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className={`grid gap-5 sm:grid-cols-2 ${verwandte.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
            {verwandte.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 80} className="flex">
                <Link href={`${k.pfad}/${generateSlug(v.title)}`} className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                    <Image src={img(v.banner_image) || k.fallbackBild} alt={v.alt_banner_image || v.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {v.logo_image && (
                      <span className="absolute left-4 top-4 flex h-10 items-center rounded-full bg-white/95 px-3 shadow-md backdrop-blur">
                        <Image src={img(v.logo_image)} alt={v.alt_logo_image || ""} width={72} height={24} className="h-5 w-auto object-contain" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[19px] font-bold text-ink-900 transition-colors group-hover:text-ov-700">{v.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-ink-600">{v.main_description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700">
                      Zum Hersteller
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <SolarrechnerTeaser href={k.rechner.href} cta={k.rechner.label} titel={k.rechner.titel} text={k.rechner.text} />

      <CtaBand
        title={`Ihr ${k.label === "Wärmepumpe" ? "Heizsystem" : "Speichersystem"} mit ${titel} – sauber geplant, fachgerecht installiert.`}
        text={`Persönliche Beratung von ${FIRMA.name} aus ${FIRMA.ort} – für Betriebe, Gemeinden und Premium-Wohnhäuser in ganz Österreich, mit festem Ansprechpartner bis zur Inbetriebnahme.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: k.rechner.label, href: k.rechner.href }}
      />
    </div>
  );
}
