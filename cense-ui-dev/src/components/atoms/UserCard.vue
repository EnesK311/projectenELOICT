<script setup lang="ts">
import type { User } from '@/types/type'
import { handleProfilePicture } from '@/utils/helper'
import { useRouter } from 'vue-router'
import KnownSpecialities from './KnownSpecialities.vue'

const props = defineProps<{ user: User }>()

const router = useRouter()

const handleClick = () => {
  router.push(`/user/${props.user.id}`)
}
</script>

<template>
  <div v-if="user" class="user" @click.stop="handleClick">
    <div class="pf">
      <img 
        :src="handleProfilePicture(user.profilePicture)" 
        :alt="user.firstname + ' ' + user.lastname + ' profile picture'"
        :style="{ backgroundColor: user.color || 'var(--white)' }"
      />
      <span
        class="status"
        :style="{
          backgroundColor: user.isOnline ? 'var(--green)' : 'var(--gray)',
        }"
      ></span>
    </div>
    <div class="content">
      <h3>
        {{
          user.firstname && user.lastname
            ? user.firstname + ' ' + user.lastname
            : 'Anonymous'
        }}
      </h3>
      <KnownSpecialities :specialities="user.specialities?.known" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.user {
  border-radius: 1rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .pf {
    width: 3.5rem;
    border-radius: 50%;
    aspect-ratio: 1;
    // overflow: hidden;
    position: relative;
    img {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      object-fit: cover;
      border: 0.2rem solid var(--dark-blue-5);
    }

    .status {
      position: absolute;
      display: inline-block;
      width: 25%;
      aspect-ratio: 1;
      border-radius: 50%;
      bottom: 0;
      right: 0;
      margin: 0.4rem 0.1rem;
      border: 0.1rem solid var(--white);
    }
  }

  .content {
    width: 100%;
    h3 {
      margin: 0;
      margin-top: 0.5rem;
      font-size: 130%;
      line-height: 0.8;
    }

    p {
      margin: 0;
      opacity: 0.7;
      font-size: 90%;
      line-height: 1.2;
      margin-top: 0.2rem;
    }

    .specialities {
      margin: 0;
      margin-top: 0.5rem;
      padding: 0;
      display: flex;
      list-style: none;
      gap: 0.5rem;
      align-items: center;
      max-width: 20rem;
      overflow-x: hidden;

      li {
        width: max-content;
        text-wrap: nowrap;
        padding: 0rem 0.5rem;
        border-radius: 50rem;
        background-color: var(--light-blue-25);
        border: 0.1rem solid var(--light-blue);
      }
    }
  }
}
</style>
