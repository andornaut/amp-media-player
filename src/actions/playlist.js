import { cycle } from '../helpers';
import { action, defineGetter } from '../state';
import { play } from './player';

const getCurrent = ({ index, items }) => items[index];

export const definePlaylistGetters = () => {
  defineGetter('playlist.current', getCurrent);
};

export const resetPlaylist = action(({ commit, state }) => {
  state.playlist = { index: 0, items: [] };
  commit(state);
  definePlaylistGetters();
});

export const dequeueIndex = action(({ commit, state }, index) => {
  const { items } = state.playlist;
  items.splice(index, 1);
  if (index >= items.length) {
    state.playlist.index = Math.max(0, items.length - 1);
  }
  commit(state);
});

export const enqueue = action(({ commit, state }, ...url) => {
  state.playlist.items = state.playlist.items.concat(url);
  commit(state);
});

export const selectIndex = action(({ commit, state }, index) => {
  state.playlist.index = index;
  commit(state);
  play(state.playlist.current);
});

export const selectNextPlaylistItem = action(({ commit, state }) => {
  const { index, items } = state.playlist;
  state.playlist.index = cycle(items.length, index + 1);
  commit(state);
  play(state.playlist.current);
});

export const selectPreviousPlaylistItem = action(({ commit, state }) => {
  const { index, items } = state.playlist;
  state.playlist.index = cycle(items.length, index - 1);
  commit(state);
  play(state.playlist.current);
});
