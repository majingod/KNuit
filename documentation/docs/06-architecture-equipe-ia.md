# Architecture de l'Équipe IA KNuit

| Champ | Valeur |
|---|---|
| **Titre** | Architecture de l'Équipe IA KNuit |
| **Version** | 1.0 |
| **Date** | 2026-11-18 |
| **Statut** | PRÊT POUR GEL |
| **Autorité** | Master (Frédéric) |
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (privé) |
| **Document compagnon** | `05-charte-equipe-ia.md` (règles de fonctionnement — prime en cas de conflit) |

> **Lecture rapide (30 secondes) :** l'équipe IA est organisée comme une petite usine de vérification. Master décide seul. Muse coordonne et vérifie. Deux modèles locaux travaillent l'un après l'autre (8 Go de VRAM obligent), se relisent mutuellement, et un arbitre indépendant tranche sur preuves. Rien ne part vers GitHub sans que Master ait dit « Pousse ». Aucune donnée réelle n'entre jamais dans cette usine.

---

## Historique des versions

| Version | Date | Auteur | Changement |
|---|---|---|---|
| 0.1 | 2026-11-18 | Muse (brouillon) | Première ébauche complète, en attente de validation Master |
| 1.0 | 2026-11-18 | Équipe IA KNuit | Version soumise au gel — PRÊT POUR GEL |

---

## 1. Objectif

Ce document décrit **l'architecture de l'équipe IA** du projet KNuit : ses composants, leurs relations, ses flux de travail et ses mécanismes de sécurité.

Il répond à quatre questions :

1. **Qui fait quoi ?** — les agents, leurs rôles et leurs limites (section 8).
2. **Comment le travail circule-t-il ?** — les workflows standard et de développement (sections 9 et 10).
3. **Comment sait-on qu'un travail est bon ?** — preuves, mesures de qualité, gestion des désaccords (sections 11 et 12).
4. **Comment le système survit-il aux pannes, aux absences et aux changements de modèle ?** — sécurité, sauvegardes, continuité (sections 13 à 16).

Ce document est **technique dans sa description, simple dans ses décisions** : les décisions présentées à Master le sont toujours en langage simple, à trois niveaux de lecture (30 s, 5 min, 20 min), et jamais sous forme technique.

### Contexte produit (rappel)

KNuit est un outil **local-first, hors ligne, sans compte ni synchronisation**, destiné à des adultes consentants (BDSM/kink). V1 est solo. La Phase 1 couvre le Mode Urgence et « Ça s'est mal passé » ; suivront le Hub, l'Inventaire, l'Atelier, le Débrief et le coffre local chiffré ; l'objectif final inclut un Mode Duo. Stack applicative : Vite 8.3.8 + Preact 11.2.0 + TypeScript 7.0.2, PWA, service worker écrit à la main sans Workbox. Dépôt privé, aucune URL ni déploiement public en V1, Cloudflare Pages gelé.

### Référence normative

Les règles de fonctionnement de l'équipe IA sont définies par la **Charte de l'Équipe IA KNuit** (`05-charte-equipe-ia.md`). En cas de conflit entre les deux documents, **la charte prime**. Le présent document décrit *comment* l'architecture met en œuvre les règles de la charte ; il ne peut ni les contredire ni les assouplir.

---

## 2. Principes fondamentaux

### 2.1 Master décide seul, Muse ne tranche jamais

Toute l'architecture découle de ce principe. Aucun composant, aucun workflow, aucun mécanisme automatique ne prend de décision à la place de Master. Les agents proposent, recommandent, vérifient — Master tranche.

### 2.2 Créateur ≠ critique

Aucun composant ne valide son propre travail. Chaque livrable passe par un regard indépendant (critique croisée puis arbitrage). Voir charte, section 6.

### 2.3 Les preuves priment sur les opinions

Une IA ne gagne jamais un débat parce qu'elle argumente mieux. L'architecture est conçue pour produire, collecter et vérifier des preuves (tests, hashes, diffs, builds) à chaque étape, et pour que ces preuves — et non la rhétorique — décident de l'issue des désaccords. Voir charte, section 7.

### 2.4 Sécurité avant rapidité, simplicité avant complexité

L'architecture privilégie les mécanismes simples, compréhensibles et vérifiables. Une solution simple et sûre vaut mieux qu'une solution sophistiquée et opaque. Le principe de prudence de la charte (section 10) s'applique à chaque choix d'architecture.

### 2.5 Le projet ne dépend d'aucun modèle

Aucun composant n'est lié à un modèle d'IA particulier. Les rôles (A, B, Arbiter) sont définis par leur **fonction**, pas par le modèle qui les tient. Un modèle peut être remplacé sans changer l'architecture, la charte ni les workflows.

### 2.6 Séparation stricte des données

Trois mondes séparés — l'application KNuit (données réelles, sur l'appareil de l'utilisateur), l'équipe IA (code, documents, données fictives) et GitHub (code et documentation, dépôt privé) — ne se mélangent jamais. Voir charte, sections 12 et 13.

### 2.7 Traçabilité complète

Chaque livrable porte son auteur, son critique, sa recommandation d'arbitrage le cas échéant, ses preuves et son nombre de cycles de révision. Rien n'est présenté à Master sans cette traçabilité.

---

## 3. Architecture générale

### 3.1 Vue d'ensemble

