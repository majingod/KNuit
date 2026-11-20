import { useState } from 'preact/hooks'
import rawData from './content.json'

type ContenuMalPasse = {
  avertissement: string
  brouillon: boolean
  introduction: string
  ressourceCanada: { label: string; url: string }
  titre: string
}

type Etape = 'securite' | 'soutien' | 'ressources' | 'termine'

const data: ContenuMalPasse = rawData

export function MalPasse() {
  const [etape, setEtape] = useState<Etape>('securite')
  const [note, setNote] = useState('')

  function terminerSansEnregistrer() {
    setNote('')
    setEtape('termine')
  }

  return (
    <main className="mal-passe">
      {data.brouillon && (
        <p className="mal-passe-avertissement">{data.avertissement}</p>
      )}
      <h1>{data.titre}</h1>
      <p>{data.introduction}</p>

      <section aria-live="polite">
        {etape === 'securite' && (
          <>
            <h2>Es-tu en sécurité immédiate ?</h2>
            <p>
              Si tu es en danger ou si tu as besoin de soins urgents, ouvre les
              repères d’urgence. Tu peux aussi quitter ce parcours.
            </p>
            <div className="mal-passe-actions">
              <button type="button" onClick={() => setEtape('soutien')}>
                Je suis en sécurité pour le moment
              </button>
              <a href="/urgence">Non ou je ne sais pas — Mode Urgence</a>
            </div>
          </>
        )}

        {etape === 'soutien' && (
          <>
            <h2>De quoi as-tu besoin maintenant ?</h2>
            <p>
              Tu peux choisir une prochaine étape, écrire quelques mots qui
              resteront temporaires sur cet écran, ou ne rien faire.
            </p>
            <div className="mal-passe-actions">
              <button type="button" onClick={() => setEtape('ressources')}>
                Voir les ressources de soutien
              </button>
              <button type="button" onClick={terminerSansEnregistrer}>
                Terminer sans enregistrer
              </button>
            </div>
            <label for="note-temporaire">Note temporaire (facultative)</label>
            <textarea
              id="note-temporaire"
              value={note}
              onInput={(event) => setNote(event.currentTarget.value)}
              aria-describedby="note-aide"
            />
            <p id="note-aide">
              La note n’est pas enregistrée et disparaît quand tu quittes ou
              actualises cette page.
            </p>
            <button type="button" onClick={() => setNote('')}>
              Effacer la note
            </button>
            <div className="mal-passe-ressources">
              <h2>Si tu as besoin d’aide de crise</h2>
              <p>
                Si tu crains de te faire du mal ou si tu as des pensées
                suicidaires, contacte une ressource de crise ou une personne de
                confiance. En cas de danger immédiat, contacte les services
                d’urgence locaux.
              </p>
              <a href={data.ressourceCanada.url} target="_blank" rel="noreferrer">
                {data.ressourceCanada.label} (site externe)
              </a>
              <p>
                Le site externe reçoit les informations habituelles de
                connexion de ton navigateur. Aucune réponse de ce parcours ne
                lui est transmise par KNuit.
              </p>
            </div>
          </>
        )}

        {etape === 'ressources' && (
          <>
            <h2>Ressources de soutien au Canada</h2>
            <p>
              Tu peux consulter les ressources officielles du Gouvernement du
              Canada sur la prévention du suicide et la santé mentale.
            </p>
            <p>
              Ce lien ouvre un site externe. Il reçoit les informations
              habituelles de connexion de ton navigateur; KNuit ne transmet
              aucune réponse de ce parcours.
            </p>
            <a href={data.ressourceCanada.url} target="_blank" rel="noreferrer">
              {data.ressourceCanada.label}
            </a>
            <div className="mal-passe-actions">
              <button type="button" onClick={() => setEtape('soutien')}>
                Retour
              </button>
              <button type="button" onClick={terminerSansEnregistrer}>
                Terminer et effacer
              </button>
            </div>
          </>
        )}

        {etape === 'termine' && (
          <>
            <h2>Parcours terminé</h2>
            <p>
              Rien n’a été enregistré. La note temporaire a été effacée.
            </p>
            <a href="/">Retour à l’accueil</a>
          </>
        )}
      </section>
    </main>
  )
}
