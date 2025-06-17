<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import PeerLabel from '../atoms/PeerLabel.vue'
import PeerA from '../atoms/PeerA.vue'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

//when clicked on logout logout the user
const logout = () => {
  useAuthStore().logout()
  router.push({ name: 'home' })
}
</script>
<template>
  <nav>
    <RouterLink :to="{ name: 'home' }"><p id="logo">Peer</p></RouterLink>

    <ul class="menu-list">
      <li v-if="isAuthenticated">
        <RouterLink :to="{ name: 'profile' }">
          Profile <i class="fa-solid fa-user"></i>
        </RouterLink>
      </li>
      <li v-if="isAuthenticated">
        <PeerA @click.prevent="logout"> Logout <i class="fa-solid fa-right-to-bracket"></i> </PeerA>
      </li>
      <li v-if="!isAuthenticated">
        <RouterLink :to="{ name: 'login' }">
          Login <i class="fa-solid fa-right-to-bracket"></i>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;

  #logo {
    font-family: 'Rock Salt', cursive;
    font-size: 1.5rem;
    font-weight: 700;
    font-style: normal;
  }

  .menu-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      margin-left: 1rem;
      a,
      .menu-link {
        text-decoration: none;

        &:hover {
          color: var(--accent-light);
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
