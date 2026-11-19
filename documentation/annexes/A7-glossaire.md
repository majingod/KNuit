# A7 — Glossaire

| Champ | Valeur |
|---|---|
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (dépôt privé) |
| **Annexe** | A7 — Glossaire |
| **Statut** | Document vivant / de référence — mis à jour par amendement |
| **Décideur** | Master |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : statut précisé — document vivant / de référence, mis à jour par amendement, jamais gelé.]

Définitions des termes utilisés dans tout le dossier documentaire KNuit. En cas de conflit entre deux définitions, c'est la **décision Master** qui tranche (source de vérité n° 1).

---

## Rôles et gouvernance

### Master
Personne humaine, **décideur unique** du projet KNuit. Seul Master tranche, valide et autorise (notamment tout push avec « Pousse »). Aucune IA ne décide à sa place.

### Rex
IA utilisée par Master via son téléphone.

### Muse (chef de projet)
IA chef de projet du dossier KNuit. Rôle : **proposer, recommander, synthétiser, vérifier, vulgariser**. Muse **ne tranche jamais** : toute décision est remontée à Master avec des options en langage simple.

### Orchestrateur
Rôle de coordination du travail des IA : répartit les tâches entre les rôles A et B, suit les cycles de révision, fait remonter les désaccords à l'Arbiter puis à Master. En V1, l'Orchestrateur est Muse.

### Rôle A (Qwen2.5-Coder 7B)
Modèle local (Qwen2.5-Coder 7B) affecté au **Rôle A** : production de code et de contenu technique. Il est **créateur** sur ses livrables et **critique** des livrables du Rôle B — jamais des siens.

### Rôle B (DeepSeek-R1 8B)
Modèle local (DeepSeek-R1 8B) affecté au **Rôle B** : production de code et de contenu technique, avec un angle de raisonnement distinct du Rôle A. Il est **créateur** sur ses livrables et **critique** des livrables du Rôle A — jamais des siens.

### Arbiter
Rôle d'arbitrage entre les Rôles A et B en cas de désaccord. L'Arbiter **n'est jamais un auteur** du livrable qu'il arbitre. Si aucun accord n'émerge après 3 cycles maximum, l'Arbiter escalade vers Master.

### Critique croisée
Méthode de relecture imposée : **A relit B, B relit A**. Chaque livrable est critiqué par le rôle qui ne l'a pas créé. Voir aussi « Créateur ≠ critique ».

### Créateur ≠ critique
Règle : **celui qui crée un livrable ne peut pas être celui qui le critique ni celui qui l'arbitre**. A relit B, B relit A, l'Arbiter n'est jamais un auteur.

### Validation expert
Validation par un **expert humain** (en plus de Master), selon le format du document 04 : 3 niveaux de lecture (30 s / 5 min / 20 min). Obligatoire pour les contenus sensibles : sécurité, contenu de crise, médical, juridique. Gabarit : `../templates/T3-template-validation-expert.md`.

### Validation pré-commercialisation
Validation experte unique et globale, avant toute commercialisation ou diffusion publique (amendement n° 9). Pendant le développement, aucune validation experte n'est demandée au fur et à mesure.

---

## Règles et notions de référence

### Source de vérité
Référence qui fait foi en cas de doute ou de conflit. Ordre en vigueur : **1. Décision Master · 2. Validation experte (avant commercialisation) · 3. Documents validés · 4. Preuves vérifiables · 5. Recommandations IA, en dernier.**

### Preuve vérifiable
Élément concret et contrôlable qui établit qu'un travail a bien été fait : résultat de test, hash, log de build, capture, sortie d'exécution. Une affirmation sans preuve n'est pas une preuve. Toute livraison s'accompagne de ses preuves (voir gabarit T2).

### Gel
Gel — notion abandonnée le 2026-11-19 (amendement n° 8) : aucun document n'est gelé. Voir « Document vivant ».

### Document vivant
Document modifiable à tout moment par décision de Master, tracée au journal A6.

---

## Produit KNuit

### KNuit
Application **Kink de Nuit** : outil local-first, hors ligne, sans compte ni synchronisation, pour adultes consentants. Dépôt privé : github.com/majingod/KNuit.

### Mode Urgence
Fonctionnalité de la Phase 1 : premiers secours hors ligne, accessibles en un tap sans PIN, contenu statique hors coffre, jamais bloqués par le Quick Exit. [Correction de cohérence 2026-11-19 — amendement n° 3 : entrée Mode Urgence précisée — premiers secours hors ligne, accessibles en un tap sans PIN, contenu statique hors coffre, jamais bloqués par le Quick Exit.]

### « Ça s'est mal passé »
Fonctionnalité de la Phase 1 : accompagnement après une expérience qui s'est mal déroulée (débrief d'urgence, ressources, soutien).

### Hub
Espace encyclopédique "Je découvre" : fiches, glossaire, inventaire. [Correction de cohérence 2026-11-19 — amendement n° 3 : entrée Hub corrigée — espace encyclopédique « Je découvre » : fiches, glossaire, inventaire.]

### Inventaire
Module (après la Phase 1) : inventaire personnel des pratiques, limites et préférences.

### Atelier
Module (après la Phase 1) : préparation et construction de scénarios / séances.

### Débrief
Module (après la Phase 1) : retour structuré après une séance.

### Coffre local chiffré
Stockage local chiffré des données sensibles de l'utilisateur, sur son appareil uniquement. Aucune donnée réelle ne quitte l'appareil (ni GitHub, ni Codespaces, ni IA externes).

### Mode Duo
Objectif final du produit : mode à deux partenaires, après la V1 solo et les modules Hub, Inventaire, Atelier, Débrief et coffre local chiffré.

---

## Technique

### LangGraph
Framework d'orchestration d'agents IA (graphes d'étapes) utilisé pour coordonner les rôles A, B et l'Arbiter dans le projet KNuit — à installer après validation des documents, seulement sur décision de Master ; en V1, orchestration minimale, script Python 200-300 lignes si besoin. [Correction de cohérence 2026-11-19 — amendement n° 3 : entrée LangGraph précisée — à installer après validation des documents, orchestration minimale en V1.]

### Ollama
Outil local qui fait tourner les modèles IA (Qwen2.5-Coder 7B, DeepSeek-R1 8B) **sur la machine de l'utilisateur**, sans envoi de données vers un service externe.

### OpenWebUI
Interface web locale pour interagir avec les modèles Ollama, accessible uniquement en local (via Tailscale le cas échéant).

### Tailscale
Réseau privé virtuel (VPN maillé) permettant un accès sécurisé aux services locaux (ex. OpenWebUI) sans exposition publique sur Internet. Aucune URL publique en V1.

### PostgreSQL
Base de données locale PostgreSQL, mémoire documentaire du projet (documentation, décisions, validations, historique — sans données réelles). La recherche vectorielle (RAG) n'est pas retenue en V1. Les données restent en local.

### PWA
*Progressive Web App* : application web installable, utilisable hors ligne — format envisagé pour KNuit en local-first.
