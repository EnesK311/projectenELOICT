<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  min: number
  max: number
  steps: number
  unit?: string
  id?: string
}>()

const minValue = ref<number>(props.min)
const maxValue = ref<number>(props.max)

const displayMinValue = computed<string>({
  get: () => `${minValue.value}${props.unit ? props.unit : ''}`,
  set: value => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < props.min) {
      minValue.value = props.min
    } else if (numValue > maxValue.value - props.steps) {
      minValue.value = maxValue.value - props.steps
    } else {
      minValue.value = numValue
    }
  },
})

const displayMaxValue = computed<string>({
  get: () => `${maxValue.value}${props.unit ? props.unit : ''}`,
  set: value => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue > props.max) {
      maxValue.value = props.max
    } else if (numValue < minValue.value + props.steps) {
      maxValue.value = minValue.value + props.steps
    } else {
      maxValue.value = numValue
    }
  },
})

watch(minValue, newMinValue => {
  if (newMinValue > maxValue.value - props.steps)
    minValue.value = maxValue.value - props.steps
})

watch(maxValue, newMaxValue => {
  if (newMaxValue < minValue.value + props.steps)
    maxValue.value = minValue.value + props.steps
})

const rangeStyle = computed(() => ({
  left: `${((minValue.value - props.min) / (props.max - props.min)) * 100}%`,
  width: `${((maxValue.value - minValue.value) / (props.max - props.min)) * 100}%`,
}))

const minThumbPosition = computed(
  () => ((minValue.value - props.min) / (props.max - props.min)) * 100,
)
const maxThumbPosition = computed(
  () => ((maxValue.value - props.min) / (props.max - props.min)) * 100,
)

const handleRangeClick = (event: MouseEvent) => {
  const rangeElement = event.currentTarget as HTMLElement
  const clickPosition = getClickPosition(event, rangeElement)
  const clickValue = calculateClickValue(clickPosition)

  updateRangeValues(clickValue)
}

const getClickPosition = (event: MouseEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  return event.clientX - rect.left
}

const calculateClickValue = (clickPosition: number): number => {
  const rangeWidth = props.max - props.min
  const clickValue =
    Math.round(
      ((clickPosition / rangeWidth) * (props.max - props.min) + props.min) /
        props.steps,
    ) * props.steps

  return Math.max(props.min, Math.min(clickValue, props.max))
}

const updateRangeValues = (clickValue: number) => {
  const minDistance = Math.abs(clickValue - minValue.value)
  const maxDistance = Math.abs(clickValue - maxValue.value)

  if (shouldUpdateMinValue(clickValue, minDistance, maxDistance)) {
    minValue.value = clickValue
  } else if (shouldUpdateMaxValue(clickValue)) {
    maxValue.value = clickValue
  }
}

const shouldUpdateMinValue = (
  clickValue: number,
  minDistance: number,
  maxDistance: number,
) => minDistance < maxDistance && clickValue <= maxValue.value - props.steps

const shouldUpdateMaxValue = (clickValue: number) =>
  clickValue >= minValue.value + props.steps

const emit = defineEmits(['update:modelValue'])

const range = computed<{ min: number; max: number }>(() => {
  return { min: minValue.value, max: maxValue.value }
})

watch(range, newValue => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <div class="double-range">
    <div class="slider" @click="handleRangeClick">
      <input
        :id="id + '-min'"
        v-model="minValue"
        type="range"
        :min="min"
        :max="max"
        :step="steps"
        :name="id + '-min'"
      />
      <input
        :id="id + '-max'"
        v-model="maxValue"
        type="range"
        :min="min"
        :max="max"
        :step="steps"
        :name="id + '-max'"
      />

      <div class="range-track" :style="rangeStyle"></div>
      <div
        class="custom-thumb min-thumb"
        :style="{ left: minThumbPosition + '%' }"
      ></div>
      <div
        class="custom-thumb max-thumb"
        :style="{ left: maxThumbPosition - 3 + '%' }"
      ></div>
    </div>
    <div class="inputs">
      <input
        :id="id + '-min'"
        v-model="displayMinValue"
        type="text"
        :name="id + '-min'"
      />
      <input
        :id="id + '-max'"
        v-model="displayMaxValue"
        type="text"
        :name="id + '-max'"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.double-range {
  position: relative;
  background-color: transparent;
  width: min(100%, 30rem);

  .slider {
    position: relative;
    display: flex;
    height: 1rem;
    z-index: 5;

    input[type='range'] {
      position: absolute;
      width: 100%;
      height: 0.7rem;
      pointer-events: none;
      -webkit-appearance: none;
      appearance: none;
      background-color: var(--white);
      border-radius: 5rem;

      &::-webkit-slider-thumb {
        pointer-events: all;
        position: relative;
        z-index: 999 !important;
        appearance: none;
        background-color: var(--green);
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        opacity: 0;
      }

      &::-moz-range-thumb {
        display: none;
        opacity: 0;
        pointer-events: all;
        position: relative;
        background-color: var(--green);
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        z-index: 999 !important;
      }
    }
  }

  .custom-thumb {
    aspect-ratio: 1;
    border-radius: 50%;
    z-index: 999 !important;
    background-color: var(--green);
    position: absolute;
    top: -15%;
    width: 1rem;
    cursor: pointer;
    pointer-events: none;
  }

  .range-track {
    position: absolute;
    height: 0.7rem;
    background-color: var(--green);
    border-radius: 5rem;
    z-index: 1;
  }

  .inputs {
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;

    input[type='text'] {
      width: min(100%, 5rem);
      font-size: 1rem;
      padding: 0.2rem 0.5rem;
      font-weight: 800;
      border: none;
      border-radius: 0.3rem;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      &::-moz-inner-spin-button,
      &::-moz-outer-spin-button {
        appearance: none;
      }
    }
  }
}
</style>
