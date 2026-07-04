<template>
  <Shop
    heading="New Arrivals"
    subheading="The latest additions to our catalog, fresh off the shelf."
    default-sort="-createdAt"
    lock-sort
  />
</template>

<script setup>
import Shop from './Shop.vue';
</script>
