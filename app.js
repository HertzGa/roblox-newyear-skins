/* Сцена и интерфейс пака: витрина, снег, переключение скинов. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SKINS, SLEIGH, ITEMS } from './data.js';
import { buildAvatar, buildSnowman, buildSleigh, buildDeer, buildTree } from './models.js';

const canvas = document.getElementById('scene');
const fallback = document.getElementById('fallback');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (err) {
  fallback.hidden = false;
  console.error(err);
  throw err;
}
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#050a15');
scene.fog = new THREE.FogExp2('#050a15', 0.026);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 140);
camera.position.set(8.4, 4.6, 11.4);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 6;
controls.maxDistance = 34;
controls.maxPolarAngle = 1.52;
controls.minPolarAngle = 0.35;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.45;
controls.target.set(0, 2.7, 0);
controls.update();

/* ---------- свет ---------- */
scene.add(new THREE.HemisphereLight('#9fc4ff', '#26324a', 0.85));

const key = new THREE.DirectionalLight('#ffe6c0', 2.6);
key.position.set(6.5, 9, 7);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -9;
key.shadow.camera.right = 9;
key.shadow.camera.top = 10;
key.shadow.camera.bottom = -5;
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 40;
key.shadow.bias = -0.0003;
key.shadow.normalBias = 0.02;
scene.add(key);
scene.add(key.target);

const rim = new THREE.DirectionalLight('#8fc4ff', 1.9);
rim.position.set(-7, 5.5, -6);
scene.add(rim);

const warm = new THREE.PointLight('#ffb877', 35, 22, 2);
warm.position.set(-5, 2.2, 5);
scene.add(warm);

/* ---------- текстуры-спрайты ---------- */
function dotTexture(soft = false) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(soft ? 0.18 : 0.45, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const dot = dotTexture(false);
const glow = dotTexture(true);

/* ---------- земля ---------- */
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(60, 64),
  new THREE.MeshStandardMaterial({ color: '#dde8f7', roughness: 1, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const stageDisc = new THREE.Mesh(
  new THREE.CircleGeometry(6.6, 64),
  new THREE.MeshStandardMaterial({
    color: '#f1f7ff', roughness: 1, transparent: true, opacity: 0.6, depthWrite: false,
    map: (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(128, 128, 30, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.72, 'rgba(255,255,255,0.55)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })()
  })
);
stageDisc.rotation.x = -Math.PI / 2;
stageDisc.position.y = 0.012;
stageDisc.receiveShadow = true;
scene.add(stageDisc);

/* сугробы */
const driftMat = new THREE.MeshStandardMaterial({ color: '#f4f9ff', roughness: 1 });
for (let i = 0; i < 9; i++) {
  const r = 1.6 + Math.random() * 2.4;
  const drift = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), driftMat);
  const a = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
  const rad = 8 + Math.random() * 4;
  drift.position.set(Math.cos(a) * rad, -r * 0.72, Math.sin(a) * rad);
  drift.scale.y = 0.28;
  drift.receiveShadow = true;
  scene.add(drift);
}

/* ёлки */
const treeSpots = [[-9, -5, 1.25], [-12.5, 1, 1.05], [-7.5, -10, 1.1], [10, -8, 1.2], [11, 3, 0.95]];
for (const [x, z, s] of treeSpots) {
  const tree = buildTree(s);
  tree.position.set(x, 0, z);
  tree.rotation.y = Math.random() * Math.PI;
  scene.add(tree);
}

/* ---------- небо: луна и звёзды ---------- */
const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glow, color: '#ffe9b8', transparent: true, opacity: 0.75,
  depthWrite: false, blending: THREE.AdditiveBlending, fog: false
}));
moonGlow.scale.set(18, 18, 1);
moonGlow.position.set(-18, 12, -26);
scene.add(moonGlow);

const moonCore = new THREE.Sprite(new THREE.SpriteMaterial({
  map: dot, color: '#fff6dc', transparent: true, depthWrite: false, fog: false
}));
moonCore.scale.set(4.4, 4.4, 1);
moonCore.position.copy(moonGlow.position);
scene.add(moonCore);

