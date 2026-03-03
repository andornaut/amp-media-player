import { action, subscribe } from '../state';
import { fromStorage, toStorage } from '../storage';
import { resetConfig } from './config';
import { defineNavigationGetters, resetNavigation } from './navigator';
import { resetPlayer } from './player';
import { definePlaylistGetters, resetPlaylist } from './playlist';

export const hydrateConfig = action(({ commit, state }, { config = {} }) => {
  state.config = config;
  commit(state);
});

export const hydrateNavigator = action(
  ({ commit, state }, { navigator = {} }) => {
    state.navigator = navigator;
    state.navigator.isLoading = false;
    state.navigator.error = null;
    commit(state);
    defineNavigationGetters();
  },
);

export const hydratePlayer = action(({ commit, state }, { player = {} }) => {
  state.player = player;
  state.player.isPlaying = false;
  commit(state);
});

export const hydratePlaylist = action(
  ({ commit, state }, { playlist = {} }) => {
    state.playlist = playlist;
    commit(state);
    definePlaylistGetters();
  },
);

const hydrators = [
  hydrateConfig,
  hydrateNavigator,
  hydratePlayer,
  hydratePlaylist,
];

export const resetAll = () => {
  resetConfig();
  resetNavigation();
  resetPlayer();
  resetPlaylist();
};

export const initState = async () => {
  const initialState = await fromStorage();
  if (initialState) {
    hydrators.forEach((hydrate) => hydrate(initialState));
  } else {
    resetAll();
  }

  subscribe(toStorage);
};
