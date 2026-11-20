# Annexe A5 — Architecture Technique de l'Équipe IA KNuit

**Version :** v1.0
**Statut :** Version 1.0 (2026-11-19) — en attente de validation par Master
**État :** Prête pour la v1 — Version 1.0, en attente de validation par Master
**Date :** 2026-11-18
**Décideur :** Master
**Projet :** KNuit — application Kink de Nuit
**Dépôt :** dépôt privé github.com/majingod/KNuit

> [Correction de cohérence 2026-11-19 — amendement n° 3 : « Validé pour la v1 » remplacé par « Prête pour la v1, non gelée — proposée pour gel le 2026-11-18 » (en-tête, § 11.4 et pied de document) — A5 n'est pas gelée.]

> **Règle en vigueur — à rappeler en tête de toute lecture technique :**
> « Une IA ne gagne jamais un débat parce qu'elle argumente mieux. Les preuves priment toujours sur les opinions. »
>
> Master décide seul. Muse, chef de projet, propose, recommande, synthétise, vérifie et vulgarise — il ne tranche jamais. Le créateur n'est jamais le critique. Maximum 3 cycles, puis escalade vers Master.
>
> Sources de vérité, dans cet ordre : 1) Décision Master, 2) Validation experte (avant commercialisation), 3) Documents validés, 4) Preuves vérifiables, 5) Recommandations IA en dernier.

---

## 1. Objectif

Cette annexe décrit l'architecture technique de l'équipe IA qui accompagne le développement de KNuit, ainsi que la stack technique de l'application elle-même.

Elle répond à une seule question : **avec quoi, sur quoi, et selon quelles règles l'équipe IA travaille-t-elle, sans jamais toucher aux données réelles de l'utilisateur ?**

Portée de cette annexe :

- l'infrastructure matérielle et logicielle de l'équipe IA ;
- le réseau et les accès ;
- les outils et logiciels utilisés ;
- les rôles et les modèles d'IA ;
- le workflow technique de production et de validation ;
- la mémoire technique du projet ;
- la sécurité technique ;
- les sauvegardes et la continuité ;
- l'évolution technique prévue ;
- les limites connues ;
- les références vers les autres documents du projet.

Hors portée :

- le contenu fonctionnel de l'application (voir les documents 01 à 06) ;
- les données réelles, personnelles, médicales et le contenu du coffre — **interdites partout** (voir § 8).

Cette annexe est en version 1.0, en attente de validation par Master. Toute modification passe par une décision de Master, consignée dans l'annexe A2 (Registre des décisions).

---

## 2. Infrastructure

### 2.1 Machine de l'utilisateur (hôte de l'équipe IA)

La machine de l'utilisateur héberge **l'équipe IA**. Elle n'héberge **pas** l'application KNuit en production.

| Élément | Valeur vérifiée |
|---|---|
| Processeur | Intel i7-13700F |
| Carte graphique | NVIDIA GeForce RTX 4060 Ti, 8 Go VRAM |
| Mémoire | 32 Go de RAM DDR5 |
| Stockage | ~2 To libres |
| Système d'exploitation | Windows 11 |
| Disponibilité | Desktop allumé 24/7 |

Cette machine est le poste de travail principal et le serveur local de l'équipe IA. Son fonctionnement 24/7 est une hypothèse de travail de la v1 : si elle s'éteint, l'équipe IA locale est indisponible jusqu'au redémarrage (voir § 9, Sauvegardes et continuité).

### 2.2 Machine de développement de l'application

Le développement de l'application KNuit se fait dans le dépôt privé GitHub (voir § 2.3). Aucune donnée réelle n'est utilisée pendant le développement.

### 2.3 Dépôt GitHub

| Élément | Valeur vérifiée |
|---|---|
| Dépôt | github.com/majingod/KNuit |
| Visibilité | Privé |
| Branche principale | `main` |
| Tête de branche vérifiée le 2026-11-18 | `598f460c` |
| Déploiement public en V1 | Non — gelé (voir A2) |
| Cloudflare Pages | Gelé en V1 — pas de déploiement public |

Règle en vigueur : **aucun push sans le mot « Pousse » de Master.** Aucun push automatique, aucune synchronisation implicite.

### 2.4 Stack de l'application KNuit

| Élément | Version vérifiée |
|---|---|
| Bundler / outil de build | Vite 8.3.8 |
| Framework UI | Preact 11.2.0 |
| Langage | TypeScript 7.0.2 |
| Type d'application | PWA (Progressive Web App) |
| Service worker | Écrit à la main, sans Workbox |
| Point d'entrée | `src/app.tsx` |

