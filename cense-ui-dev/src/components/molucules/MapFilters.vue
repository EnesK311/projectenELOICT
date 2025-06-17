<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DoubleRange from '../atoms/DoubleRange.vue'
import DropDown from '../atoms/DropDownAtom.vue'
import FButton from '../atoms/FButton.vue'
import { useSpecialityStore } from '@/stores/speciality'
import { ref } from 'vue'
import type { GetFilters } from '@/types/type'
import { useUserStore } from '@/stores/user'
import { useLoading } from '@/composables/loading'

const { specialities } = storeToRefs(useSpecialityStore())
const { getUsers } = useUserStore()
const { isLoading, startLoading, stopLoading } = useLoading()

const handleSubmit = async () => {
  try {
    startLoading()

    const params = {
      distance: distanceRange.value.max,
      knowledge: knowledge.value,
      category: category.value,
      sort: sort.value,
    } as GetFilters
    await getUsers(params)
  } catch (error) {
    console.error(error)
  } finally {
    stopLoading()
  }
}

const distanceRange = ref({ min: 0, max: 100 })
const knowledge = ref<string[]>([])
const category = ref<string | null>(null)
const sort = ref<string | null>(null)
</script>

<template>
  <div>
    <form action="" @submit.prevent="handleSubmit">
      <div>
        <label for="distance-min">Afstand</label>
        <DoubleRange
          id="distance"
          v-model="distanceRange"
          :min="0"
          :max="250"
          :steps="5"
          unit="km"
        />
      </div>
      <DropDown
        v-model="knowledge"
        :values="specialities.map(s => s.specialityType)"
        legend="Moet ervaring hebben met"
      />

      <!-- <DropDown
        :values="[
          'Sustainable coordinators',
          'Senior Managers',
          'Junior Managers',
          'Energiemanager',
        ]"
        v-model="category"
        legend="Category"
      /> -->

      <!-- <div>
        <label for="sort">Sorteer op</label>
        <select name="sort" id="sort" v-model="sort">
          <option value="null" selected>Kies een optie</option>
          <option value="name">Naam</option>
        </select>
      </div> -->
      <div class="button">
        <FButton type="submit" :loading="isLoading" color="var(--white)"
          >Pas toe</FButton
        >
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
form {
  background-color: var(--light-blue);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  border-radius: 0.5rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    cursor: pointer;
  }
  .button :deep(button) {
    background-color: var(--green);
  }
}
</style>
