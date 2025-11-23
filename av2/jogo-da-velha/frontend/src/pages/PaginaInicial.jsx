import React, { useState } from 'react';

import TicTacToeIcon from "../images/tic-tac-toe.png";

function PaginaInicial({ onIniciarJogo }) {
    const [nomeJogador1, setNomeJogador1] = useState('');
    const [nomeJogador2, setNomeJogador2] = useState('');
    const [modo, setModo] = useState('ONLINE');
    const [isLoading, setIsLoading] = useState(false);

    const isLocal = modo === 'LOCAL';

    const isNome2Obrigatorio = isLocal;

    const formValido = nomeJogador1.trim() && (!isNome2Obrigatorio || nomeJogador2.trim());

    const handleIniciar = (e) => {
        e.preventDefault();

        if (formValido) {
            if (modo === 'ONLINE') {
                setIsLoading(true);
            }

            const nomeOponente = isLocal ? nomeJogador2.trim() : 'Oponente';

            onIniciarJogo(nomeJogador1.trim(), nomeOponente, modo);
        }
    };

    return (
        <div className="pagina-inicial">
            <img className="home-main-icon" src={TicTacToeIcon} alt="TicTacToe" />
            <h1 style={{color: 'var(--color-accent-blue)'}}>Jogo da Velha</h1>

            <form onSubmit={handleIniciar}>
                <div className="seletor-modo" style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '10px' }}>
                    <label style={{ marginRight: '15px' }}>
                        <input
                            type="radio"
                            name="modo"
                            value="ONLINE"
                            checked={modo === 'ONLINE'}
                            onChange={() => setModo('ONLINE')}
                        />
                        Online (Multiplayer)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="modo"
                            value="LOCAL"
                            checked={modo === 'LOCAL'}
                            onChange={() => setModo('LOCAL')}
                        />
                        Local
                    </label>
                </div>

                <input
                    type="text"
                    value={nomeJogador1}
                    onChange={(e) => setNomeJogador1(e.target.value)}
                    placeholder="Insira seu nome"
                    required
                    disabled={isLoading}
                />

                {isLocal && (
                    <input
                        type="text"
                        value={nomeJogador2}
                        onChange={(e) => setNomeJogador2(e.target.value)}
                        placeholder="Insira o nome do Jogador 2"
                        required={isNome2Obrigatorio}
                        disabled={isLoading}
                    />
                )}

                {!isLocal && (
                    <p style={{ color: 'var(--color-line)', fontSize: '0.9em', marginTop: '-10px', marginBottom: '15px' }}>
                        No modo online, o nome do Oponente será definido pelo servidor.
                    </p>
                )}

                <button type="submit" disabled={isLoading || !formValido}>
                    {isLoading ? 'Buscando Jogo...' : `Jogar (${modo === 'LOCAL' ? 'Local' : 'Online'})`}
                </button>
            </form>

            <p style={{marginTop: '20px', color: 'var(--color-line)'}}>
                Ganhe o melhor de três rodadas para ser o Vencedor!
            </p>
        </div>
    );
}

export default PaginaInicial;