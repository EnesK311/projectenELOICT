<script setup lang="ts">
import { useLeaderboardStore } from '@/stores/leaderboard';
import { storeToRefs } from 'pinia';
import { ref, watch, watchEffect } from 'vue';
import SgButton from '../atoms/SgButton.vue';

const sort = ref<string>('')

// leaderboard store
const leaderboardStore = useLeaderboardStore()
leaderboardStore.loadLeaderboard(sort.value)
const { leaderboard } = storeToRefs(leaderboardStore)

const calcWinRate = (played: number, won: number) => {
    const gamesWon = won ?? 0;
  let gamesPlayed = played ?? 1;

  gamesPlayed = gamesPlayed === 0 ? 1 : gamesPlayed;
  
  return (gamesWon / gamesPlayed).toFixed(2);
}

watch(sort, () => {
    leaderboardStore.loadLeaderboard(sort.value)
})
</script>

<template>
    <section class="content">
        <div class="content-header">
            <h1>Global leaderboard</h1>
            <div class="sort-btns">
                <SgButton :class="{selected: sort === 'level'}" @click="sort = 'level'">Level</SgButton>
                <SgButton :class="{selected: sort === 'highscore'}" @click="sort = 'highscore'">Highscore</SgButton>
                <SgButton :class="{selected: sort === 'winrate'}" @click="sort = 'winrate'">Win rate</SgButton>
            </div> 
        </div>

        <div class="table-container">
            <table class="leaderboard">
                <thead>
                    <tr class="table-head">
                        <th>#</th>
                        <th>Username</th>
                        <th><span>Level</span><i class="fa-solid fa-chevron-up" v-show="sort === 'level'"></i></th>
                        <th><span>Highscore</span><i class="fa-solid fa-chevron-up" v-show="sort === 'highscore'"></i></th>
                        <th>Played games</th>
                        <th><span>Win rate</span><i class="fa-solid fa-chevron-up" v-show="sort === 'winrate'"></i></th>
                    </tr>
                </thead>
                <tbody class="table-body">
                    <tr v-for="(player, index) in leaderboard" :key="player.id">
                        <td>{{ index+1 }}</td>
                        <td>{{ player.username }}</td>
                        <td>{{ player.level }}</td>
                        <td>{{ player.highscore }}</td>
                        <td>{{ player.games_played }}</td>
                        <td>{{ calcWinRate(player.games_played, player.games_won) }}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped lang="scss">
.content {
    margin: 2rem auto;
    width: 80%;
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    padding: 1rem;
    border-radius: 10px;

    .content-header {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        gap: 1rem;

        .sort-btns {
            display: flex;
            flex-flow: row;
            gap: 1rem;

            .selected {
                background-color: var(--accent-dark);
            }

            button {
                flex: 1;
                width: 6rem;
                text-align: center;
            }
        }
    }

    .table-container {
        width: 100%;
        overflow-x: auto;
    }

    .leaderboard {
        margin-top: 1rem;
        width: 100%;
        min-width: max-content;
        text-align: center;
        border-collapse: collapse;

        .table-head {
            th {
                position: sticky;
                top: 0px;
                border-bottom: 2px solid var(--btn-hover);
                padding-bottom: 0.5rem;
                
                span {
                    margin-right: 0.5rem;
                }
            }

            .sort:hover {
                cursor: pointer;
            }

            .selected {
                color: var(--accent);
            }
        }

        .table-body {
            td {
                padding: 0.5rem 0;
            }
        }
    }
}

/* BREAKPOINTS */
@media (width >=65em) {
    .content {
        .content-header {
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;

            .sort-btns {
                display: flex;
                flex-flow: row;
                gap: 1rem;

                .selected {
                    background-color: var(--accent-dark);
                }

                button {
                    flex: 1;
                    width: 6rem;
                    text-align: center;
                }
            }
        }
    }
}
</style>