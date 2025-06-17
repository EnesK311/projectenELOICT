<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const openMenu = ref(false)
const windowWidth = ref(window.innerWidth)

const thresholdWidthEm = 45

function goToLogin() {
  router.push({ name: 'login' })
}

function goToProfile() {
  router.push({ name: 'profile' })
}

function toggleMenu() {
  openMenu.value = !openMenu.value
}

function handleResize() {
  windowWidth.value = window.innerWidth
  if (window.innerWidth / 16 > thresholdWidthEm) {
    openMenu.value = true
  } else {
    openMenu.value = false
  }
}

onMounted(() => {
  openMenu.value = window.innerWidth >= 45 ? true : false
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(windowWidth, (newValue) => {
  if (newValue / 16 > thresholdWidthEm) {
    openMenu.value = true
  } else {
    openMenu.value = false
  }
})
</script>
<template>
    <nav>
        <button @click="toggleMenu" aria-expanded="false" class="toggle hamburger" id="menu">
            <span aria-hidden="true" class="icon">
            <span></span><span></span><span></span>
            </span>
        </button>

        <RouterLink to="/" id="logo" href="/" aria-label="logo" tabindex="0">
            <h1>Slithersnake</h1>
        </RouterLink>

        <div v-show="openMenu" class="menu-items">
            <ul class="menu-list">
                <li>
                    <RouterLink :to="{ name: 'leaderboard'}">Leaderboard <i class="fa-solid fa-trophy"></i></RouterLink>
                </li>
                <li v-if="useAuthStore().isAuthenticated">
                    <RouterLink :to="{ name: 'profile'}">Profile <i class="fa-solid fa-user"></i></RouterLink>
                </li>
                <li v-if="!useAuthStore().isAuthenticated">
                    <RouterLink :to="{ name: 'login'}">Login<i class="fa-solid fa-right-to-bracket"></i></RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'settings'}">Settings <i class="fa-solid fa-gear"></i></RouterLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;

  #logo {
    order: -1;
  }

  .menu-items {
    width: 100%;
    padding-left: 2rem;
    display: flex;
    flex-flow: column;

    .menu-list {
      display: flex;
      flex-flow: column;
      gap: 0.5rem;
      list-style-type: none;
      padding: 0;

      li {
        display: flex;
        flex-flow: row;
        align-items: center;

        i {
          margin-left: 0.2rem;
          font-size: 1em;
        }

        a {
            font-size: 1.2em;
            color: var(--default-text-dark);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
                color: var(--accent-light);
            }
        }
      }
    }

    .menu-btn {
      margin-top: 0.5rem;
    }
  }

  .hamburger {
    background-color: transparent;
    border: none;

    .icon {
      display: flex;
      flex-flow: column;
      cursor: pointer;

      span {
        display: block;
        width: 20px;
        border: 2px solid var(--default-text-dark);
        margin: 3px auto;
      }
    }
  }
}

@media (min-width: 45em) {
  nav {
    flex-flow: row nowrap;
    gap: 3rem;

    .menu-items {
        flex-flow: row;
        justify-content: end;
        align-items: center;
        width: 100%;

        .menu-list {
            flex-flow: row;
            gap: 3rem;
        }

        .menu-btn {
            display: block;
            margin: 0;
        }
    }

    .hamburger {
      display: none;
    }
  }
}
</style>