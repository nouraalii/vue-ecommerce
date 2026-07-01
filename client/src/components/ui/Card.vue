<template>
  <div :class="['bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden', customClass]">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-100">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="px-6 py-4">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  customClass: {
    type: String,
    default: '',
  },
});
</script>
