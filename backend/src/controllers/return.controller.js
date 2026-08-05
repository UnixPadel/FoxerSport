import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a new return request (RMA)
// @route   POST /api/returns
// @access  Private
export const createReturnRequest = async (req, res) => {
  try {
    const { orderId, reason, customerNote, items } = req.body;
    const userId = req.user.id;

    if (!orderId || !reason || !items || items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Veuillez fournir la commande, la raison et les articles à retourner' });
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Commande non trouvée' });
    }

    // Create the return request and return items
    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId,
        userId,
        reason,
        customerNote,
        items: {
          create: items.map(item => ({
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            reasonDetail: item.reasonDetail
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Demande de retour créée avec succès',
      data: { returnRequest }
    });
  } catch (error) {
    console.error('Create Return Request Error:', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur' });
  }
};

// @desc    Get user's return requests
// @route   GET /api/returns
// @access  Private
export const getMyReturns = async (req, res) => {
  try {
    const userId = req.user.id;

    const returns = await prisma.returnRequest.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            orderItem: true
          }
        },
        order: {
          select: { orderNumber: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      results: returns.length,
      data: { returns }
    });
  } catch (error) {
    console.error('Get My Returns Error:', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur' });
  }
};
