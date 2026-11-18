import './footer.css'

// Pied de page — contenu neutre en JSX pur (Option 2, décision
// Master 2026-11-17). Intégré dans app.tsx, visible sur TOUTES les
// pages (accueil, /urgence, /about, /legal).
export function Footer() {
  return (
    <footer className="footer">
      <nav aria-label="Pied de page">
        <a href="/">Accueil</a>
        <a href="/urgence">Mode Urgence</a>
        <a href="/about">À propos</a>
        <a href="/legal">Mentions légales</a>
      </nav>
    </footer>
  )
}
