<script setup lang="ts">
import ForgotPasswordForm from '@/components/organisms/ForgotPasswordForm.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const code = route.query.code as string
const email = route.query.email as string
</script>

<template>
  <ForgotPasswordForm :code="code" :email="email" />
</template>
