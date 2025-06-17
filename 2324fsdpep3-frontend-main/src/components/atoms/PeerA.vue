<template>
  <a><slot></slot></a>
</template>

<style scoped lang="scss">
a {
  display: flex;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
}

a:hover {
  text-decoration: underline;
  background-color: hsla(160, 100%, 37%, 0.2);
}
</style>
