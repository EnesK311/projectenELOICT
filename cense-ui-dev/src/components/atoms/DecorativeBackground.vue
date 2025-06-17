<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Shape {
  left: number
  top: number
  width: number
  height: number
  borderRadius: string
  rotation: number
}

const shapes = ref<Shape[]>([])

const generateShapes = () => {
  const unitSize = 100
  const spacing = 5

  const cols = Math.floor(window.innerWidth / (unitSize + spacing))
  const rows = Math.floor(window.innerHeight / 2.3 / (unitSize + spacing))

  shapes.value = []

  const randomSeed = Math.floor(Math.random() * 4)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if ((row + col + randomSeed) % 3 === 0) continue
      const randomRotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)]
      addShape(col, row, unitSize, spacing, randomRotation)
    }
  }
}

const addShape = (
  col: number,
  row: number,
  unitSize: number,
  spacing: number,
  randomRotation: number,
) => {
  shapes.value.push({
    left: col * (unitSize + spacing),
    top: row * (unitSize + spacing),
    width: unitSize,
    height: unitSize,
    borderRadius: '5% 100% 5% 20%',
    rotation: randomRotation,
  })
}

const handleResize = () => {
  generateShapes()
}

onMounted(() => {
  generateShapes()
  window.addEventListener('resize', handleResize)
})

import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="container">
    <div
      v-for="(shape, index) in shapes"
      :key="index"
      class="shape"
      :style="{
        left: shape.left + 'px',
        top: shape.top + 'px',
        width: shape.width + 'px',
        height: shape.height + 'px',
        borderRadius: shape.borderRadius,
        transform: `rotate(${shape.rotation}deg)`,
      }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 41%;
  z-index: -1;
  background-color: var(--bg);
}

.shape {
  position: absolute;
  background-color: var(--red-4);
  transform-origin: center;
}
</style>
