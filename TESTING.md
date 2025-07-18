# 🧪 Testes - Projeto ClickSign

Este documento descreve a estrutura e configuração de testes para o projeto ClickSign.

## 📋 Estrutura de Testes

### Backend (Node.js + Express + MongoDB)
- **Framework**: Jest
- **Testes Unitários**: Services e Controllers
- **Testes E2E**: APIs completas com MongoDB em memória
- **Cobertura**: Services, Controllers e Routes

### Frontend (Vue.js + TypeScript)
- **Framework**: Vitest
- **Testes Unitários**: Components, Composables e Services
- **Ambiente**: Happy-DOM (simulação de navegador)
- **Cobertura**: Components, Services e Utilitários

## 🏗️ Configuração

### Backend

```bash
cd backend
npm install
```

**Dependências de teste:**
- `jest`: Framework de testes
- `@types/jest`: Tipos para Jest
- `ts-jest`: Processador TypeScript para Jest
- `supertest`: Testes de API HTTP
- `@types/supertest`: Tipos para Supertest

**Arquivos de configuração:**
- `jest.config.js`: Configuração do Jest
- `tests/setup.ts`: Setup global dos testes

### Frontend

```bash
cd frontend
npm install
```

**Dependências de teste:**
- `vitest`: Framework de testes (similar ao Jest, otimizado para Vite)
- `@vue/test-utils`: Utilitários para testar componentes Vue
- `happy-dom`: Simulação de DOM para testes
- `@vitest/ui`: Interface gráfica para testes

**Arquivos de configuração:**
- `vitest.config.ts`: Configuração do Vitest
- `vite.config.ts`: Configuração do Vite com suporte a testes
- `src/test/setup.ts`: Setup global dos testes

## 🚀 Comandos de Teste

### Backend

```bash
# Executar todos os testes
npm test

# Executar testes unitários
npm run test:unit

# Executar testes E2E
npm run test:e2e

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm run test:watch
```

### Frontend

```bash
# Executar todos os testes
npm run test

# Executar testes uma vez
npm run test:run

# Executar com cobertura
npm run test:coverage

# Interface gráfica
npm run test:ui
```

### Script Global

```bash
# Executar todos os testes
./run-tests.sh

# Executar apenas backend
./run-tests.sh backend

# Executar apenas frontend
./run-tests.sh frontend

# Executar com cobertura
./run-tests.sh coverage

# Modo watch
./run-tests.sh watch
```

## 📁 Estrutura de Arquivos

```
backend/
├── jest.config.js
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── ProjectService.test.ts
│   │   └── ProjectController.test.ts
│   └── e2e/
│       └── projects.test.ts
└── package.json

frontend/
├── vitest.config.ts
├── vite.config.ts
├── src/
│   └── test/
│       ├── setup.ts
│       ├── helpers.ts
│       └── unit/
│           ├── basic.test.ts
│           ├── helpers.test.ts
│           ├── service-integration.test.ts
│           ├── ProjectService.test.ts
│           ├── useProjects.test.ts
│           └── ProjectCard.test.ts
└── package.json
```

## 📊 Tipos de Teste

### Backend

#### Testes Unitários
- **ProjectService**: Lógica de negócio, manipulação de dados
- **ProjectController**: Handlers de rotas, validação de entrada
- **Models**: Validação de esquemas, métodos de modelo

#### Testes E2E
- **API Routes**: Testes completos de endpoints
- **Database Integration**: Testes com MongoDB real
- **Authentication**: Testes de autenticação (se aplicável)

### Frontend

#### Testes Unitários
- **Components**: Renderização, props, events
- **Composables**: Lógica reativa, estado
- **Services**: Chamadas de API, tratamento de erros
- **Utils**: Funções auxiliares, formatação

#### Testes de Integração
- **Component Integration**: Comunicação entre componentes
- **Service Integration**: Integração com APIs
- **Router Integration**: Navegação e rotas

## 🎯 Estratégias de Teste

### Backend

1. **Testes Unitários (70%)**
   - Isolamento de dependências com mocks
   - Teste de lógica de negócio
   - Validação de entrada e saída

2. **Testes E2E (30%)**
   - Fluxos completos de API
   - Integração com banco de dados
   - Cenários de erro

### Frontend

1. **Testes Unitários (80%)**
   - Componentes isolados
   - Composables e utilitários
   - Services com mocks

2. **Testes de Integração (20%)**
   - Fluxos de usuário
   - Integração entre componentes
   - Comunicação com APIs

## 🔧 Configurações Importantes

### Backend Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/config/**',
  ],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
};
```

### Frontend Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
});
```

## 📝 Exemplos de Testes

### Backend - Teste Unitário

```typescript
describe('ProjectService', () => {
  it('deve criar um novo projeto', async () => {
    const projectData = {
      name: 'Novo Projeto',
      client: 'Cliente Teste',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };

    const result = await ProjectService.createProject(projectData);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(projectData.name);
  });
});
```

### Backend - Teste E2E

```typescript
describe('POST /api/projects', () => {
  it('deve criar um novo projeto', async () => {
    const newProject = {
      name: 'Novo Projeto',
      client: 'Cliente Teste',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };

    const response = await request(app)
      .post('/api/projects')
      .send(newProject);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newProject.name);
  });
});
```

### Frontend - Teste de Componente

```typescript
describe('ProjectCard.vue', () => {
  it('deve renderizar projeto corretamente', () => {
    const project = {
      id: '1',
      name: 'Projeto Teste',
      client: 'Cliente Teste',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };

    const wrapper = mount(ProjectCard, {
      props: { project }
    });

    expect(wrapper.text()).toContain(project.name);
    expect(wrapper.text()).toContain(project.client);
  });
});
```

## 🎨 Boas Práticas

### Gerais
- ✅ Nomes descritivos para testes
- ✅ Arrange, Act, Assert (AAA)
- ✅ Testes independentes
- ✅ Mocks apropriados
- ✅ Cleanup após testes

### Backend
- ✅ Banco de dados em memória para E2E
- ✅ Mocks de dependências externas
- ✅ Testes de validação
- ✅ Testes de erro

### Frontend
- ✅ Testes de renderização
- ✅ Testes de eventos
- ✅ Testes de props
- ✅ Testes de reatividade

## 📈 Cobertura de Testes

### Metas
- **Backend**: 80% cobertura mínima
- **Frontend**: 75% cobertura mínima

### Relatórios
- **Backend**: `backend/coverage/`
- **Frontend**: `frontend/coverage/`

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de módulo não encontrado**
   ```bash
   npm install
   ```

2. **Testes não executam**
   ```bash
   npx jest --clearCache  # Backend
   npx vitest --run       # Frontend
   ```

3. **Problemas de TypeScript**
   ```bash
   npm run build
   ```

### Debugging

```bash
# Backend
npm run test -- --verbose

# Frontend
npm run test -- --reporter=verbose
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

## 🤝 Contribuindo

1. Escreva testes para novas funcionalidades
2. Mantenha cobertura acima das metas
3. Siga as convenções de nomenclatura
4. Documente testes complexos
5. Execute testes antes de commit

---

**Nota**: Este projeto utiliza uma abordagem híbrida com Jest para backend e Vitest para frontend, aproveitando as melhores práticas de cada ecossistema.
