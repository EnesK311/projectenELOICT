<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgGrid from '@/components/organisms/SgGrid.vue'
import { useCharStore } from '@/stores/char'
import SgButton from '../atoms/SgButton.vue'
import type { Character } from '@/types'
import { usePlayStore } from '@/stores/play'

const charStore = useCharStore()
const playStore = usePlayStore()

const props = defineProps<{
  char: Character
}>()


</script>

<template>
  <div class="charCard">
    <h3>{{ char.name }}</h3>
    <div class="attributes">
      <h4>Attributes</h4>
      <ul>
        <li>Speed: {{ char.attributes.speed }}</li>
        <li>Starting Length: {{ char.attributes.startLength }}</li>
        <li>Lives: {{ char.attributes.lives }}</li>
      </ul>
    </div>

    <SgButton @click="charStore.joinGame(char)">Select</SgButton>
  </div>
</template>

<style scoped lang="scss">
.charCard {
  color: var(--default-text-dark);
  display: flex;
  align-items: center;
  flex-direction: column;

  .attributes {
    text-align: center;
    margin: 2rem;
    ul {
        padding: 0;
      li {
        list-style: none;
      }
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
  }
}
</style>
