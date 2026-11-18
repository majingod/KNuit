import './app.css'
import { Urgence } from './urgence/urgence.tsx'
import { About } from './about/about.tsx'
import { Legal } from './legal/legal.tsx'
import { Footer } from './layout/footer.tsx'

export function App() {
  const pathname = window.location.pathname
  let page
  if (pathname === '/urgence') {
    page = <Urgence />
  } else if (pathname === '/about') {
    page = <About />
  } else if (pathname === '/legal') {
    page = <Legal />
  } else {
    page = (
      <main>
        <h1>Application</h1>
        <p>Squelette vide, en attente des fondations.</p>
        <p>
          <a href="/urgence">Mode Urgence</a>
        </p>
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
      {page}
      {showFooter && <Footer />}
    </>
  )
}
