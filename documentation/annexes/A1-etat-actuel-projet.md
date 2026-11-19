# Annexe A1 — État actuel du projet KNuit

**Version :** v1.0
**Date :** 2026-11-18
**Décideur :** Master
**Projet :** KNuit — application Kink de Nuit
**Dépôt :** dépôt privé github.com/majingod/KNuit

> **Règle en vigueur :**
> Master décide seul. Muse, chef de projet, propose, recommande, synthétise, vérifie et vulgarise — il ne tranche jamais. Le créateur n'est jamais le critique. Maximum 3 cycles, puis escalade.
>
> « Une IA ne gagne jamais un débat parce qu'elle argumente mieux. Les preuves priment toujours sur les opinions. »

Cette annexe est la photographie vérifiée du projet à la date indiquée. Elle ne contient que des faits vérifiés (voir les sources en § 7). Tout ce qui attend une décision de Master est marqué comme tel.

---

## 1. Le projet en une phrase

KNuit est une application PWA solo, en V1, dont la Phase 1 couvre le Mode Urgence et « Ça s'est mal passé », puis le Hub, l'Inventaire, l'Atelier, le Débrief et un coffre local chiffré, avec pour objectif le Mode Duo.

## 2. Faits vérifiés — application

### 2.1 Stack

| Élément | Version vérifiée |
|---|---|
| Bundler / build | Vite 8.3.8 |
| Framework UI | Preact 11.2.0 |
| Langage | TypeScript 7.0.2 |
| Type d'application | PWA |
| Service worker | Écrit à la main, sans Workbox |
| Point d'entrée | `src/app.tsx` |

Structure des sources (vérifiée) :

```
src/
  app.tsx
  urgence/
  about/
  legal/
  layout/
public/
  sw.js
tests/
  e2e/            # 14 specs Playwright
scripts/
  check-content-status.mjs
```

### 2.2 Dépôt

| Élément | Valeur vérifiée |
|---|---|
| Dépôt | github.com/majingod/KNuit |
| Visibilité | Privé |
| Branche principale | `main` |
| Tête de branche vérifiée | `598f460c` |
| Déploiement public en V1 | Non — gelé |
| Cloudflare Pages | Gelé en V1 |

Règle en vigueur : **aucun push sans le mot « Pousse » de Master.**

### 2.3 Suite de vérification

- **Suite vérifiée : 39/39.**
- Tests end-to-end : 14 specs Playwright (`tests/e2e`).
- Script de contrôle : `scripts/check-content-status.mjs`.

Aucun autre résultat de test n'est affirmé dans cette annexe.

## 3. Faits vérifiés — périmètre V1

### 3.1 V1 solo

La V1 est **solo** : un seul utilisateur (Master).

### 3.2 Phase 1

La Phase 1 couvre :

- **Mode Urgence**
- **« Ça s'est mal passé »**

### 3.3 Ensuite (V1)

Après la Phase 1, dans la V1 :

- Hub
- Inventaire
- Atelier
- Débrief
- Coffre local chiffré

### 3.4 Objectif

- **Objectif : + Mode Duo** (après la V1 solo).

Le Mode Duo n'est pas dans la V1 solo. Sa planification relève d'une décision ultérieure de Master.

## 4. Statut des documents

### 4.1 Documents 01 à 03 — Version 1.0 ; document 04 — brouillon préparé

> [Correction de cohérence 2026-11-19 — amendement n° 3 : renumérotation des documents (01 Vision Produit V4, 02 Périmètre MVP v1.0, 03 Architecture de sécurité v1.0, 04 Registre de validation) ; le document 04 est un BROUILLON PRÉPARÉ, pas un document gelé.]

| Document | Statut au 2026-11-18 |
|---|---|
| 01 — Vision Produit V4 | Version 1.0 |
| 02 — Périmètre MVP v1.0 | Version 1.0 |
| 03 — Architecture de sécurité v1.0 | Version 1.0 |
| 04 — Registre de validation | BROUILLON PRÉPARÉ |

### 4.2 Documents 05 et 06 — Version 1.0, en attente de validation par Master

