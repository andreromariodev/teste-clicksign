# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Este é um projeto de gerenciador de projetos com:

## Backend (Node.js + Express + TypeScript)
- API REST para CRUD de projetos
- Upload de imagens
- Filtros, busca e ordenação
- Estrutura modular com controllers, services e models

## Frontend (Vue 3 + TypeScript + CSS Modules)
- Interface para listagem de projetos
- Formulários de criação e edição
- Sistema de favoritos
- Busca com histórico
- Modal de confirmação
- CSS Modules (não Tailwind)

## Campos do Projeto:
- Nome do projeto (obrigatório)
- Cliente (obrigatório)
- Data de Início (obrigatório)
- Data Final (obrigatório)
- Capa do projeto (imagem, opcional)
- Favorito (boolean)

## Funcionalidades:
- Listagem com paginação
- Filtro por favoritos
- Ordenação (alfabética, data início, data fim)
- Busca por texto (mínimo 3 caracteres)
- Histórico de buscas (últimas 5)
- Highlight nos resultados
- Upload de imagens para capa
