/* ============================================================
   NexusPass — Interactive Prototype
   The PHONE shows only the real user experience.
   All course-framework narration lives OUTSIDE the phone
   (caption strip + a pulsing "what if it fails?" control).
   Includes an automated director for a hands-free screen-record.
   ============================================================ */
(function () {
  "use strict";

  var S = { mode: "attendee", step: 0, staggered: false };

  var BASE_NAV = "<b>Concourse busy</b> — routing you via Gate 5 · 3 min to your seat";
  var BASE_EXIT = "Exit window <b>10:42 PM</b> · Route B avoids the North gridlock · your car is pre-notified.";
  var BASE_SCAN = "Hold your pass at <b>Gate 3</b>";

  /* ---- guided narration: one caption per step, per mode (OUTSIDE the phone) ---- */
  var STEPS = {
    attendee: [
      { phase: "Before", cls: "before", cap: 'One pass replaces BookMyShow + Park+ + the venue map — the whole in-venue journey, unified. <span class="fw">Value Proposition</span>' },
      { phase: "Before", cls: "before", cap: 'Parking is bundled into the same pass, not solved in isolation like Park+. Reserved the moment you booked.' },
      { phase: "During", cls: "during", cap: 'Entry is a <span class="fw">Moment of Truth</span> — trust is won or lost in seconds at the gate.' },
      { phase: "During", cls: "during", cap: 'Indoor wayfinding — this is the backstage engine in the <span class="fw">Service Blueprint</span> made visible to the customer.' },
      { phase: "During", cls: "during", cap: 'You just enjoy the show — and every tap generates the organizer\'s live data for free. <span class="fw">Co-creation / SD-Logic</span>.' },
      { phase: "After", cls: "after", cap: 'The exit is the <span class="fw">Peak-End</span> moment that decides the memory. A guided exit protects a great night instead of poisoning it in gridlock.' },
      { phase: "After", cls: "after", cap: 'Retrieval, not wandering a dark lot — the after-phase friction that used to define the memory is gone.' },
      { phase: "After", cls: "after", cap: 'The last tap of the night — the memory the customer actually keeps and shares tomorrow.' }
    ],
    organizer: [
      { phase: "Live", cls: "during", cap: 'Live crowd heatmap — real-time positioning turns every attendee\'s app into a sensor. This telemetry is what single-sided competitors can\'t offer.' },
      { phase: "Live", cls: "during", cap: 'Occupancy &amp; capacity — the honest limit: a 50K show is a <em>different</em> capacity problem, not just a bigger one.' },
      { phase: "Live", cls: "after", cap: 'Exit orchestration — this button eases the crowd <b>and</b> fires every attendee\'s smart-exit push. The two sides act as one.' },
      { phase: "Live", cls: "during", cap: 'Live alerts — <span class="fw">detect → respond &lt;2 min</span> from the operator side. The same recovery the attendee feels, controlled here.' },
      { phase: "Live", cls: "during", cap: 'Sponsor analytics — the third revenue stream. Net-new money for organizers, powered by data only NexusPass collects.' }
    ]
  };

  var RAIL = ["Unified pass", "Parking held", "Entry scan", "Navigation", "The show", "Smart exit", "To your car", "Review"];

  /* ---- recovery scenarios: shown IN-APP as a real notice; trigger lives OUTSIDE ---- */
  var SCENARIOS = {
    2: {
      label: "▶ What if the gate is jammed?",
      recCap: 'Recovery in action — <b>Detect</b>: queue at Gate 3 · <b>Respond &lt;2 min</b>: open a manual lane · <b>Repair</b>: waved through. A well-handled failure builds <em>more</em> trust. <span class="fw">Service Recovery Paradox</span>.',
      play: function () { $("alert-scan").style.display = "flex"; showToast("🛟", "Fast lane opened at Gate 3B"); }
    },
    3: {
      label: "▶ What if the signal drops?",
      recCap: 'Recovery in action — signal lost in a dead zone → seamless <b>GPS fallback</b> with directional arrows. The customer never stops moving. <span class="fw">Blueprint backstage</span>.',
      play: function () {
        $("alert-nav").style.display = "flex";
        $("navMap").classList.add("gps");
        $("navMsg").innerHTML = "<b style='color:var(--amber-deep)'>GPS fallback active.</b> Keep straight 40m, then left.";
        showToast("🧭", "Switched to GPS guidance");
      }
    },
    5: {
      label: "▶ What if everyone leaves at once?",
      recCap: 'Recovery in action — surge <b>detected</b> → guests <b>staggered into waves</b> → gridlock never forms. The same event on the dashboard releases these waves. <span class="fw">Peak-End protected</span>.',
      play: function () { S.staggered = true; applyExitStaggered(); syncDashboardExit(); showToast("🚦", "Exit staggered into waves"); }
    }
  };

  /* ---- element refs ---- */
  var $ = function (id) { return document.getElementById(id); };
  var qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var screens = qsa(".screen", $("screens"));
  var panels = { attendee: $("panel-attendee"), organizer: $("panel-organizer") };
  var capPhase = $("capPhase"), capText = $("capText"), captionStrip = $("captionStrip"), capAction = $("capAction");
  var dots = $("dots"), btnPrev = $("btnPrev"), btnNext = $("btnNext");
  function modeBtn(m) { return $("modeSwitch").querySelector('button[data-mode="' + m + '"]'); }
  function waveBtn() { return panels.organizer.querySelector('[data-action="triggerWave"]'); }

  /* ============================================================
     RENDER: rail + dots
     ============================================================ */
  function buildRail() {
    var rail = $("sideRail");
    RAIL.forEach(function (t, i) {
      var el = document.createElement("div");
      el.className = "rail-step";
      el.innerHTML = '<span class="rn">' + (i + 1) + '</span><span class="rt">' + t + '</span>' +
        '<span class="rp">' + STEPS.attendee[i].phase + '</span>';
      el.addEventListener("click", function () { autoStop(); S.step = i; show(); });
      rail.appendChild(el);
    });
  }

  function buildDots() {
    dots.innerHTML = "";
    var n = STEPS[S.mode].length;
    for (var i = 0; i < n; i++) {
      var d = document.createElement("span");
      d.className = "dot" + (STEPS[S.mode][i].cls === "after" ? " after" : "");
      (function (idx) { d.addEventListener("click", function () { autoStop(); S.step = idx; show(); }); })(i);
      dots.appendChild(d);
    }
  }

  /* ============================================================
     shared exit-staggered state (spans the two sides)
     ============================================================ */
  function applyExitStaggered() {
    $("exitMsg").innerHTML = "High demand — we staggered the exit into waves. You're <b>Wave 2 · 10:46 PM</b> · Route B · staff guiding the North ramp.";
    var wc = $("waveChip"); if (wc) wc.style.display = "inline-flex";
  }

  function resetScenarioVisuals() {
    $("alert-scan").style.display = "none";
    $("scanState").innerHTML = BASE_SCAN;
    $("alert-nav").style.display = "none";
    $("navMap").classList.remove("gps");
    $("navMsg").innerHTML = BASE_NAV;
    if (S.staggered) { applyExitStaggered(); }
    else { $("exitMsg").innerHTML = BASE_EXIT; var wc = $("waveChip"); if (wc) wc.style.display = "none"; }
  }

  /* ============================================================
     SHOW — apply current mode + step
     ============================================================ */
  function show() {
    var list = STEPS[S.mode];
    if (S.step < 0) S.step = 0;
    if (S.step > list.length - 1) S.step = list.length - 1;
    var st = list[S.step];

    panels.attendee.classList.toggle("active", S.mode === "attendee");
    panels.organizer.classList.toggle("active", S.mode === "organizer");

    capPhase.textContent = st.phase;
    capPhase.className = "cap-phase " + st.cls;
    capText.innerHTML = st.cap;
    captionStrip.classList.toggle("candor-cap", st.cls === "after");

    qsa(".dot", dots).forEach(function (d, i) { d.classList.toggle("active", i === S.step); });

    btnPrev.disabled = S.step === 0;
    btnNext.disabled = S.step === list.length - 1;
    btnNext.textContent = S.step === list.length - 1 ? "End" : "Next ›";

    if (S.mode === "attendee" && SCENARIOS[S.step]) {
      resetScenarioVisuals();
      var sc = SCENARIOS[S.step];
      if (S.step === 5 && S.staggered) { capText.innerHTML = sc.recCap; capAction.style.display = "none"; }
      else { capAction.style.display = "inline-flex"; capAction.textContent = sc.label; }
    } else {
      capAction.style.display = "none";
    }

    if (S.mode === "attendee") {
      screens.forEach(function (sc2, i) { sc2.classList.toggle("active", i === S.step); });
      qsa(".rail-step", $("sideRail")).forEach(function (r, i) {
        r.classList.toggle("active", i === S.step);
        r.classList.toggle("done", i < S.step);
      });
    } else {
      qsa(".d-card", panels.organizer).forEach(function (c, i) { c.classList.toggle("spot", i === S.step); });
    }
    fit();
  }

  function next() { S.step++; show(); }
  function prev() { S.step--; show(); }
  function goStep(n) { S.step = n; show(); }

  function setModeInternal(m) {
    if (S.mode === m) return;
    S.mode = m; S.step = 0;
    qsa("button", $("modeSwitch")).forEach(function (b) { b.classList.toggle("active", b.dataset.mode === m); });
    buildDots();
    show();
  }

  function playCurrentScenario() {
    var sc = SCENARIOS[S.step];
    if (!sc) return;
    sc.play();
    capText.innerHTML = sc.recCap;
    capAction.style.display = "none";
  }
  capAction.addEventListener("click", function () { autoStop(); playCurrentScenario(); });

  /* ============================================================
     in-phone actions (all real app behaviour)
     ============================================================ */
  function showToast(icon, text) {
    var t = $("toast");
    t.querySelector(".ic").textContent = icon;
    $("toastText").textContent = text;
    t.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  function doShowQR() { $("qr1").style.display = "block"; $("pass1").style.display = "none"; }
  function doScan() {
    var state = $("scanState");
    state.innerHTML = "Scanning…";
    setTimeout(function () {
      state.innerHTML = '<span style="color:var(--green)">✓ Verified — welcome, Arya</span>';
      showToast("✅", "Entry verified at Gate 3");
    }, 850);
  }
  function vote(idx) {
    var poll = $("poll");
    if (poll.classList.contains("voted")) return;
    poll.classList.add("voted");
    var pcts = [58, 27, 15];
    qsa(".opt", poll).forEach(function (o, i) { o.querySelector(".fill").style.width = pcts[i] + "%"; });
    showToast("🗳️", "Vote counted");
  }
  function rate(n) {
    qsa(".st", $("stars")).forEach(function (s, i) { s.classList.toggle("on", i < n); });
    $("reviewDone").style.display = "flex";
  }

  function resetAttendeeVisuals() {
    $("qr1").style.display = "none"; $("pass1").style.display = "block";
    resetScenarioVisuals();
    $("poll").classList.remove("voted");
    qsa(".opt .fill", $("poll")).forEach(function (f) { f.style.width = "0"; });
    qsa(".st", $("stars")).forEach(function (s) { s.classList.remove("on"); });
    $("reviewDone").style.display = "none";
  }

  function restart() {
    S.step = 0; S.staggered = false;
    resetAttendeeVisuals(); show(); showToast("↺", "Journey reset");
  }

  panels.attendee.addEventListener("click", function (e) {
    var a = e.target.closest("[data-action]");
    if (a) {
      autoStop();
      var act = a.dataset.action;
      if (act === "showQR") doShowQR();
      else if (act === "next") next();
      else if (act === "scan") doScan();
      else if (act === "restart") restart();
      return;
    }
    var opt = e.target.closest(".opt"); if (opt) { autoStop(); vote(+opt.dataset.vote); return; }
    var star = e.target.closest(".st"); if (star) { autoStop(); rate(+star.dataset.s); return; }
  });

  /* ============================================================
     ORGANIZER dashboard
     ============================================================ */
  var ZONES = [
    { n: "North Stand", d: 88 }, { n: "East Stand", d: 71 }, { n: "Pitch Front", d: 94 }, { n: "West Stand", d: 66 }, { n: "South Stand", d: 79 },
    { n: "Concourse", d: 82 }, { n: "Food Court", d: 74 }, { n: "Gate 3", d: 58 }, { n: "Gate 5", d: 47 }, { n: "Parking L2", d: 40 }
  ];
  var ZONES0 = ZONES.map(function (z) { return { n: z.n, d: z.d }; });

  function densColor(p) { return p >= 80 ? "#D64545" : (p >= 62 ? "#E8963A" : "#3FA76B"); }

  function renderHeat() {
    var h = $("heat"); h.innerHTML = "";
    ZONES.forEach(function (z) {
      var c = document.createElement("div");
      c.className = "cell"; c.style.background = densColor(z.d); c.textContent = z.n;
      h.appendChild(c);
    });
  }
  function renderMeters() {
    var m = $("meters"); m.innerHTML = "";
    ZONES.slice().sort(function (a, b) { return b.d - a.d; }).slice(0, 5).forEach(function (z) {
      var row = document.createElement("div");
      row.className = "meter";
      row.innerHTML = '<div class="top"><span class="nm">' + z.n + '</span>' +
        '<span class="pc" style="color:' + densColor(z.d) + '">' + z.d + '%</span></div>' +
        '<div class="track"><div class="bar" style="width:' + z.d + '%;background:' + densColor(z.d) + '"></div></div>';
      m.appendChild(row);
    });
  }

  var FEED0 = [
    { i: "🎫", ok: 1, t: "0:48", txt: "Gate 3 scan latency ↑ → <span class='resp'>manual lane dispatched</span>" },
    { i: "🧭", ok: 1, t: "2:10", txt: "Dead zone · Sector 7 → <span class='resp'>GPS fallback active</span>" },
    { i: "📶", ok: 0, t: "3:35", txt: "Concourse nearing capacity — rerouting foot traffic" },
    { i: "🅿️", ok: 1, t: "5:02", txt: "Parking API blip → <span class='resp'>staff guiding + map pushed</span>" }
  ];
  var FEED = FEED0.slice();

  function renderFeed() {
    var f = $("feed"); f.innerHTML = "";
    FEED.forEach(function (a) {
      var el = document.createElement("div");
      el.className = "alert" + (a.ok ? " ok" : "");
      el.innerHTML = '<span class="ai">' + a.i + '</span><span class="atxt">' + a.txt + '</span><span class="t">' + a.t + '</span>';
      f.appendChild(el);
    });
  }

  function triggerWave() {
    if (S.staggered) { showToast("✓", "Exit waves already running"); return; }
    S.staggered = true;
    ZONES.forEach(function (z) { z.d = Math.max(28, Math.round(z.d * 0.72)); });
    renderHeat(); renderMeters();
    syncDashboardExit(); applyExitStaggered();
    FEED.unshift({ i: "🚦", ok: 1, t: "now", txt: "Exit surge detected → <span class='resp'>staggered into 4 waves · marshals on North ramp</span>" });
    renderFeed();
    showToast("🚦", "Wave 1 dispatched — 12,400 guests via Route B");
  }
  function syncDashboardExit() {
    $("exitStatus").innerHTML = "<b>Staggered release active.</b> 4 waves · ~13,000 guests/wave · North ramp holding steady. Attendees get their personal exit window in-app.";
    $("waveTag").style.display = "inline-flex";
  }
  function resetDashboard() {
    ZONES = ZONES0.map(function (z) { return { n: z.n, d: z.d }; });
    FEED = FEED0.slice();
    renderHeat(); renderMeters(); renderFeed();
    $("exitStatus").innerHTML = "All 52,000 guests still inside. Exit not yet released. Releasing everyone at once would gridlock the North ramp for ~2 hours.";
    $("waveTag").style.display = "none";
  }

  panels.organizer.addEventListener("click", function (e) {
    var a = e.target.closest("[data-action]");
    if (a && a.dataset.action === "triggerWave") { autoStop(); triggerWave(); }
  });

  function tickClock() {
    var d = new Date();
    $("dashClock").textContent = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  setInterval(tickClock, 1000); tickClock();

  setInterval(function () {
    if (S.mode !== "organizer" || S.staggered) return;
    ZONES.forEach(function (z) {
      z.d = Math.max(35, Math.min(97, z.d + (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 3)));
    });
    renderHeat(); renderMeters();
  }, 5000);

  /* ============================================================
     AUTOMATED DIRECTOR — hands-free walkthrough for recording
     ============================================================ */
  var auto = { on: false, paused: false, done: false, cues: [], i: 0, timer: null, dueAt: 0, remain: 0 };

  function ripple(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    if (!r.width) return;
    var f = document.createElement("div");
    f.className = "tap-fx";
    f.style.left = (r.left + r.width / 2) + "px";
    f.style.top = (r.top + r.height / 2) + "px";
    document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 600);
  }
  function clearHighlights() {
    qsa(".pulse").forEach(function (e) { e.classList.remove("pulse", "pulse-teal"); });
    captionStrip.classList.remove("scenario-live");
  }
  function highlight(el, teal) {
    clearHighlights();
    if (!el) return;
    el.classList.add("pulse");
    if (teal) el.classList.add("pulse-teal");
    if (el === capAction) captionStrip.classList.add("scenario-live");
  }

  function prepOrganizer() { S.staggered = false; resetDashboard(); }

  function buildScript() {
    return [
      // ---- ATTENDEE ----
      { do: function () { fullReset(); }, wait: 2200 },
      { do: function () { ripple(activeBtn("showQR")); doShowQR(); }, wait: 2200 },
      { do: function () { goStep(1); }, wait: 3200 },
      { do: function () { goStep(2); }, wait: 1700 },
      { do: function () { ripple(activeBtn("scan")); doScan(); }, wait: 2100 },
      { do: function () { highlight(capAction); }, wait: 1400 },
      { do: function () { ripple(capAction); playCurrentScenario(); clearHighlights(); }, wait: 3400 },
      { do: function () { goStep(3); }, wait: 1900 },
      { do: function () { highlight(capAction); }, wait: 1400 },
      { do: function () { ripple(capAction); playCurrentScenario(); clearHighlights(); }, wait: 3600 },
      { do: function () { goStep(4); }, wait: 1500 },
      { do: function () { ripple(panels.attendee.querySelector('.opt[data-vote="0"]')); vote(0); }, wait: 2700 },
      { do: function () { goStep(5); }, wait: 2600 },
      { do: function () { highlight(capAction); }, wait: 1400 },
      { do: function () { ripple(capAction); playCurrentScenario(); clearHighlights(); }, wait: 3600 },
      { do: function () { goStep(6); }, wait: 3000 },
      { do: function () { goStep(7); }, wait: 1300 },
      { do: function () { ripple(panels.attendee.querySelector('.st[data-s="5"]')); rate(5); }, wait: 3200 },
      // ---- HANDOFF TO ORGANIZER ----
      { do: function () { highlight(modeBtn("organizer"), true); }, wait: 1500 },
      { do: function () { clearHighlights(); prepOrganizer(); setModeInternal("organizer"); }, wait: 3400 },
      { do: function () { goStep(1); }, wait: 3400 },
      { do: function () { goStep(2); }, wait: 1700 },
      { do: function () { highlight(waveBtn(), false); }, wait: 1500 },
      { do: function () { ripple(waveBtn()); triggerWave(); clearHighlights(); }, wait: 3600 },
      { do: function () { goStep(3); }, wait: 3400 },
      { do: function () { goStep(4); }, wait: 3600 },
      { do: function () { autoFinish(); }, wait: 0 }
    ];
  }

  // the in-app button for a given action, in the currently visible screen
  function activeBtn(action) {
    var sc = screens[S.step];
    return sc ? sc.querySelector('[data-action="' + action + '"]') : null;
  }

  function fullReset() {
    clearHighlights();
    S.mode = "attendee"; S.step = 0; S.staggered = false;
    qsa("button", $("modeSwitch")).forEach(function (b) { b.classList.toggle("active", b.dataset.mode === "attendee"); });
    buildDots();
    resetAttendeeVisuals();
    resetDashboard();
    show();
  }

  function schedule(delay) { auto.dueAt = Date.now() + delay; auto.timer = setTimeout(tick, delay); }
  function tick() {
    if (!auto.on || auto.paused) return;
    $("autoBar").style.width = Math.round(auto.i / auto.cues.length * 100) + "%";
    var c = auto.cues[auto.i++];
    if (!c) { autoFinish(); return; }
    try { if (c.do) c.do(); } catch (e) { }
    schedule(c.wait || 1000);
  }
  function startWalkthrough() {
    autoStopSilent();
    auto.cues = buildScript(); auto.i = 0; auto.on = true; auto.paused = false; auto.done = false;
    $("autoBar").style.width = "0%";
    updatePlayBtn();
    schedule(200);
  }
  function autoPause() { if (!auto.on || auto.paused) return; auto.paused = true; clearTimeout(auto.timer); auto.remain = Math.max(0, auto.dueAt - Date.now()); updatePlayBtn(); }
  function autoResume() { if (!auto.on || !auto.paused) return; auto.paused = false; schedule(auto.remain); updatePlayBtn(); }
  function autoStopSilent() { auto.on = false; auto.paused = false; clearTimeout(auto.timer); clearHighlights(); }
  function autoStop() { if (!auto.on) return; autoStopSilent(); auto.done = false; updatePlayBtn(); }
  function autoFinish() { auto.on = false; auto.paused = false; auto.done = true; clearHighlights(); $("autoBar").style.width = "100%"; updatePlayBtn(); showToast("✓", "Walkthrough complete"); }

  function togglePlay() {
    if (!auto.on) startWalkthrough();
    else if (auto.paused) autoResume();
    else autoPause();
  }
  function updatePlayBtn() {
    var btn = $("playBtn"), lbl = $("playLbl"), ic = btn.querySelector(".pic");
    if (auto.on && !auto.paused) { ic.textContent = "⏸"; lbl.textContent = "Pause"; btn.classList.add("running"); }
    else if (auto.on && auto.paused) { ic.textContent = "▶"; lbl.textContent = "Resume"; btn.classList.remove("running"); }
    else { ic.textContent = "▶"; lbl.textContent = auto.done ? "Replay" : "Auto-play"; btn.classList.remove("running"); }
  }
  $("playBtn").addEventListener("click", togglePlay);

  /* ============================================================
     NAV: keyboard, buttons, mode switch, fullscreen
     ============================================================ */
  btnPrev.addEventListener("click", function () { autoStop(); prev(); });
  btnNext.addEventListener("click", function () { autoStop(); next(); });
  qsa("button", $("modeSwitch")).forEach(function (b) {
    b.addEventListener("click", function () { autoStop(); setModeInternal(b.dataset.mode); });
  });

  function toggleFullscreen() {
    var el = document.documentElement;
    if (!document.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen).call(el); }
    else { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
  }

  document.addEventListener("keydown", function (e) {
    if (["INPUT", "TEXTAREA"].indexOf(document.activeElement.tagName) !== -1) return;
    if (e.key === "p" || e.key === "P") { e.preventDefault(); togglePlay(); return; }
    if (e.key === "f" || e.key === "F") { e.preventDefault(); toggleFullscreen(); return; }
    if (["ArrowRight", "PageDown", " "].indexOf(e.key) !== -1) { e.preventDefault(); autoStop(); next(); }
    else if (["ArrowLeft", "PageUp"].indexOf(e.key) !== -1) { e.preventDefault(); autoStop(); prev(); }
    else if (e.key === "Home") { autoStop(); S.step = 0; show(); }
    else if (e.key === "End") { autoStop(); S.step = STEPS[S.mode].length - 1; show(); }
    else if (e.key === "1") { autoStop(); setModeInternal("attendee"); }
    else if (e.key === "2") { autoStop(); setModeInternal("organizer"); }
  });
  document.addEventListener("fullscreenchange", fit);

  function fit() {
    if (S.mode !== "attendee") return;
    var wrap = document.querySelector(".stage-wrap");
    var avail = wrap.clientHeight - 20;
    var scale = Math.max(0.5, Math.min(1, avail / 764));
    $("phoneScale").style.transform = "scale(" + scale + ")";
  }
  window.addEventListener("resize", fit);

  /* ============================================================
     INIT
     ============================================================ */
  buildRail();
  buildDots();
  renderHeat();
  renderMeters();
  renderFeed();
  show();
  fit();
  window.addEventListener("load", fit);
})();
