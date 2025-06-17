<template>
  <div>
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

// Register chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Define props
const props = defineProps<{
  scores: Array<{ date: string; score: number }>
  category: string
}>()

// Prepare chart data
const chartData = computed(() => ({
  labels: props.scores.map((entry) => new Date(entry.date).toLocaleDateString()),
  datasets: [
    {
      label: props.category,
      data: props.scores.map((entry) => entry.score),
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      fill: true,
      tension: 0.4
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Score'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
