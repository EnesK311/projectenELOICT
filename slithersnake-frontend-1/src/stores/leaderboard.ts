import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse, Player } from '@/types/'
import { getLeaderboard } from '@/services/dataService'

export const useLeaderboardStore = defineStore('leaderboard', () => {
    const leaderboard = ref<Player[]>([])

    const loadLeaderboard = (sort: string) => {
        leaderboard.value = []

        getLeaderboard<ApiResponse>(sort).then((response) => {
          const loadedPlayers: Player[] = response.data.data.map((record: any) => {
            return {
                id: record.id,
                username: record.username,
                email: record.email,
                level: record.level,
                highscore: record.highscore,
                games_played: record.games_played,
                games_won: record.games_won,
                players_killed: record.players_killed,
                skins: record.skins,
                role: record.role
            }
          })
          leaderboard.value?.push(...loadedPlayers)
        })
        .catch((error) => console.error(error))
      }

    return { leaderboard, loadLeaderboard }
})