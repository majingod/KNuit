# A6 — Journal des Amendements

| Champ | Valeur |
|---|---|
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (dépôt privé) |
| **Annexe** | A6 — Journal des Amendements |
| **Statut** | Document vivant (complété à chaque amendement validé) |
| **Décideur** | Master |

Ce journal est la **trace officielle** de toutes les modifications apportées au dossier documentaire KNuit après sa constitution initiale. Rien ne se modifie sans y laisser une entrée.

---

## Règles de modification (en vigueur)

1. **Tout amendement = une nouvelle entrée** dans ce journal, datée et numérotée.
2. **Validation Master obligatoire** : aucun amendement n'entre en vigueur sans la décision explicite de Master.
3. **Aucune modification silencieuse** : on ne réécrit pas un document sans entrée correspondante ici.
4. **Traçabilité** : chaque entrée indique ce qui change, pourquoi, et quels documents sont touchés.
5. **Ordre des sources de vérité** : 1. Décision Master · 2. Validation experte (avant commercialisation) · 3. Documents validés · 4. Preuves vérifiables · 5. Recommandations IA, en dernier.
6. **Créateur ≠ critique** : l'amendement est relu par un rôle qui n'en est pas l'auteur ; l'Arbiter n'est jamais un auteur.
7. **Max 3 cycles** de révision puis escalade vers Master.

---

## Table des amendements

### Amendement n° 1 — 2026-11-18 — Consolidation du dossier documentaire

| Champ | Détail |
|---|---|
| **Date** | 2026-11-18 |
| **Décideur** | Master |
| **Origine** | Audit Copilot + consolidation du dossier |
| **Documents touchés** | 01, 02, 03, 04, 05, 06, annexes A1-A7, gabarits T1-T3, README |

**Contenu de l'amendement :**

1. **Nouvelle numérotation** : documents normatifs **01 à 06**, annexes **A1 à A7**, gabarits **T1 à T3**.
2. **Sections ajoutées aux documents gelés :**
   - **Doc 02** — section 9 ajoutée.
   - **Doc 03** — sections 10 à 12 ajoutées (séparation des données, IA externes, sauvegardes, continuité).
   - **Doc 04** — sections 5 à 7 ajoutées (définition de prêt, gestion des secrets, continuité).
3. **Corrections de la charte :**
   - **Rôle de Muse** précisé : chef de projet — propose, recommande, synthétise, vérifie, vulgarise ; **ne tranche jamais**.
   - **Créateur ≠ critique** : A relit B, B relit A, l'Arbiter n'est jamais un auteur.
   - **Tailscale / OpenWebUI** : précisions sur leur rôle dans l'architecture locale (accès local sécurisé, interface locale des modèles — voir glossaire A7).
