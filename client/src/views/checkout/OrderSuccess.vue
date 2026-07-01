<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <h2 class="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
        <p class="text-sm text-gray-500 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p class="text-sm font-medium text-gray-700">Order Reference ID:</p>
          <p class="text-lg font-mono font-bold text-primary mt-1">{{ route.params.id }}</p>
        </div>
        
        <div class="space-y-3">
          <router-link :to="`/customer/dashboard`" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
            Track Order Status
          </router-link>
          
          <router-link to="/" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>
