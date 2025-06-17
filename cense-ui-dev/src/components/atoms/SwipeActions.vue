<script setup lang="ts">
defineEmits(['action-click'])
</script>
<template>
  <div class="actions">
    <ul class="buttons">
      <li>
        <button @click="$emit('action-click', 'dislike')" title="Dislike">
          <span></span><span></span>
        </button>
      </li>
      <li>
        <button @click="$emit('action-click', 'history')" title="History">
          <i class="fa-solid fa-clock-rotate-left"></i>
        </button>
      </li>
      <li>
        <button @click="$emit('action-click', 'like')" title="Like">
          <span></span>
        </button>
      </li>
    </ul>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="259"
      height="94"
      viewBox="0 0 259 94"
      fill="none"
    >
      <path
        d="M0 46.9104C0 16.1595 29.1439 -6.23917 58.8592 1.67382L107.499 14.6263C121.915 18.4652 137.085 18.4652 151.501 14.6263L200.141 1.67382C229.856 -6.23917 259 16.1595 259 46.9104C259 77.407 230.306 99.7611 200.736 92.3012L150.771 79.6962C136.809 76.1739 122.191 76.1739 108.229 79.6962L58.2641 92.3012C28.694 99.7611 0 77.407 0 46.9104Z"
        fill="black"
      />
    </svg>
  </div>
</template>
<style scoped lang="scss">
.actions {
  width: min(80%, 14rem);
  margin-inline: auto;
  z-index: 3;
  margin-top: -1.5rem;

  display: grid;
  place-items: center;
  border-radius: 1rem;
  position: relative;

  > svg {
    position: absolute;
    z-index: -1;
    height: 140%;
    translate: 0.1rem 0rem;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    width: 100%;

    li {
      button {
        border: none;
        background-color: var(--white);
        border-radius: 50%;
        aspect-ratio: 1;
        width: 4rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      &:nth-child(1) {
        button {
          border: 0.1rem solid var(--red);
          position: relative;

          span {
            display: block;
            width: 1.5rem;
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

          &:hover {
            background-color: var(--red-4);
          }
        }
      }

      &:nth-child(3) {
        button {
          border: 0.1rem solid var(--green);
          display: grid;
          place-content: center;
          span {
            background-image: url('@/assets/svg/wave.svg');
            width: 1.5rem;
            aspect-ratio: 1;
            display: block;
            z-index: 3;
            background-size: cover;
          }

          &:hover {
            background-color: var(--green-25);
          }
        }
      }

      &:nth-child(2) {
        scale: 0.6;

        button {
          background-color: var(--blue);
          color: var(--white);
          font-size: 1.5rem;

          &:hover {
            background-color: var(--dark-blue);
          }
        }
      }
    }
  }
}

@media screen and (width > 35rem) {
  .actions {
    scale: 1;

    button[title='History'] {
      display: none;
    }
    svg {
      width: 110%;
    }
  }
}
</style>
