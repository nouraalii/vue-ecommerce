<template>
  <div class="bg-primary py-24 px-4 sm:px-6 lg:px-8 mt-12 rounded-[3rem] mx-4 sm:mx-8 mb-12 shadow-2xl relative overflow-hidden">
    <!-- Subtle Decor -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-white tracking-tight sm:text-5xl mb-4">
          Top 10 Best Sellers
        </h2>
        <p class="text-gray-300 max-w-xl mx-auto text-lg font-light">
          Check out our best selling premium products. Unbeatable quality, loved by thousands.
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Re-use Product Card but force a slightly different styling if needed, 
             or just use the standard ProductCard. Since ProductCard expects product, 
             we'll just pass it through. -->
        <ProductCard 
          v-for="product in bestSellers" 
          :key="product._id" 
          :product="product"
          @add-to-cart="$emit('add-to-cart', $event)"
          @quick-view="$emit('quick-view', $event)"
        />
      </div>

      <div class="mt-16 flex justify-center">
        <button @click="$emit('view-all')" class="px-8 py-3 bg-white text-primary rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1">
          View All Best Sellers
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProductCard from './../common/ProductCard.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

defineEmits(['add-to-cart', 'quick-view', 'view-all']);

// Grab top 4 products sorted by rating for the best sellers section
const bestSellers = computed(() => {
  return [...props.products]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);
});
</script>
