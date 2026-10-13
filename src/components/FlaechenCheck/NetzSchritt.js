"use client";

// src/components/FlaechenCheck/NetzSchritt.js – Netzschritt mit Karte (Welle B, Paket B06)
//
// „Fläche auf Karte markieren“: Punkt per Klick, Ortssuche (/api/standort, nur auf Knopfdruck) oder
// Gerätestandort → Luftlinie zum nächsten Umspannwerk aus der ODbL-Datei /daten/umspannwerke-at.json
// (eigener Server, kein Live-Abruf bei OpenStreetMap). Das Ergebnis meldet onVorschlag(km) – der
// Flächen-Check belegt damit den Netz-Regler vor, der Nutzer kann ihn danach frei verstellen.
// Keine Kapazitätswerte: Links auf die Veröffentlichungen der Netzbetreiber (netzkapazitaetQuellen.js).

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { ArrowUpRight, Cable, Crosshair, Download, Loader2, MapPin, Search, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { DOWNLOAD_PFAD, LUFTLINIE_HINWEIS, ODBL_HINWEIS, ODBL_URL, netzVorschlag, stationsName } from "@/lib/flaeche/netz";
import { zahl } from "@/lib/flaeche/format";
import { KAPAZITAET_PFAD, kapazitaetQuellenFuerLand } from "@/data/netzkapazitaetQuellen";

const NetzKarte = dynamic(() => import("./NetzKarte"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-100 text-[14px] text-ink-500">
      <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" /> Karte wird geladen …
    </div>
  ),
});

// Datei nur einmal je Seitenaufruf laden (rund 0,5 MB, vom eigenen Server, Browser-Cache)
let datenVersprechen = null;
function ladeUmspannwerke() {
  if (!datenVersprechen) {
    datenVersprechen = fetch(DOWNLOAD_PFAD)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .catch((e) => {
        datenVersprechen = null;
        throw e;
      });
  }
  return datenVersprechen;
}

const kmText = (km) => (km < 1 ? `${zahl(Math.round(km * 1000 / 10) * 10)} m` : `${zahl(km, 1)} km`);

