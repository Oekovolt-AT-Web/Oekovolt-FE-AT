"use client";

// Schneelast-Werkzeug für /schneelast: Ortssuche (vorhandene /api/standort?q=, Nominatim),
// Karte der Richtwerte (PNG aus dem GeoSphere-Raster, anklickbar), Ergebnis mit Einordnung und
// Dach-Schneelast-Beispiel (Rechenkern des Standort-Checks). Der Richtwert für einen beliebigen
// Punkt kommt von /schneelast/richtwert (lokales Raster + Seehöhe), HORA wird NICHT abgefragt.

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Info, Loader2, MapPin, Mountain, Search, ShieldCheck, Snowflake } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Regler, Schalter } from "@/components/Rechner/bausteine";
import { horaLink } from "@/lib/standort/hora";
import Pflichthinweis from "./Pflichthinweis";
import { bewerteSchnee } from "@/lib/standort/berechnung";
import { bildZuWgs84, wgs84ZuBild } from "@/lib/schneelast/projektion";
import { KLASSEN, einordnung, kgProM2, klasseFuer, kn, zahl } from "@/lib/schneelast/einordnung";

const STATUS = {
  reserve: { text: "ausreichend mit Reserve", balken: "bg-ov-500", chip: "bg-ov-50 text-ov-800 ring-ov-200" },
  knapp: { text: "rechnerisch knapp", balken: "bg-sun-400", chip: "bg-sun-300/25 text-ink-800 ring-sun-400/60" },
  nein: { text: "nicht ausreichend", balken: "bg-red-500", chip: "bg-red-50 text-red-800 ring-red-200" },
};

