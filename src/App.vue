<template>
  <div id="app">
    <h1>Sistema de Gestión Escolar</h1>
    <div v-if="!isLoggedIn">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <label for="username">Usuario:</label>
        <input id="username" v-model="username" placeholder="Usuario" required />
        <label for="password">Contraseña:</label>
        <input id="password" v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
    <div v-else>
      <nav>
        <button @click="currentView = 'students'">Estudiantes</button>
        <button @click="currentView = 'subjects'">Asignaturas</button>
        <button @click="currentView = 'grades'">Notas</button>
        <button @click="currentView = 'reports'">Reportes</button>
        <button @click="logout">Cerrar Sesión</button>
      </nav>
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentManagement from './components/StudentManagement.vue'
import SubjectManagement from './components/SubjectManagement.vue'
import GradeManagement from './components/GradeManagement.vue'
import ReportManagement from './components/ReportManagement.vue'

const isLoggedIn = ref(false)
const username = ref('')
const password = ref('')
const currentView = ref('students')

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'students':
      return StudentManagement
    case 'subjects':
      return SubjectManagement
    case 'grades':
      return GradeManagement
    case 'reports':
      return ReportManagement
    default:
      return StudentManagement
  }
})

onMounted(() => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  if (loggedIn === 'true') {
    isLoggedIn.value = true
  }
})

const login = () => {
  if (username.value === 'admin' && password.value === 'password') {
    isLoggedIn.value = true
    localStorage.setItem('isLoggedIn', 'true')
  } else {
    alert('Credenciales incorrectas')
  }
}

const logout = () => {
  isLoggedIn.value = false
  localStorage.removeItem('isLoggedIn')
}
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  margin-bottom: 20px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
}

label {
  margin-top: 10px;
}

input {
  margin: 5px 0;
  padding: 5px;
}
</style>
