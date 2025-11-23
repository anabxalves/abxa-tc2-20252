import React, { useState } from 'react';

import PaginaInicial from './pages/PaginaInicial.jsx';
import PaginaJogo from './pages/PaginaJogo.jsx';

function App() {
    const [playerNames, setPlayerNames] = useState({ nomeJogador1: '', nomeJogador2: '' });
    const [modoJogo, setModoJogo] = useState('');

    const iniciarJogo = (nome1, nome2, modo) => {
        setPlayerNames({ nomeJogador1: nome1, nomeJogador2: nome2 });
        setModoJogo(modo);
    };

    const jogoIniciado = modoJogo !== '';

    return (
        <div className="App">
            {!jogoIniciado ? (
                <PaginaInicial onIniciarJogo={iniciarJogo} />
            ) : (
                <PaginaJogo playerNames={playerNames} modo={modoJogo} />
            )}
        </div>
    );
}

export default App;