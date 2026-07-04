import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/shop/Home.vue'),
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/shop/Shop.vue'),
  },
  {
    path: '/new-arrivals',
    name: 'NewArrivals',
    component: () => import('../views/shop/NewArrivals.vue'),
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/blog/Blog.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('../views/blog/BlogPost.vue'),
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/shop/ProductDetail.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/shop/Cart.vue'),
  },
  {
    path: '/dashboard',
    name: 'DashboardRedirect',
    redirect: () => {
      const role = store.getters['auth/role'];
      if (role === 'admin') return '/admin/dashboard';
      if (role === 'seller') return '/seller/dashboard';
      return '/customer/dashboard';
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/checkout/Checkout.vue'),
    meta: { requiresAuth: true, role: 'customer' }
  },
  {
    path: '/order-success/:id',
    name: 'OrderSuccess',
    component: () => import('../views/checkout/OrderSuccess.vue'),
    meta: { requiresAuth: true, role: 'customer' }
  },
  {
    path: '/customer/dashboard',
    name: 'CustomerDashboard',
    component: () => import('../views/dashboards/CustomerDashboard.vue'),
    meta: { requiresAuth: true, role: 'customer' }
  },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: () => import('../views/dashboards/SellerDashboard.vue'),
    meta: { requiresAuth: true, role: 'seller' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/dashboards/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('../views/auth/VerifyEmail.vue')
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../views/shop/Wishlist.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  const userRole = store.getters['auth/role'];
  const dashboardForRole = role => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'seller') return '/seller/dashboard';
    return '/customer/dashboard';
  };

  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/login';
  }

  if (isLoggedIn && !['customer', 'admin', 'seller'].includes(userRole)) {
    store.dispatch('auth/logout');
    return '/login';
  }

  if (to.meta.guest && isLoggedIn) {
    return dashboardForRole(userRole);
  }

  if (to.meta.role && to.meta.role !== userRole) {
    return dashboardForRole(userRole);
  }

  return true;
});

export default router;