Structure des sources (vérifiée) :

```
src/
  app.tsx
  mal-passe/
  urgence/
  about/
  legal/
  layout/
public/
  sw.js
tests/
  e2e/            # 14 fichiers de specs Playwright, 45 tests
scripts/
  check-content-status.mjs
```

### 2.5 Suite de vérification

- **Suite exécutée le 2026-11-20 : 45/45** (`npm run test:e2e`).
- Tests end-to-end : 45 tests répartis dans 14 fichiers de specs Playwright, dans `tests/e2e`.
- Script de contrôle de contenu : `scripts/check-content-status.mjs`.

Tout nouveau résultat de test doit être consigné avec sa date, sa commande et sa sortie — jamais de mémoire, jamais approximé.

---

## 3. Réseau et accès

### 3.1 Accès local

En local, les services de l'équipe IA sont accessibles depuis la machine hôte et depuis le réseau local.

### 3.2 Accès distant — Tailscale

- **Tailscale est obligatoire pour l'accès distant.**
- Statut à la date de rédaction (2026-11-18) : **à installer plus tard** — l'installation n'a pas encore eu lieu.
- L'installation de Tailscale fait partie de la prochaine étape du projet, **seulement après validation des documents par Master** (voir A1, § 6), dans l'ordre indiqué.
- Une fois installé, Tailscale fournit le réseau privé par lequel la tablette et les autres appareils de l'utilisateur rejoignent les services locaux.

### 3.3 OpenWebUI — règle d'accès critique

- **OpenWebUI doit être accessible via l'IP Tailscale.**
- **Il ne doit PAS être limité à `127.0.0.1`.**
- Raison vérifiée : si OpenWebUI n'écoute que sur `127.0.0.1` (localhost), la tablette est bloquée — elle ne peut pas atteindre le service depuis le réseau, même via Tailscale.
- Cette règle est un point de contrôle obligatoire lors de l'installation : vérifier l'adresse d'écoute d'OpenWebUI avant de déclarer l'installation terminée.

### 3.4 Règles d'accès

- Aucun service de l'équipe IA n'est exposé sur l'internet public en V1.
- Aucun port n'est ouvert sur la box / le routeur pour l'équipe IA en V1.
- L'accès distant passe uniquement par Tailscale.
- Les secrets (clés API, tokens, mots de passe) ne sont **jamais** dans Git, dans les docs, ni dans les prompts (voir § 8).

---

## 4. Outils et logiciels

### 4.1 Outils de l'équipe IA

| Outil | Rôle | Statut au 2026-11-18 |
|---|---|---|
| Ollama | Exécution locale des modèles | À installer — après validation des docs |
| Tailscale | Réseau privé / accès distant | À installer — après validation des docs ; obligatoire |
| OpenWebUI | Interface d'accès aux modèles locaux | À installer — après validation des docs ; accès via IP Tailscale (voir § 3.3) |
| PostgreSQL | Mémoire du projet | À installer — après validation des docs |
| LangGraph | Orchestration des agents IA | Au-delà de la V1 ; à installer seulement sur décision Master |
| GitHub | Dépôt privé, versionnement | En place — dépôt privé github.com/majingod/KNuit |

**Ordre d'installation (proposé dans A1, à valider par Master) :** Ollama, puis Tailscale, puis OpenWebUI (vérifier l'écoute sur l'IP Tailscale), puis PostgreSQL, puis LangGraph — **seulement après validation des documents par Master.**

