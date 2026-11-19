# A6 — Journal des Amendements

| Champ | Valeur |
|---|---|
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (dépôt privé) |
| **Annexe** | A6 — Journal des Amendements |
| **Statut** | Document vivant (complété à chaque amendement validé) |
| **Décideur** | Master |

Ce journal est la **trace officielle** de toutes les modifications apportées au dossier documentaire KNuit après son gel initial. Rien ne se modifie sans y laisser une entrée.

---

## Règles de modification (gelées)

1. **Tout amendement = une nouvelle entrée** dans ce journal, datée et numérotée.
2. **Validation Master obligatoire** : aucun amendement n'entre en vigueur sans la décision explicite de Master.
3. **Aucune modification silencieuse** : on ne réécrit pas un document gelé sans entrée correspondante ici.
4. **Traçabilité** : chaque entrée indique ce qui change, pourquoi, et quels documents sont touchés.
5. **Ordre des sources de vérité** : 1. Décision Master · 2. Validation expert · 3. Documents validés · 4. Preuves vérifiables · 5. Recommandations IA, en dernier.
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

1. **Report fidèle des .docx** (aucune paraphrase, aucune invention) : 01 Vision Produit V4 (16 nov. 2026, @Fred, 11 sections, 2 tableaux) ; 02 Périmètre MVP v1.0 + amendement v1.1 du 2026-11-17 (§1-8) ; 03 Architecture de sécurité v1.0 + amendement v1.1 du 2026-11-17 (§1-9) ; 04 Registre de validation, brouillon du 2026-11-16 / mise à jour 2026-11-17 (§1-4, tableaux A-I, Phase 0 0.1-0.6, fonctions sensibles).
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
- **06 Architecture de l'Équipe IA (6)** : §6 et §16.2 « cahier des charges » → « périmètre MVP (doc 02) » ; §8 ligne orchestration V1 ajoutée (script Python minimal, voir A5 §4.4 ; LangGraph préféré à CrewAI au-delà de la V1, D-14) et modèles Llama-3.2-3B / DeepSeek-Coder-V2-Lite ajoutés ; §10.3 « (rappel gelé) » → « (état vérifié du dépôt, voir A5 §2.4) » ; §15.4-15.5 reformulés au conditionnel (restauration et responsable seulement une fois validés/désignés par Master) ; §17.1 « gelé en v1.0 » → « proposé pour gel ».
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
5. **LangGraph** : V1 = script Python de 200 à 300 lignes, pas de framework ; LangGraph préféré à CrewAI au-delà de la V1, à installer seulement sur décision Master (A5 §4.4, 06 §8).

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
