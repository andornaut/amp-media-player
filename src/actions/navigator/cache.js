const queue = [];

const MAX_SIZE = 20;

export const clearCache = () => {
  queue.length = 0;
};

export const getFromCache = (key) => {
  const start = queue.length - 1;
  for (let i = start; i >= 0; i -= 1) {
    const [currentKey, val] = queue[i];
    if (currentKey === key) {
      return val;
    }
  }
  return null;
};

export const removeFromCache = (key) => {
  const start = queue.length - 1;
  for (let i = start; i >= 0; i -= 1) {
    const [currentKey] = queue[i];
    if (currentKey === key) {
      queue.splice(i, 1);
      return;
    }
  }
};

export const setInCache = (key, val) => {
  removeFromCache(key); // May not shrink the backing array if they key is not found.
  if (queue.length >= MAX_SIZE) {
    queue.shift();
  }
  queue.push([key, val]);
};
