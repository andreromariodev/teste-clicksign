import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '../../components/project/ProjectCard.vue'
import { mockProjects } from '../helpers'

// Mock do composable useFormatting
vi.mock('../../composables/useFormatting', () => ({
  useFormatting: () => ({
    formatDate: vi.fn((date: string) => {
      return '01/01/2024' // Mock simples para evitar problemas de timezone
    }),
    highlightText: vi.fn((text: string, searchTerm: string) => text),
    getDaysUntilDeadline: vi.fn(() => 30),
    isOverdue: vi.fn(() => false),
    isNearDeadline: vi.fn(() => false)
  })
}))

describe('ProjectCard.vue', () => {
  let wrapper: any

  beforeEach(() => {
    // Mock das funções globais
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('deve renderizar projeto com todos os dados', () => {
    const project = mockProjects[0]

    wrapper = mount(ProjectCard, {
      props: {
        project
      }
    })

    // Verifica se o componente foi renderizado
    expect(wrapper.exists()).toBe(true)

    // Verifica se contém o nome do projeto
    expect(wrapper.text()).toContain(project.name)

    // Verifica se contém o nome do cliente
    expect(wrapper.text()).toContain(project.client)
  })

  it('deve renderizar projeto sem imagem de capa', () => {
    const project = { ...mockProjects[0], coverImage: undefined }

    wrapper = mount(ProjectCard, {
      props: {
        project
      }
    })

    // Verifica se não tem imagem de capa
    expect(wrapper.find('img').exists()).toBe(false)

    // Verifica se tem placeholder (svg)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('deve renderizar projeto com imagem de capa', () => {
    const project = { ...mockProjects[1], coverImage: 'test-image.jpg' }

    wrapper = mount(ProjectCard, {
      props: {
        project
      }
    })

    // Verifica se tem imagem de capa
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('deve ter um botão de favorito', () => {
    const project = mockProjects[0]

    wrapper = mount(ProjectCard, {
      props: {
        project
      }
    })

    // Verifica se o botão existe
    const favoriteBtn = wrapper.find('button')
    expect(favoriteBtn.exists()).toBe(true)
  })

  it('deve ter elementos básicos', () => {
    const project = mockProjects[0]

    wrapper = mount(ProjectCard, {
      props: {
        project
      }
    })

    // Verifica se tem elementos básicos
    expect(wrapper.find('h3').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
  })
})
