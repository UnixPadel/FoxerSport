import prisma from '../utils/prisma.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';
import {
  createChargilyCheckout,
  verifyChargilySignature,
  getChargilyCheckout,
} from '../services/chargily.service.js';

// ─────────────────────────────────────────────────────────────────────
// Payment Controller — Chargily Pay v2
//
// Flow:
//   1. Frontend appelle POST /api/payment/initialize { orderId }
//   2. Backend crée un checkout Chargily → retourne checkout_url
//   3. Frontend redirige l'utilisateur vers checkout_url
//   4. L'utilisateur paie sur la page hébergée de Chargily
//   5. Chargily redirige vers /payment/result?status=success|failed
//   6. Chargily envoie un webhook POST à /api/payment/webhook
//   7. Le backend vérifie la signature HMAC et met à jour la commande
// ─────────────────────────────────────────────────────────────────────

/**
 * Étape 1 : Initialise une session de paiement Chargily.
 * Nécessite une authentification (JWT).
 *
 * POST /api/payment/initialize
 * Body: { orderId: string (UUID) }
 */
export const initializePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    // ── Récupérer et valider la commande ───────────────────────────
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Commande introuvable',
      });
    }

    // Vérifier que la commande appartient à l'utilisateur authentifié
    if (order.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé à cette commande',
      });
    }

    // Seules les commandes en attente peuvent être payées
    if (order.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: `La commande n'est pas payable (statut actuel : ${order.status})`,
      });
    }

    // Vérifier que la commande a des articles
    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'La commande ne contient aucun article',
      });
    }

    // ── Construire les URLs ────────────────────────────────────────
    const backendUrl  = process.env.BACKEND_URL || 'http://localhost:3000';
    const frontendUrl = process.env.FRONTEND_URL_PAYMENT || 'http://localhost:5173';

    const successUrl  = `${frontendUrl}/payment/result?status=success&orderId=${order.id}&orderNumber=${order.orderNumber}`;
    const failureUrl  = `${frontendUrl}/payment/result?status=failed&orderId=${order.id}`;
    const webhookUrl  = `${backendUrl}/api/payment/webhook`;

    // ── Créer le checkout Chargily ─────────────────────────────────
    const chargilyResponse = await createChargilyCheckout({
      order,
      successUrl,
      failureUrl,
      webhookUrl,
    });

    // ── Enregistrer le paiement en base de données ─────────────────
    await prisma.payment.create({
      data: {
        orderId:               order.id,
        provider:              'chargily',
        providerPaymentId:     chargilyResponse.id,        // ID du checkout Chargily
        providerConversationId: order.orderNumber,
        amount:                order.total,
        currency:              'DZD',
        status:                'pending',
        rawResponse:           chargilyResponse,
      },
    });

    return res.json({
      status: 'success',
      checkoutUrl: chargilyResponse.checkout_url,
      checkoutId:  chargilyResponse.id,
    });
  } catch (error) {
    console.error('[Payment] Erreur initialisation:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Échec de l\'initialisation du paiement',
    });
  }
};

/**
 * Étape 2 : Webhook Chargily — Notification asynchrone du statut de paiement.
 * Appelé par les serveurs de Chargily (PAS le navigateur de l'utilisateur).
 * AUCUNE auth JWT — sécurisé par vérification de signature HMAC-SHA256.
 *
 * POST /api/payment/webhook
 * Headers: { signature: string }
 * Body: JSON brut (raw Buffer)
 */
export const handleChargilyWebhook = async (req, res) => {
  // ── Vérification de la signature ──────────────────────────────────
  const signature = req.headers['signature'];
  const rawBody   = req.body; // req.body est un Buffer grâce à express.raw()

  const isValid = verifyChargilySignature(rawBody, signature);

  if (!isValid) {
    console.warn('[Webhook] Signature invalide — requête rejetée');
    return res.status(403).json({ status: 'error', message: 'Signature invalide' });
  }

  // ── Parser le payload ─────────────────────────────────────────────
  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).json({ status: 'error', message: 'Payload JSON invalide' });
  }

  console.log(`[Webhook] Événement reçu: ${event.type} — ID: ${event.id}`);

  // ── Répondre 200 immédiatement (Chargily abandonne si timeout) ────
  res.status(200).json({ status: 'received' });

  // ── Traitement asynchrone de l'événement ─────────────────────────
  try {
    if (event.type === 'checkout.paid') {
      await handleCheckoutPaid(event.data);
    } else if (event.type === 'checkout.failed') {
      await handleCheckoutFailed(event.data);
    }
    // Autres types d'événements peuvent être ajoutés ici
  } catch (error) {
    console.error('[Webhook] Erreur traitement événement:', error.message);
    // Ne PAS retourner d'erreur ici — on a déjà répondu 200
  }
};

