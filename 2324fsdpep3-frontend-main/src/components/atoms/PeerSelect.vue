<template>
  <select :id="id" :name="name" v-model="internalValue">
    <option value="" disabled>Select an option</option>
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

interface SelectOption {
  value: number
  label: string
}

// Define the props
const props = defineProps<{
  modelValue: { id: number; name: string } | undefined
  options: SelectOption
  id?: string
  name?: string
}>()

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  }
)

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped lang="scss">
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
