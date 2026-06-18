(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const nextButton = carousel.querySelector('[data-hero-next]');
    const prevButton = carousel.querySelector('[data-hero-prev]');
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  const filterForm = document.querySelector('[data-filter-form]');

  if (filterForm) {
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const inputs = Array.from(filterForm.querySelectorAll('[data-filter-input]'));
    const resetButton = filterForm.querySelector('[data-filter-reset]');
    const countNode = filterForm.querySelector('[data-filter-count]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function setInitialValue(name) {
      const value = getUrlParam(name);
      if (!value) {
        return;
      }

      const field = filterForm.querySelector('[name="' + name + '"]');
      if (field) {
        field.value = value;
      }
    }

    setInitialValue('q');
    setInitialValue('region');
    setInitialValue('type');
    setInitialValue('year');

    function updateFilter() {
      const q = normalize(filterForm.querySelector('[name="q"]')?.value);
      const region = filterForm.querySelector('[name="region"]')?.value || '';
      const type = filterForm.querySelector('[name="type"]')?.value || '';
      const year = filterForm.querySelector('[name="year"]')?.value || '';
      let visible = 0;

      cards.forEach(function (card) {
        const matchesQuery = !q || normalize(card.dataset.search).includes(q);
        const matchesRegion = !region || card.dataset.region === region;
        const matchesType = !type || card.dataset.type === type;
        const matchesYear = !year || card.dataset.year === year;
        const shouldShow = matchesQuery && matchesRegion && matchesType && matchesYear;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = '显示 ' + visible + ' 部影片';
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', updateFilter);
      input.addEventListener('change', updateFilter);
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        inputs.forEach(function (input) {
          input.value = '';
        });
        updateFilter();
      });
    }

    updateFilter();
  }

  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  const searchTitle = document.querySelector('[data-search-title]');
  const searchCount = document.querySelector('[data-search-count]');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function compactNumber(number) {
    const value = Number(number) || 0;
    if (value >= 10000) {
      return (value / 10000).toFixed(1) + '万';
    }
    return String(value);
  }

  function createSearchCard(movie) {
    const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + escapeHtml(movie.detailUrl) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="play-float">▶</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <div class="meta-line">',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '    </div>',
      '    <h3><a href="' + escapeHtml(movie.detailUrl) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '    <div class="card-stats">',
      '      <span>热度 ' + compactNumber(movie.views) + '</span>',
      '      <span>喜欢 ' + compactNumber(movie.likes) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function runSearch(query) {
    if (!searchResults || !window.MOVIES) {
      return;
    }

    const q = String(query || '').trim().toLowerCase();
    const movies = Array.isArray(window.MOVIES) ? window.MOVIES : [];
    let results = [];

    if (!q) {
      results = movies.slice().sort(function (a, b) {
        return (b.views + b.likes * 10) - (a.views + a.likes * 10);
      }).slice(0, 36);
      if (searchTitle) {
        searchTitle.textContent = '推荐影片';
      }
      if (searchCount) {
        searchCount.textContent = '展示热度较高的 36 部影片。';
      }
    } else {
      results = movies.filter(function (movie) {
        const haystack = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.oneLine,
          movie.summary,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      }).slice(0, 120);

      if (searchTitle) {
        searchTitle.textContent = '“' + query + '” 的搜索结果';
      }
      if (searchCount) {
        searchCount.textContent = '找到 ' + results.length + ' 部匹配影片，最多显示前 120 部。';
      }
    }

    searchResults.innerHTML = results.map(createSearchCard).join('');
  }

  if (searchForm && searchInput) {
    const initialQuery = getUrlParam('q');
    if (initialQuery) {
      searchInput.value = initialQuery;
    }

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch(searchInput.value);
    });

    searchInput.addEventListener('input', function () {
      runSearch(searchInput.value);
    });

    document.querySelectorAll('[data-quick-search]').forEach(function (button) {
      button.addEventListener('click', function () {
        searchInput.value = button.dataset.quickSearch || '';
        runSearch(searchInput.value);
      });
    });

    runSearch(searchInput.value);
  }

  function initializePlayer(player) {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-player-button]');
    const status = player.querySelector('[data-player-status]');
    const source = player.dataset.src;
    let hlsInstance = null;
    let initialized = false;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function playVideo() {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          setStatus('浏览器阻止了自动播放，请再次点击播放按钮');
        });
      }
    }

    function loadSource() {
      if (!source || !video) {
        setStatus('未找到播放源');
        return;
      }

      if (initialized) {
        playVideo();
        return;
      }

      initialized = true;
      setStatus('正在加载播放源…');

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('片源加载完成');
          playVideo();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放加载失败，请刷新页面或检查网络');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setStatus('片源加载完成');
          playVideo();
        }, { once: true });
      } else {
        setStatus('当前浏览器不支持 HLS 播放');
      }
    }

    if (button) {
      button.addEventListener('click', function () {
        button.classList.add('hide');
        loadSource();
      });
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('hide');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('hide');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(initializePlayer);
}());
