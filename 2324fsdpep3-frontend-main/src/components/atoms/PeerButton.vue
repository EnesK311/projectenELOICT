<template>
  <button><slot></slot></button>
</template>

<style scoped lang="scss">
button {
  margin-top: 1rem;
  background-color: var(--color-primary-cards);
  color: var(--color-primary-green);
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;

  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

button:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: scale(0.98);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

button:focus {
  outline: 2px solid var(--color-primary-green);
  outline-offset: 2px;
}
</style>
