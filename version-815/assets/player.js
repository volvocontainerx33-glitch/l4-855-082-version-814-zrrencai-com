
export function initPlayer(options) {
    const video = options.video;
    const overlay = options.overlay;
    const button = options.button;
    const message = options.message;
    const source = options.source;
    let started = false;
    let hlsReady = false;

    const setMessage = function (text) {
        if (!message) {
            return;
        }
        message.textContent = text;
        message.classList.add("show");
    };

    const hideOverlay = function () {
        if (overlay) {
            overlay.classList.add("hidden");
        }
    };

    const loadScript = function () {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        return new Promise(function (resolve, reject) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js";
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const attachNative = function () {
        video.src = source;
        return video.play();
    };

    const attachHls = function (Hls) {
        return new Promise(function (resolve, reject) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                hlsReady = true;
                video.play().then(resolve).catch(reject);
            });
            hls.on(Hls.Events.ERROR, function (_event, data) {
                if (data && data.fatal) {
                    reject(new Error("media"));
                }
            });
        });
    };

    const start = function () {
        if (!video || !source) {
            return;
        }
        hideOverlay();
        if (started && hlsReady) {
            video.play().catch(function () {});
            return;
        }
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            attachNative().catch(function () {
                setMessage("视频暂时无法播放，请稍后再试。");
            });
            return;
        }
        loadScript()
            .then(function (Hls) {
                if (Hls && Hls.isSupported()) {
                    return attachHls(Hls);
                }
                setMessage("视频暂时无法播放，请稍后再试。");
                return null;
            })
            .catch(function () {
                setMessage("视频暂时无法加载，请稍后再试。");
            });
    };

    if (overlay) {
        overlay.addEventListener("click", start);
    }
    if (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            start();
        });
    }
    if (video) {
        video.addEventListener("click", function () {
            if (!started) {
                start();
            }
        });
    }
}
