const replaceWhitespace = (url) => url.replace(/[\s-_]+/g, " ");

export const stripExtension = (url) => {
  const pos = url.lastIndexOf(".");
  return pos < 0 ? url : url.substring(0, pos);
};

export const trimTrailingForwardSlash = (url) =>
  url.endsWith("/") ? url.substring(0, url.length - 1) : url;

export const toFilename = (url) => {
  const trimmed = trimTrailingForwardSlash(url);
  return decodeURIComponent(trimmed.substring(trimmed.lastIndexOf("/") + 1));
};

export const toTitle = (url) =>
  replaceWhitespace(stripExtension(toFilename(url)));
