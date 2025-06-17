<script setup lang="ts">
import SgButton from '../atoms/SgButton.vue';
import { onKeyStroke } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';

const model = defineModel('showPrompt')
const modelValue = defineModel<String>('modelValue')

const emit = defineEmits<{
  updateUsername: [newUsername: string]
}>()

const handleClick = () => {
  useAuthStore().patch(modelValue.value as string)
  emit('updateUsername', modelValue.value as string)
  model.value = false
}

// watch for escape
onKeyStroke('Escape', (s) => {
  s.preventDefault()
  model.value = false
})
</script>

<template>
    <div class="popup">
        <div class="popup-content">
            <label for="username">Change username</label>
            <input type="text" id="username" name="username" v-model="modelValue">
            <SgButton @click="handleClick()">Submit</SgButton>
        </div>
    </div>
</template>

<style scoped lang="scss">
.popup {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black overlay */
  z-index: 9999; /* make sure it's on top */
}

.popup-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;

  input[type='text'] {
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
  }
}

</style>