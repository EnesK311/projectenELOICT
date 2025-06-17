<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import { useSpecialityStore } from '@/stores/speciality'
import { useLoading } from '@/composables/loading'
import { useFormValidation } from '@/composables/formValidation'
import type { FormValidation } from '@/composables/formValidation'
import type { PutPayload, Speciality, User } from '@/types/type'

import LabelAtom from '@/components/atoms/LabelAtom.vue'
import FButton from '../atoms/FButton.vue'
import FormField from '../atoms/FormField.vue'
import FormSummary from '../atoms/FormSummary.vue'

import RangeAtom from '@/components/atoms/RangeAtom.vue'
import MultiSelectAtom from '@/components/atoms/MultiSelectAtom.vue'
import ProfileDetailOrganism from './ProfileDetailOrganism.vue'

import { emojis, getNormalEmoji } from '@/utils/helper'

const { user } = storeToRefs(useAuthStore())
const { updateUser } = useAuthStore()
const router = useRouter()

const firstname = ref(user.value?.firstname || '')
const lastname = ref(user.value?.lastname || '')
const bio = ref(user.value?.bio || '')
const age = ref<string>(user.value?.age?.toString() || '')
const functionTitle = ref(user.value?.functionTitle || '')
const profilePicture = ref<File | null>(null)
const company = ref(user.value?.company?.name || '')
const street = ref(user.value?.company?.street || '')
const houseNumber = ref(user.value?.company?.houseNumber || '')
const city = ref(user.value?.company?.city || '')
const zipCode = ref(user.value?.company?.postalcode?.toString() || '')
const color = ref(user.value?.color || '')

const { specialities } = storeToRefs(useSpecialityStore())
const veldenExpertise = ref<Speciality[]>(
  user.value?.specialities?.known?.map(
    (s: { name: string; category: number }) => {
      return { category: s.category, specialityType: s.name } as Speciality
    },
  ) || [],
)
const expertiseOpzoek = ref<Speciality[]>(
  user.value?.specialities?.needed?.map(
    (s: { name: string; category: number }) => {
      return { category: s.category, specialityType: s.name } as Speciality
    },
  ) || [],
)

const jaarErvaring = ref<string>(user.value?.experience || '0')
const uploadedFileName = ref<string | null>(null)
const selectedEmoji = ref<string>(
  getNormalEmoji(user.value?.profilePicture) || '',
)
const pictureOption = ref<'upload' | 'emoji'>('upload')

const isMobileView = ref(window.innerWidth <= 768)
const showPreview = ref(!isMobileView.value)
const shouldShowWrapper = computed(() => {
  return isMobileView.value ? !showPreview.value : true
})

const updateView = () => {
  isMobileView.value = window.innerWidth <= 768
  if (!isMobileView.value) {
    showPreview.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', updateView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateView)
})

watch(
  user,
  newUser => {
    if (newUser?.profilePicture && getNormalEmoji(newUser.profilePicture)) {
      pictureOption.value = 'emoji'
    } else {
      pictureOption.value = 'upload'
    }
  },
  { immediate: true },
)

const existingProfilePictureUrl = computed(() => {
  if (getNormalEmoji(user.value?.profilePicture)) return ''
  return user.value?.profilePicture || ''
})

function createFormForUpload(
  firstnameValue: string,
  lastnameValue: string,
  bioValue: string,
  companyValue: string,
  streetValue: string,
  houseNumberValue: string,
  cityValue: string,
  zipCodeValue: string,
  functieTitelValue: string,
  yearsOfExperience: number,
): FormValidation {
  return {
    firstname: {
      value: firstnameValue,
      rules: [(val: string) => (val ? null : 'Voornaam is verplicht')],
    },
    lastname: {
      value: lastnameValue,
      rules: [(val: string) => (val ? null : 'Achternaam is verplicht')],
    },
    bio: {
      value: bioValue,
      rules: [(val: string) => (val ? null : 'Biografie is verplicht')],
    },
    company: {
      value: companyValue,
      rules: [(val: string) => (val ? null : 'Bedrijf is verplicht')],
    },
    street: {
      value: streetValue,
      rules: [(val: string) => (val ? null : 'Straat is verplicht')],
    },
    houseNumber: {
      value: houseNumberValue,
      rules: [
        (val: string) => (val ? null : 'Huisnummer is verplicht'),
        (val: string) => (+val > 0 ? null : 'Huisnummer moet positief zijn'),
      ],
    },
    city: {
      value: cityValue,
      rules: [(val: string) => (val ? null : 'Stad is verplicht')],
    },
    zipCode: {
      value: zipCodeValue,
      rules: [
        (val: string) => (val ? null : 'Postcode is verplicht'),
        (val: string) => (+val > 0 ? null : 'Postcode moet positief zijn'),
      ],
    },
    functieTitel: {
      value: functieTitelValue,
      rules: [(val: string) => (val ? null : 'Functietitel is verplicht')],
    },
    yearsOfExperience: {
      value: yearsOfExperience,
      rules: [
        (val: number) =>
          val >= 0 ? null : 'Jaren ervaring moet positief zijn',
      ],
    },
  }
}

