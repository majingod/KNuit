# Registre de validation — Kink de Nuit

| Champ | Valeur |
|---|---|
| **Titre** | Registre de validation — Kink de Nuit |
| **Date de préparation** | 2026-11-16 |
| **Mise à jour** | 2026-11-17 |
| **Statut** | **BROUILLON PRÉPARÉ (2026-11-17) — liste de validation pré-commercialisation** |
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (privé) |

> **Statut du fichier : Brouillon préparé. Amendement v1.1 appliqué aux documents 01 et 02 le 2026-11-17 après validation de Master ; la validation humaine par un expert est prévue avant commercialisation, pour chaque élément (amendement n° 9).**

> **Expert humain désigné le 2026-11-19 (décision D-17) : John Smith, expert en pratique sexuelle** — domaine : pratique sexuelle / contenu éducatif, désigné pour valider ce domaine avant commercialisation. Aucune validation au fur et à mesure pendant le développement. Les autres domaines restent « À nommer » dans les tableaux ci-dessous (sécurité / cryptographie, juridique, médical, psy / crise) : ils attendent un expert de leur domaine. Les tableaux historiques ne sont pas réécrits ; cette désignation s'applique à partir du 2026-11-19 pour les éléments de son domaine.

> **Note de provenance :** le fichier .docx source porte l'ancienne numérotation (« Document 03 », chemin `docs/03-registre-validation.md`). Dans la numérotation consolidée du 2026-11-18, ce registre devient le **document 04**. Son contenu est transcrit fidèlement ci-dessous (Partie A) ; les sections 5 à 7 sont des ajouts Copilot (Partie B).

---

# PARTIE A — Texte du .docx (transcription fidèle)

## Introduction

Ce fichier ne modifie pas les documents v1.0 validés (01-perimetre-mvp-option-a.md et 02-architecture-securite-option-a.md).

> **Note de lecture :** dans la numérotation consolidée du 2026-11-18, les « documents 01 et 02 » cités ici sont les documents 02 et 03.

Il prépare seulement le registre demandé : toute fonction touchant à la sécurité, au médical, au juridique, au psychologique ou à la crise entre au registre au statut « À valider » jusqu'à relecture humaine.

**Règle : rien n'est marqué « prêt » tant que le statut n'est pas « Validé ». La validation experte est une étape unique avant commercialisation (amendement n° 9) ; pendant le développement, les éléments sont « En cours » ou « À valider avant commercialisation ». La critique par une 2e IA ne remplace jamais la validation humaine.**

**Statuts possibles : À valider / Validé / À corriger / Refusé.**

**Critique IA : créateur ≠ critique — paires finales (décision de Master le 2026-11-19, D-18) : Rôle A (Qwen2.5-Coder 7B) ↔ Rôle B (DeepSeek-R1 8B) — A relit B et B relit A ; Arbiter = Muse ou modèle tiers indépendant, jamais un auteur. L'ancienne mention du brouillon du 2026-11-17 (« Muse crée → DeepSeek critique ; DeepSeek crée → Claude critique ») est remplacée : le système de critique croisée validé le 2026-11-16 prévoyait Claude comme critique via copier-coller avec des données fictives ; la décision D-18 adopte des paires locales Qwen ↔ DeepSeek pour l'équipe permanente. La critique externe par copier-coller avec des données fictives reste possible ponctuellement. Muse, chef de projet, ne produit pas les livrables de routine de l'équipe ; ses livrables antérieurs (charte, dossier expert, consolidation) restent valides. L'ancienne mention est citée ici à titre d'historique ; les tableaux ci-dessous conservent l'état du brouillon du 2026-11-17.**

---

## 1. Amendement v1.1 (appliqué le 2026-11-17 après validation de Master)

