import { useState, useEffect, useCallback, useRef } from 'react';

const IP_DO_SERVIDOR = import.meta.env.VITE_BACKEND_HOST || 'localhost';
const WS_URL = `ws://${IP_DO_SERVIDOR}:8000/ws/game/`;

export const useWebSocket = (nomeJogador) => {
    const [gameState, setGameState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const wsRef = useRef(null);

    const sendAction = useCallback((action) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("Ação enviada:", action);
            wsRef.current.send(JSON.stringify(action));
        } else {
            console.error("WebSocket não está pronto para enviar dados.");
        }
    }, []);

    useEffect(() => {
        if (!nomeJogador) return;

        const ws = new WebSocket(`${WS_URL}${encodeURIComponent(nomeJogador)}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log(`Conexão WebSocket estabelecida para: ${nomeJogador}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "WAITING") {
                    console.log(data.message);
                    setIsLoading(true);
                }

                else if (data.id && data.jogadores) {
                    console.log("Novo estado do jogo recebido:", data);
                    setGameState(data);
                    setIsLoading(false);
                }

                else if (data.type === "GAME_ABANDONED") {
                    console.warn("Oponente abandonou:", data.abandoner_name);
                    setGameState(prev => ({
                        ...prev,
                        jogadorAbandonou: data.abandoner_name,
                        rodadaAtual: { ...prev.rodadaAtual, status: 'Fim' }
                    }));
                    setIsLoading(false);
                }

            } catch (err) {
                console.error("Erro ao analisar a mensagem JSON:", err);
            }
        };

        ws.onerror = (err) => {
            console.error("Erro no WebSocket:", err);
            setError("Erro de conexão com o servidor. Verifique se o Backend está rodando.");
            setIsLoading(false);
        };

        ws.onclose = () => {
            console.log("Conexão WebSocket encerrada.");
            setIsLoading(false);
        };

        return () => {
            if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
                console.log("Fechando conexão redundante de cleanup.");
                wsRef.current.close();
            }
        };
    }, [nomeJogador]);

    return { gameState, isLoading, error, sendAction };
};