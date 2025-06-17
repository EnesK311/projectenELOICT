<script setup lang="ts">
import VerifyEmailOrganism from '@/components/organisms/VerifyEmailOrganism.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.query.userId as string
const code = route.query.code as string
const email = route.query.email as string
</script>

<template>
  <VerifyEmailOrganism :user-id="userId" :code="code" :email="email" />
</template>
