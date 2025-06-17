<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <img src="@/assets/images/Logo_Big.png" alt="FConnect Logo" />
  </header>
  <main>
    <div class="hero">
      <div class="info">
        <h1>
          <span><span>Swipe.</span> <span>Connect.</span></span
          ><span>Network.</span>
        </h1>
        <p>
          FConnect is een netwerking app voor facility managers. Swipe om te
          connecteren met professionals, groei jouw netwerk, en deel kennis om
          samen facility management te verbeteren.
        </p>
        <RouterLink to="/login"> Begin nu </RouterLink>
        <div class="stats">
          <div>
            <i class="fa-solid fa-users"></i>
            <p>
              <span>0K+</span>
              <span>actieve gebruikers</span>
            </p>
          </div>
          <div>
            <i class="fa-solid fa-link"></i>
            <p>
              <span>0K+</span>
              <span>matches gemaakt</span>
            </p>
          </div>
          <div>
            <i class="fa-solid fa-clock"></i>
            <p>
              <span>&lt;&nbsp;Xmin</span>
              <span>connecteer in</span>
            </p>
          </div>
        </div>
      </div>
      <div class="splash-image">
        <img src="@/assets/svg/splash.svg" alt="FConnect splas Image" />
      </div>
    </div>
    <section class="features">
      <h2>Onze Functies</h2>
      <ul>
        <li>
          <h3>Personaliseer Profielpagina</h3>
          <img src="@/assets/images/profilepicture.png" alt="voorbeeld profielfoto" />
        </li>
        <li>
          <h3>Filter Gebruikers Op De Kaart</h3>
          <p>
            Vind professionals in de buurt met locatie- en specialiteitsfilters.
          </p>
          <img src="@/assets/images/map.png" alt="map voorbeeld" />
        </li>
        <li>
          <h3>Toegang Tot Swipe Geschiedenis</h3>
          <img src="@/assets/images/history.png" alt="geschiedenis voorbeeld" />
        </li>
        <li>
          <h3>Swipe Om Te Connecten</h3>
          <p>
            Swipe profielen om te connecten met relevante professionals
            gebaseerd op uw voorkeur.
          </p>
          <img src="@/assets/images/interaction.png" alt="swipe actie voorbeeld" />
        </li>
        <li>
          <h3>Gebaseerd Op Wat Jij Zoekt</h3>
          <img src="@/assets/images/tags.png" alt="tags voorbeeld" />
        </li>
        <li>
          <h3>Chat Met Connecties</h3>
          <p>Verstuur berichten naar je matches instant!</p>
          <img src="@/assets/images/chat.png" alt="berichten voorbeeld" />
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;

  img {
    width: min(100%, 8rem);
    margin-bottom: 3rem;
  }
}

