// src/components/GewerbeUnikat/K2IsoSvg.js
//
// K2 · Dach-Labor: isometrische SVG-Halle – REINE Komponente ohne Hooks.
// Zwei Rollen: (1) SSR-Platzhalter der Insel (Startzustand, dieselbe Fläche wie die 3D-Szene, kein CLS)
// und (2) Rückfall ohne WebGL, auf schwachen Geräten oder nach einem Fehler – mit denselben Parametern
// wie die 3D-Szene (Dachart-Muster, Abzüge, Sonnenstand).
//
// Technik: Jede Dachfläche ist im Grundriss affin – sie wird als Grundriss-Zeichnung (Meter) in einer
// <g transform="matrix(…)"> gezeichnet. Die Dachart-Muster sind <pattern> in Metern (Ost-West: A-Paare
// als Chevron-Reihen, Süd: Streifen mit Lücken und Schatten, Trapez: dicht, Shed: Sägezahn).
// So bleibt das SSR-HTML klein (keine 1.500 Einzelmodule).
//
// Ausschnitt (viewBox) aus bildRahmen() – derselbe wie das Frustum der orthografischen 3D-Kamera. Platte,
// Kompassring mit Himmelsrichtungen, Halle, Lkw und Bäume liegen dadurch beim Überblenden zur 3D-Szene
// deckungsgleich; das Modell bekommt nur Licht und weiche Schatten dazu.

import { ANSICHT, HALLE, LKW, MODUL, NEIGUNG, PLATTE, baumKrone, bildRahmen, dachHoehe, iso, modulTon, plattenRadius, shedGeometrie, sonnenVektor, umgebung } from "./K2Modell.js";
import { FARBE } from "./_tokens.js";
import { hexZuRgb, mische } from "./_farbe.js";

const RAD = Math.PI / 180;
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

const MODUL_DUNKEL = hexZuRgb(FARBE.navy800);
const MODUL_HELL = hexZuRgb(FARBE.navy400);
const WAND_HELL = hexZuRgb("#fbf8f0");
const WAND_DUNKEL = hexZuRgb("#d9d2bf");
const rgbText = ([r, g, b]) => `rgb(${r},${g},${b})`;

/** Bestrahlungsanteil (0 … 1) einer Fläche mit Normale n bei Sonnenvektor s. */
function licht(n, s) {
  if (!s) return 0;
  return Math.max(0, n[0] * s[0] + n[1] * s[1] + n[2] * s[2]);
}
const modulFarbe = (f) => rgbText(mische(MODUL_DUNKEL, MODUL_HELL, modulTon(f)));
const wandFarbe = (f) => rgbText(mische(WAND_DUNKEL, WAND_HELL, Math.min(1, 0.25 + 0.75 * f)));

/** Normale einer Fläche mit Neigung t (Grad) Richtung Azimut-Achse: "o" Ost, "w" West, "s" Süd. */
function normale(richtung, t) {
  const a = t * RAD;
  if (richtung === "o") return [Math.sin(a), Math.cos(a), 0];
  if (richtung === "w") return [-Math.sin(a), Math.cos(a), 0];
  return [0, Math.cos(a), Math.sin(a)];
}

/** SVG-Matrix: Grundriss (x, z) → Bildschirm, für eine Ebene y = y0 + gx·x + gz·z. */
function ebene(y0, gx = 0, gz = 0) {
  const a = ANSICHT.azimut * RAD;
  const e = ANSICHT.hoehe * RAD;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const se = Math.sin(e);
  const ce = Math.cos(e);
  // u = −x·cos a − z·sin a ; v = (x·sin a − z·cos a)·sin e − y·cos e
  return `matrix(${[-ca, sa * se - gx * ce, -sa, -ca * se - gz * ce, 0, -y0 * ce].map((n) => Math.round(n * 1e5) / 1e5).join(" ")})`;
}

const pfad = (punkte) => `M${punkte.map(([u, v]) => `${r1(u)} ${r1(v)}`).join("L")}Z`;

