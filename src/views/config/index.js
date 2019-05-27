import { html, view, when } from 'jetstart/src';

import './style.css';
import {
  closeForm, openForm, setProxy, toggleShortcutsHelp,
} from '../../actions/config';
import { resetAll } from '../../actions/init';
import { navigateToDefault } from '../../actions/navigator';
import { breadcrumbs } from '../breadcrumbs';
import { shortcuts } from './shortcuts';

const onCancel = (event) => {
  event.preventDefault();
  closeForm();
};

const onSubmit = (event) => {
  event.preventDefault();
  const proxy = Array.from(event.target.elements).reduce((data, { name, value }) => {
    data[name] = value;
    return data;
  }, {});

  resetAll();
  setProxy(proxy);
  navigateToDefault();
};

const form = ({ baseUrl, username = '', password = '' }) => html`
  <form class="config__form config__form--open" @submit=${onSubmit}>
    <div class="config__inputs">
      <label class="config__label">
        URL
        <input class="config__input input" name="baseUrl"
          placeholder="https://example.com/" .value=${baseUrl} required pattern="^((https?://)|/).+/$">
      </label>
      
      <label class="config__label">
        Username
        <input class="config__input input" name="username" .value=${username}>
      </label>
      
      <label class="config__label">
        Password
        <input class="config__input input" name="password" type="password" .value=${password}>
      </label>
    </div>
    <div class="config__buttons">
      <button type="submit">Save</button>       
      <button @click=${onCancel}>Cancel</button>
    </div>
  </form>`;

const header = isShortcutsModalOpen => html`
  <header class="config__form config__form--closed">
    <div class="config__buttons">
      <button @click=${openForm}>Edit</button>
      <button @click=${toggleShortcutsHelp}>Help</button>
      ${when(isShortcutsModalOpen, () => shortcuts, () => null)}
    </div>
    ${breadcrumbs()}
  </header>
`;

export const config = view(({ render, state }) => {
  const { isFormOpen, isShortcutsModalOpen, proxy } = state.config;
  render`
    <div class="config">
        ${isFormOpen ? form(proxy) : header(isShortcutsModalOpen)}
    </div>`;
});
