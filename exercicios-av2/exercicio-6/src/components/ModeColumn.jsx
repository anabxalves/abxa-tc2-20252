import React from 'react';
import Controls from './Controls';
import InputGroup from './InputGroup';

const ModeColumn = ({ mode, title, description, currentMode, isRunning, onStart, onStop, onReset, inputValues, onInputChange, inputLabel }) => {
    const isActive = currentMode === mode;

    return (
        <div
            className={`mode-column ${isActive ? 'active-mode' : ''}`}
            id={`column-${mode}`}
            data-mode={mode}
        >
            <h3>{title}</h3>
            {description && <p>{description}</p>}

            {(mode === 2 || mode === 3) && (
                <InputGroup
                    mode={mode}
                    label={inputLabel}
                    values={inputValues}
                    onChange={onInputChange}
                />
            )}

            <Controls
                mode={mode}
                onStart={onStart}
                onStop={onStop}
                onReset={onReset}
                isRunning={isRunning}
                isActive={isActive}
            />
        </div>
    );
};

export default ModeColumn;