<script setup lang="ts">
import type { ValidationErrors } from '@/types/type'

defineProps<{
  success: boolean
  errors: ValidationErrors
  apiErrors?: string[]
  message?: string
}>()
</script>

<template>
  <div
    v-if="
      !success &&
      (Object.keys(errors).length > 0 || (apiErrors && apiErrors.length > 0))
    "
    class="error-summary"
  >
    <h3>Er waren enkele fouten...</h3>
    <ul tabindex="-1">
      <li v-for="(error, key) in errors" :key="key">
        <a :href="'#' + key" role="alert">{{ error }}</a>
      </li>
      <li v-for="(error, index) in apiErrors" :key="'api-' + index">
        <a role="alert">{{ error }}</a>
      </li>
    </ul>
  </div>
  <div
    v-if="
      success &&
      Object.keys(errors).length === 0 &&
      (!apiErrors || apiErrors.length === 0) &&
      message
    "
    class="success"
  >
    <h3 v-if="message">{{ message }}</h3>
  </div>
</template>

<style scoped lang="scss">
.error-summary,
.success {
  padding: 1em;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background-color: var(--red);
  color: var(--white);
  font-size: 0.8rem;
  font-weight: 600;

  h3 {
    margin: 0;
    color: var(--white);

    font-weight: 600;
  }

  & > ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding-inline: 0.5rem;
    list-style: none;
    gap: 0.5em;

    a {
      display: flex;
      align-items: center;
      color: var(--black);
      text-decoration: none;
    }
  }
}

.success {
  background-color: var(--green);
  color: var(--black);
  font-weight: 800;

  & > p {
    margin: 0;
  }
}

#register .form-group.password button {
  bottom: 12.5%;
}

@media screen and (width > 50rem) {
  .form-group:has(div) {
    flex-direction: row;
    gap: 0.2rem;
  }
}

.error-summary {
  h3 {
    color: var(--white);
    margin: 0;
    font-weight: 400;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    list-style: circle;
  }

  li {
    font-family: var(--font-sec);
    margin: 0;

    a {
      color: var(--white);
    }
  }
}
</style>
