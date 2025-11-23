# Relatório Final - AV2

Este projeto foi elaborado como atividade avaliativa para a disciplina de **Programação Frontend na CESAR School**. O objetivo inicial (AV1) era desenvolver uma solução web estática/dinâmica (HTML/CSS/JS) para uma empresa de serviços de TI.

A evolução do projeto consistiu na migração completa dessa aplicação para uma arquitetura **Full-Stack moderna**, utilizando **React no Frontend** e **Node.js/Express com persistência SQLite no Backend**.

## Funcionalidades e Escopo

O projeto cobre um sistema de gerenciamento de clientes e serviços, implementando um CRUD completo (Criar, Ler, Atualizar, Excluir) em três entidades principais:

| Funcionalidade | Descrição | Implementação |
| :--- | :--- | :--- |
| **Gerenciamento de Contas** | Permite o **Cadastro** de novos clientes, **Login** para autenticação de acesso e **Troca de Senha** segura. | Consome os endpoints REST: `POST /clientes/cadastro`, `POST /clientes/autenticar`, `PUT /clientes/troca-senha`. |
| **Gerenciamento de Serviços** | Permite o **Cadastro de novos serviços de TI** e a consulta da lista completa de serviços disponíveis. | Consome `POST /servicos/cadastro` e `GET /servicos`. |
| **Solicitação de Serviços** | Permite ao usuário logado **visualizar seus dados**, **registrar novas solicitações**, excluir itens da lista local e **sincronizar (salvar/atualizar)** o estado final das solicitações com o banco de dados. | Consome `GET /solicitacoes/:login` e `PUT /solicitacoes/:login`. |

---

## Execução Local

Para testar o sistema Full-Stack, é necessário rodar o Backend e o Frontend simultaneamente, conforme os seguintes passos: 

### 1. Iniciar o Backend (API RESTful)

1.  **Navegue até o diretório do Backend** (`backend`).
2.  **Instale as Dependências (apenas na primeira vez):**
    ```bash
    npm install
    ```
3.  **Inicie o Servidor Node.js:**
    ```bash
    npm start
    ```
    *Mantenha este terminal rodando. O servidor estará na porta `3000`.*

### 2. Iniciar o Frontend (React com Vite)

1.  **Abra um NOVO terminal** e navegue até a pasta do React (`frontend-react`).
2.  **Instale as Dependências:**
    ```bash
    npm install
    ```
3.  **Inicie a Aplicação React:**
    ```bash
    npm run dev
    ```
    *A aplicação React estará acessível em `http://localhost:5173`.*

### 3. Fluxo de Teste Essencial

1.  **Crie a Conta:** Acesse `/cadastro` e crie um novo usuário (necessário para popular o banco de dados).
2.  **Faça Login:** Acesse `/login` e use as credenciais que você acabou de criar.
3.  **Verifique os Dados:** Navegue para `/solicitacao`. O **Nome** e **Login** devem aparecer, e o histórico de solicitações (se houver) será carregado.
---
## Requisitos Técnicos
O projeto migrado para a arquitetura Full-Stack (React com Node.js/SQLite) cumpriu todos os requisitos funcionais e técnicos, focando na eliminação da manipulação DOM e no uso exclusivo dos Hooks do React para gerenciamento de estado.

### I. ARQUITETURA E PERSISTÊNCIA DE DADOS (BACKEND)

