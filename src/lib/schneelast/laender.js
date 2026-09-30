// src/lib/schneelast/laender.js
//
// Die neun Bundesländer für /schneelast/[bundesland] – Slug, Name und Präposition für
// Fließtexte. Reine Daten, Browser und Server. Slugs wie in src/data/bundeslaender.js,
// Reihenfolge amtlich (Burgenland … Wien).

export const LAENDER = [
  { slug: "burgenland", name: "Burgenland", imLand: "im Burgenland", hauptstadt: "Eisenstadt" },
  { slug: "kaernten", name: "Kärnten", imLand: "in Kärnten", hauptstadt: "Klagenfurt am Wörthersee" },
  { slug: "niederoesterreich", name: "Niederösterreich", imLand: "in Niederösterreich", hauptstadt: "St. Pölten" },
  { slug: "oberoesterreich", name: "Oberösterreich", imLand: "in Oberösterreich", hauptstadt: "Linz" },
  { slug: "salzburg", name: "Salzburg", imLand: "im Land Salzburg", hauptstadt: "Salzburg" },
  { slug: "steiermark", name: "Steiermark", imLand: "in der Steiermark", hauptstadt: "Graz" },
  { slug: "tirol", name: "Tirol", imLand: "in Tirol", hauptstadt: "Innsbruck" },
  { slug: "vorarlberg", name: "Vorarlberg", imLand: "in Vorarlberg", hauptstadt: "Bregenz" },
  { slug: "wien", name: "Wien", imLand: "in Wien", hauptstadt: "Wien" },
];

export const landFuerSlug = (slug) => LAENDER.find((l) => l.slug === slug) ?? null;

export const schneelastPfad = (slug) => `/schneelast/${slug}`;
