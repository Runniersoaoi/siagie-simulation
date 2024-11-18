<template>
  <div>
    <h2>Reportes</h2>
    <div>
      <h3>Reporte Individual de Estudiante</h3>
      <select v-model="selectedStudentId">
        <option value="">Seleccione un estudiante</option>
        <option v-for="student in students" :key="student.dni" :value="student.dni">
          {{ student.name }} {{ student.lastName }}
        </option>
      </select>
      <button @click="generateStudentReport" :disabled="!selectedStudentId">Generar Reporte</button>
    </div>
    <div>
      <h3>Reporte General de Desempeño</h3>
      <button @click="generateGeneralReport">Generar Reporte General</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

const students = ref([])
const subjects = ref([])
const grades = ref([])
const selectedStudentId = ref('')

onMounted(() => {
  const storedStudents = localStorage.getItem('students')
  const storedSubjects = localStorage.getItem('subjects')
  const storedGrades = localStorage.getItem('grades')
  if (storedStudents) students.value = JSON.parse(storedStudents)
  if (storedSubjects) subjects.value = JSON.parse(storedSubjects)
  if (storedGrades) grades.value = JSON.parse(storedGrades)
})

const generateStudentReport = () => {
  const student = students.value.find((s) => s.dni === selectedStudentId.value)
  if (!student) return

  const doc = new jsPDF()
  doc.text(`Reporte de ${student.name} ${student.lastName}`, 14, 15)
  doc.text(`DNI: ${student.dni}`, 14, 25)
  doc.text(`Fecha de Nacimiento: ${student.birthDate}`, 14, 35)

  const tableData = subjects.value.map((subject) => {
    const subjectGrades = grades.value.filter(
      (g) => g.studentId === student.dni && g.subjectId === subject.id,
    )
    const average =
      subjectGrades.length > 0
        ? subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length
        : 'N/A'
    const formattedAverage = typeof average === 'number' ? average.toFixed(2) : average
    const status = average >= 11 ? 'Aprobado' : 'Reprobado'
    return [subject.name, formattedAverage, status]
  })
  doc.autoTable({
    head: [['Asignatura', 'Promedio', 'Estado']],
    body: tableData,
    startY: 45,
  })

  doc.save(`reporte_${student.name}_${student.lastName}.pdf`)
}

const generateGeneralReport = () => {
  const reportData = subjects.value.map((subject) => {
    const subjectGrades = grades.value.filter((g) => g.subjectId === subject.id)
    const average =
      subjectGrades.length > 0
        ? subjectGrades.reduce((sum, g) => sum + g.value, 0) / subjectGrades.length
        : 'N/A'
    return {
      Asignatura: subject.name,
      'Promedio General': typeof average === 'number' ? average.toFixed(2) : average,
    }
  })

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(reportData)
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte General')
  XLSX.writeFile(wb, 'reporte_general.xlsx')
}
</script>

<style scoped>
div {
  margin-bottom: 20px;
}

select,
button {
  margin: 5px;
  padding: 5px;
}
</style>