const starCount = 700;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 42 + Math.random() * 34;
  const a = Math.random() * Math.PI * 2;
  const y = 4 + Math.random() * 34;
  starPos[i * 3] = Math.cos(a) * r;
  starPos[i * 3 + 1] = y;
  starPos[i * 3 + 2] = Math.sin(a) * r;
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
  color: '#cfe4ff', size: 0.5, map: dot, transparent: true, opacity: 0.85,
  depthWrite: false, blending: THREE.AdditiveBlending, fog: false
}));
scene.add(stars);

/* ---------- снег ---------- */
const snowCount = window.innerWidth < 980 ? 900 : 1500;
const snowPos = new Float32Array(snowCount * 3);
const snowSpeed = new Float32Array(snowCount);
const snowSwing = new Float32Array(snowCount);
for (let i = 0; i < snowCount; i++) {
  snowPos[i * 3] = (Math.random() - 0.5) * 30;
  snowPos[i * 3 + 1] = Math.random() * 17;
  snowPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  snowSpeed[i] = 0.35 + Math.random() * 0.9;
  snowSwing[i] = Math.random() * Math.PI * 2;
}
const snowGeo = new THREE.BufferGeometry();
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({
  color: '#ffffff', size: 0.13, map: dot, transparent: true, opacity: 0.9,
  depthWrite: false, sizeAttenuation: true
}));
scene.add(snow);

/* ---------- сцена пака ---------- */
const stage = new THREE.Group();
scene.add(stage);

const leather = new THREE.MeshStandardMaterial({ color: '#3a2a20', roughness: 0.85 });
let current = null;

function clearStage() {
  while (stage.children.length) stage.remove(stage.children[0]);
  current = null;
}

const VIEW_DIR = new THREE.Vector3(0.62, 0.36, 0.78).normalize();
const FOV = THREE.MathUtils.degToRad(38);

function frameItem(root, item) {
  root.updateWorldMatrix(true, true);
  const bb = new THREE.Box3().setFromObject(root);
  const size = bb.getSize(new THREE.Vector3());
  const center = bb.getCenter(new THREE.Vector3());
  const mobile = window.innerWidth < 980;
  const aspect = Math.max(window.innerWidth / Math.max(window.innerHeight, 1), 0.42);
  const half = Math.tan(FOV / 2);
  const width = item.kind === 'sleigh' ? Math.max(size.x, size.z) : Math.max(size.x, size.z * 0.8);
  const distH = (size.y / 2) / half;
  const distW = (width / 2) / (half * aspect);
  const margin = mobile
    ? (item.kind === 'sleigh' ? 1.32 : 1.4)
    : (item.kind === 'sleigh' ? 1.48 : 1.42);
  const dist = Math.max(distH, distW, 6.5) * margin;
  const target = center.clone();
  if (mobile) target.y += size.y * (item.kind === 'sleigh' ? 0.34 : 0.22);
  else if (item.kind === 'sleigh') target.x -= 1.7;
  controls.target.copy(target);
  camera.position.copy(target).addScaledVector(VIEW_DIR, dist);
  controls.minDistance = dist * 0.55;
  controls.maxDistance = dist * 2.1;
  controls.update();
}

