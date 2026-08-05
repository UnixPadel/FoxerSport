import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import xssClean from 'xss-clean';
import cookieParser from 'cookie-parser';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// ── Importation de toutes les routes ──────────────────────────────────
import authRoutes         from './routes/auth.routes.js';
import userRoutes         from './routes/user.routes.js';
import addressRoutes      from './routes/address.routes.js';
import categoryRoutes     from './routes/category.routes.js';
import productRoutes      from './routes/product.routes.js';
import cartRoutes         from './routes/cart.routes.js';
import orderRoutes        from './routes/order.routes.js';
import reviewRoutes       from './routes/review.routes.js';
import wishlistRoutes     from './routes/wishlist.routes.js';
import adminRoutes        from './routes/admin.routes.js';
import paymentRoutes      from './routes/payment.routes.js';
import blogRoutes         from './routes/blog.routes.js';
import newsletterRoutes   from './routes/newsletter.routes.js';
import manufacturerRoutes from './routes/manufacturer.routes.js';
import returnRoutes       from './routes/return.routes.js';
import settingRoutes      from './routes/setting.routes.js';
import searchRoutes       from './routes/search.routes.js';
import couponRoutes       from './routes/coupon.routes.js';
import uploadRoutes       from './routes/upload.routes.js';
import infoRoutes         from './routes/info.routes.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ── Sécurité : Helmet ─────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy:   false,
}));

// ── CORS sécurisé ────────────────────────────────────────────────────
// En production : seul le frontend autorisé peut appeler l'API.
// En développement : permissif pour Postman et localhost.
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost'];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, mobile, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Origine bloquée: ${origin}`);
    return callback(new Error('Origine non autorisée par la politique CORS'), false);
  },
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// ── IMPORTANT : Le webhook Chargily doit être monté AVANT express.json ─
// La route /api/payment/webhook utilise express.raw() en interne.
// Les autres routes payment utilisent express.json() normalement.
app.use('/api/payment', paymentRoutes);

// ── Body Parsers ──────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ── Sanitization (XSS + HPP) ─────────────────────────────────────────
// Bypass XSS pour les campagnes (Unlayer HTML/JSON peut être corrompu)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/admin/campaigns')) return next();
  xssClean()(req, res, next);
});
app.use(hpp());

// ── Rate Limiting global ──────────────────────────────────────────────
app.use('/api', globalLimiter);

// ── Fichiers statiques (uploads) ──────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// ── Health check ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running', timestamp: new Date().toISOString() });
});

// ── Montage de toutes les routes ──────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/addresses',     addressRoutes);
app.use('/api/categories',    categoryRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/cart',          cartRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/wishlist',      wishlistRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/blogs',         blogRoutes);
app.use('/api/newsletter',    newsletterRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/returns',       returnRoutes);
app.use('/api/settings',      settingRoutes);
app.use('/api/search',        searchRoutes);
app.use('/api/coupons',       couponRoutes);
app.use('/api/upload',        uploadRoutes);
app.use('/api/info',          infoRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

// ── Error Handler Global (doit être en DERNIER) ───────────────────────
app.use(errorHandler);

export default app;
