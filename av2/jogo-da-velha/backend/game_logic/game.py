from typing import List, Optional, Dict, Any

class Jogador:
    def __init__(self, connection_id: str, nome: str, simbolo: str):
        self.connection_id = connection_id
        self.nome = nome
        self.simbolo = simbolo
        self.pontuacao_serie = 0

class Rodada:
    def __init__(self):
        self.tabuleiro: List[Optional[str]] = [None] * 9
        self.vencedor_rodada: Optional[str] = None
        self.status: str = "Jogando"
        self.linha_vencedora: List[int] = []

class Jogo:
    def __init__(self, id_jogo: str, jogador1_data: Dict[str, str], jogador2_data: Dict[str, str]):
        self.id = id_jogo
        self.jogadores: Dict[str, Jogador] = {
            'X': Jogador(jogador1_data['connection_id'], jogador1_data['nome'], 'X'),
            'O': Jogador(jogador2_data['connection_id'], jogador2_data['nome'], 'O')
        }
        self.rodadas: List[Rodada] = []
        self.turno_atual: str = 'X'
        self.vencedor_serie: Optional[str] = None
        self.proposta_novo_jogo: Optional[str] = None
        self.iniciando_novo_jogo: bool = False
        self.iniciar_nova_rodada()

    def iniciar_nova_rodada(self):
        if self.vencedor_serie:
            return

        nova_rodada = Rodada()
        self.rodadas.append(nova_rodada)

        if len(self.rodadas) > 1:
            self.turno_atual = 'O' if self.rodadas[-2].vencedor_rodada in ['X', 'Empate'] else 'X'

    def reiniciar_jogo(self):
        self.rodadas = []
        self.turno_atual = 'X'
        self.vencedor_serie = None
        self.jogadores['X'].pontuacao_serie = 0
        self.jogadores['O'].pontuacao_serie = 0
        self.proposta_novo_jogo = None
        self.iniciando_novo_jogo = False
        self.iniciar_nova_rodada()

    def fazer_jogada(self, simbolo: str, indice_celula: int):
        rodada_atual = self.rodadas[-1]

        if simbolo != self.turno_atual:
            return False
        if rodada_atual.tabuleiro[indice_celula] is not None:
            return False
        if rodada_atual.status != "Jogando":
            return False

        rodada_atual.tabuleiro[indice_celula] = simbolo

        resultado_vitoria = self._verificar_vitoria(rodada_atual.tabuleiro)

        if resultado_vitoria:
            vencedor, linha_vencedora_indices = resultado_vitoria

            rodada_atual.vencedor_rodada = vencedor
            rodada_atual.status = "Fim"
            rodada_atual.linha_vencedora = linha_vencedora_indices

            self.jogadores[vencedor].pontuacao_serie += 1
            self._verificar_fim_serie()
        elif all(c is not None for c in rodada_atual.tabuleiro):
            rodada_atual.vencedor_rodada = 'Empate'
            rodada_atual.status = "Fim"
        else:
            self.turno_atual = 'O' if simbolo == 'X' else 'X'

        return True

    def _verificar_vitoria(self, tabuleiro: List[Optional[str]]):
        linhas_vencedoras = [
            (0, 1, 2), (3, 4, 5), (6, 7, 8),
            (0, 3, 6), (1, 4, 7), (2, 5, 8),
            (0, 4, 8), (2, 4, 6)
        ]

        for linha in linhas_vencedoras:
            a, b, c = linha
            if tabuleiro[a] == tabuleiro[b] == tabuleiro[c] and tabuleiro[a] is not None:
                return tabuleiro[a], list(linha)
        return None

    def _verificar_fim_serie(self):
        if self.jogadores['X'].pontuacao_serie >= 2:
            self.vencedor_serie = self.jogadores['X'].nome
        elif self.jogadores['O'].pontuacao_serie >= 2:
            self.vencedor_serie = self.jogadores['O'].nome

    def to_json(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'jogadores': {
                s: {'nome': j.nome, 'simbolo': j.simbolo, 'pontuacao_serie': j.pontuacao_serie, 'connection_id': j.connection_id}
                for s, j in self.jogadores.items()
            },
            'rodadaAtual': {
                'tabuleiro': self.rodadas[-1].tabuleiro,
                'vencedor': self.rodadas[-1].vencedor_rodada,
                'status': self.rodadas[-1].status,
                'numero': len(self.rodadas),
                'linhaVencedora': self.rodadas[-1].linha_vencedora
            },
            'turnoAtual': self.turno_atual,
            'vencedorSerie': self.vencedor_serie,
            'propostaNovoJogo': self.proposta_novo_jogo,
            'iniciandoNovoJogo': self.iniciando_novo_jogo
        }