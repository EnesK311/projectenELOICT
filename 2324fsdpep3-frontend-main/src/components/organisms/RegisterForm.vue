<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import router from '@/router'
import PeerButton from '@/components/atoms/PeerButton.vue'
import FormInput from '@/components/molecules/FormInput.vue'
import PeerA from '@/components/atoms/PeerA.vue'
import type { RegisterPayload } from '@/types'
import { useTitle } from '@vueuse/core'
import PeerFormTitle from '@/components/atoms/PeerFormTitle.vue'

const title = useTitle()
title.value = 'Register | Peer'

const { isAuthenticated } = storeToRefs(useAuthStore())

if (isAuthenticated.value) {
  router.push({ name: 'dashboard' })
}

const authStore = useAuthStore()

const firstname = ref<string>('')
const lastname = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordRepeat = ref<string>('')

// Using an object to map errors to specific fields
const errors = ref<{
  firstname: string
  lastname: string
  email: string
  password: string
  passwordRepeat: string
}>({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  passwordRepeat: ''
})

async function register() {
  // Reset all error messages
  errors.value = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordRepeat: ''
  }

  // Basic validation
  if (!firstname.value) errors.value.firstname = 'First name is required'
  if (!lastname.value) errors.value.lastname = 'Last name is required'
  if (!email.value.endsWith('@student.odisee.be')) {
    errors.value.email = 'Email must end with @student.odisee.be'
  }
  if (!email.value) errors.value.email = 'Fill in an email address'
  if (!password.value) errors.value.password = 'Fill in the password field'
  if (!passwordRepeat.value) errors.value.passwordRepeat = 'Confirm your password'
  if (password.value !== passwordRepeat.value) {
    errors.value.passwordRepeat = 'Passwords do not match'
  }

  // Only proceed if there are no errors
  if (!Object.values(errors.value).some((error) => error)) {
    try {
      const payload: RegisterPayload = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value,
        passwordRepeat: passwordRepeat.value
      }
      await authStore.register(payload)

      router.push({ name: 'dashboard' })
    } catch (error: any) {
      errors.value.email = error.message // General error handling for registration issues
    }
  }
}
</script>

<template>
  <section class="register">
    <form id="register-form" @submit.prevent="register" method="post">
      <PeerFormTitle>Register</PeerFormTitle>
      <FormInput
        label="First Name"
        id="firstname"
        name="firstname"
        type="text"
        v-model="firstname"
        :errorMessage="errors.firstname"
      />
      <FormInput
        label="Last Name"
        id="lastname"
        name="lastname"
        type="text"
        v-model="lastname"
        :errorMessage="errors.lastname"
      />
      <FormInput
        label="Email"
        id="email"
        name="email"
        type="email"
        v-model="email"
        :errorMessage="errors.email"
        autocomplete="email"
      />
      <FormInput
        label="Password"
        id="password"
        name="password"
        type="password"
        v-model="password"
        :errorMessage="errors.password"
        autocomplete="new-password"
      />
      <FormInput
        label="Confirm Password"
        id="confirm-password"
        name="confirm-password"
        type="password"
        v-model="passwordRepeat"
        :errorMessage="errors.passwordRepeat"
        autocomplete="new-password"
      />
      <PeerButton type="submit">Register</PeerButton>
      <RouterLink to="/login"><PeerA>Already have an account?</PeerA></RouterLink>
    </form>
  </section>
</template>

<style scoped lang="scss">
/* Form container */
.register {
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
