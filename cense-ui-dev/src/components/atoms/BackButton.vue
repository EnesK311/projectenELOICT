<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="back-button">
    <button type="button" class="back-link" title="Ga terug" @click="goBack">
      <i class="fas fa-arrow-left"></i>
      <slot></slot>
    </button>
  </div>
</template>

<style lang="scss">
.back-button {
  .back-link {
    color: var(--white);
    font-size: 1rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 1rem;

    background-color: var(--green);
    border-radius: 10rem;

    i {
      scale: 1;
      border-radius: 50%;
      aspect-ratio: 1;
    }
  }
}
</style>
