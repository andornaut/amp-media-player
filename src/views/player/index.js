import { html, subscribe, view } from 'jetstart/src';

import './style.css';
import { resetPlayer } from '../../actions/player';
import { selectNextPlaylistItem } from '../../actions/playlist';
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

subscribe(({ isPlaying, url }) => {
  if (!url) {
    // Removing the attribute doesn't seem to work.
    PLAYER_EL.setAttribute('src', '');
    PLAYER_EL.pause();
    return;
  }

  if (isPlaying) {
    const urlAttr = PLAYER_EL.src;
    if (urlAttr !== url) {
      PLAYER_EL.setAttribute('src', url);
    }
    PLAYER_EL.play();
  } else {
    PLAYER_EL.pause();
  }
}, 'player');

const title = url => html`
  <div class="player__title">
    ${toTitle(url)}<a class="player__clear-button" @click=${resetPlayer} title="Clear">✖</a>
  </div>`;

export const player = view(({ render, state }) => {
  const { url } = state.player;
  render`
    <div class="player">
      ${PLAYER_EL}
      ${url ? title(url) : null}
    </div>`;
});
