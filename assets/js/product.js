/* Product detail page. Reads ?p=<slug> and renders from PRODUCTS. */
(function () {
  var A = APP, T = A.T;
  A.renderHeader("product.html");
  A.initBadge();
  A.initTransitions();

  var slug = new URLSearchParams(location.search).get("p");
  var p = PRODUCTS.filter(function (x) { return x.slug === slug; })[0] || PRODUCTS[1];
  var main = document.querySelector(".page-main");
  var name = A.t(p.name);
  document.title = name + " — " + A.B.name + " " + A.B.sub;

  // split the title into two balanced lines for the stacked reveal
  function titleLines(text) {
    var words = text.split(" ");
    if (words.length < 2) return [text];
    var best = 1, bestDiff = Infinity;
    for (var i = 1; i < words.length; i++) {
      var d = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  }

  main.innerHTML =
    '<section class="p-hero">' +
      '<h1 class="p-title">' + titleLines(name).map(function (l) { return '<span class="line"><span>' + l + "</span></span>"; }).join("") + "</h1>" +
      '<div class="p-stage">' +
        '<p class="p-meta p-meta--start">' + A.t(p.category) + "</p>" +
        '<div class="p-jar"><div class="p-jar__view"></div></div>' +
        '<p class="p-meta p-meta--end">' + A.t(p.origin) + "</p>" +
      "</div>" +
    "</section>" +
    '<div class="p-sep"><i class="diamond"></i></div>' +
    '<div class="p-desc"><p>' + A.t(p.description) + "</p><p>" + T.ingredients + ": " + A.t(p.ingredients) + "</p></div>" +
    '<div class="p-sep"><i class="diamond"></i></div>' +
    '<section class="p-info">' +
      '<div class="p-info__col"><h2 class="p-info__label">' + T.tips + '</h2><p class="p-info__text">' + A.t(p.tips) + "</p></div>" +
      '<div class="p-info__col"><h2 class="p-info__label">' + T.weights + '</h2><ul class="p-weights">' +
        p.weights.map(function (w) { return "<li>" + w + "</li>"; }).join("") + "</ul></div>" +
      '<div class="p-info__col"><h2 class="p-info__label">' + T.shelfLife + '</h2><p class="p-info__text">' + A.t(p.shelfLife) + "</p></div>" +
    "</section>" +
    '<section class="p-gallery" data-header-theme="light"><div class="p-gallery__viewport"><div class="p-gallery__track">' +
      p.photos.map(function (src, i) {
        return '<figure class="p-gallery__slide" style="margin:0"><img src="' + A.IMG + "photos/" + src + '" alt="' + name + " — " + (i + 1) + '" draggable="false"></figure>';
      }).join("") +
    "</div></div></section>" +
    '<section class="p-others">' +
      '<h2 class="p-others__title">' + T.otherProducts + "</h2>" +
      '<div class="p-others__viewport"><div class="p-others__track">' +
        PRODUCTS.filter(function (x) { return x !== p; }).map(function (o) {
          return '<a class="p-card" href="' + A.productUrl(o.slug) + '" style="--accent:' + o.accent + '">' +
            '<span class="p-card__shape p-card__shape--a">' + A.fruitSvg(o.shape, o.shapeColor) + "</span>" +
            '<span class="p-card__shape p-card__shape--b">' + A.fruitSvg(o.shape, o.shapeColor) + "</span>" +
            '<div class="p-card__img" data-slug="' + o.slug + '"></div>' +
            '<span class="p-card__name">' + A.t(o.name) + "</span>" +
          "</a>";
        }).join("") +
      "</div></div>" +
    "</section>";

  A.renderFooter(document.body);

  /* ---------- hero jar follows scroll; its label turns as you scroll ---------- */
  var jar = main.querySelector(".p-jar");
  var heroView = JarView(jar.querySelector(".p-jar__view"), p);
  var jy = 0, jr = 0;
  function heroTick() {
    var s = Math.min(window.scrollY, window.innerHeight * 1.2);
    var ty = -s * 0.32, tr = s * 0.024;
    jy += (ty - jy) * 0.12; jr += (tr - jr) * 0.12;
    jar.style.transform = "translate3d(0," + jy.toFixed(1) + "px,0) rotate(" + (A.RTL ? -jr : jr).toFixed(2) + "deg)";
    heroView.setRotation(-jr * 0.12);
    requestAnimationFrame(heroTick);
  }
  requestAnimationFrame(heroTick);

  /* ---------- gallery: centre the second slide on load ---------- */
  var gView = main.querySelector(".p-gallery__viewport");
  var gTrack = main.querySelector(".p-gallery__track");
  var gallery = A.Draggable(gView, gTrack);
  A.bindBadge(gView, T.drag);
  function centreSlide() {
    var slides = gTrack.children;
    var i = slides.length > 1 ? 1 : 0;
    var s = slides[i];
    var centre = s.offsetLeft + s.offsetWidth / 2;
    var x = gView.clientWidth / 2 - centre;
    if (A.RTL) x = gView.clientWidth / 2 - centre; // offsetLeft is already visual in RTL
    gallery.setPosition(x, true);
  }
  var imgs = gTrack.querySelectorAll("img"), left = imgs.length;
  imgs.forEach(function (im) {
    if (im.complete) { if (--left === 0) centreSlide(); }
    else im.addEventListener("load", function () { if (--left === 0) centreSlide(); });
  });
  window.addEventListener("resize", centreSlide);

  /* ---------- other products ---------- */
  var oView = main.querySelector(".p-others__viewport");
  A.Draggable(oView, main.querySelector(".p-others__track"));
  oView.querySelectorAll(".p-card").forEach(function (c) {
    A.bindBadge(c, T.discover);
    var host = c.querySelector(".p-card__img");
    var prod = PRODUCTS.filter(function (x) { return x.slug === host.getAttribute("data-slug"); })[0];
    JarView(host, prod).bindHover(c);
  });

  /* ---------- reveal ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.remove("is-entering");
      document.documentElement.classList.add("is-ready");
    });
  });
})();
