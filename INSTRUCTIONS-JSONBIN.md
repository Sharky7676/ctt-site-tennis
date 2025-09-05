# Instructions de Configuration JSONBin.io

## 🎯 Objectif
Ce guide vous explique comment configurer votre site Sierre Tennis pour utiliser JSONBin.io comme système de sauvegarde cloud, permettant la synchronisation entre différents appareils (ordinateur et mobile).

## 📋 Prérequis
1. Un compte gratuit sur [jsonbin.io](https://jsonbin.io)
2. Une clé API JSONBin.io

## 🚀 Étapes de Configuration

### 1. Créer un compte JSONBin.io (GRATUIT)
1. Allez sur [https://jsonbin.io](https://jsonbin.io)
2. Cliquez sur "Create Account" (Créer un compte)
3. Inscrivez-vous avec votre email
4. Confirmez votre compte via l'email reçu

### 2. Obtenir votre clé API
1. Connectez-vous à votre compte JSONBin.io
2. Allez dans la section "API Keys" 
3. Copiez votre "Master Key" (clé principale)

### 3. Configurer le site
1. Ouvrez le fichier `src/jsonbin-storage.js`
2. Trouvez la ligne suivante :
   ```javascript
   API_KEY: 'YOUR_API_KEY_HERE',
   ```
3. Remplacez `YOUR_API_KEY_HERE` par votre clé API JSONBin.io :
   ```javascript
   API_KEY: '$2a$10$votre-cle-api-ici',
   ```

### 4. Utiliser le nouveau fichier HTML
1. Renommez `index.html` en `index-old.html` (sauvegarde)
2. Renommez `index-jsonbin.html` en `index.html`

## 🔧 Fonctionnement

### Synchronisation automatique
- Toutes les modifications sont automatiquement sauvegardées sur JSONBin.io
- Les données sont synchronisées entre tous les appareils
- Pas de sauvegarde locale, tout est dans le cloud

### Cache intelligent
- Les données sont mises en cache localement pendant 30 secondes
- Rechargement automatique depuis le serveur si nécessaire
- Fallback local en cas de problème réseau

### Sécurité
- Bin public pour faciliter l'accès multi-appareils
- Authentification admin pour les modifications sensibles
- Sauvegarde automatique des versions

## 🎮 Utilisation

### Premier démarrage
1. Ouvrez le site dans votre navigateur
2. Le système créera automatiquement un nouveau "bin" sur JSONBin.io
3. L'ID du bin sera affiché dans la console du navigateur
4. Notez cet ID pour référence

### Accès depuis d'autres appareils
1. Ouvrez le même site depuis n'importe quel appareil
2. Les données seront automatiquement synchronisées
3. Toutes les modifications sont visibles instantanément

### Administration
1. Cliquez sur "Administration" en bas de page
2. Utilisez les identifiants : `ADMIN` / `Kp7mN9qR3x`
3. Gérez les joueurs, matchs et paramètres
4. Toutes les modifications sont sauvegardées automatiquement

## 🔍 Vérification du Statut

### Console du navigateur
Ouvrez la console de votre navigateur (F12) pour voir :
- `✅ Configuration OK - Synchronisation active avec JSONBin.io`
- L'URL de votre bin JSONBin.io
- Les messages de synchronisation

### Messages d'erreur courants
- `⚠️ Configuration requise` : Clé API non configurée
- `❌ Erreur HTTP 401` : Clé API invalide
- `🔄 Utilisation des données par défaut` : Problème réseau, mode hors ligne

## 🆘 Dépannage

### La synchronisation ne fonctionne pas
1. Vérifiez que la clé API est correctement configurée
2. Vérifiez votre connexion internet
3. Consultez la console du navigateur pour les erreurs

### Données perdues
1. Les données sont automatiquement sauvegardées
2. En cas de problème, un backup local est créé
3. Contactez le support si nécessaire

### Réinitialisation
1. Allez dans Administration
2. Cliquez sur "Réinitialiser"
3. Confirmez pour restaurer les données par défaut

## 📊 Limites du Plan Gratuit JSONBin.io
- 10 000 requêtes par mois
- Bins illimités
- 1 MB par bin
- Parfait pour ce type d'application

## 🔗 Liens Utiles
- [JSONBin.io](https://jsonbin.io) - Service de stockage
- [Documentation API](https://jsonbin.io/api-reference) - Référence complète
- [Support JSONBin.io](https://jsonbin.io/contact) - Aide technique

## ✅ Checklist de Vérification
- [ ] Compte JSONBin.io créé
- [ ] Clé API obtenue et configurée
- [ ] Fichier `index-jsonbin.html` renommé en `index.html`
- [ ] Site testé et fonctionnel
- [ ] Synchronisation vérifiée entre appareils
- [ ] Administration accessible

---

**Note importante :** Gardez votre clé API secrète et ne la partagez pas publiquement.

