<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ values: string[]; legend: string }>()

const text = ref<string>('Show more...')
const showMore = ref<boolean>(false)

const showMoreOrLess = () => {
  text.value = showMore.value ? 'Show more...' : 'Show less...'
  showMore.value = showMore.value ? false : true
}

const emit = defineEmits(['update:modelValue'])
const selectedValues = ref<string[]>([])

const toggleValue = (value: string) => {
  if (selectedValues.value.includes(value)) {
    selectedValues.value = selectedValues.value.filter(v => v !== value)
  } else {
    selectedValues.value.push(value)
  }
  emit('update:modelValue', selectedValues.value)
}
</script>

<template>
  <fieldset :class="{ showMore }">
    <legend>{{ legend }}</legend>
    <div v-for="(value, idx) in values" :key="idx">
      <label :for="value">{{ value }}</label>
      <input
        :id="value"
        type="checkbox"
        :name="legend.toLowerCase().replace(/ /g, '_')"
        @change="toggleValue(value)"
      />
    </div>
    <button v-if="values.length > 3" type="button" @click="showMoreOrLess">
      {{ text }}
    </button>
  </fieldset>
</template>

<style scoped lang="scss">
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

fieldset {
  margin: 0;
  padding: 0;
  border: none;

  &.showMore div:nth-of-type(n + 4) {
    display: block;
  }

  div:nth-of-type(n + 4) {
    display: none;
  }

  legend {
    padding: 0;
    font-size: 100%;
    margin-bottom: 0.5rem;
  }

  div {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 0.5rem;

    label {
      cursor: pointer;
      font-weight: 600;
      position: relative;
      margin-left: 1.5rem;
      user-select: none;

      &::before {
        content: '';
        position: absolute;
        width: 1rem;
        aspect-ratio: 1;
        left: -1.5rem;
        top: 0.2rem;
        border: 0.15rem solid var(--blue);
        border-radius: 0.2rem;
      }

      &::after {
        content: '\2713';
        position: absolute;
        width: 1rem;
        aspect-ratio: 1;
        left: -1.4rem;
        top: -0.1rem;
        color: var(--white);
        display: none;
        scale: 0.8;
      }

      &:has(+ input:checked) {
        &::after {
          display: block;
        }
        &::before {
          background-color: var(--blue);
        }
      }

      &:has(+ input:focus-visible)::before {
        outline: 0.1rem solid var(--red);
        outline-offset: 0.1rem;
      }
    }

    input {
      @include visually-hidden();
    }
  }

  button {
    background-color: transparent;
    padding: 0;
    border: none;
    text-decoration: underline;
    color: var(--red);
    cursor: pointer;
  }
}
</style>
