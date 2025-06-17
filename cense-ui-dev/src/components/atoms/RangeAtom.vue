<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import LabelAtom from './LabelAtom.vue'

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, default: '' },
  modelValue: { type: String, default: '0' },
  error: { type: [String, null], default: '' },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  newValue => {
    internalValue.value = newValue
  },
)

watch(
  () => props.modelValue,
  newValue => {
    internalValue.value = newValue
  },
)

const updateValue = () => {
  emit('update:modelValue', internalValue.value)
}
</script>

<template>
  <div class="slider-container">
    <LabelAtom :label="label" :error="error" :for-id="'range-input'" />
    <div class="slider-wrapper">
      <input
        v-model="internalValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="slider"
        @input="updateValue"
        name="range-input"
      />
      <span class="slider-value">{{ internalValue }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-wrapper {
  display: flex;
  align-items: center;
}

input[type='range'] {
  font-size: 1.5rem;
  width: 12.5em;
  border-radius: 5rem;
  overflow: hidden;
}

input[type='range'] {
  color: #ef233c;
  --thumb-height: 0.7em;
  --track-height: 0.3em;
  --track-color: var(--white);
  --brightness-hover: 180%;
  --brightness-down: 80%;
  --clip-edges: 0.125em;
}

input[type='range'].win10-thumb {
  color: #2b2d42;
  --thumb-height: 1em;
  --thumb-width: 0.25em;
  --clip-edges: 0.0125em;
}

input[type='range'] {
  color: var(--green);
  --track-color: var(--white);
}

input[type='range'].win10-thumb {
  color: #3a86ff;
}

/* === range commons === */
input[type='range'] {
  width: 100%;
  position: relative;
  background: #fff0;
  overflow: hidden;
}

input[type='range']:active {
  cursor: grabbing;
}

input[type='range']:disabled {
  filter: grayscale(1);
  opacity: 0.3;
  cursor: not-allowed;
}

/* === WebKit specific styles === */
input[type='range'],
input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  transition: all ease 100ms;
  height: var(--thumb-height);
}

input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
  position: relative;
}

input[type='range']::-webkit-slider-thumb {
  --thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
  --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
  --clip-bottom: calc(var(--thumb-height) - var(--clip-top));
  --clip-further: calc(100% + 1px);
  --box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0
    100vmax currentColor;

  width: var(--thumb-width, var(--thumb-height));
  background: linear-gradient(currentColor 0 0) scroll no-repeat left center /
    50% calc(var(--track-height) + 1px);
  background-color: currentColor;
  box-shadow: var(--box-fill);
  border-radius: var(--thumb-width, var(--thumb-height));

  filter: brightness(100%);
  clip-path: polygon(
    100% -1px,
    var(--clip-edges) -1px,
    0 var(--clip-top),
    -100vmax var(--clip-top),
    -100vmax var(--clip-bottom),
    0 var(--clip-bottom),
    var(--clip-edges) 100%,
    var(--clip-further) var(--clip-further)
  );
}

input[type='range']:hover::-webkit-slider-thumb {
  cursor: grab;
}

input[type='range']:active::-webkit-slider-thumb {
  cursor: grabbing;
}

input[type='range']::-webkit-slider-runnable-track {
  background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center /
    100% calc(var(--track-height) + 1px);
}

input[type='range']:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

/* === Firefox specific styles === */
input[type='range'],
input[type='range']::-moz-range-track,
input[type='range']::-moz-range-thumb {
  appearance: none;
  transition: all ease 100ms;
  height: var(--thumb-height);
}

input[type='range']::-moz-range-track,
input[type='range']::-moz-range-thumb,
input[type='range']::-moz-range-progress {
  background: #fff0;
}

input[type='range']::-moz-range-thumb {
  background: currentColor;
  border: 0;
  width: var(--thumb-width, var(--thumb-height));
  border-radius: var(--thumb-width, var(--thumb-height));
  cursor: grab;
}

input[type='range']:active::-moz-range-thumb {
  cursor: grabbing;
}

input[type='range']::-moz-range-track {
  width: 100%;
  background: var(--track-color);
}

input[type='range']::-moz-range-progress {
  appearance: none;
  background: currentColor;
  transition-delay: 30ms;
}

input[type='range']::-moz-range-track,
input[type='range']::-moz-range-progress {
  height: calc(var(--track-height) + 1px);
  border-radius: var(--track-height);
}

input[type='range']::-moz-range-thumb,
input[type='range']::-moz-range-progress {
  filter: brightness(100%);
}

input[type='range']:hover::-moz-range-thumb,
input[type='range']:hover::-moz-range-progress {
  filter: brightness(var(--brightness-hover));
}

input[type='range']:active::-moz-range-thumb,
input[type='range']:active::-moz-range-progress {
  filter: brightness(var(--brightness-down));
}

input[type='range']:disabled::-moz-range-thumb {
  cursor: not-allowed;
}

.slider-value {
  min-width: 40px;
  text-align: center;
  background-color: var(--white);
  border-radius: 5px;
  margin-left: 0.2rem;
}
</style>
