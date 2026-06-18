
(function () {
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            const opened = panel.hasAttribute("hidden");
            if (opened) {
                panel.removeAttribute("hidden");
                toggle.setAttribute("aria-expanded", "true");
                document.body.classList.add("no-scroll");
            } else {
                panel.setAttribute("hidden", "");
                toggle.setAttribute("aria-expanded", "false");
                document.body.classList.remove("no-scroll");
            }
        });
    }

    const hero = document.querySelector(".hero");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const panels = Array.from(hero.querySelectorAll(".hero-panel"));
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        let index = slides.findIndex((slide) => slide.classList.contains("active"));
        if (index < 0) {
            index = 0;
        }

        const show = function (target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("active", slideIndex === index);
            });
            panels.forEach((panelItem, panelIndex) => {
                panelItem.classList.toggle("active", panelIndex === index);
            });
        };

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
            });
        }

        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    const filterBars = Array.from(document.querySelectorAll(".filter-bar"));
    filterBars.forEach((bar) => {
        const buttons = Array.from(bar.querySelectorAll(".filter-button"));
        const scope = bar.closest("main") || document;
        const cards = Array.from(scope.querySelectorAll("[data-search-text]"));
        buttons.forEach((button) => {
            button.addEventListener("click", function () {
                const filter = button.getAttribute("data-filter") || "all";
                buttons.forEach((item) => item.classList.toggle("active", item === button));
                cards.forEach((card) => {
                    const text = card.getAttribute("data-search-text") || "";
                    const visible = filter === "all" || text.indexOf(filter) !== -1;
                    card.style.display = visible ? "" : "none";
                });
            });
        });
    });
})();
