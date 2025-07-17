#!/bin/bash

# Script de desenvolvimento - Gerenciador de Projetos
# Utilitários para facilitar o desenvolvimento

show_help() {
    echo "🛠️  Gerenciador de Projetos - Utilitários de Desenvolvimento"
    echo "============================================================"
    echo ""
    echo "Uso: ./dev.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Inicia backend e frontend"
    echo "  stop      - Para todos os serviços"
    echo "  restart   - Reinicia todos os serviços"
    echo "  backend   - Inicia apenas o backend"
    echo "  frontend  - Inicia apenas o frontend"
    echo "  logs      - Mostra logs em tempo real"
    echo "  clean     - Limpa node_modules e reinstala dependências"
    echo "  build     - Faz build de produção"
    echo "  test      - Executa testes (quando implementados)"
    echo "  status    - Mostra status dos serviços"
    echo "  install   - Instala/atualiza dependências"
    echo "  help      - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./dev.sh start    # Inicia o projeto completo"
    echo "  ./dev.sh logs     # Acompanha logs em tempo real"
    echo "  ./dev.sh clean    # Limpa e reinstala tudo"
    echo ""
}

check_status() {
    echo "📊 Status dos Serviços"
    echo "===================="
    
    # MongoDB
    if systemctl is-active --quiet mongod; then
        echo "🟢 MongoDB: Rodando"
    else
        echo "🔴 MongoDB: Parado"
    fi
    
    # Backend
    if lsof -i :3001 > /dev/null 2>&1; then
        echo "🟢 Backend: Rodando (http://localhost:3001)"
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            echo "   ✅ API respondendo"
        else
            echo "   ⚠️  API não está respondendo"
        fi
    else
        echo "🔴 Backend: Parado"
    fi
    
    # Frontend
    FRONTEND_PORT=""
    for port in 5173 5174 5175; do
        if lsof -i :$port > /dev/null 2>&1; then
            FRONTEND_PORT=$port
            break
        fi
    done
    
    if [ -n "$FRONTEND_PORT" ]; then
        echo "🟢 Frontend: Rodando (http://localhost:$FRONTEND_PORT)"
    else
        echo "🔴 Frontend: Parado"
    fi
    
    echo ""
}

install_deps() {
    echo "📦 Instalando/Atualizando Dependências"
    echo "======================================"
    
    echo "🔧 Backend..."
    cd backend
    npm install
    cd ..
    
    echo "🔧 Frontend..."
    cd frontend
    npm install
    cd ..
    
    echo "✅ Dependências atualizadas!"
}

clean_install() {
    echo "🧹 Limpeza Completa e Reinstalação"
    echo "=================================="
    
    echo "🗑️  Removendo node_modules..."
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    
    echo "🗑️  Removendo package-lock.json..."
    rm -f backend/package-lock.json
    rm -f frontend/package-lock.json
    
    echo "📦 Reinstalando dependências..."
    install_deps
    
    echo "✅ Limpeza e reinstalação concluída!"
}

build_project() {
    echo "🏗️  Build de Produção"
    echo "===================="
    
    echo "🔧 Building backend..."
    cd backend
    npm run build
    cd ..
    
    echo "🔧 Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    echo "✅ Build concluído!"
    echo "📁 Backend: backend/dist/"
    echo "📁 Frontend: frontend/dist/"
}

show_logs() {
    echo "📝 Logs em Tempo Real"
    echo "===================="
    echo "Pressione Ctrl+C para sair"
    echo ""
    
    if [ -f "logs/backend.log" ] && [ -f "logs/frontend.log" ]; then
        tail -f logs/backend.log logs/frontend.log
    elif [ -f "logs/backend.log" ]; then
        echo "⚠️  Apenas logs do backend disponíveis"
        tail -f logs/backend.log
    elif [ -f "logs/frontend.log" ]; then
        echo "⚠️  Apenas logs do frontend disponíveis"
        tail -f logs/frontend.log
    else
        echo "❌ Nenhum log encontrado. Execute './dev.sh start' primeiro"
    fi
}

start_backend_only() {
    echo "🖥️  Iniciando apenas o Backend"
    echo "=============================="
    
    # Verificar se MongoDB está rodando
    if ! systemctl is-active --quiet mongod; then
        echo "🔧 Iniciando MongoDB..."
        sudo systemctl start mongod
        sleep 2
    fi
    
    mkdir -p logs
    cd backend
    npm run dev > ../logs/backend.log 2>&1 &
    cd ..
    
    echo "⏳ Aguardando inicialização..."
    sleep 5
    
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend iniciado (http://localhost:3001)"
    else
        echo "❌ Falha ao iniciar backend"
    fi
}

start_frontend_only() {
    echo "🌐 Iniciando apenas o Frontend"
    echo "==============================="
    
    mkdir -p logs
    cd frontend
    npm run dev > ../logs/frontend.log 2>&1 &
    cd ..
    
    echo "⏳ Aguardando inicialização..."
    sleep 5
    
    for port in 5173 5174 5175; do
        if lsof -i :$port > /dev/null 2>&1; then
            echo "✅ Frontend iniciado (http://localhost:$port)"
            return
        fi
    done
    
    echo "❌ Falha ao iniciar frontend"
}

# Verificar se está na pasta correta
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Execute este script na pasta raiz do projeto"
    exit 1
fi

# Processar comando
case "${1:-help}" in
    "start")
        ./start.sh
        ;;
    "stop")
        ./stop.sh
        ;;
    "restart")
        ./stop.sh
        sleep 2
        ./start.sh
        ;;
    "backend")
        start_backend_only
        ;;
    "frontend")
        start_frontend_only
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs
        ;;
    "install")
        install_deps
        ;;
    "clean")
        clean_install
        ;;
    "build")
        build_project
        ;;
    "test")
        echo "🧪 Testes ainda não implementados"
        echo "💡 Adicione scripts de teste nos package.json"
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "❌ Comando inválido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
