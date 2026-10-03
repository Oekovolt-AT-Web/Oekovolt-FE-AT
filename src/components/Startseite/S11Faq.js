// src/components/Startseite/S11Faq.js
//
// Startseite – Abschnitt: FAQ mit Wissen & Gemeinsam.
// Eingebunden in src/app/page.js (Prop `tone`: Hintergrund im Seitenrhythmus).
//
// Gestaltung: links (Desktop mitlaufend) Überschrift, Direktkontakt und die erhöhte Karte
// „Wissen & Gemeinsam“; rechts das eigene Akkordeon (s10-akkordeon.js) als Kartenstapel –
// die offene Frage hebt sich weiß ab. Aufbau beim Eintritt: Fragen gleiten gestaffelt ein.
// Das exportierte FAQ-Array speist das FAQPage-Schema (und ggf. später weitere strukturierte Daten).

import { BookOpen, Gift, Handshake, HeartHandshake, Library, Newspaper, Phone, Trophy } from "lucide-react";
import Link from "next/link";
import { FIRMA, SCHWESTER } from "@/lib/site";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import S10Sicht from "./s10-sicht";
import S10Akkordeon from "./s10-akkordeon";

const MEHR = [
  { gruppe: "Wissen", titel: "Ratgeber", text: "Fachartikel für Geschäftsführung, Technik und Einkauf – österreichische Rechtslage.", href: "/ratgeber", icon: BookOpen },
  { gruppe: "Wissen", titel: "Photovoltaik-Lexikon", text: "Von Netzebene bis TOR Erzeuger: Fachbegriffe kurz erklärt.", href: "/wissen/lexikon", icon: Library },
  { gruppe: "Wissen", titel: "Presse & Neuigkeiten", text: "Projekte, Termine und Neuigkeiten aus dem Unternehmen.", href: "/presse", icon: Newspaper },
  { gruppe: "Gemeinsam", titel: "Ökovolt PV Award", text: "Jährlich zeichnen wir Kundinnen und Kunden für die besten Anlagen und Nachhaltigkeitsinvestitionen aus.", href: "/pv-award", icon: Trophy },
  { gruppe: "Gemeinsam", titel: "Elektro-Partner werden", text: "Elektrotechnik-Betriebe registrieren sich als Partner – Ökovolt ist die zentrale Plattform für Planung, Material und Projekte.", href: "/partner", icon: Handshake },
  { gruppe: "Gemeinsam", titel: "Sponsoring", text: "Wir unterstützen Vereine, Kultur und Nachwuchs in den Regionen, in denen wir bauen.", href: "/sponsoring", icon: HeartHandshake },
];

export const FAQ = [
  {
    q: "Für wen plant und baut Ökovolt Photovoltaikanlagen?",
    a: "Ökovolt plant, errichtet und betreibt Photovoltaikanlagen vor allem für Gewerbe und Industrie, Land- und Forstwirtschaft, Hotellerie und Tourismus sowie Gemeinden und Länder – auf Dächern, als Freiflächen- oder Agri-PV-Anlage. Private Projekte übernehmen wir nachgeordnet, insbesondere Premium-Objekte und Chalets in alpinen Lagen.",
  },
  {
    q: "In welchen Regionen ist Ökovolt tätig?",
    a: `In ganz Österreich, in allen neun Bundesländern. Firmensitz ist ${FIRMA.strasse} in ${FIRMA.plz} ${FIRMA.ort} im Innviertel (${FIRMA.bundesland}), direkt an der Grenze zu Salzburg.`,
  },
  {
    q: "Wer steht hinter Ökovolt Österreich?",
    a: `Die ${FIRMA.name} wurde 2012 gegründet und wird von ${FIRMA.geschaeftsfuehrer} geführt. Gesellschafter sind ${FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(" und ")}. Standards, Prozesse und Marke teilen wir mit der deutschen Schwestergesellschaft ${SCHWESTER.name} in ${SCHWESTER.ort}, die seit 2010 Photovoltaikanlagen errichtet und Inhaberin der Marken- und Websiterechte ist.`,
  },
  {
    q: "Was unterscheidet Ökovolt von anderen PV-Errichtern?",
    a: "Wir decken Planung, Bau und Betrieb aus einer Hand ab und setzen dafür eigene Systeme ein: einen selbst entwickelten Parkregler (EZA-Regler) für den österreichischen Netzanschluss sowie eigene Fernwartungs- und SCADA-Systeme. Und wir wissen, worauf es im Betrieb ankommt – die Gründer betreiben seit 2012 eigene Solarparks. Wir bauen, was wir selbst betreiben würden.",
  },
  {
    q: "Welche Förderungen gibt es für Photovoltaik in Österreich?",
    a: "Die wichtigste Bundesförderung ist der EAG-Investitionszuschuss der OeMAG; 2026 beträgt er je nach Kategorie bis zu 150 €/kWp (Kategorie A; C und D höchstens 130 bzw. 120 €/kWp), maximal 30 % der förderfähigen Kosten. Betriebe nutzen zusätzlich den Investitionsfreibetrag, der für Anschaffungen bis 31. Dezember 2026 für ökologische Investitionen wie PV befristet 22 % beträgt. Dazu kommen Landesförderungen (Stand: September 2026).",
  },
  {
    q: "Wie starte ich ein Projekt mit Ökovolt?",
    a: "Am schnellsten über den Angebots-Konfigurator: Objektart, Fläche, Jahresverbrauch, Lastgang und Netzebene angeben – wir melden uns mit einer Ersteinschätzung. Alternativ buchen Sie online einen Beratungstermin per Telefon, Video oder vor Ort oder rufen uns direkt an.",
  },
];

