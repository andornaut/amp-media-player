import { isFile } from '../../helpers';
import { toFilename, trimTrailingForwardSlash } from '../../transform';

// Workaround error: TypeError: "/example/ is not a valid URL."
const toAbsoluteUrl = url => (url.startsWith('/') ? `${window.location.origin}${url}` : url);

export const getBreadcrumbs = ({ url }, { config: { proxy: { baseUrl } = {} } = {} }) => {
  if (!baseUrl) {
    return [];
  }

  // Can be relative or absolute depending on what the user input.
  baseUrl = toAbsoluteUrl(baseUrl);

  // Can be absolute when it is the result of a scraped URL; or relative when it is the result of navigation to the
  // baseUrl (`navigateToDefault()`) where baseUrl is relative.
  url = toAbsoluteUrl(url);

  if (baseUrl === url) {
    return [baseUrl];
  }
  const urls = [url];
  const baseLength = baseUrl.length;
  for (;;) {
    const idx = trimTrailingForwardSlash(url).lastIndexOf('/');
    if (idx === -1) {
      break;
    }
    url = url.substring(0, idx + 1);
    if (url.length <= baseLength) {
      break;
    }
    urls.push(url);
  }
  urls.push(baseUrl);
  return urls.reverse();
};

export const getCurrent = ({ index, filteredItems }) => filteredItems[index] || filteredItems[0];

export const getFilteredFiles = ({ filteredItems }) => filteredItems.filter(isFile);

export const getFilteredItems = ({ filter, items }) => {
  if (!filter) {
    return items;
  }
  filter = filter.toLowerCase();
  return items.filter(url =>
    toFilename(url)
      .toLowerCase()
      .includes(filter));
};
