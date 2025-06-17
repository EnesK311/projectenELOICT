<script setup lang="ts">
import type { SpecialityInput } from '@/types/type'
import { ref } from 'vue'

defineProps<{ specialities: SpecialityInput[] | undefined }>()

const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)
const container = ref<HTMLUListElement | null>(null)

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  startX.value = 'touches' in e ? e.touches[0].pageX : e.pageX
  scrollLeft.value = container.value!.scrollLeft
}

const stopDrag = () => {
  isDragging.value = false
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const x = 'touches' in e ? e.touches[0].pageX : e.pageX
  const walk = (startX.value - x) * 1
  container.value!.scrollLeft = scrollLeft.value + walk
}
</script>
<template>
  <ul
    class="specialities"
    ref="container"
    @mousedown.stop="startDrag"
    @mousemove.stop="handleDrag"
    @mouseup.stop="stopDrag"
    @mouseleave.stop="stopDrag"
    @touchstart.stop="startDrag"
    @touchmove.stop="handleDrag"
    @touchend.stop="stopDrag"
    @touchcancel.stop="stopDrag"
  >
    <li v-for="(k, idx) in specialities" :key="idx">
      {{ k.name }}
    </li>
  </ul>
</template>
<style scoped lang="scss">
.specialities {
  margin: 0;
  margin-top: 0.5rem;
  padding: 0;
  display: flex;
  list-style: none;
  gap: 0.5rem;
  align-items: center;
  max-width: 20rem;
  overflow-x: hidden;
  cursor: grab;

  li {
    width: max-content;
    text-wrap: nowrap;
    padding: 0rem 0.5rem;
    border-radius: 50rem;
    background-color: var(--light-blue-25);
    border: 0.1rem solid var(--light-blue);
    user-select: none;
  }
}
</style>
