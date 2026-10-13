"use client";

// src/components/RechnerGewerbe/DachKarte.js – Leaflet-Karte für den Hallendach-Planer (B05)
//
// Wird von DachZeichnen.js per dynamic import (ssr: false) erst beim Aufklappen geladen.
// Orthofoto und Grundkarte von basemap.at (Verwaltungsgrundkarte Österreich, CC BY 4.0) –
// Namensnennung „Datenquelle: basemap.at“ ist Pflicht und steht zusätzlich sichtbar unter
// der Karte (DachZeichnen.js). Die Kacheln kommen von den Geoland-Servern (mapsneu.wien.gv.at);
// dabei wird die IP-Adresse des Besuchers an diesen Server übertragen (Datenschutz-Hinweis D07).
//
// Bedienung: Klick setzt einen Eckpunkt, Punkte sind verschiebbar, Doppelklick auf einen Punkt
// löscht ihn. Tastatur (Karte fokussiert): Pfeiltasten verschieben den Ausschnitt (Leaflet),
// Enter setzt einen Punkt im Fadenkreuz, Rücktaste/Entf löscht den letzten Punkt.
// Alle Koordinaten bleiben im Browser.

import { useEffect } from "react";
import L from "leaflet";
import { LayersControl, MapContainer, Marker, Polygon, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const BASEMAP = "https://mapsneu.wien.gv.at/basemap";
const ATTRIBUTION = 'Datenquelle: <a href="https://www.basemap.at" target="_blank" rel="noopener noreferrer">basemap.at</a> (CC BY 4.0)';
const OESTERREICH_MITTE = [47.6, 13.35];

// Eckpunkt im Markenstil (divIcon, keine Bilddateien)
const ECKE = L.divIcon({
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#fff;border:5px solid #669933;box-shadow:0 2px 10px rgba(0,0,0,.45)"></span>',
});

const LINIE = { color: "#669933", weight: 3, opacity: 0.95 };
const FLAECHE = { color: "#669933", weight: 3, fillColor: "#8fbf4d", fillOpacity: 0.35 };

function Klick({ onKlick }) {
  useMapEvents({
    click(e) {
      onKlick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

/** Springt zum gewählten Standort (Adresssuche). */
function Folgen({ ziel, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!ziel) return;
    map.flyTo([ziel.lat, ziel.lon], zoom, { duration: 0.9 });
  }, [ziel, zoom, map]);
  return null;
}

/** Tastaturbedienung direkt auf dem Kartencontainer. */
function Tastatur({ onPunktMitte, onLetztenLoeschen }) {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    el.setAttribute("aria-label", "Orthofoto-Karte. Enter setzt einen Eckpunkt im Fadenkreuz, Rücktaste löscht den letzten Punkt, Pfeiltasten verschieben den Ausschnitt, Plus und Minus zoomen.");
    el.setAttribute("role", "application");
    const taste = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const c = map.getCenter();
        onPunktMitte({ lat: c.lat, lon: c.lng });
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        onLetztenLoeschen();
      }
    };
    el.addEventListener("keydown", taste);
    return () => el.removeEventListener("keydown", taste);
  }, [map, onPunktMitte, onLetztenLoeschen]);
  return null;
}

/** Meldet die aktuelle Kartenmitte (für den Knopf „Punkt im Fadenkreuz setzen“). */
function Mitte({ onMitte }) {
  const map = useMap();
  useMapEvents({
    moveend() {
      const c = map.getCenter();
      onMitte({ lat: c.lat, lon: c.lng });
    },
  });
  useEffect(() => {
    const c = map.getCenter();
    onMitte({ lat: c.lat, lon: c.lng });
  }, [map, onMitte]);
  return null;
}

/**
 * @param {object} p
 * @param {{lat:number, lon:number}[]} p.punkte   Eckpunkte des Dachs
 * @param {(punkte) => void} p.onPunkte          neue Punktliste
 * @param {{lat:number, lon:number}|null} p.ziel  Sprungziel (Adresssuche)
 * @param {(mitte) => void} p.onMitte            aktuelle Kartenmitte
 */
export default function DachKarte({ punkte, onPunkte, ziel, onMitte, zoomBeiZiel = 19 }) {
  const positionen = punkte.map((p) => [p.lat, p.lon]);
  const hinzufuegen = (p) => onPunkte([...punkte, p]);
  const letztenLoeschen = () => onPunkte(punkte.slice(0, -1));

  return (
    // isolate: eigener Stapelkontext, damit Leaflet-Ebenen (z-index 400–1000) nicht über Dialoge ragen;
    // Zoom-Knöpfe auf 44 px Tap-Ziel vergrößert.
    <div className="relative isolate h-full w-full [&_.leaflet-bar_a]:!h-11 [&_.leaflet-bar_a]:!w-11 [&_.leaflet-bar_a]:!text-[22px] [&_.leaflet-bar_a]:!leading-[44px]">
      <MapContainer
        center={ziel ? [ziel.lat, ziel.lon] : OESTERREICH_MITTE}
        zoom={ziel ? zoomBeiZiel : 7}
        minZoom={6}
        maxZoom={20}
        maxBounds={[
          [45.8, 8.6],
          [49.6, 18.2],
        ]}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        className="h-full w-full"
        style={{ background: "#e9ece6" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Orthofoto">
            <TileLayer url={`${BASEMAP}/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg`} attribution={ATTRIBUTION} maxZoom={20} maxNativeZoom={19} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Karte">
            <TileLayer url={`${BASEMAP}/geolandbasemap/normal/google3857/{z}/{y}/{x}.png`} attribution={ATTRIBUTION} maxZoom={20} maxNativeZoom={19} />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Klick onKlick={hinzufuegen} />
        <Folgen ziel={ziel} zoom={zoomBeiZiel} />
        <Tastatur onPunktMitte={hinzufuegen} onLetztenLoeschen={letztenLoeschen} />
        <Mitte onMitte={onMitte} />
        {positionen.length >= 3 ? <Polygon positions={positionen} pathOptions={FLAECHE} /> : positionen.length === 2 ? <Polyline positions={positionen} pathOptions={LINIE} /> : null}
        {punkte.map((p, i) => (
          <Marker
            key={`${i}-${p.lat}-${p.lon}`}
            position={[p.lat, p.lon]}
            icon={ECKE}
            draggable
            keyboard={false}
            title={`Eckpunkt ${i + 1} – ziehen zum Verschieben, Doppelklick löscht`}
            eventHandlers={{
              dragend(e) {
                const q = e.target.getLatLng();
                onPunkte(punkte.map((x, j) => (j === i ? { lat: q.lat, lon: q.lng } : x)));
              },
              dblclick() {
                onPunkte(punkte.filter((_, j) => j !== i));
              },
            }}
          />
        ))}
      </MapContainer>
      {/* Fadenkreuz für die Tastaturbedienung – rein dekorativ, Klicks gehen durch */}
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-1/2">
        <span className="block h-7 w-7 rounded-full border-2 border-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.45)]" />
        <span className="absolute left-1/2 top-1/2 h-[2px] w-10 -translate-x-1/2 -translate-y-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.35)]" />
        <span className="absolute left-1/2 top-1/2 h-10 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.35)]" />
      </span>
    </div>
  );
}
