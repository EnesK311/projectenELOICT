<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScoreStore } from '@/stores/scores'
import { useAssesmentStore } from '@/stores/assessment'
import PeerButton from '@/components/atoms/PeerButton.vue'
import type { Assessment, Score } from '@/types'
import PeerGroupScore from '@/components/molecules/PeerGroupScore.vue'
import PeerFormTitle from '../atoms/PeerFormTitle.vue'
import PeerAccordion from '@/components/molecules/PeerAccordion.vue'

const scoreStore = useScoreStore()
const assessmentStore = useAssesmentStore()

const props = defineProps<{
  assessment: Assessment
  id: number | null
}>()

const getCSV = async () => {
  await useAssesmentStore().getAssessmentFile(props.id)
}

const groupedScores = ref<{ [groupName: string]: Score[] }>({})

onMounted(async () => {
  const scores = await scoreStore.getScoresforTeachers({ assessment_id: props.assessment.id })

  // Group scores by group name
  groupedScores.value = scores.data.reduce(
    (groups: { [groupName: string]: Score[] }, score: Score) => {
      const groupName = score.group
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(score)
      return groups
    },
    {} as { [groupName: string]: Score[] }
  )
})
</script>

<template>
  <div>
    <p>See all results:</p>
    <div>
      <p v-if="assessment.is_result_visible === 0">
        Keep in mind results are not finished coming in
      </p>
      <p v-else-if="assessment.is_result_visible === 1">Results are visible</p>
    </div>

    <div v-for="(groupScores, groupName) in groupedScores" :key="groupName">
      <PeerAccordion :initiallyOpen="false">
        <template #header>
          <PeerFormTitle>{{ groupName }}</PeerFormTitle>
        </template>
        <template #content>
          <PeerGroupScore :scores="groupScores" />
        </template>
      </PeerAccordion>
    </div>

    <PeerButton @click="getCSV">Export all data to CSV File</PeerButton>
  </div>
</template>

<style scoped lang="scss"></style>