/** Ergebnisblock: nächste Stationen, Hinweis, Attribution. */
export function NetzErgebnis({ vorschlag, dunkel = false }) {
  if (!vorschlag) return null;
  const { mittel, hoch } = vorschlag;
  const zeilen = [{ titel: "Nächste Station ab 20 kV", s: mittel }];
  if (hoch && (hoch.lat !== mittel.lat || hoch.lon !== mittel.lon)) zeilen.push({ titel: "Nächstes Umspannwerk ab 110 kV", s: hoch });
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {zeilen.map(({ titel, s }) => (
        <div key={titel} className={cn("rounded-2xl p-3.5", dunkel ? "bg-white/5 ring-1 ring-white/10" : "bg-white ring-1 ring-ink-200/70")}>
          <dt className={cn("text-[12.5px]", dunkel ? "text-white/65" : "text-ink-500")}>{titel}</dt>
          <dd className={cn("ov-num mt-0.5 font-display text-[19px] font-extrabold tracking-tight", dunkel ? "text-white" : "text-ink-900")}>≈ {kmText(s.km)} Luftlinie</dd>
          <dd className={cn("text-[13px] leading-snug", dunkel ? "text-white/70" : "text-ink-600")}>{stationsName(s)}{s.name ? ` · ${s.kv} kV` : ""}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Pflicht-Namensnennung für die Umspannwerk-Daten (ODbL) samt Download. */
export function OdblHinweis({ className, dunkel = false }) {
  const link = dunkel ? "underline decoration-white/40 underline-offset-2 hover:text-white" : "underline decoration-ink-300 underline-offset-2 hover:text-ov-700";
  return (
    <p className={cn("text-[12.5px] leading-relaxed", dunkel ? "text-white/60" : "text-ink-500", className)}>
      Umspannwerke:{" "}
      <a href={ODBL_URL} target="_blank" rel="noopener noreferrer" className={link}>
        {ODBL_HINWEIS}
        <span className="sr-only"> (externer Link, neues Fenster)</span>
      </a>{" "}
      ·{" "}
      <a href={DOWNLOAD_PFAD} download className={cn("inline-flex items-center gap-0.5", link)}>
        <Download aria-hidden="true" className="h-3 w-3" />
        Datensatz (ODbL) herunterladen
      </a>
    </p>
  );
}

/**
 * @param {object} p
 * @param {string} [p.bundesland]       Slug aus src/lib/flaeche/laender.js – für die passenden Kapazitäts-Links
 * @param {(km:number)=>void} [p.onVorschlag]  meldet die gerundete Luftlinie (Regler-Vorbelegung)
 * @param {(e:object|null)=>void} [p.onErgebnis] meldet { punkt, vorschlag } für Exporte
 * @param {boolean} [p.startOffen=false] Karte sofort zeigen (Wegweiser-Seite)
 * @param {boolean} [p.mitKapazitaetsLinks=true]
 */
export default function NetzSchritt({ bundesland, onVorschlag, onErgebnis, startOffen = false, mitKapazitaetsLinks = true }) {
  const sucheId = useId();
  const [offen, setOffen] = useState(startOffen);
  const [daten, setDaten] = useState(null);
  const [ladeFehler, setLadeFehler] = useState("");
  const [punkt, setPunkt] = useState(null);
  const [vorschlag, setVorschlag] = useState(null);
  const [suche, setSuche] = useState("");
  const [sucheLaeuft, setSucheLaeuft] = useState(false);
  const [sucheFehler, setSucheFehler] = useState("");
  const [treffer, setTreffer] = useState([]);

  useEffect(() => {
    if (!offen || daten) return;
    let aktiv = true;
    ladeUmspannwerke()
      .then((d) => aktiv && setDaten(d))
      .catch(() => aktiv && setLadeFehler("Die Umspannwerk-Daten konnten nicht geladen werden. Bitte laden Sie die Seite neu oder schätzen Sie die Entfernung im Regler."));
    return () => {
      aktiv = false;
    };
  }, [offen, daten]);

  // Punkt + Daten → Vorschlag
  useEffect(() => {
    if (!punkt || !daten) return;
    const v = netzVorschlag(punkt, daten);
    setVorschlag(v);
    if (v) onVorschlag?.(v.km);
    onErgebnis?.(v ? { punkt, vorschlag: v } : null);
    // onVorschlag/onErgebnis bewusst nicht in den Abhängigkeiten: nur bei neuem Punkt neu vorbelegen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [punkt, daten]);

  const waehle = useCallback((p) => {
    setTreffer([]);
    setPunkt({ lat: p.lat, lon: p.lon });
  }, []);

  async function suchen(e) {
    e.preventDefault();
    const q = suche.trim();
    if (q.length < 3) {
      setSucheFehler("Bitte mindestens drei Zeichen eingeben, z. B. Ort oder Straße und Ort.");
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
      if (liste.length === 0) setSucheFehler("Nichts in Österreich gefunden. Prüfen Sie die Schreibweise oder klicken Sie die Fläche direkt in der Karte an.");
      else if (liste.length === 1) waehle(liste[0]);
      else setTreffer(liste.slice(0, 5));
    } catch (err) {
      setSucheFehler(err.message);
    } finally {
      setSucheLaeuft(false);
    }
  }

  function gps() {
    if (!navigator.geolocation) {
      setSucheFehler("Ihr Browser unterstützt keine Standortbestimmung.");
      return;
    }
    setSucheFehler("");
    navigator.geolocation.getCurrentPosition(
      (pos) => waehle({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setSucheFehler("Der Standort konnte nicht ermittelt werden. Klicken Sie die Fläche bitte in der Karte an."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const stationen = vorschlag ? [vorschlag.mittel, vorschlag.hoch].filter((s, i, a) => s && a.findIndex((x) => x && x.lat === s.lat && x.lon === s.lon) === i) : [];
  const quellen = mitKapazitaetsLinks ? kapazitaetQuellenFuerLand(bundesland) : [];

  if (!offen) {
    return (
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy-950 px-4 py-3 text-[14.5px] font-semibold text-white transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        <MapPin aria-hidden="true" className="h-4 w-4 text-ov-300" />
        Fläche auf Karte markieren
        <span className="font-normal text-white/60">(optional)</span>
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl bg-sand-50 p-3 ring-1 ring-ink-200/70 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[14.5px] font-semibold text-ink-900">
          <Cable aria-hidden="true" className="h-4 w-4 text-ov-600" />
          Weg zum Netz auf der Karte
        </p>
        {!startOffen && (
          <button type="button" onClick={() => setOffen(false)} className="-m-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500" aria-label="Karte schließen">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={suchen} className="flex gap-2" role="search">
        <label htmlFor={sucheId} className="sr-only">
          Ort oder Adresse der Fläche
        </label>
        <input
          id={sucheId}
          type="text"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="Ort oder Adresse, z. B. Eferding"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-2xl bg-white px-4 text-[15px] text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-500 focus-visible:ring-2 focus-visible:ring-ov-500"
        />
        <button type="submit" disabled={sucheLaeuft} className="inline-flex h-11 items-center gap-1.5 rounded-2xl bg-ov-600 px-3.5 text-[14px] font-semibold text-white transition hover:bg-ov-700 disabled:opacity-60" aria-label="Ort suchen">
          {sucheLaeuft ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Search aria-hidden="true" className="h-4 w-4" />}
          <span className="hidden sm:inline">Suchen</span>
        </button>
        <button type="button" onClick={gps} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:text-ov-700" aria-label="Meinen Standort verwenden" title="Meinen Standort verwenden">
          <Crosshair aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
      {sucheFehler && (
        <p role="alert" className="text-[13.5px] text-red-700">
          {sucheFehler}
        </p>
      )}
      {treffer.length > 0 && (
        <ul className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200">
          {treffer.map((t) => (
            <li key={`${t.lat}-${t.lon}`}>
              <button type="button" onClick={() => waehle(t)} className="block w-full px-4 py-2.5 text-left text-[14px] text-ink-800 hover:bg-ov-50">
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative h-72 overflow-hidden rounded-2xl ring-1 ring-ink-200 sm:h-80">
        <NetzKarte punkt={punkt} stationen={stationen} onWahl={waehle} />
      </div>
      <p className="text-[13px] leading-relaxed text-ink-600">{punkt ? "Marker verschieben oder neu klicken, um den Punkt zu ändern." : "Klicken Sie auf die Mitte Ihrer Fläche – oder suchen Sie den Ort oben."}</p>

      {ladeFehler && (
        <p role="alert" className="text-[13.5px] text-red-700">
          {ladeFehler}
        </p>
      )}
      <div role="status" aria-live="polite">
        {punkt && !daten && !ladeFehler && (
          <p className="flex items-center gap-2 text-[13.5px] text-ink-600">
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Umspannwerke werden geladen …
          </p>
        )}
        {vorschlag && (
          <div className="space-y-2">
            <NetzErgebnis vorschlag={vorschlag} />
            {onVorschlag && (
              <p className="text-[13px] leading-relaxed text-ink-600">
                Der Regler „Entfernung zum Netzanschluss“ ist jetzt mit {zahl(vorschlag.km, 1)} km vorbelegt{vorschlag.gekappt ? " (Reglerende – tatsächlich weiter)" : ""} – Sie können ihn jederzeit überschreiben.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="rounded-2xl bg-white p-3 text-[13px] font-medium leading-relaxed text-ink-800 ring-1 ring-ink-200/70">
        {LUFTLINIE_HINWEIS} Die Karte zeigt Stationen aus OpenStreetMap – ohne Angaben zu freier Kapazität.
      </p>

      {quellen.length > 0 && (
        <div className="text-[13.5px] leading-relaxed text-ink-700">
          <p className="font-semibold text-ink-900">Freie Netzkapazität prüfen:</p>
          <ul className="mt-1 space-y-1">
            {quellen.map((q) => (
              <li key={q.slug}>
                <a href={q.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  {q.name === "ebUtilities (alle Netzbetreiber)" ? "ebUtilities – alle Netzbetreiber" : `${q.name}: ${q.titel}`}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="sr-only"> (externer Link, neues Fenster)</span>
                </a>
                {q.slug !== "alle" && <span className="text-ink-500"> · {q.gebiet}</span>}
              </li>
            ))}
            <li>
              <Link href={KAPAZITAET_PFAD} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                So lesen Sie die Kapazitätsangaben
              </Link>
            </li>
          </ul>
        </div>
      )}

      <OdblHinweis />
    </div>
  );
}