/** Quader (Kuppel, Technik): Deckfläche und die zwei sichtbaren Seiten (Süd, Ost). */
function quader(x, z, w, d, yBoden, h) {
  const P = (px, py, pz) => iso(px, py, pz);
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const z0 = z - d / 2;
  const z1 = z + d / 2;
  const yo = yBoden + h;
  return {
    deck: pfad([P(x0, yo, z0), P(x1, yo, z0), P(x1, yo, z1), P(x0, yo, z1)]),
    seite: pfad([P(x0, yBoden, z1), P(x1, yBoden, z1), P(x1, yo, z1), P(x0, yo, z1)]) + pfad([P(x1, yBoden, z0), P(x1, yBoden, z1), P(x1, yo, z1), P(x1, yo, z0)]),
  };
}

/** Konvexe Hülle (monotone Kette) – für den Hallenschatten. */
function huelle(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const unten = [];
  for (const q of p) {
    while (unten.length >= 2 && kreuz(unten[unten.length - 2], unten[unten.length - 1], q) <= 0) unten.pop();
    unten.push(q);
  }
  const oben = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (oben.length >= 2 && kreuz(oben[oben.length - 2], oben[oben.length - 1], q) <= 0) oben.pop();
    oben.push(q);
  }
  return unten.slice(0, -1).concat(oben.slice(0, -1));
}

/**
 * @param {{
 *   plan: ReturnType<import("./K2Modell.js").dachPlan>,
 *   dachart: string,
 *   sonne?: { zenit:number, azimut:number, ueber:boolean } | null,
 *   qmProKwp: number,
 *   kennung?: string,
 *   className?: string,
 *   pfeil?: boolean,
 *   bogen?: { von:number, bis:number } | null,
 * }} props  pfeil: gestrichelter Lichtpfeil (nur im Rückfall ohne 3D – dort fehlen die weichen Schatten);
 *   bogen: Sonnenbogen des Tages (Azimut Auf- und Untergang) auf dem Kompassring
 */
