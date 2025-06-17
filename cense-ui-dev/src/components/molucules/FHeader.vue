<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import useAuthStore from '@/stores/auth'
import { handleProfilePicture } from '@/utils/helper'
import { useElementBounding } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAccessibilityStore } from '@/stores/accessibility'

const authStore = useAuthStore()
const accessibility = useAccessibilityStore()
const route = useRoute()
const router = useRouter()

const { totalUnreadMessageCount } = storeToRefs(useChatStore())

const links = [
  { name: 'CONNECT', path: '/connect' },
  { name: 'MAP', path: '/map' },
  { name: 'MESSAGES', path: '/chats' },
  { name: 'PROFILE', path: '/user/' + authStore.user?.id },
]

const sliderPosition = ref({ left: '0px', width: '0px' })
const activeLinkRef = ref<HTMLElement | null>(null)

const updateSlider = async () => {
  await nextTick()
  const activeLink = document.querySelector(
    '.router-link-active',
  ) as HTMLElement
  activeLinkRef.value = activeLink

  if (!activeLink) return

  if (route.path.startsWith('/user/')) {
    const slider = document.querySelector<HTMLLIElement>('.slider')
    if (slider) slider.classList.add('hidden')
    return
  }
  const slider = document.querySelector<HTMLLIElement>('.slider')
  if (slider) slider.classList.remove('hidden')

  await nextTick()

  const { x, width } = useElementBounding(activeLink)
  const parent = document.querySelector('nav')
  const { x: xParent } = useElementBounding(parent)
  if (xParent.value) {
    sliderPosition.value = {
      left: `${x.value - xParent.value - 10}px`,
      width: `${width.value + 20}px`,
    }
  }
}

watch(route, () => updateSlider())

onMounted(() => {
  setTimeout(() => {
    updateSlider()
  }, 100)
})
const sliderStyle = computed(() => ({
  left: sliderPosition.value.left,
  width: sliderPosition.value.width,
}))

const isActive = (path: string) => route.path === path

const handleNavToggle = () => {
  const nav = document.querySelector('nav')
  const hamburger = document.querySelector('.hamburger')
  if (nav && hamburger) {
    nav.classList.toggle('close')
    nav.classList.toggle('open')
    hamburger.classList.toggle('open')
    nav.setAttribute(
      'aria-expanded',
      nav.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
    )
  }
}

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const handleResize = () => {
  if (window.innerWidth > 46 * 16) {
    const nav = document.querySelector('nav')
    const hamburger = document.querySelector('.hamburger')
    if (nav && hamburger) {
      nav.classList.remove('close')
      hamburger.classList.remove('close')
      nav.classList.add('open')
      hamburger.classList.add('open')
      nav.setAttribute('aria-expanded', 'true')
    }
    updateSlider()
  }
}

window.addEventListener('resize', () => {
  const hamburger = document.querySelector('.hamburger')
  if (window.innerWidth > 46 * 16 && hamburger) {
    hamburger.classList.add('open')
  }
  handleResize()
})
</script>

