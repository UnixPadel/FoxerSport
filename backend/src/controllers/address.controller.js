import prisma from '../utils/prisma.js';

export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching addresses' });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await prisma.address.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!address) return res.status(404).json({ status: 'error', message: 'Address not found' });
    
    res.json({ status: 'success', address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching address' });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { isDefault, ...addressData } = req.body;
    
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        ...addressData,
        isDefault: isDefault || false,
        userId: req.user.id
      }
    });

    res.status(201).json({ status: 'success', address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error creating address' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { isDefault, ...addressData } = req.body;
    
    const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return res.status(404).json({ status: 'error', message: 'Address not found' });

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: req.params.id },
      data: { ...addressData, ...(isDefault !== undefined && { isDefault }) }
    });

    res.json({ status: 'success', address: updatedAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return res.status(404).json({ status: 'error', message: 'Address not found' });

    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ status: 'success', message: 'Address deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error deleting address' });
  }
};
