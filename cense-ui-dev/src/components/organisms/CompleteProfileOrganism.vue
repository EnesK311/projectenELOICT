<script setup lang="ts">
import { ref } from 'vue'
import PersonalInformationForm from '@/components/organisms/PersonalInformationForm.vue'
import ProfessionalBackgroundForm from '@/components/organisms/ProfessionalBackgroundForm.vue'

const step = ref<number>(1)

const nextStep = () => {
  step.value = 2
}

const previousStep = () => {
  step.value = 1
}
</script>

<template>
  <main class="profile-container" aria-label="Profile Completion Form">
    <nav class="step-indicator" aria-label="Step Indicator">
      <div :class="['step', { active: step === 1 }]" aria-label="Step 1: ">
        <span
          :class="['step-number', { 'step-active': step === 1 }]"
          aria-hidden="true"
          >1</span
        >
        <span class="step-label">Persoonlijk Informatie</span>
      </div>
      <div
        :class="['step', { active: step === 2 }]"
        aria-label="Step 2: Professional Background"
      >
        <span
          :class="['step-number', { 'step-active': step === 2 }]"
          aria-hidden="true"
          >2</span
        >
        <span class="step-label">Professioneel Achtergrond</span>
      </div>
    </nav>

    <div class="form-container" aria-live="polite">
      <PersonalInformationForm v-if="step === 1" @next-step="nextStep" />
      <ProfessionalBackgroundForm
        v-else-if="step === 2"
        @previous-step="previousStep"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  min-height: 100vh;
  display: flex;
  gap: 0.5rem;
  margin-top: 2.5rem;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.step-indicator {
  align-self: flex-start;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-evenly;
  }
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
  padding: 0.3rem 1rem;
  padding-left: 0.5rem;
  border-radius: 5rem;

  &.active {
    background-color: var(--light-blue);
  }
}

.step-number {
  font-weight: 800;
  margin-right: 0.5rem;
  background-color: var(--light-blue);
  color: var(--black);
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  aspect-ratio: 1;
}

.step-active {
  background-color: var(--dark-blue);
  color: var(--white);
}

.step-label {
  font-weight: 600;
  color: var(--black);
  font-size: 110%;
  line-height: 1.2;
}

.form-container {
  width: min(100%, 50rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 100%;
}
</style>
