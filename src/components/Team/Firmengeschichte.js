// src/components/Team/Firmengeschichte.js
//
// Firmengeschichte der ÖKOVOLT-Gruppe: Zeitleiste, die beiden Generationen
// der Geschäftsführung, die Salzburg-AG-Partnerschaft, die Gruppenstruktur
// und die oeffentlich abfragbaren Registerdaten.
//
// Fuer den dunklen Abschnitt (tone="navy") gebaut.
// Inhalte: @/data/unternehmen

import {
  Building2,
  Code,
  ExternalLink,
  Flag,
  Handshake,
  Home,
  MapPin,
  Network,
  ShieldCheck,
  Sunrise,
  TrendingUp,
  Wrench,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import {
  BETEILIGUNGEN,
  CLAIM,
  HALTUNG,
  HEUTE,
  MARKE,
  GENERATIONEN,
  GESELLSCHAFTEN,
  GRUPPE,
  MEILENSTEINE,
  ROLLEN_DE,
  SALZBURG_AG,
  STAND,
  URSPRUNG,
} from "@/data/unternehmen";

const ICONS = { Building2, Code, Flag, Handshake, Home, Network, ShieldCheck, Sunrise, TrendingUp, Wrench };

/**
 * Laenderkennzeichen als Text-Badge statt Flaggen-Emoji.
 * Windows stellt Regional-Indicator-Paare (🇩🇪) grundsaetzlich nicht als
 * Flagge dar - und ohne Emoji-Font erscheinen sie als leere Kaestchen.
 */
function Land({ code, name }) {
  return (
    <p className="flex items-center gap-2 text-[14px]">
      <span className="rounded bg-white/10 px-1.5 py-0.5 font-display text-[11.5px] font-bold tracking-wide text-white/70">
        {code}
      </span>
      <span className="font-semibold text-ov-300">{name}</span>
    </p>
  );
}

const datumLang = (iso) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

/* ------------------------------------------------------------------ Bausteine */

function Ueberschrift({ kopf, titel, children }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{kopf}</p>
      <h3 className="mt-3 font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-extrabold leading-tight tracking-tight text-white">
        {titel}
      </h3>
      {children && <p className="mt-4 text-[16px] leading-relaxed text-white/65">{children}</p>}
    </div>
  );
}

