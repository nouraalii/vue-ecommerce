<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Your Cart</h1>
      <p class="mt-4 text-lg text-gray-500">Review your items before proceeding to secure checkout.</p>
    </div>

    <div v-if="cartItems.length === 0" class="text-center py-20 bg-white rounded-[2rem] shadow-sm max-w-3xl mx-auto">
      <svg class="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is completely empty</h2>
      <p class="text-gray-500 mb-8">Looks like you haven't made your choice yet.</p>
      <router-link to="/" class="px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors shadow-lg">
        Start Shopping Now
      </router-link>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-12">
      <!-- Left Column: Cart Items -->
      <div class="lg:w-2/3">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <ul class="divide-y divide-gray-100">
            <li v-for="(item, index) in cartItems" :key="index" class="py-6 flex items-center">
              <div class="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                <img :src="item.product.images?.[0]?.url || 'https://placehold.co/200'" :alt="item.product.title" class="h-full w-full object-cover" />
              </div>

              <div class="ml-6 flex flex-1 flex-col justify-between h-32">
                <div>
                  <div class="flex justify-between text-lg font-bold text-gray-900">
                    <h3 class="line-clamp-1"><router-link :to="`/product/${item.product._id}`" class="hover:text-primary transition-colors">{{ item.product.title }}</router-link></h3>
                    <p class="ml-4 text-primary">${{ (item.product.basePrice * item.quantity).toFixed(2) }}</p>
                  </div>
                  <p v-if="item.variant" class="mt-1 text-sm text-gray-500">{{ item.variant }}</p>
                  <p class="mt-1 text-sm text-gray-400 font-medium">${{ item.product.basePrice.toFixed(2) }} each</p>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center border border-gray-200 rounded-full px-2 py-1 bg-gray-50">
                    <button @click="updateQuantity(index, item, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-white rounded-full transition-colors font-bold text-lg">-</button>
                    <span class="w-8 text-center font-bold text-gray-900">{{ item.quantity }}</span>
                    <button @click="updateQuantity(index, item, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-white rounded-full transition-colors font-bold text-lg">+</button>
                  </div>

                  <button @click="removeItem(index, item)" type="button" class="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column: Order Summary & E-commerce Tools -->
      <div class="lg:w-1/3 space-y-8">
        
        <!-- Summary Card -->
        <div class="bg-surfaceAlt rounded-[2rem] shadow-sm p-8 border border-white/50">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6 text-gray-600 font-medium">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="text-gray-900 font-bold">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Estimated Tax</span>
              <span class="text-gray-900 font-bold">$0.00</span>
            </div>
            
            <div v-if="appliedPromo" class="flex justify-between text-secondary bg-white p-3 rounded-xl shadow-sm border border-secondary/20">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                Promo ({{ appliedPromo.code }})
              </span>
              <span class="font-bold">-${{ discountAmount.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4 mb-8">
            <div class="flex justify-between items-center">
              <span class="text-xl font-extrabold text-gray-900">Total</span>
              <span class="text-2xl font-black text-primary">${{ total.toFixed(2) }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">Shipping costs calculated at checkout.</p>
          </div>

          <router-link to="/checkout" class="block w-full text-center px-8 py-4 bg-primary text-white font-bold text-lg rounded-full shadow-lg hover:bg-secondary hover:-translate-y-1 transition-all">
            Proceed to Checkout
          </router-link>
        </div>

        <!-- Promo Code Input -->
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
            Apply Promo Code
          </h3>
          <div class="flex space-x-2">
            <input 
              type="text" 
              v-model="promoCode" 
              placeholder="e.g. VUE20" 
              class="flex-1 rounded-full border-gray-200 focus:ring-primary focus:border-primary text-sm px-4"
              :disabled="loadingPromo"
            />
            <button 
              @click="applyPromo" 
              class="px-6 py-2 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
              :disabled="!promoCode || loadingPromo"
            >
              Apply
            </button>
          </div>
          <p v-if="promoError" class="mt-2 text-sm text-red-500">{{ promoError }}</p>
          <button v-if="appliedPromo" @click="removePromo" class="mt-3 text-sm text-red-500 font-medium hover:underline">Remove Promo Code</button>
        </div>

        <!-- Shipping Estimator -->
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Estimate Shipping
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Country</label>
              <select class="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary text-sm text-gray-700 bg-gray-50">
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Zip/Postal Code</label>
              <input type="text" placeholder="Zip Code" class="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary text-sm bg-gray-50" />
            </div>
            <button class="w-full py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Calculate
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Cross-Selling Section -->
    <div v-if="cartItems.length > 0" class="mt-24 border-t border-gray-200 pt-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">You Might Also Like</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductCard 
          v-for="product in recommendedProducts" 
          :key="product._id" 
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import ProductCard from '../../components/common/ProductCard.vue';
import OrderService from '../../services/order.service';

const store = useStore();
const toast = useToast();

const cartItems = computed(() => store.getters['cart/cartItems']);
const subtotal = computed(() => store.getters['cart/cartSubtotal']);

// Promo Logic
const promoCode = ref('');
const promoError = ref('');
const loadingPromo = ref(false);

const appliedPromo = computed(() => store.getters['cart/appliedPromo']);
const discountAmount = computed(() => store.getters['cart/cartDiscount']);
const total = computed(() => store.getters['cart/cartTotal']);

const applyPromo = async () => {
  try {
    promoError.value = '';
    loadingPromo.value = true;
    const response = await OrderService.validatePromo(promoCode.value, subtotal.value);
    
    store.dispatch('cart/applyPromo', response.data);
    toast.success(`Promo code ${response.data.code} applied.`);
    promoCode.value = '';
  } catch (error) {
    promoError.value = error.response?.data?.message || 'Invalid promo code';
  } finally {
    loadingPromo.value = false;
  }
};

const removePromo = () => {
  store.dispatch('cart/removePromo');
  promoCode.value = '';
  toast.info('Promo code removed');
};

// Cart Logic
const updateQuantity = (index, item, quantity) => {
  if (quantity < 1) return;
  store.dispatch('cart/updateItemQuantity', { index, productId: item.product._id || item.product.id || item.product, quantity });
};

const removeItem = (index, item) => {
  store.dispatch('cart/removeFromCart', { index, productId: item.product._id || item.product.id || item.product });
};

const handleAddToCart = (product) => {
  store.dispatch('cart/addToCart', { product, quantity: 1 });
  toast.success(`Added ${product.title} to cart`);
};

// Cross-selling logic
const allProducts = computed(() => store.getters['products/allProducts']);
const recommendedProducts = computed(() => {
  // Simple recommendation: grab 4 random products that aren't already in the cart
  const inCartIds = cartItems.value.map(item => item.product._id);
  const available = allProducts.value.filter(p => !inCartIds.includes(p._id));
  
  // Shuffle array
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
});

onMounted(() => {
  if (allProducts.value.length === 0) {
    store.dispatch('products/fetchProducts');
  }
});
</script>
