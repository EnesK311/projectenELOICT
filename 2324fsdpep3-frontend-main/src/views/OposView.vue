<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import PeerOpo from '@/components/organisms/PeerOpoSelect.vue'
import PeerOpoSelect from '@/components/organisms/PeerOpoSelect.vue'
import { useOPOStore } from '@/stores/opo'

const title = useTitle()
title.value = 'Opo | Peer'

const opoStore = useOPOStore()
const { opos } = storeToRefs(useOPOStore())
//if opos in opostore are empty fetch
if (!opos.value.length) opoStore.fetchOPOs()

opoStore.fetchOPOs()
</script>

<template>
  <main>
    <h1>Opo</h1>
    <PeerOpoSelect />
  </main>
</template>

<style scoped lang="scss"></style>
