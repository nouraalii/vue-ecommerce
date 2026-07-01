<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">My Orders</h1>
      <p class="mt-4 text-lg text-gray-500">Track and manage your past purchases.</p>
    </div>

    <div v-if="loading" class="space-y-6">
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
            <!-- Timeline Component -->
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

            <!-- Items -->
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

            <!-- Totals -->
            <div class="bg-surfaceAlt rounded-2xl p-6 flex flex-col sm:flex-row sm:justify-end">
               <div class="w-full sm:w-1/2 lg:w-1/3 space-y-3 text-sm font-medium text-gray-500">
                  <div class="flex justify-between"><span>Subtotal</span><span class="text-gray-900">${{ order.subTotal.toFixed(2) }}</span></div>
                  <div class="flex justify-between"><span>Shipping</span><span class="text-gray-900">${{ order.shippingFee.toFixed(2) }}</span></div>
                  <div class="flex justify-between"><span>Tax</span><span class="text-gray-900">${{ order.tax.toFixed(2) }}</span></div>
                  <div class="flex justify-between border-t border-gray-200 pt-4 mt-2 text-lg font-black text-gray-900">
                    <span>Total</span><span class="text-primary">${{ order.totalAmount.toFixed(2) }}</span>
                  </div>
               </div>
            </div>

          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import OrderService from '../../services/order.service';

const toast = useToast();
const orders = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await OrderService.getMyOrders();
    orders.value = response.data;
  } catch (error) {
    toast.error('Failed to load orders');
  } finally {
    loading.value = false;
  }
});

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
