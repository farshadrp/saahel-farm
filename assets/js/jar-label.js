/*
 * JarView — a jar photo (without label) + a flat label image wrapped around it on a <canvas>.
 * The label can be rotated around the jar (hover spin, scroll-driven, …).
 *
 * The label band position inside the jar photo is described by SITE.jarLabel
 * (fractions of the photo's width/height). If you swap in your own photos, adjust those numbers.
 */
(function () {
  var TAU = Math.PI * 2;

  function JarView(host, product) {
    // a product can override the default band geometry when its photo is framed differently
    var meta = Object.assign({}, SITE.jarLabel, product.jarLabel || {});
    host.classList.add("jarview");
    host.innerHTML = "";
    var img = new Image();
    img.className = "jarview__img";
    img.alt = APP.t(product.name);
    img.draggable = false;
    img.src = APP.IMG + "jars/" + product.jar;
    var cv = document.createElement("canvas");
    cv.className = "jarview__label";
    cv.setAttribute("aria-hidden", "true");
    host.appendChild(img);
    host.appendChild(cv);
    var ctx = cv.getContext("2d");

    var label = new Image();
    label.src = APP.IMG + "labels/" + product.label;
    var ready = false;
    label.onload = function () { ready = true; resize(); };

    var rot = 0;

    function resize() {
      var w = host.clientWidth;
      if (!w) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var cw = Math.round(w * dpr), ch = Math.round(w / meta.aspect * dpr);
      if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
      draw();
    }

    function draw() {
      if (!ready) return;
      var W = cv.width, H = cv.height;
      var LW = label.naturalWidth, LH = label.naturalHeight;
      var cx = meta.cx * W, rx = meta.rx * W;
      var top = meta.top * H, topSag = meta.topSag * H, bot = meta.bottom * H, botSag = meta.bottomSag * H;
      ctx.clearRect(0, 0, W, H);
      var x0 = Math.ceil(cx - rx), x1 = Math.floor(cx + rx);
      for (var x = x0; x < x1; x++) {
        var xn = (x + 0.5 - cx) / rx;
        if (xn <= -1 || xn >= 1) continue;
        var th = Math.asin(xn), c = Math.cos(th);
        var u = 0.5 + (th + rot) / TAU;
        u -= Math.floor(u);
        var sx = u * LW;
        var sw = Math.min(LW * 0.02, Math.max(1, LW / (TAU * rx * Math.max(c, 0.05))));
        if (sx + sw > LW) sx = LW - sw;
        // near side of the cylinder sits lower on screen (camera looks slightly down)
        var yt = top + topSag * c, yb = bot + botSag * c, h = yb - yt;
        ctx.drawImage(label, sx, 0, sw, LH, x, yt, 1, h);
        // cylindrical shading + soft key light from the left
        var dark = 0.05 + 0.6 * Math.pow(1 - c, 1.7);
        ctx.fillStyle = "rgba(25,8,6," + dark.toFixed(3) + ")";
        ctx.fillRect(x, yt, 1, h);
        var hl = 0.26 * Math.exp(-Math.pow((xn + 0.45) / 0.13, 2)) + 0.1 * Math.exp(-Math.pow((xn - 0.62) / 0.06, 2));
        if (hl > 0.005) { ctx.fillStyle = "rgba(255,255,255," + hl.toFixed(3) + ")"; ctx.fillRect(x, yt, 1, h); }
      }
    }

    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener("resize", resize);
    img.addEventListener("load", resize);

    /* ---------- spin on hover ---------- */
    var hovering = false, vel = 0, raf = 0, last = 0;
    function loop(now) {
      var dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      if (hovering) {
        vel += (2.8 - vel) * 0.07;
        rot += vel * dt;
      } else {
        // finish the turn and settle the front of the label back to the camera
        var target = Math.ceil(rot / TAU - 0.02) * TAU;
        var step = (target - rot) * 0.085;
        rot += Math.max(step, Math.min(target - rot, 0.004));
        vel = 0;
        if (Math.abs(target - rot) < 0.002) { rot = 0; draw(); raf = 0; last = 0; return; }
      }
      draw();
      raf = requestAnimationFrame(loop);
    }
    function hover(on) {
      hovering = on;
      if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
    }

    return {
      el: host,
      hover: hover,
      setRotation: function (r) { if (r !== rot) { rot = r; draw(); } },
      bindHover: function (node) {
        node.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hover(true); });
        node.addEventListener("pointerleave", function () { hover(false); });
      }
    };
  }

  window.JarView = JarView;
})();
