import { action } from '../state';

export const resetPlayer = action(({ commit, state }) => {
  state.player = {
    isPlaying: false,
    url: null,
    volume: state.player?.volume ?? 1,
  };
  commit(state);
});

export const play = action(({ commit, state }, url) => {
  state.player = state.player || {};
  Object.assign(state.player, { isPlaying: true, url });
  commit(state);
});

export const togglePlayPause = action(({ commit, state }) => {
  state.player.isPlaying = !state.player.isPlaying;
  commit(state);
});

export const setVolume = action(({ commit, state }, volume) => {
  state.player.volume = volume;
  commit(state);
});
