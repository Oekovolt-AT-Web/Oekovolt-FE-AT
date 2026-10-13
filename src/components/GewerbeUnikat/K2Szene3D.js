"use client";

// src/components/GewerbeUnikat/K2Szene3D.js
//
// K2 · Dach-Labor: 3D-Architekturmodell (Modellbau-Karton) mit echtem Sonnenstand.
// three.js wird AUSSCHLIESSLICH hier per `await import("three")` geladen – diese Datei hängt an
// next/dynamic (ssr: false) und wird von K2DachLabor nur bei WebGL, auf nicht schwachen Geräten und in
// Bildschirmnähe eingebunden. Kein react-three-fiber, kein Dauer-RAF: gerendert wird nur bei Änderung,
// während der 400-ms-Übergänge und beim Ziehen. Beim Unmount wird alles entsorgt (dispose).
//
// Szene: runde Modellplatte mit Kompassring und Nordpfeil, Halle (Höhenfeld-Dach, das zwischen Flachdach
// mit Attika, Satteldach 5° und Shed überblendet), Module als InstancedMesh (≤ 2.400), Lichtkuppeln und
// Technik als InstancedMesh, zwei Sattelzüge an der Ostrampe und Modellbäume als Maßstab.
// Licht: HemisphereLight + ein DirectionalLight (Sonne) mit Shadow-Map 1024 (mobil 512).
//
// Kamera: ORTHOGRAFISCH in der Ansicht von K2IsoSvg (ANSICHT) mit demselben Ausschnitt (bildRahmen) –
// der SSR-Platzhalter und das 3D-Modell liegen beim Überblenden deckungsgleich übereinander; das Modell
// „bekommt Licht“, statt zu springen. Der Schattenfänger reicht nur knapp über die Platte und blendet
// radial aus (keine Schatten „im Himmel“ bei tiefer Sonne).

import { useEffect, useRef, useState } from "react";
import { ANSICHT, LKW, PLATTE, baumKrone, bildRahmen, dachHoehe, dachRaster, modulTon, sonnenVektor, umgebung } from "./K2Modell";
import { BEWEGUNG, FARBE } from "./_tokens";

const RAD = Math.PI / 180;
/** Schattenfänger (Tisch) als Vielfaches des Plattenradius; ab dem Plattenrand blendet er radial aus. */
const FAENGER = 1.12;
const MAX_MODULE = 2400;
const MAX_KUPPELN = 1600;
const MAX_TECHNIK = 8;

// cubic-bezier(0.16, 1, 0.3, 1) – dieselbe Kurve wie BEWEGUNG.ease.aus
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (t) => ((ax * t + bx) * t + cx) * t;
  const y = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 6; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (x(t) - p) / d;
    }
    return y(Math.min(1, Math.max(0, t)));
  };
}
const EASE = bezier(...BEWEGUNG.ease.aus);
const lerp = (a, b, t) => a + (b - a) * t;
const klemme = (v, a, b) => Math.min(b, Math.max(a, v));

/** Schriftfamilie der Seite (next/font) für Canvas-Texturen. */
function displaySchrift() {
  try {
    const f = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
    return f || "system-ui, sans-serif";
  } catch {
    return "system-ui, sans-serif";
  }
}

// ---------------------------------------------------------------------------------------------------
// Welt
// ---------------------------------------------------------------------------------------------------

