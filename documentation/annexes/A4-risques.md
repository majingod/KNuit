# Annexe A4 — Registre des risques KNuit

**Version :** v1.0
**Date :** 2026-11-18
**Décideur :** Master
**Projet :** KNuit — application Kink de Nuit
**Dépôt :** dépôt privé github.com/majingod/KNuit

> **Règle en vigueur :**
> Master décide seul. Muse, chef de projet, propose, recommande, synthétise, vérifie et vulgarise — il ne tranche jamais.
>
> « Une IA ne gagne jamais un débat parce qu'elle argumente mieux. Les preuves priment toujours sur les opinions. »
>
> Source de ce registre : consolidation du 2026-11-18 (d'après l'état du projet et les documents validés). Les risques ci-dessous sont issus de cette consolidation — ils ne sont pas inventés ici. Les catégories R-01 à R-05 reprennent les constats de la consolidation.

---

## 1. Échelle de probabilité / impact — À FAIRE VALIDER PAR MASTER

> **⚠️ Point à faire valider par Master — aucune échelle n'est imposée ici.**
>
> Les probabilités et impacts indiqués dans ce registre utilisent des qualificatifs provisoires (Faible / Moyen / Élevé) **à titre de proposition de travail uniquement**. Ils ne sont pas des mesures : aucune donnée historique, aucune statistique du projet ne permet de les chiffrer à ce stade.
>
> **L'échelle définitive (définitions de chaque niveau, seuils, et méthode de cotation) doit être définie et validée par Master avant toute utilisation du registre comme outil de priorisation.**
>
> Proposition de travail soumise à Master (non validée) :
>
> | Niveau | Probabilité (proposition) | Impact (proposition) |
> |---|---|---|
> | Faible | Peu probable dans la durée de la V1 | Gêne limitée, contournable, sans perte de données ni atteinte à la confidentialité |
> | Moyen | Possible dans la durée de la V1 | Retard, reprise de travail, ou exposition limitée |
> | Élevé | Probable ou déjà observé | Perte de données, atteinte à la confidentialité, ou blocage du projet |
>
> Tant que Master n'a pas validé cette échelle (ou une autre), les cotations ci-dessous restent **provisoires et non opposables**.

---

## 2. R-01 — Risques manquants

### 2.1 Constat de la consolidation (2026-11-18)

La consolidation du 2026-11-18 a identifié des risques **manquants** : des risques réels qui ne figuraient dans aucun registre avant cette consolidation.

### 2.2 R-01a — Dépendance à une seule personne

- **Description :** Le projet repose sur une seule personne (Master) pour les décisions, les validations et la connaissance du périmètre, et sur une seule machine (desktop allumé 24/7, Intel i7-13700F, 32 Go de RAM DDR5, RTX 4060 Ti 8 Go, ~2 To libres, Windows 11) pour héberger l'équipe IA. Si Master est indisponible ou si la machine tombe en panne, le projet s'arrête.
- **Probabilité :** Moyenne *(provisoire — échelle à valider, voir § 1)*
- **Impact :** Élevé *(provisoire — échelle à valider, voir § 1)*
- **Mitigation :**
  - Documentation versionnée (01-03, A1-A5) et en version 1.0, en attente de validation par Master (05-06) : la connaissance du projet ne repose pas sur la seule mémoire de Master. Le document 04 (Registre de validation) est un BROUILLON PRÉPARÉ.

[Correction de cohérence 2026-11-19 — amendement n° 3 : 05-06 ne sont pas gelés, seulement proposés pour gel — la mitigation ne doit pas les présenter comme gelés.]
- **Note :** [Correction de cohérence 2026-11-19 — amendement n° 3 : le document 04 Registre de validation est un BROUILLON PRÉPARÉ, pas un document gelé.]
  - Dépôt privé GitHub comme copie de référence du code et de la documentation.
  - Sauvegardes quotidiennes, rétention 30 jours (décision D-09, voir A2).
  - Règle des 3 cycles + escalade : les blocages remontent vite au lieu de tourner en boucle.
- **Responsable :** Master (décisions) ; Muse, chef de projet (documentation et signalement).
- **Statut :** Ouvert — mitigation partielle en place, plan de continuité détaillé en attente de décision Master.