```
                          ┌─────────────┐
                          │   Master    │  Décide et tranche seul
                          │  (Frédéric) │
                          └──────┬──────┘
                                 │ instructions / validations
                          ┌──────▼──────┐
                          │    Muse     │  Chef de projet
                          │  (vérifie,  │  Vérification indépendante
                          │  synthétise)│  Langage simple
                          └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │ Orchestrateur│ Coordinateur des modèles locaux
                          └──────┬──────┘
                    ┌────────────┴────────────┐
                    │   Chargement séquentiel │
                    │   (un modèle à la fois) │
                    └────────────┬────────────┘
              ┌─────────────────┴─────────────────┐
              │                                   │
     ┌────────▼────────┐               ┌──────────▼────────┐
     │    Rôle A       │◄── critique ──►│     Rôle B        │
     │ Qwen2.5-Coder 7B│   croisée     │  DeepSeek-R1 8B   │
     └────────┬────────┘               └──────────┬────────┘
              │                                   │
              └──────────────┬────────────────────┘
                             │ livrables + critiques
                    ┌────────▼────────┐
                    │    Arbiter      │  Muse ou modèle tiers indépendant
                    │ (recommande,    │  Jamais l'un des deux auteurs
                    │  ne décide pas) │
                    └────────┬────────┘
                             │ recommandation
                    ┌────────▼────────┐
                    │     Muse        │  Synthèse + vérification
                    │  → Master       │  Validation finale : Master
                    └─────────────────┘
```

### 3.2 Couches

| Couche | Composants | Responsabilité |
|---|---|---|
| **Décision** | Master | Trancher, approuver, autoriser les pushs |
| **Pilotage** | Muse | Coordonner, vérifier indépendamment, synthétiser, vulgariser |
| **Coordination** | Orchestrateur | Répartir les tâches, gérer le chargement séquentiel des modèles |
| **Production** | Rôle A, Rôle B | Produire les livrables |
| **Vérification** | Critique croisée, Arbiter | Relire, comparer, recommander sur preuves |
| **Persistance** | GitHub (dépôt privé), documents validés, sauvegardes | Source de vérité, mémoire du projet |

### 3.3 Flux d'information

- **Les instructions descendent** : Master → Muse → Orchestrateur → Rôles A et B.
- **Les livrables et les preuves remontent** : Rôles A et B → Critique croisée → Arbiter → Muse → Master.
- **Aucun flux latéral non contrôlé** : les Rôles A et B ne communiquent entre eux que par la critique croisée, orchestrée et tracée.
- **Aucun flux vers l'extérieur sans validation** : rien ne quitte l'équipe IA vers GitHub sans « Pousse » explicite de Master ; rien ne va vers un modèle externe sans relecture du prompt (section 13).

---

## 4. Infrastructure

### 4.1 Machine de l'équipe IA (Desktop)

L'équipe IA travaille sur une machine de bureau (Desktop) dédiée. **Desktop = équipe IA, pas l'application** : cette machine sert à produire et vérifier le projet KNuit ; elle ne contient aucune donnée d'usage réel de l'application et ne fait pas tourner l'application avec des données réelles.

Caractéristiques structurantes :

- **8 Go de VRAM** : contrainte matérielle centrale. Deux modèles de 7 à 8 milliards de paramètres ne peuvent pas être chargés en même temps — d'où le chargement séquentiel des Rôles A et B (section 8).
- Les modèles locaux tournent via **Ollama** sur cette machine.
- La base **PostgreSQL de l'équipe IA** tourne sur cette machine ou dans son périmètre direct ; elle ne contient que des données de projet et des données fictives de test.

### 4.2 Ollama — modèles locaux

| Modèle | Rôle | Usage |
|---|---|---|
| Qwen2.5-Coder 7B | Rôle A | Production de code et de livrables techniques |
| DeepSeek-R1 8B | Rôle B | Production indépendante, raisonnement, critique |

- **Un seul modèle chargé à la fois.** Déchargement complet avant le chargement du suivant.
- L'Orchestrateur est responsable de la séquence de chargement et signale tout échec à Muse au lieu d'improviser.
- Les journaux et caches Ollama sont purgés de toute donnée sensible et couverts par les sauvegardes (section 15).
- Aucune donnée interdite (charte, section 12) n'est jamais envoyée à Ollama ni à aucun modèle local.

### 4.3 PostgreSQL — base de l'équipe IA

- La base PostgreSQL de l'équipe IA sert au **projet** : suivi des tâches, historique des livrables, mesures de qualité.
- Elle ne contient **jamais** de données utilisateur réelles, de données de pratique réelles, d'informations personnelles, de données médicales réelles ni de contenu du coffre (charte, section 12).
- Ses données de test sont fictives, manifestement fausses et marquées comme telles.
- Elle est sauvegardée quotidiennement, rétention 30 jours (section 15).

### 4.4 Codespaces

- Les Codespaces servent d'environnement de développement et de vérification distant, rattaché au dépôt privé.
- Les mêmes règles que sur Desktop s'y appliquent : aucune donnée interdite, aucun secret, aucun push sans « Pousse ».
- Un Codespace ne contient jamais de copie de données réelles.

### 4.5 GitHub — dépôt privé

- Dépôt : **github.com/majingod/KNuit**, **privé**.
- Il contient le code, la documentation et les documents validés du projet. C'est, avec les documents validés, la **source de vérité** du projet (section 6).
- Aucune mise en public, même partielle, sans décision explicite de Master.
- Aucun push sans « Pousse » explicite de Master (charte, section 9.5).

