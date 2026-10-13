"use client";

// src/components/FlaechenCheck/NetzKarte.js – Karte für den Netzschritt (Welle B, Paket B06)
//
// Klick bzw. verschiebbarer Marker setzt den Punkt der Fläche; das nächste Umspannwerk (≥ 20 kV) und –
// falls weiter weg – das nächste ≥ 110 kV werden mit gestrichelter Luftlinie gezeigt.
// Grundkarte basemap.at (CC BY 4.0), Umspannwerke aus OpenStreetMap (ODbL) – beide Namensnennungen
// stehen in der Attributionszeile der Karte. Nur über next/dynamic mit ssr:false laden.

import { useEffect } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./NetzKarte.module.css";

const BASEMAP = "https://mapsneu.wien.gv.at/basemap";
const ATTRIBUTION =
  'Datenquelle: <a href="https://www.basemap.at" target="_blank" rel="noopener noreferrer">basemap.at</a> (CC BY 4.0) · Umspannwerke: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap-Mitwirkende, ODbL</a>';
const OESTERREICH_MITTE = [47.6, 13.35];

const MARKER = L.divIcon({
  className: "",
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  html: '<span style="display:block;width:26px;height:26px;border-radius:9999px;background:#669933;border:4px solid #fff;box-shadow:0 0 0 6px rgba(102,153,51,.35),0 4px 14px rgba(0,0,0,.4)"></span>',
});

function Klick({ onWahl }) {
  useMapEvents({
    click(e) {
      onWahl({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

/** Ausschnitt so wählen, dass Punkt und Stationen sichtbar sind. */
function Ausschnitt({ punkt, stationen }) {
  const map = useMap();
  useEffect(() => {
    if (!punkt) return;
    const pkte = [[punkt.lat, punkt.lon], ...stationen.map((s) => [s.lat, s.lon])];
    if (pkte.length === 1) map.flyTo(pkte[0], Math.max(map.getZoom(), 13), { duration: 0.6 });
    else map.flyToBounds(L.latLngBounds(pkte).pad(0.35), { duration: 0.6, maxZoom: 15 });
  }, [punkt, stationen, map]);
  return null;
}

const stationLabel = (s) => `${s.name || "Station ohne Namen in OSM"} · ${s.kv} kV`;

/**
 * punkt: { lat, lon } | null · stationen: [{ name, lat, lon, kv, km }] · onWahl({ lat, lon })
 */
export default function NetzKarte({ punkt, stationen = [], onWahl }) {
  return (
    <MapContainer
      center={punkt ? [punkt.lat, punkt.lon] : OESTERREICH_MITTE}
      zoom={punkt ? 13 : 7}
      minZoom={6}
      maxZoom={18}
      maxBounds={[
        [45.8, 8.6],
        [49.6, 18.2],
      ]}
      scrollWheelZoom={false}
      className={`h-full w-full ${styles.karte}`}
      style={{ background: "#e9ece6" }}
    >
      <TileLayer url={`${BASEMAP}/geolandbasemap/normal/google3857/{z}/{y}/{x}.png`} attribution={ATTRIBUTION} maxZoom={18} maxNativeZoom={19} />
      <Klick onWahl={onWahl} />
      <Ausschnitt punkt={punkt} stationen={stationen} />
      {punkt &&
        stationen.map((s) => (
          <Polyline key={`l-${s.lat}-${s.lon}`} positions={[[punkt.lat, punkt.lon], [s.lat, s.lon]]} pathOptions={{ color: "#041d42", weight: 2, dashArray: "6 6", opacity: 0.8 }} />
        ))}
      {stationen.map((s) => (
        <CircleMarker key={`s-${s.lat}-${s.lon}`} center={[s.lat, s.lon]} radius={9} pathOptions={{ color: "#fff", weight: 3, fillColor: "#041d42", fillOpacity: 1 }}>
          <Tooltip direction="top" offset={[0, -8]}>
            {stationLabel(s)}
          </Tooltip>
        </CircleMarker>
      ))}
      {punkt && (
        <Marker
          position={[punkt.lat, punkt.lon]}
          icon={MARKER}
          draggable
          keyboard={false}
          eventHandlers={{
            dragend(e) {
              const p = e.target.getLatLng();
              onWahl({ lat: p.lat, lon: p.lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
