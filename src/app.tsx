import './app.css'
import { Urgence } from './urgence/urgence.tsx'

export function App() {
  if (window.location.pathname === '/urgence') {
    return <Urgence />
  }
  return (
    <main>
      <h1>Application</h1>
      <p>Squelette vide, en attente des fondations.</p>
      <p>
        <a href="/urgence">Mode Urgence</a>
      </p>
    </main>
  )
}
