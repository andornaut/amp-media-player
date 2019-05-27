const STORAGE_KEY = 'state';

export const fromStorage = () => {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) {
    return null;
  }
  let state = null;
  try {
    state = JSON.parse(item);
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return state;
};

export const toStorage = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
