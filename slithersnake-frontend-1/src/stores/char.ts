import type { Character } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayStore } from './play'


export const useCharStore = defineStore('char', () => {
  const playStore = usePlayStore()

  const chars = ref<Character[]>([{
    id: 1,
    name: 'Speedy',
    attributes: { speed: 3.5, startLength: 2, lives: 1 },
    imgUrl: ""
  },{
    id: 2,
    name: 'SlowBoy',
    attributes: { speed: 2, startLength: 6, lives: 2 },
    imgUrl: ""
  }, {
    id: 3,
    name: 'LongNeck',
    attributes: { speed: 2.5, startLength: 4, lives: 1 },
    imgUrl: ""
  }])

  const selectedCharacter = ref<Character>({
    id: 1,
    name: 'Speedy',
    attributes: { speed: 3.5, startLength: 2, lives: 1 },
    imgUrl: ""
  })

  const router = useRouter()

  const joinGame = (c: Character) => {
    selectedCharacter.value = c
    console.log(selectedCharacter.value)
    router.push('/play')
  }

  return {chars, selectedCharacter, joinGame}
})
