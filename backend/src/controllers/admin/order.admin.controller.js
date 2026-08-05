import prisma from '../../utils/prisma.js';

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, firstName: true, lastName: true } } }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      status: 'success',
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        statusHistory: {
          create: {
            newStatus: status,
            note: note || `Status updated to ${status} by Admin`
          }
        }
      }
    });

    res.json({ status: 'success', message: 'Order status updated', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating order status' });
  }
};