### 4.6 Ce qui n'existe pas en V1

- Aucun déploiement public, aucune URL publique. **Cloudflare Pages est gelé.**
- Aucun compte, aucune connexion, aucune synchronisation — ni dans l'application, ni dans l'infrastructure de l'équipe IA pour le compte des utilisateurs.
- Aucun serveur de production : l'application est local-first et hors ligne.

---

## 5. Réseau

### 5.1 Principe : le moins de réseau possible

L'équipe IA travaille autant que possible **localement** : modèles locaux (Ollama), base locale (PostgreSQL), machine Desktop. Le réseau n'est utilisé que pour ce qui l'exige vraiment : GitHub (dépôt privé), les modèles externes le cas échéant, et les ressources publiques de documentation.

### 5.2 Flux réseau autorisés

| Flux | Destination | Condition |
|---|---|---|
| Push / pull Git | github.com/majingod/KNuit (privé) | Push uniquement après « Pousse » explicite de Master |
| Prompts vers modèles externes | Modèle tiers (Arbiter éventuel) | Prompt relu avant envoi ; aucune donnée interdite, aucun secret |
| Documentation et ressources publiques | Sites de documentation, registres de paquets | Lecture seule, pour le travail en cours |
| Codespaces | Environnement GitHub | Mêmes règles que Desktop |

### 5.3 Flux interdits

- Aucun envoi de donnée interdite (charte, section 12) vers quelque destination réseau que ce soit.
- Aucun envoi de secret (charte, section 14) vers quelque destination que ce soit.
- Aucune synchronisation de données utilisateur : l'application n'a ni compte ni synchro, et l'équipe IA ne met en place aucun mécanisme de ce type.
- Aucun déploiement public en V1 (Cloudflare Pages gelé).

### 5.4 Modèles externes

Quand un modèle externe est utilisé (par exemple comme Arbiter tiers) :

- Le prompt est relu par Muse avant envoi.
- Le prompt ne contient ni donnée interdite ni secret.
- La réponse est traitée comme une **recommandation** (rang 5 des sources de vérité), jamais comme une preuve.
- L'usage d'un modèle externe pour une tâche est signalé à Master dans la synthèse du livrable concerné.

---

## 6. Source de vérité

### 6.1 Ordre de priorité (rappel de la charte, section 8)

En cas de contradiction, l'ordre suivant tranche. Il est fixe.

1. **Décision explicite de Master.**
2. **Validation requise d'un expert humain** (quand Master l'exige).
3. **Documents validés** (charte, architecture, périmètre MVP (doc 02), décisions consignées).
4. **Preuves vérifiables** (tests, hashes, diffs Git, builds, mesures).
5. **Recommandations IA** — toujours en dernier.

### 6.2 GitHub + documents validés = source de vérité du projet

La continuité du projet repose sur deux piliers (charte, section 16) :

- **GitHub (dépôt privé)** : le code, son historique complet, ses branches. L'historique Git est la mémoire factuelle du code : chaque changement est daté, attribué et diffusable.
- **Documents validés** : la charte, cette architecture, le périmètre MVP (doc 02), les décisions consignées de Master. Un document est « validé » quand Master l'a approuvé explicitement. Les brouillons ne font pas foi.

### 6.3 Gestion des contradictions

- Une recommandation IA ne prime jamais sur un document validé ou une décision de Master.
- Si une preuve vérifiable contredit un document validé ou une décision de Master, **escalade vers Master** : le document est peut-être périmé, ou la preuve fausse. Aucune correction autonome.
- Si un document validé contredit une décision récente de Master, la décision de Master prime et le document doit être mis à jour (charte, section 17).
- Toute mise à jour d'un document validé suit la procédure de révision de la section 17 du présent document.

### 6.4 Ce qui n'est PAS une source de vérité

- La mémoire d'un agent (contexte de conversation, résumé improvisé).
- Une affirmation non étayée, même répétée par plusieurs agents.
- Un brouillon, une note de travail, un message non validé.
- Le contenu d'un modèle externe.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : « cahier des charges » remplacé par « périmètre MVP (doc 02) » aux § 6.1 et § 6.2 — il n'existe pas de cahier des charges dans la numérotation actuelle des documents (voir A5 § 12).]

---

## 7. Mémoire du projet

### 7.1 Ce que la mémoire contient

La mémoire du projet est l'historique **écrit et vérifiable** des décisions et de leur contexte :

- les décisions de Master, avec leur date et leur formulation ;
- le motif de chaque décision (quand il est connu) ;
- les options écartées et pourquoi ;
- les preuves associées aux livrables acceptés ;
- les incidents, les escalades et leur résolution ;
- les points en attente de décision de Master.

### 7.2 Où vit la mémoire

- **Dans les documents validés** du dépôt (décisions consignées, historique des versions).
- **Dans l'historique Git** (commits, messages, diffs).
- **Dans la base PostgreSQL de l'équipe IA** (suivi des tâches et des livrables).
- **Dans les sauvegardes quotidiennes** (section 15).

La mémoire ne vit **jamais uniquement** dans la tête d'un agent ou dans un contexte de conversation : un contexte se perd, un document validé reste.

### 7.3 Règles

- Toute décision de Master est consignée le jour même, dans les documents validés.
- Toute décision est consignée avec sa date ; une décision sans date est une décision perdue.
- Quand un agent reprend un dossier, il relit la mémoire du projet avant de produire quoi que ce soit.
- La mémoire ne contient aucune donnée interdite (charte, section 12) ni aucun secret (charte, section 14).
- Un nouvel agent qui rejoint l'équipe commence par lire la charte, cette architecture et les documents validés (charte, section 16.3).

