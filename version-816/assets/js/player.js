(function () {
  window.initMoviePlayer = function (videoId, sourceUrl) {
    var video = document.getElementById(videoId);
    if (!video) {
      return;
    }
    var buttons = document.querySelectorAll('[data-player="' + videoId + '"]');
    var started = false;
    var hls = null;

    function hideButtons() {
      buttons.forEach(function (button) {
        button.classList.add("is-hidden");
      });
    }

    function playVideo() {
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    function start() {
      hideButtons();
      if (started) {
        playVideo();
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        playVideo();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        window.setTimeout(playVideo, 350);
        return;
      }
      video.src = sourceUrl;
      playVideo();
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", start);
    });
    video.addEventListener("click", function () {
      if (!started) {
        start();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
