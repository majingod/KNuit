# Architecture de sécurité v1.0 — Kink de Nuit — Option A validée

| Champ | Valeur |
|---|---|
| **Titre** | Architecture de sécurité v1.0 — Kink de Nuit — Option A validée |
| **Version** | v1.0 + amendement v1.1 du 2026-11-17 |
| **Date** | 2026-11-16, amendement v1.1 le 2026-11-17 |
| **Statut** | Version 1.0 (Partie A — texte validé) — Validée définitivement par Master le 2026-11-16, amendement v1.1 validé le 2026-11-17 ; Sections 10-12 : Validées par Master le 2026-11-19 |
| **Source** | `workspace/user/files/03___Document_02__Architecture_de_s_curit__3_qbyk.docx` — Vision produit V4 + Option A validée + résultat DeepSeek Tâche 2.1 + critiques Claude (16 points) et DeepSeek (13 points), tri fusionné validé |
| **Projet** | KNuit — application Kink de Nuit |
| **Dépôt** | github.com/majingod/KNuit (privé) |

> **Ce document décrit une architecture visée ; il ne constitue pas une certification de sécurité.**

> **Note de classement :** dans l'échange Copilot, ce document portait le numéro 02. Il a été renuméroté 03 lors de la consolidation documentaire du 2026-11-18 (nouvelle numérotation : 01 Vision Produit V4, 02 Périmètre MVP, 03 Architecture de sécurité, 04 Registre de validation, 05 Charte Équipe IA, 06 Architecture Équipe IA). Le contenu validé ci-dessous n'a pas été modifié par cette renumérotation.

---

# PARTIE A — Texte validé (transcription fidèle)

Les sections 1 à 9 ci-dessous sont la transcription fidèle du document validé. Aucune paraphrase, aucun ajout, aucune invention.

## 1. Principes

- Produit : PWA local-first pour adultes consentants, usage solo, français uniquement, version privée non publiée. Aucune URL publique en V1.
- 100 % local : sans compte, sans serveur, sans synchronisation, sans analytics, sans push.
- Option A validée : un seul coffre local chiffré, protégé par mot de passe maître.
- Minimisation : ne stocker que le nécessaire, chiffrer les données personnelles, réduire l'exposition.
- Périmètre V1 strict : PIN de contrainte, clé de récupération, Mode Duo et paiement sont reportés en V1.1/V2 et ne sont pas inclus. Cloudflare Pages et nom public gelés jusqu'à validation écrite.
- Noyau coffre séparé de l'interface : TypeScript pur, seule dépendance d'exécution idb, WebCrypto natif. Seule partie soumise à audit expert avant commercialisation. [Décision Master 2026-11-19 — revue du dossier (amendement n° 9) : validation experte reportée à avant commercialisation.] Interface : Preact + TypeScript + CSS simple, pas de Tailwind en v1, Vite, PWA : service worker écrit à la main, sans Workbox. [Correction de cohérence 2026-11-19 — amendement n° 3 : Workbox retiré ; service worker écrit à la main, sans Workbox.]

## 2. Ce qui est chiffré, et ce qui ne l'est pas

- Non chiffré : contenu éducatif public non personnel, précaché via service worker, séparé du coffre. Le précache ne contient que du contenu neutre, audité, sans nom interne, sans source maps en prod.
- Chiffré : inventaire, plans de scène, debrief, journal.
- Les données concernées peuvent relever de la santé et de la vie sexuelle (RGPD article 9).
- Le local-first réduit l'exposition mais ne supprime pas tous les risques.
- Aucune donnée personnelle n'est envoyée à un serveur.

## 3. Chiffrement et dérivation de clé, stockage IndexedDB — amendement v1.1 points B, C, format

