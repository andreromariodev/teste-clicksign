# Gerenciador de Projetos

Sistema completo para gerenciamento de projetos com Vue 3 + TypeScript no frontend e Node.js + Express no backend.

## 🚀 Início Rápido

### Automação Completa
```bash
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

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js 18+
- Express 4.19.2
- TypeScript
- **MongoDB + Mongoose** (banco de dados)
- tsx (execução TypeScript)
- multer (upload de arquivos)
- cors (CORS)
- dotenv (variáveis de ambiente)

### Frontend
- Vue 3 (Composition API)
- TypeScript
- Vue Router
- Vite
- axios (HTTP client)
- CSS Modules

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

### Pré-requisitos
- Node.js 18+
- **MongoDB** (instalado e rodando)
- npm ou yarn

### Configuração do Banco de Dados
```bash
# Iniciar MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Verificar status
sudo systemctl status mongod

# Habilitar inicialização automática
sudo systemctl enable mongod
```

### Variáveis de Ambiente
Crie um arquivo `.env` no diretório `backend/`:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gerenciador-projetos
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Instalação Manual
```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### Execução Manual
```bash
# Iniciar backend (porta 3001)
cd backend
npm run dev

# Em outro terminal, iniciar frontend (porta 5173)
cd frontend
npm run dev
```

### Build de Produção
```bash
# Usar script automatizado
./dev.sh build

# Ou manualmente:
cd backend && npm run build
cd frontend && npm run build
```

## 📝 Notas de Desenvolvimento

- **Dados persistidos no MongoDB** (banco real)
- Uploads salvos na pasta `backend/uploads/`
- CSS Modules usado em vez de Tailwind
- Estrutura modular e escalável
- Tratamento de erros consistente
- Validação de dados no backend e banco
- Seed automático de 5 projetos exemplo
- Histórico de busca salvo no banco
- Índices otimizados para performance

## 🎯 Próximos Passos

- [x] ~~Implementar banco de dados~~ ✅ **MongoDB configurado**
- [ ] Adicionar testes unitários
- [ ] Sistema de autenticação
- [ ] Deploy automatizado
- [ ] Documentação da API (Swagger)
- [ ] Logs estruturados
- [ ] Monitoramento de performance
- [ ] Backup automático do banco

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o status: `./dev.sh status`
2. Veja os logs: `./dev.sh logs`
3. Reinicie os serviços: `./dev.sh restart`
4. Limpe e reinstale: `./dev.sh clean`

### Problemas Comuns
- **MongoDB não conecta**: Verifique se está rodando com `sudo systemctl status mongod`
- **Porta 3001 ocupada**: Use `./dev.sh stop` para parar todos os serviços
- **Erro de dependências**: Execute `./dev.sh clean` para reinstalar tudo

---

✨ **Projeto criado com Vue 3 + TypeScript + Node.js + Express + MongoDB**

🎉 **Agora com persistência real de dados no MongoDB!**
- **Pagination** - Paginação da listagem  
- **ConfirmModal** - Modal de confirmação para exclusões
- **AppLayout** - Layout base da aplicação

## 🎯 Próximos Passos

### Possíveis Melhorias
- [ ] Persistência em banco de dados (atualmente em memória)
- [ ] Autenticação e autorização
- [ ] Testes unitários e e2e
- [ ] Cache de requisições
- [ ] Otimização de imagens
- [ ] PWA (Progressive Web App)
- [ ] Docker para containerização
- [ ] Deploy automatizado

## 🔧 Scripts Disponíveis

### Backend
- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm start` - Executa versão de produção

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build
- `npm run lint` - Executa ESLint
- `npm run format` - Formata código com Prettier

## 📝 Notas

- O projeto usa **CSS Modules** conforme solicitado (não Tailwind)
- As imagens são salvas na pasta `backend/uploads/`
- O histórico de busca é mantido em memória (reinicia ao reiniciar o servidor)
- Dados de exemplo são criados automaticamente na inicialização
- A validação é feita tanto no frontend quanto no backend

## 🐛 Problemas Conhecidos

- Dados são perdidos ao reiniciar o servidor (não há persistência)
- Upload de imagens não tem redimensionamento automático
- Busca é case-insensitive mas não aceita acentos ou caracteres especiais
