<template>
  <div class="bg-primary py-24 px-4 sm:px-6 lg:px-8 mt-12 rounded-[3rem] mx-4 sm:mx-8 mb-12 shadow-2xl relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-white tracking-tight sm:text-5xl mb-4">
          Featured Products
        </h2>
        <p class="text-gray-300 max-w-xl mx-auto text-lg font-light">
          Check out highly rated premium products from our collection.
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard 
          v-for="product in featuredProducts" 
          :key="product._id" 
          :product="product"
          @add-to-cart="$emit('add-to-cart', $event)"
          @quick-view="$emit('quick-view', $event)"
        />
      </div>

      <div class="mt-16 flex justify-center">
        <button @click="$emit('view-all')" class="px-8 py-3 bg-white text-primary rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1">
          View All Products
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

const featuredProducts = computed(() => {
  return [...props.products]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);
});
</script>
