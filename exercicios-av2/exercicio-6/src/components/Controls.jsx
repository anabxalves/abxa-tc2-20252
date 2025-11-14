import React from 'react';

const Controls = ({ mode, onStart, onStop, onReset, isRunning, isActive }) => {
    return (
        <div className="controls">
            <button
                className="button-I"
                data-action="start"
                onClick={() => onStart(mode)}
            >
                {isRunning && isActive ? 'I - RESUMIR' : 'I - INÍCIO'}
            </button>
            <button
                className="button-P"
                data-action="stop"
                onClick={() => onStop(mode)}
                disabled={!isRunning || !isActive}
            >
                P - PARADA
            </button>
            <button
                className="button-F"
                data-action="reset"
                onClick={() => onReset(mode)}
                disabled={isRunning && isActive}
            >
                F - FINAL (Reset)
            </button>
        </div>
    );
};

export default Controls;