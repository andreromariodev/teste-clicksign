#!/bin/bash

# Script para parar todos os serviços do Gerenciador de Projetos

echo "🛑 Parando Gerenciador de Projetos..."
echo "=================================="

# Função para parar processo em uma porta específica
stop_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port > /dev/null 2>&1; then
        echo "🔌 Parando $service_name (porta $port)..."
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 1
        
        if lsof -i :$port > /dev/null 2>&1; then
            echo "   ⚠️  $service_name ainda rodando, forçando parada..."
            lsof -ti :$port | xargs kill -KILL 2>/dev/null || true
        else
            echo "   ✅ $service_name parado com sucesso"
        fi
    else
        echo "   ℹ️  $service_name não estava rodando"
    fi
}

# Parar backend (porta 3001)
stop_port 3001 "Backend"

# Parar frontend (possíveis portas do Vite)
stop_port 5173 "Frontend (5173)"
stop_port 5174 "Frontend (5174)"
stop_port 5175 "Frontend (5175)"

# Parar qualquer processo node/npm relacionado ao projeto
echo ""
echo "🧹 Limpando processos relacionados..."

# Encontrar e parar processos do tsx/nodemon
pkill -f "tsx.*src/index.ts" 2>/dev/null || true
pkill -f "nodemon.*src/index.ts" 2>/dev/null || true

# Encontrar e parar processos do vite
pkill -f "vite.*dev" 2>/dev/null || true

# Aguardar um pouco para os processos terminarem
sleep 2

echo ""
echo "✅ Todos os serviços foram parados!"
echo ""
echo "📝 Logs preservados em:"
echo "   Backend:  logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "💡 Para iniciar novamente, execute: ./start.sh"
