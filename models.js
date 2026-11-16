/* Модели пака: персонажи, олени, сани, ёлки.
   Всё собрано из простых примитивов — как блочный аватар Roblox. */

import * as THREE from 'three';

let RoundedBoxGeometry = null;
try {
  ({ RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js'));
} catch (err) {
  console.warn('RoundedBoxGeometry недоступен — использую обычные блоки', err);
}

/* ---------- кэши ---------- */
const geoCache = new Map();
const matCache = new Map();

function cached(key, make) {
  let g = geoCache.get(key);
  if (!g) { g = make(); geoCache.set(key, g); }
  return g;
}

function mat(color, o = {}) {
  const key = [color, o.rough ?? 0.85, o.metal ?? 0, o.emissive ?? '', o.glow ?? 0].join('|');
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: o.rough ?? 0.85,
      metalness: o.metal ?? 0,
      emissive: new THREE.Color(o.emissive ?? '#000000'),
      emissiveIntensity: o.glow ?? 0
    });
    matCache.set(key, m);
  }
  return m;
}

/* ---------- примитивы ---------- */
function boxGeo(w, h, d, r = 0.05) {
  const rad = Math.max(0.001, Math.min(r, Math.min(w, h, d) / 2.4));
  const key = `b|${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}|${rad.toFixed(3)}`;
  return cached(key, () => RoundedBoxGeometry
    ? new RoundedBoxGeometry(w, h, d, 2, rad)
    : new THREE.BoxGeometry(w, h, d));
}

