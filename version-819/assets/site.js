document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".site-menu-toggle");
    var menu = document.querySelector(".mobile-menu");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    var slides = Array.from(document.querySelectorAll(".hero-slide"));
    var dots = Array.from(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            setSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            setSlide(current + 1);
        }, 5200);
    }

    var input = document.querySelector(".filter-input");
    var cards = Array.from(document.querySelectorAll(".movie-card"));
    var empty = document.querySelector(".empty-note");

    if (input && cards.length) {
        input.addEventListener("input", function () {
            var value = input.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                var match = !value || haystack.indexOf(value) !== -1;
                card.style.display = match ? "" : "none";
                if (match) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? "none" : "block";
            }
        });
    }
});