> [Correction de cohérence 2026-11-19 — amendement n° 3 : ordre d'installation corrigé — Ollama, puis Tailscale, puis OpenWebUI (vérifier l'écoute sur l'IP Tailscale), puis PostgreSQL, puis LangGraph ; OpenWebUI ne peut pas être vérifié avant Tailscale. « Gelé dans A1 » remplacé par « proposé dans A1, à geler par Master ».]

Aucune installation n'a lieu avant validation. Toute installation anticipée serait un écart à consigner et à faire valider par Master.

### 4.2 Ollama

Ollama exécute les modèles en local, sur la machine de l'utilisateur (RTX 4060 Ti, 8 Go VRAM — voir § 11, Limites connues).

Modèles prévus (quantifiés) :

- **Planification / arbitrage :** Qwen2.5-Coder-7B quantifié, ou DeepSeek-Coder-V2-Lite quantifié.
- **Exécution :** Llama-3.2-3B.

Les modèles exacts, leurs quantifications et leurs versions seront consignés lors de l'installation, avec preuves (sortie de commande). Rien n'est affirmé ici au-delà de ce qui est listé ci-dessus.

### 4.3 PostgreSQL

- PostgreSQL constitue la **mémoire du projet**.
- Contenu autorisé : documentation du projet, décisions, validations, historique technique — **sans aucune donnée réelle**.
- Contenu interdit : données réelles, données personnelles, données médicales, contenu du coffre (voir § 8).
- PostgreSQL n'est pas une base de données de l'application en V1, et ne contient aucune donnée d'usage réel.

### 4.4 LangGraph

- **LangGraph** est l'outil d'orchestration envisagé **au-delà de la V1**, sur décision de Master.
- En V1, si une orchestration est nécessaire, elle prend la forme d'un **script Python minimal de 200 à 300 lignes** — pas de framework, pas d'une usine à agents.
- **LangGraph n'est installé qu'après la V1, seulement sur décision Master.**
- Décision d'architecture : commencer simple, mesurer, puis seulement complexifier si une preuve le justifie.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : précisé — en V1, script Python minimal de 200 à 300 lignes, pas de framework ; LangGraph est l'option préférée au-delà de la V1, à installer seulement sur décision Master.]

### 4.5 Outils de l'application

- Vite 8.3.8, Preact 11.2.0, TypeScript 7.0.2 (voir § 2.4).
- Playwright : 45 tests répartis dans 14 fichiers de specs e2e.
- Service worker écrit à la main, sans Workbox.
- Script `scripts/check-content-status.mjs` : contrôle de statut du contenu.

---

## 5. Rôles et modèles

### 5.1 Principe fondateur : créateur ≠ critique

**Le créateur d'un livrable n'est jamais son critique.**

C'est la règle qui structure toute l'équipe IA :

- celui qui produit ne valide pas sa propre production ;
- la critique est portée par un rôle différent, avec un modèle différent, une vision différente ;
- en cas de désaccord persistant, l'Arbiter tranche — sur preuves, jamais sur opinions.

### 5.2 Les rôles

| Rôle | Modèle | Mission |
|---|---|---|
| **Rôle A** | Qwen2.5-Coder 7B | Production / création — premier jet, code, rédaction technique |
| **Rôle B** | DeepSeek-R1 8B | Production d'un livrable indépendant + critique du livrable du Rôle A — vision différente de celle du Rôle A, remise en question, détection des angles morts |
| **Exécution** | Llama-3.2-3B | Tâches d'exécution courantes, légères |
| **Planification / arbitrage** | Qwen2.5-Coder-7B quantifié ou DeepSeek-Coder-V2-Lite quantifié | Planification des tâches et arbitrage technique |
| **Arbiter** | Muse ou modèle tiers indépendant | Arbitrage final en cas de désaccord — **jamais un auteur** du livrable en débat |
| **Chef de projet** | Muse | Propose, recommande, synthétise, vérifie, vulgarise — **ne tranche jamais** |

La planification est confiée de préférence à DeepSeek-Coder-V2-Lite quantifié (voir § 4.2). Si Qwen planifie, la critique est faite par le Rôle B et l'arbitrage par un tiers indépendant.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : Rôle B corrigé — production d'un livrable indépendant + critique du livrable du Rôle A (pas seulement critique) ; planification confiée de préférence à DeepSeek-Coder-V2-Lite — si Qwen planifie, critique par le Rôle B et arbitrage par un tiers indépendant.]

### 5.3 Règle V2 : deux modèles aux visions différentes

La V2 de l'équipe repose sur **2 modèles aux visions différentes** (Rôle A et Rôle B). Ce n'est pas une redondance : c'est le mécanisme qui empêche qu'une seule vision, un seul biais, traverse tout le projet sans contradiction.

### 5.4 L'Arbiter

- L'Arbiter est **Muse ou un modèle tiers indépendant**.
- L'Arbiter n'est **jamais un auteur** du livrable qu'il arbitre.
- Limite connue (voir § 11) : **sans signaux exécutables, l'Arbiter interprète les tests et les mesures ; il ne tranche pas sur des opinions.** Autrement dit : un arbitrage sans preuve vérifiable (test, mesure, sortie de commande, document validé) n'est pas un arbitrage — c'est une opinion, et elle ne vaut pas décision.
- L'arbitrage ne remplace jamais une décision de Master. Master décide seul, en dernier ressort.