function createFormForEmoji(
  firstnameValue: string,
  lastnameValue: string,
  bioValue: string,
  companyValue: string,
  streetValue: string,
  houseNumberValue: string,
  cityValue: string,
  zipCodeValue: string,
  colorValue: string,
  selectedEmojiValue: string,
  functieTitelValue: string,
  yearsOfExperience: number,
): FormValidation {
  return {
    firstname: {
      value: firstnameValue,
      rules: [(val: string) => (val ? null : 'Voornaam is verplicht')],
    },
    lastname: {
      value: lastnameValue,
      rules: [(val: string) => (val ? null : 'Achternaam is verplicht')],
    },
    bio: {
      value: bioValue,
      rules: [(val: string) => (val ? null : 'Biografie is verplicht')],
    },
    company: {
      value: companyValue,
      rules: [(val: string) => (val ? null : 'Bedrijf is verplicht')],
    },
    functieTitel: {
      value: functieTitelValue,
      rules: [(val: string) => (val ? null : 'Functietitel is verplicht')],
    },
    street: {
      value: streetValue,
      rules: [(val: string) => (val ? null : 'Straat is verplicht')],
    },
    houseNumber: {
      value: houseNumberValue,
      rules: [
        (val: string) => (val ? null : 'Huisnummer is verplicht'),
        (val: string) => (+val > 0 ? null : 'Huisnummer moet positief zijn'),
      ],
    },
    city: {
      value: cityValue,
      rules: [(val: string) => (val ? null : 'Stad is verplicht')],
    },
    zipCode: {
      value: zipCodeValue,
      rules: [
        (val: string) => (val ? null : 'Postcode is verplicht'),
        (val: string) => (+val > 0 ? null : 'Postcode moet positief zijn'),
      ],
    },
    selectEmoji: {
      value: selectedEmojiValue,
      rules: [(val: string) => (val ? null : 'Emoticon is verplicht')],
    },
    color: {
      value: colorValue,
      rules: [
        (val: string) =>
          val && val !== '' ? null : 'Je moet een kleur kiezen als achtergrond',
      ],
    },
    yearsOfExperience: {
      value: yearsOfExperience,
      rules: [
        (val: number) =>
          val >= 0 ? null : 'Jaren ervaring moet positief zijn',
      ],
    },
  }
}

const computedForm = computed<FormValidation>(() => {
  return pictureOption.value === 'upload'
    ? createFormForUpload(
        firstname.value,
        lastname.value,
        bio.value,
        company.value,
        street.value,
        houseNumber.value,
        city.value,
        zipCode.value,
        functionTitle.value,
        // profilePicture.value,
        +jaarErvaring.value,
      )
    : createFormForEmoji(
        firstname.value,
        lastname.value,
        bio.value,
        company.value,
        street.value,
        houseNumber.value,
        city.value,
        zipCode.value,
        color.value,
        selectedEmoji.value,
        functionTitle.value,
        +jaarErvaring.value,
      )
})

const currentForm = ref<FormValidation>(computedForm.value)
const submitted = ref<boolean>(false)
const { errors, validate } = useFormValidation(currentForm, submitted)

watch(computedForm, newVal => {
  currentForm.value = newVal
  errors.value = {}
})

const { isLoading, startLoading, stopLoading } = useLoading()
const showSuccess = ref<boolean>(false)

