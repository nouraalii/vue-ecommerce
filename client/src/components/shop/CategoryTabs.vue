<template>
  <div class="w-full flex items-center justify-center my-10">
    <div class="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 px-4 max-w-full">
      
      <button 
        @click="$emit('update:modelValue', '')"
        :class="[
          'whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
          modelValue === '' 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-white text-gray-500 hover:text-primary hover:bg-gray-50 border border-gray-100'
        ]"
      >
        All Products
      </button>

      <button 
        v-for="category in categories" 
        :key="category._id"
        @click="$emit('update:modelValue', category._id)"
        :class="[
          'whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
          modelValue === category._id 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-white text-gray-500 hover:text-primary hover:bg-gray-50 border border-gray-100'
        ]"
      >
        {{ category.name }}
      </button>

    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
