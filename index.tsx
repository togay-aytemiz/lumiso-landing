import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import appStylesheetUrl from './index.css?url';

const ensureAppStylesheetLoaded = () => {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.querySelector('link[data-app-style="main"]')) {
    return;
  }

  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'style';
  preloadLink.href = appStylesheetUrl;
  preloadLink.crossOrigin = 'anonymous';
  preloadLink.dataset.appStylePreload = 'main';
  preloadLink.addEventListener('load', () => {
    preloadLink.remove();
  });
  document.head.appendChild(preloadLink);

  const stylesheetLink = document.createElement('link');
  stylesheetLink.rel = 'stylesheet';
  stylesheetLink.href = appStylesheetUrl;
  stylesheetLink.media = 'print';
  stylesheetLink.crossOrigin = 'anonymous';
  stylesheetLink.dataset.appStyle = 'main';
  stylesheetLink.addEventListener('load', () => {
    stylesheetLink.media = 'all';
  });
  // Safari may skip load events for cached styles, so fall back after a short delay.
  window.setTimeout(() => {
    if (stylesheetLink.media !== 'all') {
      stylesheetLink.media = 'all';
    }
  }, 3000);

  document.head.appendChild(stylesheetLink);
};

ensureAppStylesheetLoaded();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
