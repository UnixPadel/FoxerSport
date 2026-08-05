// ─────────────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// Doit être le DERNIER middleware enregistré dans app.js
// ─────────────────────────────────────────────────────────────────────

/**
 * Gestion centralisée des erreurs Express.
 * Normalise toutes les erreurs en une réponse JSON cohérente.
 */
export const errorHandler = (err, req, res, next) => {
  let status  = err.status || err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // ── Erreurs Prisma ─────────────────────────────────────────────────
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Contrainte d'unicité violée
        status  = 409;
        message = 'Une ressource avec ces informations existe déjà';
        break;
      case 'P2025': // Enregistrement introuvable
        status  = 404;
        message = 'Ressource introuvable';
        break;
      case 'P2003': // Contrainte de clé étrangère
        status  = 400;
        message = 'Référence invalide — la ressource liée n\'existe pas';
        break;
      case 'P2016': // Enregistrement requis introuvable
        status  = 404;
        message = 'Ressource requise introuvable';
        break;
      default:
        if (err.code.startsWith('P')) {
          status  = 400;
          message = 'Erreur de base de données';
        }
    }
  }

  // ── Erreurs de validation Multer ───────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    status  = 400;
    message = 'Fichier trop volumineux (maximum 5 Mo)';
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    status  = 400;
    message = 'Trop de fichiers (maximum 10)';
  }

  // ── Erreurs JWT ────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    status  = 401;
    message = 'Token d\'authentification invalide';
  }

  if (err.name === 'TokenExpiredError') {
    status  = 401;
    message = 'Session expirée, veuillez vous reconnecter';
  }

  // ── Log en développement uniquement ───────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${status} — ${message}`);
    if (err.stack) console.error(err.stack);
  } else {
    // En production : logger seulement les erreurs 500+
    if (status >= 500) {
      console.error(`[Error] ${status} — ${message}`, { url: req.url, method: req.method });
    }
  }

  return res.status(status).json({
    status:  'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
