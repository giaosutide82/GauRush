// Add the public GitHub Releases asset URL here when the release goes live.
const releaseUrl = "https://github.com/giaosutide82/GauRush/releases/download/v0.29.0/GauRush.Setup.0.29.0.exe";
const installer = document.querySelector("#installer-link");
if (releaseUrl) {
  installer.href = releaseUrl;
} else if (!["file:", "http:"].includes(location.protocol) || (location.protocol === "http:" && !["localhost", "127.0.0.1"].includes(location.hostname))) {
  installer.removeAttribute("href");
  installer.setAttribute("aria-disabled", "true");
  installer.textContent = "Download pending";
  document.querySelector("#download-status").textContent = "The public release link has not been added yet.";
}

const features = [
  {
    heading: "Inspect every frame.",
    description: "Scrub the timeline and inspect a capture from different angles. Open PLY, SPLAT, and KSPLAT files or add multiple captures to a scene.",
    poster: "view.jpg",
    video: "view.webm",
    label: "GauRush viewport with a sample splat sequence and playback timeline",
  },
  {
    heading: "Add a crop box to a sequence.",
    description: "Add a fixed crop box while the capture plays. Toggle Preview to see how the same box affects each frame.",
    poster: "crop.jpg",
    video: "crop.webm",
    label: "GauRush demo adding a fixed crop box to a playing splat sequence",
  },
  {
    heading: "Remove stray splats with a lasso.",
    description: "Draw around unwanted splats in the viewport and delete the selection from the current frame.",
    poster: "lasso.jpg",
    video: "lasso.webm",
    label: "GauRush lasso cleanup demo showing a selection and deletion",
  },
  {
    heading: "Make the crop follow the action.",
    description: "Keyframe crop position, rotation, and size. Adjust the timing in the timeline and choose how poses interpolate between keys.",
    poster: "animate.jpg",
    video: "animate.webm",
    label: "GauRush timeline showing selected crop keyframes",
  },
];
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.querySelector("#workspace-panel");
const demo = document.querySelector("#workspace-demo");
let demoVisible = false;
function playVisibleDemo() {
  if (demoVisible && !reducedMotion.matches) demo.play().catch(() => {});
}
const demoVisibility = new IntersectionObserver(([entry]) => {
  demoVisible = entry.isIntersecting && entry.intersectionRatio >= .35;
  if (demoVisible) playVisibleDemo();
  else demo.pause();
}, { threshold: .35 });
demoVisibility.observe(demo);
function selectFeature(index) {
  const feature = features[index];
  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", tabs[index].id);
  panel.querySelector("h3").textContent = feature.heading;
  panel.querySelector("p").textContent = feature.description;
  if (demo.getAttribute("src") === "assets/" + feature.video) return;
  demo.poster = "assets/" + feature.poster;
  demo.src = "assets/" + feature.video;
  demo.setAttribute("aria-label", feature.label);
  playVisibleDemo();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectFeature(index));
  tab.addEventListener("keydown", event => {
    const positions = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in positions)) return;
    event.preventDefault();
    const next = (positions[event.key] + tabs.length) % tabs.length;
    selectFeature(next);
    tabs[next].focus();
  });
});

const canvas = document.querySelector("#splat-art");
const ctx = canvas.getContext("2d");
let seed = 10517;
function random() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
}
const turn = Math.PI * 2;
const points = Array.from({ length: 8000 }, () => {
  const u = random() * turn;
  const v = random() * turn;
  const radius = 1 + .34 * Math.cos(v) + .08 * Math.sin(3 * u + v);
  const x = radius * Math.cos(u);
  const y = radius * Math.sin(u);
  const z = .34 * Math.sin(v);
  const tiltY = .52 * y - .854 * z;
  const depth = .854 * y + .52 * z;
  return {
    x: .824 * x + .566 * tiltY, y: -.566 * x + .824 * tiltY,
    depth, size: .35 + 1.35 * random() ** 2, light: random(), offsetX: 0, offsetY: 0,
  };
}).sort((a, b) => a.depth - b.depth);

const hero = document.querySelector(".hero");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) demo.pause();
  else playVisibleDemo();
});
let width = 0;
let height = 0;
let pointer = null;
let animationFrame = 0;
let lastFrame = 0;
let sceneScroll = scrollY;


