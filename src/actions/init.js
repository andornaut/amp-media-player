import { action, subscribe } from 'jetstart/src';

import { fromStorage, toStorage } from '../storage';
import { resetConfig } from './config';
import { defineNavigationGetters, resetNavigation } from './navigator';
import { resetPlayer } from './player';
import { definePlaylistGetters, resetPlaylist } from './playlist';

export const resetAll = () => {
  resetConfig();
  resetNavigation();
  resetPlayer();
  resetPlaylist();
};

export const initState = () => {
  const initialState = fromStorage();
  if (initialState) {
    initialState.player.isPlaying = false;
    action(({ commit }) => commit(initialState))();
    defineNavigationGetters();
    definePlaylistGetters();
  } else {
    resetAll();
  }

  subscribe(toStorage);
};
