import { Router } from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';

// ── Controllers ───────────────────────────────────────────────────────
import { getDashboardStats }                                from '../controllers/admin/dashboard.controller.js';
import { getAllUsers, toggleUserStatus, createUser }        from '../controllers/admin/user.admin.controller.js';
import { getAllOrders, updateOrderStatus }                   from '../controllers/admin/order.admin.controller.js';
import { createProduct, updateProduct, deleteProduct, uploadProductImage, getProductById } from '../controllers/admin/product.admin.controller.js';
import { applyBulkDiscount }                               from '../controllers/product.controller.js';
import { upload, optimizeImage }                           from '../middleware/upload.js';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/admin/coupons.controller.js';
import { getAllPages, createPage, updatePage, deletePage }  from '../controllers/admin/pages.controller.js';

// ── Routes modulaires ─────────────────────────────────────────────────
import blogRoutes     from './admin/blog.routes.js';
import campaignRoutes from './admin/campaign.routes.js';

const router = Router();

// Protéger toutes les routes admin
router.use(verifyToken, isAdmin);

// ── Dashboard ─────────────────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Utilisateurs ──────────────────────────────────────────────────────
router.get('/users',              getAllUsers);
router.post('/users',             createUser);
router.patch('/users/:id/status', toggleUserStatus);

// ── Commandes ─────────────────────────────────────────────────────────
router.get('/orders',                getAllOrders);
router.patch('/orders/:id/status',   updateOrderStatus);

// ── Produits ──────────────────────────────────────────────────────────
router.post('/products',                  createProduct);
router.post('/products/upload',           upload.single('image'), optimizeImage, uploadProductImage);
router.post('/products/bulk-discount',    applyBulkDiscount);
router.put('/products/:id',              updateProduct);
router.get('/products/:id',              getProductById);
router.delete('/products/:id',           deleteProduct);

// ── Coupons ───────────────────────────────────────────────────────────
router.get('/coupons',        getAllCoupons);
router.post('/coupons',       createCoupon);
router.put('/coupons/:id',   updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// ── Pages d'information ───────────────────────────────────────────────
router.get('/pages',         getAllPages);
router.post('/pages',        createPage);
router.put('/pages/:id',    updatePage);
router.delete('/pages/:id',  deletePage);

// ── Routes modulaires ─────────────────────────────────────────────────
router.use('/blogs',     blogRoutes);
router.use('/campaigns', campaignRoutes);

export default router;
