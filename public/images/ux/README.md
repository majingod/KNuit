# Images UX — `public/images/ux/`

Images d’ambiance de l’application Kink de Nuit (style gothique : rouge, or, violet, bougies).
Elles sont servies telles quelles par Vite depuis `public/` : chemin d’accès `/images/ux/<fichier>.jpg`.

## Maquette de référence

- `09-maquette-accueil.jpg` — capture de l’écran d’accueil final dont les 8 images individuelles sont tirées.
  C’est la référence visuelle : ne pas la supprimer tant que les cartes ci-dessous ne sont pas validées.

## Les 8 images et leur usage dans la maquette

| Fichier | Usage |
|---|---|
| `01-salon-accueil.jpg` | Arrière-plan (hero) de l’écran d’accueil : salon gothique, chaise longue rouge, bibliothèque, fenêtres violettes. |
| `02-grimoire-pentacle.jpg` | Carte « Je découvre » (encyclopédie, glossaire, conseils et ressources). |
| `03-grimoire-plume.jpg` | Carte « Je prépare une scène » (atelier, limites, sécurité). |
| `04-couple-silhouette.jpg` | Carte « Mode Duo » (négociation et partage). |
| `05-lanterne.jpg` | Carte « Pratique solo et sécurité » (ressources et outils). |
| `06-lys-violet.jpg` | Carte « Ça s’est mal passé ? » (soutien et accompagnement). |
| `07-lune-doree.jpg` | Emblème lune dorée (logo / en-tête, à côté de « Kink de Nuit »). |
| `08-icones-dorees.jpg` | Planche des 4 icônes dorées de la barre inférieure : livre (Ressources), bouclier (Sécurité), bouée (Urgence), enveloppe (Contact). À découper en 4 icônes individuelles si besoin. |

## Règles

- Images décoratives uniquement : aucune donnée personnelle, aucun contenu du coffre.
- Ne pas renommer les fichiers sans mettre à jour les références dans `src/`.
- Formats : JPEG uniquement dans ce dossier (optimiser avant d’ajouter des images lourdes, la PWA doit rester légère hors-ligne).
