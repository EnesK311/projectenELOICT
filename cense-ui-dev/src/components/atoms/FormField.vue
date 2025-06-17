<script setup lang="ts">
import { defineModel, ref, watch } from 'vue'

// Import the newly created LabelAtom.
import LabelAtom from './LabelAtom.vue'

const model = defineModel<string>()

const props = defineProps<{
  id: string
  type: string
  required: boolean
  error: string | null | undefined
  label: string
  eye?: boolean
  min?: number
  max?: number
  placeholder?: string
}>()

const inputType = ref<string>(props.type)
const togglePassword = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

watch(model, newValue => {
  if ((props.id === 'firstname' || props.id === 'lastname') && newValue) {
    model.value = newValue.charAt(0).toUpperCase() + newValue.slice(1)
  }
})

const eyeClass = ref<string>('fa-solid fa-eye')
watch(inputType, newValue => {
  eyeClass.value =
    newValue === 'password' ? 'fa-solid fa-eye' : 'fa-regular fa-eye'
})
</script>

<template>
  <div class="form-group" :class="{ password: eye }">
    <!-- Use the new LabelAtom component -->
    <LabelAtom :for-id="id" :label="label" :error="error" />

    <input
      :id="id"
      v-model="model"
      :type="inputType"
      :required="required"
      :value="model"
      :min="min"
      :max="max"
      :placeholder="placeholder"
    />

    <button
      v-if="eye"
      class="show-password"
      type="button"
      title="Show Password"
      @click="togglePassword"
    >
      <i :class="eyeClass"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.form-group {
  display: flex;
  flex-direction: column;
  margin-block: 0.5rem;
}

.password {
  position: relative;

  button {
    position: absolute;
    right: 2%;
    bottom: 5%;
    border: 0.1rem solid var(--dark-blue);
    border-radius: 50%;
    background-color: #f5f5f5;
    cursor: pointer;
    display: grid;
    place-content: center;
    width: 1.5rem;
    height: 1.5rem;
    transition: background-color 0.2s ease;

    i {
      color: var(--dark-blue);
      font-size: 90%;
    }

    &:has(.fa-regular) {
      background-color: var(--dark-blue);

      i {
        color: var(--white);
      }
    }
  }
}

input {
  padding: 0.5rem;
  border: none;
  border-radius: 0.3rem;
  color: var(--text);
  background-color: var(--label);
  font-family: var(--calibri);

  &[type='color'] {
    padding: 0.1rem;
    padding-inline: 0.2rem;
    width: 100%;
    cursor: pointer;

    &::-webkit-color-swatch {
      border-radius: 0.2rem;
      border: none;
    }
  }
}
</style>
