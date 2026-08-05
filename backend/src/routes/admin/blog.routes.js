import { Router } from 'express';
import { upload, optimizeImage } from '../../middleware/upload.js';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage
} from '../../controllers/admin/blog.controller.js';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Image upload specifically for blogs
router.post('/upload', upload.single('image'), optimizeImage, uploadBlogImage);

export default router;
