// Mentions légales — contenu neutre en JSX pur (Option 2, décision
// Master 2026-11-17) : pas de content.json, pas de CONTENT-STATUS.md,
// pas de gate, pas de validation experte requise. Texte minimal et
// factuel : rien d'inventé qui pourrait engager juridiquement — pas
// d'identité d'éditeur, pas d'hébergeur, pas de clauses.
export function Legal() {
  return (
    <main className="legal">
      <h1>Mentions légales</h1>
      <p>
        Version privée, non publiée. Ces mentions seront complétées
        avant toute publication.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Cette application ne collecte aucune donnée personnelle. Elle
        fonctionne entièrement sur votre appareil : aucun compte,
        aucune synchronisation, aucun envoi de données vers un
        serveur.
      </p>
      <p>
        Si vous ouvrez un lien vers une ressource externe, votre navigateur
        communique directement avec le site choisi. Sa politique de
        confidentialité s’applique alors.
      </p>
      <h2>Cookies et traceurs</h2>
      <p>Cette application n’utilise ni cookies ni traceurs.</p>
      <h2>Contenus</h2>
      <p>
        Les contenus affichés sont fournis à titre informatif. Les
        contenus de sécurité portent la mention de leur état de
        validation : tant qu’un contenu est marqué brouillon, il ne
        doit pas être utilisé comme un protocole réel.
      </p>
      <p>
        <a href="/">Retour à l’accueil</a>
      </p>
    </main>
  )
}
