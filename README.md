# API REST de gestion des tâches

## 1. Présentation du projet

Ce projet consiste à développer une API REST de gestion des tâches à l'aide de Node.js, Express et PostgreSQL.

L'API permet aux utilisateurs de créer un compte, de se connecter et de gérer leurs tâches personnelles. L'accès aux routes de gestion des tâches est protégé par une authentification basée sur JSON Web Token (JWT).

## 2. Objectifs du projet

- Développer une API REST avec Express.
- Connecter une application Node.js à une base de données PostgreSQL.
- Permettre l'inscription et la connexion des utilisateurs.
- Sécuriser les mots de passe avec bcrypt.
- Mettre en place une authentification JWT.
- Réaliser les opérations CRUD sur les tâches.
- Tester les endpoints avec Postman.

## 3. Technologies utilisées

- **Node.js** : environnement d'exécution JavaScript.
- **Express.js** : framework pour créer les routes HTTP.
- **PostgreSQL** : système de gestion de base de données relationnelle.
- **node-postgres (pg)** : connexion à PostgreSQL.
- **bcrypt** : hachage et vérification des mots de passe.
- **jsonwebtoken** : génération et vérification des tokens JWT.
- **dotenv** : chargement des variables d'environnement.
- **Nodemon** : redémarrage automatique du serveur en développement.
- **Postman** : test des requêtes HTTP.

## 4. Installation du projet

### Prérequis

Installer Node.js, npm et PostgreSQL. Docker peut être utilisé pour exécuter PostgreSQL.

### Récupérer les dépendances

Depuis le dossier du projet, exécuter :

```bash
npm install
```

### Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRESQL
DB_NAME=api_gestion_taches

JWT_SECRET=VOTRE_CLE_SECRETE_ALEATOIRE
JWT_EXPIRES_IN=1h
```

Remplacer les valeurs d'exemple par les paramètres locaux. Ne jamais publier le fichier `.env` sur GitHub.

### Préparer la base de données

Créer une base de données nommée `api_gestion_taches`, puis créer les tables `users` et `tasks` conformément au schéma SQL du projet.

La table `tasks` contient une clé étrangère `user_id` qui référence la table `users`. La suppression d'un utilisateur peut entraîner la suppression de ses tâches si la contrainte `ON DELETE CASCADE` est définie.

## 5. Lancement du serveur

En développement :

```bash
npm run dev
```

Pour démarrer le serveur sans Nodemon :

```bash
npm start
```

Lorsque la connexion à PostgreSQL réussit, le serveur écoute sur :

`http://localhost:3000`

La route d'accueil est :

`GET http://localhost:3000/`

## 6. Structure du projet

```text
api-gestion-taches/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── tasks.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── tasks.routes.js
│   ├── app.js
│   └── server.js
├── sql/
│   └── schema.sql
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 7. Endpoints de l'API

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscrire un utilisateur |
| POST | `/api/auth/login` | Connecter un utilisateur |

### Gestion des tâches

Toutes les routes de gestion des tâches nécessitent un token JWT valide.

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Consulter ses tâches |
| POST | `/api/tasks` | Créer une tâche |
| PUT | `/api/tasks/:id` | Modifier une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |

## 8. Exemples de requêtes

### Inscription

Méthode : `POST`

URL : `http://localhost:3000/api/auth/register`

Corps JSON :

```json
{
  "name": "Utilisateur Test",
  "email": "utilisateur@example.com",
  "password": "MotDePasse123!"
}
```

### Connexion

Méthode : `POST`

URL : `http://localhost:3000/api/auth/login`

Corps JSON :

```json
{
  "email": "utilisateur@example.com",
  "password": "MotDePasse123!"
}
```

La réponse contient un token JWT à utiliser pour accéder aux routes protégées.

### Créer une tâche

Méthode : `POST`

URL : `http://localhost:3000/api/tasks`

Dans Postman, sélectionner **Authorization → Bearer Token**, puis coller le token obtenu lors de la connexion.

Corps JSON :

```json
{
  "title": "Terminer le projet API",
  "description": "Tester les endpoints avec Postman"
}
```

### Modifier une tâche

Méthode : `PUT`

URL : `http://localhost:3000/api/tasks/1`

Corps JSON :

```json
{
  "title": "Projet API terminé",
  "description": "Les tests sont terminés",
  "completed": true
}
```

### Supprimer une tâche

Méthode : `DELETE`

URL : `http://localhost:3000/api/tasks/1`

Ajouter également le token JWT dans l'onglet Authorization.

## 9. Sécurité

- Les mots de passe sont hachés avec bcrypt.
- Les routes de gestion des tâches sont protégées par un middleware JWT.
- Les requêtes SQL utilisent des paramètres pour limiter les risques d'injection SQL.
- Les tâches sont filtrées selon l'identifiant de l'utilisateur authentifié.
- Les variables sensibles doivent rester dans `.env`, exclu du dépôt Git.

## 10. Tests avec Postman

Les tests réalisés couvrent :

- L'inscription d'un nouvel utilisateur.
- Le refus d'une adresse e-mail déjà utilisée.
- La connexion avec des identifiants valides.
- Le refus d'un accès protégé sans token.
- La création et la consultation des tâches.
- La modification et la suppression des tâches.

Les résultats doivent être vérifiés dans Postman et documentés à l'aide de captures d'écran.

## 11. Auteur

Projet académique : API REST de gestion des tâches.

Technologies principales : Node.js, Express, PostgreSQL et JWT.
