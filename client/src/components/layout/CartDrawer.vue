<template>
  <div>
    <!-- Backdrop -->
    <transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        @click="closeDrawer"
      ></div>
    </transition>

    <!-- Drawer panel -->
    <transition name="slide-right">
      <div 
        v-if="isOpen" 
        class="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 flex flex-col h-full transform transition-transform"
      >
        <!-- Header -->
        <div class="px-4 py-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between sm:px-6">
          <h2 class="text-lg font-medium text-gray-900">Shopping Cart</h2>
          <button @click="closeDrawer" class="text-gray-400 hover:text-gray-500 transition-colors">
            <span class="sr-only">Close panel</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center h-full text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p class="mt-1 text-sm text-gray-500">Looks like you haven't added anything to your cart yet.</p>
            <button @click="closeDrawer" class="mt-6 text-primary font-medium hover:text-indigo-500">Start Shopping &rarr;</button>
          </div>
          
          <ul v-else class="space-y-6">
            <li v-for="(item, index) in cartItems" :key="index" class="flex py-2">
              <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <img :src="item.product.images?.[0]?.url || 'https://placehold.co/200'" :alt="item.product.title" class="h-full w-full object-cover object-center" />
              </div>

              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3 class="line-clamp-2 pr-4"><router-link :to="`/product/${item.product._id}`" @click="closeDrawer">{{ item.product.title }}</router-link></h3>
                    <p class="ml-4">${{ (item.product.basePrice * item.quantity).toFixed(2) }}</p>
                  </div>
                  <p v-if="item.variant" class="mt-1 text-sm text-gray-500">{{ item.variant }}</p>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button @click="updateQuantity(index, item.quantity - 1)" class="px-2 py-1 text-gray-600 hover:text-primary">-</button>
                    <span class="px-2 font-medium">{{ item.quantity }}</span>
                    <button @click="updateQuantity(index, item.quantity + 1)" class="px-2 py-1 text-gray-600 hover:text-primary">+</button>
                  </div>

                  <div class="flex">
                    <button @click="removeItem(index)" type="button" class="font-medium text-red-500 hover:text-red-400">Remove</button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer / Checkout Summary -->
        <div v-if="cartItems.length > 0" class="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
          <div class="flex justify-between text-base font-medium text-gray-900 mb-2">
            <p>Subtotal</p>
            <p>${{ subtotal.toFixed(2) }}</p>
          </div>
          <div class="flex justify-between text-sm text-gray-500 mb-4">
            <p>Taxes and shipping calculated at checkout.</p>
          </div>
          <div class="mt-6">
            <router-link to="/cart" @click="closeDrawer" class="flex items-center justify-center rounded-full border border-transparent bg-primary px-6 py-3 text-base font-bold text-white shadow-md hover:bg-secondary active:scale-95 transition-all">
              View Cart
            </router-link>
          </div>
          <div class="mt-4 flex justify-center text-center text-sm text-gray-500">
            <p>
              or
              <button @click="closeDrawer" type="button" class="font-medium text-primary hover:text-indigo-500">
                Continue Shopping<span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isOpen = computed(() => store.getters['cart/isDrawerOpen']);
const cartItems = computed(() => store.getters['cart/cartItems']);
const subtotal = computed(() => store.getters['cart/cartSubtotal']);

const closeDrawer = () => {
  store.dispatch('cart/closeDrawer');
};

const updateQuantity = (index, quantity) => {
  store.dispatch('cart/updateItemQuantity', { index, quantity });
};

const removeItem = (index) => {
  store.dispatch('cart/removeFromCart', index);
};
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
