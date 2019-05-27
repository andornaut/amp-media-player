import { html, repeat, view } from 'jetstart/src';

import { navigate } from '../../actions/navigator';
import { toTitle } from '../../transform';
import './style.css';

const ROOT_SHORTCUT = 'Shortcut: ctrl + b';
const UP_SHORTCUT = 'Shortcut: b or backspace';

const onClick = (event) => {
  event.preventDefault();
  const { href } = event.target;
  navigate(href);
};

const breadcrumb = (className, label, title, url) => html`
  <a class=${`breadcrumbs__item ${className}`} href=${url} @click=${onClick} title=${title}>${label}</a>`;

const toRoot = (url, title) => breadcrumb('breadcrumbs__item--root', title, ROOT_SHORTCUT, url);

const toSubdir = url => breadcrumb('breadcrumbs__item--subdir', toTitle(url), UP_SHORTCUT, url);

export const breadcrumbs = view(({ render, state }) => {
  const {
    breadcrumbs: [root, ...others],
  } = state.navigator;
  render`
    <div class=breadcrumbs>
      ${toRoot(root, state.config.proxy.baseUrl)}
      ${repeat(others, toSubdir)}
    </div>`;
});
