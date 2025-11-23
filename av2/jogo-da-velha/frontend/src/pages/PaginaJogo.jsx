import React, { useState, useEffect } from 'react';
import { useGameEngine } from '../api/useGameEngine.js';
import CabecalhoPlacar from '../components/CabecalhoPlacar.jsx';
import Tabuleiro from '../components/Tabuleiro.jsx';

function PaginaJogo({ playerNames, modo }) {
    const { gameState, isLoading, error, sendAction, isLocal } = useGameEngine(modo, playerNames);
    const nomeJogadorLocal = playerNames.nomeJogador1;

    const [showBoard, setShowBoard] = useState(true);

    useEffect(() => {
        if (gameState?.rodadaAtual?.status === 'Fim' && showBoard) {
            const timer = setTimeout(() => {
                setShowBoard(false);
            }, 2000);

            return () => clearTimeout(timer);
        }

        if (gameState?.rodadaAtual?.status === 'Jogando' && !showBoard) {
            setShowBoard(true);
        }

    }, [gameState?.rodadaAtual?.status]);

    const handleVoltar = () => {
        if (!isLocal && gameState && gameState.id) {
            sendAction({
                type: "VOLTAR_INICIAL",
                game_id: gameState.id,
                nome: playerNames.nomeJogador1
            });
        }
        window.location.reload();
    };

    const meuSimbolo = gameState?.jogadores.X?.nome === nomeJogadorLocal ? 'X' :
        gameState?.jogadores.O?.nome === nomeJogadorLocal ? 'O' : null;

    if (error) { return <div className="game-error" style={{color: 'var(--color-error-red)'}}>❌ Erro de Conexão: {error}</div>; }

    if (!gameState) {
        if (isLocal) {
            return <div className="game-loading">🛠️ Inicializando Jogo Local...</div>;
        }

        if (isLoading) {
            return <div className="game-loading">🌐 Aguardando um oponente...</div>;
        }

        return <div className="game-error" style={{color: 'var(--color-error-red)'}}>❌ Não foi possível iniciar o jogo online.</div>;
    }

    const oponentePropos = (gameState.propostaNovoJogo && gameState.propostaNovoJogo !== meuSimbolo);
    const oponenteAbandonou = gameState.jogadorAbandonou && gameState.jogadorAbandonou !== nomeJogadorLocal;

    return (
        <div className="pagina-jogo">
            <h1>Rodada {gameState.rodadaAtual.numero || 1}</h1>

            <CabecalhoPlacar
                jogadores={gameState.jogadores}
                turnoAtual={gameState.turnoAtual}
                meuSimbolo={meuSimbolo}
                vencedorSerie={gameState.vencedorSerie}
                showBoard={showBoard}
            />

            {(gameState.rodadaAtual.status === 'Jogando' || showBoard) && !oponenteAbandonou && (
                <Tabuleiro
                    tabuleiro={gameState.rodadaAtual.tabuleiro}
                    gameId={gameState.id}
                    meuSimbolo={meuSimbolo}
                    turnoAtual={gameState.turnoAtual}
                    sendAction={sendAction}
                    isLocal={isLocal}
                    celulasVencedoras={gameState.rodadaAtual.linhaVencedora || []}
                />
            )}

            {((gameState.rodadaAtual.status === 'Fim' && !showBoard) || oponenteAbandonou) && (
                <div className="mensagem-fim" style={{backgroundColor: 'var(--color-bg-secondary)', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
                    {oponenteAbandonou ? (
                        <h3 style={{color: 'var(--color-error-red)'}}>
                            Oponente ({gameState.jogadorAbandonou}) abandonou o Jogo!
                        </h3>
                    ) : (
                        <>
                            <h3>{gameState.vencedorSerie ? 'FIM DA SÉRIE' : 'FIM DA RODADA'}</h3>
                            <p style={{color: gameState.vencedorSerie ? 'var(--color-win-green)' : 'var(--color-text-light)'}}>
                                {gameState.vencedorSerie
                                    ? `🏆Vencedor: ${gameState.vencedorSerie} 🏆`
                                    : `${gameState.rodadaAtual.vencedor === 'Empate' ? 'Resultado da Rodada: Empate' : `Vencedor da Rodada: ${gameState.rodadaAtual.vencedor}`}`
                                }
                            </p>
                        </>
                    )}

                    {(gameState.vencedorSerie || oponenteAbandonou) && (
                        <div className="botoes-pos-jogo">
                            <button
                                onClick={handleVoltar}
                                style={{backgroundColor: 'var(--color-error-red)', marginBottom: '10px'}}
                            >
                                Voltar à Página Inicial
                            </button>

                            {isLocal ? (
                                <button onClick={() => sendAction({ type: "PROPOR_NOVO_JOGO" })} >
                                    Novo Jogo
                                </button>
                            ) : (
                                !oponenteAbandonou && (oponentePropos ? (
                                    <button onClick={() => sendAction({ type: "ACEITAR_NOVO_JOGO", game_id: gameState.id })} /* ... */>
                                        Aceitar Novo Jogo?
                                    </button>
                                ) : (
                                    <button onClick={() => sendAction({ type: "PROPOR_NOVO_JOGO", game_id: gameState.id, simbolo: meuSimbolo })} /* ... */>
                                        Propor Novo Jogo
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {!gameState.vencedorSerie && gameState.rodadaAtual.status === 'Fim' && (
                        <button
                            onClick={() => sendAction({ type: "NOVA_RODADA", game_id: gameState.id })}
                            style={{backgroundColor: 'var(--color-win-green)'}}
                        >
                            Próxima Rodada
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default PaginaJogo;