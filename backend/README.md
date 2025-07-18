# 🖥️ Backend - Gerenciador de Projetos

Backend da aplicação de gerenciamento de projetos desenvolvido em Node.js com TypeScript, Express e MongoDB.

## 🚀 Funcionalidades

- ✅ **CRUD completo** de projetos
- 📁 **Upload de imagens** para capa dos projetos
- 🔍 **Busca e filtros** avançados
- ⭐ **Sistema de favoritos**
- 📄 **Paginação** de resultados
- 📚 **Documentação automática** com Swagger
- 🔄 **Ordenação** por nome e datas
- 📈 **Histórico de buscas**

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **Multer** - Upload de arquivos
- **Swagger** - Documentação da API
- **CORS** - Controle de acesso
- **dotenv** - Variáveis de ambiente

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do backend:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gerenciador-projetos
```

### Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Configuração do MongoDB
│   │   └── swagger.ts       # Configuração do Swagger
│   ├── controllers/
│   │   └── ProjectController.ts
│   ├── models/
│   │   ├── Project.ts       # Interfaces e DTOs
│   │   ├── ProjectModel.ts  # Schema do Mongoose
│   │   └── SearchHistoryModel.ts
│   ├── routes/
│   │   └── projectRoutes.ts
│   ├── services/
│   │   └── ProjectService.ts
│   └── index.ts
├── uploads/                 # Arquivos enviados
├── logs/                    # Logs da aplicação
├── dist/                    # Build compilado
└── package.json
```

## 📚 Documentação da API

### Swagger UI
- **URL**: http://localhost:3001/api-docs
- **JSON**: http://localhost:3001/api-docs-json

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/projects` | Lista projetos com filtros |
| GET | `/api/projects/:id` | Busca projeto por ID |
| POST | `/api/projects` | Cria novo projeto |
| PUT | `/api/projects/:id` | Atualiza projeto |
| DELETE | `/api/projects/:id` | Remove projeto |
| PATCH | `/api/projects/:id/favorite` | Alterna favorito |

## 🧪 Testes

### Testar API manualmente
```bash
# Usar script de teste
npm run test-api

# Ou executar diretamente
./test-api.sh
```

### Health Check
```bash
curl http://localhost:3001/health
```

## 📁 Upload de Arquivos

- **Pasta**: `uploads/`
- **Tipos aceitos**: Imagens (jpg, jpeg, png, gif, webp)
- **Tamanho máximo**: 5MB
- **Nomeação**: `coverImage-{timestamp}-{random}.{ext}`

## 🔍 Filtros e Busca

### Parâmetros de Query
- `search` - Busca por nome ou cliente
- `onlyFavorites` - Apenas favoritos (true/false)
- `sortBy` - Campo para ordenação (name, startDate, endDate)
- `sortOrder` - Ordem (asc/desc)
- `page` - Número da página
- `limit` - Itens por página (máximo 100)

### Exemplo
```
GET /api/projects?search=website&onlyFavorites=false&sortBy=name&page=1&limit=12
```

## 📊 Logs

- **Arquivo**: `logs/backend.log`
- **Formato**: Timestamp + nível + mensagem
- **Rotação**: Automática por tamanho

```bash
# Acompanhar logs em tempo real
tail -f logs/backend.log
```

## 🔒 Segurança

- **CORS** configurado para frontend
- **Validação** de dados de entrada
- **Sanitização** de arquivos enviados
- **Limitação** de tamanho de arquivo
- **Tratamento** de erros

## 🚀 Deploy

### Build
```bash
npm run build
```

### Produção
```bash
NODE_ENV=production npm start
```

### Docker (exemplo)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🐛 Debugging

### Logs de Erro
```bash
# Ver logs específicos
grep "ERROR" logs/backend.log

# Últimos erros
tail -100 logs/backend.log | grep "ERROR"
```

### Problemas Comuns

1. **Erro de conexão MongoDB**
   - Verificar se MongoDB está rodando
   - Checar string de conexão no `.env`

2. **Erro de upload**
   - Verificar permissões da pasta `uploads/`
   - Conferir tamanho do arquivo (máximo 5MB)

3. **Erro de compilação**
   - Verificar tipos TypeScript
   - Executar `npm run build`

## 📝 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento com hot-reload
npm run build      # Build para produção
npm start          # Executar produção
npm run test-api   # Testar endpoints da API
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido por**: Andre Romário  
**Última atualização**: 17 de Julho de 2025
