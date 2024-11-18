import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReportManagement from '../ReportManagement.vue'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    text: vi.fn(),
    autoTable: vi.fn(),
    save: vi.fn(),
  })),
}))

vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(),
    json_to_sheet: vi.fn(),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}))

describe('ReportManagement', () => {
  let wrapper: any

  beforeEach(() => {
    localStorage.clear()
    const students = [{ dni: '12345678', name: 'Juan', lastName: 'Pérez', birthDate: '1990-01-01' }]
    const subjects = [{ id: '1', name: 'Matemáticas' }]
    const grades = [{ id: '1', studentId: '12345678', subjectId: '1', value: 15 }]
    localStorage.setItem('students', JSON.stringify(students))
    localStorage.setItem('subjects', JSON.stringify(subjects))
    localStorage.setItem('grades', JSON.stringify(grades))
    wrapper = mount(ReportManagement)
  })

  it('generates a student report', async () => {
    await wrapper.find('select').setValue('12345678')
    await wrapper.find('button:contains("Generar Reporte")').trigger('click')

    expect(jsPDF).toHaveBeenCalled()
    const pdfInstance = jsPDF.mock.results[0].value
    expect(pdfInstance.text).toHaveBeenCalledWith('Reporte de Juan Pérez', 14, 15)
    expect(pdfInstance.autoTable).toHaveBeenCalled()
    expect(pdfInstance.save).toHaveBeenCalledWith('reporte_Juan_Pérez.pdf')
  })

  it('generates a general report', async () => {
    await wrapper.find('button:contains("Generar Reporte General")').trigger('click')

    expect(XLSX.utils.book_new).toHaveBeenCalled()
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalled()
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
    expect(XLSX.writeFile).toHaveBeenCalledWith(expect.anything(), 'reporte_general.xlsx')
  })
})
