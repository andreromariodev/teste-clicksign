- Este projeto foi desenvolvido como teste para a vaga de Desenvolvedor Front-end Sênior na Clicksign.
- Autor: André Romá## 📋 Campos do Projeto

### Estrutura dos Dados
- **Nome do projeto** (obrigatório) - String, máximo 200 caracteres
- **Cliente** (obrigatório) - String, máximo 200 caracteres
- **Data de Início** (obrigatório) - Date (formato ISO 8601)
- **Data Final** (obrigatório) - Date (formato ISO 8601, deve ser posterior à data de início)
- **Capa do projeto** (opcional) - Imagem (JPG, PNG, máximo 5MB)
- **Favorito** (opcional) - Boolean (padrão: false)

### Exemplo de Estrutura JSON
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Sistema de Gestão Empresarial",
  "client": "Empresa Alpha Ltda",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-06-30T00:00:00.000Z",
  "coverImage": "cover-1234567890-123456789.jpg",
  "isFavorite": false,
  "createdAt": "2024-01-10T10:30:00.000Z",
  "updatedAt": "2024-01-10T10:30:00.000Z"
}
```

### Validações
- **Nome**: Obrigatório, não pode estar vazio
- **Cliente**: Obrigatório, não pode estar vazio
- **Data de Início**: Obrigatória, deve ser uma data válida
- **Data Final**: Obrigatória, deve ser posterior à data de início
- **Capa**: Opcional, formatos aceitos: JPG, PNG, máximo 5MB
- **Favorito**: Opcional, padrão é falsertfólio: http://andreromariodev.github.io/
- LinkedIn: https://www.linkedin.com/in/andre-romario-dev/

# Gerenciador de Projetos

Sistema completo para gerenciamento de projetos com Vue 3 + TypeScript no frontend e Node.js + Express + MongoDB no backend.

## 📋 Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado:

- **Node.js 18+** (recomendado Node.js 22+)
- **MongoDB** (instalado e configurado)
- **npm** (ou yarn)
- **Git** (para clonar o repositório)

### Instalação do MongoDB

#### Ubuntu/Debian:
```bash
# Importar chave pública do MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Adicionar repositório MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Atualizar pacotes e instalar MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar se está rodando
sudo systemctl status mongod
```

#### macOS:
```bash
# Usando Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Windows:
- Baixe o instalador do MongoDB Community Server em: https://www.mongodb.com/try/download/community
- Siga as instruções de instalação
- Inicie o serviço MongoDB

## 🚀 Início Rápido

### Automação Completa
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd teste-clicksign

# Tornar scripts executáveis
chmod +x start.sh stop.sh dev.sh

# Iniciar o projeto (backend + frontend)
./start.sh

# Parar todos os serviços
./stop.sh

# Utilitários de desenvolvimento
./dev.sh help
```

### Comandos de Desenvolvimento
```bash
# Verificar status dos serviços
./dev.sh status

# Iniciar apenas o backend
./dev.sh backend

# Iniciar apenas o frontend
./dev.sh frontend

# Acompanhar logs em tempo real
./dev.sh logs

# Limpar e reinstalar dependências
./dev.sh clean

# Build de produção
./dev.sh build

