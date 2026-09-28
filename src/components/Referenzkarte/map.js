"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import the map components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Define the points for the markers
const points = [
  { lat: 47.7811014, lng: 9.612468, label: "Ravensburg" },
  { lat: 47.7981346, lng: 13.0464806, label: "Salzburg" },
  { lat: 48.2678312, lng: 10.9868769, label: "Mering" },
  { lat: 48.0059852, lng: 10.5921263, label: "Bad Wörishofen" },
  { lat: 48.18524105, lng: 11.745541131739072, label: "Kirchheim" },
  { lat: 48.05630415, lng: 10.486669997131546, label: "Mindelheim" },
  { lat: 47.9875742, lng: 10.788535174270507, label: "Waal" },
  { lat: 48.3930137, lng: 10.856960528294799, label: "Augsburg" },
  { lat: 47.7828004, lng: 10.30596510988958, label: "Kempten" },
  { lat: 47.84388455, lng: 12.972250979244642, label: "Freilassing" },
  { lat: 47.57286685, lng: 9.686940863251925, label: "Lindau" },
  { lat: 47.927908200000005, lng: 12.898727934563036, label: "Laufen" },
  { lat: 50.18291155, lng: 9.048353069014173, label: "Langenselbold" },
  { lat: 47.54312925, lng: 11.273540406576913, label: "Wallgau" },
  { lat: 47.8979258, lng: 10.25525499438394, label: "Wolfertschwenden" },
  { lat: 48.0152801, lng: 11.083114541380102, label: "Utting" },
  { lat: 48.0301967, lng: 10.75377698202896, label: "Buchloe" },
  { lat: 48.1095402, lng: 11.093368268721145, label: "Türkenfeld" },
  { lat: 47.49489385, lng: 9.6919699, label: "Türkenfeld" },
  { lat: 47.520760499999994, lng: 9.768744127661652, label: "Lochau" },
  { lat: 47.426632749999996, lng: 9.671584195801643, label: "Lustenau" },
  { lat: 47.10218295, lng: 9.486962484194526, label: "Innsbruck" },
];

const Map = ({ data }) => {
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);

  // Load Leaflet and create icon only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      setCustomIcon(
        new L.Icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      );
    }
  }, []);

  // Function to check the cookie consent value from document cookies
  const checkCookieConsent = () => {
    const cookies = document.cookie.split("; ");
    const cookieConsentCookie = cookies.find((cookie) => cookie.startsWith("cookieConsent="));

    if (cookieConsentCookie) {
      const cookieValue = cookieConsentCookie.split("=")[1];
      const decodedValue = decodeURIComponent(cookieValue);
      const consentData = JSON.parse(decodedValue);

      return consentData.openStreetMap === true;
    }
    return false;
  };

  // Check cookie consent on component mount and set an interval to periodically check for updates
  useEffect(() => {
    const consentStatus = checkCookieConsent();
    setCookieAccepted(consentStatus); // Initialize with existing consent status

    // Set up an interval to periodically check for cookie changes (e.g., every 1 second)
    const intervalId = setInterval(() => {
      const updatedConsentStatus = checkCookieConsent();
      if (updatedConsentStatus !== cookieAccepted) {
        setCookieAccepted(updatedConsentStatus);
      }
    }, 1000); // Check every 1 second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [cookieAccepted]); // Dependency array to re-run the effect when `cookieAccepted` changes

  // Handle when the user accepts the OpenStreetMap cookie
  const handleAcceptCookie = () => {
    const cookies = document.cookie.split("; ");
    const cookieConsentCookie = cookies.find((cookie) => cookie.startsWith("cookieConsent="));

    let consentData = {};

    if (cookieConsentCookie) {
      const cookieValue = cookieConsentCookie.split("=")[1];
      const decodedValue = decodeURIComponent(cookieValue);

      consentData = JSON.parse(decodedValue);
    }

    consentData.openStreetMap = true; // Update the openStreetMap consent to true

    // Save the updated consent data back to the cookie with 1 year expiry
    document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(consentData))}; path=/; max-age=31536000`;

    // Immediately reflect the change in the state
    setCookieAccepted(true);
  };

  return (
    <section className="">
      <div className="w-[100%] mx-auto px-6 md:px-12 flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4">
          {/* <h2 className="text-[18px] font-semibold text-[#669933] uppercase tracking-wider mb-2 text-center">
            Unsere Standorte
          </h2> */}



          <h2 className="text-[#669933] uppercase text-center font-semibold tracking-wide inline-block relative text-[18px]">
            {data.maps_card_title}
            <span className="absolute mx-auto w-50 left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
            {data.maps_card_subtitle}
          </h3>
        </div>

        <div className="w-full h-[300px] md:h-[500px] z-10 ">
          {cookieAccepted ? (
            <MapContainer
              center={[47.6, 13.35]}
              zoom={7}
              style={{ height: "100%", width: "100%", zIndex: 10 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {points.map((point, idx) => (
                <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
                  <Popup>{point.label}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
              <p className="mb-4 text-gray-700 text-center">
                Um die Karte anzuzeigen, müssen Sie den OpenStreetMap Cookie akzeptieren.
              </p>
              <button
                onClick={handleAcceptCookie}
                className="px-4 py-2 bg-ov-600 text-white rounded-lg hover:bg-ov-700 transition-colors"
              >
                OpenStreetMap Cookie akzeptieren
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Map;
