import prisma from '../utils/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Info Pages Controller — Pages d'information publiques
// (CGU, Politique de confidentialité, À propos, etc.)
// ─────────────────────────────────────────────────────────────────────

/**
 * Récupère une page d'information par son slug.
 * GET /api/info/:slug?locale=fr
 */
export const getInfoPage = async (req, res) => {
  try {
    const { slug }    = req.params;
    const { locale = 'fr' } = req.query;

    const page = await prisma.infoPage.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!page || !page.isActive) {
      // Essayer avec la locale de fallback
      const pageFallback = await prisma.infoPage.findUnique({
        where: { slug },
        include: { translations: true },
      });

      if (!pageFallback || !pageFallback.isActive) {
        return res.status(404).json({ status: 'error', message: 'Page introuvable' });
      }

      const fallbackTranslation = pageFallback.translations[0];
      if (!fallbackTranslation) {
        return res.status(404).json({ status: 'error', message: 'Contenu de page non disponible' });
      }

      return res.json({
        status: 'success',
        data: {
          id:      pageFallback.id,
          slug:    pageFallback.slug,
          locale:  fallbackTranslation.locale,
          title:   fallbackTranslation.title,
          content: fallbackTranslation.content,
          metaTitle:       fallbackTranslation.metaTitle,
          metaDescription: fallbackTranslation.metaDescription,
          updatedAt: pageFallback.updatedAt,
        },
      });
    }

    const translation = page.translations[0];
    if (!translation) {
      return res.status(404).json({ status: 'error', message: `Aucun contenu en ${locale}` });
    }

    return res.json({
      status: 'success',
      data: {
        id:      page.id,
        slug:    page.slug,
        locale,
        title:   translation.title,
        content: translation.content,
        metaTitle:       translation.metaTitle,
        metaDescription: translation.metaDescription,
        updatedAt: page.updatedAt,
      },
    });
  } catch (error) {
    console.error('[InfoPage] Erreur:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération de la page' });
  }
};

/**
 * Liste toutes les pages d'information actives (slugs seulement).
 * GET /api/info
 */
export const listInfoPages = async (req, res) => {
  try {
    const pages = await prisma.infoPage.findMany({
      where: { isActive: true },
      select: {
        id:           true,
        slug:         true,
        updatedAt:    true,
        translations: { select: { locale: true, title: true } },
      },
      orderBy: { id: 'asc' },
    });

    return res.json({ status: 'success', data: pages });
  } catch (error) {
    console.error('[InfoPage] Erreur liste:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des pages' });
  }
};
