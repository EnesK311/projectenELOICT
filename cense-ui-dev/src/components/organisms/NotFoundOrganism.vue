<script setup lang="ts">
import BackButton from '../atoms/BackButton.vue';

setTimeout (() => {
    const spans: NodeListOf<HTMLElement> = document.querySelectorAll('h1 span');
    spans.forEach((span) => {
        span.style.transform = 'rotate(' + Math.floor(Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1) + 'deg)';
    });
}, 1000)
</script>

<template>
  <main>
    <div class="hero">
        <h1><span>4</span><span>0</span><span>4</span></h1>
        <p>Oh nee! Het ziet eruit dat je niet kan connecteren met deze pagina</p>
        <BackButton>Terug</BackButton>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 75dvh;

    .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        h1 {
            font-size: 30dvw;
            font-weight: 900;
            color: var(--red-7);
            height: 30dvw;
            letter-spacing: 10%;
            z-index: -1;
            margin: 0;
            margin-bottom: 1rem;
            span {
                display: inline-block;
                transition: transform 0.5s;
                &:nth-child(2) {
                    color: var(--dark-blue-7);                    
                }
                &:nth-child(3) {
                    color: var(--green-7);
                }
            }
        }
        p {
            font-size: 2.5dvw;
            margin: 5dvw 0 1rem;
        }
        .back-button {
            button {
                background-color: var(--dark-blue);
                padding: 0 2dvw;
            }
        }
    }
}

</style>