const sceneStops = [
  { x: .73, y: .49, zoom: 1, yaw: 0, pitch: 0, roll: 0, exposure: 1 },
  { x: .18, y: .29, zoom: 1.23, yaw: .76, pitch: -.16, roll: -.10, exposure: .49 },
  { x: .83, y: .57, zoom: 1.05, yaw: 1.55, pitch: .13, roll: .08, exposure: .34 },
  { x: .68, y: .37, zoom: 1.32, yaw: 2.16, pitch: -.07, roll: .17, exposure: .58 },
];
const chapterSections = ["workspace", "features", "download"].map(id => document.getElementById(id));
const mix = (a, b, t) => a + (b - a) * t;

function sceneMetrics() {
  const mobile = innerWidth <= 650;
  const stationary = reducedMotion.matches;
  const top = sceneScroll;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const stops = [
    0,
    ...chapterSections.slice(0, 2).map(section => section.getBoundingClientRect().top + scrollY - innerHeight * .40),
    maxScroll,
  ];
  let segment = 0;
  while (segment < sceneStops.length - 2 && top > stops[segment + 1]) segment++;
  const raw = stationary ? 0 : Math.max(0, Math.min(1, (top - stops[segment]) / Math.max(1, stops[segment + 1] - stops[segment])));
  const t = raw * raw * (3 - 2 * raw);
  const from = stationary ? sceneStops[0] : sceneStops[segment];
  const to = sceneStops[segment + 1];
  const sample = key => mix(from[key], to[key], t);
  const pass = Math.sin(Math.PI * t) ** 2;
  const stage = stationary ? 0 : segment + t;
  const scale = Math.min(width * (mobile ? .30 : .195), height * .46);
  return {
    centerX: width * (mobile ? mix(.51, sample("x"), .44) : sample("x")),
    centerY: height * (mobile ? mix(.74, sample("y"), Math.min(.85, stage)) : sample("y")),
    scale: scale * (sample("zoom") + pass * .14),
    angle: sample("yaw"),
    pitch: sample("pitch"),
    roll: sample("roll"),
    exposure: sample("exposure"),
  };
}

