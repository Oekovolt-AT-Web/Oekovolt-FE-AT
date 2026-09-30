// src/lib/konfetti.js
//
// Konfettiregen nach einer erfolgreich abgeschickten Anfrage – ohne externe Bibliothek.
// Zeichnet ~160 Teilchen in den Markenfarben auf ein Canvas über der Seite und räumt es
// nach dem Fall wieder ab. Klicks gehen durch (pointer-events: none), für Screenreader
// unsichtbar. Bei „Bewegung reduzieren“ im Betriebssystem passiert nichts.
// Bewusst NICHT im Hinweisgebersystem verwenden (eine Meldung ist kein Anlass zum Feiern).

// Design-Tokens aus globals.css: ov-500, ov-400, ov-200, navy-700, sun-400, weiß
const FARBEN = ["#669933", "#8cba58", "#cde3b1", "#003473", "#ffc53d", "#ffffff"];
const DAUER_MS = 3200;

export function konfetti() {
  if (typeof window === "undefined") return;
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  } catch {
    /* ältere Browser: normal weiter */
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "2147483000" });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const groesse = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  groesse();
  window.addEventListener("resize", groesse);

  const b = window.innerWidth;
  const h = window.innerHeight;
  const anzahl = b < 640 ? 110 : 170;
  // Zwei Salven von links und rechts unten, dazu ein Schauer von oben
  const teile = Array.from({ length: anzahl }, (_, i) => {
    const salve = i % 3;
    const vonLinks = salve === 0;
    const vonOben = salve === 2;
    const winkel = vonOben ? Math.PI / 2 + (Math.random() - 0.5) * 0.9 : vonLinks ? -Math.PI / 3 - Math.random() * 0.5 : (-2 * Math.PI) / 3 + Math.random() * 0.5;
    const tempo = vonOben ? 2 + Math.random() * 3 : 11 + Math.random() * 9;
    return {
      x: vonOben ? Math.random() * b : vonLinks ? -10 : b + 10,
      y: vonOben ? -20 - Math.random() * h * 0.3 : h * 0.75,
      vx: Math.cos(winkel) * tempo,
      vy: Math.sin(winkel) * tempo,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.35,
      kipp: Math.random() * Math.PI,
      farbe: FARBEN[i % FARBEN.length],
      rund: Math.random() < 0.25,
    };
  });

  const start = performance.now();
  let letzte = start;
  const bild = (jetzt) => {
    const dt = Math.min((jetzt - letzte) / 16.7, 3);
    letzte = jetzt;
    const alter = jetzt - start;
    ctx.clearRect(0, 0, b, h);
    ctx.globalAlpha = alter > DAUER_MS - 700 ? Math.max(0, (DAUER_MS - alter) / 700) : 1;
    for (const t of teile) {
      t.vy += 0.28 * dt; // Schwerkraft
      t.vx *= 0.985 ** dt; // Luftwiderstand
      t.vy *= 0.985 ** dt;
      t.x += (t.vx + Math.sin(t.kipp) * 0.6) * dt;
      t.y += t.vy * dt;
      t.rot += t.vrot * dt;
      t.kipp += 0.08 * dt;
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rot);
      ctx.scale(1, Math.cos(t.kipp)); // flatternder Streifen
      ctx.fillStyle = t.farbe;
      if (t.farbe === "#ffffff") {
        ctx.strokeStyle = "rgba(0,52,115,.25)";
        ctx.lineWidth = 0.5;
      }
      if (t.rund) {
        ctx.beginPath();
        ctx.arc(0, 0, t.h, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-t.w / 2, -t.h / 2, t.w, t.h);
        if (t.farbe === "#ffffff") ctx.strokeRect(-t.w / 2, -t.h / 2, t.w, t.h);
      }
      ctx.restore();
    }
    if (alter < DAUER_MS) requestAnimationFrame(bild);
    else {
      window.removeEventListener("resize", groesse);
      canvas.remove();
    }
  };
  requestAnimationFrame(bild);
}
