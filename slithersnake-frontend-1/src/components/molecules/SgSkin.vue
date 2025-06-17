<script setup lang="ts">
import type { Skin } from '@/types';

defineProps<{
    skin: Skin
}>()
</script>

<template>
    <div class="skin">
        <h3>{{ skin.name }}</h3>
        <div class="images">
            <img :src="skin.imgHead" :alt="skin.name" class="image">
            <img :src="skin.imgBody" :alt="skin.name" class="image">
            <img :src="skin.imgBody" :alt="skin.name" class="image">
            <img :src="skin.imgBody" :alt="skin.name" class="image">
        </div>
    </div>
</template>

<style scoped lang="scss">
.skin {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 2rem;
    background-color: var(--dark-gray);
    border-radius: 10px;
    gap: 1.5rem;

    .images {
        display: flex;

        img {
            width: 3rem;
            animation: moveUpDown 1.5s infinite alternate;
        }
    }

    &:not(.selected):hover {
        cursor: pointer;
        outline: 3px solid var(--accent);
    }
}

.selected {
    cursor: pointer;
    outline: 3px solid var(--selected);
}

@keyframes moveUpDown {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}
</style>