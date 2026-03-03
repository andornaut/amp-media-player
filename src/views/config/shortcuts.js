import { toggleShortcutsHelp } from '../../actions/config';
import { KEYBOARD_BINDINGS } from '../../keyboard';

const SHORTCUTS = Object.entries(KEYBOARD_BINDINGS);

export const Shortcuts = () => (
  <section className="config__shortcuts">
    <button onClick={toggleShortcutsHelp}>Close</button>
    <header>
      <h2>Help</h2>
    </header>

    <h3>Keyboard shortcuts</h3>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {SHORTCUTS.map(([key, [, description]]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);
