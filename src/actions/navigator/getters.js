import { isFile, toAbsoluteUrl } from '../../helpers';
import { toFilename, trimTrailingForwardSlash } from '../../transform';

export const getBreadcrumbs = (
  { url },
  { config: { proxy: { baseUrl } = {} } = {} },
) => {
  if (!baseUrl) {
    return [];
  }

  // Can be relative or absolute depending on what the user input.
  const absoluteBaseUrl = toAbsoluteUrl(baseUrl);

  // Can be absolute when it is the result of a scraped URL; or relative when it is the result of navigation to the
  // baseUrl (`navigateToDefault()`) where baseUrl is relative.
  const absoluteUrl = toAbsoluteUrl(url);

  if (absoluteBaseUrl === absoluteUrl) {
    return [absoluteBaseUrl];
  }
  const urls = [absoluteUrl];
  const baseLength = absoluteBaseUrl.length;
  let currentUrl = absoluteUrl;
  for (;;) {
    const idx = trimTrailingForwardSlash(currentUrl).lastIndexOf('/');
    if (idx === -1) {
      break;
    }
    currentUrl = currentUrl.substring(0, idx + 1);
    if (currentUrl.length <= baseLength) {
      break;
    }
    urls.push(currentUrl);
  }
  urls.push(absoluteBaseUrl);
  return urls.reverse();
};

export const getCurrent = ({ index, filteredItems }) =>
  filteredItems[index] || filteredItems[0];

export const getFilteredFiles = ({ filteredItems }) =>
  filteredItems.filter(isFile);

export const getFilteredItems = ({ filter, items }) => {
  if (!filter) {
    return items;
  }
  const lowerFilter = filter.toLowerCase();
  return items.filter((url) =>
    toFilename(url).toLowerCase().includes(lowerFilter));
};
