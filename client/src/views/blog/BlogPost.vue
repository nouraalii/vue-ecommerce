<template>
  <div class="bg-background min-h-screen">
    <div v-if="post" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <router-link to="/blog" class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-8">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Journal
      </router-link>

      <span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">{{ post.tag }}</span>
      <h1 class="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl leading-tight">{{ post.title }}</h1>

      <div class="mt-6 flex items-center gap-3 text-sm text-gray-400 font-medium">
        <span>{{ post.author }}</span>
        <span>·</span>
        <span>{{ formatDate(post.date) }}</span>
        <span>·</span>
        <span>{{ post.readMinutes }} min read</span>
      </div>

      <img :src="post.cover" :alt="post.title" class="w-full h-72 sm:h-96 object-cover rounded-[2rem] shadow-sm my-10" />

      <article class="space-y-6">
        <p v-for="(paragraph, index) in post.body" :key="index" class="text-lg text-gray-700 leading-relaxed">
          {{ paragraph }}
        </p>
      </article>
    </div>

    <!-- Not found -->
    <div v-else class="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 class="text-3xl font-bold text-gray-900">Post not found</h1>
      <p class="mt-3 text-gray-500">The article you are looking for does not exist.</p>
      <router-link to="/blog" class="inline-block mt-6 px-6 py-2 bg-primary text-white font-medium rounded-full shadow-md hover:bg-secondary transition-colors">
        Back to Journal
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPostBySlug } from '../../data/blogPosts';

const route = useRoute();
const post = computed(() => getPostBySlug(route.params.slug));

const formatDate = date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
</script>
