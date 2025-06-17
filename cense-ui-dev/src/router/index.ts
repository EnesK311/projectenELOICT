import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import { useNetwork } from '@vueuse/core'
import { useToast, POSITION } from 'vue-toastification'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
        description:
          'Facility Connect landingspagina om informatie over de website te vinden',
        requiresAuth: false,
        showInFooter: true,
        showFooter: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Inloggen',
        description: 'Inlogpagina om in te loggen op de website',
        requiresAuth: false,
        showFooter: false,
      },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: 'Registreer',
        description: 'Registratiepagina om te registreren voor de website',
        requiresAuth: false,
        showInFooter: false,
      },
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/complete-profile',
      name: 'complete-profile',
      props: true,
      component: () => import('../views/CompleteProfileView.vue'),
      meta: {
        title: 'Vervolledig Profiel',
        description: 'Vervolledig Profiel om te registreren voor de website',
        requiresAuth: true,
        showInFooter: false,
        showInHeader: false,
      },
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      props: true,
      component: () => import('../views/EditProfileView.vue'),
      meta: {
        title: 'Pas Je Profiel Aan',
        description: 'Pas Je Profiel Aan Zoals Je Zelf Wilt',
        requiresAuth: true,
        showInFooter: false,
        showInHeader: false,
        showHeader: true,
        showFooter: true,
      },
    },{
      path: '/add-ventures',
      name: 'add-ventures',
      props: true,
      component: () => import('../views/AddVenturesView.vue'),
      meta: {
        title: 'Pas Je Profiel Aan',
        description: 'Pas Je Profiel Aan Zoals Je Zelf Wilt',
        requiresAuth: true,
        showInFooter: false,
        showInHeader: false,
        showHeader: true,
        showFooter: true,
      },
    },

    {
      path: '/connect',
      name: 'connect',
      component: () => import('../views/ConnectView.vue'),
      meta: {
        title: 'Connect',
        description: 'Connectpagina om te connecten met andere users',
        requiresAuth: true,
        showHeader: true,
        showFooter: true,
        showInFooter: true,
      },
    },
    {
      path: '/accessibility',
      name: 'accessibility',
      component: () => import('../views/AccessibilityView.vue'),
      meta: {
        title: 'Toegankelijkheid',
        description:
          'Toegankelijkheidspagina om informatie over de website te vinden',
        requiresAuth: true,
        showHeader: false,
        showFooter: true,
        showInFooter: false,
      },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
      meta: {
        title: 'Kaart',
        description: 'Kaartpagina om users te bekijken',
        requiresAuth: true,
        showHeader: true,
        showFooter: true,
        showInFooter: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileDetailView.vue'),
      props: true,
      meta: {
        title: 'Profiel',
        description: 'Facility Connect Profielpagina om je profiel te bekijken',
        requiresAuth: true,
        showInFooter: false,
        showFooter: true,
        showHeader: true,
      },
    },
    {
      path: '/chats',
      name: 'chats',
      meta: {
        title: 'Berichten',
        description: 'Chat page to chat with other users',
        requiresAuth: true,
        showInFooter: true,
        showFooter: true,
        showHeader: true,
      },
      component: () => import('../views/ChatView.vue'),
      children: [
        {
          path: ':chatId',
          name: 'chat',
          props: true,
          meta: {
            title: 'Chat',
            description: 'Chat page to chat with other users',
            requiresAuth: true,
            showInFooter: false,
            showFooter: true,
            showHeader: true,
          },
          component: () => import('../views/MessageView.vue'),
        },
      ],
    },
    {
      path: '/user/:id',
      name: 'profile-detail',
      props: true,
      meta: {
        title: 'Profiel ',
        description:
          'Facility Connect ProfielDetailpagina om een profiel van een andere users te bekijken',
        requiresAuth: true,
        showInFooter: false,
        showFooter: true,
        showHeader: true,
      },
      component: () => import('../views/ProfileDetailView.vue'),
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      props: true,
      meta: {
        title: 'Verifieer Emailadres ',
        description:
          'Verifieer Emailadres Pagina om je emailadres te verifiëren',
        requiresAuth: false,
        showInFooter: false,
        showFooter: false,
        showHeader: false,
      },
      component: () => import('../views/VerifyEmail.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      props: true,
      meta: {
        title: 'Wachtwoord Reset ',
        description: 'Wachtwoord reset pagina om je emailadres te verifiëren',
        requiresAuth: false,
        showInFooter: false,
        showFooter: false,
        showHeader: false,
      },
      component: () => import('../views/ForgotPassword.vue'),
    },
    {
      path: '/send-forgot-password',
      name: 'send-forgot-password',
      props: true,
      meta: {
        title: 'Stuur Wachtwoord Reset  ',
        description: 'Stuur Wachtwoord Reset pagina om wachtwoord te resetten',
        requiresAuth: false,
        showInFooter: false,
        showFooter: false,
        showHeader: false,
      },
      component: () => import('../views/SendForgotPassword.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: '404',
        description: 'Pagina niet gevonden',
        requiresAuth: false,
        showInFooter: false,
        showFooter: false,
      },
    },
  ],
})

// Global navigation guard
//when auth is implemented check here if user is logged in
router.beforeEach(async to => {
  const authStore = useAuthStore()
  const newtwork = useNetwork()
  const toast = useToast()

  // check internet connection
  if (!newtwork.isOnline.value) {
    toast.error('Geen internetverbinding', { position: POSITION.TOP_CENTER })
    return false
  }

  // niet ingelogd en wilt naar een pagina die alleen voor ingelogde gebruikers is
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    toast.warning('Je moet ingelogd zijn om deze pagina te bekijken', {
      position: POSITION.TOP_RIGHT,
    })
    return { name: 'login' }
  }

  // eerste keer dat gebruiker inlogt / niet compleet profiel
  if (
    to.meta.requiresAuth &&
    authStore.isAuthenticated &&
    !authStore.profileComplete &&
    to.name !== 'complete-profile'
  ) {
    console.log('complete profile: ' + authStore.profileComplete)
    return { name: 'complete-profile' }
  }

  if (
    to.meta.requiresAuth &&
    authStore.isAuthenticated &&
    authStore.profileComplete &&
    to.name == 'complete-profile'
  ) {
    return { name: 'connect' }
  }

  // gebruikers naar connect sturen als ze al ingelogd zijn
  if (
    !to.meta.requiresAuth &&
    authStore.isAuthenticated &&
    to.name !== 'home'
  ) {
    return { name: 'connect' }
  }

  //set page title and description
  if (to.meta.title === 'Home') {
    to.meta.title = 'FConnect'
  } else {
    document.title = ('FConnect | ' + to.meta.title) as string
  }
  if (document.querySelector('meta[name="description"]')) {
    ;(
      document.querySelector('meta[name="description"]') as HTMLMetaElement
    ).content = to.meta.description as string
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = to.meta.description as string
    document.getElementsByTagName('head')[0].appendChild(meta)
  }

  return true
})

export default router
