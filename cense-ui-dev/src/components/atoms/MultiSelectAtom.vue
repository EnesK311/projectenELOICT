<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import '@/assets/multiselect.scss'

import type { Speciality } from '@/types/type'
import LabelAtom from './LabelAtom.vue'

const props = defineProps<{
  modelValue: Speciality[]
  id: string
  label: string
  error: string | null | undefined
  options: Speciality[]
}>()

const emit = defineEmits(['update:modelValue'])
const ariaExpanded = ref(false)

const updateValue = (value: Speciality[]) => {
  emit('update:modelValue', value)
}

const translateCategory = (category: number): string => {
  switch (category) {
    case 0:
      return 'Energie'
    case 1:
      return 'Juridisch'
    case 2:
      return 'Financieel & Beheer'
    default:
      return 'Onbekend'
  }
}

const groupedOptions = computed(() => {
  const grouped: Record<string, Speciality[]> = {}

  props.options.forEach(option => {
    const category = option.category.toString()
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(option)
  })

  return Object.keys(grouped).map(category => ({
    category: translateCategory(+category),
    options: grouped[category],
  }))
})
</script>

<template>
  <div id="wrapper">
    <LabelAtom :for-id="id" :label="label" :error="props.error" />
    <Multiselect
      v-if="options.length"
      id="multiselect"
      :model-value="modelValue"
      :options="groupedOptions"
      :multiple="true"
      :close-on-select="false"
      open-direction="bottom"
      :clear-on-select="false"
      placeholder="Druk hier om te selecteren"
      label="specialityType"
      track-by="specialityType"
      group-label="category"
      group-values="options"
      :group-select="true"
      @update:model-value="updateValue"
      :aria-expanded="ariaExpanded"
      @click="ariaExpanded = !ariaExpanded"
    />
  </div>
</template>

<style scoped>
#wrapper {
  margin-block: 0.5rem;
}

#multiselect {
  margin-block: 0.5rem;
}
</style>
