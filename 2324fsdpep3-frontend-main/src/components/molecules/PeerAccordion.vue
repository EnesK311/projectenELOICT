<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import PeerAccordionIcon from '@/components/atoms/PeerAccordionIcon.vue'

// Props to allow control from the parent component
const props = defineProps<{
  initiallyOpen: boolean
}>()

const isOpen = ref(false)

watchEffect(() => {
  isOpen.value = props.initiallyOpen
})

// Function to toggle accordion state
const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="accordion">
    <div @click="toggle" class="accordion-header">
      <PeerAccordionIcon :open="isOpen" />
      <slot name="header"></slot>
    </div>
    <div v-if="isOpen" class="accordion-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.accordion-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  background-color: var(--color-background);
  border-radius: 5px;
  margin: 0.5rem 0;
  font-weight: bold;
}

.accordion-header:hover {
  background-color: var(--color-primary-green);
}

.accordion-content {
  padding: 1rem;
  border-radius: 5px;
  margin: 0.5rem 0;
}
</style>
