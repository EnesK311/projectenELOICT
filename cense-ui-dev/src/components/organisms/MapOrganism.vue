<script setup lang="ts">
import MapFilters from '@/components/molucules/MapFilters.vue'
import MapHeader from '@/components/molucules/MapHeader.vue'
import MapSearch from '@/components/molucules/MapSearch.vue'
import { useUserStore } from '@/stores/user'
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import '@/assets/popup.scss'
import { vShortenText } from '@/utils/custom-directives'
import useAuthStore from '@/stores/auth'
import type { User } from '@/types/type'
import { useChatStore } from '@/stores/chat'
import { useToast } from 'vue-toastification'

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY
const mapCenter = ref([3.73, 51.05])

const navState = ref<'filter' | 'search'>('search')
const mapMode = ref<
  'mapbox://styles/mapbox/light-v11' | 'mapbox://styles/mapbox/dark-v11'
>('mapbox://styles/mapbox/light-v11')

const titleExpand = ref<'Vergroot Map' | 'Verklein Map'>('Vergroot Map')
const titleMode = computed(() =>
  mapMode.value === 'mapbox://styles/mapbox/dark-v11'
    ? 'Light Mode'
    : 'Dark Mode',
)

const handleMapMode = () => {
  mapMode.value =
    mapMode.value === 'mapbox://styles/mapbox/dark-v11'
      ? 'mapbox://styles/mapbox/light-v11'
      : 'mapbox://styles/mapbox/dark-v11'
}

const handleExpand = () => {
  titleExpand.value =
    titleExpand.value === 'Vergroot Map' ? 'Verklein Map' : 'Vergroot Map'
}

const makeImgMarker = (
  img: string | null | undefined,
  color: string | null | undefined,
  name: string | null | undefined,
) => {
  const el: HTMLImageElement = document.createElement('img')
  el.src = img
    ? img
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

  el.style.width = '2rem'
  el.style.borderRadius = '50rem'
  el.style.aspectRatio = '1'
  el.style.objectFit = 'cover'
  el.style.border = '0.15rem solid var(--light-blue)'
  el.style.backgroundColor = color ?? 'var(--white)'
  el.alt = (name ?? 'Anonymous') + ' profile picture'

  return el
}

onMounted(() => getUsers({}))

const { users } = storeToRefs(useUserStore())
const { getUsers } = useUserStore()
const { user } = storeToRefs(useAuthStore())
const getRandomOffset = () => {
  const offset = 0.001
  return (Math.random() - 0.5) * offset
}

const filteredUsers = computed(() => {
  const userPositions = new Map()

  return users.value
    .filter(
      u =>
        u.firstname &&
        u.lastname &&
        u.company &&
        u.company.longitude &&
        u.company.latitude &&
        u.id !== user.value?.id,
    )
    .map(u => {
      const key = `${u.company?.longitude},${u.company?.latitude}`
      if (userPositions.has(key)) {
        const { longitude, latitude } = userPositions.get(key)
        if (u.company) {
          const offset = getRandomOffset()
          u.company.longitude = longitude + offset
          u.company.latitude = latitude + offset
        }
      } else {
        userPositions.set(key, {
          longitude: u.company?.longitude ?? 0,
          latitude: u.company?.latitude ?? 0,
        })
      }
      return u
    })
})

const { makeChat } = useChatStore()
const toast = useToast()

const addChat = async (user: User) => {
  if (!user || !user.id) return
  try {
    const res = await makeChat(user.id)
    console.log(res)
    toast.success('Chat aangemaakt met ' + user.firstname + '!')
  } catch (e) {
    const error = e as Error
    toast.error(error.message)
  }
}
</script>

