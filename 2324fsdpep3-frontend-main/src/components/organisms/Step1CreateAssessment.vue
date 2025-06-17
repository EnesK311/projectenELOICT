<script setup lang="ts">
import { ref, computed, defineEmits, defineProps } from 'vue'
import { useOPOStore } from '@/stores/opo'
import { storeToRefs } from 'pinia'
import { useAssesmentStore } from '@/stores/assessment'
import PeerButton from '../atoms/PeerButton.vue'
import PeerH2 from '../atoms/PeerH2.vue'
import FormInput from '../molecules/FormInput.vue'
import FormSelect from '../molecules/FormSelect.vue'

import { type OPO, type AssessmentSend } from '@/types'

const props = defineProps<{ opos: OPO[] }>()
const emit = defineEmits(['next'])
//const { assessment: assessmentData } = storeToRefs(useAssesmentStore())
const { selectedOpo: selectedData } = storeToRefs(useOPOStore())

const assessmentData = ref<AssessmentSend>({
  title: '',
  description: '',
  end_date: '',
  notification_days: -1,
  opo_id: null
})

useOPOStore().fetchOPOs()

const submitted = ref(false)

const validationErrors = computed(() => {
  const errors: {
    title?: string
    description?: string
    end_date?: string
    notificationDays?: string
    selectedOpo?: string
  } = {}

  if (submitted.value) {
    if (!assessmentData.value.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!assessmentData.value.description.trim()) {
      errors.description = 'Description is required'
    }

    if (!assessmentData.value.end_date) {
      errors.end_date = 'Deadline is required'
    } else {
      const selectedDate: Date = new Date(assessmentData.value.end_date)
      const today: Date = new Date()

      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)

      if (selectedDate <= today) {
        errors.end_date = 'The deadline must be a future date'
      }

      const daysDifference: number = Math.ceil(
        (selectedDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
      )

      if (
        assessmentData.value.notification_days === null ||
        assessmentData.value.notification_days <= 0
      ) {
        errors.notificationDays = 'Notification days must be greater than 0'
      } else if (assessmentData.value.notification_days >= daysDifference) {
        errors.notificationDays =
          'Notification days must be less than the days remaining until the deadline'
      }
    }

    if (!selectedData.value || selectedData.value.id === -1) {
      errors.selectedOpo = 'OPO is required'
    }
  }

  return errors
})

const validateForm = () => {
  submitted.value = true
  //sws foute prakrijk
  const hasErrors = Object.keys(validationErrors.value).length > 0
  return !hasErrors
}

const handleNext = async () => {
  if (validateForm() && selectedData.value) {
    assessmentData.value.opo_id = selectedData.value.id
    try {
      await useAssesmentStore().createAssessment(assessmentData.value)
      emit('next')
    } catch (error) {
      console.error('Failed to create assessment:', error)
    }
  }
}
</script>

<template>
  <PeerH2>Step 1: Create Assessment</PeerH2>
  <div class="wrapper">
    <form class="form" @submit.prevent="handleNext">
      <FormSelect
        id="opo"
        label="Select OPO"
        v-model="selectedData.id"
        :options="opos.map((opo) => ({ value: opo.id, label: opo.name }))"
        :errorMessage="validationErrors.selectedOpo"
      />

      <RouterLink to="/opos" class="link">If OPO does not exist yet click here</RouterLink>
      <FormInput
        id="title"
        label="Title"
        type="text"
        v-model="assessmentData.title"
        autocomplete="off"
        :errorMessage="validationErrors.title"
      />

      <FormInput
        id="description"
        label="Description"
        type="textarea"
        v-model="assessmentData.description"
        :errorMessage="validationErrors.description"
      />

      <FormInput
        id="deadline"
        label="Deadline"
        type="date"
        v-model="assessmentData.end_date"
        :errorMessage="validationErrors.end_date"
      />

      <FormInput
        id="notification"
        label="How many days before should students receive a notification?"
        type="number"
        v-model="assessmentData.notification_days"
        :errorMessage="validationErrors.notificationDays"
      />

      <p>
        Pushing next means creating this assessment in the database! Check that everything is
        correct.
      </p>
      <PeerButton type="submit">Next</PeerButton>
    </form>
  </div>
</template>

<style scoped lang="scss">
.form {
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
