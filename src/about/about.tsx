import './about.css'

// Page À propos — contenu neutre en JSX pur (Option 2, décision
// Master 2026-11-17) : pas de content.json, pas de CONTENT-STATUS.md,
// pas de gate. Le texte ci-dessous est factuel (README, document de
// vision) : rien d'inventé, ni promesse, ni fonctionnalité inexistante.
export function About() {
  return (
    <main className="about">
      <h1>À propos</h1>
      <p>
        Cette application est une application web progressive (PWA)
        conçue pour fonctionner entièrement sur votre appareil.
      </p>
      <h2>100 % locale</h2>
      <p>
        Aucun compte, aucune synchronisation, aucun envoi de données
        vers un serveur : vos données restent sur votre appareil.
      </p>
      <h2>En français, en solo</h2>
      <p>
        Cette version est en français et prévue pour un usage solo.
        Le mode à deux viendra dans une version ultérieure.
      </p>
      <h2>Version privée</h2>
      <p>
        Cette version est privée et non publiée. Certaines pages sont
        des contenus de démonstration, en attente de validation par
        des expertes et experts humains.
      </p>
      <h2>Appareils</h2>
      <p>
        L’interface est conçue en priorité pour les téléphones et les
        tablettes, et reste utilisable dans un navigateur sur Windows.
      </p>
      <p>
        <a href="/">Retour à l’accueil</a>
      </p>
    </main>
  )
}
