/*
 * Site content — edit this file to replace placeholder data.
 * Every text field has an `en` (English) and a `tr` (Türkçe) value.
 * Images (per product):
 *   jar    → assets/img/jars/    photo of the jar WITHOUT its label, transparent background
 *   label  → assets/img/labels/  the flat, unrolled label artwork (full wrap-around)
 *   photos → assets/img/photos/  gallery photos on the product page
 * The label is wrapped around the jar at runtime (see jar-label.js) and spins on hover.
 */
window.SITE = {
  /* Where the label band sits inside the jar photos, as fractions of the photo size.
     aspect = photo width / height. If you use your own photos, measure and update these
     (or add `jarLabel: { top: …, bottom: … }` to a single product to override just that one). */
  jarLabel: { aspect: 0.6221, cx: 0.5, rx: 0.424, top: 0.4164, topSag: 0.038, bottom: 0.7773, bottomSag: 0.0675 },
  brand: { en: { name: "SAAHEL", sub: "Farm" }, tr: { name: "SAAHEL", sub: "Çiftlik" } },
  ui: {
    en: {
      menu: "Menu", close: "Close", scroll: "Scroll to discover", discover: "Discover the product", drag: "Drag",
      privacy: "Privacy & Cookies", otherProducts: "The other<br>products", tips: "Useful tips",
      weights: "Available weights", shelfLife: "Shelf life", ingredients: "Ingredients",
      circle: "FROM OUR LAND · TO YOUR TABLE · ",
      nav: ["Home", "Pantry", "Production", "Experience", "About", "Contacts", "Shop"],
      registered: "Registered office", operational: "Operational office", follow: "Follow us",
      address1: "Placeholder Street, 12<br>00000 · Your City", address2: "Farm Road, km 4<br>00000 · Your Region",
      contactText: "Have a question or want to know more about our farm? Write to us — we'd love to tell you our story.",
      email: "info@saahelfarm.com", company: "Your Company Name Ltd.", vat: "VAT 000000000000",
      notFound: "Product not found"
    },
    tr: {
      menu: "Menü", close: "Kapat", scroll: "Keşfetmek için kaydırın", discover: "Ürünü keşfet", drag: "Sürükle",
      privacy: "Gizlilik ve Çerezler", otherProducts: "Diğer<br>ürünler", tips: "Faydalı ipuçları",
      weights: "Mevcut ağırlıklar", shelfLife: "Raf ömrü", ingredients: "İçindekiler",
      circle: "TOPRAĞIMIZDAN · SOFRANIZA · ",
      nav: ["Ana Sayfa", "Kiler", "Üretim", "Deneyim", "Hakkımızda", "İletişim", "Mağaza"],
      registered: "Merkez ofis", operational: "Üretim tesisi", follow: "Bizi takip edin",
      address1: "Örnek Sokak, No 12<br>00000 · Şehriniz", address2: "Çiftlik Yolu, 4. km<br>00000 · Bölgeniz",
      contactText: "Bir sorunuz mu var ya da çiftliğimizi daha yakından tanımak mı istiyorsunuz? Bize yazın; hikâyemizi anlatmaktan mutluluk duyarız.",
      email: "info@saahelfarm.com", company: "Şirket Adınız Ltd. Şti.", vat: "Vergi No 0000000000",
      notFound: "Ürün bulunamadı"
    }
  }
};

