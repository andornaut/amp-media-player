import { createRoot } from 'react-dom/client';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import { getState, subscribe, subscribeSync } from './state';
import { App } from './views/app';
import { ErrorBoundary } from './views/error-boundary';

console.time('app-init');

const root = createRoot(document.getElementById('root') || document.body);

const renderApp = (state) => {
  console.time('render-app');
  root.render(
    <ErrorBoundary>
      <App state={state} />
    </ErrorBoundary>,
  );
  console.timeEnd('render-app');
};

const init = async () => {
  // Handle configuration requests from the worker immediately
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data === 'get-configuration') {
        console.time('sw-config-request');
        event.ports[0].postMessage(getState('config.proxy'));
        console.timeEnd('sw-config-request');
      }
    });
  }

  // 1. Initialize state from storage
  console.time('init-state');
  await initState();
  console.timeEnd('init-state');
  subscribe(renderApp);

  // 2. Initialize keyboard
  initKeyboard();

  // 3. Kick off navigation immediately (async)
  navigateToDefault();

  // 4. Initial render
  renderApp(getState());

  // 5. Setup Service Worker
  if ('serviceWorker' in navigator) {
    console.time('sw-register');
    navigator.serviceWorker.register('./worker.js').then(() => {
      console.timeEnd('sw-register');
    });

    subscribeSync(() => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage('invalidate-cache');
      });
    }, 'config.proxy');
  }

  console.timeEnd('app-init');
};

init();
