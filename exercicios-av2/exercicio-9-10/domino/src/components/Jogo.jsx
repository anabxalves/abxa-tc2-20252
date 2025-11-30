import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BurrinhoInteligente } from '../logic/GameLogic';
import PecaVisual from './shared/PecaVisual';

function Jogo({ config, onVoltar }) {
    const gameEngine = useRef(new BurrinhoInteligente());
    const [gameState, setGameState] = useState(gameEngine.current.getCurrentState());
    const [direcao, setDirecao] = useState('fim');

    const atualizarEstado = useCallback(() => {
        setGameState(gameEngine.current.getCurrentState());
    }, []);

    useEffect(() => {
        gameEngine.current.resetarJogo(config.maxRodadas);
        atualizarEstado();
        gameEngine.current.proximaRodada();
    }, [config.maxRodadas, atualizarEstado]);

    useEffect(() => {
        if (!gameState.turnoJogador1 && !gameState.jogoTerminado) {

            const simularTurnoCompleto = async () => {
                gameEngine.current.puxarPeca();

                await new Promise(resolve => setTimeout(resolve, 500));
                atualizarEstado();

                await new Promise(resolve => setTimeout(resolve, 1000));
                gameEngine.current.simularJogada();
                const estadoFinal = gameEngine.current.getCurrentState();
                setGameState(estadoFinal);

                if (estadoFinal.jogoTerminado) {
                    const resultado = gameEngine.current.terminarJogo(estadoFinal.motivo);
                    alert(`${resultado.motivo} ${resultado.resultado}`);
                }
            };

            simularTurnoCompleto();
        }
    }, [gameState.turnoJogador1, gameState.jogoTerminado]);

    const handlePuxarPeca = () => {
        gameEngine.current.puxarPeca();
        atualizarEstado();
    };

    const handleJogarPeca = () => {
        gameEngine.current.jogarPeca(direcao);
        const estadoFinal = gameEngine.current.getCurrentState();
        setGameState(estadoFinal);
        if (estadoFinal.jogoTerminado) {
            const resultado = gameEngine.current.terminarJogo(estadoFinal.motivo);
            alert(`${resultado.motivo} ${resultado.resultado}`);
        }
    };

    const handlePassarAVez = () => {
        gameEngine.current.passarAVez();
        const estadoFinal = gameEngine.current.getCurrentState();
        setGameState(estadoFinal);
        if (estadoFinal.jogoTerminado) {
            const resultado = gameEngine.current.terminarJogo(estadoFinal.motivo);
            alert(`${resultado.motivo} ${resultado.resultado}`);
        }
    };

    const {
        tabuleiro, pecasDisponiveis, jogador1Pontos, jogador2Pontos, pecaAtual,
        turnoJogador1, log, podeEncaixar, jogoTerminado
    } = gameState;

    const placarJ1Class = !jogoTerminado
        ? (turnoJogador1 ? 'jogador-1-turno' : '')
        : (jogador1Pontos > jogador2Pontos ? 'vencedor' : 'perdedor');

    const placarJ2Class = !jogoTerminado
        ? (!turnoJogador1 ? 'jogador-2-turno' : '')
        : (jogador2Pontos > jogador1Pontos ? 'vencedor' : 'perdedor');

    const direcaoRadioDisabled = !turnoJogador1 || !pecaAtual || !podeEncaixar || jogoTerminado;

    return (
        <div id="tela-jogo" className="tela-ativa">
            <h1>Burrinho Inteligente</h1>
            <div className="game-container">

                <div id="board-do-jogo">
                    <div id="tabuleiro">
                        {tabuleiro.map((casa, index) => (
                            <PecaVisual
                                key={index}
                                peca={casa.peca}
                                size="peca"
                                playerClass={casa.isPlayer1 ? 'jogador-1-peca' : 'jogador-2-peca'}
                            />
                        ))}
                    </div>
                    <div className="board-side" id="pecas-restantes">
                        <h3>Peças ({pecasDisponiveis.length})</h3>
                        <div id="pecas-restantes-container">
                            {pecasDisponiveis.map((peca, index) => (
                                <PecaVisual key={index} peca={peca} size="peca-pequena" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="info-area">
                    <div className="jogada-info-container">
                        <div className="jogada-info">
                            <h3>Peça da vez</h3>
                            <div id="peca-da-vez-container" className="peca-container">
                                <PecaVisual
                                    peca={pecaAtual}
                                    size="peca"
                                    playerClass={turnoJogador1 ? 'jogador-1-peca' : 'jogador-2-peca'}
                                />
                            </div>
                        </div>
                        <div className="jogada-info">
                            <h3>Encaixa?</h3>
                            <span id="pode-encaixar">{pecaAtual ? (podeEncaixar ? 'Sim' : 'Não') : ''}</span>
                        </div>
                    </div>

                    <div id="area-de-controle">
                        <div className="radio-group">
                            <label>Direção:</label>
                            <input
                                type="radio"
                                id="direcao-i"
                                name="direcao"
                                value="inicio"
                                checked={direcao === 'inicio'}
                                onChange={(e) => setDirecao(e.target.value)}
                                disabled={direcaoRadioDisabled}
                            />
                            <label htmlFor="direcao-i">Início</label>
                            <input
                                type="radio"
                                id="direcao-f"
                                name="direcao"
                                value="fim"
                                checked={direcao === 'fim'}
                                onChange={(e) => setDirecao(e.target.value)}
                                disabled={direcaoRadioDisabled}
                            />
                            <label htmlFor="direcao-f">Fim</label>
                        </div>

                        <div className="placar-area">
                            <div className={`placar-card ${placarJ1Class}`} id="placar-jogador1">
                                <h3>Jogador</h3>
                                <div className="placar-pontos">{jogador1Pontos}</div>
                            </div>
                            <div className={`placar-card ${placarJ2Class}`} id="placar-jogador2">
                                <h3>Simulador</h3>
                                <div className="placar-pontos">{jogador2Pontos}</div>
                            </div>
                        </div>

                        <div className="botoes-jogada">
                            {turnoJogador1 && !pecaAtual && !jogoTerminado && (
                                <button id="btn-puxar" onClick={handlePuxarPeca}>Puxar Peça</button>
                            )}
                            {turnoJogador1 && pecaAtual && podeEncaixar && !jogoTerminado && (
                                <button id="btn-jogar" onClick={handleJogarPeca}>Jogar Peça</button>
                            )}
                            {turnoJogador1 && pecaAtual && !podeEncaixar && !jogoTerminado && (
                                <button id="btn-passar" onClick={handlePassarAVez}>Passar a vez (-1 ponto)</button>
                            )}
                        </div>
                        {jogoTerminado && <button id="btn-novo-jogo" onClick={onVoltar}>Novo Jogo</button>}
                    </div>
                </div>

                <div id="log-do-jogo">
                    <h2>Log do Jogo</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Rodada</th>
                            <th>Jogador</th>
                            <th>Peça</th>
                            <th>Direção</th>
                            <th>Pontos</th>
                        </tr>
                        </thead>
                        <tbody id="log-table-body">
                        {log.slice().reverse().map((item, index) => (
                            <tr key={index}>
                                <td>{item.rodada}</td>
                                <td>{item.jogador}</td>
                                <td>{item.peca}</td>
                                <td>{item.direcao}</td>
                                <td>{item.pontos}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Jogo;