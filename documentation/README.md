# KNuit — Index général du dossier documentaire

| Champ | Valeur |
|---|---|
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (dépôt privé) |
| **Langue** | Français |
| **Date de consolidation** | 2026-11-18 |

KNuit est un outil **local-first, hors ligne, sans compte ni synchronisation**, pour **adultes consentants**.
Trajectoire : **V1 solo** → **Phase 1** (Mode Urgence, « Ça s'est mal passé ») → **Hub, Inventaire, Atelier, Débrief, coffre local chiffré** → objectif final **Mode Duo**.

---

## Documents normatifs (01-06)

| N° | Document | Statut | Fichier |
|---|---|---|---|
| 01 | Vision Produit V4 | 🧊 GELÉ | `docs/01-vision-produit-v4.md` |
| 02 | Périmètre MVP | 🧊 GELÉ | `docs/02-perimetre-mvp.md` |
| 03 | Architecture & Sécurité | 🧊 GELÉ | `docs/03-architecture-securite.md` |
| 04 | Registre de Validation | 🟡 BROUILLON PRÉPARÉ (pas gelé) | `docs/04-registre-validation.md` |
| 05 | Charte / Gouvernance | ✅ PRÊT POUR GEL | `docs/05-charte-equipe-ia.md` |
| 06 | Architecture de l'Équipe IA | ✅ PRÊT POUR GEL | `docs/06-architecture-equipe-ia.md` |

> **Mise à jour 2026-11-19 — contenu reporté depuis les .docx :** les documents 01, 02 et 03 contiennent désormais leur texte validé intégral, reporté fidèlement depuis les .docx de l'utilisateur (Vision V4 du 2026-11-16 ; Périmètre MVP v1.0 + amendement v1.1 du 2026-11-17 ; Architecture de sécurité v1.0 + amendement v1.1 du 2026-11-17). Le document 04 contient le brouillon du 2026-11-17 — **il n'est pas gelé**, son statut exact est respecté. Les ajouts Copilot (02 §9, 03 §10-12, 04 §5-7) ont été **validés par Master le 2026-11-19** (amendement n° 5) et font désormais partie du texte gelé. Voir les amendements n° 2 et n° 5 dans `annexes/A6-journal-amendements.md`.

---

## Annexes (A1-A7)

| N° | Annexe | Fichier |
|---|---|---|
| A1 | État actuel du projet | `annexes/A1-etat-actuel-projet.md` |
| A2 | Registre des décisions | `annexes/A2-decisions.md` |
| A3 | Registre des validations | `annexes/A3-validations.md` |
| A4 | Registre des risques | `annexes/A4-risques.md` |
| A5 | Architecture technique de l'équipe IA | `annexes/A5-architecture-technique-equipe-ia.md` |
| A6 | Journal des Amendements | `annexes/A6-journal-amendements.md` |
| A7 | Glossaire | `annexes/A7-glossaire.md` |

---

## Gabarits (T1-T3)

| N° | Gabarit | Usage | Fichier |
|---|---|---|---|
| T1 | Template de décision | Faire trancher une décision par Master (options en langage simple, 3 niveaux) | `templates/T1-template-decision.md` |
| T2 | Template de rapport | Livrable + rapport de convergence (preuves, désaccords A/B, décision Arbiter, attentes Master) | `templates/T2-template-rapport.md` |
| T3 | Template de validation expert | Validation humaine requise, 3 niveaux de lecture, checklist sécurité / crise / médical / juridique, signatures | `templates/T3-template-validation-expert.md` |

---

## Ordre de lecture recommandé

1. **Ce README** — vue d'ensemble et règles d'or.
2. **A7 — Glossaire** (`annexes/A7-glossaire.md`) — les termes et les rôles.
3. **01 — Vision Produit V4** — où va le produit.
4. **02 — Périmètre MVP** — ce qui est dans le périmètre, et ce qui n'y est pas.
5. **03 — Architecture & Sécurité** — contraintes non négociables.
6. **04 — Registre de Validation** — comment on valide (expert + Master, 3 niveaux de lecture).
7. **05 / 06** — charte, gouvernance et Architecture de l'Équipe IA. [Correction de cohérence 2026-11-19 — amendement n° 3 : doc 06 renommé « Architecture de l'Équipe IA ».]
8. **A6 — Journal des Amendements** — ce qui a changé, et pourquoi.
9. **T1 / T2 / T3** — gabarits à utiliser au fil du travail.

---

## Règles d'or (une page)

1. **Master tranche.** Master décide seul ; aucune IA ne décide à sa place.
2. **Muse ne tranche pas.** Muse, chef de projet, propose, recommande, synthétise, vérifie, vulgarise.
3. **Créateur ≠ critique.** A relit B, B relit A ; l'Arbiter n'est jamais un auteur.
4. **Max 3 cycles** de révision, puis escalade vers Master.
5. **Sources de vérité** (ordre) : 1. Décision Master · 2. Validation expert · 3. Documents validés · 4. Preuves vérifiables · 5. Recommandations IA, en dernier.
6. **Données interdites partout :** aucune donnée réelle dans GitHub, Codespaces, PostgreSQL équipe IA, Ollama ou modèles externes. [Correction de cohérence 2026-11-19 — amendement n° 3 : règle n° 6 précisée — PostgreSQL équipe IA, Ollama et modèles externes ajoutés aux lieux interdits.]
7. **Secrets jamais** dans Git, docs ou prompts.
8. **Sauvegardes quotidiennes**, rétention 30 jours.
9. **Aucun push sans « Pousse »** de Master.
10. **STOP documentation** : un document gelé ne se rouvre pas sans décision Master + entrée au journal A6.
11. **Aucune URL / déploiement public en V1** ; Cloudflare Pages gelé ; dépôt privé.
12. **Validation expert** obligatoire pour les contenus sensibles (sécurité, crise, médical, juridique) — 3 niveaux de lecture : 30 s / 5 min / 20 min.

---

## Prochaine étape

1. **Gel par Master** — Master valide les ajouts Copilot (02 §9, 03 §10-12, 04 §5-7), tranche les 5 écarts listés dans l'amendement n° 2 (Workbox, paires de critique IA, renvoi 02 §8, feuille de route de la Vision), gèle les documents 05 et 06 (déjà PRÊT POUR GEL) et le registre 04 une fois son statut clarifié. [Correction de cohérence 2026-11-19 — amendement n° 3 : nombre d'écarts à trancher uniformisé à 5.]
2. **Installation** — Ollama, Tailscale, OpenWebUI, PostgreSQL (+ pgvector), LangGraph, en local. [Correction de cohérence 2026-11-19 — amendement n° 3 : ordre d'installation corrigé — Ollama, Tailscale, OpenWebUI, PostgreSQL, LangGraph.]
3. **Démarrage de la V1 solo** selon le doc 06 — Architecture de l'Équipe IA. [Correction de cohérence 2026-11-19 — amendement n° 3 : doc 06 renommé « Architecture de l'Équipe IA ».]