export default function K2IsoSvg({ plan, dachart, sonne, qmProKwp, kennung = "k2iso", className, pfeil = false, bogen = null }) {
  const { L, B, H, nutz, streifen, kuppeln, technik } = plan;
  const R = plattenRadius(L, B);
  const ueber = !!sonne?.ueber;
  const s = ueber ? sonnenVektor(sonne.zenit, sonne.azimut) : null;
  const P = (x, y, z) => iso(x, y, z);
  const id = (n) => `${kennung}-${n}`;
  const e = ANSICHT.hoehe * RAD;
  const tan5 = Math.tan(NEIGUNG.trapez * RAD);
  const { n: zaehne, r: zahn, hub } = shedGeometrie(L);
  const flach = dachart === "ost-west" || dachart === "sued";
  const oben = flach ? H + HALLE.attika : dachart === "trapez" ? H + (B / 2) * tan5 : H + hub;

  // Ausschnitt: gemeinsam mit der 3D-Kamera (Platte, höchste Dachform, Lkw, Bäume, ±Drehung)
  const mitte = P(0, PLATTE, 0);
  const rahmen = bildRahmen(L, B);
  const vb = [rahmen.u0, rahmen.v0, rahmen.w, rahmen.h].map(r2).join(" ");
  const welt = umgebung(L, B);

  // Hallenschatten auf der Platte
  let schatten = null;
  if (s && s[1] > 0.02) {
    const hoehe = oben - PLATTE;
    const dx = (-s[0] / s[1]) * hoehe;
    const dz = (-s[2] / s[1]) * hoehe;
    const ecken = [
      [-B / 2, -L / 2],
      [B / 2, -L / 2],
      [B / 2, L / 2],
      [-B / 2, L / 2],
    ];
    const pts = [...ecken, ...ecken.map(([x, z]) => [x + dx, z + dz])].map(([x, z]) => P(x, PLATTE, z));
    schatten = pfad(huelle(pts));
  }

  // Wände (sichtbar: Süd und Ost), Oberkante folgt der Dachform
  const fSued = licht([0, 0, 1], s);
  const fOst = licht([1, 0, 0], s);
  const kanteSued = [];
  const kanteOst = [];
  if (dachart === "trapez") {
    kanteSued.push([-B / 2, H], [0, H + (B / 2) * tan5], [B / 2, H]);
    kanteOst.push([-L / 2, H], [L / 2, H]);
  } else if (dachart === "shed") {
    kanteSued.push([-B / 2, H], [B / 2, H]);
    for (let t = 0; t < zaehne; t++) {
      const zs = -L / 2 + t * zahn;
      kanteOst.push([zs, H + hub], [zs + zahn, H]);
    }
  } else {
    kanteSued.push([-B / 2, H + HALLE.attika], [B / 2, H + HALLE.attika]);
    kanteOst.push([-L / 2, H + HALLE.attika], [L / 2, H + HALLE.attika]);
  }
  const wandSued = pfad([
    P(-B / 2, PLATTE, L / 2),
    P(B / 2, PLATTE, L / 2),
    ...kanteSued
      .slice()
      .reverse()
      .map(([x, y]) => P(x, y, L / 2)),
  ]);
  const wandOst = pfad([P(B / 2, PLATTE, L / 2), P(B / 2, PLATTE, -L / 2), ...kanteOst.map(([z, y]) => P(B / 2, y, z))]);

  // Modulmuster je Dachart (Grundriss-Meter)
  const p = MODUL.laenge + MODUL.fuge;
  const am = qmProKwp * (MODUL.wp / 1000);
  let muster = null;
  let musterB = null; // zweite Hälfte (Trapez West)
  if (dachart === "ost-west") {
    const quer = (2 * am) / p;
    const halb = MODUL.breite * Math.cos(NEIGUNG["ost-west"] * RAD);
    const c = quer / 2;
    const fO = licht(normale("o", 15), s);
    const fW = licht(normale("w", 15), s);
    // Schatten im Gang auf der sonnenabgewandten Seite (Höhe am First ≈ 0,54 m)
    const sx = s && s[1] > 0.05 ? Math.min(quer - 2 * halb - 0.1, Math.abs((s[0] / s[1]) * 0.54)) : 0;
    const schattenX = s && s[0] > 0 ? c - halb - sx : c + halb;
    muster = (
      <pattern id={id("m")} patternUnits="userSpaceOnUse" width={r1(quer * 100) / 100} height={p} patternTransform={`translate(${r1(nutz.x0)} ${r1(nutz.z0)})`}>
        {sx > 0.05 && <rect x={schattenX} y="0" width={sx} height={p} fill={FARBE.ink900} fillOpacity="0.16" />}
        <rect x={c - halb} y="0.01" width={halb - 0.03} height={MODUL.laenge} fill={modulFarbe(fW)} />
        <rect x={c + 0.03} y="0.01" width={halb - 0.03} height={MODUL.laenge} fill={modulFarbe(fO)} />
      </pattern>
    );
  } else if (dachart === "sued") {
    const quer = am / p;
    const tief = MODUL.breite * Math.cos(NEIGUNG.sued * RAD);
    const f = licht(normale("s", NEIGUNG.sued), s);
    const sz = s && s[1] > 0.05 ? Math.min(quer - tief - 0.05, Math.max(0, (s[2] / s[1]) * 0.49)) : 0;
    muster = (
      <pattern id={id("m")} patternUnits="userSpaceOnUse" width={p} height={r1(quer * 100) / 100} patternTransform={`translate(${r1(nutz.x0)} ${r1(nutz.z0)})`}>
        {sz > 0.05 && <rect x="0" y={quer - sz} width={p} height={sz} fill={FARBE.ink900} fillOpacity="0.18" />}
        <rect x="0.01" y="0" width={MODUL.laenge} height={tief} fill={modulFarbe(f)} />
      </pattern>
    );
  } else if (dachart === "trapez") {
    const quer = am / p;
    const fO = licht(normale("o", NEIGUNG.trapez), s);
    const fW = licht(normale("w", NEIGUNG.trapez), s);
    const kachel = (n, farbe) => (
      <pattern id={id(n)} patternUnits="userSpaceOnUse" width={r1(quer * 1000) / 1000} height={p} patternTransform={`translate(${r1(nutz.x0)} ${r1(nutz.z0)})`}>
        <rect x="0.03" y="0.01" width={MODUL.breite} height={MODUL.laenge} fill={farbe} />
      </pattern>
    );
    muster = kachel("m", modulFarbe(fO));
    musterB = kachel("mw", modulFarbe(fW));
  } else {
    const f = licht(normale("s", NEIGUNG.shed), s);
    const tief = 2 * MODUL.breite * Math.cos(NEIGUNG.shed * RAD);
    muster = (
      <pattern id={id("m")} patternUnits="userSpaceOnUse" width={p} height={r1(zahn * 1000) / 1000} patternTransform={`translate(${r1(nutz.x0)} ${r1(-L / 2)})`}>
        <rect x="0.01" y="0.25" width={MODUL.laenge} height={tief / 2 - 0.01} fill={modulFarbe(f)} />
        <rect x="0.01" y={0.25 + tief / 2 + 0.01} width={MODUL.laenge} height={tief / 2 - 0.01} fill={modulFarbe(f)} />
      </pattern>
    );
  }

  const schraffur = (
    <pattern id={id("s")} patternUnits="userSpaceOnUse" width="1.3" height="1.3" patternTransform="rotate(45)">
      <rect width="1.3" height="1.3" fill="#f2eee2" />
      <line x1="0" y1="0" x2="0" y2="1.3" stroke={FARBE.ink400} strokeWidth="0.16" />
    </pattern>
  );

  // Dachflächen (Grundriss-Zeichnung je Ebene)
  const randPfad = `M${-B / 2} ${-L / 2}H${B / 2}V${L / 2}H${-B / 2}Z M${r1(nutz.x0)} ${r1(nutz.z0)}V${r1(nutz.z1)}H${r1(nutz.x1)}V${r1(nutz.z0)}Z`;
  const nutzRechteck = (x0, x1) => ({
    x: r1(Math.max(x0, nutz.x0)),
    y: r1(nutz.z0),
    width: r1(Math.max(0, Math.min(x1, nutz.x1) - Math.max(x0, nutz.x0))),
    height: r1(Math.max(0, nutz.z1 - nutz.z0)),
  });
  const streifenRects = (x0, x1) =>
    streifen.map((st, i) => (
      <rect
        key={i}
        x={r1(Math.max(x0, nutz.x0))}
        y={r1(st.z0)}
        width={r1(Math.max(0, Math.min(x1, nutz.x1) - Math.max(x0, nutz.x0)))}
        height={r1(st.z1 - st.z0)}
        fill={`url(#${id("s")})`}
      />
    ));

  let dach;
  if (dachart === "trapez") {
    dach = (
      <>
        <g transform={ebene(H + (B / 2) * tan5, -tan5, 0)} clipPath={`url(#${id("ko")})`}>
          <rect x="0" y={-L / 2} width={B / 2} height={L} fill={wandFarbe(licht(normale("o", 5), s))} />
          <path d={randPfad} fill={`url(#${id("s")})`} fillRule="evenodd" />
          <rect {...nutzRechteck(0, B / 2)} fill={`url(#${id("m")})`} />
          {streifenRects(0, B / 2)}
        </g>
        <g transform={ebene(H + (B / 2) * tan5, tan5, 0)} clipPath={`url(#${id("kw")})`}>
          <rect x={-B / 2} y={-L / 2} width={B / 2} height={L} fill={wandFarbe(licht(normale("w", 5), s))} />
          <path d={randPfad} fill={`url(#${id("s")})`} fillRule="evenodd" />
          <rect {...nutzRechteck(-B / 2, 0)} fill={`url(#${id("mw")})`} />
          {streifenRects(-B / 2, 0)}
        </g>
      </>
    );
  } else if (dachart === "shed") {
    const zuege = [];
    const gz = -hub / zahn;
    for (let t = 0; t < zaehne; t++) {
      const zs = -L / 2 + t * zahn;
      // Ebene des Zahns: y = H + hub − (z − zs)·hub/r
      zuege.push(
        <g key={t} transform={ebene(H + hub + (zs * hub) / zahn, 0, gz)}>
          <rect x={-B / 2} y={r1(zs)} width={B} height={r1(zahn)} fill={wandFarbe(licht(normale("s", NEIGUNG.shed), s))} />
          <rect x={-B / 2} y={r1(zs)} width={B} height={r1(zahn)} clipPath={`url(#${id("kr")})`} fill={`url(#${id("s")})`} />
          {zs + 0.25 >= nutz.z0 && zs + 0.25 + 1.86 <= nutz.z1 && !streifen.some((st) => zs + 2.1 > st.z0 && zs + 0.25 < st.z1) && (
            <rect x={r1(nutz.x0)} y={r1(zs)} width={r1(nutz.x1 - nutz.x0)} height={r1(zahn)} fill={`url(#${id("m")})`} />
          )}
        </g>,
      );
    }
    dach = <>{zuege}</>;
  } else {
    const a = HALLE.attikaDicke;
    const yA = H + HALLE.attika;
    dach = (
      <>
        <g transform={ebene(H)}>
          <rect x={-B / 2} y={-L / 2} width={B} height={L} fill="#f7f4ea" />
          <path d={randPfad} fill={`url(#${id("s")})`} fillRule="evenodd" />
          <rect {...nutzRechteck(-B / 2, B / 2)} fill={`url(#${id("m")})`} />
          {streifenRects(-B / 2, B / 2)}
        </g>
        {/* Attika: Innenseiten Nord und West (sichtbar), dann die Krone */}
        <path
          d={pfad([P(-B / 2 + a, H, -L / 2 + a), P(B / 2 - a, H, -L / 2 + a), P(B / 2 - a, yA, -L / 2 + a), P(-B / 2 + a, yA, -L / 2 + a)])}
          fill={wandFarbe(licht([0, 0, 1], s))}
        />
        <path
          d={pfad([P(-B / 2 + a, H, -L / 2 + a), P(-B / 2 + a, H, L / 2 - a), P(-B / 2 + a, yA, L / 2 - a), P(-B / 2 + a, yA, -L / 2 + a)])}
          fill={wandFarbe(licht([1, 0, 0], s))}
        />
        <g transform={ebene(yA)}>
          <path
            d={`M${-B / 2} ${-L / 2}H${B / 2}V${L / 2}H${-B / 2}Z M${-B / 2 + a} ${-L / 2 + a}V${L / 2 - a}H${B / 2 - a}V${-L / 2 + a}Z`}
            fill="#fdfbf5"
            fillRule="evenodd"
          />
        </g>
      </>
    );
  }

  // Lichtkuppeln und Technik (Quader auf der Dachfläche)
  const hoeheAuf = (x, z) => (dachart === "trapez" ? dachHoehe("trapez", x, z, L, B) : H);
  const kQ = kuppeln.map((k) => quader(k.x, k.z, k.w, k.d, hoeheAuf(k.x, k.z), 0.55));
  const tQ = technik.map((t) => quader(t.x, t.z, t.w, t.d, hoeheAuf(t.x, t.z), 2.1));

  // Kompassring wie in der 3D-Szene: Teilung 15°, Nordpfeil, Himmelsrichtungen auf der Platte
  const ring = 0.9;
  const [cu, cv] = mitte;
  const pp = (x, z) => P(x * R, PLATTE, z * R);
  const ticksFein = [];
  const ticksGrob = [];
  for (let g = 0; g < 360; g += 15) {
    const lang = g % 90 === 0 ? 0.05 : g % 45 === 0 ? 0.032 : 0.016;
    const a = g * RAD;
    const [u0, v0] = pp(Math.sin(a) * (ring - lang / 2), -Math.cos(a) * (ring - lang / 2));
    const [u1, v1] = pp(Math.sin(a) * (ring + lang / 2), -Math.cos(a) * (ring + lang / 2));
    (g % 45 === 0 ? ticksGrob : ticksFein).push(`M${r1(u0)} ${r1(v0)}L${r1(u1)} ${r1(v1)}`);
  }
  const nordPfeil = pfad([pp(0, -0.985), pp(-0.03, -0.9), pp(0, -0.925), pp(0.03, -0.9)]);
  const schrift = { fontFamily: "var(--font-display), system-ui, sans-serif" };
  const richtungen = [
    { t: "N", x: 0, z: -0.82, g: 0.1, f: FARBE.ink700 },
    { t: "O", x: 0.82, z: 0, g: 0.064, f: FARBE.ink400 },
    { t: "S", x: 0, z: 0.82, g: 0.064, f: FARBE.ink400 },
    { t: "W", x: -0.82, z: 0, g: 0.064, f: FARBE.ink400 },
  ];

  // Sonnenbogen des Tages auf dem Ring (wie in 3D)
  let bogenPfad = null;
  if (bogen && bogen.bis > bogen.von) {
    const pkte = [];
    for (let g = bogen.von; g < bogen.bis; g += 2) pkte.push(pp(Math.sin(g * RAD) * ring, -Math.cos(g * RAD) * ring));
    pkte.push(pp(Math.sin(bogen.bis * RAD) * ring, -Math.cos(bogen.bis * RAD) * ring));
    bogenPfad = `M${pkte.map(([u, v]) => `${r1(u)} ${r1(v)}`).join("L")}`;
  }

  // Sonnenmarke auf dem Ring (flache Scheibe wie in 3D), im Rückfall mit Lichtpfeil
  let sonnenMarke = null;
  if (ueber) {
    const az = sonne.azimut * RAD;
    const [su, sv] = pp(Math.sin(az) * ring, -Math.cos(az) * ring);
    const gr = Math.max(1.6, R * 0.03);
    let lichtPfeil = null;
    if (pfeil) {
      const [zu, zv] = pp(Math.sin(az) * 0.6, -Math.cos(az) * 0.6);
      const lw = Math.atan2(zv - sv, zu - su);
      const fl = R * 0.035;
      const spitze = pfad([
        [zu, zv],
        [zu - fl * Math.cos(lw - 0.45), zv - fl * Math.sin(lw - 0.45)],
        [zu - fl * Math.cos(lw + 0.45), zv - fl * Math.sin(lw + 0.45)],
      ]);
      lichtPfeil = (
        <>
          <line x1={r1(su)} y1={r1(sv)} x2={r1(zu)} y2={r1(zv)} stroke={FARBE.ink600} strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          <path d={spitze} fill={FARBE.ink600} />
        </>
      );
    }
    sonnenMarke = (
      <g>
        {lichtPfeil}
        <ellipse cx={r1(su)} cy={r1(sv)} rx={r1(gr * 1.35)} ry={r1(gr * 1.35 * Math.sin(e))} fill="#ffffff" />
        <ellipse cx={r1(su)} cy={r1(sv)} rx={r1(gr)} ry={r1(gr * Math.sin(e))} fill={FARBE.sun400} />
      </g>
    );
  }

  // Maßstab: Lkw an der Ostrampe und Modellbäume (Positionen wie in 3D). Bäume hinter der Hallenmitte
  // vor der Halle zeichnen, die übrigen danach (Maler-Reihenfolge der Parallelprojektion).
  const sa = Math.sin(ANSICHT.azimut * RAD);
  const ca = Math.cos(ANSICHT.azimut * RAD);
  const tiefe = (x, z) => x * sa - z * ca;
  // Lichtseite der Kronen: Sonnenrichtung in Bildkoordinaten
  let glanz = { cx: "38%", cy: "30%" };
  if (s) {
    const su = -s[0] * ca - s[2] * sa;
    const sv = (s[0] * sa - s[2] * ca) * Math.sin(e) - s[1] * Math.cos(e);
    const n = Math.hypot(su, sv) || 1;
    glanz = { cx: `${Math.round(50 + (28 * su) / n)}%`, cy: `${Math.round(50 + (28 * sv) / n)}%` };
  }
  const baum = (b) => {
    const k = baumKrone(b.s);
    const [fu, fv] = P(b.x, PLATTE, b.z);
    const [ku, kv] = P(b.x, k.y, b.z);
    return (
      <g key={`${r1(b.x)}-${r1(b.z)}`}>
        <line x1={r1(fu)} y1={r1(fv)} x2={r1(ku)} y2={r1(kv)} stroke="#c9cdd5" strokeWidth="0.6" />
        <circle cx={r1(ku)} cy={r1(kv)} r={r1(k.r)} fill={`url(#${id("baum")})`} />
      </g>
    );
  };
  const baeumeHinten = welt.baeume.filter((b) => tiefe(b.x, b.z) < 0).map(baum);
  const baeumeVorn = welt.baeume.filter((b) => tiefe(b.x, b.z) >= 0).map(baum);
  const { auflieger: al, kabine: kb } = LKW;
  const lkw = welt.lkw.map((k, i) => {
    const a1 = quader(k.x + al.l / 2, k.z, al.l, al.b, PLATTE + al.boden, al.h);
    const a2 = quader(k.x + al.l + kb.abstand + kb.l / 2, k.z, kb.l, kb.b, PLATTE, kb.h);
    return (
      <g key={i}>
        <path d={a1.seite} fill="#e2ddcd" />
        <path d={a1.deck} fill="#fbfaf6" />
        <path d={a2.seite} fill="#b9bec8" />
        <path d={a2.deck} fill="#d5d9e0" />
      </g>
    );
  });

  const tag = !ueber && sonne ? { opacity: 0.62 } : undefined;

  return (
    <svg viewBox={vb} preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true" focusable="false" data-dachart={dachart}>
      <defs>
        {schraffur}
        {muster}
        {musterB}
        <radialGradient id={id("baum")} cx={glanz.cx} cy={glanz.cy} r="78%">
          <stop offset="0" stopColor="#fdfcf8" />
          <stop offset="1" stopColor="#ddd6c3" />
        </radialGradient>
        <clipPath id={id("ko")}>
          <rect x="0" y={-L / 2} width={B / 2} height={L} />
        </clipPath>
        <clipPath id={id("kw")}>
          <rect x={-B / 2} y={-L / 2} width={B / 2} height={L} />
        </clipPath>
        <clipPath id={id("kp")}>
          <ellipse cx={r1(cu)} cy={r1(cv)} rx={r1(R)} ry={r1(R * Math.sin(e))} />
        </clipPath>
        <clipPath id={id("kr")}>
          <path d={`M${-B / 2} ${-L / 2}H${B / 2}V${L / 2}H${-B / 2}Z M${r1(nutz.x0)} ${r1(nutz.z0)}V${r1(nutz.z1)}H${r1(nutz.x1)}V${r1(nutz.z0)}Z`} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g style={tag}>
        {/* Modellplatte */}
        <ellipse cx={r1(P(0, 0, 0)[0])} cy={r1(P(0, 0, 0)[1])} rx={r1(R)} ry={r1(R * Math.sin(e))} fill="#e7e1d1" />
        <ellipse cx={r1(cu)} cy={r1(cv)} rx={r1(R)} ry={r1(R * Math.sin(e))} fill="#f3efe3" />
        <ellipse
          cx={r1(cu)}
          cy={r1(cv)}
          rx={r1(R * ring)}
          ry={r1(R * ring * Math.sin(e))}
          fill="none"
          stroke={FARBE.ink300}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path d={ticksFein.join("")} stroke={FARBE.ink300} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d={ticksGrob.join("")} stroke={FARBE.ink400} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <path d={nordPfeil} fill={FARBE.ink700} />
        {bogenPfad && (
          <path d={bogenPfad} fill="none" stroke={FARBE.sun400} strokeOpacity={ueber ? 0.85 : 0.5} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        )}
        <g transform={ebene(PLATTE)}>
          {richtungen.map((r) => (
            <text
              key={r.t}
              x={r1(r.x * R)}
              y={r1(r.z * R)}
              fontSize={r1(r.g * R)}
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
              fill={r.f}
              style={schrift}
            >
              {r.t}
            </text>
          ))}
        </g>
        {schatten && <path d={schatten} fill={FARBE.ink900} fillOpacity="0.13" clipPath={`url(#${id("kp")})`} />}
        {sonnenMarke}
        {baeumeHinten}
        {/* Halle */}
        <path d={wandSued} fill={wandFarbe(fSued)} />
        <path d={wandOst} fill={wandFarbe(fOst)} />
        {dach}
        {kQ.length > 0 && (
          <>
            <path d={kQ.map((q) => q.seite).join("")} fill={FARBE.navy200} />
            <path d={kQ.map((q) => q.deck).join("")} fill={FARBE.navy50} />
          </>
        )}
        {tQ.length > 0 && (
          <>
            <path d={tQ.map((q) => q.seite).join("")} fill={FARBE.ink300} />
            <path d={tQ.map((q) => q.deck).join("")} fill={FARBE.ink100} />
          </>
        )}
        {lkw}
        {baeumeVorn}
      </g>
    </svg>
  );
}
