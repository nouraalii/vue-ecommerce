<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">My Account</h1>
      <p class="mt-4 text-lg text-gray-500">Manage your orders, profile, and payment methods.</p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 mb-8">
      <button 
        @click="activeTab = 'orders'" 
        :class="['px-6 py-3 font-medium text-sm', activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700']"
      >
        My Orders
      </button>
      <button 
        @click="activeTab = 'profile'" 
        :class="['px-6 py-3 font-medium text-sm', activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700']"
      >
        Profile
      </button>
      <button 
        @click="activeTab = 'payments'" 
        :class="['px-6 py-3 font-medium text-sm', activeTab === 'payments' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700']"
      >
        Payment Methods
      </button>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'">
      <div v-if="loadingOrders" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 animate-pulse">
          <div class="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
          <div class="h-10 bg-gray-100 rounded w-full"></div>
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded-[2rem] shadow-sm max-w-3xl mx-auto">
        <svg class="mx-auto h-16 w-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
        <p class="text-gray-500 mb-8">You haven't placed any orders yet.</p>
        <router-link to="/" class="px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors shadow-lg">
          Start Shopping Now
        </router-link>
      </div>

      <div v-else class="space-y-8">
        <div v-for="order in orders" :key="order._id" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
          <div class="px-6 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 border-b border-gray-100">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Order #{{ order._id.substring(order._id.length - 8).toUpperCase() }}</h3>
              <p class="mt-1 text-sm font-medium text-gray-500">Placed on {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="mt-4 sm:mt-0">
              <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold capitalize" 
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.orderStatus === 'placed',
                      'bg-blue-100 text-blue-800': order.orderStatus === 'processing',
                      'bg-cyan-100 text-cyan-800': order.orderStatus === 'partially_shipped',
                      'bg-indigo-100 text-indigo-800': order.orderStatus === 'shipped',
                      'bg-green-100 text-green-800': order.orderStatus === 'delivered',
                      'bg-red-100 text-red-800': order.orderStatus === 'cancelled'
                    }">
                {{ order.orderStatus }}
              </span>
            </div>
          </div>
          
          <div class="px-6 py-8">
            <dl>
              <div class="mb-8">
                 <h4 class="text-lg font-bold text-gray-900 mb-6">Tracking</h4>
                 <div class="relative">
                   <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
                     <div :style="`width: ${getProgress(order.orderStatus)}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
                   </div>
                   <div class="flex justify-between text-sm font-bold text-gray-400">
                     <span :class="{'text-primary': getProgress(order.orderStatus) >= 25}">Placed</span>
                     <span :class="{'text-primary': getProgress(order.orderStatus) >= 50}">Confirmed</span>
                     <span :class="{'text-primary': getProgress(order.orderStatus) >= 75}">Shipped</span>
                     <span :class="{'text-primary': getProgress(order.orderStatus) === 100}">Delivered</span>
                   </div>
                 </div>
              </div>

              <div class="border-t border-gray-100 pt-8 mb-8">
                <h4 class="text-lg font-bold text-gray-900 mb-6">Items</h4>
                <ul class="divide-y divide-gray-100">
                  <li v-for="item in order.items" :key="item._id" class="py-4 flex items-center">
                    <div class="flex-1 flex justify-between items-center">
                      <div>
                        <router-link :to="`/product/${item.product}`" class="text-base font-bold text-gray-900 hover:text-primary transition-colors">{{ item.name }}</router-link>
                        <p class="text-sm font-medium text-gray-500 mt-1">Qty: {{ item.quantity }}</p>
                      </div>
                      <p class="text-lg font-black text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="bg-surfaceAlt rounded-2xl p-6 flex flex-col sm:flex-row sm:justify-end">
                 <div class="w-full sm:w-1/2 lg:w-1/3 space-y-3 text-sm font-medium text-gray-500">
                    <div class="flex justify-between"><span>Subtotal</span><span class="text-gray-900">${{ Number(order.subTotal || 0).toFixed(2) }}</span></div>
                    <div class="flex justify-between"><span>Shipping</span><span class="text-gray-900">${{ (order.shippingPrice || 0).toFixed(2) }}</span></div>
                    <div v-if="order.discountAmount" class="flex justify-between text-green-600"><span>Discount</span><span>-${{ Number(order.discountAmount || 0).toFixed(2) }}</span></div>
                    <div class="flex justify-between"><span>Tax</span><span class="text-gray-900">${{ Number(order.tax || 0).toFixed(2) }}</span></div>
                    <div class="flex justify-between border-t border-gray-200 pt-4 mt-2 text-lg font-black text-gray-900">
                      <span>Total</span><span class="text-primary">${{ Number(order.totalAmount || 0).toFixed(2) }}</span>
                    </div>
                 </div>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Tab -->
    <div v-if="activeTab === 'profile'" class="bg-white shadow-sm rounded-[2rem] p-8 max-w-3xl">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" v-model="profile.name" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" v-model="profile.phone" pattern="[0-9]{10,15}" title="Phone number must be 10-15 digits" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Address (Street)</label>
          <input type="text" v-model="profile.street" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">City</label>
            <input type="text" v-model="profile.city" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Country</label>
            <input type="text" v-model="profile.country" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
          </div>
        </div>
        <div class="pt-4">
          <button type="submit" :disabled="savingProfile" class="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors disabled:opacity-50">
            <span v-if="savingProfile">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Payment Methods Tab -->
    <div v-if="activeTab === 'payments'" class="max-w-3xl">
      <div class="bg-white shadow-sm rounded-[2rem] p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Saved Payment Methods</h2>
        <div v-if="loadingPayments" class="animate-pulse flex space-x-4">
          <div class="h-20 bg-gray-200 rounded w-full"></div>
        </div>
        <div v-else-if="paymentMethods.length === 0" class="text-gray-500">
          No saved payment methods.
        </div>
        <div v-else class="space-y-4">
          <div v-for="method in paymentMethods" :key="method._id" class="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600 text-xs uppercase">{{ method.brand }}</div>
              <div>
                <p class="font-bold text-gray-900">{{ method.cardHolder }}</p>
                <p class="text-sm text-gray-500">**** **** **** {{ method.last4 }}</p>
                <p class="text-xs text-gray-400">Expires: {{ method.expiryMonth }}/{{ method.expiryYear }}</p>
              </div>
            </div>
            <button @click="removePaymentMethod(method._id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Remove</button>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-sm rounded-[2rem] p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Add Payment Method</h2>
        <form @submit.prevent="addPaymentMethod" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Holder Name</label>
            <input type="text" v-model="newCard.cardHolder" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Number (Mock)</label>
            <input type="text" v-model="newCard.number" required pattern="\d{16}" title="16 digit card number" placeholder="1234123412341234" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Exp Month</label>
              <input type="number" v-model="newCard.expiryMonth" min="1" max="12" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Exp Year</label>
              <input type="number" v-model="newCard.expiryYear" min="2024" max="2040" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CVV</label>
              <input type="text" required pattern="\d{3,4}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border" />
              <p class="text-xs text-gray-400 mt-1">Not stored.</p>
            </div>
          </div>
          <button type="submit" :disabled="savingPayment" class="mt-4 px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors disabled:opacity-50">
            <span v-if="savingPayment">Adding...</span>
            <span v-else>Add Card</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import OrderService from '../../services/order.service';
