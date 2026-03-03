import {
  action,
  defineGetter,
  getState,
  setState,
  subscribe,
  subscribeOnce,
  subscribeSync,
} from 'statezero';

export {
  action,
  defineGetter,
  getState,
  setState,
  subscribe,
  subscribeOnce,
  subscribeSync,
};

export const commit = (state) => {
  setState('', state);
};
