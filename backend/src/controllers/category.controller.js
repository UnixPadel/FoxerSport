import prisma from '../utils/prisma.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { 
        isActive: true,
        parentId: null // Only root categories
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            translations: true
          }
        }
      }
    });
    
    res.json({ status: 'success', categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching categories' });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        translations: true,
        children: {
          include: { translations: true }
        }
      }
    });

    if (!category || !category.isActive) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    res.json({ status: 'success', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching category' });
  }
};
