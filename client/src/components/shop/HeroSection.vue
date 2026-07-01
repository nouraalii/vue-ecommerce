<template>
  <div class="w-full px-4 sm:px-6 lg:px-8 mt-6 mb-16">
    <div class="max-w-7xl mx-auto bg-primary rounded-[2.5rem] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between p-12 lg:p-20 shadow-xl">
      
      <!-- Subtle Background Decor -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      
      <!-- Text Content -->
      <div class="lg:w-1/2 z-10 space-y-6 text-center lg:text-left mb-12 lg:mb-0">
        <span class="text-sm font-semibold tracking-wider text-accent uppercase bg-white/10 px-4 py-1.5 rounded-full inline-block">
          New Arrival
        </span>
        <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
          The Premium<br/>Shop
        </h1>
        <p class="text-gray-300 text-lg max-w-md mx-auto lg:mx-0 font-light">
          Everything you need from A to Z in top quality. Elevate your everyday with our curated collection.
        </p>
        <div class="pt-4">
          <button @click="$emit('explore')" class="px-8 py-3.5 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg text-lg">
            Shop Now
          </button>
        </div>
      </div>

      <!-- Right Graphic -->
      <div class="lg:w-1/2 relative flex justify-center z-10 w-full h-80 lg:h-auto">
        <!-- Badge -->
        <div class="absolute top-0 right-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex flex-col items-center justify-center transform rotate-3">
          <span class="text-2xl font-black text-primary">1200+</span>
          <span class="text-xs text-gray-500 font-medium text-center">Premium<br/>Products</span>
        </div>
        
        <!-- Large Floating Image -->
        <img 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Featured Product" 
          class="w-80 h-80 lg:w-[500px] lg:h-[500px] object-cover rounded-[2rem] shadow-2xl transform lg:translate-x-12 lg:scale-110 rotate-[-5deg] hover:rotate-0 transition-transform duration-700"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