### 7.4 Limites

La mémoire du projet est un aide-mémoire, pas une source de vérité autonome : en cas de conflit, l'ordre de la section 6 s'applique. Une note de mémoire ne prime jamais sur une décision explicite de Master ni sur un document validé.

---

## 8. Agents

### 8.1 Inventaire

| Agent | Modèle / nature | Fonction | Ne fait jamais |
|---|---|---|---|
| Master | Humain (Frédéric) | Décide et tranche seul | — |
| Muse | Modèle (chef de projet) | Coordonne, vérifie indépendamment, synthétise, vulgarise | Trancher |
| Orchestrateur | Agent de coordination | Répartit les tâches, gère le chargement séquentiel | Produire un livrable final, valider |
| Rôle A | Qwen2.5-Coder 7B (local) | Produire un livrable | Critiquer son propre travail |
| Rôle B | DeepSeek-R1 8B (local) | Produire un livrable indépendant | Critiquer son propre travail |
| Exécution | Llama-3.2-3B (local, léger) | Tâches d'exécution courantes | — |
| Planification / arbitrage | DeepSeek-Coder-V2-Lite quantifié (local) | Planification des tâches et arbitrage technique | — |
| Critique croisée | Rôle A ↔ Rôle B | Relire le travail de l'autre rôle | Modifier directement le travail critiqué |
| Arbiter | Muse ou modèle tiers indépendant | Recommander sur preuves | Décider à la place de Master ; arbitrer un travail dont il est l'auteur |

### 8.2 Muse — chef de projet

- Unique interlocuteur de Master.
- Traduit les instructions de Master en tâches pour l'Orchestrateur.
- Vérifie indépendamment chaque livrable : recalcule les hashes, relit les contenus, relance ou contrôle les tests.
- Présente à Master des synthèses en langage simple, à trois niveaux de lecture (30 s, 5 min, 20 min).
- Escalade tout ce qui relève de la liste d'escalade obligatoire (charte, section 10.3).
- Quand il agit comme Arbiter, **il se signale explicitement**.

### 8.3 Orchestrateur

- Reçoit les tâches de Muse, les découpe et les confie aux Rôles A et B.
- Gère la séquence de chargement des modèles locaux : un seul modèle en mémoire à la fois, déchargement complet avant le suivant.
- **Outil d'orchestration en V1 : script Python minimal (voir A5 §4.4) ; LangGraph préféré à CrewAI au-delà de la V1 (décision D-14).**
- Collecte les livrables et les rapports de critique, les transmet à l'Arbiter.
- Suit l'avancement et signale les blocages à Muse.
- Ne produit pas de contenu final et ne valide rien.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : modèles Llama-3.2-3B (exécution) et DeepSeek-Coder-V2-Lite quantifié (planification / arbitrage) ajoutés à l'inventaire — ils figuraient déjà dans A5 (§ 4.2 et § 5.2) ; outil d'orchestration V1 précisé (script Python minimal, voir A5 § 4.4).]

### 8.4 Rôle A — Qwen2.5-Coder 7B

- Modèle local, chargé via Ollama.
- Produit des livrables de code et de documentation technique selon la tâche confiée.
- Critique le travail du Rôle B : rapport écrit, précis, fondé sur des preuves.

### 8.5 Rôle B — DeepSeek-R1 8B

- Modèle local, chargé via Ollama.
- Produit un livrable indépendant sur la même tâche, ou complète celui du Rôle A selon la consigne.
- Critique le travail du Rôle A : rapport écrit, précis, fondé sur des preuves.

### 8.6 Contrainte de chargement séquentiel

- **8 Go de VRAM** : les deux modèles (7B et 8B) ne peuvent pas être chargés en même temps.
- Séquence type : charger A → produire A → décharger A → charger B → produire B → décharger B → charger A → critique de B par A → décharger A → charger B → critique de A par B → décharger B.
- L'Orchestrateur planifie les tâches en tenant compte de ces temps de chargement. Aucune tâche n'exige les deux modèles simultanément.
- En cas d'échec de chargement, l'Orchestrateur signale le blocage à Muse ; aucun remplacement improvisé.

### 8.7 Arbiter

- **Muse ou modèle tiers indépendant.** Jamais l'un des deux auteurs.
- Compare les livrables A et B et leurs critiques, tranche les désaccords **sur la base des preuves**, recommande une version finale.
- Sa recommandation est transmise à Muse, qui la présente à Master pour validation finale. L'Arbiter recommande ; Master décide.
- Quand Muse tient ce rôle, il se signale (charte, section 3.3).

### 8.8 Remplaçabilité des modèles

Chaque rôle est défini par sa **fonction**, pas par son modèle. Si Qwen2.5-Coder 7B ou DeepSeek-R1 8B devient indisponible, un autre modèle prend le rôle, avec les mêmes règles, les mêmes preuves et les mêmes limites. Le projet ne dépend d'aucun modèle (charte, section 16.1). Le remplacement d'un modèle est signalé à Master et consigné dans la mémoire du projet.

---

## 9. Workflow standard

Le workflow standard s'applique à toute tâche confiée à l'équipe IA. Il comporte six étapes.

### Étape 1 — Cadrage (Muse)

