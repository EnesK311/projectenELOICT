<script setup lang="ts">
defineProps<{
  loading?: boolean
  type?: 'button' | 'submit'
  backgroundColor?: string
  color?: string
}>()
</script>

<template>
  <button
    :class="{ loading }"
    :type="type === 'submit' ? 'submit' : 'button'"
    :style="{ '--backgroundColor': backgroundColor, '--color': color }"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
@mixin loader {
  position: relative;
  color: transparent;
  cursor: wait;

  &::before {
    content: '';
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    width: 1.5rem;
    height: 1.5rem;
    animation: spin 1s linear infinite;
    border: 0.12rem solid transparent;
    border-top-width: 0.2rem;
    border-radius: 50%;
    border-color: transparent;
    border-top-color: var(--color);
    translate: -50% -50%;
  }

  &::after {
    display: none;
  }
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}

button[type='submit'].loading {
  @include loader;
}
button {
  color: var(--white);
  background-color: var(--backgroundColor);
  border-radius: 0.5rem;
  border: none;
  padding: 0.5rem 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-block: 1rem;

  &.loading {
    color: var(--backgroundColor);
  }
}
</style>
