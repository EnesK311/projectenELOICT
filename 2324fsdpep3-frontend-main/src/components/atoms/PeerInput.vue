<template>
  <input
    :type="inputType"
    :id="id"
    :name="name"
    :value="formattedValue"
    @input="handleInput"
    :autocomplete="autocomplete"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  modelValue: string | number
  type?: string
  id?: string
  name?: string
  autocomplete?: string
}>()

const emit = defineEmits(['update:modelValue'])
const inputType = computed(() => props.type || 'text')

// Compute the value based on the input type
const formattedValue = computed(() => {
  if (inputType.value === 'number' && typeof props.modelValue === 'number') {
    return props.modelValue.toString()
  }
  return props.modelValue
})

// Emit the correct value depending on the input type
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (target) {
    let value: string | number = target.value
    if (inputType.value === 'number') {
      value = target.valueAsNumber || 0 // Handle number input specifically
    }
    emit('update:modelValue', value) // Correctly use emit instead of $emit
  }
}
</script>

<style scoped lang="scss">
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}
</style>
