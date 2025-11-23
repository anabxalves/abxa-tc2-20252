import React from 'react';

function Celula({ index, valor, gameId, meuSimbolo, turnoAtual, sendAction, isLocal, celulasVencedoras }) {
    const isMinhaVez = meuSimbolo === turnoAtual;
    const isJogavel = valor === null && (isLocal || isMinhaVez);
    const isDisabled = valor !== null

    const isVencedora = celulasVencedoras && celulasVencedoras.includes(index);

    const handleClick = () => {
        if (isJogavel) {
            sendAction({
                type: "FAZER_JOGADA",
                game_id: gameId,
                cell_index: index,
                simbolo: turnoAtual
            });
        }
    };

    return (
        <td
            onClick={handleClick}
            style={{ cursor: isDisabled ? 'default' : 'pointer' }}
            className={`${valor ? 'simbolo-animado' : ''} ${isVencedora ? 'celula-vencedora' : ''}`}
        >
            {valor}
        </td>
    );
}

export default Celula;