| Élément | Domaine | Critique IA | Expert humain | Date | Statut | Version |
|---|---|---|---|---|---|---|
| A. Privé = aucune URL publique, Codespaces privé puis accès contrôlé à vérifier | Sécurité / Confidentialité | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| B. PBKDF2-SHA256 600 000 itérations en v1, Argon2id reporté V1.1 | Sécurité / Cryptographie | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| C. Clé AES-GCM non extractable, référence supprimée au verrouillage, pas de promesse d'effacement mémoire | Sécurité / Cryptographie | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| D. Verrouillage sur inactivité + visibilitychange + pagehide | Sécurité | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| E. Import sauvegarde : validation stricte schéma et version, rejet des invalides, aucun innerHTML | Sécurité | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| F. Interface Preact pour l'accessibilité | Accessibilité | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| G. Cloudflare Pages — gelé jusqu'à validation d'architecture écrite, à vérifier, non acquis | Sécurité / Déploiement | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| H. Service worker : précache uniquement contenu public neutre, jamais données du coffre | Sécurité / Confidentialité | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |
| I. Nom public neutre — à définir avant manifest ou dépôt | Confidentialité | Claude + DeepSeek — reçues 2026-11-17, tri validé, appliqué 2026-11-17 | À nommer | — | À valider | v1.1 appliquée 2026-11-17 |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : ligne G précisée — Cloudflare Pages gelé jusqu'à validation d'architecture écrite, à vérifier, non acquis.]

---

## 2. Phase 0 (plan proposé, lancé le 2026-11-17 — 0.1 faite, 0.2 en cours)

| Élément | Domaine | Critique IA | Expert humain | Date | Statut | Version |
|---|---|---|---|---|---|---|
| 0.1 Dépôt privé neutre | Confidentialité | Claude + DeepSeek — reçues 2026-11-17, tri validé | À nommer | — | À valider | Fait le 2026-11-17 — dépôt privé KNuit (https://github.com/majingod/KNuit), vide, confirmé par Master ; validation experte du plan Phase 0 toujours à faire (état au 2026-11-17 ; état actuel : voir A1 et A5 §2.3-2.5) |
| 0.2 Squelette Vite + Preact + TypeScript | Sécurité / Code | Claude + DeepSeek — reçues 2026-11-17, tri validé | À nommer | — | À valider | Phase 0 proposée |
| 0.3 Configuration Codespaces (port 5173 en forwarding privé) | Sécurité | Claude + DeepSeek — reçues 2026-11-17, tri validé | À nommer | — | À valider | Phase 0 proposée |
| 0.4 ESLint interdisant innerHTML | Sécurité / Code | Claude + DeepSeek — reçues 2026-11-17, tri validé | À nommer | — | À valider | Phase 0 proposée |
| 0.5 CSP stricte | Sécurité | Claude + DeepSeek — reçues 2026-11-17, tri validé | À nommer | — | À valider | Phase 0 proposée |
| 0.6 PWA vide hors-ligne, service worker écrit à la main, sans Workbox (précache neutre uniquement) | Sécurité | Claude + DeepSeek — reçues 2026-11-17, tri validé | À nommer | — | À valider | Phase 0 proposée |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : ligne 0.6 — Workbox retiré ; service worker écrit à la main, sans Workbox.]

---

## 3. Fonctions sensibles de l'ordre de livraison proposé

| Élément | Domaine | Expert humain | Date | Statut | Version |
|---|---|---|---|---|---|
| Mode Urgence hors-ligne, sans PIN, sans données personnelles | Sécurité / Crise | À nommer | — | À valider | v1.0 |
| Ça s'est mal passé : parcours court, « ne rien enregistrer » par défaut, ressources et route de crise | Psy / Crise / Juridique | À nommer | — | À valider | v1.0 |
| Message de vie / fiche contact de confiance, libellé neutre | Sécurité / Crise | À nommer | — | À valider | v1.0 |
| Guides de prévention solo, avertissement fort pour les pratiques à ne jamais faire seul | Sécurité / Médical | À nommer | — | À valider | v1.0 |
| Coffre local chiffré (PBKDF2, AES-GCM 256, IndexedDB) | Sécurité / Cryptographie | À nommer | — | À valider | v1.0 |

---

## 4. Grille de tri — utilisée pour les critiques Claude + DeepSeek reçues le 2026-11-17

Pour chaque problème remonté par DeepSeek, noter :

1. Problème (en une ligne) / Gravité (Haute, Moyenne, Basse).
2. Point touché : A, B, C, D, E, F, G, H, I, ou tâche Phase 0 (0.1 à 6) ?
3. Décision de Master : accepter / modifier / rejeter — Master tranche, Muse synthétise.
4. Correction à appliquer dans l'amendement ou le plan — sans ajouter de fonction hors liste.
5. Vérifier qu'aucune correction ne promet une sécurité absolue et qu'aucune donnée réelle n'est impliquée.