| Document | Statut au 2026-11-18 |
|---|---|
| 05 — Charte de l'Équipe IA | Version 1.0, en attente de validation par Master |
| 06 — Architecture de l'Équipe IA | Version 1.0, en attente de validation par Master |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : titres des documents 05 (Charte de l'Équipe IA) et 06 (Architecture de l'Équipe IA) ajoutés.]

### 4.3 Annexe A5 et gabarits — Version 1.0, en attente de validation par Master ; A6 et A7 — documents vivants

| Document | Statut au 2026-11-18 |
|---|---|
| A5 — Architecture Technique de l'Équipe IA | Version 1.0, en attente de validation par Master |
| A6 — Journal des amendements | Document vivant / de référence |
| A7 — Glossaire | Document vivant / de référence |
| Gabarits | Version 1.0, en attente de validation par Master |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : A6 (Journal des amendements) et A7 (Glossaire) sont des documents vivants / de référence, jamais proposés pour gel.]

### 4.4 Dossier de validation expert

Un **dossier de validation expert a été rédigé hors dépôt**. Il existe, il est distinct du dépôt GitHub, et son contenu détaillé n'est pas repris dans cette annexe — il est référencé ici comme preuve d'existence, sans invention de son contenu.

### 4.5 STOP documentation

**STOP documentation** : pas de nouveau document de cadrage sans décision explicite de Master. (A6 et A7 sont des documents vivants, mis à jour par amendement — voir § 4.3.)

## 5. Équipe IA — état au 2026-11-18

L'architecture complète est décrite dans l'annexe A5. Résumé de l'état :

- Machine hôte : Intel i7-13700F, 32 Go de RAM DDR5, GPU RTX 4060 Ti 8 Go, ~2 To libres, Windows 11, desktop allumé 24/7 — héberge l'équipe IA, pas l'application.
- Modèles prévus : planification/arbitrage Qwen2.5-Coder-7B ou DeepSeek-Coder-V2-Lite quantifiés ; exécution Llama-3.2-3B ; Rôle A = Qwen2.5-Coder 7B ; Rôle B = DeepSeek-R1 8B ; Arbiter = Muse ou modèle tiers indépendant (jamais un auteur).
- Outils : Ollama, Tailscale, OpenWebUI, PostgreSQL, LangGraph (seulement sur décision Master, au-delà de la V1).
- **Statut : rien de tout cela n'est encore installé au 2026-11-18.** L'installation commence seulement après validation des documents par Master (voir § 6).

Règles en vigueur applicables à l'équipe IA :

- Créateur ≠ critique.
- Max 3 cycles, puis escalade vers Master.
- V2 à 2 modèles aux visions différentes.
- Données interdites partout : données réelles, personnelles, médicales, contenu du coffre — dans GitHub, Codespaces, PostgreSQL, Ollama et modèles externes.
- Secrets jamais dans Git, dans les docs, ni dans les prompts.
- Sauvegardes quotidiennes, rétention 30 jours.
- PostgreSQL = mémoire du projet **sans données réelles**.

## 6. Prochaine étape

**La prochaine étape est l'installation, seulement APRÈS la validation des documents par Master, dans cet ordre :**

1. **Ollama**
2. **Tailscale** — obligatoire pour l'accès distant
3. **OpenWebUI** — accessible via IP Tailscale, PAS limité à `127.0.0.1` (sinon la tablette est bloquée) ; vérifier qu'OpenWebUI écoute bien sur l'IP Tailscale avant de passer à la suite
4. **PostgreSQL** (mémoire du projet, sans données réelles)
5. **LangGraph** — orchestration, seulement sur décision Master, au-delà de la V1 (script Python 200-300 lignes en V1 si besoin)