function baueWelt(THREE, canvas, huelle, opt) {
  const { mobil } = opt;
  const muell = []; // alles, was dispose() braucht
  const merke = (x) => (muell.push(x), x);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const anisotropie = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 1);

  const scene = new THREE.Scene();
  const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 4000);

  // Licht
  const himmel = new THREE.HemisphereLight(0xfbfdff, 0xece7dc, 1.4);
  scene.add(himmel);
  const sonne = new THREE.DirectionalLight(0xfff6e8, 2.6);
  sonne.castShadow = true;
  const karte = mobil ? 1024 : 2048;
  sonne.shadow.mapSize.set(karte, karte);
  sonne.shadow.bias = -0.0005;
  sonne.shadow.normalBias = 0.05;
  scene.add(sonne);
  scene.add(sonne.target);

  // Boden: nur Schatten (die Seite ist der Tisch). Kreisscheibe knapp über die Platte hinaus, ab dem
  // Plattenrand radial ausgeblendet – lange Winterschatten laufen weich aus statt als Keil „im Himmel“.
  const bodenMat = merke(new THREE.ShadowMaterial({ color: FARBE.ink900, opacity: 0.1, transparent: true, depthWrite: false }));
  bodenMat.onBeforeCompile = (s) => {
    s.uniforms.k2Innen = { value: 1 / FAENGER };
    s.vertexShader = s.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vK2Pos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvK2Pos = position.xy;");
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vK2Pos;\nuniform float k2Innen;")
      .replace("#include <tonemapping_fragment>", "gl_FragColor.a *= 1.0 - smoothstep(k2Innen, 1.0, length(vK2Pos));\n#include <tonemapping_fragment>");
  };
  const boden = new THREE.Mesh(merke(new THREE.CircleGeometry(1, 96)), bodenMat);
  boden.rotation.x = -Math.PI / 2;
  boden.position.y = 0.01;
  boden.receiveShadow = true;
  scene.add(boden);

  // Modellplatte mit Kompassring
  const kompassCanvas = document.createElement("canvas");
  kompassCanvas.width = kompassCanvas.height = 1024;
  const kompass = merke(new THREE.CanvasTexture(kompassCanvas));
  kompass.colorSpace = THREE.SRGBColorSpace;
  kompass.anisotropy = anisotropie;
  zeichneKompass(kompassCanvas);
  kompass.needsUpdate = true;
  const plattenRand = merke(new THREE.MeshStandardMaterial({ color: "#e9e4d6", roughness: 0.95 }));
  const plattenDeck = merke(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.95, map: kompass }));
  const platte = new THREE.Mesh(merke(new THREE.CylinderGeometry(1, 1, 1, 160, 1)), [plattenRand, plattenDeck, plattenRand]);
  platte.receiveShadow = true;
  platte.castShadow = true;
  scene.add(platte);

  // Sonnenmarke auf dem Kompassring
  const marke = new THREE.Mesh(merke(new THREE.CylinderGeometry(1, 1, 0.12, 48)), merke(new THREE.MeshBasicMaterial({ color: FARBE.sun400 })));
  scene.add(marke);
  const markeRing = new THREE.Mesh(merke(new THREE.CylinderGeometry(1, 1, 0.1, 48)), merke(new THREE.MeshBasicMaterial({ color: "#ffffff" })));
  scene.add(markeRing);

  // Sonnenbogen des Tages auf dem Kompassring (Auf- bis Untergang)
  const bogenMat = merke(
    new THREE.MeshBasicMaterial({ color: FARBE.sun400, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
  );
  const bogenNetz = new THREE.Mesh(new THREE.BufferGeometry(), bogenMat);
  bogenNetz.rotation.x = -Math.PI / 2;
  bogenNetz.visible = false;
  scene.add(bogenNetz);

  // Halle: Dach (Höhenfeld, Textur mit Schraffur) und Wände
  const dachCanvas = document.createElement("canvas");
  dachCanvas.width = dachCanvas.height = mobil ? 768 : 1024;
  let letzteTextur = -1e9;
  let texturTimer = 0;
  const dachTextur = merke(new THREE.CanvasTexture(dachCanvas));
  dachTextur.colorSpace = THREE.SRGBColorSpace;
  dachTextur.anisotropy = anisotropie;
  const dachMat = merke(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, map: dachTextur, vertexColors: true }));
  const wandMat = merke(new THREE.MeshStandardMaterial({ color: "#f8f5ee", roughness: 0.9 }));
  const dach = new THREE.Mesh(new THREE.BufferGeometry(), dachMat);
  dach.castShadow = true;
  dach.receiveShadow = true;
  const waende = new THREE.Mesh(new THREE.BufferGeometry(), wandMat);
  waende.castShadow = true;
  waende.receiveShadow = true;
  scene.add(dach, waende);

  // Module, Kuppeln, Technik
  const box = merke(new THREE.BoxGeometry(1, 1, 1));
  const modulMat = merke(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.35, metalness: 0.12 }));
  const modulNetz = new THREE.InstancedMesh(box, modulMat, MAX_MODULE);
  modulNetz.castShadow = true;
  modulNetz.receiveShadow = true;
  modulNetz.count = 0;
  modulNetz.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  modulNetz.setColorAt(0, new THREE.Color(FARBE.navy800));
  modulNetz.frustumCulled = false;
  scene.add(modulNetz);
  const kuppeln = new THREE.InstancedMesh(box, merke(new THREE.MeshStandardMaterial({ color: "#dce8f6", roughness: 0.3, metalness: 0.05 })), MAX_KUPPELN);
  kuppeln.castShadow = true;
  kuppeln.count = 0;
  kuppeln.frustumCulled = false;
  scene.add(kuppeln);
  const technik = new THREE.InstancedMesh(box, merke(new THREE.MeshStandardMaterial({ color: "#e3e6ec", roughness: 0.8 })), MAX_TECHNIK);
  technik.castShadow = true;
  technik.receiveShadow = true;
  technik.count = 0;
  technik.frustumCulled = false;
  scene.add(technik);

  // Maßstab: zwei Sattelzüge an der Ostrampe, Modellbäume
  const lkwMatHell = merke(new THREE.MeshStandardMaterial({ color: "#fbfaf6", roughness: 0.85 }));
  const lkwMatDunkel = merke(new THREE.MeshStandardMaterial({ color: "#c9cdd5", roughness: 0.8 }));
  const lkw = [0, 1].map(() => {
    const g = new THREE.Group();
    const { auflieger: al, kabine: kb } = LKW;
    const auflieger = new THREE.Mesh(box, lkwMatHell);
    auflieger.scale.set(al.l, al.h, al.b);
    auflieger.position.set(al.l / 2, PLATTE + al.boden + al.h / 2, 0);
    const kabine = new THREE.Mesh(box, lkwMatDunkel);
    kabine.scale.set(kb.l, kb.h, kb.b);
    kabine.position.set(al.l + kb.abstand + kb.l / 2, PLATTE + kb.h / 2, 0);
    for (const m of [auflieger, kabine]) {
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
    }
    scene.add(g);
    return g;
  });
  const kronen = new THREE.InstancedMesh(
    merke(new THREE.IcosahedronGeometry(1, 2)),
    merke(new THREE.MeshStandardMaterial({ color: "#f7f4ec", roughness: 1, flatShading: true })),
    16,
  );
  const staemme = new THREE.InstancedMesh(merke(new THREE.CylinderGeometry(0.28, 0.32, 1, 10)), lkwMatDunkel, 16);
  kronen.castShadow = staemme.castShadow = true;
  kronen.count = staemme.count = 0;
  scene.add(kronen, staemme);

  // --------------------------------------------------------------------------------------- Zustand
  const zustand = {
    plan: null,
    dachart: null,
    sonne: null,
    R: 60,
    dreh: 0, // Grad, aktuell
    rahmen: { u0: -60, v0: -40, w: 120, h: 80 }, // Bildausschnitt (bildRahmen), wie die viewBox des Iso-SVG
    raster: null, // { xs, zs, glas, xz: Float32Array, glasV: Float32Array }
    dachVon: null, // Float32Array Höhen
    dachZu: null,
    dachT: 1,
    dachStart: 0,
    dachTypVon: "ost-west",
    modVon: [],
    modZu: [],
    modStart: 0,
    modAktiv: false,
    kam: null, // { von: rahmen, zu: rahmen, start }
    drehTween: null, // { von, zu, start }
    ziehen: null,
  };
  const dummy = new THREE.Object3D();
  const farbe = new THREE.Color();
  const dunkel = new THREE.Color(FARBE.navy800);
  const hell = new THREE.Color(FARBE.navy400);
  const nacht = new THREE.Color(FARBE.navy900);

  // --------------------------------------------------------------------------------------- Texturen
  function zeichneKompass(c) {
    const ctx = c.getContext("2d");
    const S = c.width;
    const r = S / 2;
    // Weltpunkt (x, z) auf der Deckfläche → Canvas (UV des Zylinderdeckels: u ~ z, v ~ x)
    const P = (x, z) => [r * (1 + z), r * (1 - x)];
    ctx.fillStyle = "#f6f3ea";
    ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = "#c4cad5";
    ctx.lineWidth = S * 0.0022;
    ctx.beginPath();
    ctx.arc(r, r, r * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    for (let g = 0; g < 360; g += 15) {
      const lang = g % 90 === 0 ? 0.05 : g % 45 === 0 ? 0.032 : 0.016;
      const a = g * RAD;
      const [x0, y0] = P(Math.sin(a) * (0.9 - lang / 2), -Math.cos(a) * (0.9 - lang / 2));
      const [x1, y1] = P(Math.sin(a) * (0.9 + lang / 2), -Math.cos(a) * (0.9 + lang / 2));
      ctx.strokeStyle = g % 45 === 0 ? "#97a0b0" : "#c4cad5";
      ctx.lineWidth = S * (g % 90 === 0 ? 0.003 : 0.0022);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    // Nordpfeil
    ctx.fillStyle = "#394050";
    const [sx, sy] = P(0, -0.985);
    const [lx, ly] = P(-0.03, -0.9);
    const [rx, ry] = P(0.03, -0.9);
    const [mx, my] = P(0, -0.925);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(lx, ly);
    ctx.lineTo(mx, my);
    ctx.lineTo(rx, ry);
    ctx.closePath();
    ctx.fill();
    // Himmelsrichtungen (lesbar aus Südost: Text nach Norden „oben“)
    const schrift = displaySchrift();
    const beschrifte = (text, x, z, groesse, farbeText) => {
      const [px, py] = P(x, z);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = farbeText;
      ctx.font = `700 ${Math.round(S * groesse)}px ${schrift}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };
    beschrifte("N", 0, -0.82, 0.05, "#394050");
    beschrifte("O", 0.82, 0, 0.032, "#97a0b0");
    beschrifte("S", 0, 0.82, 0.032, "#97a0b0");
    beschrifte("W", -0.82, 0, 0.032, "#97a0b0");
  }

  function zeichneDach(plan) {
    const ctx = dachCanvas.getContext("2d");
    const S = dachCanvas.width;
    const { L, B, nutz, streifen } = plan;
    const kx = S / B;
    const kz = S / L;
    const P = (x, z) => [(x + B / 2) * kx, (z + L / 2) * kz];
    ctx.fillStyle = "#f6f2e7";
    ctx.fillRect(0, 0, S, S);
    // Schraffur-Zonen: Randstreifen + Freihaltestreifen
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, S, S);
    const [n0x, n0y] = P(nutz.x0, nutz.z0);
    const [n1x, n1y] = P(nutz.x1, nutz.z1);
    ctx.rect(n0x, n0y, n1x - n0x, n1y - n0y);
    for (const s of streifen) {
      const [a, b] = P(nutz.x0, s.z0);
      const [c, d] = P(nutz.x1, s.z1);
      ctx.rect(a, b, c - a, d - b);
    }
    ctx.clip("evenodd");
    ctx.fillStyle = "#ece6d6";
    ctx.fillRect(0, 0, S, S);
    // Diagonalen im Weltmaß (alle 1,3 m)
    ctx.strokeStyle = "#a3abb9";
    ctx.lineWidth = Math.max(1, 0.14 * Math.min(kx, kz));
    ctx.beginPath();
    const schritt = 1.3;
    for (let c0 = -L - B; c0 < L + B; c0 += schritt) {
      // Linie x − z = c0
      const [ax, ay] = P(-B / 2, -B / 2 - c0);
      const [bx, by] = P(B / 2, B / 2 - c0);
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
    ctx.restore();
    // Kante der Nutzfläche (Haarlinie)
    ctx.strokeStyle = "rgba(21,26,36,0.18)";
    ctx.lineWidth = Math.max(1, 0.08 * Math.min(kx, kz));
    ctx.strokeRect(n0x, n0y, n1x - n0x, n1y - n0y);
    dachTextur.needsUpdate = true;
  }

  // --------------------------------------------------------------------------------------- Halle
  function baueHalle(L, B) {
    const { xs, zs, glas } = dachRaster(L, B);
    const nx = xs.length - 1;
    const nz = zs.length - 1;
    const n = nx * nz * 6;
    const pos = new Float32Array(n * 3);
    const uv = new Float32Array(n * 2);
    const col = new Float32Array(n * 3);
    const xz = new Float32Array(n * 2);
    const glasV = new Uint8Array(n);
    let v = 0;
    const setze = (x, z, g) => {
      xz[v * 2] = x;
      xz[v * 2 + 1] = z;
      uv[v * 2] = (x + B / 2) / B;
      uv[v * 2 + 1] = 1 - (z + L / 2) / L;
      pos[v * 3] = x;
      pos[v * 3 + 2] = z;
      glasV[v] = g;
      v++;
    };
    for (let j = 0; j < nz; j++) {
      const g = glas.has(j) ? 1 : 0;
      for (let i = 0; i < nx; i++) {
        const x0 = xs[i];
        const x1 = xs[i + 1];
        const z0 = zs[j];
        const z1 = zs[j + 1];
        setze(x0, z0, g);
        setze(x0, z1, g);
        setze(x1, z0, g);
        setze(x1, z0, g);
        setze(x0, z1, g);
        setze(x1, z1, g);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

    // Wände: Umfang im Uhrzeigersinn (von oben, Norden oben) → Normalen nach außen
    const umfang = [];
    for (const x of xs) umfang.push([x, -L / 2]);
    for (const z of zs.slice(1)) umfang.push([B / 2, z]);
    for (const x of xs.slice(0, -1).reverse()) umfang.push([x, L / 2]);
    for (const z of zs.slice(1, -1).reverse()) umfang.push([-B / 2, z]);
    umfang.push([-B / 2, -L / 2]);
    const wn = (umfang.length - 1) * 6;
    const wPos = new Float32Array(wn * 3);
    const wXz = new Float32Array(wn * 2);
    const wOben = new Uint8Array(wn);
    let w = 0;
    const wsetze = (x, z, oben) => {
      wXz[w * 2] = x;
      wXz[w * 2 + 1] = z;
      wPos[w * 3] = x;
      wPos[w * 3 + 1] = PLATTE;
      wPos[w * 3 + 2] = z;
      wOben[w] = oben;
      w++;
    };
    for (let k = 0; k < umfang.length - 1; k++) {
      const [px, pz] = umfang[k];
      const [qx, qz] = umfang[k + 1];
      wsetze(px, pz, 0);
      wsetze(px, pz, 1);
      wsetze(qx, qz, 0);
      wsetze(qx, qz, 0);
      wsetze(px, pz, 1);
      wsetze(qx, qz, 1);
    }
    const wGeo = new THREE.BufferGeometry();
    wGeo.setAttribute("position", new THREE.BufferAttribute(wPos, 3));

    dach.geometry.dispose();
    waende.geometry.dispose();
    dach.geometry = geo;
    waende.geometry = wGeo;
    zustand.raster = { L, B, xz, glasV, n, wXz, wOben, wn };
  }

  function hoehen(typ) {
    const r = zustand.raster;
    const h = new Float32Array(r.n);
    for (let i = 0; i < r.n; i++) h[i] = dachHoehe(typ, r.xz[i * 2], r.xz[i * 2 + 1], r.L, r.B);
    const hw = new Float32Array(r.wn);
    for (let i = 0; i < r.wn; i++) hw[i] = r.wOben[i] ? dachHoehe(typ, r.wXz[i * 2], r.wXz[i * 2 + 1], r.L, r.B) : PLATTE;
    return { h, hw, shed: typ === "shed" ? 1 : 0 };
  }

  const halleFarbe = new THREE.Color("#fbf9f3");
  const glasFarbe = new THREE.Color("#bcd3ec");
  function wendeDachAn(t) {
    const r = zustand.raster;
    const a = zustand.dachVon;
    const b = zustand.dachZu;
    const e = EASE(t);
    const pos = dach.geometry.attributes.position.array;
    const col = dach.geometry.attributes.color.array;
    const glasAnteil = lerp(a.shed, b.shed, e);
    for (let i = 0; i < r.n; i++) {
      pos[i * 3 + 1] = lerp(a.h[i], b.h[i], e);
      const g = r.glasV[i] ? glasAnteil : 0;
      col[i * 3] = lerp(halleFarbe.r, glasFarbe.r, g);
      col[i * 3 + 1] = lerp(halleFarbe.g, glasFarbe.g, g);
      col[i * 3 + 2] = lerp(halleFarbe.b, glasFarbe.b, g);
    }
    dach.geometry.attributes.position.needsUpdate = true;
    dach.geometry.attributes.color.needsUpdate = true;
    dach.geometry.computeVertexNormals();
    dach.geometry.computeBoundingSphere();
    const wPos = waende.geometry.attributes.position.array;
    for (let i = 0; i < r.wn; i++) wPos[i * 3 + 1] = lerp(a.hw[i], b.hw[i], e);
    waende.geometry.attributes.position.needsUpdate = true;
    waende.geometry.computeVertexNormals();
    waende.geometry.computeBoundingSphere();
    // Kuppeln und Technik sitzen auf der (überblendeten) Dachfläche
    setzeAufbauten(e);
  }

  function setzeAufbauten(e = 1) {
    const plan = zustand.plan;
    if (!plan) return;
    const r = zustand.raster;
    const typVon = zustand.dachTypVon;
    const typZu = zustand.dachart;
    const y = (x, z) => lerp(dachHoehe(typVon, x, z, r.L, r.B), dachHoehe(typZu, x, z, r.L, r.B), e);
    const nk = Math.min(MAX_KUPPELN, plan.kuppeln.length);
    for (let i = 0; i < nk; i++) {
      const k = plan.kuppeln[i];
      dummy.position.set(k.x, y(k.x, k.z) + 0.3, k.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(k.w, 0.6, k.d);
      dummy.updateMatrix();
      kuppeln.setMatrixAt(i, dummy.matrix);
    }
    kuppeln.count = nk;
    kuppeln.instanceMatrix.needsUpdate = true;
    const nt = Math.min(MAX_TECHNIK, plan.technik.length);
    for (let i = 0; i < nt; i++) {
      const t = plan.technik[i];
      dummy.position.set(t.x, y(t.x, t.z) + 1.05, t.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(t.w, 2.1, t.d);
      dummy.updateMatrix();
      technik.setMatrixAt(i, dummy.matrix);
    }
    technik.count = nt;
    technik.instanceMatrix.needsUpdate = true;
  }

  // --------------------------------------------------------------------------------------- Module
  let sonnenV = null;
  function modulFarbe(rx, rz) {
    if (!sonnenV) return farbe.copy(nacht);
    // Normale von Rot(rx, 0, rz)·(0, 1, 0) (Euler XYZ)
    const nx = -Math.sin(rz);
    const ny = Math.cos(rz) * Math.cos(rx);
    const nz = Math.cos(rz) * Math.sin(rx);
    const f = Math.max(0, nx * sonnenV[0] + ny * sonnenV[1] + nz * sonnenV[2]);
    return farbe.copy(dunkel).lerp(hell, modulTon(f));
  }

  function schreibeModul(i, m) {
    dummy.position.set(m.x, m.y, m.z);
    dummy.rotation.set(m.rx, 0, m.rz);
    dummy.scale.set(Math.max(1e-4, m.sx), 0.05, Math.max(1e-4, m.sz));
    dummy.updateMatrix();
    modulNetz.setMatrixAt(i, dummy.matrix);
    modulNetz.setColorAt(i, modulFarbe(m.rx, m.rz));
  }

  function modulAktuell(i, jetzt) {
    if (!zustand.modAktiv) return zustand.modZu[i] || null;
    return modulZwischen(i, jetzt);
  }

  function modulZwischen(i, jetzt) {
    const N = Math.max(zustand.modVon.length, zustand.modZu.length);
    const a0 = zustand.modVon[i];
    const b0 = zustand.modZu[i];
    if (!a0 && !b0) return null;
    const a = a0 || { ...b0, y: b0.y + 3, sx: 0, sz: 0 };
    const b = b0 || { ...a0, y: a0.y + 1, sx: 0, sz: 0 };
    const verz = (i / Math.max(1, N)) * 0.14;
    const t = klemme(((jetzt - zustand.modStart) / 1000 - verz) / 0.26, 0, 1);
    const e = EASE(t);
    const bogen = Math.sin(Math.PI * t) * 1.6;
    return {
      x: lerp(a.x, b.x, e),
      y: lerp(a.y, b.y, e) + bogen,
      z: lerp(a.z, b.z, e),
      rx: lerp(a.rx, b.rx, e),
      rz: lerp(a.rz, b.rz, e),
      sx: lerp(a.sx, b.sx, e),
      sz: lerp(a.sz, b.sz, e),
      t,
    };
  }

  function schrittModule(jetzt) {
    const N = Math.max(zustand.modVon.length, zustand.modZu.length);
    let fertig = true;
    for (let i = 0; i < N; i++) {
      const m = modulZwischen(i, jetzt);
      if (m.t < 1) fertig = false;
      schreibeModul(i, m);
    }
    modulNetz.count = N;
    if (fertig) {
      zustand.modAktiv = false;
      for (let i = 0; i < zustand.modZu.length; i++) schreibeModul(i, zustand.modZu[i]);
      modulNetz.count = zustand.modZu.length;
    }
    modulNetz.instanceMatrix.needsUpdate = true;
    if (modulNetz.instanceColor) modulNetz.instanceColor.needsUpdate = true;
    return !fertig;
  }

  function setzeModule(liste, sofort, jetzt) {
    const neu = liste.slice(0, MAX_MODULE);
    if (sofort) {
      zustand.modAktiv = false;
      zustand.modZu = neu;
      for (let i = 0; i < neu.length; i++) schreibeModul(i, neu[i]);
      modulNetz.count = neu.length;
      modulNetz.instanceMatrix.needsUpdate = true;
      if (modulNetz.instanceColor) modulNetz.instanceColor.needsUpdate = true;
      return;
    }
    // Startpunkt = aktueller (ggf. halb umgeordneter) Zustand
    const N = Math.max(zustand.modVon.length, zustand.modZu.length);
    const von = [];
    for (let i = 0; i < (zustand.modAktiv ? N : zustand.modZu.length); i++) {
      const m = modulAktuell(i, jetzt);
      if (m && (m.sx > 0.01 || !zustand.modAktiv)) von.push({ x: m.x, y: m.y, z: m.z, rx: m.rx, rz: m.rz, sx: m.sx, sz: m.sz });
    }
    zustand.modVon = von;
    zustand.modZu = neu;
    zustand.modStart = jetzt;
    zustand.modAktiv = true;
  }

  function faerbeModule() {
    const n = modulNetz.count;
    for (let i = 0; i < n; i++) {
      const m = zustand.modAktiv ? null : zustand.modZu[i];
      if (m) modulNetz.setColorAt(i, modulFarbe(m.rx, m.rz));
    }
    if (modulNetz.instanceColor) modulNetz.instanceColor.needsUpdate = true;
  }

  // --------------------------------------------------------------------------------------- Umgebung
  function setzeUmgebung(plan) {
    const { L, B } = plan;
    const u = umgebung(L, B);
    const R = u.R;
    zustand.R = R;
    platte.scale.set(R, PLATTE, R);
    platte.position.set(0, PLATTE / 2, 0);
    boden.scale.set(R * FAENGER, R * FAENGER, 1);
    // Lkw an der Ostrampe (senkrecht zur Wand)
    lkw.forEach((g, i) => {
      const p = u.lkw[i];
      g.visible = !!p;
      if (p) g.position.set(p.x, 0, p.z);
    });
    // Modellbäume am Plattenrand (Norden und Westen), nie auf Halle oder Lkw – Positionen wie im Iso-SVG
    let k = 0;
    for (const b of u.baeume) {
      const kr = baumKrone(b.s);
      dummy.position.set(b.x, kr.y, b.z);
      dummy.rotation.set(0, b.dreh, 0);
      dummy.scale.set(kr.r, kr.r, kr.r);
      dummy.updateMatrix();
      kronen.setMatrixAt(k, dummy.matrix);
      dummy.position.set(b.x, PLATTE + 1.5, b.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 3, 1);
      dummy.updateMatrix();
      staemme.setMatrixAt(k, dummy.matrix);
      k++;
    }
    kronen.count = staemme.count = k;
    kronen.instanceMatrix.needsUpdate = staemme.instanceMatrix.needsUpdate = true;
  }

  // --------------------------------------------------------------------------------------- Sonnenbogen
  function setzeBogen(b) {
    zustand.bogen = b;
    zustand.bogenR = zustand.R;
    bogenNetz.geometry.dispose();
    if (!b || !(b.bis > b.von)) {
      bogenNetz.visible = false;
      bogenNetz.geometry = new THREE.BufferGeometry();
      return;
    }
    const R = zustand.R;
    const w = Math.max(0.45, R * 0.009);
    // RingGeometry liegt nach rotation.x = −90° in der Ebene; Winkel θ = 90° − Azimut
    bogenNetz.geometry = new THREE.RingGeometry(R * 0.9 - w, R * 0.9 + w, 96, 1, (90 - b.bis) * RAD, (b.bis - b.von) * RAD);
    bogenNetz.position.y = PLATTE + 0.04;
    bogenNetz.visible = true;
  }

  // --------------------------------------------------------------------------------------- Sonne
  function setzeSonne(s) {
    zustand.sonne = s;
    const R = zustand.R;
    if (!s || !s.ueber) {
      sonnenV = null;
      sonne.intensity = 0;
      sonne.castShadow = false;
      // Nacht: kühles, gedämpftes Himmelslicht (blaue Stunde) statt schmutzigem Grau
      himmel.color.set(FARBE.navy100);
      himmel.groundColor.set(FARBE.navy300);
      himmel.intensity = 1.15;
      marke.visible = markeRing.visible = false;
    } else {
      himmel.color.set(0xfbfdff);
      himmel.groundColor.set(0xece7dc);
      sonnenV = sonnenVektor(s.zenit, s.azimut);
      const hoehe = 90 - s.zenit;
      const weich = klemme(hoehe / 8, 0, 1);
      const D = R * 3;
      sonne.position.set(sonnenV[0] * D, sonnenV[1] * D, sonnenV[2] * D);
      sonne.target.position.set(0, 0, 0);
      sonne.intensity = 2.6 * (0.35 + 0.65 * weich);
      sonne.color.set(0xffd8a8).lerp(new THREE.Color(0xfff6e8), weich);
      sonne.castShadow = true;
      // Mindesthelligkeit: Was die flache Sonne der Modellplatte an Licht nicht gibt, gleicht der Himmel aus –
      // der Karton bleibt hell (Dezember, Morgen, Abend), Schatten bleiben lesbar.
      himmel.intensity = klemme(3.45 - sonne.intensity * sonnenV[1], 1.35, 2.85);
      // lange Schatten jenseits der Platte nur angedeutet
      bodenMat.opacity = 0.08 * klemme((hoehe - 3) / 22, 0.35, 1);
      const c = sonne.shadow.camera;
      const w = R * 1.25;
      c.left = -w;
      c.right = w;
      c.top = w;
      c.bottom = -w;
      c.near = D - R * 2;
      c.far = D + R * 2;
      c.updateProjectionMatrix();
      const az = s.azimut * RAD;
      marke.visible = markeRing.visible = true;
      const rm = R * 0.9;
      const gr = Math.max(1.6, R * 0.03);
      marke.position.set(Math.sin(az) * rm, PLATTE + 0.08, -Math.cos(az) * rm);
      marke.scale.set(gr, 1, gr);
      markeRing.position.set(Math.sin(az) * rm, PLATTE + 0.05, -Math.cos(az) * rm);
      markeRing.scale.set(gr * 1.35, 1, gr * 1.35);
    }
  }

  // --------------------------------------------------------------------------------------- Kamera
  /**
   * Orthografische Kamera in der Ansicht des Iso-SVG: Bildmitte = Mitte des Ausschnitts (u, v aus iso()),
   * Frustum = Ausschnitt mit „meet“ an das Seitenverhältnis der Leinwand angepasst (wie preserveAspectRatio
   * xMidYMid meet). Gedreht wird um die Hochachse; der Ausschnitt bleibt (er gilt für ±ANSICHT.drehung).
   */
  function kameraSetzen(rahmen, dreh) {
    const a = (ANSICHT.azimut + dreh) * RAD;
    const e = ANSICHT.hoehe * RAD;
    const sa = Math.sin(a);
    const ca = Math.cos(a);
    const se = Math.sin(e);
    const ce = Math.cos(e);
    const uc = rahmen.u0 + rahmen.w / 2;
    const vc = rahmen.v0 + rahmen.h / 2;
    // Bildschirm-rechts r = (−cos a, 0, −sin a), Bildschirm-unten d = (sin a·sin e, −cos e, −cos a·sin e)
    const tx = -ca * uc + sa * se * vc;
    const ty = -ce * vc;
    const tz = -sa * uc - ca * se * vc;
    const D = zustand.R * 3;
    kamera.position.set(tx + sa * ce * D, ty + se * D, tz - ca * ce * D);
    kamera.up.set(0, 1, 0);
    kamera.lookAt(tx, ty, tz);
    const asp = breite / Math.max(1, hoeheC);
    const halbH = Math.max(rahmen.h / 2, rahmen.w / 2 / asp);
    kamera.left = -halbH * asp;
    kamera.right = halbH * asp;
    kamera.top = halbH;
    kamera.bottom = -halbH;
    kamera.near = Math.max(1, D - zustand.R * 2.5);
    kamera.far = D + zustand.R * 2.5;
    kamera.updateProjectionMatrix();
    kamera.updateMatrixWorld();
  }

  // --------------------------------------------------------------------------------------- Größe
  let breite = 0;
  let hoeheC = 0;
  function groesse() {
    const r = huelle.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    if (w === breite && h === hoeheC) return false;
    breite = w;
    hoeheC = h;
    renderer.setSize(w, h, false);
    return true;
  }

  const zwischenRahmen = (a, b, t) => ({ u0: lerp(a.u0, b.u0, t), v0: lerp(a.v0, b.v0, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

  // --------------------------------------------------------------------------------------- Takt
  let raf = 0;
  let fehler = null;
  function bild(jetzt) {
    raf = 0;
    let weiter = false;
    if (zustand.dachT < 1) {
      zustand.dachT = klemme((jetzt - zustand.dachStart) / 400, 0, 1);
      wendeDachAn(zustand.dachT);
      if (zustand.dachT < 1) weiter = true;
      else zustand.dachTypVon = zustand.dachart;
    }
    if (zustand.modAktiv) weiter = schrittModule(jetzt) || weiter;
    if (zustand.kam) {
      const t = klemme((jetzt - zustand.kam.start) / 400, 0, 1);
      zustand.rahmen = zwischenRahmen(zustand.kam.von, zustand.kam.zu, EASE(t));
      if (t >= 1) zustand.kam = null;
      else weiter = true;
    }
    if (zustand.drehTween) {
      const t = klemme((jetzt - zustand.drehTween.start) / 320, 0, 1);
      zustand.dreh = lerp(zustand.drehTween.von, zustand.drehTween.zu, EASE(t));
      if (t >= 1) zustand.drehTween = null;
      else weiter = true;
    }
    kameraSetzen(zustand.rahmen, zustand.dreh);
    opt.onAnsicht?.(zustand.dreh);
    try {
      renderer.render(scene, kamera);
    } catch (e) {
      fehler = e;
      opt.onFehler?.(e);
      return;
    }
    if (weiter) raf = requestAnimationFrame(bild);
  }
  const anstossen = () => {
    if (!raf && !fehler) raf = requestAnimationFrame(bild);
  };

  // --------------------------------------------------------------------------------------- Ziehen
  const ziehStart = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    zustand.ziehen = { x: e.clientX, dreh: zustand.dreh, id: e.pointerId, bewegt: false };
    zustand.drehTween = null;
  };
  const ziehen = (e) => {
    const z = zustand.ziehen;
    if (!z || z.id !== e.pointerId) return;
    const dx = e.clientX - z.x;
    if (!z.bewegt && Math.abs(dx) < 4) return;
    if (!z.bewegt) {
      z.bewegt = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ohne Capture weiter */
      }
      opt.onGezogen?.();
    }
    zustand.dreh = klemme(z.dreh + dx * (40 / Math.max(240, breite)) * 1.4, -ANSICHT.drehung, ANSICHT.drehung);
    anstossen();
  };
  const ziehEnde = (e) => {
    const z = zustand.ziehen;
    if (!z || z.id !== e.pointerId) return;
    zustand.ziehen = null;
    if (z.bewegt) opt.onDrehung?.(Math.round(zustand.dreh));
  };
  canvas.addEventListener("pointerdown", ziehStart);
  canvas.addEventListener("pointermove", ziehen);
  canvas.addEventListener("pointerup", ziehEnde);
  canvas.addEventListener("pointercancel", ziehEnde);
  const kontextWeg = (e) => {
    e.preventDefault();
    fehler = new Error("WebGL-Kontext verloren");
    opt.onFehler?.(fehler);
  };
  canvas.addEventListener("webglcontextlost", kontextWeg);

  const beobachter = new ResizeObserver(() => {
    if (groesse()) anstossen();
  });
  beobachter.observe(huelle);

  // --------------------------------------------------------------------------------------- API
  return {
    setze({ plan, dachart, sonne: s, drehung = 0, ruhig, bogen = null }, { sofort = false } = {}) {
      const jetzt = performance.now();
      const alt = zustand.plan;
      const massNeu = !alt || alt.L !== plan.L || alt.B !== plan.B;
      const dachartNeu = zustand.dachart !== dachart;
      const planNeu = alt !== plan;
      const still = sofort || ruhig;
      if (!alt) groesse();

      if (massNeu) {
        const sprung = alt ? Math.abs(alt.L - plan.L) + Math.abs(alt.B - plan.B) : 0;
        setzeUmgebung(plan);
        baueHalle(plan.L, plan.B);
        // Maßwechsel: Dachform sofort (Raster ändert sich), Dachart-Überblendung beenden
        zustand.dachTypVon = dachart;
        zustand.dachart = dachart;
        zustand.dachVon = zustand.dachZu = hoehen(dachart);
        zustand.dachT = 1;
        zustand.plan = plan;
        wendeDachAn(1);
        const f = bildRahmen(plan.L, plan.B);
        if (!still && alt && sprung > 20) zustand.kam = { von: { ...zustand.rahmen }, zu: f, start: jetzt };
        else {
          zustand.kam = null;
          zustand.rahmen = f;
        }
      } else if (dachartNeu) {
        // Dachform überblenden (400 ms) – von der aktuellen Zwischenform aus
        const pos = dach.geometry.attributes.position.array;
        const r = zustand.raster;
        const von = {
          h: new Float32Array(r.n),
          hw: new Float32Array(r.wn),
          shed: zustand.dachZu ? lerp(zustand.dachVon.shed, zustand.dachZu.shed, EASE(zustand.dachT)) : 0,
        };
        for (let i = 0; i < r.n; i++) von.h[i] = pos[i * 3 + 1];
        const wPos = waende.geometry.attributes.position.array;
        for (let i = 0; i < r.wn; i++) von.hw[i] = wPos[i * 3 + 1];
        zustand.dachVon = von;
        zustand.dachZu = hoehen(dachart);
        zustand.dachTypVon = zustand.dachart;
        zustand.dachart = dachart;
        zustand.plan = plan;
        if (still) {
          zustand.dachT = 1;
          zustand.dachTypVon = dachart;
          wendeDachAn(1);
        } else {
          zustand.dachT = 0;
          zustand.dachStart = jetzt;
        }
      }
      zustand.plan = plan;

      if (planNeu) {
        // Dachtextur (Schraffur) beim Ziehen höchstens alle 160 ms neu zeichnen – der Upload ist der
        // teuerste Schritt; dazwischen dehnt sich die alte Textur über die UVs mit.
        clearTimeout(texturTimer);
        const seit = jetzt - letzteTextur;
        if (seit >= 160) {
          zeichneDach(plan);
          letzteTextur = jetzt;
        } else {
          texturTimer = setTimeout(() => {
            if (!zustand.plan) return;
            zeichneDach(zustand.plan);
            letzteTextur = performance.now();
            anstossen();
          }, 160 - seit);
        }
        if (zustand.dachT >= 1) setzeAufbauten(1);
      }
      if (bogen !== zustand.bogen || zustand.bogenR !== zustand.R) setzeBogen(bogen);
      bogenMat.opacity = s?.ueber ? 0.85 : 0.5;
      if (s !== zustand.sonne) {
        setzeSonne(s);
        if (!planNeu) faerbeModule();
      }
      if (planNeu) setzeModule(plan.instanzen, still || !dachartNeu, jetzt);

      if (drehung !== zustand.drehZiel) {
        zustand.drehZiel = drehung;
        if (Math.round(zustand.dreh) !== drehung) {
          if (still) zustand.dreh = drehung;
          else zustand.drehTween = { von: zustand.dreh, zu: drehung, start: jetzt };
        }
      }
      anstossen();
    },
    render: anstossen,
    entsorgen() {
      cancelAnimationFrame(raf);
      clearTimeout(texturTimer);
      beobachter.disconnect();
      canvas.removeEventListener("pointerdown", ziehStart);
      canvas.removeEventListener("pointermove", ziehen);
      canvas.removeEventListener("pointerup", ziehEnde);
      canvas.removeEventListener("pointercancel", ziehEnde);
      canvas.removeEventListener("webglcontextlost", kontextWeg);
      dach.geometry.dispose();
      waende.geometry.dispose();
      bogenNetz.geometry.dispose();
      modulNetz.dispose();
      kuppeln.dispose();
      technik.dispose();
      kronen.dispose();
      staemme.dispose();
      for (const x of muell) x.dispose?.();
      sonne.shadow.map?.dispose?.();
      renderer.dispose();
    },
  };
}

// ---------------------------------------------------------------------------------------------------
// React-Hülle
// ---------------------------------------------------------------------------------------------------

/**
 * @param {{
 *   plan: object, dachart: string, sonne: { zenit:number, azimut:number, ueber:boolean },
 *   drehung: number, mobil: boolean, ruhig: boolean,
 *   onBereit?: () => void, onFehler?: (e: Error) => void, onDrehung?: (grad: number) => void, onGezogen?: () => void,
 *   onAnsicht?: (grad: number) => void, bogen?: { von:number, bis:number } | null,
 * }} props
 *   onAnsicht: aktuelle Drehung je gerendertem Bild (die Windrose folgt beim Ziehen, ohne die Bühne neu zu rendern)
 *   bogen: Sonnenbogen des Tages auf dem Kompassring
 */
export default function K2Szene3D({ plan, dachart, sonne, drehung, mobil, ruhig, bogen, onBereit, onFehler, onDrehung, onGezogen, onAnsicht }) {
  const huelle = useRef(null);
  const leinwand = useRef(null);
  const welt = useRef(null);
  const aktuell = useRef(null);
  aktuell.current = { plan, dachart, sonne, drehung, ruhig, bogen, onBereit, onFehler, onDrehung, onGezogen, onAnsicht };
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    let tot = false;
    (async () => {
      try {
        const THREE = await import("three");
        if (tot || !leinwand.current) return;
        const w = baueWelt(THREE, leinwand.current, huelle.current, {
          mobil,
          onFehler: (e) => aktuell.current.onFehler?.(e),
          onDrehung: (g) => aktuell.current.onDrehung?.(g),
          onGezogen: () => aktuell.current.onGezogen?.(),
          onAnsicht: (g) => aktuell.current.onAnsicht?.(g),
        });
        welt.current = w;
        w.setze(aktuell.current, { sofort: true });
        // erst sichtbar machen, wenn das erste Bild steht
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (tot) return;
            setSichtbar(true);
            aktuell.current.onBereit?.();
          }),
        );
      } catch (e) {
        if (!tot) aktuell.current.onFehler?.(e);
      }
    })();
    return () => {
      tot = true;
      welt.current?.entsorgen();
      welt.current = null;
    };
    // Welt einmal aufbauen; mobil bestimmt nur die Texturgröße beim Start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    welt.current?.setze({ plan, dachart, sonne, drehung, ruhig, bogen });
  }, [plan, dachart, sonne, drehung, ruhig, bogen]);

  return (
    <div
      ref={huelle}
      className="absolute inset-0"
      style={{ opacity: sichtbar ? 1 : 0, transition: ruhig ? "none" : `opacity ${BEWEGUNG.dauer.lang}s ${BEWEGUNG.css.aus}` }}
    >
      <canvas ref={leinwand} className="block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing" aria-hidden="true" />
    </div>
  );
}
