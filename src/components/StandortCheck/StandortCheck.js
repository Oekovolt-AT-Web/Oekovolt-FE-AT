"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck2,
  Check,
  CloudHail,
  Crosshair,
  ExternalLink,
  Info,
  Link2,
  Loader2,
  MapPin,
  Mountain,
  Search,
  ShieldCheck,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter, Zahl } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { ereignis } from "@/lib/statistik";
import { horaLinks } from "@/lib/standort/hora";
import {
  ALTFORMEL_MAX_SEEHOEHE,
  ALTZONEN,
  GAMMA_M_MODUL,
  GAMMA_Q,
  HAGELSTUFEN,
  HORA_MAX_SEEHOEHE,
  basisGeschwindigkeitsdruck,
  bewerteSchnee,
  hagelEmpfehlung,
  skAltformel,
} from "@/lib/standort/berechnung";

const Karte = dynamic(() => import("./Karte"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-100 text-[14px] text-ink-500">
      <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" /> Karte wird geladen …
    </div>
  ),
});

const AUSRICHTUNGEN = [
  { id: "-90", label: "Ost" },
  { id: "-45", label: "SO" },
  { id: "0", label: "Süd" },
  { id: "45", label: "SW" },
  { id: "90", label: "West" },
];

const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

const zahlAus = (text) => {
  const n = Number(String(text ?? "").replace(/\s/g, "").replace(",", "."));
  return String(text ?? "").trim() !== "" && Number.isFinite(n) ? n : null;
};

/* ------------------------------------------------------------------ kleine Bausteine */

function ZahlFeld({ label, einheit, wert, onChange, placeholder, hinweis, fehler }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14.5px] font-semibold text-ink-800">
        {label}
      </label>
      <div className={cn("flex items-center rounded-xl bg-white ring-1 transition-shadow focus-within:ring-2 focus-within:ring-ov-500", fehler ? "ring-red-400" : "ring-ink-200")}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={wert}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={fehler ? "true" : undefined}
          aria-describedby={hinweis || fehler ? `${id}-h` : undefined}
          className="ov-num min-h-12 w-full min-w-0 rounded-xl bg-transparent px-4 text-[16px] font-semibold text-ink-900 outline-none placeholder:font-normal placeholder:text-ink-400"
        />
        {einheit && <span className="shrink-0 pr-4 text-[14px] font-medium text-ink-500">{einheit}</span>}
      </div>
      {(fehler || hinweis) && (
        <p id={`${id}-h`} className={cn("mt-1.5 text-[12.5px] leading-relaxed", fehler ? "text-red-700" : "text-ink-500")}>
          {fehler || hinweis}
        </p>
      )}
    </div>
  );
}

function HoraKnopf({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-700 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-navy-800"
    >
      {children}
      <ExternalLink aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">(öffnet hora.gv.at in neuem Tab)</span>
    </a>
  );
}

function Hinweis({ ton = "info", children }) {
  const warn = ton === "warn";
  const Icon = warn ? AlertTriangle : Info;
  return (
    <p className={cn("flex gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed", warn ? "bg-sun-300/20 text-ink-800 ring-1 ring-sun-400/50" : "bg-ink-50 text-ink-700 ring-1 ring-ink-200/70")}>
      <Icon aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", warn ? "text-sun-500" : "text-navy-600")} />
      <span>{children}</span>
    </p>
  );
}

const STATUS = {
  reserve: { text: "ausreichend mit Reserve", balken: "bg-ov-500", chip: "bg-ov-50 text-ov-800 ring-ov-200" },
  knapp: { text: "rechnerisch knapp", balken: "bg-sun-400", chip: "bg-sun-300/25 text-ink-800 ring-sun-400/60" },
  nein: { text: "nicht ausreichend", balken: "bg-red-500", chip: "bg-red-50 text-red-800 ring-red-200" },
};

/* ------------------------------------------------------------------ Hauptkomponente */

