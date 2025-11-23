import { useWebSocket } from './useWebSocket.js';
import useLocalGame from './useLocalGame.js';

export const useGameEngine = (modo, playerNames) => {
    if (modo === 'ONLINE') {
        const { gameState, isLoading, error, sendAction } = useWebSocket(playerNames.nomeJogador1);

        return {
            gameState,
            isLoading,
            error,
            sendAction,
            isLocal: false
        };

    } else if (modo === 'LOCAL') {
        const { gameState, sendAction } = useLocalGame(playerNames.nomeJogador1, playerNames.nomeJogador2);

        return {
            gameState: {
                ...gameState,
                rodadaAtual: {
                    tabuleiro: gameState.tabuleiro,
                    vencedor: gameState.vencedorRodada || (gameState.rodadaStatus === 'Fim' ? gameState.turno : null),status: gameState.rodadaStatus,
                    numero: gameState.rodadaNumero,
                    linhaVencedora: gameState.linhaVencedora
                },
                turnoAtual: gameState.turno,
            },
            isLoading: false,
            error: null,
            sendAction: sendAction,
            isLocal: true
        };
    }

    return { gameState: null, isLoading: true, error: null, sendAction: () => {}, isLocal: false };
};