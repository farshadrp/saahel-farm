/* Shared: header, menu, footer, cursor badge, page transitions, draggable tracks. */
(function () {
  var LANG = document.documentElement.lang === "tr" ? "tr" : "en";
  var RTL = document.documentElement.dir === "rtl";
  var T = SITE.ui[LANG];
  var B = SITE.brand[LANG];
  var IMG = "../assets/img/";

  function t(o) { return o == null ? "" : (o[LANG] != null ? o[LANG] : o.en); }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function productUrl(slug) { return "product.html?p=" + encodeURIComponent(slug); }
  function finePointer() { return window.matchMedia("(hover: hover) and (pointer: fine)").matches; }

  /* ---------- header + menu ---------- */
  // logo symbol inline so it can follow the header colour (orange → maroon over the open menu)
  var SYMBOL =
    '<svg class="site-logo__symbol" viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="58" r="38" fill="currentColor"/>' +
      '<circle cx="50" cy="58" r="33" style="fill:var(--logo-bg, var(--c-cream))"/>' +
      '<g fill="currentColor" transform="translate(50,58) scale(.92) translate(-50,-58)">' +
        [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
          var a0 = i * Math.PI / 4 + 0.08, a1 = a0 + Math.PI / 4;
          var p = function (a) { return (50 + 30 * Math.cos(a)).toFixed(1) + "," + (58 + 30 * Math.sin(a)).toFixed(1); };
          return '<path d="M50,58 L' + p(a0) + " A30,30 0 0 1 " + p(a1) + ' Z"/>';
        }).join("") +
      "</g>" +
      '<circle cx="50" cy="58" r="4" style="fill:var(--logo-bg, var(--c-cream))"/>' +
      '<path fill="currentColor" d="M50,20 C50,12 54,6 60,2 C58,10 56,15 50,20 Z"/>' +
      '<path fill="currentColor" d="M50,20 C44,8 32,6 24,9 C30,18 40,22 50,20 Z"/>' +
    "</svg>";

  function renderHeader(page) {
    var search = location.search || "";
    var navHrefs = ["index.html", productUrl(PRODUCTS[0].slug), "#", "#", "#", "#", "#"];
    var header = el(
      '<header class="site-header">' +
        '<nav class="lang-switch" aria-label="Language">' +
          '<a class="lang-switch__item' + (LANG === "en" ? " is-active" : "") + '" href="../en/' + page + search + '" hreflang="en">EN</a>' +
          '<a class="lang-switch__item' + (LANG === "tr" ? " is-active" : "") + '" href="../tr/' + page + search + '" hreflang="tr">TR</a>' +
        "</nav>" +
        '<a class="site-logo" href="index.html" aria-label="' + B.name + " " + B.sub + '">' +
          SYMBOL +
          '<span class="site-logo__name">' + B.name + "</span>" +
          '<span class="site-logo__sub">' + B.sub + "</span>" +
        "</a>" +
        '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu">' +
          '<span class="menu-toggle__pill">' + T.menu + "</span>" +
          '<span class="menu-toggle__disc"><i class="diamond"></i><i class="menu-toggle__x"></i></span>' +
        "</button>" +
      "</header>"
    );
    var current = page === "index.html" ? 0 : 1;
    var menu = el(
      '<div class="site-menu" id="site-menu" aria-hidden="true">' +
        '<nav class="site-menu__main">' +
          T.nav.slice(0, 4).map(function (n, i) {
            return '<a class="site-menu__item' + (i === current ? " is-current" : "") + '" href="' + navHrefs[i] + '">' +
              '<span class="site-menu__label">' + n + '</span><i class="diamond"></i></a>';
          }).join("") +
        "</nav>" +
        '<div class="site-menu__aux">' +
          '<a href="' + navHrefs[4] + '">' + T.nav[4] + "</a>" +
          '<a href="' + navHrefs[5] + '">' + T.nav[5] + "</a>" +
          '<a href="' + navHrefs[6] + '">' + T.nav[6] + '<span class="arrow">' + (RTL ? "↖" : "↗") + "</span></a>" +
        "</div>" +
        '<a class="site-menu__privacy" href="#">' + T.privacy + "</a>" +
      "</div>"
    );
    document.body.prepend(menu);
    document.body.prepend(header);

    var toggle = header.querySelector(".menu-toggle");
    var pill = toggle.querySelector(".menu-toggle__pill");
    function setOpen(open) {
      document.documentElement.classList.toggle("is-nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      pill.textContent = open ? T.close : T.menu;
    }
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

    // Scrolling down hides the whole header; scrolling up brings the buttons back
    // (the logo only returns near the top). Over dark sections the header turns light.
    var lastY = window.scrollY, state = {};
    function set(cls, on) { if (state[cls] !== on) { header.classList.toggle(cls, on); state[cls] = on; } }
    function onScroll() {
      var y = window.scrollY, dy = y - lastY;
      set("is-scrolled", y > 80);
      if (y < 120) set("is-hidden", false);
      else if (dy > 4) set("is-hidden", true);
      else if (dy < -4) set("is-hidden", false);
      if (Math.abs(dy) > 4 || y < 120) lastY = y;
      var probe = 50, light = false;
      document.querySelectorAll('[data-header-theme="light"]').forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) light = true;
      });
      set("is-light", light);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---------- footer ---------- */
  function renderFooter(target) {
    var year = new Date().getFullYear();
    var nav = T.nav;
    target.appendChild(el(
      '<footer class="site-footer" data-header-theme="light">' +
        '<div class="site-footer__grid">' +
          '<div class="site-footer__word" aria-hidden="true"><b>' + B.name + "</b><i>" + B.sub + "</i></div>" +
          '<div class="site-footer__brand">' +
            '<img src="' + IMG + 'symbol-outline.svg" alt="">' +
            '<div><div class="f-label">©' + year + " | " + B.name + " " + B.sub + "</div><div>" + T.company + "</div><br><div>" + T.vat + "</div></div>" +
          "</div>" +
          '<nav class="site-footer__nav">' +
            "<ul>" + nav.slice(0, 5).map(function (n, i) {
              return '<li><a href="' + (i === 0 ? "index.html" : "#") + '"' + (i === 1 ? ' class="is-current"' : "") + ">" + n + "</a></li>";
            }).join("") + "</ul>" +
            "<ul><li><a href=\"#\">" + nav[5] + "</a></li><li><a href=\"#\">" + nav[6] + "</a></li></ul>" +
          "</nav>" +
          '<div class="site-footer__offices">' +
            '<div><div class="f-label">' + T.registered + "</div><div>" + T.address1 + "</div></div>" +
            '<div><div class="f-label">' + T.operational + "</div><div>" + T.address2 + "</div></div>" +
          "</div>" +
          '<div class="site-footer__contact">' +
            '<div><div class="f-label">' + T.follow + '</div><a href="#">@instagram</a></div>' +
            '<div><p class="lead">' + T.contactText + '</p><a class="mail" href="mailto:' + T.email + '">' + T.email + "</a></div>" +
          "</div>" +
        "</div>" +
        '<div class="site-footer__bottom"><a class="privacy-link" href="#">' + T.privacy + "</a></div>" +
      "</footer>"
    ));
    // scale the brand name so it spans the full column, whatever its length
    var word = target.querySelector(".site-footer__word"), b = word.querySelector("b");
    function fit() {
      b.style.fontSize = "";
      b.style.display = "inline-block";
      var ratio = word.clientWidth / b.getBoundingClientRect().width;
      var size = parseFloat(getComputedStyle(b).fontSize) * Math.min(ratio, 2.4);
      b.style.fontSize = size + "px";
      b.style.display = "block";
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
    window.addEventListener("resize", fit);
  }

  /* ---------- cursor badge ---------- */
  var badge;
  function initBadge() {
    badge = el('<div class="cursor-badge" aria-hidden="true"><i class="diamond"></i><span></span></div>');
    document.body.appendChild(badge);
    window.addEventListener("pointermove", function (e) {
      badge.style.setProperty("--x", e.clientX + "px");
      badge.style.setProperty("--y", e.clientY + "px");
    }, { passive: true });
  }
  function showBadge(text) {
    if (!finePointer()) return;
    badge.querySelector("span").textContent = text;
    badge.classList.add("is-visible");
  }
  function hideBadge() { badge.classList.remove("is-visible"); }
  function bindBadge(node, text) {
    node.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") showBadge(text); });
    node.addEventListener("pointerleave", hideBadge);
  }

  /* ---------- page transitions ---------- */
  function initTransitions() {
    document.body.appendChild(el('<div class="page-cover" aria-hidden="true"></div>'));
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0) return;
      e.preventDefault();
      document.documentElement.classList.add("is-leaving");
      setTimeout(function () { location.href = href; }, 420);
    });
    // back/forward cache restore
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) document.documentElement.classList.remove("is-leaving");
    });
  }

  /* ---------- draggable track with inertia ---------- */
  function Draggable(viewport, track, opts) {
    opts = opts || {};
    var x = 0, target = 0, vel = 0, dragging = false, startX = 0, startTarget = 0, lastX = 0, lastT = 0, moved = 0;
    var dir = RTL ? 1 : -1; // direction content moves when "advancing"
    function bounds() {
      var max = Math.max(0, track.scrollWidth - viewport.clientWidth + parseFloat(getComputedStyle(viewport).paddingLeft) + parseFloat(getComputedStyle(viewport).paddingRight));
      return RTL ? [0, max] : [-max, 0];
    }
    function clamp(v) { var b = bounds(); return Math.min(b[1], Math.max(b[0], v)); }

    viewport.classList.add("drag-viewport");
    track.classList.add("drag-track");

    viewport.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = 0;
      startX = lastX = e.clientX; startTarget = target; lastT = performance.now(); vel = 0;
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add("is-dragging");
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      var b = bounds();
      var next = startTarget + dx;
      if (next > b[1]) next = b[1] + (next - b[1]) * .35;   // rubber band
      if (next < b[0]) next = b[0] + (next - b[0]) * .35;
      target = next;
      var now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT) * 16;
      lastX = e.clientX; lastT = now;
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("is-dragging");
      target = clamp(target + vel * 14);
    }
    viewport.addEventListener("pointerup", end);
    viewport.addEventListener("pointercancel", end);
    // stop link navigation after a drag
    viewport.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    // horizontal trackpad / shift+wheel
    viewport.addEventListener("wheel", function (e) {
      var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!d) return;
      e.preventDefault();
      target = clamp(target - d);
    }, { passive: false });

    function tick() {
      x += (target - x) * (dragging ? .35 : .09);
      if (Math.abs(target - x) < .05) x = target;
      track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    window.addEventListener("resize", function () { target = clamp(target); });

    return {
      setPosition: function (v, instant) { target = clamp(v); if (instant) x = target; },
      dir: dir
    };
  }

  window.APP = {
    LANG: LANG, RTL: RTL, T: T, B: B, IMG: IMG,
    t: t, el: el, productUrl: productUrl, finePointer: finePointer,
    renderHeader: renderHeader, renderFooter: renderFooter,
    initBadge: initBadge, showBadge: showBadge, hideBadge: hideBadge, bindBadge: bindBadge,
    initTransitions: initTransitions, Draggable: Draggable,
    fruitSvg: function (name, color) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="' + color + '" stroke="' + color + '" stroke-width="6" stroke-linejoin="round">' +
        (FRUIT_SHAPES[name] || FRUIT_SHAPES.orange).map(function (d) { return '<path d="' + d + '"/>'; }).join("") + "</g></svg>";
    }
  };
})();
