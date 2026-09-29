"use client";

// src/components/Team/Organigramm.js
//
// Gruppenstruktur als interaktives Organigramm: Knoten anklicken → Rolle,
// Beteiligung und Registerdaten erscheinen im Detailfeld. Desktop als Baum
// mit Verbindungslinien und Beteiligungsquoten, mobil als eingerückte Liste.
// Daten ausschließlich aus @/data/unternehmen und @/lib/site.

import { useState } from "react";
import { ArrowUpRight, Building2, Code, Factory, Handshake, Landmark, Network, Sun } from "lucide-react";
import { BETEILIGUNGEN, GESELLSCHAFTEN, GRUPPE } from "@/data/unternehmen";
import { FIRMA, SCHWESTER, SOLENSA } from "@/lib/site";

const gruppe = (name) => GRUPPE.find((g) => g.name === name) || {};
const register = (name) => BETEILIGUNGEN.find((b) => b.name === name);

const regZeilen = (r) =>
  r
    ? [
        ["Firmenbuch", r.register],
        ["Gericht", r.gericht],
        ["Sitz", r.sitz],
        ["Eingetragen", r.eingetragen],
      ].filter(([, w]) => w)
    : [];

const KNOTEN = {
  gruppe: {
    titel: "Ökovolt Gruppe",
    unter: "Familiengeführt · seit 2010",
    icon: Network,
    text: `${GRUPPE.find((g) => g.ebene === 0)?.text}. Zwei operative Landesgesellschaften, Projekt- und Betreibergesellschaften für große Flächen und ein Digitalpartner für Leittechnik und IT-Sicherheit.`,
    zeilen: [],
  },
  de: {
    titel: SCHWESTER.name,
    unter: "Stammhaus · Türkheim (DE)",
    icon: Building2,
    text: gruppe(SCHWESTER.name).text,
    zeilen: [
      ["Register", GESELLSCHAFTEN.de.register],
      ["Gericht", GESELLSCHAFTEN.de.gericht],
      ["Sitz", GESELLSCHAFTEN.de.sitz],
      ["Eingetragen", GESELLSCHAFTEN.de.eingetragen],
    ],
    link: { href: SCHWESTER.web, label: SCHWESTER.web.replace("https://www.", "") },
  },
  at: {
    titel: FIRMA.name,
    unter: "Ostermiething (AT) · diese Website",
    icon: Sun,
    hervor: true,
    text: gruppe(FIRMA.name).text,
    zeilen: [
      ["Firmenbuch", GESELLSCHAFTEN.at.register.replace("Firmenbuch ", "")],
      ["Gericht", GESELLSCHAFTEN.at.gericht],
      ["Sitz", GESELLSCHAFTEN.at.sitz],
      ["Eingetragen", GESELLSCHAFTEN.at.eingetragen],
      ["Gesellschafter", FIRMA.gesellschafter.map((g) => `${g.name.replace(" für Energie, Verkehr und Telekommunikation", "")} ${g.anteil}`).join(" · ")],
    ],
  },
  solensa: {
    titel: SOLENSA.name,
    unter: gruppe(SOLENSA.name).badge || "Digitalpartner",
    icon: Code,
    text: gruppe(SOLENSA.name).text,
    zeilen: [],
    link: { href: SOLENSA.web, label: SOLENSA.web.replace("https://www.", "") },
  },
  oekoinvest: {
    titel: "ÖkoInvest GmbH",
    unter: "Projekt­gesellschaft · Ostermiething",
    icon: Landmark,
    text: gruppe("ÖkoInvest GmbH").text,
    zeilen: [["Beteiligt", `${FIRMA.name} 22,60 % · PV GmbH 25,80 %`], ...regZeilen(register("ÖkoInvest GmbH"))],
  },
  pv: {
    titel: "PV GmbH",
    unter: "Vertrieb der Gruppe",
    icon: Handshake,
    text: gruppe("PV GmbH").text,
    zeilen: [["Beteiligung", gruppe("PV GmbH").anteil]],
  },
  gfl: {
    titel: "GFL – PV-Kraftwerk GmbH",
    unter: "Betreiber­gesellschaft",
    icon: Factory,
    text: gruppe("GFL – PV-Kraftwerk GmbH").text,
    zeilen: [["Gesellschafterin", gruppe("GFL – PV-Kraftwerk GmbH").anteil], ...regZeilen(register("GFL – PV-Kraftwerk GmbH"))],
  },
  hil: {
    titel: "HIL PV Kraftwerk GmbH",
    unter: "Gemeinschafts­gesellschaft",
    icon: Factory,
    text: gruppe("HIL PV Kraftwerk GmbH").text,
    zeilen: [["Gesellschafterin", gruppe("HIL PV Kraftwerk GmbH").anteil], ...regZeilen(register("HIL PV Kraftwerk GmbH"))],
  },
};

