<script setup lang="ts">
import MessageOrganism from '@/components/organisms/MessageOrganism.vue'
defineProps<{ chatId: string }>()
</script>

<template>
  <MessageOrganism :chat-id="chatId" />
</template>
