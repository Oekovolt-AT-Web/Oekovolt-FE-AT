// src/components/GewerbeUnikat/_bausteine.js
//
// Statische Bausteine der Unikat-Seite /gewerbe – OHNE Hooks und ohne "use client": in Server- UND
// Client-Komponenten verwendbar. Sie geben allen Kapiteln denselben Takt (Kopf → Spielzeug → Erkenntnis →
// Wissens-Schublade → Ausgang), ohne dass die Kapitel gleich aussehen: Die Bühne (Grafik, Interaktion)
// gestaltet jedes Kapitel selbst.
//
// Regeln (Konzept GEWERBE-UNIKAT.md, „Gestaltung“):
//  - Pillen, Chips und Tabs sind GEFÜLLT (bg-…), nie umrahmt (kein ring/border als Rahmen).
//  - Haarlinien (1 px, 8 % Deckkraft) nur als Achsen, Raster und Trenner.
//  - Zahlen immer mit .ov-num (tabellarische Ziffern), Einheiten in 0,55 em.

import Link from "next/link";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

/**
 * Kapitel-Rahmen: <section> mit Anker, data-kapitel (QA) und Bühnenton.
 * ton: "hell" (weiß) | "sand" | "dunkel" (navy-950, Daten-Bühne)
 */
export function KapitelBuehne({ id, anker, ton = "hell", className, containerClassName, children, ...rest }) {
  const toene = {
    hell: "bg-white text-ink-900",
    sand: "bg-sand-50 text-ink-900",
    dunkel: "bg-navy-950 text-white",
  };
  return (
    <section
      id={anker}
      data-kapitel={id}
      data-ton={ton}
      className={cn("relative scroll-mt-24 overflow-x-clip py-16 md:py-24", toene[ton], className)}
      {...rest}
    >
      <div className={cn("ov-container relative", containerClassName)}>{children}</div>
    </section>
  );
}

/** „Technik fragt: Wann …?“ → ["Technik", "Wann …?"] (ohne „fragt:“ bleibt die Rolle leer). */
function teileFrage(frage = "") {
  const i = frage.indexOf(" fragt: ");
  return i < 0 ? ["", frage] : [frage.slice(0, i), frage.slice(i + 8)];
}

/**
 * Kapitelkopf: Rollen-Frage, H2 mit Suchbegriff, kurzer Lead – in EIGENER Komposition je Kapitel (Jury
 * 13.10.2026: „acht Räume statt acht gleicher Folien“). Typografie und Farben bleiben gemeinsam, die Anordnung
 * wechselt. H2 ist immer ov-h2 und enthält den Suchbegriff; Zier-Elemente sind aria-hidden oder als Bild beschriftet.
 *
 * nummer: "01" … ; frage: z. B. „Technik fragt: Wann brauchen wir den Strom?“
 * form:
 *   "standard"   Eyebrow + H2 links, Lead rechts
 *   "ziffer"     große Kennziffer (zier) links, Frage, H2 und Lead rechts                          (K1)
 *   "umgekehrt"  H2 zuerst über die volle Breite, darunter Frage und Lead nebeneinander              (K2)
 *   "zitat"      die Rollen-Frage groß als Zitat links, H2 und Lead rechts                           (K3)
 *   "beleg"      zentriert wie ein Rechnungskopf, Zier (die vier Rechnungsteile) darunter            (K4)
 *   "uhr"        Frage, H2, Lead links, große Uhrzeit (zier) rechts                                   (K5)
 *   "lineal"     Schwellen-Lineal (zier) über die volle Breite, darunter H2 und Lead                 (K6)
 *   "spalte"     senkrechte Kapitelziffer als Randspalte, Frage, H2, Lead darin gestapelt            (K7)
 *   "weg"        zentriert, darunter ein waagrechter Weg (zier) vom Lastgang zur laufenden Anlage    (K8)
 */
