<script setup lang="ts">
import { onMounted } from 'vue'
import { useHomepageTextStore } from '@/stores/homepage'
import PeerLoader from '../atoms/PeerLoader.vue'
import { storeToRefs } from 'pinia'

// Access the homepage text store and its properties
const homepageTextStore = useHomepageTextStore()
const { loading, homepageData } = storeToRefs(homepageTextStore)

// Check if data is already loaded before fetching
onMounted(async () => {
  if (!homepageTextStore.dataLoaded) {
    await homepageTextStore.fetchHomepageTexts()
  }
})

// Update functions to save changes back to the store and backend
const updateHeroTitle = async () => {
  const textId = homepageTextStore.homepageTexts[0]?.id
  if (textId) {
    await homepageTextStore.updateText(textId, homepageData.value.heroTitle)
  }
}

const updateHeroSubtitle = async () => {
  const textId = homepageTextStore.homepageTexts[1]?.id
  if (textId) {
    await homepageTextStore.updateText(textId, homepageData.value.heroSubtitle)
  }
}

const updateFeature = async (index: number, field: 'title' | 'description') => {
  const textId = homepageTextStore.homepageTexts[index * 2 + (field === 'title' ? 2 : 3)]?.id
  if (textId) {
    await homepageTextStore.updateText(textId, homepageData.value.features[index][field])
  }
}
</script>

<template>
  <div class="admin-page">
    <PeerLoader v-if="loading" />
    <div v-else>
      <h2>Edit Homepage Text</h2>

      <div class="form-group">
        <label for="hero-title">Hero Title</label>
        <input
          id="hero-title"
          v-model="homepageData.heroTitle"
          @blur="updateHeroTitle"
          type="text"
        />
      </div>

      <div class="form-group">
        <label for="hero-subtitle">Hero Subtitle</label>
        <input
          id="hero-subtitle"
          v-model="homepageData.heroSubtitle"
          @blur="updateHeroSubtitle"
          type="text"
        />
      </div>

      <div v-for="(feature, index) in homepageData.features" :key="index" class="form-group">
        <label :for="`feature-title-${index}`">Feature {{ index + 1 }} Title</label>
        <input
          :id="`feature-title-${index}`"
          v-model="feature.title"
          @blur="updateFeature(index, 'title')"
          type="text"
        />

        <label :for="`feature-description-${index}`">Feature {{ index + 1 }} Description</label>
        <input
          :id="`feature-description-${index}`"
          v-model="feature.description"
          @blur="updateFeature(index, 'description')"
          type="text"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 2rem;
  margin: auto;
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type='text'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
