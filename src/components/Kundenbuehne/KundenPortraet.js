import { ArrowUpRight, Briefcase, MapPin, Quote } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import SocialIcon from "./SocialIcon";
import { datumAT, socialListe, urlKurz } from "@/lib/kundenbuehne";

/**
 * „Über <Firma>“ – redaktionelles Kundenporträt auf der Projektseite.
 * Website-Link ohne nofollow (redaktioneller Verweis), Zitat und Logo nur mit Freigabe.
 */
export default function KundenPortraet({ kunde, ort = "" }) {
  if (!kunde) return null;
  const firma = kunde.firma;
  const profile = socialListe(kunde);
  const absaetze = kunde.portraet ? kunde.portraet.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) : [];
  const ortText = kunde.ort || ort;
  const initialen = firma
    .replace(/[^A-Za-zÄÖÜäöü0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <Section tone="white" space="md" aria-labelledby="kunde-titel">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <Reveal>
          <Eyebrow className="mb-4">Unser Kunde</Eyebrow>
          <h2 id="kunde-titel" className="ov-h2 text-ink-900">
            Über {firma}
          </h2>
          {(kunde.branche || ortText) && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {kunde.branche && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-ov-50 px-3.5 py-1.5 text-[13.5px] font-semibold text-ov-800 ring-1 ring-ov-200/70">
                  <Briefcase aria-hidden="true" className="h-3.5 w-3.5" />
                  {kunde.branche}
                </li>
              )}
              {ortText && (
                <li className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3.5 py-1.5 text-[13.5px] font-semibold text-ink-700 ring-1 ring-ink-200/70">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {ortText}
                </li>
              )}
            </ul>
          )}
          {absaetze.length > 0 && (
            <div className="mt-6 max-w-[68ch] space-y-4 text-[16.5px] leading-relaxed text-ink-700">
              {absaetze.map((a) => (
                <p key={a.slice(0, 40)}>{a}</p>
              ))}
            </div>
          )}
          {kunde.zitat && (
            <figure className="mt-8 max-w-[64ch] rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
              <Quote aria-hidden="true" className="h-6 w-6 text-ov-500" />
              <blockquote className="mt-3 font-display text-[19px] font-semibold leading-snug text-ink-900">„{kunde.zitat.text}“</blockquote>
              {kunde.zitat.person && <figcaption className="mt-3 text-[14px] text-ink-500">– {kunde.zitat.person}, {firma}</figcaption>}
            </figure>
          )}
          {kunde.quellen.length > 0 && (
            <p className="mt-6 text-[12.5px] leading-relaxed text-ink-500">
              Quellen:{" "}
              {kunde.quellen.map((q, i) => (
                <span key={q.url}>
                  {i > 0 && " · "}
                  <a href={q.url} target="_blank" rel="noopener" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-800">
                    {q.titel}
                  </a>
                </span>
              ))}
              {kunde.geprueftAm && ` · geprüft am ${datumAT(kunde.geprueftAm)}`}
            </p>
          )}
        </Reveal>

        <Reveal dir="right" className="lg:pt-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white shadow-[0_30px_70px_-35px_rgba(3,18,43,0.7)] md:p-9">
            <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ov-500/30 blur-[90px]" />
            <div className="relative">
              {kunde.logoUrl ? (
                <div className="inline-flex h-16 items-center rounded-2xl bg-white px-4">
                  {/* Logo nur mit Freigabe des Kunden; fremder Host, daher ohne next/image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={kunde.logoUrl} alt={`Logo ${firma}`} className="max-h-11 w-auto max-w-[180px] object-contain" loading="lazy" />
                </div>
              ) : (
                <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ov-600 font-display text-[22px] font-extrabold">
                  {initialen || "•"}
                </span>
              )}
              <p className="mt-6 font-display text-[22px] font-extrabold leading-tight">{firma}</p>
              {kunde.website && <p className="mt-1 text-[14px] text-white/60">{urlKurz(kunde.website)}</p>}

              {kunde.website && (
                <a
                  href={kunde.website}
                  target="_blank"
                  rel="noopener"
                  className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-center text-[15px] font-semibold text-navy-900 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)] transition-colors hover:bg-ov-50"
                >
                  <span>Website von {firma} besuchen</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}

              {profile.length > 0 && (
                <div className="mt-7">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">{firma} im Netz</p>
                  <ul className="mt-3 flex flex-wrap gap-2.5">
                    {profile.map((s) => (
                      <li key={s.key}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener"
                          aria-label={`${firma} auf ${s.name}`}
                          title={s.name}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-navy-900"
                        >
                          <SocialIcon netz={s.key} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
