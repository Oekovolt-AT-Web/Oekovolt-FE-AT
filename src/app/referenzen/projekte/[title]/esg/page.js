// ESG-Kurzbericht einer Referenzanlage – druckoptimiert („Als PDF speichern“ über window.print).
// Schätzwerte mit offengelegtem Faktor und Quelle; ausdrücklich kein Nachweis.
// noindex,follow; Canonical auf die Projektseite.

import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { AlertTriangle, Mail, Phone } from "lucide-react";
import KitNavigation from "@/components/Kundenbuehne/KitNavigation";
import DruckenKnopf from "@/components/Kundenbuehne/DruckenKnopf";
import { kitMetadata, ladeKundenbuehne } from "@/lib/kundenbuehneServer";
import { CO2_G_PRO_KWH, ERTRAG_JE_KWP, QUELLEN, fmtCa } from "@/lib/kundenbuehne";
import { BASE_URL, FIRMA } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { title } = await params;
  const d = await ladeKundenbuehne(title);
  return kitMetadata(d, {
    titel: "ESG-Kurzbericht",
    beschreibung: d ? `ESG-Kurzbericht zur Photovoltaikanlage von ${d.firma}: geschätzte Jahresproduktion und CO₂-Vermeidung mit Faktor und Quelle.` : "",
  });
}

const DRUCK_CSS = `
@media print {
  header, footer, aside, nav, [role="dialog"], .ov-druck-aus { display: none !important; }
  html, body { background: #fff !important; }
  main { padding: 0 !important; }
  .ov-druck-flaeche { background: #fff !important; padding: 0 !important; }
  .ov-druck-blatt { box-shadow: none !important; border: 0 !important; border-radius: 0 !important; padding: 0 !important; max-width: none !important; }
  .ov-druck-gruppe { break-inside: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 14mm 14mm 16mm; }
}
`;

const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

function Zeile({ k, v }) {
  if (!v) return null;
  return (
    <div className="flex justify-between gap-6 py-2.5">
      <dt className="text-ink-500">{k}</dt>
      <dd className="text-right font-semibold text-ink-900">{v}</dd>
    </div>
  );
}

