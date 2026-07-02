<template>
  <div class="bg-background min-h-screen">
    <!-- 1. Hero Section -->
    <HeroSection @explore="scrollToProducts" />

    <!-- 2. Product Hub (Tabs + Grid) -->
    <div ref="productsSection" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Product Hub</h2>
        <p class="mt-4 max-w-2xl mx-auto text-gray-500">We have more than 1200+ Products available.</p>
      </div>

      <!-- Horizontal Category Tabs -->
      <CategoryTabs 
        :categories="categories" 
        :modelValue="currentCategory" 
        @update:modelValue="filterByCategory" 
      />

      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <p class="text-sm text-gray-500 font-medium">Showing {{ totalProducts }} results</p>
        <div class="flex items-center space-x-2 mt-4 sm:mt-0">
          <label for="sort" class="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            id="sort" 
            v-model="sortBy" 
            @change="handleSort"
            class="block w-40 pl-3 pr-10 py-2 text-sm bg-transparent border-none focus:ring-0 focus:outline-none font-semibold text-gray-900"
          >
            <option value="-createdAt">New Arrivals</option>
            <option value="basePrice">Price: Low to High</option>
            <option value="-basePrice">Price: High to Low</option>
            <option value="-averageRating">Top Rated</option>
          </select>
        </div>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 8" :key="i" class="bg-white rounded-3xl shadow-sm overflow-hidden h-80">
          <div class="h-48 bg-gray-100 animate-pulse"></div>
          <div class="p-6 space-y-3">
            <div class="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
            <div class="h-5 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-gray-100 rounded w-1/2 animate-pulse mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-24 bg-white rounded-[2rem] shadow-sm">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-4 text-lg font-bold text-gray-900">No products found</h3>
        <p class="mt-2 text-gray-500">Try adjusting your category or checking back later.</p>
        <div class="mt-6">
          <button @click="clearFilters" class="px-6 py-2 bg-primary text-white font-medium rounded-full shadow-md hover:bg-secondary transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard 
          v-for="(product, index) in products" 
          :key="product._id" 
          :product="product"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
          @add-to-cart="addToCart"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalProducts > products.length" class="mt-12 flex justify-center">
         <button @click="loadMore" class="px-8 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm">
           Load More
         </button>
      </div>
    </div>

    <!-- 3. Features Section -->
    <FeaturesSection />

    <!-- 4. Featured Products Section -->
    <FeaturedProductsSection :products="products" @add-to-cart="addToCart" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import ProductCard from '../../components/common/ProductCard.vue';
import HeroSection from '../../components/shop/HeroSection.vue';
import CategoryTabs from '../../components/shop/CategoryTabs.vue';
import FeaturesSection from '../../components/shop/FeaturesSection.vue';
import FeaturedProductsSection from '../../components/shop/FeaturedProductsSection.vue';

const store = useStore();
const toast = useToast();

const productsSection = ref(null);
const scrollToProducts = () => {
  productsSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const sortBy = ref('-createdAt');
const currentCategory = ref('');

const products = computed(() => store.getters['products/allProducts']);
const categories = computed(() => store.getters['products/allCategories']);
const loading = computed(() => store.getters['products/isLoading']);
const totalProducts = computed(() => store.getters['products/totalCount']);

onMounted(async () => {
  await store.dispatch('products/fetchCategories');
  await store.dispatch('products/fetchProducts');
});

const filterByCategory = (categoryId) => {
  currentCategory.value = categoryId;
  store.dispatch('products/updateFilters', { category: categoryId, page: 1 });
};

const handleSort = () => {
  store.dispatch('products/updateFilters', { sort: sortBy.value, page: 1 });
};

const clearFilters = () => {
  currentCategory.value = '';
  sortBy.value = '-createdAt';
  currentLimit.value = 12;
  store.dispatch('products/updateFilters', { keyword: '', category: '', sort: '-createdAt', page: 1, limit: 12 });
};

const currentLimit = ref(12);
const loadMore = () => {
  currentLimit.value += 12;
  store.dispatch('products/updateFilters', { limit: currentLimit.value });
};

const addToCart = (product) => {
  store.dispatch('cart/addToCart', { product, quantity: 1 });
  toast.success(`Added ${product.title} to cart`);
};
</script>
