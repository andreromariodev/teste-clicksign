#!/bin/bash

# 🧪 Exemplos de Uso da API - Gerenciador de Projetos
# ===================================================

BASE_URL="http://localhost:3001/api"

echo "🚀 Testando API do Gerenciador de Projetos"
echo "==========================================="

# 1. Health Check
echo "1. 🔍 Verificando status da API..."
curl -X GET "$BASE_URL/../health" \
  -H "Content-Type: application/json" \
  -w "\n\n"

# 2. Listar todos os projetos
echo "2. 📋 Listando todos os projetos..."
curl -X GET "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -w "\n\n"

# 3. Buscar projetos com filtros
echo "3. 🔍 Buscando projetos com filtros..."
curl -X GET "$BASE_URL/projects?search=website&page=1&limit=5" \
  -H "Content-Type: application/json" \
  -w "\n\n"

# 4. Criar um novo projeto
echo "4. ➕ Criando um novo projeto..."
curl -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projeto API Test",
    "client": "Cliente de Teste",
    "startDate": "2024-01-15",
    "endDate": "2024-03-15"
  }' \
  -w "\n\n"

# 5. Buscar histórico de pesquisas
echo "5. 📈 Buscando histórico de pesquisas..."
curl -X GET "$BASE_URL/projects/search-history" \
  -H "Content-Type: application/json" \
  -w "\n\n"

echo "✅ Testes concluídos!"
echo ""
echo "💡 Dicas:"
echo "   - Acesse http://localhost:3001/api-docs para documentação interativa"
echo "   - Use http://localhost:3001/api-docs-json para importar no Postman"
echo "   - Veja logs em tempo real com: tail -f logs/backend.log"
