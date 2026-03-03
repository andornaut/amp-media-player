import { cycle, isFile } from '../../helpers';
import { enqueue } from '../playlist';
import {
  clearCache, getFromCache, removeFromCache, setInCache,
} from './cache';
import {
  getBreadcrumbs,
  getCurrent,
  getFilteredFiles,
  getFilteredItems,
} from './getters';
import { scrapeUrls } from './spider';
import { action, defineGetter, getState } from '../../state';

export const defineNavigationGetters = () => {
  defineGetter('navigator.breadcrumbs', getBreadcrumbs);
  defineGetter('navigator.filteredItems', getFilteredItems);
  defineGetter('navigator.filteredFiles', getFilteredFiles);
  defineGetter('navigator.current', getCurrent);
};

const clearNavigator = (state) => {
  state.navigator = state.navigator || {};
  Object.assign(state.navigator, {
    filter: '',
    index: 0,
    shouldTriggerFocus: false,
    items: [],
    url: '',
    isLoading: false,
    error: null,
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

const transition = (cb) => {
  if (document.startViewTransition) {
    document.startViewTransition(cb);
  } else {
    cb();
  }
};

export const navigate = action(async ({ commit, state }, url) => {
  const cachedItems = getFromCache(url);
  if (cachedItems) {
    transition(() => {
      Object.assign(state.navigator, {
        url,
        items: cachedItems,
        isLoading: false,
        error: null,
      });
      commit(state);
    });
    return;
  }

  clearNavigator(state);
  state.navigator.url = url;
  state.navigator.isLoading = true;
  commit(state);

  try {
    const items = await scrapeUrls(url, state.config.proxy);
    setInCache(url, items);

    transition(() => {
      Object.assign(state.navigator, {
        items,
        isLoading: false,
        error: null,
      });
      commit(state);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching', url, err);
    state.navigator.isLoading = false;
    state.navigator.error = 'Failed to load directory. Check your connection or proxy settings.';
    commit(state);
  }
});

export const refresh = action(({ state }) => {
  const { url } = state.navigator;
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
  const state = getState();
  const { url } = state.navigator || {};
  const { baseUrl } = state.config.proxy || {};
  navigate(url || baseUrl);
};

export const setFilter = action(({ commit, state }, filter) => {
  state.navigator.filter = filter;
  commit(state);
});

let filterTimeout;
export const debouncedSetFilter = (filter) => {
  clearTimeout(filterTimeout);
  filterTimeout = setTimeout(() => setFilter(filter), 150);
};
