<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import FButton from '../atoms/FButton.vue'
import { storeToRefs } from 'pinia'

const search = ref<string>('')
const { startLoading, stopLoading } = useLoadingStore()
const { isLoading } = storeToRefs(useLoadingStore())
const { getUsers } = useUserStore()

const handleSubmit = async () => {
  try {
    startLoading()
    await getUsers({ term: search.value })
  } catch (err) {
    console.error(err)
    stopLoading()
  } finally {
    stopLoading()
  }
}

const model = defineModel<'filter' | 'search'>()
</script>
<template>
  <div class="wrapper">
    <nav class="container">
      <div class="search" :aria-expanded="model === 'search' ? true : false" aria-roledescription="search">
        <button type="button" title="Search" @click="model = 'search'">
          Personen<i class="fa-solid fa-users-viewfinder"></i>
        </button>
      </div>
      <div class="filters" :aria-expanded="model === 'search' ? false : true" aria-roledescription="filter">
        <button type="button" title="Filter" @click="model = 'filter'">
          Filters<i class="fa-solid fa-sliders"></i>
        </button>
      </div>
    </nav>
    <form
      action=""
      :class="{ hidden: model !== 'search' }"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label for="search">Zoek een persoon</label>
        <input
          id="search"
          v-model="search"
          type="text"
          name="search"
          placeholder="bv. 'Milan' "
        />
      </div>
      <FButton
        type="submit"
        title="Search"
        color="var(--green)"
        :loading="isLoading"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
      </FButton>
    </form>
  </div>
</template>
<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background-color: var(--dark-blue-05);
  padding: 0.5rem;
  border-radius: 0.5rem;

  > div {
    background-color: var(--blue);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: flex-grow 0.2s ease;
    flex-grow: 1;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 0.15rem solid var(--blue);
    transition: all 0.2s ease;
    background-color: transparent;
    color: var(--dark-blue);

    &[aria-expanded='true'] {
      flex-grow: 2;
      background-color: var(--blue);
      button {
        color: var(--white);
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0rem 1rem;
      padding-right: 0;
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      color: var(--dark-blue);
      padding: 0.5rem;

      cursor: pointer;
    }
  }
}

form {
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
  align-items: flex-end;
  // gap: 0.5rem;
  background-color: var((--white));
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 100%;
  position: relative;

  > div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  label {
    font-weight: 800;
    font-size: 90%;
    font-style: italic;
  }

  &.hidden {
    display: none;
  }

  :deep(button) {
    margin: 0;
    padding: 0.2rem 0.5rem;
  }

  input {
    flex-grow: 1;
    padding: 0.4rem;
    padding-inline: 0.5rem;
    font-weight: 400;
    border-radius: 0.3rem;
    border: none;
    border: 0.15rem solid var(--dark-blue-05);

    &::placeholder {
      font-style: italic;
      font-weight: 600;
    }
  }

  button {
    border-radius: 0.4rem;
    aspect-ratio: 1;
    border: none;
    cursor: pointer;
    position: absolute;
    right: 0.5rem;
    display: grid;
    place-content: center;

    i {
      scale: 1;
      rotate: -5deg;
    }
  }

  :deep(button.loading) {
    position: absolute !important;
  }
}
</style>
