(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function text(value) {
    return String(value || "").toLowerCase();
  }

  function createResult(item) {
    var link = document.createElement("a");
    link.className = "search-result-item";
    link.href = item.url;

    var img = document.createElement("img");
    img.src = item.cover;
    img.alt = item.title;
    img.loading = "lazy";

    var body = document.createElement("span");
    var title = document.createElement("strong");
    title.textContent = item.title;
    var meta = document.createElement("em");
    meta.textContent = item.year + " · " + item.category + " · " + item.type;
    body.appendChild(title);
    body.appendChild(meta);

    link.appendChild(img);
    link.appendChild(body);
    return link;
  }

  function setupSearch() {
    var items = window.SEARCH_ITEMS || [];
    document.querySelectorAll(".global-search-input").forEach(function (input) {
      var box = input.parentElement.querySelector(".search-results");
      if (!box) {
        return;
      }
      input.addEventListener("input", function () {
        var q = text(input.value).trim();
        box.innerHTML = "";
        if (!q) {
          box.classList.remove("is-open");
          return;
        }
        var results = items.filter(function (item) {
          return text(item.title + " " + item.year + " " + item.genre + " " + item.region + " " + item.type + " " + (item.tags || []).join(" ")).indexOf(q) > -1;
        }).slice(0, 10);
        results.forEach(function (item) {
          box.appendChild(createResult(item));
        });
        if (results.length === 0) {
          var empty = document.createElement("div");
          empty.className = "search-result-item";
          empty.textContent = "没有找到匹配内容";
          box.appendChild(empty);
        }
        box.classList.add("is-open");
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          var first = box.querySelector("a");
          if (first) {
            window.location.href = first.href;
          }
        }
      });
      document.addEventListener("click", function (event) {
        if (!input.parentElement.contains(event.target)) {
          box.classList.remove("is-open");
        }
      });
    });
  }

  function setupMobileNav() {
    var button = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupLocalFilters() {
    document.querySelectorAll(".catalog-panel").forEach(function (panel) {
      var input = panel.querySelector(".local-filter");
      var select = panel.querySelector(".filter-select");
      var cards = Array.prototype.slice.call(panel.querySelectorAll(".filter-item"));
      var empty = panel.querySelector(".empty-state");
      function apply() {
        var q = input ? text(input.value).trim() : "";
        var typ = select ? select.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = text(card.getAttribute("data-title") + " " + card.getAttribute("data-year") + " " + card.getAttribute("data-type") + " " + card.getAttribute("data-tags"));
          var okText = !q || haystack.indexOf(q) > -1;
          var okType = !typ || card.getAttribute("data-type") === typ;
          var ok = okText && okType;
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      if (select) {
        select.addEventListener("change", apply);
      }
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle("is-active", n === current);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle("is-active", n === current);
      });
    }
    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () {
        show(n);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  ready(function () {
    setupMobileNav();
    setupSearch();
    setupLocalFilters();
    setupHero();
  });
})();
