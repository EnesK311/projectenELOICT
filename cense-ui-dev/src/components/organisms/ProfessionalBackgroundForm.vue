<script setup lang="ts">
import { ref } from 'vue'
import FormField from '@/components/atoms/FormField.vue'
import FormSummary from '@/components/atoms/FormSummary.vue'
import FButton from '@/components/atoms/FButton.vue'
import { useLoading } from '@/composables/loading'
import { useFormValidation } from '@/composables/formValidation'
import RangeAtom from '../atoms/RangeAtom.vue'
import { storeToRefs } from 'pinia'
import { useSpecialityStore } from '@/stores/speciality'
import MultiSelectAtom from '../atoms/MultiSelectAtom.vue'
import { useRouter } from 'vue-router'
import type { PutPayload, Speciality } from '@/types/type'
import useAuthStore from '@/stores/auth'

const company = ref<string>('')
const street = ref<string>('')
const houseNumber = ref<string>('')
const city = ref<string>('')
const zipCode = ref<string>('')
const jaarErvaring = ref<string>('0')
const veldenExpertise = ref<Speciality[]>([])
const expertiseOpzoek = ref<Speciality[]>([])
const functieTitel = ref<string>('')

const form = {
  company: {
    value: company,
    rules: [(val: string) => (val ? null : 'Bedrijf is verplicht')],
  },
  street: {
    value: street,
    rules: [(val: string) => (val ? null : 'Straat is verplicht')],
  },
  houseNumber: {
    value: houseNumber,
    rules: [
      (val: string) => (val ? null : 'Huisnummer is verplicht'),
      (val: string) =>
        parseInt(val) > 0 ? null : 'Huisnummer moet positief zijn',
    ],
  },
  city: {
    value: city,
    rules: [(val: string) => (val ? null : 'City is verplicht')],
  },
  zipCode: {
    value: zipCode,
    rules: [
      (val: string) => (val ? null : 'Post code is verplicht'),
      (val: string) =>
        parseInt(val) > 0 ? null : 'Post code moet positief zijn',
    ],
  },
  jaarErvaring: {
    value: jaarErvaring,
    rules: [
      (val: string) => (val !== '' ? null : 'Jaar van ervaring is verplicht'),
      (val: string) =>
        +val >= 0 ? null : 'Jaar van ervaring moet 0 of meer zijn',
      (val: string) =>
        +val < 70 ? null : 'Jaar van ervaring moet minder dan 70 zijn',
    ],
  },
  functieTitel: {
    value: functieTitel,
    rules: [(val: string) => (val ? null : 'Functietitel is verplicht')],
  },
  veldenExpertise: {
    value: veldenExpertise,
    rules: [
      (val: Speciality[]) =>
        val.length > 0 ? null : 'Velden van expertise zijn verplicht',
    ],
  },
  expertiseOpzoek: {
    value: expertiseOpzoek,
    rules: [
      (val: Speciality[]) =>
        val.length > 0 ? null : 'Expertises op zoek zijn verplicht',
    ],
  },
}

const submitted = ref(false)
const { isLoading, startLoading, stopLoading } = useLoading()
const showSuccess = ref(false)

const { errors, validate } = useFormValidation(ref(form), submitted)

const { specialities } = storeToRefs(useSpecialityStore())
const { updateUser } = useAuthStore()

const router = useRouter()

const tryUpdateMe = async () => {
  submitted.value = true
  startLoading()

  validate()

  if (Object.keys(errors.value).length > 0) {
    stopLoading()
    return
  }

  try {
    const payload = createUpdatePayload()
    await updateUserProfile(payload)
    handleUpdateSuccess()
  } catch (err) {
    handleUpdateError(err)
  }
}

const createUpdatePayload = () => ({
  company: {
    name: company.value,
    street: street.value,
    houseNumber: houseNumber.value,
    city: city.value,
    postalcode: zipCode.value,
  },
  specialitiesJson: {
    Known: mapSpecialities(veldenExpertise.value),
    Needed: mapSpecialities(expertiseOpzoek.value),
  },
  functionTitle: functieTitel.value,
  yearsOfExperience: jaarErvaring.value,
})

