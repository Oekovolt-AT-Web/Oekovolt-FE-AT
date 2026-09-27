"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";

import CookieBanner from "../Cookies/cookiecomponent";
import { NAVIGATION, KONTAKT } from "@/data/navigation";
import LiveTicker from "@/components/ui/LiveTicker";

const SOCIAL = [
  { href: "https://www.facebook.com/oekovoltdeutschland", label: "Facebook", Icon: FaFacebookF },
  { href: "https://x.com/Oekovolt_De", label: "X (Twitter)", Icon: FaXTwitter },
  { href: "https://www.instagram.com/oekovoltdeutschland/", label: "Instagram", Icon: FaInstagram },
  { href: "https://de.pinterest.com/oekovoltdeutschland/", label: "Pinterest", Icon: FaPinterestP },
  { href: "https://www.linkedin.com/company/%C3%B6kovoltdeutchland", label: "LinkedIn", Icon: FaLinkedinIn },
];

// Spalten aus der zentralen Navigation ableiten
const spalte = (titel) => {
  const n = NAVIGATION.find((x) => x.title === titel);
  return n ? { titel: n.title, links: n.groups.flatMap((g) => g.items).map(({ name, href }) => ({ name, href })) } : null;
};

const SPALTEN = [
  spalte("Produkte"),
  spalte("Service"),
  spalte("Rechner & Tools"),
  {
    titel: "Wissen & Förderung",
    links: [
      { name: "Ratgeber", href: "/ratgeber" },
      { name: "Photovoltaik-Lexikon", href: "/wissen/lexikon" },
      { name: "FAQs", href: "/faqs" },
      { name: "Presse & Neuigkeiten", href: "/presse" },
      { name: "RSS-Feed", href: "/rss.xml" },
      { name: "Landesförderungen", href: "/forderungen/landesforderungen" },
      { name: "Steuerliche Vorteile", href: "/forderungen/steuerlich" },
      { name: "Referenzprojekte", href: "/referenzen/projekte" },
      { name: "Team", href: "/uber-uns/team" },
      { name: "Jobs", href: "/uber-uns/jobs" },
      { name: "Termin buchen", href: "/termin" },
    ],
  },
].filter(Boolean);

export default function Footer() {
  const [popup, setPopup] = useState(false);
  const jahr = new Date().getFullYear();

  return (
    <footer role="contentinfo" aria-label="Fußbereich Ökovolt Deutschland" className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-ov-500/15 blur-[140px]" />

      <div className="ov-container pt-16 md:pt-20">
        {/* Kopfzeile */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Link href="/" className="relative block h-[62px] w-[200px]" aria-label="Zur Startseite">
              <Image src="/Logo-Oekovolt-Gruen-mit-Weiss.webp" alt="Ökovolt GmbH Solartechnik" fill sizes="200px" className="object-contain object-left" />
            </Link>
            <p className="mt-5 font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-bold leading-tight tracking-tight">
              Solarenergie für alle – <span className="ov-text-gradient-light">einfach, sicher, wirtschaftlich.</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/angebot" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold transition-colors hover:bg-ov-700">
              Angebot anfragen
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a href={KONTAKT.telefonHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10">
              <Phone aria-hidden="true" className="h-4 w-4" />
              {KONTAKT.telefon}
            </a>
          </div>
        </div>

        {/* Linkspalten */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-6 text-[15px] text-white/70">
            <div className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
              <address className="not-italic">
                ÖKOVOLT GmbH Solartechnik<br />
                {KONTAKT.strasse}<br />
                {KONTAKT.ort}, Deutschland
              </address>
            </div>
            <p className="flex gap-3">
              <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
              <a href={`mailto:${KONTAKT.email}`} className="transition-colors hover:text-white">{KONTAKT.email}</a>
            </p>
            <div className="flex gap-3">
              <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                {KONTAKT.oeffnungszeiten.map((o) => (
                  <div key={o.tage} className="contents">
                    <dt>{o.tage}</dt>
                    <dd className="ov-num text-white">{o.zeit}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className="flex gap-2 pt-2">
              {SOCIAL.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ökovolt auf ${label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/80 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-ov-500 hover:text-white"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {SPALTEN.map((s) => (
            <nav key={s.titel} aria-label={s.titel}>
              {/* role="heading" statt <h2>: globale h2-Regeln (Display-Schrift, Laufweite) würden das Aussehen ändern */}
              <p role="heading" aria-level={2} className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">{s.titel}</p>
              <ul className="mt-5 space-y-3">
                {s.links.map((l) => (
                  <li key={l.href + l.name}>
                    <Link href={l.href} className="text-[14.5px] text-white/75 transition-colors hover:text-ov-300">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Live-Leiste */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/10 md:flex-row md:items-center md:justify-between">
          <LiveTicker />
          <p className="text-[12px] text-white/60">Daten: Fraunhofer ISE Energy-Charts (CC BY 4.0)</p>
        </div>

        {/* Rechtliches */}
        <div className="flex flex-col gap-4 py-8 text-[13.5px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {jahr} ÖKOVOLT GmbH Solartechnik · Alle Rechte vorbehalten</p>
          <nav aria-label="Rechtliche Links">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><button type="button" onClick={() => setPopup(true)} className="transition-colors hover:text-white">Privatsphäre-Einstellungen</button></li>
              <li><Link href="/impressum" className="transition-colors hover:text-white">Impressum</Link></li>
              <li><Link href="/datenschutz" className="transition-colors hover:text-white">Datenschutz</Link></li>
              <li><Link href="/agb" className="transition-colors hover:text-white">AGB</Link></li>
              <li><a href="https://oekovolt.integrityline.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Hinweisgebersystem</a></li>
              <li><Link href="/barrierefreiheit" className="transition-colors hover:text-white">Barrierefreiheit</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      {popup && <CookieBanner forceShow={popup} onClose={() => setPopup(false)} />}
    </footer>
  );
}
