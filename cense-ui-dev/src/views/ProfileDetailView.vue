<script setup lang="ts">
import ProfileDetailOrganism from '@/components/organisms/ProfileDetailOrganism.vue'

defineProps<{
  id: string
}>()
</script>

<template>
  <ProfileDetailOrganism :id="id" />
</template>
