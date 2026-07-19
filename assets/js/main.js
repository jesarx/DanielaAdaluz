/* danielaadaluz.com — interacciones */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menú móvil ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("hidden") === false;
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header: sombra al hacer scroll ---------- */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Navegación activa ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-navlink]"));
  var sections = navLinks
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          var isSub = false;
          navLinks.forEach(function (a) {
            var on = a.getAttribute("href") === id;
            a.classList.toggle("is-active", on);
            if (on && a.hasAttribute("data-subnav")) isSub = true;
          });
          if (isSub) {
            navLinks.forEach(function (a) {
              if (a.getAttribute("href") === "#proyectos") a.classList.add("is-active");
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) {
      activeObserver.observe(s);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    document.querySelectorAll("[data-stagger]").forEach(function (parent) {
      Array.prototype.forEach.call(parent.children, function (child, i) {
        child.style.setProperty("--reveal-delay", Math.min(i * 70, 560) + "ms");
      });
    });
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- "Ver más" en galerías ---------- */
  document.querySelectorAll("[data-more-btn]").forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute("data-more-btn"));
    if (!target) return;
    btn.addEventListener("click", function () {
      var isHidden = target.classList.toggle("hidden");
      btn.textContent = isHidden ? btn.getAttribute("data-label-more") : btn.getAttribute("data-label-less");
      if (isHidden) {
        var section = btn.closest("section");
        if (section) section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
      }
    });
  });

  /* ---------- Sliders (obras del mismo tamaño) ---------- */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
    if (slides.length < 2) return;
    var idx = 0;
    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) {
        s.classList.toggle("hidden", j !== idx);
      });
      slider.querySelectorAll("[data-slide-counter]").forEach(function (c) {
        c.textContent = idx + 1 + " / " + slides.length;
      });
    }
    slider.addEventListener("click", function (e) {
      if (e.target.closest("[data-slide-prev]")) show(idx - 1);
      else if (e.target.closest("[data-slide-next]")) show(idx + 1);
    });
    show(0);
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = document.getElementById("lb-img");
    var lbCaption = document.getElementById("lb-caption");
    var lbCounter = document.getElementById("lb-counter");
    var lbClose = document.getElementById("lb-close");
    var lbPrev = document.getElementById("lb-prev");
    var lbNext = document.getElementById("lb-next");
    var current = { items: [], index: 0 };
    var lastFocus = null;

    function render() {
      var item = current.items[current.index];
      if (!item) return;
      lbImg.src = item.href;
      lbImg.alt = item.caption || "";
      lbCaption.textContent = item.caption || "";
      lbCounter.textContent = current.index + 1 + " / " + current.items.length;
      var multiple = current.items.length > 1;
      lbPrev.style.visibility = multiple ? "visible" : "hidden";
      lbNext.style.visibility = multiple ? "visible" : "hidden";
      var next = current.items[(current.index + 1) % current.items.length];
      if (multiple && next) new Image().src = next.href;
    }

    function openLightbox(items, index) {
      current.items = items;
      current.index = index;
      lastFocus = document.activeElement;
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      render();
      lbClose.focus();
    }

    function closeLightbox() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
      if (lastFocus) lastFocus.focus();
    }

    function step(delta) {
      var n = current.items.length;
      current.index = (current.index + delta + n) % n;
      render();
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-gallery]");
      if (!a) return;
      e.preventDefault();
      var group = a.getAttribute("data-gallery");
      var anchors = Array.prototype.slice.call(
        document.querySelectorAll('a[data-gallery="' + group + '"]')
      );
      var items = anchors.map(function (el) {
        return { href: el.getAttribute("href"), caption: el.getAttribute("data-caption") || "" };
      });
      openLightbox(items, anchors.indexOf(a));
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.id === "lb-stage") closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    var touchX = null;
    lb.addEventListener("touchstart", function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
      touchX = null;
    }, { passive: true });
  }

  /* ---------- Año en el pie ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
