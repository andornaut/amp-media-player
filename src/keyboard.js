import { toggleShortcutsHelp } from "./actions/config";
import {
  enableFocusTrigger,
  enqueueFilteredFiles,
  navigateBackward,
  navigateForward,
  refresh,
  selectNextNavigatorItem,
  selectPreviousNavigatorItem,
} from "./actions/navigator";
import { resetPlayer, togglePlayPause } from "./actions/player";
import {
  resetPlaylist,
  selectNextPlaylistItem,
  selectPreviousPlaylistItem,
} from "./actions/playlist";

export const KEYBOARD_BINDINGS = {
  "/": [enableFocusTrigger, "Focus on the search box"],
  "?": [toggleShortcutsHelp, "Toggle this shortcuts help"],
  ArrowDown: [selectNextNavigatorItem, "Select next navigator entry"],
  ArrowLeft: [selectPreviousPlaylistItem, "Select previous playlist entry"],
  ArrowRight: [selectNextPlaylistItem, "Select next playlist entry"],
  ArrowUp: [selectPreviousNavigatorItem, "Select previous navigator entry"],
  Enter: [navigateForward, "Navigate forward"],
  a: [enqueueFilteredFiles, "Enqueue files"],
  b: [navigateBackward, "Navigate backwards"],
  c: [resetPlaylist, "Clear the playlist"],
  f: [navigateForward, "Navigate forward"],
  h: [selectPreviousPlaylistItem, "Select previous playlist entry"],
  j: [selectNextNavigatorItem, "Select next navigator entry"],
  k: [selectPreviousNavigatorItem, "Select previous navigator entry"],
  l: [selectNextPlaylistItem, "Select next playlist file"],
  p: [togglePlayPause, "Toggle Play/Pause"],
  r: [refresh, "Refresh the current location"],
  x: [resetPlayer, "Clear the current player file"],
};

export const initKeyboard = () => {
  document.addEventListener("keydown", (event) => {
    const {
      key,
      target: { form },
    } = event;
    if (form) {
      // The search form requires special handling to blur when Escape is pressed.
      if (form.name === "search" && key === "Escape") {
        event.target.blur();
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
