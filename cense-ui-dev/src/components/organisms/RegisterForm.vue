<script setup lang="ts">
import { ref } from 'vue'

import FormField from '@/components/atoms/FormField.vue'
import FormSummary from '@/components/atoms/FormSummary.vue'
import { useLoading } from '@/composables/loading'
import { useFormValidation } from '@/composables/formValidation'
import FButton from '@/components/atoms/FButton.vue'
import BackButton from '@/components/atoms/BackButton.vue'
import { RouterLink } from 'vue-router'
import useAuthStore from '@/stores/auth'
import type { HttpValidationProblemDetails } from '@/types/type'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const showVerify = ref<boolean>(false)

const form = {
  email: {
    value: email,
    rules: [
      (val: string) => (val ? null : 'Email is verplicht'),
      (val: string) =>
        /\S+@\S+\.\S+/.test(val)
          ? null
          : 'Email is in een niet geldig formaat (naam@provider.domein)',
    ],
  },
  password: {
    value: password,
    rules: [
      (val: string) => (val ? null : 'Passwoord is verplicht'),
      (val: string) =>
        val && val.length >= 8
          ? null
          : 'Passwoord moet minstens 8 karakters lang zijn',
      (val: string) =>
        val && /[A-Z]/.test(val)
          ? null
          : 'Passwoord moet minstens één hoofdletter bevatten',
      (val: string) =>
        val && /[0-9]/.test(val)
          ? null
          : 'Passwoord moet minstens één cijfer bevatten',
      (val: string) =>
        val && /[!@#$%^&*(),.?":{}|<>]/.test(val)
          ? null
          : 'Passwoord moet minstens één speciaal karakter bevatten',
    ],
  },
  confirmPassword: {
    value: confirmPassword,
    rules: [
      (val: string) =>
        val === password.value ? null : 'Passwoorden komen niet overeen',
    ],
  },
}

const submitted = ref<boolean>(false)
const { isLoading, startLoading, stopLoading } = useLoading()
const showSuccess = ref<boolean>(false)
const apiErrors = ref<string[]>([])

const { errors, validate } = useFormValidation(ref(form), submitted)

const tryRegister = async () => {
  submitted.value = true
  startLoading()
  validate()

  if (hasValidationErrors()) return stopLoading()

  try {
    await registerUser()
    await handleRegistrationSuccess()
  } catch (error) {
    handleRegistrationError(error)
  } finally {
    stopLoading()
  }
}

const hasValidationErrors = () => Object.keys(errors.value).length > 0

const registerUser = () =>
  authStore.registerUser({
    email: email.value,
    password: password.value,
  })

const handleRegistrationSuccess = async () => {
  if (authStore.error) {
    handleAuthError()
    return
  }
  showSuccess.value = true
  showVerify.value = true
}

const handleAuthError = () => {
  showSuccess.value = false
  showVerify.value = false

  console.log(authStore.error)
  apiErrors.value = extractErrorMessages(
    authStore.error as HttpValidationProblemDetails,
  )
}

const handleRegistrationError = (error: unknown) => {
  console.error(error)
  showSuccess.value = false
}

const extractErrorMessages = (error: HttpValidationProblemDetails) => {
  if (error.errors) {
    return Object.values(error.errors).flat()
  }
  console.log(error)
  return [error.title || 'Er is een fout opgetreden']
}

const { resendEmail } = useAuthStore()
const toast = useToast()

const resend = async () => {
  try {
    await resendEmail(email.value)
    toast.success('Email is opnieuw verstuurd')
  } catch {
    toast.error(
      'Er is iets misgegaan bij het versturen van de email. Probeer het later opnieuw',
    )
  }
}
</script>

<template>
  <main>
    <form method="post" class="form" novalidate @submit.prevent="tryRegister">
      <BackButton />
      <div class="wrapper" v-show="!showVerify">
        <div class="form-title">
          <img src="@/assets/images/fconnect_logo.png" alt="" />
          <h1>
            Maak een nieuw account
            <span>en maak deel uit van onze community</span>
          </h1>
        </div>
        <FormSummary
          :success="showSuccess"
          :errors="errors"
          :api-errors="apiErrors"
          message="Account is aangemaakt"
        ></FormSummary>
        <FormField
          id="email"
          v-model="email"
          type="email"
          :required="true"
          label="E-mail"
          :error="errors.email"
        ></FormField>
        <FormField
          id="password"
          v-model="password"
          type="password"
          :required="true"
          label="Wachtwoord"
          :error="errors.password"
          :eye="true"
        ></FormField>
        <FormField
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          :required="true"
          label="Herhaal Wachtwoord"
          :error="errors.confirmPassword"
        ></FormField>
        <FButton
          :loading="isLoading"
          type="submit"
          background-color="var(--dark-blue)"
          color="var(--white)"
          >Registreer</FButton
        >
        <p class="no-account">
          Heb je al een account?
          <RouterLink :to="{ name: 'login' }">Log in </RouterLink>
        </p>
      </div>
      <div v-show="showVerify" class="verify">
        <div class="form-title">
          <img src="@/assets/images/fconnect_logo.png" alt="" />
          <h2>Verifieer je email!</h2>
        </div>
        <p>
          Je bent er bijna! Er is een mail gestuurd naar
          <span>{{ email }}</span> met instructies om je e-mailadres te
          verifieren. Check je mail!
        </p>
        <div class="error">
          <p>
            Geen mail ontvangen?
            <button @click="resend">Verstuur e-mail opnieuw</button>
          </p>
        </div>

        <!-- <RouterLink :to="{ name: 'login' }">Terug naar login</RouterLink> -->
      </div>

      <!--
        <p class="seperator">of</p>
        <FButton
        class="ms-btn"
        type="button"
        background-color="var(--dark-blue-25)"
        color="var(--black)"
        ><img src="@/assets/images/Microsoft_Office.png" alt="MS office Logo" />

        Registreer met Microsoft Office</FButton
        >
        -->
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

  h1,
  h2 {
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

    .verify {
      p {
        font-weight: 500;
        margin: 0;

        span {
          color: var(--red);
          font-weight: 800;
        }
      }

      a {
        margin-top: 1rem;
        color: var(--red);
        padding: 0 0.2rem;
        border: 0.15rem solid var(--red);
        border-radius: 0.5rem;
        font-weight: 800;
        margin-left: auto;
        width: max-content;
        display: block;
        text-decoration: none;
      }
    }

    .error {
      margin-top: 1rem;
      p {
        width: max-content;
        font-weight: 600;
      }

      button {
        background-color: transparent;
        border: none;
        padding: 0.2rem;
        border-radius: 0.2rem;
        text-decoration: underline;
        color: var(--dark-blue);
        cursor: pointer;
        display: inline;
      }
    }

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
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 800;

      &[type='submit'] {
        width: 100%;
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