function showItem(index) {
  const item = ITEMS[index];
  if (!item) return;
  clearStage();

  if (item.kind === 'sleigh') {
    const root = new THREE.Group();
    const sleigh = buildSleigh();
    root.add(sleigh);

    const driver = buildAvatar(SKINS[0], 'sit');
    driver.position.set(0, sleigh.userData.seat.y - 2.05, sleigh.userData.seat.z);
    sleigh.add(driver);

    const deerA = buildDeer({ redNose: true, fur: '#6E6257' });
    deerA.position.set(-1.0, 0, 4.25);
    deerA.rotation.y = 0.04;
    deerA.scale.setScalar(0.82);
    const deerB = buildDeer({ fur: '#7A4A2B', cream: '#EFE3CB' });
    deerB.position.set(1.0, 0, 4.25);
    deerB.rotation.y = -0.05;
    deerB.scale.setScalar(0.82);
    root.add(deerA, deerB);

    for (const x of [-1.0, 1.0]) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x * 0.15, 2.08, 2.12),
        new THREE.Vector3(x * 0.5, 2.1, 3.2),
        new THREE.Vector3(x * 0.95, 2.0, 3.8)
      ]);
      const rein = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.035, 6, false), leather);
      rein.castShadow = true;
      root.add(rein);
    }

    stage.add(root);
    current = { item, root, sleigh, driver, deer: [deerA, deerB], kind: 'sleigh' };
  } else {
    const root = item.kind === 'snowman' ? buildSnowman(item) : buildAvatar(item, 'stand');
    root.scale.setScalar(item.size || 1);
    root.rotation.y = 0.08;
    stage.add(root);
    current = { item, root, kind: 'skin' };
  }

  frameItem(stage.children[0], item);

  document.querySelectorAll('.chip').forEach((b, i) => {
    const active = i === index;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderCard(item);
  if (history.replaceState) history.replaceState(null, '', '#' + item.id);
}

/* ---------- анимация ---------- */
const clock = new THREE.Clock();
let snowOn = true;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  if (snowOn) {
    const pos = snow.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - dt * snowSpeed[i];
      let x = pos.getX(i) + Math.sin(t * 0.6 + snowSwing[i]) * dt * 0.35;
      if (y < 0) { y = 17; x = (Math.random() - 0.5) * 30; }
      if (x > 15) x = -15;
      if (x < -15) x = 15;
      pos.setX(i, x);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  }

  if (current && current.kind === 'skin') {
    const u = current.root.userData;
    current.root.position.y = u.baseY + Math.sin(t * 1.6) * 0.035;
    if (u.head) u.head.rotation.y = Math.sin(t * 0.7) * 0.16;
    if (u.armL && !u.seated) u.armL.rotation.x = Math.sin(t * 1.5) * 0.05;
    if (u.armR && !u.seated) u.armR.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.05;
    if (u.armL && u.head === null) u.armL.rotation.x = Math.sin(t * 1.3) * 0.05;
    if (u.armR && u.head === null) u.armR.rotation.x = Math.sin(t * 1.3 + Math.PI) * 0.05;
  }

  if (current && current.kind === 'sleigh') {
    const { sleigh, driver, deer } = current;
    const lantern = sleigh.userData.lantern;
    if (lantern) lantern.intensity = 23 + Math.sin(t * 7) * 2.2 + Math.sin(t * 17) * 0.9;
    if (driver) {
      driver.position.y = sleigh.userData.seat.y - 2.05 + Math.sin(t * 1.4) * 0.02;
      driver.userData.head.rotation.y = Math.sin(t * 0.6) * 0.12;
    }
    deer.forEach((d, i) => {
      if (d.userData.head) d.userData.head.rotation.x = Math.sin(t * 1.1 + i * 1.7) * 0.07;
      if (d.userData.neck) d.userData.neck.rotation.x = 0.52 + Math.sin(t * 0.9 + i) * 0.03;
      d.position.y = Math.sin(t * 1.2 + i) * 0.02;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

/* ---------- resize ---------- */
let wasMobile = window.innerWidth < 980;
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  const mobile = w < 980;
  if (mobile !== wasMobile) {
    wasMobile = mobile;
    if (current) showItem(ITEMS.indexOf(current.item));
  }
});

/* ---------- интерфейс ---------- */
const card = document.getElementById('card');
const chips = document.getElementById('chips');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const toastEl = document.getElementById('toast');
let toastTimer = 0;

function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Скопировано');
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('Скопировано'); } catch (e) { toast('Не удалось скопировать'); }
    ta.remove();
  }
}

function renderCard(item) {
  const swatches = item.palette.map(([name, hex]) =>
    `<button class="sw" type="button" data-hex="${hex}" title="${name} · ${hex}">
       <i style="background:${hex}"></i><span>${name}</span><b>${hex}</b>
     </button>`
  ).join('');

  card.innerHTML = `
    <div class="eyebrow">${item.eyebrow} · ${item.role}</div>
    <h1>${item.name}</h1>
    <p class="desc">${item.desc}</p>
    <div class="palette">${swatches}</div>
    <div class="meta">
      <div><span>Тело</span><b>${item.avatar}</b></div>
      <div><span>Анимация</span><b>${item.animation}</b></div>
      <div><span>Бюджет</span><b>${item.budget}</b></div>
    </div>
    <div class="tags">${item.tags.map((t) => `<span>${t}</span>`).join('')}</div>
  `;

  card.querySelectorAll('.sw').forEach((btn) => {
    btn.addEventListener('click', () => {
      copyText(btn.dataset.hex);
    });
  });
}