export function KapitelKopf({ nummer, frage, titel, lead, dunkel = false, className, rechts, form = "standard", zier }) {
  const [rolle, fragetext] = teileFrage(frage);
  const ton = {
    eyebrow: dunkel ? "text-ov-300" : "text-ov-700",
    h2: dunkel ? "text-white" : "text-ink-900",
    lead: dunkel ? "text-white/72" : "text-ink-600",
    leise: dunkel ? "text-white/60" : "text-ink-500",
    linie: dunkel ? "bg-white/25" : "bg-ink-900/15",
  };
  const eyebrowKlasse = cn("text-[12.5px] font-semibold uppercase tracking-[0.16em]", ton.eyebrow);
  const eyebrow = ({ mitNummer = true, className: k } = {}) => (
    <p className={cn("flex items-center gap-3", eyebrowKlasse, k)}>
      {mitNummer && nummer && <span className="ov-num font-display text-[13px] font-extrabold tracking-normal">{nummer}</span>}
      {mitNummer && nummer && <span aria-hidden="true" className={cn("h-px w-8", ton.linie)} />}
      <span>{frage}</span>
    </p>
  );
  const h2 = ({ className: k } = {}) => <h2 className={cn("ov-h2 text-balance", ton.h2, k)}>{titel}</h2>;
  const leadText = ({ className: k } = {}) => (lead ? <p className={cn("ov-lead", ton.lead, k)}>{lead}</p> : null);

  if (form === "ziffer")
    return (
      <div className={cn("grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16", className)} data-kopf="ziffer">
        <div className="min-w-0">
          {eyebrow()}
          {zier && <div className="md:mt-6">{zier}</div>}
        </div>
        <div className="min-w-0">
          {h2({ className: "max-w-[22ch]" })}
          {leadText({ className: "mt-4 max-w-[58ch] md:mt-5" })}
          {rechts}
        </div>
      </div>
    );

  if (form === "umgekehrt")
    return (
      <div className={cn("min-w-0", className)} data-kopf="umgekehrt">
        {h2({ className: "max-w-[24ch] lg:max-w-[28ch]" })}
        <div className={cn("mt-6 grid gap-4 border-t pt-5 md:mt-8 md:pt-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16", dunkel ? "border-white/[0.08]" : "border-ink-900/[0.08]")}>
          {eyebrow({ className: "lg:pt-1.5" })}
          <div className="min-w-0">
            {leadText({ className: "max-w-[60ch]" })}
            {rechts}
          </div>
        </div>
      </div>
    );

  if (form === "zitat")
    return (
      <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16", className)} data-kopf="zitat">
        <figure className="m-0 min-w-0 lg:pt-2">
          <blockquote className={cn("font-display text-[22px] font-bold leading-[1.22] tracking-[-0.015em] md:text-[28px] lg:text-[32px]", dunkel ? "text-white/90" : "text-ink-800")}>
            <span aria-hidden="true" className={ton.eyebrow}>
              „
            </span>
            {fragetext}
            <span aria-hidden="true" className={ton.eyebrow}>
              “
            </span>
          </blockquote>
          <figcaption className={cn("mt-3 flex items-center gap-3", eyebrowKlasse)}>
            {nummer && <span className="ov-num font-display text-[13px] font-extrabold tracking-normal">{nummer}</span>}
            {nummer && <span aria-hidden="true" className={cn("h-px w-8", ton.linie)} />}
            <span>{rolle || frage}</span>
          </figcaption>
        </figure>
        <div className={cn("min-w-0 lg:border-l lg:pl-12 lg:pt-2", dunkel ? "lg:border-white/[0.08]" : "lg:border-ink-900/[0.08]")}>
          {h2({ className: "max-w-[22ch]" })}
          {leadText({ className: "mt-4 max-w-[58ch] md:mt-5" })}
          {rechts}
        </div>
      </div>
    );

  if (form === "beleg")
    return (
      <div className={cn("mx-auto max-w-4xl md:text-center", className)} data-kopf="beleg">
        <p className={cn("flex items-center gap-3 md:justify-center", eyebrowKlasse)}>
          <span aria-hidden="true" className={cn("hidden h-px flex-1 sm:block", ton.linie)} style={{ maskImage: "linear-gradient(90deg, transparent, #000)" }} />
          {nummer && <span className="ov-num font-display text-[13px] font-extrabold tracking-normal">{nummer}</span>}
          <span>{frage}</span>
          <span aria-hidden="true" className={cn("hidden h-px flex-1 sm:block", ton.linie)} style={{ maskImage: "linear-gradient(270deg, transparent, #000)" }} />
        </p>
        {h2({ className: "mt-4 max-w-[26ch] md:mx-auto md:mt-5" })}
        {leadText({ className: "mt-4 max-w-[56ch] md:mx-auto md:mt-5" })}
        {/* mobil ohne Zier: dort folgt die Rechnung mit denselben Teilen direkt darunter */}
        {zier && <div className="mt-8 max-md:hidden">{zier}</div>}
        {rechts}
      </div>
    );

  if (form === "uhr")
    return (
      <div className={cn("grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16", className)} data-kopf="uhr">
        <div className="min-w-0">
          {eyebrow()}
          {h2({ className: "mt-4 max-w-[20ch]" })}
          {leadText({ className: "mt-4 max-w-[54ch] md:mt-5" })}
          {rechts}
        </div>
        {zier && <div className="min-w-0 max-lg:order-first">{zier}</div>}
      </div>
    );

  if (form === "lineal")
    return (
      <div className={cn("min-w-0", className)} data-kopf="lineal">
        {zier}
        <div className={cn("grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16", zier && "mt-6 md:mt-10")}>
          <div className="min-w-0">
            {eyebrow()}
            {h2({ className: "mt-4 max-w-[24ch]" })}
          </div>
          <div className="min-w-0">
            {leadText()}
            {rechts}
          </div>
        </div>
      </div>
    );

  if (form === "spalte")
    return (
      <div className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 md:gap-x-10", className)} data-kopf="spalte">
        <div aria-hidden="true" className="flex flex-col items-center">
          <span
            className={cn("ov-num font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] md:text-[72px]", dunkel ? "text-white/90" : "text-ink-900")}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {nummer}
          </span>
          <span className={cn("mt-4 w-px flex-1", ton.linie)} />
        </div>
        <div className="min-w-0 pb-1">
          {eyebrow({ mitNummer: false })}
          {h2({ className: "mt-4 max-w-[26ch]" })}
          {leadText({ className: "mt-4 max-w-[60ch] md:mt-5" })}
          {rechts}
        </div>
      </div>
    );

  if (form === "weg")
    return (
      <div className={cn("mx-auto max-w-5xl md:text-center", className)} data-kopf="weg">
        {eyebrow({ className: "md:justify-center" })}
        {h2({ className: "mt-4 max-w-[24ch] md:mx-auto" })}
        {leadText({ className: "mt-4 max-w-[56ch] md:mx-auto md:mt-5" })}
        {zier && <div className="mt-8 md:mt-10">{zier}</div>}
        {rechts && <div className="flex md:justify-center">{rechts}</div>}
      </div>
    );

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16", className)}>
      <div>
        {eyebrow()}
        {h2({ className: "mt-4 max-w-[22ch]" })}
      </div>
      {(lead || rechts) && (
        <div>
          {leadText()}
          {rechts}
        </div>
      )}
    </div>
  );
}