main {
  .hero {
    .splash-image {
      display: flex;
      justify-content: center;
      width: 35%;
      margin-top: 1rem;
      img {
        width: 17rem;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 1.938rem;

      h1 {
        display: flex;
        flex-flow: column;
        font-size: clamp(2rem, 0.0909rem + 5.4545vw, 5rem);
        font-weight: bold;
        margin: 0;
        color: var(--dark-blue);
        font-family: var(--source-sans-pro);
        font-weight: 900;
        line-height: 0.8;
        margin-bottom: 3rem;

        span {
          span:first-child {
            color: var(--dark-blue);
          }

          span:last-child {
            color: var(--red);
          }
        }

        > span {
          &:nth-child(2) {
            color: var(--green);
            font-size: 150%;
          }
        }
      }

      p {
        width: min(100%, 30rem);
        max-width: 100%;
        font-size: clamp(0.7rem, 1vw, 1rem);
        margin: -3rem 0 0 0;
      }

      a {
        text-decoration: none;
        color: var(--white);
        background-color: var(--dark-blue);
        width: max-content;
        padding: 0.1rem 2rem;
        border-radius: 0.5rem;
        font-weight: 900;
        font-family: var(--source-sans-pro);
      }

      .stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: 2rem;
        margin-right: 10rem;
        width: 100%;
        gap: 1rem;

        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          &:last-child {
            grid-column: span 2;
          }

          &::after {
            display: none;
            content: '';
            position: absolute;
            bottom: 5%;
            right: -7%;
            width: 0.3rem;
            background-color: var(--green);
            height: 60%;
            border-radius: 5rem;
          }

          i {
            font-size: 1.875rem;
            color: var(--red-5);
            margin-bottom: -0.8rem;
          }
          p {
            margin: 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            font-weight: 800;
            span {
              font-size: 2.5rem;
              font-weight: medium;
              width: fit-content;
              margin: 0rem;

              &:nth-child(2) {
                margin-top: -1rem;
                font-size: 80%;
                width: max-content;
              }
            }
          }
        }
      }
    }
  }

  .features h2 {
    text-align: center;
    font-size: 200%;
    font-weight: 900;
    font-family: var(--source-sans-pro);
  }

  ul {
    --fs-p: clamp(0.875rem, 0.7159rem + 0.4545vw, 1.125rem);
    --fs-h-1: clamp(1.5rem, 1.3409rem + 0.4545vw, 1.75rem);
    --fs-h-2: clamp(1.5rem, 1.1818rem + 0.9091vw, 2rem);
    --fs-h-3: clamp(1.5rem, 0.3068rem + 3.4091vw, 3.375rem);

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    grid-template-rows: 17rem 17rem 17rem;
    gap: 1rem;
    margin: 0;
    padding: 0;
    margin-bottom: 5rem;

    h3 {
      color: var(--dark-blue);
      font-weight: 800;
      font-size: var(--fs-h-1);
      margin: 0;
      margin-left: 1rem;
      margin-top: 1rem;
      max-width: 70%;
      line-height: 1.2;
      font-family: var(--source-sans-pro);
    }

    p {
      font-size: var(--fs-p);
      margin-left: 1rem;
      margin-top: 1rem;
      max-width: 70%;
      line-height: 1.2;
    }

    img {
      width: 100%;

      position: absolute;
      rotate: -6deg;
      right: 0;
      bottom: 0;
      border-radius: 1rem;
    }

    li {
      border-radius: 0.5rem;
      background-color: var(--light-blue);
      padding: 0.5rem;
      position: relative;
      list-style: none;
      overflow: hidden;
      border-radius: 1rem;
      height: 17rem;

      &:nth-child(2) {
        img {
          rotate: 10deg;
          width: 40%;
          bottom: -5%;
          right: -4%;
        }

        h3 {
          font-size: var(--fs-h-3);
        }
      }

      &:nth-child(1) {
        img {
          bottom: -10%;
          right: -7%;
          width: 70%;
          rotate: 10deg;
        }

        h3 {
          font-size: var(--fs-h-1);
        }
      }

      &:nth-child(3) {
        h3 {
          font-size: var(--fs-h-2);
        }
        img {
          bottom: 0%;
          right: -5%;
          width: 50%;
        }
      }

      &:nth-child(4) {
        img {
          bottom: -10%;
          right: -5%;
          width: 50%;
        }
      }

      &:nth-child(5) {
        img {
          bottom: 0%;
          right: -5%;
          width: 80%;
        }
      }

      &:nth-child(6) {
        h3 {
          font-size: var(--fs-h-3);
        }
        img {
          bottom: 0%;
          right: -5%;
          width: 70%;
        }
      }
    }
  }
}

@media screen and (width > 35rem) {
  main .hero .info .stats {
    display: flex;
    div {
      padding-inline: 3rem;

      &::after {
        display: block;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }

  main {
    .hero {
      display: flex;

      .splash-image {
        display: flex;
        justify-content: center;
        width: 35%;
        margin-top: -5rem;
        img {
          width: 35rem;
        }
      }
    }
  }
}

@media screen and (width > 70rem) {
  main ul {
    grid-template-columns: repeat(5, minmax(15rem, 1fr));

    li {
      height: auto;
    }
    li:nth-child(2) {
      grid-column: span 2;
      grid-row: span 2;

      img {
        width: 50%;
      }
    }

    li:nth-child(3) {
      grid-row: 2;
      grid-column: 1;
    }

    li:nth-child(4) {
      grid-row: 3;
      grid-column: span 2;
    }

    li:last-child {
      grid-column: 4 / span 2;
      grid-row: 1 / span 3;

      img {
        width: 100%;
      }
    }

    li:nth-child(4) {
      p {
        max-width: 100%;
      }
      img {
        width: 60%;
      }
    }
  }
}
</style>
