<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { getUserById } from '@/services/userService'
import type { User } from '@/types/type'
import DecorativeBackground from '@/components/atoms/DecorativeBackground.vue'
import { handleProfilePicture } from '@/utils/helper'
import { storeToRefs } from 'pinia'
import useAuthStore from '@/stores/auth'
import { useRoute } from 'vue-router'
import KnownSpecialities from '../atoms/KnownSpecialities.vue'
import { useProjectsStore } from '@/stores/project'
import { useToast, POSITION } from 'vue-toastification'

const props = defineProps<{
  id: string
  propUser?: User
}>()

const id = computed(() => props.id)

const updatedUser = computed(() => props.propUser)
const user = ref<User | null>(props.propUser ?? null)

watch(updatedUser, newUser => {
  if (!newUser) return
  user.value = newUser
})

const { user: authUser } = storeToRefs(useAuthStore())
const { removeProject } = useProjectsStore()

const toast = useToast()

const projects = ref(user.value?.projects ?? [])

watch(user, newUser => {
  projects.value = newUser?.projects ?? []
})

const sortedProjects = computed(() => {
  return projects.value.slice().sort((a, b) => {
    if (a.year === b.year) {
      return (a.month ?? 0) - (b.month ?? 0)
    }
    return (a.year ?? 0) - (b.year ?? 0)
  })
})

const sendRemoveProject = (projectId: number) => {
  projects.value = projects.value?.filter(project => project.id !== projectId)
  removeProject(projectId)
  toast.success('Project verwijderd', {
    position: POSITION.TOP_RIGHT,
  })
}

