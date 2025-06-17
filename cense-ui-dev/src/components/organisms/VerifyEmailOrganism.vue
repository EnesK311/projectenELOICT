<script setup lang="ts">
import useAuthStore from '@/stores/auth'
import BackButton from '../atoms/BackButton.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const props = defineProps<{ userId: string; code: string; email: string }>()
const showSuccess = ref(false)

const { confirmEmail, resendEmail } = useAuthStore()

const verifyEmail = async () => {
  try {
    await confirmEmail(props.userId, props.code)
    showSuccess.value = true
  } catch {
    showSuccess.value = false
  }
}

verifyEmail()
const toast = useToast()

const resend = async () => {
  try {
    await resendEmail(props.email)
    toast.success('Email is opnieuw verstuurd')
  } catch {
    toast.error(
      'Er is iets misgegaan bij het versturen van de email. Probeer het later opnieuw',
    )
  }
}
const router = useRouter()
const sendToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <main>
    <div class="hero" v-if="showSuccess">
      <i class="fa-regular fa-circle-check"></i>
      <h1>Email successvol geverifieerd!</h1>
      <BackButton @click.prevent="sendToLogin">Terug</BackButton>
    </div>
    <div class="error" v-if="!showSuccess">
      <i class="fa-regular fa-circle-xmark"></i>
      <h1>Fout bij het verifieren van je e-mailadres</h1>
      <button @click="resend">Verstuur e-mail opnieuw</button>
      <BackButton @click.prevent="sendToLogin">Terug</BackButton>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 75dvh;

  .hero,
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i {
      font-size: 5dvw;
      color: var(--green);
    }
    h1 {
      font-size: 3dvw;
      width: min(100%, 25rem);
      font-weight: 900;
      color: var(--red-7);
      line-height: 1;
      z-index: -1;
      margin: 0;
      span {
        display: inline-block;
        transition: transform 0.5s;
        &:nth-child(2) {
          color: var(--dark-blue-7);
        }
        &:nth-child(3) {
          color: var(--green-7);
        }
      }
    }
    p {
      font-size: 2.5dvw;
      margin: 5dvw 0 1rem;
    }

    button {
      background-color: transparent;
      border: none;
      padding: 0.2rem;
      border-radius: 0.2rem;
      text-decoration: underline;
      color: var(--dark-blue);
    }
    .back-button {
      :deep(button) {
        margin-top: 0.5rem;
        background-color: var(--dark-blue);
        padding: 0 2dvw;
      }
    }
  }

  .error i {
    color: var(--red);
  }
}
</style>
