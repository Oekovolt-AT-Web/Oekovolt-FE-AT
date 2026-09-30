// Solar-Siegel zum Einbauen – Vorschau, Varianten und Einbau-Code.
// noindex,follow; Canonical auf die Projektseite (kein eigener Suchinhalt).

import { notFound, permanentRedirect } from "next/navigation";
import { Code2, MousePointerClick, Palette } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import KitNavigation from "@/components/Kundenbuehne/KitNavigation";
import SiegelKonfigurator from "@/components/Kundenbuehne/SiegelKonfigurator";
import Rechenweg from "@/components/Kundenbuehne/Rechenweg";
import { kitMetadata, ladeKundenbuehne } from "@/lib/kundenbuehneServer";
import { SIEGEL_FORMATE, SIEGEL_STILE, einbauCode, siegelAlt, siegelBildUrl, siegelMasse } from "@/lib/kundenbuehne";
import { BASE_URL } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { title } = await params;
  const d = await ladeKundenbuehne(title);
  return kitMetadata(d, {
    titel: "Solar-Siegel",
    beschreibung: d ? `Solar-Siegel für die Website von ${d.firma}: Sonnenstrom, Leistung und CO₂-Einsparung der Photovoltaikanlage – zum Einbauen per Code.` : "",
  });
}

export default async function SiegelSeite({ params }) {
  const { title } = await params;
  const d = await ladeKundenbuehne(title);
  if (!d) notFound();
  if (d.veraltet) permanentRedirect(`/referenzen/projekte/${d.projekt.slug}/siegel`);
  const { projekt, firma, zahlen } = d;
  const slug = projekt.slug;

  const varianten = {};
  for (const stil of Object.keys(SIEGEL_STILE)) {
    for (const format of Object.keys(SIEGEL_FORMATE)) {
      const { breite, hoehe } = siegelMasse(format, zahlen);
      varianten[`${stil}-${format}`] = {
        src: siegelBildUrl({ slug, stil, format }),
        code: einbauCode({ basis: BASE_URL, slug, firma, zahlen, stil, format }),
        alt: siegelAlt(firma, zahlen),
        breite,
        hoehe,
      };
    }
  }

  const schritte = [
    { icon: Palette, t: "Variante wählen", x: "Hell oder dunkel – passend zu Ihrer Website. Kompakt für Seitenleisten und Fußbereiche, breit für Banner-Flächen." },
    { icon: Code2, t: "Code kopieren", x: "Der Code bindet das Siegel als Bild ein. Die Zahlen aktualisieren sich automatisch, wenn sich Ihre Anlagendaten bei uns ändern." },
    { icon: MousePointerClick, t: "Einfügen", x: "Im CMS (z. B. WordPress, Wix, Jimdo, TYPO3) als HTML-Block einfügen. Ein Klick auf das Siegel führt zu Ihrem Referenzprojekt." },
  ];

  return (
    <div>
      <PageHero
        variant="dark"
        breadcrumbs={[
          { name: "Referenzen", href: "/referenzen/projekte" },
          { name: projekt.titel, href: `/referenzen/projekte/${slug}` },
          { name: "Solar-Siegel" },
        ]}
        eyebrow="Solar-Kit · Siegel"
        title={
          <>
            Solar-Siegel für <span className="ov-text-gradient-light">{firma}</span>
          </>
        }
        lead="Zeigen Sie auf Ihrer Website, dass Ihr Betrieb Sonnenstrom erzeugt – mit Leistung, geschätzter Jahresproduktion und CO₂-Einsparung Ihrer Anlage."
        className="pb-4"
      />
      <KitNavigation slug={slug} aktiv="siegel" titel={projekt.titel} />

      <Section tone="white" space="md">
        <SiegelKonfigurator varianten={varianten} dateiname={`solar-siegel-${slug}`} />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="In drei Schritten" title="So kommt das Siegel auf Ihre Website" />
            <ol className="mt-8 space-y-4">
              {schritte.map((s, i) => (
                <li key={s.t} className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-600 text-white">
                    <s.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink-900">
                      {i + 1}. {s.t}
                    </h3>
                    <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-600">{s.x}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-5">
            <Rechenweg zahlen={zahlen} />
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-7">
              <h3 className="font-display text-[18px] font-bold text-ink-900">Gut zu wissen</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14.5px] leading-relaxed text-ink-600">
                <li>Das Siegel ist ein reines Bild (SVG) mit Link – ohne Skript, ohne Cookies, ohne Tracking.</li>
                <li>
                  Der Link ist als <code className="rounded bg-ink-100 px-1.5 py-0.5 text-[13px]">rel=&quot;nofollow&quot;</code> gekennzeichnet. So empfiehlt es Google für Links in eingebetteten Widgets
                  und Siegeln – für Ihre Website hat das keine Nachteile.
                </li>
                <li>Alle Zahlen sind Schätzungen. Für Berichte verwenden Sie bitte die Messwerte Ihrer Anlage.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
