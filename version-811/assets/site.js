(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = all('[data-hero-slide]', carousel);
        var dots = all('[data-hero-dot]', carousel);
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        show(0);
        start();
    }

    function initFilters() {
        var input = document.querySelector('[data-search-input]');
        var filters = all('[data-filter]');
        var cards = all('[data-movie-card]');
        if (!input && !filters.length) {
            return;
        }

        function normalized(value) {
            return String(value || '').toLowerCase().trim();
        }

        function matchCard(card) {
            var query = normalized(input ? input.value : '');
            var haystack = normalized(card.getAttribute('data-search'));
            if (query && haystack.indexOf(query) === -1) {
                return false;
            }
            for (var i = 0; i < filters.length; i += 1) {
                var filter = filters[i];
                var key = filter.getAttribute('data-filter');
                var value = normalized(filter.value);
                if (!value) {
                    continue;
                }
                if (normalized(card.getAttribute('data-' + key)) !== value) {
                    return false;
                }
            }
            return true;
        }

        function update() {
            cards.forEach(function (card) {
                card.classList.toggle('is-hidden-card', !matchCard(card));
            });
        }

        if (input) {
            input.addEventListener('input', update);
        }
        filters.forEach(function (filter) {
            filter.addEventListener('change', update);
        });
        update();
    }

    window.initPlayer = function (videoId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        if (!video || !button || !streamUrl) {
            return;
        }
        var started = false;
        var hls = null;

        function playVideo() {
            var action = video.play();
            if (action && typeof action.catch === 'function') {
                action.catch(function () {});
            }
        }

        function start() {
            if (started) {
                playVideo();
                return;
            }
            started = true;
            button.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                playVideo();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                return;
            }
            video.src = streamUrl;
            playVideo();
        }

        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (!started) {
                start();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
    });
}());
