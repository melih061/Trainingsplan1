/**
 * Main Entry Point
 * Initializes the application
 */

import { init } from './components/App.js';
import './styles/index.css';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Register service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[App] Service Worker registered:', registration.scope);
    } catch (error) {
      console.warn('[App] Service Worker registration failed:', error);
    }
  });
}

// Handle PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[App] Install prompt available');
});

// Export install function for manual trigger
export async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[App] Install outcome:', outcome);
    deferredPrompt = null;
    return outcome === 'accepted';
  }
  return false;
}

// Handle app installed
window.addEventListener('appinstalled', () => {
  console.log('[App] PWA installed');
  deferredPrompt = null;
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[App] Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Unhandled promise rejection:', event.reason);
});
