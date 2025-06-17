<script setup lang="ts">
import SgCheckbox from '../atoms/SgCheckbox.vue'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgKeybindOverlay from '../molecules/SgKeybindOverlay.vue'
import { ref, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

// settings store
const settingsStore = useSettingsStore()
const { keybinds, volume, darkMode } = storeToRefs(settingsStore)

// color mode
const isDark = useDark()
const toggleDark = useToggle(isDark)

const selectedKey = ref<string>('')

watch(isDark, () => {
  darkMode.value = isDark.value
})
</script>

<template>
  <SgKeybindOverlay v-if="selectedKey == 'left'" v-model:keybind="keybinds.left" v-model:selectedkey="selectedKey"></SgKeybindOverlay>
  <SgKeybindOverlay v-if="selectedKey == 'right'" v-model:keybind="keybinds.right" v-model:selectedkey="selectedKey"></SgKeybindOverlay>
  <SgKeybindOverlay v-if="selectedKey == 'up'" v-model:keybind="keybinds.up" v-model:selectedkey="selectedKey"></SgKeybindOverlay>
  <SgKeybindOverlay v-if="selectedKey == 'down'" v-model:keybind="keybinds.down" v-model:selectedkey="selectedKey"></SgKeybindOverlay>

  <div class="settings dark">
    <div class="title-div">
      <h2>Settings</h2>
    </div>
        <div class="sound-div horz-div">
          <h3>Sound</h3>
          <div>
            <SgSoundRange v-model:modelValue="volume"></SgSoundRange>
          </div>
        </div>

        <div class="mode-div horz-div">
          <h3>Dark mode</h3>
          <SgCheckbox @update:modelValue="toggleDark()" v-model:modelValue="darkMode"></SgCheckbox>
        </div>

        <div class="controls-div">
          <h3>Controls</h3>
          <ul class="controls">
            <li>
              <p>Move left</p>
              <button class="keybind" @click="() => selectedKey = 'left'">
                <span>{{ keybinds.left }}</span>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </li>
            <li>
              <p>Move right</p>
              <button class="keybind" @click="() => selectedKey = 'right'">
                <span>{{ keybinds.right }}</span>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </li>
            <li>
              <p>Move up</p>
              <button class="keybind" @click="() => selectedKey = 'up'">
                <span>{{ keybinds.up }}</span>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </li>
            <li>
              <p>Move down</p>
              <button class="keybind" @click="() => selectedKey = 'down'">
                <span>{{ keybinds.down }}</span>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </li>
          </ul>
        </div>
  </div>
</template>

<style scoped lang="scss">
.settings {
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);
  margin: 2rem;
  padding: 1.5rem;
  border-radius: 10px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-flow: column;
  gap: 1rem;

  .title-div {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;

    button {
      width: max-content;
    }
  }

  .horz-div {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
  }

  .controls {
    display: flex;
    flex-flow: column;
    gap: 1rem;
    list-style-type: none;

    > li {
      display: flex;
      flex-flow: column;
      gap: 0.5rem;

      p {
        font-size: 1.15em;
        flex: 2;
      }

      .keybind {
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        background-color: var(--dark-gray);
        color: var(--default-text-dark);
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        flex: 1;

        &:hover {
          cursor: pointer;
          color: var(--btn-color);
          background-color: var(--accent);
        }

        span {
          width: 100%;
          font-size: 1.3em;
          align-self: flex-start;
        }

        i {
          font-size: 1.4em;
        }
      }
    }
  }
}

/* BREAKPOINTS */
@media (width >= 65em) {
  .settings {
    width: 40%;

    .title-div {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;

      button {
        width: max-content;
      }
    }

    .horz-div {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
    }

    .controls {
      display: flex;
      flex-flow: column;
      gap: 1rem;
      list-style-type: none;

      > li {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;

        p {
          width: 100%;
        }
      }
    }
  }
}
</style>