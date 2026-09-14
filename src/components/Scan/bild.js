// Bildverarbeitung im Browser: verkleinern, als JPEG neu kodieren.
// Nebeneffekt (gewollt): EXIF-Daten wie GPS-Position werden dabei entfernt.

export async function bildVorbereiten(datei, { maxKante = 2200, qualitaet = 0.86 } = {}) {
  if (!datei.type.startsWith("image/")) return { blob: datei, vorschau: null };
  try {
    const bitmap = await createImageBitmap(datei, { imageOrientation: "from-image" });
    const faktor = Math.min(1, maxKante / Math.max(bitmap.width, bitmap.height));
    const b = Math.round(bitmap.width * faktor);
    const h = Math.round(bitmap.height * faktor);
    const canvas = document.createElement("canvas");
    canvas.width = b;
    canvas.height = h;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, b, h);
    bitmap.close?.();
    const blob = await new Promise((ok) => canvas.toBlob(ok, "image/jpeg", qualitaet));
    if (!blob) throw new Error("toBlob");
    return { blob, vorschau: URL.createObjectURL(blob), canvas };
  } catch {
    // z. B. HEIC in Browsern ohne Decoder: Original hochladen (Server akzeptiert HEIC)
    return { blob: datei, vorschau: null };
  }
}

/** Upload mit Fortschritt (fetch kennt keinen Upload-Fortschritt). */
export function hochladen(url, formData, beiFortschritt) {
  return new Promise((ok, fehler) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => e.lengthComputable && beiFortschritt?.(e.loaded / e.total);
    xhr.onload = () => {
      let json = {};
      try {
        json = JSON.parse(xhr.responseText || "{}");
      } catch {
        /* leer */
      }
      xhr.status >= 200 && xhr.status < 300 ? ok(json) : fehler(Object.assign(new Error(json.fehler || "upload"), { status: xhr.status }));
    };
    xhr.onerror = () => fehler(new Error("netz"));
    xhr.send(formData);
  });
}

/**
 * Zählerstand per OCR direkt auf dem Gerät (Tesseract.js, Dateien vom eigenen Server).
 * Liefert den plausibelsten Zahlenwert (4–8 Vorkommastellen) oder null.
 */
export async function zaehlerstandErkennen(canvas) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    workerPath: "/tesseract/worker.min.js",
    corePath: "/tesseract/core",
    langPath: "/tesseract/lang",
    gzip: true,
    logger: () => {},
  });
  try {
    await worker.setParameters({ tessedit_char_whitelist: "0123456789.,kKwWhH ", preserve_interword_spaces: "1" });
    // Zähler-Displays sitzen meist mittig: zusätzlich einen zentralen Ausschnitt prüfen
    const ausschnitt = document.createElement("canvas");
    const w = canvas.width;
    const h = canvas.height;
    ausschnitt.width = Math.round(w * 0.8);
    ausschnitt.height = Math.round(h * 0.5);
    const ctx = ausschnitt.getContext("2d");
    ctx.filter = "grayscale(1) contrast(1.6)";
    ctx.drawImage(canvas, w * 0.1, h * 0.25, w * 0.8, h * 0.5, 0, 0, ausschnitt.width, ausschnitt.height);

    const texte = [];
    for (const quelle of [ausschnitt, canvas]) {
      const { data } = await worker.recognize(quelle);
      texte.push(data.text || "");
    }
    const kandidaten = texte
      .join(" ")
      .replace(/\s(?=\d{3}\b)/g, "")
      .match(/\d{4,8}(?:[.,]\d{1,2})?/g);
    if (!kandidaten?.length) return null;
    // Längste Ziffernfolge bevorzugen (Zählernummern haben oft Buchstaben, Datumsangaben Punkte)
    kandidaten.sort((a, b) => b.replace(/\D/g, "").length - a.replace(/\D/g, "").length);
    return kandidaten[0].replace(",", ".");
  } finally {
    await worker.terminate();
  }
}
