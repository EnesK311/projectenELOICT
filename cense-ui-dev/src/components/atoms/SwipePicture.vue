<script setup lang="ts">
import { getAnimatedEmoji } from '@/utils/helper'
import { ref, watch } from 'vue'

const props = defineProps<{
  img: string | undefined | null
  color: string | undefined | null
  alt: string
}>()

watch(
  () => props.img,
  newVal => {
    getPictureOrEmoji(newVal)
  },
)

const animatedEmoji = ref<string | null | undefined>(null)

const getPictureOrEmoji = async (image: string | null | undefined) => {
  if (!getAnimatedEmoji(image, true)) {
    animatedEmoji.value = image
  } else {
    animatedEmoji.value = getAnimatedEmoji(image, true)
  }
}

getPictureOrEmoji(props.img)
</script>
<template>
  <div
    v-if="animatedEmoji"
    :style="{ backgroundColor: color || 'var(--white)' }"
    class="swipe-picture"
  >
    <img
      :src="animatedEmoji"
      :alt="alt"
      v-if="img"
      draggable="false"
    />
  </div>
</template>
<style scoped lang="scss">
div {
  margin-top: 2rem;
  width: min(80%, 20rem);
  aspect-ratio: 1/1.3;
  display: grid;
  place-items: center;
  border-radius: 1rem;
  position: relative;
  margin-inline: auto;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    border-radius: 1rem;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    z-index: -1;
  }

  &::before {
    background-color: var(--red-7);
    rotate: -4deg;
    translate: 0 -0.6rem;
  }

  &::after {
    background-color: var(--green);
    rotate: 5deg;
    translate: -0rem 0rem;
  }
}
</style>
