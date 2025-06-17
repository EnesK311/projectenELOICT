<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import PeerButton from '../atoms/PeerButton.vue'
import PeerError from '../atoms/PeerError.vue'

const emit = defineEmits(['file-change'])
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFileName = ref<string | null>(null)

const props = defineProps<{ errorMessage?: string }>()

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null

  if (file) {
    selectedFileName.value = file.name
    emit('file-change', file)
  } else {
    selectedFileName.value = null
    emit('file-change', null)
  }
}
</script>

<template>
  <div class="file-upload">
    <input ref="fileInputRef" type="file" style="display: none" @change="onFileChange" />

    <PeerButton @click="triggerFileInput">
      <slot>Upload File</slot>
    </PeerButton>

    <p v-if="selectedFileName" class="file-name">Selected file: {{ selectedFileName }}</p>

    <PeerError v-if="errorMessage" role="alert">{{ errorMessage }}</PeerError>
  </div>
</template>

<style scoped lang="scss">
.file-upload {
  margin-bottom: 1.5rem;
}

.file-name {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #333;
}
</style>
