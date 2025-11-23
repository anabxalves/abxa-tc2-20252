import uuid
from typing import List, Dict, Tuple, Optional
from .game import Jogo, Jogador

class GameManager:
    def __init__(self):
        self.active_games: Dict[str, Jogo] = {}
        self.waiting_players: List[Dict[str, str]] = []

    def buscar_ou_criar_jogo(self, connection_id: str, nome_jogador: str) -> Tuple[Optional[str], Optional[Jogador], Optional[Jogador]]:
        player_data = {"connection_id": connection_id, "nome": nome_jogador}

        if self.waiting_players:
            jogador_em_espera = self.waiting_players.pop(0)

            game_id = str(uuid.uuid4())

            novo_jogo = Jogo(game_id, jogador_em_espera, player_data)
            self.active_games[game_id] = novo_jogo

            return game_id, novo_jogo.jogadores['X'], novo_jogo.jogadores['O']
        else:
            self.waiting_players.append(player_data)
            return None, None, None

    def remover_jogador(self, connection_id: str) -> Optional[str]:
        self.waiting_players = [p for p in self.waiting_players if p['connection_id'] != connection_id]

        game_to_end = None
        opponent_connection_id = None

        for game_id, jogo in self.active_games.items():
            if connection_id == jogo.jogadores['X'].connection_id:
                game_to_end = game_id
                opponent_connection_id = jogo.jogadores['O'].connection_id
                break
            elif connection_id == jogo.jogadores['O'].connection_id:
                game_to_end = game_id
                opponent_connection_id = jogo.jogadores['X'].connection_id
                break

        if game_to_end:
            del self.active_games[game_to_end]
            return opponent_connection_id

        return None

manager = GameManager()