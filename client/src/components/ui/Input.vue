<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-primary focus:ring-primary sm:text-sm',
          { 'border-red-500 focus:border-red-500 focus:ring-red-500': error },
          { 'bg-gray-100 text-gray-500 cursor-not-allowed': disabled },
          inputClass
        ]"
      />
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  error: String,
  hint: String,
  inputClass: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue', 'blur']);
</script>
