(function () {
  window.createPlayer = function (videoId, buttonId, source) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);

    if (!video || !button || !source) {
      return;
    }

    let loaded = false;
    let hls = null;

    const load = function () {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    };

    const play = function () {
      load();
      button.classList.add('is-hidden');
      video.controls = true;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    };

    button.addEventListener('click', play);

    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
