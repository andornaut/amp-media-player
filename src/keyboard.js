import { toggleShortcutsHelp } from './actions/config';
import {
  enqueueFilteredFiles,
  enableFocusTrigger,
  navigateBackward,
  navigateForward,
  selectNextNavigatorItem,
  selectPreviousNavigatorItem,
  refresh,
} from './actions/navigator';
import { resetPlayer, togglePlayPause } from './actions/player';
import { resetPlaylist, selectNextPlaylistItem, selectPreviousPlaylistItem } from './actions/playlist';

export const KEYBOARD_BINDINGS = {
  '?': [toggleShortcutsHelp, 'Toggle this shortcuts help'],
  '/': [enableFocusTrigger, 'Focus on the search box'],
  p: [togglePlayPause, 'Toggle Play/Pause'],
  x: [resetPlayer, 'Clear the current player file'],
  c: [resetPlaylist, 'Clear the playlist'],
  a: [enqueueFilteredFiles, 'Enqueue files'],
  r: [refresh, 'Refresh the current location'],
  b: [navigateBackward, 'Navigate backwards'],
  f: [navigateForward, 'Navigate forward'],
  Enter: [navigateForward, 'Navigate forward'],
  ArrowDown: [selectNextNavigatorItem, 'Select next navigator entry'],
  j: [selectNextNavigatorItem, 'Select next navigator entry'],
  ArrowUp: [selectPreviousNavigatorItem, 'Select previous navigator entry'],
  k: [selectPreviousNavigatorItem, 'Select previous navigator entry'],
  ArrowRight: [selectNextPlaylistItem, 'Select next playlist entry'],
  l: [selectNextPlaylistItem, 'Select next playlist file'],
  ArrowLeft: [selectPreviousPlaylistItem, 'Select previous playlist entry'],
  h: [selectPreviousPlaylistItem, 'Select previous playlist entry'],
};

export const initKeyboard = () => {
  document.addEventListener('keydown', (event) => {
    const {
      key,
      target: { form },
    } = event;
    if (form) {
      // The search form requires special handling to blur when Escape is pressed.
      if (form.name === 'search' && key === 'Escape') {
        const tmp = document.createElement('input');
        form.appendChild(tmp);
        tmp.focus();
        form.removeChild(tmp);
      }
      return;
    }
    const config = KEYBOARD_BINDINGS[key];
    if (!config) {
      return;
    }
    event.preventDefault();
    const [action] = config;
    action();
  });
};
