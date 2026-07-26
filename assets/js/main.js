// ===== Mobile nav toggle =====
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// ===== Scroll reveal =====
(function () {
  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach(function (el) { io.observe(el); });
})();

// ===== Gallery / carousel =====
// Usage: <div class="gallery" data-gallery> ... .gallery-track > .slide (repeated) ... </div>
(function () {
  document.querySelectorAll("[data-gallery]").forEach(function (root) {
    var track = root.querySelector(".gallery-track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
    var prevBtn = root.querySelector(".nav-btn.prev");
    var nextBtn = root.querySelector(".nav-btn.next");
    var counter = root.querySelector(".counter");
    if (!track || !slides.length) return;

    var index = 0;
    var total = slides.length;

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      if (counter) {
        counter.textContent =
          String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
      }
      // pause any video not on the active slide
      slides.forEach(function (slide, i) {
        var video = slide.querySelector("video");
        if (video && i !== index) video.pause();
      });
    }

    function go(delta) {
      index = (index + delta + total) % total;
      render();
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });

    // keyboard support when the gallery has focus
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    });

    // basic touch swipe
    var startX = null;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      startX = null;
    });

    render();
  });
})();
