// src/app/kommunen/liegenschafts-check/page.js
//
// Liegenschafts-Check für Gemeinden (Welle B, Paket B09): bis 15 Gebäude mit typisierten Profilen →
// kWp, Eigenverbrauch, Überschuss für eine Energiegemeinschaft und Rangfolge. Ergebnis frei,
// CSV-Export über das Lead-Gate (Kennung „liegenschafts-check“). Dazu das Muster-Paket (frei).
// Alle Zahlen sind Richtwerte zur Orientierung, Annahmen und Quellen in
// src/components/KommunenVergabe/liegenschaften.js.

import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { Hinweis, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import LiegenschaftsCheck from "@/components/KommunenVergabe/LiegenschaftsCheck";
import VorlagenPaket from "@/components/KommunenVergabe/VorlagenPaket";
import {
  BUNDESLAENDER,
  DACHALTER_PRUEFEN,
  DACHALTER_SANIERUNG,
  DACH_FAKTOR,
  GEBAEUDE,
  LIEGENSCHAFTEN_STAND,
  MAX_GEBAEUDE,
  NE7_PRUEFEN_AB_KWP,
  QM_PRO_KWP,
  QUELLEN,
} from "@/components/KommunenVergabe/liegenschaften";
import { zahlText } from "@/data/kennzahlen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/kommunen/liegenschafts-check";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Liegenschafts-Check PV für Gemeinden | Ökovolt";
const BESCHREIBUNG = `Bis zu ${MAX_GEBAEUDE} Gemeindegebäude vergleichen: Leistung, Eigenverbrauch, Überschuss für die Energiegemeinschaft und Rangfolge – Grobabschätzung mit typisierten Profilen.`;
const STAND = LIEGENSCHAFTEN_STAND;

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Photovoltaik Gemeinde Liegenschaften", "PV Gemeindegebäude Potenzial", "Energiegemeinschaft Gemeinde Überschuss", "PV Schule Bauhof Kläranlage", "Liegenschafts-Check Photovoltaik"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Liegenschafts-Check Photovoltaik für Gemeinden" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

const ANNAHMEN = [
  { k: "Lastprofile", v: "Typisierte Tagesprofile je Gebäudetyp (Werktag, Wochenende, Monatsgewichte) – Plausibilitätsannahmen, keine Messdaten." },
  { k: "Leistung aus Dachfläche", v: `${QM_PRO_KWP} m² je kWp (Mischung aus Schräg- und Flachdach, Ost-West aufgeständert). Dachparallel rund 5 m²/kWp, Süd aufgeständert rund 10 m²/kWp.` },
  { k: "Spezifischer Ertrag", v: `PVGIS 5.3 je Bundesland (Mittel der Spanne, optimale Neigung Süd, 14 % Verluste) × ${zahlText(DACH_FAKTOR * 10)}/10 für reale Dächer.` },
  { k: "Eigenverbrauch", v: "Stundenrechnung je Monat: Solarkurve gegen Verbrauchsprofil, Werktage und Wochenende getrennt." },
  { k: "Rangfolge", v: `Selbst genutzte kWh, gemindert bei Dachalter ab ${DACHALTER_PRUEFEN} Jahren (ab ${DACHALTER_SANIERUNG} stärker) und ab ${NE7_PRUEFEN_AB_KWP} kWp auf Netzebene 7.` },
  { k: "Überschuss", v: "Ertrag minus Eigenverbrauch – für eine Energiegemeinschaft im Ort oder zur Einspeisung." },
];

export default function LiegenschaftsCheckSeite() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${PAGE_URL}/#app`,
    name: "Liegenschafts-Check Photovoltaik für Gemeinden",
    url: PAGE_URL,
    description: BESCHREIBUNG,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    inLanguage: "de-AT",
    isAccessibleForFree: true,
    audience: { "@type": "Audience", audienceType: "Gemeinden, Amtsleitung, Bauamt, Energiebeauftragte" },
    provider: { "@id": `${BASE_URL}/#organization` },
    isPartOf: { "@id": `${BASE_URL}/#website` },
    dateModified: STAND.iso,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Gemeinden, Länder & Stadtwerke", href: "/kommunen" }, { name: "Liegenschafts-Check" }]}
        eyebrow={`Werkzeug für Amtsleitung & Bauamt · Stand ${STAND.label}`}
        title={
          <>
            Welches Gemeindedach <span className="ov-text-gradient-light">zuerst?</span>
          </>
        }
        lead={`Bis zu ${MAX_GEBAEUDE} Gebäude eintragen – Amt, Schule, Bauhof, Kläranlage, Freibad. Der Check schätzt Leistung, Eigenverbrauch und Überschuss für eine Energiegemeinschaft und reiht die Liegenschaften. Ergebnis sofort, ohne Anmeldung.`}
        actions={[
          { label: "Gebäude eintragen", href: "#check" },
          { label: "Muster-Vorlagen", href: "#vorlagen" },
        ]}
        points={[`bis ${MAX_GEBAEUDE} Gebäude`, `${GEBAEUDE.length} Gebäudetypen`, "Rangfolge & Energiegemeinschaft", "Richtwerte mit Quellen"]}
      />

      <Section tone="white" space="md" id="check" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Liegenschafts-Check · interaktiv"
            title="Gebäude eintragen, Rangfolge ablesen"
            lead="Jahresverbrauch steht auf der Stromrechnung bzw. in der Energiebuchhaltung, die Dachfläche im Plan oder im Solarkataster des Landes. Ihre Angaben bleiben in diesem Browser."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Grobabschätzung · Richtwerte</StandPille>
        </div>
        <LiegenschaftsCheck />
      </Section>

      <Section tone="sand" space="md" id="annahmen" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="So rechnet der Check" title="Annahmen offen gelegt" lead="Damit Gemeinderat und Bauamt nachvollziehen können, woher jede Zahl kommt." />
            <Hinweis ton="warn" titel="Grobabschätzung mit typisierten Profilen" className="mt-8">
              Die Ergebnisse sind Richtwerte zur Orientierung. Für Beschluss und Ausschreibung braucht es den echten Lastgang (15-Minuten-Werte aus dem Portal des Netzbetreibers), eine Statik der
              Dächer und die Netzzugangsauskunft. Den Lastgang werten Sie mit unserer{" "}
              <Link href="/lastgang-analyse" className={LINK}>
                Lastgang-Analyse
              </Link>{" "}
              aus.
            </Hinweis>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {ANNAHMEN.map((a) => (
              <div key={a.k} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/60">
                <dt className="font-display text-[16px] font-bold text-ink-900">{a.k}</dt>
                <dd className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{a.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 font-display text-[19px] font-bold text-ink-900">Gebäudetypen und ihr Profil</h3>
            <Tabelle
              dicht
              caption="Typisierte Profile der Gebäudetypen"
              spalten={[
                { key: "typ", label: "Gebäudetyp", breite: "w-[38%]" },
                { key: "text", label: "Verbrauchsmuster" },
              ]}
              zeilen={GEBAEUDE.map((g) => ({ typ: g.label, text: g.text }))}
            />
          </div>
          <div>
            <h3 className="mb-4 font-display text-[19px] font-bold text-ink-900">Spezifischer Ertrag je Bundesland</h3>
            <Tabelle
              dicht
              caption="Spezifischer Ertrag laut PVGIS, für Gemeindedächer abgemindert"
              spalten={[
                { key: "land", label: "Bundesland", breite: "w-[40%]" },
                { key: "pvgis", label: "PVGIS optimal" },
                { key: "ansatz", label: "Ansatz im Check" },
              ]}
              zeilen={BUNDESLAENDER.map((b) => ({ land: b.label, pvgis: `${zahlText(b.pvgis[0])}–${zahlText(b.pvgis[1])} kWh/kWp`, ansatz: `${zahlText(b.ertrag)} kWh/kWp` }))}
            />
            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
              Quelle: PVGIS 5.3, EU JRC, abgefragt 28.09.2026 (src/data/bundeslaender.js). Richtwerte, Standort und Dach können abweichen.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" space="md" id="vorlagen" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Muster-Paket · frei"
            title="Leistungsbeschreibung und Bewertungsmatrix"
            lead="Herstellerneutrale Vorlagen für die Vergabe Ihrer PV-Anlage – zum Herunterladen ohne Registrierung."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Stand {STAND.label}</StandPille>
        </div>
        <VorlagenPaket />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/kommunen/vergabe-foerderung#wegweiser" className="group flex items-center justify-between gap-4 rounded-3xl bg-sand-50 p-5 transition hover:bg-sand-100">
            <span>
              <span className="block font-display text-[17px] font-bold text-ink-900">Vergabe & Förderung</span>
              <span className="mt-0.5 block text-[14px] text-ink-600">Schwellenwerte, Vergabe-Wegweiser, Amtsvortrag</span>
            </span>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-700 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/kommunen/eignung" className="group flex items-center justify-between gap-4 rounded-3xl bg-sand-50 p-5 transition hover:bg-sand-100">
            <span>
              <span className="block font-display text-[17px] font-bold text-ink-900">Eignung für die Direktvergabe</span>
              <span className="mt-0.5 block text-[14px] text-ink-600">Registerdaten und Referenzen von Ökovolt</span>
            </span>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-700 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <Quellen className="mt-12" stand={STAND.label} quellen={QUELLEN} hinweis="Richtwerte zur Orientierung ohne Gewähr. Keine Planung, keine Rechts- oder Förderberatung." />
        <p className="mt-6 flex max-w-4xl gap-2 text-[13px] leading-relaxed text-ink-500">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          <span>Der Check überträgt keine Gebäudedaten. Erst beim Export fragen wir Name und E-Mail ab und erhalten dabei nur die Summen (Gebäudeanzahl, kWp, Eigenverbrauch, Überschuss).</span>
        </p>
      </Section>

      <CtaBand
        eyebrow="Für Gemeinden, Verbände & Stadtwerke"
        title="Vom Check zur belastbaren Grundlage für den Gemeinderat."
        text="Wir prüfen Dächer und Lastgänge Ihrer Liegenschaften, rechnen Ertrag und Eigenverbrauch mit echten Daten und klären den Netzanschluss – als Unterlage für Beschluss, Vergabe und Förderantrag."
        primary={{ label: "Video-Termin vereinbaren", href: "/termin?art=video&thema=gemeinde" }}
        secondary={{ label: "Preisauskunft anfordern", href: "/angebot?objekt=gemeinde&thema=preisauskunft" }}
      />
    </div>
  );
}
