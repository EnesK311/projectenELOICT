<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import LabelAtom from './LabelAtom.vue'

const props = defineProps<{
  label?: string
  error?: string | null
  year?: string | null
  month?: string | null
  required?: boolean
}>()

const emits = defineEmits(['update:year', 'update:month'])

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  const [pickedYear, pickedMonth] = input.value.split('-').map(Number)

  const safeYear = isNaN(pickedYear) ? null : pickedYear
  const safeMonth = isNaN(pickedMonth) ? null : pickedMonth

  emits('update:year', safeYear)
  emits('update:month', safeMonth)
}

const monthInput = ref<HTMLInputElement | null>(null)

function focusMonthInput() {
  if (monthInput.value) {
    monthInput.value.focus()
    if (typeof monthInput.value.showPicker === 'function') {
      monthInput.value.showPicker()
    }
  }
}
</script>

<template>
  <div class="year-month-atom">
    <LabelAtom
      :for-id="'year-month-input'"
      :label="props.label || ''"
      :error="props.error"
    />

    <div class="inputs" @click="focusMonthInput">
      <input
        ref="monthInput"
        id="year-month-input"
        type="date"
        :required="props.required"
        :value="
          props.year && props.month
            ? `${props.year}-${String(props.month).padStart(2, '0')}`
            : ''
        "
        class="input"
        @input="onInput"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.year-month-atom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .inputs {
    display: flex;
    cursor: pointer;

    .input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      font-size: 1rem;
      background-color: var(--label);

      user-select: none;
      cursor: pointer;
    }
  }

  .error {
    color: red;
  }
}
</style>
