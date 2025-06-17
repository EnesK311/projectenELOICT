<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTitle } from '@vueuse/core'
import PeerLabel from '@/components/atoms/PeerLabel.vue'
import PeerInput from '@/components/atoms/PeerInput.vue'
import PeerButton from '@/components/atoms/PeerButton.vue'
import PeerError from '@/components/atoms/PeerError.vue'
import { RouterLink } from 'vue-router'

const title = useTitle()
title.value = 'Request Password Reset | Peer'

const email = ref<string>('')

const errors = ref<string[]>([])
const successMessage = ref<string>('')

const authStore = useAuthStore()

async function requestPasswordReset() {
  errors.value = []
  successMessage.value = ''

  if (email.value) {
    const response = await authStore.sendPasswordResetLink({ email: email.value })

    if (response.success) {
      successMessage.value = 'A password reset link has been sent to your email.'
    } else {
      errors.value.push(response.message)
    }
  } else {
    errors.value.push('Please enter your email address.')
  }
}
</script>

<template>
  <section class="password-reset-form">
    <form id="password-reset-form" method="post">
      <!-- Error Messages -->
      <PeerError v-for="(err, index) in errors" :key="index">{{ err }}</PeerError>
      <!-- Success Message -->
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <!-- Email Input -->
      <div class="form-div">
        <PeerLabel for="email">Email</PeerLabel>
        <PeerInput type="email" id="email" name="email" v-model="email" autocomplete="email" />
      </div>

      <!-- Submit Button -->
      <PeerButton @click.prevent="requestPasswordReset">Send Reset Link</PeerButton>
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

/* Login link */
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
