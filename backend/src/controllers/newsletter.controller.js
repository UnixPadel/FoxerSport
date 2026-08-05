import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ status: 'error', message: 'Veuillez fournir une adresse email valide' });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true }
        });
        return res.status(200).json({ status: 'success', message: 'Abonnement réactivé avec succès' });
      }
      return res.status(400).json({ status: 'error', message: 'Cet email est déjà abonné' });
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    res.status(201).json({ status: 'success', message: 'Inscription à la newsletter réussie' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur lors de l\'inscription' });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email manquant' });
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false }
    });

    res.status(200).json({ status: 'success', message: 'Désabonnement réussi' });
  } catch (error) {
    // Si l'email n'existe pas, on renvoie quand même un succès pour ne pas fuiter d'infos
    res.status(200).json({ status: 'success', message: 'Désabonnement réussi' });
  }
};