export function box(parent, w, h, d, material, x = 0, y = 0, z = 0, r = 0.05) {
  const mesh = new THREE.Mesh(boxGeo(w, h, d, r), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function sphere(parent, radius, material, x = 0, y = 0, z = 0, seg = 18) {
  const geo = cached(`s|${radius}|${seg}`, () => new THREE.SphereGeometry(radius, seg, Math.round(seg * 0.75)));
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function cyl(parent, rTop, rBot, h, material, x = 0, y = 0, z = 0, seg = 14) {
  const geo = cached(`c|${rTop}|${rBot}|${h}|${seg}`, () => new THREE.CylinderGeometry(rTop, rBot, h, seg));
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function disc(parent, radius, material, x, y, z) {
  const geo = cached(`d|${radius}`, () => new THREE.CircleGeometry(radius, 20));
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

function twig(parent, len, rBase, rTip, material, x = 0, y = 0, z = 0, rz = 0, rx = 0) {
  const geo = cached(`t|${len}|${rBase}|${rTip}`, () => {
    const g = new THREE.CylinderGeometry(rTip, rBase, len, 6);
    g.translate(0, len / 2, 0);
    return g;
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rz;
  mesh.rotation.x = rx;
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function starGeo(r1, r2, points = 5, depth = 0.08) {
  const key = `star|${r1}|${r2}|${points}|${depth}`;
  return cached(key, () => {
    const shape = new THREE.Shape();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 ? r2 : r1;
      const a = -Math.PI / 2 + (i * Math.PI) / points;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) shape.moveTo(px, py); else shape.lineTo(px, py);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2
    });
  });
}

/* ---------- рога ---------- */
function addAntlers(head, material, scale = 1, lights = false) {
  for (const side of [-1, 1]) {
    const base = new THREE.Group();
    base.position.set(side * 0.3, 1.08, -0.02);
    base.rotation.z = -side * 0.28;
    head.add(base);
    twig(base, 0.95 * scale, 0.075, 0.05, material);

    const fork1 = new THREE.Group();
    fork1.position.set(0, 0.5 * scale, 0);
    fork1.rotation.z = side * 0.85;
    base.add(fork1);
    twig(fork1, 0.58 * scale, 0.055, 0.03, material);

    const fork2 = new THREE.Group();
    fork2.position.set(0, 0.78 * scale, 0);
    fork2.rotation.z = -side * 0.42;
    base.add(fork2);
    twig(fork2, 0.52 * scale, 0.05, 0.028, material);

    const fork3 = new THREE.Group();
    fork3.position.set(side * 0.12, 0.28 * scale, 0);
    fork3.rotation.z = side * 1.18;
    base.add(fork3);
    twig(fork3, 0.38 * scale, 0.045, 0.025, material);

    if (lights) {
      const bulb = mat('#FFD79A', { emissive: '#FFC978', glow: 2.6, rough: 0.4 });
      sphere(base, 0.055, bulb, 0, 0.94 * scale, 0, 8);
      sphere(fork1, 0.05, bulb, 0, 0.56 * scale, 0, 8);
      sphere(fork2, 0.045, bulb, 0, 0.5 * scale, 0, 8);
    }
  }
}

/* ---------- шуба / аксессуары ---------- */
function furHat(head, trim, gold) {
  const fur = mat(trim, { rough: 0.98 });
  cyl(head, 0.68, 0.74, 0.5, fur, 0, 1.28, 0, 20);
  cyl(head, 0.84, 0.84, 0.18, fur, 0, 0.98, 0, 20);
  const dome = sphere(head, 0.66, fur, 0, 1.52, 0, 18);
  dome.scale.set(1, 0.32, 1);
  const flake = new THREE.Mesh(starGeo(0.16, 0.07, 6, 0.05), mat(gold, { metal: 0.6, rough: 0.3, emissive: gold, glow: 0.45 }));
  flake.position.set(0, 1.3, 0.66);
  head.add(flake);
}

function kokoshnik(head, silver, gold) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.54, 0);
  shape.lineTo(-0.46, 0.5);
  shape.quadraticCurveTo(0, 1.2, 0.46, 0.5);
  shape.lineTo(0.54, 0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2
  });
  geo.translate(0, 0, -0.05);
  const crown = new THREE.Mesh(geo, mat('#E9F3FF', { metal: 0.35, rough: 0.28 }));
  crown.position.set(0, 1.0, -0.03);
  crown.castShadow = true;
  head.add(crown);

  const rim = new THREE.Mesh(geo, mat(gold, { metal: 0.75, rough: 0.3 }));
  rim.scale.set(1.08, 1.05, 0.7);
  rim.position.set(0, 1.0, -0.1);
  head.add(rim);

  const dot = mat(gold, { metal: 0.7, rough: 0.3 });
  for (let i = -2; i <= 2; i++) {
    const x = i * 0.19;
    const y = 1.0 + 1.02 - Math.abs(i) * 0.16;
    sphere(head, 0.04, dot, x, y, 0.075, 8);
  }
  const emblem = new THREE.Mesh(starGeo(0.13, 0.055, 6, 0.04), dot);
  emblem.position.set(0, 1.48, 0.09);
  head.add(emblem);
  box(head, 1.24, 0.14, 0.06, mat(gold, { metal: 0.5, rough: 0.35 }), 0, 1.02, 0.6, 0.02);
}

function braid(head, hair, ribbon) {
  const mHair = mat(hair, { rough: 0.9 });
  const strands = [[0.72, 0.45, 0.02, 0.19], [0.78, 0.1, 0.04, 0.17], [0.76, -0.26, 0.06, 0.15], [0.7, -0.6, 0.08, 0.12]];
  for (const [x, y, z, r] of strands) sphere(head, r, mHair, x, y, z, 14);
  box(head, 0.2, 0.16, 0.2, mat(ribbon), 0.66, -0.82, 0.08, 0.05);
  box(head, 0.2, 0.26, 0.06, mat(ribbon), 0.78, -0.94, 0.12, 0.03).rotation.z = 0.35;
}

function scarf(body, shoulderY, color, stripe) {
  const scarfMesh = new THREE.Mesh(
    cached('scarf', () => new THREE.TorusGeometry(0.62, 0.15, 8, 20)),
    mat(color, { rough: 0.95 })
  );
  scarfMesh.rotation.x = Math.PI / 2;
  scarfMesh.position.y = shoulderY - 0.02;
  scarfMesh.castShadow = true;
  body.add(scarfMesh);

  const tail = box(body, 0.28, 0.8, 0.14, mat(color, { rough: 0.95 }), 0.46, shoulderY - 0.48, 0.52, 0.05);
  tail.rotation.z = 0.1;
  if (stripe) {
    box(body, 0.3, 0.09, 0.16, mat(stripe), 0.46, shoulderY - 0.2, 0.52, 0.03);
    box(body, 0.3, 0.09, 0.16, mat(stripe), 0.47, shoulderY - 0.62, 0.52, 0.03);
  }
}

function bells(body, torsoW, torsoD, y) {
  const gold = mat('#E6B45C', { metal: 0.85, rough: 0.25 });
  for (const x of [-0.45, 0, 0.45]) {
    sphere(body, 0.075, gold, x * (torsoW / 2), y, torsoD / 2 + 0.06, 10);
  }
}

/* ---------- аватар ---------- */
export function buildAvatar(item, pose = 'stand') {
  const C = item.colors || {};
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const mCoat = mat(C.coat);
  const mTrim = mat(C.trim, { rough: 0.95 });
  const mSkin = mat(C.skin || '#F0C9A6');
  const mPants = mat(C.pants || C.coat);
  const mBoot = mat(C.boot || '#2A1B15');
  const mGold = mat(C.gold || '#E6B45C', { metal: 0.8, rough: 0.28 });
  const mHair = mat(C.hair || '#F7F3EA', { rough: 0.9 });
  const mDark = mat('#20263a', { rough: 0.45 });
  const mAccent = mat(C.accent || '#E6B45C');

  const torsoW = item.torsoW || 2;
  const torsoD = item.torsoD || 1.05;
  const torsoH = 2;
  const hipY = 2.05;
  const shoulderY = hipY + torsoH;
  const headY = shoulderY + 0.12;
  const armX = torsoW / 2 + 0.44;

  /* ноги */
  const legs = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.56, hipY, 0);
    body.add(leg);
    box(leg, 0.95, 1.4, 0.95, mPants, 0, -0.75, 0, 0.1);
    box(leg, 1.02, 0.72, 1.06, mBoot, 0, -1.64, 0, 0.1);
    if (C.bootTrim) box(leg, 1.06, 0.13, 1.1, mat(C.bootTrim), 0, -1.31, 0, 0.04);
    if (item.kind === 'sneg') {
      box(leg, 0.08, 0.05, 1.05, mat('#9FB2C8', { metal: 0.9, rough: 0.25 }), 0, -2.02, 0.06, 0.02);
    }
    legs.push(leg);
  }

  /* торс */
  box(body, torsoW, torsoH, torsoD, mCoat, 0, hipY + torsoH / 2, 0, 0.14);
  box(body, torsoW + 0.12, 0.24, torsoD + 0.06, mTrim, 0, shoulderY - 0.12, 0, 0.05);
  box(body, torsoW + 0.16, 0.9, torsoD + 0.12, mCoat, 0, hipY - 0.15, 0, 0.12);
  box(body, torsoW + 0.22, 0.16, torsoD + 0.18, mTrim, 0, hipY - 0.56, 0, 0.04);

  if (C.belt) {
    box(body, torsoW + 0.06, 0.28, torsoD + 0.06, mat(C.belt, { rough: 0.6 }), 0, hipY + 0.82, 0, 0.04);
    box(body, 0.44, 0.32, 0.08, mGold, 0, hipY + 0.82, torsoD / 2 + 0.05, 0.03);
  }

  /* руки */
  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * armX, shoulderY - 0.16, 0);
    body.add(arm);
    box(arm, 0.88, 1.85, 0.88, mCoat, 0, -0.95, 0, 0.12);
    box(arm, 0.94, 0.26, 0.94, mTrim, 0, -1.8, 0, 0.04);
    box(arm, 0.76, 0.6, 0.76, mat(C.glove || C.skin || '#F0C9A6'), 0, -2.18, 0, 0.1);
    arms.push(arm);
  }

  /* голова */
  const head = new THREE.Group();
  head.position.set(0, headY, 0);
  body.add(head);
  box(body, 0.45, 0.3, 0.45, mSkin, 0, shoulderY + 0.02, 0, 0.06);
  box(head, 1.25, 1.25, 1.25, mSkin, 0, 0.62, 0, 0.12);

  for (const sx of [-1, 1]) box(head, 0.15, 0.2, 0.07, mDark, sx * 0.27, 0.74, 0.635, 0.03);
  if (item.kind !== 'ded') box(head, 0.22, 0.055, 0.05, mat('#A5645C', { rough: 0.7 }), 0, 0.4, 0.635, 0.02);

  const cheek = new THREE.MeshBasicMaterial({ color: '#e8897d', transparent: true, opacity: 0.35 });
  if (['ded', 'sneg', 'elf'].includes(item.kind)) {
    disc(head, 0.1, cheek, -0.47, 0.55, 0.639);
    disc(head, 0.1, cheek, 0.47, 0.55, 0.639);
  }

  /* детали по типу */
  if (item.kind === 'ded') {
    const beard = mat(C.hair, { rough: 1 });
    box(head, 1.12, 0.5, 0.4, beard, 0, 0.1, 0.42, 0.16);
    const longBeard = new THREE.Mesh(cached('beardPlate', () => {
      const s = new THREE.Shape();
      s.moveTo(-0.58, 0.14);
      s.quadraticCurveTo(-0.68, -0.5, -0.3, -0.92);
      s.quadraticCurveTo(-0.14, -1.1, 0, -1.3);
      s.quadraticCurveTo(0.14, -1.1, 0.3, -0.92);
      s.quadraticCurveTo(0.68, -0.5, 0.58, 0.14);
      s.closePath();
      return new THREE.ExtrudeGeometry(s, {
        depth: 0.28, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05,
        bevelSegments: 2, curveSegments: 12
      });
    }), beard);
    longBeard.position.set(0, 0.14, 0.4);
    longBeard.castShadow = true;
    longBeard.receiveShadow = true;
    head.add(longBeard);
    box(head, 0.22, 0.62, 0.34, beard, -0.5, 0.38, 0.42, 0.1);
    box(head, 0.22, 0.62, 0.34, beard, 0.5, 0.38, 0.42, 0.1);
    const mx = box(head, 0.36, 0.13, 0.14, beard, -0.2, 0.31, 0.7, 0.05); mx.rotation.z = 0.2;
    const mx2 = box(head, 0.36, 0.13, 0.14, beard, 0.2, 0.31, 0.7, 0.05); mx2.rotation.z = -0.2;
    const brow = box(head, 0.3, 0.09, 0.08, beard, -0.27, 0.93, 0.62, 0.03); brow.rotation.z = -0.12;
    const brow2 = box(head, 0.3, 0.09, 0.08, beard, 0.27, 0.93, 0.62, 0.03); brow2.rotation.z = 0.12;
    furHat(head, C.trim, C.gold);

    const staff = new THREE.Group();
    staff.position.set(1.72, 0.08, 0.34);
    staff.rotation.z = -0.04;
    root.add(staff);
    const shaft = cyl(staff, 0.05, 0.07, 4.5, mat('#8A5A2B', { rough: 0.8 }), 0, 2.25, 0, 10);
    shaft.castShadow = true;
    const star = new THREE.Mesh(starGeo(0.33, 0.14, 5, 0.1), mat('#F7D27A', { metal: 0.6, rough: 0.25, emissive: '#E6B45C', glow: 0.6 }));
    star.position.y = 4.62;
    star.castShadow = true;
    staff.add(star);
  }

  if (item.kind === 'sneg') {
    kokoshnik(head, C.gold, C.gold);
    braid(head, C.hair, '#C0172B');
    const ice = mat('#EAF9FF', { emissive: C.accent, glow: 0.5, rough: 0.25, metal: 0.2 });
    for (const y of [2.5, 2.9, 3.3]) {
      const b = new THREE.Mesh(starGeo(0.09, 0.04, 6, 0.03), mat(C.gold, { metal: 0.6, rough: 0.3 }));
      b.position.set(0, y, torsoD / 2 + 0.04);
      body.add(b);
    }
    const staff = new THREE.Group();
    staff.position.set(-1.72, 0.08, 0.34);
    staff.rotation.z = 0.04;
    root.add(staff);
    cyl(staff, 0.045, 0.06, 3.9, mat('#DDE7F2', { metal: 0.5, rough: 0.35 }), 0, 1.95, 0, 10);
    const crystal = new THREE.Mesh(cached('crystal', () => new THREE.OctahedronGeometry(0.3, 0)), ice);
    crystal.position.y = 4.12;
    crystal.scale.set(0.75, 1.8, 0.75);
    crystal.castShadow = true;
    staff.add(crystal);
    for (const [dx, dy, s] of [[-0.16, 3.62, 0.5], [0.18, 3.5, 0.4]]) {
      const shard = new THREE.Mesh(cached('crystal', () => new THREE.OctahedronGeometry(0.3, 0)), ice);
      shard.position.set(dx, dy, 0);
      shard.scale.set(s, s * 1.7, s);
      staff.add(shard);
    }
  }

  if (item.kind === 'rudolph' || item.kind === 'north') {
    const mCream = mat(C.trim, { rough: 0.9 });
    box(head, 0.64, 0.4, 0.28, mCream, 0, 0.36, 0.58, 0.08);
    const noseColor = item.kind === 'rudolph' ? C.accent : '#2A241E';
    const nose = mat(noseColor, { emissive: item.kind === 'rudolph' ? noseColor : '#000000', glow: item.kind === 'rudolph' ? 2.2 : 0, rough: 0.4 });
    sphere(head, 0.14, nose, 0, 0.38, 0.76, 12);

    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(cached('ear', () => new THREE.ConeGeometry(0.15, 0.38, 8)), mat(C.hair, { rough: 0.95 }));
      ear.position.set(side * 0.66, 0.78, 0);
      ear.rotation.z = side * -Math.PI / 2;
      ear.castShadow = true;
      head.add(ear);
    }

    addAntlers(head, mat(C.hair, { rough: 0.95 }), item.kind === 'north' ? 1.25 : 1, item.kind === 'north');

    if (C.belt) {
      box(body, torsoW + 0.06, 0.24, torsoD + 0.06, mat(C.belt), 0, hipY + 0.5, 0, 0.04);
    }
    for (const side of [-1, 1]) {
      const strap = box(body, 0.16, 1.5, 0.08, mat(C.belt), side * 0.52, hipY + 1.15, torsoD / 2 + 0.02, 0.03);
      strap.rotation.z = side * 0.42;
    }
    bells(body, torsoW, torsoD, hipY + 0.5);

    if (item.kind === 'north') {
      box(body, torsoW + 0.2, 1.05, torsoD + 0.16, mat(C.scarf || '#A5122A'), 0, hipY + 1.15, 0, 0.1);
      box(body, torsoW + 0.26, 0.14, torsoD + 0.2, mGold, 0, hipY + 0.66, 0, 0.04);
      const emblem = new THREE.Mesh(starGeo(0.19, 0.08, 6, 0.05), mGold);
      emblem.position.set(0, hipY + 1.2, torsoD / 2 + 0.1);
      body.add(emblem);
    }
    if (C.scarf) scarf(body, shoulderY, C.scarf, '#1F5C3A');
  }

  if (item.kind === 'elf') {
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(cached('elfear', () => new THREE.ConeGeometry(0.15, 0.42, 8)), mSkin);
      ear.position.set(side * 0.72, 0.68, 0);
      ear.rotation.z = side * -Math.PI / 2;
      ear.castShadow = true;
      head.add(ear);
    }

    const cap = new THREE.Group();
    cap.position.set(0.05, 1.16, 0);
    cap.rotation.z = -0.16;
    head.add(cap);
    const cone = new THREE.Mesh(cached('elfcap', () => new THREE.ConeGeometry(0.5, 1.0, 16)), mat(C.coat, { rough: 0.9 }));
    cone.position.y = 0.5;
    cone.castShadow = true;
    cap.add(cone);
    sphere(cap, 0.17, mat(C.trim, { rough: 0.95 }), 0, 1.0, 0, 12);
    box(cap, 1.06, 0.18, 1.06, mat(C.trim), 0, 0.02, 0, 0.06);

    for (const y of [2.48, 2.84, 3.2]) sphere(body, 0.06, mGold, 0, y, torsoD / 2 + 0.04, 8);

    const bag = new THREE.Group();
    bag.position.set(-1.22, 2.5, 0.5);
    bag.rotation.y = -0.2;
    body.add(bag);
    box(bag, 0.82, 0.72, 0.36, mat('#6B4326', { rough: 0.85 }), 0, 0, 0, 0.08);
    box(bag, 0.86, 0.3, 0.4, mat('#4A2D18', { rough: 0.85 }), 0, 0.22, 0, 0.05);
    box(body, 0.14, 2.4, 0.1, mat('#4A2D18'), -0.62, 3.15, 0.56, 0.03).rotation.z = 0.5;
    for (const [dx, dy, rz] of [[-0.18, 0.48, -0.12], [0.06, 0.52, 0.1], [0.26, 0.46, 0.24]]) {
      const letter = box(bag, 0.28, 0.34, 0.04, mat('#F4FAFF', { rough: 0.9 }), dx, dy, 0.02, 0.01);
      letter.rotation.z = rz;
    }
    if (C.scarf) scarf(body, shoulderY, C.scarf, '#1F5C3A');
  }

  /* посадка */
  if (pose === 'sit') {
    for (const leg of legs) leg.rotation.x = -Math.PI / 2;
    for (const arm of arms) arm.rotation.x = -1.15;
  }

  root.position.y = 0.02;
  root.userData = {
    head,
    armL: arms[0],
    armR: arms[1],
    legL: legs[0],
    legR: legs[1],
    baseY: 0.02,
    seated: pose === 'sit'
  };
  return root;
}

