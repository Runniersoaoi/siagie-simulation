<template>
  <div>
    <h2>Gestión de Notas</h2>
    <form @submit.prevent="addGrade">
      <label for="studentSelect">Estudiante:</label>
      <select id="studentSelect" v-model="newGrade.studentId" required>
        <option v-for="student in students" :key="student.dni" :value="student.dni">
          {{ student.name }} {{ student.lastName }}
        </option>
      </select>
      <label for="subjectSelect">Asignatura:</label>
      <select id="subjectSelect" v-model="newGrade.subjectId" required>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.name }}
        </option>
      </select>
      <label for="gradeValue">Nota:</label>
      <input
        id="gradeValue"
        v-model.number="newGrade.value"
        type="number"
        min="0"
        max="20"
        step="0.1"
        required
      />
      <button type="submit">Agregar Nota</button>
    </form>

    <div v-for="student in students" :key="student.dni">
      <h3>{{ student.name }} {{ student.lastName }}</h3>
      <table>
        <thead>
          <tr>
            <th>Asignatura</th>
            <th>Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="grade in getStudentGrades(student.dni)" :key="grade.id">
            <td>{{ getSubjectName(grade.subjectId) }}</td>
            <td>{{ grade.value }}</td>
            <td>
              <button @click="editGrade(grade)">Editar</button>
              <button @click="deleteGrade(grade.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>Promedio: {{ calculateAverage(student.dni) }}</p>
    </div>

    <div v-if="selectedGrade">
      <h3>Editar Nota</h3>
      <form @submit.prevent="updateGrade">
        <label for="editGradeValue">Nueva Nota:</label>
        <input
          id="editGradeValue"
          v-model.number="editedGrade.value"
          type="number"
          min="0"
          max="20"
          step="0.1"
          required
        />
        <button type="submit">Guardar Cambios</button>
        <button @click="selectedGrade = null">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const students = ref([])
const subjects = ref([])
const grades = ref([])
const newGrade = ref({ studentId: '', subjectId: '', value: null })
const selectedGrade = ref(null)
const editedGrade = ref({})

onMounted(() => {
  const storedStudents = localStorage.getItem('students')
  const storedSubjects = localStorage.getItem('subjects')
  const storedGrades = localStorage.getItem('grades')
  if (storedStudents) students.value = JSON.parse(storedStudents)
  if (storedSubjects) subjects.value = JSON.parse(storedSubjects)
  if (storedGrades) grades.value = JSON.parse(storedGrades)
})

const saveGrades = () => {
  localStorage.setItem('grades', JSON.stringify(grades.value))
}

const addGrade = () => {
  if (newGrade.value.value < 0 || newGrade.value.value > 20) {
    alert('La nota debe estar entre 0 y 20')
    return
  }
  const id = Date.now().toString()
  grades.value.push({ id, ...newGrade.value })
  saveGrades()
  newGrade.value = { studentId: '', subjectId: '', value: null }
}

const getStudentGrades = (studentId) => {
  return grades.value.filter((grade) => grade.studentId === studentId)
}

const getSubjectName = (subjectId) => {
  const subject = subjects.value.find((s) => s.id === subjectId)
  return subject ? subject.name : 'Desconocido'
}

const calculateAverage = (studentId) => {
  const studentGrades = getStudentGrades(studentId)
  if (studentGrades.length === 0) return 'N/A'
  const sum = studentGrades.reduce((acc, grade) => acc + grade.value, 0)
  return (sum / studentGrades.length).toFixed(2)
}

const editGrade = (grade) => {
  selectedGrade.value = grade
  editedGrade.value = { ...grade }
}

const updateGrade = () => {
  if (editedGrade.value.value < 0 || editedGrade.value.value > 20) {
    alert('La nota debe estar entre 0 y 20')
    return
  }
  const index = grades.value.findIndex((g) => g.id === selectedGrade.value.id)
  if (index !== -1) {
    grades.value[index] = { ...editedGrade.value }
    saveGrades()
    selectedGrade.value = null
  }
}

const deleteGrade = (id) => {
  grades.value = grades.value.filter((g) => g.id !== id)
  saveGrades()
}

const isApproved = computed(() => (studentId, subjectId) => {
  const studentSubjectGrades = grades.value.filter(
    (g) => g.studentId === studentId && g.subjectId === subjectId,
  )
  if (studentSubjectGrades.length === 0) return false
  const average =
    studentSubjectGrades.reduce((acc, grade) => acc + grade.value, 0) / studentSubjectGrades.length
  return average >= 11
})
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
select,
button {
  margin: 5px 0;
  padding: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
