# 📚 API Documentation - Gerenciador de Projetos

Esta API foi desenvolvida para gerenciar projetos com funcionalidades como upload de imagens, filtros, busca e favoritos.

## 🚀 Acesso à Documentação

### Swagger UI
A documentação interativa da API está disponível em:
- **URL**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **Formato**: Interface web interativa do Swagger UI

### Endpoints Disponíveis

#### 📂 Projetos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/projects` | Lista todos os projetos com filtros e paginação |
| `GET` | `/api/projects/{id}` | Busca um projeto específico por ID |
| `POST` | `/api/projects` | Cria um novo projeto |
| `PUT` | `/api/projects/{id}` | Atualiza um projeto existente |
| `DELETE` | `/api/projects/{id}` | Remove um projeto |
| `PATCH` | `/api/projects/{id}/favorite` | Alterna status de favorito |

#### 📈 Histórico

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/projects/search-history` | Obtém histórico de buscas |

## 🔧 Parâmetros de Consulta

### Listagem de Projetos (`GET /api/projects`)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Termo de busca para filtrar por nome ou cliente |
| `onlyFavorites` | boolean | Filtrar apenas projetos favoritos |
| `sortBy` | string | Campo para ordenação (`name`, `startDate`, `endDate`) |
| `sortOrder` | string | Ordem de classificação (`asc`, `desc`) |
| `page` | integer | Número da página (padrão: 1) |
| `limit` | integer | Itens por página (padrão: 10, máximo: 100) |

### Exemplo de Requisição
```bash
GET /api/projects?search=website&onlyFavorites=false&sortBy=name&sortOrder=asc&page=1&limit=12
```

## 📤 Upload de Arquivos

### Criação/Atualização de Projetos
- **Formato**: `multipart/form-data`
- **Campo**: `coverImage`
- **Tipos aceitos**: Imagens (jpg, jpeg, png, gif, webp)
- **Tamanho máximo**: 5MB

### Exemplo de Requisição (cURL)
```bash
curl -X POST http://localhost:3001/api/projects \
  -F "name=Meu Projeto" \
  -F "client=Cliente XYZ" \
  -F "startDate=2024-01-15" \
  -F "endDate=2024-03-15" \
  -F "coverImage=@/path/to/image.jpg"
```

## 📋 Estrutura de Dados

### Projeto
```json
{
  "id": "string",
  "name": "string",
  "client": "string",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15",
  "coverImage": "/uploads/cover-123456789.jpg",
  "isFavorite": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Resposta Paginada
```json
{
  "data": [/* array de projetos */],
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

## 🔌 Status Codes

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Recurso criado |
| `204` | Sucesso sem conteúdo |
| `400` | Requisição inválida |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

## 🛠️ Testando a API

### 1. Via Swagger UI
- Acesse [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- Use a interface interativa para testar os endpoints
- Todos os parâmetros e respostas são documentados

### 2. Via cURL
```bash
# Listar projetos
curl -X GET "http://localhost:3001/api/projects"

# Buscar projeto específico
curl -X GET "http://localhost:3001/api/projects/{id}"

# Criar projeto
curl -X POST "http://localhost:3001/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Projeto",
    "client": "Cliente ABC",
    "startDate": "2024-01-15",
    "endDate": "2024-03-15"
  }'
```

### 3. Via Postman
- Importe a documentação OpenAPI 3.0 do Swagger
- URL do schema: `http://localhost:3001/api-docs-json`

## 🔍 Health Check

### Verificar Status da API
```bash
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Notas Importantes

1. **Arquivos Estáticos**: Imagens são servidas em `/uploads/`
2. **CORS**: Configurado para aceitar requisições do frontend
3. **Validação**: Dados são validados antes de serem salvos
4. **Paginação**: Padrão de 10 itens por página
5. **Ordenação**: Suporte a ordenação por nome e datas

## 🐛 Debugging

### Logs
Os logs da aplicação são salvos em `logs/backend.log`

### Erros Comuns
- **413 Payload Too Large**: Arquivo muito grande (máximo 5MB)
- **400 Bad Request**: Dados obrigatórios não enviados
- **404 Not Found**: Projeto não existe
- **500 Internal Server Error**: Erro no servidor/banco

---

**Desenvolvido por**: Andre Mario  
**Última atualização**: 17 de Julho de 2025
