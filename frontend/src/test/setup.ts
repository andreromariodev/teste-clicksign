import { vi, afterEach } from 'vitest'
import { config } from '@vue/test-utils'

// Mock do fetch global
global.fetch = vi.fn()

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  },
  writable: true,
})

// Mock do console para testes mais limpos
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do URL constructor (problema com axios no ambiente de teste)
if (typeof URL === 'undefined') {
  // @ts-ignore
  global.URL = class URL {
    constructor(url: string, base?: string) {
      this.href = url
      this.origin = base || 'http://localhost:3000'
      this.protocol = 'http:'
      this.host = 'localhost:3000'
      this.hostname = 'localhost'
      this.port = '3000'
      this.pathname = '/'
      this.search = ''
      this.hash = ''
    }

    href: string
    origin: string
    protocol: string
    host: string
    hostname: string
    port: string
    pathname: string
    search: string
    hash: string

    static createObjectURL = vi.fn(() => 'blob:mock-url')
    static revokeObjectURL = vi.fn()
  }
} else {
  // Mock das funções de URL
  URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  URL.revokeObjectURL = vi.fn()
}

// Mock do FileReader
// @ts-ignore
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  result: '',
  onload: null,
  onerror: null,
}))

// Mock de APIs de imagem
// @ts-ignore
global.Image = vi.fn().mockImplementation(() => ({
  onload: null,
  onerror: null,
  src: '',
  alt: '',
  width: 0,
  height: 0,
}))

// Mock das funções de data para testes determinísticos
// @ts-ignore
Date.prototype.toLocaleDateString = vi.fn().mockImplementation(function(this: Date, locale?: string, options?: any) {
  if (locale === 'pt-BR') {
    // Formato brasileiro: DD/MM/YYYY
    const day = this.getDate().toString().padStart(2, '0')
    const month = (this.getMonth() + 1).toString().padStart(2, '0')
    const year = this.getFullYear().toString()
    return `${day}/${month}/${year}`
  }
  return this.toLocaleDateString(locale, options)
})

// Mock do Vue Test Utils
config.global.mocks = {
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  },
  $route: {
    path: '/',
    name: 'Home',
    params: {},
    query: {}
  }
}

// Mock básico para CSS Modules
config.global.stubs = {
  'router-link': {
    template: '<a><slot /></a>',
    props: ['to']
  }
}

// Cleanup após cada teste
afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})