### 5.5 Le chef de projet (Muse)

Muse, chef de projet :

- propose des options ;
- recommande (avec justification et preuves) ;
- synthétise les échanges ;
- vérifie les faits, les compteurs, les sorties ;
- vulgarise en langage simple pour Master.

Muse **ne tranche jamais**. Toute phrase qui ressemblerait à une décision prise par Muse doit être relue comme une recommandation, soumise à Master.

---

## 6. Workflow technique

### 6.1 Cycle de production

1. **Demande de Master** — Master exprime le besoin, en langage simple.
2. **Proposition du chef de projet** — Muse propose un plan, des options, une recommandation.
3. **Décision de Master** — Master choisit. La décision est consignée dans A2.
4. **Production (Rôles A et B, chacun un livrable indépendant)** — Qwen2.5-Coder 7B et DeepSeek-R1 8B produisent chacun un livrable indépendant.
5. **Critique croisée (A critique B, B critique A)** — chaque rôle relit, conteste et propose des corrections sur le livrable de l'autre, avec une vision différente.
6. **Révision (les deux rôles)** — les deux rôles intègrent ou réfutent, preuves à l'appui.
7. **Arbitrage si désaccord** — l'Arbiter tranche sur preuves (tests, mesures, documents validés).
8. **Validation** — validation en langage simple, 3 niveaux de lecture (voir A3), par Master (validation experte : avant commercialisation, voir doc 04).
9. **Version** — le document ou le livrable est versionné ; toute modification ultérieure repasse par Master.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : étapes 4 à 6 corrigées — production par les Rôles A et B, chacun un livrable indépendant ; critique croisée (A critique B, B critique A) ; révision par les deux rôles.]

### 6.2 Règle des 3 cycles maximum

- **Maximum 3 cycles** de production ↔ critique ↔ révision sur un même livrable.
- Au-delà de 3 cycles sans accord : **escalade vers Master**, qui tranche.
- Aucun cycle supplémentaire sans décision explicite de Master.
- Cette règle empêche les boucles infinies entre IA et garantit que Master garde la main.

### 6.3 Preuves avant opinions

À chaque étape :

- un test qui passe (ou échoue) vaut plus qu'un argument ;
- une sortie de commande vaut plus qu'une affirmation ;
- un compteur vérifié vaut plus qu'une estimation ;
- un document validé vaut plus qu'une recommandation IA.

« Une IA ne gagne jamais un débat parce qu'elle argumente mieux. Les preuves priment toujours sur les opinions. »

### 6.4 Validation en langage simple

Toute validation est présentée en **langage simple, en 3 niveaux de lecture** (voir A3) :

1. **Niveau 1 — En une phrase :** ce que ça change pour Master.
2. **Niveau 2 — En bref :** les points clés, les choix, les risques.
3. **Niveau 3 — En détail :** le contenu technique complet, pour l'expert humain (validation pré-commercialisation).

Aucune validation n'est demandée sans ces 3 niveaux.

### 6.5 Règle « Pousse »

- Aucun push vers GitHub sans le mot **« Pousse »** de Master.
- Cette règle s'applique à tous les membres de l'équipe IA, sans exception.
- Un push fait sans « Pousse » est un écart à consigner dans A2 et à signaler à Master.

### 6.6 STOP documentation

**STOP documentation** : plus aucun nouveau document de cadrage n'est produit sans décision explicite de Master. L'équipe passe à l'installation et à la construction. (A6 et A7 sont des documents vivants — ils ne font pas partie de cette règle.)

[Correction de cohérence 2026-11-19 — amendement n° 3 : A6 et A7 retirés de la condition de STOP documentation — documents vivants / de référence, jamais gelés.]

---

## 7. Mémoire technique

### 7.1 Ce que la mémoire contient

La mémoire technique du projet (PostgreSQL, voir § 4.3) contient :

- les documents du projet, selon leur statut (voir § 12) : le registre 04 est un BROUILLON PRÉPARÉ ; les documents 05 et 06 sont en version 1.0, en attente de validation par Master ;
- le registre des décisions (A2) ;
- le registre des validations (A3) ;
- le registre des risques (A4) ;
- l'historique technique vérifiable : versions, têtes de branche, résultats de suites de tests, sorties de commandes.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : statuts corrigés au § 7.1 — le registre 04 est un BROUILLON PRÉPARÉ (pas gelé) ; 05 et 06 sont proposées pour gel (pas validés / gelés).]

### 7.2 Ce que la mémoire ne contient jamais

