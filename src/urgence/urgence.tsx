import rawData from './content.json'
import './urgence.css'

// Forme du contenu statique Mode Urgence (Option A — import .json
// inliné dans le bundle). numeroUrgence / noteNumero sont optionnels :
// le placeholder de démonstration (Voie A) ne les a pas — le paragraphe
// correspondant ne s'affiche alors pas (pas de « undefined » affiché).
// Le vrai contenu, après validation expert, les fournira.
type Etape = { titre: string; texte: string }
type ContenuUrgence = {
  avertissement: string
  brouillon: boolean
  etapes: Etape[]
  introduction: string
  titre: string
  numeroUrgence?: string
  noteNumero?: string
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
      {data.numeroUrgence && (
        <p className="urgence-numero">
          Urgence : {data.numeroUrgence} — {data.noteNumero}
        </p>
      )}
    </main>
  )
}