- Muse reçoit l'instruction de Master.
- Il reformule la tâche en langage simple et vérifie le périmètre : qu'est-ce qui est demandé, qu'est-ce qui ne l'est pas.
- Si l'instruction est ambiguë, incomplète ou hors périmètre, Muse demande une clarification à Master **avant** de lancer le travail.
- La tâche cadrée est consignée (mémoire du projet, section 7).

### Étape 2 — Répartition (Orchestrateur)

- L'Orchestrateur reçoit la tâche cadrée et la répartit entre les Rôles A et B.
- Il planifie la séquence de chargement des modèles (section 8.6).
- Il précise à chaque rôle ce qui est attendu : nature du livrable, preuves requises, délai indicatif.

### Étape 3 — Production (Rôles A et B)

- Chaque rôle produit son livrable, avec ses preuves (tests, hashes, diffs, builds selon la nature du travail).
- Les rôles travaillent séquentiellement (un seul modèle chargé à la fois).
- Un livrable sans preuve est un brouillon : il n'avance pas à l'étape suivante.

### Étape 4 — Critique croisée

- Le Rôle A critique le livrable du Rôle B ; le Rôle B critique celui du Rôle A.
- Chaque critique est un rapport écrit, précis, fondé sur des preuves (extraits, résultats de tests, références).
- La critique ne modifie pas le travail critiqué : elle produit un rapport, transmis à l'Arbiter via l'Orchestrateur.

### Étape 5 — Arbitrage

- L'Arbiter compare les livrables et les critiques, tranche les désaccords sur la base des preuves et recommande une version finale.
- S'il subsiste un désaccord fondé sur une preuve, un nouveau cycle commence (retour à l'étape 3 pour correction, puis étape 4). **Maximum 3 cycles, puis escalade obligatoire vers Master** (section 11).
- La recommandation de l'Arbiter est écrite et motivée par les preuves invoquées.

### Étape 6 — Vérification et présentation (Muse → Master)

- Muse vérifie indépendamment le livrable convergé : hashes recalculés, contenus relus, tests contrôlés.
- Muse rédige la synthèse en langage simple, à trois niveaux de lecture (30 s, 5 min, 20 min), avec la traçabilité complète (auteur, critique, arbitrage, preuves, cycles consommés).
- Muse présente le livrable à Master pour validation.
- **Master valide ou non.** Aucune suite (push, déploiement, tâche suivante dépendante) sans validation explicite.

### Schéma du workflow

```
Cadrage (Muse) → Répartition (Orchestrateur) → Production (A, B)
     → Critique croisée (A↔B) → Arbitrage → Vérification (Muse)
     → Présentation à Master → Validation Master
          ↑                                │
          └── 3 cycles max, puis escalade ─┘
```

---

## 10. Workflow de développement

Le workflow standard (section 9) s'applique au développement logiciel, avec les précisions suivantes.

### 10.1 Branches et commits

- Le travail se fait sur des branches dédiées, jamais directement sur la branche principale.
- Chaque commit est petit, ciblé et accompagné d'un message clair en français, décrivant ce qui change et pourquoi.
- Aucun commit ne contient de secret ni de donnée interdite (charte, sections 12 et 14).
- L'historique Git est la mémoire factuelle du code : il est propre, lisible et vérifiable.

### 10.2 Preuves exigées pour le code

Avant qu'un livrable de code soit présenté à Master, les preuves suivantes sont fournies et vérifiées :

| Preuve | Outil / moyen | Seuil |
|---|---|---|
| Build | `npm run build` (Vite) | Réussite sans erreur |
| Type-check | `tsc` (TypeScript 7.0.2) | Aucune erreur |
| Lint | Linter configuré du projet | Réussite, ou écarts justifiés et consignés |
| Tests | Suite de tests du projet | Tous les tests prévus passent ; résultats joints |
| Diff Git | `git diff` | Relu par Muse |
| Rapport de sécurité | Vérifications de sécurité prévues | Résultats joints |

Un livrable de code sans build réussi, sans type-check et sans tests passés n'est **pas prêt** (charte, section 11.2).

### 10.3 Stack applicative (état vérifié du dépôt, voir A5 §2.4 — à geler par décision Master si la stack doit être figée)

- **Vite 8.3.8 + Preact 11.2.0 + TypeScript 7.0.2.**
- PWA, service worker écrit à la main, **sans Workbox**.
- Application local-first, hors ligne, sans compte ni synchronisation.
- Toute proposition de changement de stack est une question de périmètre : escalade vers Master (charte, section 10.3).

