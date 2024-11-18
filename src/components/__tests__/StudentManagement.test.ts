import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StudentManagement from '../StudentManagement.vue'

describe('StudentManagement', () => {
  let wrapper: any

  beforeEach(() => {
    localStorage.clear()
    wrapper = mount(StudentManagement)
  })

  it('adds a new student', async () => {
    const newStudent = {
      name: 'Juan',
      lastName: 'Pérez',
      dni: '12345678',
      birthDate: '1990-01-01',
    }

    await wrapper.find('#name').setValue(newStudent.name)
    await wrapper.find('#lastName').setValue(newStudent.lastName)
    await wrapper.find('#dni').setValue(newStudent.dni)
    await wrapper.find('#birthDate').setValue(newStudent.birthDate)
    await wrapper.find('form').trigger('submit.prevent')

    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]')
    expect(storedStudents).toHaveLength(1)
    expect(storedStudents[0]).toMatchObject(newStudent)
  })

  it('searches for a student', async () => {
    const students = [
      { name: 'Juan', lastName: 'Pérez', dni: '12345678', birthDate: '1990-01-01' },
      { name: 'María', lastName: 'García', dni: '87654321', birthDate: '1995-05-05' },
    ]
    localStorage.setItem('students', JSON.stringify(students))

    await wrapper.find('#search').setValue('Juan')

    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(1)
    expect(listItems[0].text()).toContain('Juan Pérez')
  })

  it('updates student information', async () => {
    const students = [{ name: 'Juan', lastName: 'Pérez', dni: '12345678', birthDate: '1990-01-01' }]
    localStorage.setItem('students', JSON.stringify(students))

    await wrapper.vm.$nextTick()
    await wrapper
      .findAll('button')
      .find((b: any) => b.text() === 'Ver Detalles')
      .trigger('click')
    await wrapper.find('button:contains("Editar")').trigger('click')

    await wrapper.find('#editName').setValue('Juan Carlos')
    await wrapper.find('form:contains("Guardar Cambios")').trigger('submit.prevent')

    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]')
    expect(storedStudents[0].name).toBe('Juan Carlos')
  })

  it('deletes a student', async () => {
    const students = [{ name: 'Juan', lastName: 'Pérez', dni: '12345678', birthDate: '1990-01-01' }]
    localStorage.setItem('students', JSON.stringify(students))

    await wrapper.vm.$nextTick()
    await wrapper
      .findAll('button')
      .find((b: any) => b.text() === 'Ver Detalles')
      .trigger('click')
    await wrapper.find('button:contains("Eliminar")').trigger('click')

    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]')
    expect(storedStudents).toHaveLength(0)
  })
})
