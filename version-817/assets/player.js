import { H as Hls } from './hls-vendor-dru42stk.js';

const players = document.querySelectorAll('[data-player]');

players.forEach(function (player) {
  const video = player.querySelector('[data-player-video]');
  const button = player.querySelector('[data-play-button]');
  const status = player.querySelector('[data-player-status]');
  let hls = null;
  let started = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message || '';
    }
  }

  function start() {
    if (!video) {
      return;
    }

    const stream = video.dataset.stream;

    if (!stream) {
      setStatus('暂时无法播放');
      return;
    }

    if (!started) {
      started = true;
      player.classList.add('is-playing');
      video.controls = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            setStatus('暂时无法播放');
          }
        });
      } else {
        setStatus('暂时无法播放');
        return;
      }
    }

    const playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        video.muted = true;
        video.play().catch(function () {
          setStatus('暂时无法播放');
        });
      });
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      start();
    });
  }

  player.addEventListener('click', function (event) {
    if (!started && event.target !== video) {
      start();
    }
  });

  video.addEventListener('play', function () {
    player.classList.add('is-playing');
    setStatus('');
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
