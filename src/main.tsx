import { render } from 'preact'
import { App } from './app.tsx'

render(<App />, document.getElementById('app')!)

// PWA vide (tâches 0.6, 0.7) : enregistrement du service worker, via script
// externe same-origin uniquement — jamais inline (script-src 'self').
// Uniquement en production (import.meta.env.PROD) : en dev, le service
// worker mettrait en cache les assets du serveur de développement et
// casserait le rechargement à chaud.
// updateViaCache: 'none' (tâche 0.7, point Haute 3) : le navigateur
// revérifie sw.js à chaque navigation au lieu de le mettre en cache
// HTTP jusqu'à 24 h — sinon un correctif de sécurité mettrait jusqu'à
// un jour à atteindre les utilisateurs. Le serveur doit aussi poser
// Cache-Control: no-cache sur /sw.js (plugin Vite, vite.config.ts).
// Note de migration : pour les utilisateurs qui ont déjà le SW 0.6
// (enregistré sans updateViaCache: 'none'), la première vérification
// de mise à jour suit le comportement par défaut et peut être décalée
// d'au plus 24 h — non bloquant, mais à mentionner.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .catch((error: unknown) => {
        console.warn('SW registration failed:', error)
      })
  })
}
