import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // If browser back/forward button — restore position
    if (savedPosition) return savedPosition
    // If anchor link — scroll to element
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // Default — always scroll to top on new navigation
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/auth/google/callback',
      name: 'google-callback',
      component: () => import('../views/GoogleCallbackView.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('../views/PaymentResultView.vue')
    },
    {
      path: '/account',
      component: () => import('../views/AccountLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'account-dashboard', component: () => import('../views/account/DashboardView.vue') },
        { path: 'orders', name: 'account-orders', component: () => import('../views/account/OrdersView.vue') },
        { path: 'profile', name: 'account-profile', component: () => import('../views/account/ProfileView.vue') },
        { path: 'wishlist', name: 'account-wishlist', component: () => import('../views/account/WishlistView.vue') }
      ]
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/information/:id',
      name: 'information',
      component: () => import('../views/InformationView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('../views/BlogsView.vue')
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue')
    },
    // Admin Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue')
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
        { path: 'products', name: 'admin-products', component: () => import('../views/admin/ProductsAdminView.vue') },
        { path: 'products/new', name: 'admin-product-new', component: () => import('../views/admin/ProductEditAdminView.vue') },
        { path: 'products/:id', name: 'admin-product-edit', component: () => import('../views/admin/ProductEditAdminView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('../views/admin/OrdersAdminView.vue') },
        { path: 'users', name: 'admin-users', component: () => import('../views/admin/UsersAdminView.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('../views/admin/SettingsAdminView.vue') },
        { path: 'blogs', name: 'admin-blogs', component: () => import('../views/admin/BlogsAdminView.vue') },
        { path: 'blogs/:id', name: 'admin-blog-edit', component: () => import('../views/admin/BlogEditAdminView.vue') },
        { path: 'campaigns', name: 'admin-campaigns', component: () => import('../views/admin/CampaignsAdminView.vue') },
        { path: 'campaigns/:id', name: 'admin-campaign-edit', component: () => import('../views/admin/CampaignEditAdminView.vue') }
      ]
    }
  ]
})

import { useAuthStore } from '../stores/auth'

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const role = authStore.user?.role

  if (to.meta.requiresAdmin) {
    if (!isAuthenticated || (role !== 'ADMIN' && role !== 'admin')) {
      next('/admin/login')
    } else {
      next()
    }
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next('/account')
  } else if (to.name === 'admin-login' && (role === 'ADMIN' || role === 'admin')) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router