> [Correction de cohérence 2026-11-19 — amendement n° 3 : « rappel gelé » remplacé — la stack est un état vérifié du dépôt (voir A5 § 2.4), pas un élément gelé ; son gel éventuel relève d'une décision Master.]

### 10.4 Revue de code

- La revue de code passe par la critique croisée (Rôle A relit B, B relit A) puis par l'Arbiter.
- Muse relit le diff Git avant présentation à Master.
- Aucune revue ne se fait « de mémoire » : elle s'appuie sur le diff, les tests et les mesures.

### 10.5 Push et fusion

- **Aucun push sans que Master ait dit explicitement « Pousse ».** « C'est bon », « OK », « vas-y » ne valent pas « Pousse ».
- Avant un push autorisé, Muse vérifie le contenu du push : diff, fichiers concernés, absence de secret et de donnée interdite.
- La fusion vers la branche principale suit la même règle : validation explicite de Master.
- Aucun déploiement public en V1 ; Cloudflare Pages gelé.

### 10.6 Environnements

| Environnement | Usage | Données |
|---|---|---|
| Desktop (équipe IA) | Production et vérification | Données fictives de test uniquement |
| Codespaces | Développement et vérification distants | Données fictives de test uniquement |
| Application KNuit (appareil de l'utilisateur) | Usage réel | Données réelles — jamais accessibles à l'équipe IA |

---

## 11. Gestion des désaccords

### 11.1 Principe

Les désaccords sont normaux et utiles : ils signalent un point qui mérite d'être examiné. Ils se règlent par les **preuves**, jamais par l'insistance, la répétition ou la qualité rhétorique.

> **Une IA ne gagne jamais un débat parce qu'elle argumente mieux. Les preuves priment toujours sur les opinions.**

### 11.2 Procédure

1. **Constat** : le désaccord est formulé par écrit, avec la position de chaque camp et les preuves invoquées par chacun.
2. **Critique croisée** : chaque camp examine la preuve de l'autre et répond sur la preuve, pas sur la personne (ou le modèle).
3. **Arbitrage** : l'Arbiter compare les preuves et recommande. Il motive sa recommandation en citant les preuves retenues et celles écartées, avec le motif de l'écart.
4. **Révision** : les rôles corrigent selon la recommandation ; un nouveau cycle commence si un désaccord subsiste.
5. **Limite** : **3 cycles maximum, puis escalade obligatoire vers Master**, avec les deux versions, les preuves de chaque camp, la recommandation de l'Arbiter et la question précise à trancher.

### 11.3 Ce qui ne règle jamais un désaccord

- Répéter le même argument plus fort ou plus longuement.
- Invoquer l'autorité d'un modèle (« DeepSeek dit que… » n'est pas une preuve).
- Le vote ou le nombre : deux agents d'accord contre un n'ont pas raison pour autant.
- L'ancienneté d'une affirmation : une idée ancienne et non vérifiée ne vaut pas plus qu'une idée neuve et prouvée.

### 11.4 Désaccord entre un agent et un document validé

Si un agent estime qu'un document validé est faux ou périmé, il ne le corrige pas seul : il signale la contradiction à Muse, avec ses preuves, et Muse escalade vers Master (section 6.3).

### 11.5 Désaccord entre Muse et l'Arbiter

Muse peut être en désaccord avec la recommandation de l'Arbiter (notamment quand Muse n'est pas l'Arbiter). Dans ce cas, Muse présente à Master **les deux positions avec leurs preuves** et laisse Master trancher. Muse ne passe jamais sous silence une recommandation d'arbitrage.

---

## 12. Mesures de qualité

### 12.1 Principe

La qualité se mesure, elle ne se déclare pas. Chaque livrable est évalué sur des mesures vérifiables, présentées à Master en langage simple.

### 12.2 Mesures par livrable

| Mesure | Ce qu'elle vérifie | Comment elle est établie |
|---|---|---|
| Conformité au périmètre | Le livrable fait ce qui a été demandé, ni plus ni moins | Relecture du cadrage par Muse |
| Preuves fournies | Tests, hashes, diffs, builds, lint, type-check, rapport de sécurité | Vérification indépendante par Muse |
| Cycles de révision | Le travail a convergé dans la limite de 3 cycles | Comptage consigné dans la traçabilité |
| Indépendance de la critique | Créateur ≠ critique, Arbiter jamais auteur | Vérification de la traçabilité |
| Absence de donnée interdite | Aucune donnée réelle, personnelle, médicale, ni contenu du coffre | Contrôle avant présentation et avant push |
| Absence de secret | Aucun mot de passe, clé, token dans le livrable | Contrôle avant présentation et avant push |
| Lisibilité pour Master | Synthèse en langage simple, 3 niveaux de lecture | Relecture par Muse |

### 12.3 Mesures du code

- **Build** : réussite sans erreur.
- **Type-check** : zéro erreur TypeScript.
- **Lint** : zéro erreur non justifiée.
- **Tests** : tous les tests prévus passent ; couverture suivie et communiquée à Master en langage simple (par exemple : « telle partie est testée, telle partie ne l'est pas encore »).
- **Sécurité** : rapport de sécurité joint ; aucune vulnérabilité connue non traitée et non signalée.

### 12.4 Mesures du processus

- **Délai de convergence** : nombre de cycles consommés par livrable (cible : 1 à 2 ; 3 = signal d'alerte ; escalade au-delà).
- **Taux d'escalade** : proportion de livrables escaladés vers Master après 3 cycles. Un taux élevé signale un problème de cadrage ou de périmètre, pas un problème d'effort.
- **Taux de reprise** : proportion de livrables renvoyés par Muse après vérification indépendante (hash, contenu ou test non conforme).

Ces mesures de processus sont revues avec Master à chaque changement de phase. Elles servent à améliorer le travail, jamais à juger un modèle.

### 12.5 Ce qui n'est pas une mesure de qualité

- La longueur d'un livrable.
- La rapidité de production.
- Le nombre d'agents d'accord entre eux.
- L'assurance affichée par un agent (« je suis certain que… » n'est pas une mesure).

---

## 13. Sécurité opérationnelle

### 13.1 Périmètre

La sécurité opérationnelle couvre : la machine Desktop, Ollama et les modèles locaux, la base PostgreSQL de l'équipe IA, les Codespaces, le dépôt GitHub privé, les échanges avec les modèles externes, et les postes de travail de l'équipe.

### 13.2 Règles

- **Dépôt privé, toujours.** Aucune mise en public, même partielle, sans décision explicite de Master.
- **Aucune URL publique, aucun déploiement public en V1.** Cloudflare Pages gelé.
- **Accès minimal.** Chaque agent n'accède qu'aux ressources nécessaires à sa tâche.
- **Prompts externes relus.** Tout prompt adressé à un modèle externe est relu par Muse avant envoi (section 5.4).
- **Données fictives uniquement.** Les environnements de l'équipe IA ne contiennent que des données fictives de test, manifestement fausses et marquées comme telles.
- **Journaux purgés.** Les journaux et caches (Ollama, PostgreSQL, Codespaces) sont purgés de toute donnée sensible avant sauvegarde et avant partage.
- **Mises à jour validées.** Les outils et dépendances de l'environnement IA sont mis à jour sur décision de Master, jamais automatiquement sans validation.

### 13.3 Contenu sensible de l'application

KNuit traite de sujets intimes (BDSM/kink) et de situations de crise (Mode Urgence, « Ça s'est mal passé »). Les règles suivantes s'appliquent à tout le travail de l'équipe IA sur ces contenus :

- Les contenus de crise, médicaux, psychologiques ou juridiques sont des sujets d'**escalade obligatoire** vers Master (charte, section 10.3) : l'équipe IA ne rédige, ne valide ni ne modifie seule ce type de contenu.
- Les contenus de l'application sont conçus et testés avec des données fictives uniquement.
- Aucun contenu réel d'utilisateur n'est jamais utilisé pour concevoir, tester ou illustrer l'application.

### 13.4 Incidents

Tout incident de sécurité (accès non autorisé, exposition de donnée ou de secret, comportement anormal d'un agent) :

1. Arrête le travail concerné (STOP).
2. Est signalé à Master immédiatement, avec les faits et les mesures prises.
3. Est consigné dans la mémoire du projet.
4. Ne reprend qu'après validation explicite de Master.

---

## 14. Gestion des secrets

### 14.1 La règle

**Aucun secret n'apparaît jamais dans Git, dans GitHub, dans la documentation, ni dans les prompts.**

Sont des secrets, notamment : mots de passe, clés API, tokens, clés de chiffrement, phrases de récupération, identifiants de connexion, certificats privés.

### 14.2 Où vivent les secrets

Uniquement dans :

1. **Les variables d'environnement** de l'environnement d'exécution concerné ;
2. **Un gestionnaire de secrets approuvé par Master.**

Nulle part ailleurs.

### 14.3 Mise en œuvre dans l'architecture

| Emplacement | Secret autorisé ? | Contrôle |
|---|---|---|
| Dépôt Git / GitHub | **Non, jamais** | Vérification du diff avant chaque push ; scan avant présentation |
| Documentation | **Non, jamais** | Relecture avant validation |
| Prompts (locaux ou externes) | **Non, jamais** | Relecture du prompt avant envoi |
| Variables d'environnement | **Oui** | Accès limité, jamais consignées ni journalisées |
| Gestionnaire de secrets approuvé | **Oui** | Sur décision de Master |
| Journaux et rapports | **Non, jamais** | Relecture avant diffusion |
| Fichiers `.env.example` | **Non** — valeurs manifestement fausses uniquement (`VOTRE_CLE_ICI`) | Relecture |

### 14.4 Exposition accidentelle

Un agent qui reçoit ou découvre un secret par erreur :

1. Ne le répète pas, ne le consigne pas, ne le transmet pas.
2. Signale l'incident à Muse immédiatement.
3. Muse signale à Master et organise la révocation et le remplacement du secret exposé.

### 14.5 Clés de chiffrement du coffre

Le chiffrement du coffre local de l'application relève de l'application elle-même, sur l'appareil de l'utilisateur. L'équipe IA ne manipule jamais les clés de chiffrement du coffre, ne les demande jamais et ne les stocke jamais. Toute question sur ces clés est escaladée vers Master (sécurité, charte section 10.3).

---

## 15. Sauvegardes

### 15.1 Politique

- **Sauvegardes quotidiennes** de l'ensemble de l'environnement de l'équipe IA.
- **Rétention : 30 jours.** Au-delà, les sauvegardes les plus anciennes sont supprimées.
- La politique de sauvegarde est vérifiée régulièrement : une sauvegarde non testée est une sauvegarde qui n'existe pas.

### 15.2 Ce qui est sauvegardé

| Contenu | Fréquence | Rétention |
|---|---|---|
| Dépôt Git (code + documentation) | Quotidienne (+ à chaque push validé) | 30 jours |
| Base PostgreSQL de l'équipe IA | Quotidienne | 30 jours |
| Documents validés | Quotidienne | 30 jours |
| Mémoire du projet (décisions, historique) | Quotidienne | 30 jours |
| Configurations de l'environnement (Ollama, outils) | Quotidienne | 30 jours |

### 15.3 Ce qui n'est jamais sauvegardé

- Aucune donnée interdite (charte, section 12) : il n'y en a pas dans l'environnement IA ; si une telle donnée y était découverte, elle serait supprimée, pas sauvegardée.
- Aucun secret (charte, section 14).
- Aucune donnée réelle d'utilisateur.

### 15.4 Restauration

- Dès que la procédure de restauration est validée par Master (voir A5 §9.3), elle est documentée et testée au moins à chaque changement de phase.
- Un test de restauration réussi est consigné dans la mémoire du projet, avec sa date et son résultat.
- En cas de perte de données, Muse signale l'incident à Master avec les faits et le plan de reprise, avant toute restauration.

### 15.5 Responsabilité

Le responsable de la vérification des sauvegardes — une fois désigné par Master (voir A5 §9.3) — vérifie que les sauvegardes ont bien eu lieu et signale à Master tout échec de sauvegarde. L'équipe IA ne suppose jamais qu'une sauvegarde a réussi : elle le vérifie.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : § 15.4 et § 15.5 reformulés au conditionnel — la procédure de restauration n'est documentée et testée que dès qu'elle est validée par Master, et le responsable de la vérification n'existe qu'une fois désigné par Master (voir A5 § 9.3) ; ces points n'étaient pas acquis.]

---

## 16. Continuité

### 16.1 Le projet ne dépend d'aucun modèle

Si Qwen2.5-Coder 7B, DeepSeek-R1 8B ou Muse devenaient indisponibles, le projet continue : un autre modèle prend le rôle, selon la même charte, les mêmes règles et les mêmes preuves. Le remplacement d'un modèle est signalé à Master et consigné dans la mémoire du projet.

### 16.2 Piliers de continuité

1. **GitHub (dépôt privé)** : code, historique, branches — source de vérité du code.
2. **Documents validés** : charte, architecture, périmètre MVP (doc 02), décisions consignées — source de vérité des règles.

[Correction de cohérence 2026-11-19 — amendement n° 3 : « cahier des charges » remplacé par « périmètre MVP (doc 02) » — il n'existe pas de cahier des charges dans la numérotation actuelle des documents.]
3. **Sauvegardes quotidiennes, rétention 30 jours** (section 15).
4. **Mémoire du projet** (section 7) : décisions, motifs, incidents, points en attente.

### 16.3 Reprise par un nouvel agent

Un nouvel agent qui rejoint l'équipe doit, avant de produire quoi que ce soit :

1. Lire la charte (`05-charte-equipe-ia.md`) et la présente architecture.
2. Lire les documents validés en vigueur.
3. Confirmer à Muse qu'il a compris les règles — et poser ses questions avant de commencer.

Un agent qui n'a pas lu la charte ne travaille pas.

### 16.4 Absence de Master

Si Master est indisponible, l'équipe IA ne prend **aucune décision** à sa place. Elle peut préparer des dossiers, avancer les travaux déjà approuvés dans leur périmètre approuvé, et documenter l'état d'avancement — mais elle ne tranche rien, n'étend aucun périmètre et ne pousse rien.

### 16.5 Perte d'un composant

| Composant perdu | Reprise |
|---|---|
| Un modèle local (A ou B) | Remplacement par un autre modèle dans le même rôle ; signalement à Master |
| Muse | Reprise par un autre agent chef de projet, avec relecture complète de la charte et de la mémoire ; signalement à Master |
| Orchestrateur | Muse reprend la coordination directement jusqu'à la mise en place d'un remplaçant |
| Machine Desktop | Restauration depuis les sauvegardes (section 15) ; vérification complète avant reprise |
| Dépôt GitHub | Restauration depuis une copie locale et les sauvegardes ; signalement immédiat à Master |
| Base PostgreSQL équipe IA | Restauration depuis la sauvegarde quotidienne la plus récente |

Dans tous les cas, la reprise est vérifiée (preuves, hashes, tests) avant que le travail normal reprenne, et Master est informé.

---

## 17. Révision

### 17.1 Principe

Ce document est **proposé pour gel** en version 1.0. Une fois gelé par Master, il sera stable, faisant autorité, modifiable uniquement par la procédure ci-dessous. Le gel protège le projet contre les changements silencieux d'architecture.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : « gelé en v1.0 » remplacé par « proposé pour gel » — ce document n'est pas gelé, il est soumis au gel par Master.]

### 17.2 Cohérence avec la charte

La présente architecture met en œuvre la Charte de l'Équipe IA KNuit (`05-charte-equipe-ia.md`). Les deux documents doivent rester cohérents :

- Toute modification de la charte entraîne une vérification de cette architecture, et une mise à jour si nécessaire.
- Toute modification de cette architecture entraîne une vérification de la charte.
- En cas de conflit, **la charte prime**.

### 17.3 Procédure de révision

1. **Proposition** : la modification proposée est rédigée, avec son motif et ses conséquences (y compris sur la charte).
2. **Examen** : Muse vérifie la cohérence avec la charte et signale toute contradiction.
3. **Validation Master** : Master approuve ou refuse, explicitement.
4. **Mise à jour** : le document est mis à jour (nouveau numéro de version, date, entrée dans l'historique des versions) ainsi que la charte si nécessaire.
5. **Diffusion** : Muse informe toute l'équipe IA du changement et de sa date d'effet.

### 17.4 Qui peut proposer une révision

- Master, à tout moment.
- Muse, en présentant à Master une proposition motivée, en langage simple, avec les conséquences du changement.
- Tout agent, en adressant sa proposition à Muse, qui la transmet à Master si elle le mérite.

Aucun agent ne modifie ce document de sa propre initiative.

### 17.5 Fréquence

Cette architecture est relue au minimum à chaque changement de phase du projet (fin de V1, fin de Phase 1, passage au Mode Duo) et à chaque incident majeur. Une relecture n'impose pas une modification.

---

*Fin de l'Architecture de l'Équipe IA KNuit v1.0 — PRÊT POUR GEL — 2026-11-18.*
