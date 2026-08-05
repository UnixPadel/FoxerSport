import prisma from '../../utils/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Admin Pages Controller — CRUD pour les pages d'information
// ─────────────────────────────────────────────────────────────────────

/**
 * Lister toutes les pages d'information.
 * GET /api/admin/pages
 */
export const getAllPages = async (req, res) => {
  try {
    const pages = await prisma.infoPage.findMany({
      include: { translations: true },
      orderBy: { id: 'asc' },
    });
    return res.json({ status: 'success', data: pages });
  } catch (error) {
    console.error('[Admin/Pages] Erreur liste:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des pages' });
  }
};

/**
 * Créer une nouvelle page d'information.
 * POST /api/admin/pages
 * Body: { slug, isActive, translations: [{ locale, title, content, metaTitle, metaDescription }] }
 */
export const createPage = async (req, res) => {
  try {
    const { slug, isActive = true, translations = [] } = req.body;

    if (!slug || !translations.length) {
      return res.status(400).json({ status: 'error', message: 'Le slug et au moins une traduction sont requis' });
    }

    const existing = await prisma.infoPage.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Une page avec ce slug existe déjà' });
    }

    const page = await prisma.infoPage.create({
      data: {
        slug,
        isActive,
        translations: {
          create: translations.map(t => ({
            locale:          t.locale,
            title:           t.title,
            content:         t.content,
            metaTitle:       t.metaTitle || null,
            metaDescription: t.metaDescription || null,
          })),
        },
      },
      include: { translations: true },
    });

    return res.status(201).json({ status: 'success', data: page });
  } catch (error) {
    console.error('[Admin/Pages] Erreur création:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la création de la page' });
  }
};

/**
 * Modifier une page d'information.
 * PUT /api/admin/pages/:id
 */
export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, translations = [] } = req.body;

    const existing = await prisma.infoPage.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Page introuvable' });
    }

    // Mettre à jour les traductions (upsert par locale)
    const updateOps = translations.map(t =>
      prisma.infoPageTranslation.upsert({
        where: { pageId_locale: { pageId: parseInt(id), locale: t.locale } },
        create: {
          pageId:          parseInt(id),
          locale:          t.locale,
          title:           t.title,
          content:         t.content,
          metaTitle:       t.metaTitle || null,
          metaDescription: t.metaDescription || null,
        },
        update: {
          title:           t.title,
          content:         t.content,
          metaTitle:       t.metaTitle || null,
          metaDescription: t.metaDescription || null,
        },
      })
    );

    await Promise.all([
      prisma.infoPage.update({
        where: { id: parseInt(id) },
        data:  { ...(isActive !== undefined && { isActive }) },
      }),
      ...updateOps,
    ]);

    const updatedPage = await prisma.infoPage.findUnique({
      where: { id: parseInt(id) },
      include: { translations: true },
    });

    return res.json({ status: 'success', data: updatedPage });
  } catch (error) {
    console.error('[Admin/Pages] Erreur modification:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la modification de la page' });
  }
};

/**
 * Supprimer une page d'information.
 * DELETE /api/admin/pages/:id
 */
export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.infoPage.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Page introuvable' });
    }

    await prisma.infoPage.delete({ where: { id: parseInt(id) } });
    return res.json({ status: 'success', message: 'Page supprimée avec succès' });
  } catch (error) {
    console.error('[Admin/Pages] Erreur suppression:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression de la page' });
  }
};
