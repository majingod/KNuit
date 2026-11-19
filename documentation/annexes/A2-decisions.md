# Annexe A2 — Registre des décisions KNuit

**Version :** v1.0
**Date :** 2026-11-18
**Décideur :** Master (toutes les décisions ci-dessous, sauf mention contraire)
**Projet :** KNuit — application Kink de Nuit
**Dépôt :** dépôt privé github.com/majingod/KNuit

> **Règle en vigueur :**
> Master décide seul. Muse, chef de projet, propose, recommande, synthétise, vérifie et vulgarise — il ne tranche jamais.
>
> « Une IA ne gagne jamais un débat parce qu'elle argumente mieux. Les preuves priment toujours sur les opinions. »
>
> Sources de vérité, dans cet ordre : 1) Décision Master, 2) Validation experte (avant commercialisation), 3) Documents validés, 4) Preuves vérifiables, 5) Recommandations IA en dernier.

## Mode d'emploi du registre

Chaque décision est consignée avec :

- **Date d'origine** — date de la décision d'origine (2026-11-18, date de consolidation, sauf mention contraire).
- **Confirmée / reprise le :** 2026-11-19.
- **Décideur** — Master.
- **Contexte** — pourquoi la question s'est posée.
- **Décision** — ce qui a été décidé, en une phrase claire.
- **Conséquences** — ce que cela change concrètement.

Une décision ne se modifie pas par discussion : elle se modifie par une nouvelle décision de Master, consignée ici avec sa date, qui remplace explicitement la précédente.

D-01 à D-16 : proposées par la consolidation Copilot du 2026-11-18, confirmées par Master lors de la revue du dossier du 2026-11-19, sauf mention contraire. Seules D-05 et D-06 ont une origine datée et sourcée (doc 02, 2026-11-16).

> [Correction de cohérence 2026-11-19 — amendement n° 3 : champs « Date d'origine » et « Confirmée / reprise le : 2026-11-18 » ajoutés à chaque décision D-01 à D-16. Pour les décisions dont le fichier n'indique aucune date d'origine, la date portée est celle de la consolidation (2026-11-18) ; aucune date précise n'a été inventée. Seules D-05 et D-06 ont une origine datée dans le fichier : le document 02, validé le 2026-11-16.]

---

## D-01 — V2 à 2 modèles aux visions différentes

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Une seule IA, une seule vision, laisse passer ses propres angles morts. L'équipe IA a besoin d'une contradiction structurelle, pas d'une simple relecture.
- **Décision :** La V2 de l'équipe IA repose sur 2 modèles aux visions différentes : Rôle A (Qwen2.5-Coder 7B, production) et Rôle B (DeepSeek-R1 8B, critique).
- **Conséquences :** Tout livrable important passe par les deux visions. Le Rôle B n'est pas un correcteur orthographique : il conteste le fond. Voir A5, § 5.

## D-02 — Créateur ≠ critique

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Celui qui produit un livrable ne peut pas valider objectivement sa propre production.
- **Décision :** Le créateur d'un livrable n'est jamais son critique. La critique est portée par un rôle différent, avec un modèle différent.
- **Conséquences :** Aucune auto-validation. Toute validation passe par un autre rôle, puis par Master (voir A3). Voir A5, § 5.1.

## D-03 — Maximum 3 cycles, puis escalade

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Sans limite, les allers-retours entre IA peuvent boucler indéfiniment sans convergence.
- **Décision :** Maximum 3 cycles de production ↔ critique ↔ révision sur un même livrable. Au-delà, escalade vers Master, qui tranche.
- **Conséquences :** Aucun 4e cycle sans décision explicite de Master. L'escalade n'est pas un échec : c'est le fonctionnement normal prévu. Voir A5, § 6.2.