export default function StartFaq({ tone = "white" }) {
  const gruppen = ["Wissen", "Gemeinsam"].map((g) => ({ g, eintraege: MEHR.filter((w) => w.gruppe === g) }));
  return (
    <Section data-start="faq" tone={tone} space="lg">
      {/* Reihenfolge mobil: Überschrift → Fragen → Wissen & Gemeinsam; Desktop: links Überschrift + Karte, rechts Fragen */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-12 xl:gap-x-20">
        <div className="lg:col-start-1 lg:row-start-1">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Ökovolt Österreich – kurz beantwortet"
            lead={`Noch Fragen? Unser Team in ${FIRMA.ort} berät Sie persönlich.`}
          />
          <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/faqs" variant="secondary" pfeil>
              Alle FAQs
            </Button>
            <a
              href={FIRMA.telefonHref}
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-full text-[15px] font-semibold text-ink-800 outline-none transition-colors hover:text-ov-700 focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ov-100 text-ov-700 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                <Phone aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="ov-num">{FIRMA.telefon}</span>
            </a>
          </Reveal>
        </div>

        <S10Sicht schwelle={0.1} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <S10Akkordeon items={FAQ} name="s10-faq-start" />
        </S10Sicht>

        {/* Wissen & Gemeinsam – erhöhte Karte statt eigener Sektion */}
        <div className="lg:col-start-1 lg:row-start-2">
          <Reveal delay={200}>
            <nav
              aria-label="Wissen & Gemeinsam"
              className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_56px_-28px_rgba(15,23,42,0.22)] ring-1 ring-ink-200/70"
            >
              <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-ov-400/70 to-transparent" />
              <div className="flex items-center justify-between gap-4 px-6 pt-6 md:px-7 md:pt-7">
                <p className="font-display text-[17px] font-bold tracking-[-0.015em] text-ink-900">Wissen &amp; Gemeinsam</p>
                <svg aria-hidden="true" viewBox="0 0 64 20" className="h-5 w-16 text-ov-500">
                  <path d="M2 14 C 14 14, 18 4, 32 4 S 50 14, 62 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
                  <circle cx="32" cy="4" r="2.6" fill="#ffc53d" />
                </svg>
              </div>
              <div className="grid gap-x-4 gap-y-5 px-3 pb-4 pt-4 sm:grid-cols-2 md:px-4">
                {gruppen.map(({ g, eintraege }) => (
                  <div key={g}>
                    <p className="px-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-400">{g}</p>
                    <ul className="mt-1.5">
                      {eintraege.map((w) => (
                        <li key={w.href}>
                          <Link
                            href={w.href}
                            title={w.text}
                            className="group flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 outline-none transition-colors hover:bg-sand-50 focus-visible:ring-2 focus-visible:ring-ov-500"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-700 ring-1 ring-inset ring-ov-100 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                              <w.icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
                            </span>
                            <span className="min-w-0 flex-1 text-[14.5px] font-semibold leading-snug text-ink-800 transition-colors group-hover:text-ov-700">{w.titel}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="flex items-center gap-3 border-t border-ink-100 bg-sand-50/70 px-6 py-4 text-[13.5px] leading-snug text-ink-600 md:px-7">
                <Gift aria-hidden="true" className="h-4 w-4 shrink-0 text-sun-500" />
                <span>
                  Bestandskunden: exklusive Angebote in der{" "}
                  <Link href="/service/vorteilswelt" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                    Ökovolt Vorteilswelt
                  </Link>
                  .
                </span>
              </p>
            </nav>
          </Reveal>
        </div>
      </div>
      <style>{STIL}</style>
    </Section>
  );
}

const STIL = `
.s10-f-item {
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 0 1px rgba(196, 202, 213, 0.45);
  transition: background-color 400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.s10-f-item:hover { background-color: rgba(255, 255, 255, 0.85); }
.s10-f-item[open] {
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 22px 48px -26px rgba(15, 23, 42, 0.24), inset 0 0 0 1px rgba(174, 208, 131, 0.5);
}
.s10-f-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 22px;
  bottom: 22px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #aed083, #669933);
  transform: scaleY(0);
  transform-origin: 50% 0%;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}
.s10-f-item[open]::before { transform: scaleY(1); }
.s10-f-senkrecht { transform-box: fill-box; transform-origin: center; transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1); }
.s10-f-item[open] .s10-f-senkrecht { transform: rotate(90deg); }
@media (prefers-reduced-motion: no-preference) {
  @supports (interpolate-size: allow-keywords) {
    .s10-f-liste { interpolate-size: allow-keywords; }
    .s10-f-item::details-content {
      block-size: 0;
      overflow: hidden;
      transition: block-size 480ms cubic-bezier(0.22, 1, 0.36, 1), content-visibility 480ms allow-discrete;
    }
    .s10-f-item[open]::details-content { block-size: auto; }
  }
  .s10-f-item[open] .s10-f-antwort { animation: s10-f-auf 650ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  [data-s10-an] .s10-f-item {
    transition: background-color 400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 90ms), transform 800ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 90ms);
  }
  [data-s10-bereit]:not([data-s10-an]) .s10-f-item { opacity: 0; transform: translate3d(0, 18px, 0); }
}
@keyframes s10-f-auf {
  from { opacity: 0; transform: translate3d(0, 8px, 0); }
  to { opacity: 1; transform: none; }
}
`;
