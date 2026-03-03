import {
  getState,
  renderView,
  subscribeSync,
  subscribeOnce,
} from 'jetstart/src';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import { app } from './views/app';

initState();
initKeyboard();
renderView(app(), document.body);
subscribeOnce(navigateToDefault, 'config.proxy');

if ('serviceWorker' in navigator) {
  // This service worker adds an "Authorization" header to fetch requests,
  // which avoids having the browser prompt for credentials.

  navigator.serviceWorker.addEventListener('message', (event) => {
    event.ports[0].postMessage(getState('config.proxy'));
  });

  navigator.serviceWorker.register('./worker.js');

  subscribeSync(() => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active?.postMessage('invalidate-cache');
    });
  }, 'config.proxy');
}
