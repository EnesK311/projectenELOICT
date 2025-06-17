<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOPOStore } from '@/stores/opo'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import PeerButton from '../atoms/PeerButton.vue'
import FormSelect from '../molecules/FormSelect.vue'
import FormInput from '../molecules/FormInput.vue'
import PeerH2 from '../atoms/PeerH2.vue'
import FileDownload from '../molecules/FileDownload.vue'
import FileUpload from '../molecules/FileUpload.vue'
import PeerFormTitle from '../atoms/PeerFormTitle.vue'
import PeerLabel from '../atoms/PeerLabel.vue'

const { opos, opo: opoData, selectedOpo: selectedData } = storeToRefs(useOPOStore())
const router = useRouter()

const file = ref<File | null>(null)
const showCreateOpoForm = ref<boolean>(false)
const errorMessage = ref<string>('')

const validationErrors = ref({
  name: '',
  file: ''
})

const validateForm = (): boolean => {
  let isValid = true
  validationErrors.value.name = ''
  validationErrors.value.file = ''

  if (!opoData.value.name.trim()) {
    validationErrors.value.name = 'OPO Name is required.'
    isValid = false
  }

  if (!file.value) {
    validationErrors.value.file = 'A file is required.'
    isValid = false
  }

  return isValid
}

const createOpo = async (): Promise<void> => {
  console.log('Creating OPO:', opoData.value)
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  try {
    if (file.value) {
      await useOPOStore().createOPO(opoData.value, file.value)
    }
    showCreateOpoForm.value = false
    opoData.value.name = ''
    file.value = null
    await useOPOStore().fetchOPOs()
  } catch (error: any) {
    errorMessage.value = 'Failed to create OPO: ' + error
    console.error('Failed to create OPO:', error)
  }
}

const pushOPORouter = async (): Promise<void> => {
  if (!selectedData.value) return
  try {
    router.push({ name: 'opo', params: { id: selectedData.value.id } })
  } catch (error: any) {
    console.error('Failed to push OPO router:', error)
  }
}

const onFileChange = (e: File | null): void => {
  file.value = e
}
</script>

<template>
  <div id="wrapper">
    <PeerH2>Select OPO</PeerH2>
    <FormSelect
      id="opo"
      label="Select OPO"
      v-model="selectedData.id"
      :options="opos.map((opo) => ({ value: opo.id, label: opo.name }))"
    />

    <PeerButton v-if="selectedData" @click="pushOPORouter">
      Fetch All Students and Groups
    </PeerButton>

    <PeerH2>OPO does not exist yet?</PeerH2>

    <PeerButton
      type="button"
      @click="showCreateOpoForm = !showCreateOpoForm"
      :disabled="!selectedData"
    >
      {{ showCreateOpoForm ? 'Cancel' : 'Create New OPO' }}
    </PeerButton>

    <div v-if="showCreateOpoForm">
      <p>Download this CSV File to upload all users and groups to this OPO.</p>
      <FileDownload url="../../../public/StudentsAndGroups.xlsx" filename="StudentsAndGroups.xlsx">
        Download Student List
      </FileDownload>

      <PeerFormTitle>Create New OPO</PeerFormTitle>

      <FormInput
        v-model="opoData.name"
        label="OPO Name"
        placeholder="Enter OPO Name"
        :errorMessage="validationErrors.name"
      />
      <PeerLabel>Upload your list of students and groups here</PeerLabel>
      <FileUpload @file-change="onFileChange" :errorMessage="validationErrors.file">
        Upload Students and Groups
      </FileUpload>

      <PeerButton type="button" @click="createOpo">Create</PeerButton>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
#wrapper {
  max-width: 30rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}

.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
