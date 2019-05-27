import {
  html, repeat, subscribe, view,
} from 'jetstart/src';

import {
  enqueueFilteredFiles,
  navigate,
  navigateForward,
  setFilter,
  disableFocusTrigger,
} from '../../actions/navigator';
import { enqueue } from '../../actions/playlist';
import { isFile } from '../../helpers';
import { toFilename } from '../../transform';
import './style.css';

const onClickAnchor = action => (event) => {
  event.preventDefault();
  action(event.target.href);
};

const onInputSearchFilter = (event) => {
  setFilter(event.target.value);
};

const onSubmit = (event) => {
  event.preventDefault();
  navigateForward();
};

const addAllButton = html`
  <button class="navigator__add-all-button" @click=${enqueueFilteredFiles}>Add all files</button>`;

const item = current => (url) => {
  const action = isFile(url) ? enqueue : navigate;
  const cssClass = `navigator__item${url === current ? ' navigator__item--active' : ''}`;
  return html`
    <a class=${cssClass} href=${url} @click=${onClickAnchor(action)}>
      ${toFilename(url)}
    </a>`;
};

const searchForm = filter => html`
  <form class="navigator__search-form" name="search" @submit=${onSubmit}>
    <input class="navigator__search-input input" @input=${onInputSearchFilter} type="search" .value=${filter}>
  </form>`;

export const navigator = view(({ render, state }) => {
  const {
    current, filter, filteredFiles, filteredItems, items,
  } = state.navigator;
  render`
    <div class="navigator">
      ${items.length ? searchForm(filter) : null}
      ${filteredFiles.length ? addAllButton : null}
      <div class="navigator__list">
        ${repeat(filteredItems, item(current))}
      </div>
    </div>`;
});

subscribe(({ shouldTriggerFocus }) => {
  if (shouldTriggerFocus) {
    const el = document.querySelector('.navigator__search-input');
    if (el) {
      el.focus();
    }
    disableFocusTrigger();
  }
}, 'navigator');
