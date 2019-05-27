import {
  getState, renderView, subscribeSync, subscribeOnce,
} from 'jetstart/src';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import { app } from './views/app';

initState();
initKeyboard();
renderView(app(), document.body);
subscribeOnce(navigateToDefault, 'config.proxy');

if (navigator.serviceWorker) {
  // This service worker adds an "Authorization" header to fetch requests,
  // which avoids having the browser prompt for credentials.

  navigator.serviceWorker.addEventListener('message', (event) => {
    event.ports[0].postMessage(getState('config.proxy'));
  });

  navigator.serviceWorker.register('./worker.js');

  subscribeSync(() => {
    const { controller } = navigator.serviceWorker;

    // May be null when this script is first loaded.
    if (controller) {
      controller.postMessage('invalidate-cache');
    }
  }, 'config.proxy');
}
