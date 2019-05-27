import { html, repeat, view } from 'jetstart/src';

import './style.css';
import { dequeueIndex, resetPlaylist, selectIndex } from '../../actions/playlist';
import { toFilename } from '../../transform';

const onClickPlay = (event) => {
  event.preventDefault();
  selectIndex(parseInt(event.target.dataset.index, 10));
};

const onClickRemove = (event) => {
  event.preventDefault();
  dequeueIndex(parseInt(event.target.dataset.index, 10));
};

const clearButton = () => html`<button class="playlist__clear-button" @click=${resetPlaylist}>Clear playlist</button>`;

const item = index => (url, i) => {
  const cssClass = `playlist__item${i === index ? ' playlist__item--active' : ''}`;
  const filename = toFilename(url);
  return html`<span class=${cssClass}>
      <a data-index=${i} href=${url} class="playlist__play" @click=${onClickPlay} title="Play">${filename}</a>
      <button data-index=${i} class="playlist__remove-button" @click="${onClickRemove}" 
        title="Remove from playlist">✖</button>
    </span>`;
};

export const playlist = view(({ render, state }) => {
  const { index, items } = state.playlist;
  render`
    <div class="playlist">
      ${items.length ? clearButton() : null}      
      <div class="playlist__list">
        ${repeat(items, item(index))}
      </div>
    </div>`;
});
