<script setup lang="ts">
import { ref } from 'vue'
import { handleProfilePicture } from '@/utils/helper'
import type { User } from '@/types/type'
const props = defineProps<{
  historyItem: {
    isApproved: boolean
    user: User
  }
}>()

const color = ref<string | null | undefined>(props.historyItem.user.color)
</script>

<template>
  <div class="history-card">
    <div class="image" :style="{ backgroundColor: color || 'var(--red-7)' }">
      <img
        :src="handleProfilePicture(historyItem.user.profilePicture)"
        :alt="
          props.historyItem.user.firstname +
          ' ' +
          props.historyItem.user.lastname
        "
      />
    </div>
    <div class="content">
      <div class="name">
        <h3>
          {{
            props.historyItem.user.firstname +
            ' ' +
            props.historyItem.user.lastname
          }}
        </h3>
        <img
          src="@/assets/svg/wave.svg"
          alt="like"
          v-if="props.historyItem.isApproved"
        />
        <div class="dislike" v-else><span></span><span></span></div>
      </div>
      <ul>
        <li
          v-for="(speciality, index) in props.historyItem.user.specialities
            ?.known"
          :key="index"
        >
          <p>{{ speciality.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-card {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  padding-right: 0.5rem;
  width: 100%;
  .image {
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    width: 100%;

    .name {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      h3 {
        margin: 0;
        font-size: 0.9rem;
        flex-grow: 1;
      }

      img {
        margin: 0;
        padding: 0.2rem;
        width: 1.7rem;
        border-radius: 50%;
        background-color: rgba($color: #fafafa, $alpha: 0.25);
        margin-left: auto;
      }

      .dislike {
        position: relative;
        margin: 0 0.5rem;
        margin-right: 0;
        border-radius: 50%;
        background-color: rgba($color: #fafafa, $alpha: 0.25);
        width: 1.7rem;
        height: 1.7rem;
        margin-left: auto;

        span {
          display: block;
          width: 1.2rem;
          height: 0.1rem;
          background-color: var(--red);
          border-radius: 0.5rem;
          position: absolute;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          rotate: 45deg;

          &:last-child {
            rotate: -45deg;
          }
        }
      }
    }
    ul {
      display: flex;
      gap: 0.5rem;
      li {
        background-color: var(--dark-blue-25);
      }
    }
  }
}

@media screen and (width > 50rem) {
  .history-card {
    // padding-right: 0.5rem;
    .content {
      .name {
        h3 {
          font-size: 1rem;
        }
        img {
          width: 2rem;
        }
        .dislike {
          width: 2rem;
          height: 2rem;
          span {
            width: 1.5rem;
            height: 0.2rem;
          }
        }
      }
    }
  }
}
</style>
