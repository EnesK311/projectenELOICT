<script setup lang="ts">
import { ref } from 'vue'

import FormField from '@/components/atoms/FormField.vue'
import FormSummary from '@/components/atoms/FormSummary.vue'
import { useLoading } from '@/composables/loading'
import { useFormValidation } from '@/composables/formValidation'
import FButton from '@/components/atoms/FButton.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import { useRouter, useRoute } from 'vue-router'
import useAuthStore from '@/stores/auth'
import type { HttpValidationProblemDetails } from '@/types/type'

const props = defineProps<{ code: string; email: string }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { resetPassword } = useAuthStore()
const password = ref<string>('')
const confirmPassword = ref<string>('')

const form = {
  confirmPassword: {
    value: confirmPassword,
    rules: [
      (val: string) =>
        val === password.value ? null : 'Passwoorden komen niet overeen',
    ],
  },
  password: {
    value: password,
    rules: [(val: string) => (val ? null : 'Password is verplicht')],
  },
}

const submitted = ref<boolean>(false)
const { isLoading, startLoading, stopLoading } = useLoading()
const showSuccess = ref<boolean>(false)
const apiErrors = ref<string[]>([])

const { errors, validate } = useFormValidation(ref(form), submitted)

const tryLogin = async () => {
  submitted.value = true
  startLoading()
  validate()

  if (hasValidationErrors()) return stopLoading()

  try {
    await sendForgotPassword()
    handleSuccess()
  } catch (error) {
    handleError(error)
  } finally {
    stopLoading()
  }
}

const hasValidationErrors = () => Object.keys(errors.value).length > 0

const sendForgotPassword = async () => {
  await resetPassword(props.email, props.code, password.value)
}

console.log(props.email, props.code)

const handleSuccess = () => {
  if (authStore.error) {
    processAuthError()
    return
  }
  showSuccessMessage()
}

const processAuthError = () => {
  showSuccess.value = false
  apiErrors.value = extractErrorMessages(
    authStore.error as HttpValidationProblemDetails,
  )
}

const showSuccessMessage = () => {
  showSuccess.value = true
  setTimeout(() => {
    const redirectPath = route.query.redirect
      ? (route.query.redirect as string)
      : { name: 'login' }
    router.push(redirectPath)
  }, 1000)
}

const handleError = (error: unknown) => {
  showSuccess.value = false
  if (typeof error === 'object' && error !== null) {
    errors.value = { ...errors.value, ...error }
  } else {
    errors.value.general = error as string
  }
}

const extractErrorMessages = (error: HttpValidationProblemDetails) => {
  if (error.errors) {
    return Object.values(error.errors).flat()
  }

  return [error.title || 'Er is een fout opgetreden']
}
</script>

<template>
  <main>
    <form method="post" class="form" novalidate @submit.prevent="tryLogin">
      <BackButton />
      <div class="form-title">
        <img src="@/assets/images/fconnect_logo.png" alt="" />
        <h1>Wachtwoord Vergeten? <span> Reset je wachtwoord!</span></h1>
      </div>
      <FormSummary
        :success="showSuccess"
        :errors="errors"
        :api-errors="apiErrors"
        message="Wachtwoord successvol gereset"
      ></FormSummary>

      <FormField
        id="password"
        v-model="password"
        type="password"
        :required="true"
        label="Nieuw wachtwoord"
        :error="errors.password"
        :eye="true"
      ></FormField>

      <FormField
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        :required="true"
        label="Herhaal nieuw wachtwoord"
        :error="errors.confirmPassword"
      ></FormField>

      <FButton
        :loading="isLoading"
        type="submit"
        background-color="var(--dark-blue)"
        color="var(--white)"
        >Reset Wachtwoord</FButton
      >
    </form>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .form-title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    font-weight: 800;
    line-height: 1;
    text-align: center;
    -webkit-text-stroke: 0.07rem var(--black);
    font-size: 170%;

    span {
      display: block;
      font-size: 60%;
      color: var(--dark-blue);
      -webkit-text-stroke: 0rem;
    }
  }

  form {
    width: min(100%, 22rem);
    border-radius: 1rem;
    background-color: var(--light-blue);
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;

    .seperator {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 0;

      &::before,
      &::after {
        content: '';
        display: inline-block;
        width: 50%;
        height: 1px;
        background-color: var(--black);
        margin: 0 0.5rem;
      }
    }

    :deep(button) {
      background-color: var(--dark-blue);
      color: var(--white);
      display: flex;
      justify-content: center;
      align-items: center;

      &.loading {
        color: var(--dark-blue);
      }

      img {
        width: 1.5rem;
        height: 1.5rem;
        object-fit: contain;
      }
    }

    .ms-btn {
      background-color: rgba(13, 66, 151, 0.4);
      color: var(--black);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 400;

      img {
        width: 1.5rem;
        height: 1.5rem;
        object-fit: contain;
      }
    }

    .no-account {
      text-align: center;
      margin-top: 1rem;
    }

    p a {
      color: var(--dark-blue);
      font-weight: 600;

      &:hover {
        background-color: transparent;
      }
    }
  }
}
</style>