4. **Corrections des documents 05 / 06 :**
   - Thèmes des ajustements : séparation des données, IA externes, sauvegardes, continuité, gestion des secrets, définition de prêt.
   - Les textes détaillés de ces ajustements figurent dans les documents 05 et 06 proposés pour gel.
   - [Correction de cohérence 2026-11-19 — amendement n° 3 : le libellé « 8 ajustements §13.1 à §13.5 » n'est pas vérifiable dans les fichiers actuels (la section 13 du doc 05 ne compte que les sous-sections 13.1 à 13.3, et les thèmes sont répartis entre les sections 11 à 15 du doc 05 et 11 à 15 du doc 06) ; remplacé par la liste des thèmes, vérifiable dans 05 et 06.]
5. **Statuts confirmés :** 01-03 **GELÉ**, 04 **BROUILLON PRÉPARÉ** (pas gelé — voir amendement n° 2), 05-06 **PRÊT POUR GEL**. [Corrigé par l'amendement n° 2 : le 04 est un BROUILLON PRÉPARÉ, pas gelé.]
6. **Création des gabarits** T1 (décision), T2 (rapport), T3 (validation expert) et du présent journal (A6) et du glossaire (A7).

**Conséquence :** le dossier documentaire est désormais structuré en 6 documents normatifs, 7 annexes et 3 gabarits, avec un index général (README.md). Prochaine étape : gel par Master, puis installation Ollama / OpenWebUI / Tailscale / PostgreSQL / LangGraph.

---

### Amendement n° 2 — 2026-11-19 — Report des .docx validés + ajouts Copilot

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master (validation des ajouts encore en attente) |
| **Origine** | Fichiers .docx fournis par Master + consolidation Copilot du 2026-11-18 |
| **Documents touchés** | 01, 02, 03, 04, README |

**Contenu de l'amendement :**

1. **Report fidèle des .docx** (aucune paraphrase, aucune invention) : 01 Vision Produit V4 (16 nov. 2026, Master, 11 sections, 2 tableaux) ; 02 Périmètre MVP v1.0 + amendement v1.1 du 2026-11-17 (§1-8) ; 03 Architecture de sécurité v1.0 + amendement v1.1 du 2026-11-17 (§1-9) ; 04 Registre de validation, brouillon du 2026-11-16 / mise à jour 2026-11-17 (§1-4, tableaux A-I, Phase 0 0.1-0.6, fonctions sensibles).
2. **Correction de statut :** l'amendement n° 1 disait « 01-04 GELÉ » — c'est faux pour le 04. Le .docx du registre est un **BROUILLON PRÉPARÉ**, pas gelé : la validation humaine par un expert reste à faire pour chaque élément. Le README est corrigé en conséquence.
3. **Ajouts Copilot intégrés, marqués « ⚠️ À VALIDER PAR MASTER »** (ne font pas partie du texte validé) : 02 §9 Séparation entre le produit KNuit et l'équipe IA ; 03 §10 Séparation des données, §11 IA externes et modèles, §12 Sauvegardes et continuité de l'équipe IA ; 04 §5 Définition de prêt, §6 Gestion des secrets, §7 Continuité.
4. **Écarts relevés, à trancher par Master (texte validé intact) :**
   - Feuille de route de la Vision V4 : schéma 5 phases / 3 portes embarqué dans le .docx, illisible — à compléter depuis l'original.
   - Workbox : le doc 03 validé dit « PWA Workbox à valider ou retirer », alors que A5 et le doc 06 indiquent un service worker écrit à la main sans Workbox.
   - Paires de critique IA : le registre dit « Muse crée → DeepSeek critique ; DeepSeek crée → Claude critique », alors que l'équipe finale est Rôle A = Qwen2.5-Coder 7B, Rôle B = DeepSeek-R1 8B, Arbiter = Muse ou tiers indépendant.
   - Renvoi 02 §8 : « Voir 03-registre-validation.md » reproduit tel quel, mais dans la nouvelle numérotation le registre est le doc 04.
   - Numérotation interne des .docx (Document 01/02/03) différente de la numérotation consolidée (02/03/04) — consignée dans chaque fichier.

**Conséquence :** les documents 01-03 sont désormais complets (texte validé + ajouts à valider) ; le 04 est complet mais reste un brouillon. Prochaine étape : Master valide les ajouts, tranche les 4 écarts, puis gèle 05, 06 et 04.

---

### Amendement n° 3 — 2026-11-19 — Audit de cohérence des 17 fichiers

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master (autorisation expresse de corriger même les documents gelés pour ce passage de cohérence) |
| **Origine** | Audit de cohérence des 17 fichiers (3 audits : docs 01-06, annexes A1-A5, README/A6/A7/gabarits — ~61 incohérences relevées, doublons fusionnés) |
| **Documents touchés** | Les 17 fichiers (01-06, A1-A7, T1-T3, README) |

**Contenu de l'amendement — corrections par fichier (chaque correction d'un texte validé est signalée dans le fichier par une note « [Correction de cohérence 2026-11-19 — amendement n° 3 : …] » — 65 notes relevées par grep le 2026-11-19) :**

- **01 Vision Produit V4 (6)** : ligne de cadrage ajoutée (phasage V1/V1.1/V2 fixé par le doc 02) ; mode de récupération reporté en V1.1/V2, aucune clé de récupération en V1 (tableau V3→V4 et § Confidentialité) ; « Versioning public » → « Versioning des fiches (traçabilité interne en V1) » ; « Passer l'appareil (première version) » → « premier mode du Mode Duo, en V2 — pas en V1 » (tableau V3→V4 et tableau Porte C).
- **02 Périmètre MVP (5)** : en-tête précisé « GELÉ (Partie A) ; Section 9 : À VALIDER PAR MASTER » ; §8 « Voir 03-registre-validation.md » → « Voir 04-registre-validation.md » ; « principes gelés » → « principes proposés pour gel » (bandeau Partie B et note de transcription).
- **03 Architecture de sécurité (8)** : en-tête précisé « GELÉ (Partie A) ; Sections 10-12 : À VALIDER PAR MASTER » ; Workbox retiré (§1, §8 CSP, §8 dépendances, §8 service worker) ; section Écarts mise à jour (écart tranché) ; Partie B « principes déjà gelés dans la Charte » → « principes proposés pour gel ».
- **04 Registre de validation (6)** : note de lecture sur la numérotation consolidée ajoutée en introduction ; §1 ligne G Cloudflare précisée (« gelé jusqu'à validation d'architecture écrite, à vérifier, non acquis ») ; §2 ligne 0.1 annotée (état au 2026-11-17 ; état actuel voir A1 et A5) ; §2 ligne 0.6 Workbox retiré ; §7.2 « Documents validés : la charte (05)… » → « Documents de référence… proposées pour gel » ; « principes gelés » → « principes proposés pour gel » (bandeau Partie B). Les tableaux historiques (§1, §2) n'ont pas été réécrits — seules les lignes G et 0.6, corrections tranchées, ont été précisées et signalées.
- **05 Charte (4)** : modèles Llama-3.2-3B (exécution) et DeepSeek-Coder-V2-Lite quantifié (planification/arbitrage) ajoutés à l'inventaire §5 ; §8 et §16.2 « cahier des charges » → « périmètre MVP (doc 02) » ; §17.1 « gelé en v1.0 » → « proposé pour gel ».
- **06 Architecture de l'Équipe IA (6)** : §6 et §16.2 « cahier des charges » → « périmètre MVP (doc 02) » ; §8 ligne orchestration V1 ajoutée (script Python minimal, voir A5 §4.4 ; LangGraph au-delà de la V1, sur décision de Master (D-14)) et modèles Llama-3.2-3B / DeepSeek-Coder-V2-Lite ajoutés ; §10.3 « (rappel gelé) » → « (état vérifié du dépôt, voir A5 §2.4) » ; §15.4-15.5 reformulés au conditionnel (restauration et responsable seulement une fois validés/désignés par Master) ; §17.1 « gelé en v1.0 » → « proposé pour gel ».
- **A1 État actuel (9)** : §4.1 et §7 renumérotés, statut 04 = BROUILLON PRÉPARÉ ; §4.2 titres 05/06 ajoutés ; §4.3 et §4.5 A6/A7 retirés du gel et de STOP documentation ; §5-§6 ordre d'installation corrigé ; condition d'installation reformulée au futur (« doivent être gelés par Master »).
- **A2 Registre des décisions (22)** : champs « Date d'origine » et « Confirmée / reprise le : 2026-11-18 » ajoutés aux 16 décisions (seules D-05/D-06 ont une origine sourcée : doc 02 validé 2026-11-16 ; les 14 autres portent la date de consolidation, sans fausse date inventée) ; introduction « Décisions en attente » corrigée ; D-05 « même factices » marqué comme extension proposée à confirmer ; D-06 aligné sur le doc 02 ; ordre d'installation corrigé en D-11 et D-16.
- **A3 Registre des validations (9)** : V-01 à V-04 renumérotés avec dates exactes ; validateurs corrigés (« Gelé par Master… — validation experte humaine en attente » ; V-01/V-04 : validations clinique/juridique en attente, voir doc 01) ; V-03 statut BROUILLON PRÉPARÉ avec note de primauté corrigée (conflit → escalade vers Master, aucun ne prime) ; titres V-05/V-06 ajoutés ; V-08/V-09 A6/A7 vivants ; §4 STOP documentation corrigé.
- **A4 Registre des risques (6)** : §2.2 R-01a statut 04 corrigé et mitigation « 05-06 proposés pour gel » (et non gelés) ; R-02b cotation unique « Faible (provisoire — si les règles sont respectées) » + mitigation « En cas de relâchement, la probabilité passe à Élevée — re-coter immédiatement » ; §7.1 « Applicable seulement une fois le plan de sauvegarde validé par Master (D-09) ; jusque-là, l'indicateur est "plan non défini". »
- **A5 Architecture technique (8)** : en-tête/§11.4/pied « Validé pour la v1 » → « Prête pour la v1, non gelée — proposée pour gel le 2026-11-18 » ; §4.1 ordre d'installation corrigé et « gelé dans A1 » → « proposé dans A1, à geler par Master » ; §4.4 LangGraph clarifié (V1 = script Python 200-300 lignes ; LangGraph au-delà de la V1, sur décision Master) ; §5.2 Rôle B = production indépendante + critique, planification de préférence DeepSeek-Coder-V2-Lite ; §6.1 étapes 4-6 (production A et B, critique croisée, révision des deux rôles) ; §6.6 A6/A7 retirés de STOP documentation ; §7.1 statuts corrigés ; §12 références renumérotées, A6/A7 vivants.
- **A6 Journal des amendements (2)** : amendement n° 1 point 4 corrigé (le libellé « 8 ajustements §13.1 à §13.5 » n'est pas vérifiable dans les fichiers actuels — remplacé par la liste des thèmes, vérifiable dans 05 et 06 ; « documents 05 et 06 validés » → « proposés pour gel ») ; point 5 annoté [Corrigé par l'amendement n° 2 : le 04 est un BROUILLON PRÉPARÉ, pas gelé.]
- **A7 Glossaire (5)** : en-tête « Document vivant / de référence — mis à jour par amendement, jamais gelé » ; entrée « Gel » corrigée (GELÉ 01-03, BROUILLON PRÉPARÉ 04, PRÊT POUR GEL 05-06) ; entrées LangGraph, Hub et Mode Urgence précisées.
- **T3 Gabarit validation expert (1)** : checklist corrigée (« documents gelés (01-03), charte (05), architecture équipe IA (06), registre (04, brouillon préparé) »).
- **README (5)** : règle d'or n° 6 précisée (données interdites partout : GitHub, Codespaces, PostgreSQL équipe IA, Ollama, modèles externes) ; doc 06 renommé « Architecture de l'Équipe IA » (ordre de lecture et prochaine étape) ; « tranche les 5 écarts » uniformisé ; ordre d'installation corrigé.
- **T1, T2 (0)** : vérifiés, aucune erreur de numérotation ou de statut constatée.

**Décisions tranchées par Master et appliquées dans ce passage :**
1. **Workbox retiré** : service worker écrit à la main, sans Workbox (état constaté du dépôt, tête 598f460c, suite 39/39). Corrigé en 03 (§1, §8), 04 (§2 ligne 0.6) ; mentions « à trancher » retirées.
2. **Modèles ajoutés à 05 §5 et 06 §8** : Llama-3.2-3B (exécution) et DeepSeek-Coder-V2-Lite quantifié (planification/arbitrage) ; planification de préférence confiée à DeepSeek-Coder-V2-Lite (A5 §5.2).
3. **Ordre d'installation corrigé** : Ollama, Tailscale, OpenWebUI (vérifier l'écoute sur l'IP Tailscale), PostgreSQL, LangGraph.
4. **A6 et A7 = documents vivants / de référence**, jamais gelés (en-têtes, A1 §4.3, A3 V-08/V-09, A5 §12, conditions STOP documentation).
5. **LangGraph** : V1 = script Python de 200 à 300 lignes, pas de framework ; LangGraph au-delà de la V1, à installer seulement sur décision Master (A5 §4.4, 06 §8).

**Points qui restent ouverts (à trancher par Master) :**
- Feuille de route de la Vision V4 : schéma 5 phases / 3 portes embarqué dans le .docx, illisible — toujours une note, aucun contenu inventé.
- Gestionnaire de secrets à désigner ; expert humain à nommer pour les validations ; procédure de sauvegarde/restauration (support, emplacement, test, responsable) ; échelle probabilité/impact des risques (A4 §1, provisoire).
- Paires de critique IA du registre 04 (Muse/DeepSeek/Claude) vs équipe finale (Qwen/DeepSeek, Arbiter Muse ou tiers) : écart signalé en fin de 04, tableaux historiques non réécrits, décision de Master attendue.
- Les occurrences restantes de « principes gelés » dans le dossier sont des citations de l'ancien libellé à l'intérieur des notes de correction de l'amendement n° 3 et du présent journal — elles sont annotées, pas des affirmations.

**Conséquence :** le dossier est cohérent sur la numérotation, les statuts (01-03 GELÉ, 04 BROUILLON PRÉPARÉ, 05-06 et A5 PRÊT POUR GEL, A6/A7 vivants), l'ordre d'installation et les rôles/modèles. Prochaine étape : Master valide les ajouts Copilot (02 §9, 03 §10-12, 04 §5-7), tranche les points ouverts ci-dessus, puis gèle 05, 06, A5 et 04.

---

### Amendement n° 4 — 2026-11-19 — Reformulation de D-11 (STOP documentation)

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Décision de Master en réponse à la proposition de reformulation (amendement n° 3, point ouvert) |
| **Documents touchés** | A2 (D-11) |

**Contenu de l'amendement :**

1. **D-11 reformulée** : « Après le gel des documents 05, 06, A5 et des gabarits : STOP documentation. Plus aucun nouveau document de cadrage sans décision explicite de Master. (A6 et A7 sont des documents vivants, mis à jour par amendement — ils ne font pas partie de la condition de gel.) »
2. **Ancien libellé retiré** : « Après le gel des documents 05, 06, A5, A6, A7 et des gabarits » — inapplicable, car A6 et A7 ne se gèlent jamais. L'ancien libellé est conservé dans la note de correction de D-11, à titre d'historique.
3. **Cohérence confirmée** : la formulation est désormais identique à celle déjà appliquée dans A1 §4.5, A3 §4 et A5 §6.6.

**Conséquence :** la condition de STOP documentation peut désormais être remplie. Le point ouvert D-11 de l'amendement n° 3 est clos. Prochaine étape : gel de 05, 06, A5 et 04 par Master, puis dépôt sur GitHub (sur « Pousse » de Master).

---

### Amendement n° 5 — 2026-11-19 — Validation des ajouts Copilot + désignation de l'expert humain

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Validation de Master (« Je valide les ajouts ») + désignation de l'expert humain |
| **Documents touchés** | 02 (§9), 03 (§10-12), 04 (§5-7, note de désignation), A2 (D-17), README |

**Contenu de l'amendement :**

1. **Ajouts Copilot validés par Master le 2026-11-19** : 02 §9 (Séparation entre le produit KNuit et l'équipe IA), 03 §10-12 (Séparation des données, IA externes et modèles, Sauvegardes et continuité de l'équipe IA), 04 §5-7 (Définition de prêt, Gestion des secrets, Continuité). Les encadrés « À VALIDER PAR MASTER » sont remplacés par « Validé par Master le 2026-11-19 » dans chaque fichier ; ces sections font désormais partie du texte gelé (02, 03) et du registre (04).
2. **Expert humain désigné (D-17)** : John Smith, expert en pratique sexuelle — domaine : pratique sexuelle / contenu éducatif. Les autres domaines (sécurité / cryptographie, juridique, médical, psy / crise) restent « À nommer » et attendent un expert de leur domaine. Note de désignation ajoutée en tête du doc 04 ; les tableaux historiques ne sont pas réécrits.

**Conséquence :** il ne reste plus aucune section « à valider » dans les docs 02, 03 et 04. Reste ouvert : la feuille de route de la Vision (schéma illisible), le gestionnaire de secrets, l'expert sécurité / juridique / médical / psy à désigner, la procédure de sauvegarde/restauration et l'échelle probabilité/impact. (Les paires de critique IA ont été tranchées ensuite — voir amendement n° 6.)

---

### Amendement n° 6 — 2026-11-19 — Paires de critique finales adoptées (D-18)

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Décision de Master (« Paires finales : Qwen ↔ DeepSeek, Arbiter Muse ou tiers ») après explication en langage simple |
| **Documents touchés** | 04 (mention « Critique IA », tableau des écarts, pied de page), A2 (D-18) |

**Contenu de l'amendement :**

1. **Paires finales adoptées (D-18)** : Rôle A (Qwen2.5-Coder 7B) ↔ Rôle B (DeepSeek-R1 8B) — A relit B et B relit A, chacun produisant d'abord son propre livrable indépendant. Arbiter = Muse ou modèle tiers indépendant, jamais un auteur. Max 3 cycles, puis escalade vers Master.
2. **Mention « Critique IA » mise à jour** en tête du doc 04 ; tableau des écarts mis à jour (décision prise). Les tableaux historiques de la Partie A (mention « Muse crée → DeepSeek critique ; DeepSeek crée → Claude critique ») ne sont pas réécrits — ils conservent l'état du brouillon du 2026-11-17.
3. **Pourquoi pas les anciennes paires** : Claude ne fait pas partie de l'équipe (modèle externe, pas de modèle local Ollama — l'utiliser obligerait à envoyer du travail hors de la machine, contre la règle « aucune donnée dans les IA externes ») et Muse y était créateur, ce qui contredit son rôle gelé de chef de projet (propose, synthétise, vérifie — ne produit pas les livrables et ne tranche pas).

