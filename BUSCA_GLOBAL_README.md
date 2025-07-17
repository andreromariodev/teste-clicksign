# Sistema de Busca Global com Histórico

## Funcionalidades Implementadas

### 1. Botão de Busca no Header
- ✅ Botão de busca localizado ao lado do logo no header
- ✅ Ícone de lupa com estilo consistente
- ✅ Abertura de modal/dropdown de busca ao clicar

### 2. Modal de Busca Global
- ✅ Modal responsivo que abre sobrepondo a tela
- ✅ Campo de busca com placeholder informativo
- ✅ Validação mínima de 3 caracteres
- ✅ Botão de limpar busca
- ✅ Atalhos de teclado (Enter para buscar, Esc para fechar)

### 3. Histórico de Buscas (LocalStorage)
- ✅ Armazenamento dos últimos 5 termos de busca
- ✅ Persistência usando localStorage
- ✅ Interface para visualizar histórico
- ✅ Opção de selecionar termo do histórico
- ✅ Botão para remover itens individuais do histórico
- ✅ Botão para limpar todo o histórico
- ✅ Composable `useSearchHistory` para gerenciamento

### 4. Integração com Roteamento
- ✅ Busca atualiza a URL com parâmetros de query
- ✅ Estado sincronizado entre URL e interface
- ✅ Navegação funciona com botões voltar/avançar do navegador
- ✅ Parâmetros preservados: search, favorites, sort, page

### 5. Funcionalidades da Busca
- ✅ Busca em tempo real (debounce de 300ms)
- ✅ Redirecionamento para página de projetos se não estiver nela
- ✅ Reset automático para primeira página ao buscar
- ✅ Adição automática ao histórico para buscas válidas (≥3 caracteres)

## Estrutura de Arquivos

### Novos Arquivos Criados
```
frontend/src/
├── components/ui/
│   └── GlobalSearch.vue          # Componente principal da busca global
├── composables/
│   └── useSearchHistory.ts       # Gerenciamento do histórico no localStorage
```

### Arquivos Modificados
```
frontend/src/
├── components/layout/
│   └── AppLayout.vue             # Adicionado botão de busca no header
├── views/
│   └── ProjectsView.vue          # Integração com busca global e URL
├── composables/
│   └── useProjects.ts            # Removido gerenciamento de histórico
└── services/
    └── projectService.ts         # Removidos métodos de histórico do backend
```

## Como Usar

### 1. Acessar a Busca
- Clique no ícone de lupa ao lado do logo no header
- O modal de busca será aberto

### 2. Realizar uma Busca
- Digite pelo menos 3 caracteres no campo de busca
- Pressione Enter ou clique no botão "Buscar"
- Você será redirecionado para a página de projetos com os resultados

### 3. Usar o Histórico
- Termos buscados anteriormente aparecerão na seção "Buscas recentes"
- Clique em qualquer termo para refazer a busca
- Use o "x" para remover um item específico
- Use "Limpar histórico" para remover todos os termos

### 4. Navegação
- A URL é atualizada com os parâmetros de busca
- Use os botões voltar/avançar do navegador normalmente
- Compartilhe URLs com filtros aplicados

## Detalhes Técnicos

### LocalStorage
- Chave: `project-search-history`
- Máximo: 5 itens
- Formato: Array de strings
- Gerenciamento automático de limite

### Debounce
- Tempo: 300ms
- Aplicado apenas quando já estiver na página de projetos
- Evita requisições excessivas durante digitação

### Validações
- Mínimo 3 caracteres para busca
- Histórico apenas para termos válidos
- Sanitização de termos duplicados

### Responsividade
- Modal adaptável em dispositivos móveis
- Padding e margens ajustados para telas pequenas
- Preservação da usabilidade em todos os tamanhos