export default function SchneelastWerkzeug({ meta, staedte = [], start }) {
  const sucheId = useId();
  const [suche, setSuche] = useState("");
  const [treffer, setTreffer] = useState([]);
  const [sucheLaeuft, setSucheLaeuft] = useState(false);
  const [sucheFehler, setSucheFehler] = useState("");

  // Auswahl: { lat, lon, label, hoehe, sk, grund, quelle, laedt, fehler }
  const [wahl, setWahl] = useState(start || null);
  const [neigung, setNeigung] = useState(30);
  const [schneefang, setSchneefang] = useState(false);
  const abbruch = useRef(null);

  /* ---------- Richtwert laden ---------- */
  async function ladePunkt(punkt, { url = true } = {}) {
    abbruch.current?.abort();
    const ctrl = new AbortController();
    abbruch.current = ctrl;
    setWahl({ ...punkt, laedt: true, sk: null, grund: null, hoehe: punkt.hoehe ?? null, fehler: "" });
    try {
      const res = await fetch(`/schneelast/richtwert?${new URLSearchParams({ lat: punkt.lat.toFixed(5), lon: punkt.lon.toFixed(5) })}`, { signal: ctrl.signal });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Der Richtwert konnte nicht geladen werden.");
      setWahl({ ...punkt, laedt: false, sk: json.richtwert?.sk ?? null, nachbarzelle: Boolean(json.richtwert?.nachbarzelle), grund: json.grund, hoehe: json.seehoehe?.m ?? null, fehler: "" });
    } catch (err) {
      if (err.name === "AbortError") return;
      setWahl({ ...punkt, laedt: false, sk: null, grund: null, fehler: err.message || "Der Richtwert konnte nicht geladen werden." });
    }
    if (url) {
      try {
        const p = new URLSearchParams(window.location.search);
        p.set("lat", punkt.lat.toFixed(5));
        p.set("lon", punkt.lon.toFixed(5));
        window.history.replaceState(null, "", `${window.location.pathname}?${p}#werkzeug`);
      } catch {
        /* ohne URL-Aktualisierung weiter */
      }
    }
  }

  /* ---------- Standort aus teilbarem Link ---------- */
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const lat = Number(p.get("lat"));
      const lon = Number(p.get("lon"));
      if (p.get("lat") && p.get("lon") && Number.isFinite(lat) && Number.isFinite(lon)) ladePunkt({ lat, lon, label: "Punkt aus Link", quelle: "link" }, { url: false });
    } catch {
      /* kein Parameter */
    }
    return () => abbruch.current?.abort();
  }, []);

  /* ---------- Suche ---------- */
  async function suchen(e) {
    e.preventDefault();
    const q = suche.trim();
    if (q.length < 3) {
      setSucheFehler("Bitte geben Sie mindestens drei Zeichen ein, z. B. einen Ort oder eine Adresse.");
      return;
    }
    setSucheLaeuft(true);
    setSucheFehler("");
    setTreffer([]);
    try {
      const res = await fetch(`/api/standort?${new URLSearchParams({ q })}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Die Suche ist fehlgeschlagen.");
      const liste = json.treffer || [];
      if (liste.length === 0) setSucheFehler("Kein Ort in Österreich gefunden. Prüfen Sie die Schreibweise oder klicken Sie in die Karte.");
      else if (liste.length === 1) waehle(liste[0]);
      else setTreffer(liste);
    } catch (err) {
      setSucheFehler(err.message);
    } finally {
      setSucheLaeuft(false);
    }
  }

  function waehle(t) {
    setTreffer([]);
    ladePunkt({ lat: t.lat, lon: t.lon, label: t.label, quelle: "suche" });
  }

  function stadtWaehlen(s) {
    abbruch.current?.abort();
    setTreffer([]);
    setWahl({ lat: s.lat, lon: s.lon, label: s.ort, hoehe: s.hoehe, sk: s.sk, grund: s.sk == null ? s.grund || "keinWert" : null, quelle: "stadt", laedt: false, fehler: "" });
  }

  function karteKlick(e) {
    if (!meta) return;
    const r = e.currentTarget.getBoundingClientRect();
    const u = (e.clientX - r.left) / r.width;
    const v = (e.clientY - r.top) / r.height;
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    const { lat, lon } = bildZuWgs84(meta, u, v);
    ladePunkt({ lat, lon, label: "Punkt in der Karte", quelle: "karte" });
  }

  /* ---------- Ableitungen ---------- */
  const position = useMemo(() => (wahl && meta ? wgs84ZuBild(meta, wahl.lat, wahl.lon) : null), [wahl, meta]);
  const sk = wahl?.sk ?? null;
  const bewertung = useMemo(() => (sk ? bewerteSchnee({ sk, neigung, schneefang }) : null), [sk, neigung, schneefang]);
  const referenz = useMemo(() => (sk ? einordnung(sk) : null), [sk]);
  const klasse = sk != null ? KLASSEN[klasseFuer(sk)] : null;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(21,26,36,0.35)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        {/* ---------------- Suche + Karte ---------------- */}
        <div className="border-b border-ink-100 p-5 md:p-8 lg:border-b-0 lg:border-r">
          <form onSubmit={suchen} role="search" aria-label="Ort suchen" className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor={sucheId} className="mb-2 block text-[14.5px] font-semibold text-ink-800">
                Ort oder Adresse in Österreich
              </label>
              <div className="flex items-center rounded-xl bg-white ring-1 ring-ink-200 transition-shadow focus-within:ring-2 focus-within:ring-ov-500">
                <MapPin aria-hidden="true" className="ml-4 h-4 w-4 shrink-0 text-ink-400" />
                <input
                  id={sucheId}
                  type="search"
                  autoComplete="off"
                  value={suche}
                  onChange={(e) => setSuche(e.target.value)}
                  placeholder="z. B. Schladming oder Hauptplatz 1, Linz"
                  aria-describedby={sucheFehler ? `${sucheId}-f` : undefined}
                  className="min-h-12 w-full min-w-0 rounded-xl bg-transparent px-3 text-[16px] text-ink-900 outline-none placeholder:text-ink-400"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={sucheLaeuft}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 disabled:opacity-70"
            >
              {sucheLaeuft ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Search aria-hidden="true" className="h-4 w-4" />}
              Suchen
            </button>
          </form>
          {sucheFehler && (
            <p id={`${sucheId}-f`} role="alert" className="mt-2 text-[13px] text-red-700">
              {sucheFehler}
            </p>
          )}
          {treffer.length > 1 && (
            <ul aria-label="Suchtreffer" className="mt-3 divide-y divide-ink-100 overflow-hidden rounded-2xl ring-1 ring-ink-200">
              {treffer.map((t) => (
                <li key={`${t.lat},${t.lon}`}>
                  <button type="button" onClick={() => waehle(t)} className="flex w-full items-start gap-3 px-4 py-3 text-left text-[14px] text-ink-800 hover:bg-sand-50 focus-visible:bg-sand-50 focus-visible:outline-none">
                    <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                    <span>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Karte */}
          <div className="mt-6">
            <div className="relative w-full select-none rounded-2xl bg-[#f4f7fa] p-2 ring-1 ring-ink-200/70 sm:p-4">
              <div
                className="relative w-full cursor-crosshair"
                style={{ aspectRatio: meta ? `${meta.nx} / ${meta.ny}` : "584 / 329" }}
                onClick={karteKlick}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- statisches PNG aus eigener Route, Maße fest */}
                <img
                  src="/schneelast/karte.png"
                  alt="Karte Österreichs mit den Schneelast-Richtwerten im 1-km-Raster: niedrige Werte im Osten und im Alpenvorland, hohe Werte in den Alpen"
                  width={meta ? meta.nx * 2 : 1168}
                  height={meta ? meta.ny * 2 : 658}
                  className="absolute inset-0 h-full w-full"
                  draggable={false}
                />
                {staedte.map((s) => {
                  const p = meta ? wgs84ZuBild(meta, s.lat, s.lon) : null;
                  if (!p) return null;
                  const links = s.labelLinks;
                  return (
                    <button
                      key={s.ort}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stadtWaehlen(s);
                      }}
                      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
                      style={{ left: `${(p.u * 100).toFixed(3)}%`, top: `${(p.v * 100).toFixed(3)}%` }}
                      aria-label={`${s.ort}: Richtwert anzeigen`}
                    >
                      <span aria-hidden="true" className="block h-2.5 w-2.5 rounded-full bg-ink-900 ring-2 ring-white transition-transform group-hover:scale-125" />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-white/85 px-1 text-[11px] font-semibold leading-tight text-ink-800 sm:block",
                          links ? "right-full mr-0.5" : "left-full ml-0.5"
                        )}
                      >
                        {s.kurz || s.ort}
                      </span>
                    </button>
                  );
                })}
                {position && position.u >= 0 && position.u <= 1 && position.v >= 0 && position.v <= 1 && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${(position.u * 100).toFixed(3)}%`, top: `${(position.v * 100).toFixed(3)}%` }}
                  >
                    <span className="block h-5 w-5 rounded-full border-[3px] border-white bg-ov-500 shadow-[0_0_0_5px_rgba(102,153,51,0.35),0_4px_14px_rgba(0,0,0,0.35)]" />
                  </span>
                )}
              </div>
            </div>
            <div role="group" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legende: Schneelast-Richtwert sₖ in kN/m²">
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-500">sₖ in kN/m²</span>
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {KLASSEN.map((k) => (
                  <li key={k.label} className="flex items-center gap-1.5 text-[12.5px] text-ink-700">
                    <span aria-hidden="true" className="h-3 w-5 rounded-sm ring-1 ring-ink-300/70" style={{ background: k.farbe }} />
                    {k.label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
              Klicken Sie in die Karte, suchen Sie einen Ort oder wählen Sie eine Landeshauptstadt. Hochgebirgszellen über 2.000 m sind nur der Vollständigkeit halber eingefärbt – dort geben wir keinen Richtwert aus.
              Kartengrundlage: GeoSphere Austria, SNOWGRID-CL v2.1 (CC BY 4.0), eigene Auswertung. Suche: © OpenStreetMap-Mitwirkende (ODbL).
            </p>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="flex flex-col gap-5 bg-sand-50/60 p-5 md:p-8" aria-live="polite">
          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Ihr Standort</p>
            <p className="mt-1 font-display text-[19px] font-bold leading-snug text-ink-900">{wahl?.label || "Noch kein Ort gewählt"}</p>
            {wahl && (
              <p className="mt-1 text-[13px] text-ink-500">
                {wahl.hoehe != null ? `${zahl(wahl.hoehe)} m Seehöhe · ` : ""}
                {zahl(wahl.lat, 4)}° N, {zahl(wahl.lon, 4)}° O
              </p>
            )}
          </div>

          {wahl?.laedt && (
            <p className="flex items-center gap-2 text-[14px] text-ink-600">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Richtwert wird ermittelt …
            </p>
          )}
          {wahl?.fehler && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[13.5px] text-red-800 ring-1 ring-red-200">
              {wahl.fehler}
            </p>
          )}

          {!wahl?.laedt && sk != null && (
            <div className="rounded-3xl bg-navy-950 p-5 text-white">
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-white/70">
                <Snowflake aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" /> Schneelast-Richtwert sₖ (50-jährlich, Boden)
              </p>
              <p className="mt-1 font-display text-[clamp(2.2rem,1.8rem+1.4vw,3rem)] font-extrabold leading-none tracking-tight">
                <span className="ov-num">{zahl(sk, 1)}</span> <span className="text-[0.45em] font-bold text-white/80">kN/m²</span>
              </p>
              <p className="mt-2 text-[13px] text-white/70">
                entspricht rund {zahl(kgProM2(sk))} kg Schnee je m² Grundfläche
                {klasse && (
                  <>
                    {" "}
                    · Klasse <span className="inline-block h-2.5 w-4 translate-y-px rounded-sm align-baseline ring-1 ring-white/40" style={{ background: klasse.farbe }} aria-hidden="true" /> {klasse.label}
                  </>
                )}
              </p>
              {wahl?.nachbarzelle && <p className="mt-2 text-[12.5px] text-white/60">Grenzlage: höchster Wert der Nachbarzellen verwendet.</p>}
            </div>
          )}

          {!wahl?.laedt && wahl && sk == null && !wahl.fehler && (
            <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-200">
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                <Mountain aria-hidden="true" className="h-5 w-5 text-navy-600" />
                {wahl.grund === "ueber2000" ? "Über 2.000 m: kein Richtwert" : "Kein Richtwert für diesen Punkt"}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                {wahl.grund === "ueber2000"
                  ? "Die Schneelastkarte der ÖNORM B 1991-1-3:2022 gilt bis 2.000 m Seehöhe, und das 1-km-Raster ist darüber nicht aussagekräftig. Für Gebäude in dieser Höhe braucht es ein Schneelastgutachten."
                  : "Der Punkt liegt außerhalb der Datenmaske (z. B. Grenzlage oder Gletscher). Den Normwert lesen Sie in eHORA ab."}
              </p>
            </div>
          )}

          {!wahl?.laedt && wahl?.grund === "hoeheUnbekannt" && sk != null && (
            <p className="flex gap-2 text-[12.5px] leading-relaxed text-ink-500">
              <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Die Seehöhe konnte gerade nicht ermittelt werden. Liegt der Standort über 2.000 m, gilt der Wert nicht.
            </p>
          )}

          {referenz && !wahl?.laedt && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
              <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-900">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-600" /> Einordnung: {referenz.titel}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{referenz.text}</p>
              <p className="mt-1.5 text-[12px] text-ink-500">Referenzdach: 30° Neigung, ohne Schneefang, Cₑ = Cₜ = 1,0.</p>
            </div>
          )}

          {wahl && !wahl.laedt && (
            <div className="flex flex-col gap-2.5">
              <a
                href={horaLink("schnee", wahl.lat, wahl.lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy-700 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2"
              >
                Normwert in eHORA ablesen <ExternalLink aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">(öffnet hora.gv.at in neuem Tab)</span>
              </a>
              <Link
                href={`/standort-check?${new URLSearchParams({ lat: wahl.lat.toFixed(5), lon: wahl.lon.toFixed(5) })}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-ink-900 ring-1 ring-ink-200 transition-colors hover:ring-ov-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
              >
                Im Standort-Check weiterrechnen <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          )}

          <Pflichthinweis />
        </div>
      </div>

      {/* ---------------- Dach-Schneelast-Beispiel ---------------- */}
      <div className="border-t border-ink-100 p-5 md:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Dach-Schneelast-Beispiel</p>
            <h3 className="mt-1 font-display text-[21px] font-bold leading-snug text-ink-900 md:text-[24px]">Was vom Richtwert auf Dach und Modul ankommt</h3>
          </div>
          <p className="text-[13px] text-ink-500">s = μ₁ · Cₑ · Cₜ · sₖ nach ÖNORM EN 1991-1-3</p>
        </div>

        {!bewertung ? (
          <p className="rounded-2xl bg-ink-50 px-4 py-3 text-[14px] text-ink-600 ring-1 ring-ink-200/70">Wählen Sie oben einen Ort mit Richtwert – dann rechnen wir das Beispiel für Ihr Dach.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.8fr_0.7fr_1.1fr] lg:gap-8">
            <div className="space-y-5">
              <Regler label="Dachneigung" wert={neigung} min={0} max={60} step={5} onChange={setNeigung} format={(w) => `${zahl(w)}°`} />
              <Schalter label="Schneefang vorhanden" beschreibung="Schnee kann nicht abrutschen – μ₁ bleibt mind. 0,8" an={schneefang} onChange={setSchneefang} icon={ShieldCheck} />
            </div>

            <dl className="grid grid-cols-2 gap-3 self-start">
              <Wert label="Formbeiwert μ₁" wert={zahl(bewertung.mu1, 2)} />
              <Wert label="Dachschneelast s" wert={kn(bewertung.s, 2)} />
              <Wert label="Last je m² Modul" wert={kn(bewertung.modulFlaeche, 2)} />
              <Wert label="Bemessung (× 1,5)" wert={`${zahl(bewertung.bemessungPa)} Pa`} betont />
            </dl>

            <div>
              <p className="mb-3 text-[14.5px] font-semibold text-ink-800">Modulklassen im Vergleich</p>
              <ul className="space-y-3">
                {bewertung.module.map((m) => {
                  const st = STATUS[m.status];
                  const breite = Math.min(100, Math.round(m.auslastung * 100));
                  return (
                    <li key={m.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-[14px] font-semibold text-ink-900">
                          {m.name} <span className="font-normal text-ink-500">· {zahl(m.pruef)} Pa Prüflast</span>
                        </span>
                        <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-semibold ring-1", st.chip)}>{st.text}</span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-100" role="img" aria-label={`Auslastung ${zahl(m.auslastung * 100)} Prozent`}>
                        <div className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", st.balken)} style={{ width: `${breite}%` }} />
                      </div>
                      <p className="mt-1 text-[12px] text-ink-500">
                        Auslastung {zahl(m.auslastung * 100)} % der Bemessungslast von {zahl(m.bemessung)} Pa
                      </p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-[13px] leading-relaxed text-ink-600">
                <strong className="text-ink-900">{bewertung.unterkonstruktion.titel}:</strong> {bewertung.unterkonstruktion.text}
              </p>
            </div>
          </div>
        )}
        {bewertung?.hinweise?.length > 0 && (
          <ul className="mt-5 space-y-2">
            {bewertung.hinweise.map((h) => (
              <li key={h} className="flex gap-2 text-[13px] leading-relaxed text-ink-600">
                <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-600" /> {h}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
          Rechenweg wie im Standort-Check: Last je m² Modulfläche s · cos α, Teilsicherheitsbeiwert γQ = 1,5 (ÖNORM EN 1990), Bemessungslast des Moduls = Prüflast / 1,5 (IEC 61215-2, MQT 16). Schneeanhäufungen, Verwehungen und
          der Dachstuhl selbst sind nicht berücksichtigt.
        </p>
      </div>
    </div>
  );
}

function Wert({ label, wert, betont = false }) {
  return (
    <div className={cn("rounded-2xl p-3.5", betont ? "bg-ov-600 text-white" : "bg-sand-50 ring-1 ring-ink-200/60")}>
      <dt className={cn("text-[12px] font-medium", betont ? "text-white" : "text-ink-500")}>{label}</dt>
      <dd className="ov-num mt-0.5 whitespace-nowrap font-display text-[18px] font-extrabold tracking-tight">{wert}</dd>
    </div>
  );
}
