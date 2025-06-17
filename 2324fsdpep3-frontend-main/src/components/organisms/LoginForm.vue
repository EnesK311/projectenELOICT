<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import router from '@/router'
import PeerButton from '@/components/atoms/PeerButton.vue'
import FormInput from '@/components/molecules/FormInput.vue'
import PeerA from '../atoms/PeerA.vue'
import PeerFormTitle from '../atoms/PeerFormTitle.vue'

const { isAuthenticated } = storeToRefs(useAuthStore())

if (isAuthenticated.value) {
  router.push({ name: 'dashboard' })
}

const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
// Using an object to map errors to specific fields
const errors = ref<{ email: string; password: string }>({
  email: '',
  password: ''
})

async function login() {
  // Reset errors
  errors.value.email = ''
  errors.value.password = ''

  if (!email.value) {
    errors.value.email = 'Fill in an email address'
  }
  if (!password.value) {
    errors.value.password = 'Fill in the password field'
  }

  if (email.value && password.value) {
    const message = await authStore.login({ email: email.value, password: password.value })
    if (message) {
      // General login error, you can handle it accordingly
      errors.value.email = message // For simplicity, attaching to email field
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <form id="login-form" @submit.prevent="login" method="post">
      <PeerFormTitle>Login</PeerFormTitle>
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
        autocomplete="current-password"
      />
      <PeerButton type="submit">Login</PeerButton>
      <RouterLink to="/register"><PeerA>No Account?</PeerA> </RouterLink>
      <RouterLink to="/password/request"><PeerA>Forgot your password?</PeerA></RouterLink>
    </form>
  </div>
</template>

<style scoped lang="scss">
#login-form {
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
