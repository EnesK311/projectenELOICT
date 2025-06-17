<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import PeerButton from '@/components/atoms/PeerButton.vue'

// Define props to accept the rubric object
const props = defineProps<{
  rubric: { id: number; name: string }
}>()

// Define emits to notify the parent component when the rubric is deleted
const emit = defineEmits(['deleteRubric'])

// Emit the delete event
const deleteRubric = () => {
  emit('deleteRubric', props.rubric)
}
</script>

<template>
  <div class="rubric-item">
    <p class="rubric-name">{{ props.rubric.name }}</p>
    <PeerButton class="button" type="button" @click="deleteRubric">Delete Rubric</PeerButton>
  </div>
</template>

<style scoped lang="scss">
.rubric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  .button {
    margin-top: 0;
  }
}

.rubric-name {
  min-width: 50%;
  max-width: 50%;
  font-size: 1rem;
  font-weight: bold;
}
</style>
