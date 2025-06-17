<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useAuthStore from '@/stores/auth'
import { defineEmits } from 'vue'
import { updateMe } from '@/services/authService'
import { useLoading } from '@/composables/loading'
import { useFormValidation } from '@/composables/formValidation'
import type { FormValidation } from '@/composables/formValidation'
import { emojis } from '@/utils/helper'
import FButton from '../atoms/FButton.vue'
import FormField from '../atoms/FormField.vue'
import FormSummary from '@/components/atoms/FormSummary.vue'
import FormError from '../atoms/FormError.vue'

function createUploadForm(
  firstname: string,
  lastname: string,
  bio: string,
  profilePicture: File | null,
): FormValidation {
  return {
    firstname: {
      value: firstname,
      rules: [(val: string) => (val ? null : 'Voornaam is verplicht')],
    },
    lastname: {
      value: lastname,
      rules: [(val: string) => (val ? null : 'Achternaam is verplicht')],
    },
    bio: {
      value: bio,
      rules: [(val: string) => (val ? null : 'Biography is verplicht')],
    },
    profilePicture: {
      value: profilePicture,
      rules: [(val: File | null) => (val ? null : 'Profielfoto is verplicht')],
    },
  }
}

function createEmojiForm(
  firstname: string,
  lastname: string,
  bio: string,
  selectedEmoji: string,
  color: string,
): FormValidation {
  return {
    firstname: {
      value: firstname,
      rules: [(val: string) => (val ? null : 'Voornaam is verplicht')],
    },
    lastname: {
      value: lastname,
      rules: [(val: string) => (val ? null : 'Achternaam is verplicht')],
    },
    bio: {
      value: bio,
      rules: [(val: string) => (val ? null : 'Biography is verplicht')],
    },
    selectEmoji: {
      value: selectedEmoji,
      rules: [(val: string) => (val ? null : 'Emoticon is verplicht')],
    },
    color: {
      value: color,
      rules: [(val: string) => (val ? null : 'Kleur is verplicht')],
    },
  }
}

const emit = defineEmits(['nextStep'])
const { user } = storeToRefs(useAuthStore())

watch(user, newUser => {
  if (
    newUser &&
    newUser.firstname &&
    newUser.lastname &&
    newUser.bio &&
    newUser.age &&
    newUser.profilePicture &&
    newUser.color
  ) {
    emit('nextStep')
  }
})

const firstname = ref<string>(user.value?.firstname || '')
const lastname = ref<string>(user.value?.lastname || '')
const bio = ref<string>(user.value?.bio || '')
const profilePicture = ref<File | null>(null)
const uploadedFileName = ref<string | null>(null)
const pictureOption = ref<'upload' | 'emoji'>('upload')
const selectedEmoji = ref<string>('')
const color = ref<string>(user.value?.color || '')

// 3) Decide which form to use via a computed:
const computedForm = computed<FormValidation>(() => {
  if (pictureOption.value === 'upload') {
    return createUploadForm(
      firstname.value,
      lastname.value,
      bio.value,
      profilePicture.value,
    )
  } else {
    return createEmojiForm(
      firstname.value,
      lastname.value,
      bio.value,
      selectedEmoji.value,
      color.value,
    )
  }
})

const currentForm = ref<FormValidation>(computedForm.value)

const submitted = ref<boolean>(false)
const { isLoading, startLoading, stopLoading } = useLoading()
const showSuccess = ref<boolean>(false)
const { errors, validate } = useFormValidation(currentForm, submitted)

watch(computedForm, newVal => {
  currentForm.value = newVal
  errors.value = {}
})

async function tryUpdateMe() {
  submitted.value = true
  startLoading()
  validate()

  if (Object.keys(errors.value).length > 0) {
    stopLoading()
    return
  }

  await updateMe({
    firstname: firstname.value,
    lastname: lastname.value,
    bio: bio.value,
    profilePicture: profilePicture.value,
    profilePictureLink: selectedEmoji.value,
    color: color.value,
  })

  stopLoading()
  emit('nextStep')
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input && input.files && input.files[0]) {
    profilePicture.value = input.files[0]
    uploadedFileName.value = input.files[0].name
  }
}

function triggerFileUpload() {
  selectedEmoji.value = ''
  document.getElementById('profilePicture')?.click()
}

function selectEmoji(emoji: string) {
  selectedEmoji.value = emoji
  profilePicture.value = null
  uploadedFileName.value = null
}
</script>

