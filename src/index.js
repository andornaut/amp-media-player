import { createRoot } from 'react-dom/client';

import { initState } from './actions/init';
import { navigateToDefault } from './actions/navigator';
import { initKeyboard } from './keyboard';
import {
  getState, subscribe, subscribeSync, subscribeOnce,
} from './state';
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
  await initState();
  subscribe(renderApp);

  initKeyboard();

  const state = getState();
  renderApp(state);

  subscribeOnce(navigateToDefault, 'config.proxy');

  if ('serviceWorker' in navigator) {
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
};

init();