<template>
  <main>
    <div class="map">
      <!-- No style is preferred -->
      <MapboxMap
        ref="mapRef"
        :access-token="mapboxApiKey"
        :map-style="mapMode"
        style="height: 80vh"
        :center="mapCenter"
        :zoom="7"
        :attribution-control="false"
      >
        <MapboxMarker
          v-for="u in filteredUsers"
          :key="u.id"
          :lng-lat="[u.company?.longitude, u.company?.latitude]"
          :element="
            makeImgMarker(
              u.profilePicture,
              u.color,
              u.firstname + ' ' + u.lastname,
            )
          "
          style="width: 2rem"
        >
          <template #popup>
            <h3>
              {{ u.firstname && u.lastname ? u.firstname + ',' : 'Anonymous' }}
              <span v-if="u.age">{{ u.age }}</span>
            </h3>

            <p v-shorten-text>{{ u.bio }}</p>
            <div class="popup-actions">
              <RouterLink :to="'/user/' + u.id"
                >View<i class="fa-solid fa-eye"></i
              ></RouterLink>
              <button @click="addChat(u)" title="Maak chat aan">
                <i class="fa-solid fa-comments"></i>
              </button>
            </div>
          </template>
        </MapboxMarker>
      </MapboxMap>
      <div class="actions">
        <button
          type="button"
          :title="titleMode"
          :class="{ dark: mapMode === 'mapbox://styles/mapbox/dark-v11' }"
          @click="handleMapMode"
        >
          <i
            class="fa-solid"
            :class="{
              'fa-moon': mapMode === 'mapbox://styles/mapbox/light-v11',
              'fa-lightbulb': mapMode === 'mapbox://styles/mapbox/dark-v11',
            }"
          ></i></button
        ><button
          type="button"
          :title="titleExpand"
          :class="{ dark: mapMode === 'mapbox://styles/mapbox/dark-v11' }"
          @click="handleExpand"
        >
          <i
            class="fa-solid"
            :class="{
              'fa-expand': titleExpand === 'Vergroot Map',
              'fa-compress': titleExpand === 'Verklein Map',
            }"
          ></i>
        </button>
      </div>
    </div>

    <div class="filters" :class="{ hidden: titleExpand === 'Verklein Map' }">
      <MapHeader v-model="navState" />
      <MapFilters v-show="navState === 'filter'" />
      <MapSearch v-show="navState === 'search'" />
    </div>
  </main>
</template>

<style scoped lang="scss">
@keyframes scale {
  to {
    width: 100%;
    height: 40vw;
  }
}

@keyframes scaleDown {
  to {
    width: 100%;
    height: 100%;
  }
}

.mapboxgl-popup-content::v-deep {
  background-color: var(--light-blue) !important;
  border: 2px solid var(--dark-blue) !important;
  border-radius: 0.5rem !important;
}

main {
  margin-top: 3rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 0rem;

  .map {
    height: 100%;
    width: 100%;
    border: 0.4rem solid var(--light-blue);

    // aspect-ratio: 1/1;
    border-radius: 0.5rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    overflow: hidden;
    position: relative;
    animation: scaleDown 0.5s ease forwards;

    .mapboxgl-map {
      height: 100%;
      max-height: max-content;
      position: relative;

      .mapboxgl-popup-content {
        outline: 0.1rem solid var(--black);
        outline-offset: 1rem;
      }
    }

    &:has(+ .filters.hidden) {
      animation: scale 0.5s ease forwards;
    }
  }

  .filters {
    background-color: var(--light-blue);
    padding: 2rem;
    padding-left: 1.5rem;
    border-radius: 0.5rem;
    padding-top: 1.5rem;
    padding-bottom: 0.2rem;

    width: 100%;
    position: relative;
    border-radius: 0 0.5rem 0.5rem 0;
    border-radius: 0.5rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &::before {
      content: '';
      position: absolute;
      display: none;
      width: 100%;
      height: 100%;
      background-color: var(--light-blue);
      z-index: -1;
      right: 100%;
      top: 0;
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    &.hidden {
      display: none;
    }
  }

  .actions {
    position: absolute;
    z-index: 999;
    bottom: 0;
    right: 0;
    margin: 0.5rem;
    display: flex;
    gap: 0.2rem;

    button {
      aspect-ratio: 1;
      border: none;
      border: 0.2rem solid var(--dark-blue);
      background-color: var(--dark-blue-25);
      color: var(--white);
      border-radius: 0.3rem;
      width: 1.9rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: grid;
      place-items: center;

      &:hover {
        background-color: var(--dark-blue);
      }

      &.dark {
        background-color: var(--yellow-25);
        border: 0.2rem solid var(--yellow);

        &:hover {
          background-color: var(--yellow);
        }
      }
    }
  }
}

@media screen and (width > 55rem) {
  main {
    flex-direction: row;
    gap: 1rem;

    .filters {
      border-radius: 0 0.5rem 0.5rem 0;
      padding-left: 0.5rem;
      width: min(100%, 40rem);
      &::before {
        display: block;
      }
    }
  }
}
</style>