| Requisito | Implementação e Localização | Cumprimento |
| :--- | :--- | :--- |
| **Implementar Tabela Cliente** | Tabela `Cliente` no SQLite, com campos para e-mail (PK), senha, nome, CPF, etc. | ✅ (backend/src/config/database.js) |
| **Implementar Tabela Serviço de TI** | Tabela `ServicoTI` no SQLite. Possui `id` como chave primária de **autoincremento**. | ✅ (backend/src/config/database.js) |
| **Implementar Tabela Solicitação** | Tabela `Solicitacao` com chaves estrangeiras `email_cliente` e `id_servico`. | ✅ (backend/src/config/database.js) |
| **Endpoint: Autenticação** | `POST /api/clientes/autenticar`. Verifica login e senha no BE e retorna `sucesso/erro`. | ✅ (controllers/clienteController.js) |
| **Endpoint: Troca de Senha** | `PUT /api/clientes/troca-senha`. Autentica com senha atual e atualiza o registro no BE. | ✅ (controllers/clienteController.js) |
| **Endpoint: Cadastro de Cliente** | `POST /api/clientes/cadastro`. Inclui o cliente após verificar duplicidade de e-mail. | ✅ (controllers/clienteController.js) |
| **Endpoint: Consulta de Serviços** | `GET /api/servicos`. Retorna a lista completa de serviços do BE. | ✅ (controllers/servicoController.js) |
| **Endpoint: Atualização de Solicitações** | `PUT /api/solicitacoes/:login`. **Apaga todas** as solicitações antigas do usuário e **inclui a nova lista** recebida. | ✅ (controllers/solicitacaoController.js) |
| **Endpoint: Leitura de Solicitações** | `GET /api/solicitacoes/:login`. Retorna as solicitações **em ordem crescente de data**. | ✅ (controllers/solicitacaoController.js) |

### II. MIGRAÇÃO E REQUISITOS TÉCNICOS (FRONTEND REACT)

| Requisito | Implementação e Localização | Cumprimento |
| :--- | :--- | :--- |
| **Controle Exclusivo por Hooks** | Todo o estado (dados de formulário, mensagens de feedback, listas) é gerenciado via `useState` e `useEffect`. Não há uso de `document.getElementById` ou manipulação direta do DOM. | ✅ (Todas as Pages) |
| **Modularização de Validações** | Funções de validação (`validarCPF`, `validarSenha`, `validarEmail`, `calcularIdade`) foram centralizadas. | ✅ (src/utils/validation.js) |
| **Camada de Serviço (REST)** | As chamadas HTTP são feitas exclusivamente via `axios` no `src/services/api.js`. | ✅ (src/services/api.js) |
| **Manter Padrão Visual/Estilo** | Os estilos da AV1 foram migrados para CSS modular e ajustados com Flexbox/Grid para garantir **responsividade** (ex: `solicitacao.css`) e um visual moderno. | ✅ (styles/ todos os arquivos) |

### III. CUMPRIMENTO DOS REQUISITOS POR PÁGINA

| Página/Requisito | Componente React | Ação para Cumprir o Requisito |
| :--- | :--- | :--- |
| **Página Inicial (Home)** | `HomePage.jsx` | Usa o Hook `useAuth` para exibir o link de **Solicitação** e o botão **Sair** **somente se o usuário estiver logado**. |
| **Login** | `LoginPage.jsx` | Consome `ClienteService.autenticar`. Em caso de sucesso, chama `setLoggedInUser` e **redireciona para a Home (`/`)**. |
| **Troca de Senha** | `TrocarSenhaPage.jsx` | Consome `ClienteService.trocaSenha`. Após o sucesso da operação, **redireciona para o Login (`/login`)**. |
| **Cadastro de Cliente** | `CadastroPage.jsx` | Coleta todos os dados e consome `ClienteService.cadastrar`. Após o sucesso, **redireciona para o Login (`/login`)**. |
| **Cadastro de Serviço** | `CadastroServicoPage.jsx` | **(Nova Página)** Captura nome, preço e prazo. Implementa validação de obrigatoriedade e envia os dados via `ServicoService.cadastrar`. |
| **Solicitação de Serviço** | `SolicitacaoPage.jsx` | Carrega dinamicamente a lista de serviços (dropdown) e o histórico de solicitações (tabela) dos endpoints. O botão **"Salvar Todas as Solicitações"** implementa o requisito de atualização (`PUT /api/solicitacoes/:login`). |