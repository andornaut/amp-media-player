import { action, defineGetter, getState } from 'jetstart/src';

import { cycle, isFile } from '../../helpers';
import { enqueue } from '../playlist';
import {
  clearCache, getFromCache, removeFromCache, setInCache,
} from './cache';
import {
  getBreadcrumbs, getCurrent, getFilteredFiles, getFilteredItems,
} from './getters';
import { scrapeUrls } from './spider';

export const defineNavigationGetters = () => {
  defineGetter('navigator.breadcrumbs', getBreadcrumbs);
  defineGetter('navigator.filteredItems', getFilteredItems);
  defineGetter('navigator.filteredFiles', getFilteredFiles);
  defineGetter('navigator.current', getCurrent);
};

const clearNavigator = (state) => {
  Object.assign(state.navigator, {
    filter: '',
    index: 0,
    shouldTriggerFocus: false,
    items: [],
    url: '',
  });
};

export const resetNavigation = action(({ commit, state }) => {
  clearCache();
  state.navigator = {};
  clearNavigator(state);
  commit(state);
  defineNavigationGetters();
});

export const enqueueFilteredFiles = action(({ state }) => {
  enqueue(...state.navigator.filteredFiles);
});

export const disableFocusTrigger = action(({ commit, state }) => {
  state.navigator.shouldTriggerFocus = false;
  commit(state);
});

export const enableFocusTrigger = action(({ commit, state }) => {
  state.navigator.shouldTriggerFocus = true;
  commit(state);
});

export const navigate = action(async ({ commit, state }, url) => {
  clearNavigator(state);

  // If `url` is cached, then `items` will be updated on a subsequent navigation to the same url.
  const itemsPromise = scrapeUrls(url, state.config.proxy)
    .then((items) => {
      setInCache(url, items);
      return items;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error fetching', url, err);
      removeFromCache(url);
      return [];
    });

  const items = getFromCache(url) || (await itemsPromise);
  Object.assign(state.navigator, {
    items,
    url,
  });
  commit(state);
});

export const refresh = action(({ state: { navigator: { url } } }) => {
  if (!url) {
    return;
  }
  removeFromCache(url);
  navigate(url);
});

export const navigateBackward = action(({ state }) => {
  const { breadcrumbs } = state.navigator;
  const idx = breadcrumbs.length - 2;
  if (idx >= 0) {
    navigate(breadcrumbs[idx]);
  }
});

export const navigateForward = action(({ state }) => {
  const { current } = state.navigator;
  if (!current) {
    return;
  }
  if (isFile(current)) {
    enqueue(current);
  } else {
    navigate(current);
  }
});

export const selectNextNavigatorItem = action(({ commit, state }) => {
  const { filteredItems, index } = state.navigator;
  state.navigator.index = cycle(filteredItems.length, index + 1);
  commit(state);
});

export const selectPreviousNavigatorItem = action(({ commit, state }) => {
  const { filteredItems, index } = state.navigator;
  state.navigator.index = cycle(filteredItems.length, index - 1);
  commit(state);
});

export const navigateToDefault = () => {
  const [url, baseUrl] = getState(['navigator.url', 'config.proxy.baseUrl']);
  navigate(url || baseUrl);
};

export const setFilter = action(({ commit, state }, filter) => {
  state.navigator.filter = filter;
  commit(state);
});
