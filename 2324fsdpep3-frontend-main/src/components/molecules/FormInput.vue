<template>
  <div class="form-input">
    <PeerLabel :for="id">
      <slot name="label">{{ label }}</slot>
    </PeerLabel>

    <component
      :is="inputComponent"
      :type="type"
      :id="id"
      :name="name"
      :value="modelValue"
      @input="handleInput"
      :autocomplete="autocomplete"
    />

    <PeerError v-if="errorMessage" role="alert">
      {{ errorMessage }}
    </PeerError>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import PeerLabel from '../atoms/PeerLabel.vue'
import PeerError from '../atoms/PeerError.vue'

interface FormInputProps {
  modelValue: string | number
  label?: string
  type?: 'text' | 'number' | 'date' | 'textarea' | 'file' | 'email' | 'password'
  id?: string
  name?: string
  autocomplete?: string
  errorMessage?: string
}

const props = defineProps<FormInputProps>()
const emit = defineEmits(['update:modelValue'])

const inputComponent = computed(() => (props.type === 'textarea' ? 'textarea' : 'input'))

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped lang="scss">
.form-input {
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }
}

.form-input .error {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style>
