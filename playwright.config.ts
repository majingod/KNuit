// Configuration des tests de non-régression (tâche 0.8).
// Les tests tournent contre `vite preview` (build de production, avec
// le plugin d'en-têtes de sécurité) — chaque fichier de test démarre
// et arrête ses propres serveurs, car le test de migration doit
// basculer d'un serveur à l'autre sur le même port. Un seul worker :
// les tests partagent le port et le dossier dist/ (le test kill-switch
// remplace dist/sw.js puis le restaure), donc le parallélisme
// casserait la déterminisme. `npm run test:e2e` fait le build avant.
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  fullyParallel: false,
  timeout: 120000,
  reporter: 'list',
  use: {
    launchOptions: {
      args: ['--no-sandbox'],
    },
  },
})
