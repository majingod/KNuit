// Pied de page — contenu neutre en JSX pur (Option 2, décision
// Master 2026-11-17). Intégré dans app.tsx, visible sur toutes
// les pages SAUF /urgence (footer masqué sur /urgence — décision
// Master 2026-11-17, Haute n°1, zéro distraction sur une page
// de sécurité).
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