# Reiniciar serviços
./dev.sh restart
```

## 📋 Funcionalidades

### Backend (Node.js + Express + TypeScript + MongoDB)
- ✅ API REST completa para CRUD de projetos
- ✅ Banco de dados MongoDB com Mongoose
- ✅ Upload de imagens para capa dos projetos
- ✅ Sistema de filtros, busca e ordenação
- ✅ Estrutura modular (controllers, services, models)
- ✅ Validação de dados e tratamento de erros
- ✅ Suporte a CORS para desenvolvimento
- ✅ Seed automático de dados iniciais

### Frontend (Vue 3 + TypeScript + CSS Modules)
- ✅ Interface responsiva para listagem de projetos
- ✅ Formulários de criação e edição de projetos
- ✅ Sistema de favoritos com toggle
- ✅ Busca com histórico (últimas 5 buscas)
- ✅ Highlight nos resultados de busca
- ✅ Modal de confirmação para exclusão
- ✅ Upload de imagens com preview
- ✅ CSS Modules para estilização

## � Campos do Projeto

- **Nome do projeto** (obrigatório)
- **Cliente** (obrigatório)
- **Data de Início** (obrigatório)
- **Data Final** (obrigatório)
- **Capa do projeto** (imagem, opcional)
- **Favorito** (boolean)

## 🛠️ Tecnologias e Dependências

### Backend
- **Node.js** 18+ (testado com Node 22+)
- **Express** 4.19.2 (framework web)
- **TypeScript** 5.8.3 (tipagem estática)
- **MongoDB** + **Mongoose** 8.16.4 (banco de dados)
- **tsx** 4.20.3 (execução TypeScript em desenvolvimento)
- **multer** 2.0.1 (upload de arquivos)
- **cors** 2.8.5 (Cross-Origin Resource Sharing)
- **dotenv** 17.2.0 (variáveis de ambiente)
- **uuid** 11.1.0 (geração de IDs únicos)

### Frontend
- **Vue 3** 3.5.17 (framework frontend com Composition API)
- **TypeScript** 5.8.0 (tipagem estática)
- **Vue Router** 4.5.1 (roteamento SPA)
- **Vite** 7.0.0 (build tool e dev server)
- **axios** 1.10.0 (cliente HTTP)
- **CSS Modules** (estilização modular)
- **ESLint** + **Prettier** (qualidade e formatação de código)

### DevDependencies Principais
- **@types/*** (tipagens TypeScript)
- **nodemon** 3.1.10 (hot reload backend)
- **vite-plugin-vue-devtools** (ferramentas de desenvolvimento Vue)
- **npm-run-all2** (execução paralela de scripts)

## 📁 Estrutura do Projeto

```
teste-clicksign/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── models/          # Interfaces e tipos
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio
│   │   └── app.ts           # Configuração do Express
│   ├── uploads/             # Arquivos enviados
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes Vue
│   │   ├── composables/     # Composables do Vue
│   │   ├── services/        # Serviços HTTP
│   │   ├── types/           # Definições de tipos
│   │   └── views/           # Páginas da aplicação
│   └── package.json
├── start.sh                 # Script de inicialização
├── stop.sh                  # Script para parar serviços
├── dev.sh                   # Utilitários de desenvolvimento
└── README.md
```

## � Funcionalidades Implementadas

### Listagem e Navegação
- ✅ Listagem com paginação (10 itens por página)
- ✅ Filtro por projetos favoritos
- ✅ Ordenação por nome, data início ou data fim
- ✅ Navegação entre páginas

### Busca e Filtros
- ✅ Busca por texto (mínimo 3 caracteres)
- ✅ Histórico de buscas (últimas 5)
- ✅ Highlight nos resultados de busca
- ✅ Filtros combinados (busca + favoritos)

### Gerenciamento de Projetos
- ✅ Criação de novos projetos
- ✅ Edição de projetos existentes
- ✅ Exclusão com confirmação
- ✅ Upload de imagens para capa
- ✅ Toggle de favoritos

### Interface e UX
- ✅ Design responsivo
- ✅ Feedback visual para ações
- ✅ Validação de formulários
- ✅ Loading states
- ✅ Tratamento de erros

## 🌐 Endpoints da API

### Projetos
- `GET /api/projects` - Listar projetos (com filtros)
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Obter projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Upload
- `POST /api/upload` - Upload de imagem

### Utilitários
- `GET /health` - Health check
- `GET /uploads/:filename` - Servir arquivos

## 🔍 Parâmetros de Consulta

### Filtros
- `?search=texto` - Busca por texto
- `?favorites=true` - Apenas favoritos
- `?sortBy=name|startDate|endDate` - Ordenação
- `?page=1&limit=10` - Paginação

### Exemplo
```
GET /api/projects?search=projeto&favorites=true&sortBy=name&page=1&limit=10
```

## 💻 Desenvolvimento

### Instalação e Configuração

#### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd teste-clicksign
```

#### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` no diretório `backend/`:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gerenciador-projetos
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

#### 3. Instalar Dependências

##### Automática (Recomendado):
```bash
./dev.sh install
```

##### Manual:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Execução do Projeto

#### Automática (Recomendado):
```bash
# Iniciar tudo
./start.sh

# Ou usar utilitários de desenvolvimento
./dev.sh start
```

#### Manual:
```bash
# Terminal 1: Backend (porta 3001)
cd backend
npm run dev

# Terminal 2: Frontend (porta 5173)
cd frontend
npm run dev
```

### URLs de Acesso
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Uploads**: http://localhost:3001/uploads/[filename]

## � Alimentando a Base de Dados

### Gerar Projetos de Teste
Para facilitar o desenvolvimento e testes, o projeto inclui um script para gerar projetos de exemplo:

```bash
# Gerar 50 projetos de teste automaticamente
./generate-test-projects.sh

# Ou executar manualmente
cd backend
npx ts-node src/scripts/generate-projects.ts
```

**O que é criado:**
- 50 projetos com nomes variados (sistemas, apps, portais)
- Clientes fictícios diversificados
- Datas de início e fim aleatórias (2023-2025)
- 30% dos projetos marcados como favoritos
- Dados realistas para testar filtros e buscas

### Adicionar Projetos Manualmente
Você pode adicionar projetos através da interface web ou diretamente via API:

#### Via Interface Web:
1. Acesse: http://localhost:5173
2. Clique no botão "Novo Projeto"
3. Preencha os campos obrigatórios:
   - Nome do projeto
   - Cliente
   - Data de início
   - Data final
4. Opcionalmente:
   - Faça upload de uma imagem de capa
   - Marque como favorito
5. Clique em "Salvar"

#### Via API (curl):
```bash
# Criar um novo projeto
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Novo Projeto",
    "client": "Cliente Exemplo",
    "startDate": "2024-01-15",
    "endDate": "2024-06-30",
    "isFavorite": false
  }'

# Com upload de imagem
curl -X POST http://localhost:3001/api/projects \
  -F "name=Projeto com Imagem" \
  -F "client=Cliente ABC" \
  -F "startDate=2024-01-01" \
  -F "endDate=2024-12-31" \
  -F "isFavorite=true" \
  -F "coverImage=@/caminho/para/imagem.jpg"
```

### Limpar Base de Dados
Para remover todos os projetos e começar do zero:

```bash
# Via MongoDB shell
mongosh gerenciador-projetos --eval "db.projects.deleteMany({})"

# Ou via script (se disponível)
cd backend
npx ts-node -e "
import { ProjectModel } from './src/models/ProjectModel';
import connectDB from './src/config/database';
connectDB().then(() => {
  ProjectModel.deleteMany({}).then(() => {
    console.log('Base limpa!');
    process.exit(0);
  });
});
"
```

## �🔧 Scripts Disponíveis

### Scripts de Automação
- `./start.sh` - Inicia projeto completo (MongoDB + Backend + Frontend)
- `./stop.sh` - Para todos os serviços
- `./dev.sh [comando]` - Utilitários de desenvolvimento
- `./generate-test-projects.sh` - Gera 50 projetos de teste

### Verificar Dados na Base
Para verificar se há projetos na base de dados:

```bash
# Via API (quantidade total)
curl http://localhost:3001/api/projects | jq '.pagination.total'

# Via MongoDB shell (contar projetos)
mongosh gerenciador-projetos --eval "db.projects.countDocuments()"

# Listar alguns projetos
mongosh gerenciador-projetos --eval "db.projects.find().limit(5).pretty()"

# Via API (primeiros 5 projetos)
curl "http://localhost:3001/api/projects?limit=5" | jq '.projects[].name'
```