- Aucune donnée réelle.
- Aucune donnée personnelle.
- Aucune donnée médicale.
- Aucun contenu du coffre.
- Aucun secret (clé API, token, mot de passe).

Cette interdiction s'applique à PostgreSQL, à Ollama, aux modèles externes, à GitHub et à Codespaces — partout, sans exception.

### 7.3 Règles de la mémoire

- La mémoire est une aide, pas une source de vérité : en cas de conflit, l'ordre des sources de vérité (§ 1, encadré) prime.
- Toute entrée en mémoire cite sa source (document, décision Master, validation, preuve vérifiable).
- Une entrée sans source est une hypothèse — elle doit être marquée comme telle.

---

## 8. Sécurité technique

### 8.1 Données interdites — partout

Les catégories suivantes sont **interdites partout** : GitHub, Codespaces, PostgreSQL, Ollama, modèles externes, documents, prompts, messages.

- Données réelles d'usage.
- Données personnelles.
- Données médicales.
- Contenu du coffre (coffre local chiffré — voir A1).

Aucune exception en V1. Si un besoin futur exigeait de manipuler de telles données, il faudrait une décision explicite de Master et une architecture dédiée — ce n'est pas le cas en V1.

### 8.2 Secrets

- **Les secrets ne sont jamais dans Git, dans les docs, ni dans les prompts.**
- Clés API, tokens, mots de passe, phrases de récupération : hors dépôt, hors documentation, hors historique de conversation exploitable.
- Tout secret découvert par accident dans un doc ou dans Git doit être révoqué, retiré, et l'incident consigné et signalé à Master.

### 8.3 Accès distant

- Accès distant uniquement via Tailscale (voir § 3.2).
- Aucun service exposé publiquement en V1.
- OpenWebUI accessible via IP Tailscale, jamais limité à `127.0.0.1` (voir § 3.3) — sans pour autant être exposé sur l'internet public.

### 8.4 Dépôt privé

- Dépôt privé github.com/majingod/KNuit.
- Pas de déploiement public en V1.
- Cloudflare Pages gelé en V1.
- Aucun push sans « Pousse » (voir § 6.5).

### 8.5 Sécurité de l'accès distant — point d'attention

La sécurité de l'accès distant fait partie des risques sous-évalués identifiés dans la consolidation du 2026-11-18 (voir A4, R-02). Elle doit être réévaluée lors de l'installation de Tailscale et d'OpenWebUI, avant toute utilisation à distance.

---

## 9. Sauvegardes et continuité

### 9.1 Règle en vigueur

- **Sauvegardes quotidiennes.**
- **Rétention 30 jours.**

Cette règle s'applique au dépôt, à la documentation et à la mémoire technique du projet.

### 9.2 Continuité

- La machine hôte est allumée 24/7 : si elle s'éteint ou tombe en panne, l'équipe IA locale est indisponible jusqu'au redémarrage.
- Le dépôt GitHub privé est la copie de référence du code et de la documentation versionnée : tant que les pushes sont faits (sur « Pousse » de Master), le travail n'est pas perdu avec la machine.
- L'absence de plan de sauvegarde formalisé fait partie des risques manquants identifiés dans la consolidation du 2026-11-18 (voir A4, R-01). La règle « sauvegardes quotidiennes, rétention 30 jours » est la première réponse à ce risque ; le plan détaillé reste à faire valider par Master.

### 9.3 Ce qui reste à décider par Master

- Le support et l'emplacement exact des sauvegardes quotidiennes.
- La procédure de restauration testée.
- Le responsable de la vérification des sauvegardes.

Ces trois points sont marqués **« En attente de décision Master »** — ils ne sont pas inventés dans cette annexe.

---

## 10. Évolution technique

### 10.1 V1 — Solo (en cours)

- V1 solo : un seul utilisateur (Master).
- Phase 1 : Mode Urgence + « Ça s'est mal passé ».
- Puis : Hub, Inventaire, Atelier, Débrief, coffre local chiffré.
- Objectif : + Mode Duo (voir A1).
- Équipe IA en V1 : rôles et modèles décrits au § 5, orchestration minimale (script Python 200-300 lignes si besoin, voir § 4.4).

### 10.2 V2 — Deux modèles aux visions différentes

- V2 à 2 modèles aux visions différentes (Rôle A / Rôle B) — décision (voir A2).
- L'Arbiter indépendant (Muse ou modèle tiers, jamais un auteur) devient systématique en cas de désaccord.

### 10.3 Après la V1