const updatedUser = computed((): User => {
  return {
    firstname: firstname.value,
    lastname: lastname.value,
    email: user.value?.email || '',
    bio: bio.value,
    age: +age.value,
    functionTitle: functionTitle.value,
    profilePicture:
      pictureOption.value === 'upload'
        ? profilePicture.value
          ? URL.createObjectURL(profilePicture.value)
          : user.value?.profilePicture
        : selectedEmoji.value
          ? selectedEmoji.value
          : user.value?.profilePicture,
    company: {
      id: user.value?.company?.id || '',
      name: company.value,
      street: street.value,
      houseNumber: houseNumber.value,
      city: city.value,
      postalcode: zipCode.value,
      country: 'Belgium',
      longitude: user.value?.company?.longitude ?? 0,
      latitude: user.value?.company?.latitude ?? 0,
    },
    color: color.value,
    specialities: {
      known: veldenExpertise.value.map(s => ({
        name: s.specialityType,
        category: s.category,
      })),
      needed: expertiseOpzoek.value.map(s => ({
        name: s.specialityType,
        category: s.category,
      })),
    },
  }
})

async function tryUpdateMe() {
  try {
    startLoading()
    submitted.value = true
    validate()

    if (Object.keys(errors.value).length > 0) {
      stopLoading()
      return
    }

    const payload = {
      firstname: firstname.value,
      lastname: lastname.value,
      bio: bio.value,
      age: +age.value,
      functionTitle: functionTitle.value,
      profilePicture: profilePicture.value || user.value?.profilePicture,
      profilePictureLink: selectedEmoji.value,
      company: {
        name: company.value,
        street: street.value,
        houseNumber: houseNumber.value,
        city: city.value,
        postalcode: zipCode.value,
      },
      specialitiesJson: {
        Known: veldenExpertise.value.map(s => ({
          Name: s.specialityType,
          Category: s.category,
        })),
        Needed: expertiseOpzoek.value.map(s => ({
          Name: s.specialityType,
          Category: s.category,
        })),
      },
      color: color.value,
      yearsOfExperience: jaarErvaring.value,
    } as PutPayload

    await updateUser(payload)
    showSuccess.value = true
    router.push('/connect')
  } catch (err) {
    console.error(err)
    stopLoading()
  } finally {
    stopLoading()
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
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
  <main class="main">
    <form method="post" class="form" novalidate @submit.prevent="tryUpdateMe">
      <div class="title">
        <h2>Pas je profiel aan</h2>
        <button
          type="button"
          title="Voorbeeld hoe je profiel eruitziet"
          @click="showPreview = !showPreview"
        >
          <i
            class="fa-eye"
            :class="{ 'fa-solid': !showPreview, 'fa-regular': showPreview }"
          ></i>
          Voorbeeld
        </button>
      </div>
      <div class="wrapper" v-show="shouldShowWrapper">
        <FormSummary
          :success="showSuccess"
          :errors="errors"
          message="Je profiel is succesvol aangepast!"
        />

        <div class="address-fields">
          <FormField
            id="firstname"
            v-model="firstname"
            type="text"
            label="Voornaam"
            :error="errors.firstname"
            :required="true"
          />
          <FormField
            id="lastname"
            v-model="lastname"
            type="text"
            label="Achternaam"
            :error="errors.lastname"
            :required="true"
          />
        </div>

        <!-- BIO -->
        <FormField
          id="bio"
          v-model="bio"
          type="text"
          label="Biografie"
          :error="errors.bio"
          :required="true"
        />

        <div class="upload">
          <div class="profilepic-title">
            <LabelAtom
              v-if="pictureOption === 'upload'"
              for-id="profilePicture"
              label="Kies je profielfoto"
              :error="errors.profilePicture"
            />
            <LabelAtom
              v-if="pictureOption === 'emoji'"
              for-id="selectedEmoji"
              label="Kies je emoticon"
              :error="errors.selectEmoji"
            />

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

          <div v-show="pictureOption === 'upload'">
            <div class="profile-picture-upload" @click="triggerFileUpload">
              <img
                v-if="existingProfilePictureUrl"
                :src="existingProfilePictureUrl"
                :alt="user?.firstname + ' Foto'"
                class="existing-profile-picture"
              />
              <img
                v-else
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

          <div v-show="pictureOption === 'emoji'">
            <ul class="emoji-grid">
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
              :required="false"
              v-model="color"
              type="color"
              label="Kleur"
              :error="errors.color"
            />
          </div>
        </div>

        <FormField
          id="company"
          v-model="company"
          type="text"
          label="Bedrijf"
          :error="errors.company"
          :required="true"
        />
        <div class="address-fields">
          <FormField
            id="street"
            v-model="street"
            type="text"
            label="Straat"
            :error="errors.street"
            :required="true"
          />
          <FormField
            id="houseNumber"
            v-model="houseNumber"
            type="text"
            label="Huisnummer"
            :error="errors.houseNumber"
            :required="true"
          />
        </div>
        <div class="address-fields">
          <FormField
            id="city"
            v-model="city"
            type="text"
            label="Stad"
            :error="errors.city"
            :required="true"
          />
          <FormField
            id="zipCode"
            v-model="zipCode"
            type="text"
            label="Postcode"
            :error="errors.zipCode"
            :required="true"
          />
        </div>

        <FormField
          id="functieTitel"
          v-model="functionTitle"
          type="text"
          label="Functie Titel"
          :error="errors.functieTitel"
          :required="true"
        />

        <MultiSelectAtom
          v-if="specialities.length"
          v-model="veldenExpertise"
          :options="specialities"
          id="veldenExpertise"
          label="Velden van Expertise"
          :error="errors.veldenExpertise"
        />
        <MultiSelectAtom
          v-if="specialities.length"
          v-model="expertiseOpzoek"
          :options="specialities"
          id="expertiseOpzoek"
          label="Gezochte Expertise"
          :error="errors.expertiseOpzoek"
        />

        <RangeAtom
          v-model="jaarErvaring"
          :min="0"
          :max="70"
          :step="1"
          label="Ervaring (in jaar)"
          :error="errors.jaarErvaring"
        />

        <FButton
          :loading="isLoading"
          type="submit"
          color="var(--white)"
          background-color="var(--dark-blue)"
        >
          Sla Op
        </FButton>
      </div>
    </form>

    <div class="container" v-show="showPreview">
      <ProfileDetailOrganism
        :id="user?.id"
        v-if="user && user.id"
        :prop-user="updatedUser"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
:deep(.info.info) {
  @media screen and (max-width: 1400px) {
    display: flex;
    flex-direction: column;
  }
}

.emoji-option {
  border: none;
  background-color: transparent;
  cursor: pointer;
  img {
    width: 100%;
  }
}

.container {
  position: sticky;
  top: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
  height: max-content;
  width: 100%;
}
.form {
  width: 100%;
  max-width: 40rem;
  border-radius: 1rem;
  background-color: var(--light-blue);
  padding: 2rem;
  margin: 0 auto;

  .title {
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: space-between;

    h2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 0.8;
      -webkit-text-stroke: 0.025rem var(--black);
    }

    button {
      background-color: var(--red);
      border: none;
      color: var(--white);
      padding: 0.2rem 0.5rem;
      border-radius: 0.3rem;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.2rem;
      text-transform: uppercase;
      cursor: pointer;
      width: min-content;
    }
  }

  @media screen and (width > 25rem) {
    .title {
      flex-direction: row;
      align-items: center;
    }
  }

  @media screen and (width > 50rem) {
    .title button {
      display: none;
    }
  }

  h2,
  h3,
  p {
    margin: 0 0 1rem;
  }

  h2 {
    margin-bottom: 0;
  }

  .address-fields {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;

    gap: 1rem;
    .form-group {
      flex: 1;
    }
  }

  .profile-picture-upload {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 2px dashed var(--dark-blue);
    border-radius: 0.5rem;
    text-align: center;
    color: var(--dark-blue);
    cursor: pointer;
    input[type='file'] {
      display: none;
    }
    p {
      margin-top: 0.5rem;
      color: var(--dark-blue);
    }

    .existing-profile-picture {
      max-width: 10rem;
      max-height: 10rem;
    }
  }
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

body {
  position: relative;
}

.main {
  gap: 0.5rem;
  margin-top: 2.5rem;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}
</style>
