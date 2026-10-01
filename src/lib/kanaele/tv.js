import QRCode from "qrcode";
import { SCHAURAUM_FOLIEN } from "@/data/tvSchauraum";
import { BASE_URL } from "@/lib/site";
import { veroeffentlichungen } from "./veroeffentlichungen";

const qrSvg = (ziel) => QRCode.toString(ziel, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#03122b", light: "#ffffff" } });

/**
 * Feste Werbefolien für den Schauraum (src/data/tvSchauraum.js) mit QR-Code.
 * Der QR-Link trägt UTM-Parameter, damit Anfragen aus dem Schauraum in der Herkunftsstatistik erscheinen;
 * angezeigt wird die kurze Adresse ohne Parameter.
 */
export async function tvSchauraumFolien() {
  return Promise.all(
    SCHAURAUM_FOLIEN.map(async (f) => {
      if (!f.qr) return f;
      const url = `${BASE_URL}${f.qr}`;
      const ziel = `${url}?utm_source=schauraum&utm_medium=tv-qr&utm_campaign=${f.id}`;
      return { ...f, url, qrSvg: await qrSvg(ziel) };
    })
  );
}

/**
 * Einträge für Info-Bildschirme (SCADA, Empfang, Kunden-TV):
 * nur Kanal „tv“, noch gültig, passender Standort, nach Priorität und Datum.
 */
export async function tvEintraege({ standort = "", limit = 20 } = {}) {
  const jetzt = Date.now();
  const liste = await veroeffentlichungen({ kanal: "tv", limit: 60, revalidate: 60 });
  const passend = liste
    .filter((e) => !e.tv.bis || new Date(e.tv.bis).getTime() >= jetzt)
    .filter((e) => !e.tv.standorte.length || (standort && e.tv.standorte.some((s) => s.toLowerCase() === standort.toLowerCase())))
    .sort((a, b) => b.tv.prioritaet - a.tv.prioritaet || new Date(b.datum) - new Date(a.datum))
    .slice(0, limit);

  return Promise.all(
    passend.map(async (e) => {
      const ziel = e.tv.qrLink || e.url;
      const qr = await qrSvg(ziel);
      return {
        id: e.slug,
        titel: e.titel,
        teaser: e.teaser,
        kategorie: e.kategorie,
        datum: e.datum,
        bild: e.bildAbsolut,
        bildPfad: e.bild,
        bildAlt: e.bildAlt,
        dauer: Math.min(120, Math.max(6, e.tv.dauer)),
        hervorhebung: e.tv.hervorhebung,
        url: ziel,
        qrSvg: qr,
      };
    })
  );
}
