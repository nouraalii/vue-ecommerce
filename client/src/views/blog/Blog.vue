<template>
  <div class="bg-background min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-14">
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">The Journal</h1>
        <p class="mt-4 max-w-2xl mx-auto text-gray-500">Stories, guides, and notes from behind the counter.</p>
      </div>

      <!-- Featured post -->
      <router-link
        v-if="featured"
        :to="`/blog/${featured.slug}`"
        class="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden mb-14"
      >
        <div class="h-64 lg:h-full overflow-hidden">
          <img :src="featured.cover" :alt="featured.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div class="p-8 lg:p-12">
          <span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">{{ featured.tag }}</span>
          <h2 class="mt-4 text-3xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">{{ featured.title }}</h2>
          <p class="mt-4 text-gray-500 leading-relaxed">{{ featured.excerpt }}</p>
          <div class="mt-6 flex items-center gap-3 text-sm text-gray-400 font-medium">
            <span>{{ featured.author }}</span>
            <span>·</span>
            <span>{{ formatDate(featured.date) }}</span>
            <span>·</span>
            <span>{{ featured.readMinutes }} min read</span>
          </div>
        </div>
      </router-link>

      <!-- Grid of remaining posts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="post in rest"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
        >
          <div class="h-48 overflow-hidden">
            <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="p-6 flex flex-col flex-1">
            <span class="text-xs font-bold uppercase tracking-widest text-primary">{{ post.tag }}</span>
            <h3 class="mt-3 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">{{ post.title }}</h3>
            <p class="mt-2 text-sm text-gray-500 line-clamp-3 flex-1">{{ post.excerpt }}</p>
            <div class="mt-4 flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>{{ formatDate(post.date) }}</span>
              <span>·</span>
              <span>{{ post.readMinutes }} min read</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { blogPosts } from '../../data/blogPosts';

const featured = computed(() => blogPosts[0] || null);
const rest = computed(() => blogPosts.slice(1));

const formatDate = date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
</script>
