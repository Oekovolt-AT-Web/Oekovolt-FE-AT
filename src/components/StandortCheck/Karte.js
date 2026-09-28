"use client";

import { useEffect } from "react";
import L from "leaflet";
import { LayersControl, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Grundkarte und Orthofoto von basemap.at (Verwaltungsgrundkarte Österreich),
// Lizenz CC BY 4.0 – Namensnennung „Datenquelle: basemap.at“ ist Pflicht.
const BASEMAP = "https://mapsneu.wien.gv.at/basemap";
const ATTRIBUTION = 'Datenquelle: <a href="https://www.basemap.at" target="_blank" rel="noopener noreferrer">basemap.at</a> (CC BY 4.0)';

const OESTERREICH_MITTE = [47.6, 13.35];

// Marker im Markenstil als divIcon – keine externen Bilddateien
const MARKER = L.divIcon({
  className: "",
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  html: '<span style="display:block;width:26px;height:26px;border-radius:9999px;background:#669933;border:4px solid #fff;box-shadow:0 0 0 6px rgba(102,153,51,.35),0 4px 14px rgba(0,0,0,.4)"></span>',
});

function Klick({ onWahl }) {
  useMapEvents({
    click(e) {
      onWahl({ lat: e.latlng.lat, lon: e.latlng.lng, quelle: "karte" });
    },
  });
  return null;
}

function Folgen({ punkt, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!punkt) return;
    const ziel = Math.max(map.getZoom(), zoom);
    map.flyTo([punkt.lat, punkt.lon], ziel, { duration: 0.8 });
  }, [punkt, zoom, map]);
  return null;
}

/**
 * Karte zur Standortwahl. Klick setzt den Punkt, der Marker ist verschiebbar.
 * punkt: { lat, lon } | null, onWahl({ lat, lon, quelle })
 */
export default function Karte({ punkt, onWahl, zoomBeiWahl = 17 }) {
  return (
    <MapContainer
      center={punkt ? [punkt.lat, punkt.lon] : OESTERREICH_MITTE}
      zoom={punkt ? zoomBeiWahl : 7}
      minZoom={6}
      maxZoom={19}
      maxBounds={[
        [45.8, 8.6],
        [49.6, 18.2],
      ]}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#e9ece6" }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Karte">
          <TileLayer url={`${BASEMAP}/geolandbasemap/normal/google3857/{z}/{y}/{x}.png`} attribution={ATTRIBUTION} maxZoom={19} maxNativeZoom={19} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Orthofoto (Dach finden)">
          <TileLayer url={`${BASEMAP}/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg`} attribution={ATTRIBUTION} maxZoom={19} maxNativeZoom={19} />
        </LayersControl.BaseLayer>
      </LayersControl>
      <Klick onWahl={onWahl} />
      <Folgen punkt={punkt} zoom={zoomBeiWahl} />
      {punkt && (
        <Marker
          position={[punkt.lat, punkt.lon]}
          icon={MARKER}
          draggable
          keyboard={false}
          eventHandlers={{
            dragend(e) {
              const p = e.target.getLatLng();
              onWahl({ lat: p.lat, lon: p.lng, quelle: "karte" });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