/* ---------- снеговик ---------- */
export function buildSnowman(item) {
  const root = new THREE.Group();
  const snow = mat('#F2F7FF', { rough: 0.98 });
  const coal = mat('#232A36', { rough: 0.5 });
  const orange = mat('#F97316', { rough: 0.7 });
  const red = mat('#C0172B', { rough: 0.9 });
  const silver = mat('#8FA3B8', { metal: 0.55, rough: 0.4 });

  sphere(root, 0.93, snow, 0, 0.95, 0, 24);
  sphere(root, 0.72, snow, 0, 2.34, 0, 24);
  sphere(root, 0.58, snow, 0, 3.57, 0, 24);

  for (const sx of [-1, 1]) sphere(root, 0.07, coal, sx * 0.19, 3.68, 0.5, 10);
  const nose = new THREE.Mesh(cached('carrot', () => new THREE.ConeGeometry(0.09, 0.5, 10)), orange);
  nose.position.set(0, 3.57, 0.62);
  nose.rotation.x = Math.PI / 2;
  nose.castShadow = true;
  root.add(nose);
  for (let i = -2; i <= 2; i++) sphere(root, 0.035, coal, i * 0.1, 3.45 - Math.abs(i) * 0.035, 0.5, 8);

  for (const y of [1.95, 2.3, 2.62]) sphere(root, 0.055, coal, 0, y, 0.63, 8);

  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.82, 2.42, 0);
    arm.rotation.z = side * -1.02;
    root.add(arm);
    twig(arm, 1.55, 0.055, 0.03, mat('#5B4632', { rough: 0.95 }));
    twig(arm, 0.5, 0.035, 0.02, mat('#5B4632', { rough: 0.95 }), 0, 0.7, 0, side * 0.6);
    twig(arm, 0.42, 0.03, 0.02, mat('#5B4632', { rough: 0.95 }), 0, 1.05, 0, side * -0.5);
    arms.push(arm);
  }

  const scarfMesh = new THREE.Mesh(cached('bigscarf', () => new THREE.TorusGeometry(0.63, 0.16, 8, 22)), red);
  scarfMesh.rotation.x = Math.PI / 2;
  scarfMesh.position.y = 2.98;
  scarfMesh.castShadow = true;
  root.add(scarfMesh);
  box(root, 0.3, 0.85, 0.14, red, 0.4, 2.6, 0.5, 0.05).rotation.z = 0.12;

  const bucket = new THREE.Group();
  bucket.position.set(0.02, 4.15, 0);
  bucket.rotation.z = 0.1;
  root.add(bucket);
  cyl(bucket, 0.5, 0.42, 0.48, silver, 0, 0, 0, 16);
  cyl(bucket, 0.53, 0.53, 0.06, silver, 0, 0.24, 0, 16);

  root.position.y = 0.02;
  root.userData = { head: null, armL: arms[0], armR: arms[1], legL: null, legR: null, baseY: 0.02, seated: false };
  return root;
}

