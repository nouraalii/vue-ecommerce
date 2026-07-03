<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="animate-pulse flex flex-col md:flex-row gap-8">
      <!-- Image Skeleton -->
      <div class="w-full md:w-1/2 h-96 bg-gray-200 rounded-xl"></div>
      <!-- Info Skeleton -->
      <div class="w-full md:w-1/2 space-y-4 pt-4">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="space-y-2 pt-6">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="product" class="flex flex-col md:flex-row gap-8 lg:gap-12" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <!-- Product Images (Simple gallery for now) -->
      <div class="w-full md:w-1/2">
        <div class="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden bg-gray-100 mb-4">
          <img 
            :src="product.images && product.images.length > 0 ? product.images[0].url : 'https://placehold.co/800x600?text=No+Image'" 
            :alt="product.title"
            class="object-cover w-full h-full"
          />
        </div>
        <!-- Thumbnails placeholder -->
        <div class="flex gap-4 overflow-x-auto pb-2" v-if="product.images && product.images.length > 1">
          <button v-for="(img, idx) in product.images" :key="idx" class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2" :class="idx === 0 ? 'border-primary' : 'border-transparent'">
            <img :src="img.url" class="object-cover w-full h-full" />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="w-full md:w-1/2 flex flex-col">
        <nav class="flex text-sm text-gray-500 mb-4">
          <ol class="flex items-center space-x-2">
            <li><router-link to="/" class="hover:text-primary transition-colors">Home</router-link></li>
            <li><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></li>
            <li><span class="hover:text-primary transition-colors cursor-pointer" @click="$router.push('/')">{{ product.category?.name || 'Uncategorized' }}</span></li>
          </ol>
        </nav>

        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">{{ product.title }}</h1>
        
        <!-- Ratings -->
        <div class="flex items-center gap-2 mb-6">
          <div class="flex text-yellow-400">
             <svg v-for="i in 5" :key="i" :class="[i <= Math.round(product.averageRating) ? 'text-yellow-400' : 'text-gray-300', 'w-5 h-5']" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
          <span class="text-sm text-gray-500 hover:text-primary cursor-pointer">{{ product.reviewCount }} reviews</span>
        </div>

        <div class="flex items-end gap-4 mb-6">
          <p class="text-3xl font-bold text-gray-900">${{ product.basePrice.toFixed(2) }}</p>
          <p v-if="product.compareAtPrice" class="text-lg text-gray-500 line-through mb-1">${{ product.compareAtPrice.toFixed(2) }}</p>
          <span v-if="product.compareAtPrice" class="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 ml-2">Sale</span>
        </div>

        <div class="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-200 py-6">
          <p>{{ product.description }}</p>
        </div>

        <!-- Variants placeholder -->
        <div class="mb-8" v-if="product.variants && product.variants.length > 0">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Options</h3>
          <div class="flex flex-wrap gap-2">
             <button v-for="variant in product.variants" :key="variant._id" class="border rounded-md py-2 px-4 text-sm hover:border-primary focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
               {{ variant.name }}
             </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 mt-auto">
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button @click="quantity > 1 && quantity--" class="px-4 py-3 text-gray-600 hover:text-primary transition-colors">-</button>
            <input type="number" v-model="quantity" class="w-16 text-center border-none focus:ring-0 text-gray-900 font-medium" min="1" :max="product.stock || 10" />
            <button @click="quantity < (product.stock || 10) && quantity++" class="px-4 py-3 text-gray-600 hover:text-primary transition-colors">+</button>
          </div>
          <button @click="addToCart" class="flex-1 bg-primary border border-transparent rounded-lg py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm hover:shadow active:scale-95">
            Add to bag
          </button>
          <button @click="toggleWishlist" class="p-3 border rounded-lg transition-all" :class="isInWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50'">
            <svg class="w-6 h-6" :class="isInWishlist ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>
        </div>
        
        <div class="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span v-if="product.stock > 0">In stock and ready to ship</span>
          <span v-else class="text-red-500">Out of stock</span>
        </div>

      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-900">Product not found</h2>
      <button @click="$router.push('/')" class="mt-4 text-primary hover:underline">Return to shop</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import ProductService from '../../services/product.service';

import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();
const toast = useToast();

const product = ref(null);
const loading = ref(true);
const quantity = ref(1);

const isInWishlist = computed(() => {
  return product.value ? store.getters['wishlist/isInWishlist'](product.value._id || product.value.id) : false;
});

onMounted(async () => {
  try {
    const response = await ProductService.getProduct(route.params.id);
    product.value = response.data;
  } catch (err) {
    toast.error('Failed to load product details');
  } finally {
    loading.value = false;
  }
});

const addToCart = () => {
  store.dispatch('cart/addToCart', { product: product.value, quantity: quantity.value });
  toast.success(`Added ${quantity.value} ${product.value.title} to cart`);
};

const toggleWishlist = async () => {
  if (!product.value) return;

  try {
    const result = await store.dispatch('wishlist/toggleWishlist', product.value);
    if (result.added) {
      toast.success('Added to wishlist');
    } else {
      toast.info('Removed from wishlist');
    }
  } catch (error) {
    if (error.code === 'LOGIN_REQUIRED') {
      toast.info('Please log in to use your wishlist');
    } else {
      toast.error('Failed to update wishlist');
    }
  }
};
</script>
