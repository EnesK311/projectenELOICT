<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { User } from '@/types'
import PeerAnalytics from '@/components/organisms/PeerAnalytics.vue'
import { useTitle } from '@vueuse/core'
import PeerCreateTeacher from '@/components/organisms/PeerCreateTeacher.vue'
import PeerH2 from '@/components/atoms/PeerH2.vue'
import PeerAdjustMainPage from '@/components/organisms/PeerAdjustMainPage.vue'
import { ref } from 'vue'
import PeerAccordion from '@/components/molecules/PeerAccordion.vue'

const title = useTitle()
title.value = 'Profile | Peer'

const { user } = storeToRefs(useAuthStore())
const { isTeacher, isAdmin } = storeToRefs(useAuthStore())
//pass user id with props

const showCreateTeacher = ref(false)
const showAdjustMainPage = ref(false)

const toggleCreateTeacher = () => {
  showCreateTeacher.value = !showCreateTeacher.value
}

const toggleAdjustMainPage = () => {
  showAdjustMainPage.value = !showAdjustMainPage.value
}
</script>

<template>
  <main>
    <h2>Profile</h2>
    <div class="profile">
      <div class="profile-info" v-if="user">
        <p>Name: {{ user.firstname + ' ' + user.lastname }}</p>
        <p>Email: {{ user.email }}</p>
      </div>
    </div>
    <div v-if="!isTeacher && !isAdmin">
      <PeerAnalytics :user="user" />
    </div>
    <div v-if="isAdmin">
      <PeerAccordion :initially-open="false">
        <template #header>
          <PeerH2>Create a Teacher</PeerH2>
        </template>
        <template #content>
          <PeerCreateTeacher />
        </template>
      </PeerAccordion>

      <PeerAccordion :initially-open="false">
        <template #header>
          <PeerH2>Adjust Main Page</PeerH2>
        </template>
        <template #content>
          <PeerAdjustMainPage />
        </template>
      </PeerAccordion>
    </div>
  </main>
</template>

<style scoped lang="scss">
.accordion-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  background-color: --color-background;
  border-radius: 5px;
  margin: 0.5rem 0;
  font-weight: bold;
}

.accordion-header:hover {
  background-color: #e0e0e0;
}

.accordion-content {
  padding: 1rem;
  border-radius: 5px;
  margin: 0.5rem 0;
}

.accordion-icon {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
}

.accordion-icon.open {
  transform: rotate(90deg);
}
</style>