/* ---------- четвероногий олень ---------- */
export function buildDeer(opts = {}) {
  const root = new THREE.Group();
  const fur = mat(opts.fur || '#6E6257', { rough: 0.95 });
  const cream = mat(opts.cream || '#D8CBB6', { rough: 0.95 });
  const dark = mat('#2A241E', { rough: 0.8 });
  const gold = mat('#E6B45C', { metal: 0.85, rough: 0.25 });
  const red = mat('#A5122A', { rough: 0.85 });

  box(root, 1.0, 1.05, 2.2, fur, 0, 2.05, 0, 0.2);

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      box(root, 0.36, 1.7, 0.4, fur, sx * 0.55, 0.95, sz * 0.72, 0.1);
      box(root, 0.4, 0.28, 0.44, dark, sx * 0.55, 0.14, sz * 0.72, 0.06);
    }
  }

  const neck = new THREE.Group();
  neck.position.set(0, 2.4, 0.92);
  neck.rotation.x = 0.52;
  root.add(neck);
  box(neck, 0.66, 1.15, 0.66, fur, 0, 0.45, 0, 0.14);

  const head = new THREE.Group();
  head.position.set(0, 1.12, 0);
  neck.add(head);
  box(head, 0.9, 0.74, 0.95, fur, 0, 0, 0, 0.14);
  box(head, 0.5, 0.34, 0.34, cream, 0, -0.06, 0.58, 0.08);
  sphere(head, 0.1, dark, 0, -0.04, 0.78, 10);
  if (opts.redNose) {
    sphere(head, 0.13, mat('#E33B2E', { emissive: '#E33B2E', glow: 2.2, rough: 0.4 }), 0, -0.04, 0.85, 14);
  }
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(cached('ear', () => new THREE.ConeGeometry(0.15, 0.38, 8)), fur);
    ear.position.set(side * 0.46, 0.32, 0);
    ear.rotation.z = side * -Math.PI / 2;
    ear.castShadow = true;
    head.add(ear);
  }
  addAntlers(head, fur, 1.15, true);

  box(neck, 0.74, 0.16, 0.74, red, 0, 0.16, 0, 0.04);
  for (const z of [-0.55, 0.55]) box(root, 1.06, 0.14, 0.18, gold, 0, 2.3, z, 0.03);
  spineBells(root, gold);

  const blanket = box(root, 0.95, 0.08, 1.1, red, 0, 2.61, -0.15, 0.03);
  box(root, 1.02, 0.1, 0.12, gold, 0, 2.61, -0.68, 0.03);

  const tail = new THREE.Mesh(cached('tail', () => new THREE.ConeGeometry(0.12, 0.4, 8)), fur);
  tail.position.set(0, 2.3, -1.16);
  tail.rotation.x = -Math.PI / 2;
  tail.castShadow = true;
  root.add(tail);

  root.userData = { head, neck, blanket, baseY: 0 };
  return root;
}

