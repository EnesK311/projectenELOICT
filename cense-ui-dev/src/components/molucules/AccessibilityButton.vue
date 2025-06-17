<script setup lang="ts">
import { ref } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility';

const accessibilityStore = useAccessibilityStore()
const menuOpen = ref(false)

const accessibilityOptions = ref([
    { label: 'Zet hoog contrast aan', icon: 'fa-eye', action: () => (accessibilityStore.setHighContrast(true)), show: () => !accessibilityStore.isHighContrast },
    { label: 'Zet hoog contrast uit', icon: 'fa-eye-slash', action: () => (accessibilityStore.setHighContrast(false)), show: () => accessibilityStore.isHighContrast },
    { label: 'Zet donkere modus aan', icon: 'fa-moon', action: () => (accessibilityStore.setDarkMode(true)), show: () => !accessibilityStore.isDarkMode },
    { label: 'Zet donkere modus uit', icon: 'fa-sun', action: () => (accessibilityStore.setDarkMode(false)), show: () => accessibilityStore.isDarkMode },
])

accessibilityStore.applyTheme()
</script>

<template>
    <div class="circle" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen" aria-label="Toegankelijkheidsmenu" aria-roledescription="accesibility-button">
        <i class="fa-solid fa-universal-access"></i>
    </div>
    <div class="menu" :class="{ active: menuOpen }">
        <div 
            class="menu-item" 
            v-for="option in accessibilityOptions" 
            :key="option.label" 
            v-show="option.show()" 
            @click="option.action"
        >
            <i :class="`fa-solid ${option.icon}`"></i>
            <p>{{ option.label }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.circle {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    padding: .5rem;
    background-color: var(--dark-blue);
    border-radius: 50%;
    z-index: 999;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
        background-color: var(--blue);
        transform: scale(1.1);
    }

    i {
        font-size: 2rem;
        color: var(--white);
    }
}

.menu {
    display: none;
    position: fixed;
    bottom: 3.2rem;
    right: 1.6rem;
    padding: .8rem;
    padding-bottom: 1rem;
    background-color: var(--dark-blue);
    border-radius: .5rem;
    z-index: 900;

    &.active {
        display: block;
    }

    .menu-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: .3rem;

        i {
            width: 2rem;
            text-align: center;
            font-size: 1.5rem;
            color: var(--white);
        }

        p {
            margin: 0;
            margin-left: .5rem;
            color: var(--white);
        }
    }
}
</style>