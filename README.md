🇫🇷 RIC - Référendum d'Initiative Citoyenne 🗳️
Une application pour une démocratie directe et transparente
Bienvenue sur le dépôt GitHub du projet RIC, une application ambitieuse visant à renforcer la participation citoyenne en France (et potentiellement au-delà) en permettant à chaque citoyen de proposer et de voter sur des référendums. Inspirée par l'esprit d'initiative citoyenne, cette plateforme est conçue pour être un outil de démocratie directe, garantissant intégrité et transparence.

✨ Vision du Projet
Notre vision est de démocratiser l'initiative législative en offrant une plateforme numérique où chaque citoyen peut soumettre une proposition de référendum (question binaire) et exercer son droit de vote. L'objectif est de créer un canal de participation citoyenne direct, complémentaire aux institutions existantes, en respectant les principes fondamentaux de la séparation des pouvoirs.

🎯 Objectifs Clés
Participation Citoyenne : Permettre à tout citoyen inscrit de soumettre une proposition de référendum et d'y voter.

Transparence & Intégrité : Garantir un processus de vote sécurisé, unique et auditable, tout en préservant l'anonymat du votant.

Séparation des Pouvoirs : Implémenter les principes du pouvoir juridique (initiative), législatif (vote), et exécutif (administration/tirage au sort) au sein de l'architecture applicative.

Accessibilité : Proposer une interface utilisateur intuitive et une expérience de vote simplifiée (par clic sur Internet).

Suivi & Classification : Offrir la possibilité de classer les référendums par niveau de scrutin (local, régional, national, global) et de suivre les résultats en temps réel ou après clôture.

🔑 Fonctionnalités Principales
1. Protocole de Vote Robuste & Séparation des Pouvoirs 🔒
Pouvoir Juridique (L'Initiative) :

Chaque citoyen inscrit pourra soumettre une question binaire (Oui/Non) pour un référendum, avec un titre, une description et la possibilité d'ajouter des pièces jointes.

Définition du niveau de scrutin (local, régional, national, global) et d'une date butoir pour le vote.

Un mécanisme de validation des initiatives sera mis en place (ex: seuil de soutiens ou validation par modération).

Pouvoir Législatif (Le Vote) :

Vote unique par citoyen et par référendum : C'est notre priorité absolue !

Identification forte : Utilisation de protocoles d'identification sécurisés (potentiellement via FranceConnect ou un système KYC rigoureux) pour garantir "un homme, une voix".

Bulletin secret & cryptographie : Le vote sera chiffré pour préserver l'anonymat du choix, tout en permettant au système de vérifier l'unicité du votant. Des techniques avancées (Zero-Knowledge Proofs, vote homomorphe) sont envisagées pour l'avenir.

Modalités : Priorité au vote par clic sur Internet pour la première version de l'application.

Pouvoir Exécutif (Administration & Décision) :

Gestion des utilisateurs : Inscription, authentification sécurisée, profils et rôles (citoyen, administrateur).

Modération : Un système de modération des propositions sera mis en place pour assurer le respect des règles et des lois.

"Tirage au Sort" : L'idée unique de "prise de décision par le hasard parmi la liste des personnes inscrites" sera affinée pour désigner, par exemple, un groupe de citoyens tirés au sort pour le suivi ou l'implémentation des décisions issues des référendums, en complément du résultat majoritaire du vote.

2. Classification des Résultats & Niveaux de Scrutin 📊
Date Butoir : Chaque référendum aura une date de début et de fin de vote claire.

Suivi des Votants : Affichage en temps réel du nombre de participants.

Résultats : Affichage clair des pourcentages "Oui" / "Non" une fois le référendum clôturé.

Niveaux de Scrutin : Possibilité de filtrer et de catégoriser les référendums et leurs résultats selon des portées local, régional, national ou global.

🎨 Charte Graphique : "Jaune & Orange pour une Démocratie Engagée"
Notre design visera un équilibre entre professionnalisme et dynamisme, en intégrant les couleurs emblématiques de l'initiative citoyenne :

Couleurs Principales : Jaune vif / Or (énergie, action) et Orange profond (communauté, engagement).

Couleurs Secondaires : Bleu marine / Gris foncé (professionnalisme, lisibilité du texte) et Blanc / Gris clair (clarté, aération de l'interface).

Typographie : Polices sans empattement modernes et lisibles (ex: Montserrat, Inter) pour un rendu clair et impactant.

Style : Design plat ou semi-plat avec des cartes bien définies et des espaces généreux pour une navigation intuitive.

⚙️ Structure Technique Préliminaire
Le projet est basé sur Electron, permettant une application multiplateforme.
```
<pre>
<code>
.
├── build
│   ├── database.json          # Fichier de base de données (pour dev initial)
│   └── index.html
├── data
├── Makefile
├── models                     # Modèles de données (ORM si utilisé)
├── package.json
├── public
│   ├── index.html
│   └── pages                  # Pages statiques HTML/CSS/JS
├── readme.md
├── sereur.js                  # Cœur du serveur (backend Electron)
└── src
    ├── groq-utils.js          # Utilitaires pour interaction avec LLM (si IA utilisée)
    ├── heavy.js               # Logiques lourdes / calculs complexes
    ├── ia.js                  # Fonctions liées à l'IA (modération, assistance)
    ├── main.js                # Processus principal Electron
    ├── Menu.js                # Gestion du menu de l'application
    └── preload.js             # Script de préchargement Electron
</code>
</pre>
Base de Données (Structure Proposée) 🗄️
Nous utiliserons une base de données NoSQL (database.json initialement, potentiellement une solution plus robuste par la suite) avec des collections clés :

users : Contient les identifiants réels des citoyens (id, email, nom, adresse, statut de vérification) ainsi qu'un anonymized_id généré cryptographiquement. C'est la liste des inscrits pour l'aspect "exécutif".

referendums : Stocke les détails de chaque proposition (titre, question, initiateur, dates, statut, niveau de scrutin).

votes : Enregistre le voter_anonymized_id (pour l'unicité) et le vote_encrypted_payload (le choix chiffré). C'est cette collection qui garantit l'anonymat du vote et l'unicité.

results : Contient les résultats agrégés des référendums clôturés (nombre de "Oui", "Non", participation).

Requêtes Serveur (API REST) 🚀
Notre sereur.js exposera une API REST pour gérer les interactions :

/api/users : Inscription, connexion, gestion du profil utilisateur.

/api/referendums : Soumission, consultation et gestion des propositions de référendum.

/api/votes : Enregistrement des votes (avec vérification d'unicité via anonymized_id et chiffrement).

/api/results : Consultation des résultats finaux des référendums clôturés.

🚧 Prochaines Étapes
Maintenant que la vision et la structure sont claires, nous allons pouvoir nous concentrer sur :

Mise en place de l'authentification forte : Implémentation du système d'identification unique (ex: FranceConnect ou KYC).

Détail du protocole de chiffrement du vote : Choisir et implémenter les techniques cryptographiques pour le bulletin secret.

Développement des modèles de base de données : Traduire la structure définie en code.

Développement des endpoints API : Coder les requêtes serveur pour chaque fonctionnalité.

Conception et développement de l'interface utilisateur (UI/UX) : Transposer la charte graphique en écrans fonctionnels.

Nous sommes très enthousiastes à l'idée de bâtir cette application RIC pour une démocratie plus participative ! Restez connectés pour les mises à jour sur notre progression.