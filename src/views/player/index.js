import { html, subscribe, view } from 'jetstart/src';

import './style.css';
import { resetPlayer, togglePlayPause } from '../../actions/player';
import {
  selectNextPlaylistItem,
  selectPreviousPlaylistItem,
} from '../../actions/playlist';
import { toTitle } from '../../transform';

const createPlayer = () => {
  const el = document.createElement('audio');
  el.classList.add('player__media');
  el.setAttribute('controls', '');
  el.setAttribute('preload', '');
  el.textContent = 'Sorry, this media format is not supported.';
  return el;
};

const PLAYER_EL = createPlayer();

PLAYER_EL.addEventListener('ended', selectNextPlaylistItem);

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', togglePlayPause);
  navigator.mediaSession.setActionHandler('pause', togglePlayPause);
  navigator.mediaSession.setActionHandler(
    'previoustrack',
    selectPreviousPlaylistItem,
  );
  navigator.mediaSession.setActionHandler('nexttrack', selectNextPlaylistItem);
}

subscribe(({ isPlaying, url }) => {
  if (!url) {
    // Removing the attribute doesn't seem to work.
    PLAYER_EL.setAttribute('src', '');
    PLAYER_EL.pause();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.metadata = null;
    }
    return;
  }

  if (isPlaying) {
    const urlAttr = PLAYER_EL.src;
    if (urlAttr !== url) {
      PLAYER_EL.setAttribute('src', url);
    }
    PLAYER_EL.play();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: toTitle(url),
        artist: 'amp-media-player',
        album: 'amp-media-player',
      });
    }
  } else {
    PLAYER_EL.pause();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    }
  }
}, 'player');

const title = (url) =>
  html` <div class="player__title">
    ${toTitle(url)}<a
      class="player__clear-button"
      @click=${resetPlayer}
      title="Clear"
      >✖</a
    >
  </div>`;

export const player = view(({ render, state }) => {
  const { url } = state.player;
  render`
    <div class="player">
      ${PLAYER_EL}
      ${url ? title(url) : null}
    </div>`;
});
