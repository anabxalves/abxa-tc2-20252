import React, { useState } from 'react';
import TelaInicial from './components/TelaInicial';
import Jogo from './components/Jogo';
import './styles/Domino.css';

function App() {
    const [gameState, setGameState] = useState(null);

    const iniciarNovoJogo = (maxRodadas) => {
        setGameState({ status: 'iniciado', maxRodadas });
    };

    const voltarParaInicio = () => {
        setGameState(null);
    };

    return (
        <div className="app-container">
            {!gameState ? (
                <TelaInicial onIniciar={iniciarNovoJogo} />
            ) : (
                <Jogo config={gameState} onVoltar={voltarParaInicio} />
            )}
        </div>
    );
}

export default App;