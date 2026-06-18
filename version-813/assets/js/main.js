(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    const prev = slider.querySelector('[data-hero-prev]');
    const next = slider.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const showSlide = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const start = function () {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    };

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    slider.addEventListener('mouseenter', function () {
      if (timer) {
        clearInterval(timer);
      }
    });

    slider.addEventListener('mouseleave', start);
    start();
  }

  const liveSearch = document.querySelector('[data-live-search]');
  const regionFilter = document.querySelector('[data-filter-region]');
  const typeFilter = document.querySelector('[data-filter-type]');
  const yearFilter = document.querySelector('[data-filter-year]');
  const clearButton = document.querySelector('[data-filter-clear]');
  const cards = Array.from(document.querySelectorAll('[data-filter-card]'));

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (liveSearch && query) {
    liveSearch.value = query;
  }

  const normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  const applyFilters = function () {
    const searchValue = normalize(liveSearch ? liveSearch.value : '');
    const regionValue = normalize(regionFilter ? regionFilter.value : '');
    const typeValue = normalize(typeFilter ? typeFilter.value : '');
    const yearValue = normalize(yearFilter ? yearFilter.value : '');

    cards.forEach(function (card) {
      const text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-keywords')
      ].join(' '));
      const region = normalize(card.getAttribute('data-region'));
      const type = normalize(card.getAttribute('data-type'));
      const year = normalize(card.getAttribute('data-year'));
      const matched = (!searchValue || text.includes(searchValue)) &&
        (!regionValue || region === regionValue) &&
        (!typeValue || type === typeValue) &&
        (!yearValue || year === yearValue);
      card.hidden = !matched;
    });
  };

  [liveSearch, regionFilter, typeFilter, yearFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      if (liveSearch) {
        liveSearch.value = '';
      }
      if (regionFilter) {
        regionFilter.value = '';
      }
      if (typeFilter) {
        typeFilter.value = '';
      }
      if (yearFilter) {
        yearFilter.value = '';
      }
      applyFilters();
    });
  }

  if (cards.length) {
    applyFilters();
  }
})();
