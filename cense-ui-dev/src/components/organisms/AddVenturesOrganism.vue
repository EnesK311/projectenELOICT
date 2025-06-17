<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLoading } from '@/composables/loading'
import { useFormValidation } from '@/composables/formValidation'
import type { HttpValidationProblemDetails } from '@/types/type'

import FormField from '@/components/atoms/FormField.vue'
import FormSummary from '@/components/atoms/FormSummary.vue'
import FButton from '@/components/atoms/FButton.vue'
import DateField from '@/components/atoms/DateField.vue'

import useAuthStore from '@/stores/auth'
import { useProjectsStore } from '@/stores/project'

import type { NewProject } from '@/types/type'

const projectName = ref<string>('')
const projectYear = ref<string>('')
const projectMonth = ref<string>('')

const { user } = storeToRefs(useAuthStore())
const userId = computed(() => user.value?.id || '')
console.log(userId.value)

const submitted = ref(false)
const showSuccess = ref(false)
const apiErrors = ref<string[]>([])

const { isLoading, startLoading, stopLoading } = useLoading()
const router = useRouter()

const projectForm = {
  projectName: {
    value: projectName,
    rules: [(val: string) => (val ? null : 'Projectnaam is verplicht')],
  },
  projectYear: {
    value: projectYear,
    rules: [(val: string) => (+val ? null : 'Jaar is verplicht')],
  },
  projectMonth: {
    value: projectMonth,
    rules: [(val: string) => (+val ? null : 'Maand is verplicht')],
  },
}

const { errors, validate } = useFormValidation(ref(projectForm), submitted)

async function tryCreateProject() {
  submitted.value = true
  startLoading()
  validate()

  if (Object.keys(errors.value).length > 0) {
    stopLoading()
    return
  }

  const newProject: NewProject = {
    name: projectName.value,
    year: +projectYear.value || undefined,
    month: +projectMonth.value || undefined,
    userId: userId.value || undefined,
  }

  try {
    const projectStore = useProjectsStore()
    await projectStore.createProject(newProject)
    showSuccess.value = true

    setTimeout(() => {
      router.push('/projects')
    }, 1000)
  } catch (error) {
    showSuccess.value = false
    handleCreateError(error)
  } finally {
    stopLoading()
  }
}

function handleCreateError(error: unknown) {
  apiErrors.value = []
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const problem = error as HttpValidationProblemDetails
    if (problem.errors) {
      apiErrors.value = Object.values(problem.errors).flat()
    } else if (problem.title) {
      apiErrors.value = [problem.title]
    }
  } else {
    apiErrors.value = ['Fout bij aanmaken van project']
  }
}
</script>

<template>
  <main class="main">
    <form class="form" novalidate @submit.prevent="tryCreateProject">
      <!-- Summary of errors or success message -->
      <FormSummary
        :success="showSuccess"
        :errors="errors"
        :api-errors="apiErrors"
        message="Project succesvol aangemaakt!"
      />
      <div class="title">
        <h2>Voeg nieuw project toe</h2>
      </div>

      <FormField
        id="projectName"
        v-model="projectName"
        type="text"
        label="Project naam"
        :error="errors.projectName"
        :required="true"
      />

      <DateField
        label="Project datum"
        :error="errors.projectYear || errors.projectMonth"
        :required="true"
        v-model:year="projectYear"
        v-model:month="projectMonth"
      />

      <FButton
        type="submit"
        :loading="isLoading"
        color="var(--white)"
        background-color="var(--dark-blue)"
      >
        Voeg project toe
      </FButton>
    </form>
  </main>
</template>

<style scoped lang="scss">
.main {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.form {
  width: 100%;
  max-width: 40rem;
  border-radius: 1rem;
  background-color: var(--light-blue);
  padding: 2rem;
  margin: 0 auto;

  .title {
    display: flex;
    margin-bottom: 1rem;

    h2 {
      margin: 0;
      -webkit-text-stroke: 0.02rem var(--black);
    }
  }

  .form-group {
    margin-bottom: 1rem;
  }
}
</style>