### 2.3 R-01b — Absence de plan de sauvegarde

- **Description :** Avant la consolidation, aucun plan de sauvegarde formalisé n'existait : ni support défini, ni emplacement, ni procédure de restauration testée, ni responsable de vérification.
- **Probabilité :** Moyenne *(provisoire — échelle à valider, voir § 1)*
- **Impact :** Élevé *(provisoire — échelle à valider, voir § 1)* — une perte de la machine hôte sans sauvegarde testée signifierait une perte de travail.
- **Mitigation :**
  - Décision D-09 : sauvegardes quotidiennes, rétention 30 jours.
  - Dépôt privé GitHub : les pushes (sur « Pousse » de Master) constituent déjà une copie hors machine.
- **Responsable :** Master (choix du support, de l'emplacement et du responsable de vérification — **en attente de décision**).
- **Statut :** Ouvert — règle décidée, plan détaillé en attente de décision Master.

### 2.4 R-01c — Obsolescence des modèles

- **Description :** Les modèles locaux prévus (Qwen2.5-Coder-7B, DeepSeek-R1 8B, Llama-3.2-3B, DeepSeek-Coder-V2-Lite) évoluent vite. Une version peut devenir indisponible, être remplacée, ou se révéler moins performante que prévu une fois installée. Qwen2.5-Coder-7B est supposé faible en planification (hypothèse à vérifier en pratique, voir A5, § 11.2).
- **Probabilité :** Moyenne *(provisoire — échelle à valider, voir § 1)*
- **Impact :** Moyen *(provisoire — échelle à valider, voir § 1)*
- **Mitigation :**
  - Consigner les versions exactes et les quantifications lors de l'installation, avec preuves.
  - Ne pas dépendre d'un seul modèle pour une fonction critique : Rôle B et Arbiter doublent le Rôle A.
  - Toute substitution de modèle exige une décision de Master, consignée dans A2.
- **Responsable :** Muse, chef de projet (veille et signalement) ; Master (décision de substitution).
- **Statut :** Ouvert — à réévaluer à l'installation (après validation des docs).

---

## 3. R-02 — Risques sous-évalués

### 3.1 Constat de la consolidation (2026-11-18)

La consolidation du 2026-11-18 a identifié des risques **sous-évalués** : des risques connus, mais dont la gravité avait été minimisée.

### 3.2 R-02a — Sécurité de l'accès distant

- **Description :** L'accès distant aux services locaux (OpenWebUI via Tailscale) ouvre une surface d'attaque : si la configuration est erronée (service exposé publiquement, authentification faible, adresse d'écoute mal réglée), l'équipe IA devient atteignable depuis l'extérieur.
- **Probabilité :** Moyenne *(provisoire — échelle à valider, voir § 1)*
- **Impact :** Élevé *(provisoire — échelle à valider, voir § 1)*
- **Mitigation :**
  - Tailscale obligatoire pour l'accès distant ; aucun service exposé publiquement en V1 (décision D-16).
  - OpenWebUI accessible via IP Tailscale, jamais limité à `127.0.0.1` (décision D-15) — sans pour autant être exposé sur l'internet public.
  - Vérification de la configuration d'écoute et d'accès lors de l'installation, avant toute utilisation à distance.
  - Secrets jamais dans Git, dans les docs, ni dans les prompts (décision D-13).
  - Réévaluation de ce risque lors de l'installation de Tailscale et d'OpenWebUI (voir A5, § 8.5).
- **Responsable :** Muse, chef de projet (vérification à l'installation) ; Master (décision d'ouverture de l'accès distant).
- **Statut :** Ouvert — à réévaluer à l'installation.

### 3.3 R-02b — Confidentialité des données de pratique

- **Description :** KNuit touche à l'intime. Même sans données réelles en V1, toute fuite future de la discipline (donnée réelle glissée dans un prompt, dans PostgreSQL, dans un modèle externe, dans GitHub ou dans Codespaces) aurait des conséquences graves et irréversibles pour l'utilisateur.
- **Probabilité :** Faible (provisoire — si les règles sont respectées ; échelle à valider, voir § 1)
- **Impact :** Élevé *(provisoire — échelle à valider, voir § 1)*
- **Mitigation :**
  - En cas de relâchement, la probabilité passe à Élevée — re-coter immédiatement.
  - Données interdites partout : données réelles, personnelles, médicales, contenu du coffre — dans GitHub, Codespaces, PostgreSQL, Ollama, modèles externes (décision D-12).
  - PostgreSQL = mémoire du projet sans données réelles (décision D-07).
  - Modèles locaux (Ollama) préférés aux modèles externes pour l'équipe IA.
  - Rappel systématique de l'interdiction dans chaque document et à chaque installation.
- **Responsable :** Master ; Muse, chef de projet (rappel et contrôle) ; tous les rôles IA (application stricte).
- **Statut :** Ouvert — mitigation par règles en place, vigilance permanente.
- **Note :** [Correction de cohérence 2026-11-19 — amendement n° 3 : cotation unique « Faible (provisoire — si les règles sont respectées) » ; la mention « Élevée en cas de relâchement » ne figure plus comme cotation — elle est déplacée en mitigation, avec re-cotation immédiate en cas de relâchement.]

---

## 4. R-03 — Manque de plan de contingence

- **Description :** Avant la consolidation, il n'existait pas de plan de contingence : que faire si la machine hôte tombe en panne, si un modèle devient indisponible, si Tailscale est indisponible, si le dépôt GitHub est inaccessible, si Master est indisponible plusieurs jours ?
- **Probabilité :** Moyenne *(provisoire — échelle à valider, voir § 1)*
- **Impact :** Moyen à Élevé selon le scénario *(provisoire — échelle à valider, voir § 1)*
- **Mitigation :**
  - Ce registre (A4) est la première étape : nommer les risques avant de les traiter.
  - Sauvegardes quotidiennes, rétention 30 jours (D-09).
  - Dépôt privé GitHub comme copie de référence.
  - Règle des 3 cycles + escalade : un blocage technique remonte à Master au lieu de tourner en boucle.
  - Plan de contingence détaillé (scénarios + conduite à tenir par scénario) : **à rédiger et à faire valider par Master — en attente de décision**.
- **Responsable :** Muse, chef de projet (rédaction du plan) ; Master (validation).
- **Statut :** Ouvert — plan détaillé en attente de décision Master.

---

## 5. R-04 — Aucune mesure de suivi

- **Description :** Avant la consolidation, aucune mesure de suivi des risques n'existait : pas de revue périodique, pas d'indicateur, pas de responsable désigné pour vérifier que les mitigations sont toujours en place.
- **Probabilité :** Élevée (un risque non suivi se dégrade silencieusement) *(provisoire — échelle à valider, voir § 1)*
- **Impact :** Moyen *(provisoire — échelle à valider, voir § 1)*
- **Mitigation :**
  - Section 7 de cette annexe : mesures de suivi (revue, indicateurs, responsables).
  - Mise à jour de ce registre à chaque version majeure d'un document, à chaque installation, et à chaque incident.
- **Responsable :** Muse, chef de projet (suivi et mise à jour du registre) ; Master (revue et décisions).
- **Statut :** Ouvert — mesures de suivi définies au § 8, à faire valider par Master.

---

## 6. R-05 — Pas de classification par probabilité / impact

- **Description :** Avant la consolidation, les risques n'étaient pas classés par probabilité ni par impact : il était donc impossible de prioriser, de savoir quoi traiter en premier, ni de justifier un arbitrage.
- **Probabilité :** Sans objet (risque de méthode, pas risque d'événement)
- **Impact :** Moyen *(provisoire — échelle à valider, voir § 1)* — sans classification, les efforts de mitigation sont répartis à l'aveugle.
- **Mitigation :**
  - Ce registre classe chaque risque par probabilité et impact, à titre provisoire.
  - **L'échelle définitive doit être définie et validée par Master (voir § 1).** Tant qu'elle n'est pas validée, les cotations restent provisoires et ne servent pas à prioriser formellement.
  - Une fois l'échelle validée, re-coter l'ensemble des risques et prioriser les mitigations en conséquence.
- **Responsable :** Master (validation de l'échelle) ; Muse, chef de projet (re-cotation après validation).
- **Statut :** Ouvert — en attente de validation de l'échelle par Master.

---

## 7. Risques produit (réintégrés depuis la consolidation du 2026-11-18)

Les risques R-06 à R-11 sont les risques produit enregistrés dans la consolidation du 2026-11-18 (partie 8, « Risques »). Ils étaient absents de la première version de ce registre, qui ne couvrait que les risques d'équipe.

### 7.1 R-06 — Limites du web et du navigateur (menaces du doc 02 §7)

- **Description :** Aucune sécurité absolue ne peut être promise sur le web : pas de garantie contre la purge du stockage par le navigateur, pas de minuteur fiable en arrière-plan, pas de protection contre un appareil compromis, un logiciel espion, une personne qui regarde l'écran, un mot de passe faible ; pas de garantie d'effacement complet de l'historique, du cache ou des traces système après Quick Exit, ni d'effacement complet de la mémoire en JavaScript, même avec une clé non extractable. Accès physique à l'appareil déverrouillé, perte du mot de passe maître, purge d'IndexedDB, sauvegarde exportée mal protégée, erreur humaine, dépendance aux limites du navigateur, de WebCrypto et de WASM, traces résiduelles après Quick Exit, risques mobile / tablette (clavier virtuel, orientation, zoom, bouton retour Android, bfcache).
- **Probabilité :** Moyenne*
- **Impact :** Élevé*
- **Mitigation :** Ne promettre que ce que le web peut garantir (document 02 §7) ; Quick Exit documenté avec ses limites ; aucune donnée réelle dans GitHub, Codespaces ou envoyée à une IA.
- **Responsable :** Muse, chef de projet (documentation des limites) ; Master (décisions).
- **Statut :** Ouvert — limites connues et documentées.

### 7.2 R-07 — Contenu non validé par un expert présent dans l'app

- **Description :** Le Mode Urgence actuel est un contenu de démonstration (brouillon, marqué non validé). Un protocole d'urgence plausible marqué « brouillon non validé » pourrait être utilisé en détresse — c'est le motif du refus de la Voie B (2026-11-17).
- **Probabilité :** Faible* (l'app est privée, non partagée)
- **Impact :** Élevé*
- **Mitigation :** Contenu actuel manifestement inutilisable (aucune étape, bandeau « Contenu de démonstration ») ; gate de validation du contenu (CONTENT-STATUS.md) ; validation experte unique avant toute commercialisation (amendement n° 9) ; aucun contenu réel sans validation experte avant commercialisation.
- **Responsable :** Master (identification de l'expert) ; Muse, chef de projet (gate, bandeau).
- **Statut :** Ouvert — en attente de la validation experte pré-commercialisation.

### 7.3 R-08 — Dette technique connue

- **Description :** `ignoreVary: true` sur les navigations (dette distincte, déclencheur : première navigation dépendant d'un cookie ou d'un en-tête) ; `typescript-eslint` exclu (incompatible TypeScript 7.0.2, réévaluer à TS 7.1) ; `esModuleInterop` / `allowSyntheticDefaultImports` non vérifiés dans `tsconfig.app.json` ; cible 48 px intentionnelle sur toutes les viewports, sans breakpoint desktop ; mutation E = 4 (le test Enter utilise `startVite('preview', 4191)`, pas `startStaticServer`).
- **Probabilité :** Moyenne*
- **Impact :** Moyen*
- **Mitigation :** Dette consignée dans la consolidation (partie 5) et dans les scopes de tâches ; chaque dette a son déclencheur de réexamen.
- **Responsable :** Muse, chef de projet.
- **Statut :** Ouvert — dette consignée.

### 7.4 R-09 — Image Codespaces non testée

- **Description :** L'image Codespaces `typescript-node:24-bookworm` (configuration 0.3) n'a jamais été testée dans un vrai Codespace.
- **Probabilité :** Moyenne*
- **Impact :** Moyen*
- **Mitigation :** Tester l'image à la première ouverture d'un Codespace, avant tout usage ; aucune donnée réelle tant que l'environnement n'est pas vérifié.
- **Responsable :** Master (confirmation à l'ouverture).
- **Statut :** Ouvert — réserve 0.3.

### 7.5 R-10 — Hébergement : métadonnées Cloudflare / crédits Netlify

- **Description :** Si Cloudflare Pages + Access est choisi : métadonnées de connexion (IP, horodatage) visibles côté Cloudflare, entreprise américaine ; `*.pages.dev` reste publique si les deux noms d'hôte ne sont pas couverts ; moyen de paiement enregistré au setup Zero Trust (0 $ facturé). Si Netlify est choisi : modèle à crédits (300/mois, arrêt brutal si épuisés). Vercel : protection 40 $/mois, Hobby limité à l'usage personnel/non commercial.
- **Probabilité :** Moyenne*
- **Impact :** Moyen*
- **Mitigation :** Décision d'hébergement non prise (item G, validation d'architecture écrite requise avant dégel) ; au moment du choix, couvrir les deux noms d'hôte et attacher Access avant de communiquer l'URL.
- **Responsable :** Master (décision d'hébergement).
- **Statut :** Ouvert — décision d'hébergement en attente.

### 7.6 R-11 — Limites des tests et ambiguïté de la mutation E

- **Description :** `context.setOffline(true)` ne bloque pas les `fetch()` du service worker (découverte 0.9) : les tests « offline » de 0.7/0.8 étaient vacuites pour la partie offline. Un test qui passe pour la mauvaise raison est pire qu'un test qui échoue. Port 4190 interdit (liste des ports bloqués d'undici, Node 24). Mutation E ambiguë si un nouveau test navigue (helper `startVite` vs `startStaticServer`).
- **Probabilité :** Moyenne*
- **Impact :** Moyen*
- **Mitigation :** Vrai hors-ligne = arrêter le serveur ; méthode de simulation exigée pour tout test réseau ; contrôle négatif rejoué à chaque modification du sw.js ou des specs ; port 4190 jamais utilisé.
- **Responsable :** Muse, chef de projet.
- **Statut :** Ouvert — règles en place (mutations rejouées à chaque changement du sw.js ou des specs).

### 7.7 Hypothèses actuellement acceptées

- La promesse « aucune donnée vers un serveur » (about.tsx / legal.tsx) reste vraie avec Cloudflare Pages (statique pur) ; l'ajout d'Access signifie que les métadonnées de connexion (IP, horodatage) passent par Cloudflare — c'est de la métadonnée, pas de la donnée utilisateur, donc la promesse tient (Master, revue 1.3, 2026-11-18).
- PBKDF2 acceptable en v1, Argon2id en V1.1 ; ne pas présenter PBKDF2 comme équivalent à Argon2id (document 02).
- E = 4 (le test Enter utilise `startVite('preview', 4191)`, pas `startStaticServer`, donc il n'est pas affecté par la mutation E) (correction 1.3, 2026-11-18).
- Footer absent sur /urgence, sortie = bouton retour du navigateur (Haute n°1, push groupé, 2026-11-17).
- Cible 48 px intentionnelle sur toutes les viewports, sans breakpoint desktop (1.2c/1.3).
- Regex trois surfaces : listes réduites 911|112 sur dist/ et sources, liste complète sur content.json source, lookbehind `(?<!#)` (1.2a, 2026-11-18).
- Le workflow de validation du contenu (brouillon + bandeau + gate + hash sémantique) permet d'écrire du contenu brouillon sans risque de publication accidentelle (Option 1, 2026-11-17).
- Pratiques : « hash > grep », « aucun commentaire n'affirme un comportement non vérifié », « toute modification de comportement → grep des commentaires qui l'affirment dans le même commit ».
- La validation par un expert humain est le dernier maillon avant commercialisation : sans elle, rien n'est « prêt » à commercialiser (amendement n° 9).

---

## 8. Mesures de suivi

### 8.1 Revue des risques

| Mesure | Fréquence proposée | Responsable |
|---|---|---|
| Revue du registre A4 | À chaque version majeure d'un document, à chaque installation, et à chaque incident — au minimum à chaque jalon du projet | Muse, chef de projet (préparation) ; Master (revue et décisions) |
| Re-cotation des risques | Après validation de l'échelle par Master, puis à chaque revue | Muse, chef de projet |
| Vérification des sauvegardes | Quotidienne (exécution) ; vérification de restauration selon la procédure à valider par Master | **Responsable à désigner par Master** |
| Vérification de la configuration d'accès distant | À l'installation de Tailscale / OpenWebUI, puis à chaque modification | Muse, chef de projet |
| Vérification de l'absence de données réelles | À chaque push (avant « Pousse »), à chaque installation, à chaque import en mémoire | Muse, chef de projet |

> Les fréquences ci-dessus sont des **propositions** soumises à Master. Elles ne sont pas des décisions. Master peut les modifier, les valider, ou en fixer d'autres.
>
> Applicable seulement une fois le plan de sauvegarde validé par Master (D-09) ; jusque-là, l'indicateur est "plan non défini".

### 8.2 Indicateurs de suivi (propositions)

- Nombre de risques ouverts / fermés (à chaque revue).
- Nombre de risques à impact Élevé sans mitigation en place.
- Date de la dernière sauvegarde vérifiée (restauration testée — oui / non).
- Date de la dernière vérification de la configuration d'accès distant.
- Nombre d'écarts consignés (push sans « Pousse », donnée réelle détectée, secret détecté) — objectif : zéro, tout écart est signalé à Master.

Ces indicateurs sont des propositions. Leur adoption et leurs seuils relèvent d'une décision de Master.

### 8.3 Mise à jour du registre

- Toute nouvelle information (incident, installation, décision Master, validation) qui touche un risque est consignée ici, avec sa date.
- Un risque fermé n'est jamais effacé : son statut passe à « Fermé », avec la date et la raison de fermeture, et il reste lisible dans l'historique.
- Un nouveau risque est ajouté avec un nouvel identifiant (R-12, R-13, …), jamais en réutilisant un identifiant existant.

### 8.4 Gabarit — nouveau risque

```markdown
## R-XX — [Titre du risque]

- **Description :** [Ce qui peut arriver, et pourquoi]
- **Probabilité :** [Faible / Moyen / Élevé — selon l'échelle validée par Master]
- **Impact :** [Faible / Moyen / Élevé — selon l'échelle validée par Master]
- **Mitigation :** [Ce qui est fait, ou prévu, pour réduire la probabilité ou l'impact]
- **Responsable :** [Nom / rôle]
- **Statut :** [Ouvert / En cours de mitigation / Fermé — date et raison]
```

---

## 9. Synthèse — tableau des risques

| ID | Risque | Probabilité* | Impact* | Statut |
|---|---|---|---|---|
| R-01a | Dépendance à une seule personne / machine | Moyenne | Élevé | Ouvert |
| R-01b | Absence de plan de sauvegarde | Moyenne | Élevé | Ouvert |
| R-01c | Obsolescence des modèles | Moyenne | Moyen | Ouvert |
| R-02a | Sécurité de l'accès distant | Moyenne | Élevé | Ouvert |
| R-02b | Confidentialité des données de pratique | Faible† | Élevé | Ouvert |
| R-03 | Manque de plan de contingence | Moyenne | Moyen à Élevé | Ouvert |
| R-04 | Aucune mesure de suivi | Élevée | Moyen | Ouvert |
| R-05 | Pas de classification par probabilité / impact | — | Moyen | Ouvert |
| R-06 | Limites du web et du navigateur | Moyenne | Élevé | Ouvert |
| R-07 | Contenu non validé par un expert présent dans l'app | Faible | Élevé | Ouvert |
| R-08 | Dette technique connue | Moyenne | Moyen | Ouvert |
| R-09 | Image Codespaces non testée | Moyenne | Moyen | Ouvert |
| R-10 | Hébergement : métadonnées Cloudflare / crédits Netlify | Moyenne | Moyen | Ouvert |
| R-11 | Limites des tests et ambiguïté de la mutation E | Moyenne | Moyen | Ouvert |

\* *Cotations provisoires — échelle à définir et à faire valider par Master (voir § 1).*
† *Faible (provisoire — si les règles sont respectées) ; en cas de relâchement, la probabilité passe à Élevée — re-coter immédiatement.*

---

*Fin de l'annexe A4 — Registre des risques KNuit — 2026-11-18.*
