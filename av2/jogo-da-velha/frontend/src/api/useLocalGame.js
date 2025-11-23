import { useState, useCallback } from 'react';

const checkVictory = (board) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: line };
        }
    }
    if (board.every(cell => cell !== null)) {
        return { winner: 'Empate', line: [] };
    }
    return { winner: null, line: [] };
};

const useLocalGame = (jogador1Nome, jogador2Nome) => {
    const [gameState, setGameState] = useState({
        id: 'LOCAL_GAME_ID',
        tabuleiro: Array(9).fill(null),
        turno: 'X',
        jogadores: {
            'X': { nome: jogador1Nome, simbolo: 'X', pontuacao_serie: 0, connection_id: 'LOCAL1' },
            'O': { nome: jogador2Nome, simbolo: 'O', pontuacao_serie: 0, connection_id: 'LOCAL2' }
        },
        rodadaStatus: 'Jogando',
        vencedorSerie: null,
        rodadaNumero: 1,
        linhaVencedora: [],
        propostaNovoJogo: null,
        iniciandoNovoJogo: false,
        jogadorAbandonou: null,
    });

    const handleLocalMove = useCallback((index) => {
        if (gameState.rodadaStatus !== 'Jogando' || gameState.tabuleiro[index] !== null) {
            return;
        }

        const novoTabuleiro = [...gameState.tabuleiro];
        novoTabuleiro[index] = gameState.turno;

        const resultado = checkVictory(novoTabuleiro);

        let novoStatus = 'Jogando';
        let novoTurno = gameState.turno === 'X' ? 'O' : 'X';
        let pontuacaoAtualizada = { ...gameState.jogadores };
        let novaLinhaVencedora = [];
        let novoVencedorSerie = gameState.vencedorSerie;

        if (resultado.winner) {
            novoStatus = 'Fim';
            novaLinhaVencedora = resultado.line;
            if (resultado.winner !== 'Empate') {
                pontuacaoAtualizada[resultado.winner].pontuacao_serie += 1;
            }
            if (pontuacaoAtualizada['X'].pontuacao_serie === 2 || pontuacaoAtualizada['O'].pontuacao_serie === 2) {
                novoVencedorSerie = resultado.winner === 'X' ? jogador1Nome : jogador2Nome;
            }
        }

        setGameState(prev => ({
            ...prev,
            tabuleiro: novoTabuleiro,
            turno: resultado.winner ? prev.turno : novoTurno,
            rodadaStatus: novoStatus,
            vencedorRodada: resultado.winner,
            jogadores: pontuacaoAtualizada,
            vencedorSerie: novoVencedorSerie,
            linhaVencedora: novaLinhaVencedora,
        }));

    }, [gameState, jogador1Nome, jogador2Nome]);

    const handleNewRound = useCallback(() => {
        if (gameState.rodadaStatus === 'Fim' && !gameState.vencedorSerie) {
            setGameState(prev => ({
                ...prev,
                tabuleiro: Array(9).fill(null),
                turno: prev.turno === 'X' ? 'O' : 'X', // Alterna quem começa
                rodadaStatus: 'Jogando',
                rodadaNumero: prev.rodadaNumero + 1,
                linhaVencedora: [],
                propostaNovoJogo: null
            }));
        }
    }, [gameState]);

    const handleNewSeries = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            tabuleiro: Array(9).fill(null),
            turno: 'X',
            rodadaStatus: 'Jogando',
            vencedorSerie: null,
            rodadaNumero: 1,
            linhaVencedora: [],
            propostaNovoJogo: null,
            jogadores: {
                'X': { ...prev.jogadores.X, pontuacao_serie: 0 },
                'O': { ...prev.jogadores.O, pontuacao_serie: 0 }
            }
        }));
    }, []);

    const localSendAction = (action) => {
        if (action.type === 'FAZER_JOGADA') {
            handleLocalMove(action.cell_index);
        } else if (action.type === 'NOVA_RODADA') {
            handleNewRound();
        } else if (action.type === 'PROPOR_NOVO_JOGO') {
            handleNewSeries();
        }
    };

    return { gameState, sendAction: localSendAction };
};

export default useLocalGame;