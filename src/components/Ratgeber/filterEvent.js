// Gemeinsamer Ereignisname: Hero-Suche und Themenkarten setzen damit den
// Filter des Artikel-Katalogs (RatgeberListe) auf der Ratgeber-Übersicht.
export const FILTER_EVENT = "ov-ratgeber-filter";

/** Filter setzen und zum Katalog scrollen. detail: { thema?, q? } */
export function filterSetzen(detail) {
  window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail }));
  const ziel = document.getElementById("alle-artikel");
  if (ziel) {
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ziel.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
  }
}
