import React, { useState, useEffect, useRef } from 'react';
import { Square, Circle, Triangle, Star, Heart, Spade, Diamond, Club, Sun, CheckCircle, XCircle } from 'lucide-react';

const FIGURES = [Square, Circle, Triangle, Star, Heart, Spade, Diamond, Club, Sun];
const GAME_DURATION_SECONDS = 30;
const API_KEY = "";

const App = () => {
    const [gameState, setGameState] = useState('IDLE');
    const [timer, setTimer] = useState(GAME_DURATION_SECONDS);
    const [winningFigureIndex, setWinningFigureIndex] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [resultText, setResultText] = useState('Branco');
    const [history, setHistory] = useState([]);

    const timerIntervalRef = useRef(null);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    const handleTimeout = () => {
        if (gameState === 'PLAYING') {
            setGameState('OVER');
            setResultText('TIMEOUT');
            setHistory(prev => ['TIMEOUT', ...prev]);
        }
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

            timerIntervalRef.current = setInterval(() => {
                setTimer(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerIntervalRef.current);
                        handleTimeout();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (gameState === 'IDLE' || gameState === 'OVER') {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [gameState]);

    const startGame = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        setTimer(GAME_DURATION_SECONDS);
        setGameState('PLAYING');
        setClickedIndex(null);
        setResultText('EM JOGO');

        const randomIndex = Math.floor(Math.random() * FIGURES.length);
        setWinningFigureIndex(randomIndex);

        console.log(`Nova jogada iniciada. Vencedor (Index): ${randomIndex}`);
    };

    const resetGame = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        setGameState('IDLE');
        setTimer(GAME_DURATION_SECONDS);
        setWinningFigureIndex(null);
        setClickedIndex(null);
        setResultText('Branco');
        setHistory([]);
    };

    const handleFigureClick = (index) => {
        if (gameState !== 'PLAYING') return;

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        setGameState('OVER');
        setClickedIndex(index);

        const hasWon = index === winningFigureIndex;

        if (hasWon) {
            setResultText('1.000.000');
            setHistory(prev => ['GANHOU', ...prev]);
        } else {
            setResultText('0.000.000');
            setHistory(prev => ['PERDEU', ...prev]);
        }
    };

    const getFigureStyle = (index) => {
        let baseStyle = "w-full h-full p-4 flex items-center justify-center border-4 rounded-xl cursor-pointer transition-all duration-300";
        let colorStyle = "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200";

        if (gameState === 'OVER') {
            const isWinner = index === winningFigureIndex;
            const isClicked = index === clickedIndex;
            const isTimeout = clickedIndex === null;

            if (isTimeout) {
                colorStyle = "bg-red-500 border-red-700 text-white shadow-xl";
            } else if (isWinner && isClicked) {
                colorStyle = "bg-green-500 border-green-700 text-white shadow-xl scale-105";
            } else if (!isWinner && isClicked) {
                colorStyle = "bg-red-500 border-red-700 text-white shadow-xl scale-105";
            } else if (!isWinner && !isClicked) {
                colorStyle = "bg-yellow-400 border-yellow-600 text-gray-800 opacity-70";
            } else if (isWinner && !isClicked && !isTimeout) {
                colorStyle = "bg-green-300 border-green-500 text-green-900 shadow-lg opacity-80";
            }
        } else if (gameState === 'PLAYING') {
            colorStyle = "bg-white border-blue-400 text-blue-600 shadow-md hover:bg-blue-50 hover:shadow-lg active:scale-95";
        }

        return `${baseStyle} ${colorStyle}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
                    Jogo da Sorte
                </h1>
                <p className="text-xl text-indigo-500">Teste sua intuição em 30 segundos!</p>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl shadow-xl">
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={startGame}
                            disabled={gameState === 'PLAYING'}
                            className="w-full py-3 px-4 text-white font-bold rounded-xl transition-all duration-200 shadow-lg
                         bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                         active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-green-300"
                        >
                            {gameState === 'PLAYING' ? 'EM JOGO...' : 'JOGAR'}
                        </button>

                        <button
                            onClick={resetGame}
                            className="w-full py-3 px-4 text-indigo-600 font-bold rounded-xl transition-all duration-200 border-2 border-indigo-200
                         bg-white hover:bg-indigo-50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            ZERAR TUDO
                        </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">TIMER</h3>
                            <p className={`text-4xl font-mono mt-1 ${timer <= 5 && gameState === 'PLAYING' ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                                {formatTime(timer)}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">RESULTADO</h3>
                            <p className={`text-3xl font-extrabold mt-1 truncate 
                ${resultText === '1.000.000' ? 'text-green-600' :
                                resultText === '0.000.000' || resultText === 'TIMEOUT' ? 'text-red-600' : 'text-gray-400'}`}
                            >
                                {resultText}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">FIGURAS</h2>
                    <div className="grid grid-cols-3 gap-3 aspect-square max-w-lg mx-auto">
                        {FIGURES.map((Icon, index) => (
                            <div
                                key={index}
                                className={getFigureStyle(index)}
                                onClick={() => handleFigureClick(index)}
                            >
                                <Icon size={70} strokeWidth={2.5} />
                                {gameState === 'OVER' && clickedIndex !== null && index === winningFigureIndex && (
                                    <CheckCircle size={24} className="absolute top-2 right-2 text-green-700 bg-white rounded-full" />
                                )}
                                {gameState === 'OVER' && clickedIndex !== null && index === clickedIndex && index !== winningFigureIndex && (
                                    <XCircle size={24} className="absolute top-2 right-2 text-red-700 bg-white rounded-full" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">HISTÓRICO</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                RESULTADO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                DATA/HORA
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">
                                    Nenhuma jogada registrada. Clique em JOGAR para começar.
                                </td>
                            </tr>
                        ) : (
                            history.map((result, index) => (
                                <tr key={index} className={result === 'GANHOU' ? 'bg-green-50' : result === 'PERDEU' ? 'bg-red-50' : 'bg-yellow-50'}>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${result === 'GANHOU' ? 'text-green-700' : result === 'PERDEU' || result === 'TIMEOUT' ? 'text-red-700' : 'text-gray-900'}`}>
                                        {result}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date().toLocaleTimeString('pt-BR')}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;