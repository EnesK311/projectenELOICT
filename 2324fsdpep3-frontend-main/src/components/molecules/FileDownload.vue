<script setup lang="ts">
import { defineProps } from 'vue'
import PeerButton from '../atoms/PeerButton.vue'

interface FileDownloadProps {
  url: string
  filename?: string
}

const props = defineProps<FileDownloadProps>()
</script>

<template>
  <a :href="props.url" :download="props.filename">
    <PeerButton>
      <slot>Download</slot>
    </PeerButton>
  </a>
</template>

<style scoped lang="scss"></style>
