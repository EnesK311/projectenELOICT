<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const allRoutes = computed(() =>
  router.options.routes.filter(route => route.meta && route.meta.showInFooter),
)
</script>

<template>
  <footer class="footer">
    <div class="container">
      <img
        src="@/assets/images/Logo_Vlaanderen_Departement_Onderwijs.png"
        alt="Logo Vlaams departement van onderwijs"
      />
    </div>
    <div class="container">
      <img
        src="@/assets/images/Odisee_Logo_Co-hogeschool.png"
        alt="Logo Odisee Co-hogeschool"
      />
    </div>
    <div class="links">
      <div>
        <img src="@/assets/images/fconnect_logo.png" alt="Logo FConnect" />
      </div>
      <div class="sub-nav">
        <ul>
          <li v-for="route in allRoutes" :key="route.path">
            <RouterLink :to="route.path">{{ route.name }}</RouterLink>
          </li>
        </ul>
        <ul>
          <li>
            <a
              href="https://www.freeprivacypolicy.com/live/56f1ebd1-081c-400b-84cf-180496813341"
              target="_blank"
              >Privacy Policy</a
            >
          </li>
          <li>
            <RouterLink to="/accessibility"
              >Accessibility Statement
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/">© 2024 with Cense </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: 3rem;
  width: 100%;
  color: var(--black);
  padding: 1rem 0;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-flow: row wrap;
  gap: 0.5rem;

  .container {
    aspect-ratio: 1;
    height: 8rem;
    border-radius: 1rem;
    display: grid;
    place-items: center;
    padding: 1rem;
    background-color: var(--green-5);
    flex-grow: 1;

    &:nth-child(2) {
      background-color: var(--dark-blue-5);
    }

    img {
      width: min(100%, 8rem);
      margin: 0 3rem;
    }
  }

  .links {
    width: 100%;
    background-color: var(--red-5);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
    border-radius: 1rem;
    gap: 1rem;
    flex-grow: 1;

    div {
      display: none;
      img {
        width: min(100%, 6rem);
      }
    }

    .sub-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
      font-size: clamp(0.75rem, 0.5909rem + 0.4545vw, 1rem);

      ul {
        display: flex;
        justify-content: space-around;
        width: 100%;
        list-style: none;
        margin: 0;
        padding: 0;
        text-align: left;
        gap: 2rem;

        &:first-of-type {
          flex-wrap: wrap;
          gap: 0;
          justify-content: flex-start;

          li {
            margin-block: 0.5rem;
            margin-right: 1rem;
          }
        }

        a {
          text-decoration: none;
          color: var(--secondary);
          text-transform: capitalize;
          font-family: 'Source Sans Pro', sans-serif;
          font-weight: light;
        }
      }
      ul:first-child {
        list-style: none;
        font-weight: 500;

        li {
          a {
            font-size: calc(clamp(0.75rem, 0.5909rem + 0.4545vw, 1rem) * 1.2);
            font-weight: 700;
          }
        }

        li:nth-child(2) {
          grid-area: 2/1/3/2;
        }

        li:nth-child(3) {
          grid-area: 3/1/4/2;
        }
      }
    }
  }
}

@media screen and (width > 35rem) {
  .footer {
    flex-flow: row nowrap;
    position: relative;

    .container {
      aspect-ratio: 0;
      height: auto;
      flex-grow: 0.5;
    }

    .links {
      .sub-nav > ul:first-of-type {
        justify-content: center;
      }
      div {
        display: block;
      }
    }
  }
}
</style>