Critère de réussite de la critique : Claude et DeepSeek ont listé des problèmes concrets avec gravité, sans ajouter de fonction ni promettre une sécurité absolue.

Après le tri : les corrections acceptées ont été appliquées à l'amendement v1.1 le 2026-11-17, après validation de Master. Reste la validation finale du plan Phase 0 avant tout code, puis la validation humaine par un expert.

---

# PARTIE B — Ajouts Copilot (consolidation du 2026-11-18)

> ✅ **Sections 5 à 7 VALIDÉES PAR MASTER le 2026-11-19** : sections ajoutées lors de la consolidation du 2026-11-18, rédigées d'après les principes du dossier ; validées par Master telles que rédigées, elles font désormais partie du registre.

[Correction de cohérence 2026-11-19 — amendement n° 3 : « principes gelés » remplacé par « principes proposés pour gel » — les docs 05/06/A5 ne sont pas gelés.]

## 5. Définition de prêt

Un élément du registre passe du statut « À valider » au statut « Validé » uniquement quand **toutes** les conditions ci-dessous sont remplies. Il suffit d'une seule condition manquante pour qu'il ne soit pas prêt — conformément à la règle de l'introduction : rien n'est marqué « prêt » tant que le statut n'est pas « Validé » (validation experte pré-commercialisation + Master).

### 5.1 Conditions générales

- [ ] L'élément correspond au périmètre demandé par Master — ni plus, ni moins.
- [ ] Il a suivi le circuit complet : production, critique croisée (créateur ≠ critique), arbitrage, convergence — maximum 3 cycles de révision, puis escalade obligatoire vers Master.
- [ ] Les preuves minimales sont fournies et vérifiées indépendamment par Muse (voir § 5.2).
- [ ] Aucun désaccord fondé sur une preuve ne reste sans réponse.
- [ ] Il ne contient aucune donnée interdite (données réelles, données de pratique réelles, informations personnelles, données médicales réelles, contenu du coffre) ni aucun secret.
- [ ] Il est présenté à Master en langage simple, à trois niveaux de lecture : **30 secondes** (l'essentiel), **5 minutes** (les points clés), **20 minutes** (le détail complet).
- [ ] Aucune décision n'est présentée sous forme technique : les décisions sont formulées en langage clair, avec leurs conséquences concrètes.

### 5.2 Preuves minimales acceptables

Selon la nature de l'élément, au moins les preuves pertinentes parmi :

| Preuve | Ce qu'elle établit |
|---|---|
| **Tests** | Le code fait ce qu'il prétend faire (tests unitaires, tests d'intégration, résultats affichés). |
| **Hashes** | Un fichier est bien celui qu'on prétend (SHA-256, vérifié indépendamment par Muse). |
| **Diff Git** | Ce qui a changé, ligne par ligne, entre deux versions. |
| **Build** | Le projet compile et se construit sans erreur (sortie du build fournie). |
| **Lint** | Le code respecte les règles de qualité configurées (sortie du linter fournie). |
| **Type-check** | Le typage TypeScript est valide (sortie du type-check fournie). |
| **Rapport de sécurité** | Les vérifications de sécurité prévues ont été exécutées et leurs résultats sont joints. |

Hiérarchie des preuves : **Code → Tests → Mesures → Décision IA**. Une décision IA qui n'est étayée ni par du code, ni par des tests, ni par des mesures est une opinion — elle est présentée comme telle. Une IA ne gagne jamais un débat parce qu'elle argumente mieux : les preuves priment toujours sur les opinions.

### 5.3 Validation humaine requise

