import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getBlogs = async (req, res) => {
  try {
    const { limit = 3, sort = 'newest' } = req.query;

    const limitNum = parseInt(limit, 10);
    const orderBy = sort === 'newest' ? { publishedAt: 'desc' } : { viewCount: 'desc' };

    const blogs = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
      },
      include: {
        translations: true,
      },
      orderBy,
      take: limitNum,
    });

    res.status(200).json({
      status: 'success',
      data: blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blogs',
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        translations: true,
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blog',
    });
  }
};

export const addBlogComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { guestName, guestEmail, content } = req.body;

    if (!content) {
      return res.status(400).json({ status: 'error', message: 'Le commentaire est requis' });
    }

    const blog = await prisma.blogPost.findUnique({ where: { slug } });
    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Article non trouvé' });
    }

    const userId = req.user ? req.user.id : null; // Si authentifié

    const comment = await prisma.blogComment.create({
      data: {
        postId: blog.id,
        userId: userId,
        guestName: !userId ? guestName : null,
        guestEmail: !userId ? guestEmail : null,
        content: content,
        isApproved: false // Modération requise par défaut
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Commentaire envoyé et en attente de modération',
      data: comment
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ status: 'error', message: 'Erreur serveur' });
  }
};