(function () {
  var JAMS = { en: "Jams and<br>Preserves", tr: "Reçel ve<br>Konserveler" };
  var CREAMS = { en: "Sweet<br>Creams", tr: "Tatlı<br>Kremalar" };
  var SAUCES = { en: "Sauces and<br>Pickles", tr: "Soslar ve<br>Turşular" };
  var ORIGIN = { en: "Hand-made<br>on our farm", tr: "Çiftliğimizde<br>el yapımı" };
  function files(slug) {
    return { jar: slug + ".webp", label: slug + ".webp", photos: [slug + "-studio.webp", slug + "-nature.webp", slug + "-table.webp"] };
  }
  function product(slug, o) {
    var f = files(slug);
    return Object.assign({ slug: slug, jar: f.jar, label: f.label, photos: f.photos, origin: ORIGIN }, o);
  }

  window.PRODUCTS = [
    product("rose-petal", {
      accent: "#ffd6e3", shape: "rose", shapeColor: "#e5578b", category: JAMS,
      name: { en: "Rose Petal Jam", tr: "Gül Reçeli" },
      description: {
        en: "Damask rose petals picked at dawn and cooked in a fragrant syrup. Pink, perfumed and pure romance.",
        tr: "Şafakta toplanan Damask gülü yaprakları mis kokulu bir şerbette pişirilir. Pembe, mis gibi ve saf bir romantizm."
      },
      ingredients: { en: "damask rose petals, sugar, lemon juice.", tr: "Damask gülü yaprakları, şeker, limon suyu." },
      tips: {
        en: "Delicious with clotted cream, on pancakes or stirred into black tea. Store in a cool place; refrigerate after opening.",
        tr: "Kaymakla, pankek üzerinde ya da siyah çaya karıştırarak çok lezzetli. Serin bir yerde saklayın; açıldıktan sonra buzdolabına koyun."
      },
      weights: ["250g"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("sour-cherry", {
      accent: "#ffd3dc", shape: "cherry", shapeColor: "#9c1230", category: JAMS,
      name: { en: "Sour Cherry Jam", tr: "Vişne Reçeli" },
      description: {
        en: "Plump sour cherries, pitted by hand and cooked in a light syrup. Deep ruby, tangy and gloriously sweet.",
        tr: "Elle çekirdeği çıkarılmış dolgun vişneler hafif bir şerbette pişirilir. Koyu yakut rengi, mayhoş ve tatlı."
      },
      ingredients: { en: "sour cherries, sugar, lemon juice.", tr: "vişne, şeker, limon suyu." },
      tips: {
        en: "Lovely with fresh cheese, on toast or stirred into tea. Refrigerate after opening and enjoy within two weeks.",
        tr: "Taze peynir yanında, kızarmış ekmek üzerinde ya da çaya karıştırarak harika olur. Açıldıktan sonra buzdolabında saklayın ve iki hafta içinde tüketin."
      },
      weights: ["300g", "1kg"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("quince", {
      accent: "#ffe7b8", shape: "quince", shapeColor: "#e3a23a", category: JAMS,
      name: { en: "Quince Jam", tr: "Ayva Reçeli" },
      description: {
        en: "Golden quince slices cooked slowly until they blush a deep amber-pink. Fragrant, soft and gently floral.",
        tr: "Altın sarısı ayva dilimleri, koyu kehribar-pembe bir renk alana dek ağır ateşte pişirilir. Mis kokulu, yumuşak ve hafif çiçeksi."
      },
      ingredients: { en: "quince, sugar, lemon juice, a touch of cardamom.", tr: "ayva, şeker, limon suyu, bir tutam kakule." },
      tips: {
        en: "Serve with clotted cream and warm bread for breakfast. Refrigerate after opening and enjoy within two weeks.",
        tr: "Kahvaltıda kaymak ve sıcak ekmekle servis edin. Açıldıktan sonra buzdolabında saklayın ve iki hafta içinde tüketin."
      },
      weights: ["300g"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("pistachio-cream", {
      accent: "#dcf5c4", shape: "pistachio", shapeColor: "#8cc06a", category: CREAMS,
      name: { en: "Pistachio Cream", tr: "Fıstık Kreması" },
      description: {
        en: "A silky spread made with a generous share of roasted Iranian pistachios. Rich, nutty and naturally green.",
        tr: "Bol miktarda kavrulmuş İran fıstığıyla hazırlanan ipeksi bir krema. Zengin, yoğun ve doğal olarak yeşil."
      },
      ingredients: { en: "pistachios (40%), sugar, sunflower oil, milk powder.", tr: "fıstık (%40), şeker, ayçiçek yağı, süt tozu." },
      tips: {
        en: "Stir before use. Perfect on croissants, crepes or straight from the spoon. No need to refrigerate.",
        tr: "Kullanmadan önce karıştırın. Kruvasan, krep üzerinde ya da doğrudan kaşıkla harika. Buzdolabında saklamaya gerek yoktur."
      },
      weights: ["200g", "600g"], shelfLife: { en: "18 months", tr: "18 ay" }
    }),
    product("carrot", {
      accent: "#ffe0c7", shape: "carrot", shapeColor: "#f07f2a", category: JAMS,
      name: { en: "Carrot Jam", tr: "Havuç Reçeli" },
      description: {
        en: "Fine ribbons of carrot simmered with cardamom and a hint of rosewater — a much-loved classic of the Iranian breakfast table.",
        tr: "İnce havuç şeritleri kakule ve bir damla gül suyuyla pişirilir — İran kahvaltı sofralarının sevilen bir klasiği."
      },
      ingredients: { en: "carrots, sugar, lemon juice, cardamom, rosewater.", tr: "havuç, şeker, limon suyu, kakule, gül suyu." },
      tips: {
        en: "Try it with butter on fresh flatbread. Refrigerate after opening and enjoy within two weeks.",
        tr: "Taze lavaş üzerinde tereyağıyla deneyin. Açıldıktan sonra buzdolabında saklayın ve iki hafta içinde tüketin."
      },
      weights: ["300g"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("pomegranate-molasses", {
      accent: "#ffd0d6", shape: "pomegranate", shapeColor: "#b0182c", category: SAUCES,
      name: { en: "Pomegranate Molasses", tr: "Nar Ekşisi" },
      description: {
        en: "Sour pomegranates pressed and slowly reduced to a thick, glossy molasses. Tart, deep and essential in the kitchen.",
        tr: "Ekşi narlar sıkılır ve yavaşça kaynatılarak koyu, parlak bir kıvama getirilir. Mayhoş, derin ve mutfağın vazgeçilmezi."
      },
      ingredients: { en: "100% pomegranate juice, a pinch of salt.", tr: "%100 nar suyu, bir tutam tuz." },
      tips: {
        en: "Essential for fesenjan, wonderful in salads and marinades. No need to refrigerate; keep tightly closed.",
        tr: "Fesencan için vazgeçilmez; salata ve marinatlarda harika. Buzdolabında saklamaya gerek yoktur; kapağını sıkıca kapatın."
      },
      weights: ["300g", "1kg"], shelfLife: { en: "36 months", tr: "36 ay" }
    }),
    product("fig", {
      accent: "#f0dcef", shape: "fig", shapeColor: "#5b2a5e", category: JAMS,
      name: { en: "Fig Jam", tr: "İncir Reçeli" },
      description: {
        en: "Sun-ripened figs cooked whole until jammy and rich, full of tiny crunchy seeds.",
        tr: "Güneşte olgunlaşmış incirler bütün olarak, koyu ve yoğun bir kıvam alana dek pişirilir; minik çıtır çekirdeklerle dolu."
      },
      ingredients: { en: "figs, sugar, lemon juice.", tr: "incir, şeker, limon suyu." },
      tips: {
        en: "Perfect with walnuts and white cheese. Refrigerate after opening and enjoy within two weeks.",
        tr: "Ceviz ve beyaz peynirle mükemmel olur. Açıldıktan sonra buzdolabında saklayın ve iki hafta içinde tüketin."
      },
      weights: ["300g"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("orange-blossom", {
      accent: "#fff3cf", shape: "blossom", shapeColor: "#f2c75c", category: JAMS,
      name: { en: "Orange Blossom Jam", tr: "Turunç Çiçeği Reçeli" },
      description: {
        en: "Delicate bitter-orange blossoms gathered in spring and set in a clear golden syrup. Light, floral and unforgettable.",
        tr: "İlkbaharda toplanan narin turunç çiçekleri berrak, altın renkli bir şerbette. Hafif, çiçeksi ve unutulmaz."
      },
      ingredients: { en: "bitter-orange blossoms, sugar, lemon juice.", tr: "turunç çiçeği, şeker, limon suyu." },
      tips: {
        en: "Spoon over yogurt or stir into a glass of cold water for a spring sherbet. Refrigerate after opening.",
        tr: "Yoğurdun üzerine ekleyin ya da bir bardak soğuk suya karıştırıp bahar şerbeti yapın. Açıldıktan sonra buzdolabında saklayın."
      },
      weights: ["250g"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("black-mulberry", {
      accent: "#e2e0ff", shape: "berry", shapeColor: "#4b52a3", category: JAMS,
      name: { en: "Black Mulberry Jam", tr: "Karadut Reçeli" },
      description: {
        en: "Dark, wild and velvety. Mulberries picked at full ripeness, cooked in small batches to keep their inky colour.",
        tr: "Koyu, yabani ve kadifemsi. Tam olgunlukta toplanan karadutlar, mürekkep rengini korumak için küçük partiler halinde pişirilir."
      },
      ingredients: { en: "black mulberries, sugar, lemon juice.", tr: "karadut, şeker, limon suyu." },
      tips: {
        en: "Try it on cheesecake or swirled into ice cream. Refrigerate after opening and enjoy within a week.",
        tr: "Cheesecake üzerinde ya da dondurmayla deneyin. Açıldıktan sonra buzdolabında saklayın ve bir hafta içinde tüketin."
      },
      weights: ["300g"], shelfLife: { en: "24 months", tr: "24 ay" }
    }),
    product("aged-garlic", {
      accent: "#efe6d3", shape: "garlic", shapeColor: "#8a6a4a", category: SAUCES,
      name: { en: "Aged Garlic Pickle", tr: "Sarımsak Turşusu" },
      description: {
        en: "Whole garlic bulbs aged in grape vinegar until dark, mellow and almost sweet. A treasured Iranian side.",
        tr: "Bütün sarımsak başları üzüm sirkesinde, koyulaşıp yumuşayana ve neredeyse tatlılaşana dek dinlendirilir. Değerli bir İran garnitürü."
      },
      ingredients: { en: "garlic, grape vinegar, salt.", tr: "sarımsak, üzüm sirkesi, tuz." },
      tips: {
        en: "Serve alongside rice dishes and kebabs. Keep the cloves covered with vinegar; refrigerate after opening.",
        tr: "Pilav ve kebap yanında servis edin. Dişleri sirkenin altında tutun; açıldıktan sonra buzdolabında saklayın."
      },
      weights: ["450g"], shelfLife: { en: "36 months", tr: "36 ay" }
    })
  ];
})();
