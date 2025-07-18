#!/bin/bash

echo "🚀 Gerando 50 projetos de teste..."

cd backend
npx ts-node src/scripts/generate-projects.ts

echo "✅ Finalizado!"
