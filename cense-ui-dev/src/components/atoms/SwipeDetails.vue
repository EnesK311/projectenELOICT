<script setup lang="ts">
import type { User } from '@/types/type'
import KnownSpecialities from './KnownSpecialities.vue'

defineProps<{ user: User; showDetails: boolean }>()
</script>
<template>
  <div class="content" :class="{ showDetails: showDetails }">
    <h1>{{ user.firstname + ' ' + user.lastname }}</h1>
    <p class="company">
      Werkt bij <span>{{ user.company?.name }}</span
      >, {{ user.company?.city }}
    </p>
    <h2>Biografie</h2>
    <p class="bio">{{ user.bio }}</p>

    <h2>Specialiteiten</h2>
    <KnownSpecialities :specialities="user.specialities?.known" />
  </div>
</template>
<style scoped lang="scss">
:deep(.specialities.specialities) {
  cursor: inherit;
  flex-wrap: wrap;
  max-width: none;
  li {
    background-color: var(--dark-blue-25);
    border-color: var(--dark-blue-5);
    text-wrap: wrap;
    display: inline;
  }
}
.content {
  background-color: var(--light-blue);
  position: relative;
  padding: 1rem;
  padding-bottom: 2rem;
  display: none;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    top: -30vh;
    background-color: var(--light-blue);
    width: 100%;
    height: 30vh;
    z-index: -5;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
  }
  h1,
  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 1rem;
    margin-top: 1rem;
  }

  .company {
    font-weight: 400;
    font-size: 100%;
    color: var(--dark-blue);
    span {
      font-family: var(--source-sans-pro);
      font-weight: 800;
    }
  }
}

.showDetails {
  display: block;
}

@media screen and (width > 50rem) {
  .content {
    margin-top: 2rem;
    border-bottom-left-radius: 0;
    display: block;
    &::after {
      height: 100%;
      width: 15rem;
      left: -15rem;
      top: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: 1.5rem;
    }
  }
}
</style>
