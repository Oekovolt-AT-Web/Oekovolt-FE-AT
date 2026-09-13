import { ratgeberEintraege } from "./ratgeberEintraege";
import { veroeffentlichungen } from "./veroeffentlichungen";

/** Beiträge je Fediverse-Konto (neueste zuerst). */
export async function eintraegeFuer(name, { limit = 20, revalidate = 300 } = {}) {
  if (name === "ratgeber") return ratgeberEintraege(limit);
  if (name === "oekovolt") return veroeffentlichungen({ kanal: "fediverse", limit, revalidate });
  return [];
}
