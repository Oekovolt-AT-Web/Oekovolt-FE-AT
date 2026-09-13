import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, CalendarClock, CircleAlert, CircleX, Landmark, MapPin, Sun } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MiniKarte from "@/components/Forderungen/Landes/MiniKarte";
import { datumLang } from "@/components/Forderungen/Shared/format";
import { FOERDERARTEN, seiteFuerSlug } from "@/data/bundeslaender";

/**
 * Landesspezifischer Förderteil unter /forderungen/landesforderungen/<slug>.
 *
 * Die Seiten kamen aus dem Backoffice mit rund 480 Wörtern und wurden von
 * Google nicht indexiert. Dieser Block ergänzt das, was sich je Bundesland
 * WIRKLICH unterscheidet – kommunale Programme, regionale Beratungsstellen,
 * Standortbedingungen. Bewusst kein bundesweit identischer Textbaustein:
 * der würde 25 Near-Duplicates erzeugen und das Problem verschärfen.
 *
 * Regionalseiten (Landkreis/Gemeinde) erhalten eine eigene, knappe Einordnung
 * mit Verweis auf die Landesseite statt einer Kopie der Landesdaten.
 *
 * Rendert nichts, solange für einen Slug keine Daten hinterlegt sind.
 */

const CHIP = {
  zuschuss: "bg-ov-600 text-white",
  darlehen: "bg-navy-500 text-white",
  kommunal: "bg-ov-100 text-ov-800",
  bund: "bg-ink-100 text-ink-700",
};

const kwh = (n) => n.toLocaleString("de-DE");

