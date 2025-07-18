#!/bin/bash

# Script para executar todos os testes do projeto

echo "🧪 Executando testes do projeto teste-clicksign"
echo "============================================="

# Variáveis de controle
BACKEND_DIR="/home/andre/projects/teste-clicksign/backend"
FRONTEND_DIR="/home/andre/projects/teste-clicksign/frontend"

# Função para executar testes do backend
run_backend_tests() {
  echo ""
  echo "🔧 Executando testes do Backend..."
  echo "--------------------------------"
  
  cd "$BACKEND_DIR"
  
  # Verifica se as dependências estão instaladas
  if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
  fi
  
  # Executa os testes
  echo "🏃 Executando testes unitários..."
  npm test
  
  echo "✅ Testes do backend concluídos!"
}

# Função para executar testes do frontend
run_frontend_tests() {
  echo ""
  echo "🖥️  Executando testes do Frontend..."
  echo "-----------------------------------"
  
  cd "$FRONTEND_DIR"
  
  # Verifica se as dependências estão instaladas
  if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
  fi
  
  # Executa os testes
  echo "🏃 Executando testes unitários..."
  npm run test:run
  
  echo "✅ Testes do frontend concluídos!"
}

# Função para executar todos os testes
run_all_tests() {
  echo "🚀 Executando todos os testes..."
  
  run_backend_tests
  run_frontend_tests
  
  echo ""
  echo "🎉 Todos os testes foram executados!"
  echo "===================================="
}

# Função para executar testes com coverage
run_tests_with_coverage() {
  echo "📊 Executando testes com cobertura..."
  
  echo ""
  echo "🔧 Backend - Cobertura de testes..."
  cd "$BACKEND_DIR"
  npm run test:coverage
  
  echo ""
  echo "🖥️  Frontend - Cobertura de testes..."
  cd "$FRONTEND_DIR"
  npm run test:coverage
  
  echo ""
  echo "📈 Relatórios de cobertura gerados!"
  echo "Backend: $BACKEND_DIR/coverage/"
  echo "Frontend: $FRONTEND_DIR/coverage/"
}

# Função para executar testes em modo watch
run_tests_watch() {
  echo "👀 Executando testes em modo watch..."
  echo "Escolha uma opção:"
  echo "1) Backend"
  echo "2) Frontend"
  read -p "Digite sua escolha (1 ou 2): " choice
  
  case $choice in
    1)
      cd "$BACKEND_DIR"
      npm run test:watch
      ;;
    2)
      cd "$FRONTEND_DIR"
      npm run test
      ;;
    *)
      echo "❌ Opção inválida!"
      exit 1
      ;;
  esac
}

# Função para mostrar ajuda
show_help() {
  echo "📖 Uso: ./run-tests.sh [opção]"
  echo ""
  echo "Opções:"
  echo "  all       - Executa todos os testes (padrão)"
  echo "  backend   - Executa apenas testes do backend"
  echo "  frontend  - Executa apenas testes do frontend"
  echo "  coverage  - Executa testes com cobertura"
  echo "  watch     - Executa testes em modo watch"
  echo "  help      - Mostra esta ajuda"
  echo ""
  echo "Exemplos:"
  echo "  ./run-tests.sh"
  echo "  ./run-tests.sh backend"
  echo "  ./run-tests.sh coverage"
}

# Processa argumentos da linha de comando
case "${1:-all}" in
  "all")
    run_all_tests
    ;;
  "backend")
    run_backend_tests
    ;;
  "frontend")
    run_frontend_tests
    ;;
  "coverage")
    run_tests_with_coverage
    ;;
  "watch")
    run_tests_watch
    ;;
  "help"|"-h"|"--help")
    show_help
    ;;
  *)
    echo "❌ Opção inválida: $1"
    show_help
    exit 1
    ;;
esac
