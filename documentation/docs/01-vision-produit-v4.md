# Document de vision produit — Version 4

- **Version :** 4.0
- **Date :** 2026-11-16
- **Statut :** Version 1.0 — document vivant
- **Source :** `workspace/user/files/01___Vision_Produit_V4_1_jach.docx`
- **Auteur :** Master

Nov 16, 2026 · Master

Les fonctions décrites ici sont celles du produit complet ; le phasage V1 / V1.1 / V2 est fixé par le doc 02 (Périmètre MVP).

## Synthèse et changements depuis la V3

La V4 garde les cinq portes de la V3, rend le Mode Duo réalisable en trois modes, aligne chaque promesse sur ce que le web permet vraiment, et fixe un ordre de livraison par phases.

| **Domaine** | **V3** | **V4** |
| --- | --- | --- |
| Mode Duo | Relais aveugle ou échange local, commit-reveal | Trois modes : Passer l'appareil (premier mode du Mode Duo, en V2 — pas en V1), Chacun son appareil (code d'appairage), Partager mon profil (optionnel). Clés libérées « tout ou rien », inventaire daté et verrouillé par session |
| Quick Exit | Vide la session, nettoie l'historique | Verrouille le coffre chiffré, redirige sans entrée d'historique, ne promet pas d'effacer l'historique du navigateur, ne bloque jamais l'écran d'urgence |
| Dynamique | Contrats négociables, renégociation obligatoire | Clause de retrait unilatéral non supprimable, avertissement doux sur les signaux de contrôle coercitif |
| Message de vie | Message prêt à envoyer au contact | Fiche pour le contact, avertissement fort sur les pratiques à ne jamais faire seul |
| Ça s'est mal passé | Espace d'accueil et ressources | Mode « ne rien enregistrer » par défaut, descriptions factuelles plutôt qu'étiquettes, route de crise, journal chiffré optionnel |
| Sauvegardes | Exports chiffrés | Avertissement sur la perte de phrase de passe ; mode de récupération reporté en V1.1/V2 (aucune clé de récupération en V1) |
| Paiement | Achat unique, dons, licences | Libellé bancaire neutre, clé de licence ou paiement anonyme |
| Juridique | Vérification d'âge « neutre » | Avis juridique par juridiction, aucune journalisation d'IP au relais |
| Mesure | Non traitée | Feedback volontaire, tests utilisateurs, compteurs locaux partagés sur demande |
| Livraison | Non traitée | Cinq phases avec critères de passage |

