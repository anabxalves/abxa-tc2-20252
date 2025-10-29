# abxa - CRUD Full-Stack com JavaScript
Este é um MVP de aplicação web Full-Stack que implementa operações CRUD (Create, Read, Update, Delete) utilizando HTML, CSS e JavaScript no *frontend*, e Node.js/Express com SQLite no *backend*.

O projeto foi desenvolvido para atender aos seguintes requisitos técnicos:
* Implementação de um CRUD completo (Frontend e Backend).
* Uso obrigatório da API `fetch` para comunicação assíncrona.
* Uso de um modelo de dados com no mínimo 4 campos, sendo 1 a chave primária.
* Implementação de validações básicas (obrigatoriedade, tamanho, formato) nos 4 campos do lado do *frontend* usando JavaScript puro, com feedback visual.

## Estrutura
O projeto está organizado em duas pastas principais para separar o ambiente do frontend e do backend.

    ├── /backend # Servidor API (Node.js/Express)
    |       ├── server.js           # Lógica do servidor, API REST e integração com SQLite
    |       ├── database.sqlite     # Arquivo do banco de dados
    |       └── package.json        # Metadados e dependências do Node.js 
    └── /frontend # Interface do Usuário (HTML/CSS/JS) 
            ├── index.html          # Estrutura e formulário principal 
            ├── style.css           # Estilos da aplicação
            └── script.js           # Lógica do frontend, validações e chamadas fetch

---

## Instalação
 >Pré-requisito: Ter o **Node.js** e o **npm** instalados em sua máquina.

### 1. Configurar e Iniciar o Backend

1.  Abra o terminal e navegue até a pasta `/backend`:
    ```bash
    cd ./backend
    ```

2.  Instale as dependências (Express, SQLite3, CORS):
    ```bash
    npm install
    ```

3.  Inicie o servidor Node.js:
    ```bash
    node server.js
    ```
    O servidor será iniciado na porta **3000**. Mantenha este terminal aberto.

    > **Saída esperada:** `Servidor rodando na porta 3000`

### 2. Iniciar o Frontend

1.  Navegue até a pasta `/frontend`:
    ```bash
    cd ./frontend
    ```
2.  Abra o arquivo `index.html` diretamente em seu navegador.

---

## 🗄️ Organização do Banco de Dados (SQLite)

O banco de dados é gerado no arquivo `database.sqlite` pelo Node.js na primeira execução.

### Modelo de Dados: `produtos`

A tabela `produtos` é utilizada para a realização das operações CRUD.

| Campo       | Tipo    | Chave/Restrição                | Descrição                                                       |
|:------------|:--------|:-------------------------------|:----------------------------------------------------------------|
| `id`        | INTEGER | **PRIMARY KEY, AUTOINCREMENT** | Chave primária (PK). Gerada automaticamente.                    |
| `nome`      | TEXT    | NOT NULL                       | Nome do produto.                                                |
| `descricao` | TEXT    | -                              | Descrição detalhada do produto (opcional, máx. 255 caracteres). |
| `preco`     | REAL    | NOT NULL                       | Preço do produto (aceita valores decimais/centavos).            |

---

## Cumprimento dos Requisitos

### 1. Implementar um CRUD COMPLETO em JS (Front e Back)

| Operação CRUD          | Método HTTP | Rota da API (Backend) | Função no Frontend (`script.js`)                          |
|:-----------------------|:------------|:----------------------|:----------------------------------------------------------|
| **C**reate (Criar)     | `POST`      | `/api/produtos`       | `fetch` na submissão do formulário.                       |
| **R**ead (Ler)         | `GET`       | `/api/produtos`       | Função `listarProdutos()`                                 |
| **U**pdate (Atualizar) | `PUT`       | `/api/produtos/:id`   | `fetch` na submissão do formulário quando em modo edição. |
| **D**elete (Excluir)   | `DELETE`    | `/api/produtos/:id`   | Função `deletarProduto(id, nome)`                         |

### 2. Usar `fetch`

Todas as operações assíncronas do frontend (`script.js`) utilizam a **Fetch API** (`await fetch(...)`) para comunicação com o backend.

### 3. Mínimo de 04 campos, sendo 1 a chave primária

O modelo de dados `produtos` utiliza: `id` (PK), `nome`, `descricao` e `preco`. Todos os 4 campos são exibidos na tabela de listagem do `index.html`.

### 4. Validações básicas nos 4 campos feitas no front end em JS

As validações são implementadas na função `validarCampoDetalhado(inputElement)` no `frontend/script.js`. As mensagens de erro são claras e exibidas em tempo real (on blur/on input) sob cada campo, impedindo o envio de dados inválidos.

| Campo         | Validação Implementada                                | Exemplo de Restrição                                |
|:--------------|:------------------------------------------------------|:----------------------------------------------------|
| **Nome**      | Obrigatoriedade, Tamanho Mínimo/Máximo.               | Mínimo de 3, Máximo de 100 caracteres.              |
| **Descrição** | Tamanho Máximo.                                       | Máximo de 255 caracteres.                           |
| **Preço**     | Obrigatoriedade, Numérico Válido, Positivo, Decimais. | Deve ser `> R$ 0,00` e aceita até 2 casas decimais. |
