
(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  ready(function () {
    var video = document.querySelector('video[data-video]');
    var layer = document.querySelector('[data-play-layer]');
    var prepared = false;
    var hlsInstance = null;

    if (!video) {
      return;
    }

    function prepare() {
      if (prepared) {
        return Promise.resolve();
      }

      prepared = true;
      var src = video.getAttribute('data-video') || '';

      if (!src) {
        return Promise.resolve();
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        return new Promise(function (resolve) {
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
        });
      }

      video.src = src;
      return Promise.resolve();
    }

    function hideLayer() {
      if (layer) {
        layer.classList.add('is-hidden');
      }
    }

    function play() {
      prepare().then(function () {
        hideLayer();
        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            if (layer) {
              layer.classList.remove('is-hidden');
            }
          });
        }
      });
    }

    if (layer) {
      layer.addEventListener('click', play);
    }

    video.addEventListener('play', hideLayer);
    video.addEventListener('click', function () {
      if (!prepared || video.paused) {
        play();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
