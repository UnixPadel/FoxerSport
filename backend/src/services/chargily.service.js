import axios from 'axios';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────
// Chargily Pay v2 Service
//
// Flow:
//   1. Frontend appelle POST /api/payment/initialize { orderId }
//   2. Backend crée un checkout Chargily → retourne checkout_url
//   3. Frontend redirige l'utilisateur vers checkout_url (page hébergée Chargily)
//   4. L'utilisateur paie sur la page Chargily
//   5. Chargily redirige vers success_url ou failure_url
//   6. Chargily envoie un webhook POST à /api/payment/webhook
//   7. Le backend vérifie la signature HMAC-SHA256 et met à jour la commande
// ─────────────────────────────────────────────────────────────────────

const CHARGILY_BASE_URL = process.env.CHARGILY_BASE_URL || 'https://pay.chargily.net/test/api/v2';

/**
 * Crée une session de paiement Chargily Pay v2.
 *
 * @param {Object} params
 * @param {Object} params.order       - Commande complète avec items et user
 * @param {string} params.successUrl  - URL de redirection après paiement réussi
 * @param {string} params.failureUrl  - URL de redirection après paiement échoué
 * @param {string} params.webhookUrl  - URL du webhook Chargily (pour recevoir les notifications)
 * @returns {Promise<Object>} Réponse Chargily avec checkout_url
 */
export const createChargilyCheckout = async ({ order, successUrl, failureUrl, webhookUrl }) => {
  const secretKey = process.env.CHARGILY_SECRET_KEY;

  if (!secretKey) {
    throw new Error('[Chargily] CHARGILY_SECRET_KEY is not set in environment variables');
  }

  // Chargily utilise des centimes (ex: 5000 DZD = 500000 centimes)
  // L'amount doit être en centimes (multiply by 100)
  const amountInCentimes = Math.round(parseFloat(order.total) * 100);

  const payload = {
    amount: amountInCentimes,
    currency: 'dzd', // Chargily supporte DZD
    payment_method: 'edahabia', // edahabia ou cib
    success_url: successUrl,
    failure_url: failureUrl,
    webhook_endpoint: webhookUrl,
    description: `Commande ${order.orderNumber} - Foxersport`,
    locale: 'ar', // ar ou fr ou en
    metadata: {
      order_id: order.id,
      order_number: order.orderNumber,
      user_id: order.userId,
    },
    // Informations du client (optionnel mais recommandé)
    customer: {
      name: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Client',
      email: order.user?.email || null,
      phone: order.user?.phone || null,
      address: {
        country: order.shippingAddressSnapshot?.countryCode || 'DZ',
        state: order.shippingAddressSnapshot?.stateProvince || null,
        address: order.shippingAddressSnapshot?.addressLine1 || null,
      },
    },
  };

  try {
    const response = await axios.post(`${CHARGILY_BASE_URL}/checkouts`, payload, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 secondes timeout
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Erreur Chargily inconnue';
    console.error('[Chargily] Erreur création checkout:', message, error.response?.data);
    throw new Error(message);
  }
};

/**
 * Vérifie la signature HMAC-SHA256 du webhook Chargily.
 * IMPORTANT: Doit être appelé avec le body RAW (Buffer), pas le body parsé en JSON.
 *
 * @param {Buffer} rawBody   - Corps brut de la requête (Buffer)
 * @param {string} signature - Valeur du header 'signature' envoyé par Chargily
 * @returns {boolean} true si la signature est valide
 */
export const verifyChargilySignature = (rawBody, signature) => {
  const secretKey = process.env.CHARGILY_SECRET_KEY;

  if (!secretKey) {
    console.error('[Chargily] CHARGILY_SECRET_KEY manquant, impossible de vérifier la signature');
    return false;
  }

  if (!signature) {
    console.warn('[Chargily] Header "signature" manquant dans le webhook');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(rawBody);
    const calculatedSignature = hmac.digest('hex');

    // Comparaison en temps constant pour éviter les timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    console.error('[Chargily] Erreur vérification signature:', error.message);
    return false;
  }
};

/**
 * Récupère les détails d'un checkout Chargily par son ID.
 *
 * @param {string} checkoutId - ID du checkout Chargily
 * @returns {Promise<Object>} Détails du checkout
 */
export const getChargilyCheckout = async (checkoutId) => {
  const secretKey = process.env.CHARGILY_SECRET_KEY;

  try {
    const response = await axios.get(`${CHARGILY_BASE_URL}/checkouts/${checkoutId}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('[Chargily] Erreur récupération checkout:', message);
    throw new Error(message);
  }
};
