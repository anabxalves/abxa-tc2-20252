# Meios de Pagamento (CRUD)

Este projeto foi desenvolvido como atividade avaliativa para a disciplina de Programação Frontend na CESAR School, com o intuito de desenvolver uma aplicação fullstack para gerenciamento de Meios de Pagamento (CRUD: Criar, Ler, Atualizar, Excluir).

O projeto é dividido em dois serviços distintos:
1.  **Frontend (`payment-crud`):** Interface do usuário construída com React e Vite.
2.  **Backend (`payment-api`):** Servidor RESTful em Node.js/Express com persistência de dados em SQLite.

## Tecnologias Utilizadas

### Frontend
* **Framework:** React (Vite)
* **Roteamento:** React Router DOM
* **Requisições:** Axios
* **Estilização:** CSS

### Backend
* **Servidor:** Node.js (Express)
* **Banco de Dados:** SQLite
* **Estrutura:** RESTful API com Controllers, Routes e Configuração de DB/CORS.

---

## Como Rodar o Projeto Localmente

Para iniciar a aplicação, você deve rodar o Backend e o Frontend em terminais separados.

### 1. Inicialização do Backend (API)

O backend utiliza a porta **3000** e armazena o banco de dados no arquivo `/payment-api/db/payment.db`.

1.  Acesse a pasta do backend:
    ```bash
    cd payment-api
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor (ele criará a tabela no SQLite automaticamente):
    ```bash
    npm start 
    ```
    *O console deve indicar que o servidor está rodando na porta 3000.*

### 2. Inicialização do Frontend (Interface)

O frontend utiliza a porta **5173** (padrão Vite) e espera a API na porta 3000.

1.  Abra uma **nova janela do terminal** e acesse a pasta do frontend:
    ```bash
    cd payment-crud
    ```
2.  Instale as dependências (se ainda não o fez):
    ```bash
    npm install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm run dev 
    ```

### 3. Acesso

Abra seu navegador e acesse: `http://localhost:5173`

---

## 🗺️ Estrutura da API RESTful

A aplicação frontend se comunica com os seguintes endpoints no backend (`http://localhost:3000/api/payments`):

| Operação | Método HTTP | Endpoint | Descrição |
| :--- | :--- | :--- | :--- |
| **Consulta Geral** | `GET` | `/api/payments` | Retorna todos os registros. |
| **Inclusão** | `POST` | `/api/payments` | Cria um novo registro (ID auto-gerado). |
| **Consulta por ID** | `GET` | `/api/payments/{id}` | Busca um único registro para consulta/alteração. |
| **Alteração** | `PUT` | `/api/payments/{id}` | Atualiza todos os campos de um registro. |
| **Exclusão** | `DELETE` | `/api/payments/{id}` | Remove um registro do banco de dados. |

### Modelo de Dados (`payments`)

| Campo | Tipo SQL | Observações |
| :--- | :--- | :--- |
| **id** | `INTEGER` | Chave Primária, **AUTOINCREMENT** (simula SEQUENCE). |
| **nome** | `TEXT` | Nome do meio de pagamento. |
| **valorMaximo** | `REAL` | Valor máximo permitido (ex: 5000.00). |
| **tipo** | `TEXT` | Restrito a **'ELETRONICO'** ou **'FISICO'**. |