import express from 'express';
import { getBlogs, getBlogBySlug, addBlogComment } from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/:slug/comments', addBlogComment);

export default router;
