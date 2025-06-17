<script setup lang="ts">
import { usePlayStore } from '@/stores/play';
import { useSkinsStore } from '@/stores/skins'
import { storeToRefs } from 'pinia'
import { defineProps } from 'vue'

defineProps<{
  gameOver: boolean
  countdown: boolean
  gameGrid: string[][]
}>()

const skinStore = useSkinsStore()
const { selectedSkin } = storeToRefs(skinStore)

const playStore = usePlayStore()

const handleKeyDown = (event: KeyboardEvent) => {
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === ' '
  ) {
    event.preventDefault()
  }
}

// mobile buttons
const mobileRight = () => {
  playStore.moveSnakeRight()
}

const mobileLeft = () => {
  playStore.moveSnakeLeft()
}

const mobileUp = () => {
  playStore.moveSnakeUp()
}

const mobileDown = () => {
  playStore.moveSnakeDown()
}
</script>

<template>
  <div class="grid" tabindex="0" @keydown.prevent="handleKeyDown">
    <div v-for="(row, rowIndex) in gameGrid" :key="rowIndex" class="row">
      <div
        v-for="(cell, colIndex) in row"
        ref="cells"
        :key="colIndex"
        :class="['cell', cell, { snake: cell === 'snake', 'snake-head': cell === 'snake-head' }]"
        :style="[
          cell === 'snake'
            ? {
                backgroundImage: `url(${selectedSkin.imgBody})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }
            : null,
          cell === 'snake-head'
            ? {
                backgroundImage: `url(${selectedSkin.imgHead})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }
            : null
        ]"
      ></div>
    </div>

    <div class="mobile-btns" v-show="!gameOver && !countdown">
      <button class="up" @click="mobileDown"><i class="fa-solid fa-up-long"></i></button>
      <div>
        <button class="left" @click="mobileLeft"><i class="fa-solid fa-left-long"></i></button>
        <button class="down" @click="mobileUp"><i class="fa-solid fa-down-long"></i></button>
        <button class="right" @click="mobileRight"><i class="fa-solid fa-right-long"></i></button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#app {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.row {
  display: flex;
}

.cell {
  border: 1px solid #ccc;
}

.powerUp {
  background-color: aqua;
}

.grid {
  background-image: url('/src/assets/img/playBg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  border: 10px solid green;
  width: 100%;
  max-width: max-content;
}

.enemy-head {
  background-image: url('/src/assets/img/skinEnemy_head.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.enemy {
  background-image: url('/src/assets/img/skinEnemy_body.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.ghostedSnakeHead {
  background-color: rgba(131, 195, 131, 0.649);
}

.ghostedSnake {
  background-color: rgba(131, 195, 131, 0.649);
}

.ghostedEnemy {
  background-color: rgba(131, 195, 131, 0.649);
}

.invisibleEnemy{
  background-color: rgba(0, 0, 255, 0);
}

.food {
  background-image: url('../../assets/img/apple.png');
  background-size: cover;
}

.obstacles {
  background-image: url('../../assets/img/obstacle.jpg');
  background-size: cover;
}

.magnet {
  background-image: url('../../assets/img/magnet.png');
  background-size: cover;
}

.swiftness {
  background-image: url('../../assets/img/swiftness.png');
  background-size: cover;
}

.ghost {
  background-image: url('../../assets/img/ghost.png');
  background-size: cover;
}

.invisibility {
  background-image: url('../../assets/img/invisibility.png');
  background-size: cover;
}

p {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: red;
}
.row {
  display: flex;
}

.cell {
  width: 1rem; /* Adjust based on desired cell size */
  height: 1rem; /* Adjust based on desired cell size */
  border: 1px solid #ffffff3b;
}

.mobile-btns {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  width: max-content;

  > div {
    display: flex;
    flex-flow: row;
    gap: 0.5rem;
  }

  button {
    width: fit-content;
    background-color: rgba(0, 0, 0, 0.568);
    color: white;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border: none;

    &:hover {
      cursor: pointer;
    }
  }
}

@media (min-width: 45em) {
  .cell {
    width: 30px; /* Adjust based on desired cell size */
    height: 30px; /* Adjust based on desired cell size */
    border: 1px solid #ffffff3b;
  }

  .mobile-btns {
    display: none;
  }
}
</style>