### Comandos do dev.sh
- `./dev.sh start` - Inicia backend e frontend
- `./dev.sh stop` - Para todos os serviços
- `./dev.sh restart` - Reinicia todos os serviços
- `./dev.sh backend` - Inicia apenas o backend
- `./dev.sh frontend` - Inicia apenas o frontend
- `./dev.sh logs` - Mostra logs em tempo real
- `./dev.sh clean` - Limpa node_modules e reinstala dependências
- `./dev.sh build` - Build de produção
- `./dev.sh status` - Mostra status dos serviços
- `./dev.sh install` - Instala/atualiza dependências

### Backend (package.json)
- `npm run dev` - Desenvolvimento com hot reload (tsx watch)
- `npm run build` - Build TypeScript para produção
- `npm start` - Executa versão compilada

### Frontend (package.json)
- `npm run dev` - Servidor de desenvolvimento Vite
- `npm run build` - Build para produção (Vue + Vite)
- `npm run preview` - Preview da build de produção
- `npm run type-check` - Verificação de tipos TypeScript
- `npm run lint` - ESLint com correção automática
- `npm run format` - Formatação com Prettier

## 📝 Notas de Desenvolvimento

- **Dados persistidos no MongoDB** (banco de dados real)
- Uploads salvos na pasta `backend/uploads/`
- **CSS Modules** usado para estilização (não Tailwind)
- Estrutura modular e escalável
- Tratamento de erros consistente
- Validação de dados no backend e frontend
- Seed automático de projetos exemplo
- Histórico de busca salvo no banco MongoDB
- Índices otimizados para performance de busca
- Hot reload habilitado em desenvolvimento
- Build otimizado para produção

## 🐛 Solução de Problemas

### Problemas Comuns

#### MongoDB não conecta
```bash
# Verificar status
sudo systemctl status mongod

# Iniciar se necessário
sudo systemctl start mongod

# Habilitar inicialização automática
sudo systemctl enable mongod
```

#### Porta já está em uso
```bash
# Parar todos os serviços
./dev.sh stop

# Ou usar stop.sh
./stop.sh

# Verificar processos nas portas
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
```

#### Erro de dependências
```bash
# Limpeza completa e reinstalação
./dev.sh clean

# Ou manualmente
rm -rf backend/node_modules frontend/node_modules
rm -f backend/package-lock.json frontend/package-lock.json
cd backend && npm install
cd ../frontend && npm install
```

#### Build falha
```bash
# Verificar tipos TypeScript
cd frontend && npm run type-check
cd backend && npm run build

# Verificar lint
cd frontend && npm run lint
```

### Comandos de Diagnóstico
```bash
# Status completo dos serviços
./dev.sh status

# Logs em tempo real
./dev.sh logs

# Verificar saúde da API
curl http://localhost:3001/health

# Verificar MongoDB
mongosh --eval "db.adminCommand('ismaster')"
```

## 🚀 Build e Deploy

### Build de Produção
```bash
# Automático
./dev.sh build

# Manual
cd backend && npm run build
cd frontend && npm run build
```

### Estrutura após Build
```
backend/dist/          # JavaScript compilado
frontend/dist/         # Assets estáticos otimizados
```

## 🎯 Roadmap e Melhorias

### Implementado ✅
- [x] CRUD completo de projetos
- [x] Sistema de favoritos
- [x] Upload de imagens
- [x] Busca com histórico
- [x] Paginação
- [x] Filtros e ordenação
- [x] Persistência MongoDB
- [x] CSS Modules
- [x] TypeScript completo
- [x] Scripts de automação
- [x] Tratamento de erros

---

✨ **Gerenciador de Projetos**  
**Stack**: Vue 3 + TypeScript + Node.js + Express + MongoDB  
**Arquitetura**: Modular, Escalável, Full TypeScript
