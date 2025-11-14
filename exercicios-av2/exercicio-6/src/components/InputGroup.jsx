import React from 'react';

const InputGroup = ({ mode, label, values, onChange }) => {
    return (
        <div className="input-group">
            <label>{label}</label>
            <input
                type="number"
                min="0"
                max={mode === 3 ? "23" : undefined}
                value={values.h}
                placeholder="H"
                name="h"
                onChange={(e) => onChange(mode, 'h', e.target.value)}
            />
            <input
                type="number"
                min="0"
                max="59"
                value={values.m}
                placeholder="M"
                name="m"
                onChange={(e) => onChange(mode, 'm', e.target.value)}
            />
            <input
                type="number"
                min="0"
                max="59"
                value={values.s}
                placeholder="S"
                name="s"
                onChange={(e) => onChange(mode, 's', e.target.value)}
            />
        </div>
    );
};

export default InputGroup;