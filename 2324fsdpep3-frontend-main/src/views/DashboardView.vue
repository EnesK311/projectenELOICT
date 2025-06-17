<script setup lang="ts">
//fetch all assesments and show on dashboard
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import router from '@/router'
import PeerAssessmentList from '@/components/organisms/PeerAssessmentList.vue'
import { useTitle } from '@vueuse/core'
import PeerH2 from '@/components/atoms/PeerH2.vue'

const title = useTitle()
title.value = 'Dashboard | Peer'

const { isTeacher, isAdmin } = storeToRefs(useAuthStore())
</script>

<template>
  <main>
    <PeerH2>Dashboard</PeerH2>
    <div class="dashboard">
      <div v-if="isTeacher || isAdmin" class="dashboard-buttons">
        <RouterLink :to="{ name: 'createAssessment' }"> Create New Assessment </RouterLink>
        <RouterLink :to="{ name: 'opos' }"> OPOs </RouterLink>
        <RouterLink v-if="isAdmin" :to="{ name: 'profile' }"> Create New Teacher </RouterLink>
      </div>
      <div class="peer-assessment-list">
        <h2>Peer Assessments</h2>
        <PeerAssessmentList />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss"></style>
