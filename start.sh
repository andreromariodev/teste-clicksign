#!/bin/bash

# Script para iniciar o projeto completo (Backend + Frontend)
# Gerenciador de Projetos - Vue 3 + Node.js + MongoDB

echo "🚀 Iniciando Gerenciador de Projetos..."
echo "=================================="

# Verificar se MongoDB está rodando
echo "🔧 Verificando MongoDB..."
if ! systemctl is-active --quiet mongod; then
    echo "🔄 Iniciando MongoDB..."
    sudo systemctl start mongod
    sleep 3
    
    if systemctl is-active --quiet mongod; then
        echo "✅ MongoDB iniciado com sucesso"
    else
        echo "❌ Falha ao iniciar MongoDB"
        exit 1
    fi
else
    echo "✅ MongoDB já está rodando"
fi

# Função para verificar se uma porta está em uso
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo "⚠️  Porta $port já está em uso"
        return 1
    fi
    return 0
}

# Função para parar processos existentes
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    
    # Mata processos nas portas específicas
    if lsof -i :3001 > /dev/null 2>&1; then
        echo "   Parando backend (porta 3001)..."
        lsof -ti :3001 | xargs kill -9 2>/dev/null || true
    fi
    
    if lsof -i :5173 > /dev/null 2>&1; then
        echo "   Parando frontend (porta 5173)..."
        lsof -ti :5173 | xargs kill -9 2>/dev/null || true
    fi
    
    if lsof -i :5174 > /dev/null 2>&1; then
        echo "   Parando frontend (porta 5174)..."
        lsof -ti :5174 | xargs kill -9 2>/dev/null || true
    fi
    
    echo "✅ Serviços parados"
    exit 0
}

# Captura Ctrl+C para fazer cleanup
trap cleanup SIGINT SIGTERM

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm"
    exit 1
fi

echo "📦 Verificando dependências..."

# Verificar se as pastas existem
if [ ! -d "backend" ]; then
    echo "❌ Pasta 'backend' não encontrada"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "❌ Pasta 'frontend' não encontrada"
    exit 1
fi

# Instalar dependências do backend se necessário
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
fi

# Instalar dependências do frontend se necessário
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "🔧 Iniciando serviços..."

# Criar logs directory se não existir
mkdir -p logs

# Iniciar backend
echo "🖥️  Iniciando Backend (Node.js + Express)..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar o backend subir
echo "   Aguardando backend inicializar..."
sleep 3

# Verificar se o backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Falha ao iniciar o backend. Verifique os logs em logs/backend.log"
    exit 1
fi

# Verificar se a API está respondendo
for i in {1..10}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend iniciado com sucesso (http://localhost:3001)"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Backend não está respondendo após 10 tentativas"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Iniciar frontend
echo "🌐 Iniciando Frontend (Vue 3 + Vite)..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Aguardar o frontend subir
echo "   Aguardando frontend inicializar..."
sleep 5

# Verificar se o frontend está rodando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Falha ao iniciar o frontend. Verifique os logs em logs/frontend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Encontrar a porta do frontend
FRONTEND_PORT=""
for port in 5173 5174 5175; do
    if lsof -i :$port > /dev/null 2>&1; then
        FRONTEND_PORT=$port
        break
    fi
done

if [ -z "$FRONTEND_PORT" ]; then
    echo "❌ Frontend não encontrado em nenhuma porta esperada"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend iniciado com sucesso (http://localhost:$FRONTEND_PORT)"

echo ""
echo "🎉 Projeto iniciado com sucesso!"
echo "=================================="
echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔌 Backend:  http://localhost:3001"
echo "🏥 Health:   http://localhost:3001/health"
echo "� API Docs: http://localhost:3001/api-docs"
echo "📋 API JSON: http://localhost:3001/api-docs-json"
echo "🔍 API Base: http://localhost:3001/api"
echo ""
echo "📝 Logs disponíveis em:"
echo "   Backend:  logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "💡 Dicas:"
echo "   • Use a documentação Swagger para testar a API"
echo "   • Importe o JSON no Postman para testes avançados"
echo "   • Monitore os logs para debugging"
echo ""
echo "⌨️  Pressione Ctrl+C para parar todos os serviços"
echo ""

# Abrir no navegador automaticamente (opcional)
if command -v xdg-open &> /dev/null; then
    echo "🌐 Abrindo no navegador..."
    xdg-open "http://localhost:$FRONTEND_PORT" &
elif command -v open &> /dev/null; then
    echo "🌐 Abrindo no navegador..."
    open "http://localhost:$FRONTEND_PORT" &
fi

# Manter o script rodando e monitorar os processos
while true; do
    # Verificar se os processos ainda estão rodando
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo ""
        echo "❌ Backend parou inesperadamente"
        kill $FRONTEND_PID 2>/dev/null
        echo "📝 Verifique os logs em logs/backend.log"
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo ""
        echo "❌ Frontend parou inesperadamente"
        kill $BACKEND_PID 2>/dev/null
        echo "📝 Verifique os logs em logs/frontend.log"
        exit 1
    fi
    
    sleep 5
done
