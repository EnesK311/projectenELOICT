<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import PeerLabel from './PeerLabel.vue'

// Define props to accept the slider's value, min, max, and label
const props = defineProps<{
  label: string
  value: number
  min?: number
  max?: number
}>()

// Define emits to notify the parent component of changes
const emit = defineEmits(['update:value'])

// Reactive value for the slider
const internalValue = ref(props.value)

// Watch for changes to the prop and update internal value
watch(
  () => props.value,
  (newValue) => {
    internalValue.value = newValue
  }
)

// Function to handle input and emit the updated value
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newValue = parseInt(target.value)
  emit('update:value', newValue)
}
</script>

<template>
  <div class="slider-container">
    <PeerLabel class="slider-label">{{ props.label }}</PeerLabel>
    <input
      type="range"
      :min="props.min || 0"
      :max="props.max || 100"
      :value="internalValue"
      @input="handleInput"
      class="slider-input"
    />
    <span class="slider-value">{{ internalValue }}%</span>
  </div>
</template>

<style scoped lang="scss">
.slider-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.slider-label {
  flex: 1;
  font-weight: bold;
  margin-right: 10px;
  text-align: left;
}

.slider-input {
  flex: 3;
  width: 100%;
  margin-right: 10px;
}

.slider-value {
  flex: 0 0 40px; /* Fixed width for consistent alignment */
  text-align: right;
  font-weight: bold;
}
</style>