function spineBells(root, gold) {
  for (const x of [-0.4, 0, 0.4]) sphere(root, 0.07, gold, x, 2.32, 1.05, 8);
  for (const x of [-0.4, 0, 0.4]) sphere(root, 0.07, gold, x, 2.32, -0.7, 8);
}

/* ---------- сани ---------- */
export function buildSleigh() {
  const g = new THREE.Group();
  const wood = mat('#6D3A22', { rough: 0.8 });
  const woodDark = mat('#442315', { rough: 0.85 });
  const red = mat('#A5122A', { rough: 0.6 });
  const gold = mat('#E6B45C', { metal: 0.8, rough: 0.28 });
  const metal = mat('#9FB2C8', { metal: 0.9, rough: 0.22 });

  box(g, 2.6, 0.18, 4.2, wood, 0, 1.16, 0, 0.05);
  for (const sx of [-1, 1]) {
    box(g, 0.16, 1.0, 4.2, red, sx * 1.3, 1.72, 0, 0.05);
    box(g, 0.2, 0.1, 4.3, gold, sx * 1.3, 2.24, 0, 0.03);
    box(g, 0.16, 0.16, 4.8, metal, sx * 1.42, 0.3, 0.1, 0.03);
    const tip = box(g, 0.16, 0.16, 0.95, metal, sx * 1.42, 0.62, 2.62, 0.03);
    tip.rotation.x = -0.55;
    for (const z of [-1.3, 0, 1.3]) box(g, 0.14, 0.9, 0.14, metal, sx * 1.42, 0.8, z, 0.03);
    for (const z of [-1.4, 0, 1.4]) sphere(g, 0.09, gold, sx * 1.44, 2.32, z, 10);
  }

  box(g, 2.7, 1.5, 0.16, red, 0, 1.95, -2.05, 0.05);
  box(g, 2.76, 0.12, 0.2, gold, 0, 2.72, -2.05, 0.03);
  box(g, 2.6, 0.95, 0.16, red, 0, 1.7, 2.05, 0.05);
  box(g, 2.66, 0.12, 0.2, gold, 0, 2.2, 2.05, 0.03);

  box(g, 2.2, 0.22, 1.0, woodDark, 0, 1.62, -0.85, 0.05);
  box(g, 2.2, 0.95, 0.18, wood, 0, 2.2, -1.5, 0.05);
  box(g, 2.3, 0.1, 0.22, gold, 0, 2.68, -1.5, 0.03);

  const pole = cyl(g, 0.05, 0.06, 1.3, metal, -1.08, 2.92, 1.9, 10);
  pole.castShadow = true;
  cyl(g, 0.17, 0.17, 0.06, gold, -1.08, 3.86, 1.9, 12);
  cyl(g, 0.17, 0.17, 0.06, gold, -1.08, 3.56, 1.9, 12);
  const glass = sphere(g, 0.2, mat('#FFD79A', { emissive: '#FFC978', glow: 2.8, rough: 0.2 }), -1.08, 3.71, 1.9, 16);
  glass.castShadow = false;
  const light = new THREE.PointLight('#ffc879', 26, 14, 2);
  light.position.copy(glass.position);
  g.add(light);

  const flake = new THREE.Mesh(starGeo(0.24, 0.1, 6, 0.06), gold);
  flake.position.set(0, 2.25, -2.14);
  flake.rotation.y = Math.PI;
  g.add(flake);

  gift(g, -0.55, 1.4, 0.45, 0.5, '#1F5C3A', '#E6B45C');
  gift(g, 0.35, 1.35, 1.1, 0.4, '#C0172B', '#F7F3EA');
  gift(g, 0.62, 1.5, 0.1, 0.55, '#E6B45C', '#C0172B');

  g.userData = { lantern: light, seat: new THREE.Vector3(0, 1.75, -0.85) };
  return g;
}