- Mot de passe maître saisi par la personne utilisatrice.
- Dérivation v1 : PBKDF2-SHA256, 600 000 itérations minimum, paramètres versionnés dans l'en-tête du coffre. Argon2id reporté en V1.1. Mesurer le coût réel sur tablette / appareil cible. Ne pas présenter PBKDF2 comme équivalent à Argon2id.
- Format du coffre et de la sauvegarde à spécifier avant de coder : version du format, sel aléatoire unique par coffre, IV / nonce aléatoire unique par chiffrement, jamais réutilisé, authentification des paramètres KDF stockés (AAD). Tests de non-réutilisation d'IV.
- Chiffrement AES-GCM 256 avec WebCrypto, clé non extractable.
- Verrouillage au mieux : référence à la clé supprimée au verrouillage. JavaScript ne garantit pas l'effacement complet de la mémoire. Une clé non extractable reste utilisable par du code same-origin. Limiter le texte en clair en mémoire, pas de logs de données personnelles.
- Données personnelles chiffrées stockées dans IndexedDB.
- Chiffrement et déchiffrement réalisés côté client, sans serveur.

## 4. Verrouillage, Quick Exit, Mode Urgence — amendement v1.1 points D, Quick Exit

- Verrouillage par horodatage, pas par compteur. Après inactivité, sur visibilitychange (page masquée) et pagehide, en plus de l'inactivité. pagehide seul n'est pas fiable sur mobile, les timers sont throttlés en arrière-plan.
- Durée d'inactivité à trancher en spécifications, proposition : 2 minutes, à valider. Définir les opérations exclues du verrouillage (sélecteur de fichier, import / export, modale système) et le sort des brouillons non enregistrés. Tester sur Android réel.
- Quick Exit : dans le lot 1, lié au verrouillage. Verrouille le coffre, redirige avec location.replace.
- Quick Exit ne promet jamais d'effacer l'historique du navigateur.
- Mode Urgence précaché, accessible en un tap sans PIN, sans aucune donnée personnelle, contenu statique hors coffre.
- Le Mode Urgence n'est jamais bloqué par le Quick Exit.

## 5. Sauvegarde et perte de mot de passe — amendement v1.1 point E, perte

- Sauvegarde exportée chiffrée, avec le même mot de passe maître, nom de fichier neutre.
- Si le mot de passe est perdu, les données sont perdues ; l'interface le dit clairement. Tester la restauration d'une sauvegarde de bout en bout. Demander la persistance de stockage, en documentant qu'elle n'est pas garantie. Purge et quota IndexedDB / éviction PWA peuvent détruire le coffre.
- Aucune clé de récupération n'est incluse en V1 ; elle est reportée en V1.1/V2.
- La sauvegarde exportée doit rester protégée par le mot de passe maître et conservée hors de l'appareil.
- Import de sauvegarde, rattaché au lot fondations : validation stricte, bornes de taille, rejet des versions inconnues, des champs inconnus et des downgrades de paramètres KDF, validation de l'enveloppe avant déchiffrement puis du contenu après déchiffrement, sans fusion automatique, sans injection dans le DOM brut.

## 6. Ce que le web NE peut PAS garantir

- Pas de garantie contre la purge du stockage par le navigateur.
- Pas de minuteur fiable en arrière-plan.
- Pas de protection contre un appareil compromis.
- Pas de protection contre un logiciel espion.
- Pas de protection contre une personne qui regarde l'écran.
- Pas de protection contre un mot de passe faible.
- Pas de garantie d'effacement complet de l'historique, du cache ou des traces système après Quick Exit.
- Pas de garantie d'effacement complet de la mémoire en JavaScript, même avec une clé non extractable.
- Pas de garantie que Codespaces privé empêche toute exposition de port : vérifier la visibilité des ports avant chaque usage, ports privés uniquement, authentification GitHub requise. Codespaces n'est pas un environnement d'usage, jamais de données réelles.
- Aucune sécurité absolue ne peut être promise.

## 7. Menaces principales

- Accès physique à l'appareil déverrouillé.
- Appareil compromis, malware ou logiciel espion.
- Observation de l'écran par un tiers, y compris miniature dans le sélecteur d'applications récentes. Masquer l'écran en arrière-plan si faisable, sinon documenter la limite.
- Mot de passe faible, réutilisé ou partagé.
- Perte du mot de passe maître.
- Purge d'IndexedDB par le navigateur.
- Sauvegarde exportée mal protégée.
- Erreur humaine lors de l'usage ou de l'export.
- Dépendance aux limites du navigateur, de WebCrypto et de WASM.
- Traces résiduelles dans l'historique ou le système après Quick Exit.
- Risques mobile / tablette : clavier virtuel, orientation, zoom, bouton retour Android, bfcache.

