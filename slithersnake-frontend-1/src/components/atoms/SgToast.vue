<script setup lang="ts">
import { defineComponent, ref, watch } from 'vue';
  
const props = defineProps<{
    content: string // required
    duration: number // default: 3000
}>()

const show = ref<boolean>(true)

setTimeout(() => {
    show.value = false
}, props.duration)
</script>

<template>
    <div v-if="show" class="toast">{{ content }}</div>
</template>
  
<style scoped>
  .toast {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 9999;
  }
</style>
  