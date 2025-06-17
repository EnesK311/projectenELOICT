<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import PeerButton from '@/components/atoms/PeerButton.vue'
import { useTitle } from '@vueuse/core'

const title = useTitle()
title.value = 'Set New Password | Peer'

const route = useRoute()
const router = useRouter()

const token = ref<string>((route.query.token as string) || '')
const email = ref<string>((route.query.email as string) || '')
const password = ref<string>('')
const passwordConfirmation = ref<string>('')
const errors = ref<string[]>([])
const successMessage = ref<string>('')

const authStore = useAuthStore()

async function resetPassword() {
  errors.value = []
  successMessage.value = ''

  if (password.value && password.value === passwordConfirmation.value) {
    const response = await authStore.resetPassword({
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    if (response.success) {
      successMessage.value = 'Your password has been reset successfully.'
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 3000) // Redirect after 3 seconds
    } else {
      errors.value.push(response.message)
    }
  } else {
    if (!password.value) errors.value.push('Please enter a password.')
    if (password.value !== passwordConfirmation.value) errors.value.push('Passwords do not match.')
  }
}
</script>

<template>
  <section class="password-reset-form">
    <form id="password-reset-form" method="post">
      <div class="errors" v-for="(err, index) in errors" :key="index">{{ err }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <!-- Visible email field (readonly) -->
      <div class="form-div">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="email"
          autocomplete="username"
          readonly
        />
      </div>

      <div class="form-div">
        <label for="password">New Password</label>
        <input
          type="password"
          id="password"
          name="password"
          v-model="password"
          autocomplete="new-password"
        />
      </div>
      <div class="form-div">
        <label for="password-confirmation">Confirm Password</label>
        <input
          type="password"
          id="password-confirmation"
          name="password_confirmation"
          v-model="passwordConfirmation"
          autocomplete="new-password"
        />
      </div>

      <PeerButton @click.prevent="resetPassword">Reset Password</PeerButton>
      <RouterLink to="/login" class="link">Back to login</RouterLink>
    </form>
  </section>
</template>

<style scoped lang="scss">
/* Form container */
.password-reset-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Form fields */
.form-div {
  margin-bottom: 15px;
}

/* Form labels */
label {
  display: block;
  font-weight: bold;
}

/* Input fields */
input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

/* Error messages */
.errors {
  color: red;
  margin-bottom: 10px;
}

/* Success message */
.success {
  color: green;
  margin-bottom: 10px;
}

/* Reset button */
button[type='submit'] {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button[type='submit']:hover {
  background-color: #0056b3;
}

/* Back to login link */
.link {
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
