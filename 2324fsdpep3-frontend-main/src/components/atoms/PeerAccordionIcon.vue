<template>
  <span class="accordion-icon" :class="{ open }">▸</span>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Accept a prop to toggle the icon's state
const props = defineProps<{
  open: boolean
}>()
</script>

<style scoped>
.accordion-icon {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.accordion-icon.open {
  transform: rotate(90deg);
}
</style>