chips.innerHTML = ITEMS.map((item, i) => `
  <button class="chip" type="button" data-index="${i}" aria-pressed="false">
    <i style="background:${item.palette[0][1]}"></i><span>${item.name}</span>
  </button>
`).join('');

chips.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  showItem(Number(btn.dataset.index));
});

function openModal() {
  if (!current) return;
  const item = current.item;
  const search = item.search.map((s) => `<code>${s}</code>`).join('');
  const steps = item.kind === 'sleigh'
    ? `<li>Открой Roblox Studio → новый Baseplate.</li>
       <li>View → Command Bar, вставь содержимое <b>sleigh-build.lua</b> из этой папки и нажми Enter.</li>
       <li>Модель <b>NewYearSleigh</b> появится в Workspace: кузов, полозья, сиденье, фонарь и бубенцы.</li>
       <li>Посади персонажа на Seat или двигай сани через <code>Model:PivotTo()</code>.</li>
       <li>Оленей собери из тех же примитивов — пропорции и цвета есть в README.</li>`
    : `<li>Avatar Editor → <b>Body</b>: Body Type 0–20, Height 100%, Width ${item.avatar.match(/ширина (\d+)%/)?.[1] || 0}%, Head 100%, Proportion 0%.</li>
       <li>Одежда: подбери вещи по цветам из палитры — палитра кликабельна, каждый цвет копируется.</li>
       <li>Marketplace: ищи по запросам ниже (английский работает лучше), фильтр — Community Creations.</li>
       <li>Надень аксессуары в порядке: тело → одежда → шапка/рога → лицо → спина → посох.</li>
       <li>Анимация: <b>${item.animation}</b>. Сохрани образ и проверь в игре при дневном и ночном свете.</li>`;

  modalBody.innerHTML = `
    <h2>${item.name}</h2>
    <p class="modal-sub">${item.role} · ${item.budget} бюджет</p>
    <p class="modal-desc">${item.desc}</p>
    <ol>${steps}</ol>
    <h3>Поисковые запросы</h3>
    <div class="codes">${search}</div>
    <p class="modal-note">ID предметов не указаны специально: каталог Roblox меняется каждую неделю, а копии с похожими названиями могут быть чужими. Смотри на автора и дату публикации.</p>
    <div class="modal-actions">
      <button type="button" class="btn primary" id="copySearch">Скопировать запросы</button>
      <a class="btn" href="skins.json" download>Скачать skins.json</a>
    </div>
  `;
  document.getElementById('copySearch').addEventListener('click', () => copyText(item.search.join('\n')));
  modal.showModal();
}

document.getElementById('how').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});

document.getElementById('spin').addEventListener('click', (e) => {
  controls.autoRotate = !controls.autoRotate;
  e.currentTarget.classList.toggle('is-on', controls.autoRotate);
  e.currentTarget.setAttribute('aria-pressed', controls.autoRotate ? 'true' : 'false');
});

document.getElementById('snowbtn').addEventListener('click', (e) => {
  snowOn = !snowOn;
  snow.visible = snowOn;
  e.currentTarget.classList.toggle('is-on', snowOn);
  e.currentTarget.setAttribute('aria-pressed', snowOn ? 'true' : 'false');
});

window.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  if (modal.open) return;
  const i = ITEMS.indexOf(current.item);
  const next = (i + (e.key === 'ArrowRight' ? 1 : ITEMS.length - 1)) % ITEMS.length;
  showItem(next);
});

const hashItem = ITEMS.find((x) => '#' + x.id === location.hash);
showItem(hashItem ? ITEMS.indexOf(hashItem) : 0);
document.getElementById('loading').hidden = true;
animate();

/* отладочный доступ к сцене — не влияет на работу страницы */
window.__pack = {
  scene,
  camera,
  controls,
  ITEMS,
  showItem,
  get current() { return current; }
};

window.addEventListener('hashchange', () => {
  const item = ITEMS.find((x) => '#' + x.id === location.hash);
  if (item && current && current.item !== item) showItem(ITEMS.indexOf(item));
});