function drawFloor(scene) {
  const horizon = height * .61 + scene.pitch * height * .2;
  const vanishingX = scene.centerX;
  ctx.globalAlpha = scene.exposure;
  const shade = ctx.createLinearGradient(0, horizon, 0, height);
  shade.addColorStop(0, "rgba(110,192,200,.01)");
  shade.addColorStop(.68, "rgba(110,192,200,.24)");
  shade.addColorStop(1, "rgba(110,192,200,.05)");
  ctx.strokeStyle = shade;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = -12; i <= 12; i++) {
    ctx.moveTo(vanishingX + i * 5, horizon);
    ctx.lineTo(vanishingX + i * width * .12, height);
  }
  for (let i = 1; i <= 13; i++) {
    const y = horizon + (height - horizon) * (i / 13) ** 2.5;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawSplatArt(blend = 1) {
  ctx.clearRect(0, 0, width, height);
  const scene = sceneMetrics();
  drawFloor(scene);
  const { centerX, centerY, scale, angle, pitch, roll, exposure } = scene;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const cosPitch = Math.cos(pitch), sinPitch = Math.sin(pitch);
  const cosRoll = Math.cos(roll), sinRoll = Math.sin(roll);
  const dotScale = Math.min(1.2, scale / 115);
  const radius = Math.max(48, Math.min(105, width * .17));
  let moving = false;
  for (const point of points) {
    const side = point.x * cos + point.depth * sin;
    const yawDepth = point.depth * cos - point.x * sin;
    const vertical = point.y * cosPitch - yawDepth * sinPitch;
    const depth = yawDepth * cosPitch + point.y * sinPitch;
    const perspective = 1 / (1.07 - depth * .16);
    const x = centerX + (side * cosRoll - vertical * sinRoll) * scale * perspective;
    const y = centerY + (side * sinRoll + vertical * cosRoll) * scale * perspective;
    let dx = 0, dy = 0;
    if (pointer) {
      const awayX = x - pointer.x, awayY = y - pointer.y;
      const distance = Math.hypot(awayX, awayY);
      if (distance < radius) {
        const force = radius * .58 * (1 - distance / radius) ** 2;
        if (distance > .001) {
          dx = awayX * (force / distance);
          dy = awayY * (force / distance);
        } else {
          dx = Math.cos(point.light * turn) * force;
          dy = Math.sin(point.light * turn) * force;
        }
      }
    }
    point.offsetX += (dx - point.offsetX) * blend;
    point.offsetY += (dy - point.offsetY) * blend;
    if (Math.abs(dx - point.offsetX) + Math.abs(dy - point.offsetY) > .03) {
      moving = true;
    } else {
      point.offsetX = dx;
      point.offsetY = dy;
    }
    const light = Math.max(0, Math.min(1, (depth + 1.5) / 3));
    ctx.fillStyle = point.light > .9 ? "#d3ffe7" : light > .62 ? "#9ce9d8" : "#5ac0c3";
    ctx.globalAlpha = exposure * (.14 + light * .76) * (.48 + point.light * .52);
    ctx.beginPath();
    ctx.arc(x + point.offsetX, y + point.offsetY, point.size * dotScale, 0, turn);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return moving;
}

function resizeSplatArt() {
  ({ width, height } = canvas.getBoundingClientRect());
  const dpi = Math.min(2, devicePixelRatio);
  canvas.width = Math.round(width * dpi);
  canvas.height = Math.round(height * dpi);
  ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
  drawSplatArt();
}

function animateSplatArt(now) {
  animationFrame = 0;
  const dt = Math.max(1, Math.min(64, now - lastFrame));
  lastFrame = now;
  // Let the camera catch up gradually after a wheel step or an anchor jump.
  const scrollTarget = scrollY;
  sceneScroll += (scrollTarget - sceneScroll) * (1 - Math.exp(-dt / 310));
  const cameraMoving = Math.abs(scrollTarget - sceneScroll) > .35;
  if (!cameraMoving) sceneScroll = scrollTarget;

  const particleBlend = 1 - Math.exp(-dt / (pointer ? 175 : 240));
  const particlesMoving = drawSplatArt(particleBlend);
  if (cameraMoving || particlesMoving) animationFrame = requestAnimationFrame(animateSplatArt);
}

function requestParticleMotion() {
  if (animationFrame) return;
  lastFrame = performance.now();
  animationFrame = requestAnimationFrame(animateSplatArt);
}

if (ctx) {
  resizeSplatArt();
  new ResizeObserver(resizeSplatArt).observe(canvas);
  hero.addEventListener("pointermove", event => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    requestParticleMotion();
  });
  hero.addEventListener("pointerleave", () => {
    pointer = null;
    if (!reducedMotion.matches) requestParticleMotion();
  });
  reducedMotion.addEventListener("change", () => {
    sceneScroll = scrollY;
    if (!reducedMotion.matches) {
      drawSplatArt();
      return;
    }
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    pointer = null;
    drawSplatArt();
  });
}


const pageSections = [...document.querySelectorAll("main section[id]")];
const sectionLinks = [...document.querySelectorAll(".site-header nav a")];
const scrollProgress = document.querySelector(".scroll-progress");
const chapterHeadings = [...document.querySelectorAll(".section-head, .feature-catalog > h2")];
const reveal = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    reveal.unobserve(entry.target);
    if (reducedMotion.matches) continue;
    entry.target.animate(
      [{ opacity: .18, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 460, easing: "cubic-bezier(.2,.75,.25,1)" },
    );
  }
}, { threshold: .12 });

for (const item of document.querySelectorAll(".workbench, .feature-grid article, .download-card, .download-meta")) {
  reveal.observe(item);
}

function updateScrollPosition() {
  for (const heading of chapterHeadings) {
    const enter = 1 - (heading.getBoundingClientRect().top - innerHeight * .45) / (innerHeight * .42);
    heading.style.setProperty("--chapter-enter", Math.max(0, Math.min(1, enter)));
  }
  const viewport = document.documentElement;
  const total = Math.max(1, viewport.scrollHeight - innerHeight);
  scrollProgress.style.transform = `scaleX(${Math.min(1, scrollY / total)})`;
  const anchor = Math.min(innerHeight * .42, 320);
  const atEnd = scrollY > 0 && scrollY >= total - 2;
  const section = atEnd ? pageSections.at(-1) : pageSections.findLast(item => item.getBoundingClientRect().top <= anchor);
  for (const link of sectionLinks) {
    if (section && link.hash === "#" + section.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

let scrollFrame = 0;
function queueScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updateScrollPosition();
    if (ctx && !reducedMotion.matches) requestParticleMotion();
  });
}
window.addEventListener("scroll", queueScrollUpdate, { passive: true });
window.addEventListener("resize", queueScrollUpdate);
updateScrollPosition();
