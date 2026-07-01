<template>
  <div class="group relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer" @click="$router.push(`/product/${product._id}`)">
    <div class="aspect-w-4 aspect-h-3 bg-surfaceAlt relative overflow-hidden rounded-t-3xl">
        <!-- Product Image -->
        <div class="relative pt-[100%] bg-surfaceAlt overflow-hidden">
          <img 
            :src="product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image'" 
            :alt="product.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <!-- Status Badge -->
          <div v-if="product.stock === 0" class="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
            SOLD OUT
          </div>
          <div v-else-if="product.compareAtPrice" class="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
          
          <!-- Wishlist Button -->
          <button @click.prevent.stop="toggleWishlist" class="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm focus:outline-none z-20">
             <svg class="w-5 h-5 transition-colors" :class="isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
          </button>
        </div>
      
      <!-- Quick Actions Hover -->
      <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-none rounded-t-3xl backdrop-blur-[2px]">
        <button @click.stop="$emit('quick-view', product)" class="pointer-events-auto bg-white p-3 rounded-2xl text-primary hover:text-white hover:bg-primary shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </button>
        <button @click.stop="$emit('add-to-cart', product)" class="pointer-events-auto bg-primary p-3 rounded-2xl text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-secondary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </button>
      </div>
    </div>
    
    <div class="p-6">
      <div class="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">{{ product.category?.name || 'Uncategorized' }}</div>
      <h3 class="text-gray-900 font-semibold text-lg truncate mb-1">{{ product.title }}</h3>
      
      <div class="flex items-center mt-1 mb-3">
        <div class="flex text-accent">
          <svg v-for="i in 5" :key="i" :class="[i <= Math.round(product.averageRating) ? 'text-accent' : 'text-gray-200', 'w-3 h-3']" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
        </div>
        <span class="text-xs text-gray-500 ml-1">({{ product.reviewCount }})</span>
      </div>
      
      <div class="flex items-center justify-between mt-2">
        <div class="flex items-baseline space-x-2">
          <span class="text-xl font-extrabold text-primary">${{ product.basePrice.toFixed(2) }}</span>
          <span v-if="product.compareAtPrice" class="text-sm text-gray-400 line-through font-medium">
            ${{ product.compareAtPrice.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

const store = useStore();
const toast = useToast();

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

defineEmits(['add-to-cart', 'quick-view']);

const isNew = computed(() => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(props.product.createdAt) > thirtyDaysAgo;
});

const discount = computed(() => {
  if (!props.product.compareAtPrice || props.product.compareAtPrice <= props.product.basePrice) return 0;
  return Math.round(((props.product.compareAtPrice - props.product.basePrice) / props.product.compareAtPrice) * 100);
});

const isInWishlist = computed(() => store.getters['wishlist/isInWishlist'](props.product._id));

const toggleWishlist = () => {
  store.dispatch('wishlist/toggleWishlist', props.product);
  if (isInWishlist.value) {
    toast.info('Removed from wishlist');
  } else {
    toast.success('Added to wishlist', { icon: '❤️' });
  }
};
</script>
