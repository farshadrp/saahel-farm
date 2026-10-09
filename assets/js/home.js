/* Home: intro loader + tilted jar marquee with rotating circular text. */
(function () {
  var A = APP, T = A.T;
  A.renderHeader("index.html");
  A.initBadge();
  A.initTransitions();

  var root = document.querySelector(".home");
  document.querySelector(".home-scroll").textContent = T.scroll;
  document.querySelector(".home .privacy-link").textContent = T.privacy;

  /* ---------- blob + circular text ---------- */
  var blobHost = document.querySelector(".home-blob");
  var CX = 600, CY = 700, R = 470;
  var circleText = new Array(4).join(T.circle);
  blobHost.innerHTML =
    '<svg viewBox="0 0 1200 600" aria-hidden="true">' +
      "<defs>" +
        '<path id="blob-shape" d="M520,70 L690,70 L950,215 L1105,430 L1140,700 L60,700 L95,430 L250,215 Z"/>' +
        '<clipPath id="blob-clip"><use href="#blob-shape"/></clipPath>' +
        '<path id="circle-path" d="M ' + (CX - R) + "," + CY + " a " + R + "," + R + " 0 1,1 " + 2 * R + ",0 a " + R + "," + R + " 0 1,1 " + -2 * R + ',0"/>' +
      "</defs>" +
      '<use href="#blob-shape" style="fill:var(--c-maroon);stroke:var(--c-maroon)" stroke-width="140" stroke-linejoin="round"/>' +
      '<g clip-path="url(#blob-clip)">' +
        '<g class="home-blob__ring">' +
          '<text class="home-blob__text" direction="ltr" xml:space="preserve" style="white-space:pre"><textPath href="#circle-path">' + circleText + "</textPath></text>" +
        "</g>" +
      "</g>" +
    "</svg>";
  var ring = blobHost.querySelector(".home-blob__ring");

  // Fit a whole number of phrases exactly around the circle so the seam never overlaps.
  function fitRing() {
    var text = ring.querySelector("text"), tp = text.querySelector("textPath");
    var circ = 2 * Math.PI * R;
    text.removeAttribute("textLength");
    tp.textContent = T.circle;
    var one = text.getComputedTextLength();
    if (!one) return;
    var n = Math.max(1, Math.round(circ / one));
    tp.textContent = new Array(n + 1).join(T.circle);
    text.setAttribute("textLength", (circ - 1).toFixed(1));
    text.setAttribute("lengthAdjust", "spacing");
  }
  fitRing();
  if (document.fonts) document.fonts.ready.then(fitRing);

  /* ---------- jars ---------- */
  // tilt and vertical offset repeat in a fixed rhythm along the row
  var TILTS = [0, 15.6, -15.6];
  var LIFT = [-19, 15, -9, 20, -17, 10, -14, 19, -19, 15];
  var marquee = document.querySelector(".jar-marquee");
  var jars = PRODUCTS.map(function (p, i) {
    var a = A.el(
      '<a class="jar" href="' + A.productUrl(p.slug) + '" aria-label="' + A.t(p.name) + '" style="--delay:' + (0.1 + i * 0.06) + 's;--intro-r:' + (i % 2 ? 25 : -25) + 'deg">' +
        '<div class="jar__inner"><div class="jar__view"></div></div>' +
      "</a>"
    );
    marquee.appendChild(a);
    A.bindBadge(a, T.discover);
    JarView(a.querySelector(".jar__view"), p).bindHover(a);
    return { node: a, tilt: TILTS[i % TILTS.length], lift: LIFT[i % LIFT.length] };
  });

  /* ---------- motion ---------- */
  var dir = A.RTL ? -1 : 1;
  var offset = 0, vel = 0, auto = 0.45, tiltVel = 0;
  var spacing = 0, total = 0, vw = 0, isMobile = false;
  function measure() {
    vw = window.innerWidth;
    isMobile = vw <= 760;
    spacing = vw * (isMobile ? 0.33 : 0.23);
    total = spacing * jars.length;
  }
  measure();
  window.addEventListener("resize", measure);

  // wheel / touch / drag all feed velocity
  var dragging = false, lastX = 0, lastY = 0, moved = 0;
  root.addEventListener("wheel", function (e) {
    e.preventDefault();
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    vel += d * 0.08;
  }, { passive: false });
  root.addEventListener("pointerdown", function (e) {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    // horizontal drag moves jars with the finger; vertical swipe behaves like scroll
    vel += (-dx * dir - dy) * 0.5 * (e.pointerType === "mouse" ? 0.6 : 1);
    lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener("pointerup", function () { dragging = false; });
  root.addEventListener("click", function (e) { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);

  function wrap(v) { return ((v % total) + total) % total; }

  var ready = false, hidden = false;   // hidden: fully covered by the intro loader
  function frame() {
    if (hidden) { requestAnimationFrame(frame); return; }
    vel *= 0.92;
    offset += (auto + vel) * (ready ? 1 : 0);
    tiltVel += ((vel * 0.5) - tiltVel) * 0.1;

    for (var i = 0; i < jars.length; i++) {
      var j = jars[i];
      var x = wrap(i * spacing - offset + total / 2) - total / 2;
      var k = Math.abs(x) / spacing;                         // distance from centre, in slots
      // the focused jar is enlarged, so its neighbours are pushed a little further out
      var px = (x + (x < 0 ? -1 : 1) * Math.min(Math.abs(x), spacing) * 0.33) * dir;
      var scale = 0.495 + 0.825 * Math.exp(-Math.pow(k / 1.5, 2));
      var f = (scale - 0.495) / 0.825;                       // 1 in focus → 0 far away
      var blur = 4 * Math.pow(1 - f, 1.4);
      var rot = (j.tilt - tiltVel) * dir;
      j.node.style.transform = "translate3d(" + px.toFixed(1) + "px," + j.lift + "px,0) rotate(" + rot.toFixed(2) + "deg) scale(" + scale.toFixed(3) + ")";
      j.node.style.filter = "brightness(" + (0.7 + 0.4 * f).toFixed(3) + ")" + (blur > 0.15 ? " blur(" + blur.toFixed(2) + "px)" : "");
      j.node.style.zIndex = String(Math.round(f * 100));
    }
    ring.setAttribute("transform", "rotate(" + ((-offset * 0.05) % 360).toFixed(2) + " " + CX + " " + CY + ")");
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function start() {
    document.documentElement.classList.add("is-ready");
    setTimeout(function () { ready = true; }, 500);
  }

  /* ---------- intro loader: counter + falling fruit, then an orange sweep ---------- */
  var COLORS = ["#7a2350", "#f9c80e", "#246b45", "#e5578b", "#55255f", "#f6a5bf", "#c2306a", "#e01f26", "#2a2a55", "#d94f86", "#de6f12"];
  var NAMES = ["rose", "cherry", "quince", "pomegranate", "fig", "blossom", "carrot", "berry", "garlic", "pistachio", "orange", "pear"];
  var loader = A.el(
    '<div class="loader" aria-hidden="true">' +
      '<div class="loader__layer"><div class="loader__count">0%</div></div>' +
      '<div class="loader__band"></div>' +
    "</div>"
  );
  var layer = loader.querySelector(".loader__layer");
  var band = loader.querySelector(".loader__band");
  var W = window.innerWidth, H = window.innerHeight;
  var base = W < 760 ? W * 0.42 : Math.max(150, Math.min(330, W * 0.17));
  var cols = Math.ceil(W / (base * 0.8)) + 1;
  var rows = Math.ceil(H / (base * 0.72)) + 1;
  // deterministic pseudo-random so the pile looks natural but stable
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var pieces = [];
  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var c = 0; c < cols; c++) {
      var s = base * (0.85 + rnd() * 0.4);
      row.push({
        s: s,
        x: c * (W / (cols - 1)) - s / 2 + (rnd() - 0.5) * base * 0.35 + (r % 2 ? base * 0.3 : 0),
        y: H - s * 0.9 - r * base * 0.72 + (rnd() - 0.5) * base * 0.25
      });
    }
    row.sort(function () { return rnd() - 0.5; });   // land in random order within each row
    pieces = pieces.concat(row);
  }
  var N = pieces.length, k = 0;
  pieces.forEach(function (pc, i) {
    var fr = A.el('<div class="loader__fruit"></div>');
    fr.innerHTML = A.fruitSvg(NAMES[k % NAMES.length], COLORS[(k * 7) % COLORS.length]);
    // drops start sparse and speed up, so the screen fills just as the count reaches 100
    var delay = 0.45 + 2.25 * Math.sqrt(i / N);
    fr.style.cssText = "--s:" + pc.s.toFixed(0) + "px;--x:" + pc.x.toFixed(0) + "px;--y:" + pc.y.toFixed(0) + "px;--y0:" + (-pc.s * 1.4).toFixed(0) + "px" +
      ";--r0:" + ((rnd() - 0.5) * 120).toFixed(0) + "deg;--r1:" + ((rnd() - 0.5) * 50).toFixed(0) + "deg;--d:" + (0.7 + rnd() * 0.25).toFixed(2) + "s;--delay:" + delay.toFixed(2) + "s";
    layer.appendChild(fr);
    k++;
  });
  document.body.appendChild(loader);
  document.documentElement.classList.add("is-loading");
  // let the first carousel frame lay the jars out, then pause it while the loader covers the page
  requestAnimationFrame(function () { hidden = true; });
  // commit the fruits' start position before triggering the fall, so the transition always plays
  void layer.offsetWidth;
  requestAnimationFrame(function () { requestAnimationFrame(function () { loader.classList.add("is-falling"); }); });

  var count = loader.querySelector(".loader__count");
  var t0 = performance.now(), C0 = 450, C1 = 2700;
  (function countUp(now) {
    var p = Math.min(1, Math.max(0, (now - t0 - C0) / (C1 - C0)));
    count.textContent = Math.round((1 - Math.pow(1 - p, 1.6)) * 100) + "%";
    if (p < 1) return requestAnimationFrame(countUp);
    setTimeout(sweep, 750);
  })(t0);

  function sweep() {
    var bh = H * 0.32, t1 = performance.now(), D = 1150, started = false;
    (function step(now) {
      var p = Math.min(1, (now - t1) / D);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      var y = H - e * (H + bh);                              // top edge of the orange band
      band.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
      layer.style.clipPath = "inset(0 0 " + Math.max(0, H - y).toFixed(1) + "px 0)";
      loader.style.clipPath = "inset(0 0 " + Math.max(0, H - y - bh).toFixed(1) + "px 0)";
      if (!started && p > 0.12) { started = true; hidden = false; start(); }
      if (p < 1) return requestAnimationFrame(step);
      loader.remove();
      document.documentElement.classList.remove("is-loading");
    })(t1);
  }
})();