/**
 * Vertiefen: zweite Instrumente und Detailgrafiken eines Kapitels hinter einer Schublade (Jury 13.10.2026:
 * „pro Kapitel sichtbar nur ein Instrument, ein Kernsatz, ein Haupt-CTA“). Anders als die Wissensschublade
 * (Fachtext) trägt sie Werkzeuge – die Zusammenfassung nennt, was darin steckt.
 * children dürfen im SSR-Startzustand fehlen (leicht): dann steht ersatz (kurzer Text) darin, die Bühne
 * liefert den Inhalt nach.
 */
export function Vertiefen({ titel, inhalt, dunkel = false, className, children, ersatz, id, offen = false, ...rest }) {
  return (
    <details id={id} open={offen} className={cn("group/vt rounded-2xl", dunkel ? "bg-white/[0.035]" : "bg-ink-900/[0.035]", className)} {...rest}>
      <summary
        className={cn(
          "flex min-h-14 cursor-pointer list-none items-center gap-4 rounded-2xl px-5 py-3.5 [&::-webkit-details-marker]:hidden",
          dunkel ? "hover:bg-white/[0.04]" : "hover:bg-ink-900/[0.04]"
        )}
      >
        <span className="min-w-0 flex-1">
          <span className={cn("block text-[12px] font-semibold uppercase tracking-[0.16em]", dunkel ? "text-ov-300" : "text-ov-700")}>Vertiefen</span>
          <span className={cn("mt-1 block font-display text-[16px] font-bold leading-snug md:text-[17px]", dunkel ? "text-white" : "text-ink-900")}>{titel}</span>
          {inhalt && <span className={cn("mt-1 block text-[13px] leading-snug", dunkel ? "text-white/60" : "text-ink-500")}>{inhalt}</span>}
        </span>
        <span
          aria-hidden="true"
          className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full", dunkel ? "bg-white/[0.08] text-ov-300" : "bg-white text-ov-700")}
        >
          <span className="absolute h-[2px] w-3.5 rounded bg-current" />
          <span className="absolute h-3.5 w-[2px] rounded bg-current transition-transform duration-300 group-open/vt:scale-y-0" />
        </span>
      </summary>
      <div className="px-4 pb-6 pt-2 md:px-6 md:pb-8">{children ?? <p className={cn("text-[14.5px] leading-relaxed", dunkel ? "text-white/70" : "text-ink-600")}>{ersatz}</p>}</div>
    </details>
  );
}

