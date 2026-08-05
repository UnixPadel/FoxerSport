import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, preferredLang, preferredCurrency } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(preferredLang && { preferredLang }),
        ...(preferredCurrency && { preferredCurrency }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        preferredLang: true,
        preferredCurrency: true,
      }
    });

    res.json({ status: 'success', message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    res.json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error changing password' });
  }
};