const fetchUser = async (userId: string) => {
  try {
    const res = await getUserById(userId)
    user.value = res.data.data
    applyRandomColors()
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const router = useRoute()

onMounted(() => {
  fetchUser(id.value)
})

watch(id, newId => {
  if (newId) {
    fetchUser(newId)
  }
})

const applyRandomColors = async () => {
  await nextTick()
  const colors: string[] = ['var(--blue-5)', 'var(--dark-blue-5)', 'var(--green-5)', 'var(--red-5)']
  const listItems = document.querySelectorAll('.projects ul li .project-info')

  listItems.forEach((item) => {
    const randomColor: string = colors[Math.floor(Math.random() * colors.length)];
    (item as HTMLElement).style.backgroundColor = randomColor
  })
}

const getMonthName = (month: number) => {
  const months = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ]
  return months[month - 1]
}
</script>

<template>
  <main>
    <DecorativeBackground />
    <div class="user">
      <div class="edit">
        <RouterLink
          class="editbutton"
          :to="'/edit-profile'"
          aria-label="Edit"
          v-if="authUser.id === user?.id && router.path !== '/edit-profile'"
        >
          <i class="fa-solid fa-pen"></i>Bewerk
        </RouterLink>
        <RouterLink
          class="venturesbutton"
          :to="'/add-ventures'"
          aria-label="Edit"
          v-if="authUser.id === user?.id && router.path !== '/add-ventures'"
        >
          <i class="fa-solid fa-plus"></i>Projecten toevoegen
        </RouterLink>
      </div>
      <div
        class="profile-picture"
        :style="{
          backgroundColor: user && user?.color ? user.color : 'var(--white)',
        }"
      >
        <img
          :src="handleProfilePicture(user?.profilePicture)"
          :alt="'Profiel foto ' + user?.firstname + ' ' + user?.lastname"
        />
      </div>
      <div class="user-info">
        <h1>
          {{
            user?.firstname && user.lastname
              ? user?.firstname + ' ' + user.lastname
              : 'Anonymous'
          }}
        </h1>
        <span v-if="user?.functionTitle && user?.company">Werkt als <span>{{ user.functionTitle }}</span> bij <span>{{ user.company.name }}</span> te <span>{{ user.company.city }}</span></span>
        <div class="about">
          <h2>Over mij</h2>
          <p>{{ user?.bio ?? 'Ik heb momenteel nog geen bio' }}</p>
        </div>
        <KnownSpecialities :specialities="user?.specialities?.known" />
      </div>
    </div>

    <div v-if="sortedProjects.length" class="projects">
      <h2><i class="fa-solid fa-project-diagram"></i>Projecten</h2>
      <ul tabindex="0" role="list"> 
        <li v-for="project in sortedProjects" :key="project.id">
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <p>{{ getMonthName(project.month || 1) }} {{ project.year }}</p>
          </div>
          <i
              v-if="authUser.id === user?.id"
              class="fa-solid fa-trash-can"
              style="cursor: pointer; color: red"
              @click="sendRemoveProject(project.id)"
            ></i>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  max-width: 85%;
  margin-inline: auto;
  margin-top: 4rem;

  .edit {
    display: flex;
    position: relative;
    top: 0;
    right: 0;
    margin: 0.1rem;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 1;

    .editbutton,
    .venturesbutton {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0.25rem;
      padding: 0rem 0.3rem;
      background-color: var(--bg);
      border: 0.15rem solid var(--red);
      color: var(--red);
      font-weight: 800;
      text-decoration: none;

      i {
        scale: 0.8;
      }
    }
  }

  .container {
    display: none;
  }

  div {
    padding: 1rem;
    background-color: var(--bg);
    border-radius: 0.5rem;
    position: relative;
  }

  .about {
    padding: 0;
    padding-top: 1rem;
  }

  .user {
    grid-column: span 2;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    padding: 0;

    .profile-picture {
      width: min(100%, 12rem);
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      padding: 0;

      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
      }
    }

    h1 {
      font-weight: 900;
      font-family: var(--source-sans-pro);
      font-size: clamp(2rem, 3vw, 5rem);
      margin: 0;
      line-height: 0.85;
    }

    span {
      font-weight: 200;
      font-style: italic;

      span {
        font-weight: 900;
        font-style: normal;
      }
    }

    h2 {
      margin: 0;
      font-size: 100%;
    }

    p {
      opacity: 0.8;
      margin: 0;
      margin-bottom: 1.5rem;
    }

    .specialities {
      max-width: 30rem;
      flex-wrap: wrap;
    }
  }

  .projects {
    flex-grow: 1;
    background-color: var(--bg);
    padding: 1rem 0;

    h2,
    h3,
    p {
      margin: 0;
    }

    h2 {
      color: var(--text);
      line-height: 0.7;
      margin-bottom: 1rem;
      font-size: 2rem;

      i {
        color: var(--green);
        margin-right: .5rem;
      }
    }

    ul::-webkit-scrollbar {
      display: hidden; /* Chrome, Safari, and Opera */
      behavior: smooth;
    }

    ul {
      margin: 0;
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 38rem;
      overflow-y: auto;
      padding: .3rem;
      scrollbar-width: none; /* Firefox */
      scroll-behavior: smooth;
      -ms-overflow-style: none; /* IE and Edge */

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .project-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          gap: 0.5rem;
        }

        i {
          cursor: pointer;
          margin-left: .5rem;
        }
      }
    }
  }
}

@media screen and (width > 35rem) {
  main {
    max-width: 95%;
  }
}

@media screen and (width > 60rem) {
  main {
    max-width: 85%;

    .edit {
      position: absolute;
      align-items: flex-end;
    }
  }

  main .container {
    display: block;
  }

  main .user {
    flex-direction: row;
    padding: 1rem;
    height: 40dvh;
    justify-content: space-evenly;

    .user-info {
      flex-grow: 0.5;

      h1 {
        font-size: 4rem;
      }
    }
  }

  main .info {
    flex-direction: row;

    > div {
      flex-grow: 0;
      width: 100%;
      padding: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h2 {
        font-size: 2rem;
      }
    }
  }
}
</style>
