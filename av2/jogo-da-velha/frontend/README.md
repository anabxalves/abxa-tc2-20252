# Frontend: Interface Unificada (React/Vite)

O Frontend do projeto foi construído em React com Vite e utiliza CSS puro, sendo responsável pela interface do usuário e pela tradução de eventos (cliques) em ações de rede ou ações de estado local.

## Arquivos e Funções Principais

O código é dividido em `pages/`, `components/`, e `api/` para garantir a modularidade e a separação de responsabilidades.

### Módulos de Comunicação (`/src/api`)
| Arquivo | Responsabilidade | Modo de Uso |
| :--- | :--- | :--- |
| `useWebSocket.js` | Conexão e sincronização com o **Backend**. Recebe o estado do jogo via WebSockets. | ONLINE |
| `useLocalGame.js` | Lógica de estado completa para o **Jogo Local**. Duplica a lógica de regras para evitar latência de rede. | LOCAL |
| `useGameEngine.js` | **Motor de Jogo Central.** Decide qual hook (WebSocket ou Local) usar e padroniza o `gameState` para a interface. | Ambos |

### Páginas (`/src/pages`)
| Arquivo | Descrição |
| :--- | :--- |
| `PaginaInicial.jsx` | Permite ao usuário inserir nomes e selecionar o modo de jogo (`LOCAL` ou `ONLINE`). |
| `PaginaJogo.jsx` | **Página Unificada.** Renderiza a interface do tabuleiro, placar e botões de controle, usando o estado fornecido pelo `useGameEngine`. |

### Componentes (`/src/components`)
| Componente | Requisito Cumprido                                                                                |
| :--- |:--------------------------------------------------------------------------------------------------|
| `Tabuleiro.jsx` | Renderiza a estrutura semântica `<table>` (Tabela Dinâmica).                                      |
| `Celula.jsx` | Gerencia o `handleClick` (Resposta a Eventos) e aplica a classe de animação (`celula-vencedora`). |
| `CabecalhoPlacar.jsx`| Exibe o placar e aplica o destaque de turno (`jogador-turno`).                                    |

## Estilização

O estilo é puramente CSS (`/src/styles/style.css`), seguindo um padrão **Dark Mode Minimalista**, o que atende à proibição de bibliotecas de terceiros (Bootstrap, Tailwind, etc.).

---

##  Como Rodar Localmente (Cliente)

### 1. Preparação

Certifique-se de que o Backend (FastAPI) esteja **ativo** e rodando na porta `8000` na sua rede.

### 2. Comando de Inicialização

Execute o comando de desenvolvimento do Vite:

```bash
    # Certifique-se de estar no diretório /frontend
    npm install
    npm run dev
```

Após isso, o Frontend estará acessível via navegador (geralmente em http://localhost:5173).