## D-04 — Muse chef de projet ne tranche pas

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Le chef de projet IA coordonne, mais la décision appartient à l'humain.
- **Décision :** Muse, chef de projet, propose, recommande, synthétise, vérifie et vulgarise. Il ne tranche jamais.
- **Conséquences :** Toute phrase de Muse qui ressemblerait à une décision doit être relue comme une recommandation soumise à Master. Seule une décision de Master fait foi. Voir A5, § 5.5.

## D-05 — Dépôt privé, pas de déploiement public en V1

- **Date d'origine :** 2026-11-16 (document 02 validé)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** KNuit touche à l'intime. La V1 est solo et privée.
- **Décision :** Le dépôt GitHub reste privé (github.com/majingod/KNuit). Aucun déploiement public en V1.
- **Conséquences :** Aucune mise en ligne publique de l'application en V1. Aucune exposition de données sur un service public. L'extension de cette interdiction aux données même factices est une proposition, non validée — à confirmer par Master.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : la mention « même factices » n'est pas un point validé ; c'est une extension proposée, à confirmer par Master.]

## D-06 — Cloudflare Pages gelé en V1

- **Date d'origine :** 2026-11-16 (document 02 validé)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Cloudflare Pages avait été envisagé comme piste de déploiement.
- **Décision :** Cloudflare Pages est gelé en V1 : pas de déploiement via Cloudflare Pages.
- **Conséquences :** Ne pas configurer, ne pas tester, ne pas documenter un déploiement Cloudflare Pages en V1. Cloudflare Pages est gelé en V1 ; réouverture seulement sur validation écrite de Master, consignée dans A2.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : alignement sur le document 02 — Cloudflare Pages gelé en V1, réouverture seulement sur validation écrite, consignée dans A2.]

## D-07 — PostgreSQL = mémoire du projet, sans données réelles

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** L'équipe IA a besoin d'une mémoire technique persistante, sans jamais manipuler de données réelles.
- **Décision :** PostgreSQL constitue la mémoire du projet (documentation, décisions, validations, historique technique — sans aucune donnée réelle). La recherche vectorielle (RAG) n'est pas retenue en V1.
- **Conséquences :** Interdiction absolue d'y mettre des données réelles, personnelles, médicales ou du contenu du coffre. PostgreSQL n'est pas une base de données d'usage réel de l'application en V1. Voir A5, § 4.3 et § 7.

## D-08 — Aucun push sans « Pousse »

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Un push est irréversible en pratique une fois partagé. Master garde le contrôle de ce qui quitte la machine.
- **Décision :** Aucun push vers GitHub sans le mot « Pousse » de Master.
- **Conséquences :** Aucun push automatique, aucune synchronisation implicite. Un push fait sans « Pousse » est un écart à consigner ici et à signaler à Master. Voir A5, § 6.5.

## D-09 — Sauvegardes quotidiennes, rétention 30 jours

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** La consolidation du 2026-11-18 a identifié l'absence de plan de sauvegarde comme un risque manquant (voir A4, R-01).
- **Décision :** Sauvegardes quotidiennes, avec rétention de 30 jours.
- **Conséquences :** La règle s'applique au dépôt, à la documentation et à la mémoire technique. Le support exact, l'emplacement et la procédure de restauration testée restent **en attente de décision de Master** (voir § « Décisions en attente » et A5, § 9.3).

## D-10 — Validations en langage simple, 3 niveaux de lecture

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Les validations techniques doivent être compréhensibles par Master sans jargon, tout en restant vérifiables — et, avant commercialisation, par l'expert humain.
- **Décision :** Toute validation est présentée en langage simple, en 3 niveaux de lecture : 1) en une phrase (ce que ça change), 2) en bref (points clés, choix, risques), 3) en détail (contenu technique complet).
- **Conséquences :** Aucune validation n'est demandée sans ces 3 niveaux. Le format est défini dans A3.

