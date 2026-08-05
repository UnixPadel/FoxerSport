import prisma from '../../utils/prisma.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true, 
          role: true, isActive: true, createdAt: true, lastLoginAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      status: 'success',
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching users' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    
    if (user.role === 'admin') {
      return res.status(403).json({ status: 'error', message: 'Cannot deactivate an admin' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true }
    });

    res.json({ status: 'success', message: `User status changed to ${updatedUser.isActive}`, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating user status' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: userRole
      },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error creating user' });
  }
};