/**
 * Traite un paiement confirmé (checkout.paid).
 * @param {Object} checkoutData - Données du checkout depuis le webhook
 */
const handleCheckoutPaid = async (checkoutData) => {
  const orderId     = checkoutData.metadata?.order_id;
  const checkoutId  = checkoutData.id;

  if (!orderId) {
    console.error('[Webhook] checkout.paid sans order_id dans metadata');
    return;
  }

  // Vérifier si la commande n'est pas déjà confirmée (idempotence)
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!existingOrder) {
    console.error(`[Webhook] Commande introuvable: ${orderId}`);
    return;
  }

  if (existingOrder.status !== 'pending') {
    console.info(`[Webhook] Commande ${orderId} déjà traitée (statut: ${existingOrder.status})`);
    return;
  }

  // ── Mettre à jour la commande ──────────────────────────────────────
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'confirmed',
      statusHistory: {
        create: {
          oldStatus: 'pending',
          newStatus: 'confirmed',
          note: `Paiement confirmé via Chargily. Checkout ID: ${checkoutId}`,
        },
      },
    },
    include: {
      items: true,
      user: true,
    },
  });

  // ── Mettre à jour l'enregistrement du paiement ────────────────────
  await prisma.payment.updateMany({
    where: {
      orderId,
      status: 'pending',
    },
    data: {
      providerPaymentId: checkoutId,
      status:            'completed',
      rawResponse:       checkoutData,
    },
  });

  // ── Décrémenter le stock ───────────────────────────────────────────
  const stockUpdates = order.items.map((item) => {
    if (item.variantId) {
      return prisma.productVariant.update({
        where: { id: item.variantId },
        data:  { stockQuantity: { decrement: item.quantity } },
      });
    }
    return prisma.product.update({
      where: { id: item.productId },
      data:  { stockQuantity: { decrement: item.quantity } },
    });
  });
  await Promise.all(stockUpdates);

  // ── Incrémenter le compteur de ventes ────────────────────────────
  const soldUpdates = order.items.map((item) =>
    prisma.product.update({
      where: { id: item.productId },
      data:  { soldCount: { increment: item.quantity } },
    })
  );
  await Promise.all(soldUpdates);

  // ── Envoyer l'email de confirmation (non-bloquant) ────────────────
  if (order.user?.email) {
    sendOrderConfirmationEmail(order.user.email, order).catch((emailErr) => {
      console.error('[Webhook] Erreur envoi email:', emailErr.message);
    });
  }

  console.info(`[Webhook] ✅ Commande ${order.orderNumber} confirmée avec succès`);
};

/**
 * Traite un paiement échoué (checkout.failed).
 * @param {Object} checkoutData - Données du checkout depuis le webhook
 */
const handleCheckoutFailed = async (checkoutData) => {
  const orderId    = checkoutData.metadata?.order_id;
  const checkoutId = checkoutData.id;

  if (!orderId) {
    console.warn('[Webhook] checkout.failed sans order_id dans metadata');
    return;
  }

  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!existingOrder || existingOrder.status !== 'pending') return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'cancelled',
      statusHistory: {
        create: {
          oldStatus: 'pending',
          newStatus: 'cancelled',
          note: `Paiement échoué via Chargily. Checkout ID: ${checkoutId}`,
        },
      },
    },
  });

  await prisma.payment.updateMany({
    where: { orderId, status: 'pending' },
    data: {
      status:       'failed',
      errorMessage: 'Paiement refusé par Chargily',
      rawResponse:  checkoutData,
    },
  });

  console.info(`[Webhook] ❌ Paiement échoué pour la commande ${orderId}`);
};

/**
 * Vérifier le statut d'un paiement pour une commande.
 * Utile pour le frontend pour confirmer après redirection.
 *
 * GET /api/payment/status/:orderId
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId      = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      select: {
        id:          true,
        orderNumber: true,
        status:      true,
        total:       true,
        currency:    true,
        payments: {
          select: {
            status:            true,
            provider:          true,
            providerPaymentId: true,
            amount:            true,
            currency:          true,
            createdAt:         true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Commande introuvable',
      });
    }

    return res.json({
      status: 'success',
      order: {
        id:          order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        total:       order.total,
        currency:    order.currency,
        payment:     order.payments[0] || null,
      },
    });
  } catch (error) {
    console.error('[Payment] Erreur vérification statut:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Impossible de vérifier le statut du paiement',
    });
  }
};
