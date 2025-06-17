<template>
  <textarea
    :id="id"
    :name="name"
    :value="modelValue"
    @input="handleInput"
    :autocomplete="autocomplete"
    class="peer-textarea"
  ></textarea>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface PeerTextAreaProps {
  modelValue: string | number
  id?: string
  name?: string
  autocomplete?: string
}

const props = defineProps<PeerTextAreaProps>()
const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped lang="scss">
.peer-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}
</style>
