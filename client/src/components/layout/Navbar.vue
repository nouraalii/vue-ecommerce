<template>
  <nav class="bg-background py-4 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 bg-white/50 backdrop-blur-md rounded-full px-8 shadow-sm border border-white/20">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2 text-primary font-extrabold text-2xl tracking-tight">
            <span>coDoc</span>
          </router-link>
          <div class="hidden md:flex items-center space-x-8 ml-12 text-sm font-medium text-gray-600">
            <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
            <router-link to="/" class="hover:text-primary transition-colors">Shop</router-link>
            <router-link to="/" class="hover:text-primary transition-colors">New Arrival</router-link>
            <router-link to="/" class="hover:text-primary transition-colors">Blog</router-link>
          </div>
        </div>

        <!-- Right Side Nav -->
        <div class="flex items-center space-x-6">
          
          <!-- Search Bar (Desktop Minimalist) -->
          <div class="hidden sm:flex relative items-center">
            <input 
              type="text" 
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Search..." 
              class="w-48 bg-transparent border-b border-gray-300 py-1 pl-8 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <svg class="h-4 w-4 text-gray-500 absolute left-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <!-- Wishlist Icon -->
          <router-link to="/wishlist" class="relative text-gray-600 hover:text-primary transition-colors duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span v-if="wishlistCount > 0" class="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">{{ wishlistCount }}</span>
          </router-link>

          <!-- Cart Icon -->
          <button @click="toggleCart" class="relative text-gray-600 hover:text-primary transition-colors duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <transition name="pop" mode="out-in">
              <span v-if="cartItemCount > 0" class="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">{{ cartItemCount }}</span>
            </transition>
          </button>

          <!-- User Menu / Auth Links -->
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="text-sm font-medium text-gray-700 hover:text-primary transition-colors hidden sm:block">Log in</router-link>
            <router-link to="/register" class="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-secondary transition-colors hidden sm:block">Sign up</router-link>
          </template>
          
          <template v-else>
            <div class="relative group cursor-pointer">
              <div class="flex items-center space-x-2">
                <div class="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm uppercase">{{ userInitials }}</div>
              </div>
              
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-gray-100">
                <div class="px-4 py-2 border-b border-gray-50 mb-1">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name }}</p>
                </div>
                <router-link :to="dashboardRoute" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">Dashboard</router-link>
                <a href="#" @click.prevent="handleLogout" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
const user = computed(() => store.getters['auth/user']);
const cartItemCount = computed(() => store.getters['cart/itemCount']);
const wishlistCount = computed(() => store.getters['wishlist/wishlistCount']);

const toggleCart = () => {
  store.dispatch('cart/toggleDrawer');
};

const userInitials = computed(() => {
  if (!user.value?.name) return '?';
  return user.value.name.substring(0, 2);
});

const dashboardRoute = computed(() => {
  if (!user.value) return '/';
  if (user.value.role === 'admin') return '/admin/dashboard';
  if (user.value.role === 'seller') return '/seller/dashboard';
  return '/customer/dashboard';
});

// Debounced Search logic
const searchQuery = ref('');
let searchTimeout;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.dispatch('products/updateFilters', { keyword: searchQuery.value, page: 1 });
    if (router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  }, 500);
};

const handleLogout = () => {
  store.dispatch('auth/logout');
  router.push('/login');
};
</script>
