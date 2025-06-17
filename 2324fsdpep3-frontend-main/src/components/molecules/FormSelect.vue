<template>
  <div class="form-select">
    <!-- Render the label -->
    <PeerLabel :for="id">
      <slot name="label">{{ label }}</slot>
    </PeerLabel>

    <!-- Render the select dropdown -->
    <select :id="id" :name="name" v-model="internalValue" @change="handleChange">
      <option value="" disabled>Select an option</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- Render the error message if it exists -->
    <PeerError v-if="errorMessage" role="alert">
      {{ errorMessage }}
    </PeerError>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import PeerLabel from '../atoms/PeerLabel.vue'
import PeerError from '../atoms/PeerError.vue'

interface SelectOption {
  value: string | number
  label: string
}

// Define the props with appropriate types
interface FormSelectProps {
  modelValue: string | number | null
  label?: string
  options: SelectOption[]
  id?: string
  name?: string
  errorMessage?: string
}

const props = defineProps<FormSelectProps>()
const emit = defineEmits(['update:modelValue'])

const internalValue = ref<string | number | null>(props.modelValue)

// Watch for external modelValue changes and update internalValue
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  }
)

// Emit the update when the internal value changes
const handleChange = () => {
  emit('update:modelValue', internalValue.value)
}
</script>

<style scoped lang="scss">
.form-select {
  margin-bottom: 1.5rem;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}

select:focus {
  border-color: #007bff;
  outline: none;
}

.form-select .error {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style>
