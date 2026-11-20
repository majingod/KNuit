import rawData from './content.json'
import './urgence.css'

// Forme du contenu statique Mode Urgence (import JSON inliné dans le
// bundle pour rester disponible hors ligne).
type Etape = { titre: string; texte: string }
type ContenuUrgence = {
  avertissement: string
  brouillon: boolean
  etapes: Etape[]
  introduction: string
  titre: string
}

const data: ContenuUrgence = rawData

export function Urgence() {
  return (
    <main className="urgence">
      {data.brouillon && (
        <p className="urgence-avertissement">{data.avertissement}</p>
      )}
      <h1>{data.titre}</h1>
      <p>{data.introduction}</p>
      <ol className="urgence-etapes">
        {data.etapes.map((etape, index) => (
          <li key={index}>
            <h2>{etape.titre}</h2>
            <p>{etape.texte}</p>
          </li>
        ))}
      </ol>
    </main>
  )
}
