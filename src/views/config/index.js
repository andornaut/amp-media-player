import { useStatezero } from 'statezero-react-hooks';

import './style.css';
import {
  closeForm,
  openForm,
  setProxy,
  toggleShortcutsHelp,
} from '../../actions/config';
import { resetAll } from '../../actions/init';
import { navigateToDefault } from '../../actions/navigator';
import { Breadcrumbs } from '../breadcrumbs';
import { Shortcuts } from './shortcuts';

const onCancel = (event) => {
  event.preventDefault();
  closeForm();
};

const onSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const proxy = Object.fromEntries(formData.entries());

  resetAll();
  setProxy(proxy);
  navigateToDefault();
};

const ConfigForm = ({ proxy }) => {
  const { baseUrl, username = '', password = '' } = proxy;
  return (
    <form className="config__form config__form--open" onSubmit={onSubmit}>
      <div className="config__inputs">
        <label className="config__label">
          URL
          <input
            className="config__input input"
            name="baseUrl"
            placeholder="https://example.com/"
            defaultValue={baseUrl}
            required
            pattern="^((https?://)|/).+/$"
          />
        </label>

        <label className="config__label">
          Username
          <input
            className="config__input input"
            name="username"
            defaultValue={username}
          />
        </label>

        <label className="config__label">
          Password
          <input
            className="config__input input"
            name="password"
            type="password"
            defaultValue={password}
          />
        </label>
      </div>
      <div className="config__buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const Header = ({ isShortcutsModalOpen }) => (
  <header className="config__form config__form--closed">
    <div className="config__buttons">
      <button onClick={openForm}>Edit</button>
      <button onClick={toggleShortcutsHelp}>Help</button>
      {isShortcutsModalOpen && <Shortcuts />}
    </div>
    <Breadcrumbs />
  </header>
);

export const Config = () => {
  const configState = useStatezero((state) => state.config || {});
  const { isFormOpen, isShortcutsModalOpen, proxy } = configState;

  return (
    <div className="config">
      {isFormOpen ? (
        <ConfigForm proxy={proxy} />
      ) : (
        <Header isShortcutsModalOpen={isShortcutsModalOpen} />
      )}
    </div>
  );
};