export default async function EsgSeite({ params }) {
  const { title } = await params;
  const d = await ladeKundenbuehne(title);
  if (!d) notFound();
  if (d.veraltet) permanentRedirect(`/referenzen/projekte/${d.projekt.slug}/esg`);
  const { projekt, firma, zahlen, ort, jahr, kunde } = d;
  const slug = projekt.slug;
  const stand = new Date().toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const ausAnlage = zahlen?.quelleErtrag === "anlage";

  return (
    <div className="ov-druck-flaeche bg-sand-50">
      <style dangerouslySetInnerHTML={{ __html: DRUCK_CSS }} />
      <KitNavigation slug={slug} aktiv="esg" titel={projekt.titel} />

      <div className="ov-container py-10 md:py-14">
        <div className="ov-druck-aus mx-auto mb-6 flex max-w-[860px] flex-wrap items-center justify-between gap-4">
          <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-ink-600">
            Druckfertiger Kurzbericht zu Ihrer Anlage. Im Druckdialog <strong>„Als PDF speichern“</strong> wählen – ideal als Anlage für Nachhaltigkeitsbericht, Bank oder Kunden.
          </p>
          <DruckenKnopf />
        </div>

        <article className="ov-druck-blatt mx-auto max-w-[860px] rounded-[2rem] bg-white p-7 text-ink-800 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 md:p-12">
          {/* Kopf */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-ink-200 pb-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">ESG-Kurzbericht · Photovoltaik</p>
              <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight text-ink-900 md:text-[34px]">{firma}</h1>
              <p className="mt-1 text-[14.5px] text-ink-500">Solaranlage{ort ? ` in ${ort}` : ""} · Stand {stand}</p>
            </div>
            <div className="relative h-10 w-[150px] shrink-0">
              <Image src="/logo-oekovolt.png" alt="Ökovolt Solartechnik" fill sizes="150px" className="object-contain object-right" />
            </div>
          </div>

          {/* Kennzahlen */}
          {zahlen ? (
            <section className="ov-druck-gruppe mt-8" aria-labelledby="esg-zahlen">
              <h2 id="esg-zahlen" className="font-display text-[19px] font-bold text-ink-900">
                Kennzahlen (Schätzung)
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { l: "Nennleistung", w: zahlen.kwp ? zahlen.texte.kwp : "–" },
                  { l: "Stromerzeugung pro Jahr", w: `${zahlen.texte.mwh}`, u: `${de(Math.round(zahlen.ertragKwh / 100) * 100)} kWh` },
                  { l: "Vermiedene CO₂-Emissionen pro Jahr", w: zahlen.texte.co2, u: `${de(Math.round(zahlen.co2Kg / 10) * 10)} kg CO₂äqu` },
                ].map((k) => (
                  <div key={k.l} className="rounded-2xl bg-ov-50 p-4 ring-1 ring-ov-200/70">
                    <dt className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-500">{k.l}</dt>
                    <dd className="ov-num mt-1.5 font-display text-[24px] font-extrabold text-ink-900">{k.w}</dd>
                    {k.u && <dd className="text-[12.5px] text-ink-500">≈ {k.u}</dd>}
                  </div>
                ))}
              </dl>
            </section>
          ) : (
            <p className="mt-8 rounded-2xl bg-sand-50 p-4 text-[14.5px] text-ink-600">
              Für diese Anlage ist bei uns keine Nennleistung hinterlegt – bitte fragen Sie die Werte bei uns an (Kontakt unten).
            </p>
          )}

          <p className="ov-druck-gruppe mt-5 flex gap-3 rounded-2xl border border-sun-400/60 bg-sun-300/15 p-4 text-[14.5px] leading-relaxed text-ink-800">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" />
            <span>
              <strong>Schätzung.</strong> Für die Berichterstattung verwenden Sie bitte die Messwerte der Anlage (erzeugte, selbst verbrauchte und eingespeiste Kilowattstunden).
            </span>
          </p>

          {/* Anlage */}
          <section className="ov-druck-gruppe mt-8 grid gap-8 md:grid-cols-2" aria-labelledby="esg-anlage">
            <div>
              <h2 id="esg-anlage" className="font-display text-[19px] font-bold text-ink-900">
                Anlage
              </h2>
              <dl className="mt-3 divide-y divide-ink-100 text-[14.5px]">
                <Zeile k="Betreiber" v={firma} />
                {kunde?.branche && <Zeile k="Branche" v={kunde.branche} />}
                <Zeile k="Projekt" v={projekt.titel !== firma ? projekt.titel : ""} />
                <Zeile k="Standort" v={ort} />
                <Zeile k="Inbetriebnahme" v={jahr ? String(jahr) : ""} />
                <Zeile k="Nennleistung" v={zahlen?.kwp ? `${de(zahlen.kwp, zahlen.kwp % 1 ? 2 : 0)} kWp` : ""} />
                <Zeile k="Objektart" v={projekt.segment || ""} />
                <Zeile k="Errichter" v={`${FIRMA.name}, ${FIRMA.ort}`} />
              </dl>
            </div>
            {zahlen && (
              <div>
                <h2 className="font-display text-[19px] font-bold text-ink-900">Rechenweg</h2>
                <ol className="mt-3 space-y-3 text-[14.5px] leading-relaxed">
                  <li>
                    <strong>Jahresertrag:</strong>{" "}
                    {ausAnlage
                      ? `Wert aus den Anlagendaten: ${de(zahlen.ertragKwh)} kWh.`
                      : `${de(zahlen.kwp, zahlen.kwp % 1 ? 2 : 0)} kWp × ${de(ERTRAG_JE_KWP)} kWh/kWp = ${de(zahlen.ertragKwh)} kWh.`}
                  </li>
                  <li>
                    <strong>CO₂-Vermeidung:</strong> {de(zahlen.ertragKwh)} kWh × {de(CO2_G_PRO_KWH, 1)} g CO₂äqu/kWh = {de(zahlen.co2Kg)} kg ≈ {fmtCa(zahlen.co2T)} t pro Jahr.
                  </li>
                </ol>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
                  {!ausAnlage && `${de(ERTRAG_JE_KWP)} kWh/kWp: vorsichtiger Mittelwert für Österreich; der tatsächliche Ertrag hängt von Standort, Ausrichtung und Verschattung ab. `}
                  {de(CO2_G_PRO_KWH, 1)} g/kWh: Substitutionsfaktor für Photovoltaik-Strom in Österreich.
                </p>
              </div>
            )}
          </section>

          {/* Einordnung */}
          <section className="ov-druck-gruppe mt-8 border-t border-ink-200 pt-7" aria-labelledby="esg-einordnung">
            <h2 id="esg-einordnung" className="font-display text-[19px] font-bold text-ink-900">
              Einordnung für ESG und Nachhaltigkeitsbericht
            </h2>
            <ul className="mt-3 list-disc space-y-2.5 pl-5 text-[14.5px] leading-relaxed text-ink-700">
              <li>
                <strong>Vermiedene Emissionen sind nicht Ihre Scope-2-Bilanz.</strong> Nach dem GHG Protocol werden vermiedene Emissionen getrennt von Scope 1–3 ausgewiesen. Ihre Scope-2-Emissionen
                sinken um den <em>selbst verbrauchten</em> Solarstrom, der Netzbezug ersetzt – dafür brauchen Sie den gemessenen Eigenverbrauch. Unser{" "}
                <Link href="/rechner/co2-esg" className="font-semibold text-ov-700 underline underline-offset-2">
                  CO₂- &amp; ESG-Rechner
                </Link>{" "}
                rechnet das standort- und marktbasiert.
              </li>
              <li>
                <strong>VSME – freiwilliger Standard für KMU.</strong> Die EFRAG hat den „Voluntary Sustainability Reporting Standard for non-listed SMEs“ (VSME) entwickelt; die EU-Kommission hat ihn
                2025 als Empfehlung veröffentlicht. Er richtet sich an Unternehmen, die nicht berichtspflichtig sind, aber von Banken, Investoren oder Großkunden nach Nachhaltigkeitsdaten gefragt
                werden. Das Basismodul fragt unter anderem nach dem Energieverbrauch (davon erneuerbar) und den Treibhausgasemissionen in Scope 1 und 2 – Werte, die Ihre Anlage mitbestimmt.
              </li>
              <li>
                <strong>CSRD.</strong> Ob Ihr Unternehmen unter die EU-Nachhaltigkeitsberichterstattung (CSRD) fällt, hängt von Größe und Kapitalmarktorientierung ab; Anwendungsbereich und Fristen
                wurden mit dem EU-Omnibus-Paket 2025 überarbeitet. Prüfen Sie Ihre Pflichten mit Ihrer Steuerberatung oder Wirtschaftsprüfung.
              </li>
              <li>
                <strong>Kein Nachweis.</strong> Dieser Kurzbericht ist eine Orientierung auf Basis von Richtwerten. Er ist kein Nachweis, kein Prüfvermerk und ersetzt keine gemessenen Daten.
              </li>
            </ul>
          </section>

          {/* Messdaten */}
          <section className="ov-druck-gruppe mt-8 rounded-2xl bg-navy-950 p-6 text-white md:p-7" aria-labelledby="esg-messdaten">
            <h2 id="esg-messdaten" className="font-display text-[19px] font-bold">
              Messdaten für Ihren Bericht
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">
              Für belastbare Zahlen brauchen Sie die gemessene Erzeugung, den Eigenverbrauch und die Einspeisung des Berichtsjahres – aus dem Wechselrichter-Monitoring bzw. den Zählerdaten Ihres
              Netzbetreibers. Wir unterstützen Sie beim Export der Messdaten Ihrer Anlage.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
              <a href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(`Messdaten-Export ${firma}`)}`} className="inline-flex items-center gap-2 hover:text-ov-300">
                <Mail aria-hidden="true" className="h-4 w-4 text-ov-300" />
                {FIRMA.email}
              </a>
              <a href={FIRMA.telefonHref} className="inline-flex items-center gap-2 hover:text-ov-300">
                <Phone aria-hidden="true" className="h-4 w-4 text-ov-300" />
                {FIRMA.telefon}
              </a>
            </div>
          </section>

          {/* Quellen */}
          <div className="mt-8 border-t border-ink-200 pt-5 text-[12px] leading-relaxed text-ink-500">
            <p>
              <strong className="text-ink-700">Quellen:</strong> {!ausAnlage && `Spezifischer Ertrag – ${QUELLEN.ertrag.titel}. `}CO₂-Faktor – {QUELLEN.co2.titel} (Berechnung FH Technikum Wien,
              Basis E-Control-Betriebsstatistik).
            </p>
            <p className="mt-1.5">
              Erstellt von {FIRMA.name}, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort} · {BASE_URL.replace("https://", "")}/referenzen/projekte/{slug}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
