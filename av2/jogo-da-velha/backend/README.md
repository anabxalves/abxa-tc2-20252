# Backend: Controle Central (FastAPI/Python)

O Backend do projeto concentra a inteligência do jogo, responsável por gerenciar o estado da partida, as regras e a comunicação em tempo real.

## Tecnologias Utilizadas

* **Linguagem:** Python 3.8+
* **Framework Web:** FastAPI (para roteamento HTTP e WebSockets)
* **Servidor ASGI:** Uvicorn (para rodar o FastAPI)

## Arquitetura e Módulos

Seguindo os princípios de Clean Code, o backend é estritamente modular:

| Módulo | Responsabilidade | Funções Chave |
| :--- | :--- | :--- |
| `game_logic/game.py` | **Lógica Pura de Negócios** | Contém as classes `Jogo`, `Rodada` e `Jogador`. Implementa `fazer_jogada`, `_verificar_vitoria` (e `linha_vencedora`), e `reiniciar_jogo`. |
| `game_logic/game_manager.py` | **Gerenciamento de Sessão** | `GameManager` (Singleton) gerencia a fila de espera (`waiting_players`) e o emparelhamento de jogadores. |
| `api/websocket_router.py` | **Comunicação de Rede** | Define o endpoint `/ws/game/{nome_jogador}`. Recebe ações (`FAZER_JOGADA`) e usa `broadcast_game_state` para enviar o estado atual para todos os clientes. |
| `main.py` | **Configuração** | Configura o aplicativo FastAPI, o middleware CORS, e inclui o `websocket_router`. |

## Como Rodar Localmente (Servidor)

### 1. Preparação

Certifique-se de que as dependências estejam instaladas.

```bash
  # Certifique-se que está na pasta /backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
```

### 2. Comando de Inicialização

Execute o servidor a partir da pasta **acima** (`/jogo-da-velha`) para que o Python resolva corretamente as importações modulares:

```bash
    # Certifique-se de que o ambiente virtual (venv) esteja ativo!
    uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

- Note que o `--host 0.0.0.0` é crucial para que o Backend aceite conexões de outras máquinas (Multiplayer).
- O servidor estará ativo em `http://<Seu_IP_Local>:8000.