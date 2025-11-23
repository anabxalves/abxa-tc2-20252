from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Any, List
from ..dependencies import get_game_manager
from ..game_logic.game_manager import GameManager, Jogo
import json
import uuid

router = APIRouter()

active_connections: Dict[str, WebSocket] = {}

async def broadcast_game_state(jogo: Jogo):
    json_state = jogo.to_json()

    for simbolo, jogador in jogo.jogadores.items():
        if jogador.connection_id in active_connections:
            websocket = active_connections[jogador.connection_id]

            json_state['type'] = "GAME_STATE"
            json_state['seu_simbolo'] = simbolo

            await websocket.send_json(json_state)

@router.websocket("/ws/game/{nome_jogador}")
async def websocket_endpoint(
        websocket: WebSocket,
        nome_jogador: str,
        game_manager: GameManager = Depends(get_game_manager)
):
    await websocket.accept()
    connection_id = str(uuid.uuid4())
    active_connections[connection_id] = websocket

    game_id, p1, p2 = game_manager.buscar_ou_criar_jogo(connection_id, nome_jogador)

    try:
        if not game_id:
            await websocket.send_json({"type": "WAITING", "message": "Aguardando um oponente. Não saia da página!"})
        else:
            jogo = game_manager.active_games[game_id]
            await broadcast_game_state(jogo)

        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "FAZER_JOGADA":
                game_id_to_find = message.get("game_id")
                cell_index = message.get("cell_index")
                simbolo = message.get("simbolo")

                jogo = game_manager.active_games.get(game_id_to_find)

                if jogo and jogo.fazer_jogada(simbolo, cell_index):
                    await broadcast_game_state(jogo)

            elif message.get("type") == "NOVA_RODADA":
                game_id_to_find = message.get("game_id")
                jogo = game_manager.active_games.get(game_id_to_find)

                if jogo and jogo.rodadas[-1].status == "Fim" and not jogo.vencedor_serie:
                    jogo.iniciar_nova_rodada()
                    await broadcast_game_state(jogo)

            elif message.get("type") == "PROPOR_NOVO_JOGO":
                game_id_to_find = message.get("game_id")
                simbolo_proponente = message.get("simbolo")
                jogo = game_manager.active_games.get(game_id_to_find)

                if jogo and jogo.vencedor_serie:
                    jogo.proposta_novo_jogo = simbolo_proponente
                    await broadcast_game_state(jogo)

            elif message.get("type") == "ACEITAR_NOVO_JOGO":
                game_id_to_find = message.get("game_id")
                jogo = game_manager.active_games.get(game_id_to_find)

                if jogo and jogo.vencedor_serie and jogo.proposta_novo_jogo:
                    jogo.iniciando_novo_jogo = True
                    await broadcast_game_state(jogo)

                    jogo.reiniciar_jogo()
                    await broadcast_game_state(jogo)

    except WebSocketDisconnect:
        print(f"Desconexão de: {nome_jogador} ({connection_id})")

        opponent_id = game_manager.remover_jogador(connection_id)

        active_connections.pop(connection_id, None)

        if opponent_id and opponent_id in active_connections:
            opponent_websocket = active_connections[opponent_id]
            try:
                await opponent_websocket.send_json({
                    "type": "GAME_ABORTED",
                    "abandoner_name": nome_jogador,
                    "message": f"Seu oponente ({nome_jogador}) abandonou o jogo!"
                })
            except (WebSocketDisconnect, RuntimeError):
                pass

            active_connections.pop(opponent_id, None)

    except Exception as e:
        print(f"Erro inesperado no WebSocket: {e}")
        active_connections.pop(connection_id, None)