/* ------------------------------------------------------------ Bausteine */

function Knoten({ id, aktiv, setAktiv, klein = false, className = "" }) {
  const k = KNOTEN[id];
  const an = aktiv === id;
  return (
    <button
      type="button"
      onClick={() => setAktiv(id)}
      aria-pressed={an}
      className={`group relative z-10 flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-all duration-300 ${
        an
          ? "bg-navy-950 text-white shadow-[0_18px_40px_-18px_rgba(3,18,43,0.7)]"
          : k.hervor
            ? "bg-white ring-2 ring-ov-400 hover:-translate-y-0.5 hover:shadow-lg"
            : "bg-white ring-1 ring-ink-200/80 hover:-translate-y-0.5 hover:shadow-lg hover:ring-ov-300"
      } ${className}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl transition-colors ${klein ? "h-9 w-9" : "h-10 w-10"} ${
          an ? "bg-ov-500 text-white" : k.hervor ? "bg-ov-500 text-white" : "bg-ov-50 text-ov-700 group-hover:bg-ov-100"
        }`}
      >
        <k.icon aria-hidden="true" className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className={`block font-display font-bold leading-snug ${klein ? "text-[14px]" : "text-[15px]"} ${an ? "text-white" : "text-ink-900"}`}>{k.titel}</span>
        <span className={`mt-0.5 block text-[12.5px] leading-snug ${an ? "text-white/60" : "text-ink-500"}`}>{k.unter}</span>
      </span>
    </button>
  );
}

