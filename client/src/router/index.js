import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/shop/Home.vue'),
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
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/checkout/Checkout.vue'),
  },
  {
    path: '/order-success/:id',
    name: 'OrderSuccess',
    component: () => import('../views/checkout/OrderSuccess.vue'),
  },
  {
    path: '/customer/dashboard',
    name: 'CustomerDashboard',
    component: () => import('../views/dashboards/CustomerDashboard.vue'),
    meta: { requiresAuth: true, role: 'customer' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/dashboards/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: () => import('../views/dashboards/SellerDashboard.vue'),
    meta: { requiresAuth: true, role: 'seller' }
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  const userRole = store.getters['auth/role'];

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.meta.guest && isLoggedIn) {
    next('/'); // Or redirect to specific dashboard based on role
  } else if (to.meta.role && to.meta.role !== userRole) {
    next('/'); // Not authorized for this role
  } else {
    next();
  }
});

export default router;
