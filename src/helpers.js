export const cycle = (length, index) => {
  if (index >= length) {
    return 0;
  }
  if (index < 0) {
    return length - 1 || 0;
  }
  return index;
};

export const isFile = url => !url.endsWith('/');
