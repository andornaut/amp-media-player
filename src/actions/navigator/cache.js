const cache = new Map();

const MAX_SIZE = 20;

export const clearCache = () => {
  cache.clear();
};

export const getFromCache = (key) => cache.get(key) || null;

export const removeFromCache = (key) => {
  cache.delete(key);
};

export const setInCache = (key, val) => {
  cache.delete(key);
  if (cache.size >= MAX_SIZE) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, val);
};
