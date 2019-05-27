import { html, repeat } from 'jetstart/src/index';

import { toggleShortcutsHelp } from '../../actions/config';
import { KEYBOARD_BINDINGS } from '../../keyboard';

const SHORTCUTS = Object.entries(KEYBOARD_BINDINGS);

// eslint-disable-next-line no-unused-vars
const item = ([key, [_, description]]) => html`
  <tr>
    <td>${key}</td>
    <td>${description}</td>
  </tr>`;

export const shortcuts = html`
  <section class="config__shortcuts">
    <button @click=${toggleShortcutsHelp}>Close</button>
    <header>
      <h2>Help</h1>
    </header>
    
    <h3>Keyboard shortcuts</h1>
    <table>
      <thead>
        <th>Key</th>
        <th>Action</th>
      </thead>
      <tbody>
        ${repeat(SHORTCUTS, item)}
      </tbody>
    </table>
  </section>`;