- **Validation par un expert humain** (sécurité, droit, santé, selon le domaine de l'élément) **et par Master**, avant commercialisation : la critique par une 2e IA ne remplace jamais la validation humaine.
- L'expert humain est nommé dans le registre (colonne « Expert humain ») ; aucun élément ne peut passer au statut « Validé » avant la validation experte pré-commercialisation ; pendant le développement, les éléments sont « En cours » ou « À valider avant commercialisation ».
- La validation est consignée avec sa date ; une validation sans date est une validation perdue.
- Si la validation aboutit à « À corriger » ou « Refusé », le motif est consigné et l'élément retourne au circuit de convergence.

### 5.4 Ce que « prêt » ne signifie pas

« Prêt » ne signifie pas « approuvé » ni « déployé » ni « poussé ». Un élément prêt est **présenté à Master pour validation**. Seul Master l'approuve. Seul le mot explicite « Pousse » autorise un push vers GitHub.

### 5.5 Conditions spécifiques au code

- [ ] Le build réussit sans erreur.
- [ ] Le type-check TypeScript réussit.
- [ ] Le lint réussit (ou les écarts sont justifiés et consignés).
- [ ] Les tests prévus passent ; les résultats sont joints.
- [ ] Le diff Git a été relu par Muse.
- [ ] Aucun secret, aucune donnée réelle, aucune information personnelle dans le code ni dans les commentaires.

### 5.6 Conditions spécifiques aux documents

- [ ] Le document est complet : aucune section « à compléter », sauf pour les points explicitement réservés à une décision de Master, qui sont alors listés nommément.
- [ ] Il ne contredit aucun document validé (ou la contradiction est signalée et escaladée vers Master).
- [ ] Sa version et sa date sont à jour.

---

## 6. Gestion des secrets

### 6.1 La règle

**Aucun secret n'apparaît jamais dans Git, dans GitHub, dans la documentation, ni dans les prompts.**

Sont des secrets, notamment : mots de passe, clés API, tokens, clés de chiffrement, phrases de récupération, identifiants de connexion, certificats privés.

### 6.2 Où vivent les secrets

Les secrets vivent uniquement dans l'un de ces deux endroits :

1. **Les variables d'environnement** de l'environnement d'exécution concerné ;
2. **Un gestionnaire de secrets approuvé par Master.**

Nulle part ailleurs. Jamais dans un fichier du dépôt, jamais dans un message, jamais dans un prompt adressé à un modèle.

> **À désigner par Master :** le gestionnaire de secrets approuvé n'est pas encore nommé. Tant qu'il ne l'est pas, seuls les variables d'environnement sont autorisées.

### 6.3 Règles opérationnelles

- Un agent qui reçoit un secret par erreur **ne le répète pas, ne le consigne pas, ne le transmet pas** : il signale l'incident à Muse, qui le signale à Master et organise la révocation et le remplacement du secret exposé.
- Les exemples de configuration (fichiers `.env.example`, documentation) utilisent des valeurs manifestement fausses (`VOTRE_CLE_ICI`, `xxx`) et jamais de vraies valeurs.
- Les journaux, rapports et captures produits par l'équipe IA sont relus avant diffusion pour s'assurer qu'ils ne contiennent pas de secret.
- La rotation des secrets (changement régulier) est décidée par Master ; l'équipe IA ne la déclenche jamais seule.
- Avant chaque push et avant chaque présentation de livrable, Muse vérifie que le contenu ne comporte aucun secret ; cette vérification fait partie de la définition de prêt (§ 5).

### 6.4 Clés de chiffrement du coffre

Le chiffrement du coffre local de l'application relève de l'application elle-même, sur l'appareil de l'utilisateur. L'équipe IA ne manipule jamais les clés de chiffrement du coffre, ne les demande jamais et ne les stocke jamais. Toute question sur ces clés est escaladée vers Master (sécurité — escalade obligatoire).

### 6.5 Lien avec le registre

Tout incident d'exposition d'un secret est consigné dans ce registre comme un élément à valider, avec son domaine (Sécurité), son expert humain (À nommer tant que l'expert sécurité n'est pas désigné), sa date et son statut — « À valider avant commercialisation » jusqu'à relecture humaine, jamais « Validé » sur la seule foi d'une vérification par IA.

---

## 7. Continuité

### 7.1 Le projet ne dépend d'aucun modèle

Le projet KNuit ne dépend d'**aucun modèle d'IA en particulier**. Si Qwen2.5-Coder 7B, DeepSeek-R1 8B ou Muse devenaient indisponibles, le projet continue : un autre modèle prend le rôle, selon la même charte, les mêmes règles et les mêmes preuves.

Ce qui fait la continuité du projet, ce n'est pas un modèle : c'est **GitHub et les documents validés**.

### 7.2 Sources de continuité

- **GitHub (dépôt privé github.com/majingod/KNuit)** : le code, son historique complet, ses branches. L'historique Git est la mémoire factuelle du code : chaque changement est daté, attribué et diffusable.
- **Documents de référence** : la charte (05) et l'architecture de l'équipe IA (06), en version 1.0, en attente de validation par Master, l'architecture technique (A5) et les décisions consignées de Master. Un document est « validé » quand Master l'a approuvé explicitement. Les brouillons ne font pas foi.
- **Sauvegardes quotidiennes** : rétention 30 jours. Une sauvegarde non testée est une sauvegarde qui n'existe pas : la procédure de restauration est testée au moins à chaque changement de phase, et le test réussi est consigné avec sa date et son résultat.
- **Mémoire du projet** : l'historique des décisions et de leur contexte (décisions de Master avec leur date, options écartées, preuves associées, incidents et escalades, points en attente).

La mémoire ne vit **jamais uniquement** dans la tête d'un agent ou dans un contexte de conversation : un contexte se perd, un document validé reste.

### 7.3 Reprise par un nouvel agent

Un nouvel agent qui rejoint l'équipe doit, avant de produire quoi que ce soit :

1. Lire la charte (05) et l'architecture de l'équipe IA (06).
2. Lire les documents validés en vigueur, dont le présent registre.
3. Confirmer qu'il a compris les règles — et poser ses questions à Muse avant de commencer.

Un agent qui n'a pas lu la charte ne travaille pas.

### 7.4 Absence de Master

Si Master est indisponible, l'équipe IA ne prend **aucune décision** à sa place. Elle peut préparer des dossiers, avancer des travaux déjà approuvés dans leur périmètre approuvé, et documenter l'état d'avancement — mais elle ne tranche rien, n'étend aucun périmètre et ne pousse rien.

### 7.5 Perte d'un composant

| Composant perdu | Reprise |
|---|---|
| Un modèle local (Rôle A ou B) | Remplacement par un autre modèle dans le même rôle ; signalement à Master |
| Muse | Reprise par un autre agent chef de projet, avec relecture complète de la charte et de la mémoire ; signalement à Master |
| Orchestrateur | Muse reprend la coordination directement jusqu'à la mise en place d'un remplaçant |
| Machine Desktop | Restauration depuis les sauvegardes ; vérification complète avant reprise |
| Dépôt GitHub | Restauration depuis une copie locale et les sauvegardes ; signalement immédiat à Master |
| Base PostgreSQL équipe IA | Restauration depuis la sauvegarde quotidienne la plus récente |

Dans tous les cas, la reprise est vérifiée (preuves, hashes, tests) avant que le travail normal reprenne, et Master est informé.

### 7.6 Lien avec le registre

Le présent registre fait partie des sources de continuité du projet : il est sauvegardé quotidiennement avec les documents validés (rétention 30 jours), et toute modification de son statut ou de ses sections suit la procédure de révision — proposition motivée, examen par Muse, validation explicite de Master. Aucun agent ne modifie ce registre de sa propre initiative.

---

## Écarts — état au 2026-11-19

| # | Écart | Ce que dit le .docx (Partie A) | Ce que dit l'équipe finale | Décision attendue |
|---|---|---|---|---|
| 1 | Paires de critique IA | « Critique IA : créateur ≠ critique (Muse crée → DeepSeek critique ; DeepSeek crée → Claude critique) » | Rôle A = Qwen2.5-Coder 7B, Rôle B = DeepSeek-R1 8B, Arbiter = Muse ou modèle tiers indépendant (jamais un auteur) ; A relit B, B relit A | ✅ Décision prise par Master le 2026-11-19 (D-18, amendement n° 6) : paires finales adoptées — Rôle A ↔ Rôle B, Arbiter Muse ou tiers indépendant. Mention « Critique IA » mise à jour en tête du registre ; les tableaux de la Partie A ne sont pas réécrits (historique du 2026-11-17 conservé). |

---

*Fin du Registre de validation — Kink de Nuit — Brouillon préparé le 2026-11-16, mis à jour le 2026-11-17, sections 5 à 7 ajoutées (Copilot, consolidation du 2026-11-18, validées par Master le 2026-11-19), paires de critique finales adoptées le 2026-11-19 (D-18).*