/** Kleine gefüllte Pille für Quelle · Stand · Richtwert. */
export function QuellePille({ children, dunkel = false, className }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium leading-snug",
        dunkel ? "bg-white/[0.07] text-white/70" : "bg-ink-100 text-ink-600",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Pflicht-Kennzeichnung (synthetisch, Modell, schematisch …) – Punkt + Text, immer sichtbar. */
export function Kennzeichnung({ children, dunkel = false, className }) {
  return (
    <p className={cn("flex items-start gap-2 text-[12.5px] leading-snug", dunkel ? "text-white/60" : "text-ink-500", className)}>
      <span aria-hidden="true" className={cn("mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full", dunkel ? "bg-sun-300" : "bg-sun-500")} />
      <span>{children}</span>
    </p>
  );
}

/**
 * Erkenntnis-Satz (statische Form). Die Kapitel blenden ihn erst ein, wenn die Interaktion den Zustand
 * erreicht hat (Client), stehen ihn aber für SEO zusätzlich im Schubladen-Text aus.
 */
export function Erkenntnis({ children, dunkel = false, className, ...rest }) {
  return (
    <p
      className={cn(
        "relative pl-5 font-display text-[18px] font-bold leading-snug tracking-[-0.01em] md:text-[21px]",
        dunkel ? "text-white" : "text-ink-900",
        className
      )}
      {...rest}
    >
      <span aria-hidden="true" className={cn("absolute left-0 top-[0.2em] h-[1.1em] w-[3px] rounded-full", dunkel ? "bg-ov-400" : "bg-ov-500")} />
      {children}
    </p>
  );
}

/**
 * Wissens-Schublade: <details> mit vollem Fachtext und HTML-Tabellen (SEO, ohne JS bedienbar).
 * Gefüllte Fläche statt Rahmen; Summary mindestens 48 px hoch.
 */
export function Wissensschublade({ titel, children, offen = false, dunkel = false, className, id }) {
  return (
    <details id={id} open={offen} className={cn("group rounded-2xl", dunkel ? "bg-white/[0.05]" : "bg-sand-100/70", className)}>
      <summary
        className={cn(
          "flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-3 font-display text-[15.5px] font-bold [&::-webkit-details-marker]:hidden",
          dunkel ? "text-white hover:bg-white/[0.04]" : "text-ink-900 hover:bg-sand-100"
        )}
      >
        <span>{titel}</span>
        <span aria-hidden="true" className={cn("relative h-4 w-4 shrink-0", dunkel ? "text-ov-300" : "text-ov-600")}>
          <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded bg-current" />
          <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-300 group-open:scale-y-0" />
        </span>
      </summary>
      <div className={cn("px-5 pb-6 pt-1 text-[15px] leading-relaxed", dunkel ? "text-white/75" : "text-ink-700")}>{children}</div>
    </details>
  );
}

/**
 * Kapitel-Ausgang: genau EIN primärer CTA (seitenweit gleich: HAUPT_CTA aus ./_cta.js) und höchstens EIN
 * sekundärer Weg – seit der Jury vom 13.10.2026 als TEXTLINK, nicht als gleich großer Knopf: Zweitwege
 * („Im … Rechner weiterrechnen“) sollen Entscheider nicht vor dem Steckbrief von der Seite führen.
 * Primärknopf mindestens 48 px hoch, mobil volle Breite (Daumenzone); Textlinks mindestens 44 px hoch.
 * primaer/sekundaer: { label, href, icon?, onClick? }
 */
export function KapitelAusgang({ primaer, sekundaer, hinweis, dunkel = false, className, children }) {
  const link = cn(
    "inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold underline underline-offset-4 transition-colors",
    dunkel ? "text-white/80 decoration-white/30 hover:text-white hover:decoration-white/70" : "text-ink-700 decoration-ink-300 hover:text-ink-900 hover:decoration-ink-600"
  );
  return (
    <div className={cn("mt-10 flex flex-col gap-3 md:mt-12", className)}>
      <div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:flex-wrap sm:items-center">
        {primaer && (
          <Button href={primaer.href} onClick={primaer.onClick} icon={primaer.icon} pfeil variant="primary" className="min-h-12 max-sm:mb-1 max-sm:w-full max-sm:whitespace-normal max-sm:text-center">
            {primaer.label}
          </Button>
        )}
        {sekundaer &&
          (String(sekundaer.href).startsWith("#") ? (
            <a href={sekundaer.href} onClick={sekundaer.onClick} className={cn(link, "max-sm:justify-center")}>
              {sekundaer.label}
            </a>
          ) : (
            <Link href={sekundaer.href} onClick={sekundaer.onClick} className={cn(link, "max-sm:justify-center")}>
              {sekundaer.label}
            </Link>
          ))}
        {children}
      </div>
      {hinweis && <p className={cn("max-w-2xl text-[13.5px] leading-snug", dunkel ? "text-white/60" : "text-ink-500")}>{hinweis}</p>}
    </div>
  );
}

/**
 * Datentabelle als Textalternative zu Canvas/SVG/3D (echtes HTML, caption Pflicht).
 * spalten: [{ key, label, rechts? }], zeilen: [{ … }]
 */
export function DatenTabelle({ caption, spalten, zeilen, dunkel = false, className }) {
  return (
    <div className={cn("max-w-full overflow-x-auto", className)}>
      <table className={cn("w-full min-w-[480px] border-collapse text-left text-[14px]", dunkel ? "text-white/80" : "text-ink-700")}>
        <caption className={cn("mb-3 text-left text-[13px] font-semibold", dunkel ? "text-white/70" : "text-ink-600")}>{caption}</caption>
        <thead>
          <tr>
            {spalten.map((s) => (
              <th key={s.key} scope="col" className={cn("py-2 pr-4 font-semibold", s.rechts && "text-right", dunkel ? "text-white" : "text-ink-900")}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z, i) => (
            <tr key={i} className={dunkel ? "border-t border-white/[0.08]" : "border-t border-ink-900/[0.07]"}>
              {spalten.map((s, j) =>
                j === 0 ? (
                  <th key={s.key} scope="row" className="py-2 pr-4 font-medium">
                    {z[s.key]}
                  </th>
                ) : (
                  <td key={s.key} className={cn("ov-num py-2 pr-4", s.rechts && "text-right")}>
                    {z[s.key]}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Fester Platzhalter für nachgeladene Grafiken (next/dynamic loading): reserviert die Fläche über
 * aspect-ratio, damit nichts springt (CLS ≤ 0,1). Optional ein Poster-Bild (SSR) darin.
 */
export function GrafikPlatz({ verhaeltnis = "16 / 9", dunkel = false, className, children, label }) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("relative w-full overflow-hidden rounded-3xl", dunkel ? "bg-white/[0.04]" : "bg-sand-100", className)}
      style={{ aspectRatio: verhaeltnis }}
    >
      {children}
    </div>
  );
}

/** Kennwert-Kachel (Zahl groß, Einheit klein, Beschriftung) – für Live-Ausgaben in <output> einsetzbar. */
export function Kennwert({ wert, einheit, label, dunkel = false, className, as: Tag = "div", ...rest }) {
  return (
    <Tag className={cn("block min-w-0", className)} {...rest}>
      <span className={cn("ov-num block font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] md:text-[32px]", dunkel ? "text-white" : "text-ink-900")}>
        {wert}
        {einheit && <span className={cn("ml-1 text-[0.55em] font-bold", dunkel ? "text-white/60" : "text-ink-500")}>{einheit}</span>}
      </span>
      {label && <span className={cn("mt-2 block text-[13px] leading-snug", dunkel ? "text-white/60" : "text-ink-600")}>{label}</span>}
    </Tag>
  );
}
