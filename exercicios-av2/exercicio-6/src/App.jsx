import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatTime, getInputValueMs } from './utils/timerUtils';
import ModeColumn from './components/ModeColumn';
import './timer.css';

const INITIAL_INPUTS = {
    2: { h: 0, m: 1, s: 0 }, // Duração: 00:01:00
    3: {
        h: new Date().getHours(),
        m: new Date().getMinutes() + 1,
        s: 0
    }
};

const App = () => {
    const [currentMode, setCurrentMode] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [totalElapsedTime, setTotalElapsedTime] = useState(0);
    const [inputValues, setInputValues] = useState(INITIAL_INPUTS);

    const timerIntervalRef = useRef(null);
    const startTimeRef = useRef(0);
    const countdownTargetMsRef = useRef(0);

    const stopTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        setIsRunning(false);
    }, []);

    const handleReset = useCallback(() => {
        stopTimer();
        let newElapsedTime = 0;

        if (currentMode === 1) {
            newElapsedTime = 0;
        } else if (currentMode === 2) {
            const { h, m, s } = inputValues[2];
            newElapsedTime = getInputValueMs(2, { h, m, s });
        } else if (currentMode === 3) {
            const { h, m, s } = inputValues[3];
            const targetMs = getInputValueMs(3, { h, m, s });
            newElapsedTime = Math.max(0, targetMs - Date.now());
        }

        setTotalElapsedTime(newElapsedTime);
    }, [currentMode, inputValues, stopTimer]);

    const updateTimer = useCallback(() => {
        const currentTime = Date.now();
        let displayTime = 0;

        if (currentMode === 1) {
            displayTime = currentTime - startTimeRef.current;
        } else if (currentMode === 2) {
            const timePassedSinceStart = currentTime - startTimeRef.current;
            displayTime = countdownTargetMsRef.current - timePassedSinceStart;
        } else if (currentMode === 3) {
            displayTime = countdownTargetMsRef.current - currentTime;
        }

        setTotalElapsedTime(displayTime);

        if (currentMode !== 1 && displayTime <= 0) {
            setTotalElapsedTime(0);
            stopTimer();
        }
    }, [currentMode, stopTimer]);


    const handleStart = useCallback((mode) => {
        if (isRunning && currentMode !== mode) {
            handleReset();
        }

        if (currentMode !== mode) setCurrentMode(mode);
        if (isRunning && currentMode === mode) return;

        let initialValueMs = 0;

        if (mode === 2 || mode === 3) {
            const inputs = inputValues[mode];
            initialValueMs = getInputValueMs(mode, inputs);

            if (mode === 2 && initialValueMs === 0) {
                alert("Defina uma duração (H/M/S) antes de iniciar o Modo 2.");
                return;
            }
        }

        if (mode === 1) {
            startTimeRef.current = Date.now() - totalElapsedTime;
        } else if (mode === 2) {
            countdownTargetMsRef.current = initialValueMs;
            startTimeRef.current = Date.now() - (initialValueMs - totalElapsedTime);
        } else if (mode === 3) {
            countdownTargetMsRef.current = initialValueMs;
        }

        setIsRunning(true);
        timerIntervalRef.current = setInterval(updateTimer, 10);

    }, [currentMode, isRunning, totalElapsedTime, inputValues, updateTimer, handleReset]);


    const handleStop = useCallback((mode) => {
        if (currentMode !== mode || !isRunning) return;
        stopTimer();
    }, [currentMode, isRunning, stopTimer]);

    useEffect(() => {
        handleReset();
    }, [handleReset]);

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    const handleInputChange = (mode, name, value) => {
        setInputValues(prev => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [name]: parseInt(value) || 0
            }
        }));
    };

    return (
        <div className="timer-app-container">
            <div className="display-container">
                <div id="displayLabel">hh:mm:ss:ms</div>
                <div id="timerDisplay">{formatTime(totalElapsedTime)}</div>
            </div>

            <div className="control-panel">
                <ModeColumn
                    mode={1}
                    title="1. PROGRESSIVO"
                    description="Comece do zero e conte para cima."
                    currentMode={currentMode}
                    isRunning={isRunning}
                    onStart={handleStart}
                    onStop={handleStop}
                    onReset={handleReset}
                />
                <ModeColumn
                    mode={2}
                    title="2. REGRESSIVO (DURAÇÃO)"
                    currentMode={currentMode}
                    isRunning={isRunning}
                    onStart={handleStart}
                    onStop={handleStop}
                    onReset={handleReset}
                    inputValues={inputValues[2]}
                    onInputChange={handleInputChange}
                    inputLabel="Duração:"
                />
                <ModeColumn
                    mode={3}
                    title="3. REGRESSIVO (TEMPO FINAL)"
                    currentMode={currentMode}
                    isRunning={isRunning}
                    onStart={handleStart}
                    onStop={handleStop}
                    onReset={handleReset}
                    inputValues={inputValues[3]}
                    onInputChange={handleInputChange}
                    inputLabel="Tempo Final:"
                />
            </div>
        </div>
    );
};

export default App;