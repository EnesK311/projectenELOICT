<script setup lang="ts">
import SgButton from '@/components/atoms/SgButton.vue'
import SgPrompt from '@/components/molecules/SgPrompt.vue'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useDateFormatter } from '@/composables/dateFormatter';

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
authStore.tryAutoLogin()

const winPerc = computed(() => {
  const gamesWon = user.value?.games_won ?? 0;
  let gamesPlayed = user.value?.games_played ?? 1;

  gamesPlayed = gamesPlayed === 0 ? 1 : gamesPlayed;
  
  return gamesWon / gamesPlayed;
});


// username prompt
const showPrompt = ref<boolean>(false)
const newUsername = ref<String>(user.value?.username ? user.value.username : '')

const updateUserInfo = (newName: string) => {
  console.log("update username")
  if (user.value) {
    user.value.username = newName
  }
}

function logout() {
  authStore.logout()
}
</script>

<template>
  <section>
    <SgPrompt @updateUsername="updateUserInfo" v-show="showPrompt" v-model:showPrompt="showPrompt" v-model:modelValue="newUsername"></SgPrompt>
    <div class="profile">
      <div class="user-profile">
          <div class="user-info">
            <div class="user-name">
              <h2>{{ user?.username }}</h2>
              <p>Lvl. {{ user?.level }}</p>
            </div>

            <img src="/img/profile-picture.jpg" alt="user_profile">
          </div>
          
          <SgButton @click="() => showPrompt = true">Change name</SgButton>
      </div>

      <div class="user-stats">
          <ul>          
            <li>
              <h3>Highscore</h3>
              <p>{{ user?.highscore }}</p>
            </li>
            <li>
              <h3>Games played</h3>
              <p>{{ user?.games_played }}</p>
            </li>
            <li>
              <h3>Games won</h3>
              <p>{{ user?.games_won }}</p>
            </li>
            <li>
              <h3>Win percentage</h3>
              <p>{{ winPerc }}%</p>
            </li>
            <li>
              <h3>Kills</h3>
              <p>{{ user?.players_killed }}</p>
            </li>
            <li>
              <h3>Skins unlocked</h3>
              <p>{{ user?.skins?.length ?? 4}}</p>
            </li>
          </ul>
      </div>
      <div>
        <SgButton @click="logout">Logout</SgButton>
      </div>
    </div>

    <div class="games">
      <h2>Game history</h2>
      <table class="games-table" v-if="user?.duels?.length">
        <thead>
          <tr class="table-head">
            <th>id</th>
            <th>start_time</th>
            <th>gamemode</th>
            <th>map</th>
          </tr>
        </thead>
        <tbody>
          <tr class="game" v-for="game in user?.duels" :key="game.id">
            <td>{{ game.id }}</td>
            <td>{{ useDateFormatter(game.start_time).newDate }}</td>
            <td>{{ game.gamemode.name }}</td>
            <td>{{ game.map.name }}</td>
          </tr>
        </tbody>
      </table>
      <div class="no-games">
        <p v-if="!user?.duels?.length">No games played yet!</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile, .games {
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);
  margin: 2rem;
  padding: 1.5rem;
  border-radius: 10px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  .games-table {
    width: 100%;

    .table-head {
      th {
        padding: 1rem 0rem;
      }
      
    }

    .game {
      width: 100%;
      td {
        text-align: center;
      }
    }
  }

  .no-games {
    width: 100%;

    p {
      text-align: center;
    }
  }

  .user-profile {
    display: flex;
    flex-flow: column;
    align-items: first baseline;
    justify-content: space-between;
    gap: 1rem;

    .user-info {
        display: flex;
        gap: 0.5rem;

        .user-name {
            order: 1;
        }

        > img {
            width: 5rem;
        }
    }

    button {
        background-color: var(--accent);
        color: var(--default-text-dark);
        border: none;
        border-radius: 10px;
        padding: 0.4rem 2rem;
    }
  }

  .user-stats {
      margin: 2rem 0rem 0rem 0rem;
      > ul {
          display: flex;
          flex-flow: column;
          gap: 0.5rem;
          list-style-type: none;
          padding: 0;
      }
  }
}

/* BREAKPOINTS */
@media (width >= 65em) {
.profile, .games {
    width: 60%;

    .user-profile {
      flex-flow: row;
      align-items: flex-start;

      .user-info {
          flex: 3;
      }

      button {
          flex: 1;
      }
    }
  }
}
</style>