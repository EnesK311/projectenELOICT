<script setup lang="ts">
import { useHomepageTextStore } from '@/stores/homepage'
import PeerButton from '@/components/atoms/PeerButton.vue'
import { useTitle } from '@vueuse/core'
import { onMounted } from 'vue'
import PeerLoader from '@/components/atoms/PeerLoader.vue'
import { storeToRefs } from 'pinia'
import PeerLabel from '@/components/atoms/PeerLabel.vue'
import PeerH2 from '@/components/atoms/PeerH2.vue'

// Set the page title
const title = useTitle()
title.value = 'Home | Peer'

const homepageTextStore = useHomepageTextStore()
const { loading, homepageData } = storeToRefs(homepageTextStore) // Extract reactive refs using storeToRefs

//get loading state from store
// Fetch the homepage texts when the component is mounted
onMounted(() => {
  homepageTextStore.fetchHomepageTexts()
})
</script>

<template>
  <main class="home-page">
    <PeerLoader v-if="loading" />
    <div v-else>
      <div class="hero-section">
        <!-- Accessing heroTitle and heroSubtitle from homepageData -->
        <h1>{{ homepageData.heroTitle }}</h1>
        <p>{{ homepageData.heroSubtitle }}</p>
        <RouterLink to="/register">
          <PeerButton>Get Started</PeerButton>
        </RouterLink>
      </div>

      <div class="features-section">
        <h2>Why Choose Us?</h2>
        <div class="features">
          <!-- Accessing features from homepageData -->
          <div v-for="(feature, index) in homepageData.features" :key="index" class="feature">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home-page {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 2rem;
  button {
    max-width: 20rem;
  }
}

.hero-section {
  background: linear-gradient(120deg, #6e45e2, #88d3ce);
  color: white;
  padding: 4rem 2rem;
  margin-bottom: 2rem;
  border-radius: 8px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.features-section {
  padding: 2rem 2rem;
}

.features-section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.features {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature {
  background: var(--color-primary-cards);
  padding: 1.5rem;
  border-radius: 8px;
  width: 30%;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  color: var(--color-primary-green);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature p {
  color: var(--color-primary-green);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    width: 100%;
  }
}
</style>
