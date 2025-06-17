<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { useRubricStore } from '@/stores/rubric'
import type { Rubric } from '@/types'
import { storeToRefs } from 'pinia'
import PeerButton from '../atoms/PeerButton.vue'
import FormInput from '../molecules/FormInput.vue'
import FormSelect from '../molecules/FormSelect.vue'
import FormCheckbox from '../molecules/FormCheckBox.vue'
import SelectedRubric from '../molecules/SelectedRubric.vue'

const props = defineProps<{ rubrics: Rubric[] }>()
const emit = defineEmits(['next', 'prev'])

const { pickedRubrics: selectedData } = storeToRefs(useRubricStore())
const { newRubric: rubricName } = storeToRefs(useRubricStore())

const selectedRubric = ref<number | null>(null)

const addRubric = () => {
  const rubricToAdd = props.rubrics.find((r) => r.id === selectedRubric.value)
  if (rubricToAdd) {
    selectedData.value.push(rubricToAdd)
    selectedRubric.value = null
  }
}

const removeRubric = (rubric: Rubric) => {
  const index = selectedData.value.findIndex((r) => r.id === rubric.id)
  if (index !== -1) {
    selectedData.value.splice(index, 1)
  }
}

const createNewRubric = () => {
  if (rubricName.value.name) {
    useRubricStore().createRubric(rubricName.value)
  }
}
</script>

<template>
  <div class="wrapper">
    <h2>Step 2: Add Rubrics</h2>
    <div>
      <p>Select a rubric and add it to this assessment</p>
      <FormSelect
        id="rubric-select"
        label="Rubric"
        v-model="selectedRubric"
        :options="
          props.rubrics
            .filter((r) => !selectedData.includes(r))
            .map((rubric) => ({ value: rubric.id, label: rubric.name }))
        "
      />
      <PeerButton @click="addRubric">Add Rubric</PeerButton>

      <p>All selected rubrics</p>
      <div>
        <div v-for="rubric in selectedData" :key="rubric.id">
          <SelectedRubric :rubric="rubric" @deleteRubric="removeRubric" />
        </div>
      </div>
    </div>

    <div>The rubric you want does not exist yet? Create one</div>

    <div>
      <p>Create a new rubric</p>

      <FormInput id="rubric-name" label="Rubric Name" type="text" v-model="rubricName.name" />
      <FormCheckbox
        id="reusable"
        label="Do you want this rubric to be reusable?"
        v-model="rubricName.is_fixed"
      />

      <PeerButton @click="createNewRubric">Create Rubric</PeerButton>
    </div>

    <PeerButton type="button" @click="$emit('prev')">Previous</PeerButton>
    <PeerButton type="button" @click="$emit('next')" :disabled="selectedData.length < 2"
      >Next</PeerButton
    >
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
