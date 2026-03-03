export const cycle = (length, index) => (index + length) % length;

export const isFile = (url) => !url.endsWith('/');

export const compact = (arr) => arr.filter(Boolean);

export const unique = (arr) => [...new Set(arr)];

export const toAbsoluteUrl = (url) =>
  (url.startsWith('/') ? `${window.location.origin}${url}` : url);
