<template>
  <div>
    <h2>Gestión de Estudiantes</h2>
    <form @submit.prevent="addStudent">
      <label for="name">Nombre:</label>
      <input id="name" v-model="newStudent.name" required />
      <label for="lastName">Apellidos:</label>
      <input id="lastName" v-model="newStudent.lastName" required />
      <label for="dni">DNI:</label>
      <input id="dni" v-model="newStudent.dni" required />
      <label for="birthDate">Fecha de Nacimiento:</label>
      <input id="birthDate" v-model="newStudent.birthDate" type="date" required />
      <button type="submit">Agregar Estudiante</button>
    </form>

    <div>
      <label for="search">Buscar estudiante:</label>
      <input id="search" v-model="searchTerm" placeholder="DNI o nombre" />
    </div>

    <ul>
      <li v-for="student in filteredStudents" :key="student.dni">
        {{ student.name }} {{ student.lastName }} (DNI: {{ student.dni }})
        <button @click="selectStudent(student)">Ver Detalles</button>
      </li>
    </ul>

    <div v-if="selectedStudent">
      <h3>Detalles del Estudiante</h3>
      <p>Nombre: {{ selectedStudent.name }}</p>
      <p>Apellidos: {{ selectedStudent.lastName }}</p>
      <p>DNI: {{ selectedStudent.dni }}</p>
      <p>Fecha de Nacimiento: {{ selectedStudent.birthDate }}</p>
      <button @click="editMode = true">Editar</button>
      <button @click="deleteStudent">Eliminar</button>

      <form v-if="editMode" @submit.prevent="updateStudent">
        <label for="editName">Nombre:</label>
        <input id="editName" v-model="editedStudent.name" required />
        <label for="editLastName">Apellidos:</label>
        <input id="editLastName" v-model="editedStudent.lastName" required />
        <label for="editBirthDate">Fecha de Nacimiento:</label>
        <input id="editBirthDate" v-model="editedStudent.birthDate" type="date" required />
        <button type="submit">Guardar Cambios</button>
        <button @click="editMode = false">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const students = ref([])
const newStudent = ref({ name: '', lastName: '', dni: '', birthDate: '' })
const selectedStudent = ref(null)
const editedStudent = ref({})
const editMode = ref(false)
const searchTerm = ref('')

onMounted(() => {
  const storedStudents = localStorage.getItem('students')
  if (storedStudents) {
    students.value = JSON.parse(storedStudents)
  }
})

const saveStudents = () => {
  localStorage.setItem('students', JSON.stringify(students.value))
}

const addStudent = () => {
  students.value.push({ ...newStudent.value })
  saveStudents()
  newStudent.value = { name: '', lastName: '', dni: '', birthDate: '' }
}

const filteredStudents = computed(() => {
  if (!searchTerm.value) return students.value
  return students.value.filter(
    (student) =>
      student.dni.includes(searchTerm.value) ||
      student.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()),
  )
})

const selectStudent = (student) => {
  selectedStudent.value = student
  editedStudent.value = { ...student }
}

const updateStudent = () => {
  const index = students.value.findIndex((s) => s.dni === selectedStudent.value.dni)
  if (index !== -1) {
    students.value[index] = { ...editedStudent.value, dni: selectedStudent.value.dni }
    saveStudents()
    selectedStudent.value = { ...editedStudent.value }
    editMode.value = false
  }
}

const deleteStudent = () => {
  students.value = students.value.filter((s) => s.dni !== selectedStudent.value.dni)
  saveStudents()
  selectedStudent.value = null
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-bottom: 20px;
}

label {
  margin-top: 10px;
}

input,
button {
  margin: 5px 0;
  padding: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