<template>
  <header>
    <div class="logo-hamburger">
      <img src="../../assets/images/Logo_Big.png" alt="Facility Connect logo" :class="{ darkImage: accessibility.isDarkMode}" />
      <div class="hamburger open" aria-hidden="true" @click="handleNavToggle">
        <span class="burger-bar"></span>
        <span class="burger-bar"></span>
      </div>
    </div>
    <nav class="open" aria-expanded="true">
      <ul>
        <li v-for="link in links" :key="link.name">
          <RouterLink :to="link.path" :class="{ active: isActive(link.path) }">
            {{ link.name }}
          </RouterLink>
          <span
            v-if="link.name === 'MESSAGES' && totalUnreadMessageCount != 0"
            >{{ totalUnreadMessageCount }}</span
          >
        </li>
        <li>
          <button @click="logout">Logout</button>
        </li>
        <li class="slider" :style="sliderStyle"></li>
      </ul>
    </nav>
    <div class="user">
      <details>
        <summary>
          <div
            class="profile-picture"
            :style="{
              backgroundColor:
                authStore.user && authStore.user.color
                  ? authStore.user?.color
                  : 'var(--white)',
            }"
          >
            <img
              :src="handleProfilePicture(authStore.user?.profilePicture)"
              alt="User icon"
            />
          </div>

          <span>{{ authStore.user?.firstname }}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </summary>
        <ul>
          <li>
            <RouterLink :to="`/user/` + authStore.user?.id">
              <i class="fa-regular fa-circle-user"></i>Profile</RouterLink
            >
          </li>
          <li>
            <button @click="logout">
              <div class="logout"></div>
              Logout
            </button>
          </li>
        </ul>
      </details>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  gap: 1.5rem;

  .logo-hamburger {
    display: flex;
    width: 100%;
    align-items: center;

    img {
      margin-right: auto;
      width: min(100%, 8rem);
    }

    .darkImage {
      filter: invert(1);
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      cursor: pointer;
      background-color: var(--light-blue);
      padding: 0.5rem;
      aspect-ratio: 1;
      border-radius: 50%;
      width: 2.5rem;
      transition: background-color 0.5s ease;

      .burger-bar {
        width: 100%;
        height: 0.15rem;
        background-color: var(--black);
        border-radius: 1rem;
        transition: all 0.3s ease;

        &:last-child {
          width: 70%;
        }
      }

      &.open {
        .burger-bar {
          &:first-child {
            transform: rotate(45deg) translate(0.1rem, 0.1rem);
          }

          &:last-child {
            width: 100%;
            transform: rotate(-45deg) translate(0.1rem, -0.15rem);
          }
        }
      }
    }
  }

  &:has(nav[aria-expanded='true']) .logo-hamburger .hamburger {
    background-color: var(--dark-blue);

    span {
      background-color: var(--white);
    }
  }

  nav {
    background-color: var(--light-blue);
    padding: 0.5rem 1.2rem;
    border-radius: 1.2rem;
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;

    &.open {
      animation: open 0.5s ease-out forwards;
    }

    &.close {
      animation: close 0.5s ease-out forwards;
    }

    @keyframes close {
      0% {
        right: 0;
        opacity: 1;
        margin-top: 0;
      }
      60% {
        right: -110%;
        opacity: 0.5;
        margin-top: 0;
      }
      90% {
        margin-top: -18rem;
        margin-right: -90rem;
      }
      100% {
        margin-top: -21rem;
        margin-right: 0;
        margin-bottom: 3rem;
      }
    }

    @keyframes open {
      0% {
        margin-top: -100%;
        opacity: 0;
        left: -100%;
      }
      40% {
        margin-top: 0;
        opacity: 0;
        left: -100%;
      }
      100% {
        margin-top: 0;
        opacity: 1;
        left: 0;
      }
    }

    ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      width: 100%;
      gap: 0.5rem;
      padding: 0;
      margin: 0;

      .slider {
        display: none;
        position: absolute;
        height: 70%;
        background-color: var(--red-7);
        border-radius: 1rem;
        transition:
          left 0.3s ease-out,
          width 0.5s ease;
      }

      li {
        padding: 0.5rem;
        position: relative;
        width: min-content;

        span {
          position: absolute;
          top: 20%;
          right: -15%;
          background-color: var(--green);
          z-index: -1;
          height: 1.2rem;
          width: 1.2rem;
          border-radius: 50%;
          display: grid;
          place-content: center;
          font-weight: 800;
          color: var(--white);
          user-select: none;
        }

        a {
          font-family: var(--source-sans-pro);
          font-weight: 700;
          text-decoration: none;
          color: var(--black);
          display: block;

          &.router-link-active {
            padding-left: 1.2rem;
            font-size: 1rem;
            position: relative;

            &::before {
              display: block;
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 0.8rem;
              height: 0.8rem;
              border-radius: 50%;
              border: 0.15rem solid var(--red);
            }
          }
        }

        button {
          background-color: transparent;
          border: none;
          font-family: var(--source-sans-pro);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
        }
      }
    }
  }

  .user {
    display: none;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;

    details {
      transition: all 0.3s ease;
      position: relative;

      summary {
        display: flex;
        gap: 0.2rem;
        align-items: center;
        user-select: none;
        padding: 0.3rem;
        border-radius: 0.5rem 0.5rem 0 0;
        cursor: pointer;

        i {
          margin-left: 0.3rem;
          color: var(--dark-blue);
          scale: 0.8;
          transition: rotate 0.5s ease;
        }
      }

      &[open] {
        summary {
          background-color: var(--dark-blue);
          color: var(--white);

          > i {
            color: var(--white);
            rotate: 180deg;
          }
        }

        ul {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          height: auto;
        }

        .profile-picture {
          border: 0.2rem solid var(--white);
        }
      }

      ul {
        position: absolute;
        z-index: 999;
        margin: 0;
        list-style: none;
        width: 100%;
        background-color: var(--dark-blue);
        padding: 0.5rem;
        border-radius: 0.5rem;
        height: 0;
        transition: height 0.5s ease;

        li :is(a, button) {
          color: var(--white);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          padding: 0;

          i {
            scale: 0.8;
            translate: 0 0.1rem;
          }

          .logout {
            width: 1rem;
            height: 1rem;
            background-image: url('../../assets/svg/logout.svg');
            background-size: contain;
            display: inline-block;
          }
        }
      }
    }

    span {
      font-family: var(--source-sans-pro);
      font-weight: 700;
      font-size: 1.25rem;
    }

    .profile-picture {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      overflow: hidden;
      border: 0.2rem solid var(--dark-blue);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }

    button {
      border: none;
      background-color: transparent;
      cursor: pointer;
      color: var(--red);
      font-weight: 400;
      transition: color 0.5s ease;
    }
  }
}

@media screen and (width > 46rem) {
  header {
    flex-direction: row;

    .logo-hamburger {
      width: auto;

      img {
        margin-right: 0;
      }

      .hamburger {
        display: none;
      }
    }

    nav {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
      animation: none;

      &.open {
        animation: none;
      }

      &.close {
        animation: none;
      }

      ul {
        flex-direction: row;
        align-items: center;
        gap: 2.5rem;

        .slider {
          display: block;

          &.hidden {
            display: none;
          }
        }

        li {
          padding: 0;
          z-index: 2;

          span {
            top: -10%;
            right: -15%;
            font-size: 80%;
            width: 1rem;
            height: 1rem;
          }

          &:nth-child(4),
          &:nth-child(5) {
            display: none;
          }

          &:last-child {
            z-index: 1;
          }

          a {
            &.router-link-active {
              padding: 0;
              &::before {
                display: none;
              }
            }
          }
        }
      }
    }

    .user {
      display: flex;
    }
  }
}
</style>
