import { action } from 'jetstart/src';

export const resetPlayer = action(({ commit, state }) => {
  state.player = { isPlaying: false, url: null };
  commit(state);
});

export const play = action(({ commit, state }, url) => {
  Object.assign(state.player, { isPlaying: true, url });
  commit(state);
});

export const togglePlayPause = action(({ commit, state }) => {
  state.player.isPlaying = !state.player.isPlaying;
  commit(state);
});
