import prisma from '../../utils/prisma.js';

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.blogPost.count()
    ]);

    res.json({
      status: 'success',
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch blogs' });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    res.json({ status: 'success', data: blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch blog' });
  }
};

// Create blog
export const createBlog = async (req, res) => {
  try {
    const { slug, isPublished, featuredImage, translations } = req.body;

    // translations is expected to be an array of objects
    // { locale, title, excerpt, content, metaTitle, metaDescription }

    const blog = await prisma.blogPost.create({
      data: {
        slug,
        isPublished: isPublished || false,
        featuredImage,
        publishedAt: isPublished ? new Date() : null,
        authorId: req.user.userId, // Assuming verifyToken sets req.user
        translations: {
          create: translations.map(t => ({
            locale: t.locale,
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
            metaTitle: t.metaTitle,
            metaDescription: t.metaDescription
          }))
        }
      },
      include: {
        translations: true
      }
    });

    res.status(201).json({ status: 'success', data: blog });
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ status: 'error', message: 'Slug must be unique' });
    }
    res.status(500).json({ status: 'error', message: 'Failed to create blog' });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, isPublished, featuredImage, translations } = req.body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    // Determine if newly published
    let publishedAt = existing.publishedAt;
    if (isPublished && !existing.isPublished) {
      publishedAt = new Date();
    }

    // Process translations inside a transaction or nested update
    // Prisma nested update doesn't support easy "upsert all from array". We'll do it manually.
    
    await prisma.$transaction(async (tx) => {
      // Update base post
      await tx.blogPost.update({
        where: { id },
        data: {
          slug,
          isPublished,
          featuredImage,
          publishedAt
        }
      });

      // Upsert translations
      if (translations && Array.isArray(translations)) {
        for (const t of translations) {
          const existingTranslation = await tx.blogPostTranslation.findUnique({
            where: {
              postId_locale: {
                postId: id,
                locale: t.locale
              }
            }
          });

          if (existingTranslation) {
            await tx.blogPostTranslation.update({
              where: { id: existingTranslation.id },
              data: {
                title: t.title,
                excerpt: t.excerpt,
                content: t.content,
                metaTitle: t.metaTitle,
                metaDescription: t.metaDescription
              }
            });
          } else {
            await tx.blogPostTranslation.create({
              data: {
                postId: id,
                locale: t.locale,
                title: t.title,
                excerpt: t.excerpt,
                content: t.content,
                metaTitle: t.metaTitle,
                metaDescription: t.metaDescription
              }
            });
          }
        }
      }
    });

    const updatedBlog = await prisma.blogPost.findUnique({
      where: { id },
      include: { translations: true }
    });

    res.json({ status: 'success', data: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ status: 'error', message: 'Slug must be unique' });
    }
    res.status(500).json({ status: 'error', message: 'Failed to update blog' });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({ status: 'success', message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete blog' });
  }
};

export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No image uploaded' });
    }
    const url = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;
    res.json({ status: 'success', url });
  } catch (error) {
    console.error('Error uploading blog image:', error);
    res.status(500).json({ status: 'error', message: 'Failed to upload image' });
  }
};
