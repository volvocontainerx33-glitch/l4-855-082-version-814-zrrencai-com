
(function () {
    const form = document.querySelector(".search-box");
    const input = document.querySelector("#search-input");
    const list = document.querySelector("#search-results");
    const status = document.querySelector(".search-status");

    if (!form || !input || !list || !Array.isArray(window.MOVIE_SEARCH_INDEX)) {
        return;
    }

    const escapeHtml = function (value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") || "";
    input.value = initial;

    const render = function (items, query) {
        const limited = items.slice(0, 120);
        list.innerHTML = limited.map(function (movie, index) {
            return `
<a class="movie-card" href="${movie.url}" data-search-text="${escapeHtml(movie.text)}">
    <div class="movie-thumb">
        <img src="${movie.cover}" alt="${escapeHtml(movie.title)}" loading="lazy">
        <span class="corner-label">${escapeHtml(movie.type)}</span>
        <span class="rank-badge">${index + 1}</span>
        <span class="play-hover">▶</span>
    </div>
    <div class="movie-info">
        <h3>${escapeHtml(movie.title)}</h3>
        <p>${escapeHtml(movie.oneLine)}</p>
        <div class="card-meta">
            <span>${escapeHtml(movie.year)}</span>
            <span>${escapeHtml(movie.region)}</span>
        </div>
        <div class="card-tags"><span>${escapeHtml(movie.genre)}</span></div>
    </div>
</a>`;
        }).join("");
        if (query) {
            status.textContent = limited.length ? "已为你匹配相关影片" : "没有找到相关影片";
        } else {
            status.textContent = "输入片名、地区、年份或类型即可筛选片库";
        }
    };

    const search = function (query) {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            render(window.MOVIE_SEARCH_INDEX.slice(0, 60), "");
            return;
        }
        const terms = normalized.split(/\s+/).filter(Boolean);
        const result = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
            const text = String(movie.text || "").toLowerCase();
            return terms.every(function (term) {
                return text.indexOf(term) !== -1;
            });
        });
        render(result, normalized);
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const query = input.value.trim();
        const url = query ? `search.html?q=${encodeURIComponent(query)}` : "search.html";
        window.history.replaceState(null, "", url);
        search(query);
    });

    input.addEventListener("input", function () {
        search(input.value);
    });

    search(initial);
})();
