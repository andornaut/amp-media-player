import { action } from 'jetstart/src';

export const resetConfig = action(({ commit, state }) => {
  state.config = {
    isFormOpen: false,
    isShortcutsModalOpen: false,
    proxy: {
      baseUrl: '/',
    },
  };
  commit(state);
});

export const closeForm = action(({ commit, state }) => {
  state.config.isFormOpen = false;
  commit(state);
});

export const openForm = action(({ commit, state }) => {
  state.config.isFormOpen = true;
  commit(state);
});

export const setProxy = action(({ commit, state }, proxy) => {
  state.config.proxy = proxy;
  commit(state);
});

export const toggleShortcutsHelp = action(({ commit, state }) => {
  state.config.isShortcutsModalOpen = !state.config.isShortcutsModalOpen;
  commit(state);
});