import AuthService from '../../services/auth.service';

const toast = useToast();
const store = useStore();

const activeTab = ref('orders');

const orders = ref([]);
const loadingOrders = ref(true);

const profile = reactive({
  name: '',
  phone: '',
  street: '',
  city: '',
  country: ''
});
const savingProfile = ref(false);

const paymentMethods = ref([]);
const loadingPayments = ref(true);
const savingPayment = ref(false);
const newCard = reactive({
  cardHolder: '',
  number: '',
  expiryMonth: '',
  expiryYear: ''
});

onMounted(async () => {
  loadOrders();
  loadProfile();
  loadPaymentMethods();
});

const loadOrders = async () => {
  try {
    const response = await OrderService.getMyOrders();
    orders.value = response.data;
  } catch (error) {
    toast.error('Failed to load orders');
  } finally {
    loadingOrders.value = false;
  }
};

const loadProfile = async () => {
  try {
    const response = await AuthService.getMe();
    if (response.data) {
      profile.name = response.data.name || '';
      profile.phone = response.data.phone || '';
      if (response.data.addresses && response.data.addresses.length > 0) {
        const addr = response.data.addresses[0];
        profile.street = addr.street || '';
        profile.city = addr.city || '';
        profile.country = addr.country || '';
      }
    }
  } catch (error) {
    toast.error('Failed to load profile');
  }
};

const saveProfile = async () => {
  if (!profile.name) {
    toast.error('Name is required');
    return;
  }
  
  if (profile.phone && !/^[0-9]{10,15}$/.test(profile.phone)) {
    toast.error('Invalid phone format');
    return;
  }

  savingProfile.value = true;
  try {
    const addresses = [{ street: profile.street, city: profile.city, country: profile.country }];
    const data = await AuthService.updateProfile({ name: profile.name, phone: profile.phone, addresses });
    store.commit('auth/SET_USER', data.data);
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Failed to update profile');
  } finally {
    savingProfile.value = false;
  }
};

const loadPaymentMethods = async () => {
  try {
    const response = await AuthService.getPaymentMethods();
    paymentMethods.value = response.data || [];
  } catch (error) {
    toast.error('Failed to load payment methods');
  } finally {
    loadingPayments.value = false;
  }
};

const addPaymentMethod = async () => {
  savingPayment.value = true;
  try {
    const last4 = newCard.number.slice(-4);
    const brand = newCard.number.startsWith('4') ? 'Visa' : newCard.number.startsWith('5') ? 'MasterCard' : 'Card';
    
    const response = await AuthService.addPaymentMethod({
      cardHolder: newCard.cardHolder,
      last4,
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      brand
    });
    paymentMethods.value = response.data;
    toast.success('Payment method added');
    newCard.cardHolder = '';
    newCard.number = '';
    newCard.expiryMonth = '';
    newCard.expiryYear = '';
  } catch (error) {
    toast.error('Failed to add payment method');
  } finally {
    savingPayment.value = false;
  }
};

const removePaymentMethod = async (id) => {
  try {
    const response = await AuthService.removePaymentMethod(id);
    paymentMethods.value = response.data;
    toast.success('Payment method removed');
  } catch (error) {
    toast.error('Failed to remove payment method');
  }
};

const getProgress = (status) => {
  switch (status) {
    case 'placed': return 25;
    case 'processing': return 50;
    case 'partially_shipped': return 65;
    case 'shipped': return 75;
    case 'delivered': return 100;
    case 'cancelled': return 0;
    default: return 0;
  }
};
</script>
