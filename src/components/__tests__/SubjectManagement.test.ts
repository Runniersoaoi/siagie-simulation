import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SubjectManagement from '../SubjectManagement.vue'

describe('SubjectManagement', () => {
  let wrapper: any

  beforeEach(() => {
    localStorage.clear()
    wrapper = mount(SubjectManagement)
  })

  it('adds a new subject', async () => {
    const newSubject = { name: 'Matemáticas' }

    await wrapper.find('#subjectName').setValue(newSubject.name)
    await wrapper.find('form').trigger('submit.prevent')

    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    expect(storedSubjects).toHaveLength(1)
    expect(storedSubjects[0].name).toBe(newSubject.name)
  })

  it('lists all subjects', async () => {
    const subjects = [
      { id: '1', name: 'Matemáticas' },
      { id: '2', name: 'Lenguaje' },
    ]
    localStorage.setItem('subjects', JSON.stringify(subjects))

    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(2)
    expect(listItems[0].text()).toContain('Matemáticas')
    expect(listItems[1].text()).toContain('Lenguaje')
  })

  it('updates a subject', async () => {
    const subjects = [{ id: '1', name: 'Matemáticas' }]
    localStorage.setItem('subjects', JSON.stringify(subjects))

    await wrapper.vm.$nextTick()
    await wrapper.find('button:contains("Editar")').trigger('click')
    await wrapper.find('#editSubjectName').setValue('Álgebra')
    await wrapper.find('form:contains("Guardar Cambios")').trigger('submit.prevent')

    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    expect(storedSubjects[0].name).toBe('Álgebra')
  })

  it('deletes a subject', async () => {
    const subjects = [{ id: '1', name: 'Matemáticas' }]
    localStorage.setItem('subjects', JSON.stringify(subjects))

    await wrapper.vm.$nextTick()
    await wrapper.find('button:contains("Eliminar")').trigger('click')

    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    expect(storedSubjects).toHaveLength(0)
  })
})