> [Correction de cohérence 2026-11-19 — amendement n° 3 : le mode de récupération est reporté en V1.1/V2 ; aucune clé de récupération n'existe en V1 (voir doc 03 §5).]

> [Correction de cohérence 2026-11-19 — amendement n° 3 : « Passer l'appareil » est le premier mode du Mode Duo, en V2 — pas en V1.]

## Philosophie, positionnement et modèle économique

L'application est un outil de référence fiable, transparent, versionné et « kink-aware » : aucune censure morale, mais un duty of care strict et une prévention des risques intégrée à chaque étape.

- **Adultes consentants, sans tabou** : toutes les pratiques sont traitées avec nuance et précision technique, dans un langage inclusif (non hétéronormé, accessible aux personnes neurodivergentes ou en situation de handicap).
- **Le consentement est un processus, pas un document** : le résumé de scène ou de dynamique est un outil de communication. Il n'est ni une preuve juridique ni une décharge, et le consentement reste révocable à tout moment.
- **Zéro image explicite** : uniquement des schémas et des illustrations stylisées. Cela réduit les risques liés aux hébergeurs, aux app stores et aux processeurs de paiement, et rend l'usage plus discret.
- **Modèle économique compatible avec le local-first** : achat unique, dons ou licences associatives et communautaires. Aucune monétisation des données.
- **Paiement discret** : libellé bancaire neutre, achat par clé de licence ou paiement anonyme, pour qu'un relevé de compte ne révèle pas l'application.
- **Du débutant au pratiquant expérimenté** : niveau choisi par pratique, jamais bloquant.

## Portes A et B : Je découvre, Je prépare une scène

L'écran d'accueil trie par intention et oriente vers cinq espaces qui partagent un modèle de données unique : une fiche lue s'importe d'un clic dans l'Atelier, sans perte.

**A. « Je découvre » : le Hub encyclopédique**

- Typologies de Dom/Sub, fiches de pratiques, matériel, erreurs fréquentes, psychologie des dynamiques.
- Recherche globale intégrant l'argot et les synonymes, glossaire contextuel.
- Sélecteur de niveau par compétence : Vue Débutant (vocabulaire expliqué, pas à pas, simulations pour apprendre à dire « non ») ou Vue Avancée (variantes, protocoles, dépannage). Il n'est jamais bloquant.
- **Inventaire personnel** : un espace solo pour explorer ses propres limites (Oui / Curieux / Peut-être / Non) avant toute négociation. Il alimente ensuite le Mode Duo.
- **Objet « Dynamique » durable**, distinct de la scène ponctuelle : règles, rituels, protocoles du quotidien, fréquence de renégociation et protocole de sortie de relation. Une clause de retrait unilatéral figure dans tout contrat et ne peut pas être supprimée. L'éditeur signale sans bloquer les traits de contrôle coercitif : isolement, contrôle financier, interdiction de consulter un médecin, suppression du safeword.
- **Niveaux de preuve** : chaque règle indique sa source, consensus communautaire ou littérature médicale.

**B. « Je prépare une scène » : l'Atelier**

- Blocs : Intention et rôles, Pratiques et intensité, Cadre et matériel, Sécurité et signaux, Déroulement et aftercare. Templates de départ : Découverte, Impact léger, Sensoriel, Psychologique, Protocole avancé.
- Suggestions cliquables modifiables, toujours accompagnées de « Aucune de ces réponses », « Je ne sais pas encore », « Pas maintenant » et de la saisie libre.
- Le plan est un support, pas un script : il prévoit explicitement le changement d'avis en cours de scène, les scènes spontanées et à plus de deux personnes.
- **Boucle complète** : négociation, scène, debrief à 24-72 h pour le top et le bottom, mise à jour des limites dans le carnet de bord (par exemple passer une pratique de « Curieux » à « Non »). Le debrief est individuel et privé, partagé seulement si la personne le souhaite.
- **Rappels sans push** : invitation au prochain lancement de l'app, plus un export calendrier (.ics) au titre neutre, contrôlé par l'utilisateur.
- Les limites ont une date de validité et appellent une revalidation.

## Porte C : Mode Duo et négociation

Le Mode Duo offre trois modes selon le niveau de confiance et d'équipement. Un code court ne peut pas porter des réponses de façon privée, parce que l'univers de réponses est petit et se retrouve par force brute : le code sert donc à relier deux appareils, pas à transporter des données.

| **Mode** | **Principe** | **Quand l'utiliser** | **Limite à assumer** |
| --- | --- | --- | --- |
| Passer l'appareil (premier mode du Mode Duo, en V2 — pas en V1) | Un seul appareil. Le premier répond, l'écran de passage reste neutre, le second répond, puis l'intersection s'affiche pour les deux | Couple qui se fait confiance, aucun réseau requis | Le second répond sous le regard possible de l'autre. Rappel : répondre seul, écran tourné |
| Chacun son appareil | Chaque personne répond sur le sien. Un code d'appairage court sert de secret de connexion (protocole de type PAKE) via le relais aveugle chiffré de bout en bout | Dynamique asymétrique, distance, plus de confidentialité | Nécessite le relais aveugle, plus complexe à livrer |
| Partager mon profil (optionnel) | Le conjoint exporte seulement ses Oui et Curieux, chiffrés par une phrase de passe donnée de vive voix. Aucun Non n'y figure | Partage volontaire d'un profil, hors négociation stricte | Le premier voit ces envies même non réciproques : à présenter comme un partage, pas comme une négociation |

**Règles communes à tous les modes**

- **Intersection stricte** : seuls les Oui et Curieux communs sont révélés, au niveau minimum commun. Les Non ne laissent aucune trace. Le Peut-être n'est visible que s'il est mutuel, sous l'étiquette « À discuter ».
- **Indiscernabilité** : l'écran ne distingue jamais une intersection vide d'un « rien à montrer ».
- **Commit-reveal tout ou rien** (mode Chacun son appareil) : chaque partenaire verrouille son choix, puis le relais ne libère les clés que lorsque les deux ouvertures sont arrivées. Celui qui révèle en second ne peut pas abandonner après avoir vu l'autre.
- **Contre le sondage répété** : une session utilise un inventaire daté et verrouillé. Le partenaire voit « inventaire modifié N fois depuis le jour X », sans contenu.
- **Passer l'appareil** : les réponses du second ne sont jamais enregistrées. Elles sont calculées en mémoire puis effacées. La session invité n'alimente pas l'inventaire personnel du propriétaire. Chaque question propose « Je ne souhaite pas répondre ».
- **Plus de deux personnes** : l'intersection s'applique à l'ensemble des participants.
- **Dynamique asymétrique ou abusive** : un rappel discret en début de session recommande le mode Chacun son appareil, car répondre sur l'appareil de l'autre est le scénario le plus risqué (surveillance, logiciels espions).

## Porte D : Pratique solo, sécurité et urgence

Les pratiques solitaires sont les plus accidentogènes : l'application les traite avec des guides de prévention et un dispositif de sécurité honnête sur ses limites.

- **Guides de prévention solo** (auto-bondage notamment). Pour les pratiques qui ne doivent jamais se faire seul, comme la restriction respiratoire, un avertissement fort remplace tout guide technique.
- **Message de vie, sans minuteur fantôme** : une PWA ne peut pas faire tourner un minuteur en arrière-plan sur iOS, ni envoyer de SMS, et le push est exclu. L'application génère donc avant la session un message neutre à confier à un contact de confiance hors application (par exemple : « Si tu n'as pas de nouvelles de moi avant 22 h, appelle-moi »). Le libellé n'a pas à révéler la nature de la pratique.
- **Fiche pour le contact** : lieu, durée prévue, quoi faire sans réponse, quoi dire aux urgences. L'application n'annonce jamais plus que ce que le dispositif garantit : un contact peut mettre du temps à réagir.
- **Mode Urgence hors-ligne** : premiers secours immédiats (coupe-cordes, sidération ou dissociation, signes de détresse physique, appel aux secours et quoi dire aux urgentistes). Contenu précaché pour fonctionner sans réseau.
- **Accessible en un tap, sans PIN**, depuis tout écran. Il ne dépend pas du verrouillage du coffre et n'est jamais effacé par le Quick Exit.
- **Localisation** : numéros d'urgence et cadre légal adaptés à la région de l'utilisateur.

## Porte E : « Ça s'est mal passé »

Cet espace accueille une limite franchie, un doute sur une dynamique abusive ou un subdrop prolongé. Il s'inspire d'une conception trauma-informed : la personne garde la main à chaque étape.

- **Mode « ne rien enregistrer » par défaut** : rien n'est stocké tant que la personne ne le décide pas. Un journal chiffré qu'elle contrôle seule est proposé en option, par exemple pour garder une trace.
- **Parcours court et interruptible** : on peut s'arrêter ou quitter à tout moment, sans questionnaire linéaire imposé.
- **Des faits, pas des étiquettes** : l'application aide à décrire ce qui s'est passé avec des mots concrets, sans prononcer elle-même le mot « abus » ni poser de diagnostic.
- **Outils d'auto-évaluation** et liens discrets vers des ressources locales et des associations d'aide aux victimes.
- **Route de crise** : si la personne exprime des idées suicidaires ou une détresse aiguë, l'application oriente immédiatement vers les services d'aide adaptés à sa région.
- **Accès discret** : accessible depuis l'écran d'accueil sans libellé explicite, compatible avec le mode discret et le PIN de contrainte.

## Moteur de risque et Radar de Vigilance

Le Radar remplace les pavés d'avertissements génériques par une analyse contextuelle en trois couches, qui évite la fatigue d'alertes.

1. **Badge discret** sur les pratiques sélectionnées.
2. **Panneau détaillé à la demande**, avec une taxonomie claire : risques physiques et anatomiques, émotionnels, relationnels, matériels, et contre-indications.
3. **Analyse des combinaisons et plan de sécurité** : le moteur détecte les cumuls de facteurs (par exemple cordes, fatigue ou substances altérant le consentement, isolement sans contact de confiance) et génère un plan opérationnel : check-ins verbaux et non verbaux, mots de sécurité, plan d'arrêt, matériel de secours, aftercare sur mesure.

**Principes**

- **Niveau de preuve visible** sur chaque règle : consensus communautaire ou littérature médicale. Une grande partie du savoir en BDSM relève du premier type, et l'application le dit.
- **Faux positifs préférés aux faux négatifs** : mieux vaut alerter par précaution que laisser passer un risque.
- **Consentement continu** : check-ins verbaux et non verbaux, gestion de la sidération, debrief à 24-72 h.
- **Capacité à consentir** : un module sur l'alcool et les substances.
- **Résumé exportable** : outil de communication et de prévention interne. Le texte rappelle que le consentement est révocable, qu'un document n'est ni une décharge légale ni une autorisation de violences graves, et qu'un export peut lui-même devenir un élément sensible.

## Confidentialité, ergonomie sensible et résilience technique

Aucune donnée intime ne quitte l'appareil de l'utilisateur sans chiffrement de bout en bout. Les promesses de l'interface correspondent à ce que le web peut réellement garantir.

- **Local-first, zéro-knowledge** : stockage local chiffré. On parle de « zéro-knowledge » plutôt que de « zéro-serveur », car le mode Chacun son appareil passe par un relais aveugle (chiffré de bout en bout, aucune conservation, aucune journalisation d'IP).
- **Sauvegardes chiffrées exportables** pour pallier la purge du stockage par certains navigateurs (Safari) ou la perte d'appareil. Si la phrase de passe est perdue, les données le sont aussi : l'interface le dit clairement. Aucun mode de récupération n'existe en V1 : il est reporté en V1.1/V2 (voir doc 03 §5). [Correction de cohérence 2026-11-19 — amendement n° 3 : aucun mode de récupération en V1, reporté en V1.1/V2 (voir doc 03 §5).]
- **Quick Exit permanent, sans PIN** : il verrouille le coffre chiffré, redirige vers un site neutre avec location.replace (le retour arrière ne revient pas), et ne promet jamais d'effacer l'historique du navigateur. Il n'efface pas un plan en cours et ne bloque pas l'écran d'urgence.
- **PIN de contrainte (optionnel)** : un code spécifique, saisi sous contrainte, ouvre un profil vide ou un écran neutre et protège les données réelles.
- **Discrétion** : nom et icône de PWA neutres, mode discret, zéro analytics ou traceur, aucune notification push, exports au nom de fichier neutre.
- **Accessibilité** : conception pour la neurodivergence et les handicaps, tests dédiés.

## Juridique, conformité et gouvernance éditoriale

Le cadre juridique dépend de la juridiction, et une partie des choix reste à valider par un avis juridique.

**Conformité**

- **RGPD, article 9** : les données de santé et de vie sexuelle relèvent d'une catégorie spéciale. Le local-first réduit l'exposition, mais les métadonnées du relais (adresse IP notamment) restent des données personnelles : elles ne sont pas journalisées.
- **Vérification d'âge** : aucun document d'identité n'est stocké. La méthode exacte reste à fixer avec un avis juridique, car aucune méthode n'est à la fois forte et privée. La politique « zéro image explicite » et la nature éducative du contenu sont à documenter dans cette analyse.
- **Cadre légal par pays** : le droit varie, notamment sur la portée du consentement face aux blessures. Le cadre applicable est affiché selon la région.
- **Paiement** : voir la section Philosophie. L'achat ne doit pas lier une identité à l'application de façon évidente.

**Gouvernance éditoriale**

- **Comités de relecture** : éducateurs kink-aware, sexologues et psychologues.
- **Versioning des fiches (traçabilité interne en V1 ; publication éventuelle seulement après validation d'architecture écrite)** et traçabilité des sources, avec la distinction entre consensus communautaire et littérature médicale. [Correction de cohérence 2026-11-19 — amendement n° 3 : « Versioning public » remplacé par « Versioning des fiches » — traçabilité interne en V1 ; publication éventuelle seulement après validation d'architecture écrite.]
- **Signalement d'erreur** intégré à chaque fiche.
- **Vieillissement du contenu** : un budget de mise à jour récurrent, financé par le modèle économique, est prévu dès le départ.

## Feuille de route

L'ordre de livraison commence par ce qui protège le plus (urgence, aide) et reporte la fonction la plus difficile, le Mode Duo, après trois validations externes.

[Reconstruction provisoire d'après le texte validé — l'original (image embarquée dans le .docx) reste à fournir par Master. Seul l'ordre des phases reprend le doc 02 §6 ; l'association des validations externes aux phases n'est pas établie. Ne pas utiliser ce tableau comme calendrier de validation avant vérification de l'original.]

| 0. Fondations | 1. Mode Urgence + « Ça s'est mal passé » | 2. Hub + inventaire | 3. Atelier + débrief | 4. Pratique solo |

Les phases se lisent de gauche à droite, sans échelle de temps. Chaque porte est une validation à passer avant commercialisation ; l'avis juridique est requis avant toute diffusion publique.

> [Note Rex (IA utilisée par Master via son téléphone), 2026-11-19 : le schéma de la feuille de route (5 phases, 3 portes) était embarqué dans le .docx et n'a pas pu être lu — à compléter depuis l'original. Vérification du PDF du même document le 2026-11-19 (01___Vision_Produit_V4_0_8e08.pdf, 7 pages) : contenu identique, le schéma y apparaît aussi seulement comme texte « [embedded content: feuille de route · 5 phases, 3 portes de passage] », sans image ni détail des phases. Le point reste ouvert.]

## Prochaines étapes et questions ouvertes

Avant toute commercialisation, trois validations externes sont nécessaires. [Décision Master 2026-11-19 — revue du dossier (amendement n° 9) : validation experte reportée à avant commercialisation.]

- [ ] **Relecture clinique et éducative** des fiches et des règles du moteur de risque par des éducateurs kink-aware et des sexologues ou psychologues.
- [ ] **Pre-mortem adversarial** : pour chaque fonction, imaginer comment un abuseur la détournerait (Mode Duo, Dynamique, journal, export), puis corriger.
- [ ] **Tests utilisateurs sous stress**, y compris avec des personnes neurodivergentes ou en situation de handicap, sur l'écran d'urgence et le parcours « Ça s'est mal passé ».
- [ ] **Avis juridique par juridiction** sur la vérification d'âge, le cadre du consentement et le statut du résumé exportable.
- [ ] **Mesurer sans pister** : feedback volontaire, tests utilisateurs, compteurs locaux partagés seulement sur demande.

**Questions ouvertes**

- Quelle méthode de vérification d'âge retenir pour la première juridiction visée ?
- Quelle phrase de passe ou méthode de récupération pour les sauvegardes, sans affaiblir le chiffrement ?
- Qui porte juridiquement le projet (structure, comité éditorial) et avec quel budget de mise à jour du contenu ?
