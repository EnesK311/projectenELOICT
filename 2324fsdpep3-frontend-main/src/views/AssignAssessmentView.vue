<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'
import PeerButton from '@/components/atoms/PeerButton.vue'
import type { Student } from '@/types'

// Define emits
const emit = defineEmits(['next', 'prev'])

const studentStore = useStudentStore()
const { students, pickedStudents, isLoading, error } = storeToRefs(studentStore)

onMounted(() => {
  studentStore.fetchStudents()
})

const addStudent = (student: Student) => {
  if (!pickedStudents.value.includes(student)) {
    pickedStudents.value.push(student)
  }
}

const removeStudent = (student: Student) => {
  const index = pickedStudents.value.findIndex((s) => s.id === student.id)
  if (index !== -1) {
    pickedStudents.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <h2>Step 4: Assign Assessment</h2>
    <div>
      <p>Assign this Assessment to a group of students</p>
      <div v-if="isLoading">Loading students...</div>
      <div v-if="error">{{ error }}</div>
      <ul v-if="!isLoading && !error">
        <li v-for="student in students" :key="student.id">
          {{ student.firstname }} {{ student.lastname }}
          {{ student.email }}
          <PeerButton @click="addStudent(student)">Add Student</PeerButton>
        </li>
      </ul>
    </div>
    <div>
      <p>All selected students</p>
      <ul>
        <li v-for="student in pickedStudents" :key="student.id">
          {{ student.firstname }} {{ student.lastname }}
          <PeerButton type="button" @click="() => removeStudent(student)"
            >Remove Student</PeerButton
          >
        </li>
      </ul>
    </div>
    <PeerButton type="button" @click="$emit('prev')">Prev</PeerButton>
    <PeerButton type="button" @click="$emit('next')" :disabled="pickedStudents.length === 0"
      >Assign to student and finish</PeerButton
    >
  </div>
</template>

<style scoped lang="scss"></style>