export default function StandortCheck() {
  // Standort
  const [suche, setSuche] = useState("");
  const [treffer, setTreffer] = useState([]);
  const [sucheLaeuft, setSucheLaeuft] = useState(false);
  const [sucheFehler, setSucheFehler] = useState("");
  const [punkt, setPunkt] = useState(null); // { lat, lon, label?, quelle }

  // Dach
  const [neigung, setNeigung] = useState(30);
  const [ausrichtung, setAusrichtung] = useState("0");
  const [montage, setMontage] = useState("free");
  const [schneefang, setSchneefang] = useState(true);
  const [dachtiefe, setDachtiefe] = useState(6);

  // Schneelast und Werte aus eHORA
  const [skText, setSkText] = useState("");
  // hora = selbst eingetragen (eHORA), richtwert = automatisch aus GeoSphere-Raster, altformel = Grobschätzung
  const [skQuelle, setSkQuelle] = useState("hora");
  const [hoeheText, setHoeheText] = useState("");
  const [windText, setWindText] = useState("");
  const [hagel, setHagel] = useState("");
  const [altZone, setAltZone] = useState("");

  // Serverdaten
  const [daten, setDaten] = useState(null);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");
  const [ertragLaedt, setErtragLaedt] = useState(false);
  const [kopiert, setKopiert] = useState(false);

  const abbruch = useRef(null);
  const ertragAbbruch = useRef(null);
  const ersterLauf = useRef(true);
  // Aktueller Stand des sₖ-Felds für die Vorbelegung nach dem Laden (ohne analysieren neu zu erzeugen)
  const skRef = useRef({ skText: "", skQuelle: "hora" });

  /**
   * sₖ-Feld mit dem Richtwert des neuen Standorts vorbelegen – nur wenn das Feld leer ist oder
   * bereits einen (älteren) Richtwert enthält. Eigene Eingaben werden nie überschrieben.
   */
  const richtwertVorbelegen = useCallback((richtwert) => {
    const { skText: text, skQuelle: quelle } = skRef.current;
    if (text.trim() !== "" && quelle !== "richtwert") return;
    if (richtwert?.sk > 0) {
      setSkText(fmt(richtwert.sk, 1));
      setSkQuelle("richtwert");
    } else if (quelle === "richtwert") {
      // Richtwert des vorigen Standorts nicht stehen lassen
      setSkText("");
      setSkQuelle("hora");
    }
  }, []);

  const azimut = Number(ausrichtung);

  /* ---------- Standort aus URL übernehmen (teilbare Links) ---------- */
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const lat = Number(p.get("lat"));
      const lon = Number(p.get("lon"));
      if (Number.isFinite(lat) && Number.isFinite(lon) && p.get("lat") && p.get("lon")) setPunkt({ lat, lon, quelle: "link" });
    } catch {
      /* ohne URL-Parameter weiter */
    }
  }, []);

  /* ---------- Vollständige Analyse bei neuem Standort ---------- */
  const analysieren = useCallback(
    async (p, dach) => {
      abbruch.current?.abort();
      const ctrl = new AbortController();
      abbruch.current = ctrl;
      setLaedt(true);
      setFehler("");
      try {
        const qs = new URLSearchParams({ lat: p.lat.toFixed(5), lon: p.lon.toFixed(5), neigung: String(dach.neigung), azimut: String(dach.azimut), montage: dach.montage });
        const res = await fetch(`/api/standort?${qs}`, { signal: ctrl.signal });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Die Standortdaten konnten nicht geladen werden.");
        setDaten(json);
        richtwertVorbelegen(json.schneelastRichtwert);
        // Nur grobe Angaben, keine Adresse oder Koordinaten
        ereignis("standort_check_ergebnis", { richtwert: json.schneelastRichtwert?.sk > 0 ? "ja" : "nein" });
      } catch (e) {
        if (e.name === "AbortError") return;
        setDaten(null);
        richtwertVorbelegen(null);
        setFehler(e.message || "Die Standortdaten konnten nicht geladen werden.");
      } finally {
        if (abbruch.current === ctrl) setLaedt(false);
      }
    },
    [richtwertVorbelegen]
  );

  // Aktuelle Dachwerte und Daten für Effekte, ohne sie bei jeder Änderung neu auszulösen
  const dachRef = useRef({ neigung, azimut, montage });
  const datenRef = useRef(null);
  useEffect(() => {
    dachRef.current = { neigung, azimut, montage };
    datenRef.current = daten;
    skRef.current = { skText, skQuelle };
  });

  useEffect(() => {
    if (!punkt) return;
    analysieren(punkt, dachRef.current);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lat", punkt.lat.toFixed(5));
      url.searchParams.set("lon", punkt.lon.toFixed(5));
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* ignorieren */
    }
  }, [punkt, analysieren]);

  /* ---------- Nur Ertrag nachladen, wenn Neigung/Ausrichtung/Montage sich ändern ---------- */
  useEffect(() => {
    if (ersterLauf.current) {
      ersterLauf.current = false;
      return;
    }
    if (!punkt) return;
    const t = setTimeout(async () => {
      // Das Optimum hängt von der Montageart ab – bei deren Wechsel (oder ohne Daten) alles neu laden
      const d = datenRef.current;
      if (!d || d.ertrag?.parameter?.montage !== montage) {
        analysieren(punkt, { neigung, azimut, montage });
        return;
      }
      ertragAbbruch.current?.abort();
      const ctrl = new AbortController();
      ertragAbbruch.current = ctrl;
      setErtragLaedt(true);
      try {
        const qs = new URLSearchParams({ lat: punkt.lat.toFixed(5), lon: punkt.lon.toFixed(5), neigung: String(neigung), azimut: String(azimut), montage, nur: "ertrag" });
        const res = await fetch(`/api/standort?${qs}`, { signal: ctrl.signal });
        const json = await res.json().catch(() => ({}));
        setDaten((alt) => {
          if (!alt) return alt;
          if (!res.ok) return { ...alt, ertrag: { ...alt.ertrag, gewaehlt: null, fehler: json.error || "Ertrag nicht verfügbar." } };
          return { ...alt, ertrag: { ...json.ertrag, optimal: alt.ertrag?.optimal ?? null } };
        });
      } catch (e) {
        if (e.name !== "AbortError") setDaten((d) => (d ? { ...d, ertrag: { ...d.ertrag, gewaehlt: null, fehler: "Ertrag nicht verfügbar." } } : d));
      } finally {
        if (ertragAbbruch.current === ctrl) setErtragLaedt(false);
      }
    }, 900);
    return () => clearTimeout(t);
    // punkt bewusst nicht als Abhängigkeit: ein neuer Standort löst die Vollanalyse aus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neigung, azimut, montage]);

  /* ---------- Adresssuche (nur auf Knopfdruck – Nominatim-Regeln) ---------- */
  async function suchen(e) {
    e.preventDefault();
    const q = suche.trim();
    if (q.length < 3) {
      setSucheFehler("Bitte geben Sie mindestens drei Zeichen ein, z. B. Straße, Hausnummer und Ort.");
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
      if (liste.length === 0) setSucheFehler("Keine Adresse in Österreich gefunden. Prüfen Sie die Schreibweise oder klicken Sie den Standort direkt in der Karte an.");
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
    setPunkt({ lat: t.lat, lon: t.lon, label: t.label, quelle: "suche" });
  }

  function gps() {
    if (!navigator.geolocation) {
      setSucheFehler("Ihr Browser unterstützt keine Standortbestimmung.");
      return;
    }
    setSucheFehler("");
    navigator.geolocation.getCurrentPosition(
      (pos) => setPunkt({ lat: pos.coords.latitude, lon: pos.coords.longitude, quelle: "gps" }),
      () => setSucheFehler("Der Standort konnte nicht ermittelt werden. Bitte suchen Sie die Adresse oder klicken Sie in die Karte."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  const kartenWahl = useCallback((p) => setPunkt(p), []);

  /* ---------- abgeleitete Werte ---------- */
  const links = useMemo(() => (punkt ? horaLinks(punkt.lat, punkt.lon) : null), [punkt]);
  const seehoeheApi = daten?.seehoehe?.m ?? null;
  const seehoeheEingabe = zahlAus(hoeheText);
  const seehoehe = seehoeheEingabe ?? seehoeheApi;

  const richtwert = daten?.schneelastRichtwert?.sk > 0 ? daten.schneelastRichtwert : null;
  const istRichtwert = skQuelle === "richtwert";
  const sk = zahlAus(skText);
  const skFehler = skText.trim() !== "" && (sk == null || sk <= 0 || sk > 20) ? "Bitte einen Wert zwischen 0,1 und 20 kN/m² eingeben (z. B. 2,6)." : "";
  const schnee = useMemo(
    () => (sk && !skFehler ? bewerteSchnee({ sk, neigung, schneefang, seehoehe, dachtiefe }) : null),
    [sk, skFehler, neigung, schneefang, seehoehe, dachtiefe]
  );

  const vb0 = zahlAus(windText);
  const qb0 = vb0 && vb0 > 10 && vb0 < 60 ? basisGeschwindigkeitsdruck(vb0) : null;
  const windFehler = windText.trim() !== "" && !qb0 ? "Bitte v_b,0 in m/s eingeben, wie in eHORA angezeigt (z. B. 24,3)." : "";
  const hagelRes = hagel ? hagelEmpfehlung(hagel) : null;
  const altSk = altZone && seehoehe != null ? skAltformel(altZone, seehoehe) : null;

  const optimal = daten?.ertrag?.optimal;
  const gewaehlt = daten?.ertrag?.gewaehlt;
  const anteilOptimal = optimal?.ertrag && gewaehlt?.ertrag ? gewaehlt.ertrag / optimal.ertrag : null;
  const winterAnteil = gewaehlt?.monate ? (gewaehlt.monate[10] + gewaehlt.monate[11] + gewaehlt.monate[0] + gewaehlt.monate[1]) / gewaehlt.monate.reduce((a, b) => a + b, 0) : null;

  async function linkKopieren() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  const adresse = punkt?.label || daten?.lage?.adresse || null;

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      {/* Kopfleiste mit Fortschritt (nur Anzeige) */}
      <div className="flex flex-col gap-4 border-b border-ink-100 bg-white px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-ov-300">
            <Mountain aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-[16.5px] font-bold leading-tight text-ink-900">Standort-Check Photovoltaik</p>
            <p className="text-[12.5px] text-ink-500">Schneelast · Wind · Hagel · Ertrag</p>
          </div>
        </div>
        <ol aria-label="Fortschritt" className="flex flex-wrap gap-2">
          {[
            { n: 1, l: "Standort", ok: !!punkt },
            { n: 2, l: "Dach", ok: !!punkt },
            { n: 3, l: "Schneelast", ok: zahlAus(skText) != null },
          ].map((st) => (
            <li
              key={st.n}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-semibold ring-1 transition-colors duration-300",
                st.ok ? "bg-ov-50 text-ov-800 ring-ov-200" : "bg-white text-ink-500 ring-ink-200"
              )}
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px]", st.ok ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-500")}>
                {st.ok ? <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} /> : st.n}
              </span>
              {st.l}
              <span className="sr-only">{st.ok ? "(erledigt)" : "(offen)"}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* ================= Eingaben ================= */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="space-y-8 lg:sticky lg:top-24">
            <Gruppe titel="1 · Standort">
              <form onSubmit={suchen} role="search" aria-label="Adresse in Österreich suchen">
                <label htmlFor="standort-suche" className="mb-2 block text-[14.5px] font-semibold text-ink-800">
                  Adresse in Österreich
                </label>
                <div className="flex gap-2">
                  <input
                    id="standort-suche"
                    type="search"
                    value={suche}
                    onChange={(e) => setSuche(e.target.value)}
                    placeholder="z. B. Hinterstadt 18, Kitzbühel"
                    autoComplete="street-address"
                    className="min-h-12 w-full min-w-0 rounded-xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-ov-500"
                  />
                  <button
                    type="submit"
                    disabled={sucheLaeuft}
                    className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-ov-600 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700 disabled:opacity-60"
                  >
                    {sucheLaeuft ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Search aria-hidden="true" className="h-4 w-4" />}
                    Suchen
                  </button>
                </div>
              </form>
              <button type="button" onClick={gps} className="inline-flex items-center gap-2 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                <Crosshair aria-hidden="true" className="h-4 w-4" /> Aktuellen Standort verwenden
              </button>
              <p className="text-[12.5px] leading-relaxed text-ink-500">Oder klicken Sie direkt auf Ihr Dach in der Karte – im Orthofoto finden Sie es am schnellsten. Der Punkt lässt sich verschieben.</p>
              {sucheFehler && (
                <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-800 ring-1 ring-red-200">
                  {sucheFehler}
                </p>
              )}
              {treffer.length > 0 && (
                <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200" aria-label="Suchergebnisse">
                  {treffer.map((t) => (
                    <li key={`${t.lat},${t.lon}`}>
                      <button type="button" onClick={() => waehle(t)} className="flex w-full items-start gap-2.5 px-4 py-3 text-left text-[14px] text-ink-800 transition-colors hover:bg-ov-50">
                        <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                        <span className="min-w-0">
                          <span className="block font-semibold">{t.label}</span>
                          <span className="block truncate text-[12px] text-ink-500">{t.voll}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[11.5px] text-ink-400">Adresssuche: © OpenStreetMap-Mitwirkende (Nominatim)</p>
            </Gruppe>

            <Gruppe titel="2 · Dach & Montage">
              <Regler label="Dachneigung" wert={neigung} min={0} max={60} step={1} format={(v) => `${v}°`} onChange={setNeigung} hinweis="Flachdach 0–10°, Satteldach im Alpenraum meist 20–35°." />
              <Auswahl legende="Ausrichtung der Dachfläche" wert={ausrichtung} onChange={setAusrichtung} optionen={AUSRICHTUNGEN} klein />
              <Auswahl
                legende="Montage"
                wert={montage}
                onChange={setMontage}
                optionen={[
                  { id: "free", label: "Aufdach", sub: "hinterlüftet" },
                  { id: "building", label: "Indach", sub: "integriert" },
                ]}
              />
              <Schalter label="Schneefang vorhanden oder geplant" beschreibung="Verhindert Dachlawinen – der Schnee bleibt dafür auf dem Dach liegen." an={schneefang} onChange={setSchneefang} icon={ShieldCheck}>
                <Regler label="Tiefe bis First (Grundriss)" wert={dachtiefe} min={2} max={15} step={0.5} format={(v) => `${fmt(v, v % 1 ? 1 : 0)} m`} onChange={setDachtiefe} hinweis="Für die Kraft auf den Schneefang: waagrechter Abstand von der Traufe bis zum First bzw. nächsten Schneefang." />
              </Schalter>
            </Gruppe>
          </div>
        </div>

        {/* ================= Karte & Ergebnis ================= */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8">
          <div className="relative h-[320px] overflow-hidden rounded-3xl ring-1 ring-ink-200 sm:h-[380px] lg:h-[420px]">
            <Karte punkt={punkt} onWahl={kartenWahl} />
          </div>

          <p className="sr-only" aria-live="polite">
            {laedt ? "Standortdaten werden geladen" : daten ? `Standort geladen${adresse ? `: ${adresse}` : ""}` : ""}
          </p>

          {!punkt && (
            <div className="mt-6">
              <p className="font-display text-[19px] font-bold text-ink-900">So funktioniert der Check</p>
              <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: MapPin, t: <>Adresse suchen oder Dach in der Karte anklicken.</> },
                  { icon: Sun, t: <>Wir laden Seehöhe, Solarertrag (PVGIS) und einen Schneelast-Richtwert aus offenen GeoSphere-Daten – und verlinken die passende eHORA-Karte.</> },
                  { icon: Snowflake, t: <>Der Check bewertet mit dem Richtwert oder Ihrem Normwert s<sub>k</sub> aus eHORA Dach, Module, Unterkonstruktion und Schneefang.</> },
                ].map((st, i) => (
                  <li key={i} className="relative rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/70">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                        <st.icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="font-display text-[13px] font-bold tracking-[0.18em] text-ink-300">0{i + 1}</span>
                    </div>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-ink-700">{st.t}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {punkt && (
            <div className="mt-6 space-y-6">
              {/* ---------- Lage ---------- */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Standort</p>
                  <p className="mt-1 font-display text-[20px] font-extrabold leading-snug text-ink-900 md:text-[22px]">{adresse || (laedt ? "Adresse wird ermittelt …" : "Punkt in der Karte")}</p>
                  <p className="ov-num mt-1 text-[13px] text-ink-500">
                    {punkt.lat.toFixed(5)}° N, {punkt.lon.toFixed(5)}° O
                  </p>
                </div>
                <button type="button" onClick={linkKopieren} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink-100 px-4 text-[13.5px] font-semibold text-ink-700 transition-colors hover:bg-ink-200">
                  <Link2 aria-hidden="true" className="h-4 w-4" />
                  {kopiert ? "Link kopiert" : "Link zum Ergebnis"}
                </button>
              </div>

              {fehler && (
                <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[14px] text-red-800 ring-1 ring-red-200">
                  {fehler}
                </p>
              )}

              {/* ---------- Schritt 3: Werte aus eHORA ---------- */}
              <section aria-labelledby="hora-titel" className="rounded-3xl bg-navy-950 p-5 text-white md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">3 · Schneelast & Werte aus eHORA</p>
                    <h2 id="hora-titel" className="mt-2 font-display text-[21px] font-extrabold leading-snug md:text-[24px]">
                      {richtwert ? (
                        <>
                          Schneelast-Richtwert automatisch – Normwert s<sub>k</sub> in eHORA
                        </>
                      ) : (
                        <>
                          Schneelast s<sub>k</sub> für genau diesen Punkt ablesen
                        </>
                      )}
                    </h2>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">
                      {richtwert
                        ? "Den Richtwert berechnen wir aus offenen Schneedaten von GeoSphere Austria (1-km-Raster, 50-jährlicher Wert). Maßgeblich für Statik und Einreichung ist die Schneelastkarte der ÖNORM B 1991-1-3:2022 in HORA (Raster 50 × 50 m) – der Link öffnet sie an Ihrem Standort samt Info-Fenster. HORA selbst fragen wir nicht automatisch ab."
                        : "Die Schneelastkarte der ÖNORM B 1991-1-3:2022 liegt nur in HORA vor (Raster 50 × 50 m). Der Link öffnet die Karte an Ihrem Standort samt Info-Fenster – dort steht sₖ in kN/m²."}
                    </p>
                  </div>
                  {links && <HoraKnopf href={links.schnee.href}>Schneelast in eHORA öffnen</HoraKnopf>}
                </div>

                <div className="mt-6 grid gap-4 rounded-2xl bg-white p-4 text-ink-900 sm:grid-cols-2 md:p-5">
                  <ZahlFeld
                    label="Charakteristische Schneelast sₖ"
                    einheit="kN/m²"
                    wert={skText}
                    onChange={(v) => {
                      setSkText(v);
                      setSkQuelle("hora");
                    }}
                    placeholder={laedt && !skText ? "Richtwert wird geladen …" : "z. B. 2,6"}
                    fehler={skFehler}
                    hinweis={
                      istRichtwert ? (
                        <>
                          Richtwert aus GeoSphere-Daten (1-km-Raster) – für die Statik gilt der Normwert aus eHORA.
                          {richtwert?.nachbarzelle ? " Grenzlage: Wert der benachbarten Rasterzelle." : ""}{" "}
                          <span className="block pt-0.5 text-[11.5px] text-ink-400">Datenbasis: GeoSphere Austria, SNOWGRID-CL (CC BY 4.0), eigene Auswertung</span>
                        </>
                      ) : (
                        <>
                          {skQuelle === "altformel" ? "Grobschätzung nach alter Zonenformel – bitte durch den eHORA-Wert ersetzen." : "Wert „sₖ“ aus dem eHORA-Info-Fenster (50-jährliches Ereignis)."}
                          {richtwert && (
                            <>
                              {" "}
                              Richtwert GeoSphere: <span className="ov-num">{fmt(richtwert.sk, 1)} kN/m²</span> –{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setSkText(fmt(richtwert.sk, 1));
                                  setSkQuelle("richtwert");
                                }}
                                className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2"
                              >
                                übernehmen
                              </button>
                            </>
                          )}
                        </>
                      )
                    }
                  />
                  <ZahlFeld
                    label="Seehöhe"
                    einheit="m"
                    wert={hoeheText}
                    onChange={setHoeheText}
                    placeholder={seehoeheApi != null ? fmt(seehoeheApi) : laedt ? "wird geladen …" : "z. B. 1.250"}
                    hinweis={seehoeheApi != null ? `Automatisch: ${fmt(seehoeheApi)} m (${daten?.seehoehe?.quelle}). Bei Abweichung den eHORA-Wert eintragen.` : "Wird automatisch ermittelt; eHORA zeigt die Seehöhe ebenfalls an."}
                  />
                  <ZahlFeld
                    label="Basiswindgeschwindigkeit v_b,0 (optional)"
                    einheit="m/s"
                    wert={windText}
                    onChange={setWindText}
                    placeholder="z. B. 25,1"
                    fehler={windFehler}
                    hinweis={
                      links ? (
                        <>
                          Aus eHORA,{" "}
                          <a href={links.wind.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                            Karte Basiswindgeschwindigkeit
                          </a>
                          .
                        </>
                      ) : null
                    }
                  />
                  <div>
                    <label htmlFor="hagel-stufe" className="mb-2 block text-[14.5px] font-semibold text-ink-800">
                      Hagelkorngröße, 30 Jahre (optional)
                    </label>
                    <select
                      id="hagel-stufe"
                      value={hagel}
                      onChange={(e) => setHagel(e.target.value)}
                      className="min-h-12 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-ink-200 focus:ring-2 focus:ring-ov-500"
                    >
                      <option value="">– aus eHORA wählen –</option>
                      {HAGELSTUFEN.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.label}
                        </option>
                      ))}
                    </select>
                    {links && (
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500">
                        Aus eHORA,{" "}
                        <a href={links.hagel.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                          Karte Hagelgefährdung
                        </a>
                        .
                      </p>
                    )}
                  </div>
                </div>

                {/* Rückfall ohne Richtwert (Rasterdatei fehlt oder Punkt ohne Wert): alte Zonenformel */}
                {!richtwert && !laedt && (
                  <details className="group mt-4 rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[14px] font-semibold text-white/85 [&::-webkit-details-marker]:hidden">
                      Kein eHORA-Wert zur Hand? Konservative Grobschätzung
                      <span aria-hidden="true" className="text-white/50 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="space-y-3 px-4 pb-4 text-[13.5px] leading-relaxed text-white/70">
                      <p>
                        Bis 2022 galt eine Zonenformel: s<sub>k</sub> = (0,642 · Z + 0,009) · [1 + (A/728)²] mit A = Seehöhe. Sie ist nicht mehr normgültig, war nur bis 1.500 m anwendbar und lag im Mittel über den heutigen Werten.
                        Kennen Sie die alte Zone Ihres Standorts (z. B. aus früheren Einreichunterlagen), erhalten Sie damit eine vorsichtige erste Annahme – mehr nicht.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor="alt-zone" className="font-semibold text-white">
                          Alte Zone
                        </label>
                        <select id="alt-zone" value={altZone} onChange={(e) => setAltZone(e.target.value)} className="min-h-10 rounded-lg bg-white px-3 text-[14px] text-ink-900">
                          <option value="">wählen</option>
                          {ALTZONEN.map((z) => (
                            <option key={z.id} value={z.id}>
                              Zone {z.id} (Z = {fmt(z.z, 1)})
                            </option>
                          ))}
                        </select>
                        {altSk != null && (
                          <>
                            <span className="ov-num font-semibold text-white">≈ {fmt(altSk, 2)} kN/m²</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSkText(fmt(Math.ceil(altSk * 20) / 20, 2));
                                setSkQuelle("altformel");
                              }}
                              className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                            >
                              als Annahme verwenden
                            </button>
                          </>
                        )}
                      </div>
                      {altZone && seehoehe == null && <p>Für die Schätzung wird die Seehöhe benötigt.</p>}
                      {altSk != null && seehoehe > ALTFORMEL_MAX_SEEHOEHE && <p className="text-sun-300">Achtung: Die alte Formel war nur bis 1.500 m anwendbar.</p>}
                    </div>
                  </details>
                )}
              </section>

              {/* ---------- Schnee-Ergebnis ---------- */}
              <section aria-labelledby="schnee-titel">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id="schnee-titel" className="flex items-center gap-2 font-display text-[21px] font-extrabold tracking-tight text-ink-900 md:text-[24px]">
                    <Snowflake aria-hidden="true" className="h-5 w-5 text-navy-600" /> Schneelast auf Dach und Modul
                  </h2>
                  {schnee && (
                    <span className={cn("rounded-full px-3 py-1 text-[12.5px] font-semibold", istRichtwert ? "bg-navy-50 text-navy-700 ring-1 ring-navy-200" : "bg-ink-100 text-ink-600")}>
                      {skQuelle === "altformel" ? "Annahme: alte Zonenformel" : istRichtwert ? "Richtwert GeoSphere" : "sₖ aus eHORA"}
                    </span>
                  )}
                </div>

                {!schnee ? (
                  <p className="mt-3 rounded-2xl bg-sand-50 px-4 py-3.5 text-[14.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
                    {laedt && !skText ? (
                      "Der Schneelast-Richtwert für diesen Standort wird geladen …"
                    ) : (
                      <>
                        Tragen Sie oben die Schneelast s<sub>k</sub> aus eHORA ein – dann berechnen wir die Dachschneelast, die Last je Modul und vergleichen sie mit den Prüflasten gängiger Module.
                      </>
                    )}
                  </p>
                ) : (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                      <Kennzahl icon={Mountain} label="sₖ am Boden" zusatz={istRichtwert ? "Richtwert, 50-jährlich" : "charakteristisch, 50 Jahre"}>
                        <Zahl wert={schnee.sk} stellen={istRichtwert ? 1 : 2} suffix=" kN/m²" />
                      </Kennzahl>
                      <Kennzahl icon={Snowflake} label="Dachschneelast s" zusatz={`μ₁ = ${fmt(schnee.mu1, 2)} · Cₑ = 1 · Cₜ = 1`}>
                        <Zahl wert={schnee.s} stellen={2} suffix=" kN/m²" />
                      </Kennzahl>
                      <Kennzahl label="je m² Modulfläche" zusatz={`${fmt(Math.round(schnee.modulFlaeche * 1000))} Pa charakteristisch`}>
                        <Zahl wert={schnee.modulFlaeche} stellen={2} suffix=" kN/m²" />
                      </Kennzahl>
                      <Kennzahl ton="navy" label="Bemessungswert" zusatz={`× γQ = ${fmt(GAMMA_Q, 1)} (Sicherheitsbeiwert)`}>
                        <Zahl wert={schnee.bemessungPa} suffix=" Pa" />
                      </Kennzahl>
                    </div>

                    {istRichtwert && (
                      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
                        s<sub>k</sub> = Richtwert aus dem 1-km-Raster
                        {richtwert?.zeitraum ? ` (${richtwert.zeitraum}, 50-jährlich)` : ""}. Datenbasis: GeoSphere Austria, SNOWGRID-CL (CC BY 4.0), eigene Auswertung. Für die Statik gilt der Normwert aus{" "}
                        {links ? (
                          <a href={links.schnee.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                            eHORA
                          </a>
                        ) : (
                          "eHORA"
                        )}
                        .
                      </p>
                    )}

                    <div className="mt-5 rounded-3xl ring-1 ring-ink-200/70">
                      <div className="px-5 pt-5 md:px-6">
                        <h3 className="font-display text-[17px] font-bold text-ink-900">Reichen die Module?</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                          Prüflast laut Datenblatt ÷ {fmt(GAMMA_M_MODUL, 1)} = Bemessungslast des Moduls (IEC 61215). Verglichen mit dem Bemessungswert der Schneelast je Modulfläche.
                        </p>
                      </div>
                      <ul className="mt-4 divide-y divide-ink-100">
                        {schnee.module.map((m) => {
                          const st = STATUS[m.status];
                          return (
                            <li key={m.id} className="px-5 py-4 md:px-6">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-[15px] font-semibold text-ink-900">
                                  {fmt(m.pruef)} Pa Prüflast <span className="font-normal text-ink-500">· {m.name}, Bemessung {fmt(m.bemessung)} Pa</span>
                                </p>
                                <span className={cn("rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1", st.chip)}>{st.text}</span>
                              </div>
                              <div className="mt-2.5 flex items-center gap-3">
                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100" role="img" aria-label={`Auslastung ${Math.round(m.auslastung * 100)} Prozent`}>
                                  <div className={cn("h-full rounded-full transition-[width] duration-500", st.balken)} style={{ width: `${Math.min(100, m.auslastung * 100)}%` }} />
                                </div>
                                <span className="ov-num w-16 shrink-0 text-right text-[14px] font-bold text-ink-900">{Math.round(m.auslastung * 100)} %</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-100 md:p-6">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-700">Empfehlung Module</p>
                        <p className="mt-2 font-display text-[18px] font-bold text-ink-900">
                          {schnee.empfohlen ? `Mindestens ${fmt(schnee.empfohlen.pruef)} Pa Prüflast` : "Sonderlösung mit Einzelnachweis"}
                        </p>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-700">
                          {schnee.empfohlen
                            ? `${schnee.empfohlen.name}: ${schnee.empfohlen.text}. Die Freigabe gilt nur mit dem vom Hersteller genannten Klemmbereich und der zugehörigen Unterkonstruktion.`
                            : "Keine Standard-Modulklasse deckt diese Last ab."}
                        </p>
                      </div>
                      <div className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Empfehlung Unterkonstruktion</p>
                        <p className="mt-2 font-display text-[18px] font-bold text-ink-900">{schnee.unterkonstruktion.titel}</p>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-700">{schnee.unterkonstruktion.text}</p>
                      </div>
                    </div>

                    {schnee.schneefangKraft != null && (
                      <div className="mt-4">
                        <Hinweis>
                          <strong>Schneefang:</strong> Bei {fmt(schnee.dachtiefe, 1)} m Tiefe bis zum First wirken rund <strong className="ov-num">{fmt(schnee.schneefangKraft, 2)} kN je Meter</strong> Traufe (charakteristisch, F<sub>s</sub> = s · b · sin α nach ÖNORM EN 1991-1-3).
                          Schneefanggitter und ihre Befestigung – bei PV auch die Befestigung durch die Modulebene – müssen dafür bemessen sein.
                        </Hinweis>
                      </div>
                    )}

                    {(schnee.hinweise.length > 0 || (seehoehe != null && seehoehe > HORA_MAX_SEEHOEHE)) && (
                      <div className="mt-4 space-y-3">
                        {schnee.hinweise.map((h) => (
                          <Hinweis key={h} ton="warn">
                            {h}
                          </Hinweis>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>

              {/* ---------- Wind & Hagel ---------- */}
              <section aria-label="Wind und Hagel" className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl p-5 ring-1 ring-ink-200/70 md:p-6">
                  <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                    <Wind aria-hidden="true" className="h-5 w-5 text-navy-600" /> Wind
                  </p>
                  {qb0 ? (
                    <>
                      <p className="ov-num mt-3 font-display text-[26px] font-extrabold text-ink-900">
                        q<sub className="text-[14px]">b,0</sub> = {fmt(qb0, 2)} kN/m²
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                        Basisgeschwindigkeitsdruck aus v<sub>b,0</sub> = {fmt(vb0, 1)} m/s (½ · 1,25 kg/m³ · v²). Der maßgebliche Böengeschwindigkeitsdruck hängt zusätzlich von Geländekategorie und Gebäudehöhe ab; an Rand- und Eckbereichen wirkt starker Sog – dort
                        brauchen Module mehr Befestigungspunkte oder Abstand zur Dachkante.
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                      Tragen Sie v<sub>b,0</sub> aus eHORA ein, dann zeigen wir den Basisgeschwindigkeitsdruck nach ÖNORM B 1991-1-4. Die Windlast bemessen wir für jede Anlage mit der Herstellerstatik der Unterkonstruktion.
                    </p>
                  )}
                </div>
                <div className="rounded-3xl p-5 ring-1 ring-ink-200/70 md:p-6">
                  <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                    <CloudHail aria-hidden="true" className="h-5 w-5 text-navy-600" /> Hagel
                  </p>
                  {hagelRes ? (
                    <>
                      <p className="mt-3 font-display text-[26px] font-extrabold text-ink-900">Hagelwiderstand HW {hagelRes.hw}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                        Bei Hagelkörnern {hagelRes.stufe.label} (30-jährlich) empfehlen wir Module, die im Hagelregister mindestens mit HW {hagelRes.hw} gelistet sind (Prüfung mit {hagelRes.hw} cm Eiskugeln).
                        {hagelRes.ueberHw5 ? " Größere Körner übersteigen die höchste Klasse HW 5 – Glas-Glas-Module und eine Hagelversicherung sind hier besonders wichtig." : ""} Die Typprüfung nach IEC 61215 verwendet nur 25-mm-Eiskugeln.
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-600">
                      Wählen Sie die Hagelkorngröße aus eHORA. Wir empfehlen dazu die passende Hagelwiderstandsklasse (HW 1–5) laut{" "}
                      <a href="https://www.hagelregister.at/hagelregister/" target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                        Hagelregister
                      </a>
                      .
                    </p>
                  )}
                </div>
              </section>

              {/* ---------- Ertrag ---------- */}
              <section aria-labelledby="ertrag-titel" className="rounded-3xl ring-1 ring-ink-200/70">
                <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 md:px-6">
                  <h2 id="ertrag-titel" className="flex items-center gap-2 font-display text-[21px] font-extrabold tracking-tight text-ink-900 md:text-[24px]">
                    <Sun aria-hidden="true" className="h-5 w-5 text-sun-500" /> Solarertrag an diesem Standort
                  </h2>
                  {(laedt || ertragLaedt) && (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-500">
                      <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> PVGIS rechnet …
                    </span>
                  )}
                </div>
                {daten?.ertrag?.fehler && !gewaehlt && (
                  <div className="px-5 pt-3 md:px-6">
                    <Hinweis ton="warn">{daten.ertrag.fehler}</Hinweis>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 px-5 pt-4 md:px-6 xl:grid-cols-3">
                  <Kennzahl ton="gruen" icon={Sun} label="Ihre Dachfläche" zusatz={`${neigung}° · ${AUSRICHTUNGEN.find((a) => a.id === ausrichtung)?.label} · ${montage === "building" ? "Indach" : "Aufdach"}`}>
                    {gewaehlt ? <Zahl wert={gewaehlt.ertrag} suffix=" kWh/kWp" /> : <span className="text-white/70">–</span>}
                  </Kennzahl>
                  <Kennzahl icon={Crosshair} label="Optimum am Standort" zusatz={optimal ? `${optimal.neigung}° Neigung, Azimut ${optimal.azimut > 0 ? "+" : ""}${optimal.azimut}°` : "wird berechnet"}>
                    {optimal ? <Zahl wert={optimal.ertrag} suffix=" kWh/kWp" /> : "–"}
                  </Kennzahl>
                  <Kennzahl label="Anteil vom Optimum" zusatz={winterAnteil != null ? `Winteranteil Nov–Feb: ${fmt(winterAnteil * 100)} %` : " "}>
                    {anteilOptimal != null ? <Zahl wert={anteilOptimal * 100} suffix=" %" /> : "–"}
                  </Kennzahl>
                </div>
                {gewaehlt?.monate && <Monatsbalken monate={gewaehlt.monate} />}
                <p className="px-5 pb-5 pt-3 text-[12.5px] leading-relaxed text-ink-500 md:px-6">
                  PVGIS {gewaehlt?.datenbank ? `(${gewaehlt.datenbank}, ${gewaehlt.zeitraum})` : ""} © Europäische Union – für 1 kWp, 14 % Systemverluste, Geländehorizont berücksichtigt. Nicht enthalten: Schneebedeckung der Module, Verschattung durch
                  Gebäude und Bäume. Im Hochgebirge liegt der Winterertrag dadurch oft niedriger – oder durch Schneereflexion bei steilen Modulen höher.
                </p>
              </section>

              {/* ---------- weitere HORA-Karten ---------- */}
              {links && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(links).map(([id, l]) => (
                    <a
                      key={id}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3.5 py-2 text-[13px] font-semibold text-ink-700 transition-colors hover:bg-ink-200"
                    >
                      eHORA: {l.titel} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              )}

              {/* ---------- Abschluss ---------- */}
              <div className="flex flex-col gap-4 border-t border-ink-100 pt-6">
                <p className="text-[13px] leading-relaxed text-ink-500">
                  <strong className="text-ink-700">Wichtig:</strong> Der Standort-Check ist eine Vorabschätzung und ersetzt keine statische Berechnung. Ob Dachstuhl, Unterkonstruktion und Module die Lasten tragen, bestätigt eine befugte Tragwerksplanung
                  (Statik) auf Basis der Normen-Standortabfrage aus HORA. Angaben aus HORA sind laut BMLUK keine amtliche Auskunft.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button href="/angebot" size="lg" pfeil>
                    Standort durch Ökovolt prüfen lassen
                  </Button>
                  <Button href="/termin?art=vor-ort" size="lg" variant="secondary" icon={CalendarCheck2}>
                    Vor-Ort-Termin
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Monatsbalken({ monate }) {
  const max = Math.max(...monate, 1);
  return (
    <figure className="px-5 pt-5 md:px-6">
      <figcaption className="text-[13px] font-semibold text-ink-700">Ertrag je Monat (kWh je kWp)</figcaption>
      <div className="mt-3 flex h-32 items-end gap-1.5 sm:gap-2" role="img" aria-label={`Monatserträge: ${monate.map((m, i) => `${MONATE[i]} ${fmt(m)} kWh`).join(", ")}`}>
        {monate.map((m, i) => (
          <div key={MONATE[i]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className="ov-num hidden text-[10.5px] text-ink-500 sm:block">{fmt(m)}</span>
            <div className={cn("w-full rounded-t-md", i <= 1 || i >= 10 ? "bg-navy-300" : "bg-ov-500")} style={{ height: `${Math.max(3, (m / max) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5 sm:gap-2">
        {MONATE.map((m) => (
          <span key={m} className="min-w-0 flex-1 text-center text-[10.5px] text-ink-500">
            {m}
          </span>
        ))}
      </div>
    </figure>
  );
}
