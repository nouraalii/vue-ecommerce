<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
      <span class="text-sm font-medium text-gray-500">{{ wishlistCount }} items</span>
    </div>

    <div v-if="wishlistCount === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
      <p class="mt-1 text-sm text-gray-500">Save items you love here to buy them later.</p>
      <div class="mt-6">
        <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700">
          Explore Products
        </router-link>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in wishlistItems" 
        :key="product._id" 
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProductCard from '../../components/common/ProductCard.vue';

const store = useStore();

const wishlistItems = computed(() => store.getters['wishlist/wishlistItems']);
const wishlistCount = computed(() => store.getters['wishlist/wishlistCount']);
</script>
