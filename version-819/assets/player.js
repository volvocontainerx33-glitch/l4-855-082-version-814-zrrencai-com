var MoviePlayer = (function () {
    function mount(videoId, source, cover, buttonId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var started = false;
        var hlsInstance = null;

        if (!video || !button) {
            return;
        }

        function attachSource() {
            if (started) {
                return;
            }
            started = true;
            video.poster = cover;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            attachSource();
            button.style.display = "none";
            video.controls = true;
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    button.style.display = "flex";
                });
            }
        }

        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (!started || video.paused) {
                start();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    return {
        mount: mount
    };
})();
