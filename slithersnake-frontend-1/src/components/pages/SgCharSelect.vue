<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgGrid from '@/components/organisms/SgGrid.vue'
import { useCharStore } from '@/stores/char'
import SgCharCard from '../molecules/SgCharCard.vue'

const charStore = useCharStore()
</script>

<template>
  <section class="charselect">
    <ul>
      <li v-for="c in charStore.chars" :key="c.id"><SgCharCard :char="c"></SgCharCard></li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.charselect {

  ul{
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    li{
      list-style: none;
      width: 30%;
    }
  }
}
</style>
