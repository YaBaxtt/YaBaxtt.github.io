/*
  ПЕРЕД ПУБЛИКАЦИЕЙ: замени три ссылки ниже на свои настоящие профили.
  Пример: github: "https://github.com/pach"
*/
const profileLinks = {
  github: "https://github.com/YaBaxtt",
  channel: "https://t.me/",
  telegram: "https://t.me/",
};

document.querySelectorAll("[data-profile-link]").forEach((link) => {
  const key = link.dataset.profileLink;
  link.href = profileLinks[key];
});

document.getElementById("year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.classList.toggle("active", open);
  menuButton.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.classList.remove("active");
  menuButton?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  const dataCanvas = document.getElementById("data-field");
  const starCanvas = document.getElementById("star-field");
  const dataCtx = dataCanvas.getContext("2d");
  const starCtx = starCanvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let clock = 0;
  let mobile = window.matchMedia("(max-width: 780px)").matches;
  const pointer = { x: 0, y: 0, px: 0, py: 0, initialized: false };
  const trail = [];

  function resizeCanvases() {
    width = window.innerWidth;
    height = window.innerHeight;
    [dataCanvas, starCanvas].forEach((canvas) => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    });
    dataCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pointer.x = width * .7;
    pointer.y = height * .58;
  }

  function drawDataField(t) {
    dataCtx.clearRect(0, 0, width, height);
    const gap = mobile ? 54 : 78;
    dataCtx.lineWidth = 1;
    for (let x = gap * .5; x < width; x += gap) {
      const shift = Math.sin(t * .00035 + x) * 8;
      dataCtx.strokeStyle = "rgba(139,221,208,0.045)";
      dataCtx.beginPath();
      dataCtx.moveTo(x + shift, 0);
      dataCtx.lineTo(x - shift, height);
      dataCtx.stroke();
    }
    for (let y = gap * .5; y < height; y += gap) {
      dataCtx.strokeStyle = "rgba(233,236,229,0.026)";
      dataCtx.beginPath();
      dataCtx.moveTo(0, y);
      dataCtx.lineTo(width, y + Math.sin(t * .00045 + y) * 4);
      dataCtx.stroke();
    }
    const dots = mobile ? 9 : 15;
    for (let i = 0; i < dots; i++) {
      const x = ((i * 173 + 21) % width) + Math.sin(t * .00022 + i) * 20;
      const y = ((i * 269 + 79) % height) + Math.cos(t * .00019 + i) * 16;
      const pulse = .3 + (Math.sin(t * .001 + i * 2) + 1) * .22;
      dataCtx.fillStyle = `rgba(215,245,111,${pulse})`;
      dataCtx.fillRect(x, y, 1.2, 1.2);
    }

    const fragments = [
      ["SELECT * FROM tasks", .07, .19],
      ["async def service()", .72, .16],
      ["cache.hit = true", .08, .78],
      ["POST /api/v1", .76, .73],
      ["Σ requests / min", .49, .87],
      ["latency < 30ms", .72, .48],
    ];
    const amount = mobile ? 3 : fragments.length;
    dataCtx.font = `${mobile ? 8 : 9}px "DM Mono", monospace`;
    dataCtx.letterSpacing = "0";
    fragments.slice(0, amount).forEach(([text, x, y], index) => {
      const drift = Math.sin(t * .00025 + index * 1.8) * 5;
      dataCtx.fillStyle = index % 2 ? "rgba(139,221,208,.13)" : "rgba(215,245,111,.11)";
      dataCtx.fillText(text, width * x + drift, height * y);
    });
  }

  function star(x, y, outer, inner, rotation, opacity) {
    starCtx.save();
    starCtx.translate(x, y);
    starCtx.rotate(rotation);
    starCtx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 4) * i - Math.PI / 2;
      const sx = Math.cos(a) * r;
      const sy = Math.sin(a) * r;
      i ? starCtx.lineTo(sx, sy) : starCtx.moveTo(sx, sy);
    }
    starCtx.closePath();
    starCtx.fillStyle = `rgba(215,245,111,${opacity})`;
    starCtx.shadowColor = "#d7f56f";
    starCtx.shadowBlur = outer * 1.4;
    starCtx.fill();
    starCtx.restore();
  }

  function drawStar(t) {
    starCtx.clearRect(0, 0, width, height);
    if (mobile) {
      const progress = Math.min(window.scrollY / Math.max(document.body.scrollHeight - height, 1), 1);
      pointer.x = width * (.73 + Math.sin(t * .0006) * .12);
      pointer.y = height * (.72 - progress * .48 + Math.cos(t * .0007) * .04);
    }
    pointer.px += (pointer.x - pointer.px) * .11;
    pointer.py += (pointer.y - pointer.py) * .11;
    trail.unshift({ x: pointer.px, y: pointer.py, life: 1 });
    if (trail.length > 18) trail.pop();
    trail.forEach((dot, index) => {
      dot.life *= .89;
      const size = Math.max(.7, 2.7 * dot.life);
      starCtx.fillStyle = `rgba(139,221,208,${dot.life * .35})`;
      starCtx.beginPath();
      starCtx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
      starCtx.fill();
      if (index === 7) star(dot.x, dot.y, 3.5, .7, t * .002, dot.life * .4);
    });
    star(pointer.px, pointer.py, mobile ? 9 : 7, 1.3, t * .0017, .9);
  }

  function animate(t) {
    clock = t;
    drawDataField(t);
    drawStar(t);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    mobile = window.matchMedia("(max-width: 780px)").matches;
    resizeCanvases();
  }, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (!mobile) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.initialized) { pointer.px = pointer.x; pointer.py = pointer.y; pointer.initialized = true; }
    }
  }, { passive: true });
  resizeCanvases();
  requestAnimationFrame(animate);
}

window.addEventListener("load", () => {
  window.setTimeout(() => document.querySelector(".intro")?.classList.add("done"), 700);
});
