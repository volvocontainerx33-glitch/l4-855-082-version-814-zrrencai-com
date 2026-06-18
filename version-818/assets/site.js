(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot) {
        var dotIndex = Number(dot.getAttribute('data-hero-dot'));
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')));
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var keywordInput = scope.querySelector('[data-filter-keyword]');
    var selects = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-field]'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function update() {
      var keyword = normalize(keywordInput ? keywordInput.value : '');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-text'));
        var matched = !keyword || text.indexOf(keyword) !== -1;

        selects.forEach(function (select) {
          var field = select.getAttribute('data-filter-field');
          var expected = normalize(select.value);
          var actual = normalize(card.getAttribute('data-' + field));

          if (expected && actual.indexOf(expected) === -1) {
            matched = false;
          }
        });

        card.hidden = !matched;
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    }

    if (keywordInput) {
      keywordInput.addEventListener('input', update);
    }

    selects.forEach(function (select) {
      select.addEventListener('change', update);
    });
  });
})();
