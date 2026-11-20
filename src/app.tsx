import { Urgence } from './urgence/urgence.tsx'
import { MalPasse } from './mal-passe/mal-passe.tsx'
import { About } from './about/about.tsx'
import { Legal } from './legal/legal.tsx'
import { Footer } from './layout/footer.tsx'

const homeCards = [
  {
    className: 'feature-card--discover',
    description: 'Encyclopédie, glossaire, conseils et ressources',
    href: '/decouvrir',
    image: '/images/ux/02-grimoire-pentacle.jpg',
    title: 'Je découvre',
  },
  {
    className: 'feature-card--prepare',
    description: 'Atelier, limites, sécurité',
    href: '/preparer-scene',
    image: '/images/ux/03-grimoire-plume.jpg',
    title: 'Je prépare une scène',
  },
  {
    className: 'feature-card--duo',
    description: 'Négociation et partage',
    href: '/mode-duo',
    image: '/images/ux/04-couple-silhouette.jpg',
    title: 'Mode Duo',
  },
  {
    className: 'feature-card--solo',
    description: 'Ressources et outils',
    href: '/pratique-solo',
    image: '/images/ux/05-lanterne.jpg',
    title: 'Pratique solo et sécurité',
  },
  {
    className: 'feature-card--support',
    description: 'Soutien et accompagnement',
    href: '/mal-passe',
    image: '/images/ux/06-lys-violet.jpg',
    title: 'Ça s’est mal passé ?',
  },
]

const constructionPages: Record<string, { title: string; description: string }> =
  {
    '/decouvrir': {
      title: 'Je découvre',
      description:
        'L’encyclopédie, le glossaire, les conseils et les ressources sont en préparation.',
    },
    '/preparer-scene': {
      title: 'Je prépare une scène',
      description:
        'L’atelier de préparation, les limites et les outils de sécurité sont en préparation.',
    },
    '/mode-duo': {
      title: 'Mode Duo',
      description:
        'Les outils de négociation et de partage sont en préparation.',
    },
    '/pratique-solo': {
      title: 'Pratique solo et sécurité',
      description:
        'Les ressources et les outils pour la pratique solo sont en préparation.',
    },
    '/contact': {
      title: 'Contact',
      description: 'Cette section est en préparation.',
    },
    '/profil': {
      title: 'Profil',
      description: 'La gestion du profil est en préparation.',
    },
    '/apparence': {
      title: 'Apparence',
      description: 'Les préférences d’apparence sont en préparation.',
    },
    '/parametres': {
      title: 'Paramètres',
      description: 'Les paramètres de l’application sont en préparation.',
    },
  }

function Home() {
  return (
    <main className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <img
          className="home-hero-image"
          src="/images/ux/01-salon-accueil.jpg"
          alt=""
          fetchPriority="high"
        />
        <h1 id="home-title">Bienvenue sur Kink de Nuit</h1>
        <p className="home-lede">
          Explorez, apprenez, préparez-vous…
          <br />
          en toute confiance.
        </p>
        <span className="home-divider" aria-hidden="true">
          ✦
        </span>
      </section>

      <section className="home-pathways" aria-label="Explorer l’application">
        {homeCards.map((card) => (
          <a
            className={`feature-card ${card.className}`}
            href={card.href}
            key={card.href}
          >
            <span className="feature-art" aria-hidden="true">
              <img src={card.image} alt="" loading="lazy" />
            </span>
            <span className="feature-copy">
              <span className="feature-title">{card.title}</span>
              <span className="feature-description">{card.description}</span>
            </span>
            <span className="feature-arrow" aria-hidden="true">
              ›
            </span>
          </a>
        ))}
      </section>
    </main>
  )
}

function HomeBottomNavigation() {
  return (
    <footer className="home-bottom-nav">
      <nav aria-label="Navigation principale">
        <a href="/decouvrir">
          <span
            className="bottom-nav-icon bottom-nav-icon--resources"
            aria-hidden="true"
          />
          <span>Ressources</span>
        </a>
        <a href="/pratique-solo">
          <span
            className="bottom-nav-icon bottom-nav-icon--safety"
            aria-hidden="true"
          />
          <span>Sécurité</span>
        </a>
        <a href="/urgence">
          <span
            className="bottom-nav-icon bottom-nav-icon--emergency"
            aria-hidden="true"
          />
          <span>Urgence</span>
        </a>
        <a href="/contact">
          <span
            className="bottom-nav-icon bottom-nav-icon--contact"
            aria-hidden="true"
          />
          <span>Contact</span>
        </a>
      </nav>
    </footer>
  )
}

function ConstructionPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="construction">
      <p className="construction-label">Kink de Nuit</p>
      <h1>{title}</h1>
      <p className="construction-status">Section en construction</p>
      <p>{description}</p>
      <a className="construction-home" href="/">
        Retour à l’accueil
      </a>
    </main>
  )
}

function Header({ isHome }: { isHome: boolean }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Kink de Nuit, accueil">
        <span className="brand-emblem" aria-hidden="true">
          <img src="/images/ux/07-lune-doree.jpg" alt="" />
        </span>
        <span className="brand-title">Kink de Nuit</span>
      </a>
      {isHome ? (
        <nav className="header-actions" aria-label="Compte et paramètres">
          <a href="/profil" aria-label="Profil" title="Profil">
            <span className="header-user-icon" aria-hidden="true" />
          </a>
          <a href="/apparence" aria-label="Apparence" title="Apparence">
            <span aria-hidden="true">⚙</span>
          </a>
          <a href="/parametres" aria-label="Paramètres" title="Paramètres">
            <span aria-hidden="true">⚙</span>
          </a>
        </nav>
      ) : (
        <nav className="app-quick-access" aria-label="Accès rapide">
          <a href="/urgence">
            <span className="quick-access-icon" aria-hidden="true">
              ✧
            </span>
            Mode Urgence
          </a>
        </nav>
      )}
    </header>
  )
}

export function App() {
  const pathname = window.location.pathname
  const isEmergency = pathname === '/urgence'
  const isHome = pathname === '/'
  const constructionPage = constructionPages[pathname]

  let page
  if (isEmergency) {
    page = <Urgence />
  } else if (pathname === '/mal-passe') {
    page = <MalPasse />
  } else if (pathname === '/about') {
    page = <About />
  } else if (pathname === '/legal') {
    page = <Legal />
  } else if (constructionPage) {
    page = <ConstructionPage {...constructionPage} />
  } else {
    page = <Home />
  }

  return (
    <>
      {!isEmergency && <Header isHome={isHome} />}
      {page}
      {isHome && <HomeBottomNavigation />}
      {!isEmergency && !isHome && <Footer />}
    </>
  )
}
