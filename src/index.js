import { createRoot } from 'react-dom/client';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import { getState, subscribe, subscribeSync } from './state';
import { App } from './views/app';
import { ErrorBoundary } from './views/error-boundary';

const root = createRoot(document.getElementById('root') || document.body);

const renderApp = (state) => {
  root.render(
    <ErrorBoundary>
      <App state={state} />
    </ErrorBoundary>,
  );
};

const init = async () => {
  // Handle configuration requests from the worker immediately
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data === 'get-configuration') {
        event.ports[0].postMessage(getState('config.proxy'));
      }
    });
  }

  // 1. Initialize state from storage
  await initState();
  subscribe(renderApp);

  // 2. Initialize keyboard
  initKeyboard();

  // 3. Kick off navigation immediately (async)
  navigateToDefault();

  // 4. Initial render
  renderApp(getState());

  // 5. Setup Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./worker.js');

    subscribeSync(() => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage('invalidate-cache');
      });
    }, 'config.proxy');
  }
};

init();