**Conséquence :** le point ouvert « paires de critique » de l'amendement n° 5 est clos. Le dossier est désormais complet sur ce point ; restent ouverts la feuille de route de la Vision, le gestionnaire de secrets, les experts sécurité / juridique / médical / psy et la procédure de sauvegarde/restauration.

---

### Amendement n° 7 — 2026-11-19 — Revue critique du dossier documentaire

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Revue critique du dossier documentaire par Muse (chef de projet), puis 16 réponses de Master |
| **Documents touchés** | README, 01, 02, 03, 04, 05, 06, A1, A2, A3, A4, A5, A7, T1, T2, T3 |

**Contenu de l'amendement :**

1. **Ajouts Copilot confirmés validés** : les ajouts aux docs 02 (§9), 03 (§10-12) et 04 (§5-7) sont validés par Master ; les statuts contradictoires (« à valider par Master » dans les titres et pieds) sont corrigés en « Validés par Master le 2026-11-19 » partout.
2. **Modifications de l'amendement n° 3 confirmées** : les modifications de textes validés (Vision « Versioning public », Workbox, mode de récupération, cellules des tableaux historiques du registre) sont validées par Master ; les affirmations inexactes autour d'elles sont corrigées, pas les modifications elles-mêmes.
3. **Règle de conflit restaurée** : sur le fond (produit, sécurité), les docs 01/02 priment ; sur le fonctionnement de l'équipe, la charte prime ; en cas de conflit, Master tranche. La charte ne peut pas annuler une décision produit/sécurité validée par Master.
4. **D-18 corrigée — justification honnête** : Claude n'est pas membre de l'équipe locale (pas de modèle local Ollama). La règle validée interdit les données RÉELLES dans les IA externes ; la critique externe par copier-coller avec des données fictives reste possible ponctuellement, comme en 2026-11-16. Muse, chef de projet, ne produit pas les livrables de routine de l'équipe ; ses livrables antérieurs (charte, dossier expert, consolidation) restent valides.
5. **Docs de gouvernance confirmés dans le dépôt** : fin de la règle « hors dépôt » (2026-11-16) ; les documents de gouvernance sont dans le dépôt, sous `documentation/`. Les textes nécessaires sont corrigés en conséquence.
6. **Éléments de la charte restaurés** : format obligatoire de décision (nouvelle §18 du doc 05), « les IA peuvent décider seules » (nouvelle §19), sécurité de l'environnement (nouvelle §15, 6 niveaux, compte Windows dédié `KNuit-AI`, Tailscale, binding OpenWebUI à l'IP Tailscale).
7. **Orchestrateur = Muse en V1** : il répartit les tâches, fait respecter la limite de 3 cycles, escalade les désaccords vers Master. L'outil d'orchestration en V1 est un script Python minimal ; LangGraph seulement sur décision de Master.
8. **Règles nouvelles tranchées** : sauvegardes quotidiennes / rétention 30 jours gardées (support, emplacement, procédure, responsable restent ouverts) ; recherche vectorielle (RAG) non retenue en V1 ; comparaison avec un outil d'orchestration concurrent retirée (cet outil n'a jamais été un candidat) ; modèles confirmés (Qwen2.5-Coder 7B rôle A, DeepSeek-R1 8B rôle B, Llama-3.2-3B exécution, DeepSeek-Coder-V2-Lite planification/arbitrage) ; « Qwen2.5-Coder-7B est faible en planification » devient une hypothèse à vérifier en pratique, pas un fait ; détails machine non sourcés (« 32 Go DDR5 », « ~2 To libres », « Windows 11 ») retirés — seule la spécification confirmée est gardée (i7-13700F, 32 Go RAM, RTX 4060 Ti 8 Go). [Corrigé par l'amendement n° 10 (2026-11-19) : les trois détails ont été confirmés par Master et restaurés.]
9. **Étiquettes D-01 à D-16 corrigées** : « Confirmée / reprise le : 2026-11-18 » → « 2026-11-19 » ; seules D-05 et D-06 ont une origine datée et sourcée (doc 02, 2026-11-16).
10. **Nom de Master uniformisé** : toute référence au nom précédemment indiqué ou au prénom précédemment indiqué est remplacée par « Master », y compris dans les notes de correction.
11. **Rex identifié** : Rex est une IA utilisée par Master via son téléphone.
12. **Hiérarchie uniformisée sur le schéma ramifié** : Rôle A et Rôle B côte à côte, critique croisée A↔B, Arbiter jamais un auteur (doc 05 §4, doc 06 §3.1).
13. **Corrections Basse** : D-11 reformulée (fin du gel, voir amendement n° 8), gabarits T2/T3 complétés, doublons et incohérences mineures corrigés.

Note : l'affirmation de l'amendement n° 1 sur les corrections « Tailscale / OpenWebUI » de la charte était inexacte pour le doc 05 (la sécurité de l'environnement avait été supprimée du doc 05, pas précisée) ; elle est corrigée par la restauration de la section sécurité de l'environnement du doc 05 (§15).

**Conséquence :** le dossier documentaire est corrigé dans son ensemble (17 fichiers). Les décisions de cet amendement sont appliquées dans ce lot, avec les amendements n° 8 et n° 9.

---

### Amendement n° 8 — 2026-11-19 — Fin du gel

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Décision de Master (« Aucun fichier ne sera réellement gelé. On pourra en tout temps y apporter des modifications lorsque nécessaire. ») |
| **Documents touchés** | README, 01, 02, 03, 04, 05, 06, A1, A2, A3, A4, A5, A6, A7, T1, T2, T3 |

**Contenu de l'amendement :**

1. **Aucun document n'est gelé.** Tout document est vivant et modifiable à tout moment par décision de Master, tracée dans ce journal.
2. **Les statuts « GELÉ » et « PRÊT POUR GEL » sont supprimés partout** et remplacés par « Version 1.0 — document vivant, modifiable à tout moment par décision de Master, tracée au journal A6. »
3. **« Proposé pour gel » devient « Version 1.0, en attente de validation par Master ».**
4. Les occurrences historiques du mot « gelé » dans les amendements n° 1 à 6 et dans les notes de correction datées restent telles quelles, à titre d'historique ; elles ne décrivent plus l'état actuel d'aucun document.

**Conséquence :** le dossier documentaire n'a plus de document gelé. La traçabilité des modifications est assurée par ce journal, pas par un gel.

---

### Amendement n° 9 — 2026-11-19 — Validation experte reportée à avant commercialisation

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Décision de Master (« Je veux qu'on produise un app, avant de la commercialiser je la ferai valider par les experts nécessaires et non pas faire valider au fur et à mesure. ») |
| **Documents touchés** | 01, 02, 03, 04, 05, 06, A1, A2, A3, A4, A5, A6, A7, T3 |

**Contenu de l'amendement :**

1. **Fin de la validation au fur et à mesure.** Pendant le développement, aucune validation experte n'est demandée, élément par élément.
2. **Une seule validation experte globale, avant toute commercialisation ou diffusion publique.** Master fera valider l'application par les experts nécessaires avant de la commercialiser.
3. **Le registre (doc 04) devient la liste des éléments à valider avant commercialisation.** Les éléments y sont « En cours » ou « À valider avant commercialisation » pendant le développement ; aucun ne passe « Validé » avant la validation experte pré-commercialisation.
4. **Le dossier expert hors dépôt devient le dossier de validation pré-commercialisation.** Il n'est pas modifié dans ce lot.
5. **Le gate du code (CONTENT-STATUS.md / scripts/check-content-status.mjs) n'est pas modifié dans ce lot.** Il fera l'objet d'une tâche distincte (adapter la notion de « validé » au nouveau calendrier).

**Conséquence :** la validation experte n'est plus un jalon de développement mais un jalon de commercialisation. Le dossier de validation expert (hors dépôt) et le registre (doc 04) sont les deux outils de cette validation unique.

---

### Amendement n° 10 — 2026-11-19 — Spécifications machine confirmées par Master

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Confirmation de Master (spécifications de son ordinateur) |
| **Documents touchés** | 05, A1, A4, A5, A6 |

**Contenu de l'amendement :**

1. **Spécifications confirmées** : Intel i7-13700F, 32 Go de RAM DDR5, GPU NVIDIA GeForce RTX 4060 Ti 8 Go, ~2 To libres, Windows 11.
2. **Restauration** : les trois détails retirés par l'amendement n° 7 point 8 faute de source sont restaurés dans le doc 05 (§15), A1 (§5), A4 (R-01a) et A5 (§2.1).
3. **Proposition gate validée en principe, sans code pour l'instant** : la proposition d'adapter le gate du code (CONTENT-STATUS.md / scripts/check-content-status.mjs) au nouveau calendrier de validation (amendement n° 9 point 5) est validée par Master — mais aucun code n'est écrit pour l'instant. La tâche reste à lancer plus tard, sur décision de Master.

**Conséquence :** les spécifications machine du dossier sont désormais sourcées (confirmation Master 2026-11-19).

---

### Amendement n° 11 — 2026-11-19 — Portabilité Windows et gate pré-commercialisation

| Champ | Détail |
|---|---|
| **Date** | 2026-11-19 |
| **Décideur** | Master |
| **Origine** | Demande explicite de correction des écarts de cohérence et décision de conserver les builds de développement avec contenu brouillon, avec une gate de publication stricte |
| **Documents touchés** | README, CONTENT-STATUS.md, package.json, package-lock.json, scripts/check-content-status.mjs, vite.config.ts, tests/e2e, 01, 03, A1, A5, A6 |

**Contenu de l'amendement :**

1. **Portabilité Windows** : normalisation des chemins découverts par la gate ; détection et remplacement du marqueur du service worker indépendants des fins de ligne LF/CRLF ; tests Playwright adaptés aux chemins temporaires Windows, au lancement de Vite par Node et aux jonctions Windows.
2. **Dépendance Playwright** : mise à jour de `@playwright/test` vers 1.65.1 ; `npm audit` ne signale plus de vulnérabilité.
3. **Gate de contenu** : les vérifications de développement continuent d'accepter les contenus brouillons et en revue. `npm run check:release` exige, avant commercialisation ou diffusion publique, que chaque contenu soit non brouillon, déclaré `validé` avec les métadonnées requises et le hash correspondant. Cette commande ne remplace pas la validation humaine et ne déploie rien.
4. **Cohérence documentaire** : CSP documentée comme identique en développement et en prévisualisation ; nombre de specs corrigé à 13 fichiers / 39 tests ; références de commit explicitement datées du 2026-11-18 ; feuille de route de la Vision maintenue provisoire, sans attribuer les validations aux phases avant vérification de l'original.
5. **Vérification** : `npm run lint` et `npm run test:e2e` réussissent sur Windows ; les 39 tests passent.

**Conséquence :** le développement reste possible avec des contenus clairement marqués comme brouillons ; la vérification dédiée interdit la pré-commercialisation si un contenu n'a pas été validé ou si son hash ne correspond plus.

---

### Amendement n° 12 — 2026-11-20 — Parcours Phase 1 et priorité mobile

| Champ | Détail |
|---|---|
| **Date** | 2026-11-20 |
| **Décideur** | Master |
| **Origine** | Demande de tester le contenu et les fonctionnalités avant validation, avec priorité mobile/tablette et compatibilité Windows; choix explicite de la Phase 1 |
| **Documents touchés** | README, CONTENT-STATUS.md, application, tests E2E, A1, A5, A6 |

**Contenu de l'amendement :**

1. **Mode Urgence** : remplacement du texte de pipeline par un brouillon générique d’orientation, sans numéro d’urgence ni procédure médicale ou technique.
2. **« Ça s'est mal passé »** : ajout d’un parcours interruptible, avec vérification de sécurité immédiate, note temporaire non enregistrée, effacement à la sortie et ressource officielle canadienne ouverte à la demande.
3. **Brouillons** : les deux blocs restent explicitement `brouillon: true`; la gate de pré-commercialisation demeure inchangée et les deux contenus ne sont pas validés par des spécialistes.
4. **Plateformes** : interface conçue en priorité pour les téléphones et tablettes, avec tests responsive et prise en charge navigateur Windows.
5. **Journal chiffré** : non implémenté dans cette préversion; la note du parcours est temporaire et n’est jamais enregistrée, en attendant les fondations du coffre chiffré.

**Conséquence :** les parcours de la Phase 1 peuvent être testés sans présenter les brouillons comme des conseils validés. Le journal chiffré reste à construire; la validation experte est requise avant toute diffusion publique.

---

## Modèle d'entrée vierge (à copier pour chaque nouvel amendement)

```markdown
### Amendement n° N — AAAA-MM-JJ — Titre court

| Champ | Détail |
|---|---|
| **Date** | AAAA-MM-JJ |
| **Décideur** | Master |
| **Origine** | (audit, décision Master, validation expert, incident, etc.) |
| **Documents touchés** | (liste) |

**Contenu de l'amendement :**

1. ...
2. ...

**Conséquence :** ...
```
