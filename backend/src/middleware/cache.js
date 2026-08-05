import redisClient from '../utils/redis.js';

/**
 * Middleware de mise en cache dynamique via Redis
 * @param {number} duration - Durée du cache en secondes (ex: 300 pour 5 minutes)
 */
export const cacheRoute = (duration = 300) => {
  return async (req, res, next) => {
    // Ne mettre en cache que les requêtes GET sécurisées
    if (req.method !== 'GET') {
      return next();
    }

    // On utilise l'URL complète comme clé unique dans Redis
    // Ex: "cache:/api/products?page=1&limit=10"
    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        // Cache HIT : On renvoie les données instantanément (0 requête BDD)
        return res.status(200).json(JSON.parse(cachedResponse));
      } else {
        // Cache MISS : On intercepte la réponse finale du contrôleur
        const originalJson = res.json;

        // On redéfinit res.json pour sauvegarder les données avant de les envoyer
        res.json = function (body) {
          // On restaure la fonction originale
          res.json = originalJson;

          // On stocke la réponse dans Redis avec un délai d'expiration (TTL)
          // On ne met en cache que les réponses "success"
          if (res.statusCode >= 200 && res.statusCode < 300) {
            redisClient.setEx(key, duration, JSON.stringify(body))
              .catch(err => console.error('Redis Cache Error:', err));
          }

          // On renvoie la réponse au client
          return res.json(body);
        };

        next();
      }
    } catch (error) {
      console.error('Redis Middleware Error:', error);
      // En cas de panne de Redis, on laisse passer la requête (Fail-safe)
      next();
    }
  };
};
