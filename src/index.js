import { createRoot } from 'react-dom/client';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import {
  getState, subscribe, subscribeSync, subscribeOnce,
} from './state';
import { App } from './views/app';
import { ErrorBoundary } from './views/error-boundary';

// Handle service worker messages as early as possible to avoid deadlocks.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data === 'get-configuration') {
      event.ports[0].postMessage(getState('config.proxy'));
    }
  });
}

const root = createRoot(document.getElementById('root') || document.body);

const renderApp = (state) => {
  root.render(
    <ErrorBoundary>
      <App state={state} />
    </ErrorBoundary>,
  );
};

const init = async () => {
  await initState();
  subscribe(renderApp);

  initKeyboard();

  const state = getState();
  renderApp(state);

  subscribeOnce(navigateToDefault, 'config.proxy');

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
