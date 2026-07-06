(function () {
  const stage = document.getElementById("stage");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const counter = document.getElementById("counter");
  const progress = document.getElementById("progress");
  let index = 0;

  // auto-fill footer page numbers so the signature is uniform everywhere
  const total = slides.length;
  slides.forEach((s, n) => {
    const p = s.querySelector(".pageno");
    if (p) p.textContent = String(n + 1).padStart(2, "0") + " / " + total;
  });

  // scale the fixed 1280x720 stage to fit any window while keeping 16:9
  function fit() {
    const pad = 40;
    const sx = (window.innerWidth - pad) / 1280;
    const sy = (window.innerHeight - pad) / 720;
    const s = Math.min(sx, sy);
    stage.style.transform = "scale(" + s + ")";
  }

  // containers whose children (not the container) should reveal one by one
  const ROWS = ["badge-row", "cards-row", "seg-row", "journey-row", "lanes",
    "timeline", "strain-grid", "pricing-row", "stat-grid", "fw-grid",
    "stop-row", "two-col", "band-stack"];

  // flatten a slide-body into the individual elements that should animate in
  function revealTargets(body) {
    const out = [];
    Array.from(body.children).forEach((ch) => {
      if (ROWS.some((c) => ch.classList.contains(c)) && ch.children.length) {
        Array.from(ch.children).forEach((g) => out.push(g));
      } else {
        out.push(ch);
      }
    });
    return out;
  }

  // stagger-reveal the active slide's content (titles/head are never touched)
  function playReveal(slide) {
    const body = slide.querySelector(".slide-body");
    if (!body) return;
    const items = revealTargets(body);
    items.forEach((el, i) => {
      el.classList.remove("reveal");
      el.style.animationDelay = "";
    });
    // force reflow so removing + re-adding restarts the animation
    void body.offsetWidth;
    items.forEach((el, i) => {
      el.style.animationDelay = (i * 0.07).toFixed(2) + "s";
      el.classList.add("reveal");
    });
  }

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, n) => s.classList.toggle("active", n === index));
    if (counter) counter.textContent = (index + 1) + " / " + slides.length;
    if (progress) progress.style.width = ((index + 1) / slides.length * 100) + "%";
    location.hash = index + 1;
    playReveal(slides[index]);
  }

  // fullscreen toggle
  function toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }
  document.addEventListener("fullscreenchange", () => {
    document.body.classList.toggle("fs", !!document.fullscreenElement);
    fit();
  });

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === "Home") { show(0); }
    else if (e.key === "End") { show(slides.length - 1); }
    else if (e.key === "f" || e.key === "F") { e.preventDefault(); toggleFullscreen(); }
  });

  document.getElementById("prev").addEventListener("click", prev);
  document.getElementById("next").addEventListener("click", next);
  document.getElementById("fs").addEventListener("click", toggleFullscreen);
  document.querySelector(".nav-click-zone.left").addEventListener("click", prev);
  document.querySelector(".nav-click-zone.right").addEventListener("click", next);

  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", () => {
    const n = parseInt(location.hash.replace("#", ""), 10);
    if (!isNaN(n) && n - 1 !== index) show(n - 1);
  });

  fit();
  const start = parseInt(location.hash.replace("#", ""), 10);
  show(!isNaN(start) ? start - 1 : 0);
})();
