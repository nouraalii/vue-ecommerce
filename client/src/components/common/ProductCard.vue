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
        <button @click.stop="openQuickView" class="pointer-events-auto bg-white p-3 rounded-2xl text-primary hover:text-white hover:bg-primary shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
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

  <Teleport to="body">
    <div
      v-if="isQuickViewOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 px-4 py-6 backdrop-blur-sm sm:px-6"
      @click.self="closeQuickView"
    >
      <div class="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:grid md:grid-cols-[1.05fr_0.95fr]">
        <button
          type="button"
          class="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close quick view"
          @click="closeQuickView"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="min-h-64 bg-surfaceAlt md:min-h-full">
          <img
            :src="imageUrl"
            :alt="product.title"
            class="h-72 w-full object-cover sm:h-96 md:h-full"
          />
        </div>

        <div class="overflow-y-auto p-6 sm:p-8">
          <div class="mb-3 text-xs font-bold uppercase tracking-widest text-primary">{{ categoryName }}</div>
          <h2 class="pr-10 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{{ product.title }}</h2>

          <div v-if="hasRating" class="mt-4 flex items-center gap-2">
            <div class="flex text-accent">
              <svg v-for="i in 5" :key="i" :class="[i <= Math.round(product.averageRating || 0) ? 'text-accent' : 'text-gray-200', 'h-4 w-4']" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </div>
            <span class="text-sm text-gray-500">{{ product.averageRating || 0 }} ({{ product.reviewCount || 0 }})</span>
          </div>

          <div class="mt-5 flex flex-wrap items-end gap-3">
            <span class="text-3xl font-extrabold text-primary">${{ product.basePrice.toFixed(2) }}</span>
            <span v-if="product.compareAtPrice" class="text-lg font-medium text-gray-400 line-through">${{ product.compareAtPrice.toFixed(2) }}</span>
            <span v-if="product.compareAtPrice" class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Sale</span>
          </div>

          <p class="mt-5 text-sm leading-6 text-gray-600">{{ shortDescription }}</p>

          <div class="mt-6 flex items-center gap-2 text-sm font-medium" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
            <svg v-if="product.stock > 0" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"></path></svg>
            <span>{{ stockText }}</span>
          </div>

          <div class="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
              :disabled="product.stock === 0"
              @click="addToCartFromQuickView"
            >
              Add to Cart
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :class="isInWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 text-gray-600 hover:border-red-500 hover:bg-red-50 hover:text-red-500'"
              @click="toggleWishlist"
            >
              <svg class="mr-2 h-5 w-5" :class="isInWishlist ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              Wishlist
            </button>
          </div>

          <router-link
            :to="`/product/${product._id}`"
            class="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            @click="closeQuickView"
          >
            View Full Details
          </router-link>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
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

const emit = defineEmits(['add-to-cart', 'quick-view']);
const isQuickViewOpen = ref(false);

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
const imageUrl = computed(() => props.product.images?.[0]?.url || 'https://placehold.co/800x800?text=No+Image');
const categoryName = computed(() => props.product.category?.name || 'Uncategorized');
const hasRating = computed(() => Boolean(props.product.averageRating || props.product.reviewCount));
const shortDescription = computed(() => {
  const description = props.product.description || 'No description available.';
  return description.length > 180 ? `${description.slice(0, 180).trim()}...` : description;
});
const stockText = computed(() => {
  if (props.product.stock > 0) return `${props.product.stock} in stock`;
  return 'Out of stock';
});

const closeQuickView = () => {
  isQuickViewOpen.value = false;
};

const openQuickView = () => {
  isQuickViewOpen.value = true;
  emit('quick-view', props.product);
};

const handleEscape = (event) => {
  if (event.key === 'Escape') closeQuickView();
};

watch(isQuickViewOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
  } else {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', handleEscape);
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', handleEscape);
});

const toggleWishlist = () => {
  const wasInWishlist = isInWishlist.value;
  store.dispatch('wishlist/toggleWishlist', props.product);
  if (wasInWishlist) {
    toast.info('Removed from wishlist');
  } else {
    toast.success('Added to wishlist');
  }
};

const addToCartFromQuickView = () => {
  store.dispatch('cart/addToCart', { product: props.product, quantity: 1 });
  toast.success(`Added ${props.product.title} to cart`);
};
</script>
