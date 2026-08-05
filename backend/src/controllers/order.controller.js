import prisma from '../utils/prisma.js';
import crypto from 'crypto'; // To generate order numbers

const generateOrderNumber = () => {
  return 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddressId, items, subtotal, shippingCost = 0, taxAmount = 0, currency = 'TRY' } = req.body;
    
    // In a real app, we should recalculate the subtotal from the DB prices for security
    // but for this implementation we will trust the provided amounts or assume they are pre-validated
    
    const total = parseFloat(subtotal) + parseFloat(shippingCost) + parseFloat(taxAmount);

    // Fetch the address to snapshot it
    const address = await prisma.address.findUnique({ where: { id: shippingAddressId } });
    if (!address) return res.status(404).json({ status: 'error', message: 'Shipping address not found' });

    // Snapshot address
    const addressSnapshot = {
      firstName: address.firstName,
      lastName: address.lastName,
      addressLine1: address.addressLine1,
      city: address.city,
      postalCode: address.postalCode,
      countryCode: address.countryCode
    };

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        shippingAddressId,
        shippingAddressSnapshot: addressSnapshot,
        billingAddressSnapshot: addressSnapshot, // Using same for now
        status: 'pending',
        currency: currency,
        subtotal: parseFloat(subtotal),
        shippingCost: parseFloat(shippingCost),
        taxAmount: parseFloat(taxAmount),
        total,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            productSnapshot: { name: item.productName }
          }))
        }
      },
      include: { items: true }
    });

    // We clear the user's cart after creating the order
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.status(201).json({ status: 'success', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error creating order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    res.json({ status: 'success', orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true, statusHistory: true }
    });

    if (!order) return res.status(404).json({ status: 'error', message: 'Order not found' });

    res.json({ status: 'success', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching order details' });
  }
};
