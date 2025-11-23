import React from 'react';

function CabecalhoPlacar({ jogadores, turnoAtual, meuSimbolo, vencedorSerie, showBoard }) {

    const jogadorX = jogadores.X;
    const jogadorO = jogadores.O;

    const xStyle = jogadorX.simbolo === turnoAtual ? 'jogador-turno' : '';
    const oStyle = jogadorO.simbolo === turnoAtual ? 'jogador-turno' : '';

    return (
        <div className="placar-container">
            <h2>Placar</h2>

            <div className="placar-info">
                <div className={`jogador-box jogador-x ${xStyle}`}>
                    <div className="player-info">
                        <div className="cabecalho-icon">X</div>
                        <span className="simbolo">{jogadorX.nome}</span>
                    </div>
                    <span className="pontuacao">{jogadorX.pontuacao_serie}</span>
                </div>

                <span className="vs">vs</span>

                <div className={`jogador-box jogador-o ${oStyle}`}>
                    <div className="player-info">
                        <div className="cabecalho-icon">O</div>
                        <span className="simbolo">{jogadorO.nome}</span>
                    </div>
                    <span className="pontuacao">{jogadorO.pontuacao_serie}</span>
                </div>
            </div>

            {vencedorSerie ? (
                <h3 className="vencedor-serie">🎉 Vencedor Final: {vencedorSerie} 🎉</h3>
            ) : ( showBoard ?
                <h3 className="turno-atual">
                    <span className={turnoAtual === meuSimbolo ? 'turno-seu' : 'turno-oponente'}>
                        {turnoAtual === meuSimbolo ? 'Sua vez ' : 'Aguarde a jogada do Oponente'} ({turnoAtual})
                    </span>
                </h3> : null
            )}

            <ol className="log-rodadas">
            </ol>
        </div>
    );
}

export default CabecalhoPlacar;