<script setup lang="ts">
import { defineProps } from 'vue'
import FormError from './FormError.vue'

defineProps<{
  forId: string
  label: string
  error?: string | null
}>()
</script>

<template>
  <label :for="forId">
    <span class="field-label">{{ label }}</span>

    <FormError v-if="error">{{ error }}</FormError>
  </label>
</template>

<style scoped lang="scss">
label {
  display: flex;
  font-size: 110%;
  flex-direction: column;
  justify-content: flex-end;
  color: var(--dark-blue);
  cursor: pointer;
  margin-bottom: 0.2rem;
}

.field-label {
  font-weight: 500;
  line-height: 1.2;
}
</style>