function Kennzahl({ wert, label }) {
  return (
    <div className="ov-glass rounded-2xl p-5 text-center">
      <p className="font-display text-[clamp(1.4rem,1.1rem+1vw,1.9rem)] font-extrabold leading-none text-ov-300">{wert}</p>
      <p className="mt-2 text-[14px] leading-snug text-white/65">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ Zeitleiste */

function Zeitleiste() {
  return (
    <ol className="relative mx-auto mt-14 max-w-5xl md:mt-20">
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-ov-400 via-white/20 to-ov-400 md:left-1/2"
      />
      {MEILENSTEINE.map((m, i) => {
        const Icon = ICONS[m.icon];
        const rechts = i % 2 === 1;
        return (
          <Reveal
            as="li"
            key={m.jahr}
            delay={i * 70}
            dir={rechts ? "right" : "left"}
            // Ab md ruecken die Stationen zusammen (-mt-24), damit die
            // Karten links und rechts ineinandergreifen. Die erste darf das
            // nicht, sonst rutscht sie in den Vorspann.
            // Bewusst ueber den Index statt md:first:mt-0: Erstes Kind der
            // <ol> ist die Zeitleisten-Linie, `:first-child` trifft also nie
            // eine Station.
            className={`relative grid gap-4 pb-10 pl-14 last:pb-0 md:grid-cols-2 md:gap-16 md:pb-6 md:pl-0 ${
              i === 0 ? "md:mt-0" : "md:-mt-24"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full md:left-1/2 md:-translate-x-1/2 ${
                m.hervorgehoben
                  ? "bg-ov-500 text-white shadow-[0_0_0_6px_rgba(102,153,51,0.25)]"
                  : "bg-navy-950 text-ov-300 ring-2 ring-ov-400"
              }`}
            >
              {Icon ? <Icon className="h-4 w-4" /> : <span className="h-2.5 w-2.5 rounded-full bg-ov-400" />}
            </span>

            <div className={rechts ? "md:col-start-2" : "md:text-right"}>
              <p className="font-display text-[clamp(1.6rem,1.2rem+1.3vw,2.4rem)] font-extrabold leading-none tracking-tight text-white">
                {m.jahr}
              </p>
              <div
                className={`ov-glass mt-4 inline-block w-full rounded-3xl p-5 text-left md:p-6 ${
                  m.hervorgehoben ? "ring-1 ring-ov-400/40" : ""
                }`}
              >
                <h4 className="font-display text-[17px] font-bold text-white">{m.titel}</h4>
                <div className="mt-1.5 space-y-3 text-[15px] leading-relaxed text-white/65">
                  {(Array.isArray(m.text) ? m.text : [m.text]).map((absatz, k) => (
                    <p key={k}>{absatz}</p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}

/* ---------------------------------------------------------------- Generationen */

function Person({ p, delay }) {
  return (
    <Reveal delay={delay} className="ov-glass flex h-full flex-col rounded-3xl p-6 md:p-7">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ov-500 font-display text-[18px] font-extrabold text-white"
        >
          {p.initialen}
        </span>
        <div className="min-w-0">
          <p className="font-display text-[18px] font-bold leading-snug text-white">{p.name}</p>
          <p className="mt-0.5 text-[14px] leading-snug text-white/55">{p.rolle}</p>
        </div>
      </div>

      <p className="mt-5 font-display text-[15.5px] font-bold text-ov-300">{p.schlagzeile}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-white/65">{p.text}</p>

      {p.kompetenzen && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {p.kompetenzen.map((k) => {
            const Icon = ICONS[k.icon];
            return (
              <li key={k.titel} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ov-500/20 text-ov-300">
                  {Icon && <Icon aria-hidden="true" className="h-[18px] w-[18px]" />}
                </span>
                <p className="mt-3 font-display text-[14.5px] font-bold text-white">{k.titel}</p>
                <p className="mt-1 text-[13.5px] leading-snug text-white/55">{k.text}</p>
              </li>
            );
          })}
        </ul>
      )}
    </Reveal>
  );
}

function Generationen() {
  return (
    <div className="mt-20 space-y-14 md:mt-28">
      {GENERATIONEN.map((g) => (
        <div key={g.id}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-white/10 pb-4">
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.12em] text-ov-300">{g.kopf}</p>
            <p className="font-display text-[19px] font-bold text-white">{g.titel}</p>
          </div>
          {g.einleitung && (
            <p className="mt-5 max-w-3xl text-[15.5px] leading-relaxed text-white/60">{g.einleitung}</p>
          )}
          <div className={`mt-7 grid gap-5 ${g.personen.length > 1 ? "lg:grid-cols-2" : ""}`}>
            {g.personen.map((p, i) => (
              <Person key={p.name} p={p} delay={i * 90} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Salzburg AG */

function Partnerschaft() {
  const s = SALZBURG_AG;
  return (
    <div className="mt-20 md:mt-28">
      <Ueberschrift kopf={`${s.zeitraum} · ${s.kopf}`} titel={s.titel}>
        {s.text}
      </Ueberschrift>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {s.kennzahlen.map((k) => (
          <Kennzahl key={k.label} {...k} />
        ))}
      </div>

      <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
        {s.punkte.map((p) => (
          <li key={p} className="flex gap-3 rounded-2xl bg-white/[0.05] p-4 text-[15px] leading-relaxed text-white/75 ring-1 ring-white/10">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-400" />
            {p}
          </li>
        ))}
      </ul>

    </div>
  );
}

/* -------------------------------------------- Betreiber aus Überzeugung */

function Haltung() {
  // Platzhalter-Kennzahlen (wert: null) bleiben unsichtbar, damit nie ein
  // "[X]" auf der Seite steht.
  const zahlen = HEUTE.filter((z) => z.wert);
  return (
    <div className="mt-20 md:mt-28">
      <Ueberschrift kopf={HALTUNG.kopf} titel={HALTUNG.titel} />
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {HALTUNG.absaetze.map((a, i) => (
          <Reveal key={i} delay={i * 80}>
            <p className="text-[16px] leading-relaxed text-white/70">{a}</p>
          </Reveal>
        ))}
      </div>
      {zahlen.length > 1 && (
        <div className={`mx-auto mt-10 grid max-w-3xl gap-4 ${zahlen.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {zahlen.map((z) => (
            <Kennzahl key={z.label} wert={z.wert} label={z.label} />
          ))}
        </div>
      )}
      {zahlen.length === 1 && (
        <p className="mt-10 text-center">
          <span className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-extrabold text-ov-300">{zahlen[0].wert}</span>
          <span className="ml-3 text-[15px] text-white/60">{zahlen[0].label}</span>
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Ursprung DE */

function Ursprung() {
  return (
    <div className="mt-20 md:mt-28">
      <Ueberschrift kopf={URSPRUNG.kopf} titel={URSPRUNG.titel} />
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {URSPRUNG.absaetze.map((a, i) => (
          <Reveal key={i} delay={i * 80}>
            <p className="text-[16px] leading-relaxed text-white/70">{a}</p>
          </Reveal>
        ))}
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {URSPRUNG.kennzahlen.map((k) => (
          <Kennzahl key={k.label} {...k} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Wer macht heute was */

function RollenDe() {
  const r = ROLLEN_DE;
  return (
    <div className="mt-20 md:mt-28">
      <Ueberschrift kopf={r.kopf} titel={r.titel}>
        {r.lead}
      </Ueberschrift>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-3">
        {r.eintraege.map((e, i) => (
          <Reveal
            key={e.name}
            delay={i * 80}
            className={`ov-glass rounded-3xl p-6 ${e.hervorgehoben ? "ring-1 ring-ov-400/40" : ""}`}
          >
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">{e.rolle}</p>
            <p className="mt-2 font-display text-[17px] font-bold text-white">{e.name}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{e.text}</p>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-5xl text-[13px] font-semibold uppercase tracking-[0.14em] text-white/40">
        Eine Betreibergesellschaft je Solarpark
      </p>
      <div className="mx-auto mt-4 grid max-w-5xl gap-3 sm:grid-cols-3">
        {r.parks.map((pk) => (
          <div key={pk.name} className="rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10">
            <p className="font-display text-[15.5px] font-bold text-white">{pk.name}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[13.5px] font-semibold text-ov-300">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {pk.ort}
              {pk.jahr && <span className="text-white/40">· {pk.jahr}</span>}
            </p>
            <p className="mt-2 text-[14px] leading-snug text-white/55">{pk.text}</p>
          </div>
        ))}
      </div>

      {r.weitere?.length > 0 && (
        <p className="mx-auto mt-6 max-w-5xl text-[13.5px] leading-relaxed text-white/45">
          Weitere Beteiligungen laut Jahresabschluss 2021:{" "}
          {r.weitere.map((w) => w.name).join(" · ")}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- Gruppe */

function Gruppe() {
  const holding = GRUPPE.find((g) => g.ebene === 0);
  const landes = GRUPPE.filter((g) => g.ebene === 1);
  const beteiligungen = GRUPPE.filter((g) => g.ebene === 2);

  return (
    <div className="mt-20 md:mt-28">
      <Ueberschrift kopf="Unternehmensgruppe" titel="Die ÖKOVOLT Gruppe">
        Eine starke Struktur für Photovoltaik, Projektentwicklung und Vertrieb.
      </Ueberschrift>

      {holding && (
        <div className="mx-auto mt-10 max-w-md rounded-3xl bg-ov-500 p-5 text-center">
          <p className="font-display text-[19px] font-extrabold text-white">{holding.name}</p>
          <p className="mt-1 text-[14px] text-white/80">{holding.text}</p>
        </div>
      )}

      <div aria-hidden="true" className="mx-auto h-8 w-px bg-white/20" />

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {landes.map((g) => {
          const reg = GESELLSCHAFTEN[g.gesellschaft];
          return (
            <div key={g.name} className="ov-glass rounded-3xl p-6 ring-1 ring-ov-400/30">
              <Land code={g.flagge} name={reg?.land || g.flagge} />
              <p className="mt-2 font-display text-[17px] font-bold text-white">{g.name}</p>
              <p className="mt-1.5 text-[14.5px] leading-snug text-white/60">{g.text}</p>
            </div>
          );
        })}
      </div>

      <div aria-hidden="true" className="mx-auto mt-4 h-8 w-px bg-white/20" />

      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {beteiligungen.map((g) => (
          <div key={g.name} className="rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-[15.5px] font-bold text-white">{g.name}</p>
              {g.badge && (
                <span className="rounded-full bg-ov-500/25 px-2.5 py-0.5 text-[12px] font-semibold text-ov-300">
                  {g.badge}
                </span>
              )}
            </div>
            {g.anteil && <p className="mt-1.5 text-[13.5px] font-semibold text-ov-300">{g.anteil}</p>}
            {g.text && <p className="mt-1.5 text-[14px] leading-snug text-white/55">{g.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- Registerdaten */

function Register() {
  const eintraege = [GESELLSCHAFTEN.de, GESELLSCHAFTEN.at];
  return (
    <div className="mt-20 md:mt-28">
      <Ueberschrift kopf="Transparenz" titel="Öffentlich abfragbar">
        Jede Angabe zu unseren operativen Gesellschaften lässt sich im Handelsregister bzw. im
        österreichischen Firmenbuch nachschlagen.
      </Ueberschrift>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        {eintraege.map((g) => (
          <div key={g.register} className="ov-glass rounded-3xl p-6">
            <Land code={g.flagge} name={g.land} />
            <p className="mt-2 font-display text-[17px] font-bold text-white">{g.name}</p>

            <dl className="mt-4 space-y-2 text-[14.5px] leading-relaxed">
              {[
                ["Sitz", g.sitz],
                ["Register", g.register],
                ["Registergericht", g.gericht],
                ["Eingetragen", g.eingetragen],
                ["USt-IdNr.", g.ustId],
              ]
                .filter(([, wert]) => wert)
                .map(([label, wert]) => (
                  <div key={label} className="flex flex-wrap gap-x-2">
                    <dt className="w-32 shrink-0 text-white/45">{label}</dt>
                    <dd className="min-w-0 flex-1 text-white/80">{wert}</dd>
                  </div>
                ))}
            </dl>

            <a
              href={g.website}
              className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-300 transition-colors hover:text-white"
            >
              {g.website.replace("https://www.", "")}
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>

      {BETEILIGUNGEN?.length > 0 && (
        <div className="mx-auto mt-6 max-w-4xl">
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Projektgesellschaften im österreichischen Firmenbuch
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {BETEILIGUNGEN.map((b) => (
              <div key={b.register} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="font-display text-[14.5px] font-bold leading-snug text-white">{b.name}</p>
                <p className="mt-1.5 text-[13.5px] font-semibold text-ov-300">{b.register}</p>
                <p className="mt-1 text-[13px] leading-snug text-white/45">{b.gericht}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-[13px] text-white/40">Stand der Angaben: {datumLang(STAND)}</p>
    </div>
  );
}

/* --------------------------------------------------------------------- Seite */

export default function Firmengeschichte() {
  return (
    <div className="relative">
      <Zeitleiste />
      <Haltung />
      <Ursprung />
      <Generationen />
      <Partnerschaft />
      <RollenDe />
      <Gruppe />
      <Register />

      <p className="mt-20 text-center font-display text-[clamp(1.15rem,1rem+0.7vw,1.5rem)] font-extrabold leading-snug text-white md:mt-28">
        {CLAIM}
      </p>
    </div>
  );
}
