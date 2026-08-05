import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all manufacturers (brands)
// @route   GET /api/manufacturers
// @access  Public
export const getManufacturers = async (req, res) => {
  try {
    const manufacturers = await prisma.manufacturer.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.status(200).json({
      status: 'success',
      results: manufacturers.length,
      data: { manufacturers }
    });
  } catch (error) {
    console.error('Get Manufacturers Error:', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur' });
  }
};

// @desc    Get a single manufacturer by slug
// @route   GET /api/manufacturers/:slug
// @access  Public
export const getManufacturer = async (req, res) => {
  try {
    const { slug } = req.params;

    const manufacturer = await prisma.manufacturer.findUnique({
      where: { slug }
    });

    if (!manufacturer) {
      return res.status(404).json({ status: 'error', message: 'Marque non trouvée' });
    }

    res.status(200).json({
      status: 'success',
      data: { manufacturer }
    });
  } catch (error) {
    console.error('Get Manufacturer Error:', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur' });
  }
};