<template>
  <form method="post" class="form" novalidate @submit.prevent="tryUpdateMe">
    <h2>Vervolledig je profiel</h2>
    <p>Persoonlijke informatie</p>
    <FormSummary
      :success="showSuccess"
      :errors="errors"
      message="Je profiel is succesvol aangepast!"
    ></FormSummary>

    <div class="address-fields">
      <FormField
        id="firstname"
        v-model="firstname"
        type="text"
        :required="true"
        label="Voornaam"
        :error="errors.firstname"
      ></FormField>
      <FormField
        id="lastname"
        v-model="lastname"
        type="text"
        :required="true"
        label="Achternaam"
        :error="errors.lastname"
      ></FormField>
    </div>

    <div class="address-fields">
      <FormField
        id="bio"
        v-model="bio"
        type="text"
        label="Biografie"
        :required="false"
        :error="errors.bio"
      ></FormField>
    </div>

    <div class="upload">
      <div class="profilepic-title">
        <label for="profilePicture">
          <span
            >Profielfoto
            <!--<span>(Optioneel)</span> --></span
          >
        </label>
        <button
          type="button"
          @click="
            pictureOption = pictureOption === 'upload' ? 'emoji' : 'upload'
          "
          :aria-label="pictureOption"
        >
          <span>foto</span>
          <span>emoji</span>
        </button>
      </div>
      <div v-if="errors.profilePicture" class="error-message">
        <FormError>{{ errors.profilePicture }}</FormError>
      </div>
      <div v-show="pictureOption === 'upload'">
        <div class="profile-picture-upload" @click="triggerFileUpload">
          <img
            src="@/assets/images/upload.png"
            alt="Upload Icon"
            class="upload-icon"
          />
          <input id="profilePicture" type="file" @change="onFileChange" />
          <p>Kies een bestand of sleep het naar hier.</p>
          <p v-if="uploadedFileName">
            Geüploade bestand: <strong>{{ uploadedFileName }}</strong>
          </p>
        </div>
      </div>
      <FormError>{{ errors.selectEmoji }}</FormError>
      <div v-show="pictureOption === 'emoji'" class="emoji-grid">
        <ul>
          <li v-for="emoji in emojis" :key="emoji.normal">
            <button
              class="emoji-option"
              @click="selectEmoji(emoji.normal)"
              :class="{ selected: selectedEmoji === emoji.normal }"
              type="button"
              :alt="'Emoji ' + emoji.normal.split('/')[emoji.normal.split('/').length - 1]"
              >
              <img
                :src="
                  selectedEmoji === emoji.normal ? emoji.animated : emoji.normal
                "
                alt="a professional emoticon"
                draggable="false"
              />
            </button>
          </li>
        </ul>
        <FormField
          id="color"
          v-model="color"
          type="color"
          label="Kleur"
          :error="errors.color"
          :required="false"
        />
      </div>
    </div>

    <div class="endForm">
      <FButton
        :loading="isLoading"
        type="submit"
        background-color="var(--green)"
        color="var(--white)"
        >Volgende</FButton
      >
    </div>
  </form>
</template>

<style scoped lang="scss">
//NOTE Organisme should exist out of atoms and molecules so it should not contain any more css
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.form {
  width: 100%;
  max-width: 40rem;
  border-radius: 1rem;
  background-color: var(--light-blue);
  padding: 2rem;

  margin: 0 auto;
  h2,
  p {
    margin: 0;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--black);
  }

  .endForm {
    display: flex;
    justify-content: flex-end;
  }
}

.address-fields {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  .form-group {
    width: 100%;
  }
}

.multi-select,
.experience-field input[type='range'] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 2px solid #ccc;
  background-color: #fff;
  color: #333;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.experience-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

label {
  color: var(--dark-blue);
  font-size: 110%;

  span span {
    font-size: 70%;
    font-style: italic;
  }
}

.profile-picture-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px dashed var(--dark-blue);
  border-radius: 0.5rem;
  text-align: center;
  color: var(--black);
  cursor: pointer;
  .upload-icon {
    width: 2rem;
    margin-bottom: 0.5rem;
  }

  input[type='file'] {
    @include visually-hidden;
  }

  &:has(input:focus-visible) {
    outline: 0.1rem solid var(--black);
    outline-offset: 0.2rem;
  }

  p {
    color: var(--dark-blue);
    opacity: 0.7;
    font-size: 0.875rem;
  }
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.error-message {
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: -0.5em;
  color: var(--red);
  font-size: 90%;
}

.upload {
  ul {
    margin: 0;
    margin-top: 0.5rem;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    list-style: none;
    gap: 0.5rem;

    li {
      margin: 0;
      padding: 0;
      border-radius: 0.5rem;
      overflow: hidden;

      button {
        background-color: var(--white);
        border: none;
        cursor: pointer;

        &.selected {
          background-color: var(--green);
        }

        img {
          width: 100%;
        }
      }
    }
  }
  .profilepic-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      background-color: var(--green);
      border: none;
      color: var(--white);
      padding: 0.2rem 0.7rem;
      border-radius: 5rem;
      position: relative;

      display: flex;
      gap: 1rem;
      text-transform: uppercase;
      cursor: pointer;

      &::after {
        content: '';
        width: 2.8rem;
        position: absolute;
        height: 80%;
        z-index: 2;
        inset: 0.15rem;
        border-radius: 5rem;
        background-color: var(--dark-blue);
        transition:
          width 0.2s ease,
          left 0.2s ease;
      }

      &[aria-label='emoji'] {
        &::after {
          left: 49%;
          width: 3.15rem;
        }
      }

      &[aria-label='upload'] {
        &::after {
          left: 3%;
          width: 3rem;
        }
      }
    }

    span {
      z-index: 9;
    }
  }
}

@media (max-width: 768px) {
  .form {
    padding: 1rem;
    .address-fields {
      display: flex;
      flex-direction: column;
      gap: 0rem;
    }
  }
}
</style>
