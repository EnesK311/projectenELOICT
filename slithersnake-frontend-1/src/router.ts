import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import HomeView from './components/pages/SgHome.vue'
import CharSelectView from './components/pages/SgCharSelect.vue'
import PlayView from './components/pages/SgPlay.vue'
import FindGame from './components/pages/SgFindGame.vue'
import CreateRoomView from './components/pages/SgCreateRoom.vue'
import SkinsView from './components/pages/SgSkins.vue'
import LeaderboardView from './components/pages/SgLeaderboard.vue'
import SettingsView from './components/pages/SgSettings.vue'
import ProfileView from './components/pages/SgProfile.vue'
import LoginView from './components/pages/SgLogin.vue'
import RegisterView from './components/pages/SgRegister.vue'
import NotFoundView from './components/pages/SgNotFound.vue'
import { useAuthStore } from './stores/auth'
import { authGuard } from './guards/authGuard'
import { loginGuard } from './guards/loginGuard'
import { ref } from 'vue'
import { resetIntervalGuard } from './guards/gameGuard'

const autoLoggedIn = ref<boolean>(false)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: [resetIntervalGuard]
    },
    {
      path: '/character-select',
      name: 'character-select',
      component: CharSelectView
    },
    {
      path: '/play',
      name: 'play',
      component: PlayView,
      beforeEnter: [resetIntervalGuard]
    },
    {
      path: '/find-game',
      name: 'find-game',
      component: FindGame,
      beforeEnter: [resetIntervalGuard]
    },
    {
      path: '/create-room',
      name: 'create-room',
      component: CreateRoomView,
      beforeEnter: [resetIntervalGuard]
    },
    {
      path: '/skins',
      name: 'skins',
      component: SkinsView,
      beforeEnter: [resetIntervalGuard]
    },{
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView,
      beforeEnter: [resetIntervalGuard]
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      beforeEnter: [resetIntervalGuard]
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
      beforeEnter: [authGuard, resetIntervalGuard]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: [loginGuard, resetIntervalGuard]
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: [loginGuard, resetIntervalGuard]
    },
    {
      path: '/redirect',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ]
})

router.beforeEach(async (to) => {
  if (!autoLoggedIn.value) {
    await useAuthStore().tryAutoLogin()
    autoLoggedIn.value = true
  }

  if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    return { path: '/login' }
  }

  if (to.meta.role === 'admin' && !useAuthStore().isAdmin) {
    return { path: '/redirect' }
  }
})

router.beforeEach((to, from) => {
  if (to.path === '/create-room' && from.path === '/play') {
    //return { path: '/' }
  }

  if (from.path === '/create-room') {
    sessionStorage.removeItem('creator')
  }
})


export default router
