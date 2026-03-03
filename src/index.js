import { createRoot } from 'react-dom/client';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import { getState, subscribeSync, subscribeOnce } from './state';
import { App } from './views/app';

initState();
initKeyboard();

const container = document.getElementById('root');
if (!container) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
  const root = createRoot(rootDiv);
  root.render(<App />);
} else {
  const root = createRoot(container);
  root.render(<App />);
}

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