## 8. Règles de code et dépendances — amendement v1.1

- CSP stricte, appliquée par en-têtes HTTP ; Vite utilise la même politique en développement et en prévisualisation. Le futur serveur de production devra appliquer cette politique exacte. [Correction de cohérence 2026-11-19 — amendement n° 11 : alignement sur `vite.config.ts` et les tests d'en-têtes.]
- Lint interdisant innerHTML, dangerouslySetInnerHTML, insertAdjacentHTML, outerHTML, document.write, eval et new Function. Preact échappe par défaut mais ne rend pas l'UI sûre à lui seul. Revue du contenu importé.
- Versions figées, lockfile, npm ci, Dependabot, npm audit, aucun script ou CDN tiers, liste figée des dépendances : Vite, Preact, ESLint.
- Service worker écrit à la main, sans Workbox. Auditer le contenu précaché, désactiver les source maps en prod, définir la mise à jour du service worker. [Correction de cohérence 2026-11-19 — amendement n° 3 : Workbox retiré ; service worker écrit à la main, sans Workbox.]
- Accessibilité : HTML sémantique, focus, clavier, contraste, cibles tactiles, zoom, prefers-reduced-motion, test lecteur d'écran.

## 9. Validation requise

- Relecture par un humain expert en sécurité et en cryptographie, avant commercialisation. [Décision Master 2026-11-19 — revue du dossier (amendement n° 9).]
- Tests dédiés : chiffrement, dérivation de clé, verrouillage, Quick Exit, Mode Urgence, sauvegarde chiffrée, import, perte de mot de passe, comportement hors-ligne, compatibilité navigateurs, tests Android réel.
- Inscription des validations dans le registre de validation.
- Sans cette relecture et ces tests, l'architecture ne doit pas être présentée comme sécurisée.
- Ce document décrit une architecture visée ; il ne constitue pas une certification de sécurité.

---

# PARTIE B — Ajouts Copilot (consolidation du 2026-11-18)

> ✅ **Sections 10 à 12 VALIDÉES PAR MASTER le 2026-11-19** : sections ajoutées lors de la consolidation du 2026-11-18, rédigées d'après les principes du dossier ; validées par Master telles que rédigées, elles font désormais partie du texte validé.

Les sections 10, 11 et 12 ci-dessous ne modifient rien au texte validé de la Partie A. Elles appliquent à l'architecture de sécurité du produit les principes de la Charte de l'Équipe IA (doc 05), l'Architecture de l'Équipe IA (doc 06) et l'Annexe A5. Validées par Master le 2026-11-19 (revue du dossier).

## 10. Séparation des données (produit / équipe IA)

### 10.1 Trois mondes séparés

| Monde | Contenu | Qui y accède |
|---|---|---|
| **Application KNuit** | Données réelles de l'utilisateur, coffre local chiffré, sur son appareil | L'utilisateur seul, dans l'application |
| **Équipe IA** | Code, documents, données fictives de test | Les agents IA, sous les règles de la charte (doc 05) |
| **GitHub / Codespaces** | Code et documentation du projet | L'équipe IA et Master, dépôt privé |

Ces trois mondes ne se mélangent jamais. Aucune donnée de l'application ne transite par l'équipe IA. Aucune donnée de l'équipe IA ne contient de donnée réelle.

### 10.2 Règles concrètes

- L'équipe IA ne lit jamais le contenu du coffre, ne demande jamais à y accéder, et refuse toute proposition de l'y faire accéder.
- Les captures d'écran, journaux ou exports provenant de l'application réelle ne sont jamais versés dans l'environnement IA sans validation explicite de Master — et même alors, uniquement après suppression de toute donnée personnelle.
- Les bases de données de test de l'équipe IA sont créées à partir de données fictives, manifestement fausses et marquées comme telles (doc 05, section 12.3).
- **Desktop = équipe IA, pas l'application.** L'environnement de bureau où travaille l'équipe IA n'est pas l'application KNuit et ne contient aucune donnée d'usage réel.
- La base PostgreSQL de l'équipe IA ne contient que des données de projet et des données fictives de test. Elle ne contient jamais de données utilisateur réelles, de données de pratique réelles, d'informations personnelles, de données médicales réelles ni de contenu du coffre.
- Les environnements de développement et de vérification distants (Codespaces) sont soumis aux mêmes règles que Desktop : aucune donnée interdite, aucun secret, aucun push sans « Pousse ». Codespaces n'est pas un environnement d'usage, jamais de données réelles (voir Partie A, section 6).
- Aucun compte, aucune connexion, aucune synchronisation dans l'application : l'équipe IA ne conçoit, ne teste et ne propose rien qui suppose un compte ou une synchro.

### 10.3 Données interdites — rappel

Les données suivantes sont interdites partout dans l'environnement de l'équipe IA — GitHub, Codespaces, la base PostgreSQL de l'équipe IA, Ollama, et tous les modèles externes (doc 05, section 12) :

- données utilisateur réelles ;
- données de pratique réelles ;
- informations personnelles ;
- données médicales réelles ;
- contenu du coffre.

Si une donnée ressemble à une donnée réelle, on la traite comme une donnée réelle — donc interdite. En cas de doute, on ne l'utilise pas et on escalade vers Master.

### 10.4 Vérification

Avant chaque push et avant chaque présentation de livrable, Muse vérifie que le contenu ne comporte aucune donnée interdite et respecte la séparation des données. Cette vérification fait partie de la définition de prêt (doc 05, section 11).

En cas d'exposition accidentelle d'une donnée interdite dans l'environnement IA : STOP immédiat du travail concerné, suppression de la donnée, signalement à Master avec les faits, sans copie, sans transfert, sans analyse de cette donnée.

## 11. IA externes et modèles

### 11.1 Principe

Les modèles externes ne reçoivent jamais de donnée interdite (section 10.3) ni de secret. Les prompts adressés à un modèle externe sont relus par Muse avant envoi. La réponse d'un modèle externe est traitée comme une **recommandation** (rang 5 des sources de vérité), jamais comme une preuve.

### 11.2 Modèles locaux

- Les modèles locaux (Rôle A = Qwen2.5-Coder 7B, Rôle B = DeepSeek-R1 8B) tournent via Ollama sur la machine de l'équipe IA.
- Contrainte matérielle : 8 Go de VRAM — les deux modèles 7-8B ne peuvent pas être chargés en même temps ; ils sont chargés séquentiellement, un seul modèle en mémoire à la fois.
- Aucune donnée interdite n'est jamais envoyée à Ollama ni à aucun modèle local.
- Les journaux et caches Ollama sont purgés de toute donnée sensible et couverts par les sauvegardes de l'équipe IA (section 12).

### 11.3 Modèles externes

- Quand un modèle externe est utilisé (par exemple comme Arbiter tiers), le prompt est relu par Muse avant envoi et ne contient ni donnée interdite ni secret.
- L'usage d'un modèle externe pour une tâche est signalé à Master dans la synthèse du livrable concerné.
- L'Arbiter, qu'il soit Muse ou un modèle tiers indépendant, n'est jamais l'un des auteurs du travail qu'il arbitre (doc 05, section 6).
- Sans signaux exécutables, l'Arbiter interprète les tests et les mesures ; il ne tranche pas sur des opinions. Un désaccord sans preuve disponible n'est pas arbitrable par l'IA : il est escaladé vers Master.

### 11.4 Secrets

Aucun secret n'apparaît jamais dans Git, dans GitHub, dans la documentation, ni dans les prompts (doc 05, section 14 ; doc 06, section 14).

Les secrets vivent uniquement dans les variables d'environnement de l'environnement d'exécution concerné, ou dans un gestionnaire de secrets approuvé par Master. Le gestionnaire de secrets approuvé reste à désigner par Master.

Un agent qui reçoit un secret par erreur ne le répète pas, ne le consigne pas, ne le transmet pas : il signale l'incident à Muse, qui le signale à Master et organise la révocation et le remplacement du secret exposé.

Les clés de chiffrement du coffre local relèvent de l'application elle-même, sur l'appareil de l'utilisateur. L'équipe IA ne manipule jamais ces clés, ne les demande jamais et ne les stocke jamais. Toute question sur ces clés est escaladée vers Master.

### 11.5 Accès distant

- Accès distant uniquement via Tailscale, obligatoire pour l'accès distant (à installer après validation des documents par Master).
- Aucun service de l'équipe IA n'est exposé sur l'internet public en V1. Aucun port n'est ouvert sur la box / le routeur pour l'équipe IA en V1.
- OpenWebUI doit être accessible via l'IP Tailscale. Il ne doit pas être limité à `127.0.0.1`, sinon la tablette est bloquée.
- Vérifier la visibilité des ports avant chaque usage de Codespaces : ports privés uniquement, authentification GitHub requise (voir Partie A, section 6).

## 12. Sauvegardes et continuité de l'équipe IA

### 12.1 Politique

- **Sauvegardes quotidiennes** de l'ensemble de l'environnement de l'équipe IA.
- **Rétention : 30 jours.** Au-delà, les sauvegardes les plus anciennes sont supprimées.
- Une sauvegarde non testée est une sauvegarde qui n'existe pas : la procédure de restauration est documentée et testée au moins à chaque changement de phase.

### 12.2 Ce qui est sauvegardé

| Contenu | Fréquence | Rétention |
|---|---|---|
| Dépôt Git (code + documentation) | Quotidienne (+ à chaque push validé) | 30 jours |
| Base PostgreSQL de l'équipe IA | Quotidienne | 30 jours |
| Documents validés | Quotidienne | 30 jours |
| Mémoire du projet (décisions, historique) | Quotidienne | 30 jours |
| Configurations de l'environnement (Ollama, outils) | Quotidienne | 30 jours |

### 12.3 Ce qui n'est jamais sauvegardé

- Aucune donnée interdite (section 10.3) : il n'y en a pas dans l'environnement IA ; si une telle donnée y était découverte, elle serait supprimée, pas sauvegardée.
- Aucun secret (section 11.4).
- Aucune donnée réelle d'utilisateur.

### 12.4 Restauration

- En cas de perte de données, Muse signale l'incident à Master avec les faits et le plan de reprise, avant toute restauration.
- Un test de restauration réussi est consigné dans la mémoire du projet, avec sa date et son résultat.
- Le support et l'emplacement exact des sauvegardes quotidiennes, la procédure de restauration testée et le responsable de la vérification des sauvegardes restent **à décider par Master** (voir Annexe A5, section 9.3) — ils ne sont pas inventés ici.

### 12.5 Continuité

- Le projet ne dépend d'aucun modèle d'IA en particulier. Si un modèle devenait indisponible, un autre prend le rôle, selon la même charte, les mêmes règles et les mêmes preuves.
- Ce qui fait la continuité du projet, ce n'est pas un modèle : c'est **GitHub (dépôt privé) et les documents validés**.
- La machine hôte de l'équipe IA est allumée 24/7 : si elle s'éteint ou tombe en panne, l'équipe IA locale est indisponible jusqu'au redémarrage. Le dépôt GitHub privé est la copie de référence du code et de la documentation versionnée : tant que les pushes sont faits (sur « Pousse » de Master), le travail n'est pas perdu avec la machine.
- Un nouvel agent qui rejoint l'équipe doit, avant de produire quoi que ce soit, lire la charte (doc 05), l'architecture de l'équipe IA (doc 06) et les documents validés en vigueur.
- Si Master est indisponible, l'équipe IA ne prend aucune décision à sa place. Elle peut préparer des dossiers, avancer des travaux déjà approuvés dans leur périmètre approuvé, et documenter l'état d'avancement — mais elle ne tranche rien, n'étend aucun périmètre et ne pousse rien.

---

## Écarts — état après amendement n° 3

L'écart Workbox (sections 1 et 8 de la Partie A) a été tranché par l'amendement n° 3 du 2026-11-19 : Workbox est retiré ; le service worker est écrit à la main, sans Workbox. Aucun autre écart n'est constaté.

[Correction de cohérence 2026-11-19 — amendement n° 3 : Workbox retiré ; service worker écrit à la main, sans Workbox.]

---

*Fin de l'Architecture de sécurité v1.0 — Kink de Nuit — Option A validée, amendement v1.1 du 2026-11-17 — Statut : Version 1.0 ; Partie A validée définitivement par Master le 2026-11-16, amendement v1.1 validé le 2026-11-17 ; Partie B validée par Master le 2026-11-19.*