/** Kurzfakten + Mini-Karte („Auf einen Blick“). */
export function LandAufEinenBlick({ slug }) {
  const seite = seiteFuerSlug(slug);
  if (!seite) return null;
  const { land, profil, region, typ } = seite;
  const ortsname = typ === "region" ? region.name : land.name;
  const kommunal = land.kommunal || [];
  const ausgelaufen = land.ausgelaufen || [];
  const ertrag10 = [profil.ertrag[0] * 10, profil.ertrag[1] * 10];

  const fakten = [
    {
      icon: Landmark,
      label: "Landesprogramm",
      wert: profil.programm ? profil.programm.art : "Keines",
      text: profil.programm ? profil.programm.name : `Kein Landesprogramm für private Anlagen in ${land.name}`,
    },
    {
      icon: Building2,
      label: typ === "region" ? `Kommunal in ${land.name}` : "Kommunale Programme",
      wert: `${kommunal.length} aktiv`,
      text: ausgelaufen.length ? `${ausgelaufen.length} zuletzt ausgelaufen` : "Keine ausgelaufenen Programme erfasst",
    },
    {
      icon: Sun,
      label: "Solarertrag",
      wert: `${kwh(profil.ertrag[0])}–${kwh(profil.ertrag[1])}`,
      text: `kWh je kWp – eine 10-kWp-Anlage erzeugt rund ${kwh(ertrag10[0])}–${kwh(ertrag10[1])} kWh im Jahr`,
    },
    {
      icon: CalendarClock,
      label: "Zuletzt geprüft",
      wert: datumLang(land.stand).replace(/^\d+\.\s/, ""),
      text: `Stand ${datumLang(land.stand)} – kommunale Budgets können kurzfristig enden`,
    },
  ];

  return (
    <Section tone="white" space="lg">
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal dir="left" className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px]">
          <div aria-hidden="true" className="absolute inset-6 -z-0 rounded-full bg-ov-100/60 blur-3xl" />
          <MiniKarte
            landKey={seite.key}
            marker={region?.geo}
            markerLabel={typ === "region" ? region.name : undefined}
            className="relative"
          />
          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-ink-500">
            <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
            {typ === "region" ? `${region.name} · ${region.landkreis === region.name.replace("Landkreis ", "") ? "" : `Landkreis ${region.landkreis} · `}${land.name}` : `${land.name} · Landeshauptstadt ${profil.hauptstadt}`}
          </p>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Auf einen Blick"
            title={`Förderung in ${ortsname}: die Kurzantwort`}
          />
          <Reveal delay={80}>
            <p className="mt-5 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${CHIP[profil.foerderart]}`}>
                {FOERDERARTEN[profil.foerderart].label} in {land.name}
              </span>
            </p>
            <p className="mt-5 text-[18px] font-medium leading-relaxed text-ink-800">{land.landesprogramm.kurz}</p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-600">{land.landesprogramm.text}</p>
          </Reveal>

          <dl className="mt-9 grid gap-3 sm:grid-cols-2">
            {fakten.map((f, i) => (
              <Reveal key={f.label} delay={120 + i * 60} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <dt className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  <f.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                  {f.label}
                </dt>
                <dd className="ov-num mt-2 font-display text-[22px] font-extrabold leading-tight tracking-tight text-ink-900">{f.wert}</dd>
                <dd className="mt-1 text-[13.5px] leading-snug text-ink-500">{f.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

export default function LandesDetails({ slug }) {
  const seite = seiteFuerSlug(slug);
  if (!seite) return null;
  const { land, typ, region } = seite;

  if (typ === "region") return <RegionDetails land={land} region={region} />;

  return (
    <>
      {/* Kommunale Programme */}
      <Section tone="sand" space="lg" aria-labelledby="landesdetails-titel">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Programme vor Ort
            </p>
            <h2 id="landesdetails-titel" className="ov-h2 mt-4 text-ink-900">
              Förderung in {land.name}: der aktuelle Stand
            </h2>
          </div>
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-[13px] text-ink-600 ring-1 ring-ink-200 md:self-auto">
            <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Stand: {datumLang(land.stand)}
          </p>
        </div>

        {land.kommunal?.length > 0 ? (
          <Reveal>
            <h3 className="mb-4 flex items-center gap-2 font-display text-[20px] font-bold text-ink-900">
              <Building2 aria-hidden="true" className="h-5 w-5 text-ov-600" />
              Aktive Programme in {land.name}
            </h3>
            {/* Desktop: Tabelle */}
            <div className="hidden overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 md:block">
              <table className="w-full border-collapse text-left text-[15px]">
                <caption className="sr-only">Photovoltaik-Förderprogramme in {land.name}</caption>
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th scope="col" className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider">Ort &amp; Programm</th>
                    <th scope="col" className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider">Förderhöhe</th>
                    <th scope="col" className="px-6 py-4 text-[13px] font-semibold uppercase tracking-wider">Was gefördert wird</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {land.kommunal.map((k) => (
                    <tr key={`${k.ort}-${k.programm}`} className="align-top transition-colors hover:bg-ov-50/50">
                      <th scope="row" className="w-[28%] px-6 py-5 font-semibold text-ink-900">
                        {k.ort}
                        <span className="mt-1 block text-[13.5px] font-normal text-ink-500">{k.programm}</span>
                      </th>
                      <td className="w-[26%] px-6 py-5 font-display text-[16px] font-bold text-ov-700">{k.hoehe}</td>
                      <td className="px-6 py-5 text-ink-700">
                        {k.was}
                        {k.hinweis && <span className="mt-1.5 block text-[13.5px] leading-relaxed text-ink-500">{k.hinweis}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobil: Karten */}
            <ul className="grid gap-3 md:hidden">
              {land.kommunal.map((k) => (
                <li key={`${k.ort}-${k.programm}`} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
                  <p className="font-semibold text-ink-900">{k.ort}</p>
                  <p className="text-[13.5px] text-ink-500">{k.programm}</p>
                  <p className="mt-3 font-display text-[17px] font-bold text-ov-700">{k.hoehe}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{k.was}</p>
                  {k.hinweis && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500">{k.hinweis}</p>}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <Reveal className="flex items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-ov-600" />
            <div>
              <h3 className="font-display text-[19px] font-bold text-ink-900">Keine aktiven Zuschussprogramme bekannt</h3>
              <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
                Für {land.name} sind uns zum Prüfdatum keine laufenden Landes- oder Kommunalzuschüsse für private Photovoltaik bekannt. Einzelne Gemeinden legen kleinere Programme – oft für Steckersolargeräte – ohne große Ankündigung auf. Eine kurze Nachfrage im Rathaus lohnt sich.
              </p>
            </div>
          </Reveal>
        )}

        {land.ausgelaufen?.length > 0 && (
          <Reveal className="mt-10">
            <h3 className="font-display text-[20px] font-bold text-ink-900">Kürzlich ausgelaufene Programme</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">Diese Programme werden noch häufig gesucht, sind aber beendet oder ausgesetzt:</p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {land.ausgelaufen.map((a) => (
                <li key={`${a.ort}-${a.programm}`} className="flex gap-4 rounded-2xl bg-white/70 p-5 ring-1 ring-dashed ring-ink-300">
                  <CircleX aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />
                  <p className="text-[15px] leading-relaxed text-ink-600">
                    <strong className="font-semibold text-ink-900">{a.ort}</strong> – {a.programm}
                    <span className="mt-1 block text-[14px] text-ink-500">{a.ende.charAt(0).toUpperCase() + a.ende.slice(1)}. {a.grund}.</span>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Section>

      {/* Regionale Anlaufstellen */}
      {land.region && (
        <Section tone="white" space="lg">
          <SectionHeading eyebrow="Beratung & Werkzeuge" title={land.region.titel} lead={land.region.einleitung} className="mb-10" />
          <ul className={`grid gap-4 sm:grid-cols-2 ${land.region.punkte.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {land.region.punkte.map((pkt, i) => (
              <Reveal as="li" key={pkt.titel} delay={i * 70} className="flex">
                <div className="flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                    <MapPin aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[18px] font-bold leading-snug text-ink-900">{pkt.titel}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-600">{pkt.text}</p>
                  <p className="mt-4 text-[12.5px] font-medium uppercase tracking-wider text-ink-500">Quelle: {pkt.quelle}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          {land.portal && (
            <Reveal className="mt-6 flex flex-col gap-2 rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-100 md:flex-row md:items-center md:gap-6">
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Offizielle Anlaufstelle</span>
              <p className="text-[15.5px] leading-relaxed text-ink-700">
                <strong className="text-ink-900">{land.portal.name}</strong> – {land.portal.text}
              </p>
            </Reveal>
          )}
        </Section>
      )}

      {/* Standort */}
      {land.standort && <Standort land={land} ertrag={seite.profil.ertrag} />}
    </>
  );
}

function Standort({ land, ertrag }) {
  // Skala 800–1.100 kWh/kWp, Deutschland-Spanne als Referenz
  const pos = (v) => ((v - 800) / 300) * 100;
  return (
    <Section tone="navy" space="lg" className="overflow-hidden">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full bg-sun-400/15 blur-[120px]" />
      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <SectionHeading dark eyebrow="Standortfaktor Sonne" title={land.standort.titel} lead={land.standort.text} />
        <Reveal dir="right" className="ov-glass rounded-3xl p-6 md:p-8">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
            <Sun aria-hidden="true" className="h-4 w-4 text-sun-400" />
            Spezifischer Jahresertrag
          </p>
          <p className="ov-num mt-3 font-display text-[clamp(2rem,1.5rem+2vw,3rem)] font-extrabold leading-none tracking-tight text-white">
            {kwh(ertrag[0])}–{kwh(ertrag[1])}
            <span className="ml-2 text-[16px] font-semibold text-white/60">kWh je kWp</span>
          </p>
          <div className="relative mt-10 h-3 rounded-full bg-gradient-to-r from-navy-400/60 via-sun-300/70 to-sun-500" aria-hidden="true">
            <span
              className="absolute -top-2 h-7 rounded-full bg-white/25 ring-2 ring-white"
              style={{ left: `${pos(ertrag[0])}%`, width: `${pos(ertrag[1]) - pos(ertrag[0])}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[12.5px] text-white/50" aria-hidden="true">
            <span>800 · Küste</span>
            <span>950</span>
            <span>1.100 · Alpenrand</span>
          </div>
          <p className="mt-8 border-t border-white/10 pt-6 text-[15px] leading-relaxed text-white/70">
            Eine 10-kWp-Anlage erzeugt in {land.name} damit rund <strong className="text-white">{kwh(ertrag[0] * 10)}–{kwh(ertrag[1] * 10)} kWh</strong> Solarstrom pro Jahr – genug für den Jahresverbrauch von zwei bis drei Haushalten.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function RegionDetails({ land, region }) {
  // Nur Anlaufstellen, die zum Landkreis passen – plus landkreisübergreifende (eza!)
  const punkte = (land.region?.punkte || []).filter(
    (p) => p.titel.includes(region.landkreis) || (!/Landkreis/.test(p.titel) && region.landkreis !== "Landsberg am Lech")
  );

  return (
    <Section tone="sand" space="lg">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={`Rahmen in ${land.name}`}
            title={`Was in ${region.name} zusätzlich zur Bundesförderung gilt`}
            lead={`${region.name} gehört zum Freistaat ${land.name}${region.name.includes("Landkreis") ? "" : ` (Landkreis ${region.landkreis})`}. Maßgeblich sind damit die bayerischen Rahmenbedingungen – und die Angebote des Landkreises.`}
          />
          <Reveal delay={80} className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              <Landmark aria-hidden="true" className="h-4 w-4 text-ov-600" />
              Landesebene {land.name}
            </p>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-ink-900">{land.landesprogramm.kurz}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
              Städtische Programme wie in {land.kommunal?.map((k) => k.ort).join(" oder ") || "einzelnen Großstädten"} gelten nur im jeweiligen Stadtgebiet. Anlagen in {region.name} profitieren deshalb vor allem von 0 % Umsatzsteuer, Einkommensteuerbefreiung, EEG-Vergütung und KfW-Kredit.
            </p>
            <Link href={`/forderungen/landesforderungen/${land.slugs[0]}`} className="group mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alle Programme in {land.name}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div>
          <h3 className="ov-h3 text-ink-900">Beratung und Werkzeuge für {region.name}</h3>
          <ul className="mt-6 grid gap-3">
            {punkte.map((p, i) => (
              <Reveal as="li" key={p.titel} delay={i * 70} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-6">
                <p className="font-display text-[17px] font-bold text-ink-900">{p.titel}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{p.text}</p>
                <p className="mt-2 text-[12.5px] font-medium uppercase tracking-wider text-ink-500">Quelle: {p.quelle}</p>
              </Reveal>
            ))}
            {land.portal && (
              <Reveal as="li" className="rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-100 md:p-6">
                <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                  {land.portal.name}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-ov-600" />
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-600">{land.portal.text}</p>
              </Reveal>
            )}
            <Reveal as="li" className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
              <p className="font-display text-[17px] font-bold">Ökovolt in Türkheim</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">
                Unser Fachbetrieb sitzt im Unterallgäu – wir kennen Netzbetreiber, Genehmigungspraxis und Förderlage der Region aus eigener Erfahrung.
              </p>
            </Reveal>
          </ul>
        </div>
      </div>
    </Section>
  );
}

/** Landesspezifische FAQ – aus den Daten erzeugt, damit jede Seite eigene Antworten hat. */
export function landesFaq(slug) {
  const seite = seiteFuerSlug(slug);
  if (!seite) return [];
  const { land, profil, typ, region } = seite;
  const ort = typ === "region" ? region.name : land.name;
  const kommunal = land.kommunal || [];
  const faq = [
    {
      q: `Gibt es 2026 eine Förderung für Photovoltaik in ${ort}?`,
      a: `${land.landesprogramm.kurz} ${land.landesprogramm.text} Unabhängig davon gelten bundesweit 0 % Umsatzsteuer, die Einkommensteuerbefreiung, die EEG-Einspeisevergütung und der KfW-Kredit 270. Stand: ${datumLang(land.stand)}.`,
    },
  ];
  if (typ === "land") {
    faq.push({
      q: `Welche Städte in ${land.name} fördern Photovoltaik?`,
      a: kommunal.length
        ? `Zum Prüfdatum aktiv: ${kommunal.map((k) => `${k.ort} (${k.programm}: ${k.hoehe})`).join("; ")}. Kommunale Budgets sind begrenzt – den Antrag immer vor Vertragsabschluss stellen.`
        : `Zum Prüfdatum sind uns in ${land.name} keine laufenden kommunalen Zuschussprogramme für Photovoltaik bekannt.${land.ausgelaufen?.length ? ` Zuletzt beendet: ${land.ausgelaufen.map((a) => `${a.ort} (${a.programm})`).join(", ")}.` : ""} Einzelne Gemeinden fördern zeitweise Steckersolargeräte – fragen Sie im Rathaus nach.`,
    });
  }
  faq.push({
    q: `Wie viel Strom erzeugt eine Photovoltaikanlage in ${ort}?`,
    a: `In ${land.name} sind rund ${kwh(profil.ertrag[0])} bis ${kwh(profil.ertrag[1])} kWh je Kilowatt-Peak im Jahr realistisch. Eine 10-kWp-Anlage erzeugt damit etwa ${kwh(profil.ertrag[0] * 10)} bis ${kwh(profil.ertrag[1] * 10)} kWh. Ausrichtung, Dachneigung und Verschattung können den Wert im Einzelfall deutlich verschieben.`,
  });
  const punkte = land.region?.punkte || [];
  if (punkte.length) {
    faq.push({
      q: `Wo bekomme ich in ${ort} neutrale Beratung zu Photovoltaik und Förderung?`,
      a: `Gute Anlaufstellen sind ${punkte.slice(0, 3).map((p) => p.titel).join(", ")}${land.portal ? ` sowie ${land.portal.name}` : ""}. Für ein konkretes Angebot mit Förderprüfung für Ihre Adresse können Sie uns direkt anfragen.`,
    });
  }
  return faq;
}
