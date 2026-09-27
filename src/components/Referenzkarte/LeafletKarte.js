"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Marker im Markenstil als divIcon – keine externen Bilddateien
function icon(aktiv, sitz) {
  const groesse = sitz ? 22 : aktiv ? 20 : 14;
  const farbe = sitz ? "#003473" : "#669933";
  return L.divIcon({
    className: "",
    iconSize: [groesse, groesse],
    iconAnchor: [groesse / 2, groesse / 2],
    popupAnchor: [0, -groesse / 2],
    html: `<span style="display:block;width:${groesse}px;height:${groesse}px;border-radius:9999px;background:${farbe};border:3px solid #fff;box-shadow:0 0 0 ${aktiv ? 6 : 0}px rgba(102,153,51,.35),0 4px 12px rgba(0,0,0,.35);transition:box-shadow .3s"></span>`,
  });
}

function Steuerung({ auswahl, standorte, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (!auswahl) return;
    const s = standorte.find((x) => x.id === auswahl);
    if (!s) return;
    map.flyTo([s.lat, s.lng], Math.max(map.getZoom(), 10), { duration: 0.8 });
    const t = setTimeout(() => markerRefs.current[s.id]?.openPopup(), 850);
    return () => clearTimeout(t);
  }, [auswahl, standorte, map, markerRefs]);
  return null;
}

export default function LeafletKarte({ standorte, auswahl, onWahl, projekteJeOrt = {} }) {
  const markerRefs = useRef({});
  const grenzen = useMemo(() => L.latLngBounds(standorte.filter((s) => s.lat < 49).map((s) => [s.lat, s.lng])).pad(0.08), [standorte]);

  return (
    <MapContainer bounds={grenzen} scrollWheelZoom={false} className="h-full w-full" style={{ background: "#0b1b33" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Steuerung auswahl={auswahl} standorte={standorte} markerRefs={markerRefs} />
      {standorte.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={icon(auswahl === s.id, s.sitz)}
          zIndexOffset={s.sitz ? 1000 : auswahl === s.id ? 500 : 0}
          ref={(r) => (markerRefs.current[s.id] = r)}
          eventHandlers={{ click: () => onWahl(s.id) }}
        >
          <Popup>
            <strong>{s.sitz ? "Ökovolt – Firmensitz Türkheim" : s.label}</strong>
            <br />
            {s.sitz ? "Planung, Montage & Service" : `${s.land} · ${s.km} km von Türkheim`}
            {s.projekte?.length > 0 ? (
              <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                {s.projekte.map((p) => (
                  <li key={p.slug} style={{ margin: "4px 0" }}>
                    <a href={`/referenzen/projekte/${encodeURIComponent(p.slug)}`}>
                      {p.titel}
                      {p.leistung ? ` · ${p.leistung}` : ""} →
                    </a>
                  </li>
                ))}
              </ul>
            ) : projekteJeOrt[s.label] ? (
              <>
                <br />
                <a href={`/referenzen/projekte?ort=${encodeURIComponent(s.label)}`}>
                  {projekteJeOrt[s.label]} {projekteJeOrt[s.label] === 1 ? "Projekt" : "Projekte"} ansehen →
                </a>
              </>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
