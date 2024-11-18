import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GradeManagement from '../GradeManagement.vue'

describe('GradeManagement', () => {
  let wrapper: any

  beforeEach(() => {
    localStorage.clear()
    const students = [{ dni: '12345678', name: 'Juan', lastName: 'Pérez' }]
    const subjects = [{ id: '1', name: 'Matemáticas' }]
    localStorage.setItem('students', JSON.stringify(students))
    localStorage.setItem('subjects', JSON.stringify(subjects))
    wrapper = mount(GradeManagement)
  })

  it('adds a new grade', async () => {
    await wrapper.find('#studentSelect').setValue('12345678')
    await wrapper.find('#subjectSelect').setValue('1')
    await wrapper.find('#gradeValue').setValue(15)
    await wrapper.find('form').trigger('submit.prevent')

    const storedGrades = JSON.parse(localStorage.getItem('grades') || '[]')
    expect(storedGrades).toHaveLength(1)
    expect(storedGrades[0].value).toBe(15)
  })

  it('lists grades for a student', async () => {
    const grades = [
      { id: '1', studentId: '12345678', subjectId: '1', value: 15 },
      { id: '2', studentId: '12345678', subjectId: '1', value: 18 },
    ]
    localStorage.setItem('grades', JSON.stringify(grades))

    await wrapper.vm.$nextTick()

    const gradeRows = wrapper.findAll('tbody tr')
    expect(gradeRows).toHaveLength(2)
    expect(gradeRows[0].findAll('td')[1].text()).toBe('15')
    expect(gradeRows[1].findAll('td')[1].text()).toBe('18')
  })

  it('updates a grade', async () => {
    const grades = [{ id: '1', studentId: '12345678', subjectId: '1', value: 15 }]
    localStorage.setItem('grades', JSON.stringify(grades))

    await wrapper.vm.$nextTick()
    await wrapper.find('button:contains("Editar")').trigger('click')
    await wrapper.find('#editGradeValue').setValue(18)
    await wrapper.find('form:contains("Guardar Cambios")').trigger('submit.prevent')

    const storedGrades = JSON.parse(localStorage.getItem('grades') || '[]')
    expect(storedGrades[0].value).toBe(18)
  })

  it('deletes a grade', async () => {
    const grades = [{ id: '1', studentId: '12345678', subjectId: '1', value: 15 }]
    localStorage.setItem('grades', JSON.stringify(grades))

    await wrapper.vm.$nextTick()
    await wrapper.find('button:contains("Eliminar")').trigger('click')

    const storedGrades = JSON.parse(localStorage.getItem('grades') || '[]')
    expect(storedGrades).toHaveLength(0)
  })

  it('calculates average grade for a student', async () => {
    const grades = [
      { id: '1', studentId: '12345678', subjectId: '1', value: 15 },
      { id: '2', studentId: '12345678', subjectId: '1', value: 18 },
    ]
    localStorage.setItem('grades', JSON.stringify(grades))

    await wrapper.vm.$nextTick()

    const averageText = wrapper.find('p:contains("Promedio:")').text()
    expect(averageText).toContain('16.50')
  })

  it('validates grade input range', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await wrapper.find('#studentSelect').setValue('12345678')
    await wrapper.find('#subjectSelect').setValue('1')
    await wrapper.find('#gradeValue').setValue(25)
    await wrapper.find('form').trigger('submit.prevent')

    expect(consoleWarnSpy).toHaveBeenCalledWith('La nota debe estar entre 0 y 20')

    const storedGrades = JSON.parse(localStorage.getItem('grades') || '[]')
    expect(storedGrades).toHaveLength(0)

    consoleWarnSpy.mockRestore()
  })
})
