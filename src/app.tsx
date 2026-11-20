import { Urgence } from './urgence/urgence.tsx'
import { MalPasse } from './mal-passe/mal-passe.tsx'
import { About } from './about/about.tsx'
import { Legal } from './legal/legal.tsx'
import { Footer } from './layout/footer.tsx'

function Home() {
  return (
    <main className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <p className="home-eyebrow">Un espace privé, en solo</p>
        <h2 id="home-title">Bienvenue sur Kink de Nuit</h2>
        <p className="home-lede">
          Explorez, apprenez, préparez-vous… en toute confiance et à votre
          rythme.
        </p>
        <span className="home-divider" aria-hidden="true">
          ✦
        </span>
      </section>

      <section className="home-pathways" aria-label="Parcours disponibles">
        <a
          className="feature-card feature-card--urgence"
          href="/urgence"
          aria-labelledby="urgence-card-title"
        >
          <span className="feature-art" aria-hidden="true">
            <span className="feature-art-symbol">✦</span>
          </span>
          <span className="feature-copy">
            <span className="feature-kicker">Repères de sécurité</span>
            <span className="feature-title" id="urgence-card-title">
              Mode Urgence
            </span>
            <span className="feature-description">
              Des repères à consulter rapidement, même hors ligne.
            </span>
          </span>
          <span className="feature-arrow" aria-hidden="true">
            →
          </span>
        </a>

        <a
          className="feature-card feature-card--soutien"
          href="/mal-passe"
          aria-labelledby="soutien-card-title"
        >
          <span className="feature-art" aria-hidden="true">
            <span className="feature-art-symbol">✿</span>
          </span>
          <span className="feature-copy">
            <span className="feature-kicker">Soutien et accompagnement</span>
            <span className="feature-title" id="soutien-card-title">
              Faire le point
            </span>
            <span className="feature-description">
              Un parcours doux, interruptible, sans rien enregistrer.
            </span>
          </span>
          <span className="feature-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </section>

      <aside className="home-notice">
        <span className="notice-mark" aria-hidden="true">
          ✧
        </span>
        <p>
          Préversion privée : les contenus de sécurité sont des brouillons de
          démonstration et ne remplacent pas une aide professionnelle.
        </p>
      </aside>
    </main>
  )
}

export function App() {
  const pathname = window.location.pathname
  const isEmergency = pathname === '/urgence'
  const isHome = !['/urgence', '/mal-passe', '/about', '/legal'].includes(
    pathname,
  )
  let page
  if (isEmergency) {
    page = <Urgence />
  } else if (pathname === '/mal-passe') {
    page = <MalPasse />
  } else if (pathname === '/about') {
    page = <About />
  } else if (pathname === '/legal') {
    page = <Legal />
  } else {
    page = <Home />
  }

  return (
    <>
      {!isEmergency && (
        <header className="site-header">
          <a className="brand" href="/" aria-label="Kink de Nuit, accueil">
            <span className="brand-emblem" aria-hidden="true">
              ✦
            </span>
            <span className="brand-copy">
              {isHome ? (
                <h1 className="brand-short-name">KNuit</h1>
              ) : (
                <span className="brand-short-name">KNuit</span>
              )}
              <span className="brand-title">Kink de Nuit</span>
            </span>
          </a>
          <nav className="app-quick-access" aria-label="Accès rapide">
            <a href="/urgence">
              <span className="quick-access-icon" aria-hidden="true">
                ✧
              </span>
              Mode Urgence
            </a>
          </nav>
        </header>
      )}
      {page}
      {!isEmergency && <Footer />}
    </>
  )
}
