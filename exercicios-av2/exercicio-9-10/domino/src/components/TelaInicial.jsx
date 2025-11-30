import React, { useState } from 'react';

function TelaInicial({ onIniciar }) {
    const [maxRodadas, setMaxRodadas] = useState(10);

    const handleIniciar = () => {
        if (maxRodadas > 0) {
            onIniciar(parseInt(maxRodadas));
        } else {
            alert("A quantidade de rodadas deve ser maior que zero.");
        }
    };

    return (
        <div id="tela-inicial" className="tela-ativa">
            <h1>Burrinho Inteligente</h1>
            <div className="card">
                <h2>Configuração do Jogo</h2>
                <label htmlFor="max-rodadas">Quantidade de Rodadas:</label>
                <input
                    type="number"
                    id="max-rodadas"
                    value={maxRodadas}
                    onChange={(e) => setMaxRodadas(e.target.value)}
                    min="1"
                />
                <button id="btn-iniciar" onClick={handleIniciar}>
                    Iniciar Jogo
                </button>
            </div>
        </div>
    );
}

export default TelaInicial;