import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

render(<App />, document.getElementById('app')!)

// PWA vide (tâche 0.6) : enregistrement du service worker, via script
// externe same-origin uniquement — jamais inline (script-src 'self').
// Uniquement en production (import.meta.env.PROD) : en dev, le service
// worker mettrait en cache les assets du serveur de développement et
// casserait le rechargement à chaud.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((error: unknown) => {
        console.error(
          "Échec de l'enregistrement du service worker :",
          error,
        )
      })
  })
}
