<script setup lang="ts">
import SgSkin from "../molecules/SgSkin.vue"
import { useSkinsStore } from "@/stores/skins";
import type { Skin } from "@/types";
import { storeToRefs } from 'pinia'

// skins store
const skinStore = useSkinsStore()
const { skins, selectedSkin } = storeToRefs(skinStore)

const handleClick = (skin: Skin) => {
    selectedSkin.value = skin
}

const isSelected = (skin: Skin) => {
    if (selectedSkin.value === skin) {
        return true
    }
    return false
}
</script>

<template>
    <section class="skin-section">
        <h2>Skins</h2>
        <div class="skin-list">
            <SgSkin @click="handleClick(skin)" :class="{ selected: isSelected(skin)}" :skin="skin" v-for="skin in skins" :key="skin.id"></SgSkin>
        </div>
    </section>
</template>

<style scoped lang="scss">
.skin-section {
    width: 80%;
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    margin: 1rem auto;
    padding: 1rem;
    border-radius: 10px;

    h2 {
        text-align: center;
    }

    .skin-list {
        display: flex;
        flex-flow: column;
        gap: 2rem;
        margin-top: 1rem;
        justify-content: center;
        align-items: center;
        
        .skin {
            width: 80%;
        }
    }
}


/* BREAKPOINTS */
@media (width >= 50em) {
    .skin-section {
        width: 60%;
        .skin-list {
            flex-flow: row wrap;
            max-width: 100%;

            .skin {
                width: calc(fit-content + 1rem);
                max-width: 25%;
            }
        }
    }
}
</style>