const mapSpecialities = (specialities: typeof veldenExpertise.value) =>
  specialities.map(s => ({
    Name: s.specialityType,
    Category: s.category,
  }))

const updateUserProfile = (payload: PutPayload) => updateUser(payload)

const handleUpdateSuccess = () => {
  isLoading.value = false
  showSuccess.value = true
  redirectToConnect()
}

const redirectToConnect = () => {
  setTimeout(() => router.push({ name: 'login' }), 1000)
}

const handleUpdateError = (err: unknown) => {
  console.error(err)
  isLoading.value = false
}
</script>

<template>
  <form method="post" class="form" novalidate @submit.prevent="tryUpdateMe">
    <h2>Vervolledig je profiel</h2>
    <p>Professionele Achtergrond</p>

    <FormSummary
      :success="showSuccess"
      :errors="errors"
      message="Je profiel is succesvol aangepast!"
    />

    <!-- Company Field -->
    <FormField
      id="company"
      v-model="company"
      type="text"
      label="Voor welke organisatie werk je?"
      :required="true"
      :error="errors.company"
    />

    <!-- Functietitel Field -->
    <FormField
      id="functieTitel"
      v-model="functieTitel"
      type="text"
      label="Functietitel"
      :required="true"
      :error="errors.functieTitel"
    />

    <!-- Address Fields -->
    <div class="address-fields">
      <FormField
        id="street"
        v-model="street"
        type="text"
        label="Straat"
        :required="true"
        :error="errors.street"
      />
      <FormField
        id="houseNumber"
        v-model="houseNumber"
        type="text"
        label="Huisnummer"
        :required="true"
        :error="errors.houseNumber"
      />
    </div>

    <div class="address-fields">
      <FormField
        id="city"
        v-model="city"
        type="text"
        label="Stad"
        :required="true"
        :error="errors.city"
      />
      <FormField
        id="zipCode"
        v-model="zipCode"
        type="text"
        label="Postcode"
        :required="true"
        :error="errors.zipCode"
      />
    </div>

    <!-- Areas of Expertise Field -->
    <div class="form-field">
      <MultiSelectAtom
        id="veldenExpertise"
        v-if="specialities.length"
        v-model="veldenExpertise"
        :options="specialities"
        label="Velden van expertise"
        :error="errors.veldenExpertise"
      />
    </div>

    <!-- Years of Experience Field -->
    <RangeAtom
      id="JaarErvaring"
      v-model="jaarErvaring"
      :min="0"
      :max="50"
      :step="1"
      label="Ervaring (in jaar)"
      :error="errors.jaarErvaring"
    />

    <!-- Expertise Opzoek Field -->
    <MultiSelectAtom
      id="expertiseOpzoek"
      v-if="specialities.length"
      v-model="expertiseOpzoek"
      :options="specialities"
      label="Naar welke expertise(s) ben je op zoek?"
      :error="errors.expertiseOpzoek"
    />

    <div class="endForm">
      <FButton
        :loading="isLoading"
        type="submit"
        background-color="var(--green)"
        color="var(--white)"
      >
        Versturen
      </FButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
// NOTE Organisme should exist out of atoms and molecules so it should not contain any more css
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
    margin-top: 1.5rem;
  }
}

.address-fields {
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  .form-group {
    width: 100%;

    @media screen and (width > 50rem) {
      &:has(input#zipCode) {
        width: 35%;
      }

      &:has(input#houseNumber) {
        width: 45%;
      }
    }
  }
}

.multi-select,
.experience-field input[type='range'] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
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

.profile-picture-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 2px dashed #d9d9d9;
  border-radius: 0.5rem;
  text-align: center;
  color: #5c4033;
  cursor: pointer;

  .upload-icon {
    width: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #777;
    font-size: 0.875rem;
  }
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.error-message {
  font-size: 0.875rem;
  color: var(--red);
  font-weight: 400;
  margin-top: 0.25rem;
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
  .field-label {
    overflow: scroll;
  }
}
</style>
