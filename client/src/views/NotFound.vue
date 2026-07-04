<template>
  <div class="min-h-[70vh] flex items-center justify-center bg-background px-4">
    <div class="text-center">
      <h1 class="text-9xl font-extrabold text-primary tracking-tight">404</h1>
      <p class="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Page not found</p>
      <p class="mt-4 text-gray-500 max-w-md mx-auto">Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.</p>
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link to="/" class="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors duration-300">
          Return Home
        </router-link>
        <router-link to="/shop" class="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 font-bold border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-300">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
