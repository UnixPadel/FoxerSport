# Documentation de l'API FoxerSport - Nouveaux Endpoints

Ce document répertorie les nouveaux endpoints ajoutés au backend lors de l'intégration des fonctionnalités de l'ancienne base de données OpenCart.

---

## 1. Newsletter
**Préfixe de route** : `/api/newsletter`

### S'abonner à la newsletter
- **URL** : `/subscribe`
- **Méthode** : `POST`
- **Accès** : Public
- **Body** :
  ```json
  {
    "email": "client@example.com"
  }
  ```
- **Réponses** :
  - `201 Created` : Inscription réussie.
  - `200 OK` : Abonnement réactivé avec succès (si l'utilisateur s'était désabonné).
  - `400 Bad Request` : Email invalide ou déjà abonné.

### Se désabonner de la newsletter
- **URL** : `/unsubscribe`
- **Méthode** : `POST`
- **Accès** : Public
- **Body** :
  ```json
  {
    "email": "client@example.com"
  }
  ```
- **Réponse** :
  - `200 OK` : Désabonnement réussi.

---

## 2. Fabricants / Marques
**Préfixe de route** : `/api/manufacturers`

### Lister tous les fabricants
- **URL** : `/`
- **Méthode** : `GET`
- **Accès** : Public
- **Réponse** :
  - `200 OK` : Retourne la liste des fabricants triés par `sortOrder`.

### Récupérer un fabricant spécifique
- **URL** : `/:slug`
- **Méthode** : `GET`
- **Accès** : Public
- **Réponses** :
  - `200 OK` : Retourne le fabricant.
  - `404 Not Found` : Marque non trouvée.

---

## 3. Blog et Commentaires
**Préfixe de route** : `/api/blogs`

Les endpoints existants (`GET /api/blogs` et `GET /api/blogs/:slug`) retournent dorénavant la liste des **commentaires approuvés** inclus dans le détail de l'article.

### Ajouter un commentaire à un article
- **URL** : `/:slug/comments`
- **Méthode** : `POST`
- **Accès** : Public (ou Utilisateur Connecté)
- **Body (Invité)** :
  ```json
  {
    "guestName": "Jean Dupont",
    "guestEmail": "jean.dupont@example.com",
    "content": "Super article sur cette raquette !"
  }
  ```
  *(Si l'utilisateur est connecté via le token JWT, `guestName` et `guestEmail` sont ignorés).*
- **Réponses** :
  - `201 Created` : Commentaire envoyé et en attente de modération.
  - `404 Not Found` : Article introuvable.

---

## 4. Retours Clients (RMA)
**Préfixe de route** : `/api/returns`

### Créer une demande de retour
- **URL** : `/`
- **Méthode** : `POST`
- **Accès** : Privé (Nécessite un Token Bearer JWT)
- **Body** :
  ```json
  {
    "orderId": "uuid-de-la-commande",
    "reason": "Produit défectueux",
    "customerNote": "La raquette a un éclat sur le cadre",
    "items": [
      {
        "orderItemId": "uuid-de-l-article-dans-la-commande",
        "quantity": 1,
        "reasonDetail": "Éclat sur le cadre"
      }
    ]
  }
  ```
- **Réponses** :
  - `201 Created` : Demande de retour créée avec succès (Statut initial: `pending`).
  - `404 Not Found` : Commande introuvable ou n'appartenant pas à cet utilisateur.

### Récupérer les demandes de retour de l'utilisateur
- **URL** : `/`
- **Méthode** : `GET`
- **Accès** : Privé (Nécessite un Token Bearer JWT)
- **Réponse** :
  - `200 OK` : Retourne la liste des RMA de l'utilisateur connecté, avec les statuts (`pending`, `authorized`, `received`, `refunded`, `rejected`).
