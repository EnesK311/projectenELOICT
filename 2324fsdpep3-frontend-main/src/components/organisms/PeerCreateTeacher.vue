<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import router from '@/router'
import PeerButton from '@/components/atoms/PeerButton.vue'
import PeerLabel from '@/components/atoms/PeerLabel.vue'
import PeerError from '@/components/atoms/PeerError.vue'
import { useTitle } from '@vueuse/core'
import FormInput from '@/components/molecules/FormInput.vue'
import PeerFormTitle from '../atoms/PeerFormTitle.vue'

const { isAuthenticated } = storeToRefs(useAuthStore())

const authStore = useAuthStore()

// Fields for teacher creation
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')

// Error handling
const errors = ref<{ firstName: string; lastName: string; email: string }>({
  firstName: '',
  lastName: '',
  email: ''
})

const response = ref<string>('')

const submitForm = async () => {
  // Reset errors
  errors.value.firstName = ''
  errors.value.lastName = ''
  errors.value.email = ''

  if (!firstName.value) {
    errors.value.firstName = 'First name is required.'
  }
  if (!lastName.value) {
    errors.value.lastName = 'Last name is required.'
  }
  if (!email.value) {
    errors.value.email = 'Email is required.'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Please provide a valid email address.'
  }

  if (!errors.value.firstName && !errors.value.lastName && !errors.value.email) {
    const result = await authStore.createTeacher({
      firstname: firstName.value,
      lastname: lastName.value,
      email: email.value
    })

    if (result.success) {
      response.value = result.message
      //reset form
      firstName.value = ''
      lastName.value = ''
      email.value = ''
    } else {
      errors.value.email = result.message
    }
  }
}

// Simple email validation function
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
</script>

<template>
  <section class="teacher-create">
    <form @submit.prevent="submitForm" method="post">
      <PeerFormTitle>Create Teacher</PeerFormTitle>

      <div v-if="response" class="success-message">
        {{ response }}
      </div>
      <FormInput
        label="First Name"
        id="firstName"
        name="firstName"
        type="text"
        v-model="firstName"
        :errorMessage="errors.firstName"
        autocomplete="given-name"
      />
      <FormInput
        label="Last Name"
        id="lastName"
        name="lastName"
        type="text"
        v-model="lastName"
        :errorMessage="errors.lastName"
        autocomplete="family-name"
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

      <PeerButton type="submit">Create Teacher</PeerButton>
    </form>
  </section>
</template>

<style scoped lang="scss">
.teacher-create {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
}

.peer-error {
  color: #dc3545;
  margin-bottom: 10px;
}
</style>
