import React from 'react';
import Celula from './Celula.jsx';

function Tabuleiro({ tabuleiro, gameId, meuSimbolo, turnoAtual, sendAction, isLocal, celulasVencedoras }) {

    const renderCelulas = (rowIndex) => {
        return [0, 1, 2].map(colIndex => {
            const index = rowIndex * 3 + colIndex;
            return (
                <Celula
                    key={index}
                    index={index}
                    valor={tabuleiro[index]}
                    gameId={gameId}
                    meuSimbolo={meuSimbolo}
                    turnoAtual={turnoAtual}
                    sendAction={sendAction}
                    isLocal={isLocal}
                    celulasVencedoras={celulasVencedoras}
                />
            );
        });
    };

    return (
        <table className="tabuleiro-grid">
            <tbody>
            {[0, 1, 2].map(rowIndex => (
                <tr key={rowIndex}>
                    {renderCelulas(rowIndex)}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Tabuleiro;