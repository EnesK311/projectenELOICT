import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreateAssessmentView from '@/views/CreateAssessmentView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AssignAssessmentView from '@/views/AssignAssessmentView.vue'
import AssessmentView from '@/views/AssessmentView.vue'
import OpoView from '@/views/OpoView.vue'
import OposView from '@/views/OposView.vue'
import PasswordResetView from '@/views/PasswordResetView.vue'
import PasswordRequestView from '@/views/PasswordRequestView.vue'

import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { teacherGuard } from '@/guards/teacherGuard'
import { resetGuard } from '@/guards/resetGuard'
//check voor title in meta

//{ path: '/users/:id', component: () => import('./views/UserDetails.vue') },

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //NON LOGGED IN ROUTES ONLY 3
    {
      path: '/',
      name: 'home',
      //beforeEnter: [homeGuard],
      meta: { requiresAuth: false },
      component: HomeView
    },
    //login and register pages
    {
      path: '/login',
      name: 'login',
      //beforeEnter: [isLoggedinGuard],
      meta: { requiresAuth: false },
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      //beforeEnter: [isLoggedinGuard],
      meta: { requiresAuth: false },
      component: RegisterView
    },
    //ALL NEED TO BE LOGGED IN
    {
      path: '/dashboard',
      name: 'dashboard',
      //beforeEnter: [loginGuard],
      meta: { requiresAuth: true },
      component: DashboardView
    },
    {
      path: '/profile',
      name: 'profile',
      //beforeEnter: [loginGuard],
      meta: { requiresAuth: true },
      component: ProfileView
    },
    {
      path: '/assessment/:id',
      name: 'peerAsessment',
      meta: { requiresAuth: true },
      component: AssessmentView,
      props: true
    },
    {
      path: '/assessment/create',
      name: 'createAssessment',
      beforeEnter: [teacherGuard],
      meta: { requiresAuth: true },
      component: CreateAssessmentView
    },
    {
      path: '/opos',
      name: 'opos',
      beforeEnter: [teacherGuard],
      meta: { requiresAuth: true },
      component: OposView
    },
    //need to make view page still
    {
      path: '/opos/:id',
      name: 'opo',
      beforeEnter: [teacherGuard],
      meta: { requiresAuth: true },
      component: OpoView,
      props: true
    },
    // Reset password handling
    {
      path: '/password/reset',
      component: PasswordResetView,
      beforeEnter: [resetGuard],
      meta: { requiresAuth: false },
      props: (route) => ({ token: route.query.token, email: route.query.email })
    },
    {
      path: '/password/request',
      component: PasswordRequestView,
      meta: { requiresAuth: false },
      props: true
    },
    {
      //if random paga and route does not exist
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ]
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const { hasRehydrated, isAuthenticated } = storeToRefs(authStore)

  // Check rehydration (should be only first loadup)
  if (!hasRehydrated.value) {
    await authStore.rehydrateAuth()
  }

  // If the user is authenticated redirect to the dashboard
  if (isAuthenticated.value && ['home', 'login', 'register'].includes(to.name as string)) {
    next({ name: 'dashboard' })
  }
  // user is not authenticated redirect to login
  else if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
