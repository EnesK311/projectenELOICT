<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const title = useTitle()
title.value = 'Not Found | Odisee specialisatie test'
</script>

<template>
    <section class="not-found">
        <h1 tabindex=-1>Oooooh crap! Page not found.</h1>
        <p>Try again! Never give up, never back down</p>
    </section>
</template>

<style scoped lang="scss">
.not-found {
    margin-top: 2rem;
    text-align: center;

    img {
        width: 40%;
        min-width: 10em;
    }
}
</style>