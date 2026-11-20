import './app.css'
import { Urgence } from './urgence/urgence.tsx'
import { MalPasse } from './mal-passe/mal-passe.tsx'
import { About } from './about/about.tsx'
import { Legal } from './legal/legal.tsx'
import { Footer } from './layout/footer.tsx'

export function App() {
  const pathname = window.location.pathname
  let page
  if (pathname === '/urgence') {
    page = <Urgence />
  } else if (pathname === '/mal-passe') {
    page = <MalPasse />
  } else if (pathname === '/about') {
    page = <About />
  } else if (pathname === '/legal') {
    page = <Legal />
  } else {
    page = (
      <main className="home">
        <h1>KNuit</h1>
        <p>
          Une préversion locale pour tester les parcours de la Phase 1. Les
          contenus de sécurité sont des brouillons non validés.
        </p>
        <nav className="home-actions" aria-label="Parcours">
          <a href="/urgence">Mode Urgence</a>
          <a href="/mal-passe">Faire le point</a>
        </nav>
      </main>
    )
  }
  // Footer ABSENT sur /urgence (décision Master 2026-11-17, Haute
  // n°1) : sur une page de sécurité, zéro distraction — les quatre
  // liens du footer (dont trois quittent le protocole) n'ont pas
  // leur place en détresse. La sortie est le bouton retour du
  // navigateur. <footer> reste hors <main> (frères dans le
  // fragment, pas niché).
  const showFooter = pathname !== '/urgence'
  return (
    <>
      {pathname !== '/urgence' && (
        <nav className="app-quick-access" aria-label="Accès rapide">
          <a href="/urgence">Mode Urgence</a>
        </nav>
      )}
      {page}
      {showFooter && <Footer />}
    </>
  )
}
