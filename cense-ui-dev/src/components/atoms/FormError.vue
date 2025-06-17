<template>
  <span class="field-error">
    <slot></slot>
  </span>
</template>
<style scoped lang="scss">
.field-error {
  color: var(--red);
  font-size: 80%;
  font-weight: 800;
}
</style>
