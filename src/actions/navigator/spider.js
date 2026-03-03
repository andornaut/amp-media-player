import { compact, unique, toAbsoluteUrl } from '../../helpers';
import { toFilename } from '../../transform';

const EXCLUDED_ANCHOR_NAMES = [
  '.',
  '..',
  'description',
  'last modified',
  'name',
  'parent directory',
  'size',
];

const toAnchors = (text) =>
  Array.from(
    new DOMParser()
      .parseFromString(text, 'text/html')
      .getElementsByTagName('a'),
  );

const toUrl = (baseAbsoluteUrl) => {
  const baseUrlObj = new URL(baseAbsoluteUrl);
  return (anchor) => {
    if (
      anchor.hash
      || !anchor.pathname
      || anchor.pathname === '/'
      || anchor.search
    ) {
      return null;
    }
    const name = toFilename(anchor.textContent);
    if (EXCLUDED_ANCHOR_NAMES.includes(name.toLowerCase())) {
      return null;
    }

    const pathname = anchor.pathname.replace(
      window.location.pathname,
      baseUrlObj.pathname,
    );
    if (!pathname) {
      // Ignore anchors like <a href="">
      return null;
    }

    const url = new URL(baseUrlObj.href);
    url.pathname = pathname;
    if (url.href === baseUrlObj.href) {
      return null;
    }
    return url.href;
  };
};

const requestOptions = ({ username, password }) => {
  if (!username) {
    return {};
  }

  // Although the service worker will usually add credentials to requests, it's not guaranteed to be running.
  // For instance, it's disabled when the page is refreshed via CTRL+R.
  // While the credentials added here will not apply to media playback via eg. the <audio> element, this will at least
  // enable navigation. When media playback is attempted, the browser will prompt the user for access credentials.
  // If the service worker is running, then this is redundant, but not harmful.
  const credentials = !password ? username : `${username}:${password}`;
  return { headers: { Authorization: `Basic ${btoa(credentials)}` } };
};

const responseToText = (response) => response.text();

const extractUrls = (baseUrl) => {
  const baseAbsoluteUrl = toAbsoluteUrl(baseUrl);
  const toUrlWithBase = toUrl(baseAbsoluteUrl);
  return (text) => unique(compact(toAnchors(text).map(toUrlWithBase)));
};

export const scrapeUrls = (url, config) =>
  fetch(url, requestOptions(config))
    .then((response) => responseToText(response))
    .then(extractUrls(url));
