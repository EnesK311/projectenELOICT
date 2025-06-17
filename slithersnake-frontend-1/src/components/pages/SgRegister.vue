<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import SgButton from '../atoms/SgButton.vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { useTitle } from '@vueuse/core';
import { useFormValidator } from '@/composables/formValidator';

const title = useTitle()
title.value = 'Register | Slithersnake'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordRepeat = ref<string>('')
const errors = ref<string[]>([])

async function register() {
  errors.value = []

  const payload = {
    username: username.value,
    email: email.value,
    password: password.value,
    passwordRepeat: passwordRepeat.value
  }

  const { valid, errs } = useFormValidator(payload)

  console.log(payload)

  if (valid.value) {
    console.log("Form validator valid")
    const message = await authStore.register(payload)
    errors.value.push(message)
  } else {
    console.log("Form validator invalid")
    errors.value.push(...errs.value)
  }
}
</script>

<template>
    <section class="register">
        <form id="register-form" method="post">
            <div class="form-intro">
                <img src="/img/profile-picture.jpg">
                <h2>register</h2>
            </div>

            <div class="errors" v-for="(err, index) in errors" :key="index">{{ err }}</div>

            <div class="form-div">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" v-model="username">
            </div>

            <div class="form-div">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="" v-model="email">
            </div>
            <div class="form-div">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" value="" v-model="password">
            </div>
            <div class="form-div">
                <label for="passwordRepeat">Repeat password</label>
                <input type="password" id="passwordRepeat" name="passwordRepeat" value="" v-model="passwordRepeat">
            </div>

            <SgButton @click.prevent="register">register</SgButton>
            <RouterLink to="/login">Already have an account?</RouterLink>
        </form>
    </section>
</template>

<style scoped lang="scss">
.register {
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    margin: 2rem;
    padding: 1.5rem;
    border-radius: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    #register-form {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        width: 80%;
        margin-left: auto;
        margin-right: auto;

        .errors {
            color: red
        }

        .form-intro {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;

            > img {
                width: 6rem;
            }
        }

        .form-div {
            display: flex;
            flex-flow: column;
            width: 100%;

            input[type="text"],input[type="email"], input[type="password"] {
                height: 2.3em;
                border-radius: 5px;
                border: none;
            }
        }

        button {
            width: 80%;
        }

        a {
            color: var(--accent-light);
        }
    }
}

/* BREAKPOINTS */
@media (width >= 65em) {
    .register {
        width: 40%;

        #register-form {
            width: 60%;
        }
    }
}
</style>