## D-11 — STOP documentation (A6 et A7 vivants)

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Modifiée le :** 2026-11-19 (décisions de Master, amendements n° 4, 7 et 8)
- **Décideur :** Master
- **Contexte :** Le cadrage documentaire est arrivé à son terme. Continuer à produire des documents retarderait la construction.
- **Décision :** Pas de nouveau document de cadrage sans décision explicite de Master. (A6 et A7 sont des documents vivants, mis à jour par amendement.)
- **Conséquences :** L'équipe passe à l'installation (Ollama, Tailscale, OpenWebUI, PostgreSQL, LangGraph — dans cet ordre) puis à la construction. Voir A1, § 6 et A5, § 6.6.

> [Correction 2026-11-19 — amendement n° 4 : reformulation validée par Master. Ancien libellé : « Après le gel des documents 05, 06, A5, A6, A7 et des gabarits » — inapplicable, car A6 et A7 ne se gèlent jamais.]

> [Décision Master 2026-11-19 — revue du dossier (amendements n° 7 et 8) : reformulée le 2026-11-19 — la condition de gel est supprimée (aucun document n'est gelé), le principe STOP subsiste.]

> [Correction de cohérence 2026-11-19 — amendement n° 3 : ordre d'installation corrigé — Tailscale avant OpenWebUI.]

## D-12 — Données interdites partout

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Règle transversale de sécurité et de confidentialité, rappelée dans l'ensemble de l'échange.
- **Décision :** Les données réelles, personnelles, médicales et le contenu du coffre sont interdits partout : GitHub, Codespaces, PostgreSQL, Ollama, modèles externes, documents, prompts.
- **Conséquences :** Aucune exception en V1. Tout besoin futur exige une décision explicite de Master et une architecture dédiée. Voir A5, § 8.1.

## D-13 — Secrets jamais dans Git, dans les docs, ni dans les prompts

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Un secret versionné ou documenté est un secret compromis.
- **Décision :** Les secrets (clés API, tokens, mots de passe) ne sont jamais dans Git, dans les docs, ni dans les prompts.
- **Conséquences :** Tout secret découvert par accident dans un doc ou dans Git doit être révoqué, retiré, et l'incident consigné et signalé à Master. Voir A5, § 8.2.

## D-14 — Orchestration V1 : script Python minimal

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Le choix de l'outil d'orchestration des agents IA devait être tranché avant l'installation.
- **Décision :** Orchestration V1 : script Python minimal (200-300 lignes, estimation). LangGraph seulement au-delà de la V1, sur décision de Master.
- **Conséquences :** Commencer simple, mesurer, puis complexifier seulement si une preuve le justifie. Voir A5, § 4.4.

## D-15 — OpenWebUI accessible via IP Tailscale, pas limité à 127.0.0.1

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Si OpenWebUI n'écoute que sur localhost, la tablette ne peut pas l'atteindre.
- **Décision :** OpenWebUI doit être accessible via l'IP Tailscale. Il ne doit pas être limité à `127.0.0.1`.
- **Conséquences :** Point de contrôle obligatoire lors de l'installation : vérifier l'adresse d'écoute avant de déclarer l'installation terminée. Voir A5, § 3.3.

## D-16 — Tailscale obligatoire pour l'accès distant

- **Date d'origine :** 2026-11-18 (consolidation)
- **Confirmée / reprise le :** 2026-11-19
- **Décideur :** Master
- **Contexte :** L'accès distant aux services locaux doit passer par un réseau privé, pas par une exposition publique.
- **Décision :** Tailscale est obligatoire pour l'accès distant. Aucun service de l'équipe IA n'est exposé sur l'internet public en V1.
- **Conséquences :** Tailscale est installé après validation des docs, dans l'ordre Ollama → Tailscale → OpenWebUI → PostgreSQL → LangGraph. Voir A1, § 6 et A5, § 3.2.

> [Correction de cohérence 2026-11-19 — amendement n° 3 : ordre d'installation corrigé — Tailscale avant OpenWebUI.]

---

## D-17 — Expert humain désigné : John Smith, expert en pratique sexuelle

- **Date de la décision :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Le registre de validation (doc 04) liste les éléments à valider par un expert avant commercialisation, et la colonne « Expert humain » était « À nommer » partout.
- **Décision :** John Smith, expert en pratique sexuelle, est désigné comme expert humain pour le domaine **pratique sexuelle / contenu éducatif** (fiches de pratiques, inventaire, atelier, dynamique, moteur de risque — volet éducatif).
- **Conséquences :** John Smith validera le domaine pratique sexuelle / contenu éducatif avant commercialisation. Aucune soumission au fur et à mesure pendant le développement. Les autres domaines restent « À nommer » : sécurité / cryptographie, juridique, médical, psy / crise. Voir doc 04 (note de désignation) et A3.
- **Limite :** John Smith ne valide que son domaine. Une validation sécurité, juridique, médicale ou psy exige un expert de ce domaine-là.

---

## D-18 — Paires de critique finales : Qwen ↔ DeepSeek, Arbiter Muse ou tiers

- **Date de la décision :** 2026-11-19
- **Décideur :** Master
- **Contexte :** Le registre de validation (doc 04, brouillon du 2026-11-17) disait « Muse crée → DeepSeek critique ; DeepSeek crée → Claude critique », alors que l'équipe finale est Rôle A = Qwen2.5-Coder 7B, Rôle B = DeepSeek-R1 8B, Arbiter = Muse ou tiers indépendant.
- **Décision :** Paires finales adoptées — Rôle A (Qwen2.5-Coder 7B) ↔ Rôle B (DeepSeek-R1 8B) : chacun produit d'abord son propre livrable indépendant, puis A relit B et B relit A. Arbiter = Muse ou modèle tiers indépendant, jamais un auteur. Max 3 cycles, puis escalade vers Master.
- **Conséquences :** La mention « Critique IA » du doc 04 est mise à jour ; les tableaux historiques de la Partie A ne sont pas réécrits (état du 2026-11-17 conservé). Claude n'est pas membre de l'équipe locale (pas de modèle local Ollama). La règle validée interdit les données RÉELLES dans les IA externes ; la critique externe par copier-coller avec des données fictives reste possible ponctuellement, comme en 2026-11-16. Muse, chef de projet, ne produit pas les livrables de routine de l'équipe ; ses livrables antérieurs (charte, dossier expert, consolidation) restent valides.

---

## Décisions en attente

> [Correction de cohérence 2026-11-19 — amendement n° 3 : l'introduction précédente (« Section vide ») était incohérente avec la liste de sujets en attente ci-dessous.]
>
> Aucune décision en attente n'est tranchée ; les sujets suivants attendent une décision de Master :

### Gabarit — à copier pour chaque décision en attente

```markdown
## D-XX — [Titre de la décision]

- **Date de la demande :** [AAAA-MM-JJ]
- **Demandé par :** [Muse / Rôle A / Rôle B / Arbiter]
- **Contexte :** [Pourquoi la question se pose]
- **Question posée à Master :** [Question exacte, en langage simple]
- **Options proposées :** [Option 1 / Option 2 / … avec avantages et inconvénients]
- **Recommandation (si applicable) :** [Recommandation de Muse, avec justification — ce n'est pas une décision]
- **Statut :** En attente de décision Master
- **Décision (à compléter) :** [À compléter par Master]
- **Date de la décision (à compléter) :** [AAAA-MM-JJ]
```

### Sujets connus en attente de décision (sans décision inventée)

Les sujets suivants sont connus pour attendre une décision de Master, sans qu'aucune décision ne soit affirmée ici :

- Support et emplacement exact des sauvegardes quotidiennes (voir D-09).
- Procédure de restauration testée (voir D-09).
- Responsable de la vérification des sauvegardes (voir D-09).
- Échelle de probabilité / impact des risques (voir A4 — à faire valider par Master).

*Fin de l'annexe A2 — Registre des décisions KNuit — 2026-11-18.*
