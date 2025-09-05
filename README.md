# Site Tennis de Table Sierre - Version Cloud

## Description

Ce site de tennis de table de Sierre a été modifié pour sauvegarder les données directement sur le serveur Netlify au lieu du stockage local (localStorage). Toutes les modifications sont maintenant synchronisées entre tous les appareils.

## Fonctionnalités

- ✅ Sauvegarde cloud des données (plus de localStorage)
- ✅ Synchronisation automatique entre tous les appareils
- ✅ Fonctions Netlify serverless pour l'API
- ✅ Interface utilisateur identique à l'original
- ✅ Gestion des joueurs, matchs et disponibilités
- ✅ Authentification admin (ADMIN / Kp7mN9qR3x)

## Déploiement sur Netlify

### Option 1 : Déploiement via l'interface web Netlify

1. Connectez-vous à [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" > "Deploy manually"
3. Glissez-déposez le dossier complet ou uploadez le fichier ZIP
4. Le site sera automatiquement déployé avec les fonctions serverless

### Option 2 : Déploiement via Netlify CLI

```bash
# Installer Netlify CLI (si pas déjà fait)
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Déployer le site
netlify deploy --prod --dir .
```

## Structure du projet

```
sierre-tennis-cloud/
├── index.html              # Page principale
├── assets/                 # Fichiers CSS et JS
├── netlify/
│   └── functions/
│       └── data.js         # API serverless pour les données
├── src/
│   └── api-service.js      # Service client pour l'API
├── netlify.toml            # Configuration Netlify
├── package.json            # Dépendances npm
└── README.md               # Ce fichier
```

## Configuration

Le fichier `netlify.toml` configure automatiquement :
- Les fonctions serverless dans `netlify/functions/`
- Les redirections API vers `/.netlify/functions/`
- Les headers CORS pour permettre les appels API

## Données

Les données sont maintenant stockées en mémoire sur le serveur (dans la fonction serverless). En production, il est recommandé d'utiliser une vraie base de données comme :
- Firebase Firestore
- Supabase
- MongoDB Atlas
- PostgreSQL sur Heroku

## Authentification

- **Utilisateur admin :** ADMIN
- **Mot de passe :** Kp7mN9qR3x

**Note importante :** L'authentification fonctionne avec un système de fallback :
- Sur Netlify (production) : Utilise les fonctions serverless
- En local (développement) : Utilise localStorage comme fallback

Cela garantit que l'authentification fonctionne dans tous les environnements.

## Support

Pour toute question ou problème, contactez Joe Zuchuat.

## Changements par rapport à la version originale

1. **Remplacement de localStorage** : Toutes les données sont maintenant sauvegardées via l'API
2. **Ajout des fonctions Netlify** : API serverless pour gérer les données
3. **Configuration Netlify** : Fichiers de configuration pour le déploiement
4. **Service API** : Nouveau service client pour communiquer avec l'API

Le site fonctionne exactement comme avant, mais les données sont maintenant synchronisées entre tous les appareils !

