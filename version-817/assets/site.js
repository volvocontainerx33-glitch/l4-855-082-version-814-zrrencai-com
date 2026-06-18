(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-nav-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero-slider]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const previous = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    const dotsWrap = hero.querySelector('[data-hero-dots]');
    let index = 0;
    let timer = null;

    const dots = slides.map(function (_, dotIndex) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', '切换焦点影片');
      button.addEventListener('click', function () {
        showSlide(dotIndex);
        restart();
      });
      dotsWrap.appendChild(button);
      return button;
    });

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5000);
    }

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        restart();
      });
    }

    showSlide(0);
    restart();
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    const search = scope.querySelector('[data-filter-search]');
    const type = scope.querySelector('[data-filter-type]');
    const year = scope.querySelector('[data-filter-year]');
    const sort = scope.querySelector('[data-filter-sort]');
    const grid = scope.querySelector('[data-card-grid]');
    const cards = grid ? Array.from(grid.querySelectorAll('[data-card]')) : [];
    const count = scope.querySelector('[data-visible-count]');
    const empty = scope.querySelector('[data-empty-state]');

    function applyFilters() {
      const keyword = search ? search.value.trim().toLowerCase() : '';
      const typeValue = type ? type.value : '';
      const yearValue = year ? year.value : '';
      const sortValue = sort ? sort.value : 'default';
      let visible = 0;

      cards.forEach(function (card) {
        const text = (card.dataset.title || '').toLowerCase();
        const cardType = card.dataset.type || '';
        const cardYear = card.dataset.year || '';
        const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchType = !typeValue || cardType.indexOf(typeValue) !== -1;
        const matchYear = !yearValue || cardYear === yearValue;
        const matched = matchKeyword && matchType && matchYear;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (grid && sortValue !== 'default') {
        const sorted = cards.slice().sort(function (a, b) {
          if (sortValue === 'year-desc') {
            return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
          }
          if (sortValue === 'score-desc') {
            return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
          }
          return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
        });
        sorted.forEach(function (card) {
          grid.appendChild(card);
        });
      }

      if (count) {
        count.textContent = visible + ' 部影片';
      }

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, type, year, sort].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  });
})();