> [Correction de cohérence 2026-11-19 — amendement n° 3 : ordre d'installation corrigé — Tailscale avant OpenWebUI, avec vérification de l'écoute sur l'IP Tailscale.]

Conditions avant de commencer :

- Les documents 05, 06, A5 et les gabarits doivent être validés par Master avant de commencer (A6 et A7 sont des documents vivants, mis à jour par amendement).

[Correction de cohérence 2026-11-19 — amendement n° 3 : condition reformulée au futur — 05, 06 et A5 ne sont pas encore gelés, ils doivent l'être par Master avant l'installation.]
- Chaque installation est vérifiée par une preuve (sortie de commande, test d'accès) avant de passer à la suivante.
- Toute difficulté d'installation est signalée à Master — pas de contournement silencieux.

Ce qui n'est PAS la prochaine étape :

- Aucun nouveau document de cadrage (STOP documentation).
- Aucun déploiement public (gelé en V1).
- Aucune installation avant validation.

## 7. Sources et limites de cette annexe

Sources de cette annexe, dans l'ordre des sources de vérité :

1. Décisions de Master (voir A2).
2. Validations par Master (voir A3) ; validation experte prévue avant commercialisation (voir doc 04).
3. Documents validés 01 à 03 ; document 04 (Registre de validation) au statut BROUILLON PRÉPARÉ.
4. Preuves vérifiables : stack, dépôt, tête de branche `598f460c`, suite 39/39, structure des sources.
5. Recommandations IA — en dernier, et marquées comme telles quand elles apparaissent.

Limites :

- Cette annexe ne contient aucun fait produit inventé : pas de fausses dates, pas de faux résultats de tests au-delà de ceux donnés ci-dessus.
- Les dates autres que 2026-11-18 ne sont affirmées que si elles figurent dans les documents validés ou dans A2/A3.
- Si un fait de cette annexe s'avère inexact, il est corrigé par une décision de Master, consignée dans A2, et cette annexe est mise à jour en conséquence.

---

## 8. Dette technique, hébergement et questions ouvertes (réintégrés depuis la consolidation du 2026-11-18)

### 8.1 Dette technique connue

- `ignoreVary: true` sur les navigations : dette distincte, déclencheur = première navigation dépendant d'un cookie ou d'un en-tête.
- `prod-headers.spec.ts` valide le vérificateur, pas la production réelle.
- `startsWith('/api/')` sensible à la casse.
- `typescript-eslint` exclu (incompatible TypeScript 7.0.2, réévaluer à TS 7.1).
- Garde `tel:` : une construction dynamique (`'tel:' + x`) échappe au lint ESLint et au test built output ; la CSP ne bloque pas `tel:`.
- Image Codespaces `typescript-node:24-bookworm` jamais testée dans un vrai Codespace.
- `esModuleInterop` / `allowSyntheticDefaultImports` non vérifiés dans `tsconfig.app.json`.
- ESLint : les scripts héritent de `document`/`window` via le bloc « Hors src/ » (noté, pas un problème).
- Périmètre du scan « sources » (`no-tel.spec.ts`) : `src/` (`.tsx`/`.css`) + `index.html` à la racine seulement ; un `.css` dans `tests/` avec un numéro légitime ne serait pas scanné.
- `/urgence` sans sortie visible en PWA installée (déclencheur : quand l'app pourra être partagée).
- `validUntil` : à décider à la première validation de contenu.
- Re-mesure de E si les helpers sont unifiés (déclencheur).
- Message d'échec H2 auto-documentant (déclencheur : deuxième bloc de sécurité ajouté).
- `key={index}` (note pour le contenu réel) ; types locaux `Etape`/`ContenuUrgence` à extraire plus tard.
- `role="alert"` / `aria-live` sur le bandeau critique, à ajouter avec le contenu réel (ligne README à vérifier au push du contenu réel).

### 8.2 Comparaison d'hébergement (résumé — recherche du 2026-11-18)

- **Cloudflare Pages + Access (recommandée, 0 $/mois)** : hébergement statique + contrôle d'accès (Zero Trust Free, 50 utilisateurs, PIN e-mail). Seule option à 0 $ remplissant toutes les exigences, accès privé compris.
- **Netlify Pro (20 $/mois)** : accès privé = Pro ; modèle à crédits (300/mois, arrêt brutal si épuisés).
- **Vercel Pro (40 $/mois)** : protection par mot de passe = Pro (20 $) + add-on (20 $) ; Hobby limité à l'usage personnel/non commercial.
- **Décision non prise.** Item G : « Cloudflare Pages avec contrôle d'accès — à vérifier, non acquis », validation d'architecture écrite requise avant dégel. Sans attendre l'expert, l'option honnête pour tester est l'URL privée Codespaces (chemin A).

### 8.3 Questions ouvertes

- **Durée de validité de la validation experte** : la proposition de 12 mois est remplacée par la décision de l'amendement n° 9 — une seule validation experte globale, avant toute commercialisation ou diffusion publique.
- **validUntil** : à décider à la première validation de contenu.
- **Image Codespaces non testée** : l'image `typescript-node:24-bookworm` n'a jamais été testée dans un vrai Codespace (réserve 0.3).

---

*Fin de l'annexe A1 — État actuel du projet KNuit — 2026-11-18.*