function Quote({ children, className = "" }) {
  return (
    <span className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-sand-50 px-2.5 py-0.5 text-[12px] font-bold text-ov-700 ring-1 ring-ov-200 ${className}`}>
      {children}
    </span>
  );
}

const V = ({ className = "" }) => <span aria-hidden="true" className={`absolute w-px bg-ink-300 ${className}`} />;
const H = ({ className = "" }) => <span aria-hidden="true" className={`absolute h-px bg-ink-300 ${className}`} />;

function Details({ id }) {
  const k = KNOTEN[id];
  return (
    <div key={id} className="ov-tab-panel">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500 text-white">
          <k.icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">{k.unter}</p>
      </div>
      <h3 className="mt-5 font-display text-[22px] font-extrabold leading-tight text-white">{k.titel}</h3>
      {k.text && <p className="mt-3 text-[15px] leading-relaxed text-white/70">{k.text}</p>}
      {k.zeilen.length > 0 && (
        <dl className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-[14px] leading-snug">
          {k.zeilen.map(([l, w]) => (
            <div key={l} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3">
              <dt className="text-white/45">{l}</dt>
              <dd className="text-white/85">{w}</dd>
            </div>
          ))}
        </dl>
      )}
      {k.link && (
        <a href={k.link.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-300 hover:text-white">
          {k.link.label}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Gesamt */

export default function Organigramm() {
  const [aktiv, setAktiv] = useState("at");
  const p = { aktiv, setAktiv };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
      {/* Desktop-Baum */}
      <div className="relative hidden rounded-[2rem] bg-white/60 p-8 ring-1 ring-ink-200/70 md:block xl:p-10" role="group" aria-label="Organigramm der Ökovolt Gruppe">
        <div className="ov-grid-bg-light pointer-events-none absolute inset-0 rounded-[2rem]" aria-hidden="true" />
        <div className="relative grid grid-cols-6 gap-x-4">
          {/* Ebene 0 */}
          <div className="col-span-2 col-start-3">
            <Knoten id="gruppe" {...p} />
          </div>
          {/* Verbindung 0 → 1 */}
          <div className="relative col-span-6 h-12">
            <V className="left-1/2 top-0 h-6" />
            <H className="left-[16.66%] right-[16.66%] top-6" />
            <V className="left-[16.66%] top-6 h-6" />
            <V className="left-1/2 top-6 h-6" />
            <V className="left-[83.33%] top-6 h-6" />
          </div>
          {/* Ebene 1 */}
          <div className="col-span-2">
            <Knoten id="de" {...p} />
          </div>
          <div className="col-span-2">
            <Knoten id="at" {...p} />
          </div>
          <div className="col-span-2">
            <Knoten id="solensa" {...p} />
          </div>
          {/* Verbindung AT → ÖkoInvest, PV GmbH → ÖkoInvest */}
          <div className="relative col-span-6 h-14">
            <V className="left-1/2 top-0 h-14" />
            <Quote className="left-1/2 top-1/2">22,60 %</Quote>
          </div>
          {/* Ebene 2 */}
          <div className="relative col-span-2 col-start-3">
            <Knoten id="oekoinvest" {...p} />
            <H className="-right-4 top-1/2 w-4 border-t border-dashed border-ink-300 bg-transparent" />
          </div>
          <div className="relative col-span-2">
            <Knoten id="pv" {...p} klein />
            <Quote className="-left-2 -top-3.5 translate-x-0">25,80 %</Quote>
          </div>
          {/* Verbindung ÖkoInvest → Kraftwerke */}
          <div className="relative col-span-6 h-14">
            <V className="left-1/2 top-0 h-7" />
            <H className="left-[33.33%] right-[33.33%] top-7" />
            <V className="left-[33.33%] top-7 h-7" />
            <V className="left-[66.66%] top-7 h-7" />
            <Quote className="left-[33.33%] top-9">100 %</Quote>
            <Quote className="left-[66.66%] top-9">50 %</Quote>
          </div>
          {/* Ebene 3 */}
          <div className="col-span-2 col-start-2">
            <Knoten id="gfl" {...p} klein />
          </div>
          <div className="col-span-2">
            <Knoten id="hil" {...p} klein />
          </div>
        </div>
        <p className="relative mt-8 text-[13px] leading-relaxed text-ink-500">
          Prozentangaben: Beteiligungsquoten laut Unternehmensangaben. Die {FIRMA.name} ist gesellschaftsrechtlich eigenständig –
          Gesellschafter sind {FIRMA.gesellschafter.map((g) => g.name.replace(" für Energie, Verkehr und Telekommunikation", "")).join(" und ")}.
        </p>
      </div>

      {/* Mobil: eingerückter Baum */}
      <ol className="space-y-2.5 md:hidden" aria-label="Organigramm der Ökovolt Gruppe">
        <li>
          <Knoten id="gruppe" {...p} />
          <ol className="ml-4 mt-2.5 space-y-2.5 border-l border-ink-300 pl-4">
            <li>
              <Knoten id="at" {...p} />
              <ol className="ml-4 mt-2.5 space-y-2.5 border-l border-ink-300 pl-4">
                <li>
                  <p className="mb-1.5 text-[12px] font-bold text-ov-700">22,60 % · zusätzlich PV GmbH 25,80 %</p>
                  <Knoten id="oekoinvest" {...p} klein />
                  <ol className="ml-4 mt-2.5 space-y-2.5 border-l border-ink-300 pl-4">
                    <li>
                      <p className="mb-1.5 text-[12px] font-bold text-ov-700">100 %</p>
                      <Knoten id="gfl" {...p} klein />
                    </li>
                    <li>
                      <p className="mb-1.5 text-[12px] font-bold text-ov-700">50 %</p>
                      <Knoten id="hil" {...p} klein />
                    </li>
                  </ol>
                </li>
                <li>
                  <Knoten id="pv" {...p} klein />
                </li>
              </ol>
            </li>
            <li>
              <Knoten id="de" {...p} />
            </li>
            <li>
              <Knoten id="solensa" {...p} />
            </li>
          </ol>
        </li>
      </ol>

      {/* Detailfeld */}
      <aside aria-live="polite" className="ov-noise relative self-start overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white lg:sticky lg:top-28 xl:p-9">
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-ov-500/25 blur-[90px]" />
        <div className="relative">
          <Details id={aktiv} />
          <p className="mt-8 border-t border-white/10 pt-4 text-[12.5px] text-white/40">Knoten im Organigramm anklicken, um Details zu sehen.</p>
        </div>
      </aside>
    </div>
  );
}
