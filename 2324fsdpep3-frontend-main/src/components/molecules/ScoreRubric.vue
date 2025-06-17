<script lang="ts" setup>
import type { Score } from '@/types'
import { computed, defineProps, ref } from 'vue'

const emit = defineEmits(['updateValidationState'])

// Define props to accept the rubric
const props = defineProps<{
  rubric: { id: number; user: string; score: number | null }[]
}>()

const STATE = ref<boolean>(false)

const scores = ref(props.rubric.map((item) => item.score ?? 0))

const totalScore = computed(() => scores.value.reduce((sum, score) => sum + score, 0))

function checkTotalScore() {
  if (totalScore.value > 100) {
    console.log('Total score cannot exceed 100. Please adjust the scores.')
  } else if (totalScore.value === 0) {
    console.log('You need to give a score')
  } else {
    STATE.value = true
  }
}

checkTotalScore()
</script>

<template>
  <div>
    <ul>
      <p>Only allowed to give out a total score of 100!</p>
      <li v-for="(item, index) in props.rubric" :key="item.id">
        <div>
          <p>{{ item.score }}</p>
          <p>User: {{ item.user }} - Score: {{ scores[index] }}</p>
          <input
            type="range"
            v-model.number="scores[index]"
            min="0"
            max="100"
            @input="
              () => {
                if (totalScore > 100) {
                  scores[index] = Math.max(0, scores[index] - (totalScore - 100))
                }
              }
            "
          />
        </div>
      </li>
    </ul>
    <p>Total Score: {{ totalScore }}</p>
    <p v-if="totalScore > 100" style="color: red">Total score exceeds the allowed limit of 100!</p>
  </div>
</template>

<style scoped lang="scss">
li {
  margin-bottom: 20px;
}

input[type='range'] {
  width: 100%;
}
</style>