function gift(parent, x, y, z, s, bodyColor, ribbonColor) {
  const b = mat(bodyColor, { rough: 0.6 });
  const r = mat(ribbonColor, { metal: 0.4, rough: 0.35 });
  box(parent, s, s, s, b, x, y, z, 0.03);
  box(parent, s + 0.02, s + 0.02, 0.07, r, x, y, z, 0.01);
  box(parent, 0.07, s + 0.02, s + 0.02, r, x, y, z, 0.01);
}

/* ---------- ёлка ---------- */
export function buildTree(scale = 1) {
  const g = new THREE.Group();
  const trunk = mat('#4A3222', { rough: 0.9 });
  const green = mat('#1F5C3A', { rough: 0.9 });
  const snow = mat('#EAF3FF', { rough: 1 });

  cyl(g, 0.18, 0.24, 1.2, trunk, 0, 0.6, 0, 8);

  const tiers = [[1.55, 2.0, 1.35], [1.2, 1.65, 2.35], [0.85, 1.3, 3.15]];
  for (const [r, h, y] of tiers) {
    const cone = new THREE.Mesh(cached(`cone|${r}|${h}`, () => new THREE.ConeGeometry(r, h, 10)), green);
    cone.position.y = y;
    cone.castShadow = true;
    cone.receiveShadow = true;
    g.add(cone);
    const cap = new THREE.Mesh(cached(`cap|${r}`, () => new THREE.ConeGeometry(r * 1.02, h * 0.18, 10)), snow);
    cap.position.y = y + h / 2 - h * 0.09;
    cap.castShadow = true;
    g.add(cap);
  }

  g.scale.setScalar(scale);
  return g;
}
