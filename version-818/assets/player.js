(function () {
  function setupMoviePlayer(config) {
    var video = document.getElementById(config.videoId);
    var cover = document.getElementById(config.coverId);
    var streamUrl = config.streamUrl;
    var attached = false;
    var hlsInstance = null;

    if (!video || !cover || !streamUrl) {
      return;
    }

    function attachStream() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = streamUrl;
    }

    function playVideo() {
      attachStream();
      cover.classList.add('is-hidden');
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          cover.classList.remove('is-hidden');
        });
      }
    }

    cover.addEventListener('click', playVideo);

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      cover.classList.add('is-hidden');
    });

    video.addEventListener('ended', function () {
      cover.classList.remove('is-hidden');
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
