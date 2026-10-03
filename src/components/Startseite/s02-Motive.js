// src/components/Startseite/s02-Motive.js
//
// Gezeichnete Linien-Motive je Zielgruppe für das Lösungs-Bento (S03Loesungen).
// Raster 32 × 32, Strich 1.6, runde Enden. Jede Linie hat pathLength = 1, damit sie sich beim
// Aufdecken der Karte per stroke-dashoffset zeichnen kann (Klasse s02b-strich, siehe Bento-Stil).
// Reine Server-Komponente, dekorativ (aria-hidden).

const P = ({ d, ...rest }) => <path d={d} pathLength="1" className="s02b-strich" {...rest} />;

const MOTIVE = {
  gewerbe: (
    <>
      <P d="M2.5 28.5h27" />
      <P d="M4 28.5V15.5l6.5-4.2v4.2l6.5-4.2v4.2l6.5-4.2v17.2" />
      <P d="M23.5 11.3V4h3.5v24.5" />
      <P d="M5.6 13.6l4.1-2.7M12.1 13.6l4.1-2.7M18.6 13.6l4.1-2.7" />
      <P d="M8.5 28.5v-5h4v5M16 21.5h4" />
    </>
  ),
  freiflaeche: (
    <>
      <circle cx="9" cy="8" r="3.2" pathLength="1" className="s02b-strich" />
      <P d="M9 1.8v1.2M2.8 8H4M14 8h1.2M4.6 3.6l.9.9M12.5 3.6l-.9.9" />
      <P d="M3.5 25.5l5-7h14l-5 7Z" />
      <P d="M6 22h14M13 18.5l-5 7" />
      <P d="M7.5 25.5v3.5M16 25.5v3.5" />
      <P d="M21 17l3.4-4.7H30" />
      <P d="M2 29h28" />
    </>
  ),
  agri: (
    <>
      <P d="M4 9.5l3.2-4.5h20.8l-3.2 4.5Z" />
      <P d="M15.6 5l-3.2 4.5" />
      <P d="M7.5 9.5V29M24.5 9.5V29" />
      <P d="M16 29v-8.5" />
      <P d="M16 24.5c-3.2 0-4.8-2-4.8-4.8 2.8 0 4.8 1.6 4.8 4.8Z" />
      <P d="M16 22c0-3 2-4.6 4.8-4.6 0 2.7-1.7 4.6-4.8 4.6Z" />
      <P d="M2.5 29h27" />
    </>
  ),
  landwirtschaft: (
    <>
      <P d="M4.5 29V15.5L16 6.5l11.5 9V29" />
      <P d="M2.5 17L16 6.5 29.5 17" />
      <P d="M17.8 8.3l7.2 5.5-1.6 2.1-7.2-5.5Z" />
      <P d="M11.5 29v-8.5h9V29M11.5 20.5l9 8.5M20.5 20.5l-9 8.5" />
      <P d="M1.5 29h29" />
    </>
  ),
  hotel: (
    <>
      <P d="M2 22.5l5.5-7.5 3 3.8" />
      <P d="M21.5 18l3.5-5 5.5 8" />
      <P d="M10 29V13.5h12V29" />
      <P d="M9 13.5l1.6-3.5h10.8l1.6 3.5" />
      <P d="M13 17.5h2M17 17.5h2M13 21.5h2M17 21.5h2" />
      <P d="M14.5 29v-3.5h3V29" />
      <P d="M1.5 29h29" />
    </>
  ),
  gemeinde: (
    <>
      <P d="M3.5 12.5L16 5l12.5 7.5Z" />
      <P d="M5 15.5h22" />
      <P d="M8 15.5v9.5M13 15.5v9.5M19 15.5v9.5M24 15.5v9.5" />
      <P d="M5 25h22M3.5 28.5h25" />
      <P d="M16 5V1.8l3 .9-3 .9" />
    </>
  ),
  chalet: (
    <>
      <P d="M1.5 21l7-10.5 3.6 5" />
      <P d="M19 13.5l3-4 8.5 12" />
      <P d="M7.5 29v-8.5L16 13l8.5 7.5V29" />
      <P d="M5 22.5L16 12.5l11 10" />
      <P d="M13.8 29v-5h4.4v5M14.6 19.5h2.8" />
      <P d="M26 2.5v6M23.4 4l5.2 3M23.4 7l5.2-3" />
      <P d="M1 29h30" />
    </>
  ),
};

export default function Motiv({ name, className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {MOTIVE[name]}
    </svg>
  );
}
