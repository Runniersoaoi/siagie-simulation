<template>
  <div>
    <h2>Gestión de Asignaturas</h2>
    <form @submit.prevent="addSubject">
      <label for="subjectName">Nombre de la Asignatura:</label>
      <input id="subjectName" v-model="newSubject.name" required />
      <button type="submit">Agregar Asignatura</button>
    </form>

    <ul>
      <li v-for="subject in subjects" :key="subject.id">
        {{ subject.name }}
        <button @click="selectSubject(subject)">Editar</button>
        <button @click="deleteSubject(subject.id)">Eliminar</button>
      </li>
    </ul>

    <div v-if="selectedSubject">
      <h3>Editar Asignatura</h3>
      <form @submit.prevent="updateSubject">
        <label for="editSubjectName">Nombre de la Asignatura:</label>
        <input id="editSubjectName" v-model="editedSubject.name" required />
        <button type="submit">Guardar Cambios</button>
        <button @click="selectedSubject = null">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const subjects = ref([])
const newSubject = ref({ name: '' })
const selectedSubject = ref(null)
const editedSubject = ref({})

onMounted(() => {
  const storedSubjects = localStorage.getItem('subjects')
  if (storedSubjects) {
    subjects.value = JSON.parse(storedSubjects)
  }
})

const saveSubjects = () => {
  localStorage.setItem('subjects', JSON.stringify(subjects.value))
}

const addSubject = () => {
  const id = Date.now().toString()
  subjects.value.push({ id, ...newSubject.value })
  saveSubjects()
  newSubject.value = { name: '' }
}

const selectSubject = (subject) => {
  selectedSubject.value = subject
  editedSubject.value = { ...subject }
}

const updateSubject = () => {
  const index = subjects.value.findIndex((s) => s.id === selectedSubject.value.id)
  if (index !== -1) {
    subjects.value[index] = { ...editedSubject.value }
    saveSubjects()
    selectedSubject.value = null
  }
}

const deleteSubject = (id) => {
  subjects.value = subjects.value.filter((s) => s.id !== id)
  saveSubjects()
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
