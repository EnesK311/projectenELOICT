<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import PeerLabel from '../atoms/PeerLabel.vue'

// Define the props with appropriate types
interface FormCheckboxProps {
  modelValue: boolean
  label?: string
  id?: string
  name?: string
}

const props = defineProps<FormCheckboxProps>()
const emit = defineEmits(['update:modelValue'])

// Handle change event and cast the event target correctly
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (target) {
    emit('update:modelValue', target.checked)
  }
}
</script>
<template>
  <div class="form-checkbox">
    <!-- Render the checkbox input -->
    <input type="checkbox" :id="id" :name="name" :checked="modelValue" @change="handleChange" />
    <!-- Render the label -->
    <PeerLabel :for="id">
      <slot>{{ label }}</slot>
    </PeerLabel>
  </div>
</template>

<style scoped lang="scss">
.form-checkbox {
  display: flex;
  align-items: center;
}

input[type='checkbox'] {
  margin-right: 0.5rem;
}
</style>
