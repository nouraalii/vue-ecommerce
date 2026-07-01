<template>
  <footer class="bg-primary text-white pt-20 pb-10 rounded-t-[3rem] mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        <!-- Brand / Contact -->
        <div class="space-y-6">
          <router-link to="/" class="flex items-center gap-2 text-white font-extrabold text-3xl tracking-tight">
            <span>coDoc</span>
          </router-link>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            Curating the finest premium products from around the world. Elevate your everyday.
          </p>
          <div class="space-y-2 text-sm text-gray-300">
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              +1-366-464-6242
            </p>
            <p class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              hello@codoc.com
            </p>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-bold mb-6 text-white">Quick Links</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><router-link to="/" class="hover:text-white transition-colors">Home</router-link></li>
            <li><router-link to="/" class="hover:text-white transition-colors">Shop</router-link></li>
            <li><router-link to="/" class="hover:text-white transition-colors">New Arrival</router-link></li>
            <li><router-link to="/" class="hover:text-white transition-colors">Blog</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-lg font-bold mb-6 text-white">Support</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Shipping Policy</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-lg font-bold mb-6 text-white">Newsletter</h4>
          <p class="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form @submit.prevent class="relative">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="w-full bg-white/10 border border-white/20 rounded-full py-3 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
            />
            <button type="submit" class="absolute right-1 top-1 bottom-1 px-4 bg-white text-primary text-sm font-bold rounded-full hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </form>
          
          <!-- Social Icons -->
          <div class="flex space-x-4 mt-8">
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-500 mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} coDoc. All rights reserved.
        </p>
        <div class="flex space-x-6 text-sm text-gray-500">
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
