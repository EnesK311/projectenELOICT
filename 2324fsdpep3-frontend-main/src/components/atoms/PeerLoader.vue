<script setup lang="ts"></script>

<template>
  <div class="loader"></div>
</template>

<style scoped lang="scss">
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid;
  border-color: #ffffff #0000;
  animation: l1 1s infinite;
}

@keyframes l1 {
  to {
    transform: rotate(0.5turn);
  }
}

/* Ensure the loader stays within full screen */
body,
html {
  height: 100%;
  margin: 0;
}
</style>
