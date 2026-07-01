<template>
  <div class="bg-gray-50 min-h-screen pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div v-if="cartItems.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <router-link to="/" class="text-primary hover:text-indigo-500 font-medium">Continue Shopping</router-link>
      </div>

      <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <!-- Left Column: Checkout Forms -->
        <div class="lg:col-span-7">
          <form @submit.prevent="placeOrder">
            <!-- Contact Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div class="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">1. Contact Information</h2>
                <router-link v-if="!isLoggedIn" to="/login" class="text-sm font-medium text-primary hover:text-indigo-500">Log in</router-link>
              </div>
              <div class="p-6">
                <div v-if="isLoggedIn" class="flex items-center space-x-3 text-sm text-gray-700">
                  <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                  <span>Logged in as <strong>{{ user?.email }}</strong></span>
                </div>
                <div v-else>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <div class="mt-1">
                    <input type="email" id="email" v-model="form.email" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 class="text-lg font-medium text-gray-900">2. Shipping Address</h2>
              </div>
              <div class="p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div class="sm:col-span-2">
                  <label for="fullName" class="block text-sm font-medium text-gray-700">Full name</label>
                  <div class="mt-1">
                    <input type="text" id="fullName" v-model="form.shippingAddress.fullName" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border" />
                  </div>
                </div>

                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                  <div class="mt-1">
                    <input type="text" id="address" v-model="form.shippingAddress.address" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border" />
                  </div>
                </div>

                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                  <div class="mt-1">
                    <input type="text" id="city" v-model="form.shippingAddress.city" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border" />
                  </div>
                </div>

                <div>
                  <label for="postalCode" class="block text-sm font-medium text-gray-700">Postal code</label>
                  <div class="mt-1">
                    <input type="text" id="postalCode" v-model="form.shippingAddress.postalCode" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border" />
                  </div>
                </div>
                
                <div class="sm:col-span-2">
                  <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                  <div class="mt-1">
                    <select id="country" v-model="form.shippingAddress.country" required class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border bg-white">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="EG">Egypt</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 class="text-lg font-medium text-gray-900">3. Payment Method</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex items-center">
                    <input id="payment-stripe" name="payment-method" type="radio" value="stripe" v-model="form.paymentMethod" class="focus:ring-primary h-4 w-4 text-primary border-gray-300" />
                    <label for="payment-stripe" class="ml-3 block text-sm font-medium text-gray-700">
                      Credit Card (Stripe)
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input id="payment-paypal" name="payment-method" type="radio" value="paypal" v-model="form.paymentMethod" class="focus:ring-primary h-4 w-4 text-primary border-gray-300" />
                    <label for="payment-paypal" class="ml-3 block text-sm font-medium text-gray-700">
                      PayPal
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input id="payment-cod" name="payment-method" type="radio" value="cod" v-model="form.paymentMethod" class="focus:ring-primary h-4 w-4 text-primary border-gray-300" />
                    <label for="payment-cod" class="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>

                <div v-if="form.paymentMethod === 'stripe'" class="mt-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
                  <div class="space-y-4">
                    <div>
                      <label for="cardNumber" class="block text-sm font-medium text-gray-700">Card number</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4C2.89 4 2 4.89 2 6v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                        </div>
                        <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" class="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary py-2 px-3 border bg-white" />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none gap-1">
                          <!-- Visa/MC Mock Icons -->
                          <div class="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center italic">VISA</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="expiry" class="block text-sm font-medium text-gray-700">Expiration date</label>
                        <input type="text" id="expiry" placeholder="MM/YY" class="mt-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary py-2 px-3 border bg-white" />
                      </div>
                      <div>
                        <label for="cvc" class="block text-sm font-medium text-gray-700">CVC</label>
                        <input type="text" id="cvc" placeholder="123" class="mt-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary py-2 px-3 border bg-white" />
                      </div>
                    </div>
                    
                    <div>
                      <label for="nameOnCard" class="block text-sm font-medium text-gray-700">Name on card</label>
                      <input type="text" id="nameOnCard" placeholder="John Doe" class="mt-1 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary py-2 px-3 border bg-white" />
                    </div>
                    <p class="text-xs text-gray-500 flex items-center mt-2">
                      <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                      Payments are secure and encrypted.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <button type="submit" :disabled="loading" class="w-full sm:w-auto flex justify-center items-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50">
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Place Order
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="mt-10 lg:mt-0 lg:col-span-5">
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Order summary</h2>
            
            <ul class="text-sm font-medium text-gray-900 divide-y divide-gray-200 mb-6">
              <li v-for="item in cartItems" :key="item.product._id" class="flex items-start py-6 space-x-4">
                <img :src="item.product.images?.[0]?.url" :alt="item.product.title" class="flex-none w-20 h-20 rounded-md object-center object-cover bg-gray-100" />
                <div class="flex-auto space-y-1">
                  <h3 class="line-clamp-2">{{ item.product.title }}</h3>
                  <p v-if="item.variant" class="text-gray-500">{{ item.variant }}</p>
                  <p class="text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="flex-none text-base font-medium">${{ (item.product.basePrice * item.quantity).toFixed(2) }}</p>
              </li>
            </ul>

            <dl class="text-sm font-medium text-gray-900 space-y-4 border-t border-gray-200 pt-6">
              <div class="flex items-center justify-between">
                <dt class="text-gray-600">Subtotal</dt>
                <dd>${{ subtotal.toFixed(2) }}</dd>
              </div>

              <!-- Promo Code Input -->
              <div class="pt-4 border-t border-gray-200">
                <label for="promoCode" class="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <div class="flex space-x-2">
                  <input type="text" id="promoCode" v-model="promoCode" :disabled="appliedPromo" placeholder="e.g. VUE20" class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border" />
                  <button @click="applyPromo" type="button" :disabled="!promoCode || appliedPromo || applyingPromo" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none disabled:opacity-50">
                    {{ applyingPromo ? '...' : (appliedPromo ? 'Applied' : 'Apply') }}
                  </button>
                </div>
                <button v-if="appliedPromo" @click="removePromo" type="button" class="text-xs text-red-600 hover:text-red-800 mt-2">Remove promo code</button>
              </div>

              <div v-if="appliedPromo" class="flex items-center justify-between text-green-600 pt-4">
                <dt class="text-sm font-medium">Discount ({{ appliedPromo.discountValue }}%)</dt>
                <dd class="text-sm font-medium">-${{ discountAmount.toFixed(2) }}</dd>
              </div>

              <div class="flex items-center justify-between pt-4">
              <div class="flex items-center justify-between">
                <dt class="text-gray-600">Shipping</dt>
                <dd>${{ shippingFee.toFixed(2) }}</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-gray-600">Taxes</dt>
                <dd>${{ tax.toFixed(2) }}</dd>
              </div>
              <div class="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt class="text-base text-gray-900">Total</dt>
                <dd class="text-base text-gray-900">${{ finalTotal.toFixed(2) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import OrderService from '../../services/order.service';

const store = useStore();
const router = useRouter();
const toast = useToast();

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
const user = computed(() => store.getters['auth/user']);
const cartItems = computed(() => store.getters['cart/cartItems']);
const subtotal = computed(() => store.getters['cart/cartSubtotal']);
const tax = computed(() => store.getters['cart/cartTax']);
const shippingFee = computed(() => store.getters['cart/shippingFee']);
const total = computed(() => store.getters['cart/cartTotal']);

const loading = ref(false);

const form = reactive({
  email: user.value?.email || '',
  shippingAddress: {
    fullName: user.value?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US'
  },
  paymentMethod: 'stripe'
});

const promoCode = ref('');
const applyingPromo = ref(false);

const appliedPromo = computed(() => store.getters['cart/appliedPromo']);
const discountAmount = computed(() => store.getters['cart/cartDiscount']);
const finalTotal = computed(() => store.getters['cart/cartTotal']);

const applyPromo = async () => {
  if (!promoCode.value) return;
  applyingPromo.value = true;
  try {
    const response = await OrderService.validatePromo(promoCode.value);
    store.dispatch('cart/applyPromo', response.data.data ? response.data.data.promo : response.data);
    toast.success('Promo code applied!');
    promoCode.value = '';
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid promo code');
    promoCode.value = '';
  } finally {
    applyingPromo.value = false;
  }
};

const removePromo = () => {
  store.dispatch('cart/removePromo');
  promoCode.value = '';
  toast.info('Promo code removed');
};

const placeOrder = async () => {
  if (!isLoggedIn.value) {
    toast.warning('Please log in to place an order.');
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    const orderData = {
      orderItems: cartItems.value.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      shippingAddress: form.shippingAddress,
      paymentMethod: form.paymentMethod,
      taxPrice: tax.value,
      shippingPrice: shippingFee.value,
      promoCode: appliedPromo.value ? appliedPromo.value.code : null,
      discountAmount: discountAmount.value
    };

    const response = await OrderService.createOrder(orderData);
    
    store.dispatch('cart/clearCart');
    toast.success('Order placed successfully!');
    router.push(`/order-success/${response.data._id}`);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to place order');
  } finally {
    loading.value = false;
  }
};
</script>
