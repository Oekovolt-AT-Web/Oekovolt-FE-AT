// src/lib/api/forderungen/landesforderungen_api.js
//
// Landesförderungen Österreich. Die Daten liegen statisch im Code – deshalb
// kein HTTP-Umweg über die eigene API-Route, sondern direkter Import.

import { alleBundeslaender, STAND } from "@/data/bundeslaender";

export async function getLandesforderungen() {
  return {
    stand: STAND,
    laender: alleBundeslaender().map((l) => ({ key: l.key, name: l.name, slug: l.slug, kurz: l.kurz, foerderart: l.foerderart })),
  };
}
