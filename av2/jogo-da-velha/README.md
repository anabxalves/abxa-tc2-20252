# Jogo da Velha - AV2

Este projeto foi elaborado como atividade avaliativa para a disciplina de **Programação Frontend na CESAR School**, com o objetivo de implementar um jogo online em tempo real (multiplayer em máquinas diferentes).

Frente a isso, foi desenvolvido um Jogo da Velha, com jogabilidade multiplayer e um modo local, cumprindo todos os requisitos técnicos e de arquitetura propostos para a disciplina de Programação FrontEnd. Seguindo o princípio Cliente-Servidor, a arquitetura do projeto possui um **Backend (Python/FastAPI)**, atuando como o **Controle Central** para a lógica multiplayer, e um **Frontend (React/Vite)**, atuando como a interface unificada para ambos os modos de jogo.

---

## Funcionalidades e Requisitos Atendidos

| Requisito | Status | Implementação |
| :--- | :--- | :--- |
| **Arquitetura** | Cliente-Servidor | Lógica central (pontuação, turnos, regras) reside no **Backend (FastAPI)** para o modo Online. |
| **Tecnologia** | React & Vite | Interface construída com React, garantindo a manipulação sem uso do DOM. |
| **Multiplayer Online** |  ✅ | Comunicação bidirecional em tempo real via **WebSockets**, permitindo jogar em máquinas distintas. |
| **Modo Local (LAN)** |  ✅ | Lógica de estado interna (JS Hook), garantindo zero latência e reutilização de componentes. |
| **Animação** |  ✅ | Destaque visual e animação (`@keyframes pulse-win`) da **linha vencedora** ao final da rodada. |
| **Abstração/Classes** |  ✅ | Classes Python (`Jogo`, `Rodada`) no Backend e *Custom Hooks* (`useGameEngine`, `useLocalGame`) no Frontend. |
| **Separação** |  ✅ | Separação total de HTML (JSX), CSS (style.css puro), e JS/Python. |
| **Placar** |  ✅ | Placar persistente "Melhor de 3" com atualização dinâmica de nomes e pontuação. |

---

## Como Rodar o Projeto Localmente

Para rodar o projeto e testar o modo Online (simulando duas máquinas) ou o modo Local (testado em uma máquina), siga os passos abaixo:

### Pré-requisitos
* Node.js e npm (para Frontend)
* Python 3.8+ e pip (para Backend)

### 1. Configuração do Ambiente

Instale as dependências para cada parte do projeto:

```bash
  # 1. Instalar dependências do Frontend (na pasta /frontend)
    cd frontend
    npm install

  # 2. Instalar dependências do Backend (na pasta /backend)
    cd ../backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
```

### 2. Configurar o Endereço do Servidor
Para que o modo Online funcione, o Frontend precisa saber o IP do Backend.
- Crie o arquivo .env.development na raiz da pasta /frontend. 
- Obtenha o IP Local da sua máquina (ex: 192.168.0.1) e adicione-o:

```bash
  # Conteúdo de /frontend/.env.development
  VITE_BACKEND_HOST={IP_SUA_MAQUINA}
```

### 3. Iniciar o Backend (Servidor)
O backend deve ser iniciado primeiro, escutando em todas as interfaces (0.0.0.0) para permitir conexões externas (Multiplayer).

```bash
  # Certifique-se de estar no diretório /jogo-da-velha com o venv ativo
  uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Iniciar o Frontend (Cliente)
Inicie o aplicativo React em duas instâncias de navegador para testar o Multiplayer.

```bash
  # Certifique-se de estar no diretório /frontend
  npm run dev
```

---

## Para mais detalhes
- [Clique aqui para o README do Backend (Python)](./backend/README.md)
- [Clique aqui para o README do Frontend (React)](./frontend/README.md)
