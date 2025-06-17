<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'

const pressedKey = ref('')

const modelKeybind = defineModel('keybind')
const modelSelectedkey = defineModel('selectedkey')

const handleKeyPress = (event: KeyboardEvent) => {
  pressedKey.value = event.key
  modelKeybind.value = event.key
  closeOverlay()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
})

// watch for escape
onKeyStroke('Escape', (s) => {
  s.preventDefault()
  closeOverlay()
  console.log("exiting")
})

// functions
const closeOverlay = () => {
    modelSelectedkey.value = ''
}
</script>

<template>
    <div class="overlay">
        <div class="overlay-content">
            <h1>Listening for keypress to change '{{ selectedkey }}'...</h1>
            <p>Press <span>Escape to exit</span></p>
            <span>{{ pressedKey }}</span>
        </div>

    </div>
</template>

<style scoped lang="scss">
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: var(--default-text-dark);
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    
    .overlay-content {
        text-align: center; /* Optional: center-align text inside the overlay */
    }
}
</style>