<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import PeerOpoSelect from '@/components/organisms/PeerOpoSelect.vue'
import PeerButton from '@/components/atoms/PeerButton.vue'
import { ref, onMounted, watch } from 'vue'
import { useOPOStore } from '@/stores/opo'
import { useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import PeerH2 from '@/components/atoms/PeerH2.vue'

const route = useRoute()
const id = ref<number>(Number(route.params.id))

const opoStore = useOPOStore()
const { studentsAndGroups, opos } = storeToRefs(opoStore)
const { students } = storeToRefs(useStudentStore())

//fetch opo with id from route
const OPO = opos.value.find((opo) => opo.id === id.value)

//if students is empty we need to trigger fetch allstudents
if (!students.value.length) useStudentStore().fetchStudents()
//fetch opo based on id instead of using selected opo for title

const fetchStudentsAndGroups = async (id: number) => {
  if (!id) return
  try {
    await opoStore.fetchStudentsAndGroups(id)
  } catch (error) {
    console.error('Failed to fetch students and groups:', error)
  }
}

onMounted(() => {
  fetchStudentsAndGroups(id.value)
})
</script>

<template>
  <PeerH2>{{ OPO?.name }}</PeerH2>
  <div v-if="studentsAndGroups && studentsAndGroups.groups.length > 0">
    <PeerH2>List of groups that are in this OPO</PeerH2>
    <ul>
      <li v-for="group in studentsAndGroups.groups" :key="group.id">
        {{ group.title }}
        <ul>
          <li v-for="student in group.users" :key="student.id">
            {{ student.firstname + ' ' + student.lastname }}
            {{ student.email }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div v-else><PeerH2>No groups assigned to this opo</PeerH2></div>
</template>

<style scoped lang="scss"></style>