Toute évolution au-delà de la V1 (nouveaux modèles, nouveaux outils, déploiement public, nouvelles fonctionnalités) exige une décision de Master, consignée dans A2, et une mise à jour de cette annexe.

Aucune évolution n'est planifiée ici au-delà de ce qui est écrit ci-dessus — le reste est **à décider par Master**.

---

## 11. Limites connues

### 11.1 VRAM : 8 Go — pas deux modèles 7-8B simultanément

- La RTX 4060 Ti dispose de **8 Go de VRAM**.
- Conséquence : **il n'est pas possible de charger deux modèles 7-8B simultanément.**
- Le chargement des modèles 7-8B est donc **séquentiel** : un modèle à la fois, déchargement puis chargement du suivant.
- Cette limite conditionne le workflow : Rôle A et Rôle B ne travaillent pas en parallèle en mémoire vive GPU — ils se succèdent.
- Les modèles légers (ex. Llama-3.2-3B, exécution) sont moins contraints, mais toute combinaison doit être vérifiée par la mesure, pas supposée.

### 11.2 Qwen2.5-Coder-7B — planification (hypothèse à vérifier)

- **Qwen2.5-Coder-7B est supposé faible en planification (hypothèse à vérifier en pratique).**
- C'est la raison d'être du Rôle B (DeepSeek-R1 8B) et de l'Arbiter : la planification et l'arbitrage ne reposent pas sur le seul Rôle A.
- Toute tâche de planification confiée au seul Rôle A doit être relue par le Rôle B ou arbitrée.

### 11.3 Arbiter sans signaux exécutables

- **Sans signaux exécutables, l'Arbiter interprète les tests et les mesures ; il ne tranche pas sur des opinions.**
- Un arbitrage n'a de valeur que s'il s'appuie sur une preuve vérifiable : test, mesure, sortie de commande, document validé, décision Master.
- Un désaccord sans preuve disponible n'est pas arbitrable par l'IA : il est escaladé vers Master.

### 11.4 Autres limites

- L'équipe IA locale dépend d'une seule machine allumée 24/7 (voir § 2.1 et § 9.2) — dépendance à une seule personne / une seule machine, risque identifié dans A4 (R-01).
- Les modèles locaux quantifiés ont des capacités limitées par rapport aux modèles externes — c'est un choix assumé de confidentialité, pas un défaut à contourner en envoyant des données réelles vers l'extérieur (interdit, voir § 8).
- Tailscale, Ollama, OpenWebUI, PostgreSQL et LangGraph ne sont pas encore installés au 2026-11-18 : l'architecture décrite ici est **prête pour la v1 — Version 1.0, en attente de validation par Master**, mais **pas encore déployée**. Le déploiement commence seulement après validation des documents par Master.

---

## 12. Références

| Référence | Contenu |
|---|---|
| Document 01 | Vision Produit V4 (Version 1.0) |
| Document 02 | Périmètre MVP v1.0 (Version 1.0) |
| Document 03 | Architecture de sécurité v1.0 (Version 1.0) |
| Document 04 | Registre de validation — BROUILLON PRÉPARÉ |
| Document 05 | Charte de l'Équipe IA KNuit — Version 1.0, en attente de validation par Master |
| Document 06 | Architecture de l'Équipe IA KNuit — Version 1.0, en attente de validation par Master |
| Annexe A1 | État actuel du projet |
| Annexe A2 | Registre des décisions |
| Annexe A3 | Registre des validations |
| Annexe A4 | Registre des risques |
| Annexe A5 | Architecture Technique de l'Équipe IA KNuit v1.0 (ce document) — Version 1.0, en attente de validation par Master |
| Annexe A6 | Document vivant / de référence (voir son en-tête) |
| Annexe A7 | Document vivant / de référence (voir son en-tête) |
| Gabarits | Version 1.0, en attente de validation par Master |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : références renumérotées vers la nouvelle numérotation (01 Vision, 02 Périmètre MVP, 03 Architecture de sécurité, 04 Registre) ; « proposées pour gel » retiré pour A6 et A7 — documents vivants / de référence, jamais gelés (voir leur en-tête).]
| Dossier de validation expert | Rédigé hors dépôt (voir A1) |
| Dépôt | github.com/majingod/KNuit (privé), branche `main`, tête `598f460c` au 2026-11-18 |

---

*Fin de l'annexe A5 — Architecture Technique de l'Équipe IA KNuit v1.0 — Statut : Version 1.0 (2026-11-19), en attente de validation